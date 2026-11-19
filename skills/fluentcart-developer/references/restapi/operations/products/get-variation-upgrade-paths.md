# GET Get Variation Upgrade Paths

## `GET /products/variation/{variantId}/upgrade-paths`

**GET Get Variation Upgrade Paths**

Retrieve available upgrade paths for a specific variation (used in customer-facing upgrade flows).

**Required permission:** `products/view`

- **operationId:** `getVariationUpgradePaths`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `variantId` | path | yes | integer | The variation ID |
| `params[order_hash]` | query | yes | string | The order hash to determine applicable upgrades |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
| `422` | Validation failed, or the referenced record does not exist. |
