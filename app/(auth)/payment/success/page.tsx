"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconCheck, IconLoader, IconX, IconClock } from "@tabler/icons-react";
import { Suspense } from "react";
import Link from "next/link";

type PaymentStatus = "success" | "pending" | "failed" | "cancelled";
type PaymentType = "initial" | "renewal";

interface PaymentMessage {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  details: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  autoRedirect?: string;
}

function getPaymentMessage(
  status: PaymentStatus,
  type: PaymentType,
): PaymentMessage {
  const messages: Record<PaymentStatus, Record<PaymentType, PaymentMessage>> = {
    success: {
      initial: {
        icon: (
          <IconCheck className="size-8 text-green-600 dark:text-green-400" />
        ),
        iconBg: "bg-green-100 dark:bg-green-900/30",
        title: "Paiement réussi !",
        description:
          "Bienvenue dans PLR Library ! Votre abonnement est maintenant actif.",
        details:
          "Vous pouvez maintenant télécharger tous les produits de la bibliothèque.",
        primaryAction: { label: "Continuer", href: "/onboarding" },
        secondaryAction: { label: "Aller au dashboard", href: "/dashboard" },
        autoRedirect: "/onboarding",
      },
      renewal: {
        icon: (
          <IconCheck className="size-8 text-green-600 dark:text-green-400" />
        ),
        iconBg: "bg-green-100 dark:bg-green-900/30",
        title: "Renouvellement réussi !",
        description: "Votre abonnement a été renouvelé avec succès.",
        details:
          "Vous avez accès à la bibliothèque pour 30 jours supplémentaires.",
        primaryAction: {
          label: "Voir mon abonnement",
          href: "/settings/billing",
        },
        secondaryAction: { label: "Aller à la bibliothèque", href: "/library" },
        autoRedirect: "/settings/billing",
      },
    },
    pending: {
      initial: {
        icon: (
          <IconClock className="size-8 text-orange-600 dark:text-orange-400" />
        ),
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        title: "Paiement en cours",
        description: "Votre paiement est en cours de traitement.",
        details:
          "Vous recevrez une confirmation par email dès que le paiement sera validé. Cela peut prendre quelques minutes.",
        primaryAction: {
          label: "Vérifier le statut",
          href: "/settings/billing",
        },
        secondaryAction: { label: "Contacter le support", href: "/help" },
      },
      renewal: {
        icon: (
          <IconClock className="size-8 text-orange-600 dark:text-orange-400" />
        ),
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        title: "Renouvellement en cours",
        description:
          "Votre paiement de renouvellement est en cours de traitement.",
        details:
          "Votre accès reste actif pendant la vérification. Vous serez notifié par email.",
        primaryAction: {
          label: "Voir mon abonnement",
          href: "/settings/billing",
        },
      },
    },
    failed: {
      initial: {
        icon: <IconX className="size-8 text-red-600 dark:text-red-400" />,
        iconBg: "bg-red-100 dark:bg-red-900/30",
        title: "Paiement échoué",
        description: "Votre paiement n'a pas pu être traité.",
        details:
          "Vérifiez vos informations de paiement et réessayez. Si le problème persiste, contactez votre opérateur.",
        primaryAction: { label: "Réessayer", href: "/payment" },
        secondaryAction: { label: "Contacter le support", href: "/help" },
      },
      renewal: {
        icon: <IconX className="size-8 text-red-600 dark:text-red-400" />,
        iconBg: "bg-red-100 dark:bg-red-900/30",
        title: "Renouvellement échoué",
        description: "Le paiement de renouvellement n'a pas pu être traité.",
        details:
          "Votre accès reste actif pendant la période de grâce (3 jours). Veuillez régulariser votre situation.",
        primaryAction: { label: "Payer maintenant", href: "/settings/billing" },
        secondaryAction: { label: "Contacter le support", href: "/help" },
      },
    },
    cancelled: {
      initial: {
        icon: <IconX className="size-8 text-gray-600 dark:text-gray-400" />,
        iconBg: "bg-gray-100 dark:bg-gray-900/30",
        title: "Paiement annulé",
        description: "Vous avez annulé le paiement.",
        details:
          "Aucun montant n'a été débité. Vous pouvez réessayer quand vous le souhaitez.",
        primaryAction: { label: "Réessayer", href: "/payment" },
        secondaryAction: { label: "Retour à l'accueil", href: "/" },
      },
      renewal: {
        icon: <IconX className="size-8 text-gray-600 dark:text-gray-400" />,
        iconBg: "bg-gray-100 dark:bg-gray-900/30",
        title: "Renouvellement annulé",
        description: "Vous avez annulé le renouvellement.",
        details: "Votre abonnement restera actif jusqu'à sa date d'expiration.",
        primaryAction: {
          label: "Voir mon abonnement",
          href: "/settings/billing",
        },
      },
    },
  };

  return messages[status][type];
}

// Mapper les statuts Moneroo vers nos statuts internes
function normalizePaymentStatus(monerooStatus: string | null): PaymentStatus {
  if (!monerooStatus) return "success";

  const statusMap: Record<string, PaymentStatus> = {
    success: "success",
    successful: "success",
    completed: "success",
    paid: "success",
    pending: "pending",
    processing: "pending",
    initiated: "pending",
    failed: "failed",
    error: "failed",
    cancelled: "cancelled",
    canceled: "cancelled",
  };

  return statusMap[monerooStatus.toLowerCase()] || "failed";
}

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Paramètres Moneroo réels
  const paymentStatus = searchParams.get("paymentStatus");
  const paymentId = searchParams.get("paymentId");
  const type = (searchParams.get("type") as PaymentType) || "initial";

  // Normaliser le statut
  const status = normalizePaymentStatus(paymentStatus);

  const [countdown, setCountdown] = useState(5);
  const message = getPaymentMessage(status, type);

  useEffect(() => {
    // Auto-redirect only for success
    if (status !== "success" || !message.autoRedirect) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push(message.autoRedirect!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router, status, message.autoRedirect]);

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-b from-muted to-background px-4 py-16">
      <div className="w-full max-w-md">
        <Card className="text-center">
          <CardHeader>
            <div
              className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${message.iconBg}`}
            >
              {message.icon}
            </div>
            <CardTitle className="text-2xl">{message.title}</CardTitle>
            <CardDescription>{message.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">{message.details}</p>
            </div>

            {paymentId && (
              <p className="text-xs text-muted-foreground">
                Référence : <span className="font-mono">{paymentId}</span>
              </p>
            )}
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <Button asChild className="w-full">
              <Link href={message.primaryAction.href}>
                {message.primaryAction.label}
              </Link>
            </Button>

            {message.secondaryAction && (
              <Button variant="outline" asChild className="w-full">
                <Link href={message.secondaryAction.href}>
                  {message.secondaryAction.label}
                </Link>
              </Button>
            )}

            {status === "success" && message.autoRedirect && (
              <p className="text-xs text-muted-foreground">
                Redirection automatique dans {countdown} seconde
                {countdown > 1 ? "s" : ""}...
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <IconLoader className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
