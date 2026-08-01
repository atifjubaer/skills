# FluentCart Eloquent Models Master Reference

> Source: Official FluentCart Developer Documentation

Complete technical developer reference for FluentCart's Eloquent ORM Models. Covers attributes, mutators, accessors, relationships, scopes, helper methods, and query patterns across Core and Pro models.

---

## 💡 Core Architecture Rules

1. **Namespaces:**
   - Core Models: `\FluentCart\App\Models\*`
   - Pro Models: `\FluentCartPro\App\Models\*` or module-specific namespaces like `\FluentCartPro\App\Modules\Licensing\Models\*` and `\FluentCartPro\App\Modules\Promotional\Models\*`.
2. **Cents Precision:**
   - Financial attributes (`total_amount`, `subtotal`, `tax_total`, `discount_total`, `unit_price`, `cost`, `line_total`, `refund_total`, `total_paid`, `amount`) are stored in **cents** as integers or double precision floats.
   - Use `\FluentCart\App\Helpers\Helper::toDecimal($cents)` when displaying decimal strings.
   - Use `\FluentCart\App\Helpers\Helper::toCent($decimal)` when saving decimal user inputs.

---

## 1. Core Order Models

### `Order` (`\FluentCart\App\Models\Order`)
* **Database Table:** `{wp_db_prefix}_fct_orders`
* **Source File:** `fluent-cart/app/Models/Order.php`

| Attribute | Type | Description / Cast |
|---|---|---|
| `id` | Integer | Primary key ID |
| `status` | String | Order status (`draft`, `pending`, `processing`, `completed`, `on-hold`, `failed`, `refunded`, `partial-refund`) |
| `parent_id` | Integer | Parent order ID (for renewal / child orders) |
| `receipt_number` | Integer | Order receipt number |
| `invoice_no` | String | Order invoice number |
| `fulfillment_type` | String | Fulfillment type (`physical`, `digital`, `service`, `mixed`) |
| `type` | String | Order type (`payment`, `renewal`, `refund`) |
| `mode` | String | Gateway mode (`live`, `test`) |
| `shipping_status` | String | Shipping status (`unshipped`, `shipped`, `delivered`, `unshippable`) |
| `customer_id` | Integer | Reference to customer ID |
| `payment_method` | String | Payment gateway key (e.g. `stripe`, `paypal`) |
| `payment_status` | String | Payment status (`paid`, `unpaid`, `refunded`, `partially_refunded`) |
| `payment_method_title` | String | Display title of payment method |
| `currency` | String | 3-letter currency code (e.g. `USD`) |
| `subtotal` | Integer | Order subtotal in cents |
| `discount_tax` | Integer | Discount tax in cents |
| `manual_discount_total` | Integer | Manual discount in cents |
| `coupon_discount_total` | Integer | Coupon discount total in cents |
| `shipping_tax` | Integer | Shipping tax in cents |
| `shipping_total` | Integer | Shipping total in cents |
| `tax_total` | Integer | Tax total in cents |
| `total_amount` | Integer | Total order amount in cents |
| `total_paid` | Integer | Total paid amount in cents |
| `total_refund` | Integer | Total refunded amount in cents |
| `rate` | Decimal | Exchange rate |
| `tax_behavior` | Integer | Tax behavior (`0` = no tax, `1` = exclusive, `2` = inclusive) |
| `note` | Text | Order internal notes |
| `ip_address` | Text | Customer IP address |
| `completed_at` | DateTime | Completion timestamp |
| `refunded_at` | DateTime | Refund timestamp |
| `uuid` | String | Unique public identifier |
| `config` | JSON | Configuration options array (auto JSON encoded/decoded) |

```php
// Retrieve order by primary key ID
$order = \FluentCart\App\Models\Order::find(1);

// Update order status slug
$order->updateStatus('status', 'completed');

// Update payment status slug
$order->updatePaymentStatus('paid');

// Fetch order meta value with fallback
$customVal = $order->getMeta('custom_key', 'default_value');

// Recount total paid and total refund amounts, updating payment status
$order->recountTotalPaidAndRefund();

// Add activity log to order timeline
$order->addLog('Status Updated', 'Order status changed to completed', 'info', 'admin');
```

