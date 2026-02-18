import { v } from "convex/values";
import {
  mutation,
  query,
  action,
  internalQuery,
  internalMutation,
} from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { SUBSCRIPTION, DEFAULT_PAYMENT_METHODS } from "./constants";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

// Get user payments history
export const getUserPayments = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("payments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);
  },
});

// Get pending/failed payments (invoices due)
export const getPendingPayments = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("payments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "pending"),
          q.eq(q.field("status"), "failed"),
        ),
      )
      .order("desc")
      .collect();
  },
});

export const initializePayment = action({
  args: {
    affiliateCode: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{ checkoutUrl: string; paymentId: string }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");

    const user = await ctx.runQuery(internal.payments.getUserById, { userId });
    if (!user) throw new Error("Utilisateur non trouvé");

    if (user.subscriptionStatus === "active") {
      throw new Error("Vous avez déjà un abonnement actif");
    }

    // Calculer le prix avec réduction affilié si applicable
    let amount = Number(SUBSCRIPTION.PRICE);
    let discountAmount = 0;
    let affiliateId: string | undefined;
    let affiliateCode: string | undefined;

    if (args.affiliateCode) {
      const priceInfo = await ctx.runQuery(
        internal.affiliates.calculatePriceInternal,
        {
          code: args.affiliateCode,
        },
      );

      if (priceInfo.affiliateCode) {
        amount = priceInfo.finalPrice;
        discountAmount = priceInfo.discountAmount;
        affiliateId = priceInfo.affiliateId;
        affiliateCode = priceInfo.affiliateCode;

        // Lier l'utilisateur à l'affilié si pas déjà fait
        if (!user.referredBy) {
          await ctx.runMutation(internal.affiliates.linkUserToAffiliate, {
            userId,
            affiliateCode: affiliateCode,
          });
        }
      }
    }

    // Create payment record
    const paymentId = await ctx.runMutation(internal.payments.createPayment, {
      userId,
      amount,
      originalAmount: SUBSCRIPTION.PRICE,
      discountAmount,
      affiliateId,
      currency: SUBSCRIPTION.CURRENCY,
      type: "initial",
    });

    // Call Moneroo API
    const response = await fetch(
      "https://api.moneroo.io/v1/payments/initialize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MONEROO_SECRET_KEY}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          amount,
          currency: SUBSCRIPTION.CURRENCY,
          description:
            discountAmount > 0
              ? `${SUBSCRIPTION.DESCRIPTION} (réduction ${affiliateCode})`
              : SUBSCRIPTION.DESCRIPTION,
          customer: {
            email: user.email,
            first_name: user.name?.split(" ")[0] || "Client",
            last_name: user.name?.split(" ").slice(1).join(" ") || "PLR",
          },
          return_url: `${process.env.SITE_URL}/payment/success?type=initial`,
          metadata: {
            user_id: userId,
            payment_id: paymentId,
            type: "initial",
            affiliate_code: affiliateCode || null,
            affiliate_id: affiliateId || null,
            original_amount: SUBSCRIPTION.PRICE,
            discount_amount: discountAmount,
          },
          methods: [...DEFAULT_PAYMENT_METHODS],
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Moneroo error:", error);
      throw new Error("Erreur lors de l'initialisation du paiement");
    }

    const data = await response.json();

    // Update payment with Moneroo ID
    await ctx.runMutation(internal.payments.updatePaymentMonerooId, {
      paymentId,
      monerooPaymentId: data.data.id,
    });

    return {
      checkoutUrl: data.data.checkout_url,
      paymentId,
    };
  },
});

