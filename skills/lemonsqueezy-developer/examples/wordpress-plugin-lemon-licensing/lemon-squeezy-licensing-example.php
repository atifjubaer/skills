<?php
/**
 * Plugin Name: Lemon Squeezy Licensing Example Plugin
 * Description: Working WordPress plugin demonstrating how to activate, validate, and deactivate software license keys against the Lemon Squeezy API.
 * Version: 1.0.0
 * Author: Atif Jubaer
 * License: GPL-2.0+
 */

defined('ABSPATH') || exit;

class LemonSqueezyLicenseManager
{
    private string $apiUrl = 'https://api.lemonsqueezy.com/v1/licenses/';
    private string $optionKey = '__ls_example_license_data';
    private string $cacheTransientKey = '__ls_example_license_status_cache';

    public function __construct()
    {
        add_action('admin_menu', [$this, 'registerAdminMenu']);
        add_action('admin_post_ls_save_license', [$this, 'handleLicenseAction']);
    }

    public function registerAdminMenu(): void
    {
        add_submenu_page(
            'tools.php',
            __('Lemon Squeezy License', 'ls-licensing'),
            __('LS License', 'ls-licensing'),
            'manage_options',
            'ls-example-license',
            [$this, 'renderSettingsPage']
        );
    }

    public function renderSettingsPage(): void
    {
        $licenseData = get_option($this->optionKey, []);
        $licenseKey  = $licenseData['license_key'] ?? '';
        $status      = $licenseData['status'] ?? 'inactive';
        $instanceId  = $licenseData['instance_id'] ?? '';
        $expiresAt   = $licenseData['expires_at'] ?? 'Never';

        ?>
        <div class="wrap">
            <h1><?php echo esc_html__('Lemon Squeezy Software License', 'ls-licensing'); ?></h1>
            <div style="background: #fff; padding: 20px; border: 1px solid #ccd0d4; border-radius: 6px; max-width: 600px; margin-top: 20px;">
                <p>
                    <strong><?php esc_html_e('Current Status:', 'ls-licensing'); ?></strong>
                    <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; color: #fff; background: <?php echo $status === 'active' ? '#46b450' : '#dc3232'; ?>;">
                        <?php echo esc_html(strtoupper($status)); ?>
                    </span>
                </p>
                <?php if ($status === 'active'): ?>
                    <p><strong><?php esc_html_e('Activated Machine/Domain:', 'ls-licensing'); ?></strong> <code><?php echo esc_html(home_url()); ?></code></p>
                    <p><strong><?php esc_html_e('Expiration:', 'ls-licensing'); ?></strong> <?php echo esc_html($expiresAt); ?></p>
                <?php endif; ?>

                <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                    <?php wp_nonce_field('ls_license_action', 'ls_nonce'); ?>
                    <input type="hidden" name="action" value="ls_save_license">

                    <?php if ($status !== 'active'): ?>
                        <p>
                            <label for="license_key"><strong><?php esc_html_e('License Key:', 'ls-licensing'); ?></strong></label><br>
                            <input type="text" id="license_key" name="license_key" value="<?php echo esc_attr($licenseKey); ?>" class="regular-text" placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" required>
                        </p>
                        <input type="submit" name="ls_action" value="activate" class="button button-primary" value="<?php esc_attr_e('Activate License', 'ls-licensing'); ?>">
                    <?php else: ?>
                        <input type="hidden" name="license_key" value="<?php echo esc_attr($licenseKey); ?>">
                        <input type="submit" name="ls_action" value="deactivate" class="button button-secondary" value="<?php esc_attr_e('Deactivate License', 'ls-licensing'); ?>">
                    <?php endif; ?>
                </form>
            </div>
        </div>
        <?php
    }

    public function handleLicenseAction(): void
    {
        if (!current_user_can('manage_options') || !check_admin_referer('ls_license_action', 'ls_nonce')) {
            wp_die(__('Unauthorized request', 'ls-licensing'));
        }

        $action     = sanitize_text_field($_POST['ls_action'] ?? '');
        $licenseKey = sanitize_text_field($_POST['license_key'] ?? '');

        if ($action === 'activate') {
            $this->activateLicense($licenseKey);
        } elseif ($action === 'deactivate') {
            $this->deactivateLicense();
        }

        wp_safe_redirect(admin_url('tools.php?page=ls-example-license'));
        exit;
    }

    private function activateLicense(string $licenseKey): bool
    {
        $response = wp_remote_post($this->apiUrl . 'activate', [
            'timeout' => 15,
            'body'    => [
                'license_key'   => $licenseKey,
                'instance_name' => home_url()
            ]
        ]);

        if (is_wp_error($response)) {
            return false;
        }

        $data = json_decode(wp_remote_retrieve_body($response), true);

        if (!empty($data['activated'])) {
            update_option($this->optionKey, [
                'license_key' => $licenseKey,
                'instance_id' => $data['instance']['id'] ?? '',
                'status'      => 'active',
                'expires_at'  => $data['license_key']['expires_at'] ?? 'Lifetime'
            ]);
            delete_transient($this->cacheTransientKey);
            return true;
        }

        return false;
    }

    private function deactivateLicense(): bool
    {
        $saved = get_option($this->optionKey, []);
        $licenseKey = $saved['license_key'] ?? '';
        $instanceId = $saved['instance_id'] ?? '';

        if (!$licenseKey || !$instanceId) {
            delete_option($this->optionKey);
            return true;
        }

        wp_remote_post($this->apiUrl . 'deactivate', [
            'timeout' => 15,
            'body'    => [
                'license_key' => $licenseKey,
                'instance_id' => $instanceId
            ]
        ]);

        delete_option($this->optionKey);
        delete_transient($this->cacheTransientKey);
        return true;
    }

    public function isLicensed(): bool
    {
        $cached = get_transient($this->cacheTransientKey);
        if ($cached !== false) {
            return $cached === 'valid';
        }

        $saved = get_option($this->optionKey, []);
        if (empty($saved['license_key']) || ($saved['status'] ?? '') !== 'active') {
            return false;
        }

        // Validate remotely once per 24 hours
        $response = wp_remote_post($this->apiUrl . 'validate', [
            'timeout' => 10,
            'body'    => [
                'license_key' => $saved['license_key'],
                'instance_id' => $saved['instance_id'] ?? ''
            ]
        ]);

        if (is_wp_error($response)) {
            return true; // Graceful offline fallback
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);
        $isValid = !empty($body['valid']);

        set_transient($this->cacheTransientKey, $isValid ? 'valid' : 'invalid', DAY_IN_SECONDS);
        return $isValid;
    }
}

new LemonSqueezyLicenseManager();
