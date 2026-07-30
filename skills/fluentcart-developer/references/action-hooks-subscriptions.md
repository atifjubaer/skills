# Action Hooks: Subscriptions

Action hooks for Subscription lifecycle management, status transitions, and scheduled reminder notifications. These hooks let you react to subscription state changes, send custom notifications, and integrate with external systems. Most hooks pass the related Order and Customer models as well.

---

## Subscription Status Changes

### `subscription_status_changed`
`fluent_cart/payments/subscription_status_changed` — Fires on any subscription status transition

* **When it runs:** This action fires whenever a Subscription's status changes from one value to another (e.g., `pending` to `active`, `active` to `cancelled`, etc.). It does not fire when other subscription data changes without a status transition. This is the generic handler -- for status-specific hooks, see status-specific hooks below.
* **Source:** `app/Modules/Subscriptions/Services/SubscriptionService.php`

#### Parameters:
`$data` *(array)*: Subscription status change data
```php
$data = [
    'subscription' => $subscriptionModel,        // \FluentCart\App\Models\Subscription
    'order'        => $subscriptionModel->order,   // \FluentCart\App\Models\Order
    'customer'     => $subscriptionModel->customer,// \FluentCart\App\Models\Customer
    'old_status'   => 'pending',                  // string — previous status
    'new_status'   => 'active',                   // string — current status after update
];
```

#### Usage Example:
```php
// Hook into any subscription status change
add_action('fluent_cart/payments/subscription_status_changed', function ($data) {
    // Extract subscription model and status values
    $subscription = $data['subscription'];
    $oldStatus    = $data['old_status'];
    $newStatus    = $data['new_status'];

    // Log every status transition into FluentCart logs
    fluent_cart_add_log(
        'Subscription Status Changed',
        sprintf('Subscription #%d changed from %s to %s', $subscription->id, $oldStatus, $newStatus),
        'info'
    );
}, 10, 1);
```

---

### `subscription_active`
`fluent_cart/payments/subscription_active` — Fires when a subscription becomes active

* **When it runs:** This action fires when a subscription's status transitions to `active`. This may occur after initial payment, after reactivation, or when moving from trialing to active.
* **Source:** `app/Modules/Subscriptions/Services/SubscriptionService.php`

#### Parameters:
`$data` *(array)*: Subscription data
```php
$data = [
    'subscription' => $subscriptionModel,        // \FluentCart\App\Models\Subscription
    'order'        => $subscriptionModel->order,   // \FluentCart\App\Models\Order
    'customer'     => $subscriptionModel->customer,// \FluentCart\App\Models\Customer
    'old_status'   => 'pending',                  // string — previous status
    'new_status'   => 'active',                   // string — always 'active'
];
```

#### Usage Example:
```php
// Hook when a subscription becomes active
add_action('fluent_cart/payments/subscription_active', function ($data) {
    // Extract customer model from event data
    $customer = $data['customer'];

    // Grant premium access when subscription activates
    update_user_meta($customer->user_id, 'premium_member', true);
}, 10, 1);
```

---

### `subscription_canceled`
`fluent_cart/payments/subscription_canceled` — Fires when a subscription is cancelled

* **When it runs:** This action fires when a subscription's status transitions to `canceled`. The `canceled_at` timestamp is automatically set if not already provided.
* **Source:** `app/Modules/Subscriptions/Services/SubscriptionService.php`

#### Parameters:
`$data` *(array)*: Subscription data
```php
$data = [
    'subscription' => $subscriptionModel,        // \FluentCart\App\Models\Subscription
    'order'        => $subscriptionModel->order,   // \FluentCart\App\Models\Order
    'customer'     => $subscriptionModel->customer,// \FluentCart\App\Models\Customer
    'old_status'   => 'active',                   // string — previous status
    'new_status'   => 'canceled',                 // string — always 'canceled'
];
```

