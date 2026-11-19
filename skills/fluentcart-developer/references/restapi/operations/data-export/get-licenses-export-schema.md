# GET Get Licenses Export Schema

## `GET /data-export/licenses/schema`

**GET Get Licenses Export Schema**

Describe what can be exported for licenses: the supported output formats, the selectable flat CSV columns, and the selectable nested JSON modules.

Call this first — the `key` values it returns are exactly what the matching `/batch` endpoint accepts in `columns` and `modules`. Unknown keys sent to `/batch` are silently dropped.

::: warning Module-gated
These routes are only **registered** when the licensing module is active (`ModuleSettings::isActive('license')`). When it is off the endpoint does not exist at all and WordPress returns `404 rest_no_route` — not the `409` below.
:::

**Permission:** `licenses/export` · **Policy:** `LicensePolicy`

- **operationId:** `getLicensesExportSchema`
- **tags:** Data Export

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | Forbidden — the user lacks `licenses/export`. |
| `409` | The licensing module is not active. |
