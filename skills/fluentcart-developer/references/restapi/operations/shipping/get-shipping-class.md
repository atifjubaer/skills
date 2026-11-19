# GET Get Shipping Class

## `GET /shipping/classes/{id}`

**GET Get Shipping Class**

Retrieve a single shipping class by ID.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `getShippingClass`
- **tags:** Shipping

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The shipping class ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the shipping class. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
