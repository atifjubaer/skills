# GET Get Portal Sections

## `GET /customer-profile/sections`

**GET Get Portal Sections**

Return the add-on sections registered for one customer-portal surface. Each entry carries an uncompiled Vue component string plus its payload; the customer-portal SPA compiles it in the browser, since the SPA's route table is static and cannot otherwise be extended by add-ons.

**Access policy:** `CustomerFrontendPolicy`

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `getSections`
- **tags:** Customer Profile

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `filter` | query | yes | string | The portal section group to fetch. Must match one of the plugin's allowlisted portal section filters or the request is rejected with a 422. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the sections registered for the requested filter, or an empty array if the current user is not a customer. |
| `401` | Unauthenticated. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | The filter value is not a recognized portal section group. |
