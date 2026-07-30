# Action Hooks: Products & Coupons

Action hooks for Product lifecycle management, single product page rendering, product card display, and admin Coupon operations.

---

## Product Lifecycle
Hooks that fire during product create/update/duplicate operations in the admin.

### `product_duplicated`
`fluent_cart/product_duplicated` — Fired after a product is duplicated

* **When it runs:** This action fires after a Product has been fully duplicated, including all variants, taxonomy terms, and post meta. The database transaction has already been committed when this hook runs.
* **Source:** `app/Models/Product.php`

#### Parameters:
`$data` *(array)*: Duplication result data
```php
$data = [
    'original_product_id' => 123,        // int — The source product's post ID
    'new_product_id'      => 456,        // int — The newly created product's post ID
    'options'             => [
        'import_stock_management'   => true,  // bool — Whether stock settings were copied
        'import_license_settings'   => true,  // bool — Whether license settings were copied
        'import_downloadable_files' => false, // bool — Whether downloadable files were copied
    ],
];
```

#### Usage Example:
```php
// Hook after a product is duplicated in admin
add_action('fluent_cart/product_duplicated', function($data) {
    // Extract original and new product post IDs
    $originalId = $data['original_product_id'];
    $newId      = $data['new_product_id'];

    // Copy custom post meta that core duplication doesn't handle
    $custom = get_post_meta($originalId, '_my_custom_field', true);
    if ($custom) {
        update_post_meta($newId, '_my_custom_field', $custom);
    }
}, 10, 1);
```

---

### `product_updated`
`fluent_cart/product_updated` — Fired when a product is updated via the admin API

* **When it runs:** This action fires after a product has been successfully updated through the admin REST API (`ProductController`). It runs after `ProductResource::update()` has persisted all changes, including variants and product details.
* **Source:** `app/Http/Controllers/ProductController.php`

#### Parameters:
`$data` *(array)*: Contains the raw request data and the updated Product model
```php
$data = [
    'data'    => [              // array — Sanitized request payload
        'title'   => 'Product Name',
        'detail'  => [
            'variation_type' => 'simple',
            // ... other product detail fields
        ],
        'variants' => [
            // ... variant data
        ],
    ],
    'product' => $product,      // \FluentCart\App\Models\Product — The updated Product instance
];
```

#### Usage Example:
```php
// Hook when a product is updated via the admin API
add_action('fluent_cart/product_updated', function($data) {
    // Extract updated Product model instance
    $product = $data['product'];

    // Sync product data to an external inventory system
    do_action('my_plugin/sync_inventory', [
        'product_id' => $product->ID,
        'title'      => $product->post_title,
    ]);

    // Clear cached product data from object cache
    wp_cache_delete('fct_product_' . $product->ID, 'fluent_cart');
}, 10, 1);
```

---

## Single Product Page Rendering
Hooks that fire during the server-side rendering of a single product page. All rendering hooks use output buffering -- your callback should `echo` HTML directly rather than return a value.

### `render_product_header`
`fluent_cart/product/render_product_header` — Before the single product page content

* **When it runs:** This action fires at the very top of a single product page, before the main post content is rendered. Output is captured via `ob_start()` / `ob_get_clean()` and prepended to the product content.
* **Source:** `app/Modules/Templating/TemplateActions.php`

#### Parameters:
* `$postId` *(int)*: The product's WordPress post ID

#### Usage Example:
```php
// Hook before single product page content is rendered
add_action('fluent_cart/product/render_product_header', function($postId) {
    // Render custom promotional banner HTML above product content
    echo '<div class="my-promo-banner">Free shipping on this item!</div>';
}, 10, 1);
```

---

### `after_product_content`
`fluent_cart/product/after_product_content` — After the single product page content

* **When it runs:** This action fires immediately after the main product content on a single product page. Output is captured via `ob_start()` / `ob_get_clean()` and appended to the product content.
* **Source:** `app/Modules/Templating/TemplateActions.php`

#### Parameters:
* `$postId` *(int)*: The product's WordPress post ID

