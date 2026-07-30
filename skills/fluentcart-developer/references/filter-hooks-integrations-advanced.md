# Filter Hooks: Integrations & Advanced

All filters related to external integrations, file storage, templates, License management, and advanced features.

---

## Integration Actions & Feeds

### `order_integrations`
`fluent_cart/integration/order_integrations` — Filter all registered order integrations

* **When it runs:** Applied when retrieving the list of all registered order integrations across event listeners, controllers, settings, and addons.
* **Source:** `IntegrationEventListener.php` (lines 54, 247, 386), `IntegrationController.php` (lines 96, 150), `ProductIntegrationsController.php` (lines 18, 48), `GlobalIntegrationSettings.php` (line 84)

#### Parameters:
* `$integrations` *(array)* — Array of registered integrations (`MailChimp`, `FluentCRM`, etc.)
* **Returns:** *(array)* — The modified integrations array

#### Usage Example:
```php
// Filter array of registered order integrations in FluentCart
add_filter('fluent_cart/integration/order_integrations', function ($integrations) {
    // Add custom CRM integration definition array
    $integrations['custom_crm'] = [
        'title'   => 'Custom CRM',
        'logo'    => 'https://example.com/crm-logo.png',
        'enabled' => true,
    ];
    return $integrations;
});
```

---

### `run_all_actions_on_async`
`fluent_cart/integration/run_all_actions_on_async` — Force all integration actions to run asynchronously

* **When it runs:** Controls whether integration actions should be dispatched asynchronously instead of immediately during order processing.
* **Source:** `IntegrationEventListener.php` (line 145)

#### Parameters:
* `$async` *(bool)* — Whether to force async execution (default: `false`)
* `$order` *(\FluentCart\App\Models\Order)* — The order model instance
* `$hook` *(string)* — The integration hook being fired
* **Returns:** *(bool)* — Whether to run actions asynchronously

#### Usage Example:
```php
// Force integration actions to dispatch asynchronously for large orders
add_filter('fluent_cart/integration/run_all_actions_on_async', function ($async, $order, $hook) {
    // Force async execution for orders exceeding $1,000 total
    if ($order->total > 100000) {
        return true;
    }
    return $async;
}, 10, 3);
```

---

### `global_notification_types`
`fluent_cart/integration/global_notification_types` — Filter available notification types

* **When it runs:** Applied when retrieving the list of available global notification types for integrations.
* **Source:** `GlobalIntegrationSettings.php` (line 119)

#### Parameters:
* `$types` *(array)* — Array of notification types (`email`, etc.)
* **Returns:** *(array)* — The modified notification types array

#### Usage Example:
```php
// Filter available global integration notification types array
add_filter('fluent_cart/integration/global_notification_types', function ($types) {
    // Append SMS notification type definition
    $types['sms'] = [
        'title'       => 'SMS Notification',
        'description' => 'Send SMS notifications on order events',
    ];
    return $types;
});
```

---

### `global_notification_feed_{$feed_key}`
`fluent_cart/integration/global_notification_feed_{$feed_key}` — Filter notification feed data (DYNAMIC)

* **When it runs:** Dynamic filter applied when retrieving notification feed data for a specific feed key.
* **Source:** `GlobalIntegrationSettings.php` (line 151)

#### Parameters:
* `$feedData` *(array)* — The notification feed data array
* **Returns:** *(array)* — The modified feed data array

#### Usage Example:
```php
// Filter notification feed data array for email alerts feed
add_filter('fluent_cart/integration/global_notification_feed_email_alerts', function ($feedData) {
    // Append additional admin email recipient to feed data
    $feedData['recipients'][] = 'extra-admin@example.com';
    return $feedData;
});
```

---

### `get_global_integration_actions`
`fluent_cart/integration/get_global_integration_actions` — Filter global integration actions

* **When it runs:** Applied when retrieving available global integration actions triggered by order events.
* **Source:** `GlobalIntegrationActionHandler.php` (line 22)

#### Parameters:
* `$actions` *(array)* — Array of integration actions (default: `[]`)
* **Returns:** *(array)* — The modified integration actions array

#### Usage Example:
```php
// Filter available global integration actions list
add_filter('fluent_cart/integration/get_global_integration_actions', function ($actions) {
    // Append custom webhook action definition to integration actions
    $actions['custom_webhook'] = [
        'title'   => 'Fire Custom Webhook',
        'enabled' => true,
    ];
    return $actions;
});
```

---

### `notifying_async_{$feedKey}`
`fluent_cart/integration/notifying_async_{$feedKey}` — Control async notification per feed (DYNAMIC)

* **When it runs:** Dynamic filter controlling whether a specific notification feed is processed asynchronously (default: `true`).
* **Source:** `GlobalNotificationHandler.php` (line 104)

#### Parameters:
* `$async` *(bool)* — Whether to process notification asynchronously (default: `true`)
* **Returns:** *(bool)* — Whether to use async processing

#### Usage Example:
```php
// Control async notification dispatch for email alerts feed
add_filter('fluent_cart/integration/notifying_async_email_alerts', function ($async) {
    // Force synchronous processing for email alerts notification feed
    return false;
});
```

---

### `webhook/payload` (Pro)
`fluent_cart/webhook/payload` — Filter webhook payload before sending

* **When it runs:** Applied to webhook payload body after construction, before encoding and dispatching to external endpoint. Requires Pro plugin.
* **Source:** `fluent-cart-pro/.../WebhookConnect.php` (line 251)

#### Parameters:
* `$payloadBody` *(array)* — Payload body data array
* `$context` *(array)* — Context data (`['order' => Order, 'feed' => array, 'event_data' => array]`)
* **Returns:** *(array)* — The modified payload body array

#### Usage Example:
```php
// Filter webhook payload array before sending to external endpoint (Pro)
add_filter('fluent_cart/webhook/payload', function ($payloadBody, $context) {
    // Append custom tracking metadata to payload body
    $payloadBody['custom_meta'] = [
        'source'    => 'fluentcart',
        'timestamp' => gmdate('Y-m-d H:i:s')
    ];

    // Remove customer email address from webhook payload
    unset($payloadBody['customer']['email']);

    return $payloadBody;
}, 10, 2);
```

---

## Integration Settings & Configuration

### `global_integration_settings_{$key}`
`fluent_cart/integration/global_integration_settings_{$key}` — Filter integration settings (DYNAMIC)

* **When it runs:** Dynamic filter applied when retrieving settings for a specific integration (e.g. `mailchimp`, `zapier`).
* **Source:** `GlobalIntegrationSettings.php` (line 24)

