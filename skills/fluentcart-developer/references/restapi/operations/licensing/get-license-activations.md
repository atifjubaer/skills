# GET Get License Activations

## `GET /customer-profile/licenses/{license_key}/activations`

**GET Get License Activations**

Retrieve all site activations for a specific license belonging to the currently logged-in customer.

**Policy:** `CustomerFrontendPolicy`

- **operationId:** `getLicenseActivations`
- **tags:** Licensing

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `license_key` | path | yes | string | The license key (alphanumeric with dashes) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `422` | License not found |
