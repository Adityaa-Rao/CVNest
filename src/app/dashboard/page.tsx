"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ResumeData, CoverLetterData, JobApplication } from "@/types/resume";
import {
  getStoredResumes,
  saveResume,
  duplicateResume,
  deleteResume,
  createNewBlankResume,
  getStoredCoverLetters,
  deleteCoverLetter,
  getStoredJobApplications,
  saveJobApplication,
  deleteJobApplication,
  getUserPreferences,
} from "@/lib/storage";
import { exportResumeToPDF } from "@/lib/pdf/exporter";
import { parseResumeFromText, mergeImportedDataIntoResume } from "@/lib/importer/resume-parser";
import { analyzeResumeATS } from "@/lib/ats/analyzer";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RESUME_TEMPLATES } from "@/constants/templates";
import { TemplateThumbnail } from "@/components/templates/TemplateThumbnail";
import { generateId } from "@/lib/utils";
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
  Clock,
  GraduationCap,
  Check,
  Github,
  X,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetterData[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [favoriteTemplates, setFavoriteTemplates] = useState<string[]>([]);

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [githubModalOpen, setGithubModalOpen] = useState(false);
  const [githubRepoUrl, setGithubRepoUrl] = useState("");
  const [githubLoading, setGithubLoading] = useState(false);

  const [interviewPrepOpen, setInterviewPrepOpen] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState<Array<{ q: string; type: string; answerKey: string }>>([]);

  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [newJobCompany, setNewJobCompany] = useState("");
  const [newJobRole, setNewJobRole] = useState("");
  const [newJobStatus, setNewJobStatus] = useState<JobApplication["status"]>("applied");
  const [newJobLocation, setNewJobLocation] = useState("");
  const [newJobNotes, setNewJobNotes] = useState("");

  useEffect(() => {
    setResumes(getStoredResumes());
    setCoverLetters(getStoredCoverLetters());
    setJobApplications(getStoredJobApplications());
    const prefs = getUserPreferences();
    setFavoriteTemplates(prefs.favoriteTemplates || ["classic-ats", "btech-fresher"]);
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

  const handleImportGitHubRepo = async () => {
    if (!githubRepoUrl.trim() || resumes.length === 0) return;
    setGithubLoading(true);

    try {
      const repoClean = githubRepoUrl.replace(/^https?:\/\/github\.com\//i, "").trim().replace(/\/$/, "");
      const parts = repoClean.split("/");
      const repoName = parts[parts.length - 1] || "GitHub Project";

      const newProject = {
        id: generateId(),
        name: repoName.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        description: `Application hosted on GitHub (${repoClean}) with modular components, API integrations, and automated checks.`,
        technologies: ["TypeScript", "Next.js", "Tailwind CSS", "GitHub Actions"],
        githubUrl: `https://github.com/${repoClean}`,
        keyContributions: [
          "Developed core service architecture with unit and integration tests.",
          "Configured continuous integration workflow with GitHub Actions for linting and build checks.",
        ],
      };

      const active = resumes[0];
      const updated = {
        ...active,
        projects: [newProject, ...(active.projects || [])],
      };
      saveResume(updated);
      setResumes(getStoredResumes());
      setGithubModalOpen(false);
      alert(`Imported "${newProject.name}" into ${active.title}`);
    } catch (err) {
      console.error(err);
    } finally {
      setGithubLoading(false);
    }
  };

  const handleOpenInterviewPrep = () => {
    const active = resumes[0];
    const skills = active?.skills?.flatMap((c) => c.skills.map((s) => s.name)).slice(0, 5) || ["JavaScript", "React", "APIs"];

    const questions = [
      {
        q: `How do you structure and design scalable systems using ${skills[0] || "your primary stack"} in production?`,
        type: "Architecture",
        answerKey: "Explain modular component isolation, error boundaries, caching layers, and deployment pipelines.",
      },
      {
        q: "Describe a challenging bug or bottleneck you diagnosed and how you resolved it.",
        type: "Problem solving",
        answerKey: "Use Situation, Task, Action, Result. Highlight profiler tools, log telemetry, and measured gains.",
      },
      {
        q: `What trade-offs do you consider when choosing ${skills[1] || "modern frameworks"} over simpler alternatives?`,
        type: "Engineering judgment",
        answerKey: "Discuss developer velocity, bundle weight, runtime constraints, and maintenance overhead.",
      },
      {
        q: "How do you ensure zero-downtime database migrations and data consistency?",
        type: "Backend resilience",
        answerKey: "Mention dual-write phases, backward-compatible schemas, blue-green deployments, and rollback plans.",
      },
      {
        q: "How do you resolve architectural disagreements within an engineering team?",
        type: "Collaboration",
        answerKey: "Focus on benchmark-driven experiments, RFC design reviews, blameless post-mortems, and product goals.",
      },
    ];

    setInterviewQuestions(questions);
    setInterviewPrepOpen(true);
  };

  const handleCreateJobApp = () => {
    if (!newJobCompany || !newJobRole) return;
    const newApp: JobApplication = {
      id: generateId(),
      company: newJobCompany,
      role: newJobRole,
      status: newJobStatus,
      location: newJobLocation || "Remote",
      appliedDate: new Date().toISOString().split("T")[0],
      notes: newJobNotes,
    };
    saveJobApplication(newApp);
    setJobApplications(getStoredJobApplications());
    setJobModalOpen(false);
    setNewJobCompany("");
    setNewJobRole("");
    setNewJobNotes("");
  };

  const handleUpdateJobStatus = (id: string, newStatus: JobApplication["status"]) => {
    const app = jobApplications.find((a) => a.id === id);
    if (app) {
      saveJobApplication({ ...app, status: newStatus });
      setJobApplications(getStoredJobApplications());
    }
  };

  const avgAtsScore =
    resumes.length > 0
      ? Math.round(resumes.reduce((acc, r) => acc + analyzeResumeATS(r).score, 0) / resumes.length)
      : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
        {/* Clean Contextual Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Workspace</span>
            <h1 className="text-2xl md:text-3xl font-medium tracking-[-0.015em] text-foreground">
              Resumes and applications
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setGithubModalOpen(true)}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-secondary transition-colors duration-150"
            >
              <Github className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              <span>Import GitHub</span>
            </button>

            <button
              onClick={handleOpenInterviewPrep}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-secondary transition-colors duration-150"
            >
              <Sparkles className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              <span>Interview prep</span>
            </button>

            <button
              onClick={() => handleCreateNew(true)}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-secondary transition-colors duration-150"
            >
              <GraduationCap className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              <span>Fresher resume</span>
            </button>

            <button
              onClick={() => handleCreateNew(false)}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-95 active:scale-[0.98] transition-[transform,opacity] duration-150"
            >
              <Plus className="w-4 h-4" strokeWidth={1.5} />
              <span>New resume</span>
            </button>
          </div>
        </div>

        {/* Summary Stat Row (Clean Numbers Only, Tabular) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-border bg-card space-y-1">
            <div className="text-xs text-muted-foreground">Saved resumes</div>
            <div className="text-2xl font-medium text-foreground tabular-nums">{resumes.length}</div>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card space-y-1">
            <div className="text-xs text-muted-foreground">Average ATS score</div>
            <div className="text-2xl font-medium text-foreground tabular-nums">{avgAtsScore}%</div>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card space-y-1">
            <div className="text-xs text-muted-foreground">Active applications</div>
            <div className="text-2xl font-medium text-foreground tabular-nums">{jobApplications.length}</div>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card space-y-1">
            <div className="text-xs text-muted-foreground">Cover letters</div>
            <div className="text-2xl font-medium text-foreground tabular-nums">{coverLetters.length}</div>
          </div>
        </div>

        {/* 1. My Resumes & Versions Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-medium text-foreground">Resumes and tailored versions</h2>
              <p className="text-xs text-muted-foreground">Keep separate copies for different target roles.</p>
            </div>
            <button
              onClick={() => setImportModalOpen(true)}
              className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Import text</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((res) => {
              const tmpl = RESUME_TEMPLATES.find((t) => t.id === res.style?.templateId) || RESUME_TEMPLATES[0];
              const ats = analyzeResumeATS(res);

              return (
                <div
                  key={res.id}
                  className="rounded-xl border border-border bg-card overflow-hidden hover:border-foreground/25 transition-colors duration-150 flex flex-col justify-between"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-medium text-sm text-foreground truncate">
                          {res.title}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {res.targetRole || "Software Professional"}
                        </p>
                      </div>

                      <Link
                        href={`/ats-checker?id=${res.id}`}
                        className="text-[11px] font-mono text-muted-foreground hover:text-foreground tabular-nums flex-shrink-0"
                        title="Open ATS check"
                      >
                        ATS {ats.score}%
                      </Link>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1 tabular-nums">
                      <span className="px-2 py-0.5 rounded bg-secondary text-foreground font-medium">
                        {tmpl.name}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" strokeWidth={1.5} />
                        {new Date(res.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="px-5 py-3 border-t border-border bg-secondary/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDuplicate(res.id)}
                        title="Duplicate as new version"
                        className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors duration-150"
                      >
                        <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => handleShare(res)}
                        title="Copy public link"
                        className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors duration-150"
                      >
                        {copiedId === res.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={1.5} />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(res.id)}
                        title="Delete resume"
                        className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-destructive transition-colors duration-150"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(res)}
                        className="h-7 px-2.5 rounded-md border border-border bg-card hover:bg-secondary font-medium text-foreground flex items-center gap-1 text-[11px] transition-colors duration-150"
                      >
                        <Download className="w-3 h-3" strokeWidth={1.5} />
                        <span>PDF</span>
                      </button>
                      <Link
                        href={`/builder?id=${res.id}`}
                        className="h-7 px-3 rounded-md bg-primary text-primary-foreground font-medium flex items-center gap-1 text-[11px] hover:opacity-95 transition-opacity duration-150"
                      >
                        <Edit className="w-3 h-3" strokeWidth={1.5} />
                        <span>Edit</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. Job Application Tracker */}
        <section className="space-y-4 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-medium text-foreground">Application tracker</h2>
              <p className="text-xs text-muted-foreground">Track where each resume version has been submitted.</p>
            </div>
            <button
              onClick={() => setJobModalOpen(true)}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-95 transition-opacity duration-150"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Add application</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(["wishlist", "applied", "interviewing", "offer"] as const).map((colStatus) => {
              const items = jobApplications.filter((a) => a.status === colStatus);
              const labelMap: Record<string, string> = {
                wishlist: "Wishlist",
                applied: "Applied",
                interviewing: "Interviewing",
                offer: "Offer received",
              };

              return (
                <div key={colStatus} className="p-4 rounded-xl border border-border bg-card space-y-3">
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-foreground">{labelMap[colStatus]}</span>
                    <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
                      {items.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 min-h-[140px]">
                    {items.map((app) => (
                      <div key={app.id} className="p-3 rounded-lg border border-border bg-background space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-xs text-foreground">{app.company}</div>
                            <div className="text-[11px] text-muted-foreground">{app.role}</div>
                          </div>
                          <button
                            onClick={() => {
                              deleteJobApplication(app.id);
                              setJobApplications(getStoredJobApplications());
                            }}
                            aria-label="Delete application"
                            className="text-muted-foreground hover:text-destructive p-0.5 transition-colors duration-150"
                          >
                            <Trash2 className="w-3 h-3" strokeWidth={1.5} />
                          </button>
                        </div>

                        {app.notes && (
                          <div className="text-[11px] text-muted-foreground bg-secondary/50 p-2 rounded-md leading-snug">
                            {app.notes}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1.5 border-t border-border text-[11px]">
                          <span className="text-muted-foreground font-mono tabular-nums">{app.appliedDate}</span>
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateJobStatus(app.id, e.target.value as JobApplication["status"])}
                            className="bg-transparent text-[11px] font-medium text-primary outline-none cursor-pointer"
                          >
                            <option value="wishlist">Wishlist</option>
                            <option value="applied">Applied</option>
                            <option value="interviewing">Interviewing</option>
                            <option value="offer">Offer</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    ))}

                    {items.length === 0 && (
                      <div className="text-[11px] text-muted-foreground text-center py-8">
                        No applications
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. Favorite Templates Showcase */}
        <section className="space-y-4 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-medium text-foreground">Favorite templates</h2>
              <p className="text-xs text-muted-foreground">Starred layouts from the template gallery.</p>
            </div>
            <Link href="/templates" className="text-xs font-medium text-primary hover:underline">
              Browse all templates
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {RESUME_TEMPLATES.filter((t) => favoriteTemplates.includes(t.id)).slice(0, 4).map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-4 rounded-xl border border-border bg-card space-y-3 hover:border-foreground/25 transition-colors duration-150"
              >
                <div className="max-w-[140px] mx-auto shadow-sm rounded-md overflow-hidden">
                  <TemplateThumbnail template={tmpl} />
                </div>
                <div>
                  <h4 className="font-medium text-xs text-foreground">{tmpl.name}</h4>
                  <p className="text-[11px] text-muted-foreground">{tmpl.categoryLabel}</p>
                </div>
                <Link
                  href={`/builder?template=${tmpl.id}`}
                  className="flex items-center justify-center h-8 rounded-lg border border-border bg-background hover:bg-secondary text-xs font-medium text-foreground transition-colors duration-150"
                >
                  Use template
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Saved Cover Letters */}
        <section className="space-y-4 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-medium text-foreground">Saved cover letters</h2>
              <p className="text-xs text-muted-foreground">Letters tailored to specific roles and companies.</p>
            </div>
            <Link href="/cover-letter" className="text-xs font-medium text-primary hover:underline">
              New cover letter
            </Link>
          </div>

          {coverLetters.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-border text-center space-y-2 bg-card">
              <FileText className="w-6 h-6 text-muted-foreground mx-auto" strokeWidth={1.5} />
              <h4 className="text-sm font-medium text-foreground">No cover letters yet</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Draft a letter in the Cover Letter Studio and save it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coverLetters.map((cl) => (
                <div key={cl.id} className="p-4 rounded-xl border border-border bg-card flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-sm text-foreground">{cl.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{cl.companyName} · {cl.jobTitle}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        deleteCoverLetter(cl.id);
                        setCoverLetters(getStoredCoverLetters());
                      }}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors duration-150"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    <Link
                      href={`/cover-letter?id=${cl.id}`}
                      className="h-8 px-3 rounded-lg bg-secondary text-xs font-medium flex items-center hover:bg-secondary/80 transition-colors duration-150"
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

      {/* GitHub Project Import Modal */}
      {githubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card text-card-foreground w-full max-w-md rounded-2xl border border-border shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Github className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                <div>
                  <h3 className="font-medium text-base">Import GitHub project</h3>
                  <p className="text-xs text-muted-foreground">Add a repository to your active resume.</p>
                </div>
              </div>
              <button onClick={() => setGithubModalOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Repository URL or owner/repo
              </label>
              <input
                type="text"
                value={githubRepoUrl}
                onChange={(e) => setGithubRepoUrl(e.target.value)}
                placeholder="rohansharma/campus-connect"
                className="w-full h-9 text-xs px-3 rounded-lg border border-input bg-background outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setGithubModalOpen(false)}
                className="text-xs h-8 px-3 rounded-lg border border-border hover:bg-secondary text-muted-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportGitHubRepo}
                disabled={githubLoading || !githubRepoUrl.trim()}
                className="text-xs h-8 px-4 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-40"
              >
                {githubLoading ? "Importing..." : "Import project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Interview Prep Modal */}
      {interviewPrepOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card text-card-foreground w-full max-w-2xl rounded-2xl border border-border shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-primary">Interview prep</span>
                <h3 className="font-medium text-lg text-foreground mt-0.5">
                  Role-specific questions and evaluation notes
                </h3>
              </div>
              <button onClick={() => setInterviewPrepOpen(false)} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground">
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {interviewQuestions.map((iq, i) => (
                <div key={i} className="p-4 rounded-xl border border-border bg-background space-y-2 text-xs">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-medium text-foreground">
                      {i + 1}. {iq.q}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-secondary text-muted-foreground whitespace-nowrap">
                      {iq.type}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border text-muted-foreground">
                    <strong className="font-medium text-foreground">What interviewers look for: </strong>
                    {iq.answerKey}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Job Application Modal */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card text-card-foreground w-full max-w-md rounded-2xl border border-border shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-base">Add job application</h3>
              <button onClick={() => setJobModalOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">Company</label>
                <input
                  type="text"
                  value={newJobCompany}
                  onChange={(e) => setNewJobCompany(e.target.value)}
                  placeholder="Stripe"
                  className="w-full h-9 text-xs px-3 rounded-lg border border-input bg-background"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Role</label>
                <input
                  type="text"
                  value={newJobRole}
                  onChange={(e) => setNewJobRole(e.target.value)}
                  placeholder="Full-Stack Engineer"
                  className="w-full h-9 text-xs px-3 rounded-lg border border-input bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Status</label>
                  <select
                    value={newJobStatus}
                    onChange={(e) => setNewJobStatus(e.target.value as JobApplication["status"])}
                    className="w-full h-9 text-xs px-3 rounded-lg border border-input bg-background"
                  >
                    <option value="wishlist">Wishlist</option>
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offer">Offer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={newJobLocation}
                    onChange={(e) => setNewJobLocation(e.target.value)}
                    placeholder="Remote"
                    className="w-full h-9 text-xs px-3 rounded-lg border border-input bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={newJobNotes}
                  onChange={(e) => setNewJobNotes(e.target.value)}
                  placeholder="Referral or interview notes"
                  className="w-full text-xs p-2.5 rounded-lg border border-input bg-background resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setJobModalOpen(false)}
                className="text-xs h-8 px-3 rounded-lg border border-border hover:bg-secondary text-muted-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateJobApp}
                disabled={!newJobCompany || !newJobRole}
                className="text-xs h-8 px-4 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Importer Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card text-card-foreground w-full max-w-lg rounded-2xl border border-border shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-base">Import resume text</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Paste existing resume text to extract contact details and skills into a draft.
                </p>
              </div>
              <button onClick={() => setImportModalOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            <textarea
              rows={8}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste resume text here"
              className="w-full text-xs p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring/20 outline-none resize-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="text-xs h-8 px-3 rounded-lg border border-border hover:bg-secondary text-muted-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={isImporting || !importText.trim()}
                className="text-xs h-8 px-4 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-40 hover:opacity-95"
              >
                {isImporting ? "Parsing..." : "Parse and open"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
