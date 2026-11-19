# POST Deactivate Site (Customer)

## `POST /customer-profile/licenses/{license_key}/deactivate_site`

**POST Deactivate Site (Customer)**

Deactivate a specific site from a license. The customer can only deactivate sites from their own licenses.

**Policy:** `CustomerFrontendPolicy`

- **operationId:** `deactivateSiteCustomer`
- **tags:** Licensing

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `license_key` | path | yes | string | The license key (alphanumeric with dashes) |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "site_url"
  ],
  "properties": {
    "site_url": {
      "type": "string",
      "description": "The site URL to deactivate"
    }
  },
  "example": {
    "site_url": "example.com"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `422` | License not found or site not activated |
