<!--
Source:    https://docs.lemonsqueezy.com/api
Topic:     Developer guide — authentication, requests, responses, errors
Retrieved: 2026-10-28 (date added to this repo; no scrape timestamp was recorded)
-->


Docs
→
Guides
→
Developer Guide
Getting Started with the API
Learn how to set up and use the Lemon Squeezy API, from creating API keys to making authenticated requests and understanding the API’s structure and capabilities.

Before diving into this guide, ensure that you have a Lemon Squeezy account. New to Lemon Squeezy? Check out our Getting Started guide to set up your account.

Create an API key
To access our API endpoints, you’ll need to create an API key. You can create one by navigating to Settings » API in your Lemon Squeezy dashboard. This key will authenticate your requests and allow you to interact with our API securely.

Lemon Squeezy: Create API Key
Create a new API key and give it a clear name. If you think you’ll need more than one key, pick names that you and your team can easily understand. Keep in mind that you can’t change these names later, so choose them carefully.

After you submit the form, you’ll see your new API key. Make sure to copy it and save it somewhere safe. Remember, you’ll only see this key once in the Lemon Squeezy dashboard, so don’t lose it!

Lemon Squeezy: API Key Copy
Make sure you keep your API keys private. Never save API keys in your code or in Github. Instead use environment files and, for an extra level of security, rotate API keys regularly.

If you lose an API key, you can always make new ones or remove old ones from the Settings » API page in your Lemon Squeezy dashboard.

Making requests
The Lemon Squeezy API can be accessed from <https://api.example.com/v1/>. All requests should be made over HTTPS and every request requires authentication.

The API is based on the JSON:API spec and as such you are required to add the following headers in each request.

Accept: application/vnd.api+json
Content-Type: application/vnd.api+json
Authentication
The API uses Bearer authentication for all requests. This would be the API key that you previously created in step 1.

To authenticate, add an Authorization header to all requests containing a valid API key:

Authorization: Bearer {api_key}
In total, you need three headers when making requests to our API:

Accept
Content-Type
Authorization
For more information about authentication and rate limiting, please visit the API reference.

API overview
The Lemon Squeezy API covers all data types used in your store such as Products, Customers, Discounts and Files.

You can use the API to manage your store as well as set up payments for customers, access prior orders and manage ongoing subscriptions and software license keys.

Some examples of what’s possible with the API:

Show what you’re selling inside your app
Create checkout links to sign up new subscribers
Create custom-priced checkouts for certain customers
Access customer details and a list of their previous orders
Create discount codes on-the-fly
Activate and validate license keys
Upgrade, downgrade, cancel, resume, pause and un-pause subscriptions
As per the JSON:API spec, responses will contain object data along with references to all relationships and optional “included” data.

For example:

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.example.com/v1/orders/1>"
  },
  "data": {
    "type": "orders",
    "id": "1",
    "attributes": {
      "store_id": 1,
      "customer_id": 1,
      "identifier": "104e18a2-d755-4d4b-80c4-a6c1dcbe1c10",
      "order_number": 1,
      "user_name": "John Doe",
      "user_email": "<johndoe@example.com>",
      "currency": "USD",
      "currency_rate": "1.0000",
      "subtotal": 999,
      "discount_total": 0,
      "tax": 200,
      "total": 1199,
      "subtotal_usd": 999,
      "discount_total_usd": 0,
      "tax_usd": 200,
      "total_usd": 1199,
      "tax_name": "VAT",
      "tax_rate": "20.00",
      "status": "paid",
      "status_formatted": "Paid",
      "refunded": false,
      "refunded_at": null,
      "subtotal_formatted": "$9.99",
      "discount_total_formatted": "$0.00",
      "tax_formatted": "$2.00",
      "total_formatted": "$11.99",
      "first_order_item": {
        "id": 1,
        "order_id": 1,
        "product_id": 1,
        "variant_id": 1,
        "product_name": "Lemonade - 2 years",
        "variant_name": "Default",
        "price": 1199,
        "created_at": "2021-08-17T09:45:53.000000Z",
        "updated_at": "2021-08-17T09:45:53.000000Z",
        "deleted_at": null,
        "test_mode": false
      },
      "urls": {
        "receipt": "<https://app.example.com/my-orders/104e18a2-d755-4d4b-80c4-a6c1dcbe1c10?signature=8847fff02e1bfb0c7c43ff1cdf1b1657a8eed2029413692663b86859208c9f42>"
      },
      "created_at": "2021-08-17T09:45:53.000000Z",
      "updated_at": "2021-08-17T09:45:53.000000Z"
    },
    "relationships": {
      "store": {
        "links": {
          "related": "<https://api.example.com/v1/orders/1/store>",
          "self": "<https://api.example.com/v1/orders/1/relationships/store>"
        }
      },
      "customer": {
        "links": {
          "related": "<https://api.example.com/v1/subscriptions/1/customer>",
          "self": "<https://api.example.com/v1/subscriptions/1/relationships/customer>"
        }
      },
      "order-items": {
        "links": {
          "related": "<https://api.example.com/v1/orders/1/order-items>",
          "self": "<https://api.example.com/v1/orders/1/relationships/order-items>"
        }
      },
      "subscriptions": {
        "links": {
          "related": "<https://api.example.com/v1/orders/1/subscriptions>",
          "self": "<https://api.example.com/v1/orders/1/relationships/subscriptions>"
        }
      },
      "license-keys": {
        "links": {
          "related": "<https://api.example.com/v1/orders/1/license-keys>",
          "self": "<https://api.example.com/v1/orders/1/relationships/license-keys>"
        }
      },
      "discount-redemptions": {
        "links": {
          "related": "<https://api.example.com/v1/orders/1/discount-redemptions>",
          "self": "<https://api.example.com/v1/orders/1/relationships/discount-redemptions>"
        }
      }
    },
    "links": {
      "self": "<https://api.example.com/v1/orders/1>"
    }
  }
}
Webhooks allow you to keep your app data up-to-date with Lemon Squeezy by sending real-time notifications when important events happen in Lemon Squeezy.

Docs
→
Guides
→
Developer Guide
Taking Payments
Learn how to integrate Lemon Squeezy’s checkout system into your app or product, from creating checkout URLs to handling post-purchase processes and managing customer data.

Taking payments with Lemon Squeezy means sending customers to a checkout. Our checkout pages let your customers purchase one-off and subscription products using various payment methods including cards, PayPal and Apple Pay.

Integrating with Lemon Squeezy involves two key steps: directing customers to a checkout page, and then capturing and storing customer and order data in your system once the payment is processed.

Checkout URLs
For each product and variant in your Lemon Squeezy store, you can generate unique checkout URLs.

