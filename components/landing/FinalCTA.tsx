import { Button } from "@/components/ui/button";
import { ChevronRight, Shield } from "lucide-react";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section>
      <div className="bg-foreground py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-background max-w-xl text-balance text-3xl font-semibold lg:text-4xl">
            Prêt à lancer votre business digital ?
          </h2>
          <p className="text-background/70 mt-4 max-w-xl text-lg">
            Rejoignez 150+ entrepreneurs qui vendent déjà des produits PLR.
            Accès immédiat à toute la bibliothèque.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-background text-foreground hover:bg-background/90"
            >
              <Link href="/signup">
                Commencer maintenant
                <ChevronRight
                  strokeWidth={2.5}
                  className="ml-1 size-4 opacity-50"
                />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-background/20 bg-transparent text-background hover:bg-background/10"
            >
              <Link href="#pricing">
                <Shield className="mr-2 size-4 opacity-70" strokeWidth={2} />
                Garantie 7 jours
              </Link>
            </Button>
          </div>

          <p className="text-background/50 mt-6 text-sm">
            15,000 FCFA/mois • Annulez à tout moment • Satisfait ou remboursé
          </p>
        </div>
      </div>
    </section>
  );
}
