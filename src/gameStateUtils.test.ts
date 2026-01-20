/**
 * Unit tests for game state utility functions
 * Tests task 2.2: Initial game state configuration
 *
 * Validates: Requirements 2.2-2.6, 10.2-10.4 (Initial state setup)
 */

import { describe, it, expect } from "vitest";
import {
  generateBoardSlots,
  generateDiamondPieces,
  createInitialGameState,
} from "./gameStateUtils";
import { PieceColor } from "./types";

describe("generateBoardSlots", () => {
  it("should generate exactly 13 slots", () => {
    const slots = generateBoardSlots();
    expect(slots).toHaveLength(13);
  });

  it("should create slots with unique IDs", () => {
    const slots = generateBoardSlots();
    const ids = slots.map((slot) => slot.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(13);
  });

  it("should create slots with unique positions", () => {
    const slots = generateBoardSlots();
    const positions = slots.map(
      (slot) => `${slot.position.x},${slot.position.y},${slot.position.z}`,
    );
    const uniquePositions = new Set(positions);
    expect(uniquePositions.size).toBe(13);
  });

  it("should initialize all slots as unoccupied", () => {
    const slots = generateBoardSlots();
    slots.forEach((slot) => {
      expect(slot.occupied).toBe(false);
      expect(slot.pieceId).toBeNull();
    });
  });

  it("should position slots at y=0 (board level)", () => {
    const slots = generateBoardSlots();
    slots.forEach((slot) => {
      expect(slot.position.y).toBe(0);
    });
  });

  it("should create slots in cross pattern with correct spacing", () => {
    const slots = generateBoardSlots();
    const spacing = 1.2;

    // Test specific slot positions to verify cross pattern
    // Top single slot
    const slot1 = slots.find((s) => s.id === "slot-1");
    expect(slot1?.position.x).toBeCloseTo(0);
    expect(slot1?.position.z).toBeCloseTo(spacing * 2);

    // Middle slot
    const slot6 = slots.find((s) => s.id === "slot-6");
    expect(slot6?.position.x).toBeCloseTo(0);
    expect(slot6?.position.z).toBeCloseTo(0);

    // Verify horizontal row spacing
    const slot2 = slots.find((s) => s.id === "slot-2");
    const slot3 = slots.find((s) => s.id === "slot-3");
    if (slot2 && slot3) {
      const distance = Math.abs(slot3.position.x - slot2.position.x);
      expect(distance).toBeCloseTo(spacing);
    }
  });
});

describe("generateDiamondPieces", () => {
  it("should generate exactly 13 pieces", () => {
    const pieces = generateDiamondPieces();
    expect(pieces).toHaveLength(13);
  });

  it("should create pieces with unique IDs", () => {
    const pieces = generateDiamondPieces();
    const ids = pieces.map((piece) => piece.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(13);
  });

  it("should have correct color distribution (3-3-3-3-1)", () => {
    const pieces = generateDiamondPieces();

    const colorCounts: Record<PieceColor, number> = {
      orange: 0,
      yellow: 0,
      green: 0,
      blue: 0,
      red: 0,
    };

    pieces.forEach((piece) => {
      colorCounts[piece.color]++;
    });

    // Validates: Requirements 2.2-2.6
    expect(colorCounts.orange).toBe(3);
    expect(colorCounts.yellow).toBe(3);
    expect(colorCounts.green).toBe(3);
    expect(colorCounts.blue).toBe(3);
    expect(colorCounts.red).toBe(1);
  });

  it("should have correct shape distribution per color", () => {
    const pieces = generateDiamondPieces();

    // Group pieces by color
    const piecesByColor: Record<PieceColor, typeof pieces> = {
      orange: [],
      yellow: [],
      green: [],
      blue: [],
      red: [],
    };

    pieces.forEach((piece) => {
      piecesByColor[piece.color].push(piece);
    });

    // Each color group (except red) should have one of each shape
    const colorsWithThreeShapes: PieceColor[] = [
      "orange",
      "yellow",
      "green",
      "blue",
    ];

    colorsWithThreeShapes.forEach((color) => {
      const shapes = piecesByColor[color].map((p) => p.shape).sort();
      expect(shapes).toEqual(["round", "square", "triangular"]);
    });

    // Red should only have round shape
    const redShapes = piecesByColor.red.map((p) => p.shape);
    expect(redShapes).toEqual(["round"]);
  });

  it("should initialize all pieces with slotId as null", () => {
    const pieces = generateDiamondPieces();
    pieces.forEach((piece) => {
      expect(piece.slotId).toBeNull();
    });
  });

  it("should position all pieces in staging area", () => {
    const pieces = generateDiamondPieces();

    // All pieces should be in staging area (negative y coordinate)
    pieces.forEach((piece) => {
      expect(piece.position.y).toBeLessThan(0);
      expect(piece.stagingPosition.y).toBeLessThan(0);
    });
  });

  it("should set position equal to stagingPosition initially", () => {
    const pieces = generateDiamondPieces();

    pieces.forEach((piece) => {
      expect(piece.position.x).toBe(piece.stagingPosition.x);
      expect(piece.position.y).toBe(piece.stagingPosition.y);
      expect(piece.position.z).toBe(piece.stagingPosition.z);
    });
  });

  it("should arrange pieces with consistent spacing", () => {
    const pieces = generateDiamondPieces();
    const spacing = 1.0;

    // Find orange pieces (should be in same row)
    const orangePieces = pieces.filter((p) => p.color === "orange");
    expect(orangePieces).toHaveLength(3);

    // Check horizontal spacing between pieces of same color
    if (orangePieces.length >= 2) {
      const sortedByX = orangePieces.sort(
        (a, b) => a.position.x - b.position.x,
      );
      for (let i = 1; i < sortedByX.length; i++) {
        const distance = sortedByX[i].position.x - sortedByX[i - 1].position.x;
        expect(distance).toBeCloseTo(spacing);
      }
    }
  });

  it("should organize pieces by color in rows", () => {
    const pieces = generateDiamondPieces();

    // Group pieces by color and check they share same z coordinate
    const colors: PieceColor[] = ["orange", "yellow", "green", "blue", "red"];

    colors.forEach((color) => {
      const colorPieces = pieces.filter((p) => p.color === color);
      const zCoords = colorPieces.map((p) => p.position.z);
      const uniqueZ = new Set(zCoords);

      // All pieces of same color should be in same row (same z)
      expect(uniqueZ.size).toBe(1);
    });
  });
});

describe("createInitialGameState", () => {
  it("should create a complete game state", () => {
    const gameState = createInitialGameState();

    expect(gameState).toBeDefined();
    expect(gameState.pieces).toBeDefined();
    expect(gameState.slots).toBeDefined();
    expect(gameState.draggedPiece).toBeNull();
    expect(gameState.hoveredSlot).toBeNull();
    expect(gameState.hoveredPiece).toBeNull();
  });

  it("should have 13 pieces and 13 slots", () => {
    const gameState = createInitialGameState();

    expect(gameState.pieces).toHaveLength(13);
    expect(gameState.slots).toHaveLength(13);
  });

  it("should have all slots unoccupied initially", () => {
    const gameState = createInitialGameState();

    gameState.slots.forEach((slot) => {
      expect(slot.occupied).toBe(false);
      expect(slot.pieceId).toBeNull();
    });
  });

  it("should have all pieces in staging area initially", () => {
    const gameState = createInitialGameState();

    gameState.pieces.forEach((piece) => {
      expect(piece.slotId).toBeNull();
      expect(piece.position.y).toBeLessThan(0);
    });
  });

  it("should maintain correct piece color distribution", () => {
    const gameState = createInitialGameState();

    const colorCounts: Record<PieceColor, number> = {
      orange: 0,
      yellow: 0,
      green: 0,
      blue: 0,
      red: 0,
    };

    gameState.pieces.forEach((piece) => {
      colorCounts[piece.color]++;
    });

    expect(colorCounts.orange).toBe(3);
    expect(colorCounts.yellow).toBe(3);
    expect(colorCounts.green).toBe(3);
    expect(colorCounts.blue).toBe(3);
    expect(colorCounts.red).toBe(1);
  });
});
