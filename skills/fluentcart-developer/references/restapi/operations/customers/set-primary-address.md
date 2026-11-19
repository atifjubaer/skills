# POST Set Primary Address

## `POST /customers/{customerId}/address/make-primary`

**POST Set Primary Address**

Set a specific address as the primary address for its type. The previous primary address of the same type is automatically demoted.

**Also used by the customer portal UI.** Mark a specific address as the primary address for its type (billing or shipping). All other addresses of the same type are demoted.

**Required permission:** `customers/manage`

- **operationId:** `setPrimaryAddress`
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
    "address"
  ],
  "properties": {
    "address": {
      "type": "object",
      "required": [
        "id",
        "type"
      ],
      "properties": {
        "id": {
          "type": "integer",
          "description": "The address record ID to set as primary"
        },
        "type": {
          "type": "string",
          "enum": [
            "billing",
            "shipping"
          ],
          "description": "Address type: `billing` or `shipping`"
        }
      }
    }
  },
  "example": {
    "address": {
      "id": 5,
      "type": "billing"
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Address set as primary successfully. |
| `400` | Failed to set primary address. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Forbidden. The authenticated user does not own this address. |
| `422` | Validation failed, or the referenced record does not exist. |
