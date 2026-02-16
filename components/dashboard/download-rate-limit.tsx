// components/download-rate-limit.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Progress } from "@/components/ui/progress";
import { IconDownload } from "@tabler/icons-react";
import { RATE_LIMIT } from "@/convex/constants";

export function DownloadRateLimit() {
  const rateLimit = useQuery(api.downloads.checkRateLimit);
  const stats = useQuery(api.downloads.getUserDownloadStats);

  if (!rateLimit || !stats) return null;

  const maxDownloads = RATE_LIMIT.MAX_DOWNLOADS;
  const used = maxDownloads - rateLimit.remaining;
  const percentage = (used / maxDownloads) * 100;

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <IconDownload className="h-4 w-4 text-muted-foreground" />
          <span>Téléchargements</span>
        </div>
        <span className="font-medium">
          {rateLimit.remaining} / {maxDownloads} restants
        </span>
      </div>

      <Progress value={percentage} className="h-2" />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{stats.todayCount} aujourd1apos;hui</span>
        <span>{stats.thisMonth} ce mois</span>
        <span>{stats.total} au total</span>
      </div>
    </div>
  );
}
