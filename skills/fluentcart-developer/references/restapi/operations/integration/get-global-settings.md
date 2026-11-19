# GET Global Integration Settings

## `GET /integration/global-settings`

**GET Global Integration Settings**

Retrieve global configuration settings for a specific integration provider. Used to get API key configuration, authentication fields, and current saved values.

**Required permission:** `integrations/view`

- **operationId:** `getGlobalIntegrationSettings`
- **tags:** Integrations

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `settings_key` | query | yes | string | The integration provider key (e.g., `fluent-crm`, `webhook`) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`integrations/view`). |