---

### `OrderItem` (`\FluentCart\App\Models\OrderItem`)
* **Database Table:** `{wp_db_prefix}_fct_order_items`
* **Source File:** `fluent-cart/app/Models/OrderItem.php`

| Attribute | Type | Description / Cast |
|---|---|---|
| `id` | Integer | Primary key ID |
| `order_id` | Integer | Reference to parent order |
| `post_id` | Integer | WordPress post ID (product) |
| `fulfillment_type` | String | Fulfillment type (`physical`, `digital`, `service`) |
| `title` | Text | Variation title |
| `quantity` | Integer | Item quantity |
| `unit_price` | Double | Price per unit in cents (cast to double) |
| `subtotal` | Double | Line subtotal in cents (cast to double) |
| `line_total` | Double | Total line amount in cents (cast to double) |
| `other_info` | JSON | Array of additional item options (auto encoded/decoded) |

```php
// Retrieve line item by ID
$item = \FluentCart\App\Models\OrderItem::find(1);

// Access parent order relationship
$order = $item->order;

// Access associated catalog product
$product = $item->product;

// Access product variation instance
$variation = $item->variants;
```

---

### `OrderMeta` (`\FluentCart\App\Models\OrderMeta`)
* **Database Table:** `{wp_db_prefix}_fct_order_meta`
* **Source File:** `fluent-cart/app/Models/OrderMeta.php`

```php
// Retrieve order meta by primary key
$orderMeta = \FluentCart\App\Models\OrderMeta::find(1);

// Update or create order meta entry
$orderMeta->updateMeta('shipping_notes', 'Leave package at front porch');
```

---

### `OrderTransaction` (`\FluentCart\App\Models\OrderTransaction`)
* **Database Table:** `{wp_db_prefix}_fct_order_transactions`
* **Source File:** `fluent-cart/app/Models/OrderTransaction.php`

```php
// Retrieve order transaction by ID
$transaction = \FluentCart\App\Models\OrderTransaction::find(1);

// Filter transactions by succeeded status
$succeededTrxs = \FluentCart\App\Models\OrderTransaction::ofStatus('succeeded')->get();

// Calculate maximum remaining refundable amount in cents
$maxRefundCents = $transaction->getMaxRefundableAmount();
```

---

### `OrderAddress` (`\FluentCart\App\Models\OrderAddress`)
* **Database Table:** `{wp_db_prefix}_fct_order_addresses`
* **Source File:** `fluent-cart/app/Models/OrderAddress.php`

```php
// Retrieve order address model by ID
$address = \FluentCart\App\Models\OrderAddress::find(1);

// Get formatted plain text address string
$textAddress = $address->getAddressAsText(false, true, ', ');
```

---

## 2. Attribute System Models

### `AttributeGroup` (`\FluentCart\App\Models\AttributeGroup`)
* **Database Table:** `{wp_db_prefix}_fct_atts_groups`
* **Source File:** `fluent-cart/app/Models/AttributeGroup.php`
* **Traits:** `CanSearch` (`search()`, `groupSearch()`, `whereLike()`, `whereBeginsWith()`, `whereEndsWith()`)

| Attribute | Type | Description |
|---|---|---|
| `id` | Integer | Primary Key |
| `title` | String | Attribute group title (e.g., Color, Size) |
| `slug` | String | Attribute group slug |
| `description` | Text | Attribute group description |
| `settings` | JSON | Attribute group settings array (auto encoded/decoded) |

```php
// Create a new attribute group with JSON settings
$attributeGroup = \FluentCart\App\Models\AttributeGroup::create([
    'title'       => 'Color',
    'slug'        => 'color',
    'description' => 'Product color variations',
    'settings'    => [
        'display_type' => 'dropdown',
        'required'     => true,
        'multiple'     => false
    ]
]);

// Eager load group with its terms
$groupsWithTerms = \FluentCart\App\Models\AttributeGroup::with('terms')->get();
```

---

