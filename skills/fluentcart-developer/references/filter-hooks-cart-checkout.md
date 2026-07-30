# Filter Hooks: Cart & Checkout

All filters related to the shopping flow from Cart to checkout.

---

## Cart Items & Validation

### `cart/item_modify`
`fluent_cart/cart/item_modify` — Modify cart item variation before adding

* **When it runs:** Applied when a product variation is being added to the cart or when an existing cart item is updated. Allows you to modify the variation object before processing, or return `null` to block the item.
* **Source:** `api/Resource/FrontendResource/CartResource.php` (lines 44, 307)

#### Parameters:
* `$variation` *(\FluentCart\App\Models\ProductVariation|null)* — The product variation model instance
* `$data` *(array)* — Context data (`['item_id' => 42, 'quantity' => 1]`)
* **Returns:** *(\FluentCart\App\Models\ProductVariation|null)* — The modified variation, or `null` to prevent adding

#### Usage Example:
```php
// Filter product variation before adding to cart or updating quantity
add_filter('fluent_cart/cart/item_modify', function ($variation, $data) {
    if (!$variation) {
        return $variation;
    }

    // Block a specific variation ID from being added to cart
    if ($variation->id === 99) {
        return null;
    }

    return $variation;
}, 10, 2);
```

---

### `item_max_quantity`
`fluent_cart/item_max_quantity` — Limit the maximum quantity for a cart item

* **When it runs:** Applied immediately after the variation is resolved, before adding to cart. Allows capping or adjusting the requested quantity.
* **Source:** `api/Resource/FrontendResource/CartResource.php` (line 54)

#### Parameters:
* `$quantity` *(int)* — The requested quantity
* `$data` *(array)* — Context data (`['variation' => ProductVariation, 'product' => Product]`)
* **Returns:** *(int)* — The (possibly capped) quantity

#### Usage Example:
```php
// Filter maximum allowed purchase quantity for a cart item
add_filter('fluent_cart/item_max_quantity', function ($quantity, $data) {
    // Extract variation model from context
    $variation = $data['variation'];

    // Limit subscription products to maximum quantity of 1
    if ($variation->payment_type === 'subscription') {
        return 1;
    }

    // Cap all item quantities at maximum of 10
    return min($quantity, 10);
}, 10, 2);
```

---

### `cart/custom_item_quantity_changed`
`fluent_cart/cart/custom_item_quantity_changed` — Handle custom item quantity changes

* **When it runs:** Fires when the quantity of a custom (externally-managed) item already in the cart is changed. Recalculates pricing or validates quantity.
* **Source:** `api/Resource/FrontendResource/CartResource.php` (line 269)

#### Parameters:
* `$existingItem` *(object)* — The existing cart item object
* `$data` *(array)* — Context data (`['old_quantity' => 2, 'new_quantity' => 3, 'is_custom' => true]`)
* **Returns:** *(object)* — The modified item object with updated quantity and totals

#### Usage Example:
```php
// Filter quantity change for custom externally-managed cart item
add_filter('fluent_cart/cart/custom_item_quantity_changed', function ($variation, $data) {
    if (empty($data['is_custom'])) {
        return $variation;
    }

    // Recalculate line total based on new quantity input
    $variation->quantity = $data['new_quantity'];
    $variation->line_total = $variation->price * $data['new_quantity'];

    return $variation;
}, 10, 2);
```

---

### `cart/validate_custom_item`
`fluent_cart/cart/validate_custom_item` — Validate a custom or externally-managed cart item

* **When it runs:** Fires when a custom (non-FluentCart) item is being added to the cart. Used to validate and construct the item object stored in the cart.
* **Source:** `api/Resource/FrontendResource/CartResource.php` (line 289), `app/Http/Routes/WebRoutes.php` (line 99)

#### Parameters:
* `$existingItem` *(object|null)* — The existing item object, or `null` for new items
* `$data` *(array)* — Context data (`['item_id' => string, 'quantity' => int, 'is_custom' => true]`)
* **Returns:** *(object)* — A variation-like object with required cart item properties

#### Usage Example:
```php
// Validate and construct custom item object for cart
add_filter('fluent_cart/cart/validate_custom_item', function ($variation, $data) {
    if (!(bool) $data['is_custom']) {
        return $variation;
    }

    // Build custom item object with required cart item properties
    return (object) [
        'item_id'      => absint($data['item_id']),
        'object_id'    => absint($data['item_id']),
        'title'        => 'Custom Product',
        'price'        => 2500, // $25.00 in cents
        'quantity'     => (int) $data['quantity'],
        'payment_type' => 'one_time',
        'is_custom'    => true,
    ];
}, 10, 2);
```

---

### `cart_item_product_variation`
`fluent_cart/cart_item_product_variation` — Provide a fallback product variation for a cart item

* **When it runs:** Fires when a product variation cannot be found in the database during cart operations. Serves as fallback mechanism.
* **Source:** `api/Resource/FrontendResource/CartResource.php` (line 631)

#### Parameters:
* `$productVariation` *(\FluentCart\App\Models\ProductVariation|null)* — Always `null` at this point
* `$itemId` *(int)* — The variation/item ID being looked up
* `$incrementBy` *(int)* — The quantity increment value
* `$existingItemsArray` *(array)* — The current cart items array
* **Returns:** *(\FluentCart\App\Models\ProductVariation|null)* — A variation model instance, or `null`

