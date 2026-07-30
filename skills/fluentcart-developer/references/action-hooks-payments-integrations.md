# Action Hooks: Payments & Integrations

All hooks related to payment processing, payment gateway webhooks, third-party integrations, file storage drivers, and development logging. Many of these hooks provide Order, Customer, and OrderTransaction model instances.

---

## Payment Events

### `payment_{$paymentStatus}`
`fluent_cart/payment_{$paymentStatus}` — Fires after order creation when a transaction succeeds

* **When it runs:** This dynamic action fires during Order finalization, after the transaction has been recorded and the payment status is determined. It only fires when the transaction status is one of the recognized success statuses (e.g. `paid`, `pending`). The `{$paymentStatus}` portion is replaced with the order's actual payment status.
* **Available dynamic variants:**
  - `fluent_cart/payment_paid` -- payment completed successfully
  - `fluent_cart/payment_pending` -- payment is pending confirmation
* **Source:** `api/Resource/OrderResource.php`

#### Parameters:
`$data` *(array)*: Order, Customer, and OrderTransaction data
```php
$data = [
    'order'       => $order,       // \FluentCart\App\Models\Order instance
    'customer'    => $customer,    // \FluentCart\App\Models\Customer (via $order->customer)
    'transaction' => $transaction, // \FluentCart\App\Models\OrderTransaction (via $order->latest_transaction)
];
```

#### Usage Example:
```php
// Hook into successful payment for any order creation
add_action('fluent_cart/payment_paid', function ($data) {
    // Extract order and customer models from event data
    $order = $data['order'];
    $customer = $data['customer'];

    // Grant access after successful payment
    update_user_meta($customer->user_id, 'has_premium_access', true);

    // Log successful payment event
    fluent_cart_add_log(
        'Payment Received',
        'Order #' . $order->id . ' paid successfully.',
        'success'
    );
}, 10, 1);
```

---

### `payment_{$transactionType}_{$paymentStatus}`
`fluent_cart/payment_{$transactionType}_{$paymentStatus}` — Fires after order creation with both transaction type and payment status

* **When it runs:** This dynamic action fires immediately after `fluent_cart/payment_{$paymentStatus}` during Order finalization. It provides more granular filtering by combining the transaction type (e.g. `one_time`, `subscription`) with the payment status (e.g. `paid`, `pending`).
* **Available dynamic variants:**
  - `fluent_cart/payment_one_time_paid` -- one-time purchase paid
  - `fluent_cart/payment_subscription_paid` -- subscription payment paid
  - `fluent_cart/payment_one_time_pending` -- one-time purchase pending
  - `fluent_cart/payment_subscription_pending` -- subscription payment pending
* **Source:** `api/Resource/OrderResource.php`

#### Parameters:
`$data` *(array)*: Order, customer, and transaction data
```php
$data = [
    'order'       => $order,       // \FluentCart\App\Models\Order instance
    'customer'    => $customer,    // \FluentCart\App\Models\Customer (via $order->customer)
    'transaction' => $transaction, // \FluentCart\App\Models\OrderTransaction (via $order->latest_transaction)
];
```

#### Usage Example:
```php
// Hook into paid subscription payment events
add_action('fluent_cart/payment_subscription_paid', function ($data) {
    // Extract order and transaction models from event data
    $order = $data['order'];
    $transaction = $data['transaction'];

    // Handle subscription-specific logic after payment
    fluent_cart_add_log(
        'Subscription Payment',
        'Subscription payment received for Order #' . $order->id,
        'success'
    );
}, 10, 1);
```

---

### `after_payment_{$paymentStatus}`
`fluent_cart/payments/after_payment_{$paymentStatus}` — Fires in abstract gateway after payment processing completes

* **When it runs:** This dynamic action fires inside the abstract payment gateway base class after a payment has been processed, the `OrderTransaction` recorded, and the `Order` status updated. It runs after `changeOrderStatus()` and any automatic digital-product completion logic. The `{$paymentStatus}` is the resulting payment status (e.g. `paid`, `failed`).
* **Source:** `app/Modules/PaymentMethods/Core/AbstractPaymentGateway.php`

#### Parameters:
`$data` *(array)*: The order that was just processed
```php
$data = [
    'order' => $order, // \FluentCart\App\Models\Order instance with updated status
];
```