#### Parameters:
* `$settings` *(array)* — Integration settings array (default: `[]`)
* **Returns:** *(array)* — The modified settings array

#### Usage Example:
```php
// Filter integration settings array for MailChimp integration
add_filter('fluent_cart/integration/global_integration_settings_mailchimp', function ($settings) {
    // Override MailChimp API key from environment constant if defined
    $settings['api_key'] = defined('MAILCHIMP_API_KEY') ? MAILCHIMP_API_KEY : $settings['api_key'];
    return $settings;
});
```

---

### `global_integration_fields_{$key}`
`fluent_cart/integration/global_integration_fields_{$key}` — Filter integration field definitions (DYNAMIC)

* **When it runs:** Dynamic filter applied when retrieving field definitions for an integration configuration form.
* **Source:** `GlobalIntegrationSettings.php` (line 25)

#### Parameters:
* `$fields` *(array)* — Field definitions array (default: `[]`)
* **Returns:** *(array)* — The modified field definitions array

#### Usage Example:
```php
// Filter integration configuration form fields for MailChimp
add_filter('fluent_cart/integration/global_integration_fields_mailchimp', function ($fields) {
    // Append double opt-in checkbox field definition
    $fields[] = [
        'key'   => 'double_optin',
        'label' => 'Enable Double Opt-in',
        'type'  => 'checkbox',
    ];
    return $fields;
});
```

---

### `get_integration_defaults_{$name}`
`fluent_cart/integration/get_integration_defaults_{$name}` — Filter integration defaults (DYNAMIC)

* **When it runs:** Dynamic filter applied when retrieving default settings for a specific integration.
* **Source:** `GlobalIntegrationSettings.php` (lines 199, 201)

#### Parameters:
* `$defaults` *(array)* — Default settings values array
* **Returns:** *(array)* — The modified defaults array

#### Usage Example:
```php
// Filter default settings values for MailChimp integration
add_filter('fluent_cart/integration/get_integration_defaults_mailchimp', function ($defaults) {
    // Set default audience list ID and tag array
    $defaults['list_id'] = 'default_list_123';
    $defaults['tags']    = ['fluentcart-customer'];
    return $defaults;
});
```

---

### `get_integration_settings_fields_{$name}`
`fluent_cart/integration/get_integration_settings_fields_{$name}` — Filter integration settings fields (DYNAMIC)

* **When it runs:** Dynamic filter applied when retrieving settings field definitions for a specific integration.
* **Source:** `GlobalIntegrationSettings.php` (lines 204, 276), `IntegrationHelper.php` (line 27)

#### Parameters:
* `$fields` *(array)* — Field definitions array (default: `[]`)
* **Returns:** *(array)* — The modified field definitions array

#### Usage Example:
```php
// Filter settings form field definitions for Zapier integration
add_filter('fluent_cart/integration/get_integration_settings_fields_zapier', function ($fields) {
    // Append webhook URL input field definition
    $fields[] = [
        'key'         => 'webhook_url',
        'label'       => 'Webhook URL',
        'type'        => 'url',
        'required'    => true,
        'placeholder' => 'https://hooks.zapier.com/...',
    ];
    return $fields;
});
```

---

### `save_integration_values_{$name}`
`fluent_cart/integration/save_integration_values_{$name}` — Filter before saving integration data (DYNAMIC)

* **When it runs:** Dynamic filter applied just before integration settings are saved to database.
* **Source:** `GlobalIntegrationSettings.php` (line 248)

#### Parameters:
* `$integration` *(\FluentCart\App\Models\Meta)* — Meta model instance containing integration data
* **Returns:** *(\FluentCart\App\Models\Meta)* — The modified Meta model instance

#### Usage Example:
```php
// Filter Meta model instance before saving MailChimp integration data
add_filter('fluent_cart/integration/save_integration_values_mailchimp', function ($integration) {
    // Encrypt API key field value before persisting to database
    $value = $integration->value;
    if (!empty($value['api_key'])) {
        $value['api_key_encrypted'] = encrypt($value['api_key']);
    }
    $integration->value = $value;
    return $integration;
});
```

---

### `get_integration_merge_fields_{$name}`
`fluent_cart/integration/get_integration_merge_fields_{$name}` — Filter integration merge/mapping fields (DYNAMIC)

* **When it runs:** Dynamic filter applied when retrieving merge fields for mapping FluentCart data to external service fields.
* **Source:** `GlobalIntegrationSettings.php` (line 369)

#### Parameters:
* `$list` *(array)* — Merge fields list array
* `$listId` *(string)* — Audience or list identifier
* **Returns:** *(array)* — The modified merge fields array

#### Usage Example:
```php
// Filter integration merge mapping fields for MailChimp
add_filter('fluent_cart/integration/get_integration_merge_fields_mailchimp', function ($list, $listId) {
    // Append Company Name field to merge fields mapping list
    $list[] = [
        'key'   => 'COMPANY',
        'label' => 'Company Name',
        'type'  => 'text',
    ];
    return $list;
}, 10, 2);
```

---

### `integration_options_{$key}`
`fluent_cart/integration/integration_options_{$key}` — Filter dynamic integration options (DYNAMIC)

* **When it runs:** Dynamic filter applied when retrieving option values for integration dropdown or selection fields.
* **Source:** `IntegrationController.php` (line 302)

#### Parameters:
* `$options` *(array)* — Options array (default: `[]`)
* **Returns:** *(array)* — The modified options array

#### Usage Example:
```php
// Filter dynamic dropdown option values for MailChimp lists
add_filter('fluent_cart/integration/integration_options_mailchimp_lists', function ($options) {
    // Append custom audience option definition to list
    $options[] = [
        'id'    => 'custom_list',
        'title' => 'Custom Audience',
    ];
    return $options;
});
```

---

### `integration_saving_data_{$provider}`
`fluent_cart/integration/integration_saving_data_{$provider}` — Filter integration data before validation (DYNAMIC)

* **When it runs:** Dynamic filter applied to integration data before saving validation.
* **Source:** `IntegrationHelper.php` (line 62)

#### Parameters:
* `$validatedData` *(array)* — Validated integration data array
* **Returns:** *(array)* — The modified validated data array

#### Usage Example:
```php
// Filter MailChimp integration data before saving validation
add_filter('fluent_cart/integration/integration_saving_data_mailchimp', function ($validatedData) {
    // Convert tag strings to lowercase before saving
    if (!empty($validatedData['tags'])) {
        $validatedData['tags'] = array_map('strtolower', $validatedData['tags']);
    }
    return $validatedData;
});
```

---

