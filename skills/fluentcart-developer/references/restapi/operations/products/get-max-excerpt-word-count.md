# GET Get Max Excerpt Word Count

## `GET /products/get-max-excerpt-word-count`

**GET Get Max Excerpt Word Count**

Returns the maximum allowed word count for product excerpts (controlled by the WordPress excerpt_length filter).

**Required permission:** `products/view`

- **operationId:** `getMaxExcerptWordCount`
- **tags:** Products

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
