# Filter Hooks: Customers & Subscriptions

All filters related to Customer management, the customer portal, Subscription lifecycle, billing configuration, and automated reminders.

---

## Customer Data & Portal

### `customer/view`
`fluent_cart/customer/view` — Filter admin single customer view data

* **When it runs:** Applied when preparing a single customer's data for display in the admin panel.
* **Source:** `app/Http/Controllers/CustomerController.php` (line 74)

#### Parameters:
* `$customer` *(\FluentCart\App\Models\Customer)* — Customer model instance with loaded relations (`id`, `email`, `total_spent`, etc.)
* `$requestData` *(array)* — Full request data from `$request->all()`
* **Returns:** *(\FluentCart\App\Models\Customer)* — The modified customer data

#### Usage Example:
```php
// Filter single customer view data payload in admin panel
add_filter('fluent_cart/customer/view', function($customer, $requestData) {
    // Inject loyalty points user meta into customer view data
    $customer['loyalty_points'] = get_user_meta($customer['user_id'], 'loyalty_points', true);
    return $customer;
}, 10, 2);
```

---

### `widgets/single_customer`
`fluent_cart/widgets/single_customer` — Filter single customer admin widgets

* **When it runs:** Applied when loading widget data for a single customer's admin view, allowing custom widget section injection.
* **Source:** `app/Http/Controllers/CustomerController.php` (line 177)

#### Parameters:
* `$widgets` *(array)* — Array of widget definitions (default: `[]`)
* `$customer` *(\FluentCart\App\Models\Customer)* — Customer model instance
* **Returns:** *(array)* — The modified widgets array

#### Usage Example:
```php
// Filter admin widgets loaded on single customer detail view page
add_filter('fluent_cart/widgets/single_customer', function($widgets, $customer) {
    // Append custom CRM notes widget definition for customer
    $widgets[] = [
        'title' => 'CRM Notes',
        'content' => get_user_meta($customer->user_id, 'crm_notes', true)
    ];
    return $widgets;
}, 10, 2);
```

---

### `customer_dashboard_data`
`fluent_cart/customer_dashboard_data` — Filter customer dashboard data

* **When it runs:** Applied when preparing customer portal dashboard data, including recent orders list and section parts. Runs both when a customer exists and when no customer is found.
* **Source:** `app/Http/Controllers/FrontendControllers/CustomerProfileController.php` (lines 58, 114)

#### Parameters:
* `$data` *(array)* — Dashboard response data (`message`, `dashboard_data`, `sections_parts`)
* `$context` *(array)* — Context data containing customer (`['customer' => Customer|null]`)
* **Returns:** *(array)* — The modified dashboard data

#### Usage Example:
```php
// Filter customer portal dashboard response data payload
add_filter('fluent_cart/customer_dashboard_data', function($data, $context) {
    // Extract customer model instance from context
    $customer = $context['customer'];
    if ($customer) {
        // Inject welcome banner HTML above customer orders table
        $data['sections_parts']['before_orders_table'] = '<div class="welcome-banner">Welcome back!</div>';
    }
    return $data;
}, 10, 2);
```

---

### `global_customer_menu_items`
`fluent_cart/global_customer_menu_items` — Filter customer portal menu items

* **When it runs:** Applied when building customer portal sidebar navigation menu, after built-in items have been conditionally removed.
* **Source:** `app/Hooks/Handlers/ShortCodes/CustomerProfileHandler.php` (line 266)

#### Parameters:
* `$menuItems` *(array)* — Associative array of menu items keyed by slug (`orders`, `subscriptions`, `licenses`, `downloads`, `profile`)
* `$context` *(array)* — Context data (`['base_url' => string]`)
* **Returns:** *(array)* — The modified menu items array

#### Usage Example:
```php
// Filter customer portal sidebar navigation menu items
add_filter('fluent_cart/global_customer_menu_items', function($menuItems, $context) {
    // Inject custom Support menu item into customer portal navigation
    $baseUrl = $context['base_url'];
    $menuItems['support'] = [
        'label' => 'Support',
        'css_class' => 'fct_route',
        'link' => $baseUrl . 'support',
        'icon_svg' => '<svg>...</svg>'
    ];
    return $menuItems;
}, 10, 2);
```

