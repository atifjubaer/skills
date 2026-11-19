# GET List Saved Views

## `GET /saved-views`

**GET List Saved Views**

Retrieve every saved view the current user can see for a given admin table — their own views plus any public views. Results are ordered by ID ascending.

**Permission:** varies by `object_type` (see below) · **Policy:** `SavedViewsPolicy`

- **operationId:** `listSavedViews`
- **tags:** Saved Views

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `object_type` | query | yes | string | The admin table the view belongs to. **Required** — it is read by `SavedViewsPolicy` *before* the controller runs, so omitting it returns `403 rest_forbidden` rather than a validation error. Each value maps to a different capability: `product_table`/`order_bump_table` → `products/view`, `order_table`/`log_table` → `orders/view`, `customers` → `customers/view`, `coupon_table` → `coupons/view`, `subscriptions` → `subscriptions/view`, `licenses` → `licenses/view`, and `taxes_table`/`shipping_zone_table`/`shipping_class_table` → `manage_options`. The map is filterable via `fluent_cart/saved_views_permission_map`. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | Forbidden — returned both when `object_type` is missing or unknown and when the user lacks the capability that `object_type` maps to. |
