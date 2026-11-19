# POST Bulk Update Stock

## `POST /inventory/bulk-update`

**POST Bulk Update Stock**

Adjust stock for many variants at once. `mode: "set"` writes `value` as the new absolute stock; `mode: "add"` adds `value` to each variant's current stock (use a negative `value` to subtract). Results are clamped at 0.

IDs that do not resolve to an existing variant are **skipped silently** — compare `count` against the number of items you sent to detect this. An empty `items` array is a successful no-op.

**Permission:** `products/edit` · **Policy:** `ProductPolicy`

- **operationId:** `bulkUpdateInventoryStock`
- **tags:** Advanced Inventory

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "mode": {
      "type": "string",
      "enum": [
        "add",
        "set"
      ],
      "description": "`set` writes an absolute value; `add` applies a delta."
    },
    "value": {
      "type": "integer",
      "description": "The absolute value or the delta, per `mode`."
    },
    "reason": {
      "type": "string",
      "enum": [
        "received",
        "damage",
        "return",
        "correction",
        "transfer",
        "other"
      ],
      "description": "Why the stock changed. One of `received` (Received Stock), `damage` (Damage/Loss), `return` (Return/Refund), `correction` (Count Correction), `transfer` (Inventory Transfer) or `other`. When `other` is used, `customReason` becomes required."
    },
    "customReason": {
      "type": "string",
      "description": "Free-text reason. Required when `reason` is `other`."
    },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "description": "Variant ID."
          }
        }
      },
      "description": "Variants to update. Only the `id` key is read."
    }
  },
  "required": [
    "mode",
    "value",
    "reason",
    "items"
  ],
  "example": {
    "mode": "add",
    "value": 5,
    "reason": "received",
    "items": [
      {
        "id": 22
      },
      {
        "id": 23
      }
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `400` | Invalid `mode` (allowed: `add`, `set`) or invalid `reason`. |
| `403` | Forbidden — the authenticated user lacks the required permission. |
