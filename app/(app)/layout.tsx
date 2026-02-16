// app/(app)/layout.tsx
"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { IconAlertTriangle } from "@tabler/icons-react";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const user = useQuery(api.users.getCurrentUser);
  const hasOnboarded = useQuery(api.onboarding.hasCompletedOnboarding);
  const router = useRouter();
  const pathname = usePathname();

  const isLoading =
    authLoading || user === undefined || hasOnboarded === undefined;

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // Rediriger les admins vers /admin
    if (user?.role === "admin" && !pathname.startsWith("/admin")) {
      router.replace("/admin");
      return;
    }

    // Pas onboarded → onboarding (sauf si verrouillé)
    if (
      !user?.isLocked &&
      hasOnboarded === false &&
      pathname !== "/onboarding"
    ) {
      router.replace("/onboarding");
      return;
    }

    if (hasOnboarded === true && pathname === "/onboarding") {
      router.replace("/dashboard");
      return;
    }
  }, [isAuthenticated, isLoading, user, hasOnboarded, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (user?.role === "admin" && !pathname.startsWith("/admin")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "3.5rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <SiteHeader />

        {/* Banner compte verrouillé */}
        {user?.isLocked && (
          <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-3 shrink-0">
            <div className="flex items-center gap-3">
              <IconAlertTriangle className="h-5 w-5 text-destructive shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-destructive text-sm">
                  Votre compte est temporairement suspendu
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.lockReason ||
                    "Contactez le support pour plus d'informations."}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild className="shrink-0">
                <Link href="/help">Support</Link>
              </Button>
            </div>
          </div>
        )}

        <main className="@container/main flex-1 overflow-auto">{children}</main>
      </SidebarInset>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}
