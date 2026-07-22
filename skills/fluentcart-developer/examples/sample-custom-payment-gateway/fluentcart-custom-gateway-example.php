<?php
/**
 * Plugin Name: FluentCart Custom Payment Gateway Example
 * Plugin URI: https://github.com/atifjubaer/skills
 * Description: Production-ready starter template for creating a custom FluentCart payment gateway extension.
 * Version: 1.0.0
 * Author: Fastrsoft
 * License: MIT
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Register custom payment gateway after FluentCart initializes
add_action('fluent_cart/loaded', function() {
    if (!class_exists('\FluentCart\App\Modules\PaymentMethods\Core\AbstractPaymentGateway')) {
        return; // Return early if FluentCart core payment gateway abstract class is missing
    }

    // Register our custom gateway slug and implementation class via filter
    add_filter('fluent_cart/payment_gateways', function($gateways) {
        $gateways['sample_gateway'] = \FluentCartCustomGatewayExample\SampleGateway::class;
        return $gateways;
    });
});

namespace FluentCartCustomGatewayExample;

use FluentCart\App\Modules\PaymentMethods\Core\AbstractPaymentGateway;
use FluentCart\App\Modules\PaymentMethods\Core\BaseGatewaySettings;
use FluentCart\App\Models\Order;

// Custom Gateway Implementation Class
class SampleGateway extends AbstractPaymentGateway
{
    // Unique identifier slug for this payment gateway
    public function getSlug(): string
    {
        return 'sample_gateway';
    }

    // Display title of payment gateway in admin and checkout
    public function getTitle(): string
    {
        return __('Sample Payment Gateway', 'fluentcart');
    }

    // Icon URL or class for checkout payment method selector
    public function getIcon(): string
    {
        return plugin_dir_url(__FILE__) . 'assets/icon.png';
    }

    // Process customer charge during checkout submission
    public function makePayment(array $data, Order $order): array
    {
        // Sanitize payment token or transaction input from customer
        $paymentToken = sanitize_text_field($data['payment_token'] ?? '');

        // Fetch configured API credentials from gateway settings
        $apiKey = $this->getSetting('api_key');
        $isSandbox = $this->getSetting('test_mode') === 'yes';

        // Perform external API call to process payment transaction
        // Example mock API response handling:
        $success = !empty($paymentToken) || $isSandbox;

        if ($success) {
            // Generate mock transaction ID for demonstration
            $transactionId = 'tx_sample_' . time() . '_' . rand(1000, 9999);

            // Record transaction details in FluentCart order record
            $this->addPaymentNote($order, sprintf(__('Payment processed via Sample Gateway. Transaction ID: %s', 'fluentcart'), $transactionId));

            // Return success payload containing redirect URL or receipt details
            return [
                'status'         => 'success',
                'transaction_id' => $transactionId,
                'redirect_url'   => $this->getReturnUrl($order),
                'message'        => __('Payment successful!', 'fluentcart')
            ];
        }

        // Return error payload if payment authorization failed
        return [
            'status'  => 'error',
            'message' => __('Payment failed. Please check your card details and try again.', 'fluentcart')
        ];
    }

    // Handle partial or full refund execution from FluentCart admin
    public function refund(Order $order, float $amount, string $reason = ''): array
    {
        // Get original transaction ID attached to order
        $transactionId = $order->transaction_id;

        // Perform API request to refund payment gateway provider
        // Example mock refund success return:
        $refundId = 'ref_sample_' . time();

        // Log refund note in FluentCart order notes
        $this->addPaymentNote($order, sprintf(__('Refund of %s processed. Refund ID: %s. Reason: %s', 'fluentcart'), $amount, $refundId, $reason));

        return [
            'status'    => 'success',
            'refund_id' => $refundId,
            'amount'    => $amount,
            'message'   => __('Refund issued successfully', 'fluentcart')
        ];
    }

    // Return admin settings schema class instance
    public function getSettingsClass(): string
    {
        return SampleGatewaySettings::class;
    }
}

// Admin Settings Configuration Class
class SampleGatewaySettings extends BaseGatewaySettings
{
    // Render settings schema fields for FluentCart Payment Settings panel
    public function getFields(): array
    {
        return [
            'enabled' => [
                'type'        => 'checkbox',
                'label'       => __('Enable Sample Gateway', 'fluentcart'),
                'default'     => 'no'
            ],
            'title' => [
                'type'        => 'text',
                'label'       => __('Method Title', 'fluentcart'),
                'default'     => __('Sample Gateway', 'fluentcart')
            ],
            'test_mode' => [
                'type'        => 'checkbox',
                'label'       => __('Sandbox / Test Mode', 'fluentcart'),
                'default'     => 'yes'
            ],
            'api_key' => [
                'type'        => 'password',
                'label'       => __('API Key', 'fluentcart'),
                'description' => __('Enter your API key provided by the payment gateway dashboard.', 'fluentcart')
            ]
        ];
    }
}
