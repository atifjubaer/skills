# GET Get License Version

## `GET /?fluent-cart=get_license_version`

**GET Get License Version**

Retrieve the latest version information for a licensed product. This endpoint is designed to integrate with WordPress plugin/theme update mechanisms. It returns version data, changelog, download links, and banner/icon URLs. This is a public endpoint that does not use the WordPress REST API. No authentication required.

- **operationId:** `publicGetLicenseVersion`
- **tags:** Licensing

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `item_id` | query | yes | string | The product ID |
| `license_key` | query | no | string | License key for authenticated download links. Required if `activation_hash` is not provided |
| `activation_hash` | query | no | string | Activation hash for authenticated download links. Required if `license_key` is not provided |
| `site_url` | query | no | string | The site URL making the request |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `422` | Product or license settings error |
