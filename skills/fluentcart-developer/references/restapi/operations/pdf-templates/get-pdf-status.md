# GET Get PDF Status

## `GET /settings/pdf-templates/status`

**GET Get PDF Status**

Report whether the Fluent PDF engine is available. When it is not, the response carries the add-on's install/activate state so the UI can offer a one-click install.

PDF **generation** requires this to report `has_fluent_pdf: true`; template editing works without it.

**Permission:** `is_super_admin` (`manage_options`) · **Policy:** `StoreSensitivePolicy`

- **operationId:** `getPdfStatus`
- **tags:** PDF Templates

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | Forbidden — the user is not a super admin. |