Let’s consider an example: imagine you have a subscription product with two variants - a monthly plan and an annual plan. Each variant will have its own distinct checkout URL. You’ll direct customers to the appropriate URL to complete their purchase.

The structure of a checkout URL is as follows:

https://[STORE].example.com/checkout/buy/[VARIANT_ID]
When sharing a checkout URL you can specify whether you want to use a hosted checkout, which loads the checkout in a browser window, or our checkout overlay, which will load the checkout over the current page. When integrating into apps, the checkout overlay keeps the experience more streamlined.

Shareable Checkout URLs vs. Cart URLs
Shareable checkout URLs always contain /checkout/buy/ in the link.

When a customer opens a checkout URL in their browser, it’s converted to a “cart” URL:

The URL changes to contain /checkout/?cart=
This cart URL is unique to that customer and single-use only!
Cart URLs cannot be shared or reused. They will not work for other customers.
Important

Always share the original checkout URL (with /checkout/buy/), not the converted cart URL.

How to create checkouts
There are two ways to create checkouts for your products:

From the Lemon Squeezy dashboard
Using the Lemon Squeezy API
Creating checkouts from the Lemon Squeezy dashboard
Log into your Lemon Squeezy dashboard and navigate to Products.
Click on the “Share” link when viewing a product and you’ll see a panel containing options for creating a checkout URL.
Lemon Squeezy: Share Product Panel
You can select between using the hosted and overlay checkouts plus show and hide different parts of the page. When you’re done, copy the URL and use it in your app or website.

Creating checkouts using the Lemon Squeezy API
The second way to create a checkout URL is by using the Checkouts API endpoint. By using our API, you can create checkouts on-demand and with more flexibility.

To create a checkout with the API, send a POST request with your desired configuration. You have the same options as in the “Share Product” panel, plus a range of customization options.

The most basic request contains required relationships to the store and variant.

The following request will create a checkout for a specified variant:

curl -X "POST" "<https://api.example.com/v1/checkouts>" \
     -H 'Accept: application/vnd.api+json' \
     -H 'Content-Type: application/vnd.api+json' \
     -H 'Authorization: Bearer {api_key}' \
     -d $'{
  "data": {
    "type": "checkouts",
    "relationships": {
      "store": {
        "data": {
          "type": "stores",
          "id": "2"
        }
      },
      "variant": {
        "data": {
          "type": "variants",
          "id": "2"
        }
      }
    }
  }
}'
The response to this request is a Checkout object.

Where to find IDs?

You can find your store ID from Settings » Stores. Variant IDs can be copied from product dropdown menus, using the “Copy ID” option, or from the API using the list all variants endpoint.

The data.attributes.url in the response is the unique URL for your specific checkout request.

A common flow for using a checkout URL would be to send an API request to generate a checkout when a customer clicks a “Buy” button in your app. After receiving the response, you could then redirect the customer to the URL.

Alternatively, you could create a checkout during or right after page load and insert the URL in a “Buy” button, ready for the customer to click. However, we don’t recommend doing this on high-traffic pages unless you are caching the response.

Advanced checkouts
Our checkout system offers additional customization and personalization options. You can apply these customizations in two ways:

By adding query parameters to checkout URLs
By including additional attributes when using the Checkouts API
Checkout overlays
Lemon Squeezy offers two checkout display options:

Hosted Checkout (Default): Checkout URLs generated from your dashboard’s Share option or via the API open in a new browser tab.
Checkout Overlay: This option displays the checkout process in an iframe, over your existing website or application, keeping customers on your page.
To implement the “Checkout Overlay” from your Lemon Squeezy Dashboard:

From your Lemon Squeezy dashboard, navigate to the product sharing settings.
Select the “Checkout Overlay” option.
Copy the provided code snippet.
Paste this code into your web page.
Lemon Squeezy: Checkout Overlay Copy Code
This code includes Lemon.js, our mini JS library for handling checkout actions. Whenever a link with the CSS class lemonsqueezy-button is clicked, the checkout will appear over the current page instead of opening in the full browser window, making it feel a part of your site.

Lemon Squeezy: Checkout Overlay
Lemon.js
If you’re creating checkouts using the API, you can use Lemon.js for loading your checkout URLs in an overlay. Make sure you include the script on your page, then once you have created the checkout, use the LemonSqueezy.Url.Open() method to create the overlay:

const checkoutUrl = response['data']['attributes']['url'];
LemonSqueezy.Url.Open(checkoutUrl);
To get the “Checkout Overlay” URL using the Lemon Squeezy API see the embed attribute in checkout customization options.

Tip

You can also use the checkout customization options to change colors of checkout overlays.

Pre-fill customer information
You can pre-populate the checkout fields with customer information, making the process quicker and more convenient for your customers. The pre-fillable fields include:

Name
Email address
Billing address
Tax number
Discount codes
Quantities
Find out more about pre-filled Checkout fields

To add this information to an existing checkout URL, append query string parameters. For example:

https://[STORE].example.com/checkout/buy/[VARIANT_ID]
?checkout[email]=<johndoe@example.com>
&checkout[name]=John Doe
&checkout[billing_address][country]=US
&checkout[billing_address][state]=NY
&checkout[billing_address][zip]=10121
&checkout[tax_number]=123456789
&checkout[discount_code]=10PERCENTOFF
If you are using API to create checkouts pass a JSON object inside checkout_data.

curl -X "POST" "<https://api.example.com/v1/checkouts>" \
     -H 'Accept: application/vnd.api+json' \
     -H 'Content-Type: application/vnd.api+json' \
     -H 'Authorization: Bearer {api_key}' \
     -d '{
  "data": {
    "type": "checkouts",
    "attributes": {
      "checkout_data": {
        "email": "<johndoe@example.com>",
        "name": "John Doe"
      }
    },
    "relationships": {
      ...
    }
  }
}'
More info can be found in the Create a checkout API docs.

Passing custom data
You can pass custom data to checkout, which you can then access later in webhooks and API calls. This data is never shown to customers, so it’s perfect for linking checkouts to users or sessions from within your product.

Custom data can be passed to checkout URLs with query string parameters. For example, if you want to pass user_id of value 123 to the checkout, you can do it like so:

https://[STORE].example.com/checkout/buy/[VARIANT_ID]?checkout[custom][user_id]=123
With the API, you can add custom data using a custom object within checkout_data, like this:

curl -X "POST" "<https://api.example.com/v1/checkouts>" \
     -H 'Accept: application/vnd.api+json' \
     -H 'Content-Type: application/vnd.api+json' \
     -H 'Authorization: Bearer {api_key}' \
     -d '{
  "data": {
    "type": "checkouts",
    "attributes": {
      "checkout_data": {
        "custom": {
          "user_id": 123
        }
      }
    },
    "relationships": {
      ...
    }
  }
}'
This object will then be returned as meta.custom_data in all Order, Subscription and License key related webhook events.

