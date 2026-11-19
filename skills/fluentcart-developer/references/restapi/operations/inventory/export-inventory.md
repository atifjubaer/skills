# POST Export Inventory

## `POST /inventory/export`

**POST Export Inventory**

Build a CSV of stock-managed variants and return it **inline as a string** — this endpoint does not return a file download or a URL; the client is expected to turn `csvData` into a file itself.

`inventoryState: "available"` emits `ID, SKU, Product Title, Variation Title, Available`. `inventoryState: "full"` additionally emits `Total Stock`, `On Hold` and `Delivered`.

**Permission:** `products/view` · **Policy:** `ProductPolicy`

- **operationId:** `exportInventory`
- **tags:** Advanced Inventory

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "scope": {
      "type": "string",
      "enum": [
        "all",
        "current_page",
        "selected"
      ],
      "description": "`all` exports every stock-managed variant; `current_page` caps the query at 1000 rows; `selected` restricts to the IDs in `items`."
    },
    "inventoryState": {
      "type": "string",
      "enum": [
        "available",
        "full"
      ],
      "description": "Which columns to emit."
    },
    "format": {
      "type": "string",
      "enum": [
        "csv_spreadsheet",
        "csv"
      ],
      "default": "csv_spreadsheet",
      "description": "`csv_spreadsheet` prefixes the payload with a UTF-8 BOM so Excel opens it correctly. Any other value omits the BOM."
    },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer"
          }
        }
      },
      "description": "Variant IDs, read only when `scope` is `selected`."
    }
  },
  "required": [
    "scope",
    "inventoryState"
  ],
  "example": {
    "scope": "all",
    "inventoryState": "full",
    "format": "csv_spreadsheet"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `400` | Invalid `scope` or invalid `inventoryState`. |
| `403` | Forbidden — the authenticated user lacks the required permission. |
