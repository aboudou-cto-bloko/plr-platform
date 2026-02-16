import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { RATE_LIMIT } from "./constants";
import { internal } from "./_generated/api";

async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  return await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", identity.email!))
    .unique();
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

    // Check subscription
    if (user.subscriptionStatus !== "active") {
      throw new Error("Abonnement requis pour télécharger");
    }

    // Rate limiting
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
    const product = await ctx.db.get(args.productId);
    if (product) {
      await ctx.db.patch(args.productId, {
        downloadCount: (product.downloadCount || 0) + 1,
      });
    }

    // Check for suspicious activity (async)
    await ctx.scheduler.runAfter(0, internal.security.checkSuspiciousActivity, {
      userId,
    });

    return { success: true };
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

    // Find oldest download in window to calculate reset time
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

    // Vérifier l'abonnement
    if (user.subscriptionStatus !== "active") {
      if (user.subscriptionStatus === "expired") {
        throw new Error(
          "Votre abonnement a expiré. Renouvelez pour continuer à télécharger.",
        );
      }
      throw new Error("Un abonnement actif est requis pour télécharger.");
    }

    // Vérifier le rate limit
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

    return {
      url,
      fileName: `${product.title}.zip`,
    };
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

    return {
      total: allDownloads.length,
      thisMonth: monthDownloads.length,
      todayCount: todayDownloads.length,
      remaining: RATE_LIMIT.MAX_DOWNLOADS - recentDownloads.length,
    };
  },
});
