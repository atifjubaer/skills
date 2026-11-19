# POST Attach Note to Order

## `POST /notes/attach`

**POST Attach Note to Order**

Add or update a note on an order. The note is stored directly on the order record.

**Access policy:** `AdminPolicy` — requires the `is_super_admin` FluentCart capability.

- **operationId:** `attachNoteToOrder`
- **tags:** Dashboard

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "order_id",
    "note"
  ],
  "properties": {
    "order_id": {
      "type": "integer",
      "description": "The order ID to attach the note to"
    },
    "note": {
      "type": "string",
      "description": "The note content (sanitized as text field)"
    }
  },
  "example": {
    "order_id": 1024,
    "note": "Customer requested express shipping. Upgraded at no charge."
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Error response |
