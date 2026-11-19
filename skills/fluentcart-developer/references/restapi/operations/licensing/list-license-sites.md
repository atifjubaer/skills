# GET List License Sites

## `GET /licensing/sites`

**GET List License Sites**

Retrieve a paginated list of every site that has activated a license, enriched with the products licensed there, the owning customers, whether any activation is a local/dev install, and the most recent activation activity.

Activations are batch-loaded per page, so the enrichment costs one extra query regardless of page size.

**Permission:** `licenses/view` · **Policy:** `LicensePolicy`

- **operationId:** `listLicenseSites`
- **tags:** Licensing

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `page` | query | no | integer | Page number for pagination. |
| `per_page` | query | no | integer | Records per page (default: 10). |
| `search` | query | no | string | Search term matched against the site URL. |
| `sort_by` | query | no | string | Column to sort by. |
| `sort_type` | query | no | string | Sort direction. |
| `filter_type` | query | no | string | Filter mode. |
| `advanced_filters` | query | no | string | JSON-encoded array of advanced filter groups. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | Forbidden — the user lacks `licenses/view`. |
