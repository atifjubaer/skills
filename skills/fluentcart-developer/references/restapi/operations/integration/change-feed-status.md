# POST Change Feed Status

## `POST /integration/global-feeds/change-status/{integration_id}`

**POST Change Feed Status**

Toggle a global integration feed on or off without modifying its configuration.

**Required permission:** `integrations/manage`

- **operationId:** `changeFeedStatus`
- **tags:** Integrations

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `integration_id` | path | yes | integer | The feed ID to update |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "status"
  ],
  "properties": {
    "status": {
      "type": "string",
      "description": "New status: `yes` (enable) or `no` (disable)",
      "enum": [
        "yes",
        "no"
      ],
      "example": "no"
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`integrations/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
