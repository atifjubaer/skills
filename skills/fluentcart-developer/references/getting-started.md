# FluentCart Developer Guide

FluentCart Core Complete Guide

Welcome to the complete developer guide for **FluentCart** - the self-hosted e-commerce plugin for WordPress. This comprehensive guide will take you from understanding the basics to building sophisticated integrations and custom functionality.

## What is FluentCart?

FluentCart is a **Self-Hosted E-commerce Plugin** for WordPress that helps businesses manage their online stores, process payments, handle orders, and manage customers. Unlike cloud-based solutions, FluentCart runs entirely on your WordPress site, ensuring data privacy, unlimited products, and no monthly fees.

## Why Extend FluentCart?

FluentCart is designed to be highly extensible, allowing developers to customize and extend its functionality far beyond what the plugin offers out-of-the-box. Whether you're a business owner looking to customize your store or a developer hired to create specific integrations, FluentCart provides the tools you need.

### 🔧 **Built for Customization**

- **Extensive hook system** - over 750 action and filter hooks; see the [Action](/hooks/actions.md) and [Filter](/hooks/filters.md) references
- **Modular architecture** - Clean separation allows safe modifications and additions
- **RESTful API** - Complete programmatic access to all e-commerce data and functions
- **WordPress-native** - Follows WordPress coding standards and best practices

### 🏗️ **Flexible Extension Points**

- **Custom payment gateways** - Integrate with any payment processor
- **Third-party integrations** - Connect with external services and platforms
- **Custom modules** - Add specialized functionality and features
- **API extensions** - Build custom endpoints for mobile apps or external systems

### 💼 **Business Benefits**

- **No vendor lock-in** - Your customizations stay with you, not dependent on external services
- **Unlimited scalability** - Extend functionality as your business needs grow
- **Cost-effective** - One-time development instead of ongoing SaaS fees
- **Complete control** - Modify any aspect to match your specific business processes

## FluentCart Versions

### FluentCart Core (Free)

The free version includes powerful core functionalities:

- ✅ **Product Management** - Unlimited products and variations
- ✅ **Order Processing** - Complete order management system
- ✅ **Customer Management** - Customer accounts and profiles
- ✅ **Payment Processing** - Multiple payment gateway support
- ✅ **Shipping Management** - Flexible shipping options
- ✅ **Coupon System** - Discount and promotional codes
- ✅ **Subscriptions** - Recurring billing, including store-managed renewals
- ✅ **Tax** - Tax classes, rates and EU VAT handling
- ✅ **Reporting** - Sales, product, customer and subscription reports
- ✅ **Product Reviews** - Review collection and display
- ✅ **Multi-Currency engine** - Currency settings and rate storage
- ✅ **MCP** - Model Context Protocol abilities for AI tooling
- ✅ **Developer API** - Full access to hooks and REST API

### FluentCart Pro (Premium)

The premium version adds advanced e-commerce features:

- 🚀 **Licensing System** - Software license management
- 🚀 **Order Bumps** - Upselling and promotional offers
- 🚀 **Roles & Permissions** - Advanced user role management
- 🚀 **Dynamic Pricing** - Rule-based pricing and discounts
- 🚀 **Inline Checkout** - On-page checkout
- 🚀 **Advanced Inventory** - Stock adjustments and inventory history
- 🚀 **Saved Payment Methods** - Stored cards for repeat purchases
- 🚀 **Data & Accounting Export** - Order, customer, licence and OSS exports
- 🚀 **Advanced Filters** - Extended filtering across admin lists
- 🚀 **Multi-Currency storefront** - Customer-facing currency switching on top of the free engine
- 🚀 **Paddle, Mollie and Authorize.Net** - Additional payment gateways
- 🚀 **Advanced Integrations** - Deep third-party integrations

Subscriptions, Tax, Reporting, Reviews and MCP are **free** modules. Reviews, MCP and Multi-Currency ship a free engine that Pro extends, rather than being Pro-only.

## Core Development Concepts

### 📊 **Data Architecture**

FluentCart follows WordPress conventions with a clean, normalized database structure:

**Core Tables & Relationships:**

- **🛒 Orders** (`fct_orders`) - Central hub for all order data Stores order information, status, customer details
- Links to all order items, transactions, and metadata

**👥 Customers** (`fct_customers`) - Customer management

- Customer profiles, addresses, order history
- Integration with WordPress users

**📦 Products** (WordPress `posts` table) - Product catalog

- Product information stored as WordPress custom post type
- Additional details in `fct_product_details` and `fct_product_variations`

**💳 Transactions** (`fct_order_transactions`) - Payment processing

- Payment records, refunds, transaction history
- Integration with payment gateways

**📋 Subscriptions** (`fct_subscriptions`) - Recurring billing

- Subscription management and renewals
- Automated billing workflows

### 🔄 **E-commerce Workflow**

The three-component e-commerce system:

1. **Products** - Catalog management and inventory tracking
2. **Orders** - Order processing and fulfillment
3. **Payments** - Payment processing and transaction management

### 🔌 **Extension Points**

Multiple ways to extend FluentCart:

