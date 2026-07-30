# Filter Hooks: Settings & Configuration

All filters related to admin settings, store configuration, module management, currency formatting, admin UI, permissions, translations, email notifications, and block editor.

---

## Store Settings

### `store_settings/values`
`fluent_cart/store_settings/values` — Filter default store settings values

* **When it runs:** This filter is applied when retrieving the default store settings, before merging with saved values. Use it to add or modify defaults for all store configuration options.
* **Source:** `api/StoreSettings.php` (line 89)

#### Parameters:
* `$defaultSettings` *(array)* — The default store settings (`currency`, `order_mode`, `checkout_button_text`, etc.)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified default settings array

#### Usage Example:
```php
// Filter default store settings values before merging with saved options
add_filter('fluent_cart/store_settings/values', function ($defaultSettings, $data) {
    // Change default currency to EUR and set order mode to live
    $defaultSettings['currency'] = 'EUR';
    $defaultSettings['order_mode'] = 'live';
    return $defaultSettings;
}, 10, 2);
```

---

### `store_settings/fields`
`fluent_cart/store_settings/fields` — Filter store settings form field definitions

* **When it runs:** This filter is applied when rendering the store settings form in the admin interface. Use it to add, remove, or modify settings tabs and fields.
* **Source:** `api/StoreSettings.php` (line 1141)

#### Parameters:
* `$fields` *(array)* — Nested array of settings tabs and field definitions (`setting_tabs -> schema`)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified fields array

#### Usage Example:
```php
// Filter store settings form field definitions in admin interface
add_filter('fluent_cart/store_settings/fields', function ($fields, $data) {
    // Add a custom settings section tab and field
    $fields['setting_tabs']['schema']['custom_tab'] = [
        'title'  => 'Custom Settings',
        'fields' => [
            [
                'key'   => 'custom_field',
                'label' => 'Custom Field',
                'type'  => 'text',
            ]
        ]
    ];
    return $fields;
}, 10, 2);
```

---

### `store_settings/rules`
`fluent_cart/store_settings/rules` — Filter validation rules for store settings

* **When it runs:** This filter is applied when validating store settings form submissions. Use it to add or modify validation rules for settings fields.
* **Source:** `app/Http/Requests/FluentMetaRequest.php` (line 34)

#### Parameters:
* `$rules` *(array)* — Validation rules keyed by field name (`'store_name' => 'required|...'`)
* **Returns:** *(array)* — The modified validation rules array

#### Usage Example:
```php
// Filter validation rules for store settings form submissions
add_filter('fluent_cart/store_settings/rules', function ($rules) {
    // Add validation rules for custom settings field
    $rules['custom_field'] = 'required|sanitizeText|maxLength:100';
    return $rules;
});
```

---

### `store_settings/sanitizer`
`fluent_cart/store_settings/sanitizer` — Filter sanitization rules for store settings

* **When it runs:** This filter is applied when sanitizing store settings input before saving. Each key maps to a sanitize callback function or callable.
* **Source:** `app/Http/Requests/FluentMetaRequest.php` (line 136)

#### Parameters:
* `$sanitizer` *(array)* — Sanitization callbacks keyed by field name
* **Returns:** *(array)* — The modified sanitizer array

#### Usage Example:
```php
// Filter sanitization rules for store settings before saving
add_filter('fluent_cart/store_settings/sanitizer', function ($sanitizer) {
    // Add sanitizer callback for custom settings field
    $sanitizer['custom_field'] = 'sanitize_text_field';
    return $sanitizer;
});
```

---

### `confirmation_setting_fields`
`fluent_cart/confirmation_setting_fields` — Filter confirmation page settings fields

* **When it runs:** This filter is applied when rendering the confirmation (receipt) page settings in the admin. Use it to add additional settings fields for the order confirmation page.
* **Source:** `api/Confirmation.php` (line 76)

#### Parameters:
* `$fields` *(array)* — Field definitions for the confirmation page settings
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified fields array

#### Usage Example:
```php
// Filter confirmation page settings fields in admin
add_filter('fluent_cart/confirmation_setting_fields', function ($fields, $data) {
    // Add a custom confirmation page setting checkbox
    $fields['show_social_share'] = [
        'label' => 'Show social share buttons',
        'type'  => 'checkbox',
        'value' => 'no',
    ];
    return $fields;
}, 10, 2);
```

---

## Module Settings

### `module_setting/fields`
`fluent_cart/module_setting/fields` — Filter module settings form fields

* **When it runs:** This filter is applied when retrieving module settings field definitions. Modules register their settings fields through this filter.
* **Source:** `api/ModuleSettings.php` (line 21)

#### Parameters:
* `$fields` *(array)* — Array of module settings field definitions (empty by default)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified fields array

#### Usage Example:
```php
// Filter module settings form field definitions
add_filter('fluent_cart/module_setting/fields', function ($fields, $data) {
    // Register custom module settings fields
    $fields['custom_module'] = [
        'title'  => 'Custom Module',
        'fields' => [
            [
                'key'   => 'api_key',
                'label' => 'API Key',
                'type'  => 'text',
            ]
        ]
    ];
    return $fields;
}, 10, 2);
```

