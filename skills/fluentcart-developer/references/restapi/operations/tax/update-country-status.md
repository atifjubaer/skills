# POST Update Country Tax Status

## `POST /tax/country-status/{country_code}`

**POST Update Country Tax Status**

Enable or disable tax collection for a specific country. Accepts an ISO 3166-1 alpha-2 country code or the special code EU to toggle the whole EU group. By default every country is enabled; disabling stores a flag in the fct_meta table.

**Required permission:** `store/sensitive`

- **operationId:** `updateCountryStatus`
- **tags:** Tax

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `country_code` | path | yes | string | ISO 3166-1 alpha-2 country code (e.g., US, DE) or EU for the EU group |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "enabled"
  ],
  "properties": {
    "enabled": {
      "type": "integer",
      "enum": [
        0,
        1
      ],
      "description": "1 to enable tax for the country, 0 to disable",
      "example": 1
    }
  },
  "example": {
    "enabled": 1
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Country tax status updated. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/sensitive`). |
| `422` | Invalid country code or validation failed. |
