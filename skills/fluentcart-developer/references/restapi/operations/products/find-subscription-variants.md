# GET Find Subscription Variants

## `GET /products/findSubscriptionVariants`

**GET Find Subscription Variants**

Search for product variants that have a subscription payment type.

**Required permission:** `products/view`

- **operationId:** `findSubscriptionVariants`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `name` | query | no | string | Variant title to search |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
