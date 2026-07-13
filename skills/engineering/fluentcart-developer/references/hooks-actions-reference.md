# Action Hooks Reference

This reference contains all FluentCart actions details scraped from the developer documentation site.

## Orders

Source: https://dev.fluentcart.com/hooks/actions/orders.html


All hooks related to order lifecycle, status transitions, payments, shipping, refunds, and order items. These action hooks allow you to respond to key order events in FluentCart.
Each hook passes an associative array as its single parameter. The `order` value is always an [`\FluentCart\App\Models\Order`](https://dev.fluentcart.com/database/models/order.html) model instance with the [`customer`](https://dev.fluentcart.com/database/models/customer.html), `shipping_address`, and `billing_address` relationships eager-loaded (unless noted otherwise).
**Amounts are in cents.** All monetary values (`total`, `refunded_amount`, etc.) are stored as integers in the smallest currency unit. Use `Helper::toDecimal($amount)` to convert for display.
## Order Status Changes [](#order-status-changes)

Fired when the **order status** field changes (e.g. `processing` → `completed`). Both a dynamic, status-specific hook and a generic hook fire on every change.
### ` order_status_changed_to_{status} ` [](#order-status-changed-to-status)
`fluent_cart/order_status_changed_to_{$newStatus}` — Fires when the order status changes to a specific status
**When it runs:** Fires inside `OrderStatusUpdated::afterDispatch()` whenever the order status type transitions to a new value. The `{$newStatus}` portion is replaced dynamically with the target status, so you can listen for a single status you care about.
**Available dynamic variants:** `completed`, `canceled`, `processing`, `on-hold`, `failed`
**Parameters:**

- `$data` (array): Order status change dataphp
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order (with customer, addresses loaded)
 'old_status' => 'processing', // Previous order status string
 'new_status' => 'completed', // New order status string (matches the dynamic suffix)
 'manageStock' => true, // Whether stock management should be applied
 'activity' => [ // Optional activity log context
 'title' => '',
 'content' => '',
 ],
];```

**Source:** `app/Events/Order/OrderStatusUpdated.php` (line 91)
**Usage:**php
```
add_action('fluent_cart/order_status_changed_to_completed', function ($data) {
 $order = $data['order'];
 // Grant digital access when order completes
 grant_digital_access($order->customer_id, $order->id);
}, 10, 1);```

### ` order_status_changed ` [](#order-status-changed)
`fluent_cart/order_status_changed` — Fires on any order status change
**When it runs:** Fires immediately after the dynamic `order_status_changed_to_{$newStatus}` hook, on every order status transition regardless of the target status. Use this when you need to react to all status changes in a single callback.
**Parameters:**

- `$data` (array): Order status change dataphp
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order
 'old_status' => 'processing', // Previous order status
 'new_status' => 'completed', // New order status
 'manageStock' => true, // Whether stock management applies
 'activity' => [
 'title' => '',
 'content' => '',
 ],
];```

**Source:** `app/Events/Order/OrderStatusUpdated.php` (line 92)
**Usage:**php
```
add_action('fluent_cart/order_status_changed', function ($data) {
 $order = $data['order'];
 // Log every status transition
 fluent_cart_add_log(
 'Order status changed',
 sprintf('Order #%d: %s -> %s', $order->id, $data['old_status'], $data['new_status']),
 'info'
 );
}, 10, 1);```

## Payment Status Changes [](#payment-status-changes)

Fired when the **payment status** field changes (e.g. `pending` → `paid`). Both a dynamic, status-specific hook and a generic hook fire on every change.
### ` payment_status_changed_to_{status} ` [](#payment-status-changed-to-status)
`fluent_cart/payment_status_changed_to_{$newStatus}` — Fires when payment status changes to a specific status
**When it runs:** Fires inside `OrderStatusUpdated::afterDispatch()` when the status change type is `payment_status`. The `{$newStatus}` suffix is replaced dynamically so you can target a single payment state.
**Available dynamic variants:** `pending`, `paid`, `partially_paid`, `failed`, `refunded`, `partially_refunded`, `authorized`
**Parameters:**

- `$data` (array): Payment status change dataphp
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order
 'old_status' => 'pending', // Previous payment status
 'new_status' => 'paid', // New payment status (matches the dynamic suffix)
 'manageStock' => true, // Whether stock management applies
 'activity' => [
 'title' => '',
 'content' => '',
 ],
];```

**Source:** `app/Events/Order/OrderStatusUpdated.php` (line 81)
**Usage:**php
```
add_action('fluent_cart/payment_status_changed_to_paid', function ($data) {
 $order = $data['order'];
 // Trigger fulfillment workflow when payment is confirmed
 do_action('my_custom_fulfillment_start', $order->id);
}, 10, 1);```

### ` payment_status_changed ` [](#payment-status-changed)
`fluent_cart/payment_status_changed` — Fires on any payment status change
**When it runs:** Fires immediately after the dynamic `payment_status_changed_to_{$newStatus}` hook, on every payment status transition. Use this when you need a single callback for all payment status changes.
**Parameters:**

- `$data` (array): Payment status change dataphp
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order
 'old_status' => 'pending', // Previous payment status
 'new_status' => 'paid', // New payment status
 'manageStock' => true, // Whether stock management applies
 'activity' => [
 'title' => '',
 'content' => '',
 ],
];```

**Source:** `app/Events/Order/OrderStatusUpdated.php` (line 82)
**Usage:**php
```
add_action('fluent_cart/payment_status_changed', function ($data) {
 $order = $data['order'];
 // Send payment status update notification
 if ($data['new_status'] === 'paid') {
 wp_mail($order->customer->email, 'Payment Confirmed', 'Your payment has been received.');
 }
}, 10, 1);```

## Shipping Status Changes [](#shipping-status-changes)

Fired when the **shipping status** field changes (e.g. `unshipped` → `shipped`). Both a dynamic, status-specific hook and a generic hook fire on every change.
### ` shipping_status_changed_to_{status} ` [](#shipping-status-changed-to-status)
`fluent_cart/shipping_status_changed_to_{$newStatus}` — Fires when shipping status changes to a specific status
**When it runs:** Fires inside `OrderStatusUpdated::afterDispatch()` when the status change type is `shipping_status`. The `{$newStatus}` suffix is replaced dynamically so you can target a single shipping state.
**Available dynamic variants:** `unshipped`, `shipped`, `delivered`, `unshippable`
**Parameters:**

- `$data` (array): Shipping status change dataphp
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order
 'old_status' => 'unshipped', // Previous shipping status
 'new_status' => 'shipped', // New shipping status (matches the dynamic suffix)
 'manageStock' => true, // Whether stock management applies
 'activity' => [
 'title' => '',
 'content' => '',
 ],
];```

**Source:** `app/Events/Order/OrderStatusUpdated.php` (line 86)
**Usage:**php
```
add_action('fluent_cart/shipping_status_changed_to_shipped', function ($data) {
 $order = $data['order'];
 // Notify customer that their order has shipped
 wp_mail(
 $order->customer->email,
 'Your Order Has Shipped!',
 sprintf('Order #%d has been shipped.', $order->id)
 );
}, 10, 1);```

### ` shipping_status_changed ` [](#shipping-status-changed)
`fluent_cart/shipping_status_changed` — Fires on any shipping status change
**When it runs:** Fires immediately after the dynamic `shipping_status_changed_to_{$newStatus}` hook, on every shipping status transition. Use this when you need a single callback for all shipping status changes.
**Parameters:**

- `$data` (array): Shipping status change dataphp
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order
 'old_status' => 'unshipped', // Previous shipping status
 'new_status' => 'shipped', // New shipping status
 'manageStock' => true, // Whether stock management applies
 'activity' => [
 'title' => '',
 'content' => '',
 ],
];```

**Source:** `app/Events/Order/OrderStatusUpdated.php` (line 87)
**Usage:**php
```
add_action('fluent_cart/shipping_status_changed', function ($data) {
 $order = $data['order'];
 // Log all shipping status transitions
 fluent_cart_add_log(
 'Shipping status changed',
 sprintf('Order #%d: %s -> %s', $order->id, $data['old_status'], $data['new_status']),
 'info'
 );
}, 10, 1);```

## Refunds [](#refunds)

Fired during the refund flow after transaction records have been created. The generic `order_refunded` hook fires on every refund, followed by either `order_fully_refunded` or `order_partially_refunded` depending on the refund type. Refund data includes the [Order](https://dev.fluentcart.com/database/models/order.html), [OrderItem](https://dev.fluentcart.com/database/models/order-item.html), [OrderTransaction](https://dev.fluentcart.com/database/models/order-transaction.html), and [Customer](https://dev.fluentcart.com/database/models/customer.html) models.
### ` order_refunded ` [](#order-refunded)
`fluent_cart/order_refunded` — Fires after any refund (full or partial)
**When it runs:** Fires inside `OrderRefund::afterDispatch()` after a refund transaction is recorded and the refund amount is calculated. This hook fires for both full and partial refunds. It fires before the type-specific hooks below.
**Parameters:**

- `$data` (array): Refund dataphp
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order
 'refunded_items' => [], // Array of OrderItem models (looked up from refundedItemIds)
 'new_refunded_items' => [], // Raw refunded items array with restore_quantity info
 'refunded_amount' => 5000, // Newly refunded amount in cents
 'manage_stock' => true, // Whether stock should be restored
 'transaction' => $transaction, // \FluentCart\App\Models\OrderTransaction (the refund transaction)
 'customer' => $customer, // \FluentCart\App\Models\Customer
 'type' => 'full', // 'full' or 'partial'
];```

**Source:** `app/Events/Order/OrderRefund.php` (line 141)
**Usage:**php
```
add_action('fluent_cart/order_refunded', function ($data) {
 $order = $data['order'];
 $amount = \FluentCart\App\Helpers\Helper::toDecimal($data['refunded_amount']);
 // Notify admin of any refund
 wp_mail(
 get_option('admin_email'),
 sprintf('Refund on Order #%d', $order->id),
 sprintf('A %s refund of %s has been processed.', $data['type'], $amount)
 );
}, 10, 1);```

### ` order_fully_refunded ` [](#order-fully-refunded)
`fluent_cart/order_fully_refunded` — Fires only when an order is fully refunded
**When it runs:** Fires inside `OrderRefund::afterDispatch()` immediately after the generic `order_refunded` hook, but only when the total refunded amount meets or exceeds the order's total paid amount (i.e. full refund).
**Parameters:**

- `$data` (array): Full refund data (identical structure to `order_refunded`)php
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order
 'refunded_items' => [], // Array of OrderItem models
 'new_refunded_items' => [], // Raw refunded items with restore_quantity
 'refunded_amount' => 10000, // Refunded amount in cents
 'manage_stock' => true, // Whether stock should be restored
 'transaction' => $transaction, // \FluentCart\App\Models\OrderTransaction
 'customer' => $customer, // \FluentCart\App\Models\Customer
 'type' => 'full', // Always 'full' for this hook
];```

**Source:** `app/Events/Order/OrderRefund.php` (line 144)
**Usage:**php
```
add_action('fluent_cart/order_fully_refunded', function ($data) {
 $order = $data['order'];
 // Revoke digital access on full refund
 update_user_meta($order->customer_id, 'membership_active', false);
}, 10, 1);```

### ` order_partially_refunded ` [](#order-partially-refunded)
`fluent_cart/order_partially_refunded` — Fires only when an order is partially refunded
**When it runs:** Fires inside `OrderRefund::afterDispatch()` immediately after the generic `order_refunded` hook, but only when the total refunded amount is less than the order's total paid amount (i.e. partial refund).
**Parameters:**

- `$data` (array): Partial refund data (identical structure to `order_refunded`)php
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order
 'refunded_items' => [], // Array of OrderItem models
 'new_refunded_items' => [], // Raw refunded items with restore_quantity
 'refunded_amount' => 3000, // Refunded amount in cents
 'manage_stock' => true, // Whether stock should be restored
 'transaction' => $transaction, // \FluentCart\App\Models\OrderTransaction
 'customer' => $customer, // \FluentCart\App\Models\Customer
 'type' => 'partial', // Always 'partial' for this hook
];```

**Source:** `app/Events/Order/OrderRefund.php` (line 146)
**Usage:**php
```
add_action('fluent_cart/order_partially_refunded', function ($data) {
 $order = $data['order'];
 $customer = $data['customer'];
 // Notify customer of partial refund
 wp_mail(
 $customer->email,
 'Partial Refund Processed',
 sprintf('A partial refund has been issued for Order #%d.', $order->id)
 );
}, 10, 1);```

## Order Items [](#order-items)

Hooks that fire when custom line items on an order are being deleted. These are useful for cleanup or audit logging on custom [OrderItem](https://dev.fluentcart.com/database/models/order-item.html) records.
### ` order/before_custom_items_deleted ` [](#order-before-custom-items-deleted)
`fluent_cart/order/before_custom_items_deleted` — Fires before custom line items are deleted
**When it runs:** Fires inside `OrderResource::updateOrderItems()` just before custom order items (flagged as `is_custom`) are permanently deleted from the database. Only fires if the filtered collection of custom items is not empty.
**Parameters:**

- `$customItems` (\Illuminate\Support\Collection): Collection of [`\FluentCart\App\Models\OrderItem`](https://dev.fluentcart.com/database/models/order-item.html) models about to be deleted (only items where `is_custom` is true)
- `$order` ([`\FluentCart\App\Models\Order`](https://dev.fluentcart.com/database/models/order.html)): The parent order model

**Source:** `api/Resource/OrderResource.php` (line 535)
**Usage:**php
```
add_action('fluent_cart/order/before_custom_items_deleted', function ($customItems, $order) {
 // Archive custom items before they are removed
 foreach ($customItems as $item) {
 fluent_cart_add_log(
 'Custom item removed',
 sprintf('Item "%s" removed from Order #%d', $item->title, $order->id),
 'info'
 );
 }
}, 10, 2);```

### ` order/after_custom_items_deleted ` [](#order-after-custom-items-deleted)
`fluent_cart/order/after_custom_items_deleted` — Fires after custom line items are deleted
**When it runs:** Fires inside `OrderResource::updateOrderItems()` immediately after custom order items have been permanently deleted from the database. The collection still holds the model instances (now removed from DB). Only fires if the collection is not empty.
**Parameters:**

- `$customItems` (\Illuminate\Support\Collection): Collection of [`\FluentCart\App\Models\OrderItem`](https://dev.fluentcart.com/database/models/order-item.html) models that were just deleted
- `$order` ([`\FluentCart\App\Models\Order`](https://dev.fluentcart.com/database/models/order.html)): The parent order model

**Source:** `api/Resource/OrderResource.php` (line 541)
**Usage:**php
```
add_action('fluent_cart/order/after_custom_items_deleted', function ($customItems, $order) {
 // Recalculate order totals after custom items removed
 $order->recalculateTotals();
}, 10, 2);```

## Order Lifecycle [](#order-lifecycle)

General lifecycle hooks that fire at key moments during an [Order](https://dev.fluentcart.com/database/models/order.html)'s existence: invoice generation, [Customer](https://dev.fluentcart.com/database/models/customer.html) changes, payment completion, license generation, and receipt viewing.
### ` order/invoice_number_added ` [](#order-invoice-number-added)
`fluent_cart/order/invoice_number_added` — Fires after an invoice/receipt number is assigned to an order
**When it runs:** Fires in two places:

- Inside the `Order::booted()` `created` callback, immediately after a new order is persisted to the database with an invoice number already set (when payment status is `paid` at creation time).
- Inside `Order::generateReceiptNumber()`, when a receipt number is generated for an existing order that did not previously have one.

**Parameters:**

- `$data` (array): Order dataphp
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order
];```

**Source:** `app/Models/Order.php` (lines 60 and 734)
**Usage:**php
```
add_action('fluent_cart/order/invoice_number_added', function ($data) {
 $order = $data['order'];
 // Sync invoice number to external accounting system
 sync_to_accounting($order->id, $order->invoice_no, $order->receipt_number);
}, 10, 1);```

