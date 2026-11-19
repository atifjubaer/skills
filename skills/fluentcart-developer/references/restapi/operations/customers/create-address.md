# POST Create Address

## `POST /customers/{customerId}/address`

**POST Create Address**

Create a new address for a customer. If no primary address exists for the given type, this address is automatically set as primary. Optionally syncs with an associated order address.

**Required permission:** `customers/manage`

- **operationId:** `createCustomerAddress`
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
    "name",
    "email",
    "address_1",
    "city",
    "country",
    "type"
  ],
  "properties": {
    "name": {
      "type": "string",
      "maxLength": 255,
      "description": "Full name for the address."
    },
    "email": {
      "type": "string",
      "format": "email",
      "maxLength": 255,
      "description": "Email for the address."
    },
    "address_1": {
      "type": "string",
      "description": "Primary street address"
    },
    "address_2": {
      "type": "string",
      "description": "Secondary address line (apartment, suite, etc.)"
    },
    "city": {
      "type": "string",
      "maxLength": 255,
      "description": "City."
    },
    "state": {
      "type": "string",
      "description": "State/province code. May be required depending on store localization settings."
    },
    "postcode": {
      "type": "string",
      "description": "Postal/zip code. May be required depending on store localization settings."
    },
    "country": {
      "type": "string",
      "description": "Country code (e.g., US, GB)"
    },
    "phone": {
      "type": "string",
      "description": "Phone number"
    },
    "type": {
      "type": "string",
      "enum": [
        "billing",
        "shipping"
      ],
      "description": "Address type: billing or shipping"
    },
    "label": {
      "type": "string",
      "maxLength": 15,
      "description": "Custom label for the address (e.g., Home, Office)."
    },
    "status": {
      "type": "string",
      "description": "Address status (default: active)"
    },
    "is_primary": {
      "type": "integer",
      "enum": [
        0,
        1
      ],
      "description": "Set to 1 to make this the primary address (default: 0)"
    },
    "company_name": {
      "type": "string",
      "maxLength": 255,
      "description": "Company name."
    },
    "order_id": {
      "type": "integer",
      "description": "Order ID to sync this address with."
    }
  },
  "example": {
    "name": "Sarah Johnson",
    "email": "sarah.johnson@example.com",
    "address_1": "456 Market Street",
    "address_2": "Suite 300",
    "city": "San Francisco",
    "state": "CA",
    "postcode": "94102",
    "country": "US",
    "phone": "+1-415-555-0142",
    "type": "billing",
    "label": "Office",
    "company_name": "TechStart Inc."
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Address created successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`customers/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
