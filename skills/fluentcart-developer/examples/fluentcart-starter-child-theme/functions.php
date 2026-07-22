<?php
/**
 * Child Theme Functions for FluentCart Compatibility
 * 
 * Theme Name: FluentCart Starter Child Theme
 * Author: Fastrsoft
 * License: MIT
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// 1. Declare FluentCart Theme Support in Child Theme
add_action('after_setup_theme', function() {
    // Enables template overriding and page detection in FluentCart
    add_theme_support('fluent_cart');
});

// 2. Enqueue Custom Child Theme & FluentCart Styling Assets
add_action('wp_enqueue_scripts', function() {
    // Enqueue parent theme stylesheet
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');

    // Enqueue custom FluentCart store overrides stylesheet
    wp_enqueue_style(
        'fluentcart-child-custom',
        get_stylesheet_directory_uri() . '/fluent-cart-custom.css',
        ['parent-style'],
        '1.0.0'
    );
});

// 3. Example Hook: Inject Custom Notice above Checkout Form
add_action('fluent_cart/checkout/before_form', function() {
    // Output custom customer guarantee banner on checkout page
    echo '<div class="fluentcart-custom-notice" style="background:#eef6ff; border:1px solid #b6d4fe; padding:12px; margin-bottom:20px; border-radius:6px;">';
    echo '🔒 <strong>100% Secure Checkout Guarantee:</strong> Your data is protected by 256-bit SSL encryption.';
    echo '</div>';
});
