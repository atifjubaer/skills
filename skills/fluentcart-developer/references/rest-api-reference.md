# FluentCart REST API Master Reference

> Source: https://dev.fluentcart.com/restapi/

Complete REST API reference for FluentCart and FluentCart Pro. This reference covers all **373+ endpoints** across 20 API categories, with base URLs, authentication methods, conventions, and error formats.

---

## Overview & Conventions

### Base URL & Namespace
- **REST Namespace:** `/wp-json/fluent-cart/v2`
- **Base URL:** `https://your-site.com/wp-json/fluent-cart/v2`

### Authentication Methods

1. **WordPress Application Passwords (HTTP Basic Auth)**
   - Recommended for server-to-server integrations & admin tools.
   - Header: `Authorization: Basic base64(username:application_password)`
   ```bash
   curl -X GET "https://your-site.com/wp-json/fluent-cart/v2/orders" \
     -u "username:application_password"
   ```

2. **WordPress Cookie & Nonce Auth (Customer Portal / Admin UI)**
   - Used for frontend requests or internal WP admin calls.
   - Pass cookie + `X-WP-Nonce` header.
   ```bash
   curl -X GET "https://your-site.com/wp-json/fluent-cart/v2/customer-profile/" \
     -H "X-WP-Nonce: <nonce>" \
     --cookie "wordpress_logged_in_xxx=..."
   ```

3. **Public License & Catalog APIs**
   - Endpoints under `/public/` or `?fluent-cart=` do not require authentication.

### Core Conventions
- **Monetary Values:** All prices, totals, taxes, and refunds are integers stored in **cents** (`$10.00` = `1000`).
- **Dates & Timestamps:** UTC/GMT formatted as ISO strings (`YYYY-MM-DD HH:MM:SS`).
- **Pagination:** Query parameters `page` (default `1`) and `per_page` (default `10`, max `100`).
- **Error Response Format:**
  ```json
  {
    "message": "Error message description",
    "errors": {
      "field_name": ["Specific validation error message"]
    }
  }
  ```

---

## 1. Orders API

