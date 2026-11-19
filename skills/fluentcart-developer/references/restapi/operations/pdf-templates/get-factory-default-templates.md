# GET Get Factory Default Templates

## `GET /settings/pdf-templates/factory-default`

**GET Get Factory Default Templates**

Retrieve the pristine, shipped templates, ignoring any saved customisations. Use this to power a "reset to default" action — diff or overwrite the saved template with what this returns.

**Permission:** `is_super_admin` (`manage_options`) · **Policy:** `StoreSensitivePolicy`

- **operationId:** `getFactoryDefaultPdfTemplates`
- **tags:** PDF Templates

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | Forbidden — the user is not a super admin. |
