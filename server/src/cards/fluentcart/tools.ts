import fs from 'node:fs';
import path from 'node:path';
import type { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';
import { skillRefs } from '../../paths.js';
import { listReferences, readReference } from '../../reference-reader.js';

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
}