#### Usage Example:
```php
// Hook when a subscription is cancelled
add_action('fluent_cart/payments/subscription_canceled', function ($data) {
    // Extract subscription and customer models from event data
    $subscription = $data['subscription'];
    $customer     = $data['customer'];

    // Revoke premium access on cancellation
    update_user_meta($customer->user_id, 'premium_member', false);

    // Notify store administrator via email
    wp_mail(
        get_option('admin_email'),
        'Subscription Cancelled',
        sprintf('Subscription #%d for %s has been cancelled.', $subscription->id, $customer->email)
    );
}, 10, 1);
```

---

### `subscription_paused`
`fluent_cart/payments/subscription_paused` — Fires when a subscription is paused

* **When it runs:** This action fires when a subscription's status transitions to `paused`. The subscription remains in the system but billing is temporarily halted.
* **Source:** `app/Modules/Subscriptions/Services/SubscriptionService.php`

#### Parameters:
`$data` *(array)*: Subscription data
```php
$data = [
    'subscription' => $subscriptionModel,        // \FluentCart\App\Models\Subscription
    'order'        => $subscriptionModel->order,   // \FluentCart\App\Models\Order
    'customer'     => $subscriptionModel->customer,// \FluentCart\App\Models\Customer
    'old_status'   => 'active',                   // string — previous status
    'new_status'   => 'paused',                   // string — always 'paused'
];
```

#### Usage Example:
```php
// Hook when a subscription is paused
add_action('fluent_cart/payments/subscription_paused', function ($data) {
    // Extract subscription model from event data
    $subscription = $data['subscription'];

    // Temporarily suspend feature access for paused customer
    update_user_meta($data['customer']->user_id, 'subscription_paused', true);
}, 10, 1);
```

---

### `subscription_expired`
`fluent_cart/payments/subscription_expired` — Fires when a subscription expires

* **When it runs:** This action fires when a subscription's status transitions to `expired`. After this hook fires, the system also stores a `validity_expired_at` meta value and dispatches the `SubscriptionValidityExpired` event.
* **Source:** `app/Modules/Subscriptions/Services/SubscriptionService.php`

#### Parameters:
`$data` *(array)*: Subscription data
```php
$data = [
    'subscription' => $subscriptionModel,        // \FluentCart\App\Models\Subscription
    'order'        => $subscriptionModel->order,   // \FluentCart\App\Models\Order
    'customer'     => $subscriptionModel->customer,// \FluentCart\App\Models\Customer
    'old_status'   => 'active',                   // string — previous status
    'new_status'   => 'expired',                  // string — always 'expired'
];
```

#### Usage Example:
```php
// Hook when a subscription expires
add_action('fluent_cart/payments/subscription_expired', function ($data) {
    // Extract customer model from event data
    $customer = $data['customer'];

    // Remove premium access from customer user account
    update_user_meta($customer->user_id, 'premium_member', false);

    // Send expiration notification email to the customer
    wp_mail(
        $customer->email,
        'Your Subscription Has Expired',
        'Your subscription has expired. Please renew to continue using premium features.'
    );
}, 10, 1);
```

---

### `subscription_failing`
`fluent_cart/payments/subscription_failing` — Fires when a subscription payment is failing

* **When it runs:** This action fires when a subscription's status transitions to `failing`, indicating that a renewal payment attempt has failed. The subscription is still technically active but requires payment attention.
* **Source:** `app/Modules/Subscriptions/Services/SubscriptionService.php`

#### Parameters:
`$data` *(array)*: Subscription data
```php
$data = [
    'subscription' => $subscriptionModel,        // \FluentCart\App\Models\Subscription
    'order'        => $subscriptionModel->order,   // \FluentCart\App\Models\Order
    'customer'     => $subscriptionModel->customer,// \FluentCart\App\Models\Customer
    'old_status'   => 'active',                   // string — previous status
    'new_status'   => 'failing',                  // string — always 'failing'
];
```

