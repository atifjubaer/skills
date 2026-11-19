# GET List Inventory

## `GET /inventory`

**GET List Inventory**

Retrieve a paginated list of stock-managed products with their variants. Only products whose detail row **and** at least one variant have `manage_stock = 1` are returned.

**Permission:** `products/view` · **Policy:** `ProductPolicy`

- **operationId:** `listInventory`
- **tags:** Advanced Inventory

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `page` | query | no | integer | Page number for pagination. |
| `per_page` | query | no | integer | Records per page. |
| `search` | query | no | string | Search term. Matches product title, and variant SKU or variation title. Also supports operator syntax (e.g. `sku = TES-RED-XS`). |
| `sort_by` | query | no | string | Column to sort by (default: `id`). |
| `sort_type` | query | no | string | Sort direction. |
| `active_view` | query | no | string | Tab filter: `all`, `low_stock` or `out_of_stock`. |
| `filter_type` | query | no | string | Filter mode. |
| `advanced_filters` | query | no | string | JSON-encoded array of advanced filter groups. |
| `with` | query | no | string | Eager-load relations. Allowlisted values: `admin_inventory_list` (both relations, variant columns narrowed — used by the admin table), `detail`, and `variants`. Extendable via the `fluent_cart/inventory_allowed_withs` filter. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | Forbidden — the authenticated user lacks the required permission. |
