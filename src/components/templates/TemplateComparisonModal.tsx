"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { TemplateMetadata, ResumeData } from "@/types/resume";
import { TemplateThumbnail } from "./TemplateThumbnail";
import { getStoredResumes, saveResume } from "@/lib/storage";
import { X, Check, ArrowRight, ShieldCheck, Layers, Sparkles } from "lucide-react";

interface TemplateComparisonModalProps {
  selectedTemplates: TemplateMetadata[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveTemplate: (templateId: string) => void;
}

export const TemplateComparisonModal: React.FC<TemplateComparisonModalProps> = ({
  selectedTemplates,
  isOpen,
  onClose,
  onRemoveTemplate,
}) => {
  const router = useRouter();
  if (!isOpen || selectedTemplates.length === 0) return null;

  const handleSelect = (templateId: string) => {
    const resumes = getStoredResumes();
    if (resumes.length > 0) {
      const active = resumes[0];
      const updated: ResumeData = {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-card text-card-foreground w-full max-w-5xl rounded-3xl border border-border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" /> Side-by-Side Template Comparison
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground mt-1">
              Comparing {selectedTemplates.length} of 3 Selected Templates
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Columns Grid */}
        <div className="p-6 overflow-y-auto">
          <div className={`grid grid-cols-1 ${selectedTemplates.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"} gap-6`}>
            {selectedTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="rounded-2xl border border-border bg-card p-4 space-y-4 flex flex-col justify-between shadow-sm relative group hover:border-primary/50 transition-all"
              >
                {/* Remove button */}
                <button
                  onClick={() => onRemoveTemplate(tmpl.id)}
                  title="Remove from comparison"
                  className="absolute top-2 right-2 p-1 rounded-full bg-background/80 border border-border text-muted-foreground hover:text-destructive z-10"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Miniature Authentic Thumbnail */}
                <div className="w-full max-w-[200px] mx-auto shadow-md rounded-lg overflow-hidden group-hover:scale-105 transition-transform">
                  <TemplateThumbnail template={tmpl} />
                </div>

                {/* Details Breakdown */}
                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {tmpl.categoryLabel}
                    </span>
                    <h3 className="font-bold text-base text-foreground">{tmpl.name}</h3>
                    <p className="text-muted-foreground text-[11px] mt-0.5 leading-snug line-clamp-2">
                      {tmpl.description}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-secondary/40 border border-border/80 space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Layout Type:</span>
                      <span className="font-semibold text-foreground">{tmpl.layoutType || "Single Column"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ATS Compatibility:</span>
                      <span className="font-bold text-emerald-600">{tmpl.atsScore || 96}%</span>
                    </div>
                    {tmpl.recommendedFor && (
                      <div className="pt-1 border-t border-border/60">
                        <span className="text-muted-foreground block text-[10px]">Best For:</span>
                        <span className="font-medium text-foreground">{tmpl.recommendedFor}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  onClick={() => handleSelect(tmpl.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-95 shadow-sm active:scale-98 transition-all"
                >
                  <span>Select This Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