#### Usage Example:
```php
// Hook when a subscription renewal payment is failing
add_action('fluent_cart/payments/subscription_failing', function ($data) {
    // Extract subscription and customer models from event data
    $subscription = $data['subscription'];
    $customer     = $data['customer'];

    // Alert the customer about the payment failure via email
    wp_mail(
        $customer->email,
        'Payment Failed for Your Subscription',
        sprintf('We were unable to process payment for subscription #%d. Please update your payment method.', $subscription->id)
    );
}, 10, 1);
```

---

### `subscription_expiring`
`fluent_cart/payments/subscription_expiring` — Fires when a subscription is marked as expiring soon

* **When it runs:** This action fires when a subscription's status transitions to `expiring`, indicating that the subscription is approaching its end-of-term and will not be renewed.
* **Source:** `app/Modules/Subscriptions/Services/SubscriptionService.php`

#### Parameters:
`$data` *(array)*: Subscription data
```php
$data = [
    'subscription' => $subscriptionModel,        // \FluentCart\App\Models\Subscription
    'order'        => $subscriptionModel->order,   // \FluentCart\App\Models\Order
    'customer'     => $subscriptionModel->customer,// \FluentCart\App\Models\Customer
    'old_status'   => 'active',                   // string — previous status
    'new_status'   => 'expiring',                 // string — always 'expiring'
];
```

#### Usage Example:
```php
// Hook when a subscription is marked as expiring soon
add_action('fluent_cart/payments/subscription_expiring', function ($data) {
    // Extract subscription and customer models from event data
    $subscription = $data['subscription'];
    $customer     = $data['customer'];

    // Send a win-back offer email before subscription fully expires
    wp_mail(
        $customer->email,
        'Your Subscription is About to Expire',
        'Renew now and get 10% off your next billing cycle!'
    );
}, 10, 1);
```

---

### `subscription_completed`
`fluent_cart/payments/subscription_completed` — Fires when a subscription completes all billing cycles

* **When it runs:** This action fires when a subscription's status transitions to `completed`. This occurs when the subscription has reached its end-of-term (EOT) -- i.e., the `bill_count` has met or exceeded `bill_times`. The `next_billing_date` is set to `NULL` and `canceled_at` is cleared.
* **Source:** `app/Modules/Subscriptions/Services/SubscriptionService.php`

#### Parameters:
`$data` *(array)*: Subscription data
```php
$data = [
    'subscription' => $subscriptionModel,        // \FluentCart\App\Models\Subscription
    'order'        => $subscriptionModel->order,   // \FluentCart\App\Models\Order
    'customer'     => $subscriptionModel->customer,// \FluentCart\App\Models\Customer
    'old_status'   => 'active',                   // string — previous status
    'new_status'   => 'completed',                // string — always 'completed'
];
```

#### Usage Example:
```php
// Hook when a subscription completes all required billing cycles
add_action('fluent_cart/payments/subscription_completed', function ($data) {
    // Extract subscription and customer models from event data
    $subscription = $data['subscription'];
    $customer     = $data['customer'];

    // Thank the customer for completing their full subscription term
    wp_mail(
        $customer->email,
        'Subscription Complete',
        sprintf('Your subscription #%d has completed all %d billing cycles. Thank you!', $subscription->id, $subscription->bill_times)
    );
}, 10, 1);
```

---

### `subscription_trialing`
`fluent_cart/payments/subscription_trialing` — Fires when a subscription enters trial status

* **When it runs:** This action fires when a subscription's status transitions to `trialing`. The subscription is in a free trial period and will transition to `active` (with billing) when the trial ends.
* **Source:** `app/Modules/Subscriptions/Services/SubscriptionService.php`

