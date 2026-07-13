# FluentCart Theme Development — Complete Guide

## Creating a FluentCart-Compatible Theme

### Step 1: Declare Theme Support

In your theme's `functions.php`:

```php
<?php
/**
 * Theme Setup — FluentCart Compatibility
 */
function mytheme_setup() {
    // CRITICAL: This tells FluentCart to use theme templates
    add_theme_support('fluent_cart');
    
    // Standard WordPress theme supports
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', ['search-form', 'gallery', 'caption', 'style', 'script']);
    
    // Register menus
    register_nav_menus([
        'primary'   => 'Primary Menu',
        'secondary' => 'Secondary Menu',
        'footer'    => 'Footer Menu',
        'mobile'    => 'Mobile Menu',
    ]);
    
    // Image sizes for product cards
    add_image_size('product-card', 400, 400, true);
    add_image_size('product-gallery', 800, 800, false);
    add_image_size('product-gallery-thumb', 100, 100, true);
}
add_action('after_setup_theme', 'mytheme_setup');
```

### Step 2: Template Files

#### single-fluent-products.php
```php
<?php
/**
 * Single Product Template
 * Overrides FluentCart's default single product display
 */
get_header();
?>

<div class="mytheme-single-product-wrapper">
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
    
        <!-- Breadcrumbs -->
        <nav class="mytheme-breadcrumbs">
            <a href="<?php echo home_url(); ?>">Home</a> /
            <a href="<?php echo esc_url(\FluentCart\Api\StoreSettings::getShopPage()); ?>">Shop</a> /
            <span><?php the_title(); ?></span>
        </nav>
        
        <!-- Product Header (Gallery + Buy Section) -->
        <?php do_action('fluent_cart/product/render_product_header', get_the_ID()); ?>
        
        <!-- Product Content (Description) -->
        <div class="mytheme-product-content">
            <?php the_content(); ?>
        </div>
        
        <!-- Related Products -->
        <?php echo do_shortcode('[fluent_cart_related_products]'); ?>
    
    <?php endwhile; endif; ?>
</div>

<?php get_footer(); ?>
```

#### taxonomy-product-categories.php
```php
<?php
/**
 * Product Category Archive Template
 */
get_header();

$term = get_queried_object();
?>

<div class="mytheme-category-archive">
    <!-- Category Header -->
    <div class="mytheme-category-header">
        <h1><?php echo esc_html($term->name); ?></h1>
        <?php if ($term->description) : ?>
            <p><?php echo wp_kses_post($term->description); ?></p>
        <?php endif; ?>
    </div>
    
    <!-- Product Grid (via FluentCart shortcode) -->
    <?php echo do_shortcode('[fluent_cart_products category="' . esc_attr($term->slug) . '" enable_filter="true" columns="4"]'); ?>
</div>

<?php get_footer(); ?>
```

#### archive-fluent-products.php
```php
<?php
/**
 * Product Archive / Shop Template
 */
get_header();
?>

<div class="mytheme-shop-archive">
    <?php do_action('fluent_cart/template/before_content'); ?>
    <?php do_action('fluent_cart/template/main_content'); ?>
    <?php do_action('fluent_cart/template/after_content'); ?>
</div>

<?php get_footer(); ?>
```

### Step 3: Styling FluentCart Elements

FluentCart uses `.fct-` prefixed CSS classes. Override them in your theme:

```css
/* Product Cards */
.fct-product-card {
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.fct-product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.1);
}

/* Single Product */
.fct-single-product {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

/* Product Gallery */
.fct-product-gallery {
    border-radius: 12px;
    overflow: hidden;
}

/* Buy Section */
.fct-buy-section {
    padding: 2rem;
    background: var(--surface-color);
    border-radius: 12px;
}

/* Cart Page */
.fct-cart-wrapper {
    max-width: 1200px;
    margin: 0 auto;
}

/* Checkout */
.fct-checkout-wrapper {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 2rem;
}
```

### Step 4: Elementor Compatibility

