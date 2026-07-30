# Action Hooks: Orders

All hooks related to order lifecycle, status transitions, payments, shipping, refunds, and order items. These action hooks allow you to respond to key order events in FluentCart.

Each hook passes an associative array as its single parameter. The order value is always an `\FluentCart\App\Models\Order` model instance with the `customer`, `shipping_address`, and `billing_address` relationships eager-loaded (unless noted otherwise).

Amounts are in cents. All monetary values (`total`, `refunded_amount`, etc.) are stored as integers in the smallest currency unit. Use `Helper::toDecimal($amount)` to convert for display.

---

## Order Status Changes
Fired when the order status field changes (e.g. `processing` → `completed`). Both a dynamic, status-specific hook and a generic hook fire on every change.

### `order_status_changed_to_{status}`
`fluent_cart/order_status_changed_to_{$newStatus}` — Fires when the order status changes to a specific status

* **When it runs:** Fires inside `OrderStatusUpdated::afterDispatch()` whenever the order status type transitions to a new value. The `{$newStatus}` portion is replaced dynamically with the target status, so you can listen for a single status you care about.
* **Available dynamic variants:** `completed`, `canceled`, `processing`, `on-hold`, `failed`
* **Source:** `app/Events/Order/OrderStatusUpdated.php` (line 91)

#### Parameters:
`$data` *(array)*: Order status change data
```php
$data = [
    'order'       => $order,       // \FluentCart\App\Models\Order (with customer, addresses loaded)
    'old_status'  => 'processing', // Previous order status string
    'new_status'  => 'completed',  // New order status string (matches the dynamic suffix)
    'manageStock' => true,         // Whether stock management should be applied
    'activity'    => [             // Optional activity log context
        'title'   => '',
        'content' => '',
    ],
];
```

#### Usage Example:
```php
// Hook into order status change to 'completed'
add_action('fluent_cart/order_status_changed_to_completed', function ($data) {
    // Extract order model from event data
    $order = $data['order'];
    // Grant digital access when order completes
    grant_digital_access($order->customer_id, $order->id);
}, 10, 1);
```

---

### `order_status_changed`
`fluent_cart/order_status_changed` — Fires on any order status change

* **When it runs:** Fires immediately after the dynamic `order_status_changed_to_{$newStatus}` hook, on every order status transition regardless of the target status. Use this when you need to react to all status changes in a single callback.
* **Source:** `app/Events/Order/OrderStatusUpdated.php` (line 92)

#### Parameters:
`$data` *(array)*: Order status change data
```php
$data = [
    'order'       => $order,       // \FluentCart\App\Models\Order
    'old_status'  => 'processing', // Previous order status
    'new_status'  => 'completed',  // New order status
    'manageStock' => true,         // Whether stock management applies
    'activity'    => [
        'title'   => '',
        'content' => '',
    ],
];
```

#### Usage Example:
```php
// Hook into any order status change
add_action('fluent_cart/order_status_changed', function ($data) {
    // Extract order model from event data
    $order = $data['order'];
    // Log every status transition into FluentCart logs
    fluent_cart_add_log(
        'Order status changed',
        sprintf('Order #%d: %s -> %s', $order->id, $data['old_status'], $data['new_status']),
        'info'
    );
}, 10, 1);
```

---

## Payment Status Changes
Fired when the payment status field changes (e.g. `pending` → `paid`). Both a dynamic, status-specific hook and a generic hook fire on every change.

### `payment_status_changed_to_{status}`
`fluent_cart/payment_status_changed_to_{$newStatus}` — Fires when payment status changes to a specific status

* **When it runs:** Fires inside `OrderStatusUpdated::afterDispatch()` when the status change type is `payment_status`. The `{$newStatus}` suffix is replaced dynamically so you can target a single payment state.
* **Available dynamic variants:** `pending`, `paid`, `partially_paid`, `failed`, `refunded`, `partially_refunded`, `authorized`
* **Source:** `app/Events/Order/OrderStatusUpdated.php` (line 81)

