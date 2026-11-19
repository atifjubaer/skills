# Attribute Relation Model

| DB Table Name | {wp_db_prefix}_fct_atts_relations |
| --- | --- |
| Schema | [Check Schema](/database/schema.md#fct-atts-relations-table) |
| Source File | fluent-cart/app/Models/AttributeRelation.php |
| Name Space | FluentCart\App\Models |
| Class | FluentCart\App\Models\AttributeRelation |

## Attributes

| Attribute | Data Type | Comment |
| --- | --- | --- |
| id | Integer | Primary Key |
| group_id | Integer | Reference to attribute group |
| term_id | Integer | Reference to attribute term |
| object_id | Integer | Reference to product detail (variation) |
| created_at | Date Time | Creation timestamp |
| updated_at | Date Time | Last update timestamp |

## Usage

Please check [Model Basic](/database/models.md) for Common methods.

### Accessing Attributes

```
$attributeRelation = FluentCart\App\Models\AttributeRelation::find(1);

$attributeRelation->id; // returns id
$attributeRelation->group_id; // returns group ID
$attributeRelation->term_id; // returns term ID
$attributeRelation->object_id; // returns object ID (product detail ID)
```

## Relations

This model has the following relationships that you can use

### group

Access the associated attribute group (`belongsTo`)

- return `FluentCart\App\Models\AttributeGroup` Model

#### Example:

```
// Accessing Group
$group = $attributeRelation->group;

// For Filtering by group relationship
$attributeRelations = FluentCart\App\Models\AttributeRelation::whereHas('group', function($query) {
    $query->where('title', 'Color');
})->get();
```

### term

Access the associated attribute term (`belongsTo`)

- return `FluentCart\App\Models\AttributeTerm` Model

#### Example:

```
// Accessing Term
$term = $attributeRelation->term;

// For Filtering by term relationship
$attributeRelations = FluentCart\App\Models\AttributeRelation::whereHas('term', function($query) {
    $query->where('title', 'Red');
})->get();
```

### productDetails

Access the associated product detail (`belongsTo`). Links via `object_id` to `ProductDetail.id`.

- return `FluentCart\App\Models\ProductDetail` Model

#### Example:

```
// Accessing Product Detail
$productDetail = $attributeRelation->productDetails;

// For Filtering by product detail relationship
$attributeRelations = FluentCart\App\Models\AttributeRelation::whereHas('productDetails', function($query) {
    $query->where('fulfillment_type', 'physical');
})->get();
```

## Usage Examples

### Get Attribute Relations

```
$attributeRelation = FluentCart\App\Models\AttributeRelation::find(1);
echo "Group ID: " . $attributeRelation->group_id;
echo "Term ID: " . $attributeRelation->term_id;
echo "Object ID: " . $attributeRelation->object_id;
```

### Create Attribute Relation

```
$attributeRelation = FluentCart\App\Models\AttributeRelation::create([
    'group_id' => 1,  // Color group
    'term_id' => 5,   // Red term
    'object_id' => 123 // Product detail ID
]);
```

### Get Relations with Group and Term Information

```
$attributeRelations = FluentCart\App\Models\AttributeRelation::with(['group', 'term'])->get();

foreach ($attributeRelations as $relation) {
    echo "Group: " . $relation->group->title;
    echo "Term: " . $relation->term->title;
    echo "Object ID: " . $relation->object_id;
}
```

### Get Relations by Group

```
$colorRelations = FluentCart\App\Models\AttributeRelation::where('group_id', 1)->get();
$sizeRelations = FluentCart\App\Models\AttributeRelation::where('group_id', 2)->get();
```

### Get Relations by Term

```
$redRelations = FluentCart\App\Models\AttributeRelation::where('term_id', 5)->get();
$smallRelations = FluentCart\App\Models\AttributeRelation::where('term_id', 10)->get();
```

### Get Relations for Product

```
$productRelations = FluentCart\App\Models\AttributeRelation::where('object_id', 123)->get();

foreach ($productRelations as $relation) {
    echo "Attribute: " . $relation->group->title . " - " . $relation->term->title;
}
```

### Get Relations with Product Details

```
$relationsWithProducts = FluentCart\App\Models\AttributeRelation::with(['group', 'term', 'productDetails'])->get();

foreach ($relationsWithProducts as $relation) {
    echo "Product: " . $relation->productDetails->id;
    echo "Attribute: " . $relation->group->title . " - " . $relation->term->title;
}
```

### Delete Attribute Relation

```
$attributeRelation = FluentCart\App\Models\AttributeRelation::find(1);
$attributeRelation->delete();
```

### Get Relations by Multiple Terms

```
$redOrBlueRelations = FluentCart\App\Models\AttributeRelation::whereIn('term_id', [5, 6])->get();
```

### Get Relations for Multiple Products

```
$multiProductRelations = FluentCart\App\Models\AttributeRelation::whereIn('object_id', [123, 124, 125])->get();
```

---
