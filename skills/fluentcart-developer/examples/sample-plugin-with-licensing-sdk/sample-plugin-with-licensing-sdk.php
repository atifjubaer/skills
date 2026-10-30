<?php
/**
 * Plugin Name: FluentCart Licensing SDK Example Plugin
 * Plugin URI: https://github.com/fluent-cart/software-licensing-sdk
 * Description: Working example showing how a commercial WordPress plugin integrates FluentCart Software Licensing SDK for automatic updates and remote license validation.
 * Version: 1.0.0
 * Author: Atif Jubaer
 * Author URI: https://github.com/atifjubaer
 * License: GPL-2.0+
 * Text Domain: fc-licensing-example
 */

defined('ABSPATH') || exit;

// Define plugin version and root path
define('FC_LICENSING_EXAMPLE_VERSION', '1.0.0');
define('FC_LICENSING_EXAMPLE_DIR', plugin_dir_path(__FILE__));

add_action('plugins_loaded', function () {
    // 1. Include the licensing class
    if (!class_exists('\FluentUpdater\FluentLicensing')) {
        require_once FC_LICENSING_EXAMPLE_DIR . 'updater/FluentLicensing.php';
    }

    $licenseManager = new \FluentUpdater\FluentLicensing();

    // 2. Register licensing parameters
    $licenseManager->register([
        'version'           => FC_LICENSING_EXAMPLE_VERSION,
        'item_id'           => 101, // Replace with your FluentCart Product/Variation ID
        'basename'          => plugin_basename(__FILE__),
        'api_url'           => 'https://example-store.com/', // Your FluentCart store base URL
        'plugin_title'      => 'FluentCart Licensing SDK Example Plugin',
        'purchase_url'      => 'https://example-store.com/checkout/?item_id=101',
        'activate_url'      => admin_url('tools.php?page=fc-licensing-example-license'),
        'show_check_update' => true,
        'settings_key'      => '__fc_licensing_example_sl_info'
    ]);

    // 3. Attach the built-in Admin License Management page
    if (is_admin() && class_exists('\FluentUpdater\LicenseSettings')) {
        $settings = new \FluentUpdater\LicenseSettings();
        $settings->register($licenseManager);

        $settings->setConfig([
            'title'       => __('Example Plugin License', 'fc-licensing-example'),
            'heading'     => __('Activate License Key', 'fc-licensing-example'),
            'description' => __('Enter your FluentCart license key to receive automatic security updates and support.', 'fc-licensing-example'),
            'help_text'   => __('Manage licenses in your customer portal.', 'fc-licensing-example')
        ]);

        $settings->addPage([
            'type'        => 'submenu',
            'parent_slug' => 'tools.php',
            'page_title'  => __('Example Plugin License', 'fc-licensing-example'),
            'menu_title'  => __('Example License', 'fc-licensing-example'),
            'capability'  => 'manage_options',
            'menu_slug'   => 'fc-licensing-example-license'
        ]);
    }
});

/**
 * Example helper function to check whether the plugin license is currently active.
 */
function fc_example_is_license_active(): bool
{
    if (!class_exists('\FluentUpdater\FluentLicensing')) {
        return false;
    }

    $manager = \FluentUpdater\FluentLicensing::getInstance();
    if (!$manager) {
        return false;
    }

    $status = $manager->getStatus();
    return !is_wp_error($status) && isset($status['status']) && $status['status'] === 'valid';
}
