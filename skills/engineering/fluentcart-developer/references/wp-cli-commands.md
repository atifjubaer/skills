# WP-CLI Commands Reference

FluentCart integrates WP-CLI commands to manage migrations, imports, caching, and maintenance tasks directly from the command line.

---

## 1. Core WP-CLI Commands List

All commands are nested under the `fluent-cart` namespace.

### Data Migrations

#### `wp fluent-cart migrate`
Runs outstanding database schema migrations.
- **Usage:**
  ```bash
  wp fluent-cart migrate
  ```
- **Options:**
  - `--force` : Force migration run even if the system reports schema is up-to-date.

---

### Product Imports

#### `wp fluent-cart product import`
Imports products in bulk via CSV files.
- **Usage:**
  ```bash
  wp fluent-cart product import <file-path>
  ```
- **Arguments:**
  - `<file-path>` : Absolute local file path to the product csv file.
- **Options:**
  - `--delimiter=<char>` : CSV field delimiter (default: `,`).
  - `--update-existing`  : Overwrites product attributes if the SKU matches.

---

### Diagnostics & Cache

#### `wp fluent-cart cache clear`
Flush internal configuration and transients cache variables.
- **Usage:**
  ```bash
  wp fluent-cart cache clear
  ```

#### `wp fluent-cart check-requirements`
Performs validation audits on PHP versions, active WordPress settings, and database compatibility.
- **Usage:**
  ```bash
  wp fluent-cart check-requirements
  ```

---

## 2. Registering Custom WP-CLI Commands in PHP

To add custom CLI commands, hook into the `cli_init` action.

```php
// Register custom CLI commands if WP-CLI is active on execution environment
if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command('fluent-cart my-custom-command', 'my_plugin_wp_cli_handler');
}

/**
 * Handle custom WP-CLI command.
 *
 * @param array $args Positional arguments
 * @param array $assocArgs Associative options/flags
 * @return void
 */
function my_plugin_wp_cli_handler($args, $assocArgs) {
    WP_CLI::log(__('Starting custom plugin task...', 'my-custom-plugin'));

    // Perform operations (e.g. sync external database orders)
    WP_CLI::success(__('Task completed successfully!', 'my-custom-plugin'));
}
```
