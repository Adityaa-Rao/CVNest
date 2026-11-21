"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ResumeData } from "@/types/resume";
import { getStoredResumes, saveResume } from "@/lib/storage";
import { SAMPLE_FRESHER_RESUME, SAMPLE_EXPERIENCED_RESUME } from "@/constants/sample-resumes";
import { ResumeRenderer } from "@/components/resume-preview/ResumeRenderer";
import { exportResumeToPDF } from "@/lib/pdf/exporter";
import {
  Download,
  Share2,
  Check,
  Globe,
  Lock,
  Eye,
  FileText,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function PublicResumePage() {
  const params = useParams();
  const username = (params.username as string) || "rohansharma";

  const [resume, setResume] = useState<ResumeData | null>(null);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const resumes = getStoredResumes();
    // Try matching slug or username
    const match = resumes.find(
      (r) =>
        (r.slug && r.slug.toLowerCase() === username.toLowerCase()) ||
        (r.personalInfo?.fullName &&
          r.personalInfo.fullName.replace(/\s+/g, "").toLowerCase() === username.toLowerCase())
    );

    if (match) {
      setResume(match);
    } else if (username.includes("priya")) {
      setResume(SAMPLE_EXPERIENCED_RESUME);
    } else {
      setResume(SAMPLE_FRESHER_RESUME);
    }
  }, [username]);

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-sm text-zinc-500">Loading public profile...</div>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      await exportResumeToPDF(resume);
    } finally {
      setIsExporting(false);
    }
  };

  const togglePublic = () => {
    const updated = { ...resume, isPublic: !resume.isPublic };
    setResume(updated);
    saveResume(updated);
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-foreground flex flex-col">
      {/* Top Banner Navigation */}
      <header className="border-b border-border bg-card px-4 sm:px-6 h-14 flex items-center justify-between shadow-xs">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-sm tracking-tight">CVNest Profile</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Privacy Toggle Indicator */}
          <button
            onClick={togglePublic}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
              resume.isPublic
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
            }`}
          >
            {resume.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            <span>{resume.isPublic ? "Public Portfolio" : "Private (Owner View)"}</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-xs font-semibold"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? "Link Copied" : "Share"}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? "Rendering..." : "Download PDF"}</span>
          </button>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 py-10 px-4 flex justify-center items-start overflow-auto">
        <ResumeRenderer resume={resume} scale={1} />
      </main>
    </div>
  );
}
