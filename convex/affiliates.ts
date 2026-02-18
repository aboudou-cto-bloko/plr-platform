// convex/affiliates.ts
import { v } from "convex/values";
import {
  query,
  mutation,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { SUBSCRIPTION } from "./constants";

// ============ QUERIES ============

// Vérifier un code affilié (public - pour la landing/signup)
export const getByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const code = args.code.toLowerCase().trim();

    const affiliate = await ctx.db
      .query("affiliates")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();

    if (!affiliate || !affiliate.isActive) {
      return null;
    }

    return {
      code: affiliate.code,
      name: affiliate.name,
      discountPercent: affiliate.discountPercent,
      // Ne pas exposer les autres infos
    };
  },
});

// Calculer le prix avec réduction
export const calculatePrice = query({
  args: { code: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const originalPrice = SUBSCRIPTION.PRICE;

    if (!args.code) {
      return {
        originalPrice,
        discountPercent: 0,
        discountAmount: 0,
        finalPrice: originalPrice,
        affiliateCode: null,
      };
    }

    const code = args.code.toLowerCase().trim();
    const affiliate = await ctx.db
      .query("affiliates")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();

    if (!affiliate || !affiliate.isActive) {
      return {
        originalPrice,
        discountPercent: 0,
        discountAmount: 0,
        finalPrice: originalPrice,
        affiliateCode: null,
      };
    }

    const discountAmount = Math.round(
      originalPrice * (affiliate.discountPercent / 100),
    );
    const finalPrice = originalPrice - discountAmount;

    return {
      originalPrice,
      discountPercent: affiliate.discountPercent,
      discountAmount,
      finalPrice,
      affiliateCode: affiliate.code,
    };
  },
});

// ============ ADMIN QUERIES ============

export const list = query({
  args: {},
  handler: async (ctx) => {
    const affiliates = await ctx.db.query("affiliates").order("desc").collect();

    return affiliates;
  },
});

export const getById = query({
  args: { affiliateId: v.id("affiliates") },
  handler: async (ctx, args) => {
    const affiliate = await ctx.db.get(args.affiliateId);
    if (!affiliate) return null;

    // Récupérer les referrals récents
    const referrals = await ctx.db
      .query("referrals")
      .withIndex("by_affiliate", (q) => q.eq("affiliateId", args.affiliateId))
      .order("desc")
      .take(50);

    // Enrichir avec les infos users
    const enrichedReferrals = await Promise.all(
      referrals.map(async (ref) => {
        const user = ref.userId ? await ctx.db.get(ref.userId) : null;
        return {
          ...ref,
          userEmail: user?.email,
          userName: user?.name,
        };
      }),
    );

    return {
      ...affiliate,
      referrals: enrichedReferrals,
    };
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const affiliates = await ctx.db.query("affiliates").collect();

    const totalAffiliates = affiliates.length;
    const activeAffiliates = affiliates.filter((a) => a.isActive).length;
    const totalReferrals = affiliates.reduce(
      (sum, a) => sum + a.totalReferrals,
      0,
    );
    const totalPaidReferrals = affiliates.reduce(
      (sum, a) => sum + a.totalPaidReferrals,
      0,
    );
    const totalRevenue = affiliates.reduce((sum, a) => sum + a.totalRevenue, 0);
    const totalCommission = affiliates.reduce(
      (sum, a) => sum + a.totalCommission,
      0,
    );
    const unpaidCommission = affiliates.reduce(
      (sum, a) => sum + a.unpaidCommission,
      0,
    );

    return {
      totalAffiliates,
      activeAffiliates,
      totalReferrals,
      totalPaidReferrals,
      conversionRate:
        totalReferrals > 0
          ? Math.round((totalPaidReferrals / totalReferrals) * 100)
          : 0,
      totalRevenue,
      totalCommission,
      unpaidCommission,
    };
  },
});

// ============ MUTATIONS ============

