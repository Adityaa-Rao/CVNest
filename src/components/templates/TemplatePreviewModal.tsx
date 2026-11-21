"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TemplateMetadata, ResumeData } from "@/types/resume";
import { ResumeRenderer } from "@/components/resume-preview/ResumeRenderer";
import { SAMPLE_FRESHER_RESUME, SAMPLE_EXPERIENCED_RESUME } from "@/constants/sample-resumes";
import { COLOR_PALETTES, FONT_OPTIONS } from "@/constants/templates";
import { getStoredResumes, saveResume } from "@/lib/storage";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Palette,
  Type,
  Layout,
  Maximize2,
} from "lucide-react";

interface TemplatePreviewModalProps {
  template: TemplateMetadata;
  allTemplates: TemplateMetadata[];
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  allTemplates,
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const router = useRouter();
  if (!isOpen) return null;

  const currentIndex = allTemplates.findIndex((t) => t.id === template.id);
  const [zoom, setZoom] = useState(0.85);
  const [selectedColor, setSelectedColor] = useState("#4f46e5");
  const [selectedFont, setSelectedFont] = useState<any>("inter");
  const [selectedSpacing, setSelectedSpacing] = useState<any>("normal");
  const [previewSample, setPreviewSample] = useState<"fresher" | "experienced">(
    template.category === "fresher" ? "fresher" : "experienced"
  );

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + allTemplates.length) % allTemplates.length;
    onSelectTemplate(allTemplates[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % allTemplates.length;
    onSelectTemplate(allTemplates[nextIdx].id);
  };

  // Base sample data configured with current live customizations
  const baseSample = previewSample === "fresher" ? SAMPLE_FRESHER_RESUME : SAMPLE_EXPERIENCED_RESUME;
  const configuredResume: ResumeData = {
    ...baseSample,
    style: {
      ...baseSample.style,
      templateId: template.id,
      accentColor: selectedColor,
      fontFamily: selectedFont,
      spacing: selectedSpacing,
    },
  };

  const handleChooseTemplate = () => {
    const resumes = getStoredResumes();
    if (resumes.length > 0) {
      const active = resumes[0];
      const updated: ResumeData = {
        ...active,
        style: {
          ...active.style,
          templateId: template.id,
          accentColor: selectedColor,
          fontFamily: selectedFont,
          spacing: selectedSpacing,
        },
      };
      saveResume(updated);
      router.push(`/builder?id=${updated.id}`);
    } else {
      router.push(`/builder?template=${template.id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-card text-card-foreground w-full max-w-6xl h-[92vh] rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {template.categoryLabel}
            </span>
            <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
              {template.name}
              {template.atsScore && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  {template.atsScore}% ATS Score
                </span>
              )}
            </h2>
          </div>

          {/* Navigation & Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              title="Previous Template"
              className="p-1.5 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-muted-foreground">
              {currentIndex + 1} / {allTemplates.length}
            </span>
            <button
              onClick={handleNext}
              title="Next Template"
              className="p-1.5 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-border mx-1" />

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2-Column Body: Customization Panel on Left, Scaled Preview on Right */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Controls & Insights (4 cols) */}
          <div className="lg:col-span-4 border-r border-border p-6 overflow-y-auto space-y-6 bg-secondary/10">
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Template Description
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{template.description}</p>
            </div>

            {/* Layout characteristics */}
            <div className="p-3.5 rounded-xl border border-border bg-card space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Layout Type:</span>
                <span className="font-semibold text-foreground">{template.layoutType || "Single Column"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ATS Compatibility:</span>
                <span className="font-semibold text-emerald-600">{template.atsScore || 96}% (Verified)</span>
              </div>
              {template.recommendedFor && (
                <div className="pt-1 border-t border-border/60">
                  <span className="text-muted-foreground block text-[11px] mb-0.5">Best Suited For:</span>
                  <span className="font-medium text-foreground">{template.recommendedFor}</span>
                </div>
              )}
            </div>

            {/* In-Preview Customization: Accent Colors */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-foreground">Accent Color</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PALETTES.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    title={color.name}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      selectedColor === color.value ? "scale-125 ring-2 ring-primary ring-offset-2" : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>

            {/* In-Preview Customization: Font Family */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-foreground">Font Family</label>
              <div className="grid grid-cols-2 gap-1.5">
                {FONT_OPTIONS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setSelectedFont(font.id)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border text-left truncate transition-all ${
                      selectedFont === font.id
                        ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
                        : "border-border text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {font.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Sample Data Switcher */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <label className="block text-xs font-bold text-foreground">Preview Sample</label>
              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => setPreviewSample("fresher")}
                  className={`flex-1 py-1.5 rounded-lg border font-medium ${
                    previewSample === "fresher" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"
                  }`}
                >
                  🎓 Fresher / Student
                </button>
                <button
                  onClick={() => setPreviewSample("experienced")}
                  className={`flex-1 py-1.5 rounded-lg border font-medium ${
                    previewSample === "experienced" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"
                  }`}
                >
                  💼 Experienced
                </button>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-4">
              <button
                onClick={handleChooseTemplate}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-95 shadow-md active:scale-98 transition-all"
              >
                <span>Choose This Template & Edit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Live Preview Canvas (8 cols) */}
          <div className="lg:col-span-8 bg-zinc-100 dark:bg-zinc-950 flex flex-col overflow-hidden relative">
            {/* Zoom toolbar */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-card/90 backdrop-blur border border-border p-1 rounded-xl shadow-md text-xs">
              <button
                onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
                className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] px-1">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(1.4, Number((z + 0.1).toFixed(2))))}
                className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 md:p-10 flex items-start justify-center">
              <ResumeRenderer resume={configuredResume} scale={zoom} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