#### Usage Example:
```php
// Provide fallback product variation when variation is not found in DB
add_filter('fluent_cart/cart_item_product_variation', function ($variation, $itemId, $incrementBy, $existingItems) {
    if (!$variation && $itemId > 10000) {
        // Resolve variation object from external service
        return MyExternalService::getVariation($itemId);
    }
    return $variation;
}, 10, 4);
```

---

### `cart/can_purchase`
`fluent_cart/cart/can_purchase` — Determine whether a variation can be added to the cart

* **When it runs:** Fires after the built-in `canPurchase()` check on the variation model, inside `Cart::addItem()`.
* **Source:** `app/Models/Cart.php` (line 333)

#### Parameters:
* `$canPurchase` *(true|\WP_Error)* — Result of built-in purchase validation
* `$data` *(array)* — Context data (`['cart' => Cart, 'variation' => ProductVariation, 'quantity' => int]`)
* **Returns:** *(true|\WP_Error)* — Return `true` to allow purchase, or `WP_Error` to block

#### Usage Example:
```php
// Filter whether product variation can be added to cart
add_filter('fluent_cart/cart/can_purchase', function ($canPurchase, $data) {
    if (is_wp_error($canPurchase)) {
        return $canPurchase;
    }

    $cart = $data['cart'];
    $variation = $data['variation'];

    // Limit cart to maximum of 5 unique items
    $existingItems = $cart->getItems();
    if (count($existingItems) >= 5 && !isset($existingItems[$variation->id])) {
        return new \WP_Error(
            'cart_limit',
            __('You can only have up to 5 different items in your cart.', 'fluent-cart')
        );
    }

    return true;
}, 10, 2);
```

---

### `cart/estimated_total`
`fluent_cart/cart/estimated_total` — Filter the cart estimated total

* **When it runs:** Applied when calculating cart estimated total in `Cart::getEstimatedTotal()` and web checkout handler.
* **Source:** `app/Models/Cart.php` (line 766), `app/Hooks/Cart/WebCheckoutHandler.php` (line 358)

#### Parameters:
* `$total` *(int)* — The cart total in cents
* `$data` *(array)* — Context data (`['cart' => Cart]`)
* **Returns:** *(int)* — The modified cart total in cents

#### Usage Example:
```php
// Filter cart estimated total calculation amount
add_filter('fluent_cart/cart/estimated_total', function ($total, $data) {
    // Extract cart model instance from context
    $cart = $data['cart'];

    // Add flat processing fee of $2.00 in cents
    $processingFee = 200;
    return $total + $processingFee;
}, 10, 2);
```

---

### `cart_cookie_minutes`
`fluent_cart/cart_cookie_minutes` — Control cart cookie expiration time

* **When it runs:** Fires when setting the cart hash cookie. The default value is a Unix timestamp (time() + 30 days).
* **Source:** `api/Cookie/Cookie.php` (line 22)

#### Parameters:
* `$expireTime` *(int)* — Unix timestamp for cookie expiration
* **Returns:** *(int)* — The Unix timestamp when cookie expires

#### Usage Example:
```php
// Filter cart cookie expiration Unix timestamp
add_filter('fluent_cart/cart_cookie_minutes', function ($expireTime) {
    // Set cart cookie expiration to 7 days from now
    return time() + (7 * DAY_IN_SECONDS);
});
```

---

### `variation/can_purchase_bundle`
`fluent_cart/variation/can_purchase_bundle` — Validate whether a bundle product can be purchased

* **When it runs:** Fires during `canPurchase()` on a `ProductVariation` when product is a bundle.
* **Source:** `app/Models/ProductVariation.php` (line 265)

#### Parameters:
* `$result` *(null)* — Always `null` initially
* `$data` *(array)* — Context data (`['variation' => ProductVariation, 'quantity' => int]`)
* **Returns:** *(null|true|false|\WP_Error)* — `null`/`true` to allow, `false` for generic error, `WP_Error` to block with custom message

#### Usage Example:
```php
// Validate stock for bundled child items during bundle purchase
add_filter('fluent_cart/variation/can_purchase_bundle', function ($result, $data) {
    $variation = $data['variation'];
    $quantity = (int) $data['quantity'];

    // Iterate through bundle children to verify sufficient stock
    $children = $variation->bundleChildren()->get();
    foreach ($children as $child) {
        if ($child->available < ($child->pivot->quantity * $quantity)) {
            return new \WP_Error(
                'bundle_stock',
                sprintf(__('%s does not have enough stock.', 'fluent-cart'), $child->title)
            );
        }
    }

    return $result;
}, 10, 2);
```

---

## Checkout Validation

### `checkout/validate_before_process`
`fluent_cart/checkout/validate_before_process` — Pre-validate the checkout before processing

* **When it runs:** Fires early in `placeOrder()` flow before field or product validation. First chance to reject checkout attempt.
* **Source:** `api/Checkout/CheckoutApi.php` (line 83)

#### Parameters:
* `$validation` *(true)* — Always `true` initially
* `$data` *(array)* — Full checkout submission data (billing address, payment method, form fields, etc.)
* **Returns:** *(true|\WP_Error)* — `true` to continue, `WP_Error` to abort checkout

