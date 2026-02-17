import { Check } from "lucide-react";

const features = [
  {
    tag: "Bibliothèque complète",
    title: "Parcourez des produits prêts à vendre",
    description:
      "Accédez à une collection de produits digitaux triés par catégorie. Filtrez par type, niche ou popularité pour trouver exactement ce dont vous avez besoin.",
    bullets: [
      "Ebooks, templates, scripts, formations",
      "Filtres de recherche avancés",
      "Classement par type et par niche",
    ],
    mockupType: "library",
  },
  {
    tag: "Téléchargement instantané",
    title: "Téléchargez en un clic, commencez à vendre",
    description:
      "Pas d'attente, pas de validation. Sélectionnez un produit, téléchargez les fichiers sources et commencez à personnaliser immédiatement.",
    bullets: [
      "Téléchargements illimités",
      "Historique complet de vos downloads",
      "Accès sécurisé à vos fichiers",
    ],
    mockupType: "download",
  },
  {
    tag: "Données marché",
    title: "Vendez avec des insights, pas au hasard",
    description:
      "Chaque produit inclut des recommandations de marché et des estimations de revenus potentiels pour vous aider à prendre les bonnes décisions.",
    bullets: [
      "Estimations de revenus par produit",
      "Recommandations de prix de vente",
      "Niches et audiences suggérées",
    ],
    mockupType: "insights",
  },
];

// Mockup components - Dark themed
function LibraryMockup() {
  return (
    <div className="flex h-full flex-col bg-[#0a0a0a]">
      <div className="flex flex-1">
        {/* Mini sidebar */}
        <div className="hidden w-12 flex-shrink-0 border-r border-white/10 bg-white/[0.02] p-2 sm:block sm:w-14 sm:p-3">
          <div className="space-y-2 sm:space-y-3">
            <div className="h-6 w-6 rounded-lg bg-primary/30 sm:h-8 sm:w-8" />
            <div className="h-6 w-6 rounded-lg bg-white/10 sm:h-8 sm:w-8" />
            <div className="h-6 w-6 rounded-lg bg-white/10 sm:h-8 sm:w-8" />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-3 sm:p-4">
          {/* Search bar */}
          <div className="mb-3 flex gap-2 sm:mb-4">
            <div className="h-8 flex-1 rounded-lg bg-white/5 sm:h-9" />
            <div className="hidden h-8 w-20 rounded-lg bg-primary/20 sm:block sm:h-9 sm:w-24" />
          </div>

          {/* Filter tabs */}
          <div className="mb-3 flex gap-1.5 overflow-x-auto sm:mb-4 sm:gap-2">
            <div className="flex h-6 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-medium text-white sm:h-7 sm:w-16 sm:text-[10px]">
              Tous
            </div>
            <div className="flex h-6 w-16 shrink-0 items-center justify-center rounded-full bg-white/10 text-[9px] text-white/60 sm:h-7 sm:w-20 sm:text-[10px]">
              Ebooks
            </div>
            <div className="flex h-6 w-20 shrink-0 items-center justify-center rounded-full bg-white/10 text-[9px] text-white/60 sm:h-7 sm:w-24 sm:text-[10px]">
              Templates
            </div>
            <div className="hidden h-6 w-16 items-center justify-center rounded-full bg-white/10 text-[9px] text-white/60 sm:flex sm:h-7 sm:text-[10px]">
              Scripts
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`overflow-hidden rounded-lg border border-white/10 ${i > 4 ? "hidden sm:block" : ""}`}
              >
                <div
                  className={`aspect-[4/3] ${
                    i === 1
                      ? "bg-gradient-to-br from-violet-500 to-purple-600"
                      : i === 2
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                        : i === 3
                          ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                          : i === 4
                            ? "bg-gradient-to-br from-amber-500 to-orange-600"
                            : i === 5
                              ? "bg-gradient-to-br from-pink-500 to-rose-600"
                              : "bg-gradient-to-br from-cyan-500 to-blue-600"
                  }`}
                />
                <div className="bg-white/[0.02] p-1.5 sm:p-2">
                  <div className="h-1.5 w-12 rounded bg-white/20 sm:h-2 sm:w-16" />
                  <div className="mt-1 h-1.5 w-8 rounded bg-white/10 sm:h-2 sm:w-10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DownloadMockup() {
  return (
    <div className="flex h-full flex-col bg-[#0a0a0a] p-3 sm:p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        <div>
          <div className="h-2.5 w-24 rounded bg-white/20 sm:h-3 sm:w-32" />
          <div className="mt-1 h-2 w-16 rounded bg-white/10 sm:w-24" />
        </div>
        <div className="h-7 w-7 rounded-full bg-primary/20 sm:h-8 sm:w-8" />
      </div>

      {/* Download list */}
      <div className="flex-1 space-y-2 sm:space-y-3">
        {[
          { name: "Guide Instagram Pro", status: "Terminé", color: "emerald" },
          { name: "Pack Templates Canva", status: "Terminé", color: "emerald" },
          { name: "Scripts de Vente", status: "En cours", color: "amber" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-2 sm:gap-3 sm:p-3"
          >
            <div
              className={`h-8 w-8 shrink-0 rounded-lg sm:h-10 sm:w-10 ${
                i === 0
                  ? "bg-gradient-to-br from-violet-500 to-purple-600"
                  : i === 1
                    ? "bg-gradient-to-br from-pink-500 to-rose-600"
                    : "bg-gradient-to-br from-blue-500 to-indigo-600"
              }`}
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[10px] font-medium text-white sm:text-xs">
                {item.name}
              </div>
              <div className="text-[9px] text-white/40 sm:text-[10px]">
                PDF • 2.4 MB
              </div>
            </div>
            <div
              className={`shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-medium sm:px-2 sm:text-[10px] ${
                item.color === "emerald"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-amber-500/20 text-amber-400"
              }`}
            >
              {item.status}
            </div>
          </div>
        ))}
      </div>

      {/* Security badge */}
      <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-emerald-500/10 p-2 sm:mt-4">
        <svg
          className="h-3.5 w-3.5 text-emerald-400 sm:h-4 sm:w-4"
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
        <span className="text-[9px] font-medium text-emerald-400 sm:text-[10px]">
          Téléchargements sécurisés
        </span>
      </div>
    </div>
  );
}