### ` order_customer_changed ` [](#order-customer-changed)
`fluent_cart/order_customer_changed` — Fires when the customer assigned to an order changes
**When it runs:** Fires inside `OrderController::changeCustomer()` after the order (and any child orders and [subscriptions](https://dev.fluentcart.com/database/models/subscription.html)) have been reassigned to a new customer, and both the old and new customer stats have been recounted.
**Parameters:**

- `$data` (array): Customer change dataphp
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order
 'old_customer' => $oldCustomer, // \FluentCart\App\Models\Customer|null
 'new_customer' => $newCustomer, // \FluentCart\App\Models\Customer
 'connected_order_ids' => [123, 124], // Array of all order IDs updated (parent + children)
];```

**Source:** `app/Http/Controllers/OrderController.php` (line 427)
**Usage:**php
```
add_action('fluent_cart/order_customer_changed', function ($data) {
 $order = $data['order'];
 $oldCustomer = $data['old_customer'];
 $newCustomer = $data['new_customer'];
 // Notify the new customer about the transfer
 wp_mail(
 $newCustomer->email,
 'Order Transferred to Your Account',
 sprintf('Order #%d has been assigned to your account.', $order->id)
 );
}, 10, 1);```

### ` order/generateMissingLicenses ` [](#order-generatemissinglicenses)
`fluent_cart/order/generateMissingLicenses` — Fires when an admin triggers license generation for an order
**When it runs:** Fires inside `OrderController::generateLicense()` when an admin requests license generation for an order that has fewer licenses than expected. This allows license modules to hook in and create the missing license keys.
**Parameters:**

- `$data` (array): Order dataphp
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order (with order_items and licenses loaded)
];```

**Source:** `app/Http/Controllers/OrderController.php` (line 225)
**Usage:**php
```
add_action('fluent_cart/order/generateMissingLicenses', function ($data) {
 $order = $data['order'];
 // Generate licenses for each eligible order item
 foreach ($order->order_items as $item) {
 generate_license_key($order->id, $item->product_id);
 }
}, 10, 1);```

### ` order_placed_offline ` [](#order-placed-offline)
`fluent_cart/order_placed_offline` — Fires when an order is placed via Cash on Delivery or other offline payment
**When it runs:** Fires inside `CodHandler::processPayment()` after the order and its [transaction](https://dev.fluentcart.com/database/models/order-transaction.html) have been created for an offline/COD payment. The [Order](https://dev.fluentcart.com/database/models/order.html), [Customer](https://dev.fluentcart.com/database/models/customer.html), and transaction data are all available at this point. The order has its `customer`, `shipping_address`, and `billing_address` relationships loaded.
**Parameters:**

- `$data` (array): Offline order dataphp
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order
 'customer' => $order->customer ?? [], // \FluentCart\App\Models\Customer or empty array
 'transaction' => $transaction ?? [], // \FluentCart\App\Models\OrderTransaction or empty array
];```

**Source:** `app/Modules/PaymentMethods/Cod/CodHandler.php` (line 55)
**Usage:**php
```
add_action('fluent_cart/order_placed_offline', function ($data) {
 $order = $data['order'];
 // Notify warehouse of new COD order
 wp_mail(
 '[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)',
 sprintf('New COD Order #%d', $order->id),
 'A new Cash on Delivery order needs to be prepared for shipment.'
 );
}, 10, 1);```

### ` order_paid_done ` [](#order-paid-done)
`fluent_cart/order_paid_done` — Main lifecycle hook when order payment completes (recommended for integrations)
**When it runs:** Fires asynchronously via Action Scheduler after an order's payment is confirmed as `paid`. The `OrderPaid` event enqueues a `fluent_cart/order_paid_ansyc_private_handle` async action, which validates the order is still paid, then dispatches this hook. This is the **recommended hook for third-party integrations** because it runs outside the payment gateway request cycle, avoiding race conditions and timeouts. For subscription or renewal orders, the associated [Subscription](https://dev.fluentcart.com/database/models/subscription.html) model is included in the data.
**Parameters:**

- 
`$data` (array): Order payment completion dataphp
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order
 'transaction' => $transaction, // \FluentCart\App\Models\OrderTransaction (latest successful transaction)
 'customer' => $customer, // \FluentCart\App\Models\Customer
 'subscription' => $subscription, // \FluentCart\App\Models\Subscription (only for subscription/renewal orders)
];```

**Note:** The `subscription` key is only present when the order type is `subscription` or `renewal`.

**Source:** `app/Hooks/actions.php` (line 159)
**Usage:**php
```
add_action('fluent_cart/order_paid_done', function ($data) {
 $order = $data['order'];
 $customer = $data['customer'];

 // Grant membership access after payment
 update_user_meta($customer->user_id, 'membership_active', true);

 // Handle subscription orders differently
 if (!empty($data['subscription'])) {
 $subscription = $data['subscription'];
 update_user_meta($customer->user_id, 'subscription_id', $subscription->id);
 }
}, 10, 1);```

### ` order_paid_ansyc_private_handle ` [](#order-paid-ansyc-private-handle)
`fluent_cart/order_paid_ansyc_private_handle` — Internal async handler that processes post-payment integrations
**When it runs:** Enqueued by `OrderPaid::afterDispatch()` as an Action Scheduler async action. The handler in `app/Hooks/actions.php` validates the order, clears the scheduler meta, and then dispatches `fluent_cart/order_paid_done`. It is also dispatched manually in `IntegrationEventListener` for retry scenarios. **You should generally hook into `order_paid_done` instead of this hook.**
**Parameters:**

- `$data` (array): Order identifierphp
```
$data = [
 'order_id' => 123, // int: The order ID to process
];```

**Source:** `app/Listeners/IntegrationEventListener.php` (line 360), `app/Hooks/actions.php` (line 126)
**Usage:**php
```
// Not recommended for third-party use. Use fluent_cart/order_paid_done instead.
add_action('fluent_cart/order_paid_ansyc_private_handle', function ($data) {
 $orderId = $data['order_id'];
 // Internal processing only
}, 10, 1);```

### ` order/receipt_viewed ` [](#order-receipt-viewed)
`fluent_cart/order/receipt_viewed` — Fires the first time a customer views their order receipt
**When it runs:** Fires at the end of receipt rendering (both the `ReceiptRenderer` class and the `receipt_slip.php` view template) when the `$is_first_time` flag is true. This means it only fires once per order, the very first time the receipt page is loaded. Subsequent views do not trigger this hook. The data includes both the [Order](https://dev.fluentcart.com/database/models/order.html) and [OrderOperation](https://dev.fluentcart.com/database/models/order-operation.html) models.
**Parameters:**

- `$data` (array): Receipt view dataphp
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order
 'order_operation' => $order_operation, // \FluentCart\App\Models\OrderOperation
];```

**Source:** `app/Services/Renderer/Receipt/ReceiptRenderer.php` (line 151), `app/Views/invoice/receipt_slip.php` (line 482)
**Usage:**php
```
add_action('fluent_cart/order/receipt_viewed', function ($data) {
 $order = $data['order'];
 // Track receipt view for analytics
 fluent_cart_add_log(
 'Receipt viewed',
 sprintf('Customer viewed receipt for Order #%d', $order->id),
 'info',
 ['module_name' => 'order', 'module_id' => $order->id]
 );
}, 10, 1);```

---

## Subscriptions

Source: https://dev.fluentcart.com/hooks/actions/subscriptions.html


Action hooks for [Subscription](https://dev.fluentcart.com/database/models/subscription.html) lifecycle management, status transitions, and scheduled reminder notifications. These hooks let you react to subscription state changes, send custom notifications, and integrate with external systems. Most hooks pass the related [Order](https://dev.fluentcart.com/database/models/order.html) and [Customer](https://dev.fluentcart.com/database/models/customer.html) models as well.
## Subscription Status Changes [](#subscription-status-changes)

### ` subscription_status_changed ` [](#subscription-status-changed)
`fluent_cart/payments/subscription_status_changed` — Fires on any subscription status transition
**When it runs:** This action fires whenever a [Subscription](https://dev.fluentcart.com/database/models/subscription.html)'s status changes from one value to another (e.g., `pending` to `active`, `active` to `cancelled`, etc.). It does **not** fire when other subscription data changes without a status transition. This is the generic handler -- for status-specific hooks, see `fluent_cart/payments/subscription_{$status}` below.
**Parameters:**

- `$data` (array): Subscription status change dataphp
```
$data = [
 'subscription' => $subscriptionModel, // \FluentCart\App\Models\Subscription
 'order' => $subscriptionModel->order, // \FluentCart\App\Models\Order
 'customer' => $subscriptionModel->customer, // \FluentCart\App\Models\Customer
 'old_status' => 'pending', // string — previous status
 'new_status' => 'active', // string — current status after update
];```

**Source:** `app/Modules/Subscriptions/Services/SubscriptionService.php`
**Usage:**php
```
add_action('fluent_cart/payments/subscription_status_changed', function ($data) {
 $subscription = $data['subscription'];
 $oldStatus = $data['old_status'];
 $newStatus = $data['new_status'];

 // Log every status transition
 fluent_cart_add_log(
 'Subscription Status Changed',
 sprintf('Subscription #%d changed from %s to %s', $subscription->id, $oldStatus, $newStatus),
 'info'
 );
}, 10, 1);```

### ` subscription_active ` [](#subscription-active)
`fluent_cart/payments/subscription_active` — Fires when a subscription becomes active
**When it runs:** This action fires when a subscription's status transitions to `active`. This may occur after initial payment, after reactivation, or when moving from `trialing` to `active`.
**Parameters:**

- `$data` (array): Subscription dataphp
```
$data = [
 'subscription' => $subscriptionModel, // \FluentCart\App\Models\Subscription
 'order' => $subscriptionModel->order, // \FluentCart\App\Models\Order
 'customer' => $subscriptionModel->customer, // \FluentCart\App\Models\Customer
 'old_status' => 'pending', // string — previous status
 'new_status' => 'active', // string — always 'active'
];```

**Source:** `app/Modules/Subscriptions/Services/SubscriptionService.php`
**Usage:**php
```
add_action('fluent_cart/payments/subscription_active', function ($data) {
 $customer = $data['customer'];

 // Grant premium access when subscription activates
 update_user_meta($customer->user_id, 'premium_member', true);
}, 10, 1);```

### ` subscription_canceled ` [](#subscription-canceled)
`fluent_cart/payments/subscription_canceled` — Fires when a subscription is cancelled
**When it runs:** This action fires when a subscription's status transitions to `canceled`. The `canceled_at` timestamp is automatically set if not already provided.
**Parameters:**

- `$data` (array): Subscription dataphp
```
$data = [
 'subscription' => $subscriptionModel, // \FluentCart\App\Models\Subscription
 'order' => $subscriptionModel->order, // \FluentCart\App\Models\Order
 'customer' => $subscriptionModel->customer, // \FluentCart\App\Models\Customer
 'old_status' => 'active', // string — previous status
 'new_status' => 'canceled', // string — always 'canceled'
];```

**Source:** `app/Modules/Subscriptions/Services/SubscriptionService.php`
**Usage:**php
```
add_action('fluent_cart/payments/subscription_canceled', function ($data) {
 $subscription = $data['subscription'];
 $customer = $data['customer'];

 // Revoke premium access on cancellation
 update_user_meta($customer->user_id, 'premium_member', false);

 // Notify admin
 wp_mail(
 get_option('admin_email'),
 'Subscription Cancelled',
 sprintf('Subscription #%d for %s has been cancelled.', $subscription->id, $customer->email)
 );
}, 10, 1);```

### ` subscription_paused ` [](#subscription-paused)
`fluent_cart/payments/subscription_paused` — Fires when a subscription is paused
**When it runs:** This action fires when a subscription's status transitions to `paused`. The subscription remains in the system but billing is temporarily halted.
**Parameters:**

- `$data` (array): Subscription dataphp
```
$data = [
 'subscription' => $subscriptionModel, // \FluentCart\App\Models\Subscription
 'order' => $subscriptionModel->order, // \FluentCart\App\Models\Order
 'customer' => $subscriptionModel->customer, // \FluentCart\App\Models\Customer
 'old_status' => 'active', // string — previous status
 'new_status' => 'paused', // string — always 'paused'
];```

**Source:** `app/Modules/Subscriptions/Services/SubscriptionService.php`
**Usage:**php
```
add_action('fluent_cart/payments/subscription_paused', function ($data) {
 $subscription = $data['subscription'];

 // Temporarily suspend feature access
 update_user_meta($data['customer']->user_id, 'subscription_paused', true);
}, 10, 1);```

### ` subscription_expired ` [](#subscription-expired)
`fluent_cart/payments/subscription_expired` — Fires when a subscription expires
**When it runs:** This action fires when a subscription's status transitions to `expired`. After this hook fires, the system also stores a `validity_expired_at` meta value and dispatches the `SubscriptionValidityExpired` event.
**Parameters:**

- `$data` (array): Subscription dataphp
```
$data = [
 'subscription' => $subscriptionModel, // \FluentCart\App\Models\Subscription
 'order' => $subscriptionModel->order, // \FluentCart\App\Models\Order
 'customer' => $subscriptionModel->customer, // \FluentCart\App\Models\Customer
 'old_status' => 'active', // string — previous status
 'new_status' => 'expired', // string — always 'expired'
];```

**Source:** `app/Modules/Subscriptions/Services/SubscriptionService.php`
**Usage:**php
```
add_action('fluent_cart/payments/subscription_expired', function ($data) {
 $customer = $data['customer'];

 // Remove premium access
 update_user_meta($customer->user_id, 'premium_member', false);

 // Notify the customer
 wp_mail(
 $customer->email,
 'Your Subscription Has Expired',
 'Your subscription has expired. Please renew to continue using premium features.'
 );
}, 10, 1);```

### ` subscription_failing ` [](#subscription-failing)
`fluent_cart/payments/subscription_failing` — Fires when a subscription payment is failing
**When it runs:** This action fires when a subscription's status transitions to `failing`, indicating that a renewal payment attempt has failed. The subscription is still technically active but requires payment attention.
**Parameters:**

- `$data` (array): Subscription dataphp
```
$data = [
 'subscription' => $subscriptionModel, // \FluentCart\App\Models\Subscription
 'order' => $subscriptionModel->order, // \FluentCart\App\Models\Order
 'customer' => $subscriptionModel->customer, // \FluentCart\App\Models\Customer
 'old_status' => 'active', // string — previous status
 'new_status' => 'failing', // string — always 'failing'
];```

**Source:** `app/Modules/Subscriptions/Services/SubscriptionService.php`
**Usage:**php
```
add_action('fluent_cart/payments/subscription_failing', function ($data) {
 $subscription = $data['subscription'];
 $customer = $data['customer'];

 // Alert the customer about the payment failure
 wp_mail(
 $customer->email,
 'Payment Failed for Your Subscription',
 sprintf('We were unable to process payment for subscription #%d. Please update your payment method.', $subscription->id)
 );
}, 10, 1);```

### ` subscription_expiring ` [](#subscription-expiring)
`fluent_cart/payments/subscription_expiring` — Fires when a subscription is marked as expiring soon
**When it runs:** This action fires when a subscription's status transitions to `expiring`, indicating that the subscription is approaching its end-of-term and will not be renewed.
**Parameters:**

- `$data` (array): Subscription dataphp
```
$data = [
 'subscription' => $subscriptionModel, // \FluentCart\App\Models\Subscription
 'order' => $subscriptionModel->order, // \FluentCart\App\Models\Order
 'customer' => $subscriptionModel->customer, // \FluentCart\App\Models\Customer
 'old_status' => 'active', // string — previous status
 'new_status' => 'expiring', // string — always 'expiring'
];```

**Source:** `app/Modules/Subscriptions/Services/SubscriptionService.php`
**Usage:**php
```
add_action('fluent_cart/payments/subscription_expiring', function ($data) {
 $subscription = $data['subscription'];
 $customer = $data['customer'];

 // Send a win-back offer before the subscription fully expires
 wp_mail(
 $customer->email,
 'Your Subscription is About to Expire',
 'Renew now and get 10% off your next billing cycle!'
 );
}, 10, 1);```

### ` subscription_completed ` [](#subscription-completed)
`fluent_cart/payments/subscription_completed` — Fires when a subscription completes all billing cycles
**When it runs:** This action fires when a subscription's status transitions to `completed`. This occurs when the subscription has reached its end-of-term (EOT) -- i.e., the `bill_count` has met or exceeded `bill_times`. The `next_billing_date` is set to `NULL` and `canceled_at` is cleared.
**Parameters:**

- `$data` (array): Subscription dataphp
```
$data = [
 'subscription' => $subscriptionModel, // \FluentCart\App\Models\Subscription
 'order' => $subscriptionModel->order, // \FluentCart\App\Models\Order
 'customer' => $subscriptionModel->customer, // \FluentCart\App\Models\Customer
 'old_status' => 'active', // string — previous status
 'new_status' => 'completed', // string — always 'completed'
];```

**Source:** `app/Modules/Subscriptions/Services/SubscriptionService.php`
**Usage:**php
```
add_action('fluent_cart/payments/subscription_completed', function ($data) {
 $subscription = $data['subscription'];
 $customer = $data['customer'];

 // Thank the customer for completing their subscription term
 wp_mail(
 $customer->email,
 'Subscription Complete',
 sprintf('Your subscription #%d has completed all %d billing cycles. Thank you!', $subscription->id, $subscription->bill_times)
 );
}, 10, 1);```

### ` subscription_trialing ` [](#subscription-trialing)
`fluent_cart/payments/subscription_trialing` — Fires when a subscription enters trial status
**When it runs:** This action fires when a subscription's status transitions to `trialing`. The subscription is in a free trial period and will transition to `active` (with billing) when the trial ends.
**Parameters:**

- `$data` (array): Subscription dataphp
```
$data = [
 'subscription' => $subscriptionModel, // \FluentCart\App\Models\Subscription
 'order' => $subscriptionModel->order, // \FluentCart\App\Models\Order
 'customer' => $subscriptionModel->customer, // \FluentCart\App\Models\Customer
 'old_status' => 'pending', // string — previous status
 'new_status' => 'trialing', // string — always 'trialing'
];```

**Source:** `app/Modules/Subscriptions/Services/SubscriptionService.php`
**Usage:**php
```
add_action('fluent_cart/payments/subscription_trialing', function ($data) {
 $subscription = $data['subscription'];
 $customer = $data['customer'];

 // Grant trial access
 update_user_meta($customer->user_id, 'trial_active', true);

 // Schedule a welcome email
 wp_mail(
 $customer->email,
 'Your Free Trial Has Started',
 sprintf('Enjoy your trial! Your first payment will be on %s.', $subscription->next_billing_date)
 );
}, 10, 1);```

## Subscription Data Updates [](#subscription-data-updates)

### ` subscription_data_updated ` [](#subscription-data-updated)
`fluent_cart/subscription/data_updated` — Fires when subscription data changes without a status transition
**When it runs:** This action fires when [Subscription](https://dev.fluentcart.com/database/models/subscription.html) attributes are modified but the status remains the same. Examples include billing amount changes, next payment date adjustments, or metadata updates. It only fires when there are actual dirty (changed) fields on the model.
**Parameters:**

- `$data` (array): Subscription update dataphp
```
$data = [
 'subscription' => $subscriptionModel, // \FluentCart\App\Models\Subscription (already saved)
 'updated_data' => [
 // Only the fields that actually changed (dirty attributes), e.g.:
 'recurring_total' => 2999, // int — new amount in cents
 'next_billing_date' => '2025-03-15 00:00:00', // string — updated billing date
 ],
];```

**Source:** `app/Modules/Subscriptions/Services/SubscriptionService.php`
**Usage:**php
```
add_action('fluent_cart/subscription/data_updated', function ($data) {
 $subscription = $data['subscription'];
 $updatedData = $data['updated_data'];

 // Log billing amount changes
 if (isset($updatedData['recurring_total'])) {
 fluent_cart_add_log(
 'Subscription Amount Changed',
 sprintf(
 'Subscription #%d recurring total changed to %s',
 $subscription->id,
 number_format($updatedData['recurring_total'] / 100, 2)
 ),
 'info'
 );
 }

 // Sync next billing date with external calendar
 if (isset($updatedData['next_billing_date'])) {
 do_action('my_plugin/sync_billing_date', $subscription->id, $updatedData['next_billing_date']);
 }
}, 10, 1);```

## Reminders & Notifications [](#reminders-notifications)

### ` subscription_renewal_reminder ` [](#subscription-renewal-reminder)
`fluent_cart/subscription_renewal_reminder` — Fires when a subscription renewal reminder is due
**When it runs:** This action fires on a scheduled basis (via Action Scheduler) when a subscription's next billing date is approaching. The reminder system supports multiple billing cycles (yearly, monthly, quarterly, half-yearly) and configurable "days before" thresholds. Only fires for subscriptions with `active` or `trialing` status. The stage name indicates how many days before renewal (e.g., `before_30`, `before_7`).
**Parameters:**

- `$data` (array): Renewal reminder dataphp
```
$data = [
 'subscription' => $subscription, // \FluentCart\App\Models\Subscription
 'order' => $subscription->order, // \FluentCart\App\Models\Order
 'customer' => $subscription->customer, // \FluentCart\App\Models\Customer
 'reminder' => [
 'stage' => 'before_30', // string — e.g., 'before_30', 'before_7'
 'billing_cycle' => 'yearly', // string — 'yearly', 'monthly', 'quarterly', 'half_yearly'
 'billing_date' => '2025-03-15 00:00:00', // string — GMT formatted next billing date
 ],
];```

**Source:** `app/Services/Reminders/SubscriptionReminderService.php`
**Usage:**php
```
add_action('fluent_cart/subscription_renewal_reminder', function ($data) {
 $subscription = $data['subscription'];
 $customer = $data['customer'];
 $reminder = $data['reminder'];

 // Send a custom renewal reminder email
 wp_mail(
 $customer->email,
 'Subscription Renewal Coming Up',
 sprintf(
 'Your %s subscription #%d will renew on %s.',
 $reminder['billing_cycle'],
 $subscription->id,
 date('F j, Y', strtotime($reminder['billing_date']))
 )
 );
}, 10, 1);```

### ` subscription_trial_end_reminder ` [](#subscription-trial-end-reminder)
`fluent_cart/subscription_trial_end_reminder` — Fires when a trial ending reminder is due
**When it runs:** This action fires on a scheduled basis when a trialing subscription's trial period is about to end. Only fires for subscriptions with `trialing` status (excluding simulated trials). The stage name indicates how many days before the trial ends (e.g., `trial_end_3`, `trial_end_1`). Configurable via the `trial_end_reminder_days` store setting.
**Parameters:**

- `$data` (array): Trial end reminder dataphp
```
$data = [
 'subscription' => $subscription, // \FluentCart\App\Models\Subscription
 'order' => $subscription->order, // \FluentCart\App\Models\Order
 'customer' => $subscription->customer, // \FluentCart\App\Models\Customer
 'reminder' => [
 'stage' => 'trial_end_3', // string — e.g., 'trial_end_3', 'trial_end_1'
 'trial_end_date' => '2025-02-01 00:00:00', // string — GMT formatted trial end date
 ],
];```

**Source:** `app/Services/Reminders/SubscriptionReminderService.php`
**Usage:**php
```
add_action('fluent_cart/subscription_trial_end_reminder', function ($data) {
 $subscription = $data['subscription'];
 $customer = $data['customer'];
 $reminder = $data['reminder'];

 // Notify customer that their trial is ending soon
 wp_mail(
 $customer->email,
 'Your Free Trial is Ending Soon',
 sprintf(
 'Your trial for subscription #%d ends on %s. After that, you will be billed %s.',
 $subscription->id,
 date('F j, Y', strtotime($reminder['trial_end_date'])),
 number_format($subscription->recurring_total / 100, 2)
 )
 );
}, 10, 1);```

### ` invoice_reminder_overdue ` [](#invoice-reminder-overdue)
`fluent_cart/invoice_reminder_overdue` — Fires when an overdue invoice reminder is triggered
**When it runs:** This action fires on a scheduled basis when an [Order](https://dev.fluentcart.com/database/models/order.html) with an outstanding balance has passed its due date by a configured number of days. The stage name indicates how many days overdue (e.g., `overdue_1`, `overdue_3`, `overdue_7`). Only fires for orders with `pending`, `partially_paid`, `failed`, or `authorized` payment statuses. The overdue days are configurable via the `invoice_reminder_overdue_days` store setting (defaults to `1,3,7`).
**Parameters:**

- `$data` (array): Invoice overdue reminder dataphp
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order
 'customer' => $order->customer, // \FluentCart\App\Models\Customer
 'reminder' => [
 'stage' => 'overdue_3', // string — e.g., 'overdue_1', 'overdue_3', 'overdue_7'
 'order_id' => 123, // int — order ID
 'order_ref' => 'INV-00123', // string — invoice number or '#123' fallback
 'due_at' => '2025-01-15 00:00:00', // string — GMT formatted due date
 'due_amount' => 5000, // int — outstanding amount in cents
 'payment_link' => 'https://example.com/checkout/pay/uuid', // string — customer payment URL
 ],
];```

**Source:** `app/Services/Reminders/InvoiceReminderService.php`
**Usage:**php
```
add_action('fluent_cart/invoice_reminder_overdue', function ($data) {
 $order = $data['order'];
 $customer = $data['customer'];
 $reminder = $data['reminder'];

 // Send a payment reminder with a direct payment link
 wp_mail(
 $customer->email,
 sprintf('Payment Overdue for %s', $reminder['order_ref']),
 sprintf(
 "Your payment of %s for order %s is overdue.\n\nPay now: %s",
 number_format($reminder['due_amount'] / 100, 2),
 $reminder['order_ref'],
 $reminder['payment_link']
 )
 );
}, 10, 1);```

### ` invoice_reminder_due ` [](#invoice-reminder-due)
`fluent_cart/invoice_reminder_due` — Fires when an invoice due-date reminder is triggered
**When it runs:** This action fires on a scheduled basis when an order with an outstanding balance has reached its due date (stage `before_0`). This is the on-due-date notification, as opposed to the overdue reminders that fire after the due date has passed. Shares the same parameter structure as the overdue reminder.
**Note:** This hook is currently defined in the codebase but the queueing logic for the `before_0` stage is commented out pending the full invoice feature deployment. It is documented here for forward compatibility.
**Parameters:**

- `$data` (array): Invoice due reminder dataphp
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order
 'customer' => $order->customer, // \FluentCart\App\Models\Customer
 'reminder' => [
 'stage' => 'before_0', // string — always 'before_0' for due-date reminders
 'order_id' => 123, // int — order ID
 'order_ref' => 'INV-00123', // string — invoice number or '#123' fallback
 'due_at' => '2025-01-15 00:00:00', // string — GMT formatted due date
 'due_amount' => 5000, // int — outstanding amount in cents
 'payment_link' => 'https://example.com/checkout/pay/uuid', // string — customer payment URL
 ],
];```

**Source:** `app/Services/Reminders/InvoiceReminderService.php`
**Usage:**php
```
add_action('fluent_cart/invoice_reminder_due', function ($data) {
 $order = $data['order'];
 $customer = $data['customer'];
 $reminder = $data['reminder'];

 // Notify customer that their invoice is due today
 wp_mail(
 $customer->email,
 sprintf('Payment Due Today for %s', $reminder['order_ref']),
 sprintf(
 "Your payment of %s for order %s is due today.\n\nPay now: %s",
 number_format($reminder['due_amount'] / 100, 2),
 $reminder['order_ref'],
 $reminder['payment_link']
 )
 );
}, 10, 1);```

## Subscription Upgrades & Early Payments Pro [](#subscription-upgrades-early-payments)

### ` early_payment_completed ` [](#early-payment-completed)
`fluent_cart/subscription/early_payment_completed` Pro — Fires when an early installment payment is completed
**When it runs:** This action fires when a customer makes an early installment payment on their subscription, paying for one or more future billing cycles ahead of schedule.
**Parameters:**

- `$data` (array): Early payment completion dataphp
```
$data = [
 'subscription' => $subscription, // \FluentCart\App\Models\Subscription
 'order' => $order, // \FluentCart\App\Models\Order
 'installment_count' => $installmentCount, // int — number of installments paid early
];```

**Source:** `fluent-cart-pro/app/Hooks/Handlers/EarlyInstallmentPaymentHandler.php:279`
**Usage:**php
```
add_action('fluent_cart/subscription/early_payment_completed', function ($data) {
 $subscription = $data['subscription'];
 $order = $data['order'];
 $installmentCount = $data['installment_count'];

 fluent_cart_add_log(
 'Early Payment Completed',
 sprintf('Subscription #%d received %d early installment(s) via order #%d', $subscription->id, $installmentCount, $order->id),
 'info'
 );
}, 10, 1);```

### ` order_upgraded ` [](#order-upgraded)
`fluent_cart/order/upgraded` Pro — Fires when a plan upgrade is completed
**When it runs:** This action fires when a customer completes a plan upgrade, transitioning from one product variant to another. The upgrade creates a new order and transaction record.
**Parameters:**

- `$data` (array): Upgrade completion dataphp
```
$data = [
 'order' => $newOrder, // \FluentCart\App\Models\Order — the new upgrade order
 'from_order' => $upgradeFromOrder, // \FluentCart\App\Models\Order — the original order
 'cart' => $cartModel, // \FluentCart\App\Models\Cart — the cart used for the upgrade
 'from_variant_id' => $fromVariantId, // int — ID of the original product variant
 'transaction' => $transaction, // \FluentCart\App\Models\OrderTransaction — the upgrade payment transaction
];```

**Source:** `fluent-cart-pro/app/Hooks/Handlers/UpgradeHandler.php:242`
**Usage:**php
```
add_action('fluent_cart/order/upgraded', function ($data) {
 $order = $data['order'];
 $fromOrder = $data['from_order'];
 $fromVariantId = $data['from_variant_id'];
 $transaction = $data['transaction'];

 fluent_cart_add_log(
 'Plan Upgraded',
 sprintf(
 'Order #%d upgraded from order #%d (variant %d). Transaction: %s',
 $order->id,
 $fromOrder->id,
 $fromVariantId,
 $transaction->charge_id
 ),
 'info'
 );
}, 10, 1);```

---

## Licenses

Source: https://dev.fluentcart.com/hooks/actions/licenses.html

Pro
# Licenses [](#licenses)

Action hooks for software licensing lifecycle management including [License](https://dev.fluentcart.com/database/models/license.html) status changes, [LicenseActivation](https://dev.fluentcart.com/database/models/license-activation.html) management, [LicenseSite](https://dev.fluentcart.com/database/models/license-site.html) activations/deactivations, and bulk operations. All hooks in this section require the FluentCart Pro plugin.
## License Status [](#license-status)

### ` license_status_updated ` [](#license-status-updated)
`fluent_cart_sl/license_status_updated` Pro — Fires on any license status change
**When it runs:** This action fires whenever a [License](https://dev.fluentcart.com/database/models/license.html)'s status transitions from one value to another (e.g., `active` to `expired`, `active` to `disabled`, etc.).
**Parameters:**

- `$data` (array): License status change data 

 - `license` ([`\FluentCart\App\Models\License`](https://dev.fluentcart.com/database/models/license.html)) — The license model after the status change
 - `old_status` (string) — The previous status value
 - `new_status` (string) — The new status value

**Source:** `fluent-cart-pro/app/Modules/Licensing/Models/License.php:206`
**Usage:**php
```
add_action('fluent_cart_sl/license_status_updated', function ($data) {
 $license = $data['license'];
 $oldStatus = $data['old_status'];
 $newStatus = $data['new_status'];

 fluent_cart_add_log(
 'License Status Changed',
 sprintf('License #%d changed from %s to %s', $license->id, $oldStatus, $newStatus),
 'info'
 );
}, 10, 1);```

### ` license_status_updated_to_{$newStatus} ` [](#license-status-updated-to-newstatus)
`fluent_cart_sl/license_status_updated_to_{$newStatus}` Pro — Fires when a license transitions to a specific status
**When it runs:** This is a dynamic hook that fires for a specific target status. For example, `fluent_cart_sl/license_status_updated_to_expired` fires only when a [License](https://dev.fluentcart.com/database/models/license.html) becomes `expired`.
**Parameters:**

- `$data` (array): License status change data 

 - `license` ([`\FluentCart\App\Models\License`](https://dev.fluentcart.com/database/models/license.html)) — The license model after the status change
 - `old_status` (string) — The previous status value
 - `new_status` (string) — The new status value

**Source:** `fluent-cart-pro/app/Modules/Licensing/Models/License.php:211`
**Usage:**php
```
add_action('fluent_cart_sl/license_status_updated_to_expired', function ($data) {
 $license = $data['license'];
 $oldStatus = $data['old_status'];
 $newStatus = $data['new_status'];

 // Handle license expiration
 wp_mail(get_option('admin_email'), 'License Expired', sprintf('License #%d has expired.', $license->id));
}, 10, 1);```

## License Activation Status [](#license-activation-status)

### ` license_activation_status_updated ` [](#license-activation-status-updated)
`fluent_cart_sl/license_activation_status_updated` Pro — Fires on any license activation status change
**When it runs:** This action fires whenever a [LicenseActivation](https://dev.fluentcart.com/database/models/license-activation.html)'s status transitions from one value to another.
**Parameters:**

- `$data` (array): License activation status change data 

 - `license` ([`\FluentCart\App\Models\LicenseActivation`](https://dev.fluentcart.com/database/models/license-activation.html)) — The license activation model (note: key is `license` but value is a LicenseActivation instance)
 - `old_status` (string) — The previous activation status
 - `new_status` (string) — The new activation status

**Source:** `fluent-cart-pro/app/Modules/Licensing/Models/LicenseActivation.php:52`
**Usage:**php
```
add_action('fluent_cart_sl/license_activation_status_updated', function ($data) {
 $activation = $data['license']; // Note: key is 'license' but value is a LicenseActivation instance
 $oldStatus = $data['old_status'];
 $newStatus = $data['new_status'];

 fluent_cart_add_log(
 'License Activation Status Changed',
 sprintf('Activation #%d status changed from %s to %s', $activation->id, $oldStatus, $newStatus),
 'info'
 );
}, 10, 1);```

### ` license_activation_status_updated_to_{$newStatus} ` [](#license-activation-status-updated-to-newstatus)
`fluent_cart_sl/license_activation_status_updated_to_{$newStatus}` Pro — Fires when a license activation transitions to a specific status
**When it runs:** This is a dynamic hook that fires for a specific target [LicenseActivation](https://dev.fluentcart.com/database/models/license-activation.html) status.
**Parameters:**

- `$data` (array): License activation status change data 

 - `license` ([`\FluentCart\App\Models\LicenseActivation`](https://dev.fluentcart.com/database/models/license-activation.html)) — The license activation model (note: key is `license` but value is a LicenseActivation instance)
 - `old_status` (string) — The previous activation status
 - `new_status` (string) — The new activation status

**Source:** `fluent-cart-pro/app/Modules/Licensing/Models/LicenseActivation.php:57`
**Usage:**php
```
add_action('fluent_cart_sl/license_activation_status_updated_to_active', function ($data) {
 $activation = $data['license']; // Note: key is 'license' but value is a LicenseActivation instance
 $oldStatus = $data['old_status'];
 $newStatus = $data['new_status'];

 // Handle activation becoming active
}, 10, 1);```

## License Limits [](#license-limits)

### ` license_limit_increased (activation count) ` [](#license-limit-increased-activation-count)
`fluent_cart_sl/license_limit_increased` Pro — Fires when the license activation count is increased
**When it runs:** This action fires when a [License](https://dev.fluentcart.com/database/models/license.html)'s activation count is increased.
**Parameters:**

- `$data` (array): License limit change data 

 - `license` ([`\FluentCart\App\Models\License`](https://dev.fluentcart.com/database/models/license.html)) — The license model
 - `old_count` (int) — The previous activation count

**Source:** `fluent-cart-pro/app/Modules/Licensing/Models/License.php:224`
**Usage:**php
```
add_action('fluent_cart_sl/license_limit_increased', function ($data) {
 $license = $data['license'];
 $oldCount = $data['old_count'];

 fluent_cart_add_log(
 'License Activation Count Increased',
 sprintf('License #%d activation count increased from %d', $license->id, $oldCount),
 'info'
 );
}, 10, 1);```

### ` license_limit_decreased ` [](#license-limit-decreased)
`fluent_cart_sl/license_limit_decreased` Pro — Fires when the license activation count is decreased
**When it runs:** This action fires when a [License](https://dev.fluentcart.com/database/models/license.html)'s activation count is decreased.
**Parameters:**

- `$data` (array): License limit change data 

 - `license` ([`\FluentCart\App\Models\License`](https://dev.fluentcart.com/database/models/license.html)) — The license model
 - `old_count` (int) — The previous activation count

**Source:** `fluent-cart-pro/app/Modules/Licensing/Models/License.php:239`
**Usage:**php
```
add_action('fluent_cart_sl/license_limit_decreased', function ($data) {
 $license = $data['license'];
 $oldCount = $data['old_count'];

 fluent_cart_add_log(
 'License Activation Count Decreased',
 sprintf('License #%d activation count decreased from %d', $license->id, $oldCount),
 'info'
 );
}, 10, 1);```

### ` license_limit_increased (limit slots) ` [](#license-limit-increased-limit-slots)
`fluent_cart_sl/license_limit_increased` Pro — Fires when the license activation limit (slots) is increased
**When it runs:** This action fires when a [License](https://dev.fluentcart.com/database/models/license.html)'s activation limit (maximum allowed activations) is increased.
**Parameters:**

- `$data` (array): License limit change data 

 - `license` ([`\FluentCart\App\Models\License`](https://dev.fluentcart.com/database/models/license.html)) — The license model
 - `old_count` (int) — The previous activation limit

**Source:** `fluent-cart-pro/app/Modules/Licensing/Models/License.php:259`
**Usage:**php
```
add_action('fluent_cart_sl/license_limit_increased', function ($data) {
 $license = $data['license'];
 $oldCount = $data['old_count'];

 fluent_cart_add_log(
 'License Limit Increased',
 sprintf('License #%d activation limit increased from %d', $license->id, $oldCount),
 'info'
 );
}, 10, 1);```

## License Key & Validity [](#license-key-validity)

### ` license_key_regenerated ` [](#license-key-regenerated)
`fluent_cart_sl/license_key_regenerated` Pro — Fires when a license key is regenerated
**When it runs:** This action fires when a license key is regenerated, replacing the old key with a new one.
**Parameters:**

- `$data` (array): License key change data 

 - `license` ([`\FluentCart\App\Models\License`](https://dev.fluentcart.com/database/models/license.html)) — The license model with the new key
 - `old_key` (string) — The previous license key

**Source:** `fluent-cart-pro/app/Modules/Licensing/Models/License.php:318`
**Usage:**php
```
add_action('fluent_cart_sl/license_key_regenerated', function ($data) {
 $license = $data['license'];
 $oldKey = $data['old_key'];

 fluent_cart_add_log(
 'License Key Regenerated',
 sprintf('License #%d key was regenerated', $license->id),
 'info'
 );
}, 10, 1);```

### ` license_validity_extended ` [](#license-validity-extended)
`fluent_cart_sl/license_validity_extended` Pro — Fires when a license expiration date is changed
**When it runs:** This action fires when a license's expiration date is modified to a new date.
**Parameters:**

- `$data` (array): License validity change data 

 - `license` ([`\FluentCart\App\Models\License`](https://dev.fluentcart.com/database/models/license.html)) — The license model
 - `old_date` (string) — The previous expiration date
 - `new_date` (string) — The new expiration date

**Source:** `fluent-cart-pro/app/Modules/Licensing/Models/License.php:348`
**Usage:**php
```
add_action('fluent_cart_sl/license_validity_extended', function ($data) {
 $license = $data['license'];
 $oldDate = $data['old_date'];
 $newDate = $data['new_date'];

 fluent_cart_add_log(
 'License Validity Extended',
 sprintf('License #%d expiration changed from %s to %s', $license->id, $oldDate, $newDate),
 'info'
 );
}, 10, 1);```

## License Lifecycle [](#license-lifecycle)

### ` license_issued (order) ` [](#license-issued-order)
`fluent_cart/licensing/license_issued` Pro — Fires when a new license is created for an order
**When it runs:** This action fires when a new license is generated as part of an order fulfillment process.
**Parameters:**

- `$data` (array): License issuance data 

 - `license` ([`\FluentCart\App\Models\License`](https://dev.fluentcart.com/database/models/license.html)) — The newly created license
 - `data` (array) — License creation data
 - `order` ([`\FluentCart\App\Models\Order`](https://dev.fluentcart.com/database/models/order.html)) — The associated order
 - `subscription` ([`\FluentCart\App\Models\Subscription`](https://dev.fluentcart.com/database/models/subscription.html)|null) — The associated subscription, if any

**Source:** `fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseGenerationHandler.php:532`
**Usage:**php
```
add_action('fluent_cart/licensing/license_issued', function ($data) {
 $license = $data['license'];
 $order = $data['order'];
 $subscription = $data['subscription'];

 // Notify customer about their new license
 wp_mail(
 $order->customer->email,
 'Your License Key',
 sprintf('Your license key for order #%d is: %s', $order->id, $license->license_key)
 );
}, 10, 1);```

### ` license_issued (manager) ` [](#license-issued-manager)
`fluent_cart_sl/license_issued` Pro — Fires when a license is issued via the license manager
**When it runs:** This action fires when a license is created through the admin license management interface.
**Parameters:**

- `$data` (array): License issuance data 

 - `license` ([`\FluentCart\App\Models\License`](https://dev.fluentcart.com/database/models/license.html)) — The newly created license
 - `data` (array) — License creation data

**Source:** `fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php:261`
**Usage:**php
```
add_action('fluent_cart_sl/license_issued', function ($data) {
 $license = $data['license'];
 $createData = $data['data'];

 fluent_cart_add_log(
 'License Issued via Manager',
 sprintf('License #%d issued manually', $license->id),
 'info'
 );
}, 10, 1);```

### ` license_renewed ` [](#license-renewed)
`fluent_cart/licensing/license_renewed` Pro — Fires when a license expiration is extended on subscription renewal
**When it runs:** This action fires when a license's expiration date is extended because the associated subscription has been successfully renewed.
**Parameters:**

- `$data` (array): License renewal data 

 - `license` ([`\FluentCart\App\Models\License`](https://dev.fluentcart.com/database/models/license.html)) — The renewed license
 - `subscription` ([`\FluentCart\App\Models\Subscription`](https://dev.fluentcart.com/database/models/subscription.html)) — The associated subscription
 - `prev_status` (string) — The previous license status

**Source:** `fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseGenerationHandler.php:231`
**Usage:**php
```
add_action('fluent_cart/licensing/license_renewed', function ($data) {
 $license = $data['license'];
 $subscription = $data['subscription'];
 $prevStatus = $data['prev_status'];

 fluent_cart_add_log(
 'License Renewed',
 sprintf('License #%d renewed via subscription #%d', $license->id, $subscription->id),
 'info'
 );
}, 10, 1);```

### ` license_expired ` [](#license-expired)
`fluent_cart/licensing/license_expired` Pro — Fires when a license expires due to subscription cancellation or scheduler
**When it runs:** This action fires when a license is marked as expired, either because the associated subscription was cancelled or because the license scheduler determined it has passed its expiration date.
**Parameters:**

- `$data` (array): License expiration data 

 - `license` ([`\FluentCart\App\Models\License`](https://dev.fluentcart.com/database/models/license.html)) — The expired license
 - `subscription` ([`\FluentCart\App\Models\Subscription`](https://dev.fluentcart.com/database/models/subscription.html)) — The associated subscription
 - `prev_status` (string) — The previous license status

**Source:** `fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseGenerationHandler.php:267`, `fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseSchedulerHandler.php:46`
**Usage:**php
```
add_action('fluent_cart/licensing/license_expired', function ($data) {
 $license = $data['license'];
 $subscription = $data['subscription'];
 $prevStatus = $data['prev_status'];

 // Notify customer about license expiration
 wp_mail(
 $license->customer->email,
 'License Expired',
 sprintf('Your license #%d has expired.', $license->id)
 );
}, 10, 1);```

### ` license_disabled ` [](#license-disabled)
`fluent_cart/licensing/license_disabled` Pro — Fires when a license is disabled due to payment failure or refund
**When it runs:** This action fires when a license is disabled, typically because the associated order's payment failed or a refund was processed.
**Parameters:**

- `$data` (array): License disabled data 

 - `license` ([`\FluentCart\App\Models\License`](https://dev.fluentcart.com/database/models/license.html)) — The disabled license
 - `order` ([`\FluentCart\App\Models\Order`](https://dev.fluentcart.com/database/models/order.html)) — The associated order
 - `reason` (string|undefined) — The reason for disabling (only present on payment failure; absent on refund)

**Source:** `fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseGenerationHandler.php:158`, `fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseGenerationHandler.php:196`
**Usage:**php
```
add_action('fluent_cart/licensing/license_disabled', function ($data) {
 $license = $data['license'];
 $order = $data['order'];
 $reason = $data['reason'] ?? '';

 fluent_cart_add_log(
 'License Disabled',
 sprintf('License #%d disabled for order #%d. Reason: %s', $license->id, $order->id, $reason ?: 'refund'),
 'warning'
 );
}, 10, 1);```

### ` extended_to_lifetime ` [](#extended-to-lifetime)
`fluent_cart/licensing/extended_to_lifetime` Pro — Fires when a license is extended to lifetime on subscription end-of-term
**When it runs:** This action fires when a license is converted to a lifetime license because its associated subscription has completed all billing cycles (end-of-term).
**Parameters:**

- `$data` (array): License lifetime extension data 

 - `license` ([`\FluentCart\App\Models\License`](https://dev.fluentcart.com/database/models/license.html)) — The license extended to lifetime
 - `subscription` ([`\FluentCart\App\Models\Subscription`](https://dev.fluentcart.com/database/models/subscription.html)) — The associated subscription
 - `prev_status` (string) — The previous license status

**Source:** `fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseGenerationHandler.php:302`
**Usage:**php
```
add_action('fluent_cart/licensing/extended_to_lifetime', function ($data) {
 $license = $data['license'];
 $subscription = $data['subscription'];
 $prevStatus = $data['prev_status'];

 wp_mail(
 $license->customer->email,
 'License Extended to Lifetime',
 sprintf('Your license #%d has been extended to lifetime access!', $license->id)
 );
}, 10, 1);```

### ` license_upgraded ` [](#license-upgraded)
`fluent_cart/licensing/license_upgraded` Pro — Fires when a license is upgraded to a new plan
**When it runs:** This action fires when a license is upgraded to a different plan, typically through a plan change or upgrade flow.
**Parameters:**

- `$data` (array): License upgrade data 

 - `license` ([`\FluentCart\App\Models\License`](https://dev.fluentcart.com/database/models/license.html)) — The upgraded license
 - `order` ([`\FluentCart\App\Models\Order`](https://dev.fluentcart.com/database/models/order.html)) — The associated order
 - `subscription` ([`\FluentCart\App\Models\Subscription`](https://dev.fluentcart.com/database/models/subscription.html)) — The associated subscription
 - `updates` (array) — The update data applied to the license

**Source:** `fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseGenerationHandler.php:375`
**Usage:**php
```
add_action('fluent_cart/licensing/license_upgraded', function ($data) {
 $license = $data['license'];
 $order = $data['order'];
 $subscription = $data['subscription'];
 $updates = $data['updates'];

 fluent_cart_add_log(
 'License Upgraded',
 sprintf('License #%d upgraded for order #%d', $license->id, $order->id),
 'info'
 );
}, 10, 1);```

### ` license_deleted (admin) ` [](#license-deleted-admin)
`fluent_cart_sl/license_deleted` Pro — Fires when a license is deleted from the admin interface
**When it runs:** This action fires when an admin deletes a license through the license management UI.
**Parameters:**

- `$data` (array): License deletion data 

 - `license` ([`\FluentCart\App\Models\License`](https://dev.fluentcart.com/database/models/license.html)) — The license being deleted

**Source:** `fluent-cart-pro/app/Modules/Licensing/Http/Controllers/LicenseController.php:255`
**Usage:**php
```
add_action('fluent_cart_sl/license_deleted', function ($data) {
 $license = $data['license'];

 fluent_cart_add_log(
 'License Deleted',
 sprintf('License #%d was deleted by admin', $license->id),
 'warning'
 );
}, 10, 1);```

### ` license_deleted (order deleted) ` [](#license-deleted-order-deleted)
`fluent_cart/licensing/license_deleted` Pro — Fires when a license is deleted because its parent order was deleted
**When it runs:** This action fires when a license is automatically deleted as a result of its parent order being deleted.
**Parameters:**

- `$data` (array): License deletion data 

 - `license` ([`\FluentCart\App\Models\License`](https://dev.fluentcart.com/database/models/license.html)) — The license being deleted
 - `order` ([`\FluentCart\App\Models\Order`](https://dev.fluentcart.com/database/models/order.html)) — The parent order being deleted

**Source:** `fluent-cart-pro/app/Modules/Licensing/Hooks/license-actions.php:141`
**Usage:**php
```
add_action('fluent_cart/licensing/license_deleted', function ($data) {
 $license = $data['license'];
 $order = $data['order'];

 fluent_cart_add_log(
 'License Deleted with Order',
 sprintf('License #%d deleted because order #%d was deleted', $license->id, $order->id),
 'warning'
 );
}, 10, 1);```

## License Site Activation [](#license-site-activation)

### ` site_activated (API) ` [](#site-activated-api)
`fluent_cart/license/site_activated` Pro — Fires when a site is activated for a license via the public API
**When it runs:** This action fires when a site is successfully activated for a license through the external licensing API.
**Parameters:**

- `$site` ([`\FluentCart\App\Models\LicenseSite`](https://dev.fluentcart.com/database/models/license-site.html)) — The activated site
- `$activation` ([`\FluentCart\App\Models\LicenseActivation`](https://dev.fluentcart.com/database/models/license-activation.html)) — The license activation record
- `$license` ([`\FluentCart\App\Models\License`](https://dev.fluentcart.com/database/models/license.html)) — The associated license
- `$data` (array) — The activation request data

**Source:** `fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseApiHandler.php:255`
**Usage:**php
```
add_action('fluent_cart/license/site_activated', function ($site, $activation, $license, $data) {
 fluent_cart_add_log(
 'Site Activated via API',
 sprintf('Site %s activated for license #%d', $site->site_url, $license->id),
 'info'
 );
}, 10, 4);```

### ` site_deactivated (API) ` [](#site-deactivated-api)
`fluent_cart/license/site_deactivated` Pro — Fires when a site is deactivated via the public API
**When it runs:** This action fires when a site is successfully deactivated for a license through the external licensing API.
**Parameters:**

- `$site` ([`\FluentCart\App\Models\LicenseSite`](https://dev.fluentcart.com/database/models/license-site.html)) — The deactivated site
- `$activation` ([`\FluentCart\App\Models\LicenseActivation`](https://dev.fluentcart.com/database/models/license-activation.html)) — The license activation record
- `$license` ([`\FluentCart\App\Models\License`](https://dev.fluentcart.com/database/models/license.html)) — The associated license
- `$data` (array) — The deactivation request data

**Source:** `fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseApiHandler.php:340`
**Usage:**php
```
add_action('fluent_cart/license/site_deactivated', function ($site, $activation, $license, $data) {
 fluent_cart_add_log(
 'Site Deactivated via API',
 sprintf('Site %s deactivated for license #%d', $site->site_url, $license->id),
 'info'
 );
}, 10, 4);```

### ` site_deactivated_failed ` [](#site-deactivated-failed)
`fluent_cart/license/site_deactivated_failed` Pro — Fires when a site deactivation attempt fails
**When it runs:** This action fires when a site deactivation request fails. This can happen for multiple reasons such as an invalid license key, site not found, or activation mismatch.
**Parameters:**

- `$formattedData` (array) — Error information including the reason for failure

**Source:** `fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseApiHandler.php:295,309,321`
**Usage:**php
```
add_action('fluent_cart/license/site_deactivated_failed', function ($formattedData) {
 fluent_cart_add_log(
 'Site Deactivation Failed',
 wp_json_encode($formattedData),
 'error'
 );
}, 10, 1);```

### ` site_activated (local) ` [](#site-activated-local)
`fluent_cart_sl/site_activated` Pro — Fires when a site is activated via the local API method
**When it runs:** This action fires when a site is activated through the internal (local) license site management method.
**Parameters:**

- `$data` (array): Site activation data 

 - `site` ([`\FluentCart\App\Models\LicenseSite`](https://dev.fluentcart.com/database/models/license-site.html)) — The activated site
 - `license` ([`\FluentCart\App\Models\License`](https://dev.fluentcart.com/database/models/license.html)) — The associated license
 - `activation` ([`\FluentCart\App\Models\LicenseActivation`](https://dev.fluentcart.com/database/models/license-activation.html)) — The license activation record

**Source:** `fluent-cart-pro/app/Modules/Licensing/Concerns/CanManageLicenseSites.php:84`
**Usage:**php
```
add_action('fluent_cart_sl/site_activated', function ($data) {
 $site = $data['site'];
 $license = $data['license'];
 $activation = $data['activation'];

 fluent_cart_add_log(
 'Site Activated Locally',
 sprintf('Site %s activated for license #%d', $site->site_url, $license->id),
 'info'
 );
}, 10, 1);```

### ` site_license_deactivated ` [](#site-license-deactivated)
`fluent_cart_sl/site_license_deactivated` Pro — Fires when a license is deactivated from a site (admin or customer)
**When it runs:** This action fires when a license is deactivated from a specific site, either by an admin through the management interface or by the customer through their profile.
**Parameters:**

- `$data` (array): Site deactivation data 

 - `site` ([`\FluentCart\App\Models\LicenseSite`](https://dev.fluentcart.com/database/models/license-site.html)) — The site being deactivated
 - `license` ([`\FluentCart\App\Models\License`](https://dev.fluentcart.com/database/models/license.html)) — The associated license

**Source:** `fluent-cart-pro/app/Modules/Licensing/Concerns/CanManageLicenseSites.php:141,177`, `fluent-cart-pro/app/Modules/Licensing/Http/Controllers/CustomerProfileController.php:192`
**Usage:**php
```
add_action('fluent_cart_sl/site_license_deactivated', function ($data) {
 $site = $data['site'];
 $license = $data['license'];

 fluent_cart_add_log(
 'Site License Deactivated',
 sprintf('License #%d deactivated from site %s', $license->id, $site->site_url),
 'info'
 );
}, 10, 1);```

## Bulk License Operations [](#bulk-license-operations)

### ` before_deleting_licenses ` [](#before-deleting-licenses)
`fluent_cart_sl/before_deleting_licenses` Pro — Fires before licenses are bulk deleted by order
**When it runs:** This action fires immediately before a collection of licenses is deleted as part of a bulk operation (e.g., when an order is deleted).
**Parameters:**

- `$data` (array): Bulk deletion data 

 - `licenses` (`\Illuminate\Support\Collection`) — Collection of [License](https://dev.fluentcart.com/database/models/license.html) models about to be deleted

**Source:** `fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php:232`
**Usage:**php
```
add_action('fluent_cart_sl/before_deleting_licenses', function ($data) {
 $licenses = $data['licenses'];

 foreach ($licenses as $license) {
 fluent_cart_add_log('License Bulk Delete', sprintf('About to delete license #%d', $license->id), 'warning');
 }
}, 10, 1);```

### ` after_deleting_licenses ` [](#after-deleting-licenses)
`fluent_cart_sl/after_deleting_licenses` Pro — Fires after licenses are bulk deleted
**When it runs:** This action fires immediately after a collection of licenses has been deleted.
**Parameters:**

- `$data` (array): Bulk deletion data 

 - `licenses` (`\Illuminate\Support\Collection`) — Collection of [License](https://dev.fluentcart.com/database/models/license.html) models that were deleted

**Source:** `fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php:237`
**Usage:**php
```
add_action('fluent_cart_sl/after_deleting_licenses', function ($data) {
 $licenses = $data['licenses'];

 fluent_cart_add_log('Licenses Bulk Deleted', sprintf('%d licenses were deleted', $licenses->count()), 'warning');
}, 10, 1);```

### ` before_updating_licenses_status ` [](#before-updating-licenses-status)
`fluent_cart_sl/before_updating_licenses_status` Pro — Fires before a bulk license status update
**When it runs:** This action fires immediately before a collection of licenses has their status updated in bulk.
**Parameters:**

- `$data` (array): Bulk status update data 

 - `licenses` (`\Illuminate\Support\Collection`) — Collection of [License](https://dev.fluentcart.com/database/models/license.html) models about to be updated

**Source:** `fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php:285`
**Usage:**php
```
add_action('fluent_cart_sl/before_updating_licenses_status', function ($data) {
 $licenses = $data['licenses'];

 // Log or validate before bulk status change
}, 10, 1);```

### ` before_updating_licenses_status_to_disabled ` [](#before-updating-licenses-status-to-disabled)
`fluent_cart_sl/before_updating_licenses_status_to_disabled` Pro — Fires before licenses are bulk disabled
**When it runs:** This action fires immediately before a collection of licenses is bulk-disabled.
**Parameters:**

- `$data` (array): Bulk disable data 

 - `licenses` (`\Illuminate\Support\Collection`) — Collection of [License](https://dev.fluentcart.com/database/models/license.html) models about to be disabled

**Source:** `fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php:286`
**Usage:**php
```
add_action('fluent_cart_sl/before_updating_licenses_status_to_disabled', function ($data) {
 $licenses = $data['licenses'];

 // Perform pre-disable checks
}, 10, 1);```

### ` after_updating_licenses_status ` [](#after-updating-licenses-status)
`fluent_cart_sl/after_updating_licenses_status` Pro — Fires after a bulk license status update
**When it runs:** This action fires immediately after a collection of licenses has had their status updated in bulk.
**Parameters:**

- `$data` (array): Bulk status update data 

 - `licenses` (`\Illuminate\Support\Collection`) — Collection of [License](https://dev.fluentcart.com/database/models/license.html) models that were updated

**Source:** `fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php:290`
**Usage:**php
```
add_action('fluent_cart_sl/after_updating_licenses_status', function ($data) {
 $licenses = $data['licenses'];

 fluent_cart_add_log('Licenses Status Updated', sprintf('%d licenses updated', $licenses->count()), 'info');
}, 10, 1);```

### ` after_updating_licenses_status_to_disabled ` [](#after-updating-licenses-status-to-disabled)
`fluent_cart_sl/after_updating_licenses_status_to_disabled` Pro — Fires after licenses are bulk disabled
**When it runs:** This action fires immediately after a collection of licenses has been bulk-disabled.
**Parameters:**

- `$data` (array): Bulk disable data 

 - `licenses` (`\Illuminate\Support\Collection`) — Collection of [License](https://dev.fluentcart.com/database/models/license.html) models that were disabled

**Source:** `fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php:291`
**Usage:**php
```
add_action('fluent_cart_sl/after_updating_licenses_status_to_disabled', function ($data) {
 $licenses = $data['licenses'];

 fluent_cart_add_log('Licenses Bulk Disabled', sprintf('%d licenses disabled', $licenses->count()), 'warning');
}, 10, 1);```

---

## Cart & Checkout

Source: https://dev.fluentcart.com/hooks/actions/cart-and-checkout.html


All hooks related to the shopping flow — from adding items to the [Cart](https://dev.fluentcart.com/database/models/cart.html) through checkout rendering and the receipt/thank-you page.
## Cart Events [](#cart-events)

### ` item_added ` [](#item-added)
`fluent_cart/cart/item_added` — Fired after an item is added to the cart
**When it runs:** This action fires immediately after a product item has been successfully added to the [Cart](https://dev.fluentcart.com/database/models/cart.html) model and saved to the database. It runs before the `cart_data_items_updated` hook with the `item_added` scope.
**Parameters:**

- `$data` (array): Cart and item dataphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
 'item' => $item, // array — the cart item that was just added
];```

