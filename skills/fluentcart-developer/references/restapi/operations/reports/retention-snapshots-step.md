# POST Retention Snapshot Step

## `POST /reports/retention-snapshots/step`

**POST Retention Snapshot Step**

Runs the next step of the build that `POST /reports/retention-snapshots/generate` started. Send the `token` from the generate response. Each step builds one range of customer IDs into a build table and returns `done: false`. The last step publishes the build in place of the old snapshots, releases the lock and returns `done: true` with `message` and `stats` (`total_records`, `unique_cohorts`, `unique_periods`, `unique_products`).

Call this endpoint in a loop until `done` is `true` or `success` is `false`. Errors return HTTP 200 with `success: false` and a `code`:

- `no_build`: no build is running. Call generate again.
- `already_running`: the `token` does not match the running build.
- `failed`: the step threw an error. The build stops and the lock is released. The old snapshots stay.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `retentionSnapshotStep`
- **tags:** Reports

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "token"
  ],
  "properties": {
    "token": {
      "type": "string",
      "description": "The `token` from the generate response."
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
