# FluentCart Database Schema Reference

> Source: https://dev.fluentcart.com/database/schema.html

Complete reference for all `wp_fct_*` database tables used by FluentCart.

> [!IMPORTANT]
> **Monetary Values Rule:** All monetary fields (`total_amount`, `subtotal`, `tax_total`, `shipping_total`, `recurring_amount`, etc.) are stored as **BIGINT in cents** (smallest currency unit, e.g. `$10.00` = `1000`).
>
> Use `\FluentCart\App\Helpers\Helper::toDecimal($cents)` to convert cents to decimal string for display.
> Use `\FluentCart\App\Helpers\Helper::toCent($decimal)` to convert decimal user input to integer cents.

---

## Key Design Principles

1. **Currency Precision**: All monetary values stored as BIGINT in cents to avoid floating-point precision issues
2. **Flexible Configuration**: JSON columns used for extensible configuration data
3. **Audit Trail**: Comprehensive activity logging for all important operations
4. **Referential Integrity**: Proper foreign key relationships maintained throughout
5. **Performance Optimization**: Strategic indexing on frequently queried columns
6. **Multi-tenancy Ready**: UUID-based public identifiers for external integrations

---

## Core Tables

### `fct_customers`
Stores customer information and purchase history.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| user_id | BIGINT UNSIGNED NULL | WordPress user ID |
| contact_id | BIGINT UNSIGNED NOT NULL DEFAULT '0' | Contact ID |
| email | VARCHAR(192) NOT NULL DEFAULT '' | Customer email |
| first_name | VARCHAR(192) NOT NULL DEFAULT '' | First name |
| last_name | VARCHAR(192) NOT NULL DEFAULT '' | Last name |
| status | VARCHAR(45) NULL DEFAULT 'active' | active, inactive, archived |
| purchase_value | JSON NULL | Purchase value data |
| purchase_count | BIGINT UNSIGNED NOT NULL DEFAULT '0' | Total number of purchases |
| ltv | BIGINT NOT NULL DEFAULT '0' | Lifetime value in cents |
| first_purchase_date | DATETIME NULL | First purchase date |
| last_purchase_date | DATETIME NULL | Last purchase date |
| aov | DECIMAL(18,2) NULL | Average order value |
| notes | LONGTEXT NOT NULL | Customer notes |
| uuid | VARCHAR(100) NULL DEFAULT '' | Unique identifier |
| country | VARCHAR(45) NULL | Country |
| city | VARCHAR(45) NULL | City |
| state | VARCHAR(45) NULL | State |
| postcode | VARCHAR(45) NULL | Postal code |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** email, user_id

---

### `fct_customer_addresses`
Stores customer billing and shipping addresses.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| customer_id | BIGINT UNSIGNED NOT NULL | Reference to customer |
| address_type | VARCHAR(20) NOT NULL DEFAULT 'billing' | billing, shipping |
| is_primary | TINYINT(1) NOT NULL DEFAULT 0 | Primary address flag |
| first_name | VARCHAR(192) NOT NULL DEFAULT '' | First name |
| last_name | VARCHAR(192) NOT NULL DEFAULT '' | Last name |
| email | VARCHAR(192) NOT NULL DEFAULT '' | Email |
| phone | VARCHAR(50) NULL | Phone number |
| company | VARCHAR(192) NULL | Company name |
| address_1 | VARCHAR(255) NULL | Address line 1 |
| address_2 | VARCHAR(255) NULL | Address line 2 |
| city | VARCHAR(100) NULL | City |
| state | VARCHAR(100) NULL | State/Province |
| postcode | VARCHAR(20) NULL | Postal/ZIP code |
| country | VARCHAR(10) NULL | Country code |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** customer_id

---

### `fct_customer_meta`
Stores additional customer metadata as key-value pairs.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| customer_id | BIGINT UNSIGNED NOT NULL | Reference to customer |
| key | VARCHAR(192) NOT NULL | Meta key |
| value | LONGTEXT NULL | Meta value |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** customer_id, key

---

