# PUT Update Address

## `PUT /customers/{customerId}/address`

**PUT Update Address**

Update an existing customer address by its address record ID. Optionally syncs changes to an associated order address.

**Also used by the customer portal UI.** Update an existing address for the authenticated customer. The address ID is passed in the request body.

**Required permission:** `customers/manage`

- **operationId:** `updateCustomerAddress`
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
    "type"
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
          "description": "The address record ID to update"
        }
      }
    },
    "type": {
      "type": "string",
      "enum": [
        "billing",
        "shipping"
      ],
      "description": "Address type: `billing` or `shipping`"
    },
    "billing_label": {
      "type": "string",
      "maxLength": 15,
      "description": "Short label (max 15 characters, for billing type)"
    },
    "billing_name": {
      "type": "string",
      "description": "Contact name (for billing type)"
    },
    "billing_address_1": {
      "type": "string",
      "description": "Primary street address (for billing type)"
    },
    "billing_address_2": {
      "type": "string",
      "description": "Secondary address line (for billing type)"
    },
    "billing_city": {
      "type": "string",
      "description": "City (for billing type)"
    },
    "billing_state": {
      "type": "string",
      "description": "State/province code (for billing type)"
    },
    "billing_postcode": {
      "type": "string",
      "description": "Postal/zip code (for billing type)"
    },
    "billing_country": {
      "type": "string",
      "description": "Country code (for billing type)"
    },
    "shipping_label": {
      "type": "string",
      "maxLength": 15,
      "description": "Short label (max 15 characters, for shipping type)"
    },
    "shipping_name": {
      "type": "string",
      "description": "Contact name (for shipping type)"
    },
    "shipping_address_1": {
      "type": "string",
      "description": "Primary street address (for shipping type)"
    },
    "shipping_address_2": {
      "type": "string",
      "description": "Secondary address line (for shipping type)"
    },
    "shipping_city": {
      "type": "string",
      "description": "City (for shipping type)"
    },
    "shipping_state": {
      "type": "string",
      "description": "State/province code (for shipping type)"
    },
    "shipping_postcode": {
      "type": "string",
      "description": "Postal/zip code (for shipping type)"
    },
    "shipping_country": {
      "type": "string",
      "description": "Country code (for shipping type)"
    }
  },
  "example": {
    "type": "billing",
    "address": {
      "id": 5
    },
    "billing_name": "John Doe",
    "billing_address_1": "456 Oak Ave",
    "billing_city": "Boston",
    "billing_state": "MA",
    "billing_postcode": "02101",
    "billing_country": "US",
    "billing_label": "Work"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Address updated successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Forbidden. The authenticated user does not own this address. |
| `404` | Address not found. |
| `422` | Validation failed, or the referenced record does not exist. |
