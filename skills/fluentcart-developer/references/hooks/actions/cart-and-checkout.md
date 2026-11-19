# Cart & Checkout

All hooks related to the shopping flow — from adding items to the [Cart](/database/models/cart.md) through checkout rendering and the receipt/thank-you page.

## Cart Events

---

### ` item_added `

`fluent_cart/cart/item_added` — Fired after an item is added to the cart

**When it runs:** This action fires immediately after a product item has been successfully added to the [Cart](/database/models/cart.md) model and saved to the database. It runs before the `cart_data_items_updated` hook with the `item_added` scope.

**Parameters:**

- `$data` (array): Cart and item data

```
$data = [
    'cart' => $cart,   // \FluentCart\App\Models\Cart instance
    'item' => $item,   // array — the cart item that was just added
];
```

**Source:** `app/Models/Cart.php`

**Usage:**

```
add_action('fluent_cart/cart/item_added', function ($data) {
    $cart = $data['cart'];
    $item = $data['item'];

    // Log the added product for analytics
    error_log('Product ' . $item['post_id'] . ' added to cart #' . $cart->id);
}, 10, 1);
```

### ` item_removed `

`fluent_cart/cart/item_removed` — Fired after an item is removed from the cart

**When it runs:** This action fires after a product item has been removed from the [Cart](/database/models/cart.md) and saved, but only when the `$triggerEvent` parameter is `true` (the default). When an item is removed silently (e.g., during a replacement operation), this hook does not fire.

**Parameters:**

- `$data` (array): Cart and removal context

```
$data = [
    'cart'         => $cart,          // \FluentCart\App\Models\Cart instance
    'variation_id' => $variationId,   // int — the variation ID that was removed
    'extra_args'   => $extraArgs,     // array — additional matching arguments
    'removed_item' => $removingItem,  // array — the full cart item that was removed
];
```

**Source:** `app/Models/Cart.php`

**Usage:**

```
add_action('fluent_cart/cart/item_removed', function ($data) {
    $removedItem = $data['removed_item'];
    $cart = $data['cart'];

    // Track removal for abandoned cart analytics
    do_action('my_plugin/track_cart_removal', [
        'variation_id' => $data['variation_id'],
        'product_id'   => $removedItem['post_id'] ?? null,
        'cart_id'      => $cart->id,
    ]);
}, 10, 1);
```

### ` cart_data_items_updated `

`fluent_cart/cart/cart_data_items_updated` — General-purpose hook for any cart data change

**When it runs:** This action fires whenever the cart data array is modified. The `scope` field tells you what operation triggered the update. It fires on item add, item remove, coupon apply, coupon remove, discount recalculation, and checkout page loading.

**Parameters:**

- `$data` (array): Cart and scope context

```
$data = [
    'cart'       => $cart,        // \FluentCart\App\Models\Cart instance
    'scope'      => 'item_added', // string — one of the scope values below
    'scope_data' => $scopeData,   // mixed — context data depending on scope
];
```

Possible `scope` values and their `scope_data`:

| scope | scope_data |
| --- | --- |
| `'item_added'` | The cart item array that was added |
| `'item_removed'` | The variation ID (int) that was removed |
| `'discounts_recalculated'` | Array of applied coupon codes |
| `'remove_coupon'` | Array of coupon codes that were removed |
| `'apply_coupons'` | Array of coupon codes that were applied |
| `'loading'` | Empty string (fired on checkout page load) |

**Source:** `app/Models/Cart.php`, `app/Hooks/Handlers/ShortCodes/Checkout/CheckoutPageHandler.php`

**Usage:**

```
add_action('fluent_cart/cart/cart_data_items_updated', function ($data) {
    $cart = $data['cart'];
    $scope = $data['scope'];

    if ($scope === 'item_added' || $scope === 'item_removed') {
        // Recalculate custom surcharges whenever items change
        my_plugin_recalculate_surcharges($cart);
    }

    if ($scope === 'apply_coupons') {
        // Log coupon usage
        error_log('Coupons applied to cart #' . $cart->id . ': ' . implode(', ', $data['scope_data']));
    }
}, 10, 1);
```

### ` cart_completed `

`fluent_cart/cart_completed` — Fired when a cart is marked as completed after payment

**When it runs:** This action fires when the cart's stage is set to `completed` after a successful [Order](/database/models/order.md) payment. The cart's `completed_at` timestamp has already been saved at this point. This is triggered inside `StatusHelper` during order status transitions when payment is marked as paid.

**Parameters:**

- `$data` (array): Completed cart and associated order

```
$data = [
    'cart'  => $relatedCart,  // \FluentCart\App\Models\Cart instance (stage = 'completed')
    'order' => $order,        // \FluentCart\App\Models\Order instance
];
```

**Source:** `app/Helpers/StatusHelper.php`

**Usage:**

```
add_action('fluent_cart/cart_completed', function ($data) {
    $cart = $data['cart'];
    $order = $data['order'];

    // Fire a conversion pixel or sync to analytics
    my_plugin_track_conversion([
        'order_id'    => $order->id,
        'total'       => $order->total_amount,
        'customer_id' => $order->customer_id,
    ]);
}, 10, 1);
```

### ` before_totals_calculation `

`fluent_cart/cart/before_totals_calculation` — Before the cart's grand total is recalculated

**When it runs:** This action fires at the start of `Cart::getEstimatedTotal()` (or equivalent total-calculation path), before dynamic discounts (`fluent_cart/cart/item_dynamic_discount`) are applied and before line items are re-summed. A `self::$calculatingTotal` guard is set to `true` immediately before this fires, preventing re-entrant recalculation.

**Parameters:**

- `$data` (array): The cart about to be recalculated

```
$data = [
    'cart' => $this,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Models/Cart.php:1194`

**Usage:**

```
add_action('fluent_cart/cart/before_totals_calculation', function ($data) {
    $cart = $data['cart'];
    // Warm a cache needed by a custom pricing rule before totals run
    my_plugin_prime_pricing_cache($cart->id);
}, 10, 1);
```

### ` after_totals_calculation `

`fluent_cart/cart/after_totals_calculation` — After the cart's grand total has been recalculated

**When it runs:** This action fires at the end of `Cart::getEstimatedTotal()`, after fees, discounts, prorate credits, and upgrade discounts have all been applied to produce the final total. It fires right before the `self::$calculatingTotal` guard is released.

**Parameters:**

- `$data` (array): The cart and its computed total

```
$data = [
    'cart'  => $this,        // \FluentCart\App\Models\Cart instance
    'total' => $finalTotal,  // int — the final cart total in cents
];
```

