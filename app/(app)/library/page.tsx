"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { ProductsGrid } from "@/components/dashboard/products-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconFilter,
  IconPackage,
  IconSearch,
  IconSparkles,
  IconX,
} from "@tabler/icons-react";
import { Id } from "@/convex/_generated/dataModel";

type CategoryType = "ebook" | "template" | "formation" | "kit" | "script";

const CATEGORIES: { id: CategoryType | "all"; label: string; icon?: string }[] =
  [
    { id: "all", label: "Tous les produits" },
    { id: "ebook", label: "Ebooks" },
    { id: "template", label: "Templates" },
    { id: "formation", label: "Formations" },
    { id: "kit", label: "Kits" },
    { id: "script", label: "Scripts" },
  ];

export default function LibraryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get filter from URL
  const categoryParam = searchParams.get("category") as CategoryType | null;
  const filterParam = searchParams.get("filter");
  const showNew = filterParam === "new";

  const [selectedCategory, setSelectedCategory] = useState<
    CategoryType | "all"
  >(categoryParam || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  // Queries
  const allProducts = useQuery(
    api.products.listPublished,
    selectedCategory !== "all" ? { category: selectedCategory } : {},
  );
  const productCount = useQuery(api.products.getCount);

  const handleProductClick = (productId: Id<"products">) => {
    router.push(`/product/${productId}`);
  };

  const handleCategoryChange = (category: CategoryType | "all") => {
    setSelectedCategory(category);
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/library?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("newest");
    router.push("/library");
  };

  // Filter and sort products
  const filteredProducts = allProducts
    ?.filter((product) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          product.title.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((product) => {
      // New filter
      if (showNew) {
        return product.isNouveau;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b._creationTime - a._creationTime;
        case "oldest":
          return a._creationTime - b._creationTime;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const hasActiveFilters = selectedCategory !== "all" || searchQuery || showNew;

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Bibliothèque</h2>
            <p className="text-muted-foreground">
              {productCount?.total ?? 0} produits disponibles
              {showNew && " • Nouveautés uniquement"}
            </p>
          </div>

          {/* Stats badges */}
          <div className="flex items-center gap-2">
            {productCount && productCount.new > 0 && (
              <Badge variant="secondary" className="gap-1">
                <IconSparkles className="size-3" />
                {productCount.new} nouveautés
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="px-4 lg:px-6">
        <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Filter */}
          <Select
            value={selectedCategory}
            onValueChange={(value) =>
              handleCategoryChange(value as CategoryType | "all")
            }
          >
            <SelectTrigger className="w-full sm:w-48">
              <IconFilter className="mr-2 size-4" />
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            value={sortBy}
            onValueChange={(value) =>
              setSortBy(value as "newest" | "oldest" | "title")
            }
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Plus récents</SelectItem>
              <SelectItem value="oldest">Plus anciens</SelectItem>
              <SelectItem value="title">Alphabétique</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1"
            >
              <IconX className="size-4" />
              Effacer
            </Button>
          )}
        </div>
      </div>

      {/* Category Pills (Mobile friendly) */}
      <div className="px-4 lg:px-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              className="shrink-0"
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 lg:px-6">
        {filteredProducts === undefined ? (
          // Loading state
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-4/3 rounded-xl" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            {/* Results count */}
            <p className="mb-4 text-sm text-muted-foreground">
              {filteredProducts.length} produit
              {filteredProducts.length > 1 ? "s" : ""} trouvé
              {filteredProducts.length > 1 ? "s" : ""}
              {searchQuery && ` pour "${searchQuery}"`}
            </p>

            <ProductsGrid
              products={filteredProducts}
              onProductClick={handleProductClick}
            />
          </>
        ) : (
          // Empty state
          <EmptyState
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onClearFilters={clearFilters}
          />
        )}
      </div>
    </div>
  );
}

function EmptyState({
  searchQuery,
  selectedCategory,
  onClearFilters,
}: {
  searchQuery: string;
  selectedCategory: string;
  onClearFilters: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <IconPackage className="size-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-medium">Aucun produit trouvé</h3>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        {searchQuery
          ? `Aucun résultat pour "${searchQuery}"`
          : selectedCategory !== "all"
            ? "Aucun produit dans cette catégorie pour le moment."
            : "La bibliothèque est en cours de constitution."}
      </p>
      {(searchQuery || selectedCategory !== "all") && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="mt-4"
        >
          Effacer les filtres
        </Button>
      )}
    </div>
  );
}
