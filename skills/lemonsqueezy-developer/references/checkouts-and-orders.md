# Lemon Squeezy Checkouts & Orders API

Generate dynamic checkout URLs, embed checkout overlays (iframe), pass custom metadata, and retrieve order details.

---

## 1. Creating Dynamic Checkouts via API

To generate a custom checkout on the fly:

**Endpoint:** `POST https://api.lemonsqueezy.com/v1/checkouts`  
**Headers:**
```http
Accept: application/vnd.api+json
Content-Type: application/vnd.api+json
Authorization: Bearer <YOUR_API_KEY>
```

### Request Payload Example
```json
{
  "data": {
    "type": "checkouts",
    "attributes": {
      "custom_price": 5000,
      "product_options": {
        "name": "Custom Consulting Hours",
        "description": "5 hours of dedicated architecture review",
        "redirect_url": "https://myapp.com/dashboard/billing?status=success",
        "receipt_button_text": "Return to Dashboard",
        "receipt_link_url": "https://myapp.com/dashboard",
        "enabled_variants": [14]
      },
      "checkout_options": {
        "embed": false,
        "media": true,
        "logo": true,
        "desc": true,
        "discount": true,
        "dark": false,
        "subscription_preview": true,
        "button_color": "#2DD4BF"
      },
      "checkout_data": {
        "email": "user@example.com",
        "name": "Alice Smith",
        "billing_address": {
          "country": "US"
        },
        "tax_number": "GB123456789",
        "discount_code": "LAUNCH20",
        "custom": {
          "user_id": "usr_99182",
          "workspace_id": "ws_1102"
        }
      },
      "preview": false,
      "expires_at": "2026-12-31T23:59:59.000000Z"
    },
    "relationships": {
      "store": {
        "data": {
          "type": "stores",
          "id": "1"
        }
      },
      "variant": {
        "data": {
          "type": "variants",
          "id": "14"
        }
      }
    }
  }
}
```

### Critical Checkout Attributes
- `custom_price`: Integer in cents (e.g., `5000` = `$50.00`). Requires variant with "Pay what you want" or custom pricing enabled.
- `checkout_data.custom`: Arbitrary key-value object. **Crucial:** Lemon Squeezy echoes this exact object back in all subsequent webhook events (`meta.custom_data`).
- `checkout_options.embed`: Set `true` if serving through Lemon.js overlay; `false` for hosted full-page checkout.
- `expires_at`: ISO 8601 timestamp. If omitted, URL remains valid indefinitely.

---

## 2. Lemon.js Overlay Integration (In-App Checkout)

Keep customers on your site without redirecting:

```html
<!-- Include Lemon.js once in your layout -->
<script src="https://assets.lemonsqueezy.com/lemon.js" defer></script>

<!-- Add .lemonsqueezy-button class to any link -->
<a href="https://yourstore.lemonsqueezy.com/buy/variant-slug?embed=1" 
   class="lemonsqueezy-button">
  Buy Now
</a>

<script>
window.createLemonSqueezy = function () {
  window.LemonSqueezy.Setup({
    eventHandler: (event) => {
      console.log('Lemon.js Event:', event.event);
      if (event.event === 'Checkout.Success') {
        console.log('Order Details:', event.data.order);
        // Promptly redirect or unlock UI while waiting for webhook confirmation
      }
    }
  });
};
</script>
```

---

## 3. Order Management Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/v1/orders` | List all orders with filters (`filter[store_id]`, `filter[user_email]`, `filter[status]`). |
| `GET` | `/v1/orders/{id}` | Retrieve single order details. |
| `GET` | `/v1/order-items` | Retrieve specific line items, variants, and quantities. |

### Monetary Calculation Note
All monetary values in the Lemon Squeezy API are integers representing cents:
* `$19.99` = `1999`
* `$100.00` = `10000`
Never use floating-point math for order calculations.
