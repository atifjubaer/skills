# GET Coupon Details

## `GET /coupons/{id}`

**GET Coupon Details**

Retrieve detailed information about a specific coupon, including its activity log. The coupon status is automatically updated to expired if its end_date has passed.

**Required permission:** `coupons/view`

- **operationId:** `getCoupon`
- **tags:** Coupons

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The coupon ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the coupon details with activity log. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`coupons/view`). |
| `422` | Validation failed, or the referenced record does not exist. |
