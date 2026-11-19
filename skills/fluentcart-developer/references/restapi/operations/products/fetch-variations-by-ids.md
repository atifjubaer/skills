# GET Fetch Variations by IDs

## `GET /products/fetchVariationsByIds`

**GET Fetch Variations by IDs**

Retrieve variations by an array of IDs. Returns simplified label/value pairs.

**Required permission:** `products/view`

- **operationId:** `fetchVariationsByIds`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `productIds[]` | query | yes | array | Array of variation IDs to fetch |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
