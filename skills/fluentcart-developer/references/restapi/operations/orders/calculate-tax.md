# POST Calculate Order Tax

## `POST /orders/calculate-tax`

**POST Calculate Order Tax**

Calculate tax for an admin-created order given a destination address and a list of line items. This is a pure calculation helper — no database writes occur and no order is created or modified. Up to 100 items are processed per request; any beyond that are silently dropped. If tax calculation isn't available for the given address, all totals are returned as zero.

**Required permissions:** any one of `orders/create`, `orders/manage`

- **operationId:** `calculateTax`
- **tags:** Orders

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "country": {
      "type": "string",
      "description": "Destination country code (e.g. US)."
    },
    "state": {
      "type": "string",
      "description": "Destination state/province code."
    },
    "city": {
      "type": "string",
      "description": "Destination city."
    },
    "postcode": {
      "type": "string",
      "description": "Destination postal/zip code."
    },
    "items": {
      "type": "array",
      "description": "Line items to calculate tax for. Capped at 100 items per request.",
      "items": {
        "type": "object",
        "properties": {
          "post_id": {
            "type": "integer",
            "description": "Product post ID."
          },
          "object_id": {
            "type": "integer",
            "description": "Variation/object ID."
          },
          "subtotal": {
            "type": "integer",
            "description": "Line subtotal in cents."
          },
          "discount_total": {
            "type": "integer",
            "description": "Discount applied to the line, in cents."
          },
          "shipping_charge": {
            "type": "integer",
            "description": "Shipping charge attributed to the line, in cents."
          },
          "quantity": {
            "type": "integer",
            "description": "Line quantity. Minimum 1."
          }
        }
      }
    }
  },
  "example": {
    "country": "US",
    "state": "CA",
    "city": "Springfield",
    "postcode": "62704",
    "items": [
      {
        "post_id": 123,
        "object_id": 456,
        "subtotal": 9900,
        "discount_total": 0,
        "shipping_charge": 0,
        "quantity": 1
      }
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns calculated tax totals. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