**Source:** `app/Models/Cart.php:1244`

**Usage:**

```
add_action('fluent_cart/cart/after_totals_calculation', function ($data) {
    $cart = $data['cart'];
    $total = \FluentCart\App\Helpers\Helper::toDecimal($data['total']);
    error_log('Cart #' . $cart->id . ' recalculated total: ' . $total);
}, 10, 1);
```

---

## Checkout Data Events

---

### ` order/after_items_calculated `

`fluent_cart/order/after_items_calculated` — After the draft order's items/totals are calculated

**When it runs:** This action fires during the checkout submission flow (`CheckoutApi`), right after the draft [Order](/database/models/order.md)'s line items and totals have been calculated, and immediately before the `fluent_cart/checkout/prepare_other_data` hook below (same request, same method).

**Parameters:**

- `$data` (array): Order and cart context

```
$data = [
    'order'      => $createdOrder,                    // \FluentCart\App\Models\Order — the newly created draft order
    'cart'       => $cart,                             // \FluentCart\App\Models\Cart instance
    'cart_items' => $cartCheckoutHelper->getItems(),    // array — resolved cart items
];
```

**Source:** `api/Checkout/CheckoutApi.php:269`

**Usage:**

```
add_action('fluent_cart/order/after_items_calculated', function ($data) {
    $order = $data['order'];
    // Attach a custom line-item summary before other modules touch the order
    fluent_cart_add_log(
        'Order Items Calculated',
        sprintf('Order #%d totals calculated with %d items.', $order->id, count($data['cart_items'])),
        'info'
    );
}, 10, 1);
```

### ` prepare_other_data `

`fluent_cart/checkout/prepare_other_data` — After order creation, before finalizing

**When it runs:** This action fires during the checkout submission flow, after the draft [Order](/database/models/order.md) has been created but before it is finalized (before addresses and items are attached). This gives modules a chance to attach additional data to the order.

**Parameters:**

- `$data` (array): Full checkout context

```
$data = [
    'cart'           => $cart,           // \FluentCart\App\Models\Cart instance
    'order'          => $createdOrder,   // \FluentCart\App\Models\Order — the newly created draft order
    'prev_order'     => $prevOrder,      // \FluentCart\App\Models\Order|null — previous order if retrying
    'request_data'   => $data,           // array — raw validated request data from checkout form
    'validated_data' => $validatedData,  // array — sanitized/validated checkout field values
];
```

**Source:** `api/Checkout/CheckoutApi.php`

**Usage:**

```
add_action('fluent_cart/checkout/prepare_other_data', function ($data) {
    $order = $data['order'];
    $requestData = $data['request_data'];

    // Attach custom metadata to the order before it finalizes
    $customField = sanitize_text_field($requestData['custom_gift_message'] ?? '');
    if ($customField) {
        $order->updateMeta('gift_message', $customField);
    }
}, 10, 1);
```

### ` cart_amount_updated `

`fluent_cart/checkout/cart_amount_updated` — Fired when the cart total may have changed

**When it runs:** This action fires whenever an operation changes (or may change) the cart total. This includes: item removal (silent mode), coupon application, coupon removal, discount recalculation, quantity updates, order bump toggles, and tax recalculations. Use this hook to react to price changes regardless of the specific cause.

**Parameters:**

- `$data` (array): The affected cart

```
$data = [
    'cart' => $cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Models/Cart.php`, `app/Hooks/Cart/WebCheckoutHandler.php`, `app/Modules/Tax/TaxModule.php`

**Usage:**

```
add_action('fluent_cart/checkout/cart_amount_updated', function ($data) {
    $cart = $data['cart'];

    // Recalculate a custom fee based on the new cart total
    $estimatedTotal = $cart->getEstimatedTotal();
    if ($estimatedTotal > 10000) { // over $100.00
        // Apply free shipping threshold logic
        my_plugin_apply_free_shipping($cart);
    }
}, 10, 1);
```

### ` shipping_data_changed `

`fluent_cart/checkout/shipping_data_changed` — Fired when shipping data changes

**When it runs:** This action fires when shipping-related data on the cart changes, such as when a new shipping method is selected, the shipping charge changes, or the shipping address is updated in a way that affects shipping calculations.

**Parameters:**

- `$data` (array): The affected cart

```
$data = [
    'cart' => $cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Helpers/CartHelper.php`, `app/Hooks/Cart/WebCheckoutHandler.php`

**Usage:**

```
add_action('fluent_cart/checkout/shipping_data_changed', function ($data) {
    $cart = $data['cart'];
    $shippingData = $cart->checkout_data['shipping_data'] ?? [];

    // Log shipping method selection for analytics
    error_log('Cart #' . $cart->id . ' shipping method: ' . ($shippingData['shipping_method_id'] ?? 'none'));
}, 10, 1);
```

### ` form_data_changed `

`fluent_cart/checkout/form_data_changed` — Fired when checkout form data changes

**When it runs:** This action fires when the checkout form data is updated via AJAX, such as when a customer changes their address, toggles "ship to different address", or any form field is updated that triggers a server-side recalculation.

**Parameters:**

- `$data` (array): The affected cart

```
$data = [
    'cart' => $cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Hooks/Cart/WebCheckoutHandler.php`

**Usage:**

```
add_action('fluent_cart/checkout/form_data_changed', function ($data) {
    $cart = $data['cart'];
    $formData = $cart->checkout_data['form_data'] ?? [];

    // Check if the billing country requires special handling
    $billingCountry = $formData['billing_country'] ?? '';
    if (in_array($billingCountry, ['BR', 'IN'])) {
        // Add country-specific checkout notices
        my_plugin_add_country_notice($cart, $billingCountry);
    }
}, 10, 1);
```

### ` customer_data_saved `

`fluent_cart/checkout/customer_data_saved` — Removed in 1.4.0 — no longer fired

Removed in 1.4.0 — this hook no longer fires

`fluent_cart/checkout/customer_data_saved` was removed from the checkout refactor in commit `ebeae0dc3` (2026-05-14, shipped in **1.4.0**). It does not exist anywhere in FluentCart or FluentCart Pro today, so a callback registered on it will **never run** — silently, with no error.

This entry is kept only so that anyone whose integration stopped working can find out why. Do not write new code against it.

**What to use instead:** the checkout data is now persisted without a per-key notification. To react to checkout field changes, hook [`fluent_cart/checkout/validate_data`](./../filters/cart-and-checkout.md) before persistence, or read the final state from the order lifecycle actions in [Orders](./orders.md) after checkout completes.

