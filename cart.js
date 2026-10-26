// Cart for Saint Apparel: header bag button, slide-out drawer, and storage.
//
// The cart lives in the visitor's browser (localStorage). "Pay in Store" emails a
// pickup order (nothing is created in Shopify; it is rung up as a Quick Sale at
// pickup). When SHOPIFY_CHECKOUT_ENABLED is on, "Pay Online" also redirects to
// Shopify's hosted checkout built from the cart lines.
(() => {
  const STORAGE_KEY = "saint-cart-v1";
  const CHECKOUT_EMAIL = "saintstudiotoronto@gmail.com";
  // Web3Forms public access key: orders are emailed to the inbox it was created with.
  const ORDER_ENDPOINT = "https://api.web3forms.com/submit";
  const ORDER_ACCESS_KEY = "dff7012d-792c-4037-bd2d-ac46ecccea3d";
  // EmailJS (https://www.emailjs.com) emails the customer their confirmation.
  // Fill these in from the EmailJS dashboard; while any is empty, confirmations are skipped.
  const CONFIRM_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
  const CONFIRM_SERVICE_ID = "service_9gc3b1j";
  const CONFIRM_TEMPLATE_ID = "template_qck0jpo";
  const CONFIRM_PUBLIC_KEY = "iJxpL6tf4tm41vCYA";
  // Off switch for online payment. When true, "Pay Online" sends the cart to Shopify's
  // hosted checkout, alongside the "Pay in Store" pickup form. Turn on only after Shopify
  // Payments is set up and the pickup location/address is correct in Shopify.
  const SHOPIFY_CHECKOUT_ENABLED = true;
  const SHOPIFY_STORE_URL = "https://ytwxye-hm.myshopify.com";
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

  const isSoldOut = (product, variant) => (product.soldOut || []).includes(variant);
  const allSoldOut = (product) => variantsFor(product).every((variant) => isSoldOut(product, variant));

  const clampQty = (value) => Math.max(1, Math.min(MAX_QTY, Math.floor(Number(value)) || 1));
  const lineKey = (id, variant) => `${id}|${variant}`;

  let lines = [];
  const listeners = new Set();

  const readStorage = () => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(
          (line) =>
            line &&
            productById.has(line.id) &&
            variantsFor(productById.get(line.id)).includes(line.variant) &&
            !isSoldOut(productById.get(line.id), line.variant),
        )
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
    if (!product || !variantsFor(product).includes(variant) || isSoldOut(product, variant)) return false;
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

  const orderSummary = () =>
    lines
      .map((line) => {
        const product = productById.get(line.id);
        const label = line.variant ? `${product.name} (${line.variant})` : product.name;
        return `- ${label} x${line.qty}: ${formatMoney(product.price * line.qty)}`;
      })
      .join("\n");

  const sendOrder = async (details) => {
    const response = await fetch(ORDER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: ORDER_ACCESS_KEY,
        subject: `Saint Apparel order from ${details.name}`,
        from_name: "SAINT Apparel Shop",
        name: details.name,
        email: details.email,
        phone: details.phone,
        order: orderSummary(),
        subtotal: `${formatMoney(subtotal())} CAD`,
        pickup: "SAINT Studio, 1154 Morningside Ave #212, Scarborough",
        note: details.note || "(none)",
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === false) throw new Error(result.message || "Request failed");
  };

  // Template variables: {{to_name}}, {{to_email}}, {{order}}, {{subtotal}}, {{pickup}}, {{note}}
  const sendConfirmation = async (details, order, total) => {
    if (!CONFIRM_SERVICE_ID || !CONFIRM_TEMPLATE_ID || !CONFIRM_PUBLIC_KEY) return;
    try {
      await fetch(CONFIRM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: CONFIRM_SERVICE_ID,
          template_id: CONFIRM_TEMPLATE_ID,
          user_id: CONFIRM_PUBLIC_KEY,
          template_params: {
            to_name: details.name,
            to_email: details.email,
            order,
            subtotal: total,
            pickup: "SAINT Studio, 1154 Morningside Ave #212, Scarborough",
            note: details.note || "(none)",
          },
        }),
      });
    } catch (error) {
      // The order itself already went through; a failed confirmation must not block it.
    }
  };

  // Shopify cart link: /cart/<variantId>:<qty>,... opens Shopify's checkout with these items.
  // Returns null if any line has no Shopify variant ID, so the pickup form is used instead.
  const shopifyCheckoutUrl = () => {
    if (!SHOPIFY_CHECKOUT_ENABLED || lines.length === 0) return null;
    const parts = lines.map((line) => {
      const id = productById.get(line.id).shopifyVariantIds?.[line.variant];
      return id ? `${id}:${line.qty}` : null;
    });
    return parts.every(Boolean) ? `${SHOPIFY_STORE_URL}/cart/${parts.join(",")}` : null;
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
  let view = "cart"; // "cart" | "checkout" | "done"

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

    if (view === "done") {
      const done = el("div", "cart-empty");
      done.append(el("p", "cart-empty__title", "Order sent. Thank you!"));
      done.append(el("p", "cart-note", "We got your order and will email you to confirm pickup. You pay in store."));
      const back = el("button", "ghost-button", "Close");
      back.type = "button";
      back.addEventListener("click", () => {
        view = "cart";
        close();
        render();
      });
      done.append(back);
      drawerBody.append(done);
      return;
    }

    if (lines.length === 0) {
      view = "cart";
      const empty = el("div", "cart-empty");
      empty.append(el("p", "cart-empty__title", "Your cart is empty."));
      const shop = el("a", "ghost-button", "Shop Saint Apparel");
      shop.href = "apparel.html";
      empty.append(shop);
      drawerBody.append(empty);
      return;
    }

    if (view === "checkout") {
      renderCheckout();
      return;
    }

    const list = el("ul", "cart-lines");
    lines.forEach((line) => list.append(renderLine(line)));
    drawerBody.append(list);

    const row = el("div", "cart-subtotal");
    row.append(el("span", "", "Subtotal"), el("strong", "", `${formatMoney(subtotal())} CAD`));
    const onlineUrl = shopifyCheckoutUrl();
    const note = el(
      "p",
      "cart-note",
      onlineUrl
        ? "Pickup only at SAINT Studio, 1154 Morningside Ave #212, Scarborough. Pay online now, or pay when you pick up."
        : "Pickup only at SAINT Studio, 1154 Morningside Ave #212, Scarborough. Place your order and pay in store when you pick up.",
    );
    const goToStoreForm = () => {
      view = "checkout";
      render();
    };
    if (onlineUrl) {
      const payOnline = el("button", "solid-button cart-checkout", "Pay Online");
      payOnline.type = "button";
      payOnline.addEventListener("click", () => {
        window.location.href = onlineUrl;
      });
      const payInStore = el("button", "ghost-button cart-checkout", "Pay in Store");
      payInStore.type = "button";
      payInStore.addEventListener("click", goToStoreForm);
      drawerFooter.append(row, note, payOnline, payInStore);
      return;
    }
    const checkoutButton = el("button", "solid-button cart-checkout", "Place Order (Pay in Store)");
    checkoutButton.type = "button";
    checkoutButton.addEventListener("click", goToStoreForm);
    drawerFooter.append(row, note, checkoutButton);
  };

  const field = (labelText, name, attrs = {}, tag = "input") => {
    const wrap = el("label", "cart-field");
    wrap.append(el("span", "", labelText));
    const input = el(tag);
    input.name = name;
    Object.entries(attrs).forEach(([key, value]) => input.setAttribute(key, value));
    wrap.append(input);
    return wrap;
  };

  const renderCheckout = () => {
    const form = el("form", "cart-form");
    form.noValidate = false;
    const summary = el("pre", "cart-summary", orderSummary());
    form.append(
      el("p", "cart-form__title", "Your order"),
      summary,
      field("Name", "name", { required: "", autocomplete: "name" }),
      field("Email", "email", { type: "email", required: "", autocomplete: "email" }),
      field("Phone", "phone", { type: "tel", required: "", autocomplete: "tel" }),
      field("Note (optional)", "note", { rows: "2" }, "textarea"),
    );
    const status = el("p", "cart-note cart-form__status");
    status.setAttribute("role", "status");

    const row = el("div", "cart-subtotal");
    row.append(el("span", "", "Subtotal"), el("strong", "", `${formatMoney(subtotal())} CAD`));
    const note = el("p", "cart-note", "Pickup only at SAINT Studio, 1154 Morningside Ave #212, Scarborough. You pay in store when you pick up. No payment is taken now.");
    const submit = el("button", "solid-button cart-checkout", "Place Order");
    submit.type = "submit";
    const back = el("button", "ghost-button cart-checkout", "Back to cart");
    back.type = "button";
    back.addEventListener("click", () => {
      view = "cart";
      render();
    });
    form.append(row, note, status, submit, back);
    drawerBody.append(form);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      submit.disabled = true;
      submit.textContent = "Sending...";
      status.textContent = "";
      try {
        const details = { name: data.get("name"), email: data.get("email"), phone: data.get("phone"), note: data.get("note") };
        const order = orderSummary();
        const total = `${formatMoney(subtotal())} CAD`;
        await sendOrder(details);
        await sendConfirmation(details, order, total);
        lines = [];
        view = "done";
        commit();
      } catch (error) {
        submit.disabled = false;
        submit.textContent = "Place Order";
        status.textContent = `Something went wrong. Please try again or email us at ${CHECKOUT_EMAIL}.`;
      }
    });
    const firstInput = form.querySelector("input");
    if (firstInput) firstInput.focus();
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
    if (view !== "cart" && (view === "done" || lines.length === 0)) view = "cart";
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

  window.SaintCart = { add, setQty, remove, open, close, count, subtotal, formatMoney, variantsFor, isSoldOut, allSoldOut };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