#### Usage Example:
```php
// Hook after single product page content is rendered
add_action('fluent_cart/product/after_product_content', function($postId) {
    // Render trust badges section below product content
    echo '<div class="trust-badges">';
    echo '<span>30-day money back guarantee</span>';
    echo '</div>';
}, 10, 1);
```

---

### `product_archive`
`fluent_cart/template/product_archive` — Render the product archive/taxonomy page

* **When it runs:** This action fires when a product taxonomy archive page (category, tag, etc.) is being rendered. It is triggered inside `renderMainContent()` when the current page is a taxonomy page for `fluent-products`.
* **Parameters:** None.
* **Source:** `app/Modules/Templating/TemplateActions.php`

#### Usage Example:
```php
// Hook to render custom product archive or taxonomy page
add_action('fluent_cart/template/product_archive', function() {
    // Render custom product archive wrapper and layout
    echo '<div class="my-custom-archive">';
    echo '</div>';
}, 10, 0);
```

---

### `before_price_block`
`fluent_cart/product/single/before_price_block` — Before the price block on a single product page

* **When it runs:** This action fires immediately before the price wrapper `<div>` is rendered on a single product page. It fires in two contexts: once for simple products showing a single price, and once for multi-variant products showing the selected variant's price.
* **Source:** `app/Services/Renderer/ProductRenderer.php`

#### Parameters:
`$data` *(array)*: Price block context
```php
$data = [
    'product'       => $product,      // \FluentCart\App\Models\Product — The current product
    'current_price' => 5000,          // int — Price in cents
    'scope'         => 'price_range', // string — 'price_range' for simple products, 'product_variant_price' for variant pricing
];
```

#### Usage Example:
```php
// Hook before price block wrapper on single product page
add_action('fluent_cart/product/single/before_price_block', function($data) {
    // Render price label if scope is price_range
    if ($data['scope'] === 'price_range') {
        echo '<div class="price-label">Our Price:</div>';
    }
}, 10, 1);
```

---

### `after_price` (single & card)
`fluent_cart/product/after_price` — Inline after the price is rendered

* **When it runs:** This action fires inline immediately after a price value is echoed, while still inside the price `<span>` or `<div>`. It fires in multiple contexts: simple product prices, price ranges, individual variant prices, and product cards. Use the `scope` key to distinguish between contexts.
* **Source:** `app/Services/Renderer/ProductRenderer.php`, `app/Services/Renderer/ProductCardRender.php`

#### Parameters:
`$data` *(array)*: Price context
```php
$data = [
    'product'       => $product,      // \FluentCart\App\Models\Product — The current product
    'current_price' => 5000,          // int — Price in cents
    'scope'         => 'price_range', // string — 'price_range', 'product_variant_price', or 'product_card'
];
```

#### Usage Example:
```php
// Hook inline after price value is rendered
add_action('fluent_cart/product/after_price', function($data) {
    // Display per-unit label next to variant price
    if ($data['scope'] === 'product_variant_price') {
        echo '<span class="per-unit"> / unit</span>';
    }

    // Display sale badge on archive product cards
    if ($data['scope'] === 'product_card') {
        echo '<span class="sale-badge">Sale</span>';
    }
}, 10, 1);
```

---

### `after_price_block`
`fluent_cart/product/single/after_price_block` — After the price block wrapper closes on a single product page

* **When it runs:** This action fires immediately after the closing `</div>` of the price block on a single product page. Like `before_price_block`, it fires in two contexts: simple product pricing and variant pricing.
* **Source:** `app/Services/Renderer/ProductRenderer.php`

#### Parameters:
`$data` *(array)*: Price block context (same structure as `before_price_block`)

#### Usage Example:
```php
// Hook after price block wrapper closes on single product page
add_action('fluent_cart/product/single/after_price_block', function($data) {
    // Calculate and display monthly installment pricing note
    $monthly = \FluentCart\App\Helpers\Helper::toDecimal(intval($data['current_price'] / 3));
    echo '<p class="installment-info">Or 3 payments of ' . esc_html($monthly) . '</p>';
}, 10, 1);
```