function InsightsMockup() {
  return (
    <div className="flex h-full flex-col bg-[#0a0a0a] p-3 sm:p-4">
      {/* Product header */}
      <div className="mb-3 flex items-start gap-2 sm:mb-4 sm:gap-3">
        <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 sm:h-16 sm:w-16" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-semibold text-white sm:text-sm">
            Guide Instagram Pro
          </div>
          <div className="text-[10px] text-white/40 sm:text-xs">
            Ebook • 45 pages
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1 sm:mt-2 sm:gap-2">
            <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[8px] font-medium text-primary sm:px-2 sm:text-[10px]">
              Marketing
            </span>
            <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[8px] text-white/50 sm:px-2 sm:text-[10px]">
              Social Media
            </span>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="mb-3 grid grid-cols-2 gap-2 sm:mb-4 sm:gap-3">
        <div className="rounded-xl bg-emerald-500/10 p-2 sm:p-3">
          <div className="text-base font-bold text-emerald-400 sm:text-lg">
            15-25K
          </div>
          <div className="text-[8px] text-emerald-400/70 sm:text-[10px]">
            FCFA estimé/vente
          </div>
        </div>
        <div className="rounded-xl bg-primary/10 p-2 sm:p-3">
          <div className="text-base font-bold text-primary sm:text-lg">
            4.8/5
          </div>
          <div className="text-[8px] text-primary/70 sm:text-[10px]">
            Score potentiel
          </div>
        </div>
      </div>

      {/* Suggested niches */}
      <div className="flex-1">
        <div className="mb-2 text-[10px] font-medium text-white/60 sm:text-xs">
          Niches suggérées
        </div>
        <div className="space-y-2">
          {["Entrepreneurs", "Community Managers", "Coachs"].map((niche, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-white/10">
                <div
                  className="h-1.5 rounded-full bg-primary"
                  style={{ width: `${90 - i * 15}%` }}
                />
              </div>
              <span className="w-24 text-right text-[9px] text-white/50 sm:w-28 sm:text-[10px]">
                {niche}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-black py-16 sm:py-20 md:py-24"
    >
      {/* Background */}

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block text-xs font-medium uppercase tracking-wider text-primary sm:mb-4 sm:text-sm">
            Fonctionnalités
          </span>
          <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
            Votre boutique de produits digitaux{" "}
            <span className="text-gradient">commence ici</span>
          </h2>
          <p className="mt-3 text-base text-white/60 sm:mt-4 sm:text-lg">
            Une plateforme pensée pour vous faire gagner du temps et maximiser
            vos ventes.
          </p>
        </div>

        {/* Feature sections - alternating layout */}
        <div className="mt-12 space-y-16 sm:mt-16 sm:space-y-20 md:mt-20 md:space-y-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col items-center gap-8 sm:gap-10 lg:flex-row lg:gap-12 xl:gap-16 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Text content */}
              <div className="w-full space-y-4 sm:space-y-5 lg:flex-1 lg:space-y-6">
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/20 sm:px-4 sm:py-1.5 sm:text-sm">
                  {feature.tag}
                </span>

                <h3 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">
                  {feature.title}
                </h3>

                <p className="text-base text-white/60 sm:text-lg">
                  {feature.description}
                </p>

                <ul className="space-y-2 sm:space-y-3">
                  {feature.bullets.map((bullet, bulletIndex) => (
                    <li
                      key={bulletIndex}
                      className="flex items-center gap-2 sm:gap-3"
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                        <Check
                          className="h-3 w-3 text-primary-foreground"
                          strokeWidth={3}
                        />
                      </div>
                      <span className="text-sm text-white sm:text-base">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image/Mockup */}
              <div className="w-full lg:flex-1">
                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] shadow-2xl shadow-primary/5 sm:rounded-2xl">
                  {/* Glow effect */}
                  <div className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-b from-primary/10 to-transparent opacity-50 sm:rounded-2xl" />

                  {/* Browser chrome */}
                  <div className="relative flex items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-3 py-2 sm:gap-2 sm:px-4 sm:py-3">
                    <div className="flex gap-1 sm:gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-white/20 sm:h-3 sm:w-3" />
                      <div className="h-2 w-2 rounded-full bg-white/20 sm:h-3 sm:w-3" />
                      <div className="h-2 w-2 rounded-full bg-white/20 sm:h-3 sm:w-3" />
                    </div>
                    <div className="ml-2 flex-1 sm:ml-4">
                      <div className="mx-auto max-w-[140px] rounded-md bg-white/5 px-2 py-0.5 text-[9px] text-white/30 sm:max-w-xs sm:px-3 sm:py-1 sm:text-xs">
                        plrlibrary.com
                      </div>
                    </div>
                  </div>

                  {/* Mockup content */}
                  <div className="relative aspect-[4/3]">
                    {feature.mockupType === "library" && <LibraryMockup />}
                    {feature.mockupType === "download" && <DownloadMockup />}
                    {feature.mockupType === "insights" && <InsightsMockup />}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
