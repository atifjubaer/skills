# FluentCart Software Licensing SDK & Automatic Updater Manual

Comprehensive developer reference for integrating the official FluentCart Software Licensing SDK (`fluent-cart/software-licensing-sdk`) into WordPress premium plugins and themes. Covers automatic background updates, remote license key activation/deactivation, status checks, custom settings pages, and updater filter hooks.

---

## Architecture & Overview

The FluentCart Software Licensing SDK enables creators selling premium WordPress plugins or themes with FluentCart Pro to:
1. Validate, activate, and deactivate customer license keys against the merchant's FluentCart store.
2. Hook into the WordPress core plugin update pipeline (`pre_set_site_transient_update_plugins`, `plugins_api`) to deliver one-click automatic updates and changelog modals directly in `wp-admin/plugins.php`.
3. Render a ready-to-use admin license management UI or integrate custom license input fields.

### SDK Directory Structure in a Plugin
```text
your-plugin/
├── your-plugin.php
└── updater/
    ├── FluentLicensing.php   # Main controller: registration, activation, status
    ├── LicenseSettings.php   # Admin UI renderer & settings page controller
    └── PluginUpdater.php     # WordPress core update transient & API hooks
```

---

## 1. Remote API Endpoints (Licensing Server)

The SDK communicates with the FluentCart store via standard query parameters on the store URL:

| Endpoint Query | Purpose | Required Query / Body Parameters |
|---|---|---|
| `?fluent-cart=activate_license` | Activate a license key for a site domain | `item_id`, `license_key`, `site_url`, `current_version` |
| `?fluent-cart=deactivate_license` | Deactivate a license key for a site domain | `item_id`, `license_key`, `site_url` |
| `?fluent-cart=check_license` | Verify status and expiry of a license | `item_id`, `license_key`, `site_url` |
| `?fluent-cart=get_license_version` | Fetch the latest available plugin release & package URL | `item_id`, `license_key`, `site_url`, `current_version` |

### Standard License Response Payload
```json
{
  "status": "valid",
  "license_key": "FC-XXXX-XXXX-XXXX-XXXX",
  "variation_id": 123,
  "variation_title": "5 Sites Agency License",
  "expires": "2027-12-31 23:59:59",
  "activation_hash": "a1b2c3d4e5f6...",
  "message": "License activated successfully"
}
```
*Note: For lifetime licenses, `expires` contains `'lifetime'`.*

---

## 2. Basic Plugin Integration

Include the licensing controller and call `register()` on plugin load (e.g. `plugins_loaded` or in main file):

```php
<?php
defined('ABSPATH') || exit;

add_action('plugins_loaded', function () {
    if (!class_exists('\YourPluginNamespace\FluentLicensing')) {
        require_once plugin_dir_path(__FILE__) . 'updater/FluentLicensing.php';
    }

    $licenseManager = new \YourPluginNamespace\FluentLicensing();

    $licenseManager->register([
        'version'           => '1.0.0',                      // Current plugin version
        'item_id'           => 42,                           // FluentCart Product / Item ID
        'basename'          => plugin_basename(__FILE__),    // e.g. 'my-plugin/my-plugin.php'
        'api_url'           => 'https://store.example.com/', // Your FluentCart store URL
        'plugin_title'      => 'Awesome Plugin Pro',         // Plugin display title
        
        // Optional Configuration
        'purchase_url'      => 'https://store.example.com/awesome-plugin/',
        'activate_url'      => admin_url('tools.php?page=awesome-plugin-license'),
        'show_check_update' => true,                         // Adds "Check for updates" link on plugins.php
        'settings_key'      => '__awesome_plugin_license_config' // Stored in wp_options
    ]);
});
```

---

## 3. Configuration Parameters Reference

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `version` | string | **Yes** | — | Current version string (e.g. `'1.2.0'`). |
| `item_id` | int | **Yes** | — | Product ID configured in FluentCart Pro. |
| `basename` | string | **Yes** | — | Plugin basename (from `plugin_basename(__FILE__)`). |
| `api_url` | string | **Yes** | — | Base URL of the store where FluentCart is installed. |
| `plugin_title` | string | **Yes** | — | Human-readable title of your plugin. |
| `purchase_url` | string | No | `''` | URL where users can purchase or renew licenses. |
| `activate_url` | string | No | `''` | URL to your plugin's license management admin screen. |
| `show_check_update` | bool | No | `true` | If true, adds a "Check for updates" link in `wp-admin/plugins.php`. |
| `settings_key` | string | No | `__{slug}_sl_info` | Key name in `wp_options` for local license cache. |

---

## 4. Programmatic License Management API (`FluentLicensing`)

