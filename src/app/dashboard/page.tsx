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
  CheckCircle2,
  Clock,
  GraduationCap,
  Briefcase,
  Layers,
  ChevronRight,
  ExternalLink,
  Check,
  Github,
  HelpCircle,
  FolderGit2,
  Heart,
  TrendingUp,
  MapPin,
  Calendar,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetterData[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [favoriteTemplates, setFavoriteTemplates] = useState<string[]>([]);

  // Modals state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // GitHub Import Modal
  const [githubModalOpen, setGithubModalOpen] = useState(false);
  const [githubRepoUrl, setGithubRepoUrl] = useState("");
  const [githubLoading, setGithubLoading] = useState(false);

  // AI Interview Prep Modal
  const [interviewPrepOpen, setInterviewPrepOpen] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState<Array<{ q: string; type: string; answerKey: string }>>([]);

  // Job Application Modal
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

  // GitHub Project Import Logic
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
        description: `Production-ready application architected and hosted on GitHub (${repoClean}). Implements clean modular components, robust API integrations, and automated deployment pipelines.`,
        technologies: ["TypeScript", "Next.js", "Tailwind CSS", "GitHub Actions"],
        githubUrl: `https://github.com/${repoClean}`,
        keyContributions: [
          "Developed core service architecture with rigorous unit and integration tests.",
          "Configured continuous integration workflow with GitHub Actions for automated linting and build checks.",
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
      alert(`Successfully imported "${newProject.name}" into ${active.title}!`);
    } catch (err) {
      console.error(err);
    } finally {
      setGithubLoading(false);
    }
  };

  // AI Interview Prep Generator
  const handleOpenInterviewPrep = () => {
    const active = resumes[0];
    const role = active?.targetRole || "Software Engineer";
    const skills = active?.skills?.flatMap((c) => c.skills.map((s) => s.name)).slice(0, 5) || ["JavaScript", "React", "APIs"];

    const questions = [
      {
        q: `How do you structure and design scalable systems using ${skills[0] || "core technical stacks"} in production?`,
        type: "Technical Architecture",
        answerKey: "Explain modular component isolation, error boundaries, caching layers, and CI/CD pipelines.",
      },
      {
        q: "Describe a challenging bug or bottleneck you diagnosed and how you resolved it.",
        type: "Problem Solving (STAR)",
        answerKey: "Use Situation, Task, Action, Result. Highlight profiler tools, log telemetry, and measured performance gains.",
      },
      {
        q: `What trade-offs do you consider when selecting ${skills[1] || "modern frameworks"} vs traditional architectures?`,
        type: "Engineering Strategy",
        answerKey: "Discuss developer velocity, server vs client bundle weights, and operational maintenance overhead.",
      },
      {
        q: "How do you ensure zero-downtime database migrations and data consistency?",
        type: "Backend & Resilience",
        answerKey: "Mention dual-write phases, backward-compatible schemas, blue-green deployments, and rollback contingencies.",
      },
      {
        q: "How do you resolve architectural disagreements within your team?",
        type: "Behavioral Leadership",
        answerKey: "Focus on benchmark-driven experiments, RFC design reviews, blameless post-mortems, and alignment with business goals.",
      },
    ];

    setInterviewQuestions(questions);
    setInterviewPrepOpen(true);
  };

  // Save new job application
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

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
        {/* Welcome Hero Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/20 via-sky-900/10 to-indigo-950/20 border border-indigo-500/20 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> CVNest SaaS Dashboard
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back to your Career Command Center
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-xl">
              Create and manage targeted resume versions for every opportunity. Track job applications and prepare for interviews with AI tools.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setGithubModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-border bg-card text-xs font-semibold hover:bg-secondary transition-all"
            >
              <Github className="w-4 h-4 text-muted-foreground" />
              <span>Import GitHub Repo</span>
            </button>

            <button
              onClick={handleOpenInterviewPrep}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Interview Prep</span>
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

        {/* 1. My Resumes & Versions Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">My Resumes & Tailored Versions</h2>
              <p className="text-xs text-muted-foreground">Keep dedicated copies for Frontend, Backend, or Full-Stack roles.</p>
            </div>
            <button
              onClick={() => setImportModalOpen(true)}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" /> Import Existing Resume Text
            </button>
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

        {/* 2. Job Application Tracker */}
        <section className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Job Application Tracker</h2>
              <p className="text-xs text-muted-foreground">Monitor and organize where your resumes have been submitted.</p>
            </div>
            <button
              onClick={() => setJobModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Application
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(["wishlist", "applied", "interviewing", "offer"] as const).map((colStatus) => {
              const items = jobApplications.filter((a) => a.status === colStatus);
              const labelMap: Record<string, string> = {
                wishlist: "Wishlist / Target",
                applied: "Applied",
                interviewing: "Interviewing",
                offer: "Offer Received 🎉",
              };

              return (
                <div key={colStatus} className="p-4 rounded-2xl border border-border bg-card/60 space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="capitalize">{labelMap[colStatus]}</span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-mono">
                      {items.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 min-h-[140px]">
                    {items.map((app) => (
                      <div key={app.id} className="p-3 rounded-xl border border-border bg-card space-y-2 shadow-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-xs text-foreground">{app.company}</div>
                            <div className="text-[11px] text-muted-foreground">{app.role}</div>
                          </div>
                          <button
                            onClick={() => {
                              deleteJobApplication(app.id);
                              setJobApplications(getStoredJobApplications());
                            }}
                            className="text-muted-foreground hover:text-destructive p-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {app.notes && (
                          <div className="text-[10px] text-muted-foreground bg-secondary/40 p-1.5 rounded leading-snug">
                            {app.notes}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1 border-t border-border text-[10px]">
                          <span className="text-zinc-400 font-mono">{app.appliedDate}</span>
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateJobStatus(app.id, e.target.value as any)}
                            className="bg-transparent text-[10px] font-semibold text-primary outline-none cursor-pointer"
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
                      <div className="text-[11px] text-muted-foreground/60 text-center py-8">
                        No applications here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. Favorite Templates Showcase */}
        <section className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Favorite Templates</h2>
              <p className="text-xs text-muted-foreground">Quick access to your preferred resume designs.</p>
            </div>
            <Link href="/templates" className="text-xs font-semibold text-primary hover:underline">
              Explore All 20 Templates →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {RESUME_TEMPLATES.filter((t) => favoriteTemplates.includes(t.id)).slice(0, 4).map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-3.5 rounded-2xl border border-border bg-card space-y-3 hover:border-primary/50 transition-all"
              >
                <div className="max-w-[140px] mx-auto shadow-sm rounded-md overflow-hidden">
                  <TemplateThumbnail template={tmpl} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-foreground">{tmpl.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{tmpl.categoryLabel}</p>
                </div>
                <Link
                  href={`/builder?template=${tmpl.id}`}
                  className="block text-center py-1.5 rounded-lg bg-secondary text-xs font-semibold hover:bg-secondary/80 text-foreground"
                >
                  Use Template
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Saved Cover Letters */}
        <section className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Saved Cover Letters</h2>
              <p className="text-xs text-muted-foreground">Tailored letters matched to your applications.</p>
            </div>
            <Link href="/cover-letter" className="text-xs font-semibold text-primary hover:underline">
              Create Cover Letter →
            </Link>
          </div>

          {coverLetters.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-border text-center space-y-2 bg-secondary/10">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto" />
              <h4 className="text-sm font-semibold text-foreground">No cover letters created yet</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Generate tailored cover letters matching your resume template in 1 click.
              </p>
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

      {/* GitHub Project Import Modal */}
      {githubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card text-card-foreground w-full max-w-md rounded-2xl border border-border shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
                <Github className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base">Import GitHub Project</h3>
                <p className="text-xs text-muted-foreground">Extract repo details into your active resume.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                GitHub Repository URL or "username/repo"
              </label>
              <input
                type="text"
                value={githubRepoUrl}
                onChange={(e) => setGithubRepoUrl(e.target.value)}
                placeholder="e.g. rohansharma/campus-connect or vercel/next.js"
                className="w-full text-xs px-3 py-2 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setGithubModalOpen(false)}
                className="text-xs px-4 py-2 rounded-lg border border-border hover:bg-secondary text-muted-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportGitHubRepo}
                disabled={githubLoading || !githubRepoUrl.trim()}
                className="text-xs px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-40"
              >
                {githubLoading ? "Extracting Repo..." : "Import into Resume"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Interview Prep Modal */}
      {interviewPrepOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card text-card-foreground w-full max-w-2xl rounded-3xl border border-border shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  AI Career Coach
                </span>
                <h3 className="font-bold text-lg text-foreground mt-0.5">
                  Interview Preparation Questions & Frameworks
                </h3>
              </div>
              <button onClick={() => setInterviewPrepOpen(false)} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground">
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {interviewQuestions.map((iq, i) => (
                <div key={i} className="p-4 rounded-xl border border-border bg-secondary/20 space-y-2 text-xs">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-foreground">
                      Q{i + 1}: {iq.q}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary whitespace-nowrap">
                      {iq.type}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border/60 text-muted-foreground">
                    <strong className="text-foreground">Recruiter Evaluation: </strong>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card text-card-foreground w-full max-w-md rounded-2xl border border-border shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base">Track New Job Application</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Company Name *</label>
                <input
                  type="text"
                  value={newJobCompany}
                  onChange={(e) => setNewJobCompany(e.target.value)}
                  placeholder="e.g. Google or Atlassian"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-input bg-background"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Job Title / Role *</label>
                <input
                  type="text"
                  value={newJobRole}
                  onChange={(e) => setNewJobRole(e.target.value)}
                  placeholder="e.g. Full-Stack Engineer"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-input bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Status</label>
                  <select
                    value={newJobStatus}
                    onChange={(e) => setNewJobStatus(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-input bg-background"
                  >
                    <option value="wishlist">Wishlist</option>
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offer">Offer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={newJobLocation}
                    onChange={(e) => setNewJobLocation(e.target.value)}
                    placeholder="Remote / Bengaluru"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-input bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Interview Notes / Salary</label>
                <textarea
                  rows={2}
                  value={newJobNotes}
                  onChange={(e) => setNewJobNotes(e.target.value)}
                  placeholder="e.g. Applied via referral, round 1 technical interview..."
                  className="w-full text-xs p-2 rounded-xl border border-input bg-background resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setJobModalOpen(false)}
                className="text-xs px-4 py-2 rounded-lg border border-border hover:bg-secondary text-muted-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateJobApp}
                disabled={!newJobCompany || !newJobRole}
                className="text-xs px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-40"
              >
                Save Application
              </button>
            </div>
          </div>
        </div>
      )}

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
