/**
 * ResetButton Component
 *
 * UI button that resets all pieces to their starting positions in the staging area.
 * Positioned at top-right of viewport with semi-transparent overlay.
 *
 * Validates: Requirement 5 (Reset UI)
 */

import React from "react";
import "./ResetButton.css";

interface ResetButtonProps {
  /** Callback function to reset the game board */
  onReset: () => void;
}

/**
 * ResetButton component
 *
 * Creates a button overlay that allows players to reset the board state.
 * When clicked, all pieces return to the staging area and all slots are cleared.
 *
 * Styling:
 * - Position: Top-right of viewport
 * - Semi-transparent background
 * - Solid appearance on hover
 * - Clear label: "Reset Board"
 *
 * Validates: Requirements 5.1-5.3 (Reset functionality UI)
 */
export const ResetButton: React.FC<ResetButtonProps> = ({ onReset }) => {
  return (
    <button
      className="reset-button"
      onClick={onReset}
      title="Reset all pieces to starting positions"
    >
      Reset Board
    </button>
  );
};
