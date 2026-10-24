// Cloudflare Worker: receives an order from saintstudio.ca and creates it in Shopify.
//
// The Shopify Admin token must never be in the website's code, so the site posts
// the order here and this worker (which holds the token) creates it.
//
// Routes:
//   POST /          order from the website
//   GET  /install   one-time: sends the store owner through Shopify's app install
//   GET  /callback  Shopify returns here; the worker stores the token in KV
//
// Bindings / variables (see worker/README.md):
//   TOKENS                 KV namespace holding the Shopify token
//   SHOPIFY_STORE          e.g. "your-store.myshopify.com"
//   SHOPIFY_CLIENT_ID      Dev Dashboard app client ID
//   SHOPIFY_CLIENT_SECRET  Dev Dashboard app client secret  [secret]
const ALLOWED_ORIGINS = ["https://www.saintstudio.ca", "https://saintstudio.ca"];
const API_VERSION = "2025-01";
const SCOPES = "write_orders,read_orders";
const TOKEN_KEY = "shopify-token";

const hex = (buffer) => [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");

async function hmacHex(secret, message) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message)));
}

async function tokenRequest(env, params) {
  const response = await fetch(`https://${env.SHOPIFY_STORE}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({ client_id: env.SHOPIFY_CLIENT_ID, client_secret: env.SHOPIFY_CLIENT_SECRET, ...params }),
  });
  if (!response.ok) throw new Error(`Token request failed: ${response.status}`);
  const data = await response.json();
  const saved = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || null,
    expiresAt: data.expires_in ? Date.now() + data.expires_in * 1000 : null,
  };
  await env.TOKENS.put(TOKEN_KEY, JSON.stringify(saved));
  return saved;
}

async function getToken(env) {
  const saved = JSON.parse((await env.TOKENS.get(TOKEN_KEY)) || "null");
  if (!saved) throw new Error("Not installed: open /install once");
  if (!saved.expiresAt || Date.now() < saved.expiresAt - 120000) return saved.accessToken;
  const refreshed = await tokenRequest(env, { grant_type: "refresh_token", refresh_token: saved.refreshToken });
  return refreshed.accessToken;
}

async function handleInstall(request, env) {
  const url = new URL(request.url);
  const state = crypto.randomUUID();
  const authorize = new URL(`https://${env.SHOPIFY_STORE}/admin/oauth/authorize`);
  authorize.search = new URLSearchParams({
    client_id: env.SHOPIFY_CLIENT_ID,
    scope: SCOPES,
    redirect_uri: `${url.origin}/callback`,
    state,
  });
  return new Response(null, {
    status: 302,
    headers: { Location: authorize.toString(), "Set-Cookie": `state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600` },
  });
}

async function handleCallback(request, env) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const hmac = params.get("hmac") || "";
  params.delete("hmac");
  const message = [...params.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([k, v]) => `${k}=${v}`).join("&");
  const expected = await hmacHex(env.SHOPIFY_CLIENT_SECRET, message);
  const cookieState = /(?:^|;\s*)state=([^;]+)/.exec(request.headers.get("Cookie") || "")?.[1];
  if (expected !== hmac || !cookieState || cookieState !== params.get("state") || params.get("shop") !== env.SHOPIFY_STORE) {
    return new Response("Invalid install request", { status: 400 });
  }
  await tokenRequest(env, { code: params.get("code"), expiring: "1" });
  return new Response("Saint website orders is connected to Shopify. You can close this tab.", { headers: { "Content-Type": "text/plain" } });
}

async function handleOrder(request, env) {
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
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/install" && request.method === "GET") return handleInstall(request, env);
    if (pathname === "/callback" && request.method === "GET") return handleCallback(request, env);
    return handleOrder(request, env);
  },
};
