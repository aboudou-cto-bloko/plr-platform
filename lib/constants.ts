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

export const PRODUCT_NICHES = [
  { id: "technologie", label: "Technologie", icon: "💻" },
  { id: "business_finance", label: "Business & Finance", icon: "💰" },
  {
    id: "developpement_personnel",
    label: "Développement Personnel",
    icon: "🧠",
  },
  {
    id: "education_apprentissage",
    label: "Éducation & Apprentissage",
    icon: "📚",
  },
  { id: "divertissement", label: "Divertissement", icon: "🎮" },
  { id: "sante_bien_etre", label: "Santé & Bien-être", icon: "💪" },
  { id: "litterature_edition", label: "Littérature & Édition", icon: "📖" },
  { id: "medias_communication", label: "Médias & Communication", icon: "📡" },
  { id: "religion", label: "Religion", icon: "🙏" },
  { id: "autres", label: "Autres Catégories", icon: "📁" },
] as const;

export type ProductNiche = (typeof PRODUCT_NICHES)[number]["id"];
