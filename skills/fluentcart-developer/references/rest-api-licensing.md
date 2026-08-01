# Software Licensing API (Pro)

Comprehensive developer reference for managing software licenses in FluentCart Pro, including admin license management, per-product license rules, customer portal self-service, site license activation, and the public non-REST software update API for plugins and themes.

**Base URLs:**  
- REST API: `https://your-site.com/wp-json/fluent-cart/v2`  
- Public Update API (Non-REST): `https://your-site.com/?fluent-cart={action}`  

**Policies:** `LicensePolicy` (Admin) / `CustomerFrontendPolicy` (Customer Portal) / `AdminPolicy` (Site License) / `PublicPolicy` (Public Update API)

---

## Endpoints Overview

| Group | Method | Endpoint | Authorization | Description |
|-------|--------|----------|---------------|-------------|
| **Admin Licensing** | GET | `/licensing/licenses` | `licenses/view` | List licenses with tab filters (`active`, `expired`, `disabled`, `inactive`) |
| | GET | `/licensing/licenses/customer/{id}` | `licenses/view` | List licenses for a specific customer |
| | GET | `/licensing/licenses/{id}` | `licenses/view` | Get full license details, activations, & order relation |
| | POST | `/licensing/licenses/{id}/regenerate-key` | `licenses/manage` | Generate new random key & invalidate old key |
| | POST | `/licensing/licenses/{id}/extend-validity` | `licenses/manage` | Change expiration date (`YYYY-MM-DD HH:MM:SS` or `lifetime`) |
| | POST | `/licensing/licenses/{id}/update_status` | `licenses/manage` | Change status (`active`, `disabled`, `expired`) |
| | POST | `/licensing/licenses/{id}/update_limit` | `licenses/manage` | Update max site limit (`0` or `"unlimited"`) |
| | POST | `/licensing/licenses/{id}/activate_site` | `licenses/manage` | Manually activate site URL |
| | POST | `/licensing/licenses/{id}/deactivate_site` | `licenses/manage` | Deactivate specific site activation by `activation_id` |
| | DELETE | `/licensing/licenses/{id}/delete` | `licenses/delete` | Delete software license |
| **Product Settings** | GET | `/licensing/products/{id}/settings` | `licenses/view` | Get per-product variation validity & activation rules |
| | POST | `/licensing/products/{id}/settings` | `licenses/manage` | Save per-product license configuration (Guarded for bundles) |
| **Customer Portal** | GET | `/customer-profile/licenses/` | Portal Auth | List logged-in customer's licenses (uses `license_key`) |
| | GET | `/customer-profile/licenses/{key}` | Portal Auth | Get customer license details & section parts |
| | GET | `/customer-profile/licenses/{key}/activations` | Portal Auth | List active sites (`is_local` sites don't count towards limit) |
| | POST | `/customer-profile/licenses/{key}/deactivate_site` | Portal Auth | Deactivate site from customer portal |
| **Plugin Pro License** | GET | `/settings/license/` | `AdminPolicy` | Get site's FluentCart Pro plugin license status |
| | POST | `/settings/license/` | `AdminPolicy` | Activate FluentCart Pro plugin license key on site |
| | DELETE | `/settings/license/` | `AdminPolicy` | Deactivate FluentCart Pro plugin license on site |
| **Public API (Non-REST)** | GET/POST | `/?fluent-cart=check_license` | Public | Verify license validity & activation count |
| | POST | `/?fluent-cart=activate_license` | Public | Activate site (Auto-detects staging/local sites) |
| | POST | `/?fluent-cart=deactivate_license` | Public | Deactivate site URL |
| | GET/POST | `/?fluent-cart=get_license_version` | Public | Fetch plugin/theme version, changelog, & 48h signed download package URL |
| | GET | `/?fluent-cart=download_license_package` | Public (Token) | Validates `fct_package` token & 302 redirects to file |

---

## 1. Admin License Management

**Prefix:** `/fluent-cart/v2/licensing/licenses` | **Policy:** `LicensePolicy`

### List Licenses

`GET /fluent-cart/v2/licensing/licenses`

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `active_view` | string | No | Tab filter: `active`, `expired`, `disabled`, `inactive` |
| `search` | string | No | Search across license key, order ID, customer, activated URLs, or operator syntax (`license_key = abc`) |
| `sort_by` | string | No | Fillable column to sort by (default: `id`) |
| `sort_type` | string | No | `asc` or `desc` (default: `desc`) |
| `filter_type` | string | No | `simple` or `advanced` |
| `advanced_filters` | string (JSON) | No | JSON filter array (by product variation, customer names, status, activations count, expiration date) |
| `user_tz` | string | No | Timezone string for date filtering |

> **Status Override Note:** If a license has an `expiration_date` in the past, its status field is dynamically overridden to `expired` in the API response even if stored as `active`.

---

### Extend License Validity

`POST /fluent-cart/v2/licensing/licenses/{id}/extend-validity`

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | License ID |
| `expiration_date` | string | Yes | Date string (`YYYY-MM-DD HH:MM:SS`) or string `lifetime` |

> Automatically updates status to `active` if currently `inactive` or non-active.

---

### Product License Settings

`GET /fluent-cart/v2/licensing/products/{id}/settings`  
`POST /fluent-cart/v2/licensing/products/{id}/settings`

Configures software versioning, auto-update file, WP readme/banner metadata, and variation validity rules (`unit`: `day`, `week`, `month`, `year`, `lifetime`; `value`: integer; `activation_limit`: integer/string).

> **Bundle Product Guard:** Licensing is disabled for bundle products (`is_bundle_product: true`). Bundle item licenses are generated based on each individual bundle item's license settings. Attempting to save licensing settings on a bundle product returns HTTP `422`.

---

## 2. Customer Portal Self-Service

Endpoints under `/fluent-cart/v2/customer-profile/licenses` identify licenses by their `license_key` string (not numeric ID).

- `GET /customer-profile/licenses/` — List customer's licenses. Returns `license_key`, `status`, `expiration_date`, `activation_count`, `limit`, `renewal_url`, `has_upgrades`.
- `GET /customer-profile/licenses/{key}` — Full details & `section_parts` extension hooks.
- `GET /customer-profile/licenses/{key}/activations` — List activated sites (`site_url`, `is_local`, `status`). `is_local: 1` sites do not count towards the activation limit.
- `POST /customer-profile/licenses/{key}/deactivate_site` — Deactivate site (`site_url`).

---

## 3. Public License & Software Update API (Non-REST)

Designed for distributed software (plugins, themes, desktop applications) to perform automatic updates and activation directly via query string requests.

**Base URL:** `https://your-site.com/?fluent-cart={action}`

### Key Endpoints

#### 1. Activate License (`/?fluent-cart=activate_license`)

`POST /?fluent-cart=activate_license`

**Parameters:** `license_key`, `item_id`, `site_url`, `server_version`, `platform_version`.

> **Local & Staging Site Auto-Detection:**  
> Sites matching common staging patterns are automatically assigned `is_local = 1` and do not count toward activation limits:  
> - **Subdomains:** `staging.`, `dev.`, `test.`, `qa.`, `sandbox.`, `beta.`, `preview.`, `uat.`, `development.`  
> - **Subfolders:** `/staging/`, `/dev/`, `/test/`  
> - **Domains:** `localhost`, `.wpengine.com`, `.kinsta.cloud`, `.cloudwaysapps.com`, `.pantheonsite.io`

---

#### 2. Get License Version (`/?fluent-cart=get_license_version`)

`GET/POST /?fluent-cart=get_license_version`

**Parameters:** `item_id`, `license_key` (or `activation_hash`), `site_url`.

Returns version metadata (`new_version`, `stable_version`, `sections.changelog`, `banners`, `icons`).  
- **Valid License:** Includes `package` signed URL containing a time-limited token (**expires in 48 hours**).  
- **Invalid / Expired License:** Returns version metadata but sets `package: ""` and `download_link: ""`.

---

#### 3. Download Package (`/?fluent-cart=download_license_package`)

`GET /?fluent-cart=download_license_package&fct_package={token}`

Validates `fct_package` Base64 token and returns an HTTP `302` redirect to the actual file download payload.

---

## Hooks & Filters Reference

```php
// Filter check license response payload
add_filter('fluent_cart/license/check_license_response', function($response) {
    // Modify response array
    return $response;
});

// Customize staging domain detection
add_filter('fluent_cart/license/staging_domains', function($domains) {
    $domains[] = 'mycompany-staging.com';
    return $domains;
});

// Customize license expiration grace period (default 15 days)
add_filter('fluent_cart/license/grace_period_in_days', function($days) {
    return 30;
});

// Action triggered on successful site activation
add_action('fluent_cart/license/site_activated', function($activationData) {
    // Handle post-activation logic
});
```
