"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
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
    <section id="faq" className="relative overflow-hidden bg-black py-24">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
            FAQ
          </span>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Questions fréquentes
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Tout ce que vous devez savoir pour démarrer
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="space-y-3">
          {faqItems.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] px-6 backdrop-blur-sm transition-colors data-[state=open]:border-primary/30 data-[state=open]:bg-white/[0.05]"
            >
              <AccordionTrigger className="py-5 text-left text-base font-medium text-white hover:no-underline [&[data-state=open]>svg]:text-primary">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-white/60">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center backdrop-blur-sm">
          <p className="text-lg font-medium text-white">
            Vous avez une autre question ?
          </p>
          <p className="mt-2 text-white/60">
            Notre équipe vous répond en moins de 24h
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-6 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="mailto:support@plr-library.com">
              <Mail className="mr-2 h-4 w-4" />
              Contactez-nous
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
