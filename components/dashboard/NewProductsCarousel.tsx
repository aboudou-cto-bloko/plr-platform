import { Id } from "@/convex/_generated/dataModel";
import { ProductCard } from "./ProductCard";

interface Product {
  _id: Id<"products">;
  title: string;
  category: string;
  thumbnailUrl?: string | null;
  isNouveau: boolean;
}

interface NewProductsCarouselProps {
  products: Product[];
  onDownload: (productId: Id<"products">) => void;
}

export function NewProductsCarousel({
  products,
  onDownload,
}: NewProductsCarouselProps) {
  if (products.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Nouveautés ce mois
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            id={product._id}
            title={product.title}
            category={product.category}
            thumbnailUrl={product.thumbnailUrl}
            isNew={product.isNouveau}
            onDownload={() => onDownload(product._id)}
          />
        ))}
      </div>
    </section>
  );
}
