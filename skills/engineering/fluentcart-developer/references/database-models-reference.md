# Database Models Reference

This reference contains all FluentCart models details scraped from the developer documentation site.

## Order

Source: https://dev.fluentcart.com/database/models/order.html


| DB Table Name | {wp_db_prefix}_fct_orders | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-orders-table) | 
| Source File | fluent-cart/app/Models/Order.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\Order | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| status | String | Order status (draft, pending, processing, completed, etc.) | 
| parent_id | Integer | Parent order ID (for renewals/child orders) | 
| receipt_number | Integer | Receipt number | 
| invoice_no | String | Invoice number | 
| fulfillment_type | String | Fulfillment type (physical, digital) | 
| type | String | Order type (subscription, renewal, etc.) | 
| mode | String | Order mode (live, test) | 
| shipping_status | String | Shipping status | 
| customer_id | Integer | Customer ID (cast to integer) | 
| payment_method | String | Payment method | 
| payment_status | String | Payment status | 
| payment_method_title | String | Payment method title | 
| currency | String | Currency code | 
| subtotal | Integer | Subtotal in cents (cast to double) | 
| discount_tax | Integer | Discount tax in cents (cast to double) | 
| manual_discount_total | Integer | Manual discount total in cents (cast to double) | 
| coupon_discount_total | Integer | Coupon discount total in cents (cast to double) | 
| shipping_tax | Integer | Shipping tax in cents (cast to double) | 
| shipping_total | Integer | Shipping total in cents (cast to double) | 
| tax_total | Integer | Tax total in cents (cast to double) | 
| total_amount | Integer | Total amount in cents (cast to double) | 
| total_paid | Integer | Total paid in cents | 
| total_refund | Integer | Total refund in cents | 
| rate | Decimal | Exchange rate | 
| tax_behavior | Integer | Tax behavior (0=no_tax, 1=exclusive, 2=inclusive) | 
| note | Text | Order notes | 
| ip_address | Text | Customer IP address | 
| completed_at | Date Time | Completion timestamp | 
| refunded_at | Date Time | Refund timestamp | 
| uuid | String | Unique identifier | 
| config | JSON | Order configuration (auto-encoded/decoded via accessor/mutator) | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$order = FluentCart\App\Models\Order::find(1);

$order->id; // returns order ID
$order->status; // returns order status
$order->total_amount; // returns total amount in cents
$order->currency; // returns currency code
$order->customer_id; // returns customer ID```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### updateStatus($key, $newStatus) [](#updatestatus-key-newstatus)

Update order status

- Parameters: `$key` (String) - Status key, `$newStatus` (String) - New status
- Returns `FluentCart\App\Models\Order` - Updated order instance
php
```
$order = FluentCart\App\Models\Order::find(1);
$order->updateStatus('status', 'completed');```

### updatePaymentStatus($newStatus) [](#updatepaymentstatus-newstatus)

Update payment status

- Parameters: `$newStatus` (String) - New payment status
- Returns `FluentCart\App\Models\Order` - Updated order instance
php
```
$order = FluentCart\App\Models\Order::find(1);
$order->updatePaymentStatus('paid');```

### getMeta($metaKey, $defaultValue = false) [](#getmeta-metakey-defaultvalue-false)

Get order meta value

- Parameters: `$metaKey` (String) - Meta key, `$defaultValue` (Mixed) - Default value
- Returns `Mixed` - Meta value or default
php
```
$order = FluentCart\App\Models\Order::find(1);
$metaValue = $order->getMeta('custom_field', 'default');```

### updateMeta($metaKey, $value) [](#updatemeta-metakey-value)

Update order meta value

- Parameters: `$metaKey` (String) - Meta key, `$value` (Mixed) - Meta value
- Returns `FluentCart\App\Models\OrderMeta` - Meta instance
php
```
$order = FluentCart\App\Models\Order::find(1);
$meta = $order->updateMeta('custom_field', 'new_value');```

### deleteMeta($metaKey) [](#deletemeta-metakey)

Delete order meta

- Parameters: `$metaKey` (String) - Meta key
- Returns `Boolean` - True if deleted
php
```
$order = FluentCart\App\Models\Order::find(1);
$deleted = $order->deleteMeta('custom_field');```

### getTotalPaidAmount() [](#gettotalpaidamount)

Get total paid amount from succeeded transactions

- Returns `Integer` - Total paid amount in cents
php
```
$order = FluentCart\App\Models\Order::find(1);
$totalPaid = $order->getTotalPaidAmount();```

### getTotalRefundAmount() [](#gettotalrefundamount)

Get total refund amount from refunded transactions

- Returns `Integer` - Total refund amount in cents
php
```
$order = FluentCart\App\Models\Order::find(1);
$totalRefund = $order->getTotalRefundAmount();```

### recountTotalPaidAndRefund() [](#recounttotalpaidandrefund)

Recount total paid and refund amounts. Updates `total_refund` and sets `payment_status` to refunded or partially refunded as appropriate.

- Returns `FluentCart\App\Models\Order` - Updated order instance
php
```
$order = FluentCart\App\Models\Order::find(1);
$order->recountTotalPaidAndRefund();```

### syncOrderAfterRefund($type, $refundedAmount) [](#syncorderafterrefund-type-refundedamount)

Sync order after refund

- Parameters: `$type` (String) - Refund type ('full' or 'partial'), `$refundedAmount` (Integer) - Refund amount
- Returns `FluentCart\App\Models\Order` - Updated order instance
php
```
$order = FluentCart\App\Models\Order::find(1);
$order->syncOrderAfterRefund('full', 1000);```

### updateRefundedItems($refundedItemIds, $refundedAmount) [](#updaterefundeditems-refundeditemids-refundedamount)

Update refunded items. Distributes refund amount proportionally across the specified order items.

- Parameters: `$refundedItemIds` (Array) - Order item IDs, `$refundedAmount` (Integer) - Refund amount
php
```
$order = FluentCart\App\Models\Order::find(1);
$order->updateRefundedItems([1, 2, 3], 1000);```

### recountTotalPaid() [](#recounttotalpaid)

Recount total paid amount (paid minus refunded)

- Returns `FluentCart\App\Models\Order` - Updated order instance
php
```
$order = FluentCart\App\Models\Order::find(1);
$order->recountTotalPaid();```

### getLatestTransactionAttribute() [](#getlatesttransactionattribute)

Get latest non-refund transaction (accessor, accessed as `latest_transaction` attribute)

- Returns `FluentCart\App\Models\OrderTransaction|null` - Latest transaction
php
```
$order = FluentCart\App\Models\Order::find(1);
$transaction = $order->latest_transaction;```

### isSubscription() [](#issubscription)

Check if order is subscription

- Returns `Boolean` - True if order has subscription items
php
```
$order = FluentCart\App\Models\Order::find(1);
$isSubscription = $order->isSubscription();```

### getViewUrl($type = 'customer') [](#getviewurl-type-customer)

Get order view URL

- Parameters: `$type` (String) - View type ('customer' or 'admin')
- Returns `String` - View URL
php
```
$order = FluentCart\App\Models\Order::find(1);
$viewUrl = $order->getViewUrl('admin');```

### getLatestTransaction() [](#getlatesttransaction)

Get latest non-refund transaction (method call, unlike the accessor attribute)

- Returns `FluentCart\App\Models\OrderTransaction|null` - Latest transaction
php
```
$order = FluentCart\App\Models\Order::find(1);
$transaction = $order->getLatestTransaction();```

### currentSubscription() [](#currentsubscription)

Get current active subscription for this order

- Returns `FluentCart\App\Models\Subscription|null` - Current active subscription
php
```
$order = FluentCart\App\Models\Order::find(1);
$subscription = $order->currentSubscription();```

### getDownloads($scope = 'email') [](#getdownloads-scope-email)

Get order downloads. Returns downloadable files associated with the order items, filtered by product variation authorization.

- Parameters: `$scope` (String) - Download scope
- Returns `Array` - Download data
php
```
$order = FluentCart\App\Models\Order::find(1);
$downloads = $order->getDownloads('email');```

### getLicenses($with = ['product', 'productVariant']) [](#getlicenses-with-product-productvariant)

Get order licenses (requires Pro and active license module)

- Parameters: `$with` (Array) - Relationships to eager load (default: `['product', 'productVariant']`)
- Returns `Illuminate\Database\Eloquent\Collection|null` - Licenses collection or null if module inactive
php
```
$order = FluentCart\App\Models\Order::find(1);
$licenses = $order->getLicenses(['product', 'productVariant']);```

### getDownloadsById($orderId) [](#getdownloadsbyid-orderid)

Get downloads for a specific order by ID

- Parameters: `$orderId` (Integer) - Order ID
- Returns `Array` - Download data
php
```
$order = FluentCart\App\Models\Order::find(1);
$downloads = $order->getDownloadsById(42);```

### getReceiptUrl() [](#getreceipturl)

Get receipt URL

- Returns `String` - Receipt URL
php
```
$order = FluentCart\App\Models\Order::find(1);
$receiptUrl = $order->getReceiptUrl();```

### addLog($title, $description = '', $type = 'info', $by = '') [](#addlog-title-description-type-info-by)

Add order log

- Parameters: `$title` (String) - Log title, `$description` (String) - Description, `$type` (String) - Log type, `$by` (String) - Created by
php
```
$order = FluentCart\App\Models\Order::find(1);
$order->addLog('Status Updated', 'Order status changed to completed', 'info', 'admin');```

### canBeRefunded() [](#canberefunded)

Check if order can be refunded. Returns false if the order has been upgraded to another order.

- Returns `Boolean` - True if order can be refunded
php
```
$order = FluentCart\App\Models\Order::find(1);
$canBeRefunded = $order->canBeRefunded();```

### generateReceiptNumber() [](#generatereceiptnumber)

Generate receipt number and invoice number if not already set

- Returns `FluentCart\App\Models\Order` - Updated order instance
php
```
$order = FluentCart\App\Models\Order::find(1);
$order->generateReceiptNumber();```

### canBeDeleted() [](#canbedeleted)

Check if order can be deleted. Validates order status, payment status, mode, and subscription state. Test mode orders can always be deleted. Live orders must be canceled or on-hold, and must not have an active subscription.

- Returns `Boolean|WP_Error` - True if order can be deleted, or WP_Error with reason
php
```
$order = FluentCart\App\Models\Order::find(1);
$canBeDeleted = $order->canBeDeleted();
if (is_wp_error($canBeDeleted)) {
 echo $canBeDeleted->get_error_message();
}```

## Relations [](#relations)

This model has the following relationships that you can use
### parentOrder [](#parentorder)

Access the parent order.

- Returns `FluentCart\App\Models\Order`
php
```
$order = FluentCart\App\Models\Order::find(1);
$parentOrder = $order->parentOrder;```

### children [](#children)

Access the child orders.

- Returns `Illuminate\Database\Eloquent\Collection` of `FluentCart\App\Models\Order`
php
```
$order = FluentCart\App\Models\Order::find(1);
$children = $order->children;```

### transactions [](#transactions)

Access the order transactions.

- Returns `Illuminate\Database\Eloquent\Collection` of `FluentCart\App\Models\OrderTransaction`
php
```
$order = FluentCart\App\Models\Order::find(1);
$transactions = $order->transactions;```

### subscriptions [](#subscriptions)

Access the order subscriptions.

- Returns `Illuminate\Database\Eloquent\Collection` of `FluentCart\App\Models\Subscription`
php
```
$order = FluentCart\App\Models\Order::find(1);
$subscriptions = $order->subscriptions;```

### order_items [](#order-items)

Access the order items.

- Returns `Illuminate\Database\Eloquent\Collection` of `FluentCart\App\Models\OrderItem`
php
```
$order = FluentCart\App\Models\Order::find(1);
$items = $order->order_items;```

### filteredOrderItems [](#filteredorderitems)

Access the filtered order items based on priority rules for payment_type (onetime > subscription > adjustment).

- Returns `Illuminate\Database\Eloquent\Collection` of `FluentCart\App\Models\OrderItem`
php
```
$order = FluentCart\App\Models\Order::find(1);
$filteredItems = $order->filteredOrderItems;```

### customer [](#customer)

Access the customer.

- Returns `FluentCart\App\Models\Customer`
php
```
$order = FluentCart\App\Models\Order::find(1);
$customer = $order->customer;```

### orderMeta [](#ordermeta)

Access the order metadata.

- Returns `Illuminate\Database\Eloquent\Collection` of `FluentCart\App\Models\OrderMeta`
php
```
$order = FluentCart\App\Models\Order::find(1);
$meta = $order->orderMeta;```

### orderTaxRates [](#ordertaxrates)

Access the order tax rates.

- Returns `Illuminate\Database\Eloquent\Collection` of `FluentCart\App\Models\OrderTaxRate`
php
```
$order = FluentCart\App\Models\Order::find(1);
$taxRates = $order->orderTaxRates;```

### appliedCoupons [](#appliedcoupons)

Access the applied coupons.

- Returns `Illuminate\Database\Eloquent\Collection` of `FluentCart\App\Models\AppliedCoupon`
php
```
$order = FluentCart\App\Models\Order::find(1);
$appliedCoupons = $order->appliedCoupons;```

### usedCoupons [](#usedcoupons)

Access the used coupons (through the applied coupons intermediate table).

- Returns `Illuminate\Database\Eloquent\Collection` of `FluentCart\App\Models\Coupon`
php
```
$order = FluentCart\App\Models\Order::find(1);
$usedCoupons = $order->usedCoupons;```

### shipping_address [](#shipping-address)

Access the shipping address.

- Returns `FluentCart\App\Models\OrderAddress`
php
```
$order = FluentCart\App\Models\Order::find(1);
$address = $order->shipping_address;```

### billing_address [](#billing-address)

Access the billing address.

- Returns `FluentCart\App\Models\OrderAddress`
php
```
$order = FluentCart\App\Models\Order::find(1);
$address = $order->billing_address;```

### order_addresses [](#order-addresses)

Access the order addresses.

- Returns `Illuminate\Database\Eloquent\Collection` of `FluentCart\App\Models\OrderAddress`
php
```
$order = FluentCart\App\Models\Order::find(1);
$addresses = $order->order_addresses;```

### licenses [](#licenses)

Access the order licenses.

- Returns `Illuminate\Database\Eloquent\Collection` of `FluentCartPro\App\Modules\Licensing\Models\License`
php
```
$order = FluentCart\App\Models\Order::find(1);
$licenses = $order->licenses;```

### labels [](#labels)

Access the order labels (morph many relationship).

- Returns `Illuminate\Database\Eloquent\Collection` of `FluentCart\App\Models\LabelRelationship`
php
```
$order = FluentCart\App\Models\Order::find(1);
$labels = $order->labels;```

### renewals [](#renewals)

Access the order renewals (child orders of type 'renewal', excluding canceled, failed, and on-hold).

- Returns `Illuminate\Database\Eloquent\Collection` of `FluentCart\App\Models\Order`
php
```
$order = FluentCart\App\Models\Order::find(1);
$renewals = $order->renewals;```

### orderOperation [](#orderoperation)

Access the order operation record.

- Returns `FluentCart\App\Models\OrderOperation`
php
```
$order = FluentCart\App\Models\Order::find(1);
$operation = $order->orderOperation;```

## Scopes [](#scopes)

This model has the following scopes that you can use
### searchBy($search) [](#searchby-search)

Search orders by query. Searches across order ID, status, total amount, payment status, payment method, invoice number, order item titles, and customer name/email.

- Parameters: `$search` (String) - Search query
php
```
$orders = FluentCart\App\Models\Order::searchBy('john')->get();```

### ofPaymentStatus($status) [](#ofpaymentstatus-status)

Get orders by payment status

- Parameters: `$status` (String) - Payment status
php
```
$orders = FluentCart\App\Models\Order::ofPaymentStatus('paid')->get();```

### ofOrderStatus($status) [](#oforderstatus-status)

Get orders by order status

- Parameters: `$status` (String) - Order status
php
```
$orders = FluentCart\App\Models\Order::ofOrderStatus('completed')->get();```

### ofShippingStatus($status) [](#ofshippingstatus-status)

Get orders by shipping status

- Parameters: `$status` (String) - Shipping status
php
```
$orders = FluentCart\App\Models\Order::ofShippingStatus('shipped')->get();```

### ofOrderType($type) [](#ofordertype-type)

Get orders by order type

- Parameters: `$type` (String) - Order type
php
```
$orders = FluentCart\App\Models\Order::ofOrderType('payment')->get();```

### ofPaymentMethod($methodName) [](#ofpaymentmethod-methodname)

Get orders by payment method

- Parameters: `$methodName` (String) - Payment method name
php
```
$orders = FluentCart\App\Models\Order::ofPaymentMethod('stripe')->get();```

### applyCustomFilters($filters) [](#applycustomfilters-filters)

Apply custom filters

- Parameters: `$filters` (Array) - Filter array
php
```
$orders = FluentCart\App\Models\Order::applyCustomFilters([
 'status' => ['value' => ['completed', 'processing']]
])->get();```

## Usage Examples [](#usage-examples)

### Creating an Order [](#creating-an-order)
php
```
use FluentCart\App\Models\Order;

$order = Order::create([
 'customer_id' => 1,
 'status' => 'pending',
 'payment_method' => 'stripe',
 'currency' => 'USD',
 'total_amount' => 9999 // $99.99 in cents
]);```

### Retrieving Orders [](#retrieving-orders)
php
```
// Get orders by payment status
$orders = Order::ofPaymentStatus('paid')->get();

// Get order by ID
$order = Order::find(1);

// Get order with items and customer
$order = Order::with(['order_items', 'customer'])->find(1);```

### Updating an Order [](#updating-an-order)
php
```
$order = Order::find(1);
$order->status = 'completed';
$order->completed_at = now();
$order->save();```

### Deleting an Order [](#deleting-an-order)
php
```
$order = Order::find(1);
$order->delete();```

---

## OrderItem

Source: https://dev.fluentcart.com/database/models/order-item.html


| DB Table Name | {wp_db_prefix}_fct_order_items | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-order-items-table) | 
| Source File | fluent-cart/app/Models/OrderItem.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\OrderItem | 
## Traits [](#traits)

| Trait | Description | 
| --- | --- |
| CanSearch | Provides `search()`, `whereLike()`, `whereBeginsWith()`, `whereEndsWith()`, `groupSearch()` scopes | 
| CanUpdateBatch | Provides `batchUpdate()` scope for bulk updates | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| order_id | Integer | Reference to order | 
| post_id | Integer | WordPress post ID (product) | 
| fulfillment_type | String | Fulfillment type (physical, digital, service) | 
| fulfilled_quantity | Integer | Quantity fulfilled | 
| post_title | Text | Product title | 
| title | Text | Item title (variation) | 
| object_id | Integer | Variation ID | 
| cart_index | Integer | Position in cart | 
| quantity | Integer | Item quantity | 
| unit_price | Bigint | Price per unit in cents | 
| cost | Bigint | Cost in cents | 
| subtotal | Bigint | Line subtotal | 
| tax_amount | Bigint | Tax amount for this line | 
| shipping_charge | Bigint | Shipping charge (not in fillable) | 
| discount_total | Bigint | Discount amount | 
| line_total | Bigint | Total line amount | 
| refund_total | Bigint | Refunded amount | 
| rate | Bigint | Exchange rate | 
| other_info | JSON | Additional item data (auto-encoded/decoded) | 
| line_meta | JSON | Line-specific metadata (auto-encoded/decoded) | 
| referrer | Text | Referral information | 
| object_type | String | Object type | 
| payment_type | String | Payment type (onetime, subscription, signup_fee) | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Casts [](#casts)

The following attributes are automatically cast to `double` when accessed:

| Attribute | Cast Type | 
| --- | --- |
| unit_price | double | 
| cost | double | 
| subtotal | double | 
| tax_amount | double | 
| shipping_charge | double | 
| discount_total | double | 
| line_total | double | 
| refund_total | double | 
## Appends [](#appends)

The following virtual attributes are appended to the model:

| Append | Type | Description | 
| --- | --- | --- |
| payment_info | string | Subscription payment info (empty string if not a subscription) | 
| setup_info | string | Subscription setup fee info (empty string if not a subscription) | 
| is_custom | boolean | Whether the item is a custom item (from `other_info['is_custom']`) | 
| formatted_total | float | Decimal-formatted subtotal (appended via `booted()` on retrieval) | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$orderItem = FluentCart\App\Models\OrderItem::find(1);

$orderItem->id; // returns id
$orderItem->order_id; // returns order ID
$orderItem->quantity; // returns quantity
$orderItem->unit_price; // returns unit price (cast to double)
$orderItem->line_total; // returns line total (cast to double)
$orderItem->payment_info; // returns subscription payment info string
$orderItem->setup_info; // returns subscription setup info string
$orderItem->is_custom; // returns boolean
$orderItem->formatted_total; // returns decimal-formatted subtotal
$orderItem->full_name; // returns title + post_title combined
$orderItem->view_url; // returns view URL for custom items```

## Relations [](#relations)

This model has the following relationships that you can use
### order [](#order)

Access the associated order

- Relation type: `belongsTo`
- return `FluentCart\App\Models\Order` Model
- Foreign key: `order_id`

#### Example: [](#example)
php
```
// Accessing Order
$order = $orderItem->order;

// For Filtering by order relationship
$orderItems = FluentCart\App\Models\OrderItem::whereHas('order', function($query) {
 $query->where('status', 'completed');
})->get();```

### product [](#product)

Access the associated product

- Relation type: `belongsTo`
- return `FluentCart\App\Models\Product` Model
- Foreign key: `post_id` -> `ID`

#### Example: [](#example-1)
php
```
// Accessing Product
$product = $orderItem->product;

// For Filtering by product relationship
$orderItems = FluentCart\App\Models\OrderItem::whereHas('product', function($query) {
 $query->where('post_status', 'publish');
})->get();```

### variants [](#variants)

Access the associated product variation

- Relation type: `belongsTo`
- return `FluentCart\App\Models\ProductVariation` Model
- Foreign key: `object_id` -> `id`

#### Example: [](#example-2)
php
```
// Accessing Product Variation
$variation = $orderItem->variants;```

### product_downloads [](#product-downloads)

Access the associated product downloads

- Relation type: `belongsTo`
- return `FluentCart\App\Models\ProductDownload` Model
- Foreign key: `post_id` -> `post_id`

#### Example: [](#example-3)
php
```
// Accessing Product Downloads
$downloads = $orderItem->product_downloads;```

### productImage [](#productimage)

Access the product gallery image via WordPress post meta

- Relation type: `hasOne`
- return `FluentCart\App\Models\WpModels\PostMeta` Model
- Foreign key: `post_id` -> `post_id`
- Condition: `postmeta.meta_key = 'fluent-products-gallery-image'`

#### Example: [](#example-4)
php
```
// Accessing Product Image
$image = $orderItem->productImage;```

### variantImages [](#variantimages)

Access the variant thumbnail image via product meta

- Relation type: `hasOne`
- return `FluentCart\App\Models\ProductMeta` Model
- Foreign key: `object_id` -> `object_id`
- Conditions: `object_type = 'product_variant_info'` and `meta_key = 'product_thumbnail'`

#### Example: [](#example-5)
php
```
// Accessing Variant Image
$variantImage = $orderItem->variantImages;```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### getFormattedTotalAttribute() [](#getformattedtotalattribute)

Get formatted line total as a decimal value (accessor). This attribute is appended automatically when the model is retrieved from the database via the `booted()` method.

- Parameters 

 - none

- Returns `float`

#### Usage [](#usage-1)
php
```
$formattedTotal = $orderItem->formatted_total; // Returns: 99.99```

### getPaymentInfoAttribute() [](#getpaymentinfoattribute)

Get subscription payment info string. Returns an empty string if the item's `payment_type` is not `subscription`. For subscription items, delegates to `Helper::generateSubscriptionInfo()` using `other_info` and `unit_price`.

- Parameters 

 - none

- Returns `string`

#### Usage [](#usage-2)
php
```
$paymentInfo = $orderItem->payment_info; // e.g. "$9.99 / month"```

### getSetupInfoAttribute() [](#getsetupinfoattribute)

Get subscription setup fee info string. Returns an empty string if the item's `payment_type` is not `subscription`. For subscription items, delegates to `Helper::generateSetupFeeInfo()` using `other_info`.

- Parameters 

 - none

- Returns `string`

#### Usage [](#usage-3)
php
```
$setupInfo = $orderItem->setup_info; // e.g. "$19.99 setup fee"```

### getIsCustomAttribute() [](#getiscustomattribute)

Check if this is a custom item (accessor). Reads the `is_custom` key from the `other_info` JSON field.

- Parameters 

 - none

- Returns `boolean`

#### Usage [](#usage-4)
php
```
$isCustom = $orderItem->is_custom; // Returns: true or false```

### getViewUrlAttribute() [](#getviewurlattribute)

Get the view URL for custom items (accessor). Returns an empty string for non-custom items.

- Parameters 

 - none

- Returns `string`

#### Usage [](#usage-5)
php
```
$viewUrl = $orderItem->view_url; // Returns URL string or empty string```

### getFullNameAttribute() [](#getfullnameattribute)

Get the full name by combining the item title and product title.

- Parameters 

 - none

- Returns `string`

#### Usage [](#usage-6)
php
```
$fullName = $orderItem->full_name; // Returns: "Variation Name Product Title"```

### getOtherInfoAttribute($value) [](#getotherinfoattribute-value)

Get other info as array (accessor). Automatically decodes the JSON string stored in the database.

- Parameters 

 - $value - mixed (raw database value)

- Returns `array`

#### Usage [](#usage-7)
php
```
$otherInfo = $orderItem->other_info; // Returns array```

### setOtherInfoAttribute($value) [](#setotherinfoattribute-value)

Set other info from array (mutator). Automatically encodes arrays/objects to JSON for storage.

- Parameters 

 - $value - array|object|string

- Returns `void`

#### Usage [](#usage-8)
php
```
$orderItem->other_info = ['custom_field' => 'value'];```

### getLineMetaAttribute($value) [](#getlinemetaattribute-value)

Get line meta as array (accessor). Automatically decodes the JSON string stored in the database.

- Parameters 

 - $value - mixed (raw database value)

- Returns `array`

#### Usage [](#usage-9)
php
```
$lineMeta = $orderItem->line_meta; // Returns array```

### setLineMetaAttribute($value) [](#setlinemetaattribute-value)

Set line meta from array (mutator). Automatically encodes arrays/objects to JSON for storage.

- Parameters 

 - $value - array|object

- Returns `void`

#### Usage [](#usage-10)
php
```
$orderItem->line_meta = ['custom_meta' => 'value'];```

### processCustom($product, $orderId) [](#processcustom-product-orderid)

Process a custom item for an order. Delegates to `OrderItemHelper::processCustom()`.

- Parameters 

 - $product - mixed (product data)
 - $orderId - integer (order ID)

- Returns `mixed`

#### Usage [](#usage-11)
php
```
$orderItem = new FluentCart\App\Models\OrderItem();
$result = $orderItem->processCustom($productData, 123);```

### createItem($orderItems) [](#createitem-orderitems)

Create an item (note: the method body returns a `belongsTo` relation to `ProductVariation` via `variation_id`).

- Parameters 

 - $orderItems - mixed

- Returns `BelongsTo` relation to `FluentCart\App\Models\ProductVariation`

---

## OrderMeta

Source: https://dev.fluentcart.com/database/models/order-meta.html


| DB Table Name | {wp_db_prefix}_fct_order_meta | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-order-meta-table) | 
| Source File | fluent-cart/app/Models/OrderMeta.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\OrderMeta | 
## Traits [](#traits)

- **CanSearch** - Provides `search()`, `whereLike()`, `whereBeginsWith()`, `whereEndsWith()`, and `groupSearch()` scopes

## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| order_id | Integer | Reference to order | 
| meta_key | String | Meta key name | 
| meta_value | Text | Meta value (JSON or string) | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$orderMeta = FluentCart\App\Models\OrderMeta::find(1);

$orderMeta->id; // returns id
$orderMeta->order_id; // returns order ID
$orderMeta->meta_key; // returns meta key
$orderMeta->meta_value; // returns meta value (auto-decoded if JSON)```

## Scopes [](#scopes)

This model has the following scopes via the `CanSearch` trait.
### search($params) [](#search-params)

Perform a parameterized search with various operators (=, like_all, between, in, not_in, etc.).

- Parameters 

 - $params - array of search parameters

#### Usage: [](#usage-1)
php
```
$orderMeta = FluentCart\App\Models\OrderMeta::search([
 'meta_key' => 'billing_address',
])->get();```

### whereLike($column, $value, $boolean = 'and') [](#wherelike-column-value-boolean-and)

Filter with a WHERE LIKE %value% query.

- Parameters 

 - $column - string
 - $value - string
 - $boolean - string (default: 'and')

#### Usage: [](#usage-2)
php
```
$orderMeta = FluentCart\App\Models\OrderMeta::whereLike('meta_key', 'billing')->get();```

### whereBeginsWith($column, $value, $boolean = 'and') [](#wherebeginswith-column-value-boolean-and)

Filter with a WHERE LIKE value% query.

- Parameters 

 - $column - string
 - $value - string
 - $boolean - string (default: 'and')

#### Usage: [](#usage-3)
php
```
$orderMeta = FluentCart\App\Models\OrderMeta::whereBeginsWith('meta_key', 'shipping_')->get();```

### whereEndsWith($column, $value, $boolean = 'and') [](#whereendswith-column-value-boolean-and)

Filter with a WHERE LIKE %value query.

- Parameters 

 - $column - string
 - $value - string
 - $boolean - string (default: 'and')

#### Usage: [](#usage-4)
php
```
$orderMeta = FluentCart\App\Models\OrderMeta::whereEndsWith('meta_key', '_address')->get();```

### groupSearch($groups) [](#groupsearch-groups)

Perform grouped searches across the model and its relationships.

- Parameters 

 - $groups - array of grouped search parameters

#### Usage: [](#usage-5)
php
```
$orderMeta = FluentCart\App\Models\OrderMeta::groupSearch([
 'OrderMeta.meta_key' => [
 'column' => 'meta_key',
 'operator' => '=',
 'value' => 'billing_address'
 ],
])->get();```

## Relations [](#relations)

This model has the following relationships that you can use
### order [](#order)

Access the associated order

- return `FluentCart\App\Models\Order` Model

#### Example: [](#example)
php
```
// Accessing Order
$order = $orderMeta->order;

// For Filtering by order relationship
$orderMeta = FluentCart\App\Models\OrderMeta::whereHas('order', function($query) {
 $query->where('status', 'completed');
})->get();```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### setMetaValueAttribute($value) [](#setmetavalueattribute-value)

Set meta value with automatic JSON encoding for arrays and objects (mutator). Uses `JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES` flags.

- Parameters 

 - $value - array|object|string

- Returns `void`

#### Usage [](#usage-6)
php
```
// Set array value (will be JSON encoded)
$orderMeta->meta_value = ['address' => '123 Main St', 'city' => 'New York'];

// Set string value
$orderMeta->meta_value = 'simple string value';```

### getMetaValueAttribute($value) [](#getmetavalueattribute-value)

Get meta value with automatic JSON decoding (accessor). Returns the decoded array if the value is valid JSON, otherwise returns the original string.

- Parameters 

 - $value - mixed

- Returns `mixed` - array if valid JSON, original string otherwise

#### Usage [](#usage-7)
php
```
$metaValue = $orderMeta->meta_value; // Returns array if JSON, string otherwise```

### updateMeta($metaKey, $metaValue) [](#updatemeta-metakey-metavalue)

Create or update a meta entry for the current order. If a record with the same `order_id` and `meta_key` exists, it updates the value; otherwise, it creates a new record.

- Parameters 

 - $metaKey - string
 - $metaValue - mixed

- Returns `FluentCart\App\Models\OrderMeta`

#### Usage [](#usage-8)
php
```
$orderMeta = FluentCart\App\Models\OrderMeta::find(1);
$result = $orderMeta->updateMeta('custom_field', ['key' => 'value']);```

## Common Meta Keys [](#common-meta-keys)

Here are some common meta keys used in FluentCart:
### Billing Information [](#billing-information)

- `billing_address` - Billing address data
- `billing_first_name` - Billing first name
- `billing_last_name` - Billing last name
- `billing_company` - Billing company
- `billing_address_1` - Billing address line 1
- `billing_address_2` - Billing address line 2
- `billing_city` - Billing city
- `billing_state` - Billing state
- `billing_postcode` - Billing postal code
- `billing_country` - Billing country
- `billing_phone` - Billing phone number
- `billing_email` - Billing email

### Shipping Information [](#shipping-information)

- `shipping_address` - Shipping address data
- `shipping_first_name` - Shipping first name
- `shipping_last_name` - Shipping last name
- `shipping_company` - Shipping company
- `shipping_address_1` - Shipping address line 1
- `shipping_address_2` - Shipping address line 2
- `shipping_city` - Shipping city
- `shipping_state` - Shipping state
- `shipping_postcode` - Shipping postal code
- `shipping_country` - Shipping country
- `shipping_phone` - Shipping phone number

### Order Information [](#order-information)

- `order_notes` - Order notes
- `customer_notes` - Customer notes
- `admin_notes` - Admin notes
- `payment_method` - Payment method used
- `payment_method_title` - Payment method display name
- `transaction_id` - Payment transaction ID
- `gateway_transaction_id` - Gateway transaction ID
- `gateway_order_id` - Gateway order ID

### Subscription Information [](#subscription-information)

- `subscription_id` - Associated subscription ID
- `subscription_status` - Subscription status
- `next_payment_date` - Next payment date
- `subscription_interval` - Subscription interval

### Custom Fields [](#custom-fields)

- `custom_field_*` - Custom field values
- `_custom_*` - Custom meta fields

## Usage Examples [](#usage-examples)

### Get Order Billing Address [](#get-order-billing-address)
php
```
$order = FluentCart\App\Models\Order::find(123);
$billingAddress = $order->meta()->where('meta_key', 'billing_address')->first();

if ($billingAddress) {
 $address = $billingAddress->meta_value; // Returns array
 echo $address['address_1'] . ', ' . $address['city'];
}```

### Set Order Custom Meta [](#set-order-custom-meta)
php
```
$order = FluentCart\App\Models\Order::find(123);

// Set custom meta
$order->meta()->updateOrCreate(
 ['meta_key' => 'custom_field'],
 ['meta_value' => ['value' => 'custom data', 'type' => 'text']]
);```

### Update Meta via updateMeta() [](#update-meta-via-updatemeta)
php
```
$orderMeta = FluentCart\App\Models\OrderMeta::where('order_id', 123)->first();
$orderMeta->updateMeta('shipping_notes', 'Leave at front door');```

### Get All Order Meta as Key-Value Array [](#get-all-order-meta-as-key-value-array)
php
```
$order = FluentCart\App\Models\Order::find(123);
$metaData = $order->meta()->pluck('meta_value', 'meta_key')->toArray();```

---

## OrderTransaction

Source: https://dev.fluentcart.com/database/models/order-transaction.html


| DB Table Name | {wp_db_prefix}_fct_order_transactions | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-order-transactions-table) | 
| Source File | fluent-cart/app/Models/OrderTransaction.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\OrderTransaction | 
## Traits [](#traits)

- **CanSearch** (`FluentCart\App\Models\Concerns\CanSearch`) -- Provides `search`, `groupSearch`, `whereLike`, `whereBeginsWith`, and `whereEndsWith` scopes for flexible querying.

## Appends [](#appends)

The model automatically appends the following computed attributes to its array/JSON output:

- `url` -- Transaction URL generated via the `getUrlAttribute` accessor

## Boot [](#boot)

On the `creating` event the model auto-generates a `uuid` when one is not already set:php
```
$model->uuid = md5(time() . wp_generate_uuid4());```

## Searchable Fields [](#searchable-fields)

The following columns are searchable via the `CanSearch` trait:
`id`, `total`, `status`, `payment_method`, `currency`, `created_at`, `updated_at`
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| order_id | Integer | Reference to order | 
| order_type | String | Order type (onetime, subscription, signup_fee) | 
| vendor_charge_id | String | Payment gateway transaction ID | 
| payment_method | String | Payment method key | 
| payment_mode | String | Payment mode (live, test) | 
| payment_method_type | String | Payment method type (card, bank, etc.) | 
| currency | String | Transaction currency | 
| transaction_type | String | Transaction type (charge, refund, partial_refund, dispute) | 
| subscription_id | Integer | Reference to subscription (if applicable) | 
| card_last_4 | String | Last 4 digits of card | 
| card_brand | String | Card brand (visa, mastercard, etc.) | 
| status | String | Transaction status | 
| total | Bigint | Transaction amount in cents | 
| rate | Bigint | Exchange rate | 
| meta | JSON | Additional transaction data (stored as JSON, accessed as array via accessor/mutator) | 
| uuid | String | Unique transaction identifier (auto-generated on create) | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$transaction = FluentCart\App\Models\OrderTransaction::find(1);

$transaction->id; // returns id
$transaction->order_id; // returns order ID
$transaction->total; // returns total amount in cents
$transaction->status; // returns status
$transaction->payment_method; // returns payment method
$transaction->meta; // returns array (auto-decoded from JSON)
$transaction->url; // returns computed transaction URL (appended attribute)```

## Scopes [](#scopes)

This model has the following scopes that you can use
### ofStatus($status) [](#ofstatus-status)

Filter transactions by status

- Parameters 

 - $status - string

#### Usage: [](#usage-1)
php
```
// Get all successful transactions
$transactions = FluentCart\App\Models\OrderTransaction::ofStatus('succeeded')->get();```

### ofPaymentMethod($methodName) [](#ofpaymentmethod-methodname)

Filter transactions by payment method

- Parameters 

 - $methodName - string

#### Usage: [](#usage-2)
php
```
// Get all Stripe transactions
$transactions = FluentCart\App\Models\OrderTransaction::ofPaymentMethod('stripe')->get();```

### searchByPayerEmail($data) [](#searchbypayeremail-data)

Filter transactions by the payer email address stored in the `meta` JSON column at `$.payer.email_address`. Supports multiple operators.

- Parameters 

 - $data - array with keys: 

 - `value` (string) - The email or partial email to search for
 - `operator` (string, optional) - One of `contains` (default), `starts_with`, `ends_with`, `equals`, `not_like`

#### Usage: [](#usage-3)
php
```
// Find transactions where payer email contains "example.com"
$transactions = FluentCart\App\Models\OrderTransaction::searchByPayerEmail([
 'value' => 'example.com',
 'operator' => 'contains',
])->get();

// Find transactions where payer email starts with "john"
$transactions = FluentCart\App\Models\OrderTransaction::searchByPayerEmail([
 'value' => 'john',
 'operator' => 'starts_with',
])->get();

// Find transactions where payer email exactly matches
$transactions = FluentCart\App\Models\OrderTransaction::searchByPayerEmail([
 'value' => '[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)',
 'operator' => 'equals',
])->get();```

## Relations [](#relations)

This model has the following relationships that you can use
### order [](#order)

Access the associated order (belongsTo)

- return `FluentCart\App\Models\Order` Model

#### Example: [](#example)
php
```
// Accessing Order
$order = $transaction->order;

// For Filtering by order relationship
$transactions = FluentCart\App\Models\OrderTransaction::whereHas('order', function($query) {
 $query->where('status', 'completed');
})->get();```

### orders [](#orders)

Access the associated order via hasOne (alternative to `order` relationship)

- return `FluentCart\App\Models\Order` Model (HasOne)

#### Example: [](#example-1)
php
```
// Accessing Order via hasOne
$order = $transaction->orders;```

### subscription [](#subscription)

Access the associated subscription (hasOne)

- return `FluentCart\App\Models\Subscription` Model

#### Example: [](#example-2)
php
```
// Accessing Subscription
$subscription = $transaction->subscription;

// For Filtering by subscription relationship
$transactions = FluentCart\App\Models\OrderTransaction::whereHas('subscription', function($query) {
 $query->where('status', 'active');
})->get();```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### getMetaAttribute($value) [](#getmetaattribute-value)

Get meta as array (accessor). Automatically decodes the JSON string stored in the database into a PHP array.

- Parameters 

 - $value - mixed (raw JSON string from database)

- Returns `array`

#### Usage [](#usage-4)
php
```
$meta = $transaction->meta; // Returns array```

### setMetaAttribute($value) [](#setmetaattribute-value)

Set meta from array/object (mutator). Automatically encodes the value to a JSON string for storage.

- Parameters 

 - $value - array|object

- Returns `void`

#### Usage [](#usage-5)
php
```
$transaction->meta = ['gateway_response' => 'success', 'fee' => 2.9];```

### getUrlAttribute($value) [](#geturlattribute-value)

Get transaction URL (accessor). Applies the `fluent_cart/transaction/url_{payment_method}` filter to generate a gateway-specific URL.

- Parameters 

 - $value - mixed

- Returns `string`

#### Usage [](#usage-6)
php
```
$url = $transaction->url; // Returns filtered transaction URL```

### updateStatus($newStatus, $otherData = []) [](#updatestatus-newstatus-otherdata)

Update the transaction status. If the new status is the same as the current status, no update is performed. Optionally fills additional data before saving.

- Parameters 

 - $newStatus - string - The new status to set
 - $otherData - array (optional) - Additional fillable attributes to update

- Returns `OrderTransaction` - The current model instance

#### Usage [](#usage-7)
php
```
// Update status only
$transaction->updateStatus('succeeded');

// Update status with additional data
$transaction->updateStatus('succeeded', [
 'vendor_charge_id' => 'ch_abc123',
 'card_last_4' => '4242',
 'card_brand' => 'visa',
]);```

### bulkDeleteByOrderIds($ids, $params = []) [](#bulkdeletebyorderids-ids-params)

Delete all transactions associated with the given order IDs. This is a static method.

- Parameters 

 - $ids - array - Array of order IDs
 - $params - array (optional) - Currently unused

- Returns `mixed` - Result of the delete query

#### Usage [](#usage-8)
php
```
// Delete all transactions for specific orders
FluentCart\App\Models\OrderTransaction::bulkDeleteByOrderIds([123, 456, 789]);```

### getMaxRefundableAmount() [](#getmaxrefundableamount)

Calculate the maximum refundable amount for this transaction. Returns 0 if the transaction status is not `succeeded`. Subtracts any already-refunded amount (from `meta.refunded_total`) from the transaction total.

- Parameters 

 - none

- Returns `int` - The maximum refundable amount in cents

#### Usage [](#usage-9)
php
```
$maxRefund = $transaction->getMaxRefundableAmount();
// If total is 5000 (cents) and 2000 has been refunded, returns 3000```

### getPaymentMethodText() [](#getpaymentmethodtext)

Get a human-readable payment method description. If card brand and last 4 digits are available, returns a formatted string like "visa ***4242". Otherwise returns the raw payment method key.

- Parameters 

 - none

- Returns `string`

#### Usage [](#usage-10)
php
```
$text = $transaction->getPaymentMethodText();
// Returns "visa ***4242" or "stripe" (fallback)```

### getReceiptPageUrl($filtered = false) [](#getreceiptpageurl-filtered-false)

Generate the receipt page URL for this transaction. Appends the `trx_hash` query parameter (the transaction's uuid) to the store's configured receipt page URL.

- Parameters 

 - $filtered - boolean (optional, default `false`) - When `true`, applies the `fluentcart/transaction/receipt_page_url` filter

- Returns `string` - The full receipt page URL

#### Usage [](#usage-11)
php
```
// Get basic receipt URL
$url = $transaction->getReceiptPageUrl();

// Get filtered receipt URL (allows plugins to modify)
$url = $transaction->getReceiptPageUrl(true);```

### acceptDispute($args = []) [](#acceptdispute-args)

Accept a payment dispute for this transaction. Only works on transactions where `transaction_type` is `dispute`. Calls the payment gateway's remote dispute handler, updates the transaction status to `dispute_lost`, adjusts the order's `total_paid` and `payment_status`, and logs the action.

- Parameters 

 - $args - array (optional) - Accepts: 

 - `dispute_note` (string) - Optional note about the dispute acceptance

- Returns `void|\WP_Error` - Returns `WP_Error` if the transaction is not a dispute, the payment method does not support remote dispute management, or the remote handler fails

#### Usage [](#usage-12)
php
```
$result = $transaction->acceptDispute([
 'dispute_note' => 'Customer claim accepted, refund approved.',
]);

if (is_wp_error($result)) {
 // Handle error
 echo $result->get_error_message();
}```

## Transaction Statuses [](#transaction-statuses)

Common transaction statuses in FluentCart:

- `pending` - Transaction is pending
- `processing` - Transaction is being processed
- `succeeded` - Transaction succeeded
- `failed` - Transaction failed
- `cancelled` - Transaction was cancelled
- `refunded` - Transaction was refunded
- `partially_refunded` - Transaction was partially refunded
- `dispute_lost` - Dispute accepted/lost

## Transaction Types [](#transaction-types)

Common transaction types in FluentCart:

- `charge` - Initial charge/payment
- `refund` - Full refund
- `partial_refund` - Partial refund
- `dispute` - Payment dispute

## Usage Examples [](#usage-examples)

### Get Order Transactions [](#get-order-transactions)
php
```
$order = FluentCart\App\Models\Order::find(123);
$transactions = $order->transactions()->orderBy('created_at', 'desc')->get();

foreach ($transactions as $transaction) {
 echo "Transaction #{$transaction->id}: {$transaction->total} cents - {$transaction->status}";
}```

### Get Successful Transactions for Date Range [](#get-successful-transactions-for-date-range)
php
```
$transactions = FluentCart\App\Models\OrderTransaction::ofStatus('succeeded')
 ->whereBetween('created_at', ['2024-01-01', '2024-01-31'])
 ->get();```

### Get Refund Transactions [](#get-refund-transactions)
php
```
$refunds = FluentCart\App\Models\OrderTransaction::whereIn('transaction_type', ['refund', 'partial_refund'])
 ->get();```

### Get Subscription Transactions [](#get-subscription-transactions)
php
```
$subscriptionTransactions = FluentCart\App\Models\OrderTransaction::whereNotNull('subscription_id')
 ->get();```

### Calculate Refundable Amount [](#calculate-refundable-amount)
php
```
$transaction = FluentCart\App\Models\OrderTransaction::find(1);
$maxRefund = $transaction->getMaxRefundableAmount();
echo "Max refundable: " . $maxRefund . " cents";```

### Search by Payer Email [](#search-by-payer-email)
php
```
$transactions = FluentCart\App\Models\OrderTransaction::searchByPayerEmail([
 'value' => '[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)',
 'operator' => 'equals',
])->get();```

---

## OrderAddress

Source: https://dev.fluentcart.com/database/models/order-address.html


| DB Table Name | {wp_db_prefix}_fct_order_addresses | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-order-addresses-table) | 
| Source File | fluent-cart/app/Models/OrderAddress.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\OrderAddress | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| order_id | Integer | Reference to order | 
| type | String | Address type (billing, shipping) | 
| name | String | Full name | 
| address_1 | String | Primary address line | 
| address_2 | String | Secondary address line | 
| city | String | City | 
| state | String | State/Province | 
| postcode | String | Postal/ZIP code | 
| country | String | Country code | 
| meta | JSON NULL | Additional address data (stores phone, company_name, label in `other_data`) | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Appended Attributes [](#appended-attributes)

The following virtual attributes are appended to every serialized response via `$appends`:

| Attribute | Data Type | Description | 
| --- | --- | --- |
| email | String/Null | Email from associated order's customer | 
| first_name | String/Null | First part of name (split by space) | 
| last_name | String/Null | Last part of name (split by space) | 
| full_name | String/Null | Same as `name` attribute | 
| formatted_address | Array | Full formatted address array with resolved country/state names | 
| company_name | String | Company name stored in `meta.other_data.company_name` | 
| phone | String | Phone number stored in `meta.other_data.phone` | 
| label | String | Address label stored in `meta.other_data.label` | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$orderAddress = FluentCart\App\Models\OrderAddress::find(1);

$orderAddress->id; // returns id
$orderAddress->order_id; // returns order ID
$orderAddress->type; // returns address type
$orderAddress->name; // returns full name
$orderAddress->email; // returns email from order's customer
$orderAddress->first_name; // returns first name
$orderAddress->last_name; // returns last name
$orderAddress->full_name; // returns full name (alias for name)
$orderAddress->company_name; // returns company name from meta
$orderAddress->phone; // returns phone from meta
$orderAddress->label; // returns label from meta
$orderAddress->formatted_address; // returns formatted address array```

## Relations [](#relations)

This model has the following relationships that you can use
### order [](#order)

Access the associated order

- return `FluentCart\App\Models\Order` Model

#### Example: [](#example)
php
```
// Accessing Order
$order = $orderAddress->order;

// For Filtering by order relationship
$orderAddresses = FluentCart\App\Models\OrderAddress::whereHas('order', function($query) {
 $query->where('status', 'completed');
})->get();```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### setMetaAttribute($value) [](#setmetaattribute-value)

Set meta from array/object (mutator). Automatically JSON-encodes the value.

- Parameters 

 - $value - array|object|null

- Returns `void`

#### Usage [](#usage-1)
php
```
$orderAddress->meta = ['other_data' => ['phone' => '555-1234', 'company_name' => 'Acme Inc']];```

### getMetaAttribute($value) [](#getmetaattribute-value)

Get meta as array (accessor). Automatically JSON-decodes the stored value.

- Parameters 

 - $value - mixed

- Returns `array`

#### Usage [](#usage-2)
php
```
$meta = $orderAddress->meta; // Returns array```

### getFullNameAttribute() [](#getfullnameattribute)

Get full name (accessor). Returns the `name` attribute directly.

- Parameters 

 - none

- Returns `string|null`

#### Usage [](#usage-3)
php
```
$fullName = $orderAddress->full_name; // Returns full name```

### getFirstNameAttribute() [](#getfirstnameattribute)

Get first name (accessor). Splits `name` by space and returns the first part.

- Parameters 

 - none

- Returns `string|null`

#### Usage [](#usage-4)
php
```
$firstName = $orderAddress->first_name; // Returns first name```

### getLastNameAttribute() [](#getlastnameattribute)

Get last name (accessor). Splits `name` by space and returns the last part.

- Parameters 

 - none

- Returns `string|null`

#### Usage [](#usage-5)
php
```
$lastName = $orderAddress->last_name; // Returns last name```

### getEmailAttribute() [](#getemailattribute)

Get email address from associated order's customer (accessor).

- Parameters 

 - none

- Returns `string|null`

#### Usage [](#usage-6)
php
```
$email = $orderAddress->email; // Returns email from order's customer```

### getCompanyNameAttribute() [](#getcompanynameattribute)

Get company name from meta `other_data.company_name` (accessor).

- Parameters 

 - none

- Returns `string`

#### Usage [](#usage-7)
php
```
$companyName = $orderAddress->company_name; // Returns company name or empty string```

### setCompanyNameAttribute($value) [](#setcompanynameattribute-value)

Set company name in meta `other_data.company_name` (mutator). Skips if value is falsy.

- Parameters 

 - $value - string|null

- Returns `void`

#### Usage [](#usage-8)
php
```
$orderAddress->company_name = 'Acme Inc';```

### getPhoneAttribute() [](#getphoneattribute)

Get phone number from meta `other_data.phone` (accessor).

- Parameters 

 - none

- Returns `string`

#### Usage [](#usage-9)
php
```
$phone = $orderAddress->phone; // Returns phone number or empty string```

### setPhoneAttribute($value) [](#setphoneattribute-value)

Set phone number in meta `other_data.phone` (mutator). Skips if value is falsy.

- Parameters 

 - $value - string|null

- Returns `void`

#### Usage [](#usage-10)
php
```
$orderAddress->phone = '555-1234';```

### getLabelAttribute() [](#getlabelattribute)

Get address label from meta `other_data.label` (accessor).

- Parameters 

 - none

- Returns `string`

#### Usage [](#usage-11)
php
```
$label = $orderAddress->label; // Returns label or empty string```

### setLabelAttribute($value) [](#setlabelattribute-value)

Set address label in meta `other_data.label` (mutator). Skips if value is falsy.

- Parameters 

 - $value - string|null

- Returns `void`

#### Usage [](#usage-12)
php
```
$orderAddress->label = 'Home';```

### getFormattedAddressAttribute() [](#getformattedaddressattribute)

Get formatted address as array (accessor). Delegates to `getFormattedAddress()`.

- Parameters 

 - none

- Returns `array`

#### Usage [](#usage-13)
php
```
$formattedAddress = $orderAddress->formatted_address; // Returns formatted address array```

### getFormattedAddress($filtered = false) [](#getformattedaddress-filtered-false)

Get formatted address with optional filtering. Returns an array including resolved country/state names, full address string, and all name/email/company fields.

- Parameters 

 - $filtered - boolean (default: false) - When true, removes empty values from the address array

- Returns `array` - Keys: `country`, `state`, `city`, `postcode`, `address_1`, `address_2`, `type`, `name`, `first_name`, `last_name`, `full_name`, `email`, `company_name`, `label`, `full_address`

#### Usage [](#usage-14)
php
```
$formattedAddress = $orderAddress->getFormattedAddress(true); // Returns filtered formatted address```

### getAddressAsText($isHtml = false, $includeName = true, $separator = ', ') [](#getaddressastext-ishtml-false-includename-true-separator)

Get address as formatted text string.

- Parameters 

 - $isHtml - boolean (default: false)
 - $includeName - boolean (default: true)
 - $separator - string (default: ', ')

- Returns `string`

#### Usage [](#usage-15)
php
```
$addressText = $orderAddress->getAddressAsText(false, true, ', '); // Returns: "John Doe, 123 Main St, New York, NY, 10001, US"```

### getFormattedDataForCheckout($prefix = 'billing_') [](#getformatteddataforcheckout-prefix-billing)

Get address data formatted for checkout forms. Returns an associative array with prefixed keys suitable for pre-filling checkout fields. When prefix is `billing_`, the `billing_full_name` key is excluded.

- Parameters 

 - $prefix - string (default: 'billing_')

- Returns `array` - Keys like `{prefix}address_id`, `{prefix}full_name`, `{prefix}address_1`, `{prefix}address_2`, `{prefix}city`, `{prefix}state`, `{prefix}phone`, `{prefix}postcode`, `{prefix}country`, `{prefix}company_name`

#### Usage [](#usage-16)
php
```
$checkoutData = $orderAddress->getFormattedDataForCheckout('billing_');
// Returns: ['billing_address_id' => 1, 'billing_address_1' => '123 Main St', ...]

$shippingData = $orderAddress->getFormattedDataForCheckout('shipping_');
// Returns: ['shipping_address_id' => 1, 'shipping_full_name' => 'John Doe', ...]```

## Address Types [](#address-types)

Common address types in FluentCart:

- `billing` - Billing address for payment processing
- `shipping` - Shipping address for order fulfillment

## Usage Examples [](#usage-examples)

### Get Order Addresses [](#get-order-addresses)
php
```
$order = FluentCart\App\Models\Order::find(123);
$addresses = $order->order_addresses;

foreach ($addresses as $address) {
 echo "Address Type: " . $address->type;
 echo "Name: " . $address->name;
 echo "Address: " . $address->getAddressAsText();
}```

### Get Billing Address [](#get-billing-address)
php
```
$billingAddress = FluentCart\App\Models\OrderAddress::where('order_id', 123)
 ->where('type', 'billing')
 ->first();```

### Get Shipping Address [](#get-shipping-address)
php
```
$shippingAddress = FluentCart\App\Models\OrderAddress::where('order_id', 123)
 ->where('type', 'shipping')
 ->first();```

### Create Order Address [](#create-order-address)
php
```
$orderAddress = FluentCart\App\Models\OrderAddress::create([
 'order_id' => 123,
 'type' => 'billing',
 'name' => 'John Doe',
 'address_1' => '123 Main Street',
 'city' => 'New York',
 'state' => 'NY',
 'postcode' => '10001',
 'country' => 'US'
]);```

### Get Formatted Address [](#get-formatted-address)
php
```
$address = FluentCart\App\Models\OrderAddress::find(1);
$formattedText = $address->getAddressAsText();
// Returns: "John Doe, 123 Main Street, New York, NY, 10001, US"```

### Get Checkout-Ready Data [](#get-checkout-ready-data)
php
```
$address = FluentCart\App\Models\OrderAddress::find(1);
$billingData = $address->getFormattedDataForCheckout('billing_');
$shippingData = $address->getFormattedDataForCheckout('shipping_');```

---

## OrderOperation

Source: https://dev.fluentcart.com/database/models/order-operation.html


| DB Table Name | {wp_db_prefix}_fct_order_operations | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-order-operations-table) | 
| Source File | fluent-cart/app/Models/OrderOperation.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\OrderOperation | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key (guarded) | 
| order_id | Integer | Reference to order | 
| created_via | String | How the order was created | 
| has_tax | Boolean | Whether order has tax | 
| has_discount | Boolean | Whether order has discount | 
| coupons_counted | Integer | Number of coupons applied | 
| emails_sent | Integer | Number of emails sent | 
| sales_recorded | Boolean | Whether sales were recorded | 
| utm_campaign | String | UTM campaign parameter | 
| utm_term | String | UTM term parameter | 
| utm_source | String | UTM source parameter | 
| utm_content | String | UTM content parameter | 
| utm_medium | String | UTM medium parameter | 
| utm_id | String | UTM ID parameter | 
| cart_hash | String | Cart hash identifier | 
| refer_url | String | Referral URL | 
| meta | JSON | Additional operation data (has accessor/mutator but not in $fillable) | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
**Note:** The `meta` column has accessor/mutator methods for JSON encoding/decoding but is not included in `$fillable`. It must be set directly on the model instance. The `id` column is both guarded and declared as `$primaryKey`.
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$orderOperation = FluentCart\App\Models\OrderOperation::find(1);

$orderOperation->id; // returns id
$orderOperation->order_id; // returns order ID
$orderOperation->created_via; // returns creation method
$orderOperation->has_tax; // returns tax status```

## Relations [](#relations)

This model has the following relationships that you can use
### order [](#order)

Access the associated order

- return `FluentCart\App\Models\Order` Model

#### Example: [](#example)
php
```
// Accessing Order
$order = $orderOperation->order;

// For Filtering by order relationship
$orderOperations = FluentCart\App\Models\OrderOperation::whereHas('order', function($query) {
 $query->where('status', 'completed');
})->get();```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### setMetaAttribute($value) [](#setmetaattribute-value)

Set meta from array (mutator). Automatically JSON-encodes the value.

- Parameters 

 - $value - array|object

- Returns `void`

#### Usage [](#usage-1)
php
```
$orderOperation->meta = ['analytics_data' => 'value', 'tracking_info' => 'data'];```

### getMetaAttribute($value) [](#getmetaattribute-value)

Get meta as array (accessor). Automatically JSON-decodes the stored value.

- Parameters 

 - $value - mixed

- Returns `array`

#### Usage [](#usage-2)
php
```
$meta = $orderOperation->meta; // Returns array```

## Usage Examples [](#usage-examples)

### Get Order Operations [](#get-order-operations)
php
```
$order = FluentCart\App\Models\Order::find(123);
$operations = $order->order_operations;

foreach ($operations as $operation) {
 echo "Created via: " . $operation->created_via;
 echo "UTM Campaign: " . $operation->utm_campaign;
}```

### Get Operations by UTM Source [](#get-operations-by-utm-source)
php
```
$googleOperations = FluentCart\App\Models\OrderOperation::where('utm_source', 'google')->get();
$facebookOperations = FluentCart\App\Models\OrderOperation::where('utm_source', 'facebook')->get();```

### Create Order Operation [](#create-order-operation)
php
```
$orderOperation = FluentCart\App\Models\OrderOperation::create([
 'order_id' => 123,
 'created_via' => 'checkout',
 'has_tax' => true,
 'has_discount' => true,
 'coupons_counted' => 2,
 'emails_sent' => 3,
 'sales_recorded' => true,
 'utm_campaign' => 'summer_sale',
 'utm_source' => 'google',
 'utm_medium' => 'cpc',
 'cart_hash' => 'abc123def456',
 'refer_url' => 'https://example.com/products'
]);```

### Track UTM Parameters [](#track-utm-parameters)
php
```
$orderOperation = FluentCart\App\Models\OrderOperation::create([
 'order_id' => 123,
 'utm_campaign' => 'black_friday',
 'utm_source' => 'facebook',
 'utm_medium' => 'social',
 'utm_content' => 'banner_ad',
 'utm_term' => 'discount',
 'utm_id' => 'fb_123'
]);```

---

## OrderTaxRate

Source: https://dev.fluentcart.com/database/models/order-tax-rate.html


| DB Table Name | {wp_db_prefix}_fct_order_tax_rate | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-order-tax-rate-table) | 
| Source File | fluent-cart/app/Models/OrderTaxRate.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\OrderTaxRate | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key (guarded) | 
| order_id | Integer | Reference to order | 
| tax_rate_id | Integer | Reference to tax rate | 
| shipping_tax | Decimal | Shipping tax amount (in cents) | 
| order_tax | Decimal | Order tax amount (in cents) | 
| total_tax | Decimal | Total tax amount (in cents) | 
| meta | JSON | Additional tax data | 
| filed_at | Date Time | Tax filing date | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
**Note:** The `id` column is both guarded and declared as `$primaryKey`.
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$orderTaxRate = FluentCart\App\Models\OrderTaxRate::find(1);

$orderTaxRate->id; // returns id
$orderTaxRate->order_id; // returns order ID
$orderTaxRate->tax_rate_id; // returns tax rate ID
$orderTaxRate->total_tax; // returns total tax amount```

## Scopes [](#scopes)

This model has the following scopes that you can use
### validOrder() [](#validorder)

Filter tax rates to only include those belonging to completed orders. Uses a `whereHas` on the `order` relationship with `status = 'completed'`.

- Parameters 

 - none

#### Usage: [](#usage-1)
php
```
// Get tax rates for completed orders only
$taxRates = FluentCart\App\Models\OrderTaxRate::validOrder()->get();```

## Relations [](#relations)

This model has the following relationships that you can use
### order [](#order)

Access the associated order

- return `FluentCart\App\Models\Order` Model

#### Example: [](#example)
php
```
// Accessing Order
$order = $orderTaxRate->order;

// For Filtering by order relationship
$orderTaxRates = FluentCart\App\Models\OrderTaxRate::whereHas('order', function($query) {
 $query->where('status', 'completed');
})->get();```

### tax_rate [](#tax-rate)

Access the associated tax rate

- return `FluentCart\App\Models\TaxRate` Model

#### Example: [](#example-1)
php
```
// Accessing Tax Rate
$taxRate = $orderTaxRate->tax_rate;

// For Filtering by tax rate relationship
$orderTaxRates = FluentCart\App\Models\OrderTaxRate::whereHas('tax_rate', function($query) {
 $query->where('rate', '>', 0);
})->get();```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### setMetaAttribute($value) [](#setmetaattribute-value)

Set meta from array (mutator). Automatically JSON-encodes the value.

- Parameters 

 - $value - array|object

- Returns `void`

#### Usage [](#usage-2)
php
```
$orderTaxRate->meta = ['tax_details' => 'value', 'filing_info' => 'data'];```

### getMetaAttribute($value) [](#getmetaattribute-value)

Get meta as array (accessor). Automatically JSON-decodes the stored value.

- Parameters 

 - $value - mixed

- Returns `array`

#### Usage [](#usage-3)
php
```
$meta = $orderTaxRate->meta; // Returns array```

## Usage Examples [](#usage-examples)

### Get Order Tax Rates [](#get-order-tax-rates)
php
```
$order = FluentCart\App\Models\Order::find(123);
$taxRates = $order->order_tax_rates;

foreach ($taxRates as $taxRate) {
 echo "Tax Rate: " . $taxRate->tax_rate->rate;
 echo "Total Tax: " . $taxRate->total_tax;
}```

### Get Tax Rates for Completed Orders [](#get-tax-rates-for-completed-orders)
php
```
$completedOrderTaxRates = FluentCart\App\Models\OrderTaxRate::validOrder()->get();```

### Create Order Tax Rate [](#create-order-tax-rate)
php
```
$orderTaxRate = FluentCart\App\Models\OrderTaxRate::create([
 'order_id' => 123,
 'tax_rate_id' => 5,
 'shipping_tax' => 250,
 'order_tax' => 1575,
 'total_tax' => 1825,
 'filed_at' => now()
]);```

### Get Tax Rate Details [](#get-tax-rate-details)
php
```
$orderTaxRate = FluentCart\App\Models\OrderTaxRate::with(['order', 'tax_rate'])->find(1);
$order = $orderTaxRate->order;
$taxRate = $orderTaxRate->tax_rate;```

---

## OrderDownloadPermission

Source: https://dev.fluentcart.com/database/models/order-download-permission.html


| DB Table Name | {wp_db_prefix}_fct_order_download_permissions | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-order-download-permissions-table) | 
| Source File | fluent-cart/app/Models/OrderDownloadPermission.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\OrderDownloadPermission | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key (guarded) | 
| order_id | Integer | Reference to order | 
| variation_id | Integer | Reference to product variation | 
| customer_id | Integer | Reference to customer | 
| download_id | Integer | Reference to download | 
| download_count | Integer | Number of downloads used | 
| download_limit | Integer | Maximum number of downloads allowed | 
| access_expires | Date Time | When download access expires | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
**Note:** The `id` column is both guarded and declared as `$primaryKey`.
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$orderDownloadPermission = FluentCart\App\Models\OrderDownloadPermission::find(1);

$orderDownloadPermission->id; // returns id
$orderDownloadPermission->order_id; // returns order ID
$orderDownloadPermission->customer_id; // returns customer ID
$orderDownloadPermission->download_count; // returns download count
$orderDownloadPermission->download_limit; // returns download limit
$orderDownloadPermission->access_expires; // returns access expiry date```

## Relations [](#relations)

This model has the following relationships that you can use
### order [](#order)

Access the associated order

- return `FluentCart\App\Models\Order` Model

#### Example: [](#example)
php
```
// Accessing Order
$order = $orderDownloadPermission->order;

// For Filtering by order relationship
$orderDownloadPermissions = FluentCart\App\Models\OrderDownloadPermission::whereHas('order', function($query) {
 $query->where('status', 'completed');
})->get();```

### customer [](#customer)

Access the associated customer

- return `FluentCart\App\Models\Customer` Model

#### Example: [](#example-1)
php
```
// Accessing Customer
$customer = $orderDownloadPermission->customer;

// For Filtering by customer relationship
$orderDownloadPermissions = FluentCart\App\Models\OrderDownloadPermission::whereHas('customer', function($query) {
 $query->where('email', '[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)');
})->get();```

## Usage Examples [](#usage-examples)

### Get Order Download Permissions [](#get-order-download-permissions)
php
```
$order = FluentCart\App\Models\Order::find(123);
$downloadPermissions = $order->download_permissions;

foreach ($downloadPermissions as $permission) {
 echo "Download ID: " . $permission->download_id;
 echo "Downloads Used: " . $permission->download_count . "/" . $permission->download_limit;
}```

### Get Customer Download Permissions [](#get-customer-download-permissions)
php
```
$customer = FluentCart\App\Models\Customer::find(456);
$downloadPermissions = $customer->download_permissions;

foreach ($downloadPermissions as $permission) {
 echo "Order ID: " . $permission->order_id;
 echo "Access Expires: " . $permission->access_expires;
}```

### Create Download Permission [](#create-download-permission)
php
```
$orderDownloadPermission = FluentCart\App\Models\OrderDownloadPermission::create([
 'order_id' => 123,
 'variation_id' => 789,
 'customer_id' => 456,
 'download_id' => 101,
 'download_count' => 0,
 'download_limit' => 5,
 'access_expires' => now()->addDays(30)
]);```

### Check Download Access [](#check-download-access)
php
```
$permission = FluentCart\App\Models\OrderDownloadPermission::find(1);

// Check if downloads are available
$canDownload = $permission->download_count < $permission->download_limit;

// Check if access is still valid
$isValid = $permission->access_expires > now();```

### Get Active Download Permissions [](#get-active-download-permissions)
php
```
$activePermissions = FluentCart\App\Models\OrderDownloadPermission::where('access_expires', '>', now())
 ->whereColumn('download_count', '<', 'download_limit')
 ->get();```

---

## Customer

Source: https://dev.fluentcart.com/database/models/customer.html


| DB Table Name | {wp_db_prefix}_fct_customers | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-customers-table) | 
| Source File | fluent-cart/app/Models/Customer.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\Customer | 
## Traits [](#traits)

| Trait | Description | 
| --- | --- |
| CanSearch | Provides `search()`, `whereLike()`, `whereBeginsWith()`, `whereEndsWith()`, `groupSearch()` scopes for flexible query filtering | 
| CanUpdateBatch | Provides `batchUpdate()` scope for batch updating multiple records | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer (BIGINT UNSIGNED) | Primary Key, Auto Increment | 
| user_id | Integer (BIGINT UNSIGNED) | WordPress user ID (nullable) | 
| contact_id | Integer (BIGINT UNSIGNED) | Contact ID (default 0) | 
| email | String (VARCHAR 192) | Customer email address | 
| first_name | String (VARCHAR 192) | Customer first name | 
| last_name | String (VARCHAR 192) | Customer last name | 
| status | String (VARCHAR 45) | Customer status (default: 'active') | 
| purchase_value | JSON | Purchase value data (stored/retrieved as JSON) | 
| purchase_count | Integer (BIGINT UNSIGNED) | Number of purchases (default 0) | 
| ltv | Integer (BIGINT) | Lifetime value in cents (default 0) | 
| first_purchase_date | Date Time | First purchase date (nullable) | 
| last_purchase_date | Date Time | Last purchase date (nullable) | 
| aov | Decimal (18,2) | Average order value (nullable) | 
| notes | Text (LONGTEXT) | Customer notes | 
| uuid | String (VARCHAR 100) | Unique identifier (auto-generated on creation) | 
| country | String (VARCHAR 45) | Customer country code (nullable) | 
| city | String (VARCHAR 45) | Customer city (nullable) | 
| state | String (VARCHAR 45) | Customer state (nullable) | 
| postcode | String (VARCHAR 45) | Customer postcode (nullable) | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
### Appended Attributes [](#appended-attributes)

These virtual attributes are appended to every serialized Customer instance via the `$appends` property:

| Attribute | Accessor Method | Return Type | Description | 
| --- | --- | --- | --- |
| full_name | `getFullNameAttribute()` | String | Concatenation of first_name and last_name | 
| photo | `getPhotoAttribute()` | String | Custom photo URL from user meta, or Gravatar fallback | 
| country_name | `getCountryNameAttribute()` | String | Human-readable country name from country code | 
| formatted_address | `getFormattedAddressAttribute()` | Array | Formatted address data array | 
| user_link | `getUserLinkAttribute()` | String | WordPress admin user-edit URL (empty if no user_id) | 
### Searchable Fields [](#searchable-fields)

The `$searchable` property defines which fields are used by the `searchBy` scope:

- `first_name`
- `last_name`
- `email`

### Mutators [](#mutators)

| Mutator | Direction | Description | 
| --- | --- | --- |
| `setPurchaseValueAttribute` | Set | Accepts array/object (JSON-encodes) or scalar value | 
| `getPurchaseValueAttribute` | Get | Returns decoded JSON as array, or null if empty | 
### Boot Behavior [](#boot-behavior)

On `creating`, the model auto-generates the `uuid` attribute using `md5($model->email . '_' . wp_generate_uuid4())`.
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$customer = FluentCart\App\Models\Customer::find(1);

$customer->id; // returns customer ID
$customer->email; // returns email address
$customer->first_name; // returns first name
$customer->last_name; // returns last name
$customer->status; // returns customer status
$customer->full_name; // returns "John Doe" (appended)
$customer->photo; // returns photo URL (appended)
$customer->country_name; // returns country name (appended)
$customer->formatted_address; // returns address array (appended)
$customer->user_link; // returns WP user edit URL (appended)```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### getFullNameAttribute() [](#getfullnameattribute)

Get customer full name by concatenating first_name and last_name.

- Returns `String` - Full name (first_name + last_name), trimmed
php
```
$customer = FluentCart\App\Models\Customer::find(1);
$fullName = $customer->full_name; // returns "John Doe"```

### getPhotoAttribute() [](#getphotoattribute)

Get customer photo URL. First checks for a custom photo URL stored in user meta (`fc_customer_photo_url`). Falls back to Gravatar (100x100) if no custom photo is set.

- Returns `String` - Photo URL (custom or Gravatar)
php
```
$customer = FluentCart\App\Models\Customer::find(1);
$photo = $customer->photo; // returns photo URL```

### getCountryNameAttribute() [](#getcountrynameattribute)

Get country name from country code using `Helper::getCountryName()`.

- Returns `String` - Country name
php
```
$customer = FluentCart\App\Models\Customer::find(1);
$countryName = $customer->country_name; // returns country name```

### getFormattedAddressAttribute() [](#getformattedaddressattribute)

Get formatted address as an associative array with resolved country and state names.

- Returns `Array` - Formatted address data with keys: `country`, `state`, `city`, `postcode`, `first_name`, `last_name`, `full_name`
php
```
$customer = FluentCart\App\Models\Customer::find(1);
$address = $customer->formatted_address;
// [
// 'country' => 'United States',
// 'state' => 'California',
// 'city' => 'San Francisco',
// 'postcode' => '94102',
// 'first_name' => 'John',
// 'last_name' => 'Doe',
// 'full_name' => 'John Doe'
// ]```

### getUserLinkAttribute() [](#getuserlinkattribute)

Get WordPress user edit link. Returns empty string if the customer has no associated `user_id`.

- Returns `String` - User edit URL (e.g., `/wp-admin/user-edit.php?user_id=5`) or empty string
php
```
$customer = FluentCart\App\Models\Customer::find(1);
$userLink = $customer->user_link; // returns user edit URL```

### recountStats() [](#recountstats)

Recount customer order statistics. Sets `total_order_count` (count of all orders) and `total_order_value` (sum of `total_amount` across all orders) and saves the model.

- Returns `FluentCart\App\Models\Customer` - Updated customer instance
php
```
$customer = FluentCart\App\Models\Customer::find(1);
$customer->recountStats();```

### recountStat() [](#recountstat)

Recount detailed customer purchase statistics from successful payment orders only. Updates `purchase_count`, `first_purchase_date`, `last_purchase_date`, `ltv` (lifetime value as net paid minus refunds), and `aov` (average order value = ltv / purchase_count). Saves the model.

- Returns `FluentCart\App\Models\Customer` - Updated customer instance
php
```
$customer = FluentCart\App\Models\Customer::find(1);
$customer->recountStat();```

### updateCustomerStatus($newStatus) [](#updatecustomerstatus-newstatus)

Update customer status and fire action hooks. If the new status is the same as the current status, returns early without saving or firing hooks.
Fires the following WordPress action hooks:

- `fluent_cart/customer_status_to_{$newStatus}` - Status-specific hook
- `fluent_cart/customer_status_updated` - General status change hook

Both hooks receive an array with keys: `customer`, `old_status`, `new_status`.

- Parameters: `$newStatus` (String) - New status value
- Returns `FluentCart\App\Models\Customer` - Updated customer instance
php
```
$customer = FluentCart\App\Models\Customer::find(1);
$customer->updateCustomerStatus('active');```

### getWpUserId($recheck = false) [](#getwpuserid-recheck-false)

Get WordPress user ID. When `$recheck` is true, looks up the WordPress user by the customer's email and updates the stored `user_id` if it has changed.

- Parameters: `$recheck` (Boolean) - Whether to recheck by looking up the WP user by email (default: false)
- Returns `Integer|null` - WordPress user ID
php
```
$customer = FluentCart\App\Models\Customer::find(1);
$wpUserId = $customer->getWpUserId();
$wpUserId = $customer->getWpUserId(true); // recheck and sync user_id```

### getWpUser() [](#getwpuser)

Get WordPress user object. First tries to find by `user_id`, then falls back to email lookup. If found by email and the `user_id` differs, updates the stored `user_id` and saves.

- Returns `WP_User|false` - WordPress user object or false if not found
php
```
$customer = FluentCart\App\Models\Customer::find(1);
$wpUser = $customer->getWpUser();```

### getMeta($metaKey, $default = null) [](#getmeta-metakey-default-null)

Get customer meta value from the `fct_customer_meta` table.

- Parameters: `$metaKey` (String) - Meta key, `$default` (Mixed) - Default value if not found (default: null)
- Returns `Mixed` - Meta value or default
php
```
$customer = FluentCart\App\Models\Customer::find(1);
$metaValue = $customer->getMeta('custom_field', 'default');```

### updateMeta($metaKey, $metaValue) [](#updatemeta-metakey-metavalue)

Create or update customer meta value in the `fct_customer_meta` table.

- Parameters: `$metaKey` (String) - Meta key, `$metaValue` (Mixed) - Meta value
- Returns `FluentCart\App\Models\CustomerMeta` - Meta instance (created or updated)
php
```
$customer = FluentCart\App\Models\Customer::find(1);
$meta = $customer->updateMeta('custom_field', 'new_value');```

## Relations [](#relations)

This model has the following relationships that you can use
### orders [](#orders)

Access the customer orders.

- Relation type: `HasMany`
- Returns collection of `FluentCart\App\Models\Order`
- Foreign key: `customer_id`
php
```
$customer = FluentCart\App\Models\Customer::find(1);
$orders = $customer->orders;```

### success_order_items [](#success-order-items)

Access the successful order items (items from orders with successful payment statuses).

- Relation type: `HasManyThrough` (through `FluentCart\App\Models\Order`)
- Returns collection of `FluentCart\App\Models\OrderItem`
- Filters orders by successful payment statuses via `Status::getOrderPaymentSuccessStatuses()`
php
```
$customer = FluentCart\App\Models\Customer::find(1);
$orderItems = $customer->success_order_items;```

### subscriptions [](#subscriptions)

Access the customer subscriptions.

- Relation type: `HasMany`
- Returns collection of `FluentCart\App\Models\Subscription`
- Foreign key: `customer_id`
php
```
$customer = FluentCart\App\Models\Customer::find(1);
$subscriptions = $customer->subscriptions;```

### shipping_address [](#shipping-address)

Access the shipping addresses (filtered by type = 'shipping').

- Relation type: `HasMany`
- Returns collection of `FluentCart\App\Models\CustomerAddresses`
- Foreign key: `customer_id`
php
```
$customer = FluentCart\App\Models\Customer::find(1);
$addresses = $customer->shipping_address;```

### billing_address [](#billing-address)

Access the billing addresses (filtered by type = 'billing').

- Relation type: `HasMany`
- Returns collection of `FluentCart\App\Models\CustomerAddresses`
- Foreign key: `customer_id`
php
```
$customer = FluentCart\App\Models\Customer::find(1);
$addresses = $customer->billing_address;```

### primary_shipping_address [](#primary-shipping-address)

Access the primary shipping address (filtered by type = 'shipping' and is_primary = 1).

- Relation type: `HasOne`
- Returns `FluentCart\App\Models\CustomerAddresses|null`
php
```
$customer = FluentCart\App\Models\Customer::find(1);
$address = $customer->primary_shipping_address;```

### primary_billing_address [](#primary-billing-address)

Access the primary billing address (filtered by type = 'billing' and is_primary = 1).

- Relation type: `HasOne`
- Returns `FluentCart\App\Models\CustomerAddresses|null`
php
```
$customer = FluentCart\App\Models\Customer::find(1);
$address = $customer->primary_billing_address;```

### labels [](#labels)

Access the customer labels (polymorphic relationship).

- Relation type: `MorphMany`
- Returns collection of `FluentCart\App\Models\LabelRelationship`
php
```
$customer = FluentCart\App\Models\Customer::find(1);
$labels = $customer->labels;```

### wpUser [](#wpuser)

Access the associated WordPress user.

- Relation type: `BelongsTo`
- Returns `FluentCart\App\Models\User|null`
- Foreign key: `user_id`
php
```
$customer = FluentCart\App\Models\Customer::find(1);
$user = $customer->wpUser;```

## Scopes [](#scopes)

This model has the following scopes that you can use
### ofActive() [](#ofactive)

Get only active customers (where status = 'active').php
```
$customers = FluentCart\App\Models\Customer::ofActive()->get();```

### ofArchived() [](#ofarchived)

Get only archived customers (where status = 'archived').php
```
$customers = FluentCart\App\Models\Customer::ofArchived()->get();```

### searchBy($search) [](#searchby-search)

Search customers by query string. Supports multiple search modes:

- **Operator-based search**: `column_name > value`, `column_name = value`, etc. (supports `=`, `!=`, `>`, `<`)
- **Column-specific LIKE search**: `column_name:value` (searches with LIKE %value%)
- **Column-specific exact search**: `column_name=value`
- **General search**: Searches across `$searchable` fields (`first_name`, `last_name`, `email`) with LIKE matching. Also handles multi-word queries by splitting into first_name/last_name search.

- Parameters: `$search` (String) - Search query
php
```
// General search across searchable fields
$customers = FluentCart\App\Models\Customer::searchBy('john')->get();

// Operator-based search
$customers = FluentCart\App\Models\Customer::searchBy('purchase_count > 5')->get();

// Column-specific LIKE search
$customers = FluentCart\App\Models\Customer::searchBy('email:example.com')->get();

// Full name search (splits "John Doe" into first_name + last_name)
$customers = FluentCart\App\Models\Customer::searchBy('John Doe')->get();```

### applyCustomFilters($filters) [](#applycustomfilters-filters)

Apply custom filters using an associative array. Each filter key must be a fillable attribute. Supports operators: `includes` (LIKE), `not_includes` (NOT LIKE), `gt` (>), `lt` (<), and standard SQL operators.

- Parameters: `$filters` (Array) - Associative array of filter key => `['value' => ..., 'operator' => ...]`
php
```
$customers = FluentCart\App\Models\Customer::applyCustomFilters([
 'status' => ['value' => 'active', 'operator' => '='],
 'email' => ['value' => 'example.com', 'operator' => 'includes'],
 'ltv' => ['value' => '1000', 'operator' => 'gt']
])->get();```

### searchByFullName($data) [](#searchbyfullname-data)

Search by concatenated full name (CONCAT(first_name, ' ', last_name)). Supports multiple matching operators.

- Parameters: `$data` (Array) - Search data with keys: 

 - `value` (String) - The search term
 - `operator` (String) - One of `starts_with`, `ends_with`, `not_like`, or default (contains/like_all)

php
```
$customers = FluentCart\App\Models\Customer::searchByFullName([
 'value' => 'John',
 'operator' => 'starts_with'
])->get();

$customers = FluentCart\App\Models\Customer::searchByFullName([
 'value' => 'Doe',
 'operator' => 'ends_with'
])->get();

$customers = FluentCart\App\Models\Customer::searchByFullName([
 'value' => 'Test User',
 'operator' => 'not_like'
])->get();```

### Inherited Scopes from CanSearch Trait [](#inherited-scopes-from-cansearch-trait)

These scopes are available via the `CanSearch` trait:
#### search($params) [](#search-params)

Flexible search with multiple operators per column.php
```
$customers = FluentCart\App\Models\Customer::search([
 'email' => ['column' => 'email', 'operator' => 'like_all', 'value' => 'example.com'],
 'status' => ['column' => 'status', 'operator' => '=', 'value' => 'active']
])->get();```

#### whereLike($column, $value) [](#wherelike-column-value)

WHERE column LIKE %value% query.php
```
$customers = FluentCart\App\Models\Customer::whereLike('email', 'example.com')->get();```

#### whereBeginsWith($column, $value) [](#wherebeginswith-column-value)

WHERE column LIKE value% query.php
```
$customers = FluentCart\App\Models\Customer::whereBeginsWith('first_name', 'Jo')->get();```

#### whereEndsWith($column, $value) [](#whereendswith-column-value)

WHERE column LIKE %value query.php
```
$customers = FluentCart\App\Models\Customer::whereEndsWith('email', '.com')->get();```

#### groupSearch($groups) [](#groupsearch-groups)

Search across related models using dot notation.php
```
$customers = FluentCart\App\Models\Customer::groupSearch([
 'fct_customers.email' => ['column' => 'email', 'operator' => 'like_all', 'value' => 'test'],
])->get();```

### Inherited Scope from CanUpdateBatch Trait [](#inherited-scope-from-canupdatebatch-trait)

#### batchUpdate($values, $index = null) [](#batchupdate-values-index-null)

Batch update multiple records at once.php
```
FluentCart\App\Models\Customer::batchUpdate([
 ['id' => 1, 'status' => 'active'],
 ['id' => 2, 'status' => 'archived'],
]);```

## Usage Examples [](#usage-examples)

### Creating a Customer [](#creating-a-customer)
php
```
use FluentCart\App\Models\Customer;

// uuid is auto-generated on creation
$customer = Customer::create([
 'email' => '[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)',
 'first_name' => 'John',
 'last_name' => 'Doe',
 'status' => 'active'
]);```

### Retrieving Customers [](#retrieving-customers)
php
```
// Get all active customers
$customers = Customer::ofActive()->get();

// Get customer by email
$customer = Customer::where('email', '[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)')->first();

// Get customer with orders
$customer = Customer::with('orders')->find(1);

// Search customers
$customers = Customer::searchBy('john doe')->get();

// Get customers with custom filters
$customers = Customer::applyCustomFilters([
 'country' => ['value' => 'US', 'operator' => '=']
])->get();```

### Updating a Customer [](#updating-a-customer)
php
```
$customer = Customer::find(1);
$customer->first_name = 'Jane';
$customer->save();

// Update status with hooks
$customer->updateCustomerStatus('archived');

// Recount purchase statistics
$customer->recountStat();```

### Working with Meta [](#working-with-meta)
php
```
$customer = Customer::find(1);

// Get meta
$value = $customer->getMeta('preferred_language', 'en');

// Set/update meta
$customer->updateMeta('preferred_language', 'fr');```

### Deleting a Customer [](#deleting-a-customer)
php
```
$customer = Customer::find(1);
$customer->delete();```

---

## CustomerAddresses

Source: https://dev.fluentcart.com/database/models/customer-addresses.html


| DB Table Name | {wp_db_prefix}_fct_customer_addresses | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-customer-addresses-table) | 
| Source File | fluent-cart/app/Models/CustomerAddresses.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\CustomerAddresses | 
## Traits [](#traits)

| Trait | Description | 
| --- | --- |
| CanSearch | Provides `search()`, `groupSearch()`, `whereLike()`, `whereBeginsWith()`, `whereEndsWith()` query scopes | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| customer_id | Integer | Reference to customer | 
| is_primary | Boolean | Whether this is the primary address | 
| type | String | Address type (billing, shipping, etc.) | 
| status | String | Address status (active, archived) | 
| label | String | Address label/name | 
| name | String | Full name | 
| address_1 | String | Primary address line | 
| address_2 | String | Secondary address line | 
| city | String | City | 
| state | String | State/Province | 
| postcode | String | Postal/ZIP code | 
| country | String | Country code | 
| phone | String | Phone number | 
| email | String | Email address | 
| meta | JSON NULL | Stored as JSON string, auto-encoded/decoded via mutator/accessor | 
| company_name | Virtual | Stored inside `meta->other_data.company_name`, accessible as a virtual attribute via mutator/accessor | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Appended Attributes [](#appended-attributes)

The following attributes are appended to every model serialization (e.g. `toArray()`, `toJson()`):

| Attribute | Type | Description | 
| --- | --- | --- |
| formatted_address | Array | Full formatted address with resolved country/state names, full address string, etc. | 
| company_name | String | Company name extracted from `meta->other_data.company_name` | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$customerAddress = FluentCart\App\Models\CustomerAddresses::find(1);

$customerAddress->id; // returns id
$customerAddress->customer_id; // returns customer ID
$customerAddress->is_primary; // returns primary status
$customerAddress->type; // returns address type
$customerAddress->company_name; // returns company name from meta
$customerAddress->formatted_address; // returns formatted address array```

## Scopes [](#scopes)

This model has the following scopes that you can use
### ofActive() [](#ofactive)

Filter active addresses

- Parameters 

 - none

#### Usage: [](#usage-1)
php
```
// Get all active addresses
$activeAddresses = FluentCart\App\Models\CustomerAddresses::ofActive()->get();```

### ofArchived() [](#ofarchived)

Filter archived addresses

- Parameters 

 - none

#### Usage: [](#usage-2)
php
```
// Get all archived addresses
$archivedAddresses = FluentCart\App\Models\CustomerAddresses::ofArchived()->get();```

### search($params) from CanSearch [](#search-params)

Search addresses by parameters. Supports operators: `=`, `between`, `like_all`, `in`, `not_in`, `is_null`, `is_not_null`, and more.

- Parameters 

 - `$params` (Array) - Search parameters

#### Usage: [](#usage-3)
php
```
$addresses = FluentCart\App\Models\CustomerAddresses::search([
 'country' => ['value' => 'US', 'operator' => '=']
])->get();```

## Relations [](#relations)

This model has the following relationships that you can use
### customer [](#customer)

Access the associated customer

- return `FluentCart\App\Models\Customer` Model (BelongsTo)

#### Example: [](#example)
php
```
// Accessing Customer
$customer = $customerAddress->customer;

// For Filtering by customer relationship
$customerAddresses = FluentCart\App\Models\CustomerAddresses::whereHas('customer', function($query) {
 $query->where('status', 'active');
})->get();```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### setMetaAttribute($value) [](#setmetaattribute-value)

Set meta value with automatic JSON encoding (mutator). Called when setting `$address->meta = [...]`.

- Parameters 

 - `$value` - mixed (array or other value)

- Returns `void`

#### Usage [](#usage-4)
php
```
$customerAddress->meta = ['other_data' => ['company_name' => 'Acme Inc']];
// Automatically JSON encodes the value```

### getMetaAttribute($value) [](#getmetaattribute-value)

Get meta value with automatic JSON decoding (accessor). Called when accessing `$address->meta`.

- Parameters 

 - `$value` - string (raw JSON from database)

- Returns `array`

#### Usage [](#usage-5)
php
```
$meta = $customerAddress->meta; // Returns decoded array```

### setCompanyNameAttribute($value) [](#setcompanynameattribute-value)

Set the company name inside the `meta` JSON field at `other_data.company_name` (mutator). Called when setting `$address->company_name = '...'`.

- Parameters 

 - `$value` - string

- Returns `void`

#### Usage [](#usage-6)
php
```
$customerAddress->company_name = 'Acme Inc';
// Stores the value inside meta->other_data.company_name```

### getCompanyNameAttribute() [](#getcompanynameattribute)

Get the company name from the `meta` JSON field at `other_data.company_name` (accessor).

- Parameters 

 - none

- Returns `string` (empty string if not set)

#### Usage [](#usage-7)
php
```
$companyName = $customerAddress->company_name; // Returns company name or ''```

### getFormattedAddressAttribute() [](#getformattedaddressattribute)

Get formatted address as array (accessor). This is an appended attribute available as `$address->formatted_address`.

- Parameters 

 - none

- Returns `array`

The returned array contains:

| Key | Description | 
| --- | --- |
| country | Full country name (resolved from country code) | 
| state | Full state name (resolved from state code) | 
| city | City | 
| postcode | Postal/ZIP code | 
| address_1 | Primary address line | 
| address_2 | Secondary address line | 
| type | Address type | 
| name | Full name | 
| first_name | First name | 
| last_name | Last name | 
| full_name | Full name | 
| company_name | Company name | 
| label | Address label | 
| phone | Phone number | 
| full_address | Comma-separated full address string | 
#### Usage [](#usage-8)
php
```
$formattedAddress = $customerAddress->formatted_address;
echo $formattedAddress['full_address']; // "Acme Inc, 123 Main St, New York, NY, United States"
echo $formattedAddress['country']; // "United States"```

### getFormattedDataForCheckout($prefix) [](#getformatteddataforcheckout-prefix)

Get address data formatted for checkout forms with a configurable field prefix.

- Parameters 

 - `$prefix` - string (default: `'billing_'`)

- Returns `array`

The returned array keys are prefixed with the given `$prefix`:

| Key (with default prefix) | Value | 
| --- | --- |
| billing_full_name | Name | 
| billing_address_1 | Address line 1 | 
| billing_address_2 | Address line 2 | 
| billing_city | City | 
| billing_state | State | 
| billing_phone | Phone | 
| billing_postcode | Postcode | 
| billing_country | Country | 
| billing_company_name | Company name | 
#### Usage [](#usage-9)
php
```
$billingData = $customerAddress->getFormattedDataForCheckout(); // Uses 'billing_' prefix
$shippingData = $customerAddress->getFormattedDataForCheckout('shipping_'); // Uses 'shipping_' prefix```

## Usage Examples [](#usage-examples)

### Get Customer Addresses [](#get-customer-addresses)
php
```
$customer = FluentCart\App\Models\Customer::find(123);
$addresses = $customer->addresses;

foreach ($addresses as $address) {
 echo "Address Type: " . $address->type;
 echo "Label: " . $address->label;
 echo "Is Primary: " . ($address->is_primary ? 'Yes' : 'No');
}```

### Get Active Addresses [](#get-active-addresses)
php
```
$activeAddresses = FluentCart\App\Models\CustomerAddresses::ofActive()->get();```

### Get Primary Address [](#get-primary-address)
php
```
$primaryAddress = FluentCart\App\Models\CustomerAddresses::where('customer_id', 123)
 ->where('is_primary', true)
 ->first();```

### Create Customer Address [](#create-customer-address)
php
```
$customerAddress = FluentCart\App\Models\CustomerAddresses::create([
 'customer_id' => 123,
 'is_primary' => true,
 'type' => 'billing',
 'status' => 'active',
 'label' => 'Home Address',
 'name' => 'John Doe',
 'address_1' => '123 Main Street',
 'city' => 'New York',
 'state' => 'NY',
 'postcode' => '10001',
 'country' => 'US',
 'phone' => '+1-555-123-4567',
 'email' => '[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)',
 'company_name' => 'Acme Inc'
]);```

### Get Formatted Address [](#get-formatted-address)
php
```
$address = FluentCart\App\Models\CustomerAddresses::find(1);
$formatted = $address->formatted_address;
// Returns array with formatted address components including full_address string
echo $formatted['full_address'];```

### Get Checkout-Formatted Data [](#get-checkout-formatted-data)
php
```
$address = FluentCart\App\Models\CustomerAddresses::find(1);
$billingFields = $address->getFormattedDataForCheckout('billing_');
$shippingFields = $address->getFormattedDataForCheckout('shipping_');```

### Archive Address [](#archive-address)
php
```
$address = FluentCart\App\Models\CustomerAddresses::find(1);
$address->status = 'archived';
$address->save();```

---

## CustomerMeta

Source: https://dev.fluentcart.com/database/models/customer-meta.html


| DB Table Name | {wp_db_prefix}_fct_customer_meta | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-customer-meta-table) | 
| Source File | fluent-cart/app/Models/CustomerMeta.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\CustomerMeta | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key (guarded) | 
| customer_id | Integer | Reference to customer | 
| meta_key | String | Meta key name | 
| meta_value | Text | Meta value (JSON encoded for arrays/objects, auto-encoded/decoded via mutator/accessor) | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$customerMeta = FluentCart\App\Models\CustomerMeta::find(1);

$customerMeta->id; // returns id
$customerMeta->customer_id; // returns customer ID
$customerMeta->meta_key; // returns meta key
$customerMeta->meta_value; // returns meta value (auto-decoded if JSON)```

## Relations [](#relations)

This model has the following relationships that you can use
### customer [](#customer)

Access the associated customer

- return `FluentCart\App\Models\Customer` Model (BelongsTo)

#### Example: [](#example)
php
```
// Accessing Customer
$customer = $customerMeta->customer;

// For Filtering by customer relationship
$customerMetas = FluentCart\App\Models\CustomerMeta::whereHas('customer', function($query) {
 $query->where('status', 'active');
})->get();```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### setMetaValueAttribute($value) [](#setmetavalueattribute-value)

Set meta value with automatic JSON encoding (mutator). Arrays and objects are encoded with `JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES` flags.

- Parameters 

 - `$value` - mixed (array, object, or string)

- Returns `void`

#### Usage [](#usage-1)
php
```
$customerMeta->meta_value = ['preferences' => 'value', 'settings' => ['key' => 'value']];
// Automatically JSON encodes arrays and objects```

### getMetaValueAttribute($value) [](#getmetavalueattribute-value)

Get meta value with automatic JSON decoding (accessor). If the stored string is valid JSON, it returns the decoded array. Otherwise, returns the raw string value.

- Parameters 

 - `$value` - mixed

- Returns `mixed` (decoded array if valid JSON, otherwise original value)

#### Usage [](#usage-2)
php
```
$metaValue = $customerMeta->meta_value; // Returns decoded value (array, object, or string)```

## Usage Examples [](#usage-examples)

### Get Customer Meta [](#get-customer-meta)
php
```
$customer = FluentCart\App\Models\Customer::find(123);
$meta = $customer->customer_meta;

foreach ($meta as $metaItem) {
 echo "Key: " . $metaItem->meta_key;
 echo "Value: " . print_r($metaItem->meta_value, true);
}```

### Create Customer Meta [](#create-customer-meta)
php
```
$customerMeta = FluentCart\App\Models\CustomerMeta::create([
 'customer_id' => 123,
 'meta_key' => 'preferences',
 'meta_value' => 'newsletter_subscribed'
]);```

### Store Complex Customer Data [](#store-complex-customer-data)
php
```
$customerMeta = FluentCart\App\Models\CustomerMeta::create([
 'customer_id' => 123,
 'meta_key' => 'shopping_preferences',
 'meta_value' => [
 'newsletter' => true,
 'sms_notifications' => false,
 'preferred_categories' => ['electronics', 'books'],
 'shipping_preference' => 'standard'
 ]
]);```

### Get Meta by Key [](#get-meta-by-key)
php
```
$meta = FluentCart\App\Models\CustomerMeta::where('customer_id', 123)
 ->where('meta_key', 'preferences')
 ->first();

if ($meta) {
 echo "Preferences: " . $meta->meta_value;
}```

### Update Customer Meta [](#update-customer-meta)
php
```
$meta = FluentCart\App\Models\CustomerMeta::find(1);
$meta->meta_value = ['updated' => true, 'timestamp' => now()];
$meta->save();```

### Get All Meta for Customer [](#get-all-meta-for-customer)
php
```
$customerMetas = FluentCart\App\Models\CustomerMeta::where('customer_id', 123)->get();```

---

## Product

Source: https://dev.fluentcart.com/database/models/product.html


| DB Table Name | {wp_db_prefix}_posts (WordPress posts table) | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#posts-table) | 
| Source File | fluent-cart/app/Models/Product.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\Product | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| ID | Integer | Primary Key (WordPress post ID) | 
| post_author | Integer | Post author ID | 
| post_date | Date Time | Post creation date | 
| post_date_gmt | Date Time | Post creation date (GMT) | 
| post_content | Text | Post content | 
| post_title | String | Post title | 
| post_excerpt | Text | Post excerpt | 
| post_status | String | Post status (publish, draft, etc.) | 
| comment_status | String | Comment status | 
| ping_status | String | Ping status | 
| post_password | String | Post password (hidden) | 
| post_name | String | Post slug | 
| to_ping | Text | URLs to ping (hidden) | 
| pinged | Text | URLs that have been pinged (hidden) | 
| post_modified | Date Time | Post last modified date | 
| post_modified_gmt | Date Time | Post last modified date (GMT) | 
| post_content_filtered | Text | Filtered post content (hidden) | 
| post_parent | Integer | Parent post ID (hidden) | 
| guid | String | Global unique identifier | 
| menu_order | Integer | Menu order (hidden) | 
| post_type | String | Post type (`fluent-products`) | 
| post_mime_type | String | Post MIME type (hidden) | 
| comment_count | Integer | Comment count (hidden) | 
### Appended Attributes [](#appended-attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| thumbnail | String | Product thumbnail URL (from `getThumbnailAttribute()`) | 
### Searchable Attributes [](#searchable-attributes)

| Attribute | 
| --- |
| post_title | 
| post_status | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$product = FluentCart\App\Models\Product::find(1);

$product->ID; // returns WordPress post ID
$product->post_title; // returns product title
$product->post_content; // returns product description
$product->post_status; // returns product status
$product->thumbnail; // returns thumbnail URL (appended attribute)```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### getHasSubscriptionAttribute() [](#gethassubscriptionattribute)

Check if product has subscription variants. Iterates over all variants and returns `true` if any variant has `payment_type` set to `subscription` in its `other_info`.

- Returns `Boolean` - True if product has subscription variants
php
```
$product = FluentCart\App\Models\Product::find(1);
$hasSubscription = $product->has_subscription; // returns boolean```

### getThumbnailAttribute() [](#getthumbnailattribute)

Get product thumbnail URL. Returns the featured media URL from the product detail, or a placeholder SVG if no featured media is set.

- Returns `String` - Thumbnail URL or placeholder
php
```
$product = FluentCart\App\Models\Product::find(1);
$thumbnail = $product->thumbnail; // returns thumbnail URL```

### getViewUrlAttribute() [](#getviewurlattribute)

Get product view URL

- Returns `String` - Product permalink
php
```
$product = FluentCart\App\Models\Product::find(1);
$viewUrl = $product->view_url; // returns product URL```

### getEditUrlAttribute() [](#getediturlattribute)

Get product edit URL in WordPress admin

- Returns `String` - Edit URL
php
```
$product = FluentCart\App\Models\Product::find(1);
$editUrl = $product->edit_url; // returns edit URL```

### getTagsAttribute() [](#gettagsattribute)

Get product tags via WordPress taxonomy `product-tags`.

- Returns `Array|false` - Product tags (WP_Term objects) or false if none
php
```
$product = FluentCart\App\Models\Product::find(1);
$tags = $product->tags; // returns product tags```

### getCategoriesAttribute() [](#getcategoriesattribute)

Get product categories via WordPress taxonomy `product-categories`.

- Returns `Array|false` - Product categories (WP_Term objects) or false if none
php
```
$product = FluentCart\App\Models\Product::find(1);
$categories = $product->categories; // returns product categories```

### getCategories() [](#getcategories)

Get product categories using `get_the_terms()` with taxonomy `product-categories`.

- Returns `Array|false|WP_Error` - Product categories
php
```
$product = FluentCart\App\Models\Product::find(1);
$categories = $product->getCategories();```

### getTags() [](#gettags)

Get product tags using `get_the_terms()` with taxonomy `product-tags`.

- Returns `Array|false|WP_Error` - Product tags
php
```
$product = FluentCart\App\Models\Product::find(1);
$tags = $product->getTags();```

### getMediaUrl($size = 'thumbnail') [](#getmediaurl-size-thumbnail)

Get product media URL using `get_the_post_thumbnail_url()`.

- Parameters: `$size` (String) - Image size (default: `'thumbnail'`)
- Returns `String|false` - Media URL or false
php
```
$product = FluentCart\App\Models\Product::find(1);
$mediaUrl = $product->getMediaUrl('large'); // returns media URL```

### images() [](#images)

Get all product images including featured image, gallery images, and variant images. Returns a structured array with image type, URL, alt text, and attachment ID.

- Returns `Array` - Array of image arrays with keys: `type`, `url`, `alt`, `product_title`, `attachment_id` (and `variation_title`, `variation_id` for variant images)
php
```
$product = FluentCart\App\Models\Product::with('variants')->find(1);
$images = $product->images();

// Each image has the structure:
// ['type' => 'gallery_image|thumbnail|variation_image', 'url' => '...', 'alt' => '...', ...]```

### isBundleProduct() [](#isbundleproduct)

Check if the product is a bundle product by looking at the `is_bundle_product` flag in the product detail's `other_info`.

- Returns `Boolean` - True if bundle product
php
```
$product = FluentCart\App\Models\Product::with('detail')->find(1);
$isBundle = $product->isBundleProduct(); // returns boolean```

### soldIndividually() [](#soldindividually)

Check if the product is sold individually (quantity limited to 1) by reading the `sold_individually` flag from the product detail's `other_info`.

- Returns `Boolean` - True if sold individually
php
```
$product = FluentCart\App\Models\Product::with('detail')->find(1);
$isSoldIndividually = $product->soldIndividually(); // returns boolean```

### isStock() [](#isstock)

Check if the product is in stock. Handles both regular and bundle products. For bundle products, it also checks stock status of all child variations.

- Returns `Boolean` - True if in stock
php
```
$product = FluentCart\App\Models\Product::with(['detail', 'variants'])->find(1);
$inStock = $product->isStock(); // returns boolean```

### getProductMeta($metaKey, $objectType = null, $default = null) [](#getproductmeta-metakey-objecttype-null-default-null)

Get product meta value from the `fct_meta` table via the `ProductMeta` model.

- Parameters: 

 - `$metaKey` (String) - Meta key
 - `$objectType` (String|null) - Object type filter (optional)
 - `$default` (Mixed) - Default value if not found (optional)

- Returns `Mixed` - Meta value or default
php
```
$product = FluentCart\App\Models\Product::find(1);

// Without object type
$metaValue = $product->getProductMeta('custom_field', null, 'default');

// With object type
$metaValue = $product->getProductMeta('license_settings', 'product_integration');```

### updateProductMeta($metaKey, $metaValue, $objectType = null) [](#updateproductmeta-metakey-metavalue-objecttype-null)

Update or create product meta value in the `fct_meta` table via the `ProductMeta` model. If the meta key already exists, updates it; otherwise creates a new entry.

- Parameters: 

 - `$metaKey` (String) - Meta key
 - `$metaValue` (Mixed) - Meta value
 - `$objectType` (String|null) - Object type (optional)

- Returns `FluentCart\App\Models\ProductMeta` - The created or updated ProductMeta instance
php
```
$product = FluentCart\App\Models\Product::find(1);

// Without object type
$meta = $product->updateProductMeta('custom_field', 'new_value');

// With object type
$meta = $product->updateProductMeta('custom_field', 'new_value', 'product_integration');```

### getTermByType($type) [](#gettermbytype-type)

Get term relationships for the product filtered by a specific taxonomy type. Joins through `term_taxonomy` and `terms` tables.

- Parameters: `$type` (String) - Taxonomy type (e.g., `'product-categories'`, `'product-tags'`)
- Returns `HasMany` - Query builder with term data
php
```
$product = FluentCart\App\Models\Product::find(1);
$terms = $product->getTermByType('product-categories');```

### duplicateProduct($productId, array $options = []) [](#duplicateproduct-productid-array-options)

Static method that duplicates a product including its detail, variants, downloadable files, taxonomies, and post meta. The new product is created as a draft.

- Parameters: 

 - `$productId` (Integer) - The ID of the product to duplicate
 - `$options` (Array) - Duplication options: 

 - `import_stock_management` (Boolean) - Copy stock management settings (default: `false`)
 - `import_license_settings` (Boolean) - Copy license settings (default: `false`)
 - `import_downloadable_files` (Boolean) - Copy downloadable files (default: `false`)

- Returns `Integer` - The new product ID
- Throws `RuntimeException` - If product not found or duplication fails
- Fires action: `fluent_cart/product_duplicated`
php
```
use FluentCart\App\Models\Product;

// Basic duplication
$newProductId = Product::duplicateProduct(123);

// Duplication with options
$newProductId = Product::duplicateProduct(123, [
 'import_stock_management' => true,
 'import_license_settings' => true,
 'import_downloadable_files' => true,
]);```

## Relations [](#relations)

This model has the following relationships that you can use
### detail [](#detail)

Access the product details.

- Returns `FluentCart\App\Models\ProductDetail` (HasOne)
php
```
$product = FluentCart\App\Models\Product::find(1);
$details = $product->detail;```

### variants [](#variants)

Access the product variations.

- Returns `Collection` of `FluentCart\App\Models\ProductVariation` (HasMany)
php
```
$product = FluentCart\App\Models\Product::find(1);
$variants = $product->variants;```

### downloadable_files [](#downloadable-files)

Access the product downloads.

- Returns `Collection` of `FluentCart\App\Models\ProductDownload` (HasMany)
php
```
$product = FluentCart\App\Models\Product::find(1);
$downloads = $product->downloadable_files;```

### postmeta [](#postmeta)

Access the product gallery image post meta. Filtered to only return the `fluent-products-gallery-image` meta key.

- Returns `FluentCart\App\Models\WpModels\PostMeta` (HasOne)
php
```
$product = FluentCart\App\Models\Product::find(1);
$postmeta = $product->postmeta;```

### wp_terms [](#wp-terms)

Access the WordPress term relationships for this product.

- Returns `Collection` of `FluentCart\App\Models\WpModels\TermRelationship` (HasMany)
php
```
$product = FluentCart\App\Models\Product::find(1);
$terms = $product->wp_terms;```

### orderItems [](#orderitems)

Access the order items for this product.

- Returns `Collection` of `FluentCart\App\Models\OrderItem` (HasMany)
php
```
$product = FluentCart\App\Models\Product::find(1);
$orderItems = $product->orderItems;```

### wpTerms() [](#wpterms)

Access the WordPress term taxonomies through the term relationships table (hasManyThrough).

- Returns `Collection` of `FluentCart\App\Models\WpModels\TermTaxonomy` (HasManyThrough)
php
```
$product = FluentCart\App\Models\Product::find(1);
$terms = $product->wpTerms;```

### categories() [](#categories)

Get product categories relationship. Uses `getTermByType('product-categories')` internally.

- Returns `HasMany` with joined term data
php
```
$product = FluentCart\App\Models\Product::find(1);
$categories = $product->categories;```

### tags() [](#tags)

Get product tags relationship. Uses `getTermByType('product-tags')` internally.

- Returns `HasMany` with joined term data
php
```
$product = FluentCart\App\Models\Product::find(1);
$tags = $product->tags;```

### thumbUrl [](#thumburl)

Access the product thumbnail URL via post meta. Joins through `_thumbnail_id` meta key to get the `_wp_attached_file` value.

- Returns `FluentCart\App\Models\WpModels\PostMeta` with additional `image` attribute (HasOne)
php
```
$product = FluentCart\App\Models\Product::find(1);
$thumbUrl = $product->thumbUrl;
$imageFile = $thumbUrl->image; // relative file path```

### licensesMeta [](#licensesmeta)

Access the license settings meta for this product. Filtered to `meta_key = 'license_settings'`.

- Returns `FluentCart\App\Models\ProductMeta` (HasOne)
php
```
$product = FluentCart\App\Models\Product::find(1);
$licenseMeta = $product->licensesMeta;```

### integrations [](#integrations)

Access the product integration meta entries. Filtered to `object_type = 'product_integration'`.

- Returns `Collection` of `FluentCart\App\Models\ProductMeta` (HasMany)
php
```
$product = FluentCart\App\Models\Product::find(1);
$integrations = $product->integrations;```

## Scopes [](#scopes)

This model has the following scopes that you can use
### published() [](#published)

Get only published productsphp
```
$products = FluentCart\App\Models\Product::published()->get();```

### statusOf($status) [](#statusof-status)

Get products by specific statusphp
```
$products = FluentCart\App\Models\Product::statusOf('publish')->get();```

### adminAll() [](#adminall)

Get all products for admin view (includes all admin-visible statuses)php
```
$products = FluentCart\App\Models\Product::adminAll()->get();```

### cartable() [](#cartable)

Get cartable products (excludes products with license meta and filters to non-subscription variants with media loaded)php
```
$products = FluentCart\App\Models\Product::cartable()->get();```

### applyCustomSortBy($sortKey, $sortType = 'DESC') [](#applycustomsortby-sortkey-sorttype-desc)

Apply custom sorting. Valid sort keys: `id`, `date`, `title`, `price`. When sorting by `price`, joins the `fct_product_details` table and sorts by `min_price`.

- Parameters: `$sortKey` (String) - Sort key (`id`|`date`|`title`|`price`), `$sortType` (String) - Sort direction (`ASC`|`DESC`)
php
```
$products = FluentCart\App\Models\Product::applyCustomSortBy('title', 'ASC')->get();
$products = FluentCart\App\Models\Product::applyCustomSortBy('price', 'DESC')->get();```

### byVariantTypes($type) [](#byvarianttypes-type)

Filter by variant types. Valid types: `physical`, `digital`, `subscription`, `onetime`, `simple`, `variations`.

- Parameters: `$type` (String) - Variant type
php
```
$products = FluentCart\App\Models\Product::byVariantTypes('physical')->get();
$products = FluentCart\App\Models\Product::byVariantTypes('subscription')->get();
$products = FluentCart\App\Models\Product::byVariantTypes('simple')->get();```

### filterByTaxonomy($taxonomies) [](#filterbytaxonomy-taxonomies)

Filter by taxonomies. Accepts an associative array where keys are taxonomy names and values are arrays of term IDs.

- Parameters: `$taxonomies` (Array) - Taxonomy filters
php
```
$products = FluentCart\App\Models\Product::filterByTaxonomy([
 'product-categories' => [1, 2, 3],
 'product-brands' => [4, 5, 6],
])->get();```

### bundle() [](#bundle)

Get only bundle products (products where `other_info->is_bundle_product` is `'yes'` in the product detail).php
```
$products = FluentCart\App\Models\Product::bundle()->get();```

### nonBundle() [](#nonbundle)

Get only non-bundle products (products where `other_info->is_bundle_product` is not `'yes'` or is null in the product detail).php
```
$products = FluentCart\App\Models\Product::nonBundle()->get();```

## Global Scope [](#global-scope)

The Product model applies a global scope that automatically filters queries to only include posts with `post_type = 'fluent-products'` and excludes `auto-draft` status. This scope is applied on all queries. Additionally, when creating a new Product, the `post_type` is automatically set to `fluent-products`.
## Usage Examples [](#usage-examples)

### Creating a Product [](#creating-a-product)
php
```
use FluentCart\App\Models\Product;

$product = Product::create([
 'post_title' => 'Sample Product',
 'post_content' => 'Product description',
 'post_status' => 'publish',
]);
// post_type is automatically set to 'fluent-products' via the creating event```

### Retrieving Products [](#retrieving-products)
php
```
// Get all published products
$products = Product::published()->get();

// Get product by ID
$product = Product::find(1);

// Get products with variations
$products = Product::with('variants')->get();

// Get products with detail and variants
$products = Product::with(['detail', 'variants'])->get();```

### Updating a Product [](#updating-a-product)
php
```
$product = Product::find(1);
$product->post_title = 'Updated Product Title';
$product->save();```

### Deleting a Product [](#deleting-a-product)
php
```
$product = Product::find(1);
$product->delete();```

---

## ProductDetail

Source: https://dev.fluentcart.com/database/models/product-detail.html


| DB Table Name | {wp_db_prefix}_fct_product_details | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-product-details-table) | 
| Source File | fluent-cart/app/Models/ProductDetail.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\ProductDetail | 
## Traits [](#traits)

| Trait | Description | 
| --- | --- |
| CanSearch | Adds search scope capabilities to the model | 
| CanUpdateBatch | Adds batch update capabilities to the model | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key (guarded) | 
| post_id | Integer | Reference to WordPress post (product). Cast as `integer`. | 
| fulfillment_type | String | Fulfillment type (physical, digital) | 
| min_price | Double | Minimum price (cents). Cast as `double`. Dynamically computed from variants via accessor. | 
| max_price | Double | Maximum price (cents). Cast as `double`. Dynamically computed from variants via accessor. | 
| default_variation_id | String | Default variation ID | 
| variation_type | String | Variation type (simple, variable) | 
| stock_availability | String | Stock availability quantity / status | 
| other_info | JSON | Additional product information (auto JSON encoded/decoded via mutator/accessor) | 
| default_media | JSON | Default media information (auto JSON encoded/decoded via mutator/accessor) | 
| manage_stock | String | Whether to manage stock | 
| manage_downloadable | String | Whether to manage downloadable files | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Fillable Attributes [](#fillable-attributes)

The following attributes are mass-assignable:
`post_id`, `fulfillment_type`, `min_price`, `max_price`, `default_variation_id`, `variation_type`, `stock_availability`, `other_info`, `default_media`, `manage_stock`, `manage_downloadable`
The `id` attribute is guarded and cannot be mass-assigned.
## Casts [](#casts)

| Attribute | Cast Type | 
| --- | --- |
| post_id | integer | 
| min_price | double | 
| max_price | double | 
## Appends [](#appends)

The following computed attributes are automatically appended to the model's array/JSON output:

| Appended Attribute | Description | 
| --- | --- |
| featured_media | First image from the gallery (via `getFeaturedMediaAttribute`) | 
| formatted_min_price | Human-readable minimum price (via `getFormattedMinPriceAttribute`) | 
| formatted_max_price | Human-readable maximum price (via `getFormattedMaxPriceAttribute`) | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$productDetail = FluentCart\App\Models\ProductDetail::find(1);

$productDetail->id; // returns id
$productDetail->post_id; // returns post ID (cast as integer)
$productDetail->min_price; // returns minimum price (dynamically computed from variants)
$productDetail->max_price; // returns maximum price (dynamically computed from variants)
$productDetail->featured_media; // returns first gallery image or null (appended)
$productDetail->formatted_min_price; // returns formatted min price string (appended)
$productDetail->formatted_max_price; // returns formatted max price string (appended)```

## Relations [](#relations)

This model has the following relationships that you can use
### product [](#product)

Access the associated product (WordPress post). Linked via `post_id` to `ID` on the products table.

- Relationship type: `BelongsTo`
- return `FluentCart\App\Models\Product` Model

#### Example: [](#example)
php
```
// Accessing Product
$product = $productDetail->product;

// For Filtering by product relationship
$productDetails = FluentCart\App\Models\ProductDetail::whereHas('product', function($query) {
 $query->where('post_status', 'publish');
})->get();```

### galleryImage [](#galleryimage)

Access the associated gallery image meta. This is a `HasOne` relation to `PostMeta` filtered by `meta_key = 'fluent-products-gallery-image'`, linked via `post_id`.

- Relationship type: `HasOne`
- return `FluentCart\App\Models\WpModels\PostMeta` Model

#### Example: [](#example-1)
php
```
// Accessing Gallery Image
$galleryImage = $productDetail->galleryImage;```

### variants [](#variants)

Access all product variations, ordered by `serial_index` ascending. Linked via `post_id` on both tables.

- Relationship type: `HasMany`
- return `FluentCart\App\Models\ProductVariation` Model Collection

#### Example: [](#example-2)
php
```
// Accessing Variants
$variants = $productDetail->variants;

// For Filtering by variants relationship
$productDetails = FluentCart\App\Models\ProductDetail::whereHas('variants', function($query) {
 $query->where('status', 'active');
})->get();```

### attrMap [](#attrmap)

Access all attribute relations. Linked via `object_id` (on `AttributeRelation`) to `id` (on `ProductDetail`).
When a `ProductDetail` record is deleted, all related `attrMap` records are automatically cascade-deleted via the model's `boot()` method.

- Relationship type: `HasMany`
- return `FluentCart\App\Models\AttributeRelation` Model Collection

#### Example: [](#example-3)
php
```
// Accessing Attribute Relations
$attrMap = $productDetail->attrMap;```

## Cascade Deletes [](#cascade-deletes)

The model registers a `deleting` event in its `boot()` method. When a `ProductDetail` is deleted, all associated `attrMap` (AttributeRelation) records are automatically deleted:php
```
// When you delete a ProductDetail, its attrMap relations are removed automatically
$productDetail->delete(); // Also deletes all related AttributeRelation records```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### setOtherInfoAttribute($value) [](#setotherinfoattribute-value)

Set other info with automatic JSON encoding (mutator). Arrays and objects are JSON encoded; strings are stored as-is.

- Parameters 

 - $value - mixed (array, object, or string)

- Returns `void`

#### Usage [](#usage-1)
php
```
$productDetail->other_info = ['custom_data' => 'value', 'settings' => ['key' => 'value']];
// Automatically JSON encodes arrays and objects```

### getOtherInfoAttribute($value) [](#getotherinfoattribute-value)

Get other info with automatic JSON decoding (accessor). Returns the decoded array or `null` if empty.

- Parameters 

 - $value - mixed

- Returns `array|null`

#### Usage [](#usage-2)
php
```
$otherInfo = $productDetail->other_info; // Returns decoded array or null```

### setDefaultMediaAttribute($value) [](#setdefaultmediaattribute-value)

Set default media with automatic JSON encoding (mutator). Arrays and objects are JSON encoded; strings are stored as-is.

- Parameters 

 - $value - mixed (array, object, or string)

- Returns `void`

#### Usage [](#usage-3)
php
```
$productDetail->default_media = ['url' => 'image.jpg', 'alt' => 'Product Image'];
// Automatically JSON encodes arrays and objects```

### getDefaultMediaAttribute($value) [](#getdefaultmediaattribute-value)

Get default media with automatic JSON decoding (accessor). Returns the decoded array or `null` if empty.

- Parameters 

 - $value - mixed

- Returns `array|null`

#### Usage [](#usage-4)
php
```
$defaultMedia = $productDetail->default_media; // Returns decoded array or null```

### getMinPriceAttribute() [](#getminpriceattribute)

Dynamic accessor that overrides the `min_price` database column. Instead of returning the stored value, it computes the minimum `item_price` from all associated variants.

- Parameters 

 - none

- Returns `double|null`

#### Usage [](#usage-5)
php
```
$minPrice = $productDetail->min_price; // Returns the minimum item_price across all variants```

### getMaxPriceAttribute() [](#getmaxpriceattribute)

Dynamic accessor that overrides the `max_price` database column. Instead of returning the stored value, it computes the maximum `item_price` from all associated variants.

- Parameters 

 - none

- Returns `double|null`

#### Usage [](#usage-6)
php
```
$maxPrice = $productDetail->max_price; // Returns the maximum item_price across all variants```

### getFormattedMinPriceAttribute() [](#getformattedminpriceattribute)

Get formatted minimum price (accessor). Uses `Helper::toDecimal()` to convert the min_price (in cents) to a human-readable decimal string.

- Parameters 

 - none

- Returns `string`

#### Usage [](#usage-7)
php
```
$formattedMinPrice = $productDetail->formatted_min_price; // Returns formatted price string```

### getFormattedMaxPriceAttribute() [](#getformattedmaxpriceattribute)

Get formatted maximum price (accessor). Uses `Helper::toDecimal()` to convert the max_price (in cents) to a human-readable decimal string.

- Parameters 

 - none

- Returns `string`

#### Usage [](#usage-8)
php
```
$formattedMaxPrice = $productDetail->formatted_max_price; // Returns formatted price string```

### getFeaturedMediaAttribute() [](#getfeaturedmediaattribute)

Get featured media from gallery (accessor). Returns the first element from the gallery image meta value, or `null` if the gallery is empty or not set.

- Parameters 

 - none

- Returns `mixed|null`

#### Usage [](#usage-9)
php
```
$featuredMedia = $productDetail->featured_media; // Returns first gallery image or null```

### hasPriceVariation() [](#haspricevariation)

Check if product has a price variation. Returns `true` only when the product's `variation_type` is `'simple'` **and** `max_price` differs from `min_price`.

- Parameters 

 - none

- Returns `boolean`

#### Usage [](#usage-10)
php
```
$hasVariation = $productDetail->hasPriceVariation();
// Returns true if variation_type is 'simple' AND min_price != max_price```

### getStockAvailability($variationId = null) [](#getstockavailability-variationid-null)

Get stock availability information. Returns an array describing stock status. The result is passed through the `fluent_cart/product_stock_availability` filter hook, allowing external modification.

- Parameters 

 - $variationId - integer|null (default: null)

- Returns `array` with keys: `manage_stock` (bool), `availability` (string), `class` (string), `available_quantity` (int|null)

**Return scenarios:**

| Condition | manage_stock | availability | class | available_quantity | 
| --- | --- | --- | --- | --- |
| `manage_stock` is falsy | `false` | "In Stock" | "in-stock" | `null` | 
| `manage_stock` truthy, `stock_availability` truthy | `true` | "In Stock" | "in-stock" | `stock_availability` value | 
| `manage_stock` truthy, `stock_availability` falsy | `true` | "Out of Stock" | "out-of-stock" | `stock_availability` value | 
**Filter hook:** `fluent_cart/product_stock_availability`

- Receives: `$availability` array, `['detail' => $this, 'variation_id' => $variationId]`

#### Usage [](#usage-11)
php
```
$stockInfo = $productDetail->getStockAvailability();
// Returns array with manage_stock, availability, class, available_quantity

// With a specific variation
$stockInfo = $productDetail->getStockAvailability($variationId);```

## Usage Examples [](#usage-examples)

### Get Product Details [](#get-product-details)
php
```
$productDetail = FluentCart\App\Models\ProductDetail::find(1);
echo "Min Price: " . $productDetail->formatted_min_price;
echo "Max Price: " . $productDetail->formatted_max_price;
echo "Stock: " . $productDetail->getStockAvailability()['availability'];```

### Get Product with Variations [](#get-product-with-variations)
php
```
$productDetail = FluentCart\App\Models\ProductDetail::with(['product', 'variants'])->find(1);
$product = $productDetail->product;
$variants = $productDetail->variants;```

### Create Product Detail [](#create-product-detail)
php
```
$productDetail = FluentCart\App\Models\ProductDetail::create([
 'post_id' => 123,
 'fulfillment_type' => 'physical',
 'min_price' => 19.99,
 'max_price' => 29.99,
 'variation_type' => 'simple',
 'stock_availability' => 'in-stock',
 'manage_stock' => '1',
 'manage_downloadable' => '0'
]);```

### Check Stock Availability [](#check-stock-availability)
php
```
$productDetail = FluentCart\App\Models\ProductDetail::find(1);
$stockInfo = $productDetail->getStockAvailability();

if ($stockInfo['manage_stock']) {
 echo "Stock: " . $stockInfo['available_quantity'];
} else {
 echo "Stock: " . $stockInfo['availability'];
}```

### Get Featured Media [](#get-featured-media)
php
```
$productDetail = FluentCart\App\Models\ProductDetail::find(1);
$featuredMedia = $productDetail->featured_media;

if ($featuredMedia) {
 echo "Featured Image: " . $featuredMedia['url'];
}```

### Dynamic Price Computation [](#dynamic-price-computation)
php
```
// min_price and max_price are dynamically computed from variants
$productDetail = FluentCart\App\Models\ProductDetail::find(1);

// These pull min/max item_price from the variants table, not the stored column values
$minPrice = $productDetail->min_price;
$maxPrice = $productDetail->max_price;

// Check if a simple product has a price range
if ($productDetail->hasPriceVariation()) {
 echo "Price range: $minPrice - $maxPrice";
}```

---

## ProductVariation

Source: https://dev.fluentcart.com/database/models/product-variation.html


| DB Table Name | {wp_db_prefix}_fct_product_variations | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-product-variations-table) | 
| Source File | fluent-cart/app/Models/ProductVariation.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\ProductVariation | 
## Traits [](#traits)

| Trait | Description | 
| --- | --- |
| `CanSearch` | Adds search scope capabilities | 
| `CanUpdateBatch` | Adds batch update capabilities | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| post_id | Integer | Reference to WordPress post (product) | 
| media_id | Integer | Reference to media | 
| serial_index | Integer | Serial index for ordering | 
| sold_individually | Integer | Whether sold individually (0 or 1) | 
| variation_title | String | Variation title | 
| variation_identifier | String | Variation identifier | 
| sku | String | Stock keeping unit | 
| manage_stock | String | Whether to manage stock | 
| payment_type | String | Payment type (`onetime`, `subscription`) | 
| stock_status | String | Stock status | 
| backorders | Integer | Backorder quantity | 
| total_stock | Integer | Total stock quantity | 
| available | Integer | Available quantity | 
| committed | Integer | Committed quantity | 
| on_hold | Integer | On hold quantity | 
| fulfillment_type | String | Fulfillment type (`physical`, `digital`) | 
| item_status | String | Item status (`active`, `inactive`) | 
| manage_cost | String | Whether to manage cost | 
| item_price | Decimal | Item price (stored in cents, cast to double) | 
| item_cost | Decimal | Item cost (stored in cents, cast to double) | 
| compare_price | Decimal | Compare price (stored in cents, cast to double) | 
| other_info | Array | Additional variation information (JSON, cast to array) | 
| downloadable | String | Whether downloadable | 
| shipping_class | String | Shipping class ID | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Casts [](#casts)

The following attributes are automatically cast when accessed:

| Attribute | Cast Type | 
| --- | --- |
| post_id | integer | 
| media_id | integer | 
| item_cost | double | 
| item_price | double | 
| compare_price | double | 
| backorders | integer | 
| total_stock | integer | 
| available | integer | 
| committed | integer | 
| on_hold | integer | 
| sold_individually | integer | 
| serial_index | integer | 
| other_info | array | 
## Appends [](#appends)

The following computed attributes are appended to every model instance:

| Appended Attribute | Description | 
| --- | --- |
| `thumbnail` | Always appended via `$appends`. Returns the first thumbnail URL from the `media` relation, or `null`. | 
| `formatted_total` | Appended at runtime inside `booted()` on every `retrieved` event. Returns `Helper::toDecimal($this->item_price)`. | 
## Custom `other_info` Accessor [](#custom-other-info-accessor)

The `getOtherInfoAttribute` accessor decodes the JSON value and, when `payment_type` is `subscription`, injects sensible defaults for subscription fields that may not yet be stored:

| Injected Key | Default Value | 
| --- | --- |
| `payment_type` | `'subscription'` | 
| `installment` | `'yes'` only if value is `'yes'` AND Pro is active; otherwise `'no'` | 
| `repeat_interval` | `'yearly'` | 
| `times` | `0` | 
| `trial_days` | `0` | 
| `manage_setup_fee` | `'no'` | 
This means reading `$variation->other_info` on a subscription variation always returns these keys even if they were not explicitly saved.
## Cascade Deletes [](#cascade-deletes)

When a `ProductVariation` is deleted, the `boot()` method fires the following cleanup:

- **Media** -- calls `\FluentCart\Api\Meta::deleteVariationMedia($model->id)` to remove associated media metadata.
- **Attribute Map** -- calls `$model->attrMap()->delete()` to remove all related `AttributeRelation` records.

## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$productVariation = FluentCart\App\Models\ProductVariation::find(1);

$productVariation->id; // returns id
$productVariation->post_id; // returns post ID
$productVariation->item_price; // returns item price (cast to double)
$productVariation->stock_status; // returns stock status
$productVariation->sku; // returns SKU
$productVariation->thumbnail; // returns thumbnail URL or null (appended attribute)
$productVariation->formatted_total; // returns formatted price string (appended on retrieval)```

## Scopes [](#scopes)

This model has the following scopes that you can use
### getWithShippingClass() [](#getwithshippingclass)

Get variations with their shipping class information. This scope executes the query, then looks up `ShippingMethod` records whose IDs match the `other_info.shipping_class` value on each variation, and attaches the matching method as a `shipping_method` dynamic attribute.

- Parameters 

 - none

- Returns the query result (executes `$query->get()` internally)

#### Usage: [](#usage-1)
php
```
// Get variations with shipping class data
$variations = FluentCart\App\Models\ProductVariation::getWithShippingClass();

foreach ($variations as $variation) {
 if (isset($variation->shipping_method)) {
 echo $variation->shipping_method->title;
 }
}```

## Relations [](#relations)

This model has the following relationships that you can use
### product [](#product)

Access the associated product (WordPress post). BelongsTo via `post_id` -> `Product.ID`.

- return `FluentCart\App\Models\Product` Model

#### Example: [](#example)
php
```
// Accessing Product
$product = $productVariation->product;

// For Filtering by product relationship
$productVariations = FluentCart\App\Models\ProductVariation::whereHas('product', function($query) {
 $query->where('post_status', 'publish');
})->get();```

### shippingClass [](#shippingclass)

Access the associated shipping class. BelongsTo via `shipping_class` -> `ShippingClass.id`.

- return `FluentCart\App\Models\ShippingClass` Model

#### Example: [](#example-1)
php
```
// Accessing Shipping Class
$shippingClass = $productVariation->shippingClass;```

### product_detail [](#product-detail)

Access the associated product detail. BelongsTo via `post_id` -> `ProductDetail.post_id`.

- return `FluentCart\App\Models\ProductDetail` Model

#### Example: [](#example-2)
php
```
// Accessing Product Detail
$productDetail = $productVariation->product_detail;```

### media [](#media)

Access the associated product thumbnail media. HasOne to `ProductMeta` via `object_id` -> `id`, filtered to `meta_key = 'product_thumbnail'`. Only selects `id`, `object_id`, `meta_value`.

- return `FluentCart\App\Models\ProductMeta` Model (single record)

#### Example: [](#example-3)
php
```
// Accessing Media
$media = $productVariation->media;

// The thumbnail appended attribute reads from this relation:
$url = $productVariation->thumbnail; // shortcut```

### product_downloads [](#product-downloads)

Access all product downloads associated with this variation's product. HasMany to `ProductDownload` via `post_id` -> `post_id`, filtered to rows where `product_variation_id` contains this variation's ID, or is `NULL`, or is `'[]'`.

- return `FluentCart\App\Models\ProductDownload` Model Collection

#### Example: [](#example-4)
php
```
// Accessing Product Downloads
$downloads = $productVariation->product_downloads;```

### order_items [](#order-items)

Access all order items for this variation. HasMany to `OrderItem` via `object_id` -> `id`.

- return `FluentCart\App\Models\OrderItem` Model Collection

#### Example: [](#example-5)
php
```
// Accessing Order Items
$orderItems = $productVariation->order_items;```

### downloadable_files [](#downloadable-files)

Access all downloadable files directly linked to this variation. HasMany to `ProductDownload` via `product_variation_id` -> `id`.

- return `FluentCart\App\Models\ProductDownload` Model Collection

#### Example: [](#example-6)
php
```
// Accessing Downloadable Files
$downloadableFiles = $productVariation->downloadable_files;```

### upgrade_paths [](#upgrade-paths)

Access all upgrade path meta entries for this variation. HasMany to `Meta` via `object_id` -> `id`, filtered by `object_type = PlanUpgradeService::$metaType` and `meta_key = PlanUpgradeService::$metaKey`.

- return `FluentCart\App\Models\Meta` Model Collection

#### Example: [](#example-7)
php
```
// Accessing Upgrade Paths
$upgradePaths = $productVariation->upgrade_paths;```

### attrMap [](#attrmap)

Access all attribute relation mappings for this variation. HasMany to `AttributeRelation` via `object_id` -> `id`.
**Note:** These records are cascade-deleted when the variation is deleted.

- return `FluentCart\App\Models\AttributeRelation` Model Collection

#### Example: [](#example-8)
php
```
// Accessing Attribute Relations
$attrMap = $productVariation->attrMap;```

### bundleChildren [](#bundlechildren)

Access the child variations of a bundle product. Uses a custom `BundleChildrenRelation` that reads child IDs from the `other_info` JSON column (key `bundle_child_ids`) and loads the corresponding `ProductVariation` records. Supports eager loading.

- return `FluentCart\App\Models\ProductVariation` Model Collection (via `BundleChildrenRelation`)

#### Example: [](#example-9)
php
```
// Accessing Bundle Children
$children = $productVariation->bundleChildren;

// Eager loading bundle children
$variations = FluentCart\App\Models\ProductVariation::with('bundleChildren')->where('post_id', $postId)->get();

foreach ($variations as $variation) {
 foreach ($variation->bundleChildren as $child) {
 echo $child->variation_title;
 }
}```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### getFormattedTotalAttribute() [](#getformattedtotalattribute)

Get formatted total price (accessor). Automatically appended on every `retrieved` event via the `booted()` method.

- Parameters 

 - none

- Returns `string` -- the decimal-formatted item price

#### Usage [](#usage-2)
php
```
$formattedTotal = $productVariation->formatted_total; // Returns formatted price string```

### getThumbnailAttribute() [](#getthumbnailattribute)

Get thumbnail URL (accessor). Reads from the `media` relation. Returns the `url` key of the first element in `media->meta_value`, or `null` if no media is set.

- Parameters 

 - none

- Returns `string|null`

#### Usage [](#usage-3)
php
```
$thumbnail = $productVariation->thumbnail; // Returns thumbnail URL or null```

### canPurchase($quantity = 1) [](#canpurchase-quantity-1)

Check if the variation can be purchased. Validates:

- `item_status` must be `active` and parent product must be `publish` or `private`.
- Subscription variations cannot have `$quantity > 1`.
- A related `product_detail` must exist.
- If stock management module is active and both `productDetail->manage_stock` and `$this->manage_stock` are truthy, `$quantity` must not exceed `$this->available`.
- Bundle products require Pro to be active.
- Applies the `fluent_cart/variation/can_purchase_bundle` filter for additional bundle checks.

- Parameters 

 - `$quantity` - integer (default: 1)

- Returns `true` on success, or `\WP_Error` with an error code on failure

**Error codes:** `unpublished`, `invalid_subscription_quantity`, `insufficient_stock`, `invalid_bundle_product`
#### Usage [](#usage-4)
php
```
$canPurchase = $productVariation->canPurchase(2);
if (is_wp_error($canPurchase)) {
 echo "Error: " . $canPurchase->get_error_message();
} else {
 echo "Available for purchase";
}```

### getSubscriptionTermsText($withComparePrice = false) [](#getsubscriptiontermstext-withcompareprice-false)

Get human-readable subscription terms text. Returns an empty string for non-subscription variations. Reads `trial_days`, `repeat_interval`, `times`, `signup_fee`, `signup_fee_name` from `other_info` and delegates to `Helper::getSubscriptionTermText()`.

- Parameters 

 - `$withComparePrice` - boolean (default: false). When `true` and `compare_price > item_price`, the compare price is included in the formatted output.

- Returns `string`

#### Usage [](#usage-5)
php
```
$termsText = $productVariation->getSubscriptionTermsText(true);
echo "Subscription Terms: " . $termsText;```

### getPurchaseUrl() [](#getpurchaseurl)

Get the instant checkout purchase URL for this variation.

- Parameters 

 - none

- Returns `string` -- URL in the format `site_url('?fluent-cart=instant_checkout&item_id={id}&quantity=1')`

#### Usage [](#usage-6)
php
```
$purchaseUrl = $productVariation->getPurchaseUrl();
echo "Purchase URL: " . $purchaseUrl;```

### soldIndividually() [](#soldindividually)

Check whether this variation's parent product is sold individually. Delegates to `$this->product->soldIndividually()`.

- Parameters 

 - none

- Returns `bool` -- `false` if no product is loaded

#### Usage [](#usage-7)
php
```
if ($productVariation->soldIndividually()) {
 echo "This product can only be purchased one at a time.";
}```

### isStock() [](#isstock)

Check whether this variation is currently in stock. The logic handles both regular and bundle products:

- Returns `false` if `item_status` is not `active`.
- If `manage_stock` is disabled: 

 - For bundle products, delegates to `isBundleChildrenInStock()`.
 - For regular products, returns `true` when `stock_status` equals `Helper::IN_STOCK`.

- If `manage_stock` is enabled, checks `available > 0` AND `stock_status === Helper::IN_STOCK`.
- For bundle products with stock management enabled, the parent must be in stock AND all children must pass `isBundleChildrenInStock()`.

- Parameters 

 - none

- Returns `bool`

#### Usage [](#usage-8)
php
```
$variation = FluentCart\App\Models\ProductVariation::find(1);
if ($variation->isStock()) {
 echo "In stock";
} else {
 echo "Out of stock";
}```

### isBundleChildrenInStock() (protected) [](#isbundlechildreninstock-protected)

Check if all bundle children are in stock. Reads `bundle_child_ids` from `other_info`, loads those variations, and verifies each child is `active` and (if `manage_stock` is enabled) has `available > 0` with `stock_status === Helper::IN_STOCK`. Returns `true` if there are no bundle children.

- Visibility: `protected`
- Parameters 

 - none

- Returns `bool`

## Hooks / Filters [](#hooks-filters)

| Hook | Type | Location | Description | 
| --- | --- | --- | --- |
| `fluent_cart/variation/can_purchase_bundle` | Filter | `canPurchase()` | Allows external code to block or allow bundle purchases. Receives `null` and an array with `variation` and `quantity`. Return `\WP_Error` to block, `false` for out-of-stock, or `null`/`true` to allow. | 
## Usage Examples [](#usage-examples)

### Get Product Variations [](#get-product-variations)
php
```
$productVariation = FluentCart\App\Models\ProductVariation::find(1);
echo "Price: " . $productVariation->formatted_total;
echo "Stock: " . $productVariation->available;
echo "Status: " . $productVariation->item_status;
echo "SKU: " . $productVariation->sku;```

### Get Variations with Shipping Class [](#get-variations-with-shipping-class)
php
```
$variations = FluentCart\App\Models\ProductVariation::getWithShippingClass();
foreach ($variations as $variation) {
 echo "Variation: " . $variation->variation_title;
 if (isset($variation->shipping_method)) {
 echo "Shipping Method: " . $variation->shipping_method->title;
 }
}```

### Check Purchase Availability [](#check-purchase-availability)
php
```
$variation = FluentCart\App\Models\ProductVariation::find(1);
$canPurchase = $variation->canPurchase(1);

if (is_wp_error($canPurchase)) {
 echo "Cannot purchase: " . $canPurchase->get_error_message();
} else {
 echo "Available for purchase";
}```

### Check Stock Status (Including Bundles) [](#check-stock-status-including-bundles)
php
```
$variation = FluentCart\App\Models\ProductVariation::find(1);
if ($variation->isStock()) {
 echo "Variation is in stock";
} else {
 echo "Variation is out of stock";
}```

### Get Subscription Terms [](#get-subscription-terms)
php
```
$variation = FluentCart\App\Models\ProductVariation::find(1);
if ($variation->payment_type === 'subscription') {
 $terms = $variation->getSubscriptionTermsText(true);
 echo "Subscription: " . $terms;
}```

### Get Downloadable Files [](#get-downloadable-files)
php
```
$variation = FluentCart\App\Models\ProductVariation::find(1);
$downloads = $variation->downloadable_files;

foreach ($downloads as $download) {
 echo "Download: " . $download->title;
}```

### Work with Bundle Children [](#work-with-bundle-children)
php
```
$variation = FluentCart\App\Models\ProductVariation::find(1);
$children = $variation->bundleChildren;

foreach ($children as $child) {
 echo "Child: " . $child->variation_title . " - Price: " . $child->formatted_total;
}```

---

## ProductMeta

Source: https://dev.fluentcart.com/database/models/product-meta.html


| DB Table Name | {wp_db_prefix}_fct_product_meta | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-product-meta-table) | 
| Source File | fluent-cart/app/Models/ProductMeta.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\ProductMeta | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key (guarded) | 
| object_id | Integer | ID of the associated object | 
| object_type | String | Type of object (product, variation, etc.) | 
| meta_key | String | Meta key name | 
| meta_value | Text | Meta value (JSON encoded for arrays/objects, auto-encoded/decoded via mutator/accessor) | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$productMeta = FluentCart\App\Models\ProductMeta::find(1);

$productMeta->id; // returns id
$productMeta->object_id; // returns object ID
$productMeta->object_type; // returns object type
$productMeta->meta_key; // returns meta key
$productMeta->meta_value; // returns meta value (auto-decoded if JSON)```

## Relations [](#relations)

This model does not define any relationships. It is a generic meta storage model that uses `object_id` and `object_type` to associate with different parent entities (products, variations, etc.).
## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### setMetaValueAttribute($meta_value) [](#setmetavalueattribute-meta-value)

Set meta value with automatic JSON encoding (mutator). Arrays and objects are encoded with `JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES` flags.

- Parameters 

 - `$meta_value` - mixed (array, object, or string)

- Returns `void`

#### Usage [](#usage-1)
php
```
$productMeta->meta_value = ['custom_data' => 'value', 'settings' => ['key' => 'value']];
// Automatically JSON encodes arrays and objects```

### getMetaValueAttribute($value) [](#getmetavalueattribute-value)

Get meta value with automatic JSON decoding (accessor). If the stored string is valid JSON, it returns the decoded array. Otherwise, returns the raw string value.

- Parameters 

 - `$value` - mixed

- Returns `mixed` (decoded array if valid JSON, otherwise original value)

#### Usage [](#usage-2)
php
```
$metaValue = $productMeta->meta_value; // Returns decoded value (array, object, or string)```

## Usage Examples [](#usage-examples)

### Get Product Meta [](#get-product-meta)
php
```
$productMeta = FluentCart\App\Models\ProductMeta::where('object_type', 'product')
 ->where('object_id', 123)
 ->get();

foreach ($productMeta as $meta) {
 echo "Key: " . $meta->meta_key;
 echo "Value: " . print_r($meta->meta_value, true);
}```

### Create Product Meta [](#create-product-meta)
php
```
$productMeta = FluentCart\App\Models\ProductMeta::create([
 'object_id' => 123,
 'object_type' => 'product',
 'meta_key' => 'custom_field',
 'meta_value' => 'custom_value'
]);```

### Store Complex Product Data [](#store-complex-product-data)
php
```
$productMeta = FluentCart\App\Models\ProductMeta::create([
 'object_id' => 123,
 'object_type' => 'variation',
 'meta_key' => 'product_options',
 'meta_value' => [
 'color' => 'red',
 'size' => 'large',
 'customizations' => ['engraving' => 'Happy Birthday']
 ]
]);```

### Get Meta by Key [](#get-meta-by-key)
php
```
$meta = FluentCart\App\Models\ProductMeta::where('object_type', 'product')
 ->where('object_id', 123)
 ->where('meta_key', 'product_thumbnail')
 ->first();

if ($meta) {
 echo "Thumbnail: " . $meta->meta_value;
}```

### Update Meta Value [](#update-meta-value)
php
```
$meta = FluentCart\App\Models\ProductMeta::find(1);
$meta->meta_value = ['updated' => true, 'timestamp' => now()];
$meta->save();```

### Get All Meta for Product [](#get-all-meta-for-product)
php
```
$productMetas = FluentCart\App\Models\ProductMeta::where('object_type', 'product')
 ->where('object_id', 123)
 ->get();```

### Get Meta for Variation [](#get-meta-for-variation)
php
```
$variationMetas = FluentCart\App\Models\ProductMeta::where('object_type', 'variation')
 ->where('object_id', 456)
 ->get();```

---

## ProductDownload

Source: https://dev.fluentcart.com/database/models/product-download.html


| DB Table Name | {wp_db_prefix}_fct_product_downloads | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-product-downloads-table) | 
| Source File | fluent-cart/app/Models/ProductDownload.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\ProductDownload | 
## Traits [](#traits)

| Trait | Description | 
| --- | --- |
| CanSearch | Provides `search()`, `groupSearch()`, `whereLike()`, `whereBeginsWith()`, `whereEndsWith()` query scopes | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| post_id | Integer | Reference to WordPress post (product) | 
| product_variation_id | JSON | Product variation IDs (JSON encoded array, auto-encoded/decoded via mutator/accessor) | 
| download_identifier | String | Download identifier | 
| title | String | Download title | 
| type | String | Download type | 
| driver | String | Storage driver | 
| file_name | String | File name | 
| file_path | String | File path | 
| file_url | String | File URL | 
| file_size | Integer | File size in bytes | 
| settings | JSON | Download settings (auto-encoded/decoded via mutator/accessor) | 
| serial | String | Serial number | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$productDownload = FluentCart\App\Models\ProductDownload::find(1);

$productDownload->id; // returns id
$productDownload->post_id; // returns post ID
$productDownload->title; // returns download title
$productDownload->file_size; // returns file size
$productDownload->product_variation_id; // returns array of variation IDs
$productDownload->settings; // returns decoded settings array```

## Scopes [](#scopes)

This model has the following scopes that you can use
### search($params) from CanSearch [](#search-params)

Search downloads by parameters. Supports operators: `=`, `between`, `like_all`, `in`, `not_in`, `is_null`, `is_not_null`, and more.

- Parameters 

 - `$params` (Array) - Search parameters

#### Usage: [](#usage-1)
php
```
$downloads = FluentCart\App\Models\ProductDownload::search([
 'type' => ['value' => 'pdf', 'operator' => '=']
])->get();```

## Relations [](#relations)

This model has the following relationships that you can use
### product [](#product)

Access the associated product (WordPress post)

- return `FluentCart\App\Models\Product` Model (BelongsTo via `post_id` -> `ID`)

#### Example: [](#example)
php
```
// Accessing Product
$product = $productDownload->product;

// For Filtering by product relationship
$productDownloads = FluentCart\App\Models\ProductDownload::whereHas('product', function($query) {
 $query->where('post_status', 'publish');
})->get();```

### download_permissions [](#download-permissions)

Access all download permissions for this download

- return `FluentCart\App\Models\OrderDownloadPermission` Model Collection (HasMany via `download_id` -> `id`)

#### Example: [](#example-1)
php
```
// Accessing Download Permissions
$permissions = $productDownload->download_permissions;

// For Filtering by download permissions relationship
$productDownloads = FluentCart\App\Models\ProductDownload::whereHas('download_permissions', function($query) {
 $query->where('download_count', '<', 'download_limit');
})->get();```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### setSettingsAttribute($settings) [](#setsettingsattribute-settings)

Set settings with automatic JSON encoding (mutator). Arrays and objects are encoded with `JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES` flags.

- Parameters 

 - `$settings` - mixed (array, object, or string)

- Returns `void`

#### Usage [](#usage-2)
php
```
$productDownload->settings = ['access_limit' => 5, 'expiry_days' => 30];
// Automatically JSON encodes arrays and objects```

### getSettingsAttribute($settings) [](#getsettingsattribute-settings)

Get settings with automatic JSON decoding (accessor). If the stored string is valid JSON, it returns the decoded array. Otherwise, returns the raw value.

- Parameters 

 - `$settings` - mixed

- Returns `mixed`

#### Usage [](#usage-3)
php
```
$settings = $productDownload->settings; // Returns decoded value (array, object, or string)```

### setProductVariationIdAttribute($variations) [](#setproductvariationidattribute-variations)

Set product variation IDs with automatic JSON encoding (mutator). Accepts an array of IDs, a single numeric ID (wrapped in an array), or defaults to an empty array.

- Parameters 

 - `$variations` - array|int|mixed

- Returns `void`

#### Usage [](#usage-4)
php
```
$productDownload->product_variation_id = [1, 2, 3];
// Automatically JSON encodes array

$productDownload->product_variation_id = 5;
// Automatically wraps in array: [5]```

### getProductVariationIdAttribute($value) [](#getproductvariationidattribute-value)

Get product variation IDs with automatic JSON decoding (accessor). Always returns an array.

- Parameters 

 - `$value` - mixed

- Returns `array`

#### Usage [](#usage-5)
php
```
$variationIds = $productDownload->product_variation_id; // Returns array of variation IDs```

### getSignedDownloadUrl() [](#getsigneddownloadurl)

Get signed download URL using the `DownloadService`. Generates a secure, time-limited URL for file access.

- Parameters 

 - none

- Returns `string`

#### Usage [](#usage-6)
php
```
$downloadUrl = $productDownload->getSignedDownloadUrl();
echo "Download URL: " . $downloadUrl;```

## Usage Examples [](#usage-examples)

### Get Product Downloads [](#get-product-downloads)
php
```
$productDownload = FluentCart\App\Models\ProductDownload::find(1);
echo "Title: " . $productDownload->title;
echo "File Size: " . $productDownload->file_size . " bytes";
echo "Download URL: " . $productDownload->getSignedDownloadUrl();```

### Get Downloads for Product [](#get-downloads-for-product)
php
```
$product = FluentCart\App\Models\Product::find(123);
$downloads = $product->downloads;

foreach ($downloads as $download) {
 echo "Download: " . $download->title;
 echo "Type: " . $download->type;
}```

### Create Product Download [](#create-product-download)
php
```
$productDownload = FluentCart\App\Models\ProductDownload::create([
 'post_id' => 123,
 'product_variation_id' => [1, 2],
 'download_identifier' => 'unique-id-123',
 'title' => 'Product Manual',
 'type' => 'pdf',
 'driver' => 'local',
 'file_name' => 'manual.pdf',
 'file_path' => '/uploads/manual.pdf',
 'file_size' => 1024000,
 'settings' => ['access_limit' => 5, 'expiry_days' => 30]
]);```

### Get Download Permissions [](#get-download-permissions)
php
```
$download = FluentCart\App\Models\ProductDownload::find(1);
$permissions = $download->download_permissions;

foreach ($permissions as $permission) {
 echo "Customer: " . $permission->customer_id;
 echo "Downloads Used: " . $permission->download_count;
}```

### Get Signed Download URL [](#get-signed-download-url)
php
```
$download = FluentCart\App\Models\ProductDownload::find(1);
$signedUrl = $download->getSignedDownloadUrl();
// Use this URL for secure download access```

### Get Downloads by Type [](#get-downloads-by-type)
php
```
$pdfDownloads = FluentCart\App\Models\ProductDownload::where('type', 'pdf')->get();
$zipDownloads = FluentCart\App\Models\ProductDownload::where('type', 'zip')->get();```

---

## Subscription

Source: https://dev.fluentcart.com/database/models/subscription.html


| DB Table Name | {wp_db_prefix}_fct_subscriptions | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-subscriptions-table) | 
| Source File | fluent-cart/app/Models/Subscription.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\Subscription | 
## Traits [](#traits)

| Trait | Provides | 
| --- | --- |
| `HasActivity` | `activities()` morphMany relationship to `Activity` model | 
| `CanUpdateBatch` | `scopeBatchUpdate` scope for bulk-updating rows in one query | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| uuid | String | Unique identifier (auto-generated on create via `md5(time() . wp_generate_uuid4())`) | 
| customer_id | Integer | Customer ID | 
| parent_order_id | Integer | Parent order ID | 
| product_id | Integer | Product ID | 
| item_name | String | Item name | 
| variation_id | Integer | Product variation ID | 
| billing_interval | String | Billing interval (daily, weekly, monthly, quarterly, half_yearly, yearly) | 
| signup_fee | Integer | Signup fee in cents | 
| quantity | Integer | Quantity | 
| recurring_amount | Integer | Recurring amount in cents | 
| recurring_tax_total | Integer | Recurring tax total in cents | 
| recurring_total | Integer | Recurring total in cents | 
| bill_times | Integer | Number of times to bill (0 = unlimited) | 
| bill_count | Integer | Number of times billed | 
| expire_at | Date Time | Expiration date | 
| trial_ends_at | Date Time | Trial end date | 
| canceled_at | Date Time | Cancellation date | 
| restored_at | Date Time | Restoration date | 
| collection_method | String | Collection method | 
| trial_days | Integer | Trial days | 
| vendor_customer_id | String | Vendor customer ID | 
| vendor_plan_id | String | Vendor plan ID | 
| vendor_subscription_id | String | Vendor subscription ID | 
| next_billing_date | Date Time | Next billing date | 
| status | String | Subscription status | 
| original_plan | JSON | Original plan data | 
| vendor_response | JSON | Vendor response data | 
| current_payment_method | String | Current payment method | 
| config | JSON | Subscription configuration (auto-encoded/decoded) | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Appended Attributes [](#appended-attributes)

These virtual attributes are automatically appended when the model is serialized to an array or JSON.

| Attribute | Type | Description | 
| --- | --- | --- |
| url | String | Remote subscription URL from payment gateway (via `fluent_cart/subscription/url_{method}` filter) | 
| payment_info | String | Human-readable subscription billing summary (interval, amount, trial) | 
| billingInfo | Array | Active payment method details from subscription meta | 
| overridden_status | String | Display-corrected status (handles simulated trial days and actual trial period detection) | 
| currency | String | Uppercase currency code (from config or store settings fallback) | 
| reactivate_url | String | Frontend URL for reactivating a canceled/expired subscription | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);

$subscription->id; // returns subscription ID
$subscription->status; // returns subscription status
$subscription->recurring_total; // returns recurring total in cents
$subscription->billing_interval; // returns billing interval
$subscription->next_billing_date; // returns next billing date
$subscription->currency; // returns currency code (appended attribute)
$subscription->url; // returns remote subscription URL (appended attribute)
$subscription->overridden_status; // returns display-corrected status (appended attribute)```

## Scopes [](#scopes)

### scopeBatchUpdate (via CanUpdateBatch trait) [](#scopebatchupdate-via-canupdatebatch-trait)

Perform a bulk update of multiple rows in a single query.

- Parameters: `$query` (Builder), `$values` (Array) - Array of row data to update, `$index` (String|null) - Column to match on (defaults to primary key)
php
```
use FluentCart\App\Models\Subscription;

Subscription::batchUpdate([
 ['id' => 1, 'status' => 'active'],
 ['id' => 2, 'status' => 'canceled'],
]);```

## Methods [](#methods)

Along with Global Model methods, this model has the following helper methods.
### getConfigAttribute($value) [](#getconfigattribute-value)

Get subscription configuration. Automatically decodes JSON strings to arrays.

- Parameters: `$value` (String|Array|null) - Raw config value from database
- Returns `Array` - Decoded configuration array
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$config = $subscription->config; // returns configuration array```

### setConfigAttribute($value) [](#setconfigattribute-value)

Set subscription configuration. Automatically encodes arrays to JSON.

- Parameters: `$value` (Array|Mixed) - Configuration array (non-array values default to `[]`)
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$subscription->config = ['custom_field' => 'value'];```

### getUrlAttribute($value) [](#geturlattribute-value)

Get the remote subscription URL from the payment gateway.

- Parameters: `$value` (String) - URL value
- Returns `String` - Subscription URL (filtered via `fluent_cart/subscription/url_{payment_method}`)
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$url = $subscription->url; // returns subscription URL```

### getOverriddenStatusAttribute($value) [](#getoverriddenstatusattribute-value)

Get the display-corrected subscription status. Handles two cases:

- If trial days were simulated (e.g., via discount/proration) and status is `trialing`, returns `active` instead.
- If trial days exist but status is `active` and the subscription is still within the trial period, returns `trialing` instead.

- Parameters: `$value` (String) - Status value
- Returns `String` - Overridden status
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$status = $subscription->overridden_status; // returns overridden status```

### getBillingInfoAttribute($value) [](#getbillinginfoattribute-value)

Get billing information from the `active_payment_method` subscription meta entry.

- Parameters: `$value` (String) - Billing info value
- Returns `Array` - Billing information (e.g., card brand, last 4 digits)
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$billingInfo = $subscription->billingInfo; // returns billing info array```

### getCurrencyAttribute() [](#getcurrencyattribute)

Get subscription currency. Reads from `config.currency` first, falls back to store currency settings.

- Returns `String` - Uppercase currency code (e.g., `USD`, `EUR`)
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$currency = $subscription->currency; // returns currency code```

### getPaymentInfoAttribute() [](#getpaymentinfoattribute)

Get a human-readable subscription billing summary string (interval, recurring total, trial days).

- Returns `String` - Payment information summary
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$paymentInfo = $subscription->payment_info; // returns payment info string```

### getReactivateUrlAttribute() [](#getreactivateurlattribute)

Get the frontend reactivation URL. Returns empty string if the subscription cannot be reactivated.

- Returns `String` - Reactivation URL or empty string
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$reactivateUrl = $subscription->reactivate_url; // returns reactivation URL```

### getPaymentMethodText() [](#getpaymentmethodtext)

Get a formatted payment method display string (e.g., "Visa ***4242").

- Returns `String` - Payment method text (brand + last 4 digits), or the method name if card details are unavailable
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$paymentMethodText = $subscription->getPaymentMethodText();```

### getMeta($metaKey, $default = null) [](#getmeta-metakey-default-null)

Get a subscription meta value by key from the `fct_subscription_meta` table.

- Parameters: `$metaKey` (String) - Meta key, `$default` (Mixed) - Default value if not found
- Returns `Mixed` - Meta value or default
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$metaValue = $subscription->getMeta('custom_field', 'default');```

### updateMeta($metaKey, $metaValue) [](#updatemeta-metakey-metavalue)

Create or update a subscription meta entry. If the key already exists, it updates the value; otherwise, it creates a new row.

- Parameters: `$metaKey` (String) - Meta key, `$metaValue` (Mixed) - Meta value
- Returns `Boolean` - Always returns true
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$subscription->updateMeta('custom_field', 'new_value');```

### addLog($title, $description = '', $type = 'info', $by = '') [](#addlog-title-description-type-info-by)

Add an activity log entry for this subscription.

- Parameters: 

 - `$title` (String) - Log title
 - `$description` (String) - Log description (default: `''`)
 - `$type` (String) - Log type, e.g., `info`, `error` (default: `'info'`)
 - `$by` (String) - Created-by identifier (default: `''`)

php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$subscription->addLog('Status Changed', 'Subscription activated', 'info');
$subscription->addLog('Payment Failed', 'Card declined', 'error', 'system');```

### getDownloads() [](#getdownloads)

Get downloadable files associated with this subscription's product. Only returns downloads when the subscription has a `variation_id` and status is `active`. Filters downloads by the subscription's variation ID.

- Returns `Collection|Array` - Collection of `ProductDownload` models with product and variation titles, or empty array
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$downloads = $subscription->getDownloads();```

### getLatestTransaction() [](#getlatesttransaction)

Get the most recent charge transaction for this subscription.

- Returns `FluentCart\App\Models\OrderTransaction|null` - Latest charge transaction or null
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$transaction = $subscription->getLatestTransaction();```

### canUpgrade() [](#canupgrade)

Check if the subscription can be upgraded. Requires a `variant_upgrade_path` meta entry for the current variation and the subscription must be `active` or `trialing`.

- Returns `Boolean` - True if upgrade path exists and status allows it
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$canUpgrade = $subscription->canUpgrade();```

### canUpdatePaymentMethod() [](#canupdatepaymentmethod)

Check if the payment method can be updated (card update). The current payment gateway must support the `card_update` feature and the subscription must be in one of the allowed statuses: `active`, `trialing`, `paused`, `intended`, `past_due`, `failing`, or `expiring`.

- Returns `Boolean` - True if payment method can be updated
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$canUpdate = $subscription->canUpdatePaymentMethod();```

### canSwitchPaymentMethod() [](#canswitchpaymentmethod)

Check if the payment method can be switched to a different gateway entirely. The current gateway must support the `switch_payment_method` feature, and the subscription must be `active`, `trialing`, or `paused`.

- Returns `Boolean` - True if payment method can be switched
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$canSwitch = $subscription->canSwitchPaymentMethod();```

### switchablePaymentMethods() [](#switchablepaymentmethods)

Get the list of payment gateways that can be switched to from the current gateway.

- Returns `Array` - Array of supported gateway identifiers, or empty array if switching is not supported
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$methods = $subscription->switchablePaymentMethods();
// e.g., ['stripe', 'paypal']```

### canReactive() [](#canreactive)

Check if the subscription can be reactivated. Returns empty string (falsy) if:

- FluentCart Pro is not active
- The subscription was upgraded to another subscription
- The recurring amount is zero or negative
- The cancellation reason is `refunded`

Otherwise checks if status is one of: `canceled`, `failing`, `expired`, `paused`, `expiring`, or `past_due`.

- Returns `Mixed` - Filtered boolean/string value (empty string if cannot reactivate, truthy if can). Result is filtered via `fluent_cart/subscription/can_reactivate`.
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
if ($subscription->canReactive()) {
 // subscription can be reactivated
}```

### getReactivateUrl() [](#getreactivateurl)

Get the frontend URL for reactivating a canceled or expired subscription. Returns empty string if the subscription cannot be reactivated.

- Returns `String` - Reactivation URL with `fluent-cart=reactivate-subscription` query parameter, or empty string
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$reactivateUrl = $subscription->getReactivateUrl();```

### getViewUrl($type = 'customer') [](#getviewurl-type-customer)

Get the subscription view URL for the customer portal or admin dashboard.

- Parameters: `$type` (String) - View type: `'customer'` (default) for the customer portal, or `'admin'` for the admin dashboard
- Returns `String` - View URL
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$customerUrl = $subscription->getViewUrl(); // customer portal URL
$adminUrl = $subscription->getViewUrl('admin'); // admin dashboard URL```

### hasAccessValidity() [](#hasaccessvalidity)

Check if the subscription currently grants access. Returns true for `active`, `trialing`, and `completed` statuses. Returns false for `expired`, `past_due`, `intended`, and `pending`. For other statuses (e.g., `canceled`, `failing`, `paused`, `expiring`), checks whether the next billing date (or guessed billing date) is still in the future.

- Returns `Boolean` - True if the subscription has valid access
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$hasAccess = $subscription->hasAccessValidity();```

### reSyncFromRemote() [](#resyncfromremote)

Re-sync subscription data from the remote payment gateway. The gateway must support the `subscriptions` feature.

- Returns `Mixed` - Sync result from the gateway, or `WP_Error` if the payment method does not support remote resync
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$result = $subscription->reSyncFromRemote();
if (is_wp_error($result)) {
 // handle error
}```

### cancelRemoteSubscription($args = []) [](#cancelremotesubscription-args)

Cancel the subscription both remotely (at the payment gateway) and locally. Updates the status to `canceled`, sets `canceled_at`, stores the cancellation reason in config, and dispatches the `SubscriptionCanceled` event.

- Parameters: `$args` (Array) - Cancellation arguments: 

 - `reason` (String) - Cancellation reason (stored in config, default: `''`)
 - `fire_hooks` (Boolean) - Whether to dispatch the `SubscriptionCanceled` event (default: `true`)
 - `note` (String) - Cancellation note (saved to order, default: `''`)

- Returns `Array|WP_Error` - Array with `subscription` and `vendor_result` keys on success
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$result = $subscription->cancelRemoteSubscription([
 'reason' => 'Customer request',
 'fire_hooks' => true,
 'note' => 'Cancelled by customer'
]);```

### getCurrentRenewalAmount() [](#getcurrentrenewalamount)

Get the current renewal amount. Checks `config.current_renewal_amount` first (used when the renewal amount differs from the base recurring total, e.g., after a plan change), then falls back to `recurring_total`.

- Returns `Integer` - Current renewal amount in cents
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$amount = $subscription->getCurrentRenewalAmount();```

### getRequiredBillTimes() [](#getrequiredbilltimes)

Get the number of remaining billing cycles. If `bill_times` is 0, returns 0 (unlimited). If the calculated remaining count is zero or negative, it re-verifies against actual successful transactions and early payment history, correcting `bill_count` if needed. Returns -1 if billing is truly complete after verification.

- Returns `Integer` - Remaining bill times (0 = unlimited, -1 = completed)
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$billTimes = $subscription->getRequiredBillTimes();```

### getReactivationTrialDays() [](#getreactivationtrialdays)

Get the number of trial days to apply when reactivating this subscription. If the subscription still has valid access (i.e., the billing period has not fully elapsed), the remaining days are returned as trial days so the customer is not double-charged.

- Returns `Integer` - Number of trial days for reactivation (0 if no remaining validity)
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$trialDays = $subscription->getReactivationTrialDays();```

### guessNextBillingDate($forced = false) [](#guessnextbillingdate-forced-false)

Calculate the next billing date when it is not already set (or when forced). Uses the last successful order's creation date plus the billing interval. For initial orders with trial days, adds trial days instead.

- Parameters: `$forced` (Boolean) - Force recalculation even if `next_billing_date` is already set (default: `false`)
- Returns `String` - Next billing date in `Y-m-d H:i:s` GMT format
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$nextBillingDate = $subscription->guessNextBillingDate();
$forcedDate = $subscription->guessNextBillingDate(true); // force recalculation```

### checkAndExpireSubscriptions($batchSize = 100) (static) [](#checkandexpiresubscriptions-batchsize-100-static)

Check and expire subscriptions that have missed payments beyond their grace period. Called by the hourly scheduler. Processes `active`, `trialing`, and `canceled` subscriptions whose `next_billing_date` is past the grace period threshold. Grace periods vary by billing interval (e.g., 1 day for daily, 3 for weekly, 7 for monthly, 15 for quarterly/half_yearly/yearly).
For active/trialing subscriptions, status is changed to `expired`. For canceled subscriptions, only `next_billing_date` is cleared (status remains canceled). Dispatches `SubscriptionValidityExpired` event for each affected subscription.

- Parameters: `$batchSize` (Integer) - Number of subscriptions to process per batch (default: `100`)
- Returns `Array` - Statistics with keys: `checked`, `validity_expired`, `batches`
php
```
use FluentCart\App\Models\Subscription;

$stats = Subscription::checkAndExpireSubscriptions(50);
// $stats = ['checked' => 200, 'validity_expired' => 5, 'batches' => 4]```

## Relations [](#relations)

This model has the following relationships that you can use.
### meta [](#meta)

Access the subscription metadata.

- Relation type: `HasMany`
- Returns `Collection` of `FluentCart\App\Models\SubscriptionMeta`
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$meta = $subscription->meta;```

### customer [](#customer)

Access the customer.

- Relation type: `BelongsTo`
- Foreign key: `customer_id`
- Returns `FluentCart\App\Models\Customer`
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$customer = $subscription->customer;```

### product [](#product)

Access the product.

- Relation type: `BelongsTo`
- Foreign key: `product_id` -> `ID`
- Returns `FluentCart\App\Models\Product`
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$product = $subscription->product;```

### variation [](#variation)

Access the product variation.

- Relation type: `BelongsTo`
- Foreign key: `variation_id`
- Returns `FluentCart\App\Models\ProductVariation`
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$variation = $subscription->variation;```

### labels [](#labels)

Access the subscription labels.

- Relation type: `MorphMany`
- Returns `Collection` of `FluentCart\App\Models\LabelRelationship`
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$labels = $subscription->labels;```

### license [](#license)

Access the subscription license (single). Only available when FluentCart Pro with the Licensing module is active.

- Relation type: `HasOne` (nullable -- returns `null` if `License` class does not exist)
- Returns `FluentCartPro\App\Modules\Licensing\Models\License|null`
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$license = $subscription->license;```

### licenses [](#licenses)

Access all subscription licenses. Only available when FluentCart Pro with the Licensing module is active.

- Relation type: `HasMany` (nullable -- returns `null` if `License` class does not exist)
- Returns `Collection` of `FluentCartPro\App\Modules\Licensing\Models\License|null`
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$licenses = $subscription->licenses;```

### transactions [](#transactions)

Access the subscription transactions.

- Relation type: `HasMany`
- Returns `Collection` of `FluentCart\App\Models\OrderTransaction`
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$transactions = $subscription->transactions;```

### billing_addresses [](#billing-addresses)

Access the billing addresses for the subscription's customer.

- Relation type: `HasMany` (scoped to `type = 'billing'`)
- Foreign key: `customer_id` -> `customer_id`
- Returns `Collection` of `FluentCart\App\Models\CustomerAddresses`
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$addresses = $subscription->billing_addresses;```

### product_detail [](#product-detail)

Access the product detail (variation details).

- Relation type: `BelongsTo`
- Foreign key: `variation_id` -> `id`
- Returns `FluentCart\App\Models\ProductDetail`
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$productDetail = $subscription->product_detail;```

### order [](#order)

Access the parent order.

- Relation type: `BelongsTo`
- Foreign key: `parent_order_id` -> `id`
- Returns `FluentCart\App\Models\Order`
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$order = $subscription->order;```

### activities (via HasActivity trait) [](#activities-via-hasactivity-trait)

Access the activity logs for this subscription.

- Relation type: `MorphMany` (ordered by `created_at DESC`, `id DESC`)
- Returns `Collection` of `FluentCart\App\Models\Activity`
php
```
$subscription = FluentCart\App\Models\Subscription::find(1);
$activities = $subscription->activities;```

## Usage Examples [](#usage-examples)

### Creating a Subscription [](#creating-a-subscription)
php
```
use FluentCart\App\Models\Subscription;

$subscription = Subscription::create([
 'customer_id' => 1,
 'parent_order_id' => 1,
 'product_id' => 1,
 'variation_id' => 1,
 'billing_interval' => 'monthly',
 'recurring_total' => 2999, // $29.99 in cents
 'status' => 'active'
]);
// uuid is auto-generated on create```

### Retrieving Subscriptions [](#retrieving-subscriptions)
php
```
// Get subscription by ID
$subscription = Subscription::find(1);

// Get subscription with customer and product
$subscription = Subscription::with(['customer', 'product'])->find(1);

// Get active subscriptions
$subscriptions = Subscription::where('status', 'active')->get();```

### Updating a Subscription [](#updating-a-subscription)
php
```
$subscription = Subscription::find(1);
$subscription->status = 'cancelled';
$subscription->canceled_at = gmdate('Y-m-d H:i:s');
$subscription->save();```

### Deleting a Subscription [](#deleting-a-subscription)
php
```
$subscription = Subscription::find(1);
$subscription->delete();```

---

## SubscriptionMeta

Source: https://dev.fluentcart.com/database/models/subscription-meta.html


| DB Table Name | {wp_db_prefix}_fct_subscription_meta | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-subscription-meta-table) | 
| Source File | fluent-cart/app/Models/SubscriptionMeta.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\SubscriptionMeta | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| subscription_id | Integer | Reference to subscription | 
| meta_key | String | Meta key name | 
| meta_value | Text | Meta value (JSON encoded for arrays/objects, auto-encoded/decoded via mutator/accessor) | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$subscriptionMeta = FluentCart\App\Models\SubscriptionMeta::find(1);

$subscriptionMeta->id; // returns id
$subscriptionMeta->subscription_id; // returns subscription ID
$subscriptionMeta->meta_key; // returns meta key
$subscriptionMeta->meta_value; // returns meta value (auto-decoded if JSON)```

## Relations [](#relations)

This model has the following relationships that you can use
### product_detail [](#product-detail)

Access the associated subscription (BelongsTo via `subscription_id` -> `id`).
Note
Despite the name `product_detail`, this relationship returns a `Subscription` model, not a `Product` model. This is a legacy naming convention.

- return `FluentCart\App\Models\Subscription` Model (BelongsTo)

#### Example: [](#example)
php
```
// Accessing Subscription
$subscription = $subscriptionMeta->product_detail;

// For Filtering by subscription relationship
$subscriptionMetas = FluentCart\App\Models\SubscriptionMeta::whereHas('product_detail', function($query) {
 $query->where('status', 'active');
})->get();```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### setMetaValueAttribute($value) [](#setmetavalueattribute-value)

Set meta value with automatic JSON encoding (mutator). Arrays and objects are encoded with `JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES` flags.

- Parameters 

 - `$value` - mixed (array, object, or string)

- Returns `void`

#### Usage [](#usage-1)
php
```
$subscriptionMeta->meta_value = ['custom_data' => 'value', 'settings' => ['key' => 'value']];
// Automatically JSON encodes arrays and objects```

### getMetaValueAttribute($value) [](#getmetavalueattribute-value)

Get meta value with automatic JSON decoding (accessor). If the stored string is valid JSON, it returns the decoded array. Otherwise, returns the raw string value.

- Parameters 

 - `$value` - mixed

- Returns `mixed` (decoded array if valid JSON, otherwise original value)

#### Usage [](#usage-2)
php
```
$metaValue = $subscriptionMeta->meta_value; // Returns decoded value (array, object, or string)```

## Usage Examples [](#usage-examples)

### Get Subscription Meta [](#get-subscription-meta)
php
```
$subscription = FluentCart\App\Models\Subscription::find(123);
$meta = $subscription->subscription_meta;

foreach ($meta as $metaItem) {
 echo "Key: " . $metaItem->meta_key;
 echo "Value: " . print_r($metaItem->meta_value, true);
}```

### Create Subscription Meta [](#create-subscription-meta)
php
```
$subscriptionMeta = FluentCart\App\Models\SubscriptionMeta::create([
 'subscription_id' => 123,
 'meta_key' => 'custom_field',
 'meta_value' => 'custom_value'
]);```

### Store Complex Subscription Data [](#store-complex-subscription-data)
php
```
$subscriptionMeta = FluentCart\App\Models\SubscriptionMeta::create([
 'subscription_id' => 123,
 'meta_key' => 'subscription_settings',
 'meta_value' => [
 'auto_renew' => true,
 'payment_reminder_days' => 7,
 'grace_period_days' => 3,
 'notifications' => ['email' => true, 'sms' => false]
 ]
]);```

### Get Meta by Key [](#get-meta-by-key)
php
```
$meta = FluentCart\App\Models\SubscriptionMeta::where('subscription_id', 123)
 ->where('meta_key', 'subscription_settings')
 ->first();

if ($meta) {
 echo "Settings: " . print_r($meta->meta_value, true);
}```

### Update Meta Value [](#update-meta-value)
php
```
$meta = FluentCart\App\Models\SubscriptionMeta::find(1);
$meta->meta_value = ['updated' => true, 'timestamp' => now()];
$meta->save();```

### Get All Meta for Subscription [](#get-all-meta-for-subscription)
php
```
$subscriptionMetas = FluentCart\App\Models\SubscriptionMeta::where('subscription_id', 123)->get();```

### Get Subscription Settings [](#get-subscription-settings)
php
```
$settings = FluentCart\App\Models\SubscriptionMeta::where('subscription_id', 123)
 ->where('meta_key', 'subscription_settings')
 ->first();

if ($settings) {
 $autoRenew = $settings->meta_value['auto_renew'] ?? false;
 $gracePeriod = $settings->meta_value['grace_period_days'] ?? 0;
}```

---

## Cart

Source: https://dev.fluentcart.com/database/models/cart.html


| DB Table Name | {wp_db_prefix}_fct_carts | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-carts-table) | 
| Source File | fluent-cart/app/Models/Cart.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\Cart | 
## Primary Key [](#primary-key)

The Cart model uses `cart_hash` (a string) as its primary key instead of the usual auto-incrementing `id`. The model sets `$incrementing = false` to reflect this. When creating a new Cart without providing a `cart_hash`, the `boot()` method auto-generates one using `md5('fct_global_cart_' . wp_generate_uuid4() . time())`.
## Traits [](#traits)

- **CanSearch** - Adds search scope capabilities to the model.

## Hidden Attributes [](#hidden-attributes)

The following attributes are hidden from array/JSON serialization: `order_id`, `customer_id`, `user_id`.
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| cart_hash | String | Primary Key (non-incrementing) - Unique cart hash, auto-generated on creation | 
| customer_id | Integer | Customer ID (nullable, hidden) | 
| user_id | Integer | WordPress user ID (nullable, hidden) | 
| order_id | Integer | Associated order ID (nullable, hidden) | 
| checkout_data | JSON | Checkout data (auto JSON encoded/decoded via accessor/mutator) | 
| cart_data | JSON | Cart items data (auto JSON encoded/decoded via accessor/mutator, loads bundle children on read) | 
| utm_data | JSON | UTM tracking data (auto JSON encoded/decoded via accessor/mutator) | 
| coupons | JSON | Applied coupon codes (auto JSON encoded/decoded via accessor/mutator) | 
| first_name | String | Customer first name | 
| last_name | String | Customer last name | 
| email | String | Customer email | 
| stage | String | Cart stage (e.g. `completed`) | 
| cart_group | String | Cart group identifier | 
| user_agent | Text | User agent string | 
| ip_address | String | Customer IP address | 
| completed_at | Date Time | Completion timestamp | 
| deleted_at | Date Time | Soft delete timestamp | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');

$cart->cart_hash; // returns cart hash (primary key)
$cart->customer_id; // returns customer ID
$cart->cart_data; // returns decoded cart items array (with bundle children loaded)
$cart->checkout_data; // returns decoded checkout data array
$cart->coupons; // returns decoded coupon codes array
$cart->utm_data; // returns decoded UTM data array```

## Methods [](#methods)

Along with Global Model methods, this model has the following helper methods.
### Attribute Accessors / Mutators [](#attribute-accessors-mutators)

#### setCheckoutDataAttribute($settings) [](#setcheckoutdataattribute-settings)

Set checkout data with JSON encoding.

- Parameters: `$settings` (Array) - Checkout settings
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$cart->checkout_data = ['shipping_method' => 'standard'];```

#### getCheckoutDataAttribute($settings) [](#getcheckoutdataattribute-settings)

Get checkout data with JSON decoding. Returns an empty array if value is falsy or not valid JSON.

- Parameters: `$settings` (String) - Raw JSON settings from database
- Returns `Array` - Decoded checkout data
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$checkoutData = $cart->checkout_data; // returns array```

#### setCouponsAttribute($coupons) [](#setcouponsattribute-coupons)

Set coupons with JSON encoding. Non-array values are reset to an empty array.

- Parameters: `$coupons` (Array) - Coupon codes
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$cart->coupons = ['SAVE10', 'WELCOME20'];```

#### getCouponsAttribute($coupons) [](#getcouponsattribute-coupons)

Get coupons with JSON decoding. Returns an empty array if value is falsy or not valid JSON.

- Parameters: `$coupons` (String) - Raw JSON coupons from database
- Returns `Array` - Decoded coupon codes
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$coupons = $cart->coupons; // returns array```

#### setCartDataAttribute($settings) [](#setcartdataattribute-settings)

Set cart data with JSON encoding. Also invalidates the internal static cache for this cart.

- Parameters: `$settings` (Array) - Cart item data
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$cart->cart_data = [['product_id' => 1, 'quantity' => 2]];```

#### getCartDataAttribute($data) [](#getcartdataattribute-data)

Get cart data with JSON decoding. Uses an internal static cache keyed by `cart_hash` for performance. Automatically loads bundle child items via `Helper::loadBundleChild()`.

- Parameters: `$data` (String) - Raw JSON data from database
- Returns `Array` - Decoded cart data with bundle children resolved
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$cartData = $cart->cart_data; // returns array with bundle children loaded```

#### setUtmDataAttribute($utmData) [](#setutmdataattribute-utmdata)

Set UTM data with JSON encoding.

- Parameters: `$utmData` (Array) - UTM data
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$cart->utm_data = ['utm_source' => 'google', 'utm_campaign' => 'summer'];```

#### getUtmDataAttribute($utmData) [](#getutmdataattribute-utmdata)

Get UTM data with JSON decoding. Returns an empty array if value is falsy.

- Parameters: `$utmData` (String) - Raw JSON UTM data from database
- Returns `Array` - Decoded UTM data
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$utmData = $cart->utm_data; // returns array```

### Cart State Methods [](#cart-state-methods)

#### isLocked() [](#islocked)

Check if cart is locked. A cart is locked when `checkout_data.is_locked` is `'yes'` AND the cart has an associated `order_id`.

- Returns `Boolean` - True if cart is locked
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$isLocked = $cart->isLocked();```

#### isZeroPayment() [](#iszeropayment)

Check if the cart has a zero payment amount and does not contain subscription items. Useful for determining if payment processing can be skipped.

- Returns `Boolean` - True if estimated total is zero and no subscription items exist
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
if ($cart->isZeroPayment()) {
 // No payment processing needed
}```

#### isShipToDifferent() [](#isshiptodifferent)

Check if the customer has opted to ship to a different address than the billing address.

- Returns `Boolean` - True if `checkout_data.form_data.ship_to_different` is `'yes'`
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
if ($cart->isShipToDifferent()) {
 // Use separate shipping address
}```

#### hasSubscription() [](#hassubscription)

Check if cart contains any subscription items by inspecting `other_info.payment_type` in each cart data item.

- Returns `Boolean` - True if any item has a `subscription` payment type
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$hasSubscription = $cart->hasSubscription();```

#### requireShipping() [](#requireshipping)

Check if cart requires shipping by inspecting `fulfillment_type` in each cart data item.

- Returns `Boolean` - True if any item has a `physical` fulfillment type
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$requiresShipping = $cart->requireShipping();```

### Cart Item Methods [](#cart-item-methods)

#### addItem($item = [], $replacingIndex = null) [](#additem-item-replacingindex-null)

Add an item to the cart. If the cart is locked, returns a `WP_Error`. If `$replacingIndex` is provided and exists, replaces that item; otherwise appends the item. Saves the cart, re-validates coupons, and fires `fluent_cart/cart/item_added` and `fluent_cart/cart/cart_data_items_updated` actions.

- Parameters: 

 - `$item` (Array) - Cart item data
 - `$replacingIndex` (Integer|null) - Index of existing item to replace

- Returns `FluentCart\App\Models\Cart|WP_Error` - Cart instance or error if locked
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$cart->addItem(['product_id' => 1, 'quantity' => 2]);```

#### removeItem($variationId, $extraArgs = [], $triggerEvent = true) [](#removeitem-variationid-extraargs-triggerevent-true)

Remove an item from the cart by variation ID. Uses `findExistingItemAndIndex()` to locate the item. If the cart is locked, returns a `WP_Error`. When `$triggerEvent` is true, re-validates coupons and fires `fluent_cart/cart/item_removed`; otherwise fires `fluent_cart/checkout/cart_amount_updated`. Always fires `fluent_cart/cart/cart_data_items_updated`.

- Parameters: 

 - `$variationId` (Integer) - Variation/object ID to remove
 - `$extraArgs` (Array) - Additional matching arguments for identifying the item
 - `$triggerEvent` (Boolean) - Whether to trigger item_removed event (default: true)

- Returns `FluentCart\App\Models\Cart|WP_Error` - Cart instance or error if locked
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$cart->removeItem(1, [], true);```

#### addByVariation(ProductVariation $variation, $config = []) [](#addbyvariation-productvariation-variation-config)

Add a product variation to the cart with full business logic. Handles quantity adjustments, existing item replacement, promotional price locking, stock validation, and purchase eligibility checks via `canPurchase()`. Uses `CartHelper::generateCartItemFromVariation()` to build the cart item. If quantity is 0, removes the item instead.

- Parameters: 

 - `$variation` (ProductVariation) - Product variation model instance
 - `$config` (Array) - Configuration options: 

 - `quantity` (int) - Desired quantity (default: 1; 0 removes the item)
 - `by_input` (bool) - If true, sets quantity directly instead of incrementing
 - `will_validate` (bool) - If true, runs stock/purchase validation
 - `replace` (bool) - If true, removes existing item before adding
 - `remove_args` (array) - Extra args for matching when removing
 - `matched_args` (array) - Extra args for matching existing items
 - `other_info` (array) - Additional info merged into item's `other_info`

- Returns `FluentCart\App\Models\Cart|WP_Error` - Cart instance or error
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$variation = FluentCart\App\Models\ProductVariation::find(1);
$cart->addByVariation($variation, ['quantity' => 2, 'will_validate' => true]);```

#### addByCustom(array $variation, array $config = []) [](#addbycustom-array-variation-array-config)

Add a custom (non-standard) item to the cart. Normalizes the item via `CartHelper::normalizeCustomFields()`, validates required fields (`id`, `object_id`, `post_id`, `post_title`, `price`, `unit_price`, `payment_type`), and rejects subscription items (which must use direct checkout). Uses `CartHelper::generateCartItemCustomItem()` to build the cart item.

- Parameters: 

 - `$variation` (Array) - Custom item data with required fields
 - `$config` (Array) - Configuration options: 

 - `quantity` (int) - Desired quantity (default: 1; 0 removes the item)
 - `remove_args` (array) - Extra args for matching when removing
 - `matched_args` (array) - Extra args for matching existing items

- Returns `FluentCart\App\Models\Cart|WP_Error` - Cart instance or error
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$cart->addByCustom([
 'id' => 100,
 'object_id' => 100,
 'post_id' => 50,
 'post_title' => 'Custom Item',
 'price' => 1500,
 'unit_price' => 1500,
 'payment_type' => 'one_time',
], ['quantity' => 1]);```

#### findExistingItemAndIndex($objectId, $extraArgs = []) [](#findexistingitemandindex-objectid-extraargs)

Find an existing cart item and its index by `object_id`. Optionally matches additional arguments against the item using dot-notation keys.

- Parameters: 

 - `$objectId` (Integer) - The object ID to search for
 - `$extraArgs` (Array) - Additional key-value pairs to match against the item

- Returns `Array|null` - `[$index, $item]` tuple if found, or null
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$result = $cart->findExistingItemAndIndex(100, ['other_info.color' => 'red']);
if ($result) {
 [$index, $item] = $result;
}```

### Coupon Methods [](#coupon-methods)

#### applyCoupon($codes = []) [](#applycoupon-codes)

Apply coupon codes to the cart. If the cart is locked, returns a `WP_Error`. Creates a `DiscountService` instance to calculate discounts, updates `cart_data`, `coupons`, and `checkout_data.__per_coupon_discounts`, then saves. Fires `fluent_cart/checkout/cart_amount_updated` and `fluent_cart/cart/cart_data_items_updated` actions.

- Parameters: `$codes` (Array) - Coupon codes to apply
- Returns `Mixed` - Discount service result or `WP_Error` if locked/invalid
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$result = $cart->applyCoupon(['SAVE10', 'WELCOME20']);```

#### removeCoupon($removeCodes = []) [](#removecoupon-removecodes)

Remove specific coupon codes from the cart. Accepts a single code string or an array. Re-validates remaining coupons via `DiscountService` and updates `cart_data`, `coupons`, and `checkout_data.__per_coupon_discounts`. If the cart is locked, returns a `WP_Error`.

- Parameters: `$removeCodes` (Array|String) - Coupon code(s) to remove
- Returns `FluentCart\App\Models\Cart|WP_Error` - Cart instance or error if locked
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$cart->removeCoupon(['SAVE10']);```

#### reValidateCoupons() [](#revalidatecoupons)

Re-validate all currently applied coupons against the current cart state. Recalculates discounts via `DiscountService`, updates `cart_data`, `coupons`, and `checkout_data.__per_coupon_discounts`. Fires `fluent_cart/checkout/cart_amount_updated` and conditionally fires `fluent_cart/cart/cart_data_items_updated` if discount totals changed.

- Returns `FluentCart\App\Models\Cart|WP_Error` - Cart instance or error if locked
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$cart->reValidateCoupons();```

#### getDiscountLines($revalidate = false) [](#getdiscountlines-revalidate-false)

Get formatted discount line items for all applied coupons. Each line includes coupon ID, code, type, discount amount, formatted price HTML, and formatted title. When only one coupon is applied, sums `coupon_discount` from each cart item. When multiple coupons are applied, reads per-coupon breakdowns from `checkout_data.__per_coupon_discounts`.

- Parameters: `$revalidate` (Boolean) - If true, re-applies coupons before calculating (default: false)
- Returns `Array` - Associative array keyed by coupon code, each containing `id`, `code`, `type`, `discount`, `formatted_discount`, `actual_formatted_discount`, `formatted_title`
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$discountLines = $cart->getDiscountLines();
// Example output:
// ['SAVE10' => ['id' => 1, 'code' => 'SAVE10', 'discount' => 500, ...]]```

### Totals & Calculation Methods [](#totals-calculation-methods)

#### getShippingTotal() [](#getshippingtotal)

Get the shipping total for the cart. Returns 0 if the cart does not require shipping.

- Returns `Integer` - Shipping total in cents
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$shippingTotal = $cart->getShippingTotal();```

#### getItemsSubtotal() [](#getitemssubtotal)

Get the items subtotal (before discounts) by combining one-time and subscription items via `CheckoutService` and `OrderService::getItemsAmountWithoutDiscount()`.

- Returns `Integer` - Items subtotal in cents
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$subtotal = $cart->getItemsSubtotal();```

#### getEstimatedTotal($extraAmount = 0) [](#getestimatedtotal-extraamount-0)

Get the estimated cart total including item totals, shipping, and custom checkout adjustments. Combines one-time and subscription items via `CheckoutService`, calculates item totals via `OrderService::getItemsAmountTotal()`, adds shipping charges, handles custom checkout shipping amounts, and ensures the total is never negative. Applies the `fluent_cart/cart/estimated_total` filter.

- Parameters: `$extraAmount` (Integer) - Extra amount in cents to include (default: 0)
- Returns `Integer` - Estimated total in cents (minimum 0)
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$total = $cart->getEstimatedTotal(1000); // $10.00 extra```

#### getEstimatedRecurringTotal() [](#getestimatedrecurringtotal)

Get the estimated recurring total for subscription items only. Sums each subscription item's `subtotal` minus its `recurring_discounts.amount`.

- Returns `Integer` - Estimated recurring total in cents
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$recurringTotal = $cart->getEstimatedRecurringTotal();```

### Address Methods [](#address-methods)

#### getBillingAddress() [](#getbillingaddress)

Get the billing address from checkout form data.

- Returns `Array` - Associative array with keys: `full_name`, `company`, `address_1`, `address_2`, `city`, `state`, `postcode`, `country`
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$billing = $cart->getBillingAddress();
// ['full_name' => 'John Doe', 'company' => '', 'address_1' => '123 Main St', ...]```

#### getShippingAddress() [](#getshippingaddress)

Get the shipping address. If the customer opted to ship to a different address (`isShipToDifferent()`), returns the separate shipping address fields from form data. Otherwise, falls back to `getBillingAddress()`.

- Returns `Array` - Associative array with keys: `full_name`, `company`, `address_1`, `address_2`, `city`, `state`, `postcode`, `country`
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$shipping = $cart->getShippingAddress();```

### Customer Methods [](#customer-methods)

#### guessCustomer() [](#guesscustomer)

Attempt to find the associated customer by checking (in order): `customer_id`, `user_id`, then `email`. Returns the first matching `Customer` model found, or null if none match.

- Returns `FluentCart\App\Models\Customer|null` - Customer instance or null
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$customer = $cart->guessCustomer();```

### Action Hook Helper Methods [](#action-hook-helper-methods)

#### addDraftCreatedActions($hooks) [](#adddraftcreatedactions-hooks)

Build a response array for actions to execute after a draft order is created. Deduplicates the hooks array.

- Parameters: `$hooks` (Array) - Hook identifiers
- Returns `Array` - `['__after_draft_created_actions__' => [...]]`

#### addSuccessActions($hooks) [](#addsuccessactions-hooks)

Build a response array for actions to execute on successful checkout. Deduplicates the hooks array.

- Parameters: `$hooks` (Array) - Hook identifiers
- Returns `Array` - `['__on_success_actions__' => [...]]`

#### addCartNotices($notices) [](#addcartnotices-notices)

Build a response array for cart notices to display. Deduplicates by notice `id`.

- Parameters: `$notices` (Array) - Array of notice arrays, each with an `id` key
- Returns `Array` - `['__cart_notices' => [...]]`
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$actions = $cart->addSuccessActions(['redirect_to_thank_you', 'clear_cart']);
$notices = $cart->addCartNotices([
 ['id' => 'stock_warning', 'message' => 'Limited stock remaining']
]);```

## Relations [](#relations)

This model has the following relationships that you can use.
### customer [](#customer)

Access the associated customer (BelongsTo).

- Returns `FluentCart\App\Models\Customer`
- Foreign Key: `customer_id`
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$customer = $cart->customer;```

### order [](#order)

Access the associated order (BelongsTo).

- Returns `FluentCart\App\Models\Order`
- Foreign Key: `order_id`
php
```
$cart = FluentCart\App\Models\Cart::find('cart_hash_123');
$order = $cart->order;```

## Scopes [](#scopes)

This model has the following scopes that you can use.
### stageNotCompleted() [](#stagenotcompleted)

Get carts where the `stage` column is not `completed`.php
```
$carts = FluentCart\App\Models\Cart::stageNotCompleted()->get();```

## Usage Examples [](#usage-examples)

### Creating a Cart [](#creating-a-cart)

The `cart_hash` is auto-generated if not provided:php
```
use FluentCart\App\Models\Cart;

// Auto-generated cart_hash
$cart = Cart::create([
 'customer_id' => 1,
 'email' => '[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)',
]);

// Or with explicit cart_hash
$cart = Cart::create([
 'cart_hash' => 'unique_cart_hash_123',
 'customer_id' => 1,
 'email' => '[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)',
]);```

### Retrieving Carts [](#retrieving-carts)
php
```
// Get cart by hash (primary key)
$cart = Cart::find('cart_hash_123');

// Get carts that are not completed
$carts = Cart::stageNotCompleted()->get();

// Get cart with customer eager-loaded
$cart = Cart::with('customer')->find('cart_hash_123');```

### Working with Cart Items [](#working-with-cart-items)
php
```
$cart = Cart::find('cart_hash_123');

// Add by variation with validation
$variation = \FluentCart\App\Models\ProductVariation::find(1);
$cart->addByVariation($variation, [
 'quantity' => 2,
 'will_validate' => true,
]);

// Remove an item
$cart->removeItem($variation->id);

// Check totals
$subtotal = $cart->getItemsSubtotal();
$total = $cart->getEstimatedTotal();
$recurringTotal = $cart->getEstimatedRecurringTotal();```

### Working with Coupons [](#working-with-coupons)
php
```
$cart = Cart::find('cart_hash_123');

// Apply coupons
$result = $cart->applyCoupon(['SAVE10']);

// Get discount lines for display
$discountLines = $cart->getDiscountLines();

// Remove a coupon
$cart->removeCoupon(['SAVE10']);```

### Updating a Cart [](#updating-a-cart)
php
```
$cart = Cart::find('cart_hash_123');
$cart->email = '[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)';
$cart->save();```

### Deleting a Cart [](#deleting-a-cart)
php
```
$cart = Cart::find('cart_hash_123');
$cart->delete(); // Soft delete```

---

## Coupon

Source: https://dev.fluentcart.com/database/models/coupon.html


| DB Table Name | {wp_db_prefix}_fct_coupons | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-coupons-table) | 
| Source File | fluent-cart/app/Models/Coupon.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\Coupon | 
## Traits [](#traits)

| Trait | Description | 
| --- | --- |
| CanSearch | Provides `search()`, `whereLike()`, `whereBeginsWith()`, `whereEndsWith()`, and `groupSearch()` query scopes | 
| HasActivity | Provides the `activities()` polymorphic relationship to the Activity model | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer (BIGINT UNSIGNED) | Primary Key, auto-increment | 
| parent | Integer | Parent coupon ID | 
| title | String (VARCHAR 200) | Coupon title | 
| code | String (VARCHAR 50) | Coupon code (unique) | 
| status | String (VARCHAR 20) | Coupon status (active, inactive, expired) | 
| type | String (VARCHAR 20) | Coupon type (percentage, fixed) | 
| conditions | JSON | Coupon conditions (auto-encoded/decoded via mutator) | 
| amount | Double | Coupon amount (in cents for fixed, raw value for percentage) | 
| stackable | String (VARCHAR 3) | Whether coupon is stackable ('yes' or 'no', default 'no') | 
| priority | Integer | Coupon priority | 
| use_count | Integer | Number of times used (default 0) | 
| notes | Text (LONGTEXT) | Coupon notes | 
| show_on_checkout | String (VARCHAR 3) | Show on checkout page ('yes' or 'no', default 'yes') | 
| settings | JSON | Coupon settings (auto-encoded/decoded via mutator) | 
| other_info | JSON | Additional info like buy/get products (auto-encoded/decoded via mutator) | 
| categories | JSON | Category IDs for coupon applicability (auto-encoded/decoded via mutator) | 
| products | JSON | Product IDs for coupon applicability (auto-encoded/decoded via mutator, values cast to integer) | 
| start_date | Timestamp | Start date | 
| end_date | Timestamp | End date | 
| created_at | DateTime | Creation timestamp | 
| updated_at | DateTime | Last update timestamp | 
### Fillable Attributes [](#fillable-attributes)
php
```
protected $fillable = [
 'parent', 'title', 'code', 'status', 'type', 'conditions',
 'amount', 'stackable', 'priority', 'use_count', 'notes',
 'show_on_checkout', 'start_date', 'end_date',
];```

### Casts [](#casts)

| Attribute | Cast Type | 
| --- | --- |
| max_uses | integer | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$coupon = FluentCart\App\Models\Coupon::find(1);

$coupon->id; // returns coupon ID
$coupon->code; // returns coupon code
$coupon->type; // returns coupon type
$coupon->amount; // returns coupon amount in cents
$coupon->status; // returns coupon status
$coupon->conditions; // returns decoded conditions array (via JSON mutator)
$coupon->settings; // returns decoded settings array (via JSON mutator)
$coupon->other_info; // returns decoded other info array (via JSON mutator)
$coupon->categories; // returns decoded categories array (via JSON mutator)
$coupon->products; // returns decoded products array of integers (via JSON mutator)```

## Relations [](#relations)

This model has the following relationships that you can use.
### appliedCoupons [](#appliedcoupons)

Access the applied coupons (hasMany).

- **Type:** `hasMany`
- **Related Model:** `FluentCart\App\Models\AppliedCoupon`
- **Foreign Key:** `coupon_id`
- **Local Key:** `id`
- Returns `FluentCart\Framework\Database\Orm\Collection` of `FluentCart\App\Models\AppliedCoupon`
php
```
$coupon = FluentCart\App\Models\Coupon::find(1);
$appliedCoupons = $coupon->appliedCoupons;```

### orders [](#orders)

Access the orders that used this coupon (belongsToMany through pivot table).

- **Type:** `belongsToMany`
- **Related Model:** `FluentCart\App\Models\Order`
- **Pivot Table:** `fct_applied_coupons`
- **Foreign Pivot Key:** `coupon_id`
- **Related Pivot Key:** `order_id`
- Returns `FluentCart\Framework\Database\Orm\Collection` of `FluentCart\App\Models\Order`
php
```
$coupon = FluentCart\App\Models\Coupon::find(1);
$orders = $coupon->orders;```

### activities [](#activities)

Access the activity log entries for this coupon (polymorphic, from `HasActivity` trait).

- **Type:** `morphMany`
- **Related Model:** `FluentCart\App\Models\Activity`
- **Morph Name:** `module`
- **Default Order:** `created_at DESC`, `id DESC`
- Returns `FluentCart\Framework\Database\Orm\Collection` of `FluentCart\App\Models\Activity`
php
```
$coupon = FluentCart\App\Models\Coupon::find(1);
$activities = $coupon->activities;```

## Scopes [](#scopes)

This model has the following scopes that you can use.
### active() [](#active)

Get only active coupons that have not expired.php
```
$coupons = FluentCart\App\Models\Coupon::active()->get();```

This scope filters coupons that are:

- Status is `'active'`
- End date is null, or `'0000-00-00 00:00:00'`, or in the future (compared to `DateTime::gmtNow()`)

### Scopes from CanSearch Trait [](#scopes-from-cansearch-trait)

#### search($params) [](#search-params)

Search coupons using an array of filter parameters.php
```
$coupons = FluentCart\App\Models\Coupon::search([
 'status' => 'active',
 'type' => 'percentage',
])->get();```

#### whereLike($column, $value) [](#wherelike-column-value)

WHERE column LIKE %value% query.php
```
$coupons = FluentCart\App\Models\Coupon::whereLike('code', 'SAVE')->get();```

#### whereBeginsWith($column, $value) [](#wherebeginswith-column-value)

WHERE column LIKE value% query.php
```
$coupons = FluentCart\App\Models\Coupon::whereBeginsWith('code', 'SAVE')->get();```

#### whereEndsWith($column, $value) [](#whereendswith-column-value)

WHERE column LIKE %value query.php
```
$coupons = FluentCart\App\Models\Coupon::whereEndsWith('code', '10')->get();```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### JSON Mutators (Accessors & Mutators) [](#json-mutators-accessors-mutators)

The Coupon model uses accessor/mutator pairs to automatically handle JSON encoding and decoding for several attributes. When you set these attributes with an array or object, they are automatically JSON-encoded before storage. When you read them, they are automatically JSON-decoded into arrays.
#### conditions (setConditionsAttribute / getConditionsAttribute) [](#conditions-setconditionsattribute-getconditionsattribute)

Set and get coupon conditions with automatic JSON encoding/decoding.

- **Setter:** Accepts an array or object, JSON-encodes it. Falls back to `'[]'` if value is empty or encoding fails.
- **Getter:** Returns a decoded array, or `[]` if value is empty.
php
```
$coupon = FluentCart\App\Models\Coupon::find(1);

// Setting conditions
$coupon->conditions = [
 'min_purchase_amount' => 5000,
 'max_per_customer' => 3,
 'max_uses' => 100,
 'is_recurring' => 'yes',
];

// Getting conditions
$conditions = $coupon->conditions; // returns array```

#### settings (setSettingsAttribute / getSettingsAttribute) [](#settings-setsettingsattribute-getsettingsattribute)

Set and get coupon settings with automatic JSON encoding/decoding.

- **Setter:** If value is an array or object, JSON-encodes with `JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES` flags.
- **Getter:** If value is a string, JSON-decodes it. Returns the decoded array on success, or the original value if decoding fails.
php
```
$coupon = FluentCart\App\Models\Coupon::find(1);

// Setting
$coupon->settings = ['custom_field' => 'value'];

// Getting
$settings = $coupon->settings; // returns array```

#### other_info (setOtherInfoAttribute / getOtherInfoAttribute) [](#other-info-setotherinfoattribute-getotherinfoattribute)

Set and get additional info with automatic JSON encoding/decoding. The setter has special handling: if `buy_products` or `get_products` keys are present and are arrays, their values are cast to integers via `array_map('intval', ...)`.

- **Setter:** Accepts a string (JSON-decodes it first), array, or object. Casts `buy_products` and `get_products` values to integers. Falls back to `'[]'` for non-array/non-object values.
- **Getter:** Returns a decoded array, or `[]` if value is empty.
php
```
$coupon = FluentCart\App\Models\Coupon::find(1);

// Setting (buy_products and get_products values auto-cast to integers)
$coupon->other_info = [
 'buy_products' => [1, 2, 3],
 'get_products' => [4, 5],
];

// Getting
$otherInfo = $coupon->other_info; // returns array```

#### categories (setCategoriesAttribute / getCategoriesAttribute) [](#categories-setcategoriesattribute-getcategoriesattribute)

Set and get categories with automatic JSON encoding/decoding.

- **Setter:** If value is an array or object, JSON-encodes it. Falls back to `'[]'` otherwise.
- **Getter:** Returns a decoded array, or `[]` if value is empty.
php
```
$coupon = FluentCart\App\Models\Coupon::find(1);

// Setting
$coupon->categories = [1, 2, 3];

// Getting
$categories = $coupon->categories; // returns array```

#### products (setProductsAttribute / getProductsAttribute) [](#products-setproductsattribute-getproductsattribute)

Set and get products with automatic JSON encoding/decoding. The setter casts each product ID to an integer via `array_map('intval', ...)`.

- **Setter:** If value is an array or object, casts each item to integer, then JSON-encodes. Falls back to `'[]'` otherwise.
- **Getter:** Returns a decoded array, or `[]` if value is empty.
php
```
$coupon = FluentCart\App\Models\Coupon::find(1);

// Setting (values are auto-cast to integers)
$coupon->products = [1, 2, 3];

// Getting
$products = $coupon->products; // returns array of integers```

### getEndDate() [](#getenddate)

Get the coupon's end date.

- Returns `String|null` - End date value
php
```
$coupon = FluentCart\App\Models\Coupon::find(1);
$endDate = $coupon->getEndDate();```

### getStatus() [](#getstatus)

Get the coupon's current status.

- Returns `String` - Status value
php
```
$coupon = FluentCart\App\Models\Coupon::find(1);
$status = $coupon->getStatus();```

### setStatus($value) [](#setstatus-value)

Set the coupon's status.

- Parameters: `$value` (String) - Status value (e.g., 'active', 'inactive', 'expired')
php
```
$coupon = FluentCart\App\Models\Coupon::find(1);
$coupon->setStatus('active');```

### getMeta($metaKey, $default = null) [](#getmeta-metakey-default-null)

Get a coupon meta value from the `fct_meta` table where `object_type` is `'coupon'`.

- Parameters: `$metaKey` (String) - Meta key, `$default` (Mixed) - Default value if meta not found
- Returns `Mixed` - Meta value or default
php
```
$coupon = FluentCart\App\Models\Coupon::find(1);
$metaValue = $coupon->getMeta('custom_field', 'default');```

### updateMeta($metaKey, $metaValue) [](#updatemeta-metakey-metavalue)

Create or update a coupon meta value in the `fct_meta` table where `object_type` is `'coupon'`. If the meta key already exists for this coupon, it updates the value. Otherwise, it creates a new meta record.

- Parameters: `$metaKey` (String) - Meta key, `$metaValue` (Mixed) - Meta value
- Returns `FluentCart\App\Models\Meta` - The created or updated Meta instance
php
```
$coupon = FluentCart\App\Models\Coupon::find(1);
$meta = $coupon->updateMeta('custom_field', 'new_value');```

### isRecurringDiscount() [](#isrecurringdiscount)

Check if this coupon is configured as a recurring discount. Looks at the `is_recurring` key inside the `conditions` JSON attribute.

- Returns `Boolean` - `true` if `conditions.is_recurring` equals `'yes'`, `false` otherwise
php
```
$coupon = FluentCart\App\Models\Coupon::find(1);

if ($coupon->isRecurringDiscount()) {
 // This coupon applies to recurring subscription payments
}```

## Usage Examples [](#usage-examples)

### Creating a Coupon [](#creating-a-coupon)
php
```
use FluentCart\App\Models\Coupon;

$coupon = Coupon::create([
 'code' => 'SAVE10',
 'title' => 'Save 10%',
 'type' => 'percentage',
 'amount' => 10, // 10%
 'status' => 'active',
 'stackable' => 'no',
 'conditions' => [
 'min_purchase_amount' => 5000,
 'max_uses' => 100,
 'max_per_customer' => 3,
 'is_recurring' => 'yes',
 ],
 'start_date' => now(),
 'end_date' => now()->addDays(30),
]);```

### Retrieving Coupons [](#retrieving-coupons)
php
```
// Get coupon by code
$coupon = Coupon::where('code', 'SAVE10')->first();

// Get all active coupons
$coupons = Coupon::active()->get();

// Get coupon by ID
$coupon = Coupon::find(1);

// Search coupons by code pattern
$coupons = Coupon::whereLike('code', 'SAVE')->get();

// Get coupon with activities
$coupon = Coupon::with(['activities.user'])->find(1);

// Get coupon with applied coupons count
$coupon = Coupon::withCount('appliedCoupons')->find(1);```

### Updating a Coupon [](#updating-a-coupon)
php
```
$coupon = Coupon::find(1);
$coupon->use_count = $coupon->use_count + 1;
$coupon->save();```

### Checking Recurring Discount [](#checking-recurring-discount)
php
```
$coupon = Coupon::find(1);
if ($coupon->isRecurringDiscount()) {
 // Handle recurring discount logic
}```

### Working with Meta [](#working-with-meta)
php
```
$coupon = Coupon::find(1);

// Set meta
$coupon->updateMeta('custom_setting', 'value');

// Get meta with default
$value = $coupon->getMeta('custom_setting', 'fallback');```

### Deleting a Coupon [](#deleting-a-coupon)
php
```
$coupon = Coupon::find(1);
$coupon->delete();```

---

## AppliedCoupon

Source: https://dev.fluentcart.com/database/models/applied-coupon.html


| DB Table Name | {wp_db_prefix}_fct_applied_coupons | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-applied-coupons-table) | 
| Source File | fluent-cart/app/Models/AppliedCoupon.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\AppliedCoupon | 
## Traits [](#traits)

- **CanUpdateBatch** - Provides `batchUpdate()` scope for batch updating multiple records

## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key (guarded) | 
| order_id | Integer | Reference to order | 
| coupon_id | Integer | Reference to coupon | 
| code | String | Coupon code | 
| amount | Decimal | Discount amount applied (in cents) | 
| settings | JSON | (Dynamic/Meta) Coupon settings, may not be a physical DB column | 
| other_info | JSON | (Dynamic/Meta) Additional coupon information (buy/get product IDs), may not be a physical DB column | 
| categories | JSON | (Dynamic/Meta) Product categories, may not be a physical DB column | 
| products | JSON | (Dynamic/Meta) Product IDs (stored as integers), may not be a physical DB column | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
**Note:** Some fields above (settings, other_info, categories, products) are handled as dynamic/meta properties in the model and may not exist as physical columns in the database schema. They are available via accessors/mutators for developer convenience. The `id` column is both guarded and declared as `$primaryKey`.
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$appliedCoupon = FluentCart\App\Models\AppliedCoupon::find(1);

$appliedCoupon->id; // returns id
$appliedCoupon->order_id; // returns order ID
$appliedCoupon->coupon_id; // returns coupon ID
$appliedCoupon->code; // returns coupon code
$appliedCoupon->amount; // returns discount amount```

## Scopes [](#scopes)

This model has the following scopes via the `CanUpdateBatch` trait.
### batchUpdate($values, $index = null) [](#batchupdate-values-index-null)

Batch update multiple records at once. Uses the primary key as the default index column.

- Parameters 

 - $values - array of records to update
 - $index - string|null (default: primary key)

#### Usage: [](#usage-1)
php
```
FluentCart\App\Models\AppliedCoupon::batchUpdate([
 ['id' => 1, 'amount' => 500],
 ['id' => 2, 'amount' => 1000],
]);```

## Relations [](#relations)

This model has the following relationships that you can use
### order [](#order)

Access the associated order

- return `FluentCart\App\Models\Order` Model

#### Example: [](#example)
php
```
// Accessing Order
$order = $appliedCoupon->order;

// For Filtering by order relationship
$appliedCoupons = FluentCart\App\Models\AppliedCoupon::whereHas('order', function($query) {
 $query->where('status', 'completed');
})->get();```

### coupon [](#coupon)

Access the associated coupon. This relationship uses `code` as the foreign key and `id` as the owner key on the `Coupon` model.

- return `FluentCart\App\Models\Coupon` Model

#### Example: [](#example-1)
php
```
// Accessing Coupon
$coupon = $appliedCoupon->coupon;

// For Filtering by coupon relationship
$appliedCoupons = FluentCart\App\Models\AppliedCoupon::whereHas('coupon', function($query) {
 $query->where('status', 'active');
})->get();```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### setSettingsAttribute($value) [](#setsettingsattribute-value)

Set settings with automatic JSON encoding (mutator). Uses `JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES` flags. Stores the encoded value in the `meta_value` column.

- Parameters 

 - $value - mixed (array, object, or string)

- Returns `void`

#### Usage [](#usage-2)
php
```
$appliedCoupon->settings = ['discount_type' => 'percentage', 'value' => 10];
// Automatically JSON encodes arrays and objects```

### getSettingsAttribute($value) [](#getsettingsattribute-value)

Get settings with automatic JSON decoding (accessor). Returns decoded array if valid JSON, otherwise returns the original value.

- Parameters 

 - $value - mixed

- Returns `mixed`

#### Usage [](#usage-3)
php
```
$settings = $appliedCoupon->settings; // Returns decoded value (array, object, or string)```

### setOtherInfoAttribute($value) [](#setotherinfoattribute-value)

Set other info with automatic JSON encoding and product ID conversion (mutator). Accepts JSON strings, arrays, or objects. Automatically converts `buy_products` and `get_products` arrays to integer values.

- Parameters 

 - $value - mixed (array, object, or JSON string)

- Returns `void`

#### Usage [](#usage-4)
php
```
$appliedCoupon->other_info = [
 'buy_products' => [1, 2, 3],
 'get_products' => [4, 5, 6]
];
// Automatically JSON encodes and converts product IDs to integers```

### getOtherInfoAttribute($value) [](#getotherinfoattribute-value)

Get other info with automatic JSON decoding (accessor). Returns empty array if value is empty.

- Parameters 

 - $value - mixed

- Returns `array`

#### Usage [](#usage-5)
php
```
$otherInfo = $appliedCoupon->other_info; // Returns decoded array or empty array```

### setCategoriesAttribute($value) [](#setcategoriesattribute-value)

Set categories with automatic JSON encoding (mutator). Arrays and objects are JSON-encoded; other types result in an empty JSON array.

- Parameters 

 - $value - mixed (array, object, or string)

- Returns `void`

#### Usage [](#usage-6)
php
```
$appliedCoupon->categories = ['electronics', 'books', 'clothing'];
// Automatically JSON encodes arrays and objects```

### getCategoriesAttribute($value) [](#getcategoriesattribute-value)

Get categories with automatic JSON decoding (accessor). Returns empty array if value is empty.

- Parameters 

 - $value - mixed

- Returns `array`

#### Usage [](#usage-7)
php
```
$categories = $appliedCoupon->categories; // Returns decoded array or empty array```

### setProductsAttribute($value) [](#setproductsattribute-value)

Set products with automatic JSON encoding and integer conversion (mutator). Each item in the array is converted to an integer via `intval()`. Non-array/object values result in an empty JSON array.

- Parameters 

 - $value - mixed (array, object, or string)

- Returns `void`

#### Usage [](#usage-8)
php
```
$appliedCoupon->products = [1, 2, 3, 4, 5];
// Automatically JSON encodes and converts to integers```

### getProductsAttribute($value) [](#getproductsattribute-value)

Get products with automatic JSON decoding (accessor). Returns empty array if value is empty.

- Parameters 

 - $value - mixed

- Returns `array`

#### Usage [](#usage-9)
php
```
$products = $appliedCoupon->products; // Returns decoded array of integers or empty array```

## Usage Examples [](#usage-examples)

### Get Applied Coupons [](#get-applied-coupons)
php
```
$appliedCoupon = FluentCart\App\Models\AppliedCoupon::find(1);
echo "Coupon Code: " . $appliedCoupon->code;
echo "Discount Amount: " . $appliedCoupon->amount;
echo "Order ID: " . $appliedCoupon->order_id;```

### Get Coupons Applied to Order [](#get-coupons-applied-to-order)
php
```
$order = FluentCart\App\Models\Order::find(123);
$appliedCoupons = $order->applied_coupons;

foreach ($appliedCoupons as $appliedCoupon) {
 echo "Coupon: " . $appliedCoupon->code;
 echo "Discount: " . $appliedCoupon->amount;
}```

### Create Applied Coupon [](#create-applied-coupon)
php
```
$appliedCoupon = FluentCart\App\Models\AppliedCoupon::create([
 'order_id' => 123,
 'coupon_id' => 5,
 'code' => 'SAVE10',
 'amount' => 1000,
]);```

### Get Coupon Details [](#get-coupon-details)
php
```
$appliedCoupon = FluentCart\App\Models\AppliedCoupon::with(['order', 'coupon'])->find(1);
$order = $appliedCoupon->order;
$coupon = $appliedCoupon->coupon;```

### Get Applied Coupons by Code [](#get-applied-coupons-by-code)
php
```
$appliedCoupons = FluentCart\App\Models\AppliedCoupon::where('code', 'SAVE10')->get();```

### Get Applied Coupons for Date Range [](#get-applied-coupons-for-date-range)
php
```
$appliedCoupons = FluentCart\App\Models\AppliedCoupon::whereBetween('created_at', ['2024-01-01', '2024-01-31'])->get();```

### Batch Update Coupon Amounts [](#batch-update-coupon-amounts)
php
```
FluentCart\App\Models\AppliedCoupon::batchUpdate([
 ['id' => 1, 'amount' => 500],
 ['id' => 2, 'amount' => 1500],
 ['id' => 3, 'amount' => 2000],
]);```

---

## Activity

Source: https://dev.fluentcart.com/database/models/activity.html


| DB Table Name | {wp_db_prefix}_fct_activity | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-activity-table) | 
| Source File | fluent-cart/app/Models/Activity.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\Activity | 
## Traits [](#traits)

| Trait | Description | 
| --- | --- |
| CanSearch | Provides `search()`, `groupSearch()`, `whereLike()`, `whereBeginsWith()`, `whereEndsWith()` query scopes | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key (guarded) | 
| status | String | Activity status (success, warning, failed, info) | 
| log_type | String | Log type (activity, api, etc.) | 
| module_id | Integer | Module ID (cast to integer) | 
| module_type | String | Module type (full model path) | 
| module_name | String | Module name (order, product, user, etc.) | 
| title | String | Activity title | 
| content | Text | Activity content | 
| user_id | Integer | User ID | 
| read_status | String | Read status (read, unread) | 
| created_by | String | Created by (FCT-BOT, username) | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Casts [](#casts)

| Attribute | Cast Type | 
| --- | --- |
| module_id | integer | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$activity = FluentCart\App\Models\Activity::find(1);

$activity->id; // returns activity ID
$activity->status; // returns activity status
$activity->title; // returns activity title
$activity->content; // returns activity content
$activity->module_name; // returns module name
$activity->module_id; // returns module ID (always cast to integer)```

## Relations [](#relations)

This model has the following relationships that you can use
### activity [](#activity)

Access the parent activity model (polymorphic). Uses `module_type` and `module_id` columns for polymorphic resolution.

- Returns `MorphTo` - Polymorphic relationship
php
```
$activity = FluentCart\App\Models\Activity::find(1);
$parentModel = $activity->activity; // Returns the related model (Order, Product, etc.)```

### user [](#user)

Access the user who performed the activity. Returns a limited set of columns (`ID`, `display_name`, `user_email`) for performance.

- Returns `FluentCart\App\Models\User` Model (HasOne via `user_id` -> `ID`)
- Selected columns: `ID`, `display_name`, `user_email`
php
```
$activity = FluentCart\App\Models\Activity::find(1);
$user = $activity->user;

if ($user) {
 echo $user->display_name;
 echo $user->user_email;
}```

## Scopes [](#scopes)

This model has the following scopes that you can use
This model uses the `CanSearch` trait which provides search functionality.
### search($params) from CanSearch [](#search-params)

Search activities by parameters. Supports operators: `=`, `between`, `like_all`, `in`, `not_in`, `is_null`, `is_not_null`, and more.

- Parameters: `$params` (Array) - Search parameters
php
```
$activities = FluentCart\App\Models\Activity::search([
 'status' => ['value' => 'success', 'operator' => '=']
])->get();

// Multiple search criteria
$activities = FluentCart\App\Models\Activity::search([
 'module_name' => ['value' => 'order', 'operator' => '='],
 'status' => ['value' => 'success', 'operator' => '=']
])->get();```

## Usage Examples [](#usage-examples)

### Creating an Activity [](#creating-an-activity)
php
```
use FluentCart\App\Models\Activity;

$activity = Activity::create([
 'status' => 'success',
 'log_type' => 'activity',
 'module_type' => 'FluentCart\App\Models\Order',
 'module_id' => 123,
 'module_name' => 'order',
 'user_id' => 1,
 'title' => 'Order Status Updated',
 'content' => 'Order status changed from pending to completed',
 'created_by' => 'admin'
]);```

### Retrieving Activities [](#retrieving-activities)
php
```
// Get activity by ID
$activity = Activity::find(1);

// Get activities by status
$activities = Activity::where('status', 'success')->get();

// Get activities by module
$activities = Activity::where('module_name', 'order')->get();

// Get unread activities
$activities = Activity::where('read_status', 'unread')->get();```

### Loading Activity with User [](#loading-activity-with-user)
php
```
$activity = Activity::with('user')->find(1);
echo $activity->user->display_name; // Only ID, display_name, user_email are loaded```

### Updating an Activity [](#updating-an-activity)
php
```
$activity = Activity::find(1);
$activity->read_status = 'read';
$activity->save();```

### Deleting an Activity [](#deleting-an-activity)
php
```
$activity = Activity::find(1);
$activity->delete();```

---

## ScheduledAction

Source: https://dev.fluentcart.com/database/models/scheduled-action.html


| DB Table Name | {wp_db_prefix}_fct_scheduled_actions | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-scheduled-actions-table) | 
| Source File | fluent-cart/app/Models/ScheduledAction.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\ScheduledAction | 
## Guarded & Fillable [](#guarded-fillable)

This model uses both `$guarded` and `$fillable`:

- **Guarded:** `['id']`
- **Fillable:** `['scheduled_at', 'action', 'status', 'group', 'object_id', 'object_type', 'completed_at', 'retry_count', 'data', 'response_note']`

## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key (guarded) | 
| scheduled_at | Date Time | When the action is scheduled to run | 
| action | String | Action to be performed | 
| status | String | Action status (pending, completed, failed) | 
| group | String | Action group | 
| object_id | Integer | ID of the associated object | 
| object_type | String | Type of the associated object | 
| completed_at | Date Time | When the action was completed | 
| retry_count | Integer | Number of retry attempts | 
| data | JSON | Action data and parameters (manual JSON mutator/accessor) | 
| response_note | String | Response or error note | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$scheduledAction = FluentCart\App\Models\ScheduledAction::find(1);

$scheduledAction->id; // returns id
$scheduledAction->scheduled_at; // returns scheduled time
$scheduledAction->action; // returns action name
$scheduledAction->status; // returns status
$scheduledAction->data; // returns array (accessor)
$scheduledAction->response_note; // returns response note```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### setDataAttribute($value) [](#setdataattribute-value)

Set data with automatic JSON encoding (mutator). If the value is an array or object, it is encoded with `json_encode()`. Otherwise the raw value is stored as-is.

- Parameters 

 - $value - mixed (array, object, or string)

- Returns `void`

#### Usage [](#usage-1)
php
```
$scheduledAction->data = ['param1' => 'value1', 'param2' => 'value2'];
// Automatically JSON encodes arrays and objects```

### getDataAttribute($value) [](#getdataattribute-value)

Get data with automatic JSON decoding (accessor). Decodes the stored JSON string into an associative array.

- Parameters 

 - $value - mixed

- Returns `array` - Decoded array, or empty array if decoding fails or value is not a valid JSON array

#### Usage [](#usage-2)
php
```
$data = $scheduledAction->data; // Returns decoded array```

## Usage Examples [](#usage-examples)

### Get Scheduled Actions [](#get-scheduled-actions)
php
```
$scheduledAction = FluentCart\App\Models\ScheduledAction::find(1);
echo "Action: " . $scheduledAction->action;
echo "Status: " . $scheduledAction->status;
echo "Scheduled At: " . $scheduledAction->scheduled_at;```

### Get Pending Actions [](#get-pending-actions)
php
```
$pendingActions = FluentCart\App\Models\ScheduledAction::where('status', 'pending')
 ->where('scheduled_at', '<=', now())
 ->get();

foreach ($pendingActions as $action) {
 echo "Action: " . $action->action;
 echo "Data: " . print_r($action->data, true);
}```

### Create Scheduled Action [](#create-scheduled-action)
php
```
$scheduledAction = FluentCart\App\Models\ScheduledAction::create([
 'scheduled_at' => now()->addHours(1),
 'action' => 'send_email',
 'status' => 'pending',
 'group' => 'notifications',
 'object_id' => 123,
 'object_type' => 'order',
 'data' => [
 'email' => '[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)',
 'template' => 'order_confirmation',
 'order_id' => 123
 ]
]);```

### Get Actions by Group [](#get-actions-by-group)
php
```
$emailActions = FluentCart\App\Models\ScheduledAction::where('group', 'notifications')->get();
$webhookActions = FluentCart\App\Models\ScheduledAction::where('group', 'webhooks')->get();```

### Get Failed Actions [](#get-failed-actions)
php
```
$failedActions = FluentCart\App\Models\ScheduledAction::where('status', 'failed')
 ->where('retry_count', '<', 3)
 ->get();```

### Mark Action as Completed [](#mark-action-as-completed)
php
```
$action = FluentCart\App\Models\ScheduledAction::find(1);
$action->status = 'completed';
$action->completed_at = now();
$action->response_note = 'Successfully processed';
$action->save();```

### Get Actions for Object [](#get-actions-for-object)
php
```
$orderActions = FluentCart\App\Models\ScheduledAction::where('object_type', 'order')
 ->where('object_id', 123)
 ->get();```

### Retry Failed Action [](#retry-failed-action)
php
```
$failedAction = FluentCart\App\Models\ScheduledAction::where('status', 'failed')
 ->where('retry_count', '<', 3)
 ->first();

if ($failedAction) {
 $failedAction->status = 'pending';
 $failedAction->retry_count = $failedAction->retry_count + 1;
 $failedAction->scheduled_at = now()->addMinutes(5);
 $failedAction->save();
}```

---

## Meta

Source: https://dev.fluentcart.com/database/models/meta.html


| DB Table Name | {wp_db_prefix}_fct_meta | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-meta-table) | 
| Source File | fluent-cart/app/Models/Meta.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\Meta | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| object_type | String | Type of object (User, ProductVariation, etc.) | 
| object_id | Integer | ID of the associated object | 
| meta_key | String | Meta key name | 
| meta_value | Text | Meta value (JSON encoded for arrays/objects) | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Guarded Attributes [](#guarded-attributes)

The `id` field is explicitly guarded via `$guarded = ['id']`.
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$meta = FluentCart\App\Models\Meta::find(1);

$meta->id; // returns id
$meta->object_type; // returns object type
$meta->object_id; // returns object ID
$meta->meta_key; // returns meta key
$meta->meta_value; // returns meta value (auto-decoded from JSON)```

## Scopes [](#scopes)

This model has the following scopes that you can use
### userTheme() [](#usertheme)

Filter meta for current user's theme setting. Filters by `object_type = User::class`, `object_id = current user ID`, and `meta_key = 'theme'`.

- Parameters 

 - none

#### Usage: [](#usage-1)
php
```
// Get current user's theme meta
$userTheme = FluentCart\App\Models\Meta::userTheme()->first();```

### upgradeablePath($productId) [](#upgradeablepath-productid)

Filter meta for upgradeable paths by product ID. Uses a `whereHas` on the `upgradeableVariants` relationship and filters by `PlanUpgradeService::$metaType` and `PlanUpgradeService::$metaKey`.

- Parameters 

 - $productId - integer

#### Usage: [](#usage-2)
php
```
// Get upgradeable paths for a product
$upgradePaths = FluentCart\App\Models\Meta::upgradeablePath(123)->get();```

## Relations [](#relations)

This model has the following relationships that you can use
### upgradeableVariants [](#upgradeablevariants)

Access all upgradeable variants (`hasMany`). Links via `object_id` to `ProductVariation.id`.

- return `FluentCart\App\Models\ProductVariation` Model Collection

#### Example: [](#example)
php
```
// Accessing Upgradeable Variants
$variants = $meta->upgradeableVariants;

// For Filtering by upgradeable variants relationship
$metas = FluentCart\App\Models\Meta::whereHas('upgradeableVariants', function($query) {
 $query->where('status', 'active');
})->get();```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### setMetaValueAttribute($meta_value) [](#setmetavalueattribute-meta-value)

Set meta value with automatic JSON encoding (mutator). If the value is an array or object, it is JSON-encoded with `JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES` flags.

- Parameters 

 - $meta_value - mixed (array, object, or string)

- Returns `void`

#### Usage [](#usage-3)
php
```
$meta->meta_value = ['custom_data' => 'value', 'settings' => ['key' => 'value']];
// Automatically JSON encodes arrays and objects```

### getMetaValueAttribute($value) [](#getmetavalueattribute-value)

Get meta value with automatic JSON decoding (accessor). If the stored value is a string, it attempts to JSON-decode it. Returns the decoded value if successful, or the original string if decoding returns `null`.

- Parameters 

 - $value - mixed

- Returns `mixed`

#### Usage [](#usage-4)
php
```
$metaValue = $meta->meta_value; // Returns decoded value (array or string)```

## Usage Examples [](#usage-examples)

### Get Meta [](#get-meta)
php
```
$meta = FluentCart\App\Models\Meta::where('object_type', 'User')
 ->where('object_id', 123)
 ->get();

foreach ($meta as $metaItem) {
 echo "Key: " . $metaItem->meta_key;
 echo "Value: " . print_r($metaItem->meta_value, true);
}```

### Create Meta [](#create-meta)
php
```
$meta = FluentCart\App\Models\Meta::create([
 'object_type' => 'User',
 'object_id' => 123,
 'meta_key' => 'preferences',
 'meta_value' => 'dark_mode'
]);```

### Store Complex Meta Data [](#store-complex-meta-data)
php
```
$meta = FluentCart\App\Models\Meta::create([
 'object_type' => 'ProductVariation',
 'object_id' => 456,
 'meta_key' => 'upgrade_paths',
 'meta_value' => [
 'upgrade_to' => [789, 101],
 'discount_percentage' => 20,
 'conditions' => ['active_subscription' => true]
 ]
]);```

### Get User Theme [](#get-user-theme)
php
```
$userTheme = FluentCart\App\Models\Meta::userTheme()->first();
if ($userTheme) {
 echo "User Theme: " . $userTheme->meta_value;
}```

### Get Upgradeable Paths [](#get-upgradeable-paths)
php
```
$upgradePaths = FluentCart\App\Models\Meta::upgradeablePath(123)->get();
foreach ($upgradePaths as $path) {
 echo "Upgrade Path: " . print_r($path->meta_value, true);
}```

### Get Meta by Key [](#get-meta-by-key)
php
```
$meta = FluentCart\App\Models\Meta::where('object_type', 'User')
 ->where('object_id', 123)
 ->where('meta_key', 'preferences')
 ->first();

if ($meta) {
 echo "Preferences: " . $meta->meta_value;
}```

### Update Meta Value [](#update-meta-value)
php
```
$meta = FluentCart\App\Models\Meta::find(1);
$meta->meta_value = ['updated' => true, 'timestamp' => now()];
$meta->save();```

### Get All Meta for Object [](#get-all-meta-for-object)
php
```
$objectMetas = FluentCart\App\Models\Meta::where('object_type', 'ProductVariation')
 ->where('object_id', 456)
 ->get();```

---

## User

Source: https://dev.fluentcart.com/database/models/user.html


| DB Table Name | {wp_db_prefix}_users | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#users-table) | 
| Source File | fluent-cart/app/Models/User.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\User | 
## Properties [](#properties)

- **Table**: `users`
- **Primary Key**: `ID`
- **Guarded**: `['password']`
- **Fillable**: Not explicitly defined (uses guarded approach)

## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| ID | Integer | Primary Key (WordPress user ID) | 
| user_login | String | User login name | 
| user_pass | String | User password (guarded) | 
| user_nicename | String | User nice name | 
| user_email | String | User email address | 
| user_url | String | User website URL | 
| user_registered | Date Time | User registration date | 
| user_activation_key | String | User activation key | 
| user_status | Integer | User status | 
| display_name | String | User display name | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$user = FluentCart\App\Models\User::find(1);

$user->ID; // returns user ID
$user->user_login; // returns login name
$user->user_email; // returns email address
$user->display_name; // returns display name```

## Relations [](#relations)

This model has the following relationships that you can use
### customer [](#customer)

Access the associated customer (HasOne)

- return `FluentCart\App\Models\Customer` Model

#### Example: [](#example)
php
```
// Accessing Customer
$customer = $user->customer;

// For Filtering by customer relationship
$users = FluentCart\App\Models\User::whereHas('customer', function($query) {
 $query->where('status', 'active');
})->get();```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### userCan($permission) [](#usercan-permission)

Check if the user has a specific permission. Delegates to `PermissionManager::hasPermission()`.

- Parameters 

 - $permission - string|array

- Returns `boolean`

#### Usage [](#usage-1)
php
```
$user = FluentCart\App\Models\User::find(1);
$canManageOrders = $user->userCan('manage_orders');
$canManageProducts = $user->userCan(['manage_products', 'edit_products']);```

### userCanAny($permission) [](#usercanany-permission)

Check if the user has any of the specified permissions. Delegates to `PermissionManager::hasAnyPermission()`.

- Parameters 

 - $permission - string|array

- Returns `boolean`

#### Usage [](#usage-2)
php
```
$user = FluentCart\App\Models\User::find(1);
$canManage = $user->userCanAny(['manage_orders', 'manage_products']);```

### setStoreRole($role) [](#setstorerole-role)

Set store role for the user. Stores the role in user meta key `_fluent_cart_admin_role`. Returns a `WP_Error` if the user already has the `manage_options` capability (WordPress Administrator).

- Parameters 

 - $role - string

- Returns `int|bool|\WP_Error` - Returns WP_Error for administrators, otherwise the result of `update_user_meta()`

#### Usage [](#usage-3)
php
```
$user = FluentCart\App\Models\User::find(1);
$result = $user->setStoreRole('store_manager');

if (is_wp_error($result)) {
 echo "Error: " . $result->get_error_message();
} else {
 echo "Role set successfully";
}```

## Usage Examples [](#usage-examples)

### Get User [](#get-user)
php
```
$user = FluentCart\App\Models\User::find(1);
echo "User: " . $user->display_name;
echo "Email: " . $user->user_email;
echo "Login: " . $user->user_login;```

### Check User Permissions [](#check-user-permissions)
php
```
$user = FluentCart\App\Models\User::find(1);

// Check single permission
if ($user->userCan('manage_orders')) {
 echo "User can manage orders";
}

// Check multiple permissions (all required)
if ($user->userCan(['manage_products', 'edit_products'])) {
 echo "User can manage and edit products";
}

// Check multiple permissions (any required)
if ($user->userCanAny(['manage_orders', 'manage_products'])) {
 echo "User can manage orders or products";
}```

### Get User with Customer Data [](#get-user-with-customer-data)
php
```
$user = FluentCart\App\Models\User::with('customer')->find(1);
$customer = $user->customer;

if ($customer) {
 echo "Customer ID: " . $customer->id;
 echo "Customer Status: " . $customer->status;
}```

### Set Store Role [](#set-store-role)
php
```
$user = FluentCart\App\Models\User::find(1);
$result = $user->setStoreRole('store_manager');

if (is_wp_error($result)) {
 echo "Error: " . $result->get_error_message();
} else {
 echo "Store role set successfully";
}```

### Get Users with Customer Relationship [](#get-users-with-customer-relationship)
php
```
$users = FluentCart\App\Models\User::whereHas('customer', function($query) {
 $query->where('status', 'active');
})->get();

foreach ($users as $user) {
 echo "User: " . $user->display_name;
 echo "Customer: " . $user->customer->email;
}```

### Get Users by Role [](#get-users-by-role)
php
```
// Get users with specific store role
$storeManagers = get_users([
 'meta_key' => '_fluent_cart_admin_role',
 'meta_value' => 'store_manager'
]);```

---

## DynamicModel

Source: https://dev.fluentcart.com/database/models/dynamic-model.html


| DB Table Name | Dynamic (set via constructor) | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html) | 
| Source File | fluent-cart/app/Models/DynamicModel.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\DynamicModel | 
## Traits [](#traits)

- **CanSearch** (`FluentCart\App\Models\Concerns\CanSearch`) - Provides `search()`, `groupSearch()`, `whereLike()`, `whereBeginsWith()`, and `whereEndsWith()` query scopes.

## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key (default) | 
| * | Mixed | All attributes are fillable (guarded = []) | 
| created_at | Date Time | Creation timestamp (if table has timestamps) | 
| updated_at | Date Time | Last update timestamp (if table has timestamps) | 
## Guarded Attributes [](#guarded-attributes)

No attributes are guarded (`$guarded = []`). All attributes are mass-assignable.
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$dynamicModel = new FluentCart\App\Models\DynamicModel([], 'custom_table');

$dynamicModel->id; // returns id
$dynamicModel->any_field; // returns any field from the table```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### __construct($attributes = [], $table = null) [](#construct-attributes-table-null)

Dynamic model constructor. Calls the parent constructor with the given attributes and then sets the table name to the provided value.

- Parameters 

 - $attributes - array (default: [])
 - $table - string|null (default: null)

- Returns `void`

#### Usage [](#usage-1)
php
```
// Create dynamic model for custom table
$dynamicModel = new FluentCart\App\Models\DynamicModel([], 'custom_table');

// Create dynamic model with initial data
$dynamicModel = new FluentCart\App\Models\DynamicModel([
 'name' => 'Test',
 'value' => 'Example'
], 'custom_table');```

## Usage Examples [](#usage-examples)

### Create Dynamic Model [](#create-dynamic-model)
php
```
// Create dynamic model for a custom table
$dynamicModel = new FluentCart\App\Models\DynamicModel([], 'my_custom_table');

// Set table and create instance
$dynamicModel->setTable('my_custom_table');```

### Use Dynamic Model with Custom Table [](#use-dynamic-model-with-custom-table)
php
```
// Create dynamic model for custom table
$dynamicModel = new FluentCart\App\Models\DynamicModel([], 'custom_analytics');

// Create record
$dynamicModel->create([
 'event_name' => 'page_view',
 'user_id' => 123,
 'timestamp' => now(),
 'metadata' => json_encode(['page' => '/products', 'source' => 'google'])
]);```

### Query Dynamic Table [](#query-dynamic-table)
php
```
// Create dynamic model for custom table
$dynamicModel = new FluentCart\App\Models\DynamicModel([], 'custom_analytics');

// Get all records
$records = $dynamicModel->all();

// Get specific records
$pageViews = $dynamicModel->where('event_name', 'page_view')->get();

// Get recent records
$recentEvents = $dynamicModel->where('timestamp', '>=', now()->subDays(7))->get();```

### Update Dynamic Table [](#update-dynamic-table)
php
```
// Create dynamic model for custom table
$dynamicModel = new FluentCart\App\Models\DynamicModel([], 'custom_analytics');

// Update record
$dynamicModel->where('id', 1)->update([
 'metadata' => json_encode(['updated' => true])
]);```

### Delete from Dynamic Table [](#delete-from-dynamic-table)
php
```
// Create dynamic model for custom table
$dynamicModel = new FluentCart\App\Models\DynamicModel([], 'custom_analytics');

// Delete record
$dynamicModel->where('id', 1)->delete();

// Delete multiple records
$dynamicModel->where('event_name', 'old_event')->delete();```

### Use CanSearch Trait Scopes [](#use-cansearch-trait-scopes)
php
```
// Create dynamic model for custom table
$dynamicModel = new FluentCart\App\Models\DynamicModel([], 'custom_analytics');

// Search with the search scope (from CanSearch trait)
$results = $dynamicModel->search([
 'event_name' => ['column' => 'event_name', 'operator' => 'like_all', 'value' => 'page_view']
])->get();

// Use whereLike scope
$results = $dynamicModel->whereLike('event_name', 'page')->get();```

### Dynamic Model for Temporary Tables [](#dynamic-model-for-temporary-tables)
php
```
// Create dynamic model for temporary table
$tempModel = new FluentCart\App\Models\DynamicModel([], 'temp_import_data');

// Use for data processing
$tempModel->create([
 'import_id' => 123,
 'row_data' => json_encode(['name' => 'Product', 'price' => 29.99]),
 'status' => 'pending'
]);```

---

## AttributeGroup

Source: https://dev.fluentcart.com/database/models/attribute-group.html


| DB Table Name | {wp_db_prefix}_fct_atts_groups | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-atts-groups-table) | 
| Source File | fluent-cart/app/Models/AttributeGroup.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\AttributeGroup | 
## Traits [](#traits)

- **CanSearch** (`FluentCart\App\Models\Concerns\CanSearch`) - Provides `search()`, `groupSearch()`, `whereLike()`, `whereBeginsWith()`, and `whereEndsWith()` query scopes.

## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| title | String | Attribute group title (e.g., Color, Size) | 
| slug | String | Attribute group slug | 
| description | Text | Attribute group description | 
| settings | JSON | Attribute group settings | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Boot Events [](#boot-events)

The model registers a `deleting` event in the `boot()` method that automatically deletes all associated terms when an attribute group is deleted:php
```
static::deleting(function ($model) {
 $model->terms()->delete();
});```

## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$attributeGroup = FluentCart\App\Models\AttributeGroup::find(1);

$attributeGroup->id; // returns id
$attributeGroup->title; // returns title
$attributeGroup->slug; // returns slug
$attributeGroup->description; // returns description
$attributeGroup->settings; // returns settings (auto-decoded from JSON)```

## Scopes [](#scopes)

This model has the following scopes that you can use
### applyCustomFilters($filters) [](#applycustomfilters-filters)

Apply custom filters to the query. Accepts filters for any fillable attribute plus a special `terms_count` filter for filtering by the number of associated terms. Supported operators: `includes` (LIKE), `not_includes` (NOT LIKE), `gt` (>), `lt` (<), and standard SQL comparison operators for `terms_count`.

- Parameters 

 - $filters - array of filter arrays, each with `value` and `operator` keys

#### Usage: [](#usage-1)
php
```
// Apply custom filters
$filteredGroups = FluentCart\App\Models\AttributeGroup::applyCustomFilters([
 'title' => ['value' => 'Color', 'operator' => 'includes'],
 'terms_count' => ['value' => 5, 'operator' => 'gt']
])->get();```

## Relations [](#relations)

This model has the following relationships that you can use
### terms [](#terms)

Access all attribute terms in this group (`hasMany`)

- return `FluentCart\App\Models\AttributeTerm` Model Collection

#### Example: [](#example)
php
```
// Accessing Terms
$terms = $attributeGroup->terms;

// For Filtering by terms relationship
$attributeGroups = FluentCart\App\Models\AttributeGroup::whereHas('terms', function($query) {
 $query->where('title', 'Red');
})->get();```

### usedTerms [](#usedterms)

Access all used attribute relations for this group (`hasMany`). Returns `AttributeRelation` records linked by `group_id`.

- return `FluentCart\App\Models\AttributeRelation` Model Collection

#### Example: [](#example-1)
php
```
// Accessing Used Terms
$usedTerms = $attributeGroup->usedTerms;

// For Filtering by used terms relationship
$attributeGroups = FluentCart\App\Models\AttributeGroup::whereHas('usedTerms', function($query) {
 $query->where('term_id', 5);
})->get();```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### setSettingsAttribute($value) [](#setsettingsattribute-value)

Set settings with automatic JSON encoding (mutator). If the value is an array, it is JSON-encoded with `JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES` flags.

- Parameters 

 - $value - mixed (array or string)

- Returns `void`

#### Usage [](#usage-2)
php
```
$attributeGroup->settings = ['display_type' => 'dropdown', 'required' => true];
// Automatically JSON encodes arrays```

### getSettingsAttribute($value) [](#getsettingsattribute-value)

Get settings with automatic JSON decoding (accessor). If the stored value is a string, it attempts to JSON-decode it. Returns the original string if decoding fails.

- Parameters 

 - $value - mixed

- Returns `mixed`

#### Usage [](#usage-3)
php
```
$settings = $attributeGroup->settings; // Returns decoded value (array or string)```

## Usage Examples [](#usage-examples)

### Get Attribute Groups [](#get-attribute-groups)
php
```
$attributeGroup = FluentCart\App\Models\AttributeGroup::find(1);
echo "Title: " . $attributeGroup->title;
echo "Slug: " . $attributeGroup->slug;
echo "Description: " . $attributeGroup->description;```

### Create Attribute Group [](#create-attribute-group)
php
```
$attributeGroup = FluentCart\App\Models\AttributeGroup::create([
 'title' => 'Color',
 'slug' => 'color',
 'description' => 'Product color variations',
 'settings' => [
 'display_type' => 'dropdown',
 'required' => true,
 'multiple' => false
 ]
]);```

### Get Attribute Groups with Terms [](#get-attribute-groups-with-terms)
php
```
$attributeGroups = FluentCart\App\Models\AttributeGroup::with('terms')->get();

foreach ($attributeGroups as $group) {
 echo "Group: " . $group->title;
 foreach ($group->terms as $term) {
 echo " - Term: " . $term->title;
 }
}```

### Apply Custom Filters [](#apply-custom-filters)
php
```
$filters = [
 'title' => ['value' => 'Color', 'operator' => 'includes'],
 'terms_count' => ['value' => 3, 'operator' => 'gt']
];

$filteredGroups = FluentCart\App\Models\AttributeGroup::applyCustomFilters($filters)->get();```

### Get Groups by Title [](#get-groups-by-title)
php
```
$colorGroups = FluentCart\App\Models\AttributeGroup::where('title', 'Color')->get();
$sizeGroups = FluentCart\App\Models\AttributeGroup::where('title', 'Size')->get();```

### Get Groups with Term Count [](#get-groups-with-term-count)
php
```
$groupsWithCounts = FluentCart\App\Models\AttributeGroup::withCount('terms')->get();

foreach ($groupsWithCounts as $group) {
 echo "Group: " . $group->title . " (" . $group->terms_count . " terms)";
}```

### Update Attribute Group [](#update-attribute-group)
php
```
$attributeGroup = FluentCart\App\Models\AttributeGroup::find(1);
$attributeGroup->update([
 'description' => 'Updated description',
 'settings' => ['display_type' => 'radio', 'required' => false]
]);```

### Delete Attribute Group (with Terms) [](#delete-attribute-group-with-terms)
php
```
$attributeGroup = FluentCart\App\Models\AttributeGroup::find(1);
$attributeGroup->delete(); // Automatically deletes associated terms via boot() deleting event```

### Use CanSearch Trait Scopes [](#use-cansearch-trait-scopes)
php
```
// Search with the search scope (from CanSearch trait)
$groups = FluentCart\App\Models\AttributeGroup::search([
 'title' => ['column' => 'title', 'operator' => 'like_all', 'value' => 'Color']
])->get();

// Use whereLike scope
$groups = FluentCart\App\Models\AttributeGroup::whereLike('title', 'Col')->get();```

---

## AttributeTerm

Source: https://dev.fluentcart.com/database/models/attribute-term.html


| DB Table Name | {wp_db_prefix}_fct_atts_terms | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-atts-terms-table) | 
| Source File | fluent-cart/app/Models/AttributeTerm.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\AttributeTerm | 
## Traits [](#traits)

- **CanSearch** (`FluentCart\App\Models\Concerns\CanSearch`) - Provides `search()`, `groupSearch()`, `whereLike()`, `whereBeginsWith()`, and `whereEndsWith()` query scopes.

## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| group_id | Integer | Reference to attribute group | 
| serial | Integer | Serial number for ordering | 
| title | String | Attribute term title (e.g., Red, Small, Large) | 
| slug | String | Attribute term slug | 
| description | Text | Attribute term description | 
| settings | JSON | Attribute term settings | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$attributeTerm = FluentCart\App\Models\AttributeTerm::find(1);

$attributeTerm->id; // returns id
$attributeTerm->group_id; // returns group ID
$attributeTerm->serial; // returns serial number
$attributeTerm->title; // returns title
$attributeTerm->slug; // returns slug
$attributeTerm->description; // returns description
$attributeTerm->settings; // returns settings (auto-decoded from JSON)```

## Scopes [](#scopes)

This model has the following scopes that you can use
### applyCustomFilters($filters) [](#applycustomfilters-filters)

Apply custom filters to the query. Accepts filters for any fillable attribute (`group_id`, `serial`, `title`, `slug`, `description`, `settings`). Supported operators: `includes` (LIKE), `not_includes` (NOT LIKE), `gt` (>), `lt` (<), and standard SQL comparison operators.

- Parameters 

 - $filters - array of filter arrays, each with `value` and `operator` keys

#### Usage: [](#usage-1)
php
```
// Apply custom filters
$filteredTerms = FluentCart\App\Models\AttributeTerm::applyCustomFilters([
 'title' => ['value' => 'Red', 'operator' => 'includes'],
 'group_id' => ['value' => 1, 'operator' => '=']
])->get();```

## Relations [](#relations)

This model has the following relationships that you can use
### group [](#group)

Access the associated attribute group (`belongsTo`)

- return `FluentCart\App\Models\AttributeGroup` Model

#### Example: [](#example)
php
```
// Accessing Group
$group = $attributeTerm->group;

// For Filtering by group relationship
$attributeTerms = FluentCart\App\Models\AttributeTerm::whereHas('group', function($query) {
 $query->where('title', 'Color');
})->get();```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### setSettingsAttribute($value) [](#setsettingsattribute-value)

Set settings with automatic JSON encoding (mutator). If the value is an array or object, it is JSON-encoded with `JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES` flags.

- Parameters 

 - $value - mixed (array, object, or string)

- Returns `void`

#### Usage [](#usage-2)
php
```
$attributeTerm->settings = ['color_code' => '#FF0000', 'display_order' => 1];
// Automatically JSON encodes arrays and objects```

### getSettingsAttribute($value) [](#getsettingsattribute-value)

Get settings with automatic JSON decoding (accessor). If the stored value is a string, it attempts to JSON-decode it. Returns the original string if decoding fails.

- Parameters 

 - $value - mixed

- Returns `mixed`

#### Usage [](#usage-3)
php
```
$settings = $attributeTerm->settings; // Returns decoded value (array, object, or string)```

## Usage Examples [](#usage-examples)

### Get Attribute Terms [](#get-attribute-terms)
php
```
$attributeTerm = FluentCart\App\Models\AttributeTerm::find(1);
echo "Title: " . $attributeTerm->title;
echo "Slug: " . $attributeTerm->slug;
echo "Group ID: " . $attributeTerm->group_id;```

### Create Attribute Term [](#create-attribute-term)
php
```
$attributeTerm = FluentCart\App\Models\AttributeTerm::create([
 'group_id' => 1,
 'serial' => 1,
 'title' => 'Red',
 'slug' => 'red',
 'description' => 'Red color variant',
 'settings' => [
 'color_code' => '#FF0000',
 'display_order' => 1,
 'is_default' => false
 ]
]);```

### Get Terms by Group [](#get-terms-by-group)
php
```
$colorTerms = FluentCart\App\Models\AttributeTerm::where('group_id', 1)->get();
$sizeTerms = FluentCart\App\Models\AttributeTerm::where('group_id', 2)->get();```

### Get Terms with Group Information [](#get-terms-with-group-information)
php
```
$attributeTerms = FluentCart\App\Models\AttributeTerm::with('group')->get();

foreach ($attributeTerms as $term) {
 echo "Term: " . $term->title;
 echo "Group: " . $term->group->title;
}```

### Apply Custom Filters [](#apply-custom-filters)
php
```
$filters = [
 'title' => ['value' => 'Red', 'operator' => 'includes'],
 'group_id' => ['value' => 1, 'operator' => '=']
];

$filteredTerms = FluentCart\App\Models\AttributeTerm::applyCustomFilters($filters)->get();```

### Get Terms Ordered by Serial [](#get-terms-ordered-by-serial)
php
```
$orderedTerms = FluentCart\App\Models\AttributeTerm::where('group_id', 1)
 ->orderBy('serial', 'asc')
 ->get();```

### Update Attribute Term [](#update-attribute-term)
php
```
$attributeTerm = FluentCart\App\Models\AttributeTerm::find(1);
$attributeTerm->update([
 'title' => 'Bright Red',
 'settings' => ['color_code' => '#CC0000', 'display_order' => 2]
]);```

### Get Terms with Settings [](#get-terms-with-settings)
php
```
$termsWithSettings = FluentCart\App\Models\AttributeTerm::where('group_id', 1)->get();

foreach ($termsWithSettings as $term) {
 $settings = $term->settings;
 if (isset($settings['color_code'])) {
 echo "Term: " . $term->title . " - Color: " . $settings['color_code'];
 }
}```

### Use CanSearch Trait Scopes [](#use-cansearch-trait-scopes)
php
```
// Search with the search scope (from CanSearch trait)
$terms = FluentCart\App\Models\AttributeTerm::search([
 'title' => ['column' => 'title', 'operator' => 'like_all', 'value' => 'Red']
])->get();

// Use whereLike scope
$terms = FluentCart\App\Models\AttributeTerm::whereLike('title', 'Re')->get();```

---

## AttributeRelation

Source: https://dev.fluentcart.com/database/models/attribute-relation.html


| DB Table Name | {wp_db_prefix}_fct_atts_relations | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-atts-relations-table) | 
| Source File | fluent-cart/app/Models/AttributeRelation.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\AttributeRelation | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| group_id | Integer | Reference to attribute group | 
| term_id | Integer | Reference to attribute term | 
| object_id | Integer | Reference to product detail (variation) | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$attributeRelation = FluentCart\App\Models\AttributeRelation::find(1);

$attributeRelation->id; // returns id
$attributeRelation->group_id; // returns group ID
$attributeRelation->term_id; // returns term ID
$attributeRelation->object_id; // returns object ID (product detail ID)```

## Relations [](#relations)

This model has the following relationships that you can use
### group [](#group)

Access the associated attribute group (`belongsTo`)

- return `FluentCart\App\Models\AttributeGroup` Model

#### Example: [](#example)
php
```
// Accessing Group
$group = $attributeRelation->group;

// For Filtering by group relationship
$attributeRelations = FluentCart\App\Models\AttributeRelation::whereHas('group', function($query) {
 $query->where('title', 'Color');
})->get();```

### term [](#term)

Access the associated attribute term (`belongsTo`)

- return `FluentCart\App\Models\AttributeTerm` Model

#### Example: [](#example-1)
php
```
// Accessing Term
$term = $attributeRelation->term;

// For Filtering by term relationship
$attributeRelations = FluentCart\App\Models\AttributeRelation::whereHas('term', function($query) {
 $query->where('title', 'Red');
})->get();```

### productDetails [](#productdetails)

Access the associated product detail (`belongsTo`). Links via `object_id` to `ProductDetail.id`.

- return `FluentCart\App\Models\ProductDetail` Model

#### Example: [](#example-2)
php
```
// Accessing Product Detail
$productDetail = $attributeRelation->productDetails;

// For Filtering by product detail relationship
$attributeRelations = FluentCart\App\Models\AttributeRelation::whereHas('productDetails', function($query) {
 $query->where('fulfillment_type', 'physical');
})->get();```

## Usage Examples [](#usage-examples)

### Get Attribute Relations [](#get-attribute-relations)
php
```
$attributeRelation = FluentCart\App\Models\AttributeRelation::find(1);
echo "Group ID: " . $attributeRelation->group_id;
echo "Term ID: " . $attributeRelation->term_id;
echo "Object ID: " . $attributeRelation->object_id;```

### Create Attribute Relation [](#create-attribute-relation)
php
```
$attributeRelation = FluentCart\App\Models\AttributeRelation::create([
 'group_id' => 1, // Color group
 'term_id' => 5, // Red term
 'object_id' => 123 // Product detail ID
]);```

### Get Relations with Group and Term Information [](#get-relations-with-group-and-term-information)
php
```
$attributeRelations = FluentCart\App\Models\AttributeRelation::with(['group', 'term'])->get();

foreach ($attributeRelations as $relation) {
 echo "Group: " . $relation->group->title;
 echo "Term: " . $relation->term->title;
 echo "Object ID: " . $relation->object_id;
}```

### Get Relations by Group [](#get-relations-by-group)
php
```
$colorRelations = FluentCart\App\Models\AttributeRelation::where('group_id', 1)->get();
$sizeRelations = FluentCart\App\Models\AttributeRelation::where('group_id', 2)->get();```

### Get Relations by Term [](#get-relations-by-term)
php
```
$redRelations = FluentCart\App\Models\AttributeRelation::where('term_id', 5)->get();
$smallRelations = FluentCart\App\Models\AttributeRelation::where('term_id', 10)->get();```

### Get Relations for Product [](#get-relations-for-product)
php
```
$productRelations = FluentCart\App\Models\AttributeRelation::where('object_id', 123)->get();

foreach ($productRelations as $relation) {
 echo "Attribute: " . $relation->group->title . " - " . $relation->term->title;
}```

### Get Relations with Product Details [](#get-relations-with-product-details)
php
```
$relationsWithProducts = FluentCart\App\Models\AttributeRelation::with(['group', 'term', 'productDetails'])->get();

foreach ($relationsWithProducts as $relation) {
 echo "Product: " . $relation->productDetails->id;
 echo "Attribute: " . $relation->group->title . " - " . $relation->term->title;
}```

### Delete Attribute Relation [](#delete-attribute-relation)
php
```
$attributeRelation = FluentCart\App\Models\AttributeRelation::find(1);
$attributeRelation->delete();```

### Get Relations by Multiple Terms [](#get-relations-by-multiple-terms)
php
```
$redOrBlueRelations = FluentCart\App\Models\AttributeRelation::whereIn('term_id', [5, 6])->get();```

### Get Relations for Multiple Products [](#get-relations-for-multiple-products)
php
```
$multiProductRelations = FluentCart\App\Models\AttributeRelation::whereIn('object_id', [123, 124, 125])->get();```

---

## ShippingZone

Source: https://dev.fluentcart.com/database/models/shipping-zone.html


| DB Table Name | {wp_db_prefix}_fct_shipping_zones | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-shipping-zones-table) | 
| Source File | fluent-cart/app/Models/ShippingZone.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\ShippingZone | 
## Traits [](#traits)

- `FluentCart\App\Models\Concerns\CanSearch` - Provides `search()`, `groupSearch()`, `whereLike()`, `whereBeginsWith()`, `whereEndsWith()` scopes

## Appended Attributes [](#appended-attributes)

The following computed attributes are automatically appended to the model's array/JSON output:

- `formatted_region` - Human-readable region name

## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| name | String | Shipping zone name | 
| region | String | Region/country code (or `'all'` for whole world) | 
| order | Integer | Display order | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$shippingZone = FluentCart\App\Models\ShippingZone::find(1);

$shippingZone->id; // returns id
$shippingZone->name; // returns zone name
$shippingZone->region; // returns region code
$shippingZone->order; // returns display order
$shippingZone->formatted_region; // returns formatted region name (appended attribute)```

## Relations [](#relations)

This model has the following relationships that you can use
### methods [](#methods)

Access all shipping methods in this zone. Results are ordered by `id` descending.

- return `FluentCart\App\Models\ShippingMethod` Model Collection

#### Example: [](#example)
php
```
// Accessing Methods
$methods = $shippingZone->methods;

// For Filtering by methods relationship
$shippingZones = FluentCart\App\Models\ShippingZone::whereHas('methods', function($query) {
 $query->where('is_enabled', 1);
})->get();```

## Methods [](#methods-1)

Along with Global Model methods, this model has few helper methods.
### getFormattedRegionAttribute() [](#getformattedregionattribute)

Get formatted region name (accessor). Returns `'Whole World'` if region is `'all'`, otherwise resolves the country code to its full name via `AddressHelper::getCountryNameByCode()`.

- Parameters 

 - none

- Returns `string`

#### Usage [](#usage-1)
php
```
$formattedRegion = $shippingZone->formatted_region; // e.g., "United States" or "Whole World"```

## Usage Examples [](#usage-examples)

### Get Shipping Zones [](#get-shipping-zones)
php
```
$shippingZone = FluentCart\App\Models\ShippingZone::find(1);
echo "Zone Name: " . $shippingZone->name;
echo "Region: " . $shippingZone->region;
echo "Formatted Region: " . $shippingZone->formatted_region;```

### Create Shipping Zone [](#create-shipping-zone)
php
```
$shippingZone = FluentCart\App\Models\ShippingZone::create([
 'name' => 'United States',
 'region' => 'US',
 'order' => 1
]);```

### Get Shipping Zones with Methods [](#get-shipping-zones-with-methods)
php
```
$shippingZones = FluentCart\App\Models\ShippingZone::with('methods')->get();

foreach ($shippingZones as $zone) {
 echo "Zone: " . $zone->name;
 foreach ($zone->methods as $method) {
 echo " - Method: " . $method->title;
 }
}```

### Get Zones by Region [](#get-zones-by-region)
php
```
$usZones = FluentCart\App\Models\ShippingZone::where('region', 'US')->get();
$allWorldZones = FluentCart\App\Models\ShippingZone::where('region', 'all')->get();```

### Get Zones Ordered by Display Order [](#get-zones-ordered-by-display-order)
php
```
$orderedZones = FluentCart\App\Models\ShippingZone::orderBy('order', 'asc')->get();```

### Get Zones with Enabled Methods [](#get-zones-with-enabled-methods)
php
```
$zonesWithEnabledMethods = FluentCart\App\Models\ShippingZone::whereHas('methods', function($query) {
 $query->where('is_enabled', 1);
})->get();```

### Update Shipping Zone [](#update-shipping-zone)
php
```
$shippingZone = FluentCart\App\Models\ShippingZone::find(1);
$shippingZone->update([
 'name' => 'United States & Canada',
 'order' => 2
]);```

### Get Zone by Name [](#get-zone-by-name)
php
```
$zone = FluentCart\App\Models\ShippingZone::where('name', 'United States')->first();```

### Get Zones with Method Count [](#get-zones-with-method-count)
php
```
$zonesWithCounts = FluentCart\App\Models\ShippingZone::withCount('methods')->get();

foreach ($zonesWithCounts as $zone) {
 echo "Zone: " . $zone->name . " (" . $zone->methods_count . " methods)";
}```

### Delete Shipping Zone [](#delete-shipping-zone)
php
```
$shippingZone = FluentCart\App\Models\ShippingZone::find(1);
$shippingZone->delete();```

---

## ShippingMethod

Source: https://dev.fluentcart.com/database/models/shipping-method.html


| DB Table Name | {wp_db_prefix}_fct_shipping_methods | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-shipping-methods-table) | 
| Source File | fluent-cart/app/Models/ShippingMethod.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\ShippingMethod | 
## Traits [](#traits)

- `FluentCart\App\Models\Concerns\CanSearch` - Provides `search()`, `groupSearch()`, `whereLike()`, `whereBeginsWith()`, `whereEndsWith()` scopes

## Appended Attributes [](#appended-attributes)

The following computed attributes are automatically appended to the model's array/JSON output:

- `formatted_states` - Array of human-readable state names

## Casts [](#casts)

| Attribute | Cast Type | 
| --- | --- |
| settings | array | 
| states | array | 
| is_enabled | boolean | 
## Default Attribute Values [](#default-attribute-values)

| Attribute | Default | 
| --- | --- |
| states | `'[]'` | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| zone_id | Integer | Reference to shipping zone | 
| title | String | Shipping method title | 
| type | String | Shipping method type | 
| settings | Array | Shipping method settings (cast to array) | 
| amount | Decimal | Shipping amount | 
| is_enabled | Boolean | Whether method is enabled (cast to boolean) | 
| order | Integer | Display order | 
| states | Array | Applicable states (cast to array, defaults to empty array) | 
| meta | JSON | Additional metadata (manual JSON mutator/accessor) | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$shippingMethod = FluentCart\App\Models\ShippingMethod::find(1);

$shippingMethod->id; // returns id
$shippingMethod->zone_id; // returns zone ID
$shippingMethod->title; // returns title
$shippingMethod->amount; // returns amount
$shippingMethod->is_enabled; // returns boolean
$shippingMethod->settings; // returns array (cast)
$shippingMethod->states; // returns array (cast)
$shippingMethod->meta; // returns array (accessor)
$shippingMethod->formatted_states; // returns array of formatted state names (appended attribute)```

## Scopes [](#scopes)

This model has the following scopes that you can use
### applicableToCountry($country, $state) [](#applicabletocountry-country-state)

Filter methods applicable to a specific country and state. This scope:

- Filters by zone region matching the country or `'all'`
- Filters by states -- includes methods with empty states array, or methods whose states contain the given state
- Orders results by `amount` descending
- Only returns enabled methods (`is_enabled = 1`)

Supports both MySQL (using JSON functions) and SQLite (using string search) for state filtering.

- Parameters 

 - $country - string (country code)
 - $state - string|null (state code)

#### Usage: [](#usage-1)
php
```
// Get methods applicable to US, California
$methods = FluentCart\App\Models\ShippingMethod::applicableToCountry('US', 'CA')->get();

// Get methods applicable to US, any state
$methods = FluentCart\App\Models\ShippingMethod::applicableToCountry('US', null)->get();```

## Relations [](#relations)

This model has the following relationships that you can use
### zone [](#zone)

Access the associated shipping zone

- return `FluentCart\App\Models\ShippingZone` Model

#### Example: [](#example)
php
```
// Accessing Zone
$zone = $shippingMethod->zone;

// For Filtering by zone relationship
$shippingMethods = FluentCart\App\Models\ShippingMethod::whereHas('zone', function($query) {
 $query->where('region', 'US');
})->get();```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### getFormattedStatesAttribute() [](#getformattedstatesattribute)

Get formatted states array (accessor). Maps each state code to its human-readable name using `AddressHelper::getStateNameByCode()`, resolving against the zone's region.

- Parameters 

 - none

- Returns `array` - Array of formatted state name strings, or empty array if states is not an array

#### Usage [](#usage-2)
php
```
$formattedStates = $shippingMethod->formatted_states; // Returns array of formatted state names```

### setMetaAttribute($value) [](#setmetaattribute-value)

Set meta with automatic JSON encoding (mutator). Encodes the value with `json_encode()`. Falls back to `'[]'` if encoding fails or value is falsy.

- Parameters 

 - $value - mixed (array, object, or string)

- Returns `void`

#### Usage [](#usage-3)
php
```
$shippingMethod->meta = ['custom_data' => 'value', 'settings' => ['key' => 'value']];
// Automatically JSON encodes arrays and objects```

### getMetaAttribute($value) [](#getmetaattribute-value)

Get meta with automatic JSON decoding (accessor). Decodes the stored JSON string into an associative array.

- Parameters 

 - $value - mixed

- Returns `array` - Decoded array, or empty array if value is falsy

#### Usage [](#usage-4)
php
```
$meta = $shippingMethod->meta; // Returns decoded array```

## Usage Examples [](#usage-examples)

### Get Shipping Methods [](#get-shipping-methods)
php
```
$shippingMethod = FluentCart\App\Models\ShippingMethod::find(1);
echo "Title: " . $shippingMethod->title;
echo "Amount: " . $shippingMethod->amount;
echo "Enabled: " . ($shippingMethod->is_enabled ? 'Yes' : 'No');```

### Create Shipping Method [](#create-shipping-method)
php
```
$shippingMethod = FluentCart\App\Models\ShippingMethod::create([
 'zone_id' => 1,
 'title' => 'Standard Shipping',
 'type' => 'flat_rate',
 'settings' => ['cost' => 5.99, 'free_shipping_threshold' => 50],
 'amount' => 5.99,
 'is_enabled' => true,
 'order' => 1,
 'states' => ['CA', 'NY', 'TX']
]);```

### Get Methods by Zone [](#get-methods-by-zone)
php
```
$zoneMethods = FluentCart\App\Models\ShippingMethod::where('zone_id', 1)->get();```

### Get Enabled Methods [](#get-enabled-methods)
php
```
$enabledMethods = FluentCart\App\Models\ShippingMethod::where('is_enabled', true)->get();```

### Get Methods Applicable to Country [](#get-methods-applicable-to-country)
php
```
// Get methods for US, California
$usMethods = FluentCart\App\Models\ShippingMethod::applicableToCountry('US', 'CA')->get();

// Get methods for US, any state
$usAllMethods = FluentCart\App\Models\ShippingMethod::applicableToCountry('US', null)->get();```

### Get Methods with Zone Information [](#get-methods-with-zone-information)
php
```
$methodsWithZones = FluentCart\App\Models\ShippingMethod::with('zone')->get();

foreach ($methodsWithZones as $method) {
 echo "Method: " . $method->title;
 echo "Zone: " . $method->zone->name;
}```

### Get Methods by Type [](#get-methods-by-type)
php
```
$flatRateMethods = FluentCart\App\Models\ShippingMethod::where('type', 'flat_rate')->get();
$freeShippingMethods = FluentCart\App\Models\ShippingMethod::where('type', 'free_shipping')->get();```

### Update Shipping Method [](#update-shipping-method)
php
```
$shippingMethod = FluentCart\App\Models\ShippingMethod::find(1);
$shippingMethod->update([
 'amount' => 7.99,
 'is_enabled' => false,
 'meta' => ['updated' => true, 'timestamp' => now()]
]);```

### Get Methods Ordered by Display Order [](#get-methods-ordered-by-display-order)
php
```
$orderedMethods = FluentCart\App\Models\ShippingMethod::orderBy('order', 'asc')->get();```

### Get Methods with Formatted States [](#get-methods-with-formatted-states)
php
```
$methods = FluentCart\App\Models\ShippingMethod::where('zone_id', 1)->get();

foreach ($methods as $method) {
 echo "Method: " . $method->title;
 echo "States: " . implode(', ', $method->formatted_states);
}```

---

## ShippingClass

Source: https://dev.fluentcart.com/database/models/shipping-class.html


| DB Table Name | {wp_db_prefix}_fct_shipping_classes | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-shipping-classes-table) | 
| Source File | fluent-cart/app/Models/ShippingClass.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\ShippingClass | 
## Traits [](#traits)

- `FluentCart\App\Models\Concerns\CanSearch` - Provides `search()`, `groupSearch()`, `whereLike()`, `whereBeginsWith()`, `whereEndsWith()` scopes

## Casts [](#casts)

| Attribute | Cast Type | 
| --- | --- |
| cost | float | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| name | String | Shipping class name | 
| cost | Float | Shipping cost (cast to float) | 
| type | String | Shipping class type | 
| per_item | Boolean | Whether cost is per item | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$shippingClass = FluentCart\App\Models\ShippingClass::find(1);

$shippingClass->id; // returns id
$shippingClass->name; // returns name
$shippingClass->cost; // returns cost (cast to float)
$shippingClass->type; // returns type
$shippingClass->per_item; // returns per_item flag```

## Relations [](#relations)

This model does not currently define any relationships.
Note
A `products` relationship (`hasMany` to `Product`) is planned but not yet implemented in the source code.
## Usage Examples [](#usage-examples)

### Get Shipping Classes [](#get-shipping-classes)
php
```
$shippingClass = FluentCart\App\Models\ShippingClass::find(1);
echo "Name: " . $shippingClass->name;
echo "Cost: " . $shippingClass->cost;
echo "Type: " . $shippingClass->type;
echo "Per Item: " . ($shippingClass->per_item ? 'Yes' : 'No');```

### Create Shipping Class [](#create-shipping-class)
php
```
$shippingClass = FluentCart\App\Models\ShippingClass::create([
 'name' => 'Standard Shipping',
 'cost' => 5.99,
 'type' => 'standard',
 'per_item' => false
]);```

### Get All Shipping Classes [](#get-all-shipping-classes)
php
```
$shippingClasses = FluentCart\App\Models\ShippingClass::all();

foreach ($shippingClasses as $class) {
 echo "Class: " . $class->name . " - Cost: $" . $class->cost;
}```

### Get Shipping Classes by Type [](#get-shipping-classes-by-type)
php
```
$standardClasses = FluentCart\App\Models\ShippingClass::where('type', 'standard')->get();
$expressClasses = FluentCart\App\Models\ShippingClass::where('type', 'express')->get();```

### Get Per-Item Shipping Classes [](#get-per-item-shipping-classes)
php
```
$perItemClasses = FluentCart\App\Models\ShippingClass::where('per_item', true)->get();
$flatRateClasses = FluentCart\App\Models\ShippingClass::where('per_item', false)->get();```

### Update Shipping Class [](#update-shipping-class)
php
```
$shippingClass = FluentCart\App\Models\ShippingClass::find(1);
$shippingClass->update([
 'cost' => 7.99,
 'per_item' => true
]);```

### Get Shipping Classes by Cost Range [](#get-shipping-classes-by-cost-range)
php
```
$lowCostClasses = FluentCart\App\Models\ShippingClass::where('cost', '<', 10.00)->get();
$highCostClasses = FluentCart\App\Models\ShippingClass::where('cost', '>=', 10.00)->get();```

### Delete Shipping Class [](#delete-shipping-class)
php
```
$shippingClass = FluentCart\App\Models\ShippingClass::find(1);
$shippingClass->delete();```

### Get Shipping Classes Ordered by Cost [](#get-shipping-classes-ordered-by-cost)
php
```
$orderedClasses = FluentCart\App\Models\ShippingClass::orderBy('cost', 'asc')->get();```

### Search Shipping Classes [](#search-shipping-classes)
php
```
$searchResults = FluentCart\App\Models\ShippingClass::whereLike('name', 'Standard')->get();```

---

## TaxClass

Source: https://dev.fluentcart.com/database/models/tax-class.html


| DB Table Name | {wp_db_prefix}_fct_tax_classes | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-tax-classes-table) | 
| Source File | fluent-cart/app/Models/TaxClass.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\TaxClass | 
## Guarded & Fillable [](#guarded-fillable)

This model uses both `$guarded` and `$fillable`:

- **Guarded:** `['id']`
- **Fillable:** `['title', 'description', 'meta', 'slug']`

## Lifecycle Hooks (booted) [](#lifecycle-hooks-booted)

The model registers lifecycle hooks in the `booted()` method:

- **Creating:** Automatically generates a unique slug from `title` via `generateUniqueSlug()`.
- **Updating:** If `title` has changed (is dirty), the slug is regenerated to match the new title.

## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key (guarded) | 
| title | String | Tax class title | 
| description | Text | Tax class description | 
| meta | JSON | Additional metadata (manual JSON mutator/accessor) | 
| slug | String | URL-friendly slug (auto-generated from title) | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$taxClass = FluentCart\App\Models\TaxClass::find(1);

$taxClass->id; // returns id
$taxClass->title; // returns title
$taxClass->description; // returns description
$taxClass->slug; // returns slug
$taxClass->meta; // returns array (accessor)```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### setMetaAttribute($value) [](#setmetaattribute-value)

Set meta with automatic JSON encoding (mutator). Encodes the value with `json_encode()`. Falls back to `'[]'` if encoding fails or value is falsy.

- Parameters 

 - $value - mixed (array, object, or string)

- Returns `void`

#### Usage [](#usage-1)
php
```
$taxClass->meta = ['tax_rate' => 8.5, 'exempt_products' => [1, 2, 3]];
// Automatically JSON encodes arrays and objects```

### getMetaAttribute($value) [](#getmetaattribute-value)

Get meta with automatic JSON decoding (accessor). Decodes the stored JSON string into an associative array.

- Parameters 

 - $value - mixed

- Returns `array` - Decoded array, or empty array if value is falsy

#### Usage [](#usage-2)
php
```
$meta = $taxClass->meta; // Returns decoded array```

### generateUniqueSlug($title, $ignoreId = null) [](#generateuniqueslug-title-ignoreid-null)

Generate unique slug for tax class (protected static method). Uses `Str::slug()` to create a URL-friendly slug from the title, then appends a numeric suffix if the slug already exists. Falls back to `'tax-class'` as the base slug if `Str::slug()` returns empty.
This method is called automatically by the model's lifecycle hooks -- you typically do not need to call it directly.

- Parameters 

 - $title - string
 - $ignoreId - integer|null (default: null) - Exclude this ID when checking for uniqueness (used during updates)

- Returns `string`

Note
This method is `protected static`, so it is not callable from outside the model class. Slug generation happens automatically on create and on update (when the title changes).
## Usage Examples [](#usage-examples)

### Get Tax Classes [](#get-tax-classes)
php
```
$taxClass = FluentCart\App\Models\TaxClass::find(1);
echo "Title: " . $taxClass->title;
echo "Description: " . $taxClass->description;
echo "Slug: " . $taxClass->slug;```

### Create Tax Class [](#create-tax-class)
php
```
$taxClass = FluentCart\App\Models\TaxClass::create([
 'title' => 'Standard Tax',
 'description' => 'Standard tax rate for most products',
 'meta' => [
 'tax_rate' => 8.5,
 'exempt_products' => [],
 'applicable_regions' => ['US', 'CA']
 ]
]);
// Slug will be automatically generated as "standard-tax"```

### Get All Tax Classes [](#get-all-tax-classes)
php
```
$taxClasses = FluentCart\App\Models\TaxClass::all();

foreach ($taxClasses as $class) {
 echo "Class: " . $class->title . " (" . $class->slug . ")";
}```

### Get Tax Class by Slug [](#get-tax-class-by-slug)
php
```
$taxClass = FluentCart\App\Models\TaxClass::where('slug', 'standard-tax')->first();```

### Update Tax Class [](#update-tax-class)
php
```
$taxClass = FluentCart\App\Models\TaxClass::find(1);
$taxClass->update([
 'title' => 'Updated Tax Class',
 'description' => 'Updated description',
 'meta' => ['tax_rate' => 9.0, 'updated' => true]
]);
// Slug will be automatically updated if title changes```

### Get Tax Classes with Meta [](#get-tax-classes-with-meta)
php
```
$taxClasses = FluentCart\App\Models\TaxClass::all();

foreach ($taxClasses as $class) {
 $meta = $class->meta;
 if (isset($meta['tax_rate'])) {
 echo "Class: " . $class->title . " - Rate: " . $meta['tax_rate'] . "%";
 }
}```

### Search Tax Classes [](#search-tax-classes)
php
```
$searchResults = FluentCart\App\Models\TaxClass::where('title', 'like', '%Standard%')->get();```

### Delete Tax Class [](#delete-tax-class)
php
```
$taxClass = FluentCart\App\Models\TaxClass::find(1);
$taxClass->delete();```

### Get Tax Classes Ordered by Title [](#get-tax-classes-ordered-by-title)
php
```
$orderedClasses = FluentCart\App\Models\TaxClass::orderBy('title', 'asc')->get();```

### Automatic Slug Generation [](#automatic-slug-generation)
php
```
// Creating a class with a duplicate title auto-generates a unique slug
$taxClass1 = FluentCart\App\Models\TaxClass::create(['title' => 'Sales Tax']);
// slug: "sales-tax"

$taxClass2 = FluentCart\App\Models\TaxClass::create(['title' => 'Sales Tax']);
// slug: "sales-tax-2"```

---

## TaxRate

Source: https://dev.fluentcart.com/database/models/tax-rate.html


| DB Table Name | {wp_db_prefix}_fct_tax_rates | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-tax-rates-table) | 
| Source File | fluent-cart/app/Models/TaxRate.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\TaxRate | 
## Guarded & Fillable [](#guarded-fillable)

This model uses both `$guarded` and `$fillable`:

- **Guarded:** `['id']`
- **Fillable:** `['class_id', 'country', 'state', 'postcode', 'city', 'rate', 'name', 'group', 'priority', 'is_compound', 'for_shipping', 'for_order']`

## Timestamps [](#timestamps)

This model has **timestamps disabled** (`$timestamps = false`). The `created_at` and `updated_at` columns are not automatically managed.
## Appended Attributes [](#appended-attributes)

The following computed attributes are automatically appended to the model's array/JSON output:

- `formatted_state` - Human-readable state name

## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key (guarded) | 
| class_id | Integer | Reference to tax class | 
| country | String | Country code | 
| state | String | State/Province code | 
| postcode | String | Postal/ZIP code | 
| city | String | City name | 
| rate | Decimal | Tax rate percentage | 
| name | String | Tax rate name | 
| group | String | Tax group | 
| priority | Integer | Priority order | 
| is_compound | Boolean | Whether tax is compound | 
| for_shipping | Boolean | Whether tax applies to shipping | 
| for_order | Boolean | Whether tax applies to order | 
No Timestamps
This model does not use automatic timestamps. There are no `created_at` or `updated_at` columns managed by the ORM.
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$taxRate = FluentCart\App\Models\TaxRate::find(1);

$taxRate->id; // returns id
$taxRate->class_id; // returns class ID
$taxRate->country; // returns country code
$taxRate->state; // returns state code
$taxRate->rate; // returns tax rate
$taxRate->formatted_state; // returns formatted state name (appended attribute)```

## Relations [](#relations)

This model has the following relationships that you can use
### tax_class [](#tax-class)

Access the associated tax class

- return `FluentCart\App\Models\TaxClass` Model

#### Example: [](#example)
php
```
// Accessing Tax Class
$taxClass = $taxRate->tax_class;

// For Filtering by tax class relationship
$taxRates = FluentCart\App\Models\TaxRate::whereHas('tax_class', function($query) {
 $query->where('title', 'Standard Tax');
})->get();```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### getFormattedStateAttribute() [](#getformattedstateattribute)

Get formatted state name (accessor). Resolves the state code to its human-readable name using `AddressHelper::getStateNameByCode()`, using the model's `country` attribute for context.

- Parameters 

 - none

- Returns `string` - Formatted state name, or empty string if state is empty

#### Usage [](#usage-1)
php
```
$formattedState = $taxRate->formatted_state; // e.g., "California"```

## Usage Examples [](#usage-examples)

### Get Tax Rates [](#get-tax-rates)
php
```
$taxRate = FluentCart\App\Models\TaxRate::find(1);
echo "Name: " . $taxRate->name;
echo "Rate: " . $taxRate->rate . "%";
echo "Country: " . $taxRate->country;
echo "State: " . $taxRate->state;
echo "Formatted State: " . $taxRate->formatted_state;```

### Create Tax Rate [](#create-tax-rate)
php
```
$taxRate = FluentCart\App\Models\TaxRate::create([
 'class_id' => 1,
 'country' => 'US',
 'state' => 'CA',
 'postcode' => '90210',
 'city' => 'Beverly Hills',
 'rate' => 8.75,
 'name' => 'California Sales Tax',
 'group' => 'sales_tax',
 'priority' => 1,
 'is_compound' => false,
 'for_shipping' => true,
 'for_order' => true
]);```

### Get Tax Rates by Country [](#get-tax-rates-by-country)
php
```
$usTaxRates = FluentCart\App\Models\TaxRate::where('country', 'US')->get();
$caTaxRates = FluentCart\App\Models\TaxRate::where('country', 'CA')->get();```

### Get Tax Rates by State [](#get-tax-rates-by-state)
php
```
$caTaxRates = FluentCart\App\Models\TaxRate::where('country', 'US')
 ->where('state', 'CA')
 ->get();```

### Get Tax Rates with Tax Class [](#get-tax-rates-with-tax-class)
php
```
$taxRates = FluentCart\App\Models\TaxRate::with('tax_class')->get();

foreach ($taxRates as $rate) {
 echo "Rate: " . $rate->name . " (" . $rate->rate . "%)";
 echo "Class: " . $rate->tax_class->title;
}```

### Get Tax Rates by Priority [](#get-tax-rates-by-priority)
php
```
$orderedTaxRates = FluentCart\App\Models\TaxRate::orderBy('priority', 'asc')->get();```

### Get Compound Tax Rates [](#get-compound-tax-rates)
php
```
$compoundTaxRates = FluentCart\App\Models\TaxRate::where('is_compound', true)->get();
$nonCompoundTaxRates = FluentCart\App\Models\TaxRate::where('is_compound', false)->get();```

### Get Tax Rates for Shipping [](#get-tax-rates-for-shipping)
php
```
$shippingTaxRates = FluentCart\App\Models\TaxRate::where('for_shipping', true)->get();```

### Get Tax Rates for Orders [](#get-tax-rates-for-orders)
php
```
$orderTaxRates = FluentCart\App\Models\TaxRate::where('for_order', true)->get();```

### Update Tax Rate [](#update-tax-rate)
php
```
$taxRate = FluentCart\App\Models\TaxRate::find(1);
$taxRate->update([
 'rate' => 9.25,
 'name' => 'Updated California Sales Tax'
]);```

### Get Tax Rates by Postcode [](#get-tax-rates-by-postcode)
php
```
$postcodeTaxRates = FluentCart\App\Models\TaxRate::where('postcode', '90210')->get();```

### Get Tax Rates by City [](#get-tax-rates-by-city)
php
```
$cityTaxRates = FluentCart\App\Models\TaxRate::where('city', 'Beverly Hills')->get();```

### Delete Tax Rate [](#delete-tax-rate)
php
```
$taxRate = FluentCart\App\Models\TaxRate::find(1);
$taxRate->delete();```

### Get Tax Rates by Group [](#get-tax-rates-by-group)
php
```
$salesTaxRates = FluentCart\App\Models\TaxRate::where('group', 'sales_tax')->get();
$vatTaxRates = FluentCart\App\Models\TaxRate::where('group', 'vat')->get();```

---

## Label

Source: https://dev.fluentcart.com/database/models/label.html


| DB Table Name | {wp_db_prefix}_fct_label | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-label-table) | 
| Source File | fluent-cart/app/Models/Label.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\Label | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| value | Mixed | Label value (serialized) | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Casts [](#casts)

| Attribute | Cast Type | 
| --- | --- |
| id | integer | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$label = FluentCart\App\Models\Label::find(1);

$label->id; // returns id
$label->value; // returns label value```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### setValueAttribute($value) [](#setvalueattribute-value)

Set value with automatic serialization (mutator). Uses WordPress `maybe_serialize()` to serialize arrays and objects before storing.

- Parameters 

 - $value - mixed

- Returns `void`

#### Usage [](#usage-1)
php
```
$label->value = ['name' => 'VIP Customer', 'color' => 'gold'];
// Automatically serializes the value using maybe_serialize()```

### getValueAttribute($value) [](#getvalueattribute-value)

Get value with automatic unserialization (accessor). Uses WordPress `maybe_unserialize()` to unserialize stored values.

- Parameters 

 - $value - mixed

- Returns `mixed`

#### Usage [](#usage-2)
php
```
$value = $label->value; // Returns unserialized value```

## Usage Examples [](#usage-examples)

### Get Labels [](#get-labels)
php
```
$label = FluentCart\App\Models\Label::find(1);
echo "Label ID: " . $label->id;
echo "Label Value: " . print_r($label->value, true);```

### Create Label [](#create-label)
php
```
$label = FluentCart\App\Models\Label::create([
 'value' => [
 'name' => 'VIP Customer',
 'color' => 'gold',
 'description' => 'High-value customer'
 ]
]);```

### Get All Labels [](#get-all-labels)
php
```
$labels = FluentCart\App\Models\Label::all();

foreach ($labels as $label) {
 $value = $label->value;
 if (is_array($value) && isset($value['name'])) {
 echo "Label: " . $value['name'];
 }
}```

### Update Label [](#update-label)
php
```
$label = FluentCart\App\Models\Label::find(1);
$label->update([
 'value' => [
 'name' => 'Premium Customer',
 'color' => 'platinum',
 'description' => 'Premium tier customer'
 ]
]);```

### Get Labels by Value [](#get-labels-by-value)
php
```
$labels = FluentCart\App\Models\Label::all();

foreach ($labels as $label) {
 $value = $label->value;
 if (is_array($value) && isset($value['color']) && $value['color'] === 'gold') {
 echo "Gold Label: " . $value['name'];
 }
}```

### Delete Label [](#delete-label)
php
```
$label = FluentCart\App\Models\Label::find(1);
$label->delete();```

### Create Simple Label [](#create-simple-label)
php
```
$label = FluentCart\App\Models\Label::create([
 'value' => 'New Customer'
]);```

### Get Labels Ordered by ID [](#get-labels-ordered-by-id)
php
```
$orderedLabels = FluentCart\App\Models\Label::orderBy('id', 'asc')->get();```

---

## LabelRelationship

Source: https://dev.fluentcart.com/database/models/label-relationship.html


| DB Table Name | {wp_db_prefix}_fct_label_relationships | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-label-relationships-table) | 
| Source File | fluent-cart/app/Models/LabelRelationship.php | 
| Name Space | FluentCart\App\Models | 
| Class | FluentCart\App\Models\LabelRelationship | 
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| label_id | Integer | Reference to label | 
| labelable_id | Integer | ID of the labeled object | 
| labelable_type | String | Type of the labeled object (Order, Customer, etc.) | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Casts [](#casts)

| Attribute | Cast Type | 
| --- | --- |
| label_id | integer | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$labelRelationship = FluentCart\App\Models\LabelRelationship::find(1);

$labelRelationship->id; // returns id
$labelRelationship->label_id; // returns label ID
$labelRelationship->labelable_id; // returns labeled object ID
$labelRelationship->labelable_type; // returns labeled object type```

## Relations [](#relations)

This model has the following relationships that you can use
### labelable [](#labelable)

Access the labeled object (polymorphic `morphTo` relationship)

- return `mixed` (Order, Customer, or other labeled models)

#### Example: [](#example)
php
```
// Accessing Labeled Object
$labeledObject = $labelRelationship->labelable;

// For Filtering by labeled object type
$orderLabels = FluentCart\App\Models\LabelRelationship::where('labelable_type', 'Order')->get();
$customerLabels = FluentCart\App\Models\LabelRelationship::where('labelable_type', 'Customer')->get();```

## Usage Examples [](#usage-examples)

### Get Label Relationships [](#get-label-relationships)
php
```
$labelRelationship = FluentCart\App\Models\LabelRelationship::find(1);
echo "Label ID: " . $labelRelationship->label_id;
echo "Object Type: " . $labelRelationship->labelable_type;
echo "Object ID: " . $labelRelationship->labelable_id;```

### Create Label Relationship [](#create-label-relationship)
php
```
$labelRelationship = FluentCart\App\Models\LabelRelationship::create([
 'label_id' => 1,
 'labelable_id' => 123,
 'labelable_type' => 'Order'
]);```

### Get All Label Relationships [](#get-all-label-relationships)
php
```
$labelRelationships = FluentCart\App\Models\LabelRelationship::all();

foreach ($labelRelationships as $relationship) {
 echo "Label ID: " . $relationship->label_id;
 echo "Object: " . $relationship->labelable_type . " #" . $relationship->labelable_id;
}```

### Get Label Relationships by Type [](#get-label-relationships-by-type)
php
```
$orderLabels = FluentCart\App\Models\LabelRelationship::where('labelable_type', 'Order')->get();
$customerLabels = FluentCart\App\Models\LabelRelationship::where('labelable_type', 'Customer')->get();```

### Get Label Relationships with Labeled Objects [](#get-label-relationships-with-labeled-objects)
php
```
$labelRelationships = FluentCart\App\Models\LabelRelationship::all();

foreach ($labelRelationships as $relationship) {
 $labeledObject = $relationship->labelable;
 echo "Labeled Object: " . get_class($labeledObject) . " #" . $labeledObject->id;
}```

### Get Labels for Specific Object [](#get-labels-for-specific-object)
php
```
$orderLabels = FluentCart\App\Models\LabelRelationship::where('labelable_type', 'Order')
 ->where('labelable_id', 123)
 ->get();```

### Get Labels for Specific Label [](#get-labels-for-specific-label)
php
```
$labelRelationships = FluentCart\App\Models\LabelRelationship::where('label_id', 1)->get();

foreach ($labelRelationships as $relationship) {
 echo "Object: " . $relationship->labelable_type . " #" . $relationship->labelable_id;
}```

### Update Label Relationship [](#update-label-relationship)
php
```
$labelRelationship = FluentCart\App\Models\LabelRelationship::find(1);
$labelRelationship->update([
 'label_id' => 2
]);```

### Delete Label Relationship [](#delete-label-relationship)
php
```
$labelRelationship = FluentCart\App\Models\LabelRelationship::find(1);
$labelRelationship->delete();```

### Get Label Relationships for Multiple Objects [](#get-label-relationships-for-multiple-objects)
php
```
$labelRelationships = FluentCart\App\Models\LabelRelationship::where('labelable_type', 'Order')
 ->whereIn('labelable_id', [123, 124, 125])
 ->get();```

---

## License

Source: https://dev.fluentcart.com/database/models/license.html

Pro
# License Model [](#license-model)

| DB Table Name | {wp_db_prefix}_fct_licenses | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-licenses-table) | 
| Source File | fluent-cart-pro/app/Modules/Licensing/Models/License.php | 
| Name Space | FluentCartPro\App\Modules\Licensing\Models | 
| Class | FluentCartPro\App\Modules\Licensing\Models\License | 
| Plugin | FluentCart Pro | 
## Properties [](#properties)

- **Table**: `fct_licenses`
- **Primary Key**: `id`
- **Guarded**: `['id']`
- **Fillable**: `['status', 'limit', 'activation_count', 'license_key', 'product_id', 'variation_id', 'order_id', 'parent_id', 'customer_id', 'expiration_date', 'last_reminder_sent', 'last_reminder_type', 'subscription_id', 'config']`
- **Traits**: `CanSearch`

## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| status | String | License status (active, inactive, expired, disabled) | 
| limit | Integer | Activation limit (0 = unlimited) | 
| activation_count | Integer | Current activation count | 
| license_key | String | Unique license key | 
| product_id | Integer | Reference to product | 
| variation_id | Integer | Reference to product variation | 
| order_id | Integer | Reference to order | 
| parent_id | Integer | Parent license ID (for renewals) | 
| customer_id | Integer | Reference to customer | 
| expiration_date | Date Time | License expiration date (null = lifetime) | 
| last_reminder_sent | Date Time | Last reminder sent date | 
| last_reminder_type | String | Last reminder type | 
| subscription_id | Integer | Reference to subscription | 
| config | JSON | License configuration (auto-cast via accessor/mutator) | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$license = FluentCartPro\App\Modules\Licensing\Models\License::find(1);

$license->id; // returns id
$license->license_key; // returns license key
$license->status; // returns status
$license->activation_count; // returns activation count
$license->limit; // returns activation limit
$license->config; // returns config as array (auto-decoded)```

## Scopes [](#scopes)

This model has the following scopes that you can use
### scopeSearch($query, $search) [](#scopesearch-query-search)

Search licenses by license key, order ID, product title, or customer name/email

- Parameters 

 - $search - string

#### Usage: [](#usage-1)
php
```
// Search across license key, order ID, product title, customer name/email
$licenses = FluentCartPro\App\Modules\Licensing\Models\License::search('[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)')->get();```

### scopeStatus($query, $status) [](#scopestatus-query-status)

Filter licenses by status with smart logic. Supports: `active`, `expired`, `disabled`, `inactive`. Passing `'all'` or empty value returns all licenses.

- Parameters 

 - $status - string

#### Usage: [](#usage-2)
php
```
// Get active licenses (not expired, status is 'active')
$licenses = FluentCartPro\App\Modules\Licensing\Models\License::status('active')->get();

// Get expired licenses (expiration_date < now)
$licenses = FluentCartPro\App\Modules\Licensing\Models\License::status('expired')->get();

// Get inactive licenses (status 'active' but no activations)
$licenses = FluentCartPro\App\Modules\Licensing\Models\License::status('inactive')->get();

// Get disabled licenses
$licenses = FluentCartPro\App\Modules\Licensing\Models\License::status('disabled')->get();```

### scopeProducts($query, $productIds) [](#scopeproducts-query-productids)

Filter licenses by product IDs

- Parameters 

 - $productIds - array

#### Usage: [](#usage-3)
php
```
// Get all licenses for specific products
$licenses = FluentCartPro\App\Modules\Licensing\Models\License::products([1, 2, 3])->get();```

## Relations [](#relations)

This model has the following relationships that you can use
### customer [](#customer)

Access the associated customer (BelongsTo)

- return `FluentCart\App\Models\Customer` Model

#### Example: [](#example)
php
```
// Accessing Customer
$customer = $license->customer;

// For Filtering by customer relationship
$licenses = FluentCartPro\App\Modules\Licensing\Models\License::whereHas('customer', function($query) {
 $query->where('email', '[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)');
})->get();```

### order [](#order)

Access the associated order (BelongsTo)

- return `FluentCart\App\Models\Order` Model

#### Example: [](#example-1)
php
```
// Accessing Order
$order = $license->order;

// For Filtering by order relationship
$licenses = FluentCartPro\App\Modules\Licensing\Models\License::whereHas('order', function($query) {
 $query->where('status', 'completed');
})->get();```

### product [](#product)

Access the associated product (BelongsTo)

- return `FluentCart\App\Models\Product` Model

#### Example: [](#example-2)
php
```
// Accessing Product
$product = $license->product;

// For Filtering by product relationship
$licenses = FluentCartPro\App\Modules\Licensing\Models\License::whereHas('product', function($query) {
 $query->where('post_status', 'publish');
})->get();```

### variation [](#variation)

Access the associated product variation (BelongsTo)

- return `FluentCart\App\Models\ProductVariation` Model

#### Example: [](#example-3)
php
```
// Accessing Product Variation
$variation = $license->variation;```

### productVariant [](#productvariant)

Alias for variation - access the associated product variation (BelongsTo)

- return `FluentCart\App\Models\ProductVariation` Model

#### Example: [](#example-4)
php
```
// Accessing Product Variant
$variant = $license->productVariant;```

### productDetails [](#productdetails)

Access the associated product details (BelongsTo)

- return `FluentCart\App\Models\ProductDetail` Model

#### Example: [](#example-5)
php
```
// Accessing Product Details
$details = $license->productDetails;```

### subscription [](#subscription)

Access the associated subscription (BelongsTo)

- return `FluentCart\App\Models\Subscription` Model

#### Example: [](#example-6)
php
```
// Accessing Subscription
$subscription = $license->subscription;

// For Filtering by subscription relationship
$licenses = FluentCartPro\App\Modules\Licensing\Models\License::whereHas('subscription', function($query) {
 $query->where('status', 'active');
})->get();```

### activations [](#activations)

Access license activations (HasMany)

- return `FluentCartPro\App\Modules\Licensing\Models\LicenseActivation` Collection

#### Example: [](#example-7)
php
```
// Accessing Activations
$activations = $license->activations;

// For Filtering by activations relationship
$licenses = FluentCartPro\App\Modules\Licensing\Models\License::whereHas('activations', function($query) {
 $query->where('status', 'active');
})->get();```

### labels [](#labels)

Access license labels (MorphMany)

- return `FluentCart\App\Models\LabelRelationship` Collection

#### Example: [](#example-8)
php
```
// Accessing Labels
$labels = $license->labels;```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### getConfigAttribute($value) [](#getconfigattribute-value)

Get config as array (accessor). Returns empty array if value is null or not valid JSON.

- Parameters 

 - $value - mixed

- Returns `array`

#### Usage [](#usage-4)
php
```
$config = $license->config; // Returns array```

### setConfigAttribute($value) [](#setconfigattribute-value)

Set config from array (mutator). Non-array or falsy values are stored as empty array JSON.

- Parameters 

 - $value - array|null

- Returns `void`

#### Usage [](#usage-5)
php
```
$license->config = ['auto_renew' => true, 'max_sites' => 5];```

### isActive() [](#isactive)

Check if license is active. Returns true if status is `active` or `inactive`.

- Parameters 

 - none

- Returns `boolean`

#### Usage [](#usage-6)
php
```
$isActive = $license->isActive();```

### isExpired() [](#isexpired)

Check if license is expired. Takes into account the configurable grace period from `LicenseHelper::getLicenseGracePeriodDays()`.

- Parameters 

 - none

- Returns `boolean`

#### Usage [](#usage-7)
php
```
$isExpired = $license->isExpired();```

### isValid() [](#isvalid)

Check if license is both not expired and active.

- Parameters 

 - none

- Returns `boolean`

#### Usage [](#usage-8)
php
```
$isValid = $license->isValid();```

### getPublicStatus() [](#getpublicstatus)

Get the public-facing status string. Returns `'valid'`, `'expired'`, or `'invalid'`.

- Parameters 

 - none

- Returns `string`

#### Usage [](#usage-9)
php
```
$publicStatus = $license->getPublicStatus();```

### getHumanReadableStatus() [](#gethumanreadablestatus)

Get human readable status. Returns `'active'` for both `active` and `inactive` statuses, otherwise returns the raw status.

- Parameters 

 - none

- Returns `string`

#### Usage [](#usage-10)
php
```
$readableStatus = $license->getHumanReadableStatus();```

### getActivationLimit() [](#getactivationlimit)

Get remaining activation count. Returns `'unlimited'` if limit is 0 (unlimited), otherwise returns the number of remaining activations.

- Parameters 

 - none

- Returns `string|integer` - `'unlimited'` or remaining activation count

#### Usage [](#usage-11)
php
```
$remaining = $license->getActivationLimit();```

### hasActivationLeft() [](#hasactivationleft)

Check if there are any activations remaining.

- Parameters 

 - none

- Returns `boolean`

#### Usage [](#usage-12)
php
```
$hasLeft = $license->hasActivationLeft();```

### updateLicenseStatus($newStatus) [](#updatelicensestatus-newstatus)

Update the license status and fire action hooks. Does nothing if the new status is the same as current.

- Parameters 

 - $newStatus - string

- Returns `$this`

**Actions Triggered:**

- `fluent_cart_sl/license_status_updated`
- `fluent_cart_sl/license_status_updated_to_{$newStatus}`

#### Usage [](#usage-13)
php
```
$license->updateLicenseStatus('disabled');```

### increaseActivationCount() [](#increaseactivationcount)

Increment the activation count by 1 and fire an action hook.

- Parameters 

 - none

- Returns `$this`

**Actions Triggered:**

- `fluent_cart_sl/license_limit_increased`

#### Usage [](#usage-14)
php
```
$license->increaseActivationCount();```

### decreaseActivationCount() [](#decreaseactivationcount)

Decrement the activation count by 1. Does nothing if count is already 0.

- Parameters 

 - none

- Returns `$this`

**Actions Triggered:**

- `fluent_cart_sl/license_limit_decreased`

#### Usage [](#usage-15)
php
```
$license->decreaseActivationCount();```

### increaseLimit($newLimit) [](#increaselimit-newlimit)

Set a new activation limit. Passing `'unlimited'` or `0` sets the limit to 0 (unlimited).

- Parameters 

 - $newLimit - integer|string

- Returns `$this`

**Actions Triggered:**

- `fluent_cart_sl/license_limit_increased`

#### Usage [](#usage-16)
php
```
$license->increaseLimit(10);
$license->increaseLimit('unlimited');```

### regenerateKey() [](#regeneratekey)

Generate a new license key using `UUID::licensesKey()` and fire an action hook.

- Parameters 

 - none

- Returns `$this`

**Actions Triggered:**

- `fluent_cart_sl/license_key_regenerated`

#### Usage [](#usage-17)
php
```
$license->regenerateKey();```

### extendValidity($newDate) [](#extendvalidity-newdate)

Extend the license expiration date. Passing `'lifetime'` or `null` removes the expiration (lifetime license). Automatically re-activates the license if status is not `active` or `inactive`.

- Parameters 

 - $newDate - string|null (`'lifetime'`, `null`, or a date string)

- Returns `$this`

**Actions Triggered:**

- `fluent_cart_sl/license_validity_extended`

#### Usage [](#usage-18)
php
```
$license->extendValidity('2025-12-31');
$license->extendValidity('lifetime'); // Make lifetime```

### recountActivations() [](#recountactivations)

Recount active (non-local) activations and update the `activation_count`. If status is `inactive`, it is set to `active`.

- Parameters 

 - none

- Returns `$this`

#### Usage [](#usage-19)
php
```
$license->recountActivations();```

### getDownloads() [](#getdownloads)

Get downloadable files associated with the license. Resolves downloads based on product and variation, with download URLs generated via `Helper::generateDownloadFileLink()`.

- Parameters 

 - none

- Returns `Collection|array`

#### Usage [](#usage-20)
php
```
$downloads = $license->getDownloads();
foreach ($downloads as $download) {
 echo $download->product_title;
 echo $download->download_url;
}```

### getPreviousOrders() [](#getpreviousorders)

Get previous orders associated with this license from the `prev_order_ids` config key.

- Parameters 

 - none

- Returns `Collection|array`

#### Usage [](#usage-21)
php
```
$previousOrders = $license->getPreviousOrders();```

### getRenewalUrl() [](#getrenewalurl)

Get the renewal URL for an expired license with a subscription. Returns empty string if not expired or no subscription.

- Parameters 

 - none

- Returns `string`

#### Usage [](#usage-22)
php
```
$renewalUrl = $license->getRenewalUrl();```

### hasUpgrades() [](#hasupgrades)

Check if the license has available upgrade paths. Returns false if the license is not active, or if the order item is a bundle payment type.

- Parameters 

 - none

- Returns `boolean`

#### Usage [](#usage-23)
php
```
if ($license->hasUpgrades()) {
 // Show upgrade options
}```

## License Statuses [](#license-statuses)

License statuses used in FluentCart Pro:

- `active` - License is active and can be used
- `inactive` - License is active but has no activations
- `expired` - License has expired (derived from expiration_date)
- `disabled` - License is disabled

## Usage Examples [](#usage-examples)

### Get Customer Licenses [](#get-customer-licenses)
php
```
$customer = FluentCart\App\Models\Customer::find(123);
$licenses = $customer->licenses()->status('active')->get();

foreach ($licenses as $license) {
 echo "License: " . $license->license_key . " - " . $license->status;
}```

### Search Licenses [](#search-licenses)
php
```
$licenses = FluentCartPro\App\Modules\Licensing\Models\License::search('example.com')
 ->status('active')
 ->get();```

### Check License Activation [](#check-license-activation)
php
```
$license = FluentCartPro\App\Modules\Licensing\Models\License::find(1);

if ($license->hasActivationLeft()) {
 echo "Remaining activations: " . $license->getActivationLimit();
} else {
 echo "No activations remaining";
}```

### Get License with Relationships [](#get-license-with-relationships)
php
```
$license = FluentCartPro\App\Modules\Licensing\Models\License::with([
 'customer',
 'product',
 'order',
 'activations'
])->find(1);```

### Filter by Products [](#filter-by-products)
php
```
$licenses = FluentCartPro\App\Modules\Licensing\Models\License::products([1, 2, 3])
 ->status('active')
 ->get();```

**Plugin**: FluentCart Pro

---

## LicenseMeta

Source: https://dev.fluentcart.com/database/models/license-meta.html

Pro
# License Meta Model [](#license-meta-model)

| DB Table Name | {wp_db_prefix}_fct_license_meta | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-license-meta-table) | 
| Source File | fluent-cart-pro/app/Modules/Licensing/Models/LicenseMeta.php | 
| Name Space | FluentCartPro\App\Modules\Licensing\Models | 
| Class | FluentCartPro\App\Modules\Licensing\Models\LicenseMeta | 
| Plugin | FluentCart Pro | 
## Properties [](#properties)

- **Table**: `fct_license_meta`
- **Primary Key**: `id`
- **Guarded**: `['id']`
- **Fillable**: `['object_id', 'object_type', 'meta_key', 'meta_value']`

Note on Schema
The fillable attributes use `object_id` and `object_type` (not `license_id`). This is a polymorphic-style meta table that can store meta for different object types.
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| object_id | Integer | Reference to the parent object (e.g., license ID) | 
| object_type | String | Type of the parent object | 
| meta_key | String | Meta key name | 
| meta_value | Text | Meta value (auto JSON encode/decode via accessor/mutator) | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$licenseMeta = FluentCartPro\App\Modules\Licensing\Models\LicenseMeta::find(1);

$licenseMeta->id; // returns id
$licenseMeta->object_id; // returns object ID
$licenseMeta->object_type; // returns object type
$licenseMeta->meta_key; // returns meta key
$licenseMeta->meta_value; // returns meta value (auto-decoded from JSON if applicable)```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### getMetaValueAttribute($value) [](#getmetavalueattribute-value)

Get meta value with automatic JSON decoding (accessor). If the stored value is a JSON string, it is decoded to an array. Otherwise returns the original value.

- Parameters 

 - $value - mixed

- Returns `mixed` - array if valid JSON string, otherwise original value

#### Usage [](#usage-1)
php
```
$metaValue = $licenseMeta->meta_value; // Returns array if JSON, original value otherwise```

### setMetaValueAttribute($value) [](#setmetavalueattribute-value)

Set meta value with automatic JSON encoding (mutator). Arrays and objects are JSON encoded before storage.

- Parameters 

 - $value - array|object|string

- Returns `void`

#### Usage [](#usage-2)
php
```
// Set array value (will be JSON encoded)
$licenseMeta->meta_value = ['site_url' => 'https://example.com', 'activated_at' => '2024-01-01'];

// Set string value (stored as-is)
$licenseMeta->meta_value = 'simple string value';```

## Usage Examples [](#usage-examples)

### Get License Meta [](#get-license-meta)
php
```
$licenseMeta = FluentCartPro\App\Modules\Licensing\Models\LicenseMeta::where('object_id', 123)
 ->where('meta_key', 'activation_data')
 ->first();

if ($licenseMeta) {
 $data = $licenseMeta->meta_value; // Returns array (auto-decoded)
}```

### Set License Custom Meta [](#set-license-custom-meta)
php
```
FluentCartPro\App\Modules\Licensing\Models\LicenseMeta::updateOrCreate(
 [
 'object_id' => 123,
 'object_type' => 'license',
 'meta_key' => 'custom_field'
 ],
 [
 'meta_value' => ['value' => 'custom data', 'type' => 'text']
 ]
);```

### Get All Meta for an Object [](#get-all-meta-for-an-object)
php
```
$metaData = FluentCartPro\App\Modules\Licensing\Models\LicenseMeta::where('object_id', 123)
 ->where('object_type', 'license')
 ->pluck('meta_value', 'meta_key')
 ->toArray();```

### Create License Meta [](#create-license-meta)
php
```
$licenseMeta = FluentCartPro\App\Modules\Licensing\Models\LicenseMeta::create([
 'object_id' => 123,
 'object_type' => 'license',
 'meta_key' => 'renewal_info',
 'meta_value' => ['auto_renew' => true, 'next_date' => '2025-01-01']
]);```

### Update License Meta [](#update-license-meta)
php
```
$licenseMeta = FluentCartPro\App\Modules\Licensing\Models\LicenseMeta::find(1);
$licenseMeta->update([
 'meta_value' => ['updated_value' => true]
]);```

### Get Meta by Key [](#get-meta-by-key)
php
```
$activationMetas = FluentCartPro\App\Modules\Licensing\Models\LicenseMeta::where('meta_key', 'activation_data')->get();```

### Delete License Meta [](#delete-license-meta)
php
```
$licenseMeta = FluentCartPro\App\Modules\Licensing\Models\LicenseMeta::find(1);
$licenseMeta->delete();```

**Plugin**: FluentCart Pro

---

## LicenseActivation

Source: https://dev.fluentcart.com/database/models/license-activation.html

Pro
# License Activation Model [](#license-activation-model)

| DB Table Name | {wp_db_prefix}_fct_license_activations | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-license-activations-table) | 
| Source File | fluent-cart-pro/app/Modules/Licensing/Models/LicenseActivation.php | 
| Name Space | FluentCartPro\App\Modules\Licensing\Models | 
| Class | FluentCartPro\App\Modules\Licensing\Models\LicenseActivation | 
| Plugin | FluentCart Pro | 
## Properties [](#properties)

- **Table**: `fct_license_activations`
- **Primary Key**: `id`
- **Guarded**: `['id']`
- **Fillable**: `['site_id', 'license_id', 'status', 'is_local', 'product_id', 'last_update_date', 'last_update_version', 'variation_id', 'activation_method', 'activation_hash']`

## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| site_id | Integer | Foreign key to license sites | 
| license_id | Integer | Foreign key to licenses | 
| status | String | Activation status | 
| is_local | Boolean | Whether this is a local activation | 
| product_id | Integer | Associated product ID | 
| last_update_date | DateTime | Last update timestamp | 
| last_update_version | String | Last update version | 
| variation_id | Integer | Product variation ID | 
| activation_method | String | Method used for activation | 
| activation_hash | String | Unique activation hash | 
| created_at | DateTime | Creation timestamp | 
| updated_at | DateTime | Last update timestamp | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$activation = FluentCartPro\App\Modules\Licensing\Models\LicenseActivation::find(1);

$activation->id; // returns id
$activation->license_id; // returns license ID
$activation->site_id; // returns site ID
$activation->status; // returns status
$activation->is_local; // returns whether local
$activation->activation_hash; // returns activation hash```

## Relations [](#relations)

This model has the following relationships that you can use
### license [](#license)

Access the associated license (BelongsTo)

- return `FluentCartPro\App\Modules\Licensing\Models\License` Model

#### Example: [](#example)
php
```
// Accessing License
$license = $activation->license;

// For Filtering by license relationship
$activations = FluentCartPro\App\Modules\Licensing\Models\LicenseActivation::whereHas('license', function($query) {
 $query->where('status', 'active');
})->get();```

### site [](#site)

Access the associated license site (BelongsTo)

- return `FluentCartPro\App\Modules\Licensing\Models\LicenseSite` Model

#### Example: [](#example-1)
php
```
// Accessing Site
$site = $activation->site;

// For Filtering by site relationship
$activations = FluentCartPro\App\Modules\Licensing\Models\LicenseActivation::whereHas('site', function($query) {
 $query->where('site_url', 'like', '%example.com%');
})->get();```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### updateStatus($newStatus) [](#updatestatus-newstatus)

Updates the activation status and triggers related action hooks.

- Parameters 

 - $newStatus - string - New status value

- Returns `$this` - Current model instance

**Actions Triggered:**

- `fluent_cart_sl/license_activation_status_updated`
- `fluent_cart_sl/license_activation_status_updated_to_{$newStatus}`

#### Usage [](#usage-1)
php
```
$activation = FluentCartPro\App\Modules\Licensing\Models\LicenseActivation::find(1);
$activation->updateStatus('active');```

## Usage Examples [](#usage-examples)

### Creating License Activation [](#creating-license-activation)
php
```
use FluentCartPro\App\Modules\Licensing\Models\LicenseActivation;

$activation = LicenseActivation::create([
 'site_id' => 1,
 'license_id' => 123,
 'status' => 'active',
 'is_local' => false,
 'product_id' => 456,
 'variation_id' => 789,
 'activation_method' => 'api',
 'activation_hash' => 'unique_hash_here'
]);```

### Querying Activations [](#querying-activations)
php
```
// Get all activations for a license
$activations = LicenseActivation::where('license_id', 123)->get();

// Get active activations
$activeActivations = LicenseActivation::where('status', 'active')->get();

// Get non-local active activations
$remoteActivations = LicenseActivation::where('status', 'active')
 ->where('is_local', '!=', 1)
 ->get();

// Get activations with license relationship
$activationsWithLicense = LicenseActivation::with('license')->get();

// Get activations with site relationship
$activationsWithSite = LicenseActivation::with('site')->get();```

### Updating Activation Status [](#updating-activation-status)
php
```
$activation = LicenseActivation::find(1);

// Update status (triggers action hooks)
$activation->updateStatus('inactive');

// Direct status update (no action hooks)
$activation->status = 'inactive';
$activation->save();```

## Related Documentation [](#related-documentation)

- [License Model](https://dev.fluentcart.com/database/models/license.html) - Main license model
- [License Site Model](https://dev.fluentcart.com/database/models/license-site.html) - Licensed site management
- [License Meta Model](https://dev.fluentcart.com/database/models/license-meta.html) - License metadata

**Plugin**: FluentCart Pro

---

## LicenseSite

Source: https://dev.fluentcart.com/database/models/license-site.html

Pro
# License Site Model [](#license-site-model)

| DB Table Name | {wp_db_prefix}_fct_license_sites | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-license-sites-table) | 
| Source File | fluent-cart-pro/app/Modules/Licensing/Models/LicenseSite.php | 
| Name Space | FluentCartPro\App\Modules\Licensing\Models | 
| Class | FluentCartPro\App\Modules\Licensing\Models\LicenseSite | 
| Plugin | FluentCart Pro | 
## Properties [](#properties)

- **Table**: `fct_license_sites`
- **Primary Key**: `id`
- **Guarded**: `['id']`
- **Fillable**: `['site_url', 'server_version', 'platform_version', 'other']`

## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| site_url | String | Site URL | 
| server_version | String | Server version | 
| platform_version | String | Platform version | 
| other | JSON | Additional site information (auto JSON encode/decode via accessor/mutator) | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$licenseSite = FluentCartPro\App\Modules\Licensing\Models\LicenseSite::find(1);

$licenseSite->id; // returns id
$licenseSite->site_url; // returns site URL
$licenseSite->server_version; // returns server version
$licenseSite->platform_version; // returns platform version
$licenseSite->other; // returns decoded array```

## Relations [](#relations)

This model has the following relationships that you can use
### activations [](#activations)

Access all license activations for this site (HasMany)

- return `FluentCartPro\App\Modules\Licensing\Models\LicenseActivation` Model Collection

#### Example: [](#example)
php
```
// Accessing Activations
$activations = $licenseSite->activations;

// For Filtering by activations relationship
$licenseSites = FluentCartPro\App\Modules\Licensing\Models\LicenseSite::whereHas('activations', function($query) {
 $query->where('status', 'active');
})->get();```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### setOtherAttribute($value) [](#setotherattribute-value)

Set other information with automatic JSON encoding (mutator). Arrays and objects are JSON encoded before storage.

- Parameters 

 - $value - mixed (array, object, or string)

- Returns `void`

#### Usage [](#usage-1)
php
```
$licenseSite->other = ['domain' => 'example.com', 'ssl' => true];
// Automatically JSON encodes arrays and objects```

### getOtherAttribute($value) [](#getotherattribute-value)

Get other information with automatic JSON decoding (accessor). Returns the decoded array if valid JSON, otherwise returns an empty array.

- Parameters 

 - $value - mixed

- Returns `array`

#### Usage [](#usage-2)
php
```
$other = $licenseSite->other; // Returns decoded array, or empty array if invalid```

### isLocalSite() [](#islocalsite)

Check if the site is a local development site. Checks the `url` property against local domain extensions (`.lab`, `.local`, `.test`, `.localhost`) and development subdomains (`staging`, `dev`, `development`, `test`, `testing`). Result is filterable via the `fluent_cart_sl/is_local_site` filter hook.

- Parameters 

 - none

- Returns `boolean`

#### Usage [](#usage-3)
php
```
$isLocal = $licenseSite->isLocalSite();
// Returns true if site is local (lab, local, test, localhost, staging, dev, etc.)```

## Usage Examples [](#usage-examples)

### Get License Sites [](#get-license-sites)
php
```
$licenseSite = FluentCartPro\App\Modules\Licensing\Models\LicenseSite::find(1);
echo "Site URL: " . $licenseSite->site_url;
echo "Server Version: " . $licenseSite->server_version;
echo "Platform Version: " . $licenseSite->platform_version;```

### Create License Site [](#create-license-site)
php
```
$licenseSite = FluentCartPro\App\Modules\Licensing\Models\LicenseSite::create([
 'site_url' => 'https://example.com',
 'server_version' => 'PHP 8.1',
 'platform_version' => 'WordPress 6.0',
 'other' => [
 'domain' => 'example.com',
 'ssl' => true,
 'theme' => 'custom-theme'
 ]
]);```

### Get License Sites with Activations [](#get-license-sites-with-activations)
php
```
$licenseSites = FluentCartPro\App\Modules\Licensing\Models\LicenseSite::with('activations')->get();

foreach ($licenseSites as $site) {
 echo "Site: " . $site->site_url;
 echo "Activations: " . $site->activations->count();
}```

### Get Local Sites [](#get-local-sites)
php
```
$licenseSites = FluentCartPro\App\Modules\Licensing\Models\LicenseSite::all();

foreach ($licenseSites as $site) {
 if ($site->isLocalSite()) {
 echo "Local Site: " . $site->site_url;
 }
}```

### Get Sites by URL [](#get-sites-by-url)
php
```
$site = FluentCartPro\App\Modules\Licensing\Models\LicenseSite::where('site_url', 'https://example.com')->first();```

### Update License Site [](#update-license-site)
php
```
$licenseSite = FluentCartPro\App\Modules\Licensing\Models\LicenseSite::find(1);
$licenseSite->update([
 'server_version' => 'PHP 8.2',
 'platform_version' => 'WordPress 6.1',
 'other' => ['updated' => true]
]);```

### Get Sites with Other Information [](#get-sites-with-other-information)
php
```
$licenseSites = FluentCartPro\App\Modules\Licensing\Models\LicenseSite::all();

foreach ($licenseSites as $site) {
 $other = $site->other;
 if (isset($other['ssl']) && $other['ssl']) {
 echo "SSL Site: " . $site->site_url;
 }
}```

### Delete License Site [](#delete-license-site)
php
```
$licenseSite = FluentCartPro\App\Modules\Licensing\Models\LicenseSite::find(1);
$licenseSite->delete();```

**Plugin**: FluentCart Pro

---

## OrderPromotion

Source: https://dev.fluentcart.com/database/models/order-promotion.html

Pro
# Order Promotion Model [](#order-promotion-model)

| DB Table Name | {wp_db_prefix}_fct_order_promotions | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-order-promotions-table) | 
| Source File | fluent-cart-pro/app/Modules/Promotional/Models/OrderPromotion.php | 
| Name Space | FluentCartPro\App\Modules\Promotional\Models | 
| Class | FluentCartPro\App\Modules\Promotional\Models\OrderPromotion | 
| Plugin | FluentCart Pro | 
## Properties [](#properties)

- **Table**: `fct_order_promotions`
- **Primary Key**: `id`
- **Guarded**: `['id']`
- **Fillable**: `['hash', 'parent_id', 'type', 'status', 'src_object_id', 'src_object_type', 'title', 'description', 'conditions', 'config', 'priority']`

## Boot Logic [](#boot-logic)

The model registers a `creating` event that auto-generates a `hash` (using `md5('fct_promotion_' . wp_generate_uuid4() . time())`) if one is not provided, and defaults empty `conditions` and `config` to empty JSON arrays.
## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| hash | String | Unique promotion hash (auto-generated on creation) | 
| parent_id | Integer | Parent promotion ID | 
| type | String | Promotion type | 
| status | String | Promotion status | 
| src_object_id | Integer | Source object ID | 
| src_object_type | String | Source object type | 
| title | String | Promotion title | 
| description | Text | Promotion description | 
| conditions | JSON | Promotion conditions (auto JSON encode/decode via accessor/mutator) | 
| config | JSON | Promotion configuration (auto JSON encode/decode via accessor/mutator) | 
| priority | Integer | Promotion priority | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$orderPromotion = FluentCartPro\App\Modules\Promotional\Models\OrderPromotion::find(1);

$orderPromotion->id; // returns id
$orderPromotion->hash; // returns hash
$orderPromotion->type; // returns type
$orderPromotion->status; // returns status
$orderPromotion->conditions; // returns decoded array
$orderPromotion->config; // returns decoded array```

## Relations [](#relations)

This model has the following relationships that you can use
### product_variant [](#product-variant)

Access the associated product variant (BelongsTo via `src_object_id`)

- return `FluentCart\App\Models\ProductVariation` Model

#### Example: [](#example)
php
```
// Accessing Product Variant
$productVariant = $orderPromotion->product_variant;

// For Filtering by product variant relationship
$orderPromotions = FluentCartPro\App\Modules\Promotional\Models\OrderPromotion::whereHas('product_variant', function($query) {
 $query->where('status', 'active');
})->get();```

## Methods [](#methods)

Along with Global Model methods, this model has few helper methods.
### setConditionsAttribute($value) [](#setconditionsattribute-value)

Set conditions with automatic JSON encoding (mutator). Arrays and objects are JSON encoded before storage.

- Parameters 

 - $value - mixed (array, object, or string)

- Returns `void`

#### Usage [](#usage-1)
php
```
$orderPromotion->conditions = ['min_amount' => 100, 'product_ids' => [1, 2, 3]];
// Automatically JSON encodes arrays and objects```

### getConditionsAttribute($value) [](#getconditionsattribute-value)

Get conditions with automatic JSON decoding (accessor). If the stored value is a JSON string, it is decoded to an array.

- Parameters 

 - $value - mixed

- Returns `mixed` - array if JSON string, otherwise original value

#### Usage [](#usage-2)
php
```
$conditions = $orderPromotion->conditions; // Returns decoded array```

### setConfigAttribute($value) [](#setconfigattribute-value)

Set config with automatic JSON encoding (mutator). Arrays and objects are JSON encoded before storage.

- Parameters 

 - $value - mixed (array, object, or string)

- Returns `void`

#### Usage [](#usage-3)
php
```
$orderPromotion->config = ['discount_type' => 'percentage', 'discount_value' => 10];
// Automatically JSON encodes arrays and objects```

### getConfigAttribute($value) [](#getconfigattribute-value)

Get config with automatic JSON decoding (accessor). If the stored value is a JSON string, it is decoded to an array.

- Parameters 

 - $value - mixed

- Returns `mixed` - array if JSON string, otherwise original value

#### Usage [](#usage-4)
php
```
$config = $orderPromotion->config; // Returns decoded array```

## Usage Examples [](#usage-examples)

### Create Order Promotion [](#create-order-promotion)
php
```
$orderPromotion = FluentCartPro\App\Modules\Promotional\Models\OrderPromotion::create([
 'type' => 'order_bump',
 'status' => 'active',
 'src_object_id' => 123,
 'src_object_type' => 'product_variation',
 'title' => 'Add-on Product',
 'description' => 'Enhance your order with this add-on',
 'conditions' => [
 'min_amount' => 50,
 'product_ids' => [1, 2, 3]
 ],
 'config' => [
 'discount_type' => 'percentage',
 'discount_value' => 15,
 'display_position' => 'checkout'
 ],
 'priority' => 1
]);
// Hash is automatically generated during creation```

### Get Active Promotions [](#get-active-promotions)
php
```
$activePromotions = FluentCartPro\App\Modules\Promotional\Models\OrderPromotion::where('status', 'active')->get();```

### Get Promotions by Type [](#get-promotions-by-type)
php
```
$orderBumps = FluentCartPro\App\Modules\Promotional\Models\OrderPromotion::where('type', 'order_bump')->get();
$upsells = FluentCartPro\App\Modules\Promotional\Models\OrderPromotion::where('type', 'upsell')->get();```

### Get Promotions with Product Variants [](#get-promotions-with-product-variants)
php
```
$promotionsWithVariants = FluentCartPro\App\Modules\Promotional\Models\OrderPromotion::with('product_variant')->get();

foreach ($promotionsWithVariants as $promotion) {
 echo "Promotion: " . $promotion->title;
 if ($promotion->product_variant) {
 echo "Product: " . $promotion->product_variant->variation_title;
 }
}```

### Get Promotions by Priority [](#get-promotions-by-priority)
php
```
$orderedPromotions = FluentCartPro\App\Modules\Promotional\Models\OrderPromotion::orderBy('priority', 'asc')->get();```

### Update Order Promotion [](#update-order-promotion)
php
```
$orderPromotion = FluentCartPro\App\Modules\Promotional\Models\OrderPromotion::find(1);
$orderPromotion->update([
 'status' => 'inactive',
 'config' => ['discount_value' => 20, 'updated' => true]
]);```

### Get Promotions by Source Object [](#get-promotions-by-source-object)
php
```
$promotions = FluentCartPro\App\Modules\Promotional\Models\OrderPromotion::where('src_object_type', 'product_variation')
 ->where('src_object_id', 123)
 ->get();```

### Get Promotions by Hash [](#get-promotions-by-hash)
php
```
$promotion = FluentCartPro\App\Modules\Promotional\Models\OrderPromotion::where('hash', 'abc123def456')->first();```

### Delete Order Promotion [](#delete-order-promotion)
php
```
$orderPromotion = FluentCartPro\App\Modules\Promotional\Models\OrderPromotion::find(1);
$orderPromotion->delete();```

### Get Promotions with Conditions [](#get-promotions-with-conditions)
php
```
$promotions = FluentCartPro\App\Modules\Promotional\Models\OrderPromotion::all();

foreach ($promotions as $promotion) {
 $conditions = $promotion->conditions;
 if (isset($conditions['min_amount'])) {
 echo "Min Amount: " . $conditions['min_amount'];
 }
}```

**Plugin**: FluentCart Pro

---

## OrderPromotionStat

Source: https://dev.fluentcart.com/database/models/order-promotion-stat.html

Pro
# Order Promotion Stat Model [](#order-promotion-stat-model)

| DB Table Name | {wp_db_prefix}_fct_order_promotion_stats | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#fct-order-promotion-stats-table) | 
| Source File | fluent-cart-pro/app/Modules/Promotional/Models/OrderPromotionStat.php | 
| Name Space | FluentCartPro\App\Modules\Promotional\Models | 
| Class | FluentCartPro\App\Modules\Promotional\Models\OrderPromotionStat | 
| Plugin | FluentCart Pro | 
## Properties [](#properties)

- **Table**: `fct_order_promotion_stats`
- **Primary Key**: `id`
- **Guarded**: `['id']`
- **Fillable**: `['promotion_id', 'order_id', 'object_id', 'amount', 'status']`

## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| id | Integer | Primary Key | 
| promotion_id | Integer | Reference to order promotion | 
| order_id | Integer | Reference to order | 
| object_id | Integer | Reference to object (product, variation, etc.) | 
| amount | Decimal | Promotion amount | 
| status | String | Promotion status | 
| created_at | Date Time | Creation timestamp | 
| updated_at | Date Time | Last update timestamp | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$orderPromotionStat = FluentCartPro\App\Modules\Promotional\Models\OrderPromotionStat::find(1);

$orderPromotionStat->id; // returns id
$orderPromotionStat->promotion_id; // returns promotion ID
$orderPromotionStat->order_id; // returns order ID
$orderPromotionStat->object_id; // returns object ID
$orderPromotionStat->amount; // returns amount
$orderPromotionStat->status; // returns status```

## Relations [](#relations)

This model has the following relationships that you can use
### order [](#order)

Access the associated order (BelongsTo)

- return `FluentCart\App\Models\Order` Model

#### Example: [](#example)
php
```
// Accessing Order
$order = $orderPromotionStat->order;

// For Filtering by order relationship
$orderPromotionStats = FluentCartPro\App\Modules\Promotional\Models\OrderPromotionStat::whereHas('order', function($query) {
 $query->where('status', 'completed');
})->get();```

### promotion [](#promotion)

Access the associated order promotion (BelongsTo)

- return `FluentCartPro\App\Modules\Promotional\Models\OrderPromotion` Model

#### Example: [](#example-1)
php
```
// Accessing Promotion
$promotion = $orderPromotionStat->promotion;

// For Filtering by promotion relationship
$orderPromotionStats = FluentCartPro\App\Modules\Promotional\Models\OrderPromotionStat::whereHas('promotion', function($query) {
 $query->where('status', 'active');
})->get();```

## Usage Examples [](#usage-examples)

### Create Order Promotion Stat [](#create-order-promotion-stat)
php
```
$orderPromotionStat = FluentCartPro\App\Modules\Promotional\Models\OrderPromotionStat::create([
 'promotion_id' => 1,
 'order_id' => 123,
 'object_id' => 456,
 'amount' => 15.99,
 'status' => 'applied'
]);```

### Get Stats by Promotion [](#get-stats-by-promotion)
php
```
$promotionStats = FluentCartPro\App\Modules\Promotional\Models\OrderPromotionStat::where('promotion_id', 1)->get();```

### Get Stats by Order [](#get-stats-by-order)
php
```
$orderStats = FluentCartPro\App\Modules\Promotional\Models\OrderPromotionStat::where('order_id', 123)->get();```

### Get Stats by Status [](#get-stats-by-status)
php
```
$appliedStats = FluentCartPro\App\Modules\Promotional\Models\OrderPromotionStat::where('status', 'applied')->get();
$declinedStats = FluentCartPro\App\Modules\Promotional\Models\OrderPromotionStat::where('status', 'declined')->get();```

### Get Stats with Order and Promotion Information [](#get-stats-with-order-and-promotion-information)
php
```
$statsWithDetails = FluentCartPro\App\Modules\Promotional\Models\OrderPromotionStat::with(['order', 'promotion'])->get();

foreach ($statsWithDetails as $stat) {
 echo "Order: " . $stat->order->id;
 echo "Promotion: " . $stat->promotion->title;
 echo "Amount: " . $stat->amount;
}```

### Get Stats by Amount Range [](#get-stats-by-amount-range)
php
```
$highValueStats = FluentCartPro\App\Modules\Promotional\Models\OrderPromotionStat::where('amount', '>', 50.00)->get();
$lowValueStats = FluentCartPro\App\Modules\Promotional\Models\OrderPromotionStat::where('amount', '<=', 10.00)->get();```

### Update Order Promotion Stat [](#update-order-promotion-stat)
php
```
$orderPromotionStat = FluentCartPro\App\Modules\Promotional\Models\OrderPromotionStat::find(1);
$orderPromotionStat->update([
 'status' => 'completed',
 'amount' => 20.00
]);```

### Get Stats by Object ID [](#get-stats-by-object-id)
php
```
$objectStats = FluentCartPro\App\Modules\Promotional\Models\OrderPromotionStat::where('object_id', 456)->get();```

### Get Stats for Date Range [](#get-stats-for-date-range)
php
```
$stats = FluentCartPro\App\Modules\Promotional\Models\OrderPromotionStat::whereBetween('created_at', ['2024-01-01', '2024-01-31'])->get();```

### Delete Order Promotion Stat [](#delete-order-promotion-stat)
php
```
$orderPromotionStat = FluentCartPro\App\Modules\Promotional\Models\OrderPromotionStat::find(1);
$orderPromotionStat->delete();```

**Plugin**: FluentCart Pro

---

## UserMeta

Source: https://dev.fluentcart.com/database/models/user-meta.html


| DB Table Name | {wp_db_prefix}_usermeta | 
| --- | --- |
| Schema | [Check Schema](https://dev.fluentcart.com/database/schema.html#usermeta-table) | 
| Source File | fluent-cart-pro/app/Models/UserMeta.php | 
| Name Space | FluentCartPro\App\Models | 
| Class | FluentCartPro\App\Models\UserMeta | 
| Plugin | FluentCart Pro | 
## Properties [](#properties)

- **Table**: `usermeta`
- **Primary Key**: `umeta_id`
- **Fillable**: `['user_id', 'meta_key', 'meta_value']`

## Attributes [](#attributes)

| Attribute | Data Type | Comment | 
| --- | --- | --- |
| umeta_id | Integer | Primary Key | 
| user_id | Integer | Reference to user | 
| meta_key | String | Meta key name | 
| meta_value | Text | Meta value | 
## Usage [](#usage)

Please check [Model Basic](https://dev.fluentcart.com/database/models.html) for Common methods.
### Accessing Attributes [](#accessing-attributes)
php
```
$userMeta = FluentCartPro\App\Models\UserMeta::find(1);

$userMeta->umeta_id; // returns meta ID
$userMeta->user_id; // returns user ID
$userMeta->meta_key; // returns meta key
$userMeta->meta_value; // returns meta value```

## Relations [](#relations)

This model has the following relationships that you can use
### user [](#user)

Access the associated user (BelongsTo)

- return `FluentCartPro\App\Models\User` Model (via `belongsTo(User::class, 'user_id', 'ID')`)

#### Example: [](#example)
php
```
// Accessing User
$user = $userMeta->user;

// For Filtering by user relationship
$userMetas = FluentCartPro\App\Models\UserMeta::whereHas('user', function($query) {
 $query->where('user_status', 0);
})->get();```

## Usage Examples [](#usage-examples)

### Get User Meta [](#get-user-meta)
php
```
$userMeta = FluentCartPro\App\Models\UserMeta::find(1);
echo "User ID: " . $userMeta->user_id;
echo "Meta Key: " . $userMeta->meta_key;
echo "Meta Value: " . $userMeta->meta_value;```

### Create User Meta [](#create-user-meta)
php
```
$userMeta = FluentCartPro\App\Models\UserMeta::create([
 'user_id' => 123,
 'meta_key' => 'fluent_cart_admin_role',
 'meta_value' => 'store_manager'
]);```

### Get All User Meta [](#get-all-user-meta)
php
```
$userMetas = FluentCartPro\App\Models\UserMeta::all();

foreach ($userMetas as $meta) {
 echo "User: " . $meta->user_id;
 echo "Key: " . $meta->meta_key;
 echo "Value: " . $meta->meta_value;
}```

### Get Meta by User [](#get-meta-by-user)
php
```
$userMetas = FluentCartPro\App\Models\UserMeta::where('user_id', 123)->get();```

### Get Meta by Key [](#get-meta-by-key)
php
```
$adminRoleMetas = FluentCartPro\App\Models\UserMeta::where('meta_key', 'fluent_cart_admin_role')->get();```

### Get Meta with User Information [](#get-meta-with-user-information)
php
```
$userMetas = FluentCartPro\App\Models\UserMeta::with('user')->get();

foreach ($userMetas as $meta) {
 echo "User: " . $meta->user->display_name;
 echo "Key: " . $meta->meta_key;
 echo "Value: " . $meta->meta_value;
}```

### Get Specific User Meta [](#get-specific-user-meta)
php
```
$userMeta = FluentCartPro\App\Models\UserMeta::where('user_id', 123)
 ->where('meta_key', 'fluent_cart_admin_role')
 ->first();```

### Update User Meta [](#update-user-meta)
php
```
$userMeta = FluentCartPro\App\Models\UserMeta::find(1);
$userMeta->update([
 'meta_value' => 'store_admin'
]);```

### Get Users with Specific Meta [](#get-users-with-specific-meta)
php
```
$storeManagers = FluentCartPro\App\Models\UserMeta::where('meta_key', 'fluent_cart_admin_role')
 ->where('meta_value', 'store_manager')
 ->get();```

### Delete User Meta [](#delete-user-meta)
php
```
$userMeta = FluentCartPro\App\Models\UserMeta::find(1);
$userMeta->delete();```

### Get Meta for Multiple Users [](#get-meta-for-multiple-users)
php
```
$userMetas = FluentCartPro\App\Models\UserMeta::whereIn('user_id', [123, 124, 125])->get();```

### Get Meta for Multiple Keys [](#get-meta-for-multiple-keys)
php
```
$userMetas = FluentCartPro\App\Models\UserMeta::whereIn('meta_key', ['fluent_cart_admin_role', 'fluent_cart_permissions'])->get();```

**Plugin**: FluentCart Pro

---