#### Usage Example:
```php
// Pre-validate checkout submission before processing order
add_filter('fluent_cart/checkout/validate_before_process', function ($validation, $data) {
    // Query cart model instance using submitted cart hash
    $cart = \FluentCart\App\Models\Cart::query()
        ->where('cart_hash', $data['cart_hash'])
        ->first();

    // Enforce minimum order total requirement of $5.00
    if ($cart && $cart->getEstimatedTotal() < 500) {
        return new \WP_Error(
            'min_order',
            __('Minimum order amount is $5.00.', 'fluent-cart')
        );
    }

    return $validation;
}, 10, 2);
```

---

### `cart/tax_behavior`
`fluent_cart/cart/tax_behavior` — Filter tax behavior amount for the cart

* **When it runs:** Fires during order creation in `CheckoutApi::placeOrder()`. Determines tax behavior value for order total.
* **Source:** `api/Checkout/CheckoutApi.php` (line 171)

#### Parameters:
* `$behavior` *(int)* — Default tax behavior value (`0`)
* `$data` *(array)* — Context data (`['cart' => Cart]`)
* **Returns:** *(int)* — Tax behavior value (`0` for exclusive, `1` for inclusive)

#### Usage Example:
```php
// Filter tax behavior value for cart order total calculation
add_filter('fluent_cart/cart/tax_behavior', function ($behavior, $data) {
    $cart = $data['cart'];

    // Force tax-inclusive behavior for specific European countries
    $country = $cart->checkout_data['billing_address']['country'] ?? '';
    if (in_array($country, ['DE', 'FR', 'GB'])) {
        return 1; // Tax-inclusive
    }

    return $behavior;
}, 10, 2);
```

---

### `checkout/validate_data`
`fluent_cart/checkout/validate_data` — Add or modify checkout validation errors

* **When it runs:** Fires after core field, shipping, and terms validation has run, before order creation.
* **Source:** `api/Checkout/CheckoutApi.php` (line 890)

#### Parameters:
* `$errors` *(array)* — Associative array of validation errors keyed by field name
* `$data` *(array)* — Context data (`['data' => submittedData, 'cart' => Cart]`)
* **Returns:** *(array)* — Modified errors array (empty array means validation passes)

#### Usage Example:
```php
// Append custom field validation errors to checkout submission
add_filter('fluent_cart/checkout/validate_data', function ($errors, $data) {
    $formData = $data['data'];

    // Require billing phone number for physical products requiring shipping
    $cart = $data['cart'];
    if ($cart->requireShipping() && empty($formData['billing_address']['phone'])) {
        $errors['billing_phone'] = [
            'required' => __('Phone number is required for physical products.', 'fluent-cart'),
        ];
    }

    return $errors;
}, 10, 2);
```

---

## Checkout Page Rendering

### `checkout_page_css_classes`
`fluent_cart/checkout_page_css_classes` — Modify checkout page CSS classes

* **When it runs:** Fires when rendering the checkout page container wrapper element.
* **Source:** `app/Services/Renderer/CheckoutRenderer.php` (line 144)

#### Parameters:
* `$classNames` *(array)* — Array of CSS class strings
* `$data` *(array)* — Context data (`['cart' => Cart]`)
* **Returns:** *(array)* — Modified array of CSS class strings

#### Usage Example:
```php
// Filter checkout page wrapper container CSS classes
add_filter('fluent_cart/checkout_page_css_classes', function ($classes, $data) {
    $cart = $data['cart'];

    // Add custom class when cart contains subscription items
    if ($cart->hasSubscription()) {
        $classes[] = 'has-subscription-items';
    }

    return $classes;
}, 10, 2);
```

---

### `checkout_page_notices`
`fluent_cart/checkout_page_notices` — Add custom notices to checkout page

* **When it runs:** Fires during checkout page rendering to inject notices displayed at the top of checkout form.
* **Source:** `app/Services/Renderer/CheckoutRenderer.php` (line 170)

#### Parameters:
* `$notices` *(array)* — Array of notice items (empty by default)
* `$data` *(array)* — Context data (`['cart' => Cart]`)
* **Returns:** *(array)* — Array of notice items to display

#### Usage Example:
```php
// Inject custom notice messages onto top of checkout page
add_filter('fluent_cart/checkout_page_notices', function ($notices, $data) {
    $cart = $data['cart'];

    // Display free shipping qualification threshold notice
    $total = $cart->getEstimatedTotal();
    if ($total < 5000 && $cart->requireShipping()) {
        $notices[] = [
            'type'    => 'info',
            'message' => sprintf(
                __('Add %s more to qualify for free shipping!', 'fluent-cart'),
                '$' . number_format((5000 - $total) / 100, 2)
            ),
        ];
    }

    return $notices;
}, 10, 2);
```

---

### `checkout_renderer/billing_fields`
`fluent_cart/checkout_renderer/billing_fields` — Modify rendered billing fields on checkout page

* **When it runs:** Fires after billing address fields have been assembled and rearranged in checkout renderer.
* **Source:** `app/Services/Renderer/CheckoutRenderer.php` (line 448)

#### Parameters:
* `$billingFields` *(array)* — Array of billing field definitions with rendered state
* `$data` *(array)* — Context data (`['checkout_renderer' => renderer, 'cart' => Cart]`)
* **Returns:** *(array)* — Modified billing fields array

