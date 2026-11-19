# POST Save Store Settings

## `POST /settings/store`

**POST Save Store Settings**

Update store configuration settings. Submitted values are merged with existing settings.

**Required permission:** `store/settings`

- **operationId:** `saveStoreSettings`
- **tags:** Settings

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "settings_name": {
      "type": "string",
      "description": "Settings tab identifier. Required for `store_setup` tab validation (enforces `store_name` and `store_country`).",
      "example": "store_setup"
    },
    "store_name": {
      "type": "string",
      "description": "Store name. Required when `settings_name` is `store_setup`. Max 200 characters.",
      "example": "TechStore Inc."
    },
    "store_logo": {
      "type": "object",
      "description": "Store logo with `id`, `url`, and `title`.",
      "properties": {
        "id": {
          "type": "integer"
        },
        "url": {
          "type": "string",
          "format": "uri"
        },
        "title": {
          "type": "string"
        }
      }
    },
    "currency": {
      "type": "string",
      "description": "Store currency code (e.g., `USD`, `EUR`, `GBP`).",
      "example": "USD"
    },
    "currency_position": {
      "type": "string",
      "description": "Currency symbol position: `before` or `after`.",
      "example": "before"
    },
    "decimal_separator": {
      "type": "string",
      "description": "Decimal separator style: `dot` or `comma`.",
      "example": "dot"
    },
    "checkout_button_text": {
      "type": "string",
      "description": "Custom text for the checkout button.",
      "example": "Checkout"
    },
    "view_cart_button_text": {
      "type": "string",
      "description": "Custom text for the view cart button.",
      "example": "View Cart"
    },
    "cart_button_text": {
      "type": "string",
      "description": "Custom text for the add-to-cart button.",
      "example": "Add To Cart"
    },
    "popup_button_text": {
      "type": "string",
      "description": "Custom text for the product popup button.",
      "example": "View Product"
    },
    "out_of_stock_button_text": {
      "type": "string",
      "description": "Custom text for the out-of-stock button.",
      "example": "Out of stock"
    },
    "checkout_method_style": {
      "type": "string",
      "description": "Payment method display on checkout: `logo` or other styles.",
      "example": "logo"
    },
    "enable_modal_checkout": {
      "type": "string",
      "description": "Enable modal/popup checkout: `yes` or `no`.",
      "example": "no"
    },
    "show_cart_icon_in_nav": {
      "type": "string",
      "description": "Show cart icon in navigation: `yes` or `no`.",
      "example": "no"
    },
    "show_cart_icon_in_body": {
      "type": "string",
      "description": "Show floating cart icon: `yes` or `no`.",
      "example": "yes"
    },
    "additional_address_field": {
      "type": "string",
      "description": "Show additional address field: `yes` or `no`.",
      "example": "yes"
    },
    "hide_coupon_field": {
      "type": "string",
      "description": "Hide coupon input on checkout: `yes` or `no`.",
      "example": "no"
    },
    "user_account_creation_mode": {
      "type": "string",
      "description": "Account creation mode: `all`, `optional`, or `disabled`.",
      "example": "all"
    },
    "force_ssl": {
      "type": "string",
      "description": "Force SSL on checkout: `yes` or `no`.",
      "example": "no"
    },
    "checkout_page_id": {
      "type": "integer",
      "description": "WordPress page ID for the checkout page."
    },
    "cart_page_id": {
      "type": "integer",
      "description": "WordPress page ID for the cart page."
    },
    "receipt_page_id": {
      "type": "integer",
      "description": "WordPress page ID for the order receipt page."
    },
    "shop_page_id": {
      "type": "integer",
      "description": "WordPress page ID for the shop page."
    },
    "customer_profile_page_id": {
      "type": "integer",
      "description": "WordPress page ID for the customer profile page."
    },
    "store_country": {
      "type": "string",
      "description": "Store country code. Required when `settings_name` is `store_setup`. Max 200 characters.",
      "example": "US"
    },
    "store_state": {
      "type": "string",
      "description": "Store state/province code.",
      "example": "DE"
    },
    "store_city": {
      "type": "string",
      "description": "Store city.",
      "example": "Newark"
    },
    "store_address1": {
      "type": "string",
      "description": "Store address line 1.",
      "example": "2035 Sunset Lake Road"
    },
    "store_address2": {
      "type": "string",
      "description": "Store address line 2.",
      "example": "Suite 200"
    },
    "store_postcode": {
      "type": "string",
      "description": "Store postal/zip code.",
      "example": "19702"
    },
    "order_mode": {
      "type": "string",
      "description": "Order/payment mode: `test` or `live`.",
      "example": "live"
    },
    "variation_view": {
      "type": "string",
      "description": "Product variation display: `both`, `grid`, or `list`.",
      "example": "both"
    },
    "variation_columns": {
      "type": "string",
      "description": "Variation layout style: `masonry` or other layouts.",
      "example": "masonry"
    },
    "product_slug": {
      "type": "string",
      "description": "Custom product URL slug.",
      "example": "items"
    },
    "min_receipt_number": {
      "type": "string",
      "description": "Minimum receipt/invoice number.",
      "example": "1"
    },
    "inv_prefix": {
      "type": "string",
      "description": "Invoice number prefix (e.g., `INV-`).",
      "example": "INV-"
    },
    "frontend_theme": {
      "type": "object",
      "description": "Theme color overrides. Object of key-value pairs where values are hex colors.",
      "additionalProperties": {
        "type": "string"
      }
    }
  },
  "example": {
    "settings_name": "store_setup",
    "store_name": "TechStore Inc.",
    "store_country": "US",
    "store_state": "CA",
    "store_city": "San Francisco",
    "store_address1": "456 Market Street",
    "store_postcode": "94102",
    "currency": "USD",
    "currency_position": "before",
    "decimal_separator": "dot",
    "order_mode": "live"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/settings`). |
| `422` | Validation failed, or the referenced record does not exist. |
