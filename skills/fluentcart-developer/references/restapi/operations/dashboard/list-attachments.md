# GET List Attachments

## `GET /app/attachments`

**GET List Attachments**

Retrieve all image attachments from the WordPress media library. Used for the media picker in the admin interface.

**Access policy:** `AdminPolicy` — requires the `is_super_admin` FluentCart capability.

- **operationId:** `listAttachments`
- **tags:** Dashboard

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `404` | No images found |
