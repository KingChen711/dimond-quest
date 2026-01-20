/**
 * Utility functions for game state management
 * Demonstrates usage of the TypeScript interfaces defined in types.ts
 */

import { Vector3 } from "three";
import {
  DiamondPiece,
  BoardSlot,
  GameState,
  PieceColor,
  PieceShape,
} from "./types";

/**
 * Creates a new DiamondPiece with the specified properties
 * This validates that the DiamondPiece interface is correctly defined
 */
export function createPiece(
  id: string,
  color: PieceColor,
  shape: PieceShape,
  position: Vector3,
  stagingPosition: Vector3,
  slotId: string | null = null,
): DiamondPiece {
  return {
    id,
    color,
    shape,
    position,
    slotId,
    stagingPosition,
  };
}

/**
 * Creates a new BoardSlot with the specified properties
 * This validates that the BoardSlot interface is correctly defined
 */
export function createSlot(
  id: string,
  position: Vector3,
  occupied: boolean = false,
  pieceId: string | null = null,
): BoardSlot {
  return {
    id,
    position,
    occupied,
    pieceId,
  };
}

/**
 * Creates an initial empty game state
 * This validates that the GameState interface is correctly defined
 */
export function createEmptyGameState(): GameState {
  return {
    pieces: [],
    slots: [],
    draggedPiece: null,
    hoveredSlot: null,
    hoveredPiece: null,
  };
}

/**
 * Type guard to check if a piece color is valid
 */
export function isValidPieceColor(color: string): color is PieceColor {
  return ["orange", "yellow", "green", "blue", "red"].includes(color);
}

/**
 * Type guard to check if a piece shape is valid
 */
export function isValidPieceShape(shape: string): shape is PieceShape {
  return ["round", "triangular", "square"].includes(shape);
}

/**
 * Generates 13 board slots in a diamond pattern
 * Layout matches the diamond-shaped board exactly:
 *        [1]
 *      [2][3][4]
 *   [5][6][7][8][9]
 *     [10][11][12]
 *        [13]
 *
 * Pattern: 1-3-5-3-1 slots per row
 * Slot spacing: 1.2 units between centers
 * Board positioned at origin (0, 0, 0)
 *
 * Validates: Requirements 1.1, 1.3, 10.1 (Board structure and initial state)
 */
export function generateBoardSlots(): BoardSlot[] {
  const spacing = 1.2;
  const slots: BoardSlot[] = [];

  // Define slot positions to match the diamond-shaped board sections
  const slotPositions: Array<{ id: string; x: number; z: number }> = [
    // Row 1: 1 slot at top
    { id: "slot-1", x: 0, z: spacing * 2 },

    // Row 2: 3 slots
    { id: "slot-2", x: -spacing, z: spacing },
    { id: "slot-3", x: 0, z: spacing },
    { id: "slot-4", x: spacing, z: spacing },

    // Row 3: 5 slots (widest row)
    { id: "slot-5", x: -spacing * 2, z: 0 },
    { id: "slot-6", x: -spacing, z: 0 },
    { id: "slot-7", x: 0, z: 0 },
    { id: "slot-8", x: spacing, z: 0 },
    { id: "slot-9", x: spacing * 2, z: 0 },

    // Row 4: 3 slots
    { id: "slot-10", x: -spacing, z: -spacing },
    { id: "slot-11", x: 0, z: -spacing },
    { id: "slot-12", x: spacing, z: -spacing },

    // Row 5: 1 slot at bottom
    { id: "slot-13", x: 0, z: -spacing * 2 },
  ];

  // Rotate positions 45 degrees around Y-axis to match board rotation
  const angle = Math.PI / 4; // 45 degrees
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  // Create BoardSlot objects with rotated 3D positions
  for (const pos of slotPositions) {
    // Apply 2D rotation matrix: x' = x*cos - z*sin, z' = x*sin + z*cos
    const rotatedX = pos.x * cos - pos.z * sin;
    const rotatedZ = pos.x * sin + pos.z * cos;

    slots.push(
      createSlot(pos.id, new Vector3(rotatedX, 0, rotatedZ), false, null),
    );
  }

  return slots;
}

/**
 * Generates 13 diamond pieces with correct color and shape distribution
 *
 * Color distribution (Requirements 2.2-2.6):
 * - 3 orange pieces (round, triangular, square)
 * - 3 yellow pieces (round, triangular, square)
 * - 3 green pieces (round, triangular, square)
 * - 3 blue pieces (round, triangular, square)
 * - 1 red piece (round)
 *
 * All pieces start in the staging area (Requirement 10.2)
 *
 * Validates: Requirements 2.2-2.6, 10.2-10.4 (Piece distribution and initial state)
 */
export function generateDiamondPieces(): DiamondPiece[] {
  const pieces: DiamondPiece[] = [];

  // Staging area configuration
  // Position: right side of the board (x: 6, y: 0, z: 0)
  // Arrangement: organized by shape in 3 rows (round, triangular, square)
  // Spacing: 1.5 units between pieces (increased for better visibility)
  const stagingBaseX = 6;
  const stagingBaseY = 0; // Same level as board
  const stagingBaseZ = 2; // Centered vertically
  const pieceSpacing = 1.5; // Increased from 1.0 to 1.5

  // Define piece configurations grouped by shape
  // Each shape row contains all 5 colors (orange, yellow, green, blue, red)
  const shapeGroups: Array<{
    shape: PieceShape;
    colors: PieceColor[];
    rowOffset: number;
  }> = [
    {
      shape: "round",
      colors: ["orange", "yellow", "green", "blue", "red"],
      rowOffset: 0,
    },
    {
      shape: "triangular",
      colors: ["orange", "yellow", "green", "blue"],
      rowOffset: 1,
    },
    {
      shape: "square",
      colors: ["orange", "yellow", "green", "blue"],
      rowOffset: 2,
    },
  ];

  let pieceIndex = 1;

  // Generate pieces for each shape group
  for (const group of shapeGroups) {
    for (let colorIndex = 0; colorIndex < group.colors.length; colorIndex++) {
      const color = group.colors[colorIndex];

      // Calculate staging position
      // Pieces are arranged in horizontal rows by shape
      // x increases for each piece in the row (horizontal spread)
      // z decreases for each row (vertical rows)
      const x = stagingBaseX + colorIndex * pieceSpacing;
      const y = stagingBaseY;
      const z = stagingBaseZ - group.rowOffset * (pieceSpacing * 1.5);

      const stagingPosition = new Vector3(x, y, z);

      // Create piece with staging position as initial position
      const piece = createPiece(
        `piece-${color}-${group.shape}`,
        color,
        group.shape,
        stagingPosition.clone(), // Current position starts at staging
        stagingPosition.clone(), // Store staging position for reset
        null, // Not on board initially
      );

      pieces.push(piece);
      pieceIndex++;
    }
  }

  return pieces;
}

/**
 * Creates the initial game state with all pieces in staging area and empty board
 *
 * Validates: Requirements 10.1-10.4 (Initial game state)
 */
export function createInitialGameState(): GameState {
  return {
    pieces: generateDiamondPieces(),
    slots: generateBoardSlots(),
    draggedPiece: null,
    hoveredSlot: null,
    hoveredPiece: null,
  };
}
