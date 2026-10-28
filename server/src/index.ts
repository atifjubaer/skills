#!/usr/bin/env node
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { resolveLocalAuth } from './auth.js';
import { createServerInstance } from './server.js';

const auth = resolveLocalAuth();

serveStdio(async () => {
  return await createServerInstance(auth);
});
