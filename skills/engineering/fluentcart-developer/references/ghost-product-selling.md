# Ghost Product Selling (Non-Catalog Items)

Ghost product selling allows you to sell custom, dynamically-priced, or non-catalog items on-the-fly without defining them first in the FluentCart products database.

---

## 1. Frontend Checkout Trigger

To add a custom item to the cart, the frontend action button must specify parameters indicating it is custom, along with details like title, price, and subscription terms if applicable.

```html
<!-- Trigger checkout directly with a dynamically-defined product -->
<button 
    class="fluent-cart-checkout-btn" 
    data-is-custom="yes" 
    data-cart-id="ghost_service_99" 
    data-title="Custom Consulting Session" 
    data-price="150.00" 
    data-quantity="1"
    data-payment_type="one_time"
>
    Buy Custom Session
</button>
```

If redirecting to a checkout link, append query variables:
```
https://mystore.com/checkout/?is_custom=true&cart_id=ghost_service_99&price=150.00&title=Custom+Consulting+Session
```

---

## 2. Cart Hook: Add to Cart & Validation

When a custom item is queued, FluentCart fires `fluent_cart/cart/validate_custom_item` to parse the payload, perform security validations, and assign values. Returning a `WP_Error` prevents adding the item.

```php
add_filter('fluent_cart/cart/validate_custom_item', function ($validatedData, $rawData) {
    // Check if the custom item target identifier is present
    $cartId = $rawData['cart_id'] ?? '';
    if (strpos($cartId, 'ghost_service_') !== 0) {
        return $validatedData; // Skip if it doesn't match our custom pattern
    }

    // Perform security and price validation (e.g. check signature or database)
    $expectedPrice = 15000; // Price in cents ($150.00)
    $passedPriceInCents = intval(($rawData['price'] ?? 0) * 100);

    if ($passedPriceInCents !== $expectedPrice) {
        return new \WP_Error(
            'invalid_price', 
            __('The price provided for this custom item is incorrect.', 'my-custom-plugin')
        );
    }

    // Set the normalized data array that FluentCart expects
    return [
        'id'           => $cartId,
        'title'        => sanitize_text_field($rawData['title']),
        'price'        => $expectedPrice, // Price MUST be stored in cents (integer)
        'quantity'     => max(1, intval($rawData['quantity'] ?? 1)),
        'payment_type' => 'one_time', // Supported: 'one_time' or 'subscription'
        'other_info'   => [
            // Store additional metadata or subscription terms here
            'custom_service_type' => 'consulting',
        ]
    ];
}, 10, 2);
```

---

## 3. Cart Hook: Quantity Changes

If the user changes the quantity of a custom item in the cart or checkout page, hook into `fluent_cart/cart/custom_item_quantity_changed` to validate or override the new quantity.

```php
add_filter('fluent_cart/cart/custom_item_quantity_changed', function ($validatedItem, $context) {
    $cartItem = $context['cart_item']; // Existing item from cart
    $newQty = $context['new_quantity'];

    if (strpos($cartItem['id'], 'ghost_service_') === 0) {
        // Enforce maximum quantity of 5 for custom consulting sessions
        if ($newQty > 5) {
            $validatedItem['quantity'] = 5;
        } else {
            $validatedItem['quantity'] = $newQty;
        }
    }

    return $validatedItem;
}, 10, 2);
```

---

## 4. Payment Hook: Final Checkout Validation

Just before the customer executes the payment, FluentCart runs the `fluent_cart/payment/validate_custom_item` filter to let you do a final validation check (e.g., check inventory or user permissions).

```php
add_filter('fluent_cart/payment/validate_custom_item', function ($validatedItem, $orderItemData) {
    if (strpos($orderItemData['id'], 'ghost_service_') === 0) {
        // Retrieve current user and verify they are eligible
        $userId = get_current_user_id();
        if (!$userId) {
            return new \WP_Error(
                'auth_required',
                __('You must be logged in to purchase custom services.', 'my-custom-plugin')
            );
        }
    }

    return $validatedItem;
}, 10, 2);
```

---

## 5. Order Hook: Admin Modifications

When an administrator edits the order (changing status, manual pricing adjustments, or adding items), hook into `fluent_cart/order/custom_item_changed` to update custom order attributes.

```php
add_action('fluent_cart/order/custom_item_changed', function ($itemData) {
    $orderItem = $itemData['order_item']; // \FluentCart\App\Models\OrderItem model instance
    $order = $itemData['order']; // \FluentCart\App\Models\Order model instance

    if (strpos($orderItem->product_id, 'ghost_service_') === 0) {
        // Perform post-modification hooks (e.g. notify consultant of change)
        my_custom_plugin_log_change($order->id, $orderItem->title);
    }
});
```
