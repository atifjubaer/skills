# DELETE Delete PDF Template

## `DELETE /settings/pdf-templates/delete/{template_id}`

**DELETE Delete PDF Template**

Delete a custom receipt template. The four built-in templates (`is_default: true`) are protected and cannot be deleted.

**Permission:** `is_super_admin` (`manage_options`) · **Policy:** `StoreSensitivePolicy`

- **operationId:** `deletePdfTemplate`
- **tags:** PDF Templates

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `template_id` | path | yes | string | Slug of the custom template to delete. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | Forbidden — the user is not a super admin. |
| `422` | The template does not exist, is a protected built-in, or the delete failed. All three return 422. |
