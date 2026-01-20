/**
 * ChallengeViewer Component
 *
 * Displays a specific challenge page from the challenges PDF.
 * Users can select different levels/challenges to view.
 */

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./ChallengeViewer.css";
import challengesPdf from "../assets/challenges.pdf";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ChallengeViewerProps {
  /** Currently selected challenge/level number (1-based) */
  selectedLevel: number;
  /** Callback when level is changed */
  onLevelChange: (level: number) => void;
}

export const ChallengeViewer: React.FC<ChallengeViewerProps> = ({
  selectedLevel,
  onLevelChange,
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF:", error);
    setIsLoading(false);
  };

  return (
    <div className="challenge-viewer">
      <div className="challenge-header">
        <h2>Challenge {selectedLevel}</h2>
        <div className="level-selector">
          <button
            onClick={() => onLevelChange(Math.max(1, selectedLevel - 1))}
            disabled={selectedLevel <= 1}
            className="nav-button"
          >
            ← Previous
          </button>
          <select
            value={selectedLevel}
            onChange={(e) => onLevelChange(Number(e.target.value))}
            className="level-dropdown"
          >
            {Array.from({ length: numPages }, (_, i) => i + 1).map((level) => (
              <option key={level} value={level}>
                Level {level}
              </option>
            ))}
          </select>
          <button
            onClick={() => onLevelChange(Math.min(numPages, selectedLevel + 1))}
            disabled={selectedLevel >= numPages}
            className="nav-button"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="pdf-container">
        {isLoading && <div className="loading">Loading challenges...</div>}
        <Document
          file={challengesPdf}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div className="loading">Loading PDF...</div>}
        >
          <Page
            pageNumber={selectedLevel}
            width={450}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
    </div>
  );
};
