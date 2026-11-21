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
  ChevronRight,
} from "lucide-react";
import { getUserPreferences, saveUserPreferences } from "@/lib/storage";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const prefs = getUserPreferences();
    if (prefs.theme === "dark" || (prefs.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
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
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-foreground flex items-center gap-1.5">
              CVNest
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-500/20">
                AI SaaS
              </span>
            </span>
            <span className="text-[10px] text-muted-foreground -mt-1 hidden sm:inline">
              Build Your Future
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-secondary text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <Icon className="w-4 h-4 opacity-75" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Fresher Mode Badge Shortcut */}
          <Link
            href="/builder?mode=fresher"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
            title="Dedicated mode for BTech students & freshers"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Fresher Mode</span>
          </Link>

          {/* Dark / Light Mode Switch */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
          </button>

          <Link
            href="/dashboard"
            className="text-sm font-medium text-foreground hover:text-primary px-3 py-1.5 transition-colors"
          >
            Dashboard
          </Link>

          <Link
            href="/builder"
            className="flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground shadow-sm hover:opacity-95 active:scale-[0.98] transition-all"
          >
            <span>Create Resume</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-muted-foreground hover:bg-secondary"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-foreground hover:bg-secondary"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? "bg-secondary text-primary font-bold" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <Link
              href="/builder?mode=fresher"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2 rounded-lg bg-cyan-500/10 text-cyan-600 font-semibold text-sm border border-cyan-500/20"
            >
              <GraduationCap className="w-4 h-4" /> Fresher Mode (Students)
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center py-2 rounded-lg bg-secondary text-foreground font-semibold text-sm"
            >
              My Dashboard
            </Link>
            <Link
              href="/builder"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm"
            >
              Build Resume Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
