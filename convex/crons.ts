import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run daily at midnight UTC
crons.daily(
  "process-subscription-renewals",
  { hourUTC: 0, minuteUTC: 0 },
  internal.renewalCron.processRenewals,
);

// Run every 6 hours to check for expired subscriptions
crons.interval(
  "check-expired-subscriptions",
  { hours: 6 },
  internal.renewalCron.checkExpiredSubscriptions,
);

// Run daily at 9am UTC for reminders
crons.daily(
  "send-renewal-reminders",
  { hourUTC: 9, minuteUTC: 0 },
  internal.renewalCron.sendRenewalReminders,
);

export default crons;