```php
<?php
/**
 * Elementor Compatibility
 */

// Register Elementor locations for header/footer override
add_action('elementor/theme/register_locations', function($elementor_theme_manager) {
    $elementor_theme_manager->register_location('header');
    $elementor_theme_manager->register_location('footer');
    $elementor_theme_manager->register_location('single', [
        'label' => 'Single Product',
        'multiple' => false,
        'edit_in_content' => true,
    ]);
});
```

### Step 5: Widget Areas

```php
<?php
function mytheme_widgets_init() {
    register_sidebar([
        'name'          => 'Shop Sidebar',
        'id'            => 'shop-sidebar',
        'description'   => 'Widgets for shop/product pages',
        'before_widget' => '<div class="mytheme-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="mytheme-widget-title">',
        'after_title'   => '</h3>',
    ]);
    
    register_sidebar([
        'name'          => 'Footer Column 1',
        'id'            => 'footer-1',
        'before_widget' => '<div class="mytheme-footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4>',
        'after_title'   => '</h4>',
    ]);
    
    // Repeat for footer columns 2-4
}
add_action('widgets_init', 'mytheme_widgets_init');
```

### Step 6: Conditional Asset Loading

```php
<?php
/**
 * Only load shop-specific assets on FluentCart pages
 */
function mytheme_enqueue_fluentcart_assets() {
    // Check if we're on a FluentCart page
    if (!class_exists('\FluentCart\App\Services\TemplateService')) {
        return;
    }
    
    $pageType = \FluentCart\App\Services\TemplateService::getCurrentFcPageType();
    
    if (!$pageType) {
        return;
    }
    
    // Load shop-specific CSS
    wp_enqueue_style('mytheme-shop', get_template_directory_uri() . '/assets/css/shop.css');
    
    if ($pageType === 'single_product') {
        wp_enqueue_style('mytheme-product', get_template_directory_uri() . '/assets/css/single-product.css');
        wp_enqueue_script('mytheme-product-js', get_template_directory_uri() . '/assets/js/single-product.js', [], null, true);
    }
    
    if (in_array($pageType, ['cart', 'checkout'])) {
        wp_enqueue_style('mytheme-cart-checkout', get_template_directory_uri() . '/assets/css/cart-checkout.css');
    }
}
add_action('wp_enqueue_scripts', 'mytheme_enqueue_fluentcart_assets');
```

---

## FluentCart Helper Functions

```php
<?php
// Check if FluentCart is active
function is_fluentcart_active() {
    return defined('FLUENTCART_VERSION');
}

// Get current FluentCart page type
function get_fc_page_type() {
    if (!class_exists('\FluentCart\App\Services\TemplateService')) {
        return '';
    }
    return \FluentCart\App\Services\TemplateService::getCurrentFcPageType();
}

// Check if on any FluentCart page
function is_fluentcart_page() {
    return !empty(get_fc_page_type());
}

// Check specific FluentCart page types
function is_fc_shop()     { return get_fc_page_type() === 'shop'; }
function is_fc_product()  { return get_fc_page_type() === 'single_product'; }
function is_fc_cart()     { return get_fc_page_type() === 'cart'; }
function is_fc_checkout() { return get_fc_page_type() === 'checkout'; }

// Get shop page URL
function get_fc_shop_url() {
    return (new \FluentCart\Api\StoreSettings())->getShopPage();
}

// Get customer profile URL
function get_fc_account_url($extension = '') {
    return \FluentCart\App\Services\TemplateService::getCustomerProfileUrl($extension);
}
```

---

## Database Tables

FluentCart creates these custom tables (prefixed with `wp_`):

