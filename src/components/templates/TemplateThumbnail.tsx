"use client";

import React from "react";
import { TemplateMetadata } from "@/types/resume";

interface TemplateThumbnailProps {
  template: TemplateMetadata;
  accentColor?: string;
  className?: string;
}

export const TemplateThumbnail: React.FC<TemplateThumbnailProps> = ({
  template,
  accentColor,
  className = "",
}) => {
  const id = template.id;

  // Per-template signature accent if none supplied
  const defaultColors: Record<string, string> = {
    "classic-ats": "#18181b",
    "minimal-professional": "#155eef",
    "corporate-standard": "#1e293b",
    "modern-ats": "#0284c7",
    "executive-traditional": "#78350f",
    "modern-professional": "#4f46e5",
    "elegant-blue": "#2563eb",
    "contemporary-slate": "#334155",
    "minimal-clean": "#52525b",
    "executive-pro": "#059669",
    "creative-designer": "#7c3aed",
    "modern-sidebar": "#18181b",
    "portfolio-style": "#e11d48",
    "elegant-creative": "#ea580c",
    "visual-professional": "#0d9488",
    "college-graduate": "#2563eb",
    "btech-fresher": "#0284c7",
    "software-developer": "#0f172a",
    "internship-ready": "#6366f1",
    "academic-research": "#44403c",
  };

  const color = accentColor || defaultColors[id] || "#155eef";

  const isDarkSidebar = id === "modern-sidebar";
  const isLeftSidebar = id === "creative-designer";
  const isTwoColumn = id === "modern-professional" || id === "executive-pro";
  const isTimeline = id === "contemporary-slate";
  const isProjectGrid = id === "portfolio-style";
  const isCode = id === "software-developer";
  const isMinimalClean = id === "minimal-clean" || id === "minimal-professional";
  const isCorporate = id === "corporate-standard";
  const isExecutive = id === "executive-traditional";
  const isElegantBlue = id === "elegant-blue" || id === "visual-professional";
  const isModernAts = id === "modern-ats";
  const isBtech = id === "btech-fresher";
  const isCreativeSerif = id === "elegant-creative";
  const isSerif = id === "classic-ats" || isExecutive || isCreativeSerif || id === "academic-research";

  return (
    <div
      className={`w-full aspect-[210/297] bg-white text-zinc-900 rounded-lg shadow-sm border border-zinc-200/80 overflow-hidden relative select-none p-3 text-[6px] leading-tight flex flex-col justify-between ${className}`}
      style={{
        fontFamily: isCode ? "monospace" : isSerif ? "Georgia, serif" : "sans-serif",
      }}
    >
      {/* 1. LEFT SIDEBAR TEMPLATES (Creative Designer & Modern Sidebar) */}
      {(isLeftSidebar || isDarkSidebar) ? (
        <div className="flex h-full -m-3">
          <div
            className={`w-[35%] p-2 flex flex-col justify-between text-white`}
            style={{ backgroundColor: isDarkSidebar ? "#18181b" : color }}
          >
            <div>
              <div className="w-6 h-6 rounded-full mx-auto bg-white/20 border border-white/40 mb-1 flex items-center justify-center font-bold text-[7px]">
                AM
              </div>
              <div className="text-[7px] font-bold text-center leading-tight truncate">Alex Morgan</div>
              <div className="text-[4.5px] text-center opacity-80 truncate">Product Designer</div>

              <div className="mt-2.5 space-y-1 text-[4.5px] opacity-85">
                <div className="h-0.5 w-8 bg-white/30 rounded" />
                <div>alex@cvnest.io</div>
                <div>+1 555 019 2834</div>
                <div>San Francisco</div>
              </div>

              <div className="mt-2.5 space-y-1">
                <div className="text-[5px] font-bold uppercase opacity-75">Skills</div>
                <div className="flex flex-wrap gap-0.5">
                  {["Figma", "React", "UI/UX", "CSS"].map((s, i) => (
                    <span key={i} className="px-1 py-0.2 bg-white/20 rounded text-[4.5px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-[4px] opacity-60">Portfolio</div>
          </div>

          <div className="flex-1 p-2.5 space-y-2 bg-white">
            <div>
              <div className="text-[5.5px] font-bold border-b border-zinc-200 pb-0.5" style={{ color }}>
                PROFILE
              </div>
              <div className="h-1 w-full bg-zinc-200 rounded mt-1" />
              <div className="h-1 w-4/5 bg-zinc-200 rounded mt-0.5" />
            </div>

            <div>
              <div className="text-[5.5px] font-bold border-b border-zinc-200 pb-0.5" style={{ color }}>
                EXPERIENCE
              </div>
              <div className="mt-1 space-y-1">
                <div>
                  <div className="flex justify-between font-bold text-[5px] text-zinc-800">
                    <span>Lead Designer</span>
                    <span className="text-zinc-400">2023–Pres</span>
                  </div>
                  <div className="h-0.5 w-full bg-zinc-200 rounded mt-0.5" />
                  <div className="h-0.5 w-5/6 bg-zinc-200 rounded mt-0.5" />
                </div>
                <div>
                  <div className="flex justify-between font-bold text-[5px] text-zinc-800">
                    <span>UI Engineer</span>
                    <span className="text-zinc-400">2021–2023</span>
                  </div>
                  <div className="h-0.5 w-full bg-zinc-200 rounded mt-0.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : isTwoColumn ? (
        /* 2. TWO COLUMN BANNER (Modern Professional & Executive Pro) */
        <div className="flex flex-col h-full -m-3">
          <div className="p-2.5 text-white flex justify-between items-center" style={{ backgroundColor: color }}>
            <div>
              <div className="text-[8px] font-bold tracking-tight">Alex Morgan</div>
              <div className="text-[5px] opacity-90">Senior Systems Engineer</div>
            </div>
            <div className="text-[4.5px] text-right opacity-80">
              <div>alex@cvnest.io</div>
              <div>San Francisco</div>
            </div>
          </div>

          <div className="flex-1 p-2.5 grid grid-cols-12 gap-2 bg-white">
            <div className="col-span-8 space-y-1.5 border-r border-zinc-100 pr-1.5">
              <div className="text-[5.5px] font-bold uppercase" style={{ color }}>
                Experience
              </div>
              <div className="space-y-1">
                <div>
                  <div className="flex justify-between font-bold text-[5px] text-zinc-800">
                    <span>Staff Engineer</span>
                    <span className="text-zinc-400">2023–Pres</span>
                  </div>
                  <div className="h-0.5 w-full bg-zinc-200 rounded mt-0.5" />
                  <div className="h-0.5 w-4/5 bg-zinc-200 rounded mt-0.5" />
                </div>
                <div>
                  <div className="flex justify-between font-bold text-[5px] text-zinc-800">
                    <span>Systems Architect</span>
                    <span className="text-zinc-400">2020–2023</span>
                  </div>
                  <div className="h-0.5 w-11/12 bg-zinc-200 rounded mt-0.5" />
                </div>
              </div>
            </div>

            <div className="col-span-4 space-y-1.5">
              <div className="text-[5.5px] font-bold uppercase" style={{ color }}>
                Skills
              </div>
              <div className="flex flex-wrap gap-0.5">
                {["TS", "Go", "AWS", "K8s"].map((s, i) => (
                  <span key={i} className="px-1 py-0.2 bg-zinc-100 rounded text-[4.5px] text-zinc-700">
                    {s}
                  </span>
                ))}
              </div>
              <div className="text-[5.5px] font-bold uppercase pt-1" style={{ color }}>
                Education
              </div>
              <div className="text-[4.5px] text-zinc-600">BTech CS · 9.1</div>
            </div>
          </div>
        </div>
      ) : isProjectGrid ? (
        /* 3. PORTFOLIO STYLE (2x2 Project Showcase Cards) */
        <div className="space-y-1.5">
          <div className="border-b-2 pb-1 flex justify-between items-end" style={{ borderColor: color }}>
            <div>
              <div className="text-[8px] font-black">Alex Morgan</div>
              <div className="text-[4.5px] font-semibold text-zinc-500">FULL STACK & OPEN SOURCE</div>
            </div>
            <div className="text-[4.5px] font-bold" style={{ color }}>github.com/alex</div>
          </div>
          <div className="text-[5.5px] font-bold uppercase text-zinc-800">Featured Projects</div>
          <div className="grid grid-cols-2 gap-1">
            <div className="p-1 rounded border border-zinc-200 bg-zinc-50">
              <div className="font-bold text-[5px]">CampusConnect</div>
              <div className="text-[4px] text-zinc-500">Next.js · Prisma</div>
            </div>
            <div className="p-1 rounded border border-zinc-200 bg-zinc-50">
              <div className="font-bold text-[5px]">Algoverse</div>
              <div className="text-[4px] text-zinc-500">React · Canvas</div>
            </div>
          </div>
          <div className="text-[5.5px] font-bold uppercase text-zinc-800">Experience</div>
          <div className="h-0.5 w-full bg-zinc-200 rounded" />
          <div className="h-0.5 w-3/4 bg-zinc-200 rounded" />
        </div>
      ) : isTimeline ? (
        /* 4. CONTEMPORARY SLATE (Vertical Timeline Dots) */
        <div className="space-y-1.5">
          <div className="border-b pb-1 flex justify-between items-end">
            <div>
              <div className="text-[8px] font-bold text-slate-900">Alex Morgan</div>
              <div className="text-[5px] text-slate-500">Software Engineer</div>
            </div>
            <div className="text-[4.5px] text-slate-400">alex@cvnest.io</div>
          </div>
          <div className="text-[5.5px] font-bold uppercase text-slate-800">Experience Timeline</div>
          <div className="border-l-2 border-slate-200 ml-1 pl-2 space-y-1.5 relative">
            <div className="relative">
              <div className="absolute -left-[11px] top-0.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              <div className="font-bold text-[5px] text-slate-900">Lead Engineer · TechNova</div>
              <div className="h-0.5 w-full bg-slate-200 rounded mt-0.5" />
            </div>
            <div className="relative">
              <div className="absolute -left-[11px] top-0.5 w-1.5 h-1.5 rounded-full bg-slate-400" />
              <div className="font-bold text-[5px] text-slate-900">Full-Stack Dev · Atlassian</div>
              <div className="h-0.5 w-4/5 bg-slate-200 rounded mt-0.5" />
            </div>
          </div>
        </div>
      ) : isCode ? (
        /* 5. SOFTWARE DEVELOPER (Monospace Code Syntax) */
        <div className="space-y-1 font-mono text-[5.5px]">
          <div className="border-b-2 border-zinc-900 pb-1 flex justify-between items-baseline">
            <div className="font-bold text-[7px]">&lt;AlexMorgan /&gt;</div>
            <div className="text-[4.5px] text-blue-600">gh/alex</div>
          </div>
          <div className="text-[5px] font-bold text-zinc-800">const skills = &#123;</div>
          <div className="pl-1.5 text-[4.5px] text-zinc-600">
            <div>lang: ["TS", "Python", "C++"],</div>
            <div>web: ["Next.js", "React"]</div>
          </div>
          <div className="text-[5px] font-bold">&#125;;</div>
          <div className="p-1 rounded bg-zinc-50 border border-zinc-200 mt-1">
            <div className="font-bold text-[5px]">CampusConnect</div>
            <div className="text-[4px] text-zinc-500">[Next.js, PostgreSQL]</div>
          </div>
        </div>
      ) : isCorporate ? (
        /* 6. CORPORATE STANDARD (Left 4px Accent Bar + Shaded Section Bands) */
        <div className="space-y-1.5">
          <div className="border-l-4 pl-2 py-0.5" style={{ borderColor: color }}>
            <div className="text-[8px] font-bold text-zinc-900">Alex Morgan</div>
            <div className="text-[4.5px] uppercase tracking-wider text-zinc-500">Operations & Engineering</div>
          </div>
          <div className="bg-zinc-100 px-1.5 py-0.5 rounded text-[5px] font-bold uppercase text-zinc-800">
            Executive Summary
          </div>
          <div className="h-0.5 w-full bg-zinc-200 rounded" />
          <div className="h-0.5 w-4/5 bg-zinc-200 rounded" />
          <div className="bg-zinc-100 px-1.5 py-0.5 rounded text-[5px] font-bold uppercase text-zinc-800">
            Professional Tenure
          </div>
          <div className="font-bold text-[5px]">Senior Analyst — Deloitte</div>
          <div className="h-0.5 w-full bg-zinc-200 rounded" />
        </div>
      ) : isMinimalClean ? (
        /* 7. MINIMAL PROFESSIONAL / MINIMAL CLEAN (Left-aligned + Top Accent Rule + Status Dots) */
        <div className="space-y-1.5">
          <div className="border-b-2 pb-1 flex justify-between items-end" style={{ borderColor: color }}>
            <div>
              <div className="text-[8px] font-bold text-zinc-900">Alex Morgan</div>
              <div className="text-[4.5px] font-semibold uppercase" style={{ color }}>
                Software Engineer
              </div>
            </div>
            <div className="text-[4px] text-right text-zinc-400">
              <div>alex@cvnest.io</div>
              <div>Bengaluru</div>
            </div>
          </div>
          <div className="text-[4.5px] italic border-l-2 pl-1.5 text-zinc-600" style={{ borderColor: color }}>
            Full-stack engineer focused on distributed web systems.
          </div>
          <div className="flex items-center gap-1 text-[5px] font-bold uppercase text-zinc-900">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            <span>Experience</span>
          </div>
          <div className="h-0.5 w-full bg-zinc-200 rounded" />
          <div className="h-0.5 w-5/6 bg-zinc-200 rounded" />
          <div className="flex flex-wrap gap-0.5 pt-0.5">
            {["React", "TypeScript", "Node", "SQL"].map((s, i) => (
              <span key={i} className="px-1 py-0.2 bg-zinc-100 border border-zinc-200 rounded text-[4.5px]">
                {s}
              </span>
            ))}
          </div>
        </div>
      ) : isModernAts ? (
        /* 8. MODERN ATS (Left-bordered cards + Tabular Skills) */
        <div className="space-y-1.5">
          <div className="flex justify-between items-center border-b border-zinc-200 pb-1">
            <div>
              <div className="text-[8px] font-bold">Alex Morgan</div>
              <div className="text-[4.5px] text-zinc-500">Cloud & Backend Engineer</div>
            </div>
            <div className="text-[4px] text-right text-zinc-400">alex@cvnest.io</div>
          </div>
          <div className="text-[5px] font-bold uppercase">Work Experience</div>
          <div className="border-l-2 pl-1.5 space-y-0.5" style={{ borderColor: color }}>
            <div className="font-bold text-[5px]">Backend Lead · Stripe</div>
            <div className="h-0.5 w-full bg-zinc-200 rounded" />
          </div>
          <div className="border-l-2 pl-1.5 space-y-0.5" style={{ borderColor: color }}>
            <div className="font-bold text-[5px]">Engineer II · Atlassian</div>
            <div className="h-0.5 w-4/5 bg-zinc-200 rounded" />
          </div>
        </div>
      ) : isElegantBlue ? (
        /* 9. ELEGANT BLUE / VISUAL PROFESSIONAL (Pill Contact Badges + Tinted Summary Card) */
        <div className="space-y-1.5">
          <div className="text-center">
            <div className="text-[8.5px] font-extrabold" style={{ color }}>Alex Morgan</div>
            <div className="flex justify-center gap-1 mt-0.5 text-[4px]">
              <span className="bg-slate-100 px-1 py-0.2 rounded-full">alex@cvnest.io</span>
              <span className="bg-slate-100 px-1 py-0.2 rounded-full">San Francisco</span>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200/70 rounded p-1 text-[4.5px] text-center text-slate-600">
            Product-minded engineer with 6+ years building web apps.
          </div>
          <div className="text-[5px] font-bold uppercase border-b pb-0.2" style={{ color, borderColor: color }}>
            Experience
          </div>
          <div className="h-0.5 w-full bg-zinc-200 rounded" />
          <div className="h-0.5 w-3/4 bg-zinc-200 rounded" />
        </div>
      ) : isBtech || template.category === "fresher" ? (
        /* 10. BTECH FRESHER / STUDENT TEMPLATES (CGPA Badge + Hackathons + Projects) */
        <div className="space-y-1.5">
          <div className="text-center pb-1 border-b-2" style={{ borderColor: color }}>
            <div className="text-[8px] font-bold text-zinc-900">Rohan Sharma</div>
            <div className="text-[4.5px] font-semibold" style={{ color }}>
              B.Tech Computer Science · Full-Stack
            </div>
            <div className="text-[4px] text-zinc-400">GitHub · LinkedIn · LeetCode</div>
          </div>

          <div>
            <div className="flex justify-between items-center text-[5px] font-bold uppercase border-b border-zinc-200 pb-0.2" style={{ color }}>
              <span>Education</span>
              <span className="text-emerald-700 bg-emerald-50 px-1 rounded border border-emerald-200 text-[4px]">
                CGPA: 8.92
              </span>
            </div>
            <div className="font-bold text-[4.8px] mt-0.5">VIT Vellore — B.Tech CSE</div>
          </div>

          <div>
            <div className="text-[5px] font-bold uppercase border-b border-zinc-200 pb-0.2" style={{ color }}>
              Projects
            </div>
            <div className="font-bold text-[4.8px] mt-0.5">CampusConnect (Next.js / SQL)</div>
            <div className="h-0.5 w-full bg-zinc-200 rounded mt-0.5" />
          </div>

          <div>
            <div className="text-[5px] font-bold uppercase border-b border-zinc-200 pb-0.2" style={{ color }}>
              Hackathons
            </div>
            <div className="flex justify-between text-[4.5px] mt-0.5">
              <span>Smart India Hackathon</span>
              <span className="text-emerald-700 font-bold">1st Prize</span>
            </div>
          </div>
        </div>
      ) : (
        /* 11. CLASSIC ATS / EXECUTIVE TRADITIONAL (Centered Serif + Formal Rules) */
        <div className="space-y-1.5">
          <div className={`text-center pb-1 ${isExecutive ? "border-b-2 border-zinc-900" : "border-b border-zinc-300"}`}>
            <div className="text-[8px] font-bold tracking-tight uppercase">Alex Morgan</div>
            <div className="text-[4.5px] text-zinc-600 italic">Senior Software Engineer</div>
            <div className="text-[4px] text-zinc-400 mt-0.5">alex@cvnest.io · +1 555 019 2834</div>
          </div>

          <div>
            <div className="text-[5px] font-bold uppercase border-b border-zinc-200 pb-0.2">
              Work Experience
            </div>
            <div className="mt-0.5 space-y-1">
              <div>
                <div className="flex justify-between font-bold text-[4.8px]">
                  <span>Senior Engineer — Stripe</span>
                  <span className="text-zinc-400">2023–Pres</span>
                </div>
                <div className="h-0.5 w-full bg-zinc-200 rounded mt-0.5" />
                <div className="h-0.5 w-5/6 bg-zinc-200 rounded mt-0.5" />
              </div>
              <div>
                <div className="flex justify-between font-bold text-[4.8px]">
                  <span>Engineer II — Atlassian</span>
                  <span className="text-zinc-400">2020–2022</span>
                </div>
                <div className="h-0.5 w-4/5 bg-zinc-200 rounded mt-0.5" />
              </div>
            </div>
          </div>

          <div>
            <div className="text-[5px] font-bold uppercase border-b border-zinc-200 pb-0.2">
              Education
            </div>
            <div className="flex justify-between text-[4.8px] mt-0.5">
              <span className="font-bold">NIT Trichy — B.Tech CS</span>
              <span className="text-zinc-400">2018</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer Meta */}
      <div className="pt-1 border-t border-zinc-100 flex items-center justify-between text-[4.5px] text-zinc-400 font-sans">
        <span className="font-mono">{template.atsScore || 96}% ATS</span>
        <span>{template.layoutType || "Single Column"}</span>
      </div>
    </div>
  );
};