Manage customer orders including creation, updates, payments, refunds, shipping, and status management.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/orders` | List Orders (supports `page`, `per_page`, `status`, `payment_status`, `search`, `start_date`, `end_date`) |
| `POST` | `/orders` | Create Order |
| `GET` | `/orders/{order_id}` | Get Single Order Details |
| `POST` | `/orders/{order_id}` | Update Order details |
| `DELETE` | `/orders/{order_id}` | Delete Order |
| `POST` | `/orders/calculate-shipping` | Calculate Shipping options for order |
| `POST` | `/orders/do-bulk-action` | Perform bulk operations (status change, delete) |
| `POST` | `/orders/{order}/mark-as-paid` | Manually mark order as paid |
| `POST` | `/orders/{order}/generate-missing-licenses` | Regenerate missing licenses for digital order |
| `POST` | `/orders/{order_id}/update-address-id` | Update Order Address ID |
| `POST` | `/orders/{order_id}/refund` | Process full/partial refund (`amount` in cents, `reason`, `restore_stock`) |
| `POST` | `/orders/{order_id}/change-customer` | Assign order to a different customer ID |
| `POST` | `/orders/{order_id}/create-and-change-customer` | Create new customer profile & assign to order |
| `PUT` | `/orders/{order}/statuses` | Update Order & Payment Statuses |
| `GET` | `/orders/{order}/transactions` | Get all transactions associated with order |
| `GET` | `/orders/{id}/transactions/{transaction_id}` | Get single transaction details |
| `PUT` | `/orders/{order}/transactions/{transaction}/status` | Update transaction status |
| `POST` | `/orders/{order}/transactions/{transaction_id}/accept-dispute/` | Accept payment gateway dispute |
| `PUT` | `/orders/{order}/address/{id}` | Update Order Address |
| `POST` | `/orders/{order}/create-custom` | Add custom line item to order |
| `GET` | `/orders/shipping_methods` | List available shipping methods for order |
| `PUT` | `/orders/{order}/sync-statuses` | Sync order statuses with payment gateway |

---

## 2. Products API

Manage product catalog, variations, pricing, stock, downloadable files, bundles, upgrade paths, and integrations.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/products` | List Products |
| `POST` | `/products` | Create Product |
| `GET` | `/products/{product}` | Get Product Details |
| `DELETE` | `/products/{product}` | Delete Product |
| `GET` | `/products/{productId}/pricing` | Get Product Pricing Info |
| `POST` | `/products/{postId}/pricing` | Update Product Pricing |
| `GET` | `/products/searchProductByName` | Search products by name |
| `GET` | `/products/searchVariantByName` | Search product variants by name |
| `GET` | `/products/search-product-variant-options` | Search product variation options |
| `GET` | `/products/findSubscriptionVariants` | Get subscription variations |
| `GET` | `/products/fetchProductsByIds` | Fetch multiple products by ID array |
| `GET` | `/products/fetchVariationsByIds` | Fetch multiple variations by ID array |
| `GET` | `/products/suggest-sku` | Auto-generate suggested SKU |
| `GET` | `/products/get-max-excerpt-word-count` | Get max excerpt settings |
| `GET` | `/products/fetch-term` | Fetch product taxonomy terms |
| `POST` | `/products/fetch-term-by-parent` | Fetch product taxonomy terms by parent |
| `POST` | `/products/bulk-insert` | Bulk create products |
| `GET` | `/products/bulk-edit-data` | Fetch data for bulk editor |
| `POST` | `/products/bulk-update` | Bulk update products |
| `POST` | `/products/do-bulk-action` | Perform bulk operations |
| `POST` | `/products/create-dummy` | Generate dummy test products |
| `POST` | `/products/{productId}/duplicate` | Duplicate product |
| `GET` | `/products/{productId}/related-products` | Get related products |
| `POST` | `/products/{postId}/update-long-desc-editor-mode` | Toggle description editor mode |
| `POST` | `/products/{postId}/update-variant-option` | Update variation option |
| `POST` | `/products/detail/{detailId}` | Update Product Detail record |
| `POST` | `/products/add-product-terms` | Attach terms/categories to product |
| `POST` | `/products/sync-taxonomy-term/{postId}` | Sync taxonomy terms |
| `POST` | `/products/delete-taxonomy-term/{postId}` | Detach taxonomy term |
| `GET` | `/products/{productId}/pricing-widgets` | Get product pricing widgets |
| `GET` | `/products/get-bundle-info/{productId}` | Get product bundle details |
| `POST` | `/products/save-bundle-info/{variationId}` | Save product bundle configuration |
| `GET` | `/products/{id}/upgrade-paths` | Get subscription upgrade paths |
| `POST` | `/products/{id}/upgrade-path` | Create upgrade path |
| `POST` | `/products/upgrade-path/{id}/update` | Update upgrade path |
| `DELETE` | `/products/upgrade-path/{id}/delete` | Delete upgrade path |
| `GET` | `/products/variation/{variantId}/upgrade-paths` | Get variation upgrade paths |
| `POST` | `/products/{postId}/tax-class` | Assign tax class to product |
| `POST` | `/products/{postId}/tax-class/remove` | Remove tax class from product |
| `POST` | `/products/{postId}/shipping-class` | Assign shipping class to product |
| `POST` | `/products/{postId}/shipping-class/remove` | Remove shipping class |
| `PUT` | `/products/{postId}/update-inventory/{variantId}` | Update variation stock inventory |
| `PUT` | `/products/{postId}/update-manage-stock` | Toggle stock management |
| `POST` | `/products/{postId}/sync-downloadable-files` | Sync downloadable files |
| `PUT` | `/products/{downloadableId}/update` | Update downloadable file record |
| `DELETE` | `/products/{downloadableId}/delete` | Delete downloadable file |
| `GET` | `/products/getDownloadableUrl/{downloadableId}` | Generate download URL |
| `GET` | `/products/variants` | List product variations |
| `POST` | `/products/variants` | Create variation |
| `POST` | `/products/variants/{variantId}` | Update variation |
| `DELETE` | `/products/variants/{variantId}` | Delete variation |
| `POST` | `/products/variants/{variantId}/setMedia` | Set variation featured image/gallery |
| `PUT` | `/products/variants/{variantId}/pricing-table` | Update variation pricing table |
| `GET` | `/variants` | List all variations globally |
| `GET` | `/products/{productId}/integrations` | Get product integrations |
| `GET` | `/products/{product_id}/integrations/{integration_name}/settings` | Get product integration settings |
| `POST` | `/products/{product_id}/integrations` | Save product integration |
| `DELETE` | `/products/{product_id}/integrations/{integration_id}` | Remove product integration |
| `POST` | `/products/{product_id}/integrations/feed/change-status` | Toggle integration feed status |

