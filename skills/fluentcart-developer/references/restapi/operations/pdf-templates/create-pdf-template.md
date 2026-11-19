# POST Create PDF Template

## `POST /settings/pdf-templates/create`

**POST Create PDF Template**

Create a new custom receipt template. The slug is derived from the title and returned as `slug`; use it for subsequent get/save/delete calls.

**Permission:** `is_super_admin` (`manage_options`) · **Policy:** `StoreSensitivePolicy`

- **operationId:** `createPdfTemplate`
- **tags:** PDF Templates

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Display title for the new template. Required."
    }
  },
  "required": [
    "title"
  ],
  "example": {
    "title": "Wholesale Invoice"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | Forbidden — the user is not a super admin. |
| `422` | `title` was empty. |
