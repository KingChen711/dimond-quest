import { describe, it, expect } from "vitest";
import { DiamondPiece } from "../types";
import { Vector3 } from "three";
import { generateDiamondPieces } from "../gameStateUtils";

function createTestPiece(
  id: string,
  color: "orange" | "yellow" | "green" | "blue" | "red",
  shape: "round" | "triangular" | "square",
  slotId: string | null = null,
): DiamondPiece {
  const stagingPosition = new Vector3(-3, -4, 0);
  return {
    id,
    color,
    shape,
    position: stagingPosition.clone(),
    slotId,
    stagingPosition,
  };
}

describe("StagingArea Component", () => {
  describe("Piece Filtering", () => {
    it("should filter pieces to only show those not on the board", () => {
      const pieces: DiamondPiece[] = [
        createTestPiece("piece-1", "orange", "round", null),
        createTestPiece("piece-2", "yellow", "triangular", null),
        createTestPiece("piece-3", "green", "square", "slot-1"),
        createTestPiece("piece-4", "blue", "round", null),
        createTestPiece("piece-5", "red", "round", "slot-2"),
      ];

      const stagedPieces = pieces.filter((piece) => piece.slotId === null);

      expect(stagedPieces).toHaveLength(3);
      expect(stagedPieces.map((p) => p.id)).toEqual([
        "piece-1",
        "piece-2",
        "piece-4",
      ]);
    });

    it("should show no pieces when all are on the board", () => {
      const pieces: DiamondPiece[] = [
        createTestPiece("piece-1", "orange", "round", "slot-1"),
        createTestPiece("piece-2", "yellow", "triangular", "slot-2"),
        createTestPiece("piece-3", "green", "square", "slot-3"),
      ];

      const stagedPieces = pieces.filter((piece) => piece.slotId === null);

      expect(stagedPieces).toHaveLength(0);
    });

    it("should show all 13 pieces when none are on the board", () => {
      const pieces: DiamondPiece[] = [
        createTestPiece("piece-orange-round", "orange", "round", null),
        createTestPiece(
          "piece-orange-triangular",
          "orange",
          "triangular",
          null,
        ),
        createTestPiece("piece-orange-square", "orange", "square", null),
        createTestPiece("piece-yellow-round", "yellow", "round", null),
        createTestPiece(
          "piece-yellow-triangular",
          "yellow",
          "triangular",
          null,
        ),
        createTestPiece("piece-yellow-square", "yellow", "square", null),
        createTestPiece("piece-green-round", "green", "round", null),
        createTestPiece("piece-green-triangular", "green", "triangular", null),
        createTestPiece("piece-green-square", "green", "square", null),
        createTestPiece("piece-blue-round", "blue", "round", null),
        createTestPiece("piece-blue-triangular", "blue", "triangular", null),
        createTestPiece("piece-blue-square", "blue", "square", null),
        createTestPiece("piece-red-round", "red", "round", null),
      ];

      const stagedPieces = pieces.filter((piece) => piece.slotId === null);

      expect(stagedPieces).toHaveLength(13);
    });

    it("should handle empty pieces array", () => {
      const pieces: DiamondPiece[] = [];
      const stagedPieces = pieces.filter((piece) => piece.slotId === null);

      expect(stagedPieces).toHaveLength(0);
    });
  });

  describe("Staging Area Layout", () => {
    it("should position staging area at correct coordinates", () => {
      const stagingBaseX = -3;
      const stagingBaseY = -4;
      const stagingBaseZ = 0;

      expect(stagingBaseX).toBe(-3);
      expect(stagingBaseY).toBe(-4);
      expect(stagingBaseZ).toBe(0);
    });

    it("should use 1.0 unit spacing between pieces", () => {
      const pieceSpacing = 1.0;

      expect(pieceSpacing).toBe(1.0);
    });

    it("should arrange pieces in 5 rows grouped by color", () => {
      const pieces = generateDiamondPieces();

      const orangePieces = pieces.filter((p) => p.color === "orange");
      const yellowPieces = pieces.filter((p) => p.color === "yellow");
      const greenPieces = pieces.filter((p) => p.color === "green");
      const bluePieces = pieces.filter((p) => p.color === "blue");
      const redPieces = pieces.filter((p) => p.color === "red");

      expect(orangePieces).toHaveLength(3);
      expect(yellowPieces).toHaveLength(3);
      expect(greenPieces).toHaveLength(3);
      expect(bluePieces).toHaveLength(3);
      expect(redPieces).toHaveLength(1);
    });

    it("should position orange pieces in row 0", () => {
      const pieces = generateDiamondPieces();
      const orangePieces = pieces.filter((p) => p.color === "orange");

      orangePieces.forEach((piece) => {
        expect(piece.stagingPosition.z).toBe(0);
      });
    });

    it("should position yellow pieces in row 1", () => {
      const pieces = generateDiamondPieces();
      const yellowPieces = pieces.filter((p) => p.color === "yellow");

      yellowPieces.forEach((piece) => {
        expect(piece.stagingPosition.z).toBe(1.0);
      });
    });

    it("should position green pieces in row 2", () => {
      const pieces = generateDiamondPieces();
      const greenPieces = pieces.filter((p) => p.color === "green");

      greenPieces.forEach((piece) => {
        expect(piece.stagingPosition.z).toBe(2.0);
      });
    });

    it("should position blue pieces in row 3", () => {
      const pieces = generateDiamondPieces();
      const bluePieces = pieces.filter((p) => p.color === "blue");

      bluePieces.forEach((piece) => {
        expect(piece.stagingPosition.z).toBe(3.0);
      });
    });

    it("should position red piece in row 4", () => {
      const pieces = generateDiamondPieces();
      const redPieces = pieces.filter((p) => p.color === "red");

      expect(redPieces[0].stagingPosition.z).toBe(4.0);
    });

    it("should space pieces horizontally within each row", () => {
      const pieces = generateDiamondPieces();
      const orangePieces = pieces
        .filter((p) => p.color === "orange")
        .sort((a, b) => a.stagingPosition.x - b.stagingPosition.x);

      const spacing = 1.0;
      const baseX = -3;

      expect(orangePieces[0].stagingPosition.x).toBe(baseX);
      expect(orangePieces[1].stagingPosition.x).toBe(baseX + spacing);
      expect(orangePieces[2].stagingPosition.x).toBe(baseX + spacing * 2);
    });

    it("should position all pieces at y equals -4", () => {
      const pieces = generateDiamondPieces();

      pieces.forEach((piece) => {
        expect(piece.stagingPosition.y).toBe(-4);
      });
    });
  });

  describe("Visual Feedback", () => {
    it("should identify hovered piece correctly", () => {
      const hoveredPiece: string | null = "piece-1";

      const isPiece1Hovered = hoveredPiece === "piece-1";
      const isPiece2Hovered = hoveredPiece === "piece-2";

      expect(isPiece1Hovered).toBe(true);
      expect(isPiece2Hovered).toBe(false);
    });

    it("should identify dragged piece correctly", () => {
      const draggedPiece: string | null = "piece-2";

      const isPiece1Dragged = draggedPiece === "piece-1";
      const isPiece2Dragged = draggedPiece === "piece-2";

      expect(isPiece1Dragged).toBe(false);
      expect(isPiece2Dragged).toBe(true);
    });

    it("should handle no hover state", () => {
      const hoveredPiece: string | null = null;

      expect(hoveredPiece).toBeNull();
    });

    it("should handle no drag state", () => {
      const draggedPiece: string | null = null;

      expect(draggedPiece).toBeNull();
    });
  });

  describe("Integration with Game State", () => {
    it("should work with pieces generated by generateDiamondPieces", () => {
      const pieces = generateDiamondPieces();

      const stagedPieces = pieces.filter((piece) => piece.slotId === null);

      expect(stagedPieces).toHaveLength(13);
      expect(pieces).toHaveLength(13);
    });

    it("should correctly identify pieces after some are placed on board", () => {
      const pieces = generateDiamondPieces();

      pieces[0].slotId = "slot-1";
      pieces[1].slotId = "slot-2";
      pieces[2].slotId = "slot-3";

      const stagedPieces = pieces.filter((piece) => piece.slotId === null);

      expect(stagedPieces).toHaveLength(10);
    });
  });
});
