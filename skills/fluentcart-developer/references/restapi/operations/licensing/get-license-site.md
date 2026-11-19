# GET Get License Site

## `GET /licensing/sites/{id}`

**GET Get License Site**

Retrieve one site with its paginated activation history, plus the customers and orders referenced by those activations.

Activations are ordered newest first. Note the response nests a **hand-built** pagination object under `activations` (only `data`, `total`, `per_page`, `current_page`, `last_page`) rather than the full paginator used elsewhere.

**Permission:** `licenses/view` · **Policy:** `LicensePolicy`

- **operationId:** `getLicenseSite`
- **tags:** Licensing

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | ID of the license site. |
| `per_page` | query | no | integer | Activations per page. Clamped into the 1–100 range (default: 15). |
| `page` | query | no | integer | Page number of the activation history. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | Forbidden — the user lacks `licenses/view`. |
| `404` | No license site matches that ID. |
