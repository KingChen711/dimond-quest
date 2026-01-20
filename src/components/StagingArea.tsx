/**
 * StagingArea Component
 *
 * Renders the staging area where diamond pieces are displayed when not on the board.
 * Pieces are arranged in 5 rows grouped by color with consistent spacing.
 *
 * Layout:
 * - Position: (x: -3, y: -4, z: 0) relative to board center
 * - Row 1: Orange pieces (3)
 * - Row 2: Yellow pieces (3)
 * - Row 3: Green pieces (3)
 * - Row 4: Blue pieces (3)
 * - Row 5: Red piece (1)
 * - Spacing: 1.0 units between pieces
 *
 * Validates: Requirements 2.9, 10.2-10.4 (Staging area layout)
 */

import React from "react";
import { DiamondPiece as DiamondPieceType } from "../types";
import { DiamondPiece } from "./DiamondPiece";

interface StagingAreaProps {
  /** Array of all diamond pieces in the game */
  pieces: DiamondPieceType[];
  /** ID of the piece currently being hovered, or null */
  hoveredPiece: string | null;
  /** ID of the piece currently being dragged, or null */
  draggedPiece: string | null;
  /** Click handler for piece interaction */
  onPieceClick?: (pieceId: string) => void;
}

/**
 * StagingArea component
 *
 * Displays all diamond pieces that are not currently placed on the board.
 * Pieces are rendered at their staging positions, which are organized by color
 * in rows with consistent spacing.
 *
 * The staging area is positioned below and to the side of the game board,
 * making it easy for players to see and access pieces during gameplay.
 *
 * Visual feedback:
 * - Hovered pieces are highlighted
 * - Dragged pieces are elevated and scaled
 * - Pieces on the board are not rendered in the staging area
 */
export const StagingArea: React.FC<StagingAreaProps> = ({
  pieces,
  hoveredPiece,
  draggedPiece,
  onPieceClick,
}) => {
  // Filter to only show pieces that are not on the board
  // Pieces with slotId === null are in the staging area
  const stagedPieces = pieces.filter((piece) => piece.slotId === null);

  return (
    <group name="staging-area">
      {stagedPieces.map((piece) => (
        <DiamondPiece
          key={piece.id}
          piece={piece}
          isHovered={hoveredPiece === piece.id}
          isDragged={draggedPiece === piece.id}
          onClick={onPieceClick}
        />
      ))}
    </group>
  );
};