{
  "meta": {
    "event_name": "subscription_created",
    "custom_data": {
      "user_id": 123
    }
  },
  "data": {
    "type": "subscriptions",
    ...
  }
}
Checkout page customization
Lemon Squeezy allows you to customize the appearance of your checkout page via:

Dashboard: When sharing a product, you’ll find options to show or hide specific elements. These choices are automatically reflected in the generated URL.
Query params: Manually adjust any checkout URL to customize its appearance.
Here’s an example of creating a checkout overlay with a hidden logo and a dark grey button:

https://[STORE].example.com/checkout/buy/[VARIANT_ID]
?embed=1
&logo=0&
button_color=%23111111
Note that the ”#” symbol used in the hex color needs to be URL-encoded as %23, #111111 becomes %23111111.

View all checkout_options attributes in the Create a checkout docs.

Custom pricing
You might occasionally want to provide special pricing for certain customers. With the API, you can easily set these custom prices on demand.

To do this, add a custom_price value in your API request. This custom price will override the product’s standard price at checkout. Note that this price excludes tax, which may be added during the checkout process.

The custom_price value must be in the currency’s smallest unit i.e. 599 would mean $5.99 for USD and ¥599 for JPY.

For example:

curl -X "POST" "<https://api.example.com/v1/checkouts>" \
     -H 'Accept: application/vnd.api+json' \
     -H 'Content-Type: application/vnd.api+json' \
     -H 'Authorization: Bearer {api_key}' \
     -d '{
  "data": {
    "type": "checkouts",
    "attributes": {
      "custom_price": 599
    },
    "relationships": {
      ...
    }
  }
}'
Custom pricing is not available using query string parameters on checkout URLs.

For subscriptions, the custom_price you set will be retained for all future renewals unless the customer is moved to another plan (variant). In that case the new variant’s price will override and replace the custom price you set in the initial checkout.

Override product details
Beyond overriding a product’s price at checkout, you can also modify other product attributes using the API (this customization is exclusive to API-created checkouts).

The product_options object in the API allows you to update the fields used during the product creation process, including name, description, media, redirect URL, and the variants to be displayed.

curl -X "POST" "<https://api.example.com/v1/checkouts>" \
     -H 'Accept: application/vnd.api+json' \
     -H 'Content-Type: application/vnd.api+json' \
     -H 'Authorization: Bearer {api_key}' \
     -d '{
  "data": {
    "type": "checkouts",
    "attributes": {
      "product_options": {
        "name": "Unique subscription for Dave",
        "redirect_url": "<https://myapp.com/welcome/?user=dave123>",
        "receipt_button_text": "Go to your account"
      }
    },
    "relationships": {
      ...
    }
  }
}'
View all product_options attributes in the Create a checkout docs.

Expiring Checkout URLs
The final option in this guide is to create checkout URLs that expire at a specific time. This feature is useful if you want to offer a product (or customized product) for a limited period.

To set this up, simply add a date in the expires_at attribute. Lemon Squeezy will invalidate the checkout after that date, preventing any further purchases.

curl -X "POST" "<https://api.example.com/v1/checkouts>" \
     -H 'Accept: application/vnd.api+json' \
     -H 'Content-Type: application/vnd.api+json' \
     -H 'Authorization: Bearer {api_key}' \
     -d '{
  "data": {
    "type": "checkouts",
    "attributes": {
      "expires_at": "2023-04-30T23:59:59.000000Z"
    },
    "relationships": {
      ...
    }
  }
}'
Checkout URLs without an expires_at value can be used indefinitely and are safe to be stored/cached on the merchant side.

After the checkout
The checkout itself isn’t the only important part of a purchase for your customers. What happens after taking payment is also crucial to get right, and we offer you a number of options to create the perfect flow for your app or product.

The confirmation modal
After a successful payment, your customer will be shown a confirmation message.

Lemon Squeezy: The Confirmation Modal
The text and button in the confirmation is fully customizable from a product’s settings panel.

Redirects
If you’re integrating Lemon Squeezy into your app, maybe you want to redirect the user to their billing page or a custom welcome page after purchase.

By default the button in the confirmation will take users to their My Orders page.

You can change this button’s URL by changing the “Button link” option in the Confirmation modal settings:

Lemon Squeezy: Redirects
If you’re creating checkouts with the API, simply add a product_options.redirect_url in your request to change the button’s link:

curl -X "POST" "<https://api.example.com/v1/checkouts>" \
     -H 'Accept: application/vnd.api+json' \
     -H 'Content-Type: application/vnd.api+json' \
     -H 'Authorization: Bearer {api_key}' \
     -d '{
  "data": {
    "type": "checkouts",
    "attributes": {
      "product_options": {
        "redirect_url": "<https://example.com/dashboard>"
      }
    },
    "relationships": {
      ...
    }
  }
}'
If you add a custom button URL, the customer will see a “Continue” button instead of the default “View Order” button. If you’ve customized the “Button text” value in the “Confirmation” modal settings, your custom button text will be used instead.

Lemon Squeezy: Redirect Overlay
Editing receipts
You can customize the copy and the button in the receipt emails sent to your customers. Here’s an example receipt:

Lemon Squeezy: Receipt
By default your customer will see a “View Order” button but this is easily configurable for each product from the edit product side panel.

Receipts can be customized when editing products in Lemon Squeezy:

Lemon Squeezy: Customize ReceiptLemon Squeezy: Customize Receipt
You can also achieve the same result with the API by adding attributes to the product_options object when creating checkouts:

curl -X "POST" "<https://api.example.com/v1/checkouts>" \
     -H 'Accept: application/vnd.api+json' \
     -H 'Content-Type: application/vnd.api+json' \
     -H 'Authorization: Bearer {api_key}' \
     -d '{
  "data": {
    "type": "checkouts",
    "attributes": {
      "product_options": {
        "receipt_button_text": "Go to your account",
        "receipt_link_url": "<https://example.com/dashboard/>",
        "receipt_thank_you_note": "Thank you for signing up! Click on the button to access your account."
      }
    },
    "relationships": {
      ...
    }
  }
}'
Saving checkout and subscription data in your database
It’s important that you store Lemon Squeezy data in your own database so that you can easily reference objects later and use the API to get more details.

For orders
For orders, you could listen for order_created webhooks or use the data returned in the Lemon.js Checkout.Success event. Store the order id from Order objects to be able to make future requests for orders in the API.

For subscriptions
For subscriptions, you could listen for subscription_created and subscription_updated webhook events and store subscription ids. (Handily, the subscription_created event will return the order_id, so there’s no need to listen to the order_created event if you’re selling subscriptions and also want to store the order ID).

