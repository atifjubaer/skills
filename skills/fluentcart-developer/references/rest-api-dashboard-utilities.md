# Dashboard & Utilities API

Administrative endpoints for dashboard statistics, onboarding setup, SPA initialization, media attachments, activity logging, order notes, print templates, address locales, and dynamic filter widgets in FluentCart.

**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2`

---

## Endpoints Overview

| Group | Method | Endpoint | Permission / Policy | Request Class | Description |
|-------|--------|----------|--------------------|---------------|-------------|
| **Dashboard** | GET | `/dashboard` | `AdminPolicy` | — | Get onboarding checklist completion status |
| | GET | `/dashboard/stats` | `dashboard_stats/view` | — | Get 30-day dashboard summary stats cards |
| **Onboarding** | GET | `/onboarding` | `AdminPolicy` | — | Get onboarding settings, pages, & currencies |
| | POST | `/onboarding` | `AdminPolicy` | — | Save onboarding settings & trigger dummy products |
| | POST | `/onboarding/create-pages` | `AdminPolicy` | — | Bulk create all missing store pages |
| | POST | `/onboarding/create-page` | `AdminPolicy` | `CreatePageRequest` | Create single store page & set page ID |
| **App Init & Media** | GET | `/app/init` | `AdminPolicy` | — | Initialize admin SPA config, nonces, & strings |
| | GET | `/app/attachments` | `AdminPolicy` | — | List Media Library images for media picker |
| | POST | `/app/upload-attachments` | `AdminPolicy` | — | Upload image to WordPress Media Library |
| **Activity Log** | GET | `/activity` | `AdminPolicy` | — | List paginated activity log entries |
| | DELETE | `/activity/{id}` | `AdminPolicy` | — | Delete activity log entry |
| | PUT | `/activity/{id}/mark-read` | `AdminPolicy` | — | Toggle read/unread status of activity log entry |
| **Order Notes** | POST | `/notes/attach` | `AdminPolicy` | — | Attach or update note on an order |
| **Print Templates** | GET | `/templates/print-templates` | `AdminPolicy` | — | Get invoice & slip print templates |
| | PUT | `/templates/print-templates` | `AdminPolicy` | — | Save customized print HTML templates |
| **Widgets** | GET | `/widgets` | `customers/view` / `orders/view` | — | Get dynamic widget data for single order |
| **Address Info** | GET | `/address-info/countries` | `UserPolicy` | — | List all countries formatted as select options |
| | GET | `/address-info/get-country-info` | `UserPolicy` | — | Get country states & localized address locale |
| **Advanced Filters** | GET | `/advance_filter/get-filter-options` | `orders/view` / `customers/view` / `products/view` / `labels/view` | — | Fetch dynamic options (variations tree / labels) |
| | GET | `/forms/search_options` | `super_admin` | — | Fetch dynamic form search options |

---

## Admin Dashboard

Overview and quick stats widgets for the store admin panel.

### Get Onboarding Checklist Data

`GET /fluent-cart/v2/dashboard`

**Policy:** `AdminPolicy`

#### Checklist Completion Logic

| Step Key | Title | Completed When |
|----------|-------|----------------|
| `page_setup` | Setup Pages | All generatable store pages (shop, checkout, etc.) have page IDs assigned |
| `store_info` | Add Details to Store | Both `store_name` and `store_logo` are configured in store settings |
| `product_info` | Add Your First Product | At least one product exists in database |
| `setup_payments` | Setup Payment Methods | At least one payment gateway is enabled |

#### Response

```json
{
  "data": {
    "steps": {
      "page_setup": { "title": "Setup Pages", "completed": false },
      "store_info": { "title": "Add Details to Store", "completed": true },
      "product_info": { "title": "Add Your First Product", "completed": false },
      "setup_payments": { "title": "Setup Payment Methods", "completed": true }
    },
    "completed": 2
  }
}
```

---

### Get Dashboard Stats Widgets

`GET /fluent-cart/v2/dashboard/stats`

**Policy:** `DashboardPolicy` | **Permission:** `dashboard_stats/view`

> **Metrics Rules:**
> - Orders, Revenue, and Refunds are calculated for the **last 30 days only**.
> - Orders with `on_hold` or `failed` status are excluded.
> - Net Revenue = `total_paid - total_refund - tax_total - shipping_tax` (converted from cents to decimal dollars).
> - `has_currency: true` indicates value should be formatted with store currency symbol.

#### Response

```json
{
  "stats": [
    {
      "title": "Total Products",
      "current_count": 45,
      "icon": "Frame",
      "url": "https://example.com/wp-admin/admin.php?page=fluent-cart#/products?active_view=all"
    },
    {
      "title": "Orders",
      "current_count": 128,
      "icon": "AllOrdersIcon",
      "url": "https://example.com/wp-admin/admin.php?page=fluent-cart#/orders"
    },
    {
      "title": "Revenue",
      "current_count": 15420.50,
      "icon": "Currency",
      "url": "https://example.com/wp-admin/admin.php?page=fluent-cart#/reports/revenue",
      "has_currency": true
    },
    {
      "title": "Refund",
      "current_count": 350.00,
      "icon": "Failed",
      "url": "https://example.com/wp-admin/admin.php?page=fluent-cart#/reports/refunds",
      "has_currency": true
    }
  ]
}
```

---

## Onboarding Setup Wizard

Endpoints for store page creation and initial setup.

**Prefix:** `/fluent-cart/v2/onboarding` | **Policy:** `AdminPolicy`

- `GET /onboarding` — Retrieve current pages, currencies, and default settings.
- `POST /onboarding` — Save onboarding settings (`store_name`, `store_logo`, `currency`). Note: Providing `category` triggers asynchronous dummy product generation.
- `POST /onboarding/create-pages` — Bulk create missing store pages.
- `POST /onboarding/create-page` — Create single page (`content`: `shop_page_id` / `checkout_page_id` / `customer_profile_page_id`, `page_name`, `save_settings`: `true`).

---

## SPA App Initialization & Media

**Prefix:** `/fluent-cart/v2/app` | **Policy:** `AdminPolicy`

- `GET /app/init` — SPA bootstrap endpoint (returns REST base URL, nonces, asset URLs, translations array, and store currency formats).
- `GET /app/attachments` — List WordPress media library image attachments for the admin media picker.
- `POST /app/upload-attachments` — Upload image file (`multipart/form-data`) to media library.

---

## System Activity Log

Tracks order status changes, payment webhooks, API calls, and errors.

**Prefix:** `/fluent-cart/v2/activity` | **Policy:** `AdminPolicy`

### List Activities

`GET /fluent-cart/v2/activity`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `search` | string | query | No | Search by ID (prefix with `#`), title, content, or module |
| `active_view` | string | query | No | Filter tab: `success`, `warning`, `error`, `failed`, `info`, `api` |
| `sort_by` | string | query | No | Sort column (default: `id`) |
| `sort_type` | string | query | No | Sort direction (`asc` or `desc`, default: `desc`) |
| `per_page` | integer | query | No | Results per page (default: 10, max: 200) |
| `page` | integer | query | No | Page number |