**When it fired (historical, prior to 1.4.0):** It fired when a specific piece of customer data was saved during checkout, after the value had been persisted to the cart model, and passed both the old and new values so a listener could detect changes.

**Parameters:**

- `$data` (array): Customer data change context

```
$data = [
    'cart'      => $cart,            // \FluentCart\App\Models\Cart instance
    'key'       => $key,             // string — the data key that changed (e.g. 'billing_country')
    'value'     => $value,           // mixed — the new value
    'old_value' => $prevValue,       // mixed — the previous value
    'old_data'  => $oldCheckoutData, // array — the full previous checkout_data array
];
```

**Source:** `app/Hooks/Cart/WebCheckoutHandler.php`

**Usage:**

```
add_action('fluent_cart/checkout/customer_data_saved', function ($data) {
    $cart = $data['cart'];
    $key = $data['key'];

    // React to billing country changes for tax recalculation
    if ($key === 'billing_country' && $data['value'] !== $data['old_value']) {
        error_log('Cart #' . $cart->id . ' billing country changed from '
            . $data['old_value'] . ' to ' . $data['value']);
    }
}, 10, 1);
```

### ` tax/reverse_charge_applied `

`fluent_cart/tax/reverse_charge_applied` — Fired when the EU VAT reverse charge is applied to the cart

**When it runs:** This action fires during cart tax calculation (`TaxModule::calculateCartTax()`) when the reverse charge mechanism has just been applied — a qualifying business customer (e.g. validated EU VAT number) is liable for the VAT, so tax has been removed and inclusive product lines and fees have been adjusted to net prices. It fires after those adjustments are written into the cart's checkout data.

**Parameters:**

- `$data` (array): Reverse charge context

```
$data = [
    'checkout_data' => $checkoutData, // array — the cart's checkout_data (includes the updated 'tax_data')
    'product_lines' => $productLines, // array — cart product line items, already adjusted to net prices
];
```

**Source:** `app/Modules/Tax/TaxModule.php (line 750)`

**Usage:**

```
add_action('fluent_cart/tax/reverse_charge_applied', function ($data) {
    $taxData = $data['checkout_data']['tax_data'] ?? [];

    // Log or sync with an external tax service
    my_tax_service_flag_reverse_charge($taxData);
}, 10, 1);
```

### ` tax/reverse_charge_removed `

`fluent_cart/tax/reverse_charge_removed` — Fired when the EU VAT reverse charge is removed from the cart

**When it runs:** This action fires during cart tax calculation (`TaxModule::calculateCartTax()`) when a previously applicable reverse charge no longer applies (e.g. the VAT number was removed or the billing country changed). Product lines have already been restored to gross prices and the reverse charge fee adjustments cleared before it fires.

**Parameters:**

- `$data` (array): Reverse charge context

```
$data = [
    'checkout_data' => $checkoutData, // array — the cart's checkout_data (includes 'tax_data')
    'product_lines' => $productLines, // array — cart product line items, restored to gross prices
];
```

**Source:** `app/Modules/Tax/TaxModule.php (line 762)`

**Usage:**

```
add_action('fluent_cart/tax/reverse_charge_removed', function ($data) {
    // React to the customer no longer qualifying for reverse charge
    my_tax_service_clear_reverse_charge($data['checkout_data']);
}, 10, 1);
```

---

## Checkout Page Rendering

All hooks in this section fire during server-side HTML rendering of the checkout page. They use output buffering, so you should **echo** (not return) any custom HTML you want to inject.

---

### ` before_checkout_page_start `

`fluent_cart/before_checkout_page_start` — Before the checkout page wrapper div

**When it runs:** This action fires immediately before the main checkout page `` wrapper is opened. Use it to output HTML or scripts that should appear above the entire checkout page.

**Parameters:**

- `$data` (array): The current cart

```
$data = [
    'cart' => $cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`

**Usage:**

```
add_action('fluent_cart/before_checkout_page_start', function ($data) {
    $cart = $data['cart'];
    echo '<div class="my-checkout-banner">';
    echo '<p>Free shipping on orders over $50!</p>';
    echo '</div>';
}, 10, 1);
```

### ` after_checkout_page_start `

`fluent_cart/after_checkout_page_start` — After the checkout page wrapper div opens

**When it runs:** This action fires right after the main checkout page `` wrapper opens, before any checkout content is rendered.

**Parameters:**

- `$data` (array): The current cart

```
$data = [
    'cart' => $cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Services/Renderer/CheckoutRenderer.php:154`

**Usage:**

```
add_action('fluent_cart/after_checkout_page_start', function ($data) {
    $cart = $data['cart'];
    echo '<div class="my-checkout-progress-bar">Step 1 of 3: Checkout</div>';
}, 10, 1);
```

### ` before_checkout_form `

`fluent_cart/before_checkout_form` — Before the checkout form element

**When it runs:** This action fires just before the `` tag for the checkout form is rendered.

**Parameters:**

- `$data` (array): The current cart

```
$data = [
    'cart' => $cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`

**Usage:**

```
add_action('fluent_cart/before_checkout_form', function ($data) {
    echo '<div class="my-trust-badges">';
    echo '<img src="/wp-content/uploads/secure-checkout.svg" alt="Secure Checkout" />';
    echo '</div>';
}, 10, 1);
```

### ` checkout_form_opening `

`fluent_cart/checkout_form_opening` — Right after the checkout form tag opens

**When it runs:** This action fires immediately after the `` tag opens, before any form fields are rendered. Use it to insert hidden fields, nonce fields, or other elements that must be inside the form.

**Parameters:**

- `$data` (array): The current cart

```
$data = [
    'cart' => $cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`

**Usage:**

```
add_action('fluent_cart/checkout_form_opening', function ($data) {
    // Add a hidden field for tracking
    echo '<input type="hidden" name="my_tracking_ref" value="' . esc_attr(my_get_tracking_ref()) . '" />';
}, 10, 1);
```

### ` before_billing_fields `

`fluent_cart/before_billing_fields` — Before billing address fields

**When it runs:** This action fires after the name/email fields and the "create account" checkbox, but before the billing address fields section is rendered.

**Parameters:**

- `$data` (array): The current cart

```
$data = [
    'cart' => $cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`

**Usage:**

```
add_action('fluent_cart/before_billing_fields', function ($data) {
    echo '<p class="my-billing-note">Please enter your billing address exactly as it appears on your card statement.</p>';
}, 10, 1);
```

### ` before_billing_fields_section `

