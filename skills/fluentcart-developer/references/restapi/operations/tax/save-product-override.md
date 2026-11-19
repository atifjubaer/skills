# POST Save Product Category Tax Override

## `POST /tax/product-overrides`

**POST Save Product Category Tax Override**

Create or update a product category tax override. Pass id to update an existing override. Without id, an existing override matching the same category, location, and tax class is updated in place; otherwise a new override is created. Pass source_type "shipping" with source_id to convert an existing shipping tax override into a product override (the shipping override is removed).

**Required permission:** `store/sensitive`

- **operationId:** `saveProductOverride`
- **tags:** Tax

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "country",
    "category_id"
  ],
  "properties": {
    "id": {
      "type": "integer",
      "description": "Existing override ID to update (omit to create or upsert by category/location/class)",
      "example": 12
    },
    "country": {
      "type": "string",
      "description": "ISO 3166-1 alpha-2 country code",
      "example": "DE"
    },
    "state": {
      "type": "string",
      "description": "State/province code (optional)",
      "example": ""
    },
    "city": {
      "type": "string",
      "description": "City name (optional, max 45 characters)",
      "example": ""
    },
    "postcode": {
      "type": "string",
      "description": "Postcode/ZIP code (optional)",
      "example": ""
    },
    "category_id": {
      "type": "integer",
      "description": "Product category (product-categories term) ID",
      "example": 15
    },
    "tax_label": {
      "type": "string",
      "description": "Display label for the override tax",
      "example": "Reduced VAT"
    },
    "override_state_tax": {
      "type": "string",
      "enum": [
        "yes",
        "no"
      ],
      "description": "Whether the override replaces state-level tax (default: no)",
      "example": "no"
    },
    "rate": {
      "type": "number",
      "description": "Override tax rate percentage (negative values are clamped to 0)",
      "example": 7
    },
    "class_id": {
      "type": "integer",
      "description": "Tax class ID the override applies to (0 = none; must exist when non-zero)",
      "example": 1
    },
    "source_type": {
      "type": "string",
      "description": "Set to \"shipping\" together with source_id to convert a shipping override into this product override",
      "example": ""
    },
    "source_id": {
      "type": "integer",
      "description": "Tax rate ID of the shipping override being converted (used with source_type \"shipping\")",
      "example": 0
    }
  },
  "example": {
    "country": "DE",
    "category_id": 15,
    "tax_label": "Reduced VAT",
    "override_state_tax": "no",
    "rate": 7,
    "class_id": 1
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Override saved or updated. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/sensitive`). |
| `404` | Override (or shipping override source) not found. |
| `422` | Validation failed — missing country/category, invalid country code, invalid tax class, invalid product category, or a conflicting override already exists for the same category, location, and tax class. |
