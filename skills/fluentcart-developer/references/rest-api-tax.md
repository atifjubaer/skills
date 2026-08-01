# Tax API

Configure tax classes, manage country-specific tax rates, set up tax configuration, and handle EU VAT/OSS compliance and tax filing.

**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2`

> All monetary values are in cents (e.g., `$10.00` = `1000`).

---

## Endpoints Overview

| Group | Method | Endpoint | Description |
|-------|--------|----------|-------------|
| **Tax Filing** | GET | `/taxes` | List Tax Records (Order-level filing) |
| | POST | `/taxes` | Mark Taxes as Filed |
| **Tax Classes** | GET | `/tax/classes` | List Tax Classes |
| | POST | `/tax/classes` | Create Tax Class |
| | DELETE | `/tax/classes/{id}` | Delete Tax Class |
| **Tax Rates** | GET | `/tax/rates` | List All Tax Rates (grouped by region) |
| | GET | `/tax/rates/country/rates/{country_code}` | Get Country Tax Rates |
| | POST | `/tax/country-status/{country_code}` | Enable/Disable Country Tax Status |
| | POST | `/tax/country/rate` | Create Tax Rate |
| | PUT | `/tax/country/rate/{id}` | Update Tax Rate |
| | DELETE | `/tax/country/rate/{id}` | Delete Tax Rate |
| | POST | `/tax/rates/country/override` | Save Shipping Tax Override |
| | DELETE | `/tax/rates/country/override/{id}` | Delete Shipping Tax Override |
| | GET | `/tax/product-overrides/{country_code}` | Get Product Category Tax Overrides |
| | POST | `/tax/product-overrides` | Save Product Category Tax Override |
| | DELETE | `/tax/product-overrides/{id}` | Delete Product Category Tax Override |
| | GET | `/tax/country-tax-id/{country_code}` | Get Country Tax ID |
| | POST | `/tax/country-tax-id/{country_code}` | Save Country Tax ID |
| **Tax Config** | GET | `/tax/configuration/rates` | Get Preconfigured Tax Rates |
| | POST | `/tax/configuration/countries` | Save Configured Countries |
| | GET | `/tax/configuration/settings` | Get Tax Settings |
| | POST | `/tax/configuration/settings` | Save Tax Settings |
| **EU VAT** | POST | `/tax/configuration/settings/eu-vat` | Save EU VAT Cross-Border Settings |
| | POST | `/tax/configuration/settings/eu-vat/reset-rates` | Reset EU VAT Rates |
| | GET | `/tax/configuration/settings/eu-vat/product-overrides` | Get EU VAT Product Overrides |
| | GET | `/tax/configuration/settings/eu-vat/oss-rates` | Get OSS Country Rates |
| | POST | `/tax/configuration/settings/eu-vat/oss-rates` | Save OSS Country Rates |

---

## Tax Filing

Manage order-level tax records for filing and reporting purposes.

**Prefix:** `/fluent-cart/v2/taxes` | **Policy:** `AdminPolicy`

### List Tax Records

`GET /fluent-cart/v2/taxes`

Retrieve a paginated list of order tax rate records.

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `page` | integer | query | No | Page number |
| `per_page` | integer | query | No | Records per page (default: 10, max: 200) |
| `search` | string | query | No | Search by ID, order_id, country, state, postcode, or name |
| `sort_by` | string | query | No | Column to sort by (default: `id`) |
| `sort_type` | string | query | No | `asc` or `desc` (default: `desc`) |
| `active_view` | string | query | No | Tab filter: `filed` or `not_filed` |
| `filter_type` | string | query | No | `simple` or `advanced` |
| `advanced_filters` | string (JSON) | query | No | JSON filter groups by country, region, name, filed status |

#### Response

```json
{
  "taxes": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "order_id": 42,
        "tax_rate_id": 5,
        "shipping_tax": 150,
        "order_tax": 1000,
        "total_tax": 1150,
        "meta": {
          "rates": [],
          "tax_country": "US",
          "store_vat_number": ""
        },
        "filed_at": null,
        "created_at": "2025-06-01 12:00:00",
        "updated_at": "2025-06-01 12:00:00"
      }
    ],
    "per_page": 10,
    "total": 50,
    "last_page": 5
  }
}
```

#### Example

```bash
curl -X GET "https://example.com/wp-json/fluent-cart/v2/taxes?page=1&per_page=20&active_view=not_filed" \
  -u "username:app_password"