### `fct_orders`
Stores the basic information of an order.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| status | VARCHAR(20) NOT NULL DEFAULT 'draft' | draft / pending / on-hold / processing / completed / failed / refunded / partial-refund |
| parent_id | BIGINT UNSIGNED NULL | Parent order |
| receipt_number | BIGINT UNSIGNED NULL | |
| invoice_no | VARCHAR(192) NULL DEFAULT '' | |
| fulfillment_type | VARCHAR(20) NULL DEFAULT 'physical' | physical, digital, service, mixed |
| type | VARCHAR(20) NOT NULL DEFAULT 'payment' | payment, renewal, refund |
| mode | ENUM('live', 'test') NOT NULL DEFAULT 'live' | live / test |
| shipping_status | VARCHAR(20) NOT NULL DEFAULT '' | unshipped / shipped / delivered / unshippable |
| customer_id | BIGINT UNSIGNED NULL | |
| payment_method | VARCHAR(100) NOT NULL | |
| payment_status | VARCHAR(20) NOT NULL DEFAULT '' | |
| payment_method_title | VARCHAR(100) NOT NULL | |
| currency | VARCHAR(10) NOT NULL | |
| subtotal | BIGINT NOT NULL DEFAULT '0' | Amount in cents |
| discount_tax | BIGINT NOT NULL DEFAULT '0' | Amount in cents |
| manual_discount_total | BIGINT NOT NULL DEFAULT '0' | Amount in cents |
| coupon_discount_total | BIGINT NOT NULL DEFAULT '0' | Amount in cents |
| shipping_tax | BIGINT NOT NULL DEFAULT '0' | Amount in cents |
| shipping_total | BIGINT NOT NULL DEFAULT '0' | Amount in cents |
| tax_total | BIGINT NOT NULL DEFAULT '0' | Amount in cents |
| total_amount | BIGINT NOT NULL DEFAULT '0' | Amount in cents |
| total_paid | BIGINT NOT NULL DEFAULT '0' | Amount in cents |
| total_refund | BIGINT NOT NULL DEFAULT '0' | Amount in cents |
| rate | DECIMAL(12,4) NOT NULL DEFAULT '1.0000' | Exchange rate |
| tax_behavior | TINYINT(1) NOT NULL DEFAULT 0 | 0 => no_tax, 1 => exclusive, 2 => inclusive |
| note | TEXT NOT NULL DEFAULT '' | |
| ip_address | TEXT NOT NULL DEFAULT '' | |
| completed_at | DATETIME NULL DEFAULT NULL | |
| refunded_at | DATETIME NULL DEFAULT NULL | |
| uuid | VARCHAR(100) NOT NULL | |
| config | JSON DEFAULT NULL | |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** invoice_no (191), type, customer_id, created_at + completed_at

---

### `fct_order_items`
Stores individual items within orders.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT(20) UNSIGNED *Auto Increment* | Primary key |
| order_id | BIGINT UNSIGNED NOT NULL DEFAULT '0' | Reference to order |
| post_id | BIGINT UNSIGNED NOT NULL DEFAULT '0' | WordPress post ID (product) |
| fulfillment_type | VARCHAR(20) NOT NULL DEFAULT 'physical' | physical, digital, service |
| payment_type | VARCHAR(20) NOT NULL DEFAULT 'onetime' | onetime, subscription, signup_fee |
| post_title | TEXT NOT NULL | Product title |
| title | TEXT NOT NULL | Item title (variation) |
| object_id | BIGINT UNSIGNED NULL DEFAULT NULL | Variation ID |
| cart_index | BIGINT UNSIGNED NOT NULL DEFAULT '0' | Position in cart |
| quantity | INT NOT NULL DEFAULT '1' | Item quantity |
| unit_price | BIGINT NOT NULL DEFAULT '0' | Price per unit in cents |
| cost | BIGINT NOT NULL DEFAULT '0' | Cost in cents |
| subtotal | BIGINT NOT NULL DEFAULT '0' | Line subtotal |
| tax_amount | BIGINT NOT NULL DEFAULT '0' | Tax amount for this line |
| shipping_charge | BIGINT NOT NULL DEFAULT '0' | Shipping charge |
| discount_total | BIGINT NOT NULL DEFAULT '0' | Discount amount |
| line_total | BIGINT NOT NULL DEFAULT '0' | Total line amount |
| refund_total | BIGINT NOT NULL DEFAULT '0' | Refunded amount |
| rate | BIGINT NOT NULL DEFAULT '1' | Exchange rate |
| other_info | JSON NULL | Additional item data |
| line_meta | JSON NULL | Line-specific metadata |
| fulfilled_quantity | INT NOT NULL DEFAULT '0' | Quantity fulfilled |
| referrer | TEXT NULL | Referral information |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** order_id + object_id, post_id

