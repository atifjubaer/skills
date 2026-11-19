# GET List Order Bumps

## `GET /order_bump`

**GET List Order Bumps**

Retrieve a paginated list of order bumps with optional filtering, sorting, and search.

**Permission:** `store/sensitive` · **Policy:** `OrderBumpPolicy`

- **operationId:** `listOrderBumps`
- **tags:** Order Bumps

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `sort_by` | query | no | string | Column to sort by. |
| `sort_type` | query | no | string | Sort direction. |
| `active_view` | query | no | string | Filter by status tab. |
| `search` | query | no | string | Search by order bump title or description. Partial matches supported. |
| `page` | query | no | integer | Page number for pagination. |
| `per_page` | query | no | integer | Number of records per page. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
