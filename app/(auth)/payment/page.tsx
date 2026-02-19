"use client";

import { useState, useEffect, Suspense } from "react";
import { useQuery, useAction } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconCheck,
  IconCreditCard,
  IconLoader2,
  IconShieldCheck,
  IconGift,
  IconX,
  IconTag,
} from "@tabler/icons-react";
import Link from "next/link";
import { formatPrice, SUBSCRIPTION } from "@/lib/constants";
import {
  getStoredAffiliateCode,
  setAffiliateCode,
  clearAffiliateCode,
} from "@/hooks/use-affiliate";

const PLAN_FEATURES = [
  "Accès à tous les produits PLR",
  "Téléchargements illimités",
  "Fichiers sources inclus",
  "Licence de revente complète",
  "Nouveaux produits chaque mois",
  "Support par email",
];

function PaymentContent() {
  const router = useRouter();
  const user = useQuery(api.users.getCurrentUser);
  const initPayment = useAction(api.payments.initializePayment);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApplyingCode, setIsApplyingCode] = useState(false);

  const storedCode = getStoredAffiliateCode();

  const [appliedCode, setAppliedCode] = useState<string | null>(storedCode);
  const [promoCode, setPromoCode] = useState<string>(storedCode ?? "");

  // Vérifier le code affilié et calculer le prix
  const priceInfo = useQuery(
    api.affiliates.calculatePrice,
    appliedCode ? { code: appliedCode } : { code: undefined },
  );

  // Vérifier si le code appliqué est valide
  const isValidCode =
    priceInfo?.affiliateCode === appliedCode && appliedCode !== null;
  const hasDiscount = priceInfo && priceInfo.discountPercent > 0 && isValidCode;

  // Redirect if already subscribed
  useEffect(() => {
    if (user?.subscriptionStatus === "active") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleApplyCode = () => {
    if (!promoCode.trim()) return;

    setIsApplyingCode(true);
    const code = promoCode.toLowerCase().trim();

    // Sauvegarder et appliquer
    setAffiliateCode(code);
    setAppliedCode(code);

    // Le résultat sera mis à jour automatiquement via la query
    setTimeout(() => setIsApplyingCode(false), 300);
  };

  const handleRemoveCode = () => {
    clearAffiliateCode();
    setAppliedCode(null);
    setPromoCode("");
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await initPayment({
        affiliateCode: isValidCode ? appliedCode : undefined,
      });
      // Redirect to Moneroo checkout
      window.location.href = result.checkoutUrl;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de l'initialisation du paiement",
      );
      setIsLoading(false);
    }
  };

  if (user === undefined || priceInfo === undefined) {
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

  const finalPrice = priceInfo?.finalPrice ?? SUBSCRIPTION.PRICE;
  const originalPrice = priceInfo?.originalPrice ?? SUBSCRIPTION.PRICE;
  const discountAmount = priceInfo?.discountAmount ?? 0;
  const discountPercent = priceInfo?.discountPercent ?? 0;

  return (
    <section className="flex min-h-screen bg-gradient-to-b from-muted to-background px-4 py-16">
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
            {/* Code promo / Affiliation */}
            <div className="space-y-3">
              <Label>Code promo / Parrainage</Label>
              {appliedCode && isValidCode ? (
                <div className="flex items-center justify-between rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                  <div className="flex items-center gap-2">
                    <IconGift className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-700 dark:text-green-400">
                        Code &quot;{appliedCode}&quot; appliqué
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-500">
                        -{discountPercent}% de réduction
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveCode}
                    className="text-green-700 hover:text-green-800 hover:bg-green-500/20"
                  >
                    <IconX className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Entrez votre code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCode()}
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyCode}
                    disabled={!promoCode.trim() || isApplyingCode}
                  >
                    {isApplyingCode ? (
                      <IconLoader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Appliquer"
                    )}
                  </Button>
                </div>
              )}
              {appliedCode && !isValidCode && priceInfo && (
                <p className="text-sm text-destructive">
                  Code invalide ou expiré
                </p>
              )}
            </div>

            {/* Price */}
            <div className="rounded-lg bg-primary/5 p-6 space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Abonnement mensuel
              </p>

              {hasDiscount ? (
                <>
                  <div className="text-center">
                    <span className="text-2xl text-muted-foreground line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-4xl font-bold text-green-600">
                      {formatPrice(finalPrice)}
                    </span>
                    <span className="text-lg text-muted-foreground">
                      {" "}
                      /mois
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-sm text-green-600">
                    <IconTag className="h-4 w-4" />
                    <span>
                      Vous économisez {formatPrice(discountAmount)} (-
                      {discountPercent}%)
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <span className="text-4xl font-bold">
                    {formatPrice(finalPrice)}
                  </span>
                  <span className="text-lg text-muted-foreground"> /mois</span>
                </div>
              )}
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
              Payer {formatPrice(finalPrice)}
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

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <IconLoader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
