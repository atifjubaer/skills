# Products & Pricing

All filters related to [Product](/database/models/product.md) display, catalog management, pricing, stock, URLs, and [Coupon](/database/models/coupon.md)s.

---

## Product Display & Layout

### ` products_list `

`fluent_cart/products_list` — Filter the admin products list

**When it runs:** This filter is applied after fetching the paginated products collection in the admin products list view.

**Parameters:**

- `$products` (LengthAwarePaginator): The paginated products collection with appended `view_url` and `edit_url` attributes

**Returns:**

- `$products` (LengthAwarePaginator): The modified paginated collection

**Source:** `app/Http/Controllers/ProductController.php:59`

**Usage:**

```
add_filter('fluent_cart/products_list', function($products) {
    // Modify the products collection before it is returned to the admin
    $products->getCollection()->transform(function ($product) {
        $product->custom_badge = 'Featured';
        return $product;
    });
    return $products;
}, 10, 1);
```

### ` shop_query `

`fluent_cart/shop_query` — Filter the shop product query builder

**When it runs:** This filter is applied when building the query for the public-facing shop product listing, before search, status, and sorting clauses are added.

**Parameters:**

- `$query` (Builder): The Eloquent query builder instance with `select` and `with` already applied
- `$params` (array): The query parameters array

```
$params = [
    'select'               => '*',
    'with'                 => [],
    'admin_all_statuses'   => [],
    'selected_status'      => '',
    // ...additional request parameters
];
```

**Returns:**

- `$query` (Builder): The modified query builder

**Source:** `api/Resource/ShopResource.php:100`

**Usage:**

```
add_filter('fluent_cart/shop_query', function($query, $params) {
    // Only show products from a specific category
    $query->whereHas('taxonomies', function ($q) {
        $q->where('taxonomy', 'product-category')
          ->where('term_id', 5);
    });
    return $query;
}, 10, 2);
```

### ` single_product/variation_view_type `

`fluent_cart/single_product/variation_view_type` — Filter the variation display type on single product pages

**When it runs:** This filter is applied when initializing the product renderer to determine how variations are visually presented on the single product page.

**Parameters:**

- `$viewType` (string): The variation view type. Possible values: `'image'`, `'text'`, `'both'`
- `$data` (array): Context data

```
$data = [
    'product'            => $product,       // Product model
    'variants'           => $variants,       // Collection of variants
    'defaultVariationId' => $defaultVariationId // Default selected variation ID
];
```

**Returns:**

- `$viewType` (string): The modified view type

**Source:** `app/Services/Renderer/ProductRenderer.php:67`

**Usage:**

```
add_filter('fluent_cart/single_product/variation_view_type', function($viewType, $data) {
    // Always show both image and text for variations
    return 'both';
}, 10, 2);
```

### ` single_product/variation_column_type `

`fluent_cart/single_product/variation_column_type` — Filter the variation column layout on single product pages

**When it runs:** This filter is applied when initializing the product renderer to determine the column layout for product variations.

**Parameters:**

- `$columnType` (string): The column layout type. Possible values: `'one'`, `'two'`, `'three'`, `'four'`, `'masonry'`
- `$data` (array): Context data

```
$data = [
    'product'            => $product,       // Product model
    'variants'           => $variants,       // Collection of variants
    'defaultVariationId' => $defaultVariationId // Default selected variation ID
];
```

**Returns:**

- `$columnType` (string): The modified column type

**Source:** `app/Services/Renderer/ProductRenderer.php:74`

**Usage:**

```
add_filter('fluent_cart/single_product/variation_column_type', function($columnType, $data) {
    $product = $data['product'];
    // Use two-column layout for products with many variations
    if (count($data['variants']) > 6) {
        return 'two';
    }
    return $columnType;
}, 10, 2);
```

### ` single_product/variation_price `

`fluent_cart/single_product/variation_price` — Filter the variation price text displayed on single product pages

**When it runs:** This filter is applied when rendering the price text for each product variation. For one-time products the price is the formatted decimal amount; for subscriptions it includes the billing terms text.

**Parameters:**

- `$priceText` (string): The formatted price text (escaped HTML)
- `$data` (array): Context data

```
$data = [
    'product' => $product,   // Product model
    'variant' => $variant,   // ProductVariant model
    'scope'   => 'product_variant_price'
];
```

**Returns:**

- `$priceText` (string): The modified price text (HTML allowed via `wp_kses_post`)

**Source:** `app/Services/Renderer/ProductRenderer.php:1213`

**Usage:**

```
add_filter('fluent_cart/single_product/variation_price', function($priceText, $data) {
    $variant = $data['variant'];
    // Append a "per month" label for subscription variants
    if ($variant->payment_type === 'subscription') {
        return $priceText . ' <small>/month</small>';
    }
    return $priceText;
}, 10, 2);
```

### ` shop_app_product_query_taxonomy_filters `

`fluent_cart/shop_app_product_query_taxonomy_filters` — Filter taxonomy filters for the Shop block product query

**When it runs:** This filter is applied in the Shop App Gutenberg block when merging URL-based taxonomy filters with default block filters, before the product query is executed.

**Parameters:**

- `$mergedTerms` (array): Merged taxonomy term IDs keyed by taxonomy name

```
$mergedTerms = [
    'product-category' => [1, 5, 12],
    'product-tag'      => [3, 7]
];
```

- `$data` (array): Context data

```
$data = [
    'default_terms'   => $defaultTerms,   // Terms from block settings
    'url_terms'       => $urlTerms,        // Terms from URL query parameters
    'url_filters'     => $urlFilters,      // Raw URL filter parameters
    'default_filters' => $defaultFilters,  // Raw block default filters
    'block'           => $block,           // Block instance
    'is_main_query'   => true|false        // Whether this is the main query
];
```

**Returns:**

- `$mergedTerms` (array): The modified taxonomy term IDs array

**Source:** `app/Hooks/Handlers/BlockEditors/ShopApp/InnerBlocks/InnerBlocks.php:1379`

**Usage:**

```
add_filter('fluent_cart/shop_app_product_query_taxonomy_filters', function($mergedTerms, $data) {
    // Always exclude a specific category from shop listings
    if (isset($mergedTerms['product-category'])) {
        $mergedTerms['product-category'] = array_diff($mergedTerms['product-category'], [99]);
    }
    return $mergedTerms;
}, 10, 2);
```

### ` products_views/preload_collection_{$provider} `

`fluent_cart/products_views/preload_collection_{$provider}` — Preload product view collection for a template provider

**When it runs:** This dynamic filter is applied when the shop controller loads products via AJAX for a specific template provider (e.g., `bricks`). The `{$provider}` portion is replaced with the template provider name from the request.

**Parameters:**

- `$html` (string): Default empty string. Return rendered HTML to use the preloaded view instead of JSON
- `$data` (array): Context data

