"use client";

import * as React from "react";
import { Menu, Shield } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/shared/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { cn } from "@/shared/lib/utils";
import Image from "next/image";
import { ThemeToggle } from "@/features/theme-toggle";

const Header = () => {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Privacy", href: "#privacy" },
    { name: "Open Source", href: "#opensource" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-3 shadow-sm"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg">
              <Image src="/logo.png" alt="Logo" width={35} height={35} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-slate-100">
              GutVault
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.name}>
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                      )}
                    >
                      <a href={link.href}>{link.name}</a>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
                <ThemeToggle />
              </NavigationMenuList>
            </NavigationMenu>
            <Button size="sm">Get Started</Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-600 dark:text-slate-400"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader className="text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="bg-slate-900 dark:bg-slate-700 p-1.5 rounded-lg">
                      <Shield className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-slate-100">
                      GutVault
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="text-base font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                  <Button className="w-full">Get Started</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
