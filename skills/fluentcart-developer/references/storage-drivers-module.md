# Storage Drivers Module & Custom Storage Providers

Comprehensive developer reference for FluentCart's digital product storage abstraction layer (`app/Modules/StorageDrivers/`). Covers built-in drivers (Local, S3, Bunny, Cloudflare R2), signed download URLs, and implementing custom storage drivers.

Based on the official FluentCart developer specification (`dev.fluentcart.com/modules/storage.html`).

---

## Architecture Overview

FluentCart separates downloadable file metadata from physical file storage using a driver pattern:
- **`BaseStorageDriver`** — Abstract base class defining driver configuration, UI settings schema, and validation.
- **`BaseStorageInterface`** — Required operations: upload, download, delete, signed URL generation, and bucket connection verification.
- **`FileManager`** — Central service coordinating file operations across active drivers.

### Built-in Storage Providers
1. **Local Storage** (`FluentCart\App\Modules\StorageDrivers\Local\Local`) — Default driver storing protected files under `wp-content/uploads/fluent-cart/`.
2. **Amazon S3** (`FluentCart\App\Modules\StorageDrivers\S3\S3`) — Direct S3 bucket storage with AWS SDK credentials.
3. **Cloudflare R2 & Bunny Storage** — S3-compatible cloud storage drivers.

---

## 1. Creating a Custom Storage Driver

To integrate an external cloud provider (e.g. Backblaze B2, Google Cloud Storage, or Wasabi), extend `BaseStorageDriver` and implement `BaseStorageInterface`:

```php
<?php
namespace MyAddon\StorageDrivers;

defined('ABSPATH') || exit;

use FluentCart\App\Modules\StorageDrivers\BaseStorageDriver;
use FluentCart\App\Modules\StorageDrivers\BaseStorageInterface;

class WasabiStorageDriver extends BaseStorageDriver implements BaseStorageInterface
{
    public function __construct()
    {
        parent::__construct(
            __('Wasabi Cloud', 'my-addon'), // Display Title
            'wasabi',                       // Unique Driver Slug
            '#00c48c'                       // Brand Color
        );
    }

    public function getDescription(): string
    {
        return esc_html__('Store downloadable product files in Wasabi Hot Cloud Storage.', 'my-addon');
    }

    public function getSettingsFields(): array
    {
        return [
            'access_key' => [
                'type'        => 'text',
                'label'       => __('Access Key', 'my-addon'),
                'required'    => true,
                'placeholder' => 'Enter Wasabi Access Key'
            ],
            'secret_key' => [
                'type'        => 'password',
                'label'       => __('Secret Key', 'my-addon'),
                'required'    => true
            ],
            'bucket_name' => [
                'type'        => 'text',
                'label'       => __('Bucket Name', 'my-addon'),
                'required'    => true
            ],
            'region' => [
                'type'        => 'select',
                'label'       => __('Wasabi Region', 'my-addon'),
                'options'     => [
                    'us-east-1' => 'US East (N. Virginia)',
                    'eu-central-1' => 'EU Central (Frankfurt)'
                ],
                'default'     => 'us-east-1'
            ]
        ];
    }

    public function checkConnection(): bool
    {
        $settings = $this->getSettings();
        // Test credentials by making a lightweight headBucket request
        return !empty($settings['access_key']) && !empty($settings['secret_key']);
    }

    public function uploadFile(array $fileData, string $remotePath): array
    {
        // 1. Upload file binary to Wasabi bucket
        // 2. Return standard file descriptor array
        return [
            'file_name' => basename($remotePath),
            'file_path' => $remotePath,
            'file_size' => filesize($fileData['tmp_name']),
            'driver'    => 'wasabi'
        ];
    }

    public function getSignedDownloadUrl(string $remotePath, int $expirySeconds = 3600): string
    {
        // Generate pre-signed URL expiring after $expirySeconds
        return 'https://s3.wasabisys.com/' . $this->getSettings()['bucket_name'] . '/' . ltrim($remotePath, '/');
    }

    public function deleteFile(string $remotePath): bool
    {
        // Delete object from bucket
        return true;
    }
}
```

---

## 2. Registering the Custom Driver

Hook into the `fluent_cart/storage_drivers` filter on `fluent_cart/loaded`:

```php
add_action('fluent_cart/loaded', function () {
    add_filter('fluent_cart/storage_drivers', function (array $drivers): array {
        $drivers['wasabi'] = new \MyAddon\StorageDrivers\WasabiStorageDriver();
        return $drivers;
    });
});
```

---

## 3. Storage Filter Hooks Reference

| Hook Name | Type | Arguments | Description |
|---|---|---|---|
| `fluent_cart/storage_drivers` | Filter | `$drivers` (array) | Register custom storage driver instances. |
| `fluent_cart/storage/storage_settings_before_update_{slug}` | Filter | `$settings`, `$slug` | Sanitize and encrypt credentials before saving driver settings. |
| `fluent_cart/storage/settings_response_{slug}` | Filter | `$response`, `$slug` | Mask sensitive API keys and secrets when sending settings to the admin SPA. |
| `fluent_cart/local_file_blocked_extensions` | Filter | `$blockedExtensions` (array) | Prevent dangerous files (`.php`, `.exe`, `.sh`) in local downloadable directories. |