#### Parameters:
`$data` *(array)*: Payment status change data
```php
$data = [
    'order'       => $order,     // \FluentCart\App\Models\Order
    'old_status'  => 'pending',  // Previous payment status
    'new_status'  => 'paid',     // New payment status (matches the dynamic suffix)
    'manageStock' => true,       // Whether stock management applies
    'activity'    => [
        'title'   => '',
        'content' => '',
    ],
];
```

#### Usage Example:
```php
// Hook into payment status change to 'paid'
add_action('fluent_cart/payment_status_changed_to_paid', function ($data) {
    // Extract order model from event data
    $order = $data['order'];
    // Trigger fulfillment workflow when payment is confirmed
    do_action('my_custom_fulfillment_start', $order->id);
}, 10, 1);
```

---

### `payment_status_changed`
`fluent_cart/payment_status_changed` — Fires on any payment status change

* **When it runs:** Fires immediately after the dynamic `payment_status_changed_to_{$newStatus}` hook, on every payment status transition. Use this when you need a single callback for all payment status changes.
* **Source:** `app/Events/Order/OrderStatusUpdated.php` (line 82)

#### Parameters:
`$data` *(array)*: Payment status change data
```php
$data = [
    'order'       => $order,     // \FluentCart\App\Models\Order
    'old_status'  => 'pending',  // Previous payment status
    'new_status'  => 'paid',     // New payment status
    'manageStock' => true,       // Whether stock management applies
    'activity'    => [
        'title'   => '',
        'content' => '',
    ],
];
```

#### Usage Example:
```php
// Hook into any payment status change
add_action('fluent_cart/payment_status_changed', function ($data) {
    // Extract order model from event data
    $order = $data['order'];
    // Send payment status update notification email if paid
    if ($data['new_status'] === 'paid') {
        wp_mail($order->customer->email, 'Payment Confirmed', 'Your payment has been received.');
    }
}, 10, 1);
```

---

## Shipping Status Changes
Fired when the shipping status field changes (e.g. `unshipped` → `shipped`). Both a dynamic, status-specific hook and a generic hook fire on every change.

### `shipping_status_changed_to_{status}`
`fluent_cart/shipping_status_changed_to_{$newStatus}` — Fires when shipping status changes to a specific status

* **When it runs:** Fires inside `OrderStatusUpdated::afterDispatch()` when the status change type is `shipping_status`. The `{$newStatus}` suffix is replaced dynamically so you can target a single shipping state.
* **Available dynamic variants:** `unshipped`, `shipped`, `delivered`, `unshippable`
* **Source:** `app/Events/Order/OrderStatusUpdated.php` (line 86)

#### Parameters:
`$data` *(array)*: Shipping status change data
```php
$data = [
    'order'       => $order,      // \FluentCart\App\Models\Order
    'old_status'  => 'unshipped', // Previous shipping status
    'new_status'  => 'shipped',   // New shipping status (matches the dynamic suffix)
    'manageStock' => true,        // Whether stock management applies
    'activity'    => [
        'title'   => '',
        'content' => '',
    ],
];
```

#### Usage Example:
```php
// Hook into shipping status change to 'shipped'
add_action('fluent_cart/shipping_status_changed_to_shipped', function ($data) {
    // Extract order model from event data
    $order = $data['order'];
    // Notify customer that their order has shipped via email
    wp_mail(
        $order->customer->email,
        'Your Order Has Shipped!',
        sprintf('Order #%d has been shipped.', $order->id)
    );
}, 10, 1);
```

---

### `shipping_status_changed`
`fluent_cart/shipping_status_changed` — Fires on any shipping status change

* **When it runs:** Fires immediately after the dynamic `shipping_status_changed_to_{$newStatus}` hook, on every shipping status transition. Use this when you need a single callback for all shipping status changes.
* **Source:** `app/Events/Order/OrderStatusUpdated.php` (line 87)

#### Parameters:
`$data` *(array)*: Shipping status change data
```php
$data = [
    'order'       => $order,      // \FluentCart\App\Models\Order
    'old_status'  => 'unshipped', // Previous shipping status
    'new_status'  => 'shipped',   // New shipping status
    'manageStock' => true,        // Whether stock management applies
    'activity'    => [
        'title'   => '',
        'content' => '',
    ],
];
```