**Source:** `app/Models/Cart.php`
**Usage:**php
```
add_action('fluent_cart/cart/item_added', function ($data) {
 $cart = $data['cart'];
 $item = $data['item'];

 // Log the added product for analytics
 error_log('Product ' . $item['post_id'] . ' added to cart #' . $cart->id);
}, 10, 1);```

### ` item_removed ` [](#item-removed)
`fluent_cart/cart/item_removed` — Fired after an item is removed from the cart
**When it runs:** This action fires after a product item has been removed from the [Cart](https://dev.fluentcart.com/database/models/cart.html) and saved, but only when the `$triggerEvent` parameter is `true` (the default). When an item is removed silently (e.g., during a replacement operation), this hook does not fire.
**Parameters:**

- `$data` (array): Cart and removal contextphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
 'variation_id' => $variationId, // int — the variation ID that was removed
 'extra_args' => $extraArgs, // array — additional matching arguments
 'removed_item' => $removingItem, // array — the full cart item that was removed
];```

**Source:** `app/Models/Cart.php`
**Usage:**php
```
add_action('fluent_cart/cart/item_removed', function ($data) {
 $removedItem = $data['removed_item'];
 $cart = $data['cart'];

 // Track removal for abandoned cart analytics
 do_action('my_plugin/track_cart_removal', [
 'variation_id' => $data['variation_id'],
 'product_id' => $removedItem['post_id'] ?? null,
 'cart_id' => $cart->id,
 ]);
}, 10, 1);```

### ` cart_data_items_updated ` [](#cart-data-items-updated)
`fluent_cart/cart/cart_data_items_updated` — General-purpose hook for any cart data change
**When it runs:** This action fires whenever the cart data array is modified. The `scope` field tells you what operation triggered the update. It fires on item add, item remove, coupon apply, coupon remove, discount recalculation, and checkout page loading.
**Parameters:**

- 
`$data` (array): Cart and scope contextphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
 'scope' => 'item_added', // string — one of the scope values below
 'scope_data' => $scopeData, // mixed — context data depending on scope
];```

Possible `scope` values and their `scope_data`:

| scope | scope_data | 
| --- | --- |
| `'item_added'` | The cart item array that was added | 
| `'item_removed'` | The variation ID (int) that was removed | 
| `'discounts_recalculated'` | Array of applied coupon codes | 
| `'remove_coupon'` | Array of coupon codes that were removed | 
| `'apply_coupons'` | Array of coupon codes that were applied | 
| `'loading'` | Empty string (fired on checkout page load) | 

**Source:** `app/Models/Cart.php`, `app/Hooks/Handlers/ShortCodes/Checkout/CheckoutPageHandler.php`
**Usage:**php
```
add_action('fluent_cart/cart/cart_data_items_updated', function ($data) {
 $cart = $data['cart'];
 $scope = $data['scope'];

 if ($scope === 'item_added' || $scope === 'item_removed') {
 // Recalculate custom surcharges whenever items change
 my_plugin_recalculate_surcharges($cart);
 }

 if ($scope === 'apply_coupons') {
 // Log coupon usage
 error_log('Coupons applied to cart #' . $cart->id . ': ' . implode(', ', $data['scope_data']));
 }
}, 10, 1);```

### ` cart_completed ` [](#cart-completed)
`fluent_cart/cart_completed` — Fired when a cart is marked as completed after payment
**When it runs:** This action fires when the cart's stage is set to `completed` after a successful [Order](https://dev.fluentcart.com/database/models/order.html) payment. The cart's `completed_at` timestamp has already been saved at this point. This is triggered inside `StatusHelper` during order status transitions when payment is marked as paid.
**Parameters:**

- `$data` (array): Completed cart and associated orderphp
```
$data = [
 'cart' => $relatedCart, // \FluentCart\App\Models\Cart instance (stage = 'completed')
 'order' => $order, // \FluentCart\App\Models\Order instance
];```

**Source:** `app/Helpers/StatusHelper.php`
**Usage:**php
```
add_action('fluent_cart/cart_completed', function ($data) {
 $cart = $data['cart'];
 $order = $data['order'];

 // Fire a conversion pixel or sync to analytics
 my_plugin_track_conversion([
 'order_id' => $order->id,
 'total' => $order->total_amount,
 'customer_id' => $order->customer_id,
 ]);
}, 10, 1);```

## Checkout Data Events [](#checkout-data-events)

