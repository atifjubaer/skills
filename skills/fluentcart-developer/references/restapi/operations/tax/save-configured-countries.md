# POST Save Configured Countries

## `POST /tax/configuration/countries`

**POST Save Configured Countries**

Generate tax classes and import tax rates for the specified countries from the built-in rates data. Countries that already have rates in the database are skipped.

**Required permission:** `store/sensitive`

- **operationId:** `saveConfiguredCountries`
- **tags:** Tax

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "countries"
  ],
  "properties": {
    "countries": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Array of ISO 3166-1 alpha-2 country codes to configure",
      "example": [
        "DE",
        "FR",
        "IT",
        "ES"
      ]
    }
  },
  "example": {
    "countries": [
      "DE",
      "FR",
      "IT",
      "ES"
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Countries saved successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/sensitive`). |
| `422` | Validation failed, or the referenced record does not exist. |
