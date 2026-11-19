# Subscription Model

| DB Table Name | {wp_db_prefix}_fct_subscriptions |
| --- | --- |
| Schema | [Check Schema](/database/schema.md#fct-subscriptions-table) |
| Source File | fluent-cart/app/Models/Subscription.php |
| Name Space | FluentCart\App\Models |
| Class | FluentCart\App\Models\Subscription |

## Traits

| Trait | Provides |
| --- | --- |
| `HasActivity` | `activities()` morphMany relationship to `Activity` model |
| `CanUpdateBatch` | `scopeBatchUpdate` scope for bulk-updating rows in one query |

## Attributes

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
| initial_tax_total | Integer | Tax charged on the first payment, in cents |
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

## Appended Attributes

These virtual attributes are automatically appended when the model is serialized to an array or JSON.

| Attribute | Type | Description |
| --- | --- | --- |
| url | String | Remote subscription URL from payment gateway (via `fluent_cart/subscription/url_{method}` filter) |
| payment_info | String | Human-readable subscription billing summary (interval, amount, trial) |
| billingInfo | Array | Active payment method details from subscription meta |
| overridden_status | String | Display-corrected status (handles simulated trial days and actual trial period detection) |
| currency | String | Uppercase currency code. A real column, also exposed through an accessor that falls back to config, the parent order, then the base currency |
| reactivate_url | String | Frontend URL for reactivating a canceled/expired subscription |

## Usage

Please check [Model Basic](/database/models.md) for Common methods.

### Accessing Attributes

```
$subscription = FluentCart\App\Models\Subscription::find(1);

$subscription->id; // returns subscription ID
$subscription->status; // returns subscription status
$subscription->recurring_total; // returns recurring total in cents
$subscription->billing_interval; // returns billing interval
$subscription->next_billing_date; // returns next billing date
$subscription->currency; // returns currency code (appended attribute)
$subscription->url; // returns remote subscription URL (appended attribute)
$subscription->overridden_status; // returns display-corrected status (appended attribute)
```

## Scopes

### visibleToCustomer()

Limits results to subscriptions a customer should see in their portal. Excludes `pending` and `intended` rows unless they have billed at least once (`bill_count > 0`) or carry a `reactivation_order_id` in `config`.

```
$subscriptions = $customer->subscriptions()->visibleToCustomer()->get();
```

### ofPlanType($planType)

Filters by plan shape. `'installment'` matches `bill_times > 0`; `'recurring'` matches `bill_times

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$subscription->addLog('Status Changed', 'Subscription activated', 'info');
$subscription->addLog('Payment Failed', 'Card declined', 'error', 'system');
```

### getDownloads()

Get downloadable files associated with this subscription's product. Only returns downloads when the subscription has a `variation_id` and status is `active`. Filters downloads by the subscription's variation ID.

- Returns `Collection|Array` - Collection of `ProductDownload` models with product and variation titles, or empty array

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$downloads = $subscription->getDownloads();
```

### getLatestTransaction()

Get the most recent charge transaction for this subscription.

- Returns `FluentCart\App\Models\OrderTransaction|null` - Latest charge transaction or null

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$transaction = $subscription->getLatestTransaction();
```

### canUpgrade()

Check if the subscription can be upgraded. Requires a `variant_upgrade_path` meta entry for the current variation and the subscription must be `active` or `trialing`.

- Returns `Boolean` - True if upgrade path exists and status allows it

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$canUpgrade = $subscription->canUpgrade();
```

### canUpdatePaymentMethod()

Check if the payment method can be updated (card update). The current payment gateway must support the `card_update` feature and the subscription must be in one of the allowed statuses: `active`, `trialing`, `paused`, `intended`, `past_due`, `failing`, or `expiring`.

- Returns `Boolean` - True if payment method can be updated

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$canUpdate = $subscription->canUpdatePaymentMethod();
```

### canSwitchPaymentMethod()

Store-billed subscriptions — those where `usesRenewalEngine()` is true, i.e. `collection_method` of `manual` or `system` — always return `false`. Switching moves a subscription onto another gateway's vendor subscription, which would bill it a second time alongside the invoice engine. Those customers change the card on file through `canUpdatePaymentMethod()` instead.

Check if the payment method can be switched to a different gateway entirely. The current gateway must support the `switch_payment_method` feature, and the subscription must be `active`, `trialing`, or `paused`.

- Returns `Boolean` - True if payment method can be switched

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$canSwitch = $subscription->canSwitchPaymentMethod();
```

### switchablePaymentMethods()

Get the list of payment gateways that can be switched to from the current gateway.

- Returns `Array` - Array of supported gateway identifiers, or empty array if switching is not supported

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$methods = $subscription->switchablePaymentMethods();
// e.g., ['stripe', 'paypal']
```

### canReactivate()

Check if the subscription can be reactivated. Returns empty string (falsy) if:

- FluentCart Pro is not active
- The subscription was upgraded to another subscription
- The recurring amount is zero or negative
- The cancellation reason is `refunded`

Otherwise checks if status is one of: `canceled`, `failing`, `expired`, `paused`, `expiring`, or `past_due`.

- Returns `Mixed` - Filtered boolean/string value (empty string if cannot reactivate, truthy if can). Result is filtered via `fluent_cart/subscription/can_reactivate`.

```
$subscription = FluentCart\App\Models\Subscription::find(1);
if ($subscription->canReactivate()) {
    // subscription can be reactivated
}
```

### getReactivateUrl()

Get the frontend URL for reactivating a canceled or expired subscription. Returns empty string if the subscription cannot be reactivated.

- Returns `String` - Reactivation URL with `fluent-cart=reactivate-subscription` query parameter, or empty string

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$reactivateUrl = $subscription->getReactivateUrl();
```

### getViewUrl($type = 'customer')

Get the subscription view URL for the customer portal or admin dashboard.

- Parameters: `$type` (String) - View type: `'customer'` (default) for the customer portal, or `'admin'` for the admin dashboard
- Returns `String` - View URL

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$customerUrl = $subscription->getViewUrl(); // customer portal URL
$adminUrl = $subscription->getViewUrl('admin'); // admin dashboard URL
```

### hasAccessValidity()

Check if the subscription currently grants access. Returns true for `active`, `trialing`, and `completed` statuses. Returns false for `expired`, `past_due`, `intended`, and `pending`. For other statuses (e.g., `canceled`, `failing`, `paused`, `expiring`), checks whether the next billing date (or guessed billing date) is still in the future.

- Returns `Boolean` - True if the subscription has valid access

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$hasAccess = $subscription->hasAccessValidity();
```

### reSyncFromRemote()

Re-sync subscription data from the remote payment gateway. The gateway must support the `subscriptions` feature.

- Returns `Mixed` - Sync result from the gateway, or `WP_Error` if the payment method does not support remote resync

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$result = $subscription->reSyncFromRemote();
if (is_wp_error($result)) {
    // handle error
}
```

### cancelRemoteSubscription($args = [])

Cancel the subscription both remotely (at the payment gateway) and locally. Updates the status to `canceled`, sets `canceled_at`, stores the cancellation reason in config, and dispatches the `SubscriptionCanceled` event.

- Parameters: `$args` (Array) - Cancellation arguments: `reason` (String) - Cancellation reason (stored in config, default: `''`)
- `fire_hooks` (Boolean) - Whether to dispatch the `SubscriptionCanceled` event (default: `true`)
- `note` (String) - Cancellation note (saved to order, default: `''`)

Returns `Array|WP_Error` - Array with `subscription` and `vendor_result` keys on success

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$result = $subscription->cancelRemoteSubscription([
    'reason'     => 'Customer request',
    'fire_hooks' => true,
    'note'       => 'Cancelled by customer'
]);
```

### getCurrentRenewalAmount()

Get the current renewal amount. Checks `config.current_renewal_amount` first (used when the renewal amount differs from the base recurring total, e.g., after a plan change), then falls back to `recurring_total`.

- Returns `Integer` - Current renewal amount in cents

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$amount = $subscription->getCurrentRenewalAmount();
```

### getRequiredBillTimes()

Get the number of remaining billing cycles. If `bill_times` is 0, returns 0 (unlimited). If the calculated remaining count is zero or negative, it re-verifies against actual successful transactions and early payment history, correcting `bill_count` if needed. Returns -1 if billing is truly complete after verification.

- Returns `Integer` - Remaining bill times (0 = unlimited, -1 = completed)

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$billTimes = $subscription->getRequiredBillTimes();
```

### getReactivationTrialDays()

Get the number of trial days to apply when reactivating this subscription. If the subscription still has valid access (i.e., the billing period has not fully elapsed), the remaining days are returned as trial days so the customer is not double-charged.

- Returns `Integer` - Number of trial days for reactivation (0 if no remaining validity)

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$trialDays = $subscription->getReactivationTrialDays();
```

### guessNextBillingDate($forced = false)

Calculate the next billing date when it is not already set (or when forced). Uses the last successful order's creation date plus the billing interval. For initial orders with trial days, adds trial days instead.

- Parameters: `$forced` (Boolean) - Force recalculation even if `next_billing_date` is already set (default: `false`)
- Returns `String` - Next billing date in `Y-m-d H:i:s` GMT format

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$nextBillingDate = $subscription->guessNextBillingDate();
$forcedDate = $subscription->guessNextBillingDate(true); // force recalculation
```

### checkAndExpireSubscriptions($batchSize = 100) (static)

Check and expire subscriptions that have missed payments beyond their grace period. Called by the hourly scheduler. Processes `active`, `trialing`, and `canceled` subscriptions whose `next_billing_date` is past the grace period threshold. Grace periods vary by billing interval (e.g., 1 day for daily, 3 for weekly, 7 for monthly, 15 for quarterly/half_yearly/yearly).

For active/trialing subscriptions, status is changed to `expired`. For canceled subscriptions, only `next_billing_date` is cleared (status remains canceled). Dispatches `SubscriptionValidityExpired` event for each affected subscription.

- Parameters: `$batchSize` (Integer) - Number of subscriptions to process per batch (default: `100`)
- Returns `Array` - Statistics with keys: `checked`, `validity_expired`, `batches`

```
use FluentCart\App\Models\Subscription;

$stats = Subscription::checkAndExpireSubscriptions(50);
// $stats = ['checked' => 200, 'validity_expired' => 5, 'batches' => 4]
```

## Relations

This model has the following relationships that you can use.

### meta

Access the subscription metadata.

- Relation type: `HasMany`
- Returns `Collection` of `FluentCart\App\Models\SubscriptionMeta`

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$meta = $subscription->meta;
```

### customer

Access the customer.

- Relation type: `BelongsTo`
- Foreign key: `customer_id`
- Returns `FluentCart\App\Models\Customer`

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$customer = $subscription->customer;
```

### product

Access the product.

- Relation type: `BelongsTo`
- Foreign key: `product_id` -> `ID`
- Returns `FluentCart\App\Models\Product`

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$product = $subscription->product;
```

### variation

Access the product variation.

- Relation type: `BelongsTo`
- Foreign key: `variation_id`
- Returns `FluentCart\App\Models\ProductVariation`

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$variation = $subscription->variation;
```

### labels

Access the subscription labels.

- Relation type: `MorphMany`
- Returns `Collection` of `FluentCart\App\Models\LabelRelationship`

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$labels = $subscription->labels;
```

### license

Access the subscription license (single). Only available when FluentCart Pro with the Licensing module is active.

- Relation type: `HasOne` (nullable -- returns `null` if `License` class does not exist)
- Returns `FluentCartPro\App\Modules\Licensing\Models\License|null`

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$license = $subscription->license;
```

### licenses

Access all subscription licenses. Only available when FluentCart Pro with the Licensing module is active.

- Relation type: `HasMany` (nullable -- returns `null` if `License` class does not exist)
- Returns `Collection` of `FluentCartPro\App\Modules\Licensing\Models\License|null`

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$licenses = $subscription->licenses;
```

### transactions

Access the subscription transactions.

- Relation type: `HasMany`
- Returns `Collection` of `FluentCart\App\Models\OrderTransaction`

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$transactions = $subscription->transactions;
```

### billing_addresses

Access the billing addresses for the subscription's customer.

- Relation type: `HasMany` (scoped to `type = 'billing'`)
- Foreign key: `customer_id` -> `customer_id`
- Returns `Collection` of `FluentCart\App\Models\CustomerAddresses`

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$addresses = $subscription->billing_addresses;
```

### product_detail

Access the product detail (variation details).

- Relation type: `BelongsTo`
- Foreign key: `variation_id` -> `id`
- Returns `FluentCart\App\Models\ProductDetail`

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$productDetail = $subscription->product_detail;
```

### order

Access the parent order.

- Relation type: `BelongsTo`
- Foreign key: `parent_order_id` -> `id`
- Returns `FluentCart\App\Models\Order`

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$order = $subscription->order;
```

### activities (via HasActivity trait)

Access the activity logs for this subscription.

- Relation type: `MorphMany` (ordered by `created_at DESC`, `id DESC`)
- Returns `Collection` of `FluentCart\App\Models\Activity`

```
$subscription = FluentCart\App\Models\Subscription::find(1);
$activities = $subscription->activities;
```

## Usage Examples

### Creating a Subscription

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
// uuid is auto-generated on create
```

### Retrieving Subscriptions

```
// Get subscription by ID
$subscription = Subscription::find(1);

// Get subscription with customer and product
$subscription = Subscription::with(['customer', 'product'])->find(1);

// Get active subscriptions
$subscriptions = Subscription::where('status', 'active')->get();
```

### Updating a Subscription

```
$subscription = Subscription::find(1);
$subscription->status = 'canceled';
$subscription->canceled_at = gmdate('Y-m-d H:i:s');
$subscription->save();
```

### Deleting a Subscription

```
$subscription = Subscription::find(1);
$subscription->delete();
```

---
