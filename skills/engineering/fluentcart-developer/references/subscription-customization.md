# Subscription Customization

FluentCart allows customizing subscription settings including renewal grace periods and custom billing intervals.

---

## 1. Grace Periods Configuration

By default, FluentCart provides a grace period before setting a failed subscription to `expired`. This allows asynchronous payment methods (like SEPA or ACH) to clear without prematurely cutting off client access.

Use the `fluent_cart/subscription/grace_period_days` filter:

```php
add_filter('fluent_cart/subscription/grace_period_days', function (array $gracePeriods): array {
    // Extend the monthly subscription grace period to 14 days to cover SEPA debit processing
    $gracePeriods['monthly'] = 14;

    // Extend the yearly subscription grace period to 30 days
    $gracePeriods['yearly'] = 30;

    // Reduce daily subscription grace period to 1 day for strict time-sensitive access
    $gracePeriods['daily'] = 1;

    return $gracePeriods;
});
```

---

## 2. Registering Custom Billing Intervals

You can register custom billing frequencies (e.g., "Every 10th Day") using a series of filter hooks.

### Step 2.1: Register the Interval Option
This displays the option in the product variations editor dropdown inside the WordPress admin panel.

```php
add_filter('fluent_cart/available_subscription_interval_options', function (array $options): array {
    return array_merge($options, [
        [
            'label'     => __('Every 10th day', 'my-custom-plugin'), // Admin label
            'value'     => 'every_tenth_day', // Database variation metadata identifier
            'map_value' => '10th Day', // User-facing description on invoice/checkout
        ],
    ]);
});
```

### Step 2.2: Define the Interval Duration in Days
Tells FluentCart how many days this custom interval represents for local schedule calculations.

```php
add_filter('fluent_cart/subscription_interval_in_days', function (int $days, array $args): int {
    if ($args['interval'] === 'every_tenth_day') {
        return 10; // 10 days
    }
    return $days;
}, 10, 2);
```

### Step 2.3: Map to Gateway Billing Period
Integrates the custom billing interval with supported payment gateways (Stripe and PayPal).

```php
add_filter('fluent_cart/subscription_billing_period', function (array $billingPeriod, array $args): array {
    if ($args['subscription_interval'] !== 'every_tenth_day') {
        return $billingPeriod;
    }

    // Configure details specifically for Stripe API integration
    if ($args['payment_method'] === 'stripe') {
        $billingPeriod['interval_unit']      = 'day';
        $billingPeriod['interval_frequency'] = 10;
    }

    // Configure details specifically for PayPal API integration
    if ($args['payment_method'] === 'paypal') {
        $billingPeriod['interval_unit']      = 'day';
        $billingPeriod['interval_frequency'] = 10;
    }

    return $billingPeriod;
}, 10, 2);
```

### Step 2.4: Set Maximum Trial Days Allowed (Optional)
Restricts how many free trial days can be assigned to this billing interval in the editor.

```php
add_filter('fluent_cart/max_trial_days_allowed', function (int $days, array $args): int {
    if ($args['repeat_interval'] === 'every_tenth_day') {
        // Enforce trial period does not exceed the interval duration (10 days)
        return min($args['existing_trial_days'] + $args['interval_in_days'], 10);
    }
    return $days;
}, 10, 2);
```

### Step 2.5: Set Default Software License Validity (Optional)
If utilizing FluentCart's software licensing module, configure the license validity duration mapping for this custom interval.

```php
add_filter('fluent_cart/license/default_validity_by_variation', function (array $validity, array $args): array {
    $interval = \FluentCart\App\Helpers\Arr::get($args['variation']->other_info, 'repeat_interval');
    if ($interval === 'every_tenth_day') {
        return [
            'unit'  => 'day',
            'value' => 10, // License expires 10 days after each renewal
        ];
    }
    return $validity;
}, 10, 2);
```