```
$data = [
    'client_id'   => $clientId,    // Client identifier from the request
    'products'    => $products,     // Array of product data
    'total'       => $total,        // Total number of products
    'requestData' => $requestData   // Full request parameters
];
```

**Returns:**

- `$html` (string): Rendered HTML string, or empty string to fall back to default JSON response

**Source:** `app/Http/Controllers/ShopController.php:133`

**Usage:**

```
add_filter('fluent_cart/products_views/preload_collection_bricks', function($html, $data) {
    // Return custom rendered HTML for Bricks page builder
    ob_start();
    foreach ($data['products'] as $product) {
        echo '<div class="custom-product-card">' . esc_html($product['title']) . '</div>';
    }
    return ob_get_clean();
}, 10, 2);
```

### ` product/card_classes `

`fluent_cart/product/card_classes` — Filter the CSS classes on a product card wrapper

**When it runs:** This filter is applied by `RenderGate::cardClasses()` whenever a product card is rendered (shop listing, related products, carousel, etc.), just before the class list is imploded into the `class` attribute on the card `` element.

**Parameters:**

- `$classes` (array): The CSS class strings for the card wrapper
- `$context` (array): Render context, decorated by `RenderContext::decorate()`

```
$context = [
    'product' => $product, // Product model, or null
    'scope'   => 'card',   // RenderGate::SCOPE_CARD
    // ...additional keys added by RenderContext::decorate()
];
```

**Returns:**

- `$classes` (array): The modified array of CSS class strings. A non-array return is treated as an empty class list.

**Source:** `app/Services/Renderer/RenderGate.php:142`

**Usage:**

```
add_filter('fluent_cart/product/card_classes', function($classes, $context) {
    $product = $context['product'] ?? null;
    if ($product && $product->detail->variation_type === 'advanced_variations') {
        $classes[] = 'fct-has-advanced-variations';
    }
    return $classes;
}, 10, 2);
```

### ` product/display_price `

`fluent_cart/product/display_price` — Filter the price shown on a product card or single product page

**When it runs:** This filter is applied after the renderer resolves the lowest/default variation price to display — on the shop/related product card (`ProductCardRender`) and on the single product page (`ProductRenderer`). Amounts are in cents; the caller casts the filtered result back to `int`.

**Parameters:**

- `$price` (int): The resolved display price, in cents
- `$data` (array): Context data

```
$data = [
    'product'   => $product,   // Product model
    'variation' => $variation, // ProductVariation model (the matched/first variant)
];
```

**Returns:**

- `$price` (int): The modified price, in cents

**Source:** `app/Services/Renderer/ProductCardRender.php:272`, `app/Services/Renderer/ProductRenderer.php:992`

**Usage:**

```
add_filter('fluent_cart/product/display_price', function($price, $data) {
    // Show a 10% "member price" preview for logged-in customers
    if (is_user_logged_in()) {
        return (int) round($price * 0.9);
    }
    return $price;
}, 10, 2);
```

### ` product/gallery_variation_data `

`fluent_cart/product/gallery_variation_data` — Filter the variant-to-gallery-image mapping for advanced-variation products

