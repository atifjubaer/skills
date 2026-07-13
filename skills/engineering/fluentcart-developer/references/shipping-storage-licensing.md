# Shipping, Storage, Licensing & Order Bump Modules

This developer reference details the implementation APIs, custom drivers registration, and core models for FluentCart's shipping calculations, secure digital file storage, Pro software licensing, and Pro checkout upselling (Order Bumps).

---

## 1. Shipping Module Architecture

### Shipping Database Models

| Class Name | Target Database Table | Description |
|---|---|---|
| `\FluentCart\App\Models\ShippingZone` | `{$wpdb->prefix}fc_shipping_zones` | Geographic delivery zones. |
| `\FluentCart\App\Models\ShippingMethod` | `{$wpdb->prefix}fc_shipping_methods` | Pricing methods linked to a zone. |
| `\FluentCart\App\Models\ShippingClass` | `{$wpdb->prefix}fc_shipping_classes` | Product classifications with extra shipping rates. |

---

### Custom Shipping Method Registration

To register custom shipping carriers (e.g. dynamic FedEx/DHL rates), implement your rate-calculator class and filter the method types.

```php
// In your custom plugin setup file
add_action('fluentcart_loaded', function () {
    // Register custom shipping carrier driver settings and calculator
    add_filter('fluent_cart/shipping/method_types', function (array $types): array {
        $types['custom_express_carrier'] = [
            'title'    => __('Custom Express Carrier', 'my-custom-plugin'),
            'class'    => \MyCustomPlugin\Shipping\ExpressCarrierCalculator::class,
            'settings' => [
                'base_fee' => [
                    'type'    => 'number',
                    'label'   => __('Base Handling Fee (Cents)', 'my-custom-plugin'),
                    'default' => 500, // Default $5.00 handling
                ],
            ],
        ];
        return $types;
    });
});
```

### Implementing the Rate Calculator Class

```php
namespace MyCustomPlugin\Shipping;

use FluentCart\App\Models\ShippingMethod;
use FluentCart\App\Models\Cart;

class ExpressCarrierCalculator
{
    protected $method;

    public function __construct(ShippingMethod $method)
    {
        $this->method = $method;
    }

    /**
     * Calculate custom shipping rate.
     *
     * @param Cart $cart Current checkout cart instance
     * @param array $address Destination shipping address fields
     * @return int Calculated shipping fee in cents
     */
    public function calculateRate(Cart $cart, array $address): int
    {
        $baseFee = intval($this->method->settings['base_fee'] ?? 500);

        // Fetch total weight of physical items in the cart
        $weight = $cart->getTotalWeight(); // Weight value in kg/lbs

        // Apply a weight surcharge of $1.50 per kg
        $weightSurcharge = intval($weight * 150);

        // Return combined total cents
        return $baseFee + $weightSurcharge;
    }

    /**
     * Determine if this shipping method is available for selection.
     *
     * @param Cart $cart
     * @param array $address
     * @return bool
     */
    public function isAvailable(Cart $cart, array $address): bool
    {
        // Require delivery country to be United States only
        $country = $address['country'] ?? '';
        return $country === 'US';
    }
}
```

---

## 2. Storage Drivers Module (Digital Downloads)

FluentCart handles downloadable digital product delivery using storage driver abstractions.

### Creating a Custom Storage Driver
Extend `\FluentCart\App\Modules\StorageDrivers\BaseStorageDriver`.

```php
namespace MyCustomPlugin\Storage;

use FluentCart\App\Modules\StorageDrivers\BaseStorageDriver;

class CustomCloudDriver extends BaseStorageDriver
{
    public function __construct()
    {
        parent::__construct(
            __('Custom Cloud', 'my-custom-plugin'),
            'custom_cloud_driver', // Unique driver slug
            '#ef4444' // Brand highlight color
        );
    }

    public function getDescription(): string
    {
        return __('Stores files securely in custom cloud storage.', 'my-custom-plugin');
    }

    /**
     * Define the backend settings forms fields displayed in store setup.
     *
     * @return array
     */
    public function fields(): array
    {
        return [
            'access_key' => [
                'type'    => 'text',
                'label'   => __('Access Key ID', 'my-custom-plugin'),
                'default' => '',
            ],
            'secret_key' => [
                'type'    => 'password',
                'label'   => __('Secret Access Key', 'my-custom-plugin'),
                'default' => '',
            ],
        ];
    }

    public function hiddenSettingKeys(): array
    {
        return ['secret_key'];
    }

    public function isEnabled(): bool
    {
        // Check if settings are configured
        return !empty($this->getSettings()['access_key']);
    }

    public function getLogo()
    {
        return '<svg>...</svg>'; // SVG icon markup
    }
}
```

---

## 3. Licensing Module API (Pro Feature)

The licensing system allows developers to activate, validate, and track software licenses.

### Model Attributes (`\FluentCartPro\App\Modules\Licensing\Models\License`)
- `license_key` (string): Unique generated key.
- `status` (string): `active`, `inactive`, `expired`, `disabled`.
- `limit` (int): Maximum activation count.
- `activation_count` (int): Active activations count.
- `expiration_date` (datetime): Validity timestamp.

### Programmatic License Management

```php
use FluentCartPro\App\Modules\Licensing\Models\License;

// Retrieve license record
$license = License::where('license_key', 'LIC-XXXX-XXXX')->first();

if ($license) {
    // Check if the software license has expired
    if ($license->isExpired()) {
        $license->status = 'expired';
        $license->save();
    }

    // Register a new website domain activation manually
    if ($license->activation_count < $license->limit) {
        $license->activation_count += 1;
        $license->save(); // Persists changes
    }
}
```

---

## 4. Order Bump & Upsells (Pro Feature)

Order Bumps display upsells on the checkout page to increase Average Order Value (AOV).

### Model Schema (`\FluentCartPro\App\Modules\Promotional\Models\OrderPromotion`)
- `title` (string): Banner heading text.
- `description` (string): Upsell sales description text.
- `product_id` (int): CPT product ID to add.
- `discount_type` (string): `percentage` / `fixed`.
- `discount_value` (int): Value to subtract.

### Programmatically Creating an Order Bump

```php
use FluentCartPro\App\Modules\Promotional\Models\OrderPromotion;

// Insert a new conditional checkout order bump
$promo = OrderPromotion::create([
    'title'          => __('Add Priority Support', 'my-custom-plugin'),
    'description'    => __('Skip the line and get answers within 1 hour.', 'my-custom-plugin'),
    'type'           => 'order_bump', // Promotion slug type
    'status'         => 'active',
    'src_object_id'  => 99, // Variation product ID of priority support product
    'src_object_type'=> 'product',
    'priority'       => 10,
    'conditions'     => [
        'minimum_cart_total' => 3000, // Only trigger if cart total is over $30.00 (in cents)
    ],
    'config'         => [
        'display_position' => 'after_order_notes', // Checkout position hook slug
        'discount_type'    => 'fixed',
        'discount_value'   => 500, // Give $5.00 discount on support (in cents)
    ],
]);
```
