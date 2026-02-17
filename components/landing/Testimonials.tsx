import { Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Aminata K.",
    role: "Coach en développement",
    image: "/testimonials/aminata.jpg", // Replace with real image
    gradient: "from-violet-600 to-purple-700",
    stat: "5x ROI",
    statLabel: "en 2 mois",
    content:
      "J'ai vendu mon premier ebook à 5,000 FCFA le jour même. En un mois, j'ai déjà rentabilisé 3 fois mon abonnement.",
  },
  {
    name: "Ousmane D.",
    role: "Entrepreneur digital",
    image: "/testimonials/ousmane.jpg", // Replace with real image
    gradient: "from-blue-600 to-indigo-700",
    stat: "15+",
    statLabel: "produits vendus",
    content:
      "Plus besoin de passer des semaines à créer du contenu. Je télécharge, je personnalise, et je vends. Simple.",
  },
  {
    name: "Fatou S.",
    role: "Formatrice en ligne",
    image: "/testimonials/fatou.jpg", // Replace with real image
    gradient: "from-emerald-600 to-teal-700",
    stat: "100%",
    statLabel: "satisfaite",
    content:
      "La qualité des produits m'a surprise. Les templates sont pro et mes clients adorent.",
  },
  {
    name: "Kofi M.",
    role: "Infopreneur",
    image: "/testimonials/kofi.jpg", // Replace with real image
    gradient: "from-amber-600 to-orange-700",
    stat: "50K FCFA",
    statLabel: "1ère semaine",
    content:
      "J'ai lancé ma boutique de formations en moins de 48h. Les fichiers sources éditables changent tout.",
  },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-black py-24">
      {/* Background effects */}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Pourquoi ils ont choisi{" "}
            <span className="text-gradient">PLR Library</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/60">
            Rejoignez des entrepreneurs qui développent leur business digital
          </p>
        </div>

        {/* Testimonials Grid - Minea Style */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
            >
              {/* Background - Image or Gradient fallback */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient}`}
              >
                {/* Uncomment when you have real images */}
                {/* <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                /> */}
              </div>

              {/* Overlay gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Quote icon */}
              <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <Quote className="h-5 w-5 text-white/70" />
              </div>

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-5">
                {/* Testimonial text */}
                <p className="mb-4 text-sm leading-relaxed text-white/90">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Stat highlight */}
                <div className="mb-3">
                  <span className="text-2xl font-bold text-primary">
                    {testimonial.stat}
                  </span>
                  <span className="ml-2 text-sm text-white/60">
                    {testimonial.statLabel}
                  </span>
                </div>

                {/* Author */}
                <div>
                  <div className="font-medium text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-white/50">
                    {testimonial.role}
                  </div>
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 transition-all duration-300 group-hover:ring-primary/30" />
            </div>
          ))}
        </div>

        {/* Bottom CTA - Optional */}
        <div className="mt-12 text-center">
          <p className="text-sm text-white/40">
            Ces témoignages sont basés sur des expériences réelles de nos
            premiers membres.
          </p>
        </div>
      </div>
    </section>
  );
}
