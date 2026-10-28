import crypto from 'node:crypto';

export type Tier = 'core' | 'pro';

/** The two Playing Cards. A licence entitles a session to one or both. */
export type CardId = 'fluentcart' | 'lemonsqueezy';

const ALL_CARDS: readonly CardId[] = ['fluentcart', 'lemonsqueezy'];

export interface AuthContext {
  tier: Tier;
  /** Cards whose Pro tools this session may register. Empty on a core session. */
  cards: CardId[];
  userId?: string;
  source: 'stdio' | 'lemonsqueezy' | 'mcpize' | 'agensi' | 'none';
  /** Human-readable explanation, surfaced by `suite_get_pro_info` and logs. */
  reason: string;
}

export function hasCard(auth: AuthContext, card: CardId): boolean {
  return auth.cards.includes(card);
}

/** One card is enough to be a paid session; `core` means no cards at all. */
function tierFor(cards: CardId[]): Tier {
  return cards.length > 0 ? 'pro' : 'core';
}

const LS_VALIDATE_URL = 'https://api.lemonsqueezy.com/v1/licenses/validate';
const LICENSE_CACHE_TTL_MS = 10 * 60 * 1000;

/** token -> resolution, so a busy client does not hit Lemon Squeezy on every request. */
const licenseCache = new Map<string, { cards: CardId[]; expiresAt: number }>();

/** Unauthenticated callers can send arbitrary tokens, so the cache is bounded. */
const LICENSE_CACHE_MAX = 5000;
/** A failed validation is cached briefly: it bounds upstream load during an outage. */
const NEGATIVE_CACHE_TTL_MS = 30 * 1000;
/** Beyond this many concurrent validations the answer is "core" without calling out. */
const MAX_INFLIGHT_VALIDATIONS = 64;

let inFlightValidations = 0;

function cacheResolution(token: string, cards: CardId[], ttlMs: number): void {
  if (licenseCache.size >= LICENSE_CACHE_MAX) {
    // Map iteration is insertion-ordered, so the first key is the oldest entry.
    const oldest = licenseCache.keys().next().value;
    if (oldest !== undefined) licenseCache.delete(oldest);
  }
  licenseCache.set(token, { cards: [...cards], expiresAt: Date.now() + ttlMs });
}

/**
 * Default Lemon Squeezy IDs for the FastrSoft store (store 428520).
 * Overridable via environment variables (e.g. LS_STORE_ID, LS_PRODUCT_*).
 */
export const DEFAULT_LS_STORE_ID = '428520';
export const DEFAULT_LS_PRODUCTS = {
  ALL_ACCESS: '1479567',
  FLUENTCART: '1479582',
  LEMONSQUEEZY: '1479604'
} as const;

/**
 * Which cards a Lemon Squeezy product grants.
 *
 * Each card is its own product, so a licence has to be resolved to the card it
 * paid for — otherwise a $12 Card 1 key would unlock Card 2's Pro tools too.
 * If no custom LS_PRODUCT_* variables are configured, defaults to the canonical
 * FastrSoft product IDs.
 */
function cardsForProduct(productId: string | number | undefined): { cards: CardId[]; reason: string } {
  const allAccessId = (process.env.LS_PRODUCT_ALL_ACCESS || DEFAULT_LS_PRODUCTS.ALL_ACCESS).trim();
  const fluentCartId = (process.env.LS_PRODUCT_FLUENTCART || DEFAULT_LS_PRODUCTS.FLUENTCART).trim();
  const lemonSqueezyId = (process.env.LS_PRODUCT_LEMONSQUEEZY || DEFAULT_LS_PRODUCTS.LEMONSQUEEZY).trim();

  const id = String(productId ?? '');
  if (allAccessId && id === allAccessId) {
    return { cards: [...ALL_CARDS], reason: `licence product ${id} maps to ${ALL_CARDS.join('+')}` };
  }
  if (fluentCartId && id === fluentCartId) {
    return { cards: ['fluentcart'], reason: `licence product ${id} maps to fluentcart` };
  }
  if (lemonSqueezyId && id === lemonSqueezyId) {
    return { cards: ['lemonsqueezy'], reason: `licence product ${id} maps to lemonsqueezy` };
  }

  return { cards: [], reason: `licence product ${id || 'unknown'} is not mapped to a card` };
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
  if (!key || key.length < 16) {
    return { tier: 'core', cards: [], source: 'stdio', reason: 'stdio session without PRO_LICENSE_KEY' };
  }

  // `PRO_CARDS` narrows the local key to specific cards. It exists so a card's
  // tier can be exercised without talking to Lemon Squeezy; like PRO_LICENSE_KEY
  // itself it is a convenience, not a boundary. An unrecognised value fails closed.
  const requested = process.env.PRO_CARDS?.trim();
  if (requested) {
    const wanted = requested.split(',').map((entry) => entry.trim().toLowerCase()).filter(Boolean);
    const cards = ALL_CARDS.filter((card) => wanted.includes(card));
    if (cards.length === 0) {
      return {
        tier: 'core',
        cards: [],
        source: 'stdio',
        reason: `PRO_CARDS "${requested}" names no known card (${ALL_CARDS.join(', ')})`
      };
    }
    return {
      tier: 'pro',
      cards,
      source: 'stdio',
      reason: `PRO_LICENSE_KEY present; PRO_CARDS narrowed the session to ${cards.join('+')}`
    };
  }

  return {
    tier: 'pro',
    cards: [...ALL_CARDS],
    source: 'stdio',
    reason: 'PRO_LICENSE_KEY present in environment'
  };
}

