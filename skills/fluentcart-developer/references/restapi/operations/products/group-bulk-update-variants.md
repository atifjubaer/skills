# POST Group Bulk Update Variants

## `POST /products/variants/group-bulk-update`

**POST Group Bulk Update Variants**

Apply a partial (PATCH-style) update to a group of product variants at once. Any field left null or omitted in the payload is skipped for every variant in the group; only the provided non-null fields are written. For `other_info`, only the supplied non-null sub-keys are merged into each variant's existing JSON rather than replacing it outright. All variants in `variant_ids` must belong to the same product, and `sku` can only be set when exactly one variant is targeted (SKUs must stay unique).

**Required permission:** `products/edit`

- **operationId:** `groupBulkUpdate`
- **tags:** Products

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "variant_ids"
  ],
  "properties": {
    "variant_ids": {
      "type": "array",
      "items": {
        "type": "integer"
      },
      "description": "IDs of the variants to update. All must belong to the same product."
    },
    "sku": {
      "type": "string",
      "maxLength": 30,
      "nullable": true,
      "description": "New SKU. Only accepted when variant_ids contains exactly one ID. An empty string clears the SKU. Must be unique."
    },
    "item_price": {
      "type": "number",
      "description": "New sale price in cents, applied to every targeted variant."
    },
    "compare_price": {
      "type": "number",
      "description": "New compare-at price in cents. Ignored per-row if it would be less than the effective item_price for that row."
    },
    "manage_stock": {
      "type": "integer",
      "enum": [
        0,
        1
      ],
      "description": "Whether to track stock for the targeted variants."
    },
    "total_stock": {
      "type": "integer",
      "description": "New total stock quantity."
    },
    "fulfillment_type": {
      "type": "string",
      "enum": [
        "physical",
        "digital"
      ],
      "description": "New fulfillment type."
    },
    "manage_cost": {
      "type": "string",
      "enum": [
        "true",
        "false"
      ],
      "description": "Whether to track cost of goods for the targeted variants."
    },
    "item_cost": {
      "type": "number",
      "description": "New cost of goods in cents."
    },
    "other_info": {
      "type": "object",
      "description": "Partial delta merged into each variant's existing other_info JSON (e.g. payment_type, repeat_interval, signup_fee). Only non-null sub-keys are applied. signup_fee, when present, is also in cents."
    }
  },
  "example": {
    "variant_ids": [
      456,
      457
    ],
    "item_price": 8900,
    "manage_stock": 1,
    "total_stock": 50
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Variants updated successfully. |
| `401` | Authentication required. |
| `403` | The current user lacks the products/edit permission. |
| `404` | One or more variant IDs do not exist. |
| `422` | No valid variant IDs/updates provided, variants span more than one product, or a subscription variant is missing a billing interval. |
