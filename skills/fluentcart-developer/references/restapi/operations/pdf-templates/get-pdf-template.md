# GET Get PDF Template

## `GET /settings/pdf-templates/receipt/{template_id}`

**GET Get PDF Template**

Retrieve a single receipt PDF template with its block structure.

**Permission:** `is_super_admin` (`manage_options`) · **Policy:** `StoreSensitivePolicy`

- **operationId:** `getPdfTemplate`
- **tags:** PDF Templates

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `template_id` | path | yes | string | Template slug, e.g. `order_receipt`, `renewal_receipt`, `refund_notice`, `proforma_invoice`, or a custom slug. |

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | Forbidden — the user is not a super admin. |
| `422` | No template matches `template_id`. Note this is a **422**, not a 404 — the controller uses the framework's default error status. |
