"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ResumeData } from "@/types/resume";
import { getStoredResumes, getResumeById } from "@/lib/storage";
import { analyzeResumeATS, ATSAnalysisReport } from "@/lib/ats/analyzer";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Info,
} from "lucide-react";
import Link from "next/link";

function ATSCheckerContent() {
  const searchParams = useSearchParams();
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
        <div className="text-sm text-muted-foreground">Loading ATS diagnostic...</div>
      </div>
    );
  }

  const scoreRingColor =
    analysis.score >= 85
      ? "text-emerald-600 border-emerald-500/40 bg-emerald-500/5"
      : analysis.score >= 70
      ? "text-primary border-primary/40 bg-primary/5"
      : "text-amber-600 border-amber-500/40 bg-amber-500/5";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
        {/* Header with Resume Selector */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <span className="text-xs font-medium text-primary">ATS Diagnostic</span>
            <h1 className="text-2xl md:text-3xl font-medium tracking-[-0.015em] text-foreground">
              Applicant Tracking System check
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">
              Checks section structure, contact validity, quantified metrics, and keyword frequency against standard parser rules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Resume</span>
            <select
              value={selectedResume.id}
              onChange={(e) => handleSelectResume(e.target.value)}
              className="h-9 text-xs font-medium px-3 rounded-lg border border-input bg-card text-foreground focus:ring-2 focus:ring-ring/20 outline-none"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ATS Score & Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className={`w-28 h-28 rounded-full border-2 flex flex-col items-center justify-center ${scoreRingColor}`}>
              <span className="text-3xl font-medium tabular-nums">{analysis.score}</span>
              <span className="text-[11px] font-mono text-muted-foreground tabular-nums">/ 100</span>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Compatibility</div>
              <h3 className="text-lg font-medium text-foreground">{analysis.rating}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed px-2">
                {analysis.summary}
              </p>
            </div>

            <Link
              href={`/builder?id=${selectedResume.id}`}
              className="w-full h-9 flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:opacity-95 active:scale-[0.98] transition-[transform,opacity] duration-150"
            >
              <span>Improve my resume</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="p-4 rounded-xl bg-secondary/50 border border-border text-xs text-muted-foreground flex items-start gap-2.5">
              <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <p className="leading-relaxed">
                <strong className="font-medium text-foreground">How the score is calculated:</strong> Evaluates section headers, email validity, metric quantification in experience bullets, contact presence, and keyword frequency. A high score ensures clean machine parsing, though interviews depend on recruiter review.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card space-y-3">
              <h3 className="font-medium text-sm text-foreground tabular-nums">
                Verified strengths ({analysis.strengths.length})
              </h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card space-y-3">
              <h3 className="font-medium text-sm text-foreground">
                Detected technical keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.keywordDensity.map((k, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-md bg-secondary text-foreground border border-border flex items-center gap-1.5 tabular-nums"
                  >
                    <span>{k.keyword}</span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {k.count}×
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Checklist */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">Checklist breakdown</h2>
          <div className="divide-y divide-border rounded-xl border border-border bg-card">
            {analysis.checks.map((check, i) => (
              <div
                key={i}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  {check.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  )}
                  <div>
                    <h4 className="font-medium text-xs text-foreground">{check.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{check.message}</p>
                    {check.suggestion && (
                      <p className="text-xs text-foreground mt-1">
                        <span className="text-muted-foreground">Suggested fix: </span>
                        {check.suggestion}
                      </p>
                    )}
                  </div>
                </div>

                {!check.passed && check.targetSection && (
                  <Link
                    href={`/builder?id=${selectedResume.id}`}
                    className="text-xs font-medium h-8 px-3 rounded-lg border border-border bg-background hover:bg-secondary text-foreground flex items-center gap-1.5 flex-shrink-0 transition-colors duration-150"
                  >
                    <span>Fix in editor</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="text-xs text-muted-foreground">Loading ATS diagnostic...</div></div>}>
      <ATSCheckerContent />
    </Suspense>
  );
}
