"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ResumeData } from "@/types/resume";
import { getStoredResumes, saveResume, createNewBlankResume, getResumeById } from "@/lib/storage";
import { SAMPLE_FRESHER_RESUME, SAMPLE_EXPERIENCED_RESUME } from "@/constants/sample-resumes";
import { LeftPanelSections } from "@/components/resume-builder/LeftPanelSections";
import { CenterEditor } from "@/components/resume-builder/CenterEditor";
import { RightPreviewPanel } from "@/components/resume-builder/RightPreviewPanel";
import { Navbar } from "@/components/layout/Navbar";
import { analyzeResumeATS } from "@/lib/ats/analyzer";
import {
  Sparkles,
  Save,
  CheckCircle,
  FileText,
  Eye,
  Edit3,
  Layers,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

function BuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode");
  const resumeId = searchParams.get("id");
  const templateParam = searchParams.get("template");
  const sampleParam = searchParams.get("sample");

  const [resume, setResume] = useState<ResumeData | null>(null);
  const [activeSection, setActiveSection] = useState<string>("personalInfo");
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");

  useEffect(() => {
    let current: ResumeData | null = null;
    if (resumeId) {
      current = getResumeById(resumeId);
    }

    if (!current) {
      if (mode === "fresher" || sampleParam === "fresher") {
        current = JSON.parse(JSON.stringify(SAMPLE_FRESHER_RESUME));
      } else if (sampleParam === "experienced") {
        current = JSON.parse(JSON.stringify(SAMPLE_EXPERIENCED_RESUME));
      } else {
        const stored = getStoredResumes();
        current = stored.length > 0 ? stored[0] : JSON.parse(JSON.stringify(SAMPLE_FRESHER_RESUME));
      }
    }

    if (current && templateParam) {
      current = {
        ...current,
        style: {
          ...current.style,
          templateId: templateParam,
        },
      };
      saveResume(current);
    }

    setResume(current);
  }, [mode, resumeId, templateParam, sampleParam]);

  const handleUpdateResume = (updated: ResumeData) => {
    setResume(updated);
    setSaveStatus("saving");
    saveResume(updated);
    setTimeout(() => setSaveStatus("saved"), 400);
  };

  const handleToggleHideSection = (secId: string) => {
    if (!resume) return;
    const currentHidden = new Set(resume.style?.hiddenSections || []);
    if (currentHidden.has(secId)) {
      currentHidden.delete(secId);
    } else {
      currentHidden.add(secId);
    }
    handleUpdateResume({
      ...resume,
      style: {
        ...resume.style,
        hiddenSections: Array.from(currentHidden),
      },
    });
  };

  const handleAddCustomSection = () => {
    if (!resume) return;
    const newCustom = {
      id: `custom-${Date.now()}`,
      title: "Projects & Highlights",
      items: [
        {
          id: `item-${Date.now()}`,
          title: "Special Project",
          description: "Details regarding this milestone...",
        },
      ],
    };
    handleUpdateResume({
      ...resume,
      customSections: [...(resume.customSections || []), newCustom],
    });
    setActiveSection(newCustom.id);
  };

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span>Loading CVNest Workspace...</span>
        </div>
      </div>
    );
  }

  // Calculate live ATS score for builder header badge
  const atsReport = analyzeResumeATS(resume);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Navbar />

      {/* Builder Sub-Header Toolbar */}
      <div className="h-12 border-b border-border bg-card px-4 flex items-center justify-between text-xs flex-shrink-0">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={resume.title}
            onChange={(e) => handleUpdateResume({ ...resume, title: e.target.value })}
            className="font-bold text-sm bg-transparent hover:bg-secondary/50 px-2 py-1 rounded border border-transparent hover:border-input focus:border-primary outline-none transition-colors text-foreground max-w-xs sm:max-w-md"
            title="Click to rename resume"
          />

          {mode === "fresher" && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold border border-cyan-500/20 text-[10px]">
              <GraduationCap className="w-3 h-3" /> Fresher Engineering Mode
            </span>
          )}

          <div className="hidden md:flex items-center gap-1.5 text-muted-foreground text-[11px]">
            {saveStatus === "saving" ? (
              <span className="text-amber-500 flex items-center gap-1">Autosaving...</span>
            ) : (
              <span className="text-emerald-500 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Saved
              </span>
            )}
          </div>
        </div>

        {/* Right side stats & mobile toggle */}
        <div className="flex items-center gap-3">
          {/* Quick ATS Jump */}
          <Link
            href={`/ats-checker?id=${resume.id}`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary hover:bg-secondary/80 text-foreground transition-colors duration-150 tabular-nums"
            title="Inspect full ATS diagnostic breakdown"
          >
            <span className="font-medium text-muted-foreground">ATS</span>
            <span className="font-mono text-[11px] font-medium text-foreground">
              {atsReport.score}/100
            </span>
          </Link>

          {/* Mobile Edit/Preview tab toggler */}
          <div className="flex lg:hidden rounded-lg bg-secondary p-0.5 border border-border">
            <button
              onClick={() => setMobileTab("edit")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                mobileTab === "edit" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setMobileTab("preview")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                mobileTab === "preview" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
              }`}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Panel Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Sections List */}
        <div className={`${mobileTab === "preview" ? "hidden" : "hidden md:flex"}`}>
          <LeftPanelSections
            resume={resume}
            activeSection={activeSection}
            onSelectSection={setActiveSection}
            onToggleHideSection={handleToggleHideSection}
            onAddCustomSection={handleAddCustomSection}
          />
        </div>

        {/* Center Panel: Interactive Form Editor */}
        <div className={`flex-1 flex overflow-hidden ${mobileTab === "preview" ? "hidden lg:flex" : "flex"}`}>
          <CenterEditor
            resume={resume}
            activeSection={activeSection}
            onChange={handleUpdateResume}
          />
        </div>

        {/* Right Panel: Live Synchronized Preview */}
        <div className={`${mobileTab === "edit" ? "hidden lg:flex" : "flex flex-1"}`}>
          <RightPreviewPanel
            resume={resume}
            onChangeStyle={(style) => handleUpdateResume({ ...resume, style })}
          />
        </div>
      </div>
    </div>
  );
}

export default function ResumeBuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="text-xs text-muted-foreground">Loading Resume Builder...</div></div>}>
      <BuilderContent />
    </Suspense>
  );
}
