# GET List Labels

## `GET /labels`

**GET List Labels**

Retrieve all available labels. Labels are tags that can be attached to orders, customers, or other entities for organizational purposes.

**Required permission:** `labels/view`

- **operationId:** `listLabels`
- **tags:** Labels

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns all labels. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`labels/view`). |
