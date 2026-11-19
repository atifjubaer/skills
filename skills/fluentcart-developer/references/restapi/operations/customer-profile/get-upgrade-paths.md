# GET Get Upgrade Paths

## `GET /customer-profile/orders/{order_uuid}/upgrade-paths`

**GET Get Upgrade Paths**

Retrieve available upgrade/downgrade paths for a specific product variation within an order. Used to show plan switching options in the customer portal.

**Access policy:** `CustomerFrontendPolicy`

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `getUpgradePaths`
- **tags:** Customer Profile

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `order_uuid` | path | yes | string | The UUID of the order (alphanumeric with dashes) |
| `variation_id` | query | yes | integer | The product variation ID to find upgrade paths for |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns available upgrade/downgrade paths. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Not logged in. |
| `404` | Order not found or no permission. |
| `422` | Validation failed, or the referenced record does not exist. |
