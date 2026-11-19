# GET Get Bucket List

## `GET /files/bucket-list`

**GET Get Bucket List**

Retrieve the list of available storage buckets for a given driver. Useful for cloud storage drivers (e.g., S3) that organize files into buckets.

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `getBucketList`
- **tags:** Files

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `driver` | query | no | string | Storage driver to query (default: uses the first active driver). |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns default bucket and list of available buckets. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