#### Usage Example:
```php
// Hook after any payment gateway completes payment processing
add_action('fluent_cart/payments/after_payment_paid', function ($data) {
    // Extract order model instance
    $order = $data['order'];

    // Trigger external fulfillment webhook after payment confirmation
    wp_remote_post('https://fulfillment.example.com/api/orders', [
        'body' => wp_json_encode([
            'order_id' => $order->id,
            'total'    => $order->total_amount,
        ]),
    ]);
}, 10, 1);
```

---

### `payment_success`
`fluent_cart/payment_success` — Fires when an Airwallex or Square payment succeeds

* **When it runs:** This action fires inside the Airwallex and Square gateway handlers when a payment intent or payment object is confirmed as successful. The order status is updated to `processing` and payment status to `paid` before this hook runs.
* **Source:** `app/Modules/PaymentMethods/AirwallexGateway/Airwallex.php`, `app/Modules/PaymentMethods/SquareGateway/Square.php`

#### Parameters:
`$data` *(array)*: The order and payment intent/payment data
```php
$data = [
    'order'          => $order,         // \FluentCart\App\Models\Order with updated status
    'payment_intent' => $paymentIntent, // Gateway-specific payment intent or payment object (array)
];
```

#### Usage Example:
```php
// Hook when Airwallex or Square payment succeeds
add_action('fluent_cart/payment_success', function ($data) {
    // Extract order and payment intent payload
    $order = $data['order'];
    $paymentIntent = $data['payment_intent'];

    // Log the gateway-specific payment reference ID
    fluent_cart_add_log(
        'Gateway Payment Success',
        'Payment intent ' . $paymentIntent['id'] . ' for Order #' . $order->id,
        'success'
    );
}, 10, 1);
```

---

### `payment_failed`
`fluent_cart/payment_failed` — Fires when an Airwallex payment fails

* **When it runs:** This action fires inside the Airwallex gateway handler when a payment intent is determined to have failed. The order status and payment status are both set to `failed` before this hook runs.
* **Source:** `app/Modules/PaymentMethods/AirwallexGateway/Airwallex.php`

#### Parameters:
`$data` *(array)*: The order and failed payment intent data
```php
$data = [
    'order'          => $order,         // \FluentCart\App\Models\Order with failed status
    'payment_intent' => $paymentIntent, // Airwallex payment intent object (array)
];
```

#### Usage Example:
```php
// Hook when an Airwallex payment fails
add_action('fluent_cart/payment_failed', function ($data) {
    // Extract order and failed payment intent payload
    $order = $data['order'];
    $paymentIntent = $data['payment_intent'];

    // Notify admin via email about failed payment
    wp_mail(
        get_option('admin_email'),
        'Payment Failed - Order #' . $order->id,
        'Airwallex payment intent ' . $paymentIntent['id'] . ' failed.'
    );
}, 10, 1);
```

---

## Payment Gateway Registration

### `register_payment_methods`
`fluent_cart/register_payment_methods` — Register custom payment gateways

* **When it runs:** This action fires during initialization after all built-in payment gateways (Stripe, PayPal, Razorpay, Paystack, COD, Square, Airwallex) have been registered. Use this hook to register your own custom payment gateway with the gateway manager.
* **Source:** `app/Hooks/Handlers/GlobalPaymentHandler.php`

#### Parameters:
`$data` *(array)*: Contains the gateway manager instance
```php
$data = [
    'gatewayManager' => $gateway, // GatewayManager instance for registering gateways
];
```

#### Usage Example:
```php
// Hook to register custom payment gateways with gateway manager
add_action('fluent_cart/register_payment_methods', function ($data) {
    // Extract gateway manager instance
    $gatewayManager = $data['gatewayManager'];

    // Register a custom payment gateway class
    $gatewayManager->register('my_gateway', new MyCustomPaymentGateway());
}, 10, 1);
```

---

### `after_render_payment_method_{$route}`
`fluent-cart/after_render_payment_method_{$route}` — Fires after a payment method UI renders on the checkout page

* **When it runs:** This action fires after a payment method's frontend UI (logo or radio button) has been rendered on the checkout form. The `{$route}` is the gateway's route identifier. Note that this hook uses a hyphenated prefix (`fluent-cart/`) rather than the usual underscored prefix.
* **Available dynamic variants:** `fluent-cart/after_render_payment_method_stripe`, `fluent-cart/after_render_payment_method_paypal`, `fluent-cart/after_render_payment_method_square`, `fluent-cart/after_render_payment_method_airwallex`, `fluent-cart/after_render_payment_method_offline_payment`, `fluent-cart/after_render_payment_method_razorpay`, `fluent-cart/after_render_payment_method_paystack`
* **Source:** `app/Modules/PaymentMethods/Core/AbstractPaymentGateway.php`

