# GET Suggest SKU

## `GET /products/suggest-sku`

**GET Suggest SKU**

Generate a unique SKU suggestion based on product and variant titles.

**Required permission:** `products/view`

- **operationId:** `suggestSku`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `title` | query | yes | string | Product title to base SKU on |
| `variant_title` | query | no | string | Variant title to include in SKU |
| `exclude_id` | query | no | integer | Variation ID to exclude from uniqueness check |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
