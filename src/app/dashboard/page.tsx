"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ResumeData, CoverLetterData } from "@/types/resume";
import {
  getStoredResumes,
  saveResume,
  duplicateResume,
  deleteResume,
  createNewBlankResume,
  getStoredCoverLetters,
  deleteCoverLetter,
} from "@/lib/storage";
import { exportResumeToPDF } from "@/lib/pdf/exporter";
import { parseResumeFromText, mergeImportedDataIntoResume } from "@/lib/importer/resume-parser";
import { analyzeResumeATS } from "@/lib/ats/analyzer";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RESUME_TEMPLATES } from "@/constants/templates";
import {
  Plus,
  FileText,
  Copy,
  Trash2,
  Edit,
  Download,
  Share2,
  Upload,
  Sparkles,
  CheckCircle2,
  Clock,
  GraduationCap,
  Briefcase,
  Layers,
  ChevronRight,
  ExternalLink,
  Check,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetterData[]>([]);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setResumes(getStoredResumes());
    setCoverLetters(getStoredCoverLetters());
  }, []);

  const handleCreateNew = (isFresher = false) => {
    const created = createNewBlankResume(isFresher);
    router.push(`/builder?id=${created.id}${isFresher ? "&mode=fresher" : ""}`);
  };

  const handleDuplicate = (id: string) => {
    const dup = duplicateResume(id);
    if (dup) {
      setResumes(getStoredResumes());
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this resume?")) {
      deleteResume(id);
      setResumes(getStoredResumes());
    }
  };

  const handleDownload = async (resume: ResumeData) => {
    try {
      await exportResumeToPDF(resume);
    } catch {
      router.push(`/builder?id=${resume.id}`);
    }
  };

  const handleShare = (resume: ResumeData) => {
    const url = `${window.location.origin}/u/${resume.slug || "rohansharma"}`;
    navigator.clipboard.writeText(url);
    setCopiedId(resume.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExecuteImport = async () => {
    if (!importText.trim()) return;
    setIsImporting(true);
    try {
      const extracted = await parseResumeFromText(importText);
      const blank = createNewBlankResume(false);
      const merged = mergeImportedDataIntoResume(blank, extracted);
      merged.title = `Imported - ${extracted.personalInfo?.fullName || "Resume"}`;
      saveResume(merged);
      setImportModalOpen(false);
      router.push(`/builder?id=${merged.id}`);
    } catch (err) {
      console.error("Import failed", err);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
        {/* Welcome Hero Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-900/20 via-sky-900/10 to-indigo-950/20 border border-indigo-500/20 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Workspace Overview
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back to your Resume Studio
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-xl">
              Create, customize, and tailor multiple resume versions for every company application. Download clean PDFs and optimize with our ATS engine.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setImportModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-border bg-card text-xs font-semibold hover:bg-secondary transition-all"
            >
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span>Import Resume</span>
            </button>

            <button
              onClick={() => handleCreateNew(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-500/20 transition-all"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Fresher BTech Mode</span>
            </button>

            <button
              onClick={() => handleCreateNew(false)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-sm active:scale-98 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Resume</span>
            </button>
          </div>
        </div>

        {/* My Resumes List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">My Resumes & Versions</h2>
              <p className="text-xs text-muted-foreground">Tailor separate versions for Frontend, Backend, or Internship roles.</p>
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {resumes.length} {resumes.length === 1 ? "Resume" : "Resumes"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((res) => {
              const tmpl = RESUME_TEMPLATES.find((t) => t.id === res.style?.templateId) || RESUME_TEMPLATES[0];
              const ats = analyzeResumeATS(res);

              return (
                <div
                  key={res.id}
                  className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                          {res.title}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {res.targetRole || "Software Professional"}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          ats.score >= 80 ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        ATS {ats.score}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
                      <span className="px-2 py-0.5 rounded bg-secondary font-medium">
                        {tmpl.name}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(res.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="px-5 py-3 border-t border-border bg-secondary/20 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDuplicate(res.id)}
                        title="Duplicate as new version"
                        className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleShare(res)}
                        title="Copy Public Link"
                        className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
                      >
                        {copiedId === res.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDelete(res.id)}
                        title="Delete resume"
                        className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(res)}
                        className="px-2.5 py-1 rounded bg-secondary hover:bg-secondary/80 font-medium text-foreground flex items-center gap-1 text-[11px]"
                      >
                        <Download className="w-3 h-3" /> PDF
                      </button>
                      <Link
                        href={`/builder?id=${res.id}`}
                        className="px-3 py-1 rounded bg-primary text-primary-foreground font-semibold flex items-center gap-1 text-[11px] hover:opacity-95"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Saved Cover Letters */}
        <section className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Saved Cover Letters</h2>
              <p className="text-xs text-muted-foreground">Personalized letters generated and matched with your resumes.</p>
            </div>
            <Link
              href="/cover-letter"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>Build Cover Letter</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {coverLetters.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-border text-center space-y-2 bg-secondary/10">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto" />
              <h4 className="text-sm font-semibold text-foreground">No cover letters created yet</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Generate tailored cover letters matching your resume template in 1 click.
              </p>
              <Link
                href="/cover-letter"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-2"
              >
                Create Cover Letter →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coverLetters.map((cl) => (
                <div key={cl.id} className="p-4 rounded-xl border border-border bg-card flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{cl.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{cl.companyName} · {cl.jobTitle}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        deleteCoverLetter(cl.id);
                        setCoverLetters(getStoredCoverLetters());
                      }}
                      className="p-1.5 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/cover-letter?id=${cl.id}`}
                      className="px-3 py-1.5 rounded-lg bg-secondary text-xs font-semibold hover:bg-secondary/80"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Resume Importer Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card text-card-foreground w-full max-w-lg rounded-2xl border border-border shadow-2xl p-6 space-y-4">
            <div>
              <h3 className="font-bold text-base">Import Existing Resume</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Paste your current resume text or raw profile. Our parser will extract contact info, job roles, skills, and projects automatically.
              </p>
            </div>

            <textarea
              rows={8}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste your resume text here (e.g. John Doe, john@example.com, Experience at Google...)"
              className="w-full text-xs p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="text-xs px-4 py-2 rounded-lg border border-border hover:bg-secondary text-muted-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={isImporting || !importText.trim()}
                className="text-xs px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-40 hover:opacity-95"
              >
                {isImporting ? "Parsing Resume..." : "Parse & Open in Builder"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