#### Parameters: None.

#### Usage Example:
```php
// Hook after Stripe payment method UI renders on checkout form
add_action('fluent-cart/after_render_payment_method_stripe', function () {
    // Output custom security note below Stripe payment option
    echo '<p class="payment-note">Secure payments powered by Stripe.</p>';
}, 10, 0);
```

---

## Stripe Webhooks

### `stripe/webhook_{$eventType}`
`fluent_cart/payments/stripe/webhook_{$eventType}` — Fires for each Stripe webhook event

* **When it runs:** This dynamic action fires during Stripe webhook (IPN) processing after the event has been verified and the associated Order has been found. The `{$eventType}` is the Stripe event type with dots replaced by underscores (e.g. `invoice.payment_succeeded` becomes `invoice_payment_succeeded`).
* **Available dynamic variants:** `webhook_invoice_payment_succeeded`, `webhook_invoice_payment_failed`, `webhook_charge_refunded`, `webhook_customer_subscription_deleted`, `webhook_customer_subscription_updated`, `webhook_payment_intent_succeeded`, `webhook_payment_intent_payment_failed`
* **Source:** `app/Modules/PaymentMethods/StripeGateway/Webhook/IPN.php`

#### Parameters:
`$data` *(array)*: The Stripe event object and associated order
```php
$data = [
    'event' => $event, // Stripe Event object (contains type, data, etc.)
    'order' => $order, // \FluentCart\App\Models\Order instance (may be WP_Error if not found)
];
```

#### Usage Example:
```php
// Hook into Stripe charge refunded webhook event
add_action('fluent_cart/payments/stripe/webhook_charge_refunded', function ($data) {
    // Extract Stripe event object and order model
    $event = $data['event'];
    $order = $data['order'];

    // Exit early if order lookup failed
    if (is_wp_error($order)) {
        return;
    }

    $charge = $event->data->object;

    // Log custom refund webhook event
    fluent_cart_add_log(
        'Stripe Refund Webhook',
        'Charge ' . $charge->id . ' refunded for Order #' . $order->id,
        'info'
    );
}, 10, 1);
```

---

## PayPal Webhooks

### `paypal_webhook_received`
`fluent_cart/paypal_webhook_received` — Fires when raw PayPal webhook data is received before processing

* **When it runs:** This action fires early in PayPal webhook processing, after the webhook type has been validated against the list of supported events but before any event-specific handling occurs. Use this to log or inspect all incoming PayPal webhook payloads.
* **Source:** `app/Modules/PaymentMethods/PayPalGateway/IPN.php`

#### Parameters:
`$data` *(array)*: The parsed and raw webhook data
```php
$data = [
    'data' => $data,      // Parsed webhook payload (array)
    'raw'  => $post_data, // Raw POST body string
];
```

#### Usage Example:
```php
// Hook when raw PayPal webhook data is received before processing
add_action('fluent_cart/paypal_webhook_received', function ($data) {
    // Log all incoming raw PayPal webhooks for debugging
    error_log('PayPal webhook received: ' . wp_json_encode($data['data']));
}, 10, 1);
```

---

### `paypal/webhook_subscription_payment_received`
`fluent_cart/payments/paypal/webhook_subscription_payment_received` — Fires when a PayPal recurring subscription payment is received

* **When it runs:** This action fires when a PayPal `PAYMENT.SALE.COMPLETED` webhook is received and the resource contains a `billing_agreement_id`, indicating it is a recurring subscription payment rather than a one-time purchase.
* **Source:** `app/Modules/PaymentMethods/PayPalGateway/IPN.php`

#### Parameters:
`$data` *(array)*: The charge resource and billing agreement ID
```php
$data = [
    'charge'                 => $resource,           // PayPal sale resource object (array)
    'vendor_subscription_id' => $billingAgreementId, // PayPal billing agreement ID (string)
];
```

#### Usage Example:
```php
// Hook when a PayPal recurring subscription payment is received
add_action('fluent_cart/payments/paypal/webhook_subscription_payment_received', function ($data) {
    // Extract PayPal charge resource and billing agreement ID
    $charge = $data['charge'];
    $billingAgreementId = $data['vendor_subscription_id'];

    // Log recurring payment event
    fluent_cart_add_log(
        'PayPal Recurring Payment',
        'Billing agreement ' . $billingAgreementId . ' payment received.',
        'success'
    );
}, 10, 1);
```

---

