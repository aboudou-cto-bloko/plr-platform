// app/(admin)/admin/products/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconEye,
  IconEyeOff,
  IconSparkles,
  IconSearch,
  IconPlus,
} from "@tabler/icons-react";
import { toast } from "sonner";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";

const CATEGORY_LABELS: Record<string, string> = {
  ebook: "Ebook",
  template: "Template",
  formation: "Formation",
  kit: "Kit",
  script: "Script",
};

export default function ProductsPage() {
  const products = useQuery(api.admin.listAllProducts);
  const deleteProduct = useMutation(api.admin.deleteProduct);
  const bulkDelete = useMutation(api.admin.bulkDeleteProducts);
  const bulkUpdateStatus = useMutation(api.admin.bulkUpdateStatus);
  const bulkUpdateNouveau = useMutation(api.admin.bulkUpdateNouveau);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Id<"products">[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Id<"products"> | null>(
    null,
  );

  if (!products) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Filter products
  let filteredProducts = products;

  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower),
    );
  }

  if (categoryFilter !== "all") {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === categoryFilter,
    );
  }

  if (statusFilter !== "all") {
    filteredProducts = filteredProducts.filter(
      (p) => p.status === statusFilter,
    );
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredProducts.map((p) => p._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: Id<"products">, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    }
  };

  const handleDelete = async (id: Id<"products">) => {
    try {
      await deleteProduct({ productId: id });
      toast.success("Produit supprimé");
      setProductToDelete(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      const result = await bulkDelete({ productIds: selectedIds });
      toast.success(`${result.deleted} produit(s) supprimé(s)`);
      setSelectedIds([]);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleBulkStatus = async (status: "draft" | "published") => {
    if (selectedIds.length === 0) return;
    try {
      const result = await bulkUpdateStatus({
        productIds: selectedIds,
        status,
      });
      toast.success(`${result.updated} produit(s) mis à jour`);
      setSelectedIds([]);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleBulkNouveau = async (isNouveau: boolean) => {
    if (selectedIds.length === 0) return;
    try {
      const result = await bulkUpdateNouveau({
        productIds: selectedIds,
        isNouveau,
      });
      toast.success(`${result.updated} produit(s) mis à jour`);
      setSelectedIds([]);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Produits</h1>
          <p className="text-muted-foreground">
            {products.length} produit(s) au total
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/upload">
            <IconPlus className="mr-2 h-4 w-4" />
            Ajouter
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-37.5">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="ebook">Ebooks</SelectItem>
            <SelectItem value="template">Templates</SelectItem>
            <SelectItem value="formation">Formations</SelectItem>
            <SelectItem value="kit">Kits</SelectItem>
            <SelectItem value="script">Scripts</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="published">Publiés</SelectItem>
            <SelectItem value="draft">Brouillons</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-muted p-2">
          <span className="text-sm font-medium">
            {selectedIds.length} sélectionné(s)
          </span>
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatus("published")}
            >
              <IconEye className="mr-1 h-4 w-4" />
              Publier
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatus("draft")}
            >
              <IconEyeOff className="mr-1 h-4 w-4" />
              Dépublier
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkNouveau(true)}
            >
              <IconSparkles className="mr-1 h-4 w-4" />
              Marquer nouveau
            </Button>
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <IconTrash className="mr-1 h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    filteredProducts.length > 0 &&
                    selectedIds.length === filteredProducts.length
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Produit</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Téléchargements</TableHead>
              <TableHead className="text-right">Créé</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">Aucun produit trouvé</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(product._id)}
                      onCheckedChange={(checked) =>
                        handleSelectOne(product._id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.thumbnailUrl ? (
                        <Image
                          src={product.thumbnailUrl}
                          alt={product.title}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-muted" />
                      )}
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {product.title}
                          {product.isNouveau && (
                            <Badge variant="secondary" className="text-xs">
                              Nouveau
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {CATEGORY_LABELS[product.category]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "published" ? "default" : "secondary"
                      }
                    >
                      {product.status === "published" ? "Publié" : "Brouillon"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {product.downloadCount || 0}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {formatDistanceToNow(product._creationTime, {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <IconDotsVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product._id}`}>
                            <IconEdit className="mr-2 h-4 w-4" />
                            Modifier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setProductToDelete(product._id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <IconTrash className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le produit et tous ses fichiers
              seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => productToDelete && handleDelete(productToDelete)}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
