#!/usr/bin/env node
// Read the Suite SKUs out of Lemon Squeezy and print the ids the server needs.
//
//   LEMONSQUEEZY_API_KEY=... LEMONSQUEEZY_STORE_ID=... node scripts/sync-lemon-squeezy-ids.mjs
//
// Lemon Squeezy's API is read-only for products and variants — POST /v1/products
// returns 405 Method Not Allowed — so the SKUs are created in the dashboard and
// this script only reads them back. That is deliberate: the ids come from the
// API rather than from copying them out of a URL, and it checks the one setting
// that makes a licence key exist at all.
//
// Expected SKUs and prices come from marketplace/pricing.md.

const API = 'https://api.lemonsqueezy.com/v1';
const apiKey = process.env.LEMONSQUEEZY_API_KEY;
const storeId = process.env.LEMONSQUEEZY_STORE_ID;

if (!apiKey || !storeId) {
  console.error('Set LEMONSQUEEZY_API_KEY and LEMONSQUEEZY_STORE_ID.');
  process.exit(1);
}

const EXPECTED = [
  { env: 'LS_PRODUCT_ALL_ACCESS', name: 'All-Access Suite', price: 1900 },
  { env: 'LS_PRODUCT_FLUENTCART', name: 'FluentCart Pro Agent', price: 1200 },
  { env: 'LS_PRODUCT_LEMONSQUEEZY', name: 'Lemon Squeezy Developer Agent', price: 1200 },
];

async function get(path) {
  const response = await fetch(`${API}${path}`, {
    headers: {
      Accept: 'application/vnd.api+json',
      Authorization: `Bearer ${apiKey}`,
    },
  });
  const payload = await response.json();
  if (!response.ok) {
    console.error(`GET ${path} -> ${response.status}`);
    console.error(JSON.stringify(payload, null, 2));
    process.exit(1);
  }
  return payload;
}

const products = await get(`/products?filter[store_id]=${storeId}&page[size]=100`);
const byName = new Map(products.data.map(product => [product.attributes.name, product]));

let missing = 0;
const lines = [];

for (const spec of EXPECTED) {
  const product = byName.get(spec.name);

  if (!product) {
    console.error(`missing: ${spec.name}`);
    missing += 1;
    continue;
  }

  const variants = await get(`/variants?filter[product_id]=${product.id}`);
  const variant = variants.data[0];
  const price = variant?.attributes?.price;
  const licenceKeys = variant?.attributes?.has_license_keys;
  const subscription = variant?.attributes?.is_subscription;
  const intervalUnit = variant?.attributes?.interval || variant?.attributes?.interval_unit;
  const interval = intervalUnit && `${variant.attributes.interval_count} ${intervalUnit}`;

  const problems = [];
  if (price !== spec.price) problems.push(`price ${price} != ${spec.price}`);
  if (subscription !== true) problems.push('not a subscription');
  if (licenceKeys !== true) problems.push('licence keys off');

  console.log(
    `${product.attributes.status.padEnd(9)} ${spec.name} (${product.id})` +
      ` — ${variant ? `variant ${variant.id}, ${price / 100}/mo, ${interval}, licence keys ${licenceKeys ? 'on' : 'off'}` : 'no variant'}` +
      (problems.length ? `  ! ${problems.join('; ')}` : ''),
  );

  if (problems.length) missing += 1;
  lines.push(`${spec.env}=${product.id}`);
}

if (missing) {
  console.error(`\n${missing} SKU(s) need attention in the dashboard.`);
  process.exit(1);
}

console.log(`\nLS_STORE_ID=${storeId}`);
for (const line of lines) console.log(line);
