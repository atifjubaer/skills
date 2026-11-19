# POST Create Profile Address

## `POST /customer-profile/create-address`

**POST Create Profile Address**

Create a new address for the authenticated customer from the profile management page.

**Access policy:** `CustomerFrontendPolicy`

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `createProfileAddress`
- **tags:** Customer Profile

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "type",
    "name",
    "postcode",
    "country",
    "email"
  ],
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "billing",
        "shipping"
      ],
      "description": "Address type: `billing` or `shipping`"
    },
    "name": {
      "type": "string",
      "maxLength": 255,
      "description": "Contact name. Max 255 characters."
    },
    "label": {
      "type": "string",
      "maxLength": 15,
      "description": "Short label for the address (max 15 characters, e.g., `Home`, `Work`)"
    },
    "address_1": {
      "type": "string",
      "description": "Primary street address"
    },
    "address_2": {
      "type": "string",
      "description": "Secondary address line"
    },
    "city": {
      "type": "string",
      "maxLength": 255,
      "description": "City. Max 255 characters."
    },
    "state": {
      "type": "string",
      "maxLength": 255,
      "description": "State/province code. Max 255 characters."
    },
    "postcode": {
      "type": "string",
      "description": "Postal/zip code"
    },
    "country": {
      "type": "string",
      "description": "Country code (e.g., `US`, `GB`)"
    },
    "phone": {
      "type": "string",
      "description": "Phone number"
    },
    "email": {
      "type": "string",
      "description": "Email address"
    },
    "company_name": {
      "type": "string",
      "maxLength": 255,
      "description": "Company name. Max 255 characters."
    },
    "is_primary": {
      "type": "integer",
      "enum": [
        0,
        1
      ],
      "description": "Set to `1` to make this the primary address. Defaults to `0`. Automatically set to `1` if no primary address exists."
    }
  },
  "example": {
    "type": "billing",
    "name": "John Doe",
    "address_1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postcode": "10001",
    "country": "US",
    "phone": "+1234567890",
    "email": "john@example.com",
    "label": "Home"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Address created. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation error. |