---

### `fct_order_meta`
Stores additional order metadata.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| order_id | BIGINT UNSIGNED NOT NULL | Reference to order |
| key | VARCHAR(192) NOT NULL | Meta key |
| value | LONGTEXT NULL | Meta value |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** order_id, key

---

### `fct_order_transactions`
Stores payment transactions for orders.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT(20) UNSIGNED *Auto Increment* | Primary key |
| order_id | BIGINT UNSIGNED NOT NULL DEFAULT '0' | Reference to order |
| order_type | VARCHAR(100) NOT NULL DEFAULT '' | |
| transaction_type | VARCHAR(192) DEFAULT 'charge' | charge, refund, etc. |
| subscription_id | INT(10) UNSIGNED NULL | Reference to subscription |
| payment_method | VARCHAR(100) NOT NULL DEFAULT '' | Payment method used |
| payment_method_title | VARCHAR(100) NOT NULL DEFAULT '' | Display title |
| charge_id | VARCHAR(192) NULL | Gateway charge/transaction ID |
| payment_note | LONGTEXT NULL | Payment notes |
| card_brand | VARCHAR(50) NULL | Card brand (visa, mastercard) |
| card_last_four | VARCHAR(4) NULL | Last 4 digits of card |
| amount | BIGINT NOT NULL DEFAULT '0' | Amount in cents |
| currency | VARCHAR(10) NOT NULL DEFAULT '' | Currency code |
| status | VARCHAR(50) NOT NULL DEFAULT '' | Transaction status |
| vendor_data | LONGTEXT NULL | Payment gateway response data |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** order_id, charge_id, subscription_id

---

### `fct_order_addresses`
Stores billing and shipping addresses attached to orders.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| order_id | BIGINT UNSIGNED NOT NULL | Reference to order |
| address_type | VARCHAR(20) NOT NULL DEFAULT 'billing' | billing, shipping |
| first_name | VARCHAR(192) NOT NULL DEFAULT '' | First name |
| last_name | VARCHAR(192) NOT NULL DEFAULT '' | Last name |
| email | VARCHAR(192) NOT NULL DEFAULT '' | Email |
| phone | VARCHAR(50) NULL | Phone |
| company | VARCHAR(192) NULL | Company |
| address_1 | VARCHAR(255) NULL | Address line 1 |
| address_2 | VARCHAR(255) NULL | Address line 2 |
| city | VARCHAR(100) NULL | City |
| state | VARCHAR(100) NULL | State/Province |
| postcode | VARCHAR(20) NULL | Postal/ZIP code |
| country | VARCHAR(10) NULL | Country code |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** order_id

---

### `fct_order_operations`
Tracks order processing operations.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| order_id | BIGINT UNSIGNED NOT NULL | Reference to order |
| operation_type | VARCHAR(50) NOT NULL | Operation type |
| object_type | VARCHAR(50) NULL | Related object type |
| object_id | BIGINT UNSIGNED NULL | Related object ID |
| value | LONGTEXT NULL | Operation value/data |
| created_by | BIGINT UNSIGNED NULL | User who performed the operation |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** order_id

---

### `fct_order_tax_rates`
Records tax rates applied to specific orders.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| order_id | BIGINT UNSIGNED NOT NULL | Reference to order |
| tax_class_id | BIGINT UNSIGNED NULL | Reference to tax class |
| tax_rate_id | BIGINT UNSIGNED NULL | Reference to tax rate |
| country | VARCHAR(10) NULL | Country code |
| state | VARCHAR(100) NULL | State |
| rate | DECIMAL(8,4) NOT NULL DEFAULT '0.0000' | Tax rate percentage |
| name | VARCHAR(192) NULL | Tax name |
| tax_total | BIGINT NOT NULL DEFAULT '0' | Tax total in cents |
| shipping_tax | BIGINT NOT NULL DEFAULT '0' | Shipping tax in cents |
| priority | INT NOT NULL DEFAULT 0 | Rate priority |
| compound | TINYINT(1) NOT NULL DEFAULT 0 | Compound tax flag |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** order_id

