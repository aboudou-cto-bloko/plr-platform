import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

const benefits = [
  {
    text: "Accès à tous les produits",
    highlight: "30+ ebooks, templates, formations",
  },
  { text: "Téléchargements illimités", highlight: null },
  { text: "Licence PLR complète", highlight: "Revente autorisée" },
  { text: "Fichiers sources éditables", highlight: null },
  { text: "Nouveaux produits chaque semaine", highlight: null },
  { text: "Support par email", highlight: null },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-black py-16 sm:py-20 md:py-24"
    >
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block text-xs font-medium uppercase tracking-wider text-primary sm:mb-4 sm:text-sm">
            Tarif
          </span>
          <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
            Un seul abonnement,{" "}
            <span className="text-gradient">tout inclus</span>
          </h2>
          <p className="mt-3 text-base text-white/60 sm:mt-4 sm:text-lg">
            Accédez à toute la bibliothèque pour moins que le prix d&apos;un
            restaurant.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="mx-auto mt-10 max-w-xl sm:mt-12">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl shadow-primary/5 backdrop-blur-sm sm:rounded-3xl">
            {/* Glow effect */}
            <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/20 via-transparent to-transparent opacity-50 sm:rounded-3xl" />

            <div className="relative p-6 sm:p-8 md:p-10">
              {/* Plan header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white sm:text-xl">
                    Accès Complet
                  </h3>
                  <p className="mt-1 text-sm text-white/50">
                    Tout ce dont vous avez besoin
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary/20 px-2.5 py-1 ring-1 ring-primary/30 sm:px-3">
                  <Sparkles className="h-3 w-3 text-primary sm:h-3.5 sm:w-3.5" />
                  <span className="text-[10px] font-medium text-primary sm:text-xs">
                    Lancement
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-2 sm:mt-8">
                <span className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                  10,000
                </span>
                <div className="flex flex-col">
                  <span className="text-base font-medium text-white sm:text-lg">
                    FCFA
                  </span>
                  <span className="text-sm text-white/50">/mois</span>
                </div>
              </div>

              {/* Value highlight */}
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm ring-1 ring-emerald-500/20">
                <span className="font-medium text-emerald-400">
                  💰 1 vente = 1/2 de l&apos;abo remboursé
                </span>
              </div>

              {/* CTA Button */}
              <div className="mt-6 sm:mt-8">
                <Button
                  asChild
                  size="lg"
                  className="w-full text-base shadow-lg shadow-primary/25"
                >
                  <Link href="/signup">Commencer maintenant</Link>
                </Button>
                <p className="mt-3 text-center text-xs text-white/40 sm:text-sm">
                  Sans engagement · Annulez à tout moment
                </p>
              </div>

              {/* Divider */}
              <div className="my-6 h-px bg-white/10 sm:my-8" />

              {/* Benefits */}
              <div>
                <p className="mb-4 text-sm font-medium text-white">
                  Ce qui est inclus :
                </p>
                <ul className="space-y-2.5 sm:space-y-3">
                  {benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2.5 sm:gap-3"
                    >
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-white sm:text-base">
                          {benefit.text}
                        </span>
                        {benefit.highlight && (
                          <span className="text-xs text-white/50 sm:text-sm">
                            {benefit.highlight}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Trust elements */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-white/50 sm:mt-12 sm:gap-6">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-emerald-400 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-xs sm:text-sm">Paiement sécurisé</span>
          </div>
          <div className="hidden h-4 w-px bg-white/10 sm:block" />
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-primary sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs sm:text-sm">Accès instantané</span>
          </div>
          <div className="hidden h-4 w-px bg-white/10 sm:block" />
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-amber-400 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="text-xs sm:text-sm">Support réactif</span>
          </div>
        </div>
      </div>
    </section>
  );
}