#### Usage Example:
```php
// Filter rendered billing field schema definitions on checkout page
add_filter('fluent_cart/checkout_renderer/billing_fields', function ($fields, $data) {
    // Remove company field from rendered billing fields schema
    foreach ($fields as $sectionKey => &$section) {
        if (isset($section['schema']) && is_array($section['schema'])) {
            unset($section['schema']['billing_company']);
        }
    }

    return $fields;
}, 10, 2);
```

---

### `checkout_renderer/shipping_fields`
`fluent_cart/checkout_renderer/shipping_fields` — Modify rendered shipping fields on checkout page

* **When it runs:** Fires after shipping address fields have been assembled and validated in checkout renderer.
* **Source:** `app/Services/Renderer/CheckoutRenderer.php` (line 521)

#### Parameters:
* `$shippingFields` *(array)* — Array of shipping field definitions
* `$data` *(array)* — Context data (`['checkout_renderer' => renderer, 'cart' => Cart]`)
* **Returns:** *(array)* — Modified shipping fields array

#### Usage Example:
```php
// Filter rendered shipping field schema definitions on checkout page
add_filter('fluent_cart/checkout_renderer/shipping_fields', function ($fields, $data) {
    // Mark shipping address line 2 as a required field
    foreach ($fields as &$field) {
        if (isset($field['name']) && $field['name'] === 'shipping_address_2') {
            $field['required'] = 'yes';
        }
    }

    return $fields;
}, 10, 2);
```

---

### `disable_order_notes_for_digital_products`
`fluent_cart/disable_order_notes_for_digital_products` — Control order notes visibility for digital products

* **When it runs:** Fires when checkout renderer decides whether to show order notes textarea.
* **Source:** `app/Services/Renderer/CheckoutRenderer.php` (line 560)

#### Parameters:
* `$disable` *(bool)* — Whether to hide order notes for digital-only carts (default: `true`)
* `$data` *(array)* — Context data (`['cart' => Cart]`)
* **Returns:** *(bool)* — `true` to hide order notes for digital products, `false` to show

#### Usage Example:
```php
// Filter order notes textarea visibility for digital-only carts
add_filter('fluent_cart/disable_order_notes_for_digital_products', function ($disable, $data) {
    // Always render order notes field even for digital products
    return false;
}, 10, 2);
```

---

### `checkout_active_payment_methods`
`fluent_cart/checkout_active_payment_methods` — Filter active payment methods on checkout page

* **When it runs:** Fires when listing available payment methods on standard and modal checkout renderers.
* **Source:** `app/Services/Renderer/CheckoutRenderer.php` (line 652), `app/Services/Renderer/ModalCheckoutRenderer.php` (line 450)

#### Parameters:
* `$activePaymentMethods` *(array)* — Array of payment method instances
* `$data` *(array)* — Context data (`['cart' => Cart]`)
* **Returns:** *(array)* — Modified array of payment method instances

#### Usage Example:
```php
// Filter active payment method gateway instances on checkout page
add_filter('fluent_cart/checkout_active_payment_methods', function ($methods, $data) {
    $cart = $data['cart'];

    // Exclude Cash on Delivery payment option for orders over $500
    if ($cart->getEstimatedTotal() > 50000) {
        $methods = array_filter($methods, function ($method) {
            return $method->getMeta('route') !== 'cod';
        });
    }

    return array_values($methods);
}, 10, 2);
```

---

### `checkout_page_order_button_text`
`fluent_cart/checkout_page_order_button_text` — Customize place order button text

* **When it runs:** Fires when checkout submit button is being rendered to change its label.
* **Source:** `app/Services/Renderer/CheckoutRenderer.php` (line 705)

#### Parameters:
* `$text` *(string)* — Button text (default: `'Place order'`)
* **Returns:** *(string)* — Modified button text

#### Usage Example:
```php
// Customize place order submit button text on checkout page
add_filter('fluent_cart/checkout_page_order_button_text', function ($text) {
    // Change Place Order button label to Complete Purchase
    return __('Complete Purchase', 'fluent-cart');
});
```

---

### `payment_method_list_class`
`fluent_cart_payment_method_list_class` — Add CSS classes to a payment method wrapper

* **When it runs:** Fires when rendering each payment method option in standard and modal checkout. Note legacy prefix (`fluent_cart_`).
* **Source:** `app/Services/Renderer/CheckoutRenderer.php` (line 797), `app/Services/Renderer/ModalCheckoutRenderer.php` (line 569)

#### Parameters:
* `$class` *(string)* — CSS class string (default: `''`)
* `$data` *(array)* — Context data (`['route' => string, 'method_title' => string, 'method_style' => string]`)
* **Returns:** *(string)* — Modified CSS class string

#### Usage Example:
```php
// Filter CSS class string for payment method container wrapper (legacy prefix)
add_filter('fluent_cart_payment_method_list_class', function ($class, $data) {
    // Add highlight class for Cash on Delivery payment option
    if ($data['route'] === 'cod') {
        return $class . ' payment-method-highlighted';
    }
    return $class;
}, 10, 2);
```

---

### `modal_checkout/filter_active_payment_methods`
`fluent_cart/modal_checkout/filter_active_payment_methods` — Restrict payment methods in modal checkout

* **When it runs:** Fires during modal checkout rendering after active payment methods are resolved.
* **Source:** `app/Services/Renderer/ModalCheckoutRenderer.php` (line 455)

#### Parameters:
* `$selectedMethods` *(array)* — Empty array by default
* **Returns:** *(array)* — Array of payment method route slugs to show (`['stripe', 'paypal']`)

