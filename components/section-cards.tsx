"use client";

import { useQuery } from "convex/react";
import {
  IconDownload,
  IconPackage,
  IconSparkles,
  IconTrendingUp,
  IconArrowUpRight,
  IconArrowDownRight,
} from "@tabler/icons-react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SectionCards() {
  const productCount = useQuery(api.products.getCount);
  const downloadStats = useQuery(api.downloads.getUserDownloadStats);
  const user = useQuery(api.users.getCurrentUser);

  if (!productCount || !user) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <Skeleton className="size-10 rounded-lg" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="mt-4 h-8 w-20" />
            <Skeleton className="mt-2 h-4 w-32" />
          </div>
        ))}
      </div>
    );
  }

  const remainingDownloads = downloadStats?.remaining ?? 20;
  const downloadPercentage = ((20 - remainingDownloads) / 20) * 100;

  const cards = [
    /* {
    title: "Produits disponibles",
    value: productCount.total,
    subtitle: "Dans la bibliothèque",
    icon: IconPackage,
    trend: {
      value: `+${productCount.new}`,
      label: "ce mois",
      isPositive: productCount.new > 0,
    },
    accent: "primary" as const,
  },
  {
    title: "Nouveautés",
    value: productCount.new,
    subtitle: "Ajoutés ce mois",
    icon: IconSparkles,
    trend: {
      value: "Nouveau",
      label: "contenu frais",
      isPositive: true,
    },
    accent: "accent" as const,
    highlight: productCount.new > 0,
  },
  */

    {
      title: "Téléchargements",
      value: downloadStats?.todayCount ?? 0,
      subtitle: "Aujourd'hui",
      icon: IconDownload,
      trend: {
        value: `${remainingDownloads}`,
        label: "restants",
        isPositive: remainingDownloads > 5,
      },
      accent: "primary" as const,
      progress: downloadPercentage,
    },
    {
      title: "Abonnement",
      value: user.subscriptionStatus === "active" ? "Actif" : "Inactif",
      subtitle:
        user.subscriptionStatus === "active" ? "Accès complet" : "Accès limité",
      icon: IconTrendingUp,
      trend: {
        value: user.subscriptionStatus === "active" ? "Pro" : "Upgrade",
        label: user.subscriptionStatus === "active" ? "membre" : "disponible",
        isPositive: user.subscriptionStatus === "active",
      },
      accent:
        user.subscriptionStatus === "active"
          ? ("accent" as const)
          : ("muted" as const),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: {
    value: string;
    label: string;
    isPositive: boolean;
  };
  accent: "primary" | "accent" | "muted";
  highlight?: boolean;
  progress?: number;
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accent,
  highlight,
  progress,
}: StatCardProps) {
  const accentStyles = {
    primary: {
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      trendBg: "bg-primary/10 text-primary",
    },
    accent: {
      iconBg: "bg-[oklch(0.75_0.15_180/0.1)]",
      iconColor: "text-[oklch(0.55_0.18_180)]",
      trendBg: "bg-[oklch(0.75_0.15_180/0.1)] text-[oklch(0.45_0.15_180)]",
    },
    muted: {
      iconBg: "bg-muted",
      iconColor: "text-muted-foreground",
      trendBg: "bg-muted text-muted-foreground",
    },
  };

  const styles = accentStyles[accent];

  return (
    <div
      className={cn(
        "stat-card card-gradient relative rounded-xl border border-border p-5 transition-all duration-200",
        "hover:border-primary/20 hover:shadow-md",
        highlight && "ring-1 ring-primary/20",
      )}
    >
      {/* Header: Icon + Trend */}
      <div className="flex items-start justify-between">
        <div className={cn("rounded-lg p-2.5", styles.iconBg)}>
          <Icon className={cn("size-5", styles.iconColor)} />
        </div>

        <div
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
            styles.trendBg,
          )}
        >
          {trend.isPositive ? (
            <IconArrowUpRight className="size-3" />
          ) : (
            <IconArrowDownRight className="size-3" />
          )}
          <span>{trend.value}</span>
        </div>
      </div>

      {/* Value */}
      <div className="mt-4">
        <p className="text-3xl font-semibold tracking-tight tabular-nums">
          {value}
        </p>
      </div>

      {/* Title + Subtitle */}
      <div className="mt-1.5">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>

      {/* Optional Progress Bar */}
      {progress !== undefined && (
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-[oklch(0.75_0.15_180)] transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Highlight badge for new content */}
      {highlight && (
        <div className="badge-new absolute -right-1 -top-1 size-3 rounded-full" />
      )}
    </div>
  );
}
