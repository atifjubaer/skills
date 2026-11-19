# POST Save Onboarding Settings

## `POST /onboarding`

**POST Save Onboarding Settings**

Save store settings during the onboarding process. Merges submitted values with existing store settings. If a category value is provided, dummy products are created asynchronously.

**Access policy:** `AdminPolicy` — requires the `is_super_admin` FluentCart capability.

- **operationId:** `saveOnboardingSettings`
- **tags:** Dashboard

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "store_name": {
      "type": "string",
      "description": "The store name"
    },
    "store_logo": {
      "type": "string",
      "description": "URL of the store logo"
    },
    "currency": {
      "type": "string",
      "description": "Store currency code (e.g., USD, EUR)"
    },
    "category": {
      "type": "string",
      "description": "Product category for generating dummy products. Excluded from saved settings but triggers async dummy product creation."
    }
  },
  "example": {
    "store_name": "My Awesome Store",
    "store_logo": "https://example.com/wp-content/uploads/logo.png",
    "currency": "USD"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation error |
