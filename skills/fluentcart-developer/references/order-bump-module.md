# Order Bump Module Architecture (Pro)

Comprehensive developer reference for FluentCart Pro's Order Bump and checkout promotion architecture (`app/Modules/Promotional/OrderBump/`). Covers the `OrderPromotion` Eloquent model, condition evaluation engine, checkout injection lifecycle, analytics tracking, and hook filters.

Based on the official FluentCart developer specification (`dev.fluentcart.com/modules/order-bump.html`).

---

## Architecture Overview

The Order Bump module increases average order value (AOV) by presenting targeted, frictionless add-ons directly on the checkout page before the customer clicks the final submit button.

### Core Components
1. **`OrderPromotion` Model** (`fct_order_promotions` table) — Manages promotional rules, pricing, discounts, and target variations.
2. **`OrderBumpBoot`** — Handles checkout display hook registration and promotional cart state resolution.
3. **Display Engine** — Renders the bump card at configurable checkout positions (`after_order_notes`, `before_checkout_submit`, etc.).
4. **Cart Application Filter** (`fluent_cart/apply_order_bump`) — Handles adding/removing bump items to/from the active cart session without page reloads.
5. **Analytics & Metrics** — Tracks impression (`viewed`), acceptance (`applied`), and conversion revenue.

---

## 1. The `OrderPromotion` Model

```php
namespace FluentCartPro\App\Modules\Promotional\Models;

use FluentCart\App\Models\Model;

class OrderPromotion extends Model
{
    protected $table = 'fct_order_promotions';

    protected $fillable = [
        'hash',
        'parent_id',
        'type',             // 'order_bump', 'checkout_upsell'
        'status',           // 'active', 'inactive'
        'src_object_id',    // Target product_id
        'src_object_type',  // 'product', 'variation'
        'title',
        'description',
        'conditions',
        'config',
        'priority'
    ];

    protected $casts = [
        'conditions' => 'array',
        'config'     => 'array'
    ];
}
```

---

## 2. Programmatic Creation of Order Bumps

### Basic Order Bump Example
```php
use FluentCartPro\App\Modules\Promotional\Models\OrderPromotion;

$bump = OrderPromotion::create([
    'title'           => 'VIP Priority Support Add-on',
    'description'     => 'Get 1 year of 24/7 dedicated priority support.',
    'type'            => 'order_bump',
    'status'          => 'active',
    'src_object_id'   => 123, // Product ID
    'src_object_type' => 'product',
    'config'          => [
        'variation_id'     => 456,
        'discount_type'    => 'percentage', // 'percentage' or 'fixed'
        'discount_value'   => 20,           // 20% off
        'display_position' => 'after_order_notes',
        'auto_select'      => false,
        'show_urgency'     => true,
        'button_text'      => 'Add VIP Support'
    ],
    'conditions'      => [
        'minimum_cart_total' => 5000, // $50.00 minimum in cents
        'product_categories' => ['software', 'plugins']
    ],
    'priority'        => 10
]);
```

### Advanced Conditions Array
The condition engine evaluates rules against the active cart before displaying the bump:

```php
'conditions' => [
    'minimum_cart_total'    => 10000,           // Cents ($100.00)
    'product_categories'    => ['electronics'], // Cart must contain items in these categories
    'excluded_products'     => [999, 888],      // Do not show if these IDs are present
    'customer_segments'     => ['returning'],   // 'new_customers', 'returning'
    'start_date'            => '2026-01-01',
    'end_date'              => '2026-12-31',
    'max_uses_per_customer' => 1,
    'max_total_uses'        => 500
]
```

---

## 3. Cart Application Filter Hook (`fluent_cart/apply_order_bump`)

When the customer toggles the checkbox on checkout, FluentCart dispatches an AJAX request routed through `fluent_cart/apply_order_bump`:

```php
add_filter('fluent_cart/apply_order_bump', function ($responseMessage, array $data) {
    $cart     = $data['cart'];
    $bumpId   = $data['bump_id'] ?? 0;
    $willAdd  = $data['request_data']['is_upgraded'] ?? false;

    if ($willAdd) {
        $bump = \FluentCartPro\App\Modules\Promotional\Models\OrderPromotion::find($bumpId);
        if ($bump) {
            $cart->addItem([
                'product_id'   => $bump->src_object_id,
                'variation_id' => $bump->config['variation_id'] ?? 0,
                'quantity'     => 1,
                'is_bump'      => true,
                'bump_id'      => $bumpId
            ]);
            return __('Order bump added to your cart!', 'my-addon');
        }
    } else {
        $cart->removeBumpItems($bumpId);
        return __('Order bump removed.', 'my-addon');
    }

    return $responseMessage;
}, 10, 2);
```

---

## 4. Order Bump Action & Filter Hooks

| Hook | Type | Arguments | Description |
|---|---|---|---|
| `fluent_cart/order_bump/before_display` | Action | `$bump, $cart` | Fires before bump markup is output. Return `false` to suppress display. |
| `fluent_cart/order_bump/applied` | Action | `$bump, $cart` | Fires immediately when customer checks/accepts the bump offer. |
| `fluent_cart/order_bump/viewed` | Action | `$bump, $cart` | Fires when bump card renders in the browser (for analytics impression tracking). |
| `fluent_cart/order_bump/conditions` | Filter | `$conditions, $bump, $cart` | Add custom business rules or third-party validation conditions. |
| `fluent_cart/order_bump/display_data` | Filter | `$data, $bump, $cart` | Modify bump card template variables (urgency text, pricing, badges). |
| `fluent_cart/promotional/settings` | Filter | `$settings` | Add custom promotional controls to the FluentCart Pro admin UI. |

---

## 5. Custom Condition Evaluation Example

Add custom validation rules (e.g. VIP membership tier or country checks):

```php
add_filter('fluent_cart/order_bump/conditions', function (array $conditions, $bump, $cart) {
    // Only display if customer has completed more than 3 previous orders
    $customer = $cart->customer;
    if ($customer && $customer->total_orders < 3) {
        $conditions['failed_vip_check'] = true;
    }
    return $conditions;
}, 10, 3);
```
