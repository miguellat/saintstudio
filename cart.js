// Cart for Saint Apparel: header bag button, slide-out drawer, and storage.
//
// The cart lives in the visitor's browser (localStorage). Checkout is the one
// piece to swap when Shopify is connected: replace `checkout()` below with a
// redirect to the Shopify checkout URL built from the cart lines.
(() => {
  const STORAGE_KEY = "saint-cart-v1";
  const CHECKOUT_EMAIL = "saintstudiotoronto@gmail.com";
  const MAX_QTY = 10;

  const products = window.SAINT_PRODUCTS || [];
  const productById = new Map(products.map((product) => [product.id, product]));
  const currency = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" });
  const formatMoney = (cents) => currency.format(cents / 100);

  const variantsFor = (product) => {
    let labels = [""];
    product.options.forEach((option) => {
      labels = labels.flatMap((prefix) => option.values.map((value) => (prefix ? `${prefix} / ${value}` : value)));
    });
    return labels;
  };

  const clampQty = (value) => Math.max(1, Math.min(MAX_QTY, Math.floor(Number(value)) || 1));
  const lineKey = (id, variant) => `${id}|${variant}`;

  let lines = [];
  const listeners = new Set();

  const readStorage = () => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((line) => line && productById.has(line.id) && variantsFor(productById.get(line.id)).includes(line.variant))
        .map((line) => ({ id: line.id, variant: line.variant, qty: clampQty(line.qty) }));
    } catch (error) {
      return [];
    }
  };

  const writeStorage = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch (error) {
      // Storage can be blocked (private mode). The cart still works for this page view.
    }
  };

  const commit = () => {
    writeStorage();
    listeners.forEach((listener) => listener());
  };

  const count = () => lines.reduce((total, line) => total + line.qty, 0);
  const subtotal = () => lines.reduce((total, line) => total + productById.get(line.id).price * line.qty, 0);

  const add = (id, variant = "", qty = 1) => {
    const product = productById.get(id);
    if (!product || !variantsFor(product).includes(variant)) return false;
    const existing = lines.find((line) => lineKey(line.id, line.variant) === lineKey(id, variant));
    if (existing) existing.qty = clampQty(existing.qty + qty);
    else lines.push({ id, variant, qty: clampQty(qty) });
    commit();
    return true;
  };

  const setQty = (id, variant, qty) => {
    const line = lines.find((item) => lineKey(item.id, item.variant) === lineKey(id, variant));
    if (!line) return;
    line.qty = clampQty(qty);
    commit();
  };

  const remove = (id, variant) => {
    lines = lines.filter((line) => lineKey(line.id, line.variant) !== lineKey(id, variant));
    commit();
  };

  // Swap this for the Shopify checkout redirect when the store is connected.
  const checkout = () => {
    const rows = lines.map((line) => {
      const product = productById.get(line.id);
      const label = line.variant ? `${product.name} (${line.variant})` : product.name;
      return `- ${label} x${line.qty}: ${formatMoney(product.price * line.qty)}`;
    });
    const body = [
      "Hi SAINT Studio, I'd like to order:",
      "",
      ...rows,
      "",
      `Subtotal: ${formatMoney(subtotal())} CAD`,
      "",
      "Pickup: SAINT Studio, 1154 Morningside Ave, Scarborough",
      "Name:",
    ].join("\n");
    window.location.href = `mailto:${CHECKOUT_EMAIL}?subject=${encodeURIComponent("Saint Apparel order")}&body=${encodeURIComponent(body)}`;
  };

  // --- UI -------------------------------------------------------------------

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const bagIcon = () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("aria-hidden", "true");
    ["M5 8h14l-1 12H6L5 8z", "M9 8V6.5a3 3 0 0 1 6 0V8"].forEach((d) => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      svg.append(path);
    });
    return svg;
  };

  let drawer;
  let overlay;
  let drawerBody;
  let drawerFooter;
  let drawerTitle;
  let cartButton;
  let badge;
  let lastTrigger = null;

  const renderLine = (line) => {
    const product = productById.get(line.id);
    const item = el("li", "cart-line");

    const thumb = el("img", "cart-line__image");
    thumb.src = product.images[0].src;
    thumb.alt = "";
    thumb.loading = "lazy";

    const info = el("div", "cart-line__info");
    const name = el("a", "cart-line__name", product.name);
    name.href = `product.html?product=${encodeURIComponent(product.id)}`;
    info.append(name);
    if (line.variant) info.append(el("p", "cart-line__variant", line.variant));
    info.append(el("p", "cart-line__price", formatMoney(product.price)));

    const controls = el("div", "cart-line__controls");
    const stepper = el("div", "qty-stepper");
    const minus = el("button", "qty-stepper__button", "−");
    minus.type = "button";
    minus.setAttribute("aria-label", `Decrease quantity of ${product.name}`);
    minus.disabled = line.qty <= 1;
    minus.addEventListener("click", () => setQty(line.id, line.variant, line.qty - 1));
    const value = el("span", "qty-stepper__value", String(line.qty));
    value.setAttribute("aria-label", `Quantity ${line.qty}`);
    const plus = el("button", "qty-stepper__button", "+");
    plus.type = "button";
    plus.setAttribute("aria-label", `Increase quantity of ${product.name}`);
    plus.disabled = line.qty >= MAX_QTY;
    plus.addEventListener("click", () => setQty(line.id, line.variant, line.qty + 1));
    stepper.append(minus, value, plus);

    const removeButton = el("button", "cart-line__remove", "Remove");
    removeButton.type = "button";
    removeButton.setAttribute("aria-label", `Remove ${product.name}${line.variant ? ` (${line.variant})` : ""} from cart`);
    removeButton.addEventListener("click", () => remove(line.id, line.variant));

    controls.append(stepper, removeButton);
    info.append(controls);
    item.append(thumb, info, el("p", "cart-line__total", formatMoney(product.price * line.qty)));
    return item;
  };

  const render = () => {
    const total = count();
    if (badge) {
      badge.textContent = String(total);
      badge.hidden = total === 0;
      cartButton.setAttribute("aria-label", total === 0 ? "Open cart, empty" : `Open cart, ${total} ${total === 1 ? "item" : "items"}`);
    }
    if (!drawer) return;

    drawerTitle.textContent = total === 0 ? "Cart" : `Cart (${total})`;
    drawerBody.textContent = "";
    drawerFooter.textContent = "";

    if (lines.length === 0) {
      const empty = el("div", "cart-empty");
      empty.append(el("p", "cart-empty__title", "Your cart is empty."));
      const shop = el("a", "ghost-button", "Shop Saint Apparel");
      shop.href = "apparel.html";
      empty.append(shop);
      drawerBody.append(empty);
      return;
    }

    const list = el("ul", "cart-lines");
    lines.forEach((line) => list.append(renderLine(line)));
    drawerBody.append(list);

    const row = el("div", "cart-subtotal");
    row.append(el("span", "", "Subtotal"), el("strong", "", `${formatMoney(subtotal())} CAD`));
    const note = el("p", "cart-note", "Pickup only at SAINT Studio, 1154 Morningside Ave, Scarborough. Online checkout is coming soon, so for now send your order by email and we'll confirm payment and pickup.");
    const checkoutButton = el("button", "solid-button cart-checkout", "Send Order by Email");
    checkoutButton.type = "button";
    checkoutButton.addEventListener("click", checkout);
    drawerFooter.append(row, note, checkoutButton);
  };

  const focusables = () =>
    [...drawer.querySelectorAll("a[href], button:not([disabled]), input, select, textarea")].filter((node) => !node.hidden);

  const open = () => {
    if (!drawer) return;
    lastTrigger = document.activeElement;
    drawer.classList.add("is-open");
    overlay.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("cart-open");
    drawer.querySelector(".cart-drawer__close").focus();
  };

  const close = () => {
    if (!drawer || !drawer.classList.contains("is-open")) return;
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cart-open");
    if (lastTrigger && typeof lastTrigger.focus === "function") lastTrigger.focus();
  };

  const buildDrawer = () => {
    overlay = el("div", "cart-overlay");
    overlay.addEventListener("click", close);

    drawer = el("aside", "cart-drawer");
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.setAttribute("aria-labelledby", "cart-drawer-title");
    drawer.setAttribute("aria-hidden", "true");

    const head = el("div", "cart-drawer__head");
    drawerTitle = el("h2", "", "Cart");
    drawerTitle.id = "cart-drawer-title";
    const closeButton = el("button", "icon-button cart-drawer__close");
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Close cart");
    closeButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>';
    closeButton.addEventListener("click", close);
    head.append(drawerTitle, closeButton);

    drawerBody = el("div", "cart-drawer__body");
    drawerFooter = el("div", "cart-drawer__footer");
    drawer.append(head, drawerBody, drawerFooter);
    document.body.append(overlay, drawer);

    drawer.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const nodes = focusables();
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  };

  const buildButton = () => {
    const actions = document.querySelector(".header-actions");
    if (!actions) return;
    cartButton = el("button", "icon-button cart-button");
    cartButton.type = "button";
    cartButton.append(bagIcon());
    badge = el("span", "cart-button__count");
    badge.hidden = true;
    cartButton.append(badge);
    cartButton.addEventListener("click", open);
    actions.prepend(cartButton);
  };

  const init = () => {
    lines = readStorage();
    buildButton();
    if (cartButton || document.querySelector("[data-product-page]") || document.querySelector("[data-product-grid]")) buildDrawer();
    render();
    listeners.add(render);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
    // Keep tabs in sync if the cart changes in another tab.
    window.addEventListener("storage", (event) => {
      if (event.key !== STORAGE_KEY) return;
      lines = readStorage();
      render();
    });
  };

  window.SaintCart = { add, setQty, remove, open, close, count, subtotal, formatMoney, variantsFor };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
