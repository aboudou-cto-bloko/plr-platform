"use client";

import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, CheckCircle, Clock, RefreshCw } from "lucide-react";

export default function AdminSubscriptionsPage() {
  const users = useQuery(api.admin.listUsers, { filter: "all" });
  const [now] = useState(() => Date.now());

  if (users === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const threeDays = 3 * 24 * 60 * 60 * 1000;

  const activeSubscriptions = users.filter(
    (u) => u.subscription?.status === "active",
  );
  const pendingRenewal = users.filter(
    (u) => u.subscription?.status === "pending_renewal",
  );
  const expiringSoon = activeSubscriptions.filter(
    (u) => u.subscription && u.subscription.expiresAt - now < threeDays,
  );
  const expired = users.filter((u) => u.subscription?.status === "expired");

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
            <CheckCircle className="mr-1 h-3 w-3" />
            Actif
          </Badge>
        );
      case "pending_renewal":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
            <RefreshCw className="mr-1 h-3 w-3" />
            Renouvellement
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Expiré
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Aucun
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Abonnements</h1>
        <p className="text-muted-foreground">
          Suivi des abonnements et renouvellements
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Actifs
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{activeSubscriptions.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En renouvellement
            </CardTitle>
            <RefreshCw className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pendingRenewal.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expirent bientôt
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{expiringSoon.length}</p>
            <p className="text-xs text-muted-foreground">dans 3 jours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expirés
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{expired.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Détails des abonnements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Début</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Tentatives</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users
                  .filter((u) => u.subscription)
                  .sort((a, b) => {
                    // Sort by expiry date
                    const aExp = a.subscription?.expiresAt || 0;
                    const bExp = b.subscription?.expiresAt || 0;
                    return aExp - bExp;
                  })
                  .map((user) => {
                    const sub = user.subscription!;
                    const isExpiringSoon =
                      sub.status === "active" &&
                      sub.expiresAt - now < threeDays;

                    return (
                      <TableRow
                        key={user._id}
                        className={isExpiringSoon ? "bg-yellow-500/5" : ""}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name || "—"}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(sub.status)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(sub.startedAt)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              isExpiringSoon
                                ? "text-yellow-500 font-medium"
                                : sub.expiresAt < now
                                  ? "text-destructive"
                                  : "text-muted-foreground"
                            }
                          >
                            {formatDate(sub.expiresAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {(sub.renewalAttempts ?? 0) > 0 ? (
                            <Badge variant="outline">
                              {sub.renewalAttempts}/3
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