---

## 3. Customers API

Manage customer profiles, address books, WordPress user linking, and customer stats.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/customers` | List Customers (paginated) |
| `POST` | `/customers` | Create Customer |
| `GET` | `/customers/{customerId}` | Get Single Customer Details |
| `PUT` | `/customers/{customerId}` | Update Customer |
| `PUT` | `/customers/{customerId}/additional-info` | Update customer notes & info |
| `POST` | `/customers/do-bulk-action` | Bulk customer operations |
| `GET` | `/customers/get-stats/{customer}` | Get customer lifetime stats |
| `GET` | `/customers/{customerId}/orders` | List orders for customer |
| `GET` | `/customers/{customerId}/order` | Get latest customer order |
| `POST` | `/customers/{customerId}/recalculate-ltv` | Recalculate customer LTV & AOV |
| `GET` | `/customers/{customerId}/address` | Get customer addresses |
| `POST` | `/customers/{customerId}/address` | Create customer address |
| `PUT` | `/customers/{customerId}/address` | Update customer address |
| `DELETE` | `/customers/{customerId}/address` | Delete customer address |
| `POST` | `/customers/{customerId}/address/make-primary` | Set primary address |
| `GET` | `/customers/attachable-user` | Find attachable WordPress users |
| `POST` | `/customers/{customerId}/attachable-user` | Link WordPress user to customer |
| `POST` | `/customers/{customerId}/detach-user` | Unlink WordPress user |

---

## 4. Coupons API

Create and manage promotional discount coupons, conditions, and storewide rules.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/coupons/listCoupons` | List all active coupon codes |
| `GET` | `/coupons` | List Coupons (paginated) |
| `GET` | `/coupons/getSettings` | Get coupon module settings |
| `GET` | `/coupons/{id}` | View coupon details |
| `POST` | `/coupons` | Create Coupon |
| `PUT` | `/coupons/{id}` | Update Coupon |
| `DELETE` | `/coupons/{id}` | Delete Coupon |
| `POST` | `/coupons/apply` | Validate & apply coupon code to cart/checkout |
| `POST` | `/coupons/cancel` | Remove coupon code |
| `POST` | `/coupons/re-apply` | Re-apply coupon rules |
| `POST` | `/coupons/checkProductEligibility` | Check if product qualifies for coupon |
| `POST` | `/coupons/storeCouponSettings` | Save coupon settings |

---

## 5. Subscriptions API

