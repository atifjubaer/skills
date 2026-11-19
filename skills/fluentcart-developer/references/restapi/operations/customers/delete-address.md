# DELETE Delete Address

## `DELETE /customers/{customerId}/address`

**DELETE Delete Address**

Delete a customer address. Primary addresses and the last remaining address cannot be deleted.

**Also used by the customer portal UI.** Delete an existing address for the authenticated customer. The address ID is passed in the request body.

**Required permission:** `customers/delete`

- **operationId:** `deleteCustomerAddress`
- **tags:** Customers

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `customerId` | path | yes | integer | The customer ID |
| `address[id]` | query | yes | integer | The address record ID to delete |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "address"
  ],
  "properties": {
    "address": {
      "type": "object",
      "required": [
        "id"
      ],
      "properties": {
        "id": {
          "type": "integer",
          "description": "The address record ID to delete"
        }
      }
    }
  },
  "example": {
    "address": {
      "id": 5
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Address deleted successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Cannot delete primary or last address. |
| `422` | Validation failed, or the referenced record does not exist. |
