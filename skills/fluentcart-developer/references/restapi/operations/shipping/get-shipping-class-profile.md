# GET Get Shipping Class Profile

## `GET /shipping/classes/{id}/profile`

**GET Get Shipping Class Profile**

Retrieve a shipping class together with every shipping zone it is assigned to, each zone including its shipping methods. Used to show the full reach of a class across all zones in one call.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `getProfile`
- **tags:** Shipping

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The shipping class ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the shipping class with its zones and each zone's methods. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `404` | No shipping class exists with the given ID. Thrown by `ShippingClass::findOrFail()`, not an explicit controller check, so the message is generic and names the model class and ID. |
| `422` | Validation failed, or the referenced record does not exist. |
