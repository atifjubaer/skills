# DELETE Delete Variation

## `DELETE /products/variants/{variantId}`

**DELETE Delete Variation**

Delete a product variation.

**Required permission:** `products/delete`

- **operationId:** `deleteVariation`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `variantId` | path | yes | integer | The variation ID to delete |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/delete`). |
| `422` | Validation failed, or the referenced record does not exist. |
