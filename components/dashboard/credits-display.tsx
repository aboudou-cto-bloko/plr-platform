// components/dashboard/credits-display.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { IconCoin, IconInfinity, IconSparkles } from "@tabler/icons-react";
import Link from "next/link";
import { CREDITS } from "@/lib/constants";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function CreditsDisplay() {
  const creditsInfo = useQuery(api.credits.getUserCredits);

  if (!creditsInfo) {
    return <div className="animate-pulse h-16 bg-muted rounded-lg" />;
  }

  // Utilisateur abonné = illimité
  if (creditsInfo.isUnlimited) {
    return (
      <div className="flex items-center gap-3 rounded-lg border bg-gradient-to-r from-primary/5 to-primary/10 p-4">
        <div className="rounded-full bg-primary/10 p-2">
          <IconInfinity className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-medium">Téléchargements illimités</p>
          <p className="text-sm text-muted-foreground">
            Votre abonnement inclut un accès illimité
          </p>
        </div>
        <Badge variant="default" className="bg-primary">
          <IconSparkles className="mr-1 h-3 w-3" />
          Premium
        </Badge>
      </div>
    );
  }

  // Utilisateur gratuit
  const percentage = (creditsInfo.credits / CREDITS.FREE_MONTHLY_CREDITS) * 100;
  const isLow = creditsInfo.credits <= 5;

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`rounded-full p-2 ${isLow ? "bg-orange-500/10" : "bg-primary/10"}`}
          >
            <IconCoin
              className={`h-5 w-5 ${isLow ? "text-orange-500" : "text-primary"}`}
            />
          </div>
          <div>
            <p className="font-medium">Crédits disponibles</p>
            <p className="text-sm text-muted-foreground">
              {creditsInfo.resetsAt && (
                <>
                  Renouvellement{" "}
                  {formatDistanceToNow(creditsInfo.resetsAt, {
                    addSuffix: true,
                    locale: fr,
                  })}
                </>
              )}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${isLow ? "text-orange-500" : ""}`}>
            {creditsInfo.credits}
          </p>
          <p className="text-xs text-muted-foreground">
            / {CREDITS.FREE_MONTHLY_CREDITS}
          </p>
        </div>
      </div>

      <Progress
        value={percentage}
        className={`h-2 ${isLow ? "[&>div]:bg-orange-500" : ""}`}
      />

      {isLow && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-orange-600">Crédits bientôt épuisés</p>
          <Button size="sm" asChild>
            <Link href="/pricing">Passer Premium</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
