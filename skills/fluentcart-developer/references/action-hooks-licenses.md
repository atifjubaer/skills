# Action Hooks: Licenses (Pro)

Action hooks for software licensing lifecycle management including License status changes, `LicenseActivation` management, `LicenseSite` activations/deactivations, and bulk operations. All hooks in this section require the FluentCart Pro plugin.

---

## License Status

### `license_status_updated` (Pro)
`fluent_cart_sl/license_status_updated` — Fires on any license status change

* **When it runs:** This action fires whenever a License's status transitions from one value to another (e.g., `active` to `expired`, `active` to `disabled`, etc.).
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Models/License.php` (line 206)

#### Parameters:
`$data` *(array)*: License status change data
* `license` *(\FluentCart\App\Models\License)* — The license model after the status change
* `old_status` *(string)* — The previous status value
* `new_status` *(string)* — The new status value

#### Usage Example:
```php
// Hook into any license status update
add_action('fluent_cart_sl/license_status_updated', function ($data) {
    // Extract license model and status transition strings
    $license   = $data['license'];
    $oldStatus = $oldStatus = $data['old_status'];
    $newStatus = $data['new_status'];

    // Log status change to system log
    fluent_cart_add_log(
        'License Status Changed',
        sprintf('License #%d changed from %s to %s', $license->id, $oldStatus, $newStatus),
        'info'
    );
}, 10, 1);
```

---

### `license_status_updated_to_{$newStatus}` (Pro)
`fluent_cart_sl/license_status_updated_to_{$newStatus}` — Fires when a license transitions to a specific status

* **When it runs:** This is a dynamic hook that fires for a specific target status. For example, `fluent_cart_sl/license_status_updated_to_expired` fires only when a License becomes expired.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Models/License.php` (line 211)

#### Parameters:
`$data` *(array)*: License status change data
* `license` *(\FluentCart\App\Models\License)* — The license model after the status change
* `old_status` *(string)* — The previous status value
* `new_status` *(string)* — The new status value

#### Usage Example:
```php
// Hook when a license transitions to expired status
add_action('fluent_cart_sl/license_status_updated_to_expired', function ($data) {
    // Extract license model and status values
    $license   = $data['license'];
    $oldStatus = $data['old_status'];
    $newStatus = $data['new_status'];

    // Handle license expiration notification via email
    wp_mail(get_option('admin_email'), 'License Expired', sprintf('License #%d has expired.', $license->id));
}, 10, 1);
```

---

## License Activation Status

### `license_activation_status_updated` (Pro)
`fluent_cart_sl/license_activation_status_updated` — Fires on any license activation status change

* **When it runs:** This action fires whenever a `LicenseActivation`'s status transitions from one value to another.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Models/LicenseActivation.php` (line 52)

#### Parameters:
`$data` *(array)*: License activation status change data
* `license` *(\FluentCart\App\Models\LicenseActivation)* — The license activation model (note: key is `license` but value is a `LicenseActivation` instance)
* `old_status` *(string)* — The previous activation status
* `new_status` *(string)* — The new activation status

#### Usage Example:
```php
// Hook into any license activation status change
add_action('fluent_cart_sl/license_activation_status_updated', function ($data) {
    // Extract activation instance and status strings
    $activation = $data['license']; // Note: key is 'license' but value is a LicenseActivation instance
    $oldStatus  = $data['old_status'];
    $newStatus  = $data['new_status'];

    // Log activation status transition
    fluent_cart_add_log(
        'License Activation Status Changed',
        sprintf('Activation #%d status changed from %s to %s', $activation->id, $oldStatus, $newStatus),
        'info'
    );
}, 10, 1);
```

---

### `license_activation_status_updated_to_{$newStatus}` (Pro)
`fluent_cart_sl/license_activation_status_updated_to_{$newStatus}` — Fires when a license activation transitions to a specific status

