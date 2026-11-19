# POST Run Pending Data Backfills

## `POST /data-backfills/run`

**POST Run Pending Data Backfills**

Run pending one-shot data backfills within this request's execution budget. The admin app silently re-calls this endpoint while the returned status is `running`; a status of `locked` means another request is already processing backfills.

**Access policy:** `AdminPolicy`

- **operationId:** `run`
- **tags:** Dashboard

### Responses

| Status | Description |
| --- | --- |
| `200` | Backfill processing status after this request's budget was spent. |
| `401` | Unauthenticated. |
| `403` | The authenticated user is not an admin. |
| `422` | Validation failed, or the referenced record does not exist. |
