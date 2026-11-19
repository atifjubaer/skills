# GET Get License Details

## `GET /licensing/licenses/{id}`

**GET Get License Details**

Retrieve the full details of a single license including the associated order, activations, product information, downloads, labels, and previous orders.

**Permission:** `licenses/view` · **Policy:** `LicensePolicy`

- **operationId:** `getLicenseDetails`
- **tags:** Licensing

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The license ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `404` | License not found |