#### Usage Example:
```php
// Filter active payment method route slugs shown in modal checkout
add_filter('fluent_cart/modal_checkout/filter_active_payment_methods', function ($methods) {
    // Restrict modal checkout to show only Stripe payment method
    return ['stripe'];
});
```

---

### `enable_modal_checkout`
`fluent_cart/enable_modal_checkout` — Enable or disable modal checkout

* **When it runs:** Fires when checking whether modal popup checkout is enabled (default: `false`).
* **Source:** `app/Helpers/Helper.php` (line 1710)

#### Parameters:
* `$enabled` *(bool)* — Whether modal checkout is enabled (default: `false`)
* **Returns:** *(bool)* — `true` to enable modal checkout, `false` for standard page

#### Usage Example:
```php
// Filter whether modal popup checkout mode is enabled
add_filter('fluent_cart/enable_modal_checkout', function ($enabled) {
    // Enable modal checkout feature
    return true;
});
```

---

## Checkout Data & Session

### `checkout/checkout_data_changed`
`fluent_cart/checkout/checkout_data_changed` — Modify checkout data after a change is detected

* **When it runs:** Fires after checkout session data is saved to modify response data returned to browser.
* **Source:** `app/Hooks/Cart/WebCheckoutHandler.php` (lines 495, 1115)

#### Parameters:
* `$checkoutData` *(array)* — Checkout change response data (`message`, `fragments`, `estimated_total`, etc.)
* `$data` *(array)* — Context data (`['cart' => Cart]`)
* **Returns:** *(array)* — Modified checkout response data

#### Usage Example:
```php
// Filter response data payload returned after checkout session data change
add_filter('fluent_cart/checkout/checkout_data_changed', function ($checkoutData, $data) {
    // Append custom notice string to checkout change response payload
    $checkoutData['custom_notice'] = __('Your order qualifies for a bonus!', 'fluent-cart');
    return $checkoutData;
}, 10, 2);
```

---

### `checkout/cart_updated`
`fluent_cart/checkout/cart_updated` — Filter the cart update response data

* **When it runs:** Fires when cart is updated during checkout session (e.g. items added or removed).
* **Source:** `app/Hooks/Cart/WebCheckoutHandler.php` (line 683)

#### Parameters:
* `$data` *(array)* — Response data (`['cart' => Cart]`)
* **Returns:** *(array)* — Modified response data array

#### Usage Example:
```php
// Filter cart update response payload during checkout session
add_filter('fluent_cart/checkout/cart_updated', function ($data) {
    // Append item count and free shipping eligibility flags
    $cart = $data['cart'];
    $data['item_count'] = count($cart->getItems());
    $data['free_shipping_eligible'] = $cart->getEstimatedTotal() >= 5000;
    return $data;
});
```

---

### `checkout/before_patch_checkout_data`
`fluent_cart/checkout/before_patch_checkout_data` — Modify fill data before patching checkout session

* **When it runs:** Fires before checkout session data is persisted to database.
* **Source:** `app/Hooks/Cart/WebCheckoutHandler.php` (lines 791, 967)

#### Parameters:
* `$fillData` *(array)* — Data to merge into cart checkout session (`checkout_data`, `cart_data`, `hook_changes`)
* `$data` *(array)* — Context data (`['cart' => Cart, 'prev_data' => array, 'changes' => array, 'all_data' => array]`)
* **Returns:** *(array)* — Modified fill data

#### Usage Example:
```php
// Filter fill data merged into checkout session before persisting to DB
add_filter('fluent_cart/checkout/before_patch_checkout_data', function ($fillData, $data) {
    $cart = $data['cart'];
    $changes = $data['changes'];

    // Recalculate custom surcharge when billing country changes
    if (isset($changes['billing_country'])) {
        $surcharge = MyModule::calculateSurcharge($changes['billing_country']);
        $fillData['checkout_data']['custom_surcharge'] = $surcharge;
        $fillData['hook_changes']['custom'] = true;
    }

    return $fillData;
}, 10, 2);
```

---

### `checkout/after_patch_checkout_data_fragments`
`fluent_cart/checkout/after_patch_checkout_data_fragments` — Modify HTML fragments returned after patching checkout data

* **When it runs:** Fires after checkout session is patched and HTML fragments for AJAX response are generated.
* **Source:** `app/Hooks/Cart/WebCheckoutHandler.php` (line 901)

#### Parameters:
* `$fragments` *(array)* — Associative array of HTML fragment selectors and content
* `$data` *(array)* — Context data (`['cart' => Cart, 'changes' => array]`)
* **Returns:** *(array)* — Modified fragments array

#### Usage Example:
```php
// Filter HTML response fragments swapped into checkout page via AJAX
add_filter('fluent_cart/checkout/after_patch_checkout_data_fragments', function ($fragments, $data) {
    // Extract cart model instance
    $cart = $data['cart'];

    // Inject custom surcharge display HTML fragment selector
    $fragments['.custom-surcharge-display'] = [
        'content' => '<span class="custom-surcharge">' . esc_html('$5.00') . '</span>',
        'type'    => 'replace',
    ];

    return $fragments;
}, 10, 2);
```

---

### `apply_order_bump`
`fluent_cart/apply_order_bump` — Handle order bump application on checkout page

* **When it runs:** Fires when customer toggles order bump on checkout page.
* **Source:** `app/Hooks/Cart/WebCheckoutHandler.php` (line 1144)

