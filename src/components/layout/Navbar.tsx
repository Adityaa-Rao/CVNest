"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Sparkles,
  CheckCircle2,
  Briefcase,
  Compass,
  CreditCard,
  Moon,
  Sun,
  Menu,
  X,
  GraduationCap,
  LayoutDashboard,
  Plus,
} from "lucide-react";
import { getUserPreferences, saveUserPreferences } from "@/lib/storage";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const prefs = getUserPreferences();
    if (
      prefs.theme === "dark" ||
      (prefs.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      saveUserPreferences({ ...getUserPreferences(), theme: "dark" });
    } else {
      document.documentElement.classList.remove("dark");
      saveUserPreferences({ ...getUserPreferences(), theme: "light" });
    }
  };

  const navLinks = [
    { href: "/templates", label: "Templates", icon: Compass },
    { href: "/builder", label: "Builder", icon: FileText },
    { href: "/ats-checker", label: "ATS Checker", icon: CheckCircle2 },
    { href: "/job-matcher", label: "Job Matcher", icon: Briefcase },
    { href: "/cover-letter", label: "Cover Letter", icon: Sparkles },
    { href: "/pricing", label: "Pricing", icon: CreditCard },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm transition-colors duration-150">
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Flat Editorial Logo + Compact Fresher Mode */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
            <div className="w-7 h-7 rounded-md bg-foreground text-background flex items-center justify-center">
              <FileText className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <span className="font-semibold text-base tracking-tight text-foreground">
              CVNest
            </span>
          </Link>

          <Link
            href="/builder?mode=fresher"
            className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-secondary text-foreground hover:bg-secondary/80 border border-border transition-colors duration-150"
            title="Dedicated mode for BTech students and freshers"
          >
            <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
            <span>Fresher Mode</span>
          </Link>
        </div>

        {/* Desktop Single-Line Navigation */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/builder"
                ? pathname === "/builder"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors duration-150 ${
                  isActive
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  strokeWidth={1.5}
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150"
          >
            {isDark ? (
              <Sun className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <Moon className="w-4 h-4" strokeWidth={1.5} />
            )}
          </button>

          <Link
            href="/builder"
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-95 active:scale-[0.98] transition-[transform,opacity] duration-150 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            <span>Create Resume</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors duration-150"
          >
            {isDark ? (
              <Sun className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <Moon className="w-4 h-4" strokeWidth={1.5} />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-lg text-foreground hover:bg-secondary transition-colors duration-150"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" strokeWidth={1.5} />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-background px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 h-9 px-3 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 mt-2 border-t border-border flex flex-col gap-2">
            <Link
              href="/builder?mode=fresher"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 h-9 rounded-lg bg-secondary text-foreground font-medium text-sm border border-border transition-colors duration-150"
            >
              <GraduationCap className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              <span>Fresher Mode</span>
            </Link>
            <Link
              href="/builder"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 h-9 rounded-lg bg-primary text-primary-foreground font-medium text-sm"
            >
              <Plus className="w-4 h-4" strokeWidth={1.5} />
              <span>Create Resume</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
