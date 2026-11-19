# POST Save Shipping Tax Override

## `POST /tax/rates/country/override`

**POST Save Shipping Tax Override**

Set a shipping-specific tax override on an existing tax rate.

**Required permission:** `store/sensitive`

- **operationId:** `saveShippingTaxOverride`
- **tags:** Tax

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "id",
    "override_tax_rate"
  ],
  "properties": {
    "id": {
      "type": "integer",
      "description": "Tax rate ID to apply the shipping override to",
      "example": 5
    },
    "override_tax_rate": {
      "type": "integer",
      "description": "The override tax rate value to use for shipping",
      "example": 7
    }
  },
  "example": {
    "id": 5,
    "override_tax_rate": 7
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Shipping tax override saved successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/sensitive`). |
| `404` | Tax rate not found. |
| `422` | Validation failed, or the referenced record does not exist. |
