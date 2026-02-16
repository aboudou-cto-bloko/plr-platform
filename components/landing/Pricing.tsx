import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

const benefits = [
  "Accès à tous les produits de la bibliothèque",
  "Téléchargements illimités",
  "Licence PLR complète incluse",
  "Fichiers sources éditables",
  "Nouveaux produits chaque mois",
  "Support par email",
];

export function Pricing() {
  return (
    <section id="pricing">
      <div className="bg-muted relative py-16 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
              Un prix simple. Une valeur immense.
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance text-lg">
              Accédez à toute la bibliothèque pour moins que le prix d&apos;un
              restaurant.
            </p>
          </div>

          <div className="mt-8 md:mt-16">
            <Card className="relative overflow-hidden">
              <div className="grid items-center gap-12 p-8 md:grid-cols-2 md:divide-x md:p-12">
                {/* Left - Price */}
                <div className="text-center md:pr-12">
                  <h3 className="text-2xl font-semibold">Abonnement Mensuel</h3>
                  <p className="text-muted-foreground mt-2 text-lg">
                    Accès complet à toute la bibliothèque
                  </p>

                  <div className="my-8">
                    <span className="text-6xl font-bold">
                      15,000
                      <span className="text-2xl font-normal text-muted-foreground">
                        {" "}
                        FCFA
                      </span>
                    </span>
                    <span className="text-muted-foreground block text-sm">
                      par mois
                    </span>
                  </div>

                  <div className="flex justify-center">
                    <Button asChild size="lg" className="w-full sm:w-auto">
                      <Link href="/signup">Commencer maintenant</Link>
                    </Button>
                  </div>

                  <p className="text-muted-foreground mt-6 text-sm">
                    Annulez à tout moment. Satisfait ou remboursé sous 7 jours.
                  </p>
                </div>

                {/* Right - Benefits */}
                <div className="md:pl-12">
                  <p className="text-foreground mb-6 font-medium">
                    Ce qui est inclus :
                  </p>
                  <ul role="list" className="space-y-4">
                    {benefits.map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                          <Check
                            className="text-primary size-3"
                            strokeWidth={3}
                          />
                        </div>
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 rounded-lg bg-foreground/5 p-4">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        💡 Le saviez-vous ?
                      </span>{" "}
                      Un seul ebook vendu à 5,000 FCFA rembourse déjà 1/3 de
                      votre abonnement.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
