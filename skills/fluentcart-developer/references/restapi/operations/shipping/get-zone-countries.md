# GET Get Countries By Continent

## `GET /shipping/zone/countries`

**GET Get Countries By Continent**

List every country FluentCart recognizes, grouped by continent. Used to populate the region picker when creating or editing a shipping zone.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `getCountriesByContinent`
- **tags:** Shipping

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns countries grouped by continent. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