You should also record the product_id and variant_id, which will help should you need to change subscription plans in the future.

Store the first_subscription_item.id if you are using usage-based billing, so you can create usage records. It’s also recommended to store first_subscription_item.quantity so you can show your customers their current usage.

Store the customer_id if you want to query customer data in the future.

For the best user experience, store and display the status, trial_ends_at, renews_at, ends_at, card_brand and card_last_four values from a Subscription object so that you can display up-to-date information about a subscription in your user’s billing page.

We also recommended to store a subscription object’s urls.update_payment_method value, which provides a simple URL for customers to update their payment method during their subscription.

That’s all. By following this guide, you’ll be well-equipped to integrate Lemon Squeezy’s checkout system into your app or product, ensuring a smooth, customizable, and efficient payment process for your customers.

Docs
→
Guides
→
Developer Guide
Customer Portal
Learn how to add a no-code solution that lets your customers easily self-manage their subscriptions from your store.

Keep in mind that you will still need to set up webhooks if you want your billing and application data to stay in sync.

Lemon Squeezy: Customer Portal
For more details about the available features, read the Customer Portal documentation.

Add Customer Portal to your app
You can add the Customer Portal to your application simply by linking to it, allowing customers to start managing their subscriptions and billing information with a single click.

There are two types of Customer Portal URLs:

Signed URLs
Unsigned URLs
Signed URLs
Subscription and Customer objects contain a signed customer_portal URL in the urls object. This URL will automatically log in customers to manage their subscription(s) and is valid for 24 hours. In cases where customers do not possess any subscription, the customer_portal property will be set to null.

{
  ...
  "cancelled": false,
  "trial_ends_at": null,
  "billing_anchor": 30,
  "urls": {
    "update_payment_method": "<https://my-store.example.com/subscription/1/payment-details?expires=1688469629&signature=4577154142b49da48f73809288ef0f52ae6a91c860b7bdc22ff5bddba842a455>",
    "customer_portal": "<https://my-store.example.com/billing?expires=1688469629&user=60000&signature=f040cb5a25ccebd8d05c2937e9a0559a750f5d5b8b32a40162ca43e130187d2c>"
  },
  "renews_at": "2023-07-30T11:48:33.000000Z",
  "ends_at": null,
  ...
}
If you have a custom domain set up, all Customer Portal and update payment method URLs will use your custom domain.

Request new URL
We recommend you request a new URL (by calling the Retrieve a subscription endpoint or Retrieve a customer endpoint) when a user clicks a Billing button in your app, then redirect them to the URL in the response.

app.get('/api/subscriptions', (req, res) => {
  // Using @lemonsqueezy/lemonsqueezy.js
  lemonSqueezySetup({ apiKey: 'api_key' });
  const { data } = await getSubscription('subscription_id');
  res.json({ url: data['attributes']['urls']['customer_portal'] })
})
<!-- billing.html -->
<script>
function handleClick(e) {
  e.preventDefault()

  fetch('/api/subscriptions')
  .then(response => response.json())
  .then(res => {
    window.location = res.url
  })
}
</script>

<button onclick="handleClick()">Manage your subscription</button>
Unsigned URL
If you don’t want to make an API call when a customer clicks through to the Customer Portal you can use the unsigned URL:

https://[STORE].example.com/billing
Note that with this option, if your customer is not already logged into their Lemon Squeezy account, they will see a form to log in via an email magic link like My Orders.

Customizing the Customer Portal
In the Design settings in your dashboard, you have some options to customize your Customer Portal. Any changes you make here will be shown to all customers.

You can change the copy shown at the top of the page and can easily toggle different parts of the portal.

You can even select which subscription products/variants your customers are allowed to upgrade and downgrade to.

Make sure to add a URL in the “Back” link option so your customers can easily get back to your application.

Docs
→
Guides
→
Developer Guide
Sync With Webhooks
Learn how to use webhooks to automatically sync data between Lemon Squeezy and your app.

Webhooks enable Lemon Squeezy to automatically send data to your application in response to specific store events, ensuring your users remain informed and maintain access to their products.

For instance, when a subscription renewal is processed, information about the payment can be sent directly to an endpoint in your application. You can then utilize and process this data to update your application, ensuring that your users are informed of the renewal and, importantly, maintain access to your product.

Find more information about webhooks in the webhooks documentation.

Webhook events
There are many different events for which webhooks are sent, such as:

order_created
order_refunded
customer_updated
subscription_created
subscription_updated
subscription_cancelled
subscription_resumed
subscription_expired
subscription_paused
subscription_unpaused
subscription_payment_failed
subscription_payment_success
subscription_payment_recovered
subscription_payment_refunded
license_key_created
license_key_updated
affiliate_activated
To find out more about webhook events, see the Webhook Events documentation.

Example webhook data
Webhook events are sent as JSON via POST requests to your endpoint.

The data that is available in each webhook request is either a Subscription, Subscription invoice, Order, Customer or License key object. Each of our webhooks follows the same structure as below.

An example subscription_created event’s request looks like this:

{
  "meta": {
    "event_name": "subscription_created"
  },
  "type": "subscriptions",
  "id": "1",
  "attributes": {
    "store_id": 1,
    "customer_id": 1,
    "order_id": 1,
    "order_item_id": 1,
    "product_id": 1,
    "variant_id": 1,
    "product_name": "Lemonade",
    "variant_name": "Citrus Blast",
    "user_name": "John Doe",
    "user_email": "<johndoe@example.com>",
    "status": "active",
    "status_formatted": "Active",
    "card_brand": "visa",
    "card_last_four": "42424",
    "payment_processor": "stripe",
    "pause": null,
    "cancelled": false,
    "trial_ends_at": null,
    "billing_anchor": 12,
    "first_subscription_item": {
      "id": 1,
      "subscription_id": 1,
      "price_id": 1,
      "quantity": 5,
      "created_at": "2021-08-11T13:47:28.000000Z",
      "updated_at": "2021-08-11T13:47:28.000000Z"
    },
    "urls": {
      "update_payment_method": "<https://my-store.example.com/subscription/1/payment-details?expires=1666869343&signature=9985e3bf9007840aeb3951412be475abc17439c449c1af3e56e08e45e1345413>",
      "customer_portal": "<https://my-store.example.com/billing?expires=1666869343&signature=82ae290ceac8edd4190c82825dd73a8743346d894a8ddbc4898b97eb96d105a5>",
      "customer_portal_update_subscription": "<https://my-store.example.com/billing/1/update?expires=1666869343&signature=e4fabc7ee703664d644bba9e79a9cd3dd00622308b335f3c166787f0b18999f2>"
    },
    "renews_at": "2022-11-12T00:00:00.000000Z",
    "ends_at": null,
    "created_at": "2021-08-11T13:47:27.000000Z",
    "updated_at": "2021-08-11T13:54:19.000000Z",
    "test_mode": false
  }
}
You can see in the example above that the data object is a Subscription object.

