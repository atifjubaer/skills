# Public Shop API

Public unauthenticated storefront endpoints for browsing published products, fetching server-rendered product grid views, and live search bar autocomplete in FluentCart.

**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2/public`  
**Policy:** `PublicPolicy` (No authentication required)

---

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/public/products` | Paginated list of published catalog products with taxonomy & price filters |
| GET | `/public/product-views` | Server-rendered HTML product card grid views for blocks & shortcodes |
| GET | `/public/product-search` | Title search returning pre-rendered HTML items for search dropdowns |

---

## 1. List Products

`GET /fluent-cart/v2/public/products`

Retrieve a paginated list of published catalog products. Sensitive administrative fields (`post_content`, `item_cost`, `editing_stage`, `stock`, `manage_stock`, `manage_cost`, `settings`) are omitted from the public response.

### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `per_page` | integer | query | No | Products per page (default: 10) |
| `current_page` | integer | query | No | Page number for offset-based pagination |
| `cursor` | string | query | No | Cursor token for cursor-based pagination |
| `paginate_using` | string | query | No | Set to `cursor` for cursor strategy, omit for offset |
| `order_type` | string | query | No | Sort direction: `ASC` or `DESC` (default: `DESC`) |
| `with` | array | query | No | Eager load relations (e.g., `["detail"]`) |
| `allow_out_of_stock` | boolean | query | No | Include out-of-stock products (default: `false`) |
| `include_ids` | array | query | No | Include specific product IDs (max 100) |
| `exclude_ids` | array | query | No | Exclude specific product IDs (max 100) |
| `product_type` | string | query | No | Filter by type (`physical`, `digital`, `subscription`, `onetime`, `simple`, `simple_variations`) |
| `on_sale` | boolean | query | No | Return only products on sale (`compare_price > item_price`) |
| `default_filters` | object | query | No | Shortcode-level default filters |
| `filters` | object | query | No | Interactive user-applied filter overrides |

#### Filter Fields (`filters[...]` / `default_filters[...]`)

| Field | Type | Description |
|-------|------|-------------|
| `wildcard` | string | Search title by keyword |
| `enable_wildcard_for_post_content` | integer | Set to `1` to search product content as well |
| `sort_by` | string | Preset: `name-asc`, `name-desc`, `price-low`, `price-high`, `date-newest`, `date-oldest` |
| `price_range_from` | float | Minimum price filter (decimal dollar amount, e.g. `10.00`) |
| `price_range_to` | float | Maximum price filter (decimal dollar amount, e.g. `99.99`) |
| `{taxonomy_slug}` | string/array | Term IDs array for custom taxonomies (e.g. `product-categories`) |

### Response

> **Price Units:** Product prices in `detail` (`min_price`, `max_price`) are returned as integer **cents**.

```json
{
  "products": {
    "products": {
      "total": 24,
      "per_page": 10,
      "current_page": 1,
      "last_page": 3,
      "data": [
        {
          "ID": 42,
          "post_title": "Premium T-Shirt",
          "post_status": "publish",
          "post_excerpt": "High-quality cotton t-shirt",
          "guid": "https://example.com/?p=42",
          "view_url": "https://example.com/product/premium-t-shirt",
          "has_subscription": false,
          "thumbnail": "https://example.com/wp-content/uploads/tshirt.jpg",
          "detail": {
            "id": 15,
            "post_id": 42,
            "variation_type": "simple",
            "min_price": 2500,
            "max_price": 2500,
            "fulfillment_type": "physical"
          }
        }
      ]
    },
    "total": 24
  }
}
```

### Example

```bash
curl -X GET "https://example.com/wp-json/fluent-cart/v2/public/products?per_page=12&filters[sort_by]=price-low&filters[price_range_from]=10&filters[price_range_to]=50"
```

---

## 2. Get Product Views (Server-Rendered HTML)

`GET /fluent-cart/v2/public/product-views`

Retrieve pre-rendered HTML cards for product grids (used by Gutenberg blocks and shortcodes for AJAX pagination and filtering). Supports all filter parameters from List Products.

### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `per_page` | integer | query | No | Products per page (default: 10) |
| `current_page` | integer | query | No | Current page number (default: 1) |
| `template_provider` | string | query | No | Custom provider ID for `fluent_cart/products_views/preload_collection_{provider}` filter |
| `client_id` | string | query | No | Transient client ID to retrieve cached block markup (`fct_product_loop_client_{client_id}`) |

#### Server Rendering Pipeline Priority

1. **Template Provider:** If `template_provider` is set, calls `fluent_cart/products_views/preload_collection_{provider}` filter.
2. **Cached Block Markup:** If `client_id` is set, processes matching transient block template with `do_blocks()`.
3. **Default Renderer:** Falls back to `ProductListRenderer` for standard card markup.

### Response

```json
{
  "products": {
    "views": "<div class=\"fct-product-card\">...rendered HTML card list...</div>",
    "current_page": 1,
    "last_page": 3,
    "total": 24,
    "per_page": 10,
    "from": 1,
    "to": 10
  }
}
```

### Example

```bash
curl -X GET "https://example.com/wp-json/fluent-cart/v2/public/product-views?per_page=12&current_page=2&filters[sort_by]=date-newest"
```

---

## 3. Search Products (Live Search Autocomplete)

`GET /fluent-cart/v2/public/product-search`

Returns pre-rendered HTML search result items for live storefront search dropdowns.

### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `post_title` | string | query | Yes | Search query string matched against product titles |
| `url_mode` | string | query | No | URL mode passed to `SearchBarRenderer` for permalink generation |
| `termId` | integer | query | No | Taxonomy term (category) ID filter |

### Response

```json
{
  "htmlView": "<div class=\"fct-search-result-item\"><a href=\"https://example.com/product/premium-t-shirt\">Premium T-Shirt</a></div>"
}
```

### Example

```bash
curl -X GET "https://example.com/wp-json/fluent-cart/v2/public/product-search?post_title=shirt&termId=5"
```
