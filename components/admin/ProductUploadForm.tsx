"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Id } from "@/convex/_generated/dataModel";

type CategoryType = "ebook" | "template" | "formation" | "kit" | "script";

const CATEGORIES: { id: CategoryType; label: string }[] = [
  { id: "ebook", label: "Ebook / Guide" },
  { id: "template", label: "Template" },
  { id: "formation", label: "Mini-formation" },
  { id: "kit", label: "Kit marketing" },
  { id: "script", label: "Script / Email" },
];

export function ProductUploadForm() {
  const router = useRouter();
  const generateUploadUrl = useMutation(api.admin.generateUploadUrl);
  const createProduct = useMutation(api.admin.createProduct);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CategoryType>("ebook");
  const [description, setDescription] = useState("");
  const [isNouveau, setIsNouveau] = useState(true);
  const [status, setStatus] = useState<"draft" | "published">("published");

  // File state
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setZipFile(file);
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
    setError(null);

    if (!title.trim()) {
      setError("Le titre est requis");
      return;
    }

    if (!description.trim()) {
      setError("La description est requise");
      return;
    }

    if (!zipFile) {
      setError("Le fichier ZIP est requis");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload ZIP file
      const zipFileId = await uploadFile(zipFile);

      // Upload thumbnail if provided
      let thumbnailId: Id<"_storage"> | undefined;
      if (thumbnailFile) {
        thumbnailId = await uploadFile(thumbnailFile);
      }

      // Create product
      await createProduct({
        title: title.trim(),
        category,
        description: description.trim(),
        thumbnailId,
        zipFileId,
        isNouveau,
        status,
      });

      router.push("/admin/library");
    } catch (err) {
      console.error("Upload error:", err);
      setError("Une erreur est survenue lors de l'upload");
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("ebook");
    setDescription("");
    setIsNouveau(true);
    setStatus("published");
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setZipFile(null);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    if (zipInputRef.current) zipInputRef.current.value = "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-foreground"
        >
          Titre du produit *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Guide complet du marketing digital"
          className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-foreground"
        >
          Catégorie *
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryType)}
          className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-foreground"
        >
          Description *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez le contenu du produit..."
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
        <p className="text-xs text-muted-foreground">
          {description.length}/300 caractères recommandés
        </p>
      </div>

      {/* Thumbnail */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Image de couverture
        </label>
        <div className="flex items-start gap-4">
          <div
            onClick={() => thumbnailInputRef.current?.click()}
            className="w-32 h-24 rounded-lg border-2 border-dashed border-border bg-muted flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
          >
            {thumbnailPreview ? (
              <Image
                src={thumbnailPreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground text-xs text-center px-2">
                Cliquer pour ajouter
              </span>
            )}
          </div>
          <div className="flex-1 space-y-1">
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="hidden"
            />
            <p className="text-sm text-muted-foreground">
              Format recommandé : 800x600px, JPG ou PNG
            </p>
            {thumbnailFile && (
              <p className="text-sm text-foreground">{thumbnailFile.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* ZIP File */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Fichier produit (ZIP) *
        </label>
        <div
          onClick={() => zipInputRef.current?.click()}
          className="w-full p-6 rounded-lg border-2 border-dashed border-border bg-muted flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
        >
          <input
            ref={zipInputRef}
            type="file"
            accept=".zip"
            onChange={handleZipChange}
            className="hidden"
          />
          {zipFile ? (
            <>
              <svg
                className="w-8 h-8 text-primary mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-foreground font-medium">
                {zipFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(zipFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </>
          ) : (
            <>
              <svg
                className="w-8 h-8 text-muted-foreground mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-sm text-muted-foreground">
                Cliquez pour sélectionner un fichier ZIP
              </p>
            </>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-6">
        {/* Is Nouveau */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isNouveau}
            onChange={(e) => setIsNouveau(e.target.checked)}
            className="w-4 h-4 rounded border-input text-primary focus:ring-ring"
          />
          <span className="text-sm text-foreground">Marquer comme nouveau</span>
        </label>

        {/* Status */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              checked={status === "published"}
              onChange={() => setStatus("published")}
              className="w-4 h-4 border-input text-primary focus:ring-ring"
            />
            <span className="text-sm text-foreground">Publier</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              checked={status === "draft"}
              onChange={() => setStatus("draft")}
              className="w-4 h-4 border-input text-primary focus:ring-ring"
            />
            <span className="text-sm text-foreground">Brouillon</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t border-border">
        <button
          type="button"
          onClick={resetForm}
          disabled={isSubmitting}
          className="px-6 py-2 rounded-lg border border-border text-foreground hover:bg-accent transition-colors disabled:opacity-50"
        >
          Réinitialiser
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSubmitting ? "Upload en cours..." : "Créer le produit"}
        </button>
      </div>
    </form>
  );
}