**When it runs:** This filter is applied only for products using the advanced-variation type (`Helper::PRODUCT_TYPE_ADVANCE_VARIATION`), while the product renderer builds its image gallery. It lets an integrator (Pro's advanced-variation module) supply the maps that associate each variant term / variant combination with specific gallery media.

**Parameters:**

- `$data` (array): Default empty maps

```
$data = [
    'variant_term_map'        => [], // term_id => [media info] or similar mapping
    'variant_first_media_map' => [], // variation_id => first media item for that variant
];
```

- `$product` ([Product](/database/models/product.md)): The product being rendered

**Returns:**

- `$data` (array): The modified `variant_term_map` / `variant_first_media_map` maps. Read back as `$this->variantTermMap` and `$variantFirstMediaMap` by the renderer.

**Source:** `app/Services/Renderer/ProductRenderer.php:467`

**Usage:**

```
add_filter('fluent_cart/product/gallery_variation_data', function($data, $product) {
    // Populate a custom first-media map built from variant meta
    foreach ($product->variants as $variant) {
        if (!empty($variant->other_info['gallery_image_id'])) {
            $data['variant_first_media_map'][$variant->id] = $variant->other_info['gallery_image_id'];
        }
    }
    return $data;
}, 10, 2);
```

### ` product/get_response_data `

`fluent_cart/product/get_response_data` — Filter the admin product editor's "get product" API response payload

**When it runs:** This filter is applied in the admin product controller right before the single-product edit response is sent to the Vue admin app, after the product model has been converted to an array.

**Parameters:**

- `$payload` (array): The response payload

```
$payload = [
    'product'    => $productData, // array, from $product->toArray() plus 'featured_image_id'
    'product_id' => 123,          // int
    'request'    => $request,     // \FluentCart\Framework\Http\Request\Request instance
];
```

**Returns:**

- `$payload` (array): The modified payload. Only `$payload['product']` is read back by the caller (via `Arr::get($payload, 'product', $productData)`); other keys are for the listener's own use.

**Source:** `app/Http/Controllers/ProductController.php:799`

**Usage:**

```
add_filter('fluent_cart/product/get_response_data', function($payload) {
    // Attach a computed field the admin UI can render
    $payload['product']['review_count'] = get_review_count_for_product($payload['product_id']);
    return $payload;
}, 10, 1);
```

### ` product/price_suffix_context `

`fluent_cart/product/price_suffix_context` — Filter the context passed to the price suffix renderer

**When it runs:** This filter is applied at the start of `RenderHelper::renderPriceSuffix()`, before the context is handed to `fluent_cart/product/price_suffix_atts` (the filter that actually returns the suffix text, e.g. the Tax module's "incl. tax" label).

**Parameters:**

- `$context` (array): The suffix render context

```
$context = [
    'product' => $product, // Product model
    'variant' => $variant, // ProductVariant model
    'scope'   => $scope,   // e.g. 'variant_item'
];
```

**Returns:**

- `$context` (array): The modified context array, passed straight through to `fluent_cart/product/price_suffix_atts`

**Source:** `app/Services/Renderer/RenderHelper.php:20`

**Usage:**

```
add_filter('fluent_cart/product/price_suffix_context', function($context) {
    // Flag wholesale variants so a listener on price_suffix_atts can react
    $context['is_wholesale'] = !empty($context['variant']->other_info['wholesale']);
    return $context;
}, 10, 1);
```

### ` product/render_advanced_variation `

`fluent_cart/product/render_advanced_variation` — Let an add-on render the variation selector for advanced-variation products

**When it runs:** This filter is applied by the single-product renderer, but only when the product's variation type is the advanced-variation type. It is the hand-off point that lets FluentCart Pro's advanced-variation selector replace the core's simple-variation markup entirely.

**Parameters:**

- `$result` (array): Render request/result

```
$result = [
    'product'        => $this->product, // Product model
    'selector_style' => 'auto',         // from render atts, default 'auto'
    'rendered'       => false,          // set true to signal the listener rendered the selector
];
```

**Returns:**

- `$result` (array): The same shape back. **The core renderer only skips its own simple-variation output when `$result['rendered']` is truthy** — a listener that filters other keys but leaves `rendered` at `false` is a no-op and the default selector still renders.

**Source:** `app/Services/Renderer/ProductRenderer.php:350`

**Usage:**

```
add_filter('fluent_cart/product/render_advanced_variation', function($result) {
    // Echo a custom selector and take over rendering
    echo '<div class="my-advanced-variation-selector" data-product-id="' . esc_attr($result['product']->ID) . '"></div>';
    $result['rendered'] = true;
    return $result;
}, 10, 1);
```

### ` product/render_source `

`fluent_cart/product/render_source` — Filter which render source/provider is currently active

**When it runs:** This filter is applied by `RenderContext` whenever code needs to know which template provider is currently rendering product markup (e.g. the classic PHP renderer vs. a page-builder integration like Bricks). It has no natural default source of truth, so it always starts from an "unknown" fallback and relies entirely on a listener to identify itself.

**Parameters:**

- `$fallback` (array): The default value

```
$fallback = [
    'source' => 'unknown', // RenderContext::SOURCE_UNKNOWN
    'name'   => '',
];
```

**Returns:**

- `array` — Must include a non-empty `'source'` key to be accepted; otherwise the `$fallback` is used. `'name'` is cast to string.

**Source:** `app/Services/Renderer/RenderContext.php:89`

**Usage:**

```
add_filter('fluent_cart/product/render_source', function($fallback) {
    if (defined('BRICKS_VERSION') && bricks_is_builder()) {
        return ['source' => 'bricks', 'name' => 'Bricks Builder'];
    }
    return $fallback;
}, 10, 1);
```

### ` product/show_section `

`fluent_cart/product/show_section` — Generic filter for whether any product render section should be shown

**When it runs:** This filter is applied by `RenderGate::shouldRender()` immediately after the section-specific `fluent_cart/product/show_{$section}` filter (see below) has run, receiving that filter's result. Use this one when you want to gate visibility across *every* section from a single callback instead of hooking each section name individually.

**Parameters:**

- `$show` (bool): The visibility decision from the section-specific filter
- `$context` (array): Render context (decorated via `RenderContext::decorate()`), includes the product, scope, and the section being gated

**Returns:**

- `bool` — Whether the section should render

**Source:** `app/Services/Renderer/RenderGate.php:109`

**Usage:**

```
add_filter('fluent_cart/product/show_section', function($show, $context) {
    // Hide every card section for products tagged "coming-soon"
    $product = $context['product'] ?? null;
    if ($product && $product->hasTerm('coming-soon', 'product-tag')) {
        return false;
    }
    return $show;
}, 10, 2);
```

### ` product/show_{$section} `

`fluent_cart/product/show_{$section}` — Filter whether a specific product render section should be shown

**When it runs:** This dynamic filter is applied first inside `RenderGate::shouldRender()`, before the generic `fluent_cart/product/show_section` filter above wraps its result. The `{$section}` portion is the section name being gated.

**`{$section}` values:** `RenderGate::SECTIONS` is a fixed set of 9 — `image`, `title`, `excerpt`, `price`, `quantity`, `actions`, `add_to_cart_button`, `buy_now_button`, `buy_section`. That gives the concrete hook names `fluent_cart/product/show_image`, `show_title`, `show_excerpt`, `show_price`, `show_quantity`, `show_actions`, `show_add_to_cart_button`, `show_buy_now_button`, `show_buy_section`.

Note: `actions` gates the whole purchase-actions row, and `shouldRenderPurchaseButton()` requires that row to be visible before `add_to_cart_button` or `buy_now_button` can render individually — hiding `actions` hides the buttons too, even if their own gates return `true`.

**Parameters:**

- `$show` (bool): Whether the section should render. Default: `true`
- `$context` (array): Render context (decorated via `RenderContext::decorate()`), includes the product and scope

**Returns:**

- `bool` — Whether this section should render

**Source:** `app/Services/Renderer/RenderGate.php:107`

**Usage:**

```
add_filter('fluent_cart/product/show_title', function($show, $context) {
    // Hide the title block on the card, but keep it on the single page
    if (($context['scope'] ?? '') === 'card') {
        return false;
    }
    return $show;
}, 10, 2);
```

---

## Product Reviews

### ` reviews/star_svg `

`fluent_cart/reviews/star_svg` — Replace the SVG star used for every server-rendered rating

**When it runs:** This filter runs inside `ReviewThreadMarkup::starSvg()`. Every storefront star the server renders comes from that method:

- the reviews summary, each review, the rating bars and the star filter chips on the single product page
- the star picker in the review form
- the star row on product cards ("show rating in shop") and in the Product Rating block, including half stars
- the review list blocks and the AJAX `stars_html` response

The default markup is read from `app/Views/icons/review-star.svg` and kept in a static cache for the request. The filter still runs on **every call**, so a listener can return different markup for each render.

Server-rendered stars only

The admin Reviews screen, the block editor previews and the customer portal's My Reviews page import the star shape in the browser, from the same `review-star.svg` file. This filter does not reach them.

Review emails do not use it either. They still print the text characters `&#9733;` / `&#9734;`, because Gmail and Outlook strip inline SVG.

**Parameters:**

- `$svg` (string): The full `` markup for a single star.

```
$svg = '<svg class="fct-star-svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M11.16 3.47Q12 1.65 ..."/></svg>';
```

**Returns:**

- `string` — The SVG markup to render for each star.

Keep the class, fill and size

The star CSS depends on three things in the default markup: the `fct-star-svg` class, `fill="currentColor"`, and `width`/`height` of `1em`. Filled, empty and half-star colors are applied through `currentColor`. A half star clips a 50%-wide wrapper around the SVG. Keep all three in your replacement, or the colors, sizing and half-star clipping will break.

Output is not escaped

The filtered value is echoed as-is, the same way the built-in star is. Return only trusted, static SVG markup and never pass user input through this filter.

**Source:** `app/Services/Renderer/ReviewThreadMarkup.php:455`

**Usage:**

```
// Draw ratings as dots instead of stars
add_filter('fluent_cart/reviews/star_svg', function ($svg) {
    return '<svg class="fct-star-svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/></svg>';
});
```

```
// Keep the default star but add a class to it for custom styling
add_filter('fluent_cart/reviews/star_svg', function ($svg) {
    return str_replace('class="fct-star-svg"', 'class="fct-star-svg my-theme-star"', $svg);
});
```

---

## Product Buttons & Text

### ` product/buy_now_button_text `

`fluent_cart/product/buy_now_button_text` — Filter the Buy Now button text

**When it runs:** This filter is applied when rendering the "Buy Now" button on single product pages. It runs in both the PHP product renderer and when localizing JavaScript variables for the frontend.

**Parameters:**

- `$text` (string): The button text. Default: `'Buy Now'` (translated)
- `$data` (array): Context data

```
$data = [
    'product' => $product // Product model (when rendered server-side)
];
```

**Returns:**

- `$text` (string): The modified button text

**Source:** `app/Services/Renderer/ProductRenderer.php:1500,1606`, `app/Modules/Templating/AssetLoader.php:87,261`

**Usage:**

```
add_filter('fluent_cart/product/buy_now_button_text', function($text, $data) {
    // Customize Buy Now text for specific products
    if (!empty($data['product']) && $data['product']->product_type === 'digital') {
        return 'Download Now';
    }
    return $text;
}, 10, 2);
```

### ` product/add_to_cart_text `

`fluent_cart/product/add_to_cart_text` — Filter the Add to Cart button text

**When it runs:** This filter is applied when rendering the "Add to Cart" button text across multiple contexts: single product pages, shop blocks, product carousels, shortcodes, and localized JavaScript variables.

**Parameters:**

- `$text` (string): The button text. Default: `'Add To Cart'` (translated)
- `$data` (array): Context data

```
$data = [
    'product' => $product // Product model (when rendered server-side)
];
```

**Returns:**

- `$text` (string): The modified button text

**Source:** `app/Services/Renderer/ProductRenderer.php:1659,1775`, `app/Hooks/Handlers/ShortCodes/SingleProductShortCode.php:81`, `app/Hooks/Handlers/BlockEditors/ShopApp/InnerBlocks/InnerBlocks.php:1025,1104`, `app/Modules/Templating/AssetLoader.php:83,258`, `app/Hooks/Handlers/BlockEditors/ProductCarousel/InnerBlocks/InnerBlocks.php:493`

**Usage:**

```
add_filter('fluent_cart/product/add_to_cart_text', function($text, $data) {
    // Change to a different label
    return 'Add to Basket';
}, 10, 2);
```

### ` product/out_of_stock_text `

`fluent_cart/product/out_of_stock_text` — Filter the out-of-stock button text

**When it runs:** This filter is applied when rendering the button text for products that are out of stock. It is used across shortcodes, shop blocks, product carousels, and localized JavaScript variables.

**Parameters:**

- `$text` (string): The out-of-stock text. Default: `'Not Available'` (translated)
- `$data` (array): Context data (empty array)

**Returns:**

- `$text` (string): The modified out-of-stock text

**Source:** `app/Hooks/Handlers/ShortCodes/SingleProductShortCode.php:91`, `app/Hooks/Handlers/BlockEditors/ShopApp/InnerBlocks/InnerBlocks.php:1027,1106`, `app/Modules/Templating/AssetLoader.php:85`, `app/Hooks/Handlers/BlockEditors/ProductCarousel/InnerBlocks/InnerBlocks.php:495`

**Usage:**

```
add_filter('fluent_cart/product/out_of_stock_text', function($text) {
    return 'Sold Out';
}, 10, 1);
```

### ` product/out_of_stock_button_text `

`fluent_cart/product/out_of_stock_button_text` — Filter the out-of-stock button text (block editor variant)

**When it runs:** This filter is applied in the block editor asset loader when localizing the out-of-stock button text for JavaScript-rendered product pages. It serves the same purpose as `out_of_stock_text` but is used in a different rendering context.

**Parameters:**

- `$text` (string): The out-of-stock text. Default: `'Not Available'` (translated)
- `$data` (array): Context data (empty array)

**Returns:**

- `$text` (string): The modified out-of-stock button text

**Source:** `app/Modules/Templating/AssetLoader.php:314`

**Usage:**

```
add_filter('fluent_cart/product/out_of_stock_button_text', function($text) {
    return 'Currently Unavailable';
}, 10, 1);
```

### ` product/price_suffix_atts `

`fluent_cart/product/price_suffix_atts` — Filter the price suffix for product variations

**When it runs:** This filter is applied when rendering each variation item in the variation selector. The Tax module hooks into this filter to append a price suffix (e.g., "incl. tax") configured in tax settings.

**Parameters:**

- `$suffix` (string): The price suffix text. Default: `''` (empty string)
- `$data` (array): Context data

```
$data = [
    'product' => $product,   // Product model
    'variant' => $variant,   // ProductVariant model
    'scope'   => 'variant_item'
];
```

**Returns:**

- `$suffix` (string): The modified price suffix text

**Source:** `app/Services/Renderer/ProductRenderer.php:1408`

**Usage:**

```
add_filter('fluent_cart/product/price_suffix_atts', function($suffix, $data) {
    // Add a custom price suffix
    return ' incl. VAT';
}, 10, 2);
```

### ` product_short_description `

`fluent_cart/product_short_description` — Filter the product short description

**When it runs:** This filter is applied when rendering the short description section on the single product page, using the post excerpt as the default value.

**Parameters:**

- `$shortDescription` (string): The product short description (from `$post->post_excerpt`)
- `$data` (array): Context data (empty array)

**Returns:**

- `$shortDescription` (string): The modified short description (output via `wp_kses_post`)

**Source:** `app/Hooks/Handlers/TemplateLoader.php:26`

**Usage:**

```
add_filter('fluent_cart/product_short_description', function($shortDescription) {
    // Append a disclaimer to all product short descriptions
    return $shortDescription . '<p class="disclaimer">Prices subject to change.</p>';
}, 10, 1);
```

---

## Stock & Availability

### ` product_stock_availability `

`fluent_cart/product_stock_availability` — Filter product stock availability information

**When it runs:** This filter is applied when retrieving the stock availability data for a product from the `ProductDetail` model. It runs after the default availability is determined based on stock management settings and current stock levels.

**Parameters:**

- `$availability` (array): The stock availability data

```
// When stock is not managed:
$availability = [
    'manage_stock'       => false,
    'availability'       => 'In Stock',
    'class'              => 'in-stock',
    'available_quantity' => null
];

// When stock is managed and available:
$availability = [
    'manage_stock'       => true,
    'availability'       => 'In Stock',
    'class'              => 'in-stock',
    'available_quantity' => 25 // actual stock count
];

// When stock is managed and depleted:
$availability = [
    'manage_stock'       => true,
    'availability'       => 'Out of Stock',
    'class'              => 'out-of-stock',
    'available_quantity' => 0
];
```

- `$data` (array): Context data

```
$data = [
    'detail'       => $productDetail, // ProductDetail model instance
    'variation_id' => $variationId    // Variation ID or null
];
```

**Returns:**

- `$availability` (array): The modified availability data

**Source:** `app/Models/ProductDetail.php:183`

**Usage:**

```
add_filter('fluent_cart/product_stock_availability', function($availability, $data) {
    // Show "Low Stock" warning when fewer than 5 items remain
    if ($availability['manage_stock'] && $availability['available_quantity'] > 0 && $availability['available_quantity'] < 5) {
        $availability['availability'] = 'Only ' . $availability['available_quantity'] . ' left in stock!';
        $availability['class'] = 'low-stock';
    }
    return $availability;
}, 10, 2);
```

---

## Product URLs & Templates

### ` price_class `

`fluent_cart/price_class` — Filter the price element CSS class

**When it runs:** This filter is applied when rendering the price paragraph element on the single product page template.

**Parameters:**

- `$class` (string): The CSS class for the price element. Default: `'price'`

**Returns:**

- `$class` (string): The modified CSS class string

**Source:** `app/Hooks/Handlers/TemplateLoader.php:40`

**Usage:**

```
add_filter('fluent_cart/price_class', function($class) {
    // Add additional CSS classes to the price element
    return 'price fct-custom-price';
}, 10, 1);
```

### ` front_url_slug `

`fluent_cart/front_url_slug` — Filter the product URL slug

**When it runs:** This filter is applied when registering the `fluent-products` custom post type, allowing you to change the URL slug used for product permalinks.

**Parameters:**

- `$slug` (string): The product URL slug. Default comes from store settings, typically `'item'`
- `$data` (array): Context data (empty array)

**Returns:**

- `$slug` (string): The modified URL slug

**Source:** `app/CPT/FluentProducts.php:171`

**Note:** After changing the slug, you must flush rewrite rules (visit Settings > Permalinks in WP admin) for the change to take effect.

**Usage:**

```
add_filter('fluent_cart/front_url_slug', function($slug) {
    // Change product URLs from /item/product-name to /shop/product-name
    return 'shop';
}, 10, 1);
```

### ` product_url_with_front `

`fluent_cart/product_url_with_front` — Filter whether the product URL includes the front base

**When it runs:** This filter is applied when registering the `fluent-products` custom post type, immediately after `fluent_cart/front_url_slug` resolves the slug. The value is passed as the `with_front` argument to WordPress's `rewrite` option, controlling whether the site's permalink front base (e.g. `/blog/`) is prepended to product URLs.

**Parameters:**

- `$withFront` (bool): Whether to prepend the permalink front base. Default: `true`
- `$data` (array): Context data

```
$data = [
    'slug' => $urlSlug // The resolved product URL slug
];
```

**Returns:**

- `$withFront` (bool): The modified value

**Source:** `app/CPT/FluentProducts.php:172`

**Note:** After changing this value, flush rewrite rules by visiting Settings > Permalinks in the WordPress admin.

**Usage:**

```
add_filter('fluent_cart/product_url_with_front', function($withFront, $data) {
    // Remove the permalink front base from product URLs
    // e.g. /blog/products/my-item → /products/my-item
    return false;
}, 10, 2);
```

### ` show_standalone_product_menu `

`fluent_cart/show_standalone_product_menu` — Filter whether to show a standalone Products menu in the WordPress admin

**When it runs:** This filter is applied during the `init` action when FluentCart registers the product custom post type. When enabled, a separate "Products" menu item appears in the WordPress admin sidebar.

**Parameters:**

- `$show` (bool): Whether to show the standalone menu. Default: `false`

**Returns:**

- `$show` (bool): The modified boolean value

**Source:** `app/CPT/FluentProducts.php:37`

**Usage:**

```
add_filter('fluent_cart/show_standalone_product_menu', function($show) {
    // Show the standalone Products menu in WP admin
    return true;
}, 10, 1);
```

### ` single_product_page/show_relevant_products `

`fluent_cart/single_product_page/show_relevant_products` — Filter whether to show related products on the single product page

**When it runs:** This filter is applied when rendering the single product page content, after checking the store setting `show_relevant_product_in_single_page`. When enabled, similar products are displayed below the main product content.

**Parameters:**

- `$show` (bool): Whether to show related products. Default comes from store settings
- `$postId` (int): The current product post ID

**Returns:**

- `$show` (bool): The modified boolean value

**Source:** `app/Modules/Templating/TemplateActions.php:277`

**Usage:**

```
add_filter('fluent_cart/single_product_page/show_relevant_products', function($show, $postId) {
    // Disable related products for specific product IDs
    $excludedIds = [100, 200, 300];
    if (in_array($postId, $excludedIds)) {
        return false;
    }
    return $show;
}, 10, 2);
```

### ` related_products/query_args `

`fluent_cart/related_products/query_args` — Filter the `WP_Query` arguments used to build the related products list

**When it runs:** Applied inside `ShopResource::getSimilarProducts()`, after the default query arguments are assembled and the ordering (`orderby`/`order`, or the price-ordering `posts_clauses` filter) is resolved, but immediately before `new WP_Query($args)` runs. One code path backs all related-products surfaces, so this filter covers each of them: the `[fluent_cart_related_products]` shortcode, the related products block auto-appended to the single product page, the Related Product Gutenberg block, and the product REST endpoint's similar-products response.

Runs after price ordering is applied

When `config['order_by']` is a price sort, `applyPriceOrdering()` has already attached a `posts_clauses` filter by the time this filter runs. Setting `$args['orderby']`/`$args['order']` in that case will not override price ordering — that custom SQL still wins. This is a known limitation, not a bug.

**Parameters:**

- `$args` (array): The `WP_Query` arguments about to be used.

```
$args = [
    'post_type'      => $post->post_type,
    'post_status'    => 'publish',
    'posts_per_page' => 6,       // clamped 1-24, from $config['posts_per_page']
    'post__not_in'   => [$id],   // excludes the current product
    'tax_query'      => $taxQuery,
    'fields'         => 'ids',
    // 'orderby' / 'order' are present unless price ordering is active
];
```

- `$context` (array): Read-only context, not applied to the query directly.

```
$context = [
    'product_id' => $id,     // int
    'post'       => $post,   // WP_Post
    'config'     => $config, // array passed to getSimilarProducts()
];
```

**Returns:**

- `$args` (array): The modified `WP_Query` arguments.

**Source:** `api/Resource/ShopResource.php:346-356`

**Usage:**

```
// Exclude a specific product from every related-products surface
add_filter('fluent_cart/related_products/query_args', function ($args, $context) {
    $args['post__not_in'][] = 1722;
    return $args;
}, 10, 2);
```

```
// Exclude multiple products
add_filter('fluent_cart/related_products/query_args', function ($args) {
    $args['post__not_in'] = array_merge($args['post__not_in'], [1722, 1692]);
    return $args;
}, 10, 2);
```

Related

See [`single_product_page/show_relevant_products`](#single-product-page-show-relevant-products) to toggle related products on/off instead of changing the query.

### ` disable_auto_single_product_page `

`fluent_cart/disable_auto_single_product_page` — Disable automatic single product page rendering

**When it runs:** This filter is applied in two places: when filtering the post title and when filtering the post content for single product pages. When it returns `true`, FluentCart will not automatically inject product rendering into the default product page, allowing you to build the product page entirely with custom templates or page builders.

**Parameters:**

- `$disable` (bool): Whether to disable automatic rendering. Default: `false`

**Returns:**

- `$disable` (bool): The modified boolean value

**Source:** `app/Modules/Templating/TemplateActions.php:191,215`

**Usage:**

```
add_filter('fluent_cart/disable_auto_single_product_page', function($disable) {
    // Disable auto-rendering when using a custom page builder
    if (class_exists('Elementor\Plugin')) {
        return true;
    }
    return $disable;
}, 10, 1);
```

---

## Coupons

### ` coupon/validating_coupon `

`fluent_cart/coupon/validating_coupon` — Filter the coupon code during validation

**When it runs:** This filter is applied at the very beginning of coupon validation, before the coupon is looked up in the database. You can modify the coupon code string or return a `WP_Error` to reject it early.

**Parameters:**

- `$couponCode` (string): The coupon code being validated
- `$data` (array): Context data

```
$data = [
    'coupon_code'   => $couponCode,     // Original coupon code
    'line_items'    => $lineItems,       // Cart line items
    'couponService' => $couponService    // CouponService instance
];
```

**Returns:**

- `$couponCode` (string|WP_Error): The modified coupon code, or a `WP_Error` to reject

**Source:** `app/Services/Coupon/Concerns/CanValidateCoupon.php:21`

**Usage:**

```
add_filter('fluent_cart/coupon/validating_coupon', function($couponCode, $data) {
    // Normalize coupon codes to uppercase
    $couponCode = strtoupper(trim($couponCode));

    // Block specific coupon codes
    $blockedCodes = ['EXPIRED2024', 'TESTONLY'];
    if (in_array($couponCode, $blockedCodes)) {
        return new \WP_Error('coupon_blocked', __('This coupon code is no longer valid.', 'fluent-cart'));
    }

    return $couponCode;
}, 10, 2);
```

### ` coupon/can_use_coupon `

`fluent_cart/coupon/can_use_coupon` — Filter whether a coupon can be used

**When it runs:** This filter is applied after the coupon has been validated and found in the database, but before the discount is calculated. It allows you to add custom eligibility checks.

**Parameters:**

- `$canUse` (bool): Whether the coupon can be used. Default: `true`
- `$data` (array): Context data

```
$data = [
    'coupon'     => $coupon,     // Coupon model instance
    'cart'       => $cart,        // Cart model instance
    'cart_items' => $cartItems    // Array of cart item data
];
```

**Returns:**

- `$canUse` (bool|WP_Error): `true` to allow, `false` or `WP_Error` to reject. When a `WP_Error` is returned, its message is shown to the customer

**Source:** `app/Services/Coupon/DiscountService.php:299`

**Usage:**

```
add_filter('fluent_cart/coupon/can_use_coupon', function($canUse, $data) {
    $coupon = $data['coupon'];
    $cart = $data['cart'];

    // Require a minimum cart subtotal of $50 (5000 cents)
    if ($cart->sub_total < 5000) {
        return new \WP_Error(
            'coupon_min_total',
            __('This coupon requires a minimum order of $50.', 'fluent-cart')
        );
    }

    return $canUse;
}, 10, 2);
```

### ` coupon/will_skip_item `

`fluent_cart/coupon/will_skip_item` — Filter whether an item should be skipped from coupon discount

**When it runs:** This filter is applied for each cart item when filtering applicable items for a coupon discount. Returning `true` excludes the item from the coupon discount calculation.

**Parameters:**

- `$willSkip` (bool): Whether to skip this item. Default: `false`
- `$data` (array): Context data

```
$data = [
    'item'   => $item,    // Cart item array data
    'coupon' => $coupon,   // Coupon model instance
    'cart'   => $cart      // Cart model instance
];
```

**Returns:**

- `$willSkip` (bool): `true` to exclude the item from the coupon, `false` to include it

**Source:** `app/Services/Coupon/DiscountService.php:321`

**Usage:**

```
add_filter('fluent_cart/coupon/will_skip_item', function($willSkip, $data) {
    $item = $data['item'];

    // Never apply coupons to gift card items
    if (!empty($item['product_type']) && $item['product_type'] === 'gift_card') {
        return true;
    }

    return $willSkip;
}, 10, 2);
```

### ` coupon/per_customer_usage_query `

`fluent_cart/coupon/per_customer_usage_query` — Filter the per-customer coupon usage query

**When it runs:** This filter is applied when checking if a customer has exceeded the per-customer usage limit for a coupon. It allows you to modify the query that counts previous uses.

**Parameters:**

- `$usageQuery` (Builder): The Eloquent query builder for [`AppliedCoupon`](/database/models/applied-coupon.md) records, already filtered by coupon ID and customer ID
- `$data` (array): Context data

```
$data = [
    'coupon'   => $coupon,    // Coupon model instance
    'customer' => $customer,  // Customer model instance
    'cart'     => $cart       // Cart model instance
];
```

**Returns:**

- `$usageQuery` (Builder): The modified query builder

**Source:** `app/Services/Coupon/DiscountService.php:729`

**Usage:**

```
add_filter('fluent_cart/coupon/per_customer_usage_query', function($usageQuery, $data) {
    // Only count usage from the last 30 days (rolling usage limit)
    $usageQuery->where('created_at', '>=', gmdate('Y-m-d H:i:s', strtotime('-30 days')));
    return $usageQuery;
}, 10, 2);
```

### ` coupon/resolve_coupons `

`fluent_cart/coupon/resolve_coupons` — Filter the coupons resolved for a cart or order

**When it runs:** This filter is applied everywhere FluentCart resolves the [Coupon](/database/models/coupon.md) records that back a cart's or order's applied discount codes — on `Cart`, in `CheckoutProcessor` (when rebuilding an order from stored `coupon_codes`), and in `DiscountService::apply()`. It receives the coupons already found in the database plus the originally requested codes, and may append additional, unsaved `Coupon` model instances (e.g. representing a dynamic-pricing discount) so they appear in the cart/order's discount summary like any real coupon.

**Parameters:**

- `$coupons` (Collection): The DB-found [Coupon](/database/models/coupon.md) models
- `$codes` (array): The originally requested coupon code strings
- `$context` (array): Context data — the key differs by call site

```
// From Cart::getAppliedCoupons() / DiscountService::apply()
$context = ['cart' => $cart];

// From CheckoutProcessor (rebuilding an order)
$context = ['order' => $orderModel];
```

**Returns:**

- `Collection` — The modified collection of Coupon models (DB-found coupons plus any synthetic ones appended by a listener)

**Source:** `app/Services/Coupon/DiscountService.php:96`, `app/Models/Cart.php:767`, `app/Helpers/CheckoutProcessor.php:572`

**Usage:**

```
add_filter('fluent_cart/coupon/resolve_coupons', function($coupons, $codes, $context) {
    // Surface a computed loyalty discount as a synthetic, unsaved coupon
    if (in_array('LOYALTY10', $codes, true)) {
        $loyaltyCoupon = new \FluentCart\App\Models\Coupon([
            'code'          => 'LOYALTY10',
            'discount_type' => 'percent',
            'amount'        => 10,
        ]);
        $coupons->push($loyaltyCoupon);
    }
    return $coupons;
}, 10, 3);
```

### ` discount/pre_apply `

`fluent_cart/discount/pre_apply` — Filter the cart items before a coupon discount is applied

**When it runs:** This filter is applied at the start of `DiscountService::apply()`, before checking whether the coupon can be used and before the discount is calculated. It lets you adjust which items (and their data) the coupon will be evaluated and applied against.

**Parameters:**

- `$cartItems` (array): The cart line items
- `$data` (array): Context data

```
$data = [
    'coupon' => $coupon, // Coupon model instance being applied
    'cart'   => $cart,   // Cart model instance
];
```

**Returns:**

- `$cartItems` (array): The modified cart items array

**Source:** `app/Services/Coupon/DiscountService.php:227`

**Usage:**

```
add_filter('fluent_cart/discount/pre_apply', function($cartItems, $data) {
    // Exclude gift-card items from ever being eligible for a coupon
    return array_filter($cartItems, function ($item) {
        return ($item['product_type'] ?? '') !== 'gift_card';
    });
}, 10, 2);
```

### ` coupon_statuses `

`fluent_cart/coupon_statuses` — Filter the available coupon statuses

**When it runs:** Applied by `Helper::getCouponStatuses()` to the default coupon status map, and returns its result.

**Parameters:**

- `$statuses` (array): Array of coupon statuses (key => label)

```
$statuses = [
    'active'   => 'Active',
    'expired'  => 'Expired',
    'disabled' => 'Disabled',
];
```

- `$data` (array): Context data (empty array)

**Returns:**

- `$statuses` (array): The modified coupon statuses array

**Source:** `app/Helpers/Helper.php:1014`

**Usage:**

```
add_filter('fluent_cart/coupon_statuses', function($statuses) {
    $statuses['scheduled'] = __('Scheduled', 'fluent-cart');
    return $statuses;
}, 10, 1);
```

---

## Variant Options & Attributes

### ` attribute_groups/max_reorder `

`fluent_cart/attribute_groups/max_reorder` — Filter the maximum number of attribute groups allowed in one reorder request

**When it runs:** This filter is applied in the attribute groups reorder endpoint, before checking the submitted ID list against the cap. The attribute-group library is a small, admin-managed set, so the cap bounds a `whereIn` ownership lookup rather than reflecting a realistic catalog size.

**Parameters:**

- `$maxGroups` (int): The maximum reorder batch size. Default: `500`

**Returns:**

- `int` — The modified maximum

**Source:** `app/Http/Controllers/AttributesController.php:205`

**Usage:**

```
add_filter('fluent_cart/attribute_groups/max_reorder', function($maxGroups) {
    // Raise the cap for a store with an unusually large attribute library
    return 2000;
}, 10, 1);
```

### ` item_attributes `

`fluent_cart/item_attributes` — Filter the resolved attribute rows for a product variation

**When it runs:** This filter is applied by `AttributeHelper::getProductItemAttributes()` after resolving a variation's system attributes, letting a third-party plugin append its own attribute entries. A batched sibling call resolves attributes for many variations at once with a single query and applies the same filter per variation.

**Parameters:**

- `$atts` (array): The resolved attribute rows, keyed by attribute slug
- `$data` (array): Context data

```
$data = [
    'variation_id' => 42,  // int
    'product_id'   => 10,  // int
];
```

**Returns:**

- `$atts` (array): The modified attribute rows. Third-party attributes are conventionally appended without FluentCart's `pa_` system-attribute prefix, keyed by the provider's own group slug.

**Source:** `app/Helpers/AttributeHelper.php:138,191`

**Usage:**

```
add_filter('fluent_cart/item_attributes', function($atts, $data) {
    $atts['warranty'] = [
        'slug'  => 'warranty',
        'value' => '2-Year Extended Warranty',
    ];
    return $atts;
}, 10, 2);
```

### ` item_display_attr `

`fluent_cart/item_display_attr` — Filter the display-ready attribute rows for a line item

**When it runs:** This filter is applied after building the display rows for an item's attributes (cart line item, order item, etc.), before rows with an empty `display_value` are stripped out.

**Parameters:**

- `$displayAtts` (array): Display attribute rows, each shaped like:

```
$displayAtts = [
    'color' => [
        'display_title' => 'Color',
        'attr_key'      => 'color',
        'slug'          => 'red',
        'display_value' => 'Red',
        'is_system'     => true,
    ],
    // ...
];
```

- `$data` (array): Context data

```
$data = [
    'item'  => $item,  // the item array being described
    'scope' => $scope, // where this is being rendered (e.g. cart, order)
];
```

**Returns:**

- `$displayAtts` (array): The modified rows. A row that resolves to an empty `display_value` is dropped afterward, so a listener can opt an attribute out by clearing that key.

**Source:** `app/Helpers/AttributeHelper.php:346`

**Usage:**

```
add_filter('fluent_cart/item_display_attr', function($displayAtts, $data) {
    // Suppress an internal-only attribute from customer-facing display
    unset($displayAtts['internal_sku']);
    return $displayAtts;
}, 10, 2);
```

### ` item_display_attr_string `

`fluent_cart/item_display_attr_string` — Filter the combined attribute display string for a line item

**When it runs:** This filter is applied after building the default comma/separator-joined attribute string (e.g. `"Color: Red, Size: L"`) for an item, letting an integrator rebuild the combination text in a custom format using the resolved rows it also receives.

**Parameters:**

- `$displayTitleString` (string): The default joined attribute string
- `$data` (array): Context data

```
$data = [
    'display_atts' => $displayAtts, // the resolved display rows (see fluent_cart/item_display_attr)
    'item'         => $item,
    'scope'        => $scope,
    'separator'    => $separator,   // the default separator string
];
```

**Returns:**

- `$displayTitleString` (string): The modified string

**Source:** `app/Helpers/AttributeHelper.php:418`

**Usage:**

```
add_filter('fluent_cart/item_display_attr_string', function($displayTitleString, $data) {
    // Render each attribute on its own line instead of comma-separated
    return implode("\n", array_map(function ($attr) {
        return $attr['display_title'] . ': ' . $attr['display_value'];
    }, $data['display_atts']));
}, 10, 2);
```

### ` item_display_attr_{$key} `

`fluent_cart/item_display_attr_{$key}` — Filter one third-party attribute's display row

**When it runs:** This dynamic filter is applied once per non-system (third-party) attribute found on an item, right before it's added into the `$displayAtts` array consumed by `fluent_cart/item_display_attr`. The `{$key}` portion is the attribute's array key (its slug), letting a provider shape only the row(s) it owns.

**Parameters:**

- `$row` (array): The default display row for this attribute

```
$row = [
    'display_title' => $key,                             // defaults to the raw key
    'attr_key'      => $key,
    'slug'          => $value['slug'] ?? $key,
    'display_value' => $value['value'] ?? '',
    'is_system'     => false,
];
```

- `$data` (array): Context data

```
$data = [
    'attr'  => $value, // the raw attribute value array for this key
    'item'  => $item,
    'scope' => $scope,
];
```

**Returns:**

- `$row` (array): The modified display row. Return an empty `display_value` to have the row dropped by `fluent_cart/item_display_attr`.

**Source:** `app/Helpers/AttributeHelper.php:333`

**Usage:**

```
add_filter('fluent_cart/item_display_attr_warranty', function($row, $data) {
    $row['display_title'] = __('Warranty', 'my-addon');
    return $row;
}, 10, 2);
```

### ` product/variant_option_payload `

`fluent_cart/product/variant_option_payload` — Filter/pre-process the variant-option sync payload

**When it runs:** This filter is applied at the start of `ProductResource::syncVariantOption()`, before the submitted variant-option data is written. It lets an integrator transform the incoming payload before core processing runs.

**Parameters:**

- `$payload` (array): The sync request

```
$payload = [
    'product_id' => 10,    // int
    'data'       => $data, // array, the raw submitted variant-option data
];
```

**Returns:**

- `$payload` (array): Must include a `'data'` key to be accepted; if the returned value is not an array or has no `'data'` key, the original `$productId`/`$data` are used instead

**Source:** `api/Resource/ProductResource.php:569`

**Usage:**

```
add_filter('fluent_cart/product/variant_option_payload', function($payload) {
    // Normalize option labels to title case before they're synced
    if (!empty($payload['data']['label'])) {
        $payload['data']['label'] = ucwords($payload['data']['label']);
    }
    return $payload;
}, 10, 1);
```

### ` product/variant_option_sync `

`fluent_cart/product/variant_option_sync` — Let an add-on take over a variant-option sync request

**When it runs:** This filter is applied in `ProductResource::syncVariantOption()`, immediately after `fluent_cart/product/variant_option_payload` has pre-processed the payload. It's a short-circuit hook: if a listener marks the result `handled`, FluentCart's own sync logic never runs and the listener's `response` is returned as-is.

**Parameters:**

- `$result` (array): Sync state

```
$result = [
    'product_id' => 10,     // int
    'data'       => $data,  // array, the (possibly pre-processed) payload
    'handled'    => false,  // set true to short-circuit core handling
    'response'   => null,   // the value returned to the caller when handled
];
```

**Returns:**

- `$result` (array): The same shape back

**Source:** `api/Resource/ProductResource.php:578`

**Usage:**

```
add_filter('fluent_cart/product/variant_option_sync', function($result) {
    if (($result['data']['type'] ?? null) === 'my_custom_option_type') {
        $result['response'] = my_addon_sync_option($result['product_id'], $result['data']);
        $result['handled'] = true;
    }
    return $result;
}, 10, 1);
```

### ` product/variant_save_data `

`fluent_cart/product/variant_save_data` — Filter a single variant's data before a batch save

**When it runs:** This filter is applied once per variant while building the batch-update payload for a product's variants, immediately before the batch write runs inside a transaction.

**Parameters:**

- `$variant` (array): The variant's field data about to be saved
- `$postId` (int): The product's post ID

**Returns:**

- `$variant` (array): The modified variant data

**Source:** `api/Resource/ProductResource.php:281`

**Usage:**

```
add_filter('fluent_cart/product/variant_save_data', function($variant, $postId) {
    // Ensure a minimum price of $1.00 (100 cents) on every variant save
    if (isset($variant['item_price']) && $variant['item_price'] < 100) {
        $variant['item_price'] = 100;
    }
    return $variant;
}, 10, 2);
```

---

## Statuses & Types

### ` product_statuses `

`fluent_cart/product_statuses` — Filter the available product statuses

**When it runs:** This filter is applied in `Status::getProductStatuses()`. **Note:** in the current source, the `apply_filters()` call is inside a `return` statement that executes before the method's `$withLabel` check, so the filtered, label-keyed array is always returned — the `$withLabel = false` code path below it is currently unreachable.

**Parameters:**

- `$statuses` (array): The product statuses, keyed by status constant

```
$statuses = [
    'publish' => __('Publish', 'fluent-cart'),   // Status::PRODUCT_PUBLISH
    'draft'   => __('Draft', 'fluent-cart'),     // Status::PRODUCT_DRAFT
    'private' => __('Private', 'fluent-cart'),   // Status::PRODUCT_PRIVATE
    'future'  => __('Scheduled', 'fluent-cart'), // Status::PRODUCT_FUTURE
    'trash'   => __('Trashed', 'fluent-cart'),   // Status::PRODUCT_TRASH
];
```

- `$data` (array): Context data (empty array)

**Returns:**

- `$statuses` (array): The modified statuses array

**Source:** `app/Helpers/Status.php:115`

**Usage:**

```
add_filter('fluent_cart/product_statuses', function($statuses) {
    // Add a custom "archived" status label
    $statuses['archived'] = __('Archived', 'fluent-cart');
    return $statuses;
}, 10, 1);
```

### ` variation_types `

`fluent_cart/variation_types` — Filter the available product variation types

**When it runs:** This filter is applied after the default variation type list is built, and before it's returned (as the full label-keyed array, or as just the keys when `$withLabel` is false).

**Parameters:**

- `$types` (array): The variation types, keyed by type slug. The default list includes at least:

```
$types = [
    // ...other type entries defined above this call in the source...
    'advanced_variations' => __('Advanced Variations', 'fluent-cart'),
];
```

**Returns:**

- `$types` (array): The modified types array

**Source:** `app/Helpers/Helper.php:788`

**Usage:**

```
add_filter('fluent_cart/variation_types', function($types) {
    // Register a custom variation type for a third-party module
    $types['my_matrix_variations'] = __('Matrix Variations', 'my-addon');
    return $types;
}, 10, 1);
```

---
