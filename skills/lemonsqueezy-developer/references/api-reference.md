Test mode
You can build and test a full API integration with Lemon Squeezy using Test mode. Any API keys created in Test mode will interact with your test mode store data.

When you are ready to go live with your integration, make sure to create an API key in live mode and use that in your production application.

Versioning
The Lemon Squeezy API includes the major version number as a prefix for all endpoints (e.g. /v1). While we reserve the right to make changes to the API as we see fit, we endeavour not to make any changes to the API that will break backwards compatibility.

In the rare case that we do need to break backwards compatibility, we will release a new major version of the API and deprecate the old version. This will give any integrations time to migrate to the new version.

We consider the following changes to be backwards-compatible:

Adding new API resources.
Adding new optional request parameters to existing API methods.
Adding new properties to existing API responses.
Changing the order of properties in existing API responses.
Adding new webhook event types.
Rate limiting
There is a limit of 300 API calls per minute.

To make it easier to determine if your application is being rate-limited, or is approaching that level, we add the following HTTP headers on our successful responses:

X-Ratelimit-Limit
X-Ratelimit-Remaining
If you exceed the limit you will receive a 429 Too Many Requests response.

SDKs
Official Lemon Squeezy API SDKs:
<https://github.com/lmsqueezy/lemonsqueezy.js>

Lemon Squeezy API responses follow the document structure outlined in the JSON:API spec.

JSON:API spec requires every response to contain a top-level data object/array which will contain one or many resource objects. Each resource object will contain the following properties:

type - The type of the resource (e.g. products, orders, etc.)
id - The id of the resource
attributes - An object representing the resources data
A resource object may also contain optional properties such as relationships, links and meta.

Example
Request

curl "<https://api.lemonsqueezy.com/v1/stores>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'

Response

{
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 10,
      "to": 10,
      "total": 10
    }
  },
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "first": "<https://api.lemonsqueezy.com/v1/stores?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=name>",
    "last": "<https://api.lemonsqueezy.com/v1/stores?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=name>"
  },
  "data": [
    {
      "type": "stores",
      "id": "1",
      "attributes": {
        "name": "My Store",
        "slug": "my-store",
        "domain": "my-store.lemonsqueezy.com",
        "url": "https://my-store.lemonsqueezy.com",
        "avatar_url": "https://app.lemonsqueezy.com/storage/avatars/stores/1/czTkMkDm4Vfb8PZehb5c29XFCm9JZyJx0AjEZP7s.png",
        "plan": "fresh",
        "country": "US",
        "country_nicename": "United States",
        "currency": "USD",
        "total_sales": 1,
        "total_revenue": 999,
        "thirty_day_sales": 0,
        "thirty_day_revenue": 0,
        "created_at": "2024-05-24T14:15:06.000000Z",
        "updated_at": "2024-06-15T10:03:14.000000Z"
      },
      "relationships": {
        "products": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/stores/1/products",
            "self": "https://api.lemonsqueezy.com/v1/stores/1/relationships/products"
          }
        },
        "orders": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/stores/1/orders",
            "self": "https://api.lemonsqueezy.com/v1/stores/1/relationships/orders"
          }
        },
        "subscriptions": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/stores/1/subscriptions",
            "self": "https://api.lemonsqueezy.com/v1/stores/1/relationships/subscriptions"
          }
        },
        "discounts": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/stores/1/discounts",
            "self": "https://api.lemonsqueezy.com/v1/stores/1/relationships/discounts"
          }
        },
        "license-keys": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/stores/1/license-keys",
            "self": "https://api.lemonsqueezy.com/v1/stores/1/relationships/license-keys"
          }
        },
        "webhooks": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/stores/1/webhooks",
            "self": "https://api.lemonsqueezy.com/v1/stores/1/relationships/webhooks"
          }
        }
      },
      "links": {
        "self": "https://api.lemonsqueezy.com/v1/stores/1"
      }
    },
    {...}
    {...}
  ]
}

Errors
The Lemon Squeezy API uses conventional HTTP response codes to indicate the success or failure of an API request. In general, codes in the 2xx range indicate success. Codes in the 4xx range indicate an error that failed given the information provided (e.g., a required parameter was omitted, an action failed, etc). Codes in the 5xx range indicate an error with our servers (these are rare).

A 4xx error will always contain valid JSON:API errors array in the response. Each error object will usually contain several fields that explain the error, including detail, status, title etc. For example:

{
  "jsonapi": {
    "version": "1.0"
  },
  "errors": [
    {
      "detail": "Unauthenticated.",
      "status": "401",
      "title": "Unauthorized"
    }
  ]
}

API Changelog
Keep up to date with changes to our API.

February 25th, 2026
We added a new customer_updated webhook event so you can now watch for customer profile updates and sync changes to your application.
June 11th, 2025
Added payment_processor property to Subscription objects, allowing you to identify which payment provider processed the transaction.
January 21st, 2025
New endpoints: We’ve just added new Affiliates endpoints so you can now query affiliates using the API.
We added a new affiliate_activated webhook event so you can now watch for affiliate activations and update your application accordingly.
September 10th, 2024
Added fraudulent Order status to indicate that an order has been marked as fraudulent.
September 4th, 2024
Added new Issue an Order refund endpoint.
Added new Issue a Subscription Invoice refund endpoint.
Deprecated dark option in the checkout_options attribute when creating a new checkout. Use the new color options instead.
Added the following options to the checkout_options attribute to allow overriding checkout styles when creating a new checkout:
background_color
headings_color
primary_text_color
secondary_text_color
links_color
borders_color
checkbox_color
active_state_color
button_color
button_text_color
terms_privacy_color
August 7th, 2024
Added refunded_amount, refunded_amount_usd and refunded_amount_formatted parameters to Order objects and Subscription invoice objects
The refunded property of Order objects now only
The refunded property of Subscription invoice objects now only reflects whether the invoice has been fully refunded
June 9th, 2024
Added links property to Variant objects.
May 20th, 2024
Added new Generate order invoice endpoint.
April 9th, 2024
You now can modify the expires_at value using the update License Key API endpoint to adjust the expiration date for existing License Keys.
March 28th, 2024
You now can modify the trial_ends_at value using the update subscription API endpoint to adjust the duration of free trials for existing Subscriptions.
Checkout options now include a skip_trial attribute that allows you to create a Custom Checkout without a trial for a variant that typically offers a free trial by default.
February 20th, 2024
Added urls.update_customer_portal parameter to Subscription objects
February 12th, 2024
Added new Generate subscription invoice endpoint.
Added invoice_immediately and disable_prorations parameters to Subscription item update object.
February 5th, 2024
Added tax_inclusive parameter to Order objects and Subscription invoice objects
January 21st, 2024
Added setup_fee_enabled and setup_fee parameters to Price objects
Added setup_fee, setup_fee_usd, and setup_fee_formatted parameters to Order objects
January 15th, 2024
Added unit_price_decimal parameter to Price objects
Updated unit_price parameter availability in Price objects
January 11th, 2024
We updated the created_at, expires_at formatting in our License API endpoints to properly match LicenseKey and LicenseKeyInstance objects.
January 5th, 2024
Added test_mode flag to the Retrieve the authenticated user endpoint’s metadata.
December 21st, 2023
New endpoint: We’ve just added new Update a License Key endpoint.
December 6th, 2024
Added quantity parameter to OrderItem objects.
October 20th, 2023
New endpoints: We’ve added Create customer and Update customer endpoints so you can easily manage your customers.
October 2nd, 2023
We updated our docs regarding subscription proration, specifically how the disable_prorations option works.
September 19th, 2023
We’ve added new customer_portal URLs to Subscription objects and Customer objects, allowing you to link to the new Customer Portal from your application.
August 23rd, 2023
We just added new pricing models and usage-based billing to Lemon Squeezy!
Checkout objects have a new attribute, checkout_data.variant_quantities, used for specifying quantities at checkout.
New Subscription items endpoints.
New Prices endpoints.
Various values have been deprecated from Variant objects (marked as deprecated in the docs) as they have been moved to Price objects. To preserve backwards compatibilty these values are still available in Variant objects but we ask you to use Price objects instead.
New Usage records endpoints.
Subscriptions now include a first_subscription_item object.
Updated relationships for Subscriptions (added Subscription items) and Variants (added Prices).
August 14th, 2023
We added customer_id, user_name and user_email values to Subscription invoice objects to make it easier to match invoices with customers in your application.
July 20th, 2023
We updated the status values in Subscription invoice objects in the docs to properly match API responses.
July 19th, 2023
The lists of card_brand values in Subscription and Subscription invoice objects in the docs have been updated to properly match API responses.
July 5th, 2023
You can now filter subscriptions by status.
June 27th, 2023
We added a new license_key_updated webhook event so you can now watch for license key updates and update your application accordingly. There is also a new “License key updated” trigger in our Zapier integration.
May 25th, 2023
New endpoints: We’ve just added new Webhook endpoints so you can now query, create, update and delete webhooks using the API.
May 12th, 2023
We’ve changed refunded values in Order and Subscription invoice objects to be true or false instead of 1 or 0.
April 17th, 2023
You can now filter the Subscription invoice list endpoint by subscription_id.
March 30th, 2023
We added receipt URLs to Order objects (in the API and webhooks) in urls.receipt.
Update payment method URLs have been moved to your store subdomain rather than app.lemonsqueezy.com
March 17th, 2023
We added a new subscription_updated webhook event to make it easier to keep your local subscription data up-to-date (make sure you subscribe to this event from your existing webhooks). There is also a new “Subscription updated” trigger in our Zapier integration.
Custom data added to checkouts is now saved permanently and is available in all Order, Subscription and License key related webhooks.
We’ve added customer_id to Order, Subscription and License key objects, so you can now easily link customers to other objects. You can also now include customer objects in order, subscription and license key API calls.
card_brand and card_last_four values are now available in Subscription objects.
The subscription_payment_success webhook event is now sent for initial subscription payments as well as renewals.
billing_anchor can now be set to null or 0 to reset it to the current date. Read more →
February 17th, 2023
Full license keys are now included in License Key objects.
February 7th, 2023
New endpoints: We’ve added new Discount redemption endpoints so you can easily query discount usage.
The update subscription API endpoint now has a disable_prorations flag to help manage proration. Read more →
February 6th, 2023
The create checkout endpoint now has a preview option, which returns a preview object containing the checkout totals with discounts and tax taken into account.
February 4th, 2023
We added product_name, variant_name, customer_id, customer_name, and customer_email to the meta object in the License API.
January 25th, 2023
New endpoints: We just added Subscription invoices endpoints, meaning it’s possible to query billing histories for your subscriptions.
January 23rd, 2023
Lemon.js now returns an order object during the Checkout.Success event. Read more →
January 9th, 2023
You can now manually simulate subscription events from within your Dashboard. Read more →
January 5th, 2023
The update subscription API endpoint now has a invoice_immediately flag to help manage renewal invoices. Read more →
December 13th, 2022
New endpoint: We’ve added Customers endpoints so you can retrieve customer data over the API.
Order objects now contain a first_order_item object to reduce the number of API calls required.
October 26th, 2022
Our new Subscription API allows SaaS businesses to control the entire subscription experience end-to-end.

Docs
→
API
→
Users
Retrieve User
GET
/v1/users/me
Retrieves the currently authenticated user.

curl "<https://api.lemonsqueezy.com/v1/users/me>" \
  -H 'Accept: application/vnd.api+json'  \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'

  Returns
Returns a User object.

{
  "meta": {
    "test_mode": true
  },
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/users/1>"
  },
  "data": {
    "type": "users",
    "id": "1",
    "attributes": {
      "name": "John Doe",
      "email": "<johndoe@example.com>",
      "color": "#898FA9",
      "avatar_url": "<https://www.gravatar.com/avatar/1ace5b3965c59dbcd1db79d85da75048?d=blank>",
      "has_custom_avatar": false,
      "createdAt": "2024-05-24T14:08:31.000000Z",
      "updatedAt": "2024-08-26T13:24:54.000000Z"
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/users/1>"
    }
  }
}

Docs
→
API
→
Stores
The Store Object
Everything in Lemon Squeezy belongs to a store. Each store is billed separately.

A store can have many Products, Orders, Subscriptions and License Keys.

Attributes
name
The name of the store.

slug
The slug used to identify the store.

domain
The domain of the store, either in the format {slug}.lemonsqueezy.com or a custom domain.

url
The fully-qualified URL for the store (e.g. https://{slug}.lemonsqueezy.com or <https://customdomain.com> when a custom domain is set up).

avatar_url
The URL for the store avatar.

plan
The current billing plan for the store (e.g. fresh, sweet).

country
The ISO 3166-1 two-letter country code for the store (e.g. US, GB, etc).

country_nicename
The full country name for the store (e.g. United States, United Kingdom, etc).

currency
The ISO 4217 currency code for the store (e.g. USD, GBP, etc).

total_sales
A count of the all-time total sales made by this store.

total_revenue
A positive integer in cents representing the total all-time revenue of the store in USD.

thirty_day_sales
A count of the sales made by this store in the last 30 days.

thirty_day_revenue
A positive integer in cents representing the total revenue of the store in USD in the last 30 days.

created_at
An ISO 8601 formatted date-time string indicating when the object was created.

updated_at
An ISO 8601 formatted date-time string indicating when the object was last updated.

{
  "type": "stores",
  "id": "1",
  "attributes": {
    "name": "My Store",
    "slug": "my-store",
    "domain": "my-store.lemonsqueezy.com",
    "url": "<https://my-store.lemonsqueezy.com>",
    "avatar_url": "<https://app.lemonsqueezy.com/storage/avatars/stores/1/czTkMkDm4Vfb8PZehb5c29XFCm9JZyJx0AjEZP7s.png>",
    "plan": "fresh",
    "country": "US",
    "country_nicename": "United States",
    "currency": "USD",
    "total_sales": 1,
    "total_revenue": 999,
    "thirty_day_sales": 0,
    "thirty_day_revenue": 0,
    "created_at": "2024-05-24T14:15:06.000000Z",
    "updated_at": "2024-06-15T10:03:14.000000Z"
  }
}

Docs
→
API
→
Stores
Retrieve a Store
GET
/v1/stores/:id
Retrieves the store with the given ID.

curl "<https://api.lemonsqueezy.com/v1/stores/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'

Returns
Returns a Store object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/stores/1>"
  },
  "data": {
    "type": "stores",
    "id": "1",
    "attributes": {
      "name": "My Store",
      "slug": "my-store",
      "domain": "my-store.lemonsqueezy.com",
      "url": "<https://my-store.lemonsqueezy.com>",
      "avatar_url": "<https://app.lemonsqueezy.com/storage/avatars/stores/1/czTkMkDm4Vfb8PZehb5c29XFCm9JZyJx0AjEZP7s.png>",
      "plan": "fresh",
      "country": "US",
      "country_nicename": "United States",
      "currency": "USD",
      "total_sales": 1,
      "total_revenue": 999,
      "thirty_day_sales": 0,
      "thirty_day_revenue": 0,
      "created_at": "2021-05-24T14:15:06.000000Z",
      "updated_at": "2021-06-15T10:03:14.000000Z"
    },
    "relationships": {
      "products": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/stores/1/products>",
          "self": "<https://api.lemonsqueezy.com/v1/stores/1/relationships/products>"
        }
      },
      "orders": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/stores/1/orders>",
          "self": "<https://api.lemonsqueezy.com/v1/stores/1/relationships/orders>"
        }
      },
      "subscriptions": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/stores/1/subscriptions>",
          "self": "<https://api.lemonsqueezy.com/v1/stores/1/relationships/subscriptions>"
        }
      },
      "discounts": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/stores/1/discounts>",
          "self": "<https://api.lemonsqueezy.com/v1/stores/1/relationships/discounts>"
        }
      },
      "license-keys": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/stores/1/license-keys>",
          "self": "<https://api.lemonsqueezy.com/v1/stores/1/relationships/license-keys>"
        }
      },
      "webhooks": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/stores/1/webhooks>",
          "self": "<https://api.lemonsqueezy.com/v1/stores/1/relationships/webhooks>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/stores/1>"
    }
  }
}

Docs
→
API
→
Stores
List All Stores
GET
/v1/stores
Retrieves a paginated list of all stores.

curl "<https://api.lemonsqueezy.com/v1/stores>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'

Returns
Returns a paginated list of Store objects ordered by name field in ascending order.

{
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 10,
      "to": 10,
      "total": 10
    }
  },
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "first": "<https://api.lemonsqueezy.com/v1/stores?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=name>",
    "last": "<https://api.lemonsqueezy.com/v1/stores?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=name>"
  },
  "data": [
    {
      "type": "stores",
      "id": "1",
      "attributes": {
        "name": "My Store",
        "slug": "my-store",
        "domain": "my-store.lemonsqueezy.com",
        "url": "https://my-store.lemonsqueezy.com",
        "avatar_url": "https://app.lemonsqueezy.com/storage/avatars/stores/1/czTkMkDm4Vfb8PZehb5c29XFCm9JZyJx0AjEZP7s.png",
        "plan": "fresh",
        "country": "US",
        "country_nicename": "United States",
        "currency": "USD",
        "total_sales": 1,
        "total_revenue": 999,
        "thirty_day_sales": 0,
        "thirty_day_revenue": 0,
        "created_at": "2024-05-24T14:15:06.000000Z",
        "updated_at": "2024-06-15T10:03:14.000000Z"
      },
      "relationships": {
        "products": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/stores/1/products",
            "self": "https://api.lemonsqueezy.com/v1/stores/1/relationships/products"
          }
        },
        "orders": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/stores/1/orders",
            "self": "https://api.lemonsqueezy.com/v1/stores/1/relationships/orders"
          }
        },
        "subscriptions": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/stores/1/subscriptions",
            "self": "https://api.lemonsqueezy.com/v1/stores/1/relationships/subscriptions"
          }
        },
        "discounts": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/stores/1/discounts",
            "self": "https://api.lemonsqueezy.com/v1/stores/1/relationships/discounts"
          }
        },
        "license-keys": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/stores/1/license-keys",
            "self": "https://api.lemonsqueezy.com/v1/stores/1/relationships/license-keys"
          }
        },
        "webhooks": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/stores/1/webhooks",
            "self": "https://api.lemonsqueezy.com/v1/stores/1/relationships/webhooks"
          }
        }
      },
      "links": {
        "self": "https://api.lemonsqueezy.com/v1/stores/1"
      }
    },
    {...}
    {...}
  ]
}

Docs
→
API
→
Customers
The Customer Object
A customer object represents a customer of your store. It is created when they purchase a product for the first time.

A customer belongs to a Store and can have many Orders, Subscriptions and License Keys.

Attributes
store_id
The ID of the store this customer belongs to.

name
The full name of the customer

email
The email address of the customer.

status
The email marketing status of the customer. One of

subscribed - This customer is subscribed to marketing emails.
unsubscribed - This customer has unsubscribed from marketing emails.
archived - This customer has been archived and will no longer recieve marketing emails.
requires_verification - The customers email address need to be verified (happens automatically).
invalid_email - The customers email address has failed validation.
bounced - The customers email has hard bounced.
city
The city of the customer.

region
The region of the customer.

country
The country of the customer.

total_revenue_currency
A positive integer in cents representing the total revenue from the customer (USD).

mrr
A positive integer in cents representing the monthly recurring revenue from the customer (USD).

status_formatted
The formatted status of the customer.

country_formatted
The formatted country of the customer.

total_revenue_currency_formatted
A human-readable string representing the total revenue from the customer (e.g. $9.99).

mrr_formatted
A human-readable string representing the monthly recurring revenue from the customer (e.g. $9.99).

urls
An object of customer-facing URLs. It contains:

customer_portal - A pre-signed URL to the Customer Portal, which allows customers to fully manage their subscriptions and billing information from within your application. The URL is valid for 24 hours from time of request. Will be null if the customer has not bought a subscription in your store.
created_at
An ISO 8601 formatted date-time string indicating when the object was created.

updated_at
An ISO 8601 formatted date-time string indicating when the object was last updated.

test_mode
A boolean indicating if the object was created within test mode.

{
  "type": "customers",
  "id": "1",
  "attributes": {
    "store_id": 1,
    "name": "John Doe",
    "email": "<johndoe@example.com>",
    "status": "subscribed",
    "city": null,
    "region": null,
    "country": "US",
    "total_revenue_currency": 84332,
    "mrr": 1999,
    "status_formatted": "Subscribed",
    "country_formatted": "United States",
    "total_revenue_currency_formatted": "$843.32",
    "mrr_formatted": "$19.99",
    "urls": {
      "customer_portal": "<https://my-store.lemonsqueezy.com/billing?expires=1666869343&signature=82ae290ceac8edd4190c82825dd73a8743346d894a8ddbc4898b97eb96d105a5>"
    },
    "created_at": "2022-12-01T13:01:07.000000Z",
    "updated_at": "2022-12-09T09:05:21.000000Z",
    "test_mode": false
  }
}

Docs
→
API
→
Customers
Create a Customer
POST
/v1/customers
Creates a customer with given attributes.

Attributes
name
The full name of the customer.

email
The email of the customer.

city
Optional
The city of the customer.

region
Optional
The region of the customer.

country
Optional
The ISO 3166-1 two-letter country code for the customer (e.g. US, GB, etc).

Relationships
store
The store this customer belongs to.

curl -X "POST" "<https://api.lemonsqueezy.com/v1/customers>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}' \
  -d $'{
  "data": {
    "type": "customers",
    "attributes": {
      "name": "John Doe",
      "email": "<johndoe@example.com>",
      "city": "New York",
      "region": "NY",
      "country": "US"
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
}'

Returns
Returns the created customer object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/customers/1>"
  },
  "data": {
    "type": "customers",
    "id": "1",
    "attributes": {
      "store_id": 1,
      "name": "John Doe",
      "email": "<johndoe@example.com>",
      "status": "subscribed",
      "city": "New York",
      "region": "NY",
      "country": "US",
      "total_revenue_currency": 0,
      "mrr": 0,
      "status_formatted": "Subscribed",
      "country_formatted": "United States",
      "total_revenue_currency_formatted": "0.00",
      "mrr_formatted": "$0.00",
      "urls": {
        "customer_portal": null
      },
      "created_at": "2022-12-01T13:01:07.000000Z",
      "updated_at": "2022-12-09T09:05:21.000000Z",
      "test_mode": false
    },
    "relationships": {
      "store": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/customers/1/store>",
          "self": "<https://api.lemonsqueezy.com/v1/customers/1/relationships/store>"
        }
      },
      "orders": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/customers/1/orders>",
          "self": "<https://api.lemonsqueezy.com/v1/customers/1/relationships/orders>"
        }
      },
      "subscriptions": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/customers/1/subscriptions>",
          "self": "<https://api.lemonsqueezy.com/v1/customers/1/relationships/subscriptions>"
        }
      },
      "license-keys": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/customers/1/license-keys>",
          "self": "<https://api.lemonsqueezy.com/v1/customers/1/relationships/license-keys>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/customers/1>"
    }
  }
}

