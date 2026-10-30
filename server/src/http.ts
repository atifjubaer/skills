import { createMcpExpressApp } from '@modelcontextprotocol/express';
import { toNodeHandler } from '@modelcontextprotocol/node';
import { createMcpHandler } from '@modelcontextprotocol/server';
import dotenv from 'dotenv';
import { fullAccess } from './auth.js';
import { createServerInstance } from './server.js';

dotenv.config();

const port = Number(process.env.PORT || 8080);
const allowedHosts = process.env.ALLOWED_HOSTS ? process.env.ALLOWED_HOSTS.split(',') : undefined;

const app = createMcpExpressApp({
  host: '0.0.0.0',
  allowedHosts
});

// Per-request factory: a fresh server instance per call. Nothing about the
// request changes what is registered — every caller gets the whole suite.
const handler = createMcpHandler(async () => {
  return await createServerInstance(fullAccess('http'));
});

const node = toNodeHandler(handler);

// Mount the MCP endpoint
app.all('/mcp', (req, res) => {
  void node(req, res, req.body);
});

// Healthcheck endpoint for Docker / Railway / Render / Fly.io
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    server: 'fastr-dev-suite',
    version: '1.0.0',
    protocol: '2026-07-28',
    licence: 'MIT',
    price: 'free',
    cards: [
      'fluentcart-developer',
      'lemonsqueezy-developer'
    ]
  });
});

app.listen(port, () => {
  console.log(`[Fastr MCP Suite] Listening on http://0.0.0.0:${port}/mcp`);
});
