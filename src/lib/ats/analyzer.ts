import { ResumeData } from "@/types/resume";

export interface ATSCheckResult {
  category: "structure" | "contact" | "content" | "skills" | "formatting";
  title: string;
  passed: boolean;
  scoreImpact: number;
  message: string;
  suggestion?: string;
  targetSection?: string;
}

export interface ATSAnalysisReport {
  score: number; // 0 - 100
  rating: "Poor" | "Fair" | "Good" | "Excellent";
  summary: string;
  checks: ATSCheckResult[];
  strengths: string[];
  improvements: string[];
  keywordDensity: { keyword: string; count: number }[];
  matchedKeywords?: string[];
  missingKeywords?: string[];
}

export function analyzeResumeATS(resume: ResumeData, targetJobDescription?: string): ATSAnalysisReport {
  const checks: ATSCheckResult[] = [];
  let totalScore = 100;
  const strengths: string[] = [];
  const improvements: string[] = [];

  // 1. Contact Information Checks
  const p = resume.personalInfo;
  if (!p.fullName || p.fullName.trim().length < 2) {
    checks.push({
      category: "contact",
      title: "Missing Full Name",
      passed: false,
      scoreImpact: 15,
      message: "Your resume must clearly state your full name at the top.",
      suggestion: "Enter your legal first and last name.",
      targetSection: "personalInfo",
    });
    totalScore -= 15;
  } else {
    checks.push({
      category: "contact",
      title: "Full Name Present",
      passed: true,
      scoreImpact: 0,
      message: `Full name "${p.fullName}" is well-formatted.`,
      targetSection: "personalInfo",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!p.email || !emailRegex.test(p.email)) {
    checks.push({
      category: "contact",
      title: "Valid Professional Email",
      passed: false,
      scoreImpact: 12,
      message: "ATS parsers require an accessible, standard email address.",
      suggestion: "Provide a clean email such as name@domain.com.",
      targetSection: "personalInfo",
    });
    totalScore -= 12;
  } else {
    checks.push({
      category: "contact",
      title: "Professional Email Verified",
      passed: true,
      scoreImpact: 0,
      message: "Valid email address detected.",
      targetSection: "personalInfo",
    });
  }

  if (!p.phone || p.phone.trim().length < 8) {
    checks.push({
      category: "contact",
      title: "Phone Number Missing",
      passed: false,
      scoreImpact: 8,
      message: "Recruiters use automated dialers; missing phone reduces contact rate.",
      suggestion: "Include phone number with country/area code.",
      targetSection: "personalInfo",
    });
    totalScore -= 8;
  } else {
    checks.push({
      category: "contact",
      title: "Phone Number Included",
      passed: true,
      scoreImpact: 0,
      message: "Phone number is present.",
      targetSection: "personalInfo",
    });
  }

  if (!p.linkedin) {
    checks.push({
      category: "contact",
      title: "LinkedIn Profile URL",
      passed: false,
      scoreImpact: 5,
      message: "Over 87% of recruiters cross-reference LinkedIn during screening.",
      suggestion: "Add your LinkedIn profile link to enhance recruiter trust.",
      targetSection: "personalInfo",
    });
    totalScore -= 5;
  }

  // 2. Professional Summary
  if (!p.summary || p.summary.trim().split(/\s+/).length < 25) {
    checks.push({
      category: "content",
      title: "Professional Summary Strength",
      passed: false,
      scoreImpact: 10,
      message: "Your summary is missing or too brief (under 25 words).",
      suggestion: "Use the AI Summary Generator to craft a compelling 3-line overview.",
      targetSection: "summary",
    });
    totalScore -= 10;
  } else {
    strengths.push("Comprehensive professional summary highlighting core value proposition.");
    checks.push({
      category: "content",
      title: "Professional Summary Present",
      passed: true,
      scoreImpact: 0,
      message: "Summary contains adequate depth for initial screening.",
      targetSection: "summary",
    });
  }

  // 3. Experience / Internships & Action Verbs
  const allExp = [...(resume.experience || []), ...(resume.internships || [])];
  if (allExp.length === 0) {
    checks.push({
      category: "structure",
      title: "Experience or Internships Section",
      passed: false,
      scoreImpact: 15,
      message: "No work history or internship entries found.",
      suggestion: "Add internships, freelance gigs, or campus leadership projects.",
      targetSection: "experience",
    });
    totalScore -= 15;
  } else {
    strengths.push(`Documented ${allExp.length} professional/internship roles.`);

    // Check for quantifiable impact (numbers, %, $, x)
    let hasMetrics = false;
    const actionVerbsRegex = /\b(architected|engineered|spearheaded|developed|optimized|implemented|reduced|increased|led|designed|launched|automated)\b/i;
    let strongVerbCount = 0;

    allExp.forEach((item) => {
      const allText = [item.description, ...(item.achievements || [])].join(" ");
      if (/(\d+%|\$\d+|\d+\+|\b\d+\b)/.test(allText)) {
        hasMetrics = true;
      }
      const matches = allText.match(new RegExp(actionVerbsRegex, "gi"));
      if (matches) strongVerbCount += matches.length;
    });

    if (!hasMetrics) {
      checks.push({
        category: "content",
        title: "Quantifiable Metrics & Results",
        passed: false,
        scoreImpact: 8,
        message: "Bullet points lack numbers, percentages, or measurable outcomes.",
        suggestion: "Use metric indicators (e.g., 'improved performance by 35%').",
        targetSection: "experience",
      });
      totalScore -= 8;
    } else {
      strengths.push("Effective use of quantifiable metrics and performance statistics.");
    }

    if (strongVerbCount < 3) {
      checks.push({
        category: "content",
        title: "Action Verbs Frequency",
        passed: false,
        scoreImpact: 5,
        message: "Few strong action verbs detected (e.g., Architected, Optimized).",
        suggestion: "Replace passive phrases like 'worked on' with active verbs.",
        targetSection: "experience",
      });
      totalScore -= 5;
    }
  }

  // 4. Education
  if (!resume.education || resume.education.length === 0) {
    checks.push({
      category: "structure",
      title: "Education Section",
      passed: false,
      scoreImpact: 12,
      message: "No education credentials listed.",
      suggestion: "Include your degree, institution name, and graduation year.",
      targetSection: "education",
    });
    totalScore -= 12;
  } else {
    strengths.push("Education credentials clearly detailed.");
  }

  // 5. Skills Section
  const totalSkills = (resume.skills || []).reduce((acc, cat) => acc + (cat.skills?.length || 0), 0);
  if (totalSkills < 6) {
    checks.push({
      category: "skills",
      title: "Skill Breadth & Categorization",
      passed: false,
      scoreImpact: 10,
      message: `Only ${totalSkills} skill(s) listed. ATS parsers match role keywords here.`,
      suggestion: "Add technical tools, languages, and frameworks.",
      targetSection: "skills",
    });
    totalScore -= 10;
  } else {
    strengths.push(`Solid technical inventory with ${totalSkills} distinct skills.`);
    checks.push({
      category: "skills",
      title: "Strong Skill Coverage",
      passed: true,
      scoreImpact: 0,
      message: `${totalSkills} skills categorized for parser scanning.`,
      targetSection: "skills",
    });
  }

  // 6. Projects (critical for students & developers)
  if (!resume.projects || resume.projects.length === 0) {
    checks.push({
      category: "content",
      title: "Technical Projects",
      passed: false,
      scoreImpact: 7,
      message: "No technical or academic projects featured.",
      suggestion: "Add at least 2 hands-on projects with tech stacks and live links.",
      targetSection: "projects",
    });
    totalScore -= 7;
  } else {
    strengths.push(`Showcased ${resume.projects.length} practical projects.`);
  }

  // Calculate final score
  totalScore = Math.max(25, Math.min(99, totalScore));

  let rating: "Poor" | "Fair" | "Good" | "Excellent" = "Fair";
  if (totalScore >= 88) rating = "Excellent";
  else if (totalScore >= 75) rating = "Good";
  else if (totalScore >= 55) rating = "Fair";
  else rating = "Poor";

  // Keyword Extraction & Frequency
  const fullText = JSON.stringify(resume).toLowerCase();
  const techKeywords = [
    "react", "next.js", "typescript", "javascript", "python", "node.js",
    "docker", "kubernetes", "aws", "postgresql", "sql", "mongodb", "git",
    "rest api", "graphql", "tailwind", "ci/cd", "agile", "c++", "java", "linux"
  ];

  const keywordDensity = techKeywords
    .map((kw) => {
      const regex = new RegExp(`\\b${kw.replace(".", "\\.")}\\b`, "gi");
      const matches = fullText.match(regex);
      return { keyword: kw, count: matches ? matches.length : 0 };
    })
    .filter((k) => k.count > 0)
    .sort((a, b) => b.count - a.count);

  // Job Description Matching if provided
  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];

  if (targetJobDescription && targetJobDescription.trim().length > 20) {
    const jdLower = targetJobDescription.toLowerCase();
    const commonTechs = [
      "react", "angular", "vue", "next.js", "node.js", "express", "python", "django",
      "fastapi", "java", "spring boot", "c++", "c#", ".net", "golang", "ruby", "aws",
      "azure", "gcp", "docker", "kubernetes", "sql", "postgresql", "mysql", "mongodb",
      "redis", "kafka", "elasticsearch", "git", "ci/cd", "microservices", "rest api",
      "graphql", "unit testing", "system design", "agile", "typescript", "javascript"
    ];

    const jdRequired = commonTechs.filter((tech) => jdLower.includes(tech));
    matchedKeywords = jdRequired.filter((tech) => fullText.includes(tech));
    missingKeywords = jdRequired.filter((tech) => !fullText.includes(tech));
  }

  // Populate improvement recommendations
  checks
    .filter((c) => !c.passed && c.suggestion)
    .forEach((c) => {
      if (c.suggestion) improvements.push(c.suggestion);
    });

  return {
    score: totalScore,
    rating,
    summary:
      totalScore >= 85
        ? "Your resume has high ATS compatibility with clean structure, standard headings, and quantified impact."
        : "Your resume has a solid baseline but needs optimization in metrics, contact details, or keyword coverage.",
    checks,
    strengths,
    improvements,
    keywordDensity,
    matchedKeywords,
    missingKeywords,
  };
}
