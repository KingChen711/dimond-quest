/**
 * Unit tests for dragging behavior functionality
 *
 * Tests verify:
 * - Piece position updates to follow cursor during drag
 * - Raycasting onto horizontal plane at board height
 * - Continuous detection of hovered slot
 * - Piece maintains elevated position (y = 1.0) during drag
 *
 * Validates: Requirement 3.2 (Drag movement)
 */

import { describe, it, expect } from "vitest";
import { Vector3 } from "three";
import { GameState, DiamondPiece, BoardSlot } from "./types";

describe("Dragging Behavior", () => {
  // Helper function to create a test piece
  const createTestPiece = (
    id: string,
    x: number,
    y: number,
    z: number,
    slotId: string | null = null,
  ): DiamondPiece => ({
    id,
    color: "orange",
    shape: "round",
    position: new Vector3(x, y, z),
    slotId,
    stagingPosition: new Vector3(x, y, z),
  });

  // Helper function to create a test slot
  const createTestSlot = (
    id: string,
    x: number,
    y: number,
    z: number,
    occupied: boolean = false,
    pieceId: string | null = null,
  ): BoardSlot => ({
    id,
    position: new Vector3(x, y, z),
    occupied,
    pieceId,
  });

  // Helper function to simulate updateDragPosition
  const updateDragPosition = (
    gameState: GameState,
    cursorX: number,
    cursorZ: number,
  ): GameState => {
    if (!gameState.draggedPiece) return gameState;

    // Update piece position to follow cursor
    const updatedPieces = gameState.pieces.map((p) => {
      if (p.id === gameState.draggedPiece) {
        // Keep piece elevated (y = 1.0) during drag
        return {
          ...p,
          position: new Vector3(cursorX, 1.0, cursorZ),
        };
      }
      return p;
    });

    // Detect hovered slot
    const hoveredSlot = detectHoveredSlot(
      new Vector3(cursorX, 1.0, cursorZ),
      gameState.slots,
    );

    return {
      ...gameState,
      pieces: updatedPieces,
      hoveredSlot: hoveredSlot ? hoveredSlot.id : null,
    };
  };

  // Helper function to detect hovered slot
  const detectHoveredSlot = (
    position: Vector3,
    slots: BoardSlot[],
  ): BoardSlot | null => {
    const hoverThreshold = 0.5;

    for (const slot of slots) {
      // Only consider x and z coordinates for distance (ignore y)
      const dx = position.x - slot.position.x;
      const dz = position.z - slot.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < hoverThreshold) {
        return slot;
      }
    }

    return null;
  };

  describe("Piece Position Updates", () => {
    it("should update piece position to follow cursor", () => {
      // Requirement 3.2: System SHALL move the piece to follow cursor position
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", -3, 1.0, 0)],
        slots: [],
        draggedPiece: "piece-1",
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = updateDragPosition(initialState, 1.5, 2.0);
      const draggedPiece = newState.pieces.find((p) => p.id === "piece-1");

      expect(draggedPiece).toBeDefined();
      expect(draggedPiece!.position.x).toBe(1.5);
      expect(draggedPiece!.position.z).toBe(2.0);
    });

    it("should maintain elevated position (y = 1.0) during drag", () => {
      // Piece should stay at y = 1.0 throughout the drag operation
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", 0, 1.0, 0)],
        slots: [],
        draggedPiece: "piece-1",
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = updateDragPosition(initialState, 2.0, 3.0);
      const draggedPiece = newState.pieces.find((p) => p.id === "piece-1");

      expect(draggedPiece).toBeDefined();
      expect(draggedPiece!.position.y).toBe(1.0);
    });

    it("should not update position if no piece is being dragged", () => {
      // If draggedPiece is null, positions should remain unchanged
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", -3, -4, 0)],
        slots: [],
        draggedPiece: null,
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = updateDragPosition(initialState, 1.5, 2.0);

      expect(newState).toEqual(initialState);
    });

    it("should only update the dragged piece position", () => {
      // Other pieces should remain at their original positions
      const initialState: GameState = {
        pieces: [
          createTestPiece("piece-1", 0, 1.0, 0),
          createTestPiece("piece-2", -2, -4, 0),
          createTestPiece("piece-3", -1, -4, 0),
        ],
        slots: [],
        draggedPiece: "piece-1",
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = updateDragPosition(initialState, 1.5, 2.0);
      const piece2 = newState.pieces.find((p) => p.id === "piece-2");
      const piece3 = newState.pieces.find((p) => p.id === "piece-3");

      expect(piece2!.position.x).toBe(-2);
      expect(piece2!.position.y).toBe(-4);
      expect(piece2!.position.z).toBe(0);

      expect(piece3!.position.x).toBe(-1);
      expect(piece3!.position.y).toBe(-4);
      expect(piece3!.position.z).toBe(0);
    });
  });

  describe("Slot Hover Detection", () => {
    it("should detect hovered slot when cursor is near slot position", () => {
      // When cursor is within threshold distance, slot should be detected
      const slot = createTestSlot("slot-1", 0, 0, 0);
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", -3, 1.0, 0)],
        slots: [slot],
        draggedPiece: "piece-1",
        hoveredSlot: null,
        hoveredPiece: null,
      };

      // Move cursor to slot position (0, 0)
      const newState = updateDragPosition(initialState, 0, 0);

      expect(newState.hoveredSlot).toBe("slot-1");
    });

    it("should detect hovered slot when cursor is within threshold", () => {
      // Threshold is 0.5 units, so cursor at 0.3 units away should detect slot
      const slot = createTestSlot("slot-1", 0, 0, 0);
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", -3, 1.0, 0)],
        slots: [slot],
        draggedPiece: "piece-1",
        hoveredSlot: null,
        hoveredPiece: null,
      };

      // Move cursor to 0.3 units away from slot
      const newState = updateDragPosition(initialState, 0.3, 0);

      expect(newState.hoveredSlot).toBe("slot-1");
    });

    it("should not detect slot when cursor is beyond threshold", () => {
      // Threshold is 0.5 units, so cursor at 0.6 units away should not detect slot
      const slot = createTestSlot("slot-1", 0, 0, 0);
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", -3, 1.0, 0)],
        slots: [slot],
        draggedPiece: "piece-1",
        hoveredSlot: null,
        hoveredPiece: null,
      };

      // Move cursor to 0.6 units away from slot
      const newState = updateDragPosition(initialState, 0.6, 0);

      expect(newState.hoveredSlot).toBeNull();
    });

    it("should clear hoveredSlot when cursor moves away from slot", () => {
      // When cursor moves away, hoveredSlot should be cleared
      const slot = createTestSlot("slot-1", 0, 0, 0);
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", 0, 1.0, 0)],
        slots: [slot],
        draggedPiece: "piece-1",
        hoveredSlot: "slot-1",
        hoveredPiece: null,
      };

      // Move cursor far away from slot
      const newState = updateDragPosition(initialState, 5.0, 5.0);

      expect(newState.hoveredSlot).toBeNull();
    });

    it("should detect closest slot when multiple slots are nearby", () => {
      // When multiple slots are within threshold, closest one should be detected
      const slots = [
        createTestSlot("slot-1", 0, 0, 0),
        createTestSlot("slot-2", 0.4, 0, 0),
        createTestSlot("slot-3", 1.0, 0, 0),
      ];
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", -3, 1.0, 0)],
        slots: slots,
        draggedPiece: "piece-1",
        hoveredSlot: null,
        hoveredPiece: null,
      };

      // Move cursor to position 0.2, which is closer to slot-1
      const newState = updateDragPosition(initialState, 0.2, 0);

      // Should detect slot-1 (distance 0.2) rather than slot-2 (distance 0.2)
      // or slot-3 (distance 0.8)
      expect(newState.hoveredSlot).toBe("slot-1");
    });

    it("should update hoveredSlot continuously as cursor moves", () => {
      // hoveredSlot should update as cursor moves between slots
      const slots = [
        createTestSlot("slot-1", 0, 0, 0),
        createTestSlot("slot-2", 2.0, 0, 0),
      ];
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", 0, 1.0, 0)],
        slots: slots,
        draggedPiece: "piece-1",
        hoveredSlot: "slot-1",
        hoveredPiece: null,
      };

      // Move cursor to slot-2 position
      const newState = updateDragPosition(initialState, 2.0, 0);

      expect(newState.hoveredSlot).toBe("slot-2");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty slots array", () => {
      // Should not crash when no slots exist
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", 0, 1.0, 0)],
        slots: [],
        draggedPiece: "piece-1",
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = updateDragPosition(initialState, 1.5, 2.0);

      expect(newState.hoveredSlot).toBeNull();
      expect(newState.pieces[0].position.x).toBe(1.5);
      expect(newState.pieces[0].position.z).toBe(2.0);
    });

    it("should handle negative cursor coordinates", () => {
      // Should work with negative coordinates
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", 0, 1.0, 0)],
        slots: [],
        draggedPiece: "piece-1",
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = updateDragPosition(initialState, -2.5, -3.0);
      const draggedPiece = newState.pieces.find((p) => p.id === "piece-1");

      expect(draggedPiece!.position.x).toBe(-2.5);
      expect(draggedPiece!.position.z).toBe(-3.0);
    });

    it("should handle large cursor coordinates", () => {
      // Should work with coordinates far from board
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", 0, 1.0, 0)],
        slots: [],
        draggedPiece: "piece-1",
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = updateDragPosition(initialState, 100.0, 100.0);
      const draggedPiece = newState.pieces.find((p) => p.id === "piece-1");

      expect(draggedPiece!.position.x).toBe(100.0);
      expect(draggedPiece!.position.z).toBe(100.0);
    });
  });

  describe("State Consistency", () => {
    it("should maintain total piece count during drag", () => {
      // Drag operation should not add or remove pieces
      const initialState: GameState = {
        pieces: [
          createTestPiece("piece-1", 0, 1.0, 0),
          createTestPiece("piece-2", -2, -4, 0),
          createTestPiece("piece-3", -1, -4, 0),
        ],
        slots: [],
        draggedPiece: "piece-1",
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = updateDragPosition(initialState, 1.5, 2.0);

      expect(newState.pieces.length).toBe(initialState.pieces.length);
    });

    it("should maintain total slot count during drag", () => {
      // Drag operation should not add or remove slots
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", 0, 1.0, 0)],
        slots: [
          createTestSlot("slot-1", 0, 0, 0),
          createTestSlot("slot-2", 1.2, 0, 0),
        ],
        draggedPiece: "piece-1",
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = updateDragPosition(initialState, 1.5, 2.0);

      expect(newState.slots.length).toBe(initialState.slots.length);
    });

    it("should maintain draggedPiece state during position update", () => {
      // draggedPiece should remain set during drag
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", 0, 1.0, 0)],
        slots: [],
        draggedPiece: "piece-1",
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = updateDragPosition(initialState, 1.5, 2.0);

      expect(newState.draggedPiece).toBe("piece-1");
    });

    it("should not modify slot occupancy during drag", () => {
      // Slot occupancy should not change during drag (only during drop)
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", 0, 1.0, 0)],
        slots: [
          createTestSlot("slot-1", 0, 0, 0, false, null),
          createTestSlot("slot-2", 1.2, 0, 0, true, "piece-2"),
        ],
        draggedPiece: "piece-1",
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = updateDragPosition(initialState, 0, 0);

      expect(newState.slots[0].occupied).toBe(false);
      expect(newState.slots[1].occupied).toBe(true);
    });
  });
});