---

### `customer_portal/active_tab`
`fluent_cart/customer_portal/active_tab` — Filter active tab in customer portal

* **When it runs:** Applied when rendering customer portal to determine which tab should be visually active by default.
* **Source:** `app/Hooks/Handlers/ShortCodes/CustomerProfileHandler.php` (line 117)

#### Parameters:
* `$activeTab` *(string)* — Active tab identifier (default: `''`)
* **Returns:** *(string)* — Modified active tab slug

#### Usage Example:
```php
// Filter default active tab slug in customer portal view
add_filter('fluent_cart/customer_portal/active_tab', function($activeTab) {
    // Set default active tab to subscriptions
    return 'subscriptions';
}, 10, 1);
```

---

### `customer_portal/custom_endpoints`
`fluent_cart/customer_portal/custom_endpoints` — Filter custom portal endpoints

* **When it runs:** Applied when routing customer portal requests to check for registered custom endpoint paths.
* **Source:** `app/Hooks/Handlers/ShortCodes/CustomerProfileHandler.php` (line 141)

#### Parameters:
* `$endpoints` *(array)* — Associative array of custom endpoints (default: `[]`)
* **Returns:** *(array)* — Modified endpoints array

#### Usage Example:
```php
// Register custom endpoint page handlers in customer portal
add_filter('fluent_cart/customer_portal/custom_endpoints', function($endpoints) {
    // Add custom warranty page rendering callback to portal endpoints
    $endpoints['warranty'] = [
        'render_callback' => function() {
            echo '<div class="warranty-page">Warranty info here</div>';
        }
    ];
    return $endpoints;
}, 10, 1);
```

> [!TIP]
> Consider using the `FluentCartGeneralApi::addCustomerPortalEndpoint()` helper method instead, which registers both the menu item and the endpoint in one call.

---

### `customer_portal/subscription_data`
`fluent_cart/customer_portal/subscription_data` — Filter customer portal subscription data

* **When it runs:** Applied when preparing a single subscription's data for display in customer portal, after transactions are loaded.
* **Source:** `app/Http/Controllers/FrontendControllers/CustomerSubscriptionController.php` (line 157)

#### Parameters:
* `$formattedData` *(array)* — Formatted subscription data including transactions
* `$context` *(array)* — Context data (`['subscription' => Subscription, 'customer' => Customer]`)
* **Returns:** *(array)* — Modified subscription data

#### Usage Example:
```php
// Filter subscription data structure formatted for customer portal
add_filter('fluent_cart/customer_portal/subscription_data', function($formattedData, $context) {
    // Extract subscription model instance from context
    $subscription = $context['subscription'];
    // Inject next invoice preview array into subscription details
    $formattedData['next_invoice_preview'] = [
        'amount' => $subscription->recurring_amount,
        'date' => $subscription->expiration_at
    ];
    return $formattedData;
}, 10, 2);
```

---

### `payment_methods/stripe_pub_key`
`fluent_cart/payment_methods/stripe_pub_key` — Filter Stripe public key for customer portal

* **When it runs:** Applied when localizing JavaScript data for customer portal, providing Stripe publishable key.
* **Source:** `app/Hooks/Handlers/ShortCodes/CustomerProfileHandler.php` (line 356)

#### Parameters:
* `$pubKey` *(string)* — Stripe publishable key (default: `''`)
* **Returns:** *(string)* — Modified Stripe public key

#### Usage Example:
```php
// Filter Stripe publishable key passed to customer portal JS
add_filter('fluent_cart/payment_methods/stripe_pub_key', function($pubKey) {
    // Override Stripe publishable key in test environment
    if (defined('STRIPE_TEST_MODE') && STRIPE_TEST_MODE) {
        return 'pk_test_xxxxxxxxxxxx';
    }
    return $pubKey;
}, 10, 1);
```

---

### `payment_methods/paypal_client_id`
`fluent_cart/payment_methods/paypal_client_id` — Filter PayPal client ID for customer portal

* **When it runs:** Applied when localizing JavaScript data for customer portal, providing PayPal client ID.
* **Source:** `app/Hooks/Handlers/ShortCodes/CustomerProfileHandler.php` (line 357)

