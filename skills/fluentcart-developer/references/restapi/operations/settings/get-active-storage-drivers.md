# GET Get Active Storage Drivers

## `GET /settings/storage-drivers/active-drivers`

**GET Get Active Storage Drivers**

Retrieve only the currently active/enabled file storage drivers.

**Required permission:** `is_super_admin`

- **operationId:** `getActiveStorageDrivers`
- **tags:** Settings

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`is_super_admin`). |
