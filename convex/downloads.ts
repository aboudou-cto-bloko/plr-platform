// convex/downloads.ts
import { v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { RATE_LIMIT, CREDITS } from "./constants";
import { internal } from "./_generated/api";
import { Id, Doc } from "./_generated/dataModel";

async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  return await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", identity.email!))
    .unique();
}

// Helper pour calculer la date du prochain reset
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

// Helper pour vérifier et réinitialiser les crédits si nécessaire
async function checkAndResetCredits(
  ctx: MutationCtx,
  userId: Id<"users">,
  user: Doc<"users">,
): Promise<number> {
  const now = Date.now();
  let currentCredits = user.credits ?? CREDITS.FREE_MONTHLY_CREDITS;

  // Si la date de reset est passée, réinitialiser
  if (!user.creditsResetAt || user.creditsResetAt <= now) {
    currentCredits = CREDITS.FREE_MONTHLY_CREDITS;
    await ctx.db.patch(userId, {
      credits: currentCredits,
      creditsResetAt: getNextResetDate(),
    });
  }

  return currentCredits;
}

export const recordDownload = mutation({
  args: {
    productId: v.id("products"),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    ipCountry: v.optional(v.string()),
    deviceFingerprint: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Utilisateur non trouvé");

    // Check if account is locked
    if (user.isLocked) {
      throw new Error("Votre compte est temporairement verrouillé");
    }

    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Produit non trouvé");

    const isSubscribed = user.subscriptionStatus === "active";
    const creditCost = product.creditCost ?? CREDITS.DEFAULT_PRODUCT_COST;

    // Pour les utilisateurs gratuits: vérifier les crédits
    if (!isSubscribed) {
      const currentCredits = await checkAndResetCredits(ctx, userId, user);

      if (currentCredits < creditCost) {
        throw new Error(
          `Crédits insuffisants. Ce produit coûte ${creditCost} crédit(s), vous en avez ${currentCredits}. Passez Premium pour un accès illimité.`,
        );
      }

      // Déduire les crédits
      await ctx.db.patch(userId, {
        credits: currentCredits - creditCost,
        totalCreditsUsed: (user.totalCreditsUsed || 0) + creditCost,
      });
    }

    // Rate limiting (pour tous les utilisateurs)
    const windowStart = Date.now() - RATE_LIMIT.WINDOW_MS;
    const recentDownloads = await ctx.db
      .query("downloads")
      .withIndex("by_user_time", (q) =>
        q.eq("userId", userId).gte("downloadedAt", windowStart),
      )
      .collect();

    if (recentDownloads.length >= RATE_LIMIT.MAX_DOWNLOADS) {
      throw new Error(
        `Limite de téléchargements atteinte (${RATE_LIMIT.MAX_DOWNLOADS}/jour)`,
      );
    }

    // Record download
    await ctx.db.insert("downloads", {
      userId,
      productId: args.productId,
      downloadedAt: Date.now(),
      userAgent: args.userAgent,
      ipAddress: args.ipAddress,
      ipCountry: args.ipCountry,
      deviceFingerprint: args.deviceFingerprint,
    });

    // Update product download count
    await ctx.db.patch(args.productId, {
      downloadCount: (product.downloadCount || 0) + 1,
    });

    // Check for suspicious activity (async)
    await ctx.scheduler.runAfter(0, internal.security.checkSuspiciousActivity, {
      userId,
    });

    return {
      success: true,
      creditsUsed: isSubscribed ? 0 : creditCost,
    };
  },
});