#### Usage Example:
```php
// Hook into any shipping status change
add_action('fluent_cart/shipping_status_changed', function ($data) {
    // Extract order model from event data
    $order = $data['order'];
    // Log all shipping status transitions in system logs
    fluent_cart_add_log(
        'Shipping status changed',
        sprintf('Order #%d: %s -> %s', $order->id, $data['old_status'], $data['new_status']),
        'info'
    );
}, 10, 1);
```

---

## Refunds
Fired during the refund flow after transaction records have been created. The generic `order_refunded` hook fires on every refund, followed by either `order_fully_refunded` or `order_partially_refunded` depending on the refund type. Refund data includes the Order, OrderItem, OrderTransaction, and Customer models.

### `order_refunded`
`fluent_cart/order_refunded` — Fires after any refund (full or partial)

* **When it runs:** Fires inside `OrderRefund::afterDispatch()` after a refund transaction is recorded and the refund amount is calculated. This hook fires for both full and partial refunds. It fires before the type-specific hooks below.
* **Source:** `app/Events/Order/OrderRefund.php` (line 141)

#### Parameters:
`$data` *(array)*: Refund data
```php
$data = [
    'order'              => $order,          // \FluentCart\App\Models\Order
    'refunded_items'     => [],              // Array of OrderItem models (looked up from refundedItemIds)
    'new_refunded_items' => [],              // Raw refunded items array with restore_quantity info
    'refunded_amount'    => 5000,            // Newly refunded amount in cents
    'manage_stock'       => true,            // Whether stock should be restored
    'transaction'        => $transaction,    // \FluentCart\App\Models\OrderTransaction (the refund transaction)
    'customer'           => $customer,       // \FluentCart\App\Models\Customer
    'type'               => 'full',          // 'full' or 'partial'
];
```

#### Usage Example:
```php
// Hook into any order refund event (full or partial)
add_action('fluent_cart/order_refunded', function ($data) {
    // Extract order model and calculate formatted decimal refund amount
    $order = $data['order'];
    $amount = \FluentCart\App\Helpers\Helper::toDecimal($data['refunded_amount']);
    // Notify admin of any processed refund
    wp_mail(
        get_option('admin_email'),
        sprintf('Refund on Order #%d', $order->id),
        sprintf('A %s refund of %s has been processed.', $data['type'], $amount)
    );
}, 10, 1);
```

---

### `order_fully_refunded`
`fluent_cart/order_fully_refunded` — Fires only when an order is fully refunded

* **When it runs:** Fires inside `OrderRefund::afterDispatch()` immediately after the generic `order_refunded` hook, but only when the total refunded amount meets or exceeds the order's total paid amount (i.e. full refund).
* **Source:** `app/Events/Order/OrderRefund.php` (line 144)

#### Parameters:
`$data` *(array)*: Full refund data (identical structure to `order_refunded`)
```php
$data = [
    'order'              => $order,          // \FluentCart\App\Models\Order
    'refunded_items'     => [],              // Array of OrderItem models
    'new_refunded_items' => [],              // Raw refunded items with restore_quantity
    'refunded_amount'    => 10000,           // Refunded amount in cents
    'manage_stock'       => true,            // Whether stock should be restored
    'transaction'        => $transaction,    // \FluentCart\App\Models\OrderTransaction
    'customer'           => $customer,       // \FluentCart\App\Models\Customer
    'type'               => 'full',          // Always 'full' for this hook
];
```

#### Usage Example:
```php
// Hook into full order refund event
add_action('fluent_cart/order_fully_refunded', function ($data) {
    // Extract order model from event data
    $order = $data['order'];
    // Revoke digital access on full refund
    update_user_meta($order->customer_id, 'membership_active', false);
}, 10, 1);
```

---

### `order_partially_refunded`
`fluent_cart/order_partially_refunded` — Fires only when an order is partially refunded

* **When it runs:** Fires inside `OrderRefund::afterDispatch()` immediately after the generic `order_refunded` hook, but only when the total refunded amount is less than the order's total paid amount (i.e. partial refund).
* **Source:** `app/Events/Order/OrderRefund.php` (line 146)

