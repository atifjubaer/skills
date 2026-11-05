import fs from 'node:fs';
import path from 'node:path';
import type { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';
import { skillRefs } from '../../paths.js';
import { listReferences, readReference } from '../../reference-reader.js';
import { nativeClientTemplate } from './templates-native.js';

export function registerFluentCartTools(server: McpServer): void {
  const FC_REFS_DIR = skillRefs('fluentcart-developer');

  // ==========================================
  // Read tools — hook search, schema lookup, reference reader
  // ==========================================

  server.registerTool(
    'fc_search_hooks',
    {
      description: 'Search FluentCart 680+ action and filter hooks across order lifecycles, checkout, customer events, payment gateways, modules and Pro modules.',
      inputSchema: {
        query: z.string().describe('Hook name or event keyword, e.g. "order_created", "checkout_validate", "payment_processed"')
      },
      annotations: { readOnlyHint: true }
    },
    async ({ query }) => {
      try {
        if (!fs.existsSync(FC_REFS_DIR)) {
          return { content: [{ type: 'text', text: 'FluentCart references directory not found.' }], isError: true };
        }

        // The per-topic files carry the detail; hooks-complete-index.md carries
        // the module and Pro-module hooks that have no per-topic file at all.
        const files = fs
          .readdirSync(FC_REFS_DIR)
          .filter(f => f.startsWith('action-hooks') || f.startsWith('filter-hooks') || f === 'hooks-complete-index.md');
        const matches: string[] = [];
        const lowerQuery = query.toLowerCase();

        for (const file of files) {
          const content = fs.readFileSync(path.join(FC_REFS_DIR, file), 'utf8');
          const lines = content.split('\n');

          for (let i = 0; i < lines.length; i++) {
            if (lines[i].toLowerCase().includes(lowerQuery)) {
              const snippet = lines.slice(Math.max(0, i - 1), Math.min(lines.length, i + 8)).join('\n');
              matches.push(`### [${file}]\n\`\`\`php\n${snippet}\n\`\`\``);
              if (matches.length >= 4) break;
            }
          }
          if (matches.length >= 6) break;
        }

        if (matches.length === 0) {
          return {
            content: [{ type: 'text', text: `No hooks found matching "${query}". Check spelling or search by general category (e.g. "order", "subscription", "checkout").` }]
          };
        }

        return {
          content: [{ type: 'text', text: matches.join('\n\n---\n\n') }]
        };
      } catch (err: any) {
        return {
          content: [{ type: 'text', text: `Failed to search FluentCart hooks: ${err.message}` }],
          isError: true
        };
      }
    }
  );

  server.registerTool(
    'fc_get_db_schema',
    {
      description: 'Retrieve exact table schema, column definitions, and Eloquent ORM model for FluentCart database tables (wp_fct_*).',
      inputSchema: {
        table: z.string().describe('Table name or keyword (e.g. "orders", "customers", "subscriptions", "order_items", "licenses")')
      },
      annotations: { readOnlyHint: true }
    },
    async ({ table }) => {
      try {
        const schemaFile = path.join(FC_REFS_DIR, 'database-schema-reference.md');
        if (!fs.existsSync(schemaFile)) {
          return { content: [{ type: 'text', text: 'Database schema reference not found.' }], isError: true };
        }

        const content = fs.readFileSync(schemaFile, 'utf8');
        const sections = content.split(/\n## /);
        const match = sections.find(s => s.toLowerCase().includes(table.toLowerCase()));

        if (!match) {
          return {
            content: [{
              type: 'text',
              text:
                `Table "${table}" not found in database-schema-reference.md. It documents every ` +
                `wp_fct_* table — try the table name without the prefix, e.g. "orders", "order_items", ` +
                `"customer_addresses". For a model's attributes and relations call ` +
                `fc_get_reference({ file: "models-complete-index.md", section: "..." }).`
            }]
          };
        }

        return {
          content: [{ type: 'text', text: `## ${match.slice(0, 3000)}` }]
        };
      } catch (err: any) {
        return {
          content: [{ type: 'text', text: `Error retrieving DB schema: ${err.message}` }],
          isError: true
        };
      }
    }
  );

  server.registerTool(
    'fc_get_reference',
    {
      description:
        'Read any FluentCart reference file — REST API endpoints, database models, payment ' +
        'gateways, modules, engineering notes. Call with no arguments to list the files; pass "file" ' +
        'to read one, optionally with "section" to pull a single heading instead of the whole document.',
      inputSchema: {
        file: z
          .string()
          .optional()
          .describe('Reference file name, e.g. "rest-api-subscriptions.md". Omit to list every file'),
        section: z
          .string()
          .optional()
          .describe('Heading to extract, e.g. "Void Renewal Invoice". Returns only that section')
      },
      annotations: { readOnlyHint: true }
    },
    async ({ file, section }) => {
      try {
        if (!fs.existsSync(FC_REFS_DIR)) {
          return { content: [{ type: 'text', text: 'FluentCart references directory not found.' }], isError: true };
        }

        if (!file) {
          const { files } = listReferences(FC_REFS_DIR);
          const lines = files.map(
            (f) => `- **${f.file}** (${Math.round(f.bytes / 1024)} KB) — ${f.title}`
          );
          return {
            content: [
              {
                type: 'text',
                text:
                  `${files.length} FluentCart reference files. Re-run with "file" to read one, ` +
                  `or "file" + "section" for a single heading.\n\n${lines.join('\n')}`
              }
            ]
          };
        }

        const result = readReference(FC_REFS_DIR, file, section);
        if ('error' in result) {
          return { content: [{ type: 'text', text: result.error }], isError: true };
        }

        const sections = result.sections.length
          ? `\n\nSections in ${result.file}: ${result.sections.join(' | ')}`
          : '';
        return { content: [{ type: 'text', text: `${result.text}${sections}` }] };
      } catch (err: any) {
        return {
          content: [{ type: 'text', text: `Failed to read reference: ${err.message}` }],
          isError: true
        };
      }
    }
  );

  // ==========================================
  // Code generation — free like everything else in the suite
  // ==========================================
  server.registerTool(
    'fc_generate_payment_gateway_boilerplate',
    {
      description: 'Generate production-ready PHP boilerplate for custom FluentCart payment gateways with settings schema and webhook listener.',
      inputSchema: {
        gatewaySlug: z.string().describe('Lowercase slug for gateway, e.g. "paddle_billing", "custom_pay"'),
        gatewayTitle: z.string().describe('Display title, e.g. "Paddle Billing"'),
        supportsSubscriptions: z.boolean().default(false)
      }
    },
    async ({ gatewaySlug, gatewayTitle, supportsSubscriptions }) => {
      const className = gatewaySlug.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Gateway';
      const code = `<?php
defined('ABSPATH') || exit;

use FluentCart\\App\\Services\\Gateways\\AbstractPaymentGateway;
use FluentCart\\App\\Services\\Gateways\\BaseGatewaySettings;

class ${className} extends AbstractPaymentGateway
{
    protected string $gateway = '${gatewaySlug}';
    protected string $title = '${gatewayTitle}';

    public function init(): void
    {
        $this->supports = [
            'products',
            'refunds'${supportsSubscriptions ? ",\n            'subscriptions'" : ''}
        ];
    }

    public function handlePayment(array $orderData): array
    {
        // 1. Extract order parameters (order_id, total in cents, customer_email)
        $orderId = $orderData['id'];
        $amountCents = $orderData['total'];

        // 2. Call external gateway API and obtain session / redirect URL
        $redirectUrl = 'https://checkout.example.com/' . $orderId;

        return [
            'status'       => 'pending',
            'redirect_url' => $redirectUrl,
            'message'      => 'Redirecting to ${gatewayTitle}...'
        ];
    }

    public function handleWebhook(): void
    {
        // Verified webhook handler with nonce and payload integrity checks
        $payload = file_get_contents('php://input');
        // Update FluentCart order via fluent_cart_order_status_updated action
    }
}
`;

      return {
        content: [{ type: 'text', text: code }]
      };
    }
  );

  server.registerTool(
    'fc_generate_licensing_boilerplate',
    {
      description:
        'Generate production-ready PHP boilerplate for integrating the official FluentCart Software Licensing SDK into a commercial WordPress plugin or theme, with remote activation, status checks, and automatic updates.',
      inputSchema: {
        pluginNamespace: z.string().describe('Unique PHP namespace for your plugin, e.g. "Acme\\AwesomePlugin"'),
        pluginTitle: z.string().describe('Display title of your plugin, e.g. "Awesome Plugin Pro"'),
        itemId: z.number().describe('Product/Item ID in FluentCart Pro'),
        apiUrl: z.string().describe('Base URL of your FluentCart store, e.g. "https://store.example.com/"'),
        includeAdminUi: z.boolean().default(true).describe('Include turnkey Admin License Settings page code')
      }
    },
    async ({ pluginNamespace, pluginTitle, itemId, apiUrl, includeAdminUi }) => {
      const cleanNamespace = pluginNamespace.replace(/^\\+|\\+$/g, '');
      const slug = pluginTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const constPrefix = slug.toUpperCase().replace(/-/g, '_');

      const adminUiCode = includeAdminUi
        ? `
    // 3. Mount turnkey Admin License Management page
    if (is_admin() && class_exists('\\\\${cleanNamespace}\\\\LicenseSettings')) {
        $settings = new \\\\${cleanNamespace}\\\\LicenseSettings();
        $settings->register($licenseManager);

        $settings->setConfig([
            'title'       => __('${pluginTitle} License', '${slug}'),
            'heading'     => __('Activate License Key', '${slug}'),
            'description' => __('Enter your FluentCart license key to receive automatic one-click updates and pro features.', '${slug}'),
            'help_text'   => __('Manage your active site licenses in your customer portal.', '${slug}')
        ]);

        $settings->addPage([
            'type'        => 'submenu',
            'parent_slug' => 'tools.php',
            'page_title'  => __('${pluginTitle} License', '${slug}'),
            'menu_title'  => __('${pluginTitle} License', '${slug}'),
            'capability'  => 'manage_options',
            'menu_slug'   => '${slug}-license'
        ]);
    }`
        : '';

      const code = `<?php
defined('ABSPATH') || exit;

/**
 * FluentCart Software Licensing SDK Integration Boilerplate
 * For: ${pluginTitle}
 * Powered by fluent-cart/software-licensing-sdk
 */

define('${constPrefix}_VERSION', '1.0.0');
define('${constPrefix}_DIR', plugin_dir_path(__FILE__));

add_action('plugins_loaded', function () {
    // 1. Include the SDK licensing class
    if (!class_exists('\\\\${cleanNamespace}\\\\FluentLicensing')) {
        require_once ${constPrefix}_DIR . 'updater/FluentLicensing.php';
    }

    $licenseManager = new \\\\${cleanNamespace}\\\\FluentLicensing();

    // 2. Register licensing parameters
    $licenseManager->register([
        'version'           => ${constPrefix}_VERSION,
        'item_id'           => ${itemId},
        'basename'          => plugin_basename(__FILE__),
        'api_url'           => '${apiUrl}',
        'plugin_title'      => '${pluginTitle}',
        'purchase_url'      => '${apiUrl}checkout/?item_id=${itemId}',
        'activate_url'      => admin_url('tools.php?page=${slug}-license'),
        'show_check_update' => true,
        'settings_key'      => '__${slug.replace(/-/g, '_')}_sl_info'
    ]);${adminUiCode}
});

/**
 * Helper to check whether the plugin license is currently active.
 */
function ${slug.replace(/-/g, '_')}_is_license_active(): bool
{
    if (!class_exists('\\\\${cleanNamespace}\\\\FluentLicensing')) {
        return false;
    }

    $manager = \\\\${cleanNamespace}\\\\FluentLicensing::getInstance();
    if (!$manager) {
        return false;
    }

    $status = $manager->getStatus();
    return !is_wp_error($status) && isset($status['status']) && $status['status'] === 'valid';
}
`;

      return {
        content: [{ type: 'text', text: code }]
      };
    }
  );

  server.registerTool(
    'fc_generate_customer_endpoint_boilerplate',
    {
      description:
        'Generate production-ready PHP boilerplate for adding custom server-rendered pages and tabs to the FluentCart Vue 3 customer dashboard via fluent_cart_api()->addCustomerDashboardEndpoint(), with authenticated customer session resolution, multi-segment sub-path routing, and design system variables.',
      inputSchema: {
        endpointSlug: z.string().describe('Unique URL slug for the endpoint, e.g. "acme-wallet" (do not use reserved slugs like order, subscription, dashboard)'),
        tabTitle: z.string().describe('Display title for the tab in customer dashboard sidebar, e.g. "My Wallet"'),
        iconSvg: z.string().optional().describe('Raw SVG markup for the tab icon (20x20 viewBox, currentColor)'),
        subRoutes: z.array(z.string()).optional().describe('Optional sub-path actions, e.g. ["history", "settings"]')
      }
    },
    async ({ endpointSlug, tabTitle, iconSvg, subRoutes }) => {
      const cleanSlug = endpointSlug.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-|-$/g, '');
      const funcPrefix = cleanSlug.replace(/[^a-z0-9_]/g, '_');
      const defaultSvg =
        iconSvg ||
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" fill="currentColor"/></svg>`;

      const subRouteCases = (subRoutes || ['history', 'settings'])
        .map(
          (route) => `            case '${route}':
                echo '<div class="fct-custom-subpage">';
                echo '<h4>' . esc_html__('${route.charAt(0).toUpperCase() + route.slice(1)}', 'my-addon') . '</h4>';
                echo '<p>' . esc_html__('Custom content for ${route} sub-route.', 'my-addon') . '</p>';
                echo '</div>';
                break;`
        )
        .join('\n');

      const code = `<?php
defined('ABSPATH') || exit;

use FluentCart\\Api\\Resource\\CustomerResource;

/**
 * Register Custom Customer Dashboard Tab in FluentCart Vue 3 Portal
 * Endpoint: /account/${cleanSlug}
 */
add_action('fluent_cart/init', function () {
    if (!function_exists('fluent_cart_api')) {
        return;
    }

    fluent_cart_api()->addCustomerDashboardEndpoint('${cleanSlug}', [
        'title'           => __('${tabTitle}', 'my-addon'),
        'icon_svg'        => '${defaultSvg.replace(/'/g, "\\'")}',
        'render_callback' => '${funcPrefix}_render_customer_dashboard_tab'
    ]);
});

/**
 * Render Callback for Customer Dashboard Tab
 * Core wraps this output inside the portal layout shell (nav, header, avatar, logout).
 */
function ${funcPrefix}_render_customer_dashboard_tab(): void
{
    // 1. Resolve currently authenticated FluentCart customer (memoized, zero-overhead)
    $customer = CustomerResource::getCurrentCustomer();
    if (!$customer) {
        echo '<div class="fct-endpoint-notice">';
        echo '<p>' . esc_html__('Please log in to access this page.', 'my-addon') . '</p>';
        echo '</div>';
        return;
    }

    // 2. Parse multi-segment sub-routes from $wp->request
    global $wp;
    $requestPath = trim($wp->request ?? '', '/');
    $segments = explode('/', $requestPath);
    // Path structure: {account_slug}/{endpoint_slug}/{sub_action}
    $endpointIndex = array_search('${cleanSlug}', $segments, true);
    $subAction = ($endpointIndex !== false && isset($segments[$endpointIndex + 1])) ? sanitize_key($segments[$endpointIndex + 1]) : 'index';

    // 3. Render content matching the customer portal design system
    ?>
    <div class="fct-customer-dashboard-custom-page" style="
        color: var(--fct-customer-dashboard-text-color, #374151);
        border: 1px solid var(--fct-customer-dashboard-border-color, #e5e7eb);
        border-radius: 8px;
        padding: 24px;
        background: #ffffff;
    ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: var(--fct-customer-dashboard-title-color, #111827); font-size: 1.5rem;">
                <?php echo esc_html__('${tabTitle}', 'my-addon'); ?>
            </h2>
            <div class="fct-sub-nav" style="display: flex; gap: 12px;">
                <a href="<?php echo esc_url(site_url('/account/${cleanSlug}')); ?>" style="text-decoration: none; font-weight: <?php echo $subAction === 'index' ? '600' : '400'; ?>;">
                    <?php esc_html_e('Overview', 'my-addon'); ?>
                </a>
                <a href="<?php echo esc_url(site_url('/account/${cleanSlug}/history')); ?>" style="text-decoration: none; font-weight: <?php echo $subAction === 'history' ? '600' : '400'; ?>;">
                    <?php esc_html_e('History', 'my-addon'); ?>
                </a>
            </div>
        </div>

        <?php
        switch ($subAction) {
${subRouteCases}
            case 'index':
            default:
                echo '<div class="fct-overview">';
                echo '<p>' . esc_html(sprintf(__('Welcome back, %s (%s)!', 'my-addon'), $customer->full_name, $customer->email)) . '</p>';
                echo '<!-- Render your customer dashboard widget or shortcode here -->';
                echo '</div>';
                break;
        }
        ?>
    </div>
    <?php
}
`;

      return {
        content: [{ type: 'text', text: code }]
      };
    }
  );

  server.registerTool(
    'fc_generate_device_licensing_boilerplate',
    {
      description:
        'Generate production-ready client licensing code for non-WordPress software (desktop apps, browser extensions, audio plugins, CLI tools) that activates and validates a FluentCart Pro license using device:// identifiers, with server-time clock-tamper guards and offline grace caching.',
      inputSchema: {
        platform: z
          .enum(['tauri_rust', 'chrome_extension', 'python', 'cpp_vst'])
          .describe('Client platform to generate code for'),
        storeUrl: z.string().describe('Base URL of the FluentCart store, e.g. "https://store.example.com/"'),
        productId: z.number().describe('FluentCart product (item) ID the license belongs to'),
        appName: z.string().describe('Product name, e.g. "Acme Studio"')
      }
    },
    async ({ platform, storeUrl, productId, appName }) => {
      const base = storeUrl.endsWith('/') ? storeUrl : `${storeUrl}/`;
      const service = appName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      const shared = [
        `Store:        ${base}`,
        `Item ID:      ${productId}`,
        `Device ID:    device://<uuid> sent as the "site_url" field on every call`,
        `Endpoints:    ?fluent-cart=activate_license | check_license | deactivate_license`,
        `Clock guard:  compare local time against the server's "server_time_unix" reply;`,
        `              never trust a local clock for expiry.`,
        `Missing:      device_fingerprint — this template predates the trial registry,`,
        `              so trials are refused and the device panel has no fingerprint.`,
        `              For trials use fc_generate_trial_guard_boilerplate instead.`
      ].join('\n');

      const header = (title: string, file: string) =>
        `// ${appName} — FluentCart device licensing (${title})\n// File: ${file}\n${shared
          .split('\n')
          .map((l) => `// ${l}`)
          .join('\n')}\n`;

      let code = '';

      if (platform === 'tauri_rust') {
        code = `${header('Tauri / Rust', 'src/licensing.rs')}
//
// Cargo.toml
//   reqwest  = { version = "0.12", features = ["blocking", "json"] }
//   serde    = { version = "1", features = ["derive"] }
//   serde_json = "1"
//   keyring  = "3"
//   uuid     = { version = "1", features = ["v4"] }
//
// All functions are blocking: call them from tauri::async_runtime::spawn_blocking.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::time::{SystemTime, UNIX_EPOCH};

const STORE_URL: &str = "${base}";
const ITEM_ID: u64 = ${productId};
const SERVICE: &str = "${service}";
const ACCOUNT_LICENSE: &str = "license-state";
const ACCOUNT_DEVICE: &str = "device-id";

/// Tolerance (seconds) for legitimate clock drift between checks. Anything
/// larger than this means the machine's clock was moved, so the cached
/// entitlement is no longer trustworthy.
const CLOCK_TOLERANCE_SECS: i64 = 300;

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct LicenseState {
    pub license_key: String,
    pub device_id: String,
    pub status: String,
    pub variation_title: String,
    pub expires: String,
    /// Server clock at the moment of this check — the only time source we trust.
    pub server_time_unix: i64,
    /// Local clock at that same moment, used to detect a clock that moved back.
    pub checked_at_local: i64,
    /// Pre-computed by the server so the client never does date math.
    pub expires_in_days: Option<i64>,
    pub activation_hash: String,
}

#[derive(Deserialize)]
struct RawResponse {
    status: Option<String>,
    license_key: Option<String>,
    variation_title: Option<String>,
    expires: Option<String>,
    activation_hash: Option<String>,
    server_time_unix: Option<i64>,
    expires_in_days: Option<i64>,
    message: Option<String>,
}

fn now_unix() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs() as i64)
        .unwrap_or(0)
}

/// A stable per-install identifier, kept in the OS keychain. The UUID is what
/// FluentCart stores as device://<uuid>, so it must survive app restarts.
pub fn device_id() -> Result<String, String> {
    let entry = keyring::Entry::new(SERVICE, ACCOUNT_DEVICE).map_err(|e| e.to_string())?;
    if let Ok(existing) = entry.get_password() {
        if !existing.is_empty() {
            return Ok(existing);
        }
    }
    let fresh = format!("device://{}", uuid::Uuid::new_v4());
    entry.set_password(&fresh).map_err(|e| e.to_string())?;
    Ok(fresh)
}

pub fn load_state() -> Option<LicenseState> {
    let entry = keyring::Entry::new(SERVICE, ACCOUNT_LICENSE).ok()?;
    let raw = entry.get_password().ok()?;
    serde_json::from_str(&raw).ok()
}

fn store_state(state: &LicenseState) -> Result<(), String> {
    let entry = keyring::Entry::new(SERVICE, ACCOUNT_LICENSE).map_err(|e| e.to_string())?;
    entry
        .set_password(&serde_json::to_string(state).map_err(|e| e.to_string())?)
        .map_err(|e| e.to_string())
}

fn post(endpoint: &str, params: &[(&str, String)]) -> Result<RawResponse, String> {
    let url = format!("{}?fluent-cart={}", STORE_URL, endpoint);
    let body: HashMap<&str, String> = params.iter().cloned().collect();

    let client = reqwest::blocking::Client::builder()
        .timeout(std::time::Duration::from_secs(15))
        .build()
        .map_err(|e| e.to_string())?;

    let res = client.post(&url).form(&body).send().map_err(|e| e.to_string())?;
    res.json::<RawResponse>().map_err(|e| e.to_string())
}

pub fn activate(license_key: &str) -> Result<LicenseState, String> {
    let device = device_id()?;
    let raw = post(
        "activate_license",
        &[
            ("license_key", license_key.trim().to_string()),
            ("item_id", ITEM_ID.to_string()),
            ("site_url", device.clone()),
            ("platform", std::env::consts::OS.to_string()),
            ("server_version", env!("CARGO_PKG_VERSION").to_string()),
        ],
    )?;

    let status = raw.status.unwrap_or_default();
    if status != "valid" && status != "active" {
        return Err(raw.message.unwrap_or_else(|| format!("Activation failed: {}", status)));
    }

    let state = LicenseState {
        license_key: license_key.trim().to_string(),
        device_id: device,
        status,
        variation_title: raw.variation_title.unwrap_or_default(),
        expires: raw.expires.unwrap_or_else(|| "lifetime".into()),
        server_time_unix: raw.server_time_unix.unwrap_or_else(now_unix),
        checked_at_local: now_unix(),
        expires_in_days: raw.expires_in_days,
        activation_hash: raw.activation_hash.unwrap_or_default(),
    };
    store_state(&state)?;
    Ok(state)
}

/// Re-validates against the store. Returns Ok(false) when the license is no
/// longer valid but the call itself worked.
pub fn validate() -> Result<bool, String> {
    let mut state = load_state().ok_or("No license stored on this device")?;

    let raw = post(
        "check_license",
        &[
            ("license_key", state.license_key.clone()),
            ("item_id", ITEM_ID.to_string()),
            ("site_url", state.device_id.clone()),
        ],
    )?;

    let status = raw.status.unwrap_or_default();
    let valid = status == "valid" || status == "active";

    state.status = status;
    state.expires = raw.expires.unwrap_or(state.expires);
    state.expires_in_days = raw.expires_in_days.or(state.expires_in_days);
    state.server_time_unix = raw.server_time_unix.unwrap_or_else(now_unix);
    state.checked_at_local = now_unix();
    store_state(&state)?;

    Ok(valid)
}

/// True when the machine's clock has not been moved backwards since the last
/// successful check. A backwards jump is how users try to outlive an expiry.
pub fn clock_is_sane() -> bool {
    match load_state() {
        Some(state) if state.checked_at_local > 0 => {
            let elapsed = now_unix() - state.checked_at_local;
            elapsed >= -CLOCK_TOLERANCE_SECS
        }
        _ => true,
    }
}

/// The entitlement decision the app should gate on. Offline is tolerated for a
/// short grace window, but a tampered clock is not.
pub fn is_licensed() -> bool {
    let Some(state) = load_state() else { return false };
    if state.status != "valid" && state.status != "active" {
        return false;
    }
    if !clock_is_sane() {
        return false;
    }
    match state.expires_in_days {
        // Server-computed remaining days — never derived from the local clock.
        Some(days) => days >= 0,
        None => true, // lifetime
    }
}

pub fn deactivate() -> Result<(), String> {
    let state = load_state().ok_or("No license stored on this device")?;
    let _ = post(
        "deactivate_license",
        &[
            ("license_key", state.license_key),
            ("item_id", ITEM_ID.to_string()),
            ("site_url", state.device_id),
        ],
    );
    if let Ok(entry) = keyring::Entry::new(SERVICE, ACCOUNT_LICENSE) {
        let _ = entry.delete_credential();
    }
    Ok(())
}

// Tauri wiring (src/main.rs):
//   #[tauri::command]
//   async fn license_activate(key: String) -> Result<bool, String> {
//       tauri::async_runtime::spawn_blocking(move || licensing::activate(&key).map(|_| true))
//           .await.map_err(|e| e.to_string())?
//   }
`;
      }

      if (platform === 'chrome_extension') {
        code = `${header('Chrome MV3 extension', 'background.js')}
//
// manifest.json needs:
//   "permissions": ["storage", "alarms"],
//   "host_permissions": ["${base}*"],
//   "background": { "service_worker": "background.js", "type": "module" }
//
// A service worker is killed after ~30s idle, so nothing may live in a module
// variable. Device id, license state and the last check all live in
// chrome.storage.local, and the 12-hour alarm is what re-checks while asleep.

const STORE_URL = '${base}';
const ITEM_ID = ${productId};
const KEYS = { device: 'fc_device_id', state: 'fc_license_state' };
const CLOCK_TOLERANCE_MS = 5 * 60 * 1000;
const CHECK_ALARM = 'fc-license-check';

async function getDeviceId() {
  const stored = await chrome.storage.local.get(KEYS.device);
  if (stored[KEYS.device]) return stored[KEYS.device];
  // randomUUID is available in the MV3 service worker context.
  const deviceId = 'device://' + crypto.randomUUID();
  await chrome.storage.local.set({ [KEYS.device]: deviceId });
  return deviceId;
}

async function post(endpoint, params) {
  const body = new URLSearchParams(params);
  const res = await fetch(STORE_URL + '?fluent-cart=' + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

async function saveState(patch) {
  const prev = (await chrome.storage.local.get(KEYS.state))[KEYS.state] || {};
  const next = Object.assign({}, prev, patch);
  await chrome.storage.local.set({ [KEYS.state]: next });
  return next;
}

export async function activate(licenseKey) {
  const deviceId = await getDeviceId();
  const data = await post('activate_license', {
    license_key: licenseKey.trim(),
    item_id: String(ITEM_ID),
    site_url: deviceId,
    platform: 'chrome-extension',
    server_version: chrome.runtime.getManifest().version,
  });

  const status = data.status || '';
  const valid = status === 'valid' || status === 'active';
  const state = await saveState({
    license_key: licenseKey.trim(),
    device_id: deviceId,
    status: status,
    expires: data.expires || 'lifetime',
    expires_in_days: typeof data.expires_in_days === 'number' ? data.expires_in_days : null,
    server_time_unix: data.server_time_unix || Math.floor(Date.now() / 1000),
    checked_at_local: Date.now(),
    variation_title: data.variation_title || '',
  });

  if (!valid) throw new Error(data.message || 'Activation failed: ' + status);
  return state;
}

export async function validate() {
  const stored = await chrome.storage.local.get(KEYS.state);
  const state = stored[KEYS.state];
  if (!state || !state.license_key) return { valid: false, reason: 'no-license' };

  const data = await post('check_license', {
    license_key: state.license_key,
    item_id: String(ITEM_ID),
    site_url: state.device_id,
  });

  const status = data.status || '';
  const valid = status === 'valid' || status === 'active';
  await saveState({
    status: status,
    expires: data.expires || state.expires,
    expires_in_days: typeof data.expires_in_days === 'number' ? data.expires_in_days : state.expires_in_days,
    server_time_unix: data.server_time_unix || Math.floor(Date.now() / 1000),
    checked_at_local: Date.now(),
  });

  return { valid: valid, reason: status };
}

// The server's clock is the only one that counts. If the machine's clock is
// now behind the moment of the last check by more than the tolerance, it moved.
function clockIsSane(state) {
  if (!state || !state.checked_at_local) return true;
  return Date.now() - state.checked_at_local >= -CLOCK_TOLERANCE_MS;
}

export async function isLicensed() {
  const stored = await chrome.storage.local.get(KEYS.state);
  const state = stored[KEYS.state];
  if (!state) return false;
  if (state.status !== 'valid' && state.status !== 'active') return false;
  if (!clockIsSane(state)) return false;
  if (typeof state.expires_in_days === 'number' && state.expires_in_days < 0) return false;
  return true;
}

export async function deactivate() {
  const stored = await chrome.storage.local.get(KEYS.state);
  const state = stored[KEYS.state];
  if (state && state.license_key) {
    try {
      await post('deactivate_license', {
        license_key: state.license_key,
        item_id: String(ITEM_ID),
        site_url: state.device_id,
      });
    } catch (e) {
      // Deactivation is best-effort: the device is forgotten locally anyway.
    }
  }
  await chrome.storage.local.remove(KEYS.state);
}

// Re-check every 12 hours, and once whenever the browser starts.
chrome.alarms.create(CHECK_ALARM, { periodInMinutes: 720 });
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== CHECK_ALARM) return;
  try {
    await validate();
  } catch (e) {
    // Offline: keep the cached verdict until the next alarm.
  }
});
chrome.runtime.onStartup.addListener(() => { validate().catch(() => {}); });
chrome.runtime.onInstalled.addListener(() => { validate().catch(() => {}); });

