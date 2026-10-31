---
name: "fluentcart-developer"
description: "Comprehensive developer knowledge base for FluentCart WordPress e-commerce. Build custom plugins, add-ons, classic and block themes, monetize and license software via the official Software Licensing SDK, create custom payment gateways with recurring subscriptions, implement dynamic shipping carriers, extend the Vue 3 customer dashboard with addCustomerDashboardEndpoint, query 34 Eloquent database tables, and leverage 680+ action and filter hooks."
summary: "Developer architecture manual and code generator for FluentCart WordPress e-commerce: custom add-ons, themes, software licensing SDK, payment gateways, and shipping integrations."
version: "1.2.0"
license: "MIT"
tags:
  - wordpress
  - ecommerce
  - fluentcart
  - payments
  - licensing
  - php
keywords:
  - fluentcart
  - wordpress e-commerce
  - software licensing sdk
  - payment gateways
  - custom shipping
  - customer dashboard
  - hook listener
use_cases:
  - Monetizing and licensing WordPress plugins & themes via FluentCart Pro
  - Building custom FluentCart payment gateways with subscriptions and webhooks
  - Extending the customer dashboard portal with custom server-rendered tabs
  - Developing custom shipping carriers and dynamic cart fee surcharges
  - Querying FluentCart Eloquent database models and REST API endpoints
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
- [software-licensing-sdk.md](references/software-licensing-sdk.md) — Official FluentCart Software Licensing SDK (`fluent-cart/software-licensing-sdk`): client-side plugin updates, `FluentLicensing`, `LicenseSettings`, `PluginUpdater`, remote endpoints (`?fluent-cart=activate_license`), and filter hooks.
- [customer-dashboard-endpoints.md](references/customer-dashboard-endpoints.md) — Adding custom pages/tabs to the Vue 3 customer dashboard via `fluent_cart_api()->addCustomerDashboardEndpoint()`, hybrid routing tricks, reserved slugs, and customer session resolution.
- [storage-drivers-module.md](references/storage-drivers-module.md) — Storage drivers architecture (`BaseStorageDriver`, `BaseStorageInterface`, `FileManager`), creating custom cloud drivers (S3, Wasabi, R2), and signed download URLs.
- [shipping-module-guide.md](references/shipping-module-guide.md) — Shipping module architecture, shipping zones, dynamic carrier rate calculation (`fluent_cart/shipping/methods`), and shipping classes.
#### Runnable Code Examples & Project Boilerplates (`examples/`)
- [examples/README.md](examples/README.md) — Inventory and developer guide for ready-to-use sample plugins and templates.
- [sample-custom-addon/fluentcart-custom-addon.php](examples/sample-custom-addon/fluentcart-custom-addon.php) — Complete starter plugin with hook handlers, custom order meta, system logging, fee filters, and custom REST API endpoint.
- [sample-fee-surcharge-plugin/fluentcart-fee-surcharge.php](examples/sample-fee-surcharge-plugin/fluentcart-fee-surcharge.php) — Dynamic conditional fee surcharges (cents calculations, percentage payment surcharges).
- [sample-custom-payment-gateway/fluentcart-custom-gateway-example.php](examples/sample-custom-payment-gateway/fluentcart-custom-gateway-example.php) — Complete custom payment gateway implementation extending `AbstractPaymentGateway` and `BaseGatewaySettings`.
- [sample-shipping-carrier/fluentcart-custom-shipping-carrier.php](examples/sample-shipping-carrier/fluentcart-custom-shipping-carrier.php) — Dynamic shipping carrier calculation filter callback example.
- [fluentcart-starter-child-theme/](examples/fluentcart-starter-child-theme/) — Starter child theme with `add_theme_support('fluent_cart')` and template override structure.
- [sample-plugin-with-licensing-sdk/](examples/sample-plugin-with-licensing-sdk/) — Premium WordPress plugin with official FluentCart Software Licensing SDK integration, remote activation, and native one-click updates.

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

