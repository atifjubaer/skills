# PUT Update Additional Info (Labels)

## `PUT /customers/{customerId}/additional-info`

**PUT Update Additional Info (Labels)**

Update a customer's labels/tags. Manages the label relationships for a customer by syncing provided label IDs with existing ones.

**Required permission:** `customers/manage`

- **operationId:** `updateCustomerAdditionalInfo`
- **tags:** Customers

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `customerId` | path | yes | integer | The customer ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "labels"
  ],
  "properties": {
    "labels": {
      "type": "array",
      "items": {
        "type": "integer"
      },
      "description": "Array of label IDs to assign to the customer. Existing labels not in this array will be removed."
    }
  },
  "example": {
    "labels": [
      1,
      2
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Customer labels updated successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`customers/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
