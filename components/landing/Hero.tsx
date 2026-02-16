import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function Hero() {
  return (
    <section className="overflow-hidden pt-20">
      <div className="py-16 md:py-24">
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <div className="relative text-center">
            <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold md:text-5xl lg:text-6xl">
              30+ produits digitaux prêts à revendre.{" "}
              <span className="text-primary">Licence incluse.</span>
            </h1>

            <p className="text-muted-foreground mx-auto my-6 max-w-2xl text-balance text-lg md:text-xl">
              Ebooks, templates, formations — téléchargez, personnalisez,
              vendez. Sans créer un seul contenu.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/signup">
                  <span className="text-nowrap">Commencer maintenant</span>
                  <ChevronRight className="ml-1 h-4 w-4 opacity-50" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Link href="#pricing">
                  <span className="text-nowrap">Voir le tarif</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Product Preview */}
          <div className="relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl bg-primary/10 md:mt-16">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />

            <div className="bg-background relative m-4 overflow-hidden rounded-xl border border-transparent shadow-xl shadow-black/15 ring-1 ring-black/10 sm:m-6 md:m-8">
              {/* Placeholder for product screenshot */}
              <div className="aspect-[16/10] w-full bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground p-8">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {/* Mock product cards */}
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="aspect-[4/3] rounded-lg bg-foreground/5 flex items-center justify-center"
                      >
                        <span className="text-xs text-muted-foreground">
                          Produit {i}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Bar */}
          <div className="mt-12">
            <p className="text-muted-foreground text-center text-sm">
              Rejoint par des entrepreneurs à travers l&apos;Afrique francophone
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-foreground">150+</span>
                <span className="text-sm text-muted-foreground">
                  entrepreneurs
                </span>
              </div>
              <div className="h-8 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-foreground">500+</span>
                <span className="text-sm text-muted-foreground">
                  téléchargements
                </span>
              </div>
              <div className="h-8 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-foreground">30+</span>
                <span className="text-sm text-muted-foreground">
                  produits PLR
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
