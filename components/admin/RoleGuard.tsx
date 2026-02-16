"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleGuardProps {
  children: React.ReactNode;
}

export function RoleGuard({ children }: RoleGuardProps) {
  const isAdmin = useQuery(api.admin.isAdmin);
  const router = useRouter();

  useEffect(() => {
    if (isAdmin === false) {
      router.push("/dashboard");
    }
  }, [isAdmin, router]);

  if (isAdmin === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (isAdmin === false) {
    return null;
  }

  return <>{children}</>;
}
