import { ResumeData, CoverLetterData } from "@/types/resume";
import { SAMPLE_FRESHER_RESUME, SAMPLE_EXPERIENCED_RESUME } from "@/constants/sample-resumes";
import { generateId } from "@/lib/utils";

const STORAGE_KEY_RESUMES = "resumify_resumes_v1";
const STORAGE_KEY_ACTIVE_ID = "resumify_active_resume_id";
const STORAGE_KEY_COVER_LETTERS = "resumify_cover_letters_v1";
const STORAGE_KEY_USER_PREFS = "resumify_user_prefs_v1";

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  defaultPaperSize: "a4" | "letter";
  favoriteTemplates: string[];
}

export function getStoredResumes(): ResumeData[] {
  if (typeof window === "undefined") return [SAMPLE_FRESHER_RESUME];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESUMES);
    if (!raw) {
      // Initialize with realistic seed data
      const initial = [SAMPLE_FRESHER_RESUME, SAMPLE_EXPERIENCED_RESUME];
      localStorage.setItem(STORAGE_KEY_RESUMES, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [SAMPLE_FRESHER_RESUME];
  } catch {
    return [SAMPLE_FRESHER_RESUME];
  }
}

export function getResumeById(id: string): ResumeData | null {
  const resumes = getStoredResumes();
  return resumes.find((r) => r.id === id) || null;
}

export function saveResume(resume: ResumeData): void {
  if (typeof window === "undefined") return;
  try {
    const resumes = getStoredResumes();
    const existingIndex = resumes.findIndex((r) => r.id === resume.id);
    const updated = {
      ...resume,
      updatedAt: new Date().toISOString(),
    };

    let newResumes: ResumeData[];
    if (existingIndex >= 0) {
      newResumes = [...resumes];
      newResumes[existingIndex] = updated;
    } else {
      newResumes = [updated, ...resumes];
    }

    localStorage.setItem(STORAGE_KEY_RESUMES, JSON.stringify(newResumes));
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, updated.id);
  } catch (err) {
    console.error("Failed to save resume to local storage", err);
  }
}

export function duplicateResume(id: string, newTitleSuffix = "(Copy)"): ResumeData | null {
  const resume = getResumeById(id);
  if (!resume) return null;

  const duplicated: ResumeData = {
    ...JSON.parse(JSON.stringify(resume)),
    id: generateId(),
    title: `${resume.title} ${newTitleSuffix}`.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slug: `${resume.slug || "resume"}-${Math.floor(Math.random() * 900 + 100)}`,
  };

  saveResume(duplicated);
  return duplicated;
}

export function deleteResume(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const resumes = getStoredResumes();
    const filtered = resumes.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY_RESUMES, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

export function createNewBlankResume(isFresher = false): ResumeData {
  const base = isFresher ? SAMPLE_FRESHER_RESUME : SAMPLE_EXPERIENCED_RESUME;
  const newResume: ResumeData = {
    id: generateId(),
    title: isFresher ? "My Fresher Engineering Resume" : "Untitled Resume",
    targetRole: isFresher ? "Software Engineer / Graduate Trainee" : "Full Stack Developer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: false,
    slug: `user-${generateId().slice(0, 5)}`,
    personalInfo: {
      fullName: isFresher ? "Alex Morgan" : "Alex Morgan",
      title: isFresher ? "Computer Science Graduate" : "Software Engineer",
      email: "alex.morgan@example.com",
      phone: "+1 (555) 019-2834",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      linkedin: "linkedin.com/in/alexmorgan",
      github: "github.com/alexmorgan",
      portfolio: "alexmorgan.dev",
      website: "",
      summary: isFresher
        ? "Motivated Computer Science graduate with strong foundational knowledge in algorithms, modern web development, and cloud computing. Eager to contribute to high-impact software projects."
        : "Dynamic Software Engineer with experience in designing and delivering responsive web applications, robust REST APIs, and modern cloud architectures.",
    },
    experience: isFresher ? [] : base.experience.slice(0, 2),
    internships: isFresher ? base.internships : [],
    education: base.education.slice(0, 1),
    skills: base.skills,
    projects: base.projects.slice(0, 2),
    certifications: base.certifications.slice(0, 1),
    achievements: base.achievements.slice(0, 1),
    hackathons: isFresher ? base.hackathons : [],
    publications: [],
    languages: [{ id: "l-1", language: "English", proficiency: "Fluent" }],
    volunteer: [],
    extracurricular: isFresher ? base.extracurricular : [],
    awards: [],
    references: [],
    customSections: [],
    style: {
      templateId: isFresher ? "btech-fresher" : "classic-ats",
      accentColor: isFresher ? "#0284c7" : "#4f46e5",
      fontFamily: "inter",
      fontSize: "md",
      spacing: "normal",
      margins: "md",
      paperSize: "a4",
      sectionOrder: isFresher
        ? ["personalInfo", "education", "skills", "projects", "internships", "hackathons", "certifications", "achievements"]
        : ["personalInfo", "experience", "education", "skills", "projects", "certifications"],
      hiddenSections: [],
    },
  };

  saveResume(newResume);
  return newResume;
}

// Cover Letter Storage
export function getStoredCoverLetters(): CoverLetterData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COVER_LETTERS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCoverLetter(coverLetter: CoverLetterData): void {
  if (typeof window === "undefined") return;
  try {
    const items = getStoredCoverLetters();
    const index = items.findIndex((c) => c.id === coverLetter.id);
    let updated: CoverLetterData[];
    if (index >= 0) {
      updated = [...items];
      updated[index] = { ...coverLetter, updatedAt: new Date().toISOString() };
    } else {
      updated = [{ ...coverLetter, updatedAt: new Date().toISOString() }, ...items];
    }
    localStorage.setItem(STORAGE_KEY_COVER_LETTERS, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save cover letter", err);
  }
}

export function deleteCoverLetter(id: string): void {
  if (typeof window === "undefined") return;
  const items = getStoredCoverLetters().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY_COVER_LETTERS, JSON.stringify(items));
}

// User Preferences
export function getUserPreferences(): UserPreferences {
  if (typeof window === "undefined") {
    return { theme: "light", defaultPaperSize: "a4", favoriteTemplates: ["classic-ats", "btech-fresher", "modern-professional"] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER_PREFS);
    if (!raw) {
      return { theme: "light", defaultPaperSize: "a4", favoriteTemplates: ["classic-ats", "btech-fresher", "modern-professional"] };
    }
    return JSON.parse(raw);
  } catch {
    return { theme: "light", defaultPaperSize: "a4", favoriteTemplates: ["classic-ats", "btech-fresher", "modern-professional"] };
  }
}

export function saveUserPreferences(prefs: UserPreferences): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_USER_PREFS, JSON.stringify(prefs));
}