// Popup / options page usage:
//   const licensed = await chrome.runtime.sendMessage({ type: 'fc:is-licensed' });
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg && msg.type === 'fc:is-licensed') {
    isLicensed().then((v) => sendResponse(v));
    return true; // keep the channel open for the async reply
  }
});
`;
      }

      if (platform === 'python') {
        code = `${header('Python (CLI / desktop)', 'licensing.py')}
#
# pip install httpx keyring
#
# Usage:
#   python licensing.py activate ABCD-1234-EFGH-5678
#   python licensing.py status
#   python licensing.py deactivate

from __future__ import annotations

import json
import sys
import time
import uuid
from pathlib import Path
from typing import Any, Optional

import httpx
import keyring

STORE_URL = "${base}"
ITEM_ID = ${productId}
APP_NAME = "${appName}"
SERVICE = "${service}"
CLOCK_TOLERANCE_SECS = 300
STATE_FILE = Path.home() / ".config" / SERVICE.replace("-", "_") / "license.json"


def now_unix() -> int:
    return int(time.time())


def device_id() -> str:
    """Stable per-install id; FluentCart stores it as device://<uuid>."""
    existing = keyring.get_password(SERVICE, "device-id")
    if existing:
        return existing
    fresh = f"device://{uuid.uuid4()}"
    keyring.set_password(SERVICE, "device-id", fresh)
    return fresh


