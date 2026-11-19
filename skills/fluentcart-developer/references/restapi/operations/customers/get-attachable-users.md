# GET Get Attachable Users

## `GET /customers/attachable-user`

**GET Get Attachable Users**

Retrieve a list of WordPress users that are not yet associated with any FluentCart customer. Useful for linking existing WP users to customer records.

**Required permission:** `customers/manage`

- **operationId:** `getAttachableUsers`
- **tags:** Customers

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns a list of attachable WordPress users. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`customers/manage`). |
