<?php
/**
 * Plugin Name: FluentCart Fee Surcharge Addon
 * Description: Example plugin demonstrating dynamic conditional fee surcharges (e.g. Gift Wrapping & Heavy Freight fees) in FluentCart.
 * Version:     1.0.0
 * Author:      Developer Team
 */

if (!defined('ABSPATH')) {
    exit;
}

// Hook into FluentCart fee calculation lifecycle
add_filter('fluent_cart/fee_items', function ($fees, $cart) {
    // Calculate subtotal in cents
    $subtotal = $cart->getSubTotal();

    // Condition 1: Add $3.50 (350 cents) Gift Wrapping Fee for orders under $50.00 (5000 cents)
    if ($subtotal < 5000) {
        $fees[] = [
            'id'       => 'gift_wrap_fee',
            'title'    => __('Optional Gift Packaging', 'fc-fee-addon'),
            'amount'   => 350, // 350 cents = $3.50
            'taxable'  => false,
        ];
    }

    // Condition 2: Add 2% Payment Surcharge (percentage fee)
    $surchargeAmount = (int) round($subtotal * 0.02); // 2% calculation in cents
    $fees[] = [
        'id'       => 'payment_surcharge',
        'title'    => __('Payment Processing Surcharge (2%)', 'fc-fee-addon'),
        'amount'   => $surchargeAmount,
        'taxable'  => false,
    ];

    return $fees;
}, 10, 2);
