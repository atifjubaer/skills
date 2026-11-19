# GET Fetch Taxonomy Terms

## `GET /products/fetch-term`

**GET Fetch Taxonomy Terms**

Retrieve all registered taxonomies and their terms for product categorization.

**Required permission:** `products/view`

- **operationId:** `fetchTaxonomyTerms`
- **tags:** Products

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`products/view`). |
