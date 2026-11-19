# POST Login

## `POST /user/login`

**POST Login**

Authenticate a user during the checkout process. On success, sets the WordPress authentication cookie and returns a redirect URL to the customer profile page.

**Access policy:** `PublicPolicy`

**Access policy:** `PublicPolicy`

- **operationId:** `userLogin`
- **tags:** Checkout

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `X-WP-Nonce` | header | yes | string | WordPress REST API nonce for `wp_rest` action. Required to prevent CSRF attacks |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "user_login",
    "password"
  ],
  "properties": {
    "user_login": {
      "type": "string",
      "description": "WordPress username or email address"
    },
    "password": {
      "type": "string",
      "description": "Account password"
    },
    "remember_me": {
      "type": "string",
      "enum": [
        "on"
      ],
      "description": "Set to `on` to persist the login session (\"Remember Me\"). Default: not remembered"
    }
  },
  "example": {
    "user_login": "john@example.com",
    "password": "securepassword123",
    "remember_me": "on"
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Login successful. Returns redirect URL. |
| `400` | Missing required fields. |
| `401` | Invalid credentials. |
| `403` | Invalid security nonce. |
| `422` | Validation failed, or the referenced record does not exist. |
