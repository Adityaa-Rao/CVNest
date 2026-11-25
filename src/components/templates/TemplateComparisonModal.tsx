"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { TemplateMetadata, ResumeData } from "@/types/resume";
import { TemplateThumbnail } from "./TemplateThumbnail";
import { getStoredResumes, saveResume } from "@/lib/storage";
import { X, ArrowRight } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-card text-card-foreground w-full max-w-5xl rounded-2xl border border-border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
          <div>
            <span className="text-xs font-medium text-primary">Template comparison</span>
            <h2 className="text-lg font-medium tracking-tight text-foreground mt-0.5 tabular-nums">
              Comparing {selectedTemplates.length} of 3 templates
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close comparison"
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary transition-colors duration-150"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className={`grid grid-cols-1 ${selectedTemplates.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"} gap-6`}>
            {selectedTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="rounded-xl border border-border bg-background p-4 space-y-4 flex flex-col justify-between relative"
              >
                <button
                  onClick={() => onRemoveTemplate(tmpl.id)}
                  title="Remove from comparison"
                  className="absolute top-3 right-3 p-1 rounded-md bg-card border border-border text-muted-foreground hover:text-destructive z-10 transition-colors duration-150"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>

                <div className="w-full max-w-[190px] mx-auto shadow-sm rounded-lg overflow-hidden">
                  <TemplateThumbnail template={tmpl} />
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <span className="text-[11px] font-medium text-primary">{tmpl.categoryLabel}</span>
                    <h3 className="font-medium text-base text-foreground">{tmpl.name}</h3>
                    <p className="text-muted-foreground text-xs mt-0.5 leading-snug line-clamp-2">
                      {tmpl.description}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-card border border-border space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Layout</span>
                      <span className="font-medium text-foreground">{tmpl.layoutType || "Single Column"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ATS score</span>
                      <span className="font-mono text-foreground tabular-nums">{tmpl.atsScore || 96}%</span>
                    </div>
                    {tmpl.recommendedFor && (
                      <div className="pt-1.5 border-t border-border">
                        <span className="text-muted-foreground block text-[11px]">Suited for</span>
                        <span className="font-medium text-foreground">{tmpl.recommendedFor}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleSelect(tmpl.id)}
                  className="w-full flex items-center justify-center gap-1.5 h-9 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:opacity-95 active:scale-[0.98] transition-[transform,opacity] duration-150"
                >
                  <span>Select template</span>
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