#### Parameters:
`$data` *(array)*: Subscription data
```php
$data = [
    'subscription' => $subscriptionModel,        // \FluentCart\App\Models\Subscription
    'order'        => $subscriptionModel->order,   // \FluentCart\App\Models\Order
    'customer'     => $subscriptionModel->customer,// \FluentCart\App\Models\Customer
    'old_status'   => 'pending',                  // string — previous status
    'new_status'   => 'trialing',                 // string — always 'trialing'
];
```

#### Usage Example:
```php
// Hook when a subscription enters trial status
add_action('fluent_cart/payments/subscription_trialing', function ($data) {
    // Extract subscription and customer models from event data
    $subscription = $data['subscription'];
    $customer     = $data['customer'];

    // Grant trial access to customer account
    update_user_meta($customer->user_id, 'trial_active', true);

    // Send trial welcome email to customer
    wp_mail(
        $customer->email,
        'Your Free Trial Has Started',
        sprintf('Enjoy your trial! Your first payment will be on %s.', $subscription->next_billing_date)
    );
}, 10, 1);
```

---

## Subscription Data Updates

### `subscription_data_updated`
`fluent_cart/subscription/data_updated` — Fires when subscription data changes without a status transition

* **When it runs:** This action fires when Subscription attributes are modified but the status remains the same. Examples include billing amount changes, next payment date adjustments, or metadata updates. It only fires when there are actual dirty (changed) fields on the model.
* **Source:** `app/Modules/Subscriptions/Services/SubscriptionService.php`

#### Parameters:
`$data` *(array)*: Subscription update data
```php
$data = [
    'subscription' => $subscriptionModel, // \FluentCart\App\Models\Subscription (already saved)
    'updated_data' => [
        // Only the fields that actually changed (dirty attributes), e.g.:
        'recurring_total'   => 2999,                  // int — new amount in cents
        'next_billing_date' => '2025-03-15 00:00:00', // string — updated billing date
    ],
];
```

#### Usage Example:
```php
// Hook when subscription data changes without a status transition
add_action('fluent_cart/subscription/data_updated', function ($data) {
    // Extract subscription model and modified attributes map
    $subscription = $data['subscription'];
    $updatedData  = $data['updated_data'];

    // Log billing amount changes if total was modified
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

    // Sync next billing date with external calendar if modified
    if (isset($updatedData['next_billing_date'])) {
        do_action('my_plugin/sync_billing_date', $subscription->id, $updatedData['next_billing_date']);
    }
}, 10, 1);
```

---

## Reminders & Notifications

### `subscription_renewal_reminder`
`fluent_cart/subscription_renewal_reminder` — Fires when a subscription renewal reminder is due

* **When it runs:** This action fires on a scheduled basis (via Action Scheduler) when a subscription's next billing date is approaching. The reminder system supports multiple billing cycles (`yearly`, `monthly`, `quarterly`, `half_yearly`) and configurable "days before" thresholds. Only fires for subscriptions with `active` or `trialing` status. The stage name indicates how many days before renewal (e.g., `before_30`, `before_7`).
* **Source:** `app/Services/Reminders/SubscriptionReminderService.php`

#### Parameters:
`$data` *(array)*: Renewal reminder data
```php
$data = [
    'subscription' => $subscription,           // \FluentCart\App\Models\Subscription
    'order'        => $subscription->order,    // \FluentCart\App\Models\Order
    'customer'     => $subscription->customer, // \FluentCart\App\Models\Customer
    'reminder'     => [
        'stage'         => 'before_30',            // string — e.g., 'before_30', 'before_7'
        'billing_cycle' => 'yearly',               // string — 'yearly', 'monthly', 'quarterly', 'half_yearly'
        'billing_date'  => '2025-03-15 00:00:00', // string — GMT formatted next billing date
    ],
];
```

#### Usage Example:
```php
// Hook when a scheduled subscription renewal reminder is due
add_action('fluent_cart/subscription_renewal_reminder', function ($data) {
    // Extract subscription, customer, and reminder metadata
    $subscription = $data['subscription'];
    $customer     = $data['customer'];
    $reminder     = $data['reminder'];

    // Send a custom renewal reminder email to the subscriber
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
}, 10, 1);
```