Manage recurring billing subscriptions, plan changes, cancellations, and renewals.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/subscriptions` | List Subscriptions (admin) |
| `GET` | `/subscriptions/{subscriptionOrderId}` | Get subscription details (admin) |
| `PUT` | `/orders/{order}/subscriptions/{subscription}/cancel` | Cancel subscription |
| `PUT` | `/orders/{order}/subscriptions/{subscription}/fetch` | Sync remote subscription status |
| `POST` | `/orders/{order}/subscriptions/{subscription}/early-payment-link` | Generate early renewal payment link |
| `PUT` | `/orders/{order}/subscriptions/{subscription}/reactivate` | Reactivate canceled subscription |
| `PUT` | `/orders/{order}/subscriptions/{subscription}/pause` | Pause subscription billing |
| `PUT` | `/orders/{order}/subscriptions/{subscription}/resume` | Resume paused subscription |
| `GET` | `/customer-profile/subscriptions` | Customer portal: List subscriptions |
| `GET` | `/customer-profile/subscriptions/{subscription_uuid}` | Customer portal: Get subscription details |
| `GET` | `/customer-profile/subscriptions/{subscription_uuid}/setup-intent-attempts` | Setup intent attempts |
| `POST` | `/customer-profile/subscriptions/{subscription_uuid}/update-payment-method` | Update card/payment method |
| `POST` | `/customer-profile/subscriptions/{subscription_uuid}/get-or-create-plan` | Get/create upgrade plan |
| `POST` | `/customer-profile/subscriptions/{subscription_uuid}/switch-payment-method` | Switch payment gateway |
| `POST` | `/customer-profile/subscriptions/{subscription_uuid}/confirm-subscription-switch` | Confirm plan upgrade/downgrade |
| `POST` | `/customer-profile/subscriptions/{subscription_uuid}/cancel-auto-renew` | Toggle auto-renew off |
| `POST` | `/customer-profile/subscriptions/{subscription_uuid}/initiate-early-payment` | Pay renewal early |

---

## 6. Licensing API (Pro)

Software license key generation, activation limits, domain tracking, and remote validation API.

### Admin & Internal API (`/wp-json/fluent-cart/v2/...`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/licensing/licenses` | List all licenses |
| `GET` | `/licensing/licenses/customer/{id}` | Get customer licenses |
| `GET` | `/licensing/licenses/{id}` | Get license details |
| `POST` | `/licensing/licenses/{id}/regenerate-key` | Regenerate license key |
| `POST` | `/licensing/licenses/{id}/extend-validity` | Extend license expiry |
| `POST` | `/licensing/licenses/{id}/update_status` | Change license status (`active`, `disabled`, `revoked`) |
| `POST` | `/licensing/licenses/{id}/update_limit` | Update max activation limit |
| `POST` | `/licensing/licenses/{id}/deactivate_site` | Deactivate domain activation |
| `POST` | `/licensing/licenses/{id}/activate_site` | Manually activate domain |
| `DELETE` | `/licensing/licenses/{id}/delete` | Delete license |
| `GET` | `/licensing/products/{id}/settings` | Get product licensing settings |
| `POST` | `/licensing/products/{id}/settings` | Save product licensing settings |
| `GET` | `/customer-profile/licenses/` | Customer portal: List license keys |
| `GET` | `/customer-profile/licenses/{license_key}` | Customer portal: License details |
| `GET` | `/customer-profile/licenses/{license_key}/activations` | Customer portal: Active domains |
| `POST` | `/customer-profile/licenses/{license_key}/deactivate_site` | Customer portal: Deactivate domain |

### Remote Public License Validation API (for software updates / plugin licensing)

Base Endpoint: `https://your-site.com/` (Public, query-based)

| Method | Query / Parameter | Action |
|--------|-------------------|--------|
| `GET`/`POST` | `?fluent-cart=check_license` | Validate license key & domain status |
| `POST` | `?fluent-cart=activate_license` | Activate license on client domain |
| `POST` | `?fluent-cart=deactivate_license` | Deactivate license on client domain |
| `GET`/`POST` | `?fluent-cart=get_license_version` | Check latest version info for auto-updater |
| `GET` | `?fluent-cart=download_license_package` | Secure download URL for update package |

---

## 7. Checkout API

