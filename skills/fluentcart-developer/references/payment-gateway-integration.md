# Payment Methods Module

The Payment Methods module is FluentCart's core payment processing system. It provides a flexible architecture for integrating various payment gateways while maintaining a consistent interface for order processing.

---

## Architecture Overview

### Core Components

#### 1. GatewayManager

The central manager for all payment gateways using the Singleton pattern.

```php
use FluentCart\App\Modules\PaymentMethods\Core\GatewayManager;

// Get manager instance
$manager = GatewayManager::getInstance();

// Get specific gateway
$stripe = GatewayManager::gateway('stripe');

// Check if gateway exists
$exists = GatewayManager::has('stripe');
```

#### 2. PaymentGatewayInterface

The interface that all payment gateways must implement.

```php
interface PaymentGatewayInterface
{
    public function has(string $feature): bool;
    public function meta(): array;
    public function makePaymentFromPaymentInstance(PaymentInstance $paymentInstance);
    public function handleIPN();
    public function getOrderInfo(array $data);
    public function fields();
}
```

#### 3. AbstractPaymentGateway

Base class providing common functionality for all gateways.

```php
abstract class AbstractPaymentGateway implements PaymentGatewayInterface
{
    public array $supportedFeatures = [];
    public StoreSettings $storeSettings;
    public ?AbstractSubscriptionModule $subscriptions;
    public BaseGatewaySettings $settings;
}
```

---

## Supported Payment Gateways

### Built-in Gateways

| Gateway | Features | Supported Methods | Location |
|---------|----------|-------------------|----------|
| **Stripe** | Payment, Refund, Webhook, Custom Payment, Card Update, Dispute Handler | Credit Cards, Debit Cards, Digital Wallets | `app/Modules/PaymentMethods/StripeGateway/` |
| **PayPal** | Payment, Refund, Webhook, Subscriptions | PayPal, Credit Cards via PayPal | `app/Modules/PaymentMethods/PayPalGateway/` |
| **Mollie** | Payment, Refund, Webhook | Credit Cards, SEPA, iDEAL, Bancontact | `app/Modules/PaymentMethods/MollieGateway/` |
| **Square** | Payment, Refund, Webhook | Credit Cards, Digital Wallets | `app/Modules/PaymentMethods/SquareGateway/` |
| **Razorpay** | Payment, Refund, Webhook | Credit Cards, UPI, Net Banking, Wallets | `app/Modules/PaymentMethods/RazorpayGateway/` |
| **Paystack** | Payment, Refund, Webhook | Credit Cards, Bank Transfer, Mobile Money | `app/Modules/PaymentMethods/PaystackGateway/` |
| **Authorize.Net** | Payment, Refund, Webhook | Credit Cards, ACH | `app/Modules/PaymentMethods/AuthorizeNetGateway/` |
| **Airwallex** | Payment, Refund, Webhook | Credit Cards, Local Payment Methods | `app/Modules/PaymentMethods/AirwallexGateway/` |
| **Cash on Delivery (COD)** | Payment, Refund | Cash on Delivery | `app/Modules/PaymentMethods/Cod/` |

---

## Gateway Development

### Creating a Custom Payment Gateway

#### 1. Create Gateway Directory Structure

```
app/Modules/PaymentMethods/YourGateway/
├── YourGateway.php              # Main gateway class
├── Settings/
│   └── YourGatewaySettings.php  # Gateway settings
├── API/
│   └── YourGatewayAPI.php       # API communication
├── Webhook/
│   └── WebhookHandler.php       # Webhook processing
├── Views/
│   └── payment-form.php         # Payment form template
└── Assets/
    ├── css/
    ├── js/
    └── images/
```

#### 2. Create Main Gateway Class