### `paypal/webhook_payment_capture_completed`
`fluent_cart/payments/paypal/webhook_payment_capture_completed` — Fires when a PayPal one-time payment capture completes

* **When it runs:** This action fires when a PayPal `PAYMENT.SALE.COMPLETED` webhook arrives without a billing agreement ID (one-time payment), or when a `PAYMENT.CAPTURE.COMPLETED` event is received. Both indicate a successful one-time payment capture.
* **Source:** `app/Modules/PaymentMethods/PayPalGateway/IPN.php`

#### Parameters:
`$data` *(array)*: The charge resource from PayPal
```php
$data = [
    'charge' => $resource, // PayPal capture/sale resource object (array)
];
```

#### Usage Example:
```php
// Hook when a PayPal one-time payment capture completes
add_action('fluent_cart/payments/paypal/webhook_payment_capture_completed', function ($data) {
    // Extract PayPal charge capture resource
    $charge = $data['charge'];

    // Handle one-time payment capture confirmation log
    fluent_cart_add_log(
        'PayPal Capture Completed',
        'Capture completed for resource: ' . wp_json_encode($charge),
        'success'
    );
}, 10, 1);
```

---

### `paypal/webhook_payment_sale_refunded`
`fluent_cart/payments/paypal/webhook_payment_sale_refunded` — Fires when a PayPal recurring sale is refunded

* **When it runs:** This action fires when a PayPal `PAYMENT.SALE.REFUNDED` webhook is received, indicating that a refund has been issued for a recurring/subscription payment sale.
* **Source:** `app/Modules/PaymentMethods/PayPalGateway/IPN.php`

#### Parameters:
`$data` *(array)*: The refund resource from PayPal
```php
$data = [
    'refund' => $resource, // PayPal refund resource object (array)
];
```

#### Usage Example:
```php
// Hook when a PayPal recurring sale is refunded
add_action('fluent_cart/payments/paypal/webhook_payment_sale_refunded', function ($data) {
    // Extract PayPal refund resource object
    $refund = $data['refund'];

    // Log recurring payment sale refund event
    fluent_cart_add_log(
        'PayPal Sale Refund',
        'Recurring payment sale refunded: ' . wp_json_encode($refund),
        'info'
    );
}, 10, 1);
```

---

### `paypal/webhook_payment_capture_refunded`
`fluent_cart/payments/paypal/webhook_payment_capture_refunded` — Fires when a PayPal one-time payment capture is refunded

* **When it runs:** This action fires when a PayPal `PAYMENT.CAPTURE.REFUNDED` webhook is received, indicating that a refund has been issued for a one-time payment capture.
* **Source:** `app/Modules/PaymentMethods/PayPalGateway/IPN.php`

#### Parameters:
`$data` *(array)*: The refund resource from PayPal
```php
$data = [
    'refund' => $resource, // PayPal refund resource object (array)
];
```

#### Usage Example:
```php
// Hook when a PayPal one-time payment capture is refunded
add_action('fluent_cart/payments/paypal/webhook_payment_capture_refunded', function ($data) {
    // Extract PayPal capture refund resource object
    $refund = $data['refund'];

    // Log one-time payment refund event
    fluent_cart_add_log(
        'PayPal Capture Refund',
        'One-time payment capture refunded: ' . wp_json_encode($refund),
        'info'
    );
}, 10, 1);
```

---

### `paypal/webhook_{$eventType}` (disputes)
`fluent_cart/payments/paypal/webhook_{$eventType}` — Fires for PayPal customer dispute events

* **When it runs:** This dynamic action fires when a PayPal dispute-related webhook is received. The `{$eventType}` is the PayPal event type converted to lowercase with dots replaced by underscores.
* **Available dynamic variants:** `webhook_customer_dispute_created`, `webhook_customer_dispute_updated`, `webhook_customer_dispute_resolved`
* **Source:** `app/Modules/PaymentMethods/PayPalGateway/IPN.php`

#### Parameters:
`$data` *(array)*: The dispute resource from PayPal
```php
$data = [
    'dispute' => $resource, // PayPal dispute resource object (array)
];
```

#### Usage Example:
```php
// Hook when a PayPal customer dispute is created
add_action('fluent_cart/payments/paypal/webhook_customer_dispute_created', function ($data) {
    // Extract dispute payload
    $dispute = $data['dispute'];

    // Alert admin about a new PayPal customer dispute
    wp_mail(
        get_option('admin_email'),
        'PayPal Dispute Created',
        'A customer has opened a dispute. Details: ' . wp_json_encode($dispute)
    );
}, 10, 1);
```

