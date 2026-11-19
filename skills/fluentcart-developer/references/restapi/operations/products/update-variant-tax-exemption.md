# POST Update Variant Tax Settings

## `POST /products/variants/{variantId}/tax-exempt`

**POST Update Variant Tax Settings**

Set the tax-exempt flag and tax class for a single product variant. If `tax_class` is omitted, the variant's existing tax class (or `standard` if none is set) is kept. The supplied tax class must already exist.

**Required permission:** `products/edit`

- **operationId:** `updateTaxSettings`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `variantId` | path | yes | integer | Product variation ID |

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
      "description": "Whether the variant is exempt from tax. Defaults to 'no'."
    },
    "tax_class": {
      "type": "string",
      "description": "Slug of an existing tax class. Defaults to the variant's current tax class, or 'standard'."
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
| `200` | Variant tax settings updated. |
| `400` | Variant not found. |
| `401` | Authentication required. |
| `403` | The current user lacks the products/edit permission. |
| `422` | The supplied tax_class does not exist. |