* **When it runs:** This is a dynamic hook that fires for a specific target `LicenseActivation` status.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Models/LicenseActivation.php` (line 57)

#### Parameters:
`$data` *(array)*: License activation status change data
* `license` *(\FluentCart\App\Models\LicenseActivation)* — The license activation model (note: key is `license` but value is a `LicenseActivation` instance)
* `old_status` *(string)* — The previous activation status
* `new_status` *(string)* — The new activation status

#### Usage Example:
```php
// Hook when a license activation becomes active
add_action('fluent_cart_sl/license_activation_status_updated_to_active', function ($data) {
    // Extract activation model instance
    $activation = $data['license']; // Note: key is 'license' but value is a LicenseActivation instance
    $oldStatus  = $data['old_status'];
    $newStatus  = $data['new_status'];

    // Handle activation becoming active
}, 10, 1);
```

---

## License Limits

### `license_limit_increased` (activation count) (Pro)
`fluent_cart_sl/license_limit_increased` — Fires when the license activation count is increased

* **When it runs:** This action fires when a License's activation count is increased.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Models/License.php` (line 224)

#### Parameters:
`$data` *(array)*: License limit change data
* `license` *(\FluentCart\App\Models\License)* — The license model
* `old_count` *(int)* — The previous activation count

#### Usage Example:
```php
// Hook when the license activation count is increased
add_action('fluent_cart_sl/license_limit_increased', function ($data) {
    // Extract license model and previous activation count
    $license  = $data['license'];
    $oldCount = $data['old_count'];

    // Log activation count increase
    fluent_cart_add_log(
        'License Activation Count Increased',
        sprintf('License #%d activation count increased from %d', $license->id, $oldCount),
        'info'
    );
}, 10, 1);
```

---

### `license_limit_decreased` (Pro)
`fluent_cart_sl/license_limit_decreased` — Fires when the license activation count is decreased

* **When it runs:** This action fires when a License's activation count is decreased.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Models/License.php` (line 239)

#### Parameters:
`$data` *(array)*: License limit change data
* `license` *(\FluentCart\App\Models\License)* — The license model
* `old_count` *(int)* — The previous activation count

#### Usage Example:
```php
// Hook when the license activation count is decreased
add_action('fluent_cart_sl/license_limit_decreased', function ($data) {
    // Extract license model and previous activation count
    $license  = $data['license'];
    $oldCount = $data['old_count'];

    // Log activation count decrease
    fluent_cart_add_log(
        'License Activation Count Decreased',
        sprintf('License #%d activation count decreased from %d', $license->id, $oldCount),
        'info'
    );
}, 10, 1);
```

---

### `license_limit_increased` (limit slots) (Pro)
`fluent_cart_sl/license_limit_increased` — Fires when the license activation limit (slots) is increased

* **When it runs:** This action fires when a License's activation limit (maximum allowed activations) is increased.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Models/License.php` (line 259)

#### Parameters:
`$data` *(array)*: License limit change data
* `license` *(\FluentCart\App\Models\License)* — The license model
* `old_count` *(int)* — The previous activation limit

#### Usage Example:
```php
// Hook when the license activation limit (slots) is increased
add_action('fluent_cart_sl/license_limit_increased', function ($data) {
    // Extract license model and previous limit count
    $license  = $data['license'];
    $oldCount = $data['old_count'];

    // Log activation limit increase
    fluent_cart_add_log(
        'License Limit Increased',
        sprintf('License #%d activation limit increased from %d', $license->id, $oldCount),
        'info'
    );
}, 10, 1);
```

---

## License Key & Validity

### `license_key_regenerated` (Pro)
`fluent_cart_sl/license_key_regenerated` — Fires when a license key is regenerated

* **When it runs:** This action fires when a license key is regenerated, replacing the old key with a new one.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Models/License.php` (line 318)

#### Parameters:
`$data` *(array)*: License key change data
* `license` *(\FluentCart\App\Models\License)* — The license model with the new key
* `old_key` *(string)* — The previous license key

#### Usage Example:
```php
// Hook when a license key is regenerated
add_action('fluent_cart_sl/license_key_regenerated', function ($data) {
    // Extract license model and previous key string
    $license = $data['license'];
    $oldKey  = $data['old_key'];

    // Log license key regeneration event
    fluent_cart_add_log(
        'License Key Regenerated',
        sprintf('License #%d key was regenerated', $license->id),
        'info'
    );
}, 10, 1);
```

---

### `license_validity_extended` (Pro)
`fluent_cart_sl/license_validity_extended` — Fires when a license expiration date is changed

* **When it runs:** This action fires when a license's expiration date is modified to a new date.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Models/License.php` (line 348)

