# FluentCart Core Complete Developer Guide

> Source: Official FluentCart Developer Guide Documentation

Welcome to the complete developer guide for **FluentCart** — the self-hosted e-commerce plugin for WordPress. This guide covers core principles, architecture, extension points, codebase structure, and quick start instructions for developing custom add-ons, modules, and integrations.

---

## 🚀 Overview

### What is FluentCart?
FluentCart is a **Self-Hosted E-commerce Plugin for WordPress** that helps businesses manage online stores, process payments, handle orders, and manage customers natively inside WordPress. 

Unlike cloud-based SaaS solutions, FluentCart runs entirely on your WordPress site, ensuring total data privacy, unlimited products, zero order transaction surcharges, and complete operational control.

### Why Extend FluentCart?
FluentCart is engineered from the ground up for deep extensibility:

- **315+ Action and Filter Hooks** for intercepting and customizing core execution flows.
- **Modular Architecture** allowing clean separation of payment gateways, shipping methods, and custom modules.
- **RESTful API** offering complete programmatic access to e-commerce resources.
- **WordPress-Native Standards** following modern PHP, PSR coding standards, and WordPress conventions.

---

## 📦 FluentCart Core vs. Pro Version Comparison

| Feature Category | Core (Free Version) | Pro (Premium Version) |
|---|---|---|
| **Product & Catalog** | Unlimited products, simple & variable pricing | Advanced variations & ghost products |
| **Order Processing** | Complete order management & receipts | Automated post-order workflows & order operation logs |
| **Customer Management** | Customer profiles, LTV tracking & addresses | Custom customer meta, advanced segmentation |
| **Payments & Shipping** | Core payment gateways & shipping zones | Dynamic shipping carriers, custom payment integrations |
| **Coupons & Discounts** | Standard discount codes & conditions | Stackable coupons, auto-applied promos & Order Bumps |
| **Software Licensing** | N/A | Full software license keys, site activations & updates |
| **Subscriptions** | N/A | Recurring billing cycles, trial periods & grace periods |
| **Roles & Permissions** | Basic WordPress capability checks | Granular team roles & permission management |

---

## 🏗 Core Development Concepts

### 1. Data Architecture
FluentCart uses a clean, normalized database structure with integer monetary values stored in **cents**:

- **Orders (`fct_orders`):** Central record for order status, customer links, totals, and payment status.
- **Customers (`fct_customers`):** Profiles linked to WordPress users or guest transactions.
- **Products (WordPress Posts):** Core product metadata stored as custom post types, supplemented by `fct_product_details` and `fct_product_variations`.
- **Transactions (`fct_order_transactions`):** Payment charges, refunds, and gateway interaction records.
- **Subscriptions (`fct_subscriptions`):** Recurring billing metadata, billing cycles, and next billing schedules.

### 2. Extension Points
- **WordPress Action Hooks:** Execute custom code on events (e.g. `fluent_cart/order_paid_done`).
- **WordPress Filter Hooks:** Modify data in-flight (e.g. `fluent_cart/fee_items`).
- **Module System:** Register custom payment gateways, shipping carriers, and storage drivers.
- **REST API:** Build external applications, dashboards, or headless checkout experiences.

---

## 📁 Application Codebase Directory Structure

```
fluent-cart/
├── app/                    # Core application logic
│   ├── Hooks/             # WordPress action/filter handlers
│   │   ├── Handlers/      # Action/Filter handler classes
│   │   ├── actions.php    # Action hook definitions
│   │   └── filters.php    # Filter hook definitions
│   ├── Http/              # HTTP layer
│   │   ├── Controllers/   # Admin & REST API controllers
│   │   ├── Middleware/    # Request authentication & authorization
│   │   └── Routes/        # API and admin route definitions
│   ├── Models/            # Eloquent ORM database models (45+ models)
│   │   ├── Order.php      # Order model
│   │   ├── Customer.php   # Customer model
│   │   ├── Product.php    # Product model
│   │   └── ...            # Core & Pro model files
│   ├── Services/          # Core business logic services
│   │   ├── Payment/       # Payment processing drivers
│   │   ├── Shipping/      # Shipping calculation engines
│   │   └── Helper.php     # Global helper utility functions
│   ├── Views/             # Admin PHP template views
│   ├── Events/            # Internal application events
│   ├── Listeners/         # Event listeners
│   └── Modules/           # Module registration system
│
├── api/                   # REST API resources & endpoint controllers
│   ├── Orders.php         # Order management REST endpoints
│   ├── Customers.php      # Customer management REST endpoints
│   ├── Products.php       # Product catalog REST endpoints
│   └── Resource/          # JSON response resource transformers
│
├── resources/             # Frontend application assets
│   ├── admin/             # Vue.js admin single-page application & Gutenberg blocks
│   ├── public/            # Storefront cart, checkout & portal components
│   └── styles/            # Core SCSS/CSS design tokens
│
├── database/              # Database schema migrations & seeders
│   ├── Migrations/        # Table migration files (34+ migrations)
│   └── DBMigrator.php     # Database migration manager
│
└── fluent-cart.php        # Main WordPress plugin bootstrap entry file
```

---

## ⚡ Quick Start Extension Blueprints

### 1. Registering a Custom Extension
```php
<?php
/**
 * Plugin Name: FluentCart Custom Extension
 * Description: Extension module for FluentCart e-commerce.
 * Version:     1.0.0
 * Author:      Developer
 */

if (!defined('ABSPATH')) {
    exit; // Prevent direct execution access
}

// Attach listener to WordPress plugins_loaded hook
add_action('plugins_loaded', function () {
    // Verify that FluentCart plugin is active
    if (!defined('FLUENT_CART')) {
        return; // Exit early if FluentCart is missing
    }

    // Initialize custom hook listeners and extension modules here
});
```

### 2. Post-Payment Asynchronous Task Listener
```php
// Intercept order paid event asynchronously via Action Scheduler
add_action('fluent_cart/order_paid_done', function ($payload) {
    // Extract Order model instance from payload array
    $order = $payload['order'];
    
    // Extract Customer model instance from payload array
    $customer = $payload['customer'];

    // Convert total order amount from integer cents to decimal format
    $orderTotal = \FluentCart\App\Helpers\Helper::toDecimal($order->total_amount);

    // Log payment details into FluentCart system activity log
    fluent_cart_add_log(
        'Order Completed',
        "Order #{$order->id} for {$customer->email} completed. Amount: ${orderTotal}",
        'info'
    );
}, 10, 1);
```