### ` prepare_other_data ` [](#prepare-other-data)
`fluent_cart/checkout/prepare_other_data` — After order creation, before finalizing
**When it runs:** This action fires during the checkout submission flow, after the draft [Order](https://dev.fluentcart.com/database/models/order.html) has been created but before it is finalized (before addresses and items are attached). This gives modules a chance to attach additional data to the order.
**Parameters:**

- `$data` (array): Full checkout contextphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
 'order' => $createdOrder, // \FluentCart\App\Models\Order — the newly created draft order
 'prev_order' => $prevOrder, // \FluentCart\App\Models\Order|null — previous order if retrying
 'request_data' => $data, // array — raw validated request data from checkout form
 'validated_data' => $validatedData, // array — sanitized/validated checkout field values
];```

**Source:** `api/Checkout/CheckoutApi.php`
**Usage:**php
```
add_action('fluent_cart/checkout/prepare_other_data', function ($data) {
 $order = $data['order'];
 $requestData = $data['request_data'];

 // Attach custom metadata to the order before it finalizes
 $customField = sanitize_text_field($requestData['custom_gift_message'] ?? '');
 if ($customField) {
 $order->updateMeta('gift_message', $customField);
 }
}, 10, 1);```

### ` cart_amount_updated ` [](#cart-amount-updated)
`fluent_cart/checkout/cart_amount_updated` — Fired when the cart total may have changed
**When it runs:** This action fires whenever an operation changes (or may change) the cart total. This includes: item removal (silent mode), coupon application, coupon removal, discount recalculation, quantity updates, order bump toggles, and tax recalculations. Use this hook to react to price changes regardless of the specific cause.
**Parameters:**

- `$data` (array): The affected cartphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
];```

**Source:** `app/Models/Cart.php`, `app/Hooks/Cart/WebCheckoutHandler.php`, `app/Modules/Tax/TaxModule.php`
**Usage:**php
```
add_action('fluent_cart/checkout/cart_amount_updated', function ($data) {
 $cart = $data['cart'];

 // Recalculate a custom fee based on the new cart total
 $estimatedTotal = $cart->getEstimatedTotal();
 if ($estimatedTotal > 10000) { // over $100.00
 // Apply free shipping threshold logic
 my_plugin_apply_free_shipping($cart);
 }
}, 10, 1);```

### ` shipping_data_changed ` [](#shipping-data-changed)
`fluent_cart/checkout/shipping_data_changed` — Fired when shipping data changes
**When it runs:** This action fires when shipping-related data on the cart changes, such as when a new shipping method is selected, the shipping charge changes, or the shipping address is updated in a way that affects shipping calculations.
**Parameters:**

- `$data` (array): The affected cartphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
];```

**Source:** `app/Helpers/CartHelper.php`, `app/Hooks/Cart/WebCheckoutHandler.php`
**Usage:**php
```
add_action('fluent_cart/checkout/shipping_data_changed', function ($data) {
 $cart = $data['cart'];
 $shippingData = $cart->checkout_data['shipping_data'] ?? [];

 // Log shipping method selection for analytics
 error_log('Cart #' . $cart->id . ' shipping method: ' . ($shippingData['shipping_method_id'] ?? 'none'));
}, 10, 1);```

### ` form_data_changed ` [](#form-data-changed)
`fluent_cart/checkout/form_data_changed` — Fired when checkout form data changes
**When it runs:** This action fires when the checkout form data is updated via AJAX, such as when a customer changes their address, toggles "ship to different address", or any form field is updated that triggers a server-side recalculation.
**Parameters:**

- `$data` (array): The affected cartphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
];```

**Source:** `app/Hooks/Cart/WebCheckoutHandler.php`
**Usage:**php
```
add_action('fluent_cart/checkout/form_data_changed', function ($data) {
 $cart = $data['cart'];
 $formData = $cart->checkout_data['form_data'] ?? [];

 // Check if the billing country requires special handling
 $billingCountry = $formData['billing_country'] ?? '';
 if (in_array($billingCountry, ['BR', 'IN'])) {
 // Add country-specific checkout notices
 my_plugin_add_country_notice($cart, $billingCountry);
 }
}, 10, 1);```

### ` customer_data_saved ` [](#customer-data-saved)
`fluent_cart/checkout/customer_data_saved` — Fired when customer checkout data is saved
**When it runs:** This action fires when a specific piece of customer data is saved during the checkout process. The hook provides both the old and new values, making it useful for detecting changes. It fires after the data has already been persisted to the cart model.
**Parameters:**

- `$data` (array): Customer data change contextphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
 'key' => $key, // string — the data key that changed (e.g. 'billing_country')
 'value' => $value, // mixed — the new value
 'old_value' => $prevValue, // mixed — the previous value
 'old_data' => $oldCheckoutData, // array — the full previous checkout_data array
];```

**Source:** `app/Hooks/Cart/WebCheckoutHandler.php`
**Usage:**php
```
add_action('fluent_cart/checkout/customer_data_saved', function ($data) {
 $cart = $data['cart'];
 $key = $data['key'];

 // React to billing country changes for tax recalculation
 if ($key === 'billing_country' && $data['value'] !== $data['old_value']) {
 error_log('Cart #' . $cart->id . ' billing country changed from '
 . $data['old_value'] . ' to ' . $data['value']);
 }
}, 10, 1);```

### ` tax_data_changed ` [](#tax-data-changed)
`fluent_cart/checkout/tax_data_changed` — Fired when tax-relevant data changes
**When it runs:** This action fires when customer data changes in a way that could affect tax calculations (e.g., billing country, state, or VAT number changes). It is dispatched from within the `customer_data_saved` listener and shares the same parameter structure.
**Parameters:**

- `$data` (array): Same structure as `customer_data_saved`php
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
 'key' => $key, // string — the data key that changed
 'value' => $value, // mixed — the new value
 'old_value' => $prevValue, // mixed — the previous value
 'old_data' => $oldCheckoutData, // array — the full previous checkout_data array
];```

**Source:** `app/Hooks/Cart/WebCheckoutHandler.php`
**Usage:**php
```
add_action('fluent_cart/checkout/tax_data_changed', function ($data) {
 $cart = $data['cart'];

 // Trigger a third-party tax service recalculation
 my_tax_service_recalculate($cart);
}, 10, 1);```

## Checkout Page Rendering [](#checkout-page-rendering)

All hooks in this section fire during server-side HTML rendering of the checkout page. They use output buffering, so you should **echo** (not return) any custom HTML you want to inject.
### ` before_checkout_page_start ` [](#before-checkout-page-start)
`fluent_cart/before_checkout_page_start` — Before the checkout page wrapper div
**When it runs:** This action fires immediately before the main checkout page `<div>` wrapper is opened. Use it to output HTML or scripts that should appear above the entire checkout page.
**Parameters:**

- `$data` (array): The current cartphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
];```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`
**Usage:**php
```
add_action('fluent_cart/before_checkout_page_start', function ($data) {
 $cart = $data['cart'];
 echo '<div class="my-checkout-banner">';
 echo '<p>Free shipping on orders over $50!</p>';
 echo '</div>';
}, 10, 1);```

### ` afrer_checkout_page_start ` [](#afrer-checkout-page-start)
`fluent_cart/afrer_checkout_page_start` — After the checkout page wrapper div opens
**When it runs:** This action fires right after the main checkout page `<div>` wrapper opens. Note the typo in the hook name (`afrer` instead of `after`) — this matches the actual hook name in the source code and must be used as-is.
**Parameters:**

- `$data` (array): The current cartphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
];```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`
**Usage:**php
```
add_action('fluent_cart/afrer_checkout_page_start', function ($data) {
 $cart = $data['cart'];
 // Insert a progress indicator at the top of the checkout page
 echo '<div class="my-checkout-progress-bar">Step 1 of 3: Checkout</div>';
}, 10, 1);```

### ` before_checkout_form ` [](#before-checkout-form)
`fluent_cart/before_checkout_form` — Before the checkout form element
**When it runs:** This action fires just before the `<form>` tag for the checkout form is rendered.
**Parameters:**

- `$data` (array): The current cartphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
];```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`
**Usage:**php
```
add_action('fluent_cart/before_checkout_form', function ($data) {
 echo '<div class="my-trust-badges">';
 echo '<img src="/wp-content/uploads/secure-checkout.svg" alt="Secure Checkout" />';
 echo '</div>';
}, 10, 1);```

### ` checkout_form_opening ` [](#checkout-form-opening)
`fluent_cart/checkout_form_opening` — Right after the checkout form tag opens
**When it runs:** This action fires immediately after the `<form>` tag opens, before any form fields are rendered. Use it to insert hidden fields, nonce fields, or other elements that must be inside the form.
**Parameters:**

- `$data` (array): The current cartphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
];```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`
**Usage:**php
```
add_action('fluent_cart/checkout_form_opening', function ($data) {
 // Add a hidden field for tracking
 echo '<input type="hidden" name="my_tracking_ref" value="' . esc_attr(my_get_tracking_ref()) . '" />';
}, 10, 1);```

### ` before_billing_fields ` [](#before-billing-fields)
`fluent_cart/before_billing_fields` — Before billing address fields
**When it runs:** This action fires after the name/email fields and the "create account" checkbox, but before the billing address fields section is rendered.
**Parameters:**

- `$data` (array): The current cartphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
];```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`
**Usage:**php
```
add_action('fluent_cart/before_billing_fields', function ($data) {
 echo '<p class="my-billing-note">Please enter your billing address exactly as it appears on your card statement.</p>';
}, 10, 1);```

### ` before_billing_fields_section ` [](#before-billing-fields-section)
`fluent_cart/before_billing_fields_section` — Before the billing address field section renders
**When it runs:** This action fires right before the billing address form section (with its heading and input fields) is rendered. It fires inside the `renderBillingAddressFields()` method, after billing field data has been prepared and filtered.
**Parameters:**

- `$data` (array): The current cartphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
];```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`
**Usage:**php
```
add_action('fluent_cart/before_billing_fields_section', function ($data) {
 echo '<div class="my-billing-section-intro">';
 echo '<h4>Where should we send the invoice?</h4>';
 echo '</div>';
}, 10, 1);```

### ` after_billing_fields_section ` [](#after-billing-fields-section)
`fluent_cart/after_billing_fields_section` — After the billing address field section
**When it runs:** This action fires after the billing address fields section and the "ship to different address" checkbox have been rendered. It only fires when the cart requires shipping.
**Parameters:**

- `$data` (array): The current cartphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
];```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`
**Usage:**php
```
add_action('fluent_cart/after_billing_fields_section', function ($data) {
 $cart = $data['cart'];
 // Add a note between billing and shipping sections
 echo '<div class="my-address-note">';
 echo '<p>Shipping is calculated based on your delivery address.</p>';
 echo '</div>';
}, 10, 1);```

### ` before_shipping_fields_section ` [](#before-shipping-fields-section)
`fluent_cart/before_shipping_fields_section` — Before the shipping address field section
**When it runs:** This action fires right before the shipping address form section is rendered. The shipping section may be hidden via CSS if "ship to different address" is not checked.
**Parameters:**

- `$data` (array): The current cartphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
];```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`
**Usage:**php
```
add_action('fluent_cart/before_shipping_fields_section', function ($data) {
 echo '<p class="my-shipping-note">Enter the address where you want us to deliver your order.</p>';
}, 10, 1);```

### ` after_shipping_fields_section ` [](#after-shipping-fields-section)
`fluent_cart/after_shipping_fields_section` — After the shipping address field section
**When it runs:** This action fires immediately after the shipping address form section is rendered.
**Parameters:**

- `$data` (array): The current cartphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
];```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`
**Usage:**php
```
add_action('fluent_cart/after_shipping_fields_section', function ($data) {
 echo '<div class="my-delivery-estimate">';
 echo '<p>Estimated delivery: 3-5 business days</p>';
 echo '</div>';
}, 10, 1);```

### ` before_payment_methods ` [](#before-payment-methods)
`fluent_cart/before_payment_methods` — Before payment method options
**When it runs:** This action fires before the payment methods section is rendered on the checkout page. It also fires in the modal checkout renderer and the Gutenberg block inner blocks renderer.
**Parameters:**

- `$data` (array): The current cartphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
];```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`, `app/Services/Renderer/ModalCheckoutRenderer.php`, `app/Hooks/Handlers/BlockEditors/Checkout/InnerBlocks/InnerBlocks.php`
**Usage:**php
```
add_action('fluent_cart/before_payment_methods', function ($data) {
 echo '<div class="my-payment-security-note">';
 echo '<p>All transactions are encrypted and secure.</p>';
 echo '</div>';
}, 10, 1);```

### ` after_payment_methods ` [](#after-payment-methods)
`fluent_cart/after_payment_methods` — After payment method options
**When it runs:** This action fires after the payment methods section has been rendered, before the checkout submit button.
**Parameters:**

- `$data` (array): The current cartphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
];```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`
**Usage:**php
```
add_action('fluent_cart/after_payment_methods', function ($data) {
 echo '<div class="my-payment-icons">';
 echo '<img src="/wp-content/uploads/visa.svg" alt="Visa" />';
 echo '<img src="/wp-content/uploads/mastercard.svg" alt="Mastercard" />';
 echo '</div>';
}, 10, 1);```

### ` after_checkout_button ` [](#after-checkout-button)
`fluent_cart/after_checkout_button` — After the checkout submit button
**When it runs:** This action fires immediately after the "Place order" submit button is rendered.
**Parameters:**

- `$data` (array): The current cartphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
];```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`
**Usage:**php
```
add_action('fluent_cart/after_checkout_button', function ($data) {
 echo '<p class="my-checkout-disclaimer">';
 echo 'By placing your order you agree to our <a href="/terms">Terms of Service</a>.';
 echo '</p>';
}, 10, 1);```

### ` after_order_notes ` [](#after-order-notes)
`fluent_cart/after_order_notes` — After the order notes section in the summary sidebar
**When it runs:** This action fires after the order notes field in the checkout summary/sidebar section, inside the order summary wrapper.
**Parameters:**

- `$data` (array): The current cartphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
];```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`
**Usage:**php
```
add_action('fluent_cart/after_order_notes', function ($data) {
 echo '<div class="my-gift-wrap-option">';
 echo '<label><input type="checkbox" name="gift_wrap" value="yes" /> Add gift wrapping (+$5.00)</label>';
 echo '</div>';
}, 10, 1);```

### ` after_order_notes_field ` [](#after-order-notes-field)
`fluent_cart/after_order_notes_field` — After the order notes form field
**When it runs:** This action fires right after the order notes textarea field is rendered, inside the `renderOrderNoteField()` method. Note that the order notes field only appears when the cart requires shipping (unless overridden by the `fluent_cart/disable_order_notes_for_digital_products` filter).
**Parameters:**

- `$data` (array): The current cartphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
];```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`
**Usage:**php
```
add_action('fluent_cart/after_order_notes_field', function ($data) {
 echo '<p class="my-notes-hint"><em>Example: Leave package at the back door.</em></p>';
}, 10, 1);```

### ` after_checkout_form ` [](#after-checkout-form)
`fluent_cart/after_checkout_form` — After the checkout form closes
**When it runs:** This action fires immediately after the closing `</form>` tag of the checkout form.
**Parameters:**

- `$data` (array): The current cartphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
];```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`
**Usage:**php
```
add_action('fluent_cart/after_checkout_form', function ($data) {
 // Render a support chat widget below the form
 echo '<div class="my-checkout-support">';
 echo '<p>Need help? <a href="#" onclick="openChat()">Chat with us</a></p>';
 echo '</div>';
}, 10, 1);```

### ` before_checkout_page_close ` [](#before-checkout-page-close)
`fluent_cart/before_checkout_page_close` — Before the checkout page wrapper div closes
**When it runs:** This action fires just before the closing `</div>` of the main checkout page wrapper.
**Parameters:**

- `$data` (array): The current cartphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
];```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`
**Usage:**php
```
add_action('fluent_cart/before_checkout_page_close', function ($data) {
 echo '<div class="my-checkout-footer-badges">';
 echo '<p>30-day money-back guarantee</p>';
 echo '</div>';
}, 10, 1);```

### ` after_checkout_page ` [](#after-checkout-page)
`fluent_cart/after_checkout_page` — After the entire checkout page wrapper
**When it runs:** This action fires after the checkout page wrapper `</div>` has been closed. Use it for scripts, tracking pixels, or other content that should appear after the entire checkout page.
**Parameters:**

- `$data` (array): The current cartphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
];```

**Source:** `app/Services/Renderer/CheckoutRenderer.php`
**Usage:**php
```
add_action('fluent_cart/after_checkout_page', function ($data) {
 $cart = $data['cart'];
 // Output a tracking script after the checkout page
 echo '<script>myAnalytics.trackCheckoutView({ cartId: ' . intval($cart->id) . ' });</script>';
}, 10, 1);```

### ` before_summary_total ` [](#before-summary-total)
`fluent_cart/checkout/before_summary_total` — Before the total line in the cart summary
**When it runs:** This action fires in the cart summary sidebar, after the subtotal, shipping, and discount lines but before the coupon input field and the final total line.
**Parameters:**

- `$data` (array): The current cartphp
```
$data = [
 'cart' => $cart, // \FluentCart\App\Models\Cart instance
];```

**Source:** `app/Services/Renderer/CartSummaryRender.php`
**Usage:**php
```
add_action('fluent_cart/checkout/before_summary_total', function ($data) {
 $cart = $data['cart'];
 // Add a custom fee line in the summary
 echo '<li class="my-custom-fee">';
 echo '<span class="fct_summary_label">Processing Fee</span>';
 echo '<span class="fct_summary_value">$2.50</span>';
 echo '</li>';
}, 10, 1);```

## Cart Line Items Rendering [](#cart-line-items-rendering)

These hooks fire during the rendering of individual cart line items on the checkout page. They all receive the same parameter structure from `CartItemRenderer::getEventInfo()`, which includes [Cart](https://dev.fluentcart.com/database/models/cart.html), [Product](https://dev.fluentcart.com/database/models/product.html), and [ProductVariation](https://dev.fluentcart.com/database/models/product-variation.html) model instances. Use **echo** to output custom HTML.
### ` line_meta ` [](#line-meta)
`fluent_cart/cart/line_item/line_meta` — After line item content, for custom metadata
**When it runs:** This action fires after the main item content (title, variant info, child variants) inside the item info area, but before the price section. Use it to display custom per-item metadata such as personalization details or custom options.
**Parameters:**

- `$data` (array): Line item rendering contextphp
```
$data = [
 'item' => $item, // array — the cart item data (post_id, title, quantity, unit_price, etc.)
 'cart' => $cart, // \FluentCart\App\Models\Cart|null instance
 'product' => $product, // Product model or null
 'variant' => $variant, // ProductVariation model or null
];```

**Source:** `app/Services/Renderer/CartItemRenderer.php`
**Usage:**php
```
add_action('fluent_cart/cart/line_item/line_meta', function ($data) {
 $item = $data['item'];

 // Display custom engraving text if present
 $engraving = $item['custom_fields']['engraving'] ?? '';
 if ($engraving) {
 echo '<div class="my-engraving-preview">';
 echo '<small>Engraving: ' . esc_html($engraving) . '</small>';
 echo '</div>';
 }
}, 10, 1);```

### ` before_total ` [](#before-total)
`fluent_cart/cart/line_item/before_total` — Before the line item price/total
**When it runs:** This action fires inside the price area of a cart line item, before the item total (and any promotional strikethrough price) is displayed.
**Parameters:**

- `$data` (array): Line item rendering contextphp
```
$data = [
 'item' => $item, // array — the cart item data
 'cart' => $cart, // \FluentCart\App\Models\Cart|null instance
 'product' => $product, // Product model or null
 'variant' => $variant, // ProductVariation model or null
];```

**Source:** `app/Services/Renderer/CartItemRenderer.php`
**Usage:**php
```
add_action('fluent_cart/cart/line_item/before_total', function ($data) {
 $item = $data['item'];
 $savings = ($item['other_info']['original_price'] ?? 0) - ($item['unit_price'] ?? 0);
 if ($savings > 0) {
 echo '<span class="my-savings-badge">You save ' . esc_html(\FluentCart\App\Helpers\Helper::toDecimal($savings)) . '</span>';
 }
}, 10, 1);```

### ` after_total ` [](#after-total)
`fluent_cart/cart/line_item/after_total` — After the line item price/total
**When it runs:** This action fires inside the price area of a cart line item, after the item total is displayed.
**Parameters:**

- `$data` (array): Line item rendering contextphp
```
$data = [
 'item' => $item, // array — the cart item data
 'cart' => $cart, // \FluentCart\App\Models\Cart|null instance
 'product' => $product, // Product model or null
 'variant' => $variant, // ProductVariation model or null
];```

**Source:** `app/Services/Renderer/CartItemRenderer.php`
**Usage:**php
```
add_action('fluent_cart/cart/line_item/after_total', function ($data) {
 $item = $data['item'];
 $paymentType = $item['other_info']['payment_type'] ?? '';
 if ($paymentType === 'subscription') {
 echo '<span class="my-recurring-label"><small>Recurring</small></span>';
 }
}, 10, 1);```

### ` before_main_title ` [](#before-main-title)
`fluent_cart/cart/line_item/before_main_title` — Before the product title in a line item
**When it runs:** This action fires at the very beginning of the item title area, before the quantity badge, product name, and variant title.
**Parameters:**

- `$data` (array): Line item rendering contextphp
```
$data = [
 'item' => $item, // array — the cart item data
 'cart' => $cart, // \FluentCart\App\Models\Cart|null instance
 'product' => $product, // Product model or null
 'variant' => $variant, // ProductVariation model or null
];```

**Source:** `app/Services/Renderer/CartItemRenderer.php`
**Usage:**php
```
add_action('fluent_cart/cart/line_item/before_main_title', function ($data) {
 $item = $data['item'];
 // Add a "Sale" badge before the product title
 if (!empty($item['other_info']['is_on_sale'])) {
 echo '<span class="my-sale-badge">Sale</span>';
 }
}, 10, 1);```

### ` after_main_title ` [](#after-main-title)
`fluent_cart/cart/line_item/after_main_title` — After the product title in a line item
**When it runs:** This action fires at the end of the item title area, after the product name, variant title, and payment type information (subscription details / per-unit price).
**Parameters:**

- `$data` (array): Line item rendering contextphp
```
$data = [
 'item' => $item, // array — the cart item data
 'cart' => $cart, // \FluentCart\App\Models\Cart|null instance
 'product' => $product, // Product model or null
 'variant' => $variant, // ProductVariation model or null
];```

**Source:** `app/Services/Renderer/CartItemRenderer.php`
**Usage:**php
```
add_action('fluent_cart/cart/line_item/after_main_title', function ($data) {
 $item = $data['item'];
 // Show estimated delivery date per item
 $deliveryDays = $item['other_info']['delivery_days'] ?? null;
 if ($deliveryDays) {
 $date = date('M j', strtotime("+{$deliveryDays} days"));
 echo '<div class="my-delivery-estimate"><small>Est. delivery: ' . esc_html($date) . '</small></div>';
 }
}, 10, 1);```

## Receipt / Thank You Page [](#receipt-thank-you-page)

These hooks fire during the rendering of the thank-you / receipt page shown after a successful checkout. The `$config` parameter passed to most hooks contains the [Order](https://dev.fluentcart.com/database/models/order.html) model instance along with view context. All rendering hooks use output buffering — use **echo** to inject custom HTML.
### ` before_header ` [](#before-header)
`fluent_cart/receipt/thank_you/before_header` — Before the thank-you page header
**When it runs:** This action fires at the very beginning of the thank-you page content, before the header section (which contains the success/pending icon and title).
**Parameters:**

- `$config` (array): Thank-you page configurationphp
```
$config = [
 'order' => $order, // \FluentCart\App\Models\Order instance
 'is_first_time' => true|false, // bool — whether this is the first view of this receipt
 'order_operation' => $orderOperation, // mixed — order operation context or null
];```

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`
**Usage:**php
```
add_action('fluent_cart/receipt/thank_you/before_header', function ($config) {
 $order = $config['order'];
 echo '<div class="my-confetti-wrapper" data-order-id="' . intval($order->id) . '"></div>';
}, 10, 1);```

### ` after_header ` [](#after-header)
`fluent_cart/receipt/thank_you/after_header` — After the thank-you page header
**When it runs:** This action fires after the header section (the success/pending icon and title) is fully rendered, before the body section begins.
**Parameters:**

- `$config` (array): Thank-you page configuration (same structure as `before_header`)

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`
**Usage:**php
```
add_action('fluent_cart/receipt/thank_you/after_header', function ($config) {
 $order = $config['order'];
 if ($order->payment_status === 'paid') {
 echo '<div class="my-share-prompt">';
 echo '<p>Love your purchase? Share it with friends!</p>';
 echo '</div>';
 }
}, 10, 1);```

### ` after_header_title ` [](#after-header-title)
`fluent_cart/receipt/thank_you/after_header_title` — After the header title text
**When it runs:** This action fires inside the header section, after the "Purchase Successful!" or "Payment Pending!" heading, but still within the header wrapper div. Use it to add a subtitle or additional context below the main title.
**Parameters:**

- `$config` (array): Thank-you page configuration (same structure as `before_header`)

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`
**Usage:**php
```
add_action('fluent_cart/receipt/thank_you/after_header_title', function ($config) {
 $order = $config['order'];
 echo '<p class="my-order-ref">Order Reference: #' . esc_html($order->invoice_no) . '</p>';
}, 10, 1);```

### ` before_body ` [](#before-body)
`fluent_cart/receipt/thank_you/before_body` — Before the thank-you page body
**When it runs:** This action fires after the header section and before the body section, which contains the order details, items, subscriptions, downloads, licenses, and addresses.
**Parameters:**

- `$config` (array): Thank-you page configuration (same structure as `before_header`)

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`
**Usage:**php
```
add_action('fluent_cart/receipt/thank_you/before_body', function ($config) {
 echo '<div class="my-receipt-notice">';
 echo '<p>A confirmation email has been sent to your email address.</p>';
 echo '</div>';
}, 10, 1);```

### ` after_body ` [](#after-body)
`fluent_cart/receipt/thank_you/after_body` — After the thank-you page body
**When it runs:** This action fires after the body section (order details, items, addresses) is fully rendered, before the page wrapper closes.
**Parameters:**

- `$config` (array): Thank-you page configuration (same structure as `before_header`)

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`
**Usage:**php
```
add_action('fluent_cart/receipt/thank_you/after_body', function ($config) {
 echo '<div class="my-upsell-section">';
 echo '<h3>You might also like</h3>';
 // Render recommended products
 echo '</div>';
}, 10, 1);```

### ` before_order_header ` [](#before-order-header)
`fluent_cart/receipt/thank_you/before_order_header` — Before the order header in the receipt body
**When it runs:** This action fires inside the receipt body, before the order header area (which shows the customer greeting and order number).
**Parameters:**

