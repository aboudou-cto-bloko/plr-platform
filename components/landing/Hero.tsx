import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Sparkles,
  Download,
  BookOpen,
  FileText,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black/90 pt-20">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
      >
        <source src="/videos/hero-bg-3.mp4" type="video/mp4" />
      </video>

      {/* Overlay layers for depth and readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/* Subtle primary color glow */}
      <div className="pointer-events-none absolute inset-x-0 top-1/4 h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent blur-3xl" />

      <div className="relative z-10 py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            {/* Launch Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-white/90">
                Nouveau — Lancement 2025
              </span>
            </div>

            {/* Headline with gradient accent */}
            <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              Lancez vos produits digitaux en 3 étapes.{" "}
              <span className="text-gradient">Zéro création.</span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-white/70 md:text-xl">
              Téléchargez, personnalisez, vendez — accédez à 30+ ebooks,
              templates et formations avec licence de revente incluse.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="group w-full sm:w-auto">
                <Link href="/signup">
                  <span>Commencer gratuitement</span>
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white sm:w-auto"
              >
                <Link href="#pricing">Voir les offres</Link>
              </Button>
            </div>

            {/* Value props */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <Download className="h-4 w-4 text-primary" />
                Téléchargement illimité
              </span>
              <span className="hidden text-white/20 sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary" />
                Droits de revente inclus
              </span>
              <span className="hidden text-white/20 sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-primary" />
                30+ produits disponibles
              </span>
            </div>
          </div>

          {/* Product Preview */}
          <div className="relative mx-auto mt-12 max-w-4xl md:mt-16">
            {/* Glow effect */}
            <div className="pointer-events-none absolute -inset-1 rounded-4xl bg-primary/30 blur-2xl" />

            {/* Screenshot container */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl shadow-black/50 backdrop-blur-xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-white/20" />
                  <div className="h-3 w-3 rounded-full bg-white/20" />
                  <div className="h-3 w-3 rounded-full bg-white/20" />
                </div>
                <div className="ml-4 flex-1">
                  <div className="mx-auto max-w-sm rounded-md bg-white/10 px-3 py-1 text-xs text-white/50">
                    plrlibrary.com/dashboard
                  </div>
                </div>
              </div>

              {/* Product grid mockup */}
              <div className="bg-gradient-to-br from-white/5 to-transparent p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                  {productMockups.map((product, i) => (
                    <div
                      key={i}
                      className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 transition-all duration-300 hover:ring-primary/50"
                    >
                      {/* Product cover gradient */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-90`}
                      />

                      {/* Product content */}
                      <div className="relative flex h-full flex-col justify-between p-3 sm:p-4">
                        <div>
                          <span className="inline-block rounded bg-black/30 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                            {product.category}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xs font-semibold text-white sm:text-sm">
                            {product.title}
                          </h3>
                          <p className="mt-0.5 text-[10px] text-white/70 sm:text-xs">
                            {product.type}
                          </p>
                        </div>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black">
                          Voir le produit
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom bar hint */}
                <div className="mt-4 flex items-center justify-between rounded-lg bg-white/5 px-4 py-2 ring-1 ring-white/10">
                  <span className="text-xs text-white/50">
                    30+ produits PLR disponibles
                  </span>
                  <span className="text-xs font-medium text-primary">
                    Explorer tout →
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Early adopter CTA */}
          <div className="mt-12 text-center">
            <p className="text-sm text-white/50">
              🚀 Rejoignez les premiers entrepreneurs à lancer leurs produits
              digitaux
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Product mockups data
const productMockups = [
  {
    title: "Guide Instagram Pro",
    category: "Ebook",
    type: "PDF • 45 pages",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    title: "Pack Templates Canva",
    category: "Template",
    type: "50 designs",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    title: "Formation Copywriting",
    category: "Formation",
    type: "Vidéo • 2h30",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "Checklist Business",
    category: "Ebook",
    type: "PDF • 20 pages",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "Scripts de Vente",
    category: "Template",
    type: "15 scripts",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    title: "Calendrier Réseaux",
    category: "Template",
    type: "Notion + Sheets",
    gradient: "from-cyan-500 to-blue-600",
  },
];
