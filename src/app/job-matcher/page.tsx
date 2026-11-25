"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ResumeData } from "@/types/resume";
import { getStoredResumes, duplicateResume, saveResume } from "@/lib/storage";
import { analyzeResumeATS, ATSAnalysisReport } from "@/lib/ats/analyzer";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
} from "lucide-react";

export default function JobMatcherPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [targetCompany, setTargetCompany] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<ATSAnalysisReport | null>(null);

  useEffect(() => {
    const stored = getStoredResumes();
    setResumes(stored);
    if (stored.length > 0) {
      setSelectedResumeId(stored[0].id);
    }
  }, []);

  const handleAnalyze = () => {
    const resume = resumes.find((r) => r.id === selectedResumeId);
    if (!resume || !jobDescription.trim()) return;

    const report = analyzeResumeATS(resume, jobDescription);
    setAnalysisReport(report);
    setAnalyzed(true);
  };

  const handleCreateTailoredVersion = () => {
    if (!selectedResumeId) return;
    const companyTitle = targetCompany ? `(${targetCompany} Tailored)` : "(Job Version)";
    const duplicated = duplicateResume(selectedResumeId, companyTitle);
    if (duplicated) {
      if (targetRole) duplicated.targetRole = targetRole;
      saveResume(duplicated);
      router.push(`/builder?id=${duplicated.id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
        <div className="space-y-1.5 max-w-2xl">
          <span className="text-xs font-medium text-primary">Job Matcher</span>
          <h1 className="text-2xl md:text-3xl font-medium tracking-[-0.015em] text-foreground">
            Compare your resume against a job description
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Paste a job posting to identify matching and missing keywords, then branch a tailored copy without altering your base resume.
          </p>
        </div>

        {/* Input Form */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Base resume</label>
              <select
                value={selectedResumeId}
                onChange={(e) => {
                  setSelectedResumeId(e.target.value);
                  setAnalyzed(false);
                }}
                className="w-full h-9 text-xs px-3 rounded-lg border border-input bg-background outline-none"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Company</label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="Stripe"
                className="w-full h-9 text-xs px-3 rounded-lg border border-input bg-background outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Role title</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Senior Frontend Engineer"
                className="w-full h-9 text-xs px-3 rounded-lg border border-input bg-background outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Job description
            </label>
            <textarea
              rows={7}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job requirements and responsibilities here"
              className="w-full text-xs p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring/20 outline-none leading-relaxed resize-y"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={!jobDescription.trim()}
              className="inline-flex items-center gap-2 h-9 px-5 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:opacity-95 disabled:opacity-40 active:scale-[0.98] transition-[transform,opacity] duration-150"
            >
              <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Analyze match</span>
            </button>
          </div>
        </div>

        {/* Results */}
        {analyzed && analysisReport && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-muted-foreground">Alignment summary</span>
                <h3 className="text-xl font-medium text-foreground mt-0.5 tabular-nums">
                  Keyword alignment: {analysisReport.score}%
                </h3>
                <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                  {analysisReport.matchedKeywords?.length || 0} matched keywords · {analysisReport.missingKeywords?.length || 0} missing keywords
                </p>
              </div>

              <button
                onClick={handleCreateTailoredVersion}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:opacity-95 active:scale-[0.98] transition-[transform,opacity] duration-150"
              >
                <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Create tailored version</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border border-border bg-card space-y-3">
                <h4 className="font-medium text-xs text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                  <span>Matched keywords</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(analysisReport.matchedKeywords?.length || 0) > 0 ? (
                    analysisReport.matchedKeywords?.map((kw, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-secondary text-foreground border border-border">
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No direct keyword overlap detected.</span>
                  )}
                </div>
              </div>

              <div className="p-5 rounded-xl border border-border bg-card space-y-3">
                <h4 className="font-medium text-xs text-foreground flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                  <span>Missing from resume</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(analysisReport.missingKeywords?.length || 0) > 0 ? (
                    analysisReport.missingKeywords?.map((kw, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-secondary text-muted-foreground border border-border">
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">All major technical keywords matched.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
