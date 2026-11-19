# POST Place Order

## `POST /checkout/place-order`

**POST Place Order**

Submit a checkout order with billing/shipping details and payment method. This endpoint validates the cart, creates a customer (or matches an existing one), creates a draft order, and initiates the payment flow with the selected gateway.

**Access policy:** `PublicPolicy`

**Access policy:** `PublicPolicy`

- **operationId:** `placeOrder`
- **tags:** Checkout

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "billing_email",
    "payment_method"
  ],
  "properties": {
    "billing_email": {
      "type": "string",
      "format": "email",
      "description": "Customer email address. Auto-populated for logged-in users"
    },
    "billing_full_name": {
      "type": "string",
      "description": "Full name of the customer. Required when the store uses full name mode. Auto-populated for logged-in users if available"
    },
    "billing_first_name": {
      "type": "string",
      "description": "Customer first name. Required when the store uses separate first/last name mode"
    },
    "billing_last_name": {
      "type": "string",
      "description": "Customer last name. Required when the store uses separate name mode and last name is configured as required"
    },
    "billing_country": {
      "type": "string",
      "description": "ISO country code (e.g., `US`, `GB`). Required based on checkout field configuration. Defaults to store country if not provided"
    },
    "billing_address_1": {
      "type": "string",
      "description": "Street address line 1. Required based on checkout field configuration"
    },
    "billing_address_2": {
      "type": "string",
      "description": "Street address line 2 (apt, suite, unit)"
    },
    "billing_city": {
      "type": "string",
      "description": "City name. Required based on checkout field configuration"
    },
    "billing_state": {
      "type": "string",
      "description": "State/province code. Required if the selected country has states"
    },
    "billing_postcode": {
      "type": "string",
      "description": "Postal/ZIP code. Required based on checkout field configuration"
    },
    "billing_phone": {
      "type": "string",
      "description": "Phone number"
    },
    "billing_tax_id": {
      "type": "string",
      "description": "Customer tax ID / VAT number"
    },
    "billing_address_id": {
      "type": "integer",
      "description": "ID of a saved customer billing address (for returning customers)"
    },
    "ship_to_different": {
      "type": "string",
      "enum": [
        "yes",
        "no"
      ],
      "default": "no",
      "description": "Set to `yes` to use a different shipping address. Default: `no`"
    },
    "shipping_full_name": {
      "type": "string",
      "description": "Shipping recipient name. Required when `ship_to_different` is `yes`"
    },
    "shipping_country": {
      "type": "string",
      "description": "Shipping country code. Required when `ship_to_different` is `yes`"
    },
    "shipping_address_1": {
      "type": "string",
      "description": "Shipping street address. Required when `ship_to_different` is `yes`"
    },
    "shipping_address_2": {
      "type": "string",
      "description": "Shipping address line 2"
    },
    "shipping_city": {
      "type": "string",
      "description": "Shipping city. Required when `ship_to_different` is `yes`"
    },
    "shipping_state": {
      "type": "string",
      "description": "Shipping state/province code"
    },
    "shipping_postcode": {
      "type": "string",
      "description": "Shipping postal code"
    },
    "shipping_phone": {
      "type": "string",
      "description": "Shipping phone number"
    },
    "shipping_address_id": {
      "type": "integer",
      "description": "ID of a saved customer shipping address"
    },
    "fc_selected_shipping_method": {
      "type": "integer",
      "description": "ID of the selected shipping method. Required for orders containing physical products"
    },
    "payment_method": {
      "type": "string",
      "description": "Payment gateway slug (e.g., `stripe`, `paypal`, `cod`, `square`)"
    },
    "order_notes": {
      "type": "string",
      "maxLength": 200,
      "description": "Optional order notes from the customer. Max 200 characters"
    },
    "agree_terms": {
      "type": "string",
      "description": "Terms agreement flag. Required if terms acceptance is enabled in store settings"
    },
    "allow_create_account": {
      "type": "string",
      "enum": [
        "yes",
        "no"
      ],
      "description": "Set to `yes` to create a WordPress user account (when store setting is `user_choice`)"
    },
    "user_tz": {
      "type": "string",
      "default": "UTC",
      "description": "Customer timezone (e.g., `America/New_York`). Default: `UTC`"
    }
  },
  "example": {
    "billing_email": "john@example.com",
    "billing_full_name": "John Doe",
    "billing_country": "US",
    "billing_address_1": "123 Main St",
    "billing_city": "New York",
    "billing_state": "NY",
    "billing_postcode": "10001",
    "payment_method": "stripe",
    "user_tz": "America/New_York"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. The response structure varies by payment gateway. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Product validation failure. |
| `429` | Rate limit exceeded (5 requests per 60 seconds per IP/user). |
