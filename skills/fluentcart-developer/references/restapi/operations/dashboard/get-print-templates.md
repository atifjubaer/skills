# GET Get Print Templates

## `GET /templates/print-templates`

**GET Get Print Templates**

Retrieve all available print templates. Returns saved custom templates or falls back to default templates.

**Access policy:** `AdminPolicy` — requires the `is_super_admin` FluentCart capability.

- **operationId:** `getPrintTemplates`
- **tags:** Dashboard

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
