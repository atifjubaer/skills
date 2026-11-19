# GET Get Widgets

## `GET /widgets`

**GET Get Widgets**

Retrieve dynamic widget data for a specific context. Widgets are loaded via WordPress filters, allowing modules and extensions to register custom widgets.

**Required permissions:** any one of `customers/view`, `orders/view`

- **operationId:** `getWidgets`
- **tags:** Dashboard

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `filter` | query | no | string | Widget context identifier (the fluent_cart_ prefix is automatically stripped). Example: single_order_page |
| `data[order_id]` | query | no | integer | Additional context data. For single_order_page filter, must include order_id. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`customers/view, orders/view`). |
| `404` | Order not found (when filter is single_order_page) |
