"use client";

import { useQuery } from "convex/react";
import {
  IconDownload,
  IconPackage,
  IconSparkles,
  IconTrendingUp,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

export function SectionCards() {
  const productCount = useQuery(api.products.getCount);
  const downloadStats = useQuery(api.downloads.getUserDownloadStats);
  const user = useQuery(api.users.getCurrentUser);

  if (!productCount || !user) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Produits disponibles",
      value: productCount.total.toString(),
      description: "Dans la bibliothèque",
      icon: IconPackage,
      trend: `+${productCount.new} ce mois`,
      trendUp: true,
    },
    {
      title: "Nouveautés",
      value: productCount.new.toString(),
      description: "Ajoutés récemment",
      icon: IconSparkles,
      trend: "Prêts à télécharger",
      trendUp: true,
    },
    {
      title: "Téléchargements",
      value: downloadStats?.todayCount.toString() ?? "0",
      description: "Aujourd'hui",
      icon: IconDownload,
      trend: `${downloadStats?.remaining ?? 20} restants`,
      trendUp: (downloadStats?.remaining ?? 20) > 5,
    },
    {
      title: "Statut",
      value: user.subscriptionStatus === "active" ? "Actif" : "Inactif",
      description: "Abonnement",
      icon: IconTrendingUp,
      trend:
        user.subscriptionStatus === "active" ? "Accès complet" : "Abonnez-vous",
      trendUp: user.subscriptionStatus === "active",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="@container/card">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <card.icon className="size-4" />
              {card.title}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {card.value}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="flex items-center gap-2">
              <Badge
                variant={card.trendUp ? "default" : "secondary"}
                className="text-xs"
              >
                {card.trend}
              </Badge>
            </div>
            <div className="text-muted-foreground text-xs">
              {card.description}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
