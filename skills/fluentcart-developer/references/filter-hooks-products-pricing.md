# Filter Hooks: Products & Pricing

All filters related to Product display, catalog management, pricing, stock, URLs, and Coupons.

---

## Product Display & Layout

### `products_list`
`fluent_cart/products_list` — Filter the admin products list

* **When it runs:** This filter is applied after fetching the paginated products collection in the admin products list view.
* **Source:** `app/Http/Controllers/ProductController.php` (line 52)

#### Parameters:
* `$products` *(\FluentCart\Framework\Database\Orm\LengthAwarePaginator)* — Paginated products collection with appended `view_url` and `edit_url` attributes
* **Returns:** *(\FluentCart\Framework\Database\Orm\LengthAwarePaginator)* — The modified paginated collection

#### Usage Example:
```php
// Filter paginated products collection for admin list view
add_filter('fluent_cart/products_list', function($products) {
    // Loop through collection and attach custom badge attribute
    $products->getCollection()->transform(function ($product) {
        $product->custom_badge = 'Featured';
        return $product;
    });
    return $products;
}, 10, 1);
```

---

### `shop_query`
`fluent_cart/shop_query` — Filter the shop product query builder

* **When it runs:** This filter is applied when building the query for the public-facing shop product listing, before search, status, and sorting clauses are added.
* **Source:** `api/Resource/ShopResource.php` (line 100)

#### Parameters:
* `$query` *(\FluentCart\Framework\Database\Orm\Builder)* — The Eloquent query builder instance with `select` and `with` already applied
* `$params` *(array)* — The query parameters array (`select`, `with`, `selected_status`, etc.)
* **Returns:** *(\FluentCart\Framework\Database\Orm\Builder)* — The modified query builder

#### Usage Example:
```php
// Filter shop product query builder before executing search and filters
add_filter('fluent_cart/shop_query', function($query, $params) {
    // Restrict shop query to products matching category term ID 5
    $query->whereHas('taxonomies', function ($q) {
        $q->where('taxonomy', 'product-category')
          ->where('term_id', 5);
    });
    return $query;
}, 10, 2);
```

---

### `single_product/variation_view_type`
`fluent_cart/single_product/variation_view_type` — Filter variation display type on single product pages

* **When it runs:** This filter is applied when initializing the product renderer to determine how variations are visually presented on the single product page.
* **Source:** `app/Services/Renderer/ProductRenderer.php` (line 67)

#### Parameters:
* `$viewType` *(string)* — The variation view type (`'image'`, `'text'`, `'both'`)
* `$data` *(array)* — Context data (`['product' => Product, 'variants' => Collection, 'defaultVariationId' => int]`)
* **Returns:** *(string)* — The modified view type

#### Usage Example:
```php
// Filter variation display type on single product pages
add_filter('fluent_cart/single_product/variation_view_type', function($viewType, $data) {
    // Force variation display mode to show both image and text
    return 'both';
}, 10, 2);
```

---

### `single_product/variation_column_type`
`fluent_cart/single_product/variation_column_type` — Filter variation column layout on single product pages

* **When it runs:** This filter is applied when initializing the product renderer to determine the column layout for product variations.
* **Source:** `app/Services/Renderer/ProductRenderer.php` (line 74)

#### Parameters:
* `$columnType` *(string)* — The column layout type (`'one'`, `'two'`, `'three'`, `'four'`, `'masonry'`)
* `$data` *(array)* — Context data (`['product' => Product, 'variants' => Collection, 'defaultVariationId' => int]`)
* **Returns:** *(string)* — The modified column type

#### Usage Example:
```php
// Filter variation column layout on single product pages
add_filter('fluent_cart/single_product/variation_column_type', function($columnType, $data) {
    // Extract product model instance from event context
    $product = $data['product'];

    // Use two-column layout when product has more than 6 variations
    if (count($data['variants']) > 6) {
        return 'two';
    }
    return $columnType;
}, 10, 2);
```

---

### `single_product/variation_price`
`fluent_cart/single_product/variation_price` — Filter variation price text on single product pages

