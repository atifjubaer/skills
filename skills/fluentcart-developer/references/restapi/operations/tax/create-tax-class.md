# POST Create Tax Class

## `POST /tax/classes`

**POST Create Tax Class**

Create a new tax class. A unique slug is auto-generated from the title. Pass slug "reduced" or "zero" to create one of the built-in classes (title is then set automatically). A maximum of 6 tax classes is allowed; the built-in "standard" class always exists and cannot be deleted.

**Required permission:** `store/sensitive`

- **operationId:** `createTaxClass`
- **tags:** Tax

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "title"
  ],
  "properties": {
    "title": {
      "type": "string",
      "maxLength": 30,
      "description": "Tax class title (max 30 characters). Required unless a built-in slug is passed",
      "example": "Digital Goods"
    },
    "slug": {
      "type": "string",
      "description": "Optional. Pass a built-in slug (reduced or zero) to create that built-in class; otherwise the slug is auto-generated from the title",
      "example": ""
    }
  },
  "example": {
    "title": "Digital Goods"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Tax class created successfully. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/sensitive`). |
| `422` | Title exceeds 30 characters. |
| `423` | Limit reached, missing title, or duplicate class. Returned when 6 classes already exist, the title is missing, or a class with the same slug already exists. |