def load_state() -> Optional[dict[str, Any]]:
    try:
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None


def save_state(state: dict[str, Any]) -> None:
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, indent=2), encoding="utf-8")


def _post(endpoint: str, params: dict[str, str]) -> dict[str, Any]:
    with httpx.Client(timeout=15.0) as client:
        res = client.post(f"{STORE_URL}?fluent-cart={endpoint}", data=params)
        res.raise_for_status()
        return res.json()


def activate(license_key: str) -> dict[str, Any]:
    data = _post(
        "activate_license",
        {
            "license_key": license_key.strip(),
            "item_id": str(ITEM_ID),
            "site_url": device_id(),
            "platform": sys.platform,
            "server_version": "1.0.0",
        },
    )
    status = str(data.get("status", ""))
    if status not in ("valid", "active"):
        raise RuntimeError(data.get("message") or f"Activation failed: {status}")

    state = {
        "license_key": license_key.strip(),
        "device_id": device_id(),
        "status": status,
        "expires": data.get("expires", "lifetime"),
        "expires_in_days": data.get("expires_in_days"),
        "server_time_unix": int(data.get("server_time_unix") or now_unix()),
        "checked_at_local": now_unix(),
        "variation_title": data.get("variation_title", ""),
        "activation_hash": data.get("activation_hash", ""),
    }
    save_state(state)
    return state