```php
<?php
namespace FluentCart\App\Modules\PaymentMethods\YourGateway;

use FluentCart\App\Modules\PaymentMethods\Core\AbstractPaymentGateway;
use FluentCart\App\Services\Payments\PaymentInstance;
use FluentCart\App\Vite;

class YourGateway extends AbstractPaymentGateway
{
    // Define features this gateway supports
    public array $supportedFeatures = [
        'payment',
        'refund',
        'webhook'
    ];

    public function __construct()
    {
        // Initialize with gateway-specific settings
        parent::__construct(new YourGatewaySettings());
    }

    public function meta(): array
    {
        // Return gateway metadata for admin UI and checkout display
        return [
            'title' => __('Your Gateway', 'fluent-cart'),
            'route' => 'your_gateway',
            'slug' => 'your_gateway',
            'description' => __('Accept payments with Your Gateway', 'fluent-cart'),
            'logo' => Vite::getAssetUrl('images/payment-methods/your-gateway-logo.svg'),
            'icon' => Vite::getAssetUrl('images/payment-methods/your-gateway-icon.svg'),
            'brand_color' => '#your-brand-color',
            'status' => $this->settings->get('is_active') === 'yes',
            'upcoming' => false,
            'supported_features' => $this->supportedFeatures
        ];
    }

    public function boot()
    {
        // Initialize webhook handler for incoming payment notifications
        add_action('wp_ajax_your_gateway_webhook', [$this, 'handleWebhook']);
        add_action('wp_ajax_nopriv_your_gateway_webhook', [$this, 'handleWebhook']);
        
        // Register settings filter for admin configuration
        add_filter('fluent_cart/payment_methods/your_gateway_settings', [$this, 'getSettings'], 10, 2);
    }

    public function makePaymentFromPaymentInstance(PaymentInstance $paymentInstance)
    {
        // Extract order and transaction from payment instance
        $order = $paymentInstance->order;
        $transaction = $paymentInstance->transaction;

        // Prepare payment data for gateway API
        $paymentData = [
            'amount' => $transaction->total,
            'currency' => $transaction->currency,
            'order_id' => $order->uuid,
            'customer_email' => $order->email,
            'return_url' => $this->getReturnUrl($transaction),
            'cancel_url' => $this->getCancelUrl($transaction)
        ];

        // Process payment with gateway API
        $result = $this->processPayment($paymentData);

        if ($result['success']) {
            return [
                'success' => true,
                'redirect_url' => $result['redirect_url'],
                'payment_id' => $result['payment_id']
            ];
        }

        return [
            'success' => false,
            'message' => $result['error_message']
        ];
    }

    public function handleIPN()
    {
        // Read and verify incoming webhook data
        $webhookData = $this->getWebhookData();
        
        if (!$this->verifyWebhookSignature($webhookData)) {
            http_response_code(400);
            exit('Invalid signature');
        }

        // Process the verified webhook event
        $this->processWebhook($webhookData);
        
        http_response_code(200);
        exit('OK');
    }

    public function getOrderInfo(array $data)
    {
        // Retrieve order details by UUID
        $orderId = $data['order_id'] ?? '';
        $order = Order::where('uuid', $orderId)->first();
        
        if (!$order) {
            return new \WP_Error('order_not_found', 'Order not found');
        }

        return [
            'order' => $order,
            'total' => $order->total,
            'currency' => $order->currency,
            'status' => $order->status
        ];
    }

    public function fields()
    {
        // Return settings fields for admin configuration page
        return $this->settings->getFields();
    }

    private function processPayment($paymentData)
    {
        // Implement your gateway's payment processing logic
        $api = new YourGatewayAPI($this->settings);
        return $api->createPayment($paymentData);
    }

    private function processWebhook($webhookData)
    {
        // Route webhook event to appropriate handler
        $orderId = $webhookData['order_id'];
        $status = $webhookData['status'];
        
        $order = Order::where('uuid', $orderId)->first();
        
        if ($order) {
            $this->updateOrderStatus($order, $status);
        }
    }
}
```

#### 3. Create Gateway Settings

