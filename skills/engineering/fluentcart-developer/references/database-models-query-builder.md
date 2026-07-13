# Database Models & Query Builder

FluentCart uses an Eloquent-based ORM (compatible with Laravel's Query Builder and Eloquent ORM). This makes database CRUD operations, filtering, and relationship loading highly readable and clean.

For a complete and exhaustive attribute-by-attribute documentation of all 30+ database models, see:
- [Exhaustive Database Models Reference](database-models-reference.md) — Comprehensive guide on Order, OrderItem, Customer, Product, Subscription, Shipping/Tax, and Pro license models.

---


## 1. Core Data Models

The following Eloquent models are located under the namespace `\FluentCart\App\Models\`:

| Class Name | Target Database Table | Description |
|---|---|---|
| `Order` | `{$wpdb->prefix}fc_orders` | Represents custom sales orders, containing totals, billing/shipping address IDs, and status flags. |
| `OrderItem` | `{$wpdb->prefix}fc_order_items` | Individual product items/lines associated with a specific order. |
| `Customer` | `{$wpdb->prefix}fc_customers` | Stores buyer contact details, total lifetime spend, and WordPress user ID mapping. |
| `Product` | `{$wpdb->prefix}fc_products` | Store inventory items, pricing models, settings, and download permissions. |
| `Subscription` | `{$wpdb->prefix}fc_subscriptions` | Handles recurring subscriptions, next renewal timestamps, billing cycles, and status. |

---

## 2. Eloquent CRUD Examples

### Retrieving Records

```php
use FluentCart\App\Models\Order;
use FluentCart\App\Models\Customer;

// Find a single order by its primary database ID
$order = Order::find(123);

if ($order) {
    // Access order attributes directly
    $orderStatus = $order->status;
    $totalInCents = $order->total;
}

// Retrieve customer records matching specific email domain
$gmailCustomers = Customer::where('email', 'LIKE', '%@gmail.com')
    ->orderBy('created_at', 'DESC')
    ->limit(10)
    ->get(); // Returns an Eloquent Collection
```

### Creating & Updating Records

```php
use FluentCart\App\Models\Customer;

// Create a new customer record in the database
$newCustomer = Customer::create([
    'first_name' => 'John',
    'last_name'  => 'Doe',
    'email'      => 'john.doe@example.com',
    'user_id'    => get_current_user_id(), // Map to active WordPress user ID
]);

// Update an existing customer record
$customer = Customer::find($newCustomer->id);
if ($customer) {
    $customer->last_name = 'Smith';
    $customer->save(); // Persists changes to the database
}
```

---

## 3. Eager Loading Relationships

Eager loading prevents N+1 query execution problems by pre-fetching related data models using database joins in a single query.

```php
use FluentCart\App\Models\Order;

// Eager load customer data and item lines along with the order
$orders = Order::with(['customer', 'order_items'])
    ->where('status', 'completed')
    ->limit(5)
    ->get();

foreach ($orders as $order) {
    // Access eager-loaded customer details directly without hitting the database again
    $customerEmail = $order->customer->email;

    foreach ($order->order_items as $item) {
        // Access item details
        $itemName = $item->title;
    }
}
```

---

## 4. Query Builder Operations

You can run direct Laravel-style fluent query operations for advanced joins, aggregation, and custom filters.

```php
use FluentCart\App\Models\Order;

// Calculate total revenue generated from completed credit card payments
$totalRevenue = Order::where('status', 'completed')
    ->where('payment_method', 'stripe')
    ->sum('total'); // Sums the 'total' field in cents

// Complex query using joins and whereIn filters
$activeSubscribers = Order::query()
    ->join('fc_customers', 'fc_orders.customer_id', '=', 'fc_customers.id')
    ->whereIn('fc_orders.status', ['processing', 'completed'])
    ->select('fc_customers.email', 'fc_orders.total', 'fc_orders.created_at')
    ->get();
```
