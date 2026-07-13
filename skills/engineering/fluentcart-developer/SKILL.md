---
name: "FluentCart Developer"
description: "Comprehensive knowledge base for FluentCart WordPress e-commerce plugin development. Covers theme compatibility, template system, shortcodes, hooks/filters, Elementor integration, custom post types, taxonomies, models, CSS classes, and JavaScript APIs. Use this skill when building themes, plugins, or customizations for FluentCart."
---

# FluentCart Developer Knowledge Base

This skill is the central index and developer resource for building themes, plugins, and custom integrations (payment gateways, webhooks, fees, subscriptions) for FluentCart.

---

## 1. Advanced Developer References

For detailed code guides and API specifications, see the individual guides in the references directory:

- [Custom Payment Gateway Integration](references/payment-gateway-integration.md) ([Online](https://raw.githubusercontent.com/atifjubaer/fluentcart-ai-skill/master/skills/engineering/fluentcart-developer/references/payment-gateway-integration.md)) - Register and implement your own payment processor, boot settings, and process refunds.
- [Paddle Payment Gateway Case Study](references/paddle-gateway-case-study.md) ([Online](https://raw.githubusercontent.com/atifjubaer/fluentcart-ai-skill/master/skills/engineering/fluentcart-developer/references/paddle-gateway-case-study.md)) - Complete reference code and fields schemas for Paddle integration.
- [Ghost Product Selling (Non-Catalog Items)](references/ghost-product-selling.md) ([Online](https://raw.githubusercontent.com/atifjubaer/fluentcart-ai-skill/master/skills/engineering/fluentcart-developer/references/ghost-product-selling.md)) - Sell dynamically defined products on-the-fly without database catalog setup.
- [Fee System (Surcharges & Custom Fees)](references/fee-system-guide.md) ([Online](https://raw.githubusercontent.com/atifjubaer/fluentcart-ai-skill/master/skills/engineering/fluentcart-developer/references/fee-system-guide.md)) - Inject dynamic calculations or persistent DB fees.
- [Subscription Customization](references/subscription-customization.md) ([Online](https://raw.githubusercontent.com/atifjubaer/fluentcart-ai-skill/master/skills/engineering/fluentcart-developer/references/subscription-customization.md)) - Adjust grace periods, configure custom intervals, and set license defaults.
- [Database Models & Query Builder](references/database-models-query-builder.md) ([Online](https://raw.githubusercontent.com/atifjubaer/fluentcart-ai-skill/master/skills/engineering/fluentcart-developer/references/database-models-query-builder.md)) - Query tables using FluentCart's Laravel Eloquent compatibility layer.
- [Exhaustive Database Models Reference](references/database-models-reference.md) ([Online](https://raw.githubusercontent.com/atifjubaer/fluentcart-ai-skill/master/skills/engineering/fluentcart-developer/references/database-models-reference.md)) - Deep properties, fields, and relationships index for all 30+ tables.
- [Database Schema Reference](references/database-schema-reference.md) ([Online](https://raw.githubusercontent.com/atifjubaer/fluentcart-ai-skill/master/skills/engineering/fluentcart-developer/references/database-schema-reference.md)) - Tables, columns, and indexes mapping catalog.
- [Action & Filter Hooks Reference](references/hooks-actions-filters.md) ([Online](https://raw.githubusercontent.com/atifjubaer/fluentcart-ai-skill/master/skills/engineering/fluentcart-developer/references/hooks-actions-filters.md)) - Hook into order transitions, payment states, and control asset loads.
- [Exhaustive Action Hooks Reference](references/hooks-actions-reference.md) ([Online](https://raw.githubusercontent.com/atifjubaer/fluentcart-ai-skill/master/skills/engineering/fluentcart-developer/references/hooks-actions-reference.md)) - Catalog of all actions triggered across FluentCart lifecycle.
- [Exhaustive Filter Hooks Reference](references/hooks-filters-reference.md) ([Online](https://raw.githubusercontent.com/atifjubaer/fluentcart-ai-skill/master/skills/engineering/fluentcart-developer/references/hooks-filters-reference.md)) - Catalog of all filters allowing data modification in FluentCart.
- [REST API Endpoints Reference](references/rest-api-endpoints-reference.md) ([Online](https://raw.githubusercontent.com/atifjubaer/fluentcart-ai-skill/master/skills/engineering/fluentcart-developer/references/rest-api-endpoints-reference.md)) - Full list of API paths and payload schemas.
- [Exhaustive REST API Reference](references/rest-api-reference.md) ([Online](https://raw.githubusercontent.com/atifjubaer/fluentcart-ai-skill/master/skills/engineering/fluentcart-developer/references/rest-api-reference.md)) - Detailed payloads, response formats, and parameters for all endpoints.
- [REST API & Webhooks](references/rest-api-webhooks.md) ([Online](https://raw.githubusercontent.com/atifjubaer/fluentcart-ai-skill/master/skills/engineering/fluentcart-developer/references/rest-api-webhooks.md)) - API endpoints, authorization tokens, and outgoing webhooks configuration.
- [Shipping, Storage, Licensing & Order Bumps](references/shipping-storage-licensing.md) ([Online](https://raw.githubusercontent.com/atifjubaer/fluentcart-ai-skill/master/skills/engineering/fluentcart-developer/references/shipping-storage-licensing.md)) - Custom shipping rate carriers, storage driver APIs, and Pro licensing/bumps.
- [Gutenberg Blocks & Elementor Widgets](references/gutenberg-blocks-elementor-widgets.md) ([Online](https://raw.githubusercontent.com/atifjubaer/fluentcart-ai-skill/master/skills/engineering/fluentcart-developer/references/gutenberg-blocks-elementor-widgets.md)) - Editor block names and Elementor widgets catalog.
- [WP-CLI Commands Reference](references/wp-cli-commands.md) ([Online](https://raw.githubusercontent.com/atifjubaer/fluentcart-ai-skill/master/skills/engineering/fluentcart-developer/references/wp-cli-commands.md)) - Syntax and options for backend database CLI tasks.
- [Easy Digital Downloads (EDD) Migration & Compatibility](references/edd-migration-compatibility-guide.md) ([Online](https://raw.githubusercontent.com/atifjubaer/fluentcart-ai-skill/master/skills/engineering/fluentcart-developer/references/edd-migration-compatibility-guide.md)) - Migrate EDD stores and handle legacy license API calls.
- [Theme Development Guide](references/theme-development-guide.md) ([Online](https://raw.githubusercontent.com/atifjubaer/fluentcart-ai-skill/master/skills/engineering/fluentcart-developer/references/theme-development-guide.md)) - Layout customization files, block support, and styling guidelines.


---

## 2. Core Quick Reference

### Critical Theme Support Declared
To load custom templates and bypass basic generic fallbacks, your theme must declare support:
```php
// Add this in your theme's functions.php (essential step)
add_theme_support('fluent_cart');
```

### FluentCart Page Types
Identifiable via `\FluentCart\App\Services\Templates\TemplateService::getCurrentFcPageType()`:
- `single_product` — Single product page (`fluent-products` Custom Post Type)
- `product_taxonomy` — Category/Brand archive page
- `shop` — Primary shop grid page
- `cart` — Shopping cart page
- `checkout` — Checkout payment page
- `receipt` — Confirmation order receipt page
- `customer_dashboard` — Customer profile dashboard page

---

## 3. Custom Post Types & Taxonomies

### Product CPT
- **Post Type Slug**: `fluent-products`
- **URL Slug**: Defaults to `/item/` (customizable via store settings)
- **REST API**: Supported (`show_in_rest: true`)
- **Gallery Meta Key**: `fluent-products-gallery-image` (JSON array of `{id, url, name}`)

### Taxonomies
- **Product Categories**: `product-categories` (Hierarchical)
- **Product Brands**: `product-brands` (Hierarchical)

---

## 4. Classic Template Hierarchy
FluentCart follows a template directory structure similar to WooCommerce:
1. `fluent-cart.php` (Theme root)
2. `single-fluent-products-{slug}.php`
3. `single-fluent-products.php`
4. `fluent-cart/single-fluent-products.php` (Theme subdirectory)

For archives:
1. `taxonomy-product-categories-{slug}.php`
2. `fluent-cart/taxonomy-product-categories.php`
3. `archive-fluent-products.php`

---

## 5. Shortcodes Overview

| Shortcode | Description | Key Attributes |
|---|---|---|
| `[fluent_cart_products]` | Main product grid | `per_page`, `columns`, `category`, `sort_by`, `enable_filter` |
| `[fluent_cart_checkout]` | Render checkout panel | — |
| `[fluent_cart_cart]` | Render cart content | — |
| `[fluent_cart_receipt]` | Render purchase invoice | — |
| `[fluent_cart_mini_cart]` | Header cart count icon | `count_mode` (`distinct_products` / `total_quantity`) |
| `[fluent_cart_add_to_cart_button]` | Add to Cart button | `variation_id`, `button_text`, `class` |
| `[fluent_cart_checkout_button]` | Buy Now direct checkout | `variation_id`, `button_text`, `instant_checkout` |

---

## 6. CSS Theme Customization (Common Classes)
- `.fct-products-wrapper` - Shop page grid outer container.
- `.fct-product-card` - Single product item card in loop.
- `.fct-single-product` - Single product page wrapper.
- `.fct-buy-section` - Variations, quantity inputs, and add-to-cart buttons.
- `.fluent-cart-checkout-btn` - Global checkout forms submit button.
- `.fct-sale-badge` - Sale status overlay indicator.

---

## 7. Global WordPress Constants & Settings
- `FLUENTCART_VERSION` - Active core plugin version (e.g. `1.5.1`).
- `FLUENTCART_PLUGIN_PATH` - Absolute directory path to FluentCart plugin directory.
- `FLUENTCART_URL` - URL path to FluentCart assets.

To retrieve store settings programmatically:
```php
$storeSettings = new \FluentCart\Api\StoreSettings();
$checkoutPageUrl = $storeSettings->getShopPage(); // Get primary store checkout page URL
```

---

## Install

Install the FluentCart Developer skill into your local project workspace using any of the following package managers:

```bash
# Using npm
npx skills add atifjubaer/fluentcart-ai-skill

# Using pnpm
pnpm dlx skills add atifjubaer/fluentcart-ai-skill

# Using yarn
yarn dlx skills add atifjubaer/fluentcart-ai-skill

# Using bun
bunx --bun skills add atifjubaer/fluentcart-ai-skill
```

---

## What's Included

The skill provides your AI assistant with the following knowledge:

### 1. Developer Guides & Case Studies
- **Custom Payment Gateway**: Boilerplate and step-by-step registration for custom payment gateways.
- **Paddle Integration case study**: Full fields schema and webhook event handlers.
- **Ghost Product selling**: Selling dynamically priced/defined non-catalog items on-the-fly.
- **Dynamic Fee calculations**: Surcharges and credit card processing fee hooks.
- **Subscription Customization**: Custom billing cycles, renewal grace periods, and license durations.

### 2. Deep Database Reference
- **ELOQUENT ORM & Models**: Query orders, transactions, products, subscriptions, and customers.
- **Exhaustive Schema**: Direct access to structures, tables, and attributes.

### 3. Hooks & APIs
- **REST API Reference**: Authentication protocols and operations endpoints.
- **WordPress Hooks**: Actions and filters overview to extend FluentCart core features.

---

## How It Works

1. **Project detection** — The skill activates automatically when the AI assistant detects a FluentCart theme or plugin project layout (e.g. `add_theme_support('fluent_cart')` declaration or `fluent-cart/` templates folder).
2. **Context injection** — The assistant references documents from the `references/` directory on-demand to construct accurate implementations for payment processors, databases, or template variables.
3. **Pattern enforcement** — Ensures correct templates override hierarchies and hooks are used to implement custom business logic.

