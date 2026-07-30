# Filter Hooks: Orders & Payments

All filters related to Order lifecycle, payment processing, gateway integrations, and taxes.

---

## Order Statuses

### `order_statuses`
`fluent_cart/order_statuses` — Filter available order statuses

* **When it runs:** Applied when retrieving the list of available order statuses throughout the admin and storefront.
* **Source:** `app/Helpers/Status.php` (line 159)

#### Parameters:
* `$statuses` *(array)* — Associative array of order statuses (`'processing' => 'Processing'`, `'completed' => 'Completed'`, etc.)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified order statuses array

#### Usage Example:
```php
// Filter available order statuses array in FluentCart
add_filter('fluent_cart/order_statuses', function ($statuses, $data) {
    // Add custom "Awaiting Pickup" order status
    $statuses['awaiting_pickup'] = __('Awaiting Pickup', 'my-plugin');
    return $statuses;
}, 10, 2);
```

---

### `order_statuses` (legacy)
`fluent-cart/order_statuses` — Filter order statuses (legacy hook name)

* **When it runs:** Legacy location of the order statuses filter. Applied in the older Helper class. Prefer `fluent_cart/order_statuses` for new code.
* **Source:** `app/Helpers/Helper.php` (line 140)

#### Parameters:
* `$statuses` *(array)* — Associative array of order statuses
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified order statuses array

#### Usage Example:
```php
// Filter order statuses using legacy hyphenated hook name
add_filter('fluent-cart/order_statuses', function ($statuses, $data) {
    // Add custom status to legacy order statuses array
    $statuses['custom'] = __('Custom Status', 'my-plugin');
    return $statuses;
}, 10, 2);
```

---

### `editable_order_statuses`
`fluent-cart/editable_order_statuses` — Filter manually settable order statuses

* **When it runs:** Applied when building the list of order statuses an admin can manually set on an order. This controls the dropdown options in the order edit screen. Note the hyphenated prefix (`fluent-cart/`).
* **Source:** `app/Helpers/Helper.php` (line 151), `app/Helpers/Status.php` (lines 170, 242)

#### Parameters:
* `$statuses` *(array)* — Associative array of editable statuses (`on-hold`, `processing`, `completed`, `canceled`)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified editable order statuses array

#### Usage Example:
```php
// Filter manually editable order statuses for admin dropdown
add_filter('fluent-cart/editable_order_statuses', function ($statuses, $data) {
    // Remove "canceled" status from manually selectable options
    unset($statuses['canceled']);
    return $statuses;
}, 10, 2);
```

---

### `payment_statuses`
`fluent_cart/payment_statuses` — Filter payment statuses

* **When it runs:** Applied when retrieving the list of available payment statuses used across the order and transaction system.
* **Source:** `app/Helpers/Status.php` (line 183)

#### Parameters:
* `$statuses` *(array)* — Associative array of payment statuses (`pending`, `paid`, `partially_paid`, `failed`, `refunded`, `partially_refunded`, `authorized`)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified payment statuses array

#### Usage Example:
```php
// Filter available payment statuses across order and transaction systems
add_filter('fluent_cart/payment_statuses', function ($statuses, $data) {
    // Add custom "On Hold" payment status
    $statuses['on_hold'] = __('On Hold', 'my-plugin');
    return $statuses;
}, 10, 2);
```

---

### `transaction_statuses`
`fluent_cart/transaction_statuses` — Filter transaction statuses

* **When it runs:** Applied when retrieving available transaction statuses for the primary transaction system.
* **Source:** `app/Helpers/Status.php` (line 197)

#### Parameters:
* `$statuses` *(array)* — Associative array of transaction statuses (`pending`, `succeeded`, `authorized`, `failed`, `refunded`)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified transaction statuses array

#### Usage Example:
```php
// Filter primary transaction system statuses array
add_filter('fluent_cart/transaction_statuses', function ($statuses, $data) {
    // Add custom "Disputed" transaction status
    $statuses['disputed'] = __('Disputed', 'my-plugin');
    return $statuses;
}, 10, 2);
```

---

### `transaction_statuses` (legacy)
`fluent-cart/transaction_statuses` — Filter transaction statuses (legacy hook name)

* **When it runs:** Legacy location of the transaction statuses filter. Applied in the older Helper class. Prefer `fluent_cart/transaction_statuses` for new code.
* **Source:** `app/Helpers/Helper.php` (line 215)

#### Parameters:
* `$statuses` *(array)* — Associative array of transaction statuses
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified transaction statuses array

#### Usage Example:
```php
// Filter transaction statuses using legacy hyphenated hook name
add_filter('fluent-cart/transaction_statuses', function ($statuses, $data) {
    // Return modified transaction statuses array
    return $statuses;
}, 10, 2);
```

---

### `editable_transaction_statuses`
`fluent-cart/editable_transaction_statuses` — Filter manually editable transaction statuses

* **When it runs:** Applied when building the list of transaction statuses that an admin can manually set. Note the hyphenated prefix (`fluent-cart/`).
* **Source:** `app/Helpers/Helper.php` (line 233), `app/Helpers/Status.php` (line 214)

#### Parameters:
* `$statuses` *(array)* — Associative array of editable transaction statuses
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified editable transaction statuses array

#### Usage Example:
```php
// Filter manually editable transaction statuses for admin dropdown
add_filter('fluent-cart/editable_transaction_statuses', function ($statuses, $data) {
    // Remove "refunded" status from manually selectable transaction statuses
    unset($statuses['refunded']);
    return $statuses;
}, 10, 2);
```

---

### `transaction_success_statuses`
`fluent_cart/transaction_success_statuses` — Filter which statuses count as successful transactions

* **When it runs:** Applied when determining which transaction statuses should be considered "successful" for reporting and order completion logic.
* **Source:** `app/Helpers/Status.php` (line 331)

#### Parameters:
* `$statuses` *(array)* — Indexed array of status strings (default: `['succeeded', 'authorized']`)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified success statuses array