// Créer un affilié (admin)
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    code: v.string(),
    discountPercent: v.number(),
    commissionPercent: v.number(),
  },
  handler: async (ctx, args) => {
    const code = args.code.toLowerCase().trim();

    // Vérifier que le code n'existe pas déjà
    const existing = await ctx.db
      .query("affiliates")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();

    if (existing) {
      throw new Error("Ce code affilié existe déjà");
    }

    const affiliateId = await ctx.db.insert("affiliates", {
      name: args.name,
      email: args.email.toLowerCase(),
      code,
      discountPercent: Math.max(0, Math.min(100, args.discountPercent)),
      commissionPercent: Math.max(0, Math.min(100, args.commissionPercent)),
      isActive: true,
      totalReferrals: 0,
      totalPaidReferrals: 0,
      totalRevenue: 0,
      totalCommission: 0,
      unpaidCommission: 0,
      createdAt: Date.now(),
    });

    return affiliateId;
  },
});

// Mettre à jour un affilié (admin)
export const update = mutation({
  args: {
    affiliateId: v.id("affiliates"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    discountPercent: v.optional(v.number()),
    commissionPercent: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { affiliateId, ...updates } = args;

    const affiliate = await ctx.db.get(affiliateId);
    if (!affiliate) {
      throw new Error("Affilié non trouvé");
    }

    const cleanUpdates: Record<string, unknown> = {};

    if (updates.name !== undefined) cleanUpdates.name = updates.name;
    if (updates.email !== undefined)
      cleanUpdates.email = updates.email.toLowerCase();
    if (updates.discountPercent !== undefined) {
      cleanUpdates.discountPercent = Math.max(
        0,
        Math.min(100, updates.discountPercent),
      );
    }
    if (updates.commissionPercent !== undefined) {
      cleanUpdates.commissionPercent = Math.max(
        0,
        Math.min(100, updates.commissionPercent),
      );
    }
    if (updates.isActive !== undefined)
      cleanUpdates.isActive = updates.isActive;

    await ctx.db.patch(affiliateId, cleanUpdates);
  },
});

// Supprimer un affilié (admin)
export const remove = mutation({
  args: { affiliateId: v.id("affiliates") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.affiliateId);
  },
});

// Marquer une commission comme payée (admin)
export const markCommissionPaid = mutation({
  args: {
    affiliateId: v.id("affiliates"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const affiliate = await ctx.db.get(args.affiliateId);
    if (!affiliate) {
      throw new Error("Affilié non trouvé");
    }

    const newUnpaid = Math.max(0, affiliate.unpaidCommission - args.amount);

    await ctx.db.patch(args.affiliateId, {
      unpaidCommission: newUnpaid,
    });
  },
});

// ============ INTERNAL MUTATIONS (appelées par le système) ============

// Enregistrer un clic sur un lien affilié
export const recordClick = mutation({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const code = args.code.toLowerCase().trim();

    const affiliate = await ctx.db
      .query("affiliates")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();

    if (!affiliate || !affiliate.isActive) {
      return null;
    }

    const referralId = await ctx.db.insert("referrals", {
      affiliateId: affiliate._id,
      status: "clicked",
      createdAt: Date.now(),
    });

    return {
      referralId,
      affiliateId: affiliate._id,
      code: affiliate.code,
      discountPercent: affiliate.discountPercent,
    };
  },
});

// Lier un referral à un user lors de l'inscription
export const linkUserToReferral = internalMutation({
  args: {
    userId: v.id("users"),
    affiliateCode: v.string(),
  },
  handler: async (ctx, args) => {
    const code = args.affiliateCode.toLowerCase().trim();

    const affiliate = await ctx.db
      .query("affiliates")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();

    if (!affiliate) return;

    // Créer le referral
    await ctx.db.insert("referrals", {
      affiliateId: affiliate._id,
      userId: args.userId,
      status: "signed_up",
      createdAt: Date.now(),
    });

    // Mettre à jour le user
    await ctx.db.patch(args.userId, {
      referredBy: affiliate._id,
      referralCode: code,
    });

    // Incrémenter le compteur
    await ctx.db.patch(affiliate._id, {
      totalReferrals: affiliate.totalReferrals + 1,
    });
  },
});

