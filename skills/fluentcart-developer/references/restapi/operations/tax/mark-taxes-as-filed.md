# POST Mark Taxes as Filed

## `POST /taxes`

**POST Mark Taxes as Filed**

Mark one or more order tax records as filed by setting their filed_at timestamp.

**Access policy:** `AdminPolicy` — requires the `is_super_admin` FluentCart capability.

- **operationId:** `markTaxesAsFiled`
- **tags:** Tax

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "ids"
  ],
  "properties": {
    "ids": {
      "type": "array",
      "items": {
        "type": "integer"
      },
      "description": "Array of OrderTaxRate record IDs to mark as filed",
      "example": [
        1,
        2,
        3,
        5
      ]
    }
  },
  "example": {
    "ids": [
      1,
      2,
      3,
      5
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Taxes marked as filed successfully. |
| `400` | No IDs provided. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