#### Usage Example:
```php
// Filter which transaction statuses count as successful for reports
add_filter('fluent_cart/transaction_success_statuses', function ($statuses, $data) {
    // Add "captured" to list of successful transaction statuses
    $statuses[] = 'captured';
    return $statuses;
}, 10, 2);
```

---

### `shipping_statuses` (legacy)
`fluent-cart/shipping_statuses` — Filter shipping statuses (legacy hook name)

* **When it runs:** Legacy location of the shipping statuses filter. Prefer `fluent_cart/shipping_statuses` for new code.
* **Source:** `app/Helpers/Helper.php` (line 170)

#### Parameters:
* `$statuses` *(array)* — Associative array of shipping statuses
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified shipping statuses array

#### Usage Example:
```php
// Filter shipping statuses using legacy hyphenated hook name
add_filter('fluent-cart/shipping_statuses', function ($statuses, $data) {
    // Return shipping statuses array
    return $statuses;
}, 10, 2);
```

---

### `shipping_statuses`
`fluent_cart/shipping_statuses` — Filter shipping statuses

* **When it runs:** Applied when retrieving the list of available shipping statuses used for order fulfillment.
* **Source:** `app/Helpers/Status.php` (line 232)

#### Parameters:
* `$statuses` *(array)* — Associative array of shipping statuses (`unshipped`, `shipped`, `delivered`, `unshippable`)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified shipping statuses array

#### Usage Example:
```php
// Filter available shipping statuses for order fulfillment
add_filter('fluent_cart/shipping_statuses', function ($statuses, $data) {
    // Add custom "In Transit" shipping status
    $statuses['in_transit'] = __('In Transit', 'my-plugin');
    return $statuses;
}, 10, 2);
```

---

## Order Data & Lifecycle

### `orders_list`
`fluent_cart/orders_list` — Filter the admin orders list

* **When it runs:** Applied after retrieving the paginated orders collection for the admin orders list view.
* **Source:** `app/Http/Controllers/OrderController.php` (line 58)

#### Parameters:
* `$orders` *(\FluentCart\Framework\Database\Orm\LengthAwarePaginator)* — Paginated collection of orders
* **Returns:** *(\FluentCart\Framework\Database\Orm\LengthAwarePaginator)* — The modified paginated orders collection

#### Usage Example:
```php
// Filter paginated orders collection for admin list view
add_filter('fluent_cart/orders_list', function ($orders) {
    // Loop through orders and inject custom badge post meta
    foreach ($orders as $order) {
        $order->custom_badge = get_post_meta($order->id, '_custom_badge', true);
    }
    return $orders;
}, 10, 1);
```

---

### `order/view`
`fluent_cart/order/view` — Filter single order view data

* **When it runs:** Applied when preparing the data for a single order view in the admin panel.
* **Source:** `app/Http/Controllers/OrderController.php` (line 580)

#### Parameters:
* `$order` *(array)* — The order data array containing all order details
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified order data

#### Usage Example:
```php
// Filter single order view data structure in admin panel
add_filter('fluent_cart/order/view', function ($order, $data) {
    // Inject custom field key into order view data payload
    $order['custom_field'] = 'Custom Value';
    return $order;
}, 10, 2);
```

---

### `widgets/single_order`
`fluent_cart/widgets/single_order` — Filter single order admin widgets

* **When it runs:** Applied when loading the stats/widgets section on the single order admin view.
* **Source:** `app/Http/Controllers/OrderController.php` (line 1009)

#### Parameters:
* `$widgets` *(array)* — Array of widget data (default empty)
* `$order` *(\FluentCart\App\Models\Order)* — The Order model instance
* **Returns:** *(array)* — Array of widget definitions to display

#### Usage Example:
```php
// Filter admin widgets loaded on single order view page
add_filter('fluent_cart/widgets/single_order', function ($widgets, $order) {
    // Append custom widget array definition for single order
    $widgets[] = [
        'title' => __('Custom Widget', 'my-plugin'),
        'value' => 'Some data for order #' . $order->id,
    ];
    return $widgets;
}, 10, 2);
```

---

### `order/is_subscription_allowed_in_manual_order`
`fluent_cart/order/is_subscription_allowed_in_manual_order` — Allow subscriptions in manual orders

* **When it runs:** Applied when creating a manual order that contains subscription items. By default, subscriptions in manual orders are not supported.
* **Source:** `app/Http/Controllers/OrderController.php` (line 78)

#### Parameters:
* `$allowed` *(bool)* — Whether subscriptions are allowed (default: `false`)
* `$context` *(array)* — Context data (`['order_items' => [...]]`)
* **Returns:** *(bool)* — Whether to allow subscription items in manual orders

#### Usage Example:
```php
// Filter whether subscriptions are allowed in manual order creation
add_filter('fluent_cart/order/is_subscription_allowed_in_manual_order', function ($allowed, $context) {
    // Enable subscription items in manual orders
    return true;
}, 10, 2);
```

---

### `order/type`
`fluent_cart/order/type` — Filter order type during manual creation

* **When it runs:** Applied when determining the order type during manual order creation. Automatically set to `'subscription'` if subscription items are detected, otherwise `'payment'`.
* **Source:** `app/Http/Controllers/OrderController.php` (line 91)

#### Parameters:
* `$type` *(string)* — The order type (`'payment'` or `'subscription'`)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(string)* — The order type string

#### Usage Example:
```php
// Filter order type classification during manual order creation
add_filter('fluent_cart/order/type', function ($type, $data) {
    // Return order type string ('payment' or 'subscription')
    return $type;
}, 10, 2);
```

---

### `order/expected_license_count`
`fluent_cart/order/expected_license_count` — Filter expected license count for an order

* **When it runs:** Applied when checking how many licenses should exist for an order. Used to detect missing licenses that need to be regenerated.
* **Source:** `app/Http/Controllers/OrderController.php` (lines 215, 585)

#### Parameters:
* `$count` *(int)* — Expected number of licenses (default: `0`)
* `$context` *(array)* — Context data (`['order_items' => [...]]`)
* **Returns:** *(int)* — The expected number of licenses

