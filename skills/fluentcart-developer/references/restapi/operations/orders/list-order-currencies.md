# GET List Order Currencies

## `GET /orders/currencies`

**GET List Order Currencies**

List the currencies an admin order can be created in, with today's rate for each.

**Required permission:** `orders/create`

The store currency comes first. The list is empty when Multi-Currency is off or no other currency has a rate; then orders can only be created in the store currency.

- **operationId:** `listOrderCurrencies`
- **tags:** Orders

### Responses

| Status | Description |
| --- | --- |
| `200` | Currencies available for admin orders. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`orders/create`). |
