# POST Save Shipping Packages

## `POST /shipping/packages`

**POST Save Shipping Packages**

Replace the store's full list of shipping packages. The list is capped at 50 entries; each entry is sanitized server-side (unknown `type`/unit values fall back to defaults, `height` is forced to null for `envelope` packages, and duplicate slugs are automatically suffixed).

**Access policy:** `StoreSensitivePolicy`

**Access policy:** `StoreSensitivePolicy`

- **operationId:** `savePackages`
- **tags:** Shipping

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "packages"
  ],
  "properties": {
    "packages": {
      "type": "array",
      "description": "Full replacement list of packages (max 50). Non-array values are treated as an empty list.",
      "items": {
        "type": "object",
        "properties": {
          "slug": {
            "type": "string",
            "description": "Optional; derived from name if omitted."
          },
          "name": {
            "type": "string"
          },
          "type": {
            "type": "string",
            "enum": [
              "box",
              "envelope",
              "soft_package"
            ]
          },
          "length": {
            "type": "number"
          },
          "width": {
            "type": "number"
          },
          "height": {
            "type": "number",
            "nullable": true,
            "description": "Ignored (forced to null) for `envelope` type."
          },
          "dimension_unit": {
            "type": "string",
            "enum": [
              "cm",
              "mm",
              "in",
              "m"
            ]
          },
          "weight": {
            "type": "number"
          },
          "weight_unit": {
            "type": "string",
            "enum": [
              "kg",
              "g",
              "lbs",
              "oz"
            ]
          },
          "is_default": {
            "type": "boolean"
          }
        }
      }
    }
  },
  "example": {
    "packages": [
      {
        "name": "Small Box",
        "type": "box",
        "length": 20,
        "width": 15,
        "height": 10,
        "dimension_unit": "cm",
        "weight": 0.5,
        "weight_unit": "kg",
        "is_default": true
      }
    ]
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response. Returns the sanitized, persisted package list. |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
| `422` | Validation failed, or the referenced record does not exist. |
