# PUT Update Customer

## `PUT /customers/{customerId}`

**PUT Update Customer**

Update an existing customer. If the customer is linked to a WordPress user, the corresponding WP user profile is also updated.

**Also used by the customer portal UI.** Update the authenticated customer's profile details. The customerId must match the logged-in customer's record.

**Required permission:** `customers/manage`

- **operationId:** `updateCustomer`
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
    "email"
  ],
  "properties": {
    "email": {
      "type": "string",
      "format": "email",
      "maxLength": 255,
      "description": "Customer email address. Must be unique (excluding current customer)."
    },
    "first_name": {
      "type": "string",
      "maxLength": 255,
      "description": "Customer first name. Required when store is not configured for full name mode."
    },
    "last_name": {
      "type": "string",
      "maxLength": 255,
      "description": "Customer last name."
    },
    "full_name": {
      "type": "string",
      "maxLength": 255,
      "description": "Customer full name. Required when store is configured for full name mode."
    },
    "city": {
      "type": "string",
      "description": "Customer city"
    },
    "state": {
      "type": "string",
      "description": "Customer state/province code"
    },
    "postcode": {
      "type": "string",
      "description": "Customer postal/zip code"
    },
    "country": {
      "type": "string",
      "description": "Customer country code"
    },
    "notes": {
      "type": "string",
      "description": "Internal notes about the customer"
    },
    "status": {
      "type": "string",
      "description": "Customer status"
    },
    "user_id": {
      "type": "integer",
      "description": "WordPress user ID"
    },
    "aov": {
      "type": "string",
      "description": "Average order value"
    },
    "user_url": {
      "type": "string",
      "description": "Customer website URL"
    },
    "username": {
      "type": "string",
      "description": "Username"
    },
    "user_nicename": {
      "type": "string",
      "description": "User nicename"
    },
    "display_name": {
      "type": "string",
      "description": "Display name"
    }
  },
  "example": {
    "first_name": "Sarah",
    "last_name": "Johnson",
    "email": "sarah.johnson@example.com",
    "city": "San Francisco",
    "state": "CA",
    "postcode": "94102",
    "country": "US",
    "notes": "Preferred contact method: email"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Customer updated successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Forbidden. The authenticated user does not own this customer record. |
| `422` | Validation failed, or the referenced record does not exist. |
