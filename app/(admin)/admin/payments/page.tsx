"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { formatPrice } from "@/lib/constants";

type PaymentFilter = "all" | "success" | "pending" | "failed";
export default function PaymentsPage() {
  const [filter, setFilter] = useState<
    "all" | "success" | "pending" | "failed"
  >("all");
  const payments = useQuery(api.admin.listPayments, { filter });

  if (!payments) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="default">Réussi</Badge>;
      case "pending":
        return <Badge variant="outline">En attente</Badge>;
      case "initiated":
        return <Badge variant="secondary">Initié</Badge>;
      case "failed":
        return <Badge variant="destructive">Échoué</Badge>;
      case "cancelled":
        return <Badge variant="secondary">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalSuccess = payments
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Paiements</h1>
          <p className="text-muted-foreground">
            {payments.length} paiement(s) • Total réussi :{" "}
            {formatPrice(totalSuccess)}
          </p>
        </div>
        <Select
          value={filter}
          onValueChange={(v: PaymentFilter) => setFilter(v)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filtrer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="success">Réussis</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="failed">Échoués</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>ID Moneroo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">Aucun paiement trouvé</p>
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.userName}</div>
                      <div className="text-sm text-muted-foreground">
                        {payment.userEmail}
                      </div>
                    </div>
                  </TableCell>
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
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDistanceToNow(payment.createdAt, {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs font-mono">
                    {payment.monerooPaymentId?.slice(0, 12) || "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