Public checkout flow endpoints for placing orders, calculating checkout summaries, and user authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/checkout/place-order` | Process checkout form & place order |
| `GET` | `/checkout/get-order-info` | Get order summary post-checkout |
| `GET` | `/checkout/get-checkout-summary-view` | Get cart totals breakdown for checkout view |
| `GET` | `/checkout/get-available-shipping-methods` | Calculate available shipping methods for cart |
| `GET` | `/checkout/get-shipping-methods-list-view` | Get formatted shipping methods list |
| `GET` | `/checkout/get-country-info` | Get states/provinces for country |
| `POST` | `/user/login` | Authenticate user during checkout |

---

## 8. Shipping API

Shipping zone definitions, rate methods, state/country mappings, and shipping classes.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/shipping/zones` | List Shipping Zones |
| `POST` | `/shipping/zones` | Create Shipping Zone |
| `GET` | `/shipping/zones/{id}` | Get Shipping Zone |
| `PUT` | `/shipping/zones/{id}` | Update Shipping Zone |
| `DELETE` | `/shipping/zones/{id}` | Delete Shipping Zone |
| `POST` | `/shipping/zones/update-order` | Reorder shipping zones |
| `GET` | `/shipping/zone/states` | Get available states for zone |
| `POST` | `/shipping/methods` | Create Shipping Method inside zone |
| `PUT` | `/shipping/methods` | Update Shipping Method |
| `DELETE` | `/shipping/methods/{method_id}` | Delete Shipping Method |
| `GET` | `/shipping/classes` | List Shipping Classes |
| `POST` | `/shipping/classes` | Create Shipping Class |
| `GET` | `/shipping/classes/{id}` | Get Shipping Class |
| `PUT` | `/shipping/classes/{id}` | Update Shipping Class |
| `DELETE` | `/shipping/classes/{id}` | Delete Shipping Class |

---

## 9. Tax API

Tax classes, rate rules, EU VAT validation, and OSS cross-border rate management.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/taxes` | List tax filing records |
| `POST` | `/taxes` | File tax records |
| `GET` | `/tax/classes` | List Tax Classes |
| `POST` | `/tax/classes` | Create Tax Class |
| `DELETE` | `/tax/classes/{id}` | Delete Tax Class |
| `GET` | `/tax/rates` | List Tax Rates |
| `GET` | `/tax/rates/country/rates/{country_code}` | Get country tax rates |
| `POST` | `/tax/country-status/{country_code}` | Toggle tax status for country |
| `POST` | `/tax/country/rate` | Add tax rate |
| `PUT` | `/tax/country/rate/{id}` | Update tax rate |
| `DELETE` | `/tax/country/rate/{id}` | Delete tax rate |
| `POST` | `/tax/rates/country/override` | Set country tax override |
| `DELETE` | `/tax/rates/country/override/{id}` | Delete country tax override |
| `GET` | `/tax/product-overrides/{country_code}` | Get product-specific tax overrides |
| `POST` | `/tax/product-overrides` | Save product tax override |
| `DELETE` | `/tax/product-overrides/{id}` | Delete product tax override |
| `GET` | `/tax/country-tax-id/{country_code}` | Get country Tax ID configuration |
| `POST` | `/tax/country-tax-id/{country_code}` | Save country Tax ID configuration |
| `GET` | `/tax/configuration/rates` | Get pre-configured tax rates |
| `POST` | `/tax/configuration/countries` | Save active tax countries |
| `GET` | `/tax/configuration/settings` | Get global tax settings |
| `POST` | `/tax/configuration/settings` | Save global tax settings |
| `POST` | `/tax/configuration/settings/eu-vat` | Save EU VAT cross-border settings |
| `POST` | `/tax/configuration/settings/eu-vat/reset-rates` | Reset standard EU VAT rates |
| `GET` | `/tax/configuration/settings/eu-vat/product-overrides` | Get EU VAT product overrides |
| `GET` | `/tax/configuration/settings/eu-vat/oss-rates` | Get OSS country rates |
| `POST` | `/tax/configuration/settings/eu-vat/oss-rates` | Save OSS country rates |

---

## 10. Settings API

Store configuration, payment gateway setup, storage drivers, modules, and checkout fields.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/settings/store` | Get General Store Settings |
| `POST` | `/settings/store` | Save General Store Settings |
| `GET` | `/settings/payment-methods` | List enabled payment gateways |
| `POST` | `/settings/payment-methods` | Save payment method settings |
| `GET` | `/settings/payment-methods/all` | List all available payment gateways |
| `POST` | `/settings/payment-methods/reorder` | Reorder checkout payment methods |
| `GET` | `/settings/payment-methods/connect/info` | Get gateway connection status |
| `POST` | `/settings/payment-methods/disconnect` | Disconnect payment gateway |
| `POST` | `/settings/payment-methods/design` | Save payment gateway button design |
| `POST` | `/settings/payment-methods/install-addon` | Install payment gateway addon |
| `POST` | `/settings/payment-methods/activate-addon` | Activate payment gateway addon |
| `POST` | `/settings/payment-methods/paypal/seller-auth-token` | Exchange PayPal seller token |
| `POST` | `/settings/payment-methods/paypal/webhook/setup` | Auto-configure PayPal webhooks |
| `GET` | `/settings/payment-methods/paypal/webhook/check` | Verify PayPal webhook connection |
| `GET` | `/settings/permissions` | Get capability & permission rules |
| `POST` | `/settings/permissions` | Save capability & permission rules |
| `GET` | `/settings/modules` | List active FluentCart modules |
| `POST` | `/settings/modules` | Save module settings |
| `GET` | `/settings/modules/plugin-addons` | List available plugin addons |
| `POST` | `/settings/modules/plugin-addons/install` | Install plugin addon |
| `POST` | `/settings/modules/plugin-addons/activate` | Activate plugin addon |
| `POST` | `/settings/confirmation` | Save order confirmation page settings |
| `GET` | `/settings/confirmation/shortcode` | Get confirmation page shortcodes |
| `GET` | `/settings/storage-drivers` | List file storage drivers (Local, S3, DigitalOcean, Cloudflare R2) |
| `POST` | `/settings/storage-drivers` | Save storage driver configuration |
| `GET` | `/settings/storage-drivers/active-drivers` | Get list of connected active storage drivers |
| `GET` | `/settings/storage-drivers/{driver}` | Get specific storage driver settings |
| `POST` | `/settings/storage-drivers/verify-info` | Verify S3/R2 storage connection credentials |
| `GET` | `/checkout-fields/get-fields` | Get custom checkout field builder layout |
| `POST` | `/checkout-fields/save-fields` | Save custom checkout fields |

