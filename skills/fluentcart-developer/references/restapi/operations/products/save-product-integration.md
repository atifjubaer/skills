# POST Save Product Integration

## `POST /products/{product_id}/integrations`

**POST Save Product Integration**

Create or update an integration feed for a product.

**Also used by the integrations UI.** Create a new product-level integration feed or update an existing one. Validates required fields and associates the feed with the specified product.

**Required permission:** `products/edit`

- **operationId:** `saveProductIntegration`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `product_id` | path | yes | integer | The product ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "integration_name",
    "integration"
  ],
  "properties": {
    "integration_name": {
      "type": "string",
      "description": "Integration provider name"
    },
    "integration_id": {
      "type": "integer",
      "description": "Existing feed ID (for updates)"
    },
    "integration": {
      "type": "string",
      "description": "JSON-encoded integration settings object"
    }
  },
  "example": {
    "integration_name": "fluentcrm",
    "integration": "{\"name\":\"Add to List\",\"list_id\":1,\"enabled\":\"yes\"}"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/edit`). |
| `404` | Product not found |
| `422` | Validation error |
