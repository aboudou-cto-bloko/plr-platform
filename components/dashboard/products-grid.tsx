"use client";

import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconDownload, IconSparkles } from "@tabler/icons-react";
import Image from "next/image";

type Product = {
  _id: Id<"products">;
  title: string;
  category: string;
  description?: string;
  thumbnailUrl: string | null;
  isNouveau: boolean;
};

const categoryLabels: Record<string, string> = {
  ebook: "Ebook",
  template: "Template",
  formation: "Formation",
  kit: "Kit",
  script: "Script",
};

const categoryColors: Record<string, string> = {
  ebook: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  template: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  formation: "bg-green-500/10 text-green-600 dark:text-green-400",
  kit: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  script: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
};

export function ProductsGrid({
  products,
  onProductClick,
  columns = 4,
}: {
  products: Product[];
  onProductClick: (id: Id<"products">) => void;
  columns?: 3 | 4;
}) {
  const gridCols =
    columns === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className={`grid gap-4 ${gridCols}`}>
      {products.map((product) => (
        <Card
          key={product._id}
          className="group cursor-pointer overflow-hidden transition-all hover:shadow-md hover:border-primary/20"
          onClick={() => onProductClick(product._id)}
        >
          <CardContent className="p-0">
            <div className="relative aspect-4/3 bg-muted overflow-hidden">
              {product.thumbnailUrl ? (
                <Image
                  src={product.thumbnailUrl}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-linear-to-br from-muted to-muted/50">
                  <IconDownload className="size-10 text-muted-foreground/50" />
                </div>
              )}

              {/* Badges overlay */}
              <div className="absolute left-2 top-2 flex flex-col gap-1">
                {product.isNouveau && (
                  <Badge className="gap-1 bg-primary shadow-sm">
                    <IconSparkles className="size-3" />
                    Nouveau
                  </Badge>
                )}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-start gap-2 p-4">
            <h4 className="line-clamp-2 font-medium leading-tight group-hover:text-primary transition-colors">
              {product.title}
            </h4>

            {product.description && (
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {product.description}
              </p>
            )}

            <Badge
              variant="secondary"
              className={`text-xs ${categoryColors[product.category] || ""}`}
            >
              {categoryLabels[product.category] || product.category}
            </Badge>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
