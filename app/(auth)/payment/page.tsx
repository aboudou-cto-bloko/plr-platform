"use client";

import { useState, useEffect } from "react";
import { useQuery, useAction } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconCheck,
  IconCreditCard,
  IconLoader2,
  IconShieldCheck,
} from "@tabler/icons-react";
import Link from "next/link";

const PLAN_FEATURES = [
  "Accès à tous les produits PLR",
  "Téléchargements illimités",
  "Fichiers sources inclus",
  "Licence de revente complète",
  "Nouveaux produits chaque mois",
  "Support par email",
];

export default function PaymentPage() {
  const router = useRouter();
  const user = useQuery(api.users.getCurrentUser);
  const initPayment = useAction(api.payments.initializePayment);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already subscribed
  useEffect(() => {
    if (user?.subscriptionStatus === "active") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await initPayment({});
      // Redirect to Moneroo checkout
      window.location.href = result.checkoutUrl;
    } catch (error) {
      setError("Erreur lors de l'initialisation du paiement");
      setIsLoading(false);
    }
  };

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <IconLoader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user === null) {
    router.push("/login");
    return null;
  }

  return (
    <section className="flex min-h-screen bg-linear-to-b from-muted to-background px-4 py-16">
      <div className="m-auto w-full max-w-lg">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                PLR
              </span>
            </div>
            <span className="text-xl font-semibold">Library</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              Finalisez votre inscription
            </CardTitle>
            <CardDescription>
              Bienvenue {user.name?.split(" ")[0]} ! Activez votre abonnement
              pour accéder à la bibliothèque.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Price */}
            <div className="text-center rounded-lg bg-primary/5 p-6">
              <p className="text-sm text-muted-foreground">
                Abonnement mensuel
              </p>
              <div className="mt-2">
                <span className="text-4xl font-bold">15,000</span>
                <span className="text-lg text-muted-foreground">
                  {" "}
                  FCFA/mois
                </span>
              </div>
              <Badge variant="secondary" className="mt-2">
                Annulez à tout moment
              </Badge>
            </div>

            {/* Features */}
            <ul className="space-y-3">
              {PLAN_FEATURES.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                    <IconCheck className="size-3 text-primary" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex-col gap-4">
            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <IconLoader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <IconCreditCard className="mr-2 size-4" />
              )}
              Payer 15,000 FCFA
            </Button>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <IconShieldCheck className="size-4" />
              Paiement sécurisé via Mobile Money
            </div>
          </CardFooter>
        </Card>

        {/* Skip for now */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Vous pouvez{" "}
          <button
            onClick={() => router.push("/onboarding")}
            className="text-primary hover:underline"
          >
            continuer sans payer
          </button>{" "}
          et vous abonner plus tard.
        </p>
      </div>
    </section>
  );
}