Docs
→
API
→
Customers
Retrieve a Customer
GET
/v1/customers/:id
Retrieves the customer with the given ID.

curl "<https://api.lemonsqueezy.com/v1/customers/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'

  Returns
Returns a Customer object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/customers/1>"
  },
  "data": {
    "type": "customers",
    "id": "1",
    "attributes": {
      "store_id": 1,
      "name": "John Doe",
      "email": "<johndoe@example.com>",
      "status": "subscribed",
      "city": null,
      "region": null,
      "country": "US",
      "total_revenue_currency": 84332,
      "mrr": 1999,
      "status_formatted": "Subscribed",
      "country_formatted": "United States",
      "total_revenue_currency_formatted": "$843.32",
      "mrr_formatted": "$19.99",
      "urls": {
        "customer_portal": "<https://my-store.lemonsqueezy.com/billing?expires=1666869343&signature=82ae290ceac8edd4190c82825dd73a8743346d894a8ddbc4898b97eb96d105a5>"
      },
      "created_at": "2022-12-01T13:01:07.000000Z",
      "updated_at": "2022-12-09T09:05:21.000000Z",
      "test_mode": false
    },
    "relationships": {
      "store": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/customers/1/store>",
          "self": "<https://api.lemonsqueezy.com/v1/customers/1/relationships/store>"
        }
      },
      "orders": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/customers/1/orders>",
          "self": "<https://api.lemonsqueezy.com/v1/customers/1/relationships/orders>"
        }
      },
      "subscriptions": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/customers/1/subscriptions>",
          "self": "<https://api.lemonsqueezy.com/v1/customers/1/relationships/subscriptions>"
        }
      },
      "license-keys": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/customers/1/license-keys>",
          "self": "<https://api.lemonsqueezy.com/v1/customers/1/relationships/license-keys>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/customers/1>"
    }
  }
}Docs
→
API
→
Customers
Update a Customer
PATCH
/v1/customers/:id
Updates the customer with the given ID and provided attributes.

Attributes
name
The name of the customer.

email
The email of the customer.

city
The city of the customer.

region
The region of the customer.

country
Optional
The ISO 3166-1 two-letter country code for the customer (e.g. US, GB, etc).

status
Optional
The email marketing status of the customer. One of:

archived - This customer has been archived and will no longer receive marketing emails.
curl -X "PATCH" "<https://api.lemonsqueezy.com/v1/customers/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}' \
  -d $'{
    "data": {
      "type": "customers",
      "id": "1",
      "attributes": {
        "name": "John Doe",
        "email": "<johndoe@example.com>",
        "status": "archived"
      }
    }
  }'

  Returns
Returns the updated customer object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/customers/1>"
  },
  "data": {
    "type": "customers",
    "id": "1",
    "attributes": {
      "store_id": 1,
      "name": "John Doe",
      "email": "<johndoe@example.com>",
      "status": "archived",
      "city": null,
      "region": null,
      "country": "US",
      "total_revenue_currency": 0,
      "mrr": 0,
      "status_formatted": "Archived",
      "country_formatted": "United States",
      "total_revenue_currency_formatted": "$0.00",
      "mrr_formatted": "$0.00",
      "urls": {
        "customer_portal": null
      },
      "created_at": "2022-12-01T13:01:07.000000Z",
      "updated_at": "2022-12-09T09:05:21.000000Z",
      "test_mode": false
    },
    "relationships": {
      "store": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/customers/1/store>",
          "self": "<https://api.lemonsqueezy.com/v1/customers/1/relationships/store>"
        }
      },
      "orders": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/customers/1/orders>",
          "self": "<https://api.lemonsqueezy.com/v1/customers/1/relationships/orders>"
        }
      },
      "subscriptions": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/customers/1/subscriptions>",
          "self": "<https://api.lemonsqueezy.com/v1/customers/1/relationships/subscriptions>"
        }
      },
      "license-keys": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/customers/1/license-keys>",
          "self": "<https://api.lemonsqueezy.com/v1/customers/1/relationships/license-keys>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/customers/1>"
    }
  }
}

Docs
→
API
→
Customers
List All Customers
GET
/v1/customers
Retrieves a paginated list of all customers.

Filter parameters
store_id
Filter customers by the ID of the store they belong to.

email
Filter customers by email field.

curl "<https://api.lemonsqueezy.com/v1/customers>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
curl "<https://api.lemonsqueezy.com/v1/customers?filter[store_id]=1>" \
  -H 'Accept: application/vnd.api+json'  \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a paginated list of Customer objects ordered by created_at field in descending order.

{
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 10,
      "to": 10,
      "total": 10
    }
  },
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "first": "<https://api.lemonsqueezy.com/v1/customers?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=-createdAt>",
    "last": "<https://api.lemonsqueezy.com/v1/customers?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=-createdAt>"
  },
  "data": [
    {
      "type": "customers",
      "id": "1",
      "attributes": {
        "store_id": 1,
        "name": "John Doe",
        "email": "johndoe@example.com",
        "status": "subscribed",
        "city": null,
        "region": null,
        "country": "US",
        "total_revenue_currency": 84332,
        "mrr": 1999,
        "status_formatted": "Subscribed",
        "country_formatted": "United States",
        "total_revenue_currency_formatted": "$843.32",
        "mrr_formatted": "$19.99",
        "urls": {
          "customer_portal": "https://my-store.lemonsqueezy.com/billing?expires=1666869343&signature=82ae290ceac8edd4190c82825dd73a8743346d894a8ddbc4898b97eb96d105a5"
        },
        "created_at": "2024-12-01T13:01:07.000000Z",
        "updated_at": "2024-12-09T09:05:21.000000Z",
        "test_mode": false
      },
      "relationships": {
        "store": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/customers/1/store",
            "self": "https://api.lemonsqueezy.com/v1/customers/1/relationships/store"
          }
        },
        "orders": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/customers/1/orders",
            "self": "https://api.lemonsqueezy.com/v1/customers/1/relationships/orders"
          }
        },
        "subscriptions": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/customers/1/subscriptions",
            "self": "https://api.lemonsqueezy.com/v1/customers/1/relationships/subscriptions"
          }
        },
        "license-keys": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/customers/1/license-keys",
            "self": "https://api.lemonsqueezy.com/v1/customers/1/relationships/license-keys"
          }
        }
      },
      "links": {
        "self": "https://api.lemonsqueezy.com/v1/customers/1"
      }
    },
    {...},
    {...}
  ]
}

Docs
→
API
→
Products
The Product Object
Products describe digital goods you offer to your customers.

A product belongs to a Store and can have many Variants.

Attributes
store_id
The ID of the store this product belongs to.

name
The name of the product.

slug
The slug used to identify the product.

description
The description of the product in HTML.

status
The status of the product. Either draft or published.

status_formatted
The formatted status of the product.

thumb_url
A URL to the thumbnail image for this product (if one exists). The image will be 100x100px in size.

large_thumb_url
A URL to the large thumbnail image for this product (if one exists). The image will be 1000x1000px in size.

price
A positive integer in cents representing the price of the product.

price_formatted
A human-readable string representing the price of the product (e.g. $9.99).

from_price
If this product has multiple variants, this will be a positive integer in cents representing the price of the cheapest variant. Otherwise, it will be null.

from_price_formatted
If this product has multiple variants, this will be a human-readable string representing the price of the cheapest variant. Otherwise, it will be null.

to_price
If this product has multiple variants, this will be a positive integer in cents representing the price of the most expensive variant. Otherwise, it will be null.

to_price_formatted
If this product has multiple variants, this will be a human-readable string representing the price of the most expensive variant. Otherwise, it will be null.

pay_what_you_want
Has the value true if this is a “pay what you want” product where the price can be set by the customer at checkout.

buy_now_url
A URL to purchase this product using the Lemon Squeezy checkout.

created_at
An ISO 8601 formatted date-time string indicating when the object was created.

updated_at
An ISO 8601 formatted date-time string indicating when the object was last updated.

test_mode
A boolean indicating if the object was created within test mode.

{
  "type": "products",
  "id": "1",
  "attributes": {
    "store_id": 1,
    "name": "Example Product",
    "slug": "example-product",
    "description": "<p>Lorem ipsum...</p>",
    "status": "published",
    "status_formatted": "Published",
    "thumb_url": "<https://app.lemonsqueezy.com/storage/media/1/1c40f227-aed5-4321-9ffc-62f37a06c9a0.jpg>",
    "large_thumb_url": "<https://app.lemonsqueezy.com/storage/media/1/1c40f227-aed5-4321-9ffc-62f37a06c9a0.jpg>",
    "price": 999,
    "price_formatted": "$9.99",
    "from_price": null,
    "to_price": null,
    "pay_what_you_want": false,
    "buy_now_url": "<https://my-store.lemonsqueezy.com/checkout/buy/0a841cf5-4cc2-4bbb-ae5d-9529d97deec6>",
    "from_price_formatted": null,
    "to_price_formatted": null,
    "created_at": "2021-05-27T12:54:47.000000Z",
    "updated_at": "2021-07-14T11:25:24.000000Z",
    "test_mode": false
  }
}

Docs
→
API
→
Products
Retrieve a Product
GET
/v1/products/:id
Retrieves the product with the given ID.

curl "<https://api.lemonsqueezy.com/v1/products/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a Product object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/products/1>"
  },
  "data": {
    "type": "products",
    "id": "1",
    "attributes": {
      "store_id": 1,
      "name": "Lemonade",
      "slug": "lemonade",
      "description": "<p>Lorem ipsum...</p>",
      "status": "published",
      "status_formatted": "Published",
      "thumb_url": "<https://app.lemonsqueezy.com/storage/media/1/1c40f227-aed5-4321-9ffc-62f37a06c9a0.jpg>",
      "large_thumb_url": "<https://app.lemonsqueezy.com/storage/media/1/1c40f227-aed5-4321-9ffc-62f37a06c9a0.jpg>",
      "price": 999,
      "price_formatted": "$9.99",
      "from_price": null,
      "to_price": null,
      "pay_what_you_want": false,
      "buy_now_url": "<https://my-store.lemonsqueezy.com/checkout/buy/0a841cf5-4cc2-4bbb-ae5d-9529d97deec6>",
      "from_price_formatted": null,
      "to_price_formatted": null,
      "created_at": "2021-05-27T12:54:47.000000Z",
      "updated_at": "2021-07-14T11:25:24.000000Z",
      "test_mode": false
    },
    "relationships": {
      "store": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/products/1/store>",
          "self": "<https://api.lemonsqueezy.com/v1/products/1/relationships/store>"
        }
      },
      "variants": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/products/1/variants>",
          "self": "<https://api.lemonsqueezy.com/v1/products/1/relationships/variants>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/products/1>"
    }
  }
}

Docs
→
API
→
Products
List All Products
GET
/v1/products
Retrieves a paginated list of all products.

Filter parameters
store_id
Filter products by the ID of the store they belong to.

curl "<https://api.lemonsqueezy.com/v1/products>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
curl "<https://api.lemonsqueezy.com/v1/products?filter[store_id]=1>" \
  -H 'Accept: application/vnd.api+json'  \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a paginated list of Product objects ordered by name field in ascending order.

{
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 10,
      "to": 10,
      "total": 10
    }
  },
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "first": "<https://api.lemonsqueezy.com/v1/products?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=name>",
    "last": "<https://api.lemonsqueezy.com/v1/products?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=name>"
  },
  "data": [
    {
      "type": "products",
      "id": "1",
      "attributes": {
        "store_id": 1,
        "name": "Lemonade",
        "slug": "lemonade",
        "description": "<p>Lorem ipsum...</p>",
        "status": "published",
        "status_formatted": "Published",
        "thumb_url": "https://app.lemonsqueezy.com/storage/media/1/1c40f227-aed5-4321-9ffc-62f37a06c9a0.jpg",
        "large_thumb_url": "https://app.lemonsqueezy.com/storage/media/1/1c40f227-aed5-4321-9ffc-62f37a06c9a0.jpg",
        "price": 999,
        "price_formatted": "$9.99",
        "from_price": null,
        "to_price": null,
        "pay_what_you_want": false,
        "buy_now_url": "https://my-store.lemonsqueezy.com/checkout/buy/0a841cf5-4cc2-4bbb-ae5d-9529d97deec6",
        "created_at": "2024-05-27T12:54:47.000000Z",
        "updated_at": "2024-07-14T11:25:24.000000Z",
        "test_mode": false
      },
      "relationships": {
        "store": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/products/1/store",
            "self": "https://api.lemonsqueezy.com/v1/products/1/relationships/store"
          }
        },
        "variants": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/products/1/variants",
            "self": "https://api.lemonsqueezy.com/v1/products/1/relationships/variants"
          }
        }
      },
      "links": {
        "self": "https://api.lemonsqueezy.com/v1/products/1"
      }
    },
    {...},
    {...}
  ]
}

 Docs
→
API
→
Variants
The Variant Object
A variant represents a variation of a Product, with its own set of pricing options, files and license key settings.

A product will always have at least one variant. If only one variant exists for a product, it is considered the “default” variant and it is not shown as a separate option at checkout. It will also have a pending status.

A variant belongs to a Product and can have one Price and many Files. A product can have one or more Variants.

Attributes
product_id
The ID of the product this variant belongs to.

name
The name of the variant.

slug
The slug used to identify the variant.

description
The description of the variant in HTML.

has_license_keys
Has the value true if this variant should generate license keys for the customer on purchase.

license_activation_limit
The maximum number of times a license key can be activated for this variant.

is_license_limit_unlimited
Has the value true if license key activations are unlimited for this variant.

license_length_value
The number of units (specified in the license_length_unit attribute) until a license key expires.

license_length_unit
The unit linked with the license_length_value attribute. One of

days
months
years
For example, license_length_value=3 and license_length_unit=months license keys will expire after 3 months.

is_license_length_unlimited
Has the value true if license keys should never expire.

Note: If the variant is a subscription, the license key expiration will be linked to the status of the subscription (e.g. the license will expire when the subscription expires).

links
An array of the link objects.

title The title of the link
url The URL of the link
sort
An integer representing the order of this variant when displayed on the checkout.

status
The status of the variant. One of

pending
draft
published
Note: If a variant has a pending status and its product has no other variants, it is considered the “default” variant and is not shown as a separate option at checkout.

status_formatted
The formatted status of the variant.

created_at
An ISO 8601 formatted date-time string indicating when the object was created.

updated_at
An ISO 8601 formatted date-time string indicating when the object was last updated.

test_mode
A boolean indicating if the object was created within test mode.

{
  "type": "variants",
  "id": "1",
  "attributes": {
    "product_id": 1,
    "name": "Example Variant",
    "slug": "46beb127-a8a9-33e6-89b5-078505657239",
    "description": "<p>Lorem ipsum...</p>",
    "price": 999,
    "is_subscription": false,
    "interval": null,
    "interval_count": null,
    "has_free_trial": false,
    "trial_interval": "day",
    "trial_interval_count": 30,
    "pay_what_you_want": false,
    "min_price": 0,
    "suggested_price": 0,
    "has_license_keys": false,
    "license_activation_limit": 5,
    "is_license_limit_unlimited": false,
    "license_length_value": 1,
    "license_length_unit": "years",
    "is_license_length_unlimited": false,
    "sort": 1,
    "status": "published",
    "status_formatted": "Published",
    "created_at": "2021-05-24T14:15:06.000000Z",
    "updated_at": "2021-06-24T14:44:38.000000Z",
    "test_mode": false
  }
}
Deprecated attributes
The following attributes have been moved to Price objects but are still included in Variant objects for backwards compatibility.

Please change to using Price objects in your integration to query price details of your variants.

price
Deprecated
A positive integer in cents representing the price of the variant.

is_subscription
Deprecated
Has the value true if this variant is a subscription.

interval
Deprecated
If this variant is a subscription, this is the frequency at which a subscription is billed. One of

day
week
month
year
interval_count
Deprecated
If this variant is a subscription, this is the number of intervals (specified in the interval attribute) between subscription billings. For example, interval=month and interval_count=3 bills every 3 months.

has_free_trial
Deprecated
Has the value true if this variant has a free trial period. Only available if the variant is a subscription.

trial_interval
Deprecated
The interval unit of the free trial. One of

day
week
month
year
trial_interval_count
Deprecated
If interval count of the free trial. For example, a variant with trial_interval=day and trial_interval_count=14 would have a free trial that lasts 14 days.

pay_what_you_want
Deprecated
Has the value true if this is a “pay what you want” variant where the price can be set by the customer at checkout.

min_price
Deprecated
If pay_what_you_want is true, this is the minimum price this variant can be purchased for, as a positive integer in cents.

suggested_price
Deprecated
If pay_what_you_want is true, this is the suggested price for this variant shown at checkout, as a positive integer in cents.

Docs
→
API
→
Variants
Retrieve a Variant
GET
/v1/variants/:id
Retrieves the variant with the given ID.

curl "<https://api.lemonsqueezy.com/v1/variants/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a Variant object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/variants/1>"
  },
  "data": {
    "type": "variants",
    "id": "1",
    "attributes": {
      "product_id": 1,
      "name": "Citrus Burst Lemonade",
      "slug": "46beb127-a8a9-33e6-89b5-078505657239",
      "description": "<p>Lorem ipsum...</p>",
      "links": [],
      "price": 999,
      "is_subscription": false,
      "interval": null,
      "interval_count": null,
      "has_free_trial": false,
      "trial_interval": "day",
      "trial_interval_count": 30,
      "pay_what_you_want": false,
      "min_price": 0,
      "suggested_price": 0,
      "has_license_keys": false,
      "license_activation_limit": 5,
      "is_license_limit_unlimited": false,
      "license_length_value": 1,
      "license_length_unit": "years",
      "is_license_length_unlimited": false,
      "sort": 1,
      "status": "published",
      "status_formatted": "Published",
      "created_at": "2024-05-24T14:15:06.000000Z",
      "updated_at": "2024-06-24T14:44:38.000000Z",
      "test_mode": false
    },
    "relationships": {
      "product": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/variants/1/product>",
          "self": "<https://api.lemonsqueezy.com/v1/variants/1/relationships/product>"
        }
      },
      "files": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/variants/1/files>",
          "self": "<https://api.lemonsqueezy.com/v1/variants/1/relationships/files>"
        }
      },
      "price-model": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/variants/1/price-model>",
          "self": "<https://api.lemonsqueezy.com/v1/variants/1/relationships/price-model>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/variants/1>"
    }
  }
}

Docs
→
API
→
Variants
List All Variants
GET
/v1/variants
Retrieves a paginated list of variants.

Filter parameters
product_id
Filter variants by the ID of their associated product.

status
Filter variants by status field.

curl "<https://api.lemonsqueezy.com/v1/variants>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
curl "<https://api.lemonsqueezy.com/v1/variants?filter[product_id]=19>" \
  -H 'Accept: application/vnd.api+json'  \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a paginated list of Variant objects ordered by the sort field.

{
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 10,
      "to": 10,
      "total": 10
    }
  },
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "first": "<https://api.lemonsqueezy.com/v1/variants?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=sort>",
    "last": "<https://api.lemonsqueezy.com/v1/variants?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=sort>"
  },
  "data": [
    {
      "type": "variants",
      "id": "1",
      "attributes": {
        "product_id": 1,
        "name": "Example Variant",
        "slug": "46beb127-a8a9-33e6-89b5-078505657239",
        "description": "<p>Lorem ipsum...</p>",
        "links": [],
        "price": 999,
        "is_subscription": false,
        "interval": null,
        "interval_count": null,
        "has_free_trial": false,
        "trial_interval": "day",
        "trial_interval_count": 30,
        "pay_what_you_want": false,
        "min_price": 0,
        "suggested_price": 0,
        "has_license_keys": false,
        "license_activation_limit": 5,
        "is_license_limit_unlimited": false,
        "license_length_value": 1,
        "license_length_unit": "years",
        "is_license_length_unlimited": false,
        "sort": 1,
        "status": "published",
        "status_formatted": "Published",
        "created_at": "2021-05-24T14:15:06.000000Z",
        "updated_at": "2021-06-24T14:44:38.000000Z",
        "test_mode": false
      },
      "relationships": {
        "product": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/variants/1/product",
            "self": "https://api.lemonsqueezy.com/v1/variants/1/relationships/product"
          }
        }
      },
      "links": {
        "self": "https://api.lemonsqueezy.com/v1/variants/1"
      }
    },
 {...},
 {...},
  ]
}

Docs
→
API
→
Prices
The Price Object
A price object represents a price added to a Variant.

When a variant’s price is changed a new price object is created. All old prices are retained.

A price belongs to a Variant and can have many Subscription Items and Usage records.

Attributes
variant_id
The ID of the variant this price belongs to.

category
The type of variant this price was created for. One of:

one_time - A regular product
subscription - A subscription
lead_magnet - A free lead magnet
pwyw - “Pay what you want” product
scheme
The pricing model for this price. One of:

standard
package
graduated
volume
usage_aggregation
The type of usage aggregation in use if usage-based billing is activated. One of:

sum - Sum of usage during period
last_during_period - Most recent usage during a period
last_ever - Most recent usage
max - Maximum usage during period
Will be null if usage-based billing is not activated on this price’s variant.

unit_price
A positive integer in cents representing the price.

Not used for volume and graduated pricing (tier data is used instead).

If usage_aggregation is enabled for this price, unit_price will be null and unit_price_decimal will be used instead.

unit_price_decimal
A positive decimal string in cents representing the price.

Not used for volume and graduated pricing (tier data is used instead).

If usage_aggregation is not enabled for this price, unit_price_decimal will be null and unit_price will be used instead.

setup_fee_enabled
A boolean indicating if the price has a setup fee.

Will be null for non-subscription pricing.

setup_fee
A positive integer in cents representing the setup fee.

Will be null for non-subscription pricing.

package_size
The number of units included in each package when using package pricing.

Will be 1 for standard, graduated and volume pricing.

tiers
A list of pricing tier objects when using volume and graduated pricing.

Tiers have three values:

last_unit - The top limit of this tier. Will be an integer or "inf" (for “infinite”) if this is the highest-level tier.
unit_price - A positive integer in cents representing the price of each unit. Will be null if usage-based billing is activated on this price’s variant.
unit_price_decimal - A positive decimal string in cents representing the price of each unit. Will be null if usage-based billing is not activated on this price’s variant.
fixed_fee - An optional fixed fee charged alongside the unit price.
Will be null for standard and package pricing.

renewal_interval_unit
If the price’s variant is a subscription, the billing interval. One of:

day
week
month
year
Will be null if the product is not a subscription.

renewal_interval_quantity
If the price’s variant is a subscription, this is the number of intervals (specified in the renewal_interval_unit attribute) between subscription billings.

