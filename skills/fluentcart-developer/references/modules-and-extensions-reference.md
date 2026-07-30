# FluentCart Modules, Extensions & Custom Integrations Master Reference

> Source: https://dev.fluentcart.com/

Complete architectural guide for developing custom payment gateways, dynamic shipping carriers, fee surcharges, ghost product selling, subscription management, WP-CLI commands, and theme compatibility for FluentCart.

---

## Table of Contents
1. [Custom Payment Gateway Development](#1-custom-payment-gateway-development)
2. [Dynamic Shipping Carrier Integration](#2-dynamic-shipping-carrier-integration)
3. [Fee Surcharge & Handling Charges System](#3-fee-surcharge--handling-charges-system)
4. [Ghost Product Selling Architecture](#4-ghost-product-selling-architecture)
5. [Subscription Engine Customization](#5-subscription-engine-customization)
6. [Theme Compatibility & Template Overrides](#6-theme-compatibility--template-overrides)
7. [Gutenberg Blocks, Elementor & Page Builders](#7-gutenberg-blocks-elementor--page-builders)
8. [WP-CLI Command Reference](#8-wp-cli-command-reference)

---

## 1. Custom Payment Gateway Development

To implement a new custom payment gateway (e.g. bKash, Nagad, Razorpay, SSLCommerz, Paddle):

### Gateway Registration Filter
```php
add_filter('fluent_cart/payment_methods', function ($methods) {
    $methods['my_custom_gateway'] = \MyExtension\Gateways\CustomGatewayDriver::class;
    return $methods;
});
```

### Driver Implementation Standard
Subclass `\FluentCart\App\Services\Payments\BasePaymentMethod`:

```php
namespace MyExtension\Gateways;

use FluentCart\App\Services\Payments\BasePaymentMethod;
use FluentCart\App\Models\Order;

class CustomGatewayDriver extends BasePaymentMethod
{
    protected $gatewayKey = 'my_custom_gateway';

    public function getTitle()
    {
        return __('Custom Gateway', 'my-extension');
    }

    public function getSettingsFields()
    {
        return [
            'api_key' => [
                'type'        => 'input_text',
                'label'       => __('API Secret Key', 'my-extension'),
                'placeholder' => 'sk_live_...',
            ],
            'sandbox_mode' => [
                'type'        => 'checkbox',
                'label'       => __('Enable Test Mode', 'my-extension'),
            ]
        ];
    }

    public function makePayment($order, $transaction, $cart)
    {
        // 1. Convert amount to cents
        $amountInCents = $order->total_amount;

        // 2. Execute gateway API HTTP POST
        $response = wp_remote_post('https://api.mygateway.com/v1/charge', [
            'headers' => ['Authorization' => 'Bearer ' . $this->getSetting('api_key')],
            'body'    => [
                'amount'   => $amountInCents,
                'currency' => $order->currency,
                'order_id' => $order->id,
            ]
        ]);

        if (is_wp_error($response)) {
            return [
                'status'  => 'failed',
                'message' => $response->get_error_message()
            ];
        }

        return [
            'status'         => 'success',
            'transaction_id' => 'tx_' . time(),
            'redirect_url'   => $order->getReceiptUrl()
        ];
    }
}
```

---

## 2. Dynamic Shipping Carrier Integration

Intercept available shipping rates dynamically via `fluent_cart/shipping_methods`:

```php
add_filter('fluent_cart/shipping_methods', function ($methods, $cart) {
    $shippingAddress = $cart->shipping_address;

    // Call external shipping rate API (e.g. FedEx / DHL)
    $calculatedRateInCents = 1500; // $15.00 in cents

    $methods['custom_express_carrier'] = [
        'id'          => 'custom_express_carrier',
        'title'       => __('Express Courier Shipping (1-2 Days)', 'my-extension'),
        'cost'        => $calculatedRateInCents,
        'tax_status'  => 'taxable',
    ];

    return $methods;
}, 10, 2);
```

---

## 3. Fee Surcharge & Handling Charges System

Inject dynamic fees (e.g. gift wrap, payment processing surcharge, handling fee):

```php
add_filter('fluent_cart/fee_items', function ($fees, $cart) {
    // Add dynamic $5.00 handling fee if subtotal is below $50.00 (5000 cents)
    if ($cart->subtotal < 5000) {
        $fees[] = [
            'id'       => 'small_order_fee',
            'title'    => __('Minimum Order Handling Surcharge', 'my-extension'),
            'amount'   => 500, // $5.00 in cents
            'taxable'  => false,
        ];
    }
    return $fees;
}, 10, 2);
```

---

## 4. Ghost Product Selling Architecture

Ghost products allow selling dynamically configured digital goods, custom service passes, or custom memberships without needing pre-existing WooCommerce / CPT product IDs.

```php
add_filter('fluent_cart/cart_items', function ($items, $cart) {
    // Dynamically append an unlisted ghost product line item to cart
    $items[] = [
        'id'          => 'ghost_item_' . time(),
        'post_id'     => 0, // 0 indicates virtual unlisted product
        'title'       => __('Custom Consultation Session', 'my-extension'),
        'unit_price'  => 4900, // $49.00 in cents
        'quantity'    => 1,
        'is_virtual'  => true,
    ];
    return $items;
}, 10, 2);
```

---

## 5. Subscription Engine Customization

Customize recurring subscription schedules, trial durations, and renewal pricing:

```php
// Dynamic Subscription Renewal Price Modifier
add_filter('fluent_cart/subscription_renewal_price', function ($priceInCents, $subscription) {
    // Apply 10% loyalty renewal discount for long-term active subscribers
    if ($subscription->bill_count >= 12) {
        return (int) round($priceInCents * 0.90);
    }
    return $priceInCents;
}, 10, 2);
```

---

## 6. Theme Compatibility & Template Overrides

### Template Hierarchy & Path Resolution
FluentCart checks for template overrides in your active theme root:
`your-theme/fluentcart/checkout.php`
`your-theme/fluentcart/receipt.php`
`your-theme/fluentcart/single-product.php`

### Disabling Global Theme Styles Conflicts
```php
add_filter('fluent_cart/disable_default_theme_styles', '__return_true');
```

---

## 7. Gutenberg Blocks, Elementor & Page Builders

### Shortcodes Catalog
- **Product Catalog Grid:** `[fluent_cart_products category="digital" limit="12"]`
- **Single Product Card:** `[fluent_cart_product id="101"]`
- **Checkout Form:** `[fluent_cart_checkout]`
- **Customer Account Portal:** `[fluent_cart_customer_portal]`
- **Order Receipt Confirmation:** `[fluent_cart_receipt]`

---

## 8. WP-CLI Command Reference

FluentCart includes native WP-CLI commands for database migrations, cache purging, and sync tasks:

```bash
# Flush FluentCart store cache
wp fluentcart cache flush

# Run pending database schema migrations
wp fluentcart db migrate

# Sync customer order counts & lifetime spend metrics
wp fluentcart customer recalculate-metrics

# Clear expired checkout cart sessions
wp fluentcart cart cleanup
```
