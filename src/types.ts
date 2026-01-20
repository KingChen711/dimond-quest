/**
 * Type definitions for Diamond Quest game models
 * Based on design document section 10: Data Models
 */

import { Vector3 } from "three";

/**
 * Color types for diamond pieces
 * Requirements 2.2-2.6: 3 orange, 3 yellow, 3 green, 3 blue, 1 red
 */
export type PieceColor = "orange" | "yellow" | "green" | "blue" | "red";

/**
 * Shape types for diamond pieces
 * Requirement 2.7: Three distinct shapes
 */
export type PieceShape = "round" | "triangular" | "square";

/**
 * DiamondPiece interface
 * Represents a colored gem-shaped game piece that can be placed on the board
 *
 * Validates: Requirement 2 (Diamond Piece Rendering)
 */
export interface DiamondPiece {
  /** Unique identifier for the piece */
  id: string;

  /** Color of the piece (orange, yellow, green, blue, or red) */
  color: PieceColor;

  /** Shape of the piece (round, triangular, or square) */
  shape: PieceShape;

  /** Current 3D position of the piece in the scene */
  position: Vector3;

  /** ID of the slot this piece occupies, or null if in staging area */
  slotId: string | null;

  /** Original position in staging area for reset functionality */
  stagingPosition: Vector3;
}

/**
 * BoardSlot interface
 * Represents an individual position on the cross-shaped game board
 *
 * Validates: Requirement 1 (Game Board Rendering)
 */
export interface BoardSlot {
  /** Unique identifier for the slot */
  id: string;

  /** 3D position of the slot on the board */
  position: Vector3;

  /** Whether this slot currently has a piece placed in it */
  occupied: boolean;

  /** ID of the piece occupying this slot, or null if empty */
  pieceId: string | null;
}

/**
 * GameState interface
 * Represents the complete state of the game including all pieces, slots, and interaction state
 *
 * Validates: Requirements 2, 3 (Data foundation for pieces and interactions)
 */
export interface GameState {
  /** Array of all 13 diamond pieces in the game */
  pieces: DiamondPiece[];

  /** Array of all 13 board slots in cross pattern */
  slots: BoardSlot[];

  /** ID of the piece currently being dragged, or null if no drag operation */
  draggedPiece: string | null;

  /** ID of the slot currently being hovered during drag, or null */
  hoveredSlot: string | null;

  /** ID of the piece currently being hovered, or null */
  hoveredPiece: string | null;
}
