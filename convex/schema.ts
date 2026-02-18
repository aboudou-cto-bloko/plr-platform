import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("admin")),
    subscriptionStatus: v.union(
      v.literal("active"),
      v.literal("cancelled"),
      v.literal("expired"),
      v.literal("none"),
    ),
    monerooCustomerId: v.optional(v.string()),
    nextBillingDate: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    isLocked: v.optional(v.boolean()),
    lockReason: v.optional(v.string()),
    lockedAt: v.optional(v.number()),
    referredBy: v.optional(v.id("affiliates")),
    referralCode: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_subscription", ["subscriptionStatus"]),

  products: defineTable({
    title: v.string(),
    category: v.union(
      v.literal("ebook"),
      v.literal("template"),
      v.literal("formation"),
      v.literal("kit"),
      v.literal("script"),
    ),
    niche: v.union(
      v.literal("technologie"),
      v.literal("business_finance"),
      v.literal("developpement_personnel"),
      v.literal("education_apprentissage"),
      v.literal("divertissement"),
      v.literal("sante_bien_etre"),
      v.literal("litterature_edition"),
      v.literal("medias_communication"),
      v.literal("religion"),
      v.literal("autres"),
    ),
    description: v.string(),
    thumbnailId: v.optional(v.id("_storage")),
    zipFileId: v.id("_storage"),
    isNouveau: v.boolean(),
    downloadCount: v.optional(v.number()),
    fileSize: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
    status: v.union(v.literal("draft"), v.literal("published")),
  })
    .index("by_category", ["category"])
    .index("by_niche", ["niche"])
    .index("by_status", ["status"])
    .index("by_nouveau", ["isNouveau"]),

  downloads: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    downloadedAt: v.number(),
    // Device tracking
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    ipCountry: v.optional(v.string()),
    deviceFingerprint: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_product", ["productId"])
    .index("by_user_time", ["userId", "downloadedAt"]),

  // Audit logs ← NOUVEAU
  auditLogs: defineTable({
    userId: v.id("users"),
    action: v.string(),
    details: v.optional(v.string()),
    metadata: v.optional(v.any()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_action", ["action"])
    .index("by_time", ["createdAt"]),

  // Security alerts ← NOUVEAU
  securityAlerts: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("multiple_devices"),
      v.literal("multiple_countries"),
      v.literal("suspicious_activity"),
      v.literal("account_locked"),
    ),
    severity: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    details: v.string(),
    metadata: v.optional(v.any()),
    isResolved: v.boolean(),
    resolvedAt: v.optional(v.number()),
    resolvedBy: v.optional(v.id("users")),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_type", ["type"])
    .index("by_resolved", ["isResolved"])
    .index("by_severity", ["severity"]),

  subscriptions: defineTable({
    userId: v.id("users"),
    status: v.union(
      v.literal("active"),
      v.literal("pending"),
      v.literal("cancelled"),
      v.literal("expired"),
      v.literal("failed"),
      v.literal("pending_renewal"),
    ),
    startedAt: v.number(),
    expiresAt: v.number(),
    renewalAttempts: v.optional(v.number()),
    lastRenewalAttempt: v.optional(v.number()),
    monerooPaymentId: v.optional(v.string()),
    amount: v.optional(v.number()),
    currency: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_moneroo", ["monerooPaymentId"])
    .index("by_status", ["status"])
    .index("by_expiry", ["expiresAt"])
    .index("by_status_expiry", ["status", "expiresAt"]),

  payments: defineTable({
    userId: v.id("users"),
    subscriptionId: v.optional(v.id("subscriptions")),
    monerooPaymentId: v.optional(v.string()),
    amount: v.number(),
    originalAmount: v.optional(v.number()),
    discountAmount: v.optional(v.number()),
    affiliateId: v.optional(v.id("affiliates")),
    currency: v.string(),
    status: v.union(
      v.literal("initiated"),
      v.literal("pending"),
      v.literal("success"),
      v.literal("failed"),
      v.literal("cancelled"),
    ),
    type: v.union(v.literal("initial"), v.literal("renewal")),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_moneroo", ["monerooPaymentId"])
    .index("by_subscription", ["subscriptionId"]),

  onboardingAnswers: defineTable({
    userId: v.id("users"),
    goal: v.string(),
    productTypes: v.array(v.string()),
    experience: v.string(),
    completedAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  affiliates: defineTable({
    name: v.string(),
    email: v.string(), // Email de l'affilié
    code: v.string(), // Code unique: "john", "partner2024"
    discountPercent: v.number(), // 0-100, réduction pour les users (ex: 20%)
    commissionPercent: v.number(), // Commission pour l'affilié (ex: 30%)
    isActive: v.boolean(),
    totalReferrals: v.number(), // Nombre d'inscrits
    totalPaidReferrals: v.number(), // Nombre de paiements
    totalRevenue: v.number(), // Revenue généré (en FCFA)
    totalCommission: v.number(), // Commission totale due
    unpaidCommission: v.number(), // Commission non payée
    createdAt: v.number(),
  })
    .index("by_code", ["code"])
    .index("by_email", ["email"])
    .index("by_active", ["isActive"]),

  // Table des référrals (tracking)
  referrals: defineTable({
    affiliateId: v.id("affiliates"),
    userId: v.optional(v.id("users")), // User qui s'est inscrit (optional car peut être juste un clic)
    paymentId: v.optional(v.id("payments")), // Premier paiement
    originalAmount: v.optional(v.number()), // Prix original
    discountAmount: v.optional(v.number()), // Montant de réduction
    finalAmount: v.optional(v.number()), // Prix payé
    commissionAmount: v.optional(v.number()), // Commission due à l'affilié
    isRenewal: v.optional(v.boolean()), // Indique si c'est un renouvellement
    status: v.union(
      v.literal("clicked"), // A cliqué sur le lien
      v.literal("signed_up"), // S'est inscrit
      v.literal("paid"), // A payé (converti)
    ),
    createdAt: v.number(),
    convertedAt: v.optional(v.number()), // Date de conversion (paiement)
  })
    .index("by_affiliate", ["affiliateId"])
    .index("by_user", ["userId"])
    .index("by_affiliate_status", ["affiliateId", "status"]),
});
