"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useDeviceInfo } from "@/hooks/use-device-info";
import {
  IconDownload,
  IconLock,
  IconCrown,
  IconRefresh,
} from "@tabler/icons-react";
import { toast } from "sonner";
import Link from "next/link";

interface DownloadButtonProps {
  productId: Id<"products">;
  productTitle: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
}

export function DownloadButton({
  productId,
  productTitle,
  variant = "default",
  size = "default",
  className,
  showIcon = true,
}: DownloadButtonProps) {
  const user = useQuery(api.users.getCurrentUser);
  const rateLimit = useQuery(api.downloads.checkRateLimit);
  const getDownloadUrl = useMutation(api.downloads.getDownloadUrl);
  const { deviceInfo } = useDeviceInfo();

  const [isDownloading, setIsDownloading] = useState(false);

  // États d'accès
  const isLoading = user === undefined;
  const isLocked = user?.isLocked;
  const isActive = user?.subscriptionStatus === "active";
  const isExpired = user?.subscriptionStatus === "expired";
  const isFree = user?.subscriptionStatus === "none";
  const isRateLimited = rateLimit && !rateLimit.allowed;

  const handleDownload = async () => {
    if (!isActive || isLocked || isRateLimited) return;

    setIsDownloading(true);

    try {
      const result = await getDownloadUrl({
        productId,
        userAgent: deviceInfo.userAgent,
        deviceFingerprint: deviceInfo.deviceFingerprint,
      });

      if (result.url) {
        // Créer un lien temporaire pour déclencher le téléchargement
        const link = document.createElement("a");
        link.href = result.url;
        link.download = result.fileName || `${productTitle}.zip`;
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Téléchargement de "${productTitle}" démarré`);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erreur lors du téléchargement";
      toast.error(message);
    } finally {
      setIsDownloading(false);
    }
  };

  // Loading
  if (isLoading) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      </Button>
    );
  }

  // Compte verrouillé
  if (isLocked) {
    return (
      <Button
        variant="destructive"
        size={size}
        className={className}
        disabled
        title="Votre compte est temporairement suspendu"
      >
        {showIcon && <IconLock className="mr-2 h-4 w-4" />}
        Compte suspendu
      </Button>
    );
  }

  if (isRateLimited && rateLimit) {
    const resetIn = Math.ceil((rateLimit.resetAt - Date.now()) / 1000 / 60);
    return (
      <Button
        variant="outline"
        size={size}
        className={className}
        disabled
        title={`Limite atteinte. Réessayez dans ${resetIn} minutes`}
      >
        {showIcon && <IconRefresh className="mr-2 h-4 w-4" />}
        Limite atteinte ({resetIn}min)
      </Button>
    );
  }

  if (isExpired) {
    return (
      <Button variant="outline" size={size} className={className} asChild>
        <Link href="/settings/billing">
          {showIcon && <IconCrown className="mr-2 h-4 w-4" />}
          Renouveler pour télécharger
        </Link>
      </Button>
    );
  }

  if (isFree || !isActive) {
    return (
      <Button variant={variant} size={size} className={className} asChild>
        <Link href="/payment">
          {showIcon && <IconCrown className="mr-2 h-4 w-4" />}
          S&apos;abonner pour télécharger
        </Link>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleDownload}
      disabled={isDownloading}
    >
      {isDownloading ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Téléchargement...
        </>
      ) : (
        <>
          {showIcon && <IconDownload className="mr-2 h-4 w-4" />}
          Télécharger
        </>
      )}
    </Button>
  );
}
