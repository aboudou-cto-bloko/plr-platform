// convex/admin.ts
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { SUBSCRIPTION } from "./constants";

// ============================================
// AUTH HELPERS
// ============================================

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);

  if (!userId) {
    throw new Error("Unauthorized: Not authenticated");
  }

  const user = await ctx.db.get(userId);

  if (!user) {
    throw new Error("Unauthorized: User not found");
  }

  if (user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }

  return user;
}

export const isAdmin = query({
  args: {},
  handler: async (ctx): Promise<boolean> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const user = await ctx.db.get(userId);
    return user?.role === "admin";
  },
});

// ============================================
// STATS
// ============================================

interface AdminStats {
  totalProducts: number;
  publishedProducts: number;
  totalUsers: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  totalDownloads: number;
  downloadsThisMonth: number;
  monthlyRevenue: number;
  paymentsThisMonth: number;
  mrr: number;
  pendingAlerts: number;
}

export const getStats = query({
  args: {},
  handler: async (ctx): Promise<AdminStats> => {
    await requireAdmin(ctx);

    const now = Date.now();
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthStartMs = monthStart.getTime();

    const [products, users, subscriptions, downloads, payments, alerts] =
      await Promise.all([
        ctx.db.query("products").collect(),
        ctx.db.query("users").collect(),
        ctx.db.query("subscriptions").collect(),
        ctx.db.query("downloads").collect(),
        ctx.db.query("payments").collect(),
        ctx.db.query("securityAlerts").collect(),
      ]);

    const activeSubscriptions = subscriptions.filter(
      (s) => s.status === "active",
    );
    const expiredSubscriptions = subscriptions.filter(
      (s) => s.status === "expired",
    );
    const publishedProducts = products.filter((p) => p.status === "published");
    const downloadsThisMonth = downloads.filter(
      (d) => d.downloadedAt >= monthStartMs,
    );
    const paymentsThisMonth = payments.filter(
      (p) => p.status === "success" && p.createdAt >= monthStartMs,
    );
    const pendingAlerts = alerts.filter((a) => !a.isResolved);

    const monthlyRevenue = paymentsThisMonth.reduce(
      (sum, p) => sum + p.amount,
      0,
    );

    return {
      totalProducts: products.length,
      publishedProducts: publishedProducts.length,
      totalUsers: users.filter((u) => u.role !== "admin").length,
      activeSubscriptions: activeSubscriptions.length,
      expiredSubscriptions: expiredSubscriptions.length,
      totalDownloads: downloads.length,
      downloadsThisMonth: downloadsThisMonth.length,
      monthlyRevenue,
      paymentsThisMonth: paymentsThisMonth.length,
      mrr: activeSubscriptions.length * SUBSCRIPTION.PRICE,
      pendingAlerts: pendingAlerts.length,
    };
  },
});

// ============================================
// FILE UPLOAD
// ============================================

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx): Promise<string> => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/webp",
  "video/mp4",
  "application/zip",
  "application/x-zip-compressed",
];

const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

export const validateUpload = mutation({
  args: {
    fileName: v.string(),
    fileSize: v.number(),
    fileType: v.string(),
    uploadType: v.union(v.literal("thumbnail"), v.literal("product")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(args.fileType)) {
      throw new Error(`Type de fichier non autorisé: ${args.fileType}`);
    }

    // Check size
    if (args.uploadType === "thumbnail" && args.fileSize > MAX_THUMBNAIL_SIZE) {
      throw new Error("La miniature ne doit pas dépasser 2MB");
    }

    if (args.uploadType === "product" && args.fileSize > MAX_FILE_SIZE) {
      throw new Error("Le fichier ne doit pas dépasser 200MB");
    }

    return { valid: true };
  },
});

// ============================================
// PRODUCTS CRUD
// ============================================

