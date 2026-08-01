# FluentCart Eloquent Models & Query Builder Reference

> Source: Official FluentCart Developer Documentation

FluentCart provides an ActiveRecord implementation built on Eloquent ORM for interacting with database tables. Each database table corresponds to a dedicated Model class located under:

- **Core Models:** `\FluentCart\App\Models\*`
- **Pro Models:** `\FluentCartPro\App\Models\*`

---

## 💡 Core Architecture Principles

1. **Monetary Values in Cents:** All financial attributes (`total_amount`, `subtotal`, `unit_price`, `tax_total`, `discount_total`) are stored as **integer cents** (e.g., `$19.99` = `1999`).
2. **Helper Functions:** Use `\FluentCart\App\Helpers\Helper::toDecimal($cents)` to convert cents to decimal for display, and `\FluentCart\App\Helpers\Helper::toCent($decimal)` when inserting user inputs.
3. **Database Tables Prefix:** Table names resolve automatically using the WordPress prefix (e.g., `wp_fct_orders`).

---

## 🔍 Querying Models

### 1. Retrieving All Records
```php
// Retrieve all orders from wp_fct_orders table
$orders = \FluentCart\App\Models\Order::all();

foreach ($orders as $order) {
    // Access order total amount attribute in cents
    $cents = $order->total_amount;
}
```

### 2. Constraints & Filtering
```php
// Filter completed orders with ordering and pagination limit
$orders = \FluentCart\App\Models\Order::where('status', 'completed')
    ->orderBy('created_at', 'DESC')
    ->limit(10)
    ->skip(5)
    ->get();
```

### 3. Finding Single Models
```php
// Retrieve single order record by primary key ID
$order = \FluentCart\App\Models\Order::find(101);

// Find first matching order record by custom query constraint
$pendingOrder = \FluentCart\App\Models\Order::where('status', 'pending')->first();

// Find multiple models by array of primary key IDs
$selectedOrders = \FluentCart\App\Models\Order::find([101, 102, 103]);
```

### 4. Aggregate Functions
```php
// Count total completed orders
$totalCompleted = \FluentCart\App\Models\Order::where('status', 'completed')->count();

// Calculate maximum total amount in cents for completed orders
$maxOrderValue = \FluentCart\App\Models\Order::where('status', 'completed')->max('total_amount');
```

---

## ✏️ Inserting, Updating & Deleting

### 1. Creating New Records
```php
// Create a new order record using mass assignment
$order = \FluentCart\App\Models\Order::create([
    'customer_id'    => 42, // Reference to customer ID
    'status'         => 'pending', // Order status slug
    'payment_method' => 'stripe', // Gateway key
    'currency'       => 'USD', // Currency ISO code
    'total_amount'   => \FluentCart\App\Helpers\Helper::toCent(49.99) // Convert $49.99 to 4999 cents
]);
```

### 2. Updating Existing Models
```php
// Find order model by primary key ID
$order = \FluentCart\App\Models\Order::find(101);

// Modify properties directly on model instance
$order->status = 'completed'; // Update order status
$order->completed_at = date('Y-m-d H:i:s'); // Set completion timestamp
$order->save(); // Save changes to database

// Alternatively update attributes via array mass assignment
$order->update([
    'status'       => 'completed', // New status
    'completed_at' => date('Y-m-d H:i:s') // Updated timestamp
]);
```

### 3. Deleting Models
```php
// Find and delete a single model instance
$order = \FluentCart\App\Models\Order::find(101);
$order->delete(); // Delete record from database

// Delete records in bulk matching query constraints
\FluentCart\App\Models\Order::where('status', 'draft')->delete();
```

---

## 🎯 Query Scopes & Relationships

### Local Query Scopes
Models include predefined query scopes. For instance, the `Order` model defines `scopeOfStatus`:

```php
// Use ofStatus query scope to filter completed orders
$completedOrders = \FluentCart\App\Models\Order::ofStatus('completed')->get();
```

### Relationships & Eager Loading
```php
// Find customer model by ID
$customer = \FluentCart\App\Models\Customer::find(15);

// Access hasMany orders relationship collection
$customerOrders = $customer->orders;

// Access hasMany subscriptions relationship collection
$customerSubscriptions = $customer->subscriptions;

// Eager load customer and item relationships to prevent N+1 query overhead
$orders = \FluentCart\App\Models\Order::with(['customer', 'items'])
    ->where('status', 'completed')
    ->get();
```

