# GET Get Profile Details

## `GET /customer-profile/profile`

**GET Get Profile Details**

Retrieve the authenticated customer's profile details including name, email, and associated addresses. If the logged-in user does not yet have a customer record, basic WordPress user data is returned instead.

**Access policy:** `CustomerFrontendPolicy`

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `getProfileDetails`
- **tags:** Customer Profile

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns profile data with addresses. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
