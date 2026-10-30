#!/usr/bin/env node
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { fullAccess } from './auth.js';
import { createServerInstance } from './server.js';

const auth = fullAccess('stdio');

serveStdio(async () => {
  return await createServerInstance(auth);
});