`fluent_cart/before_billing_fields_section` — Before the billing address field section renders

**When it runs:** This action fires right before the billing address form section (with its heading and input fields) is rendered. It fires inside the `renderBillingAddressFields()` method, after billing field data has been prepared and filtered.

**Parameters:**

- `$data` (array): The current cart

```
$data = [
    'cart' => $cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`

**Usage:**

```
add_action('fluent_cart/before_billing_fields_section', function ($data) {
    echo '<div class="my-billing-section-intro">';
    echo '<h4>Where should we send the invoice?</h4>';
    echo '</div>';
}, 10, 1);
```

### ` after_billing_fields_section `

`fluent_cart/after_billing_fields_section` — After the billing address field section

**When it runs:** This action fires after the billing address fields section and the "ship to different address" checkbox have been rendered. It only fires when the cart requires shipping.

**Parameters:**

- `$data` (array): The current cart

```
$data = [
    'cart' => $cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`

**Usage:**

```
add_action('fluent_cart/after_billing_fields_section', function ($data) {
    $cart = $data['cart'];
    // Add a note between billing and shipping sections
    echo '<div class="my-address-note">';
    echo '<p>Shipping is calculated based on your delivery address.</p>';
    echo '</div>';
}, 10, 1);
```

### ` checkout/b2b_extra_fields `

`fluent_cart/checkout/b2b_extra_fields` — Inside the billing fields area, for custom B2B fields

**When it runs:** This action fires within the billing address fields section of the checkout form (`CheckoutRenderer::renderBillingAddressFields()`), after the standard billing fields. Use it to render extra business-oriented fields such as a company name, tax ID/VAT number, or purchase-order reference.

**Parameters:**

- `$data` (array): The current cart

```
$data = [
    'cart' => $this->cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Services/Renderer/CheckoutRenderer.php:419`

**Usage:**

```
add_action('fluent_cart/checkout/b2b_extra_fields', function ($data) {
    echo '<div class="fct-field-wrap">';
    echo '<label for="company_vat_number">VAT Number</label>';
    echo '<input type="text" id="company_vat_number" name="company_vat_number" />';
    echo '</div>';
}, 10, 1);
```

### ` before_shipping_fields_section `

`fluent_cart/before_shipping_fields_section` — Before the shipping address field section

**When it runs:** This action fires right before the shipping address form section is rendered. The shipping section may be hidden via CSS if "ship to different address" is not checked.

**Parameters:**

- `$data` (array): The current cart

```
$data = [
    'cart' => $cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`

**Usage:**

```
add_action('fluent_cart/before_shipping_fields_section', function ($data) {
    echo '<p class="my-shipping-note">Enter the address where you want us to deliver your order.</p>';
}, 10, 1);
```

### ` after_shipping_fields_section `

`fluent_cart/after_shipping_fields_section` — After the shipping address field section

**When it runs:** This action fires immediately after the shipping address form section is rendered.

**Parameters:**

- `$data` (array): The current cart

```
$data = [
    'cart' => $cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`

**Usage:**

```
add_action('fluent_cart/after_shipping_fields_section', function ($data) {
    echo '<div class="my-delivery-estimate">';
    echo '<p>Estimated delivery: 3-5 business days</p>';
    echo '</div>';
}, 10, 1);
```

### ` before_payment_methods `

`fluent_cart/before_payment_methods` — Before payment method options

**When it runs:** This action fires before the payment methods section is rendered on the checkout page. It also fires in the modal checkout renderer and the Gutenberg block inner blocks renderer.

**Parameters:**

- `$data` (array): The current cart

```
$data = [
    'cart' => $cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`, `app/Services/Renderer/ModalCheckoutRenderer.php`, `app/Hooks/Handlers/BlockEditors/Checkout/InnerBlocks/InnerBlocks.php`

**Usage:**

```
add_action('fluent_cart/before_payment_methods', function ($data) {
    echo '<div class="my-payment-security-note">';
    echo '<p>All transactions are encrypted and secure.</p>';
    echo '</div>';
}, 10, 1);
```

### ` after_payment_methods `

`fluent_cart/after_payment_methods` — After payment method options

**When it runs:** This action fires after the payment methods section has been rendered, before the checkout submit button.

**Parameters:**

- `$data` (array): The current cart

```
$data = [
    'cart' => $cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`

**Usage:**

```
add_action('fluent_cart/after_payment_methods', function ($data) {
    echo '<div class="my-payment-icons">';
    echo '<img src="/wp-content/uploads/visa.svg" alt="Visa" />';
    echo '<img src="/wp-content/uploads/mastercard.svg" alt="Mastercard" />';
    echo '</div>';
}, 10, 1);
```

### ` checkout_embed_payment_method_content `

`fluent_cart/checkout_embed_payment_method_content` — Inside each embedded payment method's container div

**When it runs:** This action fires inside the per-method `fluent-cart-checkout_embed_payment_container_{route}` wrapper `` for each registered payment method on the checkout page (and the equivalent container in the modal checkout renderer). The container itself starts `aria-hidden="true"` and is revealed by JS when that method is selected. Use it to render gateway-specific embedded fields (e.g. a card element mount point).

**Parameters:**

- `$data` (array): Payment method render context

```
$data = [
    'method' => $method,       // \FluentCart\App\Modules\PaymentMethods\Core\AbstractPaymentGateway instance
    'cart'   => $this->cart,   // \FluentCart\App\Models\Cart instance
    'route'  => $route,        // string — the gateway's route/slug (e.g. 'stripe', 'paypal')
];
```

**Source:** `app/Services/Renderer/ModalCheckoutRenderer.php:819` (modal checkout) and `app/Services/Renderer/CheckoutRenderer.php:944` (full checkout page)

**Usage:**

```
add_action('fluent_cart/checkout_embed_payment_method_content', function ($data) {
    if ($data['route'] !== 'my_gateway') {
        return;
    }
    echo '<div id="my-gateway-card-element"></div>';
}, 10, 1);
```

### ` after_checkout_button `

`fluent_cart/after_checkout_button` — After the checkout submit button

**When it runs:** This action fires immediately after the "Place order" submit button is rendered.

**Parameters:**

- `$data` (array): The current cart

```
$data = [
    'cart' => $cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`

**Usage:**

```
add_action('fluent_cart/after_checkout_button', function ($data) {
    echo '<p class="my-checkout-disclaimer">';
    echo 'By placing your order you agree to our <a href="/terms">Terms of Service</a>.';
    echo '</p>';
}, 10, 1);
```

### ` after_order_notes `

