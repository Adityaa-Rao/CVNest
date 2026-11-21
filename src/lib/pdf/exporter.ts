import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ResumeData } from "@/types/resume";

export interface PDFExportOptions {
  filename?: string;
  paperSize?: "a4" | "letter";
  onProgress?: (percent: number) => void;
}

export async function exportResumeToPDF(resume: ResumeData, options: PDFExportOptions = {}): Promise<void> {
  const printElement = document.getElementById("resume-print-area");
  if (!printElement) {
    throw new Error("Resume element not found in DOM");
  }

  const paperSize = options.paperSize || resume.style?.paperSize || "a4";
  const defaultFilename = `${(resume.personalInfo?.fullName || "Resume").replace(/\s+/g, "_")}_RESUMIFY.pdf`;
  const filename = options.filename || defaultFilename;

  try {
    options.onProgress?.(20);

    // Capture element with html2canvas at 2x scale for sharp vector-like text
    const canvas = await html2canvas(printElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 1200,
    });

    options.onProgress?.(60);

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    // Dimensions in mm
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: paperSize === "letter" ? "letter" : "a4",
    });

    const pageWidth = paperSize === "letter" ? 215.9 : 210;
    const pageHeight = paperSize === "letter" ? 279.4 : 297;

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Handle multi-page documents if content exceeds 1 page
    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    options.onProgress?.(90);
    pdf.save(filename);
    options.onProgress?.(100);
  } catch (err) {
    console.error("PDF export failed, falling back to native browser print", err);
    window.print();
  }
}

export function exportResumeToJSON(resume: ResumeData): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resume, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `${(resume.title || "Resume").replace(/\s+/g, "_")}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function printResume(): void {
  window.print();
}
