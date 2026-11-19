# GET Get Dashboard Stats

## `GET /dashboard/stats`

**GET Get Dashboard Stats**

Retrieve the dashboard tiles: total products, and the orders, net sales and refunds of the last 30 store days. The money tiles show the Revenue report's figures for the same days (net sales and refunded amount, in major units), in all currencies converted to the base currency.

`current_count` is an integer string for Total Products, an integer for Orders, and a decimal number for Revenue and Refund. Money tiles also carry `currency` (base currency) and `excluded_orders` (orders with no trusted exchange rate, left out of the money tiles).

**Required permission:** `dashboard_stats/view`

- **operationId:** `getDashboardStats`
- **tags:** Dashboard

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`dashboard_stats/view`). |
