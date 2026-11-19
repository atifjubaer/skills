# POST Create Product

## `POST /products`

**POST Create Product**

Create a new product. A default variation is automatically created with the product.

**Required permission:** `products/create`

- **operationId:** `createProduct`
- **tags:** Products

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "post_title"
  ],
  "properties": {
    "post_title": {
      "type": "string",
      "description": "Product title (max 200 characters)"
    },
    "post_status": {
      "type": "string",
      "description": "Post status",
      "enum": [
        "draft",
        "publish"
      ]
    },
    "detail": {
      "type": "object",
      "properties": {
        "fulfillment_type": {
          "type": "string",
          "enum": [
            "physical",
            "digital"
          ],
          "description": "Fulfillment type (default: digital)"
        },
        "other_info": {
          "type": "object",
          "properties": {
            "is_bundle_product": {
              "type": "string",
              "enum": [
                "yes",
                "no"
              ],
              "description": "Whether this is a bundle product (default: no)"
            }
          }
        }
      }
    }
  },
  "example": {
    "post_title": "New Digital Product",
    "post_status": "draft",
    "detail": {
      "fulfillment_type": "digital"
    }
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
