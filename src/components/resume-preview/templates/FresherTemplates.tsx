import React from "react";
import { ResumeData } from "@/types/resume";
import { TemplateWrapper } from "../TemplateWrapper";
import { formatDate } from "@/lib/utils";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Trophy, Code2, BookOpen, Sparkles } from "lucide-react";

interface Props {
  resume: ResumeData;
}

export const FresherTemplates: React.FC<Props> = ({ resume }) => {
  const { templateId = "btech-fresher", accentColor = "#0284c7" } = resume.style || {};
  const p = resume.personalInfo;
  const hidden = new Set(resume.style?.hiddenSections || []);
  const show = (sec: string) => !hidden.has(sec);

  // Common Header for Fresher / College Profiles
  const renderFresherHeader = () => (
    <header className="text-center pb-2.5 border-b-2" style={{ borderColor: accentColor }}>
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{p.fullName}</h1>
      {p.title && <p className="text-xs font-semibold mt-0.5" style={{ color: accentColor }}>{p.title}</p>}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-zinc-600 mt-1.5">
        {p.email && <span><a href={`mailto:${p.email}`}>{p.email}</a></span>}
        {p.phone && <span>{p.phone}</span>}
        {(p.city || p.country) && <span>{[p.city, p.country].filter(Boolean).join(", ")}</span>}
        {p.linkedin && <span><a href={p.linkedin} className="underline" target="_blank" rel="noreferrer">LinkedIn</a></span>}
        {p.github && <span><a href={p.github} className="underline" target="_blank" rel="noreferrer">GitHub</a></span>}
        {p.portfolio && <span><a href={p.portfolio} className="underline" target="_blank" rel="noreferrer">Portfolio</a></span>}
        {p.website && <span><a href={p.website} className="underline" target="_blank" rel="noreferrer">LeetCode / Profile</a></span>}
      </div>
    </header>
  );

  // Template 17: BTech Fresher (Special Indian engineering layout: CGPA, Hackathons, LeetCode, MERN projects)
  if (templateId === "btech-fresher") {
    return (
      <TemplateWrapper resume={resume}>
        {renderFresherHeader()}

        {/* Education First (Critical for Freshers) */}
        {show("education") && resume.education?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-0.5 mb-1.5 flex items-center gap-1.5" style={{ color: accentColor }}>
              <BookOpen className="w-3.5 h-3.5" /> Education
            </h2>
            <div className="space-y-2">
              {resume.education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-zinc-900">
                    <span>{edu.institution}</span>
                    <span className="font-mono text-[11px] text-zinc-500">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-700">
                    <span>{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</span>
                    {edu.grade && <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">CGPA / Score: {edu.grade}</span>}
                  </div>
                  {edu.coursework && <div className="text-[10px] text-zinc-500 mt-0.5">Relevant Coursework: {edu.coursework}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical Skills */}
        {show("skills") && resume.skills?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-0.5 mb-1.5 flex items-center gap-1.5" style={{ color: accentColor }}>
              <Code2 className="w-3.5 h-3.5" /> Technical Skills
            </h2>
            <div className="space-y-1 text-xs">
              {resume.skills.map((cat) => (
                <div key={cat.id} className="flex">
                  <span className="font-bold text-zinc-900 w-44 flex-shrink-0 text-[11px]">{cat.categoryName}:</span>
                  <span className="text-zinc-700 text-[11px] flex-1">{cat.skills.map((s) => s.name).join(", ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical Projects */}
        {show("projects") && resume.projects?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-0.5 mb-2 flex items-center gap-1.5" style={{ color: accentColor }}>
              <Sparkles className="w-3.5 h-3.5" /> Academic & Personal Projects
            </h2>
            <div className="space-y-2.5">
              {resume.projects.map((proj) => (
                <div key={proj.id} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-zinc-900">
                    <span>{proj.name}</span>
                    <div className="text-[10px] space-x-2 font-mono">
                      {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">GitHub</a>}
                      {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Live Demo</a>}
                    </div>
                  </div>
                  {proj.technologies?.length > 0 && (
                    <div className="text-[10px] font-mono text-zinc-500">Tech Stack: {proj.technologies.join(" | ")}</div>
                  )}
                  {proj.description && <p className="text-[11px] text-zinc-700 mt-0.5">{proj.description}</p>}
                  {proj.keyContributions?.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-0.5 text-[11px] text-zinc-700 space-y-0.5">
                      {proj.keyContributions.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Internships */}
        {show("internships") && resume.internships?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-0.5 mb-1.5" style={{ color: accentColor }}>
              Internship Experience
            </h2>
            <div className="space-y-2">
              {resume.internships.map((intern) => (
                <div key={intern.id} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-zinc-900">
                    <span>{intern.role} — <span className="font-medium text-zinc-700">{intern.company}</span></span>
                    <span className="font-mono text-[10px] text-zinc-500">{formatDate(intern.startDate)} – {formatDate(intern.endDate)}</span>
                  </div>
                  {intern.achievements?.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-0.5 text-[11px] text-zinc-700 space-y-0.5">
                      {intern.achievements.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hackathons & Competitions */}
        {show("hackathons") && resume.hackathons?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-0.5 mb-1.5 flex items-center gap-1.5" style={{ color: accentColor }}>
              <Trophy className="w-3.5 h-3.5" /> Hackathons & Competitions
            </h2>
            <div className="space-y-1.5 text-xs">
              {resume.hackathons.map((h) => (
                <div key={h.id}>
                  <div className="flex justify-between font-bold text-zinc-900">
                    <span>{h.name} — <span className="text-emerald-700 font-semibold">{h.award}</span></span>
                    <span className="font-mono text-[10px] text-zinc-500">{h.date}</span>
                  </div>
                  <div className="text-[11px] text-zinc-600">{h.project}: {h.description}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements & Coding Profiles */}
        {show("achievements") && resume.achievements?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-0.5 mb-1 flex items-center gap-1.5" style={{ color: accentColor }}>
              <Trophy className="w-3.5 h-3.5" /> Honors & Achievements
            </h2>
            <ul className="list-disc list-outside ml-4 text-[11px] text-zinc-700 space-y-0.5">
              {resume.achievements.map((ach) => (
                <li key={ach.id}>
                  <strong className="text-zinc-900">{ach.title}</strong>: {ach.description}
                </li>
              ))}
            </ul>
          </section>
        )}
      </TemplateWrapper>
    );
  }

  // Template 16: College Graduate
  if (templateId === "college-graduate") {
    return (
      <TemplateWrapper resume={resume}>
        {renderFresherHeader()}

        {show("summary") && p.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-0.5 mb-1">Career Objective</h2>
            <p className="text-xs text-zinc-700 leading-relaxed">{p.summary}</p>
          </section>
        )}

        {show("education") && resume.education?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-0.5 mb-1.5">Education</h2>
            <div className="space-y-2 text-xs">
              {resume.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between font-bold text-zinc-900">
                    <span>{edu.institution}</span>
                    <span className="text-zinc-500">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                  </div>
                  <div className="text-zinc-700">{edu.degree} in {edu.fieldOfStudy} {edu.grade && `(GPA: ${edu.grade})`}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {show("skills") && resume.skills?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-0.5 mb-1">Key Skills</h2>
            <div className="flex flex-wrap gap-1">
              {resume.skills.flatMap((c) => c.skills).map((s, i) => (
                <span key={i} className="text-[11px] bg-zinc-100 px-2 py-0.5 rounded text-zinc-800">
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {show("projects") && resume.projects?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-0.5 mb-1.5">Academic Projects</h2>
            <div className="space-y-2 text-xs">
              {resume.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="font-bold text-zinc-900">{proj.name}</div>
                  {proj.description && <p className="text-zinc-700">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </TemplateWrapper>
    );
  }

  // Template 18: Software Developer (Monospace tech styling, categorized stack)
  if (templateId === "software-developer") {
    return (
      <TemplateWrapper resume={resume} className="font-mono">
        <header className="border-b-2 border-zinc-900 pb-2">
          <div className="flex justify-between items-baseline">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">&lt;{p.fullName} /&gt;</h1>
              <p className="text-xs text-zinc-600 mt-0.5">// {p.title}</p>
            </div>
            <div className="text-right text-[11px] text-zinc-500">
              {p.email && <div>{p.email}</div>}
              {p.github && <div className="text-blue-600">{p.github}</div>}
            </div>
          </div>
        </header>

        {show("skills") && resume.skills?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-1">const skills = &#123;</h2>
            <div className="pl-4 space-y-0.5 text-xs text-zinc-700">
              {resume.skills.map((cat) => (
                <div key={cat.id}>
                  <span className="text-zinc-900 font-bold">"{cat.categoryName}": </span>
                  <span>[{cat.skills.map((s) => `"${s.name}"`).join(", ")}],</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-zinc-900 font-bold">&#125;;</div>
          </section>
        )}

        {show("projects") && resume.projects?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-0.5 mb-1.5">Repositories & Projects</h2>
            <div className="space-y-2 text-xs">
              {resume.projects.map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between font-bold text-zinc-900">
                    <span>{p.name}</span>
                    {p.liveUrl && <a href={p.liveUrl} className="text-blue-600 underline text-[10px]">deploy</a>}
                  </div>
                  <div className="text-[10px] text-zinc-500">[{p.technologies?.join(", ")}]</div>
                  <p className="text-[11px] text-zinc-700 mt-0.5">{p.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {show("education") && resume.education?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-0.5 mb-1.5">Education</h2>
            <div className="space-y-1 text-xs">
              {resume.education.map((edu) => (
                <div key={edu.id} className="flex justify-between">
                  <div><strong>{edu.institution}</strong> — {edu.degree}</div>
                  <span className="text-zinc-500 text-[10px]">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </TemplateWrapper>
    );
  }

  // Template 19 & 20 fallback: Internship Ready & Academic
  return (
    <TemplateWrapper resume={resume}>
      {renderFresherHeader()}

      {show("summary") && p.summary && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-0.5 mb-1">Objective</h2>
          <p className="text-xs text-zinc-700 leading-relaxed">{p.summary}</p>
        </section>
      )}

      {show("education") && resume.education?.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-0.5 mb-1.5">Academic Background</h2>
          <div className="space-y-1.5 text-xs">
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex justify-between">
                <div><strong>{edu.institution}</strong> — {edu.degree} in {edu.fieldOfStudy}</div>
                <span className="text-zinc-500 font-mono text-[11px]">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {show("projects") && resume.projects?.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-0.5 mb-1.5">Projects & Research</h2>
          <div className="space-y-2 text-xs">
            {resume.projects.map((proj) => (
              <div key={proj.id}>
                <div className="font-bold text-zinc-900">{proj.name}</div>
                <p className="text-zinc-700 text-[11px]">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {show("skills") && resume.skills?.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b pb-0.5 mb-1">Skills</h2>
          <div className="flex flex-wrap gap-1">
            {resume.skills.flatMap((c) => c.skills).map((s, i) => (
              <span key={i} className="text-[11px] bg-zinc-100 px-2 py-0.5 rounded text-zinc-800">
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </TemplateWrapper>
  );
};
