import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("❌ NEXT_PUBLIC_CONVEX_URL not set in environment");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function promoteAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error("❌ Usage: pnpm seed:admin <email>");
    console.error("   Example: pnpm seed:admin admin@plr-library.com");
    process.exit(1);
  }

  console.log(`\n👑 Promoting ${email} to admin...\n`);

  try {
    const result = await client.mutation(api.seed.promoteToAdmin, { email });

    console.log("✅ Success!");
    console.log(`   User ID: ${result.userId}`);
    console.log(`   Email: ${result.email}`);
    console.log(`   Previous role: ${result.previousRole}`);
    console.log(`   New role: ${result.newRole}`);
    console.log("\n🔗 You can now access /admin");
  } catch (error) {
    console.error("❌ Failed:", error);
    process.exit(1);
  }
}

promoteAdmin();
