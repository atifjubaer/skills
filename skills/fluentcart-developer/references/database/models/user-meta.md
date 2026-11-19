# User Meta Model

| DB Table Name | {wp_db_prefix}_usermeta |
| --- | --- |
| Schema | [Check Schema](/database/schema.md#usermeta-table) |
| Source File | fluent-cart-pro/app/Models/UserMeta.php |
| Name Space | FluentCartPro\App\Models |
| Class | FluentCartPro\App\Models\UserMeta |
| Plugin | FluentCart Pro |

## Properties

- **Table**: `usermeta`
- **Primary Key**: `umeta_id`
- **Fillable**: `['user_id', 'meta_key', 'meta_value']`

## Attributes

| Attribute | Data Type | Comment |
| --- | --- | --- |
| umeta_id | Integer | Primary Key |
| user_id | Integer | Reference to user |
| meta_key | String | Meta key name |
| meta_value | Text | Meta value |

## Usage

Please check [Model Basic](/database/models.md) for Common methods.

### Accessing Attributes

```
$userMeta = FluentCartPro\App\Models\UserMeta::find(1);

$userMeta->umeta_id; // returns meta ID
$userMeta->user_id; // returns user ID
$userMeta->meta_key; // returns meta key
$userMeta->meta_value; // returns meta value
```

## Relations

This model has the following relationships that you can use

### user

Access the associated user (BelongsTo)

- return `FluentCartPro\App\Models\User` Model (via `belongsTo(User::class, 'user_id', 'ID')`)

#### Example:

```
// Accessing User
$user = $userMeta->user;

// For Filtering by user relationship
$userMetas = FluentCartPro\App\Models\UserMeta::whereHas('user', function($query) {
    $query->where('user_status', 0);
})->get();
```

## Usage Examples

### Get User Meta

```
$userMeta = FluentCartPro\App\Models\UserMeta::find(1);
echo "User ID: " . $userMeta->user_id;
echo "Meta Key: " . $userMeta->meta_key;
echo "Meta Value: " . $userMeta->meta_value;
```

### Create User Meta

```
$userMeta = FluentCartPro\App\Models\UserMeta::create([
    'user_id' => 123,
    'meta_key' => '_fluent_cart_admin_role',
    'meta_value' => 'store_manager'
]);
```

### Get All User Meta

```
$userMetas = FluentCartPro\App\Models\UserMeta::all();

foreach ($userMetas as $meta) {
    echo "User: " . $meta->user_id;
    echo "Key: " . $meta->meta_key;
    echo "Value: " . $meta->meta_value;
}
```

### Get Meta by User

```
$userMetas = FluentCartPro\App\Models\UserMeta::where('user_id', 123)->get();
```

### Get Meta by Key

```
$adminRoleMetas = FluentCartPro\App\Models\UserMeta::where('meta_key', '_fluent_cart_admin_role')->get();
```

### Get Meta with User Information

```
$userMetas = FluentCartPro\App\Models\UserMeta::with('user')->get();

foreach ($userMetas as $meta) {
    echo "User: " . $meta->user->display_name;
    echo "Key: " . $meta->meta_key;
    echo "Value: " . $meta->meta_value;
}
```

### Get Specific User Meta

```
$userMeta = FluentCartPro\App\Models\UserMeta::where('user_id', 123)
    ->where('meta_key', '_fluent_cart_admin_role')
    ->first();
```

### Update User Meta

```
$userMeta = FluentCartPro\App\Models\UserMeta::find(1);
$userMeta->update([
    'meta_value' => 'store_admin'
]);
```

### Get Users with Specific Meta

```
$storeManagers = FluentCartPro\App\Models\UserMeta::where('meta_key', '_fluent_cart_admin_role')
    ->where('meta_value', 'store_manager')
    ->get();
```

### Delete User Meta

```
$userMeta = FluentCartPro\App\Models\UserMeta::find(1);
$userMeta->delete();
```

### Get Meta for Multiple Users

```
$userMetas = FluentCartPro\App\Models\UserMeta::whereIn('user_id', [123, 124, 125])->get();
```

### Get Meta for Multiple Keys

```
$userMetas = FluentCartPro\App\Models\UserMeta::whereIn('meta_key', ['_fluent_cart_admin_role', 'wp_capabilities'])->get();
```

---

**Plugin**: FluentCart Pro