#### Usage Example:
```php
// Filter expected license count to detect missing licenses for order
add_filter('fluent_cart/order/expected_license_count', function ($count, $context) {
    // Calculate expected license count based on order item requirements
    foreach ($context['order_items'] as $item) {
        if ($item->requires_license) {
            $count += $item->quantity;
        }
    }
    return $count;
}, 10, 2);
```

---

### `create_receipt_number_on_order_create`
`fluent_cart/create_receipt_number_on_order_create` — Force receipt number generation on order creation

* **When it runs:** Applied during the order creating model event. By default, receipt numbers are only generated when the payment status is `'paid'`. Return true to always generate a receipt number.
* **Source:** `app/Models/Order.php` (line 52)

#### Parameters:
* `$force` *(bool)* — Whether to force receipt number creation (default: `false`)
* **Returns:** *(bool)* — Whether to generate a receipt number regardless of payment status

#### Usage Example:
```php
// Filter whether to force receipt number creation when order is created
add_filter('fluent_cart/create_receipt_number_on_order_create', function ($force) {
    // Always generate receipt number upon order creation regardless of payment status
    return true;
}, 10, 1);
```

---

### `single_order_downloads`
`fluent_cart/single_order_downloads` — Filter order downloads data

* **When it runs:** Applied when preparing the downloadable files for a specific order, allowing you to add, remove, or modify download data.
* **Source:** `app/Models/Order.php` (line 657)

#### Parameters:
* `$downloadData` *(array)* — Array of download groups (`title`, `product_id`, `downloads`, etc.)
* `$context` *(array)* — Context data (`['order' => Order, 'scope' => 'admin'|'customer']`)
* **Returns:** *(array)* — The modified download data array

#### Usage Example:
```php
// Filter downloadable files data array for a specific order
add_filter('fluent_cart/single_order_downloads', function ($downloadData, $context) {
    // Add bonus download file for completed orders
    if ($context['order']->status === 'completed') {
        $downloadData[] = [
            'title'     => 'Bonus Content',
            'downloads' => [
                ['name' => 'Bonus File', 'url' => 'https://example.com/bonus.pdf']
            ]
        ];
    }
    return $downloadData;
}, 10, 2);
```

---

### `order_can_be_deleted`
`fluent_cart/order_can_be_deleted` — Filter whether an order can be deleted

* **When it runs:** Applied when checking if an order is eligible for deletion. By default, orders with active subscriptions cannot be deleted.
* **Source:** `app/Models/Order.php` (line 812)

#### Parameters:
* `$canBeDeleted` *(true|\WP_Error)* — `true` if deletable, or a `WP_Error` with the reason
* `$context` *(array)* — Context data (`['order' => Order]`)
* **Returns:** *(true|\WP_Error)* — `true` to allow deletion, or `WP_Error` to block it

#### Usage Example:
```php
// Filter whether an order is eligible for deletion
add_filter('fluent_cart/order_can_be_deleted', function ($canBeDeleted, $context) {
    // Extract order model from context
    $order = $context['order'];
    // Prevent deletion of orders created within the last 30 days
    if (strtotime($order->created_at) > strtotime('-30 days')) {
        return new \WP_Error('too_recent', __('Orders less than 30 days old cannot be deleted.', 'my-plugin'));
    }
    return $canBeDeleted;
}, 10, 2);
```

---

### `min_receipt_number`
`fluent_cart/min_receipt_number` — Filter the minimum receipt number

* **When it runs:** Applied when calculating the next receipt number. If the computed next number is below this minimum, it will be bumped up.
* **Source:** `app/Services/OrderService.php` (line 572)

#### Parameters:
* `$min` *(int)* — The minimum receipt number from store settings (default: `1`)
* **Returns:** *(int)* — The minimum receipt number to enforce

#### Usage Example:
```php
// Filter minimum receipt number value
add_filter('fluent_cart/min_receipt_number', function ($min) {
    // Enforce starting receipt number of 1000
    return 1000;
}, 10, 1);
```

---

### `invoice_prefix`
`fluent_cart/invoice_prefix` — Filter the invoice number prefix

* **When it runs:** Applied when generating the invoice number string for new orders. Formed as `prefix + receipt_number`.
* **Source:** `app/Services/OrderService.php` (line 584)

#### Parameters:
* `$prefix` *(string)* — The invoice prefix from store settings (default: `'INV-'`)
* **Returns:** *(string)* — The modified invoice prefix

#### Usage Example:
```php
// Filter invoice number prefix string
add_filter('fluent_cart/invoice_prefix', function ($prefix) {
    // Use dynamic year-based invoice prefix string
    return 'INV-' . date('Y') . '-';
}, 10, 1);
```

---

### `order_refund_manually`
`fluent_cart/order_refund_manually` — Intercept manual refund processing

* **When it runs:** Applied during the refund process before the payment gateway refund method is called. Allows you to handle refunds through a custom mechanism instead of the gateway.
* **Source:** `app/Services/Payments/Refund.php` (line 65)

#### Parameters:
* `$manualRefund` *(array)* — Manual refund status (`['status' => 'no', 'source' => '']`)
* `$context` *(array)* — Refund context (`['refund_amount' => 5000, 'transaction' => Transaction, 'order' => Order, 'args' => [...]]`)
* **Returns:** *(array)* — Array with `'status'` key set to `'yes'` to skip the gateway refund

#### Usage Example:
```php
// Intercept manual refund processing before payment gateway invocation
add_filter('fluent_cart/order_refund_manually', function ($manualRefund, $context) {
    // Process refund via custom refund service logic
    $result = my_custom_refund($context['transaction'], $context['refund_amount']);
    if ($result) {
        return ['status' => 'yes', 'source' => 'my_custom_service'];
    }
    return $manualRefund;
}, 10, 2);
```

---

### `order_status/auto_complete_digital_order`
`fluent_cart/order_status/auto_complete_digital_order` — Control auto-completion of digital orders

* **When it runs:** Applied during payment status reconciliation. When a digital (non-physical) order is paid, it is automatically marked as completed. Return false to prevent this behavior.
* **Source:** `app/Helpers/StatusHelper.php` (line 193)

#### Parameters:
* `$autoComplete` *(bool)* — Whether to auto-complete the order (default: `true`)
* `$context` *(array)* — Context data (`['order' => Order]`)
* **Returns:** *(bool)* — Whether to automatically complete the digital order