* **When it runs:** This filter is applied when rendering the price text for each product variation. For one-time products the price is the formatted decimal amount; for subscriptions it includes the billing terms text.
* **Source:** `app/Services/Renderer/ProductRenderer.php` (line 827)

#### Parameters:
* `$priceText` *(string)* — The formatted price text (escaped HTML)
* `$data` *(array)* — Context data (`['product' => Product, 'variant' => ProductVariant, 'scope' => 'product_variant_price']`)
* **Returns:** *(string)* — The modified price text (HTML allowed via `wp_kses_post`)

#### Usage Example:
```php
// Filter variation price text rendered on single product pages
add_filter('fluent_cart/single_product/variation_price', function($priceText, $data) {
    // Extract variant model instance
    $variant = $data['variant'];

    // Append per-month label to subscription variation prices
    if ($variant->payment_type === 'subscription') {
        return $priceText . ' <small>/month</small>';
    }
    return $priceText;
}, 10, 2);
```

---

### `shop_app_product_query_taxonomy_filters`
`fluent_cart/shop_app_product_query_taxonomy_filters` — Filter taxonomy filters for Shop block product query

* **When it runs:** This filter is applied in the Shop App Gutenberg block when merging URL-based taxonomy filters with default block filters, before the product query is executed.
* **Source:** `app/Hooks/Handlers/BlockEditors/ShopApp/InnerBlocks/InnerBlocks.php` (line 1379)

#### Parameters:
* `$mergedTerms` *(array)* — Merged taxonomy term IDs keyed by taxonomy name (`['product-category' => [1, 5]]`)
* `$data` *(array)* — Context data (`['default_terms' => [...], 'url_terms' => [...], 'block' => $block]`)
* **Returns:** *(array)* — The modified taxonomy term IDs array

#### Usage Example:
```php
// Filter taxonomy filters for Shop Gutenberg block product query
add_filter('fluent_cart/shop_app_product_query_taxonomy_filters', function($mergedTerms, $data) {
    // Exclude category ID 99 from shop block product query
    if (isset($mergedTerms['product-category'])) {
        $mergedTerms['product-category'] = array_diff($mergedTerms['product-category'], [99]);
    }
    return $mergedTerms;
}, 10, 2);
```

---

### `products_views/preload_collection_{$provider}`
`fluent_cart/products_views/preload_collection_{$provider}` — Preload product view collection for a template provider

* **When it runs:** This dynamic filter is applied when the shop controller loads products via AJAX for a specific template provider (e.g. `bricks`). The `{$provider}` portion is replaced with the template provider name.
* **Source:** `app/Http/Controllers/ShopController.php` (line 103)

#### Parameters:
* `$html` *(string)* — Default empty string. Return rendered HTML to use preloaded view instead of JSON
* `$data` *(array)* — Context data (`['client_id' => string, 'products' => array, 'total' => int, 'requestData' => array]`)
* **Returns:** *(string)* — Rendered HTML string, or empty string to fall back to default JSON response

#### Usage Example:
```php
// Preload product view collection HTML for Bricks template provider
add_filter('fluent_cart/products_views/preload_collection_bricks', function($html, $data) {
    // Render custom HTML structure for Bricks page builder integration
    ob_start();
    foreach ($data['products'] as $product) {
        echo '<div class="custom-product-card">' . esc_html($product['title']) . '</div>';
    }
    return ob_get_clean();
}, 10, 2);
```

---

## Product Buttons & Text

### `product/buy_now_button_text`
`fluent_cart/product/buy_now_button_text` — Filter the Buy Now button text

* **When it runs:** Applied when rendering the "Buy Now" button on single product pages. Runs in both PHP product renderer and JavaScript variable localization.
* **Source:** `app/Services/Renderer/ProductRenderer.php` (lines 1081, 1181), `app/Modules/Templating/AssetLoader.php` (lines 87, 261)

#### Parameters:
* `$text` *(string)* — The button text (default: `'Buy Now'`)
* `$data` *(array)* — Context data (`['product' => Product]`)
* **Returns:** *(string)* — The modified button text