### `AttributeTerm` (`\FluentCart\App\Models\AttributeTerm`)
* **Database Table:** `{wp_db_prefix}_fct_atts_terms`
* **Source File:** `fluent-cart/app/Models/AttributeTerm.php`
* **Traits:** `CanSearch`

| Attribute | Type | Description |
|---|---|---|
| `id` | Integer | Primary Key |
| `group_id` | Integer | Reference to attribute group ID |
| `serial` | Integer | Serial number for ordering terms |
| `title` | String | Attribute term title (e.g., Red, Small) |
| `slug` | String | Attribute term slug |
| `description` | Text | Attribute term description |
| `settings` | JSON | Attribute term settings array (auto encoded/decoded) |

```php
// Create a new attribute term linked to a group
$term = \FluentCart\App\Models\AttributeTerm::create([
    'group_id'    => 1, // Color group ID
    'serial'      => 1, // Display order
    'title'       => 'Red',
    'slug'        => 'red',
    'description' => 'Red color variant',
    'settings'    => [
        'color_code'    => '#FF0000',
        'display_order' => 1
    ]
]);
```

---

### `AttributeRelation` (`\FluentCart\App\Models\AttributeRelation`)
* **Database Table:** `{wp_db_prefix}_fct_atts_relations`
* **Source File:** `fluent-cart/app/Models/AttributeRelation.php`

| Attribute | Type | Description |
|---|---|---|
| `id` | Integer | Primary Key |
| `group_id` | Integer | Reference to attribute group ID |
| `term_id` | Integer | Reference to attribute term ID |
| `object_id` | Integer | Reference to product variation / detail ID |

```php
// Attach attribute term to a product detail / variation
$relation = \FluentCart\App\Models\AttributeRelation::create([
    'group_id'  => 1,   // Color group ID
    'term_id'   => 5,   // Red term ID
    'object_id' => 123 // Product variation / detail ID
]);
```

---

## 3. Shipping & Tax Models

### `ShippingZone` (`\FluentCart\App\Models\ShippingZone`)
* **Database Table:** `{wp_db_prefix}_fct_shipping_zones`
* **Source File:** `fluent-cart/app/Models/ShippingZone.php`

```php
// Create shipping zone for North America
$zone = \FluentCart\App\Models\ShippingZone::create([
    'name'   => 'United States',
    'region' => 'US',
    'order'  => 1
]);
```

---

### `ShippingMethod` (`\FluentCart\App\Models\ShippingMethod`)
* **Database Table:** `{wp_db_prefix}_fct_shipping_methods`
* **Source File:** `fluent-cart/app/Models/ShippingMethod.php`

```php
// Filter shipping methods applicable to US, California
$availableMethods = \FluentCart\App\Models\ShippingMethod::applicableToCountry('US', 'CA')->get();
```

---

### `ShippingClass` (`\FluentCart\App\Models\ShippingClass`)
* **Database Table:** `{wp_db_prefix}_fct_shipping_classes`
* **Source File:** `fluent-cart/app/Models/ShippingClass.php`

```php
// Create heavy item shipping class
$class = \FluentCart\App\Models\ShippingClass::create([
    'name'     => 'Heavy Freight',
    'cost'     => 25.00,
    'type'     => 'freight',
    'per_item' => true
]);
```

---

### `TaxClass` (`\FluentCart\App\Models\TaxClass`)
* **Database Table:** `{wp_db_prefix}_fct_tax_classes`
* **Source File:** `fluent-cart/app/Models/TaxClass.php`

```php
// Create tax class (slug will be auto-generated as "reduced-tax-rate")
$taxClass = \FluentCart\App\Models\TaxClass::create([
    'title' => 'Reduced Tax Rate',
    'meta'  => ['rate' => 5.0]
]);
```

---

### `TaxRate` (`\FluentCart\App\Models\TaxRate`)
* **Database Table:** `{wp_db_prefix}_fct_tax_rates`
* **Source File:** `fluent-cart/app/Models/TaxRate.php`
* **Timestamps:** Disabled (`$timestamps = false`)

