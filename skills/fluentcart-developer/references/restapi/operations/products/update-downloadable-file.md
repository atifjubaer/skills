# PUT Update Downloadable File

## `PUT /products/{downloadableId}/update`

**PUT Update Downloadable File**

Update an existing downloadable file record.

**Required permission:** `products/edit`

- **operationId:** `updateDownloadableFile`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `downloadableId` | path | yes | integer | The downloadable file ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "title",
    "type",
    "driver",
    "file_name"
  ],
  "properties": {
    "title": {
      "type": "string",
      "description": "File title (max 100 chars)"
    },
    "type": {
      "type": "string",
      "description": "File type (max 100 chars)"
    },
    "driver": {
      "type": "string",
      "description": "Storage driver (max 100 chars)"
    },
    "file_name": {
      "type": "string",
      "description": "File name (max 100 chars)"
    },
    "product_variation_id": {
      "type": "array",
      "items": {
        "type": "integer"
      },
      "description": "Array of variation IDs"
    },
    "serial": {
      "type": "integer",
      "description": "Display order serial"
    },
    "settings": {
      "type": "object",
      "properties": {
        "download_limit": {
          "type": "integer",
          "description": "Maximum downloads allowed"
        },
        "download_expiry": {
          "type": "integer",
          "description": "Download expiry in days"
        }
      }
    }
  },
  "example": {
    "title": "Software v2.0",
    "type": "zip",
    "driver": "local",
    "file_name": "software-v2.zip",
    "product_variation_id": [
      456,
      457
    ],
    "settings": {
      "download_limit": 10
    }
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
