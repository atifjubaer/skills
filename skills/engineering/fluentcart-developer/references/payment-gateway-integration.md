# Custom Payment Gateway Integration

FluentCart allows developers to integrate custom or region-specific payment gateways by extending its payment system.

## 1. Registering the Gateway

To register your payment gateway, hook into the `fluent_cart/register_payment_methods` action. Use the `registerCustomPaymentMethod` method of the payment manager.

```php
add_action('fluent_cart/register_payment_methods', function ($paymentManager) {
    // Register the gateway settings class and the main gateway processor class
    $paymentManager->registerCustomPaymentMethod(
        'custom_gateway', // Unique gateway key/ID
        \MyCustomPlugin\Payment\GatewaySettings::class, // Settings class
        \MyCustomPlugin\Payment\GatewayProcessor::class // Processing class
    );
});
```

---

## 2. Implementing Gateway Settings

Your settings class must extend `\FluentCart\App\Services\Payments\BaseGatewaySettings`. It handles the admin configuration panel (e.g., API keys, toggles, test mode).

```php
namespace MyCustomPlugin\Payment;

use FluentCart\App\Services\Payments\BaseGatewaySettings;

class GatewaySettings extends BaseGatewaySettings
{
    /**
     * Define the fields displayed in the admin dashboard settings for this gateway.
     *
     * @return array
     */
    public function getFields(): array
    {
        return [
            'title' => [
                'type' => 'text',
                'label' => __('Gateway Title', 'my-custom-plugin'),
                'default' => __('Custom Card Payment', 'my-custom-plugin'),
            ],
            'test_mode' => [
                'type' => 'checkbox',
                'label' => __('Enable Test Mode', 'my-custom-plugin'),
                'default' => 'yes',
            ],
            'api_key' => [
                'type' => 'text',
                'label' => __('API Key', 'my-custom-plugin'),
                'default' => '',
            ],
            'secret_key' => [
                'type' => 'password',
                'label' => __('Secret Key', 'my-custom-plugin'),
                'default' => '',
            ],
        ];
    }

    /**
     * Retrieve the settings option key stored in the WordPress database.
     *
     * @return string
     */
    public function getOptionKey(): string
    {
        return 'fluent_cart_custom_gateway_settings';
    }
}
```

---

## 3. Implementing the Gateway Processor

Your processor class must extend `\FluentCart\App\Services\Payments\AbstractPaymentGateway`. It handles initiating payments, processing successful outcomes, processing refunds, and handling IPN (instant payment notification) webhooks.

