# PUT Update Variation Pricing Table

## `PUT /products/variants/{variantId}/pricing-table`

**PUT Update Variation Pricing Table**

Update the pricing table description for a variation.

**Required permission:** `products/edit`

- **operationId:** `updateVariationPricingTable`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `variantId` | path | yes | integer | The variation ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "description"
  ],
  "properties": {
    "description": {
      "type": "string",
      "description": "Pricing table description text (newlines preserved)"
    }
  },
  "example": {
    "description": "Includes:\n- Feature A\n- Feature B\n- Priority Support"
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
