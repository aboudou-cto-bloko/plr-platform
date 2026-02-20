// convex/credits.ts
import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { CREDITS } from "./constants";

// ============================================
// QUERIES
// ============================================

// Récupérer les crédits de l'utilisateur courant
export const getUserCredits = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    // Les abonnés ont des crédits illimités
    if (user.subscriptionStatus === "active") {
      return {
        credits: Infinity,
        isUnlimited: true,
        resetsAt: null,
        totalUsed: user.totalCreditsUsed || 0,
      };
    }

    // Vérifier si les crédits doivent être réinitialisés
    const now = Date.now();
    const shouldReset = !user.creditsResetAt || user.creditsResetAt <= now;

    if (shouldReset) {
      // Les crédits seront réinitialisés lors du prochain téléchargement
      // ou par le cron job
      return {
        credits: user.credits ?? CREDITS.FREE_MONTHLY_CREDITS,
        isUnlimited: false,
        resetsAt: user.creditsResetAt || getNextResetDate(),
        needsReset: true,
        totalUsed: user.totalCreditsUsed || 0,
      };
    }

    return {
      credits: user.credits ?? CREDITS.FREE_MONTHLY_CREDITS,
      isUnlimited: false,
      resetsAt: user.creditsResetAt,
      needsReset: false,
      totalUsed: user.totalCreditsUsed || 0,
    };
  },
});

// Vérifier si l'utilisateur peut télécharger un produit
export const canDownload = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { canDownload: false, reason: "not_authenticated" };

    const user = await ctx.db.get(userId);
    if (!user) return { canDownload: false, reason: "user_not_found" };

    // Compte verrouillé
    if (user.isLocked) {
      return { canDownload: false, reason: "account_locked" };
    }

    // Abonnés = illimité
    if (user.subscriptionStatus === "active") {
      return { canDownload: true, reason: "subscribed", creditsRequired: 0 };
    }

    // Récupérer le produit
    const product = await ctx.db.get(args.productId);
    if (!product) return { canDownload: false, reason: "product_not_found" };

    const creditCost = product.creditCost || CREDITS.DEFAULT_PRODUCT_COST;

    // Vérifier et réinitialiser les crédits si nécessaire
    let currentCredits = user.credits ?? CREDITS.FREE_MONTHLY_CREDITS;
    const now = Date.now();

    if (!user.creditsResetAt || user.creditsResetAt <= now) {
      // Les crédits auraient dû être réinitialisés
      currentCredits = CREDITS.FREE_MONTHLY_CREDITS;
    }

    if (currentCredits < creditCost) {
      return {
        canDownload: false,
        reason: "insufficient_credits",
        creditsRequired: creditCost,
        creditsAvailable: currentCredits,
      };
    }

    return {
      canDownload: true,
      reason: "has_credits",
      creditsRequired: creditCost,
      creditsAvailable: currentCredits,
      creditsAfter: currentCredits - creditCost,
    };
  },
});

// ============================================
// MUTATIONS
// ============================================

// Déduire les crédits après un téléchargement
export const deductCredits = internalMutation({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
    creditCost: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return;

    // Ne pas déduire pour les abonnés
    if (user.subscriptionStatus === "active") {
      return;
    }

    const now = Date.now();
    let currentCredits = user.credits ?? CREDITS.FREE_MONTHLY_CREDITS;
    let creditsResetAt = user.creditsResetAt;

    // Réinitialiser si nécessaire
    if (!creditsResetAt || creditsResetAt <= now) {
      currentCredits = CREDITS.FREE_MONTHLY_CREDITS;
      creditsResetAt = getNextResetDate();
    }

    // Déduire les crédits
    const newCredits = Math.max(0, currentCredits - args.creditCost);
    const totalUsed = (user.totalCreditsUsed || 0) + args.creditCost;

    await ctx.db.patch(args.userId, {
      credits: newCredits,
      creditsResetAt,
      totalCreditsUsed: totalUsed,
    });

    console.log(
      `Credits deducted: ${args.creditCost} for user ${args.userId}. Remaining: ${newCredits}`,
    );
  },
});

// Réinitialiser manuellement les crédits (admin)
export const resetUserCredits = mutation({
  args: {
    userId: v.id("users"),
    credits: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Vérifier admin
    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new Error("Non authentifié");

    const admin = await ctx.db.get(adminId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Non autorisé");
    }

    const creditsToSet = args.credits ?? CREDITS.FREE_MONTHLY_CREDITS;

    await ctx.db.patch(args.userId, {
      credits: creditsToSet,
      creditsResetAt: getNextResetDate(),
    });

    // Log audit
    await ctx.db.insert("auditLogs", {
      userId: adminId,
      action: "credits_reset",
      details: `Reset credits to ${creditsToSet} for user`,
      metadata: { targetUserId: args.userId, credits: creditsToSet },
      createdAt: Date.now(),
    });
  },
});

// Initialiser les crédits pour un nouvel utilisateur
export const initializeCredits = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      credits: CREDITS.FREE_MONTHLY_CREDITS,
      creditsResetAt: getNextResetDate(),
      totalCreditsUsed: 0,
    });
  },
});

/**
 * Reset les crédits de tous les utilisateurs gratuits
 * Appelé par le cron job le 1er de chaque mois
 */
export const resetAllCredits = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Récupérer tous les utilisateurs non-abonnés
    const users = await ctx.db
      .query("users")
      .filter((q) =>
        q.or(
          q.eq(q.field("subscriptionStatus"), "none"),
          q.eq(q.field("subscriptionStatus"), "expired"),
          q.eq(q.field("subscriptionStatus"), "cancelled"),
        ),
      )
      .collect();

    const nextResetDate = getNextResetDate();
    let resetCount = 0;

    for (const user of users) {
      await ctx.db.patch(user._id, {
        credits: CREDITS.FREE_MONTHLY_CREDITS,
        creditsResetAt: nextResetDate,
      });
      resetCount++;
    }

    console.log(
      `[Cron] Credits reset for ${resetCount} users. Next reset: ${new Date(nextResetDate).toISOString()}`,
    );

    return { resetCount };
  },
});

function getNextResetDate(): number {
  const now = new Date();
  const nextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    CREDITS.RESET_DAY,
  );
  nextMonth.setHours(0, 0, 0, 0);
  return nextMonth.getTime();
}