#### Parameters:
* `$response` *(\WP_Error)* — Default error response
* `$data` *(array)* — Context data (`['bump_id' => int, 'cart' => Cart, 'request_data' => array]`)
* **Returns:** *(array|\WP_Error)* — Return array with success data to apply bump, or `WP_Error` to reject

#### Usage Example:
```php
// Handle order bump application request on checkout page
add_filter('fluent_cart/apply_order_bump', function ($response, $data) {
    $bumpId = $data['bump_id'];
    $cart = $data['cart'];

    // Look up order bump definition model
    $bump = MyOrderBumpModule::find($bumpId);
    if (!$bump) {
        return $response;
    }

    // Add bump variation item to cart
    $cart->addItem($bump->variation_id, 1);

    return [
        'message' => __('Order bump applied!', 'fluent-cart'),
        'cart'    => $cart,
    ];
}, 10, 2);
```

---

## Checkout Field Schema

### `checkout_address_fields`
`fluent_cart/checkout_address_fields` — Modify address field definitions

* **When it runs:** Fires when address field schema is built in `CartCheckoutHelper`. Controls fields in billing/shipping address sections.
* **Source:** `app/Helpers/CartCheckoutHelper.php` (line 692)

#### Parameters:
* `$fields` *(array)* — Associative array of address field definitions
* **Returns:** *(array)* — Modified fields array

#### Usage Example:
```php
// Modify address field definitions for both billing and shipping
add_filter('fluent_cart/checkout_address_fields', function ($fields) {
    // Add custom company name address field definition
    $fields['company'] = [
        'label'    => __('Company Name', 'fluent-cart'),
        'type'     => 'text',
        'required' => false,
    ];

    return $fields;
});
```

---

### `checkout_billing_fields`
`fluent_cart/checkout_billing_fields` — Modify billing address field schema

* **When it runs:** Fires when billing fields are being assembled in `CartCheckoutHelper`.
* **Source:** `app/Helpers/CartCheckoutHelper.php` (line 730)

#### Parameters:
* `$fields` *(array)* — Billing field definitions organized in sections
* `$data` *(array)* — Context data (`['viewData' => array, 'customer' => Customer, 'labels' => array, 'has_subscription' => bool]`)
* **Returns:** *(array)* — Modified billing fields array

#### Usage Example:
```php
// Modify billing address section field schema definitions
add_filter('fluent_cart/checkout_billing_fields', function ($fields, $data) {
    // Enforce required phone field for subscription carts
    if ($data['has_subscription']) {
        if (isset($fields['address_section']['schema']['billing_phone'])) {
            $fields['address_section']['schema']['billing_phone']['required'] = 'yes';
        }
    }

    return $fields;
}, 10, 2);
```

---

### `checkout_shipping_fields`
`fluent_cart/checkout_shipping_fields` — Modify shipping address field schema

* **When it runs:** Fires when shipping address fields are assembled in `CartCheckoutHelper`.
* **Source:** `app/Helpers/CartCheckoutHelper.php` (line 771)

#### Parameters:
* `$fields` *(array)* — Shipping field definitions organized in sections
* `$data` *(array)* — Context data (`['viewData' => array, 'labels' => array]`)
* **Returns:** *(array)* — Modified shipping fields array

#### Usage Example:
```php
// Modify shipping address section field schema definitions
add_filter('fluent_cart/checkout_shipping_fields', function ($fields, $data) {
    // Remove shipping address line 2 field from schema
    if (isset($fields['address_section']['schema']['shipping_address_2'])) {
        unset($fields['address_section']['schema']['shipping_address_2']);
    }

    return $fields;
}, 10, 2);
```

---

### `checkout_signup_fields`
`fluent_cart/checkout_signup_fields` — Modify account signup form fields

* **When it runs:** Fires when guest checkout signup form fields (username, email, password) are assembled.
* **Source:** `app/Helpers/CartCheckoutHelper.php` (line 846)

#### Parameters:
* `$fields` *(array)* — Associative array of signup field definitions (`user_login`, `user_pass`)
* **Returns:** *(array)* — Modified signup fields array

#### Usage Example:
```php
// Modify guest checkout registration signup form field schema
add_filter('fluent_cart/checkout_signup_fields', function ($fields) {
    // Enforce required password field during signup
    if (isset($fields['user_pass'])) {
        $fields['user_pass']['required'] = 'yes';
    }

    return $fields;
});
```

---

### `checkout_login_fields`
`fluent_cart/checkout_login_fields` — Modify checkout login form fields

* **When it runs:** Fires when login form fields (username, password) are assembled for checkout page.
* **Source:** `app/Helpers/CartCheckoutHelper.php` (line 872)

#### Parameters:
* `$fields` *(array)* — Associative array of login field definitions (`user_login`, `user_pass`)
* **Returns:** *(array)* — Modified login fields array

#### Usage Example:
```php
// Modify returning customer login form field schema on checkout
add_filter('fluent_cart/checkout_login_fields', function ($fields) {
    // Update username field label and placeholder text
    if (isset($fields['user_login'])) {
        $fields['user_login']['label'] = __('Email Address', 'fluent-cart');
        $fields['user_login']['placeholder'] = __('Enter your email', 'fluent-cart');
    }

    return $fields;
});
```

---

