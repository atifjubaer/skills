---
name: "fluentcart-developer"
description: "Comprehensive developer knowledge base for FluentCart e-commerce plugin development. Covers theme compatibility, template system, classic & block themes, action & filter hooks, Facebook Meta Pixel & GA4 tracking, Elementor, Gutenberg & Bricks integration, custom payment gateways, dynamic shipping carriers, database models, REST API, fee surcharges, ghost products, subscriptions, and WP-CLI."
summary: "Developer knowledge base and architecture manual for FluentCart WordPress e-commerce: hooks, database schemas, REST APIs, custom payment gateways, and shipping integrations."
version: "1.0.0"
license: "MIT"
tags:
  - wordpress
  - ecommerce
  - fluentcart
  - payments
  - php
keywords:
  - fluentcart
  - wordpress e-commerce
  - payment gateways
  - custom shipping
  - hook listener
use_cases:
  - Building custom FluentCart payment gateways
  - Developing FluentCart shipping carriers and fee surcharges
  - Querying FluentCart database tables and REST endpoints
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

#### Complete Hook Index
- [hooks-complete-index.md](references/hooks-complete-index.md) — Every hook the docs publish (680): name, purpose and source file, including the Module and Pro-Module hooks that have no per-topic file, plus the deprecated names that still fire. Check here first when a hook is not in the 14 topic files above.