#### Usage Example:
```php
// Filter Buy Now button text on single product pages
add_filter('fluent_cart/product/buy_now_button_text', function($text, $data) {
    // Customize button text for digital product types
    if (!empty($data['product']) && $data['product']->product_type === 'digital') {
        return 'Download Now';
    }
    return $text;
}, 10, 2);
```

---

### `product/add_to_cart_text`
`fluent_cart/product/add_to_cart_text` — Filter the Add to Cart button text

* **When it runs:** Applied when rendering the "Add to Cart" button text across single product pages, shop blocks, carousels, shortcodes, and localized JS variables.
* **Source:** `app/Services/Renderer/ProductRenderer.php` (lines 1227, 1314), `app/Hooks/Handlers/ShortCodes/SingleProductShortCode.php` (line 81), `app/Hooks/Handlers/BlockEditors/ShopApp/InnerBlocks/InnerBlocks.php` (lines 1025, 1104)

#### Parameters:
* `$text` *(string)* — The button text (default: `'Add To Cart'`)
* `$data` *(array)* — Context data (`['product' => Product]`)
* **Returns:** *(string)* — The modified button text

#### Usage Example:
```php
// Filter Add to Cart button text across all product templates
add_filter('fluent_cart/product/add_to_cart_text', function($text, $data) {
    // Change default Add to Cart button text to Add to Basket
    return 'Add to Basket';
}, 10, 2);
```

---

### `product/out_of_stock_text`
`fluent_cart/product/out_of_stock_text` — Filter the out-of-stock button text

* **When it runs:** Applied when rendering button text for out-of-stock products across shortcodes, shop blocks, carousels, and localized JS variables.
* **Source:** `app/Hooks/Handlers/ShortCodes/SingleProductShortCode.php` (line 83), `app/Hooks/Handlers/BlockEditors/ShopApp/InnerBlocks/InnerBlocks.php` (lines 1027, 1106)

#### Parameters:
* `$text` *(string)* — The out-of-stock text (default: `'Not Available'`)
* `$data` *(array)* — Context data (empty array)
* **Returns:** *(string)* — The modified out-of-stock text

#### Usage Example:
```php
// Filter out-of-stock button text for unavailable products
add_filter('fluent_cart/product/out_of_stock_text', function($text) {
    // Override out-of-stock label text
    return 'Sold Out';
}, 10, 1);
```

---

### `product/out_of_stock_button_text`
`fluent_cart/product/out_of_stock_button_text` — Filter out-of-stock button text (block editor context)

* **When it runs:** Applied in block editor asset loader when localizing out-of-stock button text for JS-rendered product pages.
* **Source:** `app/Modules/Templating/AssetLoader.php` (line 260)

#### Parameters:
* `$text` *(string)* — The out-of-stock text (default: `'Not Available'`)
* `$data` *(array)* — Context data (empty array)
* **Returns:** *(string)* — The modified button text

#### Usage Example:
```php
// Filter out-of-stock button text in block editor asset loader
add_filter('fluent_cart/product/out_of_stock_button_text', function($text) {
    // Customize out-of-stock label for JS-rendered pages
    return 'Currently Unavailable';
}, 10, 1);
```

---

### `product/price_suffix_atts`
`fluent_cart/product/price_suffix_atts` — Filter price suffix for product variations

* **When it runs:** Applied when rendering each variation item in the selector. Tax module hooks here to append tax suffixes (e.g. "incl. tax").
* **Source:** `app/Services/Renderer/ProductRenderer.php` (line 1408)

#### Parameters:
* `$suffix` *(string)* — The price suffix text (default: `''`)
* `$data` *(array)* — Context data (`['product' => Product, 'variant' => ProductVariant, 'scope' => 'variant_item']`)
* **Returns:** *(string)* — The modified price suffix text

#### Usage Example:
```php
// Filter price suffix text for product variations
add_filter('fluent_cart/product/price_suffix_atts', function($suffix, $data) {
    // Append custom tax suffix label to variation price
    return ' incl. VAT';
}, 10, 2);
```