`fluent_cart/after_order_notes` — After the order notes section in the summary sidebar

**When it runs:** This action fires after the order notes field in the checkout summary/sidebar section, inside the order summary wrapper.

**Parameters:**

- `$data` (array): The current cart

```
$data = [
    'cart' => $cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`

**Usage:**

```
add_action('fluent_cart/after_order_notes', function ($data) {
    echo '<div class="my-gift-wrap-option">';
    echo '<label><input type="checkbox" name="gift_wrap" value="yes" /> Add gift wrapping (+$5.00)</label>';
    echo '</div>';
}, 10, 1);
```

### ` after_order_notes_field `

`fluent_cart/after_order_notes_field` — After the order notes form field

**When it runs:** This action fires right after the order notes textarea field is rendered, inside the `renderOrderNoteField()` method. Note that the order notes field only appears when the cart requires shipping (unless overridden by the `fluent_cart/disable_order_notes_for_digital_products` filter).

**Parameters:**

- `$data` (array): The current cart

```
$data = [
    'cart' => $cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`

**Usage:**

```
add_action('fluent_cart/after_order_notes_field', function ($data) {
    echo '<p class="my-notes-hint"><em>Example: Leave package at the back door.</em></p>';
}, 10, 1);
```

### ` after_checkout_form `

`fluent_cart/after_checkout_form` — After the checkout form closes

**When it runs:** This action fires immediately after the closing `` tag of the checkout form.

**Parameters:**

- `$data` (array): The current cart

```
$data = [
    'cart' => $cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`

**Usage:**

```
add_action('fluent_cart/after_checkout_form', function ($data) {
    // Render a support chat widget below the form
    echo '<div class="my-checkout-support">';
    echo '<p>Need help? <a href="#" onclick="openChat()">Chat with us</a></p>';
    echo '</div>';
}, 10, 1);
```

### ` before_checkout_page_close `

`fluent_cart/before_checkout_page_close` — Before the checkout page wrapper div closes

**When it runs:** This action fires just before the closing `` of the main checkout page wrapper.

**Parameters:**

- `$data` (array): The current cart

```
$data = [
    'cart' => $cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`

**Usage:**

```
add_action('fluent_cart/before_checkout_page_close', function ($data) {
    echo '<div class="my-checkout-footer-badges">';
    echo '<p>30-day money-back guarantee</p>';
    echo '</div>';
}, 10, 1);
```

### ` after_checkout_page `

`fluent_cart/after_checkout_page` — After the entire checkout page wrapper

**When it runs:** This action fires after the checkout page wrapper `` has been closed. Use it for scripts, tracking pixels, or other content that should appear after the entire checkout page.

**Parameters:**

- `$data` (array): The current cart

```
$data = [
    'cart' => $cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`

**Usage:**

```
add_action('fluent_cart/after_checkout_page', function ($data) {
    $cart = $data['cart'];
    // Output a tracking script after the checkout page
    echo '<script>myAnalytics.trackCheckoutView({ cartId: ' . intval($cart->id) . ' });</script>';
}, 10, 1);
```

### ` before_summary_total `

`fluent_cart/checkout/before_summary_total` — Before the total line in the cart summary

**When it runs:** This action fires in the cart summary sidebar, after the subtotal, shipping, and discount lines but before the coupon input field and the final total line.

**Parameters:**

- `$data` (array): The current cart

```
$data = [
    'cart' => $cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Services/Renderer/CartSummaryRender.php`

**Usage:**

```
add_action('fluent_cart/checkout/before_summary_total', function ($data) {
    $cart = $data['cart'];
    // Add a custom fee line in the summary
    echo '<li class="my-custom-fee">';
    echo '<span class="fct_summary_label">Processing Fee</span>';
    echo '<span class="fct_summary_value">$2.50</span>';
    echo '</li>';
}, 10, 1);
```

---

## Cart Line Items Rendering

These hooks fire during the rendering of individual cart line items on the checkout page. They all receive the same parameter structure from `CartItemRenderer::getEventInfo()`, which includes [Cart](/database/models/cart.md), [Product](/database/models/product.md), and [ProductVariation](/database/models/product-variation.md) model instances. Use **echo** to output custom HTML.

---

### ` line_meta `

`fluent_cart/cart/line_item/line_meta` — After line item content, for custom metadata

**When it runs:** This action fires after the main item content (title, variant info, child variants) inside the item info area, but before the price section. Use it to display custom per-item metadata such as personalization details or custom options.

**Parameters:**

- `$data` (array): Line item rendering context

```
$data = [
    'item'    => $item,     // array — the cart item data (post_id, title, quantity, unit_price, etc.)
    'cart'    => $cart,     // \FluentCart\App\Models\Cart|null instance
    'product' => $product,  // Product model or null
    'variant' => $variant,  // ProductVariation model or null
];
```

**Source:** `app/Services/Renderer/CartItemRenderer.php`

**Usage:**

```
add_action('fluent_cart/cart/line_item/line_meta', function ($data) {
    $item = $data['item'];

    // Display custom engraving text if present
    $engraving = $item['custom_fields']['engraving'] ?? '';
    if ($engraving) {
        echo '<div class="my-engraving-preview">';
        echo '<small>Engraving: ' . esc_html($engraving) . '</small>';
        echo '</div>';
    }
}, 10, 1);
```

### ` before_total `

`fluent_cart/cart/line_item/before_total` — Before the line item price/total

**When it runs:** This action fires inside the price area of a cart line item, before the item total (and any promotional strikethrough price) is displayed.

**Parameters:**

- `$data` (array): Line item rendering context

```
$data = [
    'item'    => $item,     // array — the cart item data
    'cart'    => $cart,     // \FluentCart\App\Models\Cart|null instance
    'product' => $product,  // Product model or null
    'variant' => $variant,  // ProductVariation model or null
];
```

**Source:** `app/Services/Renderer/CartItemRenderer.php`

**Usage:**

```
add_action('fluent_cart/cart/line_item/before_total', function ($data) {
    $item = $data['item'];
    $savings = ($item['other_info']['original_price'] ?? 0) - ($item['unit_price'] ?? 0);
    if ($savings > 0) {
        echo '<span class="my-savings-badge">You save ' . esc_html(\FluentCart\App\Helpers\Helper::toDecimal($savings)) . '</span>';
    }
}, 10, 1);
```

### ` after_total `

`fluent_cart/cart/line_item/after_total` — After the line item price/total

**When it runs:** This action fires inside the price area of a cart line item, after the item total is displayed.

**Parameters:**

- `$data` (array): Line item rendering context