---

### `before_price_range_block`
`fluent_cart/product/single/before_price_range_block` — Before the price range block for multi-variant products

* **When it runs:** This action fires before the min-max price range `<div>` is rendered on multi-variant products (products with more than one variant that show a "from X - Y" price range). It does not fire for simple products.
* **Source:** `app/Services/Renderer/ProductRenderer.php`

#### Parameters:
`$data` *(array)*: Price range context
```php
$data = [
    'product'       => $product,      // \FluentCart\App\Models\Product — The current product
    'current_price' => 2000,          // int — Minimum price in cents
    'scope'         => 'price_range',
];
```

#### Usage Example:
```php
// Hook before price range block on multi-variant products
add_action('fluent_cart/product/single/before_price_range_block', function($data) {
    // Render intro note above price range
    echo '<div class="pricing-note">Choose a plan below:</div>';
}, 10, 1);
```

---

### `after_price_range_block`
`fluent_cart/product/single/after_price_range_block` — After the price range block for multi-variant products

* **When it runs:** This action fires after the closing `</div>` of the min-max price range block on multi-variant products. It does not fire for simple products.
* **Source:** `app/Services/Renderer/ProductRenderer.php`

#### Parameters:
`$data` *(array)*: Price range context (same structure as `before_price_range_block`)

#### Usage Example:
```php
// Hook after price range block on multi-variant products
add_action('fluent_cart/product/single/after_price_range_block', function($data) {
    // Render bulk discount notice below price range
    echo '<p class="bulk-discount">Bulk discounts available for 10+ licenses.</p>';
}, 10, 1);
```

---

### `before_variant_item`
`fluent_cart/product/single/before_variant_item` — Before each variant item in the variant list

* **When it runs:** This action fires before each individual `ProductVariation` option is rendered in the variant selection list. It fires once per variant, inside the `foreach` loop that iterates over sorted variants. It fires in both the standard variant list and the tabbed (subscription/onetime) variant layout.
* **Source:** `app/Services/Renderer/ProductRenderer.php`

#### Parameters:
`$data` *(array)*: Variant item context
```php
$data = [
    'product' => $product,               // \FluentCart\App\Models\Product — The current product
    'variant' => $variant,               // \FluentCart\App\Models\ProductVariation — The current variant being rendered
    'scope'   => 'product_variant_item',
];
```

#### Usage Example:
```php
// Hook before each variant option in variant selection list
add_action('fluent_cart/product/single/before_variant_item', function($data) {
    // Extract variant model instance from event data
    $variant = $data['variant'];

    // Render a "Most Popular" badge for target variant ID
    if ($variant->id === 42) {
        echo '<div class="popular-badge">Most Popular</div>';
    }
}, 10, 1);
```

---

### `after_variant_item`
`fluent_cart/product/single/after_variant_item` — After each variant item in the variant list

* **When it runs:** This action fires after each individual variant option is rendered in the variant selection list. It fires once per variant, immediately after `renderVariationItem()` completes. It fires in both the standard variant list and the tabbed variant layout.
* **Source:** `app/Services/Renderer/ProductRenderer.php`

#### Parameters:
`$data` *(array)*: Variant item context (same structure as `before_variant_item`)

#### Usage Example:
```php
// Hook after each variant option in variant selection list
add_action('fluent_cart/product/single/after_variant_item', function($data) {
    // Extract variant model instance from event data
    $variant = $data['variant'];

    // Display low stock warning if quantity is low
    if ($variant->stock_quantity > 0 && $variant->stock_quantity < 10) {
        echo '<span class="low-stock">Only ' . esc_html($variant->stock_quantity) . ' left!</span>';
    }
}, 10, 1);
```

---

### `before_quantity_block`
`fluent_cart/product/single/before_quantity_block` — Before the quantity selector on a single product page

