/**
 * Example game state demonstrating the TypeScript interfaces
 * This file validates that all interfaces work correctly together
 */

import { Vector3 } from "three";
import { DiamondPiece, BoardSlot, GameState } from "./types";

/**
 * Example: Creating a single diamond piece
 * Validates: DiamondPiece interface with all required properties
 */
export const examplePiece: DiamondPiece = {
  id: "piece-1",
  color: "orange",
  shape: "round",
  position: new Vector3(-3, 0, 0),
  slotId: null,
  stagingPosition: new Vector3(-3, -4, 0),
};

/**
 * Example: Creating a board slot
 * Validates: BoardSlot interface with all required properties
 */
export const exampleSlot: BoardSlot = {
  id: "slot-1",
  position: new Vector3(0, 0, 0),
  occupied: false,
  pieceId: null,
};

/**
 * Example: Creating a complete game state
 * Validates: GameState interface with all required properties
 */
export const exampleGameState: GameState = {
  pieces: [
    {
      id: "piece-orange-1",
      color: "orange",
      shape: "round",
      position: new Vector3(-3, -4, 0),
      slotId: null,
      stagingPosition: new Vector3(-3, -4, 0),
    },
    {
      id: "piece-yellow-1",
      color: "yellow",
      shape: "triangular",
      position: new Vector3(-2, -4, 0),
      slotId: null,
      stagingPosition: new Vector3(-2, -4, 0),
    },
    {
      id: "piece-green-1",
      color: "green",
      shape: "square",
      position: new Vector3(-1, -4, 0),
      slotId: null,
      stagingPosition: new Vector3(-1, -4, 0),
    },
  ],
  slots: [
    {
      id: "slot-1",
      position: new Vector3(0, 0, 1.2),
      occupied: false,
      pieceId: null,
    },
    {
      id: "slot-2",
      position: new Vector3(-1.2, 0, 0),
      occupied: false,
      pieceId: null,
    },
    {
      id: "slot-3",
      position: new Vector3(0, 0, 0),
      occupied: false,
      pieceId: null,
    },
  ],
  draggedPiece: null,
  hoveredSlot: null,
  hoveredPiece: null,
};

/**
 * Example: Game state with a piece placed on the board
 * Validates: Bidirectional relationship between pieces and slots
 */
export const exampleGameStateWithPlacement: GameState = {
  pieces: [
    {
      id: "piece-1",
      color: "orange",
      shape: "round",
      position: new Vector3(0, 0, 0),
      slotId: "slot-3", // Piece references the slot
      stagingPosition: new Vector3(-3, -4, 0),
    },
  ],
  slots: [
    {
      id: "slot-3",
      position: new Vector3(0, 0, 0),
      occupied: true, // Slot is marked as occupied
      pieceId: "piece-1", // Slot references the piece
    },
  ],
  draggedPiece: null,
  hoveredSlot: null,
  hoveredPiece: null,
};

/**
 * Example: Game state during a drag operation
 * Validates: Interaction state properties
 */
export const exampleGameStateWithDrag: GameState = {
  pieces: [
    {
      id: "piece-1",
      color: "blue",
      shape: "round",
      position: new Vector3(0, 1, 0), // Elevated during drag
      slotId: null,
      stagingPosition: new Vector3(-3, -4, 0),
    },
  ],
  slots: [
    {
      id: "slot-1",
      position: new Vector3(0, 0, 0),
      occupied: false,
      pieceId: null,
    },
  ],
  draggedPiece: "piece-1", // Piece is being dragged
  hoveredSlot: "slot-1", // Hovering over a slot
  hoveredPiece: null,
};
