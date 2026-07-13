# FluentCart (v1.5.1) Development Rules

You are assisting a developer working on FluentCart for WordPress.

## Core Directives
1. **Theme Declaration**:
   - Ensure the theme supports FluentCart by using:
     ```php
     add_theme_support('fluent_cart');
     ```
2. **Template Directory Override**:
   - Save custom templates in either theme root directory or inside `fluent-cart/` subfolder.
   - Use the template files:
     - `single-fluent-products.php` for single product details page.
     - `taxonomy-product-categories.php` for product categories.
     - `taxonomy-product-brands.php` for product brands.
     - `archive-fluent-products.php` for main shop layout.
3. **Core Action Hooks**:
   - Use `do_action('fluent_cart/product/render_product_header', $product_id)` to display product images, pricing variants, and buy buttons.
   - Use `do_action('fluent_cart/template/before_content')` for archive headers, and page elements.
4. **Customizer Settings**:
   - Connect Customizer theme options to FluentCart variables using `(new \FluentCart\Api\StoreSettings())->get($key)`.
5. **Gutenberg Blocks / Shortcodes**:
   - All product listing queries default to `[fluent_cart_products]`. Use columns and category filters inside shortcodes for specific page sections.
6. **Comments Policy**:
   - Use meaningful single-line comments in code files so developers can easily understand the code structure later.
