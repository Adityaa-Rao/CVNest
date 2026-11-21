import React from "react";
import Link from "next/link";
import { FileText, Github, Linkedin, Twitter, Sparkles, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card/60 text-muted-foreground text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-foreground tracking-tight">CVNest</span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed max-w-sm">
              The AI-powered resume and career platform engineered for college students, BTech freshers, software engineers, and ambitious professionals worldwide.
            </p>
            <div className="flex items-center gap-3 mt-4 text-muted-foreground">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column: Product */}
          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/builder" className="hover:text-foreground">Resume Builder</Link></li>
              <li><Link href="/templates" className="hover:text-foreground">20+ Templates</Link></li>
              <li><Link href="/ats-checker" className="hover:text-foreground">ATS Resume Checker</Link></li>
              <li><Link href="/job-matcher" className="hover:text-foreground">Job Matcher</Link></li>
              <li><Link href="/cover-letter" className="hover:text-foreground">AI Cover Letter</Link></li>
              <li><Link href="/builder?mode=fresher" className="hover:text-foreground text-cyan-600 dark:text-cyan-400 font-medium">BTech & Fresher Mode</Link></li>
            </ul>
          </div>

          {/* Column: Target Roles */}
          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">Roles & Fresher</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/builder?mode=fresher" className="hover:text-foreground">BTech & CS Students</Link></li>
              <li><Link href="/templates" className="hover:text-foreground">Software Developers</Link></li>
              <li><Link href="/templates" className="hover:text-foreground">UI/UX Designers</Link></li>
              <li><Link href="/templates" className="hover:text-foreground">Data Analysts</Link></li>
              <li><Link href="/templates" className="hover:text-foreground">Internship Applicants</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground">Multi-Version Resumes</Link></li>
            </ul>
          </div>

          {/* Column: Legal & Support */}
          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/pricing" className="hover:text-foreground">Pricing Plans</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms & Conditions</Link></li>
              <li><Link href="/help" className="hover:text-foreground">Help Center & FAQ</Link></li>
              <li><Link href="/settings" className="hover:text-foreground">Account Settings</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} CVNest Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 text-muted-foreground">
            Crafted for job seekers with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> & AI precision.
          </p>
        </div>
      </div>
    </footer>
  );
};
