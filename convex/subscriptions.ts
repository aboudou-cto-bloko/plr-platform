import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const SUBSCRIPTION_PRICE_XOF = 10000;
const SUBSCRIPTION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export const createPendingSubscription = mutation({
  args: {
    monerooPaymentId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .unique();

    if (!user) throw new Error("User not found");

    // Create pending subscription
    const subscriptionId = await ctx.db.insert("subscriptions", {
      userId: user._id,
      monerooPaymentId: args.monerooPaymentId,
      status: "pending",
      amount: SUBSCRIPTION_PRICE_XOF,
      currency: "XOF",
      startedAt: Date.now(),
      expiresAt: Date.now() + SUBSCRIPTION_DURATION_MS,
      renewalAttempts: 0,
    });

    // Create payment record
    await ctx.db.insert("payments", {
      userId: user._id,
      subscriptionId,
      monerooPaymentId: args.monerooPaymentId,
      amount: SUBSCRIPTION_PRICE_XOF,
      currency: "XOF",
      status: "pending",
      type: "initial",
      createdAt: Date.now(),
    });

    return subscriptionId;
  },
});

export const failPayment = internalMutation({
  args: {
    monerooPaymentId: v.string(),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_moneroo", (q) =>
        q.eq("monerooPaymentId", args.monerooPaymentId),
      )
      .unique();

    if (!payment) {
      console.error("Payment not found:", args.monerooPaymentId);
      return;
    }

    await ctx.db.patch(payment._id, {
      status: "failed",
    });

    console.log(`Payment failed: ${args.monerooPaymentId}`);
  },
});

export const getCurrentSubscription = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "active"),
          q.eq(q.field("status"), "pending_renewal"),
        ),
      )
      .first();
  },
});

export const getActiveSubscribersCount = query({
  args: {},
  handler: async (ctx) => {
    const activeSubscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    return activeSubscriptions.length;
  },
});

export const activateSubscription = internalMutation({
  args: {
    monerooPaymentId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find payment by Moneroo ID
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_moneroo", (q) =>
        q.eq("monerooPaymentId", args.monerooPaymentId),
      )
      .unique();

    if (!payment) {
      console.error("Payment not found:", args.monerooPaymentId);
      return;
    }

    const now = Date.now();
    const expiresAt = now + SUBSCRIPTION_DURATION_MS;

    // Update payment status
    await ctx.db.patch(payment._id, {
      status: "success",
      completedAt: now,
    });

    // Check for existing subscription
    const existingSubscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", payment.userId))
      .first();

    if (existingSubscription) {
      // Extend existing subscription
      const newExpiresAt =
        Math.max(existingSubscription.expiresAt, now) +
        SUBSCRIPTION_DURATION_MS;

      await ctx.db.patch(existingSubscription._id, {
        status: "active",
        expiresAt: newExpiresAt,
        renewalAttempts: 0,
      });

      await ctx.db.patch(payment._id, {
        subscriptionId: existingSubscription._id,
      });
    } else {
      // Create new subscription
      const subscriptionId = await ctx.db.insert("subscriptions", {
        userId: payment.userId,
        status: "active",
        startedAt: now,
        expiresAt,
        renewalAttempts: 0,
      });

      await ctx.db.patch(payment._id, {
        subscriptionId,
      });
    }

    // Update user status
    await ctx.db.patch(payment.userId, {
      subscriptionStatus: "active",
      nextBillingDate: expiresAt,
    });

    console.log(`Subscription activated for payment: ${args.monerooPaymentId}`);
  },
});
