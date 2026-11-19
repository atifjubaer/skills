# POST Regenerate License Key

## `POST /licensing/licenses/{id}/regenerate-key`

**POST Regenerate License Key**

Generate a new random license key for an existing license. The old key is immediately invalidated.

**Permission:** `licenses/manage` · **Policy:** `LicensePolicy`

- **operationId:** `regenerateLicenseKey`
- **tags:** Licensing

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The license ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
