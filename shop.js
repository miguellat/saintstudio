// Renders the Apparel product grid and the product page from products.js.
(() => {
  const products = window.SAINT_PRODUCTS || [];
  const cart = window.SaintCart;
  if (!cart) return;

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const productUrl = (product) => `product.html?product=${encodeURIComponent(product.id)}`;

  const buildCard = (product) => {
    const card = el("a", "product-card");
    card.href = productUrl(product);

    const media = el("div", "product-card__media");
    const image = el("img");
    image.src = product.images[0].src;
    image.alt = product.images[0].alt;
    image.loading = "lazy";
    media.append(image);
    if (cart.allSoldOut(product)) {
      card.classList.add("is-sold-out");
      media.append(el("span", "product-card__badge", "Sold out"));
    }

    card.append(media, el("h3", "product-card__name", product.name), el("p", "product-card__price", cart.formatMoney(product.price)));
    return card;
  };

  const grid = document.querySelector("[data-product-grid]");
  if (grid) products.forEach((product) => grid.append(buildCard(product)));

  const page = document.querySelector("[data-product-page]");
  if (!page) return;

  const params = new URLSearchParams(window.location.search);
  const product = products.find((item) => item.id === params.get("product"));
  const content = page.querySelector("[data-product-content]");
  const missing = page.querySelector("[data-product-missing]");

  if (!product) {
    document.title = "Product not found | SAINTstudio";
    content.hidden = true;
    missing.hidden = false;
    page.querySelector("[data-related]").hidden = true;
    return;
  }

  missing.hidden = true;
  document.title = `${product.name} | Saint Apparel | SAINTstudio`;

  page.querySelector("[data-product-crumb]").textContent = product.name;
  page.querySelector("[data-product-category]").textContent = product.category;
  page.querySelector("[data-product-name]").textContent = product.name;
  page.querySelector("[data-product-price]").textContent = `${cart.formatMoney(product.price)} CAD`;

  const description = page.querySelector("[data-product-description]");
  product.description.forEach((paragraph) => description.append(el("p", "", paragraph)));

  const details = page.querySelector("[data-product-details]");
  product.details.forEach((detail) => details.append(el("li", "", detail)));

  // Gallery
  const mainImage = page.querySelector("[data-product-image]");
  const thumbs = page.querySelector("[data-product-thumbs]");
  let imageIndex = 0;

  const showImage = (index) => {
    imageIndex = index;
    mainImage.src = product.images[index].src;
    mainImage.alt = product.images[index].alt;
    thumbs.querySelectorAll("button").forEach((button, buttonIndex) => {
      button.setAttribute("aria-pressed", String(buttonIndex === index));
    });
  };

  if (product.images.length > 1) {
    product.images.forEach((image, index) => {
      const button = el("button", "product-thumb");
      button.type = "button";
      button.setAttribute("aria-label", `Show image ${index + 1} of ${product.images.length}`);
      const thumb = el("img");
      thumb.src = image.src;
      thumb.alt = "";
      button.append(thumb);
      button.addEventListener("click", () => showImage(index));
      thumbs.append(button);
    });
  } else {
    thumbs.hidden = true;
  }
  showImage(0);

  // Options
  const form = page.querySelector("[data-product-form]");
  const optionsHost = page.querySelector("[data-product-options]");
  const note = page.querySelector("[data-product-note]");
  const selected = {};

  product.options.forEach((option) => {
    const group = el("fieldset", "option-group");
    group.append(el("legend", "", option.name));
    const values = el("div", "option-values");

    option.values.forEach((value) => {
      const label = el("label", "option-pill");
      const input = el("input");
      input.type = "radio";
      input.name = `option-${option.name}`;
      input.value = value;
      input.addEventListener("change", () => {
        selected[option.name] = value;
        note.textContent = "";
        if (option.images && option.images[value] !== undefined) showImage(option.images[value]);
      });
      if (product.options.length === 1 && cart.isSoldOut(product, value)) {
        input.disabled = true;
        label.classList.add("is-sold-out");
        label.append(input, el("span", "", `${value} (sold out)`));
      } else {
        label.append(input, el("span", "", value));
      }
      values.append(label);
    });

    group.append(values);
    optionsHost.append(group);
  });

  // Quantity
  const qtyValue = page.querySelector("[data-qty-value]");
  const qtyMinus = page.querySelector("[data-qty-minus]");
  const qtyPlus = page.querySelector("[data-qty-plus]");
  let qty = 1;
  const MAX_QTY = 10;

  const renderQty = () => {
    qtyValue.textContent = String(qty);
    qtyValue.setAttribute("aria-label", `Quantity ${qty}`);
    qtyMinus.disabled = qty <= 1;
    qtyPlus.disabled = qty >= MAX_QTY;
  };
  qtyMinus.addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    renderQty();
  });
  qtyPlus.addEventListener("click", () => {
    qty = Math.min(MAX_QTY, qty + 1);
    renderQty();
  });
  renderQty();

  // Add to cart
  const addButton = page.querySelector("[data-add-to-cart]");
  let resetTimer;

  if (cart.allSoldOut(product)) {
    addButton.disabled = true;
    addButton.textContent = "Sold Out";
    page.querySelector("[data-product-price]").textContent += " · Sold out";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const missingOption = product.options.find((option) => !selected[option.name]);
    if (missingOption) {
      note.textContent = `Please choose a ${missingOption.name.toLowerCase()}.`;
      const firstInput = optionsHost.querySelector(`input[name="option-${missingOption.name}"]`);
      if (firstInput) firstInput.focus();
      return;
    }

    const variant = product.options.map((option) => selected[option.name]).join(" / ");
    if (!cart.add(product.id, variant, qty)) {
      note.textContent = "Something went wrong adding that to your cart. Please try again.";
      return;
    }

    note.textContent = "";
    addButton.textContent = "Added to Cart";
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      addButton.textContent = "Add to Cart";
    }, 1800);
    cart.open();
  });

  // More products
  const related = page.querySelector("[data-related-grid]");
  products.filter((item) => item.id !== product.id).forEach((item) => related.append(buildCard(item)));
})();
