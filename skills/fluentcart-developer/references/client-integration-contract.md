<!-- Source: docs/CLIENT-CONTRACT.md in the Fastr Devices workspace, mirrored for the fluentcart-developer skill. -->

# FluentCart Licence Client Contract

**The single document for integrating any application with a FluentCart Pro store that runs Fastr Devices.**

Read this first. It contains every endpoint, every error code, every response field and the flows that use them. The other documents in `docs/` explain *why*; this one explains *what to build*.

Language-agnostic. The only requirement is an HTTP client and, for offline tokens, an RS256 verifier.

---

## 0. Discover the server

Before anything else, ask the store what it supports:

```http
GET https://store.example.com/?fluent-cart=fastr_capabilities
```

```json
{
  "plugin": "fastr-devices-for-fluentcart",
  "version": "1.10.0",
  "features": { "device_identity": true, "trial_registry": true, "offline_token": true, "usage_metering": true },
  "endpoints": { "activate": { "url": "...", "method": "POST", "auth": "license_key" } },
  "error_types": { "trial_already_used": { "status": 422, "meaning": "..." } },
  "license_token": { "alg": "RS256", "ttl_seconds": 259200, "public_key_url": "..." }
}
```

Cache it for the session. If `features.offline_token` is false, skip token verification and rely on the heartbeat.

---

## 1. Two identifiers you must generate and keep

| Value | Format | Lifetime | Where to store it |
|---|---|---|---|
| **instance id** | `device://<uuid4>` | forever, per install | OS keychain / registry / config |
| **device fingerprint** | `v1\|MACHINEID=…\|UUID=…\|DISK=…` | recomputed each launch | nowhere — send it, do not persist |

The instance id is `site_url` in every call. It identifies the install.
The fingerprint identifies the *machine*. It is what makes a trial once-per-machine and a seat limit hold.

Rules:

- Generate the instance id once, on first run. Never rotate it on update — rotation burns a seat.
- The fingerprint must survive app updates, OS point updates and network changes. It may change on OS reinstall or disk replacement; that is a support reset, not a bug.
- On desktop, persist the instance id in three places and require two to agree (keyring, config file, registry value).

---

## 2. The five flows

### 2.1 Trial eligibility — before you offer a trial

```http
POST /?fluent-cart=fastr_trial_eligibility
    product_id=14
    device_fingerprint=v1|MACHINEID=...|UUID=...
    email=customer@example.com        (optional, feeds risk scoring)
```

```json
{ "eligible": true, "reason": "ok", "risk_score": 0, "flags": [],
  "token": "…", "token_expires_at": 1793723400, "success": true }
```

If `eligible` is false, **do not show a trial button**. `reason` is one of `trial_already_used`, `high_risk`, `rate_limited`, `invalid_request`.

The returned `token` is a single-use receipt for your checkout flow, verified **server-side in PHP** with `Fastr_Trial_Eligibility::verify_token()`. There is no client-side verification endpoint; do not attempt to validate it in a desktop app.

### 2.2 Activate — first run, or after the user enters a key

```http
POST /?fluent-cart=activate_license
    item_id=14
    license_key=FCT-...
    site_url=device://8f3a...
    device_fingerprint=v1|MACHINEID=...|UUID=...|DISK=...
    device_name=ATIF-WORKSTATION
    device_type=Desktop (Tauri)
    os=windows x86_64
    arch=x86_64
    cpu=AMD Ryzen 9 5900X
    ram_gb=32
    email=customer@example.com         (recommended)
    server_version=1.4.0
    is_virtual=0                       (1 for a VM; recorded, never blocked)
```

Success:

```json
{ "status": "valid", "activation_hash": "…", "activation_limit": "3", "activations_count": 1,
  "expiration_date": "2027-11-03 12:00:00", "is_lifetime": false,
  "expires_in_days": 365, "expires_in_seconds": 31536000, "grace_period_days": 15,
  "entitlements": [14, 22],
  "license_token": "eyJhbGciOiJSUzI1NiIs…", "license_token_expires_at": 1793980800,
  "license_token_kid": "2bded3143e76a3cc", "license_token_alg": "RS256",
  "license_public_key_url": "https://store.example.com/?fluent-cart=fastr_license_public_key",
  "server_time": "2026-11-04T03:14:25Z", "server_time_unix": 1793723665,
  "success": true }
```

