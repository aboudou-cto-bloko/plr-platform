import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

// Process subscription renewals
export const processRenewals = internalAction({
  args: {},
  handler: async (ctx): Promise<void> => {
    console.log("[Cron] Starting subscription renewal process...");

    const subscriptionsToRenew = await ctx.runQuery(
      internal.renewal.getSubscriptionsToRenew,
    );

    console.log(
      `[Cron] Found ${subscriptionsToRenew.length} subscriptions to renew`,
    );

    for (const { subscription, user } of subscriptionsToRenew) {
      try {
        const result = await ctx.runAction(
          internal.renewal.initiateRenewalPayment,
          {
            subscriptionId: subscription._id,
            userEmail: user.email,
            userName: user.name,
          },
        );

        if (result.success) {
          console.log(
            `[Cron] Renewal initiated for ${user.email} - Payment: ${result.paymentId}`,
          );
        } else {
          console.error(
            `[Cron] Renewal failed for ${user.email}: ${result.error}`,
          );
        }
      } catch (error) {
        console.error(
          `[Cron] Error processing renewal for ${user.email}:`,
          error,
        );
      }

      // Small delay between API calls to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log("[Cron] Subscription renewal process completed");
  },
});

// Check and expire subscriptions past grace period
export const checkExpiredSubscriptions = internalAction({
  args: {},
  handler: async (ctx): Promise<void> => {
    console.log("[Cron] Checking for expired subscriptions...");

    const expiredSubscriptions = await ctx.runQuery(
      internal.renewal.getExpiredSubscriptions,
    );

    console.log(
      `[Cron] Found ${expiredSubscriptions.length} expired subscriptions`,
    );

    for (const { subscription, user } of expiredSubscriptions) {
      try {
        await ctx.runMutation(internal.renewal.expireSubscription, {
          subscriptionId: subscription._id,
        });

        await ctx.runMutation(internal.renewal.logRenewalEvent, {
          subscriptionId: subscription._id,
          event: "SUBSCRIPTION_EXPIRED",
          details: `User: ${user.email}`,
        });

        console.log(`[Cron] Expired subscription for ${user.email}`);
      } catch (error) {
        console.error(
          `[Cron] Error expiring subscription for ${user.email}:`,
          error,
        );
      }
    }

    console.log("[Cron] Expired subscriptions check completed");
  },
});

// Send renewal reminders
export const sendRenewalReminders = internalAction({
  args: {},
  handler: async (ctx): Promise<void> => {
    console.log("[Cron] Sending renewal reminders...");

    const expiringIn3Days = await ctx.runQuery(
      internal.renewal.getExpiringSubscriptions,
      { daysBeforeExpiry: 3 },
    );

    console.log(
      `[Cron] Found ${expiringIn3Days.length} subscriptions expiring in 3 days`,
    );

    for (const { subscription, user } of expiringIn3Days) {
      try {
        // TODO: Integrate with email service (SendGrid, Resend, etc.)
        console.log(`[Cron] Would send reminder to ${user.email}`);

        await ctx.runMutation(internal.renewal.logRenewalEvent, {
          subscriptionId: subscription._id,
          event: "REMINDER_SENT",
          details: `3-day reminder to ${user.email}`,
        });
      } catch (error) {
        console.error(`[Cron] Error sending reminder to ${user.email}:`, error);
      }
    }

    console.log("[Cron] Renewal reminders completed");
  },
});