---

### `fct_order_download_permissions`
Manages download access for digital products.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| order_id | BIGINT UNSIGNED NOT NULL | Reference to order |
| customer_id | BIGINT UNSIGNED NOT NULL | Reference to customer |
| product_id | BIGINT UNSIGNED NOT NULL | WordPress post ID |
| variation_id | BIGINT UNSIGNED NULL | Variation ID |
| download_id | BIGINT UNSIGNED NULL | Reference to product download |
| download_count | INT NOT NULL DEFAULT 0 | Number of downloads |
| download_limit | INT NULL | Max downloads allowed |
| access_expires | DATETIME NULL | Access expiration date |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** order_id, customer_id

---

## Subscription Tables

### `fct_subscriptions`
Stores subscription information and billing cycles.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| uuid | VARCHAR(100) NOT NULL | Unique identifier |
| customer_id | BIGINT(20) UNSIGNED NOT NULL | Reference to customer |
| parent_order_id | BIGINT(20) UNSIGNED NOT NULL | Initial order ID |
| product_id | BIGINT(20) UNSIGNED NOT NULL | WordPress post ID |
| item_name | TEXT NOT NULL | Subscription item name |
| quantity | INT NOT NULL DEFAULT '1' | Subscription quantity |
| variation_id | BIGINT(20) UNSIGNED NOT NULL | Product variation ID |
| billing_interval | VARCHAR(45) NULL | Billing interval (day, week, month, year) |
| signup_fee | BIGINT UNSIGNED NOT NULL DEFAULT 0 | Signup fee in cents |
| initial_tax_total | BIGINT UNSIGNED NOT NULL DEFAULT 0 | Initial tax in cents |
| recurring_amount | BIGINT UNSIGNED NOT NULL DEFAULT 0 | Recurring amount in cents |
| recurring_tax_total | BIGINT UNSIGNED NOT NULL DEFAULT 0 | Recurring tax in cents |
| recurring_total | BIGINT UNSIGNED NOT NULL DEFAULT 0 | Total recurring in cents |
| bill_times | BIGINT(20) UNSIGNED NOT NULL DEFAULT 0 | Total billing cycles |
| bill_count | INT UNSIGNED NOT NULL DEFAULT 0 | Current billing count |
| expire_at | DATETIME NULL | Expiration date |
| trial_ends_at | DATETIME NULL | Trial end date |
| canceled_at | DATETIME NULL | Cancellation date |
| restored_at | DATETIME NULL | Restoration date |
| collection_method | ENUM('automatic', 'manual', 'system') NOT NULL DEFAULT 'automatic' | Payment collection method |
| next_billing_date | DATETIME NULL | Next billing date |
| trial_days | INT(10) UNSIGNED NOT NULL DEFAULT 0 | Trial period in days |
| vendor_customer_id | VARCHAR(45) NULL | Payment gateway customer ID |
| vendor_plan_id | VARCHAR(45) NULL | Payment gateway plan ID |
| vendor_subscription_id | VARCHAR(45) NULL | Payment gateway subscription ID |
| status | VARCHAR(45) NULL | active, canceled, expired, pending, trialing |
| original_plan | LONGTEXT NULL | Original plan data |
| vendor_response | LONGTEXT NULL | Payment gateway response |
| current_payment_method | VARCHAR(45) NULL | Current payment method |
| config | JSON DEFAULT NULL | Subscription configuration |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** parent_order_id

---

### `fct_subscription_meta`
Stores additional subscription metadata.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| subscription_id | BIGINT UNSIGNED NOT NULL | Reference to subscription |
| key | VARCHAR(192) NOT NULL | Meta key |
| value | LONGTEXT NULL | Meta value |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** subscription_id, key

---

## Product Tables