---

### `subscription_trial_end_reminder`
`fluent_cart/subscription_trial_end_reminder` — Fires when a trial ending reminder is due

* **When it runs:** This action fires on a scheduled basis when a trialing subscription's trial period is about to end. Only fires for subscriptions with `trialing` status (excluding simulated trials). The stage name indicates how many days before the trial ends (e.g., `trial_end_3`, `trial_end_1`). Configurable via the `trial_end_reminder_days` store setting.
* **Source:** `app/Services/Reminders/SubscriptionReminderService.php`

#### Parameters:
`$data` *(array)*: Trial end reminder data
```php
$data = [
    'subscription' => $subscription,           // \FluentCart\App\Models\Subscription
    'order'        => $subscription->order,    // \FluentCart\App\Models\Order
    'customer'     => $subscription->customer, // \FluentCart\App\Models\Customer
    'reminder'     => [
        'stage'          => 'trial_end_3',         // string — e.g., 'trial_end_3', 'trial_end_1'
        'trial_end_date' => '2025-02-01 00:00:00',// string — GMT formatted trial end date
    ],
];
```

#### Usage Example:
```php
// Hook when a trial ending reminder is due
add_action('fluent_cart/subscription_trial_end_reminder', function ($data) {
    // Extract subscription, customer, and reminder metadata
    $subscription = $data['subscription'];
    $customer     = $data['customer'];
    $reminder     = $data['reminder'];

    // Notify customer that their trial is ending soon via email
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
}, 10, 1);
```

---

### `invoice_reminder_overdue`
`fluent_cart/invoice_reminder_overdue` — Fires when an overdue invoice reminder is triggered

* **When it runs:** This action fires on a scheduled basis when an Order with an outstanding balance has passed its due date by a configured number of days. The stage name indicates how many days overdue (e.g., `overdue_1`, `overdue_3`, `overdue_7`). Only fires for orders with `pending`, `partially_paid`, `failed`, or `authorized` payment statuses. The overdue days are configurable via the `invoice_reminder_overdue_days` store setting (defaults to `1,3,7`).
* **Source:** `app/Services/Reminders/InvoiceReminderService.php`

#### Parameters:
`$data` *(array)*: Invoice overdue reminder data
```php
$data = [
    'order'    => $order,           // \FluentCart\App\Models\Order
    'customer' => $order->customer, // \FluentCart\App\Models\Customer
    'reminder' => [
        'stage'        => 'overdue_3',                             // string — e.g., 'overdue_1', 'overdue_3', 'overdue_7'
        'order_id'     => 123,                                     // int — order ID
        'order_ref'    => 'INV-00123',                             // string — invoice number or '#123' fallback
        'due_at'       => '2025-01-15 00:00:00',                   // string — GMT formatted due date
        'due_amount'   => 5000,                                    // int — outstanding amount in cents
        'payment_link' => 'https://example.com/checkout/pay/uuid', // string — customer payment URL
    ],
];
```

#### Usage Example:
```php
// Hook when an overdue invoice reminder is triggered
add_action('fluent_cart/invoice_reminder_overdue', function ($data) {
    // Extract order, customer, and overdue reminder details
    $order    = $data['order'];
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
}, 10, 1);
```

---

### `invoice_reminder_due`
`fluent_cart/invoice_reminder_due` — Fires when an invoice due-date reminder is triggered

* **When it runs:** This action fires on a scheduled basis when an order with an outstanding balance has reached its due date (stage `before_0`). This is the on-due-date notification, as opposed to the overdue reminders that fire after the due date has passed. Shares the same parameter structure as the overdue reminder.
* **Note:** This hook is currently defined in the codebase but the queueing logic for the `before_0` stage is commented out pending the full invoice feature deployment. It is documented here for forward compatibility.
* **Source:** `app/Services/Reminders/InvoiceReminderService.php`

