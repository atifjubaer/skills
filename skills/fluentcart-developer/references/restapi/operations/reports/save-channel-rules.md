# POST Save Channel Rules

## `POST /reports/channel-rules`

**POST Save Channel Rules**

Replaces the store's custom channel rules and own domains, then returns the saved values. Invalid rules, conditions and domains are dropped without an error.

Also needs the `store/settings` permission; without it the route returns 403. Limits: 20 rules, 5 groups per rule, 5 conditions per group, 20 domains. A rule needs a name (max 60 characters) and one valid condition. `field` is `source`, `medium`, `campaign` or `domain`; `operator` is `is`, `contains` or `starts_with`; `value` is lower-cased, max 100 characters (a pasted URL keeps only its host, without `www.`). Keep a rule's `id` (a-z, 0-9, max 12) to keep its channel history; a missing or repeated id gets a new one. A rule sent as `{name, conditions: [...]}` is read as one group.

**Requires FluentCart Pro.** Without Pro this route is not registered and returns 404.

**Permission:** `reports/view` · **Policy:** `ReportPolicy`

- **operationId:** `saveChannelRules`
- **tags:** Reports

### Request body

`application/json`

```json
{
  "type": "object",
  "properties": {
    "rules": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "example": [
        {
          "id": "a1b2c3d4",
          "name": "Partner newsletter",
          "groups": [
            [
              {
                "field": "source",
                "operator": "is",
                "value": "partner"
              },
              {
                "field": "medium",
                "operator": "is",
                "value": "email"
              }
            ]
          ]
        }
      ],
      "description": "Top-level. Rules: `{id?, name, groups: [[{field, operator, value}]]}`."
    },
    "own_domains": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "example": [
        "shop.example.com"
      ],
      "description": "Top-level. The store's own domains, e.g. `shop.example.com`."
    }
  }
}
```

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `401` | Not authenticated. The request carried no valid WordPress credentials. |
| `403` | Authenticated, but the user lacks the required capability. |
