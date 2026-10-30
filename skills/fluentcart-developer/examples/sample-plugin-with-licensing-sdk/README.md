# Sample WordPress Plugin with FluentCart Software Licensing SDK

A working example demonstrating how to integrate the official FluentCart Software Licensing SDK (`fluent-cart/software-licensing-sdk`) into a premium WordPress plugin.

## What This Example Demonstrates

1. **Automatic Updates:** Hooks into WordPress's native update pipeline so releases uploaded to your FluentCart store appear automatically in `wp-admin/plugins.php`.
2. **License Activation & Deactivation:** Communicates with your FluentCart store's public licensing endpoints (`?fluent-cart=activate_license`, etc.).
3. **Turnkey Admin License UI:** Mounts a settings page under **Tools → Example License** using `LicenseSettings.php`.
4. **Conditional Feature Gating:** Helper `fc_example_is_license_active()` showing how to gate premium features based on license validity.

## Files
- `sample-plugin-with-licensing-sdk.php` — Plugin bootstrap file.
- `updater/FluentLicensing.php` — Core licensing class.
- `updater/LicenseSettings.php` — Turnkey admin settings page UI.
- `updater/PluginUpdater.php` — Native WordPress update transience integration.

## How to Test
1. Copy this folder into your local WordPress test site: `wp-content/plugins/sample-plugin-with-licensing-sdk/`.
2. Replace `item_id` and `api_url` in `sample-plugin-with-licensing-sdk.php` with your live or local FluentCart store details.
3. Activate the plugin in `wp-admin/plugins.php`.
4. Navigate to **Tools → Example License** and test key activation with a key generated in FluentCart.
