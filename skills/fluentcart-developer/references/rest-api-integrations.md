# Integrations API

Manage third-party CRM, LMS, marketing, and email integrations (e.g. FluentCRM, FluentSMTP, Webhooks), global integration feeds, and product-specific automation triggers in FluentCart.

**Base URLs:**  
- Global: `https://your-site.com/wp-json/fluent-cart/v2/integration`  
- Product-Level: `https://your-site.com/wp-json/fluent-cart/v2/products/{product_id}/integrations`  

**Policies:** `IntegrationPolicy` (Global) / `ProductPolicy` (Product-Level)

---

## Endpoints Overview

| Group | Method | Endpoint | Permission / Policy | Controller Method | Description |
|-------|--------|----------|--------------------|-------------------|-------------|
| **Global Add-ons** | GET | `/integration/addons` | `integrations/view` | `AddonsController@getAddons` | List all integration add-ons & installation status |
| | GET | `/integration/global-settings` | `integrations/view` | `IntegrationController@getGlobalSettings` | Get global configuration settings for provider |
| | POST | `/integration/global-settings` | `integrations/manage` | `IntegrationController@setGlobalSettings` | Save global provider credentials (API keys, etc.) |
| | POST | `/integration/feed/install-plugin` | `integrations/manage` | `AddonsController@installAndActivate` | Install & activate whitelisted WP.org plugin add-on |
| **Global Feeds** | GET | `/integration/global-feeds` | `integrations/view` | `IntegrationController@getFeeds` | List all configured global integration feeds |
| | GET | `/integration/global-feeds/settings` | `integrations/view` | `IntegrationController@getSettings` | Get form schema & saved values for feed editor |
| | POST | `/integration/global-feeds/settings` | `integrations/manage` | `IntegrationController@saveSettings` | Create or update a global integration feed |
| | POST | `/integration/global-feeds/change-status/{id}` | `integrations/manage` | `IntegrationController@changeStatus` | Toggle global feed enabled status (`yes`/`no`) |
| | DELETE | `/integration/global-feeds/{id}` | `integrations/delete` | `IntegrationController@deleteSettings` | Permanently delete a global integration feed |
| | GET | `/integration/feed/lists` | `integrations/view` | `IntegrationController@lists` | Fetch field mapping options for chosen list |
| | GET | `/integration/feed/dynamic_options` | `integrations/view` | `IntegrationController@getDynamicOptions` | Fetch dynamic options (post types, CRM tags) |
| | POST | `/integration/feed/chained` | `integrations/manage` | `IntegrationController@chained` | Handle dependent select fields via provider action |
| **Product Feeds** | GET | `/products/{id}/integrations` | `products/view` | `ProductIntegrationsController@getFeeds` | List integration feeds for a specific product |
| | GET | `/products/{id}/integrations/{provider}/settings` | `products/view` | `ProductIntegrationsController@getProductIntegrationSettings` | Get product feed editor schema & variation choices |
| | POST | `/products/{id}/integrations` | `products/edit` | `ProductIntegrationsController@saveProductIntegration` | Create or update product-level integration feed |
| | POST | `/products/{id}/integrations/feed/change-status` | `products/edit` | `ProductIntegrationsController@changeStatus` | Toggle product-level feed status (`yes`/`no`) |
| | DELETE | `/products/{id}/integrations/{feed_id}` | `products/delete` | `ProductIntegrationsController@deleteProductIntegration` | Delete product-level integration feed |

---

## Global Add-ons & Integration Settings

Manage integration provider connections and global authentication details.

**Prefix:** `/fluent-cart/v2/integration` | **Policy:** `IntegrationPolicy`

### List Available Add-ons

`GET /fluent-cart/v2/integration/addons`

#### Response

```json
{
  "addons": {
    "fluent-crm": {
      "installable": "fluent-crm",
      "enabled": true,
      "title": "FluentCRM",
      "logo": "https://example.com/wp-content/plugins/fluent-cart/assets/images/integrations/fluentcrm.svg",
      "categories": ["crm", "core", "marketing"],
      "description": "The most powerful email marketing automation plugin for WordPress."
    },
    "webhook": {
      "title": "Webhook",
      "description": "Send data anywhere via webhook",
      "enabled": true,
      "is_pro": true,
      "is_pro_active": true,
      "categories": ["core"]
    }
  }
}
```

---

### Get Global Integration Settings

`GET /fluent-cart/v2/integration/global-settings`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `settings_key` | string | query | Yes | Integration provider key (e.g., `fluent-crm`, `webhook`) |

---

### Save Global Integration Settings

`POST /fluent-cart/v2/integration/global-settings`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `settings_key` | string | body | Yes | Integration provider key |
| `integration` | object | body | Yes | Key-value settings object for the provider |

> **Hook Trigger:** Execution is dispatched to `fluent_cart/integration/save_global_integration_settings_{settings_key}`.

---

### Install and Activate Add-on Plugin

`POST /fluent-cart/v2/integration/feed/install-plugin`

Installs a whitelisted plugin from WordPress.org.

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `addon` | string | body | Yes | Allowed slugs: `fluent-crm`, `fluent-smtp`, `fluent-community`, `fluent-security`, `fluentform`, `fluent-support` |

#### Response

```json
{
  "message": "Addon installation started successfully.",
  "redirect": "https://example.com/wp-admin/admin.php?page=fluent-cart#/integrations"
}
```

