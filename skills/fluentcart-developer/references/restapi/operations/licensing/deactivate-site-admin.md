# POST Deactivate Site (Admin)

## `POST /licensing/licenses/{id}/deactivate_site`

**POST Deactivate Site (Admin)**

Deactivate a specific site activation from a license using the activation ID.

**Permission:** `licenses/manage` · **Policy:** `LicensePolicy`

- **operationId:** `deactivateSiteAdmin`
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
    "activation_id"
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
    "activation_id": {
      "oneOf": [
        {
          "type": "integer"
        },
        {
          "type": "string"
        }
      ],
      "description": "The activation record ID to deactivate"
    }
  },
  "example": {
    "id": 1,
    "activation_id": 5
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `422` | Error response |