* **When it runs:** This action fires immediately before the quantity input container is rendered on a single product page. It only fires if the product allows quantity selection (not hidden by sold-individually or other conditions).
* **Source:** `app/Services/Renderer/ProductRenderer.php`

#### Parameters:
`$data` *(array)*: Quantity block context
```php
$data = [
    'product' => $product,                   // \FluentCart\App\Models\Product — The current product
    'scope'   => 'product_quantity_block',
];
```

#### Usage Example:
```php
// Hook before quantity selector container on single product page
add_action('fluent_cart/product/single/before_quantity_block', function($data) {
    // Render quantity selection guidance note
    echo '<p class="quantity-hint">Select your desired quantity:</p>';
}, 10, 1);
```

---

### `after_quantity_block`
`fluent_cart/product/single/after_quantity_block` — After the quantity selector on a single product page

* **When it runs:** This action fires immediately after the quantity input container is rendered on a single product page, after the closing `</div>` of the quantity wrapper.
* **Source:** `app/Services/Renderer/ProductRenderer.php`

#### Parameters:
`$data` *(array)*: Quantity block context (same structure as `before_quantity_block`)

#### Usage Example:
```php
// Hook after quantity selector container on single product page
add_action('fluent_cart/product/single/after_quantity_block', function($data) {
    // Display bulk pricing table after quantity input wrapper
    echo '<div class="bulk-pricing">';
    echo '<small>Buy 5+ and save 10% &bull; Buy 10+ and save 20%</small>';
    echo '</div>';
}, 10, 1);
```

---

## Product Card Rendering (Archive / Group Pages)
Hooks that fire during server-side rendering of product cards on archive pages, product group blocks, and shop listings. All rendering hooks use output buffering -- your callback should `echo` HTML directly.

### `group/before_image_block`
`fluent_cart/product/group/before_image_block` — Before the product card image

* **When it runs:** This action fires before the product card image link and `<img>` tag are rendered inside a product card on archive or group pages.
* **Source:** `app/Services/Renderer/ProductCardRender.php`

#### Parameters:
`$data` *(array)*: Product card context
```php
$data = [
    'product' => $product,        // \FluentCart\App\Models\Product — The current product
    'scope'   => 'product_card',
];
```

#### Usage Example:
```php
// Hook before product card image link on archive/group pages
add_action('fluent_cart/product/group/before_image_block', function($data) {
    // Extract product model instance
    $product = $data['product'];
    $created = strtotime($product->post_date);

    // Render "New" ribbon badge if created within last 30 days
    if ($created > strtotime('-30 days')) {
        echo '<span class="new-ribbon">New</span>';
    }
}, 10, 1);
```

---

### `group/after_image_block`
`fluent_cart/product/group/after_image_block` — After the product card image

* **When it runs:** This action fires immediately after the product card image link closes, before the rest of the card content (title, price, button) is rendered.
* **Source:** `app/Services/Renderer/ProductCardRender.php`

#### Parameters:
`$data` *(array)*: Product card context (same structure as `group/before_image_block`)

#### Usage Example:
```php
// Hook after product card image link on archive/group pages
add_action('fluent_cart/product/group/after_image_block', function($data) {
    // Render quick-view button overlay after image
    echo '<button class="quick-view-btn" data-product="' . esc_attr($data['product']->ID) . '">Quick View</button>';
}, 10, 1);
```

---

### `group/before_price_block`
`fluent_cart/product/group/before_price_block` — Before the price section in product cards

* **When it runs:** This action fires before the price wrapper `<div class="fct-product-card-prices">` is rendered inside a product card on archive or group pages.
* **Source:** `app/Services/Renderer/ProductCardRender.php`

#### Parameters:
`$data` *(array)*: Product card price context
```php
$data = [
    'product'       => $product,       // \FluentCart\App\Models\Product — The current product
    'current_price' => 2000,           // int — Minimum price in cents
    'scope'         => 'product_card',
];
```

#### Usage Example:
```php
// Hook before price section in product card
add_action('fluent_cart/product/group/before_price_block', function($data) {
    // Render price prefix label on product card
    echo '<span class="price-prefix">Starting at</span>';
}, 10, 1);
```

