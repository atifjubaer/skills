# Fee System (Surcharges & Custom Fees)

FluentCart contains a robust fee system allowing developers to apply dynamic or persistent fees (such as credit card processing surcharges, handling fees, shipping insurance, or small order fees) to the checkout cart.

---

## 1. Dynamic Fees via Filter

Dynamic fees are calculated and applied on the fly on every cart totals evaluation. They are not stored permanently in the database and automatically recalculate when cart items change.

Use the `fluent_cart/cart/fees` filter hook.

```php
add_filter('fluent_cart/cart/fees', function (array $fees, array $context): array {
    $cart = $context['cart']; // \FluentCart\App\Models\Cart model instance

    // Example 1: Add a Small Order Surcharge of $5.00 if the subtotal is under $30.00
    $subtotalInCents = $cart->subtotal; // In cents
    if ($subtotalInCents > 0 && $subtotalInCents < 3000) {
        $fees['small_order_surcharge'] = [
            'name'      => __('Small Order Surcharge', 'my-custom-plugin'),
            'amount'    => 500, // Amount MUST be in cents ($5.00)
            'taxable'   => false, // Set to true if this fee is subject to sales tax
            'tax_class' => '', // Standard or customized tax class key
        ];
    }

    // Example 2: Add a credit card processing fee (2.5% of subtotal)
    if ($subtotalInCents > 0) {
        $fees['cc_processing_fee'] = [
            'name'      => __('Payment Processing Fee (2.5%)', 'my-custom-plugin'),
            'amount'    => intval($subtotalInCents * 0.025), // Calculate 2.5% in cents
            'taxable'   => false,
            'tax_class' => '',
        ];
    }

    return $fees;
}, 10, 2);
```

---

## 2. Persistent Fees via Cart Instance

Persistent fees are saved directly to the cart data record in the database. Once added, they remain attached to the cart until explicitly removed, even across page reloads.

### Adding a Persistent Fee

Use the `$cart->addFee()` method:

```php
// Retrieve the current cart instance using FluentCart's global helper
$cart = fluent_cart()->cart;

if ($cart) {
    // Add persistent shipping insurance fee ($2.99)
    $cart->addFee([
        'source'    => 'my_plugin', // Unique namespace/source group
        'key'       => 'shipping_insurance', // Unique fee identifier
        'name'      => __('Shipping Protection & Insurance', 'my-custom-plugin'),
        'amount'    => 299, // Amount in cents ($2.99)
        'taxable'   => false,
        'tax_class' => '',
    ]);
}
```

### Removing a Persistent Fee

Use the `$cart->removeFee()` method:

```php
$cart = fluent_cart()->cart;

if ($cart) {
    // Remove the insurance fee using its namespace and key
    $cart->removeFee('my_plugin', 'shipping_insurance');
}
```

---

## 3. Fee Array Schema Details

Each fee array within FluentCart must adhere to this structured format:

| Key | Type | Description |
|---|---|---|
| `name` | `string` | The display label shown to the user on checkout and invoice receipts. |
| `amount` | `int` | Fee amount in **cents** (e.g., `1000` = `$10.00`). |
| `taxable` | `bool` | True if sales tax calculation should apply to the fee amount. |
| `tax_class` | `string` | The tax class slug to calculate (defaults to empty string for standard). |
