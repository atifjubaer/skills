# GET Get Customer Licenses (Admin)

## `GET /licensing/licenses/customer/{id}`

**GET Get Customer Licenses (Admin)**

Retrieve a paginated list of licenses belonging to a specific customer.

**Permission:** `licenses/view` · **Policy:** `LicensePolicy`

- **operationId:** `getCustomerLicensesAdmin`
- **tags:** Licensing

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The customer ID |
| `page` | query | no | integer | Page number for pagination (default: 1) |
| `per_page` | query | no | integer | Number of records per page (default: 10) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