---

## 📋 Comprehensive Model Index

### Core Models (`\FluentCart\App\Models\*`)

| Domain | Model Name | Description & Table |
|---|---|---|
| **Orders** | `Order` | Central order record (`wp_fct_orders`) |
| | `OrderItem` | Individual line item in an order (`wp_fct_order_items`) |
| | `OrderTransaction` | Payment transactions and refunds (`wp_fct_order_transactions`) |
| | `OrderAddress` | Order billing & shipping addresses (`wp_fct_order_addresses`) |
| | `OrderMeta` | Custom key-value order metadata (`wp_fct_order_meta`) |
| | `OrderOperation` | UTM tracking and operation logs (`wp_fct_order_operations`) |
| | `OrderTaxRate` | Applied tax rates per order (`wp_fct_order_tax_rate`) |
| | `OrderDownloadPermission` | Customer digital file access permissions (`wp_fct_order_download_permissions`) |
| **Customers** | `Customer` | Customer profile & lifetime statistics (`wp_fct_customers`) |
| | `CustomerAddress` | Saved customer addresses (`wp_fct_customer_addresses`) |
| | `CustomerMeta` | Customer metadata storage (`wp_fct_customer_meta`) |
| **Products** | `Product` | Product post object wrapper |
| | `ProductDetail` | Inventory and fulfillment details (`wp_fct_product_details`) |
| | `ProductVariation` | Product SKUs, attributes & prices (`wp_fct_product_variations`) |
| | `ProductMeta` | Product metadata (`wp_fct_product_meta`) |
| | `ProductDownload` | Downloadable files attached to products (`wp_fct_product_downloads`) |
| **Subscriptions** | `Subscription` | Recurring subscription billing (`wp_fct_subscriptions`) |
| | `SubscriptionMeta` | Subscription metadata (`wp_fct_subscription_meta`) |
| **Cart & Coupons** | `Cart` | Customer shopping cart sessions (`wp_fct_carts`) |
| | `Coupon` | Coupon codes and condition rules (`wp_fct_coupons`) |
| | `AppliedCoupon` | Applied discounts on orders (`wp_fct_applied_coupons`) |
| **System** | `Activity` | System activity logs (`wp_fct_activity`) |
| | `ScheduledAction` | Background Action Scheduler jobs (`wp_fct_scheduled_actions`) |
| | `Meta` | Generic key-value store (`wp_fct_meta`) |
| | `User` | WordPress user integration |
| | `DynamicModel` | Flexible dynamic model instance |

### Attribute System Models (`\FluentCart\App\Models\*`)
- `AttributeGroup`: Attribute groups (e.g., Color, Size) (`wp_fct_atts_groups`)
- `AttributeTerm`: Attribute terms within groups (`wp_fct_atts_terms`)
- `AttributeRelation`: Object attribute relationships (`wp_fct_atts_relations`)

### Shipping & Tax Models (`\FluentCart\App\Models\*`)
- `ShippingZone`: Shipping zones (`wp_fct_shipping_zones`)
- `ShippingMethod`: Methods within zones (`wp_fct_shipping_methods`)
- `ShippingClass`: Shipping classes (`wp_fct_shipping_classes`)
- `TaxClass`: Tax classes (`wp_fct_tax_classes`)
- `TaxRate`: Tax rate rules per region (`wp_fct_tax_rates`)

### Label System Models (`\FluentCart\App\Models\*`)
- `Label`: Tagging and labeling system (`wp_fct_label`)
- `LabelRelationship`: Polymorphic label relations (`wp_fct_label_relationships`)

### Pro Plugin Models (`\FluentCartPro\App\Models\*`)
- `License`: License key management (`wp_fct_licenses`)
- `LicenseMeta`: License metadata (`wp_fct_license_meta`)
- `LicenseActivation`: Activation counts & hashes (`wp_fct_license_activations`)
- `LicenseSite`: Licensed domain URLs (`wp_fct_license_sites`)
- `OrderPromotion`: Order bump & promotional rules (`wp_fct_order_promotions`)
- `OrderPromotionStat`: Promotion conversion statistics (`wp_fct_order_promotion_stats`)
- `UserMeta`: Extended user metadata
