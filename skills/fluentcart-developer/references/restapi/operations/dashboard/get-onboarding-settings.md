# GET Get Onboarding Settings

## `GET /onboarding`

**GET Get Onboarding Settings**

Retrieve the current store settings, available pages, and currency options for the onboarding wizard.

**Access policy:** `AdminPolicy` — requires the `is_super_admin` FluentCart capability.

- **operationId:** `getOnboardingSettings`
- **tags:** Dashboard

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
