"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ResumeData } from "@/types/resume";
import { getStoredResumes, getResumeById } from "@/lib/storage";
import { analyzeResumeATS, ATSAnalysisReport } from "@/lib/ats/analyzer";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  FileSearch,
  Sparkles,
  Info,
} from "lucide-react";
import Link from "next/link";

function ATSCheckerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resumeId = searchParams.get("id");

  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [selectedResume, setSelectedResume] = useState<ResumeData | null>(null);
  const [analysis, setAnalysis] = useState<ATSAnalysisReport | null>(null);

  useEffect(() => {
    const stored = getStoredResumes();
    setResumes(stored);

    let active = stored[0] || null;
    if (resumeId) {
      const found = getResumeById(resumeId);
      if (found) active = found;
    }

    setSelectedResume(active);
    if (active) {
      setAnalysis(analyzeResumeATS(active));
    }
  }, [resumeId]);

  const handleSelectResume = (id: string) => {
    const found = resumes.find((r) => r.id === id);
    if (found) {
      setSelectedResume(found);
      setAnalysis(analyzeResumeATS(found));
    }
  };

  if (!selectedResume || !analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading ATS Diagnostic...</div>
      </div>
    );
  }

  const scoreColor =
    analysis.score >= 85
      ? "text-emerald-500 border-emerald-500 bg-emerald-500/10"
      : analysis.score >= 70
      ? "text-blue-500 border-blue-500 bg-blue-500/10"
      : "text-amber-500 border-amber-500 bg-amber-500/10";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
        {/* Header with Resume Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> ATS Compatibility Engine
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Applicant Tracking System (ATS) Diagnostic
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-2xl">
              Simulates parsing algorithms used by modern recruitment systems (Workday, Taleo, Greenhouse). Uncovers formatting errors, missing keywords, and readability blockers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Active Resume:</span>
            <select
              value={selectedResume.id}
              onChange={(e) => handleSelectResume(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-input bg-card text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ATS Score & Overview Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Score Card (4 cols) */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
            <div className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center ${scoreColor} shadow-inner`}>
              <span className="text-4xl font-black">{analysis.score}</span>
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">out of 100</span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rating</span>
              <h3 className="text-xl font-bold text-foreground mt-0.5">{analysis.rating} Compatibility</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed px-2">
                {analysis.summary}
              </p>
            </div>

            <Link
              href={`/builder?id=${selectedResume.id}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 shadow-sm active:scale-98 transition-all"
            >
              <span>Improve My Resume Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Breakdown Strengths & Weaknesses (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Disclaimer card */}
            <div className="p-4 rounded-xl bg-secondary/40 border border-border text-xs text-muted-foreground flex items-start gap-2.5">
              <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p>
                <strong>ATS Scoring Logic:</strong> Checks section headers, email validity, metric quantification in experience bullets, contact presence, and keyword frequency. A high ATS score ensures your resume can be read and parsed correctly by hiring software, though interview invitations depend on individual recruiter evaluations.
              </p>
            </div>

            {/* Strengths */}
            <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Verified Strengths ({analysis.strengths.length})</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Keyword Density detected */}
            <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>Detected Technical Keyword Frequency</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.keywordDensity.map((k, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-secondary text-foreground font-medium border border-border flex items-center gap-1.5"
                  >
                    <span>{k.keyword}</span>
                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.2 rounded-full">
                      {k.count}x
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Individual Checks Checklist */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Detailed Checklist Breakdown</h2>
          <div className="space-y-3">
            {analysis.checks.map((check, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  {check.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-bold text-xs text-foreground">{check.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{check.message}</p>
                    {check.suggestion && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
                        Action: {check.suggestion}
                      </p>
                    )}
                  </div>
                </div>

                {!check.passed && check.targetSection && (
                  <Link
                    href={`/builder?id=${selectedResume.id}`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground flex items-center gap-1 flex-shrink-0"
                  >
                    <span>Fix in Editor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function ATSCheckerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="text-xs text-muted-foreground">Loading ATS Diagnostic...</div></div>}>
      <ATSCheckerContent />
    </Suspense>
  );
}