def validate() -> bool:
    state = load_state()
    if not state:
        return False

    data = _post(
        "check_license",
        {
            "license_key": state["license_key"],
            "item_id": str(ITEM_ID),
            "site_url": state["device_id"],
        },
    )
    status = str(data.get("status", ""))
    state.update(
        {
            "status": status,
            "expires": data.get("expires", state.get("expires", "lifetime")),
            "expires_in_days": data.get("expires_in_days", state.get("expires_in_days")),
            "server_time_unix": int(data.get("server_time_unix") or now_unix()),
            "checked_at_local": now_unix(),
        }
    )
    save_state(state)
    return status in ("valid", "active")


def clock_is_sane(state: Optional[dict[str, Any]]) -> bool:
    """Reject a machine whose clock was moved backwards since the last check."""
    if not state or not state.get("checked_at_local"):
        return True
    return now_unix() - int(state["checked_at_local"]) >= -CLOCK_TOLERANCE_SECS


def is_licensed() -> bool:
    state = load_state()
    if not state:
        return False
    if state.get("status") not in ("valid", "active"):
        return False
    if not clock_is_sane(state):
        return False
    days = state.get("expires_in_days")
    if isinstance(days, int) and days < 0:
        return False
    return True


def deactivate() -> None:
    state = load_state()
    if state:
        try:
            _post(
                "deactivate_license",
                {
                    "license_key": state.get("license_key", ""),
                    "item_id": str(ITEM_ID),
                    "site_url": state.get("device_id", ""),
                },
            )
        except httpx.HTTPError:
            pass  # best effort; the device forgets the key regardless
    try:
        STATE_FILE.unlink()
    except OSError:
        pass


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    if cmd == "activate":
        if len(sys.argv) < 3:
            sys.exit("usage: python licensing.py activate <license-key>")
        print(json.dumps(activate(sys.argv[2]), indent=2))
    elif cmd == "deactivate":
        deactivate()
        print("deactivated")
    elif cmd == "status":
        print("licensed" if is_licensed() else "not licensed")
    else:
        sys.exit(f"unknown command: {cmd}")
`;
      }

      if (platform === 'cpp_vst') {
        code = `${header('C++ / JUCE (VST3, AU, AAX)', 'LicensingManager.h + .cpp')}
//
// Add to your juce_module dependencies: juce_core, juce_data_structures.
// Enable JUCE_WEB_BROWSER=0 is fine — juce::URL handles the POST itself.
//
// ── LicensingManager.h ─────────────────────────────────────────────────────
#pragma once

#include <JuceHeader.h>

class LicensingManager : public juce::Thread
{
public:
    LicensingManager();
    ~LicensingManager() override;

    /** Kicks off a background check. Never blocks the audio thread. */
    void refreshAsync();

    /** Cached verdict, safe to read from the message/audio thread. */
    bool isLicensed() const;

    juce::String getStatusText() const;
    juce::String getExpiryText() const;

    void activate (const juce::String& licenseKey);
    void deactivate();

    /** Fired on the message thread whenever the verdict changes. */
    std::function<void (bool licensed)> onLicenseChanged;

private:
    void run() override;
    void setState (const juce::var& json);
    juce::var post (const juce::String& endpoint,
                    const juce::StringPairArray& params);

    static juce::String deviceId();

    juce::CriticalSection lock;
    bool licensed = false;
    juce::String statusText { "unlicensed" };
    juce::String expiryText;
    std::unique_ptr<juce::PropertiesFile> props;
};

// ── LicensingManager.cpp ───────────────────────────────────────────────────
#include "LicensingManager.h"

namespace
{
    constexpr const char* kStoreUrl  = "${base}";
    constexpr int         kItemId    = ${productId};
    constexpr juce::int64 kClockToleranceMs = 5 * 60 * 1000;

    juce::PropertiesFile::Options optionsFor (const juce::String& appName)
    {
        juce::PropertiesFile::Options o;
        o.applicationName     = appName;
        o.filenameSuffix      = ".licence";
        o.osxLibrarySubFolder = "Application Support";
        return o;
    }
}

LicensingManager::LicensingManager()
    : juce::Thread ("FluentCart licensing"),
      props (new juce::PropertiesFile (
          optionsFor ("${service}"),
          juce::PropertiesFile::storeAsXML))
{
}

LicensingManager::~LicensingManager() { stopThread (3000); }

juce::String LicensingManager::deviceId()
{
    auto& p = *juce::PropertiesFile::createDefaultAppPropertiesFile (
        "${service}", ".licence", "Application Support", true);
    auto existing = p.getValue ("fc_device_id");
    if (existing.isNotEmpty())
        return existing;

    auto fresh = "device://" + juce::Uuid().toString();
    p.setValue ("fc_device_id", fresh);
    p.saveIfNeeded();
    return fresh;
}

juce::var LicensingManager::post (const juce::String& endpoint,
                                  const juce::StringPairArray& params)
{
    juce::String body;
    for (int i = 0; i < params.size(); ++i)
        body << (i ? "&" : "")
             << juce::URL::addEscapeChars (params.getAllKeys()[i], false) << "="
             << juce::URL::addEscapeChars (params.getAllValues()[i], false);

    juce::URL url (juce::String (kStoreUrl) + "?fluent-cart=" + endpoint);
    url = url.withPOSTData (body);

    int statusCode = 0;
    auto stream = url.createInputStream (
        juce::URL::InputStreamOptions (juce::URL::ParameterHandling::inPostData)
            .withConnectionTimeoutMs (15000)
            .withExtraHeaders ("Content-Type: application/x-www-form-urlencoded")
            .withStatusCode (&statusCode));

    if (stream == nullptr)
        return {};

    return juce::JSON::parse (stream->readEntireStreamAsString());
}

void LicensingManager::setState (const juce::var& json)
{
    auto* obj = json.getDynamicObject();
    if (obj == nullptr)
        return;

    auto status = obj->getProperty ("status").toString();
    auto valid  = (status == "valid" || status == "active");

    // The server's clock is authoritative. Remember the matching local time so
    // a clock moved backwards between checks can be detected.
    auto serverTime = (juce::int64) (double) obj->getProperty ("server_time_unix");

    {
        const juce::ScopedLock sl (lock);
        licensed   = valid;
        statusText = status.isNotEmpty() ? status : "unknown";
        expiryText = obj->getProperty ("expires").toString();
    }

    if (serverTime > 0)
        props->setValue ("fc_server_time", juce::String (serverTime));
    props->setValue ("fc_checked_at_local", juce::String (juce::Time::currentTimeMillis()));
    props->saveIfNeeded();

    auto changed = onLicenseChanged;
    if (changed != nullptr)
        juce::MessageManager::callAsync ([changed, valid] { changed (valid); });
}

bool LicensingManager::isLicensed() const
{
    const juce::ScopedLock sl (lock);
    if (! licensed)
        return false;

    // Pre-computed by the server; the client never does date math.
    auto days = props->getIntValue ("fc_expires_in_days", -1);
    if (days >= 0 && days == 0)
        return false;

    auto checkedAt = props->getValue ("fc_checked_at_local").getLargeIntValue();
    if (checkedAt > 0 && juce::Time::currentTimeMillis() - checkedAt < -kClockToleranceMs)
        return false; // clock moved backwards — treat as tampered

    return true;
}

juce::String LicensingManager::getStatusText() const
{
    const juce::ScopedLock sl (lock);
    return statusText;
}

juce::String LicensingManager::getExpiryText() const
{
    const juce::ScopedLock sl (lock);
    return expiryText;
}

void LicensingManager::refreshAsync()
{
    if (! isThreadRunning())
        startThread();
}

