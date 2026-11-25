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
  ArrowRight,
  ZoomIn,
  ZoomOut,
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
  const currentIndex = allTemplates.findIndex((t) => t.id === template.id);
  const [zoom, setZoom] = useState(0.85);
  const [selectedColor, setSelectedColor] = useState("#155eef");
  const [selectedFont, setSelectedFont] = useState<any>("inter");
  const [previewSample, setPreviewSample] = useState<"fresher" | "experienced">(
    template.category === "fresher" ? "fresher" : "experienced"
  );

  if (!isOpen) return null;

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + allTemplates.length) % allTemplates.length;
    onSelectTemplate(allTemplates[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % allTemplates.length;
    onSelectTemplate(allTemplates[nextIdx].id);
  };

  const baseSample = previewSample === "fresher" ? SAMPLE_FRESHER_RESUME : SAMPLE_EXPERIENCED_RESUME;
  const configuredResume: ResumeData = {
    ...baseSample,
    style: {
      ...baseSample.style,
      templateId: template.id,
      accentColor: selectedColor,
      fontFamily: selectedFont,
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
        },
      };
      saveResume(updated);
      router.push(`/builder?id=${updated.id}`);
    } else {
      router.push(`/builder?template=${template.id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-card text-card-foreground w-full max-w-6xl h-[92vh] rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-3.5 border-b border-border flex items-center justify-between bg-card flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">
              {template.categoryLabel}
            </span>
            <h2 className="font-medium text-base text-foreground flex items-center gap-2">
              {template.name}
              {template.atsScore && (
                <span className="text-xs font-mono text-muted-foreground tabular-nums">
                  {template.atsScore}% ATS
                </span>
              )}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              title="Previous template"
              className="p-1.5 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <span className="text-xs font-mono text-muted-foreground tabular-nums">
              {currentIndex + 1} / {allTemplates.length}
            </span>
            <button
              onClick={handleNext}
              title="Next template"
              className="p-1.5 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </button>

            <div className="h-4 w-px bg-border mx-1" />

            <button
              onClick={onClose}
              aria-label="Close preview"
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors duration-150"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* 2-Column Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Controls & Details (4 cols) */}
          <div className="lg:col-span-4 border-r border-border p-6 overflow-y-auto space-y-6 bg-background">
            <div className="space-y-1.5">
              <h4 className="font-medium text-xs text-muted-foreground">Description</h4>
              <p className="text-xs text-foreground leading-relaxed">{template.description}</p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-card space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Layout</span>
                <span className="font-medium text-foreground">{template.layoutType || "Single Column"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ATS score</span>
                <span className="font-mono text-foreground tabular-nums">{template.atsScore || 96}%</span>
              </div>
              {template.recommendedFor && (
                <div className="pt-2 border-t border-border space-y-0.5">
                  <span className="text-muted-foreground block text-[11px]">Suited for</span>
                  <span className="font-medium text-foreground">{template.recommendedFor}</span>
                </div>
              )}
            </div>

            {/* Accent Colors */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-foreground">Accent color</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PALETTES.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    title={color.name}
                    className={`w-6 h-6 rounded-full transition-transform duration-150 ${
                      selectedColor === color.value ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-foreground">Font family</label>
              <div className="grid grid-cols-2 gap-1.5">
                {FONT_OPTIONS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setSelectedFont(font.id)}
                    className={`text-xs h-8 px-2.5 rounded-lg border text-left truncate transition-colors duration-150 ${
                      selectedFont === font.id
                        ? "bg-primary text-primary-foreground border-primary font-medium"
                        : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {font.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Sample Data Switcher */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="block text-xs font-medium text-foreground">Sample data</label>
              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => setPreviewSample("fresher")}
                  className={`flex-1 h-8 rounded-lg border font-medium transition-colors duration-150 ${
                    previewSample === "fresher"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Fresher
                </button>
                <button
                  onClick={() => setPreviewSample("experienced")}
                  className={`flex-1 h-8 rounded-lg border font-medium transition-colors duration-150 ${
                    previewSample === "experienced"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Experienced
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleChooseTemplate}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:opacity-95 active:scale-[0.98] transition-[transform,opacity] duration-150"
              >
                <span>Choose this template</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Right Live Preview Canvas */}
          <div className="lg:col-span-8 bg-secondary/40 flex flex-col overflow-hidden relative">
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-card border border-border p-1 rounded-lg shadow-sm text-xs">
              <button
                onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
                className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                <ZoomOut className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
              <span className="font-mono text-[11px] px-1 tabular-nums">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(1.4, Number((z + 0.1).toFixed(2))))}
                className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                <ZoomIn className="w-3.5 h-3.5" strokeWidth={1.5} />
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
