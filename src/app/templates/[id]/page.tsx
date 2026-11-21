"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { RESUME_TEMPLATES } from "@/constants/templates";
import { SAMPLE_FRESHER_RESUME, SAMPLE_EXPERIENCED_RESUME } from "@/constants/sample-resumes";
import { ResumeRenderer } from "@/components/resume-preview/ResumeRenderer";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getStoredResumes, saveResume } from "@/lib/storage";
import { ArrowLeft, CheckCircle2, Download, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function IndividualTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = (params.id as string) || "classic-ats";

  const template = RESUME_TEMPLATES.find((t) => t.id === templateId) || RESUME_TEMPLATES[0];

  // Prepare sample preview
  const sampleData = template.category === "fresher"
    ? { ...SAMPLE_FRESHER_RESUME, style: { ...SAMPLE_FRESHER_RESUME.style, templateId: template.id } }
    : { ...SAMPLE_EXPERIENCED_RESUME, style: { ...SAMPLE_EXPERIENCED_RESUME.style, templateId: template.id } };

  const handleUseTemplate = () => {
    const resumes = getStoredResumes();
    if (resumes.length > 0) {
      const active = resumes[0];
      const updated = {
        ...active,
        style: {
          ...active.style,
          templateId: template.id,
        },
      };
      saveResume(updated);
      router.push(`/builder?id=${updated.id}`);
    } else {
      router.push(`/builder?template=${template.id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/templates"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Templates
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {template.categoryLabel}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight mt-1">{template.name}</h1>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {template.description}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">Template Highlights</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>100% ATS parser compliant with standard text hierarchy</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Customizable color accents, font families, and margins</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Multi-page page-break safety with A4 & US Letter export</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleUseTemplate}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-95 shadow-md transition-all active:scale-98"
              >
                <span>Use This Template</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Live Preview Column */}
          <div className="lg:col-span-7 bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-6 border border-border overflow-hidden flex justify-center">
            <div className="scale-75 sm:scale-90 origin-top">
              <ResumeRenderer resume={sampleData} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
