import React from "react";
import { ResumeData } from "@/types/resume";
import { TemplateWrapper } from "../TemplateWrapper";
import { formatDate } from "@/lib/utils";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Award, Briefcase, GraduationCap, Code } from "lucide-react";

interface Props {
  resume: ResumeData;
}

export const ModernTemplates: React.FC<Props> = ({ resume }) => {
  const { templateId = "modern-professional", accentColor = "#4f46e5" } = resume.style || {};
  const p = resume.personalInfo;
  const hidden = new Set(resume.style?.hiddenSections || []);
  const show = (sec: string) => !hidden.has(sec);

  // Template 6: Modern Professional (Asymmetric 2-column with colored banner)
  if (templateId === "modern-professional") {
    return (
      <TemplateWrapper resume={resume} className="p-0">
        {/* Top Header Banner */}
        <div className="p-6 md:p-8 text-white" style={{ backgroundColor: accentColor }}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{p.fullName}</h1>
              <p className="text-sm font-medium opacity-90 mt-1">{p.title}</p>
            </div>
            {p.avatarUrl && (
              <img src={p.avatarUrl} alt={p.fullName} className="w-16 h-16 rounded-full border-2 border-white object-cover" />
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-85 mt-3 pt-3 border-t border-white/20">
            {p.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {p.email}</span>}
            {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {p.phone}</span>}
            {p.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {[p.city, p.country].filter(Boolean).join(", ")}</span>}
            {p.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" /> {p.linkedin.replace(/^https?:\/\//, "")}</span>}
            {p.github && <span className="flex items-center gap-1"><Github className="w-3 h-3" /> {p.github.replace(/^https?:\/\//, "")}</span>}
          </div>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-12 gap-6 p-6 md:p-8">
          {/* Main Column (8 cols) */}
          <div className="col-span-8 space-y-4">
            {show("summary") && p.summary && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-1 mb-1.5 flex items-center gap-1.5" style={{ color: accentColor }}>
                  <Briefcase className="w-3.5 h-3.5" /> Professional Summary
                </h2>
                <p className="text-xs text-zinc-700 leading-relaxed">{p.summary}</p>
              </section>
            )}

            {show("experience") && resume.experience?.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-1 mb-2 flex items-center gap-1.5" style={{ color: accentColor }}>
                  <Briefcase className="w-3.5 h-3.5" /> Experience
                </h2>
                <div className="space-y-3">
                  {resume.experience.map((exp) => (
                    <div key={exp.id} className="text-xs">
                      <div className="flex justify-between items-baseline font-bold text-zinc-900">
                        <span>{exp.position}</span>
                        <span className="text-[11px] font-normal text-zinc-500">{formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}</span>
                      </div>
                      <div className="text-[11px] font-medium text-zinc-600">{exp.company} {exp.location && `· ${exp.location}`}</div>
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

            {show("projects") && resume.projects?.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-1 mb-2 flex items-center gap-1.5" style={{ color: accentColor }}>
                  <Code className="w-3.5 h-3.5" /> Featured Projects
                </h2>
                <div className="space-y-2.5">
                  {resume.projects.map((proj) => (
                    <div key={proj.id} className="text-xs">
                      <div className="flex justify-between font-bold text-zinc-900">
                        <span>{proj.name}</span>
                        {proj.liveUrl && <a href={proj.liveUrl} className="text-[11px] underline" style={{ color: accentColor }}>Demo</a>}
                      </div>
                      {proj.technologies?.length > 0 && (
                        <div className="text-[10px] text-zinc-500 font-mono">{proj.technologies.join(" · ")}</div>
                      )}
                      {proj.description && <p className="text-zinc-600 mt-0.5">{proj.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Column (4 cols) */}
          <div className="col-span-4 space-y-4 border-l border-zinc-100 pl-4">
            {show("skills") && resume.skills?.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-1 mb-2" style={{ color: accentColor }}>
                  Skills
                </h2>
                <div className="space-y-2">
                  {resume.skills.map((cat) => (
                    <div key={cat.id}>
                      <div className="text-[11px] font-bold text-zinc-800">{cat.categoryName}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {cat.skills?.map((s, idx) => (
                          <span key={idx} className="text-[10px] bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-700">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {show("education") && resume.education?.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-1 mb-2 flex items-center gap-1.5" style={{ color: accentColor }}>
                  <GraduationCap className="w-3.5 h-3.5" /> Education
                </h2>
                <div className="space-y-2">
                  {resume.education.map((edu) => (
                    <div key={edu.id} className="text-xs">
                      <div className="font-bold text-zinc-900">{edu.degree}</div>
                      <div className="text-zinc-600 text-[11px]">{edu.institution}</div>
                      <div className="text-zinc-500 text-[10px]">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</div>
                      {edu.grade && <div className="text-[10px] font-semibold text-zinc-700">GPA: {edu.grade}</div>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {show("certifications") && resume.certifications?.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-1 mb-2 flex items-center gap-1.5" style={{ color: accentColor }}>
                  <Award className="w-3.5 h-3.5" /> Certifications
                </h2>
                <div className="space-y-1.5 text-xs">
                  {resume.certifications.map((c) => (
                    <div key={c.id}>
                      <div className="font-semibold text-zinc-900 text-[11px]">{c.name}</div>
                      <div className="text-[10px] text-zinc-500">{c.issuer} · {formatDate(c.issueDate)}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </TemplateWrapper>
    );
  }

  // Template 7: Elegant Blue (Pill contacts, navy accent lines)
  if (templateId === "elegant-blue") {
    return (
      <TemplateWrapper resume={resume}>
        <header className="text-center pb-3">
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: accentColor }}>
            {p.fullName}
          </h1>
          <p className="text-xs font-semibold text-zinc-700 tracking-wider uppercase mt-0.5">{p.title}</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {p.email && <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{p.email}</span>}
            {p.phone && <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{p.phone}</span>}
            {p.city && <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{[p.city, p.country].filter(Boolean).join(", ")}</span>}
            {p.linkedin && <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{p.linkedin}</span>}
          </div>
        </header>

        {show("summary") && p.summary && (
          <section className="bg-slate-50 p-3 rounded-lg border border-slate-200/60">
            <p className="text-xs text-slate-700 leading-relaxed text-center">{p.summary}</p>
          </section>
        )}

        {show("experience") && resume.experience?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
              Experience History
            </h2>
            <div className="space-y-3">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{exp.position} · <span className="font-medium text-slate-600">{exp.company}</span></span>
                    <span className="font-mono text-[11px] text-slate-500">{formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}</span>
                  </div>
                  {exp.achievements?.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1 text-slate-700 space-y-0.5">
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
            <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
              Education
            </h2>
            <div className="space-y-2">
              {resume.education.map((edu) => (
                <div key={edu.id} className="text-xs flex justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{edu.degree}</span> in {edu.fieldOfStudy} — {edu.institution}
                  </div>
                  <span className="text-slate-500 text-[11px]">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {show("skills") && resume.skills?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
              Skills & Proficiencies
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {resume.skills.flatMap((c) => c.skills).map((skill, i) => (
                <span key={i} className="text-[11px] font-medium bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </TemplateWrapper>
    );
  }

  // Template 8: Contemporary Slate (Connected timeline dots)
  if (templateId === "contemporary-slate") {
    return (
      <TemplateWrapper resume={resume}>
        <header className="pb-3 border-b border-slate-300">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{p.fullName}</h1>
          <p className="text-xs font-medium text-slate-600">{p.title}</p>
          <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap gap-3">
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>{p.phone}</span>}
            {p.city && <span>{[p.city, p.country].filter(Boolean).join(", ")}</span>}
          </div>
        </header>

        {show("experience") && resume.experience?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">Experience Timeline</h2>
            <div className="relative border-l-2 border-slate-200 ml-2 space-y-4 pl-4">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="relative text-xs">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: accentColor }} />
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{exp.position} at {exp.company}</span>
                    <span className="font-mono text-[11px] text-slate-500">{formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}</span>
                  </div>
                  {exp.achievements?.length > 0 && (
                    <ul className="list-disc list-outside ml-3 mt-1 text-slate-700 space-y-0.5">
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Education</h2>
            <div className="space-y-1.5 text-xs">
              {resume.education.map((edu) => (
                <div key={edu.id} className="flex justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{edu.institution}</span> — {edu.degree}
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {show("skills") && resume.skills?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">Technical Stack</h2>
            <div className="space-y-1 text-xs">
              {resume.skills.map((c) => (
                <div key={c.id}>
                  <strong className="text-slate-800">{c.categoryName}: </strong>
                  <span className="text-slate-600">{c.skills.map((s) => s.name).join(", ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </TemplateWrapper>
    );
  }

  // Template 9: Minimal Clean
  if (templateId === "minimal-clean") {
    return (
      <TemplateWrapper resume={resume}>
        <header className="mb-2">
          <h1 className="text-3xl font-light tracking-tight text-zinc-900">{p.fullName}</h1>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mt-0.5">{p.title}</p>
          <div className="text-[11px] text-zinc-400 mt-1 flex flex-wrap gap-x-4">
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>{p.phone}</span>}
            {p.city && <span>{[p.city, p.country].filter(Boolean).join(", ")}</span>}
          </div>
        </header>

        {show("summary") && p.summary && (
          <section className="text-xs text-zinc-600 leading-relaxed font-light">{p.summary}</section>
        )}

        {show("experience") && resume.experience?.length > 0 && (
          <section>
            <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-2">Experience</h2>
            <div className="space-y-3">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="text-xs">
                  <div className="flex justify-between font-medium text-zinc-900">
                    <span>{exp.position} / {exp.company}</span>
                    <span className="text-zinc-400 text-[11px]">{formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}</span>
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
            <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-1.5">Expertise</h2>
            <div className="text-xs text-zinc-700">
              {resume.skills.flatMap((c) => c.skills.map((s) => s.name)).join(" · ")}
            </div>
          </section>
        )}
      </TemplateWrapper>
    );
  }

  // Template 10: Executive Pro (Full-width summary card, metrics, dual columns)
  return (
    <TemplateWrapper resume={resume}>
      <header className="flex justify-between items-center pb-3 border-b-2" style={{ borderColor: accentColor }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{p.fullName}</h1>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: accentColor }}>{p.title}</p>
        </div>
        <div className="text-right text-[11px] text-zinc-600 space-y-0.5">
          {p.email && <div>{p.email}</div>}
          {p.phone && <div>{p.phone}</div>}
          {p.linkedin && <div>{p.linkedin}</div>}
        </div>
      </header>

      {show("summary") && p.summary && (
        <section className="bg-zinc-50 border-l-4 p-3 rounded" style={{ borderColor: accentColor }}>
          <p className="text-xs text-zinc-700 leading-relaxed">{p.summary}</p>
        </section>
      )}

      {show("experience") && resume.experience?.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-1 mb-2">
            Executive Leadership & Experience
          </h2>
          <div className="space-y-3">
            {resume.experience.map((exp) => (
              <div key={exp.id} className="text-xs">
                <div className="flex justify-between font-bold text-zinc-900">
                  <span>{exp.position} — <span className="font-semibold text-zinc-700">{exp.company}</span></span>
                  <span className="font-mono text-[11px] text-zinc-500">{formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}</span>
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-1 mb-2">Education</h2>
          <div className="space-y-1.5 text-xs">
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex justify-between">
                <div><span className="font-bold text-zinc-900">{edu.institution}</span> · {edu.degree}</div>
                <span className="text-zinc-500">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </TemplateWrapper>
  );
};
