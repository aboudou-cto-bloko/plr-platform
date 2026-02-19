// Subscription pricing
export const SUBSCRIPTION = {
  PRICE: 10000,
  CURRENCY: "XOF",
  DURATION_DAYS: 30,
  DURATION_MS: 30 * 24 * 60 * 60 * 1000,
  DESCRIPTION: "Abonnement PLR Library - 1 mois",
} as const;

// Grace period for failed renewals
export const GRACE_PERIOD = {
  DAYS: 3,
  MS: 3 * 24 * 60 * 60 * 1000,
} as const;

// Renewal settings
export const RENEWAL = {
  MAX_ATTEMPTS: 3,
} as const;

// Rate limiting (downloads)
export const RATE_LIMIT = {
  WINDOW_MS: 60 * 60 * 24000, // 24 hour
  MAX_DOWNLOADS: 5,
} as const;

// ============================================
// MONEROO PAYMENT METHODS (XOF only)
// ============================================

export const PAYMENT_METHODS = {
  // Bénin (BJ)
  BJ: [
    { code: "mtn_bj", name: "MTN MoMo Benin" },
    { code: "moov_bj", name: "Moov Money Benin" },
  ],
  // Côte d'Ivoire (CI)
  CI: [
    { code: "mtn_ci", name: "MTN MoMo CI" },
    { code: "moov_ci", name: "Moov Money CI" },
    { code: "orange_ci", name: "Orange Money CI" },
    { code: "wave_ci", name: "Wave CI" },
  ],
  // Sénégal (SN)
  SN: [
    { code: "orange_sn", name: "Orange Money Senegal" },
    { code: "wave_sn", name: "Wave Senegal" },
    { code: "freemoney_sn", name: "Free Money Senegal" },
    { code: "e_money_sn", name: "E-Money Senegal" },
  ],
  // Burkina Faso (BF)
  BF: [
    { code: "orange_bf", name: "Orange Burkina Faso" },
    { code: "moov_bf", name: "Moov Burkina Faso" },
  ],
  // Mali (ML)
  ML: [
    { code: "orange_ml", name: "Orange Money Mali" },
    { code: "moov_ml", name: "Moov Money Mali" },
    { code: "mobi_cash_ml", name: "Mobi Cash Mali" },
  ],
  // Togo (TG)
  TG: [
    { code: "moov_tg", name: "Moov Money Togo" },
    { code: "togocel", name: "Togocel Money" },
  ],
  // Niger (NE)
  NE: [{ code: "airtel_ne", name: "Airtel Niger" }],
  // Carte bancaire (tous pays XOF)
  CARD: [{ code: "card_xof", name: "Carte bancaire" }],
} as const;

// Méthodes par défaut (zone UEMOA principale)
export const DEFAULT_PAYMENT_METHODS = [
  // Bénin
  "mtn_bj",
  "moov_bj",
  // Côte d'Ivoire
  "mtn_ci",
  "moov_ci",
  "orange_ci",
  "wave_ci",
  // Sénégal
  "orange_sn",
  "wave_sn",
  // Burkina
  "orange_bf",
  "moov_bf",
  // Togo
  "moov_tg",
  // Mali
  "orange_ml",
  // Carte
  "card_xof",
] as const;

// ============================================
// PRODUCT CATEGORIES
// ============================================

export const PRODUCT_CATEGORIES = [
  { id: "ebook", label: "Ebooks", icon: "📚" },
  { id: "template", label: "Templates", icon: "📝" },
  { id: "formation", label: "Formations", icon: "🎓" },
  { id: "kit", label: "Kits", icon: "📦" },
  { id: "script", label: "Scripts", icon: "📜" },
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]["id"];

// ============================================
// STATUS ENUMS
// ============================================

export const USER_SUBSCRIPTION_STATUS = [
  "none",
  "active",
  "expired",
  "cancelled",
] as const;

export const SUBSCRIPTION_STATUS = [
  "active",
  "expired",
  "cancelled",
  "pending",
  "failed",
  "pending_renewal",
] as const;

export const PAYMENT_STATUS = [
  "pending",
  "initiated",
  "success",
  "failed",
  "cancelled",
] as const;

// ============================================
// HELPERS
// ============================================

export function formatPrice(
  amount: number = SUBSCRIPTION.PRICE,
  currency: string = SUBSCRIPTION.CURRENCY,
): string {
  return `${amount.toLocaleString("fr-FR")} ${currency}`;
}

// Pour affichage frontend
export function formatPriceDisplay(): string {
  return `${SUBSCRIPTION.PRICE.toLocaleString("fr-FR")} FCFA/mois`;
}

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

export const CREDITS = {
  FREE_MONTHLY_CREDITS: 30,
  DEFAULT_PRODUCT_COST: 10,
  RESET_DAY: 1, // Jour du mois pour le reset (1er)
} as const;
