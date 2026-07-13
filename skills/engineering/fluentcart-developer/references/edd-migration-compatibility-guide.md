# Easy Digital Downloads (EDD) Migration & Compatibility

FluentCart provides a robust migration module and backward compatibility layer to transition stores from Easy Digital Downloads (EDD v3.0+) to FluentCart without disrupting existing customer licenses, payments, or downloads.

---

## 1. Migration CLI Commands

For larger databases, run the migration via WP-CLI to prevent HTTP timeout issues.

### Run Migration stages

```bash
# Run all migration stages sequentially
wp fluent_cart_migrator migrate_from_edd

# Run a specific migration stage
wp fluent_cart_migrator migrate_from_edd --stage=licenses --batch-size=100
```

Supported `--stage` options:
- `products` (Downloads, Pricing, Files)
- `coupons` (Legacy discounts and restrictions)
- `customers` (Contact records and user mapping)
- `orders` (Payment histories and receipts)
- `subscriptions` (Stripe/PayPal recurring settings)
- `licenses` (Software license keys and states)
- `recount` (LTV totals recalculation)

### Reset and Diagnostics

```bash
# Wipe migrated FluentCart data and reset state (Requires Dev Mode enabled)
wp fluent_cart_migrator reset

# Reset and refresh the FluentCart database schema
wp fluent_cart_migrator migrate_fresh

# Audit migrated license key integrity
wp fluent_cart_migrator migrate_from_edd --verify_license
```

To enable the reset utilities, add this constant in your staging `wp-config.php`:
```php
// Enable developer migration utilities
define('FLUENTCART_MIGRATOR_DEV_MODE', true);
```

---

## 2. Backward Compatibility Hook Layer

When the migration finishes, the **FluentCart Migrator** plugin must stay active. It acts as an interceptor layer for legacy requests.

### Legacy License API Redirects
The migrator intercepts legacy EDD software licensing endpoint requests (e.g. `?edd_action=activate_license`) and maps them to FluentCart licensing functions.

```php
// Intercepting and overriding legacy check-license requests
add_action('init', function () {
    // Check if the legacy EDD action query parameter is present
    $action = isset($_REQUEST['edd_action']) ? sanitize_key($_REQUEST['edd_action']) : '';
    if (empty($action)) {
        return;
    }

    // Handle legacy license validation requests on the fly
    if ($action === 'activate_license' || $action === 'check_license') {
        $licenseKey = sanitize_text_field($_REQUEST['license'] ?? '');
        $itemSlug = sanitize_text_field($_REQUEST['item_name'] ?? '');

        // Query migrated license record via FluentCart database layer
        $license = \FluentCart\App\Models\License::where('license_key', $licenseKey)->first();

        if ($license) {
            // Output legacy EDD-compatible JSON response payload
            wp_send_json([
                'license'      => $license->status === 'active' ? 'valid' : 'invalid',
                'item_name'    => $itemSlug,
                'expires'      => $license->expires_at,
                'limit'        => $license->activation_limit,
                'site_count'   => $license->activation_count,
                'activations'  => [], // Output legacy activation URLs if required
            ]);
        }
    }
});
```

---

## 3. Post-Migration Deactivation Checklist

To safely deprecate the migrator layer:
1. Complete the database migrations.
2. Reconnect active gateways (Stripe, PayPal webhooks) to target modern FluentCart endpoints.
3. Keep the migrator active for **6 to 12 months** to handle remaining offline clients or older software versions.
4. Run the cleanup command via WP-CLI to prune the temporary tables:
   ```bash
   wp fluent_cart_migrator migrate_from_edd --edd_cleanup
   ```
5. Deactivate and remove the **FluentCart Migrator** plugin.
