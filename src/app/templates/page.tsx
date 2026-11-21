"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RESUME_TEMPLATES } from "@/constants/templates";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getStoredResumes, saveResume } from "@/lib/storage";
import {
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Layers,
  Palette,
} from "lucide-react";
import Link from "next/link";

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "All Templates (20)" },
    { id: "ats", label: "ATS-Friendly (5)" },
    { id: "modern", label: "Modern & Clean (5)" },
    { id: "creative", label: "Creative & Design (5)" },
    { id: "fresher", label: "Student & Fresher (5)" },
  ];

  const filteredTemplates = RESUME_TEMPLATES.filter((tmpl) => {
    const matchesCat = selectedCategory === "all" || tmpl.category === selectedCategory;
    const matchesSearch =
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleApplyTemplate = (templateId: string) => {
    const resumes = getStoredResumes();
    if (resumes.length > 0) {
      const active = resumes[0];
      const updated = {
        ...active,
        style: {
          ...active.style,
          templateId,
        },
      };
      saveResume(updated);
      router.push(`/builder?id=${updated.id}`);
    } else {
      router.push(`/builder?template=${templateId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>20+ Production-Ready Resume Templates</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Original Templates Designed for Every Career Stage
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            From single-column ATS layouts verified for Workday & Taleo to specialized BTech fresher formats and creative developer layouts. Switch templates anytime with zero data loss.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3.5 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-input bg-card focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        {/* Template Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              {/* Card visual preview */}
              <div className="p-4 bg-secondary/30 border-b border-border">
                <div
                  className={`h-48 rounded-xl ${tmpl.thumbnail} border shadow-inner flex flex-col justify-between p-3 relative group-hover:scale-[1.02] transition-transform`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-background/90 text-foreground border shadow-xs">
                      {tmpl.categoryLabel}
                    </span>
                    {tmpl.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary text-primary-foreground shadow">
                        {tmpl.badge}
                      </span>
                    )}
                  </div>

                  {/* Wireframe lines simulation */}
                  <div className="space-y-1.5 opacity-40">
                    <div className="h-2.5 w-2/3 bg-current rounded" />
                    <div className="h-1.5 w-full bg-current rounded" />
                    <div className="h-1.5 w-4/5 bg-current rounded" />
                    <div className="h-1.5 w-3/4 bg-current rounded" />
                  </div>
                </div>
              </div>

              {/* Card info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-2">
                  <Link
                    href={`/templates/${tmpl.id}`}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() => handleApplyTemplate(tmpl.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 active:scale-95 transition-all"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
