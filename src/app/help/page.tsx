import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HelpCircle, ChevronDown } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    {
      q: "How does RESUMIFY guarantee ATS readability?",
      a: "Our ATS-friendly templates use clean, single-column hierarchical HTML elements without nested tables, floating graphics, or complex headers that trip up standard ATS parsers like Workday and Taleo.",
    },
    {
      q: "What makes Fresher Mode special for Indian BTech & CS students?",
      a: "Fresher Mode prioritizes education, Branch, and CGPA at the very top. It provides dedicated fields for Smart India Hackathons, LeetCode profile links, MERN/Full-stack academic projects, and coursework modules.",
    },
    {
      q: "Can I download my resume as a PDF for free?",
      a: "Yes! High-resolution vector-like A4 and US Letter PDF downloads are 100% functional with zero watermarks.",
    },
    {
      q: "How do I create targeted versions for different job applications?",
      a: "Click 'Duplicate' on any resume in your dashboard or use the Job Description Matcher. It creates an independent copy that you can tailor specifically for that role without altering your base resume.",
    },
    {
      q: "What if I don't have a Gemini API key configured?",
      a: "RESUMIFY includes a smart rule-based contextual generator that automatically crafts high-impact summaries and action-verb bullet points so you're never blocked.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Help & Knowledge Center</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Everything you need to know about building winning resumes with RESUMIFY.</p>
        </div>

        <div className="space-y-4 pt-6">
          {faqs.map((faq, i) => (
            <div key={i} className="p-5 rounded-2xl border border-border bg-card space-y-2">
              <h3 className="text-sm font-bold text-foreground">{faq.q}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
