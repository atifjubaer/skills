# REST API Endpoints Reference

This reference contains all FluentCart endpoints details scraped from the developer documentation site.

## Orders

Source: https://dev.fluentcart.com/restapi/orders.html


Manage customer orders including creation, updates, payments, refunds, shipping, and status management.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2/orders`
**Policy:** `OrderPolicy`
All monetary values are in **cents** (e.g., `$10.00` = `1000`).
## List Orders [](#list-orders)
GET `/fluent-cart/v2/orders`
Retrieve a paginated list of orders with optional filtering, sorting, and search.

- **Permission:** `orders/view`

### Parameters [](#parameters)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `page` | integer | query | No | Page number for pagination | 
| `per_page` | integer | query | No | Number of records per page (default: 10, max: 200) | 
| `search` | string | query | No | Search term. Searches invoice number, customer name/email, and order item titles. Also supports operator syntax (e.g., `status = completed`, `id > 5`, `id :: 1-10`) | 
| `sort_by` | string | query | No | Column to sort by (default: `id`). Must be a fillable column on the Order model | 
| `sort_type` | string | query | No | Sort direction: `asc` or `desc` (default: `desc`) | 
| `active_view` | string | query | No | Tab filter. One of: `on-hold`, `paid`, `completed`, `processing`, `renewal`, `subscription`, `onetime`, `refunded`, `partially_refunded`, `upgraded_to`, `upgraded_from` | 
| `filter_type` | string | query | No | Filter mode: `simple` (default) or `advanced` | 
| `advanced_filters` | string (JSON) | query | No | JSON-encoded array of advanced filter groups (requires Pro). Supports filtering by order properties, customer properties, transaction properties, license properties, and UTM properties | 
| `with` | array/string | query | No | Eager-load relations. Supports relation names and `{relation}Count` for counts | 
| `select` | array/string | query | No | Comma-separated list of columns to select | 
| `scopes` | array | query | No | Model scopes to apply | 
| `include_ids` | array/string | query | No | Comma-separated IDs that must always be included in results | 
| `limit` | integer | query | No | Limit number of records (used with non-paginated queries) | 
| `offset` | integer | query | No | Offset for records | 
| `user_tz` | string | query | No | User timezone for date filtering (e.g., `America/New_York`) | 
| `payment_statuses` | array | query | No | Filter by payment statuses | 
| `order_statuses` | array | query | No | Filter by order statuses | 
| `shipping_statuses` | array | query | No | Filter by shipping statuses | 
### Searchable Fields (Operator Syntax) [](#searchable-fields-operator-syntax)

The `search` parameter supports operator syntax like `field = value`, `field > value`, or `field :: range`:

| Field | Column | Type | Examples | 
| --- | --- | --- | --- |
| `id` | `id` | numeric | `id = 1`, `id > 5`, `id :: 1-10` | 
| `status` | `status` | string | `status = completed` | 
| `invoice` | `status` | string | Invoice number search | 
| `payment` | `payment_status` | string | `payment = paid`, `payment = partially_refunded` | 
| `payment_by` | `payment_method` | string | `payment_by = stripe`, `payment_by = paypal` | 
| `customer` | (custom) | custom | `customer = john` (searches name and email) | 
| `license` | (custom) | custom | `license = ff-78d47b3fed89bda25cdc5b60d0298d60` (Pro only) | 
### Response [](#response)
json
```
{
 "orders": {
 "current_page": 1,
 "data": [
 {
 "id": 1,
 "uuid": "abc123-def456",
 "invoice_no": "INV-001",
 "status": "completed",
 "payment_status": "paid",
 "payment_method": "stripe",
 "type": "payment",
 "fulfillment_type": "digital",
 "currency": "USD",
 "subtotal": 5000,
 "total_amount": 5000,
 "total_paid": 5000,
 "total_refund": 0,
 "shipping_total": 0,
 "tax_total": 0,
 "manual_discount_total": 0,
 "coupon_discount_total": 0,
 "customer_id": 1,
 "customer": { ... },
 "created_at": "2025-01-15 10:30:00",
 "updated_at": "2025-01-15 10:35:00"
 }
 ],
 "per_page": 10,
 "total": 100,
 "last_page": 10
 }
}```

### Example [](#example)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/orders?page=1&per_page=10&sort_by=id&sort_type=desc" \
 -u "username:app_password"```

## Calculate Shipping [](#calculate-shipping)
POST `/fluent-cart/v2/orders/calculate-shipping`
Calculate shipping charges for order items with a specific shipping method.

- **Permission:** `orders/create` or `orders/manage`

### Parameters [](#parameters-1)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order_items` | array | body | Yes | Array of order items, each with `id` (variation ID) and `quantity` | 
| `shipping_id` | integer | body | Yes | ID of the shipping method to calculate charges for | 
### Response [](#response-1)
json
```
{
 "message": "Shipping updated",
 "shipping_charge": 500,
 "order_items": {
 "1": {
 "id": 1,
 "quantity": 2,
 "shipping_charge": 500,
 "unit_price": 2500,
 "other_info": {},
 "discount_total": 0,
 "fulfillment_type": "physical"
 }
 }
}```

### Example [](#example-1)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/orders/calculate-shipping" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "order_items": [{"id": 1, "quantity": 2}],
 "shipping_id": 5
 }'```

## Create Order [](#create-order)
POST `/fluent-cart/v2/orders`
Create a new order manually from the admin panel.

- **Permission:** `orders/create`
- **Request Class:** `OrderRequest`

### Parameters [](#parameters-2)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customer_id` | integer | body | Yes | ID of the customer placing the order | 
| `order_items` | array | body | Yes | Array of order items (see Order Items below) | 
| `status` | string | body | No | Order status (max 50 chars) | 
| `invoice_no` | string | body | No | Invoice number (max 100 chars) | 
| `fulfillment_type` | string | body | No | Fulfillment type (max 50 chars) | 
| `type` | string | body | No | Order type (max 50 chars) | 
| `payment_method` | string | body | No | Payment method key (max 50 chars) | 
| `payment_method_title` | string | body | No | Payment method display title (max 50 chars) | 
| `payment_status` | string | body | No | Payment status (max 50 chars) | 
| `currency` | string | body | No | Currency code, e.g., `USD` (max 10 chars) | 
| `subtotal` | numeric | body | No | Order subtotal in cents | 
| `discount_tax` | numeric | body | No | Discount tax amount in cents | 
| `manual_discount_total` | numeric | body | No | Manual discount total in cents | 
| `coupon_discount_total` | numeric | body | No | Coupon discount total in cents | 
| `shipping_tax` | numeric | body | No | Shipping tax in cents | 
| `shipping_total` | numeric | body | No | Shipping total in cents | 
| `tax_total` | numeric | body | No | Tax total in cents | 
| `total_amount` | numeric | body | No | Total order amount in cents | 
| `rate` | numeric | body | No | Exchange rate | 
| `note` | string | body | No | Order note (max 5000 chars) | 
| `uuid` | string | body | No | Order UUID (max 100 chars) | 
| `ip_address` | string | body | No | Customer IP address (max 100 chars) | 
| `completed_at` | string | body | No | Completion timestamp (max 100 chars) | 
| `refunded_at` | string | body | No | Refund timestamp (max 100 chars) | 
| `user_tz` | string | body | No | User timezone (max 50 chars) | 
| `discount` | object | body | No | Manual discount details | 
| `shipping` | array | body | No | Shipping method details | 
| `applied_coupon` | array | body | No | Applied coupon details | 
| `trigger` | string | body | No | Trigger source | 
#### Order Items Object [](#order-items-object)

| Field | Type | Required | Description | 
| --- | --- | --- | --- |
| `id` | integer | No | Order item ID (for updates) | 
| `order_id` | integer | No | Parent order ID | 
| `post_id` | integer | No | WordPress post ID of the product | 
| `variation_id` | integer | No | Product variation ID | 
| `object_id` | integer | No | Object reference ID | 
| `fulfillment_type` | string | No | `digital` or `physical` | 
| `payment_type` | string | No | Payment type (max 100 chars), e.g., `subscription` | 
| `quantity` | integer | No | Item quantity (min: 1) | 
| `post_title` | string | No | Product title (max 255 chars) | 
| `title` | string | No | Item title (max 255 chars) | 
| `price` | numeric | No | Item price in cents | 
| `unit_price` | numeric | No | Unit price in cents | 
| `shipping_charge` | numeric | No | Shipping charge in cents | 
| `item_cost` | numeric | No | Item cost in cents | 
| `item_total` | numeric | No | Item total in cents | 
| `tax_amount` | numeric | No | Tax amount in cents | 
| `discount_total` | numeric | No | Discount total in cents | 
| `total` | numeric | No | Total in cents | 
| `line_total` | numeric | No | Line total in cents | 
| `cart_index` | integer | No | Cart position index | 
| `rate` | numeric | No | Exchange rate | 
| `line_meta` | array | No | Line item metadata | 
| `other_info` | array | No | Additional item information | 
#### Discount Object [](#discount-object)

| Field | Type | Required | Description | 
| --- | --- | --- | --- |
| `type` | string | No | Discount type (max 100 chars) | 
| `value` | numeric | No | Discount value | 
| `label` | string | No | Discount label (max 100 chars) | 
| `reason` | string | No | Discount reason (max 100 chars) | 
| `action` | string | No | Discount action (max 100 chars) | 
#### Shipping Object (array) [](#shipping-object-array)

| Field | Type | Required | Description | 
| --- | --- | --- | --- |
| `type` | string | No | Shipping type (max 100 chars) | 
| `rate_name` | string | No | Shipping rate name (max 100 chars) | 
| `custom_price` | numeric | No | Custom shipping price in cents | 
#### Applied Coupon Object (array) [](#applied-coupon-object-array)

| Field | Type | Required | Description | 
| --- | --- | --- | --- |
| `id` | integer | No | Applied coupon record ID | 
| `order_id` | integer | No | Order ID | 
| `coupon_id` | integer | Yes | Coupon ID (min: 1) | 
| `code` | string | Yes | Coupon code (max 100 chars) | 
| `amount` | numeric | No | Coupon amount | 
| `discounted_amount` | numeric | Yes | Discounted amount in cents | 
| `discount` | numeric | No | Discount value | 
| `stackable` | integer | Yes | Whether coupon is stackable (0 or 1) | 
| `priority` | integer | No | Coupon priority | 
| `max_uses` | integer | No | Maximum uses | 
| `use_count` | integer | No | Current use count | 
| `max_per_customer` | integer | No | Max uses per customer (min: 1) | 
| `min_purchase_amount` | numeric | No | Minimum purchase amount in cents | 
| `max_discount_amount` | numeric | No | Maximum discount amount in cents | 
| `notes` | string | No | Coupon notes (max 100 chars) | 
### Response [](#response-2)
json
```
{
 "message": "Order created successfully!",
 "order_id": 42,
 "uuid": "abc123-def456-ghi789"
}```

### Example [](#example-2)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/orders" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "customer_id": 1,
 "order_items": [
 {
 "post_id": 10,
 "variation_id": 5,
 "object_id": 5,
 "quantity": 1,
 "unit_price": 2500,
 "price": 2500,
 "item_total": 2500,
 "total": 2500,
 "line_total": 2500,
 "title": "Pro License"
 }
 ],
 "subtotal": 2500,
 "total_amount": 2500,
 "payment_method": "offline_payment"
 }'```

## Bulk Actions [](#bulk-actions)
POST `/fluent-cart/v2/orders/do-bulk-action`
Perform bulk actions on multiple orders at once.

- **Permission:** `orders/manage`

### Parameters [](#parameters-3)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `action` | string | body | Yes | Bulk action to perform. One of: `delete_orders`, `change_shipping_status`, `change_order_status`, `capture_payments`, `change_payment_status` | 
| `order_ids` | array | body | Yes | Array of order IDs to act upon | 
| `new_status` | string | body | Conditional | New status value. Required for `change_shipping_status`, `change_order_status`, and `change_payment_status` actions | 
| `manage_stock` | string | body | No | Whether to manage stock on status change (`true`/`false`) | 
### Supported Actions [](#supported-actions)

| Action | Description | Valid `new_status` Values | 
| --- | --- | --- |
| `delete_orders` | Delete selected orders and related data | N/A | 
| `change_shipping_status` | Update shipping status | Valid shipping statuses (e.g., `shipped`, `delivered`) | 
| `change_order_status` | Update order status | `completed`, `processing`, `on-hold`, `canceled` | 
| `capture_payments` | Capture authorized payments | N/A | 
| `change_payment_status` | Update payment status | Valid transaction statuses | 
### Response [](#response-3)
json
```
{
 "message": "Order Status has been changed for the selected orders"
}```

### Example [](#example-3)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/orders/do-bulk-action" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "action": "change_order_status",
 "order_ids": [1, 2, 3],
 "new_status": "processing"
 }'```

## Mark Order as Paid [](#mark-order-as-paid)
POST `/fluent-cart/v2/orders/{order}/mark-as-paid`
Mark a pending order as paid, creating or updating the transaction record.

- **Permission:** `orders/manage`

### Parameters [](#parameters-4)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order` | integer | path | Yes | Order ID | 
| `payment_method` | string | body | No | Payment method used (e.g., `offline_payment`, `stripe`) | 
| `vendor_charge_id` | string | body | No | External payment reference/charge ID | 
| `transaction_type` | string | body | No | Transaction type identifier | 
| `mark_paid_note` | string | body | No | Note to attach to the order | 
### Response [](#response-4)
json
```
{
 "message": "Order has been marked as paid"
}```

### Error Responses [](#error-responses)

| Status | Message | 
| --- | --- |
| 423 | Order has already been paid | 
| 423 | Unable to mark paid for canceled order | 
### Example [](#example-4)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/orders/42/mark-as-paid" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "payment_method": "offline_payment",
 "vendor_charge_id": "CHK-12345",
 "mark_paid_note": "Payment received via bank transfer"
 }'```

## Generate Missing Licenses [](#generate-missing-licenses)
POST `/fluent-cart/v2/orders/{order}/generate-missing-licenses`
Generate any missing license keys for an order's items (requires Pro with licensing module).

- **Permission:** `orders/manage`

### Parameters [](#parameters-5)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order` | integer | path | Yes | Order ID | 
### Error Responses [](#error-responses-1)

| Status | Message | 
| --- | --- |
| 404 | Order not found | 
| 400 | No missing licenses found! | 
### Example [](#example-5)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/orders/42/generate-missing-licenses" \
 -u "username:app_password"```

## Get Order Details [](#get-order-details)
GET `/fluent-cart/v2/orders/{order_id}`
Retrieve detailed information about a specific order, including items, transactions, addresses, subscriptions, and activities.

- **Permission:** `orders/view`

### Parameters [](#parameters-6)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order_id` | integer | path | Yes | Order ID | 
### Response [](#response-5)
json
```
{
 "order": {
 "id": 42,
 "uuid": "abc123-def456",
 "invoice_no": "INV-042",
 "status": "completed",
 "payment_status": "paid",
 "payment_method": "stripe",
 "type": "payment",
 "fulfillment_type": "digital",
 "currency": "USD",
 "subtotal": 5000,
 "total_amount": 5000,
 "total_paid": 5000,
 "total_refund": 0,
 "shipping_total": 0,
 "tax_total": 0,
 "manual_discount_total": 0,
 "coupon_discount_total": 0,
 "customer_id": 1,
 "customer": { ... },
 "order_items": [ ... ],
 "transactions": [ ... ],
 "billing_address": { ... },
 "shipping_address": { ... },
 "subscriptions": [ ... ],
 "activities": [ ... ],
 "labels": [ ... ],
 "applied_coupons": [ ... ],
 "children": [ ... ],
 "parent_order": null,
 "order_operation": { ... },
 "receipt_url": "https://example.com/receipt/?order_hash=abc123",
 "custom_checkout_url": "https://example.com/checkout/?payment_hash=...",
 "has_missing_licenses": false,
 "created_at": "2025-01-15 10:30:00",
 "updated_at": "2025-01-15 10:35:00"
 },
 "discount_meta": { ... },
 "shipping_meta": { ... },
 "order_settings": {},
 "selected_labels": [1, 2],
 "tax_id": null
}```

### Example [](#example-6)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/orders/42" \
 -u "username:app_password"```

## Update Order [](#update-order)
POST `/fluent-cart/v2/orders/{order_id}`
Update an existing order's details, items, discounts, shipping, and coupons. Subscription orders cannot be edited.

- **Permission:** `orders/manage`
- **Request Class:** `OrderRequest`

### Parameters [](#parameters-7)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order_id` | integer | path | Yes | Order ID | 
| `customer_id` | integer | body | Yes | Customer ID | 
| `order_items` | array | body | Yes | Updated array of order items (same structure as Create Order) | 
| `status` | string | body | No | Order status (cannot be set to `completed`) | 
| `payment_status` | string | body | No | Payment status | 
| `subtotal` | numeric | body | No | Updated subtotal in cents | 
| `total_amount` | numeric | body | No | Updated total amount in cents | 
| `total_paid` | numeric | body | No | Total amount already paid in cents | 
| `shipping_total` | numeric | body | No | Updated shipping total in cents | 
| `tax_total` | numeric | body | No | Updated tax total in cents | 
| `manual_discount_total` | numeric | body | No | Manual discount in cents | 
| `coupon_discount_total` | numeric | body | No | Coupon discount in cents | 
| `discount` | object | body | No | Discount details (see Create Order) | 
| `shipping` | array | body | No | Shipping details (see Create Order) | 
| `applied_coupon` | array | body | No | Applied coupon details (see Create Order) | 
| `deletedItems` | array | body | No | Array of order item IDs to remove | 
| `couponCalculation` | array | body | No | Coupon calculation details | 
All other fields from `OrderRequest` are also accepted (see Create Order).
### Error Responses [](#error-responses-2)

| Status | Message | 
| --- | --- |
| 400 | Subscription Order cannot be edited | 
| 400 | Completed status can not be updated | 
### Response [](#response-6)
json
```
{
 "message": "Order updated successfully",
 "order": { ... }
}```

### Example [](#example-7)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/orders/42" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "customer_id": 1,
 "order_items": [
 {
 "id": 10,
 "order_id": 42,
 "quantity": 2,
 "unit_price": 2500,
 "line_total": 5000
 }
 ],
 "subtotal": 5000,
 "total_amount": 5000
 }'```

## Update Order Address ID [](#update-order-address-id)
POST `/fluent-cart/v2/orders/{order_id}/update-address-id`
Assign an existing customer address to an order's billing or shipping address.

- **Permission:** `orders/manage`

### Parameters [](#parameters-8)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order_id` | integer | path | Yes | Order ID | 
| `address_id` | integer | body | Yes | Customer address ID to assign | 
| `address_type` | string | body | No | Address type: `billing` (default) or `shipping` | 
### Response [](#response-7)
json
```
{
 "message": "Address updated successfully"
}```

### Error Responses [](#error-responses-3)

| Status | Message | 
| --- | --- |
| 404 | Order not found | 
### Example [](#example-8)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/orders/42/update-address-id" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "address_id": 5,
 "address_type": "billing"
 }'```

## Refund Order [](#refund-order)
POST `/fluent-cart/v2/orders/{order_id}/refund`
Process a full or partial refund for an order. Supports both gateway refunds and manual refunds, with optional subscription cancellation.

- **Permission:** `orders/can_refund`

### Parameters [](#parameters-9)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order_id` | integer | path | Yes | Order ID | 
| `refund_info` | object | body | Yes | Refund details object | 
| `refund_info.transaction_id` | integer | body | Yes | ID of the transaction to refund | 
| `refund_info.amount` | numeric | body | Yes | Refund amount in **decimal** format (e.g., `10.00` not cents). Will be converted to cents internally | 
| `refund_info.cancelSubscription` | string | body | No | Set to `"true"` to cancel associated subscription | 
### Response [](#response-8)
json
```
{
 "fluent_cart_refund": {
 "status": "success",
 "message": "Refund processed on FluentCart."
 },
 "gateway_refund": {
 "status": "success",
 "message": "Refund processed on Stripe"
 },
 "subscription_cancel": {
 "status": "success",
 "message": "Subscription cancelled successfully"
 }
}```

### Error Responses [](#error-responses-4)

| Status | Message | 
| --- | --- |
| 400 | Order can not be refunded | 
| 422 | Transaction ID is required | 
| 422 | Refund amount is required | 
### Example [](#example-9)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/orders/42/refund" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "refund_info": {
 "transaction_id": 15,
 "amount": 25.00,
 "cancelSubscription": "true"
 }
 }'```

## Change Customer [](#change-customer)
POST `/fluent-cart/v2/orders/{order_id}/change-customer`
Reassign an order to a different existing customer. Updates all connected orders (parent/child/renewals), subscriptions, and customer statistics.

- **Permission:** `orders/manage`

### Parameters [](#parameters-10)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order_id` | integer | path | Yes | Order ID | 
| `customer_id` | integer | body | Yes | New customer ID to assign | 
### Response [](#response-9)
json
```
{
 "message": "Customer changed successfully"
}```

### Error Responses [](#error-responses-5)

| Status | Message | 
| --- | --- |
| 423 | Customer id is required | 
### Example [](#example-10)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/orders/42/change-customer" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "customer_id": 15
 }'```

## Create and Change Customer [](#create-and-change-customer)
POST `/fluent-cart/v2/orders/{order_id}/create-and-change-customer`
Create a new customer and immediately assign them to the order. Combines customer creation with order reassignment.

- **Permission:** `orders/manage`
- **Request Class:** `CustomerRequest`

### Parameters [](#parameters-11)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order_id` | integer | path | Yes | Order ID | 
| `first_name` | string | body | Conditional | Customer first name (max 255 chars). Required if full name mode is disabled | 
| `last_name` | string | body | No | Customer last name (max 255 chars) | 
| `full_name` | string | body | Conditional | Customer full name (max 255 chars). Required if full name mode is enabled | 
| `email` | string | body | Yes | Customer email address (max 255 chars, must be unique) | 
| `city` | string | body | No | Customer city | 
| `user_id` | integer | body | No | WordPress user ID to link | 
| `status` | string | body | No | Customer status | 
| `country` | string | body | No | Customer country | 
| `state` | string | body | No | Customer state | 
| `postcode` | string | body | No | Customer postal code | 
| `notes` | string | body | No | Customer notes | 
### Response [](#response-10)
json
```
{
 "message": "Customer changed successfully"
}```

### Error Responses [](#error-responses-6)

| Status | Message | 
| --- | --- |
| 422 | Email is required | 
| 422 | Email already exists | 
| 422 | First Name is required | 
| 400 | Failed to attach customer | 
### Example [](#example-11)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/orders/42/create-and-change-customer" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "first_name": "Jane",
 "last_name": "Doe",
 "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)"
 }'```

## Delete Order [](#delete-order)
DELETE `/fluent-cart/v2/orders/{order_id}`
Permanently delete an order and all associated data (transactions, items, meta, addresses, coupons, cart data, download permissions, labels). For subscription orders, also deletes all child renewal orders and subscriptions.

- **Permission:** `orders/delete`

### Parameters [](#parameters-12)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order_id` | integer | path | Yes | Order ID to delete | 
### Response [](#response-11)
json
```
{
 "message": "Order 42 deleted successfully",
 "data": {
 "order_id": 42,
 "invoice_no": "INV-042",
 "status": "success"
 },
 "errors": []
}```

### Error Responses [](#error-responses-7)

| Status | Message | 
| --- | --- |
| 404 | Order not found | 
| 400 | (Various reasons why order cannot be deleted) | 
### Example [](#example-12)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/orders/42" \
 -u "username:app_password"```

## Update Statuses [](#update-statuses)
PUT `/fluent-cart/v2/orders/{order}/statuses`
Update the order status or shipping status for an order.

- **Permission:** `orders/manage_statuses`

### Parameters [](#parameters-13)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order` | integer | path | Yes | Order ID | 
| `action` | string | body | Yes | Status change type: `change_order_status` or `change_shipping_status` | 
| `statuses` | object | body | Yes | Status values object | 
| `statuses.order_status` | string | body | Conditional | New order status. Required when `action` is `change_order_status`. One of: `completed`, `processing`, `on-hold`, `canceled` | 
| `statuses.shipping_status` | string | body | Conditional | New shipping status. Required when `action` is `change_shipping_status` | 
| `manage_stock` | string/boolean | body | No | Whether to adjust stock levels on status change | 
### Response [](#response-12)
json
```
{
 "message": "Status has been updated",
 "data": { ... }
}```

### Error Responses [](#error-responses-8)

| Status | Message | 
| --- | --- |
| 400 | Order already has the same status | 
| 400 | You cannot change the order status once it has been canceled | 
### Example [](#example-13)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/orders/42/statuses" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "action": "change_order_status",
 "statuses": {
 "order_status": "processing"
 },
 "manage_stock": true
 }'```

## Get Order Transactions [](#get-order-transactions)
GET `/fluent-cart/v2/orders/{order}/transactions`
Retrieve all transactions for an order. This endpoint returns the full order details (same as Get Order Details), which includes the `transactions` relation.

- **Permission:** `orders/view`

### Parameters [](#parameters-14)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order` | integer | path | Yes | Order ID | 
### Response [](#response-13)

Same response structure as [Get Order Details](#get-order-details), with the `order.transactions` array populated.
### Example [](#example-14)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/orders/42/transactions" \
 -u "username:app_password"```

## Accept Dispute [](#accept-dispute)
POST `/fluent-cart/v2/orders/{order}/transactions/{transaction_id}/accept-dispute/`
Accept a payment dispute (chargeback) for a specific transaction.

- **Permission:** `orders/manage`

### Parameters [](#parameters-15)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order` | integer | path | Yes | Order ID | 
| `transaction_id` | integer | path | Yes | Transaction ID with the dispute | 
| `dispute_note` | string | body | No | Note about the dispute acceptance | 
### Response [](#response-14)
json
```
{
 "message": "Dispute accepted!"
}```

### Example [](#example-15)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/orders/42/transactions/15/accept-dispute/" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "dispute_note": "Customer provided valid reason for dispute"
 }'```

## Get Single Transaction [](#get-single-transaction)
GET `/fluent-cart/v2/orders/{id}/transactions/{transaction_id}`
Retrieve details of a specific transaction within an order. This endpoint returns the full order details (same as Get Order Details).

- **Permission:** `orders/view`

### Parameters [](#parameters-16)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | Order ID | 
| `transaction_id` | integer | path | Yes | Transaction ID | 
### Response [](#response-15)

Same response structure as [Get Order Details](#get-order-details).
### Example [](#example-16)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/orders/42/transactions/15" \
 -u "username:app_password"```

## Update Order Address [](#update-order-address)
PUT `/fluent-cart/v2/orders/{order}/address/{id}`
Update an existing order address (billing or shipping) with new address data.

- **Permission:** `orders/manage`

### Parameters [](#parameters-17)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order` | integer | path | Yes | Order ID | 
| `id` | integer | path | Yes | Order address ID | 
| `order_id` | integer | body | Yes | Order ID (must match the path parameter) | 
| `name` | string | body | No | Full name | 
| `first_name` | string | body | No | First name | 
| `last_name` | string | body | No | Last name | 
| `full_name` | string | body | No | Full name | 
| `address_1` | string | body | No | Address line 1 | 
| `address_2` | string | body | No | Address line 2 | 
| `city` | string | body | No | City | 
| `state` | string | body | No | State/province | 
| `postcode` | string | body | No | Postal/ZIP code | 
| `country` | string | body | No | Country code | 
### Response [](#response-16)
json
```
{
 "message": "Address updated successfully"
}```

### Error Responses [](#error-responses-9)

| Status | Message | 
| --- | --- |
| 404 | The address information does not match | 
### Example [](#example-17)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/orders/42/address/5" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "order_id": 42,
 "first_name": "John",
 "last_name": "Doe",
 "address_1": "123 Main St",
 "city": "New York",
 "state": "NY",
 "postcode": "10001",
 "country": "US"
 }'```

## Update Transaction Status [](#update-transaction-status)
PUT `/fluent-cart/v2/orders/{order}/transactions/{transaction}/status`
Update the payment status of a specific transaction and sync the order's payment status accordingly.

- **Permission:** `orders/manage`

### Parameters [](#parameters-18)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order` | integer | path | Yes | Order ID | 
| `transaction` | integer | path | Yes | Transaction ID | 
| `status` | string | body | Yes | New transaction status (e.g., `succeeded`, `pending`, `refunded`, `failed`) | 
### Response [](#response-17)
json
```
{
 "transaction": {
 "id": 15,
 "order_id": 42,
 "status": "succeeded",
 "total": 5000,
 "payment_method": "stripe",
 ...
 },
 "message": "Payment status has been successfully updated"
}```

### Error Responses [](#error-responses-10)

| Status | Message | 
| --- | --- |
| 400 | Transaction already has the same status | 
| 400 | The selected transaction does not match with the provided order | 
### Example [](#example-18)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/orders/42/transactions/15/status" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "status": "succeeded"
 }'```

## Create Custom Order Item [](#create-custom-order-item)
POST `/fluent-cart/v2/orders/{order}/create-custom`
Add a custom product/item to an existing order.

- **Permission:** `orders/create`

### Parameters [](#parameters-19)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order` | integer | path | Yes | Order ID | 
| `product` | object | body | Yes | Product data to add as a custom item | 
### Response [](#response-18)

Returns the result of processing the custom item addition.
### Error Responses [](#error-responses-11)

| Status | Message | 
| --- | --- |
| 423 | (Error message from processing) | 
### Example [](#example-19)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/orders/42/create-custom" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "product": {
 "title": "Custom Service",
 "price": 1500,
 "quantity": 1
 }
 }'```

## Get Shipping Methods [](#get-shipping-methods)
GET `/fluent-cart/v2/orders/shipping_methods`
Retrieve available shipping methods, optionally filtered by country and state. Returns methods applicable to the specified location and all other enabled methods separately.

- **Permission:** `orders/manage`

### Parameters [](#parameters-20)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `country_code` | string | query | No | Country code to filter applicable shipping methods (e.g., `US`, `GB`) | 
| `state` | string | query | No | State/province code for more specific filtering | 
| `order_items` | array | query | No | Array of order items (each with `id` and `quantity`) to calculate shipping charges | 
### Response [](#response-19)
json
```
{
 "shipping_methods": [
 {
 "id": 1,
 "title": "Standard Shipping",
 "is_enabled": "1",
 "shipping_charge": 500,
 ...
 }
 ],
 "other_shipping_methods": [
 {
 "id": 2,
 "title": "International Shipping",
 "is_enabled": "1",
 "shipping_charge": 1500,
 ...
 }
 ]
}```

When `country_code` is empty, `shipping_methods` will be an empty array and all enabled methods appear in `other_shipping_methods`.
### Example [](#example-20)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/orders/shipping_methods?country_code=US&state=CA" \
 -u "username:app_password"```

## Sync Order Statuses [](#sync-order-statuses)
PUT `/fluent-cart/v2/orders/{order}/sync-statuses`
Synchronize the order's status and payment status based on the latest transaction data. Useful for resolving status mismatches.

- **Permission:** `orders/manage`

### Parameters [](#parameters-21)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order` | integer | path | Yes | Order ID | 
### Response [](#response-20)
json
```
{
 "message": "Order statuses synced successfully",
 "order": { ... },
 "payment_status": "paid",
 "status": "processing"
}```

### Error Responses [](#error-responses-12)

| Status | Message | 
| --- | --- |
| 404 | No transaction found for this order | 
### Example [](#example-21)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/orders/42/sync-statuses" \
 -u "username:app_password"```

---

## Products

Source: https://dev.fluentcart.com/restapi/products.html


Manage your product catalog including creating products, managing variations, downloadable files, bundles, upgrade paths, tax/shipping classes, stock management, and product integrations.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2/products`
**Policy:** `ProductPolicy`
All monetary values are in **cents** (e.g., `$10.00` = `1000`).
## Product CRUD & Listing [](#product-crud-listing)

### List Products [](#list-products)
GET `/fluent-cart/v2/products`
Retrieve a paginated list of products with filtering, sorting, and search capabilities.

- **Permission:** `products/view`

#### Parameters [](#parameters)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `search` | string | query | No | Search by product title, ID, or variation title | 
| `per_page` | integer | query | No | Number of results per page (default: `10`) | 
| `page` | integer | query | No | Page number for pagination | 
| `sort_by` | string | query | No | Column to sort by (default: `ID`) | 
| `sort_type` | string | query | No | Sort direction: `asc` or `desc` (default: `desc`) | 
| `active_view` | string | query | No | Filter tab: `publish`, `draft`, `physical`, `digital`, `subscribable`, `not_subscribable`, `bundle`, `non_bundle` | 
| `filter_type` | string | query | No | `simple` or `advanced` | 
| `with` | array | query | No | Relations to eager load | 
| `search_groups` | array | query | No | Advanced filter groups for complex queries | 
#### Response [](#response)
json
```
{
 "products": {
 "total": 50,
 "per_page": 10,
 "current_page": 1,
 "last_page": 5,
 "data": [
 {
 "ID": 123,
 "post_title": "Example Product",
 "post_status": "publish",
 "post_date": "2025-01-15 12:00:00",
 "view_url": "https://example.com/product/example-product",
 "edit_url": "https://example.com/wp-admin/admin.php?page=fluent-cart#/products/123"
 }
 ]
 }
}```

#### Example [](#example)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products?search=widget&per_page=20&active_view=publish" \
 -u "username:app_password"```

### Get Product [](#get-product)
GET `/fluent-cart/v2/products/{product}`
Retrieve a single product by ID.

- **Permission:** `products/view`

#### Parameters [](#parameters-1)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `product` | integer | path | Yes | The product ID | 
| `with` | array | query | No | Relations to eager load (e.g., `["detail", "variants", "product_menu"]`) | 
#### Response [](#response-1)
json
```
{
 "product": {
 "ID": 123,
 "post_title": "Example Product",
 "post_status": "publish",
 "post_excerpt": "Short description",
 "post_content": "Full description"
 },
 "product_menu": []
}```

#### Example [](#example-1)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/123?with[]=detail&with[]=variants" \
 -u "username:app_password"```

### Create Product [](#create-product)
POST `/fluent-cart/v2/products`
Create a new product. A default variation is automatically created with the product.

- **Permission:** `products/create`
- **Request Class:** `ProductCreateRequest`

#### Parameters [](#parameters-2)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `post_title` | string | body | Yes | Product title (max 200 characters) | 
| `post_status` | string | body | No | Post status (e.g., `draft`, `publish`) | 
| `detail.fulfillment_type` | string | body | No | `physical` or `digital` (default: `digital`) | 
| `detail.other_info.is_bundle_product` | string | body | No | `yes` or `no` (default: `no`) | 
#### Response [](#response-2)
json
```
{
 "data": {
 "ID": 124,
 "variant": {
 "id": 456,
 "post_id": 124,
 "variation_title": "Example Product",
 "stock_status": "in-stock",
 "payment_type": "onetime",
 "total_stock": 1,
 "available": 1,
 "fulfillment_type": "digital"
 },
 "product_details": { ... }
 },
 "message": "Product has been created successfully"
}```

#### Example [](#example-2)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "post_title": "New Digital Product",
 "post_status": "draft",
 "detail": {
 "fulfillment_type": "digital"
 }
 }'```

### Delete Product [](#delete-product)
DELETE `/fluent-cart/v2/products/{product}`
Delete a product and all associated data.

- **Permission:** `products/delete`

#### Parameters [](#parameters-3)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `product` | integer | path | Yes | The product ID to delete | 
#### Response [](#response-3)
json
```
{
 "message": "Product deleted successfully"
}```

#### Example [](#example-3)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/products/123" \
 -u "username:app_password"```

### Get Product Pricing [](#get-product-pricing)
GET `/fluent-cart/v2/products/{productId}/pricing`
Retrieve the full product details including pricing, variants, downloadable files, and taxonomy information.

- **Permission:** `products/view`

#### Parameters [](#parameters-4)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `productId` | integer | path | Yes | The product ID | 
| `with` | array | query | No | Additional relations (e.g., `["product_menu"]`) | 
#### Response [](#response-4)
json
```
{
 "product": {
 "ID": 123,
 "post_title": "Example Product",
 "post_status": "publish",
 "post_excerpt": "Short description",
 "featured_image_id": 456,
 "view_url": "https://example.com/product/example",
 "edit_url": "https://example.com/wp-admin/admin.php?page=fluent-cart#/products/123",
 "detail": {
 "id": 1,
 "post_id": 123,
 "fulfillment_type": "digital",
 "variation_type": "simple",
 "manage_stock": 0,
 "manage_downloadable": 0,
 "other_info": { ... }
 },
 "variants": [
 {
 "id": 789,
 "post_id": 123,
 "variation_title": "Default Plan",
 "item_price": 1000,
 "compare_price": 0,
 "stock_status": "in-stock",
 "other_info": { ... },
 "media": []
 }
 ],
 "downloadable_files": []
 },
 "product_menu": "",
 "taxonomies": [
 {
 "name": "product-categories",
 "label": "Product Categories",
 "terms": [],
 "labels": { ... }
 }
 ]
}```

#### Example [](#example-4)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/123/pricing?with[]=product_menu" \
 -u "username:app_password"```

### Update Product Pricing [](#update-product-pricing)
POST `/fluent-cart/v2/products/{postId}/pricing`
Update a product's pricing, details, variants, and other metadata.

- **Permission:** `products/edit`
- **Request Class:** `ProductUpdateRequest`

#### Parameters [](#parameters-5)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `postId` | integer | path | Yes | The product post ID | 
| `post_title` | string | body | Yes | Product title (max 200 characters) | 
| `post_status` | string | body | Yes | Status: `draft`, `publish`, `future` | 
| `post_date` | string | body | Conditional | Required when `post_status` is `future`. Must be a future date (GMT) | 
| `post_excerpt` | string | body | No | Product short description (limited by `excerpt_length` filter, default 55 words) | 
| `post_content` | string | body | No | Product long description (HTML allowed) | 
| `post_name` | string | body | No | Product URL slug | 
| `comment_status` | string | body | No | Comment status (max 100 chars) | 
| `detail.fulfillment_type` | string | body | Yes | `physical` or `digital` | 
| `detail.variation_type` | string | body | Yes | `simple` or `simple_variations` | 
| `detail.manage_stock` | integer | body | No | `0` or `1` | 
| `detail.manage_downloadable` | integer | body | No | `0` or `1` | 
| `detail.default_variation_id` | integer | body | No | Default variation ID | 
| `detail.stock_availability` | string | body | No | Stock availability status | 
| `detail.other_info.group_pricing_by` | string | body | No | `payment_type`, `repeat_interval`, or `none` | 
| `detail.other_info.sold_individually` | string | body | No | `yes` or `no` | 
| `detail.other_info.use_pricing_table` | string | body | No | Enable pricing table display | 
| `detail.other_info.shipping_class` | integer | body | No | Shipping class ID (validated) | 
| `detail.other_info.tax_class` | integer | body | No | Tax class ID (validated) | 
| `detail.other_info.active_editor` | string | body | No | Active editor mode | 
| `variants` | array | body | Conditional | Array of variant objects (required for `simple` type when publishing) | 
| `variants.*.variation_title` | string | body | Yes | Variation title (max 200 chars) | 
| `variants.*.post_id` | integer | body | Yes | Parent product post ID | 
| `variants.*.item_price` | number | body | No | Price in cents (min: 0) | 
| `variants.*.compare_price` | number | body | No | Compare-at price in cents (must be >= `item_price`) | 
| `variants.*.manage_cost` | string | body | No | Enable cost tracking | 
| `variants.*.item_cost` | number | body | Conditional | Required if `manage_cost` is `true` | 
| `variants.*.serial_index` | integer | body | No | Display order index | 
| `variants.*.sku` | string | body | No | SKU (max 30 chars, must be unique) | 
| `variants.*.fulfillment_type` | string | body | No | `physical` or `digital` | 
| `variants.*.other_info.payment_type` | string | body | Yes | `onetime` or `subscription` | 
| `variants.*.other_info.description` | string | body | No | Variant description (max 255 chars) | 
| `variants.*.other_info.repeat_interval` | string | body | Conditional | Required for subscriptions. e.g., `monthly`, `yearly` | 
| `variants.*.other_info.times` | string | body | No | Number of billing cycles | 
| `variants.*.other_info.trial_days` | string | body | No | Trial period in days (max 365) | 
| `variants.*.other_info.billing_summary` | string | body | No | Billing summary text (max 255 chars) | 
| `variants.*.other_info.manage_setup_fee` | string | body | Conditional | Required for subscriptions: `yes` or `no` | 
| `variants.*.other_info.signup_fee` | number | body | Conditional | Setup fee in cents. Required if `manage_setup_fee` is `yes` | 
| `variants.*.other_info.signup_fee_name` | string | body | Conditional | Setup fee label (max 100 chars). Required if `manage_setup_fee` is `yes` | 
| `variants.*.other_info.installment` | string | body | No | Enable installment: `yes` or `no` | 
| `product_terms` | object | body | No | Taxonomy term IDs (e.g., `{"product-categories": [1, 2]}`) | 
| `gallery` | array | body | No | Gallery images array with `id`, `url`, `title` | 
| `metaValue` | mixed | body | No | Additional metadata | 
#### Response [](#response-5)
json
```
{
 "data": { ... },
 "message": "Product updated successfully"
}```

#### Example [](#example-5)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/123/pricing" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "post_title": "Updated Product",
 "post_status": "publish",
 "detail": {
 "fulfillment_type": "digital",
 "variation_type": "simple"
 },
 "variants": [
 {
 "id": 789,
 "post_id": 123,
 "variation_title": "Default Plan",
 "item_price": 1999,
 "other_info": {
 "payment_type": "onetime"
 }
 }
 ]
 }'```

## Product Search & Lookup [](#product-search-lookup)

### Search Products by Name [](#search-products-by-name)
GET `/fluent-cart/v2/products/searchProductByName`
Search for published products by name. Returns products formatted for select dropdowns.

- **Permission:** `products/view`

#### Parameters [](#parameters-6)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `name` | string | query | No | Product name to search for | 
| `url_mode` | string | query | No | URL mode flag | 
| `termId` | integer | query | No | Filter by taxonomy term ID (product-categories) | 
#### Response [](#response-6)
json
```
{
 "products": [
 {
 "ID": 123,
 "post_title": "Example Product",
 "wpTerms": [...]
 }
 ]
}```

#### Example [](#example-6)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/searchProductByName?name=widget" \
 -u "username:app_password"```

### Search Variants by Name [](#search-variants-by-name)
GET `/fluent-cart/v2/products/searchVariantByName`
Search for published product variants by name. Returns a hierarchical product > variants structure.

- **Permission:** `products/view`

#### Parameters [](#parameters-7)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `name` | string | query | No | Product/variant name to search | 
| `search` | string | query | No | Alternative search parameter (used if `name` is empty) | 
| `ids` | array | query | No | Array of product IDs to include | 
#### Response [](#response-7)
json
```
[
 {
 "value": 123,
 "label": "Example Product",
 "children": [
 {
 "value": 456,
 "label": "Monthly Plan"
 },
 {
 "value": 457,
 "label": "Yearly Plan"
 }
 ]
 }
]```

#### Example [](#example-7)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/searchVariantByName?name=pro" \
 -u "username:app_password"```

### Search Product Variant Options [](#search-product-variant-options)
GET `/fluent-cart/v2/products/search-product-variant-options`
Search for product variants suitable for selection (e.g., in order creation). Filters out out-of-stock items.

- **Permission:** `products/view`

#### Parameters [](#parameters-8)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `search` | string | query | No | Search term for product/variant title | 
| `include_ids` | array | query | No | Variation IDs to always include in results | 
| `scopes` | array | query | No | Model scopes to apply | 
| `subscription_status` | string | query | No | `not_subscribable` to exclude subscription variants | 
#### Response [](#response-8)
json
```
{
 "products": [
 {
 "value": "product_123",
 "label": "Example Product",
 "children": [
 {
 "value": 456,
 "label": "Monthly Plan"
 }
 ]
 }
 ]
}```

#### Example [](#example-8)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/search-product-variant-options?search=pro&subscription_status=not_subscribable" \
 -u "username:app_password"```

### Find Subscription Variants [](#find-subscription-variants)
GET `/fluent-cart/v2/products/findSubscriptionVariants`
Search for product variants that have a subscription payment type.

- **Permission:** `products/view`

#### Parameters [](#parameters-9)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `name` | string | query | No | Variant title to search | 
#### Response [](#response-9)
json
```
[
 {
 "id": 456,
 "title": "Monthly Subscription"
 },
 {
 "id": 457,
 "title": "Yearly Subscription"
 }
]```

#### Example [](#example-9)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/findSubscriptionVariants?name=monthly" \
 -u "username:app_password"```

### Fetch Products by IDs [](#fetch-products-by-ids)
GET `/fluent-cart/v2/products/fetchProductsByIds`
Retrieve products by an array of IDs. Returns products with their detail relation.

- **Permission:** `products/view`

#### Parameters [](#parameters-10)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `productIds` | array | query | Yes | Array of product IDs to fetch | 
#### Response [](#response-10)
json
```
{
 "products": [
 {
 "ID": 123,
 "post_title": "Example Product",
 "detail": { ... }
 }
 ]
}```

#### Example [](#example-10)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/fetchProductsByIds?productIds[]=123&productIds[]=456" \
 -u "username:app_password"```

### Fetch Variations by IDs [](#fetch-variations-by-ids)
GET `/fluent-cart/v2/products/fetchVariationsByIds`
Retrieve variations by an array of IDs. Returns simplified label/value pairs.

- **Permission:** `products/view`

#### Parameters [](#parameters-11)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `productIds` | array | query | Yes | Array of variation IDs to fetch | 
#### Response [](#response-11)
json
```
{
 "products": [
 {
 "value": 456,
 "label": "Monthly Plan"
 },
 {
 "value": 457,
 "label": "Yearly Plan"
 }
 ]
}```

#### Example [](#example-11)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/fetchVariationsByIds?productIds[]=456&productIds[]=457" \
 -u "username:app_password"```

### Suggest SKU [](#suggest-sku)
GET `/fluent-cart/v2/products/suggest-sku`
Generate a unique SKU suggestion based on product and variant titles.

- **Permission:** `products/view`

#### Parameters [](#parameters-12)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `title` | string | query | Yes | Product title to base SKU on | 
| `variant_title` | string | query | No | Variant title to include in SKU | 
| `exclude_id` | integer | query | No | Variation ID to exclude from uniqueness check | 
#### Response [](#response-12)
json
```
{
 "sku": "EXA-PRO-MON"
}```

#### Example [](#example-12)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/suggest-sku?title=Example%20Product&variant_title=Monthly" \
 -u "username:app_password"```

### Get Max Excerpt Word Count [](#get-max-excerpt-word-count)
GET `/fluent-cart/v2/products/get-max-excerpt-word-count`
Returns the maximum allowed word count for product excerpts (controlled by the WordPress `excerpt_length` filter).

- **Permission:** `products/view`

#### Parameters [](#parameters-13)

None.
#### Response [](#response-13)
json
```
{
 "count": 55
}```

#### Example [](#example-13)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/get-max-excerpt-word-count" \
 -u "username:app_password"```

### Fetch Taxonomy Terms [](#fetch-taxonomy-terms)
GET `/fluent-cart/v2/products/fetch-term`
Retrieve all registered taxonomies and their terms for product categorization.

- **Permission:** `products/view`

#### Parameters [](#parameters-14)

None.
#### Response [](#response-14)
json
```
{
 "taxonomies": [
 {
 "name": "product-categories",
 "label": "Product Categories",
 "terms": [
 {
 "value": 1,
 "label": "Software",
 "children": []
 }
 ]
 },
 {
 "name": "product-brands",
 "label": "Product Brands",
 "terms": []
 }
 ]
}```

#### Example [](#example-14)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/fetch-term" \
 -u "username:app_password"```

### Fetch Terms by Parent [](#fetch-terms-by-parent)
POST `/fluent-cart/v2/products/fetch-term-by-parent`
Retrieve taxonomy terms filtered by parent term IDs.

- **Permission:** `products/view`

#### Parameters [](#parameters-15)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `parents` | array | body | Yes | Array of parent term IDs | 
| `listeners` | array | body | Yes | Array of taxonomy names to retrieve terms for | 
#### Response [](#response-15)
json
```
{
 "data": {
 "product-categories": [
 {
 "value": 5,
 "label": "Sub Category"
 }
 ]
 }
}```

#### Example [](#example-15)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/fetch-term-by-parent" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "parents": [1, 2],
 "listeners": ["product-categories"]
 }'```

## Bulk Operations [](#bulk-operations)

### Bulk Insert Products [](#bulk-insert-products)
POST `/fluent-cart/v2/products/bulk-insert`
Insert multiple products at once. Maximum 10 products per request.

- **Permission:** `products/create`

#### Parameters [](#parameters-16)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `products` | array | body | Yes | Array of product data objects (max 10) | 
#### Response [](#response-16)
json
```
{
 "message": "3 product(s) created successfully",
 "created": [ ... ],
 "errors": []
}```

#### Example [](#example-16)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/bulk-insert" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "products": [
 {
 "post_title": "Product A",
 "detail": { "fulfillment_type": "digital" }
 },
 {
 "post_title": "Product B",
 "detail": { "fulfillment_type": "physical" }
 }
 ]
 }'```

### Bulk Edit Fetch [](#bulk-edit-fetch)
GET `/fluent-cart/v2/products/bulk-edit-data`
Fetch products formatted for the bulk editing spreadsheet view.

- **Permission:** `products/edit`

#### Parameters [](#parameters-17)

Standard filter parameters (see [List Products](#list-products)).
#### Response [](#response-17)
json
```
{
 "products": [ ... ],
 "columns": [ ... ]
}```

#### Example [](#example-17)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/bulk-edit-data" \
 -u "username:app_password"```

### Bulk Update Products [](#bulk-update-products)
POST `/fluent-cart/v2/products/bulk-update`
Update multiple products at once from the bulk edit view. Maximum 10 products per request.

- **Permission:** `products/edit`

#### Parameters [](#parameters-18)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `products` | array | body | Yes | Array of product data objects to update (max 10) | 
#### Response [](#response-18)
json
```
{
 "message": "3 product(s) updated successfully",
 "updated": [ ... ],
 "errors": []
}```

#### Example [](#example-18)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/bulk-update" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "products": [
 {
 "ID": 123,
 "post_title": "Updated Title A"
 }
 ]
 }'```

### Do Bulk Action [](#do-bulk-action)
POST `/fluent-cart/v2/products/do-bulk-action`
Perform bulk actions on selected products (e.g., publish, draft, delete).

- **Permission:** `products/edit`

#### Parameters [](#parameters-19)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `action` | string | body | Yes | The bulk action to perform | 
| `product_ids` | array | body | Yes | Array of product IDs to act on | 
#### Response [](#response-19)
json
```
{
 "message": "Bulk action completed successfully"
}```

#### Example [](#example-19)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/do-bulk-action" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "action": "publish",
 "product_ids": [123, 456, 789]
 }'```

### Create Dummy Products [](#create-dummy-products)
POST `/fluent-cart/v2/products/create-dummy`
Create sample/demo products for testing or onboarding purposes.

- **Permission:** `products/create`

#### Parameters [](#parameters-20)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `category` | string | body | No | Product category for dummy products | 
| `index` | integer | body | No | Index for dummy product generation | 
#### Response [](#response-20)

Returns the created dummy product data.
#### Example [](#example-20)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/create-dummy" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "category": "digital",
 "index": 1
 }'```

## Product Details & Configuration [](#product-details-configuration)

### Duplicate Product [](#duplicate-product)
POST `/fluent-cart/v2/products/{productId}/duplicate`
Duplicate a product with options to include or exclude certain settings. The new product is saved as a draft.

- **Permission:** `products/create`

#### Parameters [](#parameters-21)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `productId` | integer | path | Yes | The product ID to duplicate | 
| `import_stock_management` | string | body | No | Include stock management settings (`true`/`false`) | 
| `import_license_settings` | string | body | No | Include license settings (`true`/`false`) | 
| `import_downloadable_files` | string | body | No | Include downloadable files (`true`/`false`) | 
#### Response [](#response-21)
json
```
{
 "product_id": 125,
 "message": "Product duplicated successfully. The new product has been saved as a draft."
}```

#### Example [](#example-21)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/123/duplicate" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "import_stock_management": "true",
 "import_license_settings": "true",
 "import_downloadable_files": "false"
 }'```

### Get Related Products [](#get-related-products)
GET `/fluent-cart/v2/products/{productId}/related-products`
Retrieve products related to a given product based on shared categories or brands.

- **Permission:** `products/view`

#### Parameters [](#parameters-22)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `productId` | integer | path | Yes | The product ID | 
| `related_by_categories` | boolean | query | No | Include products from same categories | 
| `related_by_brands` | boolean | query | No | Include products from same brands | 
| `order_by` | string | query | No | Sort order (default: `title_asc`) | 
| `posts_per_page` | integer | query | No | Number of related products to return (default: `6`) | 
#### Response [](#response-22)
json
```
{
 "products": [
 {
 "ID": 456,
 "post_title": "Related Product",
 "post_status": "publish"
 }
 ]
}```

#### Example [](#example-22)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/123/related-products?related_by_categories=true&posts_per_page=4" \
 -u "username:app_password"```

### Update Long Description Editor Mode [](#update-long-description-editor-mode)
POST `/fluent-cart/v2/products/{postId}/update-long-desc-editor-mode`
Switch the long description editor between modes (e.g., visual, code).

- **Permission:** `products/edit`

#### Parameters [](#parameters-23)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `postId` | integer | path | Yes | The product post ID | 
| `active_editor` | string | body | Yes | The editor mode to set | 
#### Response [](#response-23)
json
```
{
 "message": "Editor mode updated successfully"
}```

#### Example [](#example-23)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/123/update-long-desc-editor-mode" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{"active_editor": "visual"}'```

### Update Variant Option [](#update-variant-option)
POST `/fluent-cart/v2/products/{postId}/update-variant-option`
Sync variant options for a product (used when managing product attribute variations).

- **Permission:** `products/edit`

#### Parameters [](#parameters-24)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `postId` | integer | path | Yes | The product post ID | 
| `variation_type` | string | body | Yes | The variation type | 
| `product_id` | integer | body | Yes | The product ID | 
| `options` | array | body | Yes | Array of option objects with `id` and `variants` | 
#### Response [](#response-24)
json
```
{
 "message": "Variant options synced successfully"
}```

#### Example [](#example-24)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/123/update-variant-option" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "variation_type": "simple_variations",
 "product_id": 123,
 "options": []
 }'```

### Update Product Detail [](#update-product-detail)
POST `/fluent-cart/v2/products/detail/{detailId}`
Update a product detail record (e.g., change variation type).

- **Permission:** `products/edit`

#### Parameters [](#parameters-25)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `detailId` | integer | path | Yes | The product detail ID | 
| `variation_type` | string | body | No | New variation type (e.g., `simple`, `simple_variations`) | 
| `variation_ids` | array | body | No | Array of variation IDs | 
| `action` | string | body | No | Action to perform (default: `change_variation_type`) | 
#### Response [](#response-25)
json
```
{
 "message": "Product detail updated successfully"
}```

#### Example [](#example-25)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/detail/456" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "variation_type": "simple_variations",
 "action": "change_variation_type"
 }'```

### Add Product Terms [](#add-product-terms)
POST `/fluent-cart/v2/products/add-product-terms`
Create new taxonomy terms for products (categories, brands, etc.).

- **Permission:** `products/edit`

#### Parameters [](#parameters-26)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `term.name` | string | body | Yes | Term name(s), comma-separated for multiple | 
| `term.taxonomy` | string | body | Yes | Taxonomy name (e.g., `product-categories`, `product-brands`) | 
| `term.parent` | integer | body | No | Parent term ID for hierarchical terms | 
#### Response [](#response-26)
json
```
{
 "term_ids": [10, 11],
 "names": ["Category A", "Category B"]
}```

#### Example [](#example-26)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/add-product-terms" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "term": {
 "name": "New Category,Another Category",
 "taxonomy": "product-categories",
 "parent": 0
 }
 }'```

### Sync Taxonomy Terms [](#sync-taxonomy-terms)
POST `/fluent-cart/v2/products/sync-taxonomy-term/{postId}`
Sync (replace) taxonomy terms for a product.

- **Permission:** `products/edit`

#### Parameters [](#parameters-27)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `postId` | integer | path | Yes | The product post ID | 
| `taxonomy` | string | body | Yes | Taxonomy name (e.g., `product-categories`) | 
| `terms` | array | body | No | Array of term IDs to sync | 
#### Response [](#response-27)
json
```
{
 "message": "Taxonomy terms synced successfully"
}```

#### Example [](#example-27)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/sync-taxonomy-term/123" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "taxonomy": "product-categories",
 "terms": [1, 5, 10]
 }'```

### Delete Taxonomy Term [](#delete-taxonomy-term)
POST `/fluent-cart/v2/products/delete-taxonomy-term/{postId}`
Remove a specific taxonomy term from a product.

- **Permission:** `products/edit`

#### Parameters [](#parameters-28)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `postId` | integer | path | Yes | The product post ID | 
| `taxonomy` | string | body | Yes | Taxonomy name (e.g., `product-categories`) | 
| `term` | integer | body | Yes | Term ID to remove | 
#### Response [](#response-28)
json
```
{
 "message": "Taxonomy term removed successfully"
}```

#### Example [](#example-28)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/delete-taxonomy-term/123" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "taxonomy": "product-categories",
 "term": 5
 }'```

### Get Pricing Widgets [](#get-pricing-widgets)
GET `/fluent-cart/v2/products/{productId}/pricing-widgets`
Retrieve sales overview widgets for a product (all-time, last 30 days, this month).

- **Permission:** `products/view`

#### Parameters [](#parameters-29)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `productId` | integer | path | Yes | The product ID | 
#### Response [](#response-29)
json
```
{
 "widgets": [
 {
 "title": "Quick Sales Overview",
 "body": "<ul class=\"fct-lists\"><li><span>All time (5)</span><span>$50.00</span></li>...</ul>"
 }
 ]
}```

#### Example [](#example-29)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/123/pricing-widgets" \
 -u "username:app_password"```

## Bundle Products [](#bundle-products)

### Get Bundle Info [](#get-bundle-info)
GET `/fluent-cart/v2/products/get-bundle-info/{productId}`
Retrieve bundle configuration information for a product, including child variant mappings.

- **Permission:** `products/view`

#### Parameters [](#parameters-30)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `productId` | integer | path | Yes | The product ID | 
#### Response [](#response-30)
json
```
[
 {
 "id": 789,
 "variation_title": "Bundle Plan",
 "other_info": {
 "bundle_child_ids": [101, 102, 103]
 }
 }
]```

#### Example [](#example-30)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/get-bundle-info/123" \
 -u "username:app_password"```

### Save Bundle Info [](#save-bundle-info)
POST `/fluent-cart/v2/products/save-bundle-info/{variationId}`
Save bundle child variant IDs for a variation. Bundle products cannot be added as children of other bundles.

- **Permission:** `products/edit`

#### Parameters [](#parameters-31)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `variationId` | integer | path | Yes | The variation ID to configure as a bundle | 
| `bundle_child_ids` | array | body | Yes | Array of child variation IDs | 
#### Response [](#response-31)
json
```
[true]```

#### Example [](#example-31)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/save-bundle-info/789" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "bundle_child_ids": [101, 102, 103]
 }'```

## Upgrade Paths [](#upgrade-paths)

### Get Upgrade Settings [](#get-upgrade-settings)
GET `/fluent-cart/v2/products/{id}/upgrade-paths`
Retrieve all upgrade path configurations for a product.

- **Permission:** `products/view`

#### Parameters [](#parameters-32)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The product ID | 
#### Response [](#response-32)
json
```
{
 "data": [ ... ]
}```

#### Example [](#example-32)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/123/upgrade-paths" \
 -u "username:app_password"```

### Save Upgrade Path [](#save-upgrade-path)
POST `/fluent-cart/v2/products/{id}/upgrade-path`
Create a new upgrade path for a product.

- **Permission:** `products/edit`
- **Request Class:** `UpgradePathSettingRequest`

#### Parameters [](#parameters-33)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The product ID | 
| `from_variant` | integer | body | Yes | Source variation ID (must exist in `fct_product_variations`) | 
| `to_variants` | array | body | Yes | Array of target variation IDs (each must exist in `fct_product_variations`) | 
| `discount_amount` | number | body | No | Discount amount for the upgrade | 
| `title` | string | body | No | Upgrade path title | 
| `description` | string | body | No | Upgrade path description | 
| `slug` | string | body | No | Upgrade path slug | 
#### Response [](#response-33)
json
```
{
 "message": "Settings saved successfully"
}```

#### Example [](#example-33)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/123/upgrade-path" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "from_variant": 456,
 "to_variants": [457, 458],
 "discount_amount": 500
 }'```

### Update Upgrade Path [](#update-upgrade-path)
POST `/fluent-cart/v2/products/upgrade-path/{id}/update`
Update an existing upgrade path.

- **Permission:** `products/edit`
- **Request Class:** `UpgradePathSettingRequest`

#### Parameters [](#parameters-34)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The upgrade path ID | 
| `from_variant` | integer | body | Yes | Source variation ID | 
| `to_variants` | array | body | Yes | Array of target variation IDs | 
| `discount_amount` | number | body | No | Discount amount | 
| `title` | string | body | No | Upgrade path title | 
| `description` | string | body | No | Upgrade path description | 
| `slug` | string | body | No | Upgrade path slug | 
#### Response [](#response-34)
json
```
{
 "message": "Settings updated successfully"
}```

#### Example [](#example-34)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/upgrade-path/10/update" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "from_variant": 456,
 "to_variants": [458, 459],
 "discount_amount": 1000
 }'```

### Delete Upgrade Path [](#delete-upgrade-path)
DELETE `/fluent-cart/v2/products/upgrade-path/{id}/delete`
Delete an upgrade path.

- **Permission:** `products/delete`

#### Parameters [](#parameters-35)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The upgrade path ID | 
#### Response [](#response-35)
json
```
{
 "message": "Path deleted successfully"
}```

#### Example [](#example-35)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/products/upgrade-path/10/delete" \
 -u "username:app_password"```

### Get Variation Upgrade Paths [](#get-variation-upgrade-paths)
GET `/fluent-cart/v2/products/variation/{variantId}/upgrade-paths`
Retrieve available upgrade paths for a specific variation (used in customer-facing upgrade flows).

- **Permission:** `products/view`

#### Parameters [](#parameters-36)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `variantId` | integer | path | Yes | The variation ID | 
| `params.order_hash` | string | query | Yes | The order hash to determine applicable upgrades | 
#### Response [](#response-36)
json
```
{
 "upgradePaths": [ ... ]
}```

#### Example [](#example-36)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/variation/456/upgrade-paths?params[order_hash]=abc123" \
 -u "username:app_password"```

## Tax & Shipping Classes [](#tax-shipping-classes)

### Update Tax Class [](#update-tax-class)
POST `/fluent-cart/v2/products/{postId}/tax-class`
Assign a tax class to a product.

- **Permission:** `products/edit`

#### Parameters [](#parameters-37)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `postId` | integer | path | Yes | The product post ID | 
| `tax_class` | integer | body | Yes | Tax class ID | 
#### Response [](#response-37)
json
```
{
 "message": "Tax Class updated successfully"
}```

#### Example [](#example-37)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/123/tax-class" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{"tax_class": 5}'```

### Remove Tax Class [](#remove-tax-class)
POST `/fluent-cart/v2/products/{postId}/tax-class/remove`
Remove the assigned tax class from a product.

- **Permission:** `products/edit`

#### Parameters [](#parameters-38)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `postId` | integer | path | Yes | The product post ID | 
#### Response [](#response-38)
json
```
{
 "message": "Tax Class removed successfully"
}```

#### Example [](#example-38)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/123/tax-class/remove" \
 -u "username:app_password"```

### Update Shipping Class [](#update-shipping-class)
POST `/fluent-cart/v2/products/{postId}/shipping-class`
Assign a shipping class to a product.

- **Permission:** `products/edit`

#### Parameters [](#parameters-39)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `postId` | integer | path | Yes | The product post ID | 
| `shipping_class` | integer | body | Yes | Shipping class ID | 
#### Response [](#response-39)
json
```
{
 "message": "Shipping Class updated successfully"
}```

#### Example [](#example-39)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/123/shipping-class" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{"shipping_class": 3}'```

### Remove Shipping Class [](#remove-shipping-class)
POST `/fluent-cart/v2/products/{postId}/shipping-class/remove`
Remove the assigned shipping class from a product.

- **Permission:** `products/edit`

#### Parameters [](#parameters-40)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `postId` | integer | path | Yes | The product post ID | 
#### Response [](#response-40)
json
```
{
 "message": "Shipping Class removed successfully"
}```

#### Example [](#example-40)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/123/shipping-class/remove" \
 -u "username:app_password"```

## Stock Management [](#stock-management)

### Update Inventory [](#update-inventory)
PUT `/fluent-cart/v2/products/{postId}/update-inventory/{variantId}`
Update stock levels for a specific variant. Automatically updates stock status and product-level availability.

- **Permission:** `products/edit`

#### Parameters [](#parameters-41)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `postId` | integer | path | Yes | The product post ID | 
| `variantId` | integer | path | Yes | The variant ID to update | 
| `total_stock` | integer | body | Yes | Total stock quantity | 
| `available` | integer | body | Yes | Available stock quantity | 
#### Response [](#response-41)
json
```
{
 "message": "Inventory updated successfully"
}```

#### Example [](#example-41)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/products/123/update-inventory/456" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "total_stock": 100,
 "available": 80
 }'```

### Update Manage Stock Setting [](#update-manage-stock-setting)
PUT `/fluent-cart/v2/products/{postId}/update-manage-stock`
Enable or disable stock management for a product and all its variants.

- **Permission:** `products/edit`

#### Parameters [](#parameters-42)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `postId` | integer | path | Yes | The product post ID | 
| `manage_stock` | integer | body | Yes | `1` to enable, `0` to disable stock management | 
#### Response [](#response-42)
json
```
{
 "message": "Manage stock updated successfully"
}```

#### Example [](#example-42)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/products/123/update-manage-stock" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{"manage_stock": 1}'```

## Downloadables [](#downloadables)

### Sync Downloadable Files [](#sync-downloadable-files)
POST `/fluent-cart/v2/products/{postId}/sync-downloadable-files`
Attach multiple downloadable files to a product. Automatically enables the `manage_downloadable` flag.

- **Permission:** `products/edit`
- **Validation Class:** `ProductDownloadableBulkFileRequest`

#### Parameters [](#parameters-43)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `postId` | integer | path | Yes | The product post ID | 
| `downloadable_files` | array | body | Yes | Array of downloadable file objects | 
| `downloadable_files.*.title` | string | body | Yes | File title (max 160 chars) | 
| `downloadable_files.*.type` | string | body | Yes | File type (max 100 chars) | 
| `downloadable_files.*.driver` | string | body | Yes | Storage driver (max 60 chars, e.g., `local`, `s3`) | 
| `downloadable_files.*.file_name` | string | body | Yes | File name (max 185 chars) | 
| `downloadable_files.*.file_path` | string | body | Yes | File path (max 185 chars) | 
| `downloadable_files.*.file_url` | string | body | Yes | File URL (max 200 chars) | 
| `downloadable_files.*.bucket` | string | body | No | Storage bucket name | 
| `downloadable_files.*.file_size` | string | body | No | File size | 
| `downloadable_files.*.serial` | integer | body | No | Display order serial | 
| `downloadable_files.*.product_variation_id` | array | body | No | Array of variation IDs this file is associated with | 
| `downloadable_files.*.settings.download_limit` | integer | body | No | Maximum number of downloads allowed | 
| `downloadable_files.*.settings.download_expiry` | integer | body | No | Download expiry in days | 
#### Response [](#response-43)
json
```
{
 "downloadable_files": [
 {
 "id": 1,
 "post_id": 123,
 "title": "Software v1.0",
 "type": "zip",
 "driver": "local",
 "file_name": "software-v1.zip",
 "download_identifier": "a1b2c3d4-..."
 }
 ]
}```

#### Example [](#example-43)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/123/sync-downloadable-files" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "postId": 123,
 "downloadable_files": [
 {
 "title": "Software v1.0",
 "type": "zip",
 "driver": "local",
 "file_name": "software-v1.zip",
 "file_path": "software-v1.zip",
 "file_url": "software-v1.zip",
 "product_variation_id": [456],
 "settings": {
 "download_limit": 5,
 "download_expiry": 365
 }
 }
 ]
 }'```

### Update Downloadable File [](#update-downloadable-file)
PUT `/fluent-cart/v2/products/{downloadableId}/update`
Update an existing downloadable file record.

- **Permission:** `products/edit`
- **Validation Class:** `ProductDownloadableFileRequest`

#### Parameters [](#parameters-44)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `downloadableId` | integer | path | Yes | The downloadable file ID | 
| `title` | string | body | Yes | File title (max 100 chars) | 
| `type` | string | body | Yes | File type (max 100 chars) | 
| `driver` | string | body | Yes | Storage driver (max 100 chars) | 
| `file_name` | string | body | Yes | File name (max 100 chars) | 
| `product_variation_id` | array | body | No | Array of variation IDs | 
| `serial` | integer | body | No | Display order serial | 
| `settings` | object | body | No | File settings | 
| `settings.download_limit` | integer | body | No | Maximum downloads allowed | 
| `settings.download_expiry` | integer | body | No | Download expiry in days | 
#### Response [](#response-44)
json
```
{
 "message": "Product downloadable files updated successfully"
}```

#### Example [](#example-44)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/products/789/update" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "title": "Software v2.0",
 "type": "zip",
 "driver": "local",
 "file_name": "software-v2.zip",
 "product_variation_id": [456, 457],
 "settings": {
 "download_limit": 10
 }
 }'```

### Delete Downloadable File [](#delete-downloadable-file)
DELETE `/fluent-cart/v2/products/{downloadableId}/delete`
Delete a downloadable file record.

- **Permission:** `products/delete`

#### Parameters [](#parameters-45)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `downloadableId` | integer | path | Yes | The downloadable file ID | 
#### Response [](#response-45)
json
```
{
 "message": "File deleted successfully"
}```

#### Example [](#example-45)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/products/789/delete" \
 -u "username:app_password"```

### Get Downloadable URL [](#get-downloadable-url)
GET `/fluent-cart/v2/products/getDownloadableUrl/{downloadableId}`
Generate a temporary download URL for a downloadable file (valid for 7 days).

- **Permission:** `products/view`

#### Parameters [](#parameters-46)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `downloadableId` | integer | path | Yes | The downloadable file ID | 
#### Response [](#response-46)
json
```
{
 "url": "https://example.com/fluent-cart/download?token=..."
}```

#### Example [](#example-46)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/getDownloadableUrl/789" \
 -u "username:app_password"```

## Variations [](#variations)

### List Product Variations [](#list-product-variations)
GET `/fluent-cart/v2/products/variants`
Retrieve a list of product variations.

- **Permission:** `products/view`

#### Parameters [](#parameters-47)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params` | object | query | No | Query parameters for filtering variations | 
#### Response [](#response-47)
json
```
{
 "variants": [ ... ]
}```

#### Example [](#example-47)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/variants" \
 -u "username:app_password"```

### Create Variation [](#create-variation)
POST `/fluent-cart/v2/products/variants`
Create a new product variation.

- **Permission:** `products/create`
- **Request Class:** `ProductVariationRequest`

#### Parameters [](#parameters-48)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `variants.post_id` | integer | body | Yes | Parent product ID | 
| `variants.variation_title` | string | body | Yes | Variation title (max 200 chars) | 
| `variants.sku` | string | body | No | SKU (max 30 chars, must be unique) | 
| `variants.item_price` | number | body | No | Price in cents (min: 0) | 
| `variants.compare_price` | number | body | No | Compare-at price in cents (must be >= `item_price`) | 
| `variants.manage_cost` | string | body | No | Enable cost tracking | 
| `variants.item_cost` | number | body | Conditional | Required if `manage_cost` is `true` | 
| `variants.fulfillment_type` | string | body | Yes | `physical` or `digital` | 
| `variants.manage_stock` | integer | body | No | `0` or `1` | 
| `variants.stock_status` | string | body | Conditional | Required if `manage_stock` is `1`. Values: `in-stock`, `out-of-stock` | 
| `variants.total_stock` | integer | body | Yes | Total stock quantity | 
| `variants.available` | integer | body | Yes | Available stock | 
| `variants.committed` | integer | body | Yes | Committed stock | 
| `variants.on_hold` | integer | body | Yes | Stock on hold | 
| `variants.serial_index` | integer | body | No | Display order index | 
| `variants.downloadable` | string | body | No | Downloadable flag | 
| `variants.other_info.payment_type` | string | body | Yes | `onetime` or `subscription` | 
| `variants.other_info.description` | string | body | No | Description (max 255 chars) | 
| `variants.other_info.repeat_interval` | string | body | Conditional | Required for subscriptions (e.g., `monthly`, `yearly`) | 
| `variants.other_info.times` | number | body | No | Number of billing cycles | 
| `variants.other_info.trial_days` | number | body | No | Trial days (max 365) | 
| `variants.other_info.billing_summary` | string | body | No | Billing summary (max 255 chars) | 
| `variants.other_info.manage_setup_fee` | string | body | Conditional | Required for subscriptions: `yes` or `no` | 
| `variants.other_info.signup_fee` | number | body | Conditional | Setup fee in cents. Required if `manage_setup_fee` is `yes` | 
| `variants.other_info.signup_fee_name` | string | body | Conditional | Setup fee label (max 100 chars). Required if `manage_setup_fee` is `yes` | 
| `variants.media` | array | body | No | Media images array with `id`, `url`, `title` | 
#### Response [](#response-48)
json
```
{
 "variant": {
 "id": 460,
 "post_id": 123,
 "variation_title": "Pro Plan",
 "item_price": 2999,
 "sku": "PRO-PLN",
 "stock_status": "in-stock"
 },
 "message": "Variation created successfully"
}```

#### Example [](#example-48)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/variants" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "variants": {
 "post_id": 123,
 "variation_title": "Pro Plan",
 "item_price": 2999,
 "sku": "PRO-PLN",
 "fulfillment_type": "digital",
 "total_stock": 1,
 "available": 1,
 "committed": 0,
 "on_hold": 0,
 "other_info": {
 "payment_type": "onetime"
 }
 }
 }'```

### Update Variation [](#update-variation)
POST `/fluent-cart/v2/products/variants/{variantId}`
Update an existing product variation.

- **Permission:** `products/edit`
- **Request Class:** `ProductVariationRequest`

#### Parameters [](#parameters-49)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `variantId` | integer | path | Yes | The variation ID to update | 
All body parameters are the same as [Create Variation](#create-variation).
#### Response [](#response-49)
json
```
{
 "variant": { ... },
 "message": "Variation updated successfully"
}```

#### Example [](#example-49)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/variants/460" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "variants": {
 "id": 460,
 "post_id": 123,
 "variation_title": "Pro Plan - Updated",
 "item_price": 3999,
 "fulfillment_type": "digital",
 "total_stock": 1,
 "available": 1,
 "committed": 0,
 "on_hold": 0,
 "other_info": {
 "payment_type": "onetime"
 }
 }
 }'```

### Delete Variation [](#delete-variation)
DELETE `/fluent-cart/v2/products/variants/{variantId}`
Delete a product variation.

- **Permission:** `products/delete`

#### Parameters [](#parameters-50)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `variantId` | integer | path | Yes | The variation ID to delete | 
#### Response [](#response-50)
json
```
{
 "message": "Variation deleted successfully"
}```

#### Example [](#example-50)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/products/variants/460" \
 -u "username:app_password"```

### Set Variation Media [](#set-variation-media)
POST `/fluent-cart/v2/products/variants/{variantId}/setMedia`
Set media/images for a variation.

- **Permission:** `products/edit`

#### Parameters [](#parameters-51)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `variantId` | integer | path | Yes | The variation ID | 
| `media` | array | body | Yes | Array of media objects | 
| `media.*.id` | integer | body | Yes | WordPress attachment ID | 
| `media.*.title` | string | body | No | Image title | 
| `media.*.url` | string | body | No | Image URL | 
#### Response [](#response-51)
json
```
{
 "message": "Media set successfully"
}```

#### Example [](#example-51)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/variants/460/setMedia" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "media": [
 {
 "id": 101,
 "title": "Product Image",
 "url": "https://example.com/wp-content/uploads/product.jpg"
 }
 ]
 }'```

### Update Variation Pricing Table [](#update-variation-pricing-table)
PUT `/fluent-cart/v2/products/variants/{variantId}/pricing-table`
Update the pricing table description for a variation.

- **Permission:** `products/edit`

#### Parameters [](#parameters-52)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `variantId` | integer | path | Yes | The variation ID | 
| `description` | string | body | Yes | Pricing table description text (newlines preserved) | 
#### Response [](#response-52)
json
```
{
 "message": "Pricing table updated successfully"
}```

#### Example [](#example-52)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/products/variants/460/pricing-table" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "description": "Includes:\n- Feature A\n- Feature B\n- Priority Support"
 }'```

## Variants (VariantController) [](#variants-variantcontroller)

### List All Variants [](#list-all-variants)
GET `/fluent-cart/v2/variants`
Retrieve all product variations across all products (separate route group using `VariantController`).

- **Permission:** `products/view`
- **Policy:** `ProductPolicy`

#### Parameters [](#parameters-53)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params` | object | query | No | Query parameters for filtering | 
#### Response [](#response-53)

Returns an array of all product variation objects.json
```
[
 {
 "id": 456,
 "post_id": 123,
 "variation_title": "Default Plan",
 "item_price": 1000,
 "sku": null,
 "stock_status": "in-stock",
 "payment_type": "onetime",
 "other_info": { ... }
 }
]```

#### Example [](#example-53)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/variants" \
 -u "username:app_password"```

## Product Integrations [](#product-integrations)

### Get Product Integration Feeds [](#get-product-integration-feeds)
GET `/fluent-cart/v2/products/{productId}/integrations`
Retrieve all integration feeds configured for a product, along with available integrations.

- **Permission:** `products/view`

#### Parameters [](#parameters-54)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `productId` | integer | path | Yes | The product ID | 
#### Response [](#response-54)
json
```
{
 "feeds": [
 {
 "id": 10,
 "name": "Add to FluentCRM List",
 "enabled": "yes",
 "provider": "fluentcrm",
 "feed": { ... },
 "scope": "product"
 }
 ],
 "available_integrations": {
 "fluentcrm": {
 "title": "FluentCRM",
 "logo": "...",
 "enabled": true,
 "scopes": ["product", "order"]
 }
 },
 "all_module_config_url": "https://example.com/wp-admin/admin.php?page=fluent-cart#/integrations"
}```

#### Example [](#example-54)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/123/integrations" \
 -u "username:app_password"```

### Get Product Integration Settings [](#get-product-integration-settings)
GET `/fluent-cart/v2/products/{product_id}/integrations/{integration_name}/settings`
Retrieve settings for a specific integration type on a product. Returns the integration form configuration, existing settings, and product variations.

- **Permission:** `products/view`

#### Parameters [](#parameters-55)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `product_id` | integer | path | Yes | The product ID | 
| `integration_name` | string | path | Yes | Integration provider name (e.g., `fluentcrm`) | 
| `integration_id` | integer | query | No | Existing integration feed ID to load for editing | 
#### Response [](#response-55)
json
```
{
 "settings": {
 "conditional_variation_ids": [],
 ...
 },
 "fields": [ ... ],
 "product_variations": [
 {
 "id": 456,
 "title": "Monthly Plan"
 }
 ],
 "scope": "product"
}```

#### Example [](#example-55)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/123/integrations/fluentcrm/settings" \
 -u "username:app_password"```

### Save Product Integration [](#save-product-integration)
POST `/fluent-cart/v2/products/{product_id}/integrations`
Create or update an integration feed for a product.

- **Permission:** `products/edit`

#### Parameters [](#parameters-56)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `product_id` | integer | path | Yes | The product ID | 
| `integration_name` | string | body | Yes | Integration provider name | 
| `integration_id` | integer | body | No | Existing feed ID (for updates) | 
| `integration` | string (JSON) | body | Yes | JSON-encoded integration settings object | 
#### Response [](#response-56)
json
```
{
 "message": "Integration has been successfully saved",
 "integration_id": 10,
 "integration_name": "fluentcrm",
 "created": true,
 "feedData": { ... }
}```

#### Example [](#example-56)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/123/integrations" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "integration_name": "fluentcrm",
 "integration": "{\"name\":\"Add to List\",\"list_id\":1,\"enabled\":\"yes\"}"
 }'```

### Delete Product Integration [](#delete-product-integration)
DELETE `/fluent-cart/v2/products/{product_id}/integrations/{integration_id}`
Delete a product integration feed.

- **Permission:** `products/delete`

#### Parameters [](#parameters-57)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `product_id` | integer | path | Yes | The product ID | 
| `integration_id` | integer | path | Yes | The integration feed ID to delete | 
#### Response [](#response-57)
json
```
{
 "message": "Integration deleted successfully"
}```

#### Example [](#example-57)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/products/123/integrations/10" \
 -u "username:app_password"```

### Change Integration Status [](#change-integration-status)
POST `/fluent-cart/v2/products/{product_id}/integrations/feed/change-status`
Enable or disable a product integration feed.

- **Permission:** `products/edit`

#### Parameters [](#parameters-58)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `product_id` | integer | path | Yes | The product ID | 
| `notification_id` | integer | body | Yes | The integration feed ID | 
| `status` | string | body | Yes | `yes` to enable, `no` to disable | 
#### Response [](#response-58)
json
```
{
 "message": "Integration status has been updated"
}```

#### Example [](#example-58)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/123/integrations/feed/change-status" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "product_id": 123,
 "notification_id": 10,
 "status": "yes"
 }'```

---

## Customers

Source: https://dev.fluentcart.com/restapi/customers.html


Manage customer records including creating customers, managing addresses, associating WordPress users, and viewing customer order history.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2/customers`
**Policy:** `CustomerPolicy`
All monetary values are in **cents** (e.g., `$10.00` = `1000`).
## Customer CRUD [](#customer-crud)

### List Customers [](#list-customers)
GET `/fluent-cart/v2/customers`
Retrieve a paginated list of customers with support for searching, sorting, and advanced filtering.

- **Permission:** `customers/view`

#### Parameters [](#parameters)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `search` | string | query | No | Search by customer name, email, or ID. Supports operator syntax (e.g., `id=5`, `ltv>1000`). | 
| `per_page` | integer | query | No | Number of items per page (1-199, default: 10) | 
| `page` | integer | query | No | Page number for pagination | 
| `sort_by` | string | query | No | Column to sort by. Must be a fillable field on the Customer model (default: `id`) | 
| `sort_type` | string | query | No | Sort direction: `asc` or `desc` (default: `desc`) | 
| `filter_type` | string | query | No | Filter mode: `simple` or `advanced` (default: `simple`) | 
| `advanced_filters` | string (JSON) | query | No | JSON-encoded array of advanced filter groups (Pro only). Supports filtering by order items, purchase count, purchase dates, customer name, email, LTV, and labels. | 
| `with` | array | query | No | Relationships to eager-load (e.g., `orders`, `labels`, `billing_address`, `shipping_address`) | 
| `select` | string/array | query | No | Comma-separated column names or array of columns to select | 
| `include_ids` | string/array | query | No | Comma-separated IDs or array of IDs that must be included in results | 
| `active_view` | string | query | No | Active tab/view filter | 
| `user_tz` | string | query | No | User timezone for date filter conversion | 
#### Response [](#response)
json
```
{
 "customers": {
 "total": 150,
 "per_page": 10,
 "current_page": 1,
 "last_page": 15,
 "data": [
 {
 "id": 1,
 "user_id": 5,
 "contact_id": null,
 "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "first_name": "John",
 "last_name": "Doe",
 "status": "active",
 "purchase_value": { ... },
 "purchase_count": 3,
 "ltv": 15000,
 "first_purchase_date": "2025-01-15 10:30:00",
 "last_purchase_date": "2025-06-20 14:00:00",
 "aov": 5000,
 "notes": "",
 "uuid": "a1b2c3d4...",
 "country": "US",
 "city": "New York",
 "state": "NY",
 "postcode": "10001",
 "created_at": "2025-01-10 08:00:00",
 "updated_at": "2025-06-20 14:00:00",
 "full_name": "John Doe",
 "photo": "https://gravatar.com/avatar/...",
 "country_name": "United States",
 "formatted_address": { ... },
 "user_link": "https://example.com/wp-admin/user-edit.php?user_id=5"
 }
 ]
 }
}```

#### Example [](#example)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customers?per_page=20&search=john&sort_by=created_at&sort_type=desc" \
 -u "username:app_password"```

### Create Customer [](#create-customer)
POST `/fluent-cart/v2/customers`
Create a new customer record. Automatically links to an existing WordPress user if a matching email is found.

- **Permission:** `customers/manage`

#### Parameters [](#parameters-1)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `email` | string | body | Yes | Customer email address. Must be unique and valid. Max 255 characters. | 
| `first_name` | string | body | Conditional | Customer first name. Required when store is not configured for full name mode. Max 255 characters. | 
| `last_name` | string | body | No | Customer last name. Max 255 characters. | 
| `full_name` | string | body | Conditional | Customer full name. Required when store is configured for full name mode. Max 255 characters. Automatically split into `first_name` and `last_name`. | 
| `city` | string | body | No | Customer city | 
| `state` | string | body | No | Customer state/province code | 
| `postcode` | string | body | No | Customer postal/zip code | 
| `country` | string | body | No | Customer country code (e.g., `US`, `GB`) | 
| `notes` | string | body | No | Internal notes about the customer | 
| `status` | string | body | No | Customer status | 
| `user_id` | integer | body | No | WordPress user ID to associate | 
| `wp_user` | string | body | No | Set to `yes` to create a new WordPress user account for this customer | 
| `aov` | string | body | No | Average order value | 
| `user_url` | string | body | No | Customer website URL | 
#### Response [](#response-1)

**Success (200):**json
```
{
 "message": "Customer created successfully!",
 "data": {
 "id": 42,
 "user_id": null,
 "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "first_name": "Jane",
 "last_name": "Smith",
 "status": "active",
 "purchase_value": [],
 "uuid": "e5f6g7h8...",
 "country": "US",
 "city": "Boston",
 "state": "MA",
 "postcode": "02101",
 "created_at": "2025-06-20 14:00:00",
 "updated_at": "2025-06-20 14:00:00"
 }
}```

**Error (email already exists):**json
```
{
 "code": 400,
 "message": "Customer already exists.",
 "data": ""
}```

#### Example [](#example-1)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customers" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "first_name": "Jane",
 "last_name": "Smith",
 "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "country": "US",
 "city": "Boston",
 "state": "MA",
 "postcode": "02101",
 "wp_user": "yes"
 }'```

### Get Customer [](#get-customer)
GET `/fluent-cart/v2/customers/{customerId}`
Retrieve a single customer by ID with optional eager-loaded relationships.

- **Permission:** `customers/view`

#### Parameters [](#parameters-2)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customerId` | integer | path | Yes | The customer ID | 
| `with` | array | query | No | Relationships to eager-load (e.g., `orders`, `labels`, `billing_address`, `shipping_address`, `subscriptions`, `wpUser`) | 
| `params[customer_only]` | string | query | No | Set to `yes` to return the customer without labels processing | 
#### Response [](#response-2)
json
```
{
 "customer": {
 "id": 1,
 "user_id": 5,
 "contact_id": null,
 "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "first_name": "John",
 "last_name": "Doe",
 "status": "active",
 "purchase_value": { ... },
 "purchase_count": 3,
 "ltv": 15000,
 "first_purchase_date": "2025-01-15 10:30:00",
 "last_purchase_date": "2025-06-20 14:00:00",
 "aov": 5000,
 "notes": "",
 "uuid": "a1b2c3d4...",
 "country": "US",
 "city": "New York",
 "state": "NY",
 "postcode": "10001",
 "created_at": "2025-01-10 08:00:00",
 "updated_at": "2025-06-20 14:00:00",
 "full_name": "John Doe",
 "photo": "https://gravatar.com/avatar/...",
 "country_name": "United States",
 "formatted_address": {
 "country": "United States",
 "state": "New York",
 "city": "New York",
 "postcode": "10001",
 "first_name": "John",
 "last_name": "Doe",
 "full_name": "John Doe"
 },
 "user_link": "https://example.com/wp-admin/user-edit.php?user_id=5",
 "selected_labels": [1, 3, 7],
 "labels": [ ... ]
 }
}```

**Error (404):**json
```
{
 "message": "Customer not found",
 "back_text": "Back to Customer List",
 "back_url": "/customers"
}```

#### Example [](#example-2)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customers/1?with[]=labels&with[]=billing_address" \
 -u "username:app_password"```

### Update Customer [](#update-customer)
PUT `/fluent-cart/v2/customers/{customerId}`
Update an existing customer. If the customer is linked to a WordPress user, the corresponding WP user profile is also updated.

- **Permission:** `customers/manage`

#### Parameters [](#parameters-3)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customerId` | integer | path | Yes | The customer ID | 
| `email` | string | body | Yes | Customer email address. Must be unique (excluding current customer). Max 255 characters. | 
| `first_name` | string | body | Conditional | Customer first name. Required when store is not configured for full name mode. Max 255 characters. | 
| `last_name` | string | body | No | Customer last name. Max 255 characters. | 
| `full_name` | string | body | Conditional | Customer full name. Required when store is configured for full name mode. Max 255 characters. | 
| `city` | string | body | No | Customer city | 
| `state` | string | body | No | Customer state/province code | 
| `postcode` | string | body | No | Customer postal/zip code | 
| `country` | string | body | No | Customer country code | 
| `notes` | string | body | No | Internal notes about the customer | 
| `status` | string | body | No | Customer status | 
| `user_id` | integer | body | No | WordPress user ID | 
| `aov` | string | body | No | Average order value | 
| `user_url` | string | body | No | Customer website URL | 
| `username` | string | body | No | Username | 
| `user_nicename` | string | body | No | User nicename | 
| `display_name` | string | body | No | Display name | 
#### Response [](#response-3)

**Success (200):**json
```
{
 "message": "Customer updated successfully!",
 "data": {
 "id": 1,
 "user_id": 5,
 "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "first_name": "John",
 "last_name": "Doe",
 "status": "active",
 "...": "..."
 }
}```

#### Example [](#example-3)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/customers/1" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "first_name": "John",
 "last_name": "Doe",
 "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "city": "San Francisco",
 "state": "CA",
 "country": "US"
 }'```

### Update Additional Info (Labels) [](#update-additional-info-labels)
PUT `/fluent-cart/v2/customers/{customerId}/additional-info`
Update a customer's labels/tags. Manages the label relationships for a customer by syncing provided label IDs with existing ones.

- **Permission:** `customers/manage`

#### Parameters [](#parameters-4)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customerId` | integer | path | Yes | The customer ID | 
| `labels` | array | body | Yes | Array of label IDs to assign to the customer. Existing labels not in this array will be removed. | 
#### Response [](#response-4)

**Success (200):**json
```
{
 "message": "Customer updated successfully!",
 "data": { ... }
}```

#### Example [](#example-4)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/customers/1/additional-info" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "labels": [1, 3, 7]
 }'```

### Bulk Actions [](#bulk-actions)
POST `/fluent-cart/v2/customers/do-bulk-action`
Perform bulk operations on multiple customers such as deletion or status change.

- **Permission:** `customers/manage`

#### Parameters [](#parameters-5)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `action` | string | body | Yes | The action to perform. Supported values: `delete_customers`, `change_customer_status` | 
| `customer_ids` | array | body | Yes | Array of customer IDs to act upon | 
| `new_status` | string | body | Conditional | Required when action is `change_customer_status`. The new status to apply to the selected customers. Must be a valid editable customer status. | 
#### Response [](#response-5)

**Success (delete_customers):**json
```
{
 "message": "Selected Customers has been deleted permanently",
 "data": ""
}```

**Success (change_customer_status):**json
```
{
 "message": "Customer Status has been changed",
 "data": ""
}```

**Error (missing selection):**json
```
{
 "code": 403,
 "message": "Customers selection is required",
 "data": ""
}```

#### Example [](#example-5)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customers/do-bulk-action" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "action": "change_customer_status",
 "customer_ids": [1, 2, 3],
 "new_status": "archived"
 }'```

## Customer Stats & Orders [](#customer-stats-orders)

### Get Customer Stats [](#get-customer-stats)
GET `/fluent-cart/v2/customers/get-stats/{customer}`
Retrieve widget/stats data for a specific customer. Results are extensible via the `fluent_cart/widgets/single_customer` filter.

- **Permission:** `customers/view`

#### Parameters [](#parameters-6)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customer` | integer | path | Yes | The customer ID | 
#### Response [](#response-6)
json
```
{
 "widgets": []
}```

The `widgets` array is populated by modules and extensions that hook into the `fluent_cart/widgets/single_customer` filter.
#### Example [](#example-6)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customers/get-stats/1" \
 -u "username:app_password"```

### Get Customer Orders [](#get-customer-orders)
GET `/fluent-cart/v2/customers/{customerId}/orders`
Retrieve a paginated list of orders belonging to a specific customer. Supports the same filtering and sorting parameters as the main Orders list.

- **Permission:** `customers/view`

#### Parameters [](#parameters-7)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customerId` | integer | path | Yes | The customer ID | 
| `search` | string | query | No | Search orders by invoice number, customer name/email, or order item title | 
| `per_page` | integer | query | No | Number of items per page (1-199, default: 10) | 
| `page` | integer | query | No | Page number for pagination | 
| `sort_by` | string | query | No | Column to sort by (default: `id`) | 
| `sort_type` | string | query | No | Sort direction: `asc` or `desc` (default: `desc`) | 
| `filter_type` | string | query | No | Filter mode: `simple` or `advanced` (default: `simple`) | 
| `advanced_filters` | string (JSON) | query | No | JSON-encoded array of advanced filter groups | 
| `active_view` | string | query | No | Active tab filter (e.g., `on-hold`, `paid`, `completed`, `processing`) | 
#### Response [](#response-7)
json
```
{
 "orders": {
 "total": 5,
 "per_page": 10,
 "current_page": 1,
 "last_page": 1,
 "data": [
 {
 "id": 101,
 "invoice_no": "FCT-0101",
 "customer_id": 1,
 "status": "completed",
 "payment_status": "paid",
 "total_amount": 5000,
 "...": "..."
 }
 ]
 }
}```

#### Example [](#example-7)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customers/1/orders?per_page=10&sort_by=created_at&sort_type=desc" \
 -u "username:app_password"```

### Find Customer Order [](#find-customer-order)
GET `/fluent-cart/v2/customers/{customerId}/order`
Retrieve all orders for a customer with their filtered order items (line items) eager-loaded.

- **Permission:** `customers/view`

#### Parameters [](#parameters-8)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customerId` | integer | path | Yes | The customer ID | 
#### Response [](#response-8)
json
```
{
 "data": {
 "data": [
 {
 "id": 101,
 "customer_id": 1,
 "invoice_no": "FCT-0101",
 "total_amount": 5000,
 "filtered_order_items": [
 {
 "id": 1,
 "order_id": 101,
 "title": "Product Name",
 "quantity": 2,
 "unit_price": 2500,
 "...": "..."
 }
 ],
 "...": "..."
 }
 ]
 }
}```

#### Example [](#example-8)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customers/1/order" \
 -u "username:app_password"```

### Recalculate Lifetime Value [](#recalculate-lifetime-value)
POST `/fluent-cart/v2/customers/{customerId}/recalculate-ltv`
Recalculate a customer's lifetime value (LTV) by summing net payments from all successful orders. Also updates `purchase_count`, `first_purchase_date`, `last_purchase_date`, and `aov` (average order value).

- **Permission:** `customers/manage`

#### Parameters [](#parameters-9)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customerId` | integer | path | Yes | The customer ID | 
#### Response [](#response-9)

**Success (200):**json
```
{
 "message": "Lifetime value recalculated successfully",
 "customer": {
 "id": 1,
 "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "first_name": "John",
 "last_name": "Doe",
 "purchase_count": 5,
 "ltv": 25000,
 "aov": 5000,
 "first_purchase_date": "2025-01-15 10:30:00",
 "last_purchase_date": "2025-06-20 14:00:00",
 "...": "..."
 }
}```

**Error (404):**json
```
{
 "message": "Customer not found."
}```

The LTV calculation sums `total_paid - total_refund` for each order with a successful payment status. Only net-positive amounts are counted.
#### Example [](#example-9)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customers/1/recalculate-ltv" \
 -u "username:app_password"```

## Address Management [](#address-management)

### Get Customer Addresses [](#get-customer-addresses)
GET `/fluent-cart/v2/customers/{customerId}/address`
Retrieve addresses for a customer, optionally filtered by address type. Results are sorted with the primary address first.

- **Permission:** `customers/view`

#### Parameters [](#parameters-10)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customerId` | integer | path | Yes | The customer ID | 
| `type` | string | query | No | Address type filter: `billing` or `shipping` (default: `billing`) | 
#### Response [](#response-10)
json
```
{
 "addresses": [
 {
 "id": 1,
 "customer_id": 1,
 "is_primary": 1,
 "type": "billing",
 "status": "active",
 "label": "Home",
 "name": "John Doe",
 "address_1": "123 Main Street",
 "address_2": "Apt 4B",
 "city": "New York",
 "state": "NY",
 "postcode": "10001",
 "country": "US",
 "phone": "+1-555-0100",
 "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "meta": { ... },
 "created_at": "2025-01-10 08:00:00",
 "updated_at": "2025-06-20 14:00:00",
 "formatted_address": {
 "country": "United States",
 "state": "New York",
 "city": "New York",
 "postcode": "10001",
 "address_1": "123 Main Street",
 "address_2": "Apt 4B",
 "type": "billing",
 "name": "John Doe",
 "company_name": "Acme Inc",
 "label": "Home",
 "phone": "+1-555-0100",
 "full_address": "Acme Inc, 123 Main Street, Apt 4B, New York, New York, United States"
 },
 "company_name": "Acme Inc"
 }
 ]
}```

#### Example [](#example-10)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customers/1/address?type=billing" \
 -u "username:app_password"```

### Create Address [](#create-address)
POST `/fluent-cart/v2/customers/{customerId}/address`
Create a new address for a customer. If no primary address exists for the given type, this address is automatically set as primary. Optionally syncs with an associated order address.

- **Permission:** `customers/manage`

#### Parameters [](#parameters-11)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customerId` | integer | path | Yes | The customer ID | 
| `name` | string | body | Yes | Full name for the address. Max 255 characters. | 
| `email` | string | body | Yes | Email for the address. Max 255 characters. | 
| `address_1` | string | body | Yes | Primary street address | 
| `address_2` | string | body | No | Secondary address line (apartment, suite, etc.) | 
| `city` | string | body | Yes | City. Max 255 characters. | 
| `state` | string | body | Conditional | State/province code. May be required depending on store localization settings. | 
| `postcode` | string | body | Conditional | Postal/zip code. May be required depending on store localization settings. | 
| `country` | string | body | Yes | Country code (e.g., `US`, `GB`) | 
| `phone` | string | body | No | Phone number | 
| `type` | string | body | Yes | Address type: `billing` or `shipping` | 
| `label` | string | body | No | Custom label for the address (e.g., `Home`, `Office`). Max 15 characters. | 
| `status` | string | body | No | Address status (default: `active`) | 
| `is_primary` | integer | body | No | Set to `1` to make this the primary address (default: `0`) | 
| `company_name` | string | body | No | Company name. Max 255 characters. | 
| `order_id` | integer | body | No | Order ID to sync this address with. When provided with a primary address, the corresponding order address is also created/updated. | 
#### Response [](#response-11)

**Success (200):**json
```
{
 "message": "Billing address created successfully!",
 "data": {
 "id": 5,
 "customer_id": 1,
 "is_primary": 0,
 "type": "billing",
 "status": "active",
 "label": "Office",
 "name": "John Doe",
 "address_1": "456 Business Ave",
 "address_2": "",
 "city": "New York",
 "state": "NY",
 "postcode": "10002",
 "country": "US",
 "phone": "+1-555-0200",
 "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "...": "..."
 }
}```

#### Example [](#example-11)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customers/1/address" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "name": "John Doe",
 "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "address_1": "456 Business Ave",
 "city": "New York",
 "state": "NY",
 "postcode": "10002",
 "country": "US",
 "phone": "+1-555-0200",
 "type": "billing",
 "label": "Office",
 "company_name": "Acme Inc"
 }'```

### Update Address [](#update-address)
PUT `/fluent-cart/v2/customers/{customerId}/address`
Update an existing customer address by its address record ID. Optionally syncs changes to an associated order address.

- **Permission:** `customers/manage`

#### Parameters [](#parameters-12)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customerId` | integer | path | Yes | The customer ID | 
| `id` | integer | body | Yes | The address record ID to update | 
| `name` | string | body | Yes | Full name for the address. Max 255 characters. | 
| `email` | string | body | Yes | Email for the address. Max 255 characters. | 
| `address_1` | string | body | Yes | Primary street address | 
| `address_2` | string | body | No | Secondary address line | 
| `city` | string | body | Yes | City. Max 255 characters. | 
| `state` | string | body | Conditional | State/province code. May be required depending on store localization settings. | 
| `postcode` | string | body | Conditional | Postal/zip code. May be required depending on store localization settings. | 
| `country` | string | body | Yes | Country code | 
| `phone` | string | body | No | Phone number | 
| `type` | string | body | Yes | Address type: `billing` or `shipping` | 
| `label` | string | body | No | Custom label. Max 15 characters. | 
| `status` | string | body | No | Address status | 
| `is_primary` | integer | body | No | Set to `1` for primary address | 
| `company_name` | string | body | No | Company name. Max 255 characters. | 
| `order_id` | integer | body | No | Order ID to sync address changes with | 
#### Response [](#response-12)

**Success (200):**json
```
{
 "message": "Billing address updated successfully!",
 "data": {
 "id": 5,
 "customer_id": 1,
 "is_primary": 0,
 "type": "billing",
 "name": "John Doe",
 "address_1": "789 Updated Street",
 "...": "..."
 }
}```

**Error (404):**json
```
{
 "code": 404,
 "message": "Address not found, please reload the page and try again!",
 "data": ""
}```

#### Example [](#example-12)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/customers/1/address" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "id": 5,
 "name": "John Doe",
 "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "address_1": "789 Updated Street",
 "city": "New York",
 "state": "NY",
 "postcode": "10003",
 "country": "US",
 "type": "billing"
 }'```

### Delete Address [](#delete-address)
DELETE `/fluent-cart/v2/customers/{customerId}/address`
Delete a customer address. Primary addresses and the last remaining address cannot be deleted.

- **Permission:** `customers/delete`

#### Parameters [](#parameters-13)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customerId` | integer | path | Yes | The customer ID | 
| `address[id]` | integer | body/query | Yes | The address record ID to delete | 
#### Response [](#response-13)

**Success (200):**json
```
{
 "message": "Address successfully deleted.",
 "data": ""
}```

**Error (primary address):**json
```
{
 "code": 403,
 "message": "Primary address cannot be deleted!",
 "data": ""
}```

**Error (last address):**json
```
{
 "code": 403,
 "message": "At least one address must remain. Address deletion failed!",
 "data": ""
}```

#### Example [](#example-13)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/customers/1/address" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "address": {
 "id": 5
 }
 }'```

### Set Primary Address [](#set-primary-address)
POST `/fluent-cart/v2/customers/{customerId}/address/make-primary`
Set a specific address as the primary address for its type. The previous primary address of the same type is automatically demoted.

- **Permission:** `customers/manage`

#### Parameters [](#parameters-14)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customerId` | integer | path | Yes | The customer ID | 
| `addressId` | integer | body | Yes | The address record ID to make primary | 
| `type` | string | body | Yes | Address type: `billing` or `shipping` | 
#### Response [](#response-14)

**Success (200):**json
```
{
 "message": "Address successfully set as the primary",
 "data": ""
}```

**Error (400):**json
```
{
 "code": 400,
 "message": "Address set as primary failed.",
 "data": ""
}```

#### Example [](#example-14)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customers/1/address/make-primary" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "addressId": 5,
 "type": "billing"
 }'```

## User Association [](#user-association)

### Get Attachable Users [](#get-attachable-users)
GET `/fluent-cart/v2/customers/attachable-user`
Retrieve a list of WordPress users that are not yet associated with any FluentCart customer. Useful for linking existing WP users to customer records.

- **Permission:** `customers/manage`

#### Parameters [](#parameters-15)

No parameters required.
#### Response [](#response-15)
json
```
{
 "users": [
 {
 "ID": 10,
 "display_name": "Alice Johnson",
 "user_email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)"
 },
 {
 "ID": 15,
 "display_name": "Bob Wilson",
 "user_email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)"
 }
 ]
}```

#### Example [](#example-15)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customers/attachable-user" \
 -u "username:app_password"```

### Attach WordPress User [](#attach-wordpress-user)
POST `/fluent-cart/v2/customers/{customerId}/attachable-user`
Link a WordPress user to an existing customer record. The customer must not already have a linked user, and the target user must not already be linked to another customer.

- **Permission:** `customers/manage`

#### Parameters [](#parameters-16)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customerId` | integer | path | Yes | The customer ID | 
| `user_id` | integer | body | Yes | The WordPress user ID to attach. Max 50 characters. Must reference an existing user who is not already linked to a customer. | 
#### Response [](#response-16)

**Success (200):**json
```
{
 "message": "User attached successfully"
}```

**Error (customer already has user):**json
```
{
 "message": "Can not attach user"
}```

**Error (user already linked):**json
```
{
 "code": "rest_request_validation",
 "message": "User already linked to a customer."
}```

**Error (user not found):**json
```
{
 "code": "rest_request_validation",
 "message": "User not found."
}```

#### Example [](#example-16)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customers/1/attachable-user" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "user_id": 10
 }'```

### Detach WordPress User [](#detach-wordpress-user)
POST `/fluent-cart/v2/customers/{customerId}/detach-user`
Remove the WordPress user association from a customer record. The customer record itself is preserved; only the `user_id` link is cleared.

- **Permission:** `customers/manage`

#### Parameters [](#parameters-17)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customerId` | integer | path | Yes | The customer ID | 
#### Response [](#response-17)

**Success (200):**json
```
{
 "message": "User detached successfully"
}```

**Error (customer not found):**json
```
{
 "message": "Customer not found."
}```

#### Example [](#example-17)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customers/1/detach-user" \
 -u "username:app_password"```

---

## Coupons

Source: https://dev.fluentcart.com/restapi/coupons.html


Create and manage discount coupons, apply coupons to orders, and configure coupon settings.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2/coupons`
**Policy:** `CouponPolicy`
All monetary values are in **cents** (e.g., `$10.00` = `1000`).
## List Coupon Codes [](#list-coupon-codes)
GET `/fluent-cart/v2/coupons/listCoupons`
Retrieve a simple array of active coupon codes. This lightweight endpoint is designed for use in order creation forms and quick coupon lookups.

- **Permission:** `orders/create` or `orders/manage` or `coupons/view`

### Response [](#response)
json
```
{
 "coupons": [
 "SAVE10",
 "WELCOME20",
 "FREESHIP"
 ]
}```

The response returns only the `code` values of coupons with `active` status.
### Example [](#example)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/coupons/listCoupons" \
 -u "username:app_password"```

## List Coupons (Paginated) [](#list-coupons-paginated)
GET `/fluent-cart/v2/coupons`
Retrieve a paginated list of coupons with optional filtering, sorting, and search. Coupon statuses are automatically updated based on their start/end dates before the response is returned.

- **Permission:** `coupons/view`

### Parameters [](#parameters)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `page` | integer | query | No | Page number for pagination | 
| `per_page` | integer | query | No | Number of records per page (1-199, default: 10) | 
| `search` | string | query | No | Search by coupon title, code, or ID. If the search string contains `%`, it searches percentage-type coupons by amount. Numeric values also match the `amount` field (auto-converted to cents). Supports operator syntax (e.g., `status = active`, `id > 5`) | 
| `sort_by` | string | query | No | Column to sort by (default: `id`). Must be a fillable column on the Coupon model | 
| `sort_type` | string | query | No | Sort direction: `asc` or `desc` (default: `desc`) | 
| `active_view` | string | query | No | Tab filter. One of: `active`, `expired` | 
| `filter_type` | string | query | No | Filter mode: `simple` (default) or `advanced` | 
| `advanced_filters` | string (JSON) | query | No | JSON-encoded array of advanced filter groups (requires Pro) | 
| `with` | array/string | query | No | Eager-load relations | 
| `select` | array/string | query | No | Comma-separated list of columns to select | 
| `include_ids` | array/string | query | No | Comma-separated IDs that must always be included in results | 
| `user_tz` | string | query | No | User timezone for date filtering (e.g., `America/New_York`) | 
### Active View Filters [](#active-view-filters)

| View | Behavior | 
| --- | --- |
| `active` | Coupons where `status = 'active'` | 
| `expired` | Coupons where the `end_date` has passed (and is not null/empty), or where `status != 'active'` | 
### Response [](#response-1)
json
```
{
 "coupons": {
 "total": 25,
 "per_page": 10,
 "current_page": 1,
 "last_page": 3,
 "data": [
 {
 "id": 1,
 "parent": null,
 "title": "10% Off Everything",
 "code": "SAVE10",
 "status": "active",
 "type": "percentage",
 "conditions": {
 "min_purchase_amount": 5000,
 "max_discount_amount": 10000,
 "max_purchase_amount": 0,
 "apply_to_whole_cart": "no",
 "apply_to_quantity": "no",
 "max_uses": 100,
 "max_per_customer": 1,
 "excluded_categories": [],
 "included_categories": [],
 "excluded_products": [],
 "included_products": [],
 "email_restrictions": "",
 "is_recurring": "no"
 },
 "amount": 10,
 "stackable": "yes",
 "priority": 1,
 "use_count": 12,
 "notes": "",
 "show_on_checkout": "yes",
 "start_date": "2025-01-01 00:00:00",
 "end_date": "2025-12-31 23:59:59",
 "created_at": "2025-01-01 10:00:00",
 "updated_at": "2025-06-15 14:30:00",
 "total_items": 12
 }
 ]
 }
}```

**Notes:**

- `total_items` is an aggregate count of how many times this coupon has been applied (from the `fct_applied_coupons` table).
- For `percentage` type coupons, `amount` represents the percentage value (e.g., `10` = 10%).
- For `fixed` type coupons, `amount` is stored in **cents** (e.g., `1000` = $10.00).

### Example [](#example-1)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/coupons?page=1&per_page=20&search=SAVE&active_view=active" \
 -u "username:app_password"```

## Get Coupon Settings [](#get-coupon-settings)
GET `/fluent-cart/v2/coupons/getSettings`
Retrieve the global coupon settings (currently, whether coupon input is shown on the checkout page).

- **Permission:** `coupons/view`

### Response [](#response-2)
json
```
{
 "show_on_checkout": 1
}```

| Field | Type | Description | 
| --- | --- | --- |
| `show_on_checkout` | integer/boolean | Whether the coupon code input is displayed on the checkout page. `1` or `true` for yes, `0`, `false`, or `null` for no. | 
### Example [](#example-2)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/coupons/getSettings" \
 -u "username:app_password"```

## View Coupon Details [](#view-coupon-details)
GET `/fluent-cart/v2/coupons/{id}`
Retrieve detailed information about a specific coupon, including its activity log. The coupon status is automatically updated to `expired` if its `end_date` has passed.

- **Permission:** `coupons/view`

### Parameters [](#parameters-1)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The coupon ID | 
### Response [](#response-3)
json
```
{
 "coupon": {
 "id": 1,
 "parent": null,
 "title": "10% Off Everything",
 "code": "SAVE10",
 "status": "active",
 "type": "percentage",
 "conditions": {
 "min_purchase_amount": 5000,
 "max_discount_amount": 10000,
 "max_purchase_amount": 0,
 "apply_to_whole_cart": "no",
 "apply_to_quantity": "no",
 "max_uses": 100,
 "max_per_customer": 1,
 "excluded_categories": [],
 "included_categories": [],
 "excluded_products": [],
 "included_products": [],
 "email_restrictions": "",
 "is_recurring": "no"
 },
 "amount": 10,
 "stackable": "yes",
 "priority": 1,
 "use_count": 12,
 "notes": "Internal note about this coupon",
 "show_on_checkout": "yes",
 "start_date": "2025-01-01 00:00:00",
 "end_date": "2025-12-31 23:59:59",
 "created_at": "2025-01-01 10:00:00",
 "updated_at": "2025-06-15 14:30:00",
 "activities": [
 {
 "id": 1,
 "title": "Coupon Created",
 "content": "Coupon \"SAVE10\" created by Admin",
 "status": "success",
 "user_id": 1,
 "created_at": "2025-01-01 10:00:00",
 "user": {
 "ID": 1,
 "display_name": "Admin"
 }
 }
 ]
 }
}```

### Example [](#example-3)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/coupons/1" \
 -u "username:app_password"```

## Create Coupon [](#create-coupon)
POST `/fluent-cart/v2/coupons`
Create a new discount coupon.

- **Permission:** `coupons/manage`

### Parameters [](#parameters-2)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `title` | string | body | Yes | Coupon display name. Max 200 characters. | 
| `code` | string | body | Yes | Unique coupon code. Max 50 characters. Must be unique across all coupons. | 
| `type` | string | body | Yes | Discount type. One of: `fixed`, `percentage`, `free_shipping`, `buy_x_get_y` | 
| `amount` | number | body | Yes | Discount amount. For `percentage` type: value between 0-100 (e.g., `10` for 10%). For `fixed` type: amount in store currency (e.g., `10.00` for $10). Automatically converted to cents for `fixed` type. | 
| `status` | string | body | Yes | Coupon status. One of: `active`, `expired`, `disabled`, `scheduled` | 
| `stackable` | string | body | Yes | Whether coupon can be combined with others. `yes` or `no`. Max 50 characters. | 
| `show_on_checkout` | string | body | Yes | Whether to display the coupon on checkout. `yes` or `no`. Max 50 characters. | 
| `priority` | integer | body | No | Sort priority for discount calculation order. Lower numbers are applied first. Min: 0. | 
| `notes` | string | body | No | Internal notes about the coupon. | 
| `start_date` | string | body | Conditional | Start date in any parseable datetime format. Required if `end_date` is provided. Automatically converted to GMT. | 
| `end_date` | string | body | No | End date in any parseable datetime format. Must be after `start_date` if provided. Automatically converted to GMT. | 
| `conditions` | object | body | No | Coupon conditions and restrictions (see below). | 
### Conditions Object [](#conditions-object)

| Field | Type | Description | 
| --- | --- | --- |
| `min_purchase_amount` | number | Minimum purchase amount in store currency (e.g., `10.00`). Automatically converted to cents. | 
| `max_discount_amount` | number | Maximum discount cap in store currency. Automatically converted to cents. Useful for percentage coupons. | 
| `max_purchase_amount` | number | Maximum purchase amount allowed. | 
| `apply_to_whole_cart` | string | Apply discount to the entire cart. `yes` or `no`. | 
| `apply_to_quantity` | string | Apply discount per quantity. `yes` or `no`. | 
| `max_uses` | integer | Maximum total uses across all customers. Must be greater than or equal to `max_per_customer`. | 
| `max_per_customer` | integer | Maximum uses per individual customer. | 
| `included_products` | array | Array of product IDs the coupon is limited to. | 
| `excluded_products` | array | Array of product IDs excluded from the coupon. | 
| `included_categories` | array | Array of category (term taxonomy) IDs the coupon is limited to. | 
| `excluded_categories` | array | Array of category (term taxonomy) IDs excluded from the coupon. | 
| `email_restrictions` | string | Email-based restriction. | 
| `is_recurring` | string | Whether the coupon applies to subscription renewals. `yes` or `no`. | 
| `buy_products` | array | Product IDs for the "buy" part of buy-x-get-y coupons. | 
| `get_products` | array | Product IDs for the "get" part of buy-x-get-y coupons. | 
### Response [](#response-4)
json
```
{
 "message": "Coupon created successfully!",
 "data": {
 "id": 5,
 "parent": null,
 "title": "Summer Sale 20%",
 "code": "SUMMER20",
 "status": "active",
 "type": "percentage",
 "conditions": {
 "min_purchase_amount": 2000,
 "max_discount_amount": 5000,
 "max_purchase_amount": 0,
 "apply_to_whole_cart": "yes",
 "apply_to_quantity": "no",
 "max_uses": 500,
 "max_per_customer": 2,
 "excluded_categories": [],
 "included_categories": [],
 "excluded_products": [],
 "included_products": [],
 "email_restrictions": "",
 "is_recurring": "no"
 },
 "amount": 20,
 "stackable": "yes",
 "priority": 1,
 "use_count": 0,
 "notes": "",
 "show_on_checkout": "yes",
 "start_date": "2025-06-01 00:00:00",
 "end_date": "2025-08-31 23:59:59",
 "created_at": "2025-05-25 10:00:00",
 "updated_at": "2025-05-25 10:00:00"
 }
}```

### Validation Errors [](#validation-errors)

| Field | Rule | Message | 
| --- | --- | --- |
| `title` | required | Title is required. | 
| `code` | required, unique | Code is required. / This coupon code is already in use. | 
| `type` | required, in:fixed,percentage,free_shipping,buy_x_get_y | Type is required. | 
| `amount` | required, numeric, min:0, max:100 (percentage only) | Amount is required. / For percentage type, the amount should not be greater than 100. | 
| `status` | required, in:active,expired,disabled,scheduled | Status is required. | 
| `stackable` | required | Stackable is required. | 
| `show_on_checkout` | required | Show on checkout is required. | 
| `start_date` | required_if:end_date | Start date is required. | 
| `end_date` | after start_date | The end date must be after the start date. | 
| `conditions.max_uses` | >= max_per_customer | Max uses must be greater than or equal to max per customer. | 
### Hooks [](#hooks)

- `fluent_cart/coupon_created` -- Fired after a coupon is successfully created.

### Example [](#example-4)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/coupons" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "title": "Summer Sale 20%",
 "code": "SUMMER20",
 "type": "percentage",
 "amount": 20,
 "status": "active",
 "stackable": "yes",
 "show_on_checkout": "yes",
 "priority": 1,
 "start_date": "2025-06-01 00:00:00",
 "end_date": "2025-08-31 23:59:59",
 "conditions": {
 "min_purchase_amount": 20.00,
 "max_discount_amount": 50.00,
 "max_uses": 500,
 "max_per_customer": 2,
 "apply_to_whole_cart": "yes",
 "is_recurring": "no"
 }
 }'```

## Update Coupon [](#update-coupon)
PUT `/fluent-cart/v2/coupons/{id}`
Update an existing coupon. Accepts the same fields as Create Coupon.

- **Permission:** `coupons/manage`

### Parameters [](#parameters-3)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The coupon ID | 
The request body accepts the same fields as [Create Coupon](#create-coupon). All validation rules apply identically. The `code` uniqueness check excludes the current coupon (allowing you to keep the same code).
Empty string values for `max_uses`, `max_per_customer`, `max_discount_amount`, and `min_purchase_amount` are automatically converted to `null`.
### Response [](#response-5)
json
```
{
 "message": "Coupon updated successfully!",
 "data": {
 "id": 5,
 "title": "Summer Sale 25%",
 "code": "SUMMER25",
 "status": "active",
 "type": "percentage",
 "amount": 25,
 "conditions": { ... },
 "stackable": "yes",
 "priority": 1,
 "use_count": 12,
 "notes": "",
 "show_on_checkout": "yes",
 "start_date": "2025-06-01 00:00:00",
 "end_date": "2025-08-31 23:59:59",
 "created_at": "2025-05-25 10:00:00",
 "updated_at": "2025-06-20 11:00:00"
 }
}```

### Error Responses [](#error-responses)

| Code | Message | 
| --- | --- |
| 403 | Please edit a valid coupon! | 
| 404 | Coupon not found, please reload the page and try again! | 
| 400 | Coupon update failed. | 
### Hooks [](#hooks-1)

- `fluent_cart/coupon_updated` -- Fired after a coupon is successfully updated.

### Example [](#example-5)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/coupons/5" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "title": "Summer Sale 25%",
 "code": "SUMMER25",
 "type": "percentage",
 "amount": 25,
 "status": "active",
 "stackable": "yes",
 "show_on_checkout": "yes"
 }'```

## Delete Coupon [](#delete-coupon)
DELETE `/fluent-cart/v2/coupons/{id}`
Permanently delete a coupon.

- **Permission:** `coupons/delete`

### Parameters [](#parameters-4)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path/body | Yes | The coupon ID. Passed as a URL segment, but read from the request body internally. | 
### Response [](#response-6)
json
```
{
 "message": "Coupon successfully deleted.",
 "data": ""
}```

### Error Responses [](#error-responses-1)

| Code | Message | 
| --- | --- |
| 403 | Please use a valid coupon ID! | 
| 404 | Coupon not found in database, failed to remove. | 
| 400 | Coupon deletion failed! | 
### Example [](#example-6)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/coupons/5" \
 -u "username:app_password"```

## Apply Coupon [](#apply-coupon)
POST `/fluent-cart/v2/coupons/apply`
Apply a coupon code to a set of order line items. This endpoint validates the coupon, checks eligibility for each line item, and returns the recalculated discount breakdown.

- **Permission:** `orders/create` or `orders/manage`

### Parameters [](#parameters-5)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `coupon_code` | string | body | Yes | The coupon code to apply. | 
| `order_items` | array | body | Yes | Array of order line item objects. | 
| `order_uuid` | string | body | No | UUID of an existing order to apply the coupon to. When provided, previously applied coupons from the order are included. Max 100 characters. | 
| `applied_coupons` | array | body | No | Array of coupon IDs that are already applied (but not yet persisted to the order). | 
| `customer_email` | string | body | No | Customer email for email-based coupon restrictions. | 
### Order Item Object [](#order-item-object)

| Field | Type | Required | Description | 
| --- | --- | --- | --- |
| `id` | integer | No | Line item ID (for existing orders). Min: 1. | 
| `order_id` | integer | No | Parent order ID. Min: 1. | 
| `post_id` | integer | No | Product post ID. Min: 1. | 
| `variation_id` | integer | No | Variation ID. Min: 1. | 
| `type` | string | No | Item type. Max 100 characters. | 
| `quantity` | integer | No | Item quantity. Min: 1. | 
| `title` | string | No | Item title. Max 100 characters. | 
| `price` | number | No | Item price in cents. | 
| `unit_price` | number | No | Unit price in cents. | 
| `item_cost` | number | No | Item cost in cents. | 
| `item_total` | number | No | Item total in cents. | 
| `tax_amount` | number | No | Tax amount in cents. | 
| `discount_total` | number | No | Discount total in cents. | 
| `total` | number | No | Total in cents. | 
| `line_total` | number | No | Line total in cents. | 
| `cart_index` | integer | No | Position in cart. | 
| `rate` | number | No | Tax rate. | 
| `line_meta` | string | No | Line item metadata. | 
| `other_info` | object | No | Additional item info (e.g., `payment_type`, `manage_setup_fee`, `signup_fee`). | 
### Response [](#response-7)
json
```
{
 "applied_coupons": {
 "SAVE10": {
 "id": 1,
 "title": "10% Off",
 "code": "SAVE10",
 "type": "percentage",
 "amount": 10,
 "discount_amount": 500,
 "stackable": "yes",
 "priority": 1
 }
 },
 "calculated_items": [
 {
 "post_id": 42,
 "quantity": 2,
 "price": 2500,
 "discounted_price": 2250,
 "discount_total": 500
 }
 ]
}```

### Error Responses [](#error-responses-2)

The coupon application may fail with a `WP_Error` for reasons including:

- Coupon code not found
- Coupon is expired or inactive
- Coupon usage limit reached
- Minimum purchase amount not met
- Product/category not eligible
- Coupon is not stackable with already-applied coupons

### Example [](#example-7)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/coupons/apply" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "coupon_code": "SAVE10",
 "order_items": [
 {
 "post_id": 42,
 "quantity": 2,
 "price": 2500,
 "unit_price": 2500,
 "item_total": 5000,
 "line_total": 5000,
 "other_info": {
 "payment_type": "onetime"
 }
 }
 ],
 "applied_coupons": []
 }'```

## Cancel Coupon [](#cancel-coupon)
POST `/fluent-cart/v2/coupons/cancel`
Remove a coupon from an order and recalculate the remaining discounts. If an `order_uuid` is provided and the coupon was already persisted to the order, it is deleted from the `fct_applied_coupons` table and the coupon's `use_count` is decremented.

- **Permission:** `orders/create` or `orders/manage`

### Parameters [](#parameters-6)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `coupon_code` | string | body | Yes | The coupon code to cancel. | 
| `order_items` | array | body | Yes | Array of current order line item objects (same structure as Apply Coupon). | 
| `id` | integer | body | No | The applied coupon record ID (from `fct_applied_coupons`). Required to delete the persisted record from an existing order. | 
| `order_uuid` | string | body | No | UUID of the existing order. Max 100 characters. | 
| `applied_coupons` | array | body | No | Array of remaining coupon IDs that should stay applied. | 
| `customer_email` | string | body | No | Customer email address. | 
### Response [](#response-8)
json
```
{
 "applied_coupons": {
 "WELCOME5": {
 "id": 2,
 "title": "Welcome $5 Off",
 "code": "WELCOME5",
 "type": "fixed",
 "amount": 500,
 "discount_amount": 500,
 "stackable": "yes",
 "priority": 2
 }
 },
 "calculated_items": [
 {
 "post_id": 42,
 "quantity": 2,
 "price": 2500,
 "discounted_price": 2250,
 "discount_total": 500
 }
 ]
}```

If all coupons are cancelled, `applied_coupons` will be an empty object and `calculated_items` will reflect the original prices.
### Example [](#example-8)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/coupons/cancel" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "coupon_code": "SAVE10",
 "id": 15,
 "order_uuid": "abc123-def456",
 "order_items": [
 {
 "post_id": 42,
 "quantity": 2,
 "price": 2500,
 "unit_price": 2500,
 "item_total": 5000,
 "line_total": 5000
 }
 ],
 "applied_coupons": [2]
 }'```

## Re-apply Coupons [](#re-apply-coupons)
POST `/fluent-cart/v2/coupons/re-apply`
Recalculate all previously applied coupons against the current order items. This is used when order items change (e.g., quantity update, item added/removed) and discounts need to be recalculated. If `order_items` is empty, all applied coupons on the order are deleted.

- **Permission:** `orders/create` or `orders/manage`

### Parameters [](#parameters-7)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order_uuid` | string | body | No | UUID of the existing order whose applied coupons should be reapplied. | 
| `order_items` | array | body | No | Array of current order line item objects. If empty, all applied coupons on the order are removed. Each item key is sanitized as text. | 
| `applied_coupons` | array | body | No | Array of coupon IDs to include (in addition to those already on the order). Values are cast to integers. | 
### Response [](#response-9)
json
```
{
 "applied_coupons": {
 "SAVE10": {
 "id": 1,
 "title": "10% Off",
 "code": "SAVE10",
 "type": "percentage",
 "amount": 10,
 "discount_amount": 450,
 "stackable": "yes",
 "priority": 1
 }
 },
 "calculated_items": [
 {
 "post_id": 42,
 "quantity": 1,
 "price": 2500,
 "discounted_price": 2250,
 "discount_total": 250
 },
 {
 "post_id": 55,
 "quantity": 1,
 "price": 2000,
 "discounted_price": 1800,
 "discount_total": 200
 }
 ]
}```

### Example [](#example-9)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/coupons/re-apply" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "order_uuid": "abc123-def456",
 "order_items": [
 {
 "post_id": 42,
 "quantity": 1,
 "price": 2500,
 "unit_price": 2500,
 "item_total": 2500,
 "line_total": 2500
 },
 {
 "post_id": 55,
 "quantity": 1,
 "price": 2000,
 "unit_price": 2000,
 "item_total": 2000,
 "line_total": 2000
 }
 ],
 "applied_coupons": [1]
 }'```

## Check Product Eligibility [](#check-product-eligibility)
POST `/fluent-cart/v2/coupons/checkProductEligibility`
Check whether a product is eligible for a set of applied coupons. This is used in the order form to validate that adding a product does not conflict with currently applied coupons.

- **Permission:** `orders/create` or `orders/manage`

### Parameters [](#parameters-8)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `productId` | integer | body | Yes | The product (post) ID to check eligibility for. | 
| `appliedCoupons` | array | body | No | Array of coupon codes currently applied. Each code is checked against the product's categories and the coupon's inclusion/exclusion rules. | 
| `origin` | string | body | No | The context where the check originates (e.g., `checkout`). | 
### Response (Eligible) [](#response-eligible)
json
```
{
 "isApplicable": true
}```

### Response (Not Eligible) [](#response-not-eligible)
json
```
{
 "isApplicable": false,
 "message": "Product A conflicts with SAVE10 coupon. Remove the coupon first."
}```

### Eligibility Rules [](#eligibility-rules)

The eligibility check evaluates these rules in order:

- If the coupon has `included_products` and the product is not in the list, check `included_categories` as a fallback.
- If no restrictions are set (no included/excluded products or categories), the product is eligible.
- If the product is in `excluded_products`, it is not eligible.
- If the product is in `included_products`, it is eligible.
- If the product's categories overlap with `excluded_categories`, it is not eligible.
- If `included_categories` is set and the product's categories do not overlap, it is not eligible.

### Example [](#example-10)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/coupons/checkProductEligibility" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "productId": 42,
 "appliedCoupons": ["SAVE10", "WELCOME5"],
 "origin": "admin_order"
 }'```

## Store Coupon Settings [](#store-coupon-settings)
POST `/fluent-cart/v2/coupons/storeCouponSettings`
Update the global coupon settings. Currently controls whether the coupon input field is displayed on the checkout page.

- **Permission:** `coupons/manage`

### Parameters [](#parameters-9)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `show_on_checkout` | boolean | body | No | Whether to show the coupon input on the checkout page. Any truthy value sets it to `1`, falsy sets to `0`. | 
### Response [](#response-10)

The response varies based on whether the setting already existed:
**If updating an existing setting:**json
```
true```

**If creating the setting for the first time:**json
```
{
 "id": 1,
 "meta_key": "fluent_cart_coupon_settings",
 "meta_value": 1,
 "object_id": 0,
 "object_type": ""
}```

### Example [](#example-11)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/coupons/storeCouponSettings" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "show_on_checkout": true
 }'```

## Coupon Model Reference [](#coupon-model-reference)

### Coupon Types [](#coupon-types)

| Type | Description | Amount Handling | 
| --- | --- | --- |
| `fixed` | Fixed amount discount | Stored in **cents** (e.g., `1000` = $10.00) | 
| `percentage` | Percentage discount | Stored as percentage (e.g., `10` = 10%). Max: 100. | 
| `free_shipping` | Free shipping coupon | Amount is typically `0` | 
| `buy_x_get_y` | Buy X Get Y promotion | Uses `conditions.buy_products` and `conditions.get_products` | 
### Coupon Statuses [](#coupon-statuses)

| Status | Description | 
| --- | --- |
| `active` | Coupon is available for use | 
| `expired` | Coupon has passed its end date (automatically set) | 
| `disabled` | Coupon has been manually disabled | 
| `scheduled` | Coupon start date is in the future (automatically set) | 
### Status Auto-Update Rules [](#status-auto-update-rules)

Coupon statuses are automatically updated when retrieved:

- If `end_date` has passed and status is not `expired`, it is set to `expired`.
- If `start_date` is in the future and status is not `disabled` or `scheduled`, it is set to `scheduled`.
- If `start_date` has passed and status is not `disabled` or `active`, it is set to `active`.

### Stackability [](#stackability)

| Value | Behavior | 
| --- | --- |
| `yes` | Coupon can be combined with other stackable coupons | 
| `no` | Coupon cannot be used alongside any other coupon | 
If a non-stackable coupon is already applied, no additional coupons can be added. If a non-stackable coupon is being applied while other coupons are already present, the application is rejected.
### Database Table [](#database-table)

Coupons are stored in the `fct_coupons` table with the following columns:

| Column | Type | Description | 
| --- | --- | --- |
| `id` | BIGINT (PK) | Auto-increment ID | 
| `parent` | BIGINT | Parent coupon ID (for variations) | 
| `title` | VARCHAR(200) | Display name | 
| `code` | VARCHAR(50) | Unique coupon code | 
| `status` | VARCHAR(20) | Coupon status | 
| `type` | VARCHAR(20) | Discount type | 
| `conditions` | TEXT (JSON) | JSON-encoded conditions object | 
| `amount` | BIGINT | Discount amount (cents for fixed, percentage for percentage type) | 
| `stackable` | VARCHAR(10) | Stackability flag | 
| `priority` | INT | Sort priority | 
| `use_count` | INT | Current usage count | 
| `notes` | TEXT | Internal notes | 
| `show_on_checkout` | VARCHAR(10) | Display on checkout flag | 
| `start_date` | DATETIME | Start date (GMT) | 
| `end_date` | DATETIME | End date (GMT) | 
| `created_at` | DATETIME | Creation timestamp | 
| `updated_at` | DATETIME | Last update timestamp | 
## Permissions Reference [](#permissions-reference)

| Endpoint | Permission(s) | 
| --- | --- |
| `GET /coupons/listCoupons` | `orders/create` or `orders/manage` or `coupons/view` | 
| `GET /coupons` | `coupons/view` | 
| `GET /coupons/getSettings` | `coupons/view` | 
| `GET /coupons/{id}` | `coupons/view` | 
| `POST /coupons` | `coupons/manage` | 
| `PUT /coupons/{id}` | `coupons/manage` | 
| `DELETE /coupons/{id}` | `coupons/delete` | 
| `POST /coupons/apply` | `orders/create` or `orders/manage` | 
| `POST /coupons/cancel` | `orders/create` or `orders/manage` | 
| `POST /coupons/re-apply` | `orders/create` or `orders/manage` | 
| `POST /coupons/checkProductEligibility` | `orders/create` or `orders/manage` | 
| `POST /coupons/storeCouponSettings` | `coupons/manage` | 
## Related Hooks [](#related-hooks)

| Hook | Type | Description | 
| --- | --- | --- |
| `fluent_cart/coupon_created` | Action | Fired after a coupon is created. Receives array with `data` and `coupon`. | 
| `fluent_cart/coupon_updated` | Action | Fired after a coupon is updated. Receives array with `data` and `coupon`. | 
| `fluent_cart/coupons_list_filter_query` | Filter | Modify the coupon list query before execution. |

---

## Subscriptions

Source: https://dev.fluentcart.com/restapi/subscriptions.html


Manage recurring subscriptions including listing, cancellation, reactivation, payment method updates, and customer self-service operations.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2`
All monetary values are in **cents** (e.g., `$10.00` = `1000`).
## Admin Endpoints [](#admin-endpoints)

Admin endpoints require an authenticated WordPress user with the appropriate FluentCart capability. Authorization is handled by the `OrderPolicy`.
### List Subscriptions [](#list-subscriptions)
GET `/fluent-cart/v2/subscriptions`
Retrieve a paginated list of subscriptions with optional filtering, sorting, and search.

- **Permission:** `subscriptions/view`
- **Policy:** `OrderPolicy`

#### Parameters [](#parameters)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `page` | integer | query | No | Page number for pagination | 
| `per_page` | integer | query | No | Number of records per page (default: 10, max: 200) | 
| `search` | string | query | No | Search term. Searches status, subscription ID (`#123`), customer email (`[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)`), parent order ID, item name, vendor subscription/customer/plan IDs, payment method, billing interval, and bill count. Also supports operator syntax (e.g., `ID = 5`) | 
| `sort_by` | string | query | No | Column to sort by (default: `id`). Must be a fillable column on the Subscription model | 
| `sort_type` | string | query | No | Sort direction: `asc` or `desc` (default: `desc`) | 
| `active_view` | string | query | No | Tab filter. One of: `active`, `pending`, `intended`, `paused`, `trialing`, `canceled`, `failing`, `expiring`, `expired` | 
| `filter_type` | string | query | No | Filter mode: `simple` (default) or `advanced` | 
| `advanced_filters` | string (JSON) | query | No | JSON-encoded array of advanced filter groups (requires Pro). Supports filtering by subscription, transaction, product, and license properties | 
| `with` | array/string | query | No | Eager-load relations. Supports relation names and `{relation}Count` for counts | 
| `select` | array/string | query | No | Comma-separated list of columns to select | 
| `scopes` | array | query | No | Model scopes to apply | 
| `include_ids` | array/string | query | No | Comma-separated IDs that must always be included in results | 
| `limit` | integer | query | No | Limit number of records (used with non-paginated queries) | 
| `offset` | integer | query | No | Offset for records | 
| `user_tz` | string | query | No | User timezone for date filtering (e.g., `America/New_York`) | 
#### Search Behavior [](#search-behavior)

The `search` parameter supports several input formats:

| Input Format | Behavior | 
| --- | --- |
| `#123` | Searches by subscription ID | 
| `[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)` | Searches by customer email | 
| `canceled` or `cancelled` | Matches canceled status | 
| Any other string | Searches across `parent_order_id`, `item_name`, `vendor_subscription_id`, `vendor_customer_id`, `vendor_plan_id`, `current_payment_method`, `billing_interval`, and `bill_count` | 
#### Advanced Filter Options [](#advanced-filter-options)

When using `filter_type=advanced`, the following filter categories are available:

| Category | Filter | Type | Description | 
| --- | --- | --- | --- |
| Subscription | `vendor_subscription_id` | text | Filter by vendor subscription ID | 
| Subscription | `status` | selections (multiple) | Filter by subscription status | 
| Subscription | `variation` | remote tree select | Filter by product variation / order items | 
| Subscription | `billing_interval` | selections (multiple) | Filter by billing interval: `yearly`, `half_yearly`, `quarterly`, `monthly`, `weekly`, `daily` | 
| Subscription | `current_payment_method` | selections (multiple) | Filter by payment method | 
| Subscription | `created_at` | dates | Filter by creation date range | 
| Subscription | `next_billing_date` | dates | Filter by next billing date range | 
| Subscription | `bill_count` | numeric | Filter by bill count | 
| Transaction | `transaction_id` | text (relation) | Filter by transaction vendor charge ID | 
| Transaction | `current_payment_method` | selections (multiple) | Filter by transaction payment method | 
| Product | `product` | remote tree select | Filter by product variation | 
| License | `license_key` | text (relation) | Filter by license key (Pro only) | 
| License | `license_status` | selections (multiple) | Filter by license status: `active`, `disabled`, `expired` (Pro only) | 
#### Response [](#response)
json
```
{
 "data": {
 "current_page": 1,
 "data": [
 {
 "id": 1,
 "uuid": "abc123-def456",
 "status": "active",
 "item_name": "Pro Plan",
 "parent_order_id": 10,
 "customer_id": 5,
 "product_id": 3,
 "variation_id": 7,
 "vendor_subscription_id": "sub_1234567890",
 "vendor_customer_id": "cus_abc123",
 "vendor_plan_id": "price_xyz789",
 "current_payment_method": "stripe",
 "billing_interval": "monthly",
 "recurring_amount": 2999,
 "bill_times": 0,
 "bill_count": 6,
 "next_billing_date": "2025-02-15 00:00:00",
 "created_at": "2025-01-15 10:30:00",
 "updated_at": "2025-01-15 10:35:00"
 }
 ],
 "per_page": 10,
 "total": 50,
 "last_page": 5
 }
}```

#### Example [](#example)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/subscriptions?page=1&per_page=10&active_view=active" \
 -u "username:app_password"```

### Get Subscription Details [](#get-subscription-details)
GET `/fluent-cart/v2/subscriptions/{subscriptionOrderId}`
Retrieve the full details of a single subscription including customer addresses, labels, activities, and related orders.

- **Permission:** `subscriptions/view`
- **Policy:** `OrderPolicy`

#### Parameters [](#parameters-1)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `subscriptionOrderId` | integer | path | Yes | The subscription ID | 
#### Response [](#response-1)

The response includes the subscription with eager-loaded relations:

- `labels` -- associated labels
- `activities.user` -- activity log with user info
- `customer.shipping_address` -- customer's primary shipping address
- `customer.billing_address` -- customer's primary billing address
- `order.billing_address` -- parent order's billing address
- `order.shipping_address` -- parent order's shipping address

Also includes:

- `related_orders` -- the parent order and all renewal orders (with order items)
- `selected_labels` -- array of label IDs applied to the subscription
json
```
{
 "subscription": {
 "id": 1,
 "uuid": "abc123-def456",
 "status": "active",
 "item_name": "Pro Plan",
 "parent_order_id": 10,
 "customer_id": 5,
 "product_id": 3,
 "variation_id": 7,
 "vendor_subscription_id": "sub_1234567890",
 "vendor_customer_id": "cus_abc123",
 "current_payment_method": "stripe",
 "billing_interval": "monthly",
 "recurring_amount": 2999,
 "bill_times": 0,
 "bill_count": 6,
 "next_billing_date": "2025-02-15 00:00:00",
 "billing_address": { ... },
 "shipping_address": { ... },
 "labels": [ ... ],
 "activities": [ ... ],
 "customer": {
 "id": 5,
 "shipping_address": { ... },
 "billing_address": { ... }
 },
 "related_orders": [
 {
 "id": 10,
 "order_items": [
 {
 "id": 1,
 "order_id": 10,
 "post_title": "Pro Plan",
 "title": "Pro Plan",
 "quantity": 1,
 "payment_type": "subscription",
 "line_meta": { ... }
 }
 ]
 }
 ]
 },
 "selected_labels": [1, 3, 5]
}```

#### Example [](#example-1)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/subscriptions/1" \
 -u "username:app_password"```

#### Error Response (404) [](#error-response-404)
json
```
{
 "message": "Subscription not found",
 "action_text": "Back to Subscription list",
 "action_url": "/subscriptions"
}```

### Cancel Subscription [](#cancel-subscription)
PUT `/fluent-cart/v2/orders/{order}/subscriptions/{subscription}/cancel`
Cancel a subscription both locally and with the remote payment gateway.

- **Permission:** `subscriptions/manage`
- **Policy:** `OrderPolicy`

#### Parameters [](#parameters-2)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order` | integer | path | Yes | The parent order ID | 
| `subscription` | integer | path | Yes | The subscription ID | 
| `cancel_reason` | string | body | Yes | Reason for cancellation. Sanitized with `sanitize_text_field` | 
#### Response [](#response-2)
json
```
{
 "message": "Subscription has been cancelled successfully!",
 "subscription": {
 "id": 1,
 "status": "canceled",
 ...
 }
}```

#### Error Responses [](#error-responses)

Missing cancel reason:json
```
{
 "message": "Please select cancel reason!"
}```

Remote cancellation failure (subscription still cancelled locally):json
```
{
 "message": "Subscription cancelled locally. Vendor Response: <vendor error message>"
}```

#### Example [](#example-2)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/orders/10/subscriptions/1/cancel" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{"cancel_reason": "Customer requested cancellation"}'```

### Fetch Subscription from Remote [](#fetch-subscription-from-remote)
PUT `/fluent-cart/v2/orders/{order}/subscriptions/{subscription}/fetch`
Re-sync a subscription's data from the remote payment gateway (e.g., Stripe, PayPal). Useful for resolving data inconsistencies between local records and the payment provider.

- **Permission:** `subscriptions/view`
- **Policy:** `OrderPolicy`

#### Parameters [](#parameters-3)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order` | integer | path | Yes | The parent order ID | 
| `subscription` | integer | path | Yes | The subscription ID | 
#### Response [](#response-3)
json
```
{
 "message": "Subscription fetched successfully from remote payment gateway!",
 "subscription": {
 "id": 1,
 "status": "active",
 "vendor_subscription_id": "sub_1234567890",
 ...
 }
}```

#### Error Response [](#error-response)
json
```
{
 "message": "<gateway error message>"
}```

#### Example [](#example-3)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/orders/10/subscriptions/1/fetch" \
 -u "username:app_password"```

### Generate Early Payment Link [](#generate-early-payment-link)
POST `/fluent-cart/v2/orders/{order}/subscriptions/{subscription}/early-payment-link`
Generate a URL that allows early payment of remaining installments on an installment-based subscription.

- **Permission:** `subscriptions/manage`
- **Policy:** `OrderPolicy`

#### Parameters [](#parameters-4)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order` | integer | path | Yes | The parent order ID | 
| `subscription` | integer | path | Yes | The subscription ID | 
#### Conditions [](#conditions)

This endpoint requires all of the following conditions to be met:

- Early payment feature must be enabled on the site
- The subscription must belong to the specified order (`parent_order_id` must match `order.id`)
- The subscription must have a finite number of installments (`bill_times > 0`)
- The subscription status must be `active` or `trialing`
- There must be remaining installments (`bill_times - bill_count > 0`)

#### Response [](#response-4)
json
```
{
 "message": "Early payment link generated.",
 "payment_url": "https://your-site.com/?fluent-cart=early-installment-payment&subscription_hash=abc123-def456"
}```

#### Error Responses [](#error-responses-1)

Feature not enabled:json
```
{
 "message": "Early payment is not enabled for this site."
}```

Invalid subscription for order:json
```
{
 "message": "Invalid subscription for the specified order."
}```

Not an installment subscription:json
```
{
 "message": "Early payment is only available for installment subscriptions."
}```

Subscription not active:json
```
{
 "message": "Subscription must be active to make early payments."
}```

All installments already paid:json
```
{
 "message": "All installments have already been paid."
}```

#### Example [](#example-4)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/orders/10/subscriptions/1/early-payment-link" \
 -u "username:app_password"```

### Reactivate Subscription [](#reactivate-subscription)
PUT `/fluent-cart/v2/orders/{order}/subscriptions/{subscription}/reactivate`
Reactivate a previously canceled or paused subscription.

- **Permission:** `subscriptions/manage`
- **Policy:** `OrderPolicy`

**Not Yet Available.** This endpoint is registered but currently returns a "Not available yet" error. It is reserved for future implementation.
#### Parameters [](#parameters-5)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order` | integer | path | Yes | The parent order ID | 
| `subscription` | integer | path | Yes | The subscription ID | 
#### Response [](#response-5)
json
```
{
 "message": "Not available yet"
}```

### Pause Subscription [](#pause-subscription)
PUT `/fluent-cart/v2/orders/{order}/subscriptions/{subscription}/pause`
Pause an active subscription.

- **Permission:** `subscriptions/manage`
- **Policy:** `OrderPolicy`

**Not Yet Available.** This endpoint is registered but currently returns a "Not available yet" error. It is reserved for future implementation.
#### Parameters [](#parameters-6)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order` | integer | path | Yes | The parent order ID | 
| `subscription` | integer | path | Yes | The subscription ID | 
#### Response [](#response-6)
json
```
{
 "message": "Not available yet"
}```

### Resume Subscription [](#resume-subscription)
PUT `/fluent-cart/v2/orders/{order}/subscriptions/{subscription}/resume`
Resume a paused subscription.

- **Permission:** `subscriptions/manage`
- **Policy:** `OrderPolicy`

**Not Yet Available.** This endpoint is registered but currently returns a "Not available yet" error. It is reserved for future implementation.
#### Parameters [](#parameters-7)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order` | integer | path | Yes | The parent order ID | 
| `subscription` | integer | path | Yes | The subscription ID | 
#### Response [](#response-7)
json
```
{
 "message": "Not available yet"
}```

## Customer Portal Endpoints [](#customer-portal-endpoints)

Customer portal endpoints are authenticated via the logged-in WordPress user. The system resolves the customer from the current user session. Authorization is handled by the `CustomerFrontendPolicy`.
All customer portal subscription endpoints use the subscription's **UUID** (not the numeric ID) for identification.
### List Customer Subscriptions [](#list-customer-subscriptions)
GET `/fluent-cart/v2/customer-profile/subscriptions`
Retrieve a paginated list of subscriptions belonging to the currently logged-in customer. Subscriptions with `pending` or `intended` status are excluded.

- **Policy:** `CustomerFrontendPolicy`
- **Auth:** Logged-in WordPress user

#### Parameters [](#parameters-8)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `page` | integer | query | No | Page number for pagination (default: 1) | 
| `per_page` | integer | query | No | Number of records per page (default: 10) | 
#### Response [](#response-8)

If the user is not logged in, the endpoint returns an empty result set rather than an error:json
```
{
 "message": "Success",
 "subscriptions": {
 "data": [],
 "total": 0,
 "per_page": 10,
 "current_page": 1,
 "last_page": 1
 }
}```

Successful response with data:json
```
{
 "message": "Success",
 "subscriptions": {
 "data": [
 {
 "uuid": "abc123-def456",
 "status": "active",
 "item_name": "Pro Plan",
 "billing_interval": "monthly",
 "recurring_amount": 2999,
 "next_billing_date": "2025-02-15 00:00:00",
 "bill_times": 0,
 "bill_count": 6,
 ...
 }
 ],
 "total": 5,
 "per_page": 10,
 "current_page": 1,
 "last_page": 1
 }
}```

#### Example [](#example-5)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customer-profile/subscriptions?page=1&per_page=10" \
 -H "X-WP-Nonce: <nonce>"```

### Get Customer Subscription Details [](#get-customer-subscription-details)
GET `/fluent-cart/v2/customer-profile/subscriptions/{subscription_uuid}`
Retrieve full details of a specific subscription for the currently logged-in customer, including transactions, upgrade eligibility, and payment method capabilities.

- **Policy:** `CustomerFrontendPolicy`
- **Auth:** Logged-in WordPress user

#### Parameters [](#parameters-9)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `subscription_uuid` | string | path | Yes | The subscription UUID (alphanumeric with dashes) | 
#### Response [](#response-9)
json
```
{
 "message": "Success",
 "subscription": {
 "uuid": "abc123-def456",
 "status": "active",
 "overridden_status": null,
 "vendor_subscription_id": "sub_1234567890",
 "next_billing_date": "2025-02-15 00:00:00",
 "billing_info": {
 "interval": "monthly",
 "interval_count": 1,
 "amount": 2999,
 "currency": "USD"
 },
 "current_payment_method": "stripe",
 "payment_method": "stripe",
 "payment_info": { ... },
 "bill_times": 0,
 "bill_count": 6,
 "variation_id": 7,
 "product_id": 3,
 "config": { ... },
 "reactivate_url": "https://your-site.com/?fluent-cart=reactivate&hash=abc123",
 "title": "Pro Plan",
 "subtitle": "Monthly",
 "can_upgrade": true,
 "can_switch_payment_method": true,
 "switchable_payment_methods": ["stripe", "paypal"],
 "can_update_payment_method": true,
 "order": {
 "uuid": "order-uuid-here"
 },
 "billing_addresses": [ ... ],
 "recurring_amount": 2999,
 "can_early_pay": false,
 "remaining_installments": 0,
 "transactions": [
 {
 "id": 1,
 "order_id": 10,
 "vendor_charge_id": "ch_abc123",
 "amount": 2999,
 "status": "completed",
 "created_at": "2025-01-15 10:30:00",
 "order": { ... }
 }
 ]
 }
}```

#### Response Fields [](#response-fields)

| Field | Type | Description | 
| --- | --- | --- |
| `uuid` | string | Unique subscription identifier | 
| `status` | string | Current status: `active`, `trialing`, `canceled`, `paused`, `failing`, `expiring`, `expired`, `completed`, `past_due` | 
| `overridden_status` | string/null | Overridden status if manually set | 
| `vendor_subscription_id` | string | Remote gateway subscription ID | 
| `next_billing_date` | string | Next billing date in GMT | 
| `billing_info` | object | Billing interval and amount details | 
| `current_payment_method` | string | Current payment method slug | 
| `payment_method` | string | Original payment method slug | 
| `payment_info` | object | Payment method details (card brand, last4, etc.) | 
| `bill_times` | integer | Total number of billing cycles (0 = unlimited) | 
| `bill_count` | integer | Number of completed billing cycles | 
| `variation_id` | integer | Product variation ID | 
| `product_id` | integer | Product ID | 
| `config` | object | Subscription configuration | 
| `reactivate_url` | string | URL for reactivating a canceled subscription | 
| `title` | string | Product title | 
| `subtitle` | string | Variation title (if applicable) | 
| `can_upgrade` | boolean | Whether the subscription is eligible for plan upgrade | 
| `can_switch_payment_method` | boolean | Whether the payment method can be switched to a different gateway | 
| `switchable_payment_methods` | array | List of available payment method slugs to switch to | 
| `can_update_payment_method` | boolean | Whether the payment method can be updated (e.g., new card) within the same gateway | 
| `order.uuid` | string | Parent order UUID | 
| `billing_addresses` | array | Billing addresses associated with the subscription | 
| `recurring_amount` | integer | Recurring payment amount in cents | 
| `can_early_pay` | boolean | Whether early installment payment is available | 
| `remaining_installments` | integer | Number of remaining installments (0 if unlimited) | 
| `transactions` | array | All transactions related to this subscription and its renewal orders | 
#### Example [](#example-6)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customer-profile/subscriptions/abc123-def456" \
 -H "X-WP-Nonce: <nonce>"```

### Get Setup Intent Remaining Attempts [](#get-setup-intent-remaining-attempts)
GET `/fluent-cart/v2/customer-profile/subscriptions/{subscription_uuid}/setup-intent-attempts`
Check how many Stripe SetupIntent attempts remain for the customer. This is used to enforce rate limiting on payment method update attempts.

- **Policy:** `CustomerFrontendPolicy`
- **Auth:** Logged-in WordPress user
- **Stripe Only:** Only works when `current_payment_method` is `stripe`

#### Parameters [](#parameters-10)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `subscription_uuid` | string | path | Yes | The subscription UUID (alphanumeric with dashes) | 
#### Conditions [](#conditions-1)

- Customer must own the subscription
- Subscription's `current_payment_method` must be `stripe`
- Subscription must have a `vendor_customer_id`

#### Response [](#response-10)
json
```
{
 "remaining": 5
}```

#### Error Responses [](#error-responses-2)

Payment method not supported (non-Stripe subscription):json
```
{
 "message": "Payment method not supported"
}```

#### Example [](#example-7)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customer-profile/subscriptions/abc123-def456/setup-intent-attempts" \
 -H "X-WP-Nonce: <nonce>"```

### Update Payment Method [](#update-payment-method)
POST `/fluent-cart/v2/customer-profile/subscriptions/{subscription_uuid}/update-payment-method`
Update the payment method (e.g., replace the card on file) for an existing subscription within the **same** payment gateway.

- **Policy:** `CustomerFrontendPolicy`
- **Auth:** Logged-in WordPress user

#### Parameters [](#parameters-11)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `subscription_uuid` | string | path | Yes | The subscription UUID (alphanumeric with dashes) | 
| `data` | object | body | Yes | Payment method data object | 
| `data.method` | string | body | Yes | Payment gateway slug (e.g., `stripe`, `paypal`) | 
Additional fields inside `data` depend on the specific payment gateway implementation (e.g., Stripe token, PayPal billing agreement ID).
#### Response [](#response-11)

The response depends on the gateway's `cardUpdate` implementation. On failure:json
```
{
 "message": "Could not update payment method"
}```

#### Example [](#example-8)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customer-profile/subscriptions/abc123-def456/update-payment-method" \
 -H "X-WP-Nonce: <nonce>" \
 -H "Content-Type: application/json" \
 -d '{
 "data": {
 "method": "stripe",
 "payment_method_id": "pm_1234567890"
 }
 }'```

### Get or Create Plan [](#get-or-create-plan)
POST `/fluent-cart/v2/customer-profile/subscriptions/{subscription_uuid}/get-or-create-plan`
Get or create a subscription plan on the remote payment gateway. This is typically used during the payment method switch flow to ensure the target gateway has a matching plan configured.

- **Policy:** `CustomerFrontendPolicy`
- **Auth:** Logged-in WordPress user

#### Parameters [](#parameters-12)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `subscription_uuid` | string | path | Yes | The subscription UUID (alphanumeric with dashes) | 
| `data` | object | body | Yes | Plan data object | 
| `data.method` | string | body | Yes | Target payment gateway slug (e.g., `stripe`, `paypal`) | 
| `data.reason` | string | body | No | Reason for creating the plan | 
#### Response [](#response-12)

The response depends on the gateway's `getOrCreateNewPlan` implementation. On failure:json
```
{
 "message": "Could not get or create plan"
}```

#### Example [](#example-9)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customer-profile/subscriptions/abc123-def456/get-or-create-plan" \
 -H "X-WP-Nonce: <nonce>" \
 -H "Content-Type: application/json" \
 -d '{
 "data": {
 "method": "stripe",
 "reason": "switching_payment_method"
 }
 }'```

### Switch Payment Method [](#switch-payment-method)
POST `/fluent-cart/v2/customer-profile/subscriptions/{subscription_uuid}/switch-payment-method`
Switch a subscription's payment method from one gateway to another (e.g., from Stripe to PayPal). This initiates the switch process, which may require a confirmation step depending on the target gateway.

- **Policy:** `CustomerFrontendPolicy`
- **Auth:** Logged-in WordPress user

#### Parameters [](#parameters-13)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `subscription_uuid` | string | path | Yes | The subscription UUID (alphanumeric with dashes) | 
| `data` | object | body | Yes | Payment method switch data | 
| `data.newPaymentMethod` | string | body | Yes | Target payment gateway slug (e.g., `paypal`) | 
| `data.currentPaymentMethod` | string | body | Yes | Current payment gateway slug (e.g., `stripe`) | 
Additional fields inside `data` depend on the specific payment gateway implementation.
#### Response [](#response-13)

The response depends on the gateway's `switchPaymentMethod` implementation. May return a redirect URL or client secret for the new gateway. On failure:json
```
{
 "message": "Could not switch payment method"
}```

#### Example [](#example-10)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customer-profile/subscriptions/abc123-def456/switch-payment-method" \
 -H "X-WP-Nonce: <nonce>" \
 -H "Content-Type: application/json" \
 -d '{
 "data": {
 "newPaymentMethod": "paypal",
 "currentPaymentMethod": "stripe"
 }
 }'```

### Confirm Subscription Switch [](#confirm-subscription-switch)
POST `/fluent-cart/v2/customer-profile/subscriptions/{subscription_uuid}/confirm-subscription-switch`
Confirm a two-step payment method switch. After the initial `switch-payment-method` call creates a new subscription on the target gateway, this endpoint finalizes the switch by confirming the new subscription and deactivating the old one.

- **Policy:** `CustomerFrontendPolicy`
- **Auth:** Logged-in WordPress user

#### Parameters [](#parameters-14)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `subscription_uuid` | string | path | Yes | The subscription UUID (alphanumeric with dashes) | 
| `data` | object | body | Yes | Confirmation data | 
| `data.newVendorSubscriptionId` | string | body | Yes | The new subscription ID from the target payment gateway | 
| `data.method` | string | body | Yes | The target payment gateway slug (e.g., `paypal`) | 
Additional fields inside `data` depend on the specific payment gateway implementation.
#### Response [](#response-14)

The response depends on the gateway's `confirmSubscriptionSwitch` implementation. On failure:json
```
{
 "message": "Could not confirm subscription switch"
}```

#### Example [](#example-11)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customer-profile/subscriptions/abc123-def456/confirm-subscription-switch" \
 -H "X-WP-Nonce: <nonce>" \
 -H "Content-Type: application/json" \
 -d '{
 "data": {
 "newVendorSubscriptionId": "I-ABC123DEF456",
 "method": "paypal"
 }
 }'```

### Cancel Auto-Renew [](#cancel-auto-renew)
POST `/fluent-cart/v2/customer-profile/subscriptions/{subscription_uuid}/cancel-auto-renew`
Cancel auto-renewal for a subscription from the customer portal. The subscription is cancelled both locally and with the remote payment gateway. The cancellation reason is automatically set to `cancelled_by_customer`.

- **Policy:** `CustomerFrontendPolicy`
- **Auth:** Logged-in WordPress user

#### Parameters [](#parameters-15)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `subscription_uuid` | string | path | Yes | The subscription UUID (alphanumeric with dashes) | 
No request body is required. The cancellation reason and note are set automatically.
#### Response [](#response-15)
json
```
{
 "message": "Your subscription has been successfully cancelled"
}```

#### Error Responses [](#error-responses-3)

Customer not found:json
```
{
 "message": "Customer not found"
}```

Subscription not found (or does not belong to the customer):json
```
{
 "message": "Subscription not found"
}```

#### Example [](#example-12)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customer-profile/subscriptions/abc123-def456/cancel-auto-renew" \
 -H "X-WP-Nonce: <nonce>"```

### Initiate Early Payment [](#initiate-early-payment)
POST `/fluent-cart/v2/customer-profile/subscriptions/{subscription_uuid}/initiate-early-payment`
Generate a checkout URL for paying remaining installments early on an installment-based subscription.

- **Policy:** `CustomerFrontendPolicy`
- **Auth:** Logged-in WordPress user

#### Parameters [](#parameters-16)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `subscription_uuid` | string | path | Yes | The subscription UUID (alphanumeric with dashes) | 
No request body is required.
#### Conditions [](#conditions-2)

The early payment feature must be enabled, and the subscription must meet the following criteria:

- Pro license must be active
- `bill_times > 0` (finite installments)
- `bill_count < bill_times` (remaining installments exist)
- Status must be `active` or `trialing`

#### Response [](#response-16)
json
```
{
 "message": "Early payment URL generated.",
 "checkout_url": "https://your-site.com/?fluent-cart=early-installment-payment&subscription_hash=abc123-def456"
}```

#### Error Responses [](#error-responses-4)

Early payment not available:json
```
{
 "message": "Early payment is not available for this subscription."
}```

Customer not found:json
```
{
 "message": "Customer not found"
}```

Subscription not found:json
```
{
 "message": "Subscription not found"
}```

#### Example [](#example-13)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customer-profile/subscriptions/abc123-def456/initiate-early-payment" \
 -H "X-WP-Nonce: <nonce>"```

## Subscription Statuses [](#subscription-statuses)

| Status | Constant | Description | 
| --- | --- | --- |
| `pending` | `SUBSCRIPTION_PENDING` | Subscription created but not yet activated | 
| `intended` | `SUBSCRIPTION_INTENDED` | Payment intent created, awaiting completion | 
| `trialing` | `SUBSCRIPTION_TRIALING` | In trial period | 
| `active` | `SUBSCRIPTION_ACTIVE` | Active and billing normally | 
| `paused` | `SUBSCRIPTION_PAUSED` | Temporarily paused | 
| `failing` | `SUBSCRIPTION_FAILING` | Payment attempts are failing | 
| `expiring` | `SUBSCRIPTION_EXPIRING` | Approaching expiration | 
| `expired` | `SUBSCRIPTION_EXPIRED` | Subscription has expired | 
| `canceled` | `SUBSCRIPTION_CANCELED` | Cancelled by admin or customer | 
| `past_due` | `SUBSCRIPTION_PAST_DUE` | Payment is overdue | 
| `completed` | `SUBSCRIPTION_COMPLETED` | All installments paid | 
| `authenticated` | `SUBSCRIPTION_AUTHENTICATED` | Authentication completed (SCA flow) | 
| `created` | `SUBSCRIPTION_CREATED` | Created on the remote gateway | 
## Hooks and Filters [](#hooks-and-filters)

| Hook | Type | Description | 
| --- | --- | --- |
| `fluent_cart/subscription/view` | filter | Modify subscription data before returning in admin detail view | 
| `fluent_cart/customer_portal/subscription_data` | filter | Modify subscription data before returning in customer portal detail view | 
| `fluent_cart/subscriptions_list_filter_query` | filter | Modify the subscription list query before execution | 
| `fluent_cart/subscriptions_filter/{provider}/{property}` | action | Custom advanced filter handler for subscription list |

---

## Tax

Source: https://dev.fluentcart.com/restapi/tax.html


Configure tax classes, manage country-specific tax rates, set up tax configuration, and handle EU VAT/OSS compliance.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2`
All monetary values are in **cents** (e.g., `$10.00` = `1000`).
## Tax Filing [](#tax-filing)

Manage order-level tax records for filing and reporting purposes.
**Prefix:** `/fluent-cart/v2/taxes`**Policy:** `AdminPolicy`
### List Tax Records [](#list-tax-records)
GET `/fluent-cart/v2/taxes`
Retrieve a paginated list of order tax rate records with optional filtering, sorting, and search. Records represent taxes applied to individual orders.
### Parameters [](#parameters)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `page` | integer | query | No | Page number for pagination | 
| `per_page` | integer | query | No | Number of records per page (default: 10, max: 200) | 
| `search` | string | query | No | Search term. If numeric, searches by `id` or `order_id`. Also searches related tax rate `country`, `state`, `postcode`, and `name` fields. Supports operator syntax (e.g., `id = 5`, `order_id > 100`) | 
| `sort_by` | string | query | No | Column to sort by (default: `id`). Must be a fillable column on the OrderTaxRate model | 
| `sort_type` | string | query | No | Sort direction: `asc` or `desc` (default: `desc`) | 
| `active_view` | string | query | No | Tab filter. One of: `filed` (records with `filed_at` set), `not_filed` (records without `filed_at`) | 
| `filter_type` | string | query | No | Filter mode: `simple` (default) or `advanced` | 
| `advanced_filters` | string (JSON) | query | No | JSON-encoded array of advanced filter groups. Supports filtering by country, region, tax name, and filed status | 
| `with` | array/string | query | No | Eager-load relations (e.g., `order`, `tax_rate`) | 
| `select` | array/string | query | No | Comma-separated list of columns to select | 
| `include_ids` | array/string | query | No | Comma-separated IDs that must always be included in results | 
| `user_tz` | string | query | No | User timezone for date filtering (e.g., `America/New_York`) | 
### Advanced Filter Options [](#advanced-filter-options)

| Category | Field | Column | Type | Description | 
| --- | --- | --- | --- | --- |
| Tax Property | Country | `country` | selections (relation: `tax_rate`) | Filter by tax rate country code | 
| Tax Property | Region | `state` | selections (relation: `tax_rate`) | Filter by tax rate state/region | 
| Tax Property | Tax Name | `name` | text (relation: `tax_rate`) | Filter by tax rate name | 
| Tax Property | Filed | `filed_at` | selections | `filed` or `not_filed` | 
### Response [](#response)
json
```
{
 "taxes": {
 "current_page": 1,
 "data": [
 {
 "id": 1,
 "order_id": 42,
 "tax_rate_id": 5,
 "shipping_tax": 150,
 "order_tax": 1000,
 "total_tax": 1150,
 "meta": {
 "rates": [],
 "tax_country": "US",
 "store_vat_number": ""
 },
 "filed_at": null,
 "created_at": "2025-06-01 12:00:00",
 "updated_at": "2025-06-01 12:00:00"
 }
 ],
 "per_page": 10,
 "total": 50,
 "last_page": 5
 }
}```

### Example [](#example)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/taxes?page=1&per_page=20&active_view=not_filed" \
 -u "username:app_password"```

### Mark Taxes as Filed [](#mark-taxes-as-filed)
POST `/fluent-cart/v2/taxes`
Mark one or more order tax records as filed by setting their `filed_at` timestamp. Only records that have not yet been filed will be updated.
### Parameters [](#parameters-1)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `ids` | array of integers | body | Yes | Array of `OrderTaxRate` record IDs to mark as filed | 
### Response [](#response-1)
json
```
{
 "message": "Taxes marked as filed successfully"
}```

### Error Response (400) [](#error-response-400)
json
```
{
 "message": "No IDs provided to mark!"
}```

### Example [](#example-1)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/taxes" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{"ids": [1, 2, 3, 5]}'```

## Tax Classes [](#tax-classes)

Manage tax classes that group tax rates by category (e.g., Standard, Reduced, Zero).
**Prefix:** `/fluent-cart/v2/tax/classes`**Policy:** `StoreSensitivePolicy`
### List Tax Classes [](#list-tax-classes)
GET `/fluent-cart/v2/tax/classes`
Retrieve all tax classes, sorted by priority (highest first), then by newest first when priority is equal.
### Parameters [](#parameters-2)

No query parameters required.
### Response [](#response-2)
json
```
{
 "tax_classes": [
 {
 "id": 1,
 "title": "Standard",
 "slug": "standard",
 "description": "Standard tax rate for most products",
 "meta": {
 "categories": [],
 "priority": 10
 },
 "categories": [],
 "created_at": "2025-01-01 00:00:00",
 "updated_at": "2025-01-01 00:00:00"
 },
 {
 "id": 2,
 "title": "Reduced",
 "slug": "reduced",
 "description": "Reduced tax rate for essential goods",
 "meta": {
 "categories": [],
 "priority": 5
 },
 "categories": [],
 "created_at": "2025-01-01 00:00:00",
 "updated_at": "2025-01-01 00:00:00"
 },
 {
 "id": 3,
 "title": "Zero",
 "slug": "zero",
 "description": "Zero tax rate for exempt products",
 "meta": {
 "categories": [],
 "priority": 2
 },
 "categories": [],
 "created_at": "2025-01-01 00:00:00",
 "updated_at": "2025-01-01 00:00:00"
 }
 ]
}```

### Example [](#example-2)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/tax/classes" \
 -u "username:app_password"```

### Create Tax Class [](#create-tax-class)
POST `/fluent-cart/v2/tax/classes`
Create a new tax class. A unique slug is auto-generated from the title.
### Parameters [](#parameters-3)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `title` | string | body | Yes | Tax class title (max 192 characters) | 
| `description` | string | body | No | Description of the tax class | 
| `categories` | array of integers | body | No | Array of product category IDs associated with this tax class | 
| `priority` | integer | body | No | Sort priority (higher values appear first, default: `0`) | 
### Validation Rules [](#validation-rules)

| Field | Rules | 
| --- | --- |
| `title` | Required, sanitized text, max 192 characters | 
| `description` | Nullable, sanitized text | 
| `categories` | Nullable, array of integers | 
### Response [](#response-3)
json
```
{
 "message": "Tax class has been created successfully"
}```

### Error Response (422) [](#error-response-422)
json
```
{
 "errors": {
 "title": ["Tax class title is required."]
 },
 "message": "Validation failed"
}```

### Example [](#example-3)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/tax/classes" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "title": "Digital Goods",
 "description": "Tax class for digital products",
 "categories": [12, 15],
 "priority": 7
 }'```

### Update Tax Class [](#update-tax-class)
PUT `/fluent-cart/v2/tax/classes/{id}`
Update an existing tax class. The slug is automatically regenerated if the title changes.
### Parameters [](#parameters-4)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | Tax class ID | 
| `title` | string | body | Yes | Tax class title (max 192 characters) | 
| `description` | string | body | No | Description of the tax class | 
| `categories` | array of integers | body | No | Array of product category IDs associated with this tax class | 
| `priority` | integer | body | No | Sort priority (higher values appear first, default: `0`) | 
### Validation Rules [](#validation-rules-1)

| Field | Rules | 
| --- | --- |
| `title` | Required, sanitized text, max 192 characters | 
| `description` | Nullable, sanitized text | 
| `categories` | Nullable, array of integers | 
### Response [](#response-4)
json
```
{
 "message": "Tax class has been updated successfully"
}```

### Example [](#example-4)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/tax/classes/4" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "title": "Digital Goods Updated",
 "description": "Updated description",
 "categories": [12, 15, 20],
 "priority": 8
 }'```

### Delete Tax Class [](#delete-tax-class)
DELETE `/fluent-cart/v2/tax/classes/{id}`
Delete a tax class by ID.
### Parameters [](#parameters-5)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | Tax class ID | 
### Response [](#response-5)
json
```
{
 "message": "Tax class has been deleted successfully"
}```

### Error Response [](#error-response)
json
```
{
 "message": "Failed to delete tax class"
}```

### Example [](#example-5)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/tax/classes/4" \
 -u "username:app_password"```

## Tax Rates [](#tax-rates)

Manage country-specific tax rates, shipping tax overrides, and country tax IDs.
**Prefix:** `/fluent-cart/v2/tax`**Policy:** `StoreSensitivePolicy`
### List All Tax Rates [](#list-all-tax-rates)
GET `/fluent-cart/v2/tax/rates`
Retrieve all tax rates from the database, grouped by continent/region and country.
### Parameters [](#parameters-6)

No query parameters required.
### Response [](#response-6)

Returns tax rates grouped by geographic region, with each group containing countries and their respective rates.json
```
{
 "tax_rates": [
 {
 "group_name": "European Union",
 "group_code": "EU",
 "countries": [
 {
 "country_code": "DE",
 "country_name": "Germany",
 "rates": [
 {
 "class_id": 1,
 "name": "DE Standard Tax",
 "rate": "19.0000",
 "for_shipping": null
 },
 {
 "class_id": 2,
 "name": "DE Reduced Tax",
 "rate": "7.0000",
 "for_shipping": null
 }
 ],
 "total_rates": 2
 }
 ],
 "total_countries": 1
 },
 {
 "group_name": "North America",
 "group_code": "NA",
 "countries": [
 {
 "country_code": "US",
 "country_name": "United States",
 "rates": [
 {
 "class_id": 1,
 "name": "US Standard Tax",
 "rate": "10.0000",
 "for_shipping": null
 }
 ],
 "total_rates": 1
 }
 ],
 "total_countries": 1
 }
 ]
}```

### Example [](#example-6)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/tax/rates" \
 -u "username:app_password"```

### Get Country Tax Rates [](#get-country-tax-rates)
GET `/fluent-cart/v2/tax/rates/country/rates/{country_code}`
Retrieve all tax rates for a specific country, including the associated tax class and country-level configuration settings.
### Parameters [](#parameters-7)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `country_code` | string | path | Yes | ISO 3166-1 alpha-2 country code (e.g., `US`, `DE`, `GB`) | 
### Response [](#response-7)
json
```
{
 "tax_rates": [
 {
 "id": 5,
 "class_id": 1,
 "country": "DE",
 "state": "",
 "postcode": "",
 "city": "",
 "rate": "19.0000",
 "name": "DE Standard Tax",
 "group": "EU",
 "priority": 1,
 "is_compound": 0,
 "for_shipping": null,
 "for_order": 0,
 "formatted_state": "",
 "tax_class": {
 "id": 1,
 "title": "Standard"
 }
 }
 ],
 "settings": {
 "compound_tax": true,
 "tax_id_label": "VAT",
 "states": {}
 }
}```

### Example [](#example-7)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/tax/rates/country/rates/DE" \
 -u "username:app_password"```

### Create Tax Rate [](#create-tax-rate)
POST `/fluent-cart/v2/tax/country/rate`
Create a new tax rate entry for a country.
### Parameters [](#parameters-8)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `class_id` | integer | body | Yes | ID of the tax class this rate belongs to | 
| `country` | string | body | No | ISO 3166-1 alpha-2 country code (max 45 characters) | 
| `state` | string | body | No | State/province code (max 45 characters) | 
| `postcode` | string | body | No | Postcode/ZIP code (max 45 characters) | 
| `city` | string | body | No | City name (max 45 characters) | 
| `rate` | string | body | No | Tax rate percentage (e.g., `"19.0000"`, max 45 characters) | 
| `name` | string | body | No | Display name for the tax rate (max 45 characters) | 
| `group` | string | body | No | Geographic group/continent code, e.g., `EU`, `NA` (max 45 characters) | 
| `priority` | integer | body | No | Priority for rate application order (min: 1) | 
| `is_compound` | integer | body | No | Whether this rate is compound (applied on top of other taxes). `0` or `1` (default: `0`) | 
| `for_shipping` | integer | body | No | Shipping tax override rate. `null` means no override | 
| `for_order` | integer | body | No | Whether this rate applies at order level. `0` or `1` (default: `0`) | 
### Validation Rules [](#validation-rules-2)

| Field | Rules | 
| --- | --- |
| `class_id` | Required, minimum 0 | 
| `country` | Nullable, sanitized text, max 45 characters | 
| `state` | Nullable, sanitized text, max 45 characters | 
| `postcode` | Nullable, sanitized text, max 45 characters | 
| `city` | Nullable, sanitized text, max 45 characters | 
| `rate` | Nullable, sanitized text, max 45 characters | 
| `name` | Nullable, sanitized text, max 45 characters | 
| `group` | Nullable, sanitized text, max 45 characters | 
| `priority` | Nullable, numeric, minimum 1 | 
| `is_compound` | Nullable, numeric, minimum 0 | 
| `for_shipping` | Nullable, numeric, minimum 0 | 
| `for_order` | Nullable, numeric, minimum 0 | 
### Response [](#response-8)
json
```
{
 "tax_rate": {
 "id": 10,
 "class_id": 1,
 "country": "FR",
 "state": "",
 "postcode": "",
 "city": "",
 "rate": "20.0000",
 "name": "FR Standard Tax",
 "group": "EU",
 "priority": 1,
 "is_compound": 0,
 "for_shipping": null,
 "for_order": 0,
 "formatted_state": "",
 "tax_class": {
 "id": 1,
 "title": "Standard"
 }
 },
 "message": "Tax rate has been created successfully"
}```

### Error Response [](#error-response-1)
json
```
{
 "message": "Tax class is required"
}```

### Example [](#example-8)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/tax/country/rate" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "class_id": 1,
 "country": "FR",
 "rate": "20.0000",
 "name": "FR Standard Tax",
 "group": "EU",
 "priority": 1
 }'```

### Update Tax Rate [](#update-tax-rate)
PUT `/fluent-cart/v2/tax/country/rate/{id}`
Update an existing tax rate.
### Parameters [](#parameters-9)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | Tax rate ID | 
| `class_id` | integer | body | Yes | ID of the tax class this rate belongs to | 
| `country` | string | body | No | ISO 3166-1 alpha-2 country code (max 45 characters) | 
| `state` | string | body | No | State/province code (max 45 characters) | 
| `postcode` | string | body | No | Postcode/ZIP code (max 45 characters) | 
| `city` | string | body | No | City name (max 45 characters) | 
| `rate` | string | body | No | Tax rate percentage (e.g., `"19.0000"`) | 
| `name` | string | body | No | Display name for the tax rate (max 45 characters) | 
| `group` | string | body | No | Geographic group/continent code (max 45 characters) | 
| `priority` | integer | body | No | Priority for rate application order (min: 1) | 
| `is_compound` | integer | body | No | Whether this rate is compound. `0` or `1` | 
| `for_shipping` | integer | body | No | Shipping tax override rate | 
| `for_order` | integer | body | No | Whether this rate applies at order level. `0` or `1` | 
### Response [](#response-9)
json
```
{
 "tax_rate": {
 "id": 10,
 "class_id": 1,
 "country": "FR",
 "state": "",
 "postcode": "",
 "city": "",
 "rate": "20.0000",
 "name": "FR Standard Tax",
 "group": "EU",
 "priority": 1,
 "is_compound": 0,
 "for_shipping": null,
 "for_order": 0,
 "formatted_state": "",
 "tax_class": {
 "id": 1,
 "title": "Standard"
 }
 },
 "message": "Tax rate has been updated successfully"
}```

### Example [](#example-9)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/tax/country/rate/10" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "class_id": 1,
 "rate": "21.0000",
 "name": "FR Standard Tax (Updated)"
 }'```

### Delete Tax Rate [](#delete-tax-rate)
DELETE `/fluent-cart/v2/tax/country/rate/{id}`
Delete a single tax rate by ID.
### Parameters [](#parameters-10)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | Tax rate ID | 
### Response [](#response-10)
json
```
{
 "message": "Tax rate has been deleted successfully"
}```

### Example [](#example-10)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/tax/country/rate/10" \
 -u "username:app_password"```

### Delete All Rates for a Country [](#delete-all-rates-for-a-country)
DELETE `/fluent-cart/v2/tax/country/{country_code}`
Delete all tax rates for a specific country.
### Parameters [](#parameters-11)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `country_code` | string | path | Yes | ISO 3166-1 alpha-2 country code (e.g., `US`, `DE`) | 
### Response [](#response-11)
json
```
{
 "message": "Country has been deleted successfully"
}```

### Error Response [](#error-response-2)
json
```
{
 "message": "Failed to delete country"
}```

### Example [](#example-11)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/tax/country/FR" \
 -u "username:app_password"```

### Save Shipping Tax Override [](#save-shipping-tax-override)
POST `/fluent-cart/v2/tax/rates/country/override`
Set a shipping-specific tax override on an existing tax rate. This allows a different tax rate to be applied for shipping calculations.
### Parameters [](#parameters-12)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | body | Yes | Tax rate ID to apply the shipping override to | 
| `override_tax_rate` | integer | body | Yes | The override tax rate value to use for shipping | 
### Response [](#response-12)
json
```
{
 "message": "Tax override has been saved successfully"
}```

### Error Response [](#error-response-3)
json
```
{
 "message": "Tax rate not found"
}```

### Example [](#example-12)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/tax/rates/country/override" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "id": 5,
 "override_tax_rate": 7
 }'```

### Delete Shipping Tax Override [](#delete-shipping-tax-override)
DELETE `/fluent-cart/v2/tax/rates/country/override/{id}`
Remove the shipping tax override from a tax rate, resetting `for_shipping` to `null`.
### Parameters [](#parameters-13)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | Tax rate ID to remove the shipping override from | 
### Response [](#response-13)
json
```
{
 "message": "Shipping override has been deleted successfully"
}```

### Example [](#example-13)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/tax/rates/country/override/5" \
 -u "username:app_password"```

### Get Country Tax ID [](#get-country-tax-id)
GET `/fluent-cart/v2/tax/country-tax-id/{country_code}`
Retrieve the store's tax identification number (VAT/GST/EIN) for a specific country. This is stored in the `fct_meta` table.
### Parameters [](#parameters-14)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `country_code` | string | path | Yes | ISO 3166-1 alpha-2 country code (e.g., `US`, `DE`) | 
### Response [](#response-14)

When a tax ID exists:json
```
{
 "tax_data": {
 "tax_id": "DE123456789"
 }
}```

When no tax ID is set:json
```
{
 "tax_data": {
 "tax_id": ""
 }
}```

### Example [](#example-14)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/tax/country-tax-id/DE" \
 -u "username:app_password"```

### Save Country Tax ID [](#save-country-tax-id)
POST `/fluent-cart/v2/tax/country-tax-id/{country_code}`
Save or update the store's tax identification number for a specific country. Creates a new meta entry if one does not exist, or updates the existing one.
### Parameters [](#parameters-15)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `country_code` | string | path | Yes | ISO 3166-1 alpha-2 country code (e.g., `US`, `DE`) | 
| `tax_id` | string | body | Yes | The tax identification number (e.g., VAT number, EIN, GST number) | 
### Response [](#response-15)
json
```
{
 "message": "Tax ID has been saved successfully"
}```

### Example [](#example-15)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/tax/country-tax-id/DE" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{"tax_id": "DE123456789"}'```

## Tax Configuration [](#tax-configuration)

Manage global tax settings including enabling/disabling tax, inclusion/exclusion behavior, calculation basis, and rounding.
**Prefix:** `/fluent-cart/v2/tax/configuration`**Policy:** `StoreSensitivePolicy`
### Get Preconfigured Tax Rates [](#get-preconfigured-tax-rates)
GET `/fluent-cart/v2/tax/configuration/rates`
Retrieve the full list of preconfigured tax rates from the built-in tax rates data file (`tax.php`). These are the default rates organized by continent/region and country that can be used when initially setting up tax for a country.
### Parameters [](#parameters-16)

No query parameters required.
### Response [](#response-16)

Returns tax rate data grouped by geographic region, including all rate types (standard, reduced, zero) for each country.json
```
{
 "tax_rates": {
 "EU": {
 "group_name": "European Union",
 "group_code": "EU",
 "countries": [
 {
 "country_code": "DE",
 "country_name": "Germany",
 "total_rates": 3,
 "rates": {
 "standard": {
 "rate": 19,
 "name": "DE Standard Tax",
 "type": "standard",
 "compound": false,
 "shipping": false
 },
 "reduced": {
 "rate": 7,
 "name": "DE Reduced Tax",
 "type": "reduced",
 "compound": false,
 "shipping": false
 },
 "zero": {
 "rate": 0,
 "name": "DE Zero Tax",
 "type": "zero",
 "compound": false,
 "shipping": false
 }
 }
 }
 ],
 "total_countries": 27
 },
 "NA": {
 "group_name": "North America",
 "group_code": "NA",
 "countries": [],
 "total_countries": 0
 }
 }
}```

### Example [](#example-16)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/tax/configuration/rates" \
 -u "username:app_password"```

### Save Configured Countries [](#save-configured-countries)
POST `/fluent-cart/v2/tax/configuration/countries`
Generate tax classes and import tax rates for the specified countries from the built-in rates data. This creates the standard tax class structure (Standard, Reduced, Zero) and populates rates for each selected country. Countries that already have rates in the database are skipped.
### Parameters [](#parameters-17)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `countries` | array of strings | body | Yes | Array of ISO 3166-1 alpha-2 country codes to configure (e.g., `["DE", "FR", "US"]`) | 
### Response [](#response-17)
json
```
{
 "message": "Countries saved successfully"
}```

### Example [](#example-17)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/tax/configuration/countries" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{"countries": ["DE", "FR", "IT", "ES"]}'```

### Get Tax Settings [](#get-tax-settings)
GET `/fluent-cart/v2/tax/configuration/settings`
Retrieve the current global tax configuration settings.
### Parameters [](#parameters-18)

No query parameters required.
### Response [](#response-18)
json
```
{
 "settings": {
 "tax_inclusion": "included",
 "tax_calculation_basis": "shipping",
 "tax_rounding": "item",
 "enable_tax": "yes",
 "price_suffix": "",
 "eu_vat_settings": {
 "require_vat_number": "no",
 "local_reverse_charge": "yes",
 "vat_reverse_excluded_categories": [],
 "method": "oss",
 "oss_country": "DE",
 "oss_vat": "DE123456789"
 }
 }
}```

### Settings Fields Reference [](#settings-fields-reference)

| Field | Type | Values | Description | 
| --- | --- | --- | --- |
| `enable_tax` | string | `"yes"`, `"no"` | Whether tax calculation is enabled | 
| `tax_inclusion` | string | `"included"`, `"excluded"` | Whether product prices include tax | 
| `tax_calculation_basis` | string | `"shipping"`, `"billing"`, `"store"` | Address used for tax calculation | 
| `tax_rounding` | string | `"item"`, `"subtotal"` | Whether rounding is applied per item or on the subtotal | 
| `price_suffix` | string | any | Text appended after product prices (e.g., "incl. VAT") | 
| `eu_vat_settings` | object | see below | EU VAT-specific configuration | 
### EU VAT Settings Object [](#eu-vat-settings-object)

| Field | Type | Description | 
| --- | --- | --- |
| `require_vat_number` | string | `"yes"` or `"no"` -- whether EU VAT number field is shown at checkout | 
| `local_reverse_charge` | string | `"yes"` or `"no"` -- whether reverse charge applies for domestic B2B | 
| `vat_reverse_excluded_categories` | array of integers | Product category IDs excluded from VAT reverse charge | 
| `method` | string | Cross-border method: `"oss"`, `"home"`, or `"specific"` | 
| `oss_country` | string | Country of OSS registration (when method is `"oss"`) | 
| `oss_vat` | string | OSS VAT number (when method is `"oss"`) | 
| `home_country` | string | Home country (when method is `"home"`) | 
| `home_vat` | string | Home VAT number (when method is `"home"`) | 
| `country_wise_vat` | array | Country-specific VAT settings (when method is `"specific"`) | 
### Example [](#example-18)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/tax/configuration/settings" \
 -u "username:app_password"```

### Save Tax Settings [](#save-tax-settings)
POST `/fluent-cart/v2/tax/configuration/settings`
Save the global tax configuration settings. If tax is enabled for the first time, initial tax classes (Standard, Reduced, Zero) are automatically created.
### Parameters [](#parameters-19)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `settings` | object | body | Yes | Tax settings object (see fields below) | 
| `settings.enable_tax` | string | body | No | `"yes"` or `"no"` to enable/disable tax | 
| `settings.tax_inclusion` | string | body | No | `"included"` or `"excluded"` -- whether prices include tax | 
| `settings.tax_calculation_basis` | string | body | No | `"shipping"`, `"billing"`, or `"store"` -- address basis for tax | 
| `settings.tax_rounding` | string | body | No | `"item"` or `"subtotal"` -- rounding method | 
| `settings.price_suffix` | string | body | No | Text appended after product prices | 
| `settings.eu_vat_settings` | object | body | No | EU VAT configuration object (see EU VAT Settings Object above) | 
### Response [](#response-19)
json
```
{
 "message": "Settings saved successfully"
}```

### Example [](#example-19)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/tax/configuration/settings" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "settings": {
 "enable_tax": "yes",
 "tax_inclusion": "excluded",
 "tax_calculation_basis": "billing",
 "tax_rounding": "subtotal",
 "price_suffix": "excl. VAT",
 "eu_vat_settings": {
 "require_vat_number": "yes",
 "local_reverse_charge": "yes",
 "vat_reverse_excluded_categories": [12, 15]
 }
 }
 }'```

## EU VAT [](#eu-vat)

Manage European Union VAT settings, OSS (One-Stop Shop) compliance, and cross-border tax configurations.
**Prefix:** `/fluent-cart/v2/tax/configuration/settings/eu-vat`**Policy:** `StoreSensitivePolicy`
### Save EU VAT Cross-Border Settings [](#save-eu-vat-cross-border-settings)
POST `/fluent-cart/v2/tax/configuration/settings/eu-vat`
Save EU VAT cross-border registration settings. This endpoint handles the configuration of how cross-border EU VAT is managed (OSS, home country, or specific country registrations).
### Parameters [](#parameters-20)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `action` | string | body | Yes | Must be `"euCrossBorderSettings"` | 
| `eu_vat_settings` | object | body | Yes | EU VAT configuration object | 
| `eu_vat_settings.method` | string | body | Yes | Cross-border method: `"oss"`, `"home"`, or `"specific"` | 
| `eu_vat_settings.oss_country` | string | body | Conditional | Country of OSS registration (required when method is `"oss"`) | 
| `eu_vat_settings.oss_vat` | string | body | No | OSS VAT number | 
| `eu_vat_settings.home_country` | string | body | Conditional | Home country code (required when method is `"home"`) | 
| `eu_vat_settings.home_vat` | string | body | No | Home VAT number | 
| `reset_registration` | string | body | No | Set to `"yes"` to clear the current method (reset registration) | 
### Validation [](#validation)

| Condition | Error | 
| --- | --- |
| `method` not one of `oss`, `home`, `specific` | `"Select a cross-border registration type"` | 
| `method` is `oss` and `oss_country` is empty | `"Select country of OSS registration"` | 
| `method` is `home` and `home_country` is empty | `"Select home country of registration"` | 
### Response [](#response-20)
json
```
{
 "message": "EU VAT settings saved successfully"
}```

### Error Response (423) [](#error-response-423)
json
```
{
 "message": "Validation failed for EU VAT settings",
 "errors": {
 "method": "Select a cross-border registration type"
 }
}```

### Error Response (423) - Invalid action [](#error-response-423-invalid-action)
json
```
{
 "message": "Invalid method"
}```

### Example [](#example-20)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/tax/configuration/settings/eu-vat" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "action": "euCrossBorderSettings",
 "eu_vat_settings": {
 "method": "oss",
 "oss_country": "DE",
 "oss_vat": "DE123456789"
 }
 }'```

### Get EU Tax Rates [](#get-eu-tax-rates)
GET `/fluent-cart/v2/tax/configuration/settings/eu-vat/rates`
Retrieve all tax rates in the EU group from the database, grouped by region and country. This returns only rates where `group` is `EU`.
### Parameters [](#parameters-21)

No query parameters required.
### Response [](#response-21)
json
```
{
 "tax_rates": [
 {
 "group_name": "European Union",
 "group_code": "EU",
 "countries": [
 {
 "country_code": "DE",
 "country_name": "Germany",
 "rates": [
 {
 "class_id": 1,
 "name": "standard",
 "rate": "19.0000",
 "for_shipping": null
 },
 {
 "class_id": 2,
 "name": "reduced",
 "rate": "7.0000",
 "for_shipping": null
 }
 ],
 "total_rates": 2
 },
 {
 "country_code": "FR",
 "country_name": "France",
 "rates": [
 {
 "class_id": 1,
 "name": "standard",
 "rate": "20.0000",
 "for_shipping": null
 }
 ],
 "total_rates": 1
 }
 ],
 "total_countries": 2
 }
 ]
}```

### Example [](#example-21)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/tax/configuration/settings/eu-vat/rates" \
 -u "username:app_password"```

### Save OSS Tax Override [](#save-oss-tax-override)
POST `/fluent-cart/v2/tax/configuration/settings/eu-vat/oss/override`
Save or update OSS (One-Stop Shop) tax rate overrides for a specific EU country. This allows overriding the standard, reduced, or zero tax rates for a country within the EU group. If a rate already exists for the country and tax class, it is updated; otherwise a new rate is created.
### Parameters [](#parameters-22)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `country_code` | string | body | Yes | ISO 3166-1 alpha-2 country code of the EU member state | 
| `overrides` | array | body | Yes | Array of override objects | 
| `overrides[].type` | string | body | Yes | Tax class slug: `"standard"`, `"reduced"`, or `"zero"` | 
| `overrides[].rate` | string/number | body | Yes | The overridden tax rate percentage | 
### Validation [](#validation-1)

| Condition | Error | 
| --- | --- |
| `country_code` is empty | `"Select country of OSS registration"` | 
### Response [](#response-22)
json
```
{
 "message": "OSS tax override saved successfully"
}```

### Error Response (423) [](#error-response-423-1)
json
```
{
 "message": "Validation failed for OSS tax override",
 "errors": {
 "country_code": "Select country of OSS registration"
 }
}```

### Example [](#example-22)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/tax/configuration/settings/eu-vat/oss/override" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "country_code": "FR",
 "overrides": [
 {"type": "standard", "rate": "20.0000"},
 {"type": "reduced", "rate": "5.5000"},
 {"type": "zero", "rate": "0.0000"}
 ]
 }'```

### Save OSS Shipping Tax Override [](#save-oss-shipping-tax-override)
POST `/fluent-cart/v2/tax/configuration/settings/eu-vat/oss/shipping-override`
Save or update OSS shipping tax rate overrides for a specific EU country. Similar to the tax override endpoint, but also supports the `for_shipping` field. If a rate already exists for the country and tax class, it is updated; otherwise a new rate is created.
### Parameters [](#parameters-23)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `country_code` | string | body | Yes | ISO 3166-1 alpha-2 country code of the EU member state | 
| `overrides` | array | body | Yes | Array of override objects | 
| `overrides[].type` | string | body | Yes | Tax class slug: `"standard"`, `"reduced"`, or `"zero"` | 
| `overrides[].rate` | string/number | body | Yes | The overridden tax rate percentage | 
| `overrides[].for_shipping` | integer | body | No | Shipping-specific tax rate override (default: `0`) | 
### Validation [](#validation-2)

| Condition | Error | 
| --- | --- |
| `country_code` is empty | `"Select country of OSS registration"` | 
### Response [](#response-23)
json
```
{
 "message": "OSS tax override saved successfully"
}```

### Error Response (423) [](#error-response-423-2)
json
```
{
 "message": "Validation failed for OSS tax override",
 "errors": {
 "country_code": "Select country of OSS registration"
 }
}```

### Example [](#example-23)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/tax/configuration/settings/eu-vat/oss/shipping-override" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "country_code": "IT",
 "overrides": [
 {"type": "standard", "rate": "22.0000", "for_shipping": 10},
 {"type": "reduced", "rate": "10.0000", "for_shipping": 5}
 ]
 }'```

### Delete OSS Tax Override [](#delete-oss-tax-override)
DELETE `/fluent-cart/v2/tax/configuration/settings/eu-vat/oss/override`
Delete all EU tax rate overrides for a specific country. Optionally filter by state/region within the country.
### Parameters [](#parameters-24)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `country` | string | query | Yes | ISO 3166-1 alpha-2 country code | 
| `state` | string | query | No | State/region code to narrow the deletion scope | 
### Validation [](#validation-3)

| Condition | Error | 
| --- | --- |
| `country` is empty | `"Country code is required"` (HTTP 423) | 
### Response [](#response-24)
json
```
{
 "message": "OSS tax override deleted successfully"
}```

### Error Response (423) [](#error-response-423-3)

When no matching records are found:json
```
{
 "message": "No matching OSS tax override found to delete"
}```

### Example [](#example-24)
bash
```
# Delete all EU tax overrides for France
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/tax/configuration/settings/eu-vat/oss/override?country=FR" \
 -u "username:app_password"

# Delete EU tax overrides for a specific French region
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/tax/configuration/settings/eu-vat/oss/override?country=FR&state=IDF" \
 -u "username:app_password"```

### Delete OSS Shipping Tax Override [](#delete-oss-shipping-tax-override)
DELETE `/fluent-cart/v2/tax/configuration/settings/eu-vat/oss/shipping-override`
Delete all EU shipping tax rate overrides for a specific country. Optionally filter by state/region within the country.
### Parameters [](#parameters-25)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `country` | string | query | Yes | ISO 3166-1 alpha-2 country code | 
| `state` | string | query | No | State/region code to narrow the deletion scope | 
### Validation [](#validation-4)

| Condition | Error | 
| --- | --- |
| `country` is empty | `"Country code is required"` (HTTP 423) | 
### Response [](#response-25)
json
```
{
 "message": "OSS shipping override deleted successfully"
}```

### Error Response (423) [](#error-response-423-4)

When no matching records are found:json
```
{
 "message": "No matching OSS shipping override found to delete"
}```

### Example [](#example-25)
bash
```
# Delete all EU shipping tax overrides for Italy
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/tax/configuration/settings/eu-vat/oss/shipping-override?country=IT" \
 -u "username:app_password"

# Delete EU shipping tax overrides for a specific Italian region
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/tax/configuration/settings/eu-vat/oss/shipping-override?country=IT&state=RM" \
 -u "username:app_password"```

---

## Shipping

Source: https://dev.fluentcart.com/restapi/shipping.html


Configure shipping zones, manage shipping methods within zones, and organize products with shipping classes.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2/shipping`
**Policy:** `StoreSensitivePolicy`
All monetary values are in **cents** (e.g., `$10.00` = `1000`).
## Shipping Zones [](#shipping-zones)

Shipping zones define geographic regions (countries) to which specific shipping methods apply. Each zone contains a country code (or `all` for worldwide) and can hold multiple shipping methods.
### List Shipping Zones [](#list-shipping-zones)
GET `/fluent-cart/v2/shipping/zones`
Retrieve a paginated list of shipping zones with filtering and sorting capabilities.

- **Permission:** `store/sensitive`

#### Parameters [](#parameters)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `search` | string | query | No | Search zones by name | 
| `per_page` | integer | query | No | Number of results per page (default: `10`, max: `200`) | 
| `page` | integer | query | No | Page number for pagination | 
| `sort_by` | string | query | No | Column to sort by (default: `order`) | 
| `sort_type` | string | query | No | Sort direction: `asc` or `desc` (default: `asc`) | 
| `filter_type` | string | query | No | `simple` or `advanced` | 
#### Response [](#response)
json
```
{
 "shipping_zones": {
 "total": 3,
 "per_page": 10,
 "current_page": 1,
 "last_page": 1,
 "data": [
 {
 "id": 1,
 "name": "Domestic",
 "region": "US",
 "order": 0,
 "formatted_region": "United States",
 "created_at": "2025-01-15 12:00:00",
 "updated_at": "2025-01-15 12:00:00"
 },
 {
 "id": 2,
 "name": "Rest of World",
 "region": "all",
 "order": 1,
 "formatted_region": "Whole World",
 "created_at": "2025-01-16 10:00:00",
 "updated_at": "2025-01-16 10:00:00"
 }
 ]
 }
}```

#### Example [](#example)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/shipping/zones?per_page=20&search=domestic" \
 -u "username:app_password"```

### Create Shipping Zone [](#create-shipping-zone)
POST `/fluent-cart/v2/shipping/zones`
Create a new shipping zone.

- **Permission:** `store/sensitive`
- **Request Class:** `ShippingZoneRequest`

#### Parameters [](#parameters-1)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `name` | string | body | Yes | Zone name (max 192 characters) | 
| `region` | string | body | No | ISO 3166-1 alpha-2 country code (e.g., `US`, `GB`) or `all` for worldwide. Only one `all` zone is allowed. | 
| `order` | integer | body | No | Sort order for display priority | 
#### Response [](#response-1)
json
```
{
 "shipping_zone": {
 "id": 3,
 "name": "Europe",
 "region": "DE",
 "order": 2,
 "formatted_region": "Germany",
 "created_at": "2025-02-01 08:00:00",
 "updated_at": "2025-02-01 08:00:00"
 },
 "message": "Shipping zone has been created successfully"
}```

#### Example [](#example-1)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/shipping/zones" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "name": "Europe",
 "region": "DE",
 "order": 2
 }'```

### Get Shipping Zone [](#get-shipping-zone)
GET `/fluent-cart/v2/shipping/zones/{id}`
Retrieve a single shipping zone by ID, including its associated shipping methods.

- **Permission:** `store/sensitive`

#### Parameters [](#parameters-2)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The shipping zone ID | 
#### Response [](#response-2)
json
```
{
 "shipping_zone": {
 "id": 1,
 "name": "Domestic",
 "region": "US",
 "order": 0,
 "formatted_region": "United States",
 "created_at": "2025-01-15 12:00:00",
 "updated_at": "2025-01-15 12:00:00",
 "methods": [
 {
 "id": 10,
 "zone_id": 1,
 "title": "Standard Shipping",
 "type": "flat_rate",
 "amount": 500,
 "is_enabled": true,
 "states": [],
 "settings": {},
 "meta": {},
 "order": 0,
 "formatted_states": [],
 "created_at": "2025-01-15 12:30:00",
 "updated_at": "2025-01-15 12:30:00"
 }
 ]
 }
}```

#### Example [](#example-2)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/shipping/zones/1" \
 -u "username:app_password"```

### Update Shipping Zone [](#update-shipping-zone)
PUT `/fluent-cart/v2/shipping/zones/{id}`
Update an existing shipping zone. If the `region` changes, all associated shipping method `states` are reset to empty.

- **Permission:** `store/sensitive`
- **Request Class:** `ShippingZoneRequest`

#### Parameters [](#parameters-3)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The shipping zone ID | 
| `name` | string | body | Yes | Zone name (max 192 characters) | 
| `region` | string | body | No | ISO 3166-1 alpha-2 country code or `all`. Only one `all` zone is allowed. | 
| `order` | integer | body | No | Sort order for display priority | 
Region Change Side Effect
When the `region` value changes, all shipping methods in the zone have their `states` arrays reset to `[]`. This is because states/provinces are country-specific.
#### Response [](#response-3)
json
```
{
 "shipping_zone": {
 "id": 1,
 "name": "United States",
 "region": "US",
 "order": 0,
 "formatted_region": "United States",
 "created_at": "2025-01-15 12:00:00",
 "updated_at": "2025-02-01 09:00:00"
 },
 "message": "Shipping zone has been updated successfully"
}```

#### Example [](#example-3)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/shipping/zones/1" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "name": "United States",
 "region": "US",
 "order": 0
 }'```

### Delete Shipping Zone [](#delete-shipping-zone)
DELETE `/fluent-cart/v2/shipping/zones/{id}`
Delete a shipping zone and all its associated shipping methods.

- **Permission:** `store/sensitive`

#### Parameters [](#parameters-4)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The shipping zone ID | 
Cascading Delete
Deleting a zone will also permanently delete all shipping methods associated with that zone.
#### Response [](#response-4)
json
```
{
 "message": "Shipping zone has been deleted successfully"
}```

#### Example [](#example-4)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/shipping/zones/1" \
 -u "username:app_password"```

### Update Zone Order [](#update-zone-order)
POST `/fluent-cart/v2/shipping/zones/update-order`
Reorder shipping zones by providing an array of zone IDs in the desired order. Each zone's `order` field is updated to match its index position.

- **Permission:** `store/sensitive`

#### Parameters [](#parameters-5)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `zones` | array | body | Yes | Array of zone IDs in the desired display order | 
#### Response [](#response-5)
json
```
{
 "message": "Shipping zones order has been updated"
}```

#### Error Response [](#error-response)
json
```
{
 "message": "Invalid data provided"
}```

#### Example [](#example-5)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/shipping/zones/update-order" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "zones": [3, 1, 2]
 }'```

In this example, zone `3` gets `order: 0`, zone `1` gets `order: 1`, and zone `2` gets `order: 2`.
### Get Zone States [](#get-zone-states)
GET `/fluent-cart/v2/shipping/zone/states`
Retrieve state/province options and address locale configuration for a given country. Useful for populating state selectors when configuring shipping methods within a zone.

- **Permission:** `store/sensitive`

#### Parameters [](#parameters-6)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `country_code` | string | query | No | ISO 3166-1 alpha-2 country code (e.g., `US`, `CA`, `GB`) | 
#### Response [](#response-6)
json
```
{
 "data": {
 "country_code": "US",
 "states": {
 "AL": "Alabama",
 "AK": "Alaska",
 "AZ": "Arizona",
 "CA": "California",
 "NY": "New York"
 },
 "address_locale": {
 "state": {
 "label": "State",
 "required": true
 },
 "postcode": {
 "label": "ZIP Code",
 "required": true
 }
 }
 }
}```

When no country code is provided or the country has no states:json
```
{
 "data": {
 "country_code": "",
 "states": [],
 "address_locale": []
 }
}```

#### Example [](#example-6)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/shipping/zone/states?country_code=US" \
 -u "username:app_password"```

## Shipping Methods [](#shipping-methods)

Shipping methods define how items are shipped within a zone. Each method belongs to a zone and can be scoped to specific states/provinces within that zone's country.
### Create Shipping Method [](#create-shipping-method)
POST `/fluent-cart/v2/shipping/methods`
Create a new shipping method within a shipping zone.

- **Permission:** `store/sensitive`
- **Request Class:** `ShippingMethodRequest`

#### Parameters [](#parameters-7)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `zone_id` | integer | body | Yes | ID of the parent shipping zone | 
| `title` | string | body | Yes | Method display title (max 192 characters) | 
| `type` | string | body | Yes | Shipping method type (max 192 characters), e.g., `flat_rate`, `free_shipping`, `local_pickup` | 
| `amount` | string | body | No | Shipping cost in cents (e.g., `500` for $5.00) | 
| `is_enabled` | integer | body | No | Enable/disable the method: `1` (enabled) or `0` (disabled). Default: `1` | 
| `states` | array | body | No | Array of state/province codes to restrict this method to (e.g., `["CA", "NY"]`). Empty array means all states. | 
| `settings` | object | body | No | Additional settings for the method | 
| `settings.configure_rate` | string | body | No | Rate configuration type | 
| `settings.class_aggregation` | string | body | No | How shipping classes are aggregated | 
| `meta` | object | body | No | Additional metadata key-value pairs (string values only) | 
#### Response [](#response-7)
json
```
{
 "message": "Shipping method has been created successfully"
}```

#### Example [](#example-7)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/shipping/methods" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "zone_id": 1,
 "title": "Standard Shipping",
 "type": "flat_rate",
 "amount": "500",
 "is_enabled": 1,
 "states": ["CA", "NY"],
 "settings": {
 "configure_rate": "per_order",
 "class_aggregation": "per_class"
 }
 }'```

### Update Shipping Method [](#update-shipping-method)
PUT `/fluent-cart/v2/shipping/methods`
Update an existing shipping method. The method ID is passed in the request body.

- **Permission:** `store/sensitive`
- **Request Class:** `ShippingMethodRequest`

#### Parameters [](#parameters-8)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `method_id` | integer | body | Yes | ID of the shipping method to update | 
| `zone_id` | integer | body | Yes | ID of the parent shipping zone | 
| `title` | string | body | Yes | Method display title (max 192 characters) | 
| `type` | string | body | Yes | Shipping method type (max 192 characters), e.g., `flat_rate`, `free_shipping`, `local_pickup` | 
| `amount` | string | body | No | Shipping cost in cents (e.g., `500` for $5.00) | 
| `is_enabled` | integer | body | No | Enable/disable the method: `1` (enabled) or `0` (disabled) | 
| `states` | array | body | No | Array of state/province codes to restrict this method to. Empty array means all states. | 
| `settings` | object | body | No | Additional settings for the method | 
| `settings.configure_rate` | string | body | No | Rate configuration type | 
| `settings.class_aggregation` | string | body | No | How shipping classes are aggregated | 
| `meta` | object | body | No | Additional metadata key-value pairs (string values only) | 
#### Response [](#response-8)
json
```
{
 "message": "Shipping method has been updated successfully"
}```

#### Example [](#example-8)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/shipping/methods" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "method_id": 10,
 "zone_id": 1,
 "title": "Express Shipping",
 "type": "flat_rate",
 "amount": "1200",
 "is_enabled": 1,
 "states": []
 }'```

### Delete Shipping Method [](#delete-shipping-method)
DELETE `/fluent-cart/v2/shipping/methods/{method_id}`
Delete a shipping method by ID.

- **Permission:** `store/sensitive`

#### Parameters [](#parameters-9)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `method_id` | integer | path | Yes | The shipping method ID | 
#### Response [](#response-9)
json
```
{
 "message": "Shipping method has been deleted successfully"
}```

#### Example [](#example-9)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/shipping/methods/10" \
 -u "username:app_password"```

## Shipping Classes [](#shipping-classes)

Shipping classes allow you to group products with similar shipping requirements. Each class defines a cost (fixed or percentage) that can be applied per order or per item.
### List Shipping Classes [](#list-shipping-classes)
GET `/fluent-cart/v2/shipping/classes`
Retrieve a paginated list of shipping classes with filtering and sorting capabilities.

- **Permission:** `store/sensitive`

#### Parameters [](#parameters-10)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `search` | string | query | No | Search classes by name | 
| `per_page` | integer | query | No | Number of results per page (default: `10`, max: `200`) | 
| `page` | integer | query | No | Page number for pagination | 
| `sort_by` | string | query | No | Column to sort by (default: `id`) | 
| `sort_type` | string | query | No | Sort direction: `asc` or `desc` (default: `desc`) | 
| `filter_type` | string | query | No | `simple` or `advanced` | 
#### Response [](#response-10)
json
```
{
 "shipping_classes": {
 "total": 3,
 "per_page": 10,
 "current_page": 1,
 "last_page": 1,
 "data": [
 {
 "id": 1,
 "name": "Heavy Items",
 "cost": 15.00,
 "type": "fixed",
 "per_item": 1,
 "created_at": "2025-01-20 09:00:00",
 "updated_at": "2025-01-20 09:00:00"
 },
 {
 "id": 2,
 "name": "Fragile Items",
 "cost": 10.00,
 "type": "percentage",
 "per_item": 0,
 "created_at": "2025-01-21 10:00:00",
 "updated_at": "2025-01-21 10:00:00"
 }
 ]
 }
}```

#### Example [](#example-10)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/shipping/classes?search=heavy&per_page=20" \
 -u "username:app_password"```

### Create Shipping Class [](#create-shipping-class)
POST `/fluent-cart/v2/shipping/classes`
Create a new shipping class.

- **Permission:** `store/sensitive`
- **Request Class:** `ShippingClassRequest`

#### Parameters [](#parameters-11)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `name` | string | body | Yes | Class name (max 192 characters) | 
| `cost` | numeric | body | Yes | Cost value (minimum: `0`). For `fixed` type, this is a flat amount. For `percentage` type, this is a percentage value. | 
| `type` | string | body | Yes | Cost type: `fixed` or `percentage` | 
| `per_item` | integer | body | No | Apply cost per item (`1`) or per order (`0`). Default: `0` | 
#### Response [](#response-11)
json
```
{
 "shipping_class": {
 "id": 3,
 "name": "Oversized Items",
 "cost": 25.00,
 "type": "fixed",
 "per_item": 1,
 "created_at": "2025-02-01 11:00:00",
 "updated_at": "2025-02-01 11:00:00"
 },
 "message": "Shipping class has been created successfully"
}```

#### Example [](#example-11)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/shipping/classes" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "name": "Oversized Items",
 "cost": 25.00,
 "type": "fixed",
 "per_item": 1
 }'```

### Get Shipping Class [](#get-shipping-class)
GET `/fluent-cart/v2/shipping/classes/{id}`
Retrieve a single shipping class by ID.

- **Permission:** `store/sensitive`

#### Parameters [](#parameters-12)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The shipping class ID | 
#### Response [](#response-12)
json
```
{
 "shipping_class": {
 "id": 1,
 "name": "Heavy Items",
 "cost": 15.00,
 "type": "fixed",
 "per_item": 1,
 "created_at": "2025-01-20 09:00:00",
 "updated_at": "2025-01-20 09:00:00"
 }
}```

#### Example [](#example-12)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/shipping/classes/1" \
 -u "username:app_password"```

### Update Shipping Class [](#update-shipping-class)
PUT `/fluent-cart/v2/shipping/classes/{id}`
Update an existing shipping class.

- **Permission:** `store/sensitive`
- **Request Class:** `ShippingClassRequest`

#### Parameters [](#parameters-13)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The shipping class ID | 
| `name` | string | body | Yes | Class name (max 192 characters) | 
| `cost` | numeric | body | Yes | Cost value (minimum: `0`) | 
| `type` | string | body | Yes | Cost type: `fixed` or `percentage` | 
| `per_item` | integer | body | No | Apply cost per item (`1`) or per order (`0`). Default: `0` | 
#### Response [](#response-13)
json
```
{
 "shipping_class": {
 "id": 1,
 "name": "Heavy Items",
 "cost": 20.00,
 "type": "fixed",
 "per_item": 1,
 "created_at": "2025-01-20 09:00:00",
 "updated_at": "2025-02-05 14:00:00"
 },
 "message": "Shipping class has been updated successfully"
}```

#### Example [](#example-13)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/shipping/classes/1" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "name": "Heavy Items",
 "cost": 20.00,
 "type": "fixed",
 "per_item": 1
 }'```

### Delete Shipping Class [](#delete-shipping-class)
DELETE `/fluent-cart/v2/shipping/classes/{id}`
Delete a shipping class by ID.

- **Permission:** `store/sensitive`

#### Parameters [](#parameters-14)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The shipping class ID | 
#### Response [](#response-14)
json
```
{
 "message": "Shipping class has been deleted successfully"
}```

#### Example [](#example-14)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/shipping/classes/1" \
 -u "username:app_password"```

## Data Models [](#data-models)

### Shipping Zone Object [](#shipping-zone-object)

| Field | Type | Description | 
| --- | --- | --- |
| `id` | integer | Unique zone identifier | 
| `name` | string | Zone display name | 
| `region` | string | ISO 3166-1 alpha-2 country code or `all` for worldwide | 
| `order` | integer | Sort order for display priority | 
| `formatted_region` | string | Human-readable region name (computed) | 
| `methods` | array | Associated shipping methods (included when using `show` endpoint) | 
| `created_at` | string | Creation timestamp (UTC) | 
| `updated_at` | string | Last update timestamp (UTC) | 
### Shipping Method Object [](#shipping-method-object)

| Field | Type | Description | 
| --- | --- | --- |
| `id` | integer | Unique method identifier | 
| `zone_id` | integer | Parent shipping zone ID | 
| `title` | string | Method display title | 
| `type` | string | Method type (e.g., `flat_rate`, `free_shipping`, `local_pickup`) | 
| `amount` | integer | Shipping cost in cents | 
| `is_enabled` | boolean | Whether the method is active | 
| `states` | array | State/province codes this method applies to (empty = all states) | 
| `settings` | object | Additional configuration settings | 
| `meta` | object | Additional metadata | 
| `order` | integer | Sort order within the zone | 
| `formatted_states` | array | Human-readable state names (computed) | 
| `created_at` | string | Creation timestamp (UTC) | 
| `updated_at` | string | Last update timestamp (UTC) | 
### Shipping Class Object [](#shipping-class-object)

| Field | Type | Description | 
| --- | --- | --- |
| `id` | integer | Unique class identifier | 
| `name` | string | Class display name | 
| `cost` | float | Cost value (flat amount or percentage, depending on `type`) | 
| `type` | string | Cost type: `fixed` or `percentage` | 
| `per_item` | integer | `1` = cost applied per item, `0` = cost applied per order | 
| `created_at` | string | Creation timestamp (UTC) | 
| `updated_at` | string | Last update timestamp (UTC) |

---

## Settings

Source: https://dev.fluentcart.com/restapi/settings.html


Configure your store settings, payment gateways, modules, file storage, checkout fields, and permissions.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2/settings`
**Policy:** `StoreSettingsPolicy` (most endpoints require `is_super_admin`)
## Payment Methods [](#payment-methods)

### Get Payment Method Settings [](#get-payment-method-settings)
GET `/fluent-cart/v2/settings/payment-methods`
Retrieve the configuration and settings for a specific payment method gateway (e.g., Stripe, PayPal).

- **Permission:** `is_super_admin`

#### Parameters [](#parameters)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `method` | string | query | Yes | The payment method key to retrieve settings for (e.g., `stripe`, `paypal`, `cod`). | 
#### Response [](#response)
json
```
{
 "settings": {
 "is_active": "yes",
 "payment_mode": "live",
 "checkout_label": "Pay with Stripe",
 "checkout_logo": "https://example.com/stripe-logo.png",
 "checkout_instructions": "",
 "thank_you_page_instructions": ""
 },
 "fields": { ... }
}```

#### Example [](#example)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/settings/payment-methods?method=stripe" \
 -u "username:app_password"```

### Save Payment Method Settings [](#save-payment-method-settings)
POST `/fluent-cart/v2/settings/payment-methods`
Create or update the configuration for a specific payment method gateway.

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-1)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `method` | string | body | Yes | The payment method key (e.g., `stripe`, `paypal`, `cod`). | 
| `settings` | object | body | Yes | Key-value object of gateway-specific settings to save. Fields vary by payment method. | 
#### Response [](#response-1)
json
```
{
 "settings": {
 "is_active": "yes",
 "payment_mode": "live",
 ...
 },
 "message": "Settings saved successfully"
}```

#### Example [](#example-1)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/settings/payment-methods" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "method": "cod",
 "settings": {
 "is_active": "yes",
 "checkout_label": "Cash on Delivery"
 }
 }'```

### List All Payment Methods [](#list-all-payment-methods)
GET `/fluent-cart/v2/settings/payment-methods/all`
Retrieve all registered payment method gateways categorized by availability status.

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-2)

None.
#### Response [](#response-2)
json
```
{
 "gateways": [
 {
 "method_key": "stripe",
 "title": "Stripe",
 "is_active": "yes",
 "description": "Accept payments via Stripe",
 "logo": "https://...",
 "upcoming": false
 },
 {
 "method_key": "paypal",
 "title": "PayPal",
 "is_active": "no",
 "requires_pro": true
 }
 ]
}```

Gateways are sorted in order: available gateways first, then those requiring Pro, then upcoming.
#### Example [](#example-2)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/settings/payment-methods/all" \
 -u "username:app_password"```

### Reorder Payment Methods [](#reorder-payment-methods)
POST `/fluent-cart/v2/settings/payment-methods/reorder`
Set the display order of payment methods on the checkout page.

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-3)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order` | array | body | Yes | Ordered array of payment method keys (e.g., `["stripe", "paypal", "cod"]`). | 
#### Response [](#response-3)
json
```
{
 "message": "Payment methods order saved successfully",
 "order": ["stripe", "paypal", "cod"]
}```

#### Example [](#example-3)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/settings/payment-methods/reorder" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "order": ["stripe", "paypal", "cod"]
 }'```

### Get Payment Method Connection Info [](#get-payment-method-connection-info)
GET `/fluent-cart/v2/settings/payment-methods/connect/info`
Retrieve connection information (OAuth URLs, account status) for a connectable payment gateway.

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-4)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `method` | string | query | Yes | The payment method key (e.g., `stripe`, `paypal`). | 
#### Response [](#response-4)

The response structure varies by gateway. For Stripe, it may include OAuth redirect URLs and connected account information. For PayPal, it includes test/live redirect URLs and account details.json
```
{
 "connect_config": {
 "test_redirect": "https://example.com/wp-admin/?fluent-cart=...",
 "live_redirect": "https://example.com/wp-admin/?fluent-cart=...",
 "disconnect_note": "Disconnecting will prevent..."
 },
 "test_account": { ... },
 "live_account": { ... },
 "settings": { ... }
}```

#### Example [](#example-4)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/settings/payment-methods/connect/info?method=paypal" \
 -u "username:app_password"```

### Disconnect Payment Method [](#disconnect-payment-method)
POST `/fluent-cart/v2/settings/payment-methods/disconnect`
Disconnect a payment gateway account (e.g., revoke Stripe or PayPal connection).

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-5)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `method` | string | body | Yes | The payment method key to disconnect (e.g., `stripe`, `paypal`). | 
| `mode` | string | body | Yes | The environment mode to disconnect: `test` or `live`. | 
#### Response [](#response-5)
json
```
{
 "message": "PayPal settings has been disconnected",
 "settings": { ... }
}```

#### Example [](#example-5)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/settings/payment-methods/disconnect" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "method": "paypal",
 "mode": "test"
 }'```

### Save Payment Method Design [](#save-payment-method-design)
POST `/fluent-cart/v2/settings/payment-methods/design`
Customize the checkout appearance for a specific payment method, including its label, logo, and instructions.

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-6)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `method` | string | body | Yes | The payment method key (e.g., `stripe`, `paypal`, `cod`). | 
| `checkout_label` | string | body | No | Custom label displayed on the checkout form for this method. | 
| `checkout_logo` | string | body | No | URL to a custom logo image for the checkout form. | 
| `checkout_instructions` | string | body | No | HTML instructions shown on the checkout page when this method is selected. | 
| `thank_you_page_instructions` | string | body | No | HTML instructions shown on the thank-you/receipt page. | 
#### Response [](#response-6)
json
```
{
 "message": "Checkout design settings saved",
 "settings": { ... }
}```

#### Example [](#example-6)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/settings/payment-methods/design" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "method": "stripe",
 "checkout_label": "Credit / Debit Card",
 "checkout_logo": "https://example.com/card-icon.png",
 "checkout_instructions": "<p>You will be charged securely via Stripe.</p>"
 }'```

### Install Payment Addon [](#install-payment-addon)
POST `/fluent-cart/v2/settings/payment-methods/install-addon`
Install a payment gateway addon plugin from a remote source (WordPress.org or GitHub).

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-7)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `plugin_slug` | string | body | Yes | The slug of the plugin to install (e.g., `fluent-cart-pro`). | 
| `source_type` | string | body | Yes | Source type: `wordpress` (WordPress.org) or `github`. | 
| `source_link` | string | body | Conditional | The URL to the plugin source. Required when `source_type` is `github`. | 
#### Response [](#response-7)
json
```
{
 "message": "Payment addon installed successfully!",
 "plugin_file": "fluent-cart-pro/fluent-cart-pro.php"
}```

#### Example [](#example-7)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/settings/payment-methods/install-addon" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "plugin_slug": "fluent-cart-pro",
 "source_type": "wordpress"
 }'```

### Activate Payment Addon [](#activate-payment-addon)
POST `/fluent-cart/v2/settings/payment-methods/activate-addon`
Activate an already-installed payment gateway addon plugin.

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-8)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `plugin_file` | string | body | Yes | The plugin file path (e.g., `fluent-cart-pro/fluent-cart-pro.php`). | 
#### Response [](#response-8)
json
```
{
 "message": "Payment addon activated successfully!"
}```

For FluentCart Pro specifically:json
```
{
 "message": "FluentCart Pro activated successfully! All premium features are now available."
}```

#### Example [](#example-8)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/settings/payment-methods/activate-addon" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "plugin_file": "fluent-cart-pro/fluent-cart-pro.php"
 }'```

## PayPal Configuration [](#paypal-configuration)

These endpoints are used during the PayPal gateway onboarding and webhook setup process.
**Policy:** `AdminPolicy` (requires `super_admin`)
### Exchange PayPal Seller Auth Token [](#exchange-paypal-seller-auth-token)
POST `/fluent-cart/v2/settings/payment-methods/paypal/seller-auth-token`
Exchange the PayPal authorization code for a seller access token during the PayPal Connect onboarding flow. This retrieves merchant credentials and saves them to the gateway settings.

- **Permission:** `super_admin`

#### Parameters [](#parameters-9)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `authCode` | string | body | Yes | The authorization code received from PayPal OAuth redirect. | 
| `sharedId` | string | body | Yes | The PayPal partner shared/client ID used during authentication. | 
| `mode` | string | body | Yes | Environment mode: `test` or `live`. | 
#### Response [](#response-9)

On success, credentials are saved to the PayPal gateway settings and webhooks are automatically registered. No explicit JSON response body is returned.
#### Example [](#example-9)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/settings/payment-methods/paypal/seller-auth-token" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "authCode": "C21AAF...",
 "sharedId": "AaBbCc...",
 "mode": "live"
 }'```

### Setup PayPal Webhook [](#setup-paypal-webhook)
POST `/fluent-cart/v2/settings/payment-methods/paypal/webhook/setup`
Register a webhook endpoint with PayPal to receive payment event notifications.

- **Permission:** `super_admin`

#### Parameters [](#parameters-10)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `mode` | string | body | Yes | Environment mode: `test` or `live`. | 
#### Response [](#response-10)
json
```
{
 "message": "Webhook setup successfully! Please reload the page."
}```

#### Example [](#example-10)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/settings/payment-methods/paypal/webhook/setup" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "mode": "live"
 }'```

### Check PayPal Webhook [](#check-paypal-webhook)
GET `/fluent-cart/v2/settings/payment-methods/paypal/webhook/check`
Verify the current PayPal webhook registration status and set up the webhook if it is missing.

- **Permission:** `super_admin`

#### Parameters [](#parameters-11)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `mode` | string | query | Yes | Environment mode: `test` or `live`. | 
#### Response [](#response-11)

Returns the webhook status and configuration details from PayPal.
#### Example [](#example-11)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/settings/payment-methods/paypal/webhook/check?mode=live" \
 -u "username:app_password"```

## Permissions [](#permissions)

### Get Permissions [](#get-permissions)
GET `/fluent-cart/v2/settings/permissions`
Retrieve the current role-to-capability permission mappings for FluentCart.

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-12)

None.
#### Response [](#response-12)
json
```
{
 "roles": {
 "administrator": {
 "name": "Administrator",
 "capabilities": {
 "orders/view": true,
 "orders/manage": true,
 "customers/view": true,
 "products/manage": true,
 ...
 }
 },
 "shop_manager": {
 "name": "Shop Manager",
 "capabilities": { ... }
 }
 }
}```

#### Example [](#example-12)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/settings/permissions" \
 -u "username:app_password"```

### Save Permissions [](#save-permissions)
POST `/fluent-cart/v2/settings/permissions`
Update the role-to-capability permission mappings for FluentCart.

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-13)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `capability` | object | body | Yes | An object mapping WordPress role slugs to their FluentCart capability assignments. | 
#### Response [](#response-13)
json
```
{
 "message": "Permissions saved successfully"
}```

#### Example [](#example-13)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/settings/permissions" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "capability": {
 "shop_manager": {
 "orders/view": true,
 "orders/manage": true,
 "customers/view": true,
 "products/manage": false
 }
 }
 }'```

## Store Settings [](#store-settings)

### Get Store Settings [](#get-store-settings)
GET `/fluent-cart/v2/settings/store`
Retrieve all store configuration settings along with the field schema for a given settings tab.

- **Permission:** `store/settings`

#### Parameters [](#parameters-14)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `settings_name` | string | query | No | The settings tab to return fields for (e.g., `store_setup`, `checkout`, `pages`). | 
#### Response [](#response-14)
json
```
{
 "settings": {
 "store_name": "My Store",
 "currency": "USD",
 "currency_position": "before",
 "decimal_separator": "dot",
 "checkout_button_text": "Checkout",
 "view_cart_button_text": "View Cart",
 "cart_button_text": "Add To Cart",
 "popup_button_text": "View Product",
 "out_of_stock_button_text": "Not Available",
 "checkout_method_style": "logo",
 "enable_modal_checkout": "no",
 "require_logged_in": "no",
 "show_cart_icon_in_nav": "no",
 "show_cart_icon_in_body": "yes",
 "additional_address_field": "yes",
 "hide_coupon_field": "no",
 "user_account_creation_mode": "all",
 "checkout_page_id": "",
 "cart_page_id": "",
 "receipt_page_id": "",
 "shop_page_id": "",
 "customer_profile_page_id": "",
 "store_address1": "",
 "store_address2": "",
 "store_city": "",
 "store_country": "",
 "store_postcode": "",
 "store_state": "",
 "order_mode": "test",
 "variation_view": "both",
 "variation_columns": "masonry",
 "min_receipt_number": "1",
 "inv_prefix": "INV-",
 "show_email_footer": "yes",
 ...
 },
 "fields": {
 "store_setup": { ... }
 }
}```

#### Example [](#example-14)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/settings/store?settings_name=store_setup" \
 -u "username:app_password"```

### Save Store Settings [](#save-store-settings)
POST `/fluent-cart/v2/settings/store`
Update store configuration settings. Submitted values are merged with existing settings.

- **Permission:** `store/settings`
- **Request Class:** `FluentMetaRequest` (validates and sanitizes input)

#### Parameters [](#parameters-15)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `settings_name` | string | body | Conditional | Settings tab identifier. Required for `store_setup` tab validation (enforces `store_name` and `store_country`). | 
| `store_name` | string | body | Conditional | Store name. Required when `settings_name` is `store_setup`. Max 200 characters. | 
| `store_logo` | object | body | No | Store logo with `id` (integer), `url` (string), and `title` (string). | 
| `currency` | string | body | No | Store currency code (e.g., `USD`, `EUR`, `GBP`). | 
| `currency_position` | string | body | No | Currency symbol position: `before` or `after`. | 
| `decimal_separator` | string | body | No | Decimal separator style: `dot` or `comma`. | 
| `checkout_button_text` | string | body | No | Custom text for the checkout button. | 
| `view_cart_button_text` | string | body | No | Custom text for the view cart button. | 
| `cart_button_text` | string | body | No | Custom text for the add-to-cart button. | 
| `popup_button_text` | string | body | No | Custom text for the product popup button. | 
| `out_of_stock_button_text` | string | body | No | Custom text for the out-of-stock button. | 
| `checkout_method_style` | string | body | No | Payment method display on checkout: `logo` or other styles. | 
| `enable_modal_checkout` | string | body | No | Enable modal/popup checkout: `yes` or `no`. | 
| `show_cart_icon_in_nav` | string | body | No | Show cart icon in navigation: `yes` or `no`. | 
| `show_cart_icon_in_body` | string | body | No | Show floating cart icon: `yes` or `no`. | 
| `additional_address_field` | string | body | No | Show additional address field: `yes` or `no`. | 
| `hide_coupon_field` | string | body | No | Hide coupon input on checkout: `yes` or `no`. | 
| `user_account_creation_mode` | string | body | No | Account creation mode: `all`, `optional`, or `disabled`. | 
| `force_ssl` | string | body | No | Force SSL on checkout: `yes` or `no`. | 
| `checkout_page_id` | integer | body | No | WordPress page ID for the checkout page. | 
| `cart_page_id` | integer | body | No | WordPress page ID for the cart page. | 
| `receipt_page_id` | integer | body | No | WordPress page ID for the order receipt page. | 
| `shop_page_id` | integer | body | No | WordPress page ID for the shop page. | 
| `customer_profile_page_id` | integer | body | No | WordPress page ID for the customer profile page. | 
| `customer_profile_page_slug` | string | body | No | Custom slug for the customer profile page. | 
| `registration_page_id` | integer | body | No | WordPress page ID for the registration page. | 
| `login_page_id` | integer | body | No | WordPress page ID for the login page. | 
| `store_address1` | string | body | No | Store address line 1. | 
| `store_address2` | string | body | No | Store address line 2. | 
| `store_city` | string | body | No | Store city. | 
| `store_country` | string | body | Conditional | Store country code. Required when `settings_name` is `store_setup`. Max 200 characters. | 
| `store_postcode` | string | body | No | Store postal/zip code. | 
| `store_state` | string | body | No | Store state/province code. | 
| `order_mode` | string | body | No | Order/payment mode: `test` or `live`. | 
| `variation_view` | string | body | No | Product variation display: `both`, `grid`, or `list`. | 
| `variation_columns` | string | body | No | Variation layout style: `masonry` or other layouts. | 
| `enable_early_payment_for_installment` | string | body | No | Allow early installment payments: `yes` or `no`. | 
| `product_slug` | string | body | No | Custom product URL slug. | 
| `min_receipt_number` | string | body | No | Minimum receipt/invoice number. | 
| `inv_prefix` | string | body | No | Invoice number prefix (e.g., `INV-`). | 
| `frontend_theme` | object | body | No | Theme color overrides. Object of key-value pairs where values are hex colors. | 
#### Response [](#response-15)
json
```
{
 "data": {
 "store_name": "My Store",
 "currency": "USD",
 ...
 }
}```

#### Example [](#example-15)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/settings/store" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "settings_name": "store_setup",
 "store_name": "My Awesome Store",
 "store_country": "US",
 "currency": "USD",
 "order_mode": "live"
 }'```

## Modules [](#modules)

### Get Plugin Addons [](#get-plugin-addons)
GET `/fluent-cart/v2/settings/modules/plugin-addons`
List all registered plugin addons (e.g., Elementor Blocks) with their installation and activation status.

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-16)

None.
#### Response [](#response-16)
json
```
{
 "addons": {
 "elementor-block": {
 "title": "Elementor Blocks",
 "description": "Enable to get Elementor Blocks for FluentCart. Minimum Requirement: Elementor V3.34",
 "logo": "https://...",
 "dark_logo": "https://...",
 "plugin_slug": "fluent-cart-elementor-blocks",
 "plugin_file": "fluent-cart-elementor-blocks/fluent-cart-elementor-blocks.php",
 "source_type": "cdn",
 "source_link": "https://addons-cdn.fluentcart.com/fluent-cart-elementor-blocks.zip",
 "upcoming": false,
 "repo_link": "https://fluentcart.com/fluentcart-addons",
 "is_installed": false,
 "is_active": false
 }
 }
}```

#### Example [](#example-16)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/settings/modules/plugin-addons" \
 -u "username:app_password"```

### Install Plugin Addon [](#install-plugin-addon)
POST `/fluent-cart/v2/settings/modules/plugin-addons/install`
Install a registered plugin addon from its configured source (WordPress.org, GitHub, or CDN).

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-17)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `plugin_slug` | string | body | Yes | The slug of the addon to install. Must match a registered addon slug. | 
| `source_type` | string | body | No | Source type: `wordpress`, `github`, or `cdn`. Defaults to the addon's registered source. | 
| `source_link` | string | body | No | URL to the addon source. Defaults to the addon's registered source link. | 
| `asset_path` | string | body | No | GitHub release asset path (defaults to `zipball_url`). | 
#### Response [](#response-17)
json
```
{
 "message": "Addon installed successfully",
 "plugin_file": "fluent-cart-elementor-blocks/fluent-cart-elementor-blocks.php"
}```

#### Example [](#example-17)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/settings/modules/plugin-addons/install" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "plugin_slug": "fluent-cart-elementor-blocks"
 }'```

### Activate Plugin Addon [](#activate-plugin-addon)
POST `/fluent-cart/v2/settings/modules/plugin-addons/activate`
Activate an already-installed plugin addon.

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-18)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `plugin_file` | string | body | Yes | The plugin file path to activate (e.g., `fluent-cart-elementor-blocks/fluent-cart-elementor-blocks.php`). | 
#### Response [](#response-18)
json
```
{
 "message": "Addon activated successfully."
}```

#### Example [](#example-18)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/settings/modules/plugin-addons/activate" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "plugin_file": "fluent-cart-elementor-blocks/fluent-cart-elementor-blocks.php"
 }'```

### Get Module Settings [](#get-module-settings)
GET `/fluent-cart/v2/settings/modules`
Retrieve all module (feature toggle) settings and their field definitions.

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-19)

None.
#### Response [](#response-19)
json
```
{
 "fields": {
 "modules_settings": {
 "title": "Features & addon",
 "type": "section",
 "class": "no-padding",
 "disable_nesting": true,
 "columns": {
 "default": 1,
 "md": 1
 },
 "schema": {
 "shipping": {
 "title": "Shipping",
 "type": "toggle",
 ...
 },
 "tax": {
 "title": "Tax",
 "type": "toggle",
 ...
 },
 "coupons": { ... },
 "subscriptions": { ... }
 }
 }
 },
 "settings": {
 "shipping": {
 "active": "yes"
 },
 "tax": {
 "active": "no"
 },
 ...
 }
}```

Module keys are dynamically registered via the `fluent_cart/module_setting/fields` filter.
#### Example [](#example-19)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/settings/modules" \
 -u "username:app_password"```

### Save Module Settings [](#save-module-settings)
POST `/fluent-cart/v2/settings/modules`
Enable or disable modules (features) and update their configuration. Fires `fluent_cart/module/activated/{key}` or `fluent_cart/module/deactivated/{key}` hooks when a module's active status changes.

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-20)

The request body should include module key-value pairs matching the registered module keys. Each module object typically contains:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `{module_key}` | object | body | Yes | Module configuration object. Keys vary per module. | 
| `{module_key}.active` | string | body | Yes | Whether the module is enabled: `yes` or `no`. | 
Only keys returned by `ModuleSettings::validKeys()` (derived from registered module fields) are accepted. Unrecognized keys are ignored.
#### Response [](#response-20)
json
```
{
 "message": "Settings saved successfully"
}```

#### Example [](#example-20)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/settings/modules" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "shipping": {
 "active": "yes"
 },
 "tax": {
 "active": "no"
 },
 "coupons": {
 "active": "yes"
 }
 }'```

## Confirmation Pages [](#confirmation-pages)

### Save Confirmation Settings [](#save-confirmation-settings)
POST `/fluent-cart/v2/settings/confirmation`
Update the order confirmation/receipt page settings, including the confirmation type, message content, and the receipt page assignment.

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-21)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `settings` | object | body | Yes | Confirmation settings object. | 
| `settings.confirmation_type` | string | body | No | Confirmation behavior: `same_page` (show confirmation on same page) or `custom_page` (redirect to a custom page). | 
| `settings.message_to_show` | string | body | No | HTML content to display as the order confirmation message. Sanitized with `wp_kses_post`. | 
| `settings.confirmation_page_id` | integer | body | No | WordPress page ID for a custom confirmation/receipt page. Also updates the store's `receipt_page_id`. | 
#### Response [](#response-21)
json
```
{
 "confirmation_type": "same_page",
 "message_to_show": "<p>Thank you for your order!</p>"
}```

#### Example [](#example-21)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/settings/confirmation" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "settings": {
 "confirmation_type": "custom_page",
 "confirmation_page_id": 42,
 "message_to_show": "<h2>Order Confirmed!</h2><p>Thank you for your purchase.</p>"
 }
 }'```

### Get Email Shortcodes [](#get-email-shortcodes)
GET `/fluent-cart/v2/settings/confirmation/shortcode`
Retrieve available shortcodes/merge tags that can be used in email notification templates and confirmation messages.

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-22)

None.
#### Response [](#response-22)
json
```
{
 "data": {
 "order": {
 "title": "Order",
 "shortcodes": {
 "{{order.id}}": "Order ID",
 "{{order.total}}": "Order Total",
 "{{order.status}}": "Order Status",
 ...
 }
 },
 "customer": {
 "title": "Customer",
 "shortcodes": {
 "{{customer.first_name}}": "First Name",
 "{{customer.email}}": "Email",
 ...
 }
 },
 "store": {
 "title": "Store",
 "shortcodes": {
 "{{store.name}}": "Store Name",
 ...
 }
 }
 }
}```

#### Example [](#example-22)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/settings/confirmation/shortcode" \
 -u "username:app_password"```

## Storage Drivers [](#storage-drivers)

Manage file storage drivers for digital product delivery (e.g., local filesystem, Amazon S3, Bunny CDN).
### List All Storage Drivers [](#list-all-storage-drivers)
GET `/fluent-cart/v2/settings/storage-drivers`
Retrieve all registered file storage drivers and their current status.

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-23)

None.
#### Response [](#response-23)
json
```
{
 "drivers": [
 {
 "key": "local",
 "title": "Local Storage",
 "description": "Store files on your server",
 "is_active": true,
 "logo": "https://..."
 },
 {
 "key": "s3",
 "title": "Amazon S3",
 "description": "Store files on Amazon S3",
 "is_active": false,
 "logo": "https://..."
 }
 ]
}```

#### Example [](#example-23)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/settings/storage-drivers" \
 -u "username:app_password"```

### Save Storage Driver Settings [](#save-storage-driver-settings)
POST `/fluent-cart/v2/settings/storage-drivers`
Create or update settings for a specific file storage driver.

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-24)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `driver` | string | body | Yes | The storage driver key (e.g., `local`, `s3`, `bunny`). | 
| `settings` | object | body | Yes | Driver-specific configuration settings. Fields vary by driver. | 
#### Response [](#response-24)
json
```
{
 "message": "Settings saved successfully",
 "data": { ... }
}```

#### Example [](#example-24)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/settings/storage-drivers" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "driver": "s3",
 "settings": {
 "access_key": "AKIA...",
 "secret_key": "wJalr...",
 "bucket": "my-store-files",
 "region": "us-east-1"
 }
 }'```

### Get Active Storage Drivers [](#get-active-storage-drivers)
GET `/fluent-cart/v2/settings/storage-drivers/active-drivers`
Retrieve only the currently active/enabled file storage drivers.

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-25)

None.
#### Response [](#response-25)
json
```
{
 "drivers": [
 {
 "key": "local",
 "title": "Local Storage",
 "is_active": true,
 ...
 }
 ]
}```

#### Example [](#example-25)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/settings/storage-drivers/active-drivers" \
 -u "username:app_password"```

### Get Storage Driver Settings [](#get-storage-driver-settings)
GET `/fluent-cart/v2/settings/storage-drivers/{driver}`
Retrieve the configuration settings and field schema for a specific storage driver.

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-26)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `driver` | string | path | Yes | The storage driver key (e.g., `local`, `s3`, `bunny`). | 
#### Response [](#response-26)
json
```
{
 "settings": {
 "access_key": "AKIA...",
 "secret_key": "****",
 "bucket": "my-store-files",
 "region": "us-east-1"
 },
 "fields": { ... }
}```

#### Example [](#example-26)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/settings/storage-drivers/s3" \
 -u "username:app_password"```

### Verify Storage Driver Connection [](#verify-storage-driver-connection)
POST `/fluent-cart/v2/settings/storage-drivers/verify-info`
Test the connection to a storage driver using the provided credentials without saving them.

- **Permission:** `is_super_admin`

#### Parameters [](#parameters-27)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `driver` | string | body | Yes | The storage driver key (e.g., `s3`, `bunny`). | 
| `settings` | object | body | Yes | Driver-specific credentials and configuration to verify. Fields vary by driver. | 
#### Response [](#response-27)
json
```
{
 "message": "Connection verified successfully"
}```

#### Example [](#example-27)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/settings/storage-drivers/verify-info" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "driver": "s3",
 "settings": {
 "access_key": "AKIA...",
 "secret_key": "wJalr...",
 "bucket": "my-store-files",
 "region": "us-east-1"
 }
 }'```

## Checkout Fields [](#checkout-fields)

Manage which fields are displayed on the checkout form and their required/optional status.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2/checkout-fields`
**Policy:** `StoreSensitivePolicy` (requires `store/sensitive` capability)
### Get Checkout Fields [](#get-checkout-fields)
GET `/fluent-cart/v2/checkout-fields/get-fields`
Retrieve the checkout field configuration including the schema definition and current settings.

- **Permission:** `store/sensitive`

#### Parameters [](#parameters-28)

None.
#### Response [](#response-28)
json
```
{
 "fields": {
 "basic_info": {
 "full_name": {
 "label": "Full Name",
 "type": "text",
 "configurable": true
 },
 "first_name": {
 "label": "First Name",
 "type": "text",
 "configurable": true
 },
 "last_name": {
 "label": "Last Name",
 "type": "text",
 "configurable": true
 },
 "email": {
 "label": "Email",
 "type": "email",
 "configurable": false
 }
 },
 "billing_address": { ... },
 "shipping_address": { ... }
 },
 "settings": {
 "basic_info": {
 "full_name": {
 "enabled": "yes",
 "required": "yes"
 },
 "first_name": {
 "enabled": "no",
 "required": "no"
 },
 "last_name": {
 "enabled": "no",
 "required": "no"
 }
 },
 "billing_address": { ... },
 "shipping_address": { ... }
 }
}```

#### Example [](#example-28)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/checkout-fields/get-fields" \
 -u "username:app_password"```

### Save Checkout Fields [](#save-checkout-fields)
POST `/fluent-cart/v2/checkout-fields/save-fields`
Update the checkout field visibility and required settings. The endpoint enforces name field logic automatically:

- 
If `first_name` or `last_name` is enabled, `full_name` is automatically disabled.
- 
If neither `first_name` nor `last_name` is enabled, `full_name` is automatically enabled and marked as required.
- 
If `first_name` is enabled, it is forced to be required. Same for `last_name`.
- 
**Permission:** `store/sensitive`

#### Parameters [](#parameters-29)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `settings` | object | body | Yes | Checkout field settings object. Only keys matching existing settings are accepted. | 
| `settings.basic_info` | object | body | No | Basic information field settings. | 
| `settings.basic_info.{field}.enabled` | string | body | No | Whether the field is shown: `yes` or `no`. | 
| `settings.basic_info.{field}.required` | string | body | No | Whether the field is required: `yes` or `no`. | 
| `settings.billing_address` | object | body | No | Billing address field settings (same structure as `basic_info`). | 
| `settings.shipping_address` | object | body | No | Shipping address field settings (same structure as `basic_info`). | 
#### Response [](#response-29)
json
```
{
 "message": "Checkout fields has been updated successfully."
}```

#### Example [](#example-29)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/checkout-fields/save-fields" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "settings": {
 "basic_info": {
 "full_name": {
 "enabled": "no",
 "required": "no"
 },
 "first_name": {
 "enabled": "yes",
 "required": "yes"
 },
 "last_name": {
 "enabled": "yes",
 "required": "no"
 }
 }
 }
 }'```

---

## Email Notifications

Source: https://dev.fluentcart.com/restapi/email-notifications.html


Configure email notification templates, manage scheduling reminders, preview templates, and update notification settings.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2/email-notification`
**Policy:** `StoreSensitivePolicy` — Requires `store/sensitive` capability.
## List All Notifications [](#list-all-notifications)
GET `/fluent-cart/v2/email-notification`
Retrieve all registered email notification templates with their current configuration. Returns both default and customized notification settings for orders, subscriptions, and scheduler/reminder actions.
### Parameters [](#parameters)

No parameters required.
### Response [](#response)
json
```
{
 "data": {
 "order_paid_admin": {
 "event": "order_paid_done",
 "group": "order",
 "group_label": "Order Actions",
 "title": "Send mail to admin after New Order Paid",
 "description": "This email will be sent to the admin after an order is placed.",
 "recipient": "admin",
 "smartcode_groups": [],
 "template_path": "order.paid.admin",
 "is_async": false,
 "pre_header": "You got a new order on your shop...",
 "name": "order_paid_admin",
 "settings": {
 "active": "yes",
 "subject": "New Sales On {{settings.store_name}}",
 "is_default_body": "yes",
 "email_body": ""
 }
 },
 "order_paid_customer": {
 "event": "order_paid",
 "group": "order",
 "group_label": "Order Actions",
 "title": "Purchase receipt to customer",
 "description": "This email will be sent to the customer after an order is placed.",
 "recipient": "customer",
 "smartcode_groups": [],
 "template_path": "order.paid.customer",
 "is_async": false,
 "name": "order_paid_customer",
 "settings": {
 "active": "yes",
 "subject": "Purchase Receipt #{{order.invoice_no}}",
 "is_default_body": "yes",
 "email_body": ""
 }
 }
 }
}```

### Available Notifications [](#available-notifications)

The following notification keys are returned, organized by group:
**Order Actions (`order` group)**

| Key | Event | Recipient | Description | 
| --- | --- | --- | --- |
| `order_paid_admin` | `order_paid_done` | `admin` | New order paid notification to admin | 
| `order_paid_customer` | `order_paid` | `customer` | Purchase receipt to customer | 
| `order_refunded_admin` | `order_refunded` | `admin` | Refund notification to admin | 
| `order_refunded_customer` | `order_refunded` | `customer` | Refund confirmation to customer | 
| `order_shipped_customer` | `shipping_status_changed_to_shipped` | `customer` | Shipping notification to customer | 
| `order_delivered_customer` | `shipping_status_changed_to_delivered` | `customer` | Delivery notification to customer | 
| `order_placed_admin` | `order_placed_offline` | `admin` | Offline payment order to admin | 
| `order_placed_customer` | `order_placed_offline` | `customer` | Offline payment confirmation to customer | 
**Subscription Actions (`subscription` group)**

| Key | Event | Recipient | Description | 
| --- | --- | --- | --- |
| `subscription_renewal_customer` | `subscription_renewed` | `customer` | Renewal confirmation to customer | 
| `subscription_renewal_admin` | `subscription_renewed` | `admin` | Renewal notification to admin | 
| `subscription_canceled_customer` | `subscription_canceled` | `customer` | Cancellation notice to customer | 
| `subscription_canceled_admin` | `subscription_canceled` | `admin` | Cancellation notice to admin | 
**Scheduler / Reminder Actions (`scheduler` group)**

| Key | Event | Recipient | Description | 
| --- | --- | --- | --- |
| `invoice_reminder_overdue_customer` | `invoice_reminder_overdue` | `customer` | Payment reminder to customer | 
| `invoice_reminder_overdue_admin` | `invoice_reminder_overdue` | `admin` | Payment reminder copy to admin | 
| `subscription_renewal_reminder_customer` | `subscription_renewal_reminder` | `customer` | Upcoming renewal reminder to customer | 
| `subscription_renewal_reminder_admin` | `subscription_renewal_reminder` | `admin` | Upcoming renewal reminder copy to admin | 
| `subscription_trial_end_reminder_customer` | `subscription_trial_end_reminder` | `customer` | Trial ending soon reminder to customer | 
| `subscription_trial_end_reminder_admin` | `subscription_trial_end_reminder` | `admin` | Trial ending soon reminder copy to admin | 
### Example [](#example)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/email-notification" \
 -u "username:app_password"```

## Get Single Notification [](#get-single-notification)
GET `/fluent-cart/v2/email-notification/{notification}`
Retrieve a single email notification template by its name, along with available shortcodes for the email editor.
### Parameters [](#parameters-1)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `notification` | string | path | Yes | The notification key (e.g., `order_paid_customer`, `subscription_renewal_admin`) | 
### Response [](#response-1)
json
```
{
 "data": {
 "event": "order_paid",
 "group": "order",
 "group_label": "Order Actions",
 "title": "Purchase receipt to customer",
 "description": "This email will be sent to the customer after an order is placed.",
 "recipient": "customer",
 "smartcode_groups": [],
 "template_path": "order.paid.customer",
 "is_async": false,
 "name": "order_paid_customer",
 "settings": {
 "active": "yes",
 "subject": "Purchase Receipt #{{order.invoice_no}}",
 "is_default_body": "yes",
 "email_body": ""
 }
 },
 "shortcodes": {
 "order": {
 "title": "Order",
 "key": "order",
 "shortcodes": {
 "{{order.id}}": "Order ID",
 "{{order.invoice_no}}": "Order Number",
 "{{order.status}}": "Order Status",
 "{{order.total_amount_formatted}}": "Order Total Amount (Formatted)"
 }
 },
 "general": {
 "title": "General",
 "key": "wp",
 "shortcodes": {
 "{{wp.admin_email}}": "Admin Email",
 "{{wp.site_url}}": "Site URL",
 "{{wp.site_title}}": "Site Title"
 }
 },
 "customer": {
 "title": "Customer",
 "key": "customer",
 "shortcodes": {
 "{{order.billing.first_name}}": "First Name",
 "{{order.billing.last_name}}": "Last Name",
 "{{order.billing.email}}": "Email"
 }
 },
 "transaction": {
 "title": "transaction",
 "key": "settings",
 "shortcodes": {
 "{{transaction.total_formatted}}": "Total Amount (Formatted)",
 "{{transaction.payment_method}}": "Payment Method",
 "{{transaction.status}}": "Status"
 }
 },
 "settings": {
 "title": "Settings",
 "key": "settings",
 "shortcodes": {
 "{{settings.store_name}}": "Store Name",
 "{{settings.store_logo}}": "Store Logo"
 }
 },
 "license": {
 "title": "License (Loop)",
 "key": "license",
 "shortcodes": {
 "{{license.key}}": "License Key",
 "{{license.status}}": "Status"
 }
 }
 }
}```

### Error Response [](#error-response)

Returned when the notification key is not found:json
```
{
 "message": "Notification Details not found"
}```

### Example [](#example-1)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/email-notification/order_paid_customer" \
 -u "username:app_password"```

## Update Notification [](#update-notification)
PUT `/fluent-cart/v2/email-notification/{notification}`
Update an email notification template's settings including subject, body content, and active status.
### Parameters [](#parameters-2)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `notification` | string | path | Yes | The notification key (e.g., `order_paid_customer`) | 
| `settings.subject` | string | body | Yes | Email subject line (max 255 characters). Supports shortcodes like `{{order.invoice_no}}` | 
| `settings.email_body` | string | body | No | Custom email body content (HTML). Sanitized with `wp_kses_post` | 
| `settings.active` | string | body | No | Enable or disable the notification: `yes` or `no` | 
| `settings.is_default_body` | string | body | No | Whether to use the default template body: `yes` or `no`. When set to `yes`, the custom `email_body` is cleared | 
### Validation Rules [](#validation-rules)

| Field | Rules | 
| --- | --- |
| `settings.subject` | Required, sanitized text, max 255 characters | 
| `settings.email_body` | Nullable, string, sanitized with `wp_kses_post` | 
| `settings.active` | Nullable, sanitized text | 
| `settings.is_default_body` | Nullable, sanitized text | 
### Response [](#response-2)
json
```
{
 "message": "Notification updated successfully"
}```

### Error Response [](#error-response-1)
json
```
{
 "message": "Failed to update notification"
}```

### Example [](#example-2)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/email-notification/order_paid_customer" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "settings": {
 "subject": "Your Order #{{order.invoice_no}} is Confirmed!",
 "email_body": "<p>Thank you for your purchase, {{order.billing.first_name}}!</p>",
 "active": "yes",
 "is_default_body": "no"
 }
 }'```

## Enable/Disable Notification [](#enable-disable-notification)
POST `/fluent-cart/v2/email-notification/enable-notification/{name}`
Toggle a notification template on or off without modifying other settings.
### Parameters [](#parameters-3)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `name` | string | path | Yes | The notification key (e.g., `order_paid_admin`) | 
| `active` | string | body | Yes | Set to `yes` to enable or `no` to disable the notification | 
### Response [](#response-3)
json
```
{
 "message": "Notification updated successfully"
}```

### Error Response [](#error-response-2)
json
```
{
 "message": "Failed to update notification"
}```

### Example [](#example-3)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/email-notification/enable-notification/order_refunded_admin" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "active": "yes"
 }'```

## Get Shortcodes [](#get-shortcodes)
GET `/fluent-cart/v2/email-notification/get-short-codes`
Retrieve available shortcodes, email template files, and editor buttons for the email notification editor.
### Parameters [](#parameters-4)

No parameters required.
### Response [](#response-4)
json
```
{
 "data": {
 "email_templates": [
 {
 "path": "fluent_cart_order_paid",
 "label": "Order Paid"
 },
 {
 "path": "fluent_cart_subscription_renewal",
 "label": "Subscription Renewal"
 }
 ],
 "shortcodes": {
 "order": {
 "title": "Order",
 "key": "order",
 "shortcodes": {
 "{{order.id}}": "Order ID",
 "{{order.customer_dashboard_link}}": "Customer Dashboard Link",
 "{{order.status}}": "Order Status",
 "{{order.invoice_no}}": "Order Number",
 "{{order.total_amount_formatted}}": "Order Total Amount (Formatted)",
 "{{order.created_at}}": "Order Create Date"
 }
 },
 "general": {
 "title": "General",
 "key": "wp",
 "shortcodes": {
 "{{wp.admin_email}}": "Admin Email",
 "{{wp.site_url}}": "Site URL",
 "{{wp.site_title}}": "Site Title",
 "{{user.display_name}}": "User Display Name",
 "{{user.user_email}}": "User Email"
 }
 },
 "customer": {
 "title": "Customer",
 "key": "customer",
 "shortcodes": {
 "{{order.billing.first_name}}": "First Name",
 "{{order.billing.last_name}}": "Last Name",
 "{{order.billing.email}}": "Email",
 "{{order.billing.city}}": "City",
 "{{order.billing.state}}": "State",
 "{{order.billing.country}}": "Country"
 }
 },
 "transaction": {
 "title": "transaction",
 "key": "settings",
 "shortcodes": {
 "{{transaction.total}}": "Total Amount",
 "{{transaction.total_formatted}}": "Total Amount (Formatted)",
 "{{transaction.refund_amount}}": "Refund Amount",
 "{{transaction.refund_amount_formatted}}": "Refund Amount (Formatted)",
 "{{transaction.payment_method}}": "Payment Method",
 "{{transaction.card_last_4}}": "Card Last 4",
 "{{transaction.card_brand}}": "Card Brand",
 "{{transaction.status}}": "Status",
 "{{transaction.currency}}": "Currency"
 }
 },
 "settings": {
 "title": "Settings",
 "key": "settings",
 "shortcodes": {
 "{{settings.store_name}}": "Store Name",
 "{{settings.store_logo}}": "Store Logo",
 "{{settings.store_address}}": "Store Address Line 1",
 "{{settings.store_address2}}": "Store Address Line 2",
 "{{settings.store_country}}": "Store Country",
 "{{settings.store_state}}": "Store State",
 "{{settings.store_city}}": "Store City",
 "{{settings.store_postcode}}": "Store Postcode"
 }
 },
 "license": {
 "title": "License (Loop)",
 "key": "license",
 "shortcodes": {
 "{{license.sl}}": "Serial Number",
 "{{license.key}}": "License Key",
 "{{license.status}}": "Status",
 "{{license.product_name}}": "Product Name",
 "{{license.variant}}": "Variant",
 "{{license.limit}}": "Activation Limit",
 "{{license.activation_count}}": "Activation Count",
 "{{license.expiration_date}}": "Expiration Date"
 }
 }
 },
 "buttons": {
 "View Order": "<a href=\"https://example.com/wp-admin/admin.php?page=fluent-cart#/orders/{{order.id}}/view\" style=\"background-color: green; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;\">View Order</a>"
 }
 }
}```

### Example [](#example-4)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/email-notification/get-short-codes" \
 -u "username:app_password"```

## Get Global Email Settings [](#get-global-email-settings)
GET `/fluent-cart/v2/email-notification/get-settings`
Retrieve the global email configuration settings used across all notification emails (sender name, email addresses, footer, etc.).
### Parameters [](#parameters-5)

No parameters required.
### Response [](#response-5)
json
```
{
 "data": {
 "from_name": "My Store",
 "from_email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "reply_to_name": "",
 "reply_to_email": "",
 "email_footer": "<p>Thank you for shopping with us!</p>",
 "show_email_footer": "yes",
 "admin_email": "{{wp.admin_email}}",
 "notification_config": {}
 },
 "shortcodes": [
 {
 "title": "General",
 "key": "wp",
 "shortcodes": {
 "{{wp.admin_email}}": "Admin Email",
 "{{wp.site_url}}": "Site URL",
 "{{wp.site_title}}": "Site Title",
 "{{user.display_name}}": "User Display Name",
 "{{user.user_email}}": "User Email"
 }
 },
 {
 "title": "Settings",
 "key": "settings",
 "shortcodes": {
 "{{settings.store_name}}": "Store Name",
 "{{settings.store_logo}}": "Store Logo",
 "{{settings.store_address}}": "Store Address Line 1"
 }
 }
 ]
}```

### Example [](#example-5)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/email-notification/get-settings" \
 -u "username:app_password"```

## Save Global Email Settings [](#save-global-email-settings)
POST `/fluent-cart/v2/email-notification/save-settings`
Update the global email configuration settings for all notification emails.
### Parameters [](#parameters-6)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `from_name` | string | body | Yes | Sender name displayed in emails (max 255 characters) | 
| `from_email` | string | body | Yes | Sender email address (must be valid email, max 255 characters) | 
| `reply_to_name` | string | body | No | Reply-to name (max 255 characters) | 
| `reply_to_email` | string | body | No | Reply-to email address (must be valid email, max 255 characters) | 
| `email_footer` | string | body | No | HTML content for the email footer. Sanitized with `wp_kses_post` | 
| `admin_email` | string | body | Yes | Admin notification recipient email(s). Supports shortcodes like `{{wp.admin_email}}` | 
| `show_email_footer` | string | body | No | Show or hide the email footer: `yes` or `no`. Note: On free plans, this is always forced to `yes` | 
### Validation Rules [](#validation-rules-1)

| Field | Rules | 
| --- | --- |
| `from_name` | Required, sanitized text, max 255 characters | 
| `from_email` | Required, valid email, max 255 characters | 
| `reply_to_name` | Nullable, sanitized text, max 255 characters | 
| `reply_to_email` | Nullable, valid email, max 255 characters | 
| `email_footer` | Nullable, string, sanitized with `wp_kses_post` | 
| `admin_email` | Required, string | 
| `show_email_footer` | Nullable, string | 
### Response [](#response-6)
json
```
{
 "message": "Email settings saved successfully"
}```

### Error Response [](#error-response-3)
json
```
{
 "message": "Failed to save email settings"
}```

### Example [](#example-6)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/email-notification/save-settings" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "from_name": "My Store",
 "from_email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "reply_to_name": "Support",
 "reply_to_email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "email_footer": "<p>Thank you for shopping with us!</p>",
 "admin_email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "show_email_footer": "yes"
 }'```

## Get Scheduling Settings [](#get-scheduling-settings)
GET `/fluent-cart/v2/email-notification/reminders`
Retrieve reminder/scheduling settings for automated email notifications such as payment reminders, renewal reminders, and trial-end reminders. Returns both the current settings and the form field definitions for the reminders tab.
### Parameters [](#parameters-7)

No parameters required.
### Response [](#response-7)
json
```
{
 "settings": {
 "reminders_enabled": "yes",
 "invoice_reminders_enabled": "yes",
 "invoice_reminder_due_days": 3,
 "invoice_reminder_overdue_days": "1,3,7",
 "yearly_renewal_reminders_enabled": "yes",
 "yearly_renewal_reminder_days": 30,
 "trial_end_reminders_enabled": "yes",
 "trial_end_reminder_days": 3,
 "monthly_renewal_reminders_enabled": "no",
 "monthly_renewal_reminder_days": 7,
 "quarterly_renewal_reminders_enabled": "no",
 "quarterly_renewal_reminder_days": 14,
 "half_yearly_renewal_reminders_enabled": "no",
 "half_yearly_renewal_reminder_days": 14
 },
 "fields": {
 "reminders": { }
 }
}```

### Example [](#example-7)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/email-notification/reminders" \
 -u "username:app_password"```

## Save Scheduling Settings [](#save-scheduling-settings)
POST `/fluent-cart/v2/email-notification/reminders`
Update reminder/scheduling settings for automated email notifications. Each reminder type has an enable toggle and a days configuration that controls how many days before the event the reminder is sent.
### Parameters [](#parameters-8)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `reminders_enabled` | string | body | No | Master toggle for all reminders: `yes` or `no` | 
| `invoice_reminders_enabled` | string | body | No | Enable invoice payment reminders: `yes` or `no` | 
| `invoice_reminder_due_days` | integer | body | No | Days before due date to send invoice reminder (0-365). Required when `invoice_reminders_enabled` is `yes` | 
| `invoice_reminder_overdue_days` | string | body | No | Comma-separated day intervals for overdue reminders (e.g., `1,3,7`) | 
| `yearly_renewal_reminders_enabled` | string | body | No | Enable yearly subscription renewal reminders: `yes` or `no` | 
| `yearly_renewal_reminder_days` | integer | body | No | Days before renewal to send reminder (7-90). Required when `yearly_renewal_reminders_enabled` is `yes` | 
| `trial_end_reminders_enabled` | string | body | No | Enable trial ending reminders: `yes` or `no` | 
| `trial_end_reminder_days` | integer | body | No | Days before trial ends to send reminder (1-14). Required when `trial_end_reminders_enabled` is `yes` | 
| `monthly_renewal_reminders_enabled` | string | body | No | Enable monthly renewal reminders: `yes` or `no` | 
| `monthly_renewal_reminder_days` | integer | body | No | Days before renewal to send reminder (3-28). Required when `monthly_renewal_reminders_enabled` is `yes` | 
| `quarterly_renewal_reminders_enabled` | string | body | No | Enable quarterly renewal reminders: `yes` or `no` | 
| `quarterly_renewal_reminder_days` | integer | body | No | Days before renewal to send reminder (7-60). Required when `quarterly_renewal_reminders_enabled` is `yes` | 
| `half_yearly_renewal_reminders_enabled` | string | body | No | Enable half-yearly renewal reminders: `yes` or `no` | 
| `half_yearly_renewal_reminder_days` | integer | body | No | Days before renewal to send reminder (7-60). Required when `half_yearly_renewal_reminders_enabled` is `yes` | 
### Validation Rules [](#validation-rules-2)

Validation for the days fields is conditional -- rules are only enforced when the corresponding toggle is set to `yes`:

| Toggle Field | Days Field | Rules (when enabled) | 
| --- | --- | --- |
| `invoice_reminders_enabled` | `invoice_reminder_due_days` | Integer, min: 0, max: 365 | 
| `yearly_renewal_reminders_enabled` | `yearly_renewal_reminder_days` | Integer, min: 7, max: 90 | 
| `trial_end_reminders_enabled` | `trial_end_reminder_days` | Integer, min: 1, max: 14 | 
| `monthly_renewal_reminders_enabled` | `monthly_renewal_reminder_days` | Integer, min: 3, max: 28 | 
| `quarterly_renewal_reminders_enabled` | `quarterly_renewal_reminder_days` | Integer, min: 7, max: 60 | 
| `half_yearly_renewal_reminders_enabled` | `half_yearly_renewal_reminder_days` | Integer, min: 7, max: 60 | 
### Response [](#response-8)
json
```
{
 "data": { },
 "message": "Scheduling settings saved successfully"
}```

### Error Response [](#error-response-4)
json
```
{
 "message": "Failed to save scheduling settings"
}```

### Example [](#example-8)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/email-notification/reminders" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "reminders_enabled": "yes",
 "invoice_reminders_enabled": "yes",
 "invoice_reminder_due_days": 3,
 "invoice_reminder_overdue_days": "1,3,7",
 "yearly_renewal_reminders_enabled": "yes",
 "yearly_renewal_reminder_days": 30,
 "trial_end_reminders_enabled": "yes",
 "trial_end_reminder_days": 3,
 "monthly_renewal_reminders_enabled": "no",
 "monthly_renewal_reminder_days": 7,
 "quarterly_renewal_reminders_enabled": "no",
 "quarterly_renewal_reminder_days": 14,
 "half_yearly_renewal_reminders_enabled": "no",
 "half_yearly_renewal_reminder_days": 14
 }'```

## Preview Notification [](#preview-notification)
POST `/fluent-cart/v2/email-notification/preview`
Generate an HTML preview of a custom email notification template. Uses the block editor email body from the notification's saved settings, parses it through the block parser, wraps it in the email template layout, and resolves shortcodes using real or fallback order data.
### Parameters [](#parameters-9)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `notification_name` | string | body | Yes | The notification key to preview (e.g., `order_paid_customer`) | 
| `order_id` | integer | body | No | Specific order ID to use for shortcode data. If not provided or not found, the most recent order is used | 
### Response [](#response-9)
json
```
{
 "html": "<!DOCTYPE html><html>...rendered email HTML...</html>"
}```

The `html` field contains the fully rendered email including:

- The parsed block editor content
- Email header and footer
- Resolved shortcodes (order data, customer info, store settings)

### Error Response [](#error-response-5)

When no notification name is provided:json
```
{
 "message": "No notification name provided."
}```

When the notification key is not found:json
```
{
 "message": "Notification not found."
}```

### Example [](#example-9)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/email-notification/preview" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "notification_name": "order_paid_customer",
 "order_id": 42
 }'```

## Preview Default Template [](#preview-default-template)
POST `/fluent-cart/v2/email-notification/preview-default-template`
Generate an HTML preview of a default (built-in) email template. Unlike the custom block editor preview, this renders the PHP-based default template using dummy preview data, wrapped in the standard email layout with header and footer.
### Parameters [](#parameters-10)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `template` | string | body | Yes | The template path name to preview (e.g., `order.paid.customer`, `subscription.renewal.admin`). Corresponds to the `template_path` value from the notification configuration | 
### Available Template Paths [](#available-template-paths)

| Template Path | Description | 
| --- | --- |
| `order.paid.admin` | Admin notification for paid order | 
| `order.paid.customer` | Customer receipt for paid order | 
| `order.refunded.admin` | Admin notification for refund | 
| `order.refunded.customer` | Customer refund confirmation | 
| `order.shipped.customer` | Customer shipping notification | 
| `order.delivered.customer` | Customer delivery notification | 
| `order.placed.admin` | Admin notification for offline payment order | 
| `order.placed.customer` | Customer confirmation for offline payment order | 
| `order.reminder.overdue.customer` | Customer payment reminder | 
| `order.reminder.overdue.admin` | Admin copy of payment reminder | 
| `subscription.renewal.customer` | Customer renewal confirmation | 
| `subscription.renewal.admin` | Admin renewal notification | 
| `subscription.canceled.customer` | Customer cancellation notice | 
| `subscription.canceled.admin` | Admin cancellation notice | 
| `subscription.reminder.customer` | Customer renewal reminder | 
| `subscription.reminder.admin` | Admin copy of renewal reminder | 
| `subscription.trial_end.customer` | Customer trial ending reminder | 
| `subscription.trial_end.admin` | Admin copy of trial ending reminder | 
### Response [](#response-10)
json
```
{
 "data": {
 "content": "<!DOCTYPE html><html>...rendered email HTML...</html>"
 }
}```

The `content` field contains the fully rendered email HTML with:

- The default PHP template rendered with dummy preview data
- Email header and footer
- Resolved shortcodes
- All links and buttons disabled (not clickable) via injected CSS

### Example [](#example-10)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/email-notification/preview-default-template" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "template": "order.paid.customer"
 }'```

## Notification Object Reference [](#notification-object-reference)

Each notification object contains the following properties:

| Property | Type | Description | 
| --- | --- | --- |
| `name` | string | Unique notification key identifier | 
| `event` | string | The event hook that triggers this notification | 
| `group` | string | Grouping category: `order`, `subscription`, or `scheduler` | 
| `group_label` | string | Human-readable group label | 
| `title` | string | Descriptive title of the notification | 
| `description` | string | Explanation of when this notification is sent | 
| `recipient` | string | Target recipient: `admin` or `customer` | 
| `smartcode_groups` | array | Additional shortcode groups (extensible via filters) | 
| `template_path` | string | Dot-notation path to the default PHP email template | 
| `is_async` | boolean | Whether the email is sent asynchronously | 
| `pre_header` | string | Email pre-header text (admin notifications only) | 
| `manage_toggle` | string | If set to `no`, the notification cannot be toggled off (e.g., offline payment confirmations) | 
| `settings` | object | Notification settings (see below) | 
### Notification Settings Object [](#notification-settings-object)

| Property | Type | Description | 
| --- | --- | --- |
| `active` | string | Whether the notification is enabled: `yes` or `no` | 
| `subject` | string | Email subject line. Supports shortcodes | 
| `is_default_body` | string | Whether to use the built-in PHP template: `yes` or `no` | 
| `email_body` | string | Custom email body content (HTML). Empty when using default body |

---

## Reports

Source: https://dev.fluentcart.com/restapi/reports.html


Access comprehensive sales analytics, revenue data, order statistics, customer insights, subscription metrics, and more.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2/reports`
**Policy:** `ReportPolicy`
**Required Permission:** `reports/view`
All monetary values are in **cents** unless stated otherwise. Most report endpoints accept date range filters via `startDate` and `endDate` query parameters. Pro license is required for custom date ranges; free plan defaults to the last 30 days.
## Common Parameters [](#common-parameters)

Many report endpoints share a common set of parameters processed through `ReportHelper::processParams()`. These are referenced throughout this document as **Standard Report Parameters**.
### Standard Report Parameters [](#standard-report-parameters)

Passed as nested `params` object in the query string (e.g., `?params[startDate]=2025-01-01`).

| Parameter | Type | Required | Description | 
| --- | --- | --- | --- |
| `params[startDate]` | string | No | Start date for the report period (e.g., `2025-01-01`). Defaults to 30 days ago on free plan. | 
| `params[endDate]` | string | No | End date for the report period (e.g., `2025-12-31`). Defaults to today on free plan. | 
| `params[groupKey]` | string | No | Grouping interval. Accepted values: `default`, `monthly`, `yearly`, `billing_country`, `shipping_country`, `payment_method`, `payment_status`. When `default`, the interval is auto-determined based on date range (daily for <=91 days, monthly for <=365 days, yearly otherwise). | 
| `params[currency]` | string | No | Currency code to filter by (e.g., `USD`). Defaults to store currency. | 
| `params[filterMode]` | string | No | Payment mode filter (e.g., `live` or `test`). Defaults to store setting. | 
| `params[variation_ids]` | array | No | Array of product variation IDs to filter orders that contain these items. | 
| `params[compareType]` | string | No | Comparison period type: `previous_period`, `previous_month`, `previous_quarter`, `previous_year`, or `custom`. | 
| `params[compareDate]` | string | No | Custom comparison start date. Required when `compareType` is `custom`. | 
### Additional Filter Parameters [](#additional-filter-parameters)

Some endpoints accept additional filter keys beyond the standard set:

| Parameter | Type | Description | 
| --- | --- | --- |
| `params[paymentStatus]` | array | Payment status filter. Automatically set to report-eligible statuses (`paid`, `partially-paid`, `refunded`, `partially-refunded`). | 
| `params[orderTypes]` | array | Order type filter (e.g., `one-time`, `subscription`). | 
| `params[orderStatus]` | array | Order status filter. If `all` is included, defaults to excluding `on-hold` and `failed`. | 
| `params[subscriptionType]` | string | Subscription type filter. Defaults to `subscription`. | 
## Overview [](#overview)

### Get Revenue Overview [](#get-revenue-overview)
GET `/fluent-cart/v2/reports/overview`
Retrieve a comprehensive year-over-year revenue overview comparing the last 12 months against the same months in the prior year. Includes monthly breakdowns, quarterly aggregations, and top revenue-generating countries.

- **Permission:** `reports/view`

#### Parameters [](#parameters)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[currency]` | string | query | No | Currency code to filter by. Defaults to store currency. | 
#### Response [](#response)
json
```
{
 "data": {
 "gross_revenue": {
 "2025-01": {
 "current": 500000,
 "prev": 350000,
 "yoy_growth": "42.86"
 }
 },
 "gross_revenue_quarterly": {
 "Q1-2025": {
 "current": 1500000,
 "prev_year": 1200000,
 "yy_growth": "25.00"
 }
 },
 "net_revenue": { },
 "net_revenue_quarterly": { },
 "gross_summary": {
 "total": 6000000,
 "total_prev": 4800000,
 "yoy_growth": "25.00"
 },
 "net_summary": {
 "total": 5400000,
 "total_prev": 4300000,
 "yoy_growth": "25.58"
 },
 "top_country_net": {
 "by_month": {
 "2025-01": {
 "US": 300000,
 "GB": 150000
 }
 },
 "by_countries": {
 "US": 3600000,
 "GB": 1800000
 }
 },
 "top_country_gross": { }
 }
}```

**Notes:**

- Gross revenue = `total_paid`
- Net revenue = `total_paid - total_refund - tax_total - shipping_tax`
- Data covers the last 30 months to enable 12-month YoY comparisons
- Country data is limited to the top 5 countries by revenue

#### Example [](#example)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/overview?params[currency]=USD" \
 -u "username:app_password"```

## General Reports [](#general-reports)

### Get Report Meta [](#get-report-meta)
GET `/fluent-cart/v2/reports/fetch-report-meta`
Retrieve metadata for the reporting interface, including available currencies, the earliest order date, and store mode.

- **Permission:** `reports/view`

#### Parameters [](#parameters-1)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[startDate]` | string | query | No | Start date to scope the currency lookup. | 
| `params[endDate]` | string | query | No | End date to scope the currency lookup. | 
#### Response [](#response-1)
json
```
{
 "currencies": {
 "USD": {
 "code": "USD",
 "sign": "$"
 }
 },
 "min_date": "2024-01-15 08:30:00",
 "storeMode": "live",
 "first_order_date": "2024-01-15 08:30:00"
}```

#### Example [](#example-1)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/fetch-report-meta" \
 -u "username:app_password"```

### Get Quick Order Stats [](#get-quick-order-stats)
GET `/fluent-cart/v2/reports/quick-order-stats`
Retrieve quick summary statistics for orders within a specified range, with automatic comparison against the equivalent prior period.

- **Permission:** `reports/view`

#### Parameters [](#parameters-2)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `day_range` | string | query | No | Date range shortcut. Accepts relative date strings (e.g., `-7 days`, `-30 days`), `this_month`, or `all_time`. Default: `-0 days` (today). | 
#### Response [](#response-2)
json
```
{
 "stats": { },
 "from_date": "2025-06-01 00:00:00",
 "to_date": "2025-06-15 23:59:59"
}```

#### Example [](#example-2)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/quick-order-stats?day_range=-30%20days" \
 -u "username:app_password"```

### Get Sales Growth [](#get-sales-growth)
GET `/fluent-cart/v2/reports/sales-growth`
Retrieve sales growth data over a specified period. Filters to orders with successful payment and order statuses.

- **Permission:** `reports/view`

#### Parameters [](#parameters-3)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `start_date` | string | query | No | Start date. Defaults to the earliest order date. | 
| `end_date` | string | query | No | End date. Defaults to the latest order date. | 
#### Response [](#response-3)
json
```
{
 "sales_data": { }
}```

#### Example [](#example-3)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/sales-growth?start_date=2025-01-01&end_date=2025-12-31" \
 -u "username:app_password"```

### Get Report Overview [](#get-report-overview)
GET `/fluent-cart/v2/reports/report-overview`
Retrieve an aggregated report overview including order summary statistics and breakdowns by payment method.

- **Permission:** `reports/view`

#### Parameters [](#parameters-4)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[created_at]` | object | query | No | Date filter with `column`, `operator`, and `value` keys. | 
#### Response [](#response-4)
json
```
{
 "data": { },
 "orders_by_payment_method": { }
}```

#### Example [](#example-4)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/report-overview" \
 -u "username:app_password"```

### Search Repeat Customers [](#search-repeat-customers)
GET `/fluent-cart/v2/reports/search-repeat-customer`
Search and paginate through customers who have made multiple purchases.

- **Permission:** `reports/view`

#### Parameters [](#parameters-5)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[per_page]` | integer | query | No | Number of results per page. | 
| `params[current_page]` | integer | query | No | Current page number. | 
Additional search/filter parameters may be supported through `CustomerHelper::getRepeatCustomerBySearch()`.
#### Response [](#response-5)
json
```
{
 "repeat_customers": {
 "total": 50,
 "per_page": 15,
 "current_page": 1,
 "data": [ ]
 }
}```

#### Example [](#example-5)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/search-repeat-customer?params[per_page]=20&params[current_page]=1" \
 -u "username:app_password"```

### Get Top Products Sold [](#get-top-products-sold)
GET `/fluent-cart/v2/reports/top-products-sold`
Retrieve a list of top-selling products based on order item data, using the Resource API layer.

- **Permission:** `reports/view`

#### Parameters [](#parameters-6)

Parameters are passed via the `params` object and forwarded to `OrderItemResource::topProductsSold()`.
#### Response [](#response-6)
json
```
{
 "top_products_sold": [ ]
}```

#### Example [](#example-6)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/top-products-sold" \
 -u "username:app_password"```

## Revenue Reports [](#revenue-reports)

### Get Revenue Data [](#get-revenue-data)
GET `/fluent-cart/v2/reports/revenue`
Retrieve detailed revenue data grouped by the specified interval, with optional comparison against a prior period. Includes summary totals, period-over-period fluctuations, and the applied group key.

- **Permission:** `reports/view`

#### Parameters [](#parameters-7)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[paymentStatus]` | array | query | No | Payment status filter (auto-set to report statuses). | 
| `params[orderTypes]` | array | query | No | Filter by order type (e.g., `one-time`, `subscription`). | 
#### Response [](#response-7)
json
```
{
 "revenueReport": [
 {
 "year": "2025",
 "group": "2025-01",
 "gross_revenue": 500000,
 "net_revenue": 450000,
 "orders": 45
 }
 ],
 "summary": {
 "gross_revenue": 6000000,
 "net_revenue": 5400000,
 "total_orders": 540
 },
 "previousSummary": { },
 "fluctuations": {
 "gross_revenue": {
 "value": 25.0,
 "direction": "up"
 }
 },
 "previousMetrics": [ ],
 "appliedGroupKey": "monthly"
}```

#### Example [](#example-7)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/revenue?params[startDate]=2025-01-01&params[endDate]=2025-06-30&params[groupKey]=monthly&params[compareType]=previous_period" \
 -u "username:app_password"```

### Get Revenue by Group [](#get-revenue-by-group)
GET `/fluent-cart/v2/reports/revenue-by-group`
Retrieve revenue data broken down by a specific grouping dimension (e.g., payment method, billing country).

- **Permission:** `reports/view`

#### Parameters [](#parameters-8)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[paymentStatus]` | array | query | No | Payment status filter (auto-set to report statuses). | 
| `params[orderTypes]` | array | query | No | Filter by order type. | 
#### Response [](#response-8)
json
```
{
 "data": { }
}```

#### Example [](#example-8)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/revenue-by-group?params[startDate]=2025-01-01&params[endDate]=2025-06-30&params[groupKey]=payment_method" \
 -u "username:app_password"```

## Order Reports [](#order-reports)

### Get Order Value Distribution [](#get-order-value-distribution)
GET `/fluent-cart/v2/reports/order-value-distribution`
Retrieve the distribution of orders by their total value, showing how orders are spread across different price ranges.

- **Permission:** `reports/view`

#### Parameters [](#parameters-9)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[paymentStatus]` | array | query | No | Payment status filter. | 
| `params[orderTypes]` | array | query | No | Order type filter. | 
#### Response [](#response-9)
json
```
{
 "data": [ ]
}```

#### Example [](#example-9)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/order-value-distribution?params[startDate]=2025-01-01&params[endDate]=2025-06-30" \
 -u "username:app_password"```

### Get New vs Returning Customers [](#get-new-vs-returning-customers)
GET `/fluent-cart/v2/reports/fetch-new-vs-returning-customer`
Compare the ratio of orders from new customers versus returning customers over the given period.

- **Permission:** `reports/view`

#### Parameters [](#parameters-10)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[paymentStatus]` | array | query | No | Payment status filter. | 
| `params[orderTypes]` | array | query | No | Order type filter. | 
#### Response [](#response-10)
json
```
{
 "newVsReturning": { }
}```

#### Example [](#example-10)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/fetch-new-vs-returning-customer?params[startDate]=2025-01-01&params[endDate]=2025-06-30" \
 -u "username:app_password"```

### Get Orders by Group [](#get-orders-by-group)
GET `/fluent-cart/v2/reports/fetch-order-by-group`
Retrieve order data broken down by a specified grouping dimension (e.g., payment method, country, payment status).

- **Permission:** `reports/view`

#### Parameters [](#parameters-11)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[paymentStatus]` | array | query | No | Payment status filter. | 
| `params[orderTypes]` | array | query | No | Order type filter. | 
#### Response [](#response-11)
json
```
{
 "data": { }
}```

#### Example [](#example-11)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/fetch-order-by-group?params[startDate]=2025-01-01&params[endDate]=2025-06-30&params[groupKey]=payment_method" \
 -u "username:app_password"```

### Get Report by Day and Hour [](#get-report-by-day-and-hour)
GET `/fluent-cart/v2/reports/fetch-report-by-day-and-hour`
Retrieve a heatmap-style report showing order distribution by day of the week and hour of the day.

- **Permission:** `reports/view`

#### Parameters [](#parameters-12)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[paymentStatus]` | array | query | No | Payment status filter. | 
| `params[orderTypes]` | array | query | No | Order type filter. | 
#### Response [](#response-12)

Returns day-and-hour matrix data suitable for heatmap visualization.
#### Example [](#example-12)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/fetch-report-by-day-and-hour?params[startDate]=2025-01-01&params[endDate]=2025-06-30" \
 -u "username:app_password"```

### Get Item Count Distribution [](#get-item-count-distribution)
GET `/fluent-cart/v2/reports/item-count-distribution`
Retrieve the distribution of orders by the number of items per order (e.g., how many orders have 1 item, 2 items, etc.).

- **Permission:** `reports/view`

#### Parameters [](#parameters-13)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[paymentStatus]` | array | query | No | Payment status filter. | 
| `params[orderTypes]` | array | query | No | Order type filter. | 
#### Response [](#response-13)
json
```
{
 "data": [ ]
}```

#### Example [](#example-13)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/item-count-distribution?params[startDate]=2025-01-01&params[endDate]=2025-06-30" \
 -u "username:app_password"```

### Get Order Completion Time [](#get-order-completion-time)
GET `/fluent-cart/v2/reports/order-completion-time`
Retrieve statistics on how long orders take to be completed (time between creation and completion).

- **Permission:** `reports/view`

#### Parameters [](#parameters-14)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[paymentStatus]` | array | query | No | Payment status filter. | 
| `params[orderTypes]` | array | query | No | Order type filter. | 
#### Response [](#response-14)
json
```
{
 "data": { }
}```

#### Example [](#example-14)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/order-completion-time?params[startDate]=2025-01-01&params[endDate]=2025-06-30" \
 -u "username:app_password"```

### Get Order Chart [](#get-order-chart)
GET `/fluent-cart/v2/reports/order-chart`
Retrieve order count and statistics as time-series chart data, with optional comparison against a prior period. Includes summary totals and fluctuation calculations.

- **Permission:** `reports/view`

#### Parameters [](#parameters-15)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[paymentStatus]` | array | query | No | Payment status filter. | 
| `params[orderTypes]` | array | query | No | Order type filter. | 
#### Response [](#response-15)
json
```
{
 "orderChartData": [
 {
 "year": "2025",
 "group": "2025-01-15",
 "orders": 12
 }
 ],
 "summary": {
 "total_orders": 540,
 "average_orders_per_day": 18
 },
 "previousSummary": { },
 "fluctuations": { }
}```

#### Example [](#example-15)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/order-chart?params[startDate]=2025-01-01&params[endDate]=2025-06-30&params[compareType]=previous_period" \
 -u "username:app_password"```

## Sales Reports [](#sales-reports)

### Get Sales Report [](#get-sales-report)
GET `/fluent-cart/v2/reports/sales-report`
Retrieve comprehensive sales report data with multiple graph metrics (revenue, orders, items, etc.) broken down by the specified time interval. Supports comparison against a prior period with fluctuation calculations.

- **Permission:** `reports/view`

#### Parameters [](#parameters-16)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[paymentStatus]` | array | query | No | Payment status filter. | 
| `params[orderTypes]` | array | query | No | Order type filter. | 
#### Response [](#response-16)
json
```
{
 "graphs": {
 "gross_revenue": [ ],
 "net_revenue": [ ],
 "orders": [ ],
 "items_sold": [ ]
 },
 "summaryData": {
 "gross_revenue": 6000000,
 "net_revenue": 5400000,
 "total_orders": 540,
 "items_sold": 1200
 },
 "previousSummary": { },
 "fluctuations": { }
}```

#### Example [](#example-16)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/sales-report?params[startDate]=2025-01-01&params[endDate]=2025-06-30&params[groupKey]=monthly" \
 -u "username:app_password"```

### Get Top Sold Products [](#get-top-sold-products)
GET `/fluent-cart/v2/reports/fetch-top-sold-products`
Retrieve a ranked list of the best-selling products within the specified date range.

- **Permission:** `reports/view`

#### Parameters [](#parameters-17)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[paymentStatus]` | array | query | No | Payment status filter. | 
| `params[orderTypes]` | array | query | No | Order type filter. | 
#### Response [](#response-17)

Returns ranked product list with sales counts and revenue data.
#### Example [](#example-17)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/fetch-top-sold-products?params[startDate]=2025-01-01&params[endDate]=2025-06-30" \
 -u "username:app_password"```

### Get Top Sold Variants [](#get-top-sold-variants)
GET `/fluent-cart/v2/reports/fetch-top-sold-variants`
Retrieve a ranked list of the best-selling product variants within the specified date range.

- **Permission:** `reports/view`

#### Parameters [](#parameters-18)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[paymentStatus]` | array | query | No | Payment status filter. | 
| `params[orderTypes]` | array | query | No | Order type filter. | 
#### Response [](#response-18)

Returns ranked variant list with sales counts and revenue data.
#### Example [](#example-18)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/fetch-top-sold-variants?params[startDate]=2025-01-01&params[endDate]=2025-06-30" \
 -u "username:app_password"```

## Refund Reports [](#refund-reports)

### Get Refund Chart [](#get-refund-chart)
GET `/fluent-cart/v2/reports/refund-chart`
Retrieve refund data as time-series chart data with summary totals. Supports comparison against a prior period with fluctuation calculations.

- **Permission:** `reports/view`

#### Parameters [](#parameters-19)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[paymentStatus]` | array | query | No | Payment status filter. | 
| `params[orderTypes]` | array | query | No | Order type filter. | 
#### Response [](#response-19)
json
```
{
 "summary": {
 "total_refunds": 25,
 "total_refund_amount": 125000,
 "average_refund": 5000
 },
 "previousSummary": { },
 "chartData": [
 {
 "year": "2025",
 "group": "2025-01",
 "refund_count": 3,
 "refund_amount": 15000
 }
 ],
 "fluctuations": { },
 "previousMetrics": [ ]
}```

#### Example [](#example-19)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/refund-chart?params[startDate]=2025-01-01&params[endDate]=2025-06-30&params[compareType]=previous_period" \
 -u "username:app_password"```

### Get Weeks Between Refund [](#get-weeks-between-refund)
GET `/fluent-cart/v2/reports/weeks-between-refund`
Retrieve analysis data showing the distribution of time (in weeks) between order placement and refund request.

- **Permission:** `reports/view`

#### Parameters [](#parameters-20)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[paymentStatus]` | array | query | No | Payment status filter. | 
| `params[orderTypes]` | array | query | No | Order type filter. | 
#### Response [](#response-20)
json
```
{
 "data": [ ]
}```

#### Example [](#example-20)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/weeks-between-refund?params[startDate]=2025-01-01&params[endDate]=2025-06-30" \
 -u "username:app_password"```

### Get Refund Data by Group [](#get-refund-data-by-group)
GET `/fluent-cart/v2/reports/refund-data-by-group`
Retrieve refund data broken down by a grouping dimension (e.g., payment method, country).

- **Permission:** `reports/view`

#### Parameters [](#parameters-21)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[paymentStatus]` | array | query | No | Payment status filter. | 
| `params[orderTypes]` | array | query | No | Order type filter. | 
#### Response [](#response-21)
json
```
{
 "data": { }
}```

#### Example [](#example-21)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/refund-data-by-group?params[startDate]=2025-01-01&params[endDate]=2025-06-30&params[groupKey]=payment_method" \
 -u "username:app_password"```

## License Reports [](#license-reports)

### Get License Line Chart [](#get-license-line-chart)
GET `/fluent-cart/v2/reports/license-chart`
Retrieve license creation/activation data as time-series chart data, grouped by the specified interval.

- **Permission:** `reports/view`

#### Parameters [](#parameters-22)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[startDate]` | string | query | No | Start date for the report period. | 
| `params[endDate]` | string | query | No | End date for the report period. | 
| `params[groupKey]` | string | query | No | Time grouping interval: `daily`, `monthly`, or `yearly`. Default: `daily`. | 
| `params[paymentStatus]` | string | query | No | Payment status filter. | 
| `params[orderStatus]` | string | query | No | Order status filter. | 
| `params[currency]` | string | query | No | Currency code filter. | 
| `params[filterMode]` | string | query | No | Payment mode filter (`live` or `test`). | 
| `params[orderTypes]` | array | query | No | Order type filter. | 
#### Response [](#response-22)

Returns time-series chart data for license metrics.
#### Example [](#example-22)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/license-chart?params[startDate]=2025-01-01&params[endDate]=2025-06-30&params[groupKey]=monthly" \
 -u "username:app_password"```

### Get License Pie Chart [](#get-license-pie-chart)
GET `/fluent-cart/v2/reports/license-pie-chart`
Retrieve license distribution data suitable for pie/donut chart visualization (e.g., active vs expired vs revoked).

- **Permission:** `reports/view`

#### Parameters [](#parameters-23)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[startDate]` | string | query | No | Start date for the report period. | 
| `params[endDate]` | string | query | No | End date for the report period. | 
| `params[paymentStatus]` | string | query | No | Payment status filter. | 
| `params[orderStatus]` | string | query | No | Order status filter. | 
| `params[currency]` | string | query | No | Currency code filter. | 
| `params[filterMode]` | string | query | No | Payment mode filter. | 
| `params[orderTypes]` | array | query | No | Order type filter. | 
#### Response [](#response-23)

Returns license status distribution data.
#### Example [](#example-23)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/license-pie-chart?params[startDate]=2025-01-01&params[endDate]=2025-06-30" \
 -u "username:app_password"```

### Get License Summary [](#get-license-summary)
GET `/fluent-cart/v2/reports/license-summary`
Retrieve summary statistics for licenses (total issued, active, expired, revoked, etc.) within the specified date range.

- **Permission:** `reports/view`

#### Parameters [](#parameters-24)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[startDate]` | string | query | No | Start date for the report period. | 
| `params[endDate]` | string | query | No | End date for the report period. | 
| `params[paymentStatus]` | string | query | No | Payment status filter. | 
| `params[orderStatus]` | string | query | No | Order status filter. | 
| `params[currency]` | string | query | No | Currency code filter. | 
| `params[filterMode]` | string | query | No | Payment mode filter. | 
| `params[orderTypes]` | array | query | No | Order type filter. | 
#### Response [](#response-24)

Returns license summary statistics.
#### Example [](#example-24)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/license-summary?params[startDate]=2025-01-01&params[endDate]=2025-06-30" \
 -u "username:app_password"```

## Dashboard Reports [](#dashboard-reports)

### Get Dashboard Stats [](#get-dashboard-stats)
GET `/fluent-cart/v2/reports/dashboard-stats`
Retrieve key dashboard statistics including total orders, paid orders, paid order items, and total paid amounts. Automatically calculates comparison against the equivalent prior period based on the selected date range.

- **Permission:** `reports/view`

#### Parameters [](#parameters-25)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[startDate]` | string | query | No | Start date. If omitted, defaults to the earliest order date. | 
| `params[endDate]` | string | query | No | End date. If omitted, defaults to today. | 
| `params[currency]` | string | query | No | Currency code filter. Defaults to store currency. | 
| `params[paymentStatus]` | string | query | No | Payment status filter. Set to `all` to include all statuses. | 
#### Response [](#response-25)
json
```
{
 "dashBoardStats": {
 "total_orders": {
 "title": "All Orders",
 "icon": "AllOrdersIcon",
 "current_count": 540,
 "compare_count": 480
 },
 "paid_orders": {
 "title": "Paid Orders",
 "icon": "Money",
 "current_count": 520,
 "compare_count": 460
 },
 "total_paid_order_items": {
 "title": "Paid Order Items",
 "icon": "OrderItemsIcon",
 "current_count": 1200,
 "compare_count": 1050
 },
 "total_paid_amounts": {
 "title": "Order Value (Paid)",
 "icon": "OrderValueIcon",
 "current_count": 6000000,
 "compare_count": 5200000,
 "is_cents": true
 }
 }
}```

**Notes:**

- `total_paid_amounts.current_count` is in **cents** (indicated by `is_cents: true`)
- The comparison period is automatically calculated as the same number of days immediately preceding the selected start date

#### Example [](#example-25)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/dashboard-stats?params[startDate]=2025-01-01&params[endDate]=2025-06-30&params[currency]=USD" \
 -u "username:app_password"```

### Get Sales Growth Chart [](#get-sales-growth-chart)
GET `/fluent-cart/v2/reports/sales-growth-chart`
Retrieve time-series chart data for sales growth on the dashboard, showing order counts and net revenue grouped by the specified interval.

- **Permission:** `reports/view`

#### Parameters [](#parameters-26)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[orderStatus]` | array | query | No | Order status filter. | 
#### Response [](#response-26)
json
```
{
 "salesGrowthChart": [
 {
 "year": "2025",
 "group": "2025-01",
 "orders": 45,
 "net_revenue": 4500.00
 }
 ]
}```

**Note:** The `net_revenue` values in this response are in **decimal** (dollars), not cents. The calculation is: `(total_paid - total_refund - tax_total - shipping_tax) / 100`.
#### Example [](#example-26)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/sales-growth-chart?params[startDate]=2025-01-01&params[endDate]=2025-06-30&params[groupKey]=monthly" \
 -u "username:app_password"```

### Get Country Heat Map [](#get-country-heat-map)
GET `/fluent-cart/v2/reports/country-heat-map`
Retrieve order counts grouped by billing country for world map / heat map visualization.

- **Permission:** `reports/view`

#### Parameters [](#parameters-27)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[currency]` | string | query | No | Currency code filter. Defaults to store currency. | 
#### Response [](#response-27)
json
```
{
 "countryHeatMap": [
 {
 "name": "United States",
 "value": 250
 },
 {
 "name": "United Kingdom",
 "value": 120
 },
 {
 "name": "Germany",
 "value": 85
 }
 ]
}```

**Notes:**

- Country codes are resolved to full country names
- Orders without a billing country are grouped under "Uncategorized"
- Results are sorted by value in ascending order

#### Example [](#example-27)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/country-heat-map?params[currency]=USD" \
 -u "username:app_password"```

### Get Recent Orders [](#get-recent-orders)
GET `/fluent-cart/v2/reports/get-recent-orders`
Retrieve the 10 most recent orders for the dashboard with basic customer and order information.

- **Permission:** `reports/view`

#### Parameters [](#parameters-28)

None.
#### Response [](#response-28)
json
```
{
 "recentOrders": [
 {
 "id": 150,
 "customer_id": 42,
 "customer_name": "John Doe",
 "total_amount": 99.99,
 "created_at": "2025-06-15 14:30:00",
 "order_items_count": 3
 }
 ]
}```

**Note:** The `total_amount` is returned in **decimal** (dollars), not cents.
#### Example [](#example-28)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/get-recent-orders" \
 -u "username:app_password"```

### Get Recent Activities [](#get-recent-activities)
GET `/fluent-cart/v2/reports/get-recent-activities`
Retrieve the 10 most recent activity log entries, optionally filtered by time period.

- **Permission:** `reports/view`

#### Parameters [](#parameters-29)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `groupKey` | string | query | No | Time filter: `today`, `yesterday`, `this_week`, or `all` (default: `all`). | 
#### Response [](#response-29)
json
```
{
 "recentActivities": [
 {
 "title": "Order #150 created",
 "content": "New order placed by John Doe",
 "created_at": "2025-06-15 14:30:00",
 "created_by": 1,
 "module_name": "orders",
 "module_id": 150
 }
 ]
}```

#### Example [](#example-29)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/get-recent-activities?groupKey=today" \
 -u "username:app_password"```

### Get Dashboard Summary [](#get-dashboard-summary)
GET `/fluent-cart/v2/reports/get-dashboard-summary`
Retrieve a high-level summary of the store including product counts and coupon statistics.

- **Permission:** `reports/view`

#### Parameters [](#parameters-30)

None.
#### Response [](#response-30)
json
```
{
 "summaryData": {
 "total_products": 25,
 "draft_products": 3,
 "active_coupons": 5,
 "expired_coupons": 2
 }
}```

**Notes:**

- `total_products` counts all `fluent-products` custom post type entries
- `draft_products` counts products with `post_status = 'draft'`
- `active_coupons` are coupons that are either unexpired or have no end date and are in `active` status
- `expired_coupons` are coupons past their end date with `expired` or `disabled` status

#### Example [](#example-30)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/get-dashboard-summary" \
 -u "username:app_password"```

## Subscription Reports [](#subscription-reports)

### Get Subscription Chart [](#get-subscription-chart)
GET `/fluent-cart/v2/reports/subscription-chart`
Retrieve subscription data as time-series chart data, including total subscription counts and future installment projections. Supports comparison against a prior period.

- **Permission:** `reports/view`

#### Parameters [](#parameters-31)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[paymentStatus]` | array | query | No | Payment status filter. | 
| `params[subscriptionType]` | string | query | No | Subscription type filter. Defaults to `subscription`. | 
#### Response [](#response-31)
json
```
{
 "currentMetrics": [
 {
 "year": "2025",
 "group": "2025-01",
 "subscriptions": 20,
 "mrr": 100000
 }
 ],
 "compareMetrics": [ ],
 "summary": {
 "future_installments": 500000.00,
 "total_subscriptions": 150
 },
 "fluctuations": []
}```

**Note:** `future_installments` is calculated as the sum of `(bill_times - bill_count) * recurring_total` for active subscriptions, returned in **decimal** (dollars).
#### Example [](#example-31)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/subscription-chart?params[startDate]=2025-01-01&params[endDate]=2025-06-30&params[compareType]=previous_year" \
 -u "username:app_password"```

### Get Daily Signups [](#get-daily-signups)
GET `/fluent-cart/v2/reports/daily-signups`
Retrieve daily subscription signup counts over the specified date range.

- **Permission:** `reports/view`

#### Parameters [](#parameters-32)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[paymentStatus]` | array | query | No | Payment status filter. | 
| `params[subscriptionType]` | string | query | No | Subscription type filter. | 
#### Response [](#response-32)
json
```
{
 "signups": { }
}```

#### Example [](#example-32)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/daily-signups?params[startDate]=2025-01-01&params[endDate]=2025-06-30" \
 -u "username:app_password"```

### Get Retention Chart [](#get-retention-chart)
GET `/fluent-cart/v2/reports/retention-chart`
Retrieve subscription retention data as chart data, showing how many subscribers remain active over time.

- **Permission:** `reports/view`

#### Parameters [](#parameters-33)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[customDays]` | integer | query | No | Custom number of days for the retention period. | 
#### Response [](#response-33)
json
```
{
 "chartData": { }
}```

#### Example [](#example-33)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/retention-chart?params[startDate]=2025-01-01&params[endDate]=2025-06-30&params[customDays]=90" \
 -u "username:app_password"```

### Get Future Renewals [](#get-future-renewals)
GET `/fluent-cart/v2/reports/future-renewals`
Retrieve projected future subscription renewal data.

- **Permission:** `reports/view`

#### Parameters [](#parameters-34)

Uses [Standard Report Parameters](#standard-report-parameters) (only `startDate` and `endDate` are explicitly extracted).
#### Response [](#response-34)

Returns future renewal projection data.
#### Example [](#example-34)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/future-renewals?params[startDate]=2025-01-01&params[endDate]=2025-12-31" \
 -u "username:app_password"```

### Get Subscription Retention [](#get-subscription-retention)
GET `/fluent-cart/v2/reports/subscription-retention`
Retrieve subscription retention data showing the percentage of subscribers who remain active over successive billing periods.

- **Permission:** `reports/view`

#### Parameters [](#parameters-35)

Uses [Standard Report Parameters](#standard-report-parameters).
#### Response [](#response-35)
json
```
{
 "retention_data": { }
}```

#### Example [](#example-35)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/subscription-retention?params[startDate]=2025-01-01&params[endDate]=2025-06-30" \
 -u "username:app_password"```

### Get Subscription Cohorts [](#get-subscription-cohorts)
GET `/fluent-cart/v2/reports/subscription-cohorts`
Retrieve cohort analysis data for subscriptions. Groups subscribers by their signup period and tracks retention over subsequent periods. Uses pre-generated retention snapshots for efficient querying.

- **Permission:** `reports/view`

#### Parameters [](#parameters-36)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[groupBy]` | string | query | No | Cohort grouping interval: `month` or `year`. Default: `year`. | 
| `params[metric]` | string | query | No | Metric to track: `subscribers` or other supported metric. Default: `subscribers`. | 
| `params[variation_ids]` | array | query | No | Product variation IDs to filter by. These are converted to product IDs internally for snapshot lookup. | 
**Notes:**

- When `groupBy` is `year`, the default max periods is 8 years (or date range + 1, whichever is greater)
- When `groupBy` is `month`, the default max periods is 18 months (to capture yearly subscription renewal patterns)
- This endpoint requires retention snapshots to be pre-generated via the `retention-snapshots/generate` endpoint

#### Response [](#response-36)

Returns cohort matrix data.
#### Example [](#example-36)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/subscription-cohorts?params[startDate]=2023-01-01&params[endDate]=2025-06-30&params[groupBy]=year&params[metric]=subscribers" \
 -u "username:app_password"```

## Retention Snapshots [](#retention-snapshots)

### Generate Retention Snapshots [](#generate-retention-snapshots)
POST `/fluent-cart/v2/reports/retention-snapshots/generate`
Trigger generation of retention snapshot data. If Action Scheduler is available, the job runs in the background; otherwise it runs synchronously.

- **Permission:** `reports/view`

#### Parameters [](#parameters-37)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `product_id` | integer | body | No | Specific product ID to generate snapshots for. If omitted, generates for all products. | 
#### Response (Background Mode) [](#response-background-mode)
json
```
{
 "success": true,
 "message": "Snapshot generation queued",
 "job_id": 1718456789,
 "mode": "background"
}```

#### Response (Synchronous Mode) [](#response-synchronous-mode)
json
```
{
 "success": true,
 "message": "Snapshots generated successfully",
 "stats": { },
 "mode": "synchronous"
}```

**Notes:**

- Background mode uses WordPress Action Scheduler (`as_schedule_single_action`)
- The returned `job_id` is a Unix timestamp used to track the job
- Use the `retention-snapshots/status` endpoint to poll for completion

#### Example [](#example-37)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/reports/retention-snapshots/generate" \
 -H "Content-Type: application/json" \
 -d '{"product_id": 42}' \
 -u "username:app_password"```

### Check Retention Snapshot Status [](#check-retention-snapshot-status)
GET `/fluent-cart/v2/reports/retention-snapshots/status`
Check the status of a previously queued retention snapshot generation job.

- **Permission:** `reports/view`

#### Parameters [](#parameters-38)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[job_id]` | integer | query | Yes | The job ID returned from the `retention-snapshots/generate` endpoint. | 
#### Response (Running) [](#response-running)
json
```
{
 "success": true,
 "status": "running",
 "message": "Job is still running",
 "data": {
 "status": "pending",
 "started_at": "2025-06-15 14:30:00",
 "product_id": 42
 }
}```

#### Response (Completed) [](#response-completed)
json
```
{
 "success": true,
 "status": "completed",
 "message": "Job completed",
 "stats": { },
 "data": { }
}```

#### Response (Job Not Found) [](#response-job-not-found)
json
```
{
 "success": false,
 "message": "Job not found",
 "job_id": 1718456789
}```

#### Example [](#example-38)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/retention-snapshots/status?params[job_id]=1718456789" \
 -u "username:app_password"```

## Product Reports [](#product-reports)

### Get Product Report [](#get-product-report)
GET `/fluent-cart/v2/reports/product-report`
Retrieve product-level report data as time-series chart data with summary statistics. Supports comparison against a prior period with fluctuation calculations.

- **Permission:** `reports/view`

#### Parameters [](#parameters-39)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[paymentStatus]` | array | query | No | Payment status filter. | 
| `params[orderTypes]` | array | query | No | Order type filter. | 
#### Response [](#response-37)
json
```
{
 "summary": {
 "total_products_sold": 1200,
 "total_revenue": 6000000,
 "unique_products": 25
 },
 "previousSummary": { },
 "fluctuations": { },
 "currentMetrics": [
 {
 "year": "2025",
 "group": "2025-01",
 "products_sold": 100,
 "revenue": 500000
 }
 ],
 "previousMetrics": [ ]
}```

#### Example [](#example-39)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/product-report?params[startDate]=2025-01-01&params[endDate]=2025-06-30&params[compareType]=previous_period" \
 -u "username:app_password"```

### Get Product Performance [](#get-product-performance)
GET `/fluent-cart/v2/reports/product-performance`
Retrieve a ranked performance chart of top-performing products within the specified date range.

- **Permission:** `reports/view`

#### Parameters [](#parameters-40)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[paymentStatus]` | array | query | No | Payment status filter. | 
| `params[orderTypes]` | array | query | No | Order type filter. | 
#### Response [](#response-38)
json
```
{
 "productPerformance": [ ]
}```

#### Example [](#example-40)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/product-performance?params[startDate]=2025-01-01&params[endDate]=2025-06-30" \
 -u "username:app_password"```

## Customer Reports [](#customer-reports)

### Get Customer Report [](#get-customer-report)
GET `/fluent-cart/v2/reports/customer-report`
Retrieve customer acquisition and activity data as time-series chart data with summary statistics. Supports comparison against a prior period with fluctuation calculations.

- **Permission:** `reports/view`

#### Parameters [](#parameters-41)

Uses [Standard Report Parameters](#standard-report-parameters).
#### Response [](#response-39)
json
```
{
 "summary": {
 "total_customers": 300,
 "new_customers": 50,
 "returning_customers": 250
 },
 "previousSummary": { },
 "fluctuations": { },
 "currentMetrics": [
 {
 "year": "2025",
 "group": "2025-01",
 "new_customers": 8,
 "total_customers": 25
 }
 ],
 "previousMetrics": [ ]
}```

#### Example [](#example-41)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/customer-report?params[startDate]=2025-01-01&params[endDate]=2025-06-30&params[compareType]=previous_year" \
 -u "username:app_password"```

## Source Reports [](#source-reports)

### Get Source Report [](#get-source-report)
GET `/fluent-cart/v2/reports/sources`
Retrieve order source/attribution data showing where orders originated from. Supports comparison against a prior period with fluctuation calculations.

- **Permission:** `reports/view`

#### Parameters [](#parameters-42)

Uses [Standard Report Parameters](#standard-report-parameters) plus:

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `params[paymentStatus]` | array | query | No | Payment status filter. | 
| `params[orderTypes]` | array | query | No | Order type filter. | 
#### Response [](#response-40)
json
```
{
 "sourceReportData": { },
 "fluctuations": { }
}```

#### Example [](#example-42)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/reports/sources?params[startDate]=2025-01-01&params[endDate]=2025-06-30&params[compareType]=previous_period" \
 -u "username:app_password"```

## Authentication [](#authentication)

All report endpoints require authentication via WordPress REST API authentication methods:

- **Application Passwords** (recommended): Pass via Basic Auth header
- **Cookie Authentication**: For logged-in admin users with appropriate capabilities
- **JWT or OAuth**: If configured via third-party plugins

The authenticated user must have the `reports/view` capability, which is available to the following FluentCart roles:

| Role | Has Access | 
| --- | --- |
| `super_admin` | Yes | 
| `manager` | Yes | 
| `worker` | No | 
| `accountant` | Yes | 
## Group Key Reference [](#group-key-reference)

When using `groupKey` with report endpoints, the following values control how data is aggregated:

| Value | SQL Format | Use Case | 
| --- | --- | --- |
| `default` | Auto-detected | Automatically selects based on date range span | 
| `daily` | `%Y-%m-%d` | Date ranges up to 91 days | 
| `monthly` | `%Y-%m` | Date ranges between 92 and 365 days | 
| `yearly` | `%Y` | Date ranges over 365 days | 
| `payment_method` | N/A | Group by payment gateway (e.g., `stripe`, `paypal`) | 
| `payment_status` | N/A | Group by payment status | 
| `billing_country` | N/A | Group by customer billing country | 
| `shipping_country` | N/A | Group by customer shipping country | 
**Note:** Not all group key values are supported by every endpoint. Time-based keys (`daily`, `monthly`, `yearly`, `default`) are universally supported. Dimension-based keys (`payment_method`, `billing_country`, etc.) are supported by "by-group" endpoints.
## Comparison Periods [](#comparison-periods)

When `compareType` is set, the API returns both current and previous period data along with fluctuation percentages:

| compareType | Behavior | 
| --- | --- |
| `previous_period` | Same number of days immediately before the start date | 
| `previous_month` | Same period shifted back 1 month | 
| `previous_quarter` | Same period shifted back 3 months | 
| `previous_year` | Same period shifted back 1 year | 
| `custom` | Custom start date specified via `compareDate`; same duration | 
The fluctuation object returned typically contains:json
```
{
 "metric_name": {
 "value": 25.0,
 "direction": "up"
 }
}```

## Error Handling [](#error-handling)

All report endpoints return standard WordPress REST API error responses:json
```
{
 "code": "rest_forbidden",
 "message": "Sorry, you are not allowed to do that.",
 "data": {
 "status": 403
 }
}```

| Status Code | Description | 
| --- | --- |
| `200` | Success | 
| `400` | Invalid parameters | 
| `401` | Not authenticated | 
| `403` | Insufficient permissions (`reports/view` required) | 
| `500` | Server error |

---

## Integrations

Source: https://dev.fluentcart.com/restapi/integrations.html


Manage third-party integrations, configure integration feeds, and set up product-specific integration settings.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2`
**Policies:** `IntegrationPolicy` (global), `ProductPolicy` (product-level)
## Global Integrations [](#global-integrations)

Endpoints for managing available add-ons and their global configuration settings. These control the overall connection and authentication for each integration provider (e.g., FluentCRM, FluentSMTP, Webhooks).
### List Available Add-ons [](#list-available-add-ons)
GET `/fluent-cart/v2/integration/addons`
Retrieve the list of all available integration add-ons, including their installation status and metadata.

- **Permission:** `integrations/view`
- **Controller:** `AddonsController@getAddons`

#### Parameters [](#parameters)

*This endpoint does not accept any parameters.*
#### Response [](#response)
json
```
{
 "addons": {
 "fluent-crm": {
 "installable": "fluent-crm",
 "enabled": true,
 "title": "FluentCRM",
 "logo": "https://example.com/wp-content/plugins/fluent-cart/assets/images/integrations/fluentcrm.svg",
 "categories": ["crm", "core", "marketing"],
 "description": "The most powerful email marketing automation plugin for WordPress."
 },
 "fluent-smtp": {
 "installable": "fluent-smtp",
 "enabled": false,
 "title": "FluentSMTP",
 "logo": "...",
 "categories": ["core", "marketing"],
 "description": "A free WordPress SMTP plugin to send emails via multiple providers."
 },
 "webhook": {
 "title": "Webhook",
 "description": "Send data anywhere via webhook",
 "logo": "...",
 "enabled": true,
 "is_pro": true,
 "is_pro_active": true,
 "categories": ["core"]
 }
 }
}```

**Add-on Object Properties:**

| Property | Type | Description | 
| --- | --- | --- |
| `installable` | string | Plugin slug for WordPress.org installation (absent for pro add-ons) | 
| `enabled` | boolean | Whether the add-on's underlying plugin is active | 
| `title` | string | Display name of the add-on | 
| `logo` | string | URL to the add-on's logo image | 
| `categories` | array | Category tags (e.g., `core`, `crm`, `marketing`, `community`, `lms`) | 
| `description` | string | Human-readable description | 
| `is_pro` | boolean | Whether the add-on requires a Pro license (only present for premium add-ons) | 
| `is_pro_active` | boolean | Whether the Pro license is currently active (only present for premium add-ons) | 
#### Example [](#example)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/integration/addons" \
 -u "username:app_password"```

### Get Global Integration Settings [](#get-global-integration-settings)
GET `/fluent-cart/v2/integration/global-settings`
Retrieve global configuration settings for a specific integration provider. Used to get API key configuration, authentication fields, and current saved values.

- **Permission:** `integrations/view`
- **Controller:** `IntegrationController@getGlobalSettings`

#### Parameters [](#parameters-1)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `settings_key` | string | query | Yes | The integration provider key (e.g., `fluent-crm`, `webhook`) | 
#### Response [](#response-1)
json
```
{
 "integration": {
 "api_key": "••••••••",
 "api_url": "https://example.com",
 "status": true
 },
 "settings": {
 "fields": [
 {
 "key": "api_key",
 "label": "API Key",
 "type": "password",
 "required": true
 }
 ],
 "save_button_text": "Save Settings",
 "valid_message": "Your API Key is valid",
 "invalid_message": "Your API Key is not valid"
 }
}```

#### Example [](#example-1)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/integration/global-settings?settings_key=fluent-crm" \
 -u "username:app_password"```

### Save Global Integration Settings [](#save-global-integration-settings)
POST `/fluent-cart/v2/integration/global-settings`
Save or update global configuration settings for a specific integration provider (e.g., API keys, authentication credentials).

- **Permission:** `integrations/manage`
- **Controller:** `IntegrationController@setGlobalSettings`

#### Parameters [](#parameters-2)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `settings_key` | string | body | Yes | The integration provider key | 
| `integration` | object | body | Yes | The settings data to save (fields vary by provider) | 
#### Response [](#response-2)

The response is handled by the integration provider via the `fluent_cart/integration/save_global_integration_settings_{settings_key}` hook. A typical success response:json
```
{
 "message": "Settings saved successfully",
 "status": true
}```

#### Example [](#example-2)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/integration/global-settings" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "settings_key": "fluent-crm",
 "integration": {
 "api_key": "your-api-key",
 "api_url": "https://example.com"
 }
 }'```

### Install and Activate Add-on Plugin [](#install-and-activate-add-on-plugin)
POST `/fluent-cart/v2/integration/feed/install-plugin`
Install and activate a supported integration plugin from the WordPress.org repository. Only whitelisted plugins can be installed through this endpoint.

- **Permission:** `integrations/manage`
- **Controller:** `AddonsController@installAndActivate`

#### Parameters [](#parameters-3)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `addon` | string | body | Yes | The plugin slug to install. Allowed values: `fluent-crm`, `fluent-smtp`, `fluent-community`, `fluent-security`, `fluentform`, `fluent-support` | 
#### Response [](#response-3)
json
```
{
 "message": "Addon installation started successfully.",
 "redirect": "https://example.com/wp-admin/admin.php?page=fluent-cart#/integrations"
}```

#### Error Response [](#error-response)
json
```
{
 "message": "This addon cannot be installed at this time"
}```

#### Example [](#example-3)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/integration/feed/install-plugin" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{"addon": "fluent-crm"}'```

## Integration Feeds [](#integration-feeds)

Integration feeds define the data mapping and conditional logic that connects FluentCart order events to third-party services. Feeds are configured at the global level and fire on all matching orders.
### List Global Integration Feeds [](#list-global-integration-feeds)
GET `/fluent-cart/v2/integration/global-feeds`
Retrieve all configured global integration feeds along with the list of available integrations that support global scope.

- **Permission:** `integrations/view`
- **Controller:** `IntegrationController@getFeeds`

#### Parameters [](#parameters-4)

*This endpoint does not accept any parameters.*
#### Response [](#response-4)
json
```
{
 "feeds": [
 {
 "id": 42,
 "name": "Add to FluentCRM list",
 "enabled": "yes",
 "provider": "fluent-crm",
 "feed": {
 "name": "Add to FluentCRM list",
 "enabled": "yes",
 "list_id": "2",
 "list_name": "Customers",
 "merge_fields": {},
 "conditionals": {
 "conditions": [],
 "status": false,
 "type": "all"
 }
 },
 "scope": "global"
 }
 ],
 "available_integrations": {
 "fluent-crm": {
 "title": "FluentCRM",
 "logo": "...",
 "enabled": true,
 "scopes": ["global", "product"],
 "description": "..."
 }
 },
 "all_module_config_url": "https://example.com/wp-admin/admin.php?page=fluent-cart#/integrations"
}```

**Feed Object Properties:**

| Property | Type | Description | 
| --- | --- | --- |
| `id` | integer | Unique feed ID | 
| `name` | string | Display name of the feed | 
| `enabled` | string | Status: `yes` or `no` | 
| `provider` | string | Integration provider key | 
| `feed` | object | Full feed configuration data including field mappings and conditionals | 
| `scope` | string | Always `global` for this endpoint | 
#### Example [](#example-4)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/integration/global-feeds" \
 -u "username:app_password"```

### Get Feed Settings [](#get-feed-settings)
GET `/fluent-cart/v2/integration/global-feeds/settings`
Retrieve the settings form schema, saved values, and available shortcodes for a specific integration feed. Used to populate the feed editor when creating or editing a global feed.

- **Permission:** `integrations/view`
- **Controller:** `IntegrationController@getSettings`

#### Parameters [](#parameters-5)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `integration_name` | string | query | Yes | The integration provider key (e.g., `fluent-crm`, `webhook`) | 
| `integration_id` | integer | query | No | The feed ID to load existing settings for editing. Omit to get defaults for a new feed. | 
#### Response [](#response-5)
json
```
{
 "settings": {
 "conditionals": {
 "conditions": [],
 "status": false,
 "type": "all"
 },
 "enabled": "yes",
 "list_id": "",
 "list_name": "",
 "name": "",
 "merge_fields": {}
 },
 "settings_fields": {
 "fields": [
 {
 "key": "name",
 "label": "Feed Name",
 "type": "text",
 "required": true
 },
 {
 "key": "list_id",
 "label": "Contact List",
 "type": "select",
 "required": true,
 "options": []
 }
 ]
 },
 "shortcodes": {},
 "inputs": {},
 "merge_fields": {}
}```

**Response Properties:**

| Property | Type | Description | 
| --- | --- | --- |
| `settings` | object | Current feed settings values (defaults for new, saved values for existing) | 
| `settings_fields` | object | Form schema defining the feed editor fields | 
| `shortcodes` | object | Available shortcodes for dynamic field mapping | 
| `inputs` | object | Checkout input fields available for mapping | 
| `merge_fields` | object/boolean | Merge fields for the selected list (if applicable) | 
#### Example [](#example-5)
bash
```
# Get defaults for a new feed
curl -X GET "https://example.com/wp-json/fluent-cart/v2/integration/global-feeds/settings?integration_name=fluent-crm" \
 -u "username:app_password"

# Load existing feed for editing
curl -X GET "https://example.com/wp-json/fluent-cart/v2/integration/global-feeds/settings?integration_name=fluent-crm&integration_id=42" \
 -u "username:app_password"```

### Save Feed Settings [](#save-feed-settings)
POST `/fluent-cart/v2/integration/global-feeds/settings`
Create a new integration feed or update an existing one. Validates required fields defined by the integration provider before saving.

- **Permission:** `integrations/manage`
- **Controller:** `IntegrationController@saveSettings`

#### Parameters [](#parameters-6)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `integration_name` | string | body | Yes | The integration provider key (e.g., `fluent-crm`) | 
| `integration_id` | integer | body | No | The existing feed ID to update. Omit to create a new feed. | 
| `integration` | string (JSON) | body | Yes | JSON-encoded feed settings data containing field mappings, conditionals, and configuration | 
**The `integration` JSON string should contain:**

| Property | Type | Required | Description | 
| --- | --- | --- | --- |
| `name` | string | Yes | Display name for the feed | 
| `enabled` | string | Yes | Status: `yes` or `no` | 
| `list_id` | string | Varies | Target list ID (provider-specific) | 
| `list_name` | string | No | Target list name | 
| `merge_fields` | object | No | Field mapping configuration | 
| `conditionals` | object | No | Conditional logic settings | 
#### Response [](#response-6)
json
```
{
 "message": "Integration has been successfully saved",
 "integration_id": 42,
 "integration_name": "fluent-crm",
 "created": true,
 "feedData": {
 "name": "Add to customers list",
 "enabled": "yes",
 "list_id": "2",
 "merge_fields": {}
 }
}```

**Response Properties:**

| Property | Type | Description | 
| --- | --- | --- |
| `message` | string | Success message | 
| `integration_id` | integer/null | The feed ID (null for newly created feeds before refresh) | 
| `integration_name` | string | The integration provider key | 
| `created` | boolean | `true` if a new feed was created, `false` if an existing one was updated | 
| `feedData` | object | The validated and saved feed data | 
#### Error Response (Validation) [](#error-response-validation)
json
```
{
 "message": "Please fill up the required fields:",
 "errors": {
 "name": "Feed Name is required.",
 "list_id": "Contact List is required."
 }
}```

#### Example [](#example-6)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/integration/global-feeds/settings" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "integration_name": "fluent-crm",
 "integration": "{\"name\":\"Add to customers\",\"enabled\":\"yes\",\"list_id\":\"2\",\"list_name\":\"Customers\",\"merge_fields\":{},\"conditionals\":{\"conditions\":[],\"status\":false,\"type\":\"all\"}}"
 }'```

### Change Feed Status [](#change-feed-status)
POST `/fluent-cart/v2/integration/global-feeds/change-status/{integration_id}`
Toggle a global integration feed on or off without modifying its configuration.

- **Permission:** `integrations/manage`
- **Controller:** `IntegrationController@changeStatus`

#### Parameters [](#parameters-7)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `integration_id` | integer | path | Yes | The feed ID to update | 
| `status` | string | body | Yes | New status: `yes` (enable) or `no` (disable) | 
#### Response [](#response-7)
json
```
{
 "message": "Integration status updated successfully.",
 "meta": {
 "name": "Add to customers list",
 "enabled": "yes",
 "list_id": "2",
 "merge_fields": {}
 }
}```

#### Example [](#example-7)
bash
```
# Disable a feed
curl -X POST "https://example.com/wp-json/fluent-cart/v2/integration/global-feeds/change-status/42" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{"status": "no"}'```

### Delete Feed [](#delete-feed)
DELETE `/fluent-cart/v2/integration/global-feeds/{integration_id}`
Permanently delete a global integration feed.

- **Permission:** `integrations/delete`
- **Controller:** `IntegrationController@deleteSettings`

#### Parameters [](#parameters-8)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `integration_id` | integer | path | Yes | The feed ID to delete | 
#### Response [](#response-8)
json
```
{
 "message": "Integration has been deleted successfully.",
 "id": 42
}```

#### Example [](#example-8)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/integration/global-feeds/42" \
 -u "username:app_password"```

### Get Feed Merge Fields (Lists) [](#get-feed-merge-fields-lists)
GET `/fluent-cart/v2/integration/feed/lists`
Retrieve the merge fields (field mapping options) for a specific integration provider and list. Called when a user selects a target list in the feed editor to load the available mapping fields.

- **Permission:** `integrations/view`
- **Controller:** `IntegrationController@lists`

#### Parameters [](#parameters-9)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `integration_name` | string | query | Yes | The integration provider key (e.g., `fluent-crm`) | 
| `list_id` | string | query | No | The target list ID to fetch merge fields for | 
#### Response [](#response-9)
json
```
{
 "merge_fields": [
 {
 "key": "email",
 "label": "Email",
 "type": "text",
 "required": true
 },
 {
 "key": "first_name",
 "label": "First Name",
 "type": "text",
 "required": false
 },
 {
 "key": "last_name",
 "label": "Last Name",
 "type": "text",
 "required": false
 }
 ]
}```

#### Example [](#example-9)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/integration/feed/lists?integration_name=fluent-crm&list_id=2" \
 -u "username:app_password"```

### Get Dynamic Options [](#get-dynamic-options)
GET `/fluent-cart/v2/integration/feed/dynamic_options`
Fetch dynamic select options for integration feed fields. Supports WordPress post type searches and provider-specific dynamic option lookups. Used by the feed editor to populate dropdown fields asynchronously.

- **Permission:** `integrations/view`
- **Controller:** `IntegrationController@getDynamicOptions`

#### Parameters [](#parameters-10)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `option_key` | string | query | Yes | The type of options to fetch (e.g., `post_type` for WordPress posts, or a provider-specific key) | 
| `sub_option_key` | string | query | Conditional | Required when `option_key` is `post_type`. Specifies the post type slug (e.g., `post`, `page`, `fluent-products`) | 
| `search` | string | query | No | Search term to filter results | 
| `values` | array | query | No | Array of pre-selected IDs to ensure they are included in the response | 
#### Response [](#response-10)
json
```
{
 "options": [
 {
 "id": "123",
 "title": "Example Product"
 },
 {
 "id": "456",
 "title": "Another Product"
 }
 ]
}```

#### Example [](#example-10)
bash
```
# Search WordPress posts by post type
curl -X GET "https://example.com/wp-json/fluent-cart/v2/integration/feed/dynamic_options?option_key=post_type&sub_option_key=page&search=about" \
 -u "username:app_password"

# Fetch provider-specific options
curl -X GET "https://example.com/wp-json/fluent-cart/v2/integration/feed/dynamic_options?option_key=fluentcrm_tags&search=vip" \
 -u "username:app_password"```

### Chained Data Request [](#chained-data-request)
POST `/fluent-cart/v2/integration/feed/chained`
Handle chained/dependent data requests for integration feeds. Used when selecting a value in one feed field needs to dynamically load options for another field. The behavior is entirely handled by the integration provider through the `fluent_cart/integration/chained_{route}` hook.

- **Permission:** `integrations/manage`
- **Controller:** `IntegrationController@chained`

#### Parameters [](#parameters-11)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `route` | string | body | Yes | The chained route identifier, determines which integration provider handles the request | 
| *(additional)* | mixed | body | Varies | Additional parameters depend on the integration provider and the chained route | 
#### Response [](#response-11)

The response format depends on the integration provider handling the chained route. A typical response:json
```
{
 "options": [
 {
 "id": "1",
 "label": "Option A"
 },
 {
 "id": "2",
 "label": "Option B"
 }
 ]
}```

#### Example [](#example-11)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/integration/feed/chained" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "route": "fluent-crm",
 "list_id": "2"
 }'```

## Product Integrations [](#product-integrations)

Product-level integrations allow you to configure integration feeds that only fire for orders containing a specific product. This enables per-product customization of CRM tagging, webhook payloads, and other integration behaviors.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2/products/{product_id}/integrations`
**Policy:** `ProductPolicy`
### List Product Integration Feeds [](#list-product-integration-feeds)
GET `/fluent-cart/v2/products/{productId}/integrations`
Retrieve all integration feeds configured for a specific product, along with available product-scoped integrations.

- **Permission:** `products/view`
- **Controller:** `ProductIntegrationsController@getFeeds`

#### Parameters [](#parameters-12)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `productId` | integer | path | Yes | The product ID | 
#### Response [](#response-12)
json
```
{
 "feeds": [
 {
 "id": 15,
 "name": "Tag VIP buyers",
 "enabled": "yes",
 "provider": "fluent-crm",
 "feed": {
 "name": "Tag VIP buyers",
 "enabled": "yes",
 "list_id": "3",
 "list_name": "VIP Customers",
 "merge_fields": {},
 "conditional_variation_ids": [101, 102],
 "conditionals": {
 "conditions": [],
 "status": false,
 "type": "all"
 }
 },
 "scope": "product"
 }
 ],
 "available_integrations": {
 "fluent-crm": {
 "title": "FluentCRM",
 "logo": "...",
 "enabled": true,
 "scopes": ["global", "product"]
 }
 },
 "all_module_config_url": "https://example.com/wp-admin/admin.php?page=fluent-cart#/integrations"
}```

#### Example [](#example-12)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/123/integrations" \
 -u "username:app_password"```

### Get Product Integration Settings [](#get-product-integration-settings)
GET `/fluent-cart/v2/products/{product_id}/integrations/{integration_name}/settings`
Retrieve the feed editor settings for a specific integration provider, scoped to a product. Returns form schema, saved values, available shortcodes, and the product's variation list for conditional targeting.

- **Permission:** `products/view`
- **Controller:** `ProductIntegrationsController@getProductIntegrationSettings`

#### Parameters [](#parameters-13)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `product_id` | integer | path | Yes | The product ID | 
| `integration_name` | string | path | Yes | The integration provider key (e.g., `fluent-crm`) | 
| `integration_id` | integer | query | No | The existing feed ID to load for editing. Omit for new feed defaults. | 
#### Response [](#response-13)
json
```
{
 "settings": {
 "conditionals": {
 "conditions": [],
 "status": false,
 "type": "all"
 },
 "enabled": "yes",
 "list_id": "",
 "list_name": "",
 "name": "",
 "merge_fields": {},
 "conditional_variation_ids": []
 },
 "settings_fields": {
 "fields": [
 {
 "key": "name",
 "label": "Feed Name",
 "type": "text",
 "required": true
 }
 ]
 },
 "shortcodes": {},
 "inputs": {},
 "merge_fields": {},
 "product_variations": [
 {
 "id": 101,
 "title": "Basic Plan"
 },
 {
 "id": 102,
 "title": "Pro Plan"
 }
 ],
 "scope": "product"
}```

**Additional Properties (compared to global feed settings):**

| Property | Type | Description | 
| --- | --- | --- |
| `product_variations` | array | List of the product's variations (`id` and `title`), used for targeting specific variations | 
| `scope` | string | Always `product` for this endpoint | 
| `settings.conditional_variation_ids` | array | Array of variation IDs this feed should apply to (empty means all variations) | 
#### Example [](#example-13)
bash
```
# Get defaults for a new product feed
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/123/integrations/fluent-crm/settings" \
 -u "username:app_password"

# Load existing product feed for editing
curl -X GET "https://example.com/wp-json/fluent-cart/v2/products/123/integrations/fluent-crm/settings?integration_id=15" \
 -u "username:app_password"```

### Save Product Integration Feed [](#save-product-integration-feed)
POST `/fluent-cart/v2/products/{product_id}/integrations`
Create a new product-level integration feed or update an existing one. Validates required fields and associates the feed with the specified product.

- **Permission:** `products/edit`
- **Controller:** `ProductIntegrationsController@saveProductIntegration`

#### Parameters [](#parameters-14)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `product_id` | integer | path | Yes | The product ID | 
| `integration_name` | string | body | Yes | The integration provider key (e.g., `fluent-crm`) | 
| `integration_id` | integer | body | No | Existing feed ID to update. Omit to create a new feed. | 
| `integration` | string (JSON) | body | Yes | JSON-encoded feed settings data | 
**The `integration` JSON string should contain:**

| Property | Type | Required | Description | 
| --- | --- | --- | --- |
| `name` | string | Yes | Display name for the feed | 
| `enabled` | string | Yes | Status: `yes` or `no` | 
| `list_id` | string | Varies | Target list ID (provider-specific) | 
| `merge_fields` | object | No | Field mapping configuration | 
| `conditional_variation_ids` | array | No | Array of variation IDs to restrict this feed to. Empty array means all variations. | 
| `conditionals` | object | No | Conditional logic settings | 
#### Response [](#response-14)
json
```
{
 "message": "Integration has been successfully saved",
 "integration_id": 15,
 "integration_name": "fluent-crm",
 "created": true,
 "feedData": {
 "name": "Tag VIP buyers",
 "enabled": "yes",
 "list_id": "3",
 "conditional_variation_ids": [101]
 }
}```

#### Error Response [](#error-response-1)
json
```
{
 "message": "Product not found"
}```
json
```
{
 "message": "Please fill up the required fields:",
 "errors": {
 "name": "Feed Name is required."
 }
}```

#### Example [](#example-14)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/123/integrations" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "integration_name": "fluent-crm",
 "integration": "{\"name\":\"Tag VIP buyers\",\"enabled\":\"yes\",\"list_id\":\"3\",\"conditional_variation_ids\":[101],\"merge_fields\":{},\"conditionals\":{\"conditions\":[],\"status\":false,\"type\":\"all\"}}"
 }'```

### Change Product Feed Status [](#change-product-feed-status)
POST `/fluent-cart/v2/products/{product_id}/integrations/feed/change-status`
Toggle a product-level integration feed on or off.

- **Permission:** `products/edit`
- **Controller:** `ProductIntegrationsController@changeStatus`

#### Parameters [](#parameters-15)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `product_id` | integer | path | Yes | The product ID (from URL) | 
| `product_id` | integer | body | Yes | The product ID (must also be provided in the request body) | 
| `notification_id` | integer | body | Yes | The feed ID to toggle | 
| `status` | string | body | Yes | New status: `yes` (enable) or `no` (disable) | 
#### Response [](#response-15)
json
```
{
 "message": "Integration status has been updated"
}```

#### Error Response [](#error-response-2)
json
```
{
 "message": "Product ID and Notification ID are required"
}```
json
```
{
 "message": "Notification not found"
}```

#### Example [](#example-15)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/products/123/integrations/feed/change-status" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "product_id": 123,
 "notification_id": 15,
 "status": "no"
 }'```

### Delete Product Integration Feed [](#delete-product-integration-feed)
DELETE `/fluent-cart/v2/products/{product_id}/integrations/{integration_id}`
Permanently delete a product-level integration feed.

- **Permission:** `products/delete`
- **Controller:** `ProductIntegrationsController@deleteProductIntegration`

#### Parameters [](#parameters-16)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `product_id` | integer | path | Yes | The product ID | 
| `integration_id` | integer | path | Yes | The feed ID to delete | 
#### Response [](#response-16)
json
```
{
 "message": "Integration deleted successfully"
}```

#### Example [](#example-16)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/products/123/integrations/15" \
 -u "username:app_password"```

---

## Files

Source: https://dev.fluentcart.com/restapi/files.html


Upload, manage, and delete downloadable files. Supports multiple storage drivers including local and cloud storage.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2`
**Policy:** `StoreSensitivePolicy` (file management), `AdminPolicy` (editor file upload)
## File Management [](#file-management)

### List Files [](#list-files)
GET `/fluent-cart/v2/files`
Retrieve a list of files from the specified storage driver. Returns file metadata including name, size, driver, and bucket information.

- **Policy:** `StoreSensitivePolicy`
- **Permission:** `store/sensitive`

#### Parameters [](#parameters)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `driver` | string | query | No | Storage driver to use (default: `local`). Supported values depend on configured storage drivers (e.g., `local`, `s3`). | 
| `search` | string | query | No | Filter files by name (case-insensitive substring match) | 
| `per_page` | integer | query | No | Maximum number of files to return (default: `10`) | 
#### Response [](#response)
json
```
{
 "files": [
 {
 "name": "ebook__fluent-cart__.1710345600.pdf",
 "size": 2048576,
 "driver": "local",
 "bucket": ""
 },
 {
 "name": "software-v2__fluent-cart__.1710345700.zip",
 "size": 10485760,
 "driver": "local",
 "bucket": ""
 }
 ]
}```

#### Example [](#example)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/files?driver=local&search=ebook&per_page=20" \
 -u "username:app_password"```

### Upload File [](#upload-file)
POST `/fluent-cart/v2/files/upload`
Upload a downloadable file to the specified storage driver. The file is stored with a unique name appended with a timestamp to prevent collisions.

- **Policy:** `StoreSensitivePolicy`
- **Permission:** `store/sensitive`
- **Content-Type:** `multipart/form-data`

#### Parameters [](#parameters-1)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `file` | file | body | Yes | The file to upload | 
| `name` | string | body | Yes | Display name for the file (max 160 characters). The file extension is appended automatically from the uploaded file. | 
| `driver` | string | body | No | Storage driver to use (default: `local`) | 
#### Blocked File Extensions [](#blocked-file-extensions)

The following file types are blocked by default for the local driver: `php`, `phtml`, `html`, `htm`, `svg`, `exe`, `sh`, `bat`, `cmd`, `dll`.
This list can be customized via the `fluent_cart/local_file_blocked_extensions` filter.
#### Response [](#response-1)
json
```
{
 "message": "File Uploaded Successfully",
 "path": "my-ebook__fluent-cart__.1710345600.pdf",
 "file": {
 "driver": "local",
 "size": 2048576,
 "name": "my-ebook__fluent-cart__.1710345600.pdf",
 "bucket": ""
 }
}```

#### Error Response [](#error-response)
json
```
{
 "message": "Failed To Upload File",
 "additional": "File is empty"
}```

#### Example [](#example-1)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/files/upload" \
 -u "username:app_password" \
 -F "file=@/path/to/ebook.pdf" \
 -F "name=my-ebook" \
 -F "driver=local"```

### Get Bucket List [](#get-bucket-list)
GET `/fluent-cart/v2/files/bucket-list`
Retrieve the list of available storage buckets for a given driver. Useful for cloud storage drivers (e.g., S3) that organize files into buckets.

- **Policy:** `StoreSensitivePolicy`
- **Permission:** `store/sensitive`

#### Parameters [](#parameters-2)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `driver` | string | query | No | Storage driver to query (default: `""`, uses the first active driver) | 
#### Response [](#response-2)
json
```
{
 "default_bucket": "my-store-files",
 "buckets": [
 {
 "label": "my-store-files",
 "value": "my-store-files"
 },
 {
 "label": "my-store-backups",
 "value": "my-store-backups"
 }
 ]
}```

#### Example [](#example-2)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/files/bucket-list?driver=s3" \
 -u "username:app_password"```

### Delete File [](#delete-file)
DELETE `/fluent-cart/v2/files/delete`
Delete a file from the specified storage driver. For the local driver, this requires the `manage_options` WordPress capability.

- **Policy:** `StoreSensitivePolicy`
- **Permission:** `store/sensitive`

#### Parameters [](#parameters-3)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `file_path` | string | query | Yes | The path of the file to delete (relative to the storage directory) | 
| `driver` | string | query | Yes | Storage driver where the file is stored (e.g., `local`, `s3`) | 
| `bucket` | string | query | No | The bucket name (required for cloud storage drivers) | 
#### Response [](#response-3)
json
```
{
 "message": "File Deleted Successfully",
 "driver": "local",
 "path": "my-ebook__fluent-cart__.1710345600.pdf"
}```

#### Error Responses [](#error-responses)

**File not found:**json
```
{
 "message": "File not found"
}```

**Permission denied (local driver):**json
```
{
 "message": "You are not allowed to delete file"
}```

#### Example [](#example-3)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/files/delete?file_path=my-ebook__fluent-cart__.1710345600.pdf&driver=local" \
 -u "username:app_password"```

## Editor File Upload [](#editor-file-upload)

### Upload Editor File [](#upload-editor-file)
POST `/fluent-cart/v2/upload-editor-file`
Upload an image file for use in the content editor (e.g., product descriptions). The image is uploaded to the WordPress Media Library via `media_handle_upload`. Only image files are accepted.

- **Policy:** `AdminPolicy`
- **Permission:** `is_super_admin`
- **Content-Type:** `multipart/form-data`

#### Parameters [](#parameters-4)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `file` | file | body | Yes | The image file to upload. Must be a valid image MIME type (e.g., `image/jpeg`, `image/png`, `image/gif`, `image/webp`). | 
#### Response [](#response-4)

Returns the WordPress attachment data prepared for JavaScript consumption (via `wp_prepare_attachment_for_js`):json
```
{
 "id": 456,
 "title": "product-banner",
 "filename": "product-banner.jpg",
 "url": "https://example.com/wp-content/uploads/2025/01/product-banner.jpg",
 "link": "https://example.com/?attachment_id=456",
 "alt": "",
 "author": "1",
 "description": "",
 "caption": "",
 "name": "product-banner",
 "status": "inherit",
 "uploadedTo": 0,
 "date": "2025-01-15T12:00:00.000Z",
 "modified": "2025-01-15T12:00:00.000Z",
 "menuOrder": 0,
 "mime": "image/jpeg",
 "type": "image",
 "subtype": "jpeg",
 "icon": "https://example.com/wp-includes/images/media/default.png",
 "dateFormatted": "January 15, 2025",
 "nonces": { ... },
 "editLink": "https://example.com/wp-admin/post.php?post=456&action=edit",
 "meta": false,
 "authorName": "admin",
 "authorLink": "https://example.com/wp-admin/profile.php",
 "filesizeInBytes": 204800,
 "filesizeHumanReadable": "200 KB",
 "sizes": {
 "thumbnail": {
 "url": "https://example.com/wp-content/uploads/2025/01/product-banner-150x150.jpg",
 "height": 150,
 "width": 150
 },
 "medium": {
 "url": "https://example.com/wp-content/uploads/2025/01/product-banner-300x200.jpg",
 "height": 200,
 "width": 300
 },
 "full": {
 "url": "https://example.com/wp-content/uploads/2025/01/product-banner.jpg",
 "height": 800,
 "width": 1200
 }
 },
 "height": 800,
 "width": 1200
}```

#### Error Responses [](#error-responses-1)

**Non-image file:**json
```
{
 "message": "Error Uploading File"
}```

**No file attached:**json
```
{
 "message": "No File Attached"
}```

#### Example [](#example-4)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/upload-editor-file" \
 -u "username:app_password" \
 -F "file=@/path/to/product-banner.jpg"```

---

## Labels & Attributes

Source: https://dev.fluentcart.com/restapi/labels-and-attributes.html


Manage order/customer labels for organization, and product attribute groups and terms for product variations.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2`
## Labels [](#labels)

Labels are tags that can be attached to orders, customers, or other entities for organizational purposes. Each label has a unique `value` (name) and can be associated with multiple entities through a polymorphic relationship.
**Prefix:** `labels`**Policy:** `LabelPolicy`
### List Labels [](#list-labels)
GET `/fluent-cart/v2/labels`
Retrieve all available labels.

- **Permission:** `labels/view`

#### Parameters [](#parameters)

No parameters required.
#### Response [](#response)
json
```
{
 "labels": {
 "labels": [
 {
 "id": 1,
 "value": "VIP"
 },
 {
 "id": 2,
 "value": "Wholesale"
 },
 {
 "id": 3,
 "value": "Priority"
 }
 ]
 }
}```

#### Example [](#example)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/labels" \
 -u "username:app_password"```

### Create Label [](#create-label)
POST `/fluent-cart/v2/labels`
Create a new label and optionally attach it to an entity (order, customer, etc.) in a single request.

- **Permission:** `labels/manage`
- **Request Class:** `LabelRequest`

#### Parameters [](#parameters-1)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `value` | string | body | Yes | The label name. Must be unique across all labels. | 
| `bind_to_type` | string | body | No | The model class name to attach the label to (e.g., `Order`, `Customer`). Short class name or fully-qualified namespace. | 
| `bind_to_id` | string | body | No | The ID of the entity to attach the label to. Required if `bind_to_type` is provided. | 
#### Validation Rules [](#validation-rules)

| Field | Rules | 
| --- | --- |
| `value` | Required, sanitized text, unique in `fct_label` table | 
#### Response [](#response-1)
json
```
{
 "data": {
 "id": 4,
 "value": "Returning Customer"
 },
 "message": "Label created successfully!"
}```

#### Error Response [](#error-response)

**Duplicate label:**json
```
{
 "errors": {
 "value": ["Label must be unique."]
 }
}```

#### Example [](#example-1)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/labels" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "value": "Returning Customer",
 "bind_to_type": "Order",
 "bind_to_id": "42"
 }'```

### Update Label Selections [](#update-label-selections)
POST `/fluent-cart/v2/labels/update-label-selections`
Update the labels attached to a specific entity. This endpoint syncs the label assignments -- labels in `selectedLabels` are attached, and previously attached labels not in the list are detached.

- **Permission:** `labels/manage`

#### Parameters [](#parameters-2)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `bind_to_type` | string | body | Yes | The model class name (e.g., `Order`, `Customer`). Short class name or fully-qualified namespace. | 
| `bind_to_id` | string | body | Yes | The ID of the entity to update labels for | 
| `selectedLabels` | array | body | No | Array of label IDs to attach. Omit or pass empty array to remove all labels. | 
#### Response [](#response-2)
json
```
{
 "message": "Labels Updated Successfully"
}```

#### Error Response [](#error-response-1)
json
```
{
 "message": "Failed To Update Labels"
}```

#### Example [](#example-2)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/labels/update-label-selections" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "bind_to_type": "Order",
 "bind_to_id": "42",
 "selectedLabels": ["1", "3", "4"]
 }'```

## Attribute Groups [](#attribute-groups)

Attribute groups represent product attribute categories (e.g., Color, Size, Material) used to create product variations. Each group contains multiple terms.
**Prefix:** `options/attr`**Policy:** `ProductPolicy`
### List Attribute Groups [](#list-attribute-groups)
GET `/fluent-cart/v2/options/attr/groups`
Retrieve a paginated list of attribute groups with optional search, filtering, and sorting.

- **Permission:** `products/view`

#### Parameters [](#parameters-3)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `search` | object | query | No | Search criteria. Each key is a column name with `column`, `operator`, and `value` fields. Searchable columns: `title`, `slug`. | 
| `filters` | object | query | No | Filter criteria. Same format as `search`. Supports `terms_count` with comparison operators. | 
| `with` | array | query | No | Relations to eager load (e.g., `["terms"]`) | 
| `order_by` | string | query | No | Column to sort by: `title`, `id`, `slug`, `created_at` (default: `title`) | 
| `order_type` | string | query | No | Sort direction: `ASC` or `DESC` (default: `ASC`) | 
| `per_page` | integer | query | No | Number of results per page (default: `10`) | 
| `page` | integer | query | No | Page number for pagination | 
#### Response [](#response-3)
json
```
{
 "groups": {
 "total": 3,
 "per_page": 10,
 "current_page": 1,
 "last_page": 1,
 "data": [
 {
 "id": 1,
 "title": "Color",
 "slug": "color",
 "description": "Product color options",
 "settings": null,
 "created_at": "2025-01-10 08:30:00",
 "updated_at": "2025-01-10 08:30:00",
 "terms_count": 5
 },
 {
 "id": 2,
 "title": "Size",
 "slug": "size",
 "description": "Product size options",
 "settings": null,
 "created_at": "2025-01-10 08:35:00",
 "updated_at": "2025-01-10 08:35:00",
 "terms_count": 4
 }
 ]
 }
}```

#### Example [](#example-3)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/options/attr/groups?with[]=terms&order_by=title&order_type=ASC&per_page=20" \
 -u "username:app_password"```

### Create Attribute Group [](#create-attribute-group)
POST `/fluent-cart/v2/options/attr/group`
Create a new attribute group.

- **Permission:** `products/create`
- **Request Class:** `AttrGroupRequest`

#### Parameters [](#parameters-4)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `title` | string | body | Yes | Group title (max 50 characters). Must be unique. | 
| `slug` | string | body | Yes | Group slug (max 50 characters). Must be unique. Used as an identifier in variation data. | 
| `description` | string | body | No | Group description | 
| `settings` | object | body | No | Additional group settings (stored as JSON) | 
#### Validation Rules [](#validation-rules-1)

| Field | Rules | 
| --- | --- |
| `title` | Required, sanitized text, max 50 chars, unique in `fct_atts_groups` | 
| `slug` | Required, sanitized text, max 50 chars, unique in `fct_atts_groups` | 
| `description` | Nullable, sanitized textarea | 
#### Response [](#response-4)
json
```
{
 "data": {
 "id": 3,
 "title": "Material",
 "slug": "material",
 "description": "Product material type",
 "settings": null,
 "created_at": "2025-01-15 12:00:00",
 "updated_at": "2025-01-15 12:00:00"
 },
 "message": "Successfully created!"
}```

#### Error Response [](#error-response-2)

**Duplicate title or slug:**json
```
{
 "errors": {
 "title": ["Group title can not be empty and must be unique."],
 "slug": ["Group slug can not be empty and must be unique."]
 }
}```

#### Example [](#example-4)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/options/attr/group" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "title": "Material",
 "slug": "material",
 "description": "Product material type"
 }'```

### Get Attribute Group [](#get-attribute-group)
GET `/fluent-cart/v2/options/attr/group/{group_id}`
Retrieve a single attribute group by ID, optionally with its terms.

- **Permission:** `products/view`

#### Parameters [](#parameters-5)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `group_id` | integer | path | Yes | The attribute group ID | 
| `with` | array | query | No | Relations to eager load. Supported: `terms` | 
#### Response [](#response-5)
json
```
{
 "group": {
 "id": 1,
 "title": "Color",
 "slug": "color",
 "description": "Product color options",
 "settings": null,
 "created_at": "2025-01-10 08:30:00",
 "updated_at": "2025-01-10 08:30:00",
 "terms": [
 {
 "id": 1,
 "group_id": 1,
 "title": "Red",
 "slug": "red",
 "serial": 1,
 "description": null,
 "settings": null
 },
 {
 "id": 2,
 "group_id": 1,
 "title": "Blue",
 "slug": "blue",
 "serial": 2,
 "description": null,
 "settings": null
 }
 ]
 }
}```

#### Example [](#example-5)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/options/attr/group/1?with[]=terms" \
 -u "username:app_password"```

### Update Attribute Group [](#update-attribute-group)
PUT `/fluent-cart/v2/options/attr/group/{group_id}`
Update an existing attribute group.

- **Permission:** `products/edit`
- **Request Class:** `AttrGroupRequest`

#### Parameters [](#parameters-6)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `group_id` | integer | path | Yes | The attribute group ID | 
| `title` | string | body | Yes | Updated group title (max 50 characters). Must be unique (excluding the current group). | 
| `slug` | string | body | Yes | Updated group slug (max 50 characters). Must be unique (excluding the current group). | 
| `description` | string | body | No | Updated group description | 
| `settings` | object | body | No | Updated group settings (stored as JSON) | 
#### Response [](#response-6)
json
```
{
 "data": true,
 "message": "Group updated successfully!"
}```

#### Error Response [](#error-response-3)
json
```
{
 "errors": {
 "title": ["Group title can not be empty and must be unique."]
 }
}```

#### Example [](#example-6)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/options/attr/group/1" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "title": "Color Options",
 "slug": "color",
 "description": "Available color options for products"
 }'```

### Delete Attribute Group [](#delete-attribute-group)
DELETE `/fluent-cart/v2/options/attr/group/{group_id}`
Delete an attribute group. The group can only be deleted if none of its terms are currently in use by any product variations. Deleting a group also deletes all its terms.

- **Permission:** `products/delete`

#### Parameters [](#parameters-7)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `group_id` | integer | path | Yes | The attribute group ID to delete | 
#### Response [](#response-7)
json
```
{
 "data": "",
 "message": "Attribute group successfully deleted!"
}```

#### Error Responses [](#error-responses)

**Group is in use:**json
```
{
 "message": "This group is already in use, can not be deleted.",
 "code": 403
}```

**Group not found:**json
```
{
 "message": "Attribute group not found in database, failed to remove.",
 "code": 404
}```

#### Example [](#example-7)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/options/attr/group/3" \
 -u "username:app_password"```

## Attribute Terms [](#attribute-terms)

Attribute terms are the individual values within an attribute group (e.g., "Red", "Blue", "Green" within the "Color" group). Terms are ordered by a `serial` field and are used to define product variation options.
**Prefix:** `options/attr/group/{group_id}`**Policy:** `ProductPolicy`
### List Attribute Terms [](#list-attribute-terms)
GET `/fluent-cart/v2/options/attr/group/{group_id}/terms`
Retrieve a paginated list of terms for a specific attribute group.

- **Permission:** `products/view`

#### Parameters [](#parameters-8)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `group_id` | integer | path | Yes | The attribute group ID | 
| `search` | object | query | No | Search criteria. Each key is a column name with `column`, `operator`, and `value` fields. Searchable columns: `title`, `slug`. | 
| `filters` | object | query | No | Filter criteria. Same format as `search`. Filterable columns: `group_id`, `serial`, `title`, `slug`, `description`, `settings`. | 
| `order_by` | string | query | No | Column to sort by: `id`, `title`, `slug`, `serial`, `created_at` (default: `serial`) | 
| `order_type` | string | query | No | Sort direction: `ASC` or `DESC` (default: `ASC`) | 
| `per_page` | integer | query | No | Number of results per page (default: `15`) | 
| `page` | integer | query | No | Page number for pagination | 
#### Response [](#response-8)
json
```
{
 "terms": {
 "total": 5,
 "per_page": 15,
 "current_page": 1,
 "last_page": 1,
 "data": [
 {
 "id": 1,
 "group_id": 1,
 "serial": 1,
 "title": "Red",
 "slug": "red",
 "description": null,
 "settings": null,
 "created_at": "2025-01-10 08:30:00",
 "updated_at": "2025-01-10 08:30:00"
 },
 {
 "id": 2,
 "group_id": 1,
 "serial": 2,
 "title": "Blue",
 "slug": "blue",
 "description": null,
 "settings": null,
 "created_at": "2025-01-10 08:35:00",
 "updated_at": "2025-01-10 08:35:00"
 }
 ]
 }
}```

#### Example [](#example-8)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/options/attr/group/1/terms?order_by=serial&order_type=ASC" \
 -u "username:app_password"```

### Create Attribute Term [](#create-attribute-term)
POST `/fluent-cart/v2/options/attr/group/{group_id}/term`
Create a new term within an attribute group.

- **Permission:** `products/create`
- **Request Class:** `AttrTermRequest`

#### Parameters [](#parameters-9)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `group_id` | integer | path | Yes | The attribute group ID | 
| `title` | string | body | Yes | Term title (max 50 characters). Must be unique across all terms. | 
| `slug` | string | body | Yes | Term slug (max 50 characters). Must be unique across all terms. Used as an identifier in variation data. | 
| `description` | string | body | No | Term description | 
| `serial` | integer | body | No | Sort order position (default: `10`). Lower values appear first. | 
#### Validation Rules [](#validation-rules-2)

| Field | Rules | 
| --- | --- |
| `title` | Required, sanitized text, max 50 chars, unique in `fct_atts_terms` | 
| `slug` | Required, sanitized text, max 50 chars, unique in `fct_atts_terms` | 
| `description` | Nullable, sanitized textarea | 
| `serial` | Nullable, numeric | 
#### Response [](#response-9)
json
```
{
 "data": {
 "id": 6,
 "group_id": 1,
 "serial": 10,
 "title": "Green",
 "slug": "green",
 "description": null,
 "settings": null,
 "created_at": "2025-01-15 12:00:00",
 "updated_at": "2025-01-15 12:00:00"
 },
 "message": "Successfully created!"
}```

#### Error Responses [](#error-responses-1)

**Group not found:**json
```
{
 "message": "Information mismatch.",
 "code": 404
}```

**Validation error:**json
```
{
 "errors": {
 "title": ["Title is required"],
 "slug": ["Slug is required"]
 }
}```

#### Example [](#example-9)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/options/attr/group/1/term" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "title": "Green",
 "slug": "green",
 "serial": 3
 }'```

### Update Attribute Term [](#update-attribute-term)
POST `/fluent-cart/v2/options/attr/group/{group_id}/term/{term_id}`
Update an existing attribute term.

- **Permission:** `products/edit`
- **Request Class:** `AttrTermRequest`

#### Parameters [](#parameters-10)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `group_id` | integer | path | Yes | The attribute group ID | 
| `term_id` | integer | path | Yes | The term ID to update | 
| `title` | string | body | Yes | Updated term title (max 50 characters). Must be unique (excluding the current term). | 
| `slug` | string | body | Yes | Updated term slug (max 50 characters). Must be unique (excluding the current term). | 
| `description` | string | body | No | Updated term description | 
| `serial` | integer | body | No | Updated sort order position | 
#### Response [](#response-10)
json
```
{
 "data": true,
 "message": "Successfully updated!"
}```

#### Error Response [](#error-response-4)

**Term not found or group mismatch:**json
```
{
 "message": "Information mismatch.",
 "code": 404
}```

#### Example [](#example-10)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/options/attr/group/1/term/6" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "title": "Forest Green",
 "slug": "forest-green",
 "serial": 3,
 "description": "A deep green color"
 }'```

### Delete Attribute Term [](#delete-attribute-term)
DELETE `/fluent-cart/v2/options/attr/group/{group_id}/term/{term_id}`
Delete an attribute term. The term can only be deleted if it is not currently in use by any product variations.

- **Permission:** `products/delete`

#### Parameters [](#parameters-11)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `group_id` | integer | path | Yes | The attribute group ID | 
| `term_id` | integer | path | Yes | The term ID to delete | 
#### Response [](#response-11)
json
```
{
 "data": "",
 "message": "Attribute term successfully deleted!"
}```

#### Error Responses [](#error-responses-2)

**Term is in use:**json
```
{
 "message": "This term is already in use, can not be deleted.",
 "code": 403
}```

**Term not found or group mismatch:**json
```
{
 "message": "Term not found in database, failed to remove.",
 "code": 404
}```

#### Example [](#example-11)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/options/attr/group/1/term/6" \
 -u "username:app_password"```

### Change Term Sort Order [](#change-term-sort-order)
POST `/fluent-cart/v2/options/attr/group/{group_id}/term/{term_id}/serial`
Move a term up or down in the sort order by incrementing or decrementing its `serial` value.

- **Permission:** `products/edit`

#### Parameters [](#parameters-12)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `group_id` | integer | path | Yes | The attribute group ID | 
| `term_id` | integer | path | Yes | The term ID to reorder | 
| `direction` | string | body | No | Direction to move: `up` (decrements serial) or `down` (increments serial). Default: `up`. | 
#### Behavior [](#behavior)

- **`up`** -- Decrements the serial value by 1. If the serial is already `0`, it stays at `0`.
- **`down`** -- Increments the serial value by 1.

#### Response [](#response-12)
json
```
{
 "data": 2,
 "message": "Serial updated."
}```

The `data` field contains the new serial value after the change.
#### Error Response [](#error-response-5)

**Term not found or group mismatch:**json
```
{
 "message": "Info mismatch.",
 "code": 404
}```

#### Example [](#example-12)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/options/attr/group/1/term/2/serial" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "direction": "up"
 }'```

---

## Dashboard

Source: https://dev.fluentcart.com/restapi/dashboard.html


Administrative endpoints for dashboard statistics, onboarding setup, app initialization, activity logging, print templates, and utility functions.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2`
## Dashboard [](#dashboard)

Overview and statistics endpoints for the admin dashboard.
**Prefix:** `dashboard`
### Get Onboarding Data [](#get-onboarding-data)
GET `/fluent-cart/v2/dashboard`
Retrieve the onboarding checklist with completion status for each setup step. Used to display the getting-started wizard on the dashboard.

- **Policy:** `AdminPolicy`

#### Parameters [](#parameters)

No parameters required.
#### Response [](#response)
json
```
{
 "data": {
 "steps": {
 "page_setup": {
 "title": "Setup Pages",
 "text": "Customers to find what they're looking for by organising.",
 "icon": "Cart",
 "completed": false,
 "url": "https://example.com/wp-admin/admin.php?page=fluent-cart#/settings/store-settings/pages_setup"
 },
 "store_info": {
 "title": "Add Details to Store",
 "text": "Store details such as addresses, company info etc.",
 "icon": "StoreIcon",
 "completed": true,
 "url": "https://example.com/wp-admin/admin.php?page=fluent-cart#/settings/store-settings/"
 },
 "product_info": {
 "title": "Add Your First Product",
 "text": "Share your brand story and build trust with customers.",
 "icon": "ShoppingCartIcon",
 "completed": false,
 "url": "https://example.com/wp-admin/admin.php?page=fluent-cart#/products"
 },
 "setup_payments": {
 "title": "Setup Payment Methods",
 "text": "Choose from fast & secure online and offline payment.",
 "icon": "PaymentIcon",
 "completed": true,
 "url": "https://example.com/wp-admin/admin.php?page=fluent-cart#/settings/payments"
 }
 },
 "completed": 2
 }
}```

#### Completion Logic [](#completion-logic)

| Step | Completed When | 
| --- | --- |
| `page_setup` | All generatable pages (shop, checkout, etc.) have page IDs assigned in store settings | 
| `store_info` | Both `store_name` and `store_logo` are set in store settings | 
| `product_info` | At least one product exists in the database | 
| `setup_payments` | At least one payment gateway is enabled | 
#### Example [](#example)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/dashboard" \
 -u "username:app_password"```

### Get Dashboard Stats [](#get-dashboard-stats)
GET `/fluent-cart/v2/dashboard/stats`
Retrieve dashboard statistics widgets including total products, orders, net revenue, and refunds for the last 30 days.

- **Policy:** `DashboardPolicy`
- **Permission:** `dashboard_stats/view`

#### Parameters [](#parameters-1)

No parameters required.
#### Response [](#response-1)
json
```
{
 "stats": [
 {
 "title": "Total Products",
 "current_count": 45,
 "icon": "Frame",
 "url": "https://example.com/wp-admin/admin.php?page=fluent-cart#/products?active_view=all"
 },
 {
 "title": "Orders",
 "current_count": 128,
 "icon": "AllOrdersIcon",
 "url": "https://example.com/wp-admin/admin.php?page=fluent-cart#/orders"
 },
 {
 "title": "Revenue",
 "current_count": 15420.50,
 "icon": "Currency",
 "url": "https://example.com/wp-admin/admin.php?page=fluent-cart#/reports/revenue",
 "has_currency": true
 },
 {
 "title": "Refund",
 "current_count": 350.00,
 "icon": "Failed",
 "url": "https://example.com/wp-admin/admin.php?page=fluent-cart#/reports/refunds",
 "has_currency": true
 }
 ]
}```

INFO

- **Orders, Revenue, and Refunds** are calculated for the last 30 days only (from the start of the day 30 days ago to the end of the current day).
- **Revenue** is net revenue: `total_paid - total_refund - tax_total - shipping_tax`, converted from cents to decimal.
- Orders with `on_hold` or `failed` status are excluded from the calculations.
- **Total Products** counts all products excluding those in `trash` or `auto-draft` status.
- Widgets with `has_currency: true` should be formatted with the store's currency symbol.

#### Example [](#example-1)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/dashboard/stats" \
 -u "username:app_password"```

## Onboarding [](#onboarding)

Endpoints for the initial store setup wizard.
**Prefix:** `onboarding`**Policy:** `AdminPolicy`
### Get Onboarding Settings [](#get-onboarding-settings)
GET `/fluent-cart/v2/onboarding`
Retrieve the current store settings, available pages, and currency options for the onboarding wizard.
#### Parameters [](#parameters-2)

No parameters required.
#### Response [](#response-2)
json
```
{
 "pages": [
 {
 "id": 10,
 "title": "Shop",
 "link": "https://example.com/shop/"
 },
 {
 "id": 12,
 "title": "Checkout",
 "link": "https://example.com/checkout/"
 }
 ],
 "currencies": {
 "USD": "United States Dollar ($)",
 "EUR": "Euro (EUR)",
 "GBP": "British Pound (GBP)"
 },
 "default_settings": {
 "store_name": "My Store",
 "store_logo": "",
 "currency": "USD",
 "shop_page_id": "10",
 "checkout_page_id": "12",
 "customer_profile_page_id": ""
 }
}```

#### Example [](#example-2)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/onboarding" \
 -u "username:app_password"```

### Save Onboarding Settings [](#save-onboarding-settings)
POST `/fluent-cart/v2/onboarding`
Save store settings during the onboarding process. Merges submitted values with existing store settings. If a `category` value is provided, dummy products are created asynchronously.
#### Parameters [](#parameters-3)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `store_name` | string | body | No | The store name | 
| `store_logo` | string | body | No | URL of the store logo | 
| `currency` | string | body | No | Store currency code (e.g., `USD`, `EUR`) | 
| `category` | string | body | No | Product category for generating dummy products. Excluded from saved settings but triggers async dummy product creation. | 
| *...any store setting key* | mixed | body | No | Any valid store settings field | 
#### Response [](#response-3)

**Success:**json
```
{
 "message": "Store has been updated successfully"
}```

**Error:**json
```
{
 "errors": "Failed to update!"
}```

#### Example [](#example-3)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/onboarding" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "store_name": "My Awesome Store",
 "store_logo": "https://example.com/wp-content/uploads/logo.png",
 "currency": "USD"
 }'```

### Create All Pages [](#create-all-pages)
POST `/fluent-cart/v2/onboarding/create-pages`
Create all required store pages (shop, checkout, customer profile, etc.) in bulk. Skips pages that already have valid page IDs assigned. After creation, returns the updated onboarding settings (same response as [Get Onboarding Settings](#get-onboarding-settings)).
#### Parameters [](#parameters-4)

No parameters required.
#### Response [](#response-4)

Same as [Get Onboarding Settings](#get-onboarding-settings) -- returns the updated pages, currencies, and default settings after page creation.
#### Example [](#example-4)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/onboarding/create-pages" \
 -u "username:app_password"```

### Create Single Page [](#create-single-page)
POST `/fluent-cart/v2/onboarding/create-page`
Create a single store page (e.g., shop, checkout, customer profile) and optionally save the page ID to store settings.

- **Request Class:** `CreatePageRequest`

#### Parameters [](#parameters-5)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `content` | string | body | Yes | The page key identifier with `_page_id` suffix (e.g., `shop_page_id`, `checkout_page_id`, `customer_profile_page_id`) | 
| `page_name` | string | body | Yes | The title for the new WordPress page | 
| `save_settings` | boolean | body | No | Whether to save the new page ID to store settings (default: `false`). When `true`, also flushes rewrite rules. | 
#### Response [](#response-5)

**Success:**json
```
{
 "page_id": "156",
 "page_name": "Shop",
 "link": "https://example.com/shop/"
}```

**Error:**json
```
{
 "message": "Unable to create page"
}```

#### Example [](#example-5)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/onboarding/create-page" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "content": "shop_page_id",
 "page_name": "Shop",
 "save_settings": true
 }'```

## App Initialization [](#app-initialization)

Endpoints for initializing the admin SPA and managing media attachments.
**Prefix:** `app`**Policy:** `AdminPolicy`
### Initialize App [](#initialize-app)
GET `/fluent-cart/v2/app/init`
Initialize the admin application by loading REST API configuration, asset URLs, translation strings, and shop configuration. This is the first call made when the admin SPA loads.
#### Parameters [](#parameters-6)

No parameters required.
#### Response [](#response-6)
json
```
{
 "rest": {
 "base_url": "https://example.com/wp-json/",
 "url": "https://example.com/wp-json/fluent-cart/v2/",
 "nonce": "abc123def456",
 "namespace": "fluent-cart",
 "version": "v2"
 },
 "asset_url": "https://example.com/wp-content/plugins/fluent-cart/assets/",
 "trans": {
 "Dashboard": "Dashboard",
 "Products": "Products",
 "Orders": "Orders"
 },
 "shop": {
 "currency": "USD",
 "currency_sign": "$",
 "currency_sign_position": "left",
 "decimal_separator": ".",
 "thousands_separator": ",",
 "number_of_decimals": 2,
 "store_name": "My Store",
 "store_logo": "https://example.com/wp-content/uploads/logo.png"
 }
}```

#### Example [](#example-6)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/app/init" \
 -u "username:app_password"```

### List Attachments [](#list-attachments)
GET `/fluent-cart/v2/app/attachments`
Retrieve all image attachments from the WordPress media library. Used for the media picker in the admin interface.
#### Parameters [](#parameters-7)

No parameters required.
#### Response [](#response-7)

**Success:**json
```
{
 "attachments": [
 {
 "id": 101,
 "title": "product-image",
 "url": "https://example.com/wp-content/uploads/2025/01/product-image.jpg"
 },
 {
 "id": 102,
 "title": "store-logo",
 "url": "https://example.com/wp-content/uploads/2025/01/store-logo.png"
 }
 ]
}```

**No images found:**json
```
{
 "message": "No Images Found"
}```

#### Example [](#example-7)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/app/attachments" \
 -u "username:app_password"```

### Upload Attachment [](#upload-attachment)
POST `/fluent-cart/v2/app/upload-attachments`
Upload an image file to the WordPress media library.
#### Parameters [](#parameters-8)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `file` | file | multipart | Yes | Image file to upload. Only image MIME types are accepted. | 
#### Response [](#response-8)

**Success:**json
```
{
 "id": 103,
 "title": "new-product-photo",
 "url": "https://example.com/wp-content/uploads/2025/01/new-product-photo.jpg"
}```

**Invalid file type:**json
```
{
 "error": "Error Uploading File"
}```

**No file attached:**json
```
{
 "message": "No File Attached"
}```

#### Example [](#example-8)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/app/upload-attachments" \
 -u "username:app_password" \
 -F "file=@/path/to/image.jpg"```

## Activity Log [](#activity-log)

Endpoints for managing system activity logs. Activities track events like order status changes, payment events, API calls, and system errors.
**Prefix:** `activity`**Policy:** `AdminPolicy`
### List Activities [](#list-activities)
GET `/fluent-cart/v2/activity`
Retrieve a paginated list of activity log entries with filtering and sorting support.
#### Parameters [](#parameters-9)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `search` | string | query | No | Search by ID (prefix with ``), title, content, or module name | 
| `active_view` | string | query | No | Filter by tab: `success`, `warning`, `error`, `failed`, `info`, `api` | 
| `sort_by` | string | query | No | Column to sort by (default: `id`) | 
| `sort_type` | string | query | No | Sort direction: `asc` or `desc` (default: `desc`) | 
| `per_page` | integer | query | No | Results per page, max `200` (default: `10`) | 
| `page` | integer | query | No | Page number for pagination | 
| `filter_type` | string | query | No | Filter mode: `simple` or `advanced` (default: `simple`) | 
| `advanced_filters` | string (JSON) | query | No | JSON-encoded advanced filter groups (requires `filter_type=advanced` and Pro) | 
#### Active View Tabs [](#active-view-tabs)

| Tab | Column Filtered | Description | 
| --- | --- | --- |
| `success` | `status` | Successful operations | 
| `warning` | `status` | Warning events | 
| `error` | `status` | Error events | 
| `failed` | `status` | Failed operations | 
| `info` | `status` | Informational entries | 
| `api` | `log_type` | API call logs | 
#### Response [](#response-9)
json
```
{
 "activities": {
 "total": 156,
 "per_page": 10,
 "current_page": 1,
 "last_page": 16,
 "data": [
 {
 "id": 42,
 "title": "Order #1024 status changed",
 "content": "Order status changed from pending to completed",
 "status": "success",
 "log_type": "activity",
 "module_name": "orders",
 "read_status": "unread",
 "created_at": "2025-06-15 14:30:00",
 "updated_at": "2025-06-15 14:30:00"
 }
 ]
 }
}```

#### Example [](#example-9)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/activity?active_view=error&per_page=20&sort_type=desc" \
 -u "username:app_password"```

### Delete Activity [](#delete-activity)
DELETE `/fluent-cart/v2/activity/{id}`
Delete a specific activity log entry.
#### Parameters [](#parameters-10)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The activity log entry ID | 
#### Response [](#response-10)

**Success:**json
```
{
 "message": "Activity Deleted Successfully"
}```

**Error:**json
```
{
 "message": "Activity not found"
}```

#### Example [](#example-10)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/activity/42" \
 -u "username:app_password"```

### Mark Activity Read/Unread [](#mark-activity-read-unread)
PUT `/fluent-cart/v2/activity/{id}/mark-read`
Toggle the read status of an activity log entry.
#### Parameters [](#parameters-11)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The activity log entry ID | 
| `status` | string | body | Yes | New read status: `read` or `unread` | 
#### Response [](#response-11)

**Marked as read:**json
```
{
 "message": "Activity Marked as Read"
}```

**Marked as unread:**json
```
{
 "message": "Activity Marked as Unread"
}```

#### Example [](#example-11)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/activity/42/mark-read" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{"status": "read"}'```

## Notes [](#notes)

Endpoints for managing order notes.
**Prefix:** `notes`**Policy:** `AdminPolicy`
### Attach Note to Order [](#attach-note-to-order)
POST `/fluent-cart/v2/notes/attach`
Add or update a note on an order. The note is stored directly on the order record.
#### Parameters [](#parameters-12)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order_id` | integer | body | Yes | The order ID to attach the note to | 
| `note` | string | body | Yes | The note content (sanitized as text field) | 
#### Response [](#response-12)

**Success:**json
```
{
 "message": "Order Note Updated successfully."
}```

**Error:**json
```
{
 "message": "Failed to update order note."
}```

#### Example [](#example-12)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/notes/attach" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "order_id": 1024,
 "note": "Customer requested express shipping. Upgraded at no charge."
 }'```

## Print Templates [](#print-templates)

Endpoints for managing invoice, packing slip, and other print templates.
**Prefix:** `templates`**Policy:** `AdminPolicy`
### Get Print Templates [](#get-print-templates)
GET `/fluent-cart/v2/templates/print-templates`
Retrieve all available print templates. Returns saved custom templates or falls back to default templates.
#### Parameters [](#parameters-13)

No parameters required.
#### Available Templates [](#available-templates)

| Key | Title | 
| --- | --- |
| `invoice_template` | Invoice Template | 
| `packing_slip` | Packing Slip Template | 
| `delivery_slip` | Delivery Slip Template | 
| `shipping_slip` | Shipping Slip Template | 
| `dispatch_slip` | Dispatch Slip Template | 
#### Response [](#response-13)
json
```
{
 "templates": [
 {
 "key": "invoice_template",
 "title": "Invoice Template",
 "content": "<html>...invoice HTML template with shortcodes...</html>"
 },
 {
 "key": "packing_slip",
 "title": "Packing Slip Template",
 "content": "<html>...packing slip HTML template...</html>"
 },
 {
 "key": "delivery_slip",
 "title": "Delivery Slip Template",
 "content": "<html>...delivery slip HTML template...</html>"
 },
 {
 "key": "shipping_slip",
 "title": "Shipping Slip Template",
 "content": "<html>...shipping slip HTML template...</html>"
 },
 {
 "key": "dispatch_slip",
 "title": "Dispatch Slip Template",
 "content": "<html>...dispatch slip HTML template...</html>"
 }
 ]
}```

#### Example [](#example-13)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/templates/print-templates" \
 -u "username:app_password"```

### Save Print Templates [](#save-print-templates)
PUT `/fluent-cart/v2/templates/print-templates`
Save customized print templates. Each template's content is sanitized with `wp_kses_post` before saving.
#### Parameters [](#parameters-14)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `templates` | array | body | Yes | Array of template objects to save | 
| `templates[].key` | string | body | Yes | Template identifier (e.g., `invoice_template`, `packing_slip`) | 
| `templates[].content` | string | body | Yes | HTML template content with shortcodes | 
#### Response [](#response-14)
json
```
{
 "message": "Template saved successfully"
}```

#### Example [](#example-14)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/templates/print-templates" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "templates": [
 {
 "key": "invoice_template",
 "content": "<html><body><h1>Invoice #{order_id}</h1>...</body></html>"
 }
 ]
 }'```

## Widgets [](#widgets)

Dynamic widget data endpoint for contextual UI components.
### Get Widgets [](#get-widgets)
GET `/fluent-cart/v2/widgets`
Retrieve dynamic widget data for a specific context. Widgets are loaded via WordPress filters (`fluent_cart/widgets/{filter}`), allowing modules and extensions to register custom widgets.

- **Policy:** `OrderPolicy`
- **Permission:** `customers/view` OR `orders/view` (any)

#### Parameters [](#parameters-15)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `filter` | string | query | No | Widget context identifier (the `fluent_cart_` prefix is automatically stripped). Example: `single_order_page` | 
| `data` | object | query | No | Additional context data passed to the widget filter. For `single_order_page`, must include `order_id`. | 
#### Response [](#response-15)
json
```
{
 "widgets": [
 {
 "title": "Customer Lifetime Value",
 "value": "$1,250.00",
 "type": "stat"
 }
 ]
}```

**Order not found (when filter is `single_order_page`):**json
```
{
 "message": "Order not found"
}```

#### Example [](#example-15)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/widgets?filter=single_order_page&data[order_id]=1024" \
 -u "username:app_password"```

## Address Info [](#address-info)

Endpoints for retrieving country and state/province data for address forms.
**Prefix:** `address-info`**Policy:** `UserPolicy`
### List Countries [](#list-countries)
GET `/fluent-cart/v2/address-info/countries`
Retrieve a list of all available countries formatted as select options.
#### Parameters [](#parameters-16)

No parameters required.
#### Response [](#response-16)
json
```
{
 "data": [
 {
 "label": "United States",
 "value": "US"
 },
 {
 "label": "United Kingdom",
 "value": "GB"
 },
 {
 "label": "Canada",
 "value": "CA"
 }
 ]
}```

#### Example [](#example-16)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/address-info/countries" \
 -u "username:app_password"```

### Get Country Info [](#get-country-info)
GET `/fluent-cart/v2/address-info/get-country-info`
Retrieve detailed information for a specific country including states/provinces and address locale formatting rules. Can identify the country from either a country code or a timezone string.
#### Parameters [](#parameters-17)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `country_code` | string | query | Conditional | Two-letter ISO country code (e.g., `US`, `GB`). Required if `timezone` is not provided. | 
| `timezone` | string | query | Conditional | IANA timezone string (e.g., `America/New_York`). Used to guess the country. Takes priority over `country_code`. | 
#### Response [](#response-17)
json
```
{
 "country_code": "US",
 "country_name": "United States",
 "states": [
 {
 "label": "Alabama",
 "value": "AL"
 },
 {
 "label": "Alaska",
 "value": "AK"
 },
 {
 "label": "California",
 "value": "CA"
 }
 ],
 "address_locale": {
 "state": {
 "label": "State",
 "required": true
 },
 "postcode": {
 "label": "ZIP Code",
 "required": true
 },
 "city": {
 "label": "City",
 "required": true
 }
 }
}```

INFO
The `address_locale` object provides localized field labels and requirements that vary by country. For example, the UK uses "Postcode" while the US uses "ZIP Code", and some countries do not require a state/province field.
#### Example [](#example-17)
bash
```
# By country code
curl -X GET "https://example.com/wp-json/fluent-cart/v2/address-info/get-country-info?country_code=US" \
 -u "username:app_password"

# By timezone
curl -X GET "https://example.com/wp-json/fluent-cart/v2/address-info/get-country-info?timezone=America/New_York" \
 -u "username:app_password"```

## Advanced Filters [](#advanced-filters)

Endpoints for retrieving filter options used by the advanced filter UI across orders, customers, products, and labels.
**Prefix:** `advance_filter`**Policy:** `OrderPolicy`
### Get Filter Options [](#get-filter-options)
GET `/fluent-cart/v2/advance_filter/get-filter-options`
Retrieve dynamic filter options for the advanced filter dropdowns. Supports loading product variations, labels, and extensible custom data keys via WordPress filters.

- **Permission:** `orders/view` OR `customers/view` OR `products/view` OR `labels/view` (any)

#### Parameters [](#parameters-18)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `remote_data_key` | string | query | Yes | The type of filter options to retrieve. Built-in values: `product_variations`, `labels`. Custom values are resolved via the `fluent_cart/advanced_filter_options_{key}` filter. | 
| `search` | string | query | No | Search query to filter options | 
| `include_ids` | array/string | query | No | Specific IDs to include in results | 
| `limit` | integer | query | No | Maximum number of options to return | 
#### Response [](#response-18)
json
```
{
 "options": [
 {
 "id": 1,
 "title": "Premium T-Shirt - Small / Red",
 "children": [
 {
 "id": 10,
 "title": "Small / Red"
 },
 {
 "id": 11,
 "title": "Medium / Blue"
 }
 ]
 }
 ]
}```

INFO
When `remote_data_key` is `product_variations`, options are returned as a tree structure with products as parents and their variations as children. For `labels`, options are returned as a flat list of label objects.
#### Example [](#example-18)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/advance_filter/get-filter-options?remote_data_key=product_variations&search=shirt&limit=20" \
 -u "username:app_password"```

### Get Search Options [](#get-search-options)
GET `/fluent-cart/v2/forms/search_options`
Retrieve dynamic search/autocomplete options for form fields. Options are resolved via the `fluent_cart/get_dynamic_search_{search_for}` WordPress filter, allowing modules to provide context-specific search data.

- **Policy:** `AdminPolicy`
- **Permission:** `super_admin`

#### Parameters [](#parameters-19)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `search_for` | string | query | Yes | The type of search options to retrieve (used as the filter key suffix) | 
| `search_by` | string | query | No | Additional search context or query string passed to the filter | 
#### Response [](#response-19)
json
```
{
 "options": [
 {
 "id": "option_1",
 "label": "Option Label",
 "value": "option_value"
 }
 ]
}```

#### Example [](#example-19)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/forms/search_options?search_for=products&search_by=shirt" \
 -u "username:app_password"```

---

## Public Shop

Source: https://dev.fluentcart.com/restapi/public-shop.html


Public endpoints for browsing the product catalog, viewing products, and searching. No authentication required.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2/public`
**Policy:** `PublicPolicy` (no authentication required)
## List Products [](#list-products)
GET `/fluent-cart/v2/public/products`
Retrieve a paginated list of published products with optional filtering by taxonomy terms, price range, product type, and more. Only products with `publish` status are returned. Product `post_content` and sensitive detail fields (`item_cost`, `editing_stage`, `stock`, `manage_stock`, `manage_cost`, `settings`) are hidden from the response.
#### Parameters [](#parameters)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `per_page` | integer | query | No | Number of products per page (default: `10`) | 
| `current_page` | integer | query | No | Page number for offset-based pagination | 
| `cursor` | string | query | No | Cursor token for cursor-based pagination | 
| `paginate_using` | string | query | No | Pagination strategy: `cursor` for cursor-based, omit for offset-based | 
| `order_type` | string | query | No | Sort direction: `ASC` or `DESC` (default: `DESC`) | 
| `with` | array | query | No | Relations to eager load (e.g., `["detail"]`) | 
| `allow_out_of_stock` | boolean | query | No | Include out-of-stock products (default: `false`) | 
| `include_ids` | array | query | No | Only return products with these IDs (max 100 IDs) | 
| `exclude_ids` | array | query | No | Exclude products with these IDs (max 100 IDs) | 
| `product_type` | string | query | No | Filter by product type. Values: `physical`, `digital`, `subscription`, `onetime`, `simple`, `simple_variations` | 
| `on_sale` | boolean | query | No | Only return products currently on sale (compare price > item price) | 
| `default_filters` | object | query | No | Shortcode-level filters applied as defaults (see filter fields below) | 
| `filters` | object | query | No | Interactive user-applied filters (override defaults). See filter fields below | 
#### Filter Fields (within `default_filters` and `filters`) [](#filter-fields-within-default-filters-and-filters)

| Field | Type | Description | 
| --- | --- | --- |
| `wildcard` | string | Search by product title | 
| `enable_wildcard_for_post_content` | integer | Set to `1` to also search product content | 
| `sort_by` | string | Sort preset: `name-asc`, `name-desc`, `price-low`, `price-high`, `date-newest`, `date-oldest` | 
| `price_range_from` | float | Minimum price filter (in decimal, e.g., `10.00`) | 
| `price_range_to` | float | Maximum price filter (in decimal, e.g., `99.99`) | 
| `{taxonomy_slug}` | string/array | Filter by taxonomy term IDs (e.g., `product-categories`) | 
#### Response [](#response)
json
```
{
 "products": {
 "products": {
 "total": 24,
 "per_page": 10,
 "current_page": 1,
 "last_page": 3,
 "data": [
 {
 "ID": 42,
 "post_title": "Premium T-Shirt",
 "post_status": "publish",
 "post_excerpt": "High-quality cotton t-shirt",
 "guid": "https://example.com/?p=42",
 "view_url": "https://example.com/product/premium-t-shirt",
 "has_subscription": false,
 "thumbnail": "https://example.com/wp-content/uploads/tshirt.jpg",
 "detail": {
 "id": 15,
 "post_id": 42,
 "variation_type": "simple",
 "min_price": 2500,
 "max_price": 2500,
 "fulfillment_type": "physical"
 }
 }
 ]
 },
 "total": 24
 }
}```

INFO
Product prices (`min_price`, `max_price`) are returned in **cents** (integer). Divide by 100 to get the decimal amount.
#### Example [](#example)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/public/products?per_page=12&filters[sort_by]=price-low&filters[price_range_from]=10&filters[price_range_to]=50"```

## Get Product Views (HTML) [](#get-product-views-html)
GET `/fluent-cart/v2/public/product-views`
Retrieve server-rendered HTML views of product listings. Used by Gutenberg blocks and shortcodes for AJAX-powered product grids. Returns pre-rendered HTML along with pagination metadata, eliminating the need for client-side template rendering.
#### Parameters [](#parameters-1)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `per_page` | integer | query | No | Number of products per page (default: `10`) | 
| `current_page` | integer | query | No | Current page number (default: `1`) | 
| `template_provider` | string | query | No | Template provider identifier for custom rendering via the `fluent_cart/products_views/preload_collection_{provider}` filter | 
| `client_id` | string | query | No | Client identifier used to retrieve cached block markup from transients | 
| *...all parameters from [List Products](#list-products)* | | | | All product filtering parameters are also supported | 
#### Response [](#response-1)

When a template provider or cached markup is available:json
```
{
 "products": {
 "views": "<div class=\"fct-product-card\">...rendered HTML...</div>",
 "current_page": 1,
 "last_page": 3,
 "total": 24,
 "per_page": 10,
 "from": 1,
 "to": 10
 }
}```

When falling back to default rendering:json
```
{
 "products": {
 "views": "<div class=\"fct-product-card\">...rendered HTML...</div>",
 "total": 24,
 "last_page": 3,
 "per_page": 10,
 "from": 1,
 "to": 10,
 "page": 1,
 "current_page": 1
 }
}```

#### Rendering Priority [](#rendering-priority)

The endpoint uses the following priority to determine how products are rendered:

- **Template Provider** -- If `template_provider` is set, the `fluent_cart/products_views/preload_collection_{provider}` filter is called. If a view is returned, it is used immediately.
- **Cached Block Markup** -- If `client_id` is set and a matching transient exists (`fct_product_loop_client_{client_id}`), the cached Gutenberg block markup is processed with `do_blocks()`.
- **Default Renderer** -- Falls back to `ProductListRenderer` for standard server-side rendering.

#### Example [](#example-1)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/public/product-views?per_page=12&current_page=2&filters[sort_by]=date-newest"```

## Search Products [](#search-products)
GET `/fluent-cart/v2/public/product-search`
Search for published products by title and return server-rendered HTML search result items. Designed for use with the storefront search bar component.
#### Parameters [](#parameters-2)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `post_title` | string | query | Yes | The search query string to match against product titles | 
| `url_mode` | string | query | No | URL mode passed to the `SearchBarRenderer` to control how product links are generated | 
| `termId` | integer | query | No | Filter search results to products within a specific taxonomy term (category) ID | 
#### Response [](#response-2)
json
```
{
 "htmlView": "<div class=\"fct-search-result-item\"><a href=\"https://example.com/product/premium-t-shirt\">Premium T-Shirt</a></div>..."
}```

INFO
The response contains pre-rendered HTML for direct insertion into the search results dropdown. The HTML structure is generated by `SearchBarRenderer` and includes product titles, links, and taxonomy term badges.
#### Example [](#example-2)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/public/product-search?post_title=shirt&termId=5"```

---

## Checkout

Source: https://dev.fluentcart.com/restapi/checkout.html


Handle the checkout process including placing orders, retrieving checkout summaries, shipping method availability, and user login.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2`
**Policy:** `PublicPolicy` (no authentication required for most endpoints)
These are public-facing endpoints used by the storefront checkout flow. All monetary values are in **cents** (e.g., `$10.00` = `1000`).
## Checkout [](#checkout)

### Place Order [](#place-order)
POST `/fluent-cart/v2/checkout/place-order`
Submit a checkout order with billing/shipping details and payment method. This endpoint validates the cart, creates a customer (or matches an existing one), creates a draft order, and initiates the payment flow with the selected gateway.

- **Authentication:** Optional (logged-in users have their email and name auto-populated)
- **Rate Limit:** 5 requests per 60 seconds per IP/user

#### Parameters [](#parameters)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `billing_email` | string | body | Yes | Customer email address. Auto-populated for logged-in users | 
| `billing_full_name` | string | body | Conditional | Full name of the customer. Required when the store uses full name mode. Auto-populated for logged-in users if available | 
| `billing_first_name` | string | body | Conditional | Customer first name. Required when the store uses separate first/last name mode | 
| `billing_last_name` | string | body | Conditional | Customer last name. Required when the store uses separate name mode and last name is configured as required | 
| `billing_country` | string | body | Conditional | ISO country code (e.g., `US`, `GB`). Required based on checkout field configuration. Defaults to store country if not provided | 
| `billing_address_1` | string | body | Conditional | Street address line 1. Required based on checkout field configuration | 
| `billing_address_2` | string | body | No | Street address line 2 (apt, suite, unit) | 
| `billing_city` | string | body | Conditional | City name. Required based on checkout field configuration | 
| `billing_state` | string | body | Conditional | State/province code. Required if the selected country has states | 
| `billing_postcode` | string | body | Conditional | Postal/ZIP code. Required based on checkout field configuration | 
| `billing_phone` | string | body | No | Phone number | 
| `billing_tax_id` | string | body | No | Customer tax ID / VAT number | 
| `billing_address_id` | integer | body | No | ID of a saved customer billing address (for returning customers) | 
| `ship_to_different` | string | body | No | Set to `yes` to use a different shipping address. Default: `no` | 
| `shipping_full_name` | string | body | Conditional | Shipping recipient name. Required when `ship_to_different` is `yes` | 
| `shipping_country` | string | body | Conditional | Shipping country code. Required when `ship_to_different` is `yes` | 
| `shipping_address_1` | string | body | Conditional | Shipping street address. Required when `ship_to_different` is `yes` | 
| `shipping_address_2` | string | body | No | Shipping address line 2 | 
| `shipping_city` | string | body | Conditional | Shipping city. Required when `ship_to_different` is `yes` | 
| `shipping_state` | string | body | Conditional | Shipping state/province code | 
| `shipping_postcode` | string | body | Conditional | Shipping postal code | 
| `shipping_phone` | string | body | No | Shipping phone number | 
| `shipping_address_id` | integer | body | No | ID of a saved customer shipping address | 
| `fc_selected_shipping_method` | integer | body | Conditional | ID of the selected shipping method. Required for orders containing physical products | 
| `payment_method` | string | body | Yes | Payment gateway slug (e.g., `stripe`, `paypal`, `cod`, `square`) | 
| `order_notes` | string | body | No | Optional order notes from the customer. Max 200 characters | 
| `agree_terms` | string | body | Conditional | Terms agreement flag. Required if terms acceptance is enabled in store settings | 
| `allow_create_account` | string | body | No | Set to `yes` to create a WordPress user account (when store setting is `user_choice`) | 
| `user_tz` | string | body | No | Customer timezone (e.g., `America/New_York`). Default: `UTC` | 
#### Response (Success — 200) [](#response-success-—-200)

The response varies by payment gateway. Common patterns include:
**Redirect-based gateways** (PayPal, hosted Stripe checkout):json
```
{
 "status": "success",
 "redirect_url": "https://checkout.stripe.com/pay/cs_...",
 "message": "Order placed successfully"
}```

**On-site gateways** (Stripe Elements):json
```
{
 "status": "success",
 "payment_args": {
 "client_secret": "pi_..._secret_...",
 "checkout_mode": "onsite"
 },
 "order_id": 42,
 "message": "Order placed successfully"
}```

**Free / COD orders:**json
```
{
 "status": "success",
 "redirect_url": "https://your-site.com/checkout/order-received/?order=abc123",
 "message": "Order placed successfully"
}```

#### Error Responses [](#error-responses)

**Empty/completed cart (200):**json
```
{
 "status": "failed",
 "message": "Cart is empty or already completed"
}```

**Validation errors (200):**json
```
{
 "status": "failed",
 "errors": {
 "billing_email": {
 "invalid": "Email must be a valid email address."
 },
 "billing_country": {
 "required": "Country is required."
 },
 "shipping_method": {
 "required": "You must select a shipping method."
 }
 }
}```

**Product validation failure (422):**json
```
{
 "message": "Product is out of stock"
}```

**Duplicate order (200):**json
```
{
 "status": "failed",
 "message": "You have already completed this order."
}```

**Rate limit exceeded (429):**json
```
{
 "message": "Too many requests. Please try again later."
}```

#### Example [](#example)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/checkout/place-order" \
 -H "Content-Type: application/json" \
 -H "X-WP-Nonce: your_nonce_here" \
 -d '{
 "billing_email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "billing_full_name": "John Doe",
 "billing_country": "US",
 "billing_address_1": "123 Main St",
 "billing_city": "New York",
 "billing_state": "NY",
 "billing_postcode": "10001",
 "payment_method": "stripe",
 "user_tz": "America/New_York"
 }'```

### Get Order Info [](#get-order-info)
GET `/fluent-cart/v2/checkout/get-order-info`
Retrieve payment-gateway-specific order information needed by the frontend to initialize payment UI elements. This is typically called after the checkout page loads to set up payment forms (e.g., Stripe Elements configuration, PayPal button setup).

- **Authentication:** Optional

#### Parameters [](#parameters-1)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `method` | string | query | Yes | Payment gateway slug (e.g., `stripe`, `paypal`, `square`, `airwallex`) | 
#### Response (Success — 200) [](#response-success-—-200-1)

The response structure is gateway-specific. Example for Stripe:
**Stripe (hosted mode):**json
```
{
 "status": "success",
 "message": "Order info retrieved!",
 "data": [],
 "payment_args": {
 "checkout_mode": "hosted"
 }
}```

**Stripe (on-site mode):**json
```
{
 "status": "success",
 "message": "Order info retrieved!",
 "data": {
 "client_secret": "seti_..._secret_...",
 "publishable_key": "pk_live_..."
 },
 "payment_args": {
 "checkout_mode": "onsite",
 "appearance": {
 "theme": "stripe"
 }
 }
}```

#### Example [](#example-1)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/checkout/get-order-info?method=stripe"```

### Get Checkout Summary [](#get-checkout-summary)
GET `/fluent-cart/v2/checkout/get-checkout-summary-view`
Retrieve a rendered HTML summary of the current cart along with pricing totals. Used to dynamically update the checkout page when the customer changes shipping methods or other options.

- **Authentication:** Optional (cart is identified by session/cookie)

#### Parameters [](#parameters-2)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `shipping_method_id` | integer | query | No | ID of the selected shipping method to include its charge in the totals | 
#### Response (Success — 200) [](#response-success-—-200-2)
json
```
{
 "items": {
 "views": "<div class=\"fct-checkout-items\">...rendered HTML...</div>",
 "subtotal": "$50.00",
 "has_subscriptions": false,
 "shipping_charge": 500,
 "unformatted_total": 5500,
 "total": "$55.00",
 "shipping_charge_formated": "$5.00",
 "shipping_method_id": "3"
 }
}```

#### Response Fields [](#response-fields)

| Field | Type | Description | 
| --- | --- | --- |
| `items.views` | string (HTML) | Server-rendered HTML of the cart item list for the checkout page | 
| `items.subtotal` | string | Formatted subtotal of all cart items (before shipping) | 
| `items.has_subscriptions` | boolean | Whether the cart contains subscription products | 
| `items.shipping_charge` | integer | Shipping charge in cents | 
| `items.unformatted_total` | integer | Grand total in cents (subtotal + shipping) | 
| `items.total` | string | Formatted grand total string | 
| `items.shipping_charge_formated` | string | Formatted shipping charge string | 
| `items.shipping_method_id` | string | The shipping method ID used for calculation | 
#### Example [](#example-2)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/checkout/get-checkout-summary-view?shipping_method_id=3"```

### Get Available Shipping Methods [](#get-available-shipping-methods)
GET `/fluent-cart/v2/checkout/get-available-shipping-methods`
Retrieve shipping methods available for a given country and state. The country can be auto-detected from the customer's timezone or provided directly via country code.

- **Authentication:** Not required

#### Parameters [](#parameters-3)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `timezone` | string | query | Conditional | IANA timezone string (e.g., `America/New_York`, `Europe/London`). Used to auto-detect the country. Either `timezone` or `country_code` must be provided | 
| `country_code` | string | query | Conditional | ISO 3166-1 alpha-2 country code (e.g., `US`, `GB`). Used when `timezone` is not provided | 
| `state` | string | query | No | State/province code to further filter applicable shipping methods | 
#### Response (Success — 200) [](#response-success-—-200-3)
json
```
{
 "available_shipping_methods": [
 {
 "id": 1,
 "title": "Standard Shipping",
 "charge_type": "flat_rate",
 "charge_amount": 500,
 "status": "active",
 "countries": ["US", "CA"],
 "states": []
 },
 {
 "id": 2,
 "title": "Express Shipping",
 "charge_type": "flat_rate",
 "charge_amount": 1500,
 "status": "active",
 "countries": ["US"],
 "states": ["NY", "CA"]
 }
 ],
 "country_code": "US"
}```

#### Error Responses [](#error-responses-1)

**Missing country (200):**json
```
{
 "status": false,
 "message": "Country code is required"
}```

**No methods available (200):**json
```
{
 "status": false,
 "country_code": "XX",
 "view": "<div class=\"fct-empty-state\">No shipping methods available for this address.</div>"
}```

**Note:** When the current user is a WordPress admin, the `view` field in the "no methods" response includes a link to the shipping settings page.
#### Example [](#example-3)
bash
```
# Using timezone auto-detection
curl -X GET "https://example.com/wp-json/fluent-cart/v2/checkout/get-available-shipping-methods?timezone=America/New_York"

# Using explicit country code
curl -X GET "https://example.com/wp-json/fluent-cart/v2/checkout/get-available-shipping-methods?country_code=US&state=NY"```

### Get Shipping Methods List View [](#get-shipping-methods-list-view)
GET `/fluent-cart/v2/checkout/get-shipping-methods-list-view`
Retrieve a server-rendered HTML view of available shipping methods for the checkout page. This endpoint wraps `get-available-shipping-methods` and returns a pre-rendered HTML list suitable for direct insertion into the checkout form.

- **Authentication:** Not required

#### Parameters [](#parameters-4)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `timezone` | string | query | Conditional | IANA timezone string (e.g., `America/New_York`). Used to auto-detect the country. Either `timezone` or `country_code` must be provided | 
| `country_code` | string | query | Conditional | ISO 3166-1 alpha-2 country code (e.g., `US`, `GB`). Used when `timezone` is not provided | 
| `state` | string | query | No | State/province code to further filter applicable shipping methods | 
#### Response (Success — 200) [](#response-success-—-200-4)
json
```
{
 "data": {
 "status": true,
 "view": "<div class=\"fct-shipping-methods\">...rendered shipping method list HTML...</div>",
 "country_code": "US"
 }
}```

#### Error Responses [](#error-responses-2)

Returns the same error responses as [Get Available Shipping Methods](#get-available-shipping-methods) when no country is provided or no methods are available for the given location.
**No methods available (200):**json
```
{
 "status": false,
 "country_code": "XX",
 "view": "<div class=\"fct-empty-state\">No shipping methods available for this address.</div>"
}```

#### Example [](#example-4)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/checkout/get-shipping-methods-list-view?country_code=US&state=CA"```

### Get Country Info [](#get-country-info)
GET `/fluent-cart/v2/checkout/get-country-info`
Retrieve localization details for a country including available states/provinces and address field configuration. Used by the checkout form to dynamically adjust address fields based on the selected country.

- **Authentication:** Not required

#### Parameters [](#parameters-5)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `timezone` | string | query | Conditional | IANA timezone string (e.g., `Asia/Tokyo`). Used to auto-detect the country. Either `timezone` or `country_code` must be provided | 
| `country_code` | string | query | Conditional | ISO 3166-1 alpha-2 country code (e.g., `US`, `JP`). Used when `timezone` is not provided | 
#### Response (Success — 200) [](#response-success-—-200-5)
json
```
{
 "data": {
 "country_code": "US",
 "states": [
 { "label": "Alabama", "value": "AL" },
 { "label": "Alaska", "value": "AK" },
 { "label": "California", "value": "CA" },
 { "label": "New York", "value": "NY" }
 ],
 "address_locale": {
 "state": {
 "label": "State",
 "required": true
 },
 "postcode": {
 "label": "ZIP Code",
 "required": true
 },
 "city": {
 "label": "City",
 "required": true
 }
 }
 }
}```

#### Response Fields [](#response-fields-1)

| Field | Type | Description | 
| --- | --- | --- |
| `data.country_code` | string | The resolved ISO country code | 
| `data.states` | array | List of state/province options with `label` and `value`. Empty array if the country has no states | 
| `data.address_locale` | object | Country-specific address field labels and requirements (e.g., "State" vs "Province", "ZIP Code" vs "Postal Code") | 
#### Example [](#example-5)
bash
```
# Auto-detect from timezone
curl -X GET "https://example.com/wp-json/fluent-cart/v2/checkout/get-country-info?timezone=America/Chicago"

# Explicit country code
curl -X GET "https://example.com/wp-json/fluent-cart/v2/checkout/get-country-info?country_code=CA"```

## User Authentication [](#user-authentication)

### Login [](#login)
POST `/fluent-cart/v2/user/login`
Authenticate a user during the checkout process. On success, sets the WordPress authentication cookie and returns a redirect URL to the customer profile page.

- **Authentication:** Requires a valid WordPress REST API nonce (`X-WP-Nonce` header)
- **Policy:** `PublicPolicy`

#### Parameters [](#parameters-6)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `user_login` | string | body | Yes | WordPress username or email address | 
| `password` | string | body | Yes | Account password | 
| `remember_me` | string | body | No | Set to `on` to persist the login session ("Remember Me"). Default: not remembered | 
#### Headers [](#headers)

| Header | Required | Description | 
| --- | --- | --- |
| `X-WP-Nonce` | Yes | WordPress REST API nonce for `wp_rest` action. Required to prevent CSRF attacks | 
#### Response (Success — 200) [](#response-success-—-200-6)
json
```
{
 "success": true,
 "data": {
 "message": "Login successful",
 "redirect_url": "https://your-site.com/customer-profile/#/profile"
 }
}```

#### Error Responses [](#error-responses-3)

**Invalid nonce (403):**json
```
{
 "message": "Invalid security token. Please refresh the page and try again.",
 "code": "invalid_nonce"
}```

**Missing username (400):**json
```
{
 "success": false,
 "data": {
 "message": "Email or username is required",
 "code": "missing_login"
 }
}```

**Missing password (400):**json
```
{
 "success": false,
 "data": {
 "message": "Password is required",
 "code": "missing_password"
 }
}```

**Invalid credentials (401):**json
```
{
 "success": false,
 "data": {
 "message": "The password you entered for the username [[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection) is incorrect.",
 "code": "login_failed"
 }
}```

#### Example [](#example-6)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/user/login" \
 -H "Content-Type: application/json" \
 -H "X-WP-Nonce: your_nonce_here" \
 -d '{
 "user_login": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "password": "securepassword123",
 "remember_me": "on"
 }'```

**Note:** The `X-WP-Nonce` is typically generated by WordPress on the checkout page and is available to frontend JavaScript. It is required for this endpoint to function correctly.

---

## Customer Profile

Source: https://dev.fluentcart.com/restapi/customer-profile.html


Customer-facing endpoints for managing profiles, viewing orders, handling addresses, and accessing downloads. These endpoints are used by the storefront customer portal.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2`
**Policy:** `CustomerFrontendPolicy` (requires authenticated customer)
These are frontend endpoints accessed by logged-in customers, not admin users. The policy checks `is_user_logged_in()` and each endpoint verifies that the authenticated user matches the requested customer record.
All monetary values are in **cents** (e.g., `$10.00` = `1000`).
## Customer Management [](#customer-management)

Endpoints under the `customers` prefix for retrieving and updating the current customer's details.
### Get Customer Details [](#get-customer-details)
GET `/fluent-cart/v2/customers/{customerId}`
Retrieve the details of the currently authenticated customer. The `customerId` must match the logged-in customer's record.
#### Parameters [](#parameters)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customerId` | integer | path | Yes | The customer ID. Must belong to the authenticated user. | 
| `with` | array | query | No | Relationships to eager-load (e.g., `billing_address`, `shipping_address`, `orders`) | 
#### Response [](#response)

**Success (200):**json
```
{
 "customer": {
 "id": 1,
 "user_id": 5,
 "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "first_name": "John",
 "last_name": "Doe",
 "status": "active",
 "purchase_value": {},
 "purchase_count": 3,
 "ltv": 15000,
 "country": "US",
 "city": "New York",
 "state": "NY",
 "postcode": "10001",
 "created_at": "2025-01-10 08:00:00",
 "updated_at": "2025-06-20 14:00:00"
 }
}```

**Error (403):**json
```
{
 "message": "You are not authorized to view this customer"
}```

#### Example [](#example)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customers/1?with[]=billing_address" \
 --cookie "wordpress_logged_in_xxx=..."```

### Update Customer Details [](#update-customer-details)
PUT `/fluent-cart/v2/customers/{customerId}`
Update the authenticated customer's profile details. The `customerId` must match the logged-in customer's record.
#### Parameters [](#parameters-1)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customerId` | integer | path | Yes | The customer ID. Must belong to the authenticated user. | 
| `email` | string | body | Yes | Customer email address. Must be unique and valid. Max 255 characters. | 
| `first_name` | string | body | Conditional | Customer first name. Required when store uses separate name fields. Max 255 characters. | 
| `last_name` | string | body | No | Customer last name. Max 255 characters. | 
| `full_name` | string | body | Conditional | Customer full name. Required when store uses full name mode. Max 255 characters. | 
| `city` | string | body | No | Customer city | 
| `state` | string | body | No | Customer state/province code | 
| `postcode` | string | body | No | Customer postal/zip code | 
| `country` | string | body | No | Customer country code (e.g., `US`, `GB`) | 
| `notes` | string | body | No | Internal notes about the customer | 
| `status` | string | body | No | Customer status | 
#### Response [](#response-1)

**Success (200):**json
```
{
 "message": "Customer updated successfully!",
 "data": {
 "id": 1,
 "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "first_name": "John",
 "last_name": "Doe"
 }
}```

**Error (403):**json
```
{
 "message": "You are not authorized to update this customer"
}```

#### Example [](#example-1)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/customers/1" \
 -H "Content-Type: application/json" \
 -d '{"first_name": "John", "last_name": "Smith", "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)"}' \
 --cookie "wordpress_logged_in_xxx=..."```

### Get Customer Orders (Customer Prefix) [](#get-customer-orders-customer-prefix)
GET `/fluent-cart/v2/customers/{customerId}/orders`
Retrieve a paginated list of orders for the specified customer. The `customerId` must match the logged-in user.
#### Parameters [](#parameters-2)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customerId` | integer | path | Yes | The customer ID. Must belong to the authenticated user. | 
| `per_page` | integer | query | No | Number of items per page (default: 15) | 
#### Response [](#response-2)

**Success (200):**json
```
{
 "orders": {
 "total": 25,
 "per_page": 15,
 "current_page": 1,
 "last_page": 2,
 "data": [
 {
 "id": 101,
 "invoice_no": "INV-000101",
 "total_amount": 4999,
 "uuid": "abc-123-def",
 "type": "one-time",
 "status": "completed",
 "created_at": "2025-06-15 10:30:00"
 }
 ]
 }
}```

**Error (returns empty when unauthorized):**json
```
{
 "orders": []
}```

#### Example [](#example-2)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customers/1/orders?per_page=10" \
 --cookie "wordpress_logged_in_xxx=..."```

## Address Management (Customer Prefix) [](#address-management-customer-prefix)

Endpoints under the `customers` prefix for managing customer addresses during checkout and in the customer account.
### Select Address for Checkout [](#select-address-for-checkout)
GET `/fluent-cart/v2/customers/{customerAddressId}/update-address-select`
Select an existing address and apply it to the current cart/checkout session. Updates the cart's checkout data with the selected address and returns the rendered address HTML along with updated checkout fragments.
#### Parameters [](#parameters-3)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customerAddressId` | integer | path | Yes | The address record ID to select | 
| `with` | array | query | No | Relationships to eager-load on the address | 
| `fct_cart_hash` | string | query | No | Cart hash identifier to locate the active cart session | 
#### Response [](#response-3)

**Success (200):**json
```
{
 "message": "Address Attached",
 "data": "<div class=\"fct-address-info\">...</div>",
 "fragments": {
 ".fct-checkout-summary": "<div>...updated summary HTML...</div>"
 }
}```

**Error (404):**json
```
{
 "message": "Address not found"
}```

**Error (403):**json
```
{
 "message": "You are not authorized to view this address"
}```

#### Example [](#example-3)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customers/5/update-address-select?fct_cart_hash=abc123" \
 --cookie "wordpress_logged_in_xxx=..."```

### Create Address (Checkout) [](#create-address-checkout)
POST `/fluent-cart/v2/customers/add-address`
Create a new address for the currently authenticated customer. Used during checkout to add a new billing or shipping address. After creation, returns updated address selector HTML for the checkout form.
#### Parameters [](#parameters-4)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `type` | string | body | Yes | Address type: `billing` or `shipping` | 
| `product_type` | string | body | No | Product fulfillment type (e.g., `physical`, `digital`). Used for field validation rules. | 
| `label` | string | body | No | Short label for the address (max 15 characters, e.g., `Home`, `Office`) | 
| `billing_name` or `shipping_name` | string | body | No | Contact name (prefixed with address type) | 
| `billing_address_1` or `shipping_address_1` | string | body | Yes | Primary street address (prefixed with address type) | 
| `billing_address_2` or `shipping_address_2` | string | body | No | Secondary address line (prefixed with address type) | 
| `billing_city` or `shipping_city` | string | body | Yes | City (prefixed with address type) | 
| `billing_state` or `shipping_state` | string | body | Conditional | State/province code. Required if the country has states. (prefixed with address type) | 
| `billing_postcode` or `shipping_postcode` | string | body | Conditional | Postal/zip code. Validated against country format. (prefixed with address type) | 
| `billing_country` or `shipping_country` | string | body | Yes | Country code (e.g., `US`, `GB`). (prefixed with address type) | 
| `billing_phone` or `shipping_phone` | string | body | No | Phone number (prefixed with address type) | 
| `billing_email` or `shipping_email` | string | body | No | Email address (prefixed with address type) | 
**Note:** All address fields are prefixed with the address `type` (e.g., `billing_address_1` for a billing address, `shipping_city` for shipping). The prefix is stripped before storage.
#### Response [](#response-4)

**Success (200):**json
```
{
 "message": "Customer address created successfully!",
 "fragment": [
 {
 "selector": "[data-fluent-cart-checkout-page-form-address-modal-address-selector-button-wrapper]",
 "content": "<div>...updated address selector HTML...</div>",
 "type": "replace"
 }
 ]
}```

**Error (422 - validation):**json
```
{
 "status": "failed",
 "errors": {
 "billing_country": {
 "required": "Country is required."
 }
 }
}```

**Error (no customer):**json
```
{
 "message": "You don't have any associated account"
}```

#### Example [](#example-4)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customers/add-address" \
 -H "Content-Type: application/json" \
 -d '{
 "type": "billing",
 "billing_name": "John Doe",
 "billing_address_1": "123 Main St",
 "billing_city": "New York",
 "billing_state": "NY",
 "billing_postcode": "10001",
 "billing_country": "US",
 "billing_phone": "+1234567890",
 "label": "Home"
 }' \
 --cookie "wordpress_logged_in_xxx=..."```

### Update Address (Checkout) [](#update-address-checkout)
PUT `/fluent-cart/v2/customers/{customerId}/address`
Update an existing address for the authenticated customer. The address ID is passed in the request body.
#### Parameters [](#parameters-5)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customerId` | integer | path | Yes | The customer ID. Must belong to the authenticated user. | 
| `address.id` | integer | body | Yes | The address record ID to update | 
| `type` | string | body | Yes | Address type: `billing` or `shipping` | 
| `billing_label` or `shipping_label` | string | body | Yes | Short label (max 15 characters). Prefixed with address type. | 
| `billing_name` or `shipping_name` | string | body | No | Contact name (prefixed with address type) | 
| `billing_address_1` or `shipping_address_1` | string | body | Yes | Primary street address (prefixed with address type) | 
| `billing_address_2` or `shipping_address_2` | string | body | No | Secondary address line (prefixed with address type) | 
| `billing_city` or `shipping_city` | string | body | Yes | City (prefixed with address type) | 
| `billing_state` or `shipping_state` | string | body | Conditional | State/province code (prefixed with address type) | 
| `billing_postcode` or `shipping_postcode` | string | body | Conditional | Postal/zip code (prefixed with address type) | 
| `billing_country` or `shipping_country` | string | body | Yes | Country code (prefixed with address type) | 
#### Response [](#response-5)

**Success (200):**json
```
{
 "message": "Address updated successfully"
}```

**Error (403):**json
```
{
 "message": "You are not authorized to update this address"
}```

#### Example [](#example-5)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/customers/1/address" \
 -H "Content-Type: application/json" \
 -d '{
 "type": "billing",
 "address": {"id": 5},
 "billing_name": "John Doe",
 "billing_address_1": "456 Oak Ave",
 "billing_city": "Boston",
 "billing_state": "MA",
 "billing_postcode": "02101",
 "billing_country": "US",
 "billing_label": "Work"
 }' \
 --cookie "wordpress_logged_in_xxx=..."```

### Delete Address (Checkout) [](#delete-address-checkout)
DELETE `/fluent-cart/v2/customers/{customerId}/address`
Delete an existing address for the authenticated customer. The address ID is passed in the request body.
#### Parameters [](#parameters-6)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customerId` | integer | path | Yes | The customer ID. Must belong to the authenticated user. | 
| `address.id` | integer | body | Yes | The address record ID to delete | 
#### Response [](#response-6)

**Success (200):**json
```
{
 "message": "Address deleted successfully"
}```

**Error (403):**json
```
{
 "message": "You are not authorized to delete this address"
}```

#### Example [](#example-6)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/customers/1/address" \
 -H "Content-Type: application/json" \
 -d '{"address": {"id": 5}}' \
 --cookie "wordpress_logged_in_xxx=..."```

### Set Address as Primary [](#set-address-as-primary)
POST `/fluent-cart/v2/customers/{customerId}/address/make-primary`
Mark a specific address as the primary address for its type (billing or shipping). All other addresses of the same type are demoted.
#### Parameters [](#parameters-7)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `customerId` | integer | path | Yes | The customer ID. Must belong to the authenticated user. | 
| `address.id` | integer | body | Yes | The address record ID to set as primary | 
| `address.type` | string | body | Yes | Address type: `billing` or `shipping` | 
#### Response [](#response-7)

**Success (200):**json
```
{
 "message": "Address successfully set as the primary"
}```

**Error (403):**json
```
{
 "message": "You are not authorized to update this address"
}```

#### Example [](#example-7)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customers/1/address/make-primary" \
 -H "Content-Type: application/json" \
 -d '{"address": {"id": 5, "type": "billing"}}' \
 --cookie "wordpress_logged_in_xxx=..."```

## Profile Management [](#profile-management)

Endpoints under the `customer-profile` prefix for the customer portal dashboard and profile settings.
### Dashboard Overview [](#dashboard-overview)
GET `/fluent-cart/v2/customer-profile/`
Retrieve the customer's dashboard overview including the 5 most recent orders. This is the landing page data for the customer portal.
#### Parameters [](#parameters-8)

No parameters required.
#### Response [](#response-8)

**Success (200):**json
```
{
 "message": "Success",
 "dashboard_data": {
 "orders": [
 {
 "created_at": "2025-06-15 10:30:00",
 "invoice_no": "INV-000101",
 "total_amount": 4999,
 "uuid": "abc-123-def",
 "type": "one-time",
 "status": "completed",
 "renewals_count": 0,
 "order_items": [
 {
 "id": 1,
 "post_title": "Premium Plugin",
 "title": "Premium Plugin - Single Site",
 "quantity": 1,
 "payment_type": "one-time",
 "line_meta": {
 "bundle_parent_item_id": null
 }
 }
 ]
 }
 ]
 },
 "sections_parts": {
 "before_orders_table": "",
 "after_orders_table": ""
 }
}```

The `sections_parts` object contains HTML strings injected by extensions via the `fluent_cart/customer_dashboard_data` filter.
#### Example [](#example-8)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customer-profile/" \
 --cookie "wordpress_logged_in_xxx=..."```

### Get Profile Details [](#get-profile-details)
GET `/fluent-cart/v2/customer-profile/profile`
Retrieve the authenticated customer's profile details including name, email, and associated addresses. If the logged-in user does not yet have a customer record, basic WordPress user data is returned instead.
#### Parameters [](#parameters-9)

No parameters required.
#### Response [](#response-9)

**Success (200) - Existing customer:**json
```
{
 "message": "Success",
 "data": {
 "first_name": "John",
 "last_name": "Doe",
 "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "billing_address": [
 {
 "id": 1,
 "customer_id": 1,
 "type": "billing",
 "name": "John Doe",
 "address_1": "123 Main St",
 "address_2": "",
 "city": "New York",
 "state": "NY",
 "postcode": "10001",
 "country": "US",
 "is_primary": "1",
 "status": "active"
 }
 ],
 "shipping_address": []
 }
}```

**Success (200) - User without customer record:**json
```
{
 "message": "Success",
 "data": {
 "first_name": "Jane",
 "last_name": "Smith",
 "user_login": "janesmith",
 "user_email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "user_nicename": "janesmith",
 "display_name": "Jane Smith",
 "billing_address": [],
 "shipping_address": [],
 "not_a_customer": true
 }
}```

#### Example [](#example-9)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customer-profile/profile" \
 --cookie "wordpress_logged_in_xxx=..."```

### Update Profile Details [](#update-profile-details)
POST `/fluent-cart/v2/customer-profile/update`
Update the authenticated customer's profile name. Also updates the associated WordPress user's `first_name`, `last_name`, and `display_name`.
#### Parameters [](#parameters-10)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `first_name` | string | body | No | Customer first name. Max 255 characters. | 
| `last_name` | string | body | No | Customer last name. Max 255 characters. | 
| `email` | string | body | Yes | Customer email address. Must be valid. | 
| `current_password` | string | body | No | Current password (for password change flow) | 
| `new_password` | string | body | No | New password (for password change flow) | 
| `confirm_new_password` | string | body | No | Confirm new password (for password change flow) | 
#### Response [](#response-10)

**Success (200):**json
```
{
 "message": "Profile updated successfully"
}```

**Error (customer not found):**json
```
{
 "message": "Customer not found"
}```

**Error (not logged in):**json
```
{
 "message": "You are not logged in"
}```

#### Example [](#example-10)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customer-profile/update" \
 -H "Content-Type: application/json" \
 -d '{"first_name": "John", "last_name": "Smith", "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)"}' \
 --cookie "wordpress_logged_in_xxx=..."```

## Address Management (Profile) [](#address-management-profile)

Endpoints under the `customer-profile` prefix for managing addresses from the customer portal profile page. These use a simpler interface compared to the checkout address endpoints.
### Create Profile Address [](#create-profile-address)
POST `/fluent-cart/v2/customer-profile/create-address`
Create a new address for the authenticated customer from the profile management page.
#### Parameters [](#parameters-11)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `type` | string | body | Yes | Address type: `billing` or `shipping` | 
| `name` | string | body | Yes | Contact name. Max 255 characters. | 
| `label` | string | body | No | Short label for the address (max 15 characters, e.g., `Home`, `Work`) | 
| `address_1` | string | body | No | Primary street address | 
| `address_2` | string | body | No | Secondary address line | 
| `city` | string | body | No | City. Max 255 characters. | 
| `state` | string | body | No | State/province code. Max 255 characters. | 
| `postcode` | string | body | Yes | Postal/zip code | 
| `country` | string | body | Yes | Country code (e.g., `US`, `GB`) | 
| `phone` | string | body | No | Phone number | 
| `email` | string | body | Yes | Email address | 
| `company_name` | string | body | No | Company name. Max 255 characters. | 
| `is_primary` | integer | body | No | Set to `1` to make this the primary address. Defaults to `0`. Automatically set to `1` if no primary address exists. | 
#### Response [](#response-11)

**Success (200):**json
```
{
 "message": "Customer address created successfully!",
 "data": {
 "is_created": {
 "id": 10,
 "customer_id": 1,
 "type": "billing",
 "name": "John Doe",
 "address_1": "123 Main St",
 "city": "New York",
 "state": "NY",
 "postcode": "10001",
 "country": "US",
 "is_primary": "1",
 "status": "active"
 },
 "total_address_count": 2
 }
}```

**Error (validation):**json
```
{
 "message": "Name field is required."
}```

#### Example [](#example-11)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customer-profile/create-address" \
 -H "Content-Type: application/json" \
 -d '{
 "type": "billing",
 "name": "John Doe",
 "address_1": "123 Main St",
 "city": "New York",
 "state": "NY",
 "postcode": "10001",
 "country": "US",
 "phone": "+1234567890",
 "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "label": "Home"
 }' \
 --cookie "wordpress_logged_in_xxx=..."```

### Update Profile Address [](#update-profile-address)
POST `/fluent-cart/v2/customer-profile/edit-address`
Update an existing address from the profile management page. The address must belong to the authenticated customer.
#### Parameters [](#parameters-12)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | body | Yes | The address record ID to update | 
| `type` | string | body | Yes | Address type: `billing` or `shipping` | 
| `name` | string | body | Yes | Contact name. Max 255 characters. | 
| `label` | string | body | No | Short label (max 15 characters) | 
| `address_1` | string | body | No | Primary street address | 
| `address_2` | string | body | No | Secondary address line | 
| `city` | string | body | No | City. Max 255 characters. | 
| `state` | string | body | No | State/province code. Max 255 characters. | 
| `postcode` | string | body | Yes | Postal/zip code | 
| `country` | string | body | Yes | Country code (e.g., `US`, `GB`) | 
| `phone` | string | body | No | Phone number | 
| `email` | string | body | Yes | Email address | 
| `company_name` | string | body | No | Company name. Max 255 characters. | 
#### Response [](#response-12)

**Success (200):**json
```
{
 "message": "Customer address updated successfully!",
 "data": {
 "id": 5,
 "customer_id": 1,
 "type": "billing",
 "name": "John Smith",
 "address_1": "456 Oak Ave",
 "city": "Boston",
 "state": "MA",
 "postcode": "02101",
 "country": "US"
 }
}```

**Error (403):**json
```
{
 "message": "You are not authorized to update this address"
}```

#### Example [](#example-12)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customer-profile/edit-address" \
 -H "Content-Type: application/json" \
 -d '{
 "id": 5,
 "type": "billing",
 "name": "John Smith",
 "address_1": "456 Oak Ave",
 "city": "Boston",
 "state": "MA",
 "postcode": "02101",
 "country": "US",
 "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)"
 }' \
 --cookie "wordpress_logged_in_xxx=..."```

### Make Profile Address Primary [](#make-profile-address-primary)
POST `/fluent-cart/v2/customer-profile/make-primary-address`
Set a specific address as the primary address for its type. All other addresses of the same type for the customer are demoted.
#### Parameters [](#parameters-13)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `addressId` | integer | body | Yes | The address record ID to set as primary | 
| `type` | string | body | Yes | Address type: `billing` or `shipping` | 
#### Response [](#response-13)

**Success (200):**json
```
{
 "message": "Address successfully set as the primary"
}```

**Error (403):**json
```
{
 "message": "You are not authorized to update this address"
}```

#### Example [](#example-13)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customer-profile/make-primary-address" \
 -H "Content-Type: application/json" \
 -d '{"addressId": 5, "type": "billing"}' \
 --cookie "wordpress_logged_in_xxx=..."```

### Delete Profile Address [](#delete-profile-address)
POST `/fluent-cart/v2/customer-profile/delete-address`
Delete an address from the customer's profile. The address must belong to the authenticated customer. Primary addresses and the last remaining address cannot be deleted.
#### Parameters [](#parameters-14)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `addressId` | integer | body | Yes | The address record ID to delete | 
#### Response [](#response-14)

**Success (200):**json
```
{
 "message": "Address successfully deleted."
}```

**Error (address is primary):**json
```
{
 "message": "Primary address cannot be deleted!"
}```

**Error (last address):**json
```
{
 "message": "At least one address must remain. Address deletion failed!"
}```

**Error (403):**json
```
{
 "message": "You are not authorized to update this address"
}```

**Error (missing ID):**json
```
{
 "message": "Address ID is required"
}```

#### Example [](#example-14)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customer-profile/delete-address" \
 -H "Content-Type: application/json" \
 -d '{"addressId": 5}' \
 --cookie "wordpress_logged_in_xxx=..."```

## Orders [](#orders)

Endpoints under the `customer-profile` prefix for viewing orders and managing order-related data in the customer portal.
### List Orders [](#list-orders)
GET `/fluent-cart/v2/customer-profile/orders`
Retrieve a paginated list of the authenticated customer's orders. Excludes renewal orders that have a parent subscription order. Supports text search across order fields.
#### Parameters [](#parameters-15)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `per_page` | integer | query | No | Number of items per page (default: 10) | 
| `page` | integer | query | No | Page number for pagination (default: 1) | 
| `search` | string | query | No | Search text to filter orders | 
#### Response [](#response-15)

**Success (200):**json
```
{
 "orders": {
 "total": 25,
 "per_page": 10,
 "current_page": 1,
 "last_page": 3,
 "data": [
 {
 "created_at": "2025-06-15 10:30:00",
 "invoice_no": "INV-000101",
 "total_amount": 4999,
 "uuid": "abc-123-def",
 "type": "one-time",
 "status": "completed",
 "renewals_count": 0,
 "order_items": [
 {
 "id": 1,
 "post_title": "Premium Plugin",
 "title": "Premium Plugin - Single Site",
 "quantity": 1,
 "payment_type": "one-time",
 "line_meta": {
 "bundle_parent_item_id": null
 }
 }
 ]
 }
 ]
 }
}```

The `created_at` timestamp is converted to the user's timezone (stored in `order.config.user_tz`, falling back to the site timezone).
#### Example [](#example-15)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customer-profile/orders?per_page=10&page=1&search=plugin" \
 --cookie "wordpress_logged_in_xxx=..."```

### Get Order Details [](#get-order-details)
GET `/fluent-cart/v2/customer-profile/orders/{order_uuid}`
Retrieve full details for a specific order including line items, transactions, subscriptions, downloads, and addresses. The order must belong to the authenticated customer.
#### Parameters [](#parameters-16)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order_uuid` | string | path | Yes | The UUID of the order (alphanumeric with dashes) | 
#### Response [](#response-16)

**Success (200):**json
```
{
 "order": {
 "id": 101,
 "fulfillment_type": "digital",
 "type": "one-time",
 "created_at": "2025-06-15 10:30:00",
 "invoice_no": "INV-000101",
 "currency": "USD",
 "uuid": "abc-123-def",
 "status": "completed",
 "payment_status": "paid",
 "shipping_status": "",
 "billing_address_text": "John Doe, 123 Main St, New York, NY 10001, US",
 "shipping_address_text": "",
 "subtotal": 4999,
 "total_amount": 4999,
 "total_paid": 4999,
 "total_refund": 0,
 "shipping_total": 0,
 "coupon_discount_total": 0,
 "manual_discount_total": 0,
 "tax_total": 0,
 "tax_behavior": "exclusive",
 "shipping_tax": 0,
 "payment_method": "stripe",
 "order_items": [
 {
 "id": 1,
 "variation_id": 10,
 "product_id": 5,
 "post_title": "Premium Plugin",
 "title": "Premium Plugin - Single Site",
 "quantity": 1,
 "unit_price": 4999,
 "subtotal": 4999,
 "payment_type": "one-time",
 "meta_lines": [],
 "extra_amount": 0,
 "image": "https://example.com/wp-content/uploads/product.jpg",
 "variant_image": "",
 "url": "https://example.com/product/premium-plugin/",
 "line_meta": {},
 }
 ],
 "subscriptions": [],
 "downloads": [
 {
 "file_size": "2.5 MB",
 "title": "premium-plugin-v2.zip",
 "download_url": "https://example.com/?fct_download=..."
 }
 ],
 "transactions": [
 {
 "id": 50,
 "uuid": "txn-abc-123",
 "order_id": 101,
 "amount": 4999,
 "status": "succeeded",
 "payment_method": "stripe",
 "created_at": "2025-06-15 10:30:00"
 }
 ]
 },
 "section_parts": {
 "before_summary": "",
 "after_summary": "",
 "after_licenses": "",
 "after_subscriptions": "",
 "after_downloads": "",
 "after_transactions": "",
 "end_of_order": ""
 }
}```

The `section_parts` object contains HTML strings injected by extensions via the `fluent_cart/customer/order_details_section_parts` filter.
**Error (renewal order redirect):**json
```
{
 "message": "This is a renewal order. Please check the parent order details.",
 "parent_order": {
 "uuid": "parent-abc-123"
 }
}```

**Error (order not found):**json
```
{
 "message": "Order not found"
}```

**Error (not logged in):**json
```
{
 "message": "You are not logged in"
}```

#### Example [](#example-16)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customer-profile/orders/abc-123-def" \
 --cookie "wordpress_logged_in_xxx=..."```

### Get Upgrade Paths [](#get-upgrade-paths)
GET `/fluent-cart/v2/customer-profile/orders/{order_uuid}/upgrade-paths`
Retrieve available upgrade/downgrade paths for a specific product variation within an order. Used to show plan switching options in the customer portal.
#### Parameters [](#parameters-17)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `order_uuid` | string | path | Yes | The UUID of the order (alphanumeric with dashes) | 
| `variation_id` | integer | query | Yes | The product variation ID to find upgrade paths for | 
#### Response [](#response-17)

**Success (200):**json
```
{
 "upgradePaths": [
 {
 "variation_id": 15,
 "title": "Premium Plugin - 5 Sites",
 "price": 9999,
 "billing_interval": "year",
 "upgrade_type": "upgrade",
 "prorated_amount": 5000
 },
 {
 "variation_id": 20,
 "title": "Premium Plugin - Unlimited Sites",
 "price": 19999,
 "billing_interval": "year",
 "upgrade_type": "upgrade",
 "prorated_amount": 15000
 }
 ]
}```

**Error (not logged in):**json
```
{
 "message": "You must be logged in to view upgrade paths."
}```

**Error (order not found):**json
```
{
 "message": "Order not found or you do not have permission to view it."
}```

#### Example [](#example-17)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customer-profile/orders/abc-123-def/upgrade-paths?variation_id=10" \
 --cookie "wordpress_logged_in_xxx=..."```

### Get Transaction Billing Address [](#get-transaction-billing-address)
GET `/fluent-cart/v2/customer-profile/orders/{transaction_uuid}/billing-address`
Retrieve the billing address associated with a specific transaction. Used for invoice/receipt editing in the customer portal.
#### Parameters [](#parameters-18)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `transaction_uuid` | string | path | Yes | The UUID of the transaction (alphanumeric with dashes) | 
#### Response [](#response-18)

**Success (200):**json
```
{
 "message": "Success",
 "data": {
 "address_1": "123 Main St",
 "address_2": "",
 "city": "New York",
 "state": "NY",
 "postcode": "10001",
 "country": "US",
 "name": "John Doe",
 "vat_tax_id": "EU123456789",
 "address_id": 15
 }
}```

**Success (200) - No billing address found:**json
```
{
 "message": "",
 "data": {
 "address_1": "",
 "address_2": "",
 "city": "",
 "state": "",
 "postcode": "",
 "country": "",
 "name": "",
 "vat_tax_id": "",
 "address_id": ""
 }
}```

**Error (customer not found):**json
```
{
 "message": "Customer not found"
}```

**Error (transaction not found):**json
```
{
 "message": "Transaction not found"
}```

**Error (order not found):**json
```
{
 "message": "Order not found"
}```

#### Example [](#example-18)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customer-profile/orders/txn-abc-123/billing-address" \
 --cookie "wordpress_logged_in_xxx=..."```

### Save Transaction Billing Address [](#save-transaction-billing-address)
PUT `/fluent-cart/v2/customer-profile/orders/{transaction_uuid}/billing-address`
Create or update the billing address for a specific transaction's order. Also stores the VAT/Tax ID as order metadata. Validates address fields against country-specific rules.
#### Parameters [](#parameters-19)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `transaction_uuid` | string | path | Yes | The UUID of the transaction (alphanumeric with dashes) | 
| `address_id` | string | body | No | Existing order address ID to update. If empty, a new address is created. | 
| `name` | string | body | Yes | Contact name | 
| `address_1` | string | body | Conditional | Primary street address. Required based on country validation rules. | 
| `address_2` | string | body | No | Secondary address line | 
| `city` | string | body | Conditional | City. Required based on country validation rules. | 
| `state` | string | body | Conditional | State/province code. Required for countries with states. | 
| `postcode` | string | body | Conditional | Postal/zip code. Validated against country-specific format. | 
| `country` | string | body | Yes | Country code (e.g., `US`, `GB`) | 
| `vat_tax_id` | string | body | No | VAT or Tax ID. Stored as order meta. | 
#### Response [](#response-19)

**Success (200) - Address created:**json
```
{
 "message": "Billing address created successfully",
 "address_id": 25
}```

**Success (200) - Address updated:**json
```
{
 "message": "Billing address updated successfully",
 "formatted_address": "John Doe, 123 Main St, New York, NY 10001, US"
}```

**Error (order not found):**json
```
{
 "message": "Order not found"
}```

**Error (validation):**json
```
{
 "errors": {
 "country": ["The country field is required."]
 }
}```

#### Example [](#example-19)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/customer-profile/orders/txn-abc-123/billing-address" \
 -H "Content-Type: application/json" \
 -d '{
 "address_id": "15",
 "name": "John Doe",
 "address_1": "123 Main St",
 "city": "New York",
 "state": "NY",
 "postcode": "10001",
 "country": "US",
 "vat_tax_id": "EU123456789"
 }' \
 --cookie "wordpress_logged_in_xxx=..."```

## Downloads [](#downloads)

Endpoints for accessing downloadable products from the customer portal.
### List Downloads [](#list-downloads)
GET `/fluent-cart/v2/customer-profile/downloads`
Retrieve a paginated list of downloadable files available to the authenticated customer. Only includes downloads from orders with a successful payment status. Filters downloads based on purchased product variations.
#### Parameters [](#parameters-20)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `page` | integer | query | No | Page number for pagination (default: 1) | 
| `per_page` | integer | query | No | Number of items per page (default: 10) | 
#### Response [](#response-20)

**Success (200):**json
```
{
 "message": "Success",
 "downloads": {
 "data": [
 {
 "file_size": "2.5 MB",
 "title": "premium-plugin-v2.0.1.zip",
 "download_url": "https://example.com/?fct_download=eyJ0eXAi..."
 },
 {
 "file_size": "1.2 MB",
 "title": "starter-theme-v1.5.zip",
 "download_url": "https://example.com/?fct_download=eyJ0eXAi..."
 }
 ],
 "total": 5,
 "per_page": 10,
 "current_page": 1,
 "last_page": 1
 }
}```

**Success (200) - Not logged in (empty result):**json
```
{
 "message": "Success",
 "downloads": {
 "data": [],
 "total": 0,
 "per_page": 10,
 "current_page": 1,
 "last_page": 1
 }
}```

The `download_url` contains a signed/encoded token that authorizes the download. These URLs are generated by `Helper::generateDownloadFileLink()` and are time-limited.
#### Example [](#example-20)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customer-profile/downloads?per_page=20&page=1" \
 --cookie "wordpress_logged_in_xxx=..."```

---

## Licensing

Source: https://dev.fluentcart.com/restapi/licensing.html


Pro Feature
All licensing endpoints require FluentCart Pro to be installed and activated.
Manage software licenses including listing, activation, site management, product license settings, and the public license validation API for integrating with your software products.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2`
## Admin License Management [](#admin-license-management)

Admin endpoints require an authenticated WordPress user with the appropriate FluentCart capability. Authorization is handled by the `LicensePolicy`.
### List Licenses [](#list-licenses)
GET `/fluent-cart/v2/licensing/licenses`
Retrieve a paginated list of all licenses with optional filtering, sorting, and search.

- **Permission:** `licenses/view`
- **Policy:** `LicensePolicy`

#### Parameters [](#parameters)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `page` | integer | query | No | Page number for pagination | 
| `per_page` | integer | query | No | Number of records per page (default: 10, max: 200) | 
| `search` | string | query | No | Search term. Searches across license key, order ID, customer name, customer email, and activated site URLs. Also supports operator syntax (e.g., `license_key = abc123`) | 
| `sort_by` | string | query | No | Column to sort by (default: `id`). Must be a fillable column on the License model | 
| `sort_type` | string | query | No | Sort direction: `asc` or `desc` (default: `desc`) | 
| `active_view` | string | query | No | Tab filter. One of: `active`, `expired`, `disabled`, `inactive` | 
| `filter_type` | string | query | No | Filter mode: `simple` (default) or `advanced` | 
| `advanced_filters` | string (JSON) | query | No | JSON-encoded array of advanced filter groups (requires Pro). Supports filtering by product, customer, and license properties | 
| `with` | array/string | query | No | Eager-load relations. Supports relation names and `{relation}Count` for counts | 
| `select` | array/string | query | No | Comma-separated list of columns to select | 
| `scopes` | array | query | No | Model scopes to apply | 
| `include_ids` | array/string | query | No | Comma-separated IDs that must always be included in results | 
| `limit` | integer | query | No | Limit number of records (used with non-paginated queries) | 
| `offset` | integer | query | No | Offset for records | 
| `user_tz` | string | query | No | User timezone for date filtering (e.g., `America/New_York`) | 
#### Tab Filter Behavior [](#tab-filter-behavior)

| `active_view` Value | Behavior | 
| --- | --- |
| `active` | Licenses with status `active` whose expiration date is in the future or is null (lifetime) | 
| `expired` | Licenses whose expiration date is in the past | 
| `disabled` | Licenses with status `disabled` | 
| `inactive` | Licenses with status `active` but no site activations | 
#### Advanced Filter Options [](#advanced-filter-options)

When using `filter_type=advanced`, the following filter categories are available:

| Category | Filter | Type | Description | 
| --- | --- | --- | --- |
| Product | `product` | remote tree select | Filter by product variation | 
| Customer | `customer_first_name` | text (relation) | Filter by customer first name | 
| Customer | `customer_last_name` | text (relation) | Filter by customer last name | 
| License | `license_key` | text | Filter by license key | 
| License | `status` | selections (multiple) | Filter by license status: `active`, `disabled`, `expired` | 
| License | `activation_count` | numeric | Filter by number of activations | 
| License | `expiration_date` | dates | Filter by expiration date range | 
#### Response [](#response)
json
```
{
 "licenses": {
 "current_page": 1,
 "data": [
 {
 "id": 1,
 "status": "active",
 "limit": 5,
 "activation_count": 2,
 "license_key": "XXXX-XXXX-XXXX-XXXX",
 "product_id": 10,
 "variation_id": 15,
 "order_id": 42,
 "parent_id": null,
 "customer_id": 7,
 "expiration_date": "2026-01-15 00:00:00",
 "subscription_id": 3,
 "created_at": "2025-01-15 10:30:00",
 "updated_at": "2025-06-15 10:35:00"
 }
 ],
 "per_page": 10,
 "total": 50,
 "last_page": 5
 }
}```

Status Override
If a license has an `expiration_date` in the past, its `status` field is dynamically overridden to `expired` in the response, even if the stored status is `active`.
#### Example [](#example)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/licensing/licenses?page=1&per_page=10&active_view=active" \
 -u "username:app_password"```

### Get Customer Licenses (Admin) [](#get-customer-licenses-admin)
GET `/fluent-cart/v2/licensing/licenses/customer/{id}`
Retrieve a paginated list of licenses belonging to a specific customer.

- **Permission:** `licenses/view`
- **Policy:** `LicensePolicy`

#### Parameters [](#parameters-1)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The customer ID | 
| `page` | integer | query | No | Page number for pagination (default: 1) | 
| `per_page` | integer | query | No | Number of records per page (default: 10) | 
#### Response [](#response-1)
json
```
{
 "licenses": {
 "current_page": 1,
 "data": [
 {
 "id": 1,
 "status": "active",
 "limit": 5,
 "activation_count": 2,
 "license_key": "XXXX-XXXX-XXXX-XXXX",
 "product_id": 10,
 "variation_id": 15,
 "order_id": 42,
 "customer_id": 7,
 "expiration_date": "2026-01-15 00:00:00",
 "customer": { ... },
 "product_variant": { ... },
 "order": { ... },
 "product": { ... },
 "activations_count": 2
 }
 ],
 "per_page": 10,
 "total": 5,
 "last_page": 1
 }
}```

#### Example [](#example-1)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/licensing/licenses/customer/7?per_page=10" \
 -u "username:app_password"```

### Get License Details [](#get-license-details)
GET `/fluent-cart/v2/licensing/licenses/{id}`
Retrieve the full details of a single license including the associated order, activations, product information, downloads, labels, and previous orders.

- **Permission:** `licenses/view`
- **Policy:** `LicensePolicy`

#### Parameters [](#parameters-2)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The license ID | 
#### Response [](#response-2)
json
```
{
 "license": {
 "id": 1,
 "status": "active",
 "limit": 5,
 "activation_count": 2,
 "license_key": "XXXX-XXXX-XXXX-XXXX",
 "product_id": 10,
 "variation_id": 15,
 "order_id": 42,
 "customer_id": 7,
 "expiration_date": "2026-01-15 00:00:00",
 "subscription_id": 3,
 "config": {},
 "customer": { ... },
 "product_variant": { ... },
 "labels": [ ... ]
 },
 "downloads": [
 {
 "id": 1,
 "post_id": 10,
 "product_title": "My Plugin",
 "variation_titles": ["Pro License"],
 "download_url": "https://example.com/?fluent-cart=download&..."
 }
 ],
 "order": {
 "id": 42,
 "order_items": [ ... ],
 "billing_address": { ... },
 "shipping_address": { ... }
 },
 "activations": [
 {
 "id": 1,
 "license_id": 1,
 "site_id": 5,
 "status": "active",
 "is_local": 0,
 "activation_hash": "abc123def456...",
 "site": {
 "id": 5,
 "site_url": "example.com"
 }
 }
 ],
 "product": {
 "ID": 10,
 "post_title": "My Plugin",
 "variants": [ ... ]
 },
 "selected_labels": [1, 3],
 "orders": [
 {
 "id": 42,
 ...
 }
 ],
 "prev_orders": [ ... ],
 "subscription": null,
 "upgrade_path_base": "https://example.com/?fluent-cart=custom-payment"
}```

#### Error Response (404) [](#error-response-404)
json
```
{
 "data": {
 "message": "License not found",
 "buttonText": "Back to License List",
 "route": "/licenses"
 },
 "code": "fluent_cart_entity_not_found"
}```

#### Example [](#example-2)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/licensing/licenses/1" \
 -u "username:app_password"```

### Regenerate License Key [](#regenerate-license-key)
POST `/fluent-cart/v2/licensing/licenses/{id}/regenerate-key`
Generate a new random license key for an existing license. The old key is immediately invalidated.

- **Permission:** `licenses/manage`
- **Policy:** `LicensePolicy`

#### Parameters [](#parameters-3)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The license ID | 
#### Response [](#response-3)
json
```
{
 "license": {
 "id": 1,
 "license_key": "NEW-XXXX-XXXX-XXXX",
 "status": "active",
 ...
 },
 "message": "License key regenerated successfully!"
}```

#### Example [](#example-3)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/licensing/licenses/1/regenerate-key" \
 -u "username:app_password"```

### Extend License Validity [](#extend-license-validity)
POST `/fluent-cart/v2/licensing/licenses/{id}/extend-validity`
Change the expiration date of a license. Can extend, reduce, or set to lifetime. If the license status is not `active` or `inactive`, it will be automatically set to `active`.

- **Permission:** `licenses/manage`
- **Policy:** `LicensePolicy`

#### Parameters [](#parameters-4)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The license ID | 
| `expiration_date` | string | body | Yes | New expiration date in `YYYY-MM-DD HH:MM:SS` format, or the string `lifetime` to remove expiration | 
#### Response [](#response-4)
json
```
{
 "license": {
 "id": 1,
 "expiration_date": "2027-01-15 00:00:00",
 "status": "active",
 ...
 },
 "message": "License validity extended!"
}```

The response message varies based on the change:

- `"License validity extended!"` -- when the new date is later than the current date
- `"License validity reduced!"` -- when the new date is earlier than the current date
- `"Marked license as lifetime!"` -- when set to `lifetime`

#### Error Response (423) [](#error-response-423)
json
```
{
 "message": "Invalid expiration date!"
}```

#### Example [](#example-4)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/licensing/licenses/1/extend-validity" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{"expiration_date": "2027-06-15 00:00:00"}'```

Set to lifetime:bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/licensing/licenses/1/extend-validity" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{"expiration_date": "lifetime"}'```

### Update License Status [](#update-license-status)
POST `/fluent-cart/v2/licensing/licenses/{id}/update_status`
Change the status of a license.

- **Permission:** `licenses/manage`
- **Policy:** `LicensePolicy`

#### Parameters [](#parameters-5)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The license ID | 
| `status` | string | body | Yes | New status. One of: `active`, `disabled`, `expired` | 
#### Response [](#response-5)
json
```
{
 "license": {
 "id": 1,
 "status": "disabled",
 ...
 },
 "message": "License status has been updated successfully!"
}```

#### Error Response (423) [](#error-response-423-1)
json
```
{
 "message": "Invalid status!"
}```

#### Example [](#example-5)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/licensing/licenses/1/update_status" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{"status": "disabled"}'```

### Update License Activation Limit [](#update-license-activation-limit)
POST `/fluent-cart/v2/licensing/licenses/{id}/update_limit`
Change the maximum number of site activations allowed for a license.

- **Permission:** `licenses/manage`
- **Policy:** `LicensePolicy`

#### Parameters [](#parameters-6)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The license ID | 
| `limit` | integer/string | body | Yes | New activation limit. Use a positive integer for a specific limit, or `0` / `"unlimited"` for unlimited activations | 
#### Response [](#response-6)
json
```
{
 "license": {
 "id": 1,
 "limit": 10,
 ...
 },
 "message": "License limit has been updated successfully!"
}```

#### Example [](#example-6)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/licensing/licenses/1/update_limit" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{"limit": 10}'```

### Deactivate Site (Admin) [](#deactivate-site-admin)
POST `/fluent-cart/v2/licensing/licenses/{id}/deactivate_site`
Deactivate a specific site activation from a license using the activation ID.

- **Permission:** `licenses/manage`
- **Policy:** `LicensePolicy`

#### Parameters [](#parameters-7)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The license ID (URL parameter, used for routing) | 
| `id` | string/integer | body | Yes | The license ID or key (used by the service internally) | 
| `activation_id` | string/integer | body | Yes | The activation record ID to deactivate | 
#### Response [](#response-7)
json
```
{
 "message": "Site has been deactivated successfully!"
}```

#### Error Response [](#error-response)
json
```
{
 "message": "<error message from license manager>"
}```

#### Example [](#example-7)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/licensing/licenses/1/deactivate_site" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{"id": 1, "activation_id": 5}'```

### Activate Site (Admin) [](#activate-site-admin)
POST `/fluent-cart/v2/licensing/licenses/{id}/activate_site`
Manually activate a site URL on a license from the admin panel.

- **Permission:** `licenses/manage`
- **Policy:** `LicensePolicy`

#### Parameters [](#parameters-8)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The license ID (URL parameter, used for routing) | 
| `id` | string/integer | body | Yes | The license ID or key (used by the service internally) | 
| `url` | string | body | Yes | The site URL to activate | 
#### Response [](#response-8)
json
```
{
 "message": "Site has been activated successfully!"
}```

#### Error Response (423) [](#error-response-423-2)
json
```
{
 "message": "<error message from license manager>"
}```

#### Example [](#example-8)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/licensing/licenses/1/activate_site" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{"id": 1, "url": "https://my-client-site.com"}'```

### Delete License [](#delete-license)
DELETE `/fluent-cart/v2/licensing/licenses/{id}/delete`
Permanently delete a license and all its associated data.

- **Permission:** `licenses/delete`
- **Policy:** `LicensePolicy`

#### Parameters [](#parameters-9)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The license ID | 
#### Response [](#response-9)
json
```
{
 "message": "License deleted successfully!"
}```

#### Example [](#example-9)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/licensing/licenses/1/delete" \
 -u "username:app_password"```

## Product License Settings [](#product-license-settings)

Endpoints for configuring license settings on a per-product basis. These control how licenses are generated when customers purchase the product.
### Get Product License Settings [](#get-product-license-settings)
GET `/fluent-cart/v2/licensing/products/{id}/settings`
Retrieve the license configuration for a specific product, including per-variation activation limits and validity periods.

- **Permission:** `licenses/view`
- **Policy:** `LicensePolicy`

#### Parameters [](#parameters-10)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The product ID | 
#### Response [](#response-10)
json
```
{
 "settings": {
 "enabled": "yes",
 "version": "1.2.0",
 "global_update_file": {
 "id": "",
 "driver": "local",
 "path": "",
 "url": ""
 },
 "variations": [
 {
 "variation_id": 15,
 "title": "Single Site License",
 "activation_limit": 1,
 "validity": {
 "unit": "year",
 "value": 1
 },
 "media": [ ... ],
 "subscription_info": "Billed yearly at $49.00",
 "setup_fee_info": ""
 },
 {
 "variation_id": 16,
 "title": "Unlimited Sites License",
 "activation_limit": "",
 "validity": {
 "unit": "lifetime",
 "value": 1
 },
 "media": [ ... ],
 "subscription_info": "",
 "setup_fee_info": ""
 }
 ],
 "wp": {
 "is_wp": "yes",
 "readme_url": "https://example.com/changelog",
 "banner_url": "https://example.com/banner.png",
 "icon_url": "https://example.com/icon.png",
 "required_php": "7.4",
 "required_wp": "5.6"
 },
 "prefix": "",
 "changelog": "<h4>1.2.0</h4><ul><li>New feature added</li></ul>",
 "license_keys": ""
 },
 "is_bundle_product": false
}```

#### Response Fields [](#response-fields)

| Field | Type | Description | 
| --- | --- | --- |
| `settings.enabled` | string | Whether licensing is enabled: `yes` or `no` | 
| `settings.version` | string | Current software version number | 
| `settings.global_update_file` | object | The downloadable file used for auto-updates | 
| `settings.variations` | array | Per-variation license configuration | 
| `settings.variations[].activation_limit` | integer/string | Max activations for this variation (empty = unlimited) | 
| `settings.variations[].validity.unit` | string | Validity unit: `day`, `week`, `month`, `year`, or `lifetime` | 
| `settings.variations[].validity.value` | integer | Number of validity units | 
| `settings.wp` | object | WordPress-specific settings for plugin/theme update API | 
| `settings.changelog` | string | HTML changelog content | 
| `settings.license_keys` | string | Pre-defined license keys (if applicable) | 
| `is_bundle_product` | boolean | Whether the product is a bundle (licensing is disabled for bundles) | 
Bundle Products
Licensing is automatically disabled for bundle products. Bundle item licenses are generated based on each individual bundle item's license settings.
#### Example [](#example-10)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/licensing/products/10/settings" \
 -u "username:app_password"```

### Save Product License Settings [](#save-product-license-settings)
POST `/fluent-cart/v2/licensing/products/{id}/settings`
Update the license configuration for a specific product.

- **Permission:** `licenses/manage`
- **Policy:** `LicensePolicy`

#### Parameters [](#parameters-11)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The product ID | 
| `settings` | object | body | Yes | The license settings object | 
| `settings.enabled` | string | body | Yes | Enable licensing: `yes` or `no` | 
| `settings.version` | string | body | Conditional | Software version (required when `enabled` is `yes`) | 
| `settings.global_update_file` | string | body | No | ID of the downloadable file to use for auto-updates | 
| `settings.prefix` | string | body | No | License key prefix | 
| `settings.variations` | array | body | Yes | Per-variation license configuration | 
| `settings.variations[].variation_id` | integer | body | Yes | The variation ID | 
| `settings.variations[].activation_limit` | integer/string | body | No | Max site activations (empty or 0 = unlimited, must be >= 0) | 
| `settings.variations[].validity` | object | body | Yes | Validity period configuration | 
| `settings.variations[].validity.unit` | string | body | Conditional | Validity unit: `day`, `week`, `month`, `year`, or `lifetime` (required when `enabled` is `yes`) | 
| `settings.variations[].validity.value` | integer | body | No | Number of validity units (default: 1) | 
| `settings.wp` | object | body | No | WordPress update API settings | 
| `settings.wp.is_wp` | string | body | No | Whether this is a WordPress plugin/theme: `yes` or `no` | 
| `settings.wp.readme_url` | string | body | No | URL to the changelog/readme page | 
| `settings.wp.banner_url` | string | body | No | URL to the plugin banner image | 
| `settings.wp.icon_url` | string | body | No | URL to the plugin icon | 
| `settings.wp.required_php` | string | body | No | Minimum required PHP version | 
| `settings.wp.required_wp` | string | body | No | Minimum required WordPress version | 
| `settings.changelog` | string | body | No | HTML changelog content | 
| `settings.license_keys` | string | body | No | Pre-defined license keys | 
#### Response [](#response-11)
json
```
{
 "message": "Settings has been updated successfully."
}```

#### Error Response (422) [](#error-response-422)

For bundle products:json
```
{
 "message": "License settings cannot be saved for bundle products. Licenses are generated according to bundle items' license settings."
}```

#### Validation Errors [](#validation-errors)
json
```
{
 "errors": {
 "version": ["The version field is required."]
 }
}```

#### Example [](#example-11)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/licensing/products/10/settings" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "settings": {
 "enabled": "yes",
 "version": "1.3.0",
 "global_update_file": "file_abc123",
 "variations": [
 {
 "variation_id": 15,
 "activation_limit": 1,
 "validity": {
 "unit": "year",
 "value": 1
 }
 },
 {
 "variation_id": 16,
 "activation_limit": "",
 "validity": {
 "unit": "lifetime",
 "value": 1
 }
 }
 ],
 "wp": {
 "is_wp": "yes",
 "readme_url": "https://example.com/changelog",
 "banner_url": "https://example.com/banner.png",
 "icon_url": "https://example.com/icon.png",
 "required_php": "7.4",
 "required_wp": "5.6"
 },
 "changelog": "<h4>1.3.0</h4><ul><li>Performance improvements</li></ul>",
 "license_keys": ""
 }
 }'```

## Customer Portal [](#customer-portal)

Customer portal endpoints are authenticated via the logged-in WordPress user. The system resolves the customer from the current user session. Authorization is handled by the `CustomerFrontendPolicy`.
All customer portal license endpoints use the **license key** (not the numeric ID) for identification.
### List Customer Licenses [](#list-customer-licenses)
GET `/fluent-cart/v2/customer-profile/licenses/`
Retrieve a paginated list of licenses belonging to the currently logged-in customer.

- **Policy:** `CustomerFrontendPolicy`
- **Auth:** Logged-in WordPress user

#### Parameters [](#parameters-12)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `page` | integer | query | No | Page number for pagination (default: 1) | 
| `per_page` | integer | query | No | Number of records per page (default: 10) | 
#### Response [](#response-12)

If the user has no associated customer record, the endpoint returns an empty result set rather than an error:json
```
{
 "message": "Unable to find licenses",
 "licenses": {
 "data": [],
 "total": 0
 }
}```

Successful response with data:json
```
{
 "licenses": {
 "data": [
 {
 "license_key": "XXXX-XXXX-XXXX-XXXX",
 "status": "active",
 "expiration_date": "2026-01-15 00:00:00",
 "variation_id": 15,
 "activation_count": 2,
 "limit": 5,
 "product_id": 10,
 "created_at": "2025-01-15 10:30:00",
 "title": "My Plugin",
 "subtitle": "Pro License",
 "renewal_url": "",
 "has_upgrades": true,
 "order": {
 "uuid": "order-uuid-here"
 }
 }
 ],
 "total": 5,
 "per_page": 10,
 "current_page": 1,
 "last_page": 1
 }
}```

#### Response Fields [](#response-fields-1)

| Field | Type | Description | 
| --- | --- | --- |
| `license_key` | string | The license key | 
| `status` | string | Human-readable status: `active` or `expired` or `disabled` | 
| `expiration_date` | string/null | Expiration date in GMT, or `null` for lifetime licenses | 
| `activation_count` | integer | Current number of active site activations | 
| `limit` | integer | Maximum allowed activations (0 = unlimited) | 
| `title` | string | Product title | 
| `subtitle` | string | Product variation title | 
| `renewal_url` | string | URL to renew an expired subscription-based license (empty if not applicable) | 
| `has_upgrades` | boolean | Whether upgrade paths exist for this license's variation | 
| `order.uuid` | string | Parent order UUID | 
#### Example [](#example-12)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customer-profile/licenses/?page=1&per_page=10" \
 -H "X-WP-Nonce: <nonce>"```

### Get Customer License Details [](#get-customer-license-details)
GET `/fluent-cart/v2/customer-profile/licenses/{license_key}`
Retrieve full details of a specific license for the currently logged-in customer.

- **Policy:** `CustomerFrontendPolicy`
- **Auth:** Logged-in WordPress user

#### Parameters [](#parameters-13)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `license_key` | string | path | Yes | The license key (alphanumeric with dashes) | 
#### Response [](#response-13)
json
```
{
 "message": "Success",
 "license": {
 "license_key": "XXXX-XXXX-XXXX-XXXX",
 "status": "active",
 "expiration_date": "2026-01-15 00:00:00",
 "variation_id": 15,
 "activation_count": 2,
 "limit": 5,
 "product_id": 10,
 "created_at": "2025-01-15 10:30:00",
 "title": "My Plugin",
 "subtitle": "Pro License",
 "renewal_url": "",
 "has_upgrades": true,
 "order": {
 "uuid": "order-uuid-here"
 }
 },
 "section_parts": {
 "before_summary": "",
 "after_summary": "",
 "end_of_details": "",
 "additional_actions": ""
 }
}```

#### Response Fields [](#response-fields-2)

| Field | Type | Description | 
| --- | --- | --- |
| `license` | object | The formatted license details (see fields in List Customer Licenses) | 
| `section_parts` | object | HTML content blocks injected via the `fluent_cart/customer/license_details_section_parts` filter. Used by extensions to add custom UI sections | 
#### Error Response (422) [](#error-response-422-1)
json
```
{
 "message": "License not found"
}```

Customer not found:json
```
{
 "message": "Customer not found"
}```

#### Example [](#example-13)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customer-profile/licenses/XXXX-XXXX-XXXX-XXXX" \
 -H "X-WP-Nonce: <nonce>"```

### Get License Activations [](#get-license-activations)
GET `/fluent-cart/v2/customer-profile/licenses/{license_key}/activations`
Retrieve all site activations for a specific license belonging to the currently logged-in customer.

- **Policy:** `CustomerFrontendPolicy`
- **Auth:** Logged-in WordPress user

#### Parameters [](#parameters-14)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `license_key` | string | path | Yes | The license key (alphanumeric with dashes) | 
#### Response [](#response-14)
json
```
{
 "activations": [
 {
 "site_url": "example.com",
 "is_local": 0,
 "status": "active",
 "created_at": "2025-03-10 14:22:00"
 },
 {
 "site_url": "staging.example.com",
 "is_local": 1,
 "status": "active",
 "created_at": "2025-03-12 09:15:00"
 }
 ]
}```

#### Response Fields [](#response-fields-3)

| Field | Type | Description | 
| --- | --- | --- |
| `site_url` | string | The activated site URL (without protocol) | 
| `is_local` | integer | Whether this is a local/staging site (1) or production site (0). Local sites do not count toward the activation limit | 
| `status` | string | Activation status | 
| `created_at` | string | When the activation was created | 
#### Error Responses [](#error-responses)

License not found (422):json
```
{
 "message": "License not found"
}```

#### Example [](#example-14)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/customer-profile/licenses/XXXX-XXXX-XXXX-XXXX/activations" \
 -H "X-WP-Nonce: <nonce>"```

### Deactivate Site (Customer) [](#deactivate-site-customer)
POST `/fluent-cart/v2/customer-profile/licenses/{license_key}/deactivate_site`
Deactivate a specific site from a license. The customer can only deactivate sites from their own licenses.

- **Policy:** `CustomerFrontendPolicy`
- **Auth:** Logged-in WordPress user

#### Parameters [](#parameters-15)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `license_key` | string | path | Yes | The license key (alphanumeric with dashes) | 
| `site_url` | string | body | Yes | The site URL to deactivate | 
#### Response [](#response-15)
json
```
{
 "message": "Site deactivated successfully"
}```

#### Error Responses [](#error-responses-1)

License not found (422):json
```
{
 "message": "License not found"
}```

Site not found or not activated (422):json
```
{
 "message": "Site not found or not activated for this license"
}```

#### Example [](#example-15)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/customer-profile/licenses/XXXX-XXXX-XXXX-XXXX/deactivate_site" \
 -H "X-WP-Nonce: <nonce>" \
 -H "Content-Type: application/json" \
 -d '{"site_url": "example.com"}'```

## Plugin License Management [](#plugin-license-management)

These endpoints manage the FluentCart Pro plugin's own license activation on your WordPress site. They are used by the FluentCart Pro settings panel to activate, check, and deactivate the plugin license.
Authorization is handled by the `AdminPolicy` (requires WordPress administrator).
### Get Plugin License Status [](#get-plugin-license-status)
GET `/fluent-cart/v2/settings/license/`
Retrieve the current activation status of the FluentCart Pro plugin license on this site.

- **Policy:** `AdminPolicy`

#### Parameters [](#parameters-16)

None.
#### Response [](#response-16)
json
```
{
 "status": "valid",
 "license_key": "XXXX-XXXX-XXXX-XXXX",
 "expires": "2026-01-15",
 ...
}```

The response structure depends on the FluentCart licensing server's response format.
#### Example [](#example-16)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/settings/license/" \
 -u "username:app_password"```

### Activate Plugin License [](#activate-plugin-license)
POST `/fluent-cart/v2/settings/license/`
Activate a FluentCart Pro license key on this WordPress site.

- **Policy:** `AdminPolicy`

#### Parameters [](#parameters-17)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `license_key` | string | body | Yes | The FluentCart Pro license key to activate | 
#### Response [](#response-17)

On success:json
```
{
 "status": "valid",
 "license_key": "XXXX-XXXX-XXXX-XXXX",
 "notice": {
 "id": "fluent_cart_license_activated",
 "html": "<div>Your FluentCart Pro license has been activated successfully.</div>",
 "timeout": 5000
 },
 ...
}```

#### Error Response [](#error-response-1)

Returns a `WP_Error` if the license key is invalid or activation fails.
#### Example [](#example-17)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/settings/license/" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{"license_key": "XXXX-XXXX-XXXX-XXXX"}'```

### Deactivate Plugin License [](#deactivate-plugin-license)
DELETE `/fluent-cart/v2/settings/license/`
Deactivate the FluentCart Pro license from this WordPress site.

- **Policy:** `AdminPolicy`

#### Parameters [](#parameters-18)

None.
#### Response [](#response-18)
json
```
{
 "status": "deactivated",
 "notice": {
 "id": "activate_license",
 "html": "<div>License deactivation message</div>"
 },
 ...
}```

#### Example [](#example-18)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/settings/license/" \
 -u "username:app_password"```

## Public License API [](#public-license-api)

Not a REST API
The public license API does **not** use the WordPress REST API (`wp-json`). Instead, it uses query parameter-based URLs on the site's front end. No authentication is required -- these endpoints are designed to be called by your software products (plugins, themes, apps) from customer sites.
**Base URL:** `https://your-site.com/?fluent-cart={action}`
All public license API endpoints accept parameters via query strings (GET) or POST body, and return JSON responses. These are the endpoints your distributed software should call for license validation, activation, deactivation, version checking, and downloading updates.
### Check License [](#check-license)

`GET/POST` `https://your-site.com/?fluent-cart=check_license`
Verify the validity of a license key and check its activation status for a specific site.

- **Auth:** None required

#### Parameters [](#parameters-19)

| Parameter | Type | Required | Description | 
| --- | --- | --- | --- |
| `license_key` | string | Conditional | The license key to check. Required if `activation_hash` is not provided | 
| `activation_hash` | string | Conditional | The activation hash from a previous activation. Required if `license_key` is not provided | 
| `item_id` | string | Yes | The product ID (must match the license's product) | 
| `site_url` | string | Yes | The site URL making the request | 
#### Response (Valid License) [](#response-valid-license)
json
```
{
 "success": true,
 "status": "valid",
 "activation_limit": 5,
 "activation_hash": "abc123def456...",
 "activations_count": 2,
 "license_key": "XXXX-XXXX-XXXX-XXXX",
 "expiration_date": "2026-01-15 00:00:00",
 "product_id": 10,
 "variation_id": 15,
 "variation_title": "Pro License",
 "product_title": "My Plugin",
 "created_at": "2025-01-15 10:30:00",
 "updated_at": "2025-06-15 10:35:00"
}```

#### Response Fields [](#response-fields-4)

| Field | Type | Description | 
| --- | --- | --- |
| `status` | string | License status: `valid`, `expired`, or `invalid` | 
| `activation_limit` | integer | Maximum allowed site activations (0 = unlimited) | 
| `activation_hash` | string | Unique hash for this site's activation (empty if not activated) | 
| `activations_count` | integer | Current number of active site activations | 
| `license_key` | string | The license key | 
| `expiration_date` | string | Expiration date in GMT, or `lifetime` for non-expiring licenses | 
| `product_id` | string | The product ID | 
| `variation_id` | integer | The product variation ID | 
| `variation_title` | string | The product variation title | 
| `product_title` | string | The product title | 
#### Error Response (Validation) [](#error-response-validation)
json
```
{
 "success": true,
 "status": "invalid",
 "error_type": "validation_error",
 "message": "license_key, site_url and item_id is required"
}```

#### Error Types [](#error-types)

| `error_type` | Description | 
| --- | --- |
| `validation_error` | Missing required parameters | 
| `invalid_license` | License key not found | 
| `invalid_activation` | No activation found for this site | 
| `key_mismatch` | License key does not match the provided `item_id` | 
#### Example [](#example-19)
bash
```
curl -X GET "https://example.com/?fluent-cart=check_license&license_key=XXXX-XXXX-XXXX-XXXX&item_id=10&site_url=https://customer-site.com"```

### Activate License [](#activate-license)

`POST` `https://your-site.com/?fluent-cart=activate_license`
Activate a license key on a specific site URL. If the site is already activated for this license, the existing activation details are returned. Local/staging sites are detected automatically and do not count toward the activation limit.

- **Auth:** None required

#### Parameters [](#parameters-20)

| Parameter | Type | Required | Description | 
| --- | --- | --- | --- |
| `license_key` | string | Yes | The license key to activate | 
| `item_id` | string | Yes | The product ID (must match the license's product) | 
| `site_url` | string | Yes | The site URL to activate | 
| `server_version` | string | No | The server software version (e.g., PHP version) | 
| `platform_version` | string | No | The platform version (e.g., WordPress version) | 
#### Response (Success) [](#response-success)
json
```
{
 "success": true,
 "status": "valid",
 "activation_limit": 5,
 "activation_hash": "abc123def456...",
 "activations_count": 3,
 "license_key": "XXXX-XXXX-XXXX-XXXX",
 "expiration_date": "2026-01-15 00:00:00",
 "product_id": 10,
 "variation_id": 15,
 "variation_title": "Pro License",
 "product_title": "My Plugin",
 "created_at": "2025-01-15 10:30:00",
 "updated_at": "2025-06-15 10:35:00"
}```

Local/Staging Detection
Sites matching common local/staging patterns are automatically detected and marked with `is_local = 1`. These activations do not count toward the activation limit. Detected patterns include:

- **Subdomains:** `staging.`, `dev.`, `test.`, `qa.`, `sandbox.`, `beta.`, `preview.`, `uat.`, `development.`
- **Subfolders:** `/staging/`, `/dev/`, `/test/`, etc.
- **Domains:** `localhost`, `.wpengine.com`, `.kinsta.cloud`, `.cloudwaysapps.com`, `.pantheonsite.io`, and other popular hosting staging domains

#### Error Responses (422) [](#error-responses-422)

Missing required fields:json
```
{
 "success": false,
 "message": "license_key, site_url and item_id is required",
 "error_type": "validation_error"
}```

License not found:json
```
{
 "success": false,
 "message": "License not found",
 "error_type": "license_not_found"
}```

Product mismatch:json
```
{
 "success": false,
 "message": "This license key is not valid for this product. Did you provide the valid license key?",
 "error_type": "key_mismatch"
}```

License expired:json
```
{
 "success": false,
 "message": "The license key is expired. Please renew or purchase a new license",
 "error_type": "license_expired"
}```

License not active:json
```
{
 "success": false,
 "message": "The license is not Active. Please contact the support.",
 "error_type": "license_not_active"
}```

Activation limit reached:json
```
{
 "success": false,
 "message": "This license key has no activation limit. Please upgrade or purchase a new license.",
 "error_type": "activation_limit_exceeded"
}```

#### Error Types [](#error-types-1)

| `error_type` | Description | 
| --- | --- |
| `validation_error` | Missing required parameters | 
| `license_not_found` | License key does not exist | 
| `key_mismatch` | License key does not match the provided `item_id` | 
| `license_expired` | License has expired | 
| `license_not_active` | License status is not active (e.g., disabled) | 
| `activation_limit_exceeded` | No remaining activations available | 
| `activation_error` | General activation error (from filter) | 
#### Example [](#example-20)
bash
```
curl -X POST "https://example.com/?fluent-cart=activate_license" \
 -H "Content-Type: application/x-www-form-urlencoded" \
 -d "license_key=XXXX-XXXX-XXXX-XXXX&item_id=10&site_url=https://customer-site.com&server_version=8.1&platform_version=6.4"```

### Deactivate License [](#deactivate-license)

`POST` `https://your-site.com/?fluent-cart=deactivate_license`
Deactivate a license from a specific site URL. Removes the site activation and decrements the activation count.

- **Auth:** None required

#### Parameters [](#parameters-21)

| Parameter | Type | Required | Description | 
| --- | --- | --- | --- |
| `license_key` | string | Yes | The license key to deactivate | 
| `item_id` | string | Yes | The product ID (must match the license's product) | 
| `site_url` | string | Yes | The site URL to deactivate | 
#### Response (Success) [](#response-success-1)
json
```
{
 "success": true,
 "status": "deactivated",
 "activation_limit": 5,
 "activations_count": 2,
 "expiration_date": "2026-01-15 00:00:00",
 "product_id": 10,
 "variation_id": 15,
 "product_title": "My Plugin",
 "variation_title": "Pro License",
 "created_at": "2025-01-15 10:30:00",
 "updated_at": "2025-06-15 10:35:00"
}```

#### Error Responses (422) [](#error-responses-422-1)

Missing required fields:json
```
{
 "success": false,
 "message": "license_key, site_url and item_id is required",
 "error_type": "validation_error"
}```

License not found or product mismatch:json
```
{
 "success": false,
 "message": "License not found or does not match with the item_id",
 "error_type": "license_not_found"
}```

Site not found:json
```
{
 "success": false,
 "message": "Site not found",
 "error_type": "site_not_found"
}```

#### Example [](#example-21)
bash
```
curl -X POST "https://example.com/?fluent-cart=deactivate_license" \
 -H "Content-Type: application/x-www-form-urlencoded" \
 -d "license_key=XXXX-XXXX-XXXX-XXXX&item_id=10&site_url=https://customer-site.com"```

### Get License Version [](#get-license-version)

`GET/POST` `https://your-site.com/?fluent-cart=get_license_version`
Retrieve the latest version information for a licensed product. This endpoint is designed to integrate with WordPress plugin/theme update mechanisms. It returns version data, changelog, download links, and banner/icon URLs.

- **Auth:** None required

#### Parameters [](#parameters-22)

| Parameter | Type | Required | Description | 
| --- | --- | --- | --- |
| `item_id` | string | Yes | The product ID | 
| `license_key` | string | Conditional | License key for authenticated download links. Required if `activation_hash` is not provided | 
| `activation_hash` | string | Conditional | Activation hash for authenticated download links. Required if `license_key` is not provided | 
| `site_url` | string | No | The site URL making the request | 
#### Response (Valid License) [](#response-valid-license-1)
json
```
{
 "success": true,
 "new_version": "1.3.0",
 "stable_version": "1.3.0",
 "name": "My Plugin",
 "slug": "my-plugin",
 "url": "https://example.com/my-plugin",
 "last_updated": "2025-06-15 10:30:00",
 "homepage": "https://example.com/my-plugin",
 "package": "https://example.com/?fluent-cart=download_license_package&fct_package=...",
 "download_link": "https://example.com/?fluent-cart=download_license_package&fct_package=...",
 "trunk": "https://example.com/?fluent-cart=download_license_package&fct_package=...",
 "license_status": "valid",
 "sections": {
 "description": "Product description here",
 "changelog": "<h4>1.3.0</h4><ul><li>New feature</li></ul>"
 },
 "banners": {
 "low": "https://example.com/banner.png",
 "high": "https://example.com/banner.png"
 },
 "icons": {
 "2x": "https://example.com/icon.png",
 "1x": "https://example.com/icon.png"
 }
}```

#### Response (Invalid License) [](#response-invalid-license)

When the license is invalid or expired, version information is still returned but without download links:json
```
{
 "success": true,
 "new_version": "1.3.0",
 "stable_version": "1.3.0",
 "name": "My Plugin",
 "slug": "my-plugin",
 "package": "",
 "download_link": "",
 "license_message": "Invalid License Key",
 "license_status": "invalid",
 "sections": { ... },
 "banners": { ... },
 "icons": { ... }
}```

Download Link Expiry
The `package` / `download_link` URL contains a time-limited token that expires after 48 hours. WordPress will use this URL to download the update package.
#### Error Response (422) [](#error-response-422-2)

Product not found:json
```
{
 "success": false,
 "message": "Product not found",
 "error_type": "product_not_found"
}```

Licensing not enabled:json
```
{
 "success": false,
 "message": "License is not enabled for this product",
 "error_type": "license_not_enabled"
}```

License settings not found:json
```
{
 "success": false,
 "message": "License settings not found for this product",
 "error_type": "license_settings_not_found"
}```

#### Example [](#example-22)
bash
```
curl -X GET "https://example.com/?fluent-cart=get_license_version&item_id=10&license_key=XXXX-XXXX-XXXX-XXXX&site_url=https://customer-site.com"```

### Download License Package [](#download-license-package)

`GET` `https://your-site.com/?fluent-cart=download_license_package`
Download the product's update package file. This endpoint is not called directly -- it is used via the signed URLs generated by the [Get License Version](#get-license-version) endpoint. The URL contains an encoded token (`fct_package`) that includes the license key, activation hash, site URL, product ID, and expiration timestamp.

- **Auth:** None required (authentication is embedded in the signed URL)

#### Parameters [](#parameters-23)

| Parameter | Type | Required | Description | 
| --- | --- | --- | --- |
| `fct_package` | string | Yes | Base64-encoded package data containing license credentials and expiration. This is automatically generated by the version check endpoint | 
#### Response [](#response-19)

On success, the endpoint responds with an HTTP 302 redirect to the signed download URL for the file. The browser or update mechanism follows the redirect to download the file.
#### Error Responses (422) [](#error-responses-422-2)

Invalid package data:json
```
{
 "success": false,
 "message": "Invalid package data",
 "error_type": "invalid_package_data"
}```

Invalid license:json
```
{
 "success": false,
 "message": "This license key is not valid",
 "error_type": "expired_license"
}```

No downloadable file:json
```
{
 "success": false,
 "message": "No downloadable file found for this product",
 "error_type": "downloadable_file_not_found"
}```

#### Example [](#example-23)

This endpoint is typically not called directly. It is accessed via the `package` URL returned by the version check endpoint:
```
https://example.com/?fluent-cart=download_license_package&fct_package=WFhYWC1YWFhYLVhYWFgtWFhYWDo6Y3VzdG9tZXItc2l0ZS5jb206MTA6MTczNzAwMDAwMA==```

## License Statuses [](#license-statuses)

| Status | Description | 
| --- | --- |
| `active` | License is valid and in use | 
| `inactive` | License is valid but has no site activations | 
| `expired` | License expiration date has passed (includes a configurable grace period, default 15 days) | 
| `disabled` | License has been manually disabled by an admin | 
### Public Status Mapping [](#public-status-mapping)

The public license API returns simplified statuses:

| Internal Status | Public Status | 
| --- | --- |
| `active` (not expired) | `valid` | 
| `inactive` (not expired) | `valid` | 
| `expired` | `expired` | 
| `disabled` | `invalid` | 
## Hooks and Filters [](#hooks-and-filters)

| Hook | Type | Description | 
| --- | --- | --- |
| `fluent_cart/license/check_license_response` | filter | Modify the check license response before returning | 
| `fluent_cart/license/activate_license_response` | filter | Modify the activate license response before returning | 
| `fluent_cart/license/deactivate_license_response` | filter | Modify the deactivate license response before returning | 
| `fluent_cart/license/get_version_response` | filter | Modify the version check response before returning | 
| `fluent_cart/license/checking_error` | filter | Modify error responses during license checking | 
| `fluent_cart/license/check_item_id` | filter | Control whether `item_id` validation is enforced | 
| `fluent_cart/license/site_activated` | action | Fired after a site is successfully activated | 
| `fluent_cart/license/site_deactivated` | action | Fired after a site is successfully deactivated | 
| `fluent_cart/license/santized_url` | filter | Modify the sanitized site URL | 
| `fluent_cart/license/staging_subdomain_patterns` | filter | Customize subdomain patterns for local site detection | 
| `fluent_cart/license/staging_subfolder_patterns` | filter | Customize subfolder patterns for local site detection | 
| `fluent_cart/license/staging_domains` | filter | Customize domain patterns for local site detection | 
| `fluent_cart/license/is_staging_site_result` | filter | Override the final local site detection result | 
| `fluent_cart/license/grace_period_in_days` | filter | Change the license expiration grace period (default: 15 days) | 
| `fluent_cart/license/validity_by_variation` | filter | Modify validity settings for a variation during save | 
| `fluent_cart/license/default_validity_by_variation` | filter | Modify the default validity for a new variation | 
| `fluent_cart/license/expiration_date_by_variation` | filter | Modify the calculated expiration timestamp | 
| `fluent_cart/customer/license_details_section_parts` | filter | Add custom HTML sections to the customer portal license detail view | 
| `fluent_cart/licenses_list_filter_query` | filter | Modify the license list query before execution | 
| `fluent_cart_sl/license_deleted` | action | Fired after a license is deleted | 
| `fluent_cart_sl/license_status_updated` | action | Fired after a license status changes | 
| `fluent_cart_sl/license_key_regenerated` | action | Fired after a license key is regenerated | 
| `fluent_cart_sl/license_validity_extended` | action | Fired after a license expiration date is changed | 
| `fluent_cart_sl/license_limit_increased` | action | Fired after a license activation limit is changed | 
| `fluent_cart_sl/site_license_deactivated` | action | Fired after a customer deactivates a site from the portal |

---

## Roles

Source: https://dev.fluentcart.com/restapi/roles.html


Pro Feature
All roles and permissions endpoints require FluentCart Pro.
Manage custom roles, assign permissions, and control user access to FluentCart features.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2/roles`
**Policy:** `AdminPolicy`
The `AdminPolicy` requires the current user to have the `is_super_admin` permission (WordPress `manage_options` capability). All endpoints in this group are restricted to site administrators.
## List Managers [](#list-managers)
GET `/fluent-cart/v2/roles/managers`
Retrieve a list of all WordPress users who have been assigned a FluentCart shop role. Returns user details along with their assigned role and resolved permissions.
### Response [](#response)
json
```
{
 "managers": [
 {
 "id": 5,
 "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)",
 "display_name": "Jane Manager",
 "username": "janemanager",
 "shop_role": "manager",
 "description": "With All Permissions Except Sensitive Settings",
 "registered_at": "2025-03-10 08:00:00",
 "role_permissions": [
 "store/settings",
 "products/view",
 "products/create",
 "products/edit",
 "products/delete",
 "customers/view",
 "customers/manage",
 "customers/delete",
 "orders/view",
 "orders/manage_statuses",
 "orders/can_refund",
 "orders/manage",
 "orders/export",
 "orders/delete",
 "subscriptions/view",
 "subscriptions/manage",
 "subscriptions/delete",
 "licenses/view",
 "licenses/manage",
 "licenses/delete",
 "coupons/view",
 "coupons/manage",
 "coupons/delete",
 "reports/view",
 "reports/export",
 "integrations/view",
 "integrations/manage",
 "integrations/delete"
 ]
 }
 ]
}```

### Response Fields [](#response-fields)

| Field | Type | Description | 
| --- | --- | --- |
| `id` | integer | WordPress user ID | 
| `email` | string | User email address | 
| `display_name` | string | WordPress display name | 
| `username` | string | WordPress login username | 
| `shop_role` | string | Assigned FluentCart role key (e.g., `manager`, `worker`, `accountant`) | 
| `description` | string | Human-readable description of the role | 
| `registered_at` | string | WordPress user registration date | 
| `role_permissions` | array | Resolved list of permission strings for this user's role | 
### Example [](#example)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/roles/managers" \
 -u "username:app_password"```

## Search Users [](#search-users)
GET `/fluent-cart/v2/roles/user-list`
Search for WordPress users who can be assigned a FluentCart role. Returns users matching the search query, excluding those who already have a WordPress administrator role.
### Parameters [](#parameters)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `search` | string | query | No | Search by display name or email address. Partial matches supported. | 
| `user_ids` | string/array | query | No | Comma-separated user IDs to include in results regardless of search filter | 
### Response [](#response-1)
json
```
{
 "users": {
 "total": 25,
 "per_page": 15,
 "current_page": 1,
 "last_page": 2,
 "data": [
 {
 "ID": 10,
 "name": "Alice Johnson",
 "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)"
 },
 {
 "ID": 15,
 "name": "Bob Wilson",
 "email": "[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)"
 }
 ]
 }
}```

### Response Fields [](#response-fields-1)

| Field | Type | Description | 
| --- | --- | --- |
| `ID` | integer | WordPress user ID | 
| `name` | string | WordPress display name | 
| `email` | string | User email address | 
Users who already have the WordPress `manage_options` capability (administrators) are excluded from results, as they automatically have full FluentCart access.
### Example [](#example-1)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/roles/user-list?search=alice" \
 -u "username:app_password"```

## List Roles [](#list-roles)
GET `/fluent-cart/v2/roles`
Retrieve all available FluentCart roles with their titles and descriptions. This returns the role definitions (not user assignments).
### Response [](#response-2)
json
```
{
 "roles": {
 "super_admin": {
 "title": "Super Admin",
 "description": "With All Permissions"
 },
 "manager": {
 "title": "Manager",
 "description": "With All Permissions Except Sensitive Settings"
 },
 "worker": {
 "title": "Worker",
 "description": "View Access for products, customers, coupons, integrations. Manage Access for Order Statuses"
 },
 "accountant": {
 "title": "Accountant",
 "description": "View Access for products, customers, orders, subscriptions, licenses, coupons, reports and integrations"
 }
 }
}```

### Example [](#example-2)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/roles" \
 -u "username:app_password"```

## Assign Role [](#assign-role)
POST `/fluent-cart/v2/roles`
Assign a FluentCart role to a WordPress user. The user receives the `fluent_cart_admin` capability and their role is stored as user meta. If the user already has an assigned role, it is replaced.
### Parameters [](#parameters-1)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `user_id` | integer | body | Yes | WordPress user ID. Must reference an existing user. | 
| `role_key` | string | body | Yes | The role key to assign. Must be one of the valid role keys returned by the List Roles endpoint (e.g., `super_admin`, `manager`, `worker`, `accountant`). Max 50 characters. | 
### Response [](#response-3)

**Success (200):**json
```
{
 "message": "Role synced successfully",
 "is_updated": true
}```

### Error Responses [](#error-responses)

| Scenario | Message | 
| --- | --- |
| User not found | User not found. | 
| Invalid role key | Invalid role. | 
| User is WP administrator | The user already has all the accesses as part of Administrator Role | 
### Validation Rules [](#validation-rules)

| Field | Rule | Message | 
| --- | --- | --- |
| `user_id` | required, must exist as user | Title is required. | 
| `role_key` | required, string, max:50, must be valid role | Key is required. | 
### Example [](#example-3)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/roles" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "user_id": 10,
 "role_key": "manager"
 }'```

## Get Role [](#get-role)
GET `/fluent-cart/v2/roles/{key}`
Retrieve details for a specific role by its key.
### Parameters [](#parameters-2)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `key` | string | path | Yes | The role key (e.g., `manager`, `worker`, `accountant`) | 
This endpoint is currently a placeholder and returns no data. It is reserved for future use.
### Example [](#example-4)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/roles/manager" \
 -u "username:app_password"```

## Update Role [](#update-role)
POST `/fluent-cart/v2/roles/{key}`
Update a specific role definition.
### Parameters [](#parameters-3)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `key` | string | path | Yes | The role key to update | 
This endpoint is currently a placeholder and returns no data. It is reserved for future use.
### Example [](#example-5)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/roles/manager" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{}'```

## Delete Role Assignment [](#delete-role-assignment)
DELETE `/fluent-cart/v2/roles/{key}`
Remove a FluentCart role assignment from a user. The user's `fluent_cart_admin` capability is removed and their role meta is deleted. The user's WordPress account is not affected.
### Parameters [](#parameters-4)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `key` | string | path | Yes | The role key to remove (e.g., `manager`, `worker`) | 
| `user_id` | integer | body/query | Yes | The WordPress user ID to remove the role from | 
### Response [](#response-4)

**Success (200):**json
```
{
 "message": "Role deleted successfully"
}```

### Error Responses [](#error-responses-1)

| Scenario | Message | 
| --- | --- |
| Missing role key | Role key is required | 
| User not found | User not found | 
| User is WP administrator | The user already has all the accesses as part of Administrator Role | 
### Example [](#example-6)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/roles/manager" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "user_id": 10
 }'```

## Role Definitions [](#role-definitions)

FluentCart includes four built-in roles with predefined permission sets:
### super_admin [](#super-admin)

Full access to all FluentCart features and settings.

| Category | Permissions | 
| --- | --- |
| Store | `store/settings`, `store/sensitive` | 
| Products | `products/view`, `products/create`, `products/edit`, `products/delete` | 
| Customers | `customers/view`, `customers/manage`, `customers/delete` | 
| Orders | `orders/view`, `orders/create`, `orders/manage_statuses`, `orders/manage`, `orders/can_refund`, `orders/export`, `orders/delete` | 
| Subscriptions | `subscriptions/view`, `subscriptions/manage`, `subscriptions/delete` | 
| Licenses | `licenses/view`, `licenses/manage`, `licenses/delete` | 
| Coupons | `coupons/view`, `coupons/manage`, `coupons/delete` | 
| Reports | `reports/view`, `reports/export` | 
| Integrations | `integrations/view`, `integrations/manage`, `integrations/delete` | 
| Labels | `labels/view`, `labels/manage`, `labels/delete` | 
| Dashboard | `dashboard_stats/view` | 
### manager [](#manager)

All permissions except sensitive store settings (`store/sensitive`).
### worker [](#worker)

Limited access focused on day-to-day operations:

- View products, customers, orders, subscriptions, licenses, integrations
- Manage order statuses
- View and manage coupons

### accountant [](#accountant)

Read-only access with export capabilities:

- View products, customers, orders, subscriptions, licenses, coupons, integrations
- View and export orders
- View and export reports

## Related Hooks [](#related-hooks)

| Hook | Type | Description | 
| --- | --- | --- |
| `fluent_cart/permission/all_roles` | Filter | Modify or extend the available role definitions. Receives the roles array. |

---

## Order Bumps

Source: https://dev.fluentcart.com/restapi/order-bumps.html


Pro Feature
All order bump endpoints require FluentCart Pro.
Create and manage order bump promotions that appear during checkout to increase average order value.
**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2/order_bump`
**Policy:** `OrderBumpPolicy`

- **Permission:** `store/sensitive`

All monetary values are in **cents** (e.g., `$10.00` = `1000`).
## List Order Bumps [](#list-order-bumps)
GET `/fluent-cart/v2/order_bump`
Retrieve a paginated list of order bumps with optional filtering, sorting, and search.

- **Permission:** `store/sensitive`

### Parameters [](#parameters)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `sort_by` | string | query | No | Column to sort by (default: `id`) | 
| `sort_type` | string | query | No | Sort direction: `asc` or `desc` (default: `desc`) | 
| `active_view` | string | query | No | Filter by status tab. One of: `active`, `draft` | 
| `search` | string | query | No | Search by order bump title or description. Partial matches supported. | 
| `page` | integer | query | No | Page number for pagination | 
| `per_page` | integer | query | No | Number of records per page | 
### Active View Filters [](#active-view-filters)

| View | Behavior | 
| --- | --- |
| `active` | Order bumps where `status = 'active'` | 
| `draft` | Order bumps where `status = 'draft'` | 
### Response [](#response)
json
```
{
 "order_bumps": {
 "total": 5,
 "per_page": 15,
 "current_page": 1,
 "last_page": 1,
 "data": [
 {
 "id": 1,
 "hash": "a1b2c3d4e5f6...",
 "parent_id": null,
 "type": "order_bump",
 "status": "active",
 "src_object_id": 42,
 "src_object_type": null,
 "title": "Add Extended Warranty",
 "description": "<p>Protect your purchase with our 2-year warranty plan.</p>",
 "conditions": [],
 "config": {
 "discount": {
 "discount_type": "percentage",
 "discount_amount": 10
 },
 "display_conditions_if": "",
 "call_to_action": "Yes, add warranty!"
 },
 "priority": 1,
 "created_at": "2025-06-01 10:00:00",
 "updated_at": "2025-06-15 14:30:00",
 "product_variant": {
 "id": 42,
 "product_id": 10,
 "title": "Extended Warranty - 2 Year",
 "price": 2999,
 "product": {
 "id": 10,
 "title": "Extended Warranty",
 "status": "publish"
 }
 }
 }
 ]
 }
}```

**Notes:**

- Each order bump eagerly loads its associated `product_variant` and the variant's parent `product`.
- The `config` and `conditions` fields are automatically JSON-decoded.

### Example [](#example)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/order_bump?active_view=active&sort_by=priority&sort_type=asc" \
 -u "username:app_password"```

## Create Order Bump [](#create-order-bump)
POST `/fluent-cart/v2/order_bump`
Create a new order bump promotion. The order bump is created with minimal data (title and source variant) and can be fully configured via the Update endpoint.

- **Permission:** `store/sensitive`

### Parameters [](#parameters-1)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `title` | string | body | Yes | Display title for the order bump. | 
| `src_object_id` | integer | body | Yes | The product variation ID that this order bump offers. Must reference an existing product variation. | 
### Response [](#response-1)

**Success (200):**json
```
{
 "message": "Order bump created successfully",
 "id": 5
}```

### Error Responses [](#error-responses)

| Code | Message | 
| --- | --- |
| 400 | Title and source object id are required | 
| 400 | Failed to create order bump | 
### Auto-Generated Fields [](#auto-generated-fields)

The following fields are automatically set on creation:

| Field | Value | 
| --- | --- |
| `type` | `order_bump` | 
| `hash` | Auto-generated MD5 hash (unique identifier) | 
| `conditions` | Empty JSON array `[]` | 
| `config` | Empty JSON object `{}` | 
### Example [](#example-1)
bash
```
curl -X POST "https://example.com/wp-json/fluent-cart/v2/order_bump" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "title": "Add Extended Warranty",
 "src_object_id": 42
 }'```

## Get Order Bump [](#get-order-bump)
GET `/fluent-cart/v2/order_bump/{id}`
Retrieve detailed information about a specific order bump, including its configuration, conditions, and associated product variant.

- **Permission:** `store/sensitive`

### Parameters [](#parameters-2)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The order bump ID | 
### Response [](#response-2)
json
```
{
 "order_bump": {
 "id": 1,
 "hash": "a1b2c3d4e5f6...",
 "parent_id": null,
 "type": "order_bump",
 "status": "active",
 "src_object_id": 42,
 "src_object_type": null,
 "title": "Add Extended Warranty",
 "description": "<p>Protect your purchase with our 2-year warranty plan.</p>",
 "conditions": [
 {
 "type": "product",
 "operator": "in",
 "values": [10, 15]
 }
 ],
 "config": {
 "discount": {
 "discount_type": "percentage",
 "discount_amount": 10
 },
 "display_conditions_if": "",
 "call_to_action": "Yes, add warranty!"
 },
 "priority": 1,
 "created_at": "2025-06-01 10:00:00",
 "updated_at": "2025-06-15 14:30:00"
 },
 "variant": {
 "id": 42,
 "product_id": 10,
 "title": "Extended Warranty - 2 Year",
 "price": 2999,
 "product": {
 "id": 10,
 "title": "Extended Warranty",
 "status": "publish"
 }
 }
}```

### Default Config [](#default-config)

If the order bump has no saved configuration, the following defaults are returned:json
```
{
 "discount": {
 "discount_type": "percentage",
 "discount_amount": 0
 },
 "display_conditions_if": "",
 "call_to_action": ""
}```

### Error Responses [](#error-responses-1)

| Code | Message | 
| --- | --- |
| 404 | Order bump not found | 
### Example [](#example-2)
bash
```
curl -X GET "https://example.com/wp-json/fluent-cart/v2/order_bump/1" \
 -u "username:app_password"```

## Update Order Bump [](#update-order-bump)
PUT `/fluent-cart/v2/order_bump/{id}`
Update an existing order bump's configuration, conditions, status, and display settings.

- **Permission:** `store/sensitive`

### Parameters [](#parameters-3)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The order bump ID | 
| `title` | string | body | Yes | Display title. Max 194 characters. | 
| `src_object_id` | integer | body | Yes | Product variation ID for the bump offer. | 
| `status` | string | body | No | Order bump status. One of: `active`, `draft`. Max 50 characters. | 
| `src_object_type` | string | body | No | Source object type identifier. Max 50 characters. | 
| `description` | string | body | No | HTML description displayed to the customer. Sanitized with `wp_kses_post`. | 
| `config` | object | body | No | Configuration object (see Config Object below). | 
| `conditions` | array | body | No | Array of display condition objects (see Conditions below). | 
| `priority` | integer | body | No | Display priority. Lower numbers appear first. Min: 1. | 
### Config Object [](#config-object)

| Field | Type | Description | 
| --- | --- | --- |
| `discount` | object | Discount settings for the bump offer | 
| `discount.discount_type` | string | Discount type. One of: `percentage`, `fixed` | 
| `discount.discount_amount` | number | Discount amount. For `percentage`: value 0-100. For `fixed`: amount in cents. | 
| `display_conditions_if` | string | Logical operator for combining conditions | 
| `call_to_action` | string | Button or checkbox text shown to the customer | 
### Conditions [](#conditions)

The `conditions` field accepts an array of condition objects that control when the order bump is displayed during checkout. Each condition object defines a rule based on cart contents or customer attributes.
### Response [](#response-3)

**Success (200):**json
```
{
 "message": "Order bump updated successfully"
}```

### Error Responses [](#error-responses-2)

| Code | Message | 
| --- | --- |
| 400 | Failed to update order bump | 
### Validation Rules [](#validation-rules)

| Field | Rule | 
| --- | --- |
| `title` | required, sanitized text, max 194 characters | 
| `src_object_id` | required, numeric | 
| `status` | nullable, sanitized text, max 50 characters | 
| `src_object_type` | nullable, sanitized text, max 50 characters | 
| `description` | nullable, HTML sanitized via `wp_kses_post` | 
| `config` | nullable, array | 
| `conditions` | nullable, array | 
| `priority` | nullable, numeric, min 1 | 
### Example [](#example-3)
bash
```
curl -X PUT "https://example.com/wp-json/fluent-cart/v2/order_bump/1" \
 -u "username:app_password" \
 -H "Content-Type: application/json" \
 -d '{
 "title": "Add Extended Warranty",
 "src_object_id": 42,
 "status": "active",
 "description": "<p>Protect your purchase with our 2-year extended warranty.</p>",
 "priority": 1,
 "config": {
 "discount": {
 "discount_type": "percentage",
 "discount_amount": 10
 },
 "display_conditions_if": "",
 "call_to_action": "Yes, add warranty!"
 },
 "conditions": []
 }'```

## Delete Order Bump [](#delete-order-bump)
DELETE `/fluent-cart/v2/order_bump/{id}`
Permanently delete an order bump.

- **Permission:** `store/sensitive`

### Parameters [](#parameters-4)

| Parameter | Type | Location | Required | Description | 
| --- | --- | --- | --- | --- |
| `id` | integer | path | Yes | The order bump ID | 
### Response [](#response-4)

**Success (200):**json
```
{
 "message": "Order bump deleted successfully"
}```

### Error Responses [](#error-responses-3)

| Code | Message | 
| --- | --- |
| 400 | Failed to delete order bump | 
### Example [](#example-4)
bash
```
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/order_bump/1" \
 -u "username:app_password"```

## Order Bump Model Reference [](#order-bump-model-reference)

### Statuses [](#statuses)

| Status | Description | 
| --- | --- |
| `active` | Order bump is live and displayed during checkout | 
| `draft` | Order bump is saved but not displayed | 
### Database Table [](#database-table)

Order bumps are stored in the `fct_order_promotions` table with `type = 'order_bump'`:

| Column | Type | Description | 
| --- | --- | --- |
| `id` | BIGINT (PK) | Auto-increment ID | 
| `hash` | VARCHAR | Auto-generated unique hash identifier | 
| `parent_id` | BIGINT | Parent promotion ID (nullable) | 
| `type` | VARCHAR | Promotion type (always `order_bump` for this API) | 
| `status` | VARCHAR | Promotion status (`active`, `draft`) | 
| `src_object_id` | BIGINT | Product variation ID being offered | 
| `src_object_type` | VARCHAR | Source object type identifier | 
| `title` | VARCHAR | Display title | 
| `description` | TEXT | HTML description shown to customers | 
| `conditions` | TEXT (JSON) | JSON-encoded array of display conditions | 
| `config` | TEXT (JSON) | JSON-encoded configuration object | 
| `priority` | INT | Display priority ordering | 
| `created_at` | DATETIME | Creation timestamp (GMT) | 
| `updated_at` | DATETIME | Last update timestamp (GMT) | 
### Relationships [](#relationships)

| Relation | Type | Description | 
| --- | --- | --- |
| `product_variant` | BelongsTo | The product variation offered by this bump (`src_object_id` -> `fct_product_variations.id`) | 
## Permissions Reference [](#permissions-reference)

| Endpoint | Permission | 
| --- | --- |
| `GET /order_bump` | `store/sensitive` | 
| `POST /order_bump` | `store/sensitive` | 
| `GET /order_bump/{id}` | `store/sensitive` | 
| `PUT /order_bump/{id}` | `store/sensitive` | 
| `DELETE /order_bump/{id}` | `store/sensitive` |

---

