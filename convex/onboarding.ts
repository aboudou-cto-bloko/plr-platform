import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Save onboarding answers
export const saveAnswers = mutation({
  args: {
    goal: v.string(),
    productTypes: v.array(v.string()),
    experience: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Non authentifié");
    }

    // Vérifier que l'utilisateur existe
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Chercher si des réponses existent déjà
    const existing = await ctx.db
      .query("onboardingAnswers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      // Mettre à jour
      await ctx.db.patch(existing._id, {
        goal: args.goal,
        productTypes: args.productTypes,
        experience: args.experience,
        updatedAt: Date.now(),
      });
    } else {
      // Créer
      await ctx.db.insert("onboardingAnswers", {
        userId,
        goal: args.goal,
        productTypes: args.productTypes,
        experience: args.experience,
        completedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Get onboarding answers
export const getAnswers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("onboardingAnswers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  },
});

// Check if user has completed onboarding
export const hasCompletedOnboarding = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return false;
    }

    const answers = await ctx.db
      .query("onboardingAnswers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    return answers !== null;
  },
});
