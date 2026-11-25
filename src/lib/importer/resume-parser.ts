import { ResumeData } from "@/types/resume";
import { createNewBlankResume } from "@/lib/storage";
import { generateId } from "@/lib/utils";

export async function parseResumeFromText(rawText: string): Promise<Partial<ResumeData>> {
  const extracted: Partial<ResumeData> = {
    personalInfo: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      country: "",
      linkedin: "",
      github: "",
      portfolio: "",
      website: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
  };

  // 1. Extract Email
  const emailMatch = rawText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  if (emailMatch && extracted.personalInfo) {
    extracted.personalInfo.email = emailMatch[1];
  }

  // 2. Extract Phone
  const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4})/);
  if (phoneMatch && extracted.personalInfo) {
    extracted.personalInfo.phone = phoneMatch[1].trim();
  }

  // 3. Extract Links
  const linkedinMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  if (linkedinMatch && extracted.personalInfo) {
    extracted.personalInfo.linkedin = linkedinMatch[0];
  }

  const githubMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  if (githubMatch && extracted.personalInfo) {
    extracted.personalInfo.github = githubMatch[0];
  }

  // 4. Extract Name (often first non-empty line)
  const lines = rawText.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length > 0 && extracted.personalInfo) {
    const firstLine = lines[0];
    if (firstLine.length < 40 && !firstLine.includes("@") && !firstLine.includes("http")) {
      extracted.personalInfo.fullName = firstLine;
    }
    if (lines.length > 1 && lines[1].length < 50 && !lines[1].includes("@")) {
      extracted.personalInfo.title = lines[1];
    }
  }

  // 5. Extract Skills Keywords
  const knownSkills = [
    "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express",
    "Python", "Java", "C++", "C#", "SQL", "PostgreSQL", "MongoDB", "AWS",
    "Docker", "Kubernetes", "Git", "HTML", "CSS", "Tailwind CSS", "Redux",
    "GraphQL", "REST APIs", "Linux", "Figma", "Agile"
  ];

  const foundSkills = knownSkills.filter((sk) => {
    const escaped = sk.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const reg = new RegExp(`(?:^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, "i");
    return reg.test(rawText);
  });

  if (foundSkills.length > 0) {
    extracted.skills = [
      {
        id: generateId(),
        categoryName: "Technical Skills",
        skills: foundSkills.map((s) => ({ name: s })),
      },
    ];
  }

  return extracted;
}

export function mergeImportedDataIntoResume(base: ResumeData, imported: Partial<ResumeData>): ResumeData {
  return {
    ...base,
    personalInfo: {
      ...base.personalInfo,
      ...(imported.personalInfo?.fullName ? { fullName: imported.personalInfo.fullName } : {}),
      ...(imported.personalInfo?.email ? { email: imported.personalInfo.email } : {}),
      ...(imported.personalInfo?.phone ? { phone: imported.personalInfo.phone } : {}),
      ...(imported.personalInfo?.linkedin ? { linkedin: imported.personalInfo.linkedin } : {}),
      ...(imported.personalInfo?.github ? { github: imported.personalInfo.github } : {}),
      ...(imported.personalInfo?.title ? { title: imported.personalInfo.title } : {}),
    },
    skills: imported.skills && imported.skills.length > 0 ? imported.skills : base.skills,
  };
}