If you added custom data to the checkout, it will be available in meta.custom_data:

{
  "meta": {
    "event_name": "subscription_created",
    "custom_data": {
      "user_id": 123
    }
  },
  "data": {
    "type": "subscriptions",
    ...
  }
}
When you receive webhook events at your endpoint, it’s important to update your application’s local data, such as the order ID, renewal date, status, or payment method URL.

In addition to the primary data, each webhook includes relationships to related objects within Lemon Squeezy. You can use the provided URLs to perform sequential GET requests to access these related objects. For example, you can retrieve a product variant object by using the URL found in relationships.variant.links.related.

Creating webhooks
Setting up webhooks is quick and easy. You can create and manage webhooks in two ways:

From your Lemon Squeezy dashboard
Using the Lemon Squeezy Webhooks API
From your Lemon Squeezy dashboard
Go to Settings » Webhooks in Lemon Squeezy and click the plus icon.
Specify the endpoint URL you want the data to be sent to in your app, then add a signing secret, which will help validate any requests to your endpoint (read on for information about signing and validating webhooks).
The last step is to select the events you want to be sent to your app. It’s recommended to only select the events you need for your app, to limit the amount of requests hitting your service.
Using the Lemon Squeezy Webhooks API
Creating a new webhook using the API requires a simple POST request, specifying the webhook endpoint you want data to be sent to, the events you want to subscribe to and a signing secret to keep webhook requests safe and secure.

POST <https://api.example.com/v1/webhooks>
{
  "data": {
    "type": "webhooks",
    "attributes": {
      "url": "<https://example.com/webhooks/>",
      "events": [
        "order_created",
        "subscription_created",
        "subscription_updated",
        "subscription_expired"
      ],
      "secret": "SIGNING_SECRET"
    },
    "relationships": {
      "store": {
        "data": {
          "type": "stores",
          "id": "1"
        }
      }
    }
  }
}
Find out more about the webhooks API, including viewing, modifying and deleting webhooks, in the Webhooks API docs.

Looking for SDKs?

Lemon Squeezy offers official SDKs for several programming languages to make API integration even easier. Check out our available SDKs to find one that suits your development needs.

Adding an endpoint in your app
You will need an endpoint in your app that serves as the receiver for all webhook requests. This should accept POST requests and be able to process and/or save each webhook as it is sent.

To tell Lemon Squeezy that a webhook request was recieved OK, return a HTTP 200 response. Any other response code will tell Lemon Squeezy that the webhook failed and the event will be sent again up to three more times. If your app has not returned a HTTP 200 response by the fourth attempt, the event will not be tried again automatically, though you can re-send recent webhooks from your webhooks settings.

We recommend storing webhook events locally, either in your database or a cache, even if only temporarily. This approach allows you to quickly return an HTTP 200 response and process the data outside of the webhook request. Additionally, if your app encounters an issue while processing a webhook, you will have the necessary data on hand to troubleshoot and fix the problem without waiting for the event to be resent.

Signing and validating webhook requests
To check that data sent to your specified webhook endpoint is actually from Lemon Squeezy, you should verify the signature that is sent along with the event data.

The signature is sent in the X-Signature header and is a hash made up of the signing secret you specified when creating the webhook in your Lemon Squeezy account plus the request body.

To verify the webhook is from Lemon Squeezy you should attempt to create a matching hash and check that it matches the signature in the header.

For more information on signing webhook requests, see the Signing Requests documentation.

Simulate subscription webhooks in “Test mode”
We know building an API integration can be difficult, especially when you need to test subscription webhook events that happen in the future and can’t be easily tested via the checkout.

This is why we built a webhook simulation feature. When in “Test mode”, you can manually trigger certain subscription events from your Lemon Squeezy account.

Once you have some subscriptions in your test mode account (you can create these by purchasing products through the test mode checkout) you will see a “Simulate event” option in each subscription’s side panel. Simply select the event you want to trigger and a matching event will be sent to your endpoint.

Lemon Squeezy: Simulate Webhook Events
Subscription renewal events
To test subscription renewal events (subscription_payment_*), you need at least one renewal to have occurred on a subscription. We generate simulation webhooks based on this renewal data. For quicker testing:

Create test subscription products with daily billing intervals
Purchase a subscription to one of these products
Wait for the first renewal (which will occur the next day)
You’ll then be able to simulate subscription_payment_* events for this subscription

And that’s it! You’re now equipped to set up, receive, and process webhooks from Lemon Squeezy. With this real-time data flow, your app will always be in sync with your store events. Happy coding!

For more information about webhooks, please see the Webhooks documentation and the Webhooks API documentation.

Docs
→
Guides
→
Developer Guide
Subscription Management using the Lemon Squeezy API
Learn how to effectively manage subscriptions using the Lemon Squeezy API, including changing plans, cancelling, pausing, and resuming subscriptions.

This guide covers essential subscription management tasks using the Lemon Squeezy Subscriptions API. You’ll learn how to programmatically change subscription plans, handle cancellations, implement pausing and resuming functionality, and manage other key aspects of your subscription-based service.

Creating subscriptions
Read the “Taking payments” guide to learn how to create checkouts and let customers sign up to your subscription products.

Saving product data in your database
To enable plan switching within your app, you need to store your Lemon Squeezy product data locally. This builds on the information covered in the “Saving checkout and subscription data in your database” section of the “Taking payments” guide, where we discussed essential data to store in your app.

Make a GET request to the list all variants endpoint to return a list of all Variants.

To populate your app with product and variant data, you have two main options:

Manually call the list all variants endpoint whenever you edit or add products.
Set up a background job to fetch this data regularly.
We recommend storing the following key information for each variant:

product_id
variant_id
name
price
Storing these details allows you to easily display and manage product information within your app.

Changing plans
To change a subscription’s plan (variant):

Send a PATCH request to the specific subscription endpoint
Include the new variant ID in the request body.
curl -X "PATCH" "<https://api.example.com/v1/subscriptions/{subscription_id}>" \
     -H 'Accept: application/vnd.api+json' \
     -H 'Content-Type: application/vnd.api+json' \
     -H 'Authorization: Bearer {api_key}' \
     -d '{
  "data": {
    "type": "subscriptions",
    "id": "{subscription_id}",
    "attributes": {
      "variant_id": {variant_id}
    }
  }
}'
The subscription will be instantly moved to the new product variant and you will be able to verify this by checking the response (which will contain a Subscription object).

You can also manage subscription plans in the dashboard.

Handling proration
When changing a subscription’s plan (variant), proration occurs by default.

