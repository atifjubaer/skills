# POST Create Single Page

## `POST /onboarding/create-page`

**POST Create Single Page**

Create a single store page (e.g., shop, checkout, customer profile) and optionally save the page ID to store settings.

**Access policy:** `AdminPolicy` — requires the `is_super_admin` FluentCart capability.

- **operationId:** `createSinglePage`
- **tags:** Dashboard

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "content",
    "page_name"
  ],
  "properties": {
    "content": {
      "type": "string",
      "description": "The page key identifier with _page_id suffix (e.g., shop_page_id, checkout_page_id, customer_profile_page_id)"
    },
    "page_name": {
      "type": "string",
      "description": "The title for the new WordPress page"
    },
    "save_settings": {
      "type": "boolean",
      "description": "Whether to save the new page ID to store settings. When true, also flushes rewrite rules.",
      "default": false
    }
  },
  "example": {
    "content": "shop_page_id",
    "page_name": "Shop",
    "save_settings": true
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Error response |
