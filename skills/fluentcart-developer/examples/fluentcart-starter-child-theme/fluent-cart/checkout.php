<?php
/**
 * FluentCart Custom Checkout Template Override Example
 * 
 * Place this file inside your theme directory at:
 * [your-theme]/fluent-cart/checkout.php
 */

if (!defined('ABSPATH')) {
    exit; // Prevent direct execution
}

// Trigger pre-checkout wrapper action hook
do_action('fluent_cart/checkout/before_container');
?>

<!-- Custom Theme Wrapper Container -->
<div class="fc-theme-checkout-container fc-custom-checkout-wrapper">
    <div class="fc-checkout-header">
        <h1><?php esc_html_e('Complete Your Order', 'fluentcart'); ?></h1>
        <p><?php esc_html_e('Please enter your billing and shipping details below.', 'fluentcart'); ?></p>
    </div>

    <!-- Render Core FluentCart Checkout Shortcode App Instance -->
    <div class="fc-checkout-app-box">
        <?php echo do_shortcode('[fluent_cart_checkout]'); ?>
    </div>
</div>

<?php
// Trigger post-checkout wrapper action hook
do_action('fluent_cart/checkout/after_container');
