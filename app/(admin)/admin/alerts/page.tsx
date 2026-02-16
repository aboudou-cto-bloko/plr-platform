"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconAlertTriangle,
  IconDevices,
  IconWorld,
  IconLock,
  IconCheck,
} from "@tabler/icons-react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

type AlertFilter = "all" | "pending" | "resolved";

export default function AlertsPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "resolved">(
    "pending",
  );
  const alerts = useQuery(api.admin.listSecurityAlerts, { filter });
  const resolveAlert = useMutation(api.admin.resolveAlert);

  if (!alerts) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const handleResolve = async (alertId: Id<"securityAlerts">) => {
    try {
      await resolveAlert({ alertId });
      toast.success("Alerte résolue");
    } catch (error) {
      toast.error("Erreur");
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "multiple_devices":
        return <IconDevices className="h-5 w-5" />;
      case "multiple_countries":
        return <IconWorld className="h-5 w-5" />;
      case "account_locked":
        return <IconLock className="h-5 w-5" />;
      default:
        return <IconAlertTriangle className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500 bg-red-500/10";
      case "medium":
        return "text-orange-500 bg-orange-500/10";
      default:
        return "text-yellow-500 bg-yellow-500/10";
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Alertes de sécurité</h1>
          <p className="text-muted-foreground">
            {alerts.filter((a) => !a.isResolved).length} alerte(s) en attente
          </p>
        </div>
        <Select value={filter} onValueChange={(v: AlertFilter) => setFilter(v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filtrer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="resolved">Résolues</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alerts */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Aucune alerte</p>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card
              key={alert._id}
              className={alert.isResolved ? "opacity-60" : ""}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-full p-2 ${getSeverityColor(alert.severity)}`}
                    >
                      {getAlertIcon(alert.type)}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {alert.type === "multiple_devices" &&
                          "Appareils multiples détectés"}
                        {alert.type === "multiple_countries" &&
                          "Connexions depuis plusieurs pays"}
                        {alert.type === "account_locked" && "Compte verrouillé"}
                        {alert.type === "suspicious_activity" &&
                          "Activité suspecte"}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        <Link
                          href={`/admin/users/${alert.userId}`}
                          className="hover:underline"
                        >
                          {alert.userName}
                        </Link>{" "}
                        • {alert.userEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        alert.severity === "high"
                          ? "destructive"
                          : alert.severity === "medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {alert.severity === "high"
                        ? "Haute"
                        : alert.severity === "medium"
                          ? "Moyenne"
                          : "Basse"}
                    </Badge>
                    {alert.isResolved ? (
                      <Badge variant="outline">
                        <IconCheck className="mr-1 h-3 w-3" />
                        Résolue
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolve(alert._id)}
                      >
                        Marquer résolue
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{alert.details}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatDistanceToNow(alert.createdAt, {
                    addSuffix: true,
                    locale: fr,
                  })}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
