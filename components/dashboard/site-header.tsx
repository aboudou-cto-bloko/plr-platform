// components/site-header.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { IconCoin, IconInfinity } from "@tabler/icons-react";
import Link from "next/link";

export function SiteHeader() {
  const creditsInfo = useQuery(api.downloads.getUserCredits);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Credits indicator */}
        {creditsInfo && (
          <Link href="/settings">
            {creditsInfo.isUnlimited ? (
              <Badge
                variant="outline"
                className="gap-1.5 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-colors cursor-pointer"
              >
                <IconInfinity className="size-3.5" />
                <span className="text-xs font-medium">Illimité</span>
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className={`gap-1.5 transition-colors cursor-pointer ${
                  creditsInfo.credits !== null && creditsInfo.credits <= 5
                    ? "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                }`}
              >
                <IconCoin className="size-3.5" />
                <span className="text-xs font-medium">
                  {creditsInfo.credits ?? 0} crédit
                  {(creditsInfo.credits ?? 0) > 1 ? "s" : ""}
                </span>
              </Badge>
            )}
          </Link>
        )}
      </div>
    </header>
  );
}