```php
namespace MyCustomPlugin\Payment;

use FluentCart\App\Services\Payments\AbstractPaymentGateway;
use FluentCart\App\Models\Order;

class GatewayProcessor extends AbstractPaymentGateway
{
    /**
     * Initialize/Boot the gateway with necessary credentials from settings.
     *
     * @return void
     */
    public function boot()
    {
        // Load settings values directly via the settings object
        $this->apiKey = $this->settings->get('api_key');
        $this->secretKey = $this->settings->get('secret_key');
        $this->isTestMode = $this->settings->get('test_mode') === 'yes';
    }

    /**
     * Return metadata identifying the gateway.
     *
     * @return array
     */
    public function meta(): array
    {
        return [
            'id' => 'custom_gateway',
            'title' => $this->settings->get('title', 'Custom Card Payment'),
            'description' => __('Pay securely via Custom Gateway', 'my-custom-plugin'),
        ];
    }

    /**
     * Determine if this gateway supports specific features (e.g., refunds, subscriptions).
     *
     * @param string $feature
     * @return bool
     */
    public function supports(string $feature): bool
    {
        $supported = [
            'refunds' => true,
            'subscriptions' => false, // Set to true if recurring billing is implemented
        ];

        return $supported[$feature] ?? false;
    }

    /**
     * Process checkout form submission. Initiates the payment request.
     *
     * @param Order $order The FluentCart order model instance
     * @param array $paymentData Data submitted from checkout frontend
     * @return array Response payload (redirect URL or status)
     */
    public function makePaymentFromPaymentInstance(Order $order, array $paymentData): array
    {
        // Convert the cents order total to decimal for external gateway API call
        $amount = \FluentCart\App\Helpers\Helper::toDecimal($order->total);

        // Prepare request body for your custom payment gateway API
        $payload = [
            'amount' => $amount,
            'currency' => $order->currency,
            'order_id' => $order->id,
            'return_url' => $this->getReturnUrl($order), // Helper method to get completion page URL
            'cancel_url' => $this->getCancelUrl($order), // Helper method to get fallback/error page URL
        ];

        // Call the gateway API endpoint (Mock representation)
        $response = wp_remote_post('https://api.customgateway.com/v1/charge', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ],
            'body' => wp_json_encode($payload),
        ]);

        if (is_wp_error($response)) {
            // Return failure state back to FluentCart checkout handler
            return [
                'status' => 'failed',
                'message' => __('Network error contacting payment processor.', 'my-custom-plugin'),
            ];
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);

        if (empty($body['redirect_url'])) {
            // Return failure state if charge creation fails
            return [
                'status' => 'failed',
                'message' => $body['error_message'] ?? __('Failed to initialize payment.', 'my-custom-plugin'),
            ];
        }

        // Return a redirect status to send user to the hosted checkout page
        return [
            'status' => 'success',
            'action' => 'redirect',
            'redirect_url' => $body['redirect_url'],
        ];
    }

    /**
     * Process refund requests initiated from the FluentCart admin panel.
     *
     * @param Order $order The FluentCart order model instance
     * @param int $amount Amount to refund in cents
     * @param string $reason Reason for refund
     * @return bool|array True on success, array of errors on failure
     */
    public function processRefund(Order $order, int $amount, string $reason = '')
    {
        // Convert cents refund amount to decimal format
        $decimalAmount = \FluentCart\App\Helpers\Helper::toDecimal($amount);

        // Fetch transaction reference stored during webhook processing
        $transactionId = $order->getMeta('transaction_id');

        // Post refund data to gateway API endpoint
        $response = wp_remote_post('https://api.customgateway.com/v1/refunds', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ],
            'body' => wp_json_encode([
                'transaction_id' => $transactionId,
                'amount' => $decimalAmount,
                'reason' => $reason,
            ]),
        ]);

        if (is_wp_error($response)) {
            return [
                'error' => __('Failed to contact refund API.', 'my-custom-plugin'),
            ];
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);

        if (empty($body['refund_id'])) {
            return [
                'error' => $body['error_message'] ?? __('Refund was rejected by gateway.', 'my-custom-plugin'),
            ];
        }

        // Return true to signal successful refund completion
        return true;
    }

    /**
     * Handle webhook IPN (Instant Payment Notification) requests.
     * Hook URL format: website.com/wp-json/fluent-cart/v2/webhooks/custom_gateway
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function handleIPN(\WP_REST_Request $request)
    {
        // Fetch raw webhook body and check security signatures
        $payload = $request->get_json_params();
        $signature = $request->get_header('X-Gateway-Signature');

        if (!$this->verifySignature($payload, $signature)) {
            // Fail early on invalid requests
            return new \WP_REST_Response(['message' => 'Invalid signature'], 400);
        }

        // Extract order ID and gateway transaction ID from payload
        $orderId = $payload['order_id'] ?? null;
        $transactionId = $payload['transaction_id'] ?? null;
        $event = $payload['event'] ?? '';

        // Retrieve order instance using FluentCart database layer
        $order = Order::find($orderId);

        if (!$order) {
            return new \WP_REST_Response(['message' => 'Order not found'], 404);
        }

        // Process status changes based on gateway event type
        if ($event === 'charge.successful') {
            // Save transaction reference as order metadata
            $order->updateMeta('transaction_id', $transactionId);

            // Transition payment status to 'paid' and complete the order
            $order->recordPayment($amountInCents = $order->total, $transactionId);
        } elseif ($event === 'charge.failed') {
            // Mark payment status as failed and mark order as failed
            $order->markAsFailed();
        }

        return new \WP_REST_Response(['status' => 'processed'], 200);
    }

    /**
     * Verify incoming request webhook signature.
     *
     * @param array $payload
     * @param string $signature
     * @return bool
     */
    private function verifySignature(array $payload, string $signature): bool
    {
        // Simple hash check using gateway secret key
        $expected = hash_hmac('sha256', json_encode($payload), $this->secretKey);
        return hash_equals($expected, $signature);
    }
}
```

---

## 4. Paddle Case Study & Admin Fields Schema

For a production-ready implementation reference featuring one-time payments, subscription payments, webhooks, and UI custom fields configuration, see:
- [Paddle Payment Gateway Case Study](paddle-gateway-case-study.md) - Details on composition settings classes, remote API wrappers, adjustment webhooks, and Vite asset managers.