export const createProduct = mutation({
  args: {
    title: v.string(),
    category: v.union(
      v.literal("ebook"),
      v.literal("template"),
      v.literal("formation"),
      v.literal("kit"),
      v.literal("script"),
    ),
    description: v.string(),
    thumbnailId: v.optional(v.id("_storage")),
    zipFileId: v.id("_storage"),
    fileSize: v.optional(v.number()),
    isNouveau: v.boolean(),
    status: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);

    const productId = await ctx.db.insert("products", {
      title: args.title,
      category: args.category,
      description: args.description,
      thumbnailId: args.thumbnailId,
      zipFileId: args.zipFileId,
      fileSize: args.fileSize,
      isNouveau: args.isNouveau,
      status: args.status,
      downloadCount: 0,
      publishedAt: args.status === "published" ? Date.now() : undefined,
    });

    // Log audit
    await ctx.db.insert("auditLogs", {
      userId: admin._id,
      action: "product_created",
      details: `Created product: ${args.title}`,
      metadata: { productId, category: args.category },
      createdAt: Date.now(),
    });

    return productId;
  },
});

export const updateProduct = mutation({
  args: {
    productId: v.id("products"),
    title: v.optional(v.string()),
    category: v.optional(
      v.union(
        v.literal("ebook"),
        v.literal("template"),
        v.literal("formation"),
        v.literal("kit"),
        v.literal("script"),
      ),
    ),
    description: v.optional(v.string()),
    thumbnailId: v.optional(v.id("_storage")),
    zipFileId: v.optional(v.id("_storage")),
    fileSize: v.optional(v.number()),
    isNouveau: v.optional(v.boolean()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const { productId, ...updates } = args;

    const existing = await ctx.db.get(productId);
    if (!existing) throw new Error("Product not found");

    const filteredUpdates: Partial<Doc<"products">> = {};

    if (updates.title !== undefined) filteredUpdates.title = updates.title;
    if (updates.category !== undefined)
      filteredUpdates.category = updates.category;
    if (updates.description !== undefined)
      filteredUpdates.description = updates.description;
    if (updates.thumbnailId !== undefined)
      filteredUpdates.thumbnailId = updates.thumbnailId;
    if (updates.zipFileId !== undefined)
      filteredUpdates.zipFileId = updates.zipFileId;
    if (updates.fileSize !== undefined)
      filteredUpdates.fileSize = updates.fileSize;
    if (updates.isNouveau !== undefined)
      filteredUpdates.isNouveau = updates.isNouveau;
    if (updates.status !== undefined) filteredUpdates.status = updates.status;

    // Set publishedAt if publishing for the first time
    if (updates.status === "published" && !existing.publishedAt) {
      filteredUpdates.publishedAt = Date.now();
    }

    await ctx.db.patch(productId, filteredUpdates);

    // Log audit
    await ctx.db.insert("auditLogs", {
      userId: admin._id,
      action: "product_updated",
      details: `Updated product: ${existing.title}`,
      metadata: { productId, updates: Object.keys(filteredUpdates) },
      createdAt: Date.now(),
    });

    return productId;
  },
});

export const deleteProduct = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args): Promise<void> => {
    const admin = await requireAdmin(ctx);

    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Product not found");

    // Delete associated files
    if (product.thumbnailId) {
      await ctx.storage.delete(product.thumbnailId);
    }
    if (product.zipFileId) {
      await ctx.storage.delete(product.zipFileId);
    }

    await ctx.db.delete(args.productId);

    // Log audit
    await ctx.db.insert("auditLogs", {
      userId: admin._id,
      action: "product_deleted",
      details: `Deleted product: ${product.title}`,
      metadata: { productId: args.productId, title: product.title },
      createdAt: Date.now(),
    });
  },
});

export const listAllProducts = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const products = await ctx.db.query("products").order("desc").collect();

    return Promise.all(
      products.map(async (product) => ({
        ...product,
        thumbnailUrl: product.thumbnailId
          ? await ctx.storage.getUrl(product.thumbnailId)
          : null,
      })),
    );
  },
});

export const getProductForEdit = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const product = await ctx.db.get(args.productId);
    if (!product) return null;

    return {
      ...product,
      thumbnailUrl: product.thumbnailId
        ? await ctx.storage.getUrl(product.thumbnailId)
        : null,
    };
  },
});

// Bulk operations
export const bulkDeleteProducts = mutation({
  args: { productIds: v.array(v.id("products")) },
  handler: async (ctx, args): Promise<{ deleted: number }> => {
    const admin = await requireAdmin(ctx);
    let deleted = 0;

    for (const productId of args.productIds) {
      const product = await ctx.db.get(productId);
      if (product) {
        if (product.thumbnailId) {
          await ctx.storage.delete(product.thumbnailId);
        }
        if (product.zipFileId) {
          await ctx.storage.delete(product.zipFileId);
        }
        await ctx.db.delete(productId);
        deleted++;
      }
    }

    await ctx.db.insert("auditLogs", {
      userId: admin._id,
      action: "bulk_product_delete",
      details: `Deleted ${deleted} products`,
      metadata: { productIds: args.productIds },
      createdAt: Date.now(),
    });

    return { deleted };
  },
});

