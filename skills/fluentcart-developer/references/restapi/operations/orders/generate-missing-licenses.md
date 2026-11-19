# POST Generate Missing Licenses

## `POST /orders/{order}/generate-missing-licenses`

**POST Generate Missing Licenses**

Generate any missing license keys for an order's items (requires Pro with licensing module).

**Required permission:** `orders/manage`

- **operationId:** `generateMissingLicenses`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order` | path | yes | integer | Order ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Missing licenses generated successfully. |
| `400` | No missing licenses found. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/manage`). |
| `404` | Order not found. |
| `422` | Validation failed, or the referenced record does not exist. |
