# GET List All Storage Drivers

## `GET /settings/storage-drivers`

**GET List All Storage Drivers**

Retrieve all registered file storage drivers and their current status.

**Required permission:** `is_super_admin`

- **operationId:** `listAllStorageDrivers`
- **tags:** Settings

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability (`is_super_admin`). |
