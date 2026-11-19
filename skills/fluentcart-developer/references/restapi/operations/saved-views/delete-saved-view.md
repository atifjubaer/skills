# DELETE Delete Saved View

## `DELETE /saved-views/{id}`

**DELETE Delete Saved View**

Permanently delete a saved view. Only the **creator** may delete it.

**Permission:** varies by the view's stored `object_type` · **Policy:** `SavedViewsPolicy`

- **operationId:** `deleteSavedView`
- **tags:** Saved Views

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | ID of the saved view. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | The authenticated user is not the creator of this view. |
| `404` | View not found. |