For example, renewal_interval_unit=month and renewal_interval_quantity=3 bills every 3 months.

Will be null if the product is not a subscription.

trial_interval_unit
The interval unit of the free trial. One of

day
week
month
year
Will be null if there is no trial.

trial_interval_quantity
The interval count of the free trial. For example, a variant with trial_interval_unit=day and trial_interval_quantity=14 would have a free trial that lasts 14 days.

Will be null if there is no trial.

min_price
If category is pwyw, this is the minimum price this variant can be purchased for, as a positive integer in cents.

Will be null for all other categories.

suggested_price
If category is pwyw, this is the suggested price for this variant shown at checkout, as a positive integer in cents.

Will be null for all other categories.

tax_code
The product’s tax category. One of:

eservice
ebook
saas
created_at
An ISO 8601 formatted date-time string indicating when the object was created.

updated_at
An ISO 8601 formatted date-time string indicating when the object was last updated.

{
  "type": "prices",
  "id": "1",
  "attributes": {
    "variant_id": 1,
    "category": "subscription",
    "scheme": "graduated",
    "usage_aggregation": null,
    "unit_price": 999,
    "unit_price_decimal": null,
    "setup_fee_enabled": false,
    "setup_fee": null,
    "package_size": 1,
    "tiers": [
      {
        "last_unit": 2,
        "unit_price": 10000,
        "unit_price_decimal": null,
        "fixed_fee": 1000
      },
      {
        "last_unit": "inf",
        "unit_price": 1000,
        "unit_price_decimal": null,
        "fixed_fee": 1000
      }
    ],
    "renewal_interval_unit": "year",
    "renewal_interval_quantity": 1,
    "trial_interval_unit": "day",
    "trial_interval_quantity": 30,
    "min_price": null,
    "suggested_price": null,
    "tax_code": "eservice",
    "created_at": "2023-05-24T14:15:06.000000Z",
    "updated_at": "2023-06-24T14:44:38.000000Z"
  }
}

Docs
→
API
→
Prices
Retrieve a Price
GET
/v1/prices/:id
Retrieves the price with the given ID.

curl "<https://api.lemonsqueezy.com/v1/prices/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'

  Returns
Returns a Price object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/prices/1>"
  },
  "data": {
    "type": "prices",
    "id": "1",
    "attributes": {
      "variant_id": 1,
      "category": "subscription",
      "scheme": "graduated",
      "usage_aggregation": null,
      "unit_price": 999,
      "unit_price_decimal": null,
      "setup_fee_enabled": false,
      "setup_fee": null,
      "package_size": 1,
      "tiers": [
        {
          "last_unit": 2,
          "unit_price": 10000,
          "unit_price_decimal": null,
          "fixed_fee": 1000
        },
        {
          "last_unit": "inf",
          "unit_price": 1000,
          "unit_price_decimal": null,
          "fixed_fee": 1000
        }
      ],
      "renewal_interval_unit": "year",
      "renewal_interval_quantity": 1,
      "trial_interval_unit": "day",
      "trial_interval_quantity": 30,
      "min_price": null,
      "suggested_price": null,
      "tax_code": "eservice",
      "created_at": "2023-05-24T14:15:06.000000Z",
      "updated_at": "2023-06-24T14:44:38.000000Z"
    },
    "relationships": {
      "variant": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/prices/1/variant>",
          "self": "<https://api.lemonsqueezy.com/v1/prices/1/relationships/variant>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/prices/1>"
    }
  }
}

Docs
→
API
→
Prices
List All Prices
GET
/v1/prices
Retrieves a paginated list of prices.

Filter parameters
variant_id
Return only prices associated with the variant with this ID.

curl "<https://api.lemonsqueezy.com/v1/prices>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
curl "<https://api.lemonsqueezy.com/v1/prices?filter[variant_id]=11>" \
  -H 'Accept: application/vnd.api+json'  \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a paginated list of Price objects ordered by created_at in descending order.

{
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 10,
      "to": 10,
      "total": 10
    }
  },
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "first": "<https://api.lemonsqueezy.com/v1/prices?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=-created_at>",
    "last": "<https://api.lemonsqueezy.com/v1/prices?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=-created_at>"
  },
  "data": [
    {
      "type": "prices",
      "id": "1",
      "attributes": {
        "variant_id": 1,
        "category": "subscription",
        "scheme": "graduated",
        "usage_aggregation": null,
        "unit_price": 999,
        "unit_price_decimal": null,
        "setup_fee_enabled": false,
        "setup_fee": null,
        "package_size": 1,
        "tiers": [
          {
            "last_unit": 2,
            "unit_price": 10000,
            "unit_price_decimal": null,
            "fixed_fee": 1000
          },
          {
            "last_unit": "inf",
            "unit_price": 1000,
            "unit_price_decimal": null,
            "fixed_fee": 1000
          }
        ],
        "renewal_interval_unit": "year",
        "renewal_interval_quantity": 1,
        "trial_interval_unit": "day",
        "trial_interval_quantity": 30,
        "min_price": null,
        "suggested_price": null,
        "tax_code": "eservice",
        "created_at": "2023-05-24T14:15:06.000000Z",
        "updated_at": "2023-06-24T14:44:38.000000Z"
      },
      "relationships": {
        "variant": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/prices/1/variant",
            "self": "https://api.lemonsqueezy.com/v1/prices/1/relationships/variant"
          }
        }
      },
      "links": {
        "self": "https://api.lemonsqueezy.com/v1/prices/1"
      }
    },
    {...},
    {...},
  ]
}

Docs
→
API
→
Files
The File Object
A file represents a digital good that can be downloaded by a customer after the product has been purchased.

A file belongs to a Variant.

Attributes
variant_id
The ID of the variant this price belongs to.

variant_id
The ID of the variant this file belongs to.

identifier
The unique identifier (UUID) for this file.

name
The name of the file (e.g. example.pdf).

extension
The file extension of the file (e.g. pdf).

download_url
The unique URL to download the file. Note: for security reasons, download URLs are signed, expire after 1 hour and are rate-limited to 10 downloads per day per IP address.

size
A positive integer in bytes representing the size of the file.

size_formatted
The human-readable size of the file (e.g. 5.5 MB).

version
The software version of this file (if one exists, e.g. 1.0.0).

sort
An integer representing the order of this file when displayed.

status
The status of the file. Either draft or published.

createdAt
An ISO 8601 formatted date-time string indicating when the object was created.

updatedAt
An ISO 8601 formatted date-time string indicating when the object was last updated.

test_mode
A boolean indicating if the object was created within test mode.

{
  "type": "files",
  "id": "1",
  "attributes": {
    "variant_id": 168,
    "identifier": "6dce5ba7-76f2-481f-ad1e-9c2bec6eb0e2",
    "name": "my_product.zip",
    "extension": "zip",
    "download_url": "<https://app.lemonsqueezy.com/download/6dce5ba7-76f2-481f-ad1e-9c2bec6eb0e2?expires=1636383388&signature=886a63faf7215c54011accfa08578b1b687def66f767092629f263061b3a253a>",
    "size": 874694,
    "size_formatted": "854 KB",
    "version": "1.0.0",
    "sort": 1,
    "status": "published",
    "createdAt": "2021-11-05T10:22:14.000000Z",
    "updatedAt": "2021-11-05T16:16:33.000000Z",
    "test_mode": false
  }
}

Docs
→
API
→
Files
Retrieve a File
GET
/v1/files/:id
Retrieves the file with the given ID.

curl "<https://api.lemonsqueezy.com/v1/files/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a File object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/files/1>"
  },
  "data": {
    "type": "files",
    "id": "1",
    "attributes": {
      "variant_id": 168,
      "identifier": "6dce5ba7-76f2-481f-ad1e-9c2bec6eb0e2",
      "name": "lemonade.zip",
      "extension": "zip",
      "download_url": "<https://app.lemonsqueezy.com/download/6dce5ba7-76f2-481f-ad1e-9c2bec6eb0e2?expires=1636384018&signature=f0a9bdec44ffabf143d4689594491f42a76d773d3cc88ec23ef84d6e903e8f11>",
      "size": 874694,
      "size_formatted": "854 KB",
      "version": "1.0.0",
      "sort": 1,
      "status": "published",
      "createdAt": "2024-11-05T10:22:14.000000Z",
      "updatedAt": "2024-11-05T16:16:33.000000Z",
      "test_mode": false
    },
    "relationships": {
      "variant": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/files/1/variant>",
          "self": "<https://api.lemonsqueezy.com/v1/files/1/relationships/variant>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/files/1>"
    }
  }
}

Docs
→
API
→
Files
List All Files
GET
/v1/files
Returns a paginated list of files.

Filter parameters
variant_id
Return only files associated with the variant with this ID.

curl "<https://api.lemonsqueezy.com/v1/files>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
curl "<https://api.lemonsqueezy.com/v1/files?filter[variant_id]=8>" \
  -H 'Accept: application/vnd.api+json'  \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a paginated list of File objects.

{
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 10,
      "to": 10,
      "total": 10
    }
  },
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "first": "<https://api.lemonsqueezy.com/v1/files?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=sort>",
    "last": "<https://api.lemonsqueezy.com/v1/files?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=sort>"
  },
  "data": [
    {
      "type": "files",
      "id": "1",
      "attributes": {
        "variant_id": 168,
        "identifier": "6dce5ba7-76f2-481f-ad1e-9c2bec6eb0e2",
        "name": "lemonade.zip",
        "extension": "zip",
        "download_url": "https://app.lemonsqueezy.com/download/6dce5ba7-76f2-481f-ad1e-9c2bec6eb0e2?expires=1636383388&signature=886a63faf7215c54011accfa08578b1b687def66f767092629f263061b3a253a",
        "size": 874694,
        "size_formatted": "854 KB",
        "version": "1.0.0",
        "sort": 1,
        "status": "published",
        "createdAt": "2021-11-05T10:22:14.000000Z",
        "updatedAt": "2021-11-05T16:16:33.000000Z",
        "test_mode": false
      },
      "relationships": {
        "variant": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/files/1/variant",
            "self": "https://api.lemonsqueezy.com/v1/files/1/relationships/variant"
          }
        }
      },
      "links": {
        "self": "https://api.lemonsqueezy.com/v1/files/1"
      }
    },
    {...},
    {...},
  ]
}

Docs
→
API
→
Orders
The Order Object
An order is created when a customer purchases a product.

An order belongs to a Store, is associated with a Customer and can have many Order Items, Subscriptions, License Keys and Discount Redemptions.

Attributes
store_id
The ID of the store this order belongs to.

customer_id
The ID of the customer this order belongs to.

identifier
The unique identifier (UUID) for this order.

order_number
An integer representing the sequential order number for this store.

user_name
The full name of the customer.

user_email
The email address of the customer.

currency
The ISO 4217 currency code for the order (e.g. USD, GBP, etc).

currency_rate
If the order currency is USD, this will always be 1.0. Otherwise, this is the currency conversion rate used to determine the cost of the order in USD at the time of purchase.

subtotal
A positive integer in cents representing the subtotal of the order in the order currency.

setup_fee
A positive integer in cents representing the setup fee of the order in the order currency.

discount_total
A positive integer in cents representing the total discount value applied to the order in the order currency.

tax
A positive integer in cents representing the tax applied to the order in the order currency.

total
A positive integer in cents representing the total cost of the order in the order currency.

refunded_amount
A positive integer in cents representing the refunded amount of the order in the order currency.

subtotal_usd
A positive integer in cents representing the subtotal of the order in USD.

setup_fee_usd
A positive integer in cents representing the setup fee of the order in USD.

discount_total_usd
A positive integer in cents representing the total discount value applied to the order in USD.

tax_usd
A positive integer in cents representing the tax applied to the order in USD.

total_usd
A positive integer in cents representing the total cost of the order in USD.

refunded_amount_usd
A positive integer in cents representing the refunded amount of the order in USD.

tax_name
The name of the tax rate (e.g. VAT, Sales Tax, etc) applied to the order. Will be null if no tax was applied.

tax_rate
If tax is applied to the order, this will be the rate of tax as a decimal percentage.

tax_inclusive
A boolean indicating if the order was created with tax inclusive or exclusive pricing.

status
The status of the order. One of:

pending
failed
paid
refunded
partial_refund
fraudulent
status_formatted
The formatted status of the order.

refunded
Has the value true if the order has been fully refunded.

refunded_at
If the order has been fully refunded, this will be an ISO 8601 formatted date-time string indicating when the order was refunded.

subtotal_formatted
A human-readable string representing the subtotal of the order in the order currency (e.g. $9.99).

setup_fee_formatted
A human-readable string representing the setup fee of the order in the order currency (e.g. $9.99).

discount_total_formatted
A human-readable string representing the total discount value applied to the order in the order currency (e.g. $9.99).

tax_formatted
A human-readable string representing the tax applied to the order in the order currency (e.g. $9.99).

total_formatted
A human-readable string representing the total cost of the order in the order currency (e.g. $9.99).

refunded_amount_formatted
A human-readable string representing the refunded amount of the order in the order currency (e.g. $9.99).

first_order_item
An object representing the first Order Item belonging to this order.

id - The ID of the order item.
order_id - The ID of the order.
product_id - The ID of the product.
variant_id - The ID of the product variant.
product_name - The name of the product.
variant_name - The name of the product variant.
price - A positive integer in cents representing the price of the order item in the order currency.
created_at - An ISO 8601 formatted date-time string indicating when the order item was created.
updated_at - An ISO 8601 formatted date-time string indicating when the order item was last updated.
test_mode - A boolean indicating if the order was made in test mode.
urls
An object of customer-facing URLs for this order. It contains:

receipt - A pre-signed URL for viewing the order in the customer’s My Orders page.
created_at
An ISO 8601 formatted date-time string indicating when the object was created.

updated_at
An ISO 8601 formatted date-time string indicating when the object was last updated.

test_mode
A boolean indicating if the object was created within test mode.

{
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
    "setup_fee": 999,
    "discount_total": 0,
    "tax": 200,
    "total": 1199,
    "subtotal_usd": 999,
    "setup_fee_usd": 999,
    "discount_total_usd": 0,
    "tax_usd": 200,
    "total_usd": 1199,
    "tax_name": "VAT",
    "tax_rate": "20.00",
    "tax_inclusive": false,
    "status": "paid",
    "status_formatted": "Paid",
    "refunded": false,
    "refunded_at": null,
    "subtotal_formatted": "$9.99",
    "setup_fee_formatted": "$9.99",
    "discount_total_formatted": "$0.00",
    "tax_formatted": "$2.00",
    "total_formatted": "$11.99",
    "first_order_item": {
      "id": 1,
      "order_id": 1,
      "product_id": 1,
      "variant_id": 1,
      "product_name": "Test Limited License for 2 years",
      "variant_name": "Default",
      "price": 1199,
      "created_at": "2021-08-17T09:45:53.000000Z",
      "updated_at": "2021-08-17T09:45:53.000000Z",
      "test_mode": false
    },
    "urls": {
      "receipt": "<https://app.lemonsqueezy.com/my-orders/104e18a2-d755-4d4b-80c4-a6c1dcbe1c10?signature=8847fff02e1bfb0c7c43ff1cdf1b1657a8eed2029413692663b86859208c9f42>"
    },
    "created_at": "2021-08-17T09:45:53.000000Z",
    "updated_at": "2021-08-17T09:45:53.000000Z",
    "test_mode": false
  }
}

Docs
→
API
→
Orders
Retrieve an Order
GET
/v1/orders/:id
Retrieves the order with the given ID.

curl "<https://api.lemonsqueezy.com/v1/orders/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns an Order object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/orders/1>"
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
      "setup_fee": 999,
      "discount_total": 0,
      "tax": 200,
      "total": 1199,
      "subtotal_usd": 999,
      "setup_fee_usd": 999,
      "discount_total_usd": 0,
      "tax_usd": 200,
      "total_usd": 1199,
      "tax_name": "VAT",
      "tax_rate": "20.00",
      "tax_inclusive": false,
      "status": "paid",
      "status_formatted": "Paid",
      "refunded": false,
      "refunded_at": null,
      "subtotal_formatted": "$9.99",
      "setup_fee_formatted": "$9.99",
      "discount_total_formatted": "$0.00",
      "tax_formatted": "$2.00",
      "total_formatted": "$11.99",
      "first_order_item": {
        "id": 1,
        "order_id": 1,
        "product_id": 1,
        "variant_id": 1,
        "product_name": "Test Limited License for 2 years",
        "variant_name": "Default",
        "price": 1199,
        "created_at": "2024-08-17T09:45:53.000000Z",
        "updated_at": "2024-08-17T09:45:53.000000Z",
        "deleted_at": null,
        "test_mode": false
      },
      "urls": {
        "receipt": "<https://app.lemonsqueezy.com/my-orders/104e18a2-d755-4d4b-80c4-a6c1dcbe1c10?signature=8847fff02e1bfb0c7c43ff1cdf1b1657a8eed2029413692663b86859208c9f42>"
      },
      "created_at": "2024-08-17T09:45:53.000000Z",
      "updated_at": "2024-08-17T09:45:53.000000Z",
      "test_mode": false
    },
    "relationships": {
      "store": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/orders/1/store>",
          "self": "<https://api.lemonsqueezy.com/v1/orders/1/relationships/store>"
        }
      },
      "customer": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/orders/1/customer>",
          "self": "<https://api.lemonsqueezy.com/v1/orders/1/relationships/customer>"
        }
      },
      "order-items": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/orders/1/order-items>",
          "self": "<https://api.lemonsqueezy.com/v1/orders/1/relationships/order-items>"
        }
      },
      "subscriptions": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/orders/1/subscriptions>",
          "self": "<https://api.lemonsqueezy.com/v1/orders/1/relationships/subscriptions>"
        }
      },
      "license-keys": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/orders/1/license-keys>",
          "self": "<https://api.lemonsqueezy.com/v1/orders/1/relationships/license-keys>"
        }
      },
      "discount-redemptions": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/orders/1/discount-redemptions>",
          "self": "<https://api.lemonsqueezy.com/v1/orders/1/relationships/discount-redemptions>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/orders/1>"
    }
  }
}

Docs
→
API
→
Orders
List All Orders
GET
/v1/orders
Returns a paginated list of orders.

Filter parameters
store_id
Return only orders belonging to the store with this ID.

user_email
Return only orders where the user_email field is equal to this email address.

order_number
Return only the order with this order number.

curl "<https://api.lemonsqueezy.com/v1/orders>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
curl "<https://api.lemonsqueezy.com/v1/orders?filter[user_email]=johndoe@example.com>" \
  -H 'Accept: application/vnd.api+json'  \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'

  Returns
Returns a paginated list of Order objects ordered by created_at in descending.

{
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 10,
      "to": 10,
      "total": 10
    }
  },
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "first": "<https://api.lemonsqueezy.com/v1/orders?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=-createdAt>",
    "last": "<https://api.lemonsqueezy.com/v1/orders?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=-createdAt>"
  },
  "data": [
    {
      "type": "orders",
      "id": "1",
      "attributes": {
        "store_id": 1,
        "customer_id": 1,
        "identifier": "104e18a2-d755-4d4b-80c4-a6c1dcbe1c10",
        "order_number": 1,
        "user_name": "John Doe",
        "user_email": "johndoe@example.com",
        "currency": "USD",
        "currency_rate": "1.0000",
        "subtotal": 999,
        "setup_fee": 999,
        "discount_total": 0,
        "tax": 200,
        "total": 1199,
        "subtotal_usd": 999,
        "setup_fee_usd": 999,
        "discount_total_usd": 0,
        "tax_usd": 200,
        "total_usd": 1199,
        "tax_name": "VAT",
        "tax_rate": "20.00",
        "tax_inclusive": false,
        "status": "paid",
        "status_formatted": "Paid",
        "refunded": false,
        "refunded_at": null,
        "subtotal_formatted": "$9.99",
        "setup_fee_formatted": "$9.99",
        "discount_total_formatted": "$0.00",
        "tax_formatted": "$2.00",
        "total_formatted": "$11.99",
        "first_order_item": {
          "id": 1,
          "order_id": 1,
          "product_id": 1,
          "variant_id": 1,
          "product_name": "Test Limited License for 2 years",
          "variant_name": "Default",
          "price": 1199,
          "created_at": "2021-08-17T09:45:53.000000Z",
          "updated_at": "2021-08-17T09:45:53.000000Z",
          "deleted_at": null,
          "test_mode": false
        },
        "urls": {
          "receipt": "https://app.lemonsqueezy.com/my-orders/104e18a2-d755-4d4b-80c4-a6c1dcbe1c10?signature=8847fff02e1bfb0c7c43ff1cdf1b1657a8eed2029413692663b86859208c9f42"
        },
        "created_at": "2021-08-17T09:45:53.000000Z",
        "updated_at": "2021-08-17T09:45:53.000000Z",
        "test_mode": false
      },
      "relationships": {
        "store": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/orders/1/store",
            "self": "https://api.lemonsqueezy.com/v1/orders/1/relationships/store"
          }
        },
        "customer": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/orders/1/customer",
            "self": "https://api.lemonsqueezy.com/v1/orders/1/relationships/customer"
          }
        },
        "order-items": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/orders/1/order-items",
            "self": "https://api.lemonsqueezy.com/v1/orders/1/relationships/order-items"
          }
        },
        "subscriptions": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/orders/1/subscriptions",
            "self": "https://api.lemonsqueezy.com/v1/orders/1/relationships/subscriptions"
          }
        },
        "license-keys": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/orders/1/license-keys",
            "self": "https://api.lemonsqueezy.com/v1/orders/1/relationships/license-keys"
          }
        },
        "discount-redemptions": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/orders/1/discount-redemptions",
            "self": "https://api.lemonsqueezy.com/v1/orders/1/relationships/discount-redemptions"
          }
        }
      },
      "links": {
        "self": "https://api.lemonsqueezy.com/v1/orders/1"
      }
    },
 {...},
 {...},
  ]
}

Docs
→
API
→
Orders
Generate Order Invoice
POST
/v1/orders/:id/generate-invoice
Generates a new invoice for the given order with given attributes.

Upcoming breaking API change

Please be aware that the fields name, address, city, state, zip_code, and country will soon become required. Ensure that your code is updated accordingly before the change takes effect.

Attributes
name
Required
The full name of the customer.

address
Required
The street address of the customer.

city
Required
The city of the customer.

state
Required for US and CA
The state of the customer.

zip_code
Required
The ZIP code of the customer.

country
Required
The country of the customer.

notes
Any additional notes to include on the invoice.

locale
ISO 639 language code, e.g., ‘en’ for English language.

curl -X "POST" "<https://api.lemonsqueezy.com/v1/orders/1/generate-invoice?name=John%20Doe&address=123%20Main%20St&city=Anytown&state=CA&zip_code=12345&country=US&notes=Thank%20you%20for%20your%20business>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a link to download the generated invoice.