#### Usage Example:
```php
// Control auto-completion behavior for digital product orders
add_filter('fluent_cart/order_status/auto_complete_digital_order', function ($autoComplete, $context) {
    // Require manual review for high-value digital orders over $500
    if ($context['order']->total > 50000) {
        return false;
    }
    return $autoComplete;
}, 10, 2);
```

---

### `customer/order_data`
`fluent_cart/customer/order_data` — Filter customer portal order data

* **When it runs:** Applied when preparing order data for display in the customer-facing order details page.
* **Source:** `app/Http/Controllers/FrontendControllers/CustomerOrderController.php` (line 285)

#### Parameters:
* `$formattedOrderData` *(array)* — The formatted order data array
* `$context` *(array)* — Context data (`['order' => Order, 'customer' => Customer]`)
* **Returns:** *(array)* — The modified formatted order data

#### Usage Example:
```php
// Filter formatted order data array in customer portal order details view
add_filter('fluent_cart/customer/order_data', function ($formattedOrderData, $context) {
    // Inject estimated delivery date meta into customer order details
    $formattedOrderData['estimated_delivery'] = get_post_meta(
        $context['order']->id, '_estimated_delivery', true
    );
    return $formattedOrderData;
}, 10, 2);
```

---

### `customer/order_details_section_parts`
`fluent_cart/customer/order_details_section_parts` — Filter customer order detail sections

* **When it runs:** Applied when building the customer-facing order details page. Allows you to inject custom HTML content into predefined section slots.
* **Source:** `app/Http/Controllers/FrontendControllers/CustomerOrderController.php` (line 292)

#### Parameters:
* `$sections` *(array)* — HTML content for section slots (`before_summary`, `after_summary`, `after_licenses`, `after_subscriptions`, `after_downloads`, `after_transactions`, `end_of_order`)
* `$context` *(array)* — Context data (`['order' => Order, 'formattedData' => [...]]`)
* **Returns:** *(array)* — The modified sections array with HTML content

#### Usage Example:
```php
// Filter customer order detail section HTML parts
add_filter('fluent_cart/customer/order_details_section_parts', function ($sections, $context) {
    // Inject custom HTML notice after order summary section
    $sections['after_summary'] = '<div class="custom-notice">Thank you for your order!</div>';
    return $sections;
}, 10, 2);
```

---

## Payment Processing

### `ipn_url_{$slug}`
`fluent_cart_ipn_url_{$slug}` — Filter IPN/webhook listener URL for a payment gateway

* **When it runs:** Applied when generating the IPN or webhook listener URL for a specific payment method. The `{$slug}` is the gateway slug (e.g. `stripe`, `paypal`).
* **Source:** `app/Services/Payments/PaymentHelper.php` (line 24)

#### Parameters:
* `$urlData` *(array)* — Array containing the listener URL (`['listener_url' => '...']`)
* **Returns:** *(array)* — The modified URL data array

#### Usage Example:
```php
// Filter IPN / webhook listener URL for Stripe gateway
add_action('fluent_cart_ipn_url_stripe', function ($urlData) {
    // Set custom endpoint URL for Stripe webhooks
    $urlData['listener_url'] = home_url('/custom-stripe-webhook/');
    return $urlData;
}, 10, 1);
```

---

### `payment/success_url`
`fluentcart/payment/success_url` — Filter the payment success redirect URL

* **When it runs:** Applied when generating the URL the customer is redirected to after a successful payment. Note the legacy prefix (`fluentcart/`).
* **Source:** `app/Services/Payments/PaymentHelper.php` (line 46)

#### Parameters:
* `$url` *(string)* — The success redirect URL (receipt page with query args)
* `$context` *(array)* — Context data (`['transaction_hash' => '...', 'args' => [], 'payment_method' => 'stripe']`)
* **Returns:** *(string)* — The modified success URL

#### Usage Example:
```php
// Filter payment success redirect URL (legacy hook prefix)
add_filter('fluentcart/payment/success_url', function ($url, $context) {
    // Redirect customer to custom thank-you page with transaction hash
    return add_query_arg('trx_hash', $context['transaction_hash'], home_url('/thank-you/'));
}, 10, 2);
```

---

### `default_payment_method_for_zero_payment`
`fluent_cart/default_payment_method_for_zero_payment` — Filter default payment method for zero-total orders

* **When it runs:** Applied during checkout validation when the order total (including recurring) is zero. Determines which payment method handles the $0 transaction.
* **Source:** `app/Services/Payments/PaymentHelper.php` (line 70)

#### Parameters:
* `$method` *(string)* — Payment method slug (default: `'offline_payment'`)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(string)* — The payment method slug to use for zero-total orders

#### Usage Example:
```php
// Filter default payment method slug for zero-total orders
add_filter('fluent_cart/default_payment_method_for_zero_payment', function ($method, $data) {
    // Use Stripe for zero-total orders with recurring subscriptions
    return 'stripe';
}, 10, 2);
```

---

### `get_payment_connect_info_{$method}`
`fluent_cart/get_payment_connect_info_{$method}` — Filter payment method connection info

* **When it runs:** Applied when retrieving connection/setup information for a specific payment method. The `{$method}` is the sanitized gateway slug. Used by gateways that require an OAuth connection flow.
* **Source:** `api/PaymentMethods.php` (line 105)

#### Parameters:
* `$info` *(array)* — Connection info array (default: `[]`)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The payment method connection information

#### Usage Example:
```php
// Filter payment method OAuth connect information for Stripe
add_filter('fluent_cart/get_payment_connect_info_stripe', function ($info, $data) {
    // Set connected status and Stripe account ID
    $info['connected'] = true;
    $info['account_id'] = 'acct_xxx';
    return $info;
}, 10, 2);
```

---

### `transaction/url_{$payment_method}`
`fluent_cart/transaction/url_{$payment_method}` — Filter vendor dashboard URL for a transaction

* **When it runs:** Applied when generating the URL attribute of an `OrderTransaction` model. The `{$payment_method}` is the gateway slug. Links to the transaction in the provider dashboard.
* **Source:** `app/Models/OrderTransaction.php` (line 111)

