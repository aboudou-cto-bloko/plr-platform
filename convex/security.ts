// convex/security.ts
import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { Id } from "./_generated/dataModel";

const DEVICE_THRESHOLD_24H = 3;
const COUNTRY_THRESHOLD_7D = 5;

// Check for suspicious activity after each download
export const checkSuspiciousActivity = internalMutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const last24h = now - 24 * 60 * 60 * 1000;
    const last7d = now - 7 * 24 * 60 * 60 * 1000;

    // Get recent downloads
    const recentDownloads = await ctx.db
      .query("downloads")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.gte(q.field("downloadedAt"), last7d))
      .collect();

    // Check devices in last 24h
    const downloads24h = recentDownloads.filter(
      (d) => d.downloadedAt >= last24h,
    );
    const uniqueDevices24h = new Set(
      downloads24h
        .filter((d) => d.deviceFingerprint)
        .map((d) => d.deviceFingerprint),
    );

    if (uniqueDevices24h.size >= DEVICE_THRESHOLD_24H) {
      // Check if alert already exists
      const existingAlert = await ctx.db
        .query("securityAlerts")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .filter((q) =>
          q.and(
            q.eq(q.field("type"), "multiple_devices"),
            q.eq(q.field("isResolved"), false),
          ),
        )
        .first();

      if (!existingAlert) {
        await ctx.db.insert("securityAlerts", {
          userId: args.userId,
          type: "multiple_devices",
          severity: "medium",
          details: `${uniqueDevices24h.size} appareils différents détectés en 24h`,
          metadata: {
            devices: Array.from(uniqueDevices24h),
            downloadCount: downloads24h.length,
          },
          isResolved: false,
          createdAt: now,
        });
      }
    }

    // Check countries in last 7 days
    const uniqueCountries7d = new Set(
      recentDownloads.filter((d) => d.ipCountry).map((d) => d.ipCountry),
    );

    if (uniqueCountries7d.size >= COUNTRY_THRESHOLD_7D) {
      const existingAlert = await ctx.db
        .query("securityAlerts")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .filter((q) =>
          q.and(
            q.eq(q.field("type"), "multiple_countries"),
            q.eq(q.field("isResolved"), false),
          ),
        )
        .first();

      if (!existingAlert) {
        await ctx.db.insert("securityAlerts", {
          userId: args.userId,
          type: "multiple_countries",
          severity: "high",
          details: `${uniqueCountries7d.size} pays différents détectés en 7 jours`,
          metadata: {
            countries: Array.from(uniqueCountries7d),
          },
          isResolved: false,
          createdAt: now,
        });

        // Auto-lock if too many countries
        if (uniqueCountries7d.size >= 7) {
          await ctx.db.patch(args.userId, {
            isLocked: true,
            lockReason: "Activité suspecte: connexions depuis de nombreux pays",
            lockedAt: now,
          });

          await ctx.db.insert("securityAlerts", {
            userId: args.userId,
            type: "account_locked",
            severity: "high",
            details: "Compte verrouillé automatiquement pour activité suspecte",
            isResolved: false,
            createdAt: now,
          });
        }
      }
    }
  },
});

// Log audit event
export const logAudit = internalMutation({
  args: {
    userId: v.id("users"),
    action: v.string(),
    details: v.optional(v.string()),
    metadata: v.optional(v.any()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("auditLogs", {
      userId: args.userId,
      action: args.action,
      details: args.details,
      metadata: args.metadata,
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
      createdAt: Date.now(),
    });
  },
});
