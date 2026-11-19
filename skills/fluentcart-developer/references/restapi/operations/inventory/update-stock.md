# POST Update Stock

## `POST /inventory/update-stock`

**POST Update Stock**

Set the absolute stock level for one variant and record a stock-adjustment entry.

`available` is recalculated as `new_stock - committed - on_hold`, floored at 0. A negative `new_stock` is clamped to 0.

**Permission:** `products/edit` · **Policy:** `ProductPolicy`

- **operationId:** `updateInventoryStock`
- **tags:** Advanced Inventory

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "variant_id": {
      "type": "integer",
      "description": "ID of the variant to update."
    },
    "post_id": {
      "type": "integer",
      "description": "ID of the parent product. Must match the variant's `post_id` or the request 404s."
    },
    "new_stock": {
      "type": "integer",
      "description": "Absolute new `total_stock`. Values below 0 are clamped to 0."
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
    }
  },
  "required": [
    "variant_id",
    "post_id",
    "new_stock",
    "reason"
  ],
  "example": {
    "variant_id": 22,
    "post_id": 31562,
    "new_stock": 12,
    "reason": "received"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `400` | Missing `variant_id`, `post_id` or `new_stock`; or an invalid `reason`; or `reason` is `other` with an empty `customReason`. |
| `403` | Forbidden — the authenticated user lacks the required permission. |
| `404` | No variant matches that `variant_id` / `post_id` pair. |
