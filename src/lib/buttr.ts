import type { Product } from "./wix/types";

const S = "/buttr/stickers";

/** Wix descriptions can contain HTML (e.g. <p>…</p>). Render them as clean text. */
export function stripHtml(input?: string | null): string {
  if (!input) return "";
  return input
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|li)>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

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

/**
 * Per-half artwork. Keyed by the Wix category slug so you can point any
 * category at any mascot/sticker without touching the layout code.
 * If a slug isn't listed here, the fallbacks are used in rotation.
 */
export const HALF_VISUALS: Record<string, { mascot: string; headSticker: string }> = {
  bakes: { mascot: "/buttr/mascot-bakery.png", headSticker: `${S}/croissant.png` },
  brews: { mascot: "/buttr/mascot-coffee.png", headSticker: `${S}/coffee-bean.png` },
};

const HALF_FALLBACKS = [
  { mascot: "/buttr/mascot-bakery.png", headSticker: `${S}/croissant.png` },
  { mascot: "/buttr/mascot-coffee.png", headSticker: `${S}/coffee-bean.png` },
];

export function halfVisual(slug: string, index: number) {
  return HALF_VISUALS[slug] ?? HALF_FALLBACKS[index % HALF_FALLBACKS.length];
}

const ORDINALS = ["One", "Two", "Three", "Four", "Five", "Six"];
export function halfOrdinal(index: number) {
  return ORDINALS[index] ?? String(index + 1);
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