”Proration” is the term used for calculating the price difference between plans, ensuring customers are charged correctly for the time spent on each plan.

For example:

A customer moves from a $19/month plan to a $99/month plan
A prorated amount is charged based on the time already spent on the $19 plan
By default, this extra amount is added to the next renewal
You have two options to control how proration is handled:

"invoice_immediately": true
Creates a new invoice during the plan change
If the new plan is cheaper, the invoice total will be zero
If the new plan is more expensive, an immediate payment for the difference is attempted
"disable_prorations": true
Completely disables proration
The customer moves to the new plan’s price at the next renewal without any additional charges
Important notes:

If both options are used in the same request, disable_prorations overrides invoice_immediately
The plan change takes effect immediately, regardless of the proration option chosen
curl -X "PATCH" "<https://api.example.com/v1/subscriptions/{subscription_id}>" \
     -H 'Accept: application/vnd.api+json' \
     -H 'Content-Type: application/vnd.api+json' \
     -H 'Authorization: Bearer {api_key}' \
     -d '{
  "data": {
    "type": "subscriptions",
    "id": "{subscription_id}",
    "attributes": {
      "variant_id": {variant_id},
      "disable_prorations": true
    }
  }
}'
For more information, see the Subscriptions API documentation.

Cancelling and resuming subscriptions
To cancel a subscription:

Send a DELETE request to the specific subscription endpoint.
The response will contain an updated Subscription object with:
cancelled set to true
status set to "cancelled"
For more information see the Subscription API documentation.

Grace period
If a subscription is cancelled mid billing period (either by the customer or by the store owner), it will enter a “grace period” before it expires at the next scheduled renewal date (refected in a subscription’s ends_at value). The customer should still have access to your app or product until this date because they have paid for that time period.

During this cancelled grace period, it’s possible to resume the subscription with a quick API call with cancelled set to false.

Resuming a subscription in grace period
curl -X "PATCH" "<https://api.example.com/v1/subscriptions/{subscription_id}>" \
     -H 'Accept: application/vnd.api+json' \
     -H 'Content-Type: application/vnd.api+json' \
     -H 'Authorization: Bearer {api_key}' \
     -d '{
  "data": {
    "type": "subscriptions",
    "id": "{subscription_id}",
    "attributes": {
      "cancelled": false
    }
  }
}'
If a subscription is resumed like this, the subscription is changed back to active and the original payment schedule will continue.

Expired subscriptions
If a subscription is cancelled and then reaches its next renewal date (ends_at) without being resumed, it will instead expire (its status will change to expired).

When a subscription is in the expired state, your customer should no longer have access to your app and the subscription is no longer resumable.

Pausing and unpausing subscriptions
Pausing a subscription is a great option if you want to keep a subscription active but pause regular payment collection. Maybe this is because your app will be inaccessible for a temporary period or you will be on holiday during a service-based retainer. Alternatively you may want to let your customers pause subscriptions if they won;t be able to make full use of your product for a certain period of time.

A paused subscription with have a status of paused.

Pausing a subscription
To pause a subscription, send a PATCH request containing a pause object:

curl -X "PATCH" "<https://api.example.com/v1/subscriptions/{subscription_id}>" \
     -H 'Accept: application/vnd.api+json' \
     -H 'Content-Type: application/vnd.api+json' \
     -H 'Authorization: Bearer {api_key}' \
     -d '{
  "data": {
    "type": "subscriptions",
    "id": "{subscription_id}",
    "attributes": {
      "pause": {
        "mode": "free",
        "resumes_at": "2023-06-30T00:00:00.000000Z"
      }
    }
  }
}'
When pausing a subscription, you can choose between two mode values:

free: Use this when you want to offer your product or service at no cost during the pause period.
void: Use this when you cannot provide your services during the pause period.
Both modes temporarily stop payment collection.

You can also optionally pass resumes_at to specify a date to automatically unpause the subscription.

Manually unpausing a paused subscription
Send a PATCH request to the specific subscription endpoint.
Include pause attribute with null value.
Similarly to resuming a cancelled subscription, the subscription will be changed to active and payment collection will resume on its original schedule.

curl -X "PATCH" "<https://api.example.com/v1/subscriptions/{subscription_id}>" \
     -H 'Accept: application/vnd.api+json' \
     -H 'Content-Type: application/vnd.api+json' \
     -H 'Authorization: Bearer {api_key}' \
     -d '{
  "data": {
    "type": "subscriptions",
    "id": "{subscription_id}",
    "attributes": {
      "pause": null
    }
  }
}'
For more information, see the Subscriptions API reference.

Updating billing details
Letting your customers update their payment details during a subscription is an essential feature, especially when cards expire or if payments fail for any reason.

We provide a signed URL in every Subscription-related API request and webhook event in urls.update_payment_method, which customers can use to easily update their billing details. We suggest you make this URL easily available to your customers, for example in your app’s billing pages.

{
  "type": "subscriptions",
  "id": "1",
  "attributes": {
    ...
    "urls": {
      "update_payment_method": "<https://my-store.example.com/subscription/1/payment-details?expires=1674045831&signature=31cf3c83983a03a6cf92e4ec3b469fc044eace0a13183dcb1d7bc0da3bad6f31>",
      "customer_portal": "<https://my-store.example.com/billing?expires=1674045831&signature=82ae290ceac8edd4190c82825dd73a8743346d894a8ddbc4898b97eb96d105a5>"
    }
    ...
  }
}
If you have a custom domain set up, update_payment_method will contain your custom domain.

During our payment recovery process any subscriptions with failed payments will have four retries before entering the (optional) dunning flow. After each payment retry and for each of the dunning series emails, we will send the same URL to the customer to update their billing details.

For security, the URLs returned by the API expire after 24 hours. You will need to query the subscription over the API for a refreshed URL.

Update payment method modal
To make the URL open in a more seamless overlay on top of your app (similar to the checkout overlay), use Lemon.js to open the URL with the LemonSqueezy.Url.Open() method.

Changing the billing date
Send a PATCH request to the specific subscription endpoint.
Include billing_anchor attribute.
curl -X "PATCH" "<https://api.example.com/v1/subscriptions/{subscription_id}>" \
     -H 'Accept: application/vnd.api+json' \
     -H 'Content-Type: application/vnd.api+json' \
     -H 'Authorization: Bearer {api_key}' \
     -d '{
  "data": {
    "type": "subscriptions",
    "id": "{subscription_id}",
    "attributes": {
      "billing_anchor": 1
    }
  }
}'
By default, a subscription’s billing_anchor will match the date the customer initially signed up, but you can easily change it to any other day of the month. As an example, some businesses like to charge all customers on the first of each month.

When changing the billing_anchor value of a subscription, a proration will occur to make sure the customer is not overcharged or undercharged when the length of their billing period changes.

