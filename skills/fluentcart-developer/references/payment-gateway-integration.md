# Custom Payment Gateway Integration

FluentCart allows developers to integrate custom or region-specific payment gateways by extending its payment system.

---

## 1. Registering the Gateway

To register your payment gateway, use the `fluent_cart/register_payment_methods` action and call `fluent_cart_api()->registerCustomPaymentMethod()`:

```php
// In your main plugin file
add_action('fluent_cart/register_payment_methods', function() {
    if (!function_exists('fluent_cart_api')) {
        return; // FluentCart not active
    }

    // Register your custom gateway instance
    fluent_cart_api()->registerCustomPaymentMethod(
        'your_gateway',
        new \YourPlugin\PaymentMethods\YourGateway\YourGateway()
    );
});
```

---

## 2. Implementing Gateway Settings

Your settings class must extend `\FluentCart\App\Modules\PaymentMethods\Core\BaseGatewaySettings`. It handles administrative configuration, API keys, test/live modes, and decryption helper methods.

```php
namespace YourPlugin\PaymentMethods\YourGateway;

use FluentCart\App\Modules\PaymentMethods\Core\BaseGatewaySettings;
use FluentCart\App\Helpers\Helper;

class YourGatewaySettings extends BaseGatewaySettings
{
    // Setting handler key prefix
    public $methodHandler = 'fluent_cart_payment_settings_your_gateway';

    public static function getDefaults()
    {
        return [
            'is_active'       => 'no',
            'payment_mode'    => 'test', // 'test' or 'live'
            'test_api_key'    => '',
            'test_secret_key' => '',
            'live_api_key'    => '',
            'live_secret_key' => '',
        ];
    }

    public function getApiKey()
    {
        $mode = $this->get('payment_mode');
        return $this->get($mode . '_api_key');
    }

    public function getSecretKey()
    {
        $mode = $this->get('payment_mode');
        return Helper::decryptKey($this->get($mode . '_secret_key'));
    }

    public function isTestMode()
    {
        return $this->get('payment_mode') === 'test';
    }
}
```

---

## 3. Implementing the Abstract Payment Gateway Class

Your processor class extends `\FluentCart\App\Modules\PaymentMethods\Core\AbstractPaymentGateway`. It defines supported features (`payment`, `webhook`, `refund`, `subscriptions`), gateway metadata, checkout execution, and webhook handling.

```php
namespace YourPlugin\PaymentMethods\YourGateway;

use FluentCart\App\Modules\PaymentMethods\Core\AbstractPaymentGateway;
use FluentCart\App\Services\Payments\PaymentInstance;
use FluentCart\App\Models\Order;
use FluentCart\App\Models\OrderTransaction;
use FluentCart\App\Helpers\StatusHelper;
use FluentCart\App\Services\Payments\Refund;

class YourGateway extends AbstractPaymentGateway
{
    public array $supportedFeatures = [
        'payment',
        'webhook',
        'refund',
        'subscriptions'
    ];

    public function __construct()
    {
        parent::__construct(new YourGatewaySettings());
    }

    public function meta(): array
    {
        return [
            'title'              => __('Your Gateway', 'your-plugin'),
            'route'              => 'your_gateway',
            'slug'               => 'your_gateway',
            'description'        => __('Accept payments securely with Your Gateway', 'your-plugin'),
            'logo'               => plugin_dir_url(__FILE__) . 'assets/images/logo.svg',
            'status'             => $this->settings->get('is_active') === 'yes',
            'supported_features' => $this->supportedFeatures
        ];
    }

    public function makePaymentFromPaymentInstance(PaymentInstance $paymentInstance)
    {
        $order = $paymentInstance->order;

        return [
            'redirect_to' => 'https://example.com/checkout',
            'status'      => 'success',
            'message'     => __('Redirecting to payment gateway...', 'fluent-cart'),
        ];
    }

    public function refund(Order $order, float $amount, string $reason = ''): array
    {
        return ['status' => 'success', 'refund_id' => 'ref_12345'];
    }
}
```
