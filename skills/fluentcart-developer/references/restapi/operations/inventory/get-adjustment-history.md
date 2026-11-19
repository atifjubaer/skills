# GET Get Adjustment History

## `GET /inventory/adjustment-history`

**GET Get Adjustment History**

Return the stock-adjustment audit trail for a single variant, newest first, capped at the **100** most recent entries.

**Permission:** `products/view` · **Policy:** `ProductPolicy`

- **operationId:** `getInventoryAdjustmentHistory`
- **tags:** Advanced Inventory

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `variant_id` | query | yes | integer | ID of the product variant. **Required** — the endpoint returns `400` without it. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `400` | `variant_id` was not supplied. |
| `403` | Forbidden — the authenticated user lacks the required permission. |
