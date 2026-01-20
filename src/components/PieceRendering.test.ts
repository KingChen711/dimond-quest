/**
 * Unit tests for piece rendering
 * Task 4.4: Write unit tests for piece rendering
 *
 * Tests verify:
 * - Correct number of pieces (13 total)
 * - Color distribution (3 orange, 3 yellow, 3 green, 3 blue, 1 red)
 * - Shape distribution per color
 *
 * **Validates: Properties 2.1, 2.2 (Color and Shape Distribution)**
 */

import { describe, it, expect } from "vitest";
import { generateDiamondPieces } from "../gameStateUtils";
import { PieceColor, PieceShape } from "../types";

describe("Piece Rendering", () => {
  describe("Total Piece Count", () => {
    it("should render exactly 13 pieces", () => {
      const pieces = generateDiamondPieces();

      expect(pieces).toHaveLength(13);
    });

    it("should have unique IDs for all pieces", () => {
      const pieces = generateDiamondPieces();
      const ids = pieces.map((p) => p.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(13);
    });
  });

  describe("Color Distribution - Property 2.1", () => {
    it("should render exactly 3 orange pieces", () => {
      const pieces = generateDiamondPieces();
      const orangePieces = pieces.filter((p) => p.color === "orange");

      expect(orangePieces).toHaveLength(3);
    });

    it("should render exactly 3 yellow pieces", () => {
      const pieces = generateDiamondPieces();
      const yellowPieces = pieces.filter((p) => p.color === "yellow");

      expect(yellowPieces).toHaveLength(3);
    });

    it("should render exactly 3 green pieces", () => {
      const pieces = generateDiamondPieces();
      const greenPieces = pieces.filter((p) => p.color === "green");

      expect(greenPieces).toHaveLength(3);
    });

    it("should render exactly 3 blue pieces", () => {
      const pieces = generateDiamondPieces();
      const bluePieces = pieces.filter((p) => p.color === "blue");

      expect(bluePieces).toHaveLength(3);
    });

    it("should render exactly 1 red piece", () => {
      const pieces = generateDiamondPieces();
      const redPieces = pieces.filter((p) => p.color === "red");

      expect(redPieces).toHaveLength(1);
    });

    it("should maintain correct color distribution (3-3-3-3-1)", () => {
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

      expect(colorCounts).toEqual({
        orange: 3,
        yellow: 3,
        green: 3,
        blue: 3,
        red: 1,
      });
    });

    it("should only use valid piece colors", () => {
      const pieces = generateDiamondPieces();
      const validColors: PieceColor[] = [
        "orange",
        "yellow",
        "green",
        "blue",
        "red",
      ];

      pieces.forEach((piece) => {
        expect(validColors).toContain(piece.color);
      });
    });
  });

  describe("Shape Distribution - Property 2.2", () => {
    it("should render orange pieces with all three shapes", () => {
      const pieces = generateDiamondPieces();
      const orangePieces = pieces.filter((p) => p.color === "orange");
      const shapes = orangePieces.map((p) => p.shape).sort();

      expect(shapes).toEqual(["round", "square", "triangular"]);
    });

    it("should render yellow pieces with all three shapes", () => {
      const pieces = generateDiamondPieces();
      const yellowPieces = pieces.filter((p) => p.color === "yellow");
      const shapes = yellowPieces.map((p) => p.shape).sort();

      expect(shapes).toEqual(["round", "square", "triangular"]);
    });

    it("should render green pieces with all three shapes", () => {
      const pieces = generateDiamondPieces();
      const greenPieces = pieces.filter((p) => p.color === "green");
      const shapes = greenPieces.map((p) => p.shape).sort();

      expect(shapes).toEqual(["round", "square", "triangular"]);
    });

    it("should render blue pieces with all three shapes", () => {
      const pieces = generateDiamondPieces();
      const bluePieces = pieces.filter((p) => p.color === "blue");
      const shapes = bluePieces.map((p) => p.shape).sort();

      expect(shapes).toEqual(["round", "square", "triangular"]);
    });

    it("should render red piece with round shape only", () => {
      const pieces = generateDiamondPieces();
      const redPieces = pieces.filter((p) => p.color === "red");

      expect(redPieces).toHaveLength(1);
      expect(redPieces[0].shape).toBe("round");
    });

    it("should have exactly one piece of each shape per color (except red)", () => {
      const pieces = generateDiamondPieces();
      const colorsWithThreeShapes: PieceColor[] = [
        "orange",
        "yellow",
        "green",
        "blue",
      ];

      colorsWithThreeShapes.forEach((color) => {
        const colorPieces = pieces.filter((p) => p.color === color);

        const roundCount = colorPieces.filter(
          (p) => p.shape === "round",
        ).length;
        const triangularCount = colorPieces.filter(
          (p) => p.shape === "triangular",
        ).length;
        const squareCount = colorPieces.filter(
          (p) => p.shape === "square",
        ).length;

        expect(roundCount).toBe(1);
        expect(triangularCount).toBe(1);
        expect(squareCount).toBe(1);
      });
    });

    it("should only use valid piece shapes", () => {
      const pieces = generateDiamondPieces();
      const validShapes: PieceShape[] = ["round", "triangular", "square"];

      pieces.forEach((piece) => {
        expect(validShapes).toContain(piece.shape);
      });
    });

    it("should render total of 5 round pieces (one per color)", () => {
      const pieces = generateDiamondPieces();
      const roundPieces = pieces.filter((p) => p.shape === "round");

      expect(roundPieces).toHaveLength(5);
    });

    it("should render total of 4 triangular pieces (one per color except red)", () => {
      const pieces = generateDiamondPieces();
      const triangularPieces = pieces.filter((p) => p.shape === "triangular");

      expect(triangularPieces).toHaveLength(4);
    });

    it("should render total of 4 square pieces (one per color except red)", () => {
      const pieces = generateDiamondPieces();
      const squarePieces = pieces.filter((p) => p.shape === "square");

      expect(squarePieces).toHaveLength(4);
    });
  });

  describe("Combined Color and Shape Distribution", () => {
    it("should have correct distribution across all color-shape combinations", () => {
      const pieces = generateDiamondPieces();

      // Expected combinations
      const expectedCombinations = [
        // Orange
        { color: "orange" as PieceColor, shape: "round" as PieceShape },
        { color: "orange" as PieceColor, shape: "triangular" as PieceShape },
        { color: "orange" as PieceColor, shape: "square" as PieceShape },
        // Yellow
        { color: "yellow" as PieceColor, shape: "round" as PieceShape },
        { color: "yellow" as PieceColor, shape: "triangular" as PieceShape },
        { color: "yellow" as PieceColor, shape: "square" as PieceShape },
        // Green
        { color: "green" as PieceColor, shape: "round" as PieceShape },
        { color: "green" as PieceColor, shape: "triangular" as PieceShape },
        { color: "green" as PieceColor, shape: "square" as PieceShape },
        // Blue
        { color: "blue" as PieceColor, shape: "round" as PieceShape },
        { color: "blue" as PieceColor, shape: "triangular" as PieceShape },
        { color: "blue" as PieceColor, shape: "square" as PieceShape },
        // Red
        { color: "red" as PieceColor, shape: "round" as PieceShape },
      ];

      // Verify each expected combination exists exactly once
      expectedCombinations.forEach((expected) => {
        const matchingPieces = pieces.filter(
          (p) => p.color === expected.color && p.shape === expected.shape,
        );

        expect(matchingPieces).toHaveLength(1);
      });
    });

    it("should not have any unexpected color-shape combinations", () => {
      const pieces = generateDiamondPieces();

      // Red should not have triangular or square shapes
      const redTriangular = pieces.filter(
        (p) => p.color === "red" && p.shape === "triangular",
      );
      const redSquare = pieces.filter(
        (p) => p.color === "red" && p.shape === "square",
      );

      expect(redTriangular).toHaveLength(0);
      expect(redSquare).toHaveLength(0);
    });

    it("should maintain distribution consistency across multiple generations", () => {
      // Generate pieces multiple times to ensure consistency
      for (let i = 0; i < 5; i++) {
        const pieces = generateDiamondPieces();

        expect(pieces).toHaveLength(13);

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

        expect(colorCounts).toEqual({
          orange: 3,
          yellow: 3,
          green: 3,
          blue: 3,
          red: 1,
        });
      }
    });
  });

  describe("Piece Rendering Properties", () => {
    it("should render all pieces with valid positions", () => {
      const pieces = generateDiamondPieces();

      pieces.forEach((piece) => {
        expect(piece.position).toBeDefined();
        expect(typeof piece.position.x).toBe("number");
        expect(typeof piece.position.y).toBe("number");
        expect(typeof piece.position.z).toBe("number");
        expect(Number.isFinite(piece.position.x)).toBe(true);
        expect(Number.isFinite(piece.position.y)).toBe(true);
        expect(Number.isFinite(piece.position.z)).toBe(true);
      });
    });

    it("should render all pieces with staging positions", () => {
      const pieces = generateDiamondPieces();

      pieces.forEach((piece) => {
        expect(piece.stagingPosition).toBeDefined();
        expect(typeof piece.stagingPosition.x).toBe("number");
        expect(typeof piece.stagingPosition.y).toBe("number");
        expect(typeof piece.stagingPosition.z).toBe("number");
      });
    });

    it("should render all pieces initially not placed on board", () => {
      const pieces = generateDiamondPieces();

      pieces.forEach((piece) => {
        expect(piece.slotId).toBeNull();
      });
    });
  });
});