- `$config` (array): Thank-you page configuration (same structure as `before_header`)

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`
**Usage:**php
```
add_action('fluent_cart/receipt/thank_you/before_order_header', function ($config) {
 echo '<div class="my-receipt-date">';
 echo '<p>Order placed on: ' . esc_html(date('F j, Y')) . '</p>';
 echo '</div>';
}, 10, 1);```

### ` after_order_header ` [](#after-order-header)
`fluent_cart/receipt/thank_you/after_order_header` — After the order header in the receipt body
**When it runs:** This action fires after the order header (customer greeting, order number, and payment status message), before the tax information and order items.
**Parameters:**

- `$config` (array): Thank-you page configuration (same structure as `before_header`)

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`
**Usage:**php
```
add_action('fluent_cart/receipt/thank_you/after_order_header', function ($config) {
 $order = $config['order'];
 if ($order->note) {
 echo '<div class="my-order-note">';
 echo '<strong>Your note:</strong> ' . esc_html($order->note);
 echo '</div>';
 }
}, 10, 1);```

### ` before_order_items ` [](#before-order-items)
`fluent_cart/receipt/thank_you/before_order_items` — Before the order items list in the receipt
**When it runs:** This action fires after the store tax information and before the order items table is rendered.
**Parameters:**

- `$config` (array): Thank-you page configuration (same structure as `before_header`)

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`
**Usage:**php
```
add_action('fluent_cart/receipt/thank_you/before_order_items', function ($config) {
 echo '<div class="my-items-intro"><h4>Here is what you ordered:</h4></div>';
}, 10, 1);```

### ` after_order_items ` [](#after-order-items)
`fluent_cart/receipt/thank_you/after_order_items` — After the order items list in the receipt
**When it runs:** This action fires after the order items table (including the totals breakdown), before the subscription items, downloads, licenses, and address sections.
**Parameters:**

- `$config` (array): Thank-you page configuration (same structure as `before_header`)

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`
**Usage:**php
```
add_action('fluent_cart/receipt/thank_you/after_order_items', function ($config) {
 $order = $config['order'];
 // Show a referral code after the items list
 echo '<div class="my-referral-block">';
 echo '<p>Share your referral code <strong>REF-' . intval($order->customer_id) . '</strong> and earn 10% credit!</p>';
 echo '</div>';
}, 10, 1);```

### ` before_footer_buttons ` [](#before-footer-buttons)
`fluent_cart/receipt/thank_you/before_footer_buttons` — Before the footer buttons
**When it runs:** This action fires in the receipt footer area, before the "View Order" and "Download Receipt" buttons are rendered.
**Parameters:**

- `$config` (array): Thank-you page configuration (same structure as `before_header`)

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`
**Usage:**php
```
add_action('fluent_cart/receipt/thank_you/before_footer_buttons', function ($config) {
 echo '<div class="my-footer-message">';
 echo '<p>Thank you for shopping with us!</p>';
 echo '</div>';
}, 10, 1);```

### ` after_footer_buttons ` [](#after-footer-buttons)
`fluent_cart/receipt/thank_you/after_footer_buttons` — After the footer buttons
**When it runs:** This action fires in the receipt footer area, after the "View Order" and "Download Receipt" buttons have been rendered.
**Parameters:**

- `$config` (array): Thank-you page configuration (same structure as `before_header`)

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`
**Usage:**php
```
add_action('fluent_cart/receipt/thank_you/after_footer_buttons', function ($config) {
 echo '<div class="my-social-share">';
 echo '<p>Follow us on social media for updates and exclusive offers.</p>';
 echo '</div>';
}, 10, 1);```

### ` after_receipt ` [](#after-receipt)
`fluent_cart/after_receipt` — After the entire receipt/thank-you page
**When it runs:** This action fires after the complete thank-you page has been rendered, including the footer. It fires on every receipt view (both first-time and returning visits). This hook is also present in the legacy `thank_you.php` view template.
**Parameters:**

- `$data` (array): Order and view contextphp
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order instance
 'is_first_time' => true|false, // bool — whether this is the first view of this receipt
 'order_operation' => $orderOperation, // mixed — order operation context or null
];```

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`, `app/Views/invoice/thank_you.php`
**Usage:**php
```
add_action('fluent_cart/after_receipt', function ($data) {
 $order = $data['order'];

 // Render a customer satisfaction survey
 echo '<div class="my-survey-widget">';
 echo '<h4>How was your experience?</h4>';
 echo '<a href="/survey?order=' . intval($order->id) . '">Take a quick survey</a>';
 echo '</div>';
}, 10, 1);```

### ` after_receipt_first_time ` [](#after-receipt-first-time)
`fluent_cart/after_receipt_first_time` — Only on the first receipt view (for conversion tracking)
**When it runs:** This action fires only on the first time a customer views the receipt page after a purchase. It does not fire on subsequent visits to the same receipt URL. This is the ideal hook for firing conversion tracking pixels, analytics events, or affiliate postback URLs.
**Parameters:**

- `$data` (array): Order and operation contextphp
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order instance
 'order_operation' => $orderOperation, // mixed — order operation context or null
];```

**Source:** `app/Services/Renderer/Receipt/ThankYouRender.php`, `app/Views/invoice/thank_you.php`
**Usage:**php
```
add_action('fluent_cart/after_receipt_first_time', function ($data) {
 $order = $data['order'];
 $total = \FluentCart\App\Helpers\Helper::toDecimal($order->total_amount);

 // Fire a conversion pixel only on first receipt view
 echo '<script>';
 echo 'fbq("track", "Purchase", { value: ' . esc_js($total) . ', currency: "' . esc_js($order->currency) . '" });';
 echo '</script>';

 // Google Ads conversion
 echo '<script>';
 echo 'gtag("event", "conversion", { send_to: "AW-XXXXX/YYYYY", value: ' . esc_js($total) . ', currency: "' . esc_js($order->currency) . '", transaction_id: "' . esc_js($order->invoice_no) . '" });';
 echo '</script>';
}, 10, 1);```

### ` before_render_redirect_page ` [](#before-render-redirect-page)
`fluent_cart/before_render_redirect_page` — Before the payment redirect/receipt page renders
**When it runs:** This action fires at the very beginning of the receipt shortcode handler, before any receipt or redirect page content is rendered. It provides the raw URL parameters used to identify the order and transaction. Use it for early validation, logging, or to set up resources needed by the receipt page.
**Parameters:**

- `$data` (array): URL parameters for the receipt/redirectphp
```
$data = [
 'order_hash' => $orderHash, // string — the order UUID from the URL
 'trx_hash' => $transactionHash, // string — the transaction hash from the URL
 'method' => $method, // string — the payment method slug
 'is_receipt' => $isReceipt, // bool — true if this is a receipt page, false if redirect
];```

**Source:** `app/Hooks/Handlers/ShortCodes/ReceiptHandler.php`
**Usage:**php
```
add_action('fluent_cart/before_render_redirect_page', function ($data) {
 // Log receipt page visits for debugging payment callbacks
 if ($data['is_receipt'] && $data['order_hash']) {
 error_log('Receipt page visited for order: ' . $data['order_hash']
 . ' via method: ' . $data['method']);
 }
}, 10, 1);```

---

## Customers & Users

Source: https://dev.fluentcart.com/hooks/actions/customers-and-users.html


All hooks related to [Customer](https://dev.fluentcart.com/database/models/customer.html) lifecycle, user registration, and the customer-facing frontend portal.
## Customer Status Changes [](#customer-status-changes)

### ` customer_status_to_{status} ` [](#customer-status-to-status)
`fluent_cart/customer_status_to_{$newStatus}` — Fired when a customer's status changes to a specific status
**When it runs:** This dynamic action fires immediately after a [Customer](https://dev.fluentcart.com/database/models/customer.html)'s status is updated and saved to the database. A separate hook is dispatched for each target status, allowing you to listen for transitions to a single status (e.g., `active` or `inactive`) without inspecting the payload.
**Parameters:**

- `$data` (array): Customer status transition dataphp
```
$data = [
 'customer' => $customer, // (Customer) The customer model instance (already updated)
 'old_status' => 'inactive', // (string) Previous status before the change
 'new_status' => 'active', // (string) The new status that was just applied
];```

**Available dynamic variants:** `active`, `inactive`
**Source:** `app/Models/Customer.php`
**Usage:**php
```
// Listen specifically for customers becoming active
add_action('fluent_cart/customer_status_to_active', function ($data) {
 $customer = $data['customer'];
 // Send a reactivation welcome-back email
 wp_mail(
 $customer->email,
 'Welcome back!',
 'Your account has been reactivated.'
 );
}, 10, 1);```

### ` customer_status_updated ` [](#customer-status-updated)
`fluent_cart/customer_status_updated` — Fired on any customer status change
**When it runs:** This action fires immediately after the dynamic `fluent_cart/customer_status_to_{$newStatus}` hook for every customer status change. Use this hook when you need to respond to all status transitions regardless of the target status.
**Parameters:**

- `$data` (array): Customer status transition dataphp
```
$data = [
 'customer' => $customer, // (Customer) The customer model instance (already updated)
 'old_status' => 'active', // (string) Previous status before the change
 'new_status' => 'inactive', // (string) The new status that was just applied
];```

**Source:** `app/Models/Customer.php`
**Usage:**php
```
add_action('fluent_cart/customer_status_updated', function ($data) {
 $customer = $data['customer'];
 // Log every status transition
 fluent_cart_add_log(
 'Customer Status Changed',
 sprintf(
 'Customer #%d (%s) status changed from %s to %s',
 $customer->id,
 $customer->email,
 $data['old_status'],
 $data['new_status']
 ),
 'info'
 );
}, 10, 1);```

## Customer Data [](#customer-data)

### ` customer_email_changed ` [](#customer-email-changed)
`fluent_cart/customer_email_changed` — Fired when a customer's email is updated via WordPress profile
**When it runs:** This action fires when a WordPress user updates their email address (via `profile_update`) and no existing FluentCart [Customer](https://dev.fluentcart.com/database/models/customer.html) record matches the new email. In that case the existing customer row is updated in place with the new email. If a customer record already exists for the new email, this hook does **not** fire -- instead, resources are moved and `fluent_cart/customer_resources_moved` fires.
**Parameters:**

- `$data` (array): Email change dataphp
```
$data = [
 'old_customer' => $oldCustomer, // (Customer) The customer model (already updated with new email)
 'new_customer' => $oldCustomer, // (Customer) Same customer instance (already updated)
 'old_email' => '[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)', // (string) The previous email address
 'new_email' => '[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)', // (string) The new email address
 'userId' => 42, // (int) WordPress user ID
];```

**Note:** Both `old_customer` and `new_customer` reference the same Customer model instance. The customer record has already been updated with the new email at the time this hook fires.
**Source:** `app/Hooks/Handlers/UserHandler.php`
**Usage:**php
```
add_action('fluent_cart/customer_email_changed', function ($data) {
 $customer = $data['old_customer'];
 // Sync the email change to an external CRM
 my_crm_update_email(
 $customer->id,
 $data['old_email'],
 $data['new_email']
 );
}, 10, 1);```

### ` customer_resources_moved ` [](#customer-resources-moved)
`fluent_cart/customer_resources_moved` — Fired after all resources are moved between customers
**When it runs:** This action fires after a WordPress user's email change triggers a merge between two [Customer](https://dev.fluentcart.com/database/models/customer.html) records. When the new email already belongs to an existing FluentCart customer, all resources ([Order](https://dev.fluentcart.com/database/models/order.html), [Subscription](https://dev.fluentcart.com/database/models/subscription.html), [AppliedCoupon](https://dev.fluentcart.com/database/models/applied-coupon.html), [Cart](https://dev.fluentcart.com/database/models/cart.html), customer meta, addresses, and download permissions) are transferred from the old customer to the existing customer. This hook fires once the migration is complete.
**Parameters:**

- `$data` (array): Resource migration dataphp
```
$data = [
 'from_customer_id' => 10, // (int) The source customer ID (resources moved away)
 'to_customer_id' => 25, // (int) The target customer ID (resources moved to)
];```

**Migrated resources:**

- `OrderDownloadPermission` records
- [Order](https://dev.fluentcart.com/database/models/order.html) records
- [AppliedCoupon](https://dev.fluentcart.com/database/models/applied-coupon.html) records
- [Cart](https://dev.fluentcart.com/database/models/cart.html) records
- `CustomerMeta` records
- `CustomerAddresses` records
- [Subscription](https://dev.fluentcart.com/database/models/subscription.html) records

**Source:** `app/Hooks/Handlers/UserHandler.php`
**Usage:**php
```
add_action('fluent_cart/customer_resources_moved', function ($data) {
 $fromId = $data['from_customer_id'];
 $toId = $data['to_customer_id'];

 // Sync merged customer data to an external system
 fluent_cart_add_log(
 'Customer Resources Merged',
 sprintf('All resources moved from customer #%d to customer #%d', $fromId, $toId),
 'info'
 );
}, 10, 1);```

## User Registration [](#user-registration)

### ` before_registration ` [](#before-registration)
`fluent_cart/user/before_registration` — Fired before a new WordPress user is created during FluentCart registration
**When it runs:** This action fires after the registration form data has been validated and processed, but before `wp_create_user()` is called. Use it to perform additional validation, modify the processed data, or trigger external pre-registration workflows.
**Parameters:**

- `$processedData` (array): Processed registration form dataphp
```
$processedData = [
 'email' => '[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)', // (string) Sanitized email address
 'password' => 'securepass123', // (string) User-provided or auto-generated password
 'first_name' => 'John', // (string) Extracted from full name
 'last_name' => 'Doe', // (string) Extracted from full name
 'username' => '[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)', // (string) Defaults to the email address
];```

**Note:** This parameter is passed directly as an array, not wrapped inside a parent key.
**Source:** `api/User.php`
**Usage:**php
```
add_action('fluent_cart/user/before_registration', function ($processedData) {
 // Log registration attempts
 fluent_cart_add_log(
 'User Registration Attempt',
 sprintf('Registration initiated for %s', $processedData['email']),
 'info'
 );
}, 10, 1);```

### ` after_register ` [](#after-register)
`fluent_cart/user/after_register` — Fired after a new WordPress user is created during checkout registration
**When it runs:** This action fires after `wp_insert_user()` succeeds during the checkout registration flow (handled by `AuthService`). At this point the WordPress user has been created, locale preferences have been saved, and the password change nag has been set if applicable. This hook fires before the standard WordPress `register_new_user` action.
**Parameters:**

- `$user_id` (int): The newly created WordPress user ID
- `$data` (array): Additional context dataphp
```
// Argument 1
$user_id = 42;