The `FluentLicensing` instance provides full programmatic access to license operations:

### `activate(string $licenseKey): array|\WP_Error`
Sends an activation request to the remote FluentCart store.
```php
$licenseManager = \YourPluginNamespace\FluentLicensing::getInstance();
$response = $licenseManager->activate('FC-9876-5432-1098-7654');

if (is_wp_error($response)) {
    $errorMessage = $response->get_error_message();
} else {
    // Status can be: 'valid', 'invalid', 'disabled', 'unregistered', 'error'
    $status = $response['status'];
    $expires = $response['expires']; // 'Y-m-d' or 'lifetime'
}
```

### `deactivate(): array|\WP_Error`
Deactivates the current domain registration on the remote server and clears local option cache.
```php
$response = $licenseManager->deactivate();
if (!is_wp_error($response)) {
    // Successfully deactivated
}
```

### `getStatus(bool $remoteFetch = false): array|\WP_Error`
Retrieves license status. By default reads from local cache (`wp_options`). Pass `true` to force a live remote check.
```php
// Local check (zero network overhead)
$statusInfo = $licenseManager->getStatus(false);

// Format:
// [
//   'license_key'     => '...',
//   'status'          => 'valid',
//   'variation_id'    => 123,
//   'variation_title' => 'Agency 10-Site',
//   'expires'         => '2026-12-31 23:59:59',
//   'activation_hash' => '...'
// ]
```

### Utility Query Methods
- `$licenseManager->isLifetime(): bool` — Returns `true` if the license has no expiration date.
- `$licenseManager->getExpirationDate(): string` — Formatted expiration date string.
- `$licenseManager->getPlanName(): string` — Product variation / tier title.
- `$licenseManager->renewUrl(): string` — Direct link to renewal checkout.
- `$licenseManager->checkUpdate(): array|\WP_Error` — Forces a check against the update server.

---

## 5. Built-in Admin License Settings Page (`LicenseSettings`)

The SDK includes a turnkey admin UI renderer (`LicenseSettings.php`) that mounts an admin menu or submenu page:

```php
if (!class_exists('\YourPluginNamespace\LicenseSettings')) {
    require_once plugin_dir_path(__FILE__) . 'updater/LicenseSettings.php';
}

$licenseSettings = new \YourPluginNamespace\LicenseSettings();
$licenseSettings->register($licenseManager);

// Configure UI texts and branding
$licenseSettings->setConfig([
    'title'       => 'My Plugin Pro License',
    'heading'     => 'Activate Your License',
    'description' => 'Enter your license key to enable one-click updates and pro features.',
    'brand_logo'  => 'https://example.com/assets/logo.svg',
    'help_text'   => 'Lost your key? Check your account dashboard.'
]);

// Mount under Tools menu
$licenseSettings->addPage([
    'type'        => 'submenu',
    'parent_slug' => 'tools.php',
    'page_title'  => 'My Plugin License',
    'menu_title'  => 'My Plugin License',
    'capability'  => 'manage_options',
    'menu_slug'   => 'my-plugin-license'
]);
```

### Custom Rendering Hook
If you prefer a custom layout, use the dynamic action hook:
```php
add_action('fluent_licenseing_render_' . $actionRenderer, function ($config, $licenseData) {
    // Custom HTML form renderer
});
```

---

## 6. Updater Filter Hooks (`PluginUpdater`)

Fine-tune the WordPress update payload or add custom headers/query parameters:

### `fluent_sl/api_request_query_params`
Filter parameters sent to the update checking endpoint:
```php
add_filter('fluent_sl/api_request_query_params', function (array $params) {
    $params['php_version'] = PHP_VERSION;
    $params['locale'] = get_locale();
    return $params;
});
```

### `fluent_sl/updater_payload_{slug}`
Filter the package payload before WordPress core processes the download link:
```php
add_filter('fluent_sl/updater_payload_my-plugin-slug', function ($payload, $config) {
    // Inspect or modify $payload->package or $payload->new_version
    return $payload;
}, 10, 2);
```

---

## 7. Security & Best Practices Checklist

1. **Namespace Isolation**: Always replace the `FluentUpdater` namespace with your own plugin's unique namespace (e.g. `Acme\Pro\Updater`). Never leave default namespaces to prevent collisions with other plugins.
2. **Capability Verification**: Protect all license management and update trigger endpoints with `current_user_can('manage_options')`.
3. **Graceful Offline Fallback**: Wrap `getStatus(true)` in error checks; if the store is unreachable, fall back to cached local status rather than locking out paid customers.
4. **License Key Masking**: When displaying active keys in admin UI, mask the middle characters: `FC-XXXX-****-****-1234`.
