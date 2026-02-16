"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  Star,
  StarOff,
  Eye,
  EyeOff,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { EditProductDialog } from "./EditProductDialog";
import Image from "next/image";

const CATEGORY_LABELS: Record<string, string> = {
  ebook: "Ebook",
  template: "Template",
  formation: "Formation",
  kit: "Kit",
  script: "Script",
};

export function LibraryTable() {
  const products = useQuery(api.admin.listAllProducts);
  const deleteProduct = useMutation(api.admin.deleteProduct);
  const bulkDeleteProducts = useMutation(api.admin.bulkDeleteProducts);
  const bulkUpdateNouveau = useMutation(api.admin.bulkUpdateNouveau);
  const bulkUpdateStatus = useMutation(api.admin.bulkUpdateStatus);

  const [selectedIds, setSelectedIds] = useState<Set<Id<"products">>>(
    new Set(),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: Id<"products">;
    title: string;
  } | null>(null);
  const [editProductId, setEditProductId] = useState<Id<"products"> | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);

  if (products === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  // Filter products by search
  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const allSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => selectedIds.has(p._id));

  const someSelected = selectedIds.size > 0;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map((p) => p._id)));
    }
  };

  const toggleOne = (id: Id<"products">) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    setIsProcessing(true);
    try {
      await deleteProduct({ productId: productToDelete.id });
      toast.success(`"${productToDelete.title}" supprimé`);
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productToDelete.id);
        return newSet;
      });
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsProcessing(false);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    setIsProcessing(true);
    try {
      const result = await bulkDeleteProducts({
        productIds: Array.from(selectedIds),
      });
      toast.success(`${result.deleted} produit(s) supprimé(s)`);
      setSelectedIds(new Set());
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkNouveau = async (isNouveau: boolean) => {
    if (selectedIds.size === 0) return;

    setIsProcessing(true);
    try {
      const result = await bulkUpdateNouveau({
        productIds: Array.from(selectedIds),
        isNouveau,
      });
      toast.success(
        `${result.updated} produit(s) ${isNouveau ? "marqué(s) nouveau" : "retiré(s) des nouveautés"}`,
      );
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkStatus = async (status: "draft" | "published") => {
    if (selectedIds.size === 0) return;

    setIsProcessing(true);
    try {
      const result = await bulkUpdateStatus({
        productIds: Array.from(selectedIds),
        status,
      });
      toast.success(
        `${result.updated} produit(s) ${status === "published" ? "publié(s)" : "mis en brouillon"}`,
      );
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher..."
            className="pl-10"
          />
        </div>

        {someSelected && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedIds.size} sélectionné(s)
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isProcessing}>
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleBulkNouveau(true)}>
                  <Star className="mr-2 h-4 w-4" />
                  Marquer nouveau
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkNouveau(false)}>
                  <StarOff className="mr-2 h-4 w-4" />
                  Retirer nouveau
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkStatus("published")}>
                  <Eye className="mr-2 h-4 w-4" />
                  Publier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkStatus("draft")}>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Mettre en brouillon
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleBulkDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Table */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {searchTerm
            ? "Aucun produit ne correspond à votre recherche"
            : "Aucun produit dans la bibliothèque"}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleAll}
                    aria-label="Tout sélectionner"
                  />
                </TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Nouveau</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow
                  key={product._id}
                  className={selectedIds.has(product._id) ? "bg-muted/50" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(product._id)}
                      onCheckedChange={() => toggleOne(product._id)}
                      aria-label={`Sélectionner ${product.title}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 rounded bg-muted overflow-hidden shrink-0">
                        {product.thumbnailUrl ? (
                          <Image
                            src={product.thumbnailUrl}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <FileText className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <span className="font-medium truncate max-w-50]">
                        {product.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {CATEGORY_LABELS[product.category] || product.category}
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
                  <TableCell>
                    {product.isNouveau ? (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <StarOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditProductId(product._id)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setProductToDelete({
                              id: product._id,
                              title: product.title,
                            });
                            setDeleteDialogOpen(true);
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de supprimer &quot;{productToDelete?.title}
              &quot;. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isProcessing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isProcessing ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Product Dialog */}
      <EditProductDialog
        productId={editProductId}
        open={editProductId !== null}
        onOpenChange={(open) => !open && setEditProductId(null)}
      />
    </div>
  );
}