---

### `group/after_price_block`
`fluent_cart/product/group/after_price_block` — After the price section in product cards

* **When it runs:** This action fires immediately after the closing `</div>` of the product card price wrapper, after prices and the inline `fluent_cart/product/after_price` hook have been rendered.
* **Source:** `app/Services/Renderer/ProductCardRender.php`

#### Parameters:
`$data` *(array)*: Product card price context (same structure as `group/before_price_block`)

#### Usage Example:
```php
// Hook after price section in product card
add_action('fluent_cart/product/group/after_price_block', function($data) {
    // Display custom feature list meta below price on product card
    $features = get_post_meta($data['product']->ID, '_card_features', true);
    if ($features) {
        echo '<ul class="card-features">';
        foreach ((array) $features as $feature) {
            echo '<li>' . esc_html($feature) . '</li>';
        }
        echo '</ul>';
    }
}, 10, 1);
```

---

## Coupons
Hooks that fire during Coupon create and update operations in the admin.

### `coupon_created`
`fluent_cart/coupon_created` — Fired after a new coupon is created via the admin

* **When it runs:** This action fires after a Coupon has been successfully created through the admin REST API. It runs after `CouponResource::create()` has persisted the coupon and after the activity log entry has been recorded.
* **Source:** `app/Http/Controllers/CouponsController.php`

#### Parameters:
`$data` *(array)*: Coupon creation data
```php
$data = [
    'data'   => [                // array — Sanitized request payload
        'title'      => 'SAVE20',
        'type'       => 'percentage',          // 'percentage' or 'fixed'
        'amount'     => 2000,                  // int — Discount amount in cents (or percentage value)
        'start_date' => '2026-01-01 00:00:00', // string|null — GMT start date
        'end_date'   => '2026-12-31 23:59:59', // string|null — GMT end date
        'conditions' => [
            'is_recurring' => 'no',
            // ... other condition fields
        ],
    ],
    'coupon' => $coupon,          // \FluentCart\App\Models\Coupon — The newly created Coupon instance
];
```

#### Usage Example:
```php
// Hook after a new coupon is created via admin REST API
add_action('fluent_cart/coupon_created', function($data) {
    // Extract newly created Coupon model instance
    $coupon = $data['coupon'];

    // Notify marketing team via email about new coupon
    wp_mail(
        'marketing@example.com',
        'New Coupon Created: ' . $coupon->title,
        'A new coupon has been created with code: ' . $coupon->title
    );
}, 10, 1);
```

---

### `coupon_updated`
`fluent_cart/coupon_updated` — Fired after a coupon is updated via the admin

* **When it runs:** This action fires after a Coupon has been successfully updated through the admin REST API. It runs after `CouponResource::update()` has persisted the changes, but before the activity log entry is recorded.
* **Source:** `app/Http/Controllers/CouponsController.php`

#### Parameters:
`$data` *(array)*: Coupon update data
```php
$data = [
    'data'   => [                // array — Sanitized request payload
        'title'      => 'SAVE20',
        'type'       => 'percentage',
        'amount'     => 2500,
        'start_date' => '2026-01-01 00:00:00',
        'end_date'   => '2026-12-31 23:59:59',
        'conditions' => [
            'is_recurring' => 'no',
            // ... other condition fields
        ],
    ],
    'coupon' => $coupon,          // \FluentCart\App\Models\Coupon — The updated Coupon instance
];
```

#### Usage Example:
```php
// Hook after a coupon is updated via admin REST API
add_action('fluent_cart/coupon_updated', function($data) {
    // Extract updated Coupon model instance
    $coupon = $data['coupon'];

    // Clear coupon validation cache when a coupon is modified
    wp_cache_delete('fct_coupon_' . $coupon->id, 'fluent_cart');

    // Sync updated coupon to external promotion platform
    do_action('my_plugin/sync_coupon', $coupon);
}, 10, 1);
```