{
  "jsonapi": {
    "version": "1.0"
  },
  "meta": {
    "urls": {
      "download_invoice": "<https://app.lemonsqueezy.com/my-orders/c1e4de31-b4cf-4668-a6fe-019d071d41ab/invoice/download?address=123%20Main%20St&city=Anytown&country=US&name=John%20Doe&notes=Thank%20you%20for%20your%20business&state=CA&zip_code=12345&signature=c21a17a13d9deeacc99ff52144a06b49df141af37dd668cc70a76bcc8022888e>"
    }
  }
}

Docs
→
API
→
Orders
Issue a Refund
POST
/v1/orders/:id/refund
Issues a partial or full refund for an order.

Attributes
amount
Optional
Optional. The amount that you want to refund for an order. If not included full refund will be issued.

curl -X "POST" "<https://api.lemonsqueezy.com/v1/orders/1/refund>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}' \
  -d $'{
  "data": {
    "type": "orders",
    "id": "1",
    "attributes": {
      "amount": 100
    }
  }
}'
Returns
Returns an Order object with updated refunded attributes.

{
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
    "setup_fee": 999,
    "discount_total": 0,
    "tax": 200,
    "total": 1199,
    "refunded_amount": 100,
    "subtotal_usd": 999,
    "setup_fee_usd": 999,
    "discount_total_usd": 0,
    "tax_usd": 200,
    "total_usd": 1199,
    "refunded_amount_usd": 100,
    "tax_name": "VAT",
    "tax_rate": "20.00",
    "tax_inclusive": false,
    "status": "paid",
    "status_formatted": "Paid",
    "refunded": false,
    "refunded_at": null,
    "subtotal_formatted": "$9.99",
    "setup_fee_formatted": "$9.99",
    "discount_total_formatted": "$0.00",
    "tax_formatted": "$2.00",
    "total_formatted": "$11.99",
    "refunded_amount_formatted": "$1.00",
    "first_order_item": {
      "id": 1,
      "order_id": 1,
      "product_id": 1,
      "variant_id": 1,
      "product_name": "Test Limited License for 2 years",
      "variant_name": "Default",
      "price": 1199,
      "created_at": "2021-08-17T09:45:53.000000Z",
      "updated_at": "2021-08-17T09:45:53.000000Z",
      "test_mode": false
    },
    "urls": {
      "receipt": "<https://app.lemonsqueezy.com/my-orders/104e18a2-d755-4d4b-80c4-a6c1dcbe1c10?signature=8847fff02e1bfb0c7c43ff1cdf1b1657a8eed2029413692663b86859208c9f42>"
    },
    "created_at": "2021-08-17T09:45:53.000000Z",
    "updated_at": "2021-08-17T09:45:53.000000Z",
    "test_mode": false
  }
}

Docs
→
API
→
Order Items
The Order Item Object
An order item represents a line item for an order that includes product, variant and price information.

An order item belongs to an Order and is associated with a Product and a Variant.

Attributes
order_id
The ID of the order this order item belongs to.

product_id
The ID of the product associated with this order item.

variant_id
The ID of the variant associated with this order item.

product_name
The name of the product.

variant_name
The name of the variant.

price
A positive integer in cents representing the price of this order item (in the order currency).

For “pay what you want” products the price will be whatever the customer entered at checkout.

quantity
A positive integer representing the quantity of this order item.

created_at
An ISO 8601 formatted date-time string indicating when the object was created.

updated_at
An ISO 8601 formatted date-time string indicating when the object was last updated.

{
  "type": "order-items",
  "id": "1",
  "attributes": {
    "order_id": 1,
    "product_id": 1,
    "variant_id": 1,
    "product_name": "Lemonade",
    "variant_name": "Citrus Blast",
    "price": 999,
    "quantity": 1,
    "created_at": "2021-05-24T14:15:06.000000Z",
    "updated_at": "2021-05-24T14:15:06.000000Z"
  }
}

Docs
→
API
→
Order Items
Retrieve an Order Item
GET
/v1/order-items/:id
Retrieves the order item with the given ID.

curl "<https://api.lemonsqueezy.com/v1/order-items/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns an Order Item object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/order-items/1>"
  },
  "data": {
    "type": "order-items",
    "id": "1",
    "attributes": {
      "order_id": 1,
      "product_id": 1,
      "variant_id": 1,
      "product_name": "Lemonade",
      "variant_name": "Citrus Blast",
      "price": 999,
      "quantity": 1,
      "created_at": "2021-05-24T14:15:06.000000Z",
      "updated_at": "2021-05-24T14:15:06.000000Z"
    },
    "relationships": {
      "order": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/order-items/1/order>",
          "self": "<https://api.lemonsqueezy.com/v1/order-items/1/relationships/order>"
        }
      },
      "product": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/order-items/1/product>",
          "self": "<https://api.lemonsqueezy.com/v1/order-items/1/relationships/product>"
        }
      },
      "variant": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/order-items/1/variant>",
          "self": "<https://api.lemonsqueezy.com/v1/order-items/1/relationships/variant>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/order-items/1>"
    }
  }
}

Docs
→
API
→
Order Items
List All Order Items
GET
/v1/order-items
Returns a paginated list of order items.

Filter parameters
order_id
Return only order items belonging to the order with this ID.

product_id
Return only order items belonging to the product with this ID.

variant_id
Return only order items belonging to the variant with this ID.

curl "<https://api.lemonsqueezy.com/v1/order-items>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
curl "<https://api.lemonsqueezy.com/v1/order-items?filter[order_id]=1>" \
  -H 'Accept: application/vnd.api+json'  \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a paginated list of Order Items.

{
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 10,
      "to": 10,
      "total": 10
    }
  },
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "first": "<https://api.lemonsqueezy.com/v1/order-items?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=id>",
    "last": "<https://api.lemonsqueezy.com/v1/order-items?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=id>"
  },
  "data": [
    {
      "type": "order-items",
      "id": "1",
      "attributes": {
        "order_id": 1,
        "product_id": 1,
        "variant_id": 1,
        "product_name": "Lemonade",
        "variant_name": "Citrus Blast",
        "price": 999,
        "quantity": 1,
        "created_at": "2021-05-24T14:15:06.000000Z",
        "updated_at": "2021-05-24T14:15:06.000000Z"
      },
      "relationships": {
        "order": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/order-items/1/order",
            "self": "https://api.lemonsqueezy.com/v1/order-items/1/relationships/order"
          }
        },
        "product": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/order-items/1/product",
            "self": "https://api.lemonsqueezy.com/v1/order-items/1/relationships/product"
          }
        },
        "variant": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/order-items/1/variant",
            "self": "https://api.lemonsqueezy.com/v1/order-items/1/relationships/variant"
          }
        }
      },
      "links": {
        "self": "https://api.lemonsqueezy.com/v1/order-items/1"
      }
    },
    {...},
    {...},
  ]
}

Docs
→
API
→
Subscriptions
The Subscription Object
A subscription is created when a subscription product is purchased. Bills the customer on a recurring basis.

A subscription belongs to a Store and is associated with a Customer, an Order, an Order Item, a Product, a Variant, Subscription invoices and Subscription items.

Attributes
store_id
The ID of the store this subscription belongs to.

customer_id
The ID of the customer this subscription belongs to.

order_id
The ID of the order associated with this subscription.

order_item_id
The ID of the order item associated with this subscription.

product_id
The ID of the product associated with this subscription.

variant_id
The ID of the variant associated with this subscription.

product_name
The name of the product.

variant_name
The name of the variant.

user_name
The full name of the customer.

user_email
The email address of the customer.

status
The status of the subscription. One of

on_trial
active
paused - The subscription’s payment collection has been paused. See the pause attribute below for more information.
past_due - A renewal payment has failed. The subscription will go through 4 payment retries over the course of 2 weeks. If a retry is successful, the subscription’s status changes back to active. If all four retries are unsuccessful, the status is changed to unpaid.
unpaid - Payment recovery has been unsuccessful in capturing a payment after 4 attempts. If dunning is enabled in your store, your dunning rules now will determine if the subscription becomes expired after a certain period. If dunning is turned off, the status remains unpaid (it is up to you to determine what this means for users of your product).
cancelled - The customer or store owner has cancelled future payments, but the subscription is still technically active and valid (on a “grace period”). The ends_at value shows the date-time when the subscription is scheduled to expire.
expired - The subscription has ended (either it had previously been cancelled and the grace period created from its final payment has run out, or it was previously unpaid and the subscription was not re-activated during dunning). The ends_at value shows the date-time when the subscription expired. Customers should no longer have access to your product.
status_formatted
The title-case formatted status of the subscription.

For example, when status is active, status_formatted will be Active and past_due will be Past due.

card_brand
Lowercase brand of the card used to pay for the latest subscription payment. One of

visa
mastercard
amex
discover
jcb
diners
unionpay
Will be empty for non-card payments.

card_last_four
The last 4 digits of the card used to pay for the latest subscription payment. Will be empty for non-card payments.

payment_processor
Lowercase name of the payment processing service through which the subscription’s payments are managed and processed. Returns stripe or paypal.

pause
An object containing the payment collection pause behaviour options for the subscription, if set. Options include:

mode - Defines payment pause behaviour, can be one of:

void - If you can’t offer your services for a period of time (for maintenance as an example), you can void invoices so your customers aren’t charged.
free - Offer your subscription services for free, whilst halting payment collection.
resumes_at - An ISO 8601 formatted date-time string indicating when the subscription will continue collecting payments.

For a subscription that isn’t in the paused state, the pause object will be null.

cancelled
A boolean indicating if the subscription has been cancelled.

When cancelled is true:

status will be cancelled
ends_at will be populated with a date-time string
trial_ends_at
If the subscription has a free trial (status is on_trial), this will be an ISO 8601 formatted date-time string indicating when the trial period ends. For all other status values, this will be null.

billing_anchor
An integer representing a day of the month (21 equals 21st day of the month). This is the day on which subscription invoice payments are collected.

first_subscription_item
An object representing the first subscription item belonging to this subscription.

id - The ID of the subscription item.
subscription_id - The ID of the subscription.
price_id - The ID of the price
quantity - The quantity of the subscription item.
created_at - An ISO 8601 formatted date-time string indicating when the subscription item was created.
updated_at - An ISO 8601 formatted date-time string indicating when the subscription item was last updated.
Will be null if there is no subscription item, for example if the subscription is currently in a free trial.

urls
An object of customer-facing URLs for managing the subscription. It contains:

update_payment_method - A pre-signed URL for managing payment and billing information for the subscription. This can be used in conjunction with Lemon.js to allow your customer to change their billing information from within your application. The URL is valid for 24 hours from time of request.
customer_portal - A pre-signed URL to the Customer Portal, which allows customers to fully manage their subscriptions and billing information from within your application. The URL is valid for 24 hours from time of request.
update_customer_portal - A pre-signed URL for upgrading/downgrading the subscription in the Customer Portal. This is only used for subscriptions setup through PayPal payment and will return null on all other payment types. The URL is valid for 24 hours from time of request.
renews_at
An ISO 8601 formatted date-time string indicating the end of the current billing cycle, and when the next invoice will be issued. This also applies to past_due subscriptions; renews_at will reflect the next renewal charge attempt.

ends_at
If the subscription has as status of cancelled or expired, this will be an ISO 8601 formatted date-time string indicating when the subscription expires (or expired). For all other status values, this will be null.

created_at
An ISO 8601 formatted date-time string indicating when the object was created.

updated_at
An ISO 8601 formatted date-time string indicating when the object was last updated.

test_mode
A boolean indicating if the object was created within test mode.

{
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
    "card_last_four": "4242",
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
      "update_payment_method": "<https://my-store.lemonsqueezy.com/subscription/1/payment-details?expires=1666869343&signature=9985e3bf9007840aeb3951412be475abc17439c449c1af3e56e08e45e1345413>",
      "customer_portal": "<https://my-store.lemonsqueezy.com/billing?expires=1666869343&signature=82ae290ceac8edd4190c82825dd73a8743346d894a8ddbc4898b97eb96d105a5>",
      "customer_portal_update_subscription": "<https://my-store.lemonsqueezy.com/billing/1/update?expires=1666869343&signature=e4fabc7ee703664d644bba9e79a9cd3dd00622308b335f3c166787f0b18999f2>"
    },
    "renews_at": "2022-11-12T00:00:00.000000Z",
    "ends_at": null,
    "created_at": "2021-08-11T13:47:27.000000Z",
    "updated_at": "2021-08-11T13:54:19.000000Z",
    "test_mode": false
  }
}

Docs
→
API
→
Subscriptions
Update a Subscription
PATCH
/v1/subscriptions/:id
Updates the subscription with the given ID and provided attributes.

With this endpoint, you can:

Upgrade or downgrade a subscripion to a different Variant.
Change payment pause collection behaviour
Update the billing date for when payments are collected
When changing the plan of a subscription, by default we prorate the charge for the next billing cycle.

For example, if a customer buys your product on April 1st for $50, they’ll be charged $50 immediately. If on April 15th they upgrade to your $100 product, on May 1st they’ll be charged $125. This is made up of $100 for renewing, $50 of used time on your upgraded $100 plan from April 15th - May 1st, and then a credited -$25 for unused time on your $50 plan.

Charge Amount Running Total
Renew Charge $100 $100
Upgrade plan partially used time $50 $150
Unused time on previous $50 plan -$25 $125
If downgrading a subscription, we’ll issue a credit which is then applied on the next invoice.

Changing a subscription plan may change the billing date or charge immediately if:

The variant has a different billing cycle (from monthly to yearly, etc)
The subscription is no longer free, or is now free
A trial starts or ends.
Note about PayPal payment

For all subscriptions that have PayPal as their payment system, the update endpoint will not modify the subscription. Instead the subscription object will have a value present in the urls.customer_portal_update_subscription key. You can use this value to redirect your customer to the Customer Portal to allow a succesful subscription modification.

Attributes
variant_id
The ID of the Variant you want to switch this subscription to. Required if changing a subscription’s product/variant.

pause
An object containing the payment collection pause behaviour options for the subscription. Options include:

mode - Defines payment pause behaviour, can be one of:
void - If you can’t offer your services for a period of time (for maintenance as an example), you can void invoices so your customers aren’t charged.
free - Offer your subscription services for free, whilst halting payment collection.
resumes_at (optional) - An ISO 8601 formatted date-time string indicating when the subscription will continue collecting payments.
You can set the pause object to null to unpause the subscription.

cancelled
Set as true to cancel the subscription. You can resume a subscription (before the ends_at date) by setting this to false.

trial_ends_at
An ISO 8601 formatted date-time string indicating when the subscription’s free trial should end.

billing_anchor
Use an integer representing a day of the month (21 equals 21st day of the month) to change the day on which subscription invoice payments are collected.
Use null or 0 to reset the billing anchor to the current date. Doing this will also remove an active trial.
Setting this value to a valid integer (1-31) will set the billing anchor to the next occurrence of that day. For example, if on the 21st of January you set the subscription billing anchor to the 1st, the next occurrence of that day is February 1st. All invoices from that point on will be generated on the 1st of the month.

If the current month doesn’t contain the day that matches your billing_anchor (for example, if the billing_anchor is 31 and the month is November), the customer will be charged on the last day of the month.

When setting a new billing anchor day, we calculate the next occurrence and issue a paid, prorated trial which ends on the next occurrence date. When the trial ends, the customer is charged for the full prorated amount.

invoice_immediately
If true, any updates to the subscription will be charged immediately. A new prorated invoice will be generated and payment attempted. Defaults to false. Note that this will be overridden by the disable_prorations option if used.

disable_prorations
If true, no proration will be charged and the customer will simply be charged the new price at the next renewal. Defaults to false. Note that this will override the invoice_immediately option if used.

Read about proration in the Developer Guide

curl -X "PATCH" "<https://api.lemonsqueezy.com/v1/subscriptions/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}' \
  -d $'{
  "data": {
    "type": "subscriptions",
    "id": "1",
    "attributes": {
      "variant_id": 11,
      "billing_anchor": 29,
      "trial_ends_at": "2024-04-20T10:30:00Z"
    }
  }
}'
Returns
Returns the updated Subscription object.

{
  "type": "subscriptions",
  "id": "1",
  "attributes": {
    "store_id": 1,
    "customer_id": 1,
    "order_id": 1,
    "order_item_id": 1,
    "product_id": 9,
    "variant_id": 11,
    "product_name": "Lemonady",
    "variant_name": "Citrus Blast",
    "user_name": "John Doe",
    "user_email": "<johndoe@example.com>",
    "status": "active",
    "status_formatted": "Active",
    "pause": null,
    "cancelled": false,
    "trial_ends_at": null,
    "billing_anchor": 29,
    "first_subscription_item": {
      "id": 1,
      "subscription_id": 1,
      "price_id": 1,
      "quantity": 5,
      "created_at": "2021-08-11T13:47:28.000000Z",
      "updated_at": "2021-08-11T13:47:28.000000Z"
    },
    "urls": {
      "update_payment_method": "<https://my-store.lemonsqueezy.com/subscription/1/payment-details?expires=1666869343&signature=9985e3bf9007840aeb3951412be475abc17439c449c1af3e56e08e45e1345413>",
      "customer_portal": "<https://my-store.lemonsqueezy.com/billing?expires=1666869343&signature=82ae290ceac8edd4190c82825dd73a8743346d894a8ddbc4898b97eb96d105a5>"
    },
    "renews_at": "2022-11-12T00:00:00.000000Z",
    "ends_at": null,
    "created_at": "2021-08-11T13:47:27.000000Z",
    "updated_at": "2021-08-11T13:54:19.000000Z",
    "test_mode": false
  }
}

Docs
→
API
→
Subscriptions
Retrieve a Subscription
GET
/v1/subscriptions/:id
Retrieves the subscription with the given ID.

curl "<https://api.lemonsqueezy.com/v1/subscriptions/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a Subscription object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/subscriptions/1>"
  },
  "data": {
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
      "card_last_four": "4242",
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
        "update_payment_method": "<https://my-store.lemonsqueezy.com/subscription/1/payment-details?expires=1666869343&signature=9985e3bf9007840aeb3951412be475abc17439c449c1af3e56e08e45e1345413>",
        "customer_portal": "<https://my-store.lemonsqueezy.com/billing?expires=1666869343&signature=82ae290ceac8edd4190c82825dd73a8743346d894a8ddbc4898b97eb96d105a5>"
      },
      "renews_at": "2022-11-12T00:00:00.000000Z",
      "ends_at": null,
      "created_at": "2021-08-11T13:47:27.000000Z",
      "updated_at": "2021-08-11T13:54:19.000000Z",
      "test_mode": false
    },
    "relationships": {
      "store": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscriptions/1/store>",
          "self": "<https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/store>"
        }
      },
      "customer": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscriptions/1/customer>",
          "self": "<https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/customer>"
        }
      },
      "order": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscriptions/1/order>",
          "self": "<https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/order>"
        }
      },
      "order-item": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscriptions/1/order-item>",
          "self": "<https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/order-item>"
        }
      },
      "product": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscriptions/1/product>",
          "self": "<https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/product>"
        }
      },
      "variant": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscriptions/1/variant>",
          "self": "<https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/variant>"
        }
      },
      "subscription-items": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscriptions/1/subscription-items>",
          "self": "<https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/subscription-items>"
        }
      },
      "subscription-invoices": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscriptions/1/subscription-invoices>",
          "self": "<https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/subscription-invoices>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/subscriptions/1>"
    }
  }
}

Docs
→
API
→
Subscriptions
List All Subscriptions
GET
/v1/subscriptions
Returns a paginated list of subscriptions.

Filter parameters
store_id
Only return subscriptions belonging to the store with this ID.

order_id
Only return subscriptions belonging to the order with this ID.

order_item_id
Only return subscriptions belonging to the order item with this ID.

product_id
Only return subscriptions belonging to the product with this ID.

variant_id
Only return subscriptions belonging to the variant with this ID.

user_email
Only return subscriptions where the user_email field is equal to this email address.

status
Only return subscriptions with this status.

curl "<https://api.lemonsqueezy.com/v1/subscriptions>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
curl "<https://api.lemonsqueezy.com/v1/subscriptions?filter[product_id]=19>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a paginated list of Subscription objects ordered by created_at in descending order.

{
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 10,
      "to": 10,
      "total": 10
    }
  },
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "first": "<https://api.lemonsqueezy.com/v1/subscriptions?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=-createdAt>",
    "last": "<https://api.lemonsqueezy.com/v1/subscriptions?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=-createdAt>"
  },
  "data": [
    {
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
        "user_email": "johndoe@example.com",
        "status": "active",
        "status_formatted": "Active",
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
          "update_payment_method": "https://my-store.lemonsqueezy.com/subscription/1/payment-details?expires=1666869343&signature=9985e3bf9007840aeb3951412be475abc17439c449c1af3e56e08e45e1345413",
          "customer_portal": "https://my-store.lemonsqueezy.com/billing?expires=1666869343&signature=82ae290ceac8edd4190c82825dd73a8743346d894a8ddbc4898b97eb96d105a5"
        },
        "renews_at": "2022-11-12T00:00:00.000000Z",
        "ends_at": null,
        "created_at": "2021-08-11T13:47:27.000000Z",
        "updated_at": "2021-08-11T13:54:19.000000Z",
        "test_mode": false
      },
      "relationships": {
        "store": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/subscriptions/1/store",
            "self": "https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/store"
          }
        },
        "customer": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/subscriptions/1/customer",
            "self": "https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/customer"
          }
        },
        "order": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/subscriptions/1/order",
            "self": "https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/order"
          }
        },
        "order-item": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/subscriptions/1/order-item",
            "self": "https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/order-item"
          }
        },
        "product": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/subscriptions/1/product",
            "self": "https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/product"
          }
        },
        "variant": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/subscriptions/1/variant",
            "self": "https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/variant"
          }
        },
        "subscription-items": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/subscriptions/1/subscription-items",
            "self": "https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/subscription-items"
          }
        },
        "subscription-invoices": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/subscriptions/1/subscription-invoices",
            "self": "https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/subscription-invoices"
          }
        }
      },
      "links": {
        "self": "https://api.lemonsqueezy.com/v1/subscriptions/1"
      }
    },
    {...},
    {...},
  ]
}

Docs
→
API
→
Subscriptions
Cancel a Subscription
DELETE
/v1/subscriptions/:id
Cancels an active subscription.

