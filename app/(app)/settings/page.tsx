"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconLoader2,
  IconCheck,
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const user = useQuery(api.users.getCurrentUser);
  const updateProfile = useMutation(api.users.updateProfile);

  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form when user loads
  useState(() => {
    if (user?.name) {
      setName(user.name);
    }
  });

  const handleNameChange = (value: string) => {
    setName(value);
    setHasChanges(value !== (user?.name || ""));
  };

  const handleSave = async () => {
    if (!hasChanges) return;

    setIsLoading(true);
    try {
      await updateProfile({ name });
      toast.success("Profil mis à jour");
      setHasChanges(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsLoading(false);
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

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email[0].toUpperCase();

  return (
    <div className="px-4 lg:px-6 space-y-6">
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Vos informations personnelles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{user.name || "Utilisateur"}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge
                variant={
                  user.subscriptionStatus === "active" ? "default" : "secondary"
                }
                className="mt-2"
              >
                {user.subscriptionStatus === "active" ? "Abonné" : "Non abonné"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Form Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <div className="relative">
                <IconUser className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  value={name || user.name || ""}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Votre nom"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <IconMail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="pl-9 bg-muted"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                L&apos;email ne peut pas être modifié
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <p className="text-sm text-muted-foreground">
            Membre depuis{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric",
                })
              : "récemment"}
          </p>
          <Button onClick={handleSave} disabled={!hasChanges || isLoading}>
            {isLoading ? (
              <IconLoader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <IconCheck className="mr-2 size-4" />
            )}
            Enregistrer
          </Button>
        </CardFooter>
      </Card>

      {/* Account Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques</CardTitle>
          <CardDescription>Votre activité sur PLR Library</CardDescription>
        </CardHeader>
        <CardContent>
          <AccountStats />
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Zone de danger</CardTitle>
          <CardDescription>
            Actions irréversibles sur votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Supprimer mon compte</p>
              <p className="text-sm text-muted-foreground">
                Supprime définitivement votre compte et toutes vos données
              </p>
            </div>
            <Button variant="destructive" size="sm" disabled>
              Supprimer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AccountStats() {
  const downloadStats = useQuery(api.downloads.getUserDownloadStats);

  if (!downloadStats) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Total téléchargements",
      value: downloadStats.total,
    },
    {
      label: "Ce mois-ci",
      value: downloadStats.thisMonth,
    },
    {
      label: "Restants aujourd'hui",
      value: downloadStats.remaining,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-lg border bg-muted/50 p-4 text-center"
        >
          <p className="text-3xl font-bold">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