#### Parameters:
`$data` *(array)*: License validity change data
* `license` *(\FluentCart\App\Models\License)* — The license model
* `old_date` *(string)* — The previous expiration date
* `new_date` *(string)* — The new expiration date

#### Usage Example:
```php
// Hook when a license expiration date is modified
add_action('fluent_cart_sl/license_validity_extended', function ($data) {
    // Extract license model and expiration dates
    $license = $data['license'];
    $oldDate = $data['old_date'];
    $newDate = $data['new_date'];

    // Log license expiration change
    fluent_cart_add_log(
        'License Validity Extended',
        sprintf('License #%d expiration changed from %s to %s', $license->id, $oldDate, $newDate),
        'info'
    );
}, 10, 1);
```

---

## License Lifecycle

### `license_issued` (order) (Pro)
`fluent_cart/licensing/license_issued` — Fires when a new license is created for an order

* **When it runs:** This action fires when a new license is generated as part of an order fulfillment process.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseGenerationHandler.php` (line 532)

#### Parameters:
`$data` *(array)*: License issuance data
* `license` *(\FluentCart\App\Models\License)* — The newly created license
* `data` *(array)* — License creation data
* `order` *(\FluentCart\App\Models\Order)* — The associated order
* `subscription` *(\FluentCart\App\Models\Subscription|null)* — The associated subscription, if any

#### Usage Example:
```php
// Hook when a new license is created for an order
add_action('fluent_cart/licensing/license_issued', function ($data) {
    // Extract license, order, and subscription models
    $license      = $data['license'];
    $order        = $data['order'];
    $subscription = $data['subscription'];

    // Notify customer about their new license via email
    wp_mail(
        $order->customer->email,
        'Your License Key',
        sprintf('Your license key for order #%d is: %s', $order->id, $license->license_key)
    );
}, 10, 1);
```

---

### `license_issued` (manager) (Pro)
`fluent_cart_sl/license_issued` — Fires when a license is issued via the license manager

* **When it runs:** This action fires when a license is created through the admin license management interface.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php` (line 261)

#### Parameters:
`$data` *(array)*: License issuance data
* `license` *(\FluentCart\App\Models\License)* — The newly created license
* `data` *(array)* — License creation data

#### Usage Example:
```php
// Hook when a license is issued via the admin manager
add_action('fluent_cart_sl/license_issued', function ($data) {
    // Extract newly created license and input data
    $license    = $data['license'];
    $createData = $data['data'];

    // Log manual license creation
    fluent_cart_add_log(
        'License Issued via Manager',
        sprintf('License #%d issued manually', $license->id),
        'info'
    );
}, 10, 1);
```

---

### `license_renewed` (Pro)
`fluent_cart/licensing/license_renewed` — Fires when a license expiration is extended on subscription renewal

* **When it runs:** This action fires when a license's expiration date is extended because the associated subscription has been successfully renewed.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseGenerationHandler.php` (line 231)

#### Parameters:
`$data` *(array)*: License renewal data
* `license` *(\FluentCart\App\Models\License)* — The renewed license
* `subscription` *(\FluentCart\App\Models\Subscription)* — The associated subscription
* `prev_status` *(string)* — The previous license status

#### Usage Example:
```php
// Hook when a license expiration is extended on subscription renewal
add_action('fluent_cart/licensing/license_renewed', function ($data) {
    // Extract license, subscription, and previous status
    $license      = $data['license'];
    $subscription = $data['subscription'];
    $prevStatus   = $data['prev_status'];

    // Log license renewal event
    fluent_cart_add_log(
        'License Renewed',
        sprintf('License #%d renewed via subscription #%d', $license->id, $subscription->id),
        'info'
    );
}, 10, 1);
```