---

### `module_setting/default_values`
`fluent_cart/module_setting/default_values` — Filter module settings default values

* **When it runs:** This filter is applied when retrieving all module settings. It provides default values that are merged with saved settings, ensuring newly registered modules have their defaults applied.
* **Source:** `api/ModuleSettings.php` (line 42)

#### Parameters:
* `$defaults` *(array)* — Default values for module settings (empty by default)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified defaults array keyed by module name

#### Usage Example:
```php
// Filter module settings default values
add_filter('fluent_cart/module_setting/default_values', function ($defaults, $data) {
    // Set default values array for custom module
    $defaults['custom_module'] = [
        'active'  => 'no',
        'api_key' => '',
        'mode'    => 'sandbox',
    ];
    return $defaults;
}, 10, 2);
```

---

### `module_settings/plugin_addons`
`fluent_cart/module_settings/plugin_addons` — Filter plugin add-on modules list

* **When it runs:** This filter is applied when listing available plugin add-ons in the module settings page. Use it to register third-party add-on modules that can be installed from the admin.
* **Source:** `app/Http/Controllers/ModuleSettingsController.php` (line 199)

#### Parameters:
* `$addons` *(array)* — Array of add-on module definitions (`title`, `description`, `logo`, `plugin_slug`, etc.)
* **Returns:** *(array)* — The modified add-ons array

#### Usage Example:
```php
// Filter plugin add-on modules list in module settings page
add_filter('fluent_cart/module_settings/plugin_addons', function ($addons) {
    // Register a custom add-on module to the admin list
    $addons[] = [
        'title'       => 'My Custom Add-on',
        'description' => 'Extends FluentCart with custom features.',
        'logo'        => plugin_dir_url(__FILE__) . 'logo.svg',
        'plugin_slug' => 'my-custom-addon',
        'plugin_file' => 'my-custom-addon/my-custom-addon.php',
        'source_type' => 'cdn',
        'source_link' => 'https://example.com/my-addon.zip',
        'upcoming'    => false,
    ];
    return $addons;
});
```

---

## Currency & Formatting

### `global_currency_setting`
`fluent_cart/global_currency_setting` — Filter global currency settings

* **When it runs:** This filter is applied when retrieving the global currency configuration. It runs after all currency settings have been resolved from stored values and defaults.
* **Source:** `api/CurrencySettings.php` (line 52)

#### Parameters:
* `$settings` *(array)* — Resolved currency settings (`currency`, `currency_sign`, `currency_position`, `decimal_separator`, etc.)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified currency settings

#### Usage Example:
```php
// Filter global currency settings array
add_filter('fluent_cart/global_currency_setting', function ($settings, $data) {
    // Override currency, symbol, and symbol position
    $settings['currency'] = 'EUR';
    $settings['currency_sign'] = '€';
    $settings['currency_position'] = 'right';
    return $settings;
}, 10, 2);
```

---

### `available_currencies`
`fluent-cart/available_currencies` — Filter available currencies for the store

* **When it runs:** This filter is applied when retrieving the list of available currencies for the currency selector in store settings. Note the hyphenated hook prefix (`fluent-cart/` instead of `fluent_cart/`).
* **Source:** `app/Helpers/Helper.php` (line 467)

#### Parameters:
* `$currencies` *(array)* — Array of currency definitions keyed by currency code (`BDT`, `USD`, `GBP`, etc.)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified currencies array

#### Usage Example:
```php
// Filter available currencies for the store currency selector
add_filter('fluent-cart/available_currencies', function ($currencies, $data) {
    // Add Bitcoin (BTC) to the list of available currencies
    $currencies['BTC'] = [
        'label'  => 'Bitcoin',
        'value'  => 'BTC',
        'symbol' => '₿',
    ];
    return $currencies;
}, 10, 2);
```

---

### `accepted_currencies`
`fluent_cart/accepted_currencies` — Filter the full list of accepted currencies

