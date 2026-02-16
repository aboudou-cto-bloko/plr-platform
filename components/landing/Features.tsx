import { Card } from "@/components/ui/card";
import {
  BadgeCheck,
  Download,
  FileText,
  FolderOpen,
  Headphones,
  RefreshCw,
} from "lucide-react";

const features = [
  {
    icon: BadgeCheck,
    title: "Licence PLR complète",
    description:
      "Revendez les produits à 100% de profit. Modifiez-les, rebrandez-les, c'est à vous.",
  },
  {
    icon: FolderOpen,
    title: "30+ produits disponibles",
    description:
      "Ebooks, templates, formations, kits marketing — une bibliothèque complète.",
  },
  {
    icon: Download,
    title: "Téléchargements illimités",
    description:
      "Accédez à tous les produits autant de fois que vous le souhaitez.",
  },
  {
    icon: FileText,
    title: "Fichiers sources inclus",
    description:
      "Formats éditables (Canva, Word, Notion) pour personnaliser à votre marque.",
  },
  {
    icon: RefreshCw,
    title: "Nouveaux produits chaque mois",
    description:
      "La bibliothèque s'enrichit régulièrement avec du contenu frais.",
  },
  {
    icon: Headphones,
    title: "Support réactif",
    description:
      "Une question ? Notre équipe vous répond rapidement par nos différents canaux.",
  },
];

export function Features() {
  return (
    <section id="features">
      <div className="bg-muted/50 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-foreground text-3xl font-semibold sm:text-4xl">
              Tout ce qu&apos;il faut pour vendre des produits digitaux
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-balance text-lg">
              Une bibliothèque complète de produits prêts à l&apos;emploi, avec
              tous les droits de revente inclus.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                variant="soft"
                className="p-6 transition-colors hover:bg-foreground/[0.07]"
              >
                <feature.icon className="text-primary size-6" />
                <h3 className="text-foreground mt-4 text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-balance">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
