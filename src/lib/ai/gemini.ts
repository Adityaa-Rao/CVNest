import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
export const isGeminiConfigured = Boolean(apiKey && !apiKey.includes("your-gemini-api-key"));

let genAI: GoogleGenerativeAI | null = null;
if (isGeminiConfigured) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export interface AIGenerateSummaryParams {
  role: string;
  experienceYears?: number;
  skills: string[];
  keyHighlights?: string[];
  isFresher?: boolean;
  tone?: "professional" | "concise" | "confident" | "technical";
}

export interface AIBulletPointParams {
  rawText: string;
  role?: string;
  targetCompany?: string;
  technologies?: string[];
}

export interface AICoverLetterParams {
  applicantName: string;
  applicantTitle: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  keySkills: string[];
  tone?: "professional" | "confident" | "enthusiastic" | "concise";
}

export async function generateProfessionalSummary(params: AIGenerateSummaryParams): Promise<string[]> {
  const { role, skills, isFresher, tone = "professional" } = params;

  if (isGeminiConfigured && genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are an elite executive resume writer. Generate 3 distinct professional summary options for a resume.
Target Role: ${role}
Level: ${isFresher ? "Entry-Level / Fresher / College Graduate" : "Experienced Professional"}
Top Skills: ${skills.join(", ")}
Tone: ${tone}

Rules:
1. Provide exactly 3 options numbered 1, 2, and 3.
2. Emphasize value, quantifiable results, and practical impact.
3. Keep each summary between 40-70 words.
4. Do not invent false company names or fake degrees.
Return strictly the 3 summaries without commentary.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const options = text
        .split(/\n\d+[\.\)]\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 20);
      if (options.length > 0) return options.slice(0, 3);
    } catch (err) {
      console.warn("Gemini API call failed, falling back to smart generator", err);
    }
  }

  // High-quality smart contextual generator fallback
  const topSkillList = skills.slice(0, 4).join(", ") || "software engineering principles";
  if (isFresher) {
    return [
      `Results-driven and ambitious ${role} graduate with strong technical foundations in ${topSkillList}. Adept at problem-solving, rapid prototyping, and translating complex requirements into clean, scalable code. Eager to contribute fresh perspectives and collaborative energy to high-impact development initiatives.`,
      `Dedicated and detail-oriented aspiring ${role} with hands-on project experience utilizing ${topSkillList}. Recognized for solid foundational problem-solving, clean code design, and active participation in tech hackathons. Committed to accelerating team velocity and building production-ready features.`,
      `Motivated Computer Science graduate targeting ${role} opportunities. Proficient across ${topSkillList} with a track record of building performant full-stack applications. Fast learner passionate about continuous integration, best engineering practices, and delivering measurable product value.`,
    ];
  }

  return [
    `Accomplished ${role} with extensive experience architecting and delivering scalable, modern solutions. Expert in ${topSkillList}, with a demonstrated track record of improving system uptime, reducing latency, and mentoring cross-functional engineering teams to drive business growth.`,
    `Performance-focused ${role} recognized for bridging high-level architectural design with rigorous engineering execution. Deep proficiency in ${topSkillList}, consistently delivering resilient, secure, and user-centric systems on time and within budget.`,
    `Innovative ${role} skilled in designing end-to-end cloud platforms, modernizing legacy architectures, and optimizing workflow pipelines using ${topSkillList}. Proven ability to align technical roadmaps with strategic product objectives.`,
  ];
}

export async function improveBulletPoints(params: AIBulletPointParams): Promise<string[]> {
  const { rawText, role = "Engineer", technologies = [] } = params;

  if (isGeminiConfigured && genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are a professional resume coach. Convert this rough resume description into 3 high-impact, ATS-optimized accomplishment bullet points using strong action verbs (e.g., Architected, Engineered, Optimized, Spearheaded, Reduced).
Role: ${role}
Technologies: ${technologies.join(", ")}
Rough Input: "${rawText}"

Rules:
- Start with a powerful action verb.
- Highlight metrics, performance impact, or operational efficiency if reasonable.
- Never invent specific fabricated metrics without noting [X%] placeholder if needed.
- Return exactly 3 alternative bullet points, one per line starting with a dash (-).`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const bullets = text
        .split("\n")
        .map((l) => l.replace(/^[-*•\d\.\s]+/, "").trim())
        .filter((l) => l.length > 20);
      if (bullets.length > 0) return bullets.slice(0, 3);
    } catch (err) {
      console.warn("Gemini API call failed, falling back to smart improver", err);
    }
  }

  // Smart heuristic improver
  const cleanInput = rawText.replace(/^(worked on|responsible for|helped in|did)\s+/i, "");
  const techStr = technologies.length > 0 ? ` leveraging ${technologies.slice(0, 3).join(", ")}` : "";

  return [
    `Architected and deployed ${cleanInput}${techStr}, optimizing workflow efficiency and boosting reliability.`,
    `Spearheaded the development of ${cleanInput}, cutting execution latency and ensuring strict compliance with engineering best practices.`,
    `Engineered robust solutions for ${cleanInput}${techStr}, driving measurable performance improvements and seamless user experiences.`,
  ];
}

export async function generateCoverLetter(params: AICoverLetterParams): Promise<string> {
  const { applicantName, applicantTitle, jobTitle, companyName, jobDescription, keySkills, tone = "professional" } = params;

  if (isGeminiConfigured && genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Draft a compelling, professional cover letter for an applicant applying to ${companyName} for the role of ${jobTitle}.
Applicant Name: ${applicantName}
Current Title: ${applicantTitle}
Key Skills: ${keySkills.join(", ")}
Target Job Description snippet: ${jobDescription.slice(0, 400)}
Tone: ${tone}

Format:
- Salutation (Dear Hiring Manager or Team)
- Opening paragraph stating enthusiasm and alignment
- Body paragraph matching skills to company goals
- Closing paragraph with call to action
- Formal sign-off with applicant name.
Keep it concise, polished, and human.`;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (err) {
      console.warn("Gemini API call failed, using smart cover letter fallback", err);
    }
  }

  return `Dear Hiring Manager,

I am writing to express my enthusiastic interest in the ${jobTitle} position at ${companyName}. With a proven background as a ${applicantTitle || "Software Professional"} and expertise spanning ${keySkills.slice(0, 4).join(", ") || "core technical domains"}, I am confident in my ability to make an immediate, positive impact on your engineering and product objectives.

Throughout my career, I have dedicated myself to crafting robust, high-performance applications and solving complex technical challenges with clean, maintainable architectures. Your mission at ${companyName} aligns closely with my dedication to technological innovation and continuous delivery.

I would welcome the opportunity to discuss how my technical skills, proactive problem-solving mindset, and dedication to excellence can support the team's ongoing initiatives. Thank you for your time and consideration.

Sincerely,
${applicantName || "Applicant"}`;
}
