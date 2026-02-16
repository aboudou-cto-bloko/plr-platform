import { ArrowRight } from "lucide-react";

export function HowItWorks() {
  return (
    <section>
      <div className="py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="mx-auto max-w-2xl">
            <div>
              <h2 className="text-foreground text-3xl font-semibold sm:text-4xl">
                Comment ça marche
              </h2>
              <p className="text-muted-foreground mb-12 mt-4 text-lg sm:text-xl">
                Trois étapes simples pour commencer à vendre des produits
                digitaux dès aujourd&apos;hui. Pas de compétence technique
                requise.
              </p>
            </div>

            <div className="my-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <span className="mb-4 block text-3xl">1️⃣</span>
                <h3 className="text-xl font-medium">Abonnez-vous</h3>
                <p className="text-muted-foreground">
                  Créez votre compte et accédez immédiatement à toute la
                  bibliothèque de produits PLR.
                </p>
              </div>
              <div className="space-y-2">
                <span className="mb-4 block text-3xl">2️⃣</span>
                <h3 className="text-xl font-medium">Téléchargez</h3>
                <p className="text-muted-foreground">
                  Parcourez la bibliothèque et téléchargez les produits qui
                  correspondent à votre niche.
                </p>
              </div>
              <div className="space-y-2">
                <span className="mb-4 block text-3xl">3️⃣</span>
                <h3 className="text-xl font-medium">Revendez</h3>
                <p className="text-muted-foreground">
                  Personnalisez avec votre marque et vendez. Vous gardez 100%
                  des profits.
                </p>
              </div>
            </div>

            <div className="border-t">
              <ul role="list" className="text-muted-foreground mt-8 space-y-2">
                {[
                  { value: "30+", label: "Produits disponibles" },
                  { value: "100%", label: "Des profits pour vous" },
                ].map((stat, index) => (
                  <li key={index} className="-ml-0.5 flex items-center gap-1.5">
                    <ArrowRight className="size-4 opacity-50" />
                    <span className="text-foreground font-medium">
                      {stat.value}
                    </span>{" "}
                    {stat.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
