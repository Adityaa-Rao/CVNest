"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ResumeRenderer } from "@/components/resume-preview/ResumeRenderer";
import { SAMPLE_FRESHER_RESUME, SAMPLE_EXPERIENCED_RESUME } from "@/constants/sample-resumes";
import { RESUME_TEMPLATES } from "@/constants/templates";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  ChevronRight,
  GraduationCap,
  Layers,
  Code2,
  Trophy,
  Zap,
  Star,
  Check,
  Download,
  Flame,
  Layout,
} from "lucide-react";

export default function LandingPage() {
  const [activePreviewType, setActivePreviewType] = useState<"fresher" | "experienced">("fresher");

  const previewResume =
    activePreviewType === "fresher" ? SAMPLE_FRESHER_RESUME : SAMPLE_EXPERIENCED_RESUME;

  const faqs = [
    {
      q: "How does CVNest guarantee my resume passes ATS scanners?",
      a: "Our ATS templates are designed to follow clean single-column hierarchies with standard section tags (Experience, Education, Skills) and zero unparseable graphical artifacts. This gives automated scanners like Workday and Taleo a frictionless 100% text read.",
    },
    {
      q: "What is Fresher & Student Mode?",
      a: "A dedicated workflow tailored for Indian and global engineering students. It puts education, Branch, and CGPA front-and-center, with specialized inputs for Smart India Hackathons, LeetCode ratings, campus mentorship, and academic projects.",
    },
    {
      q: "Can I download my resume as a real PDF?",
      a: "Yes. CVNest generates crystal-clear A4 and US Letter vector-like PDFs directly from your browser with zero ugly watermarks or clipped margins.",
    },
    {
      q: "Can I switch templates without losing entered data?",
      a: "Absolutely. All resume information is stored independently of visual styling. You can switch between any of our 20+ templates instantly with one click.",
    },
    {
      q: "How does the AI assistant improve my descriptions?",
      a: "Our AI assistant converts simple task descriptions into quantified accomplishment statements using powerful action verbs (e.g., 'Architected', 'Engineered', 'Optimized') without fabricating false facts.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 md:pb-24 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-500/20 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen AI Resume Builder for 2026</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
                Your Next Opportunity Starts With a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500">
                  Better Resume.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                Create professional, ATS-friendly resumes in minutes. Choose from beautiful templates, improve your content with AI, and stand out in every job application.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/builder"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-95 shadow-md shadow-indigo-500/20 active:scale-98 transition-all"
                >
                  <span>Create My Resume</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/templates"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-card hover:bg-secondary font-semibold text-sm text-foreground transition-all"
                >
                  <span>Explore Templates (20+)</span>
                </Link>

                <Link
                  href="/builder?mode=fresher"
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-semibold text-xs hover:bg-cyan-500/20 transition-all"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Fresher BTech Mode</span>
                </Link>
              </div>

              {/* Feature Micro-Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free to Start
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% ATS Compliant
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Vector PDF Downloads
                </span>
              </div>
            </div>

            {/* Right Interactive Resume Visual Showcase */}
            <div className="lg:col-span-6 flex flex-col items-center">
              {/* Profile Toggle Pill */}
              <div className="flex items-center gap-2 p-1 rounded-xl bg-secondary border border-border mb-4 text-xs font-semibold">
                <button
                  onClick={() => setActivePreviewType("fresher")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activePreviewType === "fresher" ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground"
                  }`}
                >
                  🎓 BTech Fresher Profile
                </button>
                <button
                  onClick={() => setActivePreviewType("experienced")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activePreviewType === "experienced" ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground"
                  }`}
                >
                  💼 Senior Engineer Profile
                </button>
              </div>

              <div className="w-full max-w-lg rounded-2xl border border-border bg-card/60 p-4 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
                <div className="scale-[0.58] sm:scale-[0.68] md:scale-[0.72] origin-top max-h-[500px] overflow-hidden rounded-lg pointer-events-none transition-transform group-hover:scale-[0.70] sm:group-hover:scale-[0.75]">
                  <ResumeRenderer resume={previewResume} />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card via-card/80 to-transparent flex items-end justify-center p-4">
                  <Link
                    href={`/builder?sample=${activePreviewType}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-lg hover:opacity-95"
                  >
                    <span>Customize This Resume</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUSTED-BY / TECHNICAL EXCELLENCE */}
      <section className="py-10 border-b border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Built for modern engineering standards, campus recruitment & global hiring platforms
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 text-sm font-bold text-muted-foreground/80">
            <span>Workday ATS Tested</span>
            <span>Taleo Compatible</span>
            <span>Greenhouse Ready</span>
            <span>Campus Placement Approved</span>
            <span>LeetCode & GitHub Integrated</span>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Effortless Workflow</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">How CVNest Works</h2>
            <p className="text-sm text-muted-foreground">From blank canvas to an interview-ready resume in three seamless steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-base border border-indigo-500/20">
                1
              </div>
              <h3 className="font-bold text-lg text-foreground">Enter Your Details</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Fill in your education, technical skills, internships, and hackathons using our dynamic form editor with inline suggestions.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-base border border-sky-500/20">
                2
              </div>
              <h3 className="font-bold text-lg text-foreground">Choose Your Template</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Select from 20+ professionally styled templates. Personalize accent colors, font families, and section orders instantly.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base border border-emerald-500/20">
                3
              </div>
              <h3 className="font-bold text-lg text-foreground">Download Your Resume</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Export crisp, vector-standard A4 or Letter PDFs, share your live portfolio link, or check your score with our ATS engine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TEMPLATE GALLERY HIGHLIGHT */}
      <section className="py-16 md:py-24 border-b border-border bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Original Designs</span>
              <h2 className="text-3xl font-extrabold tracking-tight mt-1">20+ Tailored Templates</h2>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-lg">
                Not just 20 color variations. Genuinely distinct layouts for corporate, technical, creative, and campus hiring.
              </p>
            </div>

            <Link
              href="/templates"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <span>View All 20 Templates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RESUME_TEMPLATES.slice(0, 4).map((tmpl) => (
              <div key={tmpl.id} className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs hover:border-primary/50 transition-all">
                <div className={`h-36 rounded-xl ${tmpl.thumbnail} border flex items-center justify-center p-3 text-center`}>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-background text-foreground shadow-xs">
                    {tmpl.name}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{tmpl.name}</h4>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{tmpl.description}</p>
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
        </div>
      </section>

      {/* 5. AI-POWERED FEATURES */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">AI Career Acceleration</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">AI Written Specifically For Your Career</h2>
            <p className="text-sm text-muted-foreground">Never struggle with blank summaries or passive bullet points again.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">AI Professional Summary</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Generates 3 tone-controlled summary variations tailored for freshers or experienced engineers without inventing fake companies.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Bullet Point Impact Improver</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Transforms "worked on backend" into "Architected resilient REST microservices in Node.js, boosting query throughput by 35%."
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Tailored AI Cover Letters</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Automatically matches your actual resume projects against any pasted job posting to generate an articulate cover letter in 1 click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FRESHER RESUME SHOWCASE */}
      <section className="py-16 md:py-24 border-b border-border bg-cyan-950/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold border border-cyan-500/20">
                <GraduationCap className="w-4 h-4" /> Fresher & College Student Specialization
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                No Work Experience? Land Your Dream Job or Internship.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Traditional resume builders are built for people with 10 years of corporate history. CVNest includes specialized templates and sections designed specifically for BTech, Computer Science, and Engineering students.
              </p>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                  <span>Highlight CGPA, Branch, and Coursework prominently at the top</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                  <span>Dedicated fields for Smart India Hackathons and coding contest ranks</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                  <span>Showcase LeetCode / CodeChef ratings, GitHub repositories, and live demo links</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/builder?mode=fresher"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-600 text-white font-semibold text-xs hover:bg-cyan-700 shadow-md transition-all"
                >
                  <span>Build a Fresher Resume</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl border border-cyan-500/30 bg-card p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="font-bold text-xs uppercase text-cyan-600 dark:text-cyan-400">Featured Sample Profile</span>
                <span className="text-[10px] font-mono bg-cyan-500/10 px-2 py-0.5 rounded text-cyan-600">BTech CS 2026</span>
              </div>
              <div>
                <h4 className="font-bold text-base text-foreground">Rohan Sharma</h4>
                <p className="text-xs text-muted-foreground">Final Year BTech Computer Science · CGPA: 8.92/10</p>
                <div className="flex flex-wrap gap-1.5 mt-2 text-[10px]">
                  <span className="bg-secondary px-2 py-0.5 rounded">LeetCode Knight (1890+)</span>
                  <span className="bg-secondary px-2 py-0.5 rounded">Smart India Hackathon Finalist</span>
                  <span className="bg-secondary px-2 py-0.5 rounded">Full-Stack MERN / Next.js</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed italic bg-secondary/30 p-3 rounded-lg">
                "Demonstrates how engineering students with zero full-time corporate experience can create an irresistible, competitive resume that clears campus placement screening."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ATS RESUME CHECKER DEMO */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Pre-Flight Diagnostic</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Built-in ATS Resume Checker</h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Diagnose formatting vulnerabilities, keyword density, and contact errors before sending applications.
          </p>
          <div className="pt-4">
            <Link
              href="/ats-checker"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-95 shadow"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Try the Free ATS Checker</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="py-16 md:py-24 border-b border-border bg-secondary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Got Questions?</span>
            <h2 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-xs">
                <h3 className="font-bold text-sm text-foreground">{faq.q}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="py-20 md:py-28 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Build Your Winning Resume?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Join thousands of college graduates, software engineers, and ambitious professionals who build clean, ATS-verified resumes with CVNest.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/builder"
              className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-95 shadow-lg shadow-indigo-500/20 active:scale-98 transition-all"
            >
              Start Building Now — Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