#### Parameters:
* `$url` *(string)* — The vendor URL (default: `''`)
* `$context` *(array)* — Context data (`['transaction' => Transaction, 'payment_mode' => 'live'|'test', 'vendor_charge_id' => 'ch_xxx', 'transaction_type' => 'charge']`)
* **Returns:** *(string)* — The URL to the transaction in the payment provider dashboard

#### Usage Example:
```php
// Filter vendor dashboard URL attribute for Stripe transactions
add_filter('fluent_cart/transaction/url_stripe', function ($url, $context) {
    // Extract vendor charge ID and mode
    $chargeId = $context['vendor_charge_id'];
    $mode = $context['payment_mode'] === 'test' ? 'test/' : '';

    // Construct Stripe dashboard transaction URL
    return "https://dashboard.stripe.com/{$mode}payments/{$chargeId}";
}, 10, 2);
```

---

### `transaction/receipt_page_url`
`fluentcart/transaction/receipt_page_url` — Filter the transaction receipt page URL

* **When it runs:** Applied when generating the public-facing receipt page URL for a transaction. Note legacy prefix (`fluentcart/`).
* **Source:** `app/Models/OrderTransaction.php` (line 183)

#### Parameters:
* `$url` *(string)* — The receipt page URL with `trx_hash` query parameter
* `$context` *(array)* — Context data (`['transaction' => Transaction, 'order' => Order]`)
* **Returns:** *(string)* — The modified receipt page URL

#### Usage Example:
```php
// Filter public receipt page URL for transaction (legacy hook prefix)
add_filter('fluentcart/transaction/receipt_page_url', function ($url, $context) {
    // Use custom public receipt page URL with transaction hash
    return add_query_arg('trx_hash', $context['transaction']->uuid, home_url('/my-receipt/'));
}, 10, 2);
```

---

## Stripe

### `stripe_settings`
`fluent_cart/stripe_settings` — Filter Stripe gateway settings

* **When it runs:** Applied when loading Stripe gateway settings during initialization.
* **Source:** `app/Modules/PaymentMethods/StripeGateway/StripeSettingsBase.php` (line 38)

#### Parameters:
* `$settings` *(array)* — The Stripe settings array including keys, modes, and configuration options
* **Returns:** *(array)* — The modified Stripe settings

#### Usage Example:
```php
// Filter Stripe gateway settings array during initialization
add_filter('fluent_cart/stripe_settings', function ($settings) {
    // Force test mode in staging environment
    if (wp_get_environment_type() === 'staging') {
        $settings['payment_mode'] = 'test';
    }
    return $settings;
}, 10, 1);
```

---

### `payments/stripe_metadata_subscription`
`fluent_cart/payments/stripe_metadata_subscription` — Filter Stripe subscription metadata

* **When it runs:** Applied when creating a Stripe subscription, allowing you to add or modify metadata sent to Stripe's subscription object. Max 50 keys per Stripe API limits.
* **Source:** `app/Modules/PaymentMethods/StripeGateway/Processor.php` (line 90)

#### Parameters:
* `$metadata` *(array)* — Metadata array for Stripe subscription (`fct_ref_id`, `email`, `name`, `subscription_item`, `order_reference`)
* `$context` *(array)* — Context data (`['order' => Order, 'transaction' => Transaction, 'subscription' => Subscription]`)
* **Returns:** *(array)* — The modified metadata array

#### Usage Example:
```php
// Filter Stripe subscription metadata array
add_filter('fluent_cart/payments/stripe_metadata_subscription', function ($metadata, $context) {
    // Inject custom affiliate ID into Stripe subscription metadata
    $metadata['affiliate_id'] = get_user_meta($context['order']->customer->user_id, 'affiliate_id', true);
    return $metadata;
}, 10, 2);
```

---

### `payments/stripe_metadata_onetime`
`fluent_cart/payments/stripe_metadata_onetime` — Filter Stripe one-time payment metadata

* **When it runs:** Applied when creating a Stripe payment intent for a one-time payment. Max 50 keys per Stripe API limits.
* **Source:** `app/Modules/PaymentMethods/StripeGateway/Processor.php` (line 221)

#### Parameters:
* `$metadata` *(array)* — Metadata array for Stripe payment intent (`fct_ref_id`, `Name`, `Email`, `order_reference`)
* `$context` *(array)* — Context data (`['order' => Order, 'transaction' => Transaction]`)
* **Returns:** *(array)* — The modified metadata array

#### Usage Example:
```php
// Filter Stripe one-time payment intent metadata array
add_filter('fluent_cart/payments/stripe_metadata_onetime', function ($metadata, $context) {
    // Inject campaign tag and customer ID into metadata
    $metadata['campaign'] = 'spring_sale_2025';
    if (isset($context['order'])) {
        $metadata['customer_id'] = $context['order']->customer_id;
    }
    return $metadata;
}, 10, 2);
```

---

### `payments/stripe_onetime_intent_args`
`fluent_cart/payments/stripe_onetime_intent_args` — Filter Stripe payment intent arguments

* **When it runs:** Applied after building the full payment intent data array, just before creating the intent via the Stripe API.
* **Source:** `app/Modules/PaymentMethods/StripeGateway/Processor.php` (line 257)

#### Parameters:
* `$intentData` *(array)* — Payment intent arguments (`amount`, `currency`, `automatic_payment_methods`, `metadata`, `customer`)
* `$context` *(array)* — Context data (`['order' => Order, 'transaction' => Transaction]`)
* **Returns:** *(array)* — The modified payment intent arguments

#### Usage Example:
```php
// Filter Stripe payment intent arguments for one-time payments
add_filter('fluent_cart/payments/stripe_onetime_intent_args', function ($intentData, $context) {
    // Add custom statement descriptor suffix for order
    $intentData['statement_descriptor_suffix'] = 'Order ' . $context['order']->id;
    return $intentData;
}, 10, 2);
```

---

### `payments/stripe_checkout_session_args`
`fluent_cart/payments/stripe_checkout_session_args` — Filter Stripe Checkout session arguments (one-time)

