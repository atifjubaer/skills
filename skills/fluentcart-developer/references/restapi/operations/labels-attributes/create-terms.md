# POST Create Attribute Terms

## `POST /options/attr/group/{group_id}/terms`

**POST Create Attribute Terms**

Create up to 10 terms at once inside an attribute group (e.g. add "Red", "Blue" to a "Color" group). Term slugs are unique per group, not globally — the same term title can exist in two different groups. If the group's type is "color", every term requires a valid hex `settings.color`; if it is "image", every term requires a `settings.image` URL.

**Required permission:** `products/create`

- **operationId:** `createTerms`
- **tags:** Labels & Attributes

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `group_id` | path | yes | integer | ID of the attribute group to add terms to. |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "terms"
  ],
  "properties": {
    "terms": {
      "type": "array",
      "description": "1-10 terms to create.",
      "items": {
        "type": "object",
        "required": [
          "title"
        ],
        "properties": {
          "title": {
            "type": "string",
            "maxLength": 50,
            "description": "Term title."
          },
          "settings": {
            "type": "object",
            "description": "Required shape depends on the group's type.",
            "properties": {
              "color": {
                "type": "string",
                "description": "Required hex color (#rgb or #rrggbb) for color-type groups."
              },
              "image": {
                "type": "string",
                "format": "uri",
                "description": "Required image URL for image-type groups."
              }
            }
          }
        }
      }
    }
  },
  "example": {
    "terms": [
      {
        "title": "Red",
        "settings": {
          "color": "#e53e3e"
        }
      },
      {
        "title": "Blue",
        "settings": {
          "color": "#3182ce"
        }
      }
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Terms created successfully. |
| `401` | Unauthenticated. |
| `403` | The authenticated user lacks the products/create permission. |
| `422` | No terms supplied, more than 10 terms supplied, a term is missing its title, or a term is missing the color/image its group type requires. |
