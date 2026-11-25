"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ResumeRenderer } from "@/components/resume-preview/ResumeRenderer";
import { TemplateThumbnail } from "@/components/templates/TemplateThumbnail";
import { SAMPLE_FRESHER_RESUME, SAMPLE_EXPERIENCED_RESUME } from "@/constants/sample-resumes";
import { RESUME_TEMPLATES } from "@/constants/templates";
import {
  ArrowRight,
  ShieldCheck,
  Check,
  FileText,
  GraduationCap,
  Sparkles,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const [activePreviewType, setActivePreviewType] = useState<"fresher" | "experienced">("fresher");

  const previewResume =
    activePreviewType === "fresher" ? SAMPLE_FRESHER_RESUME : SAMPLE_EXPERIENCED_RESUME;

  const faqs = [
    {
      q: "How does CVNest keep resumes readable for ATS scanners?",
      a: "Our ATS templates use single-column HTML hierarchies with standard section headings (Experience, Education, Skills) and zero floating graphics. Automated parsers such as Workday and Taleo read the text cleanly.",
    },
    {
      q: "What is Fresher and Student Mode?",
      a: "A dedicated layout flow for engineering and college students. It places education, branch, and CGPA at the top, with dedicated sections for hackathons, coding profiles, and academic projects.",
    },
    {
      q: "Can I export my resume as a PDF?",
      a: "Yes. CVNest exports clean A4 and US Letter PDFs directly from your browser with no watermarks.",
    },
    {
      q: "Can I switch templates without losing entered data?",
      a: "Yes. Resume content is stored independently of styling, so you can switch between any of the 20 templates without re-entering your information.",
    },
    {
      q: "How does the writing assistant improve bullet points?",
      a: "It rewrites rough task notes into concise accomplishment statements with clear action verbs based only on the details you provide.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/15">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="pt-12 md:pt-24 pb-16 md:pb-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy & Actions */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-medium tracking-[-0.025em] text-foreground leading-[1.06]">
                Build an ATS-ready resume that reads like your best work
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                Write, format, and check your resume against real job descriptions in one editor. Built for college freshers, engineers, and experienced professionals.
              </p>

              {/* One Primary + One Secondary Action */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/builder"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-95 active:scale-[0.98] transition-[transform,opacity] duration-150"
                >
                  <span>Create my resume</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </Link>

                <Link
                  href="/templates"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-border bg-card hover:bg-secondary font-medium text-sm text-foreground transition-colors duration-150"
                >
                  <span>Explore templates</span>
                </Link>
              </div>

              {/* Quiet Meta Specs */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground font-mono tabular-nums">
                <span>20 Templates</span>
                <span>A4 / US Letter PDF</span>
                <span>0–100 ATS Diagnostic</span>
              </div>
            </div>

            {/* Right Product Moment: Live Resume Sheet */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-secondary border border-border mb-4 text-xs font-medium">
                <button
                  onClick={() => setActivePreviewType("fresher")}
                  className={`px-3 py-1.5 rounded-md transition-colors duration-150 ${
                    activePreviewType === "fresher"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  BTech Fresher
                </button>
                <button
                  onClick={() => setActivePreviewType("experienced")}
                  className={`px-3 py-1.5 rounded-md transition-colors duration-150 ${
                    activePreviewType === "experienced"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Senior Engineer
                </button>
              </div>

              <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] relative overflow-hidden">
                <div className="scale-[0.58] sm:scale-[0.68] md:scale-[0.72] origin-top max-h-[480px] overflow-hidden rounded-lg pointer-events-none">
                  <ResumeRenderer resume={previewResume} />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card via-card/90 to-transparent flex items-end justify-center p-4">
                  <Link
                    href={`/builder?sample=${activePreviewType}`}
                    className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-95 active:scale-[0.98] transition-[transform,opacity] duration-150"
                  >
                    <span>Edit this sample</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMPATIBILITY STRIP */}
      <section className="py-8 border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Formatted for standard parsing across</span>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 font-mono text-xs">
            <span>Workday</span>
            <span>Taleo</span>
            <span>Greenhouse</span>
            <span>Lever</span>
            <span>Campus Portals</span>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-2 mb-12">
            <span className="text-xs font-medium text-primary">Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.015em] text-foreground">
              From blank page to formatted PDF in three steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
              <span className="inline-block text-xs font-mono text-muted-foreground tabular-nums">01</span>
              <h3 className="font-medium text-base text-foreground">Enter your details</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Add education, experience, internships, projects, and skills in a structured section editor with autosave.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
              <span className="inline-block text-xs font-mono text-muted-foreground tabular-nums">02</span>
              <h3 className="font-medium text-base text-foreground">Pick a template</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Switch between 20 layouts, adjust accent color, font family, and margins while preserving every word.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
              <span className="inline-block text-xs font-mono text-muted-foreground tabular-nums">03</span>
              <h3 className="font-medium text-base text-foreground">Export and apply</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Download an A4 or US Letter PDF, run an ATS check, or publish a shareable resume link.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TEMPLATE GALLERY HIGHLIGHT (Real Miniature Thumbnails) */}
      <section className="py-16 md:py-24 border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="space-y-2">
              <span className="text-xs font-medium text-primary">Templates</span>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.015em] text-foreground">
                20 layouts built for distinct roles
              </h2>
              <p className="text-sm text-muted-foreground max-w-lg">
                Single-column ATS layouts, two-column modern sheets, creative sidebars, and student fresher formats.
              </p>
            </div>

            <Link
              href="/templates"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <span>Browse all 20 templates</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {["classic-ats", "modern-professional", "creative-designer", "btech-fresher"]
              .map((id) => RESUME_TEMPLATES.find((t) => t.id === id)!)
              .filter(Boolean)
              .map((tmpl) => (
              <div
                key={tmpl.id}
                className="rounded-xl border border-border bg-background p-4 space-y-4 flex flex-col justify-between hover:border-foreground/25 transition-colors duration-150"
              >
                <div className="max-w-[190px] mx-auto w-full shadow-sm rounded-lg overflow-hidden">
                  <TemplateThumbnail template={tmpl} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-medium text-sm text-foreground">{tmpl.name}</h4>
                    <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
                      {tmpl.atsScore || 96}% ATS
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>
                <Link
                  href={`/builder?template=${tmpl.id}`}
                  className="flex items-center justify-center h-9 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-medium text-foreground transition-colors duration-150"
                >
                  Use template
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WRITING & MATCHING TOOLS */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-2 mb-12">
            <span className="text-xs font-medium text-primary">Editing tools</span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.015em] text-foreground">
              Targeted assistance where wording matters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-border bg-card space-y-3">
              <Sparkles className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              <h3 className="font-medium text-base text-foreground">Summary generator</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Drafts three concise summary options from your actual role and skill list without inventing credentials.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card space-y-3">
              <Zap className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              <h3 className="font-medium text-base text-foreground">Bullet point improver</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Rewrites plain task notes into active, result-oriented statements ready for technical screening.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card space-y-3">
              <FileText className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              <h3 className="font-medium text-base text-foreground">Cover letter studio</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pairs your resume projects with a target job description to produce an editable letter you can print or save.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FRESHER & STUDENT MODE */}
      <section className="py-16 md:py-24 border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-primary">
                <GraduationCap className="w-4 h-4" strokeWidth={1.5} />
                <span>Student and Fresher Mode</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.015em] text-foreground">
                Structured for BTech, CS graduates, and internship applicants
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                When you have limited full-time work history, standard corporate templates leave empty space. Fresher Mode prioritizes academics, projects, and technical competitions.
              </p>

              <ul className="space-y-2.5 text-sm text-foreground">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
                  <span>Education, branch, and CGPA placed at the top</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
                  <span>Dedicated sections for hackathons and coding contests</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
                  <span>Direct fields for GitHub, live demos, and LeetCode profiles</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  href="/builder?mode=fresher"
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-95 active:scale-[0.98] transition-[transform,opacity] duration-150"
                >
                  <span>Open Fresher Mode</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-xl border border-border bg-background p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-medium text-muted-foreground">Sample fresher profile</span>
                <span className="text-xs font-mono text-foreground tabular-nums">BTech CS · 2026</span>
              </div>
              <div>
                <h4 className="font-medium text-base text-foreground">Rohan Sharma</h4>
                <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
                  Vellore Institute of Technology · 8.92 / 10.0 CGPA
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3 text-xs">
                  <span className="bg-secondary px-2 py-0.5 rounded text-foreground">LeetCode 1890+</span>
                  <span className="bg-secondary px-2 py-0.5 rounded text-foreground">Smart India Hackathon</span>
                  <span className="bg-secondary px-2 py-0.5 rounded text-foreground">Next.js / PostgreSQL</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
                Included as a one-click starter template in the editor so students can replace sample entries with their own coursework and projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ATS CHECKER CALLOUT */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-medium text-primary">ATS Diagnostic</span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.015em] text-foreground">
              Check structure, contact completeness, and keyword coverage
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Inspect a 0–100 breakdown with direct links back to any section that needs work before you submit an application.
            </p>
          </div>
          <Link
            href="/ats-checker"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-lg border border-border bg-card hover:bg-secondary font-medium text-sm text-foreground transition-colors duration-150 flex-shrink-0"
          >
            <ShieldCheck className="w-4 h-4 text-primary" strokeWidth={1.5} />
            <span>Run ATS check</span>
          </Link>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-16 md:py-24 border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-medium text-primary">FAQ</span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.015em] text-foreground">
              Common questions
            </h2>
          </div>

          <div className="divide-y divide-border border-t border-b border-border">
            {faqs.map((faq, i) => (
              <div key={i} className="py-5 space-y-1.5">
                <h3 className="font-medium text-sm text-foreground">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-[-0.02em] text-foreground">
            Start drafting your next resume
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Open the editor, pick a layout, and export your PDF when it is ready.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/builder"
              className="inline-flex items-center justify-center h-11 px-7 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-95 active:scale-[0.98] transition-[transform,opacity] duration-150"
            >
              Open resume builder
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