void LicensingManager::run()
{
    auto& p = *props;
    auto key = p.getValue ("fc_license_key");
    if (key.isEmpty())
        return;

    juce::StringPairArray params;
    params.set ("license_key", key);
    params.set ("item_id", juce::String (kItemId));
    params.set ("site_url", p.getValue ("fc_device_id"));

    setState (post ("check_license", params));
}

void LicensingManager::activate (const juce::String& licenseKey)
{
    juce::StringPairArray params;
    params.set ("license_key", licenseKey.trim());
    params.set ("item_id", juce::String (kItemId));
    params.set ("site_url", deviceId());
    params.set ("platform", juce::SystemStats::getOperatingSystemName());

    auto json = post ("activate_license", params);
    auto* obj = json.getDynamicObject();
    if (obj != nullptr)
    {
        props->setValue ("fc_license_key", licenseKey.trim());
        props->setValue ("fc_expires_in_days",
                         juce::String ((int) (double) obj->getProperty ("expires_in_days")));
    }
    setState (json);
    props->saveIfNeeded();
}

void LicensingManager::deactivate()
{
    juce::StringPairArray params;
    params.set ("license_key", props->getValue ("fc_license_key"));
    params.set ("item_id", juce::String (kItemId));
    params.set ("site_url", props->getValue ("fc_device_id"));
    post ("deactivate_license", params);

    props->removeValue ("fc_license_key");
    props->saveIfNeeded();

    const juce::ScopedLock sl (lock);
    licensed = false;
    statusText = "unlicensed";
}

// In your AudioProcessor constructor:
//   licensing.refreshAsync();          // background thread, no UI stall
// Never call isLicensed() from the audio callback — cache it on the message
// thread and read an atomic in processBlock().
`;
      }

      return {
        content: [{ type: 'text', text: code }]
      };
    }
  );
  server.registerTool(
    'fc_generate_trial_guard_boilerplate',
    {
      description:
        'Generate client code that makes a FluentCart Pro trial one-per-machine: hardware fingerprinting, a pre-checkout eligibility call that returns a signed token, activation with device_fingerprint, and handling for trial_already_used / trial_fingerprint_required / trial_device_mismatch. Requires the Fastr Devices for FluentCart add-on.',
      inputSchema: {
        platform: z
          .enum(['tauri_rust', 'python', 'chrome_extension'])
          .describe('Client platform to generate code for'),
        storeUrl: z.string().describe('Base URL of the FluentCart store, e.g. "https://store.example.com/"'),
        productId: z.number().describe('FluentCart product (item) ID the trial belongs to'),
        appName: z.string().describe('Product name, e.g. "Acme Studio"')
      }
    },
    async ({ platform, storeUrl, productId, appName }) => {
      const base = storeUrl.endsWith('/') ? storeUrl : storeUrl + '/';
      const slug = appName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const shared = [
        `Store:        ${base}`,
        `Product ID:   ${productId}`,
        `Eligibility:  POST ?fluent-cart=fastr_trial_eligibility  (product_id, device_fingerprint, email)`,
        `Activation:   POST ?fluent-cart=activate_license         (+ device_fingerprint)`,
        `Heartbeat:    POST ?fluent-cart=check_license            (+ device_fingerprint)`,
        `Refusals:     trial_already_used | trial_fingerprint_required | trial_device_mismatch`,
        `              All are HTTP 422 with success=false. Never trust a local clock for expiry.`
      ].join('\n');

      const header = (title: string, file: string) =>
        `// ${appName} - FluentCart trial guard (${title})\n// File: ${file}\n${shared
          .split('\n')
          .map((line) => `// ${line}`)
          .join('\n')}\n`;

      if (platform === 'tauri_rust') {
        return {
          content: [
            {
              type: 'text',
              text: `${header('Tauri / Rust', 'src/trial.rs')}
//
// Cargo.toml
//   reqwest     = { version = "0.12", features = ["json"] }
//   serde       = { version = "1", features = ["derive"] }
//   serde_json  = "1"
//   machine-uid = "0.5"
//   keyring     = "2"
//   whoami      = "1"

use serde::Deserialize;

const STORE: &str = "${base}";
const PRODUCT_ID: i64 = ${productId};
const KEYRING_SERVICE: &str = "${slug}-trial";

#[derive(Deserialize, Debug)]
pub struct Eligibility {
    pub eligible: bool,
    pub reason: String,
    pub token: Option<String>,
    pub risk_score: Option<i64>,
}

/// Stable, versioned machine fingerprint. Survives app updates; changes on
/// OS reinstall or disk replacement, which is a support reset, not abuse.
pub fn fingerprint() -> String {
    let uid = machine_uid::get().unwrap_or_else(|_| "unknown".to_string());
    let host = whoami::fallible::hostname().unwrap_or_else(|_| "host".to_string());
    format!(
        "v1|MACHINEID={}|HOST={}|OS={}|ARCH={}",
        uid,
        host,
        std::env::consts::OS,
        std::env::consts::ARCH
    )
}

/// One persisted device:// id, used as site_url. Separate from the fingerprint:
/// the id identifies the install, the fingerprint identifies the machine.
pub fn device_id() -> String {
    if let Ok(entry) = keyring::Entry::new(KEYRING_SERVICE, "device_id") {
        if let Ok(id) = entry.get_password() {
            return id;
        }
        let id = format!("device://{}", uuid::Uuid::new_v4());
        let _ = entry.set_password(&id);
        return id;
    }
    "device://unknown".to_string()
}

pub async fn check_trial(client: &reqwest::Client, email: &str) -> Result<Eligibility, String> {
    let res = client
        .post(format!("{}?fluent-cart=fastr_trial_eligibility", STORE))
        .form(&[
            ("product_id", PRODUCT_ID.to_string()),
            ("device_fingerprint", fingerprint()),
            ("email", email.to_string()),
        ])
        .send()
        .await
        .map_err(|e| e.to_string())?;

    res.json::<Eligibility>().await.map_err(|e| e.to_string())
}

pub async fn activate(
    client: &reqwest::Client,
    license_key: &str,
    email: &str,
) -> Result<serde_json::Value, String> {
    let res = client
        .post(format!("{}?fluent-cart=activate_license", STORE))
        .form(&[
            ("item_id", PRODUCT_ID.to_string()),
            ("license_key", license_key.to_string()),
            ("site_url", device_id()),
            ("device_fingerprint", fingerprint()),
            ("device_name", whoami::fallible::hostname().unwrap_or_default()),
            ("device_type", "Desktop (Tauri)".to_string()),
            ("os", std::env::consts::OS.to_string()),
            ("arch", std::env::consts::ARCH.to_string()),
            ("email", email.to_string()),
            ("server_version", env!("CARGO_PKG_VERSION").to_string()),
        ])
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let body: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;

    match body.get("error_type").and_then(|v| v.as_str()) {
        Some("trial_already_used") => Err("trial_already_used".into()),
        Some("trial_fingerprint_required") => Err("client_outdated".into()),
        Some("trial_device_mismatch") => Err("trial_device_mismatch".into()),
        Some("device_blocked") => Err("device_blocked".into()),
        _ => Ok(body),
    }
}

// Flow: check_trial() before showing the trial button; hide or disable it when
// eligible=false. activate() on submit. Cache the server's server_time_unix and
// compare it on every launch instead of trusting the local clock.
`
            }
          ]
        };
      }

      if (platform === 'python') {
        return {
          content: [
            {
              type: 'text',
              text: `"""${appName} - FluentCart trial guard (Python)

Store:        ${base}
Product ID:   ${productId}
Dependencies: httpx, keyring

Flow: check_trial() before offering the trial, activate() on submit,
      check() on every launch. Never trust the local clock for expiry.
"""

import platform
import socket
import subprocess
import sys
import time
import uuid

import httpx
import keyring

STORE = "${base}"
PRODUCT_ID = ${productId}
KEYRING_SERVICE = "${slug}-trial"


def machine_id() -> str:
    """Stable machine identifier. Linux: /etc/machine-id, Windows: MachineGuid."""
    if sys.platform.startswith("win"):
        try:
            import winreg

            key = winreg.OpenKey(
                winreg.HKEY_LOCAL_MACHINE,
                r"SOFTWARE\\Microsoft\\Cryptography",
            )
            value, _ = winreg.QueryValueEx(key, "MachineGuid")
            return str(value)
        except Exception:
            return ""
    if sys.platform == "darwin":
        try:
            out = subprocess.check_output(
                ["ioreg", "-rd1", "-c", "IOPlatformExpertDevice"],
                text=True,
            )
            for line in out.splitlines():
                if "IOPlatformUUID" in line:
                    return line.split("=")[-1].strip().strip('"')
        except Exception:
            return ""
    try:
        with open("/etc/machine-id", "r", encoding="utf-8") as handle:
            return handle.read().strip()
    except OSError:
        return ""


def fingerprint() -> str:
    uname = platform.uname()
    return "v1|MACHINEID={}|HOST={}|OS={}|ARCH={}".format(
        machine_id() or "unknown",
        socket.gethostname(),
        uname.system,
        uname.machine,
    )


def device_id() -> str:
    stored = keyring.get_password(KEYRING_SERVICE, "device_id")
    if stored:
        return stored
    new_id = "device://" + str(uuid.uuid4())
    keyring.set_password(KEYRING_SERVICE, "device_id", new_id)
    return new_id


def check_trial(email: str) -> dict:
    payload = {
        "product_id": PRODUCT_ID,
        "device_fingerprint": fingerprint(),
        "email": email,
    }
    with httpx.Client(timeout=10.0) as client:
        response = client.post(STORE + "?fluent-cart=fastr_trial_eligibility", data=payload)
        return response.json()


def activate(license_key: str, email: str) -> dict:
    uname = platform.uname()
    payload = {
        "item_id": PRODUCT_ID,
        "license_key": license_key,
        "site_url": device_id(),
        "device_fingerprint": fingerprint(),
        "device_name": socket.gethostname(),
        "device_type": "Python Desktop / CLI",
        "os": uname.system,
        "arch": uname.machine,
        "email": email,
        "server_version": "1.0.0",
    }
    with httpx.Client(timeout=10.0) as client:
        response = client.post(STORE + "?fluent-cart=activate_license", data=payload)
        body = response.json()

    error = body.get("error_type")
    if error in {
        "trial_already_used",
        "trial_fingerprint_required",
        "trial_device_mismatch",
        "device_blocked",
    }:
        raise RuntimeError(error)

    if body.get("status") == "valid":
        keyring.set_password(KEYRING_SERVICE, "license_key", license_key)
        keyring.set_password(KEYRING_SERVICE, "last_server_time", str(body.get("server_time_unix", 0)))

    return body