### `editing_integration_{$key}`
`fluent_cart/integration/editing_integration_{$key}` — Filter integration data when editing (DYNAMIC)

* **When it runs:** Dynamic filter applied when an integration is loaded for editing in admin UI.
* **Source:** `IntegrationHelper.php` (line 80)

#### Parameters:
* `$data` *(array)* — Integration data for editing
* `$args` *(array)* — Additional context arguments
* **Returns:** *(array)* — The modified integration data

#### Usage Example:
```php
// Filter integration data when loading for edit in admin UI
add_filter('fluent_cart/integration/editing_integration_mailchimp', function ($data, $args) {
    // Decrypt API key for editing interface display
    if (!empty($data['api_key_encrypted'])) {
        $data['api_key'] = decrypt($data['api_key_encrypted']);
    }
    return $data;
}, 10, 2);
```

---

## Integration Addons

### `addons`
`fluent_cart/integration/addons` — Filter the integration addons list

* **When it runs:** Applied when retrieving list of available integration addons in admin interface.
* **Source:** `AddonsController.php` (line 87)

#### Parameters:
* `$addons` *(array)* — Array of addon definitions
* **Returns:** *(array)* — The modified addons array

#### Usage Example:
```php
// Filter available integration addons list in admin panel
add_filter('fluent_cart/integration/addons', function ($addons) {
    // Register custom integration addon definition
    $addons['my_addon'] = [
        'title'       => 'My Custom Addon',
        'description' => 'Adds custom integration functionality',
        'logo'        => 'https://example.com/addon-logo.png',
        'enabled'     => true,
    ];
    return $addons;
});
```

---

### `installable_repo_plugins`
`fluent_cart/installable_repo_plugins` — Filter installable plugin recommendations

* **When it runs:** Applied when retrieving recommended plugins installable from within FluentCart admin.
* **Source:** `AddonsController.php` (line 121), `GlobalIntegrationSettings.php` (line 396)

#### Parameters:
* `$plugins` *(array)* — Array of installable plugin definitions
* **Returns:** *(array)* — The modified plugins array

#### Usage Example:
```php
// Filter recommended plugins array installable from WP admin
add_filter('fluent_cart/installable_repo_plugins', function ($plugins) {
    // Append FluentCRM plugin definition to recommended plugins list
    $plugins[] = [
        'title'       => 'FluentCRM',
        'slug'        => 'fluent-crm',
        'description' => 'Email marketing automation',
        'url'         => 'https://wordpress.org/plugins/fluent-crm/',
    ];
    return $plugins;
});
```

---

## File Storage & Downloads

### `local_file_blocked_extensions`
`fluent_cart/local_file_blocked_extensions` — Filter blocked file extensions for local storage

* **When it runs:** Applied when validating local storage file uploads to modify blocked extension list.
* **Source:** `LocalDriver.php` (line 129)

#### Parameters:
* `$blockedExts` *(array)* — Array of blocked file extensions
* `$localFilePath` *(string)* — Local file path
* `$uploadToFilePath` *(string)* — Target upload path
* `$fileInfo` *(array)* — File information array
* **Returns:** *(array)* — The modified blocked extensions array

#### Usage Example:
```php
// Filter blocked file extensions array for local storage driver uploads
add_filter('fluent_cart/local_file_blocked_extensions', function ($blockedExts, $localFilePath, $uploadToFilePath, $fileInfo) {
    // Add SVG and WebP extensions to blocked upload list
    $blockedExts[] = 'svg';
    $blockedExts[] = 'webp';
    return $blockedExts;
}, 10, 4);
```

---

### `download_expiration_minutes`
`fluent_cart/download_expiration_minutes` — Filter S3 download link expiration time

* **When it runs:** Controls how long pre-signed S3 download URLs remain valid.
* **Source:** `S3Driver.php` (lines 237, 252)

#### Parameters:
* `$expirationMinutes` *(int)* — Expiration time in minutes
* `$context` *(array)* — Context data (`['file_path' => string, 'bucket' => string, 'driver' => 's3']`)
* **Returns:** *(int)* — The modified expiration time in minutes

#### Usage Example:
```php
// Filter S3 pre-signed download link expiration time in minutes
add_filter('fluent_cart/download_expiration_minutes', function ($expirationMinutes, $context) {
    // Extend download link validity to 120 minutes for ZIP files
    if (str_ends_with($context['file_path'], '.zip')) {
        return 120;
    }
    return $expirationMinutes;
}, 10, 2);
```

---

### `download_link_validity_in_minutes`
`fluent_cart/download_link_validity_in_minutes` — Filter download link validity duration

* **When it runs:** Controls how long customer-facing download links remain valid (default: `60` minutes).
* **Source:** `Helper.php` (line 1430)

#### Parameters:
* `$minutes` *(int)* — Link validity in minutes (default: `60`)
* `$context` *(array)* — Context data (`['product_download' => Model, 'order_id' => int, 'is_admin' => bool]`)
* **Returns:** *(int)* — The modified validity in minutes

#### Usage Example:
```php
// Filter customer-facing downloadable link validity duration in minutes
add_filter('fluent_cart/download_link_validity_in_minutes', function ($minutes, $context) {
    // Grant 24-hour download link validity window for admin users
    if ($context['is_admin']) {
        return 1440;
    }
    return $minutes;
}, 10, 2);
```

---

### `product_download/can_be_downloaded`
`fluent_cart/product_download/can_be_downloaded` — Filter whether a file can be downloaded

* **When it runs:** Applied during download validation to determine download permission.
* **Source:** `FileDownloader.php` (line 95)

#### Parameters:
* `$canDownload` *(bool|\WP_Error)* — Download permission boolean or rejection `WP_Error`
* **Returns:** *(bool|\WP_Error)* — The modified download permission

#### Usage Example:
```php
// Filter whether customer is permitted to download digital file
add_filter('fluent_cart/product_download/can_be_downloaded', function ($canDownload) {
    // Block file downloads during maintenance mode
    if (get_option('fluent_cart_maintenance_mode')) {
        return new \WP_Error('maintenance', 'Downloads are temporarily disabled during maintenance.');
    }
    return $canDownload;
});
```

---

### `get_global_storage_settings_{$driver}`
`fluent_cart/storage/get_global_storage_settings_{$driver}` — Filter storage driver settings (DYNAMIC)

* **When it runs:** Dynamic filter applied when retrieving settings for a specific storage driver (`s3`, `local`).
* **Source:** `api/StorageDrivers.php` (line 18)

#### Parameters:
* `$settings` *(array)* — Storage driver settings array (default: `[]`)
* **Returns:** *(array)* — The modified settings array

