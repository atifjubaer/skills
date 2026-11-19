# GET Initialize App

## `GET /app/init`

**GET Initialize App**

Initialize the admin application by loading REST API configuration, asset URLs, translation strings, and shop configuration. This is the first call made when the admin SPA loads.

**Access policy:** `AdminPolicy` — requires the `is_super_admin` FluentCart capability.

- **operationId:** `initializeApp`
- **tags:** Dashboard

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