* **When it runs:** Applied when creating a Stripe Checkout session for one-time hosted payments.
* **Source:** `app/Modules/PaymentMethods/StripeGateway/Processor.php` (line 356)

#### Parameters:
* `$sessionData` *(array)* — Checkout session arguments (`customer`, `client_reference_id`, `line_items`, `mode`, `success_url`, `cancel_url`, `metadata`)
* `$context` *(array)* — Context data (`['order' => Order, 'transaction' => Transaction]`)
* **Returns:** *(array)* — The modified Checkout session arguments

#### Usage Example:
```php
// Filter Stripe Checkout session arguments for one-time payments
add_filter('fluent_cart/payments/stripe_checkout_session_args', function ($sessionData, $context) {
    // Enable promotion codes on hosted Stripe Checkout page
    $sessionData['allow_promotion_codes'] = true;
    return $sessionData;
}, 10, 2);
```

---

### `payments/stripe_subscription_checkout_session_args`
`fluent_cart/payments/stripe_subscription_checkout_session_args` — Filter Stripe Checkout session arguments (subscription)

* **When it runs:** Applied when creating a Stripe Checkout session for subscription-based hosted payments.
* **Source:** `app/Modules/PaymentMethods/StripeGateway/Processor.php` (line 509)

#### Parameters:
* `$sessionData` *(array)* — Checkout session arguments (`customer`, `client_reference_id`, `line_items`, `mode`, `subscription_data`, `metadata`)
* `$context` *(array)* — Context data (`['order' => Order, 'transaction' => Transaction, 'subscription' => Subscription]`)
* **Returns:** *(array)* — The modified Checkout session arguments

#### Usage Example:
```php
// Filter Stripe Checkout session arguments for subscriptions
add_filter('fluent_cart/payments/stripe_subscription_checkout_session_args', function ($sessionData, $context) {
    // Enable tax ID collection on hosted subscription Checkout page
    $sessionData['tax_id_collection'] = ['enabled' => true];
    return $sessionData;
}, 10, 2);
```

---

### `stripe_idempotency_key`
`fluent_cart_stripe_idempotency_key` — Filter the Stripe idempotency key

* **When it runs:** Applied when sending charge requests to the Stripe API to prevent duplicate charges.
* **Source:** `app/Modules/PaymentMethods/StripeGateway/API/ApiRequest.php` (line 115)

#### Parameters:
* `$key` *(string)* — Generated idempotency key string
* `$context` *(array)* — Context data (`['request' => [...]]`)
* **Returns:** *(string)* — The modified idempotency key

#### Usage Example:
```php
// Filter Stripe API request idempotency key string
add_filter('fluent_cart_stripe_idempotency_key', function ($key, $context) {
    // Generate custom hashed idempotency key
    return 'fct_' . md5($key . time());
}, 10, 2);
```

---

### `stripe_request_body`
`fluent_cart_stripe_request_body` — Filter the Stripe API request body

* **When it runs:** Applied just before every request is sent to the Stripe API. Low-level filter affecting all Stripe calls.
* **Source:** `app/Modules/PaymentMethods/StripeGateway/API/ApiRequest.php` (line 126)

#### Parameters:
* `$request` *(array)* — The request body data array
* `$context` *(array)* — Context data (`['api' => 'charges']`)
* **Returns:** *(array)* — The modified request body

#### Usage Example:
```php
// Filter Stripe API request body data array
add_filter('fluent_cart_stripe_request_body', function ($request, $context) {
    // Log low-level Stripe API call endpoint
    error_log('Stripe API call to: ' . $context['api']);
    return $request;
}, 10, 2);
```

---

### `form_disable_stripe_connect`
`fluent_cart_form_disable_stripe_connect` — Disable Stripe Connect provider option

* **When it runs:** Applied when rendering the Stripe settings form. Return true to force manual API keys.
* **Source:** `app/Modules/PaymentMethods/StripeGateway/Stripe.php` (line 288)

#### Parameters:
* `$disable` *(bool)* — Whether to disable Stripe Connect (default: `false`)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(bool)* — `true` to disable Stripe Connect and force manual API keys mode

#### Usage Example:
```php
// Filter whether to disable Stripe Connect option in admin form
add_filter('fluent_cart_form_disable_stripe_connect', function ($disable, $data) {
    // Force manual API keys mode for Stripe
    return true;
}, 10, 2);
```

---

### `stripe_appearance`
`fluent_cart_stripe_appearance` — Filter Stripe Elements appearance configuration

* **When it runs:** Applied when initializing Stripe Elements on the checkout page. Controls visual theme and styling.
* **Source:** `app/Modules/PaymentMethods/StripeGateway/Stripe.php` (line 427)

#### Parameters:
* `$appearance` *(array)* — Stripe Elements appearance configuration array (`['theme' => 'stripe']`)
* **Returns:** *(array)* — The modified appearance configuration (follows Stripe Appearance API)

#### Usage Example:
```php
// Filter Stripe Elements appearance configuration array
add_filter('fluent_cart_stripe_appearance', function ($appearance) {
    // Apply custom dark theme styling to embedded Stripe form
    return [
        'theme'     => 'night',
        'variables' => [
            'colorPrimary'    => '#0570de',
            'borderRadius'    => '8px',
            'fontFamily'      => 'Inter, system-ui, sans-serif',
        ],
    ];
}, 10, 1);
```

---

### `stripe/setup_intent_rate_limit_customer_daily`
`fluent_cart/stripe/setup_intent_rate_limit_customer_daily` — Filter daily SetupIntent rate limit per customer

* **When it runs:** Applied when enforcing rate limit for Stripe SetupIntent creation (used for subscription card updates).
* **Source:** `app/Modules/PaymentMethods/StripeGateway/SubscriptionsManager.php` (lines 85, 101)

#### Parameters:
* `$limit` *(int)* — Maximum SetupIntent attempts per customer per day (default: `3`)
* `$customerId` *(string)* — The Stripe customer ID
* **Returns:** *(int)* — The modified daily rate limit

