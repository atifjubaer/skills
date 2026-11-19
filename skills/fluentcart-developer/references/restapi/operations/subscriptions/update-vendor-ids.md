# PUT Update Vendor IDs

## `PUT /orders/{order}/subscriptions/{subscription}/vendor-ids`

**PUT Update Vendor IDs**

Correct the gateway identifiers (vendor_subscription_id, vendor_customer_id) on a gateway-billed subscription. Opt-in: the endpoint returns an error unless the site enables the `fluent_cart/subscription/vendor_id_editing_enabled` filter. Writes only the identifier columns — no renewal is voided, no invoice re-synced, no status event dispatched, and the payment gateway is not called. Only the keys sent are written. The new vendor_subscription_id is claimed atomically, so another subscription on the same payment method cannot already hold it.

**Required permission:** `subscriptions/manage`

- **operationId:** `updateVendorIds`
- **tags:** Subscriptions

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order` | path | yes | integer | The parent order ID |
| `subscription` | path | yes | integer | The subscription ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "vendor_subscription_id": {
      "type": "string",
      "maxLength": 45,
      "pattern": "^[a-zA-Z0-9_.-]+$",
      "description": "The subscription ID at the payment gateway. Send an empty string to clear it. Omit the key to leave it untouched."
    },
    "vendor_customer_id": {
      "type": "string",
      "maxLength": 45,
      "pattern": "^[a-zA-Z0-9_.-]+$",
      "description": "The customer ID at the payment gateway. Send an empty string to clear it. Omit the key to leave it untouched."
    }
  },
  "example": {
    "vendor_subscription_id": "sub_1P9xyzABCdef",
    "vendor_customer_id": "cus_NffrFeUfNV2Hib"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Vendor IDs updated |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`subscriptions/manage`). |
| `422` | Validation failed |
