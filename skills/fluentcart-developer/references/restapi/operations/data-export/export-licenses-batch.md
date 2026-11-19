# POST Export Licenses Batch

## `POST /data-export/licenses/batch`

**POST Export Licenses Batch**

Export one batch of licenses. This endpoint is **cursor-paginated and self-throttling**: it returns as many records as fit inside a runtime and response-size budget, then hands back a `cursor` and `has_more`.

**Loop until `has_more` is `false`**, passing the previous `cursor` each time and preferring the returned `batch.next_max` as the next `max_records`. `total` is only computed on the first call and is `null` thereafter.

::: warning Module-gated
These routes are only **registered** when the licensing module is active (`ModuleSettings::isActive('license')`). When it is off the endpoint does not exist at all and WordPress returns `404 rest_no_route` — not the `409` below.
:::

**Permission:** `licenses/export` · **Policy:** `LicensePolicy`

- **operationId:** `exportLicensesBatch`
- **tags:** Data Export

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "format": {
      "type": "string",
      "enum": [
        "csv",
        "json"
      ],
      "default": "csv",
      "description": "`csv` yields flat records keyed by `columns`; `json` yields nested records keyed by `modules`."
    },
    "scope": {
      "type": "string",
      "enum": [
        "current_page",
        "selected",
        "search_results",
        "all"
      ],
      "default": "all",
      "description": "`all` ignores `filters` entirely. `current_page` and `selected` both require a non-empty `ids` array."
    },
    "ids": {
      "type": "array",
      "items": {
        "type": "integer"
      },
      "description": "Record IDs. Required when `scope` is `current_page` or `selected`. Truncated to the first 5000; deduplicated."
    },
    "columns": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Column keys from `csv_columns`. Unknown keys are dropped. Required (after filtering) when `format` is `csv`. Capped at 100 entries."
    },
    "modules": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Module keys from `json_modules`. Unknown keys are dropped. Capped at 100 entries."
    },
    "filters": {
      "type": "object",
      "properties": {
        "filter_type": {
          "type": "string"
        },
        "search": {
          "type": "string"
        },
        "active_view": {
          "type": "string"
        },
        "sort_by": {
          "type": "string"
        },
        "sort_type": {
          "type": "string"
        },
        "advanced_filters": {
          "type": "string",
          "description": "JSON-encoded filter groups; truncated at 100,000 characters."
        },
        "user_tz": {
          "type": "string"
        }
      },
      "example": {
        "filter_type": "simple",
        "search": "",
        "active_view": "all"
      }
    },
    "cursor": {
      "type": "integer",
      "default": 0,
      "description": "Continuation token from the previous response. Omit or send `0` for the first batch."
    },
    "max_records": {
      "type": "integer",
      "default": 500,
      "minimum": 100,
      "maximum": 1000,
      "description": "Records to return. Clamped into the 100–1000 range."
    }
  },
  "example": {
    "format": "csv",
    "scope": "all",
    "columns": [
      "license_id"
    ],
    "max_records": 500
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | Forbidden — the user lacks `licenses/export`. |
| `409` | The module backing this entity is not active. |
| `413` | A single record exceeded the response size budget. Lower `max_records`, or reduce the selected `columns`/`modules`. |
| `422` | Invalid `format` or `scope`; or `scope` is `current_page`/`selected` with no `ids`; or `format` is `csv` and no valid `columns` remained after filtering. |
