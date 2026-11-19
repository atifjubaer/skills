# GET Get Product License Settings

## `GET /licensing/products/{id}/settings`

**GET Get Product License Settings**

Retrieve the license configuration for a specific product, including per-variation activation limits and validity periods.

**Permission:** `licenses/view` · **Policy:** `LicensePolicy`

- **operationId:** `getProductLicenseSettings`
- **tags:** Licensing

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The product ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