// Convertir un referral en paiement (appelé par le webhook)
export const convertReferral = internalMutation({
  args: {
    userId: v.id("users"),
    paymentId: v.id("payments"),
    originalAmount: v.number(),
    finalAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user || !user.referredBy) return;

    const affiliate = await ctx.db.get(user.referredBy);
    if (!affiliate) return;

    // Trouver le referral existant
    const referral = await ctx.db
      .query("referrals")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    const discountAmount = args.originalAmount - args.finalAmount;
    const commissionAmount = Math.round(
      args.finalAmount * (affiliate.commissionPercent / 100),
    );

    if (referral) {
      // Mettre à jour le referral existant
      await ctx.db.patch(referral._id, {
        paymentId: args.paymentId,
        originalAmount: args.originalAmount,
        discountAmount,
        finalAmount: args.finalAmount,
        commissionAmount,
        status: "paid",
        convertedAt: Date.now(),
      });
    } else {
      // Créer le referral s'il n'existe pas
      await ctx.db.insert("referrals", {
        affiliateId: affiliate._id,
        userId: args.userId,
        paymentId: args.paymentId,
        originalAmount: args.originalAmount,
        discountAmount,
        finalAmount: args.finalAmount,
        commissionAmount,
        status: "paid",
        createdAt: Date.now(),
        convertedAt: Date.now(),
      });
    }

    // Mettre à jour les stats de l'affilié
    await ctx.db.patch(affiliate._id, {
      totalPaidReferrals: affiliate.totalPaidReferrals + 1,
      totalRevenue: affiliate.totalRevenue + args.finalAmount,
      totalCommission: affiliate.totalCommission + commissionAmount,
      unpaidCommission: affiliate.unpaidCommission + commissionAmount,
    });

    console.log(
      `Affiliate ${affiliate.code}: +${commissionAmount} FCFA commission`,
    );
  },
});

// Query interne pour calculer le prix (utilisée par l'action)
export const calculatePriceInternal = internalQuery({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const originalPrice = SUBSCRIPTION.PRICE;
    const code = args.code.toLowerCase().trim();

    const affiliate = await ctx.db
      .query("affiliates")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();

    if (!affiliate || !affiliate.isActive) {
      return {
        originalPrice,
        discountPercent: 0,
        discountAmount: 0,
        finalPrice: originalPrice,
        affiliateCode: null,
        affiliateId: null,
      };
    }

    const discountAmount = Math.round(
      originalPrice * (affiliate.discountPercent / 100),
    );
    const finalPrice = originalPrice - discountAmount;

    return {
      originalPrice,
      discountPercent: affiliate.discountPercent,
      discountAmount,
      finalPrice,
      affiliateCode: affiliate.code,
      affiliateId: affiliate._id,
    };
  },
});

// Lier un utilisateur à un affilié
export const linkUserToAffiliate = internalMutation({
  args: {
    userId: v.id("users"),
    affiliateCode: v.string(),
  },
  handler: async (ctx, args) => {
    const code = args.affiliateCode.toLowerCase().trim();

    const affiliate = await ctx.db
      .query("affiliates")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();

    if (!affiliate) return;

    // Vérifier si l'utilisateur n'est pas déjà lié
    const user = await ctx.db.get(args.userId);
    if (user?.referredBy) return;

    // Créer le referral
    const existingReferral = await ctx.db
      .query("referrals")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!existingReferral) {
      await ctx.db.insert("referrals", {
        affiliateId: affiliate._id,
        userId: args.userId,
        status: "signed_up",
        createdAt: Date.now(),
      });

      // Incrémenter le compteur
      await ctx.db.patch(affiliate._id, {
        totalReferrals: affiliate.totalReferrals + 1,
      });
    }

    // Mettre à jour le user
    await ctx.db.patch(args.userId, {
      referredBy: affiliate._id,
      referralCode: code,
    });
  },
});
