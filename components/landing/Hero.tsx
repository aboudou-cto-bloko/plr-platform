import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Download, BookOpen, FileText } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#040D1A] pt-20">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
      >
        <source src="/videos/hero-bg-3.mp4" type="video/mp4" />
      </video>

      {/* Layered atmospheric gradients — more depth, less flat */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#040D1A]/90 via-[#040D1A]/30 to-[#040D1A]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#040D1A]/70 via-transparent to-[#040D1A]/70" />

      {/* Primary glow — slightly repositioned upward for visual weight */}
      <div className="pointer-events-none absolute inset-x-0 top-[15%] h-[700px] bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,_var(--tw-gradient-stops))] from-primary/20 via-blue-900/8 to-transparent blur-3xl" />
      {/* Secondary glow — warm accent bottom left */}
      <div className="pointer-events-none absolute bottom-[10%] left-[5%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 py-20 md:py-28 lg:py-36">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            {/* ── BADGE ── refined with tighter tracking and cleaner dot */}
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/[0.07] px-5 py-2.5 backdrop-blur-md ring-1 ring-inset ring-white/[0.04]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-[13px] font-medium tracking-wide text-white/75">
                100+ produits prêts à revendre — accès immédiat
              </span>
            </div>

            {/* ── H1 ── larger, tighter tracking, better line-height */}
            <h1 className="mx-auto max-w-3xl text-balance text-[2.75rem] font-bold leading-[1.08] tracking-[-0.03em] text-white md:text-[3.5rem] lg:text-[4.25rem]">
              Vendez des produits digitaux.{" "}
              <span className="text-gradient">Sans en créer un seul.</span>
            </h1>

            {/* ── CTAs ── more defined, refined shadow */}
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-12 w-full gap-1.5 rounded-xl px-7 text-[15px] font-semibold tracking-[-0.01em] shadow-xl shadow-primary/25 transition-all duration-200 hover:shadow-primary/40 sm:w-auto"
              >
                <Link href="/signup">
                  <span>Accéder gratuitement</span>
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 w-full rounded-xl border-white/12 bg-white/[0.035] px-7 text-[15px] font-medium tracking-[-0.01em] text-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white/[0.07] hover:text-white sm:w-auto"
              >
                <Link href="#pricing">Voir le tarif</Link>
              </Button>
            </div>

            {/* ── MICRO-COPY ── */}
            <p className="mt-4 text-[13px] tracking-wide text-white/30">
              Aucune carte requise · Mobile Money accepté · 30 crédits offerts
            </p>

            {/* ── VALUE PROPS ── tighter, refined */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2.5 text-[13px] text-white/45">
              <span className="flex items-center gap-2">
                <Download className="h-3.5 w-3.5 text-primary" />
                Téléchargements illimités
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-white/15 sm:block" />
              <span className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-primary" />
                Droits de revente inclus
              </span>
            </div>
          </div>

          {/* ── DASHBOARD MOCKUP ── */}
          <div className="relative mx-auto mt-16 max-w-4xl md:mt-24">
            {/* Outer glow */}
            <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/30 via-primary/10 to-transparent blur-xl opacity-70" />
            {/* Subtle border glow ring */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 0%, transparent 30%)",
                maskImage:
                  "linear-gradient(to bottom, black 0%, transparent 30%)",
              }}
            />

            <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#070E1C] shadow-[0_32px_80px_-12px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-sm">
              {/* ── Browser chrome ── */}
              <div className="flex items-center gap-2 border-b border-white/[0.07] bg-[#050B17] px-4 py-3.5">
                <div className="flex gap-1.5">
                  <div className="h-[9px] w-[9px] rounded-full bg-[#FF5F57]/80" />
                  <div className="h-[9px] w-[9px] rounded-full bg-[#FFBD2E]/80" />
                  <div className="h-[9px] w-[9px] rounded-full bg-[#28C840]/80" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="mx-auto flex max-w-[220px] items-center gap-1.5 rounded-md bg-white/[0.05] px-3 py-1 ring-1 ring-white/[0.07]">
                    <svg
                      className="h-2.5 w-2.5 shrink-0 text-white/20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3v1H9v-1c0-1.657 1.343-3 3-3z"
                      />
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    <span className="text-[11px] text-white/30">
                      plrlibrary.com/library
                    </span>
                  </div>
                </div>
              </div>

              {/* ── App shell ── */}
              <div className="flex h-[440px] sm:h-[500px]">
                {/* Sidebar */}
                <div className="hidden w-[52px] shrink-0 flex-col items-center gap-2.5 border-r border-white/[0.05] bg-[#050B17] py-4 sm:flex">
                  {/* Logo */}
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/30">
                    <span className="text-[9px] font-bold tracking-tight text-white">
                      PLR
                    </span>
                  </div>
                  <div className="mt-1 h-px w-6 bg-white/[0.06]" />
                  {/* Nav items */}
                  {[true, false, false, false].map((active, i) => (
                    <div
                      key={i}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        active
                          ? "bg-primary/20 ring-1 ring-primary/30"
                          : "bg-white/[0.03] hover:bg-white/[0.06]"
                      }`}
                    >
                      <div
                        className={`h-3 w-3 rounded-sm ${active ? "bg-primary/80" : "bg-white/20"}`}
                      />
                    </div>
                  ))}
                </div>

                {/* Main content */}
                <div className="flex flex-1 flex-col overflow-hidden">
                  {/* Page header */}
                  <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-3.5">
                    <div>
                      <div className="text-[13px] font-semibold tracking-[-0.01em] text-white">
                        Bibliothèque
                      </div>
                      <div className="mt-0.5 text-[11px] text-white/35">
                        104 produits disponibles
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-primary/[0.12] px-3 py-1.5 ring-1 ring-primary/25">
                      <svg
                        className="h-2.5 w-2.5 text-primary"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                      <span className="text-[10px] font-semibold tracking-wide text-primary">
                        4 nouveautés
                      </span>
                    </div>
                  </div>

                  {/* Filters bar */}
                  <div className="border-b border-white/[0.05] px-5 py-3">
                    <div className="flex items-center gap-2">
                      {/* Search */}
                      <div className="flex flex-1 items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 ring-1 ring-white/[0.07]">
                        <svg
                          className="h-3 w-3 shrink-0 text-white/25"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <span className="text-[11px] text-white/20">
                          Rechercher un produit...
                        </span>
                      </div>
                      {/* Selects */}
                      {["Catégorie", "Niche", "Trier"].map((label) => (
                        <div
                          key={label}
                          className="hidden items-center gap-1.5 rounded-lg bg-white/[0.04] px-2.5 py-2 ring-1 ring-white/[0.07] sm:flex"
                        >
                          <span className="text-[11px] text-white/30">
                            {label}
                          </span>
                          <svg
                            className="h-2.5 w-2.5 text-white/20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category pills */}
                  <div className="flex gap-1.5 overflow-x-auto border-b border-white/[0.05] px-5 py-2.5">
                    {[
                      { label: "Tous", active: true },
                      { label: "Ebooks", active: false },
                      { label: "Templates", active: false },
                      { label: "Formations", active: false },
                      { label: "Kits", active: false },
                    ].map((pill) => (
                      <div
                        key={pill.label}
                        className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-medium tracking-[0.01em] transition-all ${
                          pill.active
                            ? "bg-primary text-white shadow-md shadow-primary/30"
                            : "bg-white/[0.04] text-white/35 ring-1 ring-white/[0.07] hover:bg-white/[0.07]"
                        }`}
                      >
                        {pill.label}
                      </div>
                    ))}
                  </div>

                  {/* Products grid */}
                  <div className="flex-1 overflow-hidden p-4 sm:p-5">
                    <div className="mb-3 text-[11px] font-medium tracking-[0.02em] text-white/25 uppercase">
                      32 produits trouvés
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {dashboardProducts.map((product, i) => (
                        <div
                          key={i}
                          className="group overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.025] transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.04]"
                        >
                          {/* Thumbnail */}
                          <div
                            className={`relative aspect-[4/3] bg-gradient-to-br ${product.gradient}`}
                          >
                            {/* Subtle noise overlay */}
                            <div
                              className="absolute inset-0 opacity-20 mix-blend-overlay"
                              style={{
                                backgroundImage:
                                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
                              }}
                            />
                            {/* NEW badge */}
                            {product.isNew && (
                              <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-bold tracking-wide text-white shadow-lg shadow-primary/40">
                                <svg
                                  className="h-1.5 w-1.5"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                </svg>
                                Nouveau
                              </div>
                            )}
                            {/* Category badge */}
                            <div
                              className={`absolute right-2 top-2 rounded-md px-1.5 py-0.5 text-[8px] font-semibold tracking-wide backdrop-blur-md ${product.categoryColor}`}
                            >
                              {product.category}
                            </div>
                            {/* Credit badge */}
                            <div className="absolute bottom-2 left-2 flex items-center gap-0.5 rounded-full bg-black/60 px-1.5 py-0.5 backdrop-blur-md">
                              <svg
                                className="h-2 w-2 text-amber-400"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <circle cx="12" cy="12" r="10" />
                              </svg>
                              <span className="text-[8px] font-semibold text-white/90">
                                {product.credits} cr.
                              </span>
                            </div>
                          </div>

                          {/* Card body */}
                          <div className="p-2.5">
                            <div className="truncate text-[11px] font-semibold tracking-[-0.01em] text-white/90">
                              {product.title}
                            </div>
                            <div className="mt-0.5 text-[9px] text-white/35">
                              {product.description}
                            </div>
                            <div className="mt-2 flex items-center justify-between border-t border-white/[0.05] pt-2">
                              <div className="flex items-center gap-1 text-[9px] font-medium text-white/30">
                                <svg
                                  className="h-2.5 w-2.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                  />
                                </svg>
                                {product.downloads}
                              </div>
                              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/20 transition-colors group-hover:bg-primary/20">
                                <svg
                                  className="h-2.5 w-2.5 text-primary"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom reflection fade */}
            <div className="pointer-events-none absolute -bottom-px inset-x-0 h-16 bg-gradient-to-t from-[#040D1A] to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

const dashboardProducts = [
  {
    title: "Guide Instagram Pro",
    description: "PDF · 45 pages",
    category: "Ebook",
    categoryColor: "bg-blue-500/20 text-blue-300",
    gradient: "from-violet-500 to-purple-600",
    credits: 3,
    downloads: 128,
    isNew: false,
  },
  {
    title: "Pack Templates Canva",
    description: "50 designs éditables",
    category: "Template",
    categoryColor: "bg-purple-500/20 text-purple-300",
    gradient: "from-pink-500 to-rose-600",
    credits: 5,
    downloads: 94,
    isNew: true,
  },
  {
    title: "Formation Copywriting",
    description: "Vidéo · 2h30",
    category: "Formation",
    categoryColor: "bg-green-500/20 text-green-300",
    gradient: "from-amber-500 to-orange-600",
    credits: 8,
    downloads: 61,
    isNew: true,
  },
  {
    title: "Scripts de Vente",
    description: "15 scripts prêts",
    category: "Script",
    categoryColor: "bg-pink-500/20 text-pink-300",
    gradient: "from-blue-500 to-indigo-600",
    credits: 4,
    downloads: 83,
    isNew: false,
  },
];
