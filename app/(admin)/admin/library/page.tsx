import { LibraryTable } from "@/components/admin/LibraryTable";
import Link from "next/link";

export default function AdminLibraryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Gestion de la bibliothèque
          </h1>
          <p className="text-muted-foreground">
            Gérer, modifier et supprimer les produits
          </p>
        </div>
        <Link
          href="/admin/upload"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          + Nouveau produit
        </Link>
      </div>

      <div className="p-6 rounded-lg bg-card border border-border">
        <LibraryTable />
      </div>
    </div>
  );
}