```php
// Create tax rate rule for California
$taxRate = \FluentCart\App\Models\TaxRate::create([
    'class_id'     => 1,
    'country'      => 'US',
    'state'        => 'CA',
    'rate'         => 8.75,
    'name'         => 'California Sales Tax',
    'priority'     => 1,
    'is_compound'  => false,
    'for_order'    => true
]);
```

---

## 4. Label System Models

### `Label` (`\FluentCart\App\Models\Label`)
* **Database Table:** `{wp_db_prefix}_fct_label`
* **Source File:** `fluent-cart/app/Models/Label.php`

```php
// Create label with array value (automatically serialized)
$label = \FluentCart\App\Models\Label::create([
    'value' => [
        'name'  => 'VIP Customer',
        'color' => 'gold'
    ]
]);
```

---

### `LabelRelationship` (`\FluentCart\App\Models\LabelRelationship`)
* **Database Table:** `{wp_db_prefix}_fct_label_relationships`
* **Source File:** `fluent-cart/app/Models/LabelRelationship.php`

```php
// Access polymorphic morphTo relationship on labelable model
$relationship = \FluentCart\App\Models\LabelRelationship::find(1);
$targetObject = $relationship->labelable;
```

---

## 5. Pro Plugin Models (FluentCart Pro)

### `License` (`\FluentCartPro\App\Modules\Licensing\Models\License`)
* **Database Table:** `{wp_db_prefix}_fct_licenses`
* **Source File:** `fluent-cart-pro/app/Modules/Licensing/Models/License.php`
* **Plugin:** FluentCart Pro
* **Traits:** `CanSearch`

| Attribute | Type | Description / Cast |
|---|---|---|
| `id` | Integer | Primary key ID (guarded) |
| `status` | String | License status (`active`, `inactive`, `expired`, `disabled`) |
| `limit` | Integer | Activation limit (`0` = unlimited) |
| `activation_count` | Integer | Current activation count |
| `license_key` | String | Unique software license key |
| `product_id` | Integer | Reference to catalog product |
| `variation_id` | Integer | Reference to product variation |
| `order_id` | Integer | Reference to order |
| `parent_id` | Integer | Parent license ID (for renewals) |
| `customer_id` | Integer | Reference to customer |
| `expiration_date` | DateTime | License expiration date (`null` = lifetime) |
| `last_reminder_sent` | DateTime | Timestamp of last reminder |
| `last_reminder_type` | String | Reminder type slug |
| `subscription_id` | Integer | Reference to subscription |
| `config` | JSON | Configuration options array (auto JSON encoded/decoded) |

#### Relationships
- `customer` *(belongsTo)* -> `Customer`
- `order` *(belongsTo)* -> `Order`
- `product` *(belongsTo)* -> `Product`
- `variation` / `productVariant` *(belongsTo)* -> `ProductVariation`
- `productDetails` *(belongsTo)* -> `ProductDetail`
- `subscription` *(belongsTo)* -> `Subscription`
- `activations` *(hasMany)* -> `LicenseActivation`
- `labels` *(morphMany)* -> `LabelRelationship`

#### Query Scopes & Helper Methods
```php
// Search across license keys, order IDs, product titles, and customer email
$licenses = \FluentCartPro\App\Modules\Licensing\Models\License::search('john@example.com')->get();

// Smart status scope filtering: active, expired, inactive, or disabled
$activeLicenses = \FluentCartPro\App\Modules\Licensing\Models\License::status('active')->get();

// Filter licenses by array of product IDs
$prodLicenses = \FluentCartPro\App\Modules\Licensing\Models\License::products([1, 2, 3])->get();

// Helper method checks
$license = \FluentCartPro\App\Modules\Licensing\Models\License::find(1);
$isActive  = $license->isActive();  // True if active or inactive
$isExpired = $license->isExpired(); // Checks expiration date & grace period
$isValid   = $license->isValid();   // True if active and not expired

// Management helper methods (fires action hooks)
$license->updateLicenseStatus('disabled'); // Triggers fluent_cart_sl/license_status_updated
$license->increaseActivationCount();       // Triggers fluent_cart_sl/license_limit_increased
$license->decreaseActivationCount();       // Triggers fluent_cart_sl/license_limit_decreased
$license->increaseLimit(10);               // Sets limit to 10 or 'unlimited'
$license->regenerateKey();                 // Generates new key UUID
$license->extendValidity('2026-12-31');     // Extends validity or passes 'lifetime'
$license->recountActivations();            // Recounts active sites
$downloads = $license->getDownloads();     // Gets downloadable files attached to license
```

