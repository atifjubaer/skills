import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';
import type { AuthContext } from '../../auth.js';
import { skillRefs } from '../../paths.js';

export function registerLemonSqueezyTools(server: McpServer, auth: AuthContext): void {
  const LS_REFS_DIR = skillRefs('lemonsqueezy-developer');

  // ==========================================
  // CORE PROFILE TOOLS (Available in Free Tier)
  // ==========================================

  server.registerTool(
    'ls_search_docs',
    {
      description: 'Search modular Lemon Squeezy documentation for endpoints, webhooks, checkouts, and licensing without loading huge files into context.',
      inputSchema: {
        query: z.string().describe('Search keyword or topic, e.g. "webhook signature", "checkout custom_data", "pause subscription"'),
        category: z.enum(['webhooks', 'checkouts', 'subscriptions', 'licensing', 'all']).default('all')
      },
      annotations: { readOnlyHint: true }
    },
    async ({ query, category }) => {
      try {
        let targetFiles: string[] = [];
        if (category === 'webhooks') targetFiles = ['webhooks-and-security.md'];
        else if (category === 'checkouts') targetFiles = ['checkouts-and-orders.md'];
        else if (category === 'subscriptions') targetFiles = ['subscriptions-lifecycle.md'];
        else if (category === 'licensing') targetFiles = ['license-keys-and-activation.md'];
        else {
          targetFiles = [
            'webhooks-and-security.md',
            'checkouts-and-orders.md',
            'subscriptions-lifecycle.md',
            'license-keys-and-activation.md',
            'developer-guide.md'
          ];
        }

        const results: string[] = [];
        const lowerQuery = query.toLowerCase();

        for (const file of targetFiles) {
          const fullPath = path.join(LS_REFS_DIR, file);
          if (!fs.existsSync(fullPath)) continue;

          const content = fs.readFileSync(fullPath, 'utf8');
          const paragraphs = content.split(/\n#{1,3} /);

          for (const para of paragraphs) {
            if (para.toLowerCase().includes(lowerQuery)) {
              results.push(`### [From ${file}]\n${para.slice(0, 1500)}`);
              if (results.length >= 3) break;
            }
          }
          if (results.length >= 5) break;
        }

        if (results.length === 0) {
          return {
            content: [{
              type: 'text',
              text: `No exact matches found for "${query}". Available guides: webhooks-and-security.md, checkouts-and-orders.md, subscriptions-lifecycle.md, license-keys-and-activation.md.`
            }]
          };
        }

        return {
          content: [{ type: 'text', text: results.join('\n\n---\n\n') }]
        };
      } catch (err: any) {
        return {
          content: [{ type: 'text', text: `Error searching Lemon Squeezy docs: ${err.message}` }],
          isError: true
        };
      }
    }
  );

  server.registerTool(
    'ls_get_schema',
    {
      description: 'Retrieve exact JSON:API schema and required attributes for Lemon Squeezy endpoints.',
      inputSchema: {
        endpoint: z.enum([
          'checkouts',
          'orders',
          'subscriptions',
          'license-keys',
          'customers',
          'products',
          'variants',
          'webhooks'
        ]).describe('The Lemon Squeezy API resource')
      },
      annotations: { readOnlyHint: true }
    },
    async ({ endpoint }) => {
      const schemas: Record<string, any> = {
        checkouts: {
          endpoint: 'POST /v1/checkouts',
          format: 'JSON:API (application/vnd.api+json)',
          requiredPayload: {
            data: {
              type: 'checkouts',
              attributes: {
                custom_price: 'Optional: integer cents (e.g. 5000 for $50.00)',
                product_options: {
                  name: 'Product name override',
                  redirect_url: 'https://...',
                  receipt_link_url: 'https://...'
                },
                checkout_data: {
                  email: 'customer@example.com',
                  custom: 'Key-value object echoed in all webhook events as meta.custom_data'
                }
              },
              relationships: {
                store: { data: { type: 'stores', id: 'STORE_ID' } },
                variant: { data: { type: 'variants', id: 'VARIANT_ID' } }
              }
            }
          }
        },
        subscriptions: {
          endpoint: 'GET/PATCH/DELETE /v1/subscriptions/{id}',
          stateTransitions: ['on_trial', 'active', 'paused', 'past_due', 'unpaid', 'cancelled', 'expired'],
          updatePayload: {
            data: {
              type: 'subscriptions',
              id: 'SUB_ID',
              attributes: {
                variant_id: 'New variant ID for tier upgrades',
                pause: { mode: 'void' }
              }
            }
          }
        },
        'license-keys': {
          endpoints: [
            'POST /v1/licenses/activate',
            'POST /v1/licenses/validate',
            'POST /v1/licenses/deactivate'
          ],
          note: 'Public client endpoints. No Bearer token required.',
          activatePayload: {
            license_key: 'UUID-string',
            instance_name: 'machine-id-or-domain'
          }
        },
        webhooks: {
          header: 'X-Signature',
          algorithm: 'HMAC-SHA256 of raw body',
          securityRule: 'Must use crypto.timingSafeEqual on raw request buffer before parsing JSON'
        }
      };

      const selected = schemas[endpoint] || { message: `Schema for ${endpoint} follows standard JSON:API specification.` };
      return {
        content: [{ type: 'text', text: JSON.stringify(selected, null, 2) }]
      };
    }
  );

  // ==========================================
  // PRO PROFILE TOOLS (Unlocked for Paid Tier)
  // Registration — not just a description — is what the paywall controls:
  // a core-tier client never sees these schemas, let alone calls them.
  // ==========================================
  if (auth.tier !== 'pro') return;

  server.registerTool(
    'ls_verify_webhook',
    {
      description: '[PRO CARD] Perform timing-safe HMAC-SHA256 signature verification on an incoming Lemon Squeezy webhook payload.',
      inputSchema: {
        rawBody: z.string().describe('The raw unparsed request body string'),
        signatureHeader: z.string().describe('The value of the X-Signature HTTP request header'),
        signingSecret: z.string().describe('Your Lemon Squeezy webhook signing secret')
      }
    },
    async ({ rawBody, signatureHeader, signingSecret }) => {
      try {
        const hmac = crypto.createHmac('sha256', signingSecret);
        const digest = Buffer.from(hmac.update(rawBody, 'utf8').digest('hex'), 'utf8');
        const signature = Buffer.from(signatureHeader, 'utf8');

        const isValid = digest.length === signature.length && crypto.timingSafeEqual(digest, signature);

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              valid: isValid,
              algorithm: 'sha256',
              reason: isValid ? 'Signature matches timing-safe hash' : 'Signature mismatch or invalid secret'
            }, null, 2)
          }]
        };
      } catch (err: any) {
        return {
          content: [{ type: 'text', text: `Verification failed with error: ${err.message}` }],
          isError: true
        };
      }
    }
  );

  server.registerTool(
    'ls_validate_license',
    {
      description: '[PRO CARD] Validate a live Lemon Squeezy software license key directly against the official API.',
      inputSchema: {
        licenseKey: z.string().describe('The customer license key string'),
        instanceId: z.string().optional().describe('The instance ID if checking a specific activated machine/domain')
      }
    },
    async ({ licenseKey, instanceId }) => {
      try {
        const res = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json'
          },
          body: new URLSearchParams({
            license_key: licenseKey,
            ...(instanceId ? { instance_id: instanceId } : {})
          })
        });

        const data = await res.json();
        return {
          content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
        };
      } catch (err: any) {
        return {
          content: [{ type: 'text', text: `Failed to connect to Lemon Squeezy API: ${err.message}` }],
          isError: true
        };
      }
    }
  );
}