---

### `license_expired` (Pro)
`fluent_cart/licensing/license_expired` — Fires when a license expires due to subscription cancellation or scheduler

* **When it runs:** This action fires when a license is marked as expired, either because the associated subscription was cancelled or because the license scheduler determined it has passed its expiration date.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseGenerationHandler.php` (line 267), `fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseSchedulerHandler.php` (line 46)

#### Parameters:
`$data` *(array)*: License expiration data
* `license` *(\FluentCart\App\Models\License)* — The expired license
* `subscription` *(\FluentCart\App\Models\Subscription)* — The associated subscription
* `prev_status` *(string)* — The previous license status

#### Usage Example:
```php
// Hook when a license expires due to subscription cancellation or scheduler
add_action('fluent_cart/licensing/license_expired', function ($data) {
    // Extract license, subscription, and previous status
    $license      = $data['license'];
    $subscription = $data['subscription'];
    $prevStatus   = $data['prev_status'];

    // Notify customer about license expiration via email
    wp_mail(
        $license->customer->email,
        'License Expired',
        sprintf('Your license #%d has expired.', $license->id)
    );
}, 10, 1);
```

---

### `license_disabled` (Pro)
`fluent_cart/licensing/license_disabled` — Fires when a license is disabled due to payment failure or refund

* **When it runs:** This action fires when a license is disabled, typically because the associated order's payment failed or a refund was processed.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseGenerationHandler.php` (lines 158, 196)

#### Parameters:
`$data` *(array)*: License disabled data
* `license` *(\FluentCart\App\Models\License)* — The disabled license
* `order` *(\FluentCart\App\Models\Order)* — The associated order
* `reason` *(string|undefined)* — The reason for disabling (only present on payment failure; absent on refund)

#### Usage Example:
```php
// Hook when a license is disabled due to payment failure or refund
add_action('fluent_cart/licensing/license_disabled', function ($data) {
    // Extract license, order, and disabling reason
    $license = $data['license'];
    $order   = $data['order'];
    $reason  = $data['reason'] ?? '';

    // Log license disable event
    fluent_cart_add_log(
        'License Disabled',
        sprintf('License #%d disabled for order #%d. Reason: %s', $license->id, $order->id, $reason ?: 'refund'),
        'warning'
    );
}, 10, 1);
```

---

### `extended_to_lifetime` (Pro)
`fluent_cart/licensing/extended_to_lifetime` — Fires when a license is extended to lifetime on subscription end-of-term

* **When it runs:** This action fires when a license is converted to a lifetime license because its associated subscription has completed all billing cycles (end-of-term).
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseGenerationHandler.php` (line 302)

#### Parameters:
`$data` *(array)*: License lifetime extension data
* `license` *(\FluentCart\App\Models\License)* — The license extended to lifetime
* `subscription` *(\FluentCart\App\Models\Subscription)* — The associated subscription
* `prev_status` *(string)* — The previous license status

#### Usage Example:
```php
// Hook when a license is extended to lifetime on subscription end-of-term
add_action('fluent_cart/licensing/extended_to_lifetime', function ($data) {
    // Extract license, subscription, and previous status
    $license      = $data['license'];
    $subscription = $data['subscription'];
    $prevStatus   = $data['prev_status'];

    // Notify customer about lifetime upgrade via email
    wp_mail(
        $license->customer->email,
        'License Extended to Lifetime',
        sprintf('Your license #%d has been extended to lifetime access!', $license->id)
    );
}, 10, 1);
```

---

### `license_upgraded` (Pro)
`fluent_cart/licensing/license_upgraded` — Fires when a license is upgraded to a new plan

* **When it runs:** This action fires when a license is upgraded to a different plan, typically through a plan change or upgrade flow.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseGenerationHandler.php` (line 375)

#### Parameters:
`$data` *(array)*: License upgrade data
* `license` *(\FluentCart\App\Models\License)* — The upgraded license
* `order` *(\FluentCart\App\Models\Order)* — The associated order
* `subscription` *(\FluentCart\App\Models\Subscription)* — The associated subscription
* `updates` *(array)* — The update data applied to the license

