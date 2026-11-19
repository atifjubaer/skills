# GET Get Product Integration Settings

## `GET /products/{product_id}/integrations/{integration_name}/settings`

**GET Get Product Integration Settings**

Retrieve settings for a specific integration type on a product. Returns the integration form configuration, existing settings, and product variations.

**Also used by the integrations UI.** Retrieve the feed editor settings for a specific integration provider, scoped to a product. Returns form schema, saved values, available shortcodes, and the product's variation list for conditional targeting.

**Required permission:** `products/view`

- **operationId:** `getProductIntegrationSettings`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `product_id` | path | yes | integer | The product ID |
| `integration_name` | path | yes | string | Integration provider name (e.g., fluentcrm) |
| `integration_id` | query | no | integer | Existing integration feed ID to load for editing |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
| `422` | Validation failed, or the referenced record does not exist. |
