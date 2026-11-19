# GET Get Checkout Fields

## `GET /checkout-fields/get-fields`

**GET Get Checkout Fields**

Retrieve the checkout field configuration including the schema definition and current settings.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `getCheckoutFields`
- **tags:** Settings

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
