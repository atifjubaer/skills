# GET Get Shipping Methods

## `GET /orders/shipping_methods`

**GET Get Shipping Methods**

Retrieve available shipping methods, optionally filtered by country and state. Returns methods applicable to the specified location and all other enabled methods separately.

**Required permission:** `orders/manage`

- **operationId:** `getShippingMethods`
- **tags:** Orders

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `country_code` | query | no | string | Country code to filter applicable shipping methods (e.g., `US`, `GB`) |
| `state` | query | no | string | State/province code for more specific filtering |
| `order_items` | query | no | array | Array of order items (each with `id` and `quantity`) to calculate shipping charges |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns shipping methods. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/manage`). |
