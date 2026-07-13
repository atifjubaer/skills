# Filter Hooks Reference

This reference contains all FluentCart filters details scraped from the developer documentation site.

## Settings & Configuration

Source: https://dev.fluentcart.com/hooks/filters/settings-and-configuration.html


All filters related to admin settings, store configuration, module management, currency formatting, admin UI, permissions, translations, email notifications, and block editor.
## Store Settings [](#store-settings)

### ` store_settings/values ` [](#store-settings-values)
`fluent_cart/store_settings/values` — Filter default store settings values
**When it runs:** This filter is applied when retrieving the default store settings, before merging with saved values. Use it to add or modify defaults for all store configuration options.
**Parameters:**

- `$defaultSettings` (array): The default store settingsphp
```
$defaultSettings = [
 'store_name' => get_bloginfo('name'),
 'note_for_user_account_creation' => 'An user account will be created',
 'checkout_button_text' => 'Checkout',
 'view_cart_button_text' => 'View Cart',
 'cart_button_text' => 'Add To Cart',
 'popup_button_text' => 'View Product',
 'out_of_stock_button_text' => 'Not Available',
 'currency_position' => 'before',
 'decimal_separator' => 'dot',
 'checkout_method_style' => 'logo',
 'enable_modal_checkout' => 'no',
 'require_logged_in' => 'no',
 'show_cart_icon_in_nav' => 'no',
 'show_cart_icon_in_body' => 'yes',
 'additional_address_field' => 'yes',
 'hide_coupon_field' => 'no',
 'user_account_creation_mode' => 'all',
 'checkout_page_id' => '',
 'custom_payment_page_id' => '',
 'registration_page_id' => '',
 'login_page_id' => '',
 'cart_page_id' => '',
 'receipt_page_id' => '',
 'shop_page_id' => '',
 'customer_profile_page_id' => '',
 'customer_profile_page_slug' => '',
 'currency' => 'USD',
 'store_address1' => '',
 'store_address2' => '',
 'store_city' => '',
 'store_country' => '',
 'store_postcode' => '',
 'store_state' => '',
 'show_relevant_product_in_single_page' => 'yes',
 'show_relevant_product_in_modal' => '',
 'order_mode' => 'test',
 'variation_view' => 'both',
 'variation_columns' => 'masonry',
 'enable_early_payment_for_installment' => 'yes',
 'modules_settings' => [],
 'min_receipt_number' => '1',
 'inv_prefix' => 'INV-',
];```

- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified default settings array
**Source:** `api/StoreSettings.php:89`
**Usage:**php
```
add_filter('fluent_cart/store_settings/values', function ($defaultSettings, $data) {
 // Change default currency and order mode
 $defaultSettings['currency'] = 'EUR';
 $defaultSettings['order_mode'] = 'live';
 return $defaultSettings;
}, 10, 2);```

### ` store_settings/fields ` [](#store-settings-fields)
`fluent_cart/store_settings/fields` — Filter store settings form field definitions
**When it runs:** This filter is applied when rendering the store settings form in the admin interface. Use it to add, remove, or modify settings tabs and fields.
**Parameters:**

- `$fields` (array): Nested array of settings tabs and field definitionsphp
```
$fields = [
 'setting_tabs' => [
 'schema' => [
 'general_tab' => [
 'title' => 'General Settings',
 'fields' => [...]
 ],
 'checkout_tab' => [
 'title' => 'Checkout Settings',
 'fields' => [...]
 ],
 'modules_tab' => [
 'title' => 'Modules',
 'fields' => [...]
 ],
 ]
 ]
];```

- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified fields array
**Source:** `api/StoreSettings.php:1141`
**Usage:**php
```
add_filter('fluent_cart/store_settings/fields', function ($fields, $data) {
 // Add a custom settings section
 $fields['setting_tabs']['schema']['custom_tab'] = [
 'title' => 'Custom Settings',
 'fields' => [
 [
 'key' => 'custom_field',
 'label' => 'Custom Field',
 'type' => 'text',
 ]
 ]
 ];
 return $fields;
}, 10, 2);```

### ` store_settings/rules ` [](#store-settings-rules)
`fluent_cart/store_settings/rules` — Filter validation rules for store settings
**When it runs:** This filter is applied when validating store settings form submissions. Use it to add or modify validation rules for settings fields.
**Parameters:**

- `$rules` (array): Validation rules keyed by field namephp
```
$rules = [
 'store_name' => 'required|sanitizeText|maxLength:200',
 'store_country' => 'required|sanitizeText|maxLength:200',
];```

**Returns:** `array` — The modified validation rules array
**Source:** `app/Http/Requests/FluentMetaRequest.php:34`
**Usage:**php
```
add_filter('fluent_cart/store_settings/rules', function ($rules) {
 // Add validation for a custom field
 $rules['custom_field'] = 'required|sanitizeText|maxLength:100';
 return $rules;
});```

### ` store_settings/sanitizer ` [](#store-settings-sanitizer)
`fluent_cart/store_settings/sanitizer` — Filter sanitization rules for store settings
**When it runs:** This filter is applied when sanitizing store settings input before saving. Each key maps to a sanitize callback function or a callable.
**Parameters:**

- `$sanitizer` (array): Sanitization callbacks keyed by field namephp
```
$sanitizer = [
 'store_name' => 'sanitize_text_field',
 'currency' => 'sanitize_text_field',
 'checkout_page_id' => 'intval',
 'shop_page_id' => 'intval',
 'store_address1' => 'sanitize_text_field',
 'store_country' => 'sanitize_text_field',
 'order_mode' => 'sanitize_text_field',
 // ... more fields
];```

**Returns:** `array` — The modified sanitizer array
**Source:** `app/Http/Requests/FluentMetaRequest.php:136`
**Usage:**php
```
add_filter('fluent_cart/store_settings/sanitizer', function ($sanitizer) {
 // Add sanitizer for a custom field
 $sanitizer['custom_field'] = 'sanitize_text_field';
 return $sanitizer;
});```

### ` confirmation_setting_fields ` [](#confirmation-setting-fields)
`fluent_cart/confirmation_setting_fields` — Filter confirmation page settings fields
**When it runs:** This filter is applied when rendering the confirmation (receipt) page settings in the admin. Use it to add additional settings fields for the order confirmation page.
**Parameters:**

- `$fields` (array): Field definitions for the confirmation page settingsphp
```
$fields = [
 'confirmation_page_id' => [
 'label' => 'Select custom page',
 'type' => 'select',
 'options' => $pages, // array of WordPress pages
 'value' => '',
 'note' => '[fluent_cart_receipt] shortcode instruction',
 ],
];```

- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified fields array
**Source:** `api/Confirmation.php:76`
**Usage:**php
```
add_filter('fluent_cart/confirmation_setting_fields', function ($fields, $data) {
 // Add a custom confirmation setting
 $fields['show_social_share'] = [
 'label' => 'Show social share buttons',
 'type' => 'checkbox',
 'value' => 'no',
 ];
 return $fields;
}, 10, 2);```

## Module Settings [](#module-settings)

### ` module_setting/fields ` [](#module-setting-fields)
`fluent_cart/module_setting/fields` — Filter module settings form fields
**When it runs:** This filter is applied when retrieving module settings field definitions. Modules register their settings fields through this filter.
**Parameters:**

- `$fields` (array): Array of module settings field definitions (empty by default)php
```
$fields = [];```

- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified fields array
**Source:** `api/ModuleSettings.php:21`
**Usage:**php
```
add_filter('fluent_cart/module_setting/fields', function ($fields, $data) {
 // Register a custom module's settings fields
 $fields['custom_module'] = [
 'title' => 'Custom Module',
 'fields' => [
 [
 'key' => 'api_key',
 'label' => 'API Key',
 'type' => 'text',
 ]
 ]
 ];
 return $fields;
}, 10, 2);```

### ` module_setting/default_values ` [](#module-setting-default-values)
`fluent_cart/module_setting/default_values` — Filter module settings default values
**When it runs:** This filter is applied when retrieving all module settings. It provides default values that are merged with saved settings, ensuring newly registered modules have their defaults applied.
**Parameters:**

- `$defaults` (array): Default values for module settings (empty by default)php
```
$defaults = [];```

- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified defaults array keyed by module name
**Source:** `api/ModuleSettings.php:42`
**Usage:**php
```
add_filter('fluent_cart/module_setting/default_values', function ($defaults, $data) {
 // Set defaults for a custom module
 $defaults['custom_module'] = [
 'active' => 'no',
 'api_key' => '',
 'mode' => 'sandbox',
 ];
 return $defaults;
}, 10, 2);```

### ` module_settings/plugin_addons ` [](#module-settings-plugin-addons)
`fluent_cart/module_settings/plugin_addons` — Filter plugin add-on modules list
**When it runs:** This filter is applied when listing available plugin add-ons in the module settings page. Use it to register third-party add-on modules that can be installed from the admin.
**Parameters:**

- `$addons` (array): Array of add-on module definitionsphp
```
$addons = [
 [
 'title' => 'Elementor Blocks',
 'description' => 'Enable to get Elementor Blocks for FluentCart.',
 'logo' => 'path/to/logo.svg',
 'dark_logo' => 'path/to/dark-logo.svg',
 'plugin_slug' => 'fluent-cart-elementor-blocks',
 'plugin_file' => 'fluent-cart-elementor-blocks/fluent-cart-elementor-blocks.php',
 'source_type' => 'cdn',
 'source_link' => 'https://example.com/plugin.zip',
 'upcoming' => false,
 'repo_link' => 'https://fluentcart.com/fluentcart-addons',
 ]
];```

**Returns:** `array` — The modified add-ons array
**Source:** `app/Http/Controllers/ModuleSettingsController.php:199`
**Usage:**php
```
add_filter('fluent_cart/module_settings/plugin_addons', function ($addons) {
 // Register a custom add-on module
 $addons[] = [
 'title' => 'My Custom Add-on',
 'description' => 'Extends FluentCart with custom features.',
 'logo' => plugin_dir_url(__FILE__) . 'logo.svg',
 'plugin_slug' => 'my-custom-addon',
 'plugin_file' => 'my-custom-addon/my-custom-addon.php',
 'source_type' => 'cdn',
 'source_link' => 'https://example.com/my-addon.zip',
 'upcoming' => false,
 ];
 return $addons;
});```

## Currency & Formatting [](#currency-formatting)

### ` global_currency_setting ` [](#global-currency-setting)
`fluent_cart/global_currency_setting` — Filter global currency settings
**When it runs:** This filter is applied when retrieving the global currency configuration. It runs after all currency settings have been resolved from stored values and defaults.
**Parameters:**

- `$settings` (array): The resolved currency settingsphp
```
$settings = [
 'currency' => 'USD',
 'locale' => 'auto',
 'currency_position' => 'left',
 'currency_separator' => 'dot',
 'decimal_separator' => '.',
 'decimal_points' => 0,
 'settings_type' => 'global',
 'order_mode' => 'test',
 'is_zero_decimal' => false,
 'currency_sign' => '$',
];```

- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified currency settings
**Source:** `api/CurrencySettings.php:52`
**Usage:**php
```
add_filter('fluent_cart/global_currency_setting', function ($settings, $data) {
 // Override currency settings
 $settings['currency'] = 'EUR';
 $settings['currency_sign'] = '€';
 $settings['currency_position'] = 'right';
 return $settings;
}, 10, 2);```

### ` available_currencies ` [](#available-currencies)
`fluent-cart/available_currencies` — Filter available currencies for the store
**When it runs:** This filter is applied when retrieving the list of available currencies for the currency selector in store settings. Note the hyphenated hook prefix (`fluent-cart/` instead of `fluent_cart/`).
**Parameters:**

- `$currencies` (array): Array of currency definitions keyed by currency codephp
```
$currencies = [
 'BDT' => [
 'label' => 'Bangladeshi Taka',
 'value' => 'BDT',
 'symbol' => '৳',
 ],
 'USD' => [
 'label' => 'United State Dollar',
 'value' => 'USD',
 'symbol' => '$',
 ],
 'GBP' => [
 'label' => 'United Kingdom',
 'value' => 'GBP',
 'symbol' => '£',
 ],
];```

- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified currencies array
**Source:** `app/Helpers/Helper.php:467`
**Usage:**php
```
add_filter('fluent-cart/available_currencies', function ($currencies, $data) {
 // Add a custom currency option
 $currencies['BTC'] = [
 'label' => 'Bitcoin',
 'value' => 'BTC',
 'symbol' => '₿',
 ];
 return $currencies;
}, 10, 2);```

