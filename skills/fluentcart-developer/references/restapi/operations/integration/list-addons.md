# GET List Available Add-ons

## `GET /integration/addons`

**GET List Available Add-ons**

Retrieve the list of all available integration add-ons, including their installation status and metadata.

**Required permission:** `integrations/view`

- **operationId:** `listIntegrationAddons`
- **tags:** Integrations

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`integrations/view`). |
