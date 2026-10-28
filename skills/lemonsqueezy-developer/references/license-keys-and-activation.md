# Lemon Squeezy Software Licensing API

For desktop apps, CLI tools, WordPress plugins, or self-hosted SaaS scripts requiring license activation, verification, and deactivation.

---

## 1. Key Concepts

* **License Key:** The master string delivered to the customer after purchasing a software product.
* **Instance:** A single machine, domain, or environment running the license key (e.g. `domain.com` or Mac UUID).
* **Activation Limit:** The maximum concurrent instances allowed (defined per variant in your dashboard).

---

## 2. Public Licensing Endpoints (No Bearer Auth Needed)

Unlike standard REST endpoints, the **Licensing API** does NOT require your master API key. Your client application communicates directly using POST requests to `https://api.example.com/v1/licenses/...`.

### A. Activate a License (First Run on Machine/Site)
**Endpoint:** `POST https://api.example.com/v1/licenses/activate`  
**Payload (Form URL Encoded or JSON):**
```json
{
  "license_key": "4c949c86-82f2-4919-86eb-c2b64b3ef864",
  "instance_name": "production-app-server-01"
}
```

**Success Response:**
```json
{
  "activated": true,
  "error": null,
  "license_key": {
    "id": 1,
    "status": "active",
    "key": "4c949c86-...",
    "activation_limit": 5,
    "activation_usage": 1,
    "created_at": "2024-05-21T14:14:19.000000Z",
    "expires_at": null
  },
  "instance": {
    "id": "e98e4f1a-b689-4a0b-80df-565d6c827be9",
    "name": "production-app-server-01",
    "created_at": "2024-05-21T15:20:00.000000Z"
  },
  "meta": {
    "store_id": 1,
    "order_id": 1,
    "product_id": 1
  }
}
```
*Save `instance.id` locally in your application storage/database! You need it for validation and deactivation.*

---

### B. Validate a License (Periodic Check)
**Endpoint:** `POST https://api.example.com/v1/licenses/validate`
```json
{
  "license_key": "4c949c86-82f2-4919-86eb-c2b64b3ef864",
  "instance_id": "e98e4f1a-b689-4a0b-80df-565d6c827be9"
}
```

**Response:**
```json
{
  "valid": true,
  "error": null,
  "license_key": {
    "status": "active",
    "activation_usage": 1
  }
}
```
If the subscription expired, license key was disabled, or refunded, `valid` will return `false`.

---

### C. Deactivate a License (Unlink Machine / Site Transfer)
**Endpoint:** `POST https://api.example.com/v1/licenses/deactivate`
```json
{
  "license_key": "4c949c86-82f2-4919-86eb-c2b64b3ef864",
  "instance_id": "e98e4f1a-b689-4a0b-80df-565d6c827be9"
}
```
Decrements `activation_usage` by 1 and frees up the slot for a new instance.
