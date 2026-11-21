import React from "react";
import { ResumeData } from "@/types/resume";
import { cn } from "@/lib/utils";

interface TemplateWrapperProps {
  resume: ResumeData;
  children: React.ReactNode;
  className?: string;
}

export const TemplateWrapper: React.FC<TemplateWrapperProps> = ({ resume, children, className }) => {
  const { style } = resume;
  const paperSize = style?.paperSize || "a4";
  const fontFamily = style?.fontFamily || "inter";
  const fontSize = style?.fontSize || "md";
  const spacing = style?.spacing || "normal";
  const margins = style?.margins || "md";

  // Spacing scales
  const spacingClasses = {
    compact: "space-y-2 leading-snug",
    normal: "space-y-3.5 leading-normal",
    relaxed: "space-y-5 leading-relaxed",
  }[spacing];

  // Margins scale
  const marginClasses = {
    sm: "p-6",
    md: "p-8 md:p-10",
    lg: "p-12",
  }[margins];

  // Font family styles
  const fontClasses: Record<string, string> = {
    inter: "font-sans",
    jakarta: "font-display",
    merriweather: "font-serif",
    roboto: "font-sans",
    fira: "font-mono",
    playfair: "font-serif",
  };

  // Font size scale
  const fontSizeClasses = {
    sm: "text-[12px]",
    md: "text-[13.5px]",
    lg: "text-[15px]",
  }[fontSize];

  return (
    <div
      className={cn(
        "resume-paper bg-white text-zinc-900 shadow-xl transition-all duration-200 relative mx-auto overflow-hidden",
        paperSize === "letter"
          ? "w-[8.5in] min-h-[11in]"
          : "w-[210mm] min-h-[297mm]",
        fontClasses[fontFamily] || "font-sans",
        fontSizeClasses,
        marginClasses,
        className
      )}
      style={
        {
          "--accent-color": style?.accentColor || "#4f46e5",
        } as React.CSSProperties
      }
    >
      <div className={spacingClasses}>{children}</div>
    </div>
  );
};
