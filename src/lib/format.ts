export type Currency = "INR" | "USD" | "GBP" | "SGD" | "AUD" | "CAD";

export const currencies: { code: Currency; symbol: string; rate: number; locale: string }[] = [
  { code: "INR", symbol: "₹", rate: 1, locale: "en-IN" },
  { code: "USD", symbol: "$", rate: 0.012, locale: "en-US" },
  { code: "GBP", symbol: "£", rate: 0.0095, locale: "en-GB" },
  { code: "SGD", symbol: "S$", rate: 0.016, locale: "en-SG" },
  { code: "AUD", symbol: "A$", rate: 0.018, locale: "en-AU" },
  { code: "CAD", symbol: "C$", rate: 0.016, locale: "en-CA" },
];

export function formatPrice(inr: number, code: Currency = "INR") {
  const c = currencies.find((x) => x.code === code) ?? currencies[0];
  return `${c.symbol}${Math.round(inr * c.rate).toLocaleString(c.locale)}`;
}

export const savePercent = (price: number, compareAt?: number) =>
  compareAt && compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

export const FREE_SHIPPING_ABOVE = 1999;
export const FLAT_SHIPPING = 499;
export const GIFT_WRAP_PRICE = 299;
export const PROMO_CODES: Record<string, number> = { ART10: 0.1, WELCOME5: 0.05 };
