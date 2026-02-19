import { Button } from "@/components/ui/button";
import { Check, Sparkles, ChevronRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

const benefits = [
  {
    text: "100+ produits disponibles dès aujourd'hui",
    highlight: "Ebooks, templates, formations, scripts",
  },
  {
    text: "Téléchargements illimités",
    highlight: null,
  },
  {
    text: "Licence PLR complète",
    highlight: "Revente autorisée — 100% des profits pour vous",
  },
  {
    text: "Fichiers sources éditables",
    highlight: "Word, Canva, Notion",
  },
  {
    text: "Nouveaux produits ajoutés chaque semaine",
    highlight: null,
  },
  {
    text: "Support réactif par email",
    highlight: "Réponse en moins de 24h",
  },
];

const paymentMethods = [
  { label: "MTN", emoji: "🟡" },
  { label: "Moov", emoji: "🔵" },
  { label: "Orange", emoji: "🟠" },
  { label: "Wave", emoji: "🩵" },
  { label: "Carte", emoji: "💳" },
];

const francophonicCountries = [
  { flag: "🇧🇯", name: "Bénin" },
  { flag: "🇧🇫", name: "Burkina Faso" },
  { flag: "🇧🇮", name: "Burundi" },
  { flag: "🇨🇲", name: "Cameroun" },
  { flag: "🇨🇫", name: "Centrafrique" },
  { flag: "🇰🇲", name: "Comores" },
  { flag: "🇨🇩", name: "RD Congo" },
  { flag: "🇨🇬", name: "Congo" },
  { flag: "🇨🇮", name: "Côte d'Ivoire" },
  { flag: "🇩🇯", name: "Djibouti" },
  { flag: "🇬🇦", name: "Gabon" },
  { flag: "🇬🇳", name: "Guinée" },
  { flag: "🇬🇼", name: "Guinée-Bissau" },
  { flag: "🇲🇬", name: "Madagascar" },
  { flag: "🇲🇱", name: "Mali" },
  { flag: "🇲🇦", name: "Maroc" },
  { flag: "🇲🇷", name: "Mauritanie" },
  { flag: "🇲🇺", name: "Maurice" },
  { flag: "🇳🇪", name: "Niger" },
  { flag: "🇷🇼", name: "Rwanda" },
  { flag: "🇸🇳", name: "Sénégal" },
  { flag: "🇸🇨", name: "Seychelles" },
  { flag: "🇹🇩", name: "Tchad" },
  { flag: "🇹🇬", name: "Togo" },
  { flag: "🇹🇳", name: "Tunisie" },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-[#040D1A] py-16 sm:py-20 md:py-24"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block text-[13px] font-semibold uppercase tracking-widest text-primary sm:mb-4">
            Tarif
          </span>
          <h2 className="text-2xl font-bold leading-[1.1] tracking-[-0.025em] text-white sm:text-3xl md:text-4xl lg:text-5xl">
            Un abonnement.{" "}
            <span className="text-gradient">Toute la bibliothèque.</span>
          </h2>
        </div>

        {/* Layout: Card + Sidebar */}
        <div className="mx-auto mt-10 max-w-4xl sm:mt-12">
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            {/* ── Pricing Card ── */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B1628] shadow-2xl shadow-black/40 sm:rounded-3xl">
              <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/15 via-transparent to-transparent opacity-60 sm:rounded-3xl" />

              <div className="relative p-6 sm:p-8">
                {/* Plan header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-0.01em] text-white sm:text-xl">
                      Accès Complet
                    </h3>
                    <p className="mt-1 text-sm text-white/40">
                      Téléchargements illimités · Droits de revente complets
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 ring-1 ring-primary/25">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span className="text-[10px] font-medium text-primary">
                      Tarif lancement
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-6 flex items-baseline gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black tracking-[-0.03em] text-white md:text-6xl">
                      10,000
                    </span>
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-white">
                        FCFA
                      </span>
                      <span className="text-sm text-white/40">/mois</span>
                    </div>
                  </div>
                  {/* Anchor price — crossed out */}
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-white/20 line-through">
                      25,000
                    </span>
                    <span className="text-[10px] font-medium text-white/25">
                      FCFA/mois
                    </span>
                  </div>
                </div>

                {/* Value highlight */}
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 ring-1 ring-emerald-500/20">
                  <span className="text-sm font-semibold text-emerald-400">
                    💰 Une seule vente à 10,000 FCFA = abonnement remboursé
                  </span>
                </div>

                {/* ── CTA BLOCK — full purchase zone ── */}
                <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <Button
                    asChild
                    size="lg"
                    className="group h-12 w-full rounded-xl text-[15px] font-semibold tracking-[-0.01em] shadow-xl shadow-primary/25 hover:shadow-primary/40"
                  >
                    <Link href="/signup">
                      Accéder maintenant
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>

                {/* Divider */}
                <div className="my-6 h-px bg-white/[0.08]" />

                {/* Benefits */}
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-white/40">
                  Ce qui est inclus
                </p>
                <ul className="space-y-3.5">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary shadow-sm shadow-primary/30">
                        <Check
                          className="h-3 w-3 text-primary-foreground"
                          strokeWidth={3}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] leading-snug text-white">
                          {benefit.text}
                        </span>
                        {benefit.highlight && (
                          <span className="mt-0.5 text-[12px] text-white/35">
                            {benefit.highlight}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="flex flex-col gap-4">
              {/* Geographic coverage */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0B1628] p-5">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
                    Disponible dans
                  </p>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-primary/20">
                    {francophonicCountries.length} pays
                  </span>
                </div>
                <p className="mb-3 text-[11px] text-white/25">
                  Toute l&apos;Afrique francophone
                </p>

                {/* Flag grid — z-50 on tooltips to avoid clipping */}
                <div className="flex flex-wrap gap-1.5">
                  {francophonicCountries.map((country, i) => (
                    <div
                      key={country.name}
                      title={country.name}
                      className="group relative flex h-8 w-8 cursor-default items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04] text-lg transition-all duration-150 hover:scale-110 hover:border-white/[0.15] hover:bg-white/[0.08]"
                    >
                      {country.flag}
                      {/* Tooltip — flip to bottom for first row */}
                      <div
                        className={`pointer-events-none absolute ${
                          i < 5 ? "top-full mt-1.5" : "-top-8"
                        } left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1a2740] px-2 py-1 text-[10px] font-medium text-white/80 opacity-0 shadow-lg ring-1 ring-white/10 transition-opacity duration-150 group-hover:opacity-100`}
                      >
                        {country.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Freemium entry */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0B1628] p-5">
                <p className="text-[14px] font-semibold tracking-[-0.01em] text-white">
                  Pas encore prêt ?
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-white/40">
                  Commencez avec 30 crédits gratuits. Aucune carte requise.
                </p>
                <Link
                  href="/signup"
                  className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:underline"
                >
                  Accéder gratuitement
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Trust signals */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { icon: "🔒", label: "Paiement sécurisé" },
                  { icon: "⚡", label: "Accès instantané" },
                  { icon: "📦", label: "100+ produits" },
                  { icon: "✉️", label: "Support < 24h" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span className="text-[11px] font-medium text-white/45">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
