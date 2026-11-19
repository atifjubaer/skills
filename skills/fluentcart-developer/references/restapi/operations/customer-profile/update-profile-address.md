# POST Update Profile Address

## `POST /customer-profile/edit-address`

**POST Update Profile Address**

Update an existing address from the profile management page. The address must belong to the authenticated customer.

**Access policy:** `CustomerFrontendPolicy`

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `updateProfileAddress`
- **tags:** Customer Profile

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "id",
    "type",
    "name",
    "postcode",
    "country",
    "email"
  ],
  "properties": {
    "id": {
      "type": "integer",
      "description": "The address record ID to update"
    },
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
      "description": "Short label (max 15 characters)"
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
    }
  },
  "example": {
    "id": 5,
    "type": "billing",
    "name": "John Smith",
    "address_1": "456 Oak Ave",
    "city": "Boston",
    "state": "MA",
    "postcode": "02101",
    "country": "US",
    "email": "john@example.com"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Address updated. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Forbidden. The authenticated user does not own this address. |
| `422` | Validation failed, or the referenced record does not exist. |