#### Parameters:
`$data` *(array)*: Partial refund data (identical structure to `order_refunded`)
```php
$data = [
    'order'              => $order,          // \FluentCart\App\Models\Order
    'refunded_items'     => [],              // Array of OrderItem models
    'new_refunded_items' => [],              // Raw refunded items with restore_quantity
    'refunded_amount'    => 3000,            // Refunded amount in cents
    'manage_stock'       => true,            // Whether stock should be restored
    'transaction'        => $transaction,    // \FluentCart\App\Models\OrderTransaction
    'customer'           => $customer,       // \FluentCart\App\Models\Customer
    'type'               => 'partial',       // Always 'partial' for this hook
];
```

#### Usage Example:
```php
// Hook into partial order refund event
add_action('fluent_cart/order_partially_refunded', function ($data) {
    // Extract order and customer models from event data
    $order = $data['order'];
    $customer = $data['customer'];
    // Notify customer of partial refund via email
    wp_mail(
        $customer->email,
        'Partial Refund Processed',
        sprintf('A partial refund has been issued for Order #%d.', $order->id)
    );
}, 10, 1);
```

---

## Order Items
Hooks that fire when custom line items on an order are being deleted. These are useful for cleanup or audit logging on custom `OrderItem` records.

### `order/before_custom_items_deleted`
`fluent_cart/order/before_custom_items_deleted` — Fires before custom line items are deleted

* **When it runs:** Fires inside `OrderResource::updateOrderItems()` just before custom order items (flagged as `is_custom`) are permanently deleted from the database. Only fires if the filtered collection of custom items is not empty.
* **Source:** `api/Resource/OrderResource.php` (line 535)

#### Parameters:
* `$customItems` *(\Illuminate\Support\Collection)*: Collection of `\FluentCart\App\Models\OrderItem` models about to be deleted (only items where `is_custom` is `true`)
* `$order` *(\FluentCart\App\Models\Order)*: The parent order model

#### Usage Example:
```php
// Hook before custom order items are deleted
add_action('fluent_cart/order/before_custom_items_deleted', function ($customItems, $order) {
    // Archive custom items before they are removed from the database
    foreach ($customItems as $item) {
        fluent_cart_add_log(
            'Custom item removed',
            sprintf('Item "%s" removed from Order #%d', $item->title, $order->id),
            'info'
        );
    }
}, 10, 2);
```

---

### `order/after_custom_items_deleted`
`fluent_cart/order/after_custom_items_deleted` — Fires after custom line items are deleted

* **When it runs:** Fires inside `OrderResource::updateOrderItems()` immediately after custom order items have been permanently deleted from the database. The collection still holds the model instances (now removed from DB). Only fires if the collection is not empty.
* **Source:** `api/Resource/OrderResource.php` (line 541)

#### Parameters:
* `$customItems` *(\Illuminate\Support\Collection)*: Collection of `\FluentCart\App\Models\OrderItem` models that were just deleted
* `$order` *(\FluentCart\App\Models\Order)*: The parent order model

#### Usage Example:
```php
// Hook after custom order items are deleted
add_action('fluent_cart/order/after_custom_items_deleted', function ($customItems, $order) {
    // Recalculate order totals after custom items are removed
    $order->recalculateTotals();
}, 10, 2);
```

---

## Order Lifecycle
General lifecycle hooks that fire at key moments during an Order's existence: invoice generation, Customer changes, payment completion, license generation, and receipt viewing.

### `order/invoice_number_added`
`fluent_cart/order/invoice_number_added` — Fires after an invoice/receipt number is assigned to an order

* **When it runs:** Fires in two places:
  1. Inside the `Order::booted()` created callback, immediately after a new order is persisted to the database with an invoice number already set (when payment status is `paid` at creation time).
  2. Inside `Order::generateReceiptNumber()`, when a receipt number is generated for an existing order that did not previously have one.
* **Source:** `app/Models/Order.php` (lines 60 and 734)

