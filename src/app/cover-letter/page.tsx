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
  Save,
  Printer,
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <span className="text-xs font-medium text-primary">Cover Letter Studio</span>
            <h1 className="text-2xl md:text-3xl font-medium tracking-[-0.015em] text-foreground">
              Cover letter builder
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground max-w-xl">
              Pull skills from your active resume, adjust tone, and print or save your letter.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-border bg-card text-xs font-medium hover:bg-secondary transition-colors duration-150"
            >
              <Printer className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-95 active:scale-[0.98] transition-[transform,opacity] duration-150"
            >
              <Save className="w-4 h-4" strokeWidth={1.5} />
              <span>{saveSuccess ? "Saved" : "Save letter"}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form (5 cols) */}
          <div className="lg:col-span-5 rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-medium text-sm text-foreground">Role and applicant details</h3>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Company name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Stripe"
                className="w-full h-9 text-xs px-3 rounded-lg border border-input bg-background outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Target position</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Senior Frontend Engineer"
                className="w-full h-9 text-xs px-3 rounded-lg border border-input bg-background outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Applicant name</label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full h-9 text-xs px-3 rounded-lg border border-input bg-background outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Tone</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["professional", "confident", "enthusiastic", "concise"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`text-xs h-8 rounded-lg border capitalize transition-colors duration-150 ${
                      tone === t
                        ? "bg-primary text-primary-foreground font-medium border-primary"
                        : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Job description notes</label>
              <textarea
                rows={3}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste key responsibilities or requirements"
                className="w-full text-xs p-2.5 rounded-lg border border-input bg-background resize-none outline-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 h-9 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:opacity-95 active:scale-[0.98] transition-[transform,opacity] duration-150"
            >
              <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>{isGenerating ? "Drafting..." : "Generate draft"}</span>
            </button>
          </div>

          {/* Live Document Canvas (7 cols) */}
          <div className="lg:col-span-7 bg-secondary/40 p-4 sm:p-8 rounded-xl border border-border flex justify-center">
            <div className="resume-paper w-[210mm] max-w-full min-h-[297mm] bg-white text-zinc-900 shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-8 sm:p-12 font-sans text-xs space-y-6">
              <div className="border-b border-zinc-200 pb-4 flex justify-between items-end">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-zinc-900">{applicantName || "Your Full Name"}</h2>
                  <p className="text-xs text-zinc-600 font-medium">{applicantTitle || "Professional Title"}</p>
                </div>
                <div className="text-right text-[11px] text-zinc-500 font-mono tabular-nums">
                  {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </div>
              </div>

              <div className="text-xs text-zinc-700 space-y-0.5">
                <div className="font-semibold text-zinc-900">Hiring Team</div>
                <div>{companyName || "Company Name"}</div>
                {companyAddress && <div>{companyAddress}</div>}
              </div>

              <div>
                <textarea
                  rows={16}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Your cover letter draft appears here, or you can write directly."
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="text-xs text-muted-foreground">Loading cover letter studio...</div></div>}>
      <CoverLetterContent />
    </Suspense>
  );
}
