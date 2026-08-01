# Roles & Permissions API (Pro)

Manage custom store roles (`super_admin`, `manager`, `worker`, `accountant`), assign capabilities to WordPress users, search eligible users, and inspect role permission matrices in FluentCart Pro.

**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2/roles`  
**Policy:** `AdminPolicy` (Requires WordPress `manage_options` / `is_super_admin` capability)

---

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/roles/managers` | List all WordPress users assigned a FluentCart shop role |
| GET | `/roles/user-list` | Search WordPress users eligible for role assignment (excludes WP admins) |
| GET | `/roles` | List available FluentCart role definitions (titles & descriptions) |
| POST | `/roles` | Assign a shop role to a WordPress user (grants `fluent_cart_admin` capability) |
| GET | `/roles/{key}` | Placeholder: Get role details |
| POST | `/roles/{key}` | Placeholder: Update role definition |
| DELETE | `/roles/{key}` | Remove a shop role assignment from a user (removes `fluent_cart_admin`) |

---

## 1. List & Search Users

### List Managers

`GET /fluent-cart/v2/roles/managers`

Retrieve all WordPress users who have been assigned a shop role along with their permissions array.

#### Response

```json
{
  "managers": [
    {
      "id": 5,
      "email": "manager@example.com",
      "display_name": "Jane Manager",
      "username": "janemanager",
      "shop_role": "manager",
      "description": "With All Permissions Except Sensitive Settings",
      "registered_at": "2025-03-10 08:00:00",
      "role_permissions": [
        "store/settings",
        "products/view",
        "orders/view",
        "orders/manage",
        "reports/view"
      ]
    }
  ]
}
```

---

### Search Eligible Users

`GET /fluent-cart/v2/roles/user-list`

Search for WordPress users who can be assigned a shop role.

> **Exclusion Rule:** WordPress site Administrators (`manage_options`) are automatically excluded from search results since they already possess full store capabilities.

#### Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `search` | string | query | No | Partial search by display name or email address |
| `user_ids` | string/array | query | No | Include specific user IDs regardless of search term |

---

## 2. Role Assignments & Definitions

### List Roles

`GET /fluent-cart/v2/roles`

Retrieve built-in role titles and descriptions (`super_admin`, `manager`, `worker`, `accountant`).

---

### Assign Role

`POST /fluent-cart/v2/roles`

Assigns a role to a user. The user is granted the `fluent_cart_admin` capability and the role key is stored in user meta.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | WordPress user ID |
| `role_key` | string | Yes | Role slug (`super_admin`, `manager`, `worker`, `accountant`) |

#### Response

```json
{
  "message": "Role synced successfully",
  "is_updated": true
}
```

---

### Delete Role Assignment

`DELETE /fluent-cart/v2/roles/{key}`

Removes the shop role from the specified user and strips the `fluent_cart_admin` capability.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | string | Yes (Path) | Role key being removed |
| `user_id` | integer | Yes (Body/Query) | WordPress user ID |

---

## 3. Built-In Role Definitions & Capability Matrix

| Role | Key Permissions Included | Key Restrictions |
|------|--------------------------|------------------|
| **Super Admin** | `store/settings`, `store/sensitive`, `products/*`, `customers/*`, `orders/*`, `subscriptions/*`, `licenses/*`, `coupons/*`, `reports/*`, `integrations/*`, `labels/*`, `dashboard_stats/view` | None (Full Access) |
| **Manager** | All Super Admin permissions except sensitive store settings | Excludes `store/sensitive` |
| **Worker** | View access for products, customers, orders, subscriptions, licenses, integrations; manage order statuses; view & manage coupons | No product/customer editing, no report access |
| **Accountant** | View access for products, customers, orders, subscriptions, licenses, coupons, integrations; view & export orders and reports | Read-only with export rights; no management actions |

---

## Hooks & Extension Filters

```php
// Extend or customize available role definitions
add_filter('fluent_cart/permission/all_roles', function($roles) {
    $roles['fulfillment_agent'] = [
        'title' => 'Fulfillment Agent',
        'description' => 'Manage orders and shipping statuses only'
    ];
    return $roles;
});
```
