# POST Check Product Eligibility

## `POST /coupons/checkProductEligibility`

**POST Check Product Eligibility**

Check whether a product is eligible for a set of applied coupons. This is used in the order form to validate that adding a product does not conflict with currently applied coupons.

**Required permissions:** all of `orders/create`, `orders/manage`

- **operationId:** `checkProductEligibility`
- **tags:** Coupons

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "productId"
  ],
  "properties": {
    "productId": {
      "type": "integer",
      "description": "The product (post) ID to check eligibility for"
    },
    "appliedCoupons": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Array of coupon codes currently applied. Each code is checked against the product's categories and the coupon's inclusion/exclusion rules."
    },
    "origin": {
      "type": "string",
      "description": "The context where the check originates (e.g., checkout, admin_order)"
    }
  },
  "example": {
    "productId": 123,
    "appliedCoupons": [
      "WELCOME20",
      "SUMMER15"
    ],
    "origin": "admin_order"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Eligibility check result. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/create, orders/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
