# Shipping Module Architecture & Custom Shipping Methods

Comprehensive developer reference for FluentCart's shipping engine (`app/Modules/Shipping/`). Covers shipping zones, rate calculation models, shipping classes, and implementing custom carriers or dynamic rate providers.

Based on the official FluentCart developer specification (`dev.fluentcart.com/modules/shipping.html`).

---

## Architecture Overview

FluentCart evaluates shipping costs dynamically on checkout based on four primary entities:
1. **`ShippingZone`** (`fct_shipping_zones`) — Geographic boundary matching customer country, state, or postal code.
2. **`ShippingMethod`** (`fct_shipping_methods`) — Carrier or rate option within a zone (`flat_rate`, `free_shipping`, `local_pickup`, custom).
3. **`ShippingClass`** (`fct_shipping_classes`) — Product categories with per-item or fixed surcharge tiers (e.g. `Fragile`, `Heavy Cargo`).
4. **`ShippingPackage`** — Calculated collection of physical shippable items derived from the active cart.

---

## 1. Core Shipping Models

```php
use FluentCart\App\Models\ShippingZone;
use FluentCart\App\Models\ShippingMethod;
use FluentCart\App\Models\ShippingClass;

// Find zone matching customer destination country and state
$zone = ShippingZone::matchingZone($countryCode, $stateCode);

// Retrieve active methods for the zone
$methods = $zone->methods()->where('is_enabled', true)->get();
```

---

## 2. Implementing a Custom Shipping Method

To create a dynamic or live carrier shipping method (e.g. FedEx, DHL, or distance-based delivery):

```php
<?php
namespace MyAddon\Shipping;

defined('ABSPATH') || exit;

use FluentCart\App\Models\ShippingMethod;

class ExpressCourierShipping extends ShippingMethod
{
    /**
     * Calculate dynamic shipping rate in cents.
     */
    public function calculateRate($cart, array $address): int
    {
        $baseRateCents = 1500; // $15.00 base charge
        $totalWeight = $cart->getTotalWeight(); // Weight in store unit (lbs / kg)
        
        // $2.00 per unit of weight
        $weightSurchargeCents = (int) ($totalWeight * 200);

        return $baseRateCents + $weightSurchargeCents;
    }

    /**
     * Determine whether this shipping option is available for the current cart.
     */
    public function isAvailable($cart, array $address): bool
    {
        // Require minimum order value of $50.00 (5000 cents)
        if ($cart->getTotal() < 5000) {
            return false;
        }

        // Restrict to supported countries
        $destinationCountry = $address['country'] ?? '';
        return in_array($destinationCountry, ['US', 'CA', 'GB']);
    }
}
```

---

## 3. Registering Shipping Rates via Filter Hooks

The primary hook for injecting real-time carrier rates into the checkout calculation is `fluent_cart/shipping/methods`:

```php
add_filter('fluent_cart/shipping/methods', function (array $availableMethods, $cart, array $address): array {
    // Only calculate for shippable carts
    if (!$cart->needsShipping()) {
        return $availableMethods;
    }

    $availableMethods[] = [
        'id'          => 'custom_express_carrier',
        'title'       => __('Express 2-Day Air', 'my-addon'),
        'cost'        => 2500, // Cents ($25.00)
        'description' => __('Guaranteed 2 business day delivery', 'my-addon'),
        'meta'        => [
            'carrier'        => 'CustomExpress',
            'estimated_days' => 2
        ]
    ];

    return $availableMethods;
}, 10, 3);
```

---

## 4. Shipping Classes for Complex Inventory

Shipping classes allow applying extra fees on specific products:
- Fixed fee per order (e.g. `Fragile Handling +$10.00`).
- Variable fee per item (e.g. `Heavy Freight +$5.00 per quantity`).

```php
use FluentCart\App\Models\ShippingClass;

// Programmatically create a shipping class
$heavyFreight = ShippingClass::create([
    'name'     => 'Heavy Freight',
    'cost'     => 500,   // $5.00 in cents
    'type'     => 'fixed',
    'per_item' => true   // Charged for each product unit
]);
```
