# Shopify order bridge

Sends orders placed on saintstudio.ca into Shopify (Admin > Orders, tagged `website`, status "payment pending").

1. Shopify admin > Settings > Apps and sales channels > Develop apps > Create an app.
   Give it the Admin API scope `write_orders` (and `read_orders`), install it, copy the Admin API access token.
2. Create a free Cloudflare Worker, paste in `shopify-order.js`.
3. In the Worker's Settings > Variables add `SHOPIFY_STORE` (your-store.myshopify.com) and a secret `SHOPIFY_TOKEN`.
4. Copy the worker URL into `SHOPIFY_ORDER_URL` at the top of `cart.js`.

While `SHOPIFY_ORDER_URL` is empty the site behaves as before (emails only).
