"use client";

import React, { useState } from "react";
import { ResumeData } from "@/types/resume";
import { ResumeRenderer } from "../resume-preview/ResumeRenderer";
import { exportResumeToPDF, exportResumeToJSON, printResume } from "@/lib/pdf/exporter";
import { RESUME_TEMPLATES, COLOR_PALETTES, FONT_OPTIONS } from "@/constants/templates";
import {
  Download,
  Printer,
  FileCode,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Share2,
  Palette,
  Type,
  LayoutTemplate,
  Check,
  X,
  FileCheck,
} from "lucide-react";

interface RightPreviewPanelProps {
  resume: ResumeData;
  onChangeStyle: (newStyle: ResumeData["style"]) => void;
}

export const RightPreviewPanel: React.FC<RightPreviewPanelProps> = ({ resume, onChangeStyle }) => {
  const [zoom, setZoom] = useState(0.85);
  const [isExporting, setIsExporting] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const currentTemplate = RESUME_TEMPLATES.find((t) => t.id === resume.style.templateId) || RESUME_TEMPLATES[0];

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      await exportResumeToPDF(resume);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareLink = () => {
    const slug = resume.slug || "rohansharma";
    const url = `${window.location.origin}/u/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <aside
      className={`border-l border-border bg-zinc-100/70 dark:bg-zinc-950/50 flex flex-col transition-all select-none ${
        isFullScreen ? "fixed inset-0 z-50 bg-background" : "w-[480px] lg:w-[580px] xl:w-[680px] 2xl:w-[760px] h-full"
      }`}
    >
      {/* Top Toolbar */}
      <div className="h-14 border-b border-border bg-card/90 backdrop-blur px-3 sm:px-4 flex items-center justify-between gap-2 flex-shrink-0">
        {/* Template Selector Trigger */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTemplateModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-secondary/50 text-xs font-semibold hover:bg-secondary text-foreground"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-primary" />
            <span className="truncate max-w-[120px]">{currentTemplate.name}</span>
          </button>

          {/* Color quick picker dropdown */}
          <div className="flex items-center gap-1">
            {COLOR_PALETTES.slice(0, 5).map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => onChangeStyle({ ...resume.style, accentColor: color.value })}
                title={color.name}
                className={`w-4 h-4 rounded-full transition-transform ${
                  resume.style.accentColor === color.value ? "scale-125 ring-2 ring-primary ring-offset-1" : "hover:scale-110"
                }`}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
        </div>

        {/* Zoom & Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
            title="Zoom Out"
            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-muted-foreground w-10 text-center tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.5, Number((z + 0.1).toFixed(2))))}
            title="Zoom In"
            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Print */}
          <button
            type="button"
            onClick={printResume}
            title="Print Resume"
            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Share Public Link */}
          <button
            type="button"
            onClick={handleShareLink}
            title="Copy Public URL"
            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Full-screen */}
          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            title="Full Screen Preview"
            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Primary Download Button */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-95 active:scale-[0.98] transition-[transform,opacity] duration-150 ml-1"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>{isExporting ? "Rendering..." : "PDF"}</span>
          </button>
        </div>
      </div>

      {/* Live Canvas Area with Scroll & Scale */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center">
        <ResumeRenderer resume={resume} scale={zoom} />
      </div>

      {/* 20 Template Selection Modal */}
      {templateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card text-card-foreground w-full max-w-4xl rounded-2xl border border-border shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Select From 20+ Original Templates</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Switch designs seamlessly anytime. All your content is instantly preserved.</p>
              </div>
              <button onClick={() => setTemplateModalOpen(false)} className="p-1 text-muted-foreground hover:bg-secondary rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {RESUME_TEMPLATES.map((tmpl) => {
                const isSelected = resume.style.templateId === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => {
                      onChangeStyle({ ...resume.style, templateId: tmpl.id });
                      setTemplateModalOpen(false);
                    }}
                    className={`cursor-pointer group rounded-xl border p-3 flex flex-col justify-between transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary"
                        : "border-border hover:border-primary/50 bg-secondary/20"
                    }`}
                  >
                    <div>
                      <div className={`h-28 rounded-lg ${tmpl.thumbnail} mb-2 flex items-center justify-center border shadow-xs relative overflow-hidden`}>
                        <FileCheck className="w-8 h-8 opacity-40 group-hover:scale-110 transition-transform" />
                        {tmpl.badge && (
                          <span className="absolute top-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary text-primary-foreground">
                            {tmpl.badge}
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-xs text-foreground flex items-center justify-between">
                        <span>{tmpl.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                      </div>
                      <div className="text-[10px] text-primary/80 font-semibold">{tmpl.categoryLabel}</div>
                      <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-tight">
                        {tmpl.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
