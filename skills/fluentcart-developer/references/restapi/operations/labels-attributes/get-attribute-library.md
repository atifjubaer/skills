# GET Get Attribute Groups Library

## `GET /options/attr/groups/library`

**GET Get Attribute Groups Library**

Return the attribute-groups library used by the Advanced Variation picker: up to 200 groups ordered by the merchant's manual drag-order, each annotated with a term count computed from a single batched aggregate. Terms are not eager-loaded here — call the group's terms endpoint to expand a specific group's full term list on demand.

**Required permission:** `products/view`

- **operationId:** `getLibrary`
- **tags:** Labels & Attributes

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the attribute groups library. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
