# POST Deactivate License

## `POST /?fluent-cart=deactivate_license`

**POST Deactivate License**

Deactivate a license from a specific site URL. Removes the site activation and decrements the activation count. This is a public endpoint that does not use the WordPress REST API. No authentication required.

- **operationId:** `publicDeactivateLicense`
- **tags:** Licensing

### Request body

`application/x-www-form-urlencoded`

```json
{
  "type": "object",
  "required": [
    "license_key",
    "item_id",
    "site_url"
  ],
  "properties": {
    "license_key": {
      "type": "string",
      "description": "The license key to deactivate"
    },
    "item_id": {
      "type": "string",
      "description": "The product ID (must match the license's product)"
    },
    "site_url": {
      "type": "string",
      "description": "The site URL to deactivate"
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `422` | Deactivation error |
