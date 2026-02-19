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
      "PLR signifie « Private Label Rights » (Droits de Marque Privée). Vous pouvez modifier, rebrander et revendre les produits comme les vôtres. Vous gardez 100% des profits de chaque vente.",
    tag: "Essentiel",
    tagColor: "bg-primary/15 text-primary",
  },
  {
    id: "item-2",
    question: "Comment fonctionne l'abonnement ?",
    answer:
      "Vous payez 10,000 FCFA par mois et accédez immédiatement à toute la bibliothèque. Téléchargez autant de produits que vous voulez. Nouveaux produits ajoutés chaque semaine. Annulation en un clic, aucun préavis requis.",
    tag: "Essentiel",
    tagColor: "bg-primary/15 text-primary",
  },
  {
    id: "item-3",
    question: "Quels moyens de paiement acceptez-vous ?",
    answer:
      "MTN Mobile Money, Moov Money, Wave, Orange Money et carte bancaire — via Moneroo, notre partenaire de paiement sécurisé. Tous les opérateurs de la zone UEMOA sont couverts.",
    tag: "Paiement",
    tagColor: "bg-emerald-500/15 text-emerald-400",
  },
  {
    id: "item-4",
    question: "Puis-je modifier les produits ?",
    answer:
      "Oui. Tous les produits incluent les fichiers sources — Word, Canva, Notion. Modifiez le contenu, ajoutez votre logo, changez les couleurs. C'est votre produit.",
    tag: "Licence",
    tagColor: "bg-violet-500/15 text-violet-400",
  },
  {
    id: "item-5",
    question: "À quel prix puis-je revendre les produits ?",
    answer:
      "Vous fixez vos propres prix. Les ebooks PLR se vendent typiquement entre 3,000 et 10,000 FCFA. Les formations entre 15,000 et 50,000 FCFA. Vous gardez 100% — sans commission.",
    tag: "Revenus",
    tagColor: "bg-amber-500/15 text-amber-400",
  },
  {
    id: "item-6",
    question: "Que se passe-t-il si j'annule mon abonnement ?",
    answer:
      "Vous conservez tous les produits déjà téléchargés. Vous perdez uniquement l'accès aux nouveaux produits et futures mises à jour.",
    tag: "Abonnement",
    tagColor: "bg-blue-500/15 text-blue-400",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#040D1A] py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
            FAQ
          </span>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Questions fréquentes
          </h2>
          <p className="mt-4 text-lg text-white/50">
            Tout ce que vous devez savoir pour démarrer
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="space-y-2.5">
          {faqItems.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="group overflow-hidden rounded-xl border border-white/[0.07] bg-[#0B1628] px-5 backdrop-blur-sm transition-all duration-200 data-[state=open]:border-primary/25 data-[state=open]:bg-[#0d1e3a]"
            >
              <AccordionTrigger className="py-5 text-left hover:no-underline [&[data-state=open]>svg]:text-primary">
                <div className="flex items-center gap-3 pr-4">
                  {/* Tag */}
                  <span
                    className={`hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold sm:inline-block ${item.tagColor}`}
                  >
                    {item.tag}
                  </span>
                  {/* Question */}
                  <span className="text-sm font-medium text-white sm:text-base">
                    {item.question}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <div className="border-t border-white/[0.06] pt-4 text-sm leading-relaxed text-white/55 sm:text-base">
                  {item.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0B1628]">
          {/* Top accent line */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04]">
              <Mail className="h-5 w-5 text-white/50" />
            </div>
            <p className="text-base font-semibold text-white sm:text-lg">
              Vous avez une autre question ?
            </p>
            <p className="mt-2 text-sm text-white/45">
              Notre équipe vous répond en moins de 24h
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-6 border-white/[0.12] bg-white/[0.04] text-white hover:bg-white/[0.08] hover:text-white"
            >
              <Link href="mailto:support@plr-library.com">
                <Mail className="mr-2 h-4 w-4" />
                Contactez-nous
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
