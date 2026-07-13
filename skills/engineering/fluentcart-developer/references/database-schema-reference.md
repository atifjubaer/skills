# Database Schema Reference

This document provides a detailed reference of custom database tables created by FluentCart, along with their columns, keys, and indexes.

---

## 1. Core Tables

### `fct_customers`
Stores customer records and purchase history metrics.
- **Table Name:** `{$wpdb->prefix}fc_customers`
- **Primary Key:** `id` (bigint, Auto Increment)
- **Indexes:**
  - `email` (unique)
  - `user_id` (foreign key to WordPress users)

| Column | Type | Description |
|---|---|---|
| `id` | `BIGINT(20) UNSIGNED` | Auto-increment primary key. |
| `user_id` | `BIGINT(20) UNSIGNED` | WordPress User ID link (null for guests). |
| `email` | `VARCHAR(191)` | Customer primary contact email address. |
| `first_name` | `VARCHAR(100)` | Customer billing first name. |
| `last_name` | `VARCHAR(100)` | Customer billing last name. |
| `total_spend` | `BIGINT(20)` | Total lifetime spending amount in **cents**. |
| `orders_count` | `INT(11)` | Total number of successfully completed orders. |
| `created_at` | `TIMESTAMP` | Record creation timestamp. |
| `updated_at` | `TIMESTAMP` | Record last updated timestamp. |

### `fct_orders`
Stores core transaction details for customer orders.
- **Table Name:** `{$wpdb->prefix}fc_orders`
- **Primary Key:** `id` (bigint, Auto Increment)
- **Indexes:**
  - `invoice_no` (unique invoice slug)
  - `customer_id` (foreign key to customers)
  - `status`, `payment_status`

| Column | Type | Description |
|---|---|---|
| `id` | `BIGINT(20) UNSIGNED` | Unique order identifier. |
| `customer_id` | `BIGINT(20) UNSIGNED` | ID reference linking to `fct_customers`. |
| `parent_order_id`| `BIGINT(20) UNSIGNED`| Parent order ID (used for renewal orders). |
| `invoice_no` | `VARCHAR(191)` | Human-readable unique invoice number. |
| `status` | `VARCHAR(50)` | Order status: `pending`, `processing`, `completed`, `canceled`, `failed`, `on-hold`. |
| `payment_status` | `VARCHAR(50)` | Payment: `pending`, `paid`, `refunded`, `partially_refunded`. |
| `subtotal` | `BIGINT(20)` | Sum of item prices in **cents** before discounts/tax. |
| `discount` | `BIGINT(20)` | Total applied discount amount in **cents**. |
| `tax` | `BIGINT(20)` | Total calculated tax in **cents**. |
| `shipping` | `BIGINT(20)` | Total shipping fees in **cents**. |
| `total` | `BIGINT(20)` | Final order total in **cents** (subtotal - discount + tax + shipping). |
| `currency` | `VARCHAR(10)` | Currency code (e.g. `USD`, `EUR`). |
| `payment_method` | `VARCHAR(100)` | Active gateway slug (e.g. `stripe`, `paypal`). |
| `completed_at` | `TIMESTAMP` | Timestamp when the payment status transitioned to complete. |

---

## 2. Order Details & History

### `fct_order_items`
Line items belonging to an order.
- **Table Name:** `{$wpdb->prefix}fc_order_items`

| Column | Type | Description |
|---|---|---|
| `id` | `BIGINT(20) UNSIGNED` | Primary key. |
| `order_id` | `BIGINT(20) UNSIGNED` | Foreign key linking to `fct_orders`. |
| `product_id` | `BIGINT(20) UNSIGNED` | WordPress Post ID of CPT `fluent-products`. |
| `variation_id` | `BIGINT(20) UNSIGNED`| Variation ID for package-based purchases. |
| `title` | `VARCHAR(255)` | Normalized name of the product at purchase. |
| `price` | `BIGINT(20)` | Single item price in **cents**. |
| `quantity` | `INT(11)` | Purchased quantity count. |
| `tax` | `BIGINT(20)` | Tax applied specifically to this item in **cents**. |
| `total` | `BIGINT(20)` | Total for this line item in **cents** (price * qty + tax). |

### `fct_order_transactions`
Payment gateway transactions list.
- **Table Name:** `{$wpdb->prefix}fc_order_transactions`

| Column | Type | Description |
|---|---|---|
| `id` | `BIGINT(20) UNSIGNED` | Primary key. |
| `order_id` | `BIGINT(20) UNSIGNED` | Foreign key to `fct_orders`. |
| `vendor_charge_id`| `VARCHAR(255)` | Gateway transaction reference ID (e.g., Stripe charge ID). |
| `amount` | `BIGINT(20)` | Transaction total in **cents**. |
| `payment_method` | `VARCHAR(100)` | Gateway slug name. |
| `status` | `VARCHAR(50)` | Transaction state: `pending`, `success`, `failed`. |

---

## 3. Subscriptions

### `fct_subscriptions`
Stores recurring billing agreement parameters.
- **Table Name:** `{$wpdb->prefix}fc_subscriptions`

| Column | Type | Description |
|---|---|---|
| `id` | `BIGINT(20) UNSIGNED` | Primary key. |
| `parent_order_id`| `BIGINT(20) UNSIGNED` | ID of the order that initiated the subscription. |
| `customer_id` | `BIGINT(20) UNSIGNED` | Subscriber's customer record ID. |
| `status` | `VARCHAR(50)` | Status: `active`, `cancelled`, `pending`, `expired`. |
| `billing_interval`| `VARCHAR(50)`| Frequency: `daily`, `weekly`, `monthly`, `yearly`. |
| `recurring_amount`| `BIGINT(20)`| Recurring total billed on renewals in **cents**. |
| `next_due` | `TIMESTAMP` | Scheduled timestamp of the next renewal transaction. |
| `trial_ends_at` | `TIMESTAMP` | Timestamp indicating when the free trial expires. |

---

## 4. Software Licensing (Pro)

### `fct_licenses`
Generated license keys for downloadable software.
- **Table Name:** `{$wpdb->prefix}fc_licenses`

| Column | Type | Description |
|---|---|---|
| `id` | `BIGINT(20) UNSIGNED` | Primary key. |
| `order_id` | `BIGINT(20) UNSIGNED` | Link to the purchase order. |
| `customer_id` | `BIGINT(20) UNSIGNED` | Link to customer profile. |
| `license_key` | `VARCHAR(255)` | Unique generated key. |
| `status` | `VARCHAR(50)` | State: `active`, `inactive`, `expired`, `disabled`. |
| `activation_limit`| `INT(11)` | Maximum number of allowed site activations. |
| `activation_count`| `INT(11)` | Current count of active site activations. |
| `expires_at` | `TIMESTAMP` | Key expiration timestamp. |
