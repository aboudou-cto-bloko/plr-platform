"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const faqItems = [
  {
    id: "item-1",
    question: "Qu'est-ce qu'une licence PLR ?",
    answer:
      "PLR signifie « Private Label Rights » (Droits de Marque Privée). Cela vous donne le droit de modifier, rebrander et revendre les produits comme les vôtres. Vous gardez 100% des profits de vos ventes.",
  },
  {
    id: "item-2",
    question: "Comment fonctionne l'abonnement ?",
    answer:
      "Vous payez 15,000 FCFA par mois et accédez immédiatement à toute la bibliothèque. Téléchargez autant de produits que vous voulez. De nouveaux produits sont ajoutés chaque mois. Annulez à tout moment.",
  },
  {
    id: "item-3",
    question: "Quels moyens de paiement acceptez-vous ?",
    answer:
      "Nous acceptons MTN Mobile Money, Moov Money, Wave, Orange Money et les cartes bancaires via notre partenaire de paiement sécurisé Moneroo.",
  },
  {
    id: "item-4",
    question: "Puis-je modifier les produits ?",
    answer:
      "Oui, absolument ! Tous les produits incluent les fichiers sources (Word, Canva, Notion, etc.). Vous pouvez modifier le contenu, ajouter votre logo, changer les couleurs — c'est votre produit.",
  },
  {
    id: "item-5",
    question: "À quel prix puis-je revendre les produits ?",
    answer:
      "Vous fixez vos propres prix. La plupart de nos membres vendent les ebooks entre 3,000 et 10,000 FCFA, et les formations entre 15,000 et 50,000 FCFA. Vous gardez 100% de chaque vente.",
  },
  {
    id: "item-6",
    question: "Que se passe-t-il si j'annule mon abonnement ?",
    answer:
      "Vous conservez tous les produits que vous avez téléchargés. Vous perdez simplement l'accès aux nouveaux produits et aux futures mises à jour de la bibliothèque.",
  },
  {
    id: "item-7",
    question: "Y a-t-il une garantie ?",
    answer:
      "Oui, nous offrons une garantie satisfait ou remboursé de 7 jours. Si la bibliothèque ne correspond pas à vos attentes, contactez-nous et nous vous remboursons intégralement.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-muted/50 py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div>
          <h2 className="text-foreground text-3xl font-semibold sm:text-4xl">
            Questions fréquentes
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl text-balance text-lg">
            Tout ce que vous devez savoir sur PLR Library et comment démarrer
            votre business de produits digitaux.
          </p>
        </div>

        <div className="mt-12">
          <Accordion
            type="single"
            collapsible
            className="bg-card ring-foreground/5 w-full rounded-xl border border-transparent px-6 py-3 shadow-sm ring-1 md:px-8"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-dashed"
              >
                <AccordionTrigger className="cursor-pointer text-left text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground text-base">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="text-muted-foreground mt-6 text-sm">
            Vous avez une autre question ?{" "}
            <Link
              href="mailto:support@plr-library.com"
              className="text-primary font-medium hover:underline"
            >
              Contactez notre support
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
