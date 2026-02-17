import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  id: Id<"products">;
  title: string;
  category: string;
  thumbnailUrl?: string | null;
  isNew?: boolean;
  downloadCount?: number;
  onDownload?: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  ebook: "Ebook",
  template: "Template",
  formation: "Formation",
  kit: "Kit",
  script: "Script",
};

export function ProductCard({
  id,
  title,
  category,
  thumbnailUrl,
  isNew,
  downloadCount,
  onDownload,
}: ProductCardProps) {
  return (
    <Card className="group product-card card-gradient overflow-hidden hover:border-primary/50 transition-colors">
      {/* Clickable Thumbnail */}
      <Link href={`/product/${id}`} className="block">
        <div className="aspect-4/3 bg-muted relative">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <FileText className="h-12 w-12" />
            </div>
          )}

          {/* New badge */}
          {isNew && <Badge className="absolute top-2 left-2">Nouveau</Badge>}
        </div>
      </Link>

      {/* Content */}
      <CardContent className="p-4 space-y-3">
        <Link href={`/product/${id}`} className="block">
          <Badge variant="outline" className="mb-1 text-xs">
            {CATEGORY_LABELS[category] || category}
          </Badge>
          <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          {downloadCount !== undefined && (
            <span className="text-xs text-muted-foreground">
              {downloadCount} téléchargement{downloadCount > 1 ? "s" : ""}
            </span>
          )}
          <Button onClick={onDownload} size="sm" variant="secondary">
            <Eye className="mr-1 h-3 w-3" />
            Voir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
