// Saint Apparel catalog.
//
// This file is the single source of truth for the shop: the Apparel page,
// every product page, and the cart all read from it. Prices are in cents (CAD)
// so the cart never does floating-point math on money.
//
// `shopifyVariantIds` holds each variant's Shopify ID, keyed by the variant label
// (e.g. "Large" or "Gold"; "" for a product with no options). cart.js uses them to
// build the Shopify checkout link when SHOPIFY_CHECKOUT_ENABLED is on.
window.SAINT_PRODUCTS = [
  {
    id: "saint-hoodie-001",
    name: "Saint Hoodie 001",
    category: "Hoodie",
    price: 12999,
    currency: "CAD",
    description: [
      "Black hoodie with a boxy silhouette and ribbed cuffs and hem.",
      "A small embroidered S logo sits on the chest and the SAINT script and star runs across the back, both tonal black-on-black.",
    ],
    details: [
      "Black",
      "Tonal S logo on the chest and SAINT script on the back",
      "Available in Small, Medium, and Large",
    ],
    images: [
      { src: "assets/images/saint-hoodie-front.jpg", alt: "Front of the black Saint Hoodie 001 with a tonal embroidered S logo on the chest" },
      { src: "assets/images/saint-hoodie.jpg", alt: "Back of the black Saint Hoodie 001 with tonal Saint script and star" },
    ],
    options: [{ name: "Size", values: ["Small", "Medium", "Large"] }],
    shopifyVariantIds: { Small: "67864952602993", Medium: "67864952635761", Large: "67864952668529" },
  },
  {
    id: "saint-skullcaps",
    name: "Saint Skullcaps",
    category: "Skullcap",
    price: 2999,
    currency: "CAD",
    description: [
      "Black knit skullcap with a folded cuff.",
      "A small white SAINT logo sits on the cuff.",
    ],
    details: ["Black", "One size", "Small white SAINT logo on the cuff"],
    images: [{ src: "assets/images/saint-skullcap.webp", alt: "Black Saint skullcap with a small white SAINT logo on the cuff" }],
    options: [],
    shopifyVariantIds: { "": "67864952734065" },
  },
  {
    id: "saint-chains",
    name: "Saint Chains",
    category: "Chain",
    price: 7999,
    currency: "CAD",
    description: [
      "The SAINT logo pendant on a chain.",
      "Choose gold or silver.",
    ],
    details: ["SAINT logo pendant on a chain", "Available in gold and silver"],
    images: [{ src: "assets/images/saint-chains.webp", alt: "Gold and silver Saint logo pendant chains on rope chains" }],
    options: [{ name: "Colour", values: ["Gold", "Silver"] }],
    shopifyVariantIds: { Gold: "67864952832369", Silver: "67864952865137" },
  },
];
