# GET Get Shipping Packages

## `GET /shipping/packages`

**GET Get Shipping Packages**

List the store's configured shipping packages (boxes, envelopes, and soft packages used for rate calculation).

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `getPackages`
- **tags:** Shipping

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the configured shipping packages. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