```
$data = [
    'item'    => $item,     // array — the cart item data
    'cart'    => $cart,     // \FluentCart\App\Models\Cart|null instance
    'product' => $product,  // Product model or null
    'variant' => $variant,  // ProductVariation model or null
];
```

**Source:** `app/Services/Renderer/CartItemRenderer.php`

**Usage:**

```
add_action('fluent_cart/cart/line_item/after_total', function ($data) {
    $item = $data['item'];
    $paymentType = $item['other_info']['payment_type'] ?? '';
    if ($paymentType === 'subscription') {
        echo '<span class="my-recurring-label"><small>Recurring</small></span>';
    }
}, 10, 1);
```

### ` before_main_title `

`fluent_cart/cart/line_item/before_main_title` — Before the product title in a line item

**When it runs:** This action fires at the very beginning of the item title area, before the quantity badge, product name, and variant title.

**Parameters:**

- `$data` (array): Line item rendering context

```
$data = [
    'item'    => $item,     // array — the cart item data
    'cart'    => $cart,     // \FluentCart\App\Models\Cart|null instance
    'product' => $product,  // Product model or null
    'variant' => $variant,  // ProductVariation model or null
];
```

**Source:** `app/Services/Renderer/CartItemRenderer.php`

**Usage:**

```
add_action('fluent_cart/cart/line_item/before_main_title', function ($data) {
    $item = $data['item'];
    // Add a "Sale" badge before the product title
    if (!empty($item['other_info']['is_on_sale'])) {
        echo '<span class="my-sale-badge">Sale</span>';
    }
}, 10, 1);
```

### ` after_main_title `

`fluent_cart/cart/line_item/after_main_title` — After the product title in a line item

**When it runs:** This action fires at the end of the item title area, after the product name, variant title, and payment type information (subscription details / per-unit price).

**Parameters:**

- `$data` (array): Line item rendering context

```
$data = [
    'item'    => $item,     // array — the cart item data
    'cart'    => $cart,     // \FluentCart\App\Models\Cart|null instance
    'product' => $product,  // Product model or null
    'variant' => $variant,  // ProductVariation model or null
];
```

**Source:** `app/Services/Renderer/CartItemRenderer.php`

**Usage:**

```
add_action('fluent_cart/cart/line_item/after_main_title', function ($data) {
    $item = $data['item'];
    // Show estimated delivery date per item
    $deliveryDays = $item['other_info']['delivery_days'] ?? null;
    if ($deliveryDays) {
        $date = date('M j', strtotime("+{$deliveryDays} days"));
        echo '<div class="my-delivery-estimate"><small>Est. delivery: ' . esc_html($date) . '</small></div>';
    }
}, 10, 1);
```

### ` footer_start `

`fluent_cart/cart/line_item/footer_start` — Start of the line item footer area

**When it runs:** This action fires at the beginning of the `.fct_line_item_footer` area of a cart line item, before the payment-type info, setup-fee info, and any license activation-limit details. Fires in both the modal checkout renderer and the full checkout page renderer.

**Parameters:**

