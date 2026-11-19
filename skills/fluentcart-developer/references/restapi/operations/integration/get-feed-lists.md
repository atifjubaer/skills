# GET Feed Merge Fields (Lists)

## `GET /integration/feed/lists`

**GET Feed Merge Fields (Lists)**

Retrieve the merge fields (field mapping options) for a specific integration provider and list. Called when a user selects a target list in the feed editor to load the available mapping fields.

**Required permission:** `integrations/view`

- **operationId:** `getFeedMergeFields`
- **tags:** Integrations

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `integration_name` | query | yes | string | The integration provider key (e.g., `fluent-crm`) |
| `list_id` | query | no | string | The target list ID to fetch merge fields for |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`integrations/view`). |
