# REST API Endpoints Reference

FluentCart registers core REST routes under the `/wp-json/fluent-cart/v2/` namespace.

For an exhaustive reference of all endpoints (including payloads, parameters, and responses for orders, products, customers, subscriptions, licenses, coupons, shipping, and dashboards), see:
- [Exhaustive REST API Reference](rest-api-reference.md)

---


## 1. Authentication & Headers

All requests made externally must supply an Authorization header containing your FluentCart API Key.
```
Authorization: Bearer FC_KEY_YOUR_API_TOKEN_HERE
```

For requests made via front-end Javascript on the same WordPress site, pass the WordPress security nonce:
```
X-WP-Nonce: WP_NONCE_VALUE
```

---

## 2. Endpoint Catalog

### Products API

#### `GET /products`
Retrieve a paginated listing of catalog products.
- **Parameters:**
  - `page` (int) - Page number (default: `1`)
  - `limit` (int) - Items per page (default: `20`)
  - `category` (string) - Category slug filter
  - `search` (string) - Search query filter
- **Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": 99,
      "title": "Custom Consulting Session",
      "slug": "custom-consulting-session",
      "price": 15000,
      "type": "digital",
      "stock_status": "in_stock"
    }
  ],
  "total": 1,
  "pages": 1
}
```

#### `GET /products/{id}`
Retrieve full details of an individual catalog product.

---

### Orders API

#### `GET /orders`
List store orders.
- **Parameters:**
  - `status` (string) - Filter by order status (`processing`, `completed`)
  - `customer_id` (int) - Filter by customer ID

#### `POST /orders`
Create a manual order.
- **Payload Schema:**
```json
{
  "customer_email": "newbuyer@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "items": [
    {
      "product_id": 99,
      "quantity": 1,
      "price": 15000
    }
  ],
  "payment_method": "manual",
  "status": "completed"
}
```

#### `GET /orders/{id}`
Retrieve a single order record.

---

### Subscriptions API

#### `GET /subscriptions`
Retrieve active and expired subscriptions.

#### `POST /subscriptions/{id}/cancel`
Cancel an active subscription immediately.
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Subscription cancelled successfully."
}
```

---

## 3. Registering Custom REST Endpoints in PHP

To extend the FluentCart REST API, hook into the `rest_api_init` action.

```php
add_action('rest_api_init', function () {
    // Register custom checkout endpoint for mobile apps
    register_rest_route('fluent-cart/v2', '/custom-checkout', [
        'methods'             => 'POST',
        'callback'            => 'my_plugin_handle_rest_checkout',
        'permission_callback' => function () {
            // Restrict endpoint access to users who can manage FluentCart
            return current_user_can('manage_fluent_cart');
        }
    ]);
});

/**
 * Handle custom REST checkout request.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 */
function my_plugin_handle_rest_checkout(WP_REST_Request $request) {
    $params = $request->get_json_params();
    $productId = $params['product_id'] ?? 0;

    // Process logic (e.g. initialize cart)
    return new WP_REST_Response([
        'success' => true,
        'checkout_url' => site_url('/checkout/')
    ], 200);
}
```