### 4. Custom Payment Gateway Boilerplate
```php
<?php
defined('ABSPATH') || exit;

use FluentCart\App\Services\Gateways\AbstractPaymentGateway;
use FluentCart\App\Services\Gateways\BaseGatewaySettings;

class CustomPayGateway extends AbstractPaymentGateway
{
    protected string $gateway = 'custom_pay';
    protected string $title   = 'CustomPay';

    public function init(): void
    {
        // Declare feature capabilities (products, refunds, subscriptions)
        $this->supports = ['products', 'refunds', 'subscriptions'];
    }

    public function handlePayment(array $orderData): array
    {
        $orderId     = $orderData['id'];
        $amountCents = $orderData['total']; // Amount in cents

        // Call external processor API to create checkout session
        $redirectUrl = 'https://checkout.example.com/pay/' . $orderId;

        return [
            'status'       => 'pending',
            'redirect_url' => $redirectUrl,
            'message'      => __('Redirecting to payment provider...', 'my-gateway')
        ];
    }

    public function handleWebhook(): void
    {
        $payload = file_get_contents('php://input');
        // Validate webhook signature and update order status via:
        // do_action('fluent_cart/order_status_updated', $orderId, 'paid');
    }
}

// Register gateway in FluentCart
add_action('fluent_cart/loaded', function () {
    add_filter('fluent_cart/payment_methods', function (array $gateways): array {
        $gateways['custom_pay'] = new CustomPayGateway();
        return $gateways;
    });
});
```

### 5. Monetizing Software: Licensing SDK & Automatic Updates
Integrate the official FluentCart Software Licensing SDK (`fluent-cart/software-licensing-sdk`) into commercial WordPress plugins or themes for remote license key activation and one-click updates directly in `wp-admin/plugins.php`:

```php
<?php
defined('ABSPATH') || exit;

add_action('plugins_loaded', function () {
    if (!class_exists('\MyPlugin\FluentLicensing')) {
        require_once plugin_dir_path(__FILE__) . 'updater/FluentLicensing.php';
    }

    $licenseManager = new \MyPlugin\FluentLicensing();

    // 1. Register with your FluentCart store
    $licenseManager->register([
        'version'           => '1.0.0',                      // Current plugin version
        'item_id'           => 42,                           // FluentCart Pro Product/Item ID
        'basename'          => plugin_basename(__FILE__),    // Plugin basename
        'api_url'           => 'https://mystore.example.com/', // FluentCart store URL
        'plugin_title'      => 'My Commercial Plugin Pro',   // Plugin title
        'purchase_url'      => 'https://mystore.example.com/checkout/?item_id=42',
        'activate_url'      => admin_url('tools.php?page=my-plugin-license'),
        'show_check_update' => true,
        'settings_key'      => '__my_plugin_license_config'
    ]);

    // 2. Attach Turnkey Admin Settings UI
    if (is_admin() && class_exists('\MyPlugin\LicenseSettings')) {
        $settings = new \MyPlugin\LicenseSettings();
        $settings->register($licenseManager);

        $settings->setConfig([
            'title'       => __('My Plugin License', 'my-plugin'),
            'heading'     => __('Activate License Key', 'my-plugin'),
            'description' => __('Enter your FluentCart license key to receive one-click automatic updates.', 'my-plugin')
        ]);

        $settings->addPage([
            'type'        => 'submenu',
            'parent_slug' => 'tools.php',
            'page_title'  => __('License Settings', 'my-plugin'),
            'menu_title'  => __('Plugin License', 'my-plugin'),
            'capability'  => 'manage_options',
            'menu_slug'   => 'my-plugin-license'
        ]);
    }
});

// 3. Conditional Feature Gating Helper
function my_plugin_is_licensed(): bool
{
    if (!class_exists('\MyPlugin\FluentLicensing')) {
        return false;
    }
    $manager = \MyPlugin\FluentLicensing::getInstance();
    $status = $manager ? $manager->getStatus() : null;
    return !is_wp_error($status) && isset($status['status']) && $status['status'] === 'valid';
}
```

### 6. Theme & Child Theme Development
Enable FluentCart theme compatibility and override default templates cleanly:

```php
// In child theme functions.php
add_action('after_setup_theme', function () {
    // Declare explicit FluentCart theme support
    add_theme_support('fluent_cart');
});
```

#### Template Override Hierarchy:
To customize frontend checkout or receipt views without editing core:
1. Create a `fluent-cart/` directory in your active theme or child theme.
2. Copy the template from FluentCart core (`app/Views/`):
   - `your-theme/fluent-cart/checkout.php` — Custom checkout container.
   - `your-theme/fluent-cart/receipt.php` — Custom thank-you / receipt layout.
   - `your-theme/fluent-cart/shop.php` — Product catalog grid wrapper.

