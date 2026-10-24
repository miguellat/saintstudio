// Cloudflare Worker: receives an order from saintstudio.ca and creates it in Shopify.
//
// The Shopify Admin token must never be in the website's code, so the site posts
// the order here and this worker (which holds the token as a secret) creates it.
//
// Variables (set in Cloudflare, see worker/README.md):
//   SHOPIFY_STORE          e.g. "your-store.myshopify.com"
//   SHOPIFY_CLIENT_ID      Dev Dashboard app client ID
//   SHOPIFY_CLIENT_SECRET  Dev Dashboard app client secret  [secret]
// Shopify no longer issues permanent tokens for new apps, so the worker trades the
// client ID/secret for a token (valid 24 hours) and caches it.
const ALLOWED_ORIGINS = ["https://www.saintstudio.ca", "https://saintstudio.ca"];
const API_VERSION = "2025-01";

let cachedToken = null;
let cachedTokenExpiresAt = 0;

async function getToken(env) {
  if (cachedToken && Date.now() < cachedTokenExpiresAt - 60000) return cachedToken;
  const response = await fetch(`https://${env.SHOPIFY_STORE}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: env.SHOPIFY_CLIENT_ID,
      client_secret: env.SHOPIFY_CLIENT_SECRET,
    }),
  });
  if (!response.ok) throw new Error(`Token request failed: ${response.status}`);
  const { access_token, expires_in } = await response.json();
  cachedToken = access_token;
  cachedTokenExpiresAt = Date.now() + expires_in * 1000;
  return cachedToken;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    };
    const reply = (status, body) =>
      new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return reply(405, { error: "Method not allowed" });
    if (!ALLOWED_ORIGINS.includes(origin)) return reply(403, { error: "Forbidden" });

    let order;
    try {
      order = await request.json();
    } catch (error) {
      return reply(400, { error: "Invalid JSON" });
    }

    const { customer, items, note } = order || {};
    if (!customer?.name || !customer?.email || !Array.isArray(items) || items.length === 0 || items.length > 20) {
      return reply(400, { error: "Missing order details" });
    }
    const [first, ...rest] = String(customer.name).trim().split(/\s+/);

    const payload = {
      order: {
        email: customer.email,
        phone: customer.phone || undefined,
        customer: { first_name: first, last_name: rest.join(" ") || undefined, email: customer.email, phone: customer.phone || undefined },
        line_items: items.map((item) => ({
          title: String(item.title).slice(0, 255),
          variant_title: item.variant || undefined,
          // Prices are in cents on the site; Shopify wants a decimal string.
          price: (Number(item.priceCents) / 100).toFixed(2),
          quantity: Math.max(1, Math.min(10, Math.floor(Number(item.qty)) || 1)),
        })),
        currency: "CAD",
        financial_status: "pending",
        source_name: "saintstudio.ca",
        tags: "website, pickup",
        note: `Pickup at SAINT Studio. ${note || ""}`.trim(),
        send_receipt: false,
        inventory_behaviour: "bypass",
      },
    };

    let token;
    try {
      token = await getToken(env);
    } catch (error) {
      return reply(502, { error: "Could not authenticate with Shopify" });
    }
    const response = await fetch(`https://${env.SHOPIFY_STORE}/admin/api/${API_VERSION}/orders.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return reply(502, { error: "Shopify rejected the order" });
    const data = await response.json();
    return reply(200, { ok: true, name: data.order?.name });
  },
};
