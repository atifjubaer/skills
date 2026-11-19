# PUT Save Print Templates

## `PUT /templates/print-templates`

**PUT Save Print Templates**

Save customized print templates. Each template's content is sanitized with wp_kses_post before saving.

**Access policy:** `AdminPolicy` — requires the `is_super_admin` FluentCart capability.

- **operationId:** `savePrintTemplates`
- **tags:** Dashboard

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "templates"
  ],
  "properties": {
    "templates": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "key",
          "content"
        ],
        "properties": {
          "key": {
            "type": "string",
            "description": "Template identifier (e.g., invoice_template, packing_slip)"
          },
          "content": {
            "type": "string",
            "description": "HTML template content with shortcodes"
          }
        }
      }
    }
  },
  "example": {
    "templates": [
      {
        "key": "invoice_template",
        "content": "<html><body><h1>Invoice #{order_id}</h1>...</body></html>"
      }
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