#### Parameters:
`$data` *(array)*: Invoice due reminder data
```php
$data = [
    'order'    => $order,           // \FluentCart\App\Models\Order
    'customer' => $order->customer, // \FluentCart\App\Models\Customer
    'reminder' => [
        'stage'        => 'before_0',                              // string — always 'before_0' for due-date reminders
        'order_id'     => 123,                                     // int — order ID
        'order_ref'    => 'INV-00123',                             // string — invoice number or '#123' fallback
        'due_at'       => '2025-01-15 00:00:00',                   // string — GMT formatted due date
        'due_amount'   => 5000,                                    // int — outstanding amount in cents
        'payment_link' => 'https://example.com/checkout/pay/uuid', // string — customer payment URL
    ],
];
```

#### Usage Example:
```php
// Hook when an invoice due-date reminder is triggered
add_action('fluent_cart/invoice_reminder_due', function ($data) {
    // Extract order, customer, and due reminder details
    $order    = $data['order'];
    $customer = $data['customer'];
    $reminder = $data['reminder'];

    // Notify customer that their invoice is due today via email
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
}, 10, 1);
```

---

## Subscription Upgrades & Early Payments (Pro)

### `early_payment_completed` (Pro)
`fluent_cart/subscription/early_payment_completed` — Fires when an early installment payment is completed

* **When it runs:** This action fires when a customer makes an early installment payment on their subscription, paying for one or more future billing cycles ahead of schedule.
* **Source:** `fluent-cart-pro/app/Hooks/Handlers/EarlyInstallmentPaymentHandler.php` (line 279)

#### Parameters:
`$data` *(array)*: Early payment completion data
```php
$data = [
    'subscription'      => $subscription,     // \FluentCart\App\Models\Subscription
    'order'             => $order,             // \FluentCart\App\Models\Order
    'installment_count' => $installmentCount,  // int — number of installments paid early
];
```

#### Usage Example:
```php
// Hook when an early installment payment is completed (Pro extension)
add_action('fluent_cart/subscription/early_payment_completed', function ($data) {
    // Extract subscription, order, and installment count details
    $subscription     = $data['subscription'];
    $order            = $data['order'];
    $installmentCount = $data['installment_count'];

    // Log early installment payment event
    fluent_cart_add_log(
        'Early Payment Completed',
        sprintf('Subscription #%d received %d early installment(s) via order #%d', $subscription->id, $installmentCount, $order->id),
        'info'
    );
}, 10, 1);
```

---

### `order_upgraded` (Pro)
`fluent_cart/order/upgraded` — Fires when a plan upgrade is completed

* **When it runs:** This action fires when a customer completes a plan upgrade, transitioning from one product variant to another. The upgrade creates a new order and transaction record.
* **Source:** `fluent-cart-pro/app/Hooks/Handlers/UpgradeHandler.php` (line 242)

#### Parameters:
`$data` *(array)*: Upgrade completion data
```php
$data = [
    'order'           => $newOrder,         // \FluentCart\App\Models\Order — the new upgrade order
    'from_order'      => $upgradeFromOrder, // \FluentCart\App\Models\Order — the original order
    'cart'            => $cartModel,        // \FluentCart\App\Models\Cart — the cart used for the upgrade
    'from_variant_id' => $fromVariantId,    // int — ID of the original product variant
    'transaction'     => $transaction,      // \FluentCart\App\Models\OrderTransaction — the upgrade payment transaction
];
```

#### Usage Example:
```php
// Hook when a plan upgrade is completed (Pro extension)
add_action('fluent_cart/order/upgraded', function ($data) {
    // Extract upgraded order models and payment transaction
    $order          = $data['order'];
    $fromOrder      = $data['from_order'];
    $fromVariantId  = $data['from_variant_id'];
    $transaction    = $data['transaction'];

    // Log plan upgrade event
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
}, 10, 1);
```
