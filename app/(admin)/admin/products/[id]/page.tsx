// app/(admin)/admin/products/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  IconArrowLeft,
  IconPhoto,
  IconFile,
  IconTrash,
  IconDeviceFloppy,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { toast } from "sonner";
import Link from "next/link";
import { PRODUCT_CATEGORIES, PRODUCT_NICHES, CREDITS } from "@/lib/constants";
import type { ProductNiche } from "@/convex/constants";

import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";

type ProductCategory = "ebook" | "template" | "formation" | "kit" | "script";

export default function ProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as Id<"products">;

  const product = useQuery(api.admin.getProductForEdit, { productId });
  const generateUploadUrl = useMutation(api.admin.generateUploadUrl);
  const updateProduct = useMutation(api.admin.updateProduct);
  const deleteProduct = useMutation(api.admin.deleteProduct);
  const validateUpload = useMutation(api.admin.validateUpload);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: ProductCategory | "";
    creditCost: number | "";
    niche: ProductNiche | "";
    isNouveau: boolean;
    status: "draft" | "published";
  }>({
    title: "",
    description: "",
    category: "",
    creditCost: "",
    niche: "",
    isNouveau: false,
    status: "draft",
  });

  const [newThumbnail, setNewThumbnail] = useState<File | null>(null);
  const [newProductFile, setNewProductFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Load product data into form
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description || "",
        category: product.category,
        creditCost: product.creditCost || "",
        niche: product.niche || "",
        isNouveau: product.isNouveau,
        status: product.status,
      });
      if (product.thumbnailUrl) {
        setThumbnailPreview(product.thumbnailUrl);
      }
    }
  }, [product]);

  if (product === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-muted-foreground">Produit non trouvé</p>
        <Button variant="outline" asChild>
          <Link href="/admin/products">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Retour aux produits
          </Link>
        </Button>
      </div>
    );
  }

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

      setNewThumbnail(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
      setNewProductFile(file);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Fichier invalide");
      e.target.value = "";
    }
  };

  const uploadFile = async (file: File): Promise<Id<"_storage">> => {
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

    if (!formData.title || !formData.category) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    setIsLoading(true);

    try {
      const updates: Parameters<typeof updateProduct>[0] = {
        productId,
        title: formData.title,
        description: formData.description,
        category: formData.category as ProductCategory,
        creditCost:
          (formData.creditCost as number) ?? CREDITS.DEFAULT_PRODUCT_COST,
        niche: formData.niche as ProductNiche,
        isNouveau: formData.isNouveau,
        status: formData.status,
      };

      // Upload new thumbnail if provided
      if (newThumbnail) {
        updates.thumbnailId = await uploadFile(newThumbnail);
      }

      // Upload new product file if provided
      if (newProductFile) {
        updates.zipFileId = await uploadFile(newProductFile);
        updates.fileSize = newProductFile.size;
      }

      await updateProduct(updates);

      toast.success("Produit mis à jour");
      router.push("/admin/products");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de la mise à jour",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct({ productId });
      toast.success("Produit supprimé");
      router.push("/admin/products");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
      setIsDeleting(false);
    }
  };

  const handleQuickStatusToggle = async () => {
    const newStatus = formData.status === "published" ? "draft" : "published";
    setFormData({ ...formData, status: newStatus });

    try {
      await updateProduct({
        productId,
        status: newStatus,
      });
      toast.success(
        newStatus === "published" ? "Produit publié" : "Produit dépublié",
      );
    } catch (error) {
      // Revert on error
      setFormData({ ...formData, status: formData.status });
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/products">
              <IconArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Modifier le produit</h1>
            <p className="text-muted-foreground text-sm">
              Créé{" "}
              {formatDistanceToNow(product._creationTime, {
                addSuffix: true,
                locale: fr,
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleQuickStatusToggle}>
            {formData.status === "published" ? (
              <>
                <IconEyeOff className="mr-2 h-4 w-4" />
                Dépublier
              </>
            ) : (
              <>
                <IconEye className="mr-2 h-4 w-4" />
                Publier
              </>
            )}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <IconTrash className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
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
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Suppression..." : "Supprimer"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            {/* Files */}
            <Card>
              <CardHeader>
                <CardTitle>Fichiers</CardTitle>
                <CardDescription>
                  Laissez vide pour conserver les fichiers actuels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Thumbnail */}
                <div className="space-y-2">
                  <Label>Miniature</Label>
                  <div className="flex items-start gap-4">
                    {thumbnailPreview ? (
                      <Image
                        src={thumbnailPreview}
                        alt="Aperçu"
                        className="h-24 w-24 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center">
                        <IconPhoto className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
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
                        size="sm"
                        onClick={() =>
                          document.getElementById("thumbnail")?.click()
                        }
                      >
                        <IconPhoto className="mr-2 h-4 w-4" />
                        {newThumbnail ? "Changer" : "Remplacer la miniature"}
                      </Button>
                      {newThumbnail && (
                        <p className="text-sm text-muted-foreground">
                          Nouveau fichier : {newThumbnail.name}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG ou WebP. Max 2MB.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Product File */}
                <div className="space-y-2">
                  <Label>Fichier produit</Label>
                  <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-muted p-2">
                          <IconFile className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {newProductFile
                              ? newProductFile.name
                              : `${product.title}.zip`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {newProductFile
                              ? `${(newProductFile.size / 1024 / 1024).toFixed(2)} MB (nouveau)`
                              : product.fileSize
                                ? `${(product.fileSize / 1024 / 1024).toFixed(2)} MB`
                                : "Taille inconnue"}
                          </p>
                        </div>
                      </div>
                      {!newProductFile && (
                        <Badge variant="outline">Fichier actuel</Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
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
                        size="sm"
                        onClick={() =>
                          document.getElementById("productFile")?.click()
                        }
                      >
                        <IconFile className="mr-2 h-4 w-4" />
                        Remplacer le fichier
                      </Button>
                      {newProductFile && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setNewProductFile(null)}
                        >
                          Annuler
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Statut</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Publié</p>
                    <p className="text-sm text-muted-foreground">
                      Visible dans la bibliothèque
                    </p>
                  </div>
                  <Switch
                    checked={formData.status === "published"}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        status: checked ? "published" : "draft",
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Nouveau</p>
                    <p className="text-sm text-muted-foreground">
                      Afficher le badge &quot;Nouveau&quot;
                    </p>
                  </div>
                  <Switch
                    checked={formData.isNouveau}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isNouveau: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Téléchargements
                  </span>
                  <span className="font-medium">
                    {product.downloadCount || 0}
                  </span>
                </div>
                {product.publishedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Publié
                    </span>
                    <span className="text-sm">
                      {formatDistanceToNow(product.publishedAt, {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <IconDeviceFloppy className="mr-2 h-4 w-4" />
                      Enregistrer les modifications
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