#### Usage Example:
```php
// Filter daily SetupIntent rate limit count per customer
add_filter('fluent_cart/stripe/setup_intent_rate_limit_customer_daily', function ($limit, $customerId) {
    // Increase daily rate limit to 5 attempts for card updates
    return 5;
}, 10, 2);
```

---

### `stripe/fallback_order_transaction`
`fluent_cart/stripe/fallback_order_transaction` — Fallback transaction for Stripe webhooks

* **When it runs:** Applied during Stripe webhook processing when no matching `OrderTransaction` can be found by `vendor_charge_id`.
* **Source:** `app/Modules/PaymentMethods/StripeGateway/Webhook/Webhook.php` (line 121)

#### Parameters:
* `$transaction` *(\FluentCart\App\Models\OrderTransaction|null)* — The fallback transaction (default: `null`)
* `$vendorDataObject` *(object)* — Stripe event data object containing charge details
* **Returns:** *(\FluentCart\App\Models\OrderTransaction|null)* — OrderTransaction instance or null

#### Usage Example:
```php
// Provide fallback OrderTransaction when vendor_charge_id lookup fails
add_filter('fluent_cart/stripe/fallback_order_transaction', function ($transaction, $vendorDataObject) {
    // Look up transaction by reference metadata in event payload
    if (isset($vendorDataObject->metadata->fct_ref_id)) {
        $order = \FluentCart\App\Models\Order::where('uuid', $vendorDataObject->metadata->fct_ref_id)->first();
        if ($order) {
            return \FluentCart\App\Models\OrderTransaction::where('order_id', $order->id)
                ->where('transaction_type', 'charge')
                ->first();
        }
    }
    return $transaction;
}, 10, 2);
```

---

## PayPal

### `paypal_plan_id`
`fluent_cart/paypal_plan_id` — Filter PayPal plan ID for subscriptions

* **When it runs:** Applied when generating or resolving the PayPal billing plan ID for a subscription product variation.
* **Source:** `app/Modules/PaymentMethods/PayPalGateway/PayPalHelper.php` (line 54)

#### Parameters:
* `$planId` *(string)* — The generated plan ID string
* `$context` *(array)* — Context data (`['plan_data' => [...], 'variation' => Variation, 'product' => Product]`)
* **Returns:** *(string)* — The modified PayPal plan ID

#### Usage Example:
```php
// Filter PayPal billing plan ID for subscription product variations
add_filter('fluent_cart/paypal_plan_id', function ($planId, $context) {
    // Construct custom formatted PayPal plan ID string
    return 'custom_plan_' . $context['variation']->id;
}, 10, 2);
```

---

### `payments/paypal_sdk_src`
`fluent_cart/payments/paypal_sdk_src` — Filter PayPal SDK JavaScript source URL

* **When it runs:** Applied when generating the PayPal JavaScript SDK script URL for the checkout page.
* **Source:** `app/Modules/PaymentMethods/PayPalGateway/PayPal.php` (line 518)

#### Parameters:
* `$sdkSrc` *(string)* — The PayPal SDK URL with query parameters
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(string)* — The modified PayPal SDK URL

#### Usage Example:
```php
// Filter PayPal SDK JavaScript script URL for checkout
add_filter('fluent_cart/payments/paypal_sdk_src', function ($sdkSrc, $data) {
    // Append locale parameter to PayPal SDK URL
    return add_query_arg('locale', 'en_US', $sdkSrc);
}, 10, 2);
```

---

### `payments/paypal/disable_webhook_verification`
`fluent_cart/payments/paypal/disable_webhook_verification` — Disable PayPal webhook signature verification

* **When it runs:** Applied at the start of PayPal webhook verification. Return `'yes'` to skip signature verification.
* **Source:** `app/Modules/PaymentMethods/PayPalGateway/IPN.php` (line 179)

#### Parameters:
* `$disable` *(string)* — Whether to disable verification (default: `'no'`)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(string)* — `'yes'` to skip verification, `'no'` to verify normally

#### Usage Example:
```php
// Filter whether to disable PayPal webhook signature verification
add_filter('fluent_cart/payments/paypal/disable_webhook_verification', function ($disable, $data) {
    // Disable signature verification in local development environment
    if (wp_get_environment_type() === 'local') {
        return 'yes';
    }
    return $disable;
}, 10, 2);
```

---

### `payments/paypal/verify_webhook`
`fluent_cart/payments/paypal/verify_webhook` — Control PayPal webhook verification

* **When it runs:** Applied before the actual PayPal webhook signature verification step in the main processing flow.
* **Source:** `app/Modules/PaymentMethods/PayPalGateway/IPN.php` (line 302)

#### Parameters:
* `$verify` *(bool)* — Whether to verify the webhook (default: `true`)
* `$context` *(array)* — Context data (`['data' => [...], 'mode' => 'live'|'test', 'type' => 'PAYMENT.SALE.COMPLETED']`)
* **Returns:** *(bool)* — Whether to proceed with webhook verification

#### Usage Example:
```php
// Filter whether to proceed with PayPal webhook verification
add_filter('fluent_cart/payments/paypal/verify_webhook', function ($verify, $context) {
    // Skip verification for test mode webhooks
    if ($context['mode'] === 'test') {
        return false;
    }
    return $verify;
}, 10, 2);
```

---

## Tax

### `tax/country_tax_titles`
`fluent_cart/tax/country_tax_titles` — Filter tax title labels per country

* **When it runs:** Applied when retrieving the mapping of country codes to their tax identification field labels (e.g. VAT, GST, ABN).
* **Source:** `app/Modules/Tax/TaxModule.php` (line 1730)

#### Parameters:
* `$taxTitles` *(array)* — Associative array of country code => tax label (`AU => ABN`, `GB => VAT`, `US => EIN / Sales Tax`)
* **Returns:** *(array)* — The modified country tax titles array

#### Usage Example:
```php
// Filter country tax identification field labels mapping array
add_filter('fluent_cart/tax/country_tax_titles', function ($taxTitles) {
    // Override tax field labels for South Korea and US
    $taxTitles['KR'] = __('BRN / VAT', 'my-plugin');
    $taxTitles['US'] = __('Tax ID', 'my-plugin');
    return $taxTitles;
}, 10, 1);
```