```

---

### Mark Taxes as Filed

`POST /fluent-cart/v2/taxes`

Mark one or more order tax records as filed by setting their `filed_at` timestamp.

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `ids` | array | body | Yes | Array of OrderTaxRate record IDs to mark as filed |

#### Response

```json
{
  "message": "Taxes marked as filed successfully"
}
```

#### Example

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/taxes" \
  -u "username:app_password" \
  -H "Content-Type: application/json" \
  -d '{"ids": [1, 2, 3, 5]}'
```

---

## Tax Classes

Group tax rates by category (e.g., Standard, Reduced, Zero). Maximum 6 classes allowed. Standard cannot be deleted.

**Prefix:** `/fluent-cart/v2/tax/classes` | **Policy:** `StoreSettingsPolicy`

### List Tax Classes

`GET /fluent-cart/v2/tax/classes`

#### Response

```json
{
  "classes": [
    {
      "id": 1,
      "title": "Standard",
      "slug": "standard",
      "created_at": "2025-01-01 00:00:00"
    },
    {
      "id": 2,
      "title": "Reduced",
      "slug": "reduced",
      "created_at": "2025-01-01 00:00:00"
    }
  ],
  "max_classes": 6,
  "next_builtin": {
    "slug": "zero",
    "title": "Zero"
  }
}
```

---

### Create Tax Class

`POST /fluent-cart/v2/tax/classes`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `title` | string | body | Conditional | Tax class title (max 30 chars). Required unless built-in slug passed |
| `slug` | string | body | No | Pass `reduced` or `zero` to create built-in class |

#### Example

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/tax/classes" \
  -u "username:app_password" \
  -H "Content-Type: application/json" \
  -d '{"title": "Digital Goods"}'
