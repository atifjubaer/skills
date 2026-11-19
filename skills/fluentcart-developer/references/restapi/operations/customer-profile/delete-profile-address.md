# POST Delete Profile Address

## `POST /customer-profile/delete-address`

**POST Delete Profile Address**

Delete an address from the customer's profile. The address must belong to the authenticated customer. Primary addresses and the last remaining address cannot be deleted.

**Access policy:** `CustomerFrontendPolicy`

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `deleteProfileAddress`
- **tags:** Customer Profile

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "addressId"
  ],
  "properties": {
    "addressId": {
      "type": "integer",
      "description": "The address record ID to delete"
    }
  },
  "example": {
    "addressId": 5
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Address deleted. |
| `400` | Address cannot be deleted (primary or last remaining). |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Forbidden. The authenticated user does not own this address. |
| `422` | Validation failed, or the referenced record does not exist. |
