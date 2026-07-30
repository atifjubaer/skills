---
name: FluentCart Developer
description: Comprehensive developer knowledge base for FluentCart e-commerce plugin development. Covers theme compatibility, template system, classic & block themes, action & filter hooks, Facebook Meta Pixel & GA4 tracking, Elementor, Gutenberg & Bricks integration, custom payment gateways, dynamic shipping carriers, database models, REST API, fee surcharges, ghost products, subscriptions, and WP-CLI.
---

# FluentCart Developer Skill

Complete technical reference, architectural manual, and AI guidance system for developing extensions, themes, custom payment gateways, shipping carriers, fee surcharges, REST API integrations, and hook listeners for **FluentCart**.

---

## 🤖 AI Agent Execution Protocol & Routing Guidelines

When assisting a developer with FluentCart tasks, follow this step-by-step workflow:

### Step 1: Identify Task Scope & Domain
Determine which area of FluentCart the user's request touches:
- **Order Lifecycle & Payments:** Creating orders, handling refunds, checkout hooks, payment gateway integration.
- **Subscriptions & Recurring Revenue:** Subscription status transitions, renewals, grace periods, billing cycles.
- **Software Licensing (Pro):** License key generation, site activations/deactivations, update API.
- **Cart & Checkout:** Cart items, validation, custom items, custom fee surcharges, checkout form schema.
- **Database & Architecture:** Querying FluentCart tables (`wp_fct_*`), Eloquent models, relationships.
- **REST API:** Administrative endpoints, customer portal endpoints, external API consumption.

### Step 2: Read Target Reference File(s)
Do not guess hook names, parameter signatures, or schema columns. Open and inspect the dedicated reference file under `references/`:

#### Action Hooks (8 Modular Files)
- [action-hooks-orders.md](references/action-hooks-orders.md) — Order creation, paid/completion events, refunds, status transitions, shipping fulfillment.
- [action-hooks-subscriptions.md](references/action-hooks-subscriptions.md) — Subscription lifecycle, status changes, renewal processing, reminder notifications.
- [action-hooks-licenses.md](references/action-hooks-licenses.md) — Software license updates, site activations/deactivations, license keys (Pro).
- [action-hooks-cart-checkout.md](references/action-hooks-cart-checkout.md) — Shopping flow from cart item additions to checkout page and thank-you receipt rendering.
- [action-hooks-customers-users.md](references/action-hooks-customers-users.md) — Customer lifecycle, user registration, customer portal tab/section rendering.
- [action-hooks-products-coupons.md](references/action-hooks-products-coupons.md) — Product creation, duplication, single product and archive page hooks, coupon creation.
- [action-hooks-payments-integrations.md](references/action-hooks-payments-integrations.md) — Payment gateway webhooks (Stripe, PayPal, Mollie, Paddle), integration feeds, dev logging.
- [action-hooks-admin-templates.md](references/action-hooks-admin-templates.md) — Application boot (`fluentcart_loaded`), admin UI menus, block/email editor, shortcode views, REST policy checks.

#### Filter Hooks (6 Modular Files)
- [filter-hooks-settings-configuration.md](references/filter-hooks-settings-configuration.md) — Store settings defaults, currency options, translations, email notifications, admin menu items.
- [filter-hooks-orders-payments.md](references/filter-hooks-orders-payments.md) — Order/payment/shipping statuses, Stripe/PayPal/Mollie/Paddle gateway parameters, tax titles, invoice numbers.
- [filter-hooks-products-pricing.md](references/filter-hooks-products-pricing.md) — Product query builder (`shop_query`), variation display, button texts, stock availability, coupon validation.
- [filter-hooks-cart-checkout.md](references/filter-hooks-cart-checkout.md) — Cart item validation, fee items, estimated totals, checkout address fields, EU VAT/business rules.
- [filter-hooks-customers-subscriptions.md](references/filter-hooks-customers-subscriptions.md) — Customer portal tabs/endpoints, subscription statuses, grace periods, billing cycles, reminder schedules.
- [filter-hooks-integrations-advanced.md](references/filter-hooks-integrations-advanced.md) — Integration feeds, S3/local file storage, template paths, dashboard widgets, list filter queries, e-invoicing.

