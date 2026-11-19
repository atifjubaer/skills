# GET Get Recent Orders

## `GET /reports/get-recent-orders`

**GET Get Recent Orders**

Returns the 10 newest orders of any status, with customer name and item count. `total_amount` is a decimal in the order's currency.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getRecentOrders`
- **tags:** Reports

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
