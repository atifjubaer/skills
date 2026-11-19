# DELETE Coupon

## `DELETE /coupons/{id}`

**DELETE Coupon**

Permanently delete a coupon.

**Required permission:** `coupons/delete`

- **operationId:** `deleteCoupon`
- **tags:** Coupons

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The coupon ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Coupon deleted successfully. |
| `400` | Deletion failed. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Invalid coupon ID. |
| `404` | Coupon not found. |
| `422` | Validation failed, or the referenced record does not exist. |
