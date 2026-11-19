# Integrations & Advanced

All filters related to external integrations, file storage, templates, [License](/database/models/license.md) management, and advanced features.

---

## Integration Actions & Feeds

### ` order_integrations `

`fluent_cart/integration/order_integrations` — Filter all registered order integrations

**When it runs:** This filter is applied when retrieving the list of all registered order integrations. It is used across integration event handling, integration controllers, product integration setup, global settings, and addon modules.

**Parameters:**

- `$integrations` (array): Array of registered integrations (default `[]`)

```
$integrations = [
    'mailchimp' => [
        'title' => 'MailChimp',
        'logo' => 'https://example.com/mailchimp-logo.png',
        'enabled' => true
    ]
];
```

**Returns:**

- `$integrations` (array): The modified integrations array

**Source:** `IntegrationEventListener.php:54,247,386`, `IntegrationController.php:96,150`, `ProductIntegrationsController.php:18,48`, `GlobalIntegrationSettings.php:84`, `AddOnModule.php:16`

**Usage:**

```
add_filter('fluent_cart/integration/order_integrations', function ($integrations) {
    $integrations['custom_crm'] = [
        'title'   => 'Custom CRM',
        'logo'    => 'https://example.com/crm-logo.png',
        'enabled' => true,
    ];
    return $integrations;
});
```

### ` run_all_actions_on_async `

`fluent_cart/integration/run_all_actions_on_async` — Force all integration actions to run asynchronously

**When it runs:** This filter controls whether integration actions should be dispatched asynchronously instead of running immediately during order processing.

**Parameters:**

- `$async` (bool): Whether to force async execution (default `false`)
- `$order` ([Order](/database/models/order.md)): The order model
- `$hook` (string): The integration hook being fired

**Returns:**

- `$async` (bool): Whether to run actions asynchronously

**Source:** `IntegrationEventListener.php:145`

**Usage:**

```
add_filter('fluent_cart/integration/run_all_actions_on_async', function ($async, $order, $hook) {
    // Force async for large orders to avoid timeout
    if ($order->total > 100000) {
        return true;
    }
    return $async;
}, 10, 3);
```

### ` global_notification_types `

`fluent_cart/integration/global_notification_types` — Filter available notification types

**When it runs:** This filter is applied when retrieving the list of available global notification types for integrations.

**Parameters:**

- `$types` (array): Array of notification types (default `[]`)

```
$types = [
    'email' => [
        'title' => 'Email Notification',
        'description' => 'Send email notifications'
    ]
];
```

**Returns:**

- `$types` (array): The modified notification types array

**Source:** `GlobalIntegrationSettings.php:119`

**Usage:**

```
add_filter('fluent_cart/integration/global_notification_types', function ($types) {
    $types['sms'] = [
        'title'       => 'SMS Notification',
        'description' => 'Send SMS notifications on order events',
    ];
    return $types;
});
```

### ` global_notification_feed_{$feed_key} `

`fluent_cart/integration/global_notification_feed_{$feed_key}` — Filter notification feed data (DYNAMIC)

**When it runs:** This dynamic filter is applied when retrieving notification feed data for a specific feed key. The `{$feed_key}` portion is replaced with the actual feed identifier.

**Parameters:**

- `$feedData` (array): The notification feed data

**Returns:**

- `$feedData` (array): The modified feed data

**Source:** `GlobalIntegrationSettings.php:151`

**Usage:**

```
add_filter('fluent_cart/integration/global_notification_feed_email_alerts', function ($feedData) {
    // Modify email alert feed data
    $feedData['recipients'][] = '[email&#160;protected]';
    return $feedData;
});
```

### ` get_global_integration_actions `

`fluent_cart/integration/get_global_integration_actions` — Filter global integration actions

**When it runs:** This filter is applied when retrieving available global integration actions that can be triggered by order events.

**Parameters:**

- `$actions` (array): Array of integration actions (default `[]`)

```
$actions = [
    'mailchimp_subscribe' => [
        'title' => 'Subscribe to MailChimp',
        'enabled' => true
    ]
];
```

**Returns:**

- `$actions` (array): The modified integration actions array

**Source:** `GlobalIntegrationActionHandler.php:22`

**Usage:**

```
add_filter('fluent_cart/integration/get_global_integration_actions', function ($actions) {
    $actions['custom_webhook'] = [
        'title'   => 'Fire Custom Webhook',
        'enabled' => true,
    ];
    return $actions;
});
```

### ` notifying_async_{$feedKey} `

`fluent_cart/integration/notifying_async_{$feedKey}` — Control async notification per feed (DYNAMIC)

**When it runs:** This dynamic filter controls whether a specific notification feed should be dispatched asynchronously. The `{$feedKey}` is replaced with the actual feed key.

**Parameters:**

- `$async` (bool): Whether to process this notification asynchronously (default `true`)

**Returns:**

- `$async` (bool): Whether to use async processing

**Source:** `GlobalNotificationHandler.php:104`

**Usage:**

```
add_filter('fluent_cart/integration/notifying_async_email_alerts', function ($async) {
    // Force synchronous for email alerts
    return false;
});
```

### ` webhook/payload `

`fluent_cart/webhook/payload` Pro — Filter webhook payload before sending

**When it runs:** This filter is applied to the webhook payload body after it is constructed but before it is encoded and sent to the external endpoint. Allows complete customization of webhook data.

**Parameters:**

- `$payloadBody` (array): The payload body data
- `$context` (array): Context data

```
$context = [
    'order'      => $orderModel,       // The order model
    'feed'       => $feedConfig,       // The webhook feed configuration
    'event_data' => $eventData         // The original event data
];
```

**Returns:**

- `$payloadBody` (array): The modified payload body

**Source:** `fluent-cart-pro/app/Modules/Integrations/WebhookConnect.php:251`

**Usage:**

```
add_filter('fluent_cart/webhook/payload', function ($payloadBody, $context) {
    // Add custom field to payload
    $payloadBody['custom_meta'] = [
        'source'    => 'fluentcart',
        'timestamp' => gmdate('Y-m-d H:i:s')
    ];

    // Remove sensitive data
    unset($payloadBody['customer']['email']);

    return $payloadBody;
}, 10, 2);
```

---

## Integration Settings & Configuration

### ` global_integration_settings_{$key} `

`fluent_cart/integration/global_integration_settings_{$key}` — Filter integration settings (DYNAMIC)

**When it runs:** This dynamic filter is applied when retrieving settings for a specific integration. The `{$key}` is replaced with the integration key (e.g., `mailchimp`, `zapier`).

**Parameters:**

- `$settings` (array): The integration settings (default `[]`)

**Returns:**

- `$settings` (array): The modified settings array

**Source:** `GlobalIntegrationSettings.php:24`

**Usage:**

```
add_filter('fluent_cart/integration/global_integration_settings_mailchimp', function ($settings) {
    // Override MailChimp API key from environment
    $settings['api_key'] = defined('MAILCHIMP_API_KEY') ? MAILCHIMP_API_KEY : $settings['api_key'];
    return $settings;
});
```

### ` global_integration_fields_{$key} `

`fluent_cart/integration/global_integration_fields_{$key}` — Filter integration field definitions (DYNAMIC)

**When it runs:** This dynamic filter is applied when retrieving field definitions for a specific integration configuration form. The `{$key}` is replaced with the integration key.

**Parameters:**

- `$fields` (array): The field definitions (default `[]`)

**Returns:**

- `$fields` (array): The modified field definitions

**Source:** `GlobalIntegrationSettings.php:25`

**Usage:**

```
add_filter('fluent_cart/integration/global_integration_fields_mailchimp', function ($fields) {
    $fields[] = [
        'key'   => 'double_optin',
        'label' => 'Enable Double Opt-in',
        'type'  => 'checkbox',
    ];
    return $fields;
});
```