export const getDownloadUrl = mutation({
  args: {
    productId: v.id("products"),
    userAgent: v.optional(v.string()),
    deviceFingerprint: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Utilisateur non trouvé");

    // Vérifier si le compte est verrouillé
    if (user.isLocked) {
      throw new Error(
        "Votre compte est temporairement verrouillé. Contactez le support.",
      );
    }

    // Vérifier le produit
    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Produit non trouvé");
    }
    if (!product.zipFileId) {
      throw new Error("Fichier du produit non disponible");
    }
    if (product.status !== "published") {
      throw new Error("Ce produit n'est pas disponible");
    }

    const isSubscribed = user.subscriptionStatus === "active";
    const creditCost = product.creditCost ?? CREDITS.DEFAULT_PRODUCT_COST;

    // Pour les utilisateurs gratuits: vérifier et déduire les crédits
    if (!isSubscribed) {
      const currentCredits = await checkAndResetCredits(ctx, userId, user);

      if (currentCredits < creditCost) {
        throw new Error(
          `Crédits insuffisants. Ce produit coûte ${creditCost} crédit(s), vous en avez ${currentCredits}. Passez Premium pour un accès illimité.`,
        );
      }

      // Déduire les crédits
      await ctx.db.patch(userId, {
        credits: currentCredits - creditCost,
        totalCreditsUsed: (user.totalCreditsUsed || 0) + creditCost,
      });
    }

    // Vérifier le rate limit (pour tous)
    const windowStart = Date.now() - RATE_LIMIT.WINDOW_MS;
    const recentDownloads = await ctx.db
      .query("downloads")
      .withIndex("by_user_time", (q) =>
        q.eq("userId", userId).gte("downloadedAt", windowStart),
      )
      .collect();

    if (recentDownloads.length >= RATE_LIMIT.MAX_DOWNLOADS) {
      throw new Error(
        `Limite de téléchargements atteinte (${RATE_LIMIT.MAX_DOWNLOADS}/jour). Réessayez plus tard.`,
      );
    }

    // Enregistrer le téléchargement
    await ctx.db.insert("downloads", {
      userId,
      productId: args.productId,
      downloadedAt: Date.now(),
      userAgent: args.userAgent,
      deviceFingerprint: args.deviceFingerprint,
    });

    // Mettre à jour le compteur de téléchargements du produit
    await ctx.db.patch(args.productId, {
      downloadCount: (product.downloadCount || 0) + 1,
    });

    // Vérifier les activités suspectes (async)
    await ctx.scheduler.runAfter(0, internal.security.checkSuspiciousActivity, {
      userId,
    });

    // Générer l'URL signée temporaire
    const url = await ctx.storage.getUrl(product.zipFileId);

    if (!url) {
      throw new Error("Impossible de générer le lien de téléchargement");
    }

    // Récupérer les crédits restants pour l'affichage
    const updatedUser = await ctx.db.get(userId);
    const creditsRemaining = isSubscribed
      ? null
      : (updatedUser?.credits ?? CREDITS.FREE_MONTHLY_CREDITS);

    return {
      url,
      fileName: `${product.title}.zip`,
      creditsUsed: isSubscribed ? 0 : creditCost,
      creditsRemaining,
      isUnlimited: isSubscribed,
    };
  },
});

// Query pour vérifier si l'utilisateur peut télécharger (preview avant action)
export const canDownloadProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { canDownload: false, reason: "not_authenticated" };
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return { canDownload: false, reason: "user_not_found" };
    }

    if (user.isLocked) {
      return { canDownload: false, reason: "account_locked" };
    }

    const product = await ctx.db.get(args.productId);
    if (!product) {
      return { canDownload: false, reason: "product_not_found" };
    }

    const isSubscribed = user.subscriptionStatus === "active";
    const creditCost = product.creditCost ?? CREDITS.DEFAULT_PRODUCT_COST;

    // Abonnés = toujours OK
    if (isSubscribed) {
      return {
        canDownload: true,
        reason: "subscribed",
        isUnlimited: true,
        creditCost: 0,
      };
    }

    // Utilisateurs gratuits: vérifier les crédits
    const now = Date.now();
    let currentCredits = user.credits ?? CREDITS.FREE_MONTHLY_CREDITS;

    // Reset si nécessaire (juste pour l'affichage, pas de mutation ici)
    if (!user.creditsResetAt || user.creditsResetAt <= now) {
      currentCredits = CREDITS.FREE_MONTHLY_CREDITS;
    }

    if (currentCredits < creditCost) {
      return {
        canDownload: false,
        reason: "insufficient_credits",
        creditCost,
        creditsAvailable: currentCredits,
        creditsNeeded: creditCost - currentCredits,
      };
    }

    return {
      canDownload: true,
      reason: "has_credits",
      isUnlimited: false,
      creditCost,
      creditsAvailable: currentCredits,
      creditsAfter: currentCredits - creditCost,
    };
  },
});

