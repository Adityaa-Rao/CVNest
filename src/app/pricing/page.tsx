"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Check } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [demoSubscribed, setDemoSubscribed] = useState(false);

  const handleCheckout = (planName: string) => {
    setDemoSubscribed(true);
    setTimeout(() => {
      alert(`Activated ${planName} demo pass. Pro templates and tools are unlocked.`);
    }, 150);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-medium text-primary">Pricing</span>
          <h1 className="text-3xl md:text-4xl font-medium tracking-[-0.02em] text-foreground">
            Simple plans for students and professionals
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Start free with standard ATS templates and PDF export. Upgrade when you want all 20 layouts, AI writing tools, and unlimited versions.
          </p>

          <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-secondary border border-border mt-2">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 ${
                billingCycle === "monthly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 flex items-center gap-1.5 ${
                billingCycle === "yearly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Yearly</span>
              <span className="text-[11px] font-mono text-primary tabular-nums">-33%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-6 items-stretch">
          {/* Free Tier */}
          <div className="rounded-2xl border border-border bg-card p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-medium text-muted-foreground">Free</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-medium tabular-nums">₹0</span>
                <span className="text-xs text-muted-foreground">forever</span>
              </div>
              <p className="text-xs text-muted-foreground">
                For college students and job seekers creating their core resume.
              </p>

              <div className="pt-4 border-t border-border space-y-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
                  <span>Up to 2 saved resumes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
                  <span>Standard ATS-friendly templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
                  <span>A4 and US Letter PDF exports</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
                  <span>Basic ATS structure score</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/builder"
                className="w-full h-10 flex items-center justify-center rounded-lg border border-border hover:bg-secondary font-medium text-xs transition-colors duration-150"
              >
                Get started
              </Link>
            </div>
          </div>

          {/* Pro Tier */}
          <div className="rounded-2xl border border-primary bg-card p-8 flex flex-col justify-between relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-primary">Pro</span>
                <span className="text-[11px] font-mono text-muted-foreground">Recommended</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-medium tabular-nums">
                  {billingCycle === "yearly" ? "₹199" : "₹299"}
                </span>
                <span className="text-xs text-muted-foreground">/ month</span>
              </div>
              <p className="text-xs text-muted-foreground">
                For applicants tailoring versions across multiple roles and companies.
              </p>

              <div className="pt-4 border-t border-border space-y-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
                  <span className="font-medium">Unlimited resumes and tailored versions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
                  <span className="font-medium">All 20 templates across all categories</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
                  <span>Summary generator with tone control</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
                  <span>Bullet point improver with action verbs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
                  <span>Full ATS diagnostic and job description matcher</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
                  <span>Cover letter builder and shareable portfolio URLs</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleCheckout("Pro")}
                className="w-full h-10 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:opacity-95 active:scale-[0.98] transition-[transform,opacity] duration-150"
              >
                <span>{demoSubscribed ? "Pro plan active" : "Upgrade to Pro"}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground max-w-lg mx-auto">
          <p>
            Supports Razorpay (UPI, cards, netbanking) and Stripe for international billing. Demo mode is active locally when payment keys are unset.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
