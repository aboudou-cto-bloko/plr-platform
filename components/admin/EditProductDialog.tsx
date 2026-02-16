"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

type CategoryType = "ebook" | "template" | "formation" | "kit" | "script";

const CATEGORIES: { id: CategoryType; label: string }[] = [
  { id: "ebook", label: "Ebook / Guide" },
  { id: "template", label: "Template" },
  { id: "formation", label: "Mini-formation" },
  { id: "kit", label: "Kit marketing" },
  { id: "script", label: "Script / Email" },
];

interface EditProductDialogProps {
  productId: Id<"products"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProductDialog({
  productId,
  open,
  onOpenChange,
}: EditProductDialogProps) {
  const product = useQuery(
    api.admin.getProductForEdit,
    productId ? { productId } : "skip",
  );
  const updateProduct = useMutation(api.admin.updateProduct);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CategoryType>("ebook");
  const [description, setDescription] = useState("");
  const [isNouveau, setIsNouveau] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("published");

  // Populate form when product loads
  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setCategory(product.category);
      setDescription(product.description);
      setIsNouveau(product.isNouveau);
      setStatus(product.status);
    }
  }, [product]);

  const handleSubmit = async () => {
    if (!productId || !title.trim() || !description.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProduct({
        productId,
        title: title.trim(),
        category,
        description: description.trim(),
        isNouveau,
        status,
      });

      toast.success("Produit mis à jour");
      onOpenChange(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier le produit</DialogTitle>
          <DialogDescription>
            Modifiez les informations du produit
          </DialogDescription>
        </DialogHeader>

        {product === undefined ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : product === null ? (
          <div className="text-center py-8 text-muted-foreground">
            Produit non trouvé
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre du produit"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as CategoryType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description du produit"
                rows={4}
              />
            </div>

            {/* Options */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isNouveau"
                  checked={isNouveau}
                  onCheckedChange={(checked) => setIsNouveau(checked === true)}
                />
                <Label htmlFor="isNouveau" className="font-normal">
                  Marquer comme nouveau
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="published"
                  checked={status === "published"}
                  onCheckedChange={(checked) =>
                    setStatus(checked ? "published" : "draft")
                  }
                />
                <Label htmlFor="published" className="font-normal">
                  Publié
                </Label>
              </div>
            </div>

            {/* Thumbnail Preview */}
            {product.thumbnailUrl && (
              <div className="space-y-2">
                <Label>Image actuelle</Label>
                <div className="w-32 h-24 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={product.thumbnailUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !product}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
