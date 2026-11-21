import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "RESUMIFY - AI-Powered Professional Resume Builder SaaS",
  description:
    "Build ATS-friendly, beautifully designed resumes with AI writing assistance, 20+ original templates, and live PDF export. Specially optimized for students, BTech freshers, and software developers.",
  keywords: [
    "resume builder",
    "AI resume builder",
    "ATS resume checker",
    "BTech fresher resume",
    "software engineer CV",
    "free resume templates",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20">
        {children}
      </body>
    </html>
  );
}