---

### `product_short_description`
`fluent_cart/product_short_description` — Filter product short description

* **When it runs:** Applied when rendering short description on single product page, using post excerpt as default value.
* **Source:** `app/Hooks/Handlers/TemplateLoader.php` (line 26)

#### Parameters:
* `$shortDescription` *(string)* — Product short description (from `$post->post_excerpt`)
* `$data` *(array)* — Context data (empty array)
* **Returns:** *(string)* — Modified short description (output via `wp_kses_post`)

#### Usage Example:
```php
// Filter product short description output on single product pages
add_filter('fluent_cart/product_short_description', function($shortDescription) {
    // Append price disclaimer paragraph to short description
    return $shortDescription . '<p class="disclaimer">Prices subject to change.</p>';
}, 10, 1);
```

---

## Stock & Availability

### `product_stock_availability`
`fluent_cart/product_stock_availability` — Filter product stock availability information

* **When it runs:** Applied when retrieving stock availability data from `ProductDetail` model, based on stock settings and inventory levels.
* **Source:** `app/Models/ProductDetail.php` (line 183)

#### Parameters:
* `$availability` *(array)* — Stock availability data (`manage_stock`, `availability`, `class`, `available_quantity`)
* `$data` *(array)* — Context data (`['detail' => ProductDetail, 'variation_id' => int|null]`)
* **Returns:** *(array)* — The modified availability data

#### Usage Example:
```php
// Filter product stock availability status data and label
add_filter('fluent_cart/product_stock_availability', function($availability, $data) {
    // Show low stock warning message when quantity is under 5
    if ($availability['manage_stock'] && $availability['available_quantity'] > 0 && $availability['available_quantity'] < 5) {
        $availability['availability'] = 'Only ' . $availability['available_quantity'] . ' left in stock!';
        $availability['class'] = 'low-stock';
    }
    return $availability;
}, 10, 2);
```

---

## Product URLs & Templates

### `price_class`
`fluent_cart/price_class` — Filter price element CSS class

* **When it runs:** Applied when rendering the price paragraph element on the single product page template.
* **Source:** `app/Hooks/Handlers/TemplateLoader.php` (line 40)

#### Parameters:
* `$class` *(string)* — The CSS class for price element (default: `'price'`)
* **Returns:** *(string)* — The modified CSS class string

#### Usage Example:
```php
// Filter price paragraph element CSS class on single product page
add_filter('fluent_cart/price_class', function($class) {
    // Add custom CSS class to price container element
    return 'price fct-custom-price';
}, 10, 1);
```

---

### `front_url_slug`
`fluent_cart/front_url_slug` — Filter product URL slug

* **When it runs:** Applied when registering `fluent-products` CPT to change URL slug for permalinks. Default comes from store settings (`'item'`).
* **Source:** `app/CPT/FluentProducts.php` (line 181)

#### Parameters:
* `$slug` *(string)* — Product URL slug
* `$data` *(array)* — Context data (empty array)
* **Returns:** *(string)* — Modified URL slug

#### Usage Example:
```php
// Filter product custom post type URL permalink slug
add_filter('fluent_cart/front_url_slug', function($slug) {
    // Change product permalink base slug from item to shop
    return 'shop';
}, 10, 1);
```

---

### `product_url_with_front`
`fluent_cart/product_url_with_front` — Filter whether product URL includes front base

* **When it runs:** Applied when registering `fluent-products` CPT rewrite rules. Controls whether permalink front base (e.g. `/blog/`) is prepended.
* **Source:** `app/CPT/FluentProducts.php` (line 183)

#### Parameters:
* `$withFront` *(bool)* — Whether to prepend permalink front base (default: `true`)
* `$data` *(array)* — Context data (`['slug' => string]`)
* **Returns:** *(bool)* — Modified boolean value

#### Usage Example:
```php
// Filter whether product permalinks include site front base prefix
add_filter('fluent_cart/product_url_with_front', function($withFront, $data) {
    // Remove permalink front base from product URLs
    return false;
}, 10, 2);
```