### `fct_product_details`
Stores extended product detail data.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| post_id | BIGINT UNSIGNED NOT NULL | WordPress post ID |
| sku | VARCHAR(100) NULL | Product SKU |
| slug | VARCHAR(255) NULL | Product slug |
| product_type | VARCHAR(20) NOT NULL DEFAULT 'simple' | simple, variable, grouped |
| fulfillment_type | VARCHAR(20) NOT NULL DEFAULT 'physical' | physical, digital, service |
| payment_type | VARCHAR(20) NOT NULL DEFAULT 'onetime' | onetime, subscription |
| status | VARCHAR(20) NOT NULL DEFAULT 'draft' | draft, published, archived |
| price | BIGINT NOT NULL DEFAULT '0' | Price in cents |
| compare_price | BIGINT NULL | Compare-at price in cents |
| cost | BIGINT NULL | Cost in cents |
| manage_stock | TINYINT(1) NOT NULL DEFAULT 0 | Stock management enabled |
| stock_quantity | INT NULL | Available stock |
| stock_status | VARCHAR(20) NOT NULL DEFAULT 'in_stock' | in_stock, out_of_stock, on_backorder |
| low_stock_threshold | INT NULL | Low stock alert threshold |
| total_sales | INT NOT NULL DEFAULT 0 | Total units sold |
| weight | DECIMAL(10,2) NULL | Product weight |
| length | DECIMAL(10,2) NULL | Product length |
| width | DECIMAL(10,2) NULL | Product width |
| height | DECIMAL(10,2) NULL | Product height |
| shipping_class_id | BIGINT UNSIGNED NULL | Shipping class |
| tax_class_id | BIGINT UNSIGNED NULL | Tax class |
| settings | JSON NULL | Product settings |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** post_id, sku, slug

---

### `fct_product_variations`
Stores product variation data for variable products.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| parent_id | BIGINT UNSIGNED NOT NULL | Parent product post ID |
| title | VARCHAR(255) NOT NULL | Variation title |
| sku | VARCHAR(100) NULL | Variation SKU |
| price | BIGINT NOT NULL DEFAULT '0' | Price in cents |
| compare_price | BIGINT NULL | Compare-at price in cents |
| cost | BIGINT NULL | Cost in cents |
| manage_stock | TINYINT(1) NOT NULL DEFAULT 0 | Stock management |
| stock_quantity | INT NULL | Stock quantity |
| stock_status | VARCHAR(20) NOT NULL DEFAULT 'in_stock' | Stock status |
| weight | DECIMAL(10,2) NULL | Weight |
| media | JSON NULL | Variation media |
| option_values | JSON NULL | Attribute option values |
| settings | JSON NULL | Variation settings |
| status | VARCHAR(20) NOT NULL DEFAULT 'active' | active, inactive |
| sort_order | INT NOT NULL DEFAULT 0 | Display order |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** parent_id

---

### `fct_product_meta`
Stores product metadata as key-value pairs.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| product_id | BIGINT UNSIGNED NOT NULL | Product post ID |
| key | VARCHAR(192) NOT NULL | Meta key |
| value | LONGTEXT NULL | Meta value |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** product_id, key

---

### `fct_product_downloads`
Stores downloadable files associated with products.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| product_id | BIGINT UNSIGNED NOT NULL | Product post ID |
| variation_id | BIGINT UNSIGNED NULL | Variation ID (NULL = all variations) |
| title | VARCHAR(255) NOT NULL | File title |
| file_url | TEXT NOT NULL | File URL or path |
| file_hash | VARCHAR(64) NULL | File hash for integrity |
| storage_driver | VARCHAR(50) NOT NULL DEFAULT 'local' | Storage driver |
| download_limit | INT NULL | Max downloads |
| access_lifetime | INT NULL | Access lifetime in days |
| sort_order | INT NOT NULL DEFAULT 0 | Display order |
| settings | JSON NULL | File-level settings |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** product_id

---

## Coupon Tables

### `fct_coupons`
Stores coupon definitions and rules.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| title | VARCHAR(200) NOT NULL | Coupon title |
| code | VARCHAR(50) NOT NULL UNIQUE | Coupon code (unique) |
| priority | INT DEFAULT NULL | Coupon priority |
| type | VARCHAR(20) NOT NULL | Coupon type |
| conditions | JSON NULL | Coupon conditions |
| amount | double NOT NULL | Discount amount |
| use_count | INT DEFAULT 0 | Usage count |
| status | VARCHAR(20) NOT NULL | Coupon status |
| notes | LONGTEXT NOT NULL | Coupon notes |
| stackable | VARCHAR(3) NOT NULL DEFAULT 'no' | Stackable flag (yes/no) |
| show_on_checkout | VARCHAR(3) NOT NULL DEFAULT 'yes' | Show on checkout (yes/no) |
| start_date | TIMESTAMP NULL | Start date |
| end_date | TIMESTAMP NULL | End date |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** code, status

