import crypto from 'node:crypto';

export type Tier = 'core' | 'pro';

export interface AuthContext {
  tier: Tier;
  userId?: string;
  source: 'stdio' | 'lemonsqueezy' | 'mcpize' | 'agensi' | 'none';
  /** Human-readable explanation, surfaced by `suite_get_pro_info` and logs. */
  reason: string;
}

const LS_VALIDATE_URL = 'https://api.lemonsqueezy.com/v1/licenses/validate';
const LICENSE_CACHE_TTL_MS = 10 * 60 * 1000;

/** token -> resolution, so a busy client does not hit Lemon Squeezy on every request. */
const licenseCache = new Map<string, { tier: Tier; expiresAt: number }>();

/** Unauthenticated callers can send arbitrary tokens, so the cache is bounded. */
const LICENSE_CACHE_MAX = 5000;
/** A failed validation is cached briefly: it bounds upstream load during an outage. */
const NEGATIVE_CACHE_TTL_MS = 30 * 1000;
/** Beyond this many concurrent validations the answer is "core" without calling out. */
const MAX_INFLIGHT_VALIDATIONS = 64;

let inFlightValidations = 0;

function cacheResolution(token: string, tier: Tier, ttlMs: number): void {
  if (licenseCache.size >= LICENSE_CACHE_MAX) {
    // Map iteration is insertion-ordered, so the first key is the oldest entry.
    const oldest = licenseCache.keys().next().value;
    if (oldest !== undefined) licenseCache.delete(oldest);
  }
  licenseCache.set(token, { tier, expiresAt: Date.now() + ttlMs });
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  const left = Buffer.from(a, 'utf8');
  const right = Buffer.from(b, 'utf8');
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function bearerToken(authorization?: string | null): string {
  if (!authorization) return '';
  return authorization.replace(/^Bearer\s+/i, '').trim();
}

/**
 * Local (stdio) tier resolution.
 *
 * Setting `PRO_LICENSE_KEY` in the environment unlocks Pro. This is a local
 * trust boundary, not a security boundary: anyone who controls the machine can
 * set the variable. The paid gate that matters is the HTTP transport, where
 * every request is validated server-side. Commercial terms are enforced by the
 * BSL-1.1 licence in `server/LICENSE`.
 */
export function resolveLocalAuth(): AuthContext {
  const key = process.env.PRO_LICENSE_KEY?.trim();
  if (key && key.length >= 16) {
    return { tier: 'pro', source: 'stdio', reason: 'PRO_LICENSE_KEY present in environment' };
  }
  return { tier: 'core', source: 'stdio', reason: 'stdio session without PRO_LICENSE_KEY' };
}

/**
 * Validate a licence key against Lemon Squeezy. Results are cached for 10
 * minutes. Any network or parsing failure fails closed (core tier).
 */
async function validateLicenseKey(licenseKey: string): Promise<AuthContext> {
  const cached = licenseCache.get(licenseKey);
  if (cached && cached.expiresAt > Date.now()) {
    return {
      tier: cached.tier,
      source: 'lemonsqueezy',
      reason: cached.tier === 'pro' ? 'license key valid (cached)' : 'license key invalid (cached)'
    };
  }

  // Any caller can present an unknown token. Without this cap, a burst of junk
  // tokens becomes a burst of 5-second outbound requests.
  if (inFlightValidations >= MAX_INFLIGHT_VALIDATIONS) {
    return {
      tier: 'core',
      source: 'lemonsqueezy',
      reason: 'license validation concurrency limit reached'
    };
  }

  inFlightValidations += 1;
  try {
    const res = await fetch(LS_VALIDATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: new URLSearchParams({ license_key: licenseKey }),
      signal: AbortSignal.timeout(5000)
    });

    const data = (await res.json()) as {
      valid?: boolean;
      license_key?: { status?: string; store_id?: number };
    };

    const expectedStore = process.env.LS_STORE_ID;
    const storeMatches = !expectedStore || String(data.license_key?.store_id ?? '') === String(expectedStore);
    const active = data.valid === true && data.license_key?.status === 'active' && storeMatches;
    const tier: Tier = active ? 'pro' : 'core';

    cacheResolution(licenseKey, tier, LICENSE_CACHE_TTL_MS);
    return {
      tier,
      source: 'lemonsqueezy',
      reason: active ? 'active Lemon Squeezy license' : 'license inactive, unknown, or wrong store'
    };
  } catch (err: any) {
    // Fail closed, but remember the failure for a moment: an outage must not
    // turn every request from every client into another outbound attempt.
    cacheResolution(licenseKey, 'core', NEGATIVE_CACHE_TTL_MS);
    return {
      tier: 'core',
      source: 'lemonsqueezy',
      reason: `license validation unavailable: ${err.message}`
    };
  } finally {
    inFlightValidations -= 1;
  }
}

/**
 * Resolve the tier for one HTTP request.
 *
 * 1. `VALID_LICENSE_KEYS` allowlist (ops escape hatch, e.g. internal seats).
 * 2. MCPize gateway token, checked against `MCPIZE_GATEWAY_SECRET`.
 * 3. Agensi gateway token, checked against `AGENSI_GATEWAY_SECRET`.
 * 4. Everything else is treated as a Lemon Squeezy licence key and validated live.
 *
 * There is deliberately no prefix-based trust: a client cannot mint itself Pro
 * by sending a string that starts with `ls_live_`.
 */
export async function authenticateRequest(request?: Request): Promise<AuthContext> {
  const token = bearerToken(request?.headers.get('authorization'));

  if (!token) {
    return { tier: 'core', source: 'none', reason: 'no Authorization header' };
  }

  const allowlist = (process.env.VALID_LICENSE_KEYS || '')
    .split(',')
    .map(k => k.trim())
    .filter(Boolean);
  // Compared in constant time like the gateway secrets, and without stopping at
  // the first match so the loop's duration does not reveal an entry's position.
  let allowlisted = false;
  for (const candidate of allowlist) {
    allowlisted = timingSafeEqualStrings(token, candidate) || allowlisted;
  }
  if (allowlisted) {
    return { tier: 'pro', source: 'lemonsqueezy', reason: 'token in VALID_LICENSE_KEYS allowlist' };
  }

  const mcpizeSecret = process.env.MCPIZE_GATEWAY_SECRET?.trim();
  if (mcpizeSecret && timingSafeEqualStrings(token, mcpizeSecret)) {
    return { tier: 'pro', source: 'mcpize', reason: 'MCPize gateway secret matched' };
  }

  const agensiSecret = process.env.AGENSI_GATEWAY_SECRET?.trim();
  if (agensiSecret && timingSafeEqualStrings(token, agensiSecret)) {
    return { tier: 'pro', source: 'agensi', reason: 'Agensi gateway secret matched' };
  }

  return validateLicenseKey(token);
}