---

## Mollie Webhooks (Pro)

### `mollie/webhook_subscription_payment_{$status}` (Pro)
`fluent_cart/payments/mollie/webhook_subscription_payment_{$status}` — Fires for each Mollie subscription payment status change

* **When it runs:** This dynamic action fires during Mollie webhook (IPN) processing when a subscription payment status is determined. The `{$status}` is replaced with the Mollie payment status (`paid`, `failed`, `expired`, `canceled`).
* **Available dynamic variants:** `webhook_subscription_payment_paid`, `webhook_subscription_payment_failed`, `webhook_subscription_payment_expired`, `webhook_subscription_payment_canceled`
* **Source:** `fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/Webhook/MollieIPN.php`

#### Parameters:
* `$molliePayment` *(object)* — The Mollie Payment object from the API
* `$order` *(\FluentCart\App\Models\Order)* — The Order model instance associated with this payment

#### Usage Example:
```php
// Hook for successful Mollie subscription payment (Pro)
add_action('fluent_cart/payments/mollie/webhook_subscription_payment_paid', function ($molliePayment, $order) {
    // Handle successful Mollie subscription payment log
    fluent_cart_add_log(
        'Mollie Subscription Payment',
        'Subscription payment received for Order #' . $order->id . ' (Mollie ID: ' . $molliePayment->id . ')',
        'success'
    );
}, 10, 2);
```

---

### `mollie/webhook_payment_{$status}` (Pro)
`fluent_cart/payments/mollie/webhook_payment_{$status}` — Fires for each Mollie one-time payment status change

* **When it runs:** This dynamic action fires during Mollie webhook processing when a one-time (non-subscription) payment status is determined. The `{$status}` is replaced with the Mollie payment status.
* **Available dynamic variants:** `webhook_payment_paid`, `webhook_payment_failed`, `webhook_payment_expired`, `webhook_payment_canceled`
* **Source:** `fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/Webhook/MollieIPN.php`

#### Parameters:
* `$molliePayment` *(object)* — The Mollie Payment object from the API
* `$order` *(\FluentCart\App\Models\Order)* — The Order model instance associated with this payment

#### Usage Example:
```php
// Hook for successful Mollie one-time payment (Pro)
add_action('fluent_cart/payments/mollie/webhook_payment_paid', function ($molliePayment, $order) {
    // Trigger external fulfillment for Mollie order
    wp_remote_post('https://fulfillment.example.com/api/orders', [
        'body' => wp_json_encode([
            'order_id'   => $order->id,
            'mollie_id'  => $molliePayment->id,
            'amount'     => $molliePayment->amount->value,
            'currency'   => $molliePayment->amount->currency,
        ]),
    ]);
}, 10, 2);
```

---

### `payment_failed` (Mollie) (Pro)
`fluent_cart/payment_failed` — Fires when a Mollie payment fails, is canceled, or expires

* **When it runs:** This action fires inside the Mollie IPN handler when a payment is determined to have failed, been canceled, or expired. The order status and payment status are updated before this hook runs.
* **Source:** `fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/Webhook/MollieIPN.php`

#### Parameters:
`$data` *(array)*: Payment failure data
```php
$data = [
    'order'              => $order,              // \FluentCart\App\Models\Order — with updated failed status
    'transaction'        => $transactionModel,   // \FluentCart\App\Models\OrderTransaction
    'old_payment_status' => $oldStatus,          // string — previous payment status
    'new_payment_status' => 'failed',            // string — new payment status
    'reason'             => $reason,             // string — 'failed', 'canceled', or 'expired'
];
```

#### Usage Example:
```php
// Hook when a Mollie payment fails, is canceled, or expires (Pro)
add_action('fluent_cart/payment_failed', function ($data) {
    // Extract order, transaction, and failure reason
    $order       = $data['order'];
    $transaction = $data['transaction'];
    $oldStatus   = $data['old_payment_status'];
    $newStatus   = $data['new_payment_status'];
    $reason      = $data['reason'];

    // Only handle Mollie failures in this callback
    if ($order->payment_method !== 'mollie') {
        return;
    }

    // Send email alert to admin regarding Mollie failure
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
}, 10, 1);
```

---

## Paddle Webhooks (Pro)

### `paddle_webhook_received` (Pro)
`fluent_cart/paddle_webhook_received` — Fires when raw Paddle webhook data is received before processing