curl -X "DELETE" "<https://api.lemonsqueezy.com/v1/subscriptions/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a Subscription item object in cancelled state.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/subscriptions/1>"
  },
  "data": {
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
      "status": "cancelled",
      "status_formatted": "Cancelled",
      "pause": null,
      "cancelled": true,
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
        "update_payment_method": "<https://my-store.lemonsqueezy.com/subscription/1/payment-details?expires=1666869343&signature=9985e3bf9007840aeb3951412be475abc17439c449c1af3e56e08e45e1345413>",
        "customer_portal": "<https://my-store.lemonsqueezy.com/billing?expires=1666869343&signature=82ae290ceac8edd4190c82825dd73a8743346d894a8ddbc4898b97eb96d105a5>"
      },
      "renews_at": "2022-11-12T00:00:00.000000Z",
      "ends_at": "2022-11-12T00:00:00.000000Z",
      "created_at": "2021-08-11T13:47:27.000000Z",
      "updated_at": "2021-08-11T13:54:19.000000Z",
      "test_mode": false
    },
    "relationships": {
      "store": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscriptions/1/store>",
          "self": "<https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/store>"
        }
      },
      "customer": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscriptions/1/customer>",
          "self": "<https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/customer>"
        }
      },
      "order": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscriptions/1/order>",
          "self": "<https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/order>"
        }
      },
      "order-item": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscriptions/1/order-item>",
          "self": "<https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/order-item>"
        }
      },
      "product": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscriptions/1/product>",
          "self": "<https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/product>"
        }
      },
      "variant": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscriptions/1/variant>",
          "self": "<https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/variant>"
        }
      },
      "subscription-items": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscriptions/1/subscription-items>",
          "self": "<https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/subscription-items>"
        }
      },
      "subscription-invoices": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscriptions/1/subscription-invoices>",
          "self": "<https://api.lemonsqueezy.com/v1/subscriptions/1/relationships/subscription-invoices>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/subscriptions/1>"
    }
  }
}

Docs
→
API
→
Subscription Invoices
The Subscription Invoice Object
Subscription invoices are generated throughout the lifecycle of a subscription, typically there is one at the time of purchase and then one for each renewal.

A subscription invoice belongs to a Subscription and a Store.

Attributes
store_id
The ID of the Store this subscription invoice belongs to.

subscription_id
The ID of the Subscription associated with this subscription invoice.

customer_id
The ID of the customer this subscription invoice belongs to.

user_name
The full name of the customer.

user_email
The email address of the customer.

billing_reason
The reason for the invoice being generated.

initial - The initial invoice generated when the subscription is created.
renewal - A renewal invoice generated when the subscription is renewed.
updated - An invoice generated when the subscription is updated.
card_brand
Lowercase brand of the card used to pay for the invoice. One of

visa
mastercard
amex
discover
jcb
diners
unionpay
Will be empty for non-card payments.

card_last_four
The last 4 digits of the card used to pay for the invoice. Will be empty for non-card payments.

currency
The ISO 4217 currency code for the invoice (e.g. USD, GBP, etc).

currency_rate
If the invoice currency is USD, this will always be 1.0. Otherwise, this is the currency conversion rate used to determine the cost of the invoice in USD at the time of payment.

status
The status of the invoice. One of

pending - The invoice is waiting for payment.
paid - The invoice has been paid.
void - The invoice was cancelled or cannot be paid.
refunded - The invoice was paid but has since been fully refunded.
partial_refund - The invoice was paid but has since been partially refunded.
status_formatted
The formatted status of the invoice.

refunded
A boolean value indicating whether the invoice has been fully refunded.

refunded_at
If the invoice has been fully refunded, this will be an ISO 8601 formatted date-time string indicating when the invoice was refunded. Otherwise, it will be null.

subtotal
A positive integer in cents representing the subtotal of the invoice in the invoice currency.

discount_total
A positive integer in cents representing the total discount value applied to the invoice in the invoice currency.

tax
A positive integer in cents representing the tax applied to the invoice in the invoice currency.

tax_inclusive
A boolean indicating if the order was created with tax inclusive or exclusive pricing.

total
A positive integer in cents representing the total cost of the invoice in the invoice currency.

refunded_amount
A positive integer in cents representing the refunded amount of the invoice in the invoice currency.

subtotal_usd
A positive integer in cents representing the subtotal of the invoice in USD.

discount_total_usd
A positive integer in cents representing the total discount value applied to the invoice in USD.

tax_usd
A positive integer in cents representing the tax applied to the invoice in USD.

total_usd
A positive integer in cents representing the total cost of the invoice in USD.

refunded_amount_usd
A positive integer in cents representing the refunded amount of the invoice in USD.

subtotal_formatted
A human-readable string representing the subtotal of the invoice in the invoice currency (e.g. $9.99).

discount_total_formatted
A human-readable string representing the total discount value applied to the invoice in the invoice currency (e.g. $9.99).

tax_formatted
A human-readable string representing the tax applied to the invoice in the invoice currency (e.g. $9.99).

total_formatted
A human-readable string representing the total cost of the invoice in the invoice currency (e.g. $9.99).

refunded_amount_formatted
A human-readable string representing the refunded amount of the invoice in the invoice currency (e.g. $9.99).

urls
An object of customer-facing URLs for the invoice. It contains:

invoice_url - The unique URL to download a PDF of the invoice. Note: for security reasons, download URLs are signed (but do not expire). Will be null if status is pending.
created_at
An ISO 8601 formatted date-time string indicating when the invoice was created.

updated_at
An ISO 8601 formatted date-time string indicating when the invoice was last updated.

test_mode
A boolean indicating if the object was created within test mode.

{
  "type": "subscription-invoices",
  "id": "1",
  "attributes": {
    "store_id": 1,
    "subscription_id": 1,
    "customer_id": 1,
    "user_name": "John Doe",
    "user_email": "<johndoe@example.com>",
    "billing_reason": "initial",
    "card_brand": "visa",
    "card_last_four": "4242",
    "currency": "USD",
    "currency_rate": "1.00000000",
    "status": "paid",
    "status_formatted": "Paid",
    "refunded": false,
    "refunded_at": null,
    "subtotal": 999,
    "discount_total": 0,
    "tax": 0,
    "tax_inclusive": false,
    "total": 999,
    "refunded_amount": 100,
    "subtotal_usd": 999,
    "discount_total_usd": 0,
    "tax_usd": 0,
    "total_usd": 999,
    "refunded_amount_usd": 100,
    "subtotal_formatted": "$9.99",
    "discount_total_formatted": "$0.00",
    "tax_formatted": "$0.00",
    "total_formatted": "$9.99",
    "refunded_amount_formatted": "$1.00",
    "urls": {
      "invoice_url": "<https://app.lemonsqueezy.com/my-orders/.../subscription-invoice/>..."
    },
    "created_at": "2023-01-18T12:16:24.000000Z",
    "updated_at": "2023-01-18T12:16:24.000000Z",
    "test_mode": false
  },
  "relationships": {
    "store": {
      "links": {
        "related": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1/store>",
        "self": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1/relationships/store>"
      }
    },
    "subscription": {
      "links": {
        "related": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1/subscription>",
        "self": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1/relationships/subscription>"
      }
    },
    "customer": {
      "links": {
        "related": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1/customer>",
        "self": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1/relationships/customer>"
      }
    }
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1>"
  }
}

Docs
→
API
→
Subscription Invoices
Retrieve a Subscription Invoice
GET
/v1/subscription-invoices/:id
Retrieves the subscription invoice with the given ID.

curl "<https://api.lemonsqueezy.com/v1/subscription-invoices/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a Subscription Invoice object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1>"
  },
  "data": {
    "type": "subscription-invoices",
    "id": "1",
    "attributes": {
      "store_id": 1,
      "subscription_id": 1,
      "customer_id": 1,
      "user_name": "John Doe",
      "user_email": "<johndoe@example.com>",
      "billing_reason": "initial",
      "card_brand": "visa",
      "card_last_four": "4242",
      "currency": "USD",
      "currency_rate": "1.00000000",
      "status": "paid",
      "status_formatted": "Paid",
      "refunded": false,
      "refunded_at": null,
      "subtotal": 999,
      "discount_total": 0,
      "tax": 0,
      "tax_inclusive": false,
      "total": 999,
      "subtotal_usd": 999,
      "discount_total_usd": 0,
      "tax_usd": 0,
      "total_usd": 999,
      "subtotal_formatted": "$9.99",
      "discount_total_formatted": "$0.00",
      "tax_formatted": "$0.00",
      "total_formatted": "$9.99",
      "urls": {
        "invoice_url": "<https://app.lemonsqueezy.com/my-orders/.../subscription-invoice/>..."
      },
      "created_at": "2023-01-18T12:16:24.000000Z",
      "updated_at": "2023-01-18T12:16:24.000000Z",
      "test_mode": false
    },
    "relationships": {
      "store": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1/store>",
          "self": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1/relationships/store>"
        }
      },
      "subscription": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1/subscription>",
          "self": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1/relationships/subscription>"
        }
      },
      "customer": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1/customer>",
          "self": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1/relationships/customer>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1>"
    }
  }
}

Docs
→
API
→
Subscription Invoices
List All Subscription Invoices
GET
/v1/subscription-invoices
Returns a paginated list of subscription invoices.

To retrieve subscription invoices for a certain subscription, you can include related resources or use a nested query.

Filter parameters
store_id
Only return subscription invoices belonging to the store with this ID.

status
Only return subscription invoices with this status.

refunded
Only return subscription invoices that are refunded (the value should be true or false).

subscription_id
Only return subscription invoices belonging to a subscription with this ID.

curl "<https://api.lemonsqueezy.com/v1/subscription-invoices>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
curl "<https://api.lemonsqueezy.com/v1/subscription-invoices?filter[status]=past_due>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
curl "<https://api.lemonsqueezy.com/v1/subscription-invoices?filter[subscription_id]=6>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a paginated list of Subscription Invoice objects ordered by created_at in descending order.

{
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 10,
      "to": 10,
      "total": 10
    }
  },
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "first": "<https://api.lemonsqueezy.com/v1/subscription-invoices?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=-createdAt>",
    "last": "<https://api.lemonsqueezy.com/v1/subscription-invoices?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=-createdAt>"
  },
  "data": [
    {
      "type": "subscription-invoices",
      "id": "1",
      "attributes": {
        "store_id": 1,
        "subscription_id": 1,
        "customer_id": 1,
        "user_name": "John Doe",
        "user_email": "johndoe@example.com",
        "billing_reason": "initial",
        "card_brand": "visa",
        "card_last_four": "4242",
        "currency": "USD",
        "currency_rate": "1.00000000",
        "status": "paid",
        "status_formatted": "Paid",
        "refunded": false,
        "refunded_at": null,
        "subtotal": 999,
        "discount_total": 0,
        "tax": 0,
        "tax_inclusive": false,
        "total": 999,
        "refunded_amount": 0,
        "subtotal_usd": 999,
        "discount_total_usd": 0,
        "tax_usd": 0,
        "total_usd": 999,
        "refunded_amount_usd": 0,
        "subtotal_formatted": "$9.99",
        "discount_total_formatted": "$0.00",
        "tax_formatted": "$0.00",
        "total_formatted": "$9.99",
        "refunded_amount_formatted": "$0.00",
        "urls": {
          "invoice_url": "https://app.lemonsqueezy.com/my-orders/.../subscription-invoice/..."
        },
        "created_at": "2023-01-18T12:16:24.000000Z",
        "updated_at": "2023-01-18T12:16:24.000000Z",
        "test_mode": false
      },
      "relationships": {
        "store": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/subscription-invoices/1/store",
            "self": "https://api.lemonsqueezy.com/v1/subscription-invoices/1/relationships/store"
          }
        },
        "subscription": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/subscription-invoices/1/subscription",
            "self": "https://api.lemonsqueezy.com/v1/subscription-invoices/1/relationships/subscription"
          }
        },
        "customer": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/subscription-invoices/1/customer",
            "self": "https://api.lemonsqueezy.com/v1/subscription-invoices/1/relationships/customer"
          }
        }
      },
      "links": {
        "self": "https://api.lemonsqueezy.com/v1/subscription-invoices/1"
      }
    },
    {...},
    {...},
  ]
}

Docs
→
API
→
Subscription Invoices
Generate a Subscription Invoice
POST
/v1/subscription-invoices/:id/generate-invoice
Generates a new invoice for the given subscription with given parameters.

Upcoming breaking API change

Please be aware that the fields name, address, city, state, zip_code, and country will soon become required. Ensure that your code is updated accordingly before the change takes effect.

Attributes
name
Required
The full name of the customer.

address
Required
The street address of the customer.

city
Required
The city of the customer.

state
Required for US and CA
The state of the customer.

zip_code
Required
The ZIP code of the customer.

country
Required
The country of the customer.

notes
Any additional notes to include on the invoice.

locale
ISO 639 language code, e.g., ‘en’ for English language.

curl -X "POST" "<https://api.lemonsqueezy.com/v1/subscription-invoices/1/generate-invoice?name=John%20Doe&address=123%20Main%20St&city=Anytown&state=CA&zip_code=12345&country=US&notes=Thank%20you%20for%20your%20business>" \
  -H "Accept: application/vnd.api+json" \
  -H "Content-Type: application/vnd.api+json" \
  -H "Authorization: Bearer {api_key}"
Returns
Returns a link to download the generated invoice.

{
  "jsonapi": {
    "version": "1.0"
  },
  "meta": {
    "urls": {
      "download_invoice": "<https://app.lemonsqueezy.com/my-orders/c1e4de31-b4cf-4668-a6fe-019d071d41ab/invoice/download?address=123%20Main%20St&city=Anytown&country=US&name=John%20Doe&notes=Thank%20you%20for%20your%20business&state=CA&zip_code=12345&signature=c21a17a13d9deeacc99ff52144a06b49df141af37dd668cc70a76bcc8022888e>"
    }
  }
}

Docs
→
API
→
Subscription Invoices
Issue a Refund
POST
/v1/subscription-invoices/:id/refund
Issues a partial or full refund for a subscription invoice.

Attributes
amount
Optional
Optional. The amount that you want to refund for an order. If not included full refund will be issued.

curl -X "POST" "<https://api.lemonsqueezy.com/v1/subscription-invoices/1/refund>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}' \
  -d $'{
  "data": {
    "type": "subscription-invoices",
    "id": "1",
    "attributes": {
      "amount": 100
    }
  }
}'
Returns
Returns a Subscription Invoice object with updated refunded attributes.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1>"
  },
  "data": {
    "type": "subscription-invoices",
    "id": "1",
    "attributes": {
      "store_id": 1,
      "subscription_id": 1,
      "customer_id": 1,
      "user_name": "John Doe",
      "user_email": "<johndoe@example.com>",
      "billing_reason": "initial",
      "card_brand": "visa",
      "card_last_four": "4242",
      "currency": "USD",
      "currency_rate": "1.00000000",
      "status": "paid",
      "status_formatted": "Paid",
      "refunded": false,
      "refunded_at": null,
      "subtotal": 999,
      "discount_total": 0,
      "tax": 0,
      "tax_inclusive": false,
      "total": 999,
      "refunded_amount": 100,
      "subtotal_usd": 999,
      "discount_total_usd": 0,
      "tax_usd": 0,
      "total_usd": 999,
      "refunded_amount_usd": 100,
      "subtotal_formatted": "$9.99",
      "discount_total_formatted": "$0.00",
      "tax_formatted": "$0.00",
      "total_formatted": "$9.99",
      "refunded_amount_formatted": "$1.00",
      "urls": {
        "invoice_url": "<https://app.lemonsqueezy.com/my-orders/.../subscription-invoice/>..."
      },
      "created_at": "2023-01-18T12:16:24.000000Z",
      "updated_at": "2023-01-18T12:16:24.000000Z",
      "test_mode": false
    },
    "relationships": {
      "store": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1/store>",
          "self": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1/relationships/store>"
        }
      },
      "subscription": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1/subscription>",
          "self": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1/relationships/subscription>"
        }
      },
      "customer": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1/customer>",
          "self": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1/relationships/customer>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/subscription-invoices/1>"
    }
  }
}

Docs
→
API
→
Subscription Items
The Subscription Item Object
A subscription item is an object that links a price to a subscription and also contains quantity information.

A subscription item belongs to a Subscription and a Price and can have many Usage Records records.

Attributes
subscription_id
The ID of the Subscription associated with this subscription item.

price_id
The ID of the Price associated with this subscription item.

quantity
A positive integer representing the unit quantity of this subscription item.

Will be 0 if the related subscription product/variant has usage-based billing enabled.

is_usage_based
A boolean value indicating whether the related subscription product/variant has usage-based billing enabled.

created_at
An ISO 8601 formatted date-time string indicating when the subscription item was created.

updated_at
An ISO 8601 formatted date-time string indicating when the subscription item was last updated.

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
  "relationships": {
    "subscription": {
      "links": {
        "related": "<https://api.lemonsqueezy.com/v1/subscription-items/1/subscription>",
        "self": "<https://api.lemonsqueezy.com/v1/subscription-items/1/relationships/subscription>"
      }
    },
    "price": {
      "links": {
        "related": "<https://api.lemonsqueezy.com/v1/subscription-items/1/price>",
        "self": "<https://api.lemonsqueezy.com/v1/subscription-items/1/relationships/price>"
      }
    },
    "usage-records": {
      "links": {
        "related": "<https://api.lemonsqueezy.com/v1/subscription-items/1/usage-records>",
        "self": "<https://api.lemonsqueezy.com/v1/subscription-items/1/relationships/usage-records>"
      }
    }
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/subscription-items/1>"
  }
}

Docs
→
API
→
Subscription Items
Retrieve a Subscription Item
GET
/v1/subscription-items/:id
Retrieves the subscription item with the given ID.

curl "<https://api.lemonsqueezy.com/v1/subscription-items/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a Subscription Item object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/subscription-item/1>"
  },
  "data": {
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
    "relationships": {
      "subscription": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscription-items/1/subscription>",
          "self": "<https://api.lemonsqueezy.com/v1/subscription-items/1/relationships/subscription>"
        }
      },
      "price": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscription-items/1/price>",
          "self": "<https://api.lemonsqueezy.com/v1/subscription-items/1/relationships/price>"
        }
      },
      "usage-records": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscription-items/1/usage-records>",
          "self": "<https://api.lemonsqueezy.com/v1/subscription-items/1/relationships/usage-records>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/subscription-items/1>"
    }
  }
}

Docs
→
API
→
Subscription Items
Retrieve Subscription Item's Current Usage
GET
/v1/subscription-items/:id/current-usage
Retrieves the unit usage for a subscription item for the current billing period.

Note

This endpoint is only for subscriptions with usage-based billing enabled. It will return a 404 Not Found response if the related subscription product/variant does not have usage-based billing enabled.

curl "<https://api.lemonsqueezy.com/v1/subscription-items/1/current-usage>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a meta object containing usage information.

period_start
An ISO 8601 formatted date-time string indicating the start of the billing period.

period_end
An ISO 8601 formatted date-time string indicating the end of the billing period.

quantity
A positive integer representing the usage total.

interval_unit
The interval unit of the subscription’s variant. One of

day
week
month
year
interval_quantity
The interval count of the subscription’s variant.

For example, a subscription item with interval_unit=month and interval_quantity=3 would mean the subscription renews every a three months.

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

Update a Subscription Item
PATCH
/v1/subscription-items/:id
Updates the subscription with the given ID and provided attributes.

Note

This endpoint is only used with quantity-based billing. If the related subscription’s product/variant has usage-based billing enabled, this endpoint will return a 422 Unprocessable Entity response.

Attributes
quantity
The unit quantity of the subscription.

invoice_immediately
If true, any updates to the subscription will be charged immediately. A new prorated invoice will be generated and payment attempted. Defaults to false. Note that this will be overridden by the disable_prorations option if used.

disable_prorations
If true, no proration will be charged and the customer will simply be charged the new price at the next renewal. Defaults to false. Note that this will override the invoice_immediately option if used.

Read about proration in the Developer Guide.

curl -X "PATCH" "<https://api.lemonsqueezy.com/v1/subscription-items/1>" \
  -H "Accept: application/vnd.api+json" \
  -H "Content-Type: application/vnd.api+json" \
  -H "Authorization: Bearer {api_key}" \
  -d '{
    "data": {
      "type": "subscription-items",
      "id": "1",
      "attributes": {
        "quantity": 10
      }
    }
  }'
Returns
Returns the updated Subscription Item object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/subscription-item/1>"
  },
  "data": {
    "type": "subscription-items",
    "id": "1",
    "attributes": {
      "subscription_id": 1,
      "price_id": 1,
      "quantity": 10,
      "is_usage_based": false,
      "created_at": "2023-07-18T12:16:24.000000Z",
      "updated_at": "2023-07-18T12:23:18.000000Z"
    },
    "relationships": {
      "subscription": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscription-items/1/subscription>",
          "self": "<https://api.lemonsqueezy.com/v1/subscription-items/1/relationships/subscription>"
        }
      },
      "price": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscription-items/1/price>",
          "self": "<https://api.lemonsqueezy.com/v1/subscription-items/1/relationships/price>"
        }
      },
      "usage-records": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscription-items/1/usage-records>",
          "self": "<https://api.lemonsqueezy.com/v1/subscription-items/1/relationships/usage-records>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/subscription-items/1>"
    }
  }
}

Docs
→
API
→
Subscription Items
List All Subscription Items
GET
/v1/subscription-items
Returns a paginated list of subscriptions items.

Filter parameters
subscription_id
Only return subscription items belonging to a subscription with this ID.

price_id
Only return subscription items belonging to a price with this ID.

curl "<https://api.lemonsqueezy.com/v1/subscription-items>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
curl "<https://api.lemonsqueezy.com/v1/subscription-items?filter[subscription_id]=1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a paginated list of Subscription objects ordered by created_at in descending order.

{
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 10,
      "to": 10,
      "total": 10
    }
  },
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "first": "<https://api.lemonsqueezy.com/v1/subscription-items?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=-created_at>",
    "last": "<https://api.lemonsqueezy.com/v1/subscription-items?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=-created_at>"
  },
  "data": [
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
      "relationships": {
        "subscription": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/subscription-items/1/subscription",
            "self": "https://api.lemonsqueezy.com/v1/subscription-items/1/relationships/subscription"
          }
        },
        "price": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/subscription-items/1/price",
            "self": "https://api.lemonsqueezy.com/v1/subscription-items/1/relationships/price"
          }
        },
        "usage-records": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/subscription-items/1/usage-records",
            "self": "https://api.lemonsqueezy.com/v1/subscription-items/1/relationships/usage-records"
          }
        }
      },
      "links": {
        "self": "https://api.lemonsqueezy.com/v1/subscription-items/1"
      }
    },
    {...},
    {...}
  ]
}

Docs
→
API
→
Usage Records
The Usage Record Object
A usage record reports the usage amount for a subscription item with usage-based billing.

A usage record belongs to a Subscription Item.

Attributes
subscription_item_id
The ID of the subscription item this usage record belongs to.

quantity
A positive integer representing the usage to be reported.

action
The type of record. One of

