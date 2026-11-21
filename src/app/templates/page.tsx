"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RESUME_TEMPLATES } from "@/constants/templates";
import { TemplateMetadata } from "@/types/resume";
import { TemplateThumbnail } from "@/components/templates/TemplateThumbnail";
import { TemplatePreviewModal } from "@/components/templates/TemplatePreviewModal";
import { TemplateComparisonModal } from "@/components/templates/TemplateComparisonModal";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getStoredResumes, saveResume, getUserPreferences, saveUserPreferences } from "@/lib/storage";
import {
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Layers,
  Heart,
  Eye,
  ArrowUpDown,
  Check,
  X,
} from "lucide-react";
import Link from "next/link";

export default function TemplatesGalleryPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "alpha">("popular");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateMetadata | null>(null);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  useEffect(() => {
    const prefs = getUserPreferences();
    setFavorites(prefs.favoriteTemplates || ["classic-ats", "btech-fresher"]);
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter((f) => f !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    saveUserPreferences({ ...getUserPreferences(), favoriteTemplates: updated });
  };

  const toggleCompare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (compareList.includes(id)) {
      setCompareList(compareList.filter((item) => item !== id));
    } else {
      if (compareList.length >= 3) {
        alert("You can compare up to 3 templates simultaneously.");
        return;
      }
      setCompareList([...compareList, id]);
    }
  };

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

  // Filter Categories
  const categoryFilters = [
    { id: "all", label: "All Templates" },
    { id: "ats", label: "ATS-Friendly" },
    { id: "fresher", label: "Fresher & Student" },
    { id: "modern", label: "Modern" },
    { id: "creative", label: "Creative" },
  ];

  // Filtering Logic
  const filtered = RESUME_TEMPLATES.filter((tmpl) => {
    const matchesCat =
      selectedCategory === "all" ||
      tmpl.category === selectedCategory ||
      (selectedCategory === "fresher" && tmpl.category === "fresher") ||
      (selectedCategory === "ats" && tmpl.category === "ats");

    const matchesSearch =
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tmpl.recommendedFor && tmpl.recommendedFor.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesSearch;
  });

  // Sorting Logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "popular") {
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    }
    if (sortBy === "newest") {
      return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    }
    return a.name.localeCompare(b.name);
  });

  const selectedForComparison = RESUME_TEMPLATES.filter((t) => compareList.includes(t.id));

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>20 Genuine Architectural Resume Templates</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Original Templates Engineered for Every Career Milestone
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm leading-relaxed max-w-2xl mx-auto">
            From single-column ATS layouts verified for Workday & Taleo to specialized Indian BTech engineering formats and creative portfolio layouts.
          </p>
        </div>

        {/* Filter, Search & Sort Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border pb-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categoryFilters.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, role, tech..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-card text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs px-3 py-2 rounded-xl border border-input bg-card text-foreground focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="alpha">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sorted.map((tmpl) => {
            const isFav = favorites.includes(tmpl.id);
            const isCompared = compareList.includes(tmpl.id);

            return (
              <div
                key={tmpl.id}
                className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all flex flex-col justify-between"
              >
                {/* Visual Thumbnail Container */}
                <div className="p-4 bg-secondary/30 border-b border-border relative">
                  {/* Top Badges & Actions */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-background/90 text-foreground border shadow-xs">
                      {tmpl.categoryLabel}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Compare Checkbox */}
                      <button
                        type="button"
                        onClick={(e) => toggleCompare(tmpl.id, e)}
                        title={isCompared ? "Remove from comparison" : "Add to side-by-side comparison"}
                        className={`text-[10px] px-2 py-0.5 rounded border transition-all ${
                          isCompared
                            ? "bg-primary text-primary-foreground border-primary font-bold"
                            : "bg-background text-muted-foreground hover:border-primary"
                        }`}
                      >
                        {isCompared ? "✓ Compared" : "+ Compare"}
                      </button>

                      {/* Favorite Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(tmpl.id, e)}
                        className={`p-1.5 rounded-full bg-background border transition-colors ${
                          isFav ? "text-rose-500 fill-rose-500 border-rose-300" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-rose-500" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Realistic Miniature Document Thumbnail */}
                  <div
                    onClick={() => setPreviewTemplate(tmpl)}
                    className="cursor-pointer max-w-[210px] mx-auto shadow-md rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-200"
                  >
                    <TemplateThumbnail template={tmpl} />
                  </div>
                </div>

                {/* Card Content & Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                        {tmpl.name}
                      </h3>
                      {tmpl.atsScore && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          {tmpl.atsScore}% ATS
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                      {tmpl.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-border flex items-center gap-2">
                    <button
                      onClick={() => setPreviewTemplate(tmpl)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border bg-background hover:bg-secondary text-xs font-semibold text-foreground transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => handleApplyTemplate(tmpl.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 shadow-sm active:scale-98 transition-all"
                    >
                      <span>Use</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Sticky Bottom Comparison Drawer (if templates are selected) */}
      {compareList.length > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-2xl mx-auto z-40 p-3.5 rounded-2xl bg-card border border-primary/40 shadow-2xl backdrop-blur-md flex items-center justify-between gap-4 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              {compareList.length}
            </span>
            <div>
              <div className="font-bold text-xs text-foreground">Compare Templates</div>
              <div className="text-[11px] text-muted-foreground">Up to 3 templates side-by-side</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareList([])}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
            >
              Clear
            </button>
            <button
              onClick={() => setCompareModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-95 shadow-md active:scale-98"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Compare Selected ({compareList.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Interactive Full Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          allTemplates={RESUME_TEMPLATES}
          isOpen={Boolean(previewTemplate)}
          onClose={() => setPreviewTemplate(null)}
          onSelectTemplate={(id) => {
            const found = RESUME_TEMPLATES.find((t) => t.id === id);
            if (found) setPreviewTemplate(found);
          }}
        />
      )}

      {/* Side-by-Side Comparison Modal */}
      {compareModalOpen && (
        <TemplateComparisonModal
          selectedTemplates={selectedForComparison}
          isOpen={compareModalOpen}
          onClose={() => setCompareModalOpen(false)}
          onRemoveTemplate={(id) => setCompareList(compareList.filter((i) => i !== id))}
        />
      )}

      <Footer />
    </div>
  );
}
