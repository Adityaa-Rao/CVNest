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
  accentColor = "#4f46e5",
  className = "",
}) => {
  const isDarkSidebar = template.id === "modern-sidebar";
  const isLeftSidebar = template.id === "creative-designer";
  const isTwoColumn = template.layoutType === "Two Column" || template.id === "modern-professional" || template.id === "executive-pro";
  const isTimeline = template.id === "contemporary-slate";
  const isProjectGrid = template.id === "portfolio-style";
  const isSerif = template.id === "classic-ats" || template.id === "executive-traditional" || template.id === "elegant-creative";
  const isCode = template.id === "software-developer";

  return (
    <div
      className={`w-full aspect-[210/297] bg-white text-zinc-900 rounded-lg shadow-sm border border-zinc-200/80 overflow-hidden relative select-none p-3.5 text-[6px] leading-tight flex flex-col justify-between ${className}`}
      style={{
        fontFamily: isCode ? "monospace" : isSerif ? "serif" : "sans-serif",
      }}
    >
      {/* Dynamic Miniature Rendering for Each Template Layout Type */}

      {/* 1. LEFT SIDEBAR TEMPLATES (Creative Designer & Modern Sidebar) */}
      {(isLeftSidebar || isDarkSidebar) ? (
        <div className="flex h-full -m-3.5">
          {/* Left Mini Sidebar */}
          <div
            className={`w-[34%] p-2 flex flex-col justify-between ${
              isDarkSidebar ? "bg-zinc-900 text-zinc-100" : "text-white"
            }`}
            style={{ backgroundColor: isDarkSidebar ? "#18181b" : accentColor }}
          >
            <div>
              <div className="w-6 h-6 rounded-full mx-auto bg-white/20 border border-white/40 mb-1 flex items-center justify-center font-bold text-[7px]">
                JD
              </div>
              <div className="text-[7px] font-bold text-center leading-tight truncate">Alex Morgan</div>
              <div className="text-[5px] text-center opacity-80 truncate">Software Engineer</div>

              <div className="mt-2.5 space-y-1">
                <div className="h-0.5 w-8 bg-white/30 rounded" />
                <div className="text-[5px] opacity-80">alex@example.com</div>
                <div className="text-[5px] opacity-80">+1 (555) 019-2834</div>
                <div className="text-[5px] opacity-80">github.com/alex</div>
              </div>

              <div className="mt-2.5 space-y-1">
                <div className="text-[5px] font-bold uppercase tracking-wider opacity-75">SKILLS</div>
                <div className="flex flex-wrap gap-0.5">
                  {["React", "Node", "TS", "AWS", "SQL"].map((s, i) => (
                    <span key={i} className="px-1 py-0.2 bg-white/20 rounded text-[4.5px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-[4.5px] opacity-60">CVNest Portfolio</div>
          </div>

          {/* Right Main Body */}
          <div className="flex-1 p-2.5 space-y-2 bg-white">
            <div>
              <div className="text-[6px] font-bold text-zinc-800 border-b border-zinc-200 pb-0.5">PROFILE</div>
              <div className="h-1 w-full bg-zinc-200 rounded mt-1" />
              <div className="h-1 w-4/5 bg-zinc-200 rounded mt-0.5" />
            </div>

            <div>
              <div className="text-[6px] font-bold text-zinc-800 border-b border-zinc-200 pb-0.5">EXPERIENCE</div>
              <div className="mt-1 space-y-1">
                <div>
                  <div className="flex justify-between font-bold text-[5.5px] text-zinc-800">
                    <span>Senior Full-Stack Engineer</span>
                    <span className="text-zinc-400">2023 - Pres</span>
                  </div>
                  <div className="text-[5px] text-zinc-500">Stripe · SF</div>
                  <div className="h-0.5 w-full bg-zinc-200 rounded mt-0.5" />
                  <div className="h-0.5 w-5/6 bg-zinc-200 rounded mt-0.5" />
                </div>
                <div>
                  <div className="flex justify-between font-bold text-[5.5px] text-zinc-800">
                    <span>Software Engineer</span>
                    <span className="text-zinc-400">2021 - 2023</span>
                  </div>
                  <div className="h-0.5 w-full bg-zinc-200 rounded mt-0.5" />
                </div>
              </div>
            </div>

            <div>
              <div className="text-[6px] font-bold text-zinc-800 border-b border-zinc-200 pb-0.5">EDUCATION</div>
              <div className="flex justify-between text-[5px] mt-0.5 text-zinc-700 font-semibold">
                <span>B.Tech in Computer Science</span>
                <span className="text-zinc-400">2017 - 2021</span>
              </div>
            </div>
          </div>
        </div>
      ) : isTwoColumn ? (
        /* 2. TWO COLUMN / MODERN PROFESSIONAL / EXECUTIVE PRO */
        <div className="flex flex-col h-full -m-3.5">
          {/* Header Banner */}
          <div className="p-2.5 text-white flex justify-between items-center" style={{ backgroundColor: accentColor }}>
            <div>
              <div className="text-[8px] font-bold tracking-tight leading-tight">Alex Morgan</div>
              <div className="text-[5.5px] opacity-90">Senior Distributed Systems Engineer</div>
            </div>
            <div className="text-[4.5px] text-right opacity-80">
              <div>alex@example.com</div>
              <div>San Francisco, CA</div>
            </div>
          </div>

          {/* 2 Columns */}
          <div className="flex-1 p-2.5 grid grid-cols-12 gap-2 bg-white">
            <div className="col-span-8 space-y-1.5 border-r border-zinc-100 pr-1.5">
              <div className="text-[5.5px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                Experience
              </div>
              <div className="space-y-1">
                <div>
                  <div className="flex justify-between font-bold text-[5px] text-zinc-800">
                    <span>Staff Engineer @ Stripe</span>
                    <span className="text-zinc-400">2023 - Present</span>
                  </div>
                  <div className="h-0.5 w-full bg-zinc-200 rounded mt-0.5" />
                  <div className="h-0.5 w-4/5 bg-zinc-200 rounded mt-0.5" />
                </div>
                <div>
                  <div className="flex justify-between font-bold text-[5px] text-zinc-800">
                    <span>Systems Architect</span>
                    <span className="text-zinc-400">2020 - 2023</span>
                  </div>
                  <div className="h-0.5 w-11/12 bg-zinc-200 rounded mt-0.5" />
                </div>
              </div>

              <div className="text-[5.5px] font-bold uppercase tracking-wider pt-1" style={{ color: accentColor }}>
                Featured Projects
              </div>
              <div className="p-1 rounded bg-zinc-50 border border-zinc-200/60">
                <div className="font-bold text-[5px] text-zinc-800">ChronosDB — Distributed Engine</div>
                <div className="text-[4.5px] text-zinc-500 font-mono">Go · Raft Consensus · Docker</div>
              </div>
            </div>

            <div className="col-span-4 space-y-1.5">
              <div className="text-[5.5px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                Skills
              </div>
              <div className="flex flex-wrap gap-0.5">
                {["TypeScript", "Go", "AWS", "Kafka", "K8s", "Postgres"].map((s, i) => (
                  <span key={i} className="px-1 py-0.2 bg-zinc-100 rounded text-[4.5px] text-zinc-700">
                    {s}
                  </span>
                ))}
              </div>

              <div className="text-[5.5px] font-bold uppercase tracking-wider pt-1" style={{ color: accentColor }}>
                Education
              </div>
              <div className="text-[5px] font-bold text-zinc-800">BTech in Computer Science</div>
              <div className="text-[4.5px] text-zinc-500">NIT Trichy · 9.1 CGPA</div>
            </div>
          </div>
        </div>
      ) : isProjectGrid ? (
        /* 3. PORTFOLIO STYLE (Project Cards) */
        <div className="space-y-1.5">
          <div className="border-b-2 pb-1 flex justify-between items-end" style={{ borderColor: accentColor }}>
            <div>
              <div className="text-[8px] font-black">Alex Morgan</div>
              <div className="text-[5px] font-semibold text-zinc-500">FULL STACK & OPEN SOURCE DEV</div>
            </div>
            <div className="text-[5px] font-bold" style={{ color: accentColor }}>github.com/alex</div>
          </div>

          <div className="text-[5.5px] font-bold uppercase tracking-wider text-zinc-800">Featured Projects</div>
          <div className="grid grid-cols-2 gap-1">
            <div className="p-1 rounded border border-zinc-200 bg-zinc-50/60">
              <div className="font-bold text-[5.5px] text-zinc-900">CampusConnect</div>
              <div className="text-[4px] text-zinc-500">Next.js · Prisma · Postgres</div>
              <div className="h-0.5 w-full bg-zinc-200 rounded mt-0.5" />
            </div>
            <div className="p-1 rounded border border-zinc-200 bg-zinc-50/60">
              <div className="font-bold text-[5.5px] text-zinc-900">Algoverse Visualizer</div>
              <div className="text-[4px] text-zinc-500">React · Canvas · Web Workers</div>
              <div className="h-0.5 w-full bg-zinc-200 rounded mt-0.5" />
            </div>
          </div>

          <div className="text-[5.5px] font-bold uppercase tracking-wider text-zinc-800 pt-0.5">Experience & Skills</div>
          <div className="h-0.5 w-full bg-zinc-200 rounded" />
          <div className="h-0.5 w-3/4 bg-zinc-200 rounded" />
          <div className="flex flex-wrap gap-0.5 pt-0.5">
            {["React", "Node", "TypeScript", "Tailwind", "Docker"].map((s, i) => (
              <span key={i} className="px-1 py-0.2 bg-zinc-100 rounded text-[4.5px] border border-zinc-200">
                {s}
              </span>
            ))}
          </div>
        </div>
      ) : isTimeline ? (
        /* 4. CONTEMPORARY SLATE / TIMELINE */
        <div className="space-y-1.5">
          <div className="border-b pb-1 flex justify-between items-end">
            <div>
              <div className="text-[8px] font-bold text-slate-900">Alex Morgan</div>
              <div className="text-[5px] text-slate-500">Software Engineer & Architect</div>
            </div>
            <div className="text-[5px] text-slate-400">alex@example.com</div>
          </div>

          <div className="text-[5.5px] font-bold uppercase tracking-wider text-slate-800">Career Timeline</div>
          <div className="border-l border-slate-300 ml-1 pl-2 space-y-1.5 relative">
            <div className="relative">
              <div className="absolute -left-[10px] top-0.5 w-1 h-1 rounded-full bg-primary" />
              <div className="font-bold text-[5px] text-slate-900">Lead Engineer · TechNova</div>
              <div className="h-0.5 w-full bg-slate-200 rounded mt-0.5" />
            </div>
            <div className="relative">
              <div className="absolute -left-[10px] top-0.5 w-1 h-1 rounded-full bg-slate-400" />
              <div className="font-bold text-[5px] text-slate-900">Full-Stack Dev · Atlassian</div>
              <div className="h-0.5 w-4/5 bg-slate-200 rounded mt-0.5" />
            </div>
          </div>

          <div className="text-[5.5px] font-bold uppercase tracking-wider text-slate-800 pt-0.5">Education</div>
          <div className="flex justify-between text-[5px] text-slate-700">
            <span>BTech Computer Science</span>
            <span className="text-slate-400">2022 - 2026</span>
          </div>
        </div>
      ) : isCode ? (
        /* 5. SOFTWARE DEVELOPER (Monospace tech) */
        <div className="space-y-1 font-mono text-[5.5px]">
          <div className="border-b pb-1 flex justify-between items-baseline border-zinc-900">
            <div className="font-bold text-[7px] text-zinc-900">&lt;AlexMorgan /&gt;</div>
            <div className="text-[4.5px] text-blue-600">github.com/alex</div>
          </div>

          <div className="text-[5px] font-bold text-zinc-800">// const skills = &#123;</div>
          <div className="pl-1.5 text-[4.5px] text-zinc-600 space-y-0.2">
            <div>languages: ["TypeScript", "Python", "Go"],</div>
            <div>frameworks: ["Next.js", "React", "Node"]</div>
          </div>

          <div className="text-[5px] font-bold text-zinc-800 pt-1">// Projects</div>
          <div className="p-1 rounded bg-zinc-50 border border-zinc-200">
            <div className="font-bold text-[5px] text-zinc-900">CampusConnect (v2.0)</div>
            <div className="text-[4px] text-zinc-500">Full-stack student portal with 1,200+ active users</div>
          </div>
        </div>
      ) : (
        /* 6. STANDARD SINGLE COLUMN (Classic ATS, BTech Fresher, Minimal Professional, College Graduate) */
        <div className="space-y-1.5">
          {/* Header */}
          <div className="text-center pb-1 border-b border-zinc-200">
            <div className="text-[8px] font-bold text-zinc-900 uppercase tracking-tight">Alex Morgan</div>
            <div className="text-[5px] text-zinc-600 font-medium">B.Tech Computer Science | Full-Stack Developer</div>
            <div className="text-[4.5px] text-zinc-400 mt-0.5">alex@example.com · +1 (555) 019-2834 · San Francisco, CA</div>
          </div>

          {/* Special Fresher Section if template is Fresher/Student */}
          {template.category === "fresher" ? (
            <>
              <div>
                <div className="flex justify-between items-center text-[5.5px] font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-200 pb-0.2">
                  <span>Education & Academics</span>
                  <span className="text-emerald-600 font-semibold text-[5px]">CGPA: 8.92 / 10</span>
                </div>
                <div className="flex justify-between text-[5px] mt-0.5">
                  <span className="font-bold text-zinc-900">Vellore Institute of Technology (VIT)</span>
                  <span className="text-zinc-400 font-mono">2022 - 2026</span>
                </div>
                <div className="text-[4.5px] text-zinc-500">BTech in Computer Science and Engineering</div>
              </div>

              <div>
                <div className="text-[5.5px] font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-200 pb-0.2">
                  Technical Projects
                </div>
                <div className="mt-0.5">
                  <div className="font-bold text-[5px] text-zinc-900">CampusConnect — Student Resource Portal</div>
                  <div className="text-[4.5px] text-zinc-500 font-mono">Next.js 14 · Prisma · PostgreSQL · Tailwind</div>
                  <div className="h-0.5 w-full bg-zinc-200 rounded mt-0.5" />
                </div>
              </div>

              <div>
                <div className="text-[5.5px] font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-200 pb-0.2">
                  Hackathons & Competitions
                </div>
                <div className="flex justify-between text-[4.8px] mt-0.5 text-zinc-800 font-medium">
                  <span>Smart India Hackathon</span>
                  <span className="text-emerald-700 font-bold">1st Place</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Standard Corporate / ATS Sections */}
              <div>
                <div className="text-[5.5px] font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-200 pb-0.2">
                  Professional Experience
                </div>
                <div className="mt-0.5 space-y-1">
                  <div>
                    <div className="flex justify-between font-bold text-[5px] text-zinc-900">
                      <span>Senior Software Engineer — Stripe</span>
                      <span className="text-zinc-400">2023 - Present</span>
                    </div>
                    <div className="h-0.5 w-full bg-zinc-200 rounded mt-0.5" />
                    <div className="h-0.5 w-5/6 bg-zinc-200 rounded mt-0.5" />
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-[5px] text-zinc-900">
                      <span>Software Engineer II — Atlassian</span>
                      <span className="text-zinc-400">2020 - 2022</span>
                    </div>
                    <div className="h-0.5 w-4/5 bg-zinc-200 rounded mt-0.5" />
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[5.5px] font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-200 pb-0.2">
                  Education & Skills
                </div>
                <div className="flex justify-between text-[5px] mt-0.5 font-bold text-zinc-800">
                  <span>B.Tech in Computer Science</span>
                  <span className="text-zinc-400">NIT Trichy</span>
                </div>
                <div className="flex flex-wrap gap-0.5 mt-0.5">
                  {["TypeScript", "Go", "Next.js", "Docker", "AWS", "SQL"].map((s, i) => (
                    <span key={i} className="px-1 py-0.2 bg-zinc-100 rounded text-[4.5px] text-zinc-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Miniature ATS Verification Badge */}
      <div className="pt-1 border-t border-zinc-100 flex items-center justify-between text-[4.5px] text-zinc-400">
        <span className="font-mono">ATS score: {template.atsScore || 96}%</span>
        <span>A4 Ready</span>
      </div>
    </div>
  );
};
