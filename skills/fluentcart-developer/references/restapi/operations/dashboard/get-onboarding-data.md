# GET Get Onboarding Data

## `GET /dashboard`

**GET Get Onboarding Data**

Retrieve the onboarding checklist with completion status for each setup step. Used to display the getting-started wizard on the dashboard.

**Access policy:** `AdminPolicy` — requires the `is_super_admin` FluentCart capability.

- **operationId:** `getOnboardingData`
- **tags:** Dashboard

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
