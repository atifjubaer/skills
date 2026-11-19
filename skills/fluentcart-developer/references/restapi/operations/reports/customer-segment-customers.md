# GET Get Customer Segment Customers

## `GET /reports/customer-segment-customers`

**GET Get Customer Segment Customers**

Lists the customers of one RFM segment for a CSV export, highest lifetime net first. `net` is in cents and uses the Revenue report's net sales.

Also needs the `customers/export` permission; without it the route returns 403. An unknown `segment` returns `{"total": 0, "data": []}`.

**Requires FluentCart Pro.** Without Pro this route is not registered and returns 404.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getCustomerSegmentCustomers`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `segment` | query | yes | string | Top-level. Segment key. |
| `page` | query | no | integer | Top-level. Page number. Default `1`. |
| `per_page` | query | no | integer | Top-level. Rows per page, 1-1000. Default `1000`. |
| `cuts[days][]` | query | no | array | Top-level. Four recency cut points from Get Customer Segments. Ignored unless both `cuts[days]` and `cuts[net]` hold four values. |
| `cuts[net][]` | query | no | array | Top-level. Four money cut points (cents) from Get Customer Segments. |
| `as_of` | query | no | string | Top-level. UTC time `Y-m-d H:i:s` from Get Customer Segments. Default: now. |
| `params[currency]` | query | no | string | 3-letter currency code, or `__all__` for all currencies converted to the base currency. Default: the base currency. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
