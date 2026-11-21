"use client";

import React, { useState } from "react";
import { Sparkles, X, Check, RefreshCw, AlertCircle } from "lucide-react";
import { generateProfessionalSummary, improveBulletPoints, isGeminiConfigured } from "@/lib/ai/gemini";

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "summary" | "bullet" | "skills";
  initialRole?: string;
  initialText?: string;
  skills?: string[];
  isFresher?: boolean;
  onApply: (selectedContent: string) => void;
}

export const AIModal: React.FC<AIModalProps> = ({
  isOpen,
  onClose,
  type,
  initialRole = "Software Engineer",
  initialText = "",
  skills = [],
  isFresher = false,
  onApply,
}) => {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState<"professional" | "concise" | "confident" | "technical">("professional");
  const [targetRole, setTargetRole] = useState(initialRole);
  const [rawInput, setRawInput] = useState(initialText);
  const [results, setResults] = useState<string[]>([]);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setSelectedResult(null);
    try {
      if (type === "summary") {
        const generated = await generateProfessionalSummary({
          role: targetRole,
          skills: skills.length > 0 ? skills : ["Problem Solving", "Modern Technologies", "System Architecture"],
          isFresher,
          tone,
        });
        setResults(generated);
      } else if (type === "bullet") {
        const generated = await improveBulletPoints({
          rawText: rawInput || "Developed key application features and worked on bug fixes.",
          role: targetRole,
          technologies: skills,
        });
        setResults(generated);
      }
    } catch (err) {
      console.error("AI Generation error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-card text-card-foreground w-full max-w-xl rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-none">
                {type === "summary" ? "AI Summary Assistant" : "AI Bullet Point Enhancer"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {type === "summary"
                  ? "Generate polished, high-impact summary options based on your background."
                  : "Transform raw descriptions into punchy accomplishment bullet points."}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-muted-foreground hover:bg-secondary">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Notice if API key unset */}
        {!isGeminiConfigured && (
          <div className="mx-5 mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold">Smart Heuristic Mode Active:</span> Gemini API key not set in environment. CVNest is generating expert rule-based variations!
            </div>
          </div>
        )}

        {/* Body Form */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {type === "summary" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Target Role / Title</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer, Data Analyst, BTech CS Student"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Tone of Voice</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["professional", "concise", "confident", "technical"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`text-xs py-1.5 px-2 rounded-lg border capitalize transition-all ${
                        tone === t
                          ? "bg-primary text-primary-foreground border-primary font-semibold shadow-sm"
                          : "border-border hover:bg-secondary text-muted-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {type === "bullet" && (
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Raw Description / Task</label>
              <textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="e.g. Worked on the website dashboard and made it faster."
                rows={3}
                className="w-full text-xs p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              />
            </div>
          )}

          {/* Generate CTA Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-xs hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Crafting AI Variations...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{results.length > 0 ? "Regenerate Options" : "Generate Options"}</span>
              </>
            )}
          </button>

          {/* Results List */}
          {results.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-border">
              <span className="text-xs font-bold text-foreground">Select an option to apply:</span>
              {results.map((res, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedResult(res)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedResult === res
                      ? "border-primary bg-primary/5 ring-1 ring-primary text-foreground font-medium"
                      : "border-border hover:border-zinc-300 dark:hover:border-zinc-700 bg-background text-muted-foreground"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono font-bold text-primary">Option #{i + 1}</span>
                    {selectedResult === res && <Check className="w-4 h-4 text-primary" />}
                  </div>
                  <p className="mt-1 leading-relaxed">{res}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-secondary/20 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-3.5 py-2 rounded-lg border border-border text-muted-foreground hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedResult}
            onClick={() => {
              if (selectedResult) {
                onApply(selectedResult);
                onClose();
              }
            }}
            className="text-xs px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-95 transition-all disabled:opacity-40"
          >
            Apply to Resume
          </button>
        </div>
      </div>
    </div>
  );
};
