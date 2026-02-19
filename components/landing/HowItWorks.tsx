import {
  UserPlus,
  MousePointerClick,
  Wallet,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Créez votre compte",
    description:
      "Email + mot de passe. C'est tout. 30 crédits offerts, aucune carte requise.",
    detail: "Accès immédiat à la bibliothèque",
    color: "from-violet-500/20 to-violet-500/5",
    ring: "ring-violet-500/30",
    iconColor: "text-violet-400",
    accentColor: "bg-violet-500",
    side: "right" as const,
  },
  {
    number: "02",
    icon: MousePointerClick,
    title: "Choisissez vos produits",
    description:
      "Parcourez la bibliothèque. Filtrez par niche. Téléchargez ce qui correspond à votre audience.",
    detail: "Fichiers sources éditables inclus",
    color: "from-primary/20 to-primary/5",
    ring: "ring-primary/30",
    iconColor: "text-primary",
    accentColor: "bg-primary",
    side: "left" as const,
  },
  {
    number: "03",
    icon: Wallet,
    title: "Encaissez vos ventes",
    description:
      "Ajoutez votre nom, votre logo, votre prix. Publiez. La première vente rembourse l'abonnement.",
    detail: "Vous gardez 100% des profits",
    color: "from-emerald-500/20 to-emerald-500/5",
    ring: "ring-emerald-500/30",
    iconColor: "text-emerald-400",
    accentColor: "bg-emerald-500",
    side: "right" as const,
  },
];

function StepCard({
  step,
  isRight,
}: {
  step: (typeof steps)[0];
  isRight: boolean;
}) {
  return (
    <div className="group/card relative w-full rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] md:p-6">
      {/* Colored side accent — mirrors based on side */}
      <div
        className={`absolute ${isRight ? "left-0" : "right-0"} top-4 bottom-4 w-[2px] rounded-full ${step.accentColor} opacity-40 transition-opacity duration-300 group-hover/card:opacity-70`}
      />
      <div className={isRight ? "pl-2" : "pr-2 text-right"}>
        <h3 className="text-[17px] font-semibold tracking-[-0.015em] text-white md:text-[19px]">
          {step.title}
        </h3>
        <p className="mt-2 text-[13px] leading-[1.7] text-white/50 md:text-[14px]">
          {step.description}
        </p>
        <div
          className={`mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 ${!isRight ? "flex-row-reverse" : ""}`}
        >
          <div
            className={`h-1.5 w-1.5 rounded-full ${step.accentColor} opacity-80`}
          />
          <span className="text-[11px] font-medium tracking-[0.01em] text-white/40">
            {step.detail}
          </span>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-[#040D1A] py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block text-[13px] font-semibold uppercase tracking-widest text-primary">
            3 étapes
          </span>
          <h2 className="text-3xl font-bold leading-[1.1] tracking-[-0.025em] text-white sm:text-4xl lg:text-5xl">
            De zéro à votre premier produit{" "}
            <span className="text-gradient">en vente — aujourd&apos;hui.</span>
          </h2>
        </div>

        {/* ── ZIGZAG TIMELINE ── */}
        <div className="relative mt-16 md:mt-20">
          {/* Center vertical axis line */}
          <div className="absolute bottom-4 left-1/2 top-4 hidden w-px -translate-x-1/2 md:block">
            <div className="h-full w-full bg-gradient-to-b from-violet-500/50 via-primary/50 to-emerald-500/50 opacity-30" />
          </div>

          <div className="flex flex-col">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isRight = step.side === "right";
              const isLast = index === steps.length - 1;

              return (
                <div key={index} className="group relative">
                  {/* ── DESKTOP ── */}
                  <div className="hidden items-center md:flex">
                    {/* LEFT SLOT */}
                    <div className="flex w-[calc(50%-52px)] items-center justify-end">
                      {!isRight && <StepCard step={step} isRight={false} />}
                    </div>

                    {/* CENTER NODE */}
                    <div className="relative z-10 flex w-[104px] flex-shrink-0 flex-col items-center">
                      <div
                        className={`relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br ${step.color} ring-1 ${step.ring} transition-all duration-300 group-hover:scale-105`}
                      >
                        <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#040D1A] ring-1 ring-white/10 transition-all duration-300 group-hover:ring-white/20">
                          <Icon className={`h-5 w-5 ${step.iconColor}`} />
                        </div>
                        <div
                          className={`absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full ${step.accentColor} text-[10px] font-bold text-white shadow-lg`}
                        >
                          {step.number}
                        </div>
                      </div>

                      {/* Connector */}
                      {!isLast && (
                        <div className="flex flex-col items-center gap-1.5 py-3">
                          <div className="h-5 w-px bg-gradient-to-b from-white/25 to-transparent" />
                          <div className="h-1 w-1 rounded-full bg-white/20" />
                          <div className="h-1 w-1 rounded-full bg-white/12" />
                          <div className="h-5 w-px bg-gradient-to-b from-transparent to-white/20" />
                        </div>
                      )}
                    </div>

                    {/* RIGHT SLOT */}
                    <div className="flex w-[calc(50%-52px)] items-center justify-start">
                      {isRight && <StepCard step={step} isRight={true} />}
                    </div>
                  </div>

                  {/* ── MOBILE: always vertical ── */}
                  <div className="flex gap-5 md:hidden">
                    <div className="flex flex-col items-center">
                      <div
                        className={`relative flex h-[60px] w-[60px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${step.color} ring-1 ${step.ring}`}
                      >
                        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#040D1A] ring-1 ring-white/10">
                          <Icon className={`h-4 w-4 ${step.iconColor}`} />
                        </div>
                        <div
                          className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full ${step.accentColor} text-[9px] font-bold text-white shadow`}
                        >
                          {step.number}
                        </div>
                      </div>
                      {!isLast && (
                        <div className="flex flex-col items-center gap-1 py-2">
                          <div className="h-6 w-px bg-gradient-to-b from-white/15 to-transparent" />
                          <div className="h-1 w-1 rounded-full bg-white/15" />
                          <div className="h-5 w-px bg-gradient-to-b from-transparent to-white/10" />
                        </div>
                      )}
                    </div>
                    <div className={`flex-1 ${!isLast ? "pb-8" : ""}`}>
                      <StepCard step={step} isRight={true} />
                    </div>
                  </div>

                  {/* Bottom spacing between steps */}
                  {!isLast && <div className="hidden md:block md:h-2" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 text-center md:mt-16">
          <Button
            asChild
            size="lg"
            className="group h-12 gap-1.5 rounded-xl px-7 text-[15px] font-semibold tracking-[-0.01em] shadow-xl shadow-primary/25 hover:shadow-primary/40"
          >
            <Link href="/signup">
              Accéder gratuitement
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
          <p className="mt-4 text-[13px] tracking-wide text-white/30">
            30 crédits offerts · Mobile Money · Aucune carte requise
          </p>
        </div>
      </div>
    </section>
  );
}
