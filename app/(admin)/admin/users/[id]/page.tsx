"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  IconArrowLeft,
  IconLock,
  IconLockOpen,
  IconDownload,
  IconCreditCard,
  IconAlertTriangle,
  IconDevices,
  IconWorld,
  IconMail,
  IconCalendar,
  IconUser,
  IconCheck,
} from "@tabler/icons-react";
import { toast } from "sonner";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatPrice } from "@/lib/constants";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as Id<"users">;

  const user = useQuery(api.admin.getUserDetails, { userId });
  const lockUser = useMutation(api.admin.lockUser);
  const unlockUser = useMutation(api.admin.unlockUser);
  const resolveAlert = useMutation(api.admin.resolveAlert);

  const [lockDialogOpen, setLockDialogOpen] = useState(false);
  const [lockReason, setLockReason] = useState("");
  const [isLocking, setIsLocking] = useState(false);

  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-muted-foreground">Utilisateur non trouvé</p>
        <Button variant="outline" asChild>
          <Link href="/admin/users">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Retour aux utilisateurs
          </Link>
        </Button>
      </div>
    );
  }

  const handleLock = async () => {
    if (!lockReason) return;
    setIsLocking(true);
    try {
      await lockUser({ userId, reason: lockReason });
      toast.success("Compte verrouillé");
      setLockDialogOpen(false);
      setLockReason("");
    } catch (error) {
      toast.error("Erreur lors du verrouillage");
    } finally {
      setIsLocking(false);
    }
  };

  const handleUnlock = async () => {
    try {
      await unlockUser({ userId });
      toast.success("Compte déverrouillé");
    } catch (error) {
      toast.error("Erreur lors du déverrouillage");
    }
  };

  const handleResolveAlert = async (alertId: Id<"securityAlerts">) => {
    try {
      await resolveAlert({ alertId });
      toast.success("Alerte résolue");
    } catch (error) {
      toast.error("Erreur");
    }
  };

  const getStatusBadge = () => {
    if (user.isLocked) {
      return <Badge variant="destructive">Verrouillé</Badge>;
    }
    switch (user.subscriptionStatus) {
      case "active":
        return <Badge variant="default">Actif</Badge>;
      case "expired":
        return <Badge variant="secondary">Expiré</Badge>;
      case "none":
        return <Badge variant="outline">Gratuit</Badge>;
      default:
        return <Badge variant="outline">{user.subscriptionStatus}</Badge>;
    }
  };

  const pendingAlerts = user.alerts?.filter((a) => !a.isResolved) || [];

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/users">
              <IconArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">
                {user.name || "Sans nom"}
              </h1>
              {getStatusBadge()}
            </div>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user.isLocked ? (
            <Button variant="outline" onClick={handleUnlock}>
              <IconLockOpen className="mr-2 h-4 w-4" />
              Déverrouiller
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={() => setLockDialogOpen(true)}
            >
              <IconLock className="mr-2 h-4 w-4" />
              Verrouiller
            </Button>
          )}
        </div>
      </div>

      {/* Lock Warning */}
      {user.isLocked && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="flex items-center gap-4 py-4">
            <IconLock className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Compte verrouillé</p>
              <p className="text-sm text-muted-foreground">
                Raison : {user.lockReason}
              </p>
              {user.lockedAt && (
                <p className="text-xs text-muted-foreground">
                  Verrouillé{" "}
                  {formatDistanceToNow(user.lockedAt, {
                    addSuffix: true,
                    locale: fr,
                  })}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Alerts */}
      {pendingAlerts.length > 0 && (
        <Card className="border-orange-500 bg-orange-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-orange-600">
              <IconAlertTriangle className="h-5 w-5" />
              {pendingAlerts.length} alerte(s) en attente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingAlerts.map((alert) => (
              <div
                key={alert._id}
                className="flex items-center justify-between rounded-lg bg-background p-3"
              >
                <div>
                  <p className="text-sm font-medium">{alert.details}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(alert.createdAt, {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResolveAlert(alert._id)}
                >
                  <IconCheck className="mr-1 h-3 w-3" />
                  Résoudre
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="downloads">
            <TabsList>
              <TabsTrigger value="downloads">
                <IconDownload className="mr-2 h-4 w-4" />
                Téléchargements
              </TabsTrigger>
              <TabsTrigger value="payments">
                <IconCreditCard className="mr-2 h-4 w-4" />
                Paiements
              </TabsTrigger>
              <TabsTrigger value="activity">
                <IconUser className="mr-2 h-4 w-4" />
                Activité
              </TabsTrigger>
            </TabsList>

            {/* Downloads Tab */}
            <TabsContent value="downloads" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des téléchargements</CardTitle>
                  <CardDescription>
                    {user.downloads?.length || 0} téléchargement(s) au total
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user.downloads && user.downloads.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produit</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Appareil</TableHead>
                          <TableHead>Pays</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {user.downloads.map((download) => (
                          <TableRow key={download._id}>
                            <TableCell className="font-medium">
                              {download.productTitle}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {formatDistanceToNow(download.downloadedAt, {
                                addSuffix: true,
                                locale: fr,
                              })}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground max-w-50 truncate">
                              {download.userAgent?.split(" ")[0] || "-"}
                            </TableCell>
                            <TableCell>{download.ipCountry || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Aucun téléchargement
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des paiements</CardTitle>
                  <CardDescription>
                    {user.payments?.length || 0} paiement(s) au total
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user.payments && user.payments.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {user.payments.map((payment) => (
                          <TableRow key={payment._id}>
                            <TableCell>
                              <Badge variant="outline">
                                {payment.type === "initial"
                                  ? "Initial"
                                  : "Renouvellement"}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatPrice(payment.amount)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  payment.status === "success"
                                    ? "default"
                                    : payment.status === "failed"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {payment.status === "success"
                                  ? "Réussi"
                                  : payment.status === "failed"
                                    ? "Échoué"
                                    : payment.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {formatDistanceToNow(payment.createdAt, {
                                addSuffix: true,
                                locale: fr,
                              })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Aucun paiement
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Journal d&apos;activité</CardTitle>
                </CardHeader>
                <CardContent>
                  {user.auditLogs && user.auditLogs.length > 0 ? (
                    <div className="space-y-4">
                      {user.auditLogs.map((log) => (
                        <div
                          key={log._id}
                          className="flex items-start gap-3 text-sm"
                        >
                          <div className="rounded-full bg-muted p-1.5 mt-0.5">
                            <IconUser className="h-3 w-3" />
                          </div>
                          <div className="flex-1">
                            <p>{log.details || log.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(log.createdAt, {
                                addSuffix: true,
                                locale: fr,
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Aucune activité enregistrée
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <IconMail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <IconCalendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Inscrit</p>
                  <p className="font-medium">
                    {user.createdAt
                      ? format(user.createdAt, "dd MMM yyyy", { locale: fr })
                      : format(user._creationTime, "dd MMM yyyy", {
                          locale: fr,
                        })}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <IconDownload className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Téléchargements
                  </p>
                  <p className="font-medium">{user.downloads?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader>
              <CardTitle>Abonnement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.subscription ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Statut
                    </span>
                    <Badge
                      variant={
                        user.subscription.status === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {user.subscription.status === "active"
                        ? "Actif"
                        : user.subscription.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Début</span>
                    <span className="text-sm">
                      {format(user.subscription.startedAt, "dd MMM yyyy", {
                        locale: fr,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Expiration
                    </span>
                    <span className="text-sm">
                      {format(user.subscription.expiresAt, "dd MMM yyyy", {
                        locale: fr,
                      })}
                    </span>
                  </div>
                  {user.subscription.renewalAttempts !== undefined &&
                    user.subscription.renewalAttempts > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Tentatives renouvellement
                        </span>
                        <Badge variant="outline">
                          {user.subscription.renewalAttempts}
                        </Badge>
                      </div>
                    )}
                </>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Pas d&apos;abonnement
                </p>
              )}
            </CardContent>
          </Card>

          {/* Device Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Analyse des appareils</CardTitle>
              <CardDescription>
                Basé sur les téléchargements récents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconDevices className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Appareils uniques</span>
                </div>
                <Badge
                  variant={
                    user.deviceStats?.uniqueDevices > 3
                      ? "destructive"
                      : "outline"
                  }
                >
                  {user.deviceStats?.uniqueDevices || 0}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconWorld className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Adresses IP</span>
                </div>
                <Badge
                  variant={
                    user.deviceStats?.uniqueIPs > 5 ? "destructive" : "outline"
                  }
                >
                  {user.deviceStats?.uniqueIPs || 0}
                </Badge>
              </div>

              {user.deviceStats?.uniqueCountries &&
                user.deviceStats.uniqueCountries.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Pays détectés
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {user.deviceStats.uniqueCountries.map((country) => (
                          <Badge key={country} variant="secondary">
                            {country}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lock Dialog */}
      <Dialog open={lockDialogOpen} onOpenChange={setLockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verrouiller le compte</DialogTitle>
            <DialogDescription>
              L&apos;utilisateur {user.email} ne pourra plus se connecter ni
              télécharger de produits.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Raison du verrouillage</Label>
              <Textarea
                id="reason"
                placeholder="Ex: Partage de compte détecté, connexions depuis plusieurs pays..."
                value={lockReason}
                onChange={(e) => setLockReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLockDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleLock}
              disabled={!lockReason || isLocking}
            >
              {isLocking ? "Verrouillage..." : "Verrouiller le compte"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
