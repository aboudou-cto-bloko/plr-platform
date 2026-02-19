"use client";

import { Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import {
  IconDownload,
  IconSparkles,
  IconFileText,
  IconArrowRight,
  IconCoin,
} from "@tabler/icons-react";

import Image from "next/image";
import { cn } from "@/lib/utils";

type Product = {
  _id: Id<"products">;
  title: string;
  category: string;
  creditCost?: number;
  description?: string;
  thumbnailUrl: string | null;
  isNouveau: boolean;
  downloadCount?: number;
};

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  ebook: {
    label: "Ebook",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  template: {
    label: "Template",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  formation: {
    label: "Formation",
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  kit: {
    label: "Kit",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  script: {
    label: "Script",
    color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
};

interface ProductsGridProps {
  products: Product[];
  onProductClick: (id: Id<"products">) => void;
  columns?: 3 | 4;
  showDescription?: boolean;
}

export function ProductsGrid({
  products,
  onProductClick,
  columns = 4,
  showDescription = true,
}: ProductsGridProps) {
  const gridCols =
    columns === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={cn("grid gap-5", gridCols)}>
      {products.map((product, index) => (
        <ProductGridCard
          key={product._id}
          product={product}
          onClick={() => onProductClick(product._id)}
          showDescription={showDescription}
          index={index}
        />
      ))}
    </div>
  );
}

interface ProductGridCardProps {
  product: Product;
  onClick: () => void;
  showDescription: boolean;
  index: number;
}

function ProductGridCard({
  product,
  onClick,
  showDescription,
  index,
}: ProductGridCardProps) {
  const categoryConfig = CATEGORY_CONFIG[product.category] || {
    label: product.category,
    color: "bg-muted text-muted-foreground",
  };

  const showCreditCost =
    product.creditCost !== undefined && product.creditCost > 0;

  return (
    <article
      className={cn(
        "product-card card-gradient group cursor-pointer rounded-xl border border-border overflow-hidden",
        "animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both",
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <IconFileText className="size-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* NEW badge */}
        {product.isNouveau && (
          <Badge className="absolute top-3 left-3 badge-new gap-1 shadow-lg">
            <IconSparkles className="size-3" />
            Nouveau
          </Badge>
        )}

        {/* CATEGORY badge (from ProductCard) */}
        <Badge
          variant="outline"
          className={cn(
            "absolute top-3 right-3 shadow-sm backdrop-blur-sm bg-background/80 border",
            categoryConfig.color,
          )}
        >
          {categoryConfig.label}
        </Badge>

        {/* CREDIT badge (from ProductCard) */}
        {showCreditCost && (
          <Badge
            variant="secondary"
            className="absolute bottom-3 left-3 gap-1 shadow-sm backdrop-blur-sm bg-background/90 text-foreground"
          >
            <IconCoin className="size-3 text-amber-500" />
            {product.creditCost} crédit
            {product.creditCost! > 1 ? "s" : ""}
          </Badge>
        )}

        {/* Quick view button (from ProductCard) */}
        <div
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100
          transition-all duration-300 translate-y-2 group-hover:translate-y-0"
        >
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
            bg-primary text-primary-foreground text-sm font-medium shadow-lg
            hover:bg-primary/90 transition-colors"
          >
            <span>Voir</span>
            <IconArrowRight className="size-4" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h4 className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h4>

        {/* Description */}
        {showDescription && product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          {/* Download count */}
          {product.downloadCount !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <IconDownload className="size-3.5" />
              <span>{product.downloadCount}</span>
            </div>
          )}

          {/* Arrow indicator */}
          <IconArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="empty-state flex flex-col items-center justify-center py-16 px-4 rounded-xl border border-dashed border-border">
      <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <IconFileText className="size-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        Aucun produit trouvé
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        Essayez de modifier vos filtres ou revenez plus tard pour découvrir de
        nouveaux produits.
      </p>
    </div>
  );
}
