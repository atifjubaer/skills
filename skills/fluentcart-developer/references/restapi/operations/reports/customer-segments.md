# GET Get Customer Segments

## `GET /reports/customer-segments`

**GET Get Customer Segments**

Places every customer with a paid order in the report currency into one RFM segment, as of now. Amounts are in cents and use the Revenue report's net sales. The date range is ignored.

Recency (days since the last order) and money (lifetime net) score 1-5 by the store's own quintiles (`cuts`, read from at most 20,000 customers). Frequency scores by order count: 1, 2, 3, 4-5, 6+. Segments, in order: `champions`, `loyal`, `new`, `promising`, `at_risk`, `cant_lose`, `hibernating`. Pass `cuts` and `as_of` to [Get Customer Segment Customers](/restapi/operations/reports/customer-segment-customers) so the export reads the same segments.

**Requires FluentCart Pro.** Without Pro this route is not registered and returns 404.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getCustomerSegments`
- **tags:** Reports

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `params[currency]` | query | no | string | 3-letter currency code, or `__all__` for all currencies converted to the base currency. Default: the base currency. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