#### Usage Example:
```php
// Hook when a license is upgraded to a new plan
add_action('fluent_cart/licensing/license_upgraded', function ($data) {
    // Extract upgraded license, order, subscription, and update parameters
    $license      = $data['license'];
    $order        = $data['order'];
    $subscription = $data['subscription'];
    $updates      = $data['updates'];

    // Log license upgrade event
    fluent_cart_add_log(
        'License Upgraded',
        sprintf('License #%d upgraded for order #%d', $license->id, $order->id),
        'info'
    );
}, 10, 1);
```

---

### `license_deleted` (admin) (Pro)
`fluent_cart_sl/license_deleted` — Fires when a license is deleted from the admin interface

* **When it runs:** This action fires when an admin deletes a license through the license management UI.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Http/Controllers/LicenseController.php` (line 255)

#### Parameters:
`$data` *(array)*: License deletion data
* `license` *(\FluentCart\App\Models\License)* — The license being deleted

#### Usage Example:
```php
// Hook when a license is deleted from the admin interface
add_action('fluent_cart_sl/license_deleted', function ($data) {
    // Extract deleted license model instance
    $license = $data['license'];

    // Log admin license deletion
    fluent_cart_add_log(
        'License Deleted',
        sprintf('License #%d was deleted by admin', $license->id),
        'warning'
    );
}, 10, 1);
```

---

### `license_deleted` (order deleted) (Pro)
`fluent_cart/licensing/license_deleted` — Fires when a license is deleted because its parent order was deleted

* **When it runs:** This action fires when a license is automatically deleted as a result of its parent order being deleted.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Hooks/license-actions.php` (line 141)

#### Parameters:
`$data` *(array)*: License deletion data
* `license` *(\FluentCart\App\Models\License)* — The license being deleted
* `order` *(\FluentCart\App\Models\Order)* — The parent order being deleted

#### Usage Example:
```php
// Hook when a license is deleted because its parent order was deleted
add_action('fluent_cart/licensing/license_deleted', function ($data) {
    // Extract license and parent order being deleted
    $license = $data['license'];
    $order   = $data['order'];

    // Log automatic license deletion with order
    fluent_cart_add_log(
        'License Deleted with Order',
        sprintf('License #%d deleted because order #%d was deleted', $license->id, $order->id),
        'warning'
    );
}, 10, 1);
```

---

## License Site Activation

### `site_activated` (API) (Pro)
`fluent_cart/license/site_activated` — Fires when a site is activated for a license via the public API

* **When it runs:** This action fires when a site is successfully activated for a license through the external licensing API.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseApiHandler.php` (line 255)

#### Parameters:
* `$site` *(\FluentCart\App\Models\LicenseSite)* — The activated site
* `$activation` *(\FluentCart\App\Models\LicenseActivation)* — The license activation record
* `$license` *(\FluentCart\App\Models\License)* — The associated license
* `$data` *(array)* — The activation request data

#### Usage Example:
```php
// Hook when a site is activated for a license via the public API
add_action('fluent_cart/license/site_activated', function ($site, $activation, $license, $data) {
    // Log API site activation event
    fluent_cart_add_log(
        'Site Activated via API',
        sprintf('Site %s activated for license #%d', $site->site_url, $license->id),
        'info'
    );
}, 10, 4);
```

---

### `site_deactivated` (API) (Pro)
`fluent_cart/license/site_deactivated` — Fires when a site is deactivated via the public API

* **When it runs:** This action fires when a site is successfully deactivated for a license through the external licensing API.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseApiHandler.php` (line 340)

#### Parameters:
* `$site` *(\FluentCart\App\Models\LicenseSite)* — The deactivated site
* `$activation` *(\FluentCart\App\Models\LicenseActivation)* — The license activation record
* `$license` *(\FluentCart\App\Models\License)* — The associated license
* `$data` *(array)* — The deactivation request data