---

### `fct_applied_coupons`
Records coupon usage on orders.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| order_id | BIGINT UNSIGNED NOT NULL | Reference to order |
| coupon_id | BIGINT UNSIGNED NOT NULL | Reference to coupon |
| code | VARCHAR(50) NOT NULL | Coupon code used |
| discount_type | VARCHAR(20) NOT NULL | Discount type |
| discount_amount | BIGINT NOT NULL DEFAULT '0' | Discount amount in cents |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** order_id, coupon_id

---

## Cart & Checkout Tables

### `fct_carts`
Stores active and abandoned shopping carts.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| customer_id | BIGINT UNSIGNED NULL | Customer reference |
| user_id | BIGINT UNSIGNED NULL | WordPress user ID |
| email | VARCHAR(192) NULL | Customer email |
| cart_hash | VARCHAR(64) NULL | Cart hash for identification |
| stage | VARCHAR(20) NOT NULL DEFAULT 'checkout' | checkout, completed, abandoned |
| payment_method | VARCHAR(100) NULL | Selected payment method |
| currency | VARCHAR(10) NULL | Currency |
| subtotal | BIGINT NOT NULL DEFAULT '0' | Subtotal in cents |
| total_amount | BIGINT NOT NULL DEFAULT '0' | Total in cents |
| cart_data | LONGTEXT NULL | JSON-encoded cart items |
| checkout_data | LONGTEXT NULL | JSON-encoded checkout data |
| config | JSON NULL | Cart configuration |
| ip_address | VARCHAR(45) NULL | IP address |
| completed_at | DATETIME NULL | Completion time |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** cart_hash, customer_id, stage

---

## Shipping Tables

### `fct_shipping_zones`
Stores shipping zone configurations.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| title | VARCHAR(200) NOT NULL | Zone name |
| zone_type | VARCHAR(20) NOT NULL DEFAULT 'countries' | countries, states, postcodes |
| regions | JSON NULL | Zone region definitions |
| sort_order | INT NOT NULL DEFAULT 0 | Display order |
| is_enabled | TINYINT(1) NOT NULL DEFAULT 1 | Enabled flag |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

---

### `fct_shipping_methods`
Stores shipping methods within zones.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| zone_id | BIGINT UNSIGNED NOT NULL | Reference to shipping zone |
| title | VARCHAR(200) NOT NULL | Method name |
| method_type | VARCHAR(50) NOT NULL | flat_rate, free_shipping, local_pickup, etc. |
| cost | BIGINT NOT NULL DEFAULT '0' | Cost in cents |
| settings | JSON NULL | Method-specific settings |
| is_enabled | TINYINT(1) NOT NULL DEFAULT 1 | Enabled flag |
| sort_order | INT NOT NULL DEFAULT 0 | Display order |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** zone_id

---

### `fct_shipping_classes`
Stores product shipping classes.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| title | VARCHAR(200) NOT NULL | Class name |
| slug | VARCHAR(200) NOT NULL | URL slug |
| description | TEXT NULL | Class description |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** slug

---

## Tax Tables

### `fct_tax_classes`
Stores tax class definitions.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| title | VARCHAR(200) NOT NULL | Tax class name |
| slug | VARCHAR(200) NOT NULL | URL slug |
| description | TEXT NULL | Description |
| is_default | TINYINT(1) NOT NULL DEFAULT 0 | Default class flag |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

---

### `fct_tax_rates`
Stores tax rate configurations.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| tax_class_id | BIGINT UNSIGNED NOT NULL | Reference to tax class |
| country | VARCHAR(10) NOT NULL | Country code |
| state | VARCHAR(100) NULL DEFAULT '' | State/Province |
| postcode | VARCHAR(20) NULL DEFAULT '' | Postcode |
| city | VARCHAR(100) NULL DEFAULT '' | City |
| rate | DECIMAL(8,4) NOT NULL | Tax rate percentage |
| name | VARCHAR(192) NOT NULL | Rate name |
| priority | INT NOT NULL DEFAULT 1 | Rate priority |
| compound | TINYINT(1) NOT NULL DEFAULT 0 | Compound tax flag |
| shipping | TINYINT(1) NOT NULL DEFAULT 1 | Apply to shipping |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** tax_class_id, country

