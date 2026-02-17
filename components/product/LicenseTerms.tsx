"use client";

import { useState } from "react";
import {
  IconCheck,
  IconX,
  IconChevronDown,
  IconShieldCheck,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface LicenseTermsProps {
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export function LicenseTerms({
  collapsible = false,
  defaultExpanded = true,
}: LicenseTermsProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const allowed = [
    {
      text: "Revendre ce produit à vos clients",
      detail: "Fixez votre propre prix de vente",
    },
    {
      text: "Utiliser comme bonus ou lead magnet",
      detail: "Parfait pour développer votre liste email",
    },
    {
      text: "Modifier et personnaliser le contenu",
      detail: "Adaptez-le à votre marque et audience",
    },
    {
      text: "Intégrer dans vos propres produits",
      detail: "Créez des bundles et offres premium",
    },
  ];

  const notAllowed = [
    {
      text: "Partager l'accès à la bibliothèque PLR",
      detail: "Votre abonnement est personnel et non transférable",
    },
    {
      text: "Revendre les droits PLR eux-mêmes",
      detail: "Seul le produit final peut être revendu",
    },
  ];

  const content = (
    <div className="space-y-5">
      {/* Allowed section */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
          <span className="size-5 rounded-full bg-green-500/10 flex items-center justify-center">
            <IconCheck className="size-3 text-green-600 dark:text-green-400" />
          </span>
          Ce que vous pouvez faire
        </h4>
        <ul className="space-y-2 pl-7">
          {allowed.map((item, index) => (
            <li key={index} className="group">
              <div className="flex items-start gap-2">
                <IconCheck className="size-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-sm text-foreground">{item.text}</span>
                  <p className="text-xs text-muted-foreground mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.detail}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Not allowed section */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
          <span className="size-5 rounded-full bg-red-500/10 flex items-center justify-center">
            <IconX className="size-3 text-red-600 dark:text-red-400" />
          </span>
          Restrictions
        </h4>
        <ul className="space-y-2 pl-7">
          {notAllowed.map((item, index) => (
            <li key={index} className="group">
              <div className="flex items-start gap-2">
                <IconX className="size-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-sm text-muted-foreground">
                    {item.text}
                  </span>
                  <p className="text-xs text-muted-foreground/70 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.detail}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  if (collapsible) {
    return (
      <div className="rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <IconShieldCheck className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Licence PLR</h3>
              <p className="text-xs text-muted-foreground">
                Termes d&apos;utilisation du produit
              </p>
            </div>
          </div>
          <IconChevronDown
            className={cn(
              "size-5 text-muted-foreground transition-transform duration-200",
              isExpanded && "rotate-180",
            )}
          />
        </button>

        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="p-4 pt-0 border-t border-border">{content}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <IconShieldCheck className="size-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Licence PLR</h3>
          <p className="text-xs text-muted-foreground">
            Private Label Rights - Droits de revente
          </p>
        </div>
      </div>
      {content}
    </div>
  );
}

export function LicenseBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
      <IconShieldCheck className="size-3" />
      Licence PLR incluse
    </div>
  );
}