---

### `tax_summary_should_render`
`fluent_cart/tax_summary_should_render` — Filter whether tax summary is rendered on order receipt

* **When it runs:** Applied in `TaxSummaryHelper::computeTaxSummary()` while building tax summary for order receipt surfaces (thank-you page, emails, PDFs).
* **Source:** `app/Services/Renderer/Receipt/TaxSummaryHelper.php` (line 172)

#### Parameters:
* `$shouldRender` *(bool)* — Whether tax summary should render (default: `true`)
* `$order` *(\FluentCart\App\Models\Order)* — The order being rendered
* **Returns:** *(bool)* — `false` to hide the tax summary block

#### Usage Example:
```php
// Filter whether tax summary block is rendered on order receipt
add_filter('fluent_cart/tax_summary_should_render', function ($shouldRender, $order) {
    // Hide tax summary block for test mode orders
    if ($order->mode === 'test') {
        return false;
    }
    return $shouldRender;
}, 10, 2);
```

---

## Mollie (Pro)

### `mollie_settings` (Pro)
`fluent_cart/mollie_settings` — Filter Mollie gateway settings

* **When it runs:** Applied when loading Mollie gateway settings during initialization.
* **Source:** `fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/MollieSettingsBase.php` (line 26)

#### Parameters:
* `$settings` *(array)* — The Mollie settings array including API keys and configuration
* **Returns:** *(array)* — The modified Mollie settings

#### Usage Example:
```php
// Filter Mollie gateway settings array during initialization (Pro)
add_filter('fluent_cart/mollie_settings', function ($settings) {
    // Override Mollie payment mode to test in staging
    if (wp_get_environment_type() === 'staging') {
        $settings['payment_mode'] = 'test';
    }
    return $settings;
}, 10, 1);
```

---

### `payments/mollie_payment_args` (Pro)
`fluent_cart/payments/mollie_payment_args` — Filter Mollie payment data

* **When it runs:** Applied when building the payment data array before sending to the Mollie API for payment creation.
* **Source:** `fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/MollieProcessor.php` (line 142)

#### Parameters:
* `$paymentData` *(array)* — Payment data array for Mollie API
* `$context` *(array)* — Context data (`['order' => Order, 'transaction' => Transaction]`)
* **Returns:** *(array)* — The modified payment data

#### Usage Example:
```php
// Filter Mollie payment API creation payload data (Pro)
add_filter('fluent_cart/payments/mollie_payment_args', function ($paymentData, $context) {
    // Inject custom description into Mollie payment creation payload
    $paymentData['description'] = 'Order #' . $context['order']->id . ' - My Store';
    return $paymentData;
}, 10, 2);
```

---

### `mollie/pass_line_items_details` (Pro)
`fluent_cart/mollie/pass_line_items_details` — Control passing line item details to Mollie

* **When it runs:** Applied before building the Mollie payment request. Return true to include line items (useful for Klarna, iDEAL).
* **Source:** `fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/MollieProcessor.php` (line 128)

#### Parameters:
* `$passLineItems` *(bool)* — Whether to include line items (default: `false`)
* `$context` *(array)* — Array containing `[$order, $transaction]`
* **Returns:** *(bool)* — Whether to pass line item details to Mollie

#### Usage Example:
```php
// Control whether line item details are passed to Mollie API (Pro)
add_filter('fluent_cart/mollie/pass_line_items_details', function ($passLineItems, $context) {
    // Enable line item details for Klarna payment support
    return true;
}, 10, 2);
```

---

### `mollie/webhook_url` (Pro)
`fluent_cart/mollie/webhook_url` — Filter the Mollie webhook URL

* **When it runs:** Applied when generating the webhook notification URL sent to Mollie during payment creation.
* **Source:** `fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/MollieProcessor.php` (line 301)

#### Parameters:
* `$webhookUrl` *(string)* — The IPN/webhook listener URL
* **Returns:** *(string)* — The modified webhook URL

#### Usage Example:
```php
// Filter Mollie IPN webhook notification URL (Pro)
add_filter('fluent_cart/mollie/webhook_url', function ($webhookUrl) {
    // Use ngrok tunnel URL for local development webhook testing
    if (wp_get_environment_type() === 'local') {
        return 'https://my-tunnel.ngrok.io/?fct_payment_listener=1&method=mollie';
    }
    return $webhookUrl;
}, 10, 1);
```

---

### `mollie/subscription_description` (Pro)
`fluent_cart/mollie/subscription_description` — Filter Mollie subscription description

* **When it runs:** Applied when creating a Mollie subscription to customize statement description string.
* **Source:** `fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/MollieHelper.php` (line 209)

#### Parameters:
* `$description` *(string)* — The generated subscription description string
* `$context` *(array)* — Context data (`['subscription_model' => Subscription, 'currency' => 'EUR']`)
* **Returns:** *(string)* — The modified subscription description

#### Usage Example:
```php
// Filter Mollie subscription description string (Pro)
add_filter('fluent_cart/mollie/subscription_description', function ($description, $context) {
    // Customize Mollie subscription statement description string
    return 'MyStore - ' . $context['subscription_model']->item_name;
}, 10, 2);
```

---

## Paddle (Pro)

### `paddle_product_tax_category` (Pro)
`fluent_cart/paddle_product_tax_category` — Filter Paddle product tax category

* **When it runs:** Applied when FluentCart creates the corresponding product on Paddle to determine the tax category (`standard`, `digital-goods`, `saas`).
* **Source:** `fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/Product.php` (line 44)

#### Parameters:
* `$taxCategory` *(string)* — The tax category (default: `'standard'`)
* `$data` *(array)* — Context data (`['product' => Product, 'variation_id' => int|null]`)
* **Returns:** *(string)* — The Paddle tax category

#### Usage Example:
```php
// Filter Paddle product tax category string (Pro)
add_filter('fluent_cart/paddle_product_tax_category', function ($taxCategory, $data) {
    // Set tax category to saas for digital software products
    if ($data['product'] && $data['product']->type === 'digital') {
        return 'saas';
    }
    return $taxCategory;
}, 10, 2);
```
