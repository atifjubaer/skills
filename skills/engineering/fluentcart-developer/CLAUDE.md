# Claude Code Instructions for FluentCart Development

This project is built using FluentCart (v1.5.1) for WordPress.

## Build/Developer Guidelines
- Always preserve theme compatibility actions: `add_theme_support('fluent_cart')`.
- All FluentCart page templates should be loaded via WordPress standard theme templates or overrides inside `fluent-cart/` subdirectory.
- Always include single-line comments in code to document key actions.

---

## Advanced Reference Documentation Map

When performing advanced integrations, consult the following relative documentation files:

- **Custom Payment Gateways:** Read `references/payment-gateway-integration.md` for settings and gateway registration.
- **Ghost Products (On-the-fly Items):** Read `references/ghost-product-selling.md` for dynamic triggers and cart filters.
- **Dynamic & Persistent Fees:** Read `references/fee-system-guide.md` for surcharge and fee structures.
- **Subscriptions & Billing Intervals:** Read `references/subscription-customization.md` for grace periods and intervals.
- **Database Models & Query Builder:** Read `references/database-models-query-builder.md` for Eloquent model CRUD code.
- **WordPress Hooks & Filters Catalog:** Read `references/hooks-actions-filters.md` for action events and filter hooks.
- **REST API Endpoints & Webhooks:** Read `references/rest-api-endpoints-reference.md` and `references/rest-api-webhooks.md`.
- **Shipping, Storage, Licensing & Order Bumps:** Read `references/shipping-storage-licensing.md` for custom shipping, storage drivers, Pro licensing, and order bumps.
- **WP-CLI Commands:** Read `references/wp-cli-commands.md` for migrations and database imports.
- **Easy Digital Downloads (EDD) Migration & Compatibility:** Read `references/edd-migration-compatibility-guide.md` for CLI commands and backward compatibility.
- **Classic Theme Development:** Read `references/theme-development-guide.md` for template overrides.

---

## Command Reference
- Link theme to local WordPress setup:
  `cmd /c mklink /J "C:\path\to\wordpress\wp-content\themes\your-theme-name" "."`