---

## 11. Dashboard & Reports API

Analytics, dashboard summary widgets, retention cohorts, revenue charts, and audit trail logs.

### Dashboard & Utilities

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/dashboard` | Get dashboard overview data |
| `GET` | `/dashboard/stats` | Get quick stats cards |
| `GET` | `/onboarding` | Get onboarding checklist status |
| `POST` | `/onboarding` | Save onboarding settings |
| `POST` | `/onboarding/create-pages` | Auto-create required store pages |
| `POST` | `/onboarding/create-page` | Auto-create single store page |
| `GET` | `/app/init` | Bootstrap administrative frontend app data |
| `GET` | `/app/attachments` | List uploaded admin attachments |
| `POST` | `/app/upload-attachments` | Upload admin attachment file |
| `GET` | `/activity` | List Activity Log entries |
| `DELETE` | `/activity/{id}` | Delete activity log entry |
| `PUT` | `/activity/{id}/mark-read` | Mark activity log entry as read |
| `POST` | `/notes/attach` | Add internal note to order or customer |
| `GET` | `/templates/print-templates` | Get invoice/receipt print templates |
| `PUT` | `/templates/print-templates` | Save invoice/receipt print templates |
| `GET` | `/widgets` | Get dashboard widgets configuration |
| `GET` | `/address-info/countries` | List all supported countries & states |
| `GET` | `/address-info/get-country-info` | Get details for single country |
| `GET` | `/advance_filter/get-filter-options` | Get advanced search filter options |
| `GET` | `/forms/search_options` | Get search options |

### Analytics & Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/reports/overview` | Overall sales summary report |
| `GET` | `/reports/quick-order-stats` | Quick order counts & revenue |
| `GET` | `/reports/sales-growth` | Period-over-period sales growth |
| `GET` | `/reports/revenue` | Detailed revenue breakdown |
| `GET` | `/reports/revenue-by-group` | Revenue grouped by product/country/date |
| `GET` | `/reports/order-value-distribution` | Average Order Value (AOV) breakdown |
| `GET` | `/reports/fetch-new-vs-returning-customer` | New vs returning customer ratio |
| `GET` | `/reports/fetch-order-by-group` | Orders grouped by date/status |
| `GET` | `/reports/fetch-report-by-day-and-hour` | Sales by day of week & hour of day |
| `GET` | `/reports/item-count-distribution` | Items per order distribution |
| `GET` | `/reports/order-completion-time` | Order processing time analytics |
| `GET` | `/reports/order-chart` | Timeseries order chart data |
| `GET` | `/reports/sales-report` | Complete sales report data |
| `GET` | `/reports/fetch-top-sold-products` | Top selling products list |
| `GET` | `/reports/fetch-top-sold-variants` | Top selling variations list |
| `GET` | `/reports/refund-chart` | Refund metrics & timeseries chart |
| `GET` | `/reports/weeks-between-refund` | Time elapsed before refund requests |
| `GET` | `/reports/refund-data-by-group` | Refund reason & grouping analytics |
| `GET` | `/reports/license-chart` | Software license activation trends |
| `GET` | `/reports/license-pie-chart` | Active vs expired license distribution |
| `GET` | `/reports/license-summary` | License summary metrics |
| `GET` | `/reports/country-heat-map` | Geographic sales heat map data |
| `GET` | `/reports/subscription-chart` | Subscription MRR/ARR growth chart |
| `GET` | `/reports/daily-signups` | Daily subscription signups |
| `GET` | `/reports/retention-chart` | Subscription retention & churn rate |
| `GET` | `/reports/future-renewals` | Projected upcoming subscription renewals |
| `GET` | `/reports/subscription-retention` | Detailed retention rate metrics |
| `GET` | `/reports/subscription-cohorts` | Monthly cohort retention matrix |
| `POST` | `/reports/retention-snapshots/generate` | Trigger manual retention snapshot calculation |
| `GET` | `/reports/retention-snapshots/status` | Check retention snapshot progress |
| `GET` | `/reports/product-report` | Product performance analytics |
| `GET` | `/reports/customer-report` | Customer purchase behavior analytics |
| `GET` | `/reports/sources` | Order referral sources & UTM tracking analytics |

