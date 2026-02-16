import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple Header */}
      <header className="border-b">
        <div className="container flex h-14 items-center px-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <IconArrowLeft className="mr-2 h-4 w-4" />
              Retour à l&apos;accueil
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Simple Footer */}
      <footer className="border-t py-6">
        <div className="container px-4">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-sm text-muted-foreground">
              © 2025 PLR Library. Tous droits réservés.
            </p>
            <nav className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground">
                CGU
              </Link>
              <Link href="/privacy" className="hover:text-foreground">
                Confidentialité
              </Link>
              <Link href="/license" className="hover:text-foreground">
                Licence PLR
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
