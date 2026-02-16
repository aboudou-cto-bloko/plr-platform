import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        return {
          email: params.email as string,
          name: params.name as string,
        };
      },
    }),
  ],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      // Si l'utilisateur existe déjà, retourner son ID
      if (args.existingUserId) {
        if (args.profile.name) {
          await ctx.db.patch(args.existingUserId, {
            name: args.profile.name,
          });
        }
        return args.existingUserId;
      }

      const userId = await ctx.db.insert("users", {
        email: args.profile.email!,
        name: args.profile.name ?? undefined,
        role: "user",
        subscriptionStatus: "none",
        createdAt: Date.now(),
      });

      return userId;
    },
  },
});
