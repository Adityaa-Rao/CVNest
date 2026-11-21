"use client";

import React, { useState } from "react";
import { ResumeData, ExperienceItem, EducationItem, ProjectItem, SkillCategory, InternshipItem, HackathonItem, CertificationItem, AchievementItem, LanguageItem } from "@/types/resume";
import { generateId } from "@/lib/utils";
import { Plus, Trash2, Sparkles, Check, ChevronDown, ChevronUp } from "lucide-react";
import { AIModal } from "../ai-tools/AIModal";

interface CenterEditorProps {
  resume: ResumeData;
  activeSection: string;
  onChange: (updated: ResumeData) => void;
}

export const CenterEditor: React.FC<CenterEditorProps> = ({ resume, activeSection, onChange }) => {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTarget, setAiTarget] = useState<{ type: "summary" | "bullet"; expIdx?: number; bulletIdx?: number; initialText?: string }>({
    type: "summary",
  });

  // Helper updates
  const updatePersonalInfo = (field: string, val: string) => {
    onChange({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: val,
      },
    });
  };

  const handleApplyAISummary = (summary: string) => {
    updatePersonalInfo("summary", summary);
  };

  const handleApplyAIBullet = (bullet: string) => {
    if (aiTarget.expIdx !== undefined && aiTarget.bulletIdx !== undefined) {
      const expList = [...resume.experience];
      const targetExp = { ...expList[aiTarget.expIdx] };
      const bullets = [...(targetExp.achievements || [])];
      bullets[aiTarget.bulletIdx] = bullet;
      targetExp.achievements = bullets;
      expList[aiTarget.expIdx] = targetExp;
      onChange({ ...resume, experience: expList });
    }
  };

  return (
    <div className="flex-1 bg-background overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* 1. PERSONAL INFORMATION */}
      {(activeSection === "personalInfo" || activeSection === "all") && (
        <section id="sec-personalInfo" className="space-y-4 max-w-3xl">
          <div className="border-b border-border pb-2">
            <h3 className="text-base font-bold text-foreground">Personal Details</h3>
            <p className="text-xs text-muted-foreground">Recruiters and ATS scanners identify your primary contact data here.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Full Name *</label>
              <input
                type="text"
                value={resume.personalInfo.fullName || ""}
                onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full text-xs px-3 py-2 rounded-lg border border-input bg-card focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Professional Title *</label>
              <input
                type="text"
                value={resume.personalInfo.title || ""}
                onChange={(e) => updatePersonalInfo("title", e.target.value)}
                placeholder="e.g. Full-Stack Software Engineer"
                className="w-full text-xs px-3 py-2 rounded-lg border border-input bg-card focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Email Address *</label>
              <input
                type="email"
                value={resume.personalInfo.email || ""}
                onChange={(e) => updatePersonalInfo("email", e.target.value)}
                placeholder="e.g. alex@example.com"
                className="w-full text-xs px-3 py-2 rounded-lg border border-input bg-card focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Phone Number *</label>
              <input
                type="tel"
                value={resume.personalInfo.phone || ""}
                onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                placeholder="e.g. +1 (555) 019-2834"
                className="w-full text-xs px-3 py-2 rounded-lg border border-input bg-card focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">City</label>
              <input
                type="text"
                value={resume.personalInfo.city || ""}
                onChange={(e) => updatePersonalInfo("city", e.target.value)}
                placeholder="e.g. San Francisco or Bengaluru"
                className="w-full text-xs px-3 py-2 rounded-lg border border-input bg-card focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Country</label>
              <input
                type="text"
                value={resume.personalInfo.country || ""}
                onChange={(e) => updatePersonalInfo("country", e.target.value)}
                placeholder="e.g. United States or India"
                className="w-full text-xs px-3 py-2 rounded-lg border border-input bg-card focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">LinkedIn Profile</label>
              <input
                type="text"
                value={resume.personalInfo.linkedin || ""}
                onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                placeholder="linkedin.com/in/username"
                className="w-full text-xs px-3 py-2 rounded-lg border border-input bg-card focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">GitHub Profile</label>
              <input
                type="text"
                value={resume.personalInfo.github || ""}
                onChange={(e) => updatePersonalInfo("github", e.target.value)}
                placeholder="github.com/username"
                className="w-full text-xs px-3 py-2 rounded-lg border border-input bg-card focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Portfolio Website</label>
              <input
                type="text"
                value={resume.personalInfo.portfolio || ""}
                onChange={(e) => updatePersonalInfo("portfolio", e.target.value)}
                placeholder="https://yourportfolio.dev"
                className="w-full text-xs px-3 py-2 rounded-lg border border-input bg-card focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Coding / Additional Link</label>
              <input
                type="text"
                value={resume.personalInfo.website || ""}
                onChange={(e) => updatePersonalInfo("website", e.target.value)}
                placeholder="e.g. leetcode.com/u/username"
                className="w-full text-xs px-3 py-2 rounded-lg border border-input bg-card focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </section>
      )}

      {/* 2. PROFESSIONAL SUMMARY */}
      {(activeSection === "summary" || activeSection === "all") && (
        <section id="sec-summary" className="space-y-3 max-w-3xl">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <div>
              <h3 className="text-base font-bold text-foreground">Professional Summary</h3>
              <p className="text-xs text-muted-foreground">3 to 5 lines highlighting your technical value and achievements.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setAiTarget({ type: "summary" });
                setAiModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-semibold hover:bg-indigo-500/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Summary Assistant</span>
            </button>
          </div>

          <textarea
            value={resume.personalInfo.summary || ""}
            onChange={(e) => updatePersonalInfo("summary", e.target.value)}
            rows={4}
            placeholder="Write a compelling summary or use the AI Assistant to generate one based on your background..."
            className="w-full text-xs p-3.5 rounded-xl border border-input bg-card focus:ring-2 focus:ring-primary/20 outline-none leading-relaxed resize-y"
          />
        </section>
      )}

      {/* 3. WORK EXPERIENCE */}
      {(activeSection === "experience" || activeSection === "all") && (
        <section id="sec-experience" className="space-y-4 max-w-3xl">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <div>
              <h3 className="text-base font-bold text-foreground">Work Experience</h3>
              <p className="text-xs text-muted-foreground">Highlight roles, responsibilities, and quantified impact.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const newExp: ExperienceItem = {
                  id: generateId(),
                  company: "",
                  position: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                  current: false,
                  description: "",
                  achievements: [""],
                };
                onChange({ ...resume, experience: [newExp, ...(resume.experience || [])] });
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
            >
              <Plus className="w-3.5 h-3.5" /> Add Role
            </button>
          </div>

          <div className="space-y-4">
            {(resume.experience || []).map((exp, expIdx) => (
              <div key={exp.id} className="p-4 rounded-xl border border-border bg-card space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-foreground">Position #{expIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = resume.experience.filter((_, i) => i !== expIdx);
                      onChange({ ...resume, experience: updated });
                    }}
                    className="text-muted-foreground hover:text-destructive p-1 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">Company *</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const copy = [...resume.experience];
                        copy[expIdx].company = e.target.value;
                        onChange({ ...resume, experience: copy });
                      }}
                      placeholder="e.g. Stripe, Google, or TechNova"
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-input bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">Position / Title *</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => {
                        const copy = [...resume.experience];
                        copy[expIdx].position = e.target.value;
                        onChange({ ...resume, experience: copy });
                      }}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-input bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">Start Date</label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => {
                        const copy = [...resume.experience];
                        copy[expIdx].startDate = e.target.value;
                        onChange({ ...resume, experience: copy });
                      }}
                      placeholder="YYYY-MM (e.g. 2023-01)"
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-input bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">End Date</label>
                    <input
                      type="text"
                      disabled={exp.current}
                      value={exp.current ? "Present" : exp.endDate}
                      onChange={(e) => {
                        const copy = [...resume.experience];
                        copy[expIdx].endDate = e.target.value;
                        onChange({ ...resume, experience: copy });
                      }}
                      placeholder="YYYY-MM or Present"
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-input bg-background disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`curr-${exp.id}`}
                    checked={exp.current}
                    onChange={(e) => {
                      const copy = [...resume.experience];
                      copy[expIdx].current = e.target.checked;
                      onChange({ ...resume, experience: copy });
                    }}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <label htmlFor={`curr-${exp.id}`} className="text-xs text-muted-foreground select-none">
                    I currently work in this role
                  </label>
                </div>

                {/* Achievements / Bullet points */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-semibold text-foreground">Bullet Points & Impact</label>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...resume.experience];
                        copy[expIdx].achievements = [...(copy[expIdx].achievements || []), ""];
                        onChange({ ...resume, experience: copy });
                      }}
                      className="text-[11px] text-primary hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Bullet
                    </button>
                  </div>

                  {(exp.achievements || []).map((b, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={b}
                        onChange={(e) => {
                          const copy = [...resume.experience];
                          copy[expIdx].achievements[bIdx] = e.target.value;
                          onChange({ ...resume, experience: copy });
                        }}
                        placeholder="Action verb + task + quantifiable result (e.g. Architected microservice improving latency by 35%)"
                        className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-input bg-background"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setAiTarget({ type: "bullet", expIdx, bulletIdx: bIdx, initialText: b });
                          setAiModalOpen(true);
                        }}
                        title="Improve with AI"
                        className="p-1.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const copy = [...resume.experience];
                          copy[expIdx].achievements = copy[expIdx].achievements.filter((_, i) => i !== bIdx);
                          onChange({ ...resume, experience: copy });
                        }}
                        className="p-1.5 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. EDUCATION */}
      {(activeSection === "education" || activeSection === "all") && (
        <section id="sec-education" className="space-y-4 max-w-3xl">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <div>
              <h3 className="text-base font-bold text-foreground">Education</h3>
              <p className="text-xs text-muted-foreground">Degrees, colleges, CGPA/percentage, and relevant coursework.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const newEdu: EducationItem = {
                  id: generateId(),
                  institution: "",
                  degree: "",
                  fieldOfStudy: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                  grade: "",
                  coursework: "",
                };
                onChange({ ...resume, education: [newEdu, ...(resume.education || [])] });
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" /> Add Degree
            </button>
          </div>

          <div className="space-y-4">
            {(resume.education || []).map((edu, eduIdx) => (
              <div key={edu.id} className="p-4 rounded-xl border border-border bg-card space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-foreground">Degree #{eduIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = resume.education.filter((_, i) => i !== eduIdx);
                      onChange({ ...resume, education: updated });
                    }}
                    className="text-muted-foreground hover:text-destructive p-1 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">Institution / University *</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const copy = [...resume.education];
                        copy[eduIdx].institution = e.target.value;
                        onChange({ ...resume, education: copy });
                      }}
                      placeholder="e.g. Vellore Institute of Technology (VIT)"
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-input bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">Degree *</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const copy = [...resume.education];
                        copy[eduIdx].degree = e.target.value;
                        onChange({ ...resume, education: copy });
                      }}
                      placeholder="e.g. Bachelor of Technology (B.Tech)"
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-input bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">Field of Study / Branch</label>
                    <input
                      type="text"
                      value={edu.fieldOfStudy}
                      onChange={(e) => {
                        const copy = [...resume.education];
                        copy[eduIdx].fieldOfStudy = e.target.value;
                        onChange({ ...resume, education: copy });
                      }}
                      placeholder="e.g. Computer Science and Engineering"
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-input bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">Grade / CGPA</label>
                    <input
                      type="text"
                      value={edu.grade}
                      onChange={(e) => {
                        const copy = [...resume.education];
                        copy[eduIdx].grade = e.target.value;
                        onChange({ ...resume, education: copy });
                      }}
                      placeholder="e.g. 8.92 / 10.0 or 3.8 GPA"
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-input bg-background"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. SKILLS */}
      {(activeSection === "skills" || activeSection === "all") && (
        <section id="sec-skills" className="space-y-4 max-w-3xl">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <div>
              <h3 className="text-base font-bold text-foreground">Technical & Soft Skills</h3>
              <p className="text-xs text-muted-foreground">Categorize your languages, frameworks, cloud tools, and practices.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const newCat: SkillCategory = {
                  id: generateId(),
                  categoryName: "Core Technologies",
                  skills: [{ name: "React" }, { name: "TypeScript" }],
                };
                onChange({ ...resume, skills: [...(resume.skills || []), newCat] });
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          </div>

          <div className="space-y-4">
            {(resume.skills || []).map((cat, catIdx) => (
              <div key={cat.id} className="p-4 rounded-xl border border-border bg-card space-y-3">
                <div className="flex justify-between items-center">
                  <input
                    type="text"
                    value={cat.categoryName}
                    onChange={(e) => {
                      const copy = [...resume.skills];
                      copy[catIdx].categoryName = e.target.value;
                      onChange({ ...resume, skills: copy });
                    }}
                    className="font-bold text-xs bg-transparent border-b border-input pb-0.5 focus:border-primary outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = resume.skills.filter((_, i) => i !== catIdx);
                      onChange({ ...resume, skills: updated });
                    }}
                    className="text-muted-foreground hover:text-destructive p-1 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Skill items chips */}
                <div className="flex flex-wrap gap-2">
                  {cat.skills?.map((s, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-1.5 bg-secondary text-foreground text-xs px-2.5 py-1 rounded-lg border border-border">
                      <span>{s.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const copy = [...resume.skills];
                          copy[catIdx].skills = copy[catIdx].skills.filter((_, i) => i !== sIdx);
                          onChange({ ...resume, skills: copy });
                        }}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <input
                    type="text"
                    placeholder="+ Type skill & press Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value.trim();
                        const copy = [...resume.skills];
                        copy[catIdx].skills = [...(copy[catIdx].skills || []), { name: val }];
                        onChange({ ...resume, skills: copy });
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                    className="text-xs px-2.5 py-1 rounded-lg border border-dashed border-input bg-transparent outline-none focus:border-primary w-44"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. PROJECTS */}
      {(activeSection === "projects" || activeSection === "all") && (
        <section id="sec-projects" className="space-y-4 max-w-3xl">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <div>
              <h3 className="text-base font-bold text-foreground">Projects</h3>
              <p className="text-xs text-muted-foreground">Feature full-stack apps, open source repos, and engineering systems.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const newProj: ProjectItem = {
                  id: generateId(),
                  name: "",
                  description: "",
                  technologies: [],
                  keyContributions: [""],
                };
                onChange({ ...resume, projects: [newProj, ...(resume.projects || [])] });
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" /> Add Project
            </button>
          </div>

          <div className="space-y-4">
            {(resume.projects || []).map((proj, pIdx) => (
              <div key={proj.id} className="p-4 rounded-xl border border-border bg-card space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-foreground">Project #{pIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = resume.projects.filter((_, i) => i !== pIdx);
                      onChange({ ...resume, projects: updated });
                    }}
                    className="text-muted-foreground hover:text-destructive p-1 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">Project Name *</label>
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => {
                        const copy = [...resume.projects];
                        copy[pIdx].name = e.target.value;
                        onChange({ ...resume, projects: copy });
                      }}
                      placeholder="e.g. CampusConnect or ChronosDB"
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-input bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">Live Demo URL</label>
                    <input
                      type="text"
                      value={proj.liveUrl || ""}
                      onChange={(e) => {
                        const copy = [...resume.projects];
                        copy[pIdx].liveUrl = e.target.value;
                        onChange({ ...resume, projects: copy });
                      }}
                      placeholder="https://yourdemo.app"
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-input bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">GitHub Repo</label>
                    <input
                      type="text"
                      value={proj.githubUrl || ""}
                      onChange={(e) => {
                        const copy = [...resume.projects];
                        copy[pIdx].githubUrl = e.target.value;
                        onChange({ ...resume, projects: copy });
                      }}
                      placeholder="https://github.com/user/repo"
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-input bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">Technologies (comma separated)</label>
                    <input
                      type="text"
                      value={proj.technologies?.join(", ") || ""}
                      onChange={(e) => {
                        const copy = [...resume.projects];
                        copy[pIdx].technologies = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                        onChange({ ...resume, projects: copy });
                      }}
                      placeholder="Next.js, TypeScript, PostgreSQL, Tailwind"
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-input bg-background"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-foreground mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={proj.description}
                    onChange={(e) => {
                      const copy = [...resume.projects];
                      copy[pIdx].description = e.target.value;
                      onChange({ ...resume, projects: copy });
                    }}
                    placeholder="Brief description of architecture and user problem solved..."
                    className="w-full text-xs p-2 rounded-lg border border-input bg-background resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. HACKATHONS (Crucial differentiator for students/freshers) */}
      {(activeSection === "hackathons" || activeSection === "all") && (
        <section id="sec-hackathons" className="space-y-4 max-w-3xl">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <div>
              <h3 className="text-base font-bold text-foreground">Hackathons & Coding Contests</h3>
              <p className="text-xs text-muted-foreground">Smart India Hackathon, college sprints, and competitive coding milestones.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const newHack: HackathonItem = {
                  id: generateId(),
                  name: "",
                  project: "",
                  role: "",
                  date: "",
                  award: "",
                  description: "",
                };
                onChange({ ...resume, hackathons: [newHack, ...(resume.hackathons || [])] });
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" /> Add Hackathon
            </button>
          </div>

          <div className="space-y-3">
            {(resume.hackathons || []).map((h, hIdx) => (
              <div key={h.id} className="p-3.5 rounded-xl border border-border bg-card space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-foreground">Hackathon #{hIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = resume.hackathons.filter((_, i) => i !== hIdx);
                      onChange({ ...resume, hackathons: updated });
                    }}
                    className="text-muted-foreground hover:text-destructive p-1 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={h.name}
                    onChange={(e) => {
                      const copy = [...resume.hackathons];
                      copy[hIdx].name = e.target.value;
                      onChange({ ...resume, hackathons: copy });
                    }}
                    placeholder="Hackathon Name (e.g. Smart India Hackathon)"
                    className="text-xs px-3 py-1.5 rounded-lg border border-input bg-background"
                  />
                  <input
                    type="text"
                    value={h.award}
                    onChange={(e) => {
                      const copy = [...resume.hackathons];
                      copy[hIdx].award = e.target.value;
                      onChange({ ...resume, hackathons: copy });
                    }}
                    placeholder="Award / Rank (e.g. 1st Place / Finalist)"
                    className="text-xs px-3 py-1.5 rounded-lg border border-input bg-background"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AI Assistant Modal Integration */}
      <AIModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        type={aiTarget.type}
        initialRole={resume.personalInfo.title || "Software Engineer"}
        initialText={aiTarget.initialText}
        skills={resume.skills?.flatMap((c) => c.skills.map((s) => s.name)) || []}
        isFresher={Boolean(resume.style?.templateId?.includes("fresher"))}
        onApply={(text) => {
          if (aiTarget.type === "summary") {
            handleApplyAISummary(text);
          } else {
            handleApplyAIBullet(text);
          }
        }}
      />
    </div>
  );
};