Persist: `activation_hash`, `license_token`, `license_token_expires_at`, `entitlements`.

`grace_period_days` (15 by default) is how long the **licence** stays usable after `expiration_date` — a renewal safety margin enforced by the store. It is not the token grace in §4; the two are independent.

### 2.3 Heartbeat — every launch and every 12 hours

```http
POST /?fluent-cart=check_license
    item_id=14
    license_key=FCT-...
    site_url=device://8f3a...
    device_fingerprint=v1|MACHINEID=...|UUID=...
```

Returns the same shape as activation. Use it to refresh `license_token` and `entitlements`, and to learn about revocation.

**The offline token is renewed by any successful heartbeat.** Refresh when less than 24 hours of token life remain, or on every launch — whichever is cheaper for your app.

If the merchant marked the licence **floating**, the seat is reclaimed when no heartbeat arrives within its TTL. Heartbeat well inside it; 12 hours is the recommended default. `fastr_capabilities` returns `heartbeat.recommended_seconds`.

### 2.4 Release a seat — when the user uninstalls or moves machines

```http
POST /?fluent-cart=deactivate_license
    item_id=14
    license_key=FCT-...
    site_url=device://8f3a...
```

### 2.5 Check for updates

```http
GET /?fluent-cart=fastr_release_latest
    product_id=14&platform=windows&channel=stable&current_version=1.4.0&license_key=FCT-...
```

```json
{ "update": true, "version": "1.5.0", "size": 2694,
  "checksum_sha256": "…", "signature": "", "min_version": "1.0.0",
  "changelog": "…",
  "download_url": "https://store.example.com/?fluent-cart=fastr_release_download&token=…",
  "token_expires_at": 1793721900, "success": true }
```

When current: `{"update": false, "version": "1.4.0", "latest_version": "1.4.0"}`.

Download the URL **within five minutes**; it is bound to the release and the licence. Verify `sha256` before installing.

### 2.6 Transfer a licence to a new owner (merchant-side)

```bash
wp fastr-license transfer <license> --to-email=newowner@example.com --clear-activations
```

Transferring without `--clear-activations` leaves the previous owner's machines licensed. Use it on a resale or team change: the old machines' next heartbeat returns `invalid_activation` (HTTP 200, `success:true`) and they must activate again under the new owner.

---

## 3. Error handling — read this twice

Most failures are `HTTP 4xx` with `success: false` and an `error_type`. **Two FluentCart-core errors are not**:

| `error_type` | HTTP | `success` | What to do |
|---|---|---|---|
| `trial_already_used` | 422 | false | Show purchase page |
| `trial_fingerprint_required` | 422 | false | Client is out of date |
| `trial_device_mismatch` | 422 | false | Treat as unlicensed |
| `activation_limit_exceeded` | 422 | false | Offer deactivation or upgrade |
| `device_blocked` | 422 | false | Support contact |
| `rate_limited` | 429 | false | Honour `Retry-After` |
| `invalid_license` / `license_expired` | 403 | false | Unlicensed |
| `not_entitled` | 403 | false | This product is not in the licence |
| `invalid_token` / `token_expired` | 403 | false | Request a new download URL |
| `key_mismatch` | **200** | **true** | Wrong product — treat as invalid |
| `invalid_activation` | **200** | **true** | No activation for this `site_url` — activate first |

**The rule that survives both conventions:** treat the licence as valid only when `status == "valid"`. Do not branch on `success` alone, and do not branch on the HTTP status alone.

Other codes you may see: `license_not_found` (422, key unknown to FluentCart), `no_release` (404, nothing published for that platform), `file_missing` (404, the artifact vanished from storage), `invalid_request` (422, a required parameter is missing), `invalid_period` (422, period not `YYYY-MM`), `quantity_too_large` (422, usage above 1,000,000 in one call), `registry_unavailable` (503, a plugin table is missing — load wp-admin once), `license_unavailable` (403, FluentCart licensing could not load).

---

## 4. Offline token

A compact JWS. Header `{"alg":"RS256","typ":"JWT","kid":"…"}`, claims:

```json
{ "iss": "fastr-license", "lic": 4812, "sub": "88", "prod": 14,
  "ent": [14, 22], "ins": "device://8f3a...", "fp": "fp_6cd2ecfd020b1fa7",
  "seats": 3, "used": 1, "st": "active",
  "iat": 1793721600, "nbf": 1793721600, "exp": 1793980800, "grace": 1794931200,
  "jti": "9f2c..." }
```