### 7. Customer Dashboard Extensibility (`addCustomerDashboardEndpoint`)
Add custom server-rendered pages and navigation tabs to the Vue 3 customer dashboard without compiling Vue or flushing permalinks:

```php
<?php
defined('ABSPATH') || exit;

use FluentCart\Api\Resource\CustomerResource;

add_action('fluent_cart/init', function () {
    if (!function_exists('fluent_cart_api')) {
        return;
    }

    fluent_cart_api()->addCustomerDashboardEndpoint('my-custom-portal', [
        'title'           => __('VIP Portal', 'my-addon'),
        'icon_svg'        => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" fill="currentColor"/></svg>',
        'render_callback' => function () {
            // 1. Resolve logged-in customer (memoized, free)
            $customer = CustomerResource::getCurrentCustomer();
            if (!$customer) {
                echo '<p>' . esc_html__('Please log in.', 'my-addon') . '</p>';
                return;
            }

            // 2. Render HTML matching portal design system
            echo '<div class="fct-custom-tab-box" style="padding: 24px; background: #fff; border: 1px solid var(--fct-customer-dashboard-border-color, #e5e7eb); border-radius: 8px;">';
            echo '<h2>' . esc_html(sprintf(__('Hello, %s!', 'my-addon'), $customer->full_name)) . '</h2>';
            echo '<p>' . esc_html__('Welcome to your custom account portal.', 'my-addon') . '</p>';
            echo '</div>';
        }
    ]);
});
```

### 8. Dynamic Shipping Carrier Rate Filter
Inject real-time shipping options or carrier calculations into checkout:

```php
add_filter('fluent_cart/shipping/methods', function (array $methods, $cart, array $address): array {
    if (!$cart->needsShipping()) {
        return $methods;
    }

    $methods[] = [
        'id'          => 'custom_express_air',
        'title'       => __('Express Air Delivery', 'my-addon'),
        'cost'        => 1800, // $18.00 in cents
        'description' => __('Arrives in 1-2 business days', 'my-addon'),
        'meta'        => ['carrier' => 'SkyPost', 'days' => 2]
    ];

    return $methods;
}, 10, 3);
```

### 9. Ghost Products / Dynamic Line Items
Sell arbitrary services, custom quotes, or event tickets dynamically without creating permanent database products:

```php
// Inject custom dynamic cart line item
add_filter('fluent_cart/cart_items', function (array $items, $cart) {
    if (isset($_GET['custom_donation'])) {
        $amountCents = absint($_GET['custom_donation']) * 100;
        $items[] = [
            'id'             => 'ghost_donation_' . $amountCents,
            'title'          => __('Community Donation', 'my-addon'),
            'unit_price'     => $amountCents,
            'quantity'       => 1,
            'taxable'        => false,
            'is_virtual'     => true,
            'line_total'     => $amountCents
        ];
    }
    return $items;
}, 10, 2);
```

---

## ⚡ Fastr MCP Server Tools Guidance

When paired with the **Fastr MCP Suite**, AI coding assistants must use these 6 dedicated FluentCart tools instead of guessing or loading giant documentation files into context:

| Tool | Purpose | Typical User Query |
|---|---|---|
| `fc_search_hooks` | Instant search across 680+ action and filter hooks with exact parameters and file anchors. | *"What hook fires after an order is completed?"* |
| `fc_get_db_schema` | Look up exact column definitions, primary keys, and Eloquent model for any `wp_fct_*` table. | *"What columns are on the subscriptions table?"* |
| `fc_get_reference` | Read any of the 52 comprehensive reference manuals in full or by specific section heading. | *"Show me the Void Renewal Invoice section of the REST API."* |
| `fc_generate_payment_gateway_boilerplate` | Generate production-ready PHP boilerplate for custom payment gateways with webhook listeners. | *"Generate a payment gateway for Paddle Billing."* |
| `fc_generate_licensing_boilerplate` | Generate client-side integration boilerplate for the official FluentCart Software Licensing SDK. | *"How do I add FluentCart licensing to my premium plugin?"* |
| `fc_generate_customer_endpoint_boilerplate` | Generate PHP code for custom server-rendered tabs and sub-pages in the Vue 3 customer dashboard. | *"Add a Wallet tab to the FluentCart customer portal."* |

