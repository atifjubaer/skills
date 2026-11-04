# Universal Software Licensing & Hardware Tracking

Comprehensive reference for licensing **non-WordPress software** against FluentCart Pro: desktop applications, browser extensions, audio plugins (VST3/AU/AAX), CLI tools, and Electron/Tauri apps. Covers `device://` identifiers, activation payloads, clock-tampering defence, pre-computed expiry, native device display in the admin, and customer self-service deactivation.

The WordPress-plugin path is documented separately in [software-licensing-sdk.md](software-licensing-sdk.md). This file is the one to read when the product does **not** run inside WordPress.

---

## 1. The idea: a device is just a "site"

FluentCart's licensing module was built for WordPress plugins, so every activation row in `fct_license_sites` describes "a site that activated a key". Nothing in the schema requires that site to be a URL — the `site_url` field is a string.

Non-WordPress products therefore activate exactly like a plugin does, sending a **stable device identifier** in the `site_url` field:

```text
device://550e8400-e29b-41d4-a716-446655440000
```

Everything downstream — seat limits, deactivation, expiry, the customer portal — works unchanged. The only difference is presentation: a `device://` row has no domain to link to, so it is rendered as a device name plus platform rather than a clickable URL.

| Concept | WordPress plugin | Desktop / extension / VST |
|---|---|---|
| Identity sent as `site_url` | `https://customer-site.com` | `device://<uuid-v4>` |
| Where it is stored | `fct_license_sites.site_url` | same column, same table |
| Seat counting | one site = one seat | one install = one seat |
| Display | domain link | device name + OS badge |
| Deactivation | customer portal, or plugin admin | customer portal, or in-app "Deactivate" |

---

## 2. Public licensing endpoints

All three are non-REST query-string endpoints on the store root. They are public by design — a distributed client must not ship a master API key.

| Action | Method | Path | Purpose |
|---|---|---|---|
| Activate | `POST` | `/?fluent-cart=activate_license` | Bind a device to a license key |
| Check | `POST` | `/?fluent-cart=check_license` | Re-validate an existing activation |
| Deactivate | `POST` | `/?fluent-cart=deactivate_license` | Free the seat |

### Activation payload

```http
POST https://store.example.com/?fluent-cart=activate_license
Content-Type: application/x-www-form-urlencoded

license_key=ABCD-1234-EFGH-5678
&item_id=42
&site_url=device%3A%2F%2F550e8400-e29b-41d4-a716-446655440000
&platform=macos
&app_version=1.4.0
&device_name=Atif%27s%20MacBook%20Pro
```

| Field | Required | Notes |
|---|---|---|
| `license_key` | yes | The key the customer received. Trim whitespace before sending. |
| `item_id` | yes | Product ID in FluentCart. A key for another product must be rejected. |
| `site_url` | yes | `device://<uuid>`. Must be **stable across app restarts** — see §3. |
| `platform` | recommended | `windows` / `macos` / `linux` / `chrome-extension`. Shown in the admin list. |
| `app_version` | recommended | Lets you spot activations from builds you no longer support. |
| `device_name` | optional | Human label for the admin and portal. Defaults to the platform if omitted. |

### Response

```json
{
  "status": "valid",
  "license_key": "ABCD-1234-EFGH-5678",
  "variation_id": 123,
  "variation_title": "Studio License — 3 devices",
  "expires": "2027-04-30 23:59:59",
  "expires_in_days": 181,
  "server_time_unix": 1793512800,
  "activation_hash": "e3b0c44298fc1c149afbf4c8996fb924",
  "message": "License activated successfully"
}
```

Status values: `valid`, `active`, `invalid`, `disabled`, `unregistered`, `expired`, `error`. Treat `valid` and `active` as the only pass states; everything else is a refusal whose `message` is safe to show the user.

---

## 3. Device identity: generating and persisting the UUID