```php
<?php
namespace FluentCart\App\Modules\PaymentMethods\YourGateway\Settings;

use FluentCart\App\Modules\PaymentMethods\Core\BaseGatewaySettings;

class YourGatewaySettings extends BaseGatewaySettings
{
    public function getFields(): array
    {
        // Define admin settings fields for the gateway configuration page
        return [
            'is_active' => [
                'type' => 'yes_no',
                'label' => __('Enable Your Gateway', 'fluent-cart'),
                'default' => 'no',
                'description' => __('Enable this payment method', 'fluent-cart')
            ],
            'api_key' => [
                'type' => 'text',
                'label' => __('API Key', 'fluent-cart'),
                'required' => true,
                'description' => __('Your gateway API key', 'fluent-cart')
            ],
            'secret_key' => [
                'type' => 'password',
                'label' => __('Secret Key', 'fluent-cart'),
                'required' => true,
                'description' => __('Your gateway secret key', 'fluent-cart')
            ],
            'webhook_secret' => [
                'type' => 'password',
                'label' => __('Webhook Secret', 'fluent-cart'),
                'description' => __('Webhook secret for signature verification', 'fluent-cart')
            ],
            'test_mode' => [
                'type' => 'yes_no',
                'label' => __('Test Mode', 'fluent-cart'),
                'default' => 'yes',
                'description' => __('Enable test mode for development', 'fluent-cart')
            ],
            'debug_mode' => [
                'type' => 'yes_no',
                'label' => __('Debug Mode', 'fluent-cart'),
                'default' => 'no',
                'description' => __('Enable debug logging', 'fluent-cart')
            ]
        ];
    }

    public function getDefaultSettings(): array
    {
        // Default values for all settings fields
        return [
            'is_active' => 'no',
            'api_key' => '',
            'secret_key' => '',
            'webhook_secret' => '',
            'test_mode' => 'yes',
            'debug_mode' => 'no'
        ];
    }
}
```

#### 4. Create API Communication Class

```php
<?php
namespace FluentCart\App\Modules\PaymentMethods\YourGateway\API;

use FluentCart\App\Modules\PaymentMethods\YourGateway\Settings\YourGatewaySettings;

class YourGatewayAPI
{
    private $settings;
    private $baseUrl;
    private $headers;

    public function __construct(YourGatewaySettings $settings)
    {
        $this->settings = $settings;

        // Switch between test and live API endpoints
        $this->baseUrl = $settings->get('test_mode') === 'yes' 
            ? 'https://api-test.yourgateway.com' 
            : 'https://api.yourgateway.com';
        
        // Set authorization and content type headers
        $this->headers = [
            'Authorization' => 'Bearer ' . $settings->get('api_key'),
            'Content-Type' => 'application/json',
            'Accept' => 'application/json'
        ];
    }

    public function createPayment($paymentData)
    {
        // Send payment creation request to gateway API
        $response = wp_remote_post($this->baseUrl . '/payments', [
            'headers' => $this->headers,
            'body' => json_encode($paymentData),
            'timeout' => 30
        ]);

        // Handle WordPress HTTP errors
        if (is_wp_error($response)) {
            return [
                'success' => false,
                'error_message' => $response->get_error_message()
            ];
        }

        // Parse and return gateway response
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if ($data['status'] === 'success') {
            return [
                'success' => true,
                'payment_id' => $data['payment_id'],
                'redirect_url' => $data['redirect_url']
            ];
        }

        return [
            'success' => false,
            'error_message' => $data['error_message']
        ];
    }

    public function getPaymentStatus($paymentId)
    {
        // Query the gateway for current payment status
        $response = wp_remote_get($this->baseUrl . '/payments/' . $paymentId, [
            'headers' => $this->headers,
            'timeout' => 30
        ]);

        if (is_wp_error($response)) {
            return false;
        }

        $body = wp_remote_retrieve_body($response);
        return json_decode($body, true);
    }

    public function refundPayment($paymentId, $amount, $reason = '')
    {
        // Send refund request to gateway API
        $refundData = [
            'amount' => $amount,
            'reason' => $reason
        ];

        $response = wp_remote_post($this->baseUrl . '/payments/' . $paymentId . '/refund', [
            'headers' => $this->headers,
            'body' => json_encode($refundData),
            'timeout' => 30
        ]);

        if (is_wp_error($response)) {
            return false;
        }

        $body = wp_remote_retrieve_body($response);
        return json_decode($body, true);
    }
}
```

#### 5. Create Webhook Handler