#### Parameters:
* `$clientId` *(string)* — PayPal client ID (default: `''`)
* `$context` *(array)* — Additional context data (default: `[]`)
* **Returns:** *(string)* — Modified PayPal client ID

#### Usage Example:
```php
// Filter PayPal client ID passed to customer portal JS
add_filter('fluent_cart/payment_methods/paypal_client_id', function($clientId, $context) {
    // Provide sandbox PayPal client ID for client-side JS SDK
    return 'AYourPayPalClientId';
}, 10, 2);
```

---

## Customer Statuses & Auth

### `editable_customer_statuses` (legacy)
`fluent-cart/editable_customer_statuses` — Filter editable customer statuses

* **When it runs:** Applied when retrieving list of customer statuses that can be set in admin panel. Note hyphenated prefix (`fluent-cart/`).
* **Source:** `app/Helpers/Helper.php` (line 162), `app/Helpers/Status.php` (line 350)

#### Parameters:
* `$statuses` *(array)* — Associative array of status key => label (`'active' => 'Active'`, `'inactive' => 'Inactive'`)
* `$context` *(array)* — Additional context data (default: `[]`)
* **Returns:** *(array)* — Modified statuses array

#### Usage Example:
```php
// Filter editable customer statuses in admin panel (legacy hyphenated hook)
add_filter('fluent-cart/editable_customer_statuses', function($statuses, $context) {
    // Add custom "Suspended" status to editable customer statuses
    $statuses['suspended'] = __('Suspended', 'my-plugin');
    return $statuses;
}, 10, 2);
```

---

### `user/after_register/skip_hooks`
`fluent_cart/user/after_register/skip_hooks` — Skip post-registration hooks

* **When it runs:** Applied after a new WP user is created during checkout registration. When true, standard WP hooks like `register_new_user` are skipped.
* **Source:** `app/Services/AuthService.php` (line 122)

#### Parameters:
* `$skip` *(bool)* — Whether to skip hooks (default: `false`)
* `$user_id` *(int)* — Newly created WP user ID
* **Returns:** *(bool)* — Whether to skip post-registration hooks

#### Usage Example:
```php
// Control skipping post-registration hooks during checkout user creation
add_filter('fluent_cart/user/after_register/skip_hooks', function($skip, $userId) {
    // Skip default WP registration hooks to prevent welcome email dispatch
    return true;
}, 10, 2);
```

---

## Subscription Statuses & Configuration

### `subscription_statuses`
`fluent_cart/subscription_statuses` — Filter subscription statuses

* **When it runs:** Applied when retrieving list of all available subscription statuses throughout system.
* **Source:** `app/Helpers/Status.php` (line 253)

#### Parameters:
* `$statuses` *(array)* — Associative array of status key => label (`pending`, `active`, `failing`, `paused`, `expired`, `expiring`, `canceled`, `trialing`, `intended`, `past_due`, `completed`)
* `$context` *(array)* — Additional context data (default: `[]`)
* **Returns:** *(array)* — Modified subscription statuses array

#### Usage Example:
```php
// Filter available subscription statuses array across system
add_filter('fluent_cart/subscription_statuses', function($statuses, $context) {
    // Add custom "On Hold" subscription status
    $statuses['on_hold'] = __('On Hold', 'my-plugin');
    return $statuses;
}, 10, 2);
```

---

### `validable_subscription_statuses`
`fluent_cart/validable_subscription_statuses` — Filter valid (active) subscription statuses

* **When it runs:** Applied when determining which subscription statuses are considered "valid" for granting access (licenses, downloads, etc.).
* **Source:** `app/Helpers/Status.php` (line 271)

#### Parameters:
* `$statuses` *(array)* — Array of status keys considered valid (default: `['active', 'trialing']`)
* `$context` *(array)* — Additional context data (default: `[]`)
* **Returns:** *(array)* — Modified list of valid statuses

#### Usage Example:
```php
// Filter subscription statuses considered valid for access control
add_filter('fluent_cart/validable_subscription_statuses', function($statuses, $context) {
    // Include "expiring" status in list of valid subscription statuses
    $statuses[] = 'expiring';
    return $statuses;
}, 10, 2);
```

---

