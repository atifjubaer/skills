# GET List Tax Classes

## `GET /tax/classes`

**GET List Tax Classes**

Retrieve all tax classes ordered by ID (oldest first), along with the maximum allowed number of classes and the next built-in class (Reduced or Zero) that has not been created yet.

**Required permission:** `store/settings`

- **operationId:** `listTaxClasses`
- **tags:** Tax

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns all tax classes. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/settings`). |
