/**
 * PDFReferenceButton Component
 *
 * UI button that opens the puzzle challenges and solutions PDF in a new tab.
 * Positioned at top-left of viewport with semi-transparent overlay.
 *
 * Validates: Requirements 6.1-6.2 (PDF access)
 */

import React from "react";
import "./PDFReferenceButton.css";

interface PDFReferenceButtonProps {
  /** URL path to the PDF file */
  pdfUrl?: string;
}

/**
 * PDFReferenceButton component
 *
 * Creates a button overlay that opens the Diamond Quest solutions PDF.
 * The PDF contains puzzle challenge configurations and solution diagrams.
 *
 * Styling:
 * - Position: Top-left of viewport
 * - Semi-transparent background
 * - Solid appearance on hover
 * - PDF icon and label: "View Puzzles & Solutions"
 *
 * Validates: Requirements 6.1-6.2, 6.3-6.4 (PDF access and content)
 */
export const PDFReferenceButton: React.FC<PDFReferenceButtonProps> = ({
  pdfUrl = "/puzzles/diamond-quest-solutions.pdf",
}) => {
  const handleClick = () => {
    // Open PDF in new window/tab
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      className="pdf-reference-button"
      onClick={handleClick}
      title="View puzzle challenges and solutions"
    >
      <svg
        className="pdf-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
        <path d="M8 15h8v2H8zm0-4h8v2H8zm0-4h5v2H8z" />
      </svg>
      <span>View Puzzles & Solutions</span>
    </button>
  );
};
