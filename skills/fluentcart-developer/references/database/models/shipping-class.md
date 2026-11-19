# Shipping Class Model

| DB Table Name | {wp_db_prefix}_fct_shipping_classes |
| --- | --- |
| Schema | [Check Schema](/database/schema.md#fct-shipping-classes-table) |
| Source File | fluent-cart/app/Models/ShippingClass.php |
| Name Space | FluentCart\App\Models |
| Class | FluentCart\App\Models\ShippingClass |

## Traits

- `FluentCart\App\Models\Concerns\CanSearch` - Provides `search()`, `groupSearch()`, `whereLike()`, `whereBeginsWith()`, `whereEndsWith()` scopes

## Casts

| Attribute | Cast Type |
| --- | --- |
| cost | float |

## Attributes

| Attribute | Data Type | Comment |
| --- | --- | --- |
| id | Integer | Primary Key |
| name | String | Shipping class name |
| description | String | Shipping class description (max 500 chars) |
| cost | Float | Surcharge in base-currency major units, not cents (cast to float) |
| type | String | Shipping class type |
| per_item | Boolean | Whether cost is per item |
| created_at | Date Time | Creation timestamp |
| updated_at | Date Time | Last update timestamp |

## Usage

Please check [Model Basic](/database/models.md) for Common methods.

### Accessing Attributes

```
$shippingClass = FluentCart\App\Models\ShippingClass::find(1);

$shippingClass->id; // returns id
$shippingClass->name; // returns name
$shippingClass->cost; // returns cost (cast to float)
$shippingClass->type; // returns type
$shippingClass->per_item; // returns per_item flag
```

## Relations

This model has the following relationships that you can use

### zones

Access the shipping zones scoped to this class.

- return `FluentCart\App\Models\ShippingZone` Model Collection

#### Example:

```
$zones = $shippingClass->zones;
```

## Usage Examples

### Get Shipping Classes

```
$shippingClass = FluentCart\App\Models\ShippingClass::find(1);
echo "Name: " . $shippingClass->name;
echo "Cost: " . $shippingClass->cost;
echo "Type: " . $shippingClass->type;
echo "Per Item: " . ($shippingClass->per_item ? 'Yes' : 'No');
```

### Create Shipping Class

```
$shippingClass = FluentCart\App\Models\ShippingClass::create([
    'name' => 'Standard Shipping',
    'cost' => 5.99,
    'type' => 'standard',
    'per_item' => false
]);
```

### Get All Shipping Classes

```
$shippingClasses = FluentCart\App\Models\ShippingClass::all();

foreach ($shippingClasses as $class) {
    echo "Class: " . $class->name . " - Cost: $" . $class->cost;
}
```

### Get Shipping Classes by Type

```
$standardClasses = FluentCart\App\Models\ShippingClass::where('type', 'standard')->get();
$expressClasses = FluentCart\App\Models\ShippingClass::where('type', 'express')->get();
```

### Get Per-Item Shipping Classes

```
$perItemClasses = FluentCart\App\Models\ShippingClass::where('per_item', true)->get();
$flatRateClasses = FluentCart\App\Models\ShippingClass::where('per_item', false)->get();
```

### Update Shipping Class

```
$shippingClass = FluentCart\App\Models\ShippingClass::find(1);
$shippingClass->update([
    'cost' => 7.99,
    'per_item' => true
]);
```

### Get Shipping Classes by Cost Range

```
$lowCostClasses = FluentCart\App\Models\ShippingClass::where('cost', '<', 10.00)->get();
$highCostClasses = FluentCart\App\Models\ShippingClass::where('cost', '>=', 10.00)->get();
```

### Delete Shipping Class

```
$shippingClass = FluentCart\App\Models\ShippingClass::find(1);
$shippingClass->delete();
```

### Get Shipping Classes Ordered by Cost

```
$orderedClasses = FluentCart\App\Models\ShippingClass::orderBy('cost', 'asc')->get();
```

### Search Shipping Classes

```
$searchResults = FluentCart\App\Models\ShippingClass::whereLike('name', 'Standard')->get();
```

---
