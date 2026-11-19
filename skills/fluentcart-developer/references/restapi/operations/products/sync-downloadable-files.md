# POST Sync Downloadable Files

## `POST /products/{postId}/sync-downloadable-files`

**POST Sync Downloadable Files**

Attach multiple downloadable files to a product. Automatically enables the manage_downloadable flag.

**Required permission:** `products/edit`

- **operationId:** `syncDownloadableFiles`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `postId` | path | yes | integer | The product post ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "downloadable_files"
  ],
  "properties": {
    "downloadable_files": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "title",
          "type",
          "driver",
          "file_name",
          "file_path",
          "file_url"
        ],
        "properties": {
          "title": {
            "type": "string",
            "description": "File title (max 160 chars)"
          },
          "type": {
            "type": "string",
            "description": "File type (max 100 chars)"
          },
          "driver": {
            "type": "string",
            "description": "Storage driver (e.g., local, s3)"
          },
          "file_name": {
            "type": "string",
            "description": "File name (max 185 chars)"
          },
          "file_path": {
            "type": "string",
            "description": "File path (max 185 chars)"
          },
          "file_url": {
            "type": "string",
            "description": "File URL (max 200 chars)"
          },
          "bucket": {
            "type": "string",
            "description": "Storage bucket name"
          },
          "file_size": {
            "type": "string",
            "description": "File size"
          },
          "serial": {
            "type": "integer",
            "description": "Display order serial"
          },
          "product_variation_id": {
            "type": "array",
            "items": {
              "type": "integer"
            },
            "description": "Variation IDs this file is associated with"
          },
          "settings": {
            "type": "object",
            "properties": {
              "download_limit": {
                "type": "integer",
                "description": "Maximum number of downloads allowed"
              },
              "download_expiry": {
                "type": "integer",
                "description": "Download expiry in days"
              }
            }
          }
        }
      }
    }
  },
  "example": {
    "postId": 123,
    "downloadable_files": [
      {
        "title": "Software v1.0",
        "type": "zip",
        "driver": "local",
        "file_name": "software-v1.zip",
        "file_path": "software-v1.zip",
        "file_url": "software-v1.zip",
        "product_variation_id": [
          456
        ],
        "settings": {
          "download_limit": 5,
          "download_expiry": 365
        }
      }
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/edit`). |
| `422` | Validation failed, or the referenced record does not exist. |