```php
<?php
namespace FluentCart\App\Modules\PaymentMethods\YourGateway\Webhook;

use FluentCart\App\Models\Order;
use FluentCart\App\Models\OrderTransaction;
use FluentCart\App\Services\PaymentHelper;

class WebhookHandler
{
    private $settings;

    public function __construct($settings)
    {
        $this->settings = $settings;
    }

    public function handleWebhook()
    {
        // Read incoming webhook payload
        $webhookData = $this->getWebhookData();
        
        // Verify signature before processing
        if (!$this->verifyWebhookSignature($webhookData)) {
            http_response_code(400);
            exit('Invalid signature');
        }

        // Process the verified webhook event
        $this->processWebhook($webhookData);
        
        http_response_code(200);
        exit('OK');
    }

    private function getWebhookData()
    {
        // Read raw POST body from gateway
        $input = file_get_contents('php://input');
        return json_decode($input, true);
    }

    private function verifyWebhookSignature($webhookData)
    {
        // Compare HMAC signature from header with computed signature
        $signature = $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'] ?? '';
        $secret = $this->settings->get('webhook_secret');
        
        $expectedSignature = hash_hmac('sha256', json_encode($webhookData), $secret);
        
        return hash_equals($expectedSignature, $signature);
    }

    private function processWebhook($webhookData)
    {
        // Route event to appropriate handler based on event type
        $eventType = $webhookData['event_type'];
        $paymentId = $webhookData['payment_id'];
        $orderId = $webhookData['order_id'];

        $order = Order::where('uuid', $orderId)->first();
        
        if (!$order) {
            return;
        }

        switch ($eventType) {
            case 'payment.completed':
                $this->handlePaymentCompleted($order, $webhookData);
                break;
                
            case 'payment.failed':
                $this->handlePaymentFailed($order, $webhookData);
                break;
                
            case 'payment.refunded':
                $this->handlePaymentRefunded($order, $webhookData);
                break;
        }
    }

    private function handlePaymentCompleted($order, $webhookData)
    {
        // Mark order as completed and paid
        $order->update([
            'status' => 'completed',
            'payment_status' => 'paid'
        ]);

        // Create transaction record for audit trail
        OrderTransaction::create([
            'order_id' => $order->id,
            'transaction_id' => $webhookData['payment_id'],
            'type' => 'payment',
            'status' => 'completed',
            'amount' => $webhookData['amount'],
            'currency' => $webhookData['currency'],
            'gateway' => 'your_gateway',
            'gateway_response' => json_encode($webhookData)
        ]);

        // Trigger payment success action for other listeners
        do_action('fluent_cart/payment_success', [
            'order' => $order,
            'gateway' => 'your_gateway',
            'transaction_id' => $webhookData['payment_id']
        ]);
    }

    private function handlePaymentFailed($order, $webhookData)
    {
        // Mark order and payment as failed
        $order->update([
            'status' => 'failed',
            'payment_status' => 'failed'
        ]);

        // Trigger payment failed action for error handling listeners
        do_action('fluent_cart/payment_failed', [
            'order' => $order,
            'gateway' => 'your_gateway',
            'error_message' => $webhookData['error_message']
        ]);
    }

    private function handlePaymentRefunded($order, $webhookData)
    {
        // Create refund transaction record
        OrderTransaction::create([
            'order_id' => $order->id,
            'transaction_id' => $webhookData['refund_id'],
            'type' => 'refund',
            'status' => 'completed',
            'amount' => $webhookData['refund_amount'],
            'currency' => $webhookData['currency'],
            'gateway' => 'your_gateway',
            'gateway_response' => json_encode($webhookData)
        ]);

        // Trigger refund action for post-refund processing
        do_action('fluent_cart/payment_refunded', [
            'order' => $order,
            'gateway' => 'your_gateway',
            'refund_id' => $webhookData['refund_id'],
            'refund_amount' => $webhookData['refund_amount']
        ]);
    }
}
```

---

## Gateway Registration

### Register Your Gateway

```php
// In your plugin's main file or module initialization
add_action('fluentcart_loaded', function($app) {
    // Register gateway with the central GatewayManager
    $gatewayManager = \FluentCart\App\Modules\PaymentMethods\Core\GatewayManager::getInstance();
    $gatewayManager->register('your_gateway', new \FluentCart\App\Modules\PaymentMethods\YourGateway\YourGateway());
});
```