// Argument 2
$data = [
 'user_id' => 42, // (int) Same WordPress user ID
];```

**Note:** This hook passes **two** arguments. Make sure to set the accepted argument count to `2` in `add_action`.
**Source:** `app/Services/AuthService.php`
**Usage:**php
```
add_action('fluent_cart/user/after_register', function ($user_id, $data) {
 // Auto-login the newly registered user
 wp_set_current_user($user_id);
 wp_set_auth_cookie($user_id);

 // Send a custom welcome email
 $user = get_user_by('ID', $user_id);
 wp_mail(
 $user->user_email,
 'Welcome to our store!',
 'Your account has been created successfully.'
 );
}, 10, 2);```

## Customer Frontend [](#customer-frontend)

### ` customer_menu ` [](#customer-menu)
`fluent_cart/customer_menu` — Renders the customer dashboard navigation menu
**When it runs:** This output action fires inside the customer dashboard template, within the main container and before the content area. It is used to render the sidebar navigation menu for the customer portal. This is a rendering hook with no parameters.
**Parameters:**
None.
**Source:** `app/Views/frontend/customer_app.php`
**Usage:**php
```
add_action('fluent_cart/customer_menu', function () {
 // Add a custom menu item to the customer dashboard navigation
 echo '<a href="/my-account/custom-page/" class="fct-customer-nav-link">';
 echo esc_html__('My Custom Page', 'my-plugin');
 echo '</a>';
}, 20);```

### ` customer_app ` [](#customer-app)
`fluent_cart/customer_app` — Renders the customer dashboard main content area
**When it runs:** This output action fires inside the customer dashboard template, within the main content container (`.fct-customer-dashboard-main-content`). It is used to render the primary content of the customer portal. This is a rendering hook with no parameters.
**Parameters:**
None.
**Source:** `app/Views/frontend/customer_app.php`
**Usage:**php
```
add_action('fluent_cart/customer_app', function () {
 // Append custom content to the customer dashboard
 echo '<div class="my-custom-section">';
 echo '<h3>' . esc_html__('My Custom Section', 'my-plugin') . '</h3>';
 echo '<p>' . esc_html__('Additional dashboard content here.', 'my-plugin') . '</p>';
 echo '</div>';
}, 20);```

---

## Products & Coupons

Source: https://dev.fluentcart.com/hooks/actions/products-and-coupons.html


All hooks related to catalog management including [Product](https://dev.fluentcart.com/database/models/product.html) lifecycle, single product page rendering, product card rendering, and [Coupon](https://dev.fluentcart.com/database/models/coupon.html) management.
## Product Lifecycle [](#product-lifecycle)

Hooks that fire during product create/update/duplicate operations in the admin.
### ` product_duplicated ` [](#product-duplicated)
`fluent_cart/product_duplicated` — Fired after a product is duplicated
**When it runs:** This action fires after a [Product](https://dev.fluentcart.com/database/models/product.html) has been fully duplicated, including all variants, taxonomy terms, and post meta. The database transaction has already been committed when this hook runs.
**Parameters:**

- `$data` (array): Duplication result dataphp
```
$data = [
 'original_product_id' => 123, // (int) The source product's post ID
 'new_product_id' => 456, // (int) The newly created product's post ID
 'options' => [
 'import_stock_management' => true, // (bool) Whether stock settings were copied
 'import_license_settings' => true, // (bool) Whether license settings were copied
 'import_downloadable_files' => false, // (bool) Whether downloadable files were copied
 ],
];```

**Source:** `app/Models/Product.php`
**Usage:**php
```
add_action('fluent_cart/product_duplicated', function($data) {
 $originalId = $data['original_product_id'];
 $newId = $data['new_product_id'];

 // Copy custom meta that the core duplication doesn't handle
 $custom = get_post_meta($originalId, '_my_custom_field', true);
 if ($custom) {
 update_post_meta($newId, '_my_custom_field', $custom);
 }
}, 10, 1);```

### ` product_updated ` [](#product-updated)
`fluent_cart/product_updated` — Fired when a product is updated via the admin API
**When it runs:** This action fires after a product has been successfully updated through the admin REST API (ProductController). It runs after `ProductResource::update()` has persisted all changes, including variants and product details.
**Parameters:**

- `$data` (array): Contains the raw request data and the updated [Product](https://dev.fluentcart.com/database/models/product.html) modelphp
```
$data = [
 'data' => [ // (array) Sanitized request payload
 'title' => 'Product Name',
 'detail' => [
 'variation_type' => 'simple',
 // ... other product detail fields
 ],
 'variants' => [
 // ... variant data
 ],
 ],
 'product' => $product, // (Product model) The updated Product instance
];```

**Source:** `app/Http/Controllers/ProductController.php`
**Usage:**php
```
add_action('fluent_cart/product_updated', function($data) {
 $product = $data['product'];

 // Sync product to an external inventory system
 do_action('my_plugin/sync_inventory', [
 'product_id' => $product->ID,
 'title' => $product->post_title,
 ]);

 // Clear any cached product data
 wp_cache_delete('fct_product_' . $product->ID, 'fluent_cart');
}, 10, 1);```

## Single Product Page Rendering [](#single-product-page-rendering)

Hooks that fire during the server-side rendering of a single product page. All rendering hooks use **output buffering** -- your callback should `echo` HTML directly rather than return a value.
### ` render_product_header ` [](#render-product-header)
`fluent_cart/product/render_product_header` — Before the single product page content
**When it runs:** This action fires at the very top of a single product page, before the main post content is rendered. Output is captured via `ob_start()` / `ob_get_clean()` and prepended to the product content.
**Parameters:**

- `$postId` (int): The product's WordPress post ID

**Source:** `app/Modules/Templating/TemplateActions.php`
**Usage:**php
```
add_action('fluent_cart/product/render_product_header', function($postId) {
 // Display a promotional banner above the product
 echo '<div class="my-promo-banner">Free shipping on this item!</div>';
}, 10, 1);```

### ` after_product_content ` [](#after-product-content)
`fluent_cart/product/after_product_content` — After the single product page content
**When it runs:** This action fires immediately after the main product content on a single product page. Output is captured via `ob_start()` / `ob_get_clean()` and appended to the product content.
**Parameters:**

- `$postId` (int): The product's WordPress post ID

**Source:** `app/Modules/Templating/TemplateActions.php`
**Usage:**php
```
add_action('fluent_cart/product/after_product_content', function($postId) {
 // Add a trust badge section below the product
 echo '<div class="trust-badges">';
 echo '<span>30-day money back guarantee</span>';
 echo '</div>';
}, 10, 1);```

### ` product_archive ` [](#product-archive)
`fluent_cart/template/product_archive` — Render the product archive/taxonomy page
**When it runs:** This action fires when a product taxonomy archive page (category, tag, etc.) is being rendered. It is triggered inside `renderMainContent()` when the current page is a taxonomy page for `fluent-products`.
**Parameters:**
None.
**Source:** `app/Modules/Templating/TemplateActions.php`
**Usage:**php
```
add_action('fluent_cart/template/product_archive', function() {
 // Render a custom product archive layout
 echo '<div class="my-custom-archive">';
 // ... your custom archive rendering
 echo '</div>';
}, 10, 0);```

### ` before_price_block ` [](#before-price-block)
`fluent_cart/product/single/before_price_block` — Before the price block on a single product page
**When it runs:** This action fires immediately before the price wrapper `<div>` is rendered on a single product page. It fires in two contexts: once for simple products showing a single price, and once for multi-variant products showing the selected variant's price.
**Parameters:**

- `$data` (array): Price block contextphp
```
$data = [
 'product' => $product, // (Product model) The current product
 'current_price' => 5000, // (int) Price in cents
 'scope' => 'price_range', // (string) 'price_range' for simple products,
 // 'product_variant_price' for variant pricing
];```

**Source:** `app/Services/Renderer/ProductRenderer.php`
**Usage:**php
```
add_action('fluent_cart/product/single/before_price_block', function($data) {
 if ($data['scope'] === 'price_range') {
 echo '<div class="price-label">Our Price:</div>';
 }
}, 10, 1);```

### ` after_price (single & card) ` [](#after-price-single-card)
`fluent_cart/product/after_price` — Inline after the price is rendered
**When it runs:** This action fires inline immediately after a price value is echoed, while still inside the price `<span>` or `<div>`. It fires in multiple contexts: simple product prices, price ranges, individual variant prices, and product cards. Use the `scope` key to distinguish between contexts.
**Parameters:**

- `$data` (array): Price contextphp
```
$data = [
 'product' => $product, // (Product model) The current product
 'current_price' => 5000, // (int) Price in cents
 'scope' => 'price_range', // (string) One of:
 // 'price_range' - simple product or min/max range
 // 'product_variant_price' - individual variant price
 // 'product_card' - product card on archive/group pages
];```

**Source:** `app/Services/Renderer/ProductRenderer.php`, `app/Services/Renderer/ProductCardRender.php`
**Usage:**php
```
add_action('fluent_cart/product/after_price', function($data) {
 // Show a "per unit" label next to the price
 if ($data['scope'] === 'product_variant_price') {
 echo '<span class="per-unit"> / unit</span>';
 }

 // Show a sale badge on product cards
 if ($data['scope'] === 'product_card') {
 echo '<span class="sale-badge">Sale</span>';
 }
}, 10, 1);```

### ` after_price_block ` [](#after-price-block)
`fluent_cart/product/single/after_price_block` — After the price block wrapper closes on a single product page
**When it runs:** This action fires immediately after the closing `</div>` of the price block on a single product page. Like `before_price_block`, it fires in two contexts: simple product pricing and variant pricing.
**Parameters:**

- `$data` (array): Price block contextphp
```
$data = [
 'product' => $product, // (Product model) The current product
 'current_price' => 5000, // (int) Price in cents
 'scope' => 'price_range', // (string) 'price_range' for simple products,
 // 'product_variant_price' for variant pricing
];```

**Source:** `app/Services/Renderer/ProductRenderer.php`
**Usage:**php
```
add_action('fluent_cart/product/single/after_price_block', function($data) {
 // Add installment info below the price
 $monthly = \FluentCart\App\Helpers\Helper::toDecimal(intval($data['current_price'] / 3));
 echo '<p class="installment-info">Or 3 payments of ' . esc_html($monthly) . '</p>';
}, 10, 1);```

### ` before_price_range_block ` [](#before-price-range-block)
`fluent_cart/product/single/before_price_range_block` — Before the price range block for multi-variant products
**When it runs:** This action fires before the min-max price range `<div>` is rendered on multi-variant products (products with more than one variant that show a "from X - Y" price range). It does **not** fire for simple products.
**Parameters:**

- `$data` (array): Price range contextphp
```
$data = [
 'product' => $product, // (Product model) The current product
 'current_price' => 2000, // (int) Minimum price in cents
 'scope' => 'price_range',
];```

**Source:** `app/Services/Renderer/ProductRenderer.php`
**Usage:**php
```
add_action('fluent_cart/product/single/before_price_range_block', function($data) {
 echo '<div class="pricing-note">Choose a plan below:</div>';
}, 10, 1);```

### ` after_price_range_block ` [](#after-price-range-block)
`fluent_cart/product/single/after_price_range_block` — After the price range block for multi-variant products
**When it runs:** This action fires after the closing `</div>` of the min-max price range block on multi-variant products. It does **not** fire for simple products.
**Parameters:**

- `$data` (array): Price range contextphp
```
$data = [
 'product' => $product, // (Product model) The current product
 'current_price' => 2000, // (int) Minimum price in cents
 'scope' => 'price_range',
];```

**Source:** `app/Services/Renderer/ProductRenderer.php`
**Usage:**php
```
add_action('fluent_cart/product/single/after_price_range_block', function($data) {
 echo '<p class="bulk-discount">Bulk discounts available for 10+ licenses.</p>';
}, 10, 1);```

### ` before_variant_item ` [](#before-variant-item)
`fluent_cart/product/single/before_variant_item` — Before each variant item in the variant list
**When it runs:** This action fires before each individual [ProductVariation](https://dev.fluentcart.com/database/models/product-variation.html) option is rendered in the variant selection list. It fires once per variant, inside the `foreach` loop that iterates over sorted variants. It fires in both the standard variant list and the tabbed (subscription/onetime) variant layout.
**Parameters:**

- `$data` (array): Variant item contextphp
```
$data = [
 'product' => $product, // (Product model) The current product
 'variant' => $variant, // (ProductVariant model) The current variant being rendered
 'scope' => 'product_variant_item',
];```

**Source:** `app/Services/Renderer/ProductRenderer.php`
**Usage:**php
```
add_action('fluent_cart/product/single/before_variant_item', function($data) {
 $variant = $data['variant'];

 // Add a "Most Popular" badge before a specific variant
 if ($variant->id === 42) {
 echo '<div class="popular-badge">Most Popular</div>';
 }
}, 10, 1);```

### ` after_variant_item ` [](#after-variant-item)
`fluent_cart/product/single/after_variant_item` — After each variant item in the variant list
**When it runs:** This action fires after each individual variant option is rendered in the variant selection list. It fires once per variant, immediately after `renderVariationItem()` completes. It fires in both the standard variant list and the tabbed variant layout.
**Parameters:**

- `$data` (array): Variant item contextphp
```
$data = [
 'product' => $product, // (Product model) The current product
 'variant' => $variant, // (ProductVariant model) The current variant being rendered
 'scope' => 'product_variant_item',
];```

**Source:** `app/Services/Renderer/ProductRenderer.php`
**Usage:**php
```
add_action('fluent_cart/product/single/after_variant_item', function($data) {
 $variant = $data['variant'];

 // Show remaining stock below each variant
 if ($variant->stock_quantity > 0 && $variant->stock_quantity < 10) {
 echo '<span class="low-stock">Only ' . esc_html($variant->stock_quantity) . ' left!</span>';
 }
}, 10, 1);```

### ` before_quantity_block ` [](#before-quantity-block)
`fluent_cart/product/single/before_quantity_block` — Before the quantity selector on a single product page
**When it runs:** This action fires immediately before the quantity input container is rendered on a single product page. It only fires if the product allows quantity selection (not hidden by sold-individually or other conditions).
**Parameters:**

- `$data` (array): Quantity block contextphp
```
$data = [
 'product' => $product, // (Product model) The current product
 'scope' => 'product_quantity_block',
];```

**Source:** `app/Services/Renderer/ProductRenderer.php`
**Usage:**php
```
add_action('fluent_cart/product/single/before_quantity_block', function($data) {
 echo '<p class="quantity-hint">Select your desired quantity:</p>';
}, 10, 1);```

### ` after_quantity_block ` [](#after-quantity-block)
`fluent_cart/product/single/after_quantity_block` — After the quantity selector on a single product page
**When it runs:** This action fires immediately after the quantity input container is rendered on a single product page, after the closing `</div>` of the quantity wrapper.
**Parameters:**

- `$data` (array): Quantity block contextphp
```
$data = [
 'product' => $product, // (Product model) The current product
 'scope' => 'product_quantity_block',
];```

**Source:** `app/Services/Renderer/ProductRenderer.php`
**Usage:**php
```
add_action('fluent_cart/product/single/after_quantity_block', function($data) {
 // Show bulk pricing table after the quantity selector
 echo '<div class="bulk-pricing">';
 echo '<small>Buy 5+ and save 10% &bull; Buy 10+ and save 20%</small>';
 echo '</div>';
}, 10, 1);```

## Product Card Rendering (Archive / Group Pages) [](#product-card-rendering-archive-group-pages)

Hooks that fire during server-side rendering of product cards on archive pages, product group blocks, and shop listings. All rendering hooks use **output buffering** -- your callback should `echo` HTML directly.
### ` group/before_image_block ` [](#group-before-image-block)
`fluent_cart/product/group/before_image_block` — Before the product card image
**When it runs:** This action fires before the product card image link and `<img>` tag are rendered inside a product card on archive or group pages.
**Parameters:**

- `$data` (array): Product card contextphp
```
$data = [
 'product' => $product, // (Product model) The current product
 'scope' => 'product_card',
];```

**Source:** `app/Services/Renderer/ProductCardRender.php`
**Usage:**php
```
add_action('fluent_cart/product/group/before_image_block', function($data) {
 // Add a "New" ribbon over the product card image
 $product = $data['product'];
 $created = strtotime($product->post_date);
 if ($created > strtotime('-30 days')) {
 echo '<span class="new-ribbon">New</span>';
 }
}, 10, 1);```

### ` group/after_image_block ` [](#group-after-image-block)
`fluent_cart/product/group/after_image_block` — After the product card image
**When it runs:** This action fires immediately after the product card image link closes, before the rest of the card content (title, price, button) is rendered.
**Parameters:**

- `$data` (array): Product card contextphp
```
$data = [
 'product' => $product, // (Product model) The current product
 'scope' => 'product_card',
];```

**Source:** `app/Services/Renderer/ProductCardRender.php`
**Usage:**php
```
add_action('fluent_cart/product/group/after_image_block', function($data) {
 // Add a quick-view button overlay after the image
 echo '<button class="quick-view-btn" data-product="' . esc_attr($data['product']->ID) . '">Quick View</button>';
}, 10, 1);```

### ` group/before_price_block ` [](#group-before-price-block)
`fluent_cart/product/group/before_price_block` — Before the price section in product cards
**When it runs:** This action fires before the price wrapper `<div class="fct-product-card-prices">` is rendered inside a product card on archive or group pages.
**Parameters:**

- `$data` (array): Product card price contextphp
```
$data = [
 'product' => $product, // (Product model) The current product
 'current_price' => 2000, // (int) Minimum price in cents
 'scope' => 'product_card',
];```

**Source:** `app/Services/Renderer/ProductCardRender.php`
**Usage:**php
```
add_action('fluent_cart/product/group/before_price_block', function($data) {
 // Show a "Starting at" label before the price
 echo '<span class="price-prefix">Starting at</span>';
}, 10, 1);```

### ` group/after_price_block ` [](#group-after-price-block)
`fluent_cart/product/group/after_price_block` — After the price section in product cards
**When it runs:** This action fires immediately after the closing `</div>` of the product card price wrapper, after prices and the inline `fluent_cart/product/after_price` hook have been rendered.
**Parameters:**

- `$data` (array): Product card price contextphp
```
$data = [
 'product' => $product, // (Product model) The current product
 'current_price' => 2000, // (int) Minimum price in cents
 'scope' => 'product_card',
];```

**Source:** `app/Services/Renderer/ProductCardRender.php`
**Usage:**php
```
add_action('fluent_cart/product/group/after_price_block', function($data) {
 // Show a short feature list below the price on product cards
 $features = get_post_meta($data['product']->ID, '_card_features', true);
 if ($features) {
 echo '<ul class="card-features">';
 foreach ((array) $features as $feature) {
 echo '<li>' . esc_html($feature) . '</li>';
 }
 echo '</ul>';
 }
}, 10, 1);```

## Coupons [](#coupons)

Hooks that fire during [Coupon](https://dev.fluentcart.com/database/models/coupon.html) create and update operations in the admin.
### ` coupon_created ` [](#coupon-created)
`fluent_cart/coupon_created` — Fired after a new coupon is created via the admin
**When it runs:** This action fires after a [Coupon](https://dev.fluentcart.com/database/models/coupon.html) has been successfully created through the admin REST API. It runs after `CouponResource::create()` has persisted the coupon and after the activity log entry has been recorded.
**Parameters:**

- `$data` (array): [Coupon](https://dev.fluentcart.com/database/models/coupon.html) creation dataphp
```
$data = [
 'data' => [ // (array) Sanitized request payload
 'title' => 'SAVE20',
 'type' => 'percentage', // 'percentage' or 'fixed'
 'amount' => 2000, // (int) Discount amount in cents (or percentage value)
 'start_date' => '2026-01-01 00:00:00', // (string|null) GMT start date
 'end_date' => '2026-12-31 23:59:59', // (string|null) GMT end date
 'conditions' => [
 'is_recurring' => 'no',
 // ... other condition fields
 ],
 ],
 'coupon' => $coupon, // (Coupon model) The newly created Coupon instance
];```

**Source:** `app/Http/Controllers/CouponsController.php`
**Usage:**php
```
add_action('fluent_cart/coupon_created', function($data) {
 $coupon = $data['coupon'];

 // Notify marketing team about the new coupon
 wp_mail(
 '[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)',
 'New Coupon Created: ' . $coupon->title,
 'A new coupon has been created with code: ' . $coupon->title
 );
}, 10, 1);```

### ` coupon_updated ` [](#coupon-updated)
`fluent_cart/coupon_updated` — Fired after a coupon is updated via the admin
**When it runs:** This action fires after a [Coupon](https://dev.fluentcart.com/database/models/coupon.html) has been successfully updated through the admin REST API. It runs after `CouponResource::update()` has persisted the changes, but before the activity log entry is recorded.
**Parameters:**

- `$data` (array): Coupon update dataphp
```
$data = [
 'data' => [ // (array) Sanitized request payload
 'title' => 'SAVE20',
 'type' => 'percentage',
 'amount' => 2500,
 'start_date' => '2026-01-01 00:00:00',
 'end_date' => '2026-12-31 23:59:59',
 'conditions' => [
 'is_recurring' => 'no',
 // ... other condition fields
 ],
 ],
 'coupon' => $coupon, // (Coupon model) The updated Coupon instance
];```

**Source:** `app/Http/Controllers/CouponsController.php`
**Usage:**php
```
add_action('fluent_cart/coupon_updated', function($data) {
 $coupon = $data['coupon'];

 // Clear coupon validation cache when a coupon is modified
 wp_cache_delete('fct_coupon_' . $coupon->id, 'fluent_cart');

 // Sync updated coupon to external promotion platform
 do_action('my_plugin/sync_coupon', $coupon);
}, 10, 1);```

---

## Payments & Integrations

Source: https://dev.fluentcart.com/hooks/actions/payments-and-integrations.html


All hooks related to payment processing, payment gateway webhooks, third-party integrations, file storage drivers, and development logging. Many of these hooks provide [Order](https://dev.fluentcart.com/database/models/order.html), [Customer](https://dev.fluentcart.com/database/models/customer.html), and [OrderTransaction](https://dev.fluentcart.com/database/models/order-transaction.html) model instances.
## Payment Events [](#payment-events)

### ` payment_{$paymentStatus} ` [](#payment-paymentstatus)
`fluent_cart/payment_{$paymentStatus}` — Fires after order creation when a transaction succeeds
**When it runs:** This dynamic action fires during [Order](https://dev.fluentcart.com/database/models/order.html) finalization, after the transaction has been recorded and the payment status is determined. It only fires when the transaction status is one of the recognized success statuses (e.g. `paid`, `pending`). The `{$paymentStatus}` portion is replaced with the order's actual payment status.
**Parameters:**

- `$data` (array): [Order](https://dev.fluentcart.com/database/models/order.html), [Customer](https://dev.fluentcart.com/database/models/customer.html), and [OrderTransaction](https://dev.fluentcart.com/database/models/order-transaction.html) dataphp
```
$data = [
 'order' => $order, // Order model instance
 'customer' => $customer, // Customer model (via $order->customer)
 'transaction' => $transaction, // Transaction model (via $order->latest_transaction)
];```

**Source:** `api/Resource/OrderResource.php`
**Dynamic variants:**

- `fluent_cart/payment_paid` -- payment completed successfully
- `fluent_cart/payment_pending` -- payment is pending confirmation

**Usage:**php
```
add_action('fluent_cart/payment_paid', function ($data) {
 $order = $data['order'];
 $customer = $data['customer'];

 // Grant access after successful payment
 update_user_meta($customer->user_id, 'has_premium_access', true);

 fluent_cart_add_log(
 'Payment Received',
 'Order #' . $order->id . ' paid successfully.',
 'success'
 );
}, 10, 1);```

### ` payment_{$transactionType}_{$paymentStatus} ` [](#payment-transactiontype-paymentstatus)
`fluent_cart/payment_{$transactionType}_{$paymentStatus}` — Fires after order creation with both transaction type and payment status
**When it runs:** This dynamic action fires immediately after `fluent_cart/payment_{$paymentStatus}` during [Order](https://dev.fluentcart.com/database/models/order.html) finalization. It provides more granular filtering by combining the transaction type (e.g. `one_time`, `subscription`) with the payment status (e.g. `paid`, `pending`).
**Parameters:**

- `$data` (array): Order, customer, and transaction dataphp
```
$data = [
 'order' => $order, // Order model instance
 'customer' => $customer, // Customer model (via $order->customer)
 'transaction' => $transaction, // Transaction model (via $order->latest_transaction)
];```

**Source:** `api/Resource/OrderResource.php`
**Dynamic variants:**

- `fluent_cart/payment_one_time_paid` -- one-time purchase paid
- `fluent_cart/payment_subscription_paid` -- subscription payment paid
- `fluent_cart/payment_one_time_pending` -- one-time purchase pending
- `fluent_cart/payment_subscription_pending` -- subscription payment pending

**Usage:**php
```
add_action('fluent_cart/payment_subscription_paid', function ($data) {
 $order = $data['order'];
 $transaction = $data['transaction'];

 // Handle subscription-specific logic after payment
 fluent_cart_add_log(
 'Subscription Payment',
 'Subscription payment received for Order #' . $order->id,
 'success'
 );
}, 10, 1);```

### ` after_payment_{$paymentStatus} ` [](#after-payment-paymentstatus)
`fluent_cart/payments/after_payment_{$paymentStatus}` — Fires in abstract gateway after payment processing completes
**When it runs:** This dynamic action fires inside the abstract payment gateway base class after a payment has been processed, the [OrderTransaction](https://dev.fluentcart.com/database/models/order-transaction.html) recorded, and the [Order](https://dev.fluentcart.com/database/models/order.html) status updated. It runs after `changeOrderStatus()` and any automatic digital-product completion logic. The `{$paymentStatus}` is the resulting payment status (e.g. `paid`, `failed`).
**Parameters:**

- `$data` (array): The order that was just processedphp
```
$data = [
 'order' => $order, // Order model instance with updated status
];```

**Source:** `app/Modules/PaymentMethods/Core/AbstractPaymentGateway.php`
**Usage:**php
```
add_action('fluent_cart/payments/after_payment_paid', function ($data) {
 $order = $data['order'];

 // Trigger external fulfillment after any gateway marks payment as paid
 wp_remote_post('https://fulfillment.example.com/api/orders', [
 'body' => wp_json_encode([
 'order_id' => $order->id,
 'total' => $order->total_amount,
 ]),
 ]);
}, 10, 1);```

### ` payment_success ` [](#payment-success)
`fluent_cart/payment_success` — Fires when an Airwallex or Square payment succeeds
**When it runs:** This action fires inside the Airwallex and Square gateway handlers when a payment intent or payment object is confirmed as successful. The order status is updated to `processing` and payment status to `paid` before this hook runs.
**Parameters:**

- `$data` (array): The order and payment intent/payment dataphp
```
$data = [
 'order' => $order, // Order model with updated status
 'payment_intent' => $paymentIntent, // Gateway-specific payment intent or payment object (array)
];```

**Source:** `app/Modules/PaymentMethods/AirwallexGateway/Airwallex.php`, `app/Modules/PaymentMethods/SquareGateway/Square.php`
**Usage:**php
```
add_action('fluent_cart/payment_success', function ($data) {
 $order = $data['order'];
 $paymentIntent = $data['payment_intent'];

 // Log the gateway-specific payment reference
 fluent_cart_add_log(
 'Gateway Payment Success',
 'Payment intent ' . $paymentIntent['id'] . ' for Order #' . $order->id,
 'success'
 );
}, 10, 1);```

### ` payment_failed ` [](#payment-failed)
`fluent_cart/payment_failed` — Fires when an Airwallex payment fails
**When it runs:** This action fires inside the Airwallex gateway handler when a payment intent is determined to have failed. The order status and payment status are both set to `failed` before this hook runs.
**Parameters:**

- `$data` (array): The order and failed payment intent dataphp
```
$data = [
 'order' => $order, // Order model with failed status
 'payment_intent' => $paymentIntent, // Airwallex payment intent object (array)
];```

**Source:** `app/Modules/PaymentMethods/AirwallexGateway/Airwallex.php`
**Usage:**php
```
add_action('fluent_cart/payment_failed', function ($data) {
 $order = $data['order'];
 $paymentIntent = $data['payment_intent'];

 // Notify admin about failed payment
 wp_mail(
 get_option('admin_email'),
 'Payment Failed - Order #' . $order->id,
 'Airwallex payment intent ' . $paymentIntent['id'] . ' failed.'
 );
}, 10, 1);```

## Payment Gateway Registration [](#payment-gateway-registration)

### ` register_payment_methods ` [](#register-payment-methods)
`fluent_cart/register_payment_methods` — Register custom payment gateways
**When it runs:** This action fires during initialization after all built-in payment gateways (Stripe, PayPal, Razorpay, Paystack, COD, Square, Airwallex) have been registered. Use this hook to register your own custom payment gateway with the gateway manager.
**Parameters:**

- `$data` (array): Contains the gateway manager instancephp
```
$data = [
 'gatewayManager' => $gateway, // GatewayManager instance for registering gateways
];```

**Source:** `app/Hooks/Handlers/GlobalPaymentHandler.php`
**Usage:**php
```
add_action('fluent_cart/register_payment_methods', function ($data) {
 $gatewayManager = $data['gatewayManager'];

 // Register a custom payment gateway
 $gatewayManager->register('my_gateway', new MyCustomPaymentGateway());
}, 10, 1);```

### ` after_render_payment_method_{$route} ` [](#after-render-payment-method-route)
`fluent-cart/after_render_payment_method_{$route}` — Fires after a payment method UI renders on the checkout page
**When it runs:** This action fires after a payment method's frontend UI (logo or radio button) has been rendered on the checkout form. The `{$route}` is the gateway's route identifier. Note that this hook uses a **hyphenated** prefix (`fluent-cart/`) rather than the usual underscored prefix.
**Parameters:**
None.
**Source:** `app/Modules/PaymentMethods/Core/AbstractPaymentGateway.php`
**Dynamic variants:**

- `fluent-cart/after_render_payment_method_stripe`
- `fluent-cart/after_render_payment_method_paypal`
- `fluent-cart/after_render_payment_method_square`
- `fluent-cart/after_render_payment_method_airwallex`
- `fluent-cart/after_render_payment_method_offline_payment`
- `fluent-cart/after_render_payment_method_razorpay`
- `fluent-cart/after_render_payment_method_paystack`

**Usage:**php
```
add_action('fluent-cart/after_render_payment_method_stripe', function () {
 // Add custom messaging below the Stripe payment option
 echo '<p class="payment-note">Secure payments powered by Stripe.</p>';
}, 10, 0);```

## Stripe Webhooks [](#stripe-webhooks)

### ` stripe/webhook_{$eventType} ` [](#stripe-webhook-eventtype)
`fluent_cart/payments/stripe/webhook_{$eventType}` — Fires for each Stripe webhook event
**When it runs:** This dynamic action fires during Stripe webhook (IPN) processing after the event has been verified and the associated [Order](https://dev.fluentcart.com/database/models/order.html) has been found. The `{$eventType}` is the Stripe event type with dots replaced by underscores (e.g. `invoice.payment_succeeded` becomes `invoice_payment_succeeded`). The webhook handler checks if any listener is registered via `has_action()` before dispatching.
**Parameters:**

- `$data` (array): The Stripe event object and associated orderphp
```
$data = [
 'event' => $event, // Stripe Event object (contains type, data, etc.)
 'order' => $order, // Order model instance (may be WP_Error if not found)
];```

**Source:** `app/Modules/PaymentMethods/StripeGateway/Webhook/IPN.php`
**Dynamic variants (common Stripe events):**

- `fluent_cart/payments/stripe/webhook_invoice_payment_succeeded`
- `fluent_cart/payments/stripe/webhook_invoice_payment_failed`
- `fluent_cart/payments/stripe/webhook_charge_refunded`
- `fluent_cart/payments/stripe/webhook_customer_subscription_deleted`
- `fluent_cart/payments/stripe/webhook_customer_subscription_updated`
- `fluent_cart/payments/stripe/webhook_payment_intent_succeeded`
- `fluent_cart/payments/stripe/webhook_payment_intent_payment_failed`

**Usage:**php
```
add_action('fluent_cart/payments/stripe/webhook_charge_refunded', function ($data) {
 $event = $data['event'];
 $order = $data['order'];

 if (is_wp_error($order)) {
 return;
 }

 $charge = $event->data->object;

 // Custom refund handling
 fluent_cart_add_log(
 'Stripe Refund Webhook',
 'Charge ' . $charge->id . ' refunded for Order #' . $order->id,
 'info'
 );
}, 10, 1);```

## PayPal Webhooks [](#paypal-webhooks)

### ` paypal_webhook_received ` [](#paypal-webhook-received)
`fluent_cart/paypal_webhook_received` — Fires when raw PayPal webhook data is received before processing
**When it runs:** This action fires early in PayPal webhook processing, after the webhook type has been validated against the list of supported events but before any event-specific handling occurs. Use this to log or inspect all incoming PayPal webhook payloads.
**Parameters:**

- `$data` (array): The parsed and raw webhook dataphp
```
$data = [
 'data' => $data, // Parsed webhook payload (array)
 'raw' => $post_data, // Raw POST body string
];```

**Source:** `app/Modules/PaymentMethods/PayPalGateway/IPN.php`
**Usage:**php
```
add_action('fluent_cart/paypal_webhook_received', function ($data) {
 // Log all incoming PayPal webhooks for debugging
 error_log('PayPal webhook received: ' . wp_json_encode($data['data']));
}, 10, 1);```

### ` paypal/webhook_subscription_payment_received ` [](#paypal-webhook-subscription-payment-received)
`fluent_cart/payments/paypal/webhook_subscription_payment_received` — Fires when a PayPal recurring subscription payment is received
**When it runs:** This action fires when a PayPal `PAYMENT.SALE.COMPLETED` webhook is received and the resource contains a `billing_agreement_id`, indicating it is a recurring subscription payment rather than a one-time purchase.
**Parameters:**

- `$data` (array): The charge resource and billing agreement IDphp
```
$data = [
 'charge' => $resource, // PayPal sale resource object (array)
 'vendor_subscription_id' => $billingAgreementId, // PayPal billing agreement ID (string)
];```

**Source:** `app/Modules/PaymentMethods/PayPalGateway/IPN.php`
**Usage:**php
```
add_action('fluent_cart/payments/paypal/webhook_subscription_payment_received', function ($data) {
 $charge = $data['charge'];
 $billingAgreementId = $data['vendor_subscription_id'];

 // Track recurring payment
 fluent_cart_add_log(
 'PayPal Recurring Payment',
 'Billing agreement ' . $billingAgreementId . ' payment received.',
 'success'
 );
}, 10, 1);```

### ` paypal/webhook_payment_capture_completed ` [](#paypal-webhook-payment-capture-completed)
`fluent_cart/payments/paypal/webhook_payment_capture_completed` — Fires when a PayPal one-time payment capture completes
**When it runs:** This action fires when a PayPal `PAYMENT.SALE.COMPLETED` webhook arrives without a billing agreement ID (one-time payment), or when a `PAYMENT.CAPTURE.COMPLETED` event is received. Both indicate a successful one-time payment capture.
**Parameters:**

- `$data` (array): The charge resource from PayPalphp
```
$data = [
 'charge' => $resource, // PayPal capture/sale resource object (array)
];```

**Source:** `app/Modules/PaymentMethods/PayPalGateway/IPN.php`
**Usage:**php
```
add_action('fluent_cart/payments/paypal/webhook_payment_capture_completed', function ($data) {
 $charge = $data['charge'];

 // Handle one-time payment capture confirmation
 fluent_cart_add_log(
 'PayPal Capture Completed',
 'Capture completed for resource: ' . wp_json_encode($charge),
 'success'
 );
}, 10, 1);```

### ` paypal/webhook_payment_sale_refunded ` [](#paypal-webhook-payment-sale-refunded)
`fluent_cart/payments/paypal/webhook_payment_sale_refunded` — Fires when a PayPal recurring sale is refunded
**When it runs:** This action fires when a PayPal `PAYMENT.SALE.REFUNDED` webhook is received, indicating that a refund has been issued for a recurring/subscription payment sale.
**Parameters:**

- `$data` (array): The refund resource from PayPalphp
```
$data = [
 'refund' => $resource, // PayPal refund resource object (array)
];```

**Source:** `app/Modules/PaymentMethods/PayPalGateway/IPN.php`
**Usage:**php
```
add_action('fluent_cart/payments/paypal/webhook_payment_sale_refunded', function ($data) {
 $refund = $data['refund'];

 // Handle recurring payment refund
 fluent_cart_add_log(
 'PayPal Sale Refund',
 'Recurring payment sale refunded: ' . wp_json_encode($refund),
 'info'
 );
}, 10, 1);```

### ` paypal/webhook_payment_capture_refunded ` [](#paypal-webhook-payment-capture-refunded)
`fluent_cart/payments/paypal/webhook_payment_capture_refunded` — Fires when a PayPal one-time payment capture is refunded
**When it runs:** This action fires when a PayPal `PAYMENT.CAPTURE.REFUNDED` webhook is received, indicating that a refund has been issued for a one-time payment capture.
**Parameters:**

- `$data` (array): The refund resource from PayPalphp
```
$data = [
 'refund' => $resource, // PayPal refund resource object (array)
];```

**Source:** `app/Modules/PaymentMethods/PayPalGateway/IPN.php`
**Usage:**php
```
add_action('fluent_cart/payments/paypal/webhook_payment_capture_refunded', function ($data) {
 $refund = $data['refund'];

 // Handle one-time payment refund
 fluent_cart_add_log(
 'PayPal Capture Refund',
 'One-time payment capture refunded: ' . wp_json_encode($refund),
 'info'
 );
}, 10, 1);```

### ` paypal/webhook_{$eventType} (disputes) ` [](#paypal-webhook-eventtype-disputes)
`fluent_cart/payments/paypal/webhook_{$eventType}` — Fires for PayPal customer dispute events
**When it runs:** This dynamic action fires when a PayPal dispute-related webhook is received. The `{$eventType}` is the PayPal event type converted to lowercase with dots replaced by underscores.
**Parameters:**

- `$data` (array): The dispute resource from PayPalphp
```
$data = [
 'dispute' => $resource, // PayPal dispute resource object (array)
];```

**Source:** `app/Modules/PaymentMethods/PayPalGateway/IPN.php`
**Dynamic variants:**

- `fluent_cart/payments/paypal/webhook_customer_dispute_created`
- `fluent_cart/payments/paypal/webhook_customer_dispute_updated`
- `fluent_cart/payments/paypal/webhook_customer_dispute_resolved`

**Usage:**php
```
add_action('fluent_cart/payments/paypal/webhook_customer_dispute_created', function ($data) {
 $dispute = $data['dispute'];

 // Alert admin about a new PayPal dispute
 wp_mail(
 get_option('admin_email'),
 'PayPal Dispute Created',
 'A customer has opened a dispute. Details: ' . wp_json_encode($dispute)
 );
}, 10, 1);```

### ` paypal/webhook_{$eventType} (subscriptions) ` [](#paypal-webhook-eventtype-subscriptions)
`fluent_cart/payments/paypal/webhook_{$eventType}` — Fires for PayPal billing subscription lifecycle events
**When it runs:** This dynamic action fires as a catch-all for PayPal webhook events that are not payments, refunds, or disputes. These are primarily billing subscription lifecycle events. The `{$eventType}` is the PayPal event type converted to lowercase with dots replaced by underscores.
**Parameters:**

- `$data` (array): The PayPal subscription resourcephp
```
$data = [
 'paypal_subscription' => $resource, // PayPal subscription resource object (array)
];```

**Source:** `app/Modules/PaymentMethods/PayPalGateway/IPN.php`
**Dynamic variants:**

- `fluent_cart/payments/paypal/webhook_billing_subscription_activated`
- `fluent_cart/payments/paypal/webhook_billing_subscription_created`
- `fluent_cart/payments/paypal/webhook_billing_subscription_cancelled`
- `fluent_cart/payments/paypal/webhook_billing_subscription_expired`
- `fluent_cart/payments/paypal/webhook_billing_subscription_suspended`
- `fluent_cart/payments/paypal/webhook_billing_subscription_re-activated`

**Usage:**php
```
add_action('fluent_cart/payments/paypal/webhook_billing_subscription_cancelled', function ($data) {
 $subscription = $data['paypal_subscription'];

 // Handle PayPal subscription cancellation
 fluent_cart_add_log(
 'PayPal Subscription Cancelled',
 'PayPal subscription cancelled: ' . wp_json_encode($subscription),
 'warning'
 );
}, 10, 1);```

## Mollie Webhooks Pro [](#mollie-webhooks)

### ` mollie/webhook_subscription_payment_{$status} ` [](#mollie-webhook-subscription-payment-status)
`fluent_cart/payments/mollie/webhook_subscription_payment_{$status}` Pro — Fires for each Mollie subscription payment status change
**When it runs:** This dynamic action fires during Mollie webhook (IPN) processing when a subscription payment status is determined. The `{$status}` is replaced with the Mollie payment status (e.g. `paid`, `failed`, `expired`, `canceled`). Use this hook to react to specific subscription payment outcomes from Mollie.
**Parameters:**

- `$molliePayment` (object): The Mollie Payment object from the API
- `$order` ([Order](https://dev.fluentcart.com/database/models/order.html)): The Order model instance associated with this payment

**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/Webhook/MollieIPN.php`
**Dynamic variants:**

