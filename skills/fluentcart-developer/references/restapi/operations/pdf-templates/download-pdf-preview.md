# POST Download PDF Preview

## `POST /settings/pdf-templates/download`

**POST Download PDF Preview**

Render a **test** PDF for a template and return it base64-encoded — no file is written and no URL is issued; decode `pdf_base64` client-side.

The sample is built from a real order: the most recent order that has an invoice number, falling back to the most recent order of any kind. The generated file is deleted from disk immediately after encoding.

Requires the Fluent PDF plugin — check `GET /settings/pdf-templates/status` first.

**Permission:** `is_super_admin` (`manage_options`) · **Policy:** `StoreSensitivePolicy`

- **operationId:** `downloadPdfPreview`
- **tags:** PDF Templates

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "template_id": {
      "type": "string",
      "default": "order_receipt",
      "description": "Slug of the template to render."
    }
  },
  "example": {
    "template_id": "order_receipt"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | Forbidden — the user is not a super admin. |
| `422` | Fluent PDF is not active, the template does not exist, the store has no orders to sample, or rendering failed. All four return 422 — inspect `message` to tell them apart. Rendering failures are also written to the activity log. |
