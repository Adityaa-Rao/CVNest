export type PaperSize = 'a4' | 'letter';
export type FontFamily = 'inter' | 'jakarta' | 'merriweather' | 'roboto' | 'fira' | 'playfair';
export type FontSize = 'sm' | 'md' | 'lg';
export type Spacing = 'compact' | 'normal' | 'relaxed';
export type Margins = 'sm' | 'md' | 'lg';

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  linkedin: string;
  github: string;
  portfolio: string;
  website: string;
  avatarUrl?: string;
  summary?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  grade: string;
  coursework: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  keyContributions: string[];
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  skills: Array<{ name: string; level?: number }>;
}

export interface InternshipItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  date: string;
  issuer?: string;
  description: string;
}

export interface HackathonItem {
  id: string;
  name: string;
  project: string;
  role: string;
  date: string;
  award: string;
  description: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  authors: string;
  description: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Proficient' | 'Intermediate' | 'Basic';
}

export interface VolunteerItem {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface ExtracurricularItem {
  id: string;
  title: string;
  role: string;
  date: string;
  description: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface ResumeStyle {
  templateId: string;
  accentColor: string;
  fontFamily: FontFamily;
  fontSize: FontSize;
  spacing: Spacing;
  margins: Margins;
  paperSize: PaperSize;
  sectionOrder: string[];
  hiddenSections: string[];
}

export interface ResumeData {
  id: string;
  title: string;
  targetRole: string;
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean;
  slug?: string;
  personalInfo: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  internships: InternshipItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  hackathons: HackathonItem[];
  publications: PublicationItem[];
  languages: LanguageItem[];
  volunteer: VolunteerItem[];
  extracurricular: ExtracurricularItem[];
  awards: AwardItem[];
  references: ReferenceItem[];
  customSections: CustomSection[];
  style: ResumeStyle;
}

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  category: 'ats' | 'modern' | 'creative' | 'fresher';
  categoryLabel: string;
  thumbnail: string;
  badge?: string;
  isPopular?: boolean;
  isNew?: boolean;
  atsScore?: number;
  layoutType?: 'Single Column' | 'Two Column' | 'Sidebar' | 'Timeline' | 'Project Grid';
  recommendedFor?: string;
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location?: string;
  salary?: string;
  status: 'wishlist' | 'applied' | 'interviewing' | 'offer' | 'rejected';
  appliedDate: string;
  notes?: string;
  jobUrl?: string;
  resumeId?: string;
}

export interface CoverLetterData {
  id: string;
  title: string;
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  jobTitle: string;
  date: string;
  content: string;
  tone: 'professional' | 'confident' | 'enthusiastic' | 'concise';
  resumeId?: string;
  createdAt: string;
  updatedAt: string;
}
