# POST Reorder Attribute Groups

## `POST /options/attr/groups/reorder`

**POST Reorder Attribute Groups**

Persist the merchant's drag-reorder of attribute groups in the library. Submit group IDs in the desired display order; every ID must exist. Writes a dense, 1-indexed `serial` to each group. The list is capped at 500 IDs per request (filterable via `fluent_cart/attribute_groups/max_reorder`) — a reorder cannot be split into batches, so an oversized payload is rejected rather than truncated.

**Required permission:** `products/edit`

- **operationId:** `reorderGroups`
- **tags:** Labels & Attributes

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
      "description": "Attribute group IDs in the desired display order. Non-positive and duplicate values are stripped before validation."
    }
  },
  "example": {
    "ids": [
      10,
      1,
      3,
      7
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Groups reordered successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | No group IDs were provided, or the reorder list exceeds the maximum of 500 groups. |
