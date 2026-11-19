# GET Get Customer License Details

## `GET /customer-profile/licenses/{license_key}`

**GET Get Customer License Details**

Retrieve full details of a specific license for the currently logged-in customer.

**Policy:** `CustomerFrontendPolicy`

- **operationId:** `getCustomerLicenseDetails`
- **tags:** Licensing

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `license_key` | path | yes | string | The license key (alphanumeric with dashes) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `422` | License not found for this customer, or no customer could be resolved for the current user. Both causes return 422 — the controller's `sendError()` calls use the framework default status. |