---

## 12. Management & Additional Modules

### Roles & Permissions
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/roles/managers` | List users with store manager access |
| `GET` | `/roles/user-list` | Search WordPress users to assign roles |
| `GET` | `/roles` | List custom FluentCart roles |
| `POST` | `/roles` | Assign custom role to user |
| `GET` | `/roles/{key}` | Get single role permissions |
| `POST` | `/roles/{key}` | Update role permissions |
| `DELETE` | `/roles/{key}` | Remove role assignment |

### Email Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/email-notification` | List email notification templates |
| `GET` | `/email-notification/{notification}` | Get single notification template |
| `PUT` | `/email-notification/{notification}` | Update notification template |
| `POST` | `/email-notification/enable-notification/{name}` | Enable/Disable email notification |
| `GET` | `/email-notification/get-short-codes` | Get available email shortcodes |
| `GET` | `/email-notification/get-settings` | Get email sender settings |
| `POST` | `/email-notification/save-settings` | Save email sender settings |
| `GET` | `/email-notification/reminders` | Get subscription/cart reminder schedule |
| `POST` | `/email-notification/reminders` | Save reminder schedule |
| `POST` | `/email-notification/preview` | Render email preview |
| `POST` | `/email-notification/preview-default-template` | Render default template preview |

### Files Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/files` | List uploaded store files |
| `POST` | `/files/upload` | Upload digital product file |
| `GET` | `/files/bucket-list` | List S3/R2 storage buckets |
| `DELETE` | `/files/delete` | Delete file from storage |
| `POST` | `/upload-editor-file` | Upload image for description editor |

