# POST Create Label

## `POST /labels`

**POST Create Label**

Create a new label and optionally attach it to an entity (order, customer, etc.) in a single request.

**Required permission:** `labels/manage`

- **operationId:** `createLabel`
- **tags:** Labels

### Request body

`application/json`

```json
{
  "$ref": "#/components/schemas/CreateLabelRequest"
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Label created successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`labels/manage`). |
| `422` | Validation error - duplicate label. |