### `subscription/view`
`fluent_cart/subscription/view` — Filter admin subscription view data

* **When it runs:** Applied when preparing a single subscription's data for display in admin panel.
* **Source:** `app/Modules/Subscriptions/Http/Controllers/SubscriptionController.php` (line 63)

#### Parameters:
* `$subscription` *(\FluentCart\App\Models\Subscription)* — Subscription model with loaded relations
* `$context` *(array)* — Additional context data (default: `[]`)
* **Returns:** *(array)* — Modified subscription data

#### Usage Example:
```php
// Filter single subscription view data structure in admin panel
add_filter('fluent_cart/subscription/view', function($subscription, $context) {
    // Append external Stripe dashboard link to subscription data payload
    $subscription['external_url'] = 'https://dashboard.example.com/subscriptions/' . $subscription['vendor_subscription_id'];
    return $subscription;
}, 10, 2);
```

---

### `subscription/url_{$payment_method}`
`fluent_cart/subscription/url_{$payment_method}` — Filter vendor dashboard URL for a subscription

* **When it runs:** Applied when generating external vendor dashboard URL for subscription. Dynamic hook name with `{$payment_method}` replaced by gateway slug (`stripe`, `paypal`).
* **Source:** `app/Models/Subscription.php` (line 158)

#### Parameters:
* `$url` *(string)* — Vendor dashboard URL (default: `''`)
* `$context` *(array)* — Context data (`['vendor_subscription_id' => string, 'payment_mode' => 'live'|'test', 'subscription' => Subscription]`)
* **Returns:** *(string)* — Modified vendor dashboard URL

#### Usage Example:
```php
// Filter vendor dashboard URL attribute for Stripe subscriptions
add_filter('fluent_cart/subscription/url_stripe', function($url, $context) {
    // Extract vendor subscription ID and payment mode
    $subId = $context['vendor_subscription_id'];
    $mode = $context['payment_mode'];
    $base = ($mode === 'test')
        ? 'https://dashboard.example.com/test'
        : 'https://dashboard.example.com';
    return $base . '/subscriptions/' . $subId;
}, 10, 2);
```

---

### `subscription/can_reactivate`
`fluent_cart/subscription/can_reactivate` — Filter whether subscription can be reactivated

* **When it runs:** Applied when checking if a canceled, failing, expired, paused, expiring, or past-due subscription is eligible for reactivation.
* **Source:** `app/Models/Subscription.php` (line 427)

#### Parameters:
* `$canReactivate` *(bool)* — Whether subscription can be reactivated based on status
* `$context` *(array)* — Context data (`['subscription' => Subscription]`)
* **Returns:** *(bool)* — Modified reactivation eligibility

#### Usage Example:
```php
// Filter whether subscription is eligible for reactivation
add_filter('fluent_cart/subscription/can_reactivate', function($canReactivate, $context) {
    $subscription = $context['subscription'];

    // Prevent reactivation for subscriptions canceled more than 90 days ago
    if ($subscription->status === 'canceled') {
        $canceledAt = strtotime($subscription->updated_at);
        if ((time() - $canceledAt) > (90 * DAY_IN_SECONDS)) {
            return false;
        }
    }
    return $canReactivate;
}, 10, 2);
```

---

### `available_subscription_interval_options`
`fluent_cart/available_subscription_interval_options` — Filter subscription interval options

* **When it runs:** Applied when retrieving list of available subscription billing interval options for product configuration.
* **Source:** `app/Helpers/Helper.php` (line 1531)

#### Parameters:
* `$intervals` *(array)* — Array of interval option objects (`yearly`, `half_yearly`, `quarterly`, `monthly`, `weekly`, `daily`)
* **Returns:** *(array)* — Modified intervals array

#### Usage Example:
```php
// Filter available subscription billing interval options
add_filter('fluent_cart/available_subscription_interval_options', function($intervals) {
    // Add custom "Every 10th Day" billing interval option
    $intervals[] = [
        'label' => __('Every 10th Day', 'my-plugin'),
        'value' => 'every_tenth_day',
        'map_value' => '10th Day'
    ];
    return $intervals;
});
```

> [!TIP]
> When adding custom intervals, you must also implement `fluent_cart/subscription_interval_in_days` and `fluent_cart/subscription_billing_period` filters.

