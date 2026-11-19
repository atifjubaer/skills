# POST Update License Status

## `POST /licensing/licenses/{id}/update_status`

**POST Update License Status**

Change the status of a license.

**Permission:** `licenses/manage` · **Policy:** `LicensePolicy`

- **operationId:** `updateLicenseStatus`
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
    "status"
  ],
  "properties": {
    "status": {
      "type": "string",
      "enum": [
        "active",
        "disabled",
        "expired"
      ],
      "description": "New status. One of: `active`, `disabled`, `expired`"
    }
  },
  "example": {
    "status": "disabled"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `423` | Invalid status |