| Table | Description |
|---|---|
| `fc_orders` | Order records |
| `fc_order_items` | Order line items |
| `fc_order_transactions` | Payment transactions |
| `fc_order_addresses` | Shipping/billing addresses |
| `fc_order_meta` | Order metadata |
| `fc_order_tax_rates` | Applied tax rates |
| `fc_customers` | Customer profiles |
| `fc_customer_addresses` | Saved addresses |
| `fc_customer_meta` | Customer metadata |
| `fc_carts` | Shopping carts |
| `fc_product_details` | Product pricing data |
| `fc_product_variations` | Product variants |
| `fc_product_downloads` | Downloadable files |
| `fc_subscriptions` | Subscriptions |
| `fc_subscription_meta` | Subscription metadata |
| `fc_coupons` | Discount coupons |
| `fc_applied_coupons` | Applied coupon records |
| `fc_shipping_zones` | Shipping zones |
| `fc_shipping_methods` | Shipping methods |
| `fc_shipping_classes` | Shipping classes |
| `fc_tax_classes` | Tax classes |
| `fc_tax_rates` | Tax rates |
| `fc_attribute_groups` | Product attributes |
| `fc_attribute_terms` | Attribute values |
| `fc_attribute_relations` | Attribute-product links |
| `fc_activities` | Activity log |
| `fc_meta` | General metadata |
| `fc_labels` | Labels/tags |
| `fc_label_relationships` | Label associations |

---

## REST API

FluentCart registers REST API endpoints. The base URL pattern:
```
/wp-json/fluent-cart/v2/...
```

Access REST info in PHP:
```php
$restInfo = \FluentCart\App\Helpers\Helper::getRestInfo();
// Returns: ['url' => 'https://...', 'nonce' => '...']
```

---

## Gutenberg Blocks

FluentCart registers blocks under the `fluent-cart` namespace:

### Block Categories
- `fluent-cart` — Main blocks
- `fluent-cart-buttons` — Button blocks

### Available Blocks
| Block | Description |
|---|---|
| `fluent-cart/products` | Product grid |
| `fluent-cart/product-card` | Single product card |
| `fluent-cart/product-carousel` | Product carousel |
| `fluent-cart/customer-profile` | Customer dashboard |
| `fluent-cart/cart_cart` | Cart block |
| `fluent-cart/product-pricing-table` | Pricing table |
| `fluent-cart/search-bar` | Search block |
| `fluent-cart/mini-cart` | Mini cart |
| `fluent-cart/product-categories-list` | Categories |
| `fluent-cart/buy-now-button` | Buy Now button |
| `fluent-cart/add-to-cart-button` | Add to Cart button |
| `fluent-cart/store-logo` | Store logo |
| `fluent-cart/customer-dashboard-button` | Account button |
| `fluent-cart/product-title` | Product title |
| `fluent-cart/product-image` | Product image |
| `fluent-cart/product-gallery` | Product gallery |
| `fluent-cart/product-info` | Product info |
| `fluent-cart/buy-section` | Buy section |
| `fluent-cart/price-range` | Price range |
| `fluent-cart/sale-badge` | Sale badge |
| `fluent-cart/excerpt` | Product excerpt |
| `fluent-cart/product-description` | Description |
| `fluent-cart/product-sku` | SKU |
| `fluent-cart/stock-block` | Stock status |
| `fluent-cart/sold-out-badge` | Sold out badge |
| `fluent-cart/related-products` | Related products |

### Shop App Sub-blocks (for block editor shop layout)
- `fluent-cart/shopapp-product-view-switcher`
- `fluent-cart/shopapp-product-container`
- `fluent-cart/shopapp-product-filter`
- `fluent-cart/shopapp-product-filter-search-box`
- `fluent-cart/shopapp-product-filter-filters`
- `fluent-cart/shopapp-product-filter-button`
- `fluent-cart/shopapp-product-filter-apply-button`
- `fluent-cart/shopapp-product-filter-reset-button`
- `fluent-cart/shopapp-product-loop`
- `fluent-cart/shopapp-product-image`
- `fluent-cart/shopapp-product-title`
- `fluent-cart/shopapp-product-price`
- `fluent-cart/shopapp-product-buttons`
- `fluent-cart/shopapp-product-no-result`
- `fluent-cart/product-paginator`
- `fluent-cart/product-paginator-info`
- `fluent-cart/product-paginator-number`