A seat is only meaningful if the identifier survives a reboot. Rules:

1. **Generate once, on first run** — `uuid::Uuid::new_v4()` / `crypto.randomUUID()` / `uuid.uuid4()`.
2. **Persist in the OS credential store** when available (Keychain, Credential Manager, libsecret), falling back to an app-config file.
3. **Never derive it from hardware serial numbers or MAC addresses.** They change with network adapters and docks, and reading them looks like spyware to users and to antivirus vendors.
4. **Never rotate it on update.** Rotating the id burns a seat and locks the customer out at their limit.

### Recommended storage per platform

| Platform | Primary | Fallback |
|---|---|---|
| Tauri / Rust | `keyring` crate (`SERVICE`, `device-id`) | JSON file in `app_config_dir()` |
| Chrome MV3 | `chrome.storage.local` (survives restarts, syncs nothing) | — |
| Python | `keyring` module | `~/.config/<app>/license.json` |
| C++ / JUCE | `juce::PropertiesFile` | `Application Support/<app>.licence` |

> **Chrome MV3 caveat:** service workers are killed after ~30 seconds idle, so a module-level variable is *not* persistence. The device id and the cached verdict must both live in `chrome.storage.local`.

---

## 4. Clock tampering: trust `server_time_unix`, not the machine

A distributed client holds a cached "licensed until X" answer, and a user can move the system clock backwards to keep it valid past expiry. Any expiry logic that reads the local clock directly is trivially bypassed.

Two defences, both required:

### 4.1 Pre-computed expiry (`expires_in_days`)

The server returns how many whole days remain. The client compares that integer — it never parses `expires` and never subtracts dates locally.

```text
expires_in_days >= 0   → still inside the paid period
expires_in_days <  0   → expired, regardless of what the local clock says
missing (null)         → lifetime licence
```

Parsing `expires` on the client is fine for *display*, never for the decision: the string has no timezone, and the local clock it would be compared against is exactly what the attacker controls.

### 4.2 Server-time baseline

Every response carries `server_time_unix`. On each successful call the client stores **two** values together:

```json
{
  "server_time_unix": 1793512800,
  "checked_at_local": 1793512795
}
```

On the next check, before trusting any cached verdict:

```text
elapsed = now_local - checked_at_local
if (elapsed < -TOLERANCE)  →  the clock moved backwards → treat as tampered
```

A tolerance of **5 minutes** absorbs DST changes, NTP corrections, and timezone travel without letting a real rollback through. Store the pair atomically — a `server_time_unix` written without its matching `checked_at_local` cannot be used for this comparison.

> **Do not** try to detect a *forward* jump. Users legitimately fix a wrong clock, and forward jumps only hurt the user (they shorten the remaining grace). Only backwards movement enables a bypass.

### 4.3 Offline grace

A laptop on a plane must not lose its licence. Keep the last successful verdict, and let it stand for a grace window (7 days is typical) measured with the same clock guard. Once the window passes, require a successful online check.

| Situation | Behaviour |
|---|---|
| Online, valid | Refresh state, reset the grace window |
| Offline, inside grace | Honour the cached verdict |
| Offline, past grace | Refuse, with a "connect to the internet to verify" message |
| Clock moved backwards | Refuse immediately, with a distinct message |

---

## 5. Anti-piracy posture: what client-side checks can and cannot do

Be explicit with the customer-facing team about this, because it shapes expectations.

- A licence check in a distributed binary is **a speed bump, not a lock**. Any determined user can patch it out.
- What it genuinely buys you: seat enforcement (an honest customer with 4 devices on a 3-seat licence gets told), renewals that actually lapse, and a support signal when a key is shared.
- Therefore: **never** put destructive behaviour behind a failed check (no data deletion, no file encryption, no silent feature sabotage). Deactivation should degrade to read-only or a nag, never to data loss.
- Ship the check on a background thread. A blocked audio thread or a frozen UI costs more in refunds than the piracy it prevents.

