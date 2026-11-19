# GET Get Store Digest Settings

## `GET /email-notification/digest-settings`

**GET Get Store Digest Settings**

Retrieve the store's digest email settings — the recurring summary email(s) sent to store admins on a daily, weekly, and/or monthly cadence.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `getDigestSettings`
- **tags:** Email Notifications

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the current store digest settings. |
| `401` | Unauthenticated. |
| `403` | The authenticated user lacks store-sensitive access. |
