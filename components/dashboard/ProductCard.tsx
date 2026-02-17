"use client";

import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  IconFileText,
  IconDownload,
  IconSparkles,
  IconArrowRight,
} from "@tabler/icons-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: Id<"products">;
  title: string;
  category: string;
  description?: string;
  thumbnailUrl?: string | null;
  isNew?: boolean;
  downloadCount?: number;
  onDownload?: () => void;
}

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  ebook: {
    label: "Ebook",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  template: {
    label: "Template",
    color:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  formation: {
    label: "Formation",
    color:
      "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  },
  kit: {
    label: "Kit",
    color:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  },
  script: {
    label: "Script",
    color: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  },
};

export function ProductCard({
  id,
  title,
  category,
  description,
  thumbnailUrl,
  isNew,
  downloadCount,
  onDownload,
}: ProductCardProps) {
  const categoryConfig = CATEGORY_CONFIG[category] || {
    label: category,
    color: "bg-muted text-muted-foreground",
  };

  const handleQuickAction = (e: React.MouseEvent) => {
    if (onDownload) {
      e.preventDefault();
      e.stopPropagation();
      onDownload();
    }
  };

  return (
    <Link href={`/product/${id}`} className="block group">
      <article className="product-card card-gradient h-full rounded-xl border border-border overflow-hidden">
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <IconFileText className="size-12 text-muted-foreground/30" />
            </div>
          )}

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* New badge */}
          {isNew && (
            <Badge className="badge-new absolute top-3 left-3 gap-1 shadow-lg">
              <IconSparkles className="size-3" />
              Nouveau
            </Badge>
          )}

          {/* Category badge */}
          <Badge
            variant="outline"
            className={cn(
              "absolute top-3 right-3 shadow-sm backdrop-blur-sm bg-background/80",
              categoryConfig.color,
            )}
          >
            {categoryConfig.label}
          </Badge>

          {/* Quick action on hover */}
          <button
            type="button"
            onClick={handleQuickAction}
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-lg hover:bg-primary/90 transition-colors">
              <span>Voir</span>
              <IconArrowRight className="size-4" />
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            {downloadCount !== undefined && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <IconDownload className="size-3.5" />
                <span>
                  {downloadCount} téléchargement{downloadCount !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            {/* Arrow indicator */}
            <IconArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all ml-auto" />
          </div>
        </div>
      </article>
    </Link>
  );
}
