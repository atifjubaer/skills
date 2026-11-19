# POST Store Coupon Settings

## `POST /coupons/storeCouponSettings`

**POST Store Coupon Settings**

Update the global coupon settings. Currently controls whether the coupon input field is displayed on the checkout page.

**Required permission:** `coupons/manage`

- **operationId:** `storeCouponSettings`
- **tags:** Coupons

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "show_on_checkout": {
      "type": "boolean",
      "description": "Whether to show the coupon input on the checkout page. Any truthy value sets it to 1, falsy sets to 0."
    }
  },
  "example": {
    "show_on_checkout": true
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Settings saved successfully. Response varies based on whether the setting already existed. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`coupons/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