- **WordPress Hooks** - 315+ actions and filters for custom functionality
- **REST API** - Complete programmatic access to all features
- **Module System** - Add new payment gateways, shipping methods, and features
- **Custom Fields** - Extend products, orders, and customers with custom data
- **Template System** - Customize frontend templates and layouts

## Directory Structure

Understanding FluentCart's organized codebase:

```
fluent-cart/
├── app/                    # Core application logic
│   ├── Hooks/             # WordPress action/filter handlers
│   │   ├── Handlers/      # Hook handlers
│   │   ├── actions.php    # Action hooks
│   │   └── filters.php    # Filter hooks
│   ├── Http/              # Request handling and routing
│   │   ├── Controllers/   # API and admin controllers
│   │   ├── Policies/      # Route permission policies
│   │   ├── Requests/      # FormRequest validation / sanitisation
│   │   ├── Rules/         # Custom validation rules
│   │   └── Routes/        # API route definitions
│   ├── Models/            # Database models (37 models + Model and DynamicModel bases)
│   │   ├── Order.php      # Order model
│   │   ├── Customer.php   # Customer model
│   │   ├── Product.php    # Product model
│   │   └── ...           # Additional models
│   ├── Services/          # Business logic and services
│   │   ├── Payments/     # Payment processing services
│   │   ├── Renderer/     # Storefront rendering
│   │   └── Tax/          # Tax calculation services
│   ├── Helpers/          # Helper.php and other helper utilities
│   ├── Views/            # PHP template files
│   ├── Events/           # Event system
│   ├── Listeners/        # Event listeners
│   └── Modules/          # Module system
│
├── api/                   # REST API endpoints and utilities
│   ├── Orders.php        # Order management API
│   ├── Customers.php     # Customer management API
│   ├── StoreSettings.php # Store settings API
│   ├── Checkout/         # Checkout API
│   ├── Resource/         # API resource classes
│   └── ...              # Additional API endpoints
│
├── resources/           # Frontend assets and templates
│   ├── admin/          # Admin interface (Vue.js) + Gutenberg blocks (React)
│   │   ├── Pages/      # Vue page components
│   │   ├── Modules/    # Feature modules
│   │   ├── shared/     # Shared module API and utilities
│   │   └── BlockEditor/# React Gutenberg blocks
│   ├── public/         # Public-facing components
│   │   ├── cart/       # Cart functionality
│   │   ├── checkout/   # Checkout process
│   │   └── customer-profile/ # Customer interface
│   ├── styles/         # SCSS stylesheets
│   └── images/         # Image resources
│
├── boot/                # Plugin initialization
├── config/              # Configuration files
├── database/            # Database migrations and schema
│   ├── Migrations/      # Database migration files (39 files)
│   ├── Seeder/         # Database seeders
│   └── DBMigrator.php  # Migration handler
│
├── dev/                 # Development tools and testing
│   ├── cli/            # CLI commands
│   ├── wp-browser/     # wp-browser test suite
│   ├── factories/      # Model factories
│   └── seeds/          # Seed data
│
└── fluent-cart.php     # Plugin entry point
```

## Development Environment Setup

### Prerequisites

- **WordPress 6.7+** - the plugin header requires it; tested up to 7.1
- **PHP 7.4+** - Recent PHP version with required extensions
- **MySQL or MariaDB with InnoDB** - FluentCart's tables are InnoDB. The plugin does not check a MySQL version, so no specific minimum is enforced
- **Basic WordPress Development** - Understanding of hooks, plugins, and themes

### Development Tools

- **Code Editor** - VS Code, PhpStorm, or your preferred editor
- **Local Environment** - Laravel Herd, XAMPP, WAMP, or Docker
- **Version Control** - Git for tracking changes (optional but recommended)
- **API Testing** - Postman or Insomnia for REST API development

### Getting Started Checklist

1. **📖 Read the Fundamentals**[ ] Understand the database schema
2. [ ] Review core models
3. [ ] Explore global functions
4. **🔍 Explore the Hooks**[ ] Browse action hooks
5. [ ] Study filter hooks
6. [ ] Try event system
7. **🏗️ Build Your First Extension**[ ] Create a custom payment gateway
8. [ ] Build a custom shipping method
9. [ ] Add a custom module
10. **🌐 API Integration**[ ] Set up REST API access
11. [ ] Test order management
12. [ ] Explore webhook integration

## Quick Start Guide

### 1. Database & Models

Start by understanding FluentCart's data structure:

- [Database Schema](/database/schema.md) - Complete table structure
- [Core Models](/database/models.md) - Order, Customer, Product models
- [Model Relationships](/database/models/relationships.md) - How data connects

### 2. Developer Hooks

Learn how to extend FluentCart functionality:

- [Action Hooks](/hooks/actions.md) - Trigger custom code on events
- [Filter Hooks](/hooks/filters.md) - Modify data and behavior

## Community & Support

### 📚 **Learning Resources**

- **[Official Documentation](https://docs.fluentcart.com)** - Complete user and developer reference

### 💬 **Community**

- **[Official Support](https://fluentcart.com/account)** - Technical support
