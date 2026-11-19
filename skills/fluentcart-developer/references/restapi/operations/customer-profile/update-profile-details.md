# POST Update Profile Details

## `POST /customer-profile/update`

**POST Update Profile Details**

Update the authenticated customer's profile name. Also updates the associated WordPress user's first_name, last_name, and display_name.

**Access policy:** `CustomerFrontendPolicy`

**Access policy:** `CustomerFrontendPolicy`

- **operationId:** `updateProfileDetails`
- **tags:** Customer Profile

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "email"
  ],
  "properties": {
    "first_name": {
      "type": "string",
      "maxLength": 255,
      "description": "Customer first name. Max 255 characters."
    },
    "last_name": {
      "type": "string",
      "maxLength": 255,
      "description": "Customer last name. Max 255 characters."
    },
    "email": {
      "type": "string",
      "description": "Customer email address. Must be valid."
    },
    "current_password": {
      "type": "string",
      "description": "Current password (for password change flow)"
    },
    "new_password": {
      "type": "string",
      "description": "New password (for password change flow)"
    },
    "confirm_new_password": {
      "type": "string",
      "description": "Confirm new password (for password change flow)"
    }
  },
  "example": {
    "first_name": "John",
    "last_name": "Smith",
    "email": "john@example.com"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Profile updated. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Not logged in or customer not found. |
| `422` | Validation failed, or the referenced record does not exist. |