#### Parameters:
`$data` *(array)*: Order data
```php
$data = [
    'order' => $order, // \FluentCart\App\Models\Order
];
```

#### Usage Example:
```php
// Hook when invoice/receipt number is assigned to an order
add_action('fluent_cart/order/invoice_number_added', function ($data) {
    // Extract order model from event data
    $order = $data['order'];
    // Sync invoice number to external accounting system
    sync_to_accounting($order->id, $order->invoice_no, $order->receipt_number);
}, 10, 1);
```

---

### `order_customer_changed`
`fluent_cart/order_customer_changed` — Fires when the customer assigned to an order changes

* **When it runs:** Fires inside `OrderController::changeCustomer()` after the order (and any child orders and subscriptions) have been reassigned to a new customer, and both the old and new customer stats have been recounted.
* **Source:** `app/Http/Controllers/OrderController.php` (line 427)

#### Parameters:
`$data` *(array)*: Customer change data
```php
$data = [
    'order'               => $order,        // \FluentCart\App\Models\Order
    'old_customer'        => $oldCustomer,  // \FluentCart\App\Models\Customer|null
    'new_customer'        => $newCustomer,  // \FluentCart\App\Models\Customer
    'connected_order_ids' => [123, 124],    // Array of all order IDs updated (parent + children)
];
```

#### Usage Example:
```php
// Hook when the customer assigned to an order changes
add_action('fluent_cart/order_customer_changed', function ($data) {
    // Extract order and customer models from event data
    $order = $data['order'];
    $oldCustomer = $data['old_customer'];
    $newCustomer = $data['new_customer'];
    // Notify the new customer about the order account transfer
    wp_mail(
        $newCustomer->email,
        'Order Transferred to Your Account',
        sprintf('Order #%d has been assigned to your account.', $order->id)
    );
}, 10, 1);
```

---

### `order/generateMissingLicenses`
`fluent_cart/order/generateMissingLicenses` — Fires when an admin triggers license generation for an order

* **When it runs:** Fires inside `OrderController::generateLicense()` when an admin requests license generation for an order that has fewer licenses than expected. This allows license modules to hook in and create the missing license keys.
* **Source:** `app/Http/Controllers/OrderController.php` (line 225)

#### Parameters:
`$data` *(array)*: Order data
```php
$data = [
    'order' => $order, // \FluentCart\App\Models\Order (with order_items and licenses loaded)
];
```

#### Usage Example:
```php
// Hook when admin requests missing license generation for an order
add_action('fluent_cart/order/generateMissingLicenses', function ($data) {
    // Extract order model from event data
    $order = $data['order'];
    // Generate licenses for each eligible order item
    foreach ($order->order_items as $item) {
        generate_license_key($order->id, $item->product_id);
    }
}, 10, 1);
```

---

### `order_placed_offline`
`fluent_cart/order_placed_offline` — Fires when an order is placed via Cash on Delivery or other offline payment

* **When it runs:** Fires inside `CodHandler::processPayment()` after the order and its transaction have been created for an offline/COD payment. The Order, Customer, and transaction data are all available at this point. The order has its `customer`, `shipping_address`, and `billing_address` relationships loaded.
* **Source:** `app/Modules/PaymentMethods/Cod/CodHandler.php` (line 55)

#### Parameters:
`$data` *(array)*: Offline order data
```php
$data = [
    'order'       => $order,                  // \FluentCart\App\Models\Order
    'customer'    => $order->customer ?? [],   // \FluentCart\App\Models\Customer or empty array
    'transaction' => $transaction ?? [],        // \FluentCart\App\Models\OrderTransaction or empty array
];
```

#### Usage Example:
```php
// Hook when an order is placed via Cash on Delivery or offline payment
add_action('fluent_cart/order_placed_offline', function ($data) {
    // Extract order model from event data
    $order = $data['order'];
    // Notify warehouse of new COD order
    wp_mail(
        'warehouse@example.com',
        sprintf('New COD Order #%d', $order->id),
        'A new Cash on Delivery order needs to be prepared for shipment.'
    );
}, 10, 1);
```

---

### `order_paid_done`
`fluent_cart/order_paid_done` — Main lifecycle hook when order payment completes (recommended for integrations)

