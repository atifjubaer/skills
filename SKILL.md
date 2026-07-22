---
name: "FluentCart Developer"
description: "Comprehensive knowledge base for FluentCart WordPress e-commerce plugin and theme development. Covers theme compatibility, template system, shortcodes, action/filter hooks, Elementor & Bricks integration, custom payment gateways, database models, REST API, fee systems, ghost products, subscriptions, and variations. Use this skill when building themes, plugins, or custom extensions for FluentCart."
---

# FluentCart Developer Knowledge Base

This skill is the comprehensive developer index and reference guide for building WordPress themes, custom plugins, payment gateways, builder blocks, REST API extensions, and custom e-commerce workflows for FluentCart.

---

## 1. Advanced Developer References

For detailed code guides, schemas, and API specifications, consult the individual manuals in the `references/` directory:

- [Theme Development Guide](references/theme-development-guide.md) ([Online](https://raw.githubusercontent.com/atifjubaer/skills/master/references/theme-development-guide.md)) — Complete guide for block and classic themes, template overrides, page types, and asset enqueuing.
- [Custom Payment Gateway Integration](references/payment-gateway-integration.md) ([Online](https://raw.githubusercontent.com/atifjubaer/skills/master/references/payment-gateway-integration.md)) — Register custom gateways (`AbstractPaymentGateway`), settings schemas (`BaseGatewaySettings`), capture/refund methods, and card update redirect flows.
- [Paddle Payment Gateway Case Study](references/paddle-gateway-case-study.md) ([Online](https://raw.githubusercontent.com/atifjubaer/skills/master/references/paddle-gateway-case-study.md)) — Implementation detail, setting fields schema, and webhook listener setup.
- [Ghost Product Selling (Non-Catalog Items)](references/ghost-product-selling.md) ([Online](https://raw.githubusercontent.com/atifjubaer/skills/master/references/ghost-product-selling.md)) — Dynamically create virtual line items without adding products to the database catalog.
- [Fee System (Surcharges & Custom Fees)](references/fee-system-guide.md) ([Online](https://raw.githubusercontent.com/atifjubaer/skills/master/references/fee-system-guide.md)) — Inject dynamic cart surcharges or store persistent fees in database tables.
- [Subscription Customization](references/subscription-customization.md) ([Online](https://raw.githubusercontent.com/atifjubaer/skills/master/references/subscription-customization.md)) — Adjust renewal grace periods, custom billing cycles, auto-renew cancellation, and license key defaults.
- [Database Models & Query Builder](references/database-models-query-builder.md) ([Online](https://raw.githubusercontent.com/atifjubaer/skills/master/references/database-models-query-builder.md)) — Query FluentCart records using Eloquent ORM models (`Order`, `Customer`, `Product`, `Subscription`, `Cart`).
- [Exhaustive Database Models Reference](references/database-models-reference.md) ([Online](https://raw.githubusercontent.com/atifjubaer/skills/master/references/database-models-reference.md)) — Deep field definitions, properties, and relationships for 30+ database models.
- [Database Schema Reference](references/database-schema-reference.md) ([Online](https://raw.githubusercontent.com/atifjubaer/skills/master/references/database-schema-reference.md)) — Tables, column types, and index catalog (`fc_orders`, `fc_order_items`, `fc_customers`, etc.).
- [Action & Filter Hooks Reference](references/hooks-actions-filters.md) ([Online](https://raw.githubusercontent.com/atifjubaer/skills/master/references/hooks-actions-filters.md)) — Hook overview for order status changes, payment triggers, and UI extensions.
- [Exhaustive Action Hooks Reference](references/hooks-actions-reference.md) ([Online](https://raw.githubusercontent.com/atifjubaer/skills/master/references/hooks-actions-reference.md)) — Full catalog of actions triggered across the FluentCart lifecycle.
- [Exhaustive Filter Hooks Reference](references/hooks-filters-reference.md) ([Online](https://raw.githubusercontent.com/atifjubaer/skills/master/references/hooks-filters-reference.md)) — Full catalog of filters allowing data modification (e.g. `fluent_cart/transaction/max_refundable_amount`).
- [REST API Endpoints Reference](references/rest-api-endpoints-reference.md) ([Online](https://raw.githubusercontent.com/atifjubaer/skills/master/references/rest-api-endpoints-reference.md)) — Quick list of API paths and payload parameters.
- [Exhaustive REST API Reference](references/rest-api-reference.md) ([Online](https://raw.githubusercontent.com/atifjubaer/skills/master/references/rest-api-reference.md)) — Complete request payloads, response schemas, and authentication endpoints.
- [REST API & Webhooks Guide](references/rest-api-webhooks.md) ([Online](https://raw.githubusercontent.com/atifjubaer/skills/master/references/rest-api-webhooks.md)) — Authorization tokens, nonce validation, and outgoing webhook listeners.
- [Shipping, Storage, Licensing & Order Bumps](references/shipping-storage-licensing.md) ([Online](https://raw.githubusercontent.com/atifjubaer/skills/master/references/shipping-storage-licensing.md)) — Custom shipping rate carriers, storage driver APIs, software license keys, and checkout bumps.
- [Gutenberg Blocks & Elementor / Bricks Widgets](references/gutenberg-blocks-elementor-widgets.md) ([Online](https://raw.githubusercontent.com/atifjubaer/skills/master/references/gutenberg-blocks-elementor-widgets.md)) — Block names, elementor locations, and 15+ Bricks Builder blocks (v1.5.4+).
- [WP-CLI Commands Reference](references/wp-cli-commands.md) ([Online](https://raw.githubusercontent.com/atifjubaer/skills/master/references/wp-cli-commands.md)) — CLI commands for maintenance, database synchronization, and migrations.
- [Easy Digital Downloads (EDD) Migration Guide](references/edd-migration-compatibility-guide.md) ([Online](https://raw.githubusercontent.com/atifjubaer/skills/master/references/edd-migration-compatibility-guide.md)) — Store migration steps and legacy EDD licensing endpoint emulation.

### Standalone Code Examples (`examples/`)
For full boilerplate plugins and child theme files, consult the `examples/` directory:
- `examples/sample-custom-payment-gateway/fluentcart-custom-gateway-example.php` — Complete custom payment gateway plugin boilerplate.
- `examples/sample-shipping-carrier/fluentcart-custom-shipping-carrier.php` — Custom dynamic shipping calculation plugin.
- `examples/fluentcart-starter-child-theme/` — Starter child theme with `functions.php` theme support & `fluent-cart/checkout.php` override.

---

## 2. Core Framework & Architecture Setup

### A. Theme Support Declaration
To enable FluentCart template loading, template overrides, and custom page detection in a theme, declare support in `functions.php`:

```php
// Must be added to your theme's functions.php
add_action('after_setup_theme', function() {
    add_theme_support('fluent_cart');
});
```

### B. Global Helper Functions & Formatting
```php
// Check if FluentCart core is installed & active
if (defined('FLUENTCART_VERSION')) {
    $version = FLUENTCART_VERSION; // e.g. '1.5.5'
}

// Detect current FluentCart page type
$pageType = \FluentCart\App\Services\Templates\TemplateService::getCurrentFcPageType();
// Returns: 'shop' | 'single_product' | 'product_taxonomy' | 'cart' | 'checkout' | 'receipt' | 'customer_dashboard'

// Access Store Settings API & Format Currency
$storeSettings = new \FluentCart\Api\StoreSettings();
$shopPageUrl   = $storeSettings->getShopPage();
$currency      = $storeSettings->getCurrency();

// Format monetary amounts using store settings
$formattedPrice = \FluentCart\App\Helpers\Helper::formatMoney(4990); // Formats $49.90
```

---

## 3. Checkout Execution Lifecycle (Order of Operations)

Senior developers must understand the exact execution sequence during checkout processing:

```
[Customer Submits Form]
       │
       ▼
1. fluent_cart/checkout/before_validate_cart   --> Add custom pre-checks
       │
       ▼
2. fluent_cart/checkout/validate_cart          --> Validate input data & stock
       │
       ▼
3. fluent_cart/checkout/before_order_create    --> Modify cart payload or totals
       │
       ▼
4. fluent_cart/order_created                   --> Order model created in DB (Status: pending)
       │
       ▼
5. Payment Gateway -> makePaymentFromPaymentInstance()
       │
       ▼
6. (new StatusHelper($order))->syncOrderStatuses($transaction)
       │
       ├─► fluent_cart/payment_completed       --> Payment record created
       ├─► fluent_cart/order_paid             --> Fired if transaction succeeded
       └─► fluent_cart/order_status_updated   --> Order status changed to 'processing'/'completed'
```

---

## 4. Security, Nonce Validation & Capability Checks

All custom endpoints, AJAX actions, and admin settings handlers must follow strict security standards:

```php
// 1. Check FluentCart Admin Permissions
if (!current_user_can('manage_options') && !fluent_cart_user_can('manage_fluentcart')) {
    wp_send_json(['status' => 'error', 'message' => 'Unauthorized access'], 403);
}

// 2. Validate Nonce Verification in AJAX Endpoints
if (!check_ajax_referer('fluent_cart_nonce', 'nonce', false)) {
    wp_send_json(['status' => 'error', 'message' => 'Invalid security token'], 403);
}

// 3. Input Sanitization Example
$cleanInput = sanitize_text_field($_POST['custom_field'] ?? '');
```
