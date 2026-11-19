# POST Create Address (Checkout)

## `POST /customers/add-address`

**POST Create Address (Checkout)**

Create a new address for the currently authenticated customer. Used during checkout to add a new billing or shipping address. After creation, returns updated address selector HTML for the checkout form.

**Access policy:** `PublicPolicy`

**Access policy:** `PublicPolicy`

- **operationId:** `createAddressCheckout`
- **tags:** Customer Profile

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "type"
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
    "product_type": {
      "type": "string",
      "description": "Product fulfillment type (e.g., `physical`, `digital`). Used for field validation rules."
    },
    "label": {
      "type": "string",
      "maxLength": 15,
      "description": "Short label for the address (max 15 characters, e.g., `Home`, `Office`)"
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
    "billing_phone": {
      "type": "string",
      "description": "Phone number (for billing type)"
    },
    "billing_email": {
      "type": "string",
      "description": "Email address (for billing type)"
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
    },
    "shipping_phone": {
      "type": "string",
      "description": "Phone number (for shipping type)"
    },
    "shipping_email": {
      "type": "string",
      "description": "Email address (for shipping type)"
    }
  },
  "example": {
    "type": "billing",
    "billing_name": "John Doe",
    "billing_address_1": "123 Main St",
    "billing_city": "New York",
    "billing_state": "NY",
    "billing_postcode": "10001",
    "billing_country": "US",
    "billing_phone": "+1234567890",
    "label": "Home"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns success message and updated address selector fragment. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation error. |