---

## Global Integration Feeds

Global feeds fire automations on every matching order.

**Prefix:** `/fluent-cart/v2/integration/global-feeds` | **Policy:** `IntegrationPolicy`

### List Global Integration Feeds

`GET /fluent-cart/v2/integration/global-feeds`

#### Response

```json
{
  "feeds": [
    {
      "id": 42,
      "name": "Add to FluentCRM list",
      "enabled": "yes",
      "provider": "fluent-crm",
      "feed": {
        "name": "Add to FluentCRM list",
        "enabled": "yes",
        "list_id": "2",
        "list_name": "Customers",
        "merge_fields": {},
        "conditionals": {
          "conditions": [],
          "status": false,
          "type": "all"
        }
      },
      "scope": "global"
    }
  ],
  "available_integrations": {}
}
```

---

### Save Feed Settings

`POST /fluent-cart/v2/integration/global-feeds/settings`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `integration_name` | string | body | Yes | Integration provider key (e.g. `fluent-crm`, `webhook`) |
| `integration_id` | integer | body | No | Existing feed ID to update. Omit to create new feed |
| `integration` | string (JSON) | body | Yes | JSON string containing feed settings (`name`, `enabled`, `list_id`, `merge_fields`, `conditionals`) |

#### Example

```bash
curl -X POST "https://example.com/wp-json/fluent-cart/v2/integration/global-feeds/settings" \
  -u "username:app_password" \
  -H "Content-Type: application/json" \
  -d '{
    "integration_name": "fluent-crm",
    "integration": "{\"name\":\"Add to customers\",\"enabled\":\"yes\",\"list_id\":\"2\",\"list_name\":\"Customers\",\"merge_fields\":{},\"conditionals\":{\"conditions\":[],\"status\":false,\"type\":\"all\"}}"
  }'
```

---

### Change Feed Status

`POST /fluent-cart/v2/integration/global-feeds/change-status/{integration_id}`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `integration_id` | integer | path | Yes | Feed ID to toggle |
| `status` | string | body | Yes | `yes` (enable) or `no` (disable) |

---

### Delete Feed

`DELETE /fluent-cart/v2/integration/global-feeds/{integration_id}`

---

### Helper Endpoints (`lists`, `dynamic_options`, `chained`)

- `GET /integration/feed/lists?integration_name={key}&list_id={id}` — Fetch list merge fields.
- `GET /integration/feed/dynamic_options?option_key={key}&sub_option_key={slug}&search={term}` — Asynchronously fetch dynamic option dropdowns (WP post types, CRM tags, etc.).
- `POST /integration/feed/chained` — Dependent input handling via `fluent_cart/integration/chained_{route}` filter.

---

## Product-Level Integrations

Product-specific integration feeds fire automations only when orders contain the specific product (and optional variations).

**Prefix:** `/fluent-cart/v2/products/{product_id}/integrations` | **Policy:** `ProductPolicy`

### List Product Integration Feeds

`GET /fluent-cart/v2/products/{productId}/integrations`

#### Response

```json
{
  "feeds": [
    {
      "id": 15,
      "name": "Tag VIP buyers",
      "enabled": "yes",
      "provider": "fluent-crm",
      "feed": {
        "name": "Tag VIP buyers",
        "enabled": "yes",
        "list_id": "3",
        "list_name": "VIP Customers",
        "merge_fields": {},
        "conditional_variation_ids": [101, 102],
        "conditionals": {
          "conditions": [],
          "status": false,
          "type": "all"
        }
      },
      "scope": "product"
    }
  ]
}
```

---

### Get Product Integration Settings

`GET /fluent-cart/v2/products/{product_id}/integrations/{integration_name}/settings`

Returns form schema, saved feed values, and `product_variations` list for targeting specific variations.

#### Response

```json
{
  "settings": {
    "conditional_variation_ids": []
  },
  "product_variations": [
    { "id": 101, "title": "Basic Plan" },
    { "id": 102, "title": "Pro Plan" }
  ],
  "scope": "product"
}
```

---

### Save Product Integration Feed

`POST /fluent-cart/v2/products/{product_id}/integrations`

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `product_id` | integer | path | Yes | Product ID |
| `integration_name` | string | body | Yes | Integration provider key (e.g. `fluent-crm`) |
| `integration_id` | integer | body | No | Feed ID to update. Omit to create new feed |
| `integration` | string (JSON) | body | Yes | JSON string containing `name`, `enabled`, `list_id`, `merge_fields`, `conditional_variation_ids`, `conditionals` |

#### Request Example

```json
{
  "integration_name": "fluent-crm",
  "integration": "{\"name\":\"Tag VIP buyers\",\"enabled\":\"yes\",\"list_id\":\"3\",\"conditional_variation_ids\":[101],\"merge_fields\":{},\"conditionals\":{\"conditions\":[],\"status\":false,\"type\":\"all\"}}"
}
```

---

### Change Product Feed Status

`POST /fluent-cart/v2/products/{product_id}/integrations/feed/change-status`

> **Note:** Requires `product_id` in both URL path and request body!

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `product_id` | integer | path & body | Yes | Product ID |
| `notification_id` | integer | body | Yes | Feed ID to toggle |
| `status` | string | body | Yes | `yes` or `no` |

---

### Delete Product Integration Feed

`DELETE /fluent-cart/v2/products/{product_id}/integrations/{integration_id}`
