# GET List All Payment Methods

## `GET /settings/payment-methods/all`

**GET List All Payment Methods**

Retrieve all registered payment method gateways categorized by availability status.

**Required permission:** `is_super_admin`

- **operationId:** `listAllPaymentMethods`
- **tags:** Settings

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`is_super_admin`). |
