# GET List Countries

## `GET /address-info/countries`

**GET List Countries**

Retrieve a list of all available countries formatted as select options.

**Access policy:** `UserPolicy`

- **operationId:** `listCountries`
- **tags:** Dashboard

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
