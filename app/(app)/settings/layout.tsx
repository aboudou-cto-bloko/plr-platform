"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconCreditCard, IconUser } from "@tabler/icons-react";

const settingsNav = [
  {
    title: "Compte",
    href: "/settings",
    icon: IconUser,
  },
  {
    title: "Abonnement",
    href: "/settings/billing",
    icon: IconCreditCard,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6">
        <h2 className="text-2xl font-semibold">Paramètres</h2>
        <p className="text-muted-foreground">
          Gérez votre compte et votre abonnement
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="px-4 lg:px-6">
        <nav className="flex gap-2 border-b">
          {settingsNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
