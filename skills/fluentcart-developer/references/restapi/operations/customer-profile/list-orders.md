# GET List Orders

## `GET /customer-profile/orders`

**GET List Orders**

Retrieve a paginated list of the authenticated customer's orders. Excludes renewal orders that have a parent subscription order. Supports text search across order fields.

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `listProfileOrders`
- **tags:** Customer Profile

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `per_page` | query | no | integer | Number of items per page (default: 10) |
| `page` | query | no | integer | Page number for pagination (default: 1) |
| `search` | query | no | string | Search text to filter orders |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns a paginated list of orders. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
