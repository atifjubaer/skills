# GET List Coupon Codes

## `GET /coupons/listCoupons`

**GET List Coupon Codes**

Retrieve a simple array of active coupon codes. This lightweight endpoint is designed for use in order creation forms and quick coupon lookups.

**Required permissions:** all of `orders/create`, `orders/manage`, `coupons/view`

- **operationId:** `listCouponCodes`
- **tags:** Coupons

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns an array of active coupon code strings. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/create, orders/manage, coupons/view`). |
