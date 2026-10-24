// Saint Apparel catalog.
//
// This file is the single source of truth for the shop: the Apparel page,
// every product page, and the cart all read from it. Prices are in cents (CAD)
// so the cart never does floating-point math on money.
//
// Connecting Shopify later: replace this array with a Storefront API fetch that
// returns the same shape, and fill in each variant's Shopify ID in
// `shopifyVariantIds` (keyed by the variant label, e.g. "Large" or "Gold").
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
    shopifyVariantIds: {},
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
    shopifyVariantIds: {},
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
    shopifyVariantIds: {},
  },
];
