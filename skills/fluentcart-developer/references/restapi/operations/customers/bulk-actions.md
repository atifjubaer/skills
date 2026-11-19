# POST Bulk Actions

## `POST /customers/do-bulk-action`

**POST Bulk Actions**

Perform bulk operations on multiple customers such as deletion or status change.

**Required permission:** `customers/manage`

- **operationId:** `bulkActionCustomers`
- **tags:** Customers

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "action",
    "customer_ids"
  ],
  "properties": {
    "action": {
      "type": "string",
      "enum": [
        "delete_customers",
        "change_customer_status"
      ],
      "description": "The action to perform."
    },
    "customer_ids": {
      "type": "array",
      "items": {
        "type": "integer"
      },
      "description": "Array of customer IDs to act upon"
    },
    "new_status": {
      "type": "string",
      "description": "Required when action is change_customer_status. The new status to apply to the selected customers."
    }
  },
  "example": {
    "action": "change_customer_status",
    "customer_ids": [
      12,
      15,
      23
    ],
    "new_status": "inactive"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Bulk action completed successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Missing customer selection. |
| `422` | Validation failed, or the referenced record does not exist. |
