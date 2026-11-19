# POST Create Customer

## `POST /customers`

**POST Create Customer**

Create a new customer record. Automatically links to an existing WordPress user if a matching email is found.

**Required permission:** `customers/manage`

- **operationId:** `createCustomer`
- **tags:** Customers

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
      "description": "Customer email address. Must be unique and valid."
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
      "description": "Customer full name. Required when store is configured for full name mode. Automatically split into first_name and last_name."
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
      "description": "Customer country code (e.g., US, GB)"
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
      "description": "WordPress user ID to associate"
    },
    "wp_user": {
      "type": "string",
      "description": "Set to 'yes' to create a new WordPress user account for this customer"
    },
    "aov": {
      "type": "string",
      "description": "Average order value"
    },
    "user_url": {
      "type": "string",
      "description": "Customer website URL"
    }
  },
  "example": {
    "first_name": "Sarah",
    "last_name": "Johnson",
    "email": "sarah.johnson@example.com",
    "country": "US",
    "city": "San Francisco",
    "state": "CA",
    "postcode": "94102",
    "wp_user": "yes"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Customer created successfully. |
| `400` | Customer already exists. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`customers/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