#### Core Architecture & System References
- [fluentcart-developer-guide.md](references/fluentcart-developer-guide.md) — Comprehensive developer guide, core concepts, codebase directory layout, and version comparison.
- [database-schema-reference.md](references/database-schema-reference.md) — Complete database schema for all `wp_fct_*` tables.
- [database-models-reference.md](references/database-models-reference.md) — FluentCart Eloquent Models, relationships, and scopes across Core and Pro modules.
- [models-complete-index.md](references/models-complete-index.md) — Every model the docs publish (41), with DB table, class, source file, traits, attributes and relationships. Use when the model is not in `database-models-reference.md`.
- [database-models-query-builder.md](references/database-models-query-builder.md) — FluentCart ORM Query Builder usage, aggregates, CRUD operations, and comprehensive model map.
- [rest-api-reference.md](references/rest-api-reference.md) — Full REST API endpoints index, authentication, request/response formats.
- [rest-api-overview.md](references/rest-api-overview.md) — REST API getting started, authentication standards, module catalog, permission system (32 permissions across 4 roles), and error handling.
- [rest-api-orders.md](references/rest-api-orders.md) — Orders REST API (26 endpoints): CRUD, calculate shipping/tax, price preview, order currencies, bulk actions, refunds, customer reassignment, dispute handling, transactions.
- [rest-api-products.md](references/rest-api-products.md) — Products REST API (62 endpoints): CRUD, pricing, search/lookup, bulk operations (incl. variant bulk update), duplicate, bundle info, upgrade paths, inventory, downloadables, variations, tax exemption, integrations.
- [rest-api-customers.md](references/rest-api-customers.md) — Customers REST API (18 endpoints): CRUD, additional info (labels), bulk actions, order history, LTV recalculation, address management, WP user association.
- [rest-api-coupons.md](references/rest-api-coupons.md) — Coupons REST API (12 endpoints): CRUD, paginated listing, apply/cancel/reapply, product eligibility, checkout settings, Coupon model & DB table reference.
- [rest-api-subscriptions.md](references/rest-api-subscriptions.md) — Subscriptions REST API (27 endpoints): Admin lifecycle (cancel, charge-now, create-renewal, skip-renewal, update, vendor-id repair), renewal invoices (list, show, resend, void), Customer Portal self-service (payment updates, gateway switching, auto-renew cancellation), status constants, and hooks.
- [rest-api-tax.md](references/rest-api-tax.md) — Tax REST API (26 endpoints): Tax filing, tax classes, country rates, shipping/product category overrides, global tax settings, and EU VAT / OSS cross-border compliance.
- [rest-api-shipping.md](references/rest-api-shipping.md) — Shipping REST API (15 endpoints, `store/sensitive` permission): Shipping zones (region reset side effects, reordering), shipping methods (`flat_rate`, `free_shipping`, `local_pickup`, state scoping), shipping classes (`fixed` & `percentage` costs, `per_item` flags), and data models.
- [rest-api-settings.md](references/rest-api-settings.md) — Settings REST API (30 endpoints, `StoreSettingsPolicy` & `is_super_admin`): Gateway setup (Stripe, PayPal connect, reordering, designs, addons), PayPal OAuth & webhooks, store configuration (`FluentMetaRequest`), module toggles, permissions, confirmation shortcodes, storage drivers (S3, Bunny, Local), and checkout fields.
- [rest-api-email-notifications.md](references/rest-api-email-notifications.md) — Email Notifications REST API (11 endpoints, `store/sensitive` permission): Email templates catalog (order, subscription, scheduler), single template editor shortcodes, template HTML previews (custom & default PHP), global email sender configuration, and automated scheduling reminders.
- [rest-api-reports.md](references/rest-api-reports.md) — Reports API (45 endpoints, `ReportPolicy` & `reports/view` permission): Standard report parameters, YoY revenue overview, sales growth, quick stats, revenue/orders by grouping dimensions, day/hour heatmap, top products/variants, refund analytics, software license metrics, subscription MRR & cohort retention matrices, Action Scheduler snapshot generation, and UTM source attribution.
- [rest-api-integrations.md](references/rest-api-integrations.md) — Integrations API (17 endpoints, `IntegrationPolicy` & `ProductPolicy`): Addon listings & WP.org auto-installer, global provider credentials, global integration feeds, list merge field mapping, dynamic options & chained inputs, product-level integration feeds (`conditional_variation_ids`), and status toggles.
- [rest-api-files.md](references/rest-api-files.md) — Files API (5 endpoints, `StoreSensitivePolicy` & `AdminPolicy`): Downloadable file CRUD across storage drivers (Local, S3, Bunny, R2), timestamp collision prevention (`name__fluent-cart__.timestamp.ext`), blocked extension filters (`fluent_cart/local_file_blocked_extensions`), storage bucket lists, and WP Media Library editor image uploads (`media_handle_upload`).
- [rest-api-labels-attributes.md](references/rest-api-labels-attributes.md) — Labels & Attributes API (13 endpoints, `LabelPolicy` & `ProductPolicy`): Polymorphic order/customer labels (`LabelRequest`, `update-label-selections`), variation attribute groups (`AttrGroupRequest`, deletion guards), and attribute terms (`AttrTermRequest`, serial ordering).
- [rest-api-dashboard-utilities.md](references/rest-api-dashboard-utilities.md) — Dashboard & Utilities API (20 endpoints): Onboarding checklist wizard, 30-day dashboard stats widgets, page generator (`CreatePageRequest`), admin SPA init (`/app/init`), activity log (`/activity`), order notes, print HTML templates (invoices & slips), dynamic widgets, country address locales, and advanced filter options.
- [rest-api-public-shop.md](references/rest-api-public-shop.md) — Public Shop API (3 endpoints, `PublicPolicy` unauthenticated): Public catalog product browsing with taxonomy/price filters (cents pricing in `detail`), server-rendered HTML grid views for Gutenberg blocks & shortcodes (`ProductListRenderer`, transient block caching), and live search autocomplete (`SearchBarRenderer`).
- [rest-api-checkout.md](references/rest-api-checkout.md) — Checkout API (7 endpoints, `PublicPolicy`): Order placement (`place-order`, rate limit 5 req/60s), gateway UI configuration (`get-order-info`), cart summary calculation with shipping (`get-checkout-summary-view`), shipping availability (`get-available-shipping-methods` & list view), country locale rules (`get-country-info`), and customer login (`/user/login` with `X-WP-Nonce`).
- [rest-api-customer-profile.md](references/rest-api-customer-profile.md) — Customer Profile API (18 endpoints, `CustomerFrontendPolicy` authenticated): Portal dashboard overview, profile details & password updates, checkout address selector (`fct_cart_hash`), portal address management (guards against deleting primary/last address), order history & UUID details, plan upgrade paths & prorations, transaction invoice billing address editing (`vat_tax_id`), and signed digital file downloads.
- [rest-api-licensing.md](references/rest-api-licensing.md) — Licensing API (22 endpoints, `LicensePolicy` & Pro required): Admin software license CRUD, key regeneration, validity extensions (`lifetime` or `YYYY-MM-DD`), per-product variation validity rules (disabled for bundles), customer portal self-service activations, site Pro plugin licensing, and non-REST public software update API (`/?fluent-cart={action}`) with 48-hour signed package download tokens & staging auto-detection.
- [rest-api-roles-permissions.md](references/rest-api-roles-permissions.md) — Roles & Permissions API (7 endpoints, `AdminPolicy` & Pro required): List managers, user search (excluding WP admins), role definitions (`super_admin`, `manager`, `worker`, `accountant`), role assignment sync (`fluent_cart_admin`), role deletion, and capability matrix filters (`fluent_cart/permission/all_roles`).
- [rest-api-order-bumps.md](references/rest-api-order-bumps.md) — Order Bumps API (5 endpoints, `OrderBumpPolicy` & `store/sensitive` & Pro required): Checkout order bump promotion CRUD (`fct_order_promotions` table), `product_variant` eager loading, discount configuration (`percentage` vs `fixed` in cents), priority ordering, and cart condition rules.
- [modules-and-extensions-reference.md](references/modules-and-extensions-reference.md) — Building payment gateways, shipping carriers, fee surcharges, ghost products.
- [engineering-notes.md](references/engineering-notes.md) — Architecture decisions, performance work, and production lessons from FluentCart's core engineering team.