Verify, in this order:

1. Split on `.` — must be three parts.
2. Signature: `RS256(header.payload)` against the PEM from `license_public_key_url`. Cache the PEM; keys rotate rarely and `kid` tells you when.
3. `ins` must equal this install's instance id.
4. `fp` must equal the fingerprint hint you stored at activation.
5. `prod` or `ent` must contain the product you are running.
6. `exp` in the future → licensed. Between `exp` and `grace` → licensed but **must** heartbeat successfully before `grace`.
7. Past `grace` → unlicensed.

**Do not trust the local clock for expiry.** Compare against `server_time_unix` from the last successful response: if the machine's clock differs from the server by more than a day, refuse to run and ask the user to fix it.

Revocation reaches you at the next heartbeat, not instantly. That is the bargain of offline operation.

---

## 5. Entitlements

A licence may cover several products. `entitlements` is the list of product IDs it may run. A build whose product id is not in that list is not licensed, even if the key is valid.

Activate with the bundle's own `item_id`; check with whichever entitled product you are running.

---

## 6. Usage metering

```http
POST /?fluent-cart=fastr_usage_report
    license_key=FCT-...&metric=renders&quantity=60&idempotency_key=<uuid>
```

Send a stable `idempotency_key` per unit of work, or a retry will double-count. The response returns `used`, `limit` and `over_limit`. Over-limit usage is recorded, not rejected — decide in your own UI whether to block.

Read totals with `?fluent-cart=fastr_usage_summary`.

---

## 7. Server-to-merchant webhooks (not your client's concern)

If you are the merchant: the store POSTs `license.activated`, `license.expired`, `license.seat_limit`, `trial.blocked`, `usage.reported` and others. Verify with:

```
X-Fastr-Signature: t=1793721848,v1=<hex>
expected = HMAC_SHA256(secret, t + "." + rawBody)
```

Compare in constant time. Reject timestamps older than five minutes.

---

## 8. Minimum viable client — the checklist

- [ ] Generate and persist a `device://` instance id on first run
- [ ] Build a `v1|…` fingerprint from stable machine identifiers
- [ ] Call `fastr_trial_eligibility` before offering a trial
- [ ] Call `activate_license` with both identifiers and an email
- [ ] Store `license_token`, `entitlements`, `activation_hash`
- [ ] Verify the token offline on every launch
- [ ] Heartbeat on launch and every 12 hours; refresh the token
- [ ] Treat `status != "valid"` as unlicensed, whatever `success` says
- [ ] Call `deactivate_license` when the user removes the app
- [ ] Check `fastr_release_latest` on launch, verify sha256, then install
- [ ] Handle `rate_limited` by backing off, not retrying immediately
- [ ] Never trust the local clock for expiry

If every box is ticked, the client behaves correctly against every store running this plugin.

---

## 9. Reference by language

| Language | Where |
|---|---|
| WordPress plugin | `docs/PITCHBOARD-AND-SPECIFICATION.md` |
| Tauri/Rust, Python, Chrome MV3, C++/JUCE | generated by `fc_generate_device_licensing_boilerplate` and `fc_generate_trial_guard_boilerplate` in the `fluentcart-developer` MCP server |
| Everything else | this document; the contract is plain HTTP and one RS256 verification |

## Verifying the licence token before trusting it

`activate` and `check` both return a signed RS256 `license_token`. Verifying the
signature proves the store issued it and that it has not expired. It does **not**
prove the token was issued for this machine or this product — a token copied from
another customer passes a signature check.

Every generated client ships an `entitlement()` helper that finishes the job:

| Check | Claim | Refusal reason |
|---|---|---|
| Signature and expiry | `exp` | `invalid_or_expired` |
| Correct product | `prod` | `wrong_product` |
| This installation | `ins` | `wrong_install` |

`ins` is the install id you send as `site_url`. `fp` is an HMAC the server
computes with its own salt — a client cannot recompute it, so it is not
checkable locally and the helpers do not pretend otherwise.

Gate the app on `entitlement()`, never on the mere presence of a token. The
server's `check` stays the authority for seat enforcement; the token is offline
grace bounded by the server's own expiry.
