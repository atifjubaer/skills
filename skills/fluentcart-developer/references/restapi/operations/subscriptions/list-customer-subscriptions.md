# GET List Customer Subscriptions

## `GET /customer-profile/subscriptions`

**GET List Customer Subscriptions**

Retrieve a paginated list of subscriptions belonging to the currently logged-in customer. Subscriptions with pending or intended status are excluded.

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `listCustomerSubscriptions`
- **tags:** Subscriptions

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `page` | query | no | integer | Page number for pagination (default: 1) |
| `per_page` | query | no | integer | Number of records per page (default: 10) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns a paginated list of customer subscriptions. If the user is not logged in, returns an empty result set. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