#### Core Architecture & System References (4 Files)
- [database-schema-reference.md](references/database-schema-reference.md) — Complete database schema for all `wp_fct_*` tables.
- [database-models-reference.md](references/database-models-reference.md) — FluentCart Eloquent Models, relationships, query builder rules.
- [rest-api-reference.md](references/rest-api-reference.md) — Full REST API endpoints index, authentication, request/response formats.
- [modules-and-extensions-reference.md](references/modules-and-extensions-reference.md) — Building payment gateways, shipping carriers, fee surcharges, ghost products.

---

## 📜 Core Technical Rules & Conventions

### 1. Monetary Values & Currency Storage
- **ALWAYS store and calculate monetary values as integers in CENTS** (e.g. `$10.00` = `1000`, `$19.99` = `1999`).
- Convert decimal inputs to cents before saving: `\FluentCart\App\Helpers\Helper::toCent($decimalAmount)`.
- Format cents into decimal string for display: `\FluentCart\App\Helpers\Helper::toDecimal($amountInCents)`.

### 2. Code Commenting Standards
- **ALWAYS add meaningful single-line explanatory comments to PHP code snippets** (above/inside hook callbacks and helper calls) so developers can easily understand the logic.

### 3. Asynchronous Post-Payment Tasks
- **NEVER** perform blocking API calls (CRMs, webhooks, external emails) synchronously inside payment execution loops.
- Use `fluent_cart/order_paid_done` or Action Scheduler for asynchronous background processing.

### 4. Database Access
- Use FluentCart Eloquent Models (`\FluentCart\App\Models\*`) rather than raw `$wpdb` queries whenever possible.

### 5. IoC Container & Global Helpers
- Access container services: `\FluentCart\App\App::make('cart')` or `\FluentCart\App\App::getInstance()`.
- Store configuration: `\FluentCart\App\Helpers\Helper::getStoreSettings()`.
- Default store currency: `\FluentCart\App\Helpers\Helper::getCurrency()`.
- System logging: `fluent_cart_add_log($title, $content, $type)` (`'info'`, `'error'`, `'warning'`).

---

## 🛠 Extension Code Templates

### 1. Extension Plugin Boilerplate
```php
<?php
/**
 * Plugin Name: Custom FluentCart Addon
 * Description: Custom extension for FluentCart.
 * Version:     1.0.0
 * Author:      Developer
 */

if (!defined('ABSPATH')) {
    exit;
}

// Guard execution until WordPress plugins are loaded and FluentCart is active
add_action('plugins_loaded', function () {
    if (!defined('FLUENT_CART')) {
        return; // FluentCart is not active
    }

    // Initialize custom hook listeners and extension logic
});
```

### 2. Surcharge / Extra Fee Filter Pattern
```php
// Add custom handling fee to cart estimated total
add_filter('fluent_cart/fee_items', function ($fees, $cart) {
    // Append $5.00 handling fee (500 cents)
    $fees[] = [
        'id'       => 'handling_fee',
        'title'    => __('Special Handling Fee', 'my-extension'),
        'amount'   => 500, // Amount in cents
        'taxable'  => false,
    ];
    return $fees;
}, 10, 2);
```

### 3. Order Paid Event Listener Pattern
```php
// Listen for completed order payments to trigger post-payment processing
add_action('fluent_cart/order_paid_done', function ($data) {
    // Extract order model and customer model instances from payload
    $order    = $data['order'];
    $customer = $data['customer'];

    // Log order completion event to FluentCart logs
    fluent_cart_add_log(
        'Order Completed',
        'Processed order #' . $order->id . ' for customer ' . $customer->email,
        'info'
    );
}, 10, 1);
```
