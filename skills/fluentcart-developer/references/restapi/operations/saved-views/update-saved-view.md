# PUT Update Saved View

## `PUT /saved-views/{id}`

**PUT Update Saved View**

Update a saved view. Only the fields present in the request body are changed — omit a field to leave it untouched.

Only the **creator** may update a view. `object_type` is not sent for this route; the policy resolves it by looking the record up from the ID in the URL.

**Permission:** varies by the view's stored `object_type` · **Policy:** `SavedViewsPolicy`

- **operationId:** `updateSavedView`
- **tags:** Saved Views

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | ID of the saved view. |

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "maxLength": 50,
      "description": "New display name, 50 characters or fewer."
    },
    "description": {
      "type": "string"
    },
    "is_public": {
      "type": "boolean"
    },
    "query_params": {
      "type": "object",
      "properties": {
        "filter_type": {
          "type": "string",
          "description": "Filter mode, e.g. `simple` or `advanced`."
        },
        "advanced_filters": {
          "type": "string",
          "description": "JSON-encoded advanced filter groups. Invalid JSON is stored as `[[]]`."
        },
        "search": {
          "type": "string",
          "description": "Free-text search term."
        },
        "active_view": {
          "type": "string",
          "description": "Active tab on the table."
        }
      },
      "example": {
        "filter_type": "advanced",
        "advanced_filters": "[[{\"source\":\"order\",\"property\":\"status\",\"operator\":\"=\",\"value\":\"completed\"}]]",
        "search": "",
        "active_view": "all"
      }
    }
  },
  "example": {
    "name": "Unfulfilled orders (EU)",
    "is_public": true
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | The authenticated user is not the creator of this view. A `rest_forbidden` response with the same status is returned earlier by the policy when the user lacks the table capability or the record does not exist. |
| `404` | View not found. |
| `422` | Validation failed — `name` was sent empty or longer than 50 characters. |
