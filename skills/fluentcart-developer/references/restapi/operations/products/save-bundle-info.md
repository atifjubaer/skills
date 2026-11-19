# POST Save Bundle Info

## `POST /products/save-bundle-info/{variationId}`

**POST Save Bundle Info**

Save bundle child variant IDs for a variation. Bundle products cannot be added as children of other bundles.

**Required permission:** `products/edit`

- **operationId:** `saveBundleInfo`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `variationId` | path | yes | integer | The variation ID to configure as a bundle |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "bundle_child_ids"
  ],
  "properties": {
    "bundle_child_ids": {
      "type": "array",
      "items": {
        "type": "integer"
      },
      "description": "Array of child variation IDs"
    }
  },
  "example": {
    "bundle_child_ids": [
      101,
      102,
      103
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
