import { Check } from "lucide-react";

const features = [
  {
    tag: "Catalogue prêt à l'emploi",
    title: "100+ produits. Filtrés. Classés. Prêts.",
    description:
      "Ebooks, templates, formations, scripts — chaque produit livré avec sa licence de revente. Filtrez par niche, téléchargez, commencez à vendre.",
    bullets: [
      "Recherche par niche et par type",
      "Nouveautés ajoutées chaque semaine",
      "Badge crédit affiché sur chaque produit",
    ],
    mockupType: "library",
    url: "plrlibrary.com/library",
  },
  {
    tag: "Téléchargement instantané",
    title: "Un clic. Les fichiers sont à vous.",
    description:
      "Téléchargement immédiat. Fichiers sources inclus — Word, Canva, Notion. Modifiez, rebrandez, vendez. Vous gardez 100% des profits.",
    bullets: [
      "Téléchargements illimités",
      "Liens de téléchargement sécurisés",
      "Fichiers sources éditables inclus",
    ],
    mockupType: "product",
    url: "plrlibrary.com/product",
  },
  {
    tag: "Historique complet",
    title: "Chaque téléchargement conservé. Re-téléchargez à tout moment.",
    description:
      "Retrouvez tous vos fichiers dans votre historique. Statistiques du jour, du mois, crédits restants — tout est suivi automatiquement.",
    bullets: [
      "Re-téléchargement illimité de vos produits",
      "Statistiques : aujourd'hui · ce mois · restants",
      "Accès direct à la fiche produit depuis l'historique",
    ],
    mockupType: "downloads",
    url: "plrlibrary.com/downloads",
  },
];

