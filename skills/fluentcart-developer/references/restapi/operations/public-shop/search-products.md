# GET Search Products

## `GET /public/product-search`

**GET Search Products**

Search for published products by title and return server-rendered HTML search result items. Designed for use with the storefront search bar component.

**Access policy:** `PublicPolicy`

**Access policy:** `PublicPolicy`

- **operationId:** `searchProducts`
- **tags:** Public Shop

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `post_title` | query | yes | string | The search query string to match against product titles |
| `url_mode` | query | no | string | URL mode passed to the SearchBarRenderer to control how product links are generated |
| `termId` | query | no | integer | Filter search results to products within a specific taxonomy term (category) ID |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