// Pay an existing invoice (for renewals)
export const payInvoice = action({
  args: {
    paymentId: v.id("payments"),
  },
  handler: async (ctx, args): Promise<{ checkoutUrl: string }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");

    const payment = await ctx.runQuery(internal.payments.getPaymentById, {
      paymentId: args.paymentId,
    });

    if (!payment) throw new Error("Facture non trouvée");
    if (payment.userId !== userId) throw new Error("Non autorisé");
    if (payment.status === "success") throw new Error("Facture déjà payée");

    const user = await ctx.runQuery(internal.payments.getUserById, { userId });
    if (!user) throw new Error("Utilisateur non trouvé");

    const response = await fetch(
      "https://api.moneroo.io/v1/payments/initialize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MONEROO_SECRET_KEY}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          amount: payment.amount,
          currency: payment.currency,
          description: `Renouvellement PLR Library - Facture #${payment._id.slice(-6).toUpperCase()}`,
          customer: {
            email: user.email,
            first_name: user.name?.split(" ")[0] || "Client",
            last_name: user.name?.split(" ").slice(1).join(" ") || "PLR",
          },
          return_url: `${process.env.SITE_URL}/payment/success?type=renewal`,
          metadata: {
            user_id: userId,
            payment_id: args.paymentId,
            type: "renewal",
          },
          methods: [...DEFAULT_PAYMENT_METHODS],
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Erreur lors de l'initialisation du paiement");
    }

    const data = await response.json();

    // Update payment with new Moneroo ID
    await ctx.runMutation(internal.payments.updatePaymentMonerooId, {
      paymentId: args.paymentId,
      monerooPaymentId: data.data.id,
    });

    return {
      checkoutUrl: data.data.checkout_url,
    };
  },
});

// Internal queries and mutations
export const getUserById = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const getPaymentById = internalQuery({
  args: { paymentId: v.id("payments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.paymentId);
  },
});

export const createPayment = internalMutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
    originalAmount: v.optional(v.number()),
    discountAmount: v.optional(v.number()),
    affiliateId: v.optional(v.string()),
    currency: v.string(),
    type: v.union(v.literal("initial"), v.literal("renewal")),
  },
  handler: async (ctx, args) => {
    const paymentId = await ctx.db.insert("payments", {
      userId: args.userId,
      amount: args.amount,
      originalAmount: args.originalAmount,
      discountAmount: args.discountAmount,
      affiliateId: args.affiliateId as Id<"affiliates"> | undefined,
      currency: args.currency,
      type: args.type,
      status: "pending",
      createdAt: Date.now(),
    });

    return paymentId;
  },
});

export const updatePaymentMonerooId = internalMutation({
  args: {
    paymentId: v.id("payments"),
    monerooPaymentId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.paymentId, {
      monerooPaymentId: args.monerooPaymentId,
    });
  },
});

export const markPaymentSuccess = mutation({
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

    if (!payment) throw new Error("Payment not found");

    const now = Date.now();

    // Update payment status
    await ctx.db.patch(payment._id, {
      status: "success",
      completedAt: now,
    });

    // Get user
    const user = await ctx.db.get(payment.userId);
    if (!user) throw new Error("User not found");

    // Create or update subscription
    const existingSubscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", payment.userId))
      .first();

    const expiresAt = now + SUBSCRIPTION.DURATION_MS;

    if (existingSubscription) {
      // Extend existing subscription
      const newExpiresAt =
        Math.max(existingSubscription.expiresAt, now) +
        SUBSCRIPTION.DURATION_MS;
      await ctx.db.patch(existingSubscription._id, {
        status: "active",
        expiresAt: newExpiresAt,
        renewalAttempts: 0,
      });

      // Link payment to subscription
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

      // Link payment to subscription
      await ctx.db.patch(payment._id, {
        subscriptionId,
      });
    }

    // Update user status
    await ctx.db.patch(payment.userId, {
      subscriptionStatus: "active",
      nextBillingDate: expiresAt,
    });

    return { success: true };
  },
});

export const markPaymentFailed = mutation({
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

    if (!payment) throw new Error("Payment not found");

    await ctx.db.patch(payment._id, {
      status: "failed",
    });

    return { success: true };
  },
});
