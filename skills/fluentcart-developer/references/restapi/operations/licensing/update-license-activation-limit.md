# POST Update License Activation Limit

## `POST /licensing/licenses/{id}/update_limit`

**POST Update License Activation Limit**

Change the maximum number of site activations allowed for a license.

**Permission:** `licenses/manage` · **Policy:** `LicensePolicy`

- **operationId:** `updateLicenseActivationLimit`
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
    "limit"
  ],
  "properties": {
    "limit": {
      "oneOf": [
        {
          "type": "integer"
        },
        {
          "type": "string"
        }
      ],
      "description": "New activation limit. Use a positive integer for a specific limit, or `0` / `\"unlimited\"` for unlimited activations"
    }
  },
  "example": {
    "limit": 10
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
