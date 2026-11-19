# DELETE Delete Shipping Tax Override

## `DELETE /tax/rates/country/override/{id}`

**DELETE Delete Shipping Tax Override**

Remove the shipping tax override from a tax rate, resetting for_shipping to null.

**Required permission:** `store/sensitive`

- **operationId:** `deleteShippingTaxOverride`
- **tags:** Tax

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | Tax rate ID to remove the shipping override from |

### Responses

| Status | Description |
| --- | --- |
| `200` | Shipping override deleted successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/sensitive`). |
| `422` | Validation failed, or the referenced record does not exist. |
