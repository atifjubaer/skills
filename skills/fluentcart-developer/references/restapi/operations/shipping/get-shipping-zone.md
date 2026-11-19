# GET Get Shipping Zone

## `GET /shipping/zones/{id}`

**GET Get Shipping Zone**

Retrieve a single shipping zone by ID, including its associated shipping methods.

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `getShippingZone`
- **tags:** Shipping

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The shipping zone ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the shipping zone with its methods. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