---

### `show_standalone_product_menu`
`fluent_cart/show_standalone_product_menu` — Filter whether to show standalone Products menu in WP admin

* **When it runs:** Applied during init when registering `fluent-products` CPT. When enabled, adds a separate "Products" sidebar menu.
* **Source:** `app/CPT/FluentProducts.php` (line 37)

#### Parameters:
* `$show` *(bool)* — Whether to show standalone menu (default: `false`)
* **Returns:** *(bool)* — Modified boolean value

#### Usage Example:
```php
// Filter whether to display standalone Products menu in WP admin sidebar
add_filter('fluent_cart/show_standalone_product_menu', function($show) {
    // Enable standalone Products CPT menu in WP admin
    return true;
}, 10, 1);
```

---

### `single_product_page/show_relevant_products`
`fluent_cart/single_product_page/show_relevant_products` — Filter showing related products on single product page

* **When it runs:** Applied when rendering single product page content after checking `show_relevant_product_in_single_page` store setting.
* **Source:** `app/Modules/Templating/TemplateActions.php` (line 240)

#### Parameters:
* `$show` *(bool)* — Whether to show related products
* `$postId` *(int)* — Current product post ID
* **Returns:** *(bool)* — Modified boolean value

#### Usage Example:
```php
// Filter whether to show related products section on single product page
add_filter('fluent_cart/single_product_page/show_relevant_products', function($show, $postId) {
    // Hide related products for specific product IDs
    $excludedIds = [100, 200, 300];
    if (in_array($postId, $excludedIds)) {
        return false;
    }
    return $show;
}, 10, 2);
```

---

### `disable_auto_single_product_page`
`fluent_cart/disable_auto_single_product_page` — Disable automatic single product page rendering

* **When it runs:** Applied when filtering title and content for single product pages. When true, prevents FluentCart from auto-injecting layout HTML.
* **Source:** `app/Modules/Templating/TemplateActions.php` (lines 191, 215)

#### Parameters:
* `$disable` *(bool)* — Whether to disable auto-rendering (default: `false`)
* **Returns:** *(bool)* — Modified boolean value

#### Usage Example:
```php
// Filter whether to disable automatic single product page template rendering
add_filter('fluent_cart/disable_auto_single_product_page', function($disable) {
    // Disable automatic rendering when Elementor page builder is active
    if (class_exists('Elementor\Plugin')) {
        return true;
    }
    return $disable;
}, 10, 1);
```

---

## Coupons

### `coupon/validating_coupon`
`fluent_cart/coupon/validating_coupon` — Filter coupon code during validation

* **When it runs:** Applied at the start of coupon validation before database lookup. Modify code string or return `WP_Error` to reject.
* **Source:** `app/Services/Coupon/Concerns/CanValidateCoupon.php` (line 21)

#### Parameters:
* `$couponCode` *(string)* — Coupon code being validated
* `$data` *(array)* — Context data (`['coupon_code' => string, 'line_items' => array, 'couponService' => CouponService]`)
* **Returns:** *(string|\WP_Error)* — Modified coupon code, or `WP_Error` to reject

#### Usage Example:
```php
// Filter coupon code string at start of validation
add_filter('fluent_cart/coupon/validating_coupon', function($couponCode, $data) {
    // Normalize coupon code string to uppercase
    $couponCode = strtoupper(trim($couponCode));

    // Reject blocked coupon codes with error message
    $blockedCodes = ['EXPIRED2024', 'TESTONLY'];
    if (in_array($couponCode, $blockedCodes)) {
        return new \WP_Error('coupon_blocked', __('This coupon code is no longer valid.', 'fluent-cart'));
    }

    return $couponCode;
}, 10, 2);
```

---

### `coupon/can_use_coupon`
`fluent_cart/coupon/can_use_coupon` — Filter whether a coupon can be used

* **When it runs:** Applied after coupon is found in database but before discount calculation to run custom eligibility checks.
* **Source:** `app/Services/Coupon/DiscountService.php` (line 257)

