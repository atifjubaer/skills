# FluentCart Eloquent Models & Query Builder Master Reference

> Source: https://dev.fluentcart.com/database/models.html

Complete developer reference for FluentCart's ORM layer built on Eloquent ORM. Covers all 40+ models across Core and Pro modules, relationships, scopes, mutators, and Query Builder usage patterns.

---

## Core Architecture Principles

1. **Namespace Convention:**
   - Core Models: `\FluentCart\App\Models\*`
   - Pro Models: `\FluentCartPro\App\Models\*`
2. **Cents Precision:**
   - Financial attributes (`total_amount`, `subtotal`, `tax_total`, `discount_total`, `unit_price`, `balance`) are stored in **cents** as integers.
   - Use `\FluentCart\App\Helpers\Helper::toDecimal($cents)` when rendering or sending decimal strings.
3. **Database Prefix:**
   - Tables automatically resolve using the WordPress prefix (e.g., `$table = 'fct_orders'`).

---

## 1. Core Models Reference

### `Order` (`\FluentCart\App\Models\Order`)
Represents customer orders placed in FluentCart.

* **Table:** `wp_fct_orders`
* **Fillable Fields:** `customer_id`, `status`, `payment_status`, `currency`, `subtotal`, `tax_total`, `shipping_total`, `discount_total`, `total_amount`, `ip_address`, `user_agent`, `completed_at`
* **Relationships:**
  * `items()` *(hasMany)* -> `OrderItem`
  * `customer()` *(belongsTo)* -> `Customer`
  * `transactions()` *(hasMany)* -> `OrderTransaction`
  * `subscriptions()` *(hasMany)* -> `Subscription`
  * `licenses()` *(hasMany)* -> `License`
  * `meta()` *(hasMany)* -> `OrderMeta`
  * `addresses()` *(hasMany)* -> `OrderAddress`
  * `billing_address()` *(hasOne)* -> `OrderAddress` (where `type = 'billing'`)
  * `shipping_address()` *(hasOne)* -> `OrderAddress` (where `type = 'shipping'`)
* **Code Example (Fetch Paid Orders with Customer & Line Items):**
  ```php
  use FluentCart\App\Models\Order;

  $orders = Order::with(['customer', 'items', 'transactions'])
      ->where('payment_status', 'paid')
      ->orderBy('id', 'DESC')
      ->paginate(15);

  foreach ($orders as $order) {
      $decimalTotal = \FluentCart\App\Helpers\Helper::toDecimal($order->total_amount);
      echo "Order #{$order->id} - {$order->customer->email} - ${decimalTotal}\n";
  }
  ```

---

### `Customer` (`\FluentCart\App\Models\Customer`)
Represents customer profile records linked to WordPress user accounts or guest buyers.

* **Table:** `wp_fct_customers`
* **Fillable Fields:** `user_id`, `first_name`, `last_name`, `email`, `phone`, `city`, `state`, `country`, `purchase_count`, `total_spend`
* **Relationships:**
  * `orders()` *(hasMany)* -> `Order`
  * `subscriptions()` *(hasMany)* -> `Subscription`
  * `licenses()` *(hasMany)* -> `License`
  * `meta()` *(hasMany)* -> `CustomerMeta`
  * `user()` *(belongsTo)* -> `\WP_User`
* **Code Example (Query Top VIP Customers):**
  ```php
  use FluentCart\App\Models\Customer;

  $vipCustomers = Customer::withCount('orders')
      ->where('total_spend', '>=', 50000) // $500.00 in cents
      ->orderBy('total_spend', 'DESC')
      ->get();
  ```

---

### `Subscription` (`\FluentCart\App\Models\Subscription`)
Represents recurring billing subscriptions.

