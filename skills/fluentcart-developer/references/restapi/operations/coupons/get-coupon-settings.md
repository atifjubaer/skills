# GET Coupon Settings

## `GET /coupons/getSettings`

**GET Coupon Settings**

Retrieve the global coupon settings (currently, whether coupon input is shown on the checkout page).

**Required permission:** `coupons/view`

- **operationId:** `getCouponSettings`
- **tags:** Coupons

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the global coupon settings. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`coupons/view`). |
