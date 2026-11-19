# POST Save PDF Template

## `POST /settings/pdf-templates/receipt/{template_id}`

**POST Save PDF Template**

Persist the block structure of a receipt PDF template. The whole `pdf_structure` is replaced, so send the complete document rather than a partial edit.

**Permission:** `is_super_admin` (`manage_options`) · **Policy:** `StoreSensitivePolicy`

- **operationId:** `savePdfTemplate`
- **tags:** PDF Templates

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `template_id` | path | yes | string | Template slug to write to. |

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "pdf_structure": {
      "type": "object",
      "properties": {
        "content": {
          "type": "string",
          "description": "Gutenberg block markup for the receipt."
        }
      },
      "example": {
        "content": "<!-- wp:fluent-cart/receipt-header {\"title\":\"RECEIPT\"} /-->"
      }
    }
  },
  "required": [
    "pdf_structure"
  ]
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | Forbidden — the user is not a super admin. |
| `422` | `pdf_structure` was empty, or the write failed. |
