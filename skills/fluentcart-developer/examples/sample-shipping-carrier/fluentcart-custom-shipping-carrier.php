<?php
/**
 * Plugin Name: FluentCart Custom Shipping Carrier Example
 * Description: Example plugin demonstrating how to register custom dynamic shipping calculation methods in FluentCart.
 * Version: 1.0.0
 * Author: Fastrsoft
 * License: MIT
 */

if (!defined('ABSPATH')) {
    exit; // Exit if direct file access is attempted
}

// Hook into FluentCart shipping rate registration filter
add_filter('fluent_cart/shipping/methods', function($methods) {
    // Append custom carrier calculation class or handler
    $methods['custom_express_carrier'] = [
        'title'       => __('Custom Express Carrier', 'fluentcart'),
        'description' => __('Calculates real-time express shipping rates based on cart total and weight.', 'fluentcart'),
        'callback'    => 'fluentcart_calculate_express_shipping_rate'
    ];
    return $methods;
});

// Callback function to calculate dynamic shipping rate for current cart
function fluentcart_calculate_express_shipping_rate($cartData) {
    // Extract subtotal and item total weights from cart data object
    $subtotal = $cartData['subtotal'] ?? 0;
    $totalWeight = $cartData['total_weight'] ?? 0; // Total weight in kg

    // Set base shipping fee
    $baseRate = 500; // $5.00 in cents

    // Apply free shipping logic for high subtotal orders over $100 (10000 cents)
    if ($subtotal >= 10000) {
        return [
            'id'       => 'custom_express_free',
            'title'    => __('Express Shipping (Free - Order > $100)', 'fluentcart'),
            'cost'     => 0, // Free rate
            'delivery' => __('1-2 Business Days', 'fluentcart')
        ];
    }

    // Calculate weight-based surcharge ($2 per extra kg over 1kg)
    $weightSurcharge = 0;
    if ($totalWeight > 1) {
        $extraKg = ceil($totalWeight - 1);
        $weightSurcharge = $extraKg * 200; // $2.00 per extra kg
    }

    // Sum total shipping cost in store currency cents
    $finalCost = $baseRate + $weightSurcharge;

    // Return shipping rate item payload
    return [
        'id'       => 'custom_express_rate',
        'title'    => __('Express Delivery', 'fluentcart'),
        'cost'     => $finalCost, // Amount in monetary cents
        'delivery' => __('1-2 Business Days', 'fluentcart')
    ];
}
