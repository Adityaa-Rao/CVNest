import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
        <h1 className="text-3xl font-extrabold text-foreground">Terms of Service</h1>
        <p className="text-xs text-muted-foreground">Effective Date: March 2026</p>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the CVNest SaaS platform, you agree to comply with and be bound by these Terms of Service. If you do not agree, you must discontinue platform usage.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">2. User Responsibility & Accurate Credentials</h2>
          <p>
            Users are responsible for ensuring all credentials, degrees, CGPAs, employment tenure, and project achievements entered into CVNest represent truthful, authentic information. CVNest's AI assistants provide stylistic and grammatical enhancements and do not fabricate facts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">3. ATS Scores & Employment Outcomes</h2>
          <p>
            ATS compatibility scores and keyword matching percentages reflect algorithmic formatting checks. CVNest does not promise, warrant, or guarantee interview invitations, offers, or employment placement.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
