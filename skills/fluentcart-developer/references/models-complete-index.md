<!--
Source:    https://dev.fluentcart.com/database/models
Retrieved: 2026-10-30
Generated: scripts/gen-models.mjs — do not edit by hand; re-run the generator
-->

# FluentCart Model Index (complete)

All **41 Eloquent models** the developer docs publish — 521 attributes across them — with each model's table, class, source file, traits, relationships and columns.

22 of these have a full write-up in [database-models-reference.md](database-models-reference.md) (casts, mutators, scopes, query patterns); the entry below links to it. The rest are documented here and nowhere else in the skill — open the source file named on the entry for behaviour.

> Prefix: every table is `{wp_db_prefix}_fct_*`, so on a default install `wp_fct_orders`, etc.
> Amounts are integer minor units (cents). `Helper::toDecimal($amount)` converts for display.

## `Activity`

[source](https://dev.fluentcart.com/database/models/activity.html) · `\FluentCart\App\Models\Activity` · `{wp_db_prefix}_fct_activity` · `fluent-cart/app/Models/Activity.php`

**Traits:** `CanSearch`

**Attributes:**

- `id` *(Integer)* — Primary Key (guarded)
- `status` *(String)* — Activity status (success, warning, failed, info)
- `log_type` *(String)* — Log type (activity, api, etc.)
- `module_id` *(Integer)* — Module ID (cast to integer)
- `module_type` *(String)* — Module type (full model path)
- `module_name` *(String)* — Module name (order, product, user, etc.)
- `title` *(String)* — Activity title
- `content` *(Text)* — Activity content
- `user_id` *(Integer)* — User ID
- `read_status` *(String)* — Read status (read, unread)
- `created_by` *(String)* — Created by (FCT-BOT, username)
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `Reaching activities from the owning model`, `user`

## `AppliedCoupon`

[source](https://dev.fluentcart.com/database/models/applied-coupon.html) · `\FluentCart\App\Models\AppliedCoupon` · `{wp_db_prefix}_fct_applied_coupons` · `fluent-cart/app/Models/AppliedCoupon.php`

**Attributes:**

- `id` *(Integer)* — Primary Key (guarded)
- `order_id` *(Integer)* — Reference to order
- `coupon_id` *(Integer)* — Reference to coupon
- `code` *(String)* — Coupon code
- `amount` *(Decimal)* — Discount amount applied (in cents)

**Relationships:** `order`, `coupon`

## `AttributeGroup`

[Full write-up](database-models-reference.md) · `\FluentCart\App\Models\AttributeGroup` · `{wp_db_prefix}_fct_atts_groups` · `fluent-cart/app/Models/AttributeGroup.php`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `title` *(String)* — Attribute group title (e.g., Color, Size)
- `slug` *(String)* — Attribute group slug
- `description` *(Text)* — Attribute group description
- `settings` *(JSON)* — Attribute group settings
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `terms`, `usedTerms`

## `AttributeRelation`

[Full write-up](database-models-reference.md) · `\FluentCart\App\Models\AttributeRelation` · `{wp_db_prefix}_fct_atts_relations` · `fluent-cart/app/Models/AttributeRelation.php`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `group_id` *(Integer)* — Reference to attribute group
- `term_id` *(Integer)* — Reference to attribute term
- `object_id` *(Integer)* — Reference to product detail (variation)
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `group`, `term`, `productDetails`

## `AttributeTerm`

[Full write-up](database-models-reference.md) · `\FluentCart\App\Models\AttributeTerm` · `{wp_db_prefix}_fct_atts_terms` · `fluent-cart/app/Models/AttributeTerm.php`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `group_id` *(Integer)* — Reference to attribute group
- `serial` *(Integer)* — Serial number for ordering
- `title` *(String)* — Attribute term title (e.g., Red, Small, Large)
- `slug` *(String)* — Attribute term slug
- `description` *(Text)* — Attribute term description
- `settings` *(JSON)* — Attribute term settings
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `group`

## `Cart`

[source](https://dev.fluentcart.com/database/models/cart.html) · `\FluentCart\App\Models\Cart` · `{wp_db_prefix}_fct_carts` · `fluent-cart/app/Models/Cart.php`

**Attributes:**

- `cart_hash` *(String)* — Primary Key (non-incrementing) - Unique cart hash, auto-generated on creation
- `customer_id` *(Integer)* — Customer ID (nullable, hidden)
- `user_id` *(Integer)* — WordPress user ID (nullable, hidden)
- `order_id` *(Integer)* — Associated order ID (nullable, hidden)
- `checkout_data` *(JSON)* — Checkout data (auto JSON encoded/decoded via accessor/mutator)
- `cart_data` *(JSON)* — Cart items data (auto JSON encoded/decoded via accessor/mutator, loads bundle children on read)
- `utm_data` *(JSON)* — UTM tracking data (auto JSON encoded/decoded via accessor/mutator)
- `coupons` *(JSON)* — Applied coupon codes (auto JSON encoded/decoded via accessor/mutator)
- `first_name` *(String)* — Customer first name
- `last_name` *(String)* — Customer last name
- `email` *(String)* — Customer email
- `stage` *(String)* — Cart stage (e.g. completed )
- `cart_group` *(String)* — Cart group identifier
- `user_agent` *(Text)* — User agent string
- `ip_address` *(String)* — Customer IP address
- `completed_at` *(Date Time)* — Completion timestamp
- `deleted_at` *(Date Time)* — Soft delete timestamp
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `customer`, `order`

## `Coupon`

[source](https://dev.fluentcart.com/database/models/coupon.html) · `\FluentCart\App\Models\Coupon` · `{wp_db_prefix}_fct_coupons` · `fluent-cart/app/Models/Coupon.php`

**Traits:** `CanSearch`, `HasActivity`

**Attributes:**

- `id` *(Integer (BIGINT UNSIGNED))* — Primary Key, auto-increment

**Relationships:** `appliedCoupons`, `orders`, `activities`

## `Customer`

[source](https://dev.fluentcart.com/database/models/customer.html) · `\FluentCart\App\Models\Customer` · `{wp_db_prefix}_fct_customers` · `fluent-cart/app/Models/Customer.php`

**Traits:** `CanSearch`, `CanUpdateBatch`

**Attributes:**

- `id` *(Integer (BIGINT UNSIGNED))* — Primary Key, Auto Increment
- `user_id` *(Integer (BIGINT UNSIGNED))* — WordPress user ID (nullable)
- `contact_id` *(Integer (BIGINT UNSIGNED))* — Contact ID (default 0)
- `email` *(String (VARCHAR 192))* — Customer email address
- `first_name` *(String (VARCHAR 192))* — Customer first name
- `last_name` *(String (VARCHAR 192))* — Customer last name
- `status` *(String (VARCHAR 45))* — Customer status (default: 'active')
- `purchase_value` *(JSON)* — Purchase value data (stored/retrieved as JSON)
- `purchase_count` *(Integer (BIGINT UNSIGNED))* — Number of purchases (default 0)
- `ltv` *(Integer (BIGINT))* — Lifetime value in cents (default 0)
- `first_purchase_date` *(Date Time)* — First purchase date (nullable)
- `last_purchase_date` *(Date Time)* — Last purchase date (nullable)
- `aov` *(Decimal (18,2))* — Average order value (nullable)
- `notes` *(Text (LONGTEXT))* — Customer notes
- `uuid` *(String (VARCHAR 100))* — Unique identifier (auto-generated on creation)
- `country` *(String (VARCHAR 45))* — Customer country code (nullable)
- `city` *(String (VARCHAR 45))* — Customer city (nullable)
- `state` *(String (VARCHAR 45))* — Customer state (nullable)
- `postcode` *(String (VARCHAR 45))* — Customer postcode (nullable)
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `orders`, `success_order_items`, `subscriptions`, `shipping_address`, `billing_address`, `primary_shipping_address`, `primary_billing_address`, `labels`, `wpUser`

## `CustomerAddresses`

[source](https://dev.fluentcart.com/database/models/customer-addresses.html) · `\FluentCart\App\Models\CustomerAddresses` · `{wp_db_prefix}_fct_customer_addresses` · `fluent-cart/app/Models/CustomerAddresses.php`

**Traits:** `CanSearch`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `customer_id` *(Integer)* — Reference to customer
- `is_primary` *(Boolean)* — Whether this is the primary address
- `type` *(String)* — Address type (billing, shipping, etc.)
- `status` *(String)* — Address status (active, archived)
- `label` *(String)* — Address label/name
- `name` *(String)* — Full name
- `address_1` *(String)* — Primary address line
- `address_2` *(String)* — Secondary address line
- `city` *(String)* — City
- `state` *(String)* — State/Province
- `postcode` *(String)* — Postal/ZIP code
- `country` *(String)* — Country code
- `phone` *(String)* — Phone number
- `email` *(String)* — Email address
- `meta` *(JSON NULL)* — Stored as JSON string, auto-encoded/decoded via mutator/accessor
- `company_name` *(Virtual)* — Stored inside meta->other_data.company_name , accessible as a virtual attribute via mutator/accessor
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `customer`

## `CustomerMeta`

[source](https://dev.fluentcart.com/database/models/customer-meta.html) · `\FluentCart\App\Models\CustomerMeta` · `{wp_db_prefix}_fct_customer_meta` · `fluent-cart/app/Models/CustomerMeta.php`

**Attributes:**

- `id` *(Integer)* — Primary Key (guarded)
- `customer_id` *(Integer)* — Reference to customer
- `meta_key` *(String)* — Meta key name
- `meta_value` *(Text)* — Meta value (JSON encoded for arrays/objects, auto-encoded/decoded via mutator/accessor)
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `customer`

## `Label`

[Full write-up](database-models-reference.md) · `\FluentCart\App\Models\Label` · `{wp_db_prefix}_fct_label` · `fluent-cart/app/Models/Label.php`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `value` *(Mixed)* — Label value (serialized)
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

## `LabelRelationship`

[Full write-up](database-models-reference.md) · `\FluentCart\App\Models\LabelRelationship` · `{wp_db_prefix}_fct_label_relationships` · `fluent-cart/app/Models/LabelRelationship.php`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `label_id` *(Integer)* — Reference to label
- `labelable_id` *(Integer)* — ID of the labeled object
- `labelable_type` *(String)* — Type of the labeled object (Order, Customer, etc.)
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `labelable`

## `License`

[Full write-up](database-models-reference.md) · `\FluentCartPro\App\Modules\Licensing\Models\License` · `{wp_db_prefix}_fct_licenses` · `fluent-cart-pro/app/Modules/Licensing/Models/License.php`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `status` *(String)* — License status (active, inactive, expired, disabled)
- `limit` *(Integer)* — Activation limit (0 = unlimited)
- `activation_count` *(Integer)* — Current activation count
- `license_key` *(String)* — Unique license key
- `product_id` *(Integer)* — Reference to product
- `variation_id` *(Integer)* — Reference to product variation
- `order_id` *(Integer)* — Reference to order
- `parent_id` *(Integer)* — Parent license ID (for renewals)
- `customer_id` *(Integer)* — Reference to customer
- `expiration_date` *(Date Time)* — License expiration date (null = lifetime)
- `last_reminder_sent` *(Date Time)* — Last reminder sent date
- `last_reminder_type` *(String)* — Last reminder type
- `subscription_id` *(Integer)* — Reference to subscription
- `config` *(JSON)* — License configuration (auto-cast via accessor/mutator)
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `customer`, `order`, `product`, `variation`, `productVariant`, `subscription`, `activations`, `labels`

## `LicenseActivation`

[Full write-up](database-models-reference.md) · `\FluentCartPro\App\Modules\Licensing\Models\LicenseActivation` · `{wp_db_prefix}_fct_license_activations` · `fluent-cart-pro/app/Modules/Licensing/Models/LicenseActivation.php`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `site_id` *(Integer)* — Foreign key to license sites
- `license_id` *(Integer)* — Foreign key to licenses
- `status` *(String)* — Activation status
- `is_local` *(Boolean)* — Whether this is a local activation
- `product_id` *(Integer)* — Associated product ID
- `last_update_date` *(DateTime)* — Last update timestamp
- `last_update_version` *(String)* — Last update version
- `variation_id` *(Integer)* — Product variation ID
- `activation_method` *(String)* — Method used for activation
- `activation_hash` *(String)* — Unique activation hash
- `created_at` *(DateTime)* — Creation timestamp
- `updated_at` *(DateTime)* — Last update timestamp

**Relationships:** `license`, `site`

## `LicenseMeta`

[Full write-up](database-models-reference.md) · `\FluentCartPro\App\Modules\Licensing\Models\LicenseMeta` · `{wp_db_prefix}_fct_license_meta` · `fluent-cart-pro/app/Modules/Licensing/Models/LicenseMeta.php`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `object_id` *(Integer)* — Reference to the parent object (e.g., license ID)
- `object_type` *(String)* — Type of the parent object
- `meta_key` *(String)* — Meta key name
- `meta_value` *(Text)* — Meta value (auto JSON encode/decode via accessor/mutator)
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

## `LicenseSite`

[Full write-up](database-models-reference.md) · `\FluentCartPro\App\Modules\Licensing\Models\LicenseSite` · `{wp_db_prefix}_fct_license_sites` · `fluent-cart-pro/app/Modules/Licensing/Models/LicenseSite.php`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `site_url` *(String)* — Site URL
- `server_version` *(String)* — Server version
- `platform_version` *(String)* — Platform version
- `other` *(JSON)* — Additional site information (auto JSON encode/decode via accessor/mutator)
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `activations`

## `Order`

[Full write-up](database-models-reference.md) · `\FluentCart\App\Models\Order` · `{wp_db_prefix}_fct_orders` · `fluent-cart/app/Models/Order.php`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `status` *(String)* — Order status (draft, pending, processing, completed, etc.)
- `parent_id` *(Integer)* — Parent order ID (for renewals/child orders)
- `receipt_number` *(Integer)* — Receipt number
- `invoice_no` *(String)* — Invoice number
- `fulfillment_type` *(String)* — Fulfillment type (physical, digital)
- `type` *(String)* — Order type (subscription, renewal, etc.)
- `mode` *(String)* — Order mode (live, test)
- `shipping_status` *(String)* — Shipping status
- `customer_id` *(Integer)* — Customer ID (cast to integer)
- `payment_method` *(String)* — Payment method
- `payment_status` *(String)* — Payment status
- `payment_method_title` *(String)* — Payment method title
- `currency` *(String)* — Currency code
- `fee_total` *(Double)* — Surcharges on the order, in cents (cast to double)
- `rate` *(Decimal)* — DECIMAL(24,12) base-to-presentment exchange rate, frozen at order time
- `tax_behavior` *(Integer)* — Cast to integer
- `subtotal` *(Integer)* — Subtotal in cents (cast to double)
- `discount_tax` *(Integer)* — Discount tax in cents (cast to double)
- `manual_discount_total` *(Integer)* — Manual discount total in cents (cast to double)
- `coupon_discount_total` *(Integer)* — Coupon discount total in cents (cast to double)
- `shipping_tax` *(Integer)* — Shipping tax in cents (cast to double)
- `shipping_total` *(Integer)* — Shipping total in cents (cast to double)
- `tax_total` *(Integer)* — Tax total in cents (cast to double)
- `total_amount` *(Integer)* — Total amount in cents (cast to double)
- `total_paid` *(Integer)* — Total paid in cents
- `total_refund` *(Integer)* — Total refund in cents
- `rate` *(Decimal)* — Exchange rate
- `tax_behavior` *(Integer)* — Tax behavior (0=no_tax, 1=exclusive, 2=inclusive)
- `note` *(Text)* — Order notes
- `ip_address` *(Text)* — Customer IP address
- `completed_at` *(Date Time)* — Completion timestamp
- `refunded_at` *(Date Time)* — Refund timestamp
- `uuid` *(String)* — Unique identifier
- `config` *(JSON)* — Order configuration (auto-encoded/decoded via accessor/mutator)
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `parentOrder`, `children`, `transactions`, `subscriptions`, `order_items`, `filteredOrderItems`, `customer`, `orderMeta`, `orderTaxRates`, `appliedCoupons`, `usedCoupons`, `shipping_address`, `billing_address`, `order_addresses`, `licenses`, `labels`, `renewals`, `orderOperation`

## `OrderAddress`

[Full write-up](database-models-reference.md) · `\FluentCart\App\Models\OrderAddress` · `{wp_db_prefix}_fct_order_addresses` · `fluent-cart/app/Models/OrderAddress.php`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `order_id` *(Integer)* — Reference to order
- `type` *(String)* — Address type (billing, shipping)
- `name` *(String)* — Full name
- `address_1` *(String)* — Primary address line
- `address_2` *(String)* — Secondary address line
- `city` *(String)* — City
- `state` *(String)* — State/Province
- `postcode` *(String)* — Postal/ZIP code
- `country` *(String)* — Country code
- `meta` *(JSON NULL)* — Additional address data (stores phone, company_name, label in other_data )
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `order`

## `OrderDownloadPermission`

[source](https://dev.fluentcart.com/database/models/order-download-permission.html) · `\FluentCart\App\Models\OrderDownloadPermission` · `{wp_db_prefix}_fct_order_download_permissions` · `fluent-cart/app/Models/OrderDownloadPermission.php`

**Attributes:**

- `id` *(Integer)* — Primary Key (guarded)
- `order_id` *(Integer)* — Reference to order
- `variation_id` *(Integer)* — Reference to product variation
- `customer_id` *(Integer)* — Reference to customer
- `download_id` *(Integer)* — Reference to download
- `download_count` *(Integer)* — Number of downloads used
- `download_limit` *(Integer)* — Maximum number of downloads allowed
- `access_expires` *(Date Time)* — When download access expires
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `order`, `customer`

## `OrderItem`

[Full write-up](database-models-reference.md) · `\FluentCart\App\Models\OrderItem` · `{wp_db_prefix}_fct_order_items` · `fluent-cart/app/Models/OrderItem.php`

**Traits:** `CanSearch`, `CanUpdateBatch`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `order_id` *(Integer)* — Reference to order
- `post_id` *(Integer)* — WordPress post ID (product)
- `fulfillment_type` *(String)* — Fulfillment type (physical, digital, service)
- `fulfilled_quantity` *(Integer)* — Quantity fulfilled
- `post_title` *(Text)* — Product title
- `title` *(Text)* — Item title (variation)
- `object_id` *(Integer)* — Variation ID
- `cart_index` *(Integer)* — Position in cart
- `quantity` *(Integer)* — Item quantity
- `unit_price` *(Bigint)* — Price per unit in cents
- `cost` *(Bigint)* — Cost in cents
- `subtotal` *(Bigint)* — Line subtotal
- `tax_amount` *(Bigint)* — Tax amount for this line
- `shipping_charge` *(Bigint)* — Shipping charge (not in fillable)
- `discount_total` *(Bigint)* — Discount amount
- `line_total` *(Bigint)* — Total line amount
- `refund_total` *(Bigint)* — Refunded amount
- `rate` *(Bigint)* — Exchange rate
- `other_info` *(JSON)* — Additional item data (auto-encoded/decoded)
- `line_meta` *(JSON)* — Line-specific metadata (auto-encoded/decoded)
- `referrer` *(Text)* — Referral information
- `object_type` *(String)* — Object type
- `payment_type` *(String)* — onetime , subscription , signup_fee , fee or bundle
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `order`, `product`, `variants`, `product_downloads`, `productImage`, `variantImages`

## `OrderMeta`

[Full write-up](database-models-reference.md) · `\FluentCart\App\Models\OrderMeta` · `{wp_db_prefix}_fct_order_meta` · `fluent-cart/app/Models/OrderMeta.php`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `order_id` *(Integer)* — Reference to order
- `meta_key` *(String)* — Meta key name
- `meta_value` *(Text)* — Meta value (JSON or string)
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `order`

## `OrderOperation`

[source](https://dev.fluentcart.com/database/models/order-operation.html) · `\FluentCart\App\Models\OrderOperation` · `{wp_db_prefix}_fct_order_operations` · `fluent-cart/app/Models/OrderOperation.php`

**Attributes:**

- `id` *(Integer)* — Primary Key (guarded)
- `order_id` *(Integer)* — Reference to order
- `created_via` *(String)* — How the order was created
- `emails_sent` *(Boolean)* — TINYINT(1) — whether the order's emails have been sent
- `sales_recorded` *(Boolean)* — Whether the sale has been counted into reports
- `meta` *(JSON)* — Fillable
- `sales_recorded` *(Boolean)* — Whether sales were recorded
- `utm_campaign` *(String)* — UTM campaign parameter
- `utm_term` *(String)* — UTM term parameter
- `utm_source` *(String)* — UTM source parameter
- `utm_content` *(String)* — UTM content parameter
- `utm_medium` *(String)* — UTM medium parameter
- `utm_id` *(String)* — UTM ID parameter
- `cart_hash` *(String)* — Cart hash identifier
- `refer_url` *(String)* — Referral URL
- `meta` *(JSON)* — Additional operation data (has accessor/mutator but not in $fillable)
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `order`

## `OrderPromotion`

[Full write-up](database-models-reference.md) · `\FluentCartPro\App\Modules\Promotional\Models\OrderPromotion` · `{wp_db_prefix}_fct_order_promotions` · `fluent-cart-pro/app/Modules/Promotional/Models/OrderPromotion.php`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `hash` *(String)* — Unique promotion hash (auto-generated on creation)
- `parent_id` *(Integer)* — Parent promotion ID
- `type` *(String)* — Promotion type
- `status` *(String)* — Promotion status
- `src_object_id` *(Integer)* — Source object ID
- `src_object_type` *(String)* — Source object type
- `title` *(String)* — Promotion title
- `description` *(Text)* — Promotion description
- `conditions` *(JSON)* — Promotion conditions (auto JSON encode/decode via accessor/mutator)
- `config` *(JSON)* — Promotion configuration (auto JSON encode/decode via accessor/mutator)
- `priority` *(Integer)* — Promotion priority
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `product_variant`

## `OrderPromotionStat`

[Full write-up](database-models-reference.md) · `\FluentCartPro\App\Modules\Promotional\Models\OrderPromotionStat` · `{wp_db_prefix}_fct_order_promotion_stats` · `fluent-cart-pro/app/Modules/Promotional/Models/OrderPromotionStat.php`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `promotion_id` *(Integer)* — Reference to order promotion
- `order_id` *(Integer)* — Reference to order
- `object_id` *(Integer)* — Reference to object (product, variation, etc.)
- `amount` *(Integer)* — Promotion amount in cents (BIGINT)
- `status` *(String)* — Promotion status; defaults to offered
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `order`, `promotion`

## `OrderTaxRate`

[source](https://dev.fluentcart.com/database/models/order-tax-rate.html) · `\FluentCart\App\Models\OrderTaxRate` · `{wp_db_prefix}_fct_order_tax_rate` · `fluent-cart/app/Models/OrderTaxRate.php`

**Attributes:**

- `id` *(Integer)* — Primary Key (guarded)
- `order_id` *(Integer)* — Reference to order
- `tax_rate_id` *(Integer)* — Reference to tax rate
- `shipping_tax` *(Bigint)* — Shipping tax amount (in cents)
- `order_tax` *(Bigint)* — Order tax amount (in cents)
- `total_tax` *(Bigint)* — Total tax amount (in cents)
- `meta` *(JSON)* — Additional tax data
- `filed_at` *(Date Time)* — Tax filing date
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `order`, `tax_rate`

## `OrderTransaction`

[Full write-up](database-models-reference.md) · `\FluentCart\App\Models\OrderTransaction` · `{wp_db_prefix}_fct_order_transactions` · `fluent-cart/app/Models/OrderTransaction.php`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `order_id` *(Integer)* — Reference to order
- `order_type` *(String)* — Order type — payment , subscription or renewal
- `vendor_charge_id` *(String)* — Payment gateway transaction ID
- `payment_method` *(String)* — Payment method key
- `payment_mode` *(String)* — Payment mode (live, test)
- `payment_method_type` *(String)* — Payment method type (card, bank, etc.)
- `currency` *(String)* — Transaction currency
- `transaction_type` *(String)* — Transaction type — charge , refund , dispute or signup_fee
- `subscription_id` *(Integer)* — Reference to subscription (if applicable)
- `card_last_4` *(String)* — Last 4 digits of card
- `card_brand` *(String)* — Card brand (visa, mastercard, etc.)
- `status` *(String)* — Transaction status
- `total` *(Bigint)* — Transaction amount in cents
- `rate` *(Bigint)* — Exchange rate
- `meta` *(JSON)* — Additional transaction data (stored as JSON, accessed as array via accessor/mutator)
- `uuid` *(String)* — Unique transaction identifier (auto-generated on create)
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `order`, `orders`, `subscription`

## `Product`

[source](https://dev.fluentcart.com/database/models/product.html) · `\FluentCart\App\Models\Product` · `{wp_db_prefix}_posts (WordPress posts table)` · `fluent-cart/app/Models/Product.php`

**Attributes:**

- `ID` *(Integer)* — Primary Key (WordPress post ID)
- `post_author` *(Integer)* — Post author ID
- `post_date` *(Date Time)* — Post creation date
- `post_date_gmt` *(Date Time)* — Post creation date (GMT)
- `post_content` *(Text)* — Post content
- `post_title` *(String)* — Post title
- `post_excerpt` *(Text)* — Post excerpt
- `post_status` *(String)* — Post status (publish, draft, etc.)
- `comment_status` *(String)* — Comment status
- `ping_status` *(String)* — Ping status
- `post_password` *(String)* — Post password (hidden)
- `post_name` *(String)* — Post slug
- `to_ping` *(Text)* — URLs to ping (hidden)
- `pinged` *(Text)* — URLs that have been pinged (hidden)
- `post_modified` *(Date Time)* — Post last modified date
- `post_modified_gmt` *(Date Time)* — Post last modified date (GMT)
- `post_content_filtered` *(Text)* — Filtered post content (hidden)
- `post_parent` *(Integer)* — Parent post ID (hidden)
- `guid` *(String)* — Global unique identifier
- `menu_order` *(Integer)* — Menu order (hidden)
- `post_type` *(String)* — Post type ( fluent-products )
- `post_mime_type` *(String)* — Post MIME type (hidden)
- `comment_count` *(Integer)* — Comment count (hidden)

**Relationships:** `detail`, `variants`, `downloadable_files`, `postmeta`, `wp_terms`, `orderItems`, `wpTerms()`, `categories()`, `tags()`, `thumbUrl`, `licensesMeta`, `integrations`

## `ProductDetail`

[source](https://dev.fluentcart.com/database/models/product-detail.html) · `\FluentCart\App\Models\ProductDetail` · `{wp_db_prefix}_fct_product_details` · `fluent-cart/app/Models/ProductDetail.php`

**Traits:** `CanSearch`, `CanUpdateBatch`

**Attributes:**

- `id` *(Integer)* — Primary Key (guarded)
- `post_id` *(Integer)* — Reference to WordPress post (product). Cast as integer .
- `fulfillment_type` *(String)* — Fulfillment type (physical, digital)
- `min_price` *(Double)* — Minimum price (cents). Cast as double . Dynamically computed from variants via accessor.
- `max_price` *(Double)* — Maximum price (cents). Cast as double . Dynamically computed from variants via accessor.
- `default_variation_id` *(String)* — Default variation ID
- `variation_type` *(String)* — Variation type (simple, variable)
- `stock_availability` *(String)* — Stock availability quantity / status
- `other_info` *(JSON)* — Additional product information (auto JSON encoded/decoded via mutator/accessor)
- `default_media` *(JSON)* — Default media information (auto JSON encoded/decoded via mutator/accessor)
- `manage_stock` *(String)* — Whether to manage stock
- `manage_downloadable` *(String)* — Whether to manage downloadable files
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `product`, `galleryImage`, `variants`

## `ProductDownload`

[source](https://dev.fluentcart.com/database/models/product-download.html) · `\FluentCart\App\Models\ProductDownload` · `{wp_db_prefix}_fct_product_downloads` · `fluent-cart/app/Models/ProductDownload.php`

**Traits:** `CanSearch`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `post_id` *(Integer)* — Reference to WordPress post (product)
- `product_variation_id` *(JSON)* — Product variation IDs (JSON encoded array, auto-encoded/decoded via mutator/accessor)
- `download_identifier` *(String)* — Download identifier
- `title` *(String)* — Download title
- `type` *(String)* — Download type
- `driver` *(String)* — Storage driver
- `file_name` *(String)* — File name
- `file_path` *(String)* — File path
- `file_url` *(String)* — File URL
- `file_size` *(Integer)* — File size in bytes
- `settings` *(JSON)* — Download settings (auto-encoded/decoded via mutator/accessor)
- `serial` *(String)* — Serial number
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `product`, `download_permissions`

## `ProductMeta`

[source](https://dev.fluentcart.com/database/models/product-meta.html) · `\FluentCart\App\Models\ProductMeta` · `{wp_db_prefix}_fct_product_meta` · `fluent-cart/app/Models/ProductMeta.php`

**Attributes:**

- `id` *(Integer)* — Primary Key (guarded)
- `object_id` *(Integer)* — ID of the associated object
- `object_type` *(String)* — Type of object (product, variation, etc.)
- `meta_key` *(String)* — Meta key name
- `meta_value` *(Text)* — Meta value (JSON encoded for arrays/objects, auto-encoded/decoded via mutator/accessor)
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

## `ProductVariation`

[source](https://dev.fluentcart.com/database/models/product-variation.html) · `\FluentCart\App\Models\ProductVariation` · `{wp_db_prefix}_fct_product_variations` · `fluent-cart/app/Models/ProductVariation.php`

**Traits:** `CanSearch`, `CanUpdateBatch`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `post_id` *(Integer)* — Reference to WordPress post (product)
- `media_id` *(Integer)* — Reference to media
- `serial_index` *(Integer)* — Serial index for ordering
- `sold_individually` *(Integer)* — Whether sold individually (0 or 1)
- `variation_title` *(String)* — Variation title
- `variation_identifier` *(String)* — Variation identifier
- `sku` *(String)* — Stock keeping unit
- `manage_stock` *(String)* — Whether to manage stock
- `payment_type` *(String)* — Payment type ( onetime , subscription )
- `stock_status` *(String)* — Stock status
- `backorders` *(Integer)* — Backorder quantity
- `total_stock` *(Integer)* — Total stock quantity
- `available` *(Integer)* — Available quantity
- `committed` *(Integer)* — Committed quantity
- `on_hold` *(Integer)* — On hold quantity
- `fulfillment_type` *(String)* — Fulfillment type ( physical , digital )
- `item_status` *(String)* — Item status ( active , inactive )
- `manage_cost` *(String)* — Whether to manage cost
- `item_price` *(Decimal)* — Item price (stored in cents, cast to double)
- `item_cost` *(Decimal)* — Item cost (stored in cents, cast to double)
- `compare_price` *(Decimal)* — Compare price (stored in cents, cast to double)
- `other_info` *(Array)* — Additional variation information (JSON, cast to array)
- `downloadable` *(String)* — Whether downloadable
- `shipping_class` *(String)* — Shipping class ID
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `attrMap / attrRelations`, `product`, `shippingClass`, `product_detail`, `media`, `product_downloads`, `order_items`, `downloadable_files`, `upgrade_paths`, `attrMap`, `bundleChildren`

## `ScheduledAction`

[source](https://dev.fluentcart.com/database/models/scheduled-action.html) · `\FluentCart\App\Models\ScheduledAction` · `{wp_db_prefix}_fct_scheduled_actions` · `fluent-cart/app/Models/ScheduledAction.php`

**Attributes:**

- `id` *(Integer)* — Primary Key (guarded)
- `scheduled_at` *(Date Time)* — When the action is scheduled to run
- `action` *(String)* — Action to be performed
- `status` *(String)* — Action status. The lifecycle is pending -> processing -> completed -> failed
- `group` *(String)* — Action group
- `object_id` *(Integer)* — ID of the associated object
- `object_type` *(String)* — Type of the associated object
- `completed_at` *(Date Time)* — When the action was completed
- `retry_count` *(Integer)* — Number of retry attempts
- `data` *(JSON)* — Action data and parameters (manual JSON mutator/accessor)
- `response_note` *(Text)* — LONGTEXT — response or error note
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

## `ShippingClass`

[Full write-up](database-models-reference.md) · `\FluentCart\App\Models\ShippingClass` · `{wp_db_prefix}_fct_shipping_classes` · `fluent-cart/app/Models/ShippingClass.php`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `name` *(String)* — Shipping class name
- `description` *(String)* — Shipping class description (max 500 chars)
- `cost` *(Float)* — Surcharge in base-currency major units, not cents (cast to float)
- `type` *(String)* — Shipping class type
- `per_item` *(Boolean)* — Whether cost is per item
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `zones`

## `ShippingMethod`

[Full write-up](database-models-reference.md) · `\FluentCart\App\Models\ShippingMethod` · `{wp_db_prefix}_fct_shipping_methods` · `fluent-cart/app/Models/ShippingMethod.php`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `zone_id` *(Integer)* — Reference to shipping zone
- `title` *(String)* — Shipping method title
- `type` *(String)* — Shipping method type
- `settings` *(Array)* — Shipping method settings (cast to array)
- `amount` *(Decimal)* — Shipping amount
- `is_enabled` *(Boolean)* — Whether method is enabled (cast to boolean)
- `order` *(Integer)* — Display order
- `states` *(Array)* — Applicable states (cast to array, defaults to empty array)
- `meta` *(JSON)* — Additional metadata (manual JSON mutator/accessor)
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `zone`

## `ShippingZone`

[Full write-up](database-models-reference.md) · `\FluentCart\App\Models\ShippingZone` · `{wp_db_prefix}_fct_shipping_zones` · `fluent-cart/app/Models/ShippingZone.php`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `shipping_class_id` *(Integer)* — Scopes the zone to one shipping class; NULL means it applies to class-less items
- `name` *(String)* — Shipping zone name
- `region` *(String)* — A country code, 'all' (Whole World) or 'selection' (multiple countries, listed in meta )
- `meta` *(Array)* — For 'selection' zones: countries and selection_type ( included / excluded )
- `order` *(Integer)* — Display order
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `shippingClass`, `methods`

## `Subscription`

[source](https://dev.fluentcart.com/database/models/subscription.html) · `\FluentCart\App\Models\Subscription` · `{wp_db_prefix}_fct_subscriptions` · `fluent-cart/app/Models/Subscription.php`

**Traits:** `HasActivity`, `CanUpdateBatch`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `uuid` *(String)* — Unique identifier (auto-generated on create via md5(time() . wp_generate_uuid4()) )
- `customer_id` *(Integer)* — Customer ID
- `parent_order_id` *(Integer)* — Parent order ID
- `product_id` *(Integer)* — Product ID
- `item_name` *(String)* — Item name
- `variation_id` *(Integer)* — Product variation ID
- `billing_interval` *(String)* — Billing interval (daily, weekly, monthly, quarterly, half_yearly, yearly)
- `signup_fee` *(Integer)* — Signup fee in cents
- `quantity` *(Integer)* — Quantity
- `recurring_amount` *(Integer)* — Recurring amount in cents
- `recurring_tax_total` *(Integer)* — Recurring tax total in cents
- `initial_tax_total` *(Integer)* — Tax charged on the first payment, in cents
- `recurring_total` *(Integer)* — Recurring total in cents
- `bill_times` *(Integer)* — Number of times to bill (0 = unlimited)
- `bill_count` *(Integer)* — Number of times billed
- `expire_at` *(Date Time)* — Expiration date
- `trial_ends_at` *(Date Time)* — Trial end date
- `canceled_at` *(Date Time)* — Cancellation date
- `restored_at` *(Date Time)* — Restoration date
- `collection_method` *(String)* — Collection method
- `trial_days` *(Integer)* — Trial days
- `vendor_customer_id` *(String)* — Vendor customer ID
- `vendor_plan_id` *(String)* — Vendor plan ID
- `vendor_subscription_id` *(String)* — Vendor subscription ID
- `next_billing_date` *(Date Time)* — Next billing date
- `status` *(String)* — Subscription status
- `original_plan` *(JSON)* — Original plan data
- `vendor_response` *(JSON)* — Vendor response data
- `current_payment_method` *(String)* — Current payment method
- `config` *(JSON)* — Subscription configuration (auto-encoded/decoded)
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `meta`, `customer`, `product`, `variation`, `labels`, `license`, `licenses`, `transactions`, `billing_addresses`, `product_detail`, `order`, `activities (via HasActivity trait)`

## `SubscriptionMeta`

[source](https://dev.fluentcart.com/database/models/subscription-meta.html) · `\FluentCart\App\Models\SubscriptionMeta` · `{wp_db_prefix}_fct_subscription_meta` · `fluent-cart/app/Models/SubscriptionMeta.php`

**Attributes:**

- `id` *(Integer)* — Primary Key
- `subscription_id` *(Integer)* — Reference to subscription
- `meta_key` *(String)* — Meta key name
- `meta_value` *(Text)* — Meta value (JSON encoded for arrays/objects, auto-encoded/decoded via mutator/accessor)
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

**Relationships:** `product_detail`

## `TaxClass`

[Full write-up](database-models-reference.md) · `\FluentCart\App\Models\TaxClass` · `{wp_db_prefix}_fct_tax_classes` · `fluent-cart/app/Models/TaxClass.php`

**Attributes:**

- `id` *(Integer)* — Primary Key (guarded)
- `title` *(String)* — Tax class title
- `description` *(Text)* — Tax class description
- `meta` *(JSON)* — Additional metadata (manual JSON mutator/accessor)
- `slug` *(String)* — URL-friendly slug (auto-generated from title)
- `created_at` *(Date Time)* — Creation timestamp
- `updated_at` *(Date Time)* — Last update timestamp

## `TaxRate`

[Full write-up](database-models-reference.md) · `\FluentCart\App\Models\TaxRate` · `{wp_db_prefix}_fct_tax_rates` · `fluent-cart/app/Models/TaxRate.php`

**Attributes:**

- `id` *(Integer)* — Primary Key (guarded)
- `class_id` *(Integer)* — Reference to tax class
- `country` *(String)* — Country code
- `state` *(String)* — State/Province code
- `postcode` *(String)* — Postal/ZIP code
- `city` *(String)* — City name
- `rate` *(Decimal)* — Tax rate percentage
- `name` *(String)* — Tax rate name
- `group` *(String)* — Tax group
- `priority` *(Integer)* — Priority order
- `is_compound` *(Boolean)* — Whether tax is compound
- `for_shipping` *(Decimal)* — Shipping-tax rate override percentage (NULL = inherit base rate; 0 = no shipping tax)
- `for_order` *(Boolean)* — Whether tax applies to order

**Relationships:** `tax_class`

## `User`

[source](https://dev.fluentcart.com/database/models/user.html) · `\FluentCart\App\Models\User` · `{wp_db_prefix}_users` · `fluent-cart/app/Models/User.php`

**Attributes:**

- `ID` *(Integer)* — Primary Key (WordPress user ID)
- `user_login` *(String)* — User login name
- `user_pass` *(String)* — User password (guarded)
- `user_nicename` *(String)* — User nice name
- `user_email` *(String)* — User email address
- `user_url` *(String)* — User website URL
- `user_registered` *(Date Time)* — User registration date
- `user_activation_key` *(String)* — User activation key
- `user_status` *(Integer)* — User status
- `display_name` *(String)* — User display name

**Relationships:** `customer`

## `UserMeta`

[Full write-up](database-models-reference.md) · `\FluentCartPro\App\Models\UserMeta` · `{wp_db_prefix}_usermeta` · `fluent-cart-pro/app/Models/UserMeta.php`

**Attributes:**

- `umeta_id` *(Integer)* — Primary Key
- `user_id` *(Integer)* — Reference to user
- `meta_key` *(String)* — Meta key name
- `meta_value` *(Text)* — Meta value

**Relationships:** `user`
