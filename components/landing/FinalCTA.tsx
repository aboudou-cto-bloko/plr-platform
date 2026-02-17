import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-black">
      {/* Top border gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Background glow */}
      <div className="pointer-events-none absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/4 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left - Content */}
          <div>
            <h2 className="text-3xl font-bold text-white lg:text-4xl xl:text-5xl">
              Prêt à lancer votre{" "}
              <span className="text-gradient">business digital</span> ?
            </h2>

            <p className="mt-6 max-w-md text-lg text-white/60">
              Rejoignez les entrepreneurs qui vendent déjà des produits
              digitaux. Accès immédiat à toute la bibliothèque.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="group">
                <Link href="/signup">
                  Commencer maintenant
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="#pricing">Voir le tarif</Link>
              </Button>
            </div>

            {/* Trust line */}
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/40">
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-emerald-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                15,000 FCFA/mois
              </span>
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-emerald-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Sans engagement
              </span>
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-emerald-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Garantie 7 jours
              </span>
            </div>
          </div>

          {/* Right - Avatar/Memoji */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Glow behind avatar */}
            <div className="absolute h-64 w-64 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 blur-3xl" />

            {/* Avatar container */}
            <div className="relative">
              {/* Platform/desk effect */}
              <div className="absolute -bottom-4 left-1/2 h-8 w-48 -translate-x-1/2 rounded-full bg-gradient-to-t from-white/5 to-transparent blur-xl" />

              {/*
                Replace this placeholder with your actual Memoji/3D Avatar
                You can create one at:
                - Apple Memoji (if you have an iPhone)
                - Bitmoji
                - Ready Player Me (readyplayer.me)
                - Avaturn (avaturn.me)

                Recommended: Excited/thumbs up expression
              */}
              <div className="relative h-72 w-72 md:h-80 md:w-80">
                {/* Uncomment and use when you have the actual avatar image */}
                {/*
                <Image
                  src="/images/memoji-excited.png"
                  alt="Avatar"
                  fill
                  className="object-contain"
                  priority
                />
                */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom transition to footer */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
