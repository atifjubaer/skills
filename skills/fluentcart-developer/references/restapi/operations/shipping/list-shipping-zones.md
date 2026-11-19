# GET List Shipping Zones

## `GET /shipping/zones`

**GET List Shipping Zones**

Retrieve a paginated list of shipping zones with filtering and sorting capabilities.

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `listShippingZones`
- **tags:** Shipping

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `search` | query | no | string | Search zones by name |
| `per_page` | query | no | integer | Number of results per page (default: 10, max: 200) |
| `page` | query | no | integer | Page number for pagination |
| `sort_by` | query | no | string | Column to sort by (default: order) |
| `sort_type` | query | no | string | Sort direction: asc or desc (default: asc) |
| `filter_type` | query | no | string | Filter type: simple or advanced |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns a paginated list of shipping zones. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
