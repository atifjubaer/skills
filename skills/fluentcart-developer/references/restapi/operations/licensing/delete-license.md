# DELETE Delete License

## `DELETE /licensing/licenses/{id}/delete`

**DELETE Delete License**

Permanently delete a license and all its associated data.

**Permission:** `licenses/delete` · **Policy:** `LicensePolicy`

- **operationId:** `deleteLicense`
- **tags:** Licensing

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The license ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
