import React from "react";
import { ResumeData } from "@/types/resume";
import { TemplateWrapper } from "../TemplateWrapper";
import { formatDate } from "@/lib/utils";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

interface Props {
  resume: ResumeData;
}

export const ATSTemplates: React.FC<Props> = ({ resume }) => {
  const { templateId = "classic-ats", accentColor = "#1e293b" } = resume.style || {};
  const p = resume.personalInfo;

  // Filter hidden sections
  const hidden = new Set(resume.style?.hiddenSections || []);
  const show = (sec: string) => !hidden.has(sec);

  // Common contact list renderer
  const renderContactBar = (inline = true) => (
    <div
      className={
        inline
          ? "flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-zinc-600 mt-1.5"
          : "grid grid-cols-2 gap-1 text-xs text-zinc-600 mt-2"
      }
    >
      {p.email && (
        <span className="flex items-center gap-1">
          <Mail className="w-3 h-3 text-zinc-500" />
          <a href={`mailto:${p.email}`} className="hover:underline">{p.email}</a>
        </span>
      )}
      {p.phone && (
        <span className="flex items-center gap-1">
          <Phone className="w-3 h-3 text-zinc-500" />
          <span>{p.phone}</span>
        </span>
      )}
      {(p.city || p.country) && (
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-zinc-500" />
          <span>{[p.city, p.state, p.country].filter(Boolean).join(", ")}</span>
        </span>
      )}
      {p.linkedin && (
        <span className="flex items-center gap-1">
          <Linkedin className="w-3 h-3 text-zinc-500" />
          <a href={p.linkedin.startsWith("http") ? p.linkedin : `https://${p.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">
            {p.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "in/")}
          </a>
        </span>
      )}
      {p.github && (
        <span className="flex items-center gap-1">
          <Github className="w-3 h-3 text-zinc-500" />
          <a href={p.github.startsWith("http") ? p.github : `https://${p.github}`} target="_blank" rel="noreferrer" className="hover:underline">
            {p.github.replace(/^https?:\/\/(www\.)?github\.com\//, "gh/")}
          </a>
        </span>
      )}
      {p.portfolio && (
        <span className="flex items-center gap-1">
          <Globe className="w-3 h-3 text-zinc-500" />
          <a href={p.portfolio.startsWith("http") ? p.portfolio : `https://${p.portfolio}`} target="_blank" rel="noreferrer" className="hover:underline">
            {p.portfolio.replace(/^https?:\/\//, "")}
          </a>
        </span>
      )}
    </div>
  );

  // Template 1: Classic ATS (Single column, bold serif/clean headers, horizontal line)
  if (templateId === "classic-ats") {
    return (
      <TemplateWrapper resume={resume}>
        {/* Header */}
        <header className="text-center pb-2 border-b border-zinc-300">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            {p.fullName || "Your Full Name"}
          </h1>
          {p.title && <p className="text-sm font-medium text-zinc-700 mt-0.5">{p.title}</p>}
          {renderContactBar(true)}
        </header>

        {/* Summary */}
        {show("summary") && p.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-0.5 mb-1.5">
              Professional Summary
            </h2>
            <p className="text-xs text-zinc-700 leading-relaxed text-justify">{p.summary}</p>
          </section>
        )}

        {/* Experience */}
        {show("experience") && resume.experience?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-0.5 mb-2">
              Work Experience
            </h2>
            <div className="space-y-3">
              {resume.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline text-xs">
                    <div>
                      <span className="font-bold text-zinc-900">{exp.position}</span>
                      <span className="text-zinc-600 font-medium"> — {exp.company}</span>
                    </div>
                    <span className="text-zinc-500 font-mono text-[11px]">
                      {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.location && <div className="text-[11px] text-zinc-500 italic">{exp.location}</div>}
                  {exp.description && <p className="text-xs text-zinc-700 mt-1">{exp.description}</p>}
                  {exp.achievements?.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1 text-xs text-zinc-700 space-y-0.5">
                      {exp.achievements.map((item, idx) => (
                        <li key={idx} className="leading-snug">{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {show("education") && resume.education?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-0.5 mb-2">
              Education
            </h2>
            <div className="space-y-2">
              {resume.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline text-xs">
                    <div>
                      <span className="font-bold text-zinc-900">{edu.institution}</span>
                      <span className="text-zinc-600"> — {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}</span>
                    </div>
                    <span className="text-zinc-500 font-mono text-[11px]">
                      {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-500 mt-0.5">
                    {edu.grade && <span>Grade / CGPA: <strong className="text-zinc-700">{edu.grade}</strong></span>}
                    {edu.location && <span>{edu.location}</span>}
                  </div>
                  {edu.coursework && <div className="text-[11px] text-zinc-600 mt-0.5">Coursework: {edu.coursework}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {show("skills") && resume.skills?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-0.5 mb-1.5">
              Technical Competencies
            </h2>
            <div className="space-y-1 text-xs">
              {resume.skills.map((cat) => (
                <div key={cat.id} className="flex">
                  <span className="font-semibold text-zinc-900 w-44 flex-shrink-0">{cat.categoryName}:</span>
                  <span className="text-zinc-700 flex-1">{cat.skills?.map((s) => s.name).join(", ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {show("projects") && resume.projects?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-0.5 mb-2">
              Key Projects
            </h2>
            <div className="space-y-2.5">
              {resume.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-zinc-900">{proj.name}</span>
                    <div className="text-[11px] space-x-2">
                      {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Code</a>}
                      {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Live Demo</a>}
                    </div>
                  </div>
                  {proj.technologies?.length > 0 && (
                    <div className="text-[11px] text-zinc-500 font-mono">Stack: {proj.technologies.join(", ")}</div>
                  )}
                  {proj.description && <p className="text-xs text-zinc-700 mt-0.5">{proj.description}</p>}
                  {proj.keyContributions?.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-0.5 text-xs text-zinc-700 space-y-0.5">
                      {proj.keyContributions.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Achievements */}
        {show("certifications") && resume.certifications?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-0.5 mb-1.5">
              Certifications
            </h2>
            <div className="space-y-1 text-xs">
              {resume.certifications.map((c) => (
                <div key={c.id} className="flex justify-between">
                  <span><strong className="text-zinc-900">{c.name}</strong> — {c.issuer}</span>
                  <span className="text-zinc-500 font-mono text-[11px]">{formatDate(c.issueDate)}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </TemplateWrapper>
    );
  }

  // Template 2: Minimal Professional (Clean lines, modern sans, high whitespace)
  if (templateId === "minimal-professional") {
    return (
      <TemplateWrapper resume={resume}>
        <header className="pb-3 border-b-2" style={{ borderColor: accentColor }}>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{p.fullName || "Your Full Name"}</h1>
              {p.title && <p className="text-xs font-semibold uppercase tracking-wider mt-0.5" style={{ color: accentColor }}>{p.title}</p>}
            </div>
            <div className="text-right text-[11px] text-zinc-500 space-y-0.5">
              {p.email && <div>{p.email}</div>}
              {p.phone && <div>{p.phone}</div>}
              {p.city && <div>{[p.city, p.country].filter(Boolean).join(", ")}</div>}
            </div>
          </div>
        </header>

        {show("summary") && p.summary && (
          <section>
            <p className="text-xs text-zinc-700 leading-relaxed italic border-l-2 pl-3 py-0.5" style={{ borderColor: accentColor }}>
              {p.summary}
            </p>
          </section>
        )}

        {show("experience") && resume.experience?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              Professional Experience
            </h2>
            <div className="space-y-3">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="text-xs">
                  <div className="flex justify-between font-semibold text-zinc-900">
                    <span>{exp.position} · <span className="font-normal text-zinc-600">{exp.company}</span></span>
                    <span className="font-mono text-[11px] text-zinc-500">{formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}</span>
                  </div>
                  {exp.achievements?.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1 text-zinc-600 space-y-0.5">
                      {exp.achievements.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {show("education") && resume.education?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              Education
            </h2>
            <div className="space-y-2">
              {resume.education.map((edu) => (
                <div key={edu.id} className="text-xs flex justify-between">
                  <div>
                    <div className="font-semibold text-zinc-900">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</div>
                    <div className="text-zinc-600 text-[11px]">{edu.institution} {edu.grade && `· Grade: ${edu.grade}`}</div>
                  </div>
                  <span className="font-mono text-[11px] text-zinc-500">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {show("skills") && resume.skills?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              Core Competencies
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {resume.skills.flatMap((cat) => cat.skills).map((skill, i) => (
                <span key={i} className="text-[11px] bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded border border-zinc-200">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </TemplateWrapper>
    );
  }

  // Template 3: Corporate Standard
  if (templateId === "corporate-standard") {
    return (
      <TemplateWrapper resume={resume}>
        <header className="border-l-4 pl-4 py-1" style={{ borderColor: accentColor }}>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{p.fullName}</h1>
          <p className="text-xs font-medium text-zinc-600 uppercase tracking-widest">{p.title}</p>
          <div className="text-[11px] text-zinc-500 mt-1 flex flex-wrap gap-x-4">
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>{p.phone}</span>}
            {p.city && <span>{[p.city, p.country].filter(Boolean).join(", ")}</span>}
            {p.linkedin && <span>{p.linkedin}</span>}
          </div>
        </header>

        {show("summary") && p.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 bg-zinc-100 px-2 py-1 rounded">
              Executive Summary
            </h2>
            <p className="text-xs text-zinc-700 leading-relaxed mt-1.5 px-1">{p.summary}</p>
          </section>
        )}

        {show("experience") && resume.experience?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 bg-zinc-100 px-2 py-1 rounded mb-2">
              Professional Tenure
            </h2>
            <div className="space-y-3 px-1">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="text-xs">
                  <div className="flex justify-between font-bold text-zinc-900">
                    <span>{exp.position} — <span className="font-medium text-zinc-700">{exp.company}</span></span>
                    <span className="font-normal text-zinc-500">{formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}</span>
                  </div>
                  {exp.achievements?.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1 text-zinc-600 space-y-0.5">
                      {exp.achievements.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {show("education") && resume.education?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 bg-zinc-100 px-2 py-1 rounded mb-2">
              Education & Credentials
            </h2>
            <div className="space-y-2 px-1">
              {resume.education.map((edu) => (
                <div key={edu.id} className="text-xs flex justify-between">
                  <div>
                    <span className="font-bold text-zinc-900">{edu.institution}</span>: {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                  </div>
                  <span className="text-zinc-500">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {show("skills") && resume.skills?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 bg-zinc-100 px-2 py-1 rounded mb-2">
              Areas of Expertise
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs px-1">
              {resume.skills.map((cat) => (
                <div key={cat.id}>
                  <strong className="text-zinc-900">{cat.categoryName}: </strong>
                  <span className="text-zinc-600">{cat.skills?.map((s) => s.name).join(", ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </TemplateWrapper>
    );
  }

  // Template 4: Modern ATS (Clean badges, structured grid)
  if (templateId === "modern-ats") {
    return (
      <TemplateWrapper resume={resume}>
        <header className="border-b border-zinc-200 pb-2">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">{p.fullName}</h1>
              <p className="text-xs font-semibold text-zinc-600 mt-0.5">{p.title}</p>
            </div>
            <div className="text-right text-[11px] text-zinc-500">
              {p.email && <div>{p.email}</div>}
              {p.phone && <div>{p.phone}</div>}
              {p.city && <div>{[p.city, p.country].filter(Boolean).join(", ")}</div>}
            </div>
          </div>
        </header>

        {show("summary") && p.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-1">About Me</h2>
            <p className="text-xs text-zinc-700 leading-relaxed">{p.summary}</p>
          </section>
        )}

        {show("experience") && resume.experience?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2">Work Experience</h2>
            <div className="space-y-3">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="text-xs border-l-2 pl-3" style={{ borderColor: accentColor }}>
                  <div className="flex justify-between font-bold text-zinc-900">
                    <span>{exp.position} · {exp.company}</span>
                    <span className="font-mono text-[11px] text-zinc-500">{formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}</span>
                  </div>
                  {exp.achievements?.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1 text-zinc-600 space-y-0.5">
                      {exp.achievements.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {show("skills") && resume.skills?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-1.5">Skills</h2>
            <div className="space-y-1 text-xs">
              {resume.skills.map((cat) => (
                <div key={cat.id} className="flex">
                  <span className="font-semibold text-zinc-800 w-36 flex-shrink-0">{cat.categoryName}:</span>
                  <span className="text-zinc-600">{cat.skills.map((s) => s.name).join(", ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {show("education") && resume.education?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-1.5">Education</h2>
            <div className="space-y-1.5 text-xs">
              {resume.education.map((edu) => (
                <div key={edu.id} className="flex justify-between">
                  <div>
                    <span className="font-bold text-zinc-900">{edu.degree}</span> · {edu.institution}
                  </div>
                  <span className="font-mono text-[11px] text-zinc-500">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </TemplateWrapper>
    );
  }

  // Template 5: Executive Traditional (Centered serif, formal dividers)
  return (
    <TemplateWrapper resume={resume}>
      <header className="text-center pb-2 border-b-2 border-zinc-900">
        <h1 className="text-2xl font-serif font-bold text-zinc-900 tracking-wide">{p.fullName}</h1>
        {p.title && <p className="text-xs font-serif italic text-zinc-700 mt-0.5">{p.title}</p>}
        {renderContactBar(true)}
      </header>

      {show("summary") && p.summary && (
        <section>
          <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-center text-zinc-900 mb-1">
            Executive Profile
          </h2>
          <p className="text-xs font-serif text-zinc-800 leading-relaxed text-justify">{p.summary}</p>
        </section>
      )}

      {show("experience") && resume.experience?.length > 0 && (
        <section>
          <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-center text-zinc-900 border-b border-zinc-300 pb-0.5 mb-2">
            Professional Experience
          </h2>
          <div className="space-y-3">
            {resume.experience.map((exp) => (
              <div key={exp.id} className="text-xs font-serif">
                <div className="flex justify-between font-bold text-zinc-900">
                  <span>{exp.position}, <span className="font-normal italic">{exp.company}</span></span>
                  <span className="font-normal text-zinc-600">{formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}</span>
                </div>
                {exp.achievements?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 text-zinc-700 space-y-0.5">
                    {exp.achievements.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {show("education") && resume.education?.length > 0 && (
        <section>
          <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-center text-zinc-900 border-b border-zinc-300 pb-0.5 mb-2">
            Education
          </h2>
          <div className="space-y-1.5 text-xs font-serif">
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex justify-between">
                <div>
                  <span className="font-bold text-zinc-900">{edu.institution}</span>, {edu.degree} in {edu.fieldOfStudy}
                </div>
                <span className="text-zinc-600">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {show("skills") && resume.skills?.length > 0 && (
        <section>
          <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-center text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5">
            Key Competencies
          </h2>
          <div className="text-xs font-serif text-center text-zinc-700">
            {resume.skills.flatMap((c) => c.skills.map((s) => s.name)).join(" · ")}
          </div>
        </section>
      )}
    </TemplateWrapper>
  );
};