export const bulkUpdateStatus = mutation({
  args: {
    productIds: v.array(v.id("products")),
    status: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, args): Promise<{ updated: number }> => {
    await requireAdmin(ctx);
    let updated = 0;

    for (const productId of args.productIds) {
      const existing = await ctx.db.get(productId);
      if (existing) {
        const updates: Partial<Doc<"products">> = { status: args.status };
        if (args.status === "published" && !existing.publishedAt) {
          updates.publishedAt = Date.now();
        }
        await ctx.db.patch(productId, updates);
        updated++;
      }
    }

    return { updated };
  },
});

export const bulkUpdateNouveau = mutation({
  args: {
    productIds: v.array(v.id("products")),
    isNouveau: v.boolean(),
  },
  handler: async (ctx, args): Promise<{ updated: number }> => {
    await requireAdmin(ctx);
    let updated = 0;

    for (const productId of args.productIds) {
      await ctx.db.patch(productId, { isNouveau: args.isNouveau });
      updated++;
    }

    return { updated };
  },
});

// ============================================
// USERS MANAGEMENT
// ============================================

export const listUsers = query({
  args: {
    filter: v.optional(
      v.union(
        v.literal("all"),
        v.literal("active"),
        v.literal("expired"),
        v.literal("locked"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    let users = await ctx.db.query("users").order("desc").collect();

    // Filter out admins
    users = users.filter((u) => u.role !== "admin");

    // Apply filter
    if (args.filter === "active") {
      users = users.filter((u) => u.subscriptionStatus === "active");
    } else if (args.filter === "expired") {
      users = users.filter((u) => u.subscriptionStatus === "expired");
    } else if (args.filter === "locked") {
      users = users.filter((u) => u.isLocked === true);
    }

    return Promise.all(
      users.map(async (user) => {
        const subscription = await ctx.db
          .query("subscriptions")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .order("desc")
          .first();

        const downloads = await ctx.db
          .query("downloads")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .collect();

        const alerts = await ctx.db
          .query("securityAlerts")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .filter((q) => q.eq(q.field("isResolved"), false))
          .collect();

        return {
          ...user,
          subscription,
          downloadCount: downloads.length,
          pendingAlerts: alerts.length,
        };
      }),
    );
  },
});

export const getUserDetails = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const [subscription, downloads, payments, alerts, auditLogs] =
      await Promise.all([
        ctx.db
          .query("subscriptions")
          .withIndex("by_user", (q) => q.eq("userId", args.userId))
          .order("desc")
          .first(),
        ctx.db
          .query("downloads")
          .withIndex("by_user", (q) => q.eq("userId", args.userId))
          .order("desc")
          .take(50),
        ctx.db
          .query("payments")
          .withIndex("by_user", (q) => q.eq("userId", args.userId))
          .order("desc")
          .take(20),
        ctx.db
          .query("securityAlerts")
          .withIndex("by_user", (q) => q.eq("userId", args.userId))
          .order("desc")
          .take(20),
        ctx.db
          .query("auditLogs")
          .withIndex("by_user", (q) => q.eq("userId", args.userId))
          .order("desc")
          .take(50),
      ]);

    // Get product info for downloads
    const downloadsWithProducts = await Promise.all(
      downloads.map(async (d) => {
        const product = await ctx.db.get(d.productId);
        return {
          ...d,
          productTitle: product?.title || "Produit supprimé",
        };
      }),
    );

    // Analyze device usage
    const uniqueDevices = new Set(
      downloads
        .filter((d) => d.deviceFingerprint)
        .map((d) => d.deviceFingerprint),
    );
    const uniqueIPs = new Set(
      downloads.filter((d) => d.ipAddress).map((d) => d.ipAddress),
    );
    const uniqueCountries = new Set(
      downloads.filter((d) => d.ipCountry).map((d) => d.ipCountry),
    );

    return {
      ...user,
      subscription,
      downloads: downloadsWithProducts,
      payments,
      alerts,
      auditLogs,
      deviceStats: {
        uniqueDevices: uniqueDevices.size,
        uniqueIPs: uniqueIPs.size,
        uniqueCountries: Array.from(uniqueCountries),
      },
    };
  },
});

