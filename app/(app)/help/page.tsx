// app/(app)/help/page.tsx
"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconMessageCircle,
  IconBook,
  IconDownload,
  IconCreditCard,
  IconShield,
  IconSend,
} from "@tabler/icons-react";
import { toast } from "sonner";

const FAQ_CATEGORIES = [
  {
    id: "general",
    title: "Général",
    icon: IconBook,
    questions: [
      {
        q: "Qu'est-ce que PLR Library ?",
        a: "PLR Library est une plateforme d'abonnement qui vous donne accès à une bibliothèque complète de produits numériques avec droits de revente (PLR). Vous pouvez télécharger des ebooks, templates, formations et plus encore pour les utiliser dans votre business.",
      },
      {
        q: "Que signifie PLR (Private Label Rights) ?",
        a: "PLR signifie 'Private Label Rights' ou 'Droits de Label Privé'. Cela vous permet d'utiliser, modifier et revendre les produits comme s'ils étaient les vôtres. Vous pouvez les personnaliser, y ajouter votre nom et les vendre à vos propres clients.",
      },
      {
        q: "Quels types de produits sont disponibles ?",
        a: "Notre bibliothèque contient des ebooks, des templates (Canva, PowerPoint, etc.), des formations vidéo, des scripts, des kits marketing complets et bien plus. De nouveaux produits sont ajoutés régulièrement.",
      },
    ],
  },
  {
    id: "subscription",
    title: "Abonnement",
    icon: IconCreditCard,
    questions: [
      {
        q: "Combien coûte l'abonnement ?",
        a: "L'abonnement coûte 15 000 FCFA par mois. Ce tarif vous donne un accès illimité à toute la bibliothèque de produits PLR.",
      },
      {
        q: "Comment fonctionne le renouvellement ?",
        a: "Votre abonnement se renouvelle automatiquement chaque mois. Vous recevrez un rappel par email avant chaque renouvellement. Vous pouvez annuler à tout moment depuis vos paramètres.",
      },
      {
        q: "Quels moyens de paiement acceptez-vous ?",
        a: "Nous acceptons les paiements par Mobile Money (MTN, Moov, Orange, Wave) dans toute la zone UEMOA, ainsi que les cartes bancaires.",
      },
      {
        q: "Puis-je annuler mon abonnement ?",
        a: "Oui, vous pouvez annuler à tout moment. Votre accès restera actif jusqu'à la fin de votre période d'abonnement en cours.",
      },
      {
        q: "Que se passe-t-il si mon paiement échoue ?",
        a: "Si un paiement échoue, nous réessayerons automatiquement pendant 3 jours (période de grâce). Vous recevrez des notifications pour régulariser votre situation. Passé ce délai, votre accès sera suspendu jusqu'au prochain paiement réussi.",
      },
    ],
  },
  {
    id: "downloads",
    title: "Téléchargements",
    icon: IconDownload,
    questions: [
      {
        q: "Combien de produits puis-je télécharger ?",
        a: "Vous pouvez télécharger jusqu'à 20 produits par période de 24 heures. Cette limite est en place pour assurer une utilisation équitable de la plateforme.",
      },
      {
        q: "Les téléchargements sont-ils illimités ?",
        a: "Oui, tant que votre abonnement est actif, vous pouvez télécharger autant de produits que vous le souhaitez (dans la limite quotidienne de 20 téléchargements).",
      },
      {
        q: "Dans quel format sont les fichiers ?",
        a: "Les produits sont généralement fournis en fichiers ZIP contenant tous les éléments nécessaires (PDF, images sources, fichiers éditables, etc.).",
      },
      {
        q: "Puis-je re-télécharger un produit ?",
        a: "Oui, vous pouvez re-télécharger n'importe quel produit autant de fois que nécessaire tant que votre abonnement est actif.",
      },
    ],
  },
  {
    id: "license",
    title: "Licence & Utilisation",
    icon: IconShield,
    questions: [
      {
        q: "Que puis-je faire avec les produits PLR ?",
        a: "Vous pouvez : les utiliser personnellement, les modifier et personnaliser, les revendre en tant que vos propres produits, les offrir en bonus, les utiliser pour créer du contenu. Consultez notre page Licence pour les détails complets.",
      },
      {
        q: "Puis-je revendre les produits tels quels ?",
        a: "Oui, mais nous recommandons de les personnaliser pour vous démarquer de la concurrence. Vous pouvez modifier le contenu, ajouter votre branding et les adapter à votre audience.",
      },
      {
        q: "Y a-t-il des restrictions ?",
        a: "Oui, quelques restrictions s'appliquent : vous ne pouvez pas revendre les droits PLR eux-mêmes, ni redistribuer les produits gratuitement en masse. Consultez notre page Licence pour tous les détails.",
      },
    ],
  },
];

export default function HelpPage() {
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactForm.subject || !contactForm.message) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsSending(true);

    // Simuler l'envoi (à remplacer par une vraie mutation)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Message envoyé ! Nous vous répondrons sous 24-48h.");
    setContactForm({ subject: "", message: "" });
    setIsSending(false);
  };

  return (
    <div className="flex flex-col gap-8 p-4 lg:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Centre d&apos;aide</h1>
        <p className="text-muted-foreground">
          Trouvez des réponses à vos questions ou contactez notre support
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FAQ_CATEGORIES.map((category) => (
          <Card
            key={category.id}
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => {
              document.getElementById(category.id)?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <category.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{category.title}</p>
                <p className="text-xs text-muted-foreground">
                  {category.questions.length} questions
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Sections */}
      <div className="space-y-8">
        {FAQ_CATEGORIES.map((category) => (
          <div key={category.id} id={category.id}>
            <div className="flex items-center gap-2 mb-4">
              <category.icon className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{category.title}</h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {category.questions.map((item, index) => (
                <AccordionItem key={index} value={`${category.id}-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconMessageCircle className="h-5 w-5" />
            Vous n&apos;avez pas trouvé votre réponse ?
          </CardTitle>
          <CardDescription>
            Contactez notre équipe support. Nous répondons généralement sous
            24-48 heures.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                placeholder="Ex: Problème de téléchargement"
                value={contactForm.subject}
                onChange={(e) =>
                  setContactForm({ ...contactForm, subject: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Décrivez votre problème en détail..."
                rows={5}
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm({ ...contactForm, message: e.target.value })
                }
              />
            </div>
            <Button type="submit" disabled={isSending}>
              {isSending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <IconSend className="mr-2 h-4 w-4" />
                  Envoyer le message
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Vous pouvez aussi nous contacter directement par email :{" "}
          <a
            href="mailto:support@plrlibrary.com"
            className="text-primary hover:underline"
          >
            support@plrlibrary.com
          </a>
        </p>
      </div>
    </div>
  );
}
