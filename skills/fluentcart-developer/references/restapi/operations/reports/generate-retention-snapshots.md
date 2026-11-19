# POST Generate Retention Snapshots

## `POST /reports/retention-snapshots/generate`

**POST Generate Retention Snapshots**

Starts a rebuild of the retention snapshots table that the cohort report reads. The request takes a lock, plans the steps and returns a `token`. It does not build any rows. Call `POST /reports/retention-snapshots/step` with the `token` until the response has `done: true`.

Only one build runs at a time. If another build holds the lock, the response is HTTP 200 with `success: false` and `code: "already_running"`. A lock that nobody steps expires after 5 minutes. The current snapshots stay in place until the last step publishes the new ones.

The request takes no parameters. A `product_id` is ignored: every product is rebuilt.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `generateRetentionSnapshots`
- **tags:** Reports

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