- `fluent_cart/payments/mollie/webhook_subscription_payment_paid` -- subscription payment succeeded
- `fluent_cart/payments/mollie/webhook_subscription_payment_failed` -- subscription payment failed
- `fluent_cart/payments/mollie/webhook_subscription_payment_expired` -- subscription payment expired
- `fluent_cart/payments/mollie/webhook_subscription_payment_canceled` -- subscription payment canceled

**Usage:**php
```
add_action('fluent_cart/payments/mollie/webhook_subscription_payment_paid', function ($molliePayment, $order) {
 // Handle successful Mollie subscription payment
 fluent_cart_add_log(
 'Mollie Subscription Payment',
 'Subscription payment received for Order #' . $order->id . ' (Mollie ID: ' . $molliePayment->id . ')',
 'success'
 );
}, 10, 2);```

### ` mollie/webhook_payment_{$status} ` [](#mollie-webhook-payment-status)
`fluent_cart/payments/mollie/webhook_payment_{$status}` Pro — Fires for each Mollie one-time payment status change
**When it runs:** This dynamic action fires during Mollie webhook processing when a one-time (non-subscription) payment status is determined. The `{$status}` is replaced with the Mollie payment status. Use this hook to react to specific one-time payment outcomes from Mollie.
**Parameters:**