---

## 6. Admin display: `fct_license_sites` and the "other" bucket

Each activation is a row in `fct_license_sites`:

| Column | Example for a device | Notes |
|---|---|---|
| `license_id` | `17` | FK to `fct_licenses` |
| `site_url` | `device://550e8400-…` | The full identifier, scheme included |
| `activation_hash` | `e3b0c442…` | Server-generated; return it to the client and echo it back on check |
| `is_local` | `0` | Must be `0` — a device consumes a seat |
| `status` | `active` | `active` / `deactivated` |
| `other` | `{"platform":"macos","device_name":"Atif's MacBook Pro","app_version":"1.4.0"}` | JSON blob for device metadata |

The **Fastr Devices** add-on reads rows whose `site_url` matches `^device://` and renders them natively:

- a device icon plus `device_name` instead of a clickable domain,
- an OS badge from `other.platform`,
- the app version from `other.app_version` (flagged when it is behind the current release),
- a **Deactivate** button per row that calls the standard admin endpoint.

Rows that do **not** start with `device://` are left untouched and keep the normal domain rendering, so WordPress plugins and desktop apps can share one licence and one admin list.

> **Never store the raw license key in `other`.** That column is displayed in the admin UI and included in exports.

---

## 7. Customer self-service deactivation

A customer who sold a laptop must be able to free the seat without opening a support ticket. Three surfaces, all writing to the same endpoint:

1. **Customer portal** — `POST /customer-profile/licenses/{key}/deactivate_site` with the activation id. Already available in core; device rows appear there like any other activation.
2. **In-app "Deactivate this device"** — calls `/?fluent-cart=deactivate_license` with `license_key` + `site_url`, then clears local state. Must be reachable even when the licence is expired, or the user can never recover a seat.
3. **Admin** — the row-level button in the Devices panel.

```php
// Server-side helper if you need to free a seat programmatically.
use FluentCart\App\Models\LicenseSite;

LicenseSite::where('site_url', 'device://550e8400-…')
    ->where('license_id', $licenseId)
    ->update(['status' => 'deactivated', 'updated_at' => current_time('mysql')]);
```

Always confirm the local clear succeeded *and* the remote call was attempted. If the remote call fails, tell the user plainly — a silently half-deactivated device burns a seat on their next activation.

---

## 8. Platform-specific gotchas

| Platform | Gotcha |
|---|---|
| **Tauri** | Add the store domain to `tauri.conf.json → app.security.csp` (`connect-src`), or the POST is blocked before it leaves the app. |
| **Chrome MV3** | A `fetch` from the service worker needs the store origin in `host_permissions`, not just `permissions`. Missing it fails with a generic `TypeError: Failed to fetch`. |
| **Python** | `keyring` on headless Linux needs a Secret Service daemon; expect `NoKeyringError` and fall back to the file. |
| **C++ / JUCE** | Call `isLicensed()` from the message thread and cache the result in an atomic. Never call it, or any HTTP, from `processBlock()`. |
| **Any platform** | URL-encode `device://` — the `:` and `/` break form parsing when left raw. |

---

## 9. End-to-end test checklist

Before shipping a build:

- [ ] Fresh install activates and the row appears in `fct_license_sites` with `is_local = 0`.
- [ ] Restarting the app reuses the same `device://` id (no new seat burned).
- [ ] Activating one device past the seat limit returns a clear refusal, not a generic error.
- [ ] Moving the system clock back 1 day blocks the licence with the "clock changed" message.
- [ ] Moving it back 2 minutes still works (tolerance is working).
- [ ] Going offline keeps the licence for the grace window, then refuses.
- [ ] Deactivating frees the seat and the licence can be re-activated on a different device.
- [ ] An expired licence can still reach the Deactivate button.
- [ ] The admin list renders the device name and OS badge, alongside any `https://` rows on the same licence.