---

## Activity & System Tables

### `fct_activities`
Stores activity log entries for audit trail.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| object_type | VARCHAR(50) NOT NULL | Related object type (order, customer, etc.) |
| object_id | BIGINT UNSIGNED NOT NULL | Related object ID |
| activity_type | VARCHAR(50) NOT NULL | Activity type (status_change, note, etc.) |
| title | VARCHAR(255) NULL | Activity title |
| content | LONGTEXT NULL | Activity content/details |
| actor_type | VARCHAR(50) NULL | Actor type (user, system, customer) |
| actor_id | BIGINT UNSIGNED NULL | Actor ID |
| is_read | TINYINT(1) NOT NULL DEFAULT 0 | Read status |
| settings | JSON NULL | Additional settings |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** object_type + object_id, activity_type

---

### `fct_scheduled_actions`
Stores scheduled background tasks.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| hook | VARCHAR(192) NOT NULL | Action hook name |
| args | LONGTEXT NULL | JSON-encoded arguments |
| status | VARCHAR(20) NOT NULL DEFAULT 'pending' | pending, running, completed, failed |
| scheduled_at | DATETIME NOT NULL | Scheduled execution time |
| started_at | DATETIME NULL | Actual start time |
| completed_at | DATETIME NULL | Completion time |
| attempts | INT NOT NULL DEFAULT 0 | Execution attempts |
| group_slug | VARCHAR(100) NULL | Action group |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** hook, status, scheduled_at

---

### `fct_meta`
General-purpose metadata table.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| object_type | VARCHAR(50) NOT NULL | Object type |
| object_id | BIGINT UNSIGNED NOT NULL | Object ID |
| key | VARCHAR(192) NOT NULL | Meta key |
| value | LONGTEXT NULL | Meta value |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** object_type + object_id, key

---

## Attribute & Label Tables

### `fct_attribute_groups`
Stores product attribute group definitions.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| title | VARCHAR(200) NOT NULL | Attribute group name |
| slug | VARCHAR(200) NOT NULL | URL slug |
| type | VARCHAR(50) NOT NULL DEFAULT 'select' | select, color, button, image |
| sort_order | INT NOT NULL DEFAULT 0 | Display order |
| settings | JSON NULL | Group settings |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

---

### `fct_attribute_terms`
Stores individual attribute values/terms.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| group_id | BIGINT UNSIGNED NOT NULL | Reference to attribute group |
| title | VARCHAR(200) NOT NULL | Term name |
| slug | VARCHAR(200) NOT NULL | URL slug |
| value | VARCHAR(255) NULL | Display value (hex color, image URL) |
| sort_order | INT NOT NULL DEFAULT 0 | Display order |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** group_id

---

### `fct_attribute_relations`
Maps attribute terms to products/variations.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| object_type | VARCHAR(50) NOT NULL | Object type (product, variation) |
| object_id | BIGINT UNSIGNED NOT NULL | Object ID |
| group_id | BIGINT UNSIGNED NOT NULL | Reference to attribute group |
| term_id | BIGINT UNSIGNED NOT NULL | Reference to attribute term |
| created_at | DATETIME NULL | |

**Indexes:** object_type + object_id, group_id + term_id

---

### `fct_labels`
Stores label/tag definitions for organizing objects.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| title | VARCHAR(200) NOT NULL | Label name |
| slug | VARCHAR(200) NOT NULL | URL slug |
| color | VARCHAR(20) NULL | Label color |
| type | VARCHAR(50) NOT NULL DEFAULT 'general' | Label type |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

---

### `fct_label_relationships`
Maps labels to objects (products, orders, customers, etc.).

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| label_id | BIGINT UNSIGNED NOT NULL | Reference to label |
| object_type | VARCHAR(50) NOT NULL | Object type |
| object_id | BIGINT UNSIGNED NOT NULL | Object ID |
| created_at | DATETIME NULL | |

**Indexes:** label_id, object_type + object_id

---

## Pro Plugin Tables