### Gateway Configuration

```php
// Get gateway settings
$gateway = GatewayManager::gateway('your_gateway');
$settings = $gateway->settings;

// Check if gateway is enabled
$isEnabled = $gateway->settings->get('is_active') === 'yes';

// Get gateway meta information
$meta = $gateway->meta();
```

---

## Payment Processing Flow

### 1. Payment Initiation

```php
// Create payment instance with order and transaction data
$paymentInstance = new PaymentInstance([
    'order' => $order,
    'transaction' => $transaction,
    'gateway' => 'your_gateway'
]);

// Process payment through the gateway
$gateway = GatewayManager::gateway('your_gateway');
$result = $gateway->makePaymentFromPaymentInstance($paymentInstance);
```

### 2. Payment Response Handling

```php
if ($result['success']) {
    // Redirect customer to payment page
    wp_redirect($result['redirect_url']);
    exit;
} else {
    // Handle payment error and display to customer
    wc_add_notice($result['message'], 'error');
}
```

### 3. Webhook Processing

```php
// Webhook endpoint: /wp-ajax/your_gateway_webhook
public function handleWebhook()
{
    $webhookHandler = new WebhookHandler($this->settings);
    $webhookHandler->handleWebhook();
}
```

---

## Gateway Features

### Supported Features

| Category | Features |
|----------|----------|
| **Payment Processing** | One-time payments, Recurring payments (subscriptions), Payment method storage, Payment method updates |
| **Refund Management** | Full refunds, Partial refunds, Refund status tracking, Refund notifications |
| **Webhook Handling** | Real-time payment notifications, Signature verification, Event processing, Error handling |
| **Security Features** | API key management, Webhook signature verification, Test mode support, Debug logging |

### Feature Implementation

#### Subscription Support

```php
class YourGateway extends AbstractPaymentGateway
{
    public function __construct()
    {
        // Pass subscription module to enable recurring payment support
        parent::__construct(
            new YourGatewaySettings(),
            new YourGatewaySubscriptions() // Add subscription support
        );
    }

    public array $supportedFeatures = [
        'payment',
        'refund',
        'webhook',
        'subscriptions' // Enable subscription feature
    ];
}
```

#### Refund Support

```php
public function processRefund($transaction, $amount, $args = [])
{
    // Send refund request to gateway API
    $api = new YourGatewayAPI($this->settings);
    $result = $api->refundPayment($transaction->transaction_id, $amount);
    
    if ($result['success']) {
        return [
            'success' => true,
            'refund_id' => $result['refund_id']
        ];
    }
    
    return new \WP_Error('refund_failed', $result['error_message']);
}
```

---

## Testing and Debugging

### Test Mode Configuration

```php
// Enable test mode in settings
$settings = [
    'test_mode' => 'yes',
    'debug_mode' => 'yes'
];
```

### Debug Logging

```php
public function logDebug($message, $data = [])
{
    // Only log when debug mode is enabled
    if ($this->settings->get('debug_mode') === 'yes') {
        error_log('YourGateway: ' . $message . ' - ' . json_encode($data));
    }
}
```

### Testing Webhooks

```php
// Test webhook locally using ngrok or similar
$webhookUrl = 'https://your-ngrok-url.ngrok.io/wp-ajax/your_gateway_webhook';

// Send test webhook payload
$testData = [
    'event_type' => 'payment.completed',
    'payment_id' => 'test_payment_123',
    'order_id' => 'test_order_456',
    'amount' => 1000,
    'currency' => 'USD'
];

wp_remote_post($webhookUrl, [
    'body' => json_encode($testData),
    'headers' => [
        'Content-Type' => 'application/json',
        'X-Webhook-Signature' => $this->generateSignature($testData)
    ]
]);
```

---

## Related Documentation

- [Shipping Module](shipping-storage-licensing.md) - Shipping method development
- [Modules Overview](modules-and-extensions-reference.md) - Back to modules overview
- [Database Models](database-models-reference.md) - Data model documentation
- [REST API](rest-api-reference.md) - API endpoints reference
