import { ProductDetail } from "@/components/product/ProductDetail";
import { Id } from "@/convex/_generated/dataModel";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <ProductDetail productId={id as Id<"products">} />
      </div>
    </div>
  );
}