### ` get_integration_defaults_{$name} `

`fluent_cart/integration/get_integration_defaults_{$name}` — Filter integration defaults (DYNAMIC)

**When it runs:** This dynamic filter is applied when retrieving default settings for a specific integration. The `{$name}` is replaced with the integration name.

**Parameters:**

- `$defaults` (array): The default settings values

**Returns:**

- `$defaults` (array): The modified defaults

**Source:** `GlobalIntegrationSettings.php:199,201`

**Usage:**

```
add_filter('fluent_cart/integration/get_integration_defaults_mailchimp', function ($defaults) {
    $defaults['list_id'] = 'default_list_123';
    $defaults['tags']    = ['fluentcart-customer'];
    return $defaults;
});
```

### ` get_integration_settings_fields_{$name} `

`fluent_cart/integration/get_integration_settings_fields_{$name}` — Filter integration settings fields (DYNAMIC)

**When it runs:** This dynamic filter is applied when retrieving the settings field definitions for a specific integration. The `{$name}` is replaced with the integration name.

**Parameters:**

- `$fields` (array): The field definitions (default `[]`)

**Returns:**

- `$fields` (array): The modified field definitions

**Source:** `GlobalIntegrationSettings.php:204,276`, `IntegrationHelper.php:27`

**Usage:**

