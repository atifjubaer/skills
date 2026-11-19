# POST Verify Vendor IDs

## `POST /orders/{order}/subscriptions/{subscription}/verify-vendor-ids`

**POST Verify Vendor IDs**

Read-only lookup of a candidate vendor subscription ID at the payment gateway, used before saving a correction. Writes nothing locally and nothing at the gateway. Requires the `fluent_cart/subscription/vendor_id_editing_enabled` filter and a gateway declaring the `verify_vendor_ids` capability (Stripe and PayPal); other gateways return an error. A successful lookup proves the ID exists in the merchant account whose credentials this store holds — it is not proof of ownership, since one merchant account can back several stores.

**Required permission:** `subscriptions/manage`

- **operationId:** `verifyVendorIds`
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
      "description": "The candidate subscription ID to look up"
    },
    "vendor_customer_id": {
      "type": "string",
      "maxLength": 45,
      "pattern": "^[a-zA-Z0-9_.-]+$",
      "description": "The candidate customer ID. Sent because some gateways nest the subscription under its customer."
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
| `200` | Lookup result |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`subscriptions/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
