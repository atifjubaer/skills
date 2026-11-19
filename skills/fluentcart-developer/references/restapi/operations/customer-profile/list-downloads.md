# GET List Downloads

## `GET /customer-profile/downloads`

**GET List Downloads**

Retrieve a paginated list of downloadable files available to the authenticated customer. Only includes downloads from orders with a successful payment status. Filters downloads based on purchased product variations.

**Access policy:** `CustomerFrontendPolicy`

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `listDownloads`
- **tags:** Customer Profile

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `page` | query | no | integer | Page number for pagination (default: 1) |
| `per_page` | query | no | integer | Number of items per page (default: 10) |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns a paginated list of downloadable files. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