#### Parameters:
* `$canUse` *(bool)* — Whether coupon can be used (default: `true`)
* `$data` *(array)* — Context data (`['coupon' => Coupon, 'cart' => Cart, 'cart_items' => array]`)
* **Returns:** *(bool|\WP_Error)* — `true` to allow, `false` or `WP_Error` to reject

#### Usage Example:
```php
// Filter whether a validated coupon can be applied to current cart
add_filter('fluent_cart/coupon/can_use_coupon', function($canUse, $data) {
    // Extract coupon model and cart model from context
    $coupon = $data['coupon'];
    $cart = $data['cart'];

    // Enforce minimum cart subtotal requirement of $50
    if ($cart->sub_total < 5000) {
        return new \WP_Error(
            'coupon_min_total',
            __('This coupon requires a minimum order of $50.', 'fluent-cart')
        );
    }

    return $canUse;
}, 10, 2);
```

---

### `coupon/will_skip_item`
`fluent_cart/coupon/will_skip_item` — Filter whether item is skipped from coupon discount

* **When it runs:** Applied for each cart item when filtering applicable items. Returning true excludes item from discount calculation.
* **Source:** `app/Services/Coupon/DiscountService.php` (line 279)

#### Parameters:
* `$willSkip` *(bool)* — Whether to skip item (default: `false`)
* `$data` *(array)* — Context data (`['item' => array, 'coupon' => Coupon, 'cart' => Cart]`)
* **Returns:** *(bool)* — `true` to exclude item from coupon discount

#### Usage Example:
```php
// Filter whether specific cart item is skipped from coupon discount
add_filter('fluent_cart/coupon/will_skip_item', function($willSkip, $data) {
    // Extract cart item array from context
    $item = $data['item'];

    // Exclude gift card product types from coupon discount calculation
    if (!empty($item['product_type']) && $item['product_type'] === 'gift_card') {
        return true;
    }

    return $willSkip;
}, 10, 2);
```

---

### `coupon/per_customer_usage_query`
`fluent_cart/coupon/per_customer_usage_query` — Filter per-customer coupon usage query

* **When it runs:** Applied when checking if customer exceeded per-customer usage limit for coupon to modify previous usage count query.
* **Source:** `app/Services/Coupon/DiscountService.php` (line 592)

#### Parameters:
* `$usageQuery` *(\FluentCart\Framework\Database\Orm\Builder)* — Eloquent query builder for `AppliedCoupon` records
* `$data` *(array)* — Context data (`['coupon' => Coupon, 'customer' => Customer, 'cart' => Cart]`)
* **Returns:** *(\FluentCart\Framework\Database\Orm\Builder)* — Modified query builder

#### Usage Example:
```php
// Filter per-customer coupon usage limit Eloquent query
add_filter('fluent_cart/coupon/per_customer_usage_query', function($usageQuery, $data) {
    // Restrict usage check query to last 30 days for rolling limits
    $usageQuery->where('created_at', '>=', gmdate('Y-m-d H:i:s', strtotime('-30 days')));
    return $usageQuery;
}, 10, 2);
```

---

### `coupon_statuses` (legacy)
`fluent-cart/coupon_statuses` — Filter available coupon statuses

* **When it runs:** Applied when retrieving available coupon statuses for admin coupon management interface. Note hyphenated prefix (`fluent-cart/`).
* **Source:** `app/Helpers/Helper.php` (line 823)

#### Parameters:
* `$statuses` *(array)* — Array of coupon statuses (`'active' => 'Active'`, `'expired' => 'Expired'`, `'disabled' => 'Disabled'`)
* `$data` *(array)* — Context data (empty array)
* **Returns:** *(array)* — Modified coupon statuses array

#### Usage Example:
```php
// Filter available coupon statuses array (legacy hyphenated hook name)
add_filter('fluent-cart/coupon_statuses', function($statuses) {
    // Add custom "Scheduled" coupon status
    $statuses['scheduled'] = __('Scheduled', 'fluent-cart');
    return $statuses;
}, 10, 1);
```
