# POST Create All Pages

## `POST /onboarding/create-pages`

**POST Create All Pages**

Create all required store pages (shop, checkout, customer profile, etc.) in bulk. Skips pages that already have valid page IDs assigned. After creation, returns the updated onboarding settings.

**Access policy:** `AdminPolicy` — requires the `is_super_admin` FluentCart capability.

- **operationId:** `createAllPages`
- **tags:** Dashboard

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response - returns updated onboarding settings |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