* **When it runs:** This action fires early in Paddle webhook processing, after the event type has been extracted from the payload but before any event-specific handling occurs. Use this to log or inspect all incoming Paddle webhook payloads for debugging purposes.
* **Source:** `fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/Webhook/IPN.php`

#### Parameters:
* `$eventType` *(string)* — The Paddle event type (e.g. `transaction.paid`, `subscription.created`)
* `$data` *(array)* — The parsed webhook payload
* `$raw` *(string)* — The raw POST body string
* `$order` *(\FluentCart\App\Models\Order|null)* — The associated Order model instance, or `null` if not resolved

#### Usage Example:
```php
// Hook when raw Paddle webhook data is received before processing (Pro)
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
}, 10, 4);
```

---

### `paddle/webhook_{$eventType}` (Pro)
`fluent_cart/payments/paddle/webhook_{$eventType}` — Fires for each Paddle webhook event

* **When it runs:** This dynamic action fires during Paddle webhook (IPN) processing after the event has been received and the associated order has been resolved (if applicable). The `{$eventType}` is the Paddle event type with dots replaced by underscores.
* **Available dynamic variants:** `webhook_transaction_paid`, `webhook_transaction_completed`, `webhook_transaction_payment_failed`, `webhook_transaction_refunded`, `webhook_adjustment_created`, `webhook_adjustment_updated`, `webhook_subscription_created`, `webhook_subscription_activated`, `webhook_subscription_updated`, `webhook_subscription_canceled`, `webhook_subscription_paused`, `webhook_subscription_resumed`, `webhook_subscription_past_due`
* **Source:** `fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/Webhook/IPN.php`

#### Parameters:
* `$eventType` *(string)* — The Paddle event type with dots replaced by underscores
* `$data` *(array)* — The parsed webhook payload
* `$raw` *(string)* — The raw POST body string
* `$order` *(\FluentCart\App\Models\Order|null)* — The associated Order model instance, or `null` if not resolved

#### Usage Example:
```php
// Hook when a Paddle transaction payment succeeds (Pro)
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

// Hook when a Paddle subscription is canceled (Pro)
add_action('fluent_cart/payments/paddle/webhook_subscription_canceled', function ($eventType, $data, $raw, $order) {
    if (!$order) {
        return;
    }

    // Alert admin about Paddle subscription cancellation via email
    wp_mail(
        get_option('admin_email'),
        'Paddle Subscription Canceled - Order #' . $order->id,
        'A Paddle subscription has been canceled. Event data: ' . wp_json_encode($data)
    );
}, 10, 4);

// Hook when a Paddle transaction is refunded (Pro)
add_action('fluent_cart/payments/paddle/webhook_transaction_refunded', function ($eventType, $data, $raw, $order) {
    if (!$order) {
        return;
    }

    // Track Paddle refund event
    fluent_cart_add_log(
        'Paddle Refund',
        'Paddle transaction refunded for Order #' . $order->id,
        'warning'
    );
}, 10, 4);
```

---

## Integrations

### `register_integration_action`
`fluent_cart/register_integration_action` — Register custom integration actions during initialization

* **When it runs:** This action fires during WordPress `init` to allow registration of custom integration actions. Use this hook to register your integration provider so it appears in the FluentCart integration action settings.
* **Source:** `app/Modules/IntegrationActions/GlobalIntegrationActionHandler.php`

#### Parameters: None.

#### Usage Example:
```php
// Hook to register custom integration actions during initialization
add_action('fluent_cart/register_integration_action', function () {
    // Register a custom integration action provider via filter
    add_filter('fluent_cart/integration/get_global_integration_actions', function ($actions) {
        $actions['my_crm'] = [
            'title'    => 'My CRM',
            'logo'     => plugin_dir_url(__FILE__) . 'logo.png',
            'handler'  => 'MyCrmIntegrationHandler',
        ];
        return $actions;
    });
}, 10, 0);
```

---

### `authenticate_global_credentials_{$settingsKey}`
`fluent_cart/integration/authenticate_global_credentials_{$settingsKey}` — Verify integration credentials for a specific provider

* **When it runs:** This dynamic action fires when a user clicks the "Verify" or "Authenticate" button for an integration's global credentials in the FluentCart admin settings. The `{$settingsKey}` is the integration provider's settings key (e.g. `mailchimp`, `activecampaign`).
* **Source:** `app/Modules/Integrations/GlobalIntegrationSettings.php`

#### Parameters:
`$data` *(array)*: The settings key and integration configuration
```php
$data = [
    'settings_key' => $settingsKey, // string — Integration provider key
    'integration'  => $integration, // array — Integration settings data (unslashed)
];
```

