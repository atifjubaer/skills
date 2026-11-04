# Trial Abuse Prevention & Device Tracking (FluentCart Pro)

How to make a free trial one-per-machine instead of one-per-email, and how to keep a license key from being shared mid-trial.

This reference assumes the **Fastr Devices for FluentCart** add-on (v1.3.0+) is installed alongside FluentCart Pro. It is the device layer that FluentCart itself does not ship.

---

## 1. Why FluentCart trials leak

FluentCart's native trial is **account-scoped**:

| Mechanism | Where it lives |
|---|---|
| Trial length | `fct_product_variations.other_info.trial_days` |
| Trial state | `fct_subscriptions.status = 'trialing'` (`Status::SUBSCRIPTION_TRIALING`) |
| License expiry | `LicenseHelper::getExpirationDateByVariation()` — a trial *replaces* the first billing cycle |

Nothing in that chain knows about the computer. Create a second account, buy the trial variation again, get a second trial. On a desktop app or Chrome extension, that is the whole abuse story.

The fix is a **machine registry** that outlives the license, the order, and the customer.

---

## 2. The three gates

| Gate | Hook | Stops |
|---|---|---|
| **Eligibility** | `fluent_cart_action_fastr_trial_eligibility` (pre-checkout) | Customer reaching payment before learning they already had a trial |
| **Activation** | `fluent_cart/license/activate_license_response` (priority 20) | Second trial from a new account on the same machine |
| **Heartbeat** | `fluent_cart/license/check_license_response` (priority 20) | Copying a key to another machine mid-trial |

Priority 20 matters: `Fastr_Device_Repository::on_activate()` runs at 10 and has already written `site.other` by then.

### Failing open is deliberate

Every gate returns early when the registry table is missing, when the license is not a trial, or when a legacy client sends no fingerprint. **A schema upgrade must never break a paying customer.**

---

## 3. Registry schema

Table: `{$wpdb->prefix}fastr_trial_registry`

| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED PK | |
| `fingerprint_hash` | CHAR(64) | `hash_hmac('sha256', $raw, wp_salt('auth'))` |
| `fingerprint_algo` | VARCHAR(16) | `v1` |
| `product_id` | BIGINT UNSIGNED | 0 in global scope |
| `scope_key` | BIGINT UNSIGNED | `product_id`, or `0` for global |
| `first_license_id` | BIGINT UNSIGNED | Owner of the claim |
| `first_customer_id` | BIGINT UNSIGNED | |
| `first_order_id` | BIGINT UNSIGNED | |
| `first_seen_at` / `last_seen_at` | DATETIME | GMT |
| `last_ip_hash` | CHAR(64) | Hashed, never the raw address |
| `ip_prefix` | VARCHAR(64) | `/24` or `/64`, for collision scoring |
| `country` | CHAR(2) | |
| `email_hash` | CHAR(64) | Normalized email hash |
| `risk_score` | TINYINT UNSIGNED | 0–100 |
| `risk_flags` | VARCHAR(191) | Comma-separated |
| `status` | VARCHAR(20) | `trialed`, `reset` |
| `reset_by` / `reset_at` | | Support reset audit |
| `notes` | TEXT | e.g. `virtual_environment:VMware` |

**Unique key:** `(fingerprint_hash, scope_key)`.

`scope_key` exists because MySQL treats every `NULL` in a UNIQUE index as distinct — a nullable `product_id` would never enforce "one trial per machine" in global scope. Never make the unique column nullable.

**Scope** is per product by default:

```php
add_filter('fastr_trial/scope', fn() => 'global'); // one trial across the catalogue
```

### Why not `fct_license_sites.other`

`site.other` dies with the site row. Deleting the license, the order, or the customer must not erase the fact that a machine consumed a trial. The registry is independent for exactly that reason.

---

## 4. Fingerprints

### Tier A — desktop (Tauri/Rust, Python, C++/VST)

Collect and normalize, then join with `|`:

| Component | Windows | macOS | Linux |
|---|---|---|---|
| Machine ID | `HKLM\SOFTWARE\Microsoft\Cryptography\MachineGuid` | `IOPlatformUUID` (`ioreg`) | `/etc/machine-id` |
| Hardware UUID | SMBIOS `Win32_ComputerSystemProduct.UUID` | hardware serial | `/sys/class/dmi/id/product_uuid` |
| Disk serial | `GetVolumeInformation` for `C:` | `diskutil info` | `lsblk -no SERIAL` |
| CPU | brand string | `sysctl machdep.cpu.brand_string` | `/proc/cpuinfo` model name |

