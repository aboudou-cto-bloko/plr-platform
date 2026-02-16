import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("❌ NEXT_PUBLIC_CONVEX_URL not set in environment");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function grantSubscription() {
  const email = process.argv[2];
  const days = parseInt(process.argv[3] || "30", 10);

  if (!email) {
    console.error("❌ Usage: pnpm seed:subscription <email> [days]");
    console.error("   Example: pnpm seed:subscription user@test.com 30");
    process.exit(1);
  }

  console.log(`\n💳 Granting ${days}-day subscription to ${email}...\n`);

  try {
    const result = await client.mutation(api.seed.grantSubscription, {
      email,
      durationDays: days,
    });

    console.log("✅ Success!");
    console.log(`   User ID: ${result.userId}`);
    console.log(`   Subscription ID: ${result.subscriptionId}`);
    console.log(`   Expires: ${result.expiresAt}`);
    console.log("\n🔗 User can now access the library");
  } catch (error) {
    console.error("❌ Failed:", error);
    process.exit(1);
  }
}

grantSubscription();
