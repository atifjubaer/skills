# POST Activate Site (Admin)

## `POST /licensing/licenses/{id}/activate_site`

**POST Activate Site (Admin)**

Manually activate a site URL on a license from the admin panel.

**Permission:** `licenses/manage` · **Policy:** `LicensePolicy`

- **operationId:** `activateSiteAdmin`
- **tags:** Licensing

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The license ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "id",
    "url"
  ],
  "properties": {
    "id": {
      "oneOf": [
        {
          "type": "integer"
        },
        {
          "type": "string"
        }
      ],
      "description": "The license ID or key (used by the service internally)"
    },
    "url": {
      "type": "string",
      "description": "The site URL to activate"
    }
  },
  "example": {
    "id": 1,
    "url": "https://my-client-site.com"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `423` | Error response |