#### Usage Example:
```php
// Filter global S3 storage driver settings array
add_filter('fluent_cart/storage/get_global_storage_settings_s3', function ($settings) {
    // Override S3 bucket and region from environment constants if set
    $settings['bucket'] = defined('S3_BUCKET') ? S3_BUCKET : $settings['bucket'];
    $settings['region'] = defined('S3_REGION') ? S3_REGION : $settings['region'];
    return $settings;
});
```

---

### `get_global_storage_drivers`
`fluent_cart/storage/get_global_storage_drivers` — Filter all available storage drivers

* **When it runs:** Applied when retrieving list of all available storage drivers.
* **Source:** `StorageDrivers.php` (line 28)

#### Parameters:
* `$drivers` *(array)* — Array of storage driver definitions (default: `[]`)
* **Returns:** *(array)* — The modified drivers array

#### Usage Example:
```php
// Filter available file storage driver definitions array
add_filter('fluent_cart/storage/get_global_storage_drivers', function ($drivers) {
    // Register custom Backblaze B2 storage driver handler
    $drivers['backblaze'] = [
        'title'       => 'Backblaze B2',
        'description' => 'Store files on Backblaze B2',
        'handler'     => 'BackblazeDriver',
    ];
    return $drivers;
});
```

---

### `get_global_storage_driver_status_{$driver}`
`fluent_cart/storage/get_global_storage_driver_status_{$driver}` — Filter storage driver status (DYNAMIC)

* **When it runs:** Dynamic filter retrieving connection status for a specific storage driver.
* **Source:** `StorageDrivers.php` (line 65)

#### Parameters:
* `$status` *(array)* — Driver status array (default: `[]`)
* **Returns:** *(array)* — The modified status array

#### Usage Example:
```php
// Filter connection status array for S3 storage driver
add_filter('fluent_cart/storage/get_global_storage_driver_status_s3', function ($status) {
    // Set connected status and success message for S3 driver
    $status['connected'] = true;
    $status['message']   = 'Connected to S3 bucket successfully';
    return $status;
});
```

---

### `verify_driver_connect_info_{$driver}`
`fluent_cart/verify_driver_connect_info_{$driver}` — Filter driver connection verification (DYNAMIC)

* **When it runs:** Dynamic filter applied when verifying connection info for a storage driver.
* **Source:** `StorageDrivers.php` (line 79)

#### Parameters:
* `$settings` *(array)* — Driver connection settings array
* **Returns:** *(array)* — The modified settings array

#### Usage Example:
```php
// Filter S3 storage driver connection verification check
add_filter('fluent_cart/verify_driver_connect_info_s3', function ($settings) {
    // Verify AWS S3 credentials via SDK bucket listing test
    try {
        $client = new \Aws\S3\S3Client($settings);
        $client->listBuckets();
        $settings['verified'] = true;
    } catch (\Exception $e) {
        $settings['error'] = $e->getMessage();
    }
    return $settings;
});
```

---

### `storage_settings_before_update_{$slug}`
`fluent_cart/storage/storage_settings_before_update_{$slug}` — Filter storage settings before saving (DYNAMIC)

* **When it runs:** Dynamic filter applied just before storage driver settings are saved.
* **Source:** `BaseStorageDriver.php` (line 152)

#### Parameters:
* `$settings` *(array)* — New settings array
* `$oldSettings` *(array)* — Previous settings array
* **Returns:** *(array)* — The modified settings array

#### Usage Example:
```php
// Filter S3 storage driver settings before saving to database
add_filter('fluent_cart/storage/storage_settings_before_update_s3', function ($settings, $oldSettings) {
    // Preserve existing S3 secret key if omitted in update request
    if (empty($settings['secret_key']) && !empty($oldSettings['secret_key'])) {
        $settings['secret_key'] = $oldSettings['secret_key'];
    }
    return $settings;
}, 10, 2);
```

---

## Localization & Address

### `country_state_options`
`fluent_cart/country_state_options` — Filter country and state options

* **When it runs:** Applied when retrieving country and state dropdown options for address forms.
* **Source:** `LocalizationManager.php` (line 425)

#### Parameters:
* `$options` *(array)* — Country/state options array
* **Returns:** *(array)* — The modified options array

#### Usage Example:
```php
// Filter country and state dropdown options array for address forms
add_filter('fluent_cart/country_state_options', function ($options) {
    // Exclude invalid country code XX from countries dropdown list
    unset($options['countries']['XX']);
    return $options;
});
```

---

### `address/postcode/format`
`fluent_cart/address/postcode/format` — Filter postcode formatting

* **When it runs:** Applied when formatting a postcode value, typically during address validation.
* **Source:** `PostcodeVerification.php` (line 53)

#### Parameters:
* `$postcode` *(string)* — Trimmed postcode value
* `$country` *(string)* — Country code (ISO 3166-1 alpha-2)
* **Returns:** *(string)* — The formatted postcode string

#### Usage Example:
```php
// Filter formatted postcode string value during verification
add_filter('fluent_cart/address/postcode/format', function ($postcode, $country) {
    // Format UK postcode with space delimiter
    if ($country === 'GB' && strlen($postcode) > 3 && strpos($postcode, ' ') === false) {
        return substr($postcode, 0, -3) . ' ' . substr($postcode, -3);
    }
    return $postcode;
}, 10, 2);
```

---

### `address/postcode/is_valid`
`fluent_cart/address/postcode/is_valid` — Filter postcode validation result

* **When it runs:** Applied after postcode validation to enforce custom validation rules.
* **Source:** `PostcodeVerification.php` (line 154)

#### Parameters:
* `$valid` *(bool)* — Whether postcode is valid
* `$postcode` *(string)* — Postcode being validated
* `$country` *(string)* — Country code (ISO 3166-1 alpha-2)
* **Returns:** *(bool)* — The modified validation result

#### Usage Example:
```php
// Filter postcode validity verification result boolean
add_filter('fluent_cart/address/postcode/is_valid', function ($valid, $postcode, $country) {
    // Validate 5-digit numeric postcode regex for custom country XX
    if ($country === 'XX') {
        return preg_match('/^\d{5}$/', $postcode) === 1;
    }
    return $valid;
}, 10, 3);
```

---

### `util/countries` (legacy)
`fluent-cart/util/countries` — Filter the country list

* **When it runs:** Applied when retrieving full list of countries. Note hyphenated prefix (`fluent-cart/`).
* **Source:** `Helper.php` (line 1140)

#### Parameters:
* `$options` *(array)* — Array of country code => country name pairs
* **Returns:** *(array)* — The modified country list array

