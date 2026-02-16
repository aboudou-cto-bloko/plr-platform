"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconCheck } from "@tabler/icons-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRenewal = searchParams.get("type") === "renewal";

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timeout = setTimeout(() => {
      router.push(isRenewal ? "/settings/billing" : "/onboarding");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router, isRenewal]);

  return (
    <section className="flex min-h-screen items-center justify-center bg-linear-to-b from-muted to-background px-4 py-16">
      <div className="w-full max-w-md">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <IconCheck className="size-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Paiement réussi !</CardTitle>
            <CardDescription>
              {isRenewal
                ? "Votre abonnement a été renouvelé avec succès."
                : "Bienvenue dans PLR Library ! Votre abonnement est maintenant actif."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                {isRenewal
                  ? "Vous avez accès à la bibliothèque pour 30 jours supplémentaires."
                  : "Vous pouvez maintenant télécharger tous les produits de la bibliothèque."}
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <Button asChild className="w-full">
              <Link href={isRenewal ? "/settings/billing" : "/onboarding"}>
                {isRenewal ? "Voir mon abonnement" : "Continuer"}
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              Redirection automatique dans 5 secondes...
            </p>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
