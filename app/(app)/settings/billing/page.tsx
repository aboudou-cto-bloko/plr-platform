"use client";

import { useState, useEffect } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconCheck,
  IconCreditCard,
  IconLoader2,
  IconAlertCircle,
  IconSparkles,
  IconRefresh,
  IconCalendar,
  IconReceipt,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Id, Doc } from "@/convex/_generated/dataModel";

const PLAN_FEATURES = [
  "Accès à tous les produits PLR",
  "Téléchargements illimités",
  "Fichiers sources inclus",
  "Licence de revente complète",
  "Nouveaux produits chaque mois",
  "Support par email",
];

type SubscriptionStatus = "active" | "expired" | "cancelled" | "none";
type PaymentStatus = "success" | "pending" | "failed" | "cancelled";

export default function BillingPage() {
  const user = useQuery(api.users.getCurrentUser);
  const subscription = useQuery(api.subscriptions.getCurrentSubscription);
  const payments = useQuery(api.payments.getUserPayments);
  const pendingPayments = useQuery(api.payments.getPendingPayments);
  const initPayment = useAction(api.payments.initializePayment);
  const payInvoice = useAction(api.payments.payInvoice);

  const [isLoading, setIsLoading] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  // Gestion de la redirection via useEffect
  useEffect(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const result = await initPayment({});
      setRedirectUrl(result.checkoutUrl);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erreur lors de l'initialisation du paiement";
      toast.error(message);
      setIsLoading(false);
    }
  };

  const handlePayInvoice = async (paymentId: Id<"payments">) => {
    setPayingInvoice(paymentId);
    try {
      const result = await payInvoice({ paymentId });
      setRedirectUrl(result.checkoutUrl);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur lors du paiement";
      toast.error(message);
      setPayingInvoice(null);
    }
  };

  if (!user) {
    return (
      <div className="px-4 lg:px-6 space-y-6">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  const isActive = user.subscriptionStatus === "active";
  const hasPendingPayments = pendingPayments && pendingPayments.length > 0;

  return (
    <div className="px-4 lg:px-6 space-y-6">
      {/* Pending Invoices Alert */}
      {hasPendingPayments && (
        <Card className="border-orange-500/50 bg-orange-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <IconAlertTriangle className="size-5" />
              Factures en attente
            </CardTitle>
            <CardDescription>
              Vous avez {pendingPayments.length} facture(s) en attente de
              paiement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingPayments.map((payment) => (
                <div
                  key={payment._id}
                  className="flex items-center justify-between rounded-lg border bg-background p-3"
                >
                  <div className="flex items-center gap-3">
                    <IconReceipt className="size-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        Facture #{payment._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString(
                          "fr-FR",
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">
                      {payment.amount.toLocaleString()} {payment.currency}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handlePayInvoice(payment._id)}
                      disabled={payingInvoice === payment._id}
                    >
                      {payingInvoice === payment._id ? (
                        <IconLoader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        <IconCreditCard className="mr-2 size-4" />
                      )}
                      Payer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Votre abonnement</CardTitle>
              <CardDescription>
                Gérez votre abonnement PLR Library
              </CardDescription>
            </div>
            <SubscriptionBadge
              status={user.subscriptionStatus as SubscriptionStatus}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isActive ? (
            <ActiveSubscriptionDetails
              subscription={subscription}
              nextBillingDate={user.nextBillingDate}
            />
          ) : (
            <InactiveSubscriptionCTA
              onSubscribe={handleSubscribe}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconSparkles className="size-5 text-primary" />
            Ce qui est inclus
          </CardTitle>
          <CardDescription>
            Avec l&apos;abonnement PLR Library à 15,000 FCFA/mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 sm:grid-cols-2">
            {PLAN_FEATURES.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                  <IconCheck className="size-3 text-primary" />
                </div>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        {!isActive && (
          <CardFooter className="border-t pt-6">
            <Button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <IconLoader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <IconCreditCard className="mr-2 size-4" />
              )}
              S&apos;abonner — 15,000 FCFA/mois
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des factures</CardTitle>
          <CardDescription>Vos transactions récentes</CardDescription>
        </CardHeader>
        <CardContent>
          {payments === undefined ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : payments.length > 0 ? (
            <div className="space-y-2">
              {payments.map((payment) => (
                <div
                  key={payment._id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <IconReceipt className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {payment.type === "initial"
                          ? "Abonnement initial"
                          : "Renouvellement"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-medium">
                        {payment.amount.toLocaleString()} {payment.currency}
                      </p>
                      <PaymentStatusBadge
                        status={payment.status as PaymentStatus}
                      />
                    </div>
                    {(payment.status === "pending" ||
                      payment.status === "failed") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePayInvoice(payment._id)}
                        disabled={payingInvoice === payment._id}
                      >
                        {payingInvoice === payment._id ? (
                          <IconLoader2 className="size-4 animate-spin" />
                        ) : (
                          "Payer"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              Aucune facture enregistrée
            </p>
          )}
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Questions fréquentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium">Comment annuler mon abonnement ?</h4>
            <p className="text-sm text-muted-foreground">
              Contactez-nous par email à support@plr-library.com pour annuler
              votre abonnement. Vous conserverez l&apos;accès jusqu&apos;à la
              fin de la période payée.
            </p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium">
              Que se passe-t-il si le renouvellement échoue ?
            </h4>
            <p className="text-sm text-muted-foreground">
              Vous recevrez une notification et une facture apparaîtra dans
              cette page. Vous aurez 3 jours de grâce pour régulariser le
              paiement.
            </p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium">Puis-je revendre les produits ?</h4>
            <p className="text-sm text-muted-foreground">
              Oui ! Tous les produits incluent une licence PLR complète. Vous
              pouvez les modifier, rebrander et revendre en gardant 100% des
              profits.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SubscriptionBadge({ status }: { status: SubscriptionStatus }) {
  const config: Record<
    SubscriptionStatus,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
    }
  > = {
    active: { label: "Actif", variant: "default" },
    expired: { label: "Expiré", variant: "destructive" },
    cancelled: { label: "Annulé", variant: "secondary" },
    none: { label: "Non abonné", variant: "outline" },
  };

  const { label, variant } = config[status] || config.none;

  return <Badge variant={variant}>{label}</Badge>;
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config: Record<
    PaymentStatus,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
    }
  > = {
    success: { label: "Payé", variant: "default" },
    pending: { label: "En attente", variant: "outline" },
    failed: { label: "Échoué", variant: "destructive" },
    cancelled: { label: "Annulé", variant: "secondary" },
  };

  const { label, variant } = config[status] || {
    label: status,
    variant: "secondary" as const,
  };

  return (
    <Badge variant={variant} className="text-xs">
      {label}
    </Badge>
  );
}

interface ActiveSubscriptionDetailsProps {
  subscription: Doc<"subscriptions"> | null | undefined;
  nextBillingDate?: number;
}

function ActiveSubscriptionDetails({
  subscription,
  nextBillingDate,
}: ActiveSubscriptionDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Abonnement Mensuel</p>
            <p className="text-sm text-muted-foreground">
              15,000 FCFA par mois
            </p>
          </div>
          <Badge variant="default" className="gap-1">
            <IconCheck className="size-3" />
            Actif
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-lg border p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <IconCalendar className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Prochain paiement</p>
            <p className="font-medium">
              {nextBillingDate
                ? new Date(nextBillingDate).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <IconRefresh className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Renouvellement</p>
            <p className="font-medium">Automatique</p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Besoin d&apos;aide ?</p>
          <p className="text-sm text-muted-foreground">
            Contactez-nous pour toute question sur votre abonnement
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href="mailto:support@plr-library.com">Contacter le support</a>
        </Button>
      </div>
    </div>
  );
}

interface InactiveSubscriptionCTAProps {
  onSubscribe: () => void;
  isLoading: boolean;
}

function InactiveSubscriptionCTA({
  onSubscribe,
  isLoading,
}: InactiveSubscriptionCTAProps) {
  return (
    <div className="text-center py-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <IconAlertCircle className="size-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-medium">Vous n&apos;êtes pas abonné</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
        Abonnez-vous pour accéder à tous les produits PLR et commencer à générer
        des revenus.
      </p>
      <Button onClick={onSubscribe} disabled={isLoading} className="mt-6">
        {isLoading ? (
          <IconLoader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <IconCreditCard className="mr-2 size-4" />
        )}
        S&apos;abonner maintenant
      </Button>
    </div>
  );
}
