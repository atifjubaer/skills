# GET Get Tax Settings

## `GET /tax/configuration/settings`

**GET Get Tax Settings**

Retrieve the current global tax configuration settings along with the store country.

**Required permission:** `store/settings`

- **operationId:** `getTaxSettings`
- **tags:** Tax

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the current tax settings and the store country. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/settings`). |
