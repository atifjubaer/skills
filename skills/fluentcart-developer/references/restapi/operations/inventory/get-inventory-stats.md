# GET Get Inventory Stats

## `GET /inventory/stats`

**GET Get Inventory Stats**

Return counts of stock-managed variants bucketed by availability. The low-stock boundary defaults to **10** units and is filterable via `fluent_cart/inventory_low_stock_threshold`.

Buckets are computed on `available` (not `total_stock`): `outOfStock` is `available <= 0`, `lowStock` is `0 < available <= threshold`, and `inStock` is `available > threshold`.

**Permission:** `products/view` · **Policy:** `ProductPolicy`

- **operationId:** `getInventoryStats`
- **tags:** Advanced Inventory

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | Forbidden — the authenticated user lacks the required permission. |
