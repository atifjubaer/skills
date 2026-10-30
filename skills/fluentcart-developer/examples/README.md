# FluentCart Developer Examples & Boilerplates

This directory contains production-ready code examples, runnable plugins, and project templates for extending FluentCart.

## Available Examples

### 1. Custom Starter Addon Plugin (`sample-custom-addon/fluentcart-custom-addon.php`)
- Standalone WordPress plugin boilerplate for FluentCart.
- Features: Plugin initialization guards, `order_paid_done` event listener, system logging, dynamic fee surcharges, and a custom REST API endpoint (`/wp-json/fc-custom/v1/order-status/{id}`).

### 2. Fee & Surcharge Plugin (`sample-fee-surcharge-plugin/fluentcart-fee-surcharge.php`)
- Dynamic cart fee calculations using the `fluent_cart/fee_items` filter.
- Features: Conditional fixed fees (cents), percentage-based payment surcharges, and taxable flag settings.

### 3. Custom Payment Gateway Plugin (`sample-custom-payment-gateway/fluentcart-custom-gateway-example.php`)
- Demonstrates custom payment gateway development extending `AbstractPaymentGateway` and `BaseGatewaySettings`.
- Features: Gateway registration, settings schema, payment execution, error responses, and refund handling.

### 4. Custom Shipping Carrier (`sample-shipping-carrier/fluentcart-custom-shipping-carrier.php`)
- Dynamic shipping calculation via the `fluent_cart/shipping/methods` filter hook.
- Features: Rate calculation, free shipping thresholds, and real-time carrier response arrays.

### 5. Starter Child Theme (`fluentcart-starter-child-theme/`)
- Declarative `add_theme_support('fluent_cart')` child theme template.
- Features: Overriding checkout templates in `fluent-cart/checkout.php` and custom checkout hooks in `functions.php`.

### 6. Premium Plugin with Software Licensing SDK (`sample-plugin-with-licensing-sdk/`)
- Full integration of the official FluentCart Software Licensing SDK (`fluent-cart/software-licensing-sdk`).
- Features: Remote license key validation/activation, native WordPress one-click updates via `PluginUpdater`, turnkey admin license settings page via `LicenseSettings`, and conditional premium feature gating.