### `fct_licenses` (Pro)
Stores software license keys.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| customer_id | BIGINT UNSIGNED NOT NULL | Reference to customer |
| order_id | BIGINT UNSIGNED NOT NULL | Reference to order |
| order_item_id | BIGINT UNSIGNED NULL | Reference to order item |
| product_id | BIGINT UNSIGNED NOT NULL | WordPress post ID |
| variation_id | BIGINT UNSIGNED NULL | Variation ID |
| subscription_id | BIGINT UNSIGNED NULL | Linked subscription |
| license_key | VARCHAR(255) NOT NULL UNIQUE | Unique license key |
| status | VARCHAR(20) NOT NULL DEFAULT 'active' | active, expired, disabled, revoked |
| activation_limit | INT NOT NULL DEFAULT 1 | Max activations allowed |
| activation_count | INT NOT NULL DEFAULT 0 | Current activations |
| valid_for | INT NULL | Validity in days |
| expires_at | DATETIME NULL | Expiration date |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** license_key, customer_id, order_id, product_id

---

### `fct_license_meta` (Pro)
Stores license metadata.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| license_id | BIGINT UNSIGNED NOT NULL | Reference to license |
| key | VARCHAR(192) NOT NULL | Meta key |
| value | LONGTEXT NULL | Meta value |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** license_id, key

---

### `fct_license_activations` (Pro)
Tracks license activation instances.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| license_id | BIGINT UNSIGNED NOT NULL | Reference to license |
| domain | VARCHAR(255) NOT NULL | Activated domain |
| activation_key | VARCHAR(255) NULL | Activation key |
| status | VARCHAR(20) NOT NULL DEFAULT 'active' | active, deactivated |
| ip_address | VARCHAR(45) NULL | IP address |
| user_agent | TEXT NULL | User agent |
| activated_at | DATETIME NULL | Activation date |
| deactivated_at | DATETIME NULL | Deactivation date |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** license_id, domain

---

### `fct_license_sites` (Pro)
Maps license activations to specific sites.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| license_id | BIGINT UNSIGNED NOT NULL | Reference to license |
| site_url | VARCHAR(255) NOT NULL | Site URL |
| site_name | VARCHAR(255) NULL | Site name |
| status | VARCHAR(20) NOT NULL DEFAULT 'active' | active, deactivated |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** license_id

---

### `fct_order_promotions` (Pro)
Stores order-bump and promotion data.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| title | VARCHAR(255) NOT NULL | Promotion title |
| type | VARCHAR(50) NOT NULL | Promotion type (order_bump) |
| settings | JSON NULL | Promotion settings/config |
| status | VARCHAR(20) NOT NULL DEFAULT 'active' | active, inactive |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

---

### `fct_order_promotion_stats` (Pro)
Tracks promotion performance statistics.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| promotion_id | BIGINT UNSIGNED NOT NULL | Reference to promotion |
| order_id | BIGINT UNSIGNED NOT NULL | Reference to order |
| order_item_id | BIGINT UNSIGNED NULL | Reference to order item |
| amount | BIGINT NOT NULL DEFAULT '0' | Revenue in cents |
| created_at | DATETIME NULL | |

**Indexes:** promotion_id, order_id

---

## Webhook & Integration Tables

### `fct_webhook_logs`
Stores webhook delivery history.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| event | VARCHAR(192) NOT NULL | Event name |
| url | TEXT NOT NULL | Webhook URL |
| request_headers | LONGTEXT NULL | Request headers |
| request_body | LONGTEXT NULL | Request body |
| response_code | INT NULL | HTTP response code |
| response_body | LONGTEXT NULL | Response body |
| status | VARCHAR(20) NOT NULL | success, failed |
| created_at | DATETIME NULL | |

**Indexes:** event

---

### `fct_email_notifications`
Stores email notification templates and settings.

| Column | Type | Comment |
|--------|------|---------|
| id | BIGINT UNSIGNED *Auto Increment* | Primary key |
| event | VARCHAR(192) NOT NULL | Trigger event name |
| title | VARCHAR(255) NOT NULL | Email subject template |
| body | LONGTEXT NOT NULL | Email body template |
| recipient_type | VARCHAR(50) NOT NULL | admin, customer |
| is_enabled | TINYINT(1) NOT NULL DEFAULT 1 | Enabled flag |
| settings | JSON NULL | Email settings |
| created_at | DATETIME NULL | |
| updated_at | DATETIME NULL | |

**Indexes:** event