#### Usage Example:
```php
// Hook to verify integration credentials for a specific provider
add_action('fluent_cart/integration/authenticate_global_credentials_my_crm', function ($data) {
    // Extract API key from integration settings payload
    $apiKey = $data['integration']['api_key'] ?? '';

    // Verify the API key with the external service endpoint
    $response = wp_remote_get('https://api.mycrm.com/verify', [
        'headers' => ['Authorization' => 'Bearer ' . $apiKey],
    ]);

    if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) {
        wp_send_json_error(['message' => 'Invalid API credentials.'], 400);
    }

    wp_send_json_success(['message' => 'Credentials verified successfully.']);
}, 10, 1);
```

---

### `save_global_integration_settings_{$settingsKey}`
`fluent_cart/integration/save_global_integration_settings_{$settingsKey}` — Save integration settings for a specific provider

* **When it runs:** This dynamic action fires when a user saves the global integration settings for a specific provider. The `{$settingsKey}` is the integration provider's settings key. The handler is expected to persist the settings and send a JSON response.
* **Source:** `app/Modules/Integrations/GlobalIntegrationSettings.php`

#### Parameters:
`$data` *(array)*: The settings key and integration configuration
```php
$data = [
    'settings_key' => $settingsKey, // string — Integration provider key
    'integration'  => $integration, // array — Integration settings data (unslashed)
];
```

#### Usage Example:
```php
// Hook to save integration settings for a specific provider
add_action('fluent_cart/integration/save_global_integration_settings_my_crm', function ($data) {
    // Extract integration settings array
    $settings = $data['integration'];

    // Persist integration settings into FluentCart options
    fluent_cart_update_option('my_crm_settings', $settings);

    wp_send_json_success([
        'message' => 'Settings saved successfully.',
    ]);
}, 10, 1);
```

---

### `integration/chained_{$route}`
`fluent_cart/integration/chained_{$route}` — Fires for chained data requests in cascading dropdowns

* **When it runs:** This dynamic action fires when the integration settings UI requests chained/dependent data for cascading dropdown fields. For example, after selecting a mailing list, this hook loads the available tags or groups for that list. The `{$route}` is the integration's route identifier.
* **Source:** `app/Modules/Integrations/GlobalIntegrationSettings.php`

#### Parameters:
`$data` *(array)*: The request data for the chained lookup
```php
$data = [
    'data' => $requestData, // array — Request data array (contains route, selected values, etc.)
];
```

#### Usage Example:
```php
// Hook for chained data requests in cascading dropdowns
add_action('fluent_cart/integration/chained_my_crm', function ($data) {
    // Extract request data and list ID
    $requestData = $data['data'];
    $listId = $requestData['list_id'] ?? '';

    // Fetch tags for the selected mailing list
    $tags = my_crm_get_tags($listId);

    wp_send_json_success([
        'tags' => $tags,
    ]);
}, 10, 1);
```

---

### `integration/run/{$provider}`
`fluent_cart/integration/run/{$provider}` — Execute a specific integration feed for a provider

* **When it runs:** This dynamic action fires when an integration feed needs to be executed for a specific provider, both in real-time (synchronous) and async (via scheduled actions) processing. The `{$provider}` is the integration provider's slug (e.g. `mailchimp`, `activecampaign`).
* **Source:** `app/Listeners/IntegrationEventListener.php`

#### Parameters:
`$integrationArray` *(array)*: The full integration feed configuration and context
```php
$integrationArray = [
    'provider'   => 'mailchimp',  // string — Integration provider slug
    'order'      => $order,       // \FluentCart\App\Models\Order instance
    'event_data' => $data,        // array — Event trigger data (may include subscription)
    'feed'       => [],           // array — Feed configuration array
];
```

#### Usage Example:
```php
// Hook to execute a specific integration feed for a provider
add_action('fluent_cart/integration/run/my_crm', function ($integrationArray) {
    // Extract order, feed config, and customer model
    $order = $integrationArray['order'];
    $feed = $integrationArray['feed'] ?? [];
    $customer = $order->customer;

    // Push customer data to external CRM via HTTP request
    wp_remote_post('https://api.mycrm.com/contacts', [
        'headers' => [
            'Authorization' => 'Bearer ' . fluent_cart_get_option('my_crm_api_key'),
            'Content-Type'  => 'application/json',
        ],
        'body' => wp_json_encode([
            'email' => $customer->email,
            'name'  => $customer->full_name,
            'tags'  => $feed['tags'] ?? [],
        ]),
    ]);
}, 10, 1);
```

