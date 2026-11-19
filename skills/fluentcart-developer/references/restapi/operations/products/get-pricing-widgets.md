# GET Get Pricing Widgets

## `GET /products/{productId}/pricing-widgets`

**GET Get Pricing Widgets**

Retrieve sales overview widgets for a product (all-time, last 30 days, this month).

**Required permission:** `products/view`

- **operationId:** `getPricingWidgets`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `productId` | path | yes | integer | The product ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
| `422` | Validation failed, or the referenced record does not exist. |
