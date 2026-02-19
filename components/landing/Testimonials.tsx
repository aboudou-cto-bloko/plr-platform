"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  TrendingUp,
  Lock,
  Zap,
  Package,
  Mail,
  Quote,
} from "lucide-react";
import Link from "next/link";

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-[#040D1A] py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="mb-4 inline-block text-[13px] font-semibold uppercase tracking-widest text-primary">
            Lancement
          </span>
          <h2 className="text-3xl font-bold leading-[1.1] tracking-[-0.025em] text-white sm:text-4xl lg:text-5xl">
            PLR Library vient de lancer.
          </h2>
          <p className="mt-3 text-xl font-semibold sm:text-2xl">
            <span className="text-gradient">Les places sont limitées.</span>
          </p>
        </div>

        {/* ── BENTO GRID ── */}
        <div className="grid auto-rows-auto grid-cols-4 gap-3 sm:gap-4">
          {/* [1] FOUNDER CARD — 2 cols, portrait */}
          <div className="group relative col-span-4 overflow-hidden rounded-2xl sm:col-span-2 sm:min-h-[400px]">
            {/* Layered background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a0533] via-[#0c1a3a] to-[#040D1A]" />
            {/* Noise texture */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
              }}
            />
            {/* Radial glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />
            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            {/* Badge top-left */}
            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1.5 backdrop-blur-sm ring-1 ring-primary/25">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              <span className="text-[11px] font-semibold text-primary">
                Fondateur
              </span>
            </div>

            {/* Quote icon top-right */}
            <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.07] backdrop-blur-sm ring-1 ring-white/10">
              <Quote className="h-4 w-4 text-white/50" />
            </div>

            {/* Decorative letter — center */}
            <div className="absolute inset-x-0 top-1/2 flex -translate-y-2/3 items-center justify-center">
              <span className="select-none text-[180px] font-black leading-none tracking-tighter text-white/[0.02]">
                PLR
              </span>
            </div>

            {/* Content */}
            <div className="relative p-6 pt-16 sm:p-8 sm:pt-20">
              {/* Spacer to push content to bottom */}
              <div className="h-20 sm:h-32" />

              <p className="mb-6 text-[15px] leading-[1.8] text-white/70">
                &ldquo;Nous n&apos;avons pas 10,000 témoignages à vous montrer —
                nous venons de lancer.{" "}
                <span className="text-white/90">
                  Ce que nous avons : un catalogue prêt, une infrastructure
                  solide, et un tarif qui ne durera pas.
                </span>
                &rdquo;
              </p>

              <div className="flex items-center gap-3 border-t border-white/[0.07] pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-primary/10 text-[14px] font-bold text-primary ring-1 ring-primary/30">
                  F
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-white">
                    Le Fondateur
                  </div>
                  <div className="text-[11px] text-white/30">
                    PLR Library · Cotonou, Bénin · 2025
                  </div>
                </div>
              </div>
            </div>

            {/* Hover ring */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/[0.07] transition-all duration-500 group-hover:ring-primary/25" />
          </div>

          {/* RIGHT COLUMN — 2 cols, stacked */}
          <div className="col-span-4 flex flex-col gap-3 sm:col-span-2 sm:gap-4">
            {/* [2+3] Stats row */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Produits */}
              <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 ring-1 ring-primary/10">
                <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />
                <div className="text-xl">📦</div>
                <div className="mt-3 text-4xl font-black tracking-[-0.03em] text-primary">
                  100+
                </div>
                <div className="mt-1.5 text-[12px] font-semibold text-white">
                  Produits dispo
                </div>
                <div className="mt-0.5 text-[10px] text-white/30">
                  dès aujourd&apos;hui
                </div>
              </div>

              {/* Droits */}
              <div className="relative overflow-hidden rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-5 ring-1 ring-emerald-500/10">
                <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-emerald-500/10 blur-2xl" />
                <div className="text-xl">✅</div>
                <div className="mt-3 text-4xl font-black tracking-[-0.03em] text-emerald-400">
                  100%
                </div>
                <div className="mt-1.5 text-[12px] font-semibold text-white">
                  Droits de revente
                </div>
                <div className="mt-0.5 text-[10px] text-white/30">
                  sur chaque produit
                </div>
              </div>
            </div>

            {/* [4] Urgence */}
            <div className="flex items-start gap-4 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] to-transparent p-5 ring-1 ring-amber-500/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-xl ring-1 ring-amber-500/20">
                ⏳
              </div>
              <div>
                <p className="text-[14px] font-semibold text-amber-400">
                  10,000 FCFA — tarif de lancement.
                </p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-white/40">
                  Il augmentera dès le premier palier.{" "}
                  <span className="font-medium text-white/65">
                    Les inscrits actuels conservent leur tarif à vie.
                  </span>
                </p>
              </div>
            </div>

            {/* [5] Trust grid 2x2 */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                {
                  Icon: Lock,
                  label: "Paiement sécurisé",
                  color: "text-white/40",
                },
                {
                  Icon: Zap,
                  label: "Accès instantané",
                  color: "text-amber-400/70",
                },
                {
                  Icon: Package,
                  label: "100+ produits",
                  color: "text-primary/80",
                },
                {
                  Icon: Mail,
                  label: "Support < 24h",
                  color: "text-emerald-400/70",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
                >
                  <item.Icon className={`h-3.5 w-3.5 shrink-0 ${item.color}`} />
                  <span className="text-[11px] font-medium text-white/45">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* [6] Catalogue — 3 cols */}
          <div className="col-span-4 rounded-2xl border border-white/[0.07] bg-[#0B1628] p-5 sm:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30">
                Dans la bibliothèque aujourd&apos;hui
              </p>
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 ring-1 ring-primary/20">
                <TrendingUp className="h-3 w-3 text-primary" />
                <span className="text-[11px] font-medium text-primary">
                  +4 cette semaine
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                {
                  emoji: "📚",
                  label: "Ebooks",
                  count: "30+",
                  color: "group-hover:border-blue-500/20",
                },
                {
                  emoji: "🎨",
                  label: "Templates",
                  count: "25+",
                  color: "group-hover:border-purple-500/20",
                },
                {
                  emoji: "🎓",
                  label: "Formations",
                  count: "20+",
                  color: "group-hover:border-amber-500/20",
                },
                {
                  emoji: "📝",
                  label: "Scripts & Kits",
                  count: "25+",
                  color: "group-hover:border-emerald-500/20",
                },
              ].map((cat) => (
                <div
                  key={cat.label}
                  className={`group flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3 transition-all duration-200 hover:bg-white/[0.05] ${cat.color}`}
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <div>
                    <div className="text-[12px] font-semibold text-white">
                      {cat.label}
                    </div>
                    <div className="text-[10px] text-white/35">{cat.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* [7] Prix — 1 col */}
          <div className="col-span-4 flex flex-col justify-between rounded-2xl border border-amber-500/15 bg-gradient-to-br from-amber-500/[0.08] via-amber-500/[0.04] to-transparent p-5 ring-1 ring-amber-500/10 sm:col-span-1">
            <div className="text-xl">🏷️</div>
            <div>
              <div className="mt-3 text-4xl font-black tracking-[-0.03em] text-amber-400">
                10K
              </div>
              <div className="mt-1.5 text-[12px] font-semibold text-white">
                FCFA / mois
              </div>
              <div className="mt-0.5 text-[10px] text-white/30">
                tarif de lancement
              </div>
            </div>
          </div>

          {/* [8] CTA — full width */}
          <div className="col-span-4 flex flex-col items-center overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-primary/10 via-primary/[0.05] to-transparent p-8 text-center ring-1 ring-primary/10 sm:p-10">
            {/* Glow behind button */}
            <div className="pointer-events-none absolute h-32 w-64 rounded-full bg-primary/10 blur-3xl" />

            <p className="relative mb-2 text-base font-semibold text-white sm:text-lg">
              Votre premier produit attend dans la bibliothèque.
            </p>
            <p className="relative mb-6 text-sm text-white/40">
              Accès immédiat. Aucun effort requis.
            </p>

            <Button
              asChild
              size="lg"
              className="group relative h-12 gap-1.5 rounded-xl px-10 text-[15px] font-semibold tracking-[-0.01em] shadow-xl shadow-primary/25 hover:shadow-primary/40"
            >
              <Link href="/signup">
                Accéder gratuitement
                <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
