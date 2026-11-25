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
  ArrowRight,
  Layers,
  Heart,
  Eye,
} from "lucide-react";

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
        alert("You can compare up to 3 templates at once.");
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

  const categoryFilters = [
    { id: "all", label: "All" },
    { id: "ats", label: "ATS-Friendly" },
    { id: "fresher", label: "Fresher & Student" },
    { id: "modern", label: "Modern" },
    { id: "creative", label: "Creative" },
  ];

  const filtered = RESUME_TEMPLATES.filter((tmpl) => {
    const matchesCat =
      selectedCategory === "all" ||
      tmpl.category === selectedCategory;

    const matchesSearch =
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tmpl.recommendedFor && tmpl.recommendedFor.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesSearch;
  });

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

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
        {/* Header */}
        <div className="max-w-2xl space-y-2">
          <h1 className="text-3xl md:text-4xl font-medium tracking-[-0.02em] text-foreground">
            Resume templates
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            20 layouts across ATS-friendly, modern, creative, and student categories. Switch anytime without losing content.
          </p>
        </div>

        {/* Filter, Search & Sort Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {categoryFilters.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs h-8 px-3 rounded-lg font-medium transition-colors duration-150 ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 md:w-60">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates"
                className="w-full h-9 pl-9 pr-3 text-xs rounded-lg border border-input bg-card text-foreground focus:ring-2 focus:ring-ring/20 outline-none"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "popular" | "newest" | "alpha")}
              aria-label="Sort templates"
              className="h-9 text-xs px-3 rounded-lg border border-input bg-card text-foreground focus:ring-2 focus:ring-ring/20 outline-none cursor-pointer"
            >
              <option value="popular">Popular</option>
              <option value="newest">Newest</option>
              <option value="alpha">A–Z</option>
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
                className="group rounded-xl border border-border bg-card overflow-hidden hover:border-foreground/25 transition-colors duration-150 flex flex-col justify-between"
              >
                {/* Thumbnail Area */}
                <div className="p-4 bg-secondary/40 border-b border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {tmpl.categoryLabel}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => toggleCompare(tmpl.id, e)}
                        title={isCompared ? "Remove from comparison" : "Compare"}
                        className={`text-[11px] h-6 px-2 rounded-md border transition-colors duration-150 ${
                          isCompared
                            ? "bg-primary text-primary-foreground border-primary font-medium"
                            : "bg-card text-muted-foreground border-border hover:text-foreground"
                        }`}
                      >
                        {isCompared ? "Compared" : "Compare"}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(tmpl.id, e)}
                        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                        className={`p-1 rounded-md bg-card border border-border transition-colors duration-150 ${
                          isFav ? "text-rose-600 border-rose-300" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-rose-600" : ""}`} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>

                  {/* Miniature Resume Document */}
                  <div
                    onClick={() => setPreviewTemplate(tmpl)}
                    className="cursor-pointer max-w-[200px] mx-auto shadow-[0_1px_3px_rgba(0,0,0,0.08)] rounded-lg overflow-hidden"
                  >
                    <TemplateThumbnail template={tmpl} />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium text-sm text-foreground">
                        {tmpl.name}
                      </h3>
                      {tmpl.atsScore && (
                        <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
                          {tmpl.atsScore}% ATS
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                      {tmpl.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center gap-2">
                    <button
                      onClick={() => setPreviewTemplate(tmpl)}
                      className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg border border-border bg-background hover:bg-secondary text-xs font-medium text-foreground transition-colors duration-150"
                    >
                      <Eye className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => handleApplyTemplate(tmpl.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-95 active:scale-[0.98] transition-[transform,opacity] duration-150"
                    >
                      <span>Use</span>
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Sticky Bottom Comparison Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-xl mx-auto z-40 p-3 rounded-xl bg-card border border-border shadow-[0_8px_24px_rgba(0,0,0,0.12)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-secondary text-foreground flex items-center justify-center font-mono text-xs tabular-nums">
              {compareList.length}
            </span>
            <div>
              <div className="font-medium text-xs text-foreground">Compare templates</div>
              <div className="text-[11px] text-muted-foreground">Select up to 3 layouts</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareList([])}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 transition-colors duration-150"
            >
              Clear
            </button>
            <button
              onClick={() => setCompareModalOpen(true)}
              className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:opacity-95 active:scale-[0.98] transition-[transform,opacity] duration-150 tabular-nums"
            >
              <Layers className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Compare ({compareList.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
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
