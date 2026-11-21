import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
        <h1 className="text-3xl font-extrabold text-foreground">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground">Effective Date: March 2026</p>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">1. Commitment to Data Privacy</h2>
          <p>
            At CVNest, we believe your resume, employment history, and personal contact details belong strictly to you. We do not sell or monetize candidate data to third-party data brokers or recruitment spam networks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">2. Information We Process</h2>
          <p>
            We process information you explicitly provide, including full name, contact information, education, work history, projects, and skills. When using AI writing features, prompts are passed via encrypted server channels solely to process and generate requested suggestions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">3. Local Storage & Client Encryption</h2>
          <p>
            By default in local mode, resume drafts remain directly in your browser's encrypted local storage. When synchronized with Supabase, records are isolated through strict database Row Level Security (RLS) policies tied solely to your user account.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">4. Data Deletion & Portability</h2>
          <p>
            You may export your complete resume profile as structured JSON or delete your data permanently at any time directly through the Account Settings page.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