increment - The provided quantity was added to existing records for the current billing period.
set - The provided quantity was set as the total usage for the current billing period.
created_at
An ISO 8601 formatted date-time string indicating when the object was created.

updated_at
An ISO 8601 formatted date-time string indicating when the object was last updated.

{
  "type": "usage-records",
  "id": "1",
  "attributes": {
    "subscription_item_id": 1,
    "quantity": 5,
    "action": "increment",
    "created_at": "2023-07-24T14:44:38.000000Z",
    "updated_at": "2023-07-24T14:44:38.000000Z"
  }
}

Docs
→
API
→
Usage Records
Create a Usage Record
POST
/v1/usage-records
Create a usage record.

Attributes
quantity
A positive integer representing the usage to be reported.

action
The type of record. One of

increment - Add the provided quantity to existing records for the current billing period.
set - Set the quantity for the current billing period to the provided quantity.
Defaults to increment if omitted.

Note

increment should only be used alongside the “Sum of usage during period” aggregation setting. set should be only used alongside “Most recent usage during a period” and “Most recent usage” aggregation settings. Read more about aggregation settings.

Relationships
subscription_item
The subscription item this usage record belongs to.

curl -X "POST" "<https://api.lemonsqueezy.com/v1/usage-records>" \
  -H "Accept: application/vnd.api+json" \
  -H "Content-Type: application/vnd.api+json" \
  -H "Authorization: Bearer {api_key}" \
  -d '{
    "data": {
      "type": "usage-records",
      "attributes": {
        "quantity": 5
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
  }'
Returns
Returns s Usage Record object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/usage-records/1>"
  },
  "data": {
    "type": "usage-records",
    "id": "1",
    "attributes": {
      "subscription_item_id": 1,
      "quantity": 5,
      "action": "increment",
      "created_at": "2023-07-24T14:44:38.000000Z",
      "updated_at": "2023-07-24T14:44:38.000000Z"
    },
    "relationships": {
      "subscription-item": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/usage-records/1/subscription-item>",
          "self": "<https://api.lemonsqueezy.com/v1/usage-records/1/relationships/subscription-item>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/usage-records/1>"
    }
  }
}

Docs
→
API
→
Usage Records
Retrieve a Usage Record
POST
/v1/usage-records/:id
Retrieves the usage record with the given ID.

Note

To retrieve the current total usage for a subscription, use the subscription item current usage endpoint.

curl "<https://api.lemonsqueezy.com/v1/usage-records/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a Usage Record object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/usage-records/1>"
  },
  "data": {
    "type": "usage-records",
    "id": "1",
    "attributes": {
      "subscription_item_id": 1,
      "quantity": 5,
      "action": "increment",
      "created_at": "2023-07-24T14:44:38.000000Z",
      "updated_at": "2023-07-24T14:44:38.000000Z"
    },
    "relationships": {
      "subscription-item": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/usage-records/1/subscription-item>",
          "self": "<https://api.lemonsqueezy.com/v1/usage-records/1/relationships/subscription-item>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/usage-records/1>"
    }
  }
}

Docs
→
API
→
Usage Records
List All Usage Records
POST
/v1/usage-records
Returns a paginated list of usage records.

Filter parameters
subscription_item_id
Only return usage records belonging to the subscription item with this ID.

curl "<https://api.lemonsqueezy.com/v1/usage-records>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
curl "<https://api.lemonsqueezy.com/v1/usage-records?filter[subscription_item_id]=1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a paginated list of Usage Records objects ordered by created_at in descending order.

{
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 10,
      "to": 10,
      "total": 10
    }
  },
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "first": "<https://api.lemonsqueezy.com/v1/usage-records?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=-created_at>",
    "last": "<https://api.lemonsqueezy.com/v1/usage-records?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=-created_at>"
  },
  "data": [
    {
      "type": "usage-records",
      "id": "1",
      "attributes": {
        "subscription_item_id": 1,
        "quantity": 5,
        "action": "increment",
        "created_at": "2023-07-24T14:44:38.000000Z",
        "updated_at": "2023-07-24T14:44:38.000000Z"
      },
      "relationships": {
        "subscription-item": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/usage-records/1/subscription-item",
            "self": "https://api.lemonsqueezy.com/v1/usage-records/1/relationships/subscription-item"
          }
        }
      },
      "links": {
        "self": "https://api.lemonsqueezy.com/v1/usage-records/1"
      }
    },
    {...},
    {...},
  ]
}

Docs
→
API
→
Discounts
The Discount Object
A discount provides details about a percentage or amount off that can be applied to an order at checkout with a code.

A discount belongs to a Store and can have many Discount Redemptions.

Attributes
store_id
The ID of the store this discount belongs to.

name
The name of the discount.

code
The discount code that can be used at checkout. Made up of uppercase letters and numbers and between 3 and 256 characters long.

amount
The amount of discount to apply to the order. Either a fixed amount in cents or a percentage depending on the value of amount_type.

amount_type
The type of the amount. Either percent or fixed.

is_limited_to_products
Has the value true if the discount can only be applied to certain products/variants.

is_limited_redemptions
Has the value true if the discount can only be redeemed a limited number of times.

max_redemptions
If is_limited_redemptions is true, this is the maximum number of redemptions.

starts_at
An ISO 8601 formatted date-time string indicating when the discount is valid from. Can be null if no start date is specified.

expires_at
An ISO 8601 formatted date-time string indicating when the discount expires. Can be null if no expiration date is specified.

duration
If the discount is applied to a subscription, this specifies how often the discount should be applied. One of

once - The discount will be applied to the initial payment only.
repeating - The discount will be applied to a certain number of payments (use in combination with duration_in_months.
forever - The discount will apply to all payments.
duration_in_months
If duration is repeating, this specifies how many months the discount should apply.

status
The status of the discount. Either draft or published.

status_formatted
The formatted status of the discount.

created_at
An ISO 8601 formatted date-time string indicating when the object was created.

updated_at
An ISO 8601 formatted date-time string indicating when the object was last updated.

test_mode
A boolean indicating if the object was created within test mode.

{
  "type": "discounts",
  "id": "1",
  "attributes": {
    "store_id": 1,
    "name": "10%",
    "code": "10PERC",
    "amount": 10,
    "amount_type": "percent",
    "is_limited_to_products": false,
    "is_limited_redemptions": false,
    "max_redemptions": 0,
    "starts_at": null,
    "expires_at": null,
    "duration": "once",
    "duration_in_months": 1,
    "status": "published",
    "status_formatted": "Published",
    "created_at": "2021-05-24T14:15:06.000000Z",
    "updated_at": "2021-05-24T14:15:06.000000Z",
    "test_mode": false
  }
}

Docs
→
API
→
Discounts
Create a Discount
POST
/v1/discounts
Create a discount.

Attributes
name
The name of the discount.

code
The discount code that can be used at checkout. Uppercase letters and numbers are allowed. Must be between 3 and 256 characters.

amount
The amount of discount to apply to the order. Either a fixed amount in cents or a percentage depending on the value of amount_type.

1000 means $10 when amount_type is fixed.
10 means 10% when amount_type is percent.
amount_type
The type of the amount. Either percent or fixed.

is_limited_to_products
Set this to true if the discount should only be applied to certain products/variants. See details in the Relationships section below.

is_limited_redemptions
Set this to true if the discount should only be redeemed a limited number of times. See max_redemptions below.

max_redemptions
If is_limited_redemptions is true, this is the maximum number of redemptions.

starts_at
An ISO 8601 formatted date-time string indicating when the discount is valid from. Can omitted or null if no start date is specified.

expires_at
An ISO 8601 formatted date-time string indicating when the discount expires. Can omitted or null if the discount is perpetual.

duration
If the discount is applied to a subscription, this specifies how often the discount should be applied. One of

once - The discount will be applied to the initial payment only.
repeating - The discount will be applied to a certain number of payments (use in combination with duration_in_months.
forever - The discount will apply to all payments.
Defaults to once if omitted.

duration_in_months
If duration is repeating, this specifies how many months the discount should apply. Defaults to 1 if omitted.

Note

For yearly subscription, the value needs to be years x 12, so 24 if you want the discount to repeat for the first two yearly payments. We do not recommend repeated discounts for daily or weekly subscriptions.

test_mode
Set this to true if the discount should only be applied to test mode orders.

Relationships
store
The store this discount belongs to.

variants
If is_limited_to_products is true, the variant(s) the discount belongs to (this is not required otherwise).

curl -X "POST" "<https://api.lemonsqueezy.com/v1/discounts>" \
  -H "Accept: application/vnd.api+json" \
  -H "Content-Type: application/vnd.api+json" \
  -H "Authorization: Bearer {api_key}" \
  -d '{
    "data": {
      "type": "discounts",
      "attributes": {
        "name": "10% Off",
        "code": "10PERCENT",
        "amount": 10,
        "amount_type": "percent"
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
  }'
An example limiting the discount to certain variants:

curl -X "POST" "<https://api.lemonsqueezy.com/v1/discounts>" \
  -H "Accept: application/vnd.api+json" \
  -H "Content-Type: application/vnd.api+json" \
  -H "Authorization: Bearer {api_key}" \
  -d '{
    "data": {
      "type": "discounts",
      "attributes": {
        "name": "10% Off",
        "code": "10PERCENT",
        "amount": 10,
        "amount_type": "percent",
        "is_limited_to_products": true
      },
      "relationships": {
        "store": {
          "data": {
            "type": "stores",
            "id": "1"
          }
        },
        "variants": {
          "data": [
            {
              "type": "variants",
              "id": "3"
            },
            {
              "type": "variants",
              "id": "4"
            }
          ]
        }
      }
    }
  }'
Returns
Returns a Discount object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/discounts/1>"
  },
  "data": {
    "type": "discounts",
    "id": "1",
    "attributes": {
      "store_id": 1,
      "name": "10% Off",
      "code": "10PERCENT",
      "amount": 10,
      "amount_type": "percent",
      "is_limited_to_products": false,
      "is_limited_redemptions": false,
      "max_redemptions": 0,
      "starts_at": null,
      "expires_at": null,
      "duration": "once",
      "duration_in_months": 1,
      "status": "published",
      "status_formatted": "Published",
      "created_at": "2021-05-24T14:15:06.000000Z",
      "updated_at": "2021-05-24T14:15:06.000000Z",
      "test_mode": false
    },
    "relationships": {
      "store": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/discounts/1/store>",
          "self": "<https://api.lemonsqueezy.com/v1/discounts/1/relationships/store>"
        }
      },
      "variants": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/discounts/1/variants>",
          "self": "<https://api.lemonsqueezy.com/v1/discounts/1/relationships/variants>"
        }
      },
      "discount-redemptions": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/discounts/1/discount-redemptions>",
          "self": "<https://api.lemonsqueezy.com/v1/discounts/1/relationships/discount-redemptions>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/discounts/1>"
    }
  }
}

Docs
→
API
→
Discounts
Retrieve a Discount
GET
/v1/discounts/:id
Retrieves the discount with the given ID.

curl "<https://api.lemonsqueezy.com/v1/discounts/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a Discount object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/discounts/1>"
  },
  "data": {
    "type": "discounts",
    "id": "1",
    "attributes": {
      "store_id": 1,
      "name": "10%",
      "code": "10PERC",
      "amount": 10,
      "amount_type": "percent",
      "is_limited_to_products": false,
      "is_limited_redemptions": false,
      "max_redemptions": 0,
      "starts_at": null,
      "expires_at": null,
      "duration": "once",
      "duration_in_months": 1,
      "status": "published",
      "status_formatted": "Published",
      "created_at": "2021-05-24T14:15:06.000000Z",
      "updated_at": "2021-05-24T14:15:06.000000Z",
      "test_mode": false
    },
    "relationships": {
      "store": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/discounts/1/store>",
          "self": "<https://api.lemonsqueezy.com/v1/discounts/1/relationships/store>"
        }
      },
      "variants": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/discounts/1/variants>",
          "self": "<https://api.lemonsqueezy.com/v1/discounts/1/relationships/variants>"
        }
      },
      "discount-redemptions": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/discounts/1/discount-redemptions>",
          "self": "<https://api.lemonsqueezy.com/v1/discounts/1/relationships/discount-redemptions>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/discounts/1>"
    }
  }
}

Docs
→
API
→
Discounts
Delete a Discount
DELETE
/v1/discounts/:id
Delete a discount with the given ID.

curl -X "DELETE" "<https://api.lemonsqueezy.com/v1/discounts/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a 204 No Content response on success.

Docs
→
API
→
Discounts
List All Discounts
GET
/v1/discounts
Returns a paginated list of discounts.

Filter parameters
store_id
Return only discounts belonging to the store with this ID.

curl "<https://api.lemonsqueezy.com/v1/discounts>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
curl "<https://api.lemonsqueezy.com/v1/discounts?filter[store_id]=1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a paginated list of Discounts objects ordered by created_at in descending order.

{
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 10,
      "to": 10,
      "total": 10
    }
  },
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "first": "<https://api.lemonsqueezy.com/v1/discounts?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=createdAt>",
    "last": "<https://api.lemonsqueezy.com/v1/discounts?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=createdAt>"
  },
  "data": [
    {
      "type": "discounts",
      "id": "1",
      "attributes": {
        "store_id": 1,
        "name": "10%",
        "code": "10PERC",
        "amount": 10,
        "amount_type": "percent",
        "is_limited_to_products": false,
        "is_limited_redemptions": false,
        "max_redemptions": 0,
        "starts_at": null,
        "expires_at": null,
        "duration": "once",
        "duration_in_months": 1,
        "status": "published",
        "status_formatted": "Published",
        "created_at": "2021-05-24T14:15:06.000000Z",
        "updated_at": "2021-05-24T14:15:06.000000Z",
        "test_mode": false
      },
      "relationships": {
        "store": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/discounts/1/store",
            "self": "https://api.lemonsqueezy.com/v1/discounts/1/relationships/store"
          }
        },
        "variants": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/discounts/1/variants",
            "self": "https://api.lemonsqueezy.com/v1/discounts/1/relationships/variants"
          }
        },
        "discount-redemptions": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/discounts/1/discount-redemptions",
            "self": "https://api.lemonsqueezy.com/v1/discounts/1/relationships/discount-redemptions"
          }
        }
      },
      "links": {
        "self": "https://api.lemonsqueezy.com/v1/discounts/1"
      }
    },
    {...},
    {...},
  ]
}

Docs
→
API
→
Discount Redemptions
The Discount Redemption Object
A discount redemption is a record of a discount being applied to an order.

A discount belongs to a Discount and an Order.

Attributes
discount_id
The ID of the discount this redemption belongs to.

order_id
The ID of the order this redemption belongs to.

discount_name
The name of the discount.

discount_code
The discount code that was used at checkout.

discount_amount
The amount of the discount. Either a fixed amount in cents or a percentage depending on the value of discount_amount_type.

discount_amount_type
The type of the discount_amount. Either percent or fixed.

amount
A positive integer in cents representing the amount of the discount that was applied to the order (in the order currency).

created_at
An ISO 8601 formatted date-time string indicating when the object was created.

updated_at
An ISO 8601 formatted date-time string indicating when the object was last updated.

{
  "type": "discount-redemptions",
  "id": "1",
  "attributes": {
    "discount_id": 1,
    "order_id": 1,
    "discount_name": "10%",
    "discount_code": "10PERC",
    "discount_amount": 10,
    "discount_amount_type": "percent",
    "amount": 999,
    "created_at": "2024-02-07T10:30:01.000000Z",
    "updated_at": "2024-02-07T10:30:01.000000Z"
  }
}

Docs
→
API
→
Discount Redemptions
Retrieve a Discount Redemption
GET
/v1/discount-redemptions/:id
Retrieves the discount redemption with the given ID.

To retrieve a discount code for a certain order, you can include related resources or use a nested query.

curl "<https://api.lemonsqueezy.com/v1/discount-redemptions/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a Discount Redemption object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/discount-redemptions/1>"
  },
  "data": {
    "type": "discount-redemptions",
    "id": "1",
    "attributes": {
      "discount_id": 1,
      "order_id": 1,
      "discount_name": "10%",
      "discount_code": "10PERC",
      "discount_amount": 10,
      "discount_amount_type": "percent",
      "amount": 999,
      "created_at": "2023-02-07T10:30:01.000000Z",
      "updated_at": "2023-02-07T10:30:01.000000Z"
    },
    "relationships": {
      "discount": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/discount-redemptions/1/discount>",
          "self": "<https://api.lemonsqueezy.com/v1/discount-redemptions/1/relationships/discount>"
        }
      },
      "order": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/discount-redemptions/1/order>",
          "self": "<https://api.lemonsqueezy.com/v1/discount-redemptions/1/relationships/order>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/discount-redemptions/1>"
    }
  }
}

Docs
→
API
→
Discount Redemptions
List All Discount Redemptions
GET
/v1/discount-redemptions
Returns a paginated list of discount redemptions.

Filter parameters
discount_id
Return discount redemptions that belong to the discount with this ID.

order_id
Return discount redemptions that belong to the order with this ID.

curl "<https://api.lemonsqueezy.com/v1/discount-redemptions>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
curl "<https://api.lemonsqueezy.com/v1/discount-redemptions?filter[discount_id]=1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a paginated list of Discount Redemption objects ordered by created_at in descending order.

{
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 10,
      "to": 10,
      "total": 10
    }
  },
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "first": "<https://api.lemonsqueezy.com/v1/discount-redemptions?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=-createdAt>",
    "last": "<https://api.lemonsqueezy.com/v1/discount-redemptions?page%5Bnumber%5D=1339&page%5Bsize%5D=10&sort=-createdAt>",
    "next": "<https://api.lemonsqueezy.com/v1/discount-redemptions?page%5Bnumber%5D=2&page%5Bsize%5D=10&sort=-createdAt>"
  },
  "data": [
    {
      "type": "discount-redemptions",
      "id": "1",
      "attributes": {
        "discount_id": 1,
        "order_id": 1,
        "discount_name": "10%",
        "discount_code": "10PERC",
        "discount_amount": 10,
        "discount_amount_type": "percent",
        "amount": 999,
        "created_at": "2023-02-07T10:30:01.000000Z",
        "updated_at": "2023-02-07T10:30:01.000000Z"
      },
      "relationships": {
        "discount": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/discount-redemptions/1/discount",
            "self": "https://api.lemonsqueezy.com/v1/discount-redemptions/1/relationships/discount"
          }
        },
        "order": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/discount-redemptions/1/order",
            "self": "https://api.lemonsqueezy.com/v1/discount-redemptions/1/relationships/order"
          }
        }
      },
      "links": {
        "self": "https://api.lemonsqueezy.com/v1/discount-redemptions/1"
      }
    },
    {...},
    {...},
  ]
}

Docs
→
API
→
License Keys
The License Key Object
A license key can be used to externally verify that customer has access to a product.

A license key belongs to a Store and is associated with an Order, Order Item, Product and can have many License Key Instances.

Attributes
store_id
The ID of the store this license key belongs to.

customer_id
The ID of the customer this license key belongs to.

order_id
The ID of the order associated with this license key.

order_item_id
The ID of the order item associated with this license key.

product_id
The ID of the product associated with this license key.

user_name
The full name of the customer.

user_email
The email address of the customer.

key
The full license key.

key_short
A “short” representation of the license key, made up of the string “XXXX-” followed by the last 12 characters of the license key.

activation_limit
The activation limit of this license key.

instances_count
A count of the number of instances this license key has been activated on.

disabled
Has the value true if this license key has been disabled.

status
The status of the license key. One of

inactive
active
expired
disabled
status_formatted
The formatted status of the license key.

expires_at
An ISO 8601 formatted date-time string indicating when the license key expires. Can be null if the license key is perpetual.

created_at
An ISO 8601 formatted date-time string indicating when the object was created.

updated_at
An ISO 8601 formatted date-time string indicating when the object was last updated.

{
  "type": "license-keys",
  "id": "1",
  "attributes": {
    "store_id": 1,
    "customer_id": 1,
    "order_id": 1,
    "order_item_id": 1,
    "product_id": 1,
    "user_name": "John Doe",
    "user_email": "<johndoe@example.com>",
    "key": "80e15db5-c796-436b-850c-8f9c98a48abe",
    "key_short": "XXXX-8f9c98a48abe",
    "activation_limit": 5,
    "instances_count": 0,
    "disabled": 0,
    "status": "inactive",
    "status_formatted": "Inactive",
    "expires_at": null,
    "created_at": "2024-05-24T14:15:07.000000Z",
    "updated_at": "2024-05-24T14:15:07.000000Z"
  }
}

Docs
→
API
→
License Keys
Retrieve a License Key
GET
/v1/license-keys/:id
Retrieves the license key with the given ID.

curl "<https://api.lemonsqueezy.com/v1/license-keys/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a License Key object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/license-keys/1>"
  },
  "data": {
    "type": "license-keys",
    "id": "1",
    "attributes": {
      "store_id": 1,
      "customer_id": 1,
      "order_id": 1,
      "order_item_id": 1,
      "product_id": 1,
      "user_name": "John Doe",
      "user_email": "<johndoe@example.com>",
      "key": "80e15db5-c796-436b-850c-8f9c98a48abe",
      "key_short": "XXXX-8f9c98a48abe",
      "activation_limit": 5,
      "instances_count": 0,
      "disabled": 0,
      "status": "inactive",
      "status_formatted": "Inactive",
      "expires_at": null,
      "created_at": "2021-05-24T14:15:07.000000Z",
      "updated_at": "2021-05-24T14:15:07.000000Z"
    },
    "relationships": {
      "store": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/license-keys/1/store>",
          "self": "<https://api.lemonsqueezy.com/v1/license-keys/1/relationships/store>"
        }
      },
      "customer": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/license-keys/1/customer>",
          "self": "<https://api.lemonsqueezy.com/v1/license-keys/1/relationships/customer>"
        }
      },
      "order": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/license-keys/1/order>",
          "self": "<https://api.lemonsqueezy.com/v1/license-keys/1/relationships/order>"
        }
      },
      "order-item": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/license-keys/1/order-item>",
          "self": "<https://api.lemonsqueezy.com/v1/license-keys/1/relationships/order-item>"
        }
      },
      "product": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/license-keys/1/product>",
          "self": "<https://api.lemonsqueezy.com/v1/license-keys/1/relationships/product>"
        }
      },
      "license-key-instances": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/license-keys/1/license-key-instances>",
          "self": "<https://api.lemonsqueezy.com/v1/license-keys/1/relationships/license-key-instances>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/license-keys/1>"
    }
  }
}

Docs
→
API
→
License Keys
Update a License Key
PATCH
/v1/license-keys/:id
Updates the license key with the given ID and provided attributes.

Attributes
activation_limit
A number or null. The activation limit of this license key. Assign null to set the activation limit to “unlimited”.

expires_at
An ISO 8601 formatted date-time string indicating when the license key expires. Can be null if the license key is perpetual.

