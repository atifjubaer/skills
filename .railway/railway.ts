// Railway Infrastructure as Code — the single source for this project.
//
// `railway.json` / `railway.toml` (Config as Code) are deprecated and new
// services cannot opt into them, so nothing here uses them.
//
//   npx @railway/cli config plan     # review the change set
//   npx @railway/cli config apply    # apply it; destructive lines are marked
import { defineRailway, github, project, preserve, service } from 'railway/iac';

export default defineRailway(() => {
  const suite = service('fastr-mcp-suite', {
    source: github('atifjubaer/skills', { branch: 'main' }),

    // The image is built from the REPOSITORY ROOT: server/Dockerfile copies
    // skills/ into the image and the MCP skills catalog reads it at runtime.
    // `rootDirectory: 'server'` would move the build context and hide skills/,
    // so the Dockerfile is named explicitly instead of using a root directory.
    build: { builder: 'DOCKERFILE', dockerfilePath: 'server/Dockerfile' },

    healthcheck: '/health',
    healthcheckTimeout: 30,

    env: {
      // Every variable the HTTP transport reads. Values are set in the Railway
      // dashboard, never committed: `preserve()` keeps the live value. A
      // variable omitted from this map would be removed on the next apply, so
      // this list has to stay in step with server/.env.example.
      ALLOWED_HOSTS: preserve(),
      LS_STORE_ID: preserve(),
      LS_PRODUCT_ALL_ACCESS: preserve(),
      LS_PRODUCT_FLUENTCART: preserve(),
      LS_PRODUCT_LEMONSQUEEZY: preserve(),
      VALID_LICENSE_KEYS: preserve(),
      MCPIZE_GATEWAY_SECRET: preserve(),
      AGENSI_GATEWAY_SECRET: preserve()
    }
  });

  return project('fastr-mcp-suite', { resources: [suite] });
});
