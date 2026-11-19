# POST Create Attribute Group

## `POST /options/attr/group`

**POST Create Attribute Group**

Create a new attribute group for product variations.

**Required permission:** `products/create`

- **operationId:** `createAttributeGroup`
- **tags:** Labels

### Request body

`application/json`

```json
{
  "$ref": "#/components/schemas/CreateAttributeGroupRequest"
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Attribute group created successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/create`). |
| `422` | Validation error - duplicate title or slug. |