#### Tutorials & Implementation Guides
- [fee-system-guide.md](references/fee-system-guide.md) — Fee system (surcharges & additional charges), dynamic fees via filter, persistent fees via Cart methods, complete tiered fee addon example.
- [ghost-product-selling.md](references/ghost-product-selling.md) — Ghost product selling, custom cart items, validation hooks, quantity changes, checkout validation, admin order updates, sample datasets.
- [payment-gateway-integration.md](references/payment-gateway-integration.md) — Payment Methods module architecture, custom gateway development (gateway class, settings, API, webhooks), registration, processing flow, testing.
- [paddle-gateway-case-study.md](references/paddle-gateway-case-study.md) — Paddle payment gateway case study, settings field schema, real-world gateway implementation example.
#### Runnable Code Examples & Project Boilerplates (`examples/`)
- [examples/README.md](examples/README.md) — Inventory and developer guide for ready-to-use sample plugins and templates.
- [sample-custom-addon/fluentcart-custom-addon.php](examples/sample-custom-addon/fluentcart-custom-addon.php) — Complete starter plugin with hook handlers, custom order meta, system logging, fee filters, and custom REST API endpoint.
- [sample-fee-surcharge-plugin/fluentcart-fee-surcharge.php](examples/sample-fee-surcharge-plugin/fluentcart-fee-surcharge.php) — Dynamic conditional fee surcharges (cents calculations, percentage payment surcharges).
- [sample-custom-payment-gateway/fluentcart-custom-gateway-example.php](examples/sample-custom-payment-gateway/fluentcart-custom-gateway-example.php) — Complete custom payment gateway implementation extending `AbstractPaymentGateway` and `BaseGatewaySettings`.
- [sample-shipping-carrier/fluentcart-custom-shipping-carrier.php](examples/sample-shipping-carrier/fluentcart-custom-shipping-carrier.php) — Dynamic shipping carrier calculation filter callback example.
- [fluentcart-starter-child-theme/](examples/fluentcart-starter-child-theme/) — Starter child theme with `add_theme_support('fluent_cart')` and template override structure.

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
