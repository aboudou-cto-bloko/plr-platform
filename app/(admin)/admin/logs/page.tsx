"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const ACTION_LABELS: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  product_created: { label: "Produit créé", variant: "default" },
  product_updated: { label: "Produit modifié", variant: "secondary" },
  product_deleted: { label: "Produit supprimé", variant: "destructive" },
  bulk_product_delete: {
    label: "Suppression en masse",
    variant: "destructive",
  },
  user_locked: { label: "Compte verrouillé", variant: "destructive" },
  user_unlocked: { label: "Compte déverrouillé", variant: "default" },
  alert_resolved: { label: "Alerte résolue", variant: "secondary" },
};

export default function AuditLogsPage() {
  const logs = useQuery(api.admin.listAuditLogs, { limit: 100 });

  if (!logs) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Journal d&apos;activité</h1>
        <p className="text-muted-foreground">
          Historique des actions administratives
        </p>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Détails</TableHead>
              <TableHead>Par</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <p className="text-muted-foreground">Aucune activité</p>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => {
                const actionInfo = ACTION_LABELS[log.action] || {
                  label: log.action,
                  variant: "outline" as const,
                };
                return (
                  <TableRow key={log._id}>
                    <TableCell>
                      <Badge variant={actionInfo.variant}>
                        {actionInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm truncate">{log.details || "-"}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {log.userEmail}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDistanceToNow(log.createdAt, {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