disabled
If true, the license key will have “disabled” status.

curl "<https://api.lemonsqueezy.com/v1/license-keys/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}' \
  -d $'{
    "data": {
      "type": "license-keys",
      "id": "1",
      "attributes": {
        "activation_limit": 5,
        "expires_at": "2024-04-20T10:30:00Z",
        "disabled": false
      }
    }
  }'
Returns
Returns updated License Key object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/subscription-item/1>"
  },
  "data": {
    "type": "subscription-items",
    "id": "1",
    "attributes": {
      "subscription_id": 1,
      "price_id": 1,
      "quantity": 10,
      "is_usage_based": false,
      "created_at": "2023-07-18T12:16:24.000000Z",
      "updated_at": "2023-07-18T12:23:18.000000Z"
    },
    "relationships": {
      "subscription": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscription-items/1/subscription>",
          "self": "<https://api.lemonsqueezy.com/v1/subscription-items/1/relationships/subscription>"
        }
      },
      "price": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscription-items/1/price>",
          "self": "<https://api.lemonsqueezy.com/v1/subscription-items/1/relationships/price>"
        }
      },
      "usage-records": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/subscription-items/1/usage-records>",
          "self": "<https://api.lemonsqueezy.com/v1/subscription-items/1/relationships/usage-records>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/subscription-items/1>"
    }
  }
}

Docs
→
API
→
License Keys
List All License Keys
GET
/v1/license-keys
Returns a paginated list of license keys.

Filter parameters
store_id
Only return license keys belonging to the store with this ID.

order_id
Only return license keys belonging to the order with this ID.

order_item_id
Only return license keys belonging to the order item with this ID.

product_id
Only return license keys belonging to the product with this ID.

status
Only return license keys with this status.

curl "<https://api.lemonsqueezy.com/v1/license-keys>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
curl "<https://api.lemonsqueezy.com/v1/license-keys?filter[order_id]=1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a paginated list of License Key objects ordered by id in descending order.

{
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 10,
      "to": 10,
      "total": 10
    }
  },
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "first": "<https://api.lemonsqueezy.com/v1/license-keys?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=id>",
    "last": "<https://api.lemonsqueezy.com/v1/license-keys?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=id>"
  },
  "data": [
    {
      "type": "license-keys",
      "id": "1",
      "attributes": {
        "store_id": 1,
        "customer_id": 1,
        "order_id": 1,
        "order_item_id": 1,
        "product_id": 1,
        "user_name": "John Doe",
        "user_email": "johndoe@example.com",
        "key": "80e15db5-c796-436b-850c-8f9c98a48abe",
        "key_short": "XXXX-8f9c98a48abe",
        "activation_limit": 5,
        "instances_count": 0,
        "disabled": 0,
        "status": "inactive",
        "status_formatted": "Inactive",
        "expires_at": null,
        "created_at": "2024-05-24T14:15:07.000000Z",
        "updated_at": "2024-05-24T14:15:07.000000Z"
      },
      "relationships": {
        "store": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/license-keys/1/store",
            "self": "https://api.lemonsqueezy.com/v1/license-keys/1/relationships/store"
          }
        },
        "customer": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/license-keys/1/customer",
            "self": "https://api.lemonsqueezy.com/v1/license-keys/1/relationships/customer"
          }
        },
        "order": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/license-keys/1/order",
            "self": "https://api.lemonsqueezy.com/v1/license-keys/1/relationships/order"
          }
        },
        "order-item": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/license-keys/1/order-item",
            "self": "https://api.lemonsqueezy.com/v1/license-keys/1/relationships/order-item"
          }
        },
        "product": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/license-keys/1/product",
            "self": "https://api.lemonsqueezy.com/v1/license-keys/1/relationships/product"
          }
        },
        "license-key-instances": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/license-keys/1/license-key-instances",
            "self": "https://api.lemonsqueezy.com/v1/license-keys/1/relationships/license-key-instances"
          }
        }
      },
      "links": {
        "self": "https://api.lemonsqueezy.com/v1/license-keys/1"
      }
    },
    {...},
    {...},
  ]
}

Docs
→
API
→
License Key Instances
The License Key Instance Object
A license key instance represents a single instance (or activation) of a license key that has been issued to a customer.

A license key instance belongs to a License Key.

Attributes
license_key_id
The ID of the license key this instance belongs to.

identifier
The unique identifier (UUID) for this instance. This is the instance_id returned when activating a license key.

name
The name of the license key instance.

created_at
An ISO 8601 formatted date-time string indicating when the object was created.

updated_at
An ISO 8601 formatted date-time string indicating when the object was last updated.

{
  "type": "license-key-instances",
  "id": "1",
  "attributes": {
    "license_key_id": 1,
    "identifier": "f70a79fa-6054-433e-9c1b-6075344292e4",
    "name": "example.com",
    "created_at": "2024-05-24T14:15:07.000000Z",
    "updated_at": "2024-05-24T14:15:07.000000Z"
  }
}

Docs
→
API
→
License Key Instances
Retrieve a License Key Instance
GET
/v1/license-key-instances/:id
Retrieves the license key instance with the given ID.

curl "<https://api.lemonsqueezy.com/v1/license-key-instances/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a License Key Instance object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/license-key-instances/1>"
  },
  "data": {
    "type": "license-key-instances",
    "id": "1",
    "attributes": {
      "license_key_id": 1,
      "identifier": "f70a79fa-6054-433e-9c1b-6075344292e4",
      "name": "example.com",
      "created_at": "2022-11-14T11:45:39.000000Z",
      "updated_at": "2022-11-14T11:45:39.000000Z"
    },
    "relationships": {
      "license-key": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/license-key-instances/1/license-key>",
          "self": "<https://api.lemonsqueezy.com/v1/license-key-instances/1/relationships/license-key>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/license-key-instances/1>"
    }
  }
}

Docs
→
API
→
License Key Instances
List All License Key Instances
GET
/v1/license-key-instances
Returns a paginated list of license key instances.

Filter parameters
license_key_id
Only return instances belonging to the license key with this ID.

curl "<https://api.lemonsqueezy.com/v1/license-key-instances>"
  -H 'Accept: application/vnd.api+json'
  -H 'Content-Type: application/vnd.api+json'
  -H 'Authorization: Bearer {api_key}'
curl "<https://api.lemonsqueezy.com/v1/license-key-instances?filter[license_key_id]=1>"
  -H 'Accept: application/vnd.api+json'
  -H 'Content-Type: application/vnd.api+json'
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a paginated list of License Key objects ordered by id in descending order.

{
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 10,
      "to": 10,
      "total": 10
    }
  },
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "first": "<https://api.lemonsqueezy.com/v1/license-key-instances?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=id>",
    "last": "<https://api.lemonsqueezy.com/v1/license-key-instances?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=id>"
  },
  "data": [
    {
      "type": "license-key-instances",
      "id": "1",
      "attributes": {
        "license_key_id": 1,
        "identifier": "f70a79fa-6054-433e-9c1b-6075344292e4",
        "name": "example.com",
        "created_at": "2022-11-14T11:45:39.000000Z",
        "updated_at": "2022-11-14T11:45:39.000000Z"
      },
      "relationships": {
        "license-key": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/license-key-instances/1/license-key",
            "self": "https://api.lemonsqueezy.com/v1/license-key-instances/1/relationships/license-key"
          }
        }
      },
      "links": {
        "self": "https://api.lemonsqueezy.com/v1/license-key-instances/1"
      }
    },
    {...},
    {...},
  ]
}

Docs
→
API
→
Checkouts
The Checkout Object
A checkout represents a custom checkout page. Checkouts can be used to customize the checkout experience for a specific variant/product without having to create a new product in the dashboard.

A checkout belongs to a Store and is associated with a Variant.

Attributes
store_id
The ID of the store this checkout belongs to.

variant_id
The ID of the variant associated with this checkout.

All variants of the related product will be shown in the checkout, with your selected variant highlighted. To hide other variants, utilise the enabled_variants option to determine which variant(s) are displayed in the checkout.

custom_price
If the value is not null, this represents a positive integer in cents representing the custom price of the variant.

product_options
An object containing any overridden product options for this checkout. Possible options include:

name - A custom name for the product
description - A custom description for the product
media - An array of image URLs to use as the product’s media
redirect_url - A custom URL to redirect to after a successful purchase
receipt_button_text - A custom text to use for the order receipt email button
receipt_link_url - A custom URL to use for the order receipt email button
receipt_thank_you_note - A custom thank you note to use for the order receipt email
enabled_variants - An array of variant IDs to enable for this checkout. If this is empty, all variants will be enabled.
checkout_options
An object containing checkout options for this checkout. Possible options include:

embed - If true, show the checkout overlay
media - If false, hide the product media
logo - If false, hide the store logo
desc - If false, hide the product description
discount - If false, hide the discount code field
subscription_preview - If false, hide the “You will be charged…” subscription preview text
background_color - A custom hex color to use for the background of the checkout page.
headings_color - A custom hex color to use for the headings on the checkout page.
primary_text_color - A custom hex color to use for the primary text on the checkout page.
secondary_text_color - A custom hex color to use for the secondary text on the checkout page.
links_color - A custom hex color to use for the links on the checkout page.
borders_color - A custom hex color to use for the borders on the checkout page.
checkbox_color - A custom hex color to use for the checkboxes on the checkout page.
active_state_color - A custom hex color to indicate an active state on the checkout page.
button_color - A custom hex color to use for the checkout button.
button_text_color - A custom hex color to use for the text within the checkout button.
terms_privacy_color - A custom hex color to use for the terms and privacy text on the checkout page.
locale - An ISO 639 language code to use for the checkout (e.g. en, fr, de). When set, this overrides any store-level or browser-detected locale. Defaults to null, which falls back to the store’s default checkout language, then the customer’s browser language. Supported values: bg, hr, cs, da, nl, en, et, fil, fi, fr, de, el, hu, id, it, ja, ko, lv, lt, ms, mt, pl, pt, ro, ru, zh-CN, sk, sl, es, sv, th, tr, vi.
dark
deprecated

- If true, use the dark theme. This has been deprecated in favor of the color options.
checkout_data
An object containing any prefill or custom data to be used in the checkout. Possible options include:

email - A pre-filled email address
name - A pre-filled name
billing_address.country - A pre-filled billing address country in a ISO 3166-1 alpha-2 format
billing_address.zip - A pre-filled billing address zip/postal code
tax_number - A pre-filled tax number
discount_code - A pre-filled discount code
custom - An object containing any custom data to be passed to the checkout
variant_quantities - A list containing quantity data objects
preview
If preview is passed as true in the request, the Checkout object will contain a preview object. This contains pricing information for the checkout, including tax, any discount applied, and the total price.

The preview object is only available when the checkout is created.

Values returned:

currency - The ISO 4217 currency code of the store (e.g. USD, GBP, etc).
currency_rate - If the store currency is USD, this will always be 1.0. Otherwise, this is the currency conversion rate used to determine the price of the checkout in USD at the time of purchase.
subtotal - A positive integer in cents representing the subtotal of the checkout in the store currency.
discount_total - A positive integer in cents representing the total discount value applied to the checkout in the store currency.
tax - A positive integer in cents representing the tax applied to the checkout in the store currency.
total - A positive integer in cents representing the total price of the checkout in the store currency.
subtotal_usd - A positive integer in cents representing the subtotal of the checkout in USD.
discount_total_usd - A positive integer in cents representing the total discount value applied to the checkout in USD.
tax_usd - A positive integer in cents representing the tax applied to the checkout in USD.
total_usd - A positive integer in cents representing the total price of the checkout in USD.
subtotal_formatted - A human-readable string representing the subtotal of the checkout in the store currency (e.g. $9.99).
discount_total_formatted - A human-readable string representing the total discount value applied to the checkout in the store currency (e.g. $9.99).
tax_formatted - A human-readable string representing the tax applied to the checkout in the store currency (e.g. $9.99).
total_formatted - A human-readable string representing the total price of the checkout in the store currency (e.g. $9.99).
expires_at
An ISO 8601 formatted date-time string indicating when the checkout expires. Can be null if the checkout is perpetual.

created_at
An ISO 8601 formatted date-time string indicating when the object was created.

updated_at
An ISO 8601 formatted date-time string indicating when the object was last updated.

test_mode
A boolean indicating if the object was created within test mode.

url
The unique URL to access the checkout. Note: for security reasons, download URLs are signed. If the checkout expires_at is set, the URL will expire after the specified time.

{
    "type": "checkouts",
    "id": "ac470bd4-7c41-474d-b6cd-0f296f5be02a",
    "attributes": {
      "store_id": 1,
      "variant_id": 1,
      "custom_price": null,
      "product_options": {
        "name": "",
        "description": "",
        "media": [],
        "redirect_url": "",
        "receipt_button_text": "",
        "receipt_link_url": "",
        "receipt_thank_you_note": "",
        "enabled_variants": []
      },
      "checkout_options": {
        "embed": false,
        "media": true,
        "logo": true,
        "desc": true,
        "discount": true,
        "skip_trial": false,
        "subscription_preview": true,
        "button_color": "#7047EB"
      },
      "checkout_data": {
        "email": "",
        "name": "",
        "billing_address": [],
        "tax_number": "",
        "discount_code": "",
        "custom": [],
        "variant_quantities": []
      },
      "expires_at": null,
      "created_at": "2024-10-14T12:36:27.000000Z",
      "updated_at": "2024-10-14T12:36:27.000000Z",
      "test_mode": false,
      "url": "<https://my-store.lemonsqueezy.com/checkout/custom/ac470bd4-7c41-474d-b6cd-0f296f5be02a?signature=ee3fd20c5bac48fe5e976cb106e743bc3f6f330540f8003ab331d638e2ce3b8b>"
    },
    "relationships": {
      "store": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/checkouts/ac470bd4-7c41-474d-b6cd-0f296f5be02a/store>",
          "self": "<https://api.lemonsqueezy.com/v1/checkouts/ac470bd4-7c41-474d-b6cd-0f296f5be02a/relationships/store>"
        }
      },
      "variant": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/checkouts/ac470bd4-7c41-474d-b6cd-0f296f5be02a/variant>",
          "self": "<https://api.lemonsqueezy.com/v1/checkouts/ac470bd4-7c41-474d-b6cd-0f296f5be02a/relationships/variant>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/checkouts/ac470bd4-7c41-474d-b6cd-0f296f5be02a>"
    }
  }
}

Docs
→
API
→
Checkouts
Create a Checkout
POST
/v1/checkouts
Creates a unique checkout for a specific variant with specified attributes.

Attributes
custom_price
A positive integer in cents representing the custom price of the variant.

If the purchased product is a subscription, this custom price is used for all renewal payments. If the subscription’s variant changes in the future (i.e. the customer is moved to a different subscription “tier”) the new variant’s price will be used from that moment forward.

product_options
An object containing any overridden product options for this checkout. Possible options include:

name - A custom name for the product
description - A custom description for the product
media - An array of image URLs to use as the product’s media
redirect_url - A custom URL to redirect to after a successful purchase
receipt_button_text - A custom text to use for the order receipt email button
receipt_link_url - A custom URL to use for the order receipt email button
receipt_thank_you_note - A custom thank you note to use for the order receipt email
enabled_variants - An array of variant IDs to enable for this checkout. If this is empty, all variants will be enabled.
checkout_options
An object containing checkout options for this checkout. Possible options include:

embed - If true, show the checkout overlay
media - If false, hide the product media
logo - If false, hide the store logo
desc - If false, hide the product description
discount - If false, hide the discount code field
skip_trial - If true, remove the free trial
subscription_preview - If false, hide the “You will be charged…” subscription preview text
background_color - A custom hex color to use for the background of the checkout page.
headings_color - A custom hex color to use for the headings on the checkout page.
primary_text_color - A custom hex color to use for the primary text on the checkout page.
secondary_text_color - A custom hex color to use for the secondary text on the checkout page.
links_color - A custom hex color to use for the links on the checkout page.
borders_color - A custom hex color to use for the borders on the checkout page.
checkbox_color - A custom hex color to use for the checkboxes on the checkout page.
active_state_color - A custom hex color to indicate an active state on the checkout page.
button_color - A custom hex color to use for the checkout button.
button_text_color - A custom hex color to use for the text within the checkout button.
terms_privacy_color - A custom hex color to use for the terms and privacy text on the checkout page.
locale - An ISO 639 language code to use for the checkout (e.g. en, fr, de). When set, this overrides any store-level or browser-detected locale. Defaults to null, which falls back to the store’s default checkout language, then the customer’s browser language. Supported values: bg, hr, cs, da, nl, en, et, fil, fi, fr, de, el, hu, id, it, ja, ko, lv, lt, ms, mt, pl, pt, ro, ru, zh-CN, sk, sl, es, sv, th, tr, vi.
dark
deprecated

- If true, use the dark theme. This has been deprecated in favor of the color options.
checkout_data
An object containing any prefill or custom data to be used in the checkout. Possible options include:

email - A pre-filled email address
name - A pre-filled name
billing_address.country - A pre-filled billing address country in a ISO 3166-1 alpha-2 format
billing_address.zip - A pre-filled billing address zip/postal code
tax_number - A pre-filled tax number
discount_code - A pre-filled discount code
custom - An object containing any custom data to be passed to the checkout
variant_quantities - A list containing quantity data objects
custom should be an object like this:

"custom": {
  "user_id": "123"
}
variant_quantities should be a list of objects containing a variant ID and a quantity value (both integers):

"variant_quantities": [
  {
    "variant_id": 123,
    "quantity": 3
  }
]
preview
A boolean indicating whether to return a preview of the checkout. If true, the checkout will include a preview object with the checkout preview data.

test_mode
A boolean indicating whether the checkout should be created in test mode.

expires_at
An ISO 8601 formatted date-time string indicating when the checkout expires. Can be null if the checkout is perpetual.

Relationships
store
The store this checkout belongs to.

variant
The variant associated with this checkout.

By default, all variants of the related product will be shown in the checkout, with your selected variant highlighted. If you want hide to other variants, you can utilise the product_options.enabled_variants option to determine which variant(s) are displayed in the checkout.

curl -X "POST" "<https://api.lemonsqueezy.com/v1/checkouts>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}' \
  -d $'{
  "data": {
    "type": "checkouts",
    "attributes": {
      "custom_price": 50000,
      "product_options": {
        "enabled_variants": [1]
      },
      "checkout_options": {
        "button_color": "#7047EB"
      },
      "checkout_data": {
        "discount_code": "10PERCENTOFF",
        "custom": {
          "user_id": 123
        }
      },
      "expires_at": "2022-10-30T15:20:06Z",
      "preview": true
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
}'
Returns
Returns a Checkout object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/checkouts/5e8b546c-c561-4a2c-a586-40c18bb2a195>"
  },
  "data": {
    "type": "checkouts",
    "id": "5e8b546c-c561-4a2c-a586-40c18bb2a195",
    "attributes": {
      "store_id": 1,
      "variant_id": 1,
      "custom_price": 50000,
      "product_options": {
        "name": "",
        "description": "",
        "media": [],
        "redirect_url": "",
        "receipt_button_text": "",
        "receipt_link_url": "",
        "receipt_thank_you_note": "",
        "enabled_variants": [1]
      },
      "checkout_options": {
        "embed": false,
        "media": true,
        "logo": true,
        "desc": true,
        "discount": true,
        "skip_trial": false,
        "subscription_preview": true,
        "button_color": "#7047EB"
      },
      "checkout_data": {
        "email": "",
        "name": "",
        "billing_address": [],
        "tax_number": "",
        "discount_code": "",
        "custom": [],
        "variant_quantities": []
      },
      "preview": {
        "currency": "USD",
        "currency_rate": 1,
        "subtotal": 5000,
        "discount_total": 0,
        "tax": 0,
        "total": 5000,
        "subtotal_usd": 5000,
        "discount_total_usd": 0,
        "tax_usd": 0,
        "total_usd": 5000,
        "subtotal_formatted": "$50.00",
        "discount_total_formatted": "$50.00",
        "tax_formatted": "$0.00",
        "total_formatted": "$5.00"
      },
      "expires_at": "2022-10-30T15:20:06.000000Z",
      "created_at": "2022-10-14T13:03:37.000000Z",
      "updated_at": "2022-10-14T13:03:37.000000Z",
      "test_mode": false,
      "url": "<https://my-store.lemonsqueezy.com/checkout/custom/5e8b546c-c561-4a2c-a586-40c18bb2a195?expires=1667143206&signature=8f7248ad2022ef1d4111752ae02d14f8d04332274861ca5c3589eb22b5086a5b>"
    },
    "relationships": {
      "store": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/checkouts/5e8b546c-c561-4a2c-a586-40c18bb2a195/store>",
          "self": "<https://api.lemonsqueezy.com/v1/checkouts/5e8b546c-c561-4a2c-a586-40c18bb2a195/relationships/store>"
        }
      },
      "variant": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/checkouts/5e8b546c-c561-4a2c-a586-40c18bb2a195/variant>",
          "self": "<https://api.lemonsqueezy.com/v1/checkouts/5e8b546c-c561-4a2c-a586-40c18bb2a195/relationships/variant>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/checkouts/5e8b546c-c561-4a2c-a586-40c18bb2a195>"
    }
  }
}

Docs
→
API
→
Checkouts
Retrieve a Checkout
GET
/v1/checkouts/:id
Retrieves the checkout with the given ID.

curl "<https://api.lemonsqueezy.com/v1/checkouts/ac470bd4-7c41-474d-b6cd-0f296f5be02a>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a Checkout object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/checkouts/ac470bd4-7c41-474d-b6cd-0f296f5be02a>"
  },
  "data": {
    "type": "checkouts",
    "id": "ac470bd4-7c41-474d-b6cd-0f296f5be02a",
    "attributes": {
      "store_id": 1,
      "variant_id": 1,
      "custom_price": null,
      "product_options": {
        "name": "",
        "description": "",
        "media": [],
        "redirect_url": "",
        "receipt_button_text": "",
        "receipt_link_url": "",
        "receipt_thank_you_note": "",
        "enabled_variants": []
      },
      "checkout_options": {
        "embed": false,
        "media": true,
        "logo": true,
        "desc": true,
        "discount": true,
        "skip_trial": false,
        "subscription_preview": true,
        "button_color": "#7047EB"
      },
      "checkout_data": {
        "email": "",
        "name": "",
        "billing_address": [],
        "tax_number": "",
        "discount_code": "",
        "custom": [],
        "variant_quantities": []
      },
      "expires_at": null,
      "created_at": "2024-10-14T12:36:27.000000Z",
      "updated_at": "2024-10-14T12:36:27.000000Z",
      "test_mode": false,
      "url": "<https://my-store.lemonsqueezy.com/checkout/custom/ac470bd4-7c41-474d-b6cd-0f296f5be02a?signature=ee3fd20c5bac48fe5e976cb106e743bc3f6f330540f8003ab331d638e2ce3b8b>"
    },
    "relationships": {
      "store": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/checkouts/ac470bd4-7c41-474d-b6cd-0f296f5be02a/store>",
          "self": "<https://api.lemonsqueezy.com/v1/checkouts/ac470bd4-7c41-474d-b6cd-0f296f5be02a/relationships/store>"
        }
      },
      "variant": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/checkouts/ac470bd4-7c41-474d-b6cd-0f296f5be02a/variant>",
          "self": "<https://api.lemonsqueezy.com/v1/checkouts/ac470bd4-7c41-474d-b6cd-0f296f5be02a/relationships/variant>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/checkouts/ac470bd4-7c41-474d-b6cd-0f296f5be02a>"
    }
  }
}