Prefix with `v1|`, uppercase, strip whitespace runs, sort keys.

**Stability contract:** must survive app updates, OS point updates, IP changes, and added hardware. May change on OS reinstall or disk replacement — that is a support reset, not abuse.

**Persistence:** write the computed value to three places and require two to agree — OS keyring, app config file, and (Windows) `HKCU\Software\<App>`. Deleting one does not reset identity.

**Never use the MAC address.** VPNs, docks, and randomisation break it.

### Tier B — Python/CLI

Same sources; `winreg` on Windows, `/etc/machine-id` on Linux, `ioreg` via subprocess on macOS.

### Tier C — Chrome extension (weak by nature)

`chrome.storage.local` install UUID + `chrome.runtime.id` + `navigator.hardwareConcurrency` + timezone + screen size.

A user can clear extension storage in five seconds. **Do not claim device binding for browser trials.** Lean on account signals: normalized email, Paddle payment instrument, IP subnet.

### Virtual machines

Cloned VMs share a fingerprint; fresh VMs do not. The add-on accepts `is_virtual` and `virtualization` and records them in `notes` and `site.other.environment`. It **never blocks** on them — otherwise every corporate VDI user is locked out. Review them manually.

---

## 5. Client contract

### 5a. Eligibility (before checkout)

```http
POST /?fluent-cart=fastr_trial_eligibility
Content-Type: application/x-www-form-urlencoded

product_id=14
&device_fingerprint=v1|MACHINEID=...|UUID=...|DISK=...
&email=customer@example.com
```

```json
{
  "eligible": true,
  "reason": "ok",
  "risk_score": 50,
  "flags": ["email_reused", "subnet_velocity"],
  "token": "...",
  "token_expires_at": 1793723400,
  "server_time": "2026-11-04T03:45:00Z",
  "server_time_unix": 1793721600,
  "success": true
}
```

| `reason` | HTTP | Meaning |
|---|---|---|
| `ok` | 200 | Eligible, token issued |
| `trial_already_used` | 200 | Machine already claimed a trial for this product |
| `high_risk` | 200 | Score crossed `fastr_trial/block_score` (off by default) |
| `invalid_request` | 422 | Missing `product_id` or `device_fingerprint` |
| `rate_limited` | 429 | More than 30 checks per hour per IP |
| `registry_unavailable` | 200 | Table missing; eligible, never blocks a sale |

The route is served through FluentCart's own `fluent_cart_action_*` dispatcher, so it behaves exactly like `?fluent-cart=activate_license`.

### 5b. Activation

```http
POST /?fluent-cart=activate_license

item_id=14
&license_key=FCT-...
&site_url=device://<uuid>
&device_fingerprint=v1|MACHINEID=...|UUID=...|DISK=...
&device_name=Workstation
&device_type=Desktop (Tauri)
&os=windows x86_64
&arch=x86_64
&cpu=AMD Ryzen 9 5900X
&ram_gb=32
&server_version=1.4.0
&email=customer@example.com
```

### 5c. Heartbeat

```http
POST /?fluent-cart=check_license
item_id=14
&license_key=FCT-...
&site_url=device://<uuid>
&device_fingerprint=v1|MACHINEID=...
```

### Error codes

| `error_type` | HTTP | Meaning | Client action |
|---|---|---|---|
| `trial_already_used` | 422 | Machine consumed its trial | Show purchase page |
| `trial_fingerprint_required` | 422 | Trial sent no fingerprint | Update the client |
| `trial_device_mismatch` | 422 | Key checked from a machine that never claimed it | Treat as unlicensed |
| `device_blocked` | 200 | Admin blocked this device | Contact support |
| `invalid_activation` | 200 | FluentCart has no activation for that `site_url` | Activate first |

Every refusal carries `success: false` and `server_time_unix`. FluentCart's `sendSuccessResponse()` forces `success = true` **after** the filter returns, so a filter callback must terminate with `wp_send_json($payload, 422)` to express a hard failure. Returning an array cannot.

---