* **When it runs:** Fires asynchronously via Action Scheduler after an order's payment is confirmed as paid. The `OrderPaid` event enqueues a `fluent_cart/order_paid_ansyc_private_handle` async action, which validates the order is still paid, then dispatches this hook. This is the recommended hook for third-party integrations because it runs outside the payment gateway request cycle, avoiding race conditions and timeouts. For subscription or renewal orders, the associated Subscription model is included in the data.
* **Note:** The `subscription` key is only present when the order type is subscription or renewal.
* **Source:** `app/Hooks/actions.php` (line 159)

#### Parameters:
`$data` *(array)*: Order payment completion data
```php
$data = [
    'order'        => $order,        // \FluentCart\App\Models\Order
    'transaction'  => $transaction,  // \FluentCart\App\Models\OrderTransaction (latest successful transaction)
    'customer'     => $customer,     // \FluentCart\App\Models\Customer
    'subscription' => $subscription, // \FluentCart\App\Models\Subscription (only for subscription/renewal orders)
];
```

#### Usage Example:
```php
// Main lifecycle hook when order payment completes (recommended for integrations)
add_action('fluent_cart/order_paid_done', function ($data) {
    // Extract order and customer models from event data
    $order = $data['order'];
    $customer = $data['customer'];

    // Grant membership access after payment
    update_user_meta($customer->user_id, 'membership_active', true);

    // Handle subscription orders differently if subscription instance exists
    if (!empty($data['subscription'])) {
        $subscription = $data['subscription'];
        update_user_meta($customer->user_id, 'subscription_id', $subscription->id);
    }
}, 10, 1);
```

---

### `order_paid_ansyc_private_handle`
`fluent_cart/order_paid_ansyc_private_handle` — Internal async handler that processes post-payment integrations

* **When it runs:** Enqueued by `OrderPaid::afterDispatch()` as an Action Scheduler async action. The handler in `app/Hooks/actions.php` validates the order, clears the scheduler meta, and then dispatches `fluent_cart/order_paid_done`. It is also dispatched manually in `IntegrationEventListener` for retry scenarios. You should generally hook into `order_paid_done` instead of this hook.
* **Source:** `app/Listeners/IntegrationEventListener.php` (line 360), `app/Hooks/actions.php` (line 126)

#### Parameters:
`$data` *(array)*: Order identifier
```php
$data = [
    'order_id' => 123, // int: The order ID to process
];
```

#### Usage Example:
```php
// Internal async handler (Not recommended for third-party use; use fluent_cart/order_paid_done instead)
add_action('fluent_cart/order_paid_ansyc_private_handle', function ($data) {
    // Extract order ID from event data
    $orderId = $data['order_id'];
    // Internal processing only
}, 10, 1);
```

---

### `order/receipt_viewed`
`fluent_cart/order/receipt_viewed` — Fires the first time a customer views their order receipt

* **When it runs:** Fires at the end of receipt rendering (both the `ReceiptRenderer` class and the `receipt_slip.php` view template) when the `$is_first_time` flag is `true`. This means it only fires once per order, the very first time the receipt page is loaded. Subsequent views do not trigger this hook. The data includes both the Order and OrderOperation models.
* **Source:** `app/Services/Renderer/Receipt/ReceiptRenderer.php` (line 151), `app/Views/invoice/receipt_slip.php` (line 482)

#### Parameters:
`$data` *(array)*: Receipt view data
```php
$data = [
    'order'           => $order,           // \FluentCart\App\Models\Order
    'order_operation' => $order_operation,  // \FluentCart\App\Models\OrderOperation
];
```

#### Usage Example:
```php
// Hook when customer views their order receipt for the first time
add_action('fluent_cart/order/receipt_viewed', function ($data) {
    // Extract order model from event data
    $order = $data['order'];
    // Track receipt view for analytics logging
    fluent_cart_add_log(
        'Receipt viewed',
        sprintf('Customer viewed receipt for Order #%d', $order->id),
        'info',
        ['module_name' => 'order', 'module_id' => $order->id]
    );
}, 10, 1);
```
