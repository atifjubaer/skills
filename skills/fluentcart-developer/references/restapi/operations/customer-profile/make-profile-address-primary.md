# POST Make Profile Address Primary

## `POST /customer-profile/make-primary-address`

**POST Make Profile Address Primary**

Set a specific address as the primary address for its type. All other addresses of the same type for the customer are demoted.

**Access policy:** `CustomerFrontendPolicy`

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `makeProfileAddressPrimary`
- **tags:** Customer Profile

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "addressId",
    "type"
  ],
  "properties": {
    "addressId": {
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
  },
  "example": {
    "addressId": 5,
    "type": "billing"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Address set as primary. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Forbidden. The authenticated user does not own this address. |
| `422` | Validation failed, or the referenced record does not exist. |
