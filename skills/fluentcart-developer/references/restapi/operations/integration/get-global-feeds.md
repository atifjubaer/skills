# GET List Global Integration Feeds

## `GET /integration/global-feeds`

**GET List Global Integration Feeds**

Retrieve all configured global integration feeds along with the list of available integrations that support global scope.

**Required permission:** `integrations/view`

- **operationId:** `listGlobalIntegrationFeeds`
- **tags:** Integrations

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`integrations/view`). |