---

### `subscription_interval_in_days`
`fluent_cart/subscription_interval_in_days` — Filter number of days for custom subscription interval

* **When it runs:** Applied when converting subscription interval to day count. Built-in intervals calculate automatically; fires for custom/unknown intervals.
* **Source:** `app/Helpers/Helper.php` (line 1592), `app/Services/Payments/PaymentHelper.php` (line 236)

#### Parameters:
* `$days` *(int)* — Number of days for interval (default: `0` for custom)
* `$context` *(array)* — Context data (`['interval' => string]`)
* **Returns:** *(int)* — Number of days in interval

#### Usage Example:
```php
// Filter day count for custom subscription billing interval
add_filter('fluent_cart/subscription_interval_in_days', function($days, $args) {
    $interval = $args['interval'];

    // Return 10 days for custom every_tenth_day interval
    if ($interval === 'every_tenth_day') {
        return 10;
    }

    // Return 14 days for custom biweekly interval
    if ($interval === 'biweekly') {
        return 14;
    }

    return $days;
}, 10, 2);
```

---

### `max_trial_days_allowed`
`fluent_cart/max_trial_days_allowed` — Filter maximum trial days allowed

* **When it runs:** Applied when calculating adjusted trial days for subscription interval. Ensures trial does not exceed maximum.
* **Source:** `app/Helpers/Helper.php` (line 1566)

#### Parameters:
* `$maxDays` *(int)* — Maximum trial days allowed (default: `365`)
* `$context` *(array)* — Context data (`['existing_trial_days' => int, 'repeat_interval' => string, 'interval_in_days' => int]`)
* **Returns:** *(int)* — Modified maximum trial days

#### Usage Example:
```php
// Filter maximum trial days allowed for subscription intervals
add_filter('fluent_cart/max_trial_days_allowed', function($maxDays, $args) {
    // Cap trial duration at 30 days for monthly subscriptions
    if ($args['repeat_interval'] === 'monthly') {
        return 30;
    }
    return $maxDays;
}, 10, 2);
```

---

### `trial_info`
`fluent_cart/trial_info` — Filter trial info display text

* **When it runs:** Applied when generating human-readable trial information text shown to customers (e.g. "Free Trial: 14 days").
* **Source:** `app/Helpers/Helper.php` (line 1133)

#### Parameters:
* `$trialInfo` *(string)* — Generated trial info text
* `$otherInfo` *(array)* — Product/variant pricing metadata (`trial_days`, `signup_fee`, etc.)
* **Returns:** *(string)* — Modified trial info text

#### Usage Example:
```php
// Filter human-readable trial information display text string
add_filter('fluent_cart/trial_info', function($trialInfo, $otherInfo) {
    // Extract trial days from product pricing metadata
    $days = $otherInfo['trial_days'] ?? 0;
    if ($days > 0) {
        return sprintf('Try free for %d days - no credit card required!', $days);
    }
    return $trialInfo;
}, 10, 2);
```

---

## Subscription Billing

### `subscription_billing_period`
`fluent_cart/subscription_billing_period` — Filter billing period for payment gateways

* **When it runs:** Applied when translating subscription interval into payment gateway billing period format (Stripe Plans, PayPal billing cycles).
* **Source:** `app/Modules/PaymentMethods/StripeGateway/Plan.php` (line 58), `app/Modules/PaymentMethods/PayPalGateway/PayPalHelper.php` (line 243)

#### Parameters:
* `$billingPeriod` *(array)* — Gateway billing period (`['interval_unit' => 'month', 'interval_frequency' => 1]`)
* `$context` *(array)* — Context data (`['subscription_interval' => string, 'payment_method' => 'stripe'|'paypal']`)
* **Returns:** *(array)* — Modified billing period array

#### Usage Example:
```php
// Filter gateway billing period mapping for custom subscription intervals
add_filter('fluent_cart/subscription_billing_period', function($billingPeriod, $args) {
    $interval = $args['subscription_interval'];
    $method = $args['payment_method'];

    // Map custom every_tenth_day interval for Stripe and PayPal gateways
    if ($interval === 'every_tenth_day') {
        if ($method === 'stripe') {
            return [
                'interval_unit' => 'day',
                'interval_frequency' => 10
            ];
        }
        if ($method === 'paypal') {
            return [
                'interval_unit' => 'DAY',
                'interval_frequency' => 10
            ];
        }
    }

    return $billingPeriod;
}, 10, 2);
```