#### Usage Example:
```php
// Filter global country list array (legacy hyphenated hook name)
add_filter('fluent-cart/util/countries', function ($options) {
    // Restrict countries list to US, CA, GB, and AU
    return array_intersect_key($options, array_flip(['US', 'CA', 'GB', 'AU']));
});
```

---

## Templates & Frontend

### `template/disable_taxonomy_fallback`
`fluent_cart/template/disable_taxonomy_fallback` — Disable taxonomy fallback template

* **When it runs:** Controls whether taxonomy fallback template should be disabled (default: `false`).
* **Source:** `TemplateLoader.php` (line 113)

#### Parameters:
* `$disable` *(bool)* — Whether to disable taxonomy fallback
* **Returns:** *(bool)* — The modified boolean value

#### Usage Example:
```php
// Filter whether to disable taxonomy fallback template rendering
add_filter('fluent_cart/template/disable_taxonomy_fallback', function ($disable) {
    // Disable taxonomy template fallback when custom theme template is active
    return true;
});
```

---

### `has_block_template`
`fluent_cart/has_block_template` — Filter block template existence check

* **When it runs:** Applied when checking if block template exists for current page.
* **Source:** `TemplateLoader.php` (line 193)

#### Parameters:
* `$hasTemplate` *(bool)* — Whether a block template exists
* **Returns:** *(bool)* — The modified boolean result

#### Usage Example:
```php
// Filter block template existence check result for current page
add_filter('fluent_cart/has_block_template', function ($hasTemplate) {
    // Force classic template rendering by returning false
    return false;
});
```

---

### `template_loader_files`
`fluent_cart/template_loader_files` — Filter template files to load

* **When it runs:** Applied when determining which template files should be loaded for current request.
* **Source:** `TemplateLoader.php` (line 206)

#### Parameters:
* `$files` *(array)* — Array of template file paths (default: `[]`)
* **Returns:** *(array)* — The modified template files array

#### Usage Example:
```php
// Filter array of template file paths loaded for request
add_filter('fluent_cart/template_loader_files', function ($files) {
    // Append custom stylesheet theme template file path
    $files[] = get_stylesheet_directory() . '/fluent-cart/custom-template.php';
    return $files;
});
```

---

### `template_path`
`fluent_cart/template_path` — Filter theme template path

* **When it runs:** Controls directory path within a theme where FluentCart template overrides are located (default: `'fluent-cart/'`).
* **Source:** `TemplateLoader.php` (line 248)

#### Parameters:
* `$path` *(string)* — Template directory path
* **Returns:** *(string)* — The modified template path

#### Usage Example:
```php
// Filter theme directory path storing FluentCart template overrides
add_filter('fluent_cart/template_path', function ($path) {
    // Override template overrides directory path in active theme
    return 'my-store/templates/';
});
```

---

### `fluent_cart_template_part_content`
`fluent_cart_template_part_content` — Filter template part content

* **When it runs:** Applied to template part content before rendering.
* **Source:** `ProductModalTemplatePart.php` (line 245)

#### Parameters:
* `$content` *(string)* — Template part content string
* `$slug` *(string)* — Template part slug
* `$args` *(array)* — Template arguments
* **Returns:** *(string)* — The modified content string

#### Usage Example:
```php
// Filter template part content string before rendering
add_filter('fluent_cart_template_part_content', function ($content, $slug, $args) {
    // Wrap product card template part HTML in custom container div
    if ($slug === 'product-card') {
        $content = '<div class="custom-wrapper">' . $content . '</div>';
    }
    return $content;
}, 10, 3);
```

---

### `fluent_cart_template_part_content_{$slug}`
`fluent_cart_template_part_content_{$slug}` — Filter template part content by slug (DYNAMIC)

* **When it runs:** Dynamic filter applied to a specific template part's content.
* **Source:** `ProductModalTemplatePart.php` (line 246)

#### Parameters:
* `$content` *(string)* — Template part content string
* `$args` *(array)* — Template arguments
* **Returns:** *(string)* — The modified content string

#### Usage Example:
```php
// Filter product card template part content by slug
add_filter('fluent_cart_template_part_content_product-card', function ($content, $args) {
    // Append New badge HTML element to product card content
    $content .= '<span class="badge">New</span>';
    return $content;
}, 10, 2);
```

---

### `fluent_cart_template_part_output`
`fluent_cart_template_part_output` — Filter template part output

* **When it runs:** Applied to final rendered output of a template part.
* **Source:** `ProductModalTemplatePart.php` (line 252)

#### Parameters:
* `$output` *(string)* — Rendered template part output HTML
* **Returns:** *(string)* — The modified output string

#### Usage Example:
```php
// Filter final rendered output string of template part
add_filter('fluent_cart_template_part_output', function ($output) {
    // Minify rendered template part output whitespace
    return preg_replace('/\s+/', ' ', $output);
});
```

---

### `fluent_cart_template_part_output_{$slug}`
`fluent_cart_template_part_output_{$slug}` — Filter template part output by slug (DYNAMIC)

* **When it runs:** Dynamic filter applied to final rendered output of a specific template part.
* **Source:** `ProductModalTemplatePart.php` (line 253)

#### Parameters:
* `$output` *(string)* — Rendered output HTML
* **Returns:** *(string)* — The modified output string

#### Usage Example:
```php
// Filter final output string of product modal template part
add_filter('fluent_cart_template_part_output_product-modal', function ($output) {
    // Inject custom tracking data attribute into modal container div
    return str_replace('<div class="fct-modal"', '<div class="fct-modal" data-tracking="true"', $output);
});
```

---

### `buttons/enable_floating_cart_button`
`fluent_cart/buttons/enable_floating_cart_button` — Filter floating cart button visibility

* **When it runs:** Controls whether floating cart button is displayed on frontend (default: `true`).
* **Source:** `app/Hooks/Cart/CartLoader.php` (line 41)

#### Parameters:
* `$enabled` *(bool)* — Whether floating cart button is enabled
* **Returns:** *(bool)* — The modified boolean value

#### Usage Example:
```php
// Filter frontend floating cart button visibility toggle
add_filter('fluent_cart/buttons/enable_floating_cart_button', function ($enabled) {
    // Disable floating cart button on landing page
    if (is_page('landing-page')) {
        return false;
    }
    return $enabled;
});
```

---

## Widgets & Dashboard

### `{$widgetName}`
`fluent_cart/{$widgetName}` — Filter widget data by name (DYNAMIC)

* **When it runs:** Dynamic filter applied when dashboard widget retrieves its data.
* **Source:** `app/Services/Widgets/BaseWidget.php` (line 16)

