# GET Get Orders Export Schema

## `GET /data-export/orders/schema`

**GET Get Orders Export Schema**

Describe what can be exported for orders: the supported output formats, the selectable flat CSV columns, and the selectable nested JSON modules.

Call this first — the `key` values it returns are exactly what the matching `/batch` endpoint accepts in `columns` and `modules`. Unknown keys sent to `/batch` are silently dropped.

**Permission:** `orders/export` · **Policy:** `OrderPolicy`

- **operationId:** `getOrdersExportSchema`
- **tags:** Data Export

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | Forbidden — the user lacks `orders/export`. |
