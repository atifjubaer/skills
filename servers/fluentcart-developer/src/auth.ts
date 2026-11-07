/**
 * This server is free and MIT-licensed: every tool is registered for every
 * caller on every transport. There is no tier to resolve, no licence key to
 * validate, and no outbound call to make before a session can work.
 *
 * `AuthContext` survives as a small descriptor of the session — which transport
 * a call arrived on — which is useful when diagnosing client configuration.
 */

export type CardId = 'fluentcart';

const ALL_CARDS: readonly CardId[] = ['fluentcart'];

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
    reason: 'this server is free — no licence key, account, or purchase required'
  };
}
