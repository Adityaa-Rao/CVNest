"use client";

import React from "react";
import { ResumeData } from "@/types/resume";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Code,
  FolderGit2,
  Building2,
  Award,
  Trophy,
  Flame,
  BookMarked,
  Languages,
  HeartHandshake,
  Users,
  Medal,
  Contact,
  PlusCircle,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

interface LeftPanelSectionsProps {
  resume: ResumeData;
  activeSection: string;
  onSelectSection: (secId: string) => void;
  onToggleHideSection: (secId: string) => void;
  onAddCustomSection: () => void;
}

export const LeftPanelSections: React.FC<LeftPanelSectionsProps> = ({
  resume,
  activeSection,
  onSelectSection,
  onToggleHideSection,
  onAddCustomSection,
}) => {
  const hidden = new Set(resume.style?.hiddenSections || []);

  const sections = [
    { id: "personalInfo", label: "Personal Details", icon: User, count: resume.personalInfo?.fullName ? 1 : 0 },
    { id: "summary", label: "Professional Summary", icon: FileText, count: resume.personalInfo?.summary ? 1 : 0 },
    { id: "experience", label: "Work Experience", icon: Briefcase, count: resume.experience?.length || 0 },
    { id: "education", label: "Education", icon: GraduationCap, count: resume.education?.length || 0 },
    { id: "skills", label: "Technical & Soft Skills", icon: Code, count: resume.skills?.length || 0 },
    { id: "projects", label: "Projects", icon: FolderGit2, count: resume.projects?.length || 0 },
    { id: "internships", label: "Internships", icon: Building2, count: resume.internships?.length || 0 },
    { id: "certifications", label: "Certifications", icon: Award, count: resume.certifications?.length || 0 },
    { id: "achievements", label: "Key Achievements", icon: Trophy, count: resume.achievements?.length || 0 },
    { id: "hackathons", label: "Hackathons", icon: Flame, count: resume.hackathons?.length || 0 },
    { id: "publications", label: "Publications", icon: BookMarked, count: resume.publications?.length || 0 },
    { id: "languages", label: "Languages", icon: Languages, count: resume.languages?.length || 0 },
    { id: "volunteer", label: "Volunteer Work", icon: HeartHandshake, count: resume.volunteer?.length || 0 },
    { id: "extracurricular", label: "Extracurriculars", icon: Users, count: resume.extracurricular?.length || 0 },
    { id: "awards", label: "Awards & Honors", icon: Medal, count: resume.awards?.length || 0 },
    { id: "references", label: "References", icon: Contact, count: resume.references?.length || 0 },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card/50 flex flex-col h-full overflow-hidden flex-shrink-0 select-none">
      <div className="p-3.5 border-b border-border bg-card">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Resume Sections
        </h2>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Select to edit or toggle visibility
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isSelected = activeSection === sec.id;
          const isHidden = hidden.has(sec.id);
          const isCompleted = sec.count > 0;

          return (
            <div
              key={sec.id}
              onClick={() => onSelectSection(sec.id)}
              className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : isHidden
                  ? "text-muted-foreground/60 hover:bg-secondary/40"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`} />
                <span className="truncate">{sec.label}</span>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {isCompleted && !isHidden && (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? "text-primary-foreground" : "text-emerald-500"}`} />
                )}
                {sec.id !== "personalInfo" && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleHideSection(sec.id);
                    }}
                    title={isHidden ? "Unhide Section" : "Hide Section in Preview"}
                    className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                      isSelected ? "hover:bg-primary-foreground/20 text-primary-foreground" : "hover:bg-border text-muted-foreground"
                    }`}
                  >
                    {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Custom Sections Added by User */}
        {resume.customSections?.map((custom) => {
          const isSelected = activeSection === custom.id;
          const isHidden = hidden.has(custom.id);

          return (
            <div
              key={custom.id}
              onClick={() => onSelectSection(custom.id)}
              className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{custom.title}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleHideSection(custom.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
              >
                {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-border bg-card">
        <button
          type="button"
          onClick={onAddCustomSection}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-dashed border-border hover:border-primary text-xs font-medium text-foreground hover:text-primary hover:bg-primary/5 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Custom Section</span>
        </button>
      </div>
    </aside>
  );
};