#### Parameters:
* `$widgetData` *(mixed)* — Widget data array returned by `widgetData()`
* **Returns:** *(mixed)* — The modified widget data

#### Usage Example:
```php
// Filter dashboard revenue widget data array dynamically
add_filter('fluent_cart/revenue_widget', function ($widgetData) {
    // Inject calculated custom metric value into revenue widget data
    $widgetData['custom_metric'] = calculate_custom_metric();
    return $widgetData;
});
```

---

### `widgets/{$filter}`
`fluent_cart/widgets/{$filter}` — Filter widget data by filter key (DYNAMIC)

* **When it runs:** Dynamic filter applied when retrieving widget data for filter key in widgets controller.
* **Source:** `WidgetsController.php` (line 36)

#### Parameters:
* `$result` *(array)* — Widget result data array (default: `[]`)
* `$data` *(array)* — Request data array
* **Returns:** *(array)* — The modified widget data array

#### Usage Example:
```php
// Filter sales overview widget chart data array dynamically
add_filter('fluent_cart/widgets/sales_overview', function ($result, $data) {
    // Attach custom chart dataset structure to sales overview widget
    $result['custom_chart'] = [
        'labels' => ['Jan', 'Feb', 'Mar'],
        'data'   => [100, 200, 150],
    ];
    return $result;
}, 10, 2);
```

---

### `promo_gateways`
`fluent_cart/promo_gateways` — Filter promotional gateways

* **When it runs:** Applied when retrieving list of promotional payment gateways shown in admin.
* **Source:** `PromoGatewaysHandler.php` (line 36)

#### Parameters:
* `$defaultGateways` *(array)* — Array of default promotional gateways
* **Returns:** *(array)* — The modified gateways array

#### Usage Example:
```php
// Filter promotional payment gateways list in admin panel
add_filter('fluent_cart/promo_gateways', function ($gateways) {
    // Remove specific example gateway from promotional gateways
    unset($gateways['example_gateway']);
    return $gateways;
});
```

---

### `addon_gateways`
`fluent_cart/addon_gateways` — Filter addon payment gateways

* **When it runs:** Applied when retrieving list of addon payment gateways.
* **Source:** `AddonGatewaysHandler.php` (line 36)

#### Parameters:
* `$defaultGateways` *(array)* — Array of default addon gateways
* **Returns:** *(array)* — The modified gateways array

#### Usage Example:
```php
// Filter addon payment gateways list array
add_filter('fluent_cart/addon_gateways', function ($gateways) {
    // Register custom payment gateway addon definition
    $gateways['custom_pay'] = [
        'title'       => 'Custom Pay',
        'description' => 'Custom payment gateway addon',
        'is_active'   => true,
    ];
    return $gateways;
});
```

---

## Advanced List Filters

### `{$filter}_list_filter_query`
`fluent_cart/{$filter}_list_filter_query` — Filter list filter query (DYNAMIC)

* **When it runs:** Dynamic filter applied when building database queries for filtered list pages (orders, customers, subscriptions, etc.).
* **Source:** `BaseFilter.php` (lines 962, 971)

#### Parameters:
* `$query` *(\FluentCart\Framework\Database\Orm\Builder)* — Eloquent query builder instance
* **Returns:** *(\FluentCart\Framework\Database\Orm\Builder)* — The modified query builder

#### Usage Example:
```php
// Filter Eloquent query builder for admin orders list view
add_filter('fluent_cart/orders_list_filter_query', function ($query) {
    // Restrict orders list query to orders created within last 30 days
    $query->where('created_at', '>=', gmdate('Y-m-d H:i:s', strtotime('-30 days')));
    return $query;
});
```

---

### `{$filterName}_filter_options`
`fluent_cart/{$filterName}_filter_options` — Filter options for list page filters (DYNAMIC)

* **When it runs:** Dynamic filter applied when retrieving available filter options for admin list pages.
* **Source:** `BaseFilter.php` (line 995)

#### Parameters:
* `$options` *(array)* — Filter options array
* **Returns:** *(array)* — The modified filter options array

#### Usage Example:
```php
// Filter available filter dropdown options for orders list page
add_filter('fluent_cart/orders_filter_options', function ($options) {
    // Inject custom status dropdown filter option for orders list page
    $options['custom_status'] = [
        'label'   => 'Custom Status',
        'type'    => 'select',
        'options' => ['pending_review' => 'Pending Review'],
    ];
    return $options;
});
```

---

### `{$filterName}_table_columns`
`fluent_cart/{$filterName}_table_columns` — Filter table columns for list pages (DYNAMIC)

* **When it runs:** Dynamic filter applied when retrieving table column definitions for admin list pages.
* **Source:** `BaseFilter.php` (line 1038)

#### Parameters:
* `$columns` *(array)* — Table column definitions array (default: `[]`)
* **Returns:** *(array)* — The modified columns array

#### Usage Example:
```php
// Filter table column definitions for admin orders list view
add_filter('fluent_cart/orders_table_columns', function ($columns) {
    // Append custom field column definition to orders table
    $columns['custom_field'] = [
        'label'    => 'Custom Field',
        'sortable' => true,
        'width'    => '120px',
    ];
    return $columns;
});
```

---

### `advanced_filter_options_{$dataKey}`
`fluent_cart/advanced_filter_options_{$dataKey}` — Filter advanced filter options (DYNAMIC)

* **When it runs:** Dynamic filter applied when retrieving options for advanced filter UI.
* **Source:** `AdvanceFilterController.php` (line 46)

#### Parameters:
* `$options` *(array)* — Filter options array
* **Returns:** *(array)* — The modified options array

#### Usage Example:
```php
// Filter options array for advanced filter UI payment methods
add_filter('fluent_cart/advanced_filter_options_payment_methods', function ($options) {
    // Append custom gateway option to advanced filter UI
    $options[] = [
        'value' => 'custom_gateway',
        'label' => 'Custom Gateway',
    ];
    return $options;
});
```

---

## Plugin Installer

### `outside_addon/handle_cdn_install`
`fluent_cart/outside_addon/handle_cdn_install` — Filter CDN addon installation

* **When it runs:** Applied when attempting to install an addon from a CDN source. Return non-null value to handle installation manually.
* **Source:** `BackgroundInstaller.php` (line 143)

#### Parameters:
* `$result` *(mixed)* — Installation result (default: `null`)
* **Returns:** *(mixed)* — The installation result, or `null` for default handling

#### Usage Example:
```php
// Intercept addon installation from CDN external source
add_filter('fluent_cart/outside_addon/handle_cdn_install', function ($result) {
    // Handle custom CDN addon installation logic
    if ($result === null) {
        return ['success' => true, 'message' => 'Installed from custom CDN'];
    }
    return $result;
});
```

