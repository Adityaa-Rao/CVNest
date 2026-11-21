"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ResumeData } from "@/types/resume";
import { getStoredResumes, duplicateResume, saveResume } from "@/lib/storage";
import { analyzeResumeATS, ATSAnalysisReport } from "@/lib/ats/analyzer";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  ArrowRight,
  TrendingUp,
  Target,
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

  const currentResume = resumes.find((r) => r.id === selectedResumeId);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <Target className="w-3.5 h-3.5" /> Job Description Keyword Matcher
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Tailor Your Resume For The Job You Want
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            Paste any job listing to see how closely your resume matches the required skills and technologies. Create an application-specific version in 1 click.
          </p>
        </div>

        {/* Input Form Section */}
        <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-card p-6 md:p-8 space-y-5 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Select Base Resume</label>
              <select
                value={selectedResumeId}
                onChange={(e) => {
                  setSelectedResumeId(e.target.value);
                  setAnalyzed(false);
                }}
                className="w-full text-xs px-3 py-2 rounded-lg border border-input bg-background outline-none"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Target Company</label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Google, Microsoft, Startup"
                className="w-full text-xs px-3 py-2 rounded-lg border border-input bg-background outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Job Title</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full text-xs px-3 py-2 rounded-lg border border-input bg-background outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Job Description / Requirements *
            </label>
            <textarea
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here (e.g. We are seeking a software engineer proficient in React, TypeScript, Node.js, and AWS with 3+ years experience...)"
              className="w-full text-xs p-3.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none leading-relaxed resize-y"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={!jobDescription.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 disabled:opacity-40 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Run Job Match Analysis</span>
            </button>
          </div>
        </div>

        {/* Results Analysis */}
        {analyzed && analysisReport && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Score & Action bar */}
            <div className="p-6 rounded-2xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Match Overview</span>
                <h3 className="text-xl font-bold text-foreground mt-0.5">
                  Job Keyword Alignment: {analysisReport.score}%
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Matched {analysisReport.matchedKeywords?.length || 0} required keywords; {analysisReport.missingKeywords?.length || 0} suggested keywords found.
                </p>
              </div>

              <button
                onClick={handleCreateTailoredVersion}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shadow-sm transition-all"
              >
                <Copy className="w-4 h-4" />
                <span>Create Tailored Version</span>
              </button>
            </div>

            {/* Matched vs Missing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matched */}
              <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Matched Technologies & Keywords
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(analysisReport.matchedKeywords?.length || 0) > 0 ? (
                    analysisReport.matchedKeywords?.map((kw, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-500/20">
                        ✓ {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No direct keyword overlap found yet.</span>
                  )}
                </div>
              </div>

              {/* Missing */}
              <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Keywords In Job Posting Not In Resume
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(analysisReport.missingKeywords?.length || 0) > 0 ? (
                    analysisReport.missingKeywords?.map((kw, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium border border-amber-500/20">
                        + {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">All major technical keywords matched!</span>
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
