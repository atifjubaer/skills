# Fastr Devices for FluentCart — Tables and Endpoints

The add-on creates five tables of its own and serves eight custom endpoints.
None of these are FluentCart core — they exist only while the add-on is active.

All tables use the WordPress prefix plus `fastr_`, e.g. `wp_fastr_usage` on a
default install. `fc_get_db_schema` searches this file and the core schema
reference together.

---

## Tables

### `fastr_releases`

Release registry for self-hosted software updates. One row per
product/platform/channel/version.

| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED AI | Primary key |
| `product_id` | BIGINT UNSIGNED | FluentCart product the release belongs to |
| `platform` | VARCHAR(20) | `any` by default; e.g. `windows`, `macos`, `linux` |
| `channel` | VARCHAR(20) | `stable` by default |
| `version` | VARCHAR(50) | |
| `file_path` | VARCHAR(255) | Path to the package |
| `file_size` | BIGINT UNSIGNED | Bytes |
| `checksum_sha256` | CHAR(64) | Verified when `fastr_update/require_digest` is on |
| `signature` | TEXT | Detached signature |
| `min_version` | VARCHAR(50) | Minimum installable version |
| `changelog` | LONGTEXT | |
| `is_current` | TINYINT UNSIGNED | Default `1` |
| `download_count` | BIGINT UNSIGNED | Default `0` |
| `published_at` | DATETIME | |
| `created_at` | DATETIME | |

Unique key: `(product_id, platform, channel, version)`. Lookup index:
`(product_id, platform, channel, is_current)`.

### `fastr_trial_registry`

Trial fingerprints. The one-per-machine enforcement record.

| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED AI | Primary key |
| `fingerprint_hash` | CHAR(64) | Hashed device fingerprint — never the raw value |
| `fingerprint_algo` | VARCHAR(16) | `v1` by default |
| `product_id` | BIGINT UNSIGNED | |
| `scope_key` | BIGINT UNSIGNED | `0` for store-wide trials, otherwise the product ID |
| `first_license_id` | BIGINT UNSIGNED | |
| `first_customer_id` | BIGINT UNSIGNED | |
| `first_order_id` | BIGINT UNSIGNED | |
| `first_seen_at` | DATETIME | |
| `last_seen_at` | DATETIME | |
| `last_ip_hash` | CHAR(64) | Hashed, not raw |
| `ip_prefix` | VARCHAR(64) | Coarse prefix for abuse signals |
| `country` | CHAR(2) | ISO code |
| `email_hash` | CHAR(64) | |
| `risk_score` | TINYINT UNSIGNED | 0–100; compared against `fastr_trial/block_score` |
| `risk_flags` | VARCHAR(191) | |
| `status` | VARCHAR(20) | `trialed` by default |
| `reset_by` | BIGINT UNSIGNED | Admin user who cleared it |
| `reset_at` | DATETIME | |
| `notes` | TEXT | |

Unique key: `(fingerprint_hash, scope_key)` — this is what makes a trial
one-per-machine rather than one-per-email.

### `fastr_usage`

Metered usage, one row per reported increment.

| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED AI | Primary key |
| `license_id` | BIGINT UNSIGNED | |
| `metric` | VARCHAR(60) | e.g. `exports`, `api_calls` |
| `quantity` | BIGINT UNSIGNED | Default `0` |
| `period_key` | CHAR(7) | `YYYY-MM` bucket used for quota windows |
| `idempotency_key` | VARCHAR(100) | Client-supplied; makes reporting safe to retry |
| `site_url` | VARCHAR(191) | |
| `occurred_at` | DATETIME | When it happened on the client |
| `created_at` | DATETIME | When the server recorded it |

Unique key: `(license_id, metric, idempotency_key)` — a retried report with the
same key is dropped rather than double-counted.

### `fastr_webhooks`

Outbound webhook endpoints.

| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED AI | Primary key |
| `url` | VARCHAR(255) | |
| `secret` | VARCHAR(100) | HMAC signing secret |
| `events` | TEXT | Subscribed event names, `all` to receive everything |
| `is_active` | TINYINT UNSIGNED | Default `1` |
| `created_at` / `updated_at` | DATETIME | |

### `fastr_webhook_deliveries`

The delivery queue and its retry state.

| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED AI | Primary key |
| `webhook_id` | BIGINT UNSIGNED | FK to `fastr_webhooks` |
| `event` | VARCHAR(60) | |
| `payload` | LONGTEXT | Signed JSON body |
| `status_code` | INT | HTTP status from the last attempt |
| `response` | TEXT | Response body |
| `attempts` | INT UNSIGNED | Default `0` |
| `next_attempt_at` | DATETIME | Backoff schedule |
| `created_at` | DATETIME | |
| `delivered_at` | DATETIME | NULL until delivered |

Index `due (delivered_at, next_attempt_at)` drives the retry worker.

---

## Endpoints

The add-on does not register REST routes. It hangs custom verbs on FluentCart's
own dispatcher, so the URL shape is FluentCart's:

```
https://store.example.com/?fluent-cart=<verb>
```

| Verb | Purpose |
|---|---|
| `fastr_capabilities` | Report which add-on features are enabled and their limits |
| `fastr_license_public_key` | Serve the RS256 public key clients verify offline tokens with |
| `fastr_release_latest` | Latest release metadata for a product/platform/channel |
| `fastr_release_download` | Signed, short-lived download URL for a release package |
| `fastr_trial_eligibility` | Pre-checkout trial check; returns a signed token |
| `fastr_usage_report` | Record a metered usage increment (idempotent) |
| `fastr_usage_summary` | Read current usage against quota |

Plus the three FluentCart core verbs the add-on hooks into:
`activate_license`, `check_license`, `deactivate_license`.

Refusal codes these endpoints return are part of the client contract:
`trial_already_used`, `trial_fingerprint_required`, `trial_device_mismatch`.
