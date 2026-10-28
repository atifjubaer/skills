import fs from 'node:fs';
import path from 'node:path';
import type { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';
import type { AuthContext } from '../../auth.js';
import { skillRefs } from '../../paths.js';

export function registerFluentCartTools(server: McpServer, auth: AuthContext): void {
  const FC_REFS_DIR = skillRefs('fluentcart-developer');

  // ==========================================
  // CORE PROFILE TOOLS (Available in Free Tier)
  // ==========================================

  server.registerTool(
    'fc_search_hooks',
    {
      description: 'Search FluentCart 315+ action and filter hooks across order lifecycles, checkout, customer events, and payment gateways.',
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

        const files = fs.readdirSync(FC_REFS_DIR).filter(f => f.startsWith('action-hooks') || f.startsWith('filter-hooks'));
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
            content: [{ type: 'text', text: `Table "${table}" not found in database-schema-reference.md. Check available tables: orders, customers, subscriptions, order_items, licenses, coupons.` }]
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

  // ==========================================
  // PRO PROFILE TOOLS (Unlocked for Paid Tier)
  // Registration — not just a description — is what the paywall controls:
  // a core-tier client never sees these schemas, let alone calls them.
  // ==========================================
  if (auth.tier !== 'pro') return;

  server.registerTool(
    'fc_generate_payment_gateway_boilerplate',
    {
      description: '[PRO CARD] Generate production-ready PHP boilerplate for custom FluentCart payment gateways with settings schema and webhook listener.',
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
}