### Third-Party Integrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/integration/addons` | List installed CRM/LMS integrations (FluentCRM, LearnDash, etc.) |
| `GET` | `/integration/global-settings` | Get integration global configuration |
| `POST` | `/integration/global-settings` | Save integration global configuration |
| `POST` | `/integration/feed/install-plugin` | Auto-install integration plugin addon |
| `GET` | `/integration/global-feeds` | List global integration automation feeds |
| `GET` | `/integration/global-feeds/settings` | Get feed settings |
| `POST` | `/integration/global-feeds/settings` | Create/update feed settings |
| `POST` | `/integration/global-feeds/change-status/{id}` | Enable/disable integration feed |
| `DELETE` | `/integration/global-feeds/{id}` | Delete integration feed |
| `GET` | `/integration/feed/lists` | Get lists/tags from connected CRM |
| `GET` | `/integration/feed/dynamic_options` | Get dynamic options for feed mapping |
| `POST` | `/integration/feed/chained` | Handle chained dynamic option dependencies |

### Labels & Attributes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/labels` | List store labels/tags |
| `POST` | `/labels` | Create new label |
| `POST` | `/labels/update-label-selections` | Assign/detach labels from object |
| `GET` | `/options/attr/groups` | List attribute groups (Color, Size, etc.) |
| `POST` | `/options/attr/group` | Create attribute group |
| `GET` | `/options/attr/group/{id}` | Get attribute group |
| `PUT` | `/options/attr/group/{id}` | Update attribute group |
| `DELETE` | `/options/attr/group/{id}` | Delete attribute group |
| `GET` | `/options/attr/group/{id}/terms` | List terms within attribute group |
| `POST` | `/options/attr/group/{id}/term` | Create attribute term |
| `POST` | `/options/attr/group/{id}/term/{term_id}` | Update attribute term |
| `DELETE` | `/options/attr/group/{id}/term/{term_id}` | Delete attribute term |
| `POST` | `/options/attr/group/{id}/term/{term_id}/serial` | Reorder attribute terms |

### Order Bumps (Pro)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/order_bump` | List Order Bump offers |
| `POST` | `/order_bump` | Create Order Bump offer |
| `GET` | `/order_bump/{id}` | Get Order Bump offer |
| `PUT` | `/order_bump/{id}` | Update Order Bump offer |
| `DELETE` | `/order_bump/{id}` | Delete Order Bump offer |

### Public Catalog API (Unauthenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/public/products` | List public catalog products |
| `GET` | `/public/product-views` | Get product HTML card view components |
| `GET` | `/public/product-search` | Public product search endpoint |

### Customer Portal API (`/customer-profile/`)
For logged-in customers managing their account on storefront.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/customer-profile/` | Get customer profile dashboard overview |
| `GET` | `/customer-profile/profile` | Get customer account details |
| `POST` | `/customer-profile/update` | Update first name, last name, phone |
| `POST` | `/customer-profile/create-address` | Add new billing/shipping address |
| `POST` | `/customer-profile/edit-address` | Edit address |
| `POST` | `/customer-profile/make-primary-address` | Set primary address |
| `POST` | `/customer-profile/delete-address` | Delete address |
| `GET` | `/customer-profile/orders` | Customer order history (paginated) |
| `GET` | `/customer-profile/orders/{order_uuid}` | Single order view & invoice |
| `GET` | `/customer-profile/orders/{order_uuid}/upgrade-paths` | Available subscription upgrades |
| `GET` | `/customer-profile/orders/{transaction_uuid}/billing-address` | Get billing address for transaction |
| `PUT` | `/customer-profile/orders/{transaction_uuid}/billing-address` | Update billing address for transaction |
| `GET` | `/customer-profile/downloads` | List digital product file downloads |
