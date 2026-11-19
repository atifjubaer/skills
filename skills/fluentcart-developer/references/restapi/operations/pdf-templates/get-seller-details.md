# GET Get Seller Details

## `GET /settings/pdf-templates/seller-details`

**GET Get Seller Details**

Retrieve the E-Invoice (ZUGFeRD/Factur-X) seller details, plus whether the store country — a mandatory EN 16931 field (BT-40) that lives in Store Settings, not here — has been set.

**Permission:** `is_super_admin` (`manage_options`) · **Policy:** `StoreSensitivePolicy`

- **operationId:** `getSellerDetails`
- **tags:** PDF Templates

### Responses

| Status | Description |
| --- | --- |
| `200` | Successful response |
| `403` | Forbidden — the user is not a super admin. |