- `$data` (array): Line item rendering context (from `CartItemRenderer::getEventInfo()` / the modal renderer's equivalent)

```
$data = [
    'item'    => $item,     // array — the cart item data
    'cart'    => $cart,     // \FluentCart\App\Models\Cart|null instance
    'product' => $product,  // Product model or null
    'variant' => $variant,  // ProductVariation model or null
];
```

**Source:** `app/Services/Renderer/ModalCheckoutRenderer.php:326` (modal checkout) and `app/Services/Renderer/CartItemRenderer.php:92` (full checkout page)

**Usage:**

```
add_action('fluent_cart/cart/line_item/footer_start', function ($data) {
    $item = $data['item'];
    if (!empty($item['other_info']['gift_wrapped'])) {
        echo '<span class="my-gift-wrap-icon">🎁 Gift wrapped</span>';
    }
}, 10, 1);
```

### ` unit_price_hint `

`fluent_cart/cart/line_item/unit_price_hint` — After the "$X each" unit price text

**When it runs:** This action fires right after the per-unit price hint (e.g. "$10.00 each") is printed for a line item, inside both the modal checkout renderer and the full checkout page's cart item renderer.

**Parameters:**

- `$data` (array): Line item rendering context

```
$data = [
    'item'    => $item,     // array — the cart item data
    'cart'    => $cart,     // \FluentCart\App\Models\Cart|null instance
    'product' => $product,  // Product model or null
    'variant' => $variant,  // ProductVariation model or null
];
```

**Source:** `app/Services/Renderer/ModalCheckoutRenderer.php:404` (modal checkout) and `app/Services/Renderer/CartItemRenderer.php:221` (full checkout page)

**Usage:**

```
add_action('fluent_cart/cart/line_item/unit_price_hint', function ($data) {
    echo '<small class="my-price-note">(tax excl.)</small>';
}, 10, 1);
```

### ` setup_fee_price_info `

`fluent_cart/cart/line_item/setup_fee_price_info` — After a line item's setup fee amount

**When it runs:** This action fires inside `maybeRenderSetupFeeInfo()`, right after the setup-fee amount is printed for a subscription line item that has one. Only reachable for items with `other_info.payment_type === 'subscription'` and a non-zero setup fee.

**Parameters:**

- `$data` (array): Line item rendering context

```
$data = [
    'item'    => $item,     // array — the cart item data
    'cart'    => $cart,     // \FluentCart\App\Models\Cart|null instance
    'product' => $product,  // Product model or null
    'variant' => $variant,  // ProductVariation model or null
];
```

**Source:** `app/Services/Renderer/CartItemRenderer.php:255`

**Usage:**

```
add_action('fluent_cart/cart/line_item/setup_fee_price_info', function ($data) {
    echo '<span class="my-setup-fee-note">(one-time)</span>';
}, 10, 1);
```

### ` after_setup_fee_info `

`fluent_cart/cart/line_item/after_setup_fee_info` — After the entire setup fee block

**When it runs:** This action fires immediately after `renderSetupFeeInfo()` completes for a line item — i.e. after the whole setup-fee row (label + amount) has been printed, not just the amount. Only fires when the item actually has a setup fee.

**Parameters:**

- `$data` (array): Line item rendering context

```
$data = [
    'item'    => $item,     // array — the cart item data
    'cart'    => $cart,     // \FluentCart\App\Models\Cart|null instance
    'product' => $product,  // Product model or null
    'variant' => $variant,  // ProductVariation model or null
];
```

**Source:** `app/Services/Renderer/CartItemRenderer.php:97`

**Usage:**

```
add_action('fluent_cart/cart/line_item/after_setup_fee_info', function ($data) {
    echo '<div class="my-setup-fee-disclaimer"><small>Setup fee charged once at signup.</small></div>';
}, 10, 1);
```

### ` footer_end `

`fluent_cart/cart/line_item/footer_end` — End of the line item footer area

**When it runs:** This action fires at the very end of the `.fct_line_item_footer` area, after the setup-fee block (if any) and after `fluent_cart/cart/line_item/after_setup_fee_info`. It is the last hook in a cart line item's footer.

**Parameters:**

- `$data` (array): Line item rendering context

```
$data = [
    'item'    => $item,     // array — the cart item data
    'cart'    => $cart,     // \FluentCart\App\Models\Cart|null instance
    'product' => $product,  // Product model or null
    'variant' => $variant,  // ProductVariation model or null
];
```

**Source:** `app/Services/Renderer/CartItemRenderer.php:99`

**Usage:**

```
add_action('fluent_cart/cart/line_item/footer_end', function ($data) {
    $item = $data['item'];
    // Append a closing note after everything else in the item footer
    echo '<div class="my-line-item-footer-note"></div>';
}, 10, 1);
```

---

## Modal Checkout

Hooks specific to the modal (popup) checkout renderer, distinct from the full checkout page.

### ` modal_checkout/after_shipping_methods `

`fluent_cart/modal_checkout/after_shipping_methods` — After the shipping methods list in the modal checkout

**When it runs:** This action fires in the modal checkout renderer right after the shipping methods list is rendered. If the store is configured to place payment methods in the "details" section (via `fluent_cart/modal_checkout/before_payment_methods_placement`), the `fluent_cart/before_payment_methods` hook fires immediately after this one, at this same location.

**Parameters:**

- `$data` (array): The current cart

```
$data = [
    'cart' => $this->cart,  // \FluentCart\App\Models\Cart instance
];
```

**Source:** `app/Services/Renderer/ModalCheckoutRenderer.php:253`

**Usage:**

```
add_action('fluent_cart/modal_checkout/after_shipping_methods', function ($data) {
    echo '<p class="my-modal-shipping-note">Free shipping over $50!</p>';
}, 10, 1);
```

---

## Receipt / Thank You Page

These hooks fire during the rendering of the thank-you / receipt page shown after a successful checkout. The `$config` parameter passed to most hooks contains the [Order](/database/models/order.md) model instance along with view context. All rendering hooks use output buffering — use **echo** to inject custom HTML.

---

### ` before_header `

`fluent_cart/receipt/thank_you/before_header` — Before the thank-you page header

**When it runs:** This action fires at the very beginning of the thank-you page content, before the header section (which contains the success/pending icon and title).

**Parameters:**

- `$config` (array): Thank-you page configuration

```
$config = [
    'order'           => $order,           // \FluentCart\App\Models\Order instance
    'is_first_time'   => true|false,       // bool — whether this is the first view of this receipt
    'order_operation' => $orderOperation,  // mixed — order operation context or null
];
```

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`

**Usage:**

```
add_action('fluent_cart/receipt/thank_you/before_header', function ($config) {
    $order = $config['order'];
    echo '<div class="my-confetti-wrapper" data-order-id="' . intval($order->id) . '"></div>';
}, 10, 1);
```

### ` after_header `

`fluent_cart/receipt/thank_you/after_header` — After the thank-you page header

**When it runs:** This action fires after the header section (the success/pending icon and title) is fully rendered, before the body section begins.

**Parameters:**

- `$config` (array): Thank-you page configuration (same structure as `before_header`)

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`

**Usage:**

```
add_action('fluent_cart/receipt/thank_you/after_header', function ($config) {
    $order = $config['order'];
    if ($order->payment_status === 'paid') {
        echo '<div class="my-share-prompt">';
        echo '<p>Love your purchase? Share it with friends!</p>';
        echo '</div>';
    }
}, 10, 1);
```

### ` after_header_title `

`fluent_cart/receipt/thank_you/after_header_title` — After the header title text

**When it runs:** This action fires inside the header section, after the "Purchase Successful!" or "Payment Pending!" heading, but still within the header wrapper div. Use it to add a subtitle or additional context below the main title.

**Parameters:**

- `$config` (array): Thank-you page configuration (same structure as `before_header`)

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`

**Usage:**

```
add_action('fluent_cart/receipt/thank_you/after_header_title', function ($config) {
    $order = $config['order'];
    echo '<p class="my-order-ref">Order Reference: #' . esc_html($order->invoice_no) . '</p>';
}, 10, 1);
```

### ` before_body `

`fluent_cart/receipt/thank_you/before_body` — Before the thank-you page body

**When it runs:** This action fires after the header section and before the body section, which contains the order details, items, subscriptions, downloads, licenses, and addresses.

**Parameters:**

- `$config` (array): Thank-you page configuration (same structure as `before_header`)

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`

**Usage:**

```
add_action('fluent_cart/receipt/thank_you/before_body', function ($config) {
    echo '<div class="my-receipt-notice">';
    echo '<p>A confirmation email has been sent to your email address.</p>';
    echo '</div>';
}, 10, 1);
```

### ` after_body `

`fluent_cart/receipt/thank_you/after_body` — After the thank-you page body

**When it runs:** This action fires after the body section (order details, items, addresses) is fully rendered, before the page wrapper closes.

**Parameters:**

- `$config` (array): Thank-you page configuration (same structure as `before_header`)

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`

**Usage:**

```
add_action('fluent_cart/receipt/thank_you/after_body', function ($config) {
    echo '<div class="my-upsell-section">';
    echo '<h3>You might also like</h3>';
    // Render recommended products
    echo '</div>';
}, 10, 1);
```

### ` before_order_header `

`fluent_cart/receipt/thank_you/before_order_header` — Before the order header in the receipt body

**When it runs:** This action fires inside the receipt body, before the order header area (which shows the customer greeting and order number).

**Parameters:**

- `$config` (array): Thank-you page configuration (same structure as `before_header`)

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`

**Usage:**

```
add_action('fluent_cart/receipt/thank_you/before_order_header', function ($config) {
    echo '<div class="my-receipt-date">';
    echo '<p>Order placed on: ' . esc_html(date('F j, Y')) . '</p>';
    echo '</div>';
}, 10, 1);
```

### ` after_order_header `

`fluent_cart/receipt/thank_you/after_order_header` — After the order header in the receipt body

**When it runs:** This action fires after the order header (customer greeting, order number, and payment status message), before the tax information and order items.

**Parameters:**

- `$config` (array): Thank-you page configuration (same structure as `before_header`)

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`

**Usage:**

```
add_action('fluent_cart/receipt/thank_you/after_order_header', function ($config) {
    $order = $config['order'];
    if ($order->note) {
        echo '<div class="my-order-note">';
        echo '<strong>Your note:</strong> ' . esc_html($order->note);
        echo '</div>';
    }
}, 10, 1);
```

### ` before_order_items `

`fluent_cart/receipt/thank_you/before_order_items` — Before the order items list in the receipt

**When it runs:** This action fires after the store tax information and before the order items table is rendered.

**Parameters:**

- `$config` (array): Thank-you page configuration (same structure as `before_header`)

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`

**Usage:**

```
add_action('fluent_cart/receipt/thank_you/before_order_items', function ($config) {
    echo '<div class="my-items-intro"><h4>Here is what you ordered:</h4></div>';
}, 10, 1);
```

### ` after_order_items `

`fluent_cart/receipt/thank_you/after_order_items` — After the order items list in the receipt

**When it runs:** This action fires after the order items table (including the totals breakdown), before the subscription items, downloads, licenses, and address sections.

**Parameters:**

- `$config` (array): Thank-you page configuration (same structure as `before_header`)

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`

**Usage:**

```
add_action('fluent_cart/receipt/thank_you/after_order_items', function ($config) {
    $order = $config['order'];
    // Show a referral code after the items list
    echo '<div class="my-referral-block">';
    echo '<p>Share your referral code <strong>REF-' . intval($order->customer_id) . '</strong> and earn 10% credit!</p>';
    echo '</div>';
}, 10, 1);
```

### ` before_footer_buttons `

`fluent_cart/receipt/thank_you/before_footer_buttons` — Before the footer buttons

**When it runs:** This action fires in the receipt footer area, before the "View Order" and "Download Receipt" buttons are rendered.

**Parameters:**

- `$config` (array): Thank-you page configuration (same structure as `before_header`)

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`

**Usage:**

```
add_action('fluent_cart/receipt/thank_you/before_footer_buttons', function ($config) {
    echo '<div class="my-footer-message">';
    echo '<p>Thank you for shopping with us!</p>';
    echo '</div>';
}, 10, 1);
```

### ` after_footer_buttons `

`fluent_cart/receipt/thank_you/after_footer_buttons` — After the footer buttons

**When it runs:** This action fires in the receipt footer area, after the "View Order" and "Download Receipt" buttons have been rendered.

**Parameters:**

- `$config` (array): Thank-you page configuration (same structure as `before_header`)

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`

**Usage:**

```
add_action('fluent_cart/receipt/thank_you/after_footer_buttons', function ($config) {
    echo '<div class="my-social-share">';
    echo '<p>Follow us on social media for updates and exclusive offers.</p>';
    echo '</div>';
}, 10, 1);
```

### ` after_receipt `

`fluent_cart/after_receipt` — After the entire receipt/thank-you page

**When it runs:** This action fires after the complete thank-you page has been rendered, including the footer. It fires on every receipt view (both first-time and returning visits). This hook is also present in the legacy `thank_you.php` view template.

**Parameters:**

- `$data` (array): Order and view context

```
$data = [
    'order'           => $order,           // \FluentCart\App\Models\Order instance
    'is_first_time'   => true|false,       // bool — whether this is the first view of this receipt
    'order_operation' => $orderOperation,  // mixed — order operation context or null
];
```

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`, `app/Views/invoice/thank_you.php`

**Usage:**

```
add_action('fluent_cart/after_receipt', function ($data) {
    $order = $data['order'];

    // Render a customer satisfaction survey
    echo '<div class="my-survey-widget">';
    echo '<h4>How was your experience?</h4>';
    echo '<a href="/survey?order=' . intval($order->id) . '">Take a quick survey</a>';
    echo '</div>';
}, 10, 1);
```

### ` after_receipt_first_time `

`fluent_cart/after_receipt_first_time` — Only on the first receipt view (for conversion tracking)

**When it runs:** This action fires only on the first time a customer views the receipt page after a purchase. It does not fire on subsequent visits to the same receipt URL. This is the ideal hook for firing conversion tracking pixels, analytics events, or affiliate postback URLs.

**Parameters:**

- `$data` (array): Order and operation context

```
$data = [
    'order'           => $order,           // \FluentCart\App\Models\Order instance
    'order_operation' => $orderOperation,  // mixed — order operation context or null
];
```

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`, `app/Views/invoice/thank_you.php`

**Usage:**

```
add_action('fluent_cart/after_receipt_first_time', function ($data) {
    $order = $data['order'];
    $total = \FluentCart\App\Helpers\Helper::toDecimal($order->total_amount);

    // Fire a conversion pixel only on first receipt view
    echo '<script>';
    echo 'fbq("track", "Purchase", { value: ' . esc_js($total) . ', currency: "' . esc_js($order->currency) . '" });';
    echo '</script>';

    // Google Ads conversion
    echo '<script>';
    echo 'gtag("event", "conversion", { send_to: "AW-XXXXX/YYYYY", value: ' . esc_js($total) . ', currency: "' . esc_js($order->currency) . '", transaction_id: "' . esc_js($order->invoice_no) . '" });';
    echo '</script>';
}, 10, 1);
```

### ` before_render_redirect_page `

`fluent_cart/before_render_redirect_page` — Before the payment redirect/receipt page renders

**When it runs:** This action fires at the very beginning of the receipt shortcode handler, before any receipt or redirect page content is rendered. It provides the raw URL parameters used to identify the order and transaction. Use it for early validation, logging, or to set up resources needed by the receipt page.

**Parameters:**

- `$data` (array): URL parameters for the receipt/redirect

```
$data = [
    'order_hash' => $orderHash,       // string — the order UUID from the URL
    'trx_hash'   => $transactionHash, // string — the transaction hash from the URL
    'method'     => $method,          // string — the payment method slug
    'is_receipt' => $isReceipt,       // bool — true if this is a receipt page, false if redirect
];
```

**Source:** `app/Hooks/Handlers/ShortCodes/ReceiptHandler.php`

**Usage:**

```
add_action('fluent_cart/before_render_redirect_page', function ($data) {
    // Log receipt page visits for debugging payment callbacks
    if ($data['is_receipt'] && $data['order_hash']) {
        error_log('Receipt page visited for order: ' . $data['order_hash']
            . ' via method: ' . $data['method']);
    }
}, 10, 1);
```
