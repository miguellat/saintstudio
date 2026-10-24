# Shopify order bridge

Sends orders placed on saintstudio.ca into Shopify (Admin > Orders, tagged `website`, status "payment pending").

Shopify no longer allows new custom apps in the store admin, and the Dev Dashboard's simple login only works for
stores in the same Dev Dashboard organization. So the worker uses Shopify's standard install flow and keeps the
token in Cloudflare KV.

1. Cloudflare > Storage & databases > KV > Create a namespace named `saint-orders-tokens`.
2. Cloudflare > Workers & Pages > Create > Start with Hello World. Name it `saint-orders`, deploy,
   then Edit code, paste in `shopify-order.js` and Deploy. Note its URL (`https://saint-orders.<account>.workers.dev`).
3. In the Worker's Settings > Bindings, add a KV namespace binding: variable name `TOKENS`, namespace `saint-orders-tokens`.
4. Dev Dashboard (dev.shopify.com) > Apps > Create app, named "Saint website orders".
   In its version: App URL = the worker URL, Redirect URL = `<worker URL>/callback`, scopes `write_orders,read_orders`.
   Use custom distribution, release the version.
5. In the Worker's Settings > Variables and Secrets add `SHOPIFY_STORE` (ytwxye-hm.myshopify.com),
   `SHOPIFY_CLIENT_ID`, and a Secret `SHOPIFY_CLIENT_SECRET` (from the app's Settings).
6. Open `<worker URL>/install` once while signed in to the store and approve. It stores the token.
7. Copy the worker URL into `SHOPIFY_ORDER_URL` at the top of `cart.js`.

While `SHOPIFY_ORDER_URL` is empty the site behaves as before (emails only).
