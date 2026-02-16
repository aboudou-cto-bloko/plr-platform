import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  internalAction,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import {
  SUBSCRIPTION,
  GRACE_PERIOD,
  RENEWAL,
  DEFAULT_PAYMENT_METHODS,
} from "./constants";

// Types
interface SubscriptionWithUser {
  subscription: Doc<"subscriptions">;
  user: Doc<"users">;
}

// Find subscriptions expiring soon (for reminders)
export const getExpiringSubscriptions = internalQuery({
  args: { daysBeforeExpiry: v.number() },
  handler: async (ctx, args): Promise<SubscriptionWithUser[]> => {
    const now = Date.now();
    const targetDate = now + args.daysBeforeExpiry * 24 * 60 * 60 * 1000;
    const dayStart = new Date(targetDate).setHours(0, 0, 0, 0);
    const dayEnd = new Date(targetDate).setHours(23, 59, 59, 999);

    const subscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("by_status_expiry", (q) =>
        q.eq("status", "active").gte("expiresAt", dayStart),
      )
      .filter((q) => q.lte(q.field("expiresAt"), dayEnd))
      .collect();

    const results: SubscriptionWithUser[] = [];

    for (const subscription of subscriptions) {
      const user = await ctx.db.get(subscription.userId);
      if (user) {
        results.push({ subscription, user });
      }
    }

    return results;
  },
});

// Find subscriptions that need renewal today
export const getSubscriptionsToRenew = internalQuery({
  args: {},
  handler: async (ctx): Promise<SubscriptionWithUser[]> => {
    const todayEnd = new Date().setHours(23, 59, 59, 999);

    // Get active subscriptions expiring today or already expired (within grace period)
    const activeExpiring = await ctx.db
      .query("subscriptions")
      .withIndex("by_status_expiry", (q) =>
        q.eq("status", "active").lte("expiresAt", todayEnd),
      )
      .collect();

    // Also get pending_renewal that haven't exceeded max attempts
    const pendingRenewal = await ctx.db
      .query("subscriptions")
      .withIndex("by_status", (q) => q.eq("status", "pending_renewal"))
      .filter((q) => q.lt(q.field("renewalAttempts"), GRACE_PERIOD.DAYS))
      .collect();

    const allSubscriptions = [...activeExpiring, ...pendingRenewal];
    const results: SubscriptionWithUser[] = [];

    for (const subscription of allSubscriptions) {
      const user = await ctx.db.get(subscription.userId);
      if (user && user.email) {
        results.push({ subscription, user });
      }
    }

    return results;
  },
});

// Find expired subscriptions past grace period
export const getExpiredSubscriptions = internalQuery({
  args: {},
  handler: async (ctx): Promise<SubscriptionWithUser[]> => {
    const gracePeriodEnd = Date.now() - GRACE_PERIOD.MS;

    // Subscriptions that are still marked active but expired beyond grace period
    const expiredActive = await ctx.db
      .query("subscriptions")
      .withIndex("by_status_expiry", (q) =>
        q.eq("status", "active").lte("expiresAt", gracePeriodEnd),
      )
      .collect();

    // Pending renewals that exceeded max attempts
    const failedRenewals = await ctx.db
      .query("subscriptions")
      .withIndex("by_status", (q) => q.eq("status", "pending_renewal"))
      .filter((q) =>
        q.and(
          q.gte(q.field("renewalAttempts"), RENEWAL.MAX_ATTEMPTS),
          q.lte(q.field("expiresAt"), gracePeriodEnd),
        ),
      )
      .collect();

    const allExpired = [...expiredActive, ...failedRenewals];
    const results: SubscriptionWithUser[] = [];

    for (const subscription of allExpired) {
      const user = await ctx.db.get(subscription.userId);
      if (user) {
        results.push({ subscription, user });
      }
    }

    return results;
  },
});

// Mark subscription as pending renewal
export const markPendingRenewal = internalMutation({
  args: {
    subscriptionId: v.id("subscriptions"),
    monerooPaymentId: v.string(),
  },
  handler: async (ctx, args): Promise<void> => {
    const subscription = await ctx.db.get(args.subscriptionId);
    if (!subscription) return;

    const currentAttempts = subscription.renewalAttempts ?? 0;

    await ctx.db.patch(args.subscriptionId, {
      status: "pending_renewal",
      renewalAttempts: currentAttempts + 1,
      lastRenewalAttempt: Date.now(),
    });

    // Create payment record
    await ctx.db.insert("payments", {
      userId: subscription.userId,
      subscriptionId: args.subscriptionId,
      monerooPaymentId: args.monerooPaymentId,
      amount: SUBSCRIPTION.PRICE,
      currency: "XOF",
      status: "initiated",
      type: "renewal",
      createdAt: Date.now(),
    });
  },
});

