# Shopify order bridge

Sends orders placed on saintstudio.ca into Shopify (Admin > Orders, tagged `website`, status "payment pending").

1. Go to dev.shopify.com (Dev Dashboard) > Apps > Create app. Name it "Saint website orders".
   Create a version with the Admin API scopes `write_orders` and `read_orders`, release it,
   then install the app on the Saint Studio store.
2. In the app's Settings, copy the Client ID and Client secret.
3. Create a free Cloudflare Worker and paste in `shopify-order.js`.
4. In the Worker's Settings > Variables add `SHOPIFY_STORE` (ytwxye-hm.myshopify.com),
   `SHOPIFY_CLIENT_ID`, and a secret `SHOPIFY_CLIENT_SECRET`.
5. Copy the worker URL into `SHOPIFY_ORDER_URL` at the top of `cart.js`.

The client credentials grant only works if the store is in the same Dev Dashboard organization
as the app. Check that Saint Studio appears under Stores in the Dev Dashboard.

While `SHOPIFY_ORDER_URL` is empty the site behaves as before (emails only).
