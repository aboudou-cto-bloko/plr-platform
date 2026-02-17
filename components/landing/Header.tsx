"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Fonctionnalités", href: "#features" },
  { name: "Tarif", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export function Header() {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className={cn(
          "fixed top-0 left-0 z-20 w-full transition-all duration-300",
          isScrolled
            ? "bg-black/80 border-b border-white/10 backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0">
            <div className="flex w-full justify-between gap-6 lg:w-auto">
              {/* Logo - always white */}
              <Link
                href="/"
                aria-label="PLR Library"
                className="flex items-center space-x-2"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white transition-transform duration-300 hover:scale-105">
                  <span className="text-sm font-bold text-black">PLR</span>
                </div>
                <span className="text-lg font-semibold text-white">
                  Library
                </span>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Fermer le menu" : "Ouvrir le menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu
                  className={cn(
                    "m-auto size-6 text-white duration-200",
                    menuState && "rotate-180 scale-0 opacity-0",
                  )}
                />
                <X
                  className={cn(
                    "absolute inset-0 m-auto size-6 text-white -rotate-180 scale-0 opacity-0 duration-200",
                    menuState && "rotate-0 scale-100 opacity-100",
                  )}
                />
              </button>

              {/* Desktop menu - always white */}
              <div className="m-auto hidden size-fit lg:block">
                <ul className="flex gap-1">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-white/80 hover:text-white hover:bg-white/10"
                      >
                        <Link href={item.href}>
                          <span>{item.name}</span>
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mobile menu + CTA buttons */}
            <div
              className={cn(
                "mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none",
                // Mobile menu styling - dark bg for consistency
                "bg-black/95 border-white/10 shadow-black/50 backdrop-blur-xl",
                menuState && "block lg:flex",
              )}
            >
              {/* Mobile menu items */}
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuState(false)}
                        className="text-white/70 hover:text-white block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA buttons - always visible */}
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                {/* Connexion */}
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  <Link href="/login">
                    <span>Connexion</span>
                  </Link>
                </Button>

                {/* Primary CTA */}
                <Button
                  asChild
                  size="sm"
                  className={cn(
                    "transition-all duration-300",
                    isScrolled
                      ? "shadow-lg shadow-primary/30"
                      : "shadow-lg shadow-primary/25",
                  )}
                >
                  <Link href="/signup">
                    <span>Commencer</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
