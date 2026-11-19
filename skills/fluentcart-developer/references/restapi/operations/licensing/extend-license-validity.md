# POST Extend License Validity

## `POST /licensing/licenses/{id}/extend-validity`

**POST Extend License Validity**

Change the expiration date of a license. Can extend, reduce, or set to lifetime. If the license status is not `active` or `inactive`, it will be automatically set to `active`.

**Permission:** `licenses/manage` · **Policy:** `LicensePolicy`

- **operationId:** `extendLicenseValidity`
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
    "expiration_date"
  ],
  "properties": {
    "expiration_date": {
      "type": "string",
      "description": "New expiration date in `YYYY-MM-DD HH:MM:SS` format, or the string `lifetime` to remove expiration"
    }
  },
  "example": {
    "expiration_date": "2027-06-15 00:00:00"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `423` | Invalid expiration date |
