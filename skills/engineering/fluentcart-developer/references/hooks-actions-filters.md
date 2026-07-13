# Action & Filter Hooks Reference

This guide provides a high-level overview of common FluentCart hooks. For an exhaustive catalog of all available action and filter hooks, see:
- [Exhaustive Action Hooks Reference](hooks-actions-reference.md) — Categorized by Orders, Subscriptions, Licenses, Cart, Customers, Products, Payments, Admin templates.
- [Exhaustive Filter Hooks Reference](hooks-filters-reference.md) — Categorized by Settings, Orders, Products, Cart, Customers, Subscriptions, Integrations.

---


## 1. Action Hooks (Events)

Action hooks let you execute custom functions in response to state changes or user interactions.

### Order Lifecycle Actions

#### `fluent_cart/order_status_changed_to_{$status}`
Fires when an order is transitioned to a specific order status. Suffix can be: `completed`, `processing`, `on-hold`, `canceled`, `failed`.
- **Arguments:** `$data` (array: `order`, `old_status`, `new_status`, `manageStock`, `activity`)

```php
add_action('fluent_cart/order_status_changed_to_completed', function (array $data) {
    $order = $data['order']; // \FluentCart\App\Models\Order model instance
    // Perform custom task on order completion (e.g. provision SaaS credits)
    my_plugin_provision_credits($order->customer_id, $order->id);
}, 10, 1);
```

#### `fluent_cart/order_status_changed`
Fires on any order status change.
- **Arguments:** `$data` (array: `order`, `old_status`, `new_status`, `manageStock`, `activity`)

```php
add_action('fluent_cart/order_status_changed', function (array $data) {
    $order = $data['order'];
    // Log all status changes for audit logs
    error_log("Order #{$order->id} status changed from {$data['old_status']} to {$data['new_status']}");
}, 10, 1);
```

### Payment Lifecycle Actions

#### `fluent_cart/payment_status_changed_to_{$status}`
Fires when the payment status transitions. Suffix can be: `pending`, `paid`, `partially_paid`, `failed`, `refunded`, `partially_refunded`.
- **Arguments:** `$data` (array: `order`, `old_status`, `new_status`, `manageStock`, `activity`)

```php
add_action('fluent_cart/payment_status_changed_to_refunded', function (array $data) {
    $order = $data['order'];
    // Revoke license keys on full refund
    my_plugin_revoke_licenses_for_order($order->id);
}, 10, 1);
```

#### `fluent_cart/payment_status_changed`
Fires on any payment status change.
- **Arguments:** `$data` (array: `order`, `old_status`, `new_status`, `manageStock`, `activity`)

### Product Events

#### `fluent_cart/product_created`
Fires immediately after a new catalog product is added.
- **Arguments:** `$product` (`\FluentCart\App\Models\Product`)

```php
add_action('fluent_cart/product_created', function ($product) {
    // Send Slack notification on new product release
    my_plugin_slack_ping("New product created: {$product->title}");
});
```

---

## 2. Filter Hooks (Modifications)

Filter hooks let you intercept, validate, or modify data payloads processed by FluentCart.

### Cart & Checkout Filters

#### `fluent_cart/cart/fees`
Modify the collection of dynamic checkout fees or surcharges.
- **Arguments:** `$fees` (array), `$context` (array containing `$cart` instance)
- **Returns:** `$fees` (array)

```php
add_filter('fluent_cart/cart/fees', function (array $fees, array $context): array {
    $cart = $context['cart'];
    // Apply a handling surcharge if checkout subtotal is small
    if ($cart->subtotal < 1000) { // Under $10.00
        $fees['low_subtotal_charge'] = [
            'name'      => __('Handling Fee', 'my-custom-plugin'),
            'amount'    => 150, // Cents ($1.50)
            'taxable'   => false,
            'tax_class' => '',
        ];
    }
    return $fees;
}, 10, 2);
```

#### `fluent_cart/cart/validate_custom_item`
Verify custom items before they are allowed into the cart.
- **Arguments:** `$validatedData` (array|WP_Error), `$rawData` (array)
- **Returns:** `$validatedData` (array|WP_Error)

```php
add_filter('fluent_cart/cart/validate_custom_item', function ($validatedData, $rawData) {
    if (($rawData['price'] ?? 0) <= 0) {
        return new \WP_Error('invalid_price', __('Free ghost products are disabled.', 'my-custom-plugin'));
    }
    return $validatedData;
}, 10, 2);
```

### Template & Display Filters

#### `fluent_cart/should_load_assets`
Control enqueuing of FluentCart styling and script assets on front-end pages.
- **Arguments:** `$shouldLoad` (bool)
- **Returns:** `bool`

```php
add_filter('fluent_cart/should_load_assets', function (bool $shouldLoad): bool {
    // Disable asset enqueuing on blog post templates
    if (is_singular('post')) {
        return false;
    }
    return $shouldLoad;
});
```
