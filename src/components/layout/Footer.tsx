import React from "react";
import Link from "next/link";
import { FileText, Github, Linkedin, Twitter } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card text-muted-foreground text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-foreground text-background flex items-center justify-center">
                <FileText className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <span className="font-semibold text-base text-foreground tracking-tight">CVNest</span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed max-w-sm text-muted-foreground">
              Resume editor, ATS diagnostic, and template studio built for college students, BTech freshers, and software engineers.
            </p>
            <div className="flex items-center gap-3 mt-4 text-muted-foreground">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="hover:text-foreground transition-colors duration-150"
              >
                <Github className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="hover:text-foreground transition-colors duration-150"
              >
                <Linkedin className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="hover:text-foreground transition-colors duration-150"
              >
                <Twitter className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-medium text-foreground text-xs mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/builder" className="hover:text-foreground transition-colors duration-150">Resume builder</Link></li>
              <li><Link href="/templates" className="hover:text-foreground transition-colors duration-150">Templates</Link></li>
              <li><Link href="/ats-checker" className="hover:text-foreground transition-colors duration-150">ATS checker</Link></li>
              <li><Link href="/job-matcher" className="hover:text-foreground transition-colors duration-150">Job matcher</Link></li>
              <li><Link href="/cover-letter" className="hover:text-foreground transition-colors duration-150">Cover letter</Link></li>
              <li><Link href="/builder?mode=fresher" className="hover:text-foreground transition-colors duration-150">Fresher mode</Link></li>
            </ul>
          </div>

          {/* Roles */}
          <div>
            <h4 className="font-medium text-foreground text-xs mb-3">Built for</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/builder?mode=fresher" className="hover:text-foreground transition-colors duration-150">BTech and CS students</Link></li>
              <li><Link href="/templates" className="hover:text-foreground transition-colors duration-150">Software developers</Link></li>
              <li><Link href="/templates" className="hover:text-foreground transition-colors duration-150">UI/UX designers</Link></li>
              <li><Link href="/templates" className="hover:text-foreground transition-colors duration-150">Data analysts</Link></li>
              <li><Link href="/templates" className="hover:text-foreground transition-colors duration-150">Internship applicants</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors duration-150">Resume versions</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-medium text-foreground text-xs mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/pricing" className="hover:text-foreground transition-colors duration-150">Pricing</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors duration-150">Privacy policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors duration-150">Terms and conditions</Link></li>
              <li><Link href="/help" className="hover:text-foreground transition-colors duration-150">Help center</Link></li>
              <li><Link href="/settings" className="hover:text-foreground transition-colors duration-150">Account settings</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} CVNest. All rights reserved.</p>
          <p className="text-muted-foreground font-mono text-[11px] tabular-nums">
            A4 / US Letter · ATS Verified
          </p>
        </div>
      </div>
    </footer>
  );
};
