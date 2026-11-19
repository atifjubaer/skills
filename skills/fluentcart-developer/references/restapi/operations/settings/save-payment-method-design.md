# POST Save Payment Method Design

## `POST /settings/payment-methods/design`

**POST Save Payment Method Design**

Customize the checkout appearance for a specific payment method, including its label, logo, and instructions.

**Required permission:** `is_super_admin`

- **operationId:** `savePaymentMethodDesign`
- **tags:** Settings

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "method"
  ],
  "properties": {
    "method": {
      "type": "string",
      "description": "The payment method key (e.g., `stripe`, `paypal`, `cod`).",
      "example": "stripe"
    },
    "checkout_label": {
      "type": "string",
      "description": "Custom label displayed on the checkout form for this method.",
      "example": "Credit / Debit Card"
    },
    "checkout_logo": {
      "type": "string",
      "description": "URL to a custom logo image for the checkout form.",
      "example": "https://example.com/card-icon.png"
    },
    "checkout_instructions": {
      "type": "string",
      "description": "HTML instructions shown on the checkout page when this method is selected.",
      "example": "<p>You will be charged securely via Stripe.</p>"
    },
    "thank_you_page_instructions": {
      "type": "string",
      "description": "HTML instructions shown on the thank-you/receipt page.",
      "example": "<p>Your payment was processed successfully. A receipt has been sent to your email.</p>"
    }
  },
  "example": {
    "method": "stripe",
    "checkout_label": "Credit / Debit Card",
    "checkout_logo": "https://example.com/card-icon.png",
    "checkout_instructions": "<p>You will be charged securely via Stripe.</p>"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`is_super_admin`). |
| `422` | Validation failed, or the referenced record does not exist. |
