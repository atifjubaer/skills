# GET Get Subscription Variations

## `GET /reports/subscription-variations`

**GET Get Subscription Variations**

Returns the products and variations that have a started open-ended subscription, grouped by product. The subscription report pages use it for the product picker.

A deleted variation keeps its ID and shows under "Deleted product" with `product_id: 0`.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getSubscriptionVariations`
- **tags:** Reports

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
