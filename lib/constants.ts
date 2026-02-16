export const SUBSCRIPTION = {
  PRICE: 10000,
  CURRENCY: "XOF",
  CURRENCY_SYMBOL: "FCFA",
  DURATION_DAYS: 30,
} as const;

export const PRODUCT_CATEGORIES = [
  { id: "ebook", label: "Ebooks", icon: "📚" },
  { id: "template", label: "Templates", icon: "📝" },
  { id: "formation", label: "Formations", icon: "🎓" },
  { id: "kit", label: "Kits", icon: "📦" },
  { id: "script", label: "Scripts", icon: "📜" },
] as const;

export function formatPrice(amount: number = SUBSCRIPTION.PRICE): string {
  return `${amount.toLocaleString("fr-FR")} ${SUBSCRIPTION.CURRENCY_SYMBOL}`;
}

export function formatPriceWithPeriod(): string {
  return `${formatPrice()}/mois`;
}

export const RATE_LIMIT = {
  MAX_DOWNLOADS: 5,
  WINDOW_HOURS: 24,
} as const;
