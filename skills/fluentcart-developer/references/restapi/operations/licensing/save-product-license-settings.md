# POST Save Product License Settings

## `POST /licensing/products/{id}/settings`

**POST Save Product License Settings**

Update the license configuration for a specific product.

**Permission:** `licenses/manage` · **Policy:** `LicensePolicy`

- **operationId:** `saveProductLicenseSettings`
- **tags:** Licensing

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | yes | integer | The product ID |

### Request body

`application/json`

```json
{
  "type": "object",
  "required": [
    "settings"
  ],
  "properties": {
    "settings": {
      "type": "object",
      "required": [
        "enabled",
        "variations"
      ],
      "properties": {
        "enabled": {
          "type": "string",
          "enum": [
            "yes",
            "no"
          ],
          "description": "Enable licensing: `yes` or `no`"
        },
        "version": {
          "type": "string",
          "description": "Software version (required when `enabled` is `yes`)"
        },
        "global_update_file": {
          "type": "string",
          "description": "ID of the downloadable file to use for auto-updates"
        },
        "prefix": {
          "type": "string",
          "description": "License key prefix"
        },
        "variations": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "variation_id",
              "validity"
            ],
            "properties": {
              "variation_id": {
                "type": "integer",
                "description": "The variation ID"
              },
              "activation_limit": {
                "oneOf": [
                  {
                    "type": "integer"
                  },
                  {
                    "type": "string"
                  }
                ],
                "description": "Max site activations (empty or 0 = unlimited, must be >= 0)"
              },
              "validity": {
                "type": "object",
                "properties": {
                  "unit": {
                    "type": "string",
                    "enum": [
                      "day",
                      "week",
                      "month",
                      "year",
                      "lifetime"
                    ],
                    "description": "Validity unit (required when `enabled` is `yes`)"
                  },
                  "value": {
                    "type": "integer",
                    "description": "Number of validity units (default: 1)"
                  }
                }
              }
            }
          }
        },
        "wp": {
          "type": "object",
          "description": "WordPress update API settings",
          "properties": {
            "is_wp": {
              "type": "string",
              "enum": [
                "yes",
                "no"
              ],
              "description": "Whether this is a WordPress plugin/theme"
            },
            "readme_url": {
              "type": "string",
              "description": "URL to the changelog/readme page"
            },
            "banner_url": {
              "type": "string",
              "description": "URL to the plugin banner image"
            },
            "icon_url": {
              "type": "string",
              "description": "URL to the plugin icon"
            },
            "required_php": {
              "type": "string",
              "description": "Minimum required PHP version"
            },
            "required_wp": {
              "type": "string",
              "description": "Minimum required WordPress version"
            }
          }
        },
        "changelog": {
          "type": "string",
          "description": "HTML changelog content"
        },
        "license_keys": {
          "type": "string",
          "description": "Pre-defined license keys"
        }
      }
    }
  },
  "example": {
    "settings": {
      "enabled": "yes",
      "version": "1.3.0",
      "global_update_file": "file_abc123",
      "variations": [
        {
          "variation_id": 15,
          "activation_limit": 1,
          "validity": {
            "unit": "year",
            "value": 1
          }
        },
        {
          "variation_id": 16,
          "activation_limit": "",
          "validity": {
            "unit": "lifetime",
            "value": 1
          }
        }
      ],
      "wp": {
        "is_wp": "yes",
        "readme_url": "https://example.com/changelog",
        "banner_url": "https://example.com/banner.png",
        "icon_url": "https://example.com/icon.png",
        "required_php": "7.4",
        "required_wp": "5.6"
      },
      "changelog": "<h4>1.3.0</h4><ul><li>Performance improvements</li></ul>",
      "license_keys": ""
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `422` | Validation error or bundle product |