Docs
→
API
→
Checkouts
List All Checkouts
GET
/v1/checkouts
Returns a paginated list of checkouts.

Filter parameters
store_id
Only return checkouts belonging to the store with this ID.

variant_id
Only return checkouts belonging to the variant with this ID.

curl "<https://api.lemonsqueezy.com/v1/license-keys>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
curl "<https://api.lemonsqueezy.com/v1/license-keys?filter[order_id]=1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a paginated list of Checkout objects ordered by created_at in descending order.

{
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 10,
      "to": 10,
      "total": 10
    }
  },
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "first": "<https://api.lemonsqueezy.com/v1/checkouts?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=-createdAt>",
    "last": "<https://api.lemonsqueezy.com/v1/checkouts?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=-createdAt>"
  },
  "data": [
    {
      "type": "checkouts",
      "id": "ac470bd4-7c41-474d-b6cd-0f296f5be02a",
      "attributes": {
        "store_id": 1,
        "variant_id": 1,
        "custom_price": null,
        "product_options": {
          "name": "",
          "description": "",
          "media": [],
          "redirect_url": "",
          "receipt_button_text": "",
          "receipt_link_url": "",
          "receipt_thank_you_note": "",
          "enabled_variants": []
        },
        "checkout_options": {
          "embed": false,
          "media": true,
          "logo": true,
          "desc": true,
          "discount": true,
          "skip_trial": true,
          "dark": false,
          "subscription_preview": true,
          "button_color": "#7047EB"
        },
        "checkout_data": {
          "email": "",
          "name": "",
          "billing_address": [],
          "tax_number": "",
          "discount_code": "",
          "custom": [],
          "variant_quantities": []
        },
        "expires_at": null,
        "created_at": "2022-10-14T12:36:27.000000Z",
        "updated_at": "2022-10-14T12:36:27.000000Z",
        "test_mode": false,
        "url": "https://my-store.lemonsqueezy.com/checkout/custom/ac470bd4-7c41-474d-b6cd-0f296f5be02a?signature=ee3fd20c5bac48fe5e976cb106e743bc3f6f330540f8003ab331d638e2ce3b8b"
      },
      "relationships": {
        "store": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/checkouts/ac470bd4-7c41-474d-b6cd-0f296f5be02a/store",
            "self": "https://api.lemonsqueezy.com/v1/checkouts/ac470bd4-7c41-474d-b6cd-0f296f5be02a/relationships/store"
          }
        },
        "variant": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/checkouts/ac470bd4-7c41-474d-b6cd-0f296f5be02a/variant",
            "self": "https://api.lemonsqueezy.com/v1/checkouts/ac470bd4-7c41-474d-b6cd-0f296f5be02a/relationships/variant"
          }
        }
      },
      "links": {
        "self": "https://api.lemonsqueezy.com/v1/checkouts/ac470bd4-7c41-474d-b6cd-0f296f5be02a"
      }
    },
    {...},
    {...},
  ]
}

Docs
→
API
→
Webhooks
The Webhook Object
Webhooks are used to send event data to an external system (i.e. your application).

Using the API, you can set up webhooks and subscribe to events programatically.

A webhook belongs to a Store.

Attributes
store_id
The ID of the store this webhook belongs to.

url
The URL that events will be sent to.

events
An array of events that will be sent.

See the list of available event types.

last_sent_at
An ISO 8601 formatted date-time string indicating when the last webhook event was sent. Will be null if no events have been sent yet.

created_at
An ISO 8601 formatted date-time string indicating when the object was created.

updated_at
An ISO 8601 formatted date-time string indicating when the object was last updated.

test_mode
A boolean indicating if the object was created within test mode.

{
  "type": "webhooks",
  "id": "1",
  "attributes": {
    "store_id": 6,
    "url": "<https://example.com/webhook/>",
    "events": ["order_created", "order_refunded"],
    "last_sent_at": "2022-11-22T07:38:06.000000Z",
    "created_at": "2022-06-07T08:32:47.000000Z",
    "updated_at": "2022-06-07T08:41:37.000000Z",
    "test_mode": false
  }
}

Docs
→
API
→
Webhooks
Create a Webhook
POST
/v1/webhooks
Creates a webhook.

Attributes
url
Required
A valid URL of the endpoint that should receive webhook events.

events
Required
An array of webhook event types that should be sent to the webhook endpoint.

See the list of available event types.

secret
Required
A string used by Lemon Squeezy to sign requests for increased security.

Learn about receiving signed requests.

The secret is never returned in the API. To view the secret of a webhook, open the webhook in your dashboard.

test_mode
Set this to true if the webhook should be created in test mode.

curl -X "POST" "<https://api.lemonsqueezy.com/v1/webhooks>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}' \
  -d $'{
  "data": {
    "type": "webhooks",
    "attributes": {
      "url": "<https://mysite.com/webhooks/>",
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
}'
Returns
Returns a Webhook object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/webhooks/1>"
  },
  "data": {
    "type": "webhooks",
    "id": "1",
    "attributes": {
      "store_id": 1,
      "url": "<https://mysite.com/webhooks/>",
      "events": [
        "order_created",
        "subscription_created",
        "subscription_updated",
        "subscription_expired"
      ],
      "last_sent_at": null,
      "created_at": "2022-06-07T08:32:47.000000Z",
      "updated_at": "2022-06-07T08:32:47.000000Z",
      "test_mode": false
    },
    "relationships": {
      "store": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/webhooks/1/store>",
          "self": "<https://api.lemonsqueezy.com/v1/webhooks/1/relationships/store>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/webhooks/1>"
    }
  }
}

Docs
→
API
→
Webhooks
Retrieve a Webhook
GET
/v1/webhooks/:id
Retrieves the webhook with the given ID.

curl "<https://api.lemonsqueezy.com/v1/webhooks/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a Webhook object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/webhooks/1>"
  },
  "data": {
    "type": "webhooks",
    "id": "1",
    "attributes": {
      "store_id": 1,
      "url": "<https://mysite.com/webhooks/>",
      "events": [
        "order_created",
        "subscription_created",
        "subscription_updated",
        "subscription_expired"
      ],
      "last_sent_at": "2022-11-22T07:38:06.000000Z",
      "created_at": "2022-06-07T08:32:47.000000Z",
      "updated_at": "2022-06-07T08:32:47.000000Z",
      "test_mode": false
    },
    "relationships": {
      "store": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/webhooks/1/store>",
          "self": "<https://api.lemonsqueezy.com/v1/webhooks/1/relationships/store>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/webhooks/1>"
    }
  }
}

Docs
→
API
→
Webhooks
Update a Webhook
PATCH
/v1/webhooks/:id
Updates the webhook with the given ID and provided attributes.

Attributes
url
A valid URL of the endpoint that should receive webhook events.

events
An array of webhook event types that should be sent to the webhook endpoint.

See the list of available event types.

secret
A string used by Lemon Squeezy to sign requests for increased security.

Learn about receiving signed requests.

The secret is never returned in the API. To view the secret of a webhook, open the webhook in your dashboard.

curl -X "PATCH" "<https://api.lemonsqueezy.com/v1/webhooks/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}' \
  -d $'{
    "data": {
      "type": "webhooks",
      "id": "1",
      "attributes": {
        "store_id": 1,
        "url": "<https://myapp.com/webhook-endpoint/>",
        "events": [
          "order_created",
          "subscription_created",
          "subscription_updated",
          "subscription_expired"
        ],
        "secret": "hashedsecret"
      }
    }
  }'
Returns
Returns the updated Webhook object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/webhooks/1>"
  },
  "data": {
    "type": "webhooks",
    "id": "1",
    "attributes": {
      "store_id": 1,
      "url": "<https://mysite.com/webhooks/>",
      "events": [
        "order_created",
        "order_refunded",
        "subscription_created",
        "subscription_updated",
        "subscription_expired"
      ],
      "last_sent_at": "2022-11-22T07:38:06.000000Z",
      "created_at": "2022-06-07T08:32:47.000000Z",
      "updated_at": "2022-06-07T08:41:37.000000Z",
      "test_mode": false
    },
    "relationships": {
      "store": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/webhooks/1/store>",
          "self": "<https://api.lemonsqueezy.com/v1/webhooks/1/relationships/store>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/webhooks/1>"
    }
  }
}

Delete a Webhook
DELETE
/v1/webhooks/:id
Delete a webhook with the given ID.

curl -X "DELETE" "<https://api.lemonsqueezy.com/v1/webhooks/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a 204 No Content response on success.

Docs
→
API
→
Webhooks
List All Webhooks
GET
/v1/webhooks
Returns a paginated list of webhooks.

Filter parameters
store_id
Only return webhooks belonging to the store with this ID.

curl "<https://api.lemonsqueezy.com/v1/webhooks>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
curl "<https://api.lemonsqueezy.com/v1/webhooks?filter[store_id]=1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a paginated list of Webhook objects ordered by created_at in descending order.

{
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 10,
      "to": 10,
      "total": 10
    }
  },
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "first": "<https://api.lemonsqueezy.com/v1/webhooks?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=-createdAt>",
    "last": "<https://api.lemonsqueezy.com/v1/webhooks?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=-createdAt>"
  },
  "data": {
    "type": "webhooks",
    "id": "1",
    "attributes": {
      "store_id": 1,
      "url": "<https://mysite.com/webhooks/>",
      "events": [
        "order_created",
        "subscription_created",
        "subscription_updated",
        "subscription_expired"
      ],
      "last_sent_at": "2022-11-22T07:38:06.000000Z",
      "created_at": "2022-06-07T08:32:47.000000Z",
      "updated_at": "2022-06-07T08:32:47.000000Z",
      "test_mode": false
    },
    "relationships": {
      "store": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/webhooks/1/store>",
          "self": "<https://api.lemonsqueezy.com/v1/webhooks/1/relationships/store>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/webhooks/1>"
    }
  }
}

Docs
→
API
→
License API
License API
The License API allows you to manage licenses generated by Lemon Squeezy.

You can use the License API to activate, validate or deactivate a license key generated by Lemon Squeezy.

The License API is a separate API from the Lemon Squeezy API and has different requirements.

Requests
All API requests must be made over HTTPS to <https://api.lemonsqueezy.com>.
All requests must include the Accept: application/json header.
POST requests should be sent with the Content-Type: application/x-www-form-urlencoded header.
Responses
Responses are always in JSON format.

Rate limits
API calls are rate limited to 60 requests per minute.

Errors
The API will return a 4XX status code in the response if an error has occurred and an error field in the response body containing an explanation of the error.

Error Code Description
400 An error occurred. See the error field for details.
404 An item could not be found.
422 A required field was invalid or missing.
License key status
A license key status can be one of:

inactive - The license key is valid but has no activations.
active - The license key has one or more activations.
expired - The license key’s expiry date has passed, either because the related product had a defined license length or because the license’s subscription has expired.
disabled - The license key has been manually disabled from the Lemon Squeezy dashboard.

Docs
→
API
→
License API
Activate a License Key
POST
/v1/licenses/activate
Activates a license key.

Parameters
license_key
Required
The license key to activate.

instance_name
Required
A label for the new instance to identify it in Lemon Squeezy.

curl -X POST <https://api.lemonsqueezy.com/v1/licenses/activate> \
  -H "Accept: application/json" \
  -d "license_key=38b1460a-5104-4067-a91d-77b872934d51" \
  -d "instance_name=Test"
Returns
activated
A boolean indicating whether the license key was successfully activated.

error
An error message if the license key could not be activated. This will be null if the license key was activated successfully.

license_key
The information about the license key that was activated.

instance
The information about the license key instance that was created.

meta
Additional information about the license key, including the order, product, variant, and customer information.

All license_key objects include an id attribute which can be used to fetch the full license key information from the Lemon Squeezy API. Responses also include a meta object containing information related to the license key.

ID fields in the meta object can be used to fetch data related to the license key, such as relevant order/product information, from the Lemon Squeezy API. The meta object also contains convenience information from the license key, including product and variant names, and the customer’s name and email address.

{
  "activated": true,
  "error": null,
  "license_key": {
    "id": 1,
    "status": "active",
    "key": "38b1460a-5104-4067-a91d-77b872934d51",
    "activation_limit": 1,
    "activation_usage": 5,
    "created_at": "2021-01-24T14:15:07.000000Z",
    "expires_at": null
  },
  "instance": {
    "id": "47596ad9-a811-4ebf-ac8a-03fc7b6d2a17",
    "name": "Test",
    "created_at": "2021-04-06T14:15:07.000000Z"
  },
  "meta": {
    "store_id": 1,
    "order_id": 2,
    "order_item_id": 3,
    "product_id": 4,
    "product_name": "Example Product",
    "variant_id": 5,
    "variant_name": "Default",
    "customer_id": 6,
    "customer_name": "John Doe",
    "customer_email": "<johndoe@example.com>"
  }
}
Error response example:

{
  "activated": false,
  "error": "This license key has reached the activation limit.",
  "license_key": {
    "id": 1,
    "status": "active",
    "key": "38b1460a-5104-4067-a91d-77b872934d51",
    "activation_limit": 5,
    "activation_usage": 5,
    "created_at": "2021-01-24T14:15:07.000000Z",
    "expires_at": null
  },
  "meta": {
    "store_id": 1,
    "order_id": 2,
    "order_item_id": 3,
    "product_id": 4,
    "product_name": "Lemonade",
    "variant_id": 5,
    "variant_name": "Default",
    "customer_id": 6,
    "customer_name": "John Doe",
    "customer_email": "<johndoe@example.com>"
  }
}

Docs
→
API
→
License API
Deactivate a License Key
POST
/v1/licenses/deactivate
Deactivate a license key instance.

Parameters
license_key
Required
The license key to deactivate.

instance_id
Required
The instance ID returned when activating a license key.

curl -X POST <https://api.lemonsqueezy.com/v1/licenses/deactivate> \
  -H "Accept: application/json" \
  -d "license_key=38b1460a-5104-4067-a91d-77b872934d51" \
  -d "instance_id=f90ec370-fd83-46a5-8bbd-44a241e78665"
Returns
deactivated
A boolean indicating whether the license key was successfully deactivated.

error
An error message if the license key could not be deactivated. This will be null if the license key was deactivated successfully.

license_key
The information about the license key that was deactivated.

meta
Additional information about the license key, including the order, product, variant, and customer information.

ID fields in the meta object can be used to fetch data related to the license key, such as relevant order/product information, from the Lemon Squeezy API. The meta object also contains convenience information from the license key, including product and variant names, and the customer’s name and email address.

{
  "deactivated": true,
  "error": null,
  "license_key": {
    "id": 1,
    "status": "inactive",
    "key": "38b1460a-5104-4067-a91d-77b872934d51",
    "activation_limit": 5,
    "activation_usage": 0,
    "created_at": "2021-01-24T14:15:07.000000Z",
    "expires_at": null
  },
  "meta": {
    "store_id": 1,
    "order_id": 2,
    "order_item_id": 3,
    "product_id": 4,
    "product_name": "Lemonade",
    "variant_id": 5,
    "variant_name": "Citrus Burst",
    "customer_id": 6,
    "customer_name": "John Doe",
    "customer_email": "<johndoe@example.com>"
  }
}

Docs
→
API
→
License API
Validate a License Key
POST
/v1/licenses/validate
Checks if a license key is valid and returns information about the license key and its associated instance.

Parameters
license_key
Required
The license key to validate.

instance_id
If included, validate a license key instance, otherwise validate a license key. If no instance_id is provided, the response will contain "instance": null.

curl -X POST <https://api.lemonsqueezy.com/v1/licenses/validate> \
  -H "Accept: application/json" \
  -d "license_key=38b1460a-5104-4067-a91d-77b872934d51" \
  -d "instance_id=f90ec370-fd83-46a5-8bbd-44a241e78665"
Returns
valid
A boolean indicating whether the license was successfully validated.

error
An error message if the license could not be validated. This will be null if the license was validated successfully.

license_key
The information about the license that was deactivated.

instance
The information about the license key instance that was validated. If no instance_id was provided, this will be null.

meta
Additional information about the license key, including the order, product, variant, and customer information.

ID fields in the meta object can be used to fetch data related to the license key, such as relevant order/product information, from the Lemon Squeezy API. The meta object also contains convenience information from the license key, including product and variant names, and the customer’s name and email address.

{
  "valid": true,
  "error": null,
  "license_key": {
    "id": 1,
    "status": "active",
    "key": "38b1460a-5104-4067-a91d-77b872934d51",
    "activation_limit": 1,
    "activation_usage": 5,
    "created_at": "2021-01-24T14:15:07.000000Z",
    "expires_at": "2022-01-24T14:15:07.000000Z"
  },
  "instance": {
    "id": "f90ec370-fd83-46a5-8bbd-44a241e78665",
    "name": "Test",
    "created_at": "2021-02-24T14:15:07.000000Z"
  },
  "meta": {
    "store_id": 1,
    "order_id": 2,
    "order_item_id": 3,
    "product_id": 4,
    "product_name": "Lemonade",
    "variant_id": 5,
    "variant_name": "Citrus Blast",
    "customer_id": 6,
    "customer_name": "John Doe",
    "customer_email": "<johndoe@example.com>"
  }
}

Docs
→
API
→
Affiliates
The Affiliate Object
An affiliate object represents an affiliate of your store. It is created when a user applies to your affiliate program.

An affiliate belongs to a Store and is associated with a User.

Attributes
store_id
The ID of the store this affiliate belongs to.

user_id
The ID of the user this affiliate belongs to.

user_name
The full name of the affiliate.

user_email
The email address of the affiliate.

share_domain
The domain this affiliate uses to promote products.

status
The status of the affiliate. Either active, pending or disabled.

application_note
The application note of the affiliate.

products
The list of products enabled for this affiliate in the JSON format.

total_earnings
A positive integer in cents representing the total earnings of the affiliate.

unpaid_earnings
A positive integer in cents representing the unpaid earnings of the affiliate.

created_at
An ISO 8601 formatted date-time string indicating when the object was created.

updated_at
An ISO 8601 formatted date-time string indicating when the object was last updated.

{
  "type": "affiliates",
  "id": "1",
  "attributes": {
    "store_id": 1,
    "user_id": 2,
    "user_name": "John Doe",
    "user_email": "<johndoe@example.com>",
    "share_domain": "example.com",
    "status": "active",
    "products": null,
    "application_note": "I'm a digital content creator and marketer promoting B2B solutions via my newsletter",
    "total_earnings": 169550,
    "unpaid_earnings": 132000,
    "created_at": "2023-11-22T04:12:50.000000Z",
    "updated_at": "2023-11-22T04:12:50.000000Z"
  }
}

Docs
→
API
→
Affiliates
Retrieve an Affiliate
GET
/v1/affiliates/:id
Retrieves the affiliate with the given ID.

curl "<https://api.lemonsqueezy.com/v1/affiliates/1>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns an Affiliate object.

{
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "self": "<https://api.lemonsqueezy.com/v1/affiliates/1>"
  },
  "data": {
    "type": "affiliates",
    "id": "1",
    "attributes": {
      "store_id": 1,
      "user_id": 2,
      "user_name": "John Doe",
      "user_email": "<johndoe@example.com>",
      "share_domain": "example.com",
      "status": "active",
      "products": null,
      "application_note": "I'm a digital content creator and marketer promoting B2B solutions via my newsletter",
      "total_earnings": 169550,
      "unpaid_earnings": 132000,
      "created_at": "2023-11-22T04:12:50.000000Z",
      "updated_at": "2023-11-22T04:12:50.000000Z"
    },
    "relationships": {
      "store": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/affiliates/1/store>",
          "self": "<https://api.lemonsqueezy.com/v1/affiliates/1/relationships/store>"
        }
      },
      "user": {
        "links": {
          "related": "<https://api.lemonsqueezy.com/v1/affiliates/1/user>",
          "self": "<https://api.lemonsqueezy.com/v1/affiliates/1/relationships/user>"
        }
      }
    },
    "links": {
      "self": "<https://api.lemonsqueezy.com/v1/affiliates/1>"
    }
  }
}

Docs
→
API
→
Affiliates
List All Affiliates
GET
/v1/affiliates
Retrieves a paginated list of all affiliates.

Filter parameters
store_id
Filter affiliates by the ID of the store they belong to.

user_email
Filter affiliates by user_email field.

curl "<https://api.lemonsqueezy.com/v1/affiliates>" \
  -H 'Accept: application/vnd.api+json' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
curl "<https://api.lemonsqueezy.com/v1/affiliates?filter[user_email]=johndoe@example.com>" \
  -H 'Accept: application/vnd.api+json'  \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer {api_key}'
Returns
Returns a paginated list of Affiliate objects ordered by created_at field in descending order.

{
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 10,
      "to": 1,
      "total": 1
    }
  },
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "first": "<http://api.lemonsqueezy.com/v1/affiliates?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=-createdAt>",
    "last": "<http://api.lemonsqueezy.com/v1/affiliates?page%5Bnumber%5D=1&page%5Bsize%5D=10&sort=-createdAt>"
  },
  "data": [
    {
      "type": "affiliates",
      "id": "1",
      "attributes": {
        "store_id": 1,
        "user_id": 2,
        "user_name": "John Doe",
        "user_email": "johndoe@example.com",
        "share_domain": "example.com",
        "status": "active",
        "products": null,
        "application_note": "I'm a digital content creator and marketer promoting B2B solutions via my newsletter",
        "total_earnings": 169550,
        "unpaid_earnings": 132000,
        "created_at": "2023-11-22T04:15:17.000000Z",
        "updated_at": "2023-11-22T04:15:17.000000Z"
      },
      "relationships": {
        "store": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/affiliates/1/store",
            "self": "https://api.lemonsqueezy.com/v1/affiliates/1/relationships/store"
          }
        },
        "user": {
          "links": {
            "related": "https://api.lemonsqueezy.com/v1/affiliates/1/user",
            "self": "https://api.lemonsqueezy.com/v1/affiliates/1/relationships/user"
          }
        }
      },
      "links": {
        "self": "https://api.lemonsqueezy.com/v1/affiliates/1"
      }
    }
  ]
}
