"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconCalendar,
  IconDownload,
  IconExternalLink,
  IconHistory,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";

export default function DownloadsPage() {
  const router = useRouter();
  const downloads = useQuery(api.downloads.getUserDownloads);
  const stats = useQuery(api.downloads.getUserDownloadStats);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Téléchargements</h2>
            <p className="text-muted-foreground">
              Historique de vos téléchargements
            </p>
          </div>

          {/* Stats */}
          {stats && (
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1 py-1.5">
                <IconDownload className="size-3" />
                {stats.todayCount} aujourd&apos;hui
              </Badge>
              <Badge variant="outline" className="gap-1 py-1.5">
                <IconCalendar className="size-3" />
                {stats.thisMonth} ce mois
              </Badge>
              <Badge variant="secondary" className="gap-1 py-1.5">
                {stats.remaining} restants
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Downloads List */}
      <div className="px-4 lg:px-6">
        {downloads === undefined ? (
          // Loading
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        ) : downloads.length > 0 ? (
          <div className="space-y-3">
            {downloads.map((download) => (
              <Card
                key={download._id}
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() =>
                  download.product &&
                  router.push(`/product/${download.productId}`)
                }
              >
                <CardContent className="flex items-center gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {download.product?.thumbnailUrl ? (
                      <Image
                        src={download.product.thumbnailUrl}
                        alt={download.product.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <IconDownload className="size-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">
                      {download.product?.title || "Produit supprimé"}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <IconHistory className="size-3" />
                      <span>
                        {formatDistanceToNow(download.downloadedAt, {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                      {download.product && (
                        <>
                          <span>•</span>
                          <Badge variant="secondary" className="text-xs">
                            {download.product.category}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <IconExternalLink className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <IconDownload className="size-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-medium">Aucun téléchargement</h3>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Vous n&apos;avez pas encore téléchargé de produit.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => router.push("/library")}
            >
              Explorer la bibliothèque
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
