# Label Model

| DB Table Name | {wp_db_prefix}_fct_label |
| --- | --- |
| Schema | [Check Schema](/database/schema.md#fct-label-table) |
| Source File | fluent-cart/app/Models/Label.php |
| Name Space | FluentCart\App\Models |
| Class | FluentCart\App\Models\Label |

## Attributes

| Attribute | Data Type | Comment |
| --- | --- | --- |
| id | Integer | Primary Key |
| value | Mixed | Label value (serialized) |
| created_at | Date Time | Creation timestamp |
| updated_at | Date Time | Last update timestamp |

## Casts

| Attribute | Cast Type |
| --- | --- |
| id | integer |

## Usage

Please check [Model Basic](/database/models.md) for Common methods.

### Accessing Attributes

```
$label = FluentCart\App\Models\Label::find(1);

$label->id; // returns id
$label->value; // returns label value
```

## Methods

Along with Global Model methods, this model has few helper methods.

### setValueAttribute($value)

Set value with automatic serialization (mutator). Uses WordPress `maybe_serialize()` to serialize arrays and objects before storing.

- Parameters $value - mixed

Returns `void`

#### Usage

```
$label->value = ['name' => 'VIP Customer', 'color' => 'gold'];
// Automatically serializes the value using maybe_serialize()
```

### getValueAttribute($value)

Get value with automatic unserialization (accessor). Uses WordPress `maybe_unserialize()` to unserialize stored values.

- Parameters $value - mixed

Returns `mixed`

#### Usage

```
$value = $label->value; // Returns unserialized value
```

## Usage Examples

### Get Labels

```
$label = FluentCart\App\Models\Label::find(1);
echo "Label ID: " . $label->id;
echo "Label Value: " . print_r($label->value, true);
```

### Create Label

```
$label = FluentCart\App\Models\Label::create([
    'value' => [
        'name' => 'VIP Customer',
        'color' => 'gold',
        'description' => 'High-value customer'
    ]
]);
```

### Get All Labels

```
$labels = FluentCart\App\Models\Label::all();

foreach ($labels as $label) {
    $value = $label->value;
    if (is_array($value) && isset($value['name'])) {
        echo "Label: " . $value['name'];
    }
}
```

### Update Label

```
$label = FluentCart\App\Models\Label::find(1);
$label->update([
    'value' => [
        'name' => 'Premium Customer',
        'color' => 'platinum',
        'description' => 'Premium tier customer'
    ]
]);
```

### Get Labels by Value

```
$labels = FluentCart\App\Models\Label::all();

foreach ($labels as $label) {
    $value = $label->value;
    if (is_array($value) && isset($value['color']) && $value['color'] === 'gold') {
        echo "Gold Label: " . $value['name'];
    }
}
```

### Delete Label

```
$label = FluentCart\App\Models\Label::find(1);
$label->delete();
```

### Create Simple Label

```
$label = FluentCart\App\Models\Label::create([
    'value' => 'New Customer'
]);
```

### Get Labels Ordered by ID

```
$orderedLabels = FluentCart\App\Models\Label::orderBy('id', 'asc')->get();
```

---