### `checkout_coupon_fields`
`fluent_cart/checkout_coupon_fields` — Modify coupon input fields

* **When it runs:** Fires when coupon code input fields are assembled for checkout page.
* **Source:** `app/Helpers/CartCheckoutHelper.php` (line 925)

#### Parameters:
* `$fields` *(array)* — Associative array of coupon field definitions
* **Returns:** *(array)* — Modified coupon fields array

#### Usage Example:
```php
// Modify coupon input form fields schema on checkout page
add_filter('fluent_cart/checkout_coupon_fields', function ($fields) {
    // Customize coupon code input field placeholder string
    if (isset($fields['coupon_code'])) {
        $fields['coupon_code']['placeholder'] = __('Got a discount code?', 'fluent-cart');
    }

    return $fields;
});
```

---

### `checkout_page_name_fields_schema`
`fluent_cart/checkout_page_name_fields_schema` — Modify name fields on checkout page

* **When it runs:** Fires when checkout name fields schema (first name, last name, email, company) is being built.
* **Source:** `app/Services/Renderer/CheckoutFieldsSchema.php` (line 86)

#### Parameters:
* `$nameFields` *(array)* — Associative array of name/email field definitions
* `$data` *(array)* — Context data (`['cart' => Cart, 'scope' => 'billing'|'shipping']`)
* **Returns:** *(array)* — Modified name fields array

#### Usage Example:
```php
// Modify checkout page name and email fields schema
add_filter('fluent_cart/checkout_page_name_fields_schema', function ($fields, $data) {
    // Pre-fill email field for logged-in user
    if ($userId = get_current_user_id()) {
        $user = get_userdata($userId);
        if (!empty($fields['billing_email']) && empty($fields['billing_email']['value'])) {
            $fields['billing_email']['value'] = $user->user_email;
        }
    }

    return $fields;
}, 10, 2);
```

---

### `fields/address_base_fields`
`fluent_cart/fields/address_base_fields` — Modify base address field definitions

* **When it runs:** Fires when low-level address field definitions are assembled in `CheckoutFieldsSchema`.
* **Source:** `app/Services/Renderer/CheckoutFieldsSchema.php` (line 320)

#### Parameters:
* `$fields` *(array)* — Array of base address field definitions
* `$data` *(array)* — Context data (`['config' => array, 'scope' => 'billing'|'shipping', 'requirements' => array]`)
* **Returns:** *(array)* — Modified base address fields array

#### Usage Example:
```php
// Modify low-level base address field definitions
add_filter('fluent_cart/fields/address_base_fields', function ($fields, $data) {
    // Make billing city field optional
    if ($data['scope'] === 'billing') {
        foreach ($fields as &$field) {
            if (isset($field['name']) && $field['name'] === 'billing_city') {
                unset($field['required']);
            }
        }
    }

    return $fields;
}, 10, 2);
```

---

### `default_billing_country_for_checkout`
`fluent_cart/default_billing_country_for_checkout` — Set default billing country

* **When it runs:** Fires when determining default billing country for checkout form. Default uses Cloudflare IP geo-detection.
* **Source:** `app/Helpers/AddressHelper.php` (line 639)

#### Parameters:
* `$countryCode` *(string)* — Detected country code (ISO 3166-1 alpha-2)
* **Returns:** *(string)* — Valid ISO 3166-1 alpha-2 country code

#### Usage Example:
```php
// Filter default billing country code for checkout form
add_filter('fluent_cart/default_billing_country_for_checkout', function ($countryCode) {
    // Default to US if geo-detection yields empty country code
    if (empty($countryCode)) {
        return 'US';
    }

    return $countryCode;
});
```

---

## Checkout Localization

### `checkout/localize_data`
`fluent_cart/checkout/localize_data` — Modify checkout JavaScript localized data

* **When it runs:** Fires when checkout page assets are enqueued to pass data to JS via `wp_localize_script()`.
* **Source:** `app/Modules/Templating/AssetLoader.php` (line 497)

#### Parameters:
* `$data` *(array)* — Localized data array (`fluentcart_checkout_vars`)
* `$cart` *(\FluentCart\App\Models\Cart)* — Cart model instance
* **Returns:** *(array)* — Modified localized data array

#### Usage Example:
```php
// Modify localized data passed to checkout JavaScript frontend
add_filter('fluent_cart/checkout/localize_data', function ($data, $cart) {
    // Add custom module config payload to checkout JS variables
    $data['fluentcart_checkout_vars']['my_module'] = [
        'enabled'  => true,
        'endpoint' => rest_url('my-module/v1/validate'),
    ];

    return $data;
}, 10, 2);
```

---

### `payment_methods_with_custom_checkout_buttons`
`fluent_cart/payment_methods_with_custom_checkout_buttons` — Register payment methods with custom buttons

* **When it runs:** Fires when building checkout localized data to identify gateways rendering custom submit buttons (e.g. PayPal smart buttons).
* **Source:** `app/Modules/Templating/AssetLoader.php` (line 465)

#### Parameters:
* `$methods` *(array)* — Array of payment method route slugs with custom buttons (default: `[]`)
* **Returns:** *(array)* — Modified array of payment method route slugs

#### Usage Example:
```php
// Register payment gateway route slugs that render custom buttons
add_filter('fluent_cart/payment_methods_with_custom_checkout_buttons', function ($methods) {
    // Append custom payment gateway route slug to list
    $methods[] = 'my_custom_gateway';
    return $methods;
});
```

