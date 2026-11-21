import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "CVNest - AI-Powered Professional Resume Builder SaaS",
  description:
    "Build ATS-friendly, beautifully designed resumes with AI writing assistance, 20+ original templates, and live PDF export. Specially optimized for students, BTech freshers, and software developers.",
  keywords: [
    "CVNest",
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
      <head>
        {/* Self-healing script to unregister any stale service workers or caches from previous projects on localhost */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for (var r of registrations) {
                      r.unregister();
                    }
                  });
                }
                if ('caches' in window) {
                  caches.keys().then(function(names) {
                    for (var name of names) {
                      caches.delete(name);
                    }
                  });
                }
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20">
        {children}
      </body>
    </html>
  );
}
