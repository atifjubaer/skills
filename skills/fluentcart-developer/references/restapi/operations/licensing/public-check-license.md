# GET Check License

## `GET /?fluent-cart=check_license`

**GET Check License**

Verify the validity of a license key and check its activation status for a specific site. This is a public endpoint that does not use the WordPress REST API -- it uses query parameter-based URLs on the site's front end. No authentication required.

- **operationId:** `publicCheckLicense`
- **tags:** Licensing

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `license_key` | query | no | string | The license key to check. Required if `activation_hash` is not provided |
| `activation_hash` | query | no | string | The activation hash from a previous activation. Required if `license_key` is not provided |
| `item_id` | query | yes | string | The product ID (must match the license's product) |
| `site_url` | query | yes | string | The site URL making the request |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `422` | Validation or license error |
