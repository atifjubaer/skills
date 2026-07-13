# REST API & Webhooks

FluentCart exposes a REST API and a Webhooks subscription system for headless checkouts, third-party integrations, and external workflow automations.

---

## 1. REST API Overview

### Base Endpoint Path
All REST API routes are registered under the WordPress REST namespace:
```
https://yourstore.com/wp-json/fluent-cart/v2/
```

### Authentication Methods
1. **WP Nonce Authentication (Internal Ajax):** Used for front-end JS interactions on the same site. Send the `X-WP-Nonce` header.
2. **API Keys (External Clients):** Admin API keys can be generated from the settings panel. Send the `Authorization: Bearer FC_KEY_...` header.

### Common Endpoint Reference

#### Products API
- `GET /products` - Retrieve list of products
- `GET /products/{id}` - Get individual product details

#### Orders API
- `GET /orders` - Retrieve list of sales orders
- `POST /orders` - Create a manual order
- `GET /orders/{id}` - Get specific order details

#### Subscriptions API
- `GET /subscriptions` - List subscriptions
- `POST /subscriptions/{id}/cancel` - Cancel a subscription

---

## 2. Outgoing Webhooks System

FluentCart includes a robust webhook engine located under **FluentCart Pro > Integrations** or manageable via REST API endpoints. Webhooks run asynchronously using WordPress Action Scheduler.

### Webhook Event Categories
- `order.created` - Triggers when checkout creates a pending order
- `order.completed` - Triggers when order transitions to complete status
- `order.refunded` - Triggers when a refund completes
- `subscription.created` - Triggers when subscription variation is purchased
- `subscription.cancelled` - Triggers on subscription cancellation
- `subscription.expired` - Triggers when subscription runs past its grace period

### Programmatic Webhook Payload Structure
Incoming webhook events send a JSON payload containing full details.

```json
{
  "event": "order.completed",
  "timestamp": 1782845600,
  "data": {
    "order_id": 4829,
    "status": "completed",
    "payment_status": "paid",
    "subtotal": 15000,
    "discount": 1000,
    "tax": 1120,
    "total": 15120,
    "currency": "USD",
    "payment_method": "stripe",
    "customer": {
      "id": 182,
      "email": "customer@example.com",
      "first_name": "Jane",
      "last_name": "Doe"
    },
    "billing_address": {
      "address_1": "123 Main St",
      "city": "Austin",
      "state": "TX",
      "zip": "78701",
      "country": "US"
    },
    "items": [
      {
        "product_id": 99,
        "title": "Custom Consulting Session",
        "price": 15000,
        "quantity": 1
      }
    ]
  }
}
```

---

## 3. Webhook Listener Example (PHP Receiver)

An example of an external endpoint receiving and validating a webhook payload from FluentCart:

```php
<?php
// Retrieve the raw POST request body
$rawPayload = file_get_contents('php://input');

// Retrieve the custom secret token signature header sent by FluentCart
$signature = $_SERVER['HTTP_X_FLUENTCART_SIGNATURE'] ?? '';

// Your webhook secret configured in the FluentCart admin panel
$webhookSecret = 'fc_secret_token_123456';

// Calculate the expected signature
$expectedSignature = hash_hmac('sha256', $rawPayload, $webhookSecret);

if (!hash_equals($expectedSignature, $signature)) {
    // Return unauthorized code if signature verification fails
    http_response_code(401);
    echo json_encode(['error' => 'Invalid signature']);
    exit;
}

// Parse the validated JSON payload
$payload = json_decode($rawPayload, true);

if ($payload['event'] === 'order.completed') {
    $orderData = $payload['data'];
    $orderId = $orderData['order_id'];
    $customerEmail = $orderData['customer']['email'];

    // Process order fulfillment logic here
    fulfill_customer_order($orderId, $customerEmail);
}

http_response_code(200);
echo json_encode(['status' => 'success']);
```
