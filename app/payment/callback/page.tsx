"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function PaymentCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading",
  );

  const paymentId = searchParams.get("paymentId");
  const paymentStatus = searchParams.get("paymentStatus");

  const createPendingSubscription = useMutation(
    api.subscriptions.createPendingSubscription,
  );

  useEffect(() => {
    async function handleCallback() {
      if (!paymentId) {
        setStatus("failed");
        return;
      }

      try {
        await createPendingSubscription({ monerooPaymentId: paymentId });

        if (paymentStatus === "success") {
          setStatus("success");
          setTimeout(() => router.push("/onboarding"), 2000);
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Callback error:", error);
        setStatus("failed");
      }
    }

    handleCallback();
  }, [paymentId, paymentStatus, createPendingSubscription, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4" />
            <p className="text-foreground">Traitement en cours...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-chart-2 text-5xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Paiement réussi !
            </h1>
            <p className="text-muted-foreground">
              Redirection vers votre espace...
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="text-destructive text-5xl mb-4">✗</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Paiement échoué
            </h1>
            <p className="text-muted-foreground mb-4">
              Une erreur est survenue lors du paiement.
            </p>
            <button
              onClick={() => router.push("/signup")}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Réessayer
            </button>
          </>
        )}
      </div>
    </div>
  );
}
