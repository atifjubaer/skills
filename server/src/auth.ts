/**
 * The suite is free and MIT-licensed: every tool is registered for every caller
 * on every transport. There is no tier to resolve, no licence key to validate,
 * and no outbound call to make before a session can work — so this module no
 * longer authenticates anything.
 *
 * `AuthContext` survives as a small descriptor of the session. It is what
 * `createServerInstance` receives and what `suite_get_info` reports, which is
 * still useful when diagnosing which transport a client actually reached.
 */

export type CardId = 'fluentcart' | 'lemonsqueezy';

const ALL_CARDS: readonly CardId[] = ['fluentcart', 'lemonsqueezy'];

export interface AuthContext {
  /** Always `free`. Kept as a literal so a future gate has one obvious seam. */
  tier: 'free';
  cards: CardId[];
  source: 'stdio' | 'http';
  reason: string;
}

export function fullAccess(source: 'stdio' | 'http'): AuthContext {
  return {
    tier: 'free',
    cards: [...ALL_CARDS],
    source,
    reason: 'the whole suite is free — no licence key, account, or purchase required'
  };
}
