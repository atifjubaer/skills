# POST Toggle Product Tax Exempt

## `POST /products/{postId}/tax-exempt`

**POST Toggle Product Tax Exempt**

Set the tax-exempt flag and tax class for an entire product (stored on the product detail, not per-variant). If `tax_class` is omitted, the product's existing tax class (or `standard`) is kept. The resolved tax class ID (not the slug) is stored on the product.

**Required permission:** `products/edit`

- **operationId:** `toggleTaxExempt`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `postId` | path | yes | integer | Product post ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "tax_exempt": {
      "type": "string",
      "enum": [
        "yes",
        "no"
      ],
      "description": "Whether the product is exempt from tax. Defaults to 'no'."
    },
    "tax_class": {
      "type": "string",
      "description": "Slug of an existing tax class. Defaults to the product's current tax class, or 'standard'."
    }
  },
  "example": {
    "tax_exempt": "yes",
    "tax_class": "standard"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Product tax settings updated. |
| `400` | Product not found. |
| `401` | Authentication required. |
| `403` | The current user lacks the products/edit permission. |
| `422` | The supplied tax_class does not exist. |
