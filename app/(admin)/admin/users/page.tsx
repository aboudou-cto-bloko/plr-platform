"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  IconDotsVertical,
  IconLock,
  IconLockOpen,
  IconEye,
  IconSearch,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { toast } from "sonner";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

type UserFilter = "all" | "active" | "expired" | "locked";

export default function UsersPage() {
  const [filter, setFilter] = useState<"all" | "active" | "expired" | "locked">(
    "all",
  );

  const users = useQuery(api.admin.listUsers, { filter });
  const lockUser = useMutation(api.admin.lockUser);
  const unlockUser = useMutation(api.admin.unlockUser);

  const [search, setSearch] = useState("");
  const [lockDialogOpen, setLockDialogOpen] = useState(false);
  const [userToLock, setUserToLock] = useState<Id<"users"> | null>(null);
  const [lockReason, setLockReason] = useState("");

  if (!users) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Filter by search
  let filteredUsers = users;
  if (search) {
    const searchLower = search.toLowerCase();
    filteredUsers = filteredUsers.filter(
      (u) =>
        u.email.toLowerCase().includes(searchLower) ||
        u.name?.toLowerCase().includes(searchLower),
    );
  }

  const handleLock = async () => {
    if (!userToLock || !lockReason) return;
    try {
      await lockUser({ userId: userToLock, reason: lockReason });
      toast.success("Compte verrouillé");
      setLockDialogOpen(false);
      setUserToLock(null);
      setLockReason("");
    } catch (error) {
      toast.error("Erreur lors du verrouillage");
    }
  };

  const handleUnlock = async (userId: Id<"users">) => {
    try {
      await unlockUser({ userId });
      toast.success("Compte déverrouillé");
    } catch (error) {
      toast.error("Erreur lors du déverrouillage");
    }
  };

  const getStatusBadge = (status: string, isLocked?: boolean) => {
    if (isLocked) {
      return <Badge variant="destructive">Verrouillé</Badge>;
    }
    switch (status) {
      case "active":
        return <Badge variant="default">Actif</Badge>;
      case "expired":
        return <Badge variant="secondary">Expiré</Badge>;
      case "none":
        return <Badge variant="outline">Gratuit</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Utilisateurs</h1>
        <p className="text-muted-foreground">{users.length} utilisateur(s)</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par email ou nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={(v: UserFilter) => setFilter(v)}>
          <SelectTrigger className="w-37.5">
            <SelectValue placeholder="Filtrer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="active">Actifs</SelectItem>
            <SelectItem value="expired">Expirés</SelectItem>
            <SelectItem value="locked">Verrouillés</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Téléchargements</TableHead>
              <TableHead>Expiration</TableHead>
              <TableHead>Alertes</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">
                    Aucun utilisateur trouvé
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {user.name || "Sans nom"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.subscriptionStatus, user.isLocked)}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.downloadCount}
                  </TableCell>
                  <TableCell>
                    {user.subscription?.expiresAt ? (
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(user.subscription.expiresAt, {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.pendingAlerts > 0 && (
                      <Badge variant="destructive" className="gap-1">
                        <IconAlertTriangle className="h-3 w-3" />
                        {user.pendingAlerts}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <IconDotsVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/users/${user._id}`}>
                            <IconEye className="mr-2 h-4 w-4" />
                            Voir détails
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.isLocked ? (
                          <DropdownMenuItem
                            onClick={() => handleUnlock(user._id)}
                          >
                            <IconLockOpen className="mr-2 h-4 w-4" />
                            Déverrouiller
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setUserToLock(user._id);
                              setLockDialogOpen(true);
                            }}
                          >
                            <IconLock className="mr-2 h-4 w-4" />
                            Verrouiller
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Lock Dialog */}
      <Dialog open={lockDialogOpen} onOpenChange={setLockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verrouiller le compte</DialogTitle>
            <DialogDescription>
              L&apos;utilisateur ne pourra plus se connecter ni télécharger de
              produits.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Raison du verrouillage</Label>
              <Textarea
                id="reason"
                placeholder="Ex: Partage de compte détecté..."
                value={lockReason}
                onChange={(e) => setLockReason(e.target.value)}
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
              disabled={!lockReason}
            >
              Verrouiller
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