- `$molliePayment` (object): The Mollie Payment object from the API
- `$order` ([Order](https://dev.fluentcart.com/database/models/order.html)): The Order model instance associated with this payment

**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/Webhook/MollieIPN.php`
**Dynamic variants:**

- `fluent_cart/payments/mollie/webhook_payment_paid` -- one-time payment succeeded
- `fluent_cart/payments/mollie/webhook_payment_failed` -- one-time payment failed
- `fluent_cart/payments/mollie/webhook_payment_expired` -- one-time payment expired
- `fluent_cart/payments/mollie/webhook_payment_canceled` -- one-time payment canceled

**Usage:**php
```
add_action('fluent_cart/payments/mollie/webhook_payment_paid', function ($molliePayment, $order) {
 // Handle successful Mollie one-time payment
 wp_remote_post('https://fulfillment.example.com/api/orders', [
 'body' => wp_json_encode([
 'order_id' => $order->id,
 'mollie_id' => $molliePayment->id,
 'amount' => $molliePayment->amount->value,
 'currency' => $molliePayment->amount->currency,
 ]),
 ]);
}, 10, 2);```

### ` payment_failed (Mollie) ` [](#payment-failed-mollie)
`fluent_cart/payment_failed` Pro — Fires when a Mollie payment fails, is canceled, or expires
**When it runs:** This action fires inside the Mollie IPN handler when a payment is determined to have failed, been canceled, or expired. The order status and payment status are updated before this hook runs. Note that this is the same `fluent_cart/payment_failed` hook used by the base plugin for Airwallex; the Pro plugin adds Mollie as an additional source that fires it.
**Parameters:**

- `$data` (array): Payment failure dataphp
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order — with updated failed status
 'transaction' => $transactionModel, // \FluentCart\App\Models\OrderTransaction
 'old_payment_status' => $oldStatus, // string — previous payment status
 'new_payment_status' => Status::PAYMENT_FAILED, // string — new payment status
 'reason' => $reason, // string — 'failed', 'canceled', or 'expired'
];```

**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/Webhook/MollieIPN.php`
**Usage:**php
```
add_action('fluent_cart/payment_failed', function ($data) {
 $order = $data['order'];
 $transaction = $data['transaction'];
 $oldStatus = $data['old_payment_status'];
 $newStatus = $data['new_payment_status'];
 $reason = $data['reason'];

 // Notify admin about failed Mollie payment
 if ($order->payment_method !== 'mollie') {
 return; // Only handle Mollie failures in this callback
 }

 wp_mail(
 get_option('admin_email'),
 'Mollie Payment Failed - Order #' . $order->id,
 sprintf(
 "Payment for Order #%d has %s.\nPrevious status: %s\nNew status: %s\nTransaction ID: %s",
 $order->id,
 $reason,
 $oldStatus,
 $newStatus,
 $transaction->id
 )
 );
}, 10, 1);```

## Paddle Webhooks Pro [](#paddle-webhooks)

### ` paddle_webhook_received ` [](#paddle-webhook-received)
`fluent_cart/paddle_webhook_received` Pro — Fires when raw Paddle webhook data is received before processing
**When it runs:** This action fires early in Paddle webhook processing, after the event type has been extracted from the payload but before any event-specific handling occurs. Use this to log or inspect all incoming Paddle webhook payloads for debugging purposes.
**Parameters:**

- `$eventType` (string): The Paddle event type (e.g. `transaction.paid`, `subscription.created`)
- `$data` (array): The parsed webhook payload
- `$raw` (string): The raw POST body string
- `$order` ([Order](https://dev.fluentcart.com/database/models/order.html)|null): The associated Order model instance, or null if not yet resolved

**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/Webhook/IPN.php`
**Usage:**php
```
add_action('fluent_cart/paddle_webhook_received', function ($eventType, $data, $raw, $order) {
 // Log all incoming Paddle webhooks for debugging
 fluent_cart_add_log(
 'Paddle Webhook Received',
 sprintf(
 'Event: %s | Order: %s | Payload size: %d bytes',
 $eventType,
 $order ? '#' . $order->id : 'N/A',
 strlen($raw)
 ),
 'info'
 );
}, 10, 4);```

### ` paddle/webhook_{$eventType} ` [](#paddle-webhook-eventtype)
`fluent_cart/payments/paddle/webhook_{$eventType}` Pro — Fires for each Paddle webhook event
**When it runs:** This dynamic action fires during Paddle webhook (IPN) processing after the event has been received and the associated order has been resolved (if applicable). The `{$eventType}` is the Paddle event type with dots replaced by underscores (e.g. `transaction.paid` becomes `transaction_paid`). The webhook handler validates incoming events against a list of accepted event types before dispatching.
**Parameters:**

- `$eventType` (string): The Paddle event type with dots replaced by underscores
- `$data` (array): The parsed webhook payload
- `$raw` (string): The raw POST body string
- `$order` ([Order](https://dev.fluentcart.com/database/models/order.html)|null): The associated Order model instance, or null if not resolved

**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/Webhook/IPN.php`
**Accepted events (dynamic variants):**

- `fluent_cart/payments/paddle/webhook_transaction_paid` -- transaction payment succeeded
- `fluent_cart/payments/paddle/webhook_transaction_completed` -- transaction fully completed
- `fluent_cart/payments/paddle/webhook_transaction_payment_failed` -- transaction payment failed
- `fluent_cart/payments/paddle/webhook_transaction_refunded` -- transaction refunded
- `fluent_cart/payments/paddle/webhook_adjustment_created` -- adjustment (refund/credit) created
- `fluent_cart/payments/paddle/webhook_adjustment_updated` -- adjustment updated
- `fluent_cart/payments/paddle/webhook_subscription_created` -- subscription created
- `fluent_cart/payments/paddle/webhook_subscription_activated` -- subscription activated
- `fluent_cart/payments/paddle/webhook_subscription_updated` -- subscription updated
- `fluent_cart/payments/paddle/webhook_subscription_canceled` -- subscription canceled
- `fluent_cart/payments/paddle/webhook_subscription_paused` -- subscription paused
- `fluent_cart/payments/paddle/webhook_subscription_resumed` -- subscription resumed
- `fluent_cart/payments/paddle/webhook_subscription_past_due` -- subscription past due

**Usage:**php
```
add_action('fluent_cart/payments/paddle/webhook_transaction_paid', function ($eventType, $data, $raw, $order) {
 if (!$order) {
 return;
 }

 // Handle successful Paddle transaction payment
 fluent_cart_add_log(
 'Paddle Transaction Paid',
 'Paddle payment completed for Order #' . $order->id,
 'success'
 );
}, 10, 4);

add_action('fluent_cart/payments/paddle/webhook_subscription_canceled', function ($eventType, $data, $raw, $order) {
 if (!$order) {
 return;
 }

 // Handle Paddle subscription cancellation
 wp_mail(
 get_option('admin_email'),
 'Paddle Subscription Canceled - Order #' . $order->id,
 'A Paddle subscription has been canceled. Event data: ' . wp_json_encode($data)
 );
}, 10, 4);

add_action('fluent_cart/payments/paddle/webhook_transaction_refunded', function ($eventType, $data, $raw, $order) {
 if (!$order) {
 return;
 }

 // Track Paddle refund
 fluent_cart_add_log(
 'Paddle Refund',
 'Paddle transaction refunded for Order #' . $order->id,
 'warning'
 );
}, 10, 4);```

## Integrations [](#integrations)

### ` register_integration_action ` [](#register-integration-action)
`fluent_cart/register_integration_action` — Register custom integration actions during initialization
**When it runs:** This action fires during WordPress `init` to allow registration of custom integration actions. Use this hook to register your integration provider so it appears in the FluentCart integration action settings.
**Parameters:**
None.
**Source:** `app/Modules/IntegrationActions/GlobalIntegrationActionHandler.php`
**Usage:**php
```
add_action('fluent_cart/register_integration_action', function () {
 // Register a custom integration action provider
 add_filter('fluent_cart/integration/get_global_integration_actions', function ($actions) {
 $actions['my_crm'] = [
 'title' => 'My CRM',
 'logo' => plugin_dir_url(__FILE__) . 'logo.png',
 'handler' => 'MyCrmIntegrationHandler',
 ];
 return $actions;
 });
}, 10, 0);```

### ` authenticate_global_credentials_{$settingsKey} ` [](#authenticate-global-credentials-settingskey)
`fluent_cart/integration/authenticate_global_credentials_{$settingsKey}` — Verify integration credentials for a specific provider
**When it runs:** This dynamic action fires when a user clicks the "Verify" or "Authenticate" button for an integration's global credentials in the FluentCart admin settings. The `{$settingsKey}` is the integration provider's settings key (e.g. `mailchimp`, `activecampaign`). The handler is expected to validate the credentials and send a JSON response.
**Parameters:**

- `$data` (array): The settings key and integration configurationphp
```
$data = [
 'settings_key' => $settingsKey, // Integration provider key (string)
 'integration' => $integration, // Integration settings data (array, unslashed)
];```

**Source:** `app/Modules/Integrations/GlobalIntegrationSettings.php`
**Usage:**php
```
add_action('fluent_cart/integration/authenticate_global_credentials_my_crm', function ($data) {
 $apiKey = $data['integration']['api_key'] ?? '';

 // Verify the API key with the external service
 $response = wp_remote_get('https://api.mycrm.com/verify', [
 'headers' => ['Authorization' => 'Bearer ' . $apiKey],
 ]);

 if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) {
 wp_send_json_error(['message' => 'Invalid API credentials.'], 400);
 }

 wp_send_json_success(['message' => 'Credentials verified successfully.']);
}, 10, 1);```

### ` save_global_integration_settings_{$settingsKey} ` [](#save-global-integration-settings-settingskey)
`fluent_cart/integration/save_global_integration_settings_{$settingsKey}` — Save integration settings for a specific provider
**When it runs:** This dynamic action fires when a user saves the global integration settings for a specific provider. The `{$settingsKey}` is the integration provider's settings key. The handler is expected to persist the settings and send a JSON response. If no handler catches this action, a fallback error message is returned.
**Parameters:**

- `$data` (array): The settings key and integration configurationphp
```
$data = [
 'settings_key' => $settingsKey, // Integration provider key (string)
 'integration' => $integration, // Integration settings data (array, unslashed)
];```

**Source:** `app/Modules/Integrations/GlobalIntegrationSettings.php`
**Usage:**php
```
add_action('fluent_cart/integration/save_global_integration_settings_my_crm', function ($data) {
 $settings = $data['integration'];

 // Persist integration settings
 fluent_cart_update_option('my_crm_settings', $settings);

 wp_send_json_success([
 'message' => 'Settings saved successfully.',
 ]);
}, 10, 1);```

### ` integration/chained_{$route} ` [](#integration-chained-route)
`fluent_cart/integration/chained_{$route}` — Fires for chained data requests in cascading dropdowns
**When it runs:** This dynamic action fires when the integration settings UI requests chained/dependent data for cascading dropdown fields. For example, after selecting a mailing list, this hook loads the available tags or groups for that list. The `{$route}` is the integration's route identifier.
**Parameters:**

- `$data` (array): The request data for the chained lookupphp
```
$data = [
 'data' => $requestData, // Request data array (contains route, selected values, etc.)
];```

**Source:** `app/Modules/Integrations/GlobalIntegrationSettings.php`
**Usage:**php
```
add_action('fluent_cart/integration/chained_my_crm', function ($data) {
 $requestData = $data['data'];
 $listId = $requestData['list_id'] ?? '';

 // Fetch tags for the selected list
 $tags = my_crm_get_tags($listId);

 wp_send_json_success([
 'tags' => $tags,
 ]);
}, 10, 1);```

### ` integration/run/{$provider} ` [](#integration-run-provider)
`fluent_cart/integration/run/{$provider}` — Execute a specific integration feed for a provider
**When it runs:** This dynamic action fires when an integration feed needs to be executed for a specific provider, both in real-time (synchronous) and async (via scheduled actions) processing. The `{$provider}` is the integration provider's slug (e.g. `mailchimp`, `activecampaign`). It runs within a try/catch block, and errors are logged to the [Order](https://dev.fluentcart.com/database/models/order.html)'s activity log.
**Parameters:**

- `$integrationArray` (array): The full integration feed configuration and contextphp
```
$integrationArray = [
 'provider' => 'mailchimp', // Integration provider slug
 'order' => $order, // Order model instance
 'event_data' => $data, // Event trigger data (may include subscription)
 'feed' => [], // Feed configuration array
 // ... additional feed configuration fields
];```

**Source:** `app/Listeners/IntegrationEventListener.php`
**Usage:**php
```
add_action('fluent_cart/integration/run/my_crm', function ($integrationArray) {
 $order = $integrationArray['order'];
 $feed = $integrationArray['feed'] ?? [];
 $customer = $order->customer;

 // Push customer data to your CRM
 wp_remote_post('https://api.mycrm.com/contacts', [
 'headers' => [
 'Authorization' => 'Bearer ' . fluent_cart_get_option('my_crm_api_key'),
 'Content-Type' => 'application/json',
 ],
 'body' => wp_json_encode([
 'email' => $customer->email,
 'name' => $customer->full_name,
 'tags' => $feed['tags'] ?? [],
 ]),
 ]);
}, 10, 1);```

### ` global_notify_completed ` [](#global-notify-completed)
`fluent_cart/integrations/global_notify_completed` — Fires after all synchronous global notification feeds have completed
**When it runs:** This action fires after all sync (non-async) global notification integration feeds have been processed for an order. It does not fire if there are async feeds still pending.
**Parameters:**

- `$order` ([Order](https://dev.fluentcart.com/database/models/order.html)): The Order model instance
- `$feeds` (array): Array of feed configurations that were processed

**Source:** `app/Modules/Integrations/GlobalNotificationHandler.php`
**Usage:**php
```
add_action('fluent_cart/integrations/global_notify_completed', function ($order, $feeds) {
 // All sync integrations are done for this order
 fluent_cart_add_log(
 'Integrations Complete',
 count($feeds) . ' integration feeds processed for Order #' . $order->id,
 'info'
 );
}, 10, 2);```

### ` reindex_integration_feeds ` [](#reindex-integration-feeds)
`fluent_cart/reindex_integration_feeds` — Fires when integration feeds need to be re-indexed
**When it runs:** This action fires after integration feed configurations are saved or updated, both at the global level (via `IntegrationController`) and at the product level (via `ProductIntegrationsController`). It signals that the cached integration feed index should be rebuilt.
**Parameters:**

- `$data` (array): Empty arrayphp
```
$data = []; // No data passed```

**Source:** `app/Http/Controllers/IntegrationController.php`, `app/Http/Controllers/ProductIntegrationsController.php`
**Usage:**php
```
add_action('fluent_cart/reindex_integration_feeds', function ($data) {
 // Clear any cached integration feed data
 delete_transient('my_plugin_integration_cache');
}, 10, 1);```

## Storage Drivers [](#storage-drivers)

### ` register_storage_drivers ` [](#register-storage-drivers)
`fluent_cart/register_storage_drivers` — Register custom file storage drivers
**When it runs:** This action fires during WordPress `init` at priority 9, after the built-in Local and S3 storage drivers have been initialized. Use this hook to register a custom file storage driver (e.g. Google Cloud Storage, Azure Blob Storage) for digital product file delivery.
**Parameters:**
None.
**Source:** `app/Hooks/Handlers/GlobalStorageHandler.php`
**Usage:**php
```
add_action('fluent_cart/register_storage_drivers', function () {
 // Register a custom storage driver
 add_filter('fluent_cart/storage_drivers', function ($drivers) {
 $drivers['gcs'] = [
 'title' => 'Google Cloud Storage',
 'handler' => new MyGcsStorageDriver(),
 ];
 return $drivers;
 });
}, 10, 0);```

## Development Logging [](#development-logging)

### ` dev_log ` [](#dev-log)
`fluent_cart/dev_log` — Fires for development and debug logging (requires FLUENT_CART_DEV_MODE)
**When it runs:** This action fires at various points during payment gateway webhook processing (primarily in the PayPal IPN handler) when the `FLUENT_CART_DEV_MODE` constant is defined. It provides detailed diagnostic data for debugging webhook failures, signature verification issues, and missing transaction references. There are 8+ call sites in the PayPal IPN handler alone.
**Parameters:**

- `$data` (array): Logging context with raw data and metadataphp
```
$data = [
 'raw_data' => $rawData, // Raw webhook payload or resource data (mixed)
 'status' => 'failed', // Log status: 'failed', 'received', etc.
 'title' => 'Log title', // Human-readable log title (string)
 'log_type' => 'webhook', // Type of log entry (string)
 'module_type' => 'paypal_ipn', // Module identifier (string)
 'module_name' => 'PayPal', // Display name of the module (string)
];```

**Source:** `app/Modules/PaymentMethods/PayPalGateway/IPN.php` (multiple call sites)
**Usage:**php
```
// First, define the constant in wp-config.php:
// define('FLUENT_CART_DEV_MODE', true);

add_action('fluent_cart/dev_log', function ($data) {
 // Write detailed logs to a custom file
 $logEntry = sprintf(
 "[%s] [%s] %s - %s\n%s\n\n",
 gmdate('Y-m-d H:i:s'),
 $data['status'] ?? 'unknown',
 $data['module_name'] ?? 'General',
 $data['title'] ?? 'No title',
 wp_json_encode($data['raw_data'] ?? [], JSON_PRETTY_PRINT)
 );

 error_log($logEntry, 3, WP_CONTENT_DIR . '/fluent-cart-debug.log');
}, 10, 1);```

---

## Admin & Templates

Source: https://dev.fluentcart.com/hooks/actions/admin-and-templates.html


All hooks related to plugin boot/initialization, admin UI, modules, the block/email editor, form rendering, page templating, shortcode-driven views, policy verification, and custom web routes.
## Boot / Initialization [](#boot-initialization)

Fired during plugin startup. These are the earliest FluentCart hooks and let you tap into the container before any other logic runs.
### ` fluentcart_loaded ` [](#fluentcart-loaded)
`fluentcart_loaded` — Plugin application container loaded (first hook)
**When it runs:** Fires inside the `plugins_loaded` WordPress hook, immediately after the FluentCart `Application` container is constructed and the Action Scheduler is loaded. This is the very first FluentCart hook — use it to register early bindings, service providers, or listeners before anything else initialises.
**Parameters:**

- `$app` (\FluentCart\Framework\Foundation\Application): The FluentCart application container instancephp
```
// $app is the IoC container — you can resolve services from it:
$app->make(\FluentCart\App\Services\SomeService::class);```

**Source:** `boot/app.php` (line 30)
**Usage:**php
```
add_action('fluentcart_loaded', function ($app) {
 // Register a custom service into the FluentCart container early
 $app->bind('myCustomService', function () {
 return new \MyPlugin\CustomService();
 });
}, 10, 1);```

### ` fluent_cart/init ` [](#fluent-cart-init)
`fluent_cart/init` — FluentCart fully initialised on WP `init`
**When it runs:** Fires inside the WordPress `init` hook (which itself runs after `plugins_loaded`). By this point, all post types, taxonomies, and rewrite rules are available. Use this for logic that depends on WordPress being fully bootstrapped — custom post type queries, REST route registration, etc.
**Parameters:**

- `$app` (\FluentCart\Framework\Foundation\Application): The FluentCart application container instance

**Source:** `boot/app.php` (line 35)
**Usage:**php
```
add_action('fluent_cart/init', function ($app) {
 // Safe to query custom post types or register REST routes here
 register_rest_route('my-plugin/v1', '/data', [
 'methods' => 'GET',
 'callback' => 'my_custom_handler',
 ]);
}, 10, 1);```

## Admin [](#admin)

Hooks that fire during admin page rendering, menu setup, and asset enqueueing. Use these to extend the FluentCart admin panel.
### ` fluent_cart/admin_menu ` [](#fluent-cart-admin-menu)
`fluent_cart/admin_menu` — Render admin navigation menu
**When it runs:** Fires in two places: inside the admin Vue SPA wrapper (`admin_app.php`) and on the product CPT taxonomy pages. It is the hook that renders the FluentCart admin navigation bar. The default handler (`MenuHandler::renderAdminMenu`) is attached to it to output the menu HTML.
**Parameters:**
None — this is a rendering hook. Callbacks should echo HTML.
**Source:** `app/CPT/FluentProducts.php` (line 333), `app/Views/admin/admin_app.php` (line 4)
**Usage:**php
```
add_action('fluent_cart/admin_menu', function () {
 // Append a custom link to the admin navigation bar
 echo '<a href="#/my-custom-page" class="fct-nav-item">My Page</a>';
}, 20);```

### ` fluent_cart/admin_submenu_added ` [](#fluent-cart-admin-submenu-added)
`fluent_cart/admin_submenu_added` — After all admin submenus registered
**When it runs:** Fires at the end of `MenuHandler::addAdminMenu()`, after all default submenu items (Dashboard, Orders, Customers, Products, Integrations, Reports, Settings, Coupons, Logs, and taxonomy pages) have been registered under the FluentCart admin menu.
**Parameters:**

- `$submenu` (array): The WordPress global `$submenu` array (keyed by parent slug). The `fluent-cart` key contains all FluentCart submenu items.php
```
$submenu = [
 'fluent-cart' => [
 'dashboard' => ['Dashboard', 'manage_options', 'admin.php?page=fluent-cart#/', ...],
 'orders' => ['Orders', 'manage_options', 'admin.php?page=fluent-cart#/orders', ...],
 'customers' => ['Customers', ...],
 'products' => ['Products', ...],
 'integrations' => ['Integrations', ...],
 'reports' => ['Reports', ...],
 'settings' => ['Settings', ...],
 'coupons' => ['Coupons', ...],
 'logs' => ['Logs', ...],
 // ... taxonomy submenus
 ],
];```

**Source:** `app/Hooks/Handlers/MenuHandler.php` (line 283)
**Usage:**php
```
add_action('fluent_cart/admin_submenu_added', function ($submenu) {
 // Add a custom submenu item programmatically
 global $submenu;
 $submenu['fluent-cart']['my_page'] = [
 __('My Custom Page', 'my-plugin'),
 'manage_options',
 'admin.php?page=fluent-cart#/my-custom',
 ];
}, 10, 1);```

### ` fluent_cart/loading_app ` [](#fluent-cart-loading-app)
`fluent_cart/loading_app` — Admin Vue SPA assets about to be enqueued
**When it runs:** Fires at the very beginning of `MenuHandler::enqueueAssets()`, before any admin JavaScript or CSS is registered. Use this to enqueue your own scripts or styles that need to load alongside (or before) the admin SPA.
**Parameters:**

- `$app` (\FluentCart\Framework\Foundation\Application): The FluentCart application container instance

**Source:** `app/Hooks/Handlers/MenuHandler.php` (line 355)
**Usage:**php
```
add_action('fluent_cart/loading_app', function ($app) {
 // Enqueue a custom admin stylesheet before the SPA loads
 wp_enqueue_style('my-fct-admin-style', plugins_url('css/admin.css', __FILE__));
}, 10, 1);```

### ` fluent_cart/admin_js_loaded ` [](#fluent-cart-admin-js-loaded)
`fluent_cart/admin_js_loaded` — After all admin JS enqueued and localised
**When it runs:** Fires at the end of `MenuHandler::enqueueAssets()`, after all admin scripts have been enqueued and `wp_localize_script` has injected the `fluentCartAdminApp` and `fluentCartRestVars` objects. Use this to enqueue scripts that depend on the admin SPA data being available, or to add inline script data.
**Parameters:**

- `$app` (\FluentCart\Framework\Foundation\Application): The FluentCart application container instance

**Source:** `app/Hooks/Handlers/MenuHandler.php` (line 465)
**Usage:**php
```
add_action('fluent_cart/admin_js_loaded', function ($app) {
 // Enqueue a script that depends on the admin app being fully loaded
 wp_enqueue_script('my-fct-addon', plugins_url('js/addon.js', __FILE__), [], '1.0', true);

 // Add inline data that references fluentCartAdminApp
 wp_add_inline_script('my-fct-addon', 'window.myAddonConfig = { ready: true };', 'before');
}, 10, 1);```

## Modules [](#modules)

Hooks that fire when built-in FluentCart modules (e.g. stock management, subscriptions, shipping) are activated or deactivated via the admin settings panel.
### ` module/deactivated/{module_key} ` [](#module-deactivated-module-key)
`fluent_cart/module/deactivated/{$moduleKey}` — Module deactivated (dynamic)
**When it runs:** Fires inside `ModuleSettingsController::saveSettings()` when a module's `active` status transitions from `'yes'` to `'no'`. The `{$moduleKey}` portion is replaced dynamically with the module identifier.
**Available dynamic variants:** `stock_management`, `subscriptions`, `shipping`, `tax`, `coupon`, `license`, `digital_downloads`, and any other registered module key.
**Parameters:**

- `$moduleData` (array): The newly saved settings for this modulephp
```
$moduleData = [
 'active' => 'no',
 // ... other module-specific settings
];```

- `$prevModuleData` (array): The previous settings for this module before the savephp
```
$prevModuleData = [
 'active' => 'yes',
 // ... previous module-specific settings
];```

**Source:** `app/Http/Controllers/ModuleSettingsController.php` (line 58)
**Usage:**php
```
add_action('fluent_cart/module/deactivated/stock_management', function ($moduleData, $prevModuleData) {
 // Clean up stock-related cron jobs when stock management is turned off
 as_unschedule_all_actions('fluent_cart/stock_check');
}, 10, 2);```

### ` module/activated/{module_key} ` [](#module-activated-module-key)
`fluent_cart/module/activated/{$moduleKey}` — Module activated (dynamic)
**When it runs:** Fires inside `ModuleSettingsController::saveSettings()` when a module's `active` status transitions from `'no'` to `'yes'`. The `{$moduleKey}` portion is replaced dynamically with the module identifier.
**Available dynamic variants:** `stock_management`, `subscriptions`, `shipping`, `tax`, `coupon`, `license`, `digital_downloads`, and any other registered module key.
**Parameters:**

- `$moduleData` (array): The newly saved settings for this modulephp
```
$moduleData = [
 'active' => 'yes',
 // ... other module-specific settings
];```

- `$prevModuleData` (array): The previous settings for this module before the savephp
```
$prevModuleData = [
 'active' => 'no',
 // ... previous module-specific settings
];```

**Source:** `app/Http/Controllers/ModuleSettingsController.php` (line 61)
**Usage:**php
```
add_action('fluent_cart/module/activated/subscriptions', function ($moduleData, $prevModuleData) {
 // Run database migrations when the subscriptions module is first activated
 \FluentCart\Database\DBMigrator::run('subscription_tables');
}, 10, 2);```

## Block Editor / Email Editor [](#block-editor-email-editor)

Hooks for the custom FluentCart block editor used to compose email templates. These fire during the editor page lifecycle and asset loading.
### ` fluent_cart_enqueue_block_editor_assets ` [](#fluent-cart-enqueue-block-editor-assets)
`fluent_cart_enqueue_block_editor_assets` — Block editor assets being enqueued
**When it runs:** Fires at the end of `FluentCartBlockEditorHandler::enqueueEditorStyles()`, after all core WordPress block editor styles (`wp-edit-post`, `wp-block-library`, etc.) have been enqueued. WordPress's own `wp_enqueue_editor_format_library_assets` is also attached to this hook. Use it to add custom styles or scripts to the email block editor.
**Parameters:**
None.
**Source:** `app/Hooks/Handlers/FluentCartBlockEditorHandler.php` (line 428)
**Usage:**php
```
add_action('fluent_cart_enqueue_block_editor_assets', function () {
 // Add custom styles for the email block editor
 wp_enqueue_style('my-email-editor-styles', plugins_url('css/email-editor.css', __FILE__));
}, 10);```

### ` fluent_cart_block_editor/head ` [](#fluent-cart-block-editor-head)
`fluent_cart_block_editor/head` — In `<head>` of custom block editor page
**When it runs:** Fires inside the `<head>` tag of the custom block editor HTML page. WordPress core hooks (`wp_enqueue_scripts`, `wp_print_styles`, `wp_print_head_scripts`, etc.) are pre-attached to this action so that editor stylesheets and scripts are output in the correct location. Use this to inject additional `<meta>`, `<link>`, or `<style>` tags into the editor page head.
**Parameters:**
None.
**Source:** `app/Hooks/Handlers/FluentCartBlockEditorHandler.php` (line 620)
**Usage:**php
```
add_action('fluent_cart_block_editor/head', function () {
 // Inject a custom font into the email block editor page
 echo '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap">';
}, 20);```

### ` fluent_cart/block_editor_head ` [](#fluent-cart-block-editor-head-1)
`fluent_cart/block_editor_head` — Second head hook in block editor page
**When it runs:** Fires immediately after `fluent_cart_block_editor/head` inside the `<head>` tag, right before the closing `</head>`. This is a secondary head hook — use it for last-minute style overrides or scripts that must load after everything else in the head.
**Parameters:**
None.
**Source:** `app/Hooks/Handlers/FluentCartBlockEditorHandler.php` (line 622)
**Usage:**php
```
add_action('fluent_cart/block_editor_head', function () {
 // Override editor styles as the final head injection
 echo '<style>.editor-styles-wrapper { font-family: "Inter", sans-serif; }</style>';
}, 10);```

### ` fluent_cart/new_block_editor_footer ` [](#fluent-cart-new-block-editor-footer)
`fluent_cart/new_block_editor_footer` — Footer of custom block editor page (for JS)
**When it runs:** Fires inside the `<body>` of the custom block editor page, after the editor `<div>` and before `</body>`. This is the recommended place to inject footer JavaScript for the email editor.
**Parameters:**
None.
**Source:** `app/Hooks/Handlers/FluentCartBlockEditorHandler.php` (line 629)
**Usage:**php
```
add_action('fluent_cart/new_block_editor_footer', function () {
 // Inject custom JS into the email editor page footer
 echo '<script>console.log("FluentCart email editor loaded");</script>';
}, 10);```

### ` fluent_cart/block_editor/enqueue_assets ` [](#fluent-cart-block-editor-enqueue-assets)
`fluent_cart/block_editor/enqueue_assets` — After email editor block assets enqueued
**When it runs:** Fires at the end of `FluentCartBlockEditorHandler::enqueueEmailEditorBlocks()`, after all FluentCart-specific email editor block scripts, styles, and global editor SCSS have been enqueued. Use this to register additional custom blocks or scripts for the email editor.
**Parameters:**
None.
**Source:** `app/Hooks/Handlers/FluentCartBlockEditorHandler.php` (line 1232)
**Usage:**php
```
add_action('fluent_cart/block_editor/enqueue_assets', function () {
 // Register a custom email block
 wp_enqueue_script('my-email-block', plugins_url('js/my-email-block.js', __FILE__), ['wp-blocks'], '1.0', true);
}, 10);```

### ` fluent_cart/block_editor/render_block ` [](#fluent-cart-block-editor-render-block)
`fluent_cart/block_editor/render_block` — Render unknown block types in email parser
**When it runs:** Fires inside `FluentBlockParser` when processing a block whose name is not recognised by any built-in handler and is not a standard email editor block. The hook runs inside `ob_start()` — any output you `echo` will be captured and used as the block's rendered HTML in the email. If nothing is output, the parser falls back to raw `innerHTML`.
**Parameters:**

- `$data` (array): Block rendering contextphp
```
$data = [
 'block' => [...], // Full block array (name, attrs, innerBlocks, innerHTML, etc.)
 'block_name' => 'my/custom', // The block type name string
 'attributes' => [...], // Block attributes array
];```

**Source:** `app/Services/Email/FluentBlockParser.php` (line 278)
**Usage:**php
```
add_action('fluent_cart/block_editor/render_block', function ($data) {
 if ($data['block_name'] === 'my-plugin/promo-banner') {
 $heading = $data['attributes']['heading'] ?? 'Special Offer';
 echo '<div style="background: #f0f0f0; padding: 20px; text-align: center;">';
 echo '<h2>' . esc_html($heading) . '</h2>';
 echo '</div>';
 }
}, 10, 1);```

## Form Rendering [](#form-rendering)

Hooks for extending the checkout form field renderer with custom field types.
### ` fluent_cart/render_custom_form_field ` [](#fluent-cart-render-custom-form-field)
`fluent_cart/render_custom_form_field` — Unrecognised form field type fallback
**When it runs:** Fires inside the `default` case of `FormFieldRenderer::renderField()` when the field `type` does not match any built-in type (`section`, `sub_section`, `text`, `email`, `tel`, `number`, `textarea`, `checkbox`, `select`, `address_select`). Use this to render custom field types in the checkout or registration forms.
**Parameters:**

- `$fieldData` (array): The field configuration arrayphp
```
$fieldData = [
 'type' => 'my_custom_type', // The unrecognised field type
 'label' => 'Custom Field', // Field label
 'id' => 'my_field', // Field HTML ID
 'name' => 'my_field', // Field name attribute
 'required' => true, // Whether the field is required
 'wrapper_class' => '', // CSS class for the wrapper
 'options' => [], // Options (if applicable)
 // ... other field-specific keys
];```

**Source:** `app/Services/Renderer/FormFieldRenderer.php` (line 58)
**Usage:**php
```
add_action('fluent_cart/render_custom_form_field', function ($fieldData) {
 if ($fieldData['type'] === 'date_picker') {
 $id = esc_attr($fieldData['id'] ?? '');
 $name = esc_attr($fieldData['name'] ?? '');
 $label = esc_html($fieldData['label'] ?? '');
 $required = !empty($fieldData['required']) ? 'required' : '';
 echo "<div class='fct_form_field'>";
 echo "<label for='{$id}'>{$label}</label>";
 echo "<input type='date' id='{$id}' name='{$name}' {$required} />";
 echo "</div>";
 }
}, 10, 1);```

## Templating [](#templating)

Hooks for the generic fallback template used on product archive pages and other FluentCart template-driven pages. They fire in sequence from top to bottom of the page layout.
### ` fluent_cart/generic_template/rendering ` [](#fluent-cart-generic-template-rendering)
`fluent_cart/generic_template/rendering` — Start of generic fallback template
**When it runs:** Fires at the very top of `fallback-generic-template.php`, before `get_header()` is called. Use this to set up global variables, enqueue assets, or modify the page state before any template output begins.
**Parameters:**
None.
**Source:** `app/Modules/Templating/fallback-generic-template.php` (line 7)
**Usage:**php
```
add_action('fluent_cart/generic_template/rendering', function () {
 // Enqueue custom styles for the product archive template
 wp_enqueue_style('my-archive-styles', plugins_url('css/archive.css', __FILE__));
}, 10);```

### ` fluent_cart/generic_template/before_content ` [](#fluent-cart-generic-template-before-content)
`fluent_cart/generic_template/before_content` — After `get_header()`, before main wrapper
**When it runs:** Fires after the WordPress header has been rendered by `get_header()` and before the main content wrapper `<div>` opens. Use this for banners, breadcrumbs, or other full-width elements above the content area.
**Parameters:**
None.
**Source:** `app/Modules/Templating/fallback-generic-template.php` (line 10)
**Usage:**php
```
add_action('fluent_cart/generic_template/before_content', function () {
 // Add a breadcrumb trail above the product archive
 echo '<nav class="fct-breadcrumb">Home &raquo; Shop</nav>';
}, 10);```

### ` fluent_cart/template/before_content ` [](#fluent-cart-template-before-content)
`fluent_cart/template/before_content` — Inside main wrapper, before content
**When it runs:** Fires inside the `<div id="main">` site-main wrapper, before the main content hook. Use this for content-width elements like filter bars or category headers that sit above the product grid.
**Parameters:**
None.
**Source:** `app/Modules/Templating/fallback-generic-template.php` (line 13)
**Usage:**php
```
add_action('fluent_cart/template/before_content', function () {
 // Show a category filter bar above the product grid
 echo '<div class="fct-filter-bar">Filter by category...</div>';
}, 10);```

### ` fluent_cart/template/main_content ` [](#fluent-cart-template-main-content)
`fluent_cart/template/main_content` — Main content area
**When it runs:** Fires inside the `<div id="main">` wrapper between the `before_content` and `after_content` hooks. This is where the primary page content (product grid, archive loop, etc.) is rendered. FluentCart's templating module hooks its archive rendering here.
**Parameters:**
None.
**Source:** `app/Modules/Templating/fallback-generic-template.php` (line 14)
**Usage:**php
```
add_action('fluent_cart/template/main_content', function () {
 // Replace or supplement the default archive content
 echo '<div class="my-custom-product-grid">Custom grid here</div>';
}, 10);```

### ` fluent_cart/template/after_content ` [](#fluent-cart-template-after-content)
`fluent_cart/template/after_content` — After main content
**When it runs:** Fires inside the `<div id="main">` wrapper after the main content has been rendered. Use this for pagination, call-to-action blocks, or related products sections that sit below the product grid.
**Parameters:**
None.
**Source:** `app/Modules/Templating/fallback-generic-template.php` (line 15)
**Usage:**php
```
add_action('fluent_cart/template/after_content', function () {
 // Add pagination below the product grid
 echo '<div class="fct-pagination"><!-- pagination links --></div>';
}, 10);```

### ` fluent_cart/generic_template/after_content ` [](#fluent-cart-generic-template-after-content)
`fluent_cart/generic_template/after_content` — After main wrapper, before `get_footer()`
**When it runs:** Fires after the main content wrapper `<div>` closes and before `get_footer()` renders the site footer. Use this for full-width elements below the content area like newsletter signups or related content.
**Parameters:**
None.
**Source:** `app/Modules/Templating/fallback-generic-template.php` (line 18)
**Usage:**php
```
add_action('fluent_cart/generic_template/after_content', function () {
 // Add a full-width newsletter signup section
 echo '<section class="fct-newsletter">Subscribe to our newsletter</section>';
}, 10);```

## Views (Shortcode-Driven Rendering) [](#views-shortcode-driven-rendering)

Hooks that render specific view partials on the checkout page, receipt emails, and customer-facing forms. These fire inside `ob_start()` / `ob_get_clean()` blocks — your callbacks should `echo` HTML output.
### ` views/checkout_page_cart_item_list ` [](#views-checkout-page-cart-item-list)
`fluent_cart/views/checkout_page_cart_item_list` — Render cart item list on checkout
**When it runs:** Fires inside `CheckoutController::getCheckoutSummary()` to render the cart item list partial on the checkout page. The output is captured via `ob_start()` and returned as part of the checkout summary AJAX response.
**Parameters:**

- `$data` (array): Checkout contextphp
```
$data = [
 'checkout' => $checkOutHelper, // \FluentCart\App\Helpers\CartCheckoutHelper instance
 'items' => [...], // Array of cart items from $checkOutHelper->getItems()
];```

**Source:** `app/Http/Controllers/CheckoutController.php` (line 39)
**Usage:**php
```
add_action('fluent_cart/views/checkout_page_cart_item_list', function ($data) {
 $items = $data['items'];
 echo '<div class="fct-cart-items">';
 foreach ($items as $item) {
 echo '<div class="fct-cart-item">' . esc_html($item['title'] ?? '') . '</div>';
 }
 echo '</div>';
}, 10, 1);```

### ` views/checkout_page_registration_form ` [](#views-checkout-page-registration-form)
`fluent_cart/views/checkout_page_registration_form` — Render registration form on checkout
**When it runs:** Fires inside `CustomerRegistrationHandler::render()` to output the guest registration form on the checkout page. The output is captured via `ob_start()` and returned as the rendered form HTML.
**Parameters:**

- `$viewData` (array): View contextphp
```
$viewData = [
 'checkout' => $checkOutHelper, // \FluentCart\App\Helpers\CartCheckoutHelper instance
];```

**Source:** `app/Hooks/Handlers/ShortCodes/CustomerRegistrationHandler.php` (line 79)
**Usage:**php
```
add_action('fluent_cart/views/checkout_page_registration_form', function ($viewData) {
 $checkout = $viewData['checkout'];
 echo '<div class="fct-registration-form">';
 echo '<h3>Create an Account</h3>';
 // Render custom registration fields
 echo '<input type="text" name="full_name" placeholder="Full Name" />';
 echo '<input type="email" name="email" placeholder="Email" />';
 echo '<input type="password" name="password" placeholder="Password" />';
 echo '</div>';
}, 10, 1);```

### ` views/checkout_page_login_form ` [](#views-checkout-page-login-form)
`fluent_cart/views/checkout_page_login_form` — Render login form on checkout
**When it runs:** Fires inside `CustomerLoginHandler::render()` to output the login form on the checkout page for returning customers. The output is captured via `ob_start()` and returned as the rendered form HTML.
**Parameters:**

- `$viewData` (array): View contextphp
```
$viewData = [
 'checkout' => $checkOutHelper, // \FluentCart\App\Helpers\CartCheckoutHelper instance
];```

**Source:** `app/Hooks/Handlers/ShortCodes/CustomerLoginHandler.php` (line 81)
**Usage:**php
```
add_action('fluent_cart/views/checkout_page_login_form', function ($viewData) {
 echo '<div class="fct-login-form">';
 echo '<h3>Returning Customer? Log In</h3>';
 echo '<input type="email" name="email" placeholder="Email" />';
 echo '<input type="password" name="password" placeholder="Password" />';
 echo '<button type="submit">Log In</button>';
 echo '</div>';
}, 10, 1);```

### ` views/checkout_order_summary ` [](#views-checkout-order-summary)
`fluent_cart/views/checkout_order_summary` — Render order summary (email shortcodes)
**When it runs:** Fires inside `ShortcodeParser::getSummary()` when the `` shortcode is parsed in email templates. The output is captured via `ob_start()` and inserted into the email body as the order summary block. Receives the [Order](https://dev.fluentcart.com/database/models/order.html) model instance.
**Parameters:**

- `$data` (array): Order summary contextphp
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order instance
 'paymentReceipt' => $paymentReceipt, // \FluentCart\App\Services\PaymentReceipt instance
];```

**Source:** `app/Services/ShortCodeParser/ShortcodeParser.php` (line 248)
**Usage:**php
```
add_action('fluent_cart/views/checkout_order_summary', function ($data) {
 $order = $data['order'];
 $receipt = $data['paymentReceipt'];
 echo '<table class="fct-order-summary">';
 echo '<tr><th>Order #' . esc_html($order->id) . '</th></tr>';
 // Render line items, totals, etc.
 echo '</table>';
}, 10, 1);```

### ` views/checkout_order_receipt ` [](#views-checkout-order-receipt)
`fluent_cart/views/checkout_order_receipt` — Render full order receipt (email shortcodes)
**When it runs:** Fires inside `ShortcodeParser::getReceipt()` when the `` shortcode is parsed in email templates. The output is captured via `ob_start()` and inserted into the email body as the complete [Order](https://dev.fluentcart.com/database/models/order.html) receipt.
**Parameters:**

- `$data` (array): Order receipt contextphp
```
$data = [
 'order' => $order, // \FluentCart\App\Models\Order instance
 'paymentReceipt' => $paymentReceipt, // \FluentCart\App\Services\PaymentReceipt instance
];```

**Source:** `app/Services/ShortCodeParser/ShortcodeParser.php` (line 256)
**Usage:**php
```
add_action('fluent_cart/views/checkout_order_receipt', function ($data) {
 $order = $data['order'];
 $receipt = $data['paymentReceipt'];
 echo '<div class="fct-receipt">';
 echo '<h2>Receipt for Order #' . esc_html($order->id) . '</h2>';
 // Render full receipt with items, addresses, payment info, etc.
 echo '</div>';
}, 10, 1);```

### ` views/checkout_page_shipping_method_list ` [](#views-checkout-page-shipping-method-list)
`fluent_cart/views/checkout_page_shipping_method_list` — Render shipping method list
**When it runs:** Fires inside `ShippingFrontendController::getShippingMethodsListView()` to render the list of available [ShippingMethod](https://dev.fluentcart.com/database/models/shipping-method.html) instances on the checkout page. The output is captured via `ob_start()` and returned as part of the shipping methods AJAX response.
**Parameters:**

- `$data` (array): Shipping methods contextphp
```
$data = [
 'shipping_methods' => [
 // Array of available \FluentCart\App\Models\ShippingMethod instances
 // filtered by the customer's country/address
 ],
];```

**Source:** `app/Modules/Shipping/Http/Controllers/Frontend/ShippingFrontendController.php` (line 75)
**Usage:**php
```
add_action('fluent_cart/views/checkout_page_shipping_method_list', function ($data) {
 $methods = $data['shipping_methods'];
 echo '<div class="fct-shipping-methods">';
 foreach ($methods as $method) {
 echo '<label>';
 echo '<input type="radio" name="shipping_method" value="' . esc_attr($method->id) . '" />';
 echo esc_html($method->title);
 echo '</label>';
 }
 echo '</div>';
}, 10, 1);```

### ` views/checkout_page_form_address_info_wrapper ` [](#views-checkout-page-form-address-info-wrapper)
`fluent_cart/views/checkout_page_form_address_info_wrapper` — Render address info card
**When it runs:** Fires inside `CustomerController` when rendering the address information card on the checkout page after a customer selects or submits their address. The output is captured via `ob_start()` and returned in the AJAX response.
**Parameters:**

- `$data` (array): Address display dataphp
```
$data = [
 'name' => 'John Doe', // Customer name
 'phone' => '+1234567890', // Customer phone number
 'label' => 'Home', // Address label
 'address' => '123 Main St, City, State, Country', // Formatted address string
];```

**Source:** `app/Http/Controllers/FrontendControllers/CustomerController.php` (line 137)
**Usage:**php
```
add_action('fluent_cart/views/checkout_page_form_address_info_wrapper', function ($data) {
 echo '<div class="fct-address-card">';
 echo '<strong>' . esc_html($data['name']) . '</strong>';
 if (!empty($data['phone'])) {
 echo '<br />' . esc_html($data['phone']);
 }
 echo '<br />' . esc_html($data['address']);
 echo '</div>';
}, 10, 1);```

## Policies / Security [](#policies-security)

Hooks that fire during REST API policy verification. These allow you to add custom security checks, rate limiting, or audit logging before the standard permission check runs.
### ` policy/store_sensitive_request ` [](#policy-store-sensitive-request)
`fluent_cart/policy/store_sensitive_request` — Store-sensitive API request verification
**When it runs:** Fires at the beginning of `StoreSensitivePolicy::verifyRequest()`, before the `store/sensitive` capability check is performed. This policy protects sensitive store operations (e.g. payment gateway configuration, API key management). Use this to add additional security measures like IP whitelisting or two-factor verification.
**Parameters:**

- `$data` (array): Request contextphp
```
$data = [
 'request' => $request, // \FluentCart\Framework\Http\Request\Request instance
];```

**Source:** `app/Http/Policies/StoreSensitivePolicy.php` (line 11)
**Usage:**php
```
add_action('fluent_cart/policy/store_sensitive_request', function ($data) {
 $request = $data['request'];
 $ip = $request->server('REMOTE_ADDR');

 // Log sensitive API access attempts
 fluent_cart_add_log(
 'Sensitive API Access',
 sprintf('IP: %s, Endpoint: %s', $ip, $request->url()),
 'info'
 );
}, 10, 1);```

### ` policy/store_settings_request ` [](#policy-store-settings-request)
`fluent_cart/policy/store_settings_request` — Store-settings API request verification
**When it runs:** Fires at the beginning of `StoreSettingsPolicy::verifyRequest()`, before the route-meta permission check (`hasRoutePermissions()`) is performed. This policy protects store settings endpoints (e.g. general settings, email templates, checkout configuration). Use this for additional validation or logging.
**Parameters:**

- `$data` (array): Request contextphp
```
$data = [
 'request' => $request, // \FluentCart\Framework\Http\Request\Request instance
];```

**Source:** `app/Http/Policies/StoreSettingsPolicy.php` (line 11)
**Usage:**php
```
add_action('fluent_cart/policy/store_settings_request', function ($data) {
 $request = $data['request'];

 // Restrict settings changes to specific admin users
 $allowedUserIds = [1, 2, 3];
 if (!in_array(get_current_user_id(), $allowedUserIds)) {
 wp_die('You are not allowed to modify store settings.', 403);
 }
}, 10, 1);```

## Web Routes [](#web-routes)

Dynamic hooks for custom web route endpoints. Used primarily by payment gateways for IPN (Instant Payment Notification) callbacks, webhook handlers, and other server-to-server endpoints.
### ` fluent_cart_action_{page} ` [](#fluent-cart-action-page)
`fluent_cart_action_{$page}` — Custom web route action handler (dynamic)
**When it runs:** Fires inside `WebRoutes` when the current FluentCart web route `$page` slug matches a registered action. After the action fires, `die()` is called immediately — your callback must handle the full response (headers, body, exit). This is typically used by payment gateway modules to register IPN/webhook listeners (e.g. `fluent_cart_action_stripe_ipn`).
**Parameters:**

- `$requestData` (array): All request parameters from `App::request()->all()`, which includes merged GET and POST data.php
```
$requestData = [
 // All query string and POST body parameters, e.g.:
 'webhook_id' => 'evt_123abc',
 'payment_type' => 'subscription',
 // ... any other request params
];```

**Source:** `app/Http/Routes/WebRoutes.php` (line 198)
**Usage:**php
```
add_action('fluent_cart_action_my_gateway_ipn', function ($requestData) {
 // Verify the webhook signature
 $payload = file_get_contents('php://input');
 $signature = $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'] ?? '';

 if (!verify_webhook_signature($payload, $signature)) {
 status_header(403);
 echo 'Invalid signature';
 return; // die() is called by WebRoutes after the action
 }

 // Process the payment notification
 process_ipn_notification($requestData);

 status_header(200);
 echo 'OK';
}, 10, 1);```

---