---

### `instant_checkout/allowed_redirect_hosts`
`fluent_cart/instant_checkout/allowed_redirect_hosts` — Control allowed redirect hosts for instant checkout

* **When it runs:** Fires during instant URL checkout when `redirect_to` parameter is provided.
* **Source:** `app/Http/Routes/WebRoutes.php` (line 155)

#### Parameters:
* `$allowedHosts` *(array)* — Array of allowed hostnames (default: current site host)
* `$data` *(array)* — Context data (`['allowed_hosts' => array]`)
* **Returns:** *(array)* — Array of allowed redirect hostnames

#### Usage Example:
```php
// Filter allowed redirect hostnames for instant URL checkout
add_filter('fluent_cart/instant_checkout/allowed_redirect_hosts', function ($hosts) {
    // Allow instant checkout redirects to subdomains
    $hosts[] = 'shop.example.com';
    $hosts[] = 'members.example.com';
    return $hosts;
});
```

---

## Tax & VAT

### `checkout/is_business`
`fluent_cart/checkout/is_business` — Filter whether checkout is a business (B2B) purchase

* **When it runs:** Applied in `TaxModule::storeBusinessInfoOnOrder()` right after order is placed to decide whether to persist business info.
* **Source:** `app/Modules/Tax/TaxModule.php` (line 1047)

#### Parameters:
* `$isBusinessCheckout` *(bool)* — Whether checkout is treated as business purchase
* `$data` *(array)* — Context data (`['checkout_data' => array, 'order' => Order]`)
* **Returns:** *(bool)* — `true` to treat as business purchase

#### Usage Example:
```php
// Filter whether checkout is treated as a business (B2B) purchase
add_filter('fluent_cart/checkout/is_business', function ($isBusiness, $data) {
    // Treat checkout as B2B if company name is provided
    $company = $data['checkout_data']['form_data']['company_name'] ?? '';

    return $isBusiness || $company !== '';
}, 10, 2);
```

---

### `tax/reverse_charge_line_adjustment`
`fluent_cart/tax/reverse_charge_line_adjustment` — Filter per-line price adjustment when reverse charge is applied

* **When it runs:** Applied in `TaxModule::calculateCartTax()` while applying EU VAT reverse charge to tax-inclusive product lines.
* **Source:** `app/Modules/Tax/TaxModule.php` (line 689)

#### Parameters:
* `$adjustment` *(int)* — Amount in cents to deduct from line unit price
* `$data` *(array)* — Context data (`['line' => array, 'rc_mode' => string]`)
* **Returns:** *(int)* — Adjustment amount in cents

#### Usage Example:
```php
// Filter price deduction amount when EU VAT reverse charge is applied
add_filter('fluent_cart/tax/reverse_charge_line_adjustment', function ($adjustment, $data) {
    // Keep gross price without deduction for target product post ID 123
    if (($data['line']['post_id'] ?? 0) === 123) {
        return 0;
    }

    return $adjustment;
}, 10, 2);
```

---

### `tax/reverse_charge_notice_text`
`fluent_cart/tax/reverse_charge_notice_text` — Filter reverse charge notice on receipts and invoices

* **When it runs:** Applied in `TaxModule::getReverseChargeNoticeText()` whenever reverse charge notice is rendered on receipts, emails, or PDFs.
* **Source:** `app/Modules/Tax/TaxModule.php` (line 1688)

#### Parameters:
* `$text` *(string)* — Notice text (default: `'Reverse charge — Article 196, Council Directive 2006/112/EC. Customer is liable for VAT.'`)
* **Returns:** *(string)* — Notice text to display

#### Usage Example:
```php
// Filter reverse charge notice text shown on receipts and invoices
add_filter('fluent_cart/tax/reverse_charge_notice_text', function ($text) {
    // Apply intra-EU supply of goods reverse charge notice wording
    return __('Reverse charge — Article 138, Council Directive 2006/112/EC. Customer is liable for VAT.', 'my-plugin');
}, 10, 1);
```

---

### `tax/validate_eu_vat_number`
`fluent_cart/tax/validate_eu_vat_number` — Short-circuit EU VAT number validation with custom validator

* **When it runs:** Applied in `TaxModule::validateEuVatNumber()` before contacting EU VIES SOAP service. Returning non-null short-circuits remote call.
* **Source:** `app/Modules/Tax/TaxModule.php` (line 1430)

#### Parameters:
* `$result` *(null)* — Always `null` by default
* `$data` *(array)* — Context data (`['country_code' => string, 'vat_number' => string]`)
* **Returns:** *(null|array|\WP_Error)* — `null` for default VIES call, `array` for successful result, `WP_Error` for error

#### Usage Example:
```php
// Short-circuit EU VAT number validation with custom API validator
add_filter('fluent_cart/tax/validate_eu_vat_number', function ($result, $data) {
    // Perform remote lookup via custom VAT API validator
    $response = my_vat_api_check($data['country_code'], $data['vat_number']);

    if (!$response['ok']) {
        return new \WP_Error('invalid_vat', __('The VAT number could not be validated.', 'my-plugin'));
    }

    return [
        'country'    => $data['country_code'],
        'vat_number' => $data['vat_number'],
        'valid'      => true,
        'name'       => $response['company_name'],
        'address'    => $response['address'],
    ];
}, 10, 2);
```
