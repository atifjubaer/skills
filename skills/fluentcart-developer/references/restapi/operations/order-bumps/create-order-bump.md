# POST Create Order Bump

## `POST /order_bump`

**POST Create Order Bump**

Create a new order bump promotion. The order bump is created with minimal data (title and source variant) and can be fully configured via the Update endpoint.

**Permission:** `store/sensitive` · **Policy:** `OrderBumpPolicy`

- **operationId:** `createOrderBump`
- **tags:** Order Bumps

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "title",
    "src_object_id"
  ],
  "properties": {
    "title": {
      "type": "string",
      "description": "Display title for the order bump."
    },
    "src_object_id": {
      "type": "integer",
      "description": "The product variation ID that this order bump offers. Must reference an existing product variation."
    }
  },
  "example": {
    "title": "Add Extended Warranty",
    "src_object_id": 42
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `400` | Error response |
