"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { IconUpload, IconFile, IconPhoto } from "@tabler/icons-react";
import { PRODUCT_CATEGORIES, PRODUCT_NICHES, CREDITS } from "@/lib/constants";
import type { ProductNiche } from "@/convex/constants";
import type { ProductCategory } from "@/convex/constants";

export default function UploadPage() {
  const generateUploadUrl = useMutation(api.admin.generateUploadUrl);
  const createProduct = useMutation(api.admin.createProduct);
  const validateUpload = useMutation(api.admin.validateUpload);

  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: ProductCategory | "";
    niche: ProductNiche | "";
    creditCost: number;
    isNouveau: boolean;
    status: "draft" | "published";
  }>({
    title: "",
    description: "",
    category: "",
    niche: "",
    creditCost: CREDITS.DEFAULT_PRODUCT_COST,
    isNouveau: true,
    status: "draft",
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await validateUpload({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadType: "thumbnail",
      });
      setThumbnailFile(file);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Fichier invalide");
      e.target.value = "";
    }
  };

  const handleProductFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await validateUpload({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadType: "product",
      });
      setProductFile(file);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Fichier invalide");
      e.target.value = "";
    }
  };

  const uploadFile = async (file: File) => {
    const uploadUrl = await generateUploadUrl();
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await response.json();
    return storageId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.category ||
      !formData.niche ||
      !productFile
    ) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    setIsUploading(true);

    try {
      // Upload thumbnail if provided
      let thumbnailId;
      if (thumbnailFile) {
        thumbnailId = await uploadFile(thumbnailFile);
      }

      // Upload product file
      const zipFileId = await uploadFile(productFile);

      // Create product
      await createProduct({
        title: formData.title,
        description: formData.description,
        category: formData.category as ProductCategory,
        niche: formData.niche as ProductNiche,
        creditCost: formData.creditCost,
        thumbnailId,
        zipFileId,
        fileSize: productFile.size,
        isNouveau: formData.isNouveau,
        status: formData.status,
      });

      toast.success("Produit créé avec succès");

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        niche: "",
        creditCost: CREDITS.DEFAULT_PRODUCT_COST,
        isNouveau: true,
        status: "draft",
      });
      setThumbnailFile(null);
      setProductFile(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de la création",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Upload Produit</h1>
        <p className="text-muted-foreground">
          Ajouter un nouveau produit à la bibliothèque
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nouveau produit</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ex: Guide Marketing Digital 2024"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description du produit..."
                rows={4}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Catégorie *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    category: value as ProductCategory,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditCost">Coût en crédits</Label>
              <Input
                id="creditCost"
                type="number"
                min={1}
                max={100}
                value={formData.creditCost}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    creditCost: Math.max(1, Number(e.target.value)),
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Nombre de crédits nécessaires pour télécharger ce produit
                (utilisateurs gratuits)
              </p>
            </div>

            <div className="space-y-2">
              <Label>Niche *</Label>
              <Select
                value={formData.niche}
                onValueChange={(value) =>
                  setFormData({ ...formData, niche: value as ProductNiche })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une niche" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_NICHES.map((niche) => (
                    <SelectItem key={niche.id} value={niche.id}>
                      {niche.icon} {niche.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <Label>Miniature (max 2MB)</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  id="thumbnail"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("thumbnail")?.click()}
                >
                  <IconPhoto className="mr-2 h-4 w-4" />
                  {thumbnailFile ? thumbnailFile.name : "Choisir une image"}
                </Button>
                {thumbnailFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setThumbnailFile(null)}
                  >
                    Supprimer
                  </Button>
                )}
              </div>
            </div>

            {/* Product File */}
            <div className="space-y-2">
              <Label>Fichier produit (ZIP, PDF, etc.) *</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".zip,.pdf,.docx"
                  onChange={handleProductFileChange}
                  className="hidden"
                  id="productFile"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("productFile")?.click()
                  }
                >
                  <IconFile className="mr-2 h-4 w-4" />
                  {productFile ? productFile.name : "Choisir un fichier"}
                </Button>
                {productFile && (
                  <>
                    <span className="text-sm text-muted-foreground">
                      {(productFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setProductFile(null)}
                    >
                      Supprimer
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Switch
                  id="isNouveau"
                  checked={formData.isNouveau}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isNouveau: checked })
                  }
                />
                <Label htmlFor="isNouveau">Marquer comme nouveau</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="published"
                  checked={formData.status === "published"}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      status: checked ? "published" : "draft",
                    })
                  }
                />
                <Label htmlFor="published">Publier immédiatement</Label>
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" disabled={isUploading} className="w-full">
              {isUploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Upload en cours...
                </>
              ) : (
                <>
                  <IconUpload className="mr-2 h-4 w-4" />
                  Créer le produit
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