---

### `subscription/grace_period_days`
`fluent_cart/subscription/grace_period_days` — Filter grace period days per billing interval

* **When it runs:** Applied when retrieving grace period (extra days after payment fails before subscription marks expired) for each interval.
* **Source:** `app/Services/Payments/SubscriptionHelper.php` (line 159)

#### Parameters:
* `$gracePeriods` *(array)* — Associative array of interval => days (`daily => 1`, `weekly => 3`, `monthly => 7`, `yearly => 15`)
* **Returns:** *(array)* — Modified grace period days array

#### Usage Example:
```php
// Filter grace period days mapping per subscription billing interval
add_filter('fluent_cart/subscription/grace_period_days', function($gracePeriods) {
    // Extend yearly subscription grace period to 30 days
    $gracePeriods['yearly'] = 30;

    // Define 5-day grace period for custom interval
    $gracePeriods['every_tenth_day'] = 5;

    return $gracePeriods;
});
```

---

## Reminders

### `reminders/scan_batch_size`
`fluent_cart/reminders/scan_batch_size` — Filter reminder scan batch size

* **When it runs:** Applied when automated reminder system scans for subscriptions/invoices needing reminders (default: `100`).
* **Source:** `app/Services/Reminders/ReminderService.php` (line 75)

#### Parameters:
* `$batchSize` *(int)* — Number of records per scan batch (min: `10`, max: `500`)
* **Returns:** *(int)* — Modified batch size

#### Usage Example:
```php
// Filter scan batch size for automated reminder processing
add_filter('fluent_cart/reminders/scan_batch_size', function($batchSize) {
    // Increase scan batch size to 250 records for high-volume processing
    return 250;
});
```

---

### `reminders/invoice_due_days`
`fluent_cart/reminders/invoice_due_days` — Filter invoice due reminder days

* **When it runs:** Applied when determining how many days before an invoice is due to send a reminder notification.
* **Source:** `app/Services/Reminders/InvoiceReminderService.php` (line 288)

#### Parameters:
* `$days` *(int)* — Number of days before due date to send reminder
* **Returns:** *(int)* — Modified number of days

#### Usage Example:
```php
// Filter advance days count for invoice due reminder notifications
add_filter('fluent_cart/reminders/invoice_due_days', function($days) {
    // Dispatch invoice due reminder 3 days prior to due date
    return 3;
});
```

---

### `reminders/invoice_overdue_days`
`fluent_cart/reminders/invoice_overdue_days` — Filter overdue invoice reminder intervals

* **When it runs:** Applied when determining day intervals after invoice becomes overdue to send follow-up reminders (default: `[1, 3, 7]`).
* **Source:** `app/Services/Reminders/InvoiceReminderService.php` (line 299)

#### Parameters:
* `$days` *(array)* — Array of day intervals for overdue reminders
* **Returns:** *(array)* — Modified array of day intervals

#### Usage Example:
```php
// Filter day interval schedule for overdue invoice reminders
add_filter('fluent_cart/reminders/invoice_overdue_days', function($days) {
    // Send overdue follow-up reminders at 1, 3, 7, and 14 days overdue
    return [1, 3, 7, 14];
});
```

---

### `reminders/billing_cycle`
`fluent_cart/reminders/billing_cycle` — Filter billing cycle name for reminder processing

* **When it runs:** Applied when mapping subscription billing interval to cycle identifier used by reminder system.
* **Source:** `app/Services/Reminders/SubscriptionReminderService.php` (line 502)

#### Parameters:
* `$cycle` *(string)* — Billing cycle name (`monthly`, `yearly`, `unsupported`)
* `$subscription` *(\FluentCart\App\Models\Subscription)* — Subscription model instance
* **Returns:** *(string)* — Modified billing cycle name

