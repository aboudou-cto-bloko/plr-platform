// components/product/DownloadButton.tsx
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
  IconClock,
  IconCheck,
  IconLoader2,
  IconCoin,
} from "@tabler/icons-react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DownloadButtonProps {
  productId: Id<"products">;
  productTitle: string;
  creditCost?: number;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
}

export function DownloadButton({
  productId,
  productTitle,
  creditCost = 1,
  variant = "default",
  size = "default",
  className,
  showIcon = true,
}: DownloadButtonProps) {
  const user = useQuery(api.users.getCurrentUser);
  const rateLimit = useQuery(api.downloads.checkRateLimit);
  const creditsInfo = useQuery(api.downloads.getUserCredits);
  const canDownload = useQuery(api.downloads.canDownloadProduct, { productId });
  const hasDownloaded = useQuery(api.downloads.hasUserDownloaded, {
    productId,
  });
  const getDownloadUrl = useMutation(api.downloads.getDownloadUrl);
  const { deviceInfo } = useDeviceInfo();

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  // États d'accès
  const isLoading =
    user === undefined ||
    creditsInfo === undefined ||
    canDownload === undefined;
  const isLocked = user?.isLocked;
  const isSubscribed = user?.subscriptionStatus === "active";
  const isExpired = user?.subscriptionStatus === "expired";
  const isFree =
    user?.subscriptionStatus === "none" ||
    user?.subscriptionStatus === "cancelled";
  const isRateLimited = rateLimit && !rateLimit.allowed;

  // Crédits
  const hasEnoughCredits = canDownload?.canDownload ?? false;
  const userCredits = creditsInfo?.credits ?? 0;
  const isUnlimited = creditsInfo?.isUnlimited ?? false;

  const handleDownload = async () => {
    if (isLocked || isRateLimited) return;
    if (!isSubscribed && !hasEnoughCredits) return;

    setIsDownloading(true);
    setDownloadComplete(false);

    try {
      const result = await getDownloadUrl({
        productId,
        userAgent: deviceInfo.userAgent,
        deviceFingerprint: deviceInfo.deviceFingerprint,
      });

      if (result.url) {
        const link = document.createElement("a");
        link.href = result.url;
        link.download = result.fileName || `${productTitle}.zip`;
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setDownloadComplete(true);

        // Message différent selon le type d'utilisateur
        if (result.creditsUsed > 0) {
          toast.success(
            `Téléchargement démarré ! -${result.creditsUsed} crédit${result.creditsUsed > 1 ? "s" : ""} (reste: ${result.creditsRemaining})`,
          );
        } else {
          toast.success(`Téléchargement de "${productTitle}" démarré`);
        }

        // Reset après 3 secondes
        setTimeout(() => setDownloadComplete(false), 3000);
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

  // Loading state
  if (isLoading) {
    return (
      <Button
        variant={variant}
        size={size}
        className={cn("relative", className)}
        disabled
      >
        <IconLoader2 className="size-4 animate-spin" />
        <span className="ml-2">Chargement...</span>
      </Button>
    );
  }

  // Compte verrouillé
  if (isLocked) {
    return (
      <Button
        variant="destructive"
        size={size}
        className={cn("relative group", className)}
        disabled
      >
        {showIcon && <IconLock className="size-4 mr-2" />}
        <span>Compte suspendu</span>
        <span className="absolute inset-x-0 -bottom-6 text-xs text-destructive/70 opacity-0 group-hover:opacity-100 transition-opacity">
          Contactez le support
        </span>
      </Button>
    );
  }

  // Rate limited
  if (isRateLimited && rateLimit) {
    const resetIn = Math.ceil((rateLimit.resetAt - Date.now()) / 1000 / 60);
    return (
      <Button
        variant="outline"
        size={size}
        className={cn(
          "relative border-amber-500/50 text-amber-600 dark:text-amber-400",
          className,
        )}
        disabled
      >
        {showIcon && <IconClock className="size-4 mr-2" />}
        <span>Limite atteinte</span>
        <span className="ml-1.5 px-1.5 py-0.5 rounded bg-amber-500/10 text-xs font-medium">
          {resetIn}min
        </span>
      </Button>
    );
  }

  // Expired subscription
  if (isExpired) {
    return (
      <Button
        variant="outline"
        size={size}
        className={cn(
          "relative border-primary/50 hover:border-primary hover:bg-primary/5",
          className,
        )}
        asChild
      >
        <Link href="/settings/billing">
          {showIcon && <IconCrown className="size-4 mr-2 text-primary" />}
          <span>Renouveler l&apos;abonnement</span>
        </Link>
      </Button>
    );
  }

  // Free user - not enough credits
  if (isFree && !hasEnoughCredits) {
    return (
      <div className="space-y-2">
        <Button
          variant="outline"
          size={size}
          className={cn(
            "relative w-full border-orange-500/50 text-orange-600 dark:text-orange-400",
            className,
          )}
          disabled
        >
          {showIcon && <IconCoin className="size-4 mr-2" />}
          <span>Crédits insuffisants</span>
          <span className="ml-1.5 px-1.5 py-0.5 rounded bg-orange-500/10 text-xs font-medium">
            {userCredits}/{creditCost}
          </span>
        </Button>
        <Button
          size="sm"
          className="w-full bg-gradient-to-r from-primary to-[oklch(0.65_0.18_180)]"
          asChild
        >
          <Link href="/payment">
            <IconCrown className="size-4 mr-2" />
            Passer Premium pour un accès illimité
          </Link>
        </Button>
      </div>
    );
  }

  // Download complete state
  if (downloadComplete) {
    return (
      <Button
        variant="outline"
        size={size}
        className={cn(
          "relative border-green-500/50 text-green-600 dark:text-green-400 bg-green-500/5",
          className,
        )}
        disabled
      >
        <IconCheck className="size-4 mr-2" />
        <span>Téléchargement lancé !</span>
      </Button>
    );
  }

  // Downloading state
  if (isDownloading) {
    return (
      <Button
        variant={variant}
        size={size}
        className={cn("relative", className)}
        disabled
      >
        <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
          <div className="download-btn-progress h-full bg-primary/20 animate-pulse" />
        </div>
        <IconLoader2 className="size-4 mr-2 animate-spin relative z-10" />
        <span className="relative z-10">Préparation...</span>
      </Button>
    );
  }

  // Ready to download - Free user with enough credits
  if (isFree && hasEnoughCredits) {
    return (
      <Button
        variant={variant}
        size={size}
        className={cn("relative group overflow-hidden", "btn-glow", className)}
        onClick={handleDownload}
      >
        {/* Hover effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

        {showIcon && (
          <IconDownload className="size-4 mr-2 relative z-10 group-hover:animate-bounce" />
        )}
        <span className="relative z-10">
          {hasDownloaded ? "Re-télécharger" : "Télécharger"}
        </span>
        {/* Credit cost badge */}
        <span className="ml-2 px-1.5 py-0.5 rounded bg-white/20 text-xs font-medium relative z-10 flex items-center gap-1">
          <IconCoin className="size-3" />
          {creditCost}
        </span>
      </Button>
    );
  }

  // Ready to download - Subscribed user (unlimited)
  return (
    <Button
      variant={variant}
      size={size}
      className={cn("relative group overflow-hidden", "btn-glow", className)}
      onClick={handleDownload}
    >
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

      {showIcon && (
        <IconDownload className="size-4 mr-2 relative z-10 group-hover:animate-bounce" />
      )}
      <span className="relative z-10">
        {hasDownloaded ? "Télécharger à nouveau" : "Télécharger"}
      </span>
    </Button>
  );
}