* **Table:** `wp_fct_subscriptions`
* **Fillable Fields:** `customer_id`, `order_id`, `product_id`, `status`, `billing_interval`, `billing_period`, `recurring_total`, `trial_ends_at`, `next_billing_at`, `cancelled_at`, `bill_count`
* **Relationships:**
  * `order()` *(belongsTo)* -> `Order`
  * `customer()` *(belongsTo)* -> `Customer`
  * `product()` *(belongsTo)* -> `Product`
  * `meta()` *(hasMany)* -> `SubscriptionMeta`
* **Code Example (Fetch Active Subscriptions Due for Renewal Today):**
  ```php
  use FluentCart\App\Models\Subscription;

  $dueSubscriptions = Subscription::where('status', 'active')
      ->where('next_billing_at', '<=', date('Y-m-d H:i:s'))
      ->get();
  ```

---

### `OrderItem` (`\FluentCart\App\Models\OrderItem`)
Represents individual line items attached to an order.

* **Table:** `wp_fct_order_items`
* **Fillable Fields:** `order_id`, `product_id`, `variation_id`, `title`, `quantity`, `unit_price`, `tax_amount`, `subtotal`, `total_amount`
* **Relationships:**
  * `order()` *(belongsTo)* -> `Order`
  * `product()` *(belongsTo)* -> `Product`

---

### `OrderTransaction` (`\FluentCart\App\Models\OrderTransaction`)
Represents individual payment gateway transactions, authorizations, and refunds.

* **Table:** `wp_fct_order_transactions`
* **Fillable Fields:** `order_id`, `gateway`, `transaction_type`, `transaction_id`, `status`, `amount`, `currency`, `card_last4`, `response_data`
* **Relationships:**
  * `order()` *(belongsTo)* -> `Order`

---

### `Product` & `ProductVariation` (`\FluentCart\App\Models\Product`)
Represents e-commerce product catalog items and variations.

* **Table:** `wp_fct_products`, `wp_fct_product_variations`
* **Relationships:**
  * `variations()` *(hasMany)* -> `ProductVariation`
  * `details()` *(hasOne)* -> `ProductDetail`
* **Code Example (Query In-Stock Products):**
  ```php
  use FluentCart\App\Models\Product;

  $inStockProducts = Product::with('variations')
      ->where('status', 'publish')
      ->where('stock_status', 'instock')
      ->get();
  ```

---

### `Coupon` (`\FluentCart\App\Models\Coupon`)
Represents discount codes and promo rules.

* **Table:** `wp_fct_coupons`
* **Fillable Fields:** `code`, `title`, `coupon_type`, `amount`, `status`, `usage_limit`, `usage_count`, `expires_at`

---

### `License` (`\FluentCartPro\App\Models\License`)
Represents software licensing keys generated for digital product sales.

* **Table:** `wp_fct_licenses`
* **Fillable Fields:** `order_id`, `customer_id`, `product_id`, `license_key`, `status`, `activation_limit`, `activation_count`, `expires_at`
* **Relationships:**
  * `activations()` *(hasMany)* -> `LicenseActivation`
  * `order()` *(belongsTo)* -> `Order`

---

## 2. Advanced Query Builder Examples

### Complex Multi-Condition Filter
```php
use FluentCart\App\Models\Order;

$reportOrders = Order::query()
    ->where('payment_status', 'paid')
    ->whereBetween('created_at', ['2026-01-01 00:00:00', '2026-12-31 23:59:59'])
    ->whereHas('customer', function ($query) {
        $query->where('country', 'US');
    })
    ->with(['items', 'customer'])
    ->get();
```

### Aggregates & Financial Analytics
```php
use FluentCart\App\Models\Order;

// Total Gross Revenue in Cents for Current Month
$grossRevenueInCents = Order::where('payment_status', 'paid')
    ->whereYear('created_at', date('Y'))
    ->whereMonth('created_at', date('m'))
    ->sum('total_amount');

$decimalRevenue = \FluentCart\App\Helpers\Helper::toDecimal($grossRevenueInCents);
echo "Monthly Gross Revenue: $" . $decimalRevenue;
```
