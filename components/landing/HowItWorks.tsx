import { UserPlus, MousePointerClick, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Créez votre compte",
    description: "Inscription en 30 secondes. Accès immédiat à la plateforme.",
  },
  {
    number: "02",
    icon: MousePointerClick,
    title: "Choisissez vos produits",
    description:
      "Parcourez, filtrez, téléchargez. Tout est inclus dans l'abonnement.",
  },
  {
    number: "03",
    icon: Wallet,
    title: "Encaissez vos ventes",
    description:
      "Personnalisez, vendez sur vos canaux, gardez 100% des profits.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-black py-24">
      {/* Background effects */}

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
            3 étapes
          </span>
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Lancez-vous en{" "}
            <span className="text-gradient">moins de 5 minutes</span>
          </h2>
        </div>

        {/* Steps - horizontal on desktop */}
        <div className="relative mt-16">
          {/* Connection line - desktop */}
          <div className="absolute left-[16.67%] right-[16.67%] top-12 hidden h-px bg-gradient-to-r from-primary/50 via-primary to-primary/50 lg:block" />

          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                {/* Step circle */}
                <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-white/10" />

                  {/* Inner circle */}
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-black ring-1 ring-primary/30">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>

                  {/* Number badge */}
                  <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-white/50">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button asChild size="lg" className="shadow-lg shadow-primary/25">
            <Link href="/signup">Commencer gratuitement</Link>
          </Button>
          <p className="mt-4 text-sm text-white/40">
            Pas de carte requise • Annulez à tout moment
          </p>
        </div>
      </div>
    </section>
  );
}