#### Usage Example:
```php
// Hook when a site is deactivated via the public API
add_action('fluent_cart/license/site_deactivated', function ($site, $activation, $license, $data) {
    // Log API site deactivation event
    fluent_cart_add_log(
        'Site Deactivated via API',
        sprintf('Site %s deactivated for license #%d', $site->site_url, $license->id),
        'info'
    );
}, 10, 4);
```

---

### `site_deactivated_failed` (Pro)
`fluent_cart/license/site_deactivated_failed` — Fires when a site deactivation attempt fails

* **When it runs:** This action fires when a site deactivation request fails. This can happen for multiple reasons such as an invalid license key, site not found, or activation mismatch.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseApiHandler.php` (lines 295, 309, 321)

#### Parameters:
* `$formattedData` *(array)* — Error information including the reason for failure

#### Usage Example:
```php
// Hook when a site deactivation attempt fails
add_action('fluent_cart/license/site_deactivated_failed', function ($formattedData) {
    // Log failed site deactivation error payload
    fluent_cart_add_log(
        'Site Deactivation Failed',
        wp_json_encode($formattedData),
        'error'
    );
}, 10, 1);
```

---

### `site_activated` (local) (Pro)
`fluent_cart_sl/site_activated` — Fires when a site is activated via the local API method

* **When it runs:** This action fires when a site is activated through the internal (local) license site management method.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Concerns/CanManageLicenseSites.php` (line 84)

#### Parameters:
`$data` *(array)*: Site activation data
* `site` *(\FluentCart\App\Models\LicenseSite)* — The activated site
* `license` *(\FluentCart\App\Models\License)* — The associated license
* `activation` *(\FluentCart\App\Models\LicenseActivation)* — The license activation record

#### Usage Example:
```php
// Hook when a site is activated via the local API method
add_action('fluent_cart_sl/site_activated', function ($data) {
    // Extract site, license, and activation models
    $site       = $data['site'];
    $license    = $data['license'];
    $activation = $data['activation'];

    // Log local site activation event
    fluent_cart_add_log(
        'Site Activated Locally',
        sprintf('Site %s activated for license #%d', $site->site_url, $license->id),
        'info'
    );
}, 10, 1);
```

---

### `site_license_deactivated` (Pro)
`fluent_cart_sl/site_license_deactivated` — Fires when a license is deactivated from a site (admin or customer)

* **When it runs:** This action fires when a license is deactivated from a specific site, either by an admin through the management interface or by the customer through their profile.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Concerns/CanManageLicenseSites.php` (lines 141, 177), `fluent-cart-pro/app/Modules/Licensing/Http/Controllers/CustomerProfileController.php` (line 192)

#### Parameters:
`$data` *(array)*: Site deactivation data
* `site` *(\FluentCart\App\Models\LicenseSite)* — The site being deactivated
* `license` *(\FluentCart\App\Models\License)* — The associated license

#### Usage Example:
```php
// Hook when a license is deactivated from a site (admin or customer)
add_action('fluent_cart_sl/site_license_deactivated', function ($data) {
    // Extract site and license model instances
    $site    = $data['site'];
    $license = $data['license'];

    // Log site license deactivation
    fluent_cart_add_log(
        'Site License Deactivated',
        sprintf('License #%d deactivated from site %s', $license->id, $site->site_url),
        'info'
    );
}, 10, 1);
```

---

## Bulk License Operations

### `before_deleting_licenses` (Pro)
`fluent_cart_sl/before_deleting_licenses` — Fires before licenses are bulk deleted by order

* **When it runs:** This action fires immediately before a collection of licenses is deleted as part of a bulk operation (e.g., when an order is deleted).
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php` (line 232)

#### Parameters:
`$data` *(array)*: Bulk deletion data
* `licenses` *(\Illuminate\Support\Collection)* — Collection of License models about to be deleted

#### Usage Example:
```php
// Hook before licenses are bulk deleted by order
add_action('fluent_cart_sl/before_deleting_licenses', function ($data) {
    // Extract collection of licenses about to be deleted
    $licenses = $data['licenses'];

    // Log each license in bulk deletion queue
    foreach ($licenses as $license) {
        fluent_cart_add_log('License Bulk Delete', sprintf('About to delete license #%d', $license->id), 'warning');
    }
}, 10, 1);
```

