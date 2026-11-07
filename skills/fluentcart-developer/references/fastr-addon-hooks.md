# Fastr Devices for FluentCart — Action & Filter Reference

Every hook the **Fastr Devices for FluentCart** add-on fires or exposes. These are
not FluentCart core hooks — they belong to the add-on and only exist when it is
active. All names use a slash namespace (`fastr_domain/verb`) rather than the
WordPress underscore convention.

Actions are things you listen to. Filters are things you change.

---

## Licence lifecycle

| Hook | Type | Signature | Fires when |
|---|---|---|---|
| `fastr_license/transferred` | action | `( $license, array $payload )` | A licence is moved to a different customer or site. |
| `fastr_license/seat_released` | action | `( $license, array $payload )` | One seat is freed on deactivation. |
| `fastr_license/seats_reclaimed` | action | `( $license, array $payload )` | Seats are reclaimed in bulk, usually after an expiry sweep. |

Each also dispatches the matching outbound webhook (`license.transferred`,
`license.seat_released`, `license.seat_reclaimed`), so a listener here sees the
event even when no webhook endpoint is configured.

---

## Devices and seats

| Hook | Type | Signature | Default | Notes |
|---|---|---|---|---|
| `fastr_device/blocked` | action | `( array $payload )` | — | An activation was refused by the device repository. |
| `fastr_seat/blocked` | action | `( $license, array $payload, string $siteUrl )` | — | The seat limit was reached; the activation is denied. |
| `fastr_trust_proxy_headers` | filter | `( bool $trust, string $remote )` | private IPs trusted | Whether `X-Forwarded-For` is honoured when resolving the client IP. Return `true` behind Cloudflare or a load balancer; leave `false` otherwise or clients can spoof their address. |

`fastr_seat/blocked` fires before the response is sent, so a listener can log the
attempt without altering the outcome.

---

## Trial system

| Hook | Type | Signature | Default | Fires when / Controls |
|---|---|---|---|---|
| `fastr_trial/granted` | action | `( $license, array $result )` | — | A trial licence was issued. |
| `fastr_trial/reset` | action | `( string $hash, int $scopeKey, int $adminId )` | — | An administrator clears a trial fingerprint so the machine can trial again. |
| `fastr_trial/scope` | filter | `( string $scope, $license )` | `'product'` | Whether a trial is consumed per product (`product`) or store-wide (`global`). |
| `fastr_trial/require_fingerprint` | filter | `( bool $require, $license )` | `true` | Refuse activation when no `device_fingerprint` was supplied. Turning this off re-opens trial abuse. |
| `fastr_trial/is_trial_license` | filter | `( bool $isTrial, $license )` | derived | Override how a licence is classified as a trial. |
| `fastr_trial/block_score` | filter | `( int $threshold, int $productId )` | `101` | Risk score at or above which eligibility is refused. `101` means never block. |
| `fastr_trial/risk_score` | filter | `( int $score, int $productId, array $data )` | computed, clamped 0–100 | Adjust the abuse score before it is compared to `fastr_trial/block_score`. |
| `fastr_trial/rate_limit` | filter | `( int $limit )` | class constant | Eligibility lookups allowed per window per IP. |

Refusal codes returned to clients: `trial_already_used`,
`trial_fingerprint_required`, `trial_device_mismatch`. They are not
configurable — a client matches on them.

---

## Offline tokens and entitlements

| Hook | Type | Signature | Default | Notes |
|---|---|---|---|---|
| `fastr_token/ttl` | filter | `( int $seconds )` | `72 * 3600` | Lifetime of the signed offline licence token. |
| `fastr_token/grace` | filter | `( int $seconds )` | `15 * 86400` | How long past expiry a cached token is still accepted offline. |
| `fastr_entitlements/products` | filter | `( array $ids, $license )` | from the licence | Which product IDs the licence unlocks. |

Both token values are reported to clients in the activation response, so a
client reads the effective value rather than assuming the default.

---

## Rate limiting

| Hook | Type | Signature | Default | Notes |
|---|---|---|---|---|
| `fastr_rate_limit/enabled` | filter | `( bool $enabled )` | `true` | Master switch. `false` disables every limiter. |
| `fastr_rate_limit/ip` | filter | `( int $perMinute )` | `60` | Requests per minute per IP. |
| `fastr_rate_limit/key` | filter | `( int $perMinute )` | `30` | Requests per minute per licence key. |
| `fastr_rate_limit/blocked` | action | `( string $scope )` | — | A request was rejected; `$scope` names the limiter that fired. |

---

## Usage metering

| Hook | Type | Signature | Default | Notes |
|---|---|---|---|---|
| `fastr_usage/limit` | filter | `( int $limit, $license, string $metric )` | from the product | Quota per metric. Return `0` for unlimited. |
| `fastr_usage/metrics` | filter | `( array $metrics, $license )` | registered metrics | Add or remove metered metrics for a licence. |

---

## Webhooks

| Hook | Type | Signature | Default | Notes |
|---|---|---|---|---|
| `fastr_webhooks/payload` | filter | `( array $data, string $event )` | built payload | Rewrite the JSON body before signing. Changing it after signing breaks HMAC verification. |
| `fastr_webhooks/delivered` | action | `( $row, $endpoint, int $code )` | — | A delivery succeeded. |
| `fastr_webhooks/failed` | action | `( $row, int $attempts, int $code )` | — | A delivery failed and was recorded. |
| `fastr_webhooks/timeout` | filter | `( int $seconds )` | `3` | Request timeout per delivery attempt. |
| `fastr_webhooks/sslverify` | filter | `( bool $verify )` | `true` | TLS verification. Never return `false` in production — it silently makes delivery interceptable. |

---

## Releases and self-updates

| Hook | Type | Signature | Default | Notes |
|---|---|---|---|---|
| `fastr_release/token_ttl` | filter | `( int $seconds )` | class constant | Lifetime of a signed download token. |
| `fastr_update/repo` | filter | `( string $repo )` | `DIST_REPO` | Repository the self-updater reads releases from. |
| `fastr_update/release` | filter | `( array $release )` | parsed body | Rewrite release metadata before the updater uses it. |
| `fastr_update/require_digest` | filter | `( bool $require, $package )` | `false` | Require a matching SHA-256 digest on downloaded packages. Enable this — unsigned updates are the weakest link in a licensing system. |

---

## Data retention

| Hook | Type | Signature | Default | Notes |
|---|---|---|---|---|
| `fastr_retention/delivery_days` | filter | `( int $days )` | class constant | How long webhook delivery records are kept. |
| `fastr_retention/usage_months` | filter | `( int $months )` | class constant | How long usage records are kept. |
| `fastr_retention/pruned` | action | `( array $report )` | — | A retention sweep finished; `$report` lists what was removed. |

---

## Where these belong

The add-on also *consumes* FluentCart core filters on the activation path. Those
are documented in the core hook references, not here — the priority chain is:

```
fluent_cart/license/activate_license_response
  device-repository (10) → trial-guard (20) → entitlements + offline-token (25)
  → seat-guard (30) → webhooks (50)
```

Use `fc_search_hooks` for the core hooks and this file for the add-on's own.
