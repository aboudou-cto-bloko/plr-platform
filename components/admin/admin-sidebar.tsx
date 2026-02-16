"use client";

import * as React from "react";
import {
  IconChartBar,
  IconPackage,
  IconUsers,
  IconCreditCard,
  IconArrowLeft,
  IconUpload,
  IconAlertTriangle,
  IconHistory,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/admin/admin-nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";

const navMain = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: IconChartBar,
  },
  {
    title: "Produits",
    url: "/admin/products",
    icon: IconPackage,
  },
  {
    title: "Upload",
    url: "/admin/upload",
    icon: IconUpload,
  },
  {
    title: "Utilisateurs",
    url: "/admin/users",
    icon: IconUsers,
  },
  {
    title: "Paiements",
    url: "/admin/payments",
    icon: IconCreditCard,
  },
  {
    title: "Alertes",
    url: "/admin/alerts",
    icon: IconAlertTriangle,
  },
  {
    title: "Logs",
    url: "/admin/logs",
    icon: IconHistory,
  },
];

const navSecondary = [
  {
    title: "Retour au site",
    url: "/dashboard",
    icon: IconArrowLeft,
  },
];

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent>
        <NavMain items={navMain} currentPath={pathname} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
