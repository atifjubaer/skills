# PUT Update Tax Rate

## `PUT /tax/country/rate/{id}`

**PUT Update Tax Rate**

Update an existing tax rate.

**Required permission:** `store/sensitive`

- **operationId:** `updateTaxRate`
- **tags:** Tax

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | Tax rate ID |

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
      "description": "Tax rate percentage (e.g., \"19.0000\")",
      "example": "21.0000"
    },
    "name": {
      "type": "string",
      "description": "Display name for the tax rate (max 45 characters)",
      "example": "FR Standard Tax (Updated)"
    },
    "group": {
      "type": "string",
      "description": "Geographic group/continent code (max 45 characters)",
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
      "description": "Whether this rate is compound (0 or 1)",
      "enum": [
        0,
        1
      ],
      "example": 0
    },
    "for_shipping": {
      "type": "integer",
      "nullable": true,
      "description": "Shipping tax override rate"
    },
    "for_order": {
      "type": "integer",
      "description": "Whether this rate applies at order level (0 or 1)",
      "enum": [
        0,
        1
      ],
      "example": 0
    }
  },
  "example": {
    "class_id": 1,
    "rate": "21.0000",
    "name": "FR Standard Tax (Updated)"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Tax rate updated successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/sensitive`). |
| `422` | Validation failed, or the referenced record does not exist. |