---

### `LicenseMeta` (`\FluentCartPro\App\Modules\Licensing\Models\LicenseMeta`)
* **Database Table:** `{wp_db_prefix}_fct_license_meta`
* **Source File:** `fluent-cart-pro/app/Modules/Licensing/Models/LicenseMeta.php`
* **Plugin:** FluentCart Pro

| Attribute | Type | Description |
|---|---|---|
| `id` | Integer | Primary key ID (guarded) |
| `object_id` | Integer | Reference to parent object ID (license ID, site ID, etc.) |
| `object_type` | String | Type slug of parent object (`license`, `activation`, `site`) |
| `meta_key` | String | Meta key name |
| `meta_value` | Text / JSON | Meta value (auto JSON encoded/decoded for arrays/objects) |

```php
// Create polymorphic license meta entry
$meta = \FluentCartPro\App\Modules\Licensing\Models\LicenseMeta::create([
    'object_id'   => 101,
    'object_type' => 'license',
    'meta_key'    => 'renewal_info',
    'meta_value'  => ['auto_renew' => true, 'next_date' => '2026-12-31']
]);

// Pluck metadata key-value map for a license
$metaMap = \FluentCartPro\App\Modules\Licensing\Models\LicenseMeta::where('object_id', 101)
    ->where('object_type', 'license')
    ->pluck('meta_value', 'meta_key')
    ->toArray();
```

---

### `LicenseActivation` (`\FluentCartPro\App\Modules\Licensing\Models\LicenseActivation`)
* **Database Table:** `{wp_db_prefix}_fct_license_activations`
* **Source File:** `fluent-cart-pro/app/Modules/Licensing/Models/LicenseActivation.php`
* **Plugin:** FluentCart Pro

| Attribute | Type | Description |
|---|---|---|
| `id` | Integer | Primary key ID (guarded) |
| `site_id` | Integer | Foreign key to `fct_license_sites` |
| `license_id` | Integer | Foreign key to `fct_licenses` |
| `status` | String | Activation status slug (`active`, `inactive`) |
| `is_local` | Boolean | Whether site is local dev environment |
| `product_id` | Integer | Product ID |
| `variation_id` | Integer | Variation ID |
| `last_update_date` | DateTime | Timestamp of last software update check |
| `last_update_version` | String | Version string of last software update |
| `activation_method` | String | Method slug (e.g. `api`, `key_based`) |
| `activation_hash` | String | Unique activation security hash |

```php
// Find activation record by ID
$activation = \FluentCartPro\App\Modules\Licensing\Models\LicenseActivation::find(1);

// Update status and trigger action hooks (fluent_cart_sl/license_activation_status_updated)
$activation->updateStatus('active');

// Access belongsTo relationships
$license = $activation->license;
$site    = $activation->site;
```

---

### `LicenseSite` (`\FluentCartPro\App\Modules\Licensing\Models\LicenseSite`)
* **Database Table:** `{wp_db_prefix}_fct_license_sites`
* **Source File:** `fluent-cart-pro/app/Modules/Licensing/Models/LicenseSite.php`
* **Plugin:** FluentCart Pro

| Attribute | Type | Description |
|---|---|---|
| `id` | Integer | Primary key ID (guarded) |
| `site_url` | String | Licensed website domain URL |
| `server_version` | String | Server environment string (e.g. `PHP 8.2`) |
| `platform_version` | String | Platform version (e.g. `WordPress 6.4`) |
| `other` | JSON | Additional server metadata array (auto encoded/decoded) |

