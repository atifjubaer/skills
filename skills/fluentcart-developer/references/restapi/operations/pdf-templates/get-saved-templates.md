# GET Get Saved Templates

## `GET /settings/pdf-templates/saved`

**GET Get Saved Templates**

Retrieve the currently saved templates, falling back to the defaults where nothing has been saved. Legacy templates are migrated on read.

This returns the same `templates` map as `GET /settings/pdf-templates/receipt` but without the PDF engine status fields.

**Permission:** `is_super_admin` (`manage_options`) · **Policy:** `StoreSensitivePolicy`

- **operationId:** `getSavedPdfTemplates`
- **tags:** PDF Templates

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | Forbidden — the user is not a super admin. |
