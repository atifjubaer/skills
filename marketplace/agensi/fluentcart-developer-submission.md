# Agensi Skill Submission: FluentCart Developer

## Step 1: Skill ZIP Upload
- **File:** `marketplace/agensi/fluentcart-developer.zip`
- **Logo:** `marketplace/assets/fluentcart-developer-logo.png`

## Step 2: Skill Details
- **Skill Name:** FluentCart Developer Pro Agent
- **Summary:** Complete developer reference for FluentCart WordPress e-commerce: hooks, database schemas, REST APIs, custom payment gateways, and shipping integrations.
- **Category:** Developer Tools / WordPress
- **Tags:** `fluentcart`, `wordpress`, `ecommerce`, `payments`, `php`

### Full Description:
```markdown
# FluentCart Developer Pro Agent

The definitive developer knowledge base and architecture manual for **FluentCart**, the high-performance WordPress e-commerce platform.

### What's Included:
- **Hook Catalog:** Comprehensive signatures and argument definitions for FluentCart action & filter hooks (order lifecycle, checkout, subscriptions, licenses).
- **Database Schema Models:** Table schemas, foreign keys, and indexes for `wp_fct_*` tables.
- **Custom Payment Gateways:** Working boilerplate, webhook listeners, and transaction reconciliation patterns.
- **Shipping & Surcharges:** Dynamic shipping carriers, custom fee surcharges, and ghost product handling.
- **REST API Reference:** Admin and customer profile endpoints, schema payloads, and authentication.

### Pair with Fastr MCP Suite:
For live payment gateway code generation and database querying inside Claude, install our companion MCP server on MCPize:
👉 **[Fastr MCP Suite on MCPize](https://mcpize.com/mcp/fastr-mcp-suite)**
```

## Step 3: See it in Action (Demo)

### The Request (what the buyer types):
```text
I need to add a custom payment gateway called "QuickPay" to FluentCart in WordPress.
Can you provide the complete boilerplate class implementing the necessary FluentCart gateway hooks,
settings fields, and redirect flow?
```

### The Result (what your agent delivers):
```text
Here is the production-ready custom payment gateway integration for FluentCart implementing the `fluent_cart/payment_methods` filter and gateway abstract methods.

### 1. Register Gateway Hook
```php
<?php
defined('ABSPATH') || exit;

add_filter('fluent_cart/payment_methods', function ($methods) {
    $methods['quickpay'] = [
        'title'       => __('QuickPay', 'fluent-cart-quickpay'),
        'description' => __('Pay securely via QuickPay gateway.', 'fluent-cart-quickpay'),
        'class'       => QuickPayGateway::class,
        'supports'    => ['products', 'refunds']
    ];
    return $methods;
});
```

### 2. Gateway Implementation Class
```php
use FluentCart\App\Services\Payments\BasePaymentMethod;

class QuickPayGateway extends BasePaymentMethod
{
    public function handlePayment($order)
    {
        $orderId = $order->id;
        $amount  = $order->total_amount;
        $apiKey  = $this->getSetting('api_key');

        // Create remote session and redirect customer
        $redirectUrl = "https://quickpay.example.com/checkout?order={$orderId}&amount={$amount}";

        return [
            'status'       => 'success',
            'redirect_url' => $redirectUrl,
            'message'      => __('Redirecting to payment gateway...', 'fluent-cart-quickpay')
        ];
    }
}
```
```

## Step 4: Compatibility
- **Universal SKILL.md Standard:** Compatible with Claude Code, Cursor, Codex CLI, OpenClaw, Gemini CLI, VS Code Copilot.
- **Compatibility Note:** No external dependencies required. Works offline with any markdown-capable agent.

## Step 5: Pricing
- **Pricing Model:** Free ($0) — recommended for maximum developer adoption and funneling to the $19/mo Fastr MCP Suite.
