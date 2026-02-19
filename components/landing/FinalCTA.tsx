import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#040D1A]">
      {/* Top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Background glows */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-[500px] w-[500px] -translate-x-1/3 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-[400px] w-[400px] translate-x-1/3 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* ── Left — Content ── */}
          <div>
            {/* H2 */}
            <h2 className="text-3xl font-bold leading-[1.1] tracking-[-0.025em] text-white lg:text-4xl xl:text-5xl">
              Votre premier produit digital.
              <br />
              <span className="text-gradient">
                Il attend dans la bibliothèque.
              </span>
            </h2>

            {/* Subtext */}
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/50">
              <span className="font-medium text-white/75">
                Un abonnement à 10,000 FCFA débloque tout.
              </span>
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="group shadow-lg shadow-primary/20"
              >
                <Link href="/signup">
                  Accéder gratuitement
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/[0.12] bg-white/[0.03] text-white hover:bg-white/[0.07] hover:text-white"
              >
                <Link href="#pricing">Voir le tarif</Link>
              </Button>
            </div>
          </div>

          {/* ── Right — Emoji hero ── */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Glow derrière l'emoji */}
            <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent blur-3xl" />

            {/* Card conteneur */}
            <div className="relative flex h-72 w-72 items-center justify-center overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0B1628] shadow-2xl shadow-black/40 md:h-80 md:w-80">
              {/* Noise texture subtile */}
              <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
                }}
              />

              {/* Radial glow interne */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />

              {/* Emoji */}
              <span
                className="relative select-none text-[120px] leading-none md:text-[140px]"
                role="img"
                aria-label="Entrepreneur célébrant"
              >
                🚀
              </span>

              {/* Badge flottant — haut gauche */}
              <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-semibold text-emerald-400">
                  Accès immédiat
                </span>
              </div>

              {/* Ring hover */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-white/[0.07]" />
            </div>

            {/* Platform shadow */}
            <div className="absolute -bottom-4 left-1/2 h-8 w-48 -translate-x-1/2 rounded-full bg-primary/10 blur-xl" />
          </div>
        </div>
      </div>

      {/* Bottom transition */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </section>
  );
}
