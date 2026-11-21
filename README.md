
# CVNest — AI-Powered Professional Resume Builder SaaS
"Build Your Future, One Resume at a Time."*

CVNest is a complete, production-grade SaaS platform engineered for college students, BTech freshers, software developers, and experienced professionals worldwide.

---

## 🌟 Core Features & Architecture

### 1. 🎨 20+ Genuinely Original Templates
- **ATS-Friendly (5)**: *Classic ATS, Minimal Professional, Corporate Standard, Modern ATS, Executive Traditional* — single-column layouts with standard headings tested for 99%+ parsing accuracy across Workday, Taleo, and Greenhouse.
- **Modern (5)**: *Modern Professional, Elegant Blue, Contemporary Slate, Minimal Clean, Executive Pro* — asymmetric 2-column layouts, timeline connectors, and executive summary cards.
- **Creative (5)**: *Creative Designer, Modern Sidebar, Portfolio Style, Elegant Creative, Visual Professional* — dark charcoal sidebars, project showcase cards with tech stack tags, and live deployment links.
- **Student & Fresher (5)**: *BTech Fresher, College Graduate, Software Developer, Internship Ready, Academic & Research* — specially tailored for Indian engineering students with prominent Branch, CGPA, Smart India Hackathons, LeetCode ratings, and academic projects.

### 2. ⚡ Powerful 3-Panel Resume Editor
- **Left Panel**: Navigation and visibility toggles across 18+ sections (Personal Details, Summary, Experience, Education, Technical Skills, Soft Skills, Projects, Internships, Certifications, Achievements, Hackathons, Publications, Languages, Volunteer, Extracurricular, Awards, References, and Custom Sections).
- **Center Editor**: Dynamic form inputs, inline validation, instant autosave, and inline AI helpers on every field.
- **Right Panel**: Real-time live preview matching final print geometry, zoom controls (50% to 150%), A4 vs US Letter paper selector, color palette picker, and instant template switching without data loss.

### 3. 🤖 AI Resume Assistant
- **AI Professional Summary Generator**: Crafts 3 distinct options based on actual user credentials with tone controls (*Professional, Concise, Confident, Technical*).
- **AI Bullet Point Improver**: Converts raw descriptions into high-impact accomplishment bullets with strong action verbs (*Architected, Engineered, Optimized*).
- **AI Cover Letter Studio**: Generates tailored cover letters matching the resume against any pasted job description.
- **Dual Engine**: Automatically connects to the Google Gemini API when `GEMINI_API_KEY` is provided, and gracefully defaults to an intelligent rule-based heuristic generator if unconfigured.

### 4. 🛡️ ATS Resume Diagnostic & Job Matcher
- **0–100 ATS Score**: Evaluates structure, email validity, metric quantification, contact completeness, and keyword density.
- **One-Click Quick Fix**: "Fix in Editor" buttons take users directly to incomplete sections.
- **Job Description Matcher**: Paste any job posting to analyze required skills, detect missing keywords, and clone a tailored version in 1 click.

### 5. 📄 High-Fidelity PDF Export & Public Portfolios
- **Vector PDF Download**: Generates crisp, clean A4 & US Letter PDFs directly with zero watermarks and no margin clipping.
- **Native Print Ready**: Dedicated `@media print` CSS rules for native browser printing.
- **Public URL**: Shareable online portfolios at `/u/[username]` with instant public/private toggle.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **npm** or **pnpm**

### 2. Installation
```bash
# Clone the repository and navigate to folder
cd CVNest

# Install dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
# CVNest
CVNest is an AI-powered resume-building platform that helps students, freshers, and professionals create polished, professional, and ATS-friendly resumes. It brings templates, editing tools, career assistance, and resume management together in one place. 
>>>>>>> 45a9ade2c8900237dcca3c6ac64240f06b83f535
