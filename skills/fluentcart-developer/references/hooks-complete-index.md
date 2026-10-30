<!--
Source:    https://dev.fluentcart.com/hooks/actions  and  https://dev.fluentcart.com/hooks/filters
Retrieved: 2026-10-30
Generated: scripts/gen-hook-index.mjs — do not edit by hand; re-run the generator
-->

# FluentCart Hook Index (complete)

Every hook published in the FluentCart developer docs: **680 hooks** across 18 pages, including the module and Pro-module hooks that have no per-topic reference file and the deprecated names that still fire.

This is the lookup table, not the manual. 410 of these hooks have a full write-up — parameter arrays, payload shapes and worked examples — in the per-topic files, and the entry below links to it. The rest are documented here by name, purpose and source file; open the plugin source at that path for the exact payload.

> Amounts are integer minor units (cents). `Helper::toDecimal($amount)` converts for display.

## Action Hooks — Admin & Templates

Full parameters and examples: [action-hooks-admin-templates.md](action-hooks-admin-templates.md) · [source](https://dev.fluentcart.com/hooks/actions/admin-and-templates.html)

- **`fluent_cart/init`** — FluentCart fully initialised on WP init *(`boot/app.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/admin_menu`** — Render admin navigation menu *(`app/CPT/FluentProducts.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/admin_submenu_added`** — After all admin submenus registered *(`app/Hooks/Handlers/MenuHandler.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/loading_app`** — Admin Vue SPA assets about to be enqueued *(`app/Hooks/Handlers/MenuHandler.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/after_migrate`** — After pending database migrations have run *(`database/DBMigrator.php:134`)*
- **`fluent_cart/admin_js_loaded`** — After all admin JS enqueued and localised *(`app/Hooks/Handlers/MenuHandler.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/module/deactivated/{$moduleKey}`** — Module deactivated (dynamic) *(`app/Http/Controllers/ModuleSettingsController.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/module/activated/{$moduleKey}`** — Module activated (dynamic) *(`app/Http/Controllers/ModuleSettingsController.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart_block_editor/head`** — Pro — In <head> *(`app/Hooks/Handlers/FluentCartBlockEditorHandler.php`)*
- **`fluent_cart/block_editor_head`** — Pro — Second head hook in block editor page *(`app/Hooks/Handlers/FluentCartBlockEditorHandler.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/new_block_editor_footer`** — Pro — Footer of custom block editor page (for JS) *(`app/Hooks/Handlers/FluentCartBlockEditorHandler.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/block_editor/enqueue_assets`** — Pro — After email editor block assets enqueued *(`app/Hooks/Handlers/FluentCartBlockEditorHandler.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/block_editor/render_block`** — Pro — Render unknown block types in email parser *(`app/Services/Email/FluentBlockParser.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/render_custom_form_field`** — Unrecognised form field type fallback *(`app/Services/Renderer/FormFieldRenderer.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/generic_template/rendering`** — Start of generic fallback template *(`app/Modules/Templating/fallback-generic-template.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/generic_template/before_content`** — After get_header() *(`app/Modules/Templating/fallback-generic-template.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/template/before_content`** — Inside main wrapper, before content *(`app/Modules/Templating/fallback-generic-template.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/template/main_content`** — Main content area *(`app/Modules/Templating/fallback-generic-template.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/template/after_content`** — After main content *(`app/Modules/Templating/fallback-generic-template.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/generic_template/after_content`** — After main wrapper, before get_footer() *(`app/Modules/Templating/fallback-generic-template.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/views/checkout_page_cart_item_list`** — Render cart item list on checkout *(`app/Http/Controllers/CheckoutController.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/views/checkout_page_registration_form`** — Render registration form on checkout *(`app/Hooks/Handlers/ShortCodes/CustomerRegistrationHandler.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/views/checkout_page_login_form`** — Render login form on checkout *(`app/Hooks/Handlers/ShortCodes/CustomerLoginHandler.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/views/checkout_order_summary`** — Render order summary (email shortcodes) *(`app/Services/ShortCodeParser/ShortcodeParser.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/views/checkout_order_receipt`** — Render full order receipt (email shortcodes) *(`app/Services/ShortCodeParser/ShortcodeParser.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/views/checkout_page_shipping_method_list`** — Render shipping method list *(`app/Modules/Shipping/Http/Controllers/Frontend/ShippingFrontendController.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/views/checkout_page_form_address_info_wrapper`** — Render address info card *(`app/Http/Controllers/FrontendControllers/CustomerController.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/bricks/rendering_ajax_collection`** — Before a Bricks AJAX product collection loop renders *(`app/Modules/Templating/Bricks/BricksLoader.php:187`)*
- **`fluent_cart/data_backfills/chunk_selected`** — A chunk of rows has been selected for a backfill, before the write *(`database/DataBackfills.php:569`)*
- **`fluent_cart/email_notification_updated`** — After an email notification's settings are saved *(`app/Http/Controllers/EmailNotificationController.php:95`)*
- **`fluent_cart/store_digest/send`** — Trigger the store performance digest email to be sent *(`app/Hooks/Scheduler/AutoSchedules/HourlyScheduler.php:19`)*
- **`fluent_cart/policy/store_sensitive_request`** — Store-sensitive API request verification *(`app/Http/Policies/StoreSensitivePolicy.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)
- **`fluent_cart/policy/store_settings_request`** — Store-settings API request verification *(`app/Http/Policies/StoreSettingsPolicy.php`)* → [action-hooks-admin-templates.md](action-hooks-admin-templates.md)

## Action Hooks — Cart & Checkout

Full parameters and examples: [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md) · [source](https://dev.fluentcart.com/hooks/actions/cart-and-checkout.html)

- **`fluent_cart/cart/item_added`** — Fired after an item is added to the cart *(`app/Models/Cart.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/cart/item_removed`** — Fired after an item is removed from the cart *(`app/Models/Cart.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/cart/cart_data_items_updated`** — General-purpose hook for any cart data change *(`app/Models/Cart.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/cart_completed`** — Fired when a cart is marked as completed after payment *(`app/Helpers/StatusHelper.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/cart/before_totals_calculation`** — Before the cart's grand total is recalculated *(`app/Models/Cart.php:1194`)*
- **`fluent_cart/cart/after_totals_calculation`** — After the cart's grand total has been recalculated *(`app/Models/Cart.php:1244`)*
- **`fluent_cart/order/after_items_calculated`** — After the draft order's items/totals are calculated *(`api/Checkout/CheckoutApi.php:269`)*
- **`fluent_cart/checkout/prepare_other_data`** — After order creation, before finalizing *(`api/Checkout/CheckoutApi.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/checkout/cart_amount_updated`** — Fired when the cart total may have changed *(`app/Models/Cart.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/checkout/shipping_data_changed`** — Fired when shipping data changes *(`app/Helpers/CartHelper.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/checkout/form_data_changed`** — Fired when checkout form data changes *(`app/Hooks/Cart/WebCheckoutHandler.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/checkout/customer_data_saved`** — Removed in 1.4.0 — no longer fired *(`app/Hooks/Cart/WebCheckoutHandler.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/tax/reverse_charge_applied`** — Fired when the EU VAT reverse charge is applied to the cart *(`app/Modules/Tax/TaxModule.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/tax/reverse_charge_removed`** — Fired when the EU VAT reverse charge is removed from the cart *(`app/Modules/Tax/TaxModule.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/before_checkout_page_start`** — Before the checkout page wrapper div *(`app/Services/Renderer/CheckoutRenderer.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/after_checkout_page_start`** — After the checkout page wrapper div opens *(`app/Services/Renderer/CheckoutRenderer.php:154`)*
- **`fluent_cart/before_checkout_form`** — Before the checkout form element *(`app/Services/Renderer/CheckoutRenderer.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/checkout_form_opening`** — Right after the checkout form tag opens *(`app/Services/Renderer/CheckoutRenderer.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/before_billing_fields`** — Before billing address fields *(`app/Services/Renderer/CheckoutRenderer.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/before_billing_fields_section`** — Before the billing address field section renders *(`app/Services/Renderer/CheckoutRenderer.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/after_billing_fields_section`** — After the billing address field section *(`app/Services/Renderer/CheckoutRenderer.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/checkout/b2b_extra_fields`** — Inside the billing fields area, for custom B2B fields *(`app/Services/Renderer/CheckoutRenderer.php:419`)*
- **`fluent_cart/before_shipping_fields_section`** — Before the shipping address field section *(`app/Services/Renderer/CheckoutRenderer.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/after_shipping_fields_section`** — After the shipping address field section *(`app/Services/Renderer/CheckoutRenderer.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/before_payment_methods`** — Before payment method options *(`app/Services/Renderer/CheckoutRenderer.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/after_payment_methods`** — After payment method options *(`app/Services/Renderer/CheckoutRenderer.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/checkout_embed_payment_method_content`** — Inside each embedded payment method's container div *(`app/Services/Renderer/ModalCheckoutRenderer.php:819`)*
- **`fluent_cart/after_checkout_button`** — After the checkout submit button *(`app/Services/Renderer/CheckoutRenderer.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/after_order_notes`** — After the order notes section in the summary sidebar *(`app/Services/Renderer/CheckoutRenderer.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/after_order_notes_field`** — After the order notes form field *(`app/Services/Renderer/CheckoutRenderer.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/after_checkout_form`** — After the checkout form closes *(`app/Services/Renderer/CheckoutRenderer.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/before_checkout_page_close`** — Before the checkout page wrapper div closes *(`app/Services/Renderer/CheckoutRenderer.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/after_checkout_page`** — After the entire checkout page wrapper *(`app/Services/Renderer/CheckoutRenderer.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/checkout/before_summary_total`** — Before the total line in the cart summary *(`app/Services/Renderer/CartSummaryRender.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/cart/line_item/line_meta`** — After line item content, for custom metadata *(`app/Services/Renderer/CartItemRenderer.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/cart/line_item/before_total`** — Before the line item price/total *(`app/Services/Renderer/CartItemRenderer.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/cart/line_item/after_total`** — After the line item price/total *(`app/Services/Renderer/CartItemRenderer.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/cart/line_item/before_main_title`** — Before the product title in a line item *(`app/Services/Renderer/CartItemRenderer.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/cart/line_item/after_main_title`** — After the product title in a line item *(`app/Services/Renderer/CartItemRenderer.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/cart/line_item/footer_start`** — Start of the line item footer area *(`app/Services/Renderer/ModalCheckoutRenderer.php:326`)*
- **`fluent_cart/cart/line_item/unit_price_hint`** — After the "$X each" unit price text *(`app/Services/Renderer/ModalCheckoutRenderer.php:404`)*
- **`fluent_cart/cart/line_item/setup_fee_price_info`** — After a line item's setup fee amount *(`app/Services/Renderer/CartItemRenderer.php:255`)*
- **`fluent_cart/cart/line_item/after_setup_fee_info`** — After the entire setup fee block *(`app/Services/Renderer/CartItemRenderer.php:97`)*
- **`fluent_cart/cart/line_item/footer_end`** — End of the line item footer area *(`app/Services/Renderer/CartItemRenderer.php:99`)*
- **`fluent_cart/modal_checkout/after_shipping_methods`** — After the shipping methods list in the modal checkout *(`app/Services/Renderer/ModalCheckoutRenderer.php:253`)*
- **`fluent_cart/receipt/thank_you/before_header`** — Before the thank-you page header *(`app/Services/Renderer/Receipt/ThankYouRender.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/receipt/thank_you/after_header`** — After the thank-you page header *(`app/Services/Renderer/Receipt/ThankYouRender.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/receipt/thank_you/after_header_title`** — After the header title text *(`app/Services/Renderer/Receipt/ThankYouRender.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/receipt/thank_you/before_body`** — Before the thank-you page body *(`app/Services/Renderer/Receipt/ThankYouRender.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/receipt/thank_you/after_body`** — After the thank-you page body *(`app/Services/Renderer/Receipt/ThankYouRender.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/receipt/thank_you/before_order_header`** — Before the order header in the receipt body *(`app/Services/Renderer/Receipt/ThankYouRender.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/receipt/thank_you/after_order_header`** — After the order header in the receipt body *(`app/Services/Renderer/Receipt/ThankYouRender.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/receipt/thank_you/before_order_items`** — Before the order items list in the receipt *(`app/Services/Renderer/Receipt/ThankYouRender.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/receipt/thank_you/after_order_items`** — After the order items list in the receipt *(`app/Services/Renderer/Receipt/ThankYouRender.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/receipt/thank_you/before_footer_buttons`** — Before the footer buttons *(`app/Services/Renderer/Receipt/ThankYouRender.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/receipt/thank_you/after_footer_buttons`** — After the footer buttons *(`app/Services/Renderer/Receipt/ThankYouRender.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/after_receipt`** — After the entire receipt/thank-you page *(`app/Services/Renderer/Receipt/ThankYouRender.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/after_receipt_first_time`** — Only on the first receipt view (for conversion tracking) *(`app/Services/Renderer/Receipt/ThankYouRender.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/before_render_redirect_page`** — Before the payment redirect/receipt page renders *(`app/Hooks/Handlers/ShortCodes/ReceiptHandler.php`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)

## Action Hooks — Customers & Users

Full parameters and examples: [action-hooks-customers-users.md](action-hooks-customers-users.md) · [source](https://dev.fluentcart.com/hooks/actions/customers-and-users.html)

- **`fluent_cart/customer_status_to_{$newStatus}`** — Fired when a customer's status changes to a specific status *(`app/Models/Customer.php`)* → [action-hooks-customers-users.md](action-hooks-customers-users.md)
- **`fluent_cart/customer_status_updated`** — Fired on any customer status change *(`app/Models/Customer.php`)* → [action-hooks-customers-users.md](action-hooks-customers-users.md)
- **`fluent_cart/customer_email_changed`** — Fired when a customer's email is updated via WordPress profile *(`app/Hooks/Handlers/UserHandler.php`)* → [action-hooks-customers-users.md](action-hooks-customers-users.md)
- **`fluent_cart/customer_resources_moved`** — Fired after all resources are moved between customers *(`app/Hooks/Handlers/UserHandler.php`)* → [action-hooks-customers-users.md](action-hooks-customers-users.md)
- **`fluent_cart/user/before_registration`** — Fired before a new WordPress user is created during FluentCart registration *(`api/User.php`)* → [action-hooks-customers-users.md](action-hooks-customers-users.md)
- **`fluent_cart/user/after_register`** — Fired after a new WordPress user is created during checkout registration *(`app/Services/AuthService.php`)* → [action-hooks-customers-users.md](action-hooks-customers-users.md)
- **`fluent_cart/customer_menu`** — Renders the customer dashboard navigation menu *(`app/Views/frontend/customer_app.php`)* → [action-hooks-customers-users.md](action-hooks-customers-users.md)
- **`fluent_cart/customer_app`** — Renders the customer dashboard main content area *(`app/Views/frontend/customer_app.php`)* → [action-hooks-customers-users.md](action-hooks-customers-users.md)
- **`fluent_cart/customer_dashboard/enqueue_assets`** — Customer dashboard assets are about to load *(`app/Modules/Templating/AssetLoader.php:360`)*

## Action Hooks — Licenses

Full parameters and examples: [action-hooks-licenses.md](action-hooks-licenses.md) · [source](https://dev.fluentcart.com/hooks/actions/licenses.html)

- **`fluent_cart_sl/license_status_updated`** — Pro — Fires on any license status change *(`fluent-cart-pro/app/Modules/Licensing/Models/License.php:227`)*
- **`fluent_cart_sl/license_status_updated_to_{$newStatus}`** — Pro — Fires when a license transitions to a specific status *(`fluent-cart-pro/app/Modules/Licensing/Models/License.php:232`)*
- **`fluent_cart_sl/license_activation_status_updated`** — Pro — Fires on any license activation status change *(`fluent-cart-pro/app/Modules/Licensing/Models/LicenseActivation.php:52`)*
- **`fluent_cart_sl/license_activation_status_updated_to_{$newStatus}`** — Pro — Fires when a license activation transitions to a specific status *(`fluent-cart-pro/app/Modules/Licensing/Models/LicenseActivation.php:57`)*
- **`fluent_cart_sl/license_limit_increased`** — Pro — Fires when the license activation count is increased *(`fluent-cart-pro/app/Modules/Licensing/Models/License.php:224`)*
- **`fluent_cart_sl/license_limit_decreased`** — Pro — Fires when the license activation count is decreased *(`fluent-cart-pro/app/Modules/Licensing/Models/License.php:260`)*
- **`fluent_cart_sl/license_limit_increased`** — Pro — Fires when the license activation limit (slots) is increased *(`fluent-cart-pro/app/Modules/Licensing/Models/License.php:259`)*
- **`fluent_cart_sl/license_key_regenerated`** — Pro — Fires when a license key is regenerated *(`fluent-cart-pro/app/Modules/Licensing/Models/License.php:352`)*
- **`fluent_cart_sl/license_validity_extended`** — Pro — Fires when a license expiration date is changed *(`fluent-cart-pro/app/Modules/Licensing/Models/License.php:382`)*
- **`fluent_cart/licensing/license_issued`** — Pro — Fires when a new license is created for an order *(`fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseGenerationHandler.php:566`)* → [action-hooks-licenses.md](action-hooks-licenses.md)
- **`fluent_cart_sl/license_issued`** — Pro — Fires when a license is issued via the license manager *(`fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php:261`)*
- **`fluent_cart/licensing/license_renewed`** — Pro — Fires when a license expiration is extended on subscription renewal *(`fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseGenerationHandler.php:231`)* → [action-hooks-licenses.md](action-hooks-licenses.md)
- **`fluent_cart/licensing/license_expired`** — Pro — Fires when a license expires due to subscription cancellation or scheduler *(`fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseGenerationHandler.php:267`)* → [action-hooks-licenses.md](action-hooks-licenses.md)
- **`fluent_cart/licensing/license_disabled`** — Pro — Fires when a license is disabled due to payment failure or refund *(`fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseGenerationHandler.php:158`)* → [action-hooks-licenses.md](action-hooks-licenses.md)
- **`fluent_cart/licensing/extended_to_lifetime`** — Pro — Fires when a license is extended to lifetime on subscription end-of-term *(`fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseGenerationHandler.php:302`)* → [action-hooks-licenses.md](action-hooks-licenses.md)
- **`fluent_cart/licensing/license_upgraded`** — Pro — Fires when a license is upgraded to a new plan *(`fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseGenerationHandler.php:378`)* → [action-hooks-licenses.md](action-hooks-licenses.md)
- **`fluent_cart_sl/license_deleted`** — Pro — Fires when a license is deleted from the admin interface *(`fluent-cart-pro/app/Modules/Licensing/Http/Controllers/LicenseController.php:255`)*
- **`fluent_cart/licensing/license_deleted`** — Pro — Fires when a license is deleted because its parent order was deleted *(`fluent-cart-pro/app/Modules/Licensing/Hooks/license-actions.php:141`)* → [action-hooks-licenses.md](action-hooks-licenses.md)
- **`fluent_cart/license/site_activated`** — Pro — Fires when a site is activated for a license via the public API *(`fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseApiHandler.php:265`)* → [action-hooks-licenses.md](action-hooks-licenses.md)
- **`fluent_cart/license/site_deactivated`** — Pro — Fires when a site is deactivated via the public API *(`fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseApiHandler.php:354`)* → [action-hooks-licenses.md](action-hooks-licenses.md)
- **`fluent_cart/license/site_deactivated_failed`** — Pro — Fires when a site deactivation attempt fails *(`fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseApiHandler.php:295,309,321`)* → [action-hooks-licenses.md](action-hooks-licenses.md)
- **`fluent_cart_sl/site_activated`** — Pro — Fires when a site is activated via the local API method *(`fluent-cart-pro/app/Modules/Licensing/Concerns/CanManageLicenseSites.php:84`)*
- **`fluent_cart_sl/site_license_deactivated`** — Pro — Fires when a license is deactivated from a site (admin or customer) *(`fluent-cart-pro/app/Modules/Licensing/Concerns/CanManageLicenseSites.php:141,177`)*
- **`fluent_cart_sl/before_deleting_licenses`** — Pro — Fires before licenses are bulk deleted by order *(`fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php:232`)*
- **`fluent_cart_sl/after_deleting_licenses`** — Pro — Fires after licenses are bulk deleted *(`fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php:237`)*
- **`fluent_cart_sl/before_updating_licenses_status`** — Pro — Fires before a bulk license status update *(`fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php:285`)*
- **`fluent_cart_sl/before_updating_licenses_status_to_disabled`** — Pro — Fires before licenses are bulk disabled *(`fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php:286`)*
- **`fluent_cart_sl/after_updating_licenses_status`** — Pro — Fires after a bulk license status update *(`fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php:290`)*
- **`fluent_cart_sl/after_updating_licenses_status_to_disabled`** — Pro — Fires after licenses are bulk disabled *(`fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php:291`)*

## Action Hooks — Orders

Full parameters and examples: [action-hooks-orders.md](action-hooks-orders.md) · [source](https://dev.fluentcart.com/hooks/actions/orders.html)

- **`fluent_cart/order_status_changed_to_{$newStatus}`** — Fires when the order status changes to a specific status *(`app/Events/Order/OrderStatusUpdated.php`)* → [action-hooks-orders.md](action-hooks-orders.md)
- **`fluent_cart/order_status_changed`** — Fires on any order status change *(`app/Events/Order/OrderStatusUpdated.php`)* → [action-hooks-orders.md](action-hooks-orders.md)
- **`fluent_cart/payment_status_changed_to_{$newStatus}`** — Fires when payment status changes to a specific status *(`app/Events/Order/OrderStatusUpdated.php`)* → [action-hooks-orders.md](action-hooks-orders.md)
- **`fluent_cart/payment_status_changed`** — Fires on any payment status change *(`app/Events/Order/OrderStatusUpdated.php`)* → [action-hooks-orders.md](action-hooks-orders.md)
- **`fluent_cart/shipping_status_changed_to_{$newStatus}`** — Fires when shipping status changes to a specific status *(`app/Events/Order/OrderStatusUpdated.php`)* → [action-hooks-orders.md](action-hooks-orders.md)
- **`fluent_cart/shipping_status_changed`** — Fires on any shipping status change *(`app/Events/Order/OrderStatusUpdated.php`)* → [action-hooks-orders.md](action-hooks-orders.md)
- **`fluent_cart/order_refunded`** — Fires after any refund (full or partial) *(`app/Events/Order/OrderRefund.php`)* → [action-hooks-orders.md](action-hooks-orders.md)
- **`fluent_cart/order_fully_refunded`** — Fires only when an order is fully refunded *(`app/Events/Order/OrderRefund.php`)* → [action-hooks-orders.md](action-hooks-orders.md)
- **`fluent_cart/order_partially_refunded`** — Fires only when an order is partially refunded *(`app/Events/Order/OrderRefund.php`)* → [action-hooks-orders.md](action-hooks-orders.md)
- **`fluent_cart/order/before_custom_items_deleted`** — Fires before custom line items are deleted *(`api/Resource/OrderResource.php`)* → [action-hooks-orders.md](action-hooks-orders.md)
- **`fluent_cart/order/after_custom_items_deleted`** — Fires after custom line items are deleted *(`api/Resource/OrderResource.php`)* → [action-hooks-orders.md](action-hooks-orders.md)
- **`fluent_cart/order/invoice_number_added`** — Fires after an invoice/receipt number is assigned to an order *(`app/Models/Order.php`)* → [action-hooks-orders.md](action-hooks-orders.md)
- **`fluent_cart/order_customer_changed`** — Fires when the customer assigned to an order changes *(`app/Http/Controllers/OrderController.php`)* → [action-hooks-orders.md](action-hooks-orders.md)
- **`fluent_cart/order/generateMissingLicenses`** — Fires when an admin triggers license generation for an order *(`app/Http/Controllers/OrderController.php`)* → [action-hooks-orders.md](action-hooks-orders.md)
- **`fluent_cart/order_placed_offline`** — Fires when an order is placed via Cash on Delivery or other offline payment *(`app/Modules/PaymentMethods/Cod/CodHandler.php`)* → [action-hooks-orders.md](action-hooks-orders.md)
- **`fluent_cart/order_paid_done`** — Main lifecycle hook when order payment completes (recommended for integrations) *(`app/Hooks/actions.php`)* → [action-hooks-orders.md](action-hooks-orders.md)
- **`fluent_cart/order/receipt_viewed`** — Fires the first time a customer views their order receipt *(`app/Services/Renderer/Receipt/ReceiptRenderer.php`)* → [action-hooks-orders.md](action-hooks-orders.md)
- **`fluent_cart/order_canceled`** — Fires when a renewal order is canceled/voided *(`app/Http/Controllers/RenewalController.php:122`)*
- **`fluent_cart/order_paid_async_private_handle`** — Internal async post-payment hook for non-renewal orders *(`app/Listeners/IntegrationEventListener.php:380`)*

## Action Hooks — Payments & Integrations

Full parameters and examples: [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md) · [source](https://dev.fluentcart.com/hooks/actions/payments-and-integrations.html)

- **`fluent_cart/payment_{$paymentStatus}`** — Fires after order creation when a transaction succeeds *(`api/Resource/OrderResource.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/payment_{$transactionType}_{$paymentStatus}`** — Fires after order creation with both transaction type and payment status *(`api/Resource/OrderResource.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/payments/after_payment_{$paymentStatus}`** — Fires in abstract gateway after payment processing completes *(`app/Modules/PaymentMethods/Core/AbstractPaymentGateway.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/payment_success`** — Fires when an Airwallex or Square payment succeeds *(`app/Modules/PaymentMethods/AirwallexGateway/Airwallex.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/payment_failed`** — Fires when an Airwallex payment fails *(`app/Modules/PaymentMethods/AirwallexGateway/Airwallex.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/register_payment_methods`** — Register custom payment gateways *(`app/Hooks/Handlers/GlobalPaymentHandler.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/after_render_payment_method_{$route}`** — Fires after a payment method UI renders on the checkout *(`app/Modules/PaymentMethods/Core/AbstractPaymentGateway.php:551`)*
- **`fluent_cart/payments/stripe/webhook_{$eventType}`** — Fires for each Stripe webhook event *(`app/Modules/PaymentMethods/StripeGateway/Webhook/IPN.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/paypal_webhook_received`** — Fires when raw PayPal webhook data is received before processing *(`app/Modules/PaymentMethods/PayPalGateway/IPN.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/payments/paypal/webhook_subscription_payment_received`** — Fires when a PayPal recurring subscription payment is received *(`app/Modules/PaymentMethods/PayPalGateway/IPN.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/payments/paypal/webhook_payment_capture_completed`** — Fires when a PayPal one-time payment capture completes *(`app/Modules/PaymentMethods/PayPalGateway/IPN.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/payments/paypal/webhook_payment_sale_refunded`** — Fires when a PayPal recurring sale is refunded *(`app/Modules/PaymentMethods/PayPalGateway/IPN.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/payments/paypal/webhook_payment_capture_refunded`** — Fires when a PayPal one-time payment capture is refunded *(`app/Modules/PaymentMethods/PayPalGateway/IPN.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/payments/paypal/webhook_{$eventType}`** — Fires for PayPal customer dispute events *(`app/Modules/PaymentMethods/PayPalGateway/IPN.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/payments/paypal/webhook_{$eventType}`** — Fires for PayPal billing subscription lifecycle events *(`app/Modules/PaymentMethods/PayPalGateway/IPN.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/payments/paypal_vault_rejected`** — Fires when PayPal rejects saving a payment method for future use *(`app/Modules/PaymentMethods/PayPalGateway/Processor.php:262`)*
- **`fluent_cart/payments/mollie/webhook_subscription_payment_{$status}`** — Pro — Fires for each Mollie subscription payment status change *(`fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/Webhook/MollieIPN.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/payments/mollie/webhook_payment_{$status}`** — Pro — Fires for each Mollie one-time payment status change *(`fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/Webhook/MollieIPN.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/payment_failed`** — Pro — Fires when a Mollie payment fails, is canceled, or expires *(`fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/Webhook/MollieIPN.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/paddle_webhook_received`** — Pro — Fires when raw Paddle webhook data is received before processing *(`fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/Webhook/IPN.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/payments/paddle/webhook_{$eventType}`** — Pro — Fires for each Paddle webhook event *(`fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/Webhook/IPN.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/register_integration_action`** — Register custom integration actions during initialization *(`app/Modules/IntegrationActions/GlobalIntegrationActionHandler.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/integration/authenticate_global_credentials_{$settingsKey}`** — Verify integration credentials for a specific provider *(`app/Modules/Integrations/GlobalIntegrationSettings.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/integration/save_global_integration_settings_{$settingsKey}`** — Save integration settings for a specific provider *(`app/Modules/Integrations/GlobalIntegrationSettings.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/integration/chained_{$route}`** — Fires for chained data requests in cascading dropdowns *(`app/Modules/Integrations/GlobalIntegrationSettings.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/integration/run/{$provider}`** — Execute a specific integration feed for a provider *(`app/Listeners/IntegrationEventListener.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/integration/integration_notify_{$feedKey}`** — Synchronous notify-style integration feed execution *(`app/Modules/Integrations/GlobalNotificationHandler.php:109`)*
- **`fluent_cart/integrations/global_notify_completed`** — Fires after all synchronous global notification feeds have completed *(`app/Modules/Integrations/GlobalNotificationHandler.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/reindex_integration_feeds`** — Fires when integration feeds need to be re-indexed *(`app/Http/Controllers/IntegrationController.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/register_storage_drivers`** — Register custom file storage drivers *(`app/Hooks/Handlers/GlobalStorageHandler.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/dev_log`** — Fires for development and debug logging (requires FLUENT_CART_DEV_MODE) *(`app/Modules/PaymentMethods/PayPalGateway/IPN.php`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)

## Action Hooks — Products & Coupons

Full parameters and examples: [action-hooks-products-coupons.md](action-hooks-products-coupons.md) · [source](https://dev.fluentcart.com/hooks/actions/products-and-coupons.html)

- **`fluent_cart/product_duplicated`** — Fired after a product is duplicated *(`app/Models/Product.php`)* → [action-hooks-products-coupons.md](action-hooks-products-coupons.md)
- **`fluent_cart/product_updated`** — Fired when a product is updated via the admin API *(`app/Http/Controllers/ProductController.php`)* → [action-hooks-products-coupons.md](action-hooks-products-coupons.md)
- **`fluent_cart/product/render_product_header`** — Before the single product page content *(`app/Modules/Templating/TemplateActions.php`)* → [action-hooks-products-coupons.md](action-hooks-products-coupons.md)
- **`fluent_cart/product/after_product_content`** — After the single product page content *(`app/Modules/Templating/TemplateActions.php`)* → [action-hooks-products-coupons.md](action-hooks-products-coupons.md)
- **`fluent_cart/template/product_archive`** — Render the product archive/taxonomy page *(`app/Modules/Templating/TemplateActions.php`)* → [action-hooks-products-coupons.md](action-hooks-products-coupons.md)
- **`fluent_cart/product/single/before_price_block`** — Before the price block on a single product page *(`app/Services/Renderer/ProductRenderer.php`)* → [action-hooks-products-coupons.md](action-hooks-products-coupons.md)
- **`fluent_cart/product/after_price`** — Inline after the price is rendered *(`app/Services/Renderer/ProductRenderer.php`)* → [action-hooks-products-coupons.md](action-hooks-products-coupons.md)
- **`fluent_cart/product/single/after_price_block`** — After the price block wrapper closes on a single product page *(`app/Services/Renderer/ProductRenderer.php`)* → [action-hooks-products-coupons.md](action-hooks-products-coupons.md)
- **`fluent_cart/product/single/before_price_range_block`** — Before the price range block for multi-variant products *(`app/Services/Renderer/ProductRenderer.php`)* → [action-hooks-products-coupons.md](action-hooks-products-coupons.md)
- **`fluent_cart/product/single/after_price_range_block`** — After the price range block for multi-variant products *(`app/Services/Renderer/ProductRenderer.php`)* → [action-hooks-products-coupons.md](action-hooks-products-coupons.md)
- **`fluent_cart/product/single/before_variant_item`** — Before each variant item in the variant list *(`app/Services/Renderer/ProductRenderer.php`)* → [action-hooks-products-coupons.md](action-hooks-products-coupons.md)
- **`fluent_cart/product/single/after_variant_item`** — After each variant item in the variant list *(`app/Services/Renderer/ProductRenderer.php`)* → [action-hooks-products-coupons.md](action-hooks-products-coupons.md)
- **`fluent_cart/product/single/before_quantity_block`** — Before the quantity selector on a single product page *(`app/Services/Renderer/ProductRenderer.php`)* → [action-hooks-products-coupons.md](action-hooks-products-coupons.md)
- **`fluent_cart/product/single/after_quantity_block`** — After the quantity selector on a single product page *(`app/Services/Renderer/ProductRenderer.php`)* → [action-hooks-products-coupons.md](action-hooks-products-coupons.md)
- **`fluent_cart/product/group/before_image_block`** — Before the product card image *(`app/Services/Renderer/ProductCardRender.php`)* → [action-hooks-products-coupons.md](action-hooks-products-coupons.md)
- **`fluent_cart/product/group/after_image_block`** — After the product card image *(`app/Services/Renderer/ProductCardRender.php`)* → [action-hooks-products-coupons.md](action-hooks-products-coupons.md)
- **`fluent_cart/product/group/before_price_block`** — Before the price section in product cards *(`app/Services/Renderer/ProductCardRender.php`)* → [action-hooks-products-coupons.md](action-hooks-products-coupons.md)
- **`fluent_cart/product/group/after_price_block`** — After the price section in product cards *(`app/Services/Renderer/ProductCardRender.php`)* → [action-hooks-products-coupons.md](action-hooks-products-coupons.md)
- **`fluent_cart/product/group/before_card`** — Before a product card's opening <article> *(`app/Services/Renderer/ProductCardRender.php:75`)*
- **`fluent_cart/product/group/after_card`** — After a product card's closing </article> *(`app/Services/Renderer/ProductCardRender.php:95`)*
- **`fluent_cart/product/group/before_title_block`** — Before the product card title *(`app/Services/Renderer/ProductCardRender.php:171`)*
- **`fluent_cart/product/group/after_title_block`** — After the product card title *(`app/Services/Renderer/ProductCardRender.php:205`)*
- **`fluent_cart/product/group/before_excerpt_block`** — Before the product card excerpt *(`app/Services/Renderer/ProductCardRender.php:150`)*
- **`fluent_cart/product/group/after_excerpt_block`** — After the product card excerpt *(`app/Services/Renderer/ProductCardRender.php:160`)*
- **`fluent_cart/product/group/before_actions_block`** — Before the buy button row on a product card *(`app/Services/Renderer/ProductCardRender.php:362`)*
- **`fluent_cart/product/group/after_actions_block`** — After the buy button row on a product card *(`app/Services/Renderer/ProductCardRender.php:366`)*
- **`fluent_cart/product/single/before_title_block`** — Before the <h1> *(`app/Services/Renderer/ProductRenderer.php:725`)*
- **`fluent_cart/product/single/after_title_block`** — After the <h1> *(`app/Services/Renderer/ProductRenderer.php:731`)*
- **`fluent_cart/product/single/before_excerpt_block`** — Before the excerpt on a single product page *(`app/Services/Renderer/ProductRenderer.php:942`)*
- **`fluent_cart/product/single/after_excerpt_block`** — After the excerpt on a single product page *(`app/Services/Renderer/ProductRenderer.php:948`)*
- **`fluent_cart/product/single/before_actions_block`** — Before the buy-now / add-to-cart buttons on a single product page *(`app/Services/Renderer/ProductRenderer.php:1424`)*
- **`fluent_cart/product/single/after_actions_block`** — After the buy-now / add-to-cart buttons on a single product page *(`app/Services/Renderer/ProductRenderer.php:1430`)*
- **`fluent_cart/product/variants_updated`** — Fired after a batch of product variants is saved
- **`fluent_cart/coupon_created`** — Fired after a new coupon is created via the admin *(`app/Http/Controllers/CouponsController.php`)* → [action-hooks-products-coupons.md](action-hooks-products-coupons.md)
- **`fluent_cart/coupon_updated`** — Fired after a coupon is updated via the admin *(`app/Http/Controllers/CouponsController.php`)* → [action-hooks-products-coupons.md](action-hooks-products-coupons.md)

## Action Hooks — Subscriptions

Full parameters and examples: [action-hooks-subscriptions.md](action-hooks-subscriptions.md) · [source](https://dev.fluentcart.com/hooks/actions/subscriptions.html)

- **`fluent_cart/payments/subscription_status_changed`** — Fires on any subscription status transition *(`app/Modules/Subscriptions/Services/SubscriptionService.php:449,1155`)* → [action-hooks-subscriptions.md](action-hooks-subscriptions.md)
- **`fluent_cart/payments/subscription_active`** — Fires when a subscription becomes active *(`app/Modules/Subscriptions/Services/SubscriptionService.php:852`)* → [action-hooks-subscriptions.md](action-hooks-subscriptions.md)
- **`fluent_cart/payments/subscription_canceled`** — Fires when a subscription is cancelled *(`app/Modules/Subscriptions/Services/SubscriptionService.php:449,1155`)* → [action-hooks-subscriptions.md](action-hooks-subscriptions.md)
- **`fluent_cart/payments/subscription_paused`** — Fires when a subscription is paused *(`app/Modules/Subscriptions/Services/SubscriptionService.php:449,1155`)* → [action-hooks-subscriptions.md](action-hooks-subscriptions.md)
- **`fluent_cart/payments/subscription_expired`** — Fires when a subscription expires *(`app/Modules/Subscriptions/Services/SubscriptionService.php:449,1155`)* → [action-hooks-subscriptions.md](action-hooks-subscriptions.md)
- **`fluent_cart/payments/subscription_failing`** — Fires when a subscription payment is failing *(`app/Modules/Subscriptions/Services/SubscriptionService.php:449,1155`)* → [action-hooks-subscriptions.md](action-hooks-subscriptions.md)
- **`fluent_cart/payments/subscription_expiring`** — Fires when a subscription is marked as expiring soon *(`app/Modules/Subscriptions/Services/SubscriptionService.php:449,1155`)* → [action-hooks-subscriptions.md](action-hooks-subscriptions.md)
- **`fluent_cart/payments/subscription_completed`** — Fires when a subscription completes all billing cycles *(`app/Modules/Subscriptions/Services/SubscriptionService.php:449,1155`)* → [action-hooks-subscriptions.md](action-hooks-subscriptions.md)
- **`fluent_cart/payments/subscription_trialing`** — Fires when a subscription enters trial status *(`app/Modules/Subscriptions/Services/SubscriptionService.php:449,1155`)* → [action-hooks-subscriptions.md](action-hooks-subscriptions.md)
- **`fluent_cart/subscription/data_updated`** — Fires when subscription data changes without a status transition *(`app/Modules/Subscriptions/Services/SubscriptionService.php:418,1141`)* → [action-hooks-subscriptions.md](action-hooks-subscriptions.md)
- **`fluent_cart/subscription_renewal_reminder`** — Fires when a subscription renewal reminder is due *(`app/Services/Reminders/SubscriptionReminderService.php`)* → [action-hooks-subscriptions.md](action-hooks-subscriptions.md)
- **`fluent_cart/subscription_trial_end_reminder`** — Fires when a trial ending reminder is due *(`app/Services/Reminders/SubscriptionReminderService.php`)* → [action-hooks-subscriptions.md](action-hooks-subscriptions.md)
- **`fluent_cart/renewal_reminder_overdue`** — Fires when an overdue renewal reminder is triggered *(`app/Services/Reminders/RenewalReminderService.php`)*
- **`fluent_cart/renewal_reminder_due`** — Fires when a renewal due-date reminder is triggered *(`app/Services/Reminders/RenewalReminderService.php`)*
- **`fluent_cart/renewal_created`** — Fires when a renewal order is generated *(`app/Http/Controllers/RenewalController.php:165`)*
- **`fluent_cart/renewal_paid`** — Fires once when a renewal order is paid *(`app/Helpers/StatusHelper.php:225`)*
- **`fluent_cart/renewal_payment_scheduled`** — Fires when a gateway renewal payment is scheduled (positional args) *(`app/Modules/PaymentMethods/PayPalGateway/Processor.php:476`)*
- **`fluent_cart/renewal/payment_scheduled`** — Fires when a gateway renewal payment is scheduled (array payload) *(`app/Modules/PaymentMethods/PayPalGateway/Processor.php:752`)*
- **`fluent_cart/renewal_voided`** — Fires when a renewal order is voided *(`app/Http/Controllers/RenewalController.php:126`)*
- **`fluent_cart/subscriptions/system_renewal_scheduled`** — Fires when a store-managed renewal is scheduled for auto-charge *(`app/Modules/StoreManagedRenewal/Services/RenewalService.php:227`)*
- **`fluent_cart/subscription_converted_to_automatic`** — Fires when a subscription becomes gateway-managed *(`app/Modules/PaymentMethods/PayPalGateway/PayPal.php:150`)*
- **`fluent_cart/subscription_converted_to_manual`** — Fires when a subscription falls back to manual invoicing *(`app/Modules/PaymentMethods/Core/AbstractPaymentGateway.php:343`)*
- **`fluent_cart/subscription_past_due`** — Fires when a store-managed subscription enters dunning *(`app/Modules/StoreManagedRenewal/Services/RenewalService.php:696`)*
- **`fluent_cart/subscription/reactivated_locally`** — Fires when a store-managed subscription is reactivated locally (positional arg) *(`app/Modules/Subscriptions/Services/SubscriptionService.php:864`)*
- **`fluent_cart/subscription_paused`** — Native event: subscription paused *(`app/Modules/Subscriptions/Services/SubscriptionService.php:527`)*
- **`fluent_cart/subscription_resumed`** — Native event: subscription resumed *(`app/Modules/Subscriptions/Services/SubscriptionService.php:530`)*
- **`fluent_cart/subscription_updated`** — Native event: subscription terms updated *(`app/Modules/Subscriptions/Services/SubscriptionService.php:533`)*
- **`fluent_cart/subscriptions/system_charge_succeeded`** — Fires when an off-session renewal charge succeeds *(`app/Modules/Subscriptions/Services/SystemChargeService.php:584`)*
- **`fluent_cart/subscriptions/system_charge_failed`** — Fires when an off-session renewal charge fails *(`app/Modules/Subscriptions/Services/SystemChargeService.php:730`)*
- **`fluent_cart/subscriptions/system_charge_failed_notification`** — Fires when a charge-failure notification should be sent *(`app/Modules/Subscriptions/Services/SystemChargeService.php:746`)*
- **`fluent_cart/subscriptions/system_charge_disabled`** — Fires when auto-charge is turned off for a subscription *(`app/Modules/Subscriptions/Services/SystemChargeService.php:325`)*
- **`fluent_cart/subscriptions/system_charge_manual_triggered`** — Fires when an admin triggers an off-session charge *(`app/Modules/Subscriptions/Services/SystemChargeService.php:444`)*
- **`fluent_cart/subscriptions/system_payment_method_updated`** — Fires when the saved token for a system subscription changes *(`app/Modules/PaymentMethods/StripeGateway/UpdateCustomerPaymentMethod.php:129`)*
- **`fluent_cart/subscription/early_payment_completed`** — Pro — Fires when an early installment payment is completed *(`fluent-cart-pro/app/Hooks/Handlers/EarlyInstallmentPaymentHandler.php:279`)* → [action-hooks-subscriptions.md](action-hooks-subscriptions.md)
- **`fluent_cart/order/upgraded`** — Pro — Fires when a plan upgrade is completed *(`fluent-cart-pro/app/Hooks/Handlers/UpgradeHandler.php:268`)* → [action-hooks-subscriptions.md](action-hooks-subscriptions.md)

## Action Hooks — Modules

[source](https://dev.fluentcart.com/hooks/actions/modules.html)

- **`fluent_cart/mcp_loaded`** — Fires once the MCP module has finished bootstrapping *(`app/Modules/MCP/MCPInit.php:104`)*
- **`fluent_cart/mcp_ability_registration_failed`** — Fires when registering an MCP ability throws an exception *(`app/Modules/MCP/AbilitiesRegistrar.php:91`)*
- **`fluent_cart/advanced_variation/enqueue_assets`** — Fires when a block that can render an advanced-variation selector is about to render *(`app/Hooks/Handlers/BlockEditors/BuySectionBlockEditor.php:76`)*

## Action Hooks — Pro Modules

[source](https://dev.fluentcart.com/hooks/actions/pro-modules.html)

- **`fluent_cart_sl/product_version_updated`** — Pro — Fires when a licensed product's version is published *(`fluent-cart-pro/app/Modules/Licensing/Http/Controllers/ProductLicenseController.php:168`)*
- **`fluent_cart_sl/product_release_artifacts_updated`** — Pro — Fires when a signed release manifest is stored *(`fluent-cart-pro/app/Modules/Licensing/Http/Controllers/ProductLicenseController.php:196`)*
- **`fluent_cart/licensing/license_reactivated`** — Pro — Fires when a subscription renewal revives a license *(`fluent-cart-pro/app/Modules/Licensing/Hooks/Handlers/LicenseGenerationHandler.php:417`)*
- **`fluent_cart/paddle/webhook_signature_bypass`** — Pro — Fires when a Paddle webhook is accepted without a valid signature *(`fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/Webhook/IPN.php:106`)*
- **`fluent_cart/paddle/webhook_subscription_unmatched`** — Pro — Fires when a Paddle subscription cannot be matched locally *(`fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/Webhook/IPN.php:358`)*
- **`fluent_cart/saved_payment_method/saved`** — Pro — Fires when a payment method token is stored for a customer *(`fluent-cart-pro/app/Modules/SavedPaymentMethods/PayPal/PayPalSavedMethodWriter.php:162`)*
- **`fluent_cart/mcp_tool_exception`** — Fires when an MCP tool invocation throws *(`fluent-cart/app/Modules/MCP/AbilitiesRegistrar.php:308`)*

## Filter Hooks — Cart & Checkout

Full parameters and examples: [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md) · [source](https://dev.fluentcart.com/hooks/filters/cart-and-checkout.html)

- **`fluent_cart/cart/item_modify`** — Modify cart item variation before adding → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/item_max_quantity`** — Limit the maximum quantity for a cart item *(`api/Resource/FrontendResource/CartResource.php:79`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/cart/custom_item_quantity_changed`** — Handle custom item quantity changes *(`api/Resource/FrontendResource/CartResource.php:310`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/cart/validate_custom_item`** — Validate a custom or externally-managed cart item → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/cart_item_product_variation`** — Provide a fallback product variation for a cart item *(`api/Resource/FrontendResource/CartResource.php:710`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/cart/can_purchase`** — Determine whether a variation can be added to the cart *(`app/Models/Cart.php:451`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/cart/estimated_total`** — Filter the cart estimated total → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/cart_cookie_minutes`** — Control cart cookie expiration time *(`api/Cookie/Cookie.php:22`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/variation/can_purchase_bundle`** — Validate whether a bundle product can be purchased *(`app/Models/ProductVariation.php:330`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/cart/context_data`** — Filter the cart's context data snapshot *(`app/Models/Cart.php:1297`)*
- **`fluent_cart/cart/fees`** — Add or modify dynamic (computed) cart fees *(`app/Models/Cart.php:902`)*
- **`fluent_cart/cart/item_dynamic_discount`** — Filter cart item data before totals are calculated *(`app/Models/Cart.php:1198`)*
- **`fluent_cart/cart/item_price`** — Filter a cart line item's unit price *(`app/Helpers/CartHelper.php:34`)*
- **`fluent_cart/cart/items_total`** — Filter the combined items + shipping total *(`app/Services/OrderService.php:441`)*
- **`fluent_cart/cart/shipping_total`** — Filter the cart's shipping total
- **`fluent_cart/shipping/auto_select_single_method`** — Control whether a lone shipping method is auto-selected *(`app/Helpers/CartHelper.php:905`)*
- **`fluent_cart/checkout/validate_before_process`** — Pre-validate the checkout before processing *(`api/Checkout/CheckoutApi.php:114`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/cart/tax_behavior`** — Filter the tax behavior amount for the cart *(`api/Checkout/CheckoutApi.php:216`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/checkout/validate_data`** — Add or modify checkout validation errors *(`api/Checkout/CheckoutApi.php:1042`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/checkout_page_css_classes`** — Modify checkout page CSS classes *(`app/Services/Renderer/CheckoutRenderer.php:133`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/checkout_page_notices`** — Add custom notices to the checkout page *(`app/Services/Renderer/CheckoutRenderer.php:160`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/checkout/summary_extra_lines`** — Add extra rendered lines to the checkout order summary *(`app/Services/Renderer/CartSummaryRender.php:123`)*
- **`fluent_cart/checkout_renderer/billing_fields`** — Modify rendered billing fields on the checkout page *(`app/Services/Renderer/CheckoutRenderer.php:558`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/checkout_renderer/shipping_fields`** — Modify rendered shipping fields on the checkout page *(`app/Services/Renderer/CheckoutRenderer.php:631`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/disable_order_notes_for_digital_products`** — Control order notes visibility for digital products *(`app/Services/Renderer/CheckoutRenderer.php:670`)* → [action-hooks-cart-checkout.md](action-hooks-cart-checkout.md)
- **`fluent_cart/checkout_active_payment_methods`** — Filter active payment methods on the checkout page → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/checkout_page_order_button_text`** — Customize the place order button text *(`app/Services/Renderer/CheckoutRenderer.php:840`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/payment_method_list_class`** — Add CSS classes to a payment method wrapper
- **`fluent_cart/modal_checkout/filter_active_payment_methods`** — Restrict payment methods in modal checkout *(`app/Services/Renderer/ModalCheckoutRenderer.php:680`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/modal_checkout/before_payment_methods_placement`** — Choose where the pre-payment-methods action fires in modal checkout *(`app/Services/Renderer/ModalCheckoutRenderer.php:216`)*
- **`fluent_cart/enable_modal_checkout`** — Enable or disable modal checkout *(`app/Helpers/Helper.php:1928`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/checkout/checkout_data_changed`** — Modify checkout data after a change is detected → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/checkout/cart_updated`** — Filter the cart update response data *(`app/Hooks/Cart/WebCheckoutHandler.php:750`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/checkout/before_patch_checkout_data`** — Modify fill data before patching the checkout session → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/checkout/after_patch_checkout_data_fragments`** — Modify HTML fragments returned after patching checkout data *(`app/Hooks/Cart/WebCheckoutHandler.php:1019`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/apply_order_bump`** — Handle order bump application on the checkout page *(`app/Hooks/Cart/WebCheckoutHandler.php:1052`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/checkout_address_fields`** — Modify address field definitions *(`app/Helpers/CartCheckoutHelper.php:692`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/checkout_billing_fields`** — Modify billing address field schema *(`app/Helpers/CartCheckoutHelper.php:730`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/checkout_shipping_fields`** — Modify shipping address field schema *(`app/Helpers/CartCheckoutHelper.php:771`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/checkout_signup_fields`** — Modify the account signup form fields *(`app/Helpers/CartCheckoutHelper.php:846`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/checkout_login_fields`** — Modify the checkout login form fields *(`app/Helpers/CartCheckoutHelper.php:872`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/checkout_coupon_fields`** — Modify the coupon input fields *(`app/Helpers/CartCheckoutHelper.php:925`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/checkout_page_name_fields_schema`** — Modify name fields on the checkout page *(`app/Services/Renderer/CheckoutFieldsSchema.php:113`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/fields/address_base_fields`** — Modify base address field definitions *(`app/Services/Renderer/CheckoutFieldsSchema.php:348`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/default_billing_country_for_checkout`** — Set the default billing country *(`app/Helpers/AddressHelper.php:627`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/checkout/localize_data`** — Modify checkout JavaScript localized data *(`app/Modules/Templating/AssetLoader.php:574`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/payment_methods_with_custom_checkout_buttons`** — Register payment methods that use custom checkout buttons *(`app/Modules/Templating/AssetLoader.php:542`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/instant_checkout/allowed_redirect_hosts`** — Control allowed redirect hosts for instant checkout *(`app/Http/Routes/WebRoutes.php:190`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/checkout/is_business`** — Filter whether the checkout is a business (B2B) purchase *(`app/Modules/Tax/TaxModule.php`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/tax/reverse_charge_line_adjustment`** — Filter the per-line price adjustment when reverse charge is applied *(`app/Modules/Tax/TaxModule.php`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/tax/reverse_charge_notice_text`** — Filter the reverse charge notice shown on receipts and invoices *(`app/Modules/Tax/TaxModule.php`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)
- **`fluent_cart/tax/validate_eu_vat_number`** — Short-circuit EU VAT number validation with a custom validator *(`app/Modules/Tax/TaxModule.php`)* → [filter-hooks-cart-checkout.md](filter-hooks-cart-checkout.md)

## Filter Hooks — Customers & Subscriptions

Full parameters and examples: [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md) · [source](https://dev.fluentcart.com/hooks/filters/customers-and-subscriptions.html)

- **`fluent_cart/customer/view`** — Filter admin single customer view data *(`app/Http/Controllers/CustomerController.php:83`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/widgets/single_customer`** — Filter single customer admin widgets *(`app/Http/Controllers/CustomerController.php:426`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/customer_dashboard_data`** — Filter customer dashboard data *(`app/Http/Controllers/FrontendControllers/CustomerProfileController.php:65,122`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/global_customer_menu_items`** — Filter customer portal menu items *(`app/Hooks/Handlers/ShortCodes/CustomerProfileHandler.php:299`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/customer_portal/active_tab`** — Filter the active tab in customer portal *(`app/Hooks/Handlers/ShortCodes/CustomerProfileHandler.php:150`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/customer_portal/custom_endpoints`** — Filter custom portal endpoints *(`app/Hooks/Handlers/ShortCodes/CustomerProfileHandler.php:174`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/customer_portal/{$filter}`** — Provide sections for a custom customer-portal endpoint (dynamic) *(`app/Http/Controllers/FrontendControllers/CustomerProfileController.php:228`)*
- **`fluent_cart/customer_portal/subscription_data`** — Filter customer portal subscription data *(`app/Http/Controllers/FrontendControllers/CustomerSubscriptionController.php:175`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/customer/subscription_details_section_parts`** — Filter subscription details section parts in customer portal *(`app/Http/Controllers/FrontendControllers/CustomerSubscriptionController.php:180`)*
- **`fluent_cart/payment_methods/stripe_pub_key`** — Filter Stripe public key for customer portal *(`app/Hooks/Handlers/ShortCodes/CustomerProfileHandler.php:389`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/payment_methods/paypal_client_id`** — Filter PayPal client ID for customer portal *(`app/Hooks/Handlers/ShortCodes/CustomerProfileHandler.php:390`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/editable_customer_statuses`** — Filter editable customer statuses *(`app/Helpers/Status.php:375`)*
- **`fluent_cart/user/after_register/skip_hooks`** — Skip post-registration hooks *(`app/Services/AuthService.php:122`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/subscription_statuses`** — Filter subscription statuses *(`app/Helpers/Status.php:265`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/validable_subscription_statuses`** — Filter valid (active) subscription statuses *(`app/Helpers/Status.php:283`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/subscription/view`** — Filter admin subscription view data *(`app/Modules/Subscriptions/Http/Controllers/SubscriptionController.php:83`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/subscription/url_{$payment_method}`** — Filter vendor dashboard URL for a subscription (dynamic) *(`app/Models/Subscription.php:284`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/subscription/can_reactivate`** — Filter whether a subscription can be reactivated *(`app/Models/Subscription.php:983`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/subscription/vendor_id_editing_enabled`** — Opt in to admin editing of gateway identifiers *(`app/Models/Subscription.php:900`)*
- **`fluent_cart/available_subscription_interval_options`** — Filter subscription interval options *(`app/Helpers/Helper.php:1740`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/subscription_interval_in_days`** — Filter the number of days for a custom subscription interval *(`app/Helpers/Helper.php:1801`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/max_trial_days_allowed`** — Filter maximum trial days allowed *(`app/Helpers/Helper.php:1775`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/trial_info`** — Filter trial info display text *(`app/Helpers/Helper.php:1339`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/subscription_billing_period`** — Filter billing period for payment gateways *(`app/Modules/PaymentMethods/StripeGateway/Plan.php:58`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/subscription/grace_period_days`** — Filter grace period days per billing interval *(`app/Services/Payments/SubscriptionHelper.php:188`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/reminders/scan_batch_size`** — Filter reminder scan batch size *(`app/Services/Reminders/ReminderService.php:355`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/reminders/renewal_due_days`** — Filter renewal due-reminder days *(`app/Services/Reminders/RenewalReminderService.php:294`)*
- **`fluent_cart/reminders/renewal_overdue_days`** — Filter overdue renewal reminder intervals *(`app/Services/Reminders/RenewalReminderService.php:305`)*
- **`fluent_cart/reminders/billing_cycle`** — Filter billing cycle name for reminder processing *(`app/Services/Reminders/SubscriptionReminderService.php:508`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/reminders/yearly_before_days`** — Filter days before yearly renewal reminder *(`app/Services/Reminders/SubscriptionReminderService.php:540`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/reminders/monthly_before_days`** — Filter days before monthly renewal reminder *(`app/Services/Reminders/SubscriptionReminderService.php:552`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/reminders/quarterly_before_days`** — Filter days before quarterly renewal reminder *(`app/Services/Reminders/SubscriptionReminderService.php:564`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/reminders/half_yearly_before_days`** — Filter days before half-yearly renewal reminder *(`app/Services/Reminders/SubscriptionReminderService.php:576`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/reminders/trial_end_days`** — Filter days before trial end reminder *(`app/Services/Reminders/SubscriptionReminderService.php:588`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/subscription/management_mode`** — Filter the effective subscription management mode *(`app/Modules/Subscriptions/Services/SubscriptionManagementMode.php:36`)*
- **`fluent_cart/subscription_collection_method_{gateway}`** — Per-gateway override of the resolved collection method *(`app/Helpers/CheckoutProcessor.php:963`)*
- **`fluent_cart/subscription/allowed_intervals`** — Filter the intervals a subscription may be changed to *(`app/Modules/Subscriptions/Services/SubscriptionService.php:966`)*
- **`fluent_cart/renewal/advance_creation_days`** — Filter how many days ahead a renewal order is generated *(`app/Modules/StoreManagedRenewal/Services/RenewalService.php:911`)*
- **`fluent_cart/subscriptions/system_charge_retry_offsets`** — Filter the off-session charge retry ladder *(`app/Modules/Subscriptions/Services/SystemChargeService.php:213`)*
- **`fluent_cart/subscriptions/system_charge_failure_notify`** — Decide whether to notify the customer on a failed charge *(`app/Modules/Subscriptions/Services/SystemChargeService.php:739`)*
- **`fluent_cart/subscriptions/upcoming_charge_notification`** — Toggle the upcoming auto-charge notice *(`app/Services/Email/EmailNotificationMailer.php:95`)*
- **`fluent_cart/subscriptions/system_billing_enabled`** — Master switch for system auto-charge billing *(`app/Modules/Subscriptions/Services/SystemChargeService.php:57`)*
- **`fluent_cart/subscriptions/system_collection_enabled`** — Whether new subscriptions may resolve to system *(`app/Modules/Subscriptions/Services/SubscriptionManagementMode.php:55`)*
- **`fluent_cart/subscription/early_payment_enabled`** — Filter whether early installment payments are enabled *(`app/Modules/Subscriptions/Services/EarlyPaymentFeature.php:14`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/subscription/can_early_pay`** — Filter whether a specific subscription can make an early payment *(`app/Modules/Subscriptions/Services/EarlyPaymentFeature.php:26`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/subscription/reactivation_same_price_days_limit`** — Pro — Filter days limit for same-price reactivation *(`fluent-cart-pro/app/Hooks/Handlers/SubscriptionRenewalHandler.php:288`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)
- **`fluent_cart/customer/license_details_section_parts`** — Pro — Filter license details section parts in customer portal *(`fluent-cart-pro/app/Modules/Licensing/Http/Controllers/CustomerProfileController.php:97`)* → [filter-hooks-customers-subscriptions.md](filter-hooks-customers-subscriptions.md)

## Filter Hooks — Integrations & Advanced

Full parameters and examples: [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md) · [source](https://dev.fluentcart.com/hooks/filters/integrations-and-advanced.html)

- **`fluent_cart/integration/order_integrations`** — Filter all registered order integrations *(`IntegrationEventListener.php:54,247,386`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/integration/run_all_actions_on_async`** — Force all integration actions to run asynchronously *(`IntegrationEventListener.php:145`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/integration/global_notification_types`** — Filter available notification types *(`GlobalIntegrationSettings.php:119`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/integration/global_notification_feed_{$feed_key}`** — Filter notification feed data (DYNAMIC) *(`GlobalIntegrationSettings.php:151`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/integration/get_global_integration_actions`** — Filter global integration actions *(`GlobalIntegrationActionHandler.php:22`)* → [action-hooks-payments-integrations.md](action-hooks-payments-integrations.md)
- **`fluent_cart/integration/notifying_async_{$feedKey}`** — Control async notification per feed (DYNAMIC) *(`GlobalNotificationHandler.php:104`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/webhook/payload`** — Pro — Filter webhook payload before sending *(`fluent-cart-pro/app/Modules/Integrations/WebhookConnect.php:251`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/integration/global_integration_settings_{$key}`** — Filter integration settings (DYNAMIC) *(`GlobalIntegrationSettings.php:24`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/integration/global_integration_fields_{$key}`** — Filter integration field definitions (DYNAMIC) *(`GlobalIntegrationSettings.php:25`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/integration/get_integration_defaults_{$name}`** — Filter integration defaults (DYNAMIC) *(`GlobalIntegrationSettings.php:199,201`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/integration/get_integration_settings_fields_{$name}`** — Filter integration settings fields (DYNAMIC) *(`GlobalIntegrationSettings.php:204,276`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/integration/save_integration_values_{$name}`** — Filter before saving integration data (DYNAMIC) *(`GlobalIntegrationSettings.php:248`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/integration/get_integration_merge_fields_{$name}`** — Filter integration merge/mapping fields (DYNAMIC) *(`GlobalIntegrationSettings.php:369`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/integration/integration_options_{$key}`** — Filter dynamic integration options (DYNAMIC) *(`IntegrationController.php:302`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/integration/integration_saving_data_{$provider}`** — Filter integration data before validation (DYNAMIC) *(`IntegrationHelper.php:62`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/integration/editing_integration_{$key}`** — Filter integration data when editing (DYNAMIC) *(`IntegrationHelper.php:80`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/integration/addons`** — Filter the integration addons list *(`AddonsController.php:87`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/installable_repo_plugins`** — Filter installable plugin recommendations *(`AddonsController.php:121`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/local_file_blocked_extensions`** — Filter blocked file extensions for local storage *(`LocalDriver.php:129`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/download_expiration_minutes`** — Filter S3 download link expiration time *(`S3Driver.php:237,252`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/download_link_validity_in_minutes`** — Filter download link validity duration *(`Helper.php:1430`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/product_download/can_be_downloaded`** — Filter whether a file can be downloaded *(`FileDownloader.php:95`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/storage/get_global_storage_settings_{$driver}`** — Filter storage driver settings (DYNAMIC) *(`api/StorageDrivers.php:18`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/storage/get_global_storage_drivers`** — Filter all available storage drivers *(`StorageDrivers.php:28`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/storage/get_global_storage_driver_status_{$driver}`** — Filter storage driver status (DYNAMIC) *(`StorageDrivers.php:65`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/verify_driver_connect_info_{$driver}`** — Filter driver connection verification (DYNAMIC) *(`StorageDrivers.php:79`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/storage/storage_settings_before_update_{$slug}`** — Filter storage settings before saving (DYNAMIC) *(`BaseStorageDriver.php:152`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/storage/s3_prevent_overwrite`** — Filter whether an S3 upload may overwrite an existing object *(`app/Services/FileSystem/Drivers/S3/S3FileUploader.php:64`)*
- **`fluent_cart/storage/settings_response`** — Filter a storage driver's settings-screen response *(`app/Modules/StorageDrivers/BaseStorageDriver.php:184`)*
- **`fluent_cart/storage/settings_response_{$slug}`** — Filter one storage driver's settings-screen response (DYNAMIC) *(`app/Modules/StorageDrivers/BaseStorageDriver.php:186`)*
- **`fluent_cart/data_backfills/chunk_budget`** — Filter the chunk size and per-run budget for a data backfill task *(`database/DataBackfills.php:535`)*
- **`fluent_cart/country_state_options`** — Filter country and state options *(`LocalizationManager.php:425`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/address/postcode/format`** — Filter postcode formatting *(`PostcodeVerification.php:53`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/address/postcode/is_valid`** — Filter postcode validation result *(`PostcodeVerification.php:154`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/template/disable_taxonomy_fallback`** — Disable taxonomy fallback template *(`TemplateLoader.php:113`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/has_block_template`** — Filter block template existence check *(`TemplateLoader.php:193`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/template_loader_files`** — Filter template files to load *(`TemplateLoader.php:206`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/template_path`** — Filter theme template path *(`TemplateLoader.php:248`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/template_part_content`** — Filter template part content (canonical) *(`app/Modules/Templating/BlockTemplates/TemplateParts/ProductModalTemplatePart.php:245`)*
- **`fluent_cart/template_part_content_{$slug}`** — Filter one template part's content by slug (canonical, DYNAMIC) *(`app/Modules/Templating/BlockTemplates/TemplateParts/ProductModalTemplatePart.php:246`)*
- **`fluent_cart/template_part_output`** — Filter template part rendered output (canonical) *(`app/Modules/Templating/BlockTemplates/TemplateParts/ProductModalTemplatePart.php:252`)*
- **`fluent_cart/template_part_output_{$slug}`** — Filter one template part's rendered output by slug (canonical, DYNAMIC) *(`app/Modules/Templating/BlockTemplates/TemplateParts/ProductModalTemplatePart.php:253`)*
- **`fluent_cart/buttons/enable_floating_cart_button`** — Filter floating cart button visibility *(`app/Hooks/Cart/CartLoader.php:49`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/{$widgetName}`** — Filter widget data by name (DYNAMIC) *(`app/Services/Widgets/BaseWidget.php:16`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/widgets/{$filter}`** — Filter widget data by filter key (DYNAMIC) *(`WidgetsController.php:36`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/promo_gateways`** — Filter promotional gateways *(`PromoGatewaysHandler.php:36`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/addon_gateways`** — Filter addon payment gateways *(`AddonGatewaysHandler.php:36`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/{$filter}_list_filter_query`** — Filter list filter query (DYNAMIC) *(`BaseFilter.php:962,971`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/{$filterName}_filter_options`** — Filter options for list page filters (DYNAMIC) *(`BaseFilter.php:995`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/{$filterName}_table_columns`** — Filter table columns for list pages (DYNAMIC) *(`BaseFilter.php:1038`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/advanced_filter_options_{$dataKey}`** — Filter advanced filter options (DYNAMIC) *(`AdvanceFilterController.php:46`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/{$filterName}_allowed_scopes`** — Filter the query scopes a list filter is allowed to apply (DYNAMIC) *(`app/Services/Filter/BaseFilter.php:743`)*
- **`fluent_cart/{$filterName}_allowed_withs`** — Filter the relationships a list filter is allowed to eager-load (DYNAMIC) *(`app/Services/Filter/BaseFilter.php:724`)*
- **`fluent_cart/utm/internal_domains`** — Filter the domains treated as "internal" for UTM/referrer attribution *(`app/Helpers/UtmHelper.php:45`)*
- **`fluent_cart/outside_addon/handle_cdn_install`** — Filter CDN addon installation *(`BackgroundInstaller.php:143`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/outside_addon/handle_install`** — Filter external addon installation *(`BackgroundInstaller.php:164`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/einvoice/buyer_vat_id`** — Pro — Filter the buyer VAT identifier written to the e-invoice *(`fluent-cart-pro/app/Services/Invoice/Mapper/En16931InvoiceMapper.php`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/einvoice/tax_category`** — Pro — Filter the derived EN 16931 VAT category for an e-invoice line *(`fluent-cart-pro/app/Services/Invoice/Mapper/En16931InvoiceMapper.php`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/license/checking_error`** — Pro — Filter license check error response *(`LicenseApiHandler.php:45,56`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/license/check_item_id`** — Pro — Filter item ID validation during license check *(`LicenseApiHandler.php:54`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/license/check_license_response`** — Pro — Filter license check API response *(`LicenseApiHandler.php:83`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/license/activate_license_response`** — Pro — Filter license activation API response *(`LicenseApiHandler.php:170,274`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/license/deactivate_license_response`** — Pro — Filter license deactivation API response *(`LicenseApiHandler.php:356`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/license/get_version_response`** — Pro — Filter version check API response *(`LicenseApiHandler.php:463`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart_sl/is_local_site`** — Pro — Filter local/staging site detection *(`fluent-cart-pro/app/Modules/Licensing/Models/LicenseSite.php:69`)*
- **`fluent_cart/license/staging_subdomain_patterns`** — Pro — Filter staging subdomain patterns *(`LicenseHelper.php:619`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/license/staging_subfolder_patterns`** — Pro — Filter staging subfolder patterns *(`LicenseHelper.php:620`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/license/staging_domains`** — Pro — Filter hosting provider staging domains *(`LicenseHelper.php:621`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/license/is_staging_site_result`** — Pro — Filter final staging site detection result *(`LicenseHelper.php:657`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/license/validity_by_variation`** — Pro — Filter license validity per variation *(`ProductLicenseController.php:74`)* → [filter-hooks-integrations-advanced.md](filter-hooks-integrations-advanced.md)
- **`fluent_cart/licensing/delete_license_on_order_deleted`** — Pro — Filter whether to delete license when order is deleted *(`license-actions.php:117`)*
- **`fluent_cart/licensing/revoke_license_on_payment_failed`** — Pro — Filter whether to revoke license on payment failure *(`LicenseGenerationHandler.php:123`)*
- **`fluent_cart/licensing/license_create_data`** — Pro — Filter license creation data *(`LicenseGenerationHandler.php:521`)*
- **`fluent_cart/license/expiration_date_by_variation`** — Pro — Filter license expiration date *(`LicenseHelper.php:81`)*
- **`fluent_cart/license/default_validity_by_variation`** — Pro — Filter default license validity *(`LicenseHelper.php:418`)*
- **`fluent_cart/license/grace_period_in_days`** — Pro — Filter license grace period *(`LicenseHelper.php:687`)*
- **`fluent_cart_sl/generate_license_key`** — Pro — Filter license key generation *(`UUID.php:32`)*
- **`fluent_cart_sl/issue_license_data`** — Pro — Filter license issue data *(`LicenseManager.php:257`)*
- **`fluent_sl/api_request_query_params`** — Pro — Filter API request query parameters *(`PluginUpdater.php:234`)*
- **`fluent_sl/updater_payload_{$slug}`** — Pro — Filter update check payload (DYNAMIC) *(`PluginUpdater.php:251`)*

## Filter Hooks — Orders & Payments

Full parameters and examples: [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md) · [source](https://dev.fluentcart.com/hooks/filters/orders-and-payments.html)

- **`fluent_cart/order_statuses`** — Filter available order statuses *(`app/Helpers/Status.php:164`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/editable_order_statuses`** — Filter manually settable order statuses *(`app/Helpers/Status.php:183`)*
- **`fluent_cart/payment_statuses`** — Filter payment statuses *(`app/Helpers/Status.php:190`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/transaction_statuses`** — Filter transaction statuses *(`app/Helpers/Status.php:205`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/editable_transaction_statuses`** — Filter manually editable transaction statuses *(`app/Helpers/Status.php:230`)*
- **`fluent_cart/transaction_success_statuses`** — Filter which statuses count as successful transactions *(`app/Helpers/Status.php:351`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/shipping_statuses`** — Filter shipping statuses *(`app/Helpers/Status.php:242`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/editable_shipping_statuses`** — Filter manually settable shipping statuses *(`app/Helpers/Status.php:259`)*
- **`fluent_cart/orders_list`** — Filter the admin orders list *(`app/Http/Controllers/OrderController.php:62`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/order/view`** — Filter single order view data *(`app/Http/Controllers/OrderController.php:691`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/widgets/single_order`** — Filter single order admin widgets *(`app/Http/Controllers/OrderController.php:1085`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/order/is_subscription_allowed_in_manual_order`** — Allow subscriptions in manual orders *(`app/Http/Controllers/OrderController.php:95`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/order/type`** — Filter order type during manual creation *(`app/Http/Controllers/OrderController.php:108`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/order/expected_license_count`** — Filter expected license count for an order *(`app/Http/Controllers/OrderController.php:314,696`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/create_receipt_number_on_order_create`** — Force receipt number generation on order creation *(`app/Models/Order.php:52`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/single_order_downloads`** — Filter order downloads data *(`app/Models/Order.php:1044`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/order_can_be_deleted`** — Filter whether an order can be deleted *(`app/Models/Order.php:1250`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/min_receipt_number`** — Filter the minimum receipt number *(`app/Services/OrderService.php:590`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/invoice_prefix`** — Filter the invoice number prefix *(`app/Services/OrderService.php:602`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/order_refund_manually`** — Intercept manual refund processing *(`app/Services/Payments/Refund.php:65`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/transaction/max_refundable_amount`** — Filter the maximum amount that can still be refunded on a transaction *(`app/Models/OrderTransaction.php:188`)*
- **`fluent_cart/order_status/auto_complete_digital_order`** — Control auto-completion of digital orders *(`app/Helpers/StatusHelper.php:281`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/customer/order_data`** — Filter customer portal order data *(`app/Http/Controllers/FrontendControllers/CustomerOrderController.php:337`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/customer/order_details_section_parts`** — Filter customer order detail sections *(`app/Http/Controllers/FrontendControllers/CustomerOrderController.php:344`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/order/custom_item_changed`** — Filter a custom order item's data before it's saved from the order edit screen *(`api/Resource/OrderItemResource.php:282`)*
- **`fluent_cart/order/delete_test_orders_batch_size`** — Filter the batch size for the "delete all test orders" bulk action *(`app/Http/Controllers/OrderController.php:955`)*
- **`fluent_cart/order/should_restore_stock_on_delete`** — Filter whether deleting an order restores its reserved/sold stock *(`app/Listeners/Order/OrderDeleting.php:89`)*
- **`fluent_cart/ipn_url_{$slug}`** — Filter IPN/webhook listener URL for a payment gateway *(`app/Services/Payments/PaymentHelper.php:27`)*
- **`fluent_cart/payment/validate_custom_item`** — Filter/validate the product and variation resolved for a custom order item during payment *(`app/Services/ProductItemService.php:53`)*
- **`fluent_cart/payment/success_url`** — Filter the payment success redirect URL *(`app/Services/Payments/PaymentHelper.php:69`)*
- **`fluent_cart/default_payment_method_for_zero_payment`** — Filter the default payment method for zero-total orders *(`app/Services/Payments/PaymentHelper.php:90`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/get_payment_connect_info_{$method}`** — Filter payment method connection info *(`api/PaymentMethods.php:105`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/transaction/url_{$payment_method}`** — Filter the vendor dashboard URL for a transaction *(`app/Models/OrderTransaction.php:129`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/transaction/receipt_page_url`** — Filter the transaction receipt page URL *(`app/Models/OrderTransaction.php:219`)*
- **`fluent_cart/pdf/can_generate_receipt`** — Filter whether PDF receipt generation is available *(`app/Services/OrderService.php:688`)*
- **`fluent_cart/pdf/generate_receipt`** — Generate (or return the path to) a PDF receipt for an order
- **`fluent_cart/stripe_settings`** — Filter Stripe gateway settings *(`app/Modules/PaymentMethods/StripeGateway/StripeSettingsBase.php:38`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/payments/stripe_metadata_subscription`** — Filter Stripe subscription metadata *(`app/Modules/PaymentMethods/StripeGateway/Processor.php:129`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/payments/stripe_metadata_onetime`** — Filter Stripe one-time payment metadata *(`app/Modules/PaymentMethods/StripeGateway/Processor.php:221`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/payments/stripe_onetime_intent_args`** — Filter Stripe payment intent arguments *(`app/Modules/PaymentMethods/StripeGateway/Processor.php:664`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/payments/stripe_checkout_session_args`** — Filter Stripe Checkout session arguments (one-time) *(`app/Modules/PaymentMethods/StripeGateway/Processor.php:356`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/payments/stripe_subscription_checkout_session_args`** — Filter Stripe Checkout session arguments (subscription) *(`app/Modules/PaymentMethods/StripeGateway/Processor.php:976`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/stripe/client_setup_future_usage`** — Filter the client-side `setup_future_usage` value for a Stripe PaymentIntent *(`app/Modules/PaymentMethods/StripeGateway/Stripe.php:851`)*
- **`fluent_cart/stripe_idempotency_key`** — Filter the Stripe idempotency key *(`app/Modules/PaymentMethods/StripeGateway/API/ApiRequest.php:116`)*
- **`fluent_cart/stripe_request_body`** — Filter the Stripe API request body *(`app/Modules/PaymentMethods/StripeGateway/API/ApiRequest.php:127`)*
- **`fluent_cart/form_disable_stripe_connect`** — Disable Stripe Connect provider option *(`app/Modules/PaymentMethods/StripeGateway/Stripe.php:584`)*
- **`fluent_cart/stripe_appearance`** — Style the embedded Stripe Payment Element *(`app/Modules/PaymentMethods/StripeGateway/Stripe.php`)*
- **`fluent_cart/stripe_elements_fonts`** — Load custom fonts into the Stripe Payment Element *(`app/Modules/PaymentMethods/StripeGateway/Stripe.php`)*
- **`fluent_cart/stripe/setup_intent_rate_limit_customer_daily`** — Filter the daily SetupIntent rate limit per customer *(`app/Modules/PaymentMethods/StripeGateway/SubscriptionsManager.php:92,108`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/stripe/fallback_order_transaction`** — Provide a fallback transaction for Stripe webhook events *(`app/Modules/PaymentMethods/StripeGateway/Webhook/Webhook.php:171`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/paypal_plan_id`** — Filter the PayPal plan ID for subscriptions *(`app/Modules/PaymentMethods/PayPalGateway/PayPalHelper.php:54`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/payments/paypal_sdk_src`** — Filter the PayPal SDK JavaScript source URL *(`app/Modules/PaymentMethods/PayPalGateway/PayPal.php:1179`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/payments/paypal/disable_webhook_verification`** — Disable PayPal webhook signature verification *(`app/Modules/PaymentMethods/PayPalGateway/IPN.php:358`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/payments/paypal/verify_webhook`** — Control PayPal webhook verification *(`app/Modules/PaymentMethods/PayPalGateway/IPN.php:481`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/paypal/vault_attributes`** — Filter PayPal Vault v3 attributes when saving a buyer for auto-charge *(`app/Modules/PaymentMethods/PayPalGateway/Processor.php:226`)*
- **`fluent_cart/payments/paypal_vault_one_time`** — Filter whether a one-time PayPal order should vault the buyer's payment method *(`app/Modules/PaymentMethods/PayPalGateway/Processor.php:214`)*
- **`fluent_cart/payments/paypal_vault_rejection_issues`** — Filter which PayPal error codes are treated as a vaulting rejection *(`app/Modules/PaymentMethods/PayPalGateway/Processor.php:50`)*
- **`fluent_cart/tax/country_tax_titles`** — Filter tax title labels per country *(`app/Modules/Tax/TaxModule.php`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/tax_summary_should_render`** — Filter whether the tax summary is rendered for an order receipt *(`app/Services/Renderer/Receipt/TaxSummaryHelper.php`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/mollie_settings`** — Pro — Filter Mollie gateway settings *(`fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/MollieSettingsBase.php:26`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/payments/mollie_payment_args`** — Pro — Filter Mollie payment data *(`fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/MollieProcessor.php:169`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/mollie/pass_line_items_details`** — Pro — Control whether line item details are passed to Mollie *(`fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/MollieProcessor.php:155`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/mollie/webhook_url`** — Pro — Filter the Mollie webhook URL *(`fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/MollieProcessor.php:341`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/mollie/subscription_description`** — Pro — Filter the Mollie subscription description *(`fluent-cart-pro/app/Modules/PaymentMethods/MollieGateway/MollieHelper.php:209`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/paddle_product_tax_category`** — Pro — Filter Paddle product tax category *(`fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/Product.php`)* → [filter-hooks-orders-payments.md](filter-hooks-orders-payments.md)
- **`fluent_cart/paddle_onetime_price_id`** — Pro — Filter Paddle one-time price ID *(`fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`)*
- **`fluent_cart/paddle_recurring_price_id`** — Pro — Filter Paddle recurring price ID *(`fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`)*
- **`fluent_cart/paddle_discount_id`** — Pro — Filter Paddle discount ID *(`fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`)*
- **`fluent_cart/paddle_pin_checkout_currency`** — Pro — Control whether Paddle checkout is pinned to the order currency *(`fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`)*
- **`fluent_cart/paddle_subscription_product_type`** — Pro — Filter Paddle subscription product type *(`fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`)*
- **`fluent_cart/paddle_subscription_price_type`** — Pro — Filter Paddle subscription price type *(`fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`)*
- **`fluent_cart/paddle_signup_fee_price_type`** — Pro — Filter Paddle signup fee price type *(`fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`)*
- **`fluent_cart/paddle_product_id`** — Pro — Filter Paddle one-time product ID *(`fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`)*
- **`fluent_cart/paddle_onetime_product_type`** — Pro — Filter Paddle one-time product type *(`fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`)*
- **`fluent_cart/paddle_onetime_price_type`** — Pro — Filter Paddle one-time price type *(`fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`)*
- **`fluent_cart/paddle_addon_product_type`** — Pro — Filter Paddle add-on product type *(`fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`)*
- **`fluent_cart/paddle_discount_mode`** — Pro — Filter Paddle discount mode *(`fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/`)*
- **`fluent_cart/authorize_dot_net_supported_currencies`** — Pro — Filter Authorize.net supported currencies *(`fluent-cart-pro/app/Modules/PaymentMethods/AuthorizeDotNetGateway/`)*
- **`fluent_cart/authorize_dot_net/transaction_request`** — Pro — Filter the Authorize.net transaction request before it is sent to the API *(`fluent-cart-pro/app/Modules/PaymentMethods/AuthorizeDotNetGateway/AuthorizeDotNetProcessor.php:71`)*
- **`fluent_cart/authorize_dot_net/order_description`** — Pro — Filter the order description sent to Authorize.net *(`fluent-cart-pro/app/Modules/PaymentMethods/AuthorizeDotNetGateway/AuthorizeDotNetHelper.php:234`)*
- **`fluent_cart/should_send_email_notification`** — Control whether an automatic email notification should be sent
- **`fluent_cart/email_notification/mailer`** — Modify the fully prepared Mailer immediately before it sends
- **`fluent_cart/paddle_allowed_email_notifications`** — Pro — Control which email notifications are allowed for Paddle orders

## Filter Hooks — Products & Pricing

Full parameters and examples: [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md) · [source](https://dev.fluentcart.com/hooks/filters/products-and-pricing.html)

- **`fluent_cart/products_list`** — Filter the admin products list *(`app/Http/Controllers/ProductController.php:59`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/shop_query`** — Filter the shop product query builder *(`api/Resource/ShopResource.php:100`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/single_product/variation_view_type`** — Filter the variation display type on single product pages *(`app/Services/Renderer/ProductRenderer.php:67`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/single_product/variation_column_type`** — Filter the variation column layout on single product pages *(`app/Services/Renderer/ProductRenderer.php:74`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/single_product/variation_price`** — Filter the variation price text displayed on single product pages *(`app/Services/Renderer/ProductRenderer.php:1213`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/shop_app_product_query_taxonomy_filters`** — Filter taxonomy filters for the Shop block product query *(`app/Hooks/Handlers/BlockEditors/ShopApp/InnerBlocks/InnerBlocks.php:1379`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/products_views/preload_collection_{$provider}`** — Preload product view collection for a template provider *(`app/Http/Controllers/ShopController.php:133`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/product/card_classes`** — Filter the CSS classes on a product card wrapper *(`app/Services/Renderer/RenderGate.php:142`)*
- **`fluent_cart/product/display_price`** — Filter the price shown on a product card or single product page *(`app/Services/Renderer/ProductCardRender.php:272`)*
- **`fluent_cart/product/gallery_variation_data`** — Filter the variant-to-gallery-image mapping for advanced-variation products *(`app/Services/Renderer/ProductRenderer.php:467`)*
- **`fluent_cart/product/get_response_data`** — Filter the admin product editor's "get product" API response payload *(`app/Http/Controllers/ProductController.php:799`)*
- **`fluent_cart/product/price_suffix_context`** — Filter the context passed to the price suffix renderer *(`app/Services/Renderer/RenderHelper.php:20`)*
- **`fluent_cart/product/render_advanced_variation`** — Let an add-on render the variation selector for advanced-variation products *(`app/Services/Renderer/ProductRenderer.php:350`)*
- **`fluent_cart/product/render_source`** — Filter which render source/provider is currently active *(`app/Services/Renderer/RenderContext.php:89`)*
- **`fluent_cart/product/show_section`** — Generic filter for whether any product render section should be shown *(`app/Services/Renderer/RenderGate.php:109`)*
- **`fluent_cart/product/show_{$section}`** — Filter whether a specific product render section should be shown *(`app/Services/Renderer/RenderGate.php:107`)*
- **`fluent_cart/reviews/star_svg`** — Replace the SVG star used for every server-rendered rating *(`app/Services/Renderer/ReviewThreadMarkup.php:455`)*
- **`fluent_cart/product/buy_now_button_text`** — Filter the Buy Now button text *(`app/Services/Renderer/ProductRenderer.php:1500,1606`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/product/add_to_cart_text`** — Filter the Add to Cart button text *(`app/Services/Renderer/ProductRenderer.php:1659,1775`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/product/out_of_stock_text`** — Filter the out-of-stock button text *(`app/Hooks/Handlers/ShortCodes/SingleProductShortCode.php:91`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/product/out_of_stock_button_text`** — Filter the out-of-stock button text (block editor variant) *(`app/Modules/Templating/AssetLoader.php:314`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/product/price_suffix_atts`** — Filter the price suffix for product variations *(`app/Services/Renderer/ProductRenderer.php:1408`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/product_short_description`** — Filter the product short description *(`app/Hooks/Handlers/TemplateLoader.php:26`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/product_stock_availability`** — Filter product stock availability information *(`app/Models/ProductDetail.php:183`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/price_class`** — Filter the price element CSS class *(`app/Hooks/Handlers/TemplateLoader.php:40`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/front_url_slug`** — Filter the product URL slug *(`app/CPT/FluentProducts.php:171`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/product_url_with_front`** — Filter whether the product URL includes the front base *(`app/CPT/FluentProducts.php:172`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/show_standalone_product_menu`** — Filter whether to show a standalone Products menu in the WordPress admin *(`app/CPT/FluentProducts.php:37`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/single_product_page/show_relevant_products`** — Filter whether to show related products on the single product page *(`app/Modules/Templating/TemplateActions.php:277`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/related_products/query_args`** — Filter the WP_Query *(`api/Resource/ShopResource.php:346-356`)*
- **`fluent_cart/disable_auto_single_product_page`** — Disable automatic single product page rendering *(`app/Modules/Templating/TemplateActions.php:191,215`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/coupon/validating_coupon`** — Filter the coupon code during validation *(`app/Services/Coupon/Concerns/CanValidateCoupon.php:21`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/coupon/can_use_coupon`** — Filter whether a coupon can be used *(`app/Services/Coupon/DiscountService.php:299`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/coupon/will_skip_item`** — Filter whether an item should be skipped from coupon discount *(`app/Services/Coupon/DiscountService.php:321`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/coupon/per_customer_usage_query`** — Filter the per-customer coupon usage query *(`app/Services/Coupon/DiscountService.php:729`)* → [filter-hooks-products-pricing.md](filter-hooks-products-pricing.md)
- **`fluent_cart/coupon/resolve_coupons`** — Filter the coupons resolved for a cart or order *(`app/Services/Coupon/DiscountService.php:96`)*
- **`fluent_cart/discount/pre_apply`** — Filter the cart items before a coupon discount is applied *(`app/Services/Coupon/DiscountService.php:227`)*
- **`fluent_cart/coupon_statuses`** — Filter the available coupon statuses *(`app/Helpers/Helper.php:1014`)*
- **`fluent_cart/attribute_groups/max_reorder`** — Filter the maximum number of attribute groups allowed in one reorder request *(`app/Http/Controllers/AttributesController.php:205`)*
- **`fluent_cart/item_attributes`** — Filter the resolved attribute rows for a product variation *(`app/Helpers/AttributeHelper.php:138,191`)*
- **`fluent_cart/item_display_attr`** — Filter the display-ready attribute rows for a line item *(`app/Helpers/AttributeHelper.php:346`)*
- **`fluent_cart/item_display_attr_string`** — Filter the combined attribute display string for a line item *(`app/Helpers/AttributeHelper.php:418`)*
- **`fluent_cart/item_display_attr_{$key}`** — Filter one third-party attribute's display row *(`app/Helpers/AttributeHelper.php:333`)*
- **`fluent_cart/product/variant_option_payload`** — Filter/pre-process the variant-option sync payload *(`api/Resource/ProductResource.php:569`)*
- **`fluent_cart/product/variant_option_sync`** — Let an add-on take over a variant-option sync request *(`api/Resource/ProductResource.php:578`)*
- **`fluent_cart/product/variant_save_data`** — Filter a single variant's data before a batch save *(`api/Resource/ProductResource.php:281`)*
- **`fluent_cart/product_statuses`** — Filter the available product statuses *(`app/Helpers/Status.php:115`)*
- **`fluent_cart/variation_types`** — Filter the available product variation types *(`app/Helpers/Helper.php:788`)*

## Filter Hooks — Settings & Configuration

Full parameters and examples: [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md) · [source](https://dev.fluentcart.com/hooks/filters/settings-and-configuration.html)

- **`fluent_cart/store_settings/values`** — Filter default store settings values *(`api/StoreSettings.php:115`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/store_settings/fields`** — Filter store settings form field definitions *(`api/StoreSettings.php:1380`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/store_setting_fields`** — Filter the store settings fields payload (legacy hook name) *(`api/StoreSettings.php:122`)*
- **`fluent_cart/store_settings/rules`** — Filter validation rules for store settings *(`app/Http/Requests/FluentMetaRequest.php:37`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/store_settings/sanitizer`** — Filter sanitization rules for store settings *(`app/Http/Requests/FluentMetaRequest.php:174`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/confirmation_setting_fields`** — Filter confirmation page settings fields *(`api/Confirmation.php:76`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/module_setting/fields`** — Filter module settings form fields *(`api/ModuleSettings.php:21`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/module_setting/default_values`** — Filter module settings default values *(`api/ModuleSettings.php:42`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/module_settings/plugin_addons`** — Filter plugin add-on modules list *(`app/Http/Controllers/ModuleSettingsController.php:328`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/global_currency_setting`** — Filter global currency settings *(`api/CurrencySettings.php:52`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/available_currencies`** — Filter available currencies for the store *(`app/Helpers/Helper.php:661`)*
- **`fluent_cart/accepted_currencies`** — Filter the full list of accepted currencies *(`app/Helpers/CurrenciesHelper.php:20`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/global_currency_symbols`** — Filter currency symbols map *(`app/Helpers/CurrenciesHelper.php:195`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/zero_decimal_currencies`** — Filter zero-decimal currencies list *(`app/Helpers/CurrenciesHelper.php:383`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/hide_unnecessary_decimals`** — Filter whether to hide .00 decimals in formatted prices *(`app/Helpers/Helper.php:486`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/admin_menu_title`** — Filter admin menu title *(`app/Hooks/Handlers/MenuHandler.php:226`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/admin_menu_position`** — Filter admin menu position *(`app/Hooks/Handlers/MenuHandler.php:235`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/admin_filter_options`** — Filter admin filter options for list pages *(`app/Hooks/Handlers/MenuHandler.php:476`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/admin_app_data`** — Filter admin Vue app localized data *(`app/Hooks/Handlers/MenuHandler.php:514`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/admin_notices`** — Filter admin notices *(`app/Hooks/Handlers/MenuHandler.php:571`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/admin_base_url`** — Filter admin base URL *(`app/Helpers/AdminHelper.php:22`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/product_admin_items`** — Filter admin product action menu items *(`app/Helpers/AdminHelper.php:30`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/global_admin_menu_items`** — Filter global admin navigation menu *(`app/Helpers/AdminHelper.php:127`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/global_admin_menu_more_items`** — Filter the "More" overflow items in the global admin navigation *(`app/Helpers/AdminHelper.php:155`)*
- **`fluent_cart/dummy_product_info`** — Filter dummy product for onboarding *(`app/Hooks/Handlers/MenuHandler.php:556`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/generatable_pages`** — Filter the pages FluentCart can auto-generate *(`app/CPT/Pages.php:42`)*
- **`fluent_cart/pro_upgrade_base_url`** — Filter the base URL used for "Upgrade to Pro" links *(`app/Helpers/Helper.php:89`)*
- **`fluent_cart/show_admin_top_bar`** — Filter whether the FluentCart admin top bar is rendered
- **`fluent_cart/storage/storage_driver_settings_routes`** — Filter storage driver admin routes *(`app/Hooks/Handlers/MenuHandler.php:461`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/admin_table_saved_views`** — Filter the saved-views config injected into admin list tables *(`app/Hooks/Handlers/MenuHandler.php:493`)*
- **`fluent_cart/filter/supported_operators`** — Filter the comparison operators an admin-table filter supports *(`app/Services/Filter/BaseFilter.php:1134`)*
- **`fluent_cart/filter_resolve_saved_view`** — Filter used to resolve a saved-view slug for an admin-table filter *(`app/Services/Filter/BaseFilter.php:348`)*
- **`fluent_cart/generatable_pages`** — Filter the list of pages the Pages Setup screen can generate *(`app/CPT/Pages.php:19`)*
- **`fluent_cart/dashboard/page_setup_redirect_url`** — Filter the dashboard link for an incomplete page setup step *(`app/Http/Controllers/DashboardController.php:77`)*
- **`fluent_cart/{$filterName}_table_sorts`** — Filter the sort options for a list page's table (DYNAMIC) *(`app/Services/Filter/BaseFilter.php:1523`)*
- **`fluent_cart/permission/all_roles`** — Filter permission roles *(`app/Services/Permission/PermissionManager.php:98`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/advanced_filter_options_permission_{$dataKey}`** — Filter whether the current user can access a specific advanced-filter option *(`app/Http/Controllers/AdvanceFilter/AdvanceFilterController.php:116`)*
- **`fluent_cart/admin_translations`** — Filter admin panel translations *(`app/Services/Translations/TransStrings.php:9`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/blocks_translations`** — Filter block editor translations *(`app/Services/Translations/TransStrings.php:15`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/customer_profile_translations`** — Filter customer profile translations *(`app/Services/Translations/TransStrings.php:87`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/checkout_translations`** — Filter checkout page translations *(`app/Services/Translations/TransStrings.php:105`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/payments_translations`** — Filter payment translations *(`app/Services/Translations/TransStrings.php:111`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart_pro/admin_translations`** — Pro — Filter Pro admin translations *(`fluent-cart-pro/app/Services/Translations/Translations.php:24`)*
- **`fluent_cart/email_notifications`** — Filter email notification settings *(`app/Services/Email/EmailNotifications.php:24`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/admin_email/notification_recipient`** — Filter the resolved admin recipient address for a notification email *(`app/Services/Email/EmailNotificationMailer.php:362`)*
- **`fluent_cart/email_notification_data`** — Filter the notification payload shown in the email settings editor *(`app/Http/Controllers/EmailNotificationController.php:61`)*
- **`fluent_cart/prepare_email_template_data`** — Filter a notification's settings before saving, with the template body stripped *(`app/Http/Controllers/EmailNotificationController.php:89`)*
- **`fluent_cart/email/template_view_path`** — Filter the view path used to render an email template *(`app/Services/TemplateService.php:25`)*
- **`fluent_cart/parse_email_block_content`** — Filter used to parse block-editor markup into rendered email HTML
- **`fluent_cart/keep_email_body_draft`** — Filter whether to prevent email body reset *(`app/Services/Email/EmailNotifications.php:741`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/theme_pref`** — Filter email template theme preferences *(`app/Services/Email/FluentBlockParser.php:1997`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/condition_presets`** — Filter email condition presets *(`app/Services/Email/ConditionPresets.php:124`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/evaluate_condition_preset`** — Pro — Filter evaluate condition preset *(`app/Services/Email/Blocks/BaseBlock.php:196`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/confirmation_shortcodes`** — Filter confirmation page shortcodes *(`app/Helpers/EditorShortCodeHelper.php:205`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/editor_shortcodes`** — Filter email editor shortcodes *(`app/Helpers/EditorShortCodeHelper.php:297`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/disable_email_celebration_messages`** — Filter whether to disable celebration messages in admin emails *(`app/Services/TemplateService.php:124`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/store_digest/data`** — Filter the fully-assembled store digest email payload *(`app/Services/Email/StoreDigestService.php:347`)*
- **`fluent_cart/store_digest/recipients`** — Filter who receives the store digest email *(`app/Services/Email/StoreDigestService.php:492`)*
- **`fluent_cart/store_digest/pro_url`** — Filter the "Upgrade to Pro" link shown in the free-plugin digest email *(`app/Services/Email/StoreDigestService.php:311`)*
- **`fluent_cart/report/sanitize_params_rules`** — Filter the sanitization rules applied to report request parameters *(`app/Services/Report/ReportHelper.php:202`)*
- **`fluent_cart/report/sources_query`** — Filter the query builder behind the UTM/sources report *(`app/Services/Report/SourceReportService.php:49`)*
- **`fluent_cart/block_editor_require_nonce`** — Pro — Filter whether the block editor requires nonce verification *(`app/Hooks/Handlers/FluentCartBlockEditorHandler.php:54`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/disable_pro_email_templates`** — Filter whether to disable Pro email templates *(`app/Hooks/Handlers/FluentCartBlockEditorHandler.php:230`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart_editor/skip_no_conflict`** — Pro — Filter whether to skip script unloading in the block editor *(`app/Hooks/Handlers/FluentCartBlockEditorHandler.php:717`)*
- **`fluent_cart_editor/asset_listed_slugs`** — Pro — Filter approved script slugs in block editor *(`app/Hooks/Handlers/FluentCartBlockEditorHandler.php:729`)*
- **`fluent_cart/skip_no_conflict`** — Pro — Filter whether to skip style unloading in the block editor *(`app/Hooks/Handlers/FluentCartBlockEditorHandler.php:786`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/asset_listed_slugs`** — Pro — Filter approved style slugs in block editor *(`app/Hooks/Handlers/FluentCartBlockEditorHandler.php:799`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/block_editor_unregister_all_patterns`** — Pro — Filter whether to unregister default block patterns *(`app/Hooks/Handlers/FluentCartBlockEditorHandler.php:843`)* → [filter-hooks-settings-configuration.md](filter-hooks-settings-configuration.md)
- **`fluent_cart/block_editor_settings`** — Pro — Filter block editor settings *(`app/Hooks/Handlers/FluentCartBlockEditorHandler.php:1224`)*
- **`fluent_cart/editor_allowed_block_types`** — Pro — Filter allowed block types in the email editor *(`app/Hooks/Handlers/FluentCartBlockEditorHandler.php:1385`)*
- **`fluent_cart/pdf_templates/mpdf_config`** — Filter the mPDF library configuration used to generate PDFs *(`app/Services/PDF/PdfGeneratorService.php:61`)*
- **`fluent_cart/logs/allowed_models`** — Filter models allowed in activity logs *(`boot/globals.php:88`)*
- **`fluent_cart/site_prefix`** — Filter site prefix for external APIs *(`app/Helpers/Helper.php:1685`)*
- **`fluent_cart/utm/allowed_keys`** — Filter allowed UTM parameter keys *(`app/Helpers/UtmHelper.php:34`)*
- **`fluent_cart/cleanup/old_carts_days`** — Filter days before abandoned cart cleanup *(`app/Hooks/Scheduler/AutoSchedules/DailyScheduler.php:32`)*
- **`fluent_cart/frontend_assets/should_load_global`** — Filter whether FluentCart's global frontend assets should load on the current page *(`app/Modules/Templating/AssetLoader.php:44`)*
- **`fluent_cart/util/countries`** — Filter the countries list used in address selectors *(`app/Helpers/Helper.php:1347`)*
- **`fluent_cart/get_dynamic_search_{$key}`** — Filter dynamic search option results *(`api/Helper.php:165`)*

## Filter Hooks — Modules

[source](https://dev.fluentcart.com/hooks/filters/modules.html)

- **`fluent_cart/advanced_variation/asset_page_types`** — Filter which frontend page types load the advanced-variation selector assets *(`app/Hooks/Handlers/AdvancedVariationHandler.php:161`)*
- **`fluent_cart/advanced_variation/max_combinations`** — Filter the maximum projected variant combinations allowed per product *(`app/Services/AdvancedVariationService.php:162`)*
- **`fluent_cart/advanced_variation/max_groups_per_save`** — Filter the maximum number of attribute groups allowed per save *(`app/Services/AdvancedVariationService.php:130`)*
- **`fluent_cart/advanced_variation/max_terms_per_save`** — Filter the maximum number of unique attribute terms allowed per save *(`app/Services/AdvancedVariationService.php:146`)*
- **`fluent_cart/mcp_ability_names`** — Filter the fully-qualified ability names exposed by the MCP server *(`app/Modules/MCP/MCPInit.php:130`)*
- **`fluent_cart/mcp_advanced_search_entities`** — Filter the entities available to the MCP advanced-search tool *(`app/Modules/MCP/Support/AdvancedSearch.php:102`)*
- **`fluent_cart/mcp_allow_live_gateway`** — Filter whether MCP tools may perform live (real-money) gateway actions *(`app/Modules/MCP/Support/WriteGuard.php:186`)*
- **`fluent_cart/mcp_customer_data`** — Filter the customer payload returned by MCP customer tools *(`app/Modules/MCP/Tools/CustomerTools.php:435`)*
- **`fluent_cart/mcp_customer_include_sections`** — Filter the section names offered in the MCP get-customer tool's include[] enum *(`app/Modules/MCP/Tools/CustomerTools.php:141`)*
- **`fluent_cart/mcp_enums`** — Filter the enum reference map returned by get-store-context *(`app/Modules/MCP/Tools/ContextTools.php:254`)*
- **`fluent_cart/mcp_expose_error_details`** — Filter whether MCP tool errors include file/line and stack trace details *(`app/Modules/MCP/AbilitiesRegistrar.php:323`)*
- **`fluent_cart/mcp_guidelines`** — Filter the top-level usage guidelines returned by get-store-context *(`app/Modules/MCP/Tools/ContextTools.php:426`)*
- **`fluent_cart/mcp_is_local_dev`** — Filter whether the current request is treated as local development for MCP settings *(`app/Http/Controllers/McpSettingsController.php:273`)*
- **`fluent_cart/mcp_order_data`** — Filter the order payload returned by MCP order tools *(`app/Modules/MCP/Tools/OrderTools.php:532`)*
- **`fluent_cart/mcp_order_include_sections`** — Filter the section names offered in the MCP get-order tool's include[] enum *(`app/Modules/MCP/Tools/OrderTools.php:567`)*
- **`fluent_cart/mcp_server_namespace`** — Filter the REST namespace the FluentCart MCP server is registered under *(`app/Modules/MCP/MCPInit.php:133`)*
- **`fluent_cart/mcp_server_route`** — Filter the REST route the FluentCart MCP server is registered under *(`app/Modules/MCP/MCPInit.php:134`)*
- **`fluent_cart/mcp_tool_index`** — Filter the tool index returned by get-store-context *(`app/Modules/MCP/Tools/ContextTools.php:408`)*

## Filter Hooks — Pro Modules

[source](https://dev.fluentcart.com/hooks/filters/pro-modules.html)

- **`fluent_cart/inventory_low_stock_threshold`** — Pro — Sets the low-stock boundary *(`fluent-cart-pro/app/Modules/AdvancedInventory/Http/Controllers/AdvancedInventoryController.php:18`)*
- **`fluent_cart/saved_views_permission_map`** — Pro — Maps admin tables to the capability required to use their saved views *(`fluent-cart-pro/app/Http/Policies/SavedViewsPolicy.php:29`)*
- **`fluent_cart/licensing/enable_signed_releases`** — Pro — Turns on release manifest signing *(`fluent-cart-pro/app/Modules/Licensing/Services/ReleaseSignature.php:61`)*
- **`fluent_cart/licensing/release_public_keys`** — Pro — Supplies the trusted public keys for verifying release signatures *(`fluent-cart-pro/app/Modules/Licensing/Services/ReleaseSignature.php:100`)*
- **`fluent_cart_sl/encoded_package_url`** — Pro — Rewrites the download URL issued for a licensed package *(`fluent-cart-pro/app/Modules/Licensing/Services/LicenseManager.php:152`)*
- **`fluent_cart/license/sanitized_url`** — Pro — Adjusts how an activating site's URL is normalised *(`fluent-cart-pro/app/Modules/Licensing/Services/LicenseHelper.php:39`)*
- **`fluent_cart/paddle/checkout_custom_data`** — Pro — Adds custom data to a Paddle checkout *(`fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/PaddleHelper.php:274`)*
- **`fluent_cart/paddle_product_custom_data`** — Pro — Adds custom data to a Paddle catalog product *(`fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/Product.php:24`)*
- **`fluent_cart/paddle/webhook_auto_recover_enabled`** — Pro — Controls the signature-failure recovery path *(`fluent-cart-pro/app/Modules/PaymentMethods/PaddleGateway/Webhook/IPN.php:76`)*
- **`fluent_cart/saved_payment_methods/consent_checked_by_default`** — Pro — Pre-checks the "save my payment method" consent box *(`fluent-cart-pro/app/Modules/SavedPaymentMethods/Checkout/CheckoutSaveHandler.php:126`)*
- **`fluent_cart/pdf_einvoice_data`** — Pro — Modifies the ZUGFeRD e-invoice payload before embedding *(`fluent-cart-pro/app/Services/PDF/OrderReceiptPdfService.php:92`)*
- **`fluent_cart/render_block_email_template`** — Renders block markup into an email body *(`fired`)*
- **`fluent_cart_pro/disable_pro_email_templates`** — Pro — Hides the Pro starter email templates *(`fluent-cart-pro/app/Hooks/Handlers/FluentCartBlockEditorHandler.php:247`)*
- **`fluent_cart/learndash/before_set_user_course_expiry`** — Pro — Adjusts LearnDash course access expiry *(`fluent-cart-pro/app/Modules/Integrations/LMS/LearnDashLMSConnect.php:238`)*
- **`fluent_cart/sanitize_user_meta`** — Pro — Controls per-field sanitization of synced WP user meta *(`fluent-cart-pro/app/Modules/Integrations/WPUserConnect.php:219`)*
- **`fluent_cart_pro/blocks_translations`** — Pro — Overrides the block editor's translation strings *(`fluent-cart-pro/app/Services/Translations/Translations.php:30`)*
- **`fluent_cart/payment_addons`** — Pro — Registers installable payment add-ons *(`fluent-cart-pro/app/Services/BackgroundInstaller.php:373`)*
- **`fluent_cart_pro/licensed_addons/allowed_hosts`** — Pro — Allowlists hosts that may serve licensed add-on downloads *(`fluent-cart-pro/app/Services/BackgroundInstaller.php:271`)*

## Deprecated & Removed Hooks

[source](https://dev.fluentcart.com/hooks/deprecated.html)

FluentCart retires a hook through `do_action_deprecated()` / `apply_filters_deprecated()` for at least one release before removing it. While deprecated the old name still fires, so existing integrations keep working, but it logs a notice. Check this table before trusting an old name.

### Deprecated — still fires, not yet removed

| Hook | Deprecated in | Replacement | Scheduled removal | Docs |
| --- | --- | --- | --- | --- |
| `fluent_cart/transaction/receipt_page_url (PayPal redirect only)` | `1.6.2` | `fluent_cart/payment/success_url` | `Not yet scheduled` | `Orders & Payments` |

### Core (22)

| # | Removed hook | Replacement |
| --- | --- | --- |
| `1` | `fluent-cart/order_statuses` | `fluent_cart/order_statuses` |
| `2` | `fluent-cart/editable_order_statuses` | `fluent_cart/editable_order_statuses` |
| `3` | `fluent-cart/editable_customer_statuses` | `fluent_cart/editable_customer_statuses` |
| `4` | `fluent-cart/shipping_statuses` | `fluent_cart/shipping_statuses` |
| `5` | `fluent-cart/transaction_statuses` | `fluent_cart/transaction_statuses` |
| `6` | `fluent-cart/editable_transaction_statuses` | `fluent_cart/editable_transaction_statuses` |
| `7` | `fluent-cart/available_currencies` | `fluent_cart/available_currencies` |
| `8` | `fluent-cart/coupon_statuses` | `fluent_cart/coupon_statuses` |
| `9` | `fluent-cart/util/countries` | `fluent_cart/util/countries` |
| `10` | `fluentcart/transaction/receipt_page_url` | `fluent_cart/transaction/receipt_page_url` |
| `11` | `fluent-cart/after_render_payment_method_{$route}` | `fluent_cart/after_render_payment_method_{$route}` |
| `12` | `fluent_cart_stripe_idempotency_key` | `fluent_cart/stripe_idempotency_key` |
| `13` | `fluent_cart_stripe_request_body` | `fluent_cart/stripe_request_body` |
| `14` | `fluent_cart_form_disable_stripe_connect` | `fluent_cart/form_disable_stripe_connect` |
| `15` | `fluent_cart_stripe_appearance` | `fluent_cart/stripe_appearance` |
| `16` | `fluent_cart_template_part_content` | `fluent_cart/template_part_content` |
| `17` | `fluent_cart_template_part_content_{$slug}` | `fluent_cart/template_part_content_{$slug}` |
| `18` | `fluent_cart_template_part_output` | `fluent_cart/template_part_output` |
| `19` | `fluent_cart_template_part_output_{$slug}` | `fluent_cart/template_part_output_{$slug}` |
| `20` | `fluent_cart_ipn_url_{$slug}` | `fluent_cart/ipn_url_{$slug}` |
| `21` | `fluent_cart/afrer_checkout_page_start` | `fluent_cart/after_checkout_page_start` |
| `22` | `fluent_cart_payment_method_list_class` | `fluent_cart/payment_method_list_class` |

### Pro (3)

| # | Removed hook | Replacement |
| --- | --- | --- |
| `23` | `fluentcart/sanitize_user_meta` | `fluent_cart/sanitize_user_meta` |
| `24` | `fluent_cart/license/santized_url` | `fluent_cart/license/sanitized_url` |
| `25` | `fluent_cart_sl_encoded_package_url` | `fluent_cart_sl/encoded_package_url` |