export const lockUser = mutation({
  args: {
    userId: v.id("users"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);

    await ctx.db.patch(args.userId, {
      isLocked: true,
      lockReason: args.reason,
      lockedAt: Date.now(),
    });

    // Create security alert
    await ctx.db.insert("securityAlerts", {
      userId: args.userId,
      type: "account_locked",
      severity: "high",
      details: `Account locked by admin: ${args.reason}`,
      isResolved: false,
      createdAt: Date.now(),
    });

    // Log audit
    await ctx.db.insert("auditLogs", {
      userId: admin._id,
      action: "user_locked",
      details: `Locked user account: ${args.reason}`,
      metadata: { targetUserId: args.userId },
      createdAt: Date.now(),
    });
  },
});

export const unlockUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);

    await ctx.db.patch(args.userId, {
      isLocked: false,
      lockReason: undefined,
      lockedAt: undefined,
    });

    // Resolve lock alert
    const lockAlert = await ctx.db
      .query("securityAlerts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("type"), "account_locked"),
          q.eq(q.field("isResolved"), false),
        ),
      )
      .first();

    if (lockAlert) {
      await ctx.db.patch(lockAlert._id, {
        isResolved: true,
        resolvedAt: Date.now(),
        resolvedBy: admin._id,
      });
    }

    // Log audit
    await ctx.db.insert("auditLogs", {
      userId: admin._id,
      action: "user_unlocked",
      details: "Unlocked user account",
      metadata: { targetUserId: args.userId },
      createdAt: Date.now(),
    });
  },
});

// ============================================
// SECURITY ALERTS
// ============================================

export const listSecurityAlerts = query({
  args: {
    filter: v.optional(
      v.union(v.literal("all"), v.literal("pending"), v.literal("resolved")),
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    let alerts = await ctx.db.query("securityAlerts").order("desc").take(100);

    if (args.filter === "pending") {
      alerts = alerts.filter((a) => !a.isResolved);
    } else if (args.filter === "resolved") {
      alerts = alerts.filter((a) => a.isResolved);
    }

    return Promise.all(
      alerts.map(async (alert) => {
        const user = await ctx.db.get(alert.userId);
        return {
          ...alert,
          userEmail: user?.email || "Unknown",
          userName: user?.name || "Unknown",
        };
      }),
    );
  },
});

export const resolveAlert = mutation({
  args: { alertId: v.id("securityAlerts") },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);

    await ctx.db.patch(args.alertId, {
      isResolved: true,
      resolvedAt: Date.now(),
      resolvedBy: admin._id,
    });

    await ctx.db.insert("auditLogs", {
      userId: admin._id,
      action: "alert_resolved",
      metadata: { alertId: args.alertId },
      createdAt: Date.now(),
    });
  },
});

// ============================================
// AUDIT LOGS
// ============================================

export const listAuditLogs = query({
  args: {
    limit: v.optional(v.number()),
    action: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const query = ctx.db.query("auditLogs").order("desc");

    const logs = await query.take(args.limit || 100);

    let filteredLogs = logs;
    if (args.action) {
      filteredLogs = logs.filter((l) => l.action === args.action);
    }

    return Promise.all(
      filteredLogs.map(async (log) => {
        const user = await ctx.db.get(log.userId);
        return {
          ...log,
          userEmail: user?.email || "System",
        };
      }),
    );
  },
});

// ============================================
// PAYMENTS
// ============================================

export const listPayments = query({
  args: {
    filter: v.optional(
      v.union(
        v.literal("all"),
        v.literal("success"),
        v.literal("pending"),
        v.literal("failed"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    let payments = await ctx.db.query("payments").order("desc").take(100);

    if (args.filter && args.filter !== "all") {
      payments = payments.filter((p) => p.status === args.filter);
    }

    return Promise.all(
      payments.map(async (payment) => {
        const user = await ctx.db.get(payment.userId);
        return {
          ...payment,
          userEmail: user?.email || "Unknown",
          userName: user?.name || "Unknown",
        };
      }),
    );
  },
});
