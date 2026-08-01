<?php
/**
 * Plugin Name: FluentCart Custom Extension Starter
 * Plugin URI:  https://example.com/fluentcart-extension
 * Description: Starter boilerplate plugin for building custom FluentCart extensions, hooks, and REST endpoints.
 * Version:     1.0.0
 * Author:      Developer Team
 * Text Domain: fc-custom-extension
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Initialize extension after WordPress plugins loaded and FluentCart active
add_action('plugins_loaded', function () {
    // Check if FluentCart core plugin is active
    if (!defined('FLUENT_CART')) {
        return;
    }

    // Register post-payment event listener
    add_action('fluent_cart/order_paid_done', 'fc_custom_handle_order_paid', 10, 1);

    // Register custom dynamic fee surcharge
    add_filter('fluent_cart/fee_items', 'fc_custom_add_cart_handling_fee', 10, 2);

    // Register custom REST API route
    add_action('rest_api_init', 'fc_custom_register_rest_routes');
});

/**
 * Process order completion asynchronously
 * 
 * @param array $data Contains 'order' and 'customer' models
 */
function fc_custom_handle_order_paid($data) {
    // Extract Order model instance from payload
    $order = $data['order'];

    // Extract Customer model instance from payload
    $customer = $data['customer'];

    // Save custom processing flag into order metadata
    $order->updateMeta('custom_processed_at', current_time('mysql'));

    // Log order completion event in FluentCart system log
    fluent_cart_add_log(
        'Custom Addon Event',
        'Successfully processed order #' . $order->id . ' for ' . $customer->email,
        'info'
    );
}

/**
 * Add custom handling fee ($5.00 = 500 cents) to checkout cart
 * 
 * @param array $fees Existing cart fee items
 * @param object $cart Active Cart instance
 * @return array Updated fees array
 */
function fc_custom_add_cart_handling_fee($fees, $cart) {
    // Append $5.00 handling fee (500 cents)
    $fees[] = [
        'id'       => 'express_handling',
        'title'    => __('Express Order Processing Fee', 'fc-custom-extension'),
        'amount'   => 500, // Monetary values stored as integer cents ($5.00 = 500)
        'taxable'  => false,
    ];

    return $fees;
}

/**
 * Register custom REST API endpoint for third-party extensions
 */
function fc_custom_register_rest_routes() {
    register_rest_route('fc-custom/v1', '/order-status/(?P<id>\d+)', [
        'methods'             => 'GET',
        'callback'            => 'fc_custom_get_order_status',
        'permission_callback' => function () {
            // Restrict endpoint to store managers
            return current_user_can('fluent_cart_admin');
        },
    ]);
}

/**
 * REST Endpoint Callback: Retrieve custom order status
 * 
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 */
function fc_custom_get_order_status($request) {
    // Extract order ID parameter from request
    $orderId = $request->get_param('id');

    // Retrieve order record using FluentCart Eloquent Model
    $order = \FluentCart\App\Models\Order::find($orderId);

    // Return 404 response if order not found
    if (!$order) {
        return new WP_REST_Response(['message' => 'Order not found'], 404);
    }

    // Return structured order status response
    return new WP_REST_Response([
        'order_id'       => $order->id,
        'status'         => $order->status,
        'payment_status' => $order->payment_status,
        'total_amount'   => $order->total_amount, // Returned in cents
        'processed_at'   => $order->getMeta('custom_processed_at', 'N/A'),
    ], 200);
}
