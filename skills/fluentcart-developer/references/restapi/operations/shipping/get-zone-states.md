# GET Get Zone States

## `GET /shipping/zone/states`

**GET Get Zone States**

Retrieve state/province options and address locale configuration for a given country. Useful for populating state selectors when configuring shipping methods within a zone.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `getZoneStates`
- **tags:** Shipping

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `country_code` | query | no | string | ISO 3166-1 alpha-2 country code (e.g., US, CA, GB) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns states and address locale configuration for the given country. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
