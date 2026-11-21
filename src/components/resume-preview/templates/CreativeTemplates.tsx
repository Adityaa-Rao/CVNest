import React from "react";
import { ResumeData } from "@/types/resume";
import { TemplateWrapper } from "../TemplateWrapper";
import { formatDate } from "@/lib/utils";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Star, ExternalLink } from "lucide-react";

interface Props {
  resume: ResumeData;
}

export const CreativeTemplates: React.FC<Props> = ({ resume }) => {
  const { templateId = "creative-designer", accentColor = "#7c3aed" } = resume.style || {};
  const p = resume.personalInfo;
  const hidden = new Set(resume.style?.hiddenSections || []);
  const show = (sec: string) => !hidden.has(sec);

  // Template 11: Creative Designer (Full height colored left sidebar)
  if (templateId === "creative-designer") {
    return (
      <TemplateWrapper resume={resume} className="p-0">
        <div className="grid grid-cols-12 min-h-full">
          {/* Left Colored Sidebar (4 cols) */}
          <div className="col-span-4 p-6 text-white space-y-5" style={{ backgroundColor: accentColor }}>
            <div className="text-center">
              {p.avatarUrl ? (
                <img src={p.avatarUrl} alt={p.fullName} className="w-20 h-20 rounded-full mx-auto border-2 border-white/80 object-cover shadow" />
              ) : (
                <div className="w-16 h-16 rounded-full mx-auto bg-white/20 flex items-center justify-center text-xl font-bold">
                  {p.fullName ? p.fullName.charAt(0) : "R"}
                </div>
              )}
              <h1 className="text-xl font-bold mt-3 leading-tight">{p.fullName}</h1>
              <p className="text-xs opacity-90 mt-1 font-medium">{p.title}</p>
            </div>

            {/* Contact details */}
            <div className="space-y-2 text-xs border-t border-white/20 pt-4">
              <div className="font-bold uppercase tracking-wider text-[10px] opacity-75">Contact</div>
              {p.email && <div className="break-all">{p.email}</div>}
              {p.phone && <div>{p.phone}</div>}
              {p.city && <div>{[p.city, p.country].filter(Boolean).join(", ")}</div>}
              {p.portfolio && <div className="break-all">{p.portfolio}</div>}
              {p.linkedin && <div className="break-all">{p.linkedin}</div>}
            </div>

            {/* Skills with dots */}
            {show("skills") && resume.skills?.length > 0 && (
              <div className="space-y-3 border-t border-white/20 pt-4 text-xs">
                <div className="font-bold uppercase tracking-wider text-[10px] opacity-75">Design & Tools</div>
                {resume.skills.flatMap((c) => c.skills).slice(0, 10).map((skill, i) => (
                  <div key={i} className="flex justify-between items-center text-[11px]">
                    <span>{skill.name}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <div key={dot} className={`w-1.5 h-1.5 rounded-full ${dot <= (skill.level ? Math.round(skill.level / 20) : 4) ? "bg-white" : "bg-white/30"}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Content Area (8 cols) */}
          <div className="col-span-8 p-6 md:p-8 space-y-4">
            {show("summary") && p.summary && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-1 mb-1.5" style={{ color: accentColor }}>
                  About Me
                </h2>
                <p className="text-xs text-zinc-700 leading-relaxed">{p.summary}</p>
              </section>
            )}

            {show("experience") && resume.experience?.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-1 mb-2" style={{ color: accentColor }}>
                  Work Experience
                </h2>
                <div className="space-y-3">
                  {resume.experience.map((exp) => (
                    <div key={exp.id} className="text-xs">
                      <div className="flex justify-between font-bold text-zinc-900">
                        <span>{exp.position}</span>
                        <span className="font-mono text-[11px] text-zinc-500">{formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}</span>
                      </div>
                      <div className="text-[11px] font-medium text-zinc-600">{exp.company}</div>
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
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-1 mb-2" style={{ color: accentColor }}>
                  Portfolio Highlights
                </h2>
                <div className="space-y-2 text-xs">
                  {resume.projects.map((proj) => (
                    <div key={proj.id} className="border border-zinc-200 p-2 rounded bg-zinc-50/50">
                      <div className="flex justify-between font-bold text-zinc-900">
                        <span>{proj.name}</span>
                        {proj.liveUrl && <a href={proj.liveUrl} className="text-[11px] underline" style={{ color: accentColor }}>Visit</a>}
                      </div>
                      {proj.description && <p className="text-zinc-600 text-[11px] mt-0.5">{proj.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {show("education") && resume.education?.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-1 mb-2" style={{ color: accentColor }}>
                  Education
                </h2>
                <div className="space-y-1.5 text-xs">
                  {resume.education.map((edu) => (
                    <div key={edu.id} className="flex justify-between">
                      <div><strong className="text-zinc-900">{edu.institution}</strong> — {edu.degree}</div>
                      <span className="text-zinc-500 font-mono text-[11px]">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
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

  // Template 12: Modern Sidebar (Dark left charcoal sidebar)
  if (templateId === "modern-sidebar") {
    return (
      <TemplateWrapper resume={resume} className="p-0">
        <div className="grid grid-cols-12 min-h-full">
          {/* Charcoal Left Sidebar */}
          <div className="col-span-4 bg-zinc-900 text-zinc-100 p-6 space-y-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight">{p.fullName}</h1>
              <p className="text-xs text-zinc-400 mt-0.5">{p.title}</p>
            </div>

            <div className="space-y-1.5 text-xs text-zinc-300 border-t border-zinc-800 pt-3">
              {p.email && <div className="break-all">{p.email}</div>}
              {p.phone && <div>{p.phone}</div>}
              {p.city && <div>{[p.city, p.country].filter(Boolean).join(", ")}</div>}
              {p.github && <div className="break-all">{p.github}</div>}
            </div>

            {show("skills") && resume.skills?.length > 0 && (
              <div className="space-y-2 border-t border-zinc-800 pt-3 text-xs">
                <div className="font-bold uppercase tracking-wider text-[10px] text-zinc-400">Skills</div>
                {resume.skills.map((c) => (
                  <div key={c.id}>
                    <div className="text-[11px] text-zinc-300 font-medium">{c.categoryName}</div>
                    <div className="text-[10px] text-zinc-400">{c.skills.map((s) => s.name).join(", ")}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right White Content */}
          <div className="col-span-8 p-6 md:p-8 space-y-4 bg-white">
            {show("summary") && p.summary && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-1 mb-1.5">Profile</h2>
                <p className="text-xs text-zinc-700 leading-relaxed">{p.summary}</p>
              </section>
            )}

            {show("experience") && resume.experience?.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-1 mb-2">Experience</h2>
                <div className="space-y-3">
                  {resume.experience.map((exp) => (
                    <div key={exp.id} className="text-xs">
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

            {show("education") && resume.education?.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-1 mb-2">Education</h2>
                <div className="space-y-1.5 text-xs">
                  {resume.education.map((edu) => (
                    <div key={edu.id} className="flex justify-between">
                      <div><strong className="text-zinc-900">{edu.degree}</strong>, {edu.institution}</div>
                      <span className="text-zinc-500 font-mono text-[11px]">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
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

  // Template 13: Portfolio Style (Project-first, rich cards)
  if (templateId === "portfolio-style") {
    return (
      <TemplateWrapper resume={resume}>
        <header className="pb-3 border-b-2" style={{ borderColor: accentColor }}>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-zinc-900">{p.fullName}</h1>
              <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">{p.title}</p>
            </div>
            <div className="text-right text-[11px] text-zinc-500 space-y-0.5">
              {p.email && <div>{p.email}</div>}
              {p.portfolio && <div className="font-semibold" style={{ color: accentColor }}>{p.portfolio}</div>}
            </div>
          </div>
        </header>

        {show("projects") && resume.projects?.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-2 flex items-center justify-between">
              <span>Selected Projects & Portfolios</span>
              <span className="text-[10px] font-normal text-zinc-400">Live Deployments</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {resume.projects.map((proj) => (
                <div key={proj.id} className="border border-zinc-200 rounded-lg p-2.5 bg-zinc-50/50 flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-xs text-zinc-900">{proj.name}</div>
                    {proj.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.technologies.slice(0, 4).map((tech, i) => (
                          <span key={i} className="text-[9px] bg-white border border-zinc-200 px-1 py-0.5 rounded text-zinc-700">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {proj.description && <p className="text-[11px] text-zinc-600 mt-1 line-clamp-2">{proj.description}</p>}
                  </div>
                  <div className="flex gap-2 mt-2 pt-2 border-t border-zinc-200 text-[10px]">
                    {proj.githubUrl && <a href={proj.githubUrl} className="text-zinc-600 hover:underline">GitHub</a>}
                    {proj.liveUrl && <a href={proj.liveUrl} className="font-bold" style={{ color: accentColor }}>Live App →</a>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {show("experience") && resume.experience?.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-2">Work Experience</h2>
            <div className="space-y-2.5">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="text-xs">
                  <div className="flex justify-between font-bold text-zinc-900">
                    <span>{exp.position} · {exp.company}</span>
                    <span className="font-mono text-[11px] text-zinc-500">{formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}</span>
                  </div>
                  {exp.achievements?.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-0.5 text-zinc-600 space-y-0.5">
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
      </TemplateWrapper>
    );
  }

  // Template 14 & 15: Elegant Creative & Visual Professional fallback
  return (
    <TemplateWrapper resume={resume}>
      <header className="text-center pb-3 border-b-2" style={{ borderColor: accentColor }}>
        <h1 className="text-2xl font-serif font-bold text-zinc-900">{p.fullName}</h1>
        <p className="text-xs font-sans uppercase tracking-widest text-zinc-500 mt-0.5">{p.title}</p>
        <div className="flex justify-center gap-3 text-[11px] text-zinc-500 mt-1.5">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.city && <span>{[p.city, p.country].filter(Boolean).join(", ")}</span>}
        </div>
      </header>

      {show("summary") && p.summary && (
        <section className="text-center max-w-xl mx-auto italic text-xs text-zinc-700">
          "{p.summary}"
        </section>
      )}

      {show("experience") && resume.experience?.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2" style={{ color: accentColor }}>
            Experience
          </h2>
          <div className="space-y-3">
            {resume.experience.map((exp) => (
              <div key={exp.id} className="text-xs">
                <div className="flex justify-between font-bold text-zinc-900">
                  <span>{exp.position} — {exp.company}</span>
                  <span className="text-zinc-500">{formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}</span>
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-1.5" style={{ color: accentColor }}>
            Skills
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {resume.skills.flatMap((c) => c.skills).map((skill, i) => (
              <span key={i} className="text-[11px] px-2 py-0.5 rounded-full border border-zinc-200 bg-zinc-50 text-zinc-800">
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </TemplateWrapper>
  );
};
