# GET Get License Summary

## `GET /reports/license-summary`

**GET Get License Summary**

Returns license counts by current status, total activated sites and the number of licensed products. The date range does not apply.

This is a core route, but it reads the `fct_licenses` table that the FluentCart Pro licensing module creates. Without that table the query throws a database error.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getLicenseSummary`
- **tags:** Reports

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
