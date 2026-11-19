# GET Get Customers Export Schema

## `GET /data-export/customers/schema`

**GET Get Customers Export Schema**

Describe what can be exported for customers: the supported output formats, the selectable flat CSV columns, and the selectable nested JSON modules.

Call this first — the `key` values it returns are exactly what the matching `/batch` endpoint accepts in `columns` and `modules`. Unknown keys sent to `/batch` are silently dropped.

**Permission:** `customers/export` · **Policy:** `CustomerPolicy`

- **operationId:** `getCustomersExportSchema`
- **tags:** Data Export

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | Forbidden — the user lacks `customers/export`. |
