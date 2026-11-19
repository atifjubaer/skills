# DELETE Delete Activity

## `DELETE /activity/{id}`

**DELETE Delete Activity**

Delete a specific activity log entry.

**Access policy:** `AdminPolicy` — requires the `is_super_admin` FluentCart capability.

- **operationId:** `deleteActivity`
- **tags:** Dashboard

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The activity log entry ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `404` | Activity not found |
| `422` | Validation failed, or the referenced record does not exist. |
