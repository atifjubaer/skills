# POST Update Long Description Editor Mode

## `POST /products/{postId}/update-long-desc-editor-mode`

**POST Update Long Description Editor Mode**

Switch the long description editor between modes (e.g., visual, code).

**Required permission:** `products/edit`

- **operationId:** `updateLongDescEditorMode`
- **tags:** Products

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `postId` | path | yes | integer | The product post ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "active_editor"
  ],
  "properties": {
    "active_editor": {
      "type": "string",
      "description": "The editor mode to set"
    }
  },
  "example": {
    "active_editor": "visual"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/edit`). |
| `422` | Validation failed, or the referenced record does not exist. |
