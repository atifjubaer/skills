# GET List Customer Licenses

## `GET /customer-profile/licenses/`

**GET List Customer Licenses**

Retrieve a paginated list of licenses belonging to the currently logged-in customer.

**Policy:** `CustomerFrontendPolicy`

- **operationId:** `listCustomerLicenses`
- **tags:** Licensing

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `page` | query | no | integer | Page number for pagination (default: 1) |
| `per_page` | query | no | integer | Number of records per page (default: 10) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
