# POST Duplicate Product

## `POST /products/{productId}/duplicate`

**POST Duplicate Product**

Duplicate a product with options to include or exclude certain settings. The new product is saved as a draft.

**Required permission:** `products/create`

- **operationId:** `duplicateProduct`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `productId` | path | yes | integer | The product ID to duplicate |

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "import_stock_management": {
      "type": "string",
      "description": "Include stock management settings (true/false)"
    },
    "import_license_settings": {
      "type": "string",
      "description": "Include license settings (true/false)"
    },
    "import_downloadable_files": {
      "type": "string",
      "description": "Include downloadable files (true/false)"
    }
  },
  "example": {
    "import_stock_management": "true",
    "import_license_settings": "true",
    "import_downloadable_files": "false"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/create`). |
| `422` | Validation failed, or the referenced record does not exist. |
