# GET Get EU VAT Product Overrides

## `GET /tax/configuration/settings/eu-vat/product-overrides`

**GET Get EU VAT Product Overrides**

Retrieve product category tax overrides for all EU countries, plus every EU tax rate that has a shipping tax override set. class_id and class_label are appended to each row for convenience.

**Required permission:** `store/settings`

- **operationId:** `getEuVatProductOverrides`
- **tags:** Tax

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns EU product category overrides and shipping overrides. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`store/settings`). |
