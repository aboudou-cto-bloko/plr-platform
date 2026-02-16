"use client";

import * as React from "react";
import {
  IconBook,
  IconDashboard,
  IconDownload,
  IconHelp,
  IconSettings,
  IconSparkles,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavMain } from "@/components/dashboard/nav-main";

import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Bibliothèque",
    url: "/library",
    icon: IconBook,
  },
  {
    title: "Nouveautés",
    url: "/library?filter=new",
    icon: IconSparkles,
  },
  {
    title: "Téléchargements",
    url: "/downloads",
    icon: IconDownload,
  },
];

const navSecondary = [
  {
    title: "Paramètres",
    url: "/settings",
    icon: IconSettings,
  },
  {
    title: "Aide",
    url: "/help",
    icon: IconHelp,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                  <span className="text-[10px] font-bold text-primary-foreground">
                    PLR
                  </span>
                </div>
                <span className="text-base font-semibold">Library</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

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