If the current month doesn’t contain the day that matches your billing_anchor (for example, if the billing_anchor is 31 and the month is November), the customer will be charged on the last day of the month.

You can use null or 0 to easily change the billing anchor to the current date. Doing this will also remove any active trial period.

For more information please refer to the API reference

Update a subscription’s quantity
Go to the Usage-based billing guide to find out how to update a subscription’s quantity or usage.

And that’s it! You’re now equipped to set up, manage, and modify subscriptions using the Lemon Squeezy API, enabling you to provide a flexible and user-friendly subscription experience for your customers.

Looking for SDKs?

Lemon Squeezy offers official SDKs for several programming lang

Docs
→
Guides
→
Developer Guide
Usage-Based Billing
Get the most out of Lemon Squeezy’s usage-based billing to ensure your customers are charged accurately based on their real-time product usage.

Charging customers based on their usage is a common practice in software.

With Lemon Squeezy, you can implement this by leveraging our various pricing models and opting for quantity, or usage-based billing.

Pricing models
There are four different ways to charge in Lemon Squeezy.

Flat-rate pricing
Flat-rate pricing is the simplest way to charge and can be used on both single payment and subscription products.

Standard pricing - Charge a flat rate for a single unit
Package pricing - Charge a flat rate for multiple units
Examples:

You sell access to your software per seat at $9/month per seat (Standard pricing).
You sell units for your application at $10 for 100 units (Package pricing).
You can change the price of an order or an initial subscription charge by specifying a quantity value at checkout (read on to find out how).

Updating an active subscription’s quantity is similar to changing its plan; customers can be charged a prorated amount (based on your API request) and changed to a higher or lower renewal price.

Tiered pricing
Tiered pricing models let you charge per unit, giving you more granular and precise pricing options.

Volume pricing - Charge a flat rate per unit depending on total usage
Graduated pricing - Charge variable unit prices depending on total usage
Examples:

You sell access to your software per seat; up to a maximum of 3 costs $5/month each and after that all seats cost $4/month (Volume pricing).
You sell access to your software per seat in differently-priced tiers; the first 3 seats cost $5/month each, the next 5 seats cost $4/month each and every additional seat costs $3/month (Graduated pricing).
For tiered pricing you can either use quantity-based billing to determine how much customers are charged (like with standard and package pricing) or enable usage-based billing for easier usage reporting (see below).

Graduated and volume pricing also support charging a flat fee for each pricing level, which is great if you want to charge a set-up or base fee alongside product usage.

Ways to charge for usage
Quantity-based billing
The simplest way to charge for usage is by using a quantity value for each subscription.

Customers are charged up-front based on an optional quantity set at checkout and then can be charged during a subscription for different usage as you change the quantity value. This simply changes the next renewal amount to a specific multiple of your unit price and the end effect is similar to changing a subscription’s plan.

Quantity-based billing can be enabled on all four pricing models.

Usage-based billing
For more flexibility for reporting usage in your platform, you can enable usage-based billing on specific products and variants.

With usage-based billing, customers are charged based on usage during the previous billing period rather than up-front.

The advantages of using usage-based billing are:

A higher degree of flexibility when reporting real-life product usage. Instead of simply updating a subscription’s quantity value you can send multiple API requests to record usage over time, which Lemon Squeezy then uses to charge your customers.
Being able to charge in arrears accurately based on exact usage, rather than up-front using a quantity value (which is more like changing between plans than charging by usage).
When you use usage-based billing, the initial charge at checkout will always be 0. Any quantity value set at checkout will be ignored.

Usage-based billing can be enabled on all four pricing models.

Reporting usage for quantity-based billing
Setting a quantity at checkout
When customers buy your product, you can set a unit quantity value at checkout allowing you to start subscriptions with a pre-defined amount of units.

If you do not specify a quantity at checkout, it will default to 1.

The total charged at checkout will be based on your pricing model, unit prices and the quantity specified. For example, if you sell API credits using volume pricing at $0.10 per credit, setting a quantity of 100 at checkout will charge the customer $10.

We recommend you test changing the quantity value at checkout to see how prices will be shown to your customers and to make sure your pricing has been set up correctly on your products.

To specify a quantity at checkout you can add the query parameter quantity to a product’s share URL:

https://[STORE].example.com/checkout/buy/[VARIANT_ID]?quantity=100
If you create checkouts using the API, you can similarly determine a quantity in checkout_data.variant_quantities.

POST <https://api.example.com/v1/checkouts>
{
  "data": {
    "type": "checkouts",
    "attributes": {
      "checkout_data": {
        "variant_quantities": [
          {
            "variant_id": 1,
            "quantity": 10
          }
        ]
      }
    },
    "relationships": {
      "store": {
        "data": {
          "type": "stores",
          "id": "1"
        }
      },
      "variant": {
        "data": {
          "type": "variants",
          "id": "1"
        }
      }
    }
  }
}
Updating quantity
When using quantity-based billing, you can change the quantity of a subscription by updating the Subscription item’s quantity value.

Where to find the Subscription item ID?

You can get the subscription item ID from a Subscription object’s first_subscription_item.id value.

PATCH <https://api.example.com/v1/subscription-items/1>
{
  "data": {
    "type": "subscription-items",
    "id": "1",
    "attributes": {
      "quantity": 5
    }
  }
}
Doing this will change how any units to charge for on the next renewal date. For example, if you sell a $19/month subscription, changing the quantity value to 4 will charge $76 at the next rewenal.

A prorated amount will be added to the customer’s next subscription invoice if quantity increases, to reflect the increased usage for the remaining part of the current billing period.

Querying quantity
If you ever need to query the current quantity of a subscription, send a GET request to the Subscription item endpoint.

GET <https://api.example.com/v1/subscription-items/1>
to get a response like this:

{
  "type": "subscription-items",
  "id": "1",
  "attributes": {
    "subscription_id": 1,
    "price_id": 1,
    "quantity": 1,
    "is_usage_based": false,
    "created_at": "2023-07-18T12:16:24.000000Z",
    "updated_at": "2023-07-18T12:16:24.000000Z"
  },
  ...
}
For more information please refer to the API reference

Reporting usage for usage-based billing
For more flexibility and control in reporting usage, you can activate Usage-based billing on your products and report customer usage to Lemon Squeezy using Usage records endpoints.

Reporting usage
When reporting usage there are two options you use in tandem to tell Lemon Squeezy how many units have been used by your customers and how to charge against that usage.

The first option is the aggregation setting you choose in the product/variant form when enabling usage-based billing. These options are:

Sum of usage during period
Most recent usage during a period
Most recent usage
Maximum usage during period
The second option is the type of usage records you make to Lemon Squeezy, determined with the action value in API calls.

