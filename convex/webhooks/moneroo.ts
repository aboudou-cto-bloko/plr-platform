// convex/http/monerooWebhook.ts - Ajouter le traitement des commissions affiliés

import { httpAction } from "../_generated/server";
import { internal } from "../_generated/api";

export const monerooWebhook = httpAction(async (ctx, request) => {
  const payload = await request.text();
  const signature = request.headers.get("x-moneroo-signature");
  const secret = process.env.MONEROO_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return new Response(JSON.stringify({ error: "Missing signature" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Verify signature
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload),
  );
  const computedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (computedSignature !== signature) {
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const event = JSON.parse(payload);
  const { event: eventType, data } = event;

  console.log("Webhook received:", eventType, data.id);

  const isRenewal = data.metadata?.type === "renewal";

  try {
    switch (eventType) {
      case "payment.success":
        if (isRenewal) {
          // Étendre l'abonnement
          await ctx.runMutation(internal.renewal.extendSubscription, {
            monerooPaymentId: data.id,
          });

          if (data.metadata?.user_id) {
            await ctx.runMutation(
              internal.affiliates.processRenewalCommission,
              {
                userId: data.metadata.user_id,
                paymentId: data.metadata.payment_id,
                amount: data.amount,
              },
            );
          }
        } else {
          // Premier paiement: activer l'abonnement
          await ctx.runMutation(internal.subscriptions.activateSubscription, {
            monerooPaymentId: data.id,
          });

          // Traiter la commission affilié (premier paiement)
          const affiliateId = data.metadata?.affiliate_id;
          const originalAmount = data.metadata?.original_amount;

          if (affiliateId && data.metadata?.user_id) {
            await ctx.runMutation(internal.affiliates.convertReferral, {
              userId: data.metadata.user_id,
              paymentId: data.metadata.payment_id,
              originalAmount: originalAmount || data.amount,
              finalAmount: data.amount,
            });
          }
        }
        break;

      case "payment.failed":
      case "payment.cancelled":
        if (isRenewal) {
          console.log(`Renewal payment failed/cancelled: ${data.id}`);
        } else {
          await ctx.runMutation(internal.subscriptions.failPayment, {
            monerooPaymentId: data.id,
          });
        }
        break;

      default:
        console.log("Unhandled event type:", eventType);
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(JSON.stringify({ error: "Processing failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
