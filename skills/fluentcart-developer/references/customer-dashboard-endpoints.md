# Adding Custom Pages to the FluentCart Customer Dashboard

Comprehensive architectural and implementation guide for extending the FluentCart Vue 3 customer portal with server-rendered PHP pages and custom navigation tabs using `fluent_cart_api()->addCustomerDashboardEndpoint()`.

Based on the official FluentCart engineering specification (`dev.fluentcart.com/engineering/adding-custom-pages-to-the-customer-dashboard.html`).

---

## Architecture: The Vue SPA Hybrid Routing Trick

The FluentCart customer portal is a Vue 3 single-page application. Routes like `dashboard`, `purchase-history`, `subscriptions`, `licenses`, `downloads`, and `profile` are client-side routes compiled in core's JavaScript bundle.

Add-ons (such as a wallet plugin, ticketing system, or custom payment method manager) cannot compile Vue components into core's bundle. To solve this, FluentCart provides a hybrid routing layer:
1. Core registers a single wildcard rewrite rule on `init`:
   ```php
   add_rewrite_rule(
       '^' . $pageSlug . '/(.+)?$',
       'index.php?page_id=' . $customerProfilePageId,
       'top'
   );
   ```
2. When a visitor requests `/account/{endpoint-slug}`, WordPress loads the customer dashboard page.
3. In `CustomerProfileHandler::maybeCustomEndpointContent()`, core strips the page slug and extracts the **first path segment**.
4. If that segment matches a registered custom endpoint, **the Vue SPA never boots**. Instead, core wraps your server-rendered HTML inside the portal shell (header, avatar block, navigation menu, active-tab indicator, and responsive container).

---

## 1. Basic Integration

Always hook into `fluent_cart/init` — this hook fires after core models and API helpers are initialized:

```php
<?php
defined('ABSPATH') || exit;

add_action('fluent_cart/init', function () {
    fluent_cart_api()->addCustomerDashboardEndpoint('acme-wallet', [
        'title'           => __('My Wallet', 'acme-wallet'),
        'icon_svg'        => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 6h14v10H3z" fill="currentColor"/></svg>',
        'render_callback' => function () {
            // Echo your server-rendered HTML or shortcode
            echo do_shortcode('[acme_wallet_customer_view]');
        }
    ]);
});
```

---

## 2. Configuration Parameters

The `$args` array accepted by `addCustomerDashboardEndpoint($slug, $args)`:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | string | **Yes** | Tab label displayed in the portal's left sidebar. |
| `render_callback` | callable | **Yes** | PHP callable executed when the endpoint URL is loaded. Must echo HTML. |
| `icon_svg` | string | Optional | Raw SVG string for the sidebar icon. Filtered through `fct_allowed_svg_tags`. |
| `icon_url` | string | Optional | Image URL fallback if SVG is not supplied. |
| `page_id` | int | Optional | WordPress post ID to render page content from instead of a callable. |

> **Note on Ordering (`priority`):**  
> `addCustomerDashboardEndpoint()` does **not** support a `priority` argument. Custom items are appended to the portal navigation in the order they are registered, positioned directly above the standard **Profile** link.

---

## 3. Resolving the Authenticated Customer

The portal automatically enforces `is_user_logged_in()`. Unauthenticated visitors are shown the login form before your callback is invoked.

Inside your `render_callback`, retrieve the current FluentCart customer record using the memoized API helper:

```php
use FluentCart\Api\Resource\CustomerResource;

'render_callback' => function () {
    // Zero-overhead lookup (memoized from session)
    $customer = CustomerResource::getCurrentCustomer();
    if (!$customer) {
        echo '<p>' . esc_html__('Customer profile not found.', 'my-plugin') . '</p>';
        return;
    }

    $customerId = $customer->id;
    $email      = $customer->email;
    $balance    = get_user_meta($customer->user_id, 'acme_wallet_balance', true);

    echo '<div class="acme-wallet-box">';
    echo '<h3>' . esc_html(sprintf(__('Wallet Balance: $%0.2f', 'my-plugin'), $balance / 100)) . '</h3>';
    echo '</div>';
}
```

---

## 4. Multi-Segment Paths & Sub-Routes

Core only matches the **first path segment** (`acme-wallet`). If your feature has sub-paths (e.g. `/account/acme-wallet/transactions/42`):
- Core still routes the request to your `acme-wallet` callback.
- You must parse `$wp->request` inside your callback to handle sub-views:

```php
'render_callback' => function () {
    global $wp;
    $path = trim($wp->request, '/');
    $segments = explode('/', $path);

    // E.g. account/acme-wallet/history -> ['account', 'acme-wallet', 'history']
    $subAction = $segments[2] ?? 'index';

    switch ($subAction) {
        case 'history':
            echo '<h4>' . esc_html__('Transaction History', 'my-plugin') . '</h4>';
            break;
        default:
            echo '<h4>' . esc_html__('Wallet Overview', 'my-plugin') . '</h4>';
            break;
    }
}
```

---

## 5. Reserved Slugs & Slug Collision Guards

### Hard Reserved Slugs (Do Not Use)
These slugs conflict with core client-side routes and will cause your endpoint to be ignored:
- `dashboard`
- `purchase-history`
- `subscriptions`
- `licenses`
- `downloads`
- `profile`

### Critical Sharp Edge: `order` and `subscription`
The singular words `order` and `subscription` are **not** in the reserved list check, but they are used by the Vue SPA for detail views (`/account/order/{uuid}` and `/account/subscription/{uuid}`).
- **Rule:** Never use bare or generic slugs like `order`, `subscription`, `cart`, or `checkout`.
- **Best Practice:** Always namespace your slug with your vendor prefix: `acme-wallet`, `fc-support-tickets`, `mybrand-rewards`.

---

## 6. Styling, Icons & Theme Consistency

### Allowed SVG Tags (`fct_allowed_svg_tags`)
SVGs passed to `icon_svg` are sanitized through a strict allowlist. Only `<svg>`, `<path>`, `<g>`, `<circle>`, `<polygon>`, and `<polyline>` are allowed.
- Attributes: `width="20"`, `height="20"`, `viewBox="0 0 20 20"`, `fill="none"`, `stroke="currentColor"`.

### Portal CSS Variables
Adopt the customer portal's design system tokens:
```css
.acme-custom-endpoint-card {
    color: var(--fct-customer-dashboard-text-color, #374151);
    border: 1px solid var(--fct-customer-dashboard-border-color, #e5e7eb);
    border-radius: 8px;
    padding: 24px;
    background: #ffffff;
}
.acme-custom-endpoint-title {
    color: var(--fct-customer-dashboard-title-color, #111827);
    font-size: 1.25rem;
    font-weight: 600;
}
```

### Security & Sanitization
The portal echoes your callback's output directly without post-escaping. You must:
- Escape all output: `esc_html()`, `esc_attr()`, `esc_url()`.
- Sanitize HTML blocks: `wp_kses_post()`.
- Check nonces on any forms submitted from custom dashboard pages.
