# POST Activate License

## `POST /?fluent-cart=activate_license`

**POST Activate License**

Activate a license key on a specific site URL. If the site is already activated for this license, the existing activation details are returned. Local/staging sites are detected automatically and do not count toward the activation limit. This is a public endpoint that does not use the WordPress REST API. No authentication required.

- **operationId:** `publicActivateLicense`
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
      "description": "The license key to activate"
    },
    "item_id": {
      "type": "string",
      "description": "The product ID (must match the license's product)"
    },
    "site_url": {
      "type": "string",
      "description": "The site URL to activate"
    },
    "server_version": {
      "type": "string",
      "description": "The server software version (e.g., PHP version)"
    },
    "platform_version": {
      "type": "string",
      "description": "The platform version (e.g., WordPress version)"
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `422` | Activation error |
