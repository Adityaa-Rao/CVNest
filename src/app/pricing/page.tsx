"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Check, Sparkles, Shield, Zap, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [demoSubscribed, setDemoSubscribed] = useState(false);

  const handleCheckout = (planName: string) => {
    // Demo subscription toggle with clear notification
    setDemoSubscribed(true);
    setTimeout(() => {
      alert(`Success! You have activated the ${planName} demo pass. All pro features and templates are unlocked.`);
    }, 200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <CreditCard className="w-3.5 h-3.5" /> Simple, Transparent Pricing
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Invest in Your Career, Not Expensive Subscriptions
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Free forever for basic resumes. Upgrade to Pro for unlimited AI writing assistance, all 20+ templates, and deep ATS optimization.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-secondary border border-border mt-4">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                billingCycle === "monthly" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                billingCycle === "yearly" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
              }`}
            >
              <span>Yearly Billing</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-1.5 py-0.2 rounded-full">
                Save 40%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8 items-stretch">
          {/* Free Tier */}
          <div className="rounded-3xl border border-border bg-card p-8 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Free Starter</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">₹0</span>
                <span className="text-xs text-muted-foreground">/ forever</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Perfect for college students drafting their first resume or quick updates.
              </p>

              <div className="pt-4 border-t border-border space-y-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Up to 2 saved resumes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Standard ATS-friendly templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Unlimited A4 / Letter PDF exports</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Basic ATS structure score</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground/60">
                  <span className="w-4 text-center font-bold">✕</span>
                  <span>AI writing assistant & smart bullet improver</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/builder"
                className="w-full flex items-center justify-center py-2.5 rounded-xl border border-border hover:bg-secondary font-semibold text-xs transition-all"
              >
                Get Started Free
              </Link>
            </div>
          </div>

          {/* Pro Tier */}
          <div className="rounded-3xl border-2 border-primary bg-card p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-4 right-4 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground shadow">
              Most Popular
            </div>

            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Pro Unlimited</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">{billingCycle === "yearly" ? "₹199" : "₹299"}</span>
                <span className="text-xs text-muted-foreground">/ month</span>
              </div>
              <p className="text-xs text-muted-foreground">
                For job seekers, tech developers, and freshers who want the maximum interview callback rate.
              </p>

              <div className="pt-4 border-t border-border space-y-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="font-semibold">Unlimited resumes and targeted versions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="font-semibold">All 20+ templates (ATS, Modern, Creative, Fresher)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>AI Professional Summary generator (tone control)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>AI Bullet Point Improver with action verbs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Full ATS Diagnostic & Job Description Matcher</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>AI Cover Letter generator & custom portfolio URLs</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleCheckout("Pro Unlimited")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-95 shadow-md active:scale-98 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{demoSubscribed ? "Pro Plan Active" : "Upgrade to Pro"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Payment info notes */}
        <div className="text-center text-xs text-muted-foreground max-w-lg mx-auto">
          <p>
            Secure checkout via <strong>Razorpay</strong> (UPI, Cards, NetBanking for Indian users) and <strong>Stripe</strong> for international applicants. Cancel anytime.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
