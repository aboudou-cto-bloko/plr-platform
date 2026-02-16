// app/(app)/suspended/page.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconLock, IconMail } from "@tabler/icons-react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function SuspendedPage() {
  const user = useQuery(api.users.getCurrentUser);

  if (!user?.isLocked) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-destructive/10 p-4 w-fit">
            <IconLock className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle>Compte suspendu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Votre compte a été temporairement suspendu pour la raison suivante :
          </p>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">
              {user.lockReason || "Activité suspecte détectée"}
            </p>
            {user.lockedAt && (
              <p className="text-xs text-muted-foreground mt-1">
                Depuis le{" "}
                {format(user.lockedAt, "dd MMMM yyyy à HH:mm", { locale: fr })}
              </p>
            )}
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur, veuillez
            contacter notre support pour régulariser votre situation.
          </p>

          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/help">
                <IconMail className="mr-2 h-4 w-4" />
                Contacter le support
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/settings/billing">Voir mon historique</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
