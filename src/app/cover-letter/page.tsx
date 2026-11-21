"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CoverLetterData } from "@/types/resume";
import { getStoredResumes, saveCoverLetter, getStoredCoverLetters } from "@/lib/storage";
import { generateCoverLetter } from "@/lib/ai/gemini";
import { generateId } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Sparkles,
  Download,
  Save,
  Printer,
  CheckCircle2,
  FileText,
  Building,
  Briefcase,
} from "lucide-react";

function CoverLetterContent() {
  const searchParams = useSearchParams();
  const coverLetterId = searchParams.get("id");

  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [applicantTitle, setApplicantTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState<"professional" | "confident" | "enthusiastic" | "concise">("professional");
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const stored = getStoredResumes();
    setResumes(stored);

    if (coverLetterId) {
      const cls = getStoredCoverLetters();
      const found = cls.find((c) => c.id === coverLetterId);
      if (found) {
        setApplicantName(found.title);
        setCompanyName(found.companyName);
        setCompanyAddress(found.companyAddress);
        setJobTitle(found.jobTitle);
        setContent(found.content);
        setTone(found.tone);
        return;
      }
    }

    if (stored.length > 0) {
      const base = stored[0];
      setSelectedResumeId(base.id);
      setApplicantName(base.personalInfo?.fullName || "Alex Morgan");
      setApplicantTitle(base.personalInfo?.title || "Software Engineer");
    }
  }, [coverLetterId]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const baseResume = resumes.find((r) => r.id === selectedResumeId);
      const skills = baseResume?.skills?.flatMap((c: any) => c.skills.map((s: any) => s.name)) || ["Software Engineering", "Full-Stack Development"];

      const letterText = await generateCoverLetter({
        applicantName,
        applicantTitle,
        jobTitle: jobTitle || "Software Engineer",
        companyName: companyName || "Acme Corp",
        jobDescription,
        keySkills: skills,
        tone,
      });

      setContent(letterText);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    const newCoverLetter: CoverLetterData = {
      id: coverLetterId || generateId(),
      title: `${companyName || "Company"} Cover Letter`,
      recipientName: "Hiring Manager",
      recipientTitle: "Talent Acquisition Team",
      companyName,
      companyAddress,
      jobTitle,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      content,
      tone,
      resumeId: selectedResumeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveCoverLetter(newCoverLetter);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> AI Cover Letter Studio
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Create Tailored, High-Impact Cover Letters
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-xl">
              Sync credentials from your resume, match company requirements, and generate an articulate cover letter in seconds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-xs font-semibold hover:bg-secondary"
            >
              <Printer className="w-4 h-4 text-muted-foreground" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 shadow-sm active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>{saveSuccess ? "Saved!" : "Save Letter"}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Studio: Form on Left, Live Document on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-foreground">Job & Applicant Details</h3>

            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">Company Name *</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Stripe or Google"
                className="w-full text-xs px-3 py-2 rounded-lg border border-input bg-background outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">Target Position *</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full text-xs px-3 py-2 rounded-lg border border-input bg-background outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">Applicant Name</label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-input bg-background outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">Tone</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["professional", "confident", "enthusiastic", "concise"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`text-[11px] py-1.5 rounded-lg border capitalize ${
                      tone === t ? "bg-primary text-primary-foreground font-semibold border-primary shadow-xs" : "border-border text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">Job Description Snippet</label>
              <textarea
                rows={3}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste key responsibilities or values mentioned in the posting..."
                className="w-full text-xs p-2.5 rounded-lg border border-input bg-background resize-none outline-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? "Writing Letter with AI..." : "Generate Cover Letter"}</span>
            </button>
          </div>

          {/* Live Document Canvas (7 cols) */}
          <div className="lg:col-span-7 bg-zinc-100 dark:bg-zinc-950/60 p-4 sm:p-8 rounded-2xl border border-border flex justify-center">
            <div className="resume-paper w-[210mm] max-w-full min-h-[297mm] bg-white text-zinc-900 shadow-xl p-8 sm:p-12 font-sans text-xs space-y-6">
              {/* Header */}
              <div className="border-b border-zinc-200 pb-4 flex justify-between items-end">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-zinc-900">{applicantName || "Your Full Name"}</h2>
                  <p className="text-xs text-zinc-600 font-medium">{applicantTitle || "Professional Title"}</p>
                </div>
                <div className="text-right text-[11px] text-zinc-500">
                  {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </div>
              </div>

              {/* Recipient */}
              <div className="text-xs text-zinc-700 space-y-0.5">
                <div className="font-semibold text-zinc-900">Hiring Team</div>
                <div>{companyName || "[Company Name]"}</div>
                {companyAddress && <div>{companyAddress}</div>}
              </div>

              {/* Editable Content */}
              <div>
                <textarea
                  rows={16}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Your generated cover letter will appear here, or you can write and edit directly..."
                  className="w-full text-xs text-zinc-800 leading-relaxed bg-transparent border-0 outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CoverLetterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="text-xs text-muted-foreground">Loading Cover Letter Studio...</div></div>}>
      <CoverLetterContent />
    </Suspense>
  );
}