#### Usage Example:
```php
// Filter billing cycle name mapping for subscription reminder logic
add_filter('fluent_cart/reminders/billing_cycle', function($cycle, $subscription) {
    // Map custom every_tenth_day interval to daily reminder logic
    if ($subscription->billing_interval === 'every_tenth_day') {
        return 'daily';
    }
    return $cycle;
}, 10, 2);
```

---

### `reminders/yearly_before_days`
`fluent_cart/reminders/yearly_before_days` — Filter days before yearly renewal reminder

* **When it runs:** Applied when determining day intervals before yearly subscription renewal to send reminders (default: `[30]`).
* **Source:** `app/Services/Reminders/SubscriptionReminderService.php` (line 534)

#### Parameters:
* `$days` *(array)* — Array of day intervals before renewal
* **Returns:** *(array)* — Modified array of day intervals

#### Usage Example:
```php
// Filter reminder day intervals prior to yearly subscription renewal
add_filter('fluent_cart/reminders/yearly_before_days', function($days) {
    // Dispatch yearly renewal reminders at 60, 30, and 7 days prior
    return [60, 30, 7];
});
```

---

### `reminders/monthly_before_days`
`fluent_cart/reminders/monthly_before_days` — Filter days before monthly renewal reminder

* **When it runs:** Applied when determining day intervals before monthly subscription renewal to send reminders (default: `[7]`).
* **Source:** `app/Services/Reminders/SubscriptionReminderService.php` (line 546)

#### Parameters:
* `$days` *(array)* — Array of day intervals before renewal
* **Returns:** *(array)* — Modified array of day intervals

#### Usage Example:
```php
// Filter reminder day intervals prior to monthly subscription renewal
add_filter('fluent_cart/reminders/monthly_before_days', function($days) {
    // Dispatch monthly renewal reminders at 7 and 3 days prior
    return [7, 3];
});
```

---

### `reminders/quarterly_before_days`
`fluent_cart/reminders/quarterly_before_days` — Filter days before quarterly renewal reminder

* **When it runs:** Applied when determining day intervals before quarterly subscription renewal to send reminders (default: `[14]`).
* **Source:** `app/Services/Reminders/SubscriptionReminderService.php` (line 558)

#### Parameters:
* `$days` *(array)* — Array of day intervals before renewal
* **Returns:** *(array)* — Modified array of day intervals

#### Usage Example:
```php
// Filter reminder day intervals prior to quarterly subscription renewal
add_filter('fluent_cart/reminders/quarterly_before_days', function($days) {
    // Dispatch quarterly renewal reminders at 21 and 7 days prior
    return [21, 7];
});
```

---

### `reminders/half_yearly_before_days`
`fluent_cart/reminders/half_yearly_before_days` — Filter days before half-yearly renewal reminder

* **When it runs:** Applied when determining day intervals before half-yearly subscription renewal to send reminders (default: `[21]`).
* **Source:** `app/Services/Reminders/SubscriptionReminderService.php` (line 570)

#### Parameters:
* `$days` *(array)* — Array of day intervals before renewal
* **Returns:** *(array)* — Modified array of day intervals

#### Usage Example:
```php
// Filter reminder day intervals prior to half-yearly subscription renewal
add_filter('fluent_cart/reminders/half_yearly_before_days', function($days) {
    // Dispatch half-yearly renewal reminders at 30 and 7 days prior
    return [30, 7];
});
```

---

### `reminders/trial_end_days`
`fluent_cart/reminders/trial_end_days` — Filter days before trial end reminder

* **When it runs:** Applied when determining day intervals before trial period ends to send reminders (default: `[3]`).
* **Source:** `app/Services/Reminders/SubscriptionReminderService.php` (line 582)

#### Parameters:
* `$days` *(array)* — Array of day intervals before trial ends
* **Returns:** *(array)* — Modified array of day intervals

#### Usage Example:
```php
// Filter reminder day intervals prior to trial expiration
add_filter('fluent_cart/reminders/trial_end_days', function($days) {
    // Dispatch trial end reminders at 7, 3, and 1 day before expiration
    return [7, 3, 1];
});
```

---

## Pro: Early Payments & Reactivation

### `subscription/early_payment_enabled` (Pro)
`fluent_cart/subscription/early_payment_enabled` — Filter whether early installment payments are enabled