---

### `global_notify_completed`
`fluent_cart/integrations/global_notify_completed` — Fires after all synchronous global notification feeds have completed

* **When it runs:** This action fires after all sync (non-async) global notification integration feeds have been processed for an order. It does not fire if there are async feeds still pending.
* **Source:** `app/Modules/Integrations/GlobalNotificationHandler.php`

#### Parameters:
* `$order` *(\FluentCart\App\Models\Order)* — The Order model instance
* `$feeds` *(array)* — Array of feed configurations that were processed

#### Usage Example:
```php
// Hook after all synchronous global notification feeds have completed
add_action('fluent_cart/integrations/global_notify_completed', function ($order, $feeds) {
    // Log completion of synchronous integrations for order
    fluent_cart_add_log(
        'Integrations Complete',
        count($feeds) . ' integration feeds processed for Order #' . $order->id,
        'info'
    );
}, 10, 2);
```

---

### `reindex_integration_feeds`
`fluent_cart/reindex_integration_feeds` — Fires when integration feeds need to be re-indexed

* **When it runs:** This action fires after integration feed configurations are saved or updated, both at the global level (via `IntegrationController`) and at the product level (via `ProductIntegrationsController`).
* **Source:** `app/Http/Controllers/IntegrationController.php`, `app/Http/Controllers/ProductIntegrationsController.php`

#### Parameters:
`$data` *(array)*: Empty array `[]`

#### Usage Example:
```php
// Hook when integration feeds need to be re-indexed
add_action('fluent_cart/reindex_integration_feeds', function ($data) {
    // Clear cached integration feed transient
    delete_transient('my_plugin_integration_cache');
}, 10, 1);
```

---

## Storage Drivers

### `register_storage_drivers`
`fluent_cart/register_storage_drivers` — Register custom file storage drivers

* **When it runs:** This action fires during WordPress `init` at priority 9, after the built-in Local and S3 storage drivers have been initialized. Use this hook to register a custom file storage driver (e.g. Google Cloud Storage, Azure Blob Storage) for digital product file delivery.
* **Source:** `app/Hooks/Handlers/GlobalStorageHandler.php`

#### Parameters: None.

#### Usage Example:
```php
// Hook to register custom file storage drivers
add_action('fluent_cart/register_storage_drivers', function () {
    // Register custom storage driver via filter
    add_filter('fluent_cart/storage_drivers', function ($drivers) {
        $drivers['gcs'] = [
            'title'   => 'Google Cloud Storage',
            'handler' => new MyGcsStorageDriver(),
        ];
        return $drivers;
    });
}, 10, 0);
```

---

## Development Logging

### `dev_log`
`fluent_cart/dev_log` — Fires for development and debug logging (requires `FLUENT_CART_DEV_MODE`)

* **When it runs:** This action fires at various points during payment gateway webhook processing (primarily in the PayPal IPN handler) when the `FLUENT_CART_DEV_MODE` constant is defined. It provides detailed diagnostic data for debugging webhook failures, signature verification issues, and missing transaction references.
* **Source:** `app/Modules/PaymentMethods/PayPalGateway/IPN.php` (multiple call sites)

#### Parameters:
`$data` *(array)*: Logging context with raw data and metadata
```php
$data = [
    'raw_data'    => $rawData,     // mixed — Raw webhook payload or resource data
    'status'      => 'failed',     // string — Log status: 'failed', 'received', etc.
    'title'       => 'Log title',  // string — Human-readable log title
    'log_type'    => 'webhook',    // string — Type of log entry
    'module_type' => 'paypal_ipn', // string — Module identifier
    'module_name' => 'PayPal',     // string — Display name of the module
];
```

#### Usage Example:
```php
// Hook for development and debug logging (requires FLUENT_CART_DEV_MODE)
add_action('fluent_cart/dev_log', function ($data) {
    // Format detailed diagnostic log entry string
    $logEntry = sprintf(
        "[%s] [%s] %s - %s\n%s\n\n",
        gmdate('Y-m-d H:i:s'),
        $data['status'] ?? 'unknown',
        $data['module_name'] ?? 'General',
        $data['title'] ?? 'No title',
        wp_json_encode($data['raw_data'] ?? [], JSON_PRETTY_PRINT)
    );

    // Write diagnostic entry to debug log file
    error_log($logEntry, 3, WP_CONTENT_DIR . '/fluent-cart-debug.log');
}, 10, 1);
```
