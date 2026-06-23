import type { Product } from "./wix/types";

const S = "/buttr/stickers";

export function formatMoney(amount: string | number, currencyCode = "USD") {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
    }).format(n);
  } catch {
    return `${currencyCode} ${n.toFixed(2)}`;
  }
}

export function isBrewProduct(p: Product) {
  const t = `${p.title} ${p.tags.join(" ")}`.toLowerCase();
  return /beverage|coffee|drink|brew|tea|latte|espresso|cappuccino|matcha|americano|dripper|cortado|decaf/.test(
    t,
  );
}

export function getStickerUrl(title: string, extra = ""): string {
  const t = `${title} ${extra}`.toLowerCase();
  if (/croissant/.test(t)) return `${S}/croissant.png`;
  if (/baguette|sourdough|loaf|bread|olive|miso|honey/.test(t)) return `${S}/baguette.png`;
  if (/brioche|knot|bun|roll|cardamom/.test(t)) return `${S}/dough-mascot.png`;
  if (/cookie|tart|cake|sweet|pastry/.test(t)) return `${S}/toast-butter.png`;
  if (/espresso|cortado|cappuccino|latte|americano|decaf/.test(t)) return `${S}/coffee-cup.png`;
  if (/matcha|chai|chocolate|non.coffee|herbal/.test(t)) return `${S}/takeaway-cup.png`;
  if (/single.origin|tasting|flight|filter|pour|dripper|ceramic/.test(t)) return `${S}/coffee-bean.png`;
  if (/coffee|bean/.test(t)) return `${S}/coffee-bean.png`;
  const isBrew = /beverage|coffee|drink|brew|tea/.test(t);
  return isBrew ? `${S}/coffee-cup.png` : `${S}/mascot-bakery-sm.png`;
}

const BAKES_SUBCATEGORY_ORDER = ["Classics", "Signature", "Sweet Treats"] as const;
export type BakesSubcategory = (typeof BAKES_SUBCATEGORY_ORDER)[number];

export function getBakesSubcategory(p: Product): BakesSubcategory {
  const t = p.title.toLowerCase();
  if (/cookie|donut|doughnut|brownie|tart|cake|sweet|candy|chocolate bar/.test(t)) {
    return "Sweet Treats";
  }
  if (/muffin|swirl|cinnamon|brioche|knot|cardamom|bun|roll|babka|danish|scone/.test(t)) {
    return "Signature";
  }
  return "Classics";
}

/** Build the add-to-cart variant payload matching the Wix actions schema. */
export function variantPayload(p: Product) {
  const variant = p.variants[0];
  if (!variant) return JSON.stringify({ variantId: undefined });
  if (variant.id === "00000000-0000-0000-0000-000000000000") {
    return JSON.stringify({
      options: variant.selectedOptions.reduce(
        (acc, o) => ({ ...acc, [o.name]: o.value }),
        {} as Record<string, string>,
      ),
    });
  }
  return JSON.stringify({ variantId: variant.id });
}

export function groupMenu(products: Product[]) {
  const bakes = products.filter((p) => !isBrewProduct(p));
  const brews = products.filter((p) => isBrewProduct(p));
  return { bakes, brews };
}

export { BAKES_SUBCATEGORY_ORDER };
