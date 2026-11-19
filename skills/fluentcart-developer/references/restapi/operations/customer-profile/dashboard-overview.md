# GET Dashboard Overview

## `GET /customer-profile`

**GET Dashboard Overview**

Retrieve the customer's dashboard overview including the 5 most recent orders. This is the landing page data for the customer portal.

**Access policy:** `CustomerFrontendPolicy`

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `dashboardOverview`
- **tags:** Customer Profile

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns dashboard data with recent orders. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
