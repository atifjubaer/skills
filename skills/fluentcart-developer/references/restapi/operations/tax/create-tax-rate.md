# POST Create Tax Rate

## `POST /tax/country/rate`

**POST Create Tax Rate**

Create a new tax rate entry for a country.

**Required permission:** `store/sensitive`

- **operationId:** `createTaxRate`
- **tags:** Tax

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "class_id"
  ],
  "properties": {
    "class_id": {
      "type": "integer",
      "description": "ID of the tax class this rate belongs to",
      "example": 1
    },
    "country": {
      "type": "string",
      "description": "ISO 3166-1 alpha-2 country code (max 45 characters)",
      "example": "FR"
    },
    "state": {
      "type": "string",
      "description": "State/province code (max 45 characters)",
      "example": ""
    },
    "postcode": {
      "type": "string",
      "description": "Postcode/ZIP code (max 45 characters)",
      "example": ""
    },
    "city": {
      "type": "string",
      "description": "City name (max 45 characters)",
      "example": ""
    },
    "rate": {
      "type": "string",
      "description": "Tax rate percentage (e.g., \"19.0000\", max 45 characters)",
      "example": "20.0000"
    },
    "name": {
      "type": "string",
      "description": "Display name for the tax rate (max 45 characters)",
      "example": "FR Standard Tax"
    },
    "group": {
      "type": "string",
      "description": "Geographic group/continent code (e.g., EU, NA, max 45 characters)",
      "example": "EU"
    },
    "priority": {
      "type": "integer",
      "description": "Priority for rate application order (min: 1)",
      "minimum": 1,
      "example": 1
    },
    "is_compound": {
      "type": "integer",
      "description": "Whether this rate is compound (0 or 1, default: 0)",
      "enum": [
        0,
        1
      ],
      "default": 0,
      "example": 0
    },
    "for_shipping": {
      "type": "integer",
      "nullable": true,
      "description": "Shipping tax override rate. null means no override",
      "example": null
    },
    "for_order": {
      "type": "integer",
      "description": "Whether this rate applies at order level (0 or 1, default: 0)",
      "enum": [
        0,
        1
      ],
      "default": 0,
      "example": 0
    }
  },
  "example": {
    "class_id": 1,
    "country": "FR",
    "rate": "20.0000",
    "name": "FR Standard Tax",
    "group": "EU",
    "priority": 1
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Tax rate created successfully. |
| `400` | Validation error. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/sensitive`). |
| `422` | Validation failed, or the referenced record does not exist. |