// Extend subscription after successful renewal
export const extendSubscription = internalMutation({
  args: { monerooPaymentId: v.string() },
  handler: async (ctx, args): Promise<void> => {
    // Find payment by moneroo ID
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_moneroo", (q) =>
        q.eq("monerooPaymentId", args.monerooPaymentId),
      )
      .unique();

    if (!payment || !payment.subscriptionId) {
      console.error(
        "Payment or subscription not found for:",
        args.monerooPaymentId,
      );
      return;
    }

    const subscription = await ctx.db.get(payment.subscriptionId);
    if (!subscription) return;

    const now = Date.now();
    // Extend from current expiry or now, whichever is later
    const extendFrom = Math.max(subscription.expiresAt, now);
    const newExpiresAt = extendFrom + SUBSCRIPTION.DURATION_MS;

    // Update subscription
    await ctx.db.patch(subscription._id, {
      status: "active",
      expiresAt: newExpiresAt,
      renewalAttempts: 0,
      lastRenewalAttempt: undefined,
    });

    // Update payment
    await ctx.db.patch(payment._id, {
      status: "success",
      completedAt: now,
    });

    // Update user
    await ctx.db.patch(subscription.userId, {
      subscriptionStatus: "active",
      nextBillingDate: newExpiresAt,
    });

    console.log(
      `Subscription ${subscription._id} extended to ${new Date(newExpiresAt).toISOString()}`,
    );
  },
});

// Expire subscription
export const expireSubscription = internalMutation({
  args: { subscriptionId: v.id("subscriptions") },
  handler: async (ctx, args): Promise<void> => {
    const subscription = await ctx.db.get(args.subscriptionId);
    if (!subscription) return;

    await ctx.db.patch(args.subscriptionId, {
      status: "expired",
    });

    await ctx.db.patch(subscription.userId, {
      subscriptionStatus: "expired",
    });

    console.log(`Subscription ${args.subscriptionId} expired`);
  },
});

export const logRenewalEvent = internalMutation({
  args: {
    subscriptionId: v.id("subscriptions"),
    event: v.string(),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<void> => {
    console.log(
      `[Renewal] ${args.event} - Subscription: ${args.subscriptionId}${args.details ? ` - ${args.details}` : ""}`,
    );
  },
});

// Renewal action - calls Moneroo API
export const initiateRenewalPayment = internalAction({
  args: {
    subscriptionId: v.id("subscriptions"),
    userEmail: v.string(),
    userName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const MONEROO_SECRET_KEY = process.env.MONEROO_SECRET_KEY;
    const SITE_URL = process.env.SITE_URL || "https://plr-library.com";

    if (!MONEROO_SECRET_KEY) {
      console.error("MONEROO_SECRET_KEY not configured");
      return { success: false, error: "Payment configuration error" };
    }

    try {
      const response = await fetch(
        "https://api.moneroo.io/v1/payments/initialize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${MONEROO_SECRET_KEY}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            amount: SUBSCRIPTION.PRICE,
            currency: SUBSCRIPTION.CURRENCY,
            description: "Renouvellement " + SUBSCRIPTION.DESCRIPTION,
            customer: {
              email: args.userEmail,
              first_name: args.userName || "Abonné",
              last_name: "PLR",
            },
            return_url: `${SITE_URL}/payment/success?type=renewal`,
            metadata: {
              subscription_id: args.subscriptionId,
              type: "renewal",
            },
            methods: [...DEFAULT_PAYMENT_METHODS],
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Moneroo error:", data);
        return {
          success: false,
          error: data.message || "Payment initialization failed",
        };
      }

      const paymentId = data.data.id;

      await ctx.runMutation(internal.renewal.markPendingRenewal, {
        subscriptionId: args.subscriptionId,
        monerooPaymentId: paymentId,
      });

      return { success: true, paymentId };
    } catch (error) {
      console.error("Renewal payment error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