If you have chosen the “Sum of usage during period” aggregation setting, you should use "action": "increment", which will add the provided quantity value to any existing quantity for the current billing period.

If you have chosen the “Most recent usage during a period” or “Most recent usage” aggreagation settings, you should use "action": "set", which will replace any existing usage with the provided quantity value.

In this example, we are adding 1 more unit to the existing usage (aggregation for this product is “Sum of usage during period”).

POST <https://api.example.com/v1/usage-records>
{
  "data": {
    "type": "usage-records",
    "attributes": {
      "quantity": 1,
      "action": "increment"
    },
    "relationships": {
      "subscription-item": {
        "data": {
          "type": "subscription-items",
          "id": "1"
        }
      }
    }
  }
}
Go to the API reference.

Querying usage
You can always view a subscription’s real-time billable usage from your dashboard.

Querying usage
To retrieve the current usage of a subscription with the API, make a GET request to the subscription item’s current usage endpoint.

GET <https://api.example.com/v1/subscription-items/1/current-usage>
{
  "jsonapi": {
    "version": "1.0"
  },
  "meta": {
    "period_start": "2023-08-10T13:08:16+00:00",
    "period_end": "2023-09-10T13:03:16+00:00",
    "quantity": 5,
    "interval_unit": "month",
    "interval_quantity": 1
  }
}
API reference.

The quantity value updates every time you send a usage record request. It will always reflect the unit usage that will be used in the next invoice (calculated using your usage aggregation setting), so you can easily show your customers how many units they have used.

Docs
→
Guides
→
Developer Guide
Using Lemon.js
In this guide we will go though a couple of examples how you can use Lemon.js to open Lemon Squeezy checkouts and listen for various events, directly from you app.

Add the script to your app
You can get started using Lemon.js by embedding our tiny (2.3kB) library via our CDN into the head or body of your page.

<script src="https://app.example.com/js/lemon.js" defer></script>
Buy buttons and checkout overlays
With Lemon.js on your page, you can make checkout URLs automatically open in a checkout overlay by adding lemonsqueezy-button CSS class to your links:

<a class="lemonsqueezy-button" href="https://[STORE].example.com/checkout/buy/...">
    Buy this
</a>
Or you can open checkout URLs using the LemonSqueezy.Url.Open() method:

const checkoutUrl = 'https://[STORE].example.com/checkout/custom/...';
LemonSqueezy.Url.Open(checkoutUrl);
This is useful if you’re generating custom checkout URLs on-the-fly using the API.

Opening other overlays
You can also load the update payment method URLs in an overlay using Lemon.js, creating a much more seamless experience inside your app.

const updatePaymentMethodUrl = '<https://app.example.com/subscription/.../payment-details>...';
LemonSqueezy.Url.Open(updatePaymentMethodUrl);
Handling events
When a Lemon.js overlay is in use (either a checkout or an update payment method form), you can listen for certain events that happen during the form flow:

Event Description
Checkout.Success Checkout was successful
PaymentMethodUpdate.Mounted Payment method overlay has been loaded
PaymentMethodUpdate.Closed Payment method overlay has been closed
PaymentMethodUpdate.Updated Payment method has been updated successfully
You can listen for these events by specifying an eventHandler option in a LemonSqueezy.Setup() call.

LemonSqueezy.Setup({
  eventHandler: (data) => {
    if (data.event == "PaymentMethodUpdate.Updated") {
      // Do something when the payment method has been updated
    }
  }
});
The object passed to the handler contains an event.

{
  event: "PaymentMethodUpdate.Closed"
}
Checkout.Success events also get passed an Order object in data so you have instant access to the order that was just created.

{
  event: "Checkout.Success",
  data: {
    "store_id": 1,
    "customer_id": 1,
    "identifier": "104e18a2-d755-4d4b-80c4-a6c1dcbe1c10",
    "order_number": 1,
    ...
  }
}
To learn more about Lemon.js and advanced usage read the full Lemon.js documentation.

Docs
→
Guides
→
Developer Guide
Testing & Going Live
Learn how to effectively test your Lemon Squeezy API integration in test mode and smoothly transition to live mode for your production environment.

Test mode
To help with testing your integration, we have built a Test mode into every store.

When you sign up to Lemon Squeezy, your store is in Test mode by default, and once your store is activated the Live mode gets turned on.

When Test mode is active, your Lemon Squeezy account changes into a test environment competely separate from your live store, with separate products, customers and purchases.

Once you store is active, you can easily switch between Test mode and Live mode using the toggle in the bottom left of your admin panel.

Lemon Squeezy: Test Mode
Emails sent from Lemon Squeezy when in Test mode will always be sent to the store owner’s email address as well as all team members in that store (regardless of the customer email used at checkout). This includes order receipts, subscription notifications, broadcast emails, etc.

We recommend you start building your integration with Lemon Squeezy in Test mode so that you can more easily make dummy purchases, test the API and set up webhooks with a data set separate from your live store. Then when you’re happy that everything is set up correctly, use Live mode API keys and products in your production environment.

Testing the checkout
In test mode you can make test purchases of your products and subscription through your store’s checkout.

For more information, please refer to the Test mode documentation.

Testing webhooks
In test mode it’s possible to test a full webhook integration. Webhooks are sent for all events just as they are in live mode.

Additionally you can manually simulate individual subscription webhooks from the Lemon Squeezy dashboard.

For more information, please refer to the Webhooks documentation.

Going live checklist
When you’re ready to use your live store, make sure you change some of the values in your app. You should switch to live mode in your Lemon Squeezy dashboard and then make sure you have the following set up correctly.

API keys
Generate a new live mode API key to connect with the live mode API endpoints.

Your test and live mode API keys only work in their respective sides of your store.

Webhooks
Webhooks are also divided into test and live mode. Make sure you add a webhook in your live store, pointing to a production endpoint in your app.

Products
Products created in test mode will not be available in your live store.

However you can easily re-produce your test products in live mode using the helpful “Copy to Live Mode” option.

Lemon Squeezy: Copy to Live Mode
When a product is copied to live mode it gets a new unique ID and therefore its checkout URLs will not be the same. Make sure you update links wherever you have manually pasted checkout URLs.

Personalize your dashboard
On your Lemon Squeezy home page, you see a range of charts. You have the option to change each chart to show different metrics.

If you’re selling subscriptions, we recommend you add some subscription-related charts to your dashboard so you have a better overview of your business.

You can add the following charts:

New subscriptions
Subscription renewals revenue
Monthly recurring revenue (MRR)
Annual recurring revenue (ARR)
Subscription churn rate
Trial conversion rate
In summary, by leveraging Lemon Squeezy’s test mode, you can thoroughly test and refine your API integration with dummy data, and when you’re ready, seamlessly transition to live mode to start processing real transactions with confidence.
