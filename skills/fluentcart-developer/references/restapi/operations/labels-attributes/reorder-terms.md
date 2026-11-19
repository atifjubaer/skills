# POST Reorder Attribute Terms

## `POST /options/attr/group/{group_id}/terms/reorder`

**POST Reorder Attribute Terms**

Persist the merchant's drag-reorder of attribute terms within one attribute group. Submit the term IDs in the desired display order; every ID must belong to the group given in the path. Writes a dense, 1-indexed `serial` to each term.

**Required permission:** `products/edit`

- **operationId:** `reorderTerms`
- **tags:** Labels & Attributes

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | Attribute group ID that owns the terms being reordered. |

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
      "description": "Term IDs in the desired display order. Every ID must belong to the group in the path; an empty list or a list containing an ID from a different group is rejected."
    }
  },
  "example": {
    "ids": [
      12,
      15,
      9
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Terms reordered successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | No term IDs were provided, or one or more term IDs do not belong to this group. |
