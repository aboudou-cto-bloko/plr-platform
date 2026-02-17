"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { LicenseTerms } from "./LicenseTerms";
import { DownloadButton } from "./DownloadButton";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconArrowLeft,
  IconFileText,
  IconDownload,
  IconCheck,
  IconRefresh,
  IconSparkles,
  IconUsers,
  IconShieldCheck,
} from "@tabler/icons-react";
import { DownloadRateLimit } from "../dashboard/download-rate-limit";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductDetailProps {
  productId: Id<"products">;
}

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  ebook: {
    label: "Ebook / Guide",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  template: {
    label: "Template",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  formation: {
    label: "Mini-formation",
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  kit: {
    label: "Kit marketing",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  script: {
    label: "Script / Email",
    color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
};

export function ProductDetail({ productId }: ProductDetailProps) {
  const product = useQuery(api.products.getByIdWithDetails, { productId });
  const hasDownloaded = useQuery(api.downloads.hasUserDownloaded, {
    productId,
  });

  if (product === undefined || hasDownloaded === undefined) {
    return <ProductDetailSkeleton />;
  }

  if (product === null) {
    return <ProductNotFound />;
  }

  const categoryConfig = CATEGORY_CONFIG[product.category] || {
    label: product.category,
    color: "bg-muted text-muted-foreground",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <IconArrowLeft className="size-4" />
            Bibliothèque
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">
            {product.title}
          </span>
        </nav>

        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden bg-muted">
          {/* Thumbnail */}
          <div className="aspect-video relative">
            {product.thumbnailUrl ? (
              <Image
                src={product.thumbnailUrl}
                alt={product.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                <IconFileText className="size-20 text-muted-foreground/30" />
              </div>
            )}

            {/* Badges on image */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className={cn("shadow-lg", categoryConfig.color)}>
                {categoryConfig.label}
              </Badge>
              {product.isNouveau && (
                <Badge className="badge-new gap-1 shadow-lg">
                  <IconSparkles className="size-3" />
                  Nouveau
                </Badge>
              )}
            </div>

            {/* Download count on image */}
            <div className="absolute bottom-4 right-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm">
                <IconDownload className="size-4" />
                <span className="font-medium">{product.downloadCount}</span>
                <span className="text-white/70">téléchargements</span>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {product.title}
          </h1>
          {hasDownloaded && (
            <div className="flex items-center gap-1.5 mt-2 text-sm text-primary">
              <IconCheck className="size-4" />
              <span>Vous avez déjà téléchargé ce produit</span>
            </div>
          )}
        </div>

        {/* Description Card */}
        <div className="card-gradient rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            Description
          </h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {product.description}
          </p>
        </div>

        {/* License Card */}
        <div className="rounded-xl border border-border bg-card p-6">
          <LicenseTerms />
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-8 space-y-4">
          {/* Download Card */}
          <div className="card-gradient rounded-xl border border-border p-6 space-y-5">
            {/* Price/Access indicator */}
            <div className="text-center pb-4 border-b border-border">
              <p className="text-sm text-muted-foreground mb-1">
                Inclus dans votre abonnement
              </p>
              <p className="text-2xl font-bold text-gradient">Accès illimité</p>
            </div>

            <DownloadButton
              productId={productId}
              productTitle={product.title}
              size="lg"
              className="w-full btn-glow"
            />

            <DownloadRateLimit />
          </div>

          {/* Features Card */}
          <div className="rounded-xl border border-border bg-secondary/30 p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Ce qui est inclus
            </h3>
            <ul className="space-y-3">
              {[
                {
                  icon: IconFileText,
                  text: "Fichiers sources éditables",
                },
                {
                  icon: IconShieldCheck,
                  text: "Licence PLR complète",
                },
                {
                  icon: IconRefresh,
                  text: "Mises à jour gratuites",
                },
                {
                  icon: IconUsers,
                  text: "Revente autorisée",
                },
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="size-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Card */}
          <div className="rounded-xl border border-dashed border-border p-4 text-center">
            <p className="text-xs text-muted-foreground">
              Besoin d&apos;aide ?{" "}
              <Link
                href="/support"
                className="text-primary hover:underline font-medium"
              >
                Contactez le support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="size-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <IconFileText className="size-10 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">
        Produit non trouvé
      </h2>
      <p className="text-muted-foreground text-center mb-6 max-w-sm">
        Ce produit n&apos;existe pas ou n&apos;est plus disponible dans la
        bibliothèque.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
      >
        <IconArrowLeft className="size-4" />
        Retour à la bibliothèque
      </Link>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="rounded-xl border border-border p-6 space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-xl border border-border p-6 space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>
        <div className="rounded-xl border border-border p-5 space-y-3">
          <Skeleton className="h-5 w-32" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
