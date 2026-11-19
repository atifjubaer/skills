# GET Get Channel Rules

## `GET /reports/channel-rules`

**GET Get Channel Rules**

Returns the store's custom channel rules for the Sources report, its own domains, and whether the current user may change them. No money fields.

A rule matches when any of its groups matches; a group matches when all its conditions match. Rules are checked in order, before the built-in channels. A referrer on one of `own_domains` (or a subdomain) counts as direct. `can_edit` is true when the user has the `store/settings` permission.

**Requires FluentCart Pro.** Without Pro this route is not registered and returns 404.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `getChannelRules`
- **tags:** Reports

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
