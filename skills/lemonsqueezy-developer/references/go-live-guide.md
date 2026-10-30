<!--
Source:    https://docs.lemonsqueezy.com/help
Also:      https://docs.lemonsqueezy.com/api
Topic:     Going live — store approval, test to live mode, API keys
Retrieved: 2026-10-28 (date added to this repo; no scrape timestamp was recorded)
-->

# Lemon Squeezy Go-Live Integration Guide

This guide details how to switch the **Nexus Radar** extension from **Test Mode** (during development) to **Live Mode** (to collect real payments) once your Lemon Squeezy store gets approved.

---

## 📋 Step 1: Copy Live Variant Tokens from your Dashboard

When your store is approved, Lemon Squeezy generates completely new checkout variant tokens for your live products. You will need to copy these tokens from your dashboard:

1. Open your [Lemon Squeezy Dashboard](https://app.example.com/).
2. Toggle the sidebar switch in the bottom-left corner to **Live Mode** (ensure it says "Live").
3. Click on **Products** in the left sidebar, and click on your main product.
4. Scroll down to the **Variants** section containing your 4 plans:
   - **Monthly**
   - **6 months**
   - **1 year**
   - **Lifetime**
5. Next to each variant, click the **Share** button (chain-link icon). A share link is copied to your clipboard.
6. The copied checkout URL looks like this:
   `https://my-store.example.com/checkout/buy/fc896498-ab96-4750-8a7a-abfa8b255668`
7. Extract the token at the very end of the URL (after `/buy/`). In the example above, the token is `fc896498-ab96-4750-8a7a-abfa8b255668`.

---

## ✍️ Step 2: Paste Live Tokens in the Extension Config

Open [popup.js](file:///d:/chrome%20extentions/nexus-radar-extension/popup.js) and locate the `LEMON_SQUEEZY_CONFIG` block. Paste your live variant tokens into the `live.plans` section:

```javascript
  // Lemon Squeezy Store configuration for subscription and lifetime checkout links (dual environment setup)
  const LEMON_SQUEEZY_CONFIG = {
    mode: 'live', // Active production mode set to live for real transactions
    storeSubdomain: 'fastrsoft', // Store subdomain name on Lemon Squeezy

    // Live mode store plans (configured with production Lemon Squeezy variant IDs)
    live: {
      plans: {
        monthly: 'dd6b48fe-2b0a-4a53-b76e-31b9fdfa968d', // Monthly subscription live variant ID
        sixMonths: '47a56ad0-b25e-4bbc-97f7-9802706af2a2', // 6 Months subscription live variant ID
        oneYear: '872dd7d2-6ee6-4958-9f28-840ab9b41b4d', // 1 Year subscription live variant ID
        lifetime: 'b6088090-7a56-41f8-9d68-044f15f1508f' // Lifetime live variant ID
      }
    },

    // Test mode store plans (fully configured with your test tokens)
    test: {
      plans: {
        monthly: 'b1671121-02a4-4c4b-a964-cdc0c29b49f0',
        sixMonths: 'fc896498-ab96-4750-8a7a-abfa8b255668',
        oneYear: '34265b5f-7d68-40e2-8d8e-d69021bfb988',
        lifetime: '65b8f562-5137-4aea-adf4-e2a1f073b373'
      }
    }
  };
```

---

## 🚀 Step 3: Production Environment Active

The environment mode in [popup.js](file:///d:/chrome%20extentions/nexus-radar-extension/popup.js) is now set to `'live'`:

```javascript
  mode: 'live', // Active production mode set to live for real transactions
```

Once toggled to `'live'`, clicking any plan's buy button in the settings panel will instantly route customers to your Live Mode checkout flows to process real credit cards!

---

## 🔒 Step 4: Configure Production Log Management (Stealth Mode)

To ensure maximum performance, privacy, and stealthiness (preventing host websites from detecting extension activity by reading console logs), the extension uses a centralized debug toggle in [debug_config.js](file:///d:/chrome%20extentions/nexus-radar-extension/debug_config.js).

Before publishing your extension package to the Chrome Web Store, ensure `DEBUG_MODE` is disabled:

1. Open [debug_config.js](file:///d:/chrome%20extentions/nexus-radar-extension/debug_config.js).
2. Change the flag to `false`:
   ```javascript
   const DEBUG_MODE = false;
   ```

### 💡 Development vs Production Behavior

* **During Development (`const DEBUG_MODE = true;`):** Standard `console.log` and `console.debug` statements in the background service worker, isolated content script, and injected main world page contexts behave normally.
* **In Production (`const DEBUG_MODE = false;`):** All verbose debug messages are silently disabled by shadowing the native `console` object inside the extension's local scripts. This prevents host websites from having their own global `console.log` hijacked or overridden, while ensuring that the extension itself remains stealthy. Error logs (`console.error`, `console.warn`) remain active for diagnostics.
