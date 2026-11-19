# GET Get Product Category Tax Overrides

## `GET /tax/product-overrides/{country_code}`

**GET Get Product Category Tax Overrides**

Retrieve all product category tax overrides for a specific country. Each override is a meta row whose meta_value holds the location, category, rate, and tax class data; class_id and class_label are appended for convenience.

**Required permission:** `store/settings`

- **operationId:** `getProductOverrides`
- **tags:** Tax

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `country_code` | path | yes | string | ISO 3166-1 alpha-2 country code (e.g., US, DE) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the product category tax overrides for the country. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/settings`). |
| `422` | Validation failed, or the referenced record does not exist. |
