/**
 * PDFButtons Component
 *
 * UI buttons to open rules and solutions PDFs in new tabs.
 * Positioned at top-right of viewport.
 */

import React from "react";
import "./PDFButtons.css";
import rulesPdf from "../assets/rules.pdf";
import solutionsPdf from "../assets/solutions.pdf";

export const PDFButtons: React.FC = () => {
  const openPDF = (pdfUrl: string, title: string) => {
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="pdf-buttons-container">
      <button
        className="pdf-button rules-button"
        onClick={() => openPDF(rulesPdf, "Rules")}
        title="View game rules"
      >
        <svg
          className="pdf-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
          <path d="M11 13h2v2h-2zm0-6h2v4h-2z" />
        </svg>
        <span>Rules</span>
      </button>

      <button
        className="pdf-button solutions-button"
        onClick={() => openPDF(solutionsPdf, "Solutions")}
        title="View puzzle solutions"
      >
        <svg
          className="pdf-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
          <path d="M9 13l2 2 4-4 1.5 1.5L11 18l-3.5-3.5L9 13z" />
        </svg>
        <span>Solutions</span>
      </button>
    </div>
  );
};