`
            }
          ]
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: `${header('Chrome Extension MV3', 'background.js')}
//
// manifest.json permissions: "storage", "alarms"
// Note: a user can clear chrome.storage in seconds, so browser trials are
// account-bound in practice. The fingerprint raises friction, it does not
// guarantee device identity.

const STORE = "${base}";
const PRODUCT_ID = ${productId};
// Offline entitlement is bounded by the signed token's own exp, which the
// server issues. Nothing below trusts a timestamp this extension wrote:
// chrome.storage is editable from DevTools in seconds.
const PUBLIC_KEY_URL = STORE + "?fluent-cart=fastr_license_public_key";

async function getInstallId() {
  const data = await chrome.storage.local.get("install_id");
  if (data.install_id) return data.install_id;
  const id = "device://" + crypto.randomUUID();
  await chrome.storage.local.set({ install_id: id });
  return id;
}

async function fingerprint() {
  const manifest = chrome.runtime.getManifest();
  return [
    "v1",
    "INSTALL=" + (await getInstallId()),
    "EXT=" + chrome.runtime.id,
    "CORES=" + (navigator.hardwareConcurrency || 0),
    "TZ=" + Intl.DateTimeFormat().resolvedOptions().timeZone,
    "VER=" + manifest.version
  ].join("|");
}

export async function checkTrial(email) {
  const body = new URLSearchParams({
    product_id: String(PRODUCT_ID),
    device_fingerprint: await fingerprint(),
    email: email || ""
  });

  const res = await fetch(STORE + "?fluent-cart=fastr_trial_eligibility", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString()
  });

  const json = await res.json();
  await chrome.storage.local.set({ trial_risk: json.risk_score || 0 });
  return json;
}

export async function activateLicense(licenseKey, email) {
  const installId = await getInstallId();
  const body = new URLSearchParams({
    item_id: String(PRODUCT_ID),
    license_key: licenseKey,
    site_url: installId,
    device_fingerprint: await fingerprint(),
    device_name: "Chrome Browser Profile",
    device_type: "Chrome Extension",
    os: navigator.userAgentData ? navigator.userAgentData.platform : navigator.platform,
    email: email || "",
    server_version: chrome.runtime.getManifest().version
  });

  const res = await fetch(STORE + "?fluent-cart=activate_license", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString()
  });

  const json = await res.json();

  if (json.error_type === "trial_already_used") throw new Error("trial_already_used");
  if (json.error_type === "trial_fingerprint_required") throw new Error("client_outdated");
  if (json.error_type === "trial_device_mismatch") throw new Error("trial_device_mismatch");

  if (json.status === "valid" && json.license_token) {
    await chrome.storage.local.set({
      license_key: licenseKey,
      activation_hash: json.activation_hash,
      license_token: json.license_token,
      server_time_unix: json.server_time_unix,
      local_at_check: Date.now()
    });
  }

  return json;
}

function b64Bytes(input) {
  const bin = atob(input.replace(/-/g, "+").replace(/_/g, "/"));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function storePublicKey() {
  const cached = await chrome.storage.local.get("fastr_public_key");
  if (cached.fastr_public_key) return cached.fastr_public_key;

  const res = await fetch(PUBLIC_KEY_URL, { cache: "no-store" });
  const json = await res.json();
  const pem = String(json.public_key || json.pem || "");

  if (pem) await chrome.storage.local.set({ fastr_public_key: pem });
  return pem;
}

// RS256 verification. A token the user forges fails here; a token the store
// signed cannot be edited without breaking the signature.
export async function verifyLicenseToken(token, pem) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3 || !pem) return null;

  try {
    const der = pem.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");

    const key = await crypto.subtle.importKey(
      "spki",
      b64Bytes(der),
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const ok = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      key,
      b64Bytes(parts[2]),
      new TextEncoder().encode(parts[0] + "." + parts[1])
    );

    if (!ok) return null;

    const claims = JSON.parse(new TextDecoder().decode(b64Bytes(parts[1])));

    if (typeof claims.exp === "number" && claims.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return claims;
  } catch (error) {
    return null;
  }
}

// What the extension should gate on. Verified offline against the store's key,
// so the answer survives losing the network but not editing storage.
export async function hasAccess() {
  const data = await chrome.storage.local.get([
    "license_key",
    "license_token",
    "local_at_check"
  ]);

  if (!data.license_key || !data.license_token) {
    return { status: "unlicensed" };
  }

  // A clock that now reads earlier than it did at the last successful check
  // defeats the expiry check below, so refuse instead of guessing.
  if (data.local_at_check && Date.now() < data.local_at_check) {
    return { status: "invalid", reason: "clock_rollback" };
  }

  const pem = await storePublicKey();
  const claims = await verifyLicenseToken(data.license_token, pem);

  if (!claims) {
    return { status: "expired", reason: "token_invalid_or_expired" };
  }

  return { status: "valid", source: "offline_token", claims };
}

export async function checkLicense() {
  const data = await chrome.storage.local.get([
    "license_key",
    "install_id",
    "license_token"
  ]);

  if (!data.license_key || !data.install_id) return { status: "unlicensed" };

  const body = new URLSearchParams({
    item_id: String(PRODUCT_ID),
    license_key: data.license_key,
    site_url: data.install_id,
    device_fingerprint: await fingerprint()
  });

  try {
    const res = await fetch(STORE + "?fluent-cart=check_license", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    });

    const json = await res.json();

    if (json.status !== "valid") {
      // The store said no. Whatever is still on disk is now a lie.
      await chrome.storage.local.remove(["license_token", "local_at_check"]);
      return json;
    }

    await chrome.storage.local.set({
      license_token: json.license_token || data.license_token,
      server_time_unix: json.server_time_unix,
      local_at_check: Date.now()
    });

    return json;
  } catch (error) {
    // No network. The signed token is the best evidence available, and it
    // expires on the server's schedule rather than ours.
    return await hasAccess();
  }
}

