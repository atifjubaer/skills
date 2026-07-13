# Gutenberg Blocks & Elementor Widgets

This guide lists the registration details and categories for Gutenberg blocks and Elementor widgets provided by FluentCart.

---

## 1. Gutenberg Blocks

FluentCart registers Gutenberg blocks under the `fluent-cart` namespace.

### Block Categories
- `fluent-cart` (Core catalog blocks)
- `fluent-cart-buttons` (Checkout triggers)

### Available Blocks Catalog

| Block Name | Description | Block Editor Slug |
|---|---|---|
| Products Grid | Full product archive card list | `fluent-cart/products` |
| Product Card | Highlights a single catalog item | `fluent-cart/product-card` |
| Customer Profile | Customer accounts dashboard panel | `fluent-cart/customer-profile` |
| Checkout App | Core customer payment checkout form | `fluent-cart/checkout` |
| Cart App | Interactive shopping cart panel | `fluent-cart/cart_cart` |
| Search Bar | Live AJAX product search box | `fluent-cart/search-bar` |
| Mini Cart | Basket count button with drawer | `fluent-cart/mini-cart` |
| Add to Cart Button | Button to add item to checkout cart | `fluent-cart/add-to-cart-button` |

### Block Theme Template Overrides
Place custom html templates under your block theme's `templates/` directory to override:
- `templates/single-fluent-products.html`
- `templates/taxonomy-product-categories.html`
- `templates/archive-fluent-products.html`

---

## 2. Elementor Widgets Reference

Deep Elementor builder integrations are supplied via the `fluent-cart-elementor-blocks` extension.

### Widget Categories
All widgets are grouped inside the `fluent-cart` category.

### General Widgets (Elementor Free)
- `ShopAppWidget` - Full-featured product catalog.
- `ProductCardWidget` - Product grid representation.
- `MiniCartWidget` - Cart icon drawer triggers.
- `AddToCartWidget` - Contextual add-to-cart button.
- `BuyNowWidget` - Instant buy now checkout buttons.
- `CheckoutWidget` - Binds the checkout billing and payment page form.

### Theme Builder Widgets (Elementor Pro)
- `ProductTitleWidget` - Product post title.
- `ProductGalleryWidget` - Multi-image gallery carousel.
- `ProductPriceWidget` - Pricing range variables display.
- `ProductStockWidget` - Stock inventory level indicator.
- `ProductBuySectionWidget` - Binds variations selector, pricing, and purchase buttons together.

---

## 3. Disabling Default Layouts in PHP

To prevent FluentCart from rendering its default templates automatically when custom builder page templates are assigned, use this filter hook:

```php
// Disable FluentCart's auto-rendering system for single product CPTs
add_filter('fluent_cart/disable_auto_single_product_page', function (bool $disable): bool {
    // Disable default templates if Elementor has taken over rendering
    if (did_action('elementor/loaded') && \Elementor\Plugin::$instance->db->is_built_with_elementor(get_the_ID())) {
        return true;
    }
    return $disable;
});
```
