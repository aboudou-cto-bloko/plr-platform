"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { LicenseTerms } from "./LicenseTerms";
import { DownloadButton } from "./DownloadButton";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  FileText,
  Download,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { DownloadRateLimit } from "../dashboard/download-rate-limit";
import Image from "next/image";

interface ProductDetailProps {
  productId: Id<"products">;
}

const CATEGORY_LABELS: Record<string, string> = {
  ebook: "Ebook / Guide",
  template: "Template",
  formation: "Mini-formation",
  kit: "Kit marketing",
  script: "Script / Email",
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
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">
          Produit non trouvé
        </h2>
        <p className="text-muted-foreground mb-4">
          Ce produit n&apos;existe pas ou n&apos;est plus disponible.
        </p>
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la bibliothèque
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Bibliothèque
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground truncate">{product.title}</span>
        </nav>

        {/* Thumbnail */}
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          {product.thumbnailUrl ? (
            <Image
              src={product.thumbnailUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <FileText className="h-16 w-16" />
            </div>
          )}
        </div>

        {/* Title & Category */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">
              {CATEGORY_LABELS[product.category] || product.category}
            </Badge>
            {product.isNouveau && <Badge>Nouveau</Badge>}
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {product.title}
          </h1>
        </div>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {product.description}
            </p>
          </CardContent>
        </Card>

        {/* License */}
        <Card>
          <CardContent className="pt-6">
            <LicenseTerms />
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-8 space-y-6">
          {/* Download Card */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="text-center pb-2 border-b border-border">
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                  <Download className="h-4 w-4" />
                  <span className="text-sm">
                    {product.downloadCount} téléchargement
                    {product.downloadCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <DownloadButton
                productId={productId}
                productTitle={product.title}
                size="lg"
                className="w-full"
              />
              <DownloadRateLimit />
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card className="bg-secondary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Inclus dans ce produit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Fichiers sources</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Licence PLR complète</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 text-primary" />
                <span>Mises à jour incluses</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="aspect-video w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-3/4" />
        </div>
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    </div>
  );
}
