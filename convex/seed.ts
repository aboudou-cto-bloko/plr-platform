import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

interface PromoteResult {
  userId: Id<"users">;
  email: string;
  previousRole: "user" | "admin";
  newRole: "admin";
}

// Promote a user to admin by email
export const promoteToAdmin = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args): Promise<PromoteResult> => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      throw new Error(
        `User with email ${args.email} not found. Please sign up first.`,
      );
    }

    const previousRole = user.role;

    if (previousRole !== "admin") {
      await ctx.db.patch(user._id, { role: "admin" });
    }

    return {
      userId: user._id,
      email: args.email,
      previousRole,
      newRole: "admin",
    };
  },
});

// Demote admin to user (for testing)
export const demoteToUser = mutation({
  args: {
    email: v.string(),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{ userId: Id<"users">; email: string }> => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      throw new Error(`User with email ${args.email} not found.`);
    }

    await ctx.db.patch(user._id, { role: "user" });

    return {
      userId: user._id,
      email: args.email,
    };
  },
});

// List all users (for debugging)
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.map((u) => ({
      id: u._id,
      email: u.email,
      name: u.name,
      role: u.role,
      subscriptionStatus: u.subscriptionStatus,
      createdAt: u.createdAt,
    }));
  },
});

// Grant active subscription to a user (for testing)
export const grantSubscription = mutation({
  args: {
    email: v.string(),
    durationDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      throw new Error(`User with email ${args.email} not found.`);
    }

    const durationMs = (args.durationDays ?? 30) * 24 * 60 * 60 * 1000;
    const now = Date.now();

    // Update user subscription status
    await ctx.db.patch(user._id, {
      subscriptionStatus: "active",
      nextBillingDate: now + durationMs,
    });

    // Create subscription record
    const subscriptionId = await ctx.db.insert("subscriptions", {
      userId: user._id,
      monerooPaymentId: `seed_${now}`,
      status: "active",
      amount: 15000,
      currency: "XOF",
      startedAt: now,
      expiresAt: now + durationMs,
      renewalAttempts: 0,
    });

    return {
      userId: user._id,
      subscriptionId,
      expiresAt: new Date(now + durationMs).toISOString(),
    };
  },
});
