# Files API

Upload, manage, list, and delete downloadable product files across local and cloud storage drivers (S3, Bunny, R2), and upload image assets to the WordPress Media Library for the rich text editor in FluentCart.

**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2`  
**Policies:** `StoreSensitivePolicy` (File Management) / `AdminPolicy` (Editor Uploads)

---

## Endpoints Overview

| Group | Method | Endpoint | Permission / Policy | Description |
|-------|--------|----------|--------------------|-------------|
| **File Management** | GET | `/files` | `store/sensitive` (`StoreSensitivePolicy`) | List files from specified storage driver |
| | POST | `/files/upload` | `store/sensitive` (`StoreSensitivePolicy`) | Upload downloadable file (`multipart/form-data`) |
| | GET | `/files/bucket-list` | `store/sensitive` (`StoreSensitivePolicy`) | Retrieve available storage buckets for driver |
| | DELETE | `/files/delete` | `store/sensitive` (`StoreSensitivePolicy`) | Delete file from storage (`manage_options` for local) |
| **Editor Uploads** | POST | `/upload-editor-file` | `is_super_admin` (`AdminPolicy`) | Upload image to WP Media Library for description editor |

---

## File Management

Manage digital downloadable product files across active storage drivers (local filesystem, Amazon S3, DigitalOcean Spaces, Cloudflare R2, etc.).

**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2/files`  
**Policy:** `StoreSensitivePolicy` | **Permission:** `store/sensitive`

### List Files

`GET /fluent-cart/v2/files`

Retrieve a paginated list of files stored under the specified driver.

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `driver` | string | query | No | Storage driver key (default: `local`). Supported values depend on active drivers |
| `search` | string | query | No | Case-insensitive substring search filter |
| `per_page` | integer | query | No | Maximum number of files to return (default: 10) |

#### Response

```json
{
  "files": [
    {
      "name": "ebook__fluent-cart__.1710345600.pdf",
      "size": 2048576,
      "driver": "local",
      "bucket": ""
    },
    {
      "name": "software-v2__fluent-cart__.1710345700.zip",
      "size": 10485760,
      "driver": "local",
      "bucket": ""
    }
  ]
}
```

#### Example

```bash
curl -X GET "https://example.com/wp-json/fluent-cart/v2/files?driver=local&search=ebook&per_page=20" \
  -u "username:app_password"
```

---

### Upload File

`POST /fluent-cart/v2/files/upload`

Upload a downloadable file. Files are assigned a unique timestamp suffix (`name__fluent-cart__.1710345600.ext`) to prevent name collisions.

**Content-Type:** `multipart/form-data`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `file` | file | body | Yes | File binary data to upload |
| `name` | string | body | Yes | Display name for the file (max 160 chars). File extension is appended automatically |
| `driver` | string | body | No | Storage driver key (default: `local`) |

> **Blocked Extensions (Local Driver):**  
> The local driver blocks executable/script file types by default: `php`, `phtml`, `html`, `htm`, `svg`, `exe`, `sh`, `bat`, `cmd`, `dll`.  
> *Customizable via filter hook:* `fluent_cart/local_file_blocked_extensions`.

#### Response

```json
{
  "message": "File Uploaded Successfully",
  "path": "my-ebook__fluent-cart__.1710345600.pdf",
  "file": {
    "driver": "local",
    "size": 2048576,
    "name": "my-ebook__fluent-cart__.1710345600.pdf",
    "bucket": ""
  }
}
```

#### Error Response

```json
{
  "message": "Failed To Upload File",
  "additional": "File is empty"
}
```

#### Example

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/files/upload" \
  -u "username:app_password" \
  -F "file=@/path/to/ebook.pdf" \
  -F "name=my-ebook" \
  -F "driver=local"
```

---

### Get Bucket List

`GET /fluent-cart/v2/files/bucket-list`

Retrieve available storage buckets for cloud storage drivers (e.g. S3, R2).

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `driver` | string | query | No | Storage driver key (default: uses the first active driver) |

#### Response

```json
{
  "default_bucket": "my-store-files",
  "buckets": [
    {
      "label": "my-store-files",
      "value": "my-store-files"
    },
    {
      "label": "my-store-backups",
      "value": "my-store-backups"
    }
  ]
}
```

---

### Delete File

`DELETE /fluent-cart/v2/files/delete`

Delete a file from the specified storage driver.

> **Permission Note (Local Driver):** Deleting files from the local driver requires the WordPress `manage_options` administrator capability.

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `file_path` | string | query | Yes | Relative file path in storage directory |
| `driver` | string | query | Yes | Storage driver key (e.g., `local`, `s3`) |
| `bucket` | string | query | No | Bucket name (required for cloud storage drivers) |

#### Response

```json
{
  "message": "File Deleted Successfully",
  "driver": "local",
  "path": "my-ebook__fluent-cart__.1710345600.pdf"
}
```

#### Error Responses

```json
{
  "message": "File not found"
}
```

```json
{
  "message": "You are not allowed to delete file"
}
```

#### Example

```bash
curl -X DELETE "https://example.com/wp-json/fluent-cart/v2/files/delete?file_path=my-ebook__fluent-cart__.1710345600.pdf&driver=local" \
  -u "username:app_password"
```

---

## Editor File Upload

Upload images to the WordPress Media Library for product description block editors.

**Prefix:** `/fluent-cart/v2/upload-editor-file` | **Policy:** `AdminPolicy` | **Permission:** `is_super_admin`  
**Content-Type:** `multipart/form-data`

### Upload Editor File

`POST /fluent-cart/v2/upload-editor-file`

Uploads an image file to the WordPress Media Library via `media_handle_upload`. Only valid image MIME types are allowed (`image/jpeg`, `image/png`, `image/gif`, `image/webp`).

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `file` | file | body | Yes | Image binary file to upload |

#### Response

Returns standard WordPress attachment payload prepared via `wp_prepare_attachment_for_js`.

```json
{
  "id": 456,
  "title": "product-banner",
  "filename": "product-banner.jpg",
  "url": "https://example.com/wp-content/uploads/2025/01/product-banner.jpg",
  "link": "https://example.com/?attachment_id=456",
  "alt": "",
  "author": "1",
  "description": "",
  "caption": "",
  "name": "product-banner",
  "status": "inherit",
  "uploadedTo": 0,
  "date": "2025-01-15T12:00:00.000Z",
  "modified": "2025-01-15T12:00:00.000Z",
  "menuOrder": 0,
  "mime": "image/jpeg",
  "type": "image",
  "subtype": "jpeg",
  "icon": "https://example.com/wp-includes/images/media/default.png",
  "dateFormatted": "January 15, 2025",
  "nonces": {},
  "editLink": "https://example.com/wp-admin/post.php?post=456&action=edit",
  "meta": false,
  "authorName": "admin",
  "authorLink": "https://example.com/wp-admin/profile.php",
  "filesizeInBytes": 204800,
  "filesizeHumanReadable": "200 KB",
  "sizes": {
    "thumbnail": {
      "url": "https://example.com/wp-content/uploads/2025/01/product-banner-150x150.jpg",
      "height": 150,
      "width": 150
    },
    "medium": {
      "url": "https://example.com/wp-content/uploads/2025/01/product-banner-300x200.jpg",
      "height": 200,
      "width": 300
    },
    "full": {
      "url": "https://example.com/wp-content/uploads/2025/01/product-banner.jpg",
      "height": 800,
      "width": 1200
    }
  },
  "height": 800,
  "width": 1200
}
```

#### Example

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/upload-editor-file" \
  -u "username:app_password" \
  -F "file=@/path/to/product-banner.jpg"
```