* **When it runs:** Applied when checking if early payment feature for installment subscriptions is globally enabled. Requires Pro plugin.
* **Source:** `app/Modules/Subscriptions/Services/EarlyPaymentFeature.php` (line 14)

#### Parameters:
* `$isEnabled` *(bool)* — Whether early payments are enabled from store settings
* **Returns:** *(bool)* — Modified enabled state

#### Usage Example:
```php
// Filter global enabled state for early installment payments (Pro)
add_filter('fluent_cart/subscription/early_payment_enabled', function($isEnabled) {
    // Disable early payments during December promotion window
    if (current_time('Y-m') === '2026-12') {
        return false;
    }
    return $isEnabled;
});
```

---

### `subscription/can_early_pay` (Pro)
`fluent_cart/subscription/can_early_pay` — Filter whether a specific subscription can make an early payment

* **When it runs:** Applied when checking if a specific installment subscription is eligible for early payment. Requires Pro plugin.
* **Source:** `app/Modules/Subscriptions/Services/EarlyPaymentFeature.php` (line 26)

#### Parameters:
* `$canPay` *(bool)* — Whether subscription can make early payment
* `$context` *(array)* — Context data (`['subscription' => Subscription]`)
* **Returns:** *(bool)* — Modified eligibility

#### Usage Example:
```php
// Filter early installment payment eligibility for a subscription (Pro)
add_filter('fluent_cart/subscription/can_early_pay', function($canPay, $context) {
    $subscription = $context['subscription'];

    // Require more than 2 remaining installments for early payment
    $remaining = $subscription->bill_times - $subscription->bill_count;
    if ($remaining <= 2) {
        return false;
    }

    return $canPay;
}, 10, 2);
```

---

### `subscription/reactivation_same_price_days_limit` (Pro)
`fluent_cart/subscription/reactivation_same_price_days_limit` — Filter days limit for same-price reactivation

* **When it runs:** Applied when customer reactivates canceled/expired subscription at original price without new checkout (default: `60` days). Requires Pro.
* **Source:** `fluent-cart-pro/.../SubscriptionRenewalHandler.php` (line 234)

#### Parameters:
* `$daysLimit` *(int)* — Number of days within which same-price reactivation is allowed (default: `60`)
* `$context` *(array)* — Context data (`['subscription' => Subscription]`)
* **Returns:** *(int)* — Modified days limit

#### Usage Example:
```php
// Filter maximum days limit allowed for same-price subscription reactivation (Pro)
add_filter('fluent_cart/subscription/reactivation_same_price_days_limit', function($daysLimit, $context) {
    $subscription = $context['subscription'];

    // Allow 180 days (6 months) same-price reactivation for yearly subscriptions
    if ($subscription->billing_interval === 'yearly') {
        return 180;
    }

    return $daysLimit;
}, 10, 2);
```

---

## Pro: License Customer Portal

### `customer/license_details_section_parts` (Pro)
`fluent_cart/customer/license_details_section_parts` — Filter license details section parts in customer portal

* **When it runs:** Applied when rendering license details page in customer portal, allowing HTML section injection. Requires Pro plugin.
* **Source:** `fluent-cart-pro/.../CustomerProfileController.php` (line 97)

#### Parameters:
* `$sectionParts` *(array)* — Associative array of injectable HTML sections (`before_summary`, `after_summary`, `end_of_details`, `additional_actions`)
* `$context` *(array)* — Context data (`['license' => License, 'formattedData' => array]`)
* **Returns:** *(array)* — Modified section parts array

#### Usage Example:
```php
// Filter injectable HTML section parts on customer license details page (Pro)
add_filter('fluent_cart/customer/license_details_section_parts', function($parts, $context) {
    $license = $context['license'];

    // Inject activation guide HTML section after license summary
    $parts['after_summary'] = '<div class="activation-guide">'
        . '<h4>How to Activate</h4>'
        . '<p>Copy your license key and paste it in your plugin settings.</p>'
        . '</div>';

    // Inject custom regenerate key action button HTML
    $parts['additional_actions'] = '<button class="btn-regenerate" onclick="regenerateLicense(\'' . $license->id . '\')">Regenerate Key</button>';

    return $parts;
}, 10, 2);
```