```
add_filter('fluent_cart/integration/get_integration_settings_fields_zapier', function ($fields) {
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

### ` save_integration_values_{$name} `

`fluent_cart/integration/save_integration_values_{$name}` — Filter before saving integration data (DYNAMIC)

**When it runs:** This dynamic filter is applied just before integration settings are saved to the database. The `{$name}` is replaced with the integration name.

**Parameters:**

- `$integration` (Meta): The Meta model instance containing the integration data

**Returns:**

- `$integration` (Meta): The modified Meta model

**Source:** `GlobalIntegrationSettings.php:248`

**Usage:**

```
add_filter('fluent_cart/integration/save_integration_values_mailchimp', function ($integration) {
    // Encrypt API key before saving
    $value = $integration->value;
    if (!empty($value['api_key'])) {
        $value['api_key_encrypted'] = encrypt($value['api_key']);
    }
    $integration->value = $value;
    return $integration;
});
```

### ` get_integration_merge_fields_{$name} `

`fluent_cart/integration/get_integration_merge_fields_{$name}` — Filter integration merge/mapping fields (DYNAMIC)

**When it runs:** This dynamic filter is applied when retrieving merge fields for a specific integration. These fields are used for mapping FluentCart data to external service fields.

**Parameters:**

- `$list` (array): The merge fields list
- `$listId` (string): The list or audience ID

**Returns:**

- `$list` (array): The modified merge fields

**Source:** `GlobalIntegrationSettings.php:369`

**Usage:**

```
add_filter('fluent_cart/integration/get_integration_merge_fields_mailchimp', function ($list, $listId) {
    $list[] = [
        'key'   => 'COMPANY',
        'label' => 'Company Name',
        'type'  => 'text',
    ];
    return $list;
}, 10, 2);
```

### ` integration_options_{$key} `

`fluent_cart/integration/integration_options_{$key}` — Filter dynamic integration options (DYNAMIC)

**When it runs:** This dynamic filter is applied when retrieving option values for an integration dropdown or selection field. The `{$key}` is replaced with the option key.

**Parameters:**

- `$options` (array): The options array (default `[]`)

**Returns:**

- `$options` (array): The modified options

**Source:** `IntegrationController.php:302`

**Usage:**

```
add_filter('fluent_cart/integration/integration_options_mailchimp_lists', function ($options) {
    // Add a custom list option
    $options[] = [
        'id'    => 'custom_list',
        'title' => 'Custom Audience',
    ];
    return $options;
});
```

### ` integration_saving_data_{$provider} `

`fluent_cart/integration/integration_saving_data_{$provider}` — Filter integration data before validation (DYNAMIC)

**When it runs:** This dynamic filter is applied to integration data before it undergoes validation when saving. The `{$provider}` is replaced with the provider key.

**Parameters:**

- `$validatedData` (array): The validated integration data

**Returns:**

- `$validatedData` (array): The modified data

**Source:** `IntegrationHelper.php:62`

**Usage:**

```
add_filter('fluent_cart/integration/integration_saving_data_mailchimp', function ($validatedData) {
    // Normalize tags before saving
    if (!empty($validatedData['tags'])) {
        $validatedData['tags'] = array_map('strtolower', $validatedData['tags']);
    }
    return $validatedData;
});
```

### ` editing_integration_{$key} `

`fluent_cart/integration/editing_integration_{$key}` — Filter integration data when editing (DYNAMIC)

**When it runs:** This dynamic filter is applied when an integration is being loaded for editing in the admin UI.

**Parameters:**

- `$data` (array): The integration data for editing
- `$args` (array): Additional context arguments

**Returns:**

- `$data` (array): The modified integration data

**Source:** `IntegrationHelper.php:80`

**Usage:**

```
add_filter('fluent_cart/integration/editing_integration_mailchimp', function ($data, $args) {
    // Decrypt API key for display
    if (!empty($data['api_key_encrypted'])) {
        $data['api_key'] = decrypt($data['api_key_encrypted']);
    }
    return $data;
}, 10, 2);
```

---

## Integration Addons

### ` addons `

`fluent_cart/integration/addons` — Filter the integration addons list

**When it runs:** This filter is applied when retrieving the list of available integration addons in the admin interface.

**Parameters:**

- `$addons` (array): Array of addon definitions

**Returns:**

- `$addons` (array): The modified addons array

**Source:** `AddonsController.php:87`

**Usage:**

```
add_filter('fluent_cart/integration/addons', function ($addons) {
    $addons['my_addon'] = [
        'title'       => 'My Custom Addon',
        'description' => 'Adds custom integration functionality',
        'logo'        => 'https://example.com/addon-logo.png',
        'enabled'     => true,
    ];
    return $addons;
});
```

### ` installable_repo_plugins `

`fluent_cart/installable_repo_plugins` — Filter installable plugin recommendations

**When it runs:** This filter is applied when retrieving the list of recommended plugins that can be installed from within the FluentCart admin.

**Parameters:**

- `$plugins` (array): Array of installable plugin definitions

**Returns:**

- `$plugins` (array): The modified plugins array

**Source:** `AddonsController.php:121`, `GlobalIntegrationSettings.php:396`

**Usage:**

```
add_filter('fluent_cart/installable_repo_plugins', function ($plugins) {
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

### ` local_file_blocked_extensions `

`fluent_cart/local_file_blocked_extensions` — Filter blocked file extensions for local storage

**When it runs:** This filter is applied when validating a file upload to local storage, allowing you to modify the list of blocked file extensions.

**Parameters:**

- `$blockedExts` (array): Array of blocked file extensions
- `$localFilePath` (string): Local file path
- `$uploadToFilePath` (string): Target upload path
- `$fileInfo` (array): File information array
- Additional context parameters

**Returns:**

- `$blockedExts` (array): The modified blocked extensions array

**Source:** `LocalDriver.php:129`

**Usage:**

```
add_filter('fluent_cart/local_file_blocked_extensions', function ($blockedExts, $localFilePath, $uploadToFilePath, $fileInfo) {
    // Block additional extensions
    $blockedExts[] = 'svg';
    $blockedExts[] = 'webp';
    return $blockedExts;
}, 10, 4);
```

### ` download_expiration_minutes `

`fluent_cart/download_expiration_minutes` — Filter S3 download link expiration time

**When it runs:** This filter controls how long a pre-signed S3 download URL remains valid.

**Parameters:**

- `$expirationMinutes` (int): Expiration time in minutes
- `$context` (array): Context data

```
$context = [
    'file_path' => 'products/my-file.zip',
    'bucket'    => 'my-bucket',
    'driver'    => 's3'
];
```

**Returns:**

- `$expirationMinutes` (int): The modified expiration time in minutes

**Source:** `S3Driver.php:237,252`

**Usage:**

```
add_filter('fluent_cart/download_expiration_minutes', function ($expirationMinutes, $context) {
    // Extend expiration for large files
    if (str_ends_with($context['file_path'], '.zip')) {
        return 120; // 2 hours
    }
    return $expirationMinutes;
}, 10, 2);
```

### ` download_link_validity_in_minutes `

`fluent_cart/download_link_validity_in_minutes` — Filter download link validity duration

**When it runs:** This filter controls how long a download link remains valid for customer-facing downloads.

**Parameters:**

- `$minutes` (int): Link validity in minutes (default `60`)
- `$context` (array): Context data

```
$context = [
    'product_download' => $downloadModel,
    'order_id'         => 123,
    'is_admin'         => false
];
```

**Returns:**

- `$minutes` (int): The modified validity in minutes

**Source:** `Helper.php:1430`

**Usage:**

```
add_filter('fluent_cart/download_link_validity_in_minutes', function ($minutes, $context) {
    // Give admins longer download windows
    if ($context['is_admin']) {
        return 1440; // 24 hours
    }
    return $minutes;
}, 10, 2);
```

### ` product_download/can_be_downloaded `

`fluent_cart/product_download/can_be_downloaded` — Filter whether a file can be downloaded

**When it runs:** This filter is applied during download validation to determine if a customer is allowed to download a specific file.

**Parameters:**

- `$canDownload` (bool|WP_Error): Whether the file can be downloaded, or a WP_Error with rejection reason

**Returns:**

- `$canDownload` (bool|WP_Error): The modified download permission

**Source:** `FileDownloader.php:95`

**Usage:**

```
add_filter('fluent_cart/product_download/can_be_downloaded', function ($canDownload) {
    // Block downloads during maintenance
    if (get_option('fluent_cart_maintenance_mode')) {
        return new \WP_Error('maintenance', 'Downloads are temporarily disabled during maintenance.');
    }
    return $canDownload;
});
```

### ` get_global_storage_settings_{$driver} `

`fluent_cart/storage/get_global_storage_settings_{$driver}` — Filter storage driver settings (DYNAMIC)

**When it runs:** This dynamic filter is applied when retrieving settings for a specific storage driver. The `{$driver}` is replaced with the driver name (e.g., `s3`, `local`).

**Parameters:**

- `$settings` (array): The storage driver settings (default `[]`)

**Returns:**

- `$settings` (array): The modified settings

**Source:** `api/StorageDrivers.php:18`

**Usage:**

```
add_filter('fluent_cart/storage/get_global_storage_settings_s3', function ($settings) {
    // Override S3 settings from environment variables
    $settings['bucket'] = defined('S3_BUCKET') ? S3_BUCKET : $settings['bucket'];
    $settings['region'] = defined('S3_REGION') ? S3_REGION : $settings['region'];
    return $settings;
});
```

### ` get_global_storage_drivers `

`fluent_cart/storage/get_global_storage_drivers` — Filter all available storage drivers

**When it runs:** This filter is applied when retrieving the list of all available storage drivers.

**Parameters:**

- `$drivers` (array): Array of storage driver definitions (default `[]`)

**Returns:**

- `$drivers` (array): The modified drivers array

**Source:** `StorageDrivers.php:28`

**Usage:**

```
add_filter('fluent_cart/storage/get_global_storage_drivers', function ($drivers) {
    $drivers['backblaze'] = [
        'title'       => 'Backblaze B2',
        'description' => 'Store files on Backblaze B2',
        'handler'     => 'BackblazeDriver',
    ];
    return $drivers;
});
```

### ` get_global_storage_driver_status_{$driver} `

`fluent_cart/storage/get_global_storage_driver_status_{$driver}` — Filter storage driver status (DYNAMIC)

**When it runs:** This dynamic filter retrieves the connection status for a specific storage driver.

**Parameters:**

- `$status` (array): The driver status (default `[]`)

**Returns:**

- `$status` (array): The modified status array

**Source:** `StorageDrivers.php:65`

**Usage:**

```
add_filter('fluent_cart/storage/get_global_storage_driver_status_s3', function ($status) {
    $status['connected'] = true;
    $status['message']   = 'Connected to S3 bucket successfully';
    return $status;
});
```

### ` verify_driver_connect_info_{$driver} `

`fluent_cart/verify_driver_connect_info_{$driver}` — Filter driver connection verification (DYNAMIC)

**When it runs:** This dynamic filter is applied when verifying the connection info for a storage driver.

**Parameters:**

- `$settings` (array): The driver connection settings

**Returns:**

- `$settings` (array): The modified settings (may include error information)

**Source:** `StorageDrivers.php:79`

**Usage:**

```
add_filter('fluent_cart/verify_driver_connect_info_s3', function ($settings) {
    // Validate credentials before saving
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

### ` storage_settings_before_update_{$slug} `

`fluent_cart/storage/storage_settings_before_update_{$slug}` — Filter storage settings before saving (DYNAMIC)

**When it runs:** This dynamic filter is applied just before storage driver settings are saved, allowing you to validate or modify them.

**Parameters:**

- `$settings` (array): The new settings to save
- `$oldSettings` (array): The previous settings

**Returns:**

- `$settings` (array): The modified settings

**Source:** `BaseStorageDriver.php:152`

**Usage:**

```
add_filter('fluent_cart/storage/storage_settings_before_update_s3', function ($settings, $oldSettings) {
    // Preserve the secret key if not provided in the update
    if (empty($settings['secret_key']) && !empty($oldSettings['secret_key'])) {
        $settings['secret_key'] = $oldSettings['secret_key'];
    }
    return $settings;
}, 10, 2);
```

### ` storage/s3_prevent_overwrite `

`fluent_cart/storage/s3_prevent_overwrite` — Filter whether an S3 upload may overwrite an existing object

**When it runs:** Applied in `S3FileUploader`'s constructor, before the S3 request signature is generated, while preparing to upload a file to the S3-compatible storage driver. It is resolved once per upload and the result is baked into the signed request, so a listener cannot change it after signing.

**Parameters:**

- `$preventOverwrite` (bool): Whether to refuse the upload instead of overwriting an existing object at the same key. Default `false`.
- `$context` (array): Context data

```
$context = [
    'bucket'       => $this->bucket,        // string — the target S3 bucket
    's3_file_path' => $this->s3FilePath,    // string — the destination object key
];
```

**Returns:** `bool` — whether the upload should refuse to overwrite an existing object

**Source:** `app/Services/FileSystem/Drivers/S3/S3FileUploader.php:64`

**Usage:**

```
add_filter('fluent_cart/storage/s3_prevent_overwrite', function ($preventOverwrite, $context) {
    // Never allow overwriting objects already stored under "licenses/"
    if (strpos($context['s3_file_path'], 'licenses/') === 0) {
        return true;
    }
    return $preventOverwrite;
}, 10, 2);
```

### ` storage/settings_response `

`fluent_cart/storage/settings_response` — Filter a storage driver's settings-screen response

**When it runs:** Applied in `BaseStorageDriver::getSettingsResponse()` after the driver's raw settings (and, if applicable, the settings-template payload) have been assembled for the admin Storage settings screen. Runs for every storage driver before the driver-specific `fluent_cart/storage/settings_response_{$slug}` filter gets the same, already-filtered value.

**Parameters:**

- `$response` (array): The settings response payload sent to the admin UI
- `$driver` ([BaseStorageDriver](/database/models/order.md)): The storage driver instance (e.g. the S3 or local driver)

**Returns:** `array` — the modified settings response

**Source:** `app/Modules/StorageDrivers/BaseStorageDriver.php:184`

**Usage:**

```
add_filter('fluent_cart/storage/settings_response', function ($response, $driver) {
    // Flag drivers that still need a connection test
    if (empty($response['verified'])) {
        $response['needs_verification'] = true;
    }
    return $response;
}, 10, 2);
```

### ` storage/settings_response_{slug} `

`fluent_cart/storage/settings_response_{$slug}` — Filter one storage driver's settings-screen response (DYNAMIC)

**When it runs:** Fires immediately after `fluent_cart/storage/settings_response` above, in the same `BaseStorageDriver::getSettingsResponse()` call, receiving the value that generic filter already returned. The `{$slug}` portion is replaced with the driver's own slug (e.g. `s3`, `local`), so a listener can target one specific driver without checking `$driver->slug` itself.

**Parameters:**

- `$response` (array): The settings response payload, already passed through `fluent_cart/storage/settings_response`
- `$driver` ([BaseStorageDriver](/database/models/order.md)): The storage driver instance

**Returns:** `array` — the modified settings response

**Source:** `app/Modules/StorageDrivers/BaseStorageDriver.php:186`

**Usage:**

```
add_filter('fluent_cart/storage/settings_response_s3', function ($response, $driver) {
    // Surface the configured region directly at the top level for the S3 driver
    $response['region_label'] = $response['settings']['region'] ?? 'us-east-1';
    return $response;
}, 10, 2);
```

---

## Data Backfills & Migrations

### ` data_backfills/chunk_budget `

`fluent_cart/data_backfills/chunk_budget` — Filter the chunk size and per-run budget for a data backfill task

**When it runs:** Applied at the start of a chunked data-backfill task (e.g. the `completed_next_billing_date` backfill that repairs subscription billing-date rows), before it selects its first batch of rows. Controls how many rows are processed per chunk and how many chunks may run in a single request, so it is mainly useful for shrinking the batch size in tests against a small table — production leaves the defaults as-is.

**Parameters:**

- `$budget` (array): The chunk/run budget, keyed by:

```
$budget = [
    'chunk_size'         => 500, // int — rows processed per chunk
    'max_chunks_per_run' => 10,  // int — maximum chunks processed in one request
];
```

- `$context` (array): Context data

```
$context = [
    'slug' => 'completed_next_billing_date', // string — identifies which backfill task is running
];
```

**Returns:** `array` — the modified budget, same shape as `$budget`

**Source:** `database/DataBackfills.php:535`

**Usage:**

```
add_filter('fluent_cart/data_backfills/chunk_budget', function ($budget, $context) {
    // Use a much smaller chunk size in a test environment
    if ($context['slug'] === 'completed_next_billing_date' && wp_get_environment_type() !== 'production') {
        $budget['chunk_size'] = 5;
        $budget['max_chunks_per_run'] = 2;
    }
    return $budget;
}, 10, 2);
```

---

## Localization & Address

### ` country_state_options `

`fluent_cart/country_state_options` — Filter country and state options

**When it runs:** This filter is applied when retrieving country and state dropdown options for address forms.

**Parameters:**

- `$options` (array): The country/state options array

**Returns:**

- `$options` (array): The modified options

**Source:** `LocalizationManager.php:425`

**Usage:**

```
add_filter('fluent_cart/country_state_options', function ($options) {
    // Remove a country from the list
    unset($options['countries']['XX']);
    return $options;
});
```

### ` address/postcode/format `

`fluent_cart/address/postcode/format` — Filter postcode formatting

**When it runs:** This filter is applied when formatting a postcode value, typically during address validation.

**Parameters:**

- `$postcode` (string): The trimmed postcode value
- `$country` (string): The country code

**Returns:**

- `$postcode` (string): The formatted postcode

**Source:** `PostcodeVerification.php:53`

**Usage:**

```
add_filter('fluent_cart/address/postcode/format', function ($postcode, $country) {
    // Format UK postcodes with a space
    if ($country === 'GB' && strlen($postcode) > 3 && strpos($postcode, ' ') === false) {
        return substr($postcode, 0, -3) . ' ' . substr($postcode, -3);
    }
    return $postcode;
}, 10, 2);
```

### ` address/postcode/is_valid `

`fluent_cart/address/postcode/is_valid` — Filter postcode validation result

**When it runs:** This filter is applied after postcode validation to allow custom validation rules.

**Parameters:**

- `$valid` (bool): Whether the postcode is valid
- `$postcode` (string): The postcode being validated
- `$country` (string): The country code

**Returns:**

- `$valid` (bool): The modified validation result

**Source:** `PostcodeVerification.php:154`

**Usage:**

```
add_filter('fluent_cart/address/postcode/is_valid', function ($valid, $postcode, $country) {
    // Add custom validation for specific country
    if ($country === 'XX') {
        return preg_match('/^\d{5}$/', $postcode) === 1;
    }
    return $valid;
}, 10, 3);
```

---

## Templates & Frontend

### ` template/disable_taxonomy_fallback `

`fluent_cart/template/disable_taxonomy_fallback` — Disable taxonomy fallback template

**When it runs:** This filter controls whether the taxonomy fallback template should be disabled.

**Parameters:**

- `$disable` (bool): Whether to disable taxonomy fallback (default `false`)

**Returns:**

- `$disable` (bool): The modified value

**Source:** `TemplateLoader.php:113`

**Usage:**

```
add_filter('fluent_cart/template/disable_taxonomy_fallback', function ($disable) {
    // Disable taxonomy fallback when using a custom theme
    return true;
});
```

### ` has_block_template `

`fluent_cart/has_block_template` — Filter block template existence check

**When it runs:** This filter is applied when checking if a block template exists for the current page.

**Parameters:**

- `$hasTemplate` (bool): Whether a block template exists

**Returns:**

- `$hasTemplate` (bool): The modified result

**Source:** `TemplateLoader.php:193`

**Usage:**

```
add_filter('fluent_cart/has_block_template', function ($hasTemplate) {
    // Force classic template rendering
    return false;
});
```

### ` template_loader_files `

`fluent_cart/template_loader_files` — Filter template files to load

**When it runs:** This filter is applied when determining which template files should be loaded for the current request.

**Parameters:**

- `$files` (array): Array of template file paths (default `[]`)

**Returns:**

- `$files` (array): The modified template files array

**Source:** `TemplateLoader.php:206`

**Usage:**

```
add_filter('fluent_cart/template_loader_files', function ($files) {
    // Add custom template file
    $files[] = get_stylesheet_directory() . '/fluent-cart/custom-template.php';
    return $files;
});
```

### ` template_path `

`fluent_cart/template_path` — Filter theme template path

**When it runs:** This filter controls the directory path within a theme where FluentCart template overrides are located.

**Parameters:**

- `$path` (string): The template directory path (default `'fluent-cart/'`)

**Returns:**

- `$path` (string): The modified template path

**Source:** `TemplateLoader.php:248`

**Usage:**

```
add_filter('fluent_cart/template_path', function ($path) {
    // Use a custom directory for template overrides
    return 'my-store/templates/';
});
```

### ` template_part_content `

`fluent_cart/template_part_content` — Filter template part content (canonical)

**When it runs:** Applied when a template part (e.g. the product-modal template part) renders, before the slug-specific `fluent_cart/template_part_content_{$slug}` filter and before `do_blocks()` parsing.

**Parameters:**

- `$content` (string): The raw template part block markup, before block parsing
- `$slug` (string): The template part's registered slug (e.g. `product_modal`)
- `$args` (array): Arguments passed to the template part renderer

**Returns:** `string` — the modified template part content

**Source:** `app/Modules/Templating/BlockTemplates/TemplateParts/ProductModalTemplatePart.php:245`

**Usage:**

```
add_filter('fluent_cart/template_part_content', function ($content, $slug, $args) {
    if ($slug === 'product_modal') {
        $content = '<div class="custom-wrapper">' . $content . '</div>';
    }
    return $content;
}, 10, 3);
```

### ` template_part_content_{slug} `

`fluent_cart/template_part_content_{$slug}` — Filter one template part's content by slug (canonical, DYNAMIC)

**When it runs:** Fires immediately after `fluent_cart/template_part_content` above, in the same render call, receiving the value that generic filter already returned. The `{$slug}` portion is replaced with the template part's own slug, so a listener can target one specific template part without checking `$slug` itself.

**Parameters:**

- `$content` (string): The template part content, already passed through `fluent_cart/template_part_content`
- `$args` (array): Arguments passed to the template part renderer

**Returns:** `string` — the modified content

**Source:** `app/Modules/Templating/BlockTemplates/TemplateParts/ProductModalTemplatePart.php:246`

**Usage:**

```
add_filter('fluent_cart/template_part_content_product_modal', function ($content, $args) {
    // Append a badge just to the product-modal template part
    $content .= '<span class="badge">New</span>';
    return $content;
}, 10, 2);
```

### ` template_part_output `

`fluent_cart/template_part_output` — Filter template part rendered output (canonical)

**When it runs:** Applied after a template part's block markup has been parsed with `do_blocks()`, and before the slug-specific `fluent_cart/template_part_output_{$slug}` filter.

**Parameters:**

- `$output` (string): The rendered HTML output of the template part
- `$slug` (string): The template part's registered slug
- `$args` (array): Arguments passed to the template part renderer

**Returns:** `string` — the modified output

**Source:** `app/Modules/Templating/BlockTemplates/TemplateParts/ProductModalTemplatePart.php:252`

**Usage:**

```
add_filter('fluent_cart/template_part_output', function ($output, $slug, $args) {
    // Minify whitespace in every template part's output
    return preg_replace('/\s+/', ' ', $output);
}, 10, 3);
```

### ` template_part_output_{slug} `

`fluent_cart/template_part_output_{$slug}` — Filter one template part's rendered output by slug (canonical, DYNAMIC)

**When it runs:** Fires immediately after `fluent_cart/template_part_output` above, in the same render call, receiving the already-filtered output. The `{$slug}` portion is replaced with the template part's own slug.

**Parameters:**

- `$output` (string): The rendered output, already passed through `fluent_cart/template_part_output`
- `$args` (array): Arguments passed to the template part renderer

**Returns:** `string` — the modified output

**Source:** `app/Modules/Templating/BlockTemplates/TemplateParts/ProductModalTemplatePart.php:253`

**Usage:**

```
add_filter('fluent_cart/template_part_output_product_modal', function ($output, $args) {
    return str_replace('<div class="fct-modal"', '<div class="fct-modal" data-tracking="true"', $output);
}, 10, 2);
```

### ` buttons/enable_floating_cart_button `

`fluent_cart/buttons/enable_floating_cart_button` — Filter floating cart button visibility

**When it runs:** This filter controls whether the floating cart button is displayed on the frontend.

**Parameters:**

- `$enabled` (bool): Whether the floating cart button is enabled (default `true`)

**Returns:**

- `$enabled` (bool): The modified value

**Source:** `app/Hooks/Cart/CartLoader.php:49`

**Usage:**

```
add_filter('fluent_cart/buttons/enable_floating_cart_button', function ($enabled) {
    // Disable floating cart on specific pages
    if (is_page('landing-page')) {
        return false;
    }
    return $enabled;
});
```

---

## Widgets & Dashboard

### ` {$widgetName} `

`fluent_cart/{$widgetName}` — Filter widget data by name (DYNAMIC)

**When it runs:** This dynamic filter is applied when a dashboard widget retrieves its data. The `{$widgetName}` is replaced with the specific widget name.

**Parameters:**

- `$widgetData` (mixed): The widget data returned by `widgetData()` method

**Returns:**

- `$widgetData` (mixed): The modified widget data

**Source:** `app/Services/Widgets/BaseWidget.php:16`

**Usage:**

```
add_filter('fluent_cart/revenue_widget', function ($widgetData) {
    // Add custom metric to revenue widget
    $widgetData['custom_metric'] = calculate_custom_metric();
    return $widgetData;
});
```

### ` widgets/{$filter} `

`fluent_cart/widgets/{$filter}` — Filter widget data by filter key (DYNAMIC)

**When it runs:** This dynamic filter is applied when retrieving widget data for a specific filter key in the widgets controller.

**Parameters:**

- `$result` (array): The widget result data (default `[]`)
- `$data` (array): The request data

**Returns:**

- `$result` (array): The modified widget data

**Source:** `WidgetsController.php:36`

**Usage:**

```
add_filter('fluent_cart/widgets/sales_overview', function ($result, $data) {
    $result['custom_chart'] = [
        'labels' => ['Jan', 'Feb', 'Mar'],
        'data'   => [100, 200, 150],
    ];
    return $result;
}, 10, 2);
```

### ` promo_gateways `

`fluent_cart/promo_gateways` — Filter promotional gateways

**When it runs:** This filter is applied when retrieving the list of promotional payment gateways shown in the admin.

**Parameters:**

- `$defaultGateways` (array): Array of default promotional gateways

**Returns:**

- `$defaultGateways` (array): The modified gateways array

**Source:** `PromoGatewaysHandler.php:36`

**Usage:**

```
add_filter('fluent_cart/promo_gateways', function ($gateways) {
    // Remove a promo gateway
    unset($gateways['example_gateway']);
    return $gateways;
});
```

### ` addon_gateways `

`fluent_cart/addon_gateways` — Filter addon payment gateways

**When it runs:** This filter is applied when retrieving the list of addon payment gateways.

**Parameters:**

- `$defaultGateways` (array): Array of default addon gateways

**Returns:**

- `$defaultGateways` (array): The modified gateways array

**Source:** `AddonGatewaysHandler.php:36`

**Usage:**

```
add_filter('fluent_cart/addon_gateways', function ($gateways) {
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

### ` {$filter}_list_filter_query `

`fluent_cart/{$filter}_list_filter_query` — Filter list filter query (DYNAMIC)

**When it runs:** This dynamic filter is applied when building database queries for filtered list pages (orders, customers, subscriptions, etc.). The `{$filter}` is replaced with the filter context name.

**Parameters:**

- `$query` (Builder): The Eloquent query builder instance

**Returns:**

- `$query` (Builder): The modified query builder

**Source:** `BaseFilter.php:962,971`

**Usage:**

```
add_filter('fluent_cart/orders_list_filter_query', function ($query) {
    // Only show orders from the last 30 days by default
    $query->where('created_at', '>=', gmdate('Y-m-d H:i:s', strtotime('-30 days')));
    return $query;
});
```

### ` {$filterName}_filter_options `

`fluent_cart/{$filterName}_filter_options` — Filter options for list page filters (DYNAMIC)

**When it runs:** This dynamic filter is applied when retrieving available filter options for admin list pages.

**Parameters:**

- `$options` (array): The filter options array

**Returns:**

- `$options` (array): The modified filter options

**Source:** `BaseFilter.php:995`

**Usage:**

```
add_filter('fluent_cart/orders_filter_options', function ($options) {
    // Add a custom filter option
    $options['custom_status'] = [
        'label'   => 'Custom Status',
        'type'    => 'select',
        'options' => ['pending_review' => 'Pending Review'],
    ];
    return $options;
});
```

### ` {$filterName}_table_columns `

`fluent_cart/{$filterName}_table_columns` — Filter table columns for list pages (DYNAMIC)

**When it runs:** This dynamic filter is applied when retrieving table column definitions for admin list pages.

**Parameters:**

- `$columns` (array): The table column definitions (default `[]`)

**Returns:**

- `$columns` (array): The modified columns array

**Source:** `BaseFilter.php:1038`

**Usage:**

```
add_filter('fluent_cart/orders_table_columns', function ($columns) {
    $columns['custom_field'] = [
        'label'    => 'Custom Field',
        'sortable' => true,
        'width'    => '120px',
    ];
    return $columns;
});
```

### ` advanced_filter_options_{$dataKey} `

`fluent_cart/advanced_filter_options_{$dataKey}` — Filter advanced filter options (DYNAMIC)

**When it runs:** This dynamic filter is applied when retrieving options for the advanced filter UI. The `{$dataKey}` is replaced with the specific data key.

**Parameters:**

- `$options` (array): The filter options

**Returns:**

- `$options` (array): The modified options

**Source:** `AdvanceFilterController.php:46`

**Usage:**

```
add_filter('fluent_cart/advanced_filter_options_payment_methods', function ($options) {
    $options[] = [
        'value' => 'custom_gateway',
        'label' => 'Custom Gateway',
    ];
    return $options;
});
```

### ` {filter}_allowed_scopes `

`fluent_cart/{$filterName}_allowed_scopes` — Filter the query scopes a list filter is allowed to apply (DYNAMIC)

**When it runs:** Applied inside `BaseFilter` when resolving the `scopes` requested on an admin list-filter query (orders, customers, subscriptions, etc.), before any of the requested scopes are applied to the underlying Eloquent query. The `{$filterName}` portion is replaced with the filter class's own registered name (e.g. `order_filter`), so a listener can add or remove scopes for one specific list without affecting the others.

**Parameters:**

- `$scopeMap` (array): The map of scope name => callable/definition allowed for this filter, as returned by the filter's own `allowedScopes()` method
- `$context` (array): Context data

```
$context = [
    'filter' => $this, // BaseFilter — the filter instance handling the request
];
```

**Returns:** `array` — the modified scope map

**Source:** `app/Services/Filter/BaseFilter.php:743`

**Usage:**

```
add_filter('fluent_cart/order_filter_allowed_scopes', function ($scopeMap, $context) {
    // Expose a custom "high_value" scope on the orders list filter
    $scopeMap['high_value'] = function ($query) {
        return $query->where('total', '>=', 50000); // cents
    };
    return $scopeMap;
}, 10, 2);
```

### ` {filter}_allowed_withs `

`fluent_cart/{$filterName}_allowed_withs` — Filter the relationships a list filter is allowed to eager-load (DYNAMIC)

**When it runs:** Applied inside `BaseFilter` when resolving the `with` relationships requested on an admin list-filter query, before any requested relationship is passed to the query's `with()` call. Any requested key that isn't present in the returned map is silently dropped, so this is also the gate that decides what a filter request is allowed to eager-load. The `{$filterName}` portion is replaced with the filter class's own registered name.

**Parameters:**

- `$withMap` (array): The map of relationship key => Eloquent relationship path allowed for this filter, as returned by the filter's own `allowedWiths()` method
- `$context` (array): Context data

```
$context = [
    'filter' => $this, // BaseFilter — the filter instance handling the request
];
```

**Returns:** `array` — the modified relationship map

**Source:** `app/Services/Filter/BaseFilter.php:724`

**Usage:**

```
add_filter('fluent_cart/order_filter_allowed_withs', function ($withMap, $context) {
    // Let the orders list filter eager-load a custom relation
    $withMap['loyalty_points'] = 'customer.loyaltyPoints';
    return $withMap;
}, 10, 2);
```

---

## Tracking & Attribution

### ` utm/internal_domains `

`fluent_cart/utm/internal_domains` — Filter the domains treated as "internal" for UTM/referrer attribution

**When it runs:** Applied in `UtmHelper::getInternalDomains()` whenever the internal-domain list is resolved for attribution tracking. Domains on this list are excluded when FluentCart decides whether a visit's referrer counts as an external traffic source, so multisite/multi-domain stores can avoid attributing sales to their own other domains.

**Parameters:**

- `$domains` (array): Extra internal domain names to add (default `[]`)

**Returns:** `array` — the domain list to treat as internal (non-string entries are dropped)

**Source:** `app/Helpers/UtmHelper.php:45`

**Usage:**

```
add_filter('fluent_cart/utm/internal_domains', function ($domains) {
    // Don't attribute sales to traffic arriving from our own docs subdomain
    $domains[] = 'docs.example.com';
    return $domains;
});
```

---

## Plugin Installer

### ` outside_addon/handle_cdn_install `

`fluent_cart/outside_addon/handle_cdn_install` — Filter CDN addon installation

**When it runs:** This filter is applied when attempting to install an addon from a CDN source. Return a non-null value to handle the installation yourself.

**Parameters:**

- `$result` (mixed): Installation result (default `null`)

**Returns:**

- `$result` (mixed): The installation result, or `null` to use default handling

**Source:** `BackgroundInstaller.php:143`

**Usage:**

```
add_filter('fluent_cart/outside_addon/handle_cdn_install', function ($result) {
    // Handle custom CDN addon installation
    if ($result === null) {
        // Perform custom installation logic
        return ['success' => true, 'message' => 'Installed from custom CDN'];
    }
    return $result;
});
```

### ` outside_addon/handle_install `

`fluent_cart/outside_addon/handle_install` — Filter external addon installation

**When it runs:** This filter is applied when installing an addon from an external source. Return a non-null value to handle the installation yourself.

**Parameters:**

- `$result` (mixed): Installation result (default `null`)

**Returns:**

- `$result` (mixed): The installation result, or `null` to use default handling

**Source:** `BackgroundInstaller.php:164`

**Usage:**

```
add_filter('fluent_cart/outside_addon/handle_install', function ($result) {
    // Handle custom external addon installation
    return ['success' => true, 'message' => 'Addon installed successfully'];
});
```

---

## Pro: E-Invoicing Pro

Pro Feature

E-invoicing hooks require FluentCart Pro to be installed and activated.

### ` einvoice/buyer_vat_id `

`fluent_cart/einvoice/buyer_vat_id` Pro — Filter the buyer VAT identifier written to the e-invoice

**When it runs:** Applied in `En16931InvoiceMapper` while mapping an order to an EN 16931 e-invoice, just before the resolved buyer VAT identifier (BT-48) is written to the invoice XML. Lets integrations normalize or override the value (e.g. strip or add a country prefix).

**Parameters:**

- `$buyerVatId` (string): The resolved buyer VAT identifier
- `$context` (array): Context data

```
$context = [
    'order' => $order, // \FluentCart\App\Models\Order — the order being invoiced
];
```

**Returns:**

- `string` — The buyer VAT identifier to write to the e-invoice

**Source:** `fluent-cart-pro/app/Services/Invoice/Mapper/En16931InvoiceMapper.php (line 154)`

**Usage:**

```
add_filter('fluent_cart/einvoice/buyer_vat_id', function ($buyerVatId, $context) {
    // Ensure the VAT ID carries the billing-country prefix
    $country = $context['order']->billing_address->country ?? '';
    if ($country && strpos($buyerVatId, $country) !== 0) {
        $buyerVatId = $country . $buyerVatId;
    }

    return $buyerVatId;
}, 10, 2);
```

### ` einvoice/tax_category `

`fluent_cart/einvoice/tax_category` Pro — Filter the derived EN 16931 VAT category for an e-invoice line

**When it runs:** Applied in `En16931InvoiceMapper` after the EN 16931 VAT category has been resolved for an invoice line (or shipping charge), before it is written to the XML. Reverse charge orders resolve to category `AE` (rate 0, VATEX-EU-AE); other lines resolve from the rate percent and exemption state. Lets regional add-ons map a line to a different category (e.g. force `E` with a VATEX reason). The filter must return the same array shape it received — a non-array return value is ignored and the resolved category is used.

**Parameters:**

- `$resolved` (array): The resolved VAT category data

```
$resolved = [
    'categoryCode'        => 'S',   // string — EN 16931 category code (e.g. 'S', 'Z', 'E', 'AE')
    'ratePercent'         => 19.0,  // float — VAT rate percent
    'exemptionReasonCode' => '',    // string — VATEX exemption reason code, if any
    'exemptionReasonText' => '',    // string — exemption reason text, if any
];
```

- `$context` (array): Context data

```
$context = [
    'order' => $order, // \FluentCart\App\Models\Order — the order being invoiced
    'line'  => $line,  // object|null — the order line item (null for e.g. shipping charges)
];
```

**Returns:**

- `array` — The VAT category data, same shape as `$resolved`

**Source:** `fluent-cart-pro/app/Services/Invoice/Mapper/En16931InvoiceMapper.php (line 357)`

**Usage:**

```
add_filter('fluent_cart/einvoice/tax_category', function ($resolved, $context) {
    // Force category E (exempt) for a specific product line
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

## Pro: Licensing API Pro

### ` license/checking_error `

`fluent_cart/license/checking_error` Pro — Filter license check error response

**When it runs:** This filter is applied when a license check encounters an error, allowing you to customize the error response.

**Parameters:**

- `$error` (array): The error response array

**Returns:**

- `$error` (array): The modified error response

**Source:** `LicenseApiHandler.php:45,56`

**Usage:**

```
add_filter('fluent_cart/license/checking_error', function ($error) {
    // Customize error message
    $error['message'] = 'Please contact support for license verification.';
    return $error;
});
```

### ` license/check_item_id `

`fluent_cart/license/check_item_id` Pro — Filter item ID validation during license check

**When it runs:** This filter controls whether the item ID should be validated during a license check API request.

**Parameters:**

- `$checkItemId` (bool): Whether to check the item ID (default `true`)

**Returns:**

- `$checkItemId` (bool): The modified value

**Source:** `LicenseApiHandler.php:54`

**Usage:**

```
add_filter('fluent_cart/license/check_item_id', function ($checkItemId) {
    // Skip item ID check for specific scenarios
    return false;
});
```

### ` license/check_license_response `

`fluent_cart/license/check_license_response` Pro — Filter license check API response

**When it runs:** This filter is applied to the license check API response before it is returned to the client.

**Parameters:**

- `$returnData` (array): The license check response data

**Returns:**

- `$returnData` (array): The modified response data

**Source:** `LicenseApiHandler.php:83`

**Usage:**

```
add_filter('fluent_cart/license/check_license_response', function ($returnData) {
    // Add custom data to the response
    $returnData['support_url'] = 'https://example.com/support';
    return $returnData;
});
```

### ` license/activate_license_response `

`fluent_cart/license/activate_license_response` Pro — Filter license activation API response

**When it runs:** This filter is applied to the license activation API response before it is returned to the client.

**Parameters:**

- `$returnData` (array): The activation response data

**Returns:**

- `$returnData` (array): The modified response data

**Source:** `LicenseApiHandler.php:170,274`

**Usage:**

```
add_filter('fluent_cart/license/activate_license_response', function ($returnData) {
    // Add activation timestamp
    $returnData['activated_at'] = gmdate('Y-m-d H:i:s');
    return $returnData;
});
```

### ` license/deactivate_license_response `

`fluent_cart/license/deactivate_license_response` Pro — Filter license deactivation API response

**When it runs:** This filter is applied to the license deactivation API response before it is returned to the client.

**Parameters:**

- `$returnData` (array): The deactivation response data

**Returns:**

- `$returnData` (array): The modified response data

**Source:** `LicenseApiHandler.php:356`

**Usage:**

```
add_filter('fluent_cart/license/deactivate_license_response', function ($returnData) {
    // Add deactivation notice
    $returnData['notice'] = 'License deactivated. You can reactivate on another site.';
    return $returnData;
});
```

### ` license/get_version_response `

`fluent_cart/license/get_version_response` Pro — Filter version check API response

**When it runs:** This filter is applied to the version check API response, allowing you to modify changelog or update information.

**Parameters:**

- `$changeLogData` (array): The version/changelog response data

**Returns:**

- `$changeLogData` (array): The modified response data

**Source:** `LicenseApiHandler.php:463`

**Usage:**

```
add_filter('fluent_cart/license/get_version_response', function ($changeLogData) {
    // Append custom changelog entry
    $changeLogData['sections']['changelog'] .= "\n* Custom patch applied";
    return $changeLogData;
});
```

---

## Pro: License Validation & Staging Pro

### ` fluent_cart_sl/is_local_site `

`fluent_cart_sl/is_local_site` Pro — Filter local/staging site detection

**When it runs:** This filter is applied when determining if the current site is a local or staging environment for licensing purposes.

**Parameters:**

- `$isLocal` (bool): Whether the site is detected as local
- `$context` (array): Context data

```
$context = [
    'url'  => 'https://staging.example.com',
    'site' => 'staging.example.com'
];
```

**Returns:**

- `$isLocal` (bool): The modified detection result

**Source:** `fluent-cart-pro/app/Modules/Licensing/Models/LicenseSite.php:69`

**Usage:**

```
add_filter('fluent_cart_sl/is_local_site', function ($isLocal, $context) {
    // Mark custom staging domains as local
    if (str_contains($context['url'], '.staging.')) {
        return true;
    }
    return $isLocal;
}, 10, 2);
```

### ` license/staging_subdomain_patterns `

`fluent_cart/license/staging_subdomain_patterns` Pro — Filter staging subdomain patterns

**When it runs:** This filter is applied when checking if a URL matches known staging subdomain patterns.

**Parameters:**

- `$patterns` (array): Array of subdomain patterns that indicate staging sites

**Returns:**

- `$patterns` (array): The modified patterns array

**Source:** `LicenseHelper.php:619`

**Usage:**

```
add_filter('fluent_cart/license/staging_subdomain_patterns', function ($patterns) {
    $patterns[] = 'dev-';
    $patterns[] = 'test-';
    return $patterns;
});
```

### ` license/staging_subfolder_patterns `

`fluent_cart/license/staging_subfolder_patterns` Pro — Filter staging subfolder patterns

**When it runs:** This filter is applied when checking if a URL matches known staging subfolder patterns.

**Parameters:**

- `$patterns` (array): Array of subfolder patterns that indicate staging sites

**Returns:**

- `$patterns` (array): The modified patterns array

**Source:** `LicenseHelper.php:620`

**Usage:**

```
add_filter('fluent_cart/license/staging_subfolder_patterns', function ($patterns) {
    $patterns[] = '/staging/';
    $patterns[] = '/test-site/';
    return $patterns;
});
```

### ` license/staging_domains `

`fluent_cart/license/staging_domains` Pro — Filter hosting provider staging domains

**When it runs:** This filter is applied when checking if a URL belongs to a known hosting provider's staging domain.

**Parameters:**

- `$domains` (array): Array of hosting provider staging domain patterns

**Returns:**

- `$domains` (array): The modified domains array

**Source:** `LicenseHelper.php:621`

**Usage:**

```
add_filter('fluent_cart/license/staging_domains', function ($domains) {
    $domains[] = 'mystaginghost.com';
    $domains[] = 'preview.myhost.io';
    return $domains;
});
```

### ` license/is_staging_site_result `

`fluent_cart/license/is_staging_site_result` Pro — Filter final staging site detection result

**When it runs:** This filter is applied after all staging detection checks, providing the final determination of whether a site is a staging environment.

**Parameters:**

- `$isStaging` (bool): Whether the site is detected as staging (default `false`)
- `$url` (string): The site URL being checked

**Returns:**

- `$isStaging` (bool): The modified staging detection result

**Source:** `LicenseHelper.php:657`

**Usage:**

```
add_filter('fluent_cart/license/is_staging_site_result', function ($isStaging, $url) {
    // Override staging detection for specific domains
    if (str_contains($url, 'mycompany-staging.com')) {
        return true;
    }
    return $isStaging;
}, 10, 2);
```

---

## Pro: License Configuration Pro

### ` license/validity_by_variation `

`fluent_cart/license/validity_by_variation` Pro — Filter license validity per variation

**When it runs:** This filter is applied when determining license validity settings for a specific product variation.

**Parameters:**

- `$validity` (array): The validity settings
- `$context` (array): Context data

```
$context = [
    'variation' => $variationModel
];
```

**Returns:**

- `$validity` (array): The modified validity settings

**Source:** `ProductLicenseController.php:74`

**Usage:**

```
add_filter('fluent_cart/license/validity_by_variation', function ($validity, $context) {
    // Set custom validity for premium variations
    $variation = $context['variation'];
    if ($variation->slug === 'premium') {
        $validity['duration'] = 365;
        $validity['unit']     = 'days';
    }
    return $validity;
}, 10, 2);
```

### ` licensing/delete_license_on_order_deleted `

`fluent_cart/licensing/delete_license_on_order_deleted` Pro — Filter whether to delete license when order is deleted

**When it runs:** This filter controls whether associated licenses should be deleted when an order is deleted.

**Parameters:**

- `$delete` (bool): Whether to delete the license (default `true`)

**Returns:**

- `$delete` (bool): The modified value

**Source:** `license-actions.php:117`

**Usage:**

```
add_filter('fluent_cart/licensing/delete_license_on_order_deleted', function ($delete) {
    // Preserve licenses even when orders are deleted
    return false;
});
```

### ` licensing/revoke_license_on_payment_failed `

`fluent_cart/licensing/revoke_license_on_payment_failed` Pro — Filter whether to revoke license on payment failure

**When it runs:** This filter controls whether a license should be revoked when a payment fails.

**Parameters:**

- `$revoke` (bool): Whether to revoke the license (default `true`)

**Returns:**

- `$revoke` (bool): The modified value

**Source:** `LicenseGenerationHandler.php:123`

**Usage:**

```
add_filter('fluent_cart/licensing/revoke_license_on_payment_failed', function ($revoke) {
    // Give a grace period instead of immediate revocation
    return false;
});
```

### ` licensing/license_create_data `

`fluent_cart/licensing/license_create_data` Pro — Filter license creation data

**When it runs:** This filter is applied when constructing the data for a new license before it is saved to the database.

**Parameters:**

- `$data` (array): The license creation data
- `$context` (array): Context data

```
$context = [
    'order'        => $orderModel,
    'variation'    => $variationModel,
    'subscription' => $subscriptionModel
];
```

**Returns:**

- `$data` (array): The modified license data

**Source:** `LicenseGenerationHandler.php:521`

**Usage:**

```
add_filter('fluent_cart/licensing/license_create_data', function ($data, $context) {
    // Set custom activation limit based on variation
    $variation = $context['variation'];
    if ($variation->slug === 'enterprise') {
        $data['activation_limit'] = 100;
    }
    return $data;
}, 10, 2);
```

### ` license/expiration_date_by_variation `

`fluent_cart/license/expiration_date_by_variation` Pro — Filter license expiration date

**When it runs:** This filter is applied when calculating the license expiration date for a specific product variation.

**Parameters:**

- `$timestamp` (int|false): The expiration timestamp, or `false` for no expiration
- `$context` (array): Context data

```
$context = [
    'variation'  => $variationModel,
    'trial_days' => 14
];
```

**Returns:**

- `$timestamp` (int|false): The modified expiration timestamp

**Source:** `LicenseHelper.php:81`

**Usage:**

```
add_filter('fluent_cart/license/expiration_date_by_variation', function ($timestamp, $context) {
    // Add extra 30 days for trial users
    if ($context['trial_days'] > 0 && $timestamp) {
        return $timestamp + (30 * DAY_IN_SECONDS);
    }
    return $timestamp;
}, 10, 2);
```

### ` license/default_validity_by_variation `

`fluent_cart/license/default_validity_by_variation` Pro — Filter default license validity

**When it runs:** This filter is applied when retrieving the default license validity settings for a product variation.

**Parameters:**

- `$validity` (array): The default validity settings

```
$validity = [
    'unit'  => 'years',
    'value' => 1
];
```

- `$context` (array): Context data

```
$context = [
    'variation' => $variationModel
];
```

**Returns:**

- `$validity` (array): The modified validity settings

**Source:** `LicenseHelper.php:418`

**Usage:**

```
add_filter('fluent_cart/license/default_validity_by_variation', function ($validity, $context) {
    // Set lifetime validity for specific variations
    $variation = $context['variation'];
    if ($variation->slug === 'lifetime') {
        return ['unit' => 'years', 'value' => 100];
    }
    return $validity;
}, 10, 2);
```

### ` license/grace_period_in_days `

`fluent_cart/license/grace_period_in_days` Pro — Filter license grace period

**When it runs:** This filter controls the number of grace period days after a license expires before it is fully revoked.

**Parameters:**

- `$days` (int): The grace period in days (default `15`)

**Returns:**

- `$days` (int): The modified grace period

**Source:** `LicenseHelper.php:687`

**Usage:**

```
add_filter('fluent_cart/license/grace_period_in_days', function ($days) {
    // Extend grace period to 30 days
    return 30;
});
```

### ` fluent_cart_sl/generate_license_key `

`fluent_cart_sl/generate_license_key` Pro — Filter license key generation

**When it runs:** This filter is applied when generating a new license key, allowing you to customize the key format.

**Parameters:**

- `$key` (string): The generated license key (MD5 hash by default)
- `$context` (array): Context data

```
$context = [
    'data' => $licenseData
];
```

**Returns:**

- `$key` (string): The modified license key

**Source:** `UUID.php:32`

**Usage:**

```
add_filter('fluent_cart_sl/generate_license_key', function ($key, $context) {
    // Use a formatted license key
    $key = strtoupper($key);
    return implode('-', str_split($key, 8));
}, 10, 2);
```

### ` fluent_cart_sl/issue_license_data `

`fluent_cart_sl/issue_license_data` Pro — Filter license issue data

**When it runs:** This filter is applied to license data when issuing a new license through the license manager.

**Parameters:**

- `$data` (array): The license issue data

**Returns:**

- `$data` (array): The modified license data

**Source:** `LicenseManager.php:257`

**Usage:**

```
add_filter('fluent_cart_sl/issue_license_data', function ($data) {
    // Set default activation limit
    if (empty($data['activation_limit'])) {
        $data['activation_limit'] = 5;
    }
    return $data;
});
```

---

## Pro: Plugin Updater Pro

### ` fluent_sl/api_request_query_params `

`fluent_sl/api_request_query_params` Pro — Filter API request query parameters

**When it runs:** This filter is applied when building query parameters for license API requests (update checks, activations, etc.).

**Parameters:**

- `$params` (array): The query parameters array

**Returns:**

- `$params` (array): The modified query parameters

**Source:** `PluginUpdater.php:234`

**Usage:**

```
add_filter('fluent_sl/api_request_query_params', function ($params) {
    // Add custom tracking parameter
    $params['php_version'] = phpversion();
    $params['wp_version']  = get_bloginfo('version');
    return $params;
});
```

### ` fluent_sl/updater_payload_{$slug} `

`fluent_sl/updater_payload_{$slug}` Pro — Filter update check payload (DYNAMIC)

**When it runs:** This dynamic filter is applied to the update check payload for a specific plugin slug. The `{$slug}` is replaced with the plugin's slug.

**Parameters:**

- `$payload` (array): The update check payload

**Returns:**

- `$payload` (array): The modified payload

**Source:** `PluginUpdater.php:251`

**Usage:**

```
add_filter('fluent_sl/updater_payload_fluent-cart-pro', function ($payload) {
    // Add environment info to update payload
    $payload['server_software'] = $_SERVER['SERVER_SOFTWARE'] ?? 'unknown';
    return $payload;
});
```

---