---

### Delete & Toggle Activity Read Status

- `DELETE /activity/{id}` — Permanently delete activity entry.
- `PUT /activity/{id}/mark-read` — Toggle read status (`status`: `read` or `unread`).

---

## Order Notes & Print Templates

- `POST /fluent-cart/v2/notes/attach` — Attach note content to order (`order_id`, `note`).
- `GET /fluent-cart/v2/templates/print-templates` — Retrieve print templates (`invoice_template`, `packing_slip`, `delivery_slip`, `shipping_slip`, `dispatch_slip`).
- `PUT /fluent-cart/v2/templates/print-templates` — Save customized print HTML templates (sanitized with `wp_kses_post`).

---

## Dynamic Widgets, Address Locales, & Filters

### Get Contextual Widgets

`GET /fluent-cart/v2/widgets`

**Policy:** `OrderPolicy` | **Permission:** `customers/view` OR `orders/view`

- `filter` (query): Widget context (e.g. `single_order_page`). Dispatches to filter hook `fluent_cart/widgets/{filter}`.
- `data[order_id]` (query): Order ID context.

---

### Address Info & Country Locales

`GET /fluent-cart/v2/address-info/countries` — List all countries as select options (`label`, `value`).  
`GET /fluent-cart/v2/address-info/get-country-info` — Get country states array and localized `address_locale` rules (`country_code` OR `timezone` e.g. `America/New_York`).

```json
{
  "country_code": "US",
  "country_name": "United States",
  "states": [{ "label": "California", "value": "CA" }],
  "address_locale": {
    "state": { "label": "State", "required": true },
    "postcode": { "label": "ZIP Code", "required": true },
    "city": { "label": "City", "required": true }
  }
}
```

---

### Advanced Search & Filter Options

- `GET /fluent-cart/v2/advance_filter/get-filter-options` — Load options for advanced filter UI (`remote_data_key`: `product_variations` [returns hierarchical tree], `labels` [flat list], or custom resolved via `fluent_cart/advanced_filter_options_{key}`).
- `GET /fluent-cart/v2/forms/search_options` — Form search options (`search_for`, `search_by`, `is_super_admin`, resolved via `fluent_cart/get_dynamic_search_{search_for}`).