* **When it runs:** This filter is applied when retrieving the complete list of currencies supported by payment gateways (based on Stripe's currency list). Used for currency validation and display throughout the plugin.
* **Source:** `app/Helpers/CurrenciesHelper.php` (line 20)

#### Parameters:
* `$currencies` *(array)* — Associative array of currency code to localized name (`'USD' => 'United States Dollar'`)
* **Returns:** *(array)* — The modified currencies array

#### Usage Example:
```php
// Filter full list of accepted currencies supported by payment gateways
add_filter('fluent_cart/accepted_currencies', function ($currencies) {
    // Remove XRP from accepted currencies list
    unset($currencies['XRP']);
    // Add custom currency to accepted list
    $currencies['CUSTOM'] = 'My Custom Currency';
    return $currencies;
});
```

---

### `global_currency_symbols`
`fluent_cart/global_currency_symbols` — Filter currency symbols map

* **When it runs:** This filter is applied when retrieving the mapping of currency codes to their display symbols. Used for formatting prices throughout the plugin.
* **Source:** `app/Helpers/CurrenciesHelper.php` (line 195)

#### Parameters:
* `$symbols` *(array)* — Associative array of currency code to HTML symbol entity (`'USD' => '&#36;'`)
* **Returns:** *(array)* — The modified currency symbols array

#### Usage Example:
```php
// Filter currency symbols map
add_filter('fluent_cart/global_currency_symbols', function ($symbols) {
    // Override Bangladeshi Taka currency symbol string
    $symbols['BDT'] = 'Tk';
    return $symbols;
});
```

---

### `zero_decimal_currencies`
`fluent_cart/zero_decimal_currencies` — Filter zero-decimal currencies list

* **When it runs:** This filter is applied when retrieving currencies that do not use decimal subunits (e.g., Japanese Yen). These currencies store amounts without dividing by 100.
* **Source:** `app/Helpers/CurrenciesHelper.php` (line 383)

#### Parameters:
* `$currencies` *(array)* — Associative array of zero-decimal currency code to localized name (`'JPY' => 'Japanese Yen'`)
* **Returns:** *(array)* — The modified zero-decimal currencies array

#### Usage Example:
```php
// Filter zero-decimal currencies list
add_filter('fluent_cart/zero_decimal_currencies', function ($currencies) {
    // Add Icelandic Krona to zero-decimal currencies array
    $currencies['ISK'] = 'Icelandic Krona';
    return $currencies;
});
```

---

### `hide_unnecessary_decimals`
`fluent_cart/hide_unnecessary_decimals` — Filter whether to hide `.00` decimals in formatted prices

* **When it runs:** This filter is applied during price formatting. When true, prices like `$10.00` will display as `$10` instead.
* **Source:** `app/Helpers/Helper.php` (line 343)

#### Parameters:
* `$hide` *(bool)* — Whether to hide unnecessary decimals (default: `false`)
* `$context` *(array)* — Context data (`['amount' => 10.00, 'decimal' => 2]`)
* **Returns:** *(bool)* — Whether to hide unnecessary trailing zeros

#### Usage Example:
```php
// Filter whether to hide unnecessary trailing .00 decimals in price display
add_filter('fluent_cart/hide_unnecessary_decimals', function ($hide, $context) {
    // Always hide trailing .00 from displayed prices
    return true;
}, 10, 2);
```

---

## Admin UI & Menu

### `admin_menu_title`
`fluent_cart/admin_menu_title` — Filter admin menu title

* **When it runs:** This filter is applied when registering the WordPress admin menu, allowing you to change the menu label shown in the sidebar.
* **Source:** `app/Hooks/Handlers/MenuHandler.php` (line 164)

#### Parameters:
* `$menuTitle` *(string)* — The default menu title (`'FluentCart'`)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(string)* — The modified menu title

#### Usage Example:
```php
// Filter WordPress admin menu title string
add_filter('fluent_cart/admin_menu_title', function ($menuTitle, $data) {
    // Change admin sidebar menu label to My Store
    return 'My Store';
}, 10, 2);
```

---

### `admin_menu_position`
`fluent_cart/admin_menu_position` — Filter admin menu position

* **When it runs:** This filter is applied when registering the admin menu, controlling its position in the WordPress sidebar.
* **Source:** `app/Hooks/Handlers/MenuHandler.php` (line 173)

#### Parameters:
* `$position` *(int)* — The menu position (default: `3`)
* **Returns:** *(int)* — The modified menu position

#### Usage Example:
```php
// Filter WordPress admin menu position integer
add_filter('fluent_cart/admin_menu_position', function ($position) {
    // Move FluentCart menu position lower in the sidebar
    return 25;
});
```

---

### `admin_filter_options`
`fluent_cart/admin_filter_options` — Filter admin filter options for list pages

* **When it runs:** This filter is applied when loading admin filter options for orders, customers, products, licenses, and tax list pages.
* **Source:** `app/Hooks/Handlers/MenuHandler.php` (line 380)

#### Parameters:
* `$filterOptions` *(array)* — Filter configurations for each list page (`order_filter_options`, `customer_filter_options`, etc.)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified filter options array

#### Usage Example:
```php
// Filter admin list page filter options for orders, customers, etc.
add_filter('fluent_cart/admin_filter_options', function ($filterOptions, $data) {
    // Add a custom status filter option to the orders list
    $filterOptions['order_filter_options']['custom_status'] = [
        'label'   => 'Custom Status',
        'type'    => 'select',
        'options' => ['pending', 'approved'],
    ];
    return $filterOptions;
}, 10, 2);
```

---

### `admin_app_data`
`fluent_cart/admin_app_data` — Filter admin Vue app localized data

* **When it runs:** This filter is applied when loading the admin SPA, providing the full configuration object passed to the Vue application via `wp_localize_script`.
* **Source:** `app/Hooks/Handlers/MenuHandler.php` (line 398)

#### Parameters:
* `$adminLocalizeData` *(array)* — The complete admin app data (`app_config`, `admin_url`, `rest`, `me`, `shop`, `trans`, etc.)
* **Returns:** *(array)* — The modified admin app data

#### Usage Example:
```php
// Filter localized configuration data passed to Vue admin SPA
add_filter('fluent_cart/admin_app_data', function ($adminLocalizeData) {
    // Inject custom settings data into the Vue admin app payload
    $adminLocalizeData['custom_setting'] = 'custom_value';
    $adminLocalizeData['my_plugin_config'] = [
        'enabled' => true,
        'api_url' => 'https://api.example.com',
    ];
    return $adminLocalizeData;
});
```

---

### `admin_notices`
`fluent_cart/admin_notices` — Filter admin notices

* **When it runs:** This filter is applied when loading the admin interface, allowing plugins to inject notices that display in the FluentCart admin panel.
* **Source:** `app/Hooks/Handlers/MenuHandler.php` (line 449)

#### Parameters:
* `$notices` *(array)* — Array of notice objects (default: `[]`)
* **Returns:** *(array)* — The modified notices array

#### Usage Example:
```php
// Filter admin notices array displayed in FluentCart panel
add_filter('fluent_cart/admin_notices', function ($notices) {
    // Inject a custom warning notice into admin panel
    $notices[] = [
        'type'    => 'warning',
        'message' => 'Please configure your payment gateway before going live.',
    ];
    return $notices;
});
```

---

### `admin_base_url`
`fluent_cart/admin_base_url` — Filter admin base URL

* **When it runs:** This filter is applied when constructing admin navigation URLs throughout the plugin, including product menus and global navigation items.
* **Source:** `app/Helpers/AdminHelper.php` (line 22)

#### Parameters:
* `$baseUrl` *(string)* — The default admin base URL (`admin_url('admin.php?page=fluent-cart#/')`)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(string)* — The modified base URL

#### Usage Example:
```php
// Filter admin base URL used for navigation links
add_filter('fluent_cart/admin_base_url', function ($baseUrl, $data) {
    // Use custom admin base URL
    return admin_url('admin.php?page=my-custom-cart#/');
}, 10, 2);
```

---

### `product_admin_items`
`fluent_cart/product_admin_items` — Filter admin product action menu items

* **When it runs:** This filter is applied when rendering the product action menu in the admin product detail view. Use it to add custom navigation tabs to individual product pages.
* **Source:** `app/Helpers/AdminHelper.php` (line 24)

#### Parameters:
* `$menuItems` *(array)* — Array of menu item definitions (`product_edit`, `product_upgrade_paths`, `product_integrations`, etc.)
* `$context` *(array)* — Context data (`['product_id' => 123, 'base_url' => '...']`)
* **Returns:** *(array)* — The modified menu items array

#### Usage Example:
```php
// Filter admin product action menu items in product detail view
add_filter('fluent_cart/product_admin_items', function ($menuItems, $context) {
    // Extract product ID and base URL from context array
    $productId = $context['product_id'];
    $baseUrl = $context['base_url'];

    // Add a custom Analytics tab to individual product menu
    $menuItems['product_analytics'] = [
        'label' => 'Analytics',
        'link'  => $baseUrl . 'products/' . $productId . '/analytics',
    ];
    return $menuItems;
}, 10, 2);
```

---

### `global_admin_menu_items`
`fluent_cart/global_admin_menu_items` — Filter global admin navigation menu

* **When it runs:** This filter is applied when rendering the global admin navigation bar at the top of the FluentCart admin pages. Use it to add or modify top-level navigation items.
* **Source:** `app/Helpers/AdminHelper.php` (line 80)

#### Parameters:
* `$menuItems` *(array)* — Array of navigation items (`dashboard`, `orders`, `customers`, `products`, etc.)
* **Returns:** *(array)* — The modified menu items array

#### Usage Example:
```php
// Filter global admin navigation menu items
add_filter('fluent_cart/global_admin_menu_items', function ($menuItems) {
    // Add a custom top-level navigation item for Custom Reports
    $menuItems['custom_reports'] = [
        'label'      => 'Custom Reports',
        'link'       => admin_url('admin.php?page=fluent-cart#/custom-reports'),
        'permission' => ['reports/view'],
    ];
    return $menuItems;
});
```

---

### `dummy_product_info`
`fluent_cart/dummy_product_info` — Filter dummy product for onboarding

* **When it runs:** This filter is applied when loading the admin app data. It provides dummy product information used during the onboarding flow when the store has no products yet.
* **Source:** `app/Hooks/Handlers/MenuHandler.php` (line 435)

#### Parameters:
* `$dummyProduct` *(array)* — Dummy product info (default: `[]`)
* **Returns:** *(array)* — The modified dummy product info

#### Usage Example:
```php
// Filter dummy product info used during onboarding flow
add_filter('fluent_cart/dummy_product_info', function ($dummyProduct) {
    // Return custom dummy product data structure
    return [
        'title' => 'Sample Digital Product',
        'price' => 2999, // in cents
        'type'  => 'digital',
    ];
});
```

---

### `storage_driver_settings_routes`
`fluent_cart/storage/storage_driver_settings_routes` — Filter storage driver admin routes

* **When it runs:** This filter is applied when loading the admin app, allowing storage driver plugins to register their settings routes in the admin SPA navigation.
* **Source:** `app/Hooks/Handlers/MenuHandler.php` (line 367)

#### Parameters:
* `$routes` *(array)* — Array of storage driver route definitions (default: `[]`)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified routes array

#### Usage Example:
```php
// Filter storage driver admin settings routes in SPA
add_filter('fluent_cart/storage/storage_driver_settings_routes', function ($routes, $data) {
    // Register custom S3 storage driver settings route
    $routes[] = [
        'key'   => 's3_storage',
        'title' => 'S3 Storage',
        'route' => 'settings/storage/s3',
    ];
    return $routes;
}, 10, 2);
```

---

## Permissions & Auth

### `permission/all_roles`
`fluent_cart/permission/all_roles` — Filter permission roles

* **When it runs:** This filter is applied when retrieving all available permission roles. FluentCart ships with four roles (`super_admin`, `manager`, `worker`, `accountant`), each with predefined permission sets.
* **Source:** `app/Services/Permission/PermissionManager.php` (line 92)

#### Parameters:
* `$allRoles` *(array)* — Array of role definitions (`super_admin`, `manager`, `worker`, `accountant`)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified roles array

#### Usage Example:
```php
// Filter permission roles definition array
add_filter('fluent_cart/permission/all_roles', function ($allRoles, $data) {
    // Add a custom Support Agent role with specific permissions
    $allRoles['support_agent'] = [
        'title'        => 'Support Agent',
        'descriptions' => 'View orders and customers, manage order statuses',
        'permissions'  => [
            'orders/view',
            'orders/manage_statuses',
            'customers/view',
        ],
    ];
    return $allRoles;
}, 10, 2);
```

---

## Translations

### `admin_translations`
`fluent_cart/admin_translations` — Filter admin panel translations

* **When it runs:** This filter is applied when loading translation strings for the admin Vue SPA. The translations are passed to the frontend as a localized JavaScript object.
* **Source:** `app/Services/Translations/TransStrings.php` (line 9)

#### Parameters:
* `$translations` *(array)* — Key-value pairs of translation strings loaded from `admin-translation.php`
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified translations array

#### Usage Example:
```php
// Filter translation strings for Vue admin SPA
add_filter('fluent_cart/admin_translations', function ($translations, $data) {
    // Override custom admin label translation
    $translations['custom_label'] = __('My Custom Label', 'my-plugin');
    return $translations;
}, 10, 2);
```

---

### `blocks_translations`
`fluent_cart/blocks_translations` — Filter block editor translations

* **When it runs:** This filter is applied when loading translation strings for the FluentCart block editor interface.
* **Source:** `app/Services/Translations/TransStrings.php` (line 15)

#### Parameters:
* `$translations` *(array)* — Key-value pairs of translation strings loaded from `block-editor-translation.php`
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified translations array

#### Usage Example:
```php
// Filter translation strings for email block editor
add_filter('fluent_cart/blocks_translations', function ($translations, $data) {
    // Override Save translation label
    $translations['Save'] = __('Save Changes', 'my-plugin');
    return $translations;
}, 10, 2);
```

---

### `customer_profile_translations`
`fluent_cart/customer_profile_translations` — Filter customer profile translations

* **When it runs:** This filter is applied when loading translation strings for the customer profile (My Account) frontend page.
* **Source:** `app/Services/Translations/TransStrings.php` (line 87)

#### Parameters:
* `$translations` *(array)* — Key-value pairs of translation strings loaded from `customer-profile-translation.php`
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified translations array

#### Usage Example:
```php
// Filter customer profile (My Account) frontend translation strings
add_filter('fluent_cart/customer_profile_translations', function ($translations, $data) {
    // Customize My Orders heading translation
    $translations['My Orders'] = __('Purchase History', 'my-plugin');
    return $translations;
}, 10, 2);
```

---

### `checkout_translations`
`fluent_cart/checkout_translations` — Filter checkout page translations

* **When it runs:** This filter is applied when loading translation strings for the checkout page frontend.
* **Source:** `app/Services/Translations/TransStrings.php` (line 101)

#### Parameters:
* `$translations` *(array)* — Key-value pairs of translation strings loaded from `checkout-translation.php`
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified translations array

#### Usage Example:
```php
// Filter checkout page frontend translation strings
add_filter('fluent_cart/checkout_translations', function ($translations, $data) {
    // Customize Place Order button label
    $translations['Place Order'] = __('Complete Purchase', 'my-plugin');
    return $translations;
}, 10, 2);
```

---

### `payments_translations`
`fluent_cart/payments_translations` — Filter payment translations

* **When it runs:** This filter is applied when loading translation strings for payment-related UI elements on the frontend.
* **Source:** `app/Services/Translations/TransStrings.php` (line 107)

#### Parameters:
* `$translations` *(array)* — Key-value pairs of translation strings loaded from `payments-translation.php`
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified translations array

#### Usage Example:
```php
// Filter payment frontend translation strings
add_filter('fluent_cart/payments_translations', function ($translations, $data) {
    // Customize Credit Card gateway option label
    $translations['Credit Card'] = __('Debit/Credit Card', 'my-plugin');
    return $translations;
}, 10, 2);
```

---

### `pro/admin_translations` (Pro)
`fluent_cart_pro/admin_translations` — Filter Pro admin translations

* **When it runs:** This filter is applied when loading translation strings specific to FluentCart Pro features in the admin panel.
* **Source:** `fluent-cart-pro/app/Services/Translations/Translations.php` (line 24)

#### Parameters:
* `$translations` *(array)* — Key-value pairs of Pro-specific translation strings
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified translations array

#### Usage Example:
```php
// Filter Pro admin translation strings
add_filter('fluent_cart_pro/admin_translations', function ($translations, $data) {
    // Override Pro License Management menu label
    $translations['License Management'] = __('License Keys', 'my-plugin');
    return $translations;
}, 10, 2);
```

---

## Email & Notifications

### `email_notifications`
`fluent_cart/email_notifications` — Filter email notification settings

* **When it runs:** This filter is applied when retrieving the list of available email notifications. Each notification includes its configuration such as recipients, subject template, and default body. Runs before merging with saved notification configs.
* **Source:** `app/Services/Email/EmailNotifications.php` (line 24)

#### Parameters:
* `$settings` *(array)* — Associative array of notification definitions keyed by notification name
* **Returns:** *(array)* — The modified notification settings array

#### Usage Example:
```php
// Filter email notification settings array
add_filter('fluent_cart/email_notifications', function ($settings) {
    // Register a custom email notification definition
    $settings['custom_notification'] = [
        'title'       => 'Custom Alert',
        'group_label' => 'Custom Actions',
        'settings'    => [
            'subject'         => 'Custom Alert for Order #{order.id}',
            'email_body'      => '',
            'is_default_body' => 'yes',
            'to'              => '{{settings.admin_email}}',
            'status'          => 'active',
        ],
    ];
    return $settings;
});
```

---

### `keep_email_body_draft`
`fluent_cart/keep_email_body_draft` — Filter whether to prevent email body reset

* **When it runs:** This filter is applied when a notification is switched back to its default body. By default, the custom email body is cleared. Return true to preserve the custom body as a draft.
* **Source:** `app/Services/Email/EmailNotifications.php` (line 520)

#### Parameters:
* `$keepDraft` *(bool)* — Whether to keep the custom body as draft (default: `false`)
* `$context` *(array)* — The notification context (`['notification_name' => 'order_completed']`)
* **Returns:** *(bool)* — Whether to preserve the custom email body

#### Usage Example:
```php
// Filter whether to prevent custom email body reset when reverting to default
add_filter('fluent_cart/keep_email_body_draft', function ($keepDraft, $context) {
    // Always preserve custom email bodies as drafts
    return true;
}, 10, 2);
```

---

### `theme_pref`
`fluent_cart/theme_pref` — Filter email template theme preferences

* **When it runs:** This filter is applied when the block parser resolves the email theme preferences, including the color palette and font sizes used in email templates.
* **Source:** `app/Services/Email/FluentBlockParser.php` (line 1997)

#### Parameters:
* `$pref` *(array)* — Theme preference settings (`colors`, `font_sizes`)
* **Returns:** *(array)* — The modified theme preferences

#### Usage Example:
```php
// Filter email template theme preferences for block parser
add_filter('fluent_cart/theme_pref', function ($pref) {
    // Add brand custom color option to email palette
    $pref['colors'][] = [
        'name'  => 'Brand Primary',
        'slug'  => 'brand-primary',
        'color' => '#FF6600',
    ];
    return $pref;
});
```

---

### `condition_presets`
`fluent_cart/condition_presets` — Filter email condition presets

* **When it runs:** This filter is applied when retrieving available condition presets for email template conditional blocks. Presets define reusable conditions like "has note" or "has downloads" that control block visibility.
* **Source:** `app/Services/Email/ConditionPresets.php` (line 124)

#### Parameters:
* `$presets` *(array)* — Array of condition preset definitions (`has_order_note`, `has_downloads`, etc.)
* **Returns:** *(array)* — The modified presets array

#### Usage Example:
```php
// Filter email condition presets list
add_filter('fluent_cart/condition_presets', function ($presets) {
    // Add a custom High Value Order condition preset
    $presets[] = [
        'id'           => 'is_high_value',
        'label'        => 'High Value Order',
        'hint'         => 'Show when order total exceeds $100.',
        'shortcode'    => '{{order.total_amount}}',
        'condition'    => 'greater_than',
        'compareValue' => '10000', // in cents
    ];
    return $presets;
});
```

---

### `evaluate_condition_preset`
`fluent_cart/evaluate_condition_preset` — Filter evaluate condition preset

* **When it runs:** This filter is applied when evaluating a condition preset that has no shortcode and no callback defined. It serves as a fallback for custom condition evaluation logic.
* **Source:** `app/Services/Email/Blocks/BaseBlock.php` (line 196)

#### Parameters:
* `$result` *(bool)* — The evaluation result (default: `false`)
* `$context` *(array)* — Full context for evaluation (`preset`, `resolved`, `data`, `block_attrs`)
* **Returns:** *(bool)* — Whether the condition is met

#### Usage Example:
```php
// Filter evaluation of custom condition presets without built-in shortcodes
add_filter('fluent_cart/evaluate_condition_preset', function ($result, $context) {
    // Extract preset array and order model
    $preset = $context['preset'];
    if ($preset && $preset['id'] === 'my_custom_condition') {
        $order = $context['data']['order'] ?? null;
        return $order && $order->total_amount > 10000;
    }
    return $result;
}, 10, 2);
```

---

### `confirmation_shortcodes`
`fluent_cart/confirmation_shortcodes` — Filter confirmation page shortcodes

* **When it runs:** This filter is applied when retrieving available shortcodes for the order confirmation (receipt) page template editor.
* **Source:** `app/Helpers/EditorShortCodeHelper.php` (line 201)

#### Parameters:
* `$groups` *(array)* — Array of shortcode groups (`customer`, `order`, `general`, `settings`)
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(array)* — The modified shortcode groups array

#### Usage Example:
```php
// Filter available shortcodes for order confirmation (receipt) page template editor
add_filter('fluent_cart/confirmation_shortcodes', function ($groups, $data) {
    // Add a custom shortcode group for tracking URLs
    $groups[] = [
        'title'      => 'Custom Data',
        'key'        => 'custom',
        'shortcodes' => [
            '{{custom.tracking_url}}' => 'Tracking URL',
        ],
    ];
    return $groups;
}, 10, 2);
```

---

### `editor_shortcodes`
`fluent_cart/editor_shortcodes` — Filter email editor shortcodes

* **When it runs:** This filter is applied when retrieving available shortcodes for the email notification template editor. Includes order, general, customer, transaction, settings, and license shortcode groups.
* **Source:** `app/Helpers/EditorShortCodeHelper.php` (line 277)

#### Parameters:
* `$shortCodes` *(array)* — Associative array of shortcode groups (`order`, `general`, `customer`, `transaction`, `settings`, `license`)
* **Returns:** *(array)* — The modified shortcodes array

#### Usage Example:
```php
// Filter available shortcodes for email notification template editor
add_filter('fluent_cart/editor_shortcodes', function ($shortCodes) {
    // Add custom shortcode group for loyalty points and referral codes
    $shortCodes['custom'] = [
        'title'      => 'Custom Fields',
        'key'        => 'custom',
        'shortcodes' => [
            '{{custom.loyalty_points}}' => 'Loyalty Points',
            '{{custom.referral_code}}'  => 'Referral Code',
        ],
    ];
    return $shortCodes;
});
```

---

### `disable_email_celebration_messages`
`fluent_cart/disable_email_celebration_messages` — Filter whether to disable celebration messages in admin emails

* **When it runs:** This filter is applied when generating admin notification emails. By default, FluentCart adds a random celebration message (e.g., "Woo-Hoo! Another Sale!") to admin order emails.
* **Source:** `app/Services/TemplateService.php` (line 114)

#### Parameters:
* `$disable` *(bool)* — Whether to disable celebration messages (default: `false`)
* `$context` *(array)* — The notification type context (`['type' => 'order']`)
* **Returns:** *(bool)* — Whether to disable the celebration messages

#### Usage Example:
```php
// Filter whether to disable random celebration messages in admin notification emails
add_filter('fluent_cart/disable_email_celebration_messages', function ($disable, $context) {
    // Disable celebration header messages for all admin emails
    return true;
}, 10, 2);
```

---

## Block Editor

### `block_editor_require_nonce`
`fluent_cart/block_editor_require_nonce` — Filter whether the block editor requires nonce verification

* **When it runs:** This filter is applied when loading the FluentCart block editor (email template editor). It controls whether nonce verification is enforced for editor access.
* **Source:** `app/Hooks/Handlers/FluentCartBlockEditorHandler.php` (line 54)

#### Parameters:
* `$requireNonce` *(bool)* — Whether to require nonce (default: `true`)
* `$blockType` *(string)* — The block editor type being loaded
* `$request` *(array)* — The current request data
* **Returns:** *(bool)* — Whether to enforce nonce verification

#### Usage Example:
```php
// Filter whether block editor requires nonce verification
add_filter('fluent_cart/block_editor_require_nonce', function ($requireNonce, $blockType, $request) {
    // Disable nonce for specific preview block types if needed
    if ($blockType === 'preview') {
        return false;
    }
    return $requireNonce;
}, 10, 3);
```

---

### `disable_pro_email_templates`
`fluent_cart/disable_pro_email_templates` — Filter whether to disable Pro email templates

* **When it runs:** This filter is applied when loading starter templates in the email block editor. When true, templates with `/pro` or `/modern` in their IDs are excluded from the template picker.
* **Source:** `app/Hooks/Handlers/FluentCartBlockEditorHandler.php` (line 230)

#### Parameters:
* `$disable` *(bool)* — Whether to disable Pro templates (default: `true`)
* **Returns:** *(bool)* — Whether to filter out Pro email templates

#### Usage Example:
```php
// Filter whether to disable Pro email starter templates
add_filter('fluent_cart/disable_pro_email_templates', function ($disable) {
    // Enable Pro email templates when Pro plugin is active
    if (defined('FLUENT_CART_PRO')) {
        return false;
    }
    return $disable;
});
```

---

### `skip_no_conflict` (editor)
`fluent_cart_editor/skip_no_conflict` — Filter whether to skip script unloading in the block editor

* **When it runs:** This filter is applied when the email block editor loads. FluentCart aggressively unloads third-party scripts to prevent conflicts. Return true to skip this behavior and allow all scripts.
* **Source:** `app/Hooks/Handlers/FluentCartBlockEditorHandler.php` (line 638)

#### Parameters:
* `$skip` *(bool)* — Whether to skip no-conflict mode (default: `false`)
* **Returns:** *(bool)* — Whether to skip unloading third-party scripts

#### Usage Example:
```php
// Filter whether to skip third-party script unloading in block editor
add_filter('fluent_cart_editor/skip_no_conflict', function ($skip) {
    // Allow third-party scripts in the block editor
    return true;
});
```

---

### `asset_listed_slugs` (editor)
`fluent_cart_editor/asset_listed_slugs` — Filter approved script slugs in block editor

* **When it runs:** This filter is applied when unloading third-party scripts from the email block editor. Only scripts matching these slug patterns (regex) will be kept.
* **Source:** `app/Hooks/Handlers/FluentCartBlockEditorHandler.php` (line 650)

#### Parameters:
* `$approvedSlugs` *(array)* — Array of regex slug patterns to keep (`['\/gutenberg\/']`)
* **Returns:** *(array)* — The modified approved slugs array

#### Usage Example:
```php
// Filter approved script slug regex patterns in block editor
add_filter('fluent_cart_editor/asset_listed_slugs', function ($approvedSlugs) {
    // Allow scripts from a specific custom plugin
    $approvedSlugs[] = '\/my-custom-plugin\/';
    return $approvedSlugs;
});
```

---

### `skip_no_conflict` (styles)
`fluent_cart/skip_no_conflict` — Filter whether to skip style unloading in the block editor

* **When it runs:** This filter is applied when unloading third-party stylesheets from the email block editor. Return true to allow all styles to load without filtering.
* **Source:** `app/Hooks/Handlers/FluentCartBlockEditorHandler.php` (line 707)

#### Parameters:
* `$skip` *(bool)* — Whether to skip no-conflict mode for styles (default: `false`)
* `$type` *(string)* — The asset type (`'styles'`)
* **Returns:** *(bool)* — Whether to skip unloading third-party styles

#### Usage Example:
```php
// Filter whether to skip third-party stylesheet unloading in block editor
add_filter('fluent_cart/skip_no_conflict', function ($skip, $type) {
    // Skip stylesheet unloading for styles asset type
    if ($type === 'styles') {
        return true;
    }
    return $skip;
}, 10, 2);
```

---

### `asset_listed_slugs` (styles)
`fluent_cart/asset_listed_slugs` — Filter approved style slugs in block editor

* **When it runs:** This filter is applied when filtering third-party stylesheets from the email block editor. Only styles matching these slug patterns (regex) will be kept.
* **Source:** `app/Hooks/Handlers/FluentCartBlockEditorHandler.php` (line 720)

#### Parameters:
* `$approvedSlugs` *(array)* — Array of regex slug patterns to keep (`['\/gutenberg\/']`)
* **Returns:** *(array)* — The modified approved slugs array

#### Usage Example:
```php
// Filter approved stylesheet slug regex patterns in block editor
add_filter('fluent_cart/asset_listed_slugs', function ($approvedSlugs) {
    // Allow custom plugin stylesheets in block editor
    $approvedSlugs[] = '\/my-custom-plugin\/';
    return $approvedSlugs;
});
```

---

### `block_editor_unregister_all_patterns`
`fluent_cart/block_editor_unregister_all_patterns` — Filter whether to unregister default block patterns

* **When it runs:** This filter is applied when loading the email block editor. By default, all WordPress core block patterns are removed since they are designed for web pages, not emails.
* **Source:** `app/Hooks/Handlers/FluentCartBlockEditorHandler.php` (line 740)

#### Parameters:
* `$shouldUnregister` *(bool)* — Whether to unregister patterns (default: `true`)
* `$context` *(string)* — The editor context
* `$data` *(array)* — Additional context data (empty array)
* **Returns:** *(bool)* — Whether to unregister default block patterns

#### Usage Example:
```php
// Filter whether to unregister default block patterns in the email editor
add_filter('fluent_cart/block_editor_unregister_all_patterns', function ($shouldUnregister, $context, $data) {
    // Retain default WordPress block patterns in the editor
    return false;
}, 10, 3);
```
