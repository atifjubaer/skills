# FluentCart Developer Examples & Boilerplates

This directory contains production-ready code examples and project templates for extending FluentCart.

## Available Examples

### 1. Custom Payment Gateway Plugin (`sample-custom-payment-gateway/`)
- Demonstrates how to create a custom payment gateway extension extending `AbstractPaymentGateway` and `BaseGatewaySettings`.
- Features: Gateway registration, settings schema, payment execution, error responses, and refund support.

### 2. Custom Shipping Carrier Method (`sample-shipping-carrier/`)
- Demonstrates dynamic shipping calculation via the `fluent_cart/shipping/methods` filter.
- Features: Weight-based rate calculation, free shipping thresholds, and real-time shipping rate responses.

### 3. Starter Child Theme (`fluentcart-starter-child-theme/`)
- Demonstrates how to declare `add_theme_support('fluent_cart')`, override checkout templates in `fluent-cart/checkout.php`, and hook into the checkout lifecycle.