/**
 * Validate a licence key against Lemon Squeezy. Results are cached for 10
 * minutes. Any network or parsing failure fails closed (core tier).
 */
async function validateLicenseKey(licenseKey: string): Promise<AuthContext> {
  const cached = licenseCache.get(licenseKey);
  if (cached && cached.expiresAt > Date.now()) {
    return {
      tier: tierFor(cached.cards),
      cards: [...cached.cards],
      source: 'lemonsqueezy',
      reason: cached.cards.length > 0 ? 'license key valid (cached)' : 'license key invalid (cached)'
    };
  }

  // Any caller can present an unknown token. Without this cap, a burst of junk
  // tokens becomes a burst of 5-second outbound requests.
  if (inFlightValidations >= MAX_INFLIGHT_VALIDATIONS) {
    return {
      tier: 'core',
      cards: [],
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
      meta?: { product_id?: number; store_id?: number };
    };

    const expectedStore = (process.env.LS_STORE_ID || DEFAULT_LS_STORE_ID).trim();
    const actualStore = data.meta?.store_id ?? data.license_key?.store_id;
    const storeMatches = !expectedStore || String(actualStore ?? '') === String(expectedStore);
    const active = data.valid === true && data.license_key?.status === 'active' && storeMatches;

    if (!active) {
      cacheResolution(licenseKey, [], LICENSE_CACHE_TTL_MS);
      return {
        tier: 'core',
        cards: [],
        source: 'lemonsqueezy',
        reason: 'license inactive, unknown, or wrong store'
      };
    }

    // A valid key is not enough: it has to resolve to the card it paid for,
    // otherwise a Card 1 key would unlock Card 2's Pro tools.
    const { cards, reason } = cardsForProduct(data.meta?.product_id);
    cacheResolution(licenseKey, cards, LICENSE_CACHE_TTL_MS);
    return { tier: tierFor(cards), cards, source: 'lemonsqueezy', reason };
  } catch (err: any) {
    // Fail closed, but remember the failure for a moment: an outage must not
    // turn every request from every client into another outbound attempt.
    cacheResolution(licenseKey, [], NEGATIVE_CACHE_TTL_MS);
    return {
      tier: 'core',
      cards: [],
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
    return { tier: 'core', cards: [], source: 'none', reason: 'no Authorization header' };
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
    return { tier: 'pro', cards: [...ALL_CARDS], source: 'lemonsqueezy', reason: 'token in VALID_LICENSE_KEYS allowlist' };
  }

  const mcpizeSecret = process.env.MCPIZE_GATEWAY_SECRET?.trim();
  if (mcpizeSecret && timingSafeEqualStrings(token, mcpizeSecret)) {
    // One secret per gateway: a marketplace token unlocks the whole suite.
    // Per-card gateway entitlement would need the marketplace to forward which
    // product the buyer owns, which none of them do today.
    return { tier: 'pro', cards: [...ALL_CARDS], source: 'mcpize', reason: 'MCPize gateway secret matched' };
  }

  const agensiSecret = process.env.AGENSI_GATEWAY_SECRET?.trim();
  if (agensiSecret && timingSafeEqualStrings(token, agensiSecret)) {
    return { tier: 'pro', cards: [...ALL_CARDS], source: 'agensi', reason: 'Agensi gateway secret matched' };
  }

  return validateLicenseKey(token);
}
