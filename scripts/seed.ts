import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("❌ NEXT_PUBLIC_CONVEX_URL not set in environment");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@plr-library.com";

async function seed() {
  console.log("🌱 PLR Library - Seed Script\n");
  console.log("━".repeat(50));

  // Step 1: List current users
  console.log("\n📋 Current users in database:\n");

  try {
    const users = await client.query(api.seed.listUsers, {});

    if (users.length === 0) {
      console.log("   No users found.");
      console.log(
        "\n⚠️  Please sign up first at /signup, then run this script again.",
      );
      console.log(`   After signup, run: pnpm seed:admin ${ADMIN_EMAIL}`);
      return;
    }

    users.forEach((user) => {
      const roleIcon = user.role === "admin" ? "👑" : "👤";
      const subIcon = user.subscriptionStatus === "active" ? "✅" : "❌";
      console.log(`   ${roleIcon} ${user.email}`);
      console.log(
        `      Role: ${user.role} | Subscription: ${subIcon} ${user.subscriptionStatus}`,
      );
      console.log("");
    });

    console.log("━".repeat(50));
    console.log("\n📌 To promote a user to admin:");
    console.log(`   pnpm seed:admin <email>`);
    console.log("\n📌 To grant a subscription:");
    console.log(`   pnpm seed:subscription <email>`);
  } catch (error) {
    console.error("❌ Failed to list users:", error);
    process.exit(1);
  }
}

seed();
