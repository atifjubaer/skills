# PUT Update Coupon

## `PUT /coupons/{id}`

**PUT Update Coupon**

Update an existing coupon. Accepts the same fields as Create Coupon. The code uniqueness check excludes the current coupon.

**Required permission:** `coupons/manage`

- **operationId:** `updateCoupon`
- **tags:** Coupons

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The coupon ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "title",
    "code",
    "type",
    "amount",
    "status",
    "stackable",
    "show_on_checkout"
  ],
  "properties": {
    "title": {
      "type": "string",
      "maxLength": 200,
      "description": "Coupon display name"
    },
    "code": {
      "type": "string",
      "maxLength": 50,
      "description": "Unique coupon code"
    },
    "type": {
      "type": "string",
      "enum": [
        "fixed",
        "percentage",
        "free_shipping",
        "buy_x_get_y"
      ],
      "description": "Discount type"
    },
    "amount": {
      "type": "number",
      "minimum": 0,
      "description": "Discount amount. For percentage: value 0-100. For fixed: amount in store currency."
    },
    "status": {
      "type": "string",
      "enum": [
        "active",
        "expired",
        "disabled",
        "scheduled"
      ],
      "description": "Coupon status"
    },
    "stackable": {
      "type": "string",
      "enum": [
        "yes",
        "no"
      ],
      "description": "Whether coupon can be combined with others"
    },
    "show_on_checkout": {
      "type": "string",
      "enum": [
        "yes",
        "no"
      ],
      "description": "Whether to display the coupon on checkout"
    },
    "priority": {
      "type": "integer",
      "minimum": 0,
      "description": "Sort priority"
    },
    "notes": {
      "type": "string",
      "description": "Internal notes"
    },
    "start_date": {
      "type": "string",
      "format": "date-time",
      "description": "Start date. Required if end_date is provided."
    },
    "end_date": {
      "type": "string",
      "format": "date-time",
      "description": "End date. Must be after start_date."
    },
    "conditions": {
      "type": "object",
      "description": "Coupon conditions and restrictions"
    }
  },
  "example": {
    "title": "Summer Sale 25%",
    "code": "SUMMER25",
    "type": "percentage",
    "amount": 25,
    "status": "active",
    "stackable": "yes",
    "show_on_checkout": "yes"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Coupon updated successfully. |
| `400` | Update failed. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Invalid coupon. |
| `404` | Coupon not found. |
| `422` | Validation failed, or the referenced record does not exist. |
