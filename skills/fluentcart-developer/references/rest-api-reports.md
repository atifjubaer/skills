# Reports API

Access comprehensive sales analytics, revenue data, order statistics, customer insights, subscription metrics, cohort retention, and product performance reports in FluentCart.

**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2/reports`  
**Policy:** `ReportPolicy`  
**Permission:** `reports/view` (accessible to `super_admin`, `manager`, and `accountant` roles)

> **Monetary Values & Decimal Variations:** All monetary values are in **cents** unless specifically noted (e.g., `sales-growth-chart`, `get-recent-orders`, and `future_installments` return values formatted in dollars decimal). Pro license unlocks custom date ranges; free plan defaults to the last 30 days.

---

## Standard Report Parameters

Most report GET endpoints process query parameters via `ReportHelper::processParams()` using the nested `params[...]` object.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `params[startDate]` | string | No | Start date for report period (`YYYY-MM-DD`). Defaults to 30 days ago |
| `params[endDate]` | string | No | End date for report period (`YYYY-MM-DD`). Defaults to today |
| `params[groupKey]` | string | No | Grouping interval: `default` (auto), `daily`, `monthly`, `yearly`, `billing_country`, `shipping_country`, `payment_method`, `payment_status` |
| `params[currency]` | string | No | Currency code (e.g. `USD`). Defaults to store currency |
| `params[filterMode]` | string | No | Mode filter: `live` or `test`. Defaults to store setting |
| `params[variation_ids]` | array | No | Product variation IDs array to filter containing orders |
| `params[compareType]` | string | No | Comparison period: `previous_period`, `previous_month`, `previous_quarter`, `previous_year`, `custom` |
| `params[compareDate]` | string | No | Custom comparison start date (required when `compareType` is `custom`) |
| `params[paymentStatus]` | array | No | Auto-set to report-eligible statuses (`paid`, `partially-paid`, `refunded`, `partially-refunded`) |
| `params[orderTypes]` | array | No | Filter by order type (`one-time`, `subscription`) |
| `params[orderStatus]` | array | No | Order status filter (excluding `on-hold` & `failed` by default) |
| `params[subscriptionType]` | string | No | Subscription type filter (defaults to `subscription`) |

---

## Endpoints Overview

| Group | Method | Endpoint | Description |
|-------|--------|----------|-------------|
| **Overview** | GET | `/reports/overview` | 12-month YoY revenue breakdown & top countries |
| **General Reports** | GET | `/reports/fetch-report-meta` | Store currencies, min_date, and store mode |
| | GET | `/reports/quick-order-stats` | Quick summary stats with date range shortcut |
| | GET | `/reports/sales-growth` | Sales growth over custom date range |
| | GET | `/reports/report-overview` | Aggregated order summary & payment method breakdown |
| | GET | `/reports/search-repeat-customer` | Search & paginate repeat customer profiles |
| | GET | `/reports/top-products-sold` | Top products sold via Resource API layer |
| **Revenue Reports** | GET | `/reports/revenue` | Grouped gross/net revenue with period comparisons |
| | GET | `/reports/revenue-by-group` | Revenue grouped by country, gateway, or status |
| **Order Reports** | GET | `/reports/order-value-distribution` | Price range order value breakdown |
| | GET | `/reports/fetch-new-vs-returning-customer` | New vs. returning customer order ratio |
| | GET | `/reports/fetch-order-by-group` | Orders grouped by gateway, country, or status |
| | GET | `/reports/fetch-report-by-day-and-hour` | Heatmap matrix of orders by day of week & hour |
| | GET | `/reports/item-count-distribution` | Distribution of order volume by item counts |
| | GET | `/reports/order-completion-time` | Order processing & completion time analytics |
| | GET | `/reports/order-chart` | Time-series order count chart with comparison |
| **Sales Reports** | GET | `/reports/sales-report` | Complete sales metrics (revenue, orders, items) |
| | GET | `/reports/fetch-top-sold-products` | Best-selling products ranking |
| | GET | `/reports/fetch-top-sold-variants` | Best-selling product variations ranking |
| **Refund Reports** | GET | `/reports/refund-chart` | Time-series refund metrics & summary |
| | GET | `/reports/weeks-between-refund` | Weeks elapsed between order placement & refund |
| | GET | `/reports/refund-data-by-group` | Refund statistics grouped by gateway or country |
| **License Reports** | GET | `/reports/license-chart` | Software license issuance time-series chart |
| | GET | `/reports/license-pie-chart` | License status distribution (active, expired, revoked) |
| | GET | `/reports/license-summary` | Overall license issuance & activation metrics |
| **Dashboard** | GET | `/reports/dashboard-stats` | Summary cards (orders, items, paid value in cents) |
| | GET | `/reports/sales-growth-chart` | Net revenue growth chart (in dollars decimal) |
| | GET | `/reports/country-heat-map` | Country distribution for world map visualization |
| | GET | `/reports/get-recent-orders` | 10 most recent orders (total in dollars decimal) |
| | GET | `/reports/get-recent-activities` | 10 most recent activity log entries |
| | GET | `/reports/get-dashboard-summary` | Product catalog & coupon counts summary |
| **Subscriptions** | GET | `/reports/subscription-chart` | MRR growth & future installment projections |
| | GET | `/reports/daily-signups` | Daily subscription signup counts |
| | GET | `/reports/retention-chart` | Subscription subscriber retention chart |
| | GET | `/reports/future-renewals` | Projected future subscription renewals |
| | GET | `/reports/subscription-retention` | Billing period retention rate metrics |
| | GET | `/reports/subscription-cohorts` | Monthly/yearly cohort retention matrix |
| **Snapshots** | POST | `/reports/retention-snapshots/generate` | Trigger background/sync retention snapshot calculation |
| | GET | `/reports/retention-snapshots/status` | Poll retention snapshot job status |
| **Product/Customer** | GET | `/reports/product-report` | Product performance time-series & summary |
| | GET | `/reports/product-performance` | Ranked product performance chart |
| | GET | `/reports/customer-report` | Customer acquisition & retention time-series |
| | GET | `/reports/sources` | UTM attribution & order traffic source report |

---

## Overview & General Reports

### Get Revenue Overview

`GET /fluent-cart/v2/reports/overview`

Year-over-year revenue comparison for the last 12 months vs. prior year. (Covers 30 months of data internally to build 12-month YoY metrics). Top country data is limited to top 5 countries.

> **Calculation Rules:**
> - Gross Revenue = `total_paid`
> - Net Revenue = `total_paid - total_refund - tax_total - shipping_tax`

#### Response

```json
{
  "data": {
    "gross_revenue": {
      "2025-01": {
        "current": 500000,
        "prev": 350000,
        "yoy_growth": "42.86"
      }
    },
    "gross_revenue_quarterly": {
      "Q1-2025": {
        "current": 1500000,
        "prev_year": 1200000,
        "yy_growth": "25.00"
      }
    },
    "gross_summary": {
      "total": 6000000,
      "total_prev": 4800000,
      "yoy_growth": "25.00"
    },
    "top_country_net": {
      "by_month": {
        "2025-01": { "US": 300000, "GB": 150000 }
      },
      "by_countries": { "US": 3600000, "GB": 1800000 }
    }
  }
}
```

---

### Get Quick Order Stats

`GET /fluent-cart/v2/reports/quick-order-stats`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `day_range` | string | query | No | Range shortcut (e.g., `-7 days`, `-30 days`, `this_month`, `all_time`). Default: `-0 days` (today) |

---

### Search Repeat Customers

`GET /fluent-cart/v2/reports/search-repeat-customer`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `params[per_page]` | integer | query | No | Items per page (default: 15) |
| `params[current_page]` | integer | query | No | Current page number |

---

## Revenue & Order Reports

### Get Revenue Data

`GET /fluent-cart/v2/reports/revenue`

Uses Standard Report Parameters to calculate gross/net revenue time-series and period fluctuations.

#### Response

```json
{
  "revenueReport": [
    {
      "year": "2025",
      "group": "2025-01",
      "gross_revenue": 500000,
      "net_revenue": 450000,
      "orders": 45
    }
  ],
  "summary": {
    "gross_revenue": 6000000,
    "net_revenue": 5400000,
    "total_orders": 540
  },
  "fluctuations": {
    "gross_revenue": {
      "value": 25.0,
      "direction": "up"
    }
  },
  "appliedGroupKey": "monthly"
}
```

---

### Get Day and Hour Heatmap

`GET /fluent-cart/v2/reports/fetch-report-by-day-and-hour`

Returns day-of-week (0-6) and hour-of-day (0-23) matrix data for order density heatmaps.

---

## Dashboard Reports

### Get Dashboard Stats

`GET /fluent-cart/v2/reports/dashboard-stats`

#### Response

```json
{
  "dashBoardStats": {
    "total_orders": {
      "title": "All Orders",
      "icon": "AllOrdersIcon",
      "current_count": 540,
      "compare_count": 480
    },
    "paid_orders": {
      "title": "Paid Orders",
      "icon": "Money",
      "current_count": 520,
      "compare_count": 460
    },
    "total_paid_order_items": {
      "title": "Paid Order Items",
      "icon": "OrderItemsIcon",
      "current_count": 1200,
      "compare_count": 1050
    },
    "total_paid_amounts": {
      "title": "Order Value (Paid)",
      "icon": "OrderValueIcon",
      "current_count": 6000000,
      "compare_count": 5200000,
      "is_cents": true
    }
  }
}
```

---

### Get Sales Growth Chart (Decimal Dollars)

`GET /fluent-cart/v2/reports/sales-growth-chart`

> **Note:** Net revenue in this response is returned in **decimal dollars**, not cents (`(total_paid - total_refund - tax_total - shipping_tax) / 100`).

```json
{
  "salesGrowthChart": [
    {
      "year": "2025",
      "group": "2025-01",
      "orders": 45,
      "net_revenue": 4500.00
    }
  ]
}
```

---

### Get Recent Orders (Decimal Dollars)

`GET /fluent-cart/v2/reports/get-recent-orders`

> **Note:** `total_amount` is returned in **decimal dollars** (`99.99`).

```json
{
  "recentOrders": [
    {
      "id": 150,
      "customer_id": 42,
      "customer_name": "John Doe",
      "total_amount": 99.99,
      "created_at": "2025-06-15 14:30:00",
      "order_items_count": 3
    }
  ]
}
```

---

## Subscription Reports & Retention Snapshots

### Get Subscription Chart

`GET /fluent-cart/v2/reports/subscription-chart`

> **Note:** `future_installments` is returned in **decimal dollars** (`sum((bill_times - bill_count) * recurring_total) / 100`).

```json
{
  "currentMetrics": [
    {
      "year": "2025",
      "group": "2025-01",
      "subscriptions": 20,
      "mrr": 100000
    }
  ],
  "summary": {
    "future_installments": 500000.00,
    "total_subscriptions": 150
  }
}
```

---

### Get Subscription Cohorts

`GET /fluent-cart/v2/reports/subscription-cohorts`

Tracks subscriber retention over time across signup cohorts. Requires pre-generated retention snapshots.

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `params[groupBy]` | string | query | No | Cohort interval: `year` (default max 8 years) or `month` (default max 18 months) |
| `params[metric]` | string | query | No | Metric to track (default: `subscribers`) |
| `params[variation_ids]` | array | query | No | Variation IDs array (converted to product IDs internally) |

---

### Generate Retention Snapshots

`POST /fluent-cart/v2/reports/retention-snapshots/generate`

Triggers snapshot generation. Uses WordPress Action Scheduler for background processing if active; otherwise runs synchronously.

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `product_id` | integer | body | No | Specific product ID. If omitted, generates for all products |

#### Response (Background Mode)

```json
{
  "success": true,
  "message": "Snapshot generation queued",
  "job_id": 1718456789,
  "mode": "background"
}
```

---

### Check Retention Snapshot Status

`GET /fluent-cart/v2/reports/retention-snapshots/status`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `params[job_id]` | integer | query | Yes | Unix timestamp `job_id` returned from generation endpoint |

#### Response

```json
{
  "success": true,
  "status": "completed",
  "message": "Job completed",
  "stats": {},
  "data": {}
}
```
