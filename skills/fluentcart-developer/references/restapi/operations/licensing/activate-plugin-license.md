# POST Activate Plugin License

## `POST /settings/license/`

**POST Activate Plugin License**

Activate a FluentCart Pro license key on this WordPress site.

**Policy:** `AdminPolicy`

- **operationId:** `activatePluginLicense`
- **tags:** Licensing

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "license_key"
  ],
  "properties": {
    "license_key": {
      "type": "string",
      "description": "The FluentCart Pro license key to activate"
    }
  },
  "example": {
    "license_key": "DTPRO-A1B2-C3D4-E5F6"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `400` | Invalid license key or activation failed |
