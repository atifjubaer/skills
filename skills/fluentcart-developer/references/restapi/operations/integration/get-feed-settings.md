# GET Feed Settings

## `GET /integration/global-feeds/settings`

**GET Feed Settings**

Retrieve the settings form schema, saved values, and available shortcodes for a specific integration feed. Used to populate the feed editor when creating or editing a global feed.

**Required permission:** `integrations/view`

- **operationId:** `getFeedSettings`
- **tags:** Integrations

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `integration_name` | query | yes | string | The integration provider key (e.g., `fluent-crm`, `webhook`) |
| `integration_id` | query | no | integer | The feed ID to load existing settings for editing. Omit to get defaults for a new feed. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`integrations/view`). |