---

### `after_deleting_licenses` (Pro)
`fluent_cart_sl/after_deleting_licenses` — Fires after licenses are bulk deleted

* **When it runs:** This action fires immediately after a collection of licenses has been deleted.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php` (line 237)

#### Parameters:
`$data` *(array)*: Bulk deletion data
* `licenses` *(\Illuminate\Support\Collection)* — Collection of License models that were deleted

#### Usage Example:
```php
// Hook after licenses are bulk deleted
add_action('fluent_cart_sl/after_deleting_licenses', function ($data) {
    // Extract collection of deleted licenses
    $licenses = $data['licenses'];

    // Log completion of bulk license deletion
    fluent_cart_add_log('Licenses Bulk Deleted', sprintf('%d licenses were deleted', $licenses->count()), 'warning');
}, 10, 1);
```

---

### `before_updating_licenses_status` (Pro)
`fluent_cart_sl/before_updating_licenses_status` — Fires before a bulk license status update

* **When it runs:** This action fires immediately before a collection of licenses has their status updated in bulk.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php` (line 285)

#### Parameters:
`$data` *(array)*: Bulk status update data
* `licenses` *(\Illuminate\Support\Collection)* — Collection of License models about to be updated

#### Usage Example:
```php
// Hook before a bulk license status update
add_action('fluent_cart_sl/before_updating_licenses_status', function ($data) {
    // Extract collection of licenses about to be updated
    $licenses = $data['licenses'];

    // Log or validate before bulk status change
}, 10, 1);
```

---

### `before_updating_licenses_status_to_disabled` (Pro)
`fluent_cart_sl/before_updating_licenses_status_to_disabled` — Fires before licenses are bulk disabled

* **When it runs:** This action fires immediately before a collection of licenses is bulk-disabled.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php` (line 286)

#### Parameters:
`$data` *(array)*: Bulk disable data
* `licenses` *(\Illuminate\Support\Collection)* — Collection of License models about to be disabled

#### Usage Example:
```php
// Hook before licenses are bulk disabled
add_action('fluent_cart_sl/before_updating_licenses_status_to_disabled', function ($data) {
    // Extract collection of licenses about to be disabled
    $licenses = $data['licenses'];

    // Perform pre-disable checks
}, 10, 1);
```

---

### `after_updating_licenses_status` (Pro)
`fluent_cart_sl/after_updating_licenses_status` — Fires after a bulk license status update

* **When it runs:** This action fires immediately after a collection of licenses has had their status updated in bulk.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php` (line 290)

#### Parameters:
`$data` *(array)*: Bulk status update data
* `licenses` *(\Illuminate\Support\Collection)* — Collection of License models that were updated

#### Usage Example:
```php
// Hook after a bulk license status update
add_action('fluent_cart_sl/after_updating_licenses_status', function ($data) {
    // Extract collection of updated license models
    $licenses = $data['licenses'];

    // Log completion of bulk status update
    fluent_cart_add_log('Licenses Status Updated', sprintf('%d licenses updated', $licenses->count()), 'info');
}, 10, 1);
```

---

### `after_updating_licenses_status_to_disabled` (Pro)
`fluent_cart_sl/after_updating_licenses_status_to_disabled` — Fires after licenses are bulk disabled

* **When it runs:** This action fires immediately after a collection of licenses has been bulk-disabled.
* **Source:** `fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php` (line 291)

#### Parameters:
`$data` *(array)*: Bulk disable data
* `licenses` *(\Illuminate\Support\Collection)* — Collection of License models that were disabled

#### Usage Example:
```php
// Hook after licenses are bulk disabled
add_action('fluent_cart_sl/after_updating_licenses_status_to_disabled', function ($data) {
    // Extract collection of disabled license models
    $licenses = $data['licenses'];

    // Log completion of bulk disable action
    fluent_cart_add_log('Licenses Bulk Disabled', sprintf('%d licenses disabled', $licenses->count()), 'warning');
}, 10, 1);
```