// ─── MOCKUP: LIBRARY ───────────────────────────────────────────────────────
function LibraryMockup() {
  const products = [
    {
      title: "Guide Instagram Pro",
      category: "Ebook",
      categoryColor: "bg-blue-500/20 text-blue-300",
      gradient: "from-violet-500 to-purple-600",
      credits: 3,
      downloads: 128,
      isNew: false,
    },
    {
      title: "Pack Templates Canva",
      category: "Template",
      categoryColor: "bg-purple-500/20 text-purple-300",
      gradient: "from-pink-500 to-rose-600",
      credits: 5,
      downloads: 94,
      isNew: true,
    },
    {
      title: "Formation Copywriting",
      category: "Formation",
      categoryColor: "bg-green-500/20 text-green-300",
      gradient: "from-amber-500 to-orange-600",
      credits: 8,
      downloads: 61,
      isNew: true,
    },
    {
      title: "Scripts de Vente",
      category: "Script",
      categoryColor: "bg-pink-500/20 text-pink-300",
      gradient: "from-blue-500 to-indigo-600",
      credits: 4,
      downloads: 83,
      isNew: false,
    },
  ];

  return (
    <div className="flex h-full flex-col bg-[#0B1628]">
      {/* Page header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2.5 sm:px-4">
        <div>
          <div className="text-xs font-semibold text-white sm:text-sm">
            Bibliothèque
          </div>
          <div className="text-[9px] text-white/40 sm:text-[10px]">
            32 produits disponibles
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 ring-1 ring-primary/20">
          <svg
            className="h-2 w-2 text-primary"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <span className="text-[8px] font-medium text-primary sm:text-[9px]">
            4 nouveautés
          </span>
        </div>
      </div>

      {/* Search + selects */}
      <div className="border-b border-white/[0.06] px-3 py-2 sm:px-4">
        <div className="flex items-center gap-1.5">
          <div className="flex flex-1 items-center gap-1.5 rounded-md bg-white/[0.05] px-2 py-1.5 ring-1 ring-white/[0.08]">
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
            <span className="text-[9px] text-white/20">
              Rechercher un produit...
            </span>
          </div>
          {["Catégorie", "Niche"].map((l) => (
            <div
              key={l}
              className="hidden items-center gap-1 rounded-md bg-white/[0.05] px-2 py-1.5 ring-1 ring-white/[0.08] sm:flex"
            >
              <span className="text-[9px] text-white/30">{l}</span>
              <svg
                className="h-2 w-2 text-white/20"
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
      <div className="flex gap-1.5 border-b border-white/[0.06] overflow-x-auto px-3 py-2 sm:px-4">
        {["Tous", "Ebooks", "Templates", "Formations", "Kits"].map((p, i) => (
          <div
            key={p}
            className={`shrink-0 rounded-md px-2 py-0.5 text-[9px] font-medium sm:text-[10px] ${i === 0 ? "bg-primary text-white" : "bg-white/[0.05] text-white/40 ring-1 ring-white/[0.08]"}`}
          >
            {p}
          </div>
        ))}
      </div>

      {/* Products grid */}
      <div className="flex-1 overflow-hidden p-3 sm:p-4">
        <div className="mb-2 text-[9px] text-white/25 sm:text-[10px]">
          32 produits trouvés
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {products.map((product, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03]"
            >
              <div
                className={`relative aspect-[4/3] bg-gradient-to-br ${product.gradient}`}
              >
                {product.isNew && (
                  <div className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[7px] font-semibold text-white">
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
                <div
                  className={`absolute right-1.5 top-1.5 rounded-full px-1 py-0.5 text-[7px] font-medium backdrop-blur-sm ${product.categoryColor}`}
                >
                  {product.category}
                </div>
                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 rounded-full bg-black/50 px-1.5 py-0.5 backdrop-blur-sm">
                  <svg
                    className="h-1.5 w-1.5 text-amber-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <span className="text-[7px] font-medium text-white/80">
                    {product.credits} cr.
                  </span>
                </div>
              </div>
              <div className="p-1.5">
                <div className="truncate text-[9px] font-semibold text-white/85">
                  {product.title}
                </div>
                <div className="mt-1 flex items-center justify-between border-t border-white/[0.06] pt-1">
                  <div className="flex items-center gap-0.5 text-[8px] text-white/30">
                    <svg
                      className="h-2 w-2"
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DownloadsMockup() {
  const downloads = [
    {
      title: "Guide Instagram Pro",
      category: "Ebook",
      gradient: "from-violet-500 to-purple-600",
      time: "il y a 2 minutes",
    },
    {
      title: "Pack Templates Canva",
      category: "Template",
      gradient: "from-pink-500 to-rose-600",
      time: "il y a 1 heure",
    },
    {
      title: "Formation Copywriting",
      category: "Formation",
      gradient: "from-amber-500 to-orange-600",
      time: "il y a 3 heures",
    },
    {
      title: "Scripts de Vente",
      category: "Script",
      gradient: "from-blue-500 to-indigo-600",
      time: "il y a 2 jours",
    },
    {
      title: "Kit Email Marketing",
      category: "Kit",
      gradient: "from-cyan-500 to-blue-600",
      time: "il y a 5 jours",
    },
  ];

  return (
    <div className="flex h-full flex-col bg-[#0B1628]">
      {/* Page header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2.5 sm:px-4">
        <div>
          <div className="text-xs font-semibold text-white sm:text-sm">
            Téléchargements
          </div>
          <div className="text-[9px] text-white/40 sm:text-[10px]">
            Historique de vos téléchargements
          </div>
        </div>

        {/* Stats badges */}
        <div className="flex items-center gap-1.5">
          {[
            { label: "3 aujourd'hui", color: "border-white/10 text-white/50" },
            { label: "8 ce mois", color: "border-white/10 text-white/50" },
            {
              label: "22 restants",
              color: "border-primary/30 text-primary bg-primary/5",
            },
          ].map((badge) => (
            <div
              key={badge.label}
              className={`hidden rounded-full border px-2 py-0.5 text-[8px] font-medium sm:block ${badge.color}`}
            >
              {badge.label}
            </div>
          ))}
        </div>
      </div>

      {/* Downloads list */}
      <div className="flex-1 overflow-hidden p-3 sm:p-4">
        <div className="space-y-2">
          {downloads.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 transition-colors hover:bg-white/[0.04] sm:gap-3 sm:p-3"
            >
              {/* Thumbnail */}
              <div
                className={`h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br sm:h-12 sm:w-12 ${item.gradient}`}
              />

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="truncate text-[10px] font-medium text-white/85 sm:text-xs">
                  {item.title}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[8px] text-white/35 sm:text-[9px]">
                  {/* Clock icon */}
                  <svg
                    className="h-2.5 w-2.5 shrink-0"
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
                  {item.time}
                  <span>·</span>
                  <span className="text-white/30">{item.category}</span>
                </div>
              </div>

              {/* External link icon */}
              <div className="shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.03] p-1.5">
                <svg
                  className="h-3 w-3 text-white/30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// ─── MOCKUP: PRODUCT PAGE ──────────────────────────────────────────────────
function ProductMockup() {
  return (
    <div className="flex h-full flex-col bg-[#0B1628] p-3 sm:p-5">
      {/* Product header */}
      <div className="mb-3 flex gap-3 sm:mb-4 sm:gap-4">
        <div className="h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 sm:h-20 sm:w-20" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-xs font-semibold text-white sm:text-sm">
                Guide Instagram Pro
              </div>
              <div className="mt-0.5 text-[9px] text-white/40 sm:text-[10px]">
                PDF · 45 pages · 2.4 MB
              </div>
            </div>
            <div className="shrink-0 rounded-full bg-blue-500/20 px-1.5 py-0.5 text-[8px] font-medium text-blue-300">
              Ebook
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[8px] font-medium text-primary">
              Marketing
            </span>
            <span className="rounded-full bg-white/[0.08] px-1.5 py-0.5 text-[8px] text-white/40">
              Social Media
            </span>
          </div>
        </div>
      </div>

      {/* Description placeholder */}
      <div className="mb-3 space-y-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 sm:mb-4">
        <div className="h-1.5 w-full rounded bg-white/10" />
        <div className="h-1.5 w-5/6 rounded bg-white/10" />
        <div className="h-1.5 w-4/6 rounded bg-white/10" />
      </div>

      {/* Credit cost + Download CTA */}
      <div className="mb-3 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <svg
            className="h-3.5 w-3.5 text-amber-400"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span className="text-xs font-medium text-white/70">3 crédits</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-white shadow-md shadow-primary/30 sm:text-xs">
          <svg
            className="h-3 w-3"
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
          Télécharger
        </div>
      </div>

      {/* Download history */}
      <div className="flex-1">
        <div className="mb-2 text-[9px] font-medium text-white/40 sm:text-[10px]">
          Derniers téléchargements
        </div>
        <div className="space-y-1.5">
          {[
            {
              name: "Pack Templates Canva",
              gradient: "from-pink-500 to-rose-600",
              status: "Terminé",
              statusColor: "bg-emerald-500/20 text-emerald-400",
            },
            {
              name: "Guide Instagram Pro",
              gradient: "from-violet-500 to-purple-600",
              status: "Terminé",
              statusColor: "bg-emerald-500/20 text-emerald-400",
            },
            {
              name: "Scripts de Vente",
              gradient: "from-blue-500 to-indigo-600",
              status: "Terminé",
              statusColor: "bg-emerald-500/20 text-emerald-400",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2"
            >
              <div
                className={`h-6 w-6 shrink-0 rounded-md bg-gradient-to-br ${item.gradient}`}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[9px] font-medium text-white/80 sm:text-[10px]">
                  {item.name}
                </div>
                <div className="text-[8px] text-white/30">
                  ZIP · Fichiers sources
                </div>
              </div>
              <div
                className={`shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-medium ${item.statusColor}`}
              >
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MOCKUP: DASHBOARD HOME ────────────────────────────────────────────────
function DashboardMockup() {
  return (
    <div className="flex h-full flex-col bg-[#0B1628] p-3 sm:p-5">
      {/* Welcome */}
      <div className="mb-3 sm:mb-4">
        <div className="text-sm font-bold text-white sm:text-base">
          Bienvenue, Franck 👋
        </div>
        <div className="text-[9px] text-white/40 sm:text-[10px]">
          Voici un aperçu de votre bibliothèque PLR
        </div>
      </div>

      {/* Stats cards — SectionCards */}
      <div className="mb-3 grid grid-cols-2 gap-2 sm:mb-4 sm:grid-cols-4 sm:gap-3">
        {[
          {
            label: "Crédits restants",
            value: "24",
            icon: "💰",
            color: "from-amber-500/15 to-transparent",
            ring: "ring-amber-500/20",
            text: "text-amber-400",
          },
          {
            label: "Téléchargements",
            value: "8",
            icon: "📦",
            color: "from-primary/15 to-transparent",
            ring: "ring-primary/20",
            text: "text-primary",
          },
          {
            label: "Abonnement",
            value: "Actif",
            icon: "⚡",
            color: "from-emerald-500/15 to-transparent",
            ring: "ring-emerald-500/20",
            text: "text-emerald-400",
          },
          {
            label: "Expire dans",
            value: "18j",
            icon: "📅",
            color: "from-blue-500/15 to-transparent",
            ring: "ring-blue-500/20",
            text: "text-blue-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl bg-gradient-to-br p-2.5 ring-1 ${stat.color} ${stat.ring}`}
          >
            <div className="text-base sm:text-lg">{stat.icon}</div>
            <div className={`mt-1 text-sm font-bold sm:text-base ${stat.text}`}>
              {stat.value}
            </div>
            <div className="text-[8px] text-white/40 sm:text-[9px]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Nouveautés section */}
      <div className="flex-1 overflow-hidden">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold text-white sm:text-xs">
              Nouveautés
            </div>
            <div className="text-[8px] text-white/40 sm:text-[9px]">
              Produits récemment ajoutés
            </div>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] font-medium text-primary sm:text-[9px]">
            Voir tout
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            {
              title: "Pack Templates Canva",
              gradient: "from-pink-500 to-rose-600",
              category: "Template",
              categoryColor: "bg-purple-500/20 text-purple-300",
            },
            {
              title: "Formation Copywriting",
              gradient: "from-amber-500 to-orange-600",
              category: "Formation",
              categoryColor: "bg-green-500/20 text-green-300",
            },
            {
              title: "Kit Email Marketing",
              gradient: "from-cyan-500 to-blue-600",
              category: "Kit",
              categoryColor: "bg-orange-500/20 text-orange-300",
            },
            {
              title: "Checklist Business",
              gradient: "from-emerald-500 to-teal-600",
              category: "Ebook",
              categoryColor: "bg-blue-500/20 text-blue-300",
            },
          ].map((p, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03]"
            >
              <div
                className={`relative aspect-[4/3] bg-gradient-to-br ${p.gradient}`}
              >
                <div className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[7px] font-semibold text-white">
                  <svg
                    className="h-1.5 w-1.5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  Nouveau
                </div>
                <div
                  className={`absolute right-1.5 top-1.5 rounded-full px-1 py-0.5 text-[7px] font-medium ${p.categoryColor}`}
                >
                  {p.category}
                </div>
              </div>
              <div className="p-1.5">
                <div className="truncate text-[9px] font-semibold text-white/85">
                  {p.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SECTION FEATURES ──────────────────────────────────────────────────────
export function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#040D1A] py-16 sm:py-20 md:py-24"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

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
          <p className="mt-3 text-base text-white/50 sm:mt-4 sm:text-lg">
            Téléchargez. Rebrandez. Encaissez.
            <br />
            La plateforme fait le reste.
          </p>
        </div>

        {/* Feature blocks */}
        <div className="mt-12 space-y-16 sm:mt-16 sm:space-y-20 md:mt-20 md:space-y-28">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col items-center gap-8 sm:gap-10 lg:flex-row lg:gap-16 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Text */}
              <div className="w-full space-y-4 sm:space-y-5 lg:flex-1 lg:space-y-6">
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/20 sm:px-4 sm:py-1.5 sm:text-sm">
                  {feature.tag}
                </span>
                <h3 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">
                  {feature.title}
                </h3>
                <p className="text-base text-white/50 sm:text-lg">
                  {feature.description}
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  {feature.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-center gap-2 sm:gap-3">
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

              {/* Mockup */}
              <div className="w-full lg:flex-1">
                <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#0B1628] shadow-2xl shadow-black/40 sm:rounded-2xl">
                  {/* Subtle top glow */}
                  <div className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-b from-primary/10 to-transparent opacity-40 sm:rounded-2xl" />

                  {/* Browser chrome */}
                  <div className="relative flex items-center gap-1.5 border-b border-white/[0.08] bg-[#080F1E] px-3 py-2 sm:px-4 sm:py-2.5">
                    <div className="flex gap-1 sm:gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-white/15 sm:h-2.5 sm:w-2.5" />
                      <div className="h-2 w-2 rounded-full bg-white/15 sm:h-2.5 sm:w-2.5" />
                      <div className="h-2 w-2 rounded-full bg-white/15 sm:h-2.5 sm:w-2.5" />
                    </div>
                    <div className="ml-2 flex-1 sm:ml-3">
                      <div className="mx-auto max-w-[160px] rounded-md bg-white/[0.06] px-2 py-0.5 text-[9px] text-white/30 sm:max-w-xs sm:text-[10px]">
                        {feature.url}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative aspect-[4/3]">
                    {feature.mockupType === "library" && <LibraryMockup />}
                    {feature.mockupType === "product" && <ProductMockup />}
                    {feature.mockupType === "dashboard" && <DashboardMockup />}
                    {feature.mockupType === "downloads" && <DownloadsMockup />}
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
