# POST Update Label Selections

## `POST /labels/update-label-selections`

**POST Update Label Selections**

Update the labels attached to a specific entity. This endpoint syncs the label assignments -- labels in `selectedLabels` are attached, and previously attached labels not in the list are detached.

**Required permission:** `labels/manage`

- **operationId:** `updateLabelSelections`
- **tags:** Labels

### Request body

`application/json`

```json
{
  "$ref": "#/components/schemas/UpdateLabelSelectionsRequest"
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Labels updated successfully. |
| `400` | Failed to update labels. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`labels/manage`). |
| `422` | Validation failed, or the referenced record does not exist. |
