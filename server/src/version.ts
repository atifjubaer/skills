/**
 * The version the server advertises over MCP (`serverInfo.version`), in
 * `suite_get_info`, and in `/health`.
 *
 * It is a constant rather than a read of package.json because the compiled
 * server is staged in places where the manifest is not next to dist/ — MCPize's
 * image, for one — and a failed read at startup would take the whole server
 * down. Keep it in step with package.json: `npm run verify` fails if the two
 * disagree, and `prepublishOnly` runs verify, so a drifted release cannot be
 * published.
 */
export const SUITE_VERSION = '1.3.0';
