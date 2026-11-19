# GET Dynamic Options

## `GET /integration/feed/dynamic_options`

**GET Dynamic Options**

Fetch dynamic select options for integration feed fields. Supports WordPress post type searches and provider-specific dynamic option lookups. Used by the feed editor to populate dropdown fields asynchronously.

**Required permission:** `integrations/view`

- **operationId:** `getDynamicOptions`
- **tags:** Integrations

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `option_key` | query | yes | string | The type of options to fetch (e.g., `post_type` for WordPress posts, or a provider-specific key) |
| `sub_option_key` | query | no | string | Required when `option_key` is `post_type`. Specifies the post type slug (e.g., `post`, `page`, `fluent-products`) |
| `search` | query | no | string | Search term to filter results |
| `values` | query | no | array | Array of pre-selected IDs to ensure they are included in the response |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`integrations/view`). |
