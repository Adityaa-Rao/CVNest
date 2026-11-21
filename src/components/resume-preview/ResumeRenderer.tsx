import React from "react";
import { ResumeData } from "@/types/resume";
import { ATSTemplates } from "./templates/ATSTemplates";
import { ModernTemplates } from "./templates/ModernTemplates";
import { CreativeTemplates } from "./templates/CreativeTemplates";
import { FresherTemplates } from "./templates/FresherTemplates";

interface ResumeRendererProps {
  resume: ResumeData;
  scale?: number;
  className?: string;
}

export const ResumeRenderer: React.FC<ResumeRendererProps> = ({
  resume,
  scale = 1,
  className = "",
}) => {
  const templateId = resume.style?.templateId || "classic-ats";

  const renderSelectedTemplate = () => {
    switch (templateId) {
      // Category A: ATS-Friendly
      case "classic-ats":
      case "minimal-professional":
      case "corporate-standard":
      case "modern-ats":
      case "executive-traditional":
        return <ATSTemplates resume={resume} />;

      // Category B: Modern
      case "modern-professional":
      case "elegant-blue":
      case "contemporary-slate":
      case "minimal-clean":
      case "executive-pro":
        return <ModernTemplates resume={resume} />;

      // Category C: Creative
      case "creative-designer":
      case "modern-sidebar":
      case "portfolio-style":
      case "elegant-creative":
      case "visual-professional":
        return <CreativeTemplates resume={resume} />;

      // Category D: Student & Fresher
      case "college-graduate":
      case "btech-fresher":
      case "software-developer":
      case "internship-ready":
      case "academic-research":
        return <FresherTemplates resume={resume} />;

      default:
        return <ATSTemplates resume={resume} />;
    }
  };

  return (
    <div
      className={`resume-container transition-transform duration-150 origin-top flex justify-center ${className}`}
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
      }}
    >
      <div id="resume-print-area">
        {renderSelectedTemplate()}
      </div>
    </div>
  );
};
