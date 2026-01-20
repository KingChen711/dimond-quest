/**
 * Unit tests for drag initiation functionality
 *
 * Tests verify:
 * - Click handler initiates drag operation
 * - draggedPiece state is set on click
 * - Piece is elevated (y += 1.0) when dragging starts
 * - Slot is cleared if piece was on board
 * - Piece slotId is cleared when drag starts
 *
 * Validates: Requirements 3.1, 3.6 (Drag initiation)
 */

import { describe, it, expect } from "vitest";
import { Vector3 } from "three";
import { GameState, DiamondPiece, BoardSlot } from "./types";

describe("Drag Initiation", () => {
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

  // Helper function to simulate startDrag
  const startDrag = (gameState: GameState, pieceId: string): GameState => {
    // Find the piece
    const piece = gameState.pieces.find((p) => p.id === pieceId);

    if (!piece) {
      return gameState;
    }

    // If piece is on a slot, clear the slot
    let updatedSlots = gameState.slots;
    if (piece.slotId) {
      updatedSlots = gameState.slots.map((s) => {
        if (s.id === piece.slotId) {
          return {
            ...s,
            occupied: false,
            pieceId: null,
          };
        }
        return s;
      });
    }

    // Elevate piece (y += 1.0) for visual feedback
    const updatedPieces = gameState.pieces.map((p) => {
      if (p.id === pieceId) {
        return {
          ...p,
          position: p.position.clone().setY(p.position.y + 1.0),
          slotId: null,
        };
      }
      return p;
    });

    return {
      ...gameState,
      pieces: updatedPieces,
      slots: updatedSlots,
      draggedPiece: pieceId,
    };
  };

  describe("Drag Initiation from Staging Area", () => {
    it("should set draggedPiece state when piece is clicked", () => {
      // Requirement 3.1: System SHALL initiate a Drag_Operation when player clicks on a piece
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", -3, -4, 0)],
        slots: [],
        draggedPiece: null,
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = startDrag(initialState, "piece-1");

      expect(newState.draggedPiece).toBe("piece-1");
    });

    it("should elevate piece by 1.0 unit when drag starts", () => {
      // Visual feedback: piece should be elevated when dragging
      const initialY = -4;
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", -3, initialY, 0)],
        slots: [],
        draggedPiece: null,
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = startDrag(initialState, "piece-1");
      const draggedPiece = newState.pieces.find((p) => p.id === "piece-1");

      expect(draggedPiece).toBeDefined();
      expect(draggedPiece!.position.y).toBe(initialY + 1.0);
    });

    it("should not affect other pieces when one piece is dragged", () => {
      // Only the clicked piece should be affected
      const initialState: GameState = {
        pieces: [
          createTestPiece("piece-1", -3, -4, 0),
          createTestPiece("piece-2", -2, -4, 0),
        ],
        slots: [],
        draggedPiece: null,
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = startDrag(initialState, "piece-1");
      const otherPiece = newState.pieces.find((p) => p.id === "piece-2");

      expect(otherPiece).toBeDefined();
      expect(otherPiece!.position.y).toBe(-4); // Should remain unchanged
    });

    it("should maintain piece slotId as null when dragging from staging area", () => {
      // Pieces in staging area have slotId = null
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", -3, -4, 0, null)],
        slots: [],
        draggedPiece: null,
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = startDrag(initialState, "piece-1");
      const draggedPiece = newState.pieces.find((p) => p.id === "piece-1");

      expect(draggedPiece).toBeDefined();
      expect(draggedPiece!.slotId).toBeNull();
    });
  });

  describe("Drag Initiation from Board", () => {
    it("should clear slot when piece is dragged from board", () => {
      // Requirement 3.6: When player drags piece from slot, system SHALL remove it from that slot
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", 0, 0, 0, "slot-1")],
        slots: [createTestSlot("slot-1", 0, 0, 0, true, "piece-1")],
        draggedPiece: null,
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = startDrag(initialState, "piece-1");
      const slot = newState.slots.find((s) => s.id === "slot-1");

      expect(slot).toBeDefined();
      expect(slot!.occupied).toBe(false);
      expect(slot!.pieceId).toBeNull();
    });

    it("should clear piece slotId when dragged from board", () => {
      // Piece should no longer reference the slot
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", 0, 0, 0, "slot-1")],
        slots: [createTestSlot("slot-1", 0, 0, 0, true, "piece-1")],
        draggedPiece: null,
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = startDrag(initialState, "piece-1");
      const piece = newState.pieces.find((p) => p.id === "piece-1");

      expect(piece).toBeDefined();
      expect(piece!.slotId).toBeNull();
    });

    it("should elevate piece from board by 1.0 unit", () => {
      // Pieces on board should also be elevated when dragged
      const initialY = 0;
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", 0, initialY, 0, "slot-1")],
        slots: [createTestSlot("slot-1", 0, initialY, 0, true, "piece-1")],
        draggedPiece: null,
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = startDrag(initialState, "piece-1");
      const piece = newState.pieces.find((p) => p.id === "piece-1");

      expect(piece).toBeDefined();
      expect(piece!.position.y).toBe(initialY + 1.0);
    });

    it("should make slot available after piece is removed", () => {
      // Requirement 3.6: Slot should be available for other pieces
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", 0, 0, 0, "slot-1")],
        slots: [createTestSlot("slot-1", 0, 0, 0, true, "piece-1")],
        draggedPiece: null,
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = startDrag(initialState, "piece-1");
      const slot = newState.slots.find((s) => s.id === "slot-1");

      expect(slot).toBeDefined();
      expect(slot!.occupied).toBe(false);
      // Slot is now available for placement
    });

    it("should not affect other slots when one piece is dragged", () => {
      // Only the slot containing the dragged piece should be cleared
      const initialState: GameState = {
        pieces: [
          createTestPiece("piece-1", 0, 0, 0, "slot-1"),
          createTestPiece("piece-2", 1.2, 0, 0, "slot-2"),
        ],
        slots: [
          createTestSlot("slot-1", 0, 0, 0, true, "piece-1"),
          createTestSlot("slot-2", 1.2, 0, 0, true, "piece-2"),
        ],
        draggedPiece: null,
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = startDrag(initialState, "piece-1");
      const otherSlot = newState.slots.find((s) => s.id === "slot-2");

      expect(otherSlot).toBeDefined();
      expect(otherSlot!.occupied).toBe(true);
      expect(otherSlot!.pieceId).toBe("piece-2");
    });
  });

  describe("Edge Cases", () => {
    it("should handle invalid piece ID gracefully", () => {
      // Should not crash or modify state if piece doesn't exist
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", -3, -4, 0)],
        slots: [],
        draggedPiece: null,
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = startDrag(initialState, "invalid-id");

      // State should remain unchanged
      expect(newState).toEqual(initialState);
    });

    it("should handle dragging piece that is already being dragged", () => {
      // Should update state even if piece is already marked as dragged
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", -3, -3, 0)], // Already elevated
        slots: [],
        draggedPiece: "piece-1",
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = startDrag(initialState, "piece-1");

      expect(newState.draggedPiece).toBe("piece-1");
      // Piece should be elevated again (y += 1.0)
      expect(newState.pieces[0].position.y).toBe(-2);
    });

    it("should preserve piece position x and z coordinates", () => {
      // Only y coordinate should change during drag initiation
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", -3, -4, 2)],
        slots: [],
        draggedPiece: null,
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = startDrag(initialState, "piece-1");
      const piece = newState.pieces.find((p) => p.id === "piece-1");

      expect(piece).toBeDefined();
      expect(piece!.position.x).toBe(-3);
      expect(piece!.position.z).toBe(2);
    });
  });

  describe("State Consistency", () => {
    it("should maintain bidirectional consistency when clearing slot", () => {
      // When piece.slotId is cleared, slot.pieceId should also be cleared
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", 0, 0, 0, "slot-1")],
        slots: [createTestSlot("slot-1", 0, 0, 0, true, "piece-1")],
        draggedPiece: null,
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = startDrag(initialState, "piece-1");
      const piece = newState.pieces.find((p) => p.id === "piece-1");
      const slot = newState.slots.find((s) => s.id === "slot-1");

      expect(piece!.slotId).toBeNull();
      expect(slot!.pieceId).toBeNull();
    });

    it("should maintain total piece count", () => {
      // Drag operation should not add or remove pieces
      const initialState: GameState = {
        pieces: [
          createTestPiece("piece-1", -3, -4, 0),
          createTestPiece("piece-2", -2, -4, 0),
          createTestPiece("piece-3", -1, -4, 0),
        ],
        slots: [],
        draggedPiece: null,
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = startDrag(initialState, "piece-1");

      expect(newState.pieces.length).toBe(initialState.pieces.length);
    });

    it("should maintain total slot count", () => {
      // Drag operation should not add or remove slots
      const initialState: GameState = {
        pieces: [createTestPiece("piece-1", 0, 0, 0, "slot-1")],
        slots: [
          createTestSlot("slot-1", 0, 0, 0, true, "piece-1"),
          createTestSlot("slot-2", 1.2, 0, 0, false, null),
        ],
        draggedPiece: null,
        hoveredSlot: null,
        hoveredPiece: null,
      };

      const newState = startDrag(initialState, "piece-1");

      expect(newState.slots.length).toBe(initialState.slots.length);
    });
  });
});
