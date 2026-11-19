# POST Reorder Payment Methods

## `POST /settings/payment-methods/reorder`

**POST Reorder Payment Methods**

Set the display order of payment methods on the checkout page.

**Required permission:** `is_super_admin`

- **operationId:** `reorderPaymentMethods`
- **tags:** Settings

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "order"
  ],
  "properties": {
    "order": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Ordered array of payment method keys.",
      "example": [
        "stripe",
        "paypal",
        "cod"
      ]
    }
  },
  "example": {
    "order": [
      "stripe",
      "paypal",
      "cod"
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`is_super_admin`). |
| `422` | Validation failed, or the referenced record does not exist. |
