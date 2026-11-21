"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getUserPreferences, saveUserPreferences, getStoredResumes } from "@/lib/storage";
import { User, Shield, Moon, Sun, Download, Trash2, Check, Globe } from "lucide-react";

export default function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [paperSize, setPaperSize] = useState<"a4" | "letter">("a4");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const prefs = getUserPreferences();
    setTheme(prefs.theme || "light");
    setPaperSize(prefs.defaultPaperSize || "a4");
  }, []);

  const handleSavePreferences = () => {
    const prefs = getUserPreferences();
    saveUserPreferences({
      ...prefs,
      theme,
      defaultPaperSize: paperSize,
    });

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportAllData = () => {
    const data = {
      resumes: getStoredResumes(),
      preferences: getUserPreferences(),
      exportedAt: new Date().toISOString(),
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const dl = document.createElement("a");
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `cvnest_backup_${Date.now()}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };

  const handleClearData = () => {
    if (confirm("Are you sure? This will reset all local resume drafts and restore sample templates.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Account & Studio Settings</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Manage your editor preferences, theme, default export paper size, and data privacy.
          </p>
        </div>

        {/* Studio Preferences */}
        <section className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm">
          <h3 className="font-bold text-sm text-foreground">Editor & Export Defaults</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Theme Preference</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-semibold ${
                    theme === "light" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" /> Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-semibold ${
                    theme === "dark" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" /> Dark
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Default Paper Size</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaperSize("a4")}
                  className={`flex-1 py-2 rounded-xl border text-xs font-semibold ${
                    paperSize === "a4" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  A4 (International)
                </button>
                <button
                  type="button"
                  onClick={() => setPaperSize("letter")}
                  className={`flex-1 py-2 rounded-xl border text-xs font-semibold ${
                    paperSize === "letter" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  US Letter (USA / Canada)
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSavePreferences}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 shadow-sm"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : null}
              <span>{savedSuccess ? "Saved!" : "Save Preferences"}</span>
            </button>
          </div>
        </section>

        {/* Data Privacy & Export */}
        <section className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
          <div>
            <h3 className="font-bold text-sm text-foreground">Data Privacy & Portability</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              You own 100% of your career data. Export your full profile or wipe local storage anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleExportAllData}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground"
            >
              <Download className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Download All Resume Data (JSON)</span>
            </button>

            <button
              onClick={handleClearData}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-destructive/20 text-destructive hover:bg-destructive/10 text-xs font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Local Storage / Reset</span>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