### ` accepted_currencies ` [](#accepted-currencies)
`fluent_cart/accepted_currencies` — Filter the full list of accepted currencies
**When it runs:** This filter is applied when retrieving the complete list of currencies supported by payment gateways (based on Stripe's currency list). Used for currency validation and display throughout the plugin.
**Parameters:**

- `$currencies` (array): Associative array of currency code to localized namephp
```
$currencies = [
 'AED' => 'United Arab Emirates Dirham',
 'AFN' => 'Afghan Afghani',
 'ALL' => 'Albanian Lek',
 'AMD' => 'Armenian Dram',
 'ANG' => 'Netherlands Antillean Gulden',
 'AUD' => 'Australian Dollar',
 'USD' => 'United States Dollar',
 // ... 130+ currencies
];```

**Returns:** `array` — The modified currencies array
**Source:** `app/Helpers/CurrenciesHelper.php:20`
**Usage:**php
```
add_filter('fluent_cart/accepted_currencies', function ($currencies) {
 // Remove a currency from the accepted list
 unset($currencies['XRP']);
 // Add a custom currency
 $currencies['CUSTOM'] = 'My Custom Currency';
 return $currencies;
});```

### ` global_currency_symbols ` [](#global-currency-symbols)
`fluent_cart/global_currency_symbols` — Filter currency symbols map
**When it runs:** This filter is applied when retrieving the mapping of currency codes to their display symbols. Used for formatting prices throughout the plugin.
**Parameters:**

- `$symbols` (array): Associative array of currency code to HTML symbol entityphp
```
$symbols = [
 'AED' => '&#x62f;.&#x625;',
 'AUD' => '&#36;',
 'BDT' => '&#2547;&nbsp;',
 'EUR' => '&euro;',
 'GBP' => '&pound;',
 'USD' => '&#36;',
 // ... many more
];```

**Returns:** `array` — The modified currency symbols array
**Source:** `app/Helpers/CurrenciesHelper.php:195`
**Usage:**php
```
add_filter('fluent_cart/global_currency_symbols', function ($symbols) {
 // Override a symbol
 $symbols['BDT'] = 'Tk';
 return $symbols;
});```

### ` zero_decimal_currencies ` [](#zero-decimal-currencies)
`fluent_cart/zero_decimal_currencies` — Filter zero-decimal currencies list
**When it runs:** This filter is applied when retrieving currencies that do not use decimal subunits (e.g., Japanese Yen). These currencies store amounts without dividing by 100.
**Parameters:**

- `$currencies` (array): Associative array of zero-decimal currency code to localized namephp
```
$currencies = [
 'BIF' => 'Burundian Franc',
 'CLP' => 'Chilean Peso',
 'DJF' => 'Djiboutian Franc',
 'GNF' => 'Guinean Franc',
 'JPY' => 'Japanese Yen',
 'KMF' => 'Comorian Franc',
 'KRW' => 'South Korean Won',
 'MGA' => 'Malagasy Ariary',
 'PYG' => 'Paraguayan Guaraní',
 'RWF' => 'Rwandan Franc',
 'VND' => 'Vietnamese Dong',
 'VUV' => 'Vanuatu Vatu',
 'XAF' => 'Central African Cfa Franc',
 'XOF' => 'West African Cfa Franc',
 'XPF' => 'Cfp Franc',
 'UGX' => 'Ugandan Shilling',
];```

**Returns:** `array` — The modified zero-decimal currencies array
**Source:** `app/Helpers/CurrenciesHelper.php:383`
**Usage:**php
```
add_filter('fluent_cart/zero_decimal_currencies', function ($currencies) {
 // Add a custom zero-decimal currency
 $currencies['ISK'] = 'Icelandic Krona';
 return $currencies;
});```

### ` hide_unnecessary_decimals ` [](#hide-unnecessary-decimals)
`fluent_cart/hide_unnecessary_decimals` — Filter whether to hide .00 decimals in formatted prices
**When it runs:** This filter is applied during price formatting. When true, prices like `$10.00` will display as `$10` instead.
**Parameters:**

- `$hide` (bool): Whether to hide unnecessary decimals (default: `false`)
- `$context` (array): The amount and decimal contextphp
```
$context = [
 'amount' => 10.00, // The amount being formatted
 'decimal' => 2, // Number of decimal places
];```

**Returns:** `bool` — Whether to hide unnecessary trailing zeros
**Source:** `app/Helpers/Helper.php:343`
**Usage:**php
```
add_filter('fluent_cart/hide_unnecessary_decimals', function ($hide, $context) {
 // Always hide .00 from displayed prices
 return true;
}, 10, 2);```

## Admin UI & Menu [](#admin-ui-menu)

### ` admin_menu_title ` [](#admin-menu-title)
`fluent_cart/admin_menu_title` — Filter admin menu title
**When it runs:** This filter is applied when registering the WordPress admin menu, allowing you to change the menu label shown in the sidebar.
**Parameters:**

- `$menuTitle` (string): The default menu title (`'FluentCart'`)
- `$data` (array): Additional context data (empty array)

**Returns:** `string` — The modified menu title
**Source:** `app/Hooks/Handlers/MenuHandler.php:164`
**Usage:**php
```
add_filter('fluent_cart/admin_menu_title', function ($menuTitle, $data) {
 return 'My Store';
}, 10, 2);```

### ` admin_menu_position ` [](#admin-menu-position)
`fluent_cart/admin_menu_position` — Filter admin menu position
**When it runs:** This filter is applied when registering the admin menu, controlling its position in the WordPress sidebar.
**Parameters:**

- `$position` (int): The menu position (default: `3`)

**Returns:** `int` — The modified menu position
**Source:** `app/Hooks/Handlers/MenuHandler.php:173`
**Usage:**php
```
add_filter('fluent_cart/admin_menu_position', function ($position) {
 // Move menu lower in the sidebar
 return 25;
});```

### ` admin_filter_options ` [](#admin-filter-options)
`fluent_cart/admin_filter_options` — Filter admin filter options for list pages
**When it runs:** This filter is applied when loading admin filter options for orders, customers, products, licenses, and tax list pages.
**Parameters:**

- `$filterOptions` (array): Filter configurations for each list pagephp
```
$filterOptions = [
 'order_filter_options' => [...], // Order list filters
 'customer_filter_options' => [...], // Customer list filters
 'product_filter_options' => [...], // Product list filters
 'license_filter_options' => [...], // License list filters
 'tax_filter_options' => [...], // Tax list filters
];```

- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified filter options array
**Source:** `app/Hooks/Handlers/MenuHandler.php:380`
**Usage:**php
```
add_filter('fluent_cart/admin_filter_options', function ($filterOptions, $data) {
 // Add a custom filter for the orders list
 $filterOptions['order_filter_options']['custom_status'] = [
 'label' => 'Custom Status',
 'type' => 'select',
 'options' => ['pending', 'approved'],
 ];
 return $filterOptions;
}, 10, 2);```

### ` admin_app_data ` [](#admin-app-data)
`fluent_cart/admin_app_data` — Filter admin Vue app localized data
**When it runs:** This filter is applied when loading the admin SPA, providing the full configuration object passed to the Vue application via `wp_localize_script`.
**Parameters:**

- `$adminLocalizeData` (array): The complete admin app dataphp
```
$adminLocalizeData = [
 'app_config' => [...], // App version, permissions, logos
 'slug' => 'fluent-cart',
 'admin_url' => 'https://site.com/wp-admin/admin.php?page=fluent-cart#/',
 'frontend_url' => '...',
 'nonce' => '...',
 'rest' => [...], // REST API config
 'me' => [...], // Current user info
 'shop' => [...], // Shop configuration
 'product_statuses' => [...],
 'payment_routes' => [...], // Payment gateway admin routes
 'order_statues' => [...],
 'trans' => [...], // Translation strings
 'filter_options' => [...],
 'modules_settings' => [...],
 'admin_notices' => [...],
 // ... many more properties
];```

**Returns:** `array` — The modified admin app data
**Source:** `app/Hooks/Handlers/MenuHandler.php:398`
**Usage:**php
```
add_filter('fluent_cart/admin_app_data', function ($adminLocalizeData) {
 // Add custom data accessible from the Vue admin app
 $adminLocalizeData['custom_setting'] = 'custom_value';
 $adminLocalizeData['my_plugin_config'] = [
 'enabled' => true,
 'api_url' => 'https://api.example.com',
 ];
 return $adminLocalizeData;
});```

### ` admin_notices ` [](#admin-notices)
`fluent_cart/admin_notices` — Filter admin notices
**When it runs:** This filter is applied when loading the admin interface, allowing plugins to inject notices that display in the FluentCart admin panel.
**Parameters:**

- `$notices` (array): Array of notice objects (default: `[]`)

**Returns:** `array` — The modified notices array
**Source:** `app/Hooks/Handlers/MenuHandler.php:449`
**Usage:**php
```
add_filter('fluent_cart/admin_notices', function ($notices) {
 $notices[] = [
 'type' => 'warning',
 'message' => 'Please configure your payment gateway before going live.',
 ];
 return $notices;
});```

### ` admin_base_url ` [](#admin-base-url)
`fluent_cart/admin_base_url` — Filter admin base URL
**When it runs:** This filter is applied when constructing admin navigation URLs throughout the plugin, including product menus and global navigation items.
**Parameters:**

- `$baseUrl` (string): The default admin base URL (`admin_url('admin.php?page=fluent-cart#/')`)
- `$data` (array): Additional context data (empty array)

**Returns:** `string` — The modified base URL
**Source:** `app/Helpers/AdminHelper.php:22`
**Usage:**php
```
add_filter('fluent_cart/admin_base_url', function ($baseUrl, $data) {
 // Use a custom admin page
 return admin_url('admin.php?page=my-custom-cart#/');
}, 10, 2);```

### ` product_admin_items ` [](#product-admin-items)
`fluent_cart/product_admin_items` — Filter admin product action menu items
**When it runs:** This filter is applied when rendering the product action menu in the admin product detail view. Use it to add custom navigation tabs to individual product pages.
**Parameters:**

- `$menuItems` (array): Array of menu item definitionsphp
```
$menuItems = [
 'product_edit' => [
 'label' => 'Edit Product',
 'link' => 'admin.php?page=fluent-cart#/products/123',
 ],
 'product_upgrade_paths' => [
 'label' => 'Upgrade Paths',
 'link' => 'admin.php?page=fluent-cart#/products/123/upgrade-paths',
 ],
 'product_integrations' => [
 'label' => 'Integrations',
 'link' => 'admin.php?page=fluent-cart#/products/123/integrations',
 ],
];```

- `$context` (array): Context data with product infophp
```
$context = [
 'product_id' => 123,
 'base_url' => 'admin.php?page=fluent-cart#/',
];```

**Returns:** `array` — The modified menu items array
**Source:** `app/Helpers/AdminHelper.php:24`
**Usage:**php
```
add_filter('fluent_cart/product_admin_items', function ($menuItems, $context) {
 $productId = $context['product_id'];
 $baseUrl = $context['base_url'];
 // Add a custom product tab
 $menuItems['product_analytics'] = [
 'label' => 'Analytics',
 'link' => $baseUrl . 'products/' . $productId . '/analytics',
 ];
 return $menuItems;
}, 10, 2);```

### ` global_admin_menu_items ` [](#global-admin-menu-items)
`fluent_cart/global_admin_menu_items` — Filter global admin navigation menu
**When it runs:** This filter is applied when rendering the global admin navigation bar at the top of the FluentCart admin pages. Use it to add or modify top-level navigation items.
**Parameters:**

- `$menuItems` (array): Array of navigation itemsphp
```
$menuItems = [
 'dashboard' => [
 'label' => 'Dashboard',
 'link' => 'admin.php?page=fluent-cart#/',
 ],
 'orders' => [
 'label' => 'Orders',
 'link' => 'admin.php?page=fluent-cart#/orders',
 'permission' => ['orders/view'],
 ],
 'customers' => [
 'label' => 'Customers',
 'link' => 'admin.php?page=fluent-cart#/customers',
 'permission' => ['customers/view', 'customers/manage'],
 ],
 'products' => [
 'label' => 'Products',
 'link' => 'admin.php?page=fluent-cart#/products',
 'permission' => ['products/view'],
 ],
];```

**Returns:** `array` — The modified menu items array
**Source:** `app/Helpers/AdminHelper.php:80`
**Usage:**php
```
add_filter('fluent_cart/global_admin_menu_items', function ($menuItems) {
 // Add a custom top-level navigation item
 $menuItems['custom_reports'] = [
 'label' => 'Custom Reports',
 'link' => admin_url('admin.php?page=fluent-cart#/custom-reports'),
 'permission' => ['reports/view'],
 ];
 return $menuItems;
});```

### ` dummy_product_info ` [](#dummy-product-info)
`fluent_cart/dummy_product_info` — Filter dummy product for onboarding
**When it runs:** This filter is applied when loading the admin app data. It provides dummy product information used during the onboarding flow when the store has no products yet.
**Parameters:**

- `$dummyProduct` (array): Dummy product info (default: `[]`)

**Returns:** `array` — The modified dummy product info
**Source:** `app/Hooks/Handlers/MenuHandler.php:435`
**Usage:**php
```
add_filter('fluent_cart/dummy_product_info', function ($dummyProduct) {
 return [
 'title' => 'Sample Digital Product',
 'price' => 2999, // in cents
 'type' => 'digital',
 ];
});```

### ` storage_driver_settings_routes ` [](#storage-driver-settings-routes)
`fluent_cart/storage/storage_driver_settings_routes` — Filter storage driver admin routes
**When it runs:** This filter is applied when loading the admin app, allowing storage driver plugins to register their settings routes in the admin SPA navigation.
**Parameters:**

- `$routes` (array): Array of storage driver route definitions (default: `[]`)
- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified routes array
**Source:** `app/Hooks/Handlers/MenuHandler.php:367`
**Usage:**php
```
add_filter('fluent_cart/storage/storage_driver_settings_routes', function ($routes, $data) {
 $routes[] = [
 'key' => 's3_storage',
 'title' => 'S3 Storage',
 'route' => 'settings/storage/s3',
 ];
 return $routes;
}, 10, 2);```

## Permissions & Auth [](#permissions-auth)

### ` permission/all_roles ` [](#permission-all-roles)
`fluent_cart/permission/all_roles` — Filter permission roles
**When it runs:** This filter is applied when retrieving all available permission roles. FluentCart ships with four roles (super_admin, manager, worker, accountant), each with predefined permission sets.
**Parameters:**

- `$allRoles` (array): Array of role definitionsphp
```
$allRoles = [
 'super_admin' => [
 'title' => 'Super Admin',
 'descriptions' => 'All permissions...',
 'permissions' => ['*'],
 ],
 'manager' => [
 'title' => 'Manager',
 'descriptions' => 'Everything except settings...',
 'permissions' => [
 'orders/view', 'orders/manage', 'orders/manage_statuses',
 'orders/export', 'orders/delete', 'products/view',
 'products/manage', 'products/delete', 'customers/view',
 'customers/manage', 'subscriptions/view',
 'subscriptions/manage', 'licenses/view', 'licenses/manage',
 'coupons/view', 'coupons/manage', 'coupons/delete',
 'reports/view', 'reports/export', 'integrations/view',
 'integrations/manage', 'integrations/delete',
 ],
 ],
 'worker' => [
 'title' => 'Worker',
 'descriptions' => 'View access for products, customers...',
 'permissions' => [
 'products/view', 'customers/view', 'orders/view',
 'orders/manage_statuses', 'subscriptions/view',
 'licenses/view', 'coupons/view', 'coupons/manage',
 'integrations/view',
 ],
 ],
 'accountant' => [
 'title' => 'Accountant',
 'descriptions' => 'View access for products, customers, orders...',
 'permissions' => [
 'orders/view', 'orders/export', 'reports/view',
 'reports/export', 'products/view', 'customers/view',
 'subscriptions/view', 'licenses/view', 'coupons/view',
 'integrations/view',
 ],
 ],
];```

- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified roles array
**Source:** `app/Services/Permission/PermissionManager.php:92`
**Usage:**php
```
add_filter('fluent_cart/permission/all_roles', function ($allRoles, $data) {
 // Add a custom role
 $allRoles['support_agent'] = [
 'title' => 'Support Agent',
 'descriptions' => 'View orders and customers, manage order statuses',
 'permissions' => [
 'orders/view',
 'orders/manage_statuses',
 'customers/view',
 ],
 ];
 return $allRoles;
}, 10, 2);```

## Translations [](#translations)

### ` admin_translations ` [](#admin-translations)
`fluent_cart/admin_translations` — Filter admin panel translations
**When it runs:** This filter is applied when loading translation strings for the admin Vue SPA. The translations are passed to the frontend as a localized JavaScript object.
**Parameters:**

- `$translations` (array): Key-value pairs of translation strings loaded from `admin-translation.php`
- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified translations array
**Source:** `app/Services/Translations/TransStrings.php:9`
**Usage:**php
```
add_filter('fluent_cart/admin_translations', function ($translations, $data) {
 // Override or add admin translations
 $translations['custom_label'] = __('My Custom Label', 'my-plugin');
 return $translations;
}, 10, 2);```

### ` blocks_translations ` [](#blocks-translations)
`fluent_cart/blocks_translations` — Filter block editor translations
**When it runs:** This filter is applied when loading translation strings for the FluentCart block editor interface.
**Parameters:**

- `$translations` (array): Key-value pairs of translation strings loaded from `block-editor-translation.php`
- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified translations array
**Source:** `app/Services/Translations/TransStrings.php:15`
**Usage:**php
```
add_filter('fluent_cart/blocks_translations', function ($translations, $data) {
 // Override block editor translations
 $translations['Save'] = __('Save Changes', 'my-plugin');
 return $translations;
}, 10, 2);```

### ` customer_profile_translations ` [](#customer-profile-translations)
`fluent_cart/customer_profile_translations` — Filter customer profile translations
**When it runs:** This filter is applied when loading translation strings for the customer profile (My Account) frontend page.
**Parameters:**

- `$translations` (array): Key-value pairs of translation strings loaded from `customer-profile-translation.php`
- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified translations array
**Source:** `app/Services/Translations/TransStrings.php:87`
**Usage:**php
```
add_filter('fluent_cart/customer_profile_translations', function ($translations, $data) {
 // Customize customer-facing labels
 $translations['My Orders'] = __('Purchase History', 'my-plugin');
 return $translations;
}, 10, 2);```

### ` checkout_translations ` [](#checkout-translations)
`fluent_cart/checkout_translations` — Filter checkout page translations
**When it runs:** This filter is applied when loading translation strings for the checkout page frontend.
**Parameters:**

- `$translations` (array): Key-value pairs of translation strings loaded from `checkout-translation.php`
- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified translations array
**Source:** `app/Services/Translations/TransStrings.php:101`
**Usage:**php
```
add_filter('fluent_cart/checkout_translations', function ($translations, $data) {
 // Customize checkout button text
 $translations['Place Order'] = __('Complete Purchase', 'my-plugin');
 return $translations;
}, 10, 2);```

### ` payments_translations ` [](#payments-translations)
`fluent_cart/payments_translations` — Filter payment translations
**When it runs:** This filter is applied when loading translation strings for payment-related UI elements on the frontend.
**Parameters:**

- `$translations` (array): Key-value pairs of translation strings loaded from `payments-translation.php`
- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified translations array
**Source:** `app/Services/Translations/TransStrings.php:107`
**Usage:**php
```
add_filter('fluent_cart/payments_translations', function ($translations, $data) {
 // Customize payment labels
 $translations['Credit Card'] = __('Debit/Credit Card', 'my-plugin');
 return $translations;
}, 10, 2);```

### ` pro/admin_translations ` Pro [](#pro-admin-translations)
`fluent_cart_pro/admin_translations` — Filter Pro admin translations
**When it runs:** This filter is applied when loading translation strings specific to FluentCart Pro features in the admin panel.
**Parameters:**

- `$translations` (array): Key-value pairs of Pro-specific translation strings
- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified translations array
**Source:** `fluent-cart-pro/app/Services/Translations/Translations.php:24`
**Usage:**php
```
add_filter('fluent_cart_pro/admin_translations', function ($translations, $data) {
 // Override Pro admin translations
 $translations['License Management'] = __('License Keys', 'my-plugin');
 return $translations;
}, 10, 2);```

## Email & Notifications [](#email-notifications)

### ` email_notifications ` [](#email-notifications-1)
`fluent_cart/email_notifications` — Filter email notification settings
**When it runs:** This filter is applied when retrieving the list of available email notifications. Each notification includes its configuration such as recipients, subject template, and default body. Runs before merging with saved notification configs.
**Parameters:**

- `$settings` (array): Associative array of notification definitions keyed by notification namephp
```
$settings = [
 'order_completed' => [
 'title' => 'Order Completed',
 'group_label' => 'Order Actions',
 'settings' => [
 'subject' => 'Order #{order.id} Completed',
 'email_body' => '',
 'is_default_body' => 'yes',
 'to' => '{{order.customer.email}}',
 'status' => 'active',
 ],
 ],
 // ... more notification types
];```

**Returns:** `array` — The modified notification settings array
**Source:** `app/Services/Email/EmailNotifications.php:24`
**Usage:**php
```
add_filter('fluent_cart/email_notifications', function ($settings) {
 // Add a custom email notification
 $settings['custom_notification'] = [
 'title' => 'Custom Alert',
 'group_label' => 'Custom Actions',
 'settings' => [
 'subject' => 'Custom Alert for Order #{order.id}',
 'email_body' => '',
 'is_default_body' => 'yes',
 'to' => '{{settings.admin_email}}',
 'status' => 'active',
 ],
 ];
 return $settings;
});```

### ` keep_email_body_draft ` [](#keep-email-body-draft)
`fluent_cart/keep_email_body_draft` — Filter whether to prevent email body reset
**When it runs:** This filter is applied when a notification is switched back to its default body. By default, the custom email body is cleared. Return `true` to preserve the custom body as a draft.
**Parameters:**

- `$keepDraft` (bool): Whether to keep the custom body as draft (default: `false`)
- `$context` (array): The notification contextphp
```
$context = [
 'notification_name' => 'order_completed',
];```

**Returns:** `bool` — Whether to preserve the custom email body
**Source:** `app/Services/Email/EmailNotifications.php:520`
**Usage:**php
```
add_filter('fluent_cart/keep_email_body_draft', function ($keepDraft, $context) {
 // Always preserve custom email bodies as drafts
 return true;
}, 10, 2);```

### ` theme_pref ` [](#theme-pref)
`fluent_cart/theme_pref` — Filter email template theme preferences
**When it runs:** This filter is applied when the block parser resolves the email theme preferences, including the color palette and font sizes used in email templates.
**Parameters:**

- `$pref` (array): Theme preference settingsphp
```
$pref = [
 'colors' => [...], // Color palette array
 'font_sizes' => [...], // Font size definitions
];```

**Returns:** `array` — The modified theme preferences
**Source:** `app/Services/Email/FluentBlockParser.php:1997`
**Usage:**php
```
add_filter('fluent_cart/theme_pref', function ($pref) {
 // Add brand colors to the email palette
 $pref['colors'][] = [
 'name' => 'Brand Primary',
 'slug' => 'brand-primary',
 'color' => '#FF6600',
 ];
 return $pref;
});```

### ` condition_presets ` [](#condition-presets)
`fluent_cart/condition_presets` — Filter email condition presets
**When it runs:** This filter is applied when retrieving available condition presets for email template conditional blocks. Presets define reusable conditions like "has note" or "has downloads" that control block visibility.
**Parameters:**

- `$presets` (array): Array of condition preset definitionsphp
```
$presets = [
 [
 'id' => 'has_order_note',
 'label' => 'Has Order Note',
 'hint' => 'Show when the order has a note.',
 'shortcode' => '{{order.note}}',
 'condition' => 'not_empty',
 'compareValue' => '',
 ],
 [
 'id' => 'has_downloads',
 'label' => 'Has Downloads',
 'hint' => 'Show when downloadable files are attached.',
 'shortcode' => '{{order.downloads}}',
 'condition' => 'not_empty',
 'compareValue' => '',
 ],
];```

**Returns:** `array` — The modified presets array
**Source:** `app/Services/Email/ConditionPresets.php:124`
**Usage:**php
```
add_filter('fluent_cart/condition_presets', function ($presets) {
 // Add a custom condition preset
 $presets[] = [
 'id' => 'is_high_value',
 'label' => 'High Value Order',
 'hint' => 'Show when order total exceeds $100.',
 'shortcode' => '{{order.total_amount}}',
 'condition' => 'greater_than',
 'compareValue' => '10000', // in cents
 ];
 return $presets;
});```

### ` evaluate_condition_preset ` [](#evaluate-condition-preset)
`fluent_cart/evaluate_condition_preset` — Filter evaluate condition preset
**When it runs:** This filter is applied when evaluating a condition preset that has no shortcode and no callback defined. It serves as a fallback for custom condition evaluation logic.
**Parameters:**

- `$result` (bool): The evaluation result (default: `false`)
- `$context` (array): Full context for the condition evaluationphp
```
$context = [
 'preset' => [...], // The resolved preset definition
 'resolved' => [...], // Resolved condition data
 'data' => [...], // Template data (order, customer, etc.)
 'block_attrs' => [...], // Block attributes
];```

**Returns:** `bool` — Whether the condition is met
**Source:** `app/Services/Email/Blocks/BaseBlock.php:196`
**Usage:**php
```
add_filter('fluent_cart/evaluate_condition_preset', function ($result, $context) {
 $preset = $context['preset'];
 if ($preset && $preset['id'] === 'my_custom_condition') {
 $order = $context['data']['order'] ?? null;
 return $order && $order->total_amount > 10000;
 }
 return $result;
}, 10, 2);```

### ` confirmation_shortcodes ` [](#confirmation-shortcodes)
`fluent_cart/confirmation_shortcodes` — Filter confirmation page shortcodes
**When it runs:** This filter is applied when retrieving available shortcodes for the order confirmation (receipt) page template editor.
**Parameters:**

- `$groups` (array): Array of shortcode groups (customer, order, general, settings)php
```
$groups = [
 [
 'title' => 'Customer',
 'key' => 'customer',
 'shortcodes' => [
 '{{customer.first_name}}' => 'First Name',
 '{{customer.email}}' => 'Email',
 ],
 ],
 [
 'title' => 'Order',
 'key' => 'order',
 'shortcodes' => [
 '{{order.id}}' => 'Order ID',
 '{{order.total_amount_formatted}}' => 'Order Total',
 // ... many more
 ],
 ],
 // ... general, settings groups
];```

- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified shortcode groups array
**Source:** `app/Helpers/EditorShortCodeHelper.php:201`
**Usage:**php
```
add_filter('fluent_cart/confirmation_shortcodes', function ($groups, $data) {
 // Add a custom shortcode group
 $groups[] = [
 'title' => 'Custom Data',
 'key' => 'custom',
 'shortcodes' => [
 '{{custom.tracking_url}}' => 'Tracking URL',
 ],
 ];
 return $groups;
}, 10, 2);```

### ` editor_shortcodes ` [](#editor-shortcodes)
`fluent_cart/editor_shortcodes` — Filter email editor shortcodes
**When it runs:** This filter is applied when retrieving available shortcodes for the email notification template editor. Includes order, general, customer, transaction, settings, and license shortcode groups.
**Parameters:**

- `$shortCodes` (array): Associative array of shortcode groupsphp
```
$shortCodes = [
 'order' => [...], // Order shortcodes
 'general' => [...], // General shortcodes
 'customer' => [...], // Customer shortcodes
 'transaction' => [...], // Transaction shortcodes
 'settings' => [...], // Settings shortcodes
 'license' => [...], // License shortcodes
];```

**Returns:** `array` — The modified shortcodes array
**Source:** `app/Helpers/EditorShortCodeHelper.php:277`
**Usage:**php
```
add_filter('fluent_cart/editor_shortcodes', function ($shortCodes) {
 // Add a custom shortcode group for email templates
 $shortCodes['custom'] = [
 'title' => 'Custom Fields',
 'key' => 'custom',
 'shortcodes' => [
 '{{custom.loyalty_points}}' => 'Loyalty Points',
 '{{custom.referral_code}}' => 'Referral Code',
 ],
 ];
 return $shortCodes;
});```

### ` disable_email_celebration_messages ` [](#disable-email-celebration-messages)
`fluent_cart/disable_email_celebration_messages` — Filter whether to disable celebration messages in admin emails
**When it runs:** This filter is applied when generating admin notification emails. By default, FluentCart adds a random celebration message (e.g., "Woo-Hoo! Another Sale!") to admin order emails.
**Parameters:**

- `$disable` (bool): Whether to disable celebration messages (default: `false`)
- `$context` (array): The notification type contextphp
```
$context = [
 'type' => 'order', // or 'subscription', etc.
];```

**Returns:** `bool` — Whether to disable the celebration messages
**Source:** `app/Services/TemplateService.php:114`
**Usage:**php
```
add_filter('fluent_cart/disable_email_celebration_messages', function ($disable, $context) {
 // Disable celebrations for all admin emails
 return true;
}, 10, 2);```

## Block Editor [](#block-editor)

### ` block_editor_require_nonce ` [](#block-editor-require-nonce)
`fluent_cart/block_editor_require_nonce` — Filter whether the block editor requires nonce verification
**When it runs:** This filter is applied when loading the FluentCart block editor (email template editor). It controls whether nonce verification is enforced for editor access.
**Parameters:**

- `$requireNonce` (bool): Whether to require nonce (default: `true`)
- `$blockType` (string): The block editor type being loaded
- `$request` (array): The current request data

**Returns:** `bool` — Whether to enforce nonce verification
**Source:** `app/Hooks/Handlers/FluentCartBlockEditorHandler.php:54`
**Usage:**php
```
add_filter('fluent_cart/block_editor_require_nonce', function ($requireNonce, $blockType, $request) {
 // Disable nonce for specific block types (use with caution)
 if ($blockType === 'preview') {
 return false;
 }
 return $requireNonce;
}, 10, 3);```

### ` disable_pro_email_templates ` [](#disable-pro-email-templates)
`fluent_cart/disable_pro_email_templates` — Filter whether to disable Pro email templates
**When it runs:** This filter is applied when loading starter templates in the email block editor. When `true`, templates with `/pro` or `/modern` in their IDs are excluded from the template picker.
**Parameters:**

- `$disable` (bool): Whether to disable Pro templates (default: `true`)

**Returns:** `bool` — Whether to filter out Pro email templates
**Source:** `app/Hooks/Handlers/FluentCartBlockEditorHandler.php:230`
**Usage:**php
```
add_filter('fluent_cart/disable_pro_email_templates', function ($disable) {
 // Enable Pro templates when Pro is active
 if (defined('FLUENT_CART_PRO')) {
 return false;
 }
 return $disable;
});```

### ` skip_no_conflict (editor) ` [](#skip-no-conflict-editor)
`fluent_cart_editor/skip_no_conflict` — Filter whether to skip script unloading in the block editor
**When it runs:** This filter is applied when the email block editor loads. FluentCart aggressively unloads third-party scripts to prevent conflicts. Return `true` to skip this behavior and allow all scripts.
**Parameters:**

- `$skip` (bool): Whether to skip no-conflict mode (default: `false`)

**Returns:** `bool` — Whether to skip unloading third-party scripts
**Source:** `app/Hooks/Handlers/FluentCartBlockEditorHandler.php:638`
**Usage:**php
```
add_filter('fluent_cart_editor/skip_no_conflict', function ($skip) {
 // Allow all scripts in the block editor
 return true;
});```

### ` asset_listed_slugs (editor) ` [](#asset-listed-slugs-editor)
`fluent_cart_editor/asset_listed_slugs` — Filter approved script slugs in block editor
**When it runs:** This filter is applied when unloading third-party scripts from the email block editor. Only scripts matching these slug patterns (regex) will be kept.
**Parameters:**

- `$approvedSlugs` (array): Array of regex slug patterns to keepphp
```
$approvedSlugs = [
 '\/gutenberg\/',
];
// 'fluent-cart' is always appended automatically```

**Returns:** `array` — The modified approved slugs array
**Source:** `app/Hooks/Handlers/FluentCartBlockEditorHandler.php:650`
**Usage:**php
```
add_filter('fluent_cart_editor/asset_listed_slugs', function ($approvedSlugs) {
 // Allow scripts from a specific plugin
 $approvedSlugs[] = '\/my-custom-plugin\/';
 return $approvedSlugs;
});```

### ` skip_no_conflict (styles) ` [](#skip-no-conflict-styles)
`fluent_cart/skip_no_conflict` — Filter whether to skip style unloading in the block editor
**When it runs:** This filter is applied when unloading third-party stylesheets from the email block editor. Return `true` to allow all styles to load without filtering.
**Parameters:**

- `$skip` (bool): Whether to skip no-conflict mode for styles (default: `false`)
- `$type` (string): The asset type (`'styles'`)

**Returns:** `bool` — Whether to skip unloading third-party styles
**Source:** `app/Hooks/Handlers/FluentCartBlockEditorHandler.php:707`
**Usage:**php
```
add_filter('fluent_cart/skip_no_conflict', function ($skip, $type) {
 if ($type === 'styles') {
 return true; // Allow all styles
 }
 return $skip;
}, 10, 2);```

### ` asset_listed_slugs (styles) ` [](#asset-listed-slugs-styles)
`fluent_cart/asset_listed_slugs` — Filter approved style slugs in block editor
**When it runs:** This filter is applied when filtering third-party stylesheets from the email block editor. Only styles matching these slug patterns (regex) will be kept.
**Parameters:**

- `$approvedSlugs` (array): Array of regex slug patterns to keepphp
```
$approvedSlugs = [
 '\/gutenberg\/',
];
// '\/fluent-cart\/' is always appended automatically```

**Returns:** `array` — The modified approved slugs array
**Source:** `app/Hooks/Handlers/FluentCartBlockEditorHandler.php:720`
**Usage:**php
```
add_filter('fluent_cart/asset_listed_slugs', function ($approvedSlugs) {
 // Allow styles from a specific plugin
 $approvedSlugs[] = '\/my-custom-plugin\/';
 return $approvedSlugs;
});```

### ` block_editor_unregister_all_patterns ` [](#block-editor-unregister-all-patterns)
`fluent_cart/block_editor_unregister_all_patterns` — Filter whether to unregister default block patterns
**When it runs:** This filter is applied when loading the email block editor. By default, all WordPress core block patterns are removed since they are designed for web pages, not emails.
**Parameters:**

- `$shouldUnregister` (bool): Whether to unregister patterns (default: `true`)
- `$context` (string): The editor context
- `$data` (array): Additional context data

**Returns:** `bool` — Whether to unregister default block patterns
**Source:** `app/Hooks/Handlers/FluentCartBlockEditorHandler.php:764`
**Usage:**php
```
add_filter('fluent_cart/block_editor_unregister_all_patterns', function ($shouldUnregister, $context, $data) {
 // Keep default patterns for a specific context
 if ($context === 'page') {
 return false;
 }
 return $shouldUnregister;
}, 10, 3);```

### ` block_editor_settings ` [](#block-editor-settings)
`fluent_cart/block_editor_settings` — Filter block editor settings
**When it runs:** This filter is applied when preparing the settings object for the Gutenberg-based email block editor. It includes styles, image sizes, block categories, and editor configuration.
**Parameters:**

- `$editor_settings` (array): Editor configuration arrayphp
```
$editor_settings = [
 '__experimentalFeatures' => [...],
 'styles' => [...], // Editor stylesheets
 'defaultEditorStyles' => [...], // Base CSS
 'imageSizes' => [...], // Available image sizes
 'blockCategories' => [...], // Block categories
];```

**Returns:** `array` — The modified editor settings
**Source:** `app/Hooks/Handlers/FluentCartBlockEditorHandler.php:1142`
**Usage:**php
```
add_filter('fluent_cart/block_editor_settings', function ($editor_settings) {
 // Add a custom block category
 $editor_settings['blockCategories'][] = [
 'slug' => 'custom-blocks',
 'title' => 'Custom Blocks',
 ];
 return $editor_settings;
});```

### ` editor_allowed_block_types ` [](#editor-allowed-block-types)
`fluent_cart/editor_allowed_block_types` — Filter allowed block types in the email editor
**When it runs:** This filter is applied when determining which Gutenberg block types are available in the email block editor. Only whitelisted blocks appear in the inserter.
**Parameters:**

- `$allowedBlockTypes` (array): Array of allowed block type names (e.g., `'core/paragraph'`, `'core/image'`, `'fluent-cart/button'`)
- `$editorContext` (string): The editor context such as `'template'`, `'campaign'`, or `'recurring_campaign'`

**Returns:** `array` — The modified allowed block types array
**Source:** `app/Hooks/Handlers/FluentCartBlockEditorHandler.php:1282`
**Usage:**php
```
add_filter('fluent_cart/editor_allowed_block_types', function ($allowedBlockTypes, $editorContext) {
 // Add a custom block to the email editor
 $allowedBlockTypes[] = 'my-plugin/custom-email-block';
 return $allowedBlockTypes;
}, 10, 2);```

## Logging & Utilities [](#logging-utilities)

### ` logs/allowed_models ` [](#logs-allowed-models)
`fluent_cart/logs/allowed_models` — Filter models allowed in activity logs
**When it runs:** This filter is applied when creating activity log entries. Only module names matching this list will have their model type auto-resolved for log categorization.
**Parameters:**

- `$allowedModels` (array): Array of allowed model name stringsphp
```
$allowedModels = [
 'order',
 'product',
 'productVariation',
 'user',
 'coupon',
 'subscription',
];```

**Returns:** `array` — The modified allowed models array
**Source:** `boot/globals.php:88`
**Usage:**php
```
add_filter('fluent_cart/logs/allowed_models', function ($allowedModels) {
 // Add a custom model for logging
 $allowedModels[] = 'license';
 $allowedModels[] = 'customEntity';
 return $allowedModels;
});```

### ` site_prefix ` [](#site-prefix)
`fluent_cart/site_prefix` — Filter site prefix for external APIs
**When it runs:** This filter is applied when generating a site-specific prefix string derived from the home URL. Used as an identifier when communicating with external APIs or services.
**Parameters:**

- `$sitePrefix` (string): The generated prefix (e.g., `'example_com'` from `https://example.com`)
- `$data` (array): Additional context data (empty array)

**Returns:** `string` — The modified site prefix
**Source:** `app/Helpers/Helper.php:1478`
**Usage:**php
```
add_filter('fluent_cart/site_prefix', function ($sitePrefix, $data) {
 // Use a custom site identifier
 return 'my_store_prod';
}, 10, 2);```

### ` utm/allowed_keys ` [](#utm-allowed-keys)
`fluent_cart/utm/allowed_keys` — Filter allowed UTM parameter keys
**When it runs:** This filter is applied when capturing UTM tracking parameters from the checkout URL. Only parameters matching these keys will be stored with orders.
**Parameters:**

- `$keys` (array): Array of allowed UTM parameter key namesphp
```
$keys = [
 'utm_campaign',
 'utm_content',
 'utm_term',
 'utm_source',
 'utm_medium',
 'utm_id',
 'refer_url',
 'fbclid',
 'gclid',
];```

- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified allowed keys array
**Source:** `app/Helpers/UtmHelper.php:26`
**Usage:**php
```
add_filter('fluent_cart/utm/allowed_keys', function ($keys, $data) {
 // Track additional parameters
 $keys[] = 'msclkid'; // Microsoft Ads
 $keys[] = 'ttclid'; // TikTok Ads
 $keys[] = 'affiliate_id';
 return $keys;
}, 10, 2);```

### ` cleanup/old_carts_days ` [](#cleanup-old-carts-days)
`fluent_cart/cleanup/old_carts_days` — Filter days before abandoned cart cleanup
**When it runs:** This filter is applied during the daily scheduled cleanup task. Carts older than this number of days (based on `updated_at`) are automatically deleted.
**Parameters:**

- `$days` (int): Number of days before cart deletion (default: `30`)

**Returns:** `int` — The modified number of days
**Source:** `app/Hooks/Scheduler/AutoSchedules/DailyScheduler.php:32`
**Usage:**php
```
add_filter('fluent_cart/cleanup/old_carts_days', function ($days) {
 // Keep abandoned carts for 90 days instead of 30
 return 90;
});```

### ` get_dynamic_search_{$key} ` [](#get-dynamic-search-key)
`fluent_cart/get_dynamic_search_{$key}` — Filter dynamic search option results
**When it runs:** This filter is applied when the admin settings page performs a dynamic search (e.g., searching for pages, users, or custom entities in select fields). The `{$key}` portion is the `search_for` parameter value.
**Parameters:**

- `$results` (array): Search results (default: `[]`)
- `$context` (array): Search contextphp
```
$context = [
 'searchBy' => 'search term entered by user',
];```

**Returns:** `array` — The search results array
**Source:** `api/Helper.php:165`
**Usage:**php
```
// Example: Register a dynamic search handler for "custom_entities"
add_filter('fluent_cart/get_dynamic_search_custom_entities', function ($results, $context) {
 $searchTerm = $context['searchBy'];
 // Return matching entities
 return [
 ['id' => 1, 'label' => 'Entity One'],
 ['id' => 2, 'label' => 'Entity Two'],
 ];
}, 10, 2);```

---

## Orders & Payments

Source: https://dev.fluentcart.com/hooks/filters/orders-and-payments.html


All filters related to [Order](https://dev.fluentcart.com/database/models/order.html) lifecycle, payment processing, gateway integrations, and taxes.
## Order Statuses [](#order-statuses)

### ` order_statuses ` [](#order-statuses-1)
`fluent_cart/order_statuses` — Filter available order statuses
**When it runs:** Applied when retrieving the list of available order statuses throughout the admin and storefront.
**Parameters:**

- `$statuses` (array): Associative array of order statuses (key => translated label)php
```
$statuses = [
 'processing' => 'Processing',
 'completed' => 'Completed',
 'on-hold' => 'On Hold',
 'canceled' => 'Canceled',
 'failed' => 'Failed',
];```

- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified order statuses array
**Source:** `app/Helpers/Status.php:159`
**Usage:**php
```
add_filter('fluent_cart/order_statuses', function ($statuses, $data) {
 // Add a custom order status
 $statuses['awaiting_pickup'] = __('Awaiting Pickup', 'my-plugin');
 return $statuses;
}, 10, 2);```

### ` order_statuses (legacy) ` [](#order-statuses-legacy)
`fluent-cart/order_statuses` — Filter order statuses (legacy hook name)
**When it runs:** Legacy location of the order statuses filter. Applied in the older Helper class. Prefer `fluent_cart/order_statuses` for new code.
**Parameters:**

- `$statuses` (array): Associative array of order statuses (key => translated label)
- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified order statuses array
**Source:** `app/Helpers/Helper.php:140`
**Usage:**php
```
add_filter('fluent-cart/order_statuses', function ($statuses, $data) {
 $statuses['custom'] = __('Custom Status', 'my-plugin');
 return $statuses;
}, 10, 2);```

### ` editable_order_statuses ` [](#editable-order-statuses)
`fluent-cart/editable_order_statuses` — Filter manually settable order statuses
**When it runs:** Applied when building the list of order statuses an admin can manually set on an order. This controls the dropdown options in the order edit screen.
**Note:** This hook uses a non-standard hyphenated prefix (`fluent-cart/`) rather than the standard `fluent_cart/` convention. This is a legacy naming that may be standardized in a future release.
**Parameters:**

- `$statuses` (array): Associative array of editable statuses (key => translated label)php
```
$statuses = [
 'on-hold' => 'On Hold',
 'processing' => 'Processing',
 'completed' => 'Completed',
 'canceled' => 'Canceled',
];```

- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified editable order statuses array
**Source:** `app/Helpers/Helper.php:151`, `app/Helpers/Status.php:170,242`
**Usage:**php
```
add_filter('fluent-cart/editable_order_statuses', function ($statuses, $data) {
 // Remove the ability to manually set "canceled"
 unset($statuses['canceled']);
 return $statuses;
}, 10, 2);```

### ` payment_statuses ` [](#payment-statuses)
`fluent_cart/payment_statuses` — Filter payment statuses
**When it runs:** Applied when retrieving the list of available payment statuses used across the order and transaction system.
**Parameters:**

- `$statuses` (array): Associative array of payment statuses (key => translated label)php
```
$statuses = [
 'pending' => 'Pending',
 'paid' => 'Paid',
 'partially_paid' => 'Partially Paid',
 'failed' => 'Failed',
 'refunded' => 'Refunded',
 'partially_refunded' => 'Partially Refunded',
 'authorized' => 'Authorized',
];```

- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified payment statuses array
**Source:** `app/Helpers/Status.php:183`
**Usage:**php
```
add_filter('fluent_cart/payment_statuses', function ($statuses, $data) {
 $statuses['on_hold'] = __('On Hold', 'my-plugin');
 return $statuses;
}, 10, 2);```

### ` transaction_statuses ` [](#transaction-statuses)
`fluent_cart/transaction_statuses` — Filter transaction statuses
**When it runs:** Applied when retrieving available transaction statuses for the primary transaction system.
**Parameters:**

- `$statuses` (array): Associative array of transaction statuses (key => translated label)php
```
$statuses = [
 'pending' => 'Pending',
 'succeeded' => 'Succeeded',
 'authorized' => 'Authorized',
 'failed' => 'Failed',
 'refunded' => 'Refunded',
];```

- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified transaction statuses array
**Source:** `app/Helpers/Status.php:197`
**Usage:**php
```
add_filter('fluent_cart/transaction_statuses', function ($statuses, $data) {
 $statuses['disputed'] = __('Disputed', 'my-plugin');
 return $statuses;
}, 10, 2);```

### ` transaction_statuses (legacy) ` [](#transaction-statuses-legacy)
`fluent-cart/transaction_statuses` — Filter transaction statuses (legacy hook name)
**When it runs:** Legacy location of the transaction statuses filter. Applied in the older Helper class. Prefer `fluent_cart/transaction_statuses` for new code.
**Parameters:**

- `$statuses` (array): Associative array of transaction statuses (key => translated label)
- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified transaction statuses array
**Source:** `app/Helpers/Helper.php:215`
**Usage:**php
```
add_filter('fluent-cart/transaction_statuses', function ($statuses, $data) {
 return $statuses;
}, 10, 2);```

### ` editable_transaction_statuses ` [](#editable-transaction-statuses)
`fluent-cart/editable_transaction_statuses` — Filter manually editable transaction statuses
**When it runs:** Applied when building the list of transaction statuses that an admin can manually set.
**Note:** This hook uses a non-standard hyphenated prefix (`fluent-cart/`) rather than the standard `fluent_cart/` convention. This is a legacy naming that may be standardized in a future release.
**Parameters:**

- `$statuses` (array): Associative array of editable transaction statuses (key => translated label)php
```
$statuses = [
 'pending' => 'Pending',
 'succeeded' => 'Succeeded',
 'authorized' => 'Authorized',
 'failed' => 'Failed',
 'refunded' => 'Refunded',
];```

- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified editable transaction statuses array
**Source:** `app/Helpers/Helper.php:233`, `app/Helpers/Status.php:214`
**Usage:**php
```
add_filter('fluent-cart/editable_transaction_statuses', function ($statuses, $data) {
 unset($statuses['refunded']);
 return $statuses;
}, 10, 2);```

### ` transaction_success_statuses ` [](#transaction-success-statuses)
`fluent_cart/transaction_success_statuses` — Filter which statuses count as successful transactions
**When it runs:** Applied when determining which transaction statuses should be considered "successful" for reporting and order completion logic.
**Parameters:**

- `$statuses` (array): Indexed array of status stringsphp
```
$statuses = ['succeeded', 'authorized'];```

- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified success statuses array
**Source:** `app/Helpers/Status.php:331`
**Usage:**php
```
add_filter('fluent_cart/transaction_success_statuses', function ($statuses, $data) {
 // Also count "captured" as a success status
 $statuses[] = 'captured';
 return $statuses;
}, 10, 2);```

### ` shipping_statuses (legacy) ` [](#shipping-statuses-legacy)
`fluent-cart/shipping_statuses` — Filter shipping statuses (legacy hook name)
**When it runs:** Legacy location of the shipping statuses filter. Applied in the older Helper class. Prefer `fluent_cart/shipping_statuses` for new code.
**Parameters:**

- `$statuses` (array): Associative array of shipping statuses (key => translated label)
- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified shipping statuses array
**Source:** `app/Helpers/Helper.php:170`
**Usage:**php
```
add_filter('fluent-cart/shipping_statuses', function ($statuses, $data) {
 return $statuses;
}, 10, 2);```

### ` shipping_statuses ` [](#shipping-statuses)
`fluent_cart/shipping_statuses` — Filter shipping statuses
**When it runs:** Applied when retrieving the list of available shipping statuses used for order fulfillment.
**Parameters:**

- `$statuses` (array): Associative array of shipping statuses (key => translated label)php
```
$statuses = [
 'unshipped' => 'Unshipped',
 'shipped' => 'Shipped',
 'delivered' => 'Delivered',
 'unshippable' => 'Unshippable',
];```

- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified shipping statuses array
**Source:** `app/Helpers/Status.php:232`
**Usage:**php
```
add_filter('fluent_cart/shipping_statuses', function ($statuses, $data) {
 $statuses['in_transit'] = __('In Transit', 'my-plugin');
 return $statuses;
}, 10, 2);```

## Order Data & Lifecycle [](#order-data-lifecycle)

### ` orders_list ` [](#orders-list)
`fluent_cart/orders_list` — Filter the admin orders list
**When it runs:** Applied after retrieving the paginated orders collection for the admin orders list view.
**Parameters:**

- `$orders` (LengthAwarePaginator): Paginated collection of orders

**Returns:** `LengthAwarePaginator` — The modified paginated orders collection
**Source:** `app/Http/Controllers/OrderController.php:58`
**Usage:**php
```
add_filter('fluent_cart/orders_list', function ($orders) {
 // Add custom data to each order in the list
 foreach ($orders as $order) {
 $order->custom_badge = get_post_meta($order->id, '_custom_badge', true);
 }
 return $orders;
}, 10, 1);```

### ` order/view ` [](#order-view)
`fluent_cart/order/view` — Filter single order view data
**When it runs:** Applied when preparing the data for a single order view in the admin panel.
**Parameters:**

- `$order` (array): The order data array containing all order details
- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The modified order data
**Source:** `app/Http/Controllers/OrderController.php:580`
**Usage:**php
```
add_filter('fluent_cart/order/view', function ($order, $data) {
 // Add custom data to the order view
 $order['custom_field'] = 'Custom Value';
 return $order;
}, 10, 2);```

### ` widgets/single_order ` [](#widgets-single-order)
`fluent_cart/widgets/single_order` — Filter single order admin widgets
**When it runs:** Applied when loading the stats/widgets section on the single order admin view.
**Parameters:**

- `$widgets` (array): Array of widget data (default empty)
- `$order` ([Order](https://dev.fluentcart.com/database/models/order.html)): The Order model instance

**Returns:** `array` — Array of widget definitions to display
**Source:** `app/Http/Controllers/OrderController.php:1009`
**Usage:**php
```
add_filter('fluent_cart/widgets/single_order', function ($widgets, $order) {
 $widgets[] = [
 'title' => __('Custom Widget', 'my-plugin'),
 'value' => 'Some data for order #' . $order->id,
 ];
 return $widgets;
}, 10, 2);```

### ` order/is_subscription_allowed_in_manual_order ` [](#order-is-subscription-allowed-in-manual-order)
`fluent_cart/order/is_subscription_allowed_in_manual_order` — Allow subscriptions in manual orders
**When it runs:** Applied when creating a manual order that contains subscription items. By default, subscriptions in manual orders are not supported.
**Parameters:**

- `$allowed` (bool): Whether subscriptions are allowed (default `false`)
- `$context` (array): Context dataphp
```
$context = [
 'order_items' => [...] // Array of order item data
];```

**Returns:** `bool` — Whether to allow subscription items in manual orders
**Source:** `app/Http/Controllers/OrderController.php:78`
**Usage:**php
```
add_filter('fluent_cart/order/is_subscription_allowed_in_manual_order', function ($allowed, $context) {
 // Enable subscriptions in manual orders
 return true;
}, 10, 2);```

### ` order/type ` [](#order-type)
`fluent_cart/order/type` — Filter order type during manual creation
**When it runs:** Applied when determining the order type during manual order creation. The type is automatically set to `'subscription'` if subscription items are detected, otherwise `'payment'`.
**Parameters:**

- `$type` (string): The order type (`'payment'` or `'subscription'`)
- `$data` (array): Additional context data (empty array)

**Returns:** `string` — The order type string
**Source:** `app/Http/Controllers/OrderController.php:91`
**Usage:**php
```
add_filter('fluent_cart/order/type', function ($type, $data) {
 return $type;
}, 10, 2);```

### ` order/expected_license_count ` [](#order-expected-license-count)
`fluent_cart/order/expected_license_count` — Filter expected license count for an order
**When it runs:** Applied when checking how many licenses should exist for an order. Used to detect missing licenses that need to be regenerated.
**Parameters:**

- `$count` (int): Expected number of licenses (default `0`)
- `$context` (array): Context dataphp
```
$context = [
 'order_items' => [...] // Collection of order items
];```

**Returns:** `int` — The expected number of licenses
**Source:** `app/Http/Controllers/OrderController.php:215,585`
**Usage:**php
```
add_filter('fluent_cart/order/expected_license_count', function ($count, $context) {
 foreach ($context['order_items'] as $item) {
 if ($item->requires_license) {
 $count += $item->quantity;
 }
 }
 return $count;
}, 10, 2);```

### ` create_receipt_number_on_order_create ` [](#create-receipt-number-on-order-create)
`fluent_cart/create_receipt_number_on_order_create` — Force receipt number generation on order creation
**When it runs:** Applied during the order `creating` model event. By default, receipt numbers are only generated when the payment status is `'paid'`. Return `true` to always generate a receipt number.
**Parameters:**

- `$force` (bool): Whether to force receipt number creation (default `false`)

**Returns:** `bool` — Whether to generate a receipt number regardless of payment status
**Source:** `app/Models/Order.php:52`
**Usage:**php
```
add_filter('fluent_cart/create_receipt_number_on_order_create', function ($force) {
 // Always create a receipt number when an order is created
 return true;
}, 10, 1);```

### ` single_order_downloads ` [](#single-order-downloads)
`fluent_cart/single_order_downloads` — Filter order downloads data
**When it runs:** Applied when preparing the downloadable files for a specific order, allowing you to add, remove, or modify download data.
**Parameters:**

- `$downloadData` (array): Array of download groupsphp
```
$downloadData = [
 [
 'title' => 'Product Name - Variation Title',
 'product_id' => 123,
 'variation_id' => 456,
 'additional_html' => '',
 'downloads' => [
 ['id' => 1, 'name' => 'File Name', 'url' => '...']
 ]
 ]
];```

- `$context` (array): Context dataphp
```
$context = [
 'order' => Order, // The Order model instance
 'scope' => 'admin' // 'admin' or 'customer'
];```

**Returns:** `array` — The modified download data array
**Source:** `app/Models/Order.php:657`
**Usage:**php
```
add_filter('fluent_cart/single_order_downloads', function ($downloadData, $context) {
 // Add a bonus download for completed orders
 if ($context['order']->status === 'completed') {
 $downloadData[] = [
 'title' => 'Bonus Content',
 'downloads' => [
 ['name' => 'Bonus File', 'url' => 'https://example.com/bonus.pdf']
 ]
 ];
 }
 return $downloadData;
}, 10, 2);```

### ` order_can_be_deleted ` [](#order-can-be-deleted)
`fluent_cart/order_can_be_deleted` — Filter whether an order can be deleted
**When it runs:** Applied when checking if an order is eligible for deletion. By default, orders with active subscriptions cannot be deleted.
**Parameters:**

- `$canBeDeleted` (true|WP_Error): `true` if deletable, or a `WP_Error` with the reason
- `$context` (array): Context dataphp
```
$context = [
 'order' => Order // The Order model instance
];```

**Returns:** `true|WP_Error` — `true` to allow deletion, or `WP_Error` to block it
**Source:** `app/Models/Order.php:812`
**Usage:**php
```
add_filter('fluent_cart/order_can_be_deleted', function ($canBeDeleted, $context) {
 $order = $context['order'];
 // Prevent deletion of orders less than 30 days old
 if (strtotime($order->created_at) > strtotime('-30 days')) {
 return new \WP_Error('too_recent', __('Orders less than 30 days old cannot be deleted.', 'my-plugin'));
 }
 return $canBeDeleted;
}, 10, 2);```

### ` min_receipt_number ` [](#min-receipt-number)
`fluent_cart/min_receipt_number` — Filter the minimum receipt number
**When it runs:** Applied when calculating the next receipt number. If the computed next number is below this minimum, it will be bumped up.
**Parameters:**

- `$min` (int): The minimum receipt number from store settings (default `1`)

**Returns:** `int` — The minimum receipt number to enforce
**Source:** `app/Services/OrderService.php:572`
**Usage:**php
```
add_filter('fluent_cart/min_receipt_number', function ($min) {
 // Start receipt numbers from 1000
 return 1000;
}, 10, 1);```

### ` invoice_prefix ` [](#invoice-prefix)
`fluent_cart/invoice_prefix` — Filter the invoice number prefix
**When it runs:** Applied when generating the invoice number string for new orders. The invoice number is formed as `prefix + receipt_number`.
**Parameters:**

- `$prefix` (string): The invoice prefix from store settings (default `'INV-'`)

**Returns:** `string` — The modified invoice prefix
**Source:** `app/Services/OrderService.php:584`
**Usage:**php
```
add_filter('fluent_cart/invoice_prefix', function ($prefix) {
 // Use a year-based prefix
 return 'INV-' . date('Y') . '-';
}, 10, 1);```

### ` order_refund_manually ` [](#order-refund-manually)
`fluent_cart/order_refund_manually` — Intercept manual refund processing
**When it runs:** Applied during the refund process before the payment gateway refund method is called. Allows you to handle refunds through a custom mechanism instead of the gateway.
**Parameters:**

- `$manualRefund` (array): Manual refund statusphp
```
$manualRefund = [
 'status' => 'no', // 'yes' to skip gateway refund
 'source' => '' // Identifier for the manual refund source
];```

- `$context` (array): Refund context dataphp
```
$context = [
 'refund_amount' => 5000, // Amount in cents
 'transaction' => Transaction, // OrderTransaction model
 'order' => Order, // Order model
 'args' => ['reason' => ''] // Additional refund arguments
];```

**Returns:** `array` — Array with `'status'` key set to `'yes'` to skip the gateway refund
**Source:** `app/Services/Payments/Refund.php:65`
**Usage:**php
```
add_filter('fluent_cart/order_refund_manually', function ($manualRefund, $context) {
 // Handle refund via a custom service
 $result = my_custom_refund($context['transaction'], $context['refund_amount']);
 if ($result) {
 return ['status' => 'yes', 'source' => 'my_custom_service'];
 }
 return $manualRefund;
}, 10, 2);```

### ` order_status/auto_complete_digital_order ` [](#order-status-auto-complete-digital-order)
`fluent_cart/order_status/auto_complete_digital_order` — Control auto-completion of digital orders
**When it runs:** Applied during payment status reconciliation. When a digital (non-physical) order is paid, it is automatically marked as completed. Return `false` to prevent this behavior.
**Parameters:**

- `$autoComplete` (bool): Whether to auto-complete the order (default `true`)
- `$context` (array): Context dataphp
```
$context = [
 'order' => Order // The Order model instance
];```

**Returns:** `bool` — Whether to automatically complete the digital order
**Source:** `app/Helpers/StatusHelper.php:193`
**Usage:**php
```
add_filter('fluent_cart/order_status/auto_complete_digital_order', function ($autoComplete, $context) {
 // Require manual review for high-value digital orders
 if ($context['order']->total > 50000) { // > $500
 return false;
 }
 return $autoComplete;
}, 10, 2);```

### ` customer/order_data ` [](#customer-order-data)
`fluent_cart/customer/order_data` — Filter customer portal order data
**When it runs:** Applied when preparing order data for display in the customer-facing order details page.
**Parameters:**

- `$formattedOrderData` (array): The formatted order data array
- `$context` (array): Context dataphp
```
$context = [
 'order' => Order, // The Order model instance
 'customer' => Customer // The Customer model instance
];```

**Returns:** `array` — The modified formatted order data
**Source:** `app/Http/Controllers/FrontendControllers/CustomerOrderController.php:285`
**Usage:**php
```
add_filter('fluent_cart/customer/order_data', function ($formattedOrderData, $context) {
 // Add custom data visible to customers
 $formattedOrderData['estimated_delivery'] = get_post_meta(
 $context['order']->id, '_estimated_delivery', true
 );
 return $formattedOrderData;
}, 10, 2);```

### ` customer/order_details_section_parts ` [](#customer-order-details-section-parts)
`fluent_cart/customer/order_details_section_parts` — Filter customer order detail sections
**When it runs:** Applied when building the customer-facing order details page. Allows you to inject custom HTML content into predefined section slots.
**Parameters:**

- `$sections` (array): HTML content for each section slotphp
```
$sections = [
 'before_summary' => '',
 'after_summary' => '',
 'after_licenses' => '',
 'after_subscriptions' => '',
 'after_downloads' => '',
 'after_transactions' => '',
 'end_of_order' => '',
];```

- `$context` (array): Context dataphp
```
$context = [
 'order' => Order, // The Order model instance
 'formattedData' => [...] // The formatted order data array
];```

**Returns:** `array` — The modified sections array with HTML content
**Source:** `app/Http/Controllers/FrontendControllers/CustomerOrderController.php:292`
**Usage:**php
```
add_filter('fluent_cart/customer/order_details_section_parts', function ($sections, $context) {
 $sections['after_summary'] = '<div class="custom-notice">Thank you for your order!</div>';
 return $sections;
}, 10, 2);```

## Payment Processing [](#payment-processing)

### ` ipn_url_{$slug} ` [](#ipn-url-slug)
`fluent_cart_ipn_url_{$slug}` — Filter IPN/webhook listener URL for a payment gateway
**When it runs:** Applied when generating the IPN (Instant Payment Notification) or webhook listener URL for a specific payment method. The `{$slug}` is the gateway slug (e.g., `stripe`, `paypal`).
**Parameters:**

- `$urlData` (array): Array containing the listener URLphp
```
$urlData = [
 'listener_url' => 'https://yoursite.com/?fct_payment_listener=1&method=stripe'
];```

**Returns:** `array` — The modified URL data array
**Source:** `app/Services/Payments/PaymentHelper.php:24`
**Usage:**php
```
add_filter('fluent_cart_ipn_url_stripe', function ($urlData) {
 // Use a custom endpoint for Stripe webhooks
 $urlData['listener_url'] = home_url('/custom-stripe-webhook/');
 return $urlData;
}, 10, 1);```

### ` payment/success_url ` [](#payment-success-url)
`fluentcart/payment/success_url` — Filter the payment success redirect URL
**When it runs:** Applied when generating the URL the customer is redirected to after a successful payment.
**Note:** This hook uses a non-standard prefix (`fluentcart/`) rather than the standard `fluent_cart/` convention. This is a legacy naming that may be standardized in a future release.
**Parameters:**

- `$url` (string): The success redirect URL (receipt page with query args)
- `$context` (array): Context dataphp
```
$context = [
 'transaction_hash' => 'abc123...', // Transaction UUID
 'args' => [], // Additional arguments
 'payment_method' => 'stripe' // Gateway slug
];```

**Returns:** `string` — The modified success URL
**Source:** `app/Services/Payments/PaymentHelper.php:46`
**Usage:**php
```
add_filter('fluentcart/payment/success_url', function ($url, $context) {
 // Redirect to a custom thank-you page
 return add_query_arg('trx_hash', $context['transaction_hash'], home_url('/thank-you/'));
}, 10, 2);```

### ` default_payment_method_for_zero_payment ` [](#default-payment-method-for-zero-payment)
`fluent_cart/default_payment_method_for_zero_payment` — Filter the default payment method for zero-total orders
**When it runs:** Applied during checkout validation when the order total (including recurring) is zero. Determines which payment method handles the $0 transaction.
**Parameters:**

- `$method` (string): Payment method slug (default `'offline_payment'`)
- `$data` (array): Additional context data (empty array)

**Returns:** `string` — The payment method slug to use for zero-total orders
**Source:** `app/Services/Payments/PaymentHelper.php:70`
**Usage:**php
```
add_filter('fluent_cart/default_payment_method_for_zero_payment', function ($method, $data) {
 // Use Stripe for free trials that have recurring charges
 return 'stripe';
}, 10, 2);```

### ` get_payment_connect_info_{$method} ` [](#get-payment-connect-info-method)
`fluent_cart/get_payment_connect_info_{$method}` — Filter payment method connection info
**When it runs:** Applied when retrieving connection/setup information for a specific payment method. The `{$method}` is the sanitized gateway slug. Used by gateways that require an OAuth connection flow.
**Parameters:**

- `$info` (array): Connection info array (default empty)
- `$data` (array): Additional context data (empty array)

**Returns:** `array` — The payment method connection information
**Source:** `api/PaymentMethods.php:105`
**Usage:**php
```
add_filter('fluent_cart/get_payment_connect_info_stripe', function ($info, $data) {
 $info['connected'] = true;
 $info['account_id'] = 'acct_xxx';
 return $info;
}, 10, 2);```

### ` transaction/url_{$payment_method} ` [](#transaction-url-payment-method)
`fluent_cart/transaction/url_{$payment_method}` — Filter the vendor dashboard URL for a transaction
**When it runs:** Applied when generating the URL attribute of an [`OrderTransaction`](https://dev.fluentcart.com/database/models/order-transaction.html) model. The `{$payment_method}` is the gateway slug. This URL typically links to the transaction in the payment provider's dashboard.
**Parameters:**

- `$url` (string): The vendor URL (default empty string)
- `$context` (array): Context dataphp
```
$context = [
 'transaction' => OrderTransaction, // The transaction model
 'payment_mode' => 'live', // 'live' or 'test'
 'vendor_charge_id' => 'ch_xxx', // External charge ID
 'transaction_type' => 'charge' // Transaction type
];```

**Returns:** `string` — The URL to the transaction in the payment provider's dashboard
**Source:** `app/Models/OrderTransaction.php:111`
**Usage:**php
```
add_filter('fluent_cart/transaction/url_stripe', function ($url, $context) {
 $chargeId = $context['vendor_charge_id'];
 $mode = $context['payment_mode'] === 'test' ? 'test/' : '';
 return "https://dashboard.stripe.com/{$mode}payments/{$chargeId}";
}, 10, 2);```

### ` transaction/receipt_page_url ` [](#transaction-receipt-page-url)
`fluentcart/transaction/receipt_page_url` — Filter the transaction receipt page URL
**When it runs:** Applied when generating the public-facing receipt page URL for a transaction, typically used in email notifications and customer-facing links.
**Note:** This hook uses a non-standard prefix (`fluentcart/`) rather than the standard `fluent_cart/` convention. This is a legacy naming that may be standardized in a future release.
**Parameters:**

- `$url` (string): The receipt page URL with `trx_hash` query parameter
- `$context` (array): Context dataphp
```
$context = [
 'transaction' => OrderTransaction, // The transaction model
 'order' => Order // The parent order model
];```

**Returns:** `string` — The modified receipt page URL
**Source:** `app/Models/OrderTransaction.php:183`
**Usage:**php
```
add_filter('fluentcart/transaction/receipt_page_url', function ($url, $context) {
 // Use a custom receipt page
 return add_query_arg('trx_hash', $context['transaction']->uuid, home_url('/my-receipt/'));
}, 10, 2);```

## Stripe [](#stripe)

### ` stripe_settings ` [](#stripe-settings)
`fluent_cart/stripe_settings` — Filter Stripe gateway settings
**When it runs:** Applied when loading Stripe gateway settings during initialization.
**Parameters:**

- `$settings` (array): The Stripe settings array including keys, modes, and configuration options

**Returns:** `array` — The modified Stripe settings
**Source:** `app/Modules/PaymentMethods/StripeGateway/StripeSettingsBase.php:38`
**Usage:**php
```
add_filter('fluent_cart/stripe_settings', function ($settings) {
 // Force test mode in staging environments
 if (wp_get_environment_type() === 'staging') {
 $settings['payment_mode'] = 'test';
 }
 return $settings;
}, 10, 1);```

### ` payments/stripe_metadata_subscription ` [](#payments-stripe-metadata-subscription)
`fluent_cart/payments/stripe_metadata_subscription` — Filter Stripe subscription metadata
**When it runs:** Applied when creating a Stripe subscription, allowing you to add or modify metadata sent to Stripe's subscription object.
**Parameters:**

- `$metadata` (array): The metadata array for the Stripe subscriptionphp
```
$metadata = [
 'fct_ref_id' => 'order-uuid',
 'email' => '[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)',
 'name' => 'Customer Name',
 'subscription_item' => 'Product Name',
 'order_reference' => 'fct_order_id_123',
];```

- `$context` (array): Context dataphp
```
$context = [
 'order' => Order, // Order model
 'transaction' => Transaction, // OrderTransaction model
 'subscription' => Subscription // Subscription model
];```

**Returns:** `array` — The modified metadata array (max 50 keys per Stripe limits)
**Source:** `app/Modules/PaymentMethods/StripeGateway/Processor.php:90`
**Usage:**php
```
add_filter('fluent_cart/payments/stripe_metadata_subscription', function ($metadata, $context) {
 $metadata['affiliate_id'] = get_user_meta($context['order']->customer->user_id, 'affiliate_id', true);
 return $metadata;
}, 10, 2);```

### ` payments/stripe_metadata_onetime ` [](#payments-stripe-metadata-onetime)
`fluent_cart/payments/stripe_metadata_onetime` — Filter Stripe one-time payment metadata
**When it runs:** Applied when creating a Stripe payment intent for a one-time (non-subscription) payment.
**Parameters:**

- `$metadata` (array): The metadata array for the Stripe payment intentphp
```
$metadata = [
 'fct_ref_id' => 'order-uuid',
 'Name' => 'Customer Name',
 'Email' => '[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)',
 'order_reference' => 'fct_order_id_123',
];```

- `$context` (array): Context dataphp
```
$context = [
 'order' => Order, // Order model
 'transaction' => Transaction // OrderTransaction model
];```

**Returns:** `array` — The modified metadata array (max 50 keys per Stripe limits)
**Source:** `app/Modules/PaymentMethods/StripeGateway/Processor.php:221`
**Usage:**php
```
add_filter('fluent_cart/payments/stripe_metadata_onetime', function ($metadata, $context) {
 $metadata['campaign'] = 'spring_sale_2025';
 if (isset($context['order'])) {
 $metadata['customer_id'] = $context['order']->customer_id;
 }
 return $metadata;
}, 10, 2);```

### ` payments/stripe_onetime_intent_args ` [](#payments-stripe-onetime-intent-args)
`fluent_cart/payments/stripe_onetime_intent_args` — Filter Stripe payment intent arguments
**When it runs:** Applied after building the full payment intent data array, just before creating the intent via the Stripe API. This is the last chance to modify intent parameters.
**Parameters:**

- `$intentData` (array): The payment intent argumentsphp
```
$intentData = [
 'amount' => 5000, // In smallest currency unit
 'currency' => 'usd',
 'automatic_payment_methods' => ['enabled' => 'true'],
 'metadata' => [...],
 'customer' => 'cus_xxx',
];```

- `$context` (array): Context dataphp
```
$context = [
 'order' => Order, // Order model
 'transaction' => Transaction // OrderTransaction model
];```

**Returns:** `array` — The modified payment intent arguments
**Source:** `app/Modules/PaymentMethods/StripeGateway/Processor.php:257`
**Usage:**php
```
add_filter('fluent_cart/payments/stripe_onetime_intent_args', function ($intentData, $context) {
 // Add a statement descriptor
 $intentData['statement_descriptor_suffix'] = 'Order ' . $context['order']->id;
 return $intentData;
}, 10, 2);```

### ` payments/stripe_checkout_session_args ` [](#payments-stripe-checkout-session-args)
`fluent_cart/payments/stripe_checkout_session_args` — Filter Stripe Checkout session arguments (one-time)
**When it runs:** Applied when creating a Stripe Checkout session for one-time (non-subscription) hosted payments.
**Parameters:**

- `$sessionData` (array): The Checkout session argumentsphp
```
$sessionData = [
 'customer' => 'cus_xxx',
 'client_reference_id' => 'order-uuid',
 'line_items' => [...],
 'mode' => 'payment',
 'success_url' => '...',
 'cancel_url' => '...',
 'metadata' => [...],
];```

- `$context` (array): Context dataphp
```
$context = [
 'order' => Order, // Order model
 'transaction' => Transaction // OrderTransaction model
];```

**Returns:** `array` — The modified Checkout session arguments
**Source:** `app/Modules/PaymentMethods/StripeGateway/Processor.php:356`
**Usage:**php
```
add_filter('fluent_cart/payments/stripe_checkout_session_args', function ($sessionData, $context) {
 // Enable promotion codes on the Checkout page
 $sessionData['allow_promotion_codes'] = true;
 return $sessionData;
}, 10, 2);```

### ` payments/stripe_subscription_checkout_session_args ` [](#payments-stripe-subscription-checkout-session-args)
`fluent_cart/payments/stripe_subscription_checkout_session_args` — Filter Stripe Checkout session arguments (subscription)
**When it runs:** Applied when creating a Stripe Checkout session for subscription-based hosted payments.
**Parameters:**

- `$sessionData` (array): The Checkout session argumentsphp
```
$sessionData = [
 'customer' => 'cus_xxx',
 'client_reference_id' => 'order-uuid',
 'line_items' => [...],
 'mode' => 'subscription',
 'success_url' => '...',
 'cancel_url' => '...',
 'subscription_data' => ['metadata' => [...]],
 'metadata' => [...],
];```

- `$context` (array): Context dataphp
```
$context = [
 'order' => Order, // Order model
 'transaction' => Transaction, // OrderTransaction model
 'subscription' => Subscription // Subscription model
];```

**Returns:** `array` — The modified Checkout session arguments
**Source:** `app/Modules/PaymentMethods/StripeGateway/Processor.php:509`
**Usage:**php
```
add_filter('fluent_cart/payments/stripe_subscription_checkout_session_args', function ($sessionData, $context) {
 // Add tax ID collection
 $sessionData['tax_id_collection'] = ['enabled' => true];
 return $sessionData;
}, 10, 2);```

### ` stripe_idempotency_key ` [](#stripe-idempotency-key)
`fluent_cart_stripe_idempotency_key` — Filter the Stripe idempotency key
**When it runs:** Applied when sending charge requests to the Stripe API. The idempotency key prevents duplicate charges from being created.
**Parameters:**

- `$key` (string): The generated idempotency key
- `$context` (array): Context dataphp
```
$context = [
 'request' => [...] // The Stripe API request body
];```

**Returns:** `string` — The modified idempotency key
**Source:** `app/Modules/PaymentMethods/StripeGateway/API/ApiRequest.php:115`
**Usage:**php
```
add_filter('fluent_cart_stripe_idempotency_key', function ($key, $context) {
 // Use a custom idempotency key format
 return 'fct_' . md5($key . time());
}, 10, 2);```

### ` stripe_request_body ` [](#stripe-request-body)
`fluent_cart_stripe_request_body` — Filter the Stripe API request body
**When it runs:** Applied just before every request is sent to the Stripe API. This is a low-level filter that affects all Stripe API calls.
**Parameters:**

- `$request` (array): The request body data
- `$context` (array): Context dataphp
```
$context = [
 'api' => 'charges' // The Stripe API endpoint being called
];```

**Returns:** `array` — The modified request body
**Source:** `app/Modules/PaymentMethods/StripeGateway/API/ApiRequest.php:126`
**Usage:**php
```
add_filter('fluent_cart_stripe_request_body', function ($request, $context) {
 // Log all Stripe API requests
 error_log('Stripe API call to: ' . $context['api']);
 return $request;
}, 10, 2);```

### ` form_disable_stripe_connect ` [](#form-disable-stripe-connect)
`fluent_cart_form_disable_stripe_connect` — Disable Stripe Connect provider option
**When it runs:** Applied when rendering the Stripe settings form. Return `true` to force the use of manual API keys instead of Stripe Connect.
**Parameters:**

- `$disable` (bool): Whether to disable Stripe Connect (default `false`)
- `$data` (array): Additional context data (empty array)

**Returns:** `bool` — `true` to disable Stripe Connect and force API keys mode
**Source:** `app/Modules/PaymentMethods/StripeGateway/Stripe.php:288`
**Usage:**php
```
add_filter('fluent_cart_form_disable_stripe_connect', function ($disable, $data) {
 // Force manual API keys
 return true;
}, 10, 2);```

### ` stripe_appearance ` [](#stripe-appearance)
`fluent_cart_stripe_appearance` — Filter Stripe Elements appearance configuration
**When it runs:** Applied when initializing Stripe Elements on the checkout page. Controls the visual theme and styling of the embedded payment form.
**Parameters:**

- `$appearance` (array): Stripe Elements appearance configurationphp
```
$appearance = [
 'theme' => 'stripe' // 'stripe', 'night', 'flat', or custom
];```

**Returns:** `array` — The modified appearance configuration (follows [Stripe Appearance API](https://docs.stripe.com/elements/appearance-api))
**Source:** `app/Modules/PaymentMethods/StripeGateway/Stripe.php:427`
**Usage:**php
```
add_filter('fluent_cart_stripe_appearance', function ($appearance) {
 return [
 'theme' => 'night',
 'variables' => [
 'colorPrimary' => '#0570de',
 'borderRadius' => '8px',
 'fontFamily' => 'Inter, system-ui, sans-serif',
 ],
 ];
}, 10, 1);```

### ` stripe/setup_intent_rate_limit_customer_daily ` [](#stripe-setup-intent-rate-limit-customer-daily)
`fluent_cart/stripe/setup_intent_rate_limit_customer_daily` — Filter the daily SetupIntent rate limit per customer
**When it runs:** Applied when checking and enforcing the rate limit for Stripe SetupIntent creation (used for subscription card updates). Prevents card testing fraud.
**Parameters:**

- `$limit` (int): Maximum number of SetupIntent attempts per customer per day (default `3`)
- `$customerId` (string): The Stripe customer ID

**Returns:** `int` — The modified daily rate limit
**Source:** `app/Modules/PaymentMethods/StripeGateway/SubscriptionsManager.php:85,101`
**Usage:**php
```
add_filter('fluent_cart/stripe/setup_intent_rate_limit_customer_daily', function ($limit, $customerId) {
 // Allow more attempts for trusted customers
 return 5;
}, 10, 2);```

### ` stripe/fallback_order_transaction ` [](#stripe-fallback-order-transaction)
`fluent_cart/stripe/fallback_order_transaction` — Provide a fallback transaction for Stripe webhook events
**When it runs:** Applied during Stripe webhook processing (`charge.refunded` or `charge.succeeded`) when no matching [`OrderTransaction`](https://dev.fluentcart.com/database/models/order-transaction.html) can be found by `vendor_charge_id`. Allows you to resolve the transaction through custom logic.
**Parameters:**

- `$transaction` ([OrderTransaction](https://dev.fluentcart.com/database/models/order-transaction.html)|null): The fallback transaction (default `null`)
- `$vendorDataObject` (object): The Stripe event data object containing charge details

**Returns:** [OrderTransaction](https://dev.fluentcart.com/database/models/order-transaction.html)|null — An `OrderTransaction` instance or `null` if not found
**Source:** `app/Modules/PaymentMethods/StripeGateway/Webhook/Webhook.php:121`
**Usage:**php
```
add_filter('fluent_cart/stripe/fallback_order_transaction', function ($transaction, $vendorDataObject) {
 // Look up transaction by metadata
 if (isset($vendorDataObject->metadata->fct_ref_id)) {
 $order = \FluentCart\App\Models\Order::where('uuid', $vendorDataObject->metadata->fct_ref_id)->first();
 if ($order) {
 return \FluentCart\App\Models\OrderTransaction::where('order_id', $order->id)
 ->where('transaction_type', 'charge')
 ->first();
 }
 }
 return $transaction;
}, 10, 2);```

## PayPal [](#paypal)

### ` paypal_plan_id ` [](#paypal-plan-id)
`fluent_cart/paypal_plan_id` — Filter the PayPal plan ID for subscriptions
**When it runs:** Applied when generating or resolving the PayPal billing plan ID for a subscription product variation. The plan ID is a computed string based on currency, variation, billing interval, and other parameters.
**Parameters:**

- `$planId` (string): The generated plan ID string
- `$context` (array): Context dataphp
```
$context = [
 'plan_data' => [...], // Plan configuration data
 'variation' => Variation, // Product variation model
 'product' => Product // Product model
];```

**Returns:** `string` — The modified PayPal plan ID
**Source:** `app/Modules/PaymentMethods/PayPalGateway/PayPalHelper.php:54`
**Usage:**php
```
add_filter('fluent_cart/paypal_plan_id', function ($planId, $context) {
 // Use a custom plan ID format
 return 'custom_plan_' . $context['variation']->id;
}, 10, 2);```

### ` payments/paypal_sdk_src ` [](#payments-paypal-sdk-src)
`fluent_cart/payments/paypal_sdk_src` — Filter the PayPal SDK JavaScript source URL
**When it runs:** Applied when generating the PayPal JavaScript SDK script URL for the checkout page.
**Parameters:**

- `$sdkSrc` (string): The PayPal SDK URL with query parameters (client-id, currency, intent, vault, etc.)
- `$data` (array): Additional context data (empty array)

**Returns:** `string` — The modified PayPal SDK URL
**Source:** `app/Modules/PaymentMethods/PayPalGateway/PayPal.php:518`
**Usage:**php
```
add_filter('fluent_cart/payments/paypal_sdk_src', function ($sdkSrc, $data) {
 // Add locale parameter
 return add_query_arg('locale', 'en_US', $sdkSrc);
}, 10, 2);```

### ` payments/paypal/disable_webhook_verification ` [](#payments-paypal-disable-webhook-verification)
`fluent_cart/payments/paypal/disable_webhook_verification` — Disable PayPal webhook signature verification
**When it runs:** Applied at the start of PayPal webhook verification. Return `'yes'` to skip signature verification entirely. Only use this for debugging or in environments where verification cannot work.
**Parameters:**

- `$disable` (string): Whether to disable verification (default `'no'`)
- `$data` (array): Additional context data (empty array)

**Returns:** `string` — `'yes'` to skip verification, `'no'` to verify normally
**Source:** `app/Modules/PaymentMethods/PayPalGateway/IPN.php:179`
**Usage:**php
```
add_filter('fluent_cart/payments/paypal/disable_webhook_verification', function ($disable, $data) {
 // Disable verification in local development
 if (wp_get_environment_type() === 'local') {
 return 'yes';
 }
 return $disable;
}, 10, 2);```

### ` payments/paypal/verify_webhook ` [](#payments-paypal-verify-webhook)
`fluent_cart/payments/paypal/verify_webhook` — Control PayPal webhook verification
**When it runs:** Applied before the actual PayPal webhook signature verification step in the main webhook processing flow. Return `false` to skip verification for specific webhook types or modes.
**Parameters:**

- `$verify` (bool): Whether to verify the webhook (default `true`)
- `$context` (array): Context dataphp
```
$context = [
 'data' => [...], // The webhook payload
 'mode' => 'live', // 'live' or 'test'
 'type' => 'PAYMENT.SALE.COMPLETED' // Webhook event type
];```

**Returns:** `bool` — Whether to proceed with webhook verification
**Source:** `app/Modules/PaymentMethods/PayPalGateway/IPN.php:302`
**Usage:**php
```
add_filter('fluent_cart/payments/paypal/verify_webhook', function ($verify, $context) {
 // Skip verification for test mode
 if ($context['mode'] === 'test') {
 return false;
 }
 return $verify;
}, 10, 2);```

## Tax [](#tax)

### ` tax/country_tax_titles ` [](#tax-country-tax-titles)
`fluent_cart/tax/country_tax_titles` — Filter tax title labels per country
**When it runs:** Applied when retrieving the mapping of country codes to their tax identification field labels (e.g., VAT, GST, ABN). Used in checkout forms and tax settings.
**Parameters:**

- `$taxTitles` (array): Associative array of country code => tax labelphp
```
$taxTitles = [
 'AU' => 'ABN',
 'NZ' => 'GST',
 'IN' => 'GST',
 'CA' => 'GST / HST / PST / QST',
 'GB' => 'VAT',
 'EU' => 'VAT',
 'US' => 'EIN / Sales Tax',
 // ... 30+ countries
];```

**Returns:** `array` — The modified country tax titles array
**Source:** `app/Modules/Tax/TaxModule.php:821`
**Usage:**php
```
add_filter('fluent_cart/tax/country_tax_titles', function ($taxTitles) {
 // Add or override tax labels
 $taxTitles['KR'] = __('BRN / VAT', 'my-plugin'); // South Korea
 $taxTitles['US'] = __('Tax ID', 'my-plugin'); // Simplify US label
 return $taxTitles;
}, 10, 1);```

## Mollie (Pro) [](#mollie-pro)

### ` mollie_settings ` [](#mollie-settings)
`fluent_cart/mollie_settings` Pro — Filter Mollie gateway settings
**When it runs:** Applied when loading Mollie gateway settings during initialization.
**Parameters:**

- `$settings` (array): The Mollie settings array including API keys and configuration

**Returns:** `array` — The modified Mollie settings
**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/MollieSettingsBase.php:26`
**Usage:**php
```
add_filter('fluent_cart/mollie_settings', function ($settings) {
 // Override settings for staging
 if (wp_get_environment_type() === 'staging') {
 $settings['payment_mode'] = 'test';
 }
 return $settings;
}, 10, 1);```

### ` payments/mollie_payment_args ` [](#payments-mollie-payment-args)
`fluent_cart/payments/mollie_payment_args` Pro — Filter Mollie payment data
**When it runs:** Applied when building the payment data array before sending to the Mollie API for payment creation.
**Parameters:**

- `$paymentData` (array): The payment data for the Mollie API
- `$context` (array): Context dataphp
```
$context = [
 'order' => Order, // Order model
 'transaction' => Transaction // OrderTransaction model
];```

**Returns:** `array` — The modified payment data
**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/MollieProcessor.php:142`
**Usage:**php
```
add_filter('fluent_cart/payments/mollie_payment_args', function ($paymentData, $context) {
 // Add a custom description
 $paymentData['description'] = 'Order #' . $context['order']->id . ' - My Store';
 return $paymentData;
}, 10, 2);```

### ` mollie/pass_line_items_details ` [](#mollie-pass-line-items-details)
`fluent_cart/mollie/pass_line_items_details` Pro — Control whether line item details are passed to Mollie
**When it runs:** Applied before building the Mollie payment request. Return `true` to include individual line items in the Mollie order (useful for Klarna, iDEAL, etc.).
**Parameters:**

- `$passLineItems` (bool): Whether to include line items (default `false`)
- `$context` (array): Array containing `[$order, $transaction]`

**Returns:** `bool` — Whether to pass line item details to Mollie
**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/MollieProcessor.php:128`
**Usage:**php
```
add_filter('fluent_cart/mollie/pass_line_items_details', function ($passLineItems, $context) {
 // Enable line items for Klarna support
 return true;
}, 10, 2);```

### ` mollie/webhook_url ` [](#mollie-webhook-url)
`fluent_cart/mollie/webhook_url` Pro — Filter the Mollie webhook URL
**When it runs:** Applied when generating the webhook notification URL sent to Mollie during payment creation.
**Parameters:**

- `$webhookUrl` (string): The IPN/webhook listener URL

**Returns:** `string` — The modified webhook URL
**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/MollieProcessor.php:301`
**Usage:**php
```
add_filter('fluent_cart/mollie/webhook_url', function ($webhookUrl) {
 // Use a tunnel URL for local development
 if (wp_get_environment_type() === 'local') {
 return 'https://my-tunnel.ngrok.io/?fct_payment_listener=1&method=mollie';
 }
 return $webhookUrl;
}, 10, 1);```

### ` mollie/subscription_description ` [](#mollie-subscription-description)
`fluent_cart/mollie/subscription_description` Pro — Filter the Mollie subscription description
**When it runs:** Applied when creating a Mollie subscription, allowing you to customize the description shown on the customer's payment statement.
**Parameters:**

- `$description` (string): The generated subscription description
- `$context` (array): Context dataphp
```
$context = [
 'subscription_model' => Subscription, // Subscription model
 'currency' => 'EUR' // Currency code
];```

**Returns:** `string` — The modified subscription description
**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/MollieHelper.php:209`
**Usage:**php
```
add_filter('fluent_cart/mollie/subscription_description', function ($description, $context) {
 return 'MyStore - ' . $context['subscription_model']->item_name;
}, 10, 2);```

## Paddle (Pro) [](#paddle-pro)

### ` paddle_product_tax_category ` [](#paddle-product-tax-category)
`fluent_cart/paddle_product_tax_category` Pro — Filter Paddle product tax category
**When it runs:** Applied when determining the tax category for a product in Paddle. Paddle uses tax categories to apply the correct tax rates.
**Parameters:**

- `$taxCategory` (string): The tax category (default `'standard'`)

**Returns:** `string` — The Paddle tax category (e.g., `'standard'`, `'digital-goods'`, `'saas'`)
**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`
**Usage:**php
```
add_filter('fluent_cart/paddle_product_tax_category', function ($taxCategory) {
 return 'digital-goods';
}, 10, 1);```

### ` paddle_onetime_price_id ` [](#paddle-onetime-price-id)
`fluent_cart/paddle_onetime_price_id` Pro — Filter Paddle one-time price ID
**When it runs:** Applied when resolving the Paddle price ID for a one-time payment product.
**Parameters:**

- `$priceId` (string): The Paddle price ID

**Returns:** `string` — The modified Paddle price ID
**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`
**Usage:**php
```
add_filter('fluent_cart/paddle_onetime_price_id', function ($priceId) {
 return $priceId;
}, 10, 1);```

### ` paddle_recurring_price_id ` [](#paddle-recurring-price-id)
`fluent_cart/paddle_recurring_price_id` Pro — Filter Paddle recurring price ID
**When it runs:** Applied when resolving the Paddle price ID for a recurring subscription product.
**Parameters:**

- `$priceId` (string): The Paddle recurring price ID

**Returns:** `string` — The modified Paddle recurring price ID
**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`
**Usage:**php
```
add_filter('fluent_cart/paddle_recurring_price_id', function ($priceId) {
 return $priceId;
}, 10, 1);```

### ` paddle_discount_id ` [](#paddle-discount-id)
`fluent_cart/paddle_discount_id` Pro — Filter Paddle discount ID
**When it runs:** Applied when resolving the Paddle discount ID to apply during checkout.
**Parameters:**

- `$discountId` (string): The Paddle discount ID

**Returns:** `string` — The modified Paddle discount ID
**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`
**Usage:**php
```
add_filter('fluent_cart/paddle_discount_id', function ($discountId) {
 return $discountId;
}, 10, 1);```

### ` paddle_subscription_product_type ` [](#paddle-subscription-product-type)
`fluent_cart/paddle_subscription_product_type` Pro — Filter Paddle subscription product type
**When it runs:** Applied when determining the Paddle product type for subscription items.
**Parameters:**

- `$productType` (string): The Paddle product type

**Returns:** `string` — The modified Paddle product type
**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`
**Usage:**php
```
add_filter('fluent_cart/paddle_subscription_product_type', function ($productType) {
 return $productType;
}, 10, 1);```

### ` paddle_subscription_price_type ` [](#paddle-subscription-price-type)
`fluent_cart/paddle_subscription_price_type` Pro — Filter Paddle subscription price type
**When it runs:** Applied when determining the Paddle price type for subscription items.
**Parameters:**

- `$priceType` (string): The Paddle price type

**Returns:** `string` — The modified Paddle price type
**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`
**Usage:**php
```
add_filter('fluent_cart/paddle_subscription_price_type', function ($priceType) {
 return $priceType;
}, 10, 1);```

### ` paddle_signup_fee_price_type ` [](#paddle-signup-fee-price-type)
`fluent_cart/paddle_signup_fee_price_type` Pro — Filter Paddle signup fee price type
**When it runs:** Applied when determining the Paddle price type for subscription signup fees.
**Parameters:**

- `$priceType` (string): The Paddle signup fee price type

**Returns:** `string` — The modified Paddle signup fee price type
**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`
**Usage:**php
```
add_filter('fluent_cart/paddle_signup_fee_price_type', function ($priceType) {
 return $priceType;
}, 10, 1);```

### ` paddle_product_id ` [](#paddle-product-id)
`fluent_cart/paddle_product_id` Pro — Filter Paddle one-time product ID
**When it runs:** Applied when resolving the Paddle product ID for one-time payment items.
**Parameters:**

- `$productId` (string): The Paddle product ID

**Returns:** `string` — The modified Paddle product ID
**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`
**Usage:**php
```
add_filter('fluent_cart/paddle_product_id', function ($productId) {
 return $productId;
}, 10, 1);```

### ` paddle_onetime_product_type ` [](#paddle-onetime-product-type)
`fluent_cart/paddle_onetime_product_type` Pro — Filter Paddle one-time product type
**When it runs:** Applied when determining the Paddle product type for one-time payment items.
**Parameters:**

- `$productType` (string): The Paddle product type

**Returns:** `string` — The modified Paddle product type
**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`
**Usage:**php
```
add_filter('fluent_cart/paddle_onetime_product_type', function ($productType) {
 return $productType;
}, 10, 1);```

### ` paddle_onetime_price_type ` [](#paddle-onetime-price-type)
`fluent_cart/paddle_onetime_price_type` Pro — Filter Paddle one-time price type
**When it runs:** Applied when determining the Paddle price type for one-time payment items.
**Parameters:**

- `$priceType` (string): The Paddle price type

**Returns:** `string` — The modified Paddle price type
**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`
**Usage:**php
```
add_filter('fluent_cart/paddle_onetime_price_type', function ($priceType) {
 return $priceType;
}, 10, 1);```

### ` paddle_addon_product_type ` [](#paddle-addon-product-type)
`fluent_cart/paddle_addon_product_type` Pro — Filter Paddle add-on product type
**When it runs:** Applied when determining the Paddle product type for add-on items.
**Parameters:**

- `$productType` (string): The Paddle add-on product type

**Returns:** `string` — The modified Paddle add-on product type
**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`
**Usage:**php
```
add_filter('fluent_cart/paddle_addon_product_type', function ($productType) {
 return $productType;
}, 10, 1);```

### ` paddle_discount_mode ` [](#paddle-discount-mode)
`fluent_cart/paddle_discount_mode` Pro — Filter Paddle discount mode
**When it runs:** Applied when determining how discounts are applied in Paddle transactions.
**Parameters:**

- `$discountMode` (string): The discount mode

**Returns:** `string` — The modified discount mode
**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`
**Usage:**php
```
add_filter('fluent_cart/paddle_discount_mode', function ($discountMode) {
 return $discountMode;
}, 10, 1);```

## Authorize.net (Pro) [](#authorize-net-pro)

### ` authorize_dot_net_supported_currencies ` [](#authorize-dot-net-supported-currencies)
`fluent_cart/authorize_dot_net_supported_currencies` Pro — Filter Authorize.net supported currencies
**When it runs:** Applied when checking which currencies are supported by the Authorize.net gateway.
**Parameters:**

- `$currencies` (array): Array of supported currency codesphp
```
$currencies = ['USD', 'CAD', 'GBP', 'EUR', ...];```

**Returns:** `array` — The modified array of supported currency codes
**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/AuthorizeDotNetGateway/`
**Usage:**php
```
add_filter('fluent_cart/authorize_dot_net_supported_currencies', function ($currencies) {
 // Add additional supported currencies
 $currencies[] = 'AUD';
 $currencies[] = 'NZD';
 return $currencies;
}, 10, 1);```

### ` authorize_dot_net/transaction_request ` [](#authorize-dot-net-transaction-request)
`fluent_cart/authorize_dot_net/transaction_request` Pro — Filter the Authorize.net transaction request before it is sent to the API
**When it runs:** Applied to the assembled `transactionRequest` payload immediately before it is sent to the Authorize.net API. Fires on both the one-time payment path and the subscription first-payment path, so developers can override any Auth.net field (invoice number, customer ID/email, `userFields`, line items, billing/shipping, etc.) without core changes.
**Parameters:**

- `$transactionRequest` (array): The Authorize.net transaction request payload (amount, payment, billTo, shipTo, lineItems, etc.)
- `$data` (array): Context dataphp
```
$data = [
 'order' => $order, // Order model instance
 'transaction' => $transaction, // OrderTransaction model instance
];```

**Returns:** `array` — The modified transaction request payload
**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/AuthorizeDotNetGateway/AuthorizeDotNetProcessor.php:71` (one-time) and `:542` (subscription first payment)
**Usage:**php
```
add_filter('fluent_cart/authorize_dot_net/transaction_request', function ($transactionRequest, $data) {
 // Attach a custom purchase order number via userFields
 $transactionRequest['userFields'] = [
 'userField' => [
 ['name' => 'po_number', 'value' => 'PO-' . $data['order']->id],
 ],
 ];
 return $transactionRequest;
}, 10, 2);```

### ` authorize_dot_net/order_description ` [](#authorize-dot-net-order-description)
`fluent_cart/authorize_dot_net/order_description` Pro — Filter the order description sent to Authorize.net
**When it runs:** Applied when building the order metadata (invoice number and description) for an Authorize.net transaction. The default description is the comma-separated list of item names, or `Order #{id}` when no names are available. The returned value is truncated to 255 characters.
**Parameters:**

- `$default` (string): The default order description (item names or `Order #{id}`)
- `$data` (array): Context dataphp
```
$data = [
 'order' => $order, // Order model instance
];```

**Returns:** `string` — The order description (truncated to 255 chars)
**Source:** `fluent-cart-pro/app/Modules/PaymentMethods/AuthorizeDotNetGateway/AuthorizeDotNetHelper.php:222`
**Usage:**php
```
add_filter('fluent_cart/authorize_dot_net/order_description', function ($description, $data) {
 // Prefix the description with the store name
 return 'My Store — ' . $description;
}, 10, 2);```

### ` should_send_email_notification ` [](#should-send-email-notification)
`fluent_cart/should_send_email_notification` — Control whether an automatic email notification should be sent
**When it runs:** This filter is applied before each automatic email notification is sent for an order event. It allows you to selectively block or allow specific email notifications, for example when using a Merchant of Record payment gateway (like Paddle) that handles its own transactional emails.
**Parameters:**

- `$should` (bool): Whether the email should be sent (default: `true`)
- `$args` (array): Context data about the notificationphp
```
$args = [
 'event' => 'order_paid', // The event triggering the email
 'mail_name' => 'order_paid_customer', // The specific notification identifier
 'order' => $order, // Order model instance
];```

**Available `mail_name` values:**

- `order_paid_customer` — Purchase receipt to customer
- `order_paid_admin` — New order alert to admin
- `order_refunded_customer` — Refund confirmation to customer
- `order_refunded_admin` — Refund alert to admin
- `subscription_renewed_customer` — Renewal receipt to customer
- `subscription_renewed_admin` — Renewal alert to admin
- `subscription_canceled_customer` — Cancellation notice to customer
- `subscription_canceled_admin` — Cancellation alert to admin
- `order_placed_customer` — Order confirmation to customer (offline payment)
- `order_placed_admin` — Order placed alert to admin (offline payment)

**Returns:**

- `$should` (bool): Whether the email notification should be sent

**Usage:**php
```
// Block all customer-facing emails for a specific payment gateway
add_filter('fluent_cart/should_send_email_notification', function($should, $args) {
 $order = $args['order'];

 if ($order->payment_method !== 'my_gateway') {
 return $should;
 }

 // Only allow order confirmation and admin notifications
 $allowedEmails = [
 'order_paid_customer',
 'order_paid_admin',
 ];

 return in_array($args['mail_name'], $allowedEmails, true);
}, 10, 2);```

**Note:** This filter only affects automatic event-driven emails. Manual actions like generating invoices or printing receipts from the admin panel are not affected.
### ` paddle_allowed_email_notifications ` [](#paddle-allowed-email-notifications)
`fluent_cart/paddle_allowed_email_notifications` — Control which email notifications are allowed for Paddle orders
**When it runs:** This filter is applied when determining whether to send an automatic email notification for a Paddle order. Since Paddle is a Merchant of Record and handles its own payment receipts, refund confirmations, and subscription billing emails, FluentCart blocks most automatic emails for Paddle orders by default. Use this filter to customize which emails are still sent by FluentCart.
**Parameters:**

- `$allowedEmails` (array): List of notification identifiers that FluentCart is allowed to send for Paddle ordersphp
```
// Default allowed emails
$allowedEmails = [
 'order_paid_customer', // Order confirmation to customer
 'order_paid_admin', // New order alert to admin
];```

**Returns:**

- `$allowedEmails` (array): The modified list of allowed notification identifiers

**Usage:**php
```
// Allow shipping notifications for Paddle orders
add_filter('fluent_cart/paddle_allowed_email_notifications', function($allowedEmails) {
 $allowedEmails[] = 'shipping_status_changed_to_shipped_customer';
 $allowedEmails[] = 'shipping_status_changed_to_delivered_customer';
 return $allowedEmails;
});```

**Available notification identifiers:**

- `order_paid_customer` — Purchase receipt / order confirmation to customer (allowed by default)
- `order_paid_admin` — New order alert to admin (allowed by default)
- `order_refunded_customer` — Refund confirmation to customer
- `order_refunded_admin` — Refund alert to admin
- `subscription_renewed_customer` — Renewal receipt to customer
- `subscription_renewed_admin` — Renewal alert to admin
- `subscription_canceled_customer` — Cancellation notice to customer
- `subscription_canceled_admin` — Cancellation alert to admin

**Note:** This filter is specific to Paddle orders. For general email notification control across all payment gateways, use the `fluent_cart/should_send_email_notification` filter instead.

---

## Products & Pricing

Source: https://dev.fluentcart.com/hooks/filters/products-and-pricing.html


All filters related to [Product](https://dev.fluentcart.com/database/models/product.html) display, catalog management, pricing, stock, URLs, and [Coupon](https://dev.fluentcart.com/database/models/coupon.html)s.
## Product Display & Layout [](#product-display-layout)

### ` products_list ` [](#products-list)
`fluent_cart/products_list` — Filter the admin products list
**When it runs:** This filter is applied after fetching the paginated products collection in the admin products list view.
**Parameters:**

- `$products` (LengthAwarePaginator): The paginated products collection with appended `view_url` and `edit_url` attributes

**Returns:**

- `$products` (LengthAwarePaginator): The modified paginated collection

**Source:** `app/Http/Controllers/ProductController.php:52`
**Usage:**php
```
add_filter('fluent_cart/products_list', function($products) {
 // Modify the products collection before it is returned to the admin
 $products->getCollection()->transform(function ($product) {
 $product->custom_badge = 'Featured';
 return $product;
 });
 return $products;
}, 10, 1);```

### ` shop_query ` [](#shop-query)
`fluent_cart/shop_query` — Filter the shop product query builder
**When it runs:** This filter is applied when building the query for the public-facing shop product listing, before search, status, and sorting clauses are added.
**Parameters:**

- `$query` (Builder): The Eloquent query builder instance with `select` and `with` already applied
- `$params` (array): The query parameters arrayphp
```
$params = [
 'select' => '*',
 'with' => [],
 'admin_all_statuses' => [],
 'selected_status' => '',
 // ...additional request parameters
];```

**Returns:**

- `$query` (Builder): The modified query builder

**Source:** `api/Resource/ShopResource.php:100`
**Usage:**php
```
add_filter('fluent_cart/shop_query', function($query, $params) {
 // Only show products from a specific category
 $query->whereHas('taxonomies', function ($q) {
 $q->where('taxonomy', 'product-category')
 ->where('term_id', 5);
 });
 return $query;
}, 10, 2);```

### ` single_product/variation_view_type ` [](#single-product-variation-view-type)
`fluent_cart/single_product/variation_view_type` — Filter the variation display type on single product pages
**When it runs:** This filter is applied when initializing the product renderer to determine how variations are visually presented on the single product page.
**Parameters:**

- `$viewType` (string): The variation view type. Possible values: `'image'`, `'text'`, `'both'`
- `$data` (array): Context dataphp
```
$data = [
 'product' => $product, // Product model
 'variants' => $variants, // Collection of variants
 'defaultVariationId' => $defaultVariationId // Default selected variation ID
];```

**Returns:**

- `$viewType` (string): The modified view type

**Source:** `app/Services/Renderer/ProductRenderer.php:67`
**Usage:**php
```
add_filter('fluent_cart/single_product/variation_view_type', function($viewType, $data) {
 // Always show both image and text for variations
 return 'both';
}, 10, 2);```

### ` single_product/variation_column_type ` [](#single-product-variation-column-type)
`fluent_cart/single_product/variation_column_type` — Filter the variation column layout on single product pages
**When it runs:** This filter is applied when initializing the product renderer to determine the column layout for product variations.
**Parameters:**

- `$columnType` (string): The column layout type. Possible values: `'one'`, `'two'`, `'three'`, `'four'`, `'masonry'`
- `$data` (array): Context dataphp
```
$data = [
 'product' => $product, // Product model
 'variants' => $variants, // Collection of variants
 'defaultVariationId' => $defaultVariationId // Default selected variation ID
];```

**Returns:**

- `$columnType` (string): The modified column type

**Source:** `app/Services/Renderer/ProductRenderer.php:74`
**Usage:**php
```
add_filter('fluent_cart/single_product/variation_column_type', function($columnType, $data) {
 $product = $data['product'];
 // Use two-column layout for products with many variations
 if (count($data['variants']) > 6) {
 return 'two';
 }
 return $columnType;
}, 10, 2);```

### ` single_product/variation_price ` [](#single-product-variation-price)
`fluent_cart/single_product/variation_price` — Filter the variation price text displayed on single product pages
**When it runs:** This filter is applied when rendering the price text for each product variation. For one-time products the price is the formatted decimal amount; for subscriptions it includes the billing terms text.
**Parameters:**

- `$priceText` (string): The formatted price text (escaped HTML)
- `$data` (array): Context dataphp
```
$data = [
 'product' => $product, // Product model
 'variant' => $variant, // ProductVariant model
 'scope' => 'product_variant_price'
];```

**Returns:**

- `$priceText` (string): The modified price text (HTML allowed via `wp_kses_post`)

**Source:** `app/Services/Renderer/ProductRenderer.php:827`
**Usage:**php
```
add_filter('fluent_cart/single_product/variation_price', function($priceText, $data) {
 $variant = $data['variant'];
 // Append a "per month" label for subscription variants
 if ($variant->payment_type === 'subscription') {
 return $priceText . ' <small>/month</small>';
 }
 return $priceText;
}, 10, 2);```

### ` shop_app_product_query_taxonomy_filters ` [](#shop-app-product-query-taxonomy-filters)
`fluent_cart/shop_app_product_query_taxonomy_filters` — Filter taxonomy filters for the Shop block product query
**When it runs:** This filter is applied in the Shop App Gutenberg block when merging URL-based taxonomy filters with default block filters, before the product query is executed.
**Parameters:**

- `$mergedTerms` (array): Merged taxonomy term IDs keyed by taxonomy namephp
```
$mergedTerms = [
 'product-category' => [1, 5, 12],
 'product-tag' => [3, 7]
];```

- `$data` (array): Context dataphp
```
$data = [
 'default_terms' => $defaultTerms, // Terms from block settings
 'url_terms' => $urlTerms, // Terms from URL query parameters
 'url_filters' => $urlFilters, // Raw URL filter parameters
 'default_filters' => $defaultFilters, // Raw block default filters
 'block' => $block, // Block instance
 'is_main_query' => true|false // Whether this is the main query
];```

**Returns:**

- `$mergedTerms` (array): The modified taxonomy term IDs array

**Source:** `app/Hooks/Handlers/BlockEditors/ShopApp/InnerBlocks/InnerBlocks.php:1379`
**Usage:**php
```
add_filter('fluent_cart/shop_app_product_query_taxonomy_filters', function($mergedTerms, $data) {
 // Always exclude a specific category from shop listings
 if (isset($mergedTerms['product-category'])) {
 $mergedTerms['product-category'] = array_diff($mergedTerms['product-category'], [99]);
 }
 return $mergedTerms;
}, 10, 2);```

### ` products_views/preload_collection_{$provider} ` [](#products-views-preload-collection-provider)
`fluent_cart/products_views/preload_collection_{$provider}` — Preload product view collection for a template provider
**When it runs:** This dynamic filter is applied when the shop controller loads products via AJAX for a specific template provider (e.g., `bricks`). The `{$provider}` portion is replaced with the template provider name from the request.
**Parameters:**

- `$html` (string): Default empty string. Return rendered HTML to use the preloaded view instead of JSON
- `$data` (array): Context dataphp
```
$data = [
 'client_id' => $clientId, // Client identifier from the request
 'products' => $products, // Array of product data
 'total' => $total, // Total number of products
 'requestData' => $requestData // Full request parameters
];```

**Returns:**

- `$html` (string): Rendered HTML string, or empty string to fall back to default JSON response

**Source:** `app/Http/Controllers/ShopController.php:103`
**Usage:**php
```
add_filter('fluent_cart/products_views/preload_collection_bricks', function($html, $data) {
 // Return custom rendered HTML for Bricks page builder
 ob_start();
 foreach ($data['products'] as $product) {
 echo '<div class="custom-product-card">' . esc_html($product['title']) . '</div>';
 }
 return ob_get_clean();
}, 10, 2);```

## Product Buttons & Text [](#product-buttons-text)

### ` product/buy_now_button_text ` [](#product-buy-now-button-text)
`fluent_cart/product/buy_now_button_text` — Filter the Buy Now button text
**When it runs:** This filter is applied when rendering the "Buy Now" button on single product pages. It runs in both the PHP product renderer and when localizing JavaScript variables for the frontend.
**Parameters:**

- `$text` (string): The button text. Default: `'Buy Now'` (translated)
- `$data` (array): Context dataphp
```
$data = [
 'product' => $product // Product model (when rendered server-side)
];```

**Returns:**

- `$text` (string): The modified button text

**Source:** `app/Services/Renderer/ProductRenderer.php:1081,1181`, `app/Modules/Templating/AssetLoader.php:87,261`
**Usage:**php
```
add_filter('fluent_cart/product/buy_now_button_text', function($text, $data) {
 // Customize Buy Now text for specific products
 if (!empty($data['product']) && $data['product']->product_type === 'digital') {
 return 'Download Now';
 }
 return $text;
}, 10, 2);```

### ` product/add_to_cart_text ` [](#product-add-to-cart-text)
`fluent_cart/product/add_to_cart_text` — Filter the Add to Cart button text
**When it runs:** This filter is applied when rendering the "Add to Cart" button text across multiple contexts: single product pages, shop blocks, product carousels, shortcodes, and localized JavaScript variables.
**Parameters:**

- `$text` (string): The button text. Default: `'Add To Cart'` (translated)
- `$data` (array): Context dataphp
```
$data = [
 'product' => $product // Product model (when rendered server-side)
];```

**Returns:**

- `$text` (string): The modified button text

**Source:** `app/Services/Renderer/ProductRenderer.php:1227,1314`, `app/Hooks/Handlers/ShortCodes/SingleProductShortCode.php:81`, `app/Hooks/Handlers/BlockEditors/ShopApp/InnerBlocks/InnerBlocks.php:1025,1104`, `app/Modules/Templating/AssetLoader.php:83,258`, `app/Hooks/Handlers/BlockEditors/ProductCarousel/InnerBlocks/InnerBlocks.php:493`
**Usage:**php
```
add_filter('fluent_cart/product/add_to_cart_text', function($text, $data) {
 // Change to a different label
 return 'Add to Basket';
}, 10, 2);```

### ` product/out_of_stock_text ` [](#product-out-of-stock-text)
`fluent_cart/product/out_of_stock_text` — Filter the out-of-stock button text
**When it runs:** This filter is applied when rendering the button text for products that are out of stock. It is used across shortcodes, shop blocks, product carousels, and localized JavaScript variables.
**Parameters:**

- `$text` (string): The out-of-stock text. Default: `'Not Available'` (translated)
- `$data` (array): Context data (empty array)

**Returns:**

- `$text` (string): The modified out-of-stock text

**Source:** `app/Hooks/Handlers/ShortCodes/SingleProductShortCode.php:83`, `app/Hooks/Handlers/BlockEditors/ShopApp/InnerBlocks/InnerBlocks.php:1027,1106`, `app/Modules/Templating/AssetLoader.php:85`, `app/Hooks/Handlers/BlockEditors/ProductCarousel/InnerBlocks/InnerBlocks.php:495`
**Usage:**php
```
add_filter('fluent_cart/product/out_of_stock_text', function($text) {
 return 'Sold Out';
}, 10, 1);```

### ` product/out_of_stock_button_text ` [](#product-out-of-stock-button-text)
`fluent_cart/product/out_of_stock_button_text` — Filter the out-of-stock button text (block editor variant)
**When it runs:** This filter is applied in the block editor asset loader when localizing the out-of-stock button text for JavaScript-rendered product pages. It serves the same purpose as `out_of_stock_text` but is used in a different rendering context.
**Parameters:**

- `$text` (string): The out-of-stock text. Default: `'Not Available'` (translated)
- `$data` (array): Context data (empty array)

**Returns:**

- `$text` (string): The modified out-of-stock button text

**Source:** `app/Modules/Templating/AssetLoader.php:260`
**Usage:**php
```
add_filter('fluent_cart/product/out_of_stock_button_text', function($text) {
 return 'Currently Unavailable';
}, 10, 1);```

### ` product/price_suffix_atts ` [](#product-price-suffix-atts)
`fluent_cart/product/price_suffix_atts` — Filter the price suffix for product variations
**When it runs:** This filter is applied when rendering each variation item in the variation selector. The Tax module hooks into this filter to append a price suffix (e.g., "incl. tax") configured in tax settings.
**Parameters:**

- `$suffix` (string): The price suffix text. Default: `''` (empty string)
- `$data` (array): Context dataphp
```
$data = [
 'product' => $product, // Product model
 'variant' => $variant, // ProductVariant model
 'scope' => 'variant_item'
];```

**Returns:**

- `$suffix` (string): The modified price suffix text

**Source:** `app/Services/Renderer/ProductRenderer.php:1408`
**Usage:**php
```
add_filter('fluent_cart/product/price_suffix_atts', function($suffix, $data) {
 // Add a custom price suffix
 return ' incl. VAT';
}, 10, 2);```

### ` product_short_description ` [](#product-short-description)
`fluent_cart/product_short_description` — Filter the product short description
**When it runs:** This filter is applied when rendering the short description section on the single product page, using the post excerpt as the default value.
**Parameters:**

- `$shortDescription` (string): The product short description (from `$post->post_excerpt`)
- `$data` (array): Context data (empty array)

**Returns:**

- `$shortDescription` (string): The modified short description (output via `wp_kses_post`)

**Source:** `app/Hooks/Handlers/TemplateLoader.php:26`
**Usage:**php
```
add_filter('fluent_cart/product_short_description', function($shortDescription) {
 // Append a disclaimer to all product short descriptions
 return $shortDescription . '<p class="disclaimer">Prices subject to change.</p>';
}, 10, 1);```

## Stock & Availability [](#stock-availability)

### ` product_stock_availability ` [](#product-stock-availability)
`fluent_cart/product_stock_availability` — Filter product stock availability information
**When it runs:** This filter is applied when retrieving the stock availability data for a product from the `ProductDetail` model. It runs after the default availability is determined based on stock management settings and current stock levels.
**Parameters:**

- `$availability` (array): The stock availability dataphp
```
// When stock is not managed:
$availability = [
 'manage_stock' => false,
 'availability' => 'In Stock',
 'class' => 'in-stock',
 'available_quantity' => null
];

// When stock is managed and available:
$availability = [
 'manage_stock' => true,
 'availability' => 'In Stock',
 'class' => 'in-stock',
 'available_quantity' => 25 // actual stock count
];

// When stock is managed and depleted:
$availability = [
 'manage_stock' => true,
 'availability' => 'Out of Stock',
 'class' => 'out-of-stock',
 'available_quantity' => 0
];```

- `$data` (array): Context dataphp
```
$data = [
 'detail' => $productDetail, // ProductDetail model instance
 'variation_id' => $variationId // Variation ID or null
];```

**Returns:**

- `$availability` (array): The modified availability data

**Source:** `app/Models/ProductDetail.php:183`
**Usage:**php
```
add_filter('fluent_cart/product_stock_availability', function($availability, $data) {
 // Show "Low Stock" warning when fewer than 5 items remain
 if ($availability['manage_stock'] && $availability['available_quantity'] > 0 && $availability['available_quantity'] < 5) {
 $availability['availability'] = 'Only ' . $availability['available_quantity'] . ' left in stock!';
 $availability['class'] = 'low-stock';
 }
 return $availability;
}, 10, 2);```

## Product URLs & Templates [](#product-urls-templates)

### ` price_class ` [](#price-class)
`fluent_cart/price_class` — Filter the price element CSS class
**When it runs:** This filter is applied when rendering the price paragraph element on the single product page template.
**Parameters:**

- `$class` (string): The CSS class for the price element. Default: `'price'`

**Returns:**

- `$class` (string): The modified CSS class string

**Source:** `app/Hooks/Handlers/TemplateLoader.php:40`
**Usage:**php
```
add_filter('fluent_cart/price_class', function($class) {
 // Add additional CSS classes to the price element
 return 'price fct-custom-price';
}, 10, 1);```

### ` front_url_slug ` [](#front-url-slug)
`fluent_cart/front_url_slug` — Filter the product URL slug
**When it runs:** This filter is applied when registering the `fluent-products` custom post type, allowing you to change the URL slug used for product permalinks.
**Parameters:**

- `$slug` (string): The product URL slug. Default comes from store settings, typically `'item'`
- `$data` (array): Context data (empty array)

**Returns:**

- `$slug` (string): The modified URL slug

**Source:** `app/CPT/FluentProducts.php:181`
**Note:** After changing the slug, you must flush rewrite rules (visit Settings > Permalinks in WP admin) for the change to take effect.
**Usage:**php
```
add_filter('fluent_cart/front_url_slug', function($slug) {
 // Change product URLs from /item/product-name to /shop/product-name
 return 'shop';
}, 10, 1);```

### ` product_url_with_front ` [](#product-url-with-front)
`fluent_cart/product_url_with_front` — Filter whether the product URL includes the front base
**When it runs:** This filter is applied when registering the `fluent-products` custom post type, immediately after `fluent_cart/front_url_slug` resolves the slug. The value is passed as the `with_front` argument to WordPress's `rewrite` option, controlling whether the site's permalink front base (e.g. `/blog/`) is prepended to product URLs.
**Parameters:**

- `$withFront` (bool): Whether to prepend the permalink front base. Default: `true`
- `$data` (array): Context dataphp
```
$data = [
 'slug' => $urlSlug // The resolved product URL slug
];```

**Returns:**

- `$withFront` (bool): The modified value

**Source:** `app/CPT/FluentProducts.php:183`
**Note:** After changing this value, flush rewrite rules by visiting Settings > Permalinks in the WordPress admin.
**Usage:**php
```
add_filter('fluent_cart/product_url_with_front', function($withFront, $data) {
 // Remove the permalink front base from product URLs
 // e.g. /blog/products/my-item → /products/my-item
 return false;
}, 10, 2);```

### ` show_standalone_product_menu ` [](#show-standalone-product-menu)
`fluent_cart/show_standalone_product_menu` — Filter whether to show a standalone Products menu in the WordPress admin
**When it runs:** This filter is applied during the `init` action when FluentCart registers the product custom post type. When enabled, a separate "Products" menu item appears in the WordPress admin sidebar.
**Parameters:**

- `$show` (bool): Whether to show the standalone menu. Default: `false`

**Returns:**

- `$show` (bool): The modified boolean value

**Source:** `app/CPT/FluentProducts.php:37`
**Usage:**php
```
add_filter('fluent_cart/show_standalone_product_menu', function($show) {
 // Show the standalone Products menu in WP admin
 return true;
}, 10, 1);```

### ` single_product_page/show_relevant_products ` [](#single-product-page-show-relevant-products)
`fluent_cart/single_product_page/show_relevant_products` — Filter whether to show related products on the single product page
**When it runs:** This filter is applied when rendering the single product page content, after checking the store setting `show_relevant_product_in_single_page`. When enabled, similar products are displayed below the main product content.
**Parameters:**

- `$show` (bool): Whether to show related products. Default comes from store settings
- `$postId` (int): The current product post ID

**Returns:**

- `$show` (bool): The modified boolean value

**Source:** `app/Modules/Templating/TemplateActions.php:240`
**Usage:**php
```
add_filter('fluent_cart/single_product_page/show_relevant_products', function($show, $postId) {
 // Disable related products for specific product IDs
 $excludedIds = [100, 200, 300];
 if (in_array($postId, $excludedIds)) {
 return false;
 }
 return $show;
}, 10, 2);```

### ` disable_auto_single_product_page ` [](#disable-auto-single-product-page)
`fluent_cart/disable_auto_single_product_page` — Disable automatic single product page rendering
**When it runs:** This filter is applied in two places: when filtering the post title and when filtering the post content for single product pages. When it returns `true`, FluentCart will not automatically inject product rendering into the default product page, allowing you to build the product page entirely with custom templates or page builders.
**Parameters:**

- `$disable` (bool): Whether to disable automatic rendering. Default: `false`

**Returns:**

- `$disable` (bool): The modified boolean value

**Source:** `app/Modules/Templating/TemplateActions.php:191,215`
**Usage:**php
```
add_filter('fluent_cart/disable_auto_single_product_page', function($disable) {
 // Disable auto-rendering when using a custom page builder
 if (class_exists('Elementor\Plugin')) {
 return true;
 }
 return $disable;
}, 10, 1);```

## Coupons [](#coupons)

### ` coupon/validating_coupon ` [](#coupon-validating-coupon)
`fluent_cart/coupon/validating_coupon` — Filter the coupon code during validation
**When it runs:** This filter is applied at the very beginning of coupon validation, before the coupon is looked up in the database. You can modify the coupon code string or return a `WP_Error` to reject it early.
**Parameters:**

- `$couponCode` (string): The coupon code being validated
- `$data` (array): Context dataphp
```
$data = [
 'coupon_code' => $couponCode, // Original coupon code
 'line_items' => $lineItems, // Cart line items
 'couponService' => $couponService // CouponService instance
];```

**Returns:**

- `$couponCode` (string|WP_Error): The modified coupon code, or a `WP_Error` to reject

**Source:** `app/Services/Coupon/Concerns/CanValidateCoupon.php:21`
**Usage:**php
```
add_filter('fluent_cart/coupon/validating_coupon', function($couponCode, $data) {
 // Normalize coupon codes to uppercase
 $couponCode = strtoupper(trim($couponCode));

 // Block specific coupon codes
 $blockedCodes = ['EXPIRED2024', 'TESTONLY'];
 if (in_array($couponCode, $blockedCodes)) {
 return new \WP_Error('coupon_blocked', __('This coupon code is no longer valid.', 'fluent-cart'));
 }

 return $couponCode;
}, 10, 2);```

### ` coupon/can_use_coupon ` [](#coupon-can-use-coupon)
`fluent_cart/coupon/can_use_coupon` — Filter whether a coupon can be used
**When it runs:** This filter is applied after the coupon has been validated and found in the database, but before the discount is calculated. It allows you to add custom eligibility checks.
**Parameters:**

- `$canUse` (bool): Whether the coupon can be used. Default: `true`
- `$data` (array): Context dataphp
```
$data = [
 'coupon' => $coupon, // Coupon model instance
 'cart' => $cart, // Cart model instance
 'cart_items' => $cartItems // Array of cart item data
];```

**Returns:**

- `$canUse` (bool|WP_Error): `true` to allow, `false` or `WP_Error` to reject. When a `WP_Error` is returned, its message is shown to the customer

**Source:** `app/Services/Coupon/DiscountService.php:257`
**Usage:**php
```
add_filter('fluent_cart/coupon/can_use_coupon', function($canUse, $data) {
 $coupon = $data['coupon'];
 $cart = $data['cart'];

 // Require a minimum cart subtotal of $50 (5000 cents)
 if ($cart->sub_total < 5000) {
 return new \WP_Error(
 'coupon_min_total',
 __('This coupon requires a minimum order of $50.', 'fluent-cart')
 );
 }

 return $canUse;
}, 10, 2);```

### ` coupon/will_skip_item ` [](#coupon-will-skip-item)
`fluent_cart/coupon/will_skip_item` — Filter whether an item should be skipped from coupon discount
**When it runs:** This filter is applied for each cart item when filtering applicable items for a coupon discount. Returning `true` excludes the item from the coupon discount calculation.
**Parameters:**

- `$willSkip` (bool): Whether to skip this item. Default: `false`
- `$data` (array): Context dataphp
```
$data = [
 'item' => $item, // Cart item array data
 'coupon' => $coupon, // Coupon model instance
 'cart' => $cart // Cart model instance
];```

**Returns:**

- `$willSkip` (bool): `true` to exclude the item from the coupon, `false` to include it

**Source:** `app/Services/Coupon/DiscountService.php:279`
**Usage:**php
```
add_filter('fluent_cart/coupon/will_skip_item', function($willSkip, $data) {
 $item = $data['item'];

 // Never apply coupons to gift card items
 if (!empty($item['product_type']) && $item['product_type'] === 'gift_card') {
 return true;
 }

 return $willSkip;
}, 10, 2);```

### ` coupon/per_customer_usage_query ` [](#coupon-per-customer-usage-query)
`fluent_cart/coupon/per_customer_usage_query` — Filter the per-customer coupon usage query
**When it runs:** This filter is applied when checking if a customer has exceeded the per-customer usage limit for a coupon. It allows you to modify the query that counts previous uses.
**Parameters:**

- `$usageQuery` (Builder): The Eloquent query builder for [`AppliedCoupon`](https://dev.fluentcart.com/database/models/applied-coupon.html) records, already filtered by coupon ID and customer ID
- `$data` (array): Context dataphp
```
$data = [
 'coupon' => $coupon, // Coupon model instance
 'customer' => $customer, // Customer model instance
 'cart' => $cart // Cart model instance
];```

**Returns:**

- `$usageQuery` (Builder): The modified query builder

**Source:** `app/Services/Coupon/DiscountService.php:592`
**Usage:**php
```
add_filter('fluent_cart/coupon/per_customer_usage_query', function($usageQuery, $data) {
 // Only count usage from the last 30 days (rolling usage limit)
 $usageQuery->where('created_at', '>=', gmdate('Y-m-d H:i:s', strtotime('-30 days')));
 return $usageQuery;
}, 10, 2);```

### ` coupon_statuses ` [](#coupon-statuses)
`fluent-cart/coupon_statuses` — Filter the available coupon statuses
**When it runs:** This filter is applied when retrieving the list of available coupon statuses, used in the admin coupon management interface.
**Parameters:**

- `$statuses` (array): Array of coupon statuses (key => label)php
```
$statuses = [
 'active' => 'Active',
 'expired' => 'Expired',
 'disabled' => 'Disabled'
];```

- `$data` (array): Context data (empty array)

**Returns:**

- `$statuses` (array): The modified coupon statuses array

**Source:** `app/Helpers/Helper.php:823`
**Note:** This hook uses `fluent-cart/` (with a hyphen) instead of the usual `fluent_cart/` (with an underscore) prefix.
**Usage:**php
```
add_filter('fluent-cart/coupon_statuses', function($statuses) {
 // Add a custom coupon status
 $statuses['scheduled'] = __('Scheduled', 'fluent-cart');
 return $statuses;
}, 10, 1);```

---

## Cart & Checkout

Source: https://dev.fluentcart.com/hooks/filters/cart-and-checkout.html


All filters related to the shopping flow from [Cart](https://dev.fluentcart.com/database/models/cart.html) to checkout.
## Cart Items & Validation [](#cart-items-validation)

### ` cart/item_modify ` [](#cart-item-modify)
`fluent_cart/cart/item_modify` — Modify cart item variation before adding
**When it runs:** This filter is applied when a product variation is being added to the cart or when an existing cart item is updated. It allows you to modify the variation object before it gets processed, or return `null` to block the item from being added.
**Source:**

- `api/Resource/FrontendResource/CartResource.php:44` (add to cart)
- `api/Resource/FrontendResource/CartResource.php:307` (update cart item)

**Parameters:**

- `$variation` ([ProductVariation](https://dev.fluentcart.com/database/models/product-variation.html)|null): The product variation model instance
- `$data` (array): Context dataphp
```
$data = [
 'item_id' => 42, // Variation ID being added
 'quantity' => 1, // Requested quantity
];```

**Returns:**

- [ProductVariation](https://dev.fluentcart.com/database/models/product-variation.html)|null — The modified variation, or `null` to prevent the item from being added

**Usage:**php
```
add_filter('fluent_cart/cart/item_modify', function ($variation, $data) {
 if (!$variation) {
 return $variation;
 }

 // Block a specific variation from being added
 if ($variation->id === 99) {
 return null;
 }

 return $variation;
}, 10, 2);```

### ` item_max_quantity ` [](#item-max-quantity)
`fluent_cart/item_max_quantity` — Limit the maximum quantity for a cart item
**When it runs:** This filter is applied immediately after the variation is resolved, before the item is added to the cart. It allows you to cap or adjust the quantity a customer can add.
**Source:** `api/Resource/FrontendResource/CartResource.php:54`
**Parameters:**

- `$quantity` (int): The requested quantity
- `$data` (array): Context dataphp
```
$data = [
 'variation' => $variation, // ProductVariation instance
 'product' => $product, // Product instance (empty array for custom items)
];```

**Returns:**

- `int` — The (possibly capped) quantity

**Usage:**php
```
add_filter('fluent_cart/item_max_quantity', function ($quantity, $data) {
 $variation = $data['variation'];

 // Limit subscription products to 1
 if ($variation->payment_type === 'subscription') {
 return 1;
 }

 // Cap all items at 10
 return min($quantity, 10);
}, 10, 2);```

### ` cart/custom_item_quantity_changed ` [](#cart-custom-item-quantity-changed)
`fluent_cart/cart/custom_item_quantity_changed` — Handle custom item quantity changes
**When it runs:** This filter fires when the quantity of a custom (externally-managed) item already in the cart is changed. It lets you recalculate pricing or validate the new quantity.
**Source:** `api/Resource/FrontendResource/CartResource.php:269`
**Parameters:**

- `$existingItem` (object): The existing cart item object
- `$data` (array): Context dataphp
```
$data = [
 'old_quantity' => 2, // Previous quantity
 'new_quantity' => 3, // Requested new quantity
 'by_input' => false, // Whether quantity was set directly
 'is_changed' => true, // Whether a change occurred
 'is_custom' => true, // Whether this is a custom item
];```

**Returns:**

- `object` — The modified item object with updated quantity and totals

**Usage:**php
```
add_filter('fluent_cart/cart/custom_item_quantity_changed', function ($variation, $data) {
 if (empty($data['is_custom'])) {
 return $variation;
 }

 // Recalculate line total based on new quantity
 $variation->quantity = $data['new_quantity'];
 $variation->line_total = $variation->price * $data['new_quantity'];

 return $variation;
}, 10, 2);```

### ` cart/validate_custom_item ` [](#cart-validate-custom-item)
`fluent_cart/cart/validate_custom_item` — Validate a custom or externally-managed cart item
**When it runs:** This filter fires when a custom (non-FluentCart) item is being added to the cart. Use it to validate and construct the item object that will be stored in the cart. Runs both during regular add-to-cart and instant checkout flows.
**Source:**

- `api/Resource/FrontendResource/CartResource.php:289`
- `app/Http/Routes/WebRoutes.php:99`

**Parameters:**

- `$existingItem` (object|null): The existing item object, or `null` for new items
- `$data` (array): Context dataphp
```
$data = [
 'item_id' => 'custom_item_123', // External item identifier
 'quantity' => 1, // Requested quantity
 'is_custom' => true, // Always true for custom items
];```

**Returns:**

- `object` — A variation-like object with the required cart item properties

**Usage:**php
```
add_filter('fluent_cart/cart/validate_custom_item', function ($variation, $data) {
 if (!(bool) $data['is_custom']) {
 return $variation;
 }

 // Build a custom item object
 return (object) [
 'item_id' => absint($data['item_id']),
 'object_id' => absint($data['item_id']),
 'title' => 'Custom Product',
 'price' => 2500, // $25.00 in cents
 'quantity' => (int) $data['quantity'],
 'payment_type' => 'one_time',
 'is_custom' => true,
 ];
}, 10, 2);```

### ` cart_item_product_variation ` [](#cart-item-product-variation)
`fluent_cart/cart_item_product_variation` — Provide a fallback product variation for a cart item
**When it runs:** This filter fires when a product variation cannot be found in the database during cart operations. It serves as a fallback mechanism to supply a variation from an external source.
**Source:** `api/Resource/FrontendResource/CartResource.php:631`
**Parameters:**

- `$productVariation` ([ProductVariation](https://dev.fluentcart.com/database/models/product-variation.html)|null): Always `null` at this point (no variation found)
- `$itemId` (int): The variation/item ID being looked up
- `$incrementBy` (int): The quantity increment value
- `$existingItemsArray` (array): The current cart items array

**Returns:**

- [ProductVariation](https://dev.fluentcart.com/database/models/product-variation.html)|null — A variation model instance, or `null` if the item should be skipped

**Usage:**php
```
add_filter('fluent_cart/cart_item_product_variation', function ($variation, $itemId, $incrementBy, $existingItems) {
 if (!$variation && $itemId > 10000) {
 // Provide a variation for external items
 return MyExternalService::getVariation($itemId);
 }
 return $variation;
}, 10, 4);```

### ` cart/can_purchase ` [](#cart-can-purchase)
`fluent_cart/cart/can_purchase` — Determine whether a variation can be added to the cart
**When it runs:** This filter fires after the built-in `canPurchase()` check on the variation model, inside `Cart::addItem()`. It allows you to add additional purchase restrictions or override the default validation.
**Source:** `app/Models/Cart.php:333`
**Parameters:**

- `$canPurchase` (true|WP_Error): The result of the built-in purchase validation
- `$data` (array): Context dataphp
```
$data = [
 'cart' => $cart, // Cart model instance
 'variation' => $variation, // ProductVariation model
 'quantity' => 2, // Requested quantity
];```

**Returns:**

- `true|WP_Error` — Return `true` to allow purchase, or a `WP_Error` to block it with a message

**Usage:**php
```
add_filter('fluent_cart/cart/can_purchase', function ($canPurchase, $data) {
 if (is_wp_error($canPurchase)) {
 return $canPurchase;
 }

 $cart = $data['cart'];
 $variation = $data['variation'];

 // Limit cart to 5 unique items
 $existingItems = $cart->getItems();
 if (count($existingItems) >= 5 && !isset($existingItems[$variation->id])) {
 return new \WP_Error(
 'cart_limit',
 __('You can only have up to 5 different items in your cart.', 'fluent-cart')
 );
 }

 return true;
}, 10, 2);```

### ` cart/estimated_total ` [](#cart-estimated-total)
`fluent_cart/cart/estimated_total` — Filter the cart estimated total
**When it runs:** This filter is applied when calculating the cart's estimated total. It fires in both the [Cart](https://dev.fluentcart.com/database/models/cart.html) model's `getEstimatedTotal()` method and the web checkout handler. The total includes item subtotals, shipping, and any custom checkout adjustments.
**Source:**

- `app/Models/Cart.php:766`
- `app/Hooks/Cart/WebCheckoutHandler.php:358`

**Parameters:**

- `$total` (int): The cart total in cents
- `$data` (array): Context dataphp
```
$data = [
 'cart' => $cart, // Cart model instance
];```

**Returns:**

- `int` — The modified cart total in cents

**Usage:**php
```
add_filter('fluent_cart/cart/estimated_total', function ($total, $data) {
 $cart = $data['cart'];

 // Add a flat processing fee of $2.00
 $processingFee = 200; // in cents
 return $total + $processingFee;
}, 10, 2);```

### ` cart_cookie_minutes ` [](#cart-cookie-minutes)
`fluent_cart/cart_cookie_minutes` — Control cart cookie expiration time
**When it runs:** This filter fires when setting the cart hash cookie. Despite the name, the default value is a Unix timestamp (not minutes). You can change how long the cart cookie persists in the browser.
**Source:** `api/Cookie/Cookie.php:22`
**Parameters:**

- `$expireTime` (int): Unix timestamp for cookie expiration. Default is `time() + 24 * 60 * 30` (30 days from now)

**Returns:**

- `int` — The Unix timestamp when the cookie should expire

**Usage:**php
```
add_filter('fluent_cart/cart_cookie_minutes', function ($expireTime) {
 // Set cookie to expire in 7 days instead of 30
 return time() + (7 * DAY_IN_SECONDS);
});```

### ` variation/can_purchase_bundle ` [](#variation-can-purchase-bundle)
`fluent_cart/variation/can_purchase_bundle` — Validate whether a bundle product can be purchased
**When it runs:** This filter fires during the `canPurchase()` check on a [ProductVariation](https://dev.fluentcart.com/database/models/product-variation.html) when the product is a bundle. It allows external modules (like StockManagement) to validate stock for bundled child items.
**Source:** `app/Models/ProductVariation.php:265`
**Parameters:**

- `$result` (null): Always `null` initially
- `$data` (array): Context dataphp
```
$data = [
 'variation' => $variation, // ProductVariation model
 'quantity' => 1, // Requested purchase quantity
];```

**Returns:**

- `null|true|false|WP_Error` — Return `null` or `true` to allow, `false` for a generic out-of-stock error, or `WP_Error` with a custom message to block

**Usage:**php
```
add_filter('fluent_cart/variation/can_purchase_bundle', function ($result, $data) {
 $variation = $data['variation'];
 $quantity = (int) $data['quantity'];

 // Check if all bundle children have sufficient stock
 $children = $variation->bundleChildren()->get();
 foreach ($children as $child) {
 if ($child->available < ($child->pivot->quantity * $quantity)) {
 return new \WP_Error(
 'bundle_stock',
 sprintf(__('%s does not have enough stock.', 'fluent-cart'), $child->title)
 );
 }
 }

 return $result;
}, 10, 2);```

## Checkout Validation [](#checkout-validation)

### ` checkout/validate_before_process ` [](#checkout-validate-before-process)
`fluent_cart/checkout/validate_before_process` — Pre-validate the checkout before processing
**When it runs:** This filter fires early in the `placeOrder()` flow, before any field or product validation occurs. It is the first opportunity for modules to reject a checkout attempt (e.g., CAPTCHA verification, rate limiting, or custom business rules).
**Source:** `api/Checkout/CheckoutApi.php:83`
**Parameters:**

- `$validation` (true): Always `true` initially
- `$data` (array): The full checkout submission data (billing address, payment method, form fields, etc.)

**Returns:**

- `true|WP_Error` — Return `true` to continue processing, or a `WP_Error` to abort checkout with an error message

**Usage:**php
```
add_filter('fluent_cart/checkout/validate_before_process', function ($validation, $data) {
 // Require a minimum order amount
 $cart = \FluentCart\App\Models\Cart::query()
 ->where('cart_hash', $data['cart_hash'])
 ->first();

 if ($cart && $cart->getEstimatedTotal() < 500) {
 return new \WP_Error(
 'min_order',
 __('Minimum order amount is $5.00.', 'fluent-cart')
 );
 }

 return $validation;
}, 10, 2);```

### ` cart/tax_behavior ` [](#cart-tax-behavior)
`fluent_cart/cart/tax_behavior` — Filter the tax behavior amount for the cart
**When it runs:** This filter fires during order creation in `CheckoutApi::placeOrder()`. It determines the tax behavior value that controls how tax is applied to the order total. The TaxModule hooks into this to read the computed tax behavior from the cart's checkout data.
**Source:** `api/Checkout/CheckoutApi.php:171`
**Parameters:**

- `$behavior` (int): The default tax behavior value (`0`)
- `$data` (array): Context dataphp
```
$data = [
 'cart' => $cart, // Cart model instance
];```

**Returns:**

- `int` — The tax behavior value (e.g., `0` for tax-exclusive, `1` for tax-inclusive)

**Usage:**php
```
add_filter('fluent_cart/cart/tax_behavior', function ($behavior, $data) {
 $cart = $data['cart'];

 // Force tax-inclusive behavior for a specific region
 $country = $cart->checkout_data['billing_address']['country'] ?? '';
 if (in_array($country, ['DE', 'FR', 'GB'])) {
 return 1; // Inclusive
 }

 return $behavior;
}, 10, 2);```

### ` checkout/validate_data ` [](#checkout-validate-data)
`fluent_cart/checkout/validate_data` — Add or modify checkout validation errors
**When it runs:** This filter fires after the core field, shipping, and terms validation has run, but before the order is created. It lets you append custom validation errors or clear existing ones.
**Source:** `api/Checkout/CheckoutApi.php:890`
**Parameters:**

- `$errors` (array): Associative array of validation errors (keyed by field name)
- `$data` (array): Context dataphp
```
$data = [
 'data' => $submittedData, // The checkout form data
 'cart' => $cart, // Cart model instance
];```

**Returns:**

- `array` — The modified errors array. An empty array means validation passes.

**Usage:**php
```
add_filter('fluent_cart/checkout/validate_data', function ($errors, $data) {
 $formData = $data['data'];

 // Require a phone number for physical products
 $cart = $data['cart'];
 if ($cart->requireShipping() && empty($formData['billing_address']['phone'])) {
 $errors['billing_phone'] = [
 'required' => __('Phone number is required for physical products.', 'fluent-cart'),
 ];
 }

 return $errors;
}, 10, 2);```

## Checkout Page Rendering [](#checkout-page-rendering)

### ` checkout_page_css_classes ` [](#checkout-page-css-classes)
`fluent_cart/checkout_page_css_classes` — Modify checkout page CSS classes
**When it runs:** This filter fires when the checkout page container is being rendered. It lets you add, remove, or modify the CSS classes on the checkout wrapper element.
**Source:** `app/Services/Renderer/CheckoutRenderer.php:144`
**Parameters:**

- `$classNames` (array): Array of CSS class strings
- `$data` (array): Context dataphp
```
$data = [
 'cart' => $cart, // Cart model instance
];```

**Returns:**

- `array` — The modified array of CSS class strings

**Usage:**php
```
add_filter('fluent_cart/checkout_page_css_classes', function ($classes, $data) {
 $cart = $data['cart'];

 // Add a class when cart has subscription items
 if ($cart->hasSubscription()) {
 $classes[] = 'has-subscription-items';
 }

 return $classes;
}, 10, 2);```

### ` checkout_page_notices ` [](#checkout-page-notices)
`fluent_cart/checkout_page_notices` — Add custom notices to the checkout page
**When it runs:** This filter fires during checkout page rendering, allowing you to inject notice messages that appear at the top of the checkout form.
**Source:** `app/Services/Renderer/CheckoutRenderer.php:170`
**Parameters:**

- `$notices` (array): Array of notice items (empty by default)
- `$data` (array): Context dataphp
```
$data = [
 'cart' => $cart, // Cart model instance
];```

**Returns:**

- `array` — Array of notice items to display

**Usage:**php
```
add_filter('fluent_cart/checkout_page_notices', function ($notices, $data) {
 $cart = $data['cart'];

 // Show a free shipping notice
 $total = $cart->getEstimatedTotal();
 if ($total < 5000 && $cart->requireShipping()) {
 $notices[] = [
 'type' => 'info',
 'message' => sprintf(
 __('Add %s more to qualify for free shipping!', 'fluent-cart'),
 '$' . number_format((5000 - $total) / 100, 2)
 ),
 ];
 }

 return $notices;
}, 10, 2);```

### ` checkout_renderer/billing_fields ` [](#checkout-renderer-billing-fields)
`fluent_cart/checkout_renderer/billing_fields` — Modify rendered billing fields on the checkout page
**When it runs:** This filter fires after the billing address fields have been assembled and rearranged in the checkout renderer. It allows modification of the fully prepared billing field HTML structures before output.
**Source:** `app/Services/Renderer/CheckoutRenderer.php:448`
**Parameters:**

- `$billingFields` (array): Array of billing field definitions with their rendered state
- `$data` (array): Context dataphp
```
$data = [
 'checkout_renderer' => $renderer, // CheckoutRenderer instance
 'cart' => $cart, // Cart model instance
];```

**Returns:**

- `array` — The modified billing fields array

**Usage:**php
```
add_filter('fluent_cart/checkout_renderer/billing_fields', function ($fields, $data) {
 // Remove the company field from rendered billing fields
 foreach ($fields as $sectionKey => &$section) {
 if (isset($section['schema']) && is_array($section['schema'])) {
 unset($section['schema']['billing_company']);
 }
 }

 return $fields;
}, 10, 2);```

### ` checkout_renderer/shipping_fields ` [](#checkout-renderer-shipping-fields)
`fluent_cart/checkout_renderer/shipping_fields` — Modify rendered shipping fields on the checkout page
**When it runs:** This filter fires after shipping address fields have been assembled and validated in the checkout renderer, before they are output as HTML.
**Source:** `app/Services/Renderer/CheckoutRenderer.php:521`
**Parameters:**

- `$shippingFields` (array): Array of shipping field definitions
- `$data` (array): Context dataphp
```
$data = [
 'checkout_renderer' => $renderer, // CheckoutRenderer instance
 'cart' => $cart, // Cart model instance
];```

**Returns:**

- `array` — The modified shipping fields array

**Usage:**php
```
add_filter('fluent_cart/checkout_renderer/shipping_fields', function ($fields, $data) {
 // Make the address line 2 required for shipping
 foreach ($fields as &$field) {
 if (isset($field['name']) && $field['name'] === 'shipping_address_2') {
 $field['required'] = 'yes';
 }
 }

 return $fields;
}, 10, 2);```

### ` disable_order_notes_for_digital_products ` [](#disable-order-notes-for-digital-products)
`fluent_cart/disable_order_notes_for_digital_products` — Control order notes visibility for digital products
**When it runs:** This filter fires when the checkout renderer decides whether to show the order notes textarea. By default, order notes are hidden when the cart contains only digital (non-shippable) products.
**Source:** `app/Services/Renderer/CheckoutRenderer.php:560`
**Parameters:**

- `$disable` (bool): Whether to hide order notes for digital-only carts. Default `true`.
- `$data` (array): Context dataphp
```
$data = [
 'cart' => $cart, // Cart model instance
];```

**Returns:**

- `bool` — `true` to hide order notes for digital products, `false` to always show them

**Usage:**php
```
add_filter('fluent_cart/disable_order_notes_for_digital_products', function ($disable, $data) {
 // Always show order notes, even for digital products
 return false;
}, 10, 2);```

### ` checkout_active_payment_methods ` [](#checkout-active-payment-methods)
`fluent_cart/checkout_active_payment_methods` — Filter active payment methods on the checkout page
**When it runs:** This filter fires when listing the available payment methods on both the standard checkout and modal checkout renderers. It lets you add, remove, or reorder payment gateway instances.
**Source:**

- `app/Services/Renderer/CheckoutRenderer.php:652`
- `app/Services/Renderer/ModalCheckoutRenderer.php:450`

**Parameters:**

- `$activePaymentMethods` (array): Array of payment method instances
- `$data` (array): Context dataphp
```
$data = [
 'cart' => $cart, // Cart model instance
];```

**Returns:**

- `array` — The modified array of payment method instances

**Usage:**php
```
add_filter('fluent_cart/checkout_active_payment_methods', function ($methods, $data) {
 $cart = $data['cart'];

 // Remove COD for orders over $500
 if ($cart->getEstimatedTotal() > 50000) {
 $methods = array_filter($methods, function ($method) {
 return $method->getMeta('route') !== 'cod';
 });
 }

 return array_values($methods);
}, 10, 2);```

### ` checkout_page_order_button_text ` [](#checkout-page-order-button-text)
`fluent_cart/checkout_page_order_button_text` — Customize the place order button text
**When it runs:** This filter fires when the checkout submit button is being rendered, allowing you to change its label.
**Source:** `app/Services/Renderer/CheckoutRenderer.php:705`
**Parameters:**

- `$text` (string): The button text. Default: `__('Place order', 'fluent-cart')`

**Returns:**

- `string` — The modified button text

**Usage:**php
```
add_filter('fluent_cart/checkout_page_order_button_text', function ($text) {
 return __('Complete Purchase', 'fluent-cart');
});```

### ` payment_method_list_class ` [](#payment-method-list-class)
`fluent_cart_payment_method_list_class` — Add CSS classes to a payment method wrapper
**When it runs:** This filter fires when rendering each individual payment method option in both the standard and modal checkout. It lets you add custom CSS classes to the payment method container element.
**Note:** This hook uses a non-standard prefix (`fluent_cart_`) rather than the standard `fluent_cart/` convention. This is a legacy naming that may be standardized in a future release.
**Source:**

- `app/Services/Renderer/CheckoutRenderer.php:797`
- `app/Services/Renderer/ModalCheckoutRenderer.php:569`

**Parameters:**

- `$class` (string): The CSS class string. Default: `''`
- `$data` (array): Context dataphp
```
$data = [
 'route' => 'stripe', // Payment method route/slug
 'method_title' => 'Stripe', // Display title
 'method_style' => 'logo', // Display style
];```

**Returns:**

- `string` — The modified CSS class string

**Usage:**php
```
add_filter('fluent_cart_payment_method_list_class', function ($class, $data) {
 // Add a highlight class for COD payment
 if ($data['route'] === 'cod') {
 return $class . ' payment-method-highlighted';
 }
 return $class;
}, 10, 2);```

### ` modal_checkout/filter_active_payment_methods ` [](#modal-checkout-filter-active-payment-methods)
`fluent_cart/modal_checkout/filter_active_payment_methods` — Restrict payment methods in modal checkout
**When it runs:** This filter fires during modal checkout rendering, after the active payment methods have been resolved. If a non-empty array of payment method route slugs is returned, only those methods will be shown in the modal.
**Source:** `app/Services/Renderer/ModalCheckoutRenderer.php:455`
**Parameters:**

- `$selectedMethods` (array): Empty array by default

**Returns:**

- `array` — Array of payment method route slugs to show (e.g., `['stripe', 'paypal']`). An empty array shows all active methods.

**Usage:**php
```
add_filter('fluent_cart/modal_checkout/filter_active_payment_methods', function ($methods) {
 // Only show Stripe in the modal checkout
 return ['stripe'];
});```

### ` enable_modal_checkout ` [](#enable-modal-checkout)
`fluent_cart/enable_modal_checkout` — Enable or disable modal checkout
**When it runs:** This filter fires when checking whether modal (popup) checkout is enabled. By default, modal checkout is disabled.
**Source:** `app/Helpers/Helper.php:1710`
**Parameters:**

- `$enabled` (bool): Whether modal checkout is enabled. Default: `false`

**Returns:**

- `bool` — `true` to enable modal checkout, `false` to use the standard checkout page

**Usage:**php
```
add_filter('fluent_cart/enable_modal_checkout', function ($enabled) {
 // Enable modal checkout
 return true;
});```

## Checkout Data & Session [](#checkout-data-session)

### ` checkout/checkout_data_changed ` [](#checkout-checkout-data-changed)
`fluent_cart/checkout/checkout_data_changed` — Modify checkout data after a change is detected
**When it runs:** This filter fires after checkout session data has been patched and saved, letting you modify the response data that is sent back to the browser. It runs in both the standard and AJAX checkout data change handlers.
**Source:**

- `app/Hooks/Cart/WebCheckoutHandler.php:495`
- `app/Hooks/Cart/WebCheckoutHandler.php:1115`

**Parameters:**

- `$checkoutData` (array): The checkout change response dataphp
```
$checkoutData = [
 'message' => 'Data saved',
 'fragments' => [...],
 'estimated_total' => 15000,
 'estimated_total_changed' => true,
 'totals' => [
 'old' => 14000,
 'new' => 15000,
 ],
 'tax_total_changes' => false,
 'shipping_charge_changes' => true,
];```

- `$data` (array): Context dataphp
```
$data = [
 'cart' => $cart, // Cart model instance
];```

**Returns:**

- `array` — The modified checkout data response

**Usage:**php
```
add_filter('fluent_cart/checkout/checkout_data_changed', function ($checkoutData, $data) {
 // Add custom data to the response
 $checkoutData['custom_notice'] = __('Your order qualifies for a bonus!', 'fluent-cart');
 return $checkoutData;
}, 10, 2);```

### ` checkout/cart_updated ` [](#checkout-cart-updated)
`fluent_cart/checkout/cart_updated` — Filter the cart update response data
**When it runs:** This filter fires when the cart has been updated during the checkout session (e.g., items added or removed). It lets you append additional data to the success response.
**Source:** `app/Hooks/Cart/WebCheckoutHandler.php:683`
**Parameters:**

- `$data` (array): The response dataphp
```
$data = [
 'cart' => $cart, // The updated Cart model instance
];```

**Returns:**

- `array` — The modified response data array

**Usage:**php
```
add_filter('fluent_cart/checkout/cart_updated', function ($data) {
 $cart = $data['cart'];
 $data['item_count'] = count($cart->getItems());
 $data['free_shipping_eligible'] = $cart->getEstimatedTotal() >= 5000;
 return $data;
});```

### ` checkout/before_patch_checkout_data ` [](#checkout-before-patch-checkout-data)
`fluent_cart/checkout/before_patch_checkout_data` — Modify fill data before patching the checkout session
**When it runs:** This filter fires before the checkout session data is persisted to the database. Modules like Shipping and Tax hook in to recalculate charges whenever address or form data changes.
**Source:**

- `app/Hooks/Cart/WebCheckoutHandler.php:791`
- `app/Hooks/Cart/WebCheckoutHandler.php:967`

**Parameters:**

- `$fillData` (array): The data to be merged into the cart's checkout sessionphp
```
$fillData = [
 'checkout_data' => [...], // Checkout data to persist
 'cart_data' => [...], // Cart data updates
 'hook_changes' => [
 'shipping' => false, // Whether shipping was recalculated
 'tax' => false, // Whether tax was recalculated
 ],
];```

- `$data` (array): Context dataphp
```
$data = [
 'cart' => $cart, // Cart model instance
 'prev_data' => $prevFlatData, // Previous checkout data
 'changes' => $normalizeData, // The incoming changes
 'all_data' => $allData, // All submitted data
];```

**Returns:**

- `array` — The modified fill data

**Usage:**php
```
add_filter('fluent_cart/checkout/before_patch_checkout_data', function ($fillData, $data) {
 $cart = $data['cart'];
 $changes = $data['changes'];

 // Recalculate a custom surcharge when the country changes
 if (isset($changes['billing_country'])) {
 $surcharge = MyModule::calculateSurcharge($changes['billing_country']);
 $fillData['checkout_data']['custom_surcharge'] = $surcharge;
 $fillData['hook_changes']['custom'] = true;
 }

 return $fillData;
}, 10, 2);```

### ` checkout/after_patch_checkout_data_fragments ` [](#checkout-after-patch-checkout-data-fragments)
`fluent_cart/checkout/after_patch_checkout_data_fragments` — Modify HTML fragments returned after patching checkout data
**When it runs:** This filter fires after the checkout session has been patched and the HTML fragments for the AJAX response have been generated. It allows modules to add or modify the HTML fragments that will be swapped into the checkout page.
**Source:** `app/Hooks/Cart/WebCheckoutHandler.php:901`
**Parameters:**

- `$fragments` (array): Associative array of HTML fragment selectors and content
- `$data` (array): Context dataphp
```
$data = [
 'cart' => $cart, // Cart model instance
 'changes' => $normalizeData, // The changes that were applied
];```

**Returns:**

- `array` — The modified fragments array

**Usage:**php
```
add_filter('fluent_cart/checkout/after_patch_checkout_data_fragments', function ($fragments, $data) {
 $cart = $data['cart'];

 // Add a custom fragment for a surcharge display
 $fragments['.custom-surcharge-display'] = [
 'content' => '<span class="custom-surcharge">' . esc_html('$5.00') . '</span>',
 'type' => 'replace',
 ];

 return $fragments;
}, 10, 2);```

### ` apply_order_bump ` [](#apply-order-bump)
`fluent_cart/apply_order_bump` — Handle order bump application on the checkout page
**When it runs:** This filter fires when a customer toggles an order bump on the checkout page. By default it returns a `WP_Error`; modules that implement order bumps must hook in to handle the logic and return success data.
**Source:** `app/Hooks/Cart/WebCheckoutHandler.php:1144`
**Parameters:**

- `$response` (WP_Error): Default error response
- `$data` (array): Context dataphp
```
$data = [
 'bump_id' => 5, // The order bump ID
 'cart' => $cart, // Cart model instance
 'request_data' => $requestData, // The full request data
];```

**Returns:**

- `array|WP_Error` — Return an array with success data to apply the bump, or a `WP_Error` to reject it

**Usage:**php
```
add_filter('fluent_cart/apply_order_bump', function ($response, $data) {
 $bumpId = $data['bump_id'];
 $cart = $data['cart'];

 $bump = MyOrderBumpModule::find($bumpId);
 if (!$bump) {
 return $response; // Keep the WP_Error
 }

 // Apply the bump to the cart
 $cart->addItem($bump->variation_id, 1);

 return [
 'message' => __('Order bump applied!', 'fluent-cart'),
 'cart' => $cart,
 ];
}, 10, 2);```

## Checkout Field Schema [](#checkout-field-schema)

### ` checkout_address_fields ` [](#checkout-address-fields)
`fluent_cart/checkout_address_fields` — Modify address field definitions
**When it runs:** This filter fires when the address field schema is built inside `CartCheckoutHelper`. It controls which fields appear in both billing and shipping address sections.
**Source:** `app/Helpers/CartCheckoutHelper.php:692`
**Parameters:**

- `$fields` (array): Associative array of address field definitions

**Returns:**

- `array` — The modified fields array

**Usage:**php
```
add_filter('fluent_cart/checkout_address_fields', function ($fields) {
 // Add a company field
 $fields['company'] = [
 'label' => __('Company Name', 'fluent-cart'),
 'type' => 'text',
 'required' => false,
 ];

 return $fields;
});```

### ` checkout_billing_fields ` [](#checkout-billing-fields)
`fluent_cart/checkout_billing_fields` — Modify billing address field schema
**When it runs:** This filter fires when the billing fields are being assembled in `CartCheckoutHelper`. It runs after address fields have been merged with account creation options and section labels.
**Source:** `app/Helpers/CartCheckoutHelper.php:730`
**Parameters:**

- `$fields` (array): The billing field definitions organized in sections
- `$data` (array): Context dataphp
```
$data = [
 'viewData' => $viewData, // Block/view configuration data
 'customer' => $customer, // Current customer (or null)
 'labels' => $labels, // Custom labels from block settings
 'has_subscription' => false, // Whether the cart has subscription items
];```

**Returns:**

- `array` — The modified billing fields array

**Usage:**php
```
add_filter('fluent_cart/checkout_billing_fields', function ($fields, $data) {
 // Make the phone field required when cart has subscriptions
 if ($data['has_subscription']) {
 if (isset($fields['address_section']['schema']['billing_phone'])) {
 $fields['address_section']['schema']['billing_phone']['required'] = 'yes';
 }
 }

 return $fields;
}, 10, 2);```

### ` checkout_shipping_fields ` [](#checkout-shipping-fields)
`fluent_cart/checkout_shipping_fields` — Modify shipping address field schema
**When it runs:** This filter fires when the shipping address fields are being assembled in `CartCheckoutHelper`.
**Source:** `app/Helpers/CartCheckoutHelper.php:771`
**Parameters:**

- `$fields` (array): The shipping field definitions organized in sections
- `$data` (array): Context dataphp
```
$data = [
 'viewData' => $viewData, // Block/view configuration data
 'labels' => $labels, // Custom labels from block settings
];```

**Returns:**

- `array` — The modified shipping fields array

**Usage:**php
```
add_filter('fluent_cart/checkout_shipping_fields', function ($fields, $data) {
 // Remove address line 2 from shipping
 if (isset($fields['address_section']['schema']['shipping_address_2'])) {
 unset($fields['address_section']['schema']['shipping_address_2']);
 }

 return $fields;
}, 10, 2);```

### ` checkout_signup_fields ` [](#checkout-signup-fields)
`fluent_cart/checkout_signup_fields` — Modify the account signup form fields
**When it runs:** This filter fires when the guest checkout signup form fields (username, email, password) are assembled.
**Source:** `app/Helpers/CartCheckoutHelper.php:846`
**Parameters:**

- `$fields` (array): Associative array of signup field definitionsphp
```
$fields = [
 'user_login' => [
 'type' => 'text',
 'label' => 'Username or Email',
 'required' => 'yes',
 ...
 ],
 'user_pass' => [
 'type' => 'password',
 'label' => 'Password',
 'required' => 'no',
 ...
 ],
];```

**Returns:**

- `array` — The modified signup fields array

**Usage:**php
```
add_filter('fluent_cart/checkout_signup_fields', function ($fields) {
 // Make password required
 if (isset($fields['user_pass'])) {
 $fields['user_pass']['required'] = 'yes';
 }

 return $fields;
});```

### ` checkout_login_fields ` [](#checkout-login-fields)
`fluent_cart/checkout_login_fields` — Modify the checkout login form fields
**When it runs:** This filter fires when the login form fields (username, password) are assembled for the checkout page.
**Source:** `app/Helpers/CartCheckoutHelper.php:872`
**Parameters:**

- `$fields` (array): Associative array of login field definitionsphp
```
$fields = [
 'user_login' => [
 'type' => 'text',
 'label' => 'Username or Email',
 'required' => 'yes',
 ...
 ],
 'user_pass' => [
 'type' => 'password',
 'label' => 'Password',
 'required' => 'yes',
 ...
 ],
];```

**Returns:**

- `array` — The modified login fields array

**Usage:**php
```
add_filter('fluent_cart/checkout_login_fields', function ($fields) {
 // Change the username label
 if (isset($fields['user_login'])) {
 $fields['user_login']['label'] = __('Email Address', 'fluent-cart');
 $fields['user_login']['placeholder'] = __('Enter your email', 'fluent-cart');
 }

 return $fields;
});```

### ` checkout_coupon_fields ` [](#checkout-coupon-fields)
`fluent_cart/checkout_coupon_fields` — Modify the coupon input fields
**When it runs:** This filter fires when the coupon code input fields are assembled for the checkout page.
**Source:** `app/Helpers/CartCheckoutHelper.php:925`
**Parameters:**

- `$fields` (array): Associative array of coupon field definitions (typically includes a coupon code input and a hidden applied-coupons field)

**Returns:**

- `array` — The modified coupon fields array

**Usage:**php
```
add_filter('fluent_cart/checkout_coupon_fields', function ($fields) {
 // Customize the coupon input placeholder
 if (isset($fields['coupon_code'])) {
 $fields['coupon_code']['placeholder'] = __('Got a discount code?', 'fluent-cart');
 }

 return $fields;
});```

### ` checkout_page_name_fields_schema ` [](#checkout-page-name-fields-schema)
`fluent_cart/checkout_page_name_fields_schema` — Modify name fields on the checkout page
**When it runs:** This filter fires when the checkout name fields schema (first name, last name, email, and optionally company) is being built. Modules like FluentCRM hook in to pre-fill name and email from CRM contact data.
**Source:** `app/Services/Renderer/CheckoutFieldsSchema.php:86`
**Parameters:**

- `$nameFields` (array): Associative array of name/email field definitions
- `$data` (array): Context dataphp
```
$data = [
 'cart' => $cart, // Cart model instance (may be null)
 'scope' => 'billing', // Field scope (billing or shipping)
];```

**Returns:**

- `array` — The modified name fields array

**Usage:**php
```
add_filter('fluent_cart/checkout_page_name_fields_schema', function ($fields, $data) {
 // Pre-fill from logged-in user
 if ($userId = get_current_user_id()) {
 $user = get_userdata($userId);
 if (!empty($fields['billing_email']) && empty($fields['billing_email']['value'])) {
 $fields['billing_email']['value'] = $user->user_email;
 }
 }

 return $fields;
}, 10, 2);```

### ` fields/address_base_fields ` [](#fields-address-base-fields)
`fluent_cart/fields/address_base_fields` — Modify base address field definitions
**When it runs:** This filter fires when the low-level address field definitions are assembled in `CheckoutFieldsSchema`. These are the raw field configurations (country, state, city, zip, address lines) that form the foundation for both billing and shipping sections.
**Source:** `app/Services/Renderer/CheckoutFieldsSchema.php:320`
**Parameters:**

- `$fields` (array): Array of base address field definitions
- `$data` (array): Context dataphp
```
$data = [
 'config' => $config, // Address field configuration
 'scope' => 'billing', // Field scope (billing or shipping)
 'requirements' => $requireFields, // Required field requirements
];```

**Returns:**

- `array` — The modified base address fields array

**Usage:**php
```
add_filter('fluent_cart/fields/address_base_fields', function ($fields, $data) {
 // Make the city field optional for billing
 if ($data['scope'] === 'billing') {
 foreach ($fields as &$field) {
 if (isset($field['name']) && $field['name'] === 'billing_city') {
 unset($field['required']);
 }
 }
 }

 return $fields;
}, 10, 2);```

### ` default_billing_country_for_checkout ` [](#default-billing-country-for-checkout)
`fluent_cart/default_billing_country_for_checkout` — Set the default billing country
**When it runs:** This filter fires when determining the default billing country for the checkout form. By default, it attempts to read the country from the Cloudflare `HTTP_CF_IPCOUNTRY` header for geo-detection.
**Source:** `app/Helpers/AddressHelper.php:639`
**Parameters:**

- `$countryCode` (string): The detected country code (ISO 3166-1 alpha-2), or an empty string if not detected

**Returns:**

- `string` — A valid ISO 3166-1 alpha-2 country code

**Usage:**php
```
add_filter('fluent_cart/default_billing_country_for_checkout', function ($countryCode) {
 // Default to US if no country was detected
 if (empty($countryCode)) {
 return 'US';
 }

 return $countryCode;
});```

## Checkout Localization [](#checkout-localization)

### ` checkout/localize_data ` [](#checkout-localize-data)
`fluent_cart/checkout/localize_data` — Modify checkout JavaScript localized data
**When it runs:** This filter fires when the checkout page assets are being enqueued. It allows modules to add or modify the data that is passed to the checkout JavaScript via `wp_localize_script()`. Modules like Turnstile hook in to add their client-side configuration.
**Source:** `app/Modules/Templating/AssetLoader.php:497`
**Parameters:**

- `$data` (array): The localized data arrayphp
```
$data = [
 'fluentcart_checkout_vars' => [
 'rest' => [...], // REST API info
 'ajaxurl' => '...', // Admin AJAX URL
 'is_all_digital' => false, // Whether cart is digital-only
 'is_cart_locked' => 'no', // Cart lock state
 'disable_coupons' => 'no', // Coupon toggle
 'tax_settings' => [...], // Tax configuration
 'cart_hash' => '...', // Cart hash
 'is_instant_checkout' => false, // Instant checkout flag
 'redirect_url' => '...', // Checkout page URL
 'store_country' => 'US', // Store country
 'is_zero_payment' => 'no', // Zero total flag
 // ...and more
 ],
];```

- `$cart` ([Cart](https://dev.fluentcart.com/database/models/cart.html)): The Cart model instance

**Returns:**

- `array` — The modified localized data array

**Usage:**php
```
add_filter('fluent_cart/checkout/localize_data', function ($data, $cart) {
 // Add custom JS configuration
 $data['fluentcart_checkout_vars']['my_module'] = [
 'enabled' => true,
 'endpoint' => rest_url('my-module/v1/validate'),
 ];

 return $data;
}, 10, 2);```

### ` payment_methods_with_custom_checkout_buttons ` [](#payment-methods-with-custom-checkout-buttons)
`fluent_cart/payment_methods_with_custom_checkout_buttons` — Register payment methods that use custom checkout buttons
**When it runs:** This filter fires when building the checkout localized data. Payment gateways that render their own submit button (like PayPal's smart buttons) register themselves here so the default "Place Order" button behavior is adapted accordingly.
**Source:** `app/Modules/Templating/AssetLoader.php:465`
**Parameters:**

- `$methods` (array): Array of payment method route slugs that have custom buttons. Default: `[]`

**Returns:**

- `array` — The modified array of payment method route slugs

**Usage:**php
```
add_filter('fluent_cart/payment_methods_with_custom_checkout_buttons', function ($methods) {
 // Register my custom gateway as having its own button
 $methods[] = 'my_custom_gateway';
 return $methods;
});```

### ` instant_checkout/allowed_redirect_hosts ` [](#instant-checkout-allowed-redirect-hosts)
`fluent_cart/instant_checkout/allowed_redirect_hosts` — Control allowed redirect hosts for instant checkout
**When it runs:** This filter fires during the instant checkout (add-to-cart via URL) flow when a `redirect_to` parameter is provided. For security, only URLs whose hosts are in the allowed list will be accepted as redirect targets.
**Source:** `app/Http/Routes/WebRoutes.php:155`
**Parameters:**

- `$allowedHosts` (array): Array of allowed hostnames. Default: the current site's host.php
```
$allowedHosts = [
 'example.com', // parse_url(home_url(), PHP_URL_HOST)
];```

- `$data` (array): Context dataphp
```
$data = [
 'allowed_hosts' => $allowedHosts,
];```

**Returns:**

- `array` — Array of allowed redirect hostnames

**Usage:**php
```
add_filter('fluent_cart/instant_checkout/allowed_redirect_hosts', function ($hosts) {
 // Allow redirects to a subdomain
 $hosts[] = 'shop.example.com';
 $hosts[] = 'members.example.com';
 return $hosts;
});```

---

## Customers & Subscriptions

Source: https://dev.fluentcart.com/hooks/filters/customers-and-subscriptions.html


All filters related to [Customer](https://dev.fluentcart.com/database/models/customer.html) management, the customer portal, [Subscription](https://dev.fluentcart.com/database/models/subscription.html) lifecycle, billing configuration, and automated reminders.
## Customer Data & Portal [](#customer-data-portal)

### ` customer/view ` [](#customer-view)
`fluent_cart/customer/view` — Filter admin single customer view data
**When it runs:** This filter is applied when preparing a single customer's data for display in the admin panel.
**Parameters:**

- `$customer` ([Customer](https://dev.fluentcart.com/database/models/customer.html)): The Customer model instance with loaded relationsphp
```
$customer = [
 'id' => 456,
 'email' => '[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)',
 'first_name' => 'John',
 'last_name' => 'Doe',
 'total_orders' => 5,
 'total_spent' => 50000,
 'selected_labels' => [...]
];```

- `$requestData` (array): The full request data from `$request->all()`

**Returns:**

- `$customer` ([Customer](https://dev.fluentcart.com/database/models/customer.html)): The modified customer data

**Source:** `app/Http/Controllers/CustomerController.php:74`
**Usage:**php
```
add_filter('fluent_cart/customer/view', function($customer, $requestData) {
 // Add loyalty points to customer view
 $customer['loyalty_points'] = get_user_meta($customer['user_id'], 'loyalty_points', true);
 return $customer;
}, 10, 2);```

### ` widgets/single_customer ` [](#widgets-single-customer)
`fluent_cart/widgets/single_customer` — Filter single customer admin widgets
**When it runs:** This filter is applied when loading widget data for a single customer's admin view, allowing you to inject custom widget sections.
**Parameters:**

- `$widgets` (array): Array of widget definitions (default: `[]`)
- `$customer` ([Customer](https://dev.fluentcart.com/database/models/customer.html)): The Customer model instance

**Returns:**

- `$widgets` (array): The modified widgets array

**Source:** `app/Http/Controllers/CustomerController.php:177`
**Usage:**php
```
add_filter('fluent_cart/widgets/single_customer', function($widgets, $customer) {
 // Add a custom CRM widget
 $widgets[] = [
 'title' => 'CRM Notes',
 'content' => get_user_meta($customer->user_id, 'crm_notes', true)
 ];
 return $widgets;
}, 10, 2);```

### ` customer_dashboard_data ` [](#customer-dashboard-data)
`fluent_cart/customer_dashboard_data` — Filter customer dashboard data
**When it runs:** This filter is applied when preparing the customer portal dashboard data, including the recent orders list and section parts. Runs both when a customer exists and when no customer is found.
**Parameters:**

- `$data` (array): The dashboard response dataphp
```
$data = [
 'message' => 'Success',
 'dashboard_data' => [
 'orders' => [...] // Recent orders collection
 ],
 'sections_parts' => [
 'before_orders_table' => '',
 'after_orders_table' => ''
 ]
];```

- `$context` (array): Context data containing the customerphp
```
$context = [
 'customer' => $customer // Customer model or null
];```

**Returns:**

- `$data` (array): The modified dashboard data

**Source:** `app/Http/Controllers/FrontendControllers/CustomerProfileController.php:58,114`
**Usage:**php
```
add_filter('fluent_cart/customer_dashboard_data', function($data, $context) {
 $customer = $context['customer'];
 if ($customer) {
 // Add a welcome banner above the orders table
 $data['sections_parts']['before_orders_table'] = '<div class="welcome-banner">Welcome back!</div>';
 }
 return $data;
}, 10, 2);```

### ` global_customer_menu_items ` [](#global-customer-menu-items)
`fluent_cart/global_customer_menu_items` — Filter customer portal menu items
**When it runs:** This filter is applied when building the customer portal sidebar navigation menu, after built-in items have been conditionally removed (e.g., subscriptions, licenses).
**Parameters:**

- `$menuItems` (array): Associative array of menu items keyed by slugphp
```
$menuItems = [
 'orders' => [
 'label' => 'Orders',
 'css_class' => 'fct_route',
 'link' => '/customer-portal/#/orders',
 'icon_svg' => '<svg>...</svg>'
 ],
 'subscriptions' => [...],
 'licenses' => [...],
 'downloads' => [...],
 'profile' => [...]
];```

- `$context` (array): Context dataphp
```
$context = [
 'base_url' => '/customer-portal/#/'
];```

**Returns:**

- `$menuItems` (array): The modified menu items array

**Source:** `app/Hooks/Handlers/ShortCodes/CustomerProfileHandler.php:266`
**Usage:**php
```
add_filter('fluent_cart/global_customer_menu_items', function($menuItems, $context) {
 // Add a custom "Support" tab before "profile"
 $baseUrl = $context['base_url'];
 $menuItems['support'] = [
 'label' => 'Support',
 'css_class' => 'fct_route',
 'link' => $baseUrl . 'support',
 'icon_svg' => '<svg>...</svg>'
 ];
 return $menuItems;
}, 10, 2);```

### ` customer_portal/active_tab ` [](#customer-portal-active-tab)
`fluent_cart/customer_portal/active_tab` — Filter the active tab in customer portal
**When it runs:** This filter is applied when rendering the customer portal to determine which tab should be visually active by default.
**Parameters:**

- `$activeTab` (string): The active tab identifier (default: `''`)

**Returns:**

- `$activeTab` (string): The modified active tab slug

**Source:** `app/Hooks/Handlers/ShortCodes/CustomerProfileHandler.php:117`
**Usage:**php
```
add_filter('fluent_cart/customer_portal/active_tab', function($activeTab) {
 // Default to subscriptions tab
 return 'subscriptions';
}, 10, 1);```

### ` customer_portal/custom_endpoints ` [](#customer-portal-custom-endpoints)
`fluent_cart/customer_portal/custom_endpoints` — Filter custom portal endpoints
**When it runs:** This filter is applied when routing customer portal requests to check for registered custom endpoint paths. Use this to add entirely new pages to the customer portal.
**Parameters:**

- `$endpoints` (array): Associative array of custom endpoints (default: `[]`)php
```
$endpoints = [
 'my-page' => [
 'render_callback' => callable,
 // or 'page_id' => 123
 ]
];```

**Returns:**

- `$endpoints` (array): The modified endpoints array

**Source:** `app/Hooks/Handlers/ShortCodes/CustomerProfileHandler.php:141`
**Usage:**php
```
add_filter('fluent_cart/customer_portal/custom_endpoints', function($endpoints) {
 $endpoints['warranty'] = [
 'render_callback' => function() {
 echo '<div class="warranty-page">Warranty info here</div>';
 }
 ];
 return $endpoints;
}, 10, 1);```

TIP
Consider using the `FluentCartGeneralApi::addCustomerPortalEndpoint()` helper method instead, which registers both the menu item and the endpoint in one call.
### ` customer_portal/subscription_data ` [](#customer-portal-subscription-data)
`fluent_cart/customer_portal/subscription_data` — Filter customer portal subscription data
**When it runs:** This filter is applied when preparing a single subscription's data for display in the customer portal, after transactions have been loaded.
**Parameters:**

- `$formattedData` (array): The formatted subscription data including transactions
- `$context` (array): Context dataphp
```
$context = [
 'subscription' => $subscription, // Subscription model
 'customer' => $customer // Customer model
];```

**Returns:**

- `$formattedData` (array): The modified subscription data

**Source:** `app/Http/Controllers/FrontendControllers/CustomerSubscriptionController.php:157`
**Usage:**php
```
add_filter('fluent_cart/customer_portal/subscription_data', function($formattedData, $context) {
 // Add next invoice preview
 $subscription = $context['subscription'];
 $formattedData['next_invoice_preview'] = [
 'amount' => $subscription->recurring_amount,
 'date' => $subscription->expiration_at
 ];
 return $formattedData;
}, 10, 2);```

### ` payment_methods/stripe_pub_key ` [](#payment-methods-stripe-pub-key)
`fluent_cart/payment_methods/stripe_pub_key` — Filter Stripe public key for customer portal
**When it runs:** This filter is applied when localizing JavaScript data for the customer portal, providing the Stripe publishable key for client-side payment operations.
**Parameters:**

- `$pubKey` (string): The Stripe publishable key (default: `''`)

**Returns:**

- `$pubKey` (string): The modified Stripe public key

**Source:** `app/Hooks/Handlers/ShortCodes/CustomerProfileHandler.php:356`
**Usage:**php
```
add_filter('fluent_cart/payment_methods/stripe_pub_key', function($pubKey) {
 // Override Stripe key for specific conditions
 if (defined('STRIPE_TEST_MODE') && STRIPE_TEST_MODE) {
 return 'pk_test_xxxxxxxxxxxx';
 }
 return $pubKey;
}, 10, 1);```

### ` payment_methods/paypal_client_id ` [](#payment-methods-paypal-client-id)
`fluent_cart/payment_methods/paypal_client_id` — Filter PayPal client ID for customer portal
**When it runs:** This filter is applied when localizing JavaScript data for the customer portal, providing the PayPal client ID for client-side payment operations.
**Parameters:**

- `$clientId` (string): The PayPal client ID (default: `''`)
- `$context` (array): Additional context data (default: `[]`)

**Returns:**

- `$clientId` (string): The modified PayPal client ID

**Source:** `app/Hooks/Handlers/ShortCodes/CustomerProfileHandler.php:357`
**Usage:**php
```
add_filter('fluent_cart/payment_methods/paypal_client_id', function($clientId, $context) {
 // Provide the PayPal sandbox client ID for testing
 return 'AYourPayPalClientId';
}, 10, 2);```

## Customer Statuses & Auth [](#customer-statuses-auth)

### ` editable_customer_statuses ` [](#editable-customer-statuses)
`fluent-cart/editable_customer_statuses` — Filter editable customer statuses
**When it runs:** This filter is applied when retrieving the list of customer statuses that can be set in the admin panel.
**Parameters:**

- `$statuses` (array): Associative array of status key => labelphp
```
$statuses = [
 'active' => 'Active',
 'inactive' => 'Inactive'
];```

- `$context` (array): Additional context data (default: `[]`)

**Returns:**

- `$statuses` (array): The modified statuses array

**Source:** `app/Helpers/Helper.php:162`, `app/Helpers/Status.php:350`
**Usage:**php
```
add_filter('fluent-cart/editable_customer_statuses', function($statuses, $context) {
 // Add a "suspended" customer status
 $statuses['suspended'] = __('Suspended', 'my-plugin');
 return $statuses;
}, 10, 2);```

Note
This hook uses a hyphen separator (`fluent-cart/`) instead of the usual underscore separator (`fluent_cart/`).
### ` user/after_register/skip_hooks ` [](#user-after-register-skip-hooks)
`fluent_cart/user/after_register/skip_hooks` — Skip post-registration hooks
**When it runs:** This filter is applied after a new WordPress user has been created during checkout registration. When it returns `true`, standard WordPress post-registration hooks like `register_new_user` are skipped.
**Parameters:**

- `$skip` (bool): Whether to skip the hooks (default: `false`)
- `$user_id` (int): The newly created WordPress user ID

**Returns:**

- `$skip` (bool): Whether to skip the post-registration hooks

**Source:** `app/Services/AuthService.php:122`
**Usage:**php
```
add_filter('fluent_cart/user/after_register/skip_hooks', function($skip, $userId) {
 // Skip default WP registration hooks to prevent welcome emails
 // when creating users during checkout
 return true;
}, 10, 2);```

## Subscription Statuses & Configuration [](#subscription-statuses-configuration)

### ` subscription_statuses ` [](#subscription-statuses)
`fluent_cart/subscription_statuses` — Filter subscription statuses
**When it runs:** This filter is applied when retrieving the list of all available subscription statuses used throughout the system.
**Parameters:**

- `$statuses` (array): Associative array of status key => labelphp
```
$statuses = [
 'pending' => 'Pending',
 'active' => 'Active',
 'failing' => 'Failing',
 'paused' => 'Paused',
 'expired' => 'Expired',
 'expiring' => 'Expiring',
 'canceled' => 'Canceled',
 'trialing' => 'Trialing',
 'intended' => 'Intended',
 'past_due' => 'Past Due',
 'completed' => 'Completed'
];```

- `$context` (array): Additional context data (default: `[]`)

**Returns:**

- `$statuses` (array): The modified subscription statuses array

**Source:** `app/Helpers/Status.php:253`
**Usage:**php
```
add_filter('fluent_cart/subscription_statuses', function($statuses, $context) {
 // Add a custom "on_hold" status
 $statuses['on_hold'] = __('On Hold', 'my-plugin');
 return $statuses;
}, 10, 2);```

### ` validable_subscription_statuses ` [](#validable-subscription-statuses)
`fluent_cart/validable_subscription_statuses` — Filter valid (active) subscription statuses
**When it runs:** This filter is applied when determining which subscription statuses should be considered "valid" (i.e., the subscription grants access to the product/service). Used for license validation, download access, etc.
**Parameters:**

- `$statuses` (array): Array of status keys considered validphp
```
$statuses = ['active', 'trialing'];```

- `$context` (array): Additional context data (default: `[]`)

**Returns:**

- `$statuses` (array): The modified list of valid statuses

**Source:** `app/Helpers/Status.php:271`
**Usage:**php
```
add_filter('fluent_cart/validable_subscription_statuses', function($statuses, $context) {
 // Also treat "expiring" subscriptions as valid until they actually expire
 $statuses[] = 'expiring';
 return $statuses;
}, 10, 2);```

### ` subscription/view ` [](#subscription-view)
`fluent_cart/subscription/view` — Filter admin subscription view data
**When it runs:** This filter is applied when preparing a single subscription's data for display in the admin panel.
**Parameters:**

- `$subscription` ([Subscription](https://dev.fluentcart.com/database/models/subscription.html)): The Subscription model with loaded relations
- `$context` (array): Additional context data (default: `[]`)

**Returns:**

- `$subscription` (array): The modified subscription data

**Source:** `app/Modules/Subscriptions/Http/Controllers/SubscriptionController.php:63`
**Usage:**php
```
add_filter('fluent_cart/subscription/view', function($subscription, $context) {
 // Add external gateway link
 $subscription['external_url'] = 'https://dashboard.stripe.com/subscriptions/' . $subscription['vendor_subscription_id'];
 return $subscription;
}, 10, 2);```

### ` subscription/url_{$payment_method} ` [](#subscription-url-payment-method)
`fluent_cart/subscription/url_{$payment_method}` — Filter vendor dashboard URL for a subscription (dynamic)
**When it runs:** This filter is applied when generating the external vendor dashboard URL for a subscription. The hook name is dynamic, with `{$payment_method}` replaced by the subscription's current payment method (e.g., `stripe`, `paypal`).
**Parameters:**

- `$url` (string): The vendor dashboard URL (default: `''`)
- `$context` (array): Context dataphp
```
$context = [
 'vendor_subscription_id' => 'sub_1234567890',
 'payment_mode' => 'live', // or 'test'
 'subscription' => $subscription // Subscription model
];```

**Returns:**

- `$url` (string): The modified vendor dashboard URL

**Source:** `app/Models/Subscription.php:158`
**Usage:**php
```
// Provide the Stripe dashboard URL for subscriptions
add_filter('fluent_cart/subscription/url_stripe', function($url, $context) {
 $subId = $context['vendor_subscription_id'];
 $mode = $context['payment_mode'];
 $base = ($mode === 'test')
 ? 'https://dashboard.stripe.com/test'
 : 'https://dashboard.stripe.com';
 return $base . '/subscriptions/' . $subId;
}, 10, 2);```

### ` subscription/can_reactivate ` [](#subscription-can-reactivate)
`fluent_cart/subscription/can_reactivate` — Filter whether a subscription can be reactivated
**When it runs:** This filter is applied when checking if a canceled, failing, expired, paused, expiring, or past-due subscription is eligible for reactivation.
**Parameters:**

- `$canReactivate` (bool): Whether the subscription can be reactivated (based on its current status)
- `$context` (array): Context dataphp
```
$context = [
 'subscription' => $subscription // Subscription model
];```

**Returns:**

- `$canReactivate` (bool): The modified reactivation eligibility

**Source:** `app/Models/Subscription.php:427`
**Usage:**php
```
add_filter('fluent_cart/subscription/can_reactivate', function($canReactivate, $context) {
 $subscription = $context['subscription'];

 // Prevent reactivation if canceled more than 90 days ago
 if ($subscription->status === 'canceled') {
 $canceledAt = strtotime($subscription->updated_at);
 if ((time() - $canceledAt) > (90 * DAY_IN_SECONDS)) {
 return false;
 }
 }
 return $canReactivate;
}, 10, 2);```

### ` available_subscription_interval_options ` [](#available-subscription-interval-options)
`fluent_cart/available_subscription_interval_options` — Filter subscription interval options
**When it runs:** This filter is applied when retrieving the list of available subscription billing interval options for product configuration.
**Parameters:**

- `$intervals` (array): Array of interval option objectsphp
```
$intervals = [
 ['label' => 'Yearly', 'value' => 'yearly', 'map_value' => 'year'],
 ['label' => 'Half Yearly', 'value' => 'half_yearly', 'map_value' => 'half_year'],
 ['label' => 'Quarterly', 'value' => 'quarterly', 'map_value' => 'quarter'],
 ['label' => 'Monthly', 'value' => 'monthly', 'map_value' => 'month'],
 ['label' => 'Weekly', 'value' => 'weekly', 'map_value' => 'week'],
 ['label' => 'Daily', 'value' => 'daily', 'map_value' => 'day']
];```

**Returns:**

- `$intervals` (array): The modified intervals array

**Source:** `app/Helpers/Helper.php:1531`
**Usage:**php
```
add_filter('fluent_cart/available_subscription_interval_options', function($intervals) {
 // Add a custom "Every 10 days" interval
 $intervals[] = [
 'label' => __('Every 10th Day', 'my-plugin'),
 'value' => 'every_tenth_day',
 'map_value' => '10th Day'
 ];
 return $intervals;
});```

TIP
When adding custom intervals, you must also implement the `fluent_cart/subscription_interval_in_days` and `fluent_cart/subscription_billing_period` filters so the system knows how to calculate dates and communicate with payment gateways.
### ` subscription_interval_in_days ` [](#subscription-interval-in-days)
`fluent_cart/subscription_interval_in_days` — Filter the number of days for a custom subscription interval
**When it runs:** This filter is applied when converting a subscription interval to its day count. For built-in intervals (yearly, half_yearly, quarterly, monthly, weekly, daily), the value is calculated automatically. This filter fires for custom/unknown intervals with a default of `0`.
**Parameters:**

- `$days` (int): Number of days for the interval (default: `0` for custom intervals)
- `$context` (array): Context dataphp
```
$context = [
 'interval' => 'every_tenth_day' // The interval key
];```

**Returns:**

- `$days` (int): The number of days in this interval

**Source:** `app/Helpers/Helper.php:1592`, `app/Services/Payments/PaymentHelper.php:236`
**Usage:**php
```
add_filter('fluent_cart/subscription_interval_in_days', function($days, $args) {
 $interval = $args['interval'];

 if ($interval === 'every_tenth_day') {
 return 10;
 }

 if ($interval === 'biweekly') {
 return 14;
 }

 return $days;
}, 10, 2);```

### ` max_trial_days_allowed ` [](#max-trial-days-allowed)
`fluent_cart/max_trial_days_allowed` — Filter maximum trial days allowed
**When it runs:** This filter is applied when calculating adjusted trial days for a subscription interval. The system ensures the trial period does not exceed this maximum.
**Parameters:**

- `$maxDays` (int): Maximum trial days allowed (default: `365`)
- `$context` (array): Context dataphp
```
$context = [
 'existing_trial_days' => 14,
 'repeat_interval' => 'monthly',
 'interval_in_days' => 30
];```

**Returns:**

- `$maxDays` (int): The modified maximum trial days

**Source:** `app/Helpers/Helper.php:1566`
**Usage:**php
```
add_filter('fluent_cart/max_trial_days_allowed', function($maxDays, $args) {
 // Cap trials at 30 days for monthly subscriptions
 if ($args['repeat_interval'] === 'monthly') {
 return 30;
 }
 return $maxDays;
}, 10, 2);```

### ` trial_info ` [](#trial-info)
`fluent_cart/trial_info` — Filter trial info display text
**When it runs:** This filter is applied when generating the human-readable trial information text shown to customers (e.g., "Free Trial: 14 days").
**Parameters:**

- `$trialInfo` (string): The generated trial info text (e.g., `'Free Trial: 14 days'` or `''` if no trial)
- `$otherInfo` (array): The product/variant pricing metadataphp
```
$otherInfo = [
 'trial_days' => 14,
 'is_trial_days_simulated' => 'no',
 'signup_fee' => 0,
 'manage_setup_fee' => 'no',
 // ... other pricing info
];```

**Returns:**

- `$trialInfo` (string): The modified trial info text

**Source:** `app/Helpers/Helper.php:1133`
**Usage:**php
```
add_filter('fluent_cart/trial_info', function($trialInfo, $otherInfo) {
 $days = $otherInfo['trial_days'] ?? 0;
 if ($days > 0) {
 return sprintf('Try free for %d days - no credit card required!', $days);
 }
 return $trialInfo;
}, 10, 2);```

## Subscription Billing [](#subscription-billing)

### ` subscription_billing_period ` [](#subscription-billing-period)
`fluent_cart/subscription_billing_period` — Filter billing period for payment gateways
**When it runs:** This filter is applied when translating a FluentCart subscription interval into the payment gateway's billing period format (used by Stripe Plans and PayPal billing cycles).
**Parameters:**

- `$billingPeriod` (array): The billing period for the gatewayphp
```
$billingPeriod = [
 'interval_unit' => 'month', // day, week, month, year
 'interval_frequency' => 1 // e.g., 3 for quarterly
];```

- `$context` (array): Context dataphp
```
$context = [
 'subscription_interval' => 'quarterly', // Original FluentCart interval
 'payment_method' => 'stripe' // or 'paypal'
];```

**Returns:**

- `$billingPeriod` (array): The modified billing period

**Source:** `app/Modules/PaymentMethods/StripeGateway/Plan.php:58`, `app/Modules/PaymentMethods/PayPalGateway/PayPalHelper.php:243`
**Usage:**php
```
add_filter('fluent_cart/subscription_billing_period', function($billingPeriod, $args) {
 $interval = $args['subscription_interval'];
 $method = $args['payment_method'];

 if ($interval === 'every_tenth_day') {
 if ($method === 'stripe') {
 return [
 'interval_unit' => 'day',
 'interval_frequency' => 10
 ];
 }
 if ($method === 'paypal') {
 return [
 'interval_unit' => 'DAY',
 'interval_frequency' => 10
 ];
 }
 }

 return $billingPeriod;
}, 10, 2);```

### ` subscription/grace_period_days ` [](#subscription-grace-period-days)
`fluent_cart/subscription/grace_period_days` — Filter grace period days per billing interval
**When it runs:** This filter is applied when retrieving the grace period (number of extra days after a payment fails before the subscription is marked as expired) for each billing interval.
**Parameters:**

- `$gracePeriods` (array): Associative array of interval => daysphp
```
$gracePeriods = [
 'daily' => 1,
 'weekly' => 3,
 'monthly' => 7,
 'quarterly' => 15,
 'half_yearly' => 15,
 'yearly' => 15
];```

**Returns:**

- `$gracePeriods` (array): The modified grace period days

**Source:** `app/Services/Payments/SubscriptionHelper.php:159`
**Usage:**php
```
add_filter('fluent_cart/subscription/grace_period_days', function($gracePeriods) {
 // Give yearly subscribers more time
 $gracePeriods['yearly'] = 30;

 // Add grace period for custom interval
 $gracePeriods['every_tenth_day'] = 5;

 return $gracePeriods;
});```

## Reminders [](#reminders)

### ` reminders/scan_batch_size ` [](#reminders-scan-batch-size)
`fluent_cart/reminders/scan_batch_size` — Filter reminder scan batch size
**When it runs:** This filter is applied when the automated reminder system scans for subscriptions or invoices that need reminders. Controls how many records are processed per batch.
**Parameters:**

- `$batchSize` (int): Number of records per scan batch (default: `100`, min: `10`, max: `500`)

**Returns:**

- `$batchSize` (int): The modified batch size

**Source:** `app/Services/Reminders/ReminderService.php:75`
**Usage:**php
```
add_filter('fluent_cart/reminders/scan_batch_size', function($batchSize) {
 // Process more records per batch on high-traffic sites
 return 250;
});```

### ` reminders/invoice_due_days ` [](#reminders-invoice-due-days)
`fluent_cart/reminders/invoice_due_days` — Filter invoice due reminder days
**When it runs:** This filter is applied when determining how many days before an invoice is due to send a reminder. The value comes from store settings but can be overridden.
**Parameters:**

- `$days` (int): Number of days before due date to send reminder (from store settings, min: `0`)

**Returns:**

- `$days` (int): The modified number of days

**Source:** `app/Services/Reminders/InvoiceReminderService.php:288`
**Usage:**php
```
add_filter('fluent_cart/reminders/invoice_due_days', function($days) {
 // Always remind 3 days before invoice is due
 return 3;
});```

### ` reminders/invoice_overdue_days ` [](#reminders-invoice-overdue-days)
`fluent_cart/reminders/invoice_overdue_days` — Filter overdue invoice reminder intervals
**When it runs:** This filter is applied when determining at which day intervals after an invoice becomes overdue to send follow-up reminders.
**Parameters:**

- `$days` (array): Array of day intervals for overdue reminders (default from settings: `[1, 3, 7]`)

**Returns:**

- `$days` (array): The modified array of overdue reminder day intervals

**Source:** `app/Services/Reminders/InvoiceReminderService.php:299`
**Usage:**php
```
add_filter('fluent_cart/reminders/invoice_overdue_days', function($days) {
 // Send overdue reminders at 1, 3, 7, and 14 days past due
 return [1, 3, 7, 14];
});```

### ` reminders/billing_cycle ` [](#reminders-billing-cycle)
`fluent_cart/reminders/billing_cycle` — Filter billing cycle name for reminder processing
**When it runs:** This filter is applied when mapping a subscription's billing interval to a billing cycle identifier used by the reminder system. Returns `'unsupported'` for unknown intervals by default.
**Parameters:**

- `$cycle` (string): The billing cycle name (e.g., `'monthly'`, `'yearly'`, `'unsupported'`)
- `$subscription` ([Subscription](https://dev.fluentcart.com/database/models/subscription.html)): The Subscription model instance

**Returns:**

- `$cycle` (string): The modified billing cycle name

**Source:** `app/Services/Reminders/SubscriptionReminderService.php:502`
**Usage:**php
```
add_filter('fluent_cart/reminders/billing_cycle', function($cycle, $subscription) {
 // Map custom intervals to supported reminder cycles
 if ($subscription->billing_interval === 'every_tenth_day') {
 return 'daily'; // Use daily reminder logic
 }
 return $cycle;
}, 10, 2);```

### ` reminders/yearly_before_days ` [](#reminders-yearly-before-days)
`fluent_cart/reminders/yearly_before_days` — Filter days before yearly renewal reminder
**When it runs:** This filter is applied when determining at which day intervals before a yearly subscription renewal to send reminders.
**Parameters:**

- `$days` (array): Array of day intervals before renewal (default from settings: `[30]`, range: 7-90)

**Returns:**

- `$days` (array): The modified array of reminder day intervals

**Source:** `app/Services/Reminders/SubscriptionReminderService.php:534`
**Usage:**php
```
add_filter('fluent_cart/reminders/yearly_before_days', function($days) {
 // Remind at 60, 30, and 7 days before yearly renewal
 return [60, 30, 7];
});```

### ` reminders/monthly_before_days ` [](#reminders-monthly-before-days)
`fluent_cart/reminders/monthly_before_days` — Filter days before monthly renewal reminder
**When it runs:** This filter is applied when determining at which day intervals before a monthly subscription renewal to send reminders.
**Parameters:**

- `$days` (array): Array of day intervals before renewal (default from settings: `[7]`, range: 3-28)

**Returns:**

- `$days` (array): The modified array of reminder day intervals

**Source:** `app/Services/Reminders/SubscriptionReminderService.php:546`
**Usage:**php
```
add_filter('fluent_cart/reminders/monthly_before_days', function($days) {
 // Remind at 7 and 3 days before monthly renewal
 return [7, 3];
});```

### ` reminders/quarterly_before_days ` [](#reminders-quarterly-before-days)
`fluent_cart/reminders/quarterly_before_days` — Filter days before quarterly renewal reminder
**When it runs:** This filter is applied when determining at which day intervals before a quarterly subscription renewal to send reminders.
**Parameters:**

- `$days` (array): Array of day intervals before renewal (default from settings: `[14]`, range: 7-60)

**Returns:**

- `$days` (array): The modified array of reminder day intervals

**Source:** `app/Services/Reminders/SubscriptionReminderService.php:558`
**Usage:**php
```
add_filter('fluent_cart/reminders/quarterly_before_days', function($days) {
 // Remind at 21 and 7 days before quarterly renewal
 return [21, 7];
});```

### ` reminders/half_yearly_before_days ` [](#reminders-half-yearly-before-days)
`fluent_cart/reminders/half_yearly_before_days` — Filter days before half-yearly renewal reminder
**When it runs:** This filter is applied when determining at which day intervals before a half-yearly subscription renewal to send reminders.
**Parameters:**

- `$days` (array): Array of day intervals before renewal (default from settings: `[21]`, range: 7-60)

**Returns:**

- `$days` (array): The modified array of reminder day intervals

**Source:** `app/Services/Reminders/SubscriptionReminderService.php:570`
**Usage:**php
```
add_filter('fluent_cart/reminders/half_yearly_before_days', function($days) {
 // Remind at 30 and 7 days before half-yearly renewal
 return [30, 7];
});```

### ` reminders/trial_end_days ` [](#reminders-trial-end-days)
`fluent_cart/reminders/trial_end_days` — Filter days before trial end reminder
**When it runs:** This filter is applied when determining at which day intervals before a trial period ends to send reminders to the customer.
**Parameters:**

- `$days` (array): Array of day intervals before trial ends (default from settings: `[3]`, range: 1-14)

**Returns:**

- `$days` (array): The modified array of reminder day intervals

**Source:** `app/Services/Reminders/SubscriptionReminderService.php:582`
**Usage:**php
```
add_filter('fluent_cart/reminders/trial_end_days', function($days) {
 // Remind at 7, 3, and 1 day before trial ends
 return [7, 3, 1];
});```

## Pro: Early Payments & Reactivation [](#pro-early-payments-reactivation)

### ` subscription/early_payment_enabled ` [](#subscription-early-payment-enabled)
`fluent_cart/subscription/early_payment_enabled` Pro — Filter whether early installment payments are enabled
**When it runs:** This filter is applied when checking if the early payment feature for installment subscriptions is globally enabled. Requires FluentCart Pro to be active.
**Parameters:**

- `$isEnabled` (bool): Whether early payments are enabled (from store settings `enable_early_payment_for_installment`)

**Returns:**

- `$isEnabled` (bool): The modified enabled state

**Source:** `app/Modules/Subscriptions/Services/EarlyPaymentFeature.php:14`
**Usage:**php
```
add_filter('fluent_cart/subscription/early_payment_enabled', function($isEnabled) {
 // Disable early payments during a specific promotion period
 if (current_time('Y-m') === '2026-12') {
 return false;
 }
 return $isEnabled;
});```

### ` subscription/can_early_pay ` [](#subscription-can-early-pay)
`fluent_cart/subscription/can_early_pay` Pro — Filter whether a specific subscription can make an early payment
**When it runs:** This filter is applied when checking if a specific installment subscription is eligible for early payment. The default check requires that early payments are globally enabled, the subscription has a finite bill count, there are remaining installments, and the subscription status is `active` or `trialing`.
**Parameters:**

- `$canPay` (bool): Whether the subscription can make an early payment
- `$context` (array): Context dataphp
```
$context = [
 'subscription' => $subscription // Subscription model
];```

**Returns:**

- `$canPay` (bool): The modified eligibility

**Source:** `app/Modules/Subscriptions/Services/EarlyPaymentFeature.php:26`
**Usage:**php
```
add_filter('fluent_cart/subscription/can_early_pay', function($canPay, $context) {
 $subscription = $context['subscription'];

 // Only allow early payments for subscriptions with more than 2 remaining installments
 $remaining = $subscription->bill_times - $subscription->bill_count;
 if ($remaining <= 2) {
 return false;
 }

 return $canPay;
}, 10, 2);```

### ` subscription/reactivation_same_price_days_limit ` [](#subscription-reactivation-same-price-days-limit)
`fluent_cart/subscription/reactivation_same_price_days_limit` Pro — Filter days limit for same-price reactivation
**When it runs:** This filter is applied when a customer reactivates a canceled or expired subscription. If the subscription was canceled within this many days, the customer can reactivate at the original price without going through a new checkout.
**Parameters:**

- `$daysLimit` (int): Number of days within which same-price reactivation is allowed (default: `60`)
- `$context` (array): Context dataphp
```
$context = [
 'subscription' => $subscription // Subscription model
];```

**Returns:**

- `$daysLimit` (int): The modified days limit

**Source:** `fluent-cart-pro/.../SubscriptionRenewalHandler.php:234`
**Usage:**php
```
add_filter('fluent_cart/subscription/reactivation_same_price_days_limit', function($daysLimit, $context) {
 $subscription = $context['subscription'];

 // Give yearly subscribers a longer reactivation window
 if ($subscription->billing_interval === 'yearly') {
 return 180; // 6 months
 }

 return $daysLimit;
}, 10, 2);```

## Pro: License Customer Portal [](#pro-license-customer-portal)

### ` customer/license_details_section_parts ` [](#customer-license-details-section-parts)
`fluent_cart/customer/license_details_section_parts` Pro — Filter license details section parts in customer portal
**When it runs:** This filter is applied when rendering a license details page in the customer portal, allowing you to inject custom HTML into specific sections of the license view.
**Parameters:**

- `$sectionParts` (array): Associative array of injectable HTML sectionsphp
```
$sectionParts = [
 'before_summary' => '',
 'after_summary' => '',
 'end_of_details' => '',
 'additional_actions' => ''
];```

- `$context` (array): Context dataphp
```
$context = [
 'license' => $license, // License model
 'formattedData' => $formattedData // Formatted license data for display
];```

**Returns:**

- `$sectionParts` (array): The modified section parts

**Source:** `fluent-cart-pro/.../CustomerProfileController.php:97`
**Usage:**php
```
add_filter('fluent_cart/customer/license_details_section_parts', function($parts, $context) {
 $license = $context['license'];

 // Add activation instructions after the summary
 $parts['after_summary'] = '<div class="activation-guide">'
 . '<h4>How to Activate</h4>'
 . '<p>Copy your license key and paste it in your plugin settings.</p>'
 . '</div>';

 // Add a custom action button
 $parts['additional_actions'] = '<button class="btn-regenerate" onclick="regenerateLicense(\'' . $license->id . '\')">Regenerate Key</button>';

 return $parts;
}, 10, 2);```

---

## Integrations & Advanced

Source: https://dev.fluentcart.com/hooks/filters/integrations-and-advanced.html


All filters related to external integrations, file storage, templates, [License](https://dev.fluentcart.com/database/models/license.html) management, and advanced features.
## Integration Actions & Feeds [](#integration-actions-feeds)

### ` order_integrations ` [](#order-integrations)
`fluent_cart/integration/order_integrations` — Filter all registered order integrations
**When it runs:** This filter is applied when retrieving the list of all registered order integrations. It is used across integration event handling, integration controllers, product integration setup, global settings, and addon modules.
**Parameters:**

- `$integrations` (array): Array of registered integrations (default `[]`)php
```
$integrations = [
 'mailchimp' => [
 'title' => 'MailChimp',
 'logo' => 'https://example.com/mailchimp-logo.png',
 'enabled' => true
 ]
];```

**Returns:**

- `$integrations` (array): The modified integrations array

**Source:** `IntegrationEventListener.php:54,247,386`, `IntegrationController.php:96,150`, `ProductIntegrationsController.php:18,48`, `GlobalIntegrationSettings.php:84`, `AddOnModule.php:16`
**Usage:**php
```
add_filter('fluent_cart/integration/order_integrations', function ($integrations) {
 $integrations['custom_crm'] = [
 'title' => 'Custom CRM',
 'logo' => 'https://example.com/crm-logo.png',
 'enabled' => true,
 ];
 return $integrations;
});```

### ` run_all_actions_on_async ` [](#run-all-actions-on-async)
`fluent_cart/integration/run_all_actions_on_async` — Force all integration actions to run asynchronously
**When it runs:** This filter controls whether integration actions should be dispatched asynchronously instead of running immediately during order processing.
**Parameters:**

- `$async` (bool): Whether to force async execution (default `false`)
- `$order` ([Order](https://dev.fluentcart.com/database/models/order.html)): The order model
- `$hook` (string): The integration hook being fired

**Returns:**

- `$async` (bool): Whether to run actions asynchronously

**Source:** `IntegrationEventListener.php:145`
**Usage:**php
```
add_filter('fluent_cart/integration/run_all_actions_on_async', function ($async, $order, $hook) {
 // Force async for large orders to avoid timeout
 if ($order->total > 100000) {
 return true;
 }
 return $async;
}, 10, 3);```

### ` global_notification_types ` [](#global-notification-types)
`fluent_cart/integration/global_notification_types` — Filter available notification types
**When it runs:** This filter is applied when retrieving the list of available global notification types for integrations.
**Parameters:**

- `$types` (array): Array of notification types (default `[]`)php
```
$types = [
 'email' => [
 'title' => 'Email Notification',
 'description' => 'Send email notifications'
 ]
];```

**Returns:**

- `$types` (array): The modified notification types array

**Source:** `GlobalIntegrationSettings.php:119`
**Usage:**php
```
add_filter('fluent_cart/integration/global_notification_types', function ($types) {
 $types['sms'] = [
 'title' => 'SMS Notification',
 'description' => 'Send SMS notifications on order events',
 ];
 return $types;
});```

### ` global_notification_feed_{$feed_key} ` [](#global-notification-feed-feed-key)
`fluent_cart/integration/global_notification_feed_{$feed_key}` — Filter notification feed data (DYNAMIC)
**When it runs:** This dynamic filter is applied when retrieving notification feed data for a specific feed key. The `{$feed_key}` portion is replaced with the actual feed identifier.
**Parameters:**

- `$feedData` (array): The notification feed data

**Returns:**

- `$feedData` (array): The modified feed data

**Source:** `GlobalIntegrationSettings.php:151`
**Usage:**php
```
add_filter('fluent_cart/integration/global_notification_feed_email_alerts', function ($feedData) {
 // Modify email alert feed data
 $feedData['recipients'][] = '[[email protected]](https://dev.fluentcart.com/cdn-cgi/l/email-protection)';
 return $feedData;
});```

### ` get_global_integration_actions ` [](#get-global-integration-actions)
`fluent_cart/integration/get_global_integration_actions` — Filter global integration actions
**When it runs:** This filter is applied when retrieving available global integration actions that can be triggered by order events.
**Parameters:**

- `$actions` (array): Array of integration actions (default `[]`)php
```
$actions = [
 'mailchimp_subscribe' => [
 'title' => 'Subscribe to MailChimp',
 'enabled' => true
 ]
];```

**Returns:**

- `$actions` (array): The modified integration actions array

**Source:** `GlobalIntegrationActionHandler.php:22`
**Usage:**php
```
add_filter('fluent_cart/integration/get_global_integration_actions', function ($actions) {
 $actions['custom_webhook'] = [
 'title' => 'Fire Custom Webhook',
 'enabled' => true,
 ];
 return $actions;
});```

### ` notifying_async_{$feedKey} ` [](#notifying-async-feedkey)
`fluent_cart/integration/notifying_async_{$feedKey}` — Control async notification per feed (DYNAMIC)
**When it runs:** This dynamic filter controls whether a specific notification feed should be dispatched asynchronously. The `{$feedKey}` is replaced with the actual feed key.
**Parameters:**

- `$async` (bool): Whether to process this notification asynchronously (default `true`)

**Returns:**

- `$async` (bool): Whether to use async processing

**Source:** `GlobalNotificationHandler.php:104`
**Usage:**php
```
add_filter('fluent_cart/integration/notifying_async_email_alerts', function ($async) {
 // Force synchronous for email alerts
 return false;
});```

### ` webhook/payload ` [](#webhook-payload)
`fluent_cart/webhook/payload` Pro — Filter webhook payload before sending
**When it runs:** This filter is applied to the webhook payload body after it is constructed but before it is encoded and sent to the external endpoint. Allows complete customization of webhook data.
**Parameters:**

- `$payloadBody` (array): The payload body data
- `$context` (array): Context dataphp
```
$context = [
 'order' => $orderModel, // The order model
 'feed' => $feedConfig, // The webhook feed configuration
 'event_data' => $eventData // The original event data
];```

**Returns:**

- `$payloadBody` (array): The modified payload body

**Source:** `fluent-cart-pro/.../WebhookConnect.php:251`
**Usage:**php
```
add_filter('fluent_cart/webhook/payload', function ($payloadBody, $context) {
 // Add custom field to payload
 $payloadBody['custom_meta'] = [
 'source' => 'fluentcart',
 'timestamp' => gmdate('Y-m-d H:i:s')
 ];

 // Remove sensitive data
 unset($payloadBody['customer']['email']);

 return $payloadBody;
}, 10, 2);```

## Integration Settings & Configuration [](#integration-settings-configuration)

### ` global_integration_settings_{$key} ` [](#global-integration-settings-key)
`fluent_cart/integration/global_integration_settings_{$key}` — Filter integration settings (DYNAMIC)
**When it runs:** This dynamic filter is applied when retrieving settings for a specific integration. The `{$key}` is replaced with the integration key (e.g., `mailchimp`, `zapier`).
**Parameters:**

- `$settings` (array): The integration settings (default `[]`)

**Returns:**

- `$settings` (array): The modified settings array

**Source:** `GlobalIntegrationSettings.php:24`
**Usage:**php
```
add_filter('fluent_cart/integration/global_integration_settings_mailchimp', function ($settings) {
 // Override MailChimp API key from environment
 $settings['api_key'] = defined('MAILCHIMP_API_KEY') ? MAILCHIMP_API_KEY : $settings['api_key'];
 return $settings;
});```

### ` global_integration_fields_{$key} ` [](#global-integration-fields-key)
`fluent_cart/integration/global_integration_fields_{$key}` — Filter integration field definitions (DYNAMIC)
**When it runs:** This dynamic filter is applied when retrieving field definitions for a specific integration configuration form. The `{$key}` is replaced with the integration key.
**Parameters:**

- `$fields` (array): The field definitions (default `[]`)

**Returns:**

- `$fields` (array): The modified field definitions

**Source:** `GlobalIntegrationSettings.php:25`
**Usage:**php
```
add_filter('fluent_cart/integration/global_integration_fields_mailchimp', function ($fields) {
 $fields[] = [
 'key' => 'double_optin',
 'label' => 'Enable Double Opt-in',
 'type' => 'checkbox',
 ];
 return $fields;
});```

### ` get_integration_defaults_{$name} ` [](#get-integration-defaults-name)
`fluent_cart/integration/get_integration_defaults_{$name}` — Filter integration defaults (DYNAMIC)
**When it runs:** This dynamic filter is applied when retrieving default settings for a specific integration. The `{$name}` is replaced with the integration name.
**Parameters:**

- `$defaults` (array): The default settings values

**Returns:**

- `$defaults` (array): The modified defaults

**Source:** `GlobalIntegrationSettings.php:199,201`
**Usage:**php
```
add_filter('fluent_cart/integration/get_integration_defaults_mailchimp', function ($defaults) {
 $defaults['list_id'] = 'default_list_123';
 $defaults['tags'] = ['fluentcart-customer'];
 return $defaults;
});```

### ` get_integration_settings_fields_{$name} ` [](#get-integration-settings-fields-name)
`fluent_cart/integration/get_integration_settings_fields_{$name}` — Filter integration settings fields (DYNAMIC)
**When it runs:** This dynamic filter is applied when retrieving the settings field definitions for a specific integration. The `{$name}` is replaced with the integration name.
**Parameters:**

- `$fields` (array): The field definitions (default `[]`)

**Returns:**

- `$fields` (array): The modified field definitions

**Source:** `GlobalIntegrationSettings.php:204,276`, `IntegrationHelper.php:27`
**Usage:**php
```
add_filter('fluent_cart/integration/get_integration_settings_fields_zapier', function ($fields) {
 $fields[] = [
 'key' => 'webhook_url',
 'label' => 'Webhook URL',
 'type' => 'url',
 'required' => true,
 'placeholder' => 'https://hooks.zapier.com/...',
 ];
 return $fields;
});```

### ` save_integration_values_{$name} ` [](#save-integration-values-name)
`fluent_cart/integration/save_integration_values_{$name}` — Filter before saving integration data (DYNAMIC)
**When it runs:** This dynamic filter is applied just before integration settings are saved to the database. The `{$name}` is replaced with the integration name.
**Parameters:**

- `$integration` (Meta): The Meta model instance containing the integration data

**Returns:**

- `$integration` (Meta): The modified Meta model

**Source:** `GlobalIntegrationSettings.php:248`
**Usage:**php
```
add_filter('fluent_cart/integration/save_integration_values_mailchimp', function ($integration) {
 // Encrypt API key before saving
 $value = $integration->value;
 if (!empty($value['api_key'])) {
 $value['api_key_encrypted'] = encrypt($value['api_key']);
 }
 $integration->value = $value;
 return $integration;
});```

### ` get_integration_merge_fields_{$name} ` [](#get-integration-merge-fields-name)
`fluent_cart/integration/get_integration_merge_fields_{$name}` — Filter integration merge/mapping fields (DYNAMIC)
**When it runs:** This dynamic filter is applied when retrieving merge fields for a specific integration. These fields are used for mapping FluentCart data to external service fields.
**Parameters:**

- `$list` (array): The merge fields list
- `$listId` (string): The list or audience ID

**Returns:**

- `$list` (array): The modified merge fields

**Source:** `GlobalIntegrationSettings.php:369`
**Usage:**php
```
add_filter('fluent_cart/integration/get_integration_merge_fields_mailchimp', function ($list, $listId) {
 $list[] = [
 'key' => 'COMPANY',
 'label' => 'Company Name',
 'type' => 'text',
 ];
 return $list;
}, 10, 2);```

### ` integration_options_{$key} ` [](#integration-options-key)
`fluent_cart/integration/integration_options_{$key}` — Filter dynamic integration options (DYNAMIC)
**When it runs:** This dynamic filter is applied when retrieving option values for an integration dropdown or selection field. The `{$key}` is replaced with the option key.
**Parameters:**

- `$options` (array): The options array (default `[]`)

**Returns:**

- `$options` (array): The modified options

**Source:** `IntegrationController.php:302`
**Usage:**php
```
add_filter('fluent_cart/integration/integration_options_mailchimp_lists', function ($options) {
 // Add a custom list option
 $options[] = [
 'id' => 'custom_list',
 'title' => 'Custom Audience',
 ];
 return $options;
});```

### ` integration_saving_data_{$provider} ` [](#integration-saving-data-provider)
`fluent_cart/integration/integration_saving_data_{$provider}` — Filter integration data before validation (DYNAMIC)
**When it runs:** This dynamic filter is applied to integration data before it undergoes validation when saving. The `{$provider}` is replaced with the provider key.
**Parameters:**

- `$validatedData` (array): The validated integration data

**Returns:**

- `$validatedData` (array): The modified data

**Source:** `IntegrationHelper.php:62`
**Usage:**php
```
add_filter('fluent_cart/integration/integration_saving_data_mailchimp', function ($validatedData) {
 // Normalize tags before saving
 if (!empty($validatedData['tags'])) {
 $validatedData['tags'] = array_map('strtolower', $validatedData['tags']);
 }
 return $validatedData;
});```

### ` editing_integration_{$key} ` [](#editing-integration-key)
`fluent_cart/integration/editing_integration_{$key}` — Filter integration data when editing (DYNAMIC)
**When it runs:** This dynamic filter is applied when an integration is being loaded for editing in the admin UI.
**Parameters:**

- `$data` (array): The integration data for editing
- `$args` (array): Additional context arguments

**Returns:**

- `$data` (array): The modified integration data

**Source:** `IntegrationHelper.php:80`
**Usage:**php
```
add_filter('fluent_cart/integration/editing_integration_mailchimp', function ($data, $args) {
 // Decrypt API key for display
 if (!empty($data['api_key_encrypted'])) {
 $data['api_key'] = decrypt($data['api_key_encrypted']);
 }
 return $data;
}, 10, 2);```

## Integration Addons [](#integration-addons)

### ` addons ` [](#addons)
`fluent_cart/integration/addons` — Filter the integration addons list
**When it runs:** This filter is applied when retrieving the list of available integration addons in the admin interface.
**Parameters:**

- `$addons` (array): Array of addon definitions

**Returns:**

- `$addons` (array): The modified addons array

**Source:** `AddonsController.php:87`
**Usage:**php
```
add_filter('fluent_cart/integration/addons', function ($addons) {
 $addons['my_addon'] = [
 'title' => 'My Custom Addon',
 'description' => 'Adds custom integration functionality',
 'logo' => 'https://example.com/addon-logo.png',
 'enabled' => true,
 ];
 return $addons;
});```

### ` installable_repo_plugins ` [](#installable-repo-plugins)
`fluent_cart/installable_repo_plugins` — Filter installable plugin recommendations
**When it runs:** This filter is applied when retrieving the list of recommended plugins that can be installed from within the FluentCart admin.
**Parameters:**

- `$plugins` (array): Array of installable plugin definitions

**Returns:**

- `$plugins` (array): The modified plugins array

**Source:** `AddonsController.php:121`, `GlobalIntegrationSettings.php:396`
**Usage:**php
```
add_filter('fluent_cart/installable_repo_plugins', function ($plugins) {
 $plugins[] = [
 'title' => 'FluentCRM',
 'slug' => 'fluent-crm',
 'description' => 'Email marketing automation',
 'url' => 'https://wordpress.org/plugins/fluent-crm/',
 ];
 return $plugins;
});```

## File Storage & Downloads [](#file-storage-downloads)

### ` local_file_blocked_extensions ` [](#local-file-blocked-extensions)
`fluent_cart/local_file_blocked_extensions` — Filter blocked file extensions for local storage
**When it runs:** This filter is applied when validating a file upload to local storage, allowing you to modify the list of blocked file extensions.
**Parameters:**

- `$blockedExts` (array): Array of blocked file extensions
- `$localFilePath` (string): Local file path
- `$uploadToFilePath` (string): Target upload path
- `$fileInfo` (array): File information array
- Additional context parameters

**Returns:**

- `$blockedExts` (array): The modified blocked extensions array

**Source:** `LocalDriver.php:129`
**Usage:**php
```
add_filter('fluent_cart/local_file_blocked_extensions', function ($blockedExts, $localFilePath, $uploadToFilePath, $fileInfo) {
 // Block additional extensions
 $blockedExts[] = 'svg';
 $blockedExts[] = 'webp';
 return $blockedExts;
}, 10, 4);```

### ` download_expiration_minutes ` [](#download-expiration-minutes)
`fluent_cart/download_expiration_minutes` — Filter S3 download link expiration time
**When it runs:** This filter controls how long a pre-signed S3 download URL remains valid.
**Parameters:**

- `$expirationMinutes` (int): Expiration time in minutes
- `$context` (array): Context dataphp
```
$context = [
 'file_path' => 'products/my-file.zip',
 'bucket' => 'my-bucket',
 'driver' => 's3'
];```

**Returns:**

- `$expirationMinutes` (int): The modified expiration time in minutes

**Source:** `S3Driver.php:237,252`
**Usage:**php
```
add_filter('fluent_cart/download_expiration_minutes', function ($expirationMinutes, $context) {
 // Extend expiration for large files
 if (str_ends_with($context['file_path'], '.zip')) {
 return 120; // 2 hours
 }
 return $expirationMinutes;
}, 10, 2);```

### ` download_link_validity_in_minutes ` [](#download-link-validity-in-minutes)
`fluent_cart/download_link_validity_in_minutes` — Filter download link validity duration
**When it runs:** This filter controls how long a download link remains valid for customer-facing downloads.
**Parameters:**

- `$minutes` (int): Link validity in minutes (default `60`)
- `$context` (array): Context dataphp
```
$context = [
 'product_download' => $downloadModel,
 'order_id' => 123,
 'is_admin' => false
];```

**Returns:**

- `$minutes` (int): The modified validity in minutes

**Source:** `Helper.php:1430`
**Usage:**php
```
add_filter('fluent_cart/download_link_validity_in_minutes', function ($minutes, $context) {
 // Give admins longer download windows
 if ($context['is_admin']) {
 return 1440; // 24 hours
 }
 return $minutes;
}, 10, 2);```

### ` product_download/can_be_downloaded ` [](#product-download-can-be-downloaded)
`fluent_cart/product_download/can_be_downloaded` — Filter whether a file can be downloaded
**When it runs:** This filter is applied during download validation to determine if a customer is allowed to download a specific file.
**Parameters:**

- `$canDownload` (bool|WP_Error): Whether the file can be downloaded, or a WP_Error with rejection reason

**Returns:**

- `$canDownload` (bool|WP_Error): The modified download permission

**Source:** `FileDownloader.php:95`
**Usage:**php
```
add_filter('fluent_cart/product_download/can_be_downloaded', function ($canDownload) {
 // Block downloads during maintenance
 if (get_option('fluent_cart_maintenance_mode')) {
 return new \WP_Error('maintenance', 'Downloads are temporarily disabled during maintenance.');
 }
 return $canDownload;
});```

### ` get_global_storage_settings_{$driver} ` [](#get-global-storage-settings-driver)
`fluent_cart/storage/get_global_storage_settings_{$driver}` — Filter storage driver settings (DYNAMIC)
**When it runs:** This dynamic filter is applied when retrieving settings for a specific storage driver. The `{$driver}` is replaced with the driver name (e.g., `s3`, `local`).
**Parameters:**

- `$settings` (array): The storage driver settings (default `[]`)

**Returns:**

- `$settings` (array): The modified settings

**Source:** `api/StorageDrivers.php:18`
**Usage:**php
```
add_filter('fluent_cart/storage/get_global_storage_settings_s3', function ($settings) {
 // Override S3 settings from environment variables
 $settings['bucket'] = defined('S3_BUCKET') ? S3_BUCKET : $settings['bucket'];
 $settings['region'] = defined('S3_REGION') ? S3_REGION : $settings['region'];
 return $settings;
});```

### ` get_global_storage_drivers ` [](#get-global-storage-drivers)
`fluent_cart/storage/get_global_storage_drivers` — Filter all available storage drivers
**When it runs:** This filter is applied when retrieving the list of all available storage drivers.
**Parameters:**

- `$drivers` (array): Array of storage driver definitions (default `[]`)

**Returns:**

- `$drivers` (array): The modified drivers array

**Source:** `StorageDrivers.php:28`
**Usage:**php
```
add_filter('fluent_cart/storage/get_global_storage_drivers', function ($drivers) {
 $drivers['backblaze'] = [
 'title' => 'Backblaze B2',
 'description' => 'Store files on Backblaze B2',
 'handler' => 'BackblazeDriver',
 ];
 return $drivers;
});```

### ` get_global_storage_driver_status_{$driver} ` [](#get-global-storage-driver-status-driver)
`fluent_cart/storage/get_global_storage_driver_status_{$driver}` — Filter storage driver status (DYNAMIC)
**When it runs:** This dynamic filter retrieves the connection status for a specific storage driver.
**Parameters:**

- `$status` (array): The driver status (default `[]`)

**Returns:**

- `$status` (array): The modified status array

**Source:** `StorageDrivers.php:65`
**Usage:**php
```
add_filter('fluent_cart/storage/get_global_storage_driver_status_s3', function ($status) {
 $status['connected'] = true;
 $status['message'] = 'Connected to S3 bucket successfully';
 return $status;
});```

### ` verify_driver_connect_info_{$driver} ` [](#verify-driver-connect-info-driver)
`fluent_cart/verify_driver_connect_info_{$driver}` — Filter driver connection verification (DYNAMIC)
**When it runs:** This dynamic filter is applied when verifying the connection info for a storage driver.
**Parameters:**

- `$settings` (array): The driver connection settings

**Returns:**

- `$settings` (array): The modified settings (may include error information)

**Source:** `StorageDrivers.php:79`
**Usage:**php
```
add_filter('fluent_cart/verify_driver_connect_info_s3', function ($settings) {
 // Validate credentials before saving
 try {
 $client = new \Aws\S3\S3Client($settings);
 $client->listBuckets();
 $settings['verified'] = true;
 } catch (\Exception $e) {
 $settings['error'] = $e->getMessage();
 }
 return $settings;
});```

### ` storage_settings_before_update_{$slug} ` [](#storage-settings-before-update-slug)
`fluent_cart/storage/storage_settings_before_update_{$slug}` — Filter storage settings before saving (DYNAMIC)
**When it runs:** This dynamic filter is applied just before storage driver settings are saved, allowing you to validate or modify them.
**Parameters:**

- `$settings` (array): The new settings to save
- `$oldSettings` (array): The previous settings

**Returns:**

- `$settings` (array): The modified settings

**Source:** `BaseStorageDriver.php:152`
**Usage:**php
```
add_filter('fluent_cart/storage/storage_settings_before_update_s3', function ($settings, $oldSettings) {
 // Preserve the secret key if not provided in the update
 if (empty($settings['secret_key']) && !empty($oldSettings['secret_key'])) {
 $settings['secret_key'] = $oldSettings['secret_key'];
 }
 return $settings;
}, 10, 2);```

## Localization & Address [](#localization-address)

### ` country_state_options ` [](#country-state-options)
`fluent_cart/country_state_options` — Filter country and state options
**When it runs:** This filter is applied when retrieving country and state dropdown options for address forms.
**Parameters:**

- `$options` (array): The country/state options array

**Returns:**

- `$options` (array): The modified options

**Source:** `LocalizationManager.php:425`
**Usage:**php
```
add_filter('fluent_cart/country_state_options', function ($options) {
 // Remove a country from the list
 unset($options['countries']['XX']);
 return $options;
});```

### ` address/postcode/format ` [](#address-postcode-format)
`fluent_cart/address/postcode/format` — Filter postcode formatting
**When it runs:** This filter is applied when formatting a postcode value, typically during address validation.
**Parameters:**

- `$postcode` (string): The trimmed postcode value
- `$country` (string): The country code

**Returns:**

- `$postcode` (string): The formatted postcode

**Source:** `PostcodeVerification.php:53`
**Usage:**php
```
add_filter('fluent_cart/address/postcode/format', function ($postcode, $country) {
 // Format UK postcodes with a space
 if ($country === 'GB' && strlen($postcode) > 3 && strpos($postcode, ' ') === false) {
 return substr($postcode, 0, -3) . ' ' . substr($postcode, -3);
 }
 return $postcode;
}, 10, 2);```

### ` address/postcode/is_valid ` [](#address-postcode-is-valid)
`fluent_cart/address/postcode/is_valid` — Filter postcode validation result
**When it runs:** This filter is applied after postcode validation to allow custom validation rules.
**Parameters:**

- `$valid` (bool): Whether the postcode is valid
- `$postcode` (string): The postcode being validated
- `$country` (string): The country code

**Returns:**

- `$valid` (bool): The modified validation result

**Source:** `PostcodeVerification.php:154`
**Usage:**php
```
add_filter('fluent_cart/address/postcode/is_valid', function ($valid, $postcode, $country) {
 // Add custom validation for specific country
 if ($country === 'XX') {
 return preg_match('/^\d{5}$/', $postcode) === 1;
 }
 return $valid;
}, 10, 3);```

### ` util/countries ` [](#util-countries)
`fluent-cart/util/countries` — Filter the country list
**When it runs:** This filter is applied when retrieving the full list of countries.
**Note:** This hook uses a non-standard hyphenated prefix (`fluent-cart/`) rather than the standard `fluent_cart/` convention. This is a legacy naming that may be standardized in a future release.
**Parameters:**

- `$options` (array): Array of country code => country name pairs

**Returns:**

- `$options` (array): The modified country list

**Source:** `Helper.php:1140`
**Usage:**php
```
add_filter('fluent-cart/util/countries', function ($options) {
 // Limit to specific countries
 return array_intersect_key($options, array_flip(['US', 'CA', 'GB', 'AU']));
});```

## Templates & Frontend [](#templates-frontend)

### ` template/disable_taxonomy_fallback ` [](#template-disable-taxonomy-fallback)
`fluent_cart/template/disable_taxonomy_fallback` — Disable taxonomy fallback template
**When it runs:** This filter controls whether the taxonomy fallback template should be disabled.
**Parameters:**

- `$disable` (bool): Whether to disable taxonomy fallback (default `false`)

**Returns:**

- `$disable` (bool): The modified value

**Source:** `TemplateLoader.php:113`
**Usage:**php
```
add_filter('fluent_cart/template/disable_taxonomy_fallback', function ($disable) {
 // Disable taxonomy fallback when using a custom theme
 return true;
});```

### ` has_block_template ` [](#has-block-template)
`fluent_cart/has_block_template` — Filter block template existence check
**When it runs:** This filter is applied when checking if a block template exists for the current page.
**Parameters:**

- `$hasTemplate` (bool): Whether a block template exists

**Returns:**

- `$hasTemplate` (bool): The modified result

**Source:** `TemplateLoader.php:193`
**Usage:**php
```
add_filter('fluent_cart/has_block_template', function ($hasTemplate) {
 // Force classic template rendering
 return false;
});```

### ` template_loader_files ` [](#template-loader-files)
`fluent_cart/template_loader_files` — Filter template files to load
**When it runs:** This filter is applied when determining which template files should be loaded for the current request.
**Parameters:**

- `$files` (array): Array of template file paths (default `[]`)

**Returns:**

- `$files` (array): The modified template files array

**Source:** `TemplateLoader.php:206`
**Usage:**php
```
add_filter('fluent_cart/template_loader_files', function ($files) {
 // Add custom template file
 $files[] = get_stylesheet_directory() . '/fluent-cart/custom-template.php';
 return $files;
});```

### ` template_path ` [](#template-path)
`fluent_cart/template_path` — Filter theme template path
**When it runs:** This filter controls the directory path within a theme where FluentCart template overrides are located.
**Parameters:**

- `$path` (string): The template directory path (default `'fluent-cart/'`)

**Returns:**

- `$path` (string): The modified template path

**Source:** `TemplateLoader.php:248`
**Usage:**php
```
add_filter('fluent_cart/template_path', function ($path) {
 // Use a custom directory for template overrides
 return 'my-store/templates/';
});```

### ` fluent_cart_template_part_content ` [](#fluent-cart-template-part-content)
`fluent_cart_template_part_content` — Filter template part content
**When it runs:** This filter is applied to template part content before it is rendered, allowing you to modify the HTML content.
**Parameters:**

- `$content` (string): The template part content
- `$slug` (string): The template part slug
- `$args` (array): Template arguments

**Returns:**

- `$content` (string): The modified content

**Source:** `ProductModalTemplatePart.php:245`
**Usage:**php
```
add_filter('fluent_cart_template_part_content', function ($content, $slug, $args) {
 if ($slug === 'product-card') {
 // Wrap content in a custom div
 $content = '<div class="custom-wrapper">' . $content . '</div>';
 }
 return $content;
}, 10, 3);```

### ` fluent_cart_template_part_content_{$slug} ` [](#fluent-cart-template-part-content-slug)
`fluent_cart_template_part_content_{$slug}` — Filter template part content by slug (DYNAMIC)
**When it runs:** This dynamic filter is applied to a specific template part's content. The `{$slug}` is replaced with the template part slug.
**Parameters:**

- `$content` (string): The template part content
- `$args` (array): Template arguments

**Returns:**

- `$content` (string): The modified content

**Source:** `ProductModalTemplatePart.php:246`
**Usage:**php
```
add_filter('fluent_cart_template_part_content_product-card', function ($content, $args) {
 // Append a badge to product card content
 $content .= '<span class="badge">New</span>';
 return $content;
}, 10, 2);```

### ` fluent_cart_template_part_output ` [](#fluent-cart-template-part-output)
`fluent_cart_template_part_output` — Filter template part output
**When it runs:** This filter is applied to the final rendered output of a template part.
**Parameters:**

- `$output` (string): The rendered template part output

**Returns:**

- `$output` (string): The modified output

**Source:** `ProductModalTemplatePart.php:252`
**Usage:**php
```
add_filter('fluent_cart_template_part_output', function ($output) {
 // Minify the output
 return preg_replace('/\s+/', ' ', $output);
});```

### ` fluent_cart_template_part_output_{$slug} ` [](#fluent-cart-template-part-output-slug)
`fluent_cart_template_part_output_{$slug}` — Filter template part output by slug (DYNAMIC)
**When it runs:** This dynamic filter is applied to the final rendered output of a specific template part. The `{$slug}` is replaced with the template part slug.
**Parameters:**

- `$output` (string): The rendered output

**Returns:**

- `$output` (string): The modified output

**Source:** `ProductModalTemplatePart.php:253`
**Usage:**php
```
add_filter('fluent_cart_template_part_output_product-modal', function ($output) {
 // Add data attributes to the modal output
 return str_replace('<div class="fct-modal"', '<div class="fct-modal" data-tracking="true"', $output);
});```

### ` buttons/enable_floating_cart_button ` [](#buttons-enable-floating-cart-button)
`fluent_cart/buttons/enable_floating_cart_button` — Filter floating cart button visibility
**When it runs:** This filter controls whether the floating cart button is displayed on the frontend.
**Parameters:**

- `$enabled` (bool): Whether the floating cart button is enabled (default `true`)

**Returns:**

- `$enabled` (bool): The modified value

**Source:** `app/Hooks/Cart/CartLoader.php:41`
**Usage:**php
```
add_filter('fluent_cart/buttons/enable_floating_cart_button', function ($enabled) {
 // Disable floating cart on specific pages
 if (is_page('landing-page')) {
 return false;
 }
 return $enabled;
});```

## Widgets & Dashboard [](#widgets-dashboard)

### ` {$widgetName} ` [](#widgetname)
`fluent_cart/{$widgetName}` — Filter widget data by name (DYNAMIC)
**When it runs:** This dynamic filter is applied when a dashboard widget retrieves its data. The `{$widgetName}` is replaced with the specific widget name.
**Parameters:**

- `$widgetData` (mixed): The widget data returned by `widgetData()` method

**Returns:**

- `$widgetData` (mixed): The modified widget data

**Source:** `app/Services/Widgets/BaseWidget.php:16`
**Usage:**php
```
add_filter('fluent_cart/revenue_widget', function ($widgetData) {
 // Add custom metric to revenue widget
 $widgetData['custom_metric'] = calculate_custom_metric();
 return $widgetData;
});```

### ` widgets/{$filter} ` [](#widgets-filter)
`fluent_cart/widgets/{$filter}` — Filter widget data by filter key (DYNAMIC)
**When it runs:** This dynamic filter is applied when retrieving widget data for a specific filter key in the widgets controller.
**Parameters:**

- `$result` (array): The widget result data (default `[]`)
- `$data` (array): The request data

**Returns:**

- `$result` (array): The modified widget data

**Source:** `WidgetsController.php:36`
**Usage:**php
```
add_filter('fluent_cart/widgets/sales_overview', function ($result, $data) {
 $result['custom_chart'] = [
 'labels' => ['Jan', 'Feb', 'Mar'],
 'data' => [100, 200, 150],
 ];
 return $result;
}, 10, 2);```

### ` promo_gateways ` [](#promo-gateways)
`fluent_cart/promo_gateways` — Filter promotional gateways
**When it runs:** This filter is applied when retrieving the list of promotional payment gateways shown in the admin.
**Parameters:**

- `$defaultGateways` (array): Array of default promotional gateways

**Returns:**

- `$defaultGateways` (array): The modified gateways array

**Source:** `PromoGatewaysHandler.php:36`
**Usage:**php
```
add_filter('fluent_cart/promo_gateways', function ($gateways) {
 // Remove a promo gateway
 unset($gateways['example_gateway']);
 return $gateways;
});```

### ` addon_gateways ` [](#addon-gateways)
`fluent_cart/addon_gateways` — Filter addon payment gateways
**When it runs:** This filter is applied when retrieving the list of addon payment gateways.
**Parameters:**

- `$defaultGateways` (array): Array of default addon gateways

**Returns:**

- `$defaultGateways` (array): The modified gateways array

**Source:** `AddonGatewaysHandler.php:36`
**Usage:**php
```
add_filter('fluent_cart/addon_gateways', function ($gateways) {
 $gateways['custom_pay'] = [
 'title' => 'Custom Pay',
 'description' => 'Custom payment gateway addon',
 'is_active' => true,
 ];
 return $gateways;
});```

## Advanced List Filters [](#advanced-list-filters)

### ` {$filter}_list_filter_query ` [](#filter-list-filter-query)
`fluent_cart/{$filter}_list_filter_query` — Filter list filter query (DYNAMIC)
**When it runs:** This dynamic filter is applied when building database queries for filtered list pages (orders, customers, subscriptions, etc.). The `{$filter}` is replaced with the filter context name.
**Parameters:**

- `$query` (Builder): The Eloquent query builder instance

**Returns:**

- `$query` (Builder): The modified query builder

**Source:** `BaseFilter.php:962,971`
**Usage:**php
```
add_filter('fluent_cart/orders_list_filter_query', function ($query) {
 // Only show orders from the last 30 days by default
 $query->where('created_at', '>=', gmdate('Y-m-d H:i:s', strtotime('-30 days')));
 return $query;
});```

### ` {$filterName}_filter_options ` [](#filtername-filter-options)
`fluent_cart/{$filterName}_filter_options` — Filter options for list page filters (DYNAMIC)
**When it runs:** This dynamic filter is applied when retrieving available filter options for admin list pages.
**Parameters:**

- `$options` (array): The filter options array

**Returns:**

- `$options` (array): The modified filter options

**Source:** `BaseFilter.php:995`
**Usage:**php
```
add_filter('fluent_cart/orders_filter_options', function ($options) {
 // Add a custom filter option
 $options['custom_status'] = [
 'label' => 'Custom Status',
 'type' => 'select',
 'options' => ['pending_review' => 'Pending Review'],
 ];
 return $options;
});```

### ` {$filterName}_table_columns ` [](#filtername-table-columns)
`fluent_cart/{$filterName}_table_columns` — Filter table columns for list pages (DYNAMIC)
**When it runs:** This dynamic filter is applied when retrieving table column definitions for admin list pages.
**Parameters:**

- `$columns` (array): The table column definitions (default `[]`)

**Returns:**

- `$columns` (array): The modified columns array

**Source:** `BaseFilter.php:1038`
**Usage:**php
```
add_filter('fluent_cart/orders_table_columns', function ($columns) {
 $columns['custom_field'] = [
 'label' => 'Custom Field',
 'sortable' => true,
 'width' => '120px',
 ];
 return $columns;
});```

### ` advanced_filter_options_{$dataKey} ` [](#advanced-filter-options-datakey)
`fluent_cart/advanced_filter_options_{$dataKey}` — Filter advanced filter options (DYNAMIC)
**When it runs:** This dynamic filter is applied when retrieving options for the advanced filter UI. The `{$dataKey}` is replaced with the specific data key.
**Parameters:**

- `$options` (array): The filter options

**Returns:**

- `$options` (array): The modified options

**Source:** `AdvanceFilterController.php:46`
**Usage:**php
```
add_filter('fluent_cart/advanced_filter_options_payment_methods', function ($options) {
 $options[] = [
 'value' => 'custom_gateway',
 'label' => 'Custom Gateway',
 ];
 return $options;
});```

## Plugin Installer [](#plugin-installer)

### ` outside_addon/handle_cdn_install ` [](#outside-addon-handle-cdn-install)
`fluent_cart/outside_addon/handle_cdn_install` — Filter CDN addon installation
**When it runs:** This filter is applied when attempting to install an addon from a CDN source. Return a non-null value to handle the installation yourself.
**Parameters:**

- `$result` (mixed): Installation result (default `null`)

**Returns:**

- `$result` (mixed): The installation result, or `null` to use default handling

**Source:** `BackgroundInstaller.php:143`
**Usage:**php
```
add_filter('fluent_cart/outside_addon/handle_cdn_install', function ($result) {
 // Handle custom CDN addon installation
 if ($result === null) {
 // Perform custom installation logic
 return ['success' => true, 'message' => 'Installed from custom CDN'];
 }
 return $result;
});```

### ` outside_addon/handle_install ` [](#outside-addon-handle-install)
`fluent_cart/outside_addon/handle_install` — Filter external addon installation
**When it runs:** This filter is applied when installing an addon from an external source. Return a non-null value to handle the installation yourself.
**Parameters:**

- `$result` (mixed): Installation result (default `null`)

**Returns:**

- `$result` (mixed): The installation result, or `null` to use default handling

**Source:** `BackgroundInstaller.php:164`
**Usage:**php
```
add_filter('fluent_cart/outside_addon/handle_install', function ($result) {
 // Handle custom external addon installation
 return ['success' => true, 'message' => 'Addon installed successfully'];
});```

## Pro: Licensing API Pro [](#pro-licensing-api)

### ` license/checking_error ` [](#license-checking-error)
`fluent_cart/license/checking_error` Pro — Filter license check error response
**When it runs:** This filter is applied when a license check encounters an error, allowing you to customize the error response.
**Parameters:**

- `$error` (array): The error response array

**Returns:**

- `$error` (array): The modified error response

**Source:** `LicenseApiHandler.php:45,56`
**Usage:**php
```
add_filter('fluent_cart/license/checking_error', function ($error) {
 // Customize error message
 $error['message'] = 'Please contact support for license verification.';
 return $error;
});```

### ` license/check_item_id ` [](#license-check-item-id)
`fluent_cart/license/check_item_id` Pro — Filter item ID validation during license check
**When it runs:** This filter controls whether the item ID should be validated during a license check API request.
**Parameters:**

- `$checkItemId` (bool): Whether to check the item ID (default `true`)

**Returns:**

- `$checkItemId` (bool): The modified value

**Source:** `LicenseApiHandler.php:54`
**Usage:**php
```
add_filter('fluent_cart/license/check_item_id', function ($checkItemId) {
 // Skip item ID check for specific scenarios
 return false;
});```

### ` license/check_license_response ` [](#license-check-license-response)
`fluent_cart/license/check_license_response` Pro — Filter license check API response
**When it runs:** This filter is applied to the license check API response before it is returned to the client.
**Parameters:**

- `$returnData` (array): The license check response data

**Returns:**

- `$returnData` (array): The modified response data

**Source:** `LicenseApiHandler.php:83`
**Usage:**php
```
add_filter('fluent_cart/license/check_license_response', function ($returnData) {
 // Add custom data to the response
 $returnData['support_url'] = 'https://example.com/support';
 return $returnData;
});```

### ` license/activate_license_response ` [](#license-activate-license-response)
`fluent_cart/license/activate_license_response` Pro — Filter license activation API response
**When it runs:** This filter is applied to the license activation API response before it is returned to the client.
**Parameters:**

- `$returnData` (array): The activation response data

**Returns:**

- `$returnData` (array): The modified response data

**Source:** `LicenseApiHandler.php:170,274`
**Usage:**php
```
add_filter('fluent_cart/license/activate_license_response', function ($returnData) {
 // Add activation timestamp
 $returnData['activated_at'] = gmdate('Y-m-d H:i:s');
 return $returnData;
});```

### ` license/deactivate_license_response ` [](#license-deactivate-license-response)
`fluent_cart/license/deactivate_license_response` Pro — Filter license deactivation API response
**When it runs:** This filter is applied to the license deactivation API response before it is returned to the client.
**Parameters:**

- `$returnData` (array): The deactivation response data

**Returns:**

- `$returnData` (array): The modified response data

**Source:** `LicenseApiHandler.php:356`
**Usage:**php
```
add_filter('fluent_cart/license/deactivate_license_response', function ($returnData) {
 // Add deactivation notice
 $returnData['notice'] = 'License deactivated. You can reactivate on another site.';
 return $returnData;
});```

### ` license/get_version_response ` [](#license-get-version-response)
`fluent_cart/license/get_version_response` Pro — Filter version check API response
**When it runs:** This filter is applied to the version check API response, allowing you to modify changelog or update information.
**Parameters:**

- `$changeLogData` (array): The version/changelog response data

**Returns:**

- `$changeLogData` (array): The modified response data

**Source:** `LicenseApiHandler.php:463`
**Usage:**php
```
add_filter('fluent_cart/license/get_version_response', function ($changeLogData) {
 // Append custom changelog entry
 $changeLogData['sections']['changelog'] .= "\n* Custom patch applied";
 return $changeLogData;
});```

### ` license/santized_url ` [](#license-santized-url)
`fluent_cart/license/santized_url` Pro — Filter sanitized URL for license validation
**When it runs:** This filter is applied when sanitizing a site URL during license activation or validation.
**Parameters:**

- `$url` (string): The sanitized URL
- `$originalUrl` (string): The original URL before sanitization

**Returns:**

- `$url` (string): The modified sanitized URL

**Source:** `LicenseHelper.php:36`
**Usage:**php
```
add_filter('fluent_cart/license/santized_url', function ($url, $originalUrl) {
 // Normalize www subdomain
 return str_replace('://www.', '://', $url);
}, 10, 2);```

## Pro: License Validation & Staging Pro [](#pro-license-validation-staging)

### ` fluent_cart_sl/is_local_site ` [](#fluent-cart-sl-is-local-site)
`fluent_cart_sl/is_local_site` Pro — Filter local/staging site detection
**When it runs:** This filter is applied when determining if the current site is a local or staging environment for licensing purposes.
**Parameters:**

- `$isLocal` (bool): Whether the site is detected as local
- `$context` (array): Context dataphp
```
$context = [
 'url' => 'https://staging.example.com',
 'site' => 'staging.example.com'
];```

**Returns:**

- `$isLocal` (bool): The modified detection result

**Source:** `fluent-cart-pro/.../LicenseSite.php:69`
**Usage:**php
```
add_filter('fluent_cart_sl/is_local_site', function ($isLocal, $context) {
 // Mark custom staging domains as local
 if (str_contains($context['url'], '.staging.')) {
 return true;
 }
 return $isLocal;
}, 10, 2);```

### ` license/staging_subdomain_patterns ` [](#license-staging-subdomain-patterns)
`fluent_cart/license/staging_subdomain_patterns` Pro — Filter staging subdomain patterns
**When it runs:** This filter is applied when checking if a URL matches known staging subdomain patterns.
**Parameters:**

- `$patterns` (array): Array of subdomain patterns that indicate staging sites

**Returns:**

- `$patterns` (array): The modified patterns array

**Source:** `LicenseHelper.php:619`
**Usage:**php
```
add_filter('fluent_cart/license/staging_subdomain_patterns', function ($patterns) {
 $patterns[] = 'dev-';
 $patterns[] = 'test-';
 return $patterns;
});```

### ` license/staging_subfolder_patterns ` [](#license-staging-subfolder-patterns)
`fluent_cart/license/staging_subfolder_patterns` Pro — Filter staging subfolder patterns
**When it runs:** This filter is applied when checking if a URL matches known staging subfolder patterns.
**Parameters:**

- `$patterns` (array): Array of subfolder patterns that indicate staging sites

**Returns:**

- `$patterns` (array): The modified patterns array

**Source:** `LicenseHelper.php:620`
**Usage:**php
```
add_filter('fluent_cart/license/staging_subfolder_patterns', function ($patterns) {
 $patterns[] = '/staging/';
 $patterns[] = '/test-site/';
 return $patterns;
});```

### ` license/staging_domains ` [](#license-staging-domains)
`fluent_cart/license/staging_domains` Pro — Filter hosting provider staging domains
**When it runs:** This filter is applied when checking if a URL belongs to a known hosting provider's staging domain.
**Parameters:**

- `$domains` (array): Array of hosting provider staging domain patterns

**Returns:**

- `$domains` (array): The modified domains array

**Source:** `LicenseHelper.php:621`
**Usage:**php
```
add_filter('fluent_cart/license/staging_domains', function ($domains) {
 $domains[] = 'mystaginghost.com';
 $domains[] = 'preview.myhost.io';
 return $domains;
});```

### ` license/is_staging_site_result ` [](#license-is-staging-site-result)
`fluent_cart/license/is_staging_site_result` Pro — Filter final staging site detection result
**When it runs:** This filter is applied after all staging detection checks, providing the final determination of whether a site is a staging environment.
**Parameters:**

- `$isStaging` (bool): Whether the site is detected as staging (default `false`)
- `$url` (string): The site URL being checked

**Returns:**

- `$isStaging` (bool): The modified staging detection result

**Source:** `LicenseHelper.php:657`
**Usage:**php
```
add_filter('fluent_cart/license/is_staging_site_result', function ($isStaging, $url) {
 // Override staging detection for specific domains
 if (str_contains($url, 'mycompany-staging.com')) {
 return true;
 }
 return $isStaging;
}, 10, 2);```

## Pro: License Configuration Pro [](#pro-license-configuration)

### ` license/validity_by_variation ` [](#license-validity-by-variation)
`fluent_cart/license/validity_by_variation` Pro — Filter license validity per variation
**When it runs:** This filter is applied when determining license validity settings for a specific product variation.
**Parameters:**

- `$validity` (array): The validity settings
- `$context` (array): Context dataphp
```
$context = [
 'variation' => $variationModel
];```

**Returns:**

- `$validity` (array): The modified validity settings

**Source:** `ProductLicenseController.php:74`
**Usage:**php
```
add_filter('fluent_cart/license/validity_by_variation', function ($validity, $context) {
 // Set custom validity for premium variations
 $variation = $context['variation'];
 if ($variation->slug === 'premium') {
 $validity['duration'] = 365;
 $validity['unit'] = 'days';
 }
 return $validity;
}, 10, 2);```

### ` licensing/delete_license_on_order_deleted ` [](#licensing-delete-license-on-order-deleted)
`fluent_cart/licensing/delete_license_on_order_deleted` Pro — Filter whether to delete license when order is deleted
**When it runs:** This filter controls whether associated licenses should be deleted when an order is deleted.
**Parameters:**

- `$delete` (bool): Whether to delete the license (default `true`)

**Returns:**

- `$delete` (bool): The modified value

**Source:** `license-actions.php:117`
**Usage:**php
```
add_filter('fluent_cart/licensing/delete_license_on_order_deleted', function ($delete) {
 // Preserve licenses even when orders are deleted
 return false;
});```

### ` licensing/revoke_license_on_payment_failed ` [](#licensing-revoke-license-on-payment-failed)
`fluent_cart/licensing/revoke_license_on_payment_failed` Pro — Filter whether to revoke license on payment failure
**When it runs:** This filter controls whether a license should be revoked when a payment fails.
**Parameters:**

- `$revoke` (bool): Whether to revoke the license (default `true`)

**Returns:**

- `$revoke` (bool): The modified value

**Source:** `LicenseGenerationHandler.php:123`
**Usage:**php
```
add_filter('fluent_cart/licensing/revoke_license_on_payment_failed', function ($revoke) {
 // Give a grace period instead of immediate revocation
 return false;
});```

### ` licensing/license_create_data ` [](#licensing-license-create-data)
`fluent_cart/licensing/license_create_data` Pro — Filter license creation data
**When it runs:** This filter is applied when constructing the data for a new license before it is saved to the database.
**Parameters:**

- `$data` (array): The license creation data
- `$context` (array): Context dataphp
```
$context = [
 'order' => $orderModel,
 'variation' => $variationModel,
 'subscription' => $subscriptionModel
];```

**Returns:**

- `$data` (array): The modified license data

**Source:** `LicenseGenerationHandler.php:521`
**Usage:**php
```
add_filter('fluent_cart/licensing/license_create_data', function ($data, $context) {
 // Set custom activation limit based on variation
 $variation = $context['variation'];
 if ($variation->slug === 'enterprise') {
 $data['activation_limit'] = 100;
 }
 return $data;
}, 10, 2);```

### ` license/expiration_date_by_variation ` [](#license-expiration-date-by-variation)
`fluent_cart/license/expiration_date_by_variation` Pro — Filter license expiration date
**When it runs:** This filter is applied when calculating the license expiration date for a specific product variation.
**Parameters:**

- `$timestamp` (int|false): The expiration timestamp, or `false` for no expiration
- `$context` (array): Context dataphp
```
$context = [
 'variation' => $variationModel,
 'trial_days' => 14
];```

**Returns:**

- `$timestamp` (int|false): The modified expiration timestamp

**Source:** `LicenseHelper.php:81`
**Usage:**php
```
add_filter('fluent_cart/license/expiration_date_by_variation', function ($timestamp, $context) {
 // Add extra 30 days for trial users
 if ($context['trial_days'] > 0 && $timestamp) {
 return $timestamp + (30 * DAY_IN_SECONDS);
 }
 return $timestamp;
}, 10, 2);```

### ` license/default_validity_by_variation ` [](#license-default-validity-by-variation)
`fluent_cart/license/default_validity_by_variation` Pro — Filter default license validity
**When it runs:** This filter is applied when retrieving the default license validity settings for a product variation.
**Parameters:**

- `$validity` (array): The default validity settingsphp
```
$validity = [
 'unit' => 'years',
 'value' => 1
];```

- `$context` (array): Context dataphp
```
$context = [
 'variation' => $variationModel
];```

**Returns:**

- `$validity` (array): The modified validity settings

**Source:** `LicenseHelper.php:418`
**Usage:**php
```
add_filter('fluent_cart/license/default_validity_by_variation', function ($validity, $context) {
 // Set lifetime validity for specific variations
 $variation = $context['variation'];
 if ($variation->slug === 'lifetime') {
 return ['unit' => 'years', 'value' => 100];
 }
 return $validity;
}, 10, 2);```

### ` license/grace_period_in_days ` [](#license-grace-period-in-days)
`fluent_cart/license/grace_period_in_days` Pro — Filter license grace period
**When it runs:** This filter controls the number of grace period days after a license expires before it is fully revoked.
**Parameters:**

- `$days` (int): The grace period in days (default `15`)

**Returns:**

- `$days` (int): The modified grace period

**Source:** `LicenseHelper.php:687`
**Usage:**php
```
add_filter('fluent_cart/license/grace_period_in_days', function ($days) {
 // Extend grace period to 30 days
 return 30;
});```

### ` fluent_cart_sl/generate_license_key ` [](#fluent-cart-sl-generate-license-key)
`fluent_cart_sl/generate_license_key` Pro — Filter license key generation
**When it runs:** This filter is applied when generating a new license key, allowing you to customize the key format.
**Parameters:**

- `$key` (string): The generated license key (MD5 hash by default)
- `$context` (array): Context dataphp
```
$context = [
 'data' => $licenseData
];```

**Returns:**

- `$key` (string): The modified license key

**Source:** `UUID.php:32`
**Usage:**php
```
add_filter('fluent_cart_sl/generate_license_key', function ($key, $context) {
 // Use a formatted license key
 $key = strtoupper($key);
 return implode('-', str_split($key, 8));
}, 10, 2);```

### ` fluent_cart_sl_encoded_package_url ` [](#fluent-cart-sl-encoded-package-url)
`fluent_cart_sl_encoded_package_url` Pro — Filter encoded download package URL
**When it runs:** This filter is applied to the encoded package download URL returned during update checks.
**Parameters:**

- `$package_url` (string): The encoded package URL

**Returns:**

- `$package_url` (string): The modified package URL

**Source:** `LicenseManager.php:152`
**Usage:**php
```
add_filter('fluent_cart_sl_encoded_package_url', function ($package_url) {
 // Route downloads through a CDN
 return str_replace('https://example.com', 'https://cdn.example.com', $package_url);
});```

### ` fluent_cart_sl/issue_license_data ` [](#fluent-cart-sl-issue-license-data)
`fluent_cart_sl/issue_license_data` Pro — Filter license issue data
**When it runs:** This filter is applied to license data when issuing a new license through the license manager.
**Parameters:**

- `$data` (array): The license issue data

**Returns:**

- `$data` (array): The modified license data

**Source:** `LicenseManager.php:257`
**Usage:**php
```
add_filter('fluent_cart_sl/issue_license_data', function ($data) {
 // Set default activation limit
 if (empty($data['activation_limit'])) {
 $data['activation_limit'] = 5;
 }
 return $data;
});```

### ` fluentcart/sanitize_user_meta ` [](#fluentcart-sanitize-user-meta)
`fluentcart/sanitize_user_meta` Pro — Filter user metadata sanitization
**When it runs:** This filter controls whether a specific user meta field should be sanitized during processing.
**Note:** This hook uses a non-standard prefix (`fluentcart/`) rather than the standard `fluent_cart/` convention. This is a legacy naming that may be standardized in a future release.
**Parameters:**

- `$sanitize` (bool): Whether to sanitize the field (default `true`)
- `$metaFieldName` (string): The meta field name
- `$metaData` (mixed): The meta data value

**Returns:**

- `$sanitize` (bool): Whether to sanitize

**Source:** `WPUserConnect.php:219`
**Usage:**php
```
add_filter('fluentcart/sanitize_user_meta', function ($sanitize, $metaFieldName, $metaData) {
 // Skip sanitization for specific fields
 if ($metaFieldName === 'custom_html_field') {
 return false;
 }
 return $sanitize;
}, 10, 3);```

## Pro: Plugin Updater Pro [](#pro-plugin-updater)

### ` fluent_sl/api_request_query_params ` [](#fluent-sl-api-request-query-params)
`fluent_sl/api_request_query_params` Pro — Filter API request query parameters
**When it runs:** This filter is applied when building query parameters for license API requests (update checks, activations, etc.).
**Parameters:**

- `$params` (array): The query parameters array

**Returns:**

- `$params` (array): The modified query parameters

**Source:** `PluginUpdater.php:234`
**Usage:**php
```
add_filter('fluent_sl/api_request_query_params', function ($params) {
 // Add custom tracking parameter
 $params['php_version'] = phpversion();
 $params['wp_version'] = get_bloginfo('version');
 return $params;
});```

### ` fluent_sl/updater_payload_{$slug} ` [](#fluent-sl-updater-payload-slug)
`fluent_sl/updater_payload_{$slug}` Pro — Filter update check payload (DYNAMIC)
**When it runs:** This dynamic filter is applied to the update check payload for a specific plugin slug. The `{$slug}` is replaced with the plugin's slug.
**Parameters:**

- `$payload` (array): The update check payload

**Returns:**

- `$payload` (array): The modified payload

**Source:** `PluginUpdater.php:251`
**Usage:**php
```
add_filter('fluent_sl/updater_payload_fluent-cart-pro', function ($payload) {
 // Add environment info to update payload
 $payload['server_software'] = $_SERVER['SERVER_SOFTWARE'] ?? 'unknown';
 return $payload;
});```

---

