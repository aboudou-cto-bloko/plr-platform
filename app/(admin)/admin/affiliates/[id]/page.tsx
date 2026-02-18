// app/(admin)/admin/affiliates/[id]/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  IconArrowLeft,
  IconCopy,
  IconEdit,
  IconTrash,
  IconCash,
  IconUsers,
  IconPercentage,
  IconCheck,
  IconClock,
  IconUser,
  IconWallet,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/constants";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

export default function AffiliateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const affiliateId = params.id as Id<"affiliates">;

  const affiliate = useQuery(api.affiliates.getById, { affiliateId });
  const updateAffiliate = useMutation(api.affiliates.update);
  const removeAffiliate = useMutation(api.affiliates.remove);
  const markCommissionPaid = useMutation(api.affiliates.markCommissionPaid);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    discountPercent: 0,
    commissionPercent: 0,
  });

  // Charger les données dans le formulaire d'édition
  const openEditDialog = () => {
    if (affiliate) {
      setEditForm({
        name: affiliate.name,
        email: affiliate.email,
        discountPercent: affiliate.discountPercent,
        commissionPercent: affiliate.commissionPercent,
      });
      setIsEditOpen(true);
    }
  };

  const handleUpdate = async () => {
    setIsProcessing(true);
    try {
      await updateAffiliate({
        affiliateId,
        name: editForm.name,
        email: editForm.email,
        discountPercent: editForm.discountPercent,
        commissionPercent: editForm.commissionPercent,
      });
      toast.success("Affilié mis à jour");
      setIsEditOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de la mise à jour",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      await removeAffiliate({ affiliateId });
      toast.success("Affilié supprimé");
      router.push("/admin/affiliates");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
      setIsProcessing(false);
    }
  };

  const handleMarkPaid = async () => {
    const amount = Number(payAmount);
    if (!amount || amount <= 0) {
      toast.error("Montant invalide");
      return;
    }

    setIsProcessing(true);
    try {
      await markCommissionPaid({ affiliateId, amount });
      toast.success(`${formatPrice(amount)} marqué comme payé`);
      setIsPayOpen(false);
      setPayAmount("");
    } catch (error) {
      toast.error("Erreur");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyLink = () => {
    if (affiliate) {
      const url = `${window.location.origin}/?ref=${affiliate.code}`;
      navigator.clipboard.writeText(url);
      toast.success("Lien copié !");
    }
  };

  const toggleActive = async () => {
    if (!affiliate) return;
    try {
      await updateAffiliate({ affiliateId, isActive: !affiliate.isActive });
      toast.success(
        affiliate.isActive ? "Affilié désactivé" : "Affilié activé",
      );
    } catch (error) {
      toast.error("Erreur");
    }
  };

  if (affiliate === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (affiliate === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-muted-foreground">Affilié non trouvé</p>
        <Button variant="outline" asChild>
          <Link href="/admin/affiliates">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Retour aux affiliés
          </Link>
        </Button>
      </div>
    );
  }

  const conversionRate =
    affiliate.totalReferrals > 0
      ? Math.round(
          (affiliate.totalPaidReferrals / affiliate.totalReferrals) * 100,
        )
      : 0;

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/affiliates">
              <IconArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">{affiliate.name}</h1>
              <Badge variant={affiliate.isActive ? "default" : "secondary"}>
                {affiliate.isActive ? "Actif" : "Inactif"}
              </Badge>
            </div>
            <p className="text-muted-foreground">{affiliate.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={copyLink}>
            <IconCopy className="mr-2 h-4 w-4" />
            Copier le lien
          </Button>
          <Button variant="outline" size="sm" onClick={openEditDialog}>
            <IconEdit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <Button variant="outline" size="sm" onClick={toggleActive}>
            {affiliate.isActive ? "Désactiver" : "Activer"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
          >
            <IconTrash className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <IconUsers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Referrals</p>
                <p className="text-2xl font-bold">
                  {affiliate.totalPaidReferrals}/{affiliate.totalReferrals}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    ({conversionRate}%)
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <IconCash className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue généré</p>
                <p className="text-2xl font-bold">
                  {formatPrice(affiliate.totalRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <IconWallet className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Commission totale
                </p>
                <p className="text-2xl font-bold">
                  {formatPrice(affiliate.totalCommission)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-500/10 p-2">
                <IconPercentage className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">À payer</p>
                <p className="text-2xl font-bold">
                  {formatPrice(affiliate.unpaidCommission)}
                </p>
              </div>
            </div>
            {affiliate.unpaidCommission > 0 && (
              <Button
                size="sm"
                className="w-full mt-3"
                onClick={() => {
                  setPayAmount(affiliate.unpaidCommission.toString());
                  setIsPayOpen(true);
                }}
              >
                Marquer comme payé
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Code affilié</p>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-lg font-mono bg-muted px-3 py-1 rounded">
                  {affiliate.code}
                </code>
                <Button variant="ghost" size="icon" onClick={copyLink}>
                  <IconCopy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Réduction client
                </p>
                <p className="text-lg font-semibold">
                  {affiliate.discountPercent}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Commission</p>
                <p className="text-lg font-semibold">
                  {affiliate.commissionPercent}%
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">
                Lien de parrainage
              </p>
              <p className="text-xs font-mono bg-muted p-2 rounded mt-1 break-all">
                {window.location.origin}/?ref={affiliate.code}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Créé le</p>
              <p className="text-sm">
                {format(affiliate.createdAt, "dd MMMM yyyy à HH:mm", {
                  locale: fr,
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Referrals Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Historique des referrals</CardTitle>
            <CardDescription>
              {affiliate.referrals?.length || 0} referral(s) au total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {affiliate.referrals && affiliate.referrals.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliate.referrals.map((referral) => (
                    <TableRow key={referral._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-muted p-1.5">
                            <IconUser className="h-3 w-3" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {referral.userName || "Anonyme"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {referral.userEmail || "-"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            referral.status === "paid"
                              ? "default"
                              : referral.status === "signed_up"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {referral.status === "paid" && (
                            <IconCheck className="mr-1 h-3 w-3" />
                          )}
                          {referral.status === "signed_up" && (
                            <IconClock className="mr-1 h-3 w-3" />
                          )}
                          {referral.status === "paid"
                            ? "Converti"
                            : referral.status === "signed_up"
                              ? "Inscrit"
                              : "Clic"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {referral.finalAmount ? (
                          <div>
                            <p className="font-medium">
                              {formatPrice(referral.finalAmount)}
                            </p>
                            {referral.discountAmount &&
                              referral.discountAmount > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  (-{formatPrice(referral.discountAmount)})
                                </p>
                              )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {referral.commissionAmount ? (
                          <span className="font-medium text-green-600">
                            +{formatPrice(referral.commissionAmount)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(referral.createdAt, {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucun referral</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l&apos;affilié</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Réduction client (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={editForm.discountPercent}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      discountPercent: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Commission (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={editForm.commissionPercent}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      commissionPercent: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdate} disabled={isProcessing}>
              {isProcessing ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pay Dialog */}
      <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marquer la commission comme payée</DialogTitle>
            <DialogDescription>
              Après avoir effectué le paiement à {affiliate.name}, entrez le
              montant payé pour mettre à jour le solde.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Montant payé (FCFA)</Label>
              <Input
                type="number"
                placeholder={affiliate.unpaidCommission.toString()}
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Solde actuel : {formatPrice(affiliate.unpaidCommission)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPayOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleMarkPaid} disabled={isProcessing}>
              {isProcessing ? "Traitement..." : "Confirmer le paiement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer {affiliate.name} ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L&apos;historique des referrals
              sera conservé mais l&apos;affilié ne pourra plus générer de
              nouvelles conversions.
              {affiliate.unpaidCommission > 0 && (
                <span className="block mt-2 text-orange-600">
                  Attention : {formatPrice(affiliate.unpaidCommission)} de
                  commissions sont encore dues.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isProcessing}
            >
              {isProcessing ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