---

### `outside_addon/handle_install`
`fluent_cart/outside_addon/handle_install` — Filter external addon installation

* **When it runs:** Applied when installing an addon from an external source. Return non-null value to handle installation manually.
* **Source:** `BackgroundInstaller.php` (line 164)

#### Parameters:
* `$result` *(mixed)* — Installation result (default: `null`)
* **Returns:** *(mixed)* — The installation result, or `null` for default handling

#### Usage Example:
```php
// Intercept external addon installation process
add_filter('fluent_cart/outside_addon/handle_install', function ($result) {
    // Return success response payload for custom external addon installer
    return ['success' => true, 'message' => 'Addon installed successfully'];
});
```

---

## Pro: E-Invoicing

### `einvoice/buyer_vat_id` (Pro)
`fluent_cart/einvoice/buyer_vat_id` — Filter buyer VAT ID written to e-invoice

* **When it runs:** Applied in `En16931InvoiceMapper` while mapping order to EN 16931 e-invoice (BT-48) XML. Requires Pro plugin.
* **Source:** `fluent-cart-pro/.../En16931InvoiceMapper.php` (line 154)

#### Parameters:
* `$buyerVatId` *(string)* — Resolved buyer VAT identifier
* `$context` *(array)* — Context data (`['order' => Order]`)
* **Returns:** *(string)* — The buyer VAT identifier string to write

#### Usage Example:
```php
// Filter buyer VAT identification string written to EN 16931 e-invoice (Pro)
add_filter('fluent_cart/einvoice/buyer_vat_id', function ($buyerVatId, $context) {
    // Prepend billing country code prefix to buyer VAT ID if omitted
    $country = $context['order']->billing_address->country ?? '';
    if ($country && strpos($buyerVatId, $country) !== 0) {
        $buyerVatId = $country . $buyerVatId;
    }

    return $buyerVatId;
}, 10, 2);
```

---

### `einvoice/tax_category` (Pro)
`fluent_cart/einvoice/tax_category` — Filter EN 16931 VAT category for e-invoice line

* **When it runs:** Applied in `En16931InvoiceMapper` after resolving EN 16931 VAT category for invoice line or shipping charge. Requires Pro plugin.
* **Source:** `fluent-cart-pro/.../En16931InvoiceMapper.php` (line 357)

#### Parameters:
* `$resolved` *(array)* — Category data (`categoryCode`, `ratePercent`, `exemptionReasonCode`, `exemptionReasonText`)
* `$context` *(array)* — Context data (`['order' => Order, 'line' => LineItem|null]`)
* **Returns:** *(array)* — The modified VAT category data array

#### Usage Example:
```php
// Filter EN 16931 VAT tax category data for e-invoice line item (Pro)
add_filter('fluent_cart/einvoice/tax_category', function ($resolved, $context) {
    // Force exempt category E for target product line post ID 123
    if ($context['line'] && ($context['line']->post_id ?? 0) === 123) {
        $resolved['categoryCode']        = 'E';
        $resolved['ratePercent']         = 0.0;
        $resolved['exemptionReasonCode'] = 'VATEX-EU-O';
        $resolved['exemptionReasonText'] = 'Exempt supply';
    }

    return $resolved;
}, 10, 2);
```

---

## Pro: Licensing API

### `license/checking_error` (Pro)
`fluent_cart/license/checking_error` — Filter license check error response

* **When it runs:** Applied when license check encounters an error to customize error response payload. Requires Pro plugin.
* **Source:** `LicenseApiHandler.php` (lines 45, 56)

#### Parameters:
* `$error` *(array)* — Error response array
* **Returns:** *(array)* — Modified error response array

#### Usage Example:
```php
// Filter license verification error response array (Pro)
add_filter('fluent_cart/license/checking_error', function ($error) {
    // Override license check error message string
    $error['message'] = 'Please contact support for license verification.';
    return $error;
});
```

---

### `license/check_item_id` (Pro)
`fluent_cart/license/check_item_id` — Filter item ID validation during license check

* **When it runs:** Controls whether item ID should be validated during license check API request (default: `true`). Requires Pro plugin.
* **Source:** `LicenseApiHandler.php` (line 54)

#### Parameters:
* `$checkItemId` *(bool)* — Whether to check item ID
* **Returns:** *(bool)* — Modified boolean value

#### Usage Example:
```php
// Filter whether item ID is validated during license check API call (Pro)
add_filter('fluent_cart/license/check_item_id', function ($checkItemId) {
    // Skip item ID check during license check API request
    return false;
});
```

---

### `license/check_license_response` (Pro)
`fluent_cart/license/check_license_response` — Filter license check API response

* **When it runs:** Applied to license check API response before returning to client. Requires Pro plugin.
* **Source:** `LicenseApiHandler.php` (line 83)

#### Parameters:
* `$returnData` *(array)* — License check response data array
* **Returns:** *(array)* — Modified response data array

#### Usage Example:
```php
// Filter license check API response payload before returning to client (Pro)
add_filter('fluent_cart/license/check_license_response', function ($returnData) {
    // Append custom support URL string to license check API response
    $returnData['support_url'] = 'https://example.com/support';
    return $returnData;
});
```

---

### `license/activate_license_response` (Pro)
`fluent_cart/license/activate_license_response` — Filter license activation API response

* **When it runs:** Applied to license activation API response before returning to client. Requires Pro plugin.
* **Source:** `LicenseApiHandler.php` (lines 170, 274)

#### Parameters:
* `$returnData` *(array)* — Activation response data array
* **Returns:** *(array)* — Modified response data array

#### Usage Example:
```php
// Filter license activation API response payload (Pro)
add_filter('fluent_cart/license/activate_license_response', function ($returnData) {
    // Append activated_at timestamp string to license activation response
    $returnData['activated_at'] = gmdate('Y-m-d H:i:s');
    return $returnData;
});
```

---

### `license/deactivate_license_response` (Pro)
`fluent_cart/license/deactivate_license_response` — Filter license deactivation API response

* **When it runs:** Applied to license deactivation API response before returning to client. Requires Pro plugin.
* **Source:** `LicenseApiHandler.php` (line 356)

#### Parameters:
* `$returnData` *(array)* — Deactivation response data array
* **Returns:** *(array)* — Modified response data array

#### Usage Example:
```php
// Filter license deactivation API response payload (Pro)
add_filter('fluent_cart/license/deactivate_license_response', function ($returnData) {
    // Append deactivation notice text string to response
    $returnData['notice'] = 'License deactivated. You can reactivate on another site.';
    return $returnData;
});
```