## 6. Token verification

Tokens are single-use, 30 minutes, HMAC-SHA256 over `hash|product|expires|nonce` with `wp_salt('auth')`. The nonce is stored as a transient and deleted on first verify.

```php
$result = \Fastr_Trial_Eligibility::verify_token($token, $productId);

if ($result !== true) {
    // invalid_token | token_expired | token_used | token_product_mismatch
    wp_send_json(['message' => 'Trial verification failed', 'reason' => $result], 422);
}
```

A token presented for the wrong product is **not** consumed — the product check runs before the transient is read.

Tokens are advisory. Activation still enforces the registry, so a forged or replayed token cannot buy a second trial.

---

## 7. Risk scoring

| Signal | Points |
|---|---|
| Normalized email already in the registry | 30 |
| ≥2 trials from the same `/24` in 24 h | 20 |
| ≥5 trials from the same `/24` in 30 days | 25 |
| Virtual machine | 15 |

Cap 100. Stored at claim time as `email_hash`, `risk_score`, `risk_flags`.

**Heuristics never block by default.** `fastr_trial/block_score` defaults to 101. Opt in:

```php
add_filter('fastr_trial/block_score', fn() => 60);
```

Email normalization: lowercase, `googlemail.com` → `gmail.com`, strip dots from Gmail local parts, strip `+tags` everywhere.

```php
add_filter('fastr_trial/risk_score', fn($score, $productId, $data) => $score, 10, 3);
add_filter('fastr_trial/rate_limit', fn() => 60);
```

---

## 8. Operations

```bash
wp fastr-trial inspect <row-id|license-id|hash|raw-fingerprint>
wp fastr-trial reset <row-id|hash|raw-fingerprint> --yes
wp fastr-trial stats
```

A reset sets `status = reset`; the next activation on that machine re-arms the row and reassigns `first_license_id`.

Actions for automation:

| Hook | Fires |
|---|---|
| `fastr_trial/granted` | New claim, or a re-armed claim |
| `fastr_trial/blocked` | Activation refused (`$license, $payload, $code`) |
| `fastr_trial/mismatch` | Heartbeat refused |
| `fastr_trial/reset` | Support reset (`$hash, $scopeKey, $adminId`) |

Filters: `fastr_trial/scope`, `fastr_trial/require_fingerprint`, `fastr_trial/is_trial_license`, `fastr_trial/block_score`, `fastr_trial/risk_score`, `fastr_trial/rate_limit`.

---

## 9. Privacy

- Raw hardware identifiers are **never stored**. Only the HMAC.
- IP is stored as a hash plus a `/24` or `/64` prefix, never the full address.
- Retention: 24 months is a reasonable default; purge with a cron.
- Disclose in the store privacy policy: "We record a privacy-preserving device identifier to prevent repeated free trials."
- Paddle is Merchant of Record, but device data is the merchant's, so GDPR access and deletion requests hit this table.

---

## 10. What this cannot do

- A determined user can reinstall the OS or spoof SMBIOS. Nothing client-side prevents that.
- Browser extensions have no durable device identity; treat browser trials as account-bound.
- Corporate images and VDI collide. Manual review, not automatic denial.
- The realistic goal is raising the cost from "new email" to "reinstall Windows or edit firmware strings".

---

## 11. Test checklist

| # | Scenario | Expected |
|---|---|---|
| 1 | Fresh machine, new account | Trial granted |
| 2 | Same machine, second account, new trial licence | `trial_already_used` |
| 3 | Same machine, same account, reinstall | Granted |
| 4 | Trial key activated on a second machine | `trial_device_mismatch` on heartbeat |
| 5 | Support reset, then re-activate | Granted, row re-armed |
| 6 | Trial converts to paid | Gate stops applying |
| 7 | VM with a known UUID | Flagged, not denied |
| 8 | Client omits the fingerprint | `trial_fingerprint_required` |
| 9 | Chrome storage cleared | New fingerprint; account scoring decides |
| 10 | Clock rolled back after a block | Still blocked, `server_time_unix` present |
| 11 | Two products, same machine | Granted per product (product scope) |
| 12 | Registry row exists, licence deleted | Still blocks |

Staging verification of all of the above: `docs/TRIAL-GUARD-STAGING-TEST-REPORT.md` in the add-on workspace.
