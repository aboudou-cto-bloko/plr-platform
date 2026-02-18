// app/(admin)/admin/affiliates/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  DialogTrigger,
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
  IconPlus,
  IconCopy,
  IconTrash,
  IconCheck,
  IconUsers,
  IconCash,
  IconPercentage,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/constants";
import Link from "next/link";

export default function AffiliatesPage() {
  const affiliates = useQuery(api.affiliates.list);
  const stats = useQuery(api.affiliates.getStats);
  const createAffiliate = useMutation(api.affiliates.create);
  const updateAffiliate = useMutation(api.affiliates.update);
  const removeAffiliate = useMutation(api.affiliates.remove);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Id<"affiliates"> | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [newAffiliate, setNewAffiliate] = useState({
    name: "",
    email: "",
    code: "",
    discountPercent: 20,
    commissionPercent: 30,
  });

  const handleCreate = async () => {
    try {
      await createAffiliate(newAffiliate);
      toast.success("Affilié créé");
      setIsCreateOpen(false);
      setNewAffiliate({
        name: "",
        email: "",
        code: "",
        discountPercent: 20,
        commissionPercent: 30,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  const handleToggleActive = async (
    affiliateId: Id<"affiliates">,
    isActive: boolean,
  ) => {
    try {
      await updateAffiliate({ affiliateId, isActive: !isActive });
      toast.success(isActive ? "Affilié désactivé" : "Affilié activé");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await removeAffiliate({ affiliateId: deleteTarget });
      toast.success("Affilié supprimé");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const copyLink = (code: string) => {
    const url = `${window.location.origin}/?ref=${code}`;
    navigator.clipboard.writeText(url);
    toast.success("Lien copié !");
  };

  if (!affiliates || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Affiliés</h1>
          <p className="text-muted-foreground">
            Gérez vos partenaires et leurs commissions
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <IconPlus className="mr-2 h-4 w-4" />
              Nouvel affilié
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un affilié</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau partenaire avec son code unique
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input
                  placeholder="John Doe"
                  value={newAffiliate.name}
                  onChange={(e) =>
                    setNewAffiliate({ ...newAffiliate, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={newAffiliate.email}
                  onChange={(e) =>
                    setNewAffiliate({ ...newAffiliate, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Code affilié</Label>
                <Input
                  placeholder="john, partner2024..."
                  value={newAffiliate.code}
                  onChange={(e) =>
                    setNewAffiliate({
                      ...newAffiliate,
                      code: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, ""),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Lien: {window.location.origin}/?ref=
                  {newAffiliate.code || "xxx"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Réduction client (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={newAffiliate.discountPercent}
                    onChange={(e) =>
                      setNewAffiliate({
                        ...newAffiliate,
                        discountPercent: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Commission affilié (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={newAffiliate.commissionPercent}
                    onChange={(e) =>
                      setNewAffiliate({
                        ...newAffiliate,
                        commissionPercent: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreate}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <IconUsers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Affiliés actifs</p>
                <p className="text-2xl font-bold">{stats.activeAffiliates}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <IconCheck className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversions</p>
                <p className="text-2xl font-bold">
                  {stats.totalPaidReferrals}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    ({stats.conversionRate}%)
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
                  {formatPrice(stats.totalRevenue)}
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
                <p className="text-sm text-muted-foreground">
                  Commissions dues
                </p>
                <p className="text-2xl font-bold">
                  {formatPrice(stats.unpaidCommission)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Affilié</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Réduction</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Referrals</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>À payer</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {affiliates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <p className="text-muted-foreground">Aucun affilié</p>
                  </TableCell>
                </TableRow>
              ) : (
                affiliates.map((affiliate) => (
                  <TableRow key={affiliate._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{affiliate.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {affiliate.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-0.5 rounded">
                          {affiliate.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyLink(affiliate.code)}
                        >
                          <IconCopy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{affiliate.discountPercent}%</TableCell>
                    <TableCell>{affiliate.commissionPercent}%</TableCell>
                    <TableCell>
                      {affiliate.totalPaidReferrals}/{affiliate.totalReferrals}
                    </TableCell>
                    <TableCell>{formatPrice(affiliate.totalRevenue)}</TableCell>
                    <TableCell>
                      {affiliate.unpaidCommission > 0 ? (
                        <Badge variant="secondary">
                          {formatPrice(affiliate.unpaidCommission)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={affiliate.isActive ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() =>
                          handleToggleActive(affiliate._id, affiliate.isActive)
                        }
                      >
                        {affiliate.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/affiliates/${affiliate._id}`}>
                            Détails
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(affiliate._id)}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet affilié ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L&apos;historique des referrals
              sera conservé mais l&apos;affilié ne pourra plus générer de
              nouvelles conversions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
