# Theme Development Guide

FluentCart provides full theme support for Classic Themes, Block Themes (FSE), and visual page builders (Bricks, Elementor).

---

## 1. Declaring Theme Support

Add theme support declaration to your theme's `functions.php`:

```php
add_action('after_setup_theme', function() {
    add_theme_support('fluent_cart');
});
```

---

## 2. Template Hierarchy & Overrides

FluentCart checks for custom template overrides inside your theme's root directory and `fluent-cart/` subfolder:

- `fluent-cart.php` (Root fallback template)
- `single-fluent-products-{slug}.php`
- `single-fluent-products.php`
- `fluent-cart/single-fluent-products.php`
- `taxonomy-product-categories.php`
- `fluent-cart/cart.php`
- `fluent-cart/checkout.php`
- `fluent-cart/receipt.php`
- `fluent-cart/customer-dashboard.php`

---

## 3. Shortcodes Reference

| Shortcode | Description |
|---|---|
| `[fluent_cart_products]` | Product Showcase Grid |
| `[fluent_cart_checkout]` | Render Checkout Form |
| `[fluent_cart_cart]` | Render Cart Container |
| `[fluent_cart_receipt]` | Render Purchase Invoice |
| `[fluent_cart_mini_cart]` | Mini Cart Drawer / Icon |
