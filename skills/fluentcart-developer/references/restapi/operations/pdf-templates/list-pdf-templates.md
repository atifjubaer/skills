# GET List PDF Templates

## `GET /settings/pdf-templates/receipt`

**GET List PDF Templates**

Retrieve every receipt PDF template, merged with the PDF engine status. Legacy templates are migrated to the current block format on read.

**Permission:** `is_super_admin` (`manage_options`) · **Policy:** `StoreSensitivePolicy`

- **operationId:** `listPdfTemplates`
- **tags:** PDF Templates

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | Forbidden — the user is not a super admin. |
