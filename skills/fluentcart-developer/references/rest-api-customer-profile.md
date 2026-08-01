# Customer Profile API

Customer-facing frontend REST API endpoints for customer portal dashboards, profile details, order histories, upgrade path choices, transaction billing invoice editing, signed digital downloads, and checkout/profile address books in FluentCart.

**Base URL:** `https://your-site.com/wp-json/fluent-cart/v2`  
**Policy:** `CustomerFrontendPolicy` (Requires logged-in customer; verifies authenticated WP user matches requested customer record)

> All monetary values (`ltv`, `total_amount`, `subtotal`, `unit_price`) are in **cents** (`$10.00` = `1000`).

---

## Endpoints Overview

| Group | Method | Endpoint | Description |
|-------|--------|----------|-------------|
| **Customer Details** | GET | `/customers/{customerId}` | Get authenticated customer details |
| | PUT | `/customers/{customerId}` | Update authenticated customer profile |
| | GET | `/customers/{customerId}/orders` | Paginated customer order history (customer prefix) |
| **Checkout Addresses** | GET | `/customers/{addressId}/update-address-select` | Select address & apply to active checkout cart (`fct_cart_hash`) |
| | POST | `/customers/add-address` | Create new address during checkout (prefixed fields) |
| | PUT | `/customers/{customerId}/address` | Update address during checkout |
| | DELETE | `/customers/{customerId}/address` | Delete address during checkout |
| | POST | `/customers/{customerId}/address/make-primary` | Set primary billing or shipping address |
| **Portal Overview** | GET | `/customer-profile/` | Portal dashboard overview (recent 5 orders & UI section hooks) |
| | GET | `/customer-profile/profile` | Get customer profile & saved billing/shipping address books |
| | POST | `/customer-profile/update` | Update name, email, or change password |
| **Portal Addresses** | POST | `/customer-profile/create-address` | Add new address from portal profile |
| | POST | `/customer-profile/edit-address` | Edit address from portal profile |
| | POST | `/customer-profile/make-primary-address` | Set primary address from portal profile |
| | POST | `/customer-profile/delete-address` | Delete address (Guards against primary or last address) |
| **Portal Orders** | GET | `/customer-profile/orders` | Paginated customer orders (excludes child subscription renewals) |
| | GET | `/customer-profile/orders/{order_uuid}` | Get full order details, items, transactions, & downloads |
| | GET | `/customer-profile/orders/{order_uuid}/upgrade-paths` | Get plan upgrade/downgrade variation choices & prorations |
| | GET | `/customer-profile/orders/{transaction_uuid}/billing-address` | Get transaction billing address for invoice editing |
| | PUT | `/customer-profile/orders/{transaction_uuid}/billing-address` | Save transaction billing address & VAT/Tax ID |
| **Downloads** | GET | `/customer-profile/downloads` | List downloadable files with time-limited signed token links |

---

## Customer Details & Checkout Addresses

### Get & Update Customer Details

- `GET /fluent-cart/v2/customers/{customerId}?with[]=billing_address`
- `PUT /fluent-cart/v2/customers/{customerId}` — Updates `email`, `first_name`, `last_name`, `full_name`, `city`, `state`, `postcode`, `country`.

---

### Checkout Address Management

- `GET /fluent-cart/v2/customers/{customerAddressId}/update-address-select?fct_cart_hash={hash}` — Select address for active cart. Returns updated checkout summary HTML fragments.
- `POST /fluent-cart/v2/customers/add-address` — Add address during checkout. Fields use type prefix (`billing_address_1`, `shipping_city`, etc.).
- `PUT /fluent-cart/v2/customers/{customerId}/address` — Update checkout address (`address.id`).
- `DELETE /fluent-cart/v2/customers/{customerId}/address` — Delete checkout address (`address.id`).
- `POST /fluent-cart/v2/customers/{customerId}/address/make-primary` — Set primary address (`address.id`, `address.type`).

---

## Customer Portal Management

### Dashboard & Profile Overview

`GET /fluent-cart/v2/customer-profile/`

Returns customer dashboard overview with the 5 most recent orders and extension hook sections (`sections_parts`).

```json
{
  "message": "Success",
  "dashboard_data": {
    "orders": [
      {
        "created_at": "2025-06-15 10:30:00",
        "invoice_no": "INV-000101",
        "total_amount": 4999,
        "uuid": "abc-123-def",
        "type": "one-time",
        "status": "completed"
      }
    ]
  },
  "sections_parts": { "before_orders_table": "", "after_orders_table": "" }
}
```

---

### Update Profile & Password

`POST /fluent-cart/v2/customer-profile/update`

Updates customer details and associated WordPress user name/password.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `first_name` | string | No | Customer first name |
| `last_name` | string | No | Customer last name |
| `email` | string | Yes | Valid email address |
| `current_password` | string | No | Required for password change |
| `new_password` | string | No | New password string |
| `confirm_new_password` | string | No | Confirm new password |

---

### Portal Address Management

- `POST /customer-profile/create-address` — Add portal address (`type`, `name`, `label`, `address_1`, `city`, `state`, `postcode`, `country`, `is_primary`).
- `POST /customer-profile/edit-address` — Edit portal address (`id`, `type`, `name`, `address_1`, etc.).
- `POST /customer-profile/make-primary-address` — Set primary address (`addressId`, `type`).
- `POST /customer-profile/delete-address` — Delete address (`addressId`).

> **Delete Guards:**  
> - Primary addresses cannot be deleted (`"Primary address cannot be deleted!"`).  
> - At least one address must remain (`"At least one address must remain. Address deletion failed!"`).

---

## Customer Orders & Upgrades

### List & View Customer Orders

`GET /fluent-cart/v2/customer-profile/orders`

List orders (paginated, excludes child renewal orders, supports `search`).

`GET /fluent-cart/v2/customer-profile/orders/{order_uuid}`

Retrieve full order details including line items, transactions, subscriptions, and download links.

> **Renewal Order Redirect:** If `order_uuid` belongs to a renewal order, returns:  
> `{ "message": "This is a renewal order. Please check the parent order details.", "parent_order": { "uuid": "parent-abc-123" } }`

---

### Plan Upgrade Paths

`GET /fluent-cart/v2/customer-profile/orders/{order_uuid}/upgrade-paths?variation_id={id}`

Returns available plan upgrade/downgrade options and prorated price calculation.

```json
{
  "upgradePaths": [
    {
      "variation_id": 15,
      "title": "Premium Plugin - 5 Sites",
      "price": 9999,
      "billing_interval": "year",
      "upgrade_type": "upgrade",
      "prorated_amount": 5000
    }
  ]
}
```

---

### Transaction Billing Address & Invoice Editing

`GET /fluent-cart/v2/customer-profile/orders/{transaction_uuid}/billing-address`  
`PUT /fluent-cart/v2/customer-profile/orders/{transaction_uuid}/billing-address`

Retrieve or update billing address details and `vat_tax_id` for invoice generation.

---

## Digital Product Downloads

`GET /fluent-cart/v2/customer-profile/downloads`

Retrieve downloadable files for completed orders. `download_url` contains time-limited signed tokens generated via `Helper::generateDownloadFileLink()`.

```json
{
  "message": "Success",
  "downloads": {
    "data": [
      {
        "file_size": "2.5 MB",
        "title": "premium-plugin-v2.0.1.zip",
        "download_url": "https://example.com/?fct_download=eyJ0eXAi..."
      }
    ],
    "total": 1,
    "per_page": 10
  }
}
```