---

### `license/get_version_response` (Pro)
`fluent_cart/license/get_version_response` — Filter version check API response

* **When it runs:** Applied to version check API response to modify changelog or update information. Requires Pro plugin.
* **Source:** `LicenseApiHandler.php` (line 463)

#### Parameters:
* `$changeLogData` *(array)* — Version and changelog response data array
* **Returns:** *(array)* — Modified response data array

#### Usage Example:
```php
// Filter software update version check API response payload (Pro)
add_filter('fluent_cart/license/get_version_response', function ($changeLogData) {
    // Append custom patch entry string to changelog section
    $changeLogData['sections']['changelog'] .= "\n* Custom patch applied";
    return $changeLogData;
});
```

---

### `license/santized_url` (Pro)
`fluent_cart/license/santized_url` — Filter sanitized URL for license validation

* **When it runs:** Applied when sanitizing site URL during license activation or validation. Requires Pro plugin.
* **Source:** `LicenseHelper.php` (line 36)

#### Parameters:
* `$url` *(string)* — Sanitized URL string
* `$originalUrl` *(string)* — Original URL before sanitization
* **Returns:** *(string)* — Modified sanitized URL string

#### Usage Example:
```php
// Filter sanitized URL string used during license validation (Pro)
add_filter('fluent_cart/license/santized_url', function ($url, $originalUrl) {
    // Strip www subdomain prefix from sanitized site URL
    return str_replace('://www.', '://', $url);
}, 10, 2);
```

---

## Pro: License Validation & Staging

### `fluent_cart_sl/is_local_site` (Pro)
`fluent_cart_sl/is_local_site` — Filter local/staging site detection

* **When it runs:** Applied when determining if current site is local or staging for licensing purposes. Requires Pro plugin.
* **Source:** `fluent-cart-pro/.../LicenseSite.php` (line 69)

#### Parameters:
* `$isLocal` *(bool)* — Whether site is detected as local
* `$context` *(array)* — Context data (`['url' => string, 'site' => string]`)
* **Returns:** *(bool)* — Modified detection result boolean

#### Usage Example:
```php
// Filter local or staging site detection boolean for licensing (Pro)
add_filter('fluent_cart_sl/is_local_site', function ($isLocal, $context) {
    // Mark URLs containing .staging. as local staging sites
    if (str_contains($context['url'], '.staging.')) {
        return true;
    }
    return $isLocal;
}, 10, 2);
```

---

### `license/staging_subdomain_patterns` (Pro)
`fluent_cart/license/staging_subdomain_patterns` — Filter staging subdomain patterns

* **When it runs:** Applied when checking if URL matches known staging subdomain patterns. Requires Pro plugin.
* **Source:** `LicenseHelper.php` (line 619)

#### Parameters:
* `$patterns` *(array)* — Array of subdomain patterns indicating staging sites
* **Returns:** *(array)* — Modified patterns array

#### Usage Example:
```php
// Filter staging subdomain regex patterns array for licensing (Pro)
add_filter('fluent_cart/license/staging_subdomain_patterns', function ($patterns) {
    // Append dev- and test- subdomain prefixes to staging patterns list
    $patterns[] = 'dev-';
    $patterns[] = 'test-';
    return $patterns;
});
```

---

### `license/staging_subfolder_patterns` (Pro)
`fluent_cart/license/staging_subfolder_patterns` — Filter staging subfolder patterns

* **When it runs:** Applied when checking if URL matches known staging subfolder patterns. Requires Pro plugin.
* **Source:** `LicenseHelper.php` (line 620)

#### Parameters:
* `$patterns` *(array)* — Array of subfolder patterns indicating staging sites
* **Returns:** *(array)* — Modified patterns array

#### Usage Example:
```php
// Filter staging subfolder path patterns array for licensing (Pro)
add_filter('fluent_cart/license/staging_subfolder_patterns', function ($patterns) {
    // Append /staging/ and /test-site/ subfolders to staging patterns
    $patterns[] = '/staging/';
    $patterns[] = '/test-site/';
    return $patterns;
});
```

---

### `license/staging_domains` (Pro)
`fluent_cart/license/staging_domains` — Filter hosting provider staging domains

* **When it runs:** Applied when checking if URL belongs to known hosting provider staging domain. Requires Pro plugin.
* **Source:** `LicenseHelper.php` (line 621)

#### Parameters:
* `$domains` *(array)* — Array of hosting provider staging domain patterns
* **Returns:** *(array)* — Modified domains array

#### Usage Example:
```php
// Filter hosting provider staging domain patterns array (Pro)
add_filter('fluent_cart/license/staging_domains', function ($domains) {
    // Append custom hosting provider staging domain patterns
    $domains[] = 'mystaginghost.com';
    $domains[] = 'preview.myhost.io';
    return $domains;
});
```

---

### `license/is_staging_site_result` (Pro)
`fluent_cart/license/is_staging_site_result` — Filter final staging site detection result

* **When it runs:** Applied after all staging detection checks to provide final boolean result (default: `false`). Requires Pro plugin.
* **Source:** `LicenseHelper.php` (line 657)

#### Parameters:
* `$isStaging` *(bool)* — Whether site is detected as staging
* `$url` *(string)* — Site URL being checked
* **Returns:** *(bool)* — Modified staging detection result

#### Usage Example:
```php
// Filter final staging site detection boolean result (Pro)
add_filter('fluent_cart/license/is_staging_site_result', function ($isStaging, $url) {
    // Override staging detection for specific target domain string
    if (str_contains($url, 'mycompany-staging.com')) {
        return true;
    }
    return $isStaging;
}, 10, 2);
```

---

## Pro: License Configuration

### `license/validity_by_variation` (Pro)
`fluent_cart/license/validity_by_variation` — Filter license validity per variation

* **When it runs:** Applied when determining license validity settings for a specific product variation. Requires Pro plugin.
* **Source:** `ProductLicenseController.php` (line 74)

#### Parameters:
* `$validity` *(array)* — Validity settings array (`duration`, `unit`)
* `$context` *(array)* — Context data (`['variation' => ProductVariation]`)
* **Returns:** *(array)* — The modified validity settings array

#### Usage Example:
```php
// Filter license validity settings per product variation (Pro)
add_filter('fluent_cart/license/validity_by_variation', function ($validity, $context) {
    // Apply 365-day license validity for premium variation slug
    $variation = $context['variation'];
    if ($variation->slug === 'premium') {
        $validity['duration'] = 365;
        $validity['unit']     = 'days';
    }
    return $validity;
}, 10, 2);
```