```

---

### Delete Tax Class

`DELETE /fluent-cart/v2/tax/classes/{id}`

Products/rates referencing deleted class fall back to Standard. Standard class cannot be deleted.

---

## Tax Rates

**Prefix:** `/fluent-cart/v2/tax` | **Policy:** `StoreSettingsPolicy`

### List All Tax Rates

`GET /fluent-cart/v2/tax/rates`

Retrieve all rates grouped by region/continent and country.

### Get Country Tax Rates

`GET /fluent-cart/v2/tax/rates/country/rates/{country_code}`

### Update Country Tax Status

`POST /fluent-cart/v2/tax/country-status/{country_code}`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `country_code` | string | path | Yes | ISO country code or `EU` |
| `enabled` | integer | body | Yes | `1` to enable, `0` to disable |

---

### Create Tax Rate

`POST /fluent-cart/v2/tax/country/rate`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `class_id` | integer | body | Yes | Tax class ID |
| `country` | string | body | No | ISO country code (max 45 chars) |
| `state` | string | body | No | State/province code |
| `postcode` | string | body | No | Postal code |
| `city` | string | body | No | City name |
| `rate` | string | body | No | Rate percentage (e.g. `"19.0000"`) |
| `name` | string | body | No | Display name |
| `group` | string | body | No | Geographic group (e.g. `EU`, `NA`) |
| `priority` | integer | body | No | Application priority (min 1) |
| `is_compound` | integer | body | No | Compound tax flag (`0` or `1`) |
| `for_shipping` | integer | body | No | Shipping override rate (null = none) |
| `for_order` | integer | body | No | Order-level tax flag (`0` or `1`) |

---

### Update Tax Rate

`PUT /fluent-cart/v2/tax/country/rate/{id}`

---

### Delete Tax Rate

`DELETE /fluent-cart/v2/tax/country/rate/{id}`

---

### Shipping Tax Overrides

- `POST /fluent-cart/v2/tax/rates/country/override` — Save shipping tax override on a rate.
- `DELETE /fluent-cart/v2/tax/rates/country/override/{id}` — Remove shipping tax override.

---

### Product Category Tax Overrides

- `GET /fluent-cart/v2/tax/product-overrides/{country_code}` — Get product category overrides for country.
- `POST /fluent-cart/v2/tax/product-overrides` — Create or update product category tax override.
- `DELETE /fluent-cart/v2/tax/product-overrides/{id}` — Delete product category tax override.

---

### Store Tax ID (VAT/GST/EIN)

- `GET /fluent-cart/v2/tax/country-tax-id/{country_code}` — Get store tax ID for country.
- `POST /fluent-cart/v2/tax/country-tax-id/{country_code}` — Save store tax ID for country.

---

## Tax Configuration

**Prefix:** `/fluent-cart/v2/tax/configuration` | **Policy:** `StoreSettingsPolicy`

### Get Preconfigured Tax Rates

`GET /fluent-cart/v2/tax/configuration/rates`

Returns default tax rates from built-in rates dataset (`tax.php`) grouped by region/country.

### Save Configured Countries

`POST /fluent-cart/v2/tax/configuration/countries`

Imports default tax rates for selected country codes.

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/tax/configuration/countries" \
  -u "username:app_password" \
  -H "Content-Type: application/json" \
  -d '{"countries": ["DE", "FR", "IT", "ES"]}'
```

### Get / Save Tax Settings

- `GET /fluent-cart/v2/tax/configuration/settings`
- `POST /fluent-cart/v2/tax/configuration/settings`

#### Settings Object Fields

| Field | Values | Description |
|-------|--------|-------------|
| `enable_tax` | `"yes"`, `"no"` | Master tax switch |
| `tax_inclusion` | `"included"`, `"excluded"` | Whether catalog prices include tax |
| `tax_calculation_basis` | `"shipping"`, `"billing"`, `"store"` | Address basis for calculation |
| `tax_rounding` | `"item"`, `"total"`, `"subtotal"` | Rounding application point |
| `checkout_tax_breakdown_display` | `"itemized"`, `"simplified"` | Display format at checkout |
| `tax_display_label` | string | Label used at checkout (e.g. `"VAT"`) |
| `price_suffix_included` | string | Suffix for tax-included prices |
| `price_suffix_excluded` | string | Suffix for tax-excluded prices |
| `eu_vat_settings` | object | EU VAT compliance configuration |

---

## EU VAT & OSS Compliance

**Prefix:** `/fluent-cart/v2/tax/configuration/settings/eu-vat` | **Policy:** `StoreSettingsPolicy`

### Save EU VAT Cross-Border Settings

`POST /fluent-cart/v2/tax/configuration/settings/eu-vat`

Multi-action endpoint dispatched via `action`:

1. `euCrossBorderSettings`: Save method (`oss`, `home`, `specific`), `oss_country`, `oss_vat`, `home_country`, `home_vat`.
2. `saveCountryRegistration`: Save per-country VAT registration (`country`, `vat`, `rates`).
3. `deleteCountryRegistration`: Delete per-country VAT registration (`country`).

### Other EU VAT Endpoints

- `POST /tax/configuration/settings/eu-vat/reset-rates` — Reset EU standard VAT rates to built-in defaults.
- `GET /tax/configuration/settings/eu-vat/product-overrides` — Retrieve all EU product category overrides & shipping overrides.
- `GET /tax/configuration/settings/eu-vat/oss-rates` — Get OSS country rates per tax class.
- `POST /tax/configuration/settings/eu-vat/oss-rates` — Save OSS country rates.