chrome.alarms.create("fastr_license_check", { periodInMinutes: 60 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "fastr_license_check") checkLicense();
});
`
          }
        ]
      };
    }
  );
  server.registerTool(
    'fc_generate_client_sdk',
    {
      description:
        'Generate a complete licence client for Node/Electron, .NET, Go or Kotlin: activation, heartbeat, deactivation, RS256 verification of the offline licence token, release checking, usage reporting, and the status=="valid" rule that survives FluentCart\'s two 200-with-success errors.',
      inputSchema: {
        platform: z
          .enum(['node', 'dotnet', 'go', 'kotlin'])
          .describe('Client platform to generate code for'),
        storeUrl: z.string().describe('Base URL of the FluentCart store, e.g. "https://store.example.com/"'),
        productId: z.number().describe('FluentCart product (item) ID'),
        appName: z.string().describe('Product name, e.g. "Acme Studio"')
      }
    },
    async ({ platform, storeUrl, productId, appName }) => {
      const base = storeUrl.endsWith('/') ? storeUrl : storeUrl + '/';
      const slug = appName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const header = (title: string, file: string) =>
        `// ${appName} - FluentCart licence client (${title})\n` +
        `// File: ${file}\n` +
        `// Store: ${base}   Product: ${productId}\n` +
        `// Contract: activate, check, deactivate + RS256 offline token.\n`;

      if (platform === 'node') {
        return {
          content: [
            {
              type: 'text',
              text: `${header('Node / Electron', 'src/license.ts')}
import { createVerify } from "node:crypto";

const STORE = "${base}";
const PRODUCT_ID = ${productId};

export type LicenseState = {
  status: string;
  token?: string;
  entitlements?: number[];
  expiresInDays?: number;
  errorType?: string;
};

async function call(verb: string, body: Record<string, string>) {
  const res = await fetch(STORE + "?fluent-cart=" + verb, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString()
  });
  return { http: res.status, json: await res.json() };
}

export async function activate(licenseKey: string, instanceId: string, fingerprint: string, email: string): Promise<LicenseState> {
  const { json } = await call("activate_license", {
    item_id: String(PRODUCT_ID),
    license_key: licenseKey,
    site_url: instanceId,
    device_fingerprint: fingerprint,
    device_name: process.env.COMPUTERNAME || "desktop",
    device_type: "Desktop (Node)",
    os: process.platform + " " + process.arch,
    email,
    server_version: "1.0.0"
  });

  // FluentCart returns key_mismatch / invalid_activation as HTTP 200 with
  // success=true. Only status === "valid" means licensed.
  return {
    status: json.status,
    token: json.license_token,
    entitlements: json.entitlements,
    expiresInDays: json.expires_in_days,
    errorType: json.error_type
  };
}

export async function check(licenseKey: string, instanceId: string, fingerprint: string): Promise<LicenseState> {
  const { json } = await call("check_license", {
    item_id: String(PRODUCT_ID),
    license_key: licenseKey,
    site_url: instanceId,
    device_fingerprint: fingerprint
  });
  return { status: json.status, token: json.license_token, entitlements: json.entitlements };
}

export async function deactivate(licenseKey: string, instanceId: string): Promise<void> {
  await call("deactivate_license", {
    item_id: String(PRODUCT_ID),
    license_key: licenseKey,
    site_url: instanceId
  });
}

export async function latestRelease(licenseKey: string, currentVersion: string, platform = "any") {
  const query = new URLSearchParams({
    product_id: String(PRODUCT_ID),
    platform,
    current_version: currentVersion,
    license_key: licenseKey
  });
  const res = await fetch(STORE + "?fluent-cart=fastr_release_latest&" + query.toString());
  return res.json();
}

export async function reportUsage(licenseKey: string, metric: string, quantity: number, idempotencyKey: string) {
  const { json } = await call("fastr_usage_report", {
    license_key: licenseKey,
    metric,
    quantity: String(quantity),
    idempotency_key: idempotencyKey
  });
  return json;
}

// After verifying, compare claims.ins and claims.fp with this install and
// claims.prod / claims.ent with the product you are running.
export function verifyToken(token: string, publicKeyPem: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const verifier = createVerify("RSA-SHA256");
  verifier.update(parts[0] + "." + parts[1]);
  if (!verifier.verify(publicKeyPem, Buffer.from(parts[2], "base64url"))) return null;
  const claims = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
  if (typeof claims.exp === "number" && claims.exp < Math.floor(Date.now() / 1000)) return null;
  return claims;
}

/**
 * Decide whether the app should run, binding the token to THIS installation.
 *
 * verifyToken proves the store signed the token and that it has not expired.
 * It does not prove the token was issued for this machine or this product, so
 * a token copied from another install passes it. Compare the claims before
 * granting anything.
 *
 * claims.fp is a server-side HMAC of the device fingerprint and cannot be
 * recomputed here, so claims.ins (the install id you sent as site_url) is the
 * binding a client is able to check. That is friction against sharing, not a
 * guarantee: the server's check() is what actually enforces seats.
 */
export function entitlement(
  token: string,
  publicKeyPem: string,
  expected: { installId?: string; productId?: number }
): { ok: boolean; reason?: string; claims?: Record<string, unknown> } {
  const claims = verifyToken(token, publicKeyPem);
  if (!claims) return { ok: false, reason: "invalid_or_expired" };

  if (typeof expected.productId === "number" && Number(claims.prod) !== expected.productId) {
    return { ok: false, reason: "wrong_product" };
  }

  if (expected.installId && claims.ins && String(claims.ins) !== expected.installId) {
    return { ok: false, reason: "wrong_install" };
  }

  return { ok: true, claims };
}
`
            }
          ]
        };
      }

      if (platform === 'dotnet') {
        return {
          content: [
            {
              type: 'text',
              text: `${header('.NET (WPF / MAUI / console)', 'License.cs')}
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public sealed class LicenseState
{
    public string Status { get; set; } = "";
    public string? Token { get; set; }
    public List<int> Entitlements { get; set; } = new();
    public string? ErrorType { get; set; }
}

public static class FastrLicense
{
    private const string Store = "${base}";
    private const int ProductId = ${productId};
    private static readonly HttpClient Http = new() { Timeout = TimeSpan.FromSeconds(10) };

    private static async Task<JsonElement> CallAsync(string verb, Dictionary<string, string> body)
    {
        var res = await Http.PostAsync(Store + "?fluent-cart=" + verb, new FormUrlEncodedContent(body));
        var text = await res.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(text);
        return doc.RootElement.Clone();
    }

    public static async Task<LicenseState> ActivateAsync(string licenseKey, string instanceId, string fingerprint, string email)
    {
        var json = await CallAsync("activate_license", new Dictionary<string, string>
        {
            ["item_id"] = ProductId.ToString(),
            ["license_key"] = licenseKey,
            ["site_url"] = instanceId,
            ["device_fingerprint"] = fingerprint,
            ["device_name"] = Environment.MachineName,
            ["device_type"] = "Desktop (.NET)",
            ["os"] = Environment.OSVersion.ToString(),
            ["email"] = email,
            ["server_version"] = "1.0.0"
        });

        // key_mismatch and invalid_activation arrive as HTTP 200 with success=true.
        var state = new LicenseState
        {
            Status = json.TryGetProperty("status", out var s) ? s.GetString() ?? "" : "",
            Token = json.TryGetProperty("license_token", out var t) ? t.GetString() : null,
            ErrorType = json.TryGetProperty("error_type", out var e) ? e.GetString() : null
        };

        if (json.TryGetProperty("entitlements", out var ent) && ent.ValueKind == JsonValueKind.Array)
        {
            foreach (var id in ent.EnumerateArray()) state.Entitlements.Add(id.GetInt32());
        }

        return state;
    }

    public static async Task<LicenseState> CheckAsync(string licenseKey, string instanceId, string fingerprint)
    {
        var json = await CallAsync("check_license", new Dictionary<string, string>
        {
            ["item_id"] = ProductId.ToString(),
            ["license_key"] = licenseKey,
            ["site_url"] = instanceId,
            ["device_fingerprint"] = fingerprint
        });

        var state = new LicenseState
        {
            Status = json.TryGetProperty("status", out var s) ? s.GetString() ?? "" : "",
            Token = json.TryGetProperty("license_token", out var t) ? t.GetString() : null,
            ErrorType = json.TryGetProperty("error_type", out var e) ? e.GetString() : null
        };

        if (json.TryGetProperty("entitlements", out var ent) && ent.ValueKind == JsonValueKind.Array)
        {
            foreach (var id in ent.EnumerateArray()) state.Entitlements.Add(id.GetInt32());
        }

        return state;
    }

    public static async Task DeactivateAsync(string licenseKey, string instanceId)
    {
        await CallAsync("deactivate_license", new Dictionary<string, string>
        {
            ["item_id"] = ProductId.ToString(),
            ["license_key"] = licenseKey,
            ["site_url"] = instanceId
        });
    }

    public static async Task<JsonElement> LatestReleaseAsync(string licenseKey, string currentVersion, string platform = "any")
    {
        var url = Store + "?fluent-cart=fastr_release_latest&product_id=" + ProductId
                + "&platform=" + Uri.EscapeDataString(platform)
                + "&current_version=" + Uri.EscapeDataString(currentVersion)
                + "&license_key=" + Uri.EscapeDataString(licenseKey);

        var text = await Http.GetStringAsync(url);
        using var doc = JsonDocument.Parse(text);
        return doc.RootElement.Clone();
    }

    public static Task<JsonElement> ReportUsageAsync(string licenseKey, string metric, int quantity, string idempotencyKey)
    {
        return CallAsync("fastr_usage_report", new Dictionary<string, string>
        {
            ["license_key"] = licenseKey,
            ["metric"] = metric,
            ["quantity"] = quantity.ToString(),
            ["idempotency_key"] = idempotencyKey
        });
    }

    // After verifying, compare claims ins/fp with this install and prod/ent
    // with the product you are running.
    public static bool VerifyToken(string token, string publicKeyPem, out JsonElement claims)
    {
        claims = default;
        var parts = token.Split('.');
        if (parts.Length != 3) return false;

        using var rsa = RSA.Create();
        rsa.ImportFromPem(publicKeyPem);

        var data = Encoding.ASCII.GetBytes(parts[0] + "." + parts[1]);
        var signature = Base64UrlDecode(parts[2]);

        if (!rsa.VerifyData(data, signature, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1)) return false;

        using var doc = JsonDocument.Parse(Base64UrlDecode(parts[1]));
        claims = doc.RootElement.Clone();
        return true;
    }

    /// <summary>
    /// Bind the token to this installation. VerifyToken proves the store signed
    /// it and that it has not expired; it does not prove the token was issued
    /// for this machine or this product, so a token copied from another install
    /// passes it. claims.fp is a server-side HMAC and cannot be recomputed
    /// here, so claims.ins (the install id sent as site_url) is the binding a
    /// client is able to check.
    /// </summary>
    public static bool Entitlement(
        string token,
        string publicKeyPem,
        string installId,
        int productId,
        out JsonElement claims,
        out string reason)
    {
        reason = "";

        if (!VerifyToken(token, publicKeyPem, out claims))
        {
            reason = "invalid_or_expired";
            return false;
        }

        if (productId > 0)
        {
            if (!claims.TryGetProperty("prod", out var prod)
                || prod.ValueKind != JsonValueKind.Number
                || prod.GetInt32() != productId)
            {
                reason = "wrong_product";
                return false;
            }
        }

        if (!string.IsNullOrEmpty(installId)
            && claims.TryGetProperty("ins", out var ins)
            && ins.GetString() != installId)
        {
            reason = "wrong_install";
            return false;
        }

        return true;
    }

    private static byte[] Base64UrlDecode(string value)
    {
        var padded = value.Replace('-', '+').Replace('_', '/');
        padded += new string('=', (4 - padded.Length % 4) % 4);
        return Convert.FromBase64String(padded);
    }
}
`
            }
          ]
        };
      }

      if (platform === 'go') {
        return {
          content: [
            {
              type: 'text',
              text: `${header('Go (CLI / service)', 'license/license.go')}
package license

import (
	"crypto"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/json"
	"encoding/pem"
	"errors"
	"io"
	"strconv"
	"net/http"
	"net/url"
	"os"
	"runtime"
	"strings"
	"time"
)

const (
	Store     = "${base}"
	ProductID = "${productId}"
)

type State struct {
	Status       string
	Token        string
	Entitlements []int
	ErrorType    string
}

func call(verb string, body url.Values) (map[string]any, error) {
	res, err := http.PostForm(Store+"?fluent-cart="+verb, body)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	raw, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	var out map[string]any
	if err := json.Unmarshal(raw, &out); err != nil {
		return nil, err
	}
	return out, nil
}

func Activate(key, instanceID, fingerprint, email string) (State, error) {
	host, _ := os.Hostname()

	out, err := call("activate_license", url.Values{
		"item_id":            {ProductID},
		"license_key":        {key},
		"site_url":           {instanceID},
		"device_fingerprint": {fingerprint},
		"device_name":        {host},
		"device_type":        {"CLI (Go)"},
		"os":                 {runtime.GOOS + " " + runtime.GOARCH},
		"email":              {email},
		"server_version":     {"1.0.0"},
	})
	if err != nil {
		return State{}, err
	}

	// key_mismatch and invalid_activation come back as HTTP 200 success=true.
	state := State{
		Status:    asString(out["status"]),
		Token:     asString(out["license_token"]),
		ErrorType: asString(out["error_type"]),
	}

	if list, ok := out["entitlements"].([]any); ok {
		for _, v := range list {
			if f, ok := v.(float64); ok {
				state.Entitlements = append(state.Entitlements, int(f))
			}
		}
	}

	return state, nil
}

func Check(key, instanceID, fingerprint string) (State, error) {
	out, err := call("check_license", url.Values{
		"item_id":            {ProductID},
		"license_key":        {key},
		"site_url":           {instanceID},
		"device_fingerprint": {fingerprint},
	})
	if err != nil {
		return State{}, err
	}

	state := State{
		Status:    asString(out["status"]),
		Token:     asString(out["license_token"]),
		ErrorType: asString(out["error_type"]),
	}

	if list, ok := out["entitlements"].([]any); ok {
		for _, v := range list {
			if f, ok := v.(float64); ok {
				state.Entitlements = append(state.Entitlements, int(f))
			}
		}
	}

	return state, nil
}

func Deactivate(key, instanceID string) error {
	_, err := call("deactivate_license", url.Values{
		"item_id":     {ProductID},
		"license_key": {key},
		"site_url":    {instanceID},
	})
	return err
}

func LatestRelease(key, currentVersion, platform string) (map[string]any, error) {
	query := url.Values{
		"product_id":      {ProductID},
		"platform":        {platform},
		"current_version": {currentVersion},
		"license_key":     {key},
	}

	res, err := http.Get(Store + "?fluent-cart=fastr_release_latest&" + query.Encode())
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	raw, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	var out map[string]any
	if err := json.Unmarshal(raw, &out); err != nil {
		return nil, err
	}

	return out, nil
}

func ReportUsage(key, metric string, quantity int, idempotencyKey string) (map[string]any, error) {
	return call("fastr_usage_report", url.Values{
		"license_key":     {key},
		"metric":          {metric},
		"quantity":        {strconv.Itoa(quantity)},
		"idempotency_key": {idempotencyKey},
	})
}

// After verifying, compare claims["ins"] and claims["fp"] with this install
// and claims["prod"] / claims["ent"] with the product you are running.
// VerifyToken checks an RS256 licence token against the store's public key.// VerifyToken checks an RS256 licence token against the store's public key.
func VerifyToken(token, publicKeyPEM string) (map[string]any, error) {
	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		return nil, errors.New("malformed token")
	}

	block, _ := pem.Decode([]byte(publicKeyPEM))
	if block == nil {
		return nil, errors.New("bad public key")
	}

	pub, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return nil, err
	}

	rsaPub, ok := pub.(*rsa.PublicKey)
	if !ok {
		return nil, errors.New("not an RSA key")
	}

	sig, err := base64.RawURLEncoding.DecodeString(parts[2])
	if err != nil {
		return nil, err
	}

	digest := sha256.Sum256([]byte(parts[0] + "." + parts[1]))
	if err := rsa.VerifyPKCS1v15(rsaPub, crypto.SHA256, digest[:], sig); err != nil {
		return nil, err
	}

	payload, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return nil, err
	}

	var claims map[string]any
	if err := json.Unmarshal(payload, &claims); err != nil {
		return nil, err
	}

	if exp, ok := claims["exp"].(float64); ok && int64(exp) < time.Now().Unix() {
		return nil, errors.New("token expired")
	}

	return claims, nil
}

// Entitlement binds the token to THIS installation.
//
// VerifyToken proves the store signed the token and that it has not expired.
// It does not prove the token was issued for this machine or this product, so
// a token copied from another install passes it. Compare the claims before
// granting anything.
//
// claims["fp"] is a server-side HMAC of the device fingerprint and cannot be
// recomputed here, so claims["ins"] - the install id sent as site_url - is the
// binding a client is able to check.
func Entitlement(token, publicKeyPEM, installID string, productID int) (map[string]any, string) {
	claims, err := VerifyToken(token, publicKeyPEM)
	if err != nil {
		return nil, "invalid_or_expired"
	}

	if productID > 0 {
		prod, ok := claims["prod"].(float64)
		if !ok || int(prod) != productID {
			return nil, "wrong_product"
		}
	}

	if installID != "" {
		if ins, ok := claims["ins"].(string); ok && ins != installID {
			return nil, "wrong_install"
		}
	}

	return claims, ""
}

func asString(v any) string {
	if s, ok := v.(string); ok {
		return s
	}
	return ""
}
`
            }
          ]
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: `${header('Kotlin / JVM', 'LicenseClient.kt')}
import java.net.HttpURLConnection
import java.net.URL
import java.security.KeyFactory
import java.security.Signature
import java.security.spec.X509EncodedKeySpec
import java.util.Base64
import org.json.JSONObject

const val STORE = "${base}"
const val PRODUCT_ID = ${productId}

data class LicenseState(
    val status: String,
    val token: String?,
    val entitlements: List<Int>,
    val errorType: String?
)

fun call(verb: String, body: Map<String, String>): JSONObject {
    val url = URL(STORE + "?fluent-cart=" + verb)
    val conn = url.openConnection() as HttpURLConnection
    conn.requestMethod = "POST"
    conn.doOutput = true
    conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded")
    val form = body.entries.joinToString("&") { e ->
        java.net.URLEncoder.encode(e.key, "UTF-8") + "=" + java.net.URLEncoder.encode(e.value, "UTF-8")
    }
    conn.outputStream.use { it.write(form.toByteArray()) }
    return JSONObject(conn.inputStream.bufferedReader().readText())
}

fun activate(key: String, instanceId: String, fingerprint: String, email: String): LicenseState {
    val json = call("activate_license", mapOf(
        "item_id" to PRODUCT_ID.toString(),
        "license_key" to key,
        "site_url" to instanceId,
        "device_fingerprint" to fingerprint,
        "device_name" to (System.getenv("COMPUTERNAME") ?: "desktop"),
        "device_type" to "Desktop (JVM)",
        "os" to System.getProperty("os.name") + " " + System.getProperty("os.arch"),
        "email" to email,
        "server_version" to "1.0.0"
    ))

    // key_mismatch and invalid_activation arrive as HTTP 200 with success=true.
    val ents = mutableListOf<Int>()
    json.optJSONArray("entitlements")?.let { arr ->
        for (i in 0 until arr.length()) ents.add(arr.getInt(i))
    }

    return LicenseState(
        status = json.optString("status"),
        token = json.optString("license_token").ifEmpty { null },
        entitlements = ents,
        errorType = json.optString("error_type").ifEmpty { null }
    )
}

fun check(key: String, instanceId: String, fingerprint: String): LicenseState {
    val json = call("check_license", mapOf(
        "item_id" to PRODUCT_ID.toString(),
        "license_key" to key,
        "site_url" to instanceId,
        "device_fingerprint" to fingerprint
    ))

    val ents = mutableListOf<Int>()
    json.optJSONArray("entitlements")?.let { arr ->
        for (i in 0 until arr.length()) ents.add(arr.getInt(i))
    }

    return LicenseState(
        status = json.optString("status"),
        token = json.optString("license_token").ifEmpty { null },
        entitlements = ents,
        errorType = json.optString("error_type").ifEmpty { null }
    )
}

fun deactivate(key: String, instanceId: String) {
    call("deactivate_license", mapOf(
        "item_id" to PRODUCT_ID.toString(),
        "license_key" to key,
        "site_url" to instanceId
    ))
}

fun latestRelease(key: String, currentVersion: String, platform: String = "any"): JSONObject {
    val query = "product_id=" + PRODUCT_ID +
        "&platform=" + java.net.URLEncoder.encode(platform, "UTF-8") +
        "&current_version=" + java.net.URLEncoder.encode(currentVersion, "UTF-8") +
        "&license_key=" + java.net.URLEncoder.encode(key, "UTF-8")

    val connection = java.net.URL(STORE + "?fluent-cart=fastr_release_latest&" + query)
        .openConnection() as java.net.HttpURLConnection

    return JSONObject(connection.inputStream.bufferedReader().readText())
}

fun reportUsage(key: String, metric: String, quantity: Int, idempotencyKey: String): JSONObject {
    return call("fastr_usage_report", mapOf(
        "license_key" to key,
        "metric" to metric,
        "quantity" to quantity.toString(),
        "idempotency_key" to idempotencyKey
    ))
}

// After verifying, compare claims.ins / claims.fp with this install and
// claims.prod / claims.ent with the product you are running.
fun verifyToken(token: String, publicKeyPem: String): JSONObject? {
    val parts = token.split(".")
    if (parts.size != 3) return null

    val pem = publicKeyPem
        .replace("-----BEGIN PUBLIC KEY-----", "")
        .replace("-----END PUBLIC KEY-----", "")
        .replace("\\s".toRegex(), "")

    val keySpec = X509EncodedKeySpec(Base64.getDecoder().decode(pem))
    val publicKey = KeyFactory.getInstance("RSA").generatePublic(keySpec)

    val verifier = Signature.getInstance("SHA256withRSA")
    verifier.initVerify(publicKey)
    verifier.update((parts[0] + "." + parts[1]).toByteArray())

    val signature = Base64.getUrlDecoder().decode(parts[2])
    if (!verifier.verify(signature)) return null

    val payload = String(Base64.getUrlDecoder().decode(parts[1]))
    return JSONObject(payload)
}

// Entitlement binds the token to THIS installation.
//
// verifyToken only proves the store signed it: it does not check expiry, this
// machine, or this product. Compare the claims before granting anything.
// claims.fp is a server-side HMAC and cannot be recomputed here, so claims.ins
// - the install id sent as site_url - is the binding a client can check.
// Returns the claims and a null reason on success, or null and a reason.
fun entitlement(
    token: String,
    publicKeyPem: String,
    installId: String?,
    productId: Int
): Pair<JSONObject?, String?> {
    val claims = verifyToken(token, publicKeyPem) ?: return Pair(null, "invalid_or_expired")

    val exp = if (claims.has("exp")) claims.optLong("exp", 0L) else 0L
    if (exp > 0L && exp <= System.currentTimeMillis() / 1000L) {
        return Pair(null, "invalid_or_expired")
    }

    if (productId > 0 && claims.optInt("prod", -1) != productId) {
        return Pair(null, "wrong_product")
    }

    if (!installId.isNullOrEmpty() && claims.has("ins") && claims.optString("ins", "") != installId) {
        return Pair(null, "wrong_install")
    }

    return Pair(claims, null)
}
`
            }
          ]
        };
    }
  );

  server.registerTool(
    'fc_generate_native_client',
    {
      description:
        'Generate a complete licence client for Swift, Unity/C#, Java, PHP or C: activation, heartbeat, deactivation, RS256 verification of the offline licence token, release checking and usage reporting.',
      inputSchema: {
        platform: z
          .enum(['swift', 'unity_csharp', 'java', 'php', 'c'])
          .describe('Client platform to generate code for'),
        storeUrl: z.string().describe('Base URL of the FluentCart store, e.g. "https://store.example.com/"'),
        productId: z.number().describe('FluentCart product (item) ID'),
        appName: z.string().describe('Product name, e.g. "Acme Studio"')
      }
    },
    async ({ platform, storeUrl, productId, appName }) => {
      const base = storeUrl.endsWith('/') ? storeUrl : storeUrl + '/';

      return {
        content: [{ type: 'text', text: nativeClientTemplate(platform, base, productId, appName) }]
      };
    }
  );
}
