"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { SectionCards } from "@/components/section-cards";
import { ProductsGrid } from "@/components/dashboard/products-grid";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const user = useQuery(api.users.getCurrentUser);
  const newProducts = useQuery(api.products.listNew);

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Welcome */}
      <div className="px-4 lg:px-6">
        <h2 className="text-3xl font-heading font-bold">
          Bienvenue{user.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
        </h2>
        <p className="text-muted-foreground">
          Voici un aperçu de votre bibliothèque PLR
        </p>
      </div>

      {/* Stats Cards */}
      <SectionCards />

      {/* New Products */}
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Nouveautés</h3>
            <p className="text-sm text-muted-foreground">
              Produits récemment ajoutés
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/library?filter=new">
              Voir tout
              <IconArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>

        {newProducts && newProducts.length > 0 ? (
          <ProductsGrid
            products={newProducts.slice(0, 4)}
            onProductClick={(id) => router.push(`/product/${id}`)}
          />
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">
              Aucun nouveau produit pour le moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