```php
// Check if site is local development domain (.test, .local, localhost, staging, dev)
$site = \FluentCartPro\App\Modules\Licensing\Models\LicenseSite::find(1);
if ($site->isLocalSite()) {
    // Local development site logic
}

// Access attached activations hasMany relationship
$activations = $site->activations;
```

---

### `OrderPromotion` (`\FluentCartPro\App\Modules\Promotional\Models\OrderPromotion`)
* **Database Table:** `{wp_db_prefix}_fct_order_promotions`
* **Source File:** `fluent-cart-pro/app/Modules/Promotional/Models/OrderPromotion.php`
* **Plugin:** FluentCart Pro

| Attribute | Type | Description |
|---|---|---|
| `id` | Integer | Primary key ID (guarded) |
| `hash` | String | Unique promotion hash (auto-generated on creation via md5) |
| `parent_id` | Integer | Parent promotion ID |
| `type` | String | Promotion type (`order_bump`, `upsell`) |
| `status` | String | Status (`draft`, `active`, `inactive`) |
| `src_object_id` | Integer | Source object ID |
| `src_object_type` | String | Source object type (`product_variation`) |
| `title` | String | Promotion title |
| `description` | Text | Promotion description |
| `conditions` | JSON | Conditions array (auto JSON encoded/decoded) |
| `config` | JSON | Configuration options array (auto JSON encoded/decoded) |
| `priority` | Integer | Priority order |

```php
// Create active order bump promotion
$promotion = \FluentCartPro\App\Modules\Promotional\Models\OrderPromotion::create([
    'type'            => 'order_bump',
    'status'          => 'active',
    'src_object_id'   => 123,
    'src_object_type' => 'product_variation',
    'title'           => 'Special Add-on Offer',
    'conditions'      => ['min_amount' => 5000, 'product_ids' => [1, 2]], // $50 min amount
    'config'          => ['discount_type' => 'percentage', 'discount_value' => 15],
    'priority'        => 1
]);

// Access belongsTo product variant
$variant = $promotion->product_variant;
```

---

### `OrderPromotionStat` (`\FluentCartPro\App\Modules\Promotional\Models\OrderPromotionStat`)
* **Database Table:** `{wp_db_prefix}_fct_order_promotion_stats`
* **Source File:** `fluent-cart-pro/app/Modules/Promotional/Models/OrderPromotionStat.php`
* **Plugin:** FluentCart Pro

| Attribute | Type | Description |
|---|---|---|
| `id` | Integer | Primary key ID (guarded) |
| `promotion_id` | Integer | Foreign key to `fct_order_promotions` |
| `order_id` | Integer | Foreign key to `fct_orders` |
| `object_id` | Integer | Related product or variation ID |
| `amount` | Decimal | Promotion revenue amount |
| `status` | String | Stat status (`offered`, `applied`, `declined`) |

```php
// Track applied order bump promotion statistic
$stat = \FluentCartPro\App\Modules\Promotional\Models\OrderPromotionStat::create([
    'promotion_id' => 1,
    'order_id'     => 501,
    'object_id'    => 123,
    'amount'       => 15.99,
    'status'       => 'applied'
]);

// Query stats with eager loaded order and promotion
$stats = \FluentCartPro\App\Modules\Promotional\Models\OrderPromotionStat::with(['order', 'promotion'])->get();
```

---

### `UserMeta` (`\FluentCartPro\App\Models\UserMeta`)
* **Database Table:** `{wp_db_prefix}_usermeta`
* **Source File:** `fluent-cart-pro/app/Models/UserMeta.php`
* **Plugin:** FluentCart Pro

| Attribute | Type | Description |
|---|---|---|
| `umeta_id` | Integer | Primary Key ID |
| `user_id` | Integer | Foreign key to WordPress `users` table ID |
| `meta_key` | String | Meta key name |
| `meta_value` | Text | Meta value string or serialized data |

```php
// Retrieve WordPress user meta entry
$userMeta = \FluentCartPro\App\Models\UserMeta::where('user_id', 42)
    ->where('meta_key', 'fluent_cart_admin_role')
    ->first();

// Access belongsTo WordPress User model relationship
$user = $userMeta->user;
```