// Query pour obtenir les crédits de l'utilisateur
export const getUserCredits = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    const isSubscribed = user.subscriptionStatus === "active";

    // Abonnés = illimité
    if (isSubscribed) {
      return {
        credits: null,
        isUnlimited: true,
        resetsAt: null,
        totalUsed: user.totalCreditsUsed || 0,
      };
    }

    // Utilisateurs gratuits
    const now = Date.now();
    let currentCredits = user.credits ?? CREDITS.FREE_MONTHLY_CREDITS;
    let resetsAt = user.creditsResetAt;

    // Vérifier si les crédits devraient être réinitialisés
    if (!resetsAt || resetsAt <= now) {
      currentCredits = CREDITS.FREE_MONTHLY_CREDITS;
      resetsAt = getNextResetDate();
    }

    return {
      credits: currentCredits,
      maxCredits: CREDITS.FREE_MONTHLY_CREDITS,
      isUnlimited: false,
      resetsAt,
      totalUsed: user.totalCreditsUsed || 0,
    };
  },
});

export const getProductDownloadCount = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args): Promise<number> => {
    const downloads = await ctx.db
      .query("downloads")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();

    return downloads.length;
  },
});

export const getUserDownloads = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const downloads = await ctx.db
      .query("downloads")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return Promise.all(
      downloads.map(async (download) => {
        const product = await ctx.db.get(download.productId);
        return {
          ...download,
          product: product
            ? {
                ...product,
                thumbnailUrl: product.thumbnailId
                  ? await ctx.storage.getUrl(product.thumbnailId)
                  : null,
              }
            : null,
        };
      }),
    );
  },
});

export const hasUserDownloaded = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args): Promise<boolean> => {
    const user = await getCurrentUser(ctx);
    if (!user) return false;

    const download = await ctx.db
      .query("downloads")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .first();

    return download !== null;
  },
});

export const checkRateLimit = query({
  args: {},
  handler: async (
    ctx,
  ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return { allowed: false, remaining: 0, resetAt: Date.now() };
    }

    const windowStart = Date.now() - RATE_LIMIT.WINDOW_MS;

    const recentDownloads = await ctx.db
      .query("downloads")
      .withIndex("by_user_time", (q) =>
        q.eq("userId", user._id).gte("downloadedAt", windowStart),
      )
      .collect();

    const remaining = Math.max(
      0,
      RATE_LIMIT.MAX_DOWNLOADS - recentDownloads.length,
    );
    const allowed = remaining > 0;

    let resetAt = Date.now() + RATE_LIMIT.WINDOW_MS;
    if (recentDownloads.length > 0 && !allowed) {
      const oldestInWindow = recentDownloads.reduce((oldest, d) =>
        d.downloadedAt < oldest.downloadedAt ? d : oldest,
      );
      resetAt = oldestInWindow.downloadedAt + RATE_LIMIT.WINDOW_MS;
    }

    return { allowed, remaining, resetAt };
  },
});

export const getUserDownloadHistory = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const downloads = await ctx.db
      .query("downloads")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);

    return Promise.all(
      downloads.map(async (download) => {
        const product = await ctx.db.get(download.productId);
        return {
          ...download,
          product: product
            ? {
                title: product.title,
                category: product.category,
                thumbnailId: product.thumbnailId,
              }
            : null,
        };
      }),
    );
  },
});

export const getUserDownloadStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    const now = Date.now();
    const hourAgo = now - 60 * 60 * 1000;
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const dayStart = new Date().setHours(0, 0, 0, 0);

    const allDownloads = await ctx.db
      .query("downloads")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const recentDownloads = allDownloads.filter(
      (d) => d.downloadedAt >= hourAgo,
    );
    const monthDownloads = allDownloads.filter(
      (d) => d.downloadedAt >= monthStart.getTime(),
    );
    const todayDownloads = allDownloads.filter(
      (d) => d.downloadedAt >= dayStart,
    );

    const isSubscribed = user.subscriptionStatus === "active";

    return {
      total: allDownloads.length,
      thisMonth: monthDownloads.length,
      todayCount: todayDownloads.length,
      remaining: RATE_LIMIT.MAX_DOWNLOADS - recentDownloads.length,
      // Infos crédits
      credits: isSubscribed
        ? null
        : (user.credits ?? CREDITS.FREE_MONTHLY_CREDITS),
      maxCredits: CREDITS.FREE_MONTHLY_CREDITS,
      isUnlimited: isSubscribed,
      creditsResetAt: user.creditsResetAt,
    };
  },
});
