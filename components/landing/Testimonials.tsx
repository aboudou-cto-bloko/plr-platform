import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Aminata K.",
    role: "Coach en développement personnel",
    avatar: "",
    initials: "AK",
    content:
      "J'ai vendu mon premier ebook PLR à 5,000 FCFA le jour même de mon inscription. En un mois, j'ai déjà rentabilisé 3 fois mon abonnement.",
  },
  {
    name: "Ousmane D.",
    role: "Entrepreneur digital",
    avatar: "",
    initials: "OD",
    content:
      "Plus besoin de passer des semaines à créer du contenu. Je télécharge, je personnalise avec ma marque, et je vends. Simple et efficace.",
  },
  {
    name: "Fatou S.",
    role: "Formatrice en ligne",
    avatar: "",
    initials: "FS",
    content:
      "La qualité des produits m'a surprise. Les templates sont professionnels et les formations sont bien structurées. Mes clients adorent.",
  },
];

export function Testimonials() {
  return (
    <section>
      <div className="py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-foreground text-3xl font-semibold sm:text-4xl">
              Ce que disent nos membres
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-balance text-lg">
              Découvrez comment des entrepreneurs comme vous utilisent PLR
              Library pour développer leur business digital.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index}>
                <div className="bg-muted/50 ring-foreground/5 h-full rounded-2xl rounded-bl-none border border-transparent px-5 py-4 ring-1">
                  <p className="text-foreground">{testimonial.content}</p>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Avatar className="ring-foreground/10 size-8 border border-transparent shadow-sm ring-1">
                    {testimonial.avatar ? (
                      <AvatarImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                      />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-foreground text-sm font-medium">
                      {testimonial.name}
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {testimonial.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
