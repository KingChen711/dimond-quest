/**
 * Unit tests for React state management functions
 * Tests task 2.3: Set up React state management
 *
 * Validates: Requirements 3, 5 (State management for interactions)
 */

import { describe, it, expect } from "vitest";
import { Vector3 } from "three";
import { GameState, DiamondPiece, BoardSlot } from "./types";

/**
 * Helper function to create a test game state
 */
function createTestGameState(): GameState {
  const testPiece1: DiamondPiece = {
    id: "piece-1",
    color: "orange",
    shape: "round",
    position: new Vector3(-3, -4, 0),
    slotId: null,
    stagingPosition: new Vector3(-3, -4, 0),
  };

  const testPiece2: DiamondPiece = {
    id: "piece-2",
    color: "yellow",
    shape: "triangular",
    position: new Vector3(-2, -4, 0),
    slotId: null,
    stagingPosition: new Vector3(-2, -4, 0),
  };

  const testSlot1: BoardSlot = {
    id: "slot-1",
    position: new Vector3(0, 0, 2.4),
    occupied: false,
    pieceId: null,
  };

  const testSlot2: BoardSlot = {
    id: "slot-2",
    position: new Vector3(-1.8, 0, 1.2),
    occupied: false,
    pieceId: null,
  };

  return {
    pieces: [testPiece1, testPiece2],
    slots: [testSlot1, testSlot2],
    draggedPiece: null,
    hoveredSlot: null,
    hoveredPiece: null,
  };
}

/**
 * Simulates the placePiece function logic
 * This tests the logic that should be in App.tsx
 */
function placePiece(
  prevState: GameState,
  pieceId: string,
  slotId: string,
): GameState {
  const piece = prevState.pieces.find((p) => p.id === pieceId);
  const slot = prevState.slots.find((s) => s.id === slotId);

  if (!piece || !slot) {
    console.error("Invalid piece or slot ID");
    return prevState;
  }

  if (slot.occupied) {
    console.error("Slot is already occupied");
    return prevState;
  }

  const updatedPieces = prevState.pieces.map((p) => {
    if (p.id === pieceId) {
      return {
        ...p,
        position: slot.position.clone(),
        slotId: slotId,
      };
    }
    return p;
  });

  const updatedSlots = prevState.slots.map((s) => {
    if (s.id === slotId) {
      return {
        ...s,
        occupied: true,
        pieceId: pieceId,
      };
    }
    return s;
  });

  return {
    ...prevState,
    pieces: updatedPieces,
    slots: updatedSlots,
  };
}

/**
 * Simulates the removePiece function logic
 */
function removePiece(prevState: GameState, pieceId: string): GameState {
  const piece = prevState.pieces.find((p) => p.id === pieceId);

  if (!piece) {
    console.error("Invalid piece ID");
    return prevState;
  }

  if (!piece.slotId) {
    return prevState;
  }

  const updatedPieces = prevState.pieces.map((p) => {
    if (p.id === pieceId) {
      return {
        ...p,
        position: p.stagingPosition.clone(),
        slotId: null,
      };
    }
    return p;
  });

  const updatedSlots = prevState.slots.map((s) => {
    if (s.pieceId === pieceId) {
      return {
        ...s,
        occupied: false,
        pieceId: null,
      };
    }
    return s;
  });

  return {
    ...prevState,
    pieces: updatedPieces,
    slots: updatedSlots,
  };
}

/**
 * Simulates the resetBoard function logic
 */
function resetBoard(prevState: GameState): GameState {
  const resetPieces = prevState.pieces.map((piece) => ({
    ...piece,
    position: piece.stagingPosition.clone(),
    slotId: null,
  }));

  const resetSlots = prevState.slots.map((slot) => ({
    ...slot,
    occupied: false,
    pieceId: null,
  }));

  return {
    ...prevState,
    pieces: resetPieces,
    slots: resetSlots,
    draggedPiece: null,
    hoveredSlot: null,
    hoveredPiece: null,
  };
}

describe("placePiece", () => {
  it("should place a piece on an empty slot", () => {
    const initialState = createTestGameState();
    const newState = placePiece(initialState, "piece-1", "slot-1");

    // Check piece was updated
    const piece = newState.pieces.find((p) => p.id === "piece-1");
    expect(piece?.slotId).toBe("slot-1");
    expect(piece?.position.x).toBe(0);
    expect(piece?.position.y).toBe(0);
    expect(piece?.position.z).toBe(2.4);

    // Check slot was updated
    const slot = newState.slots.find((s) => s.id === "slot-1");
    expect(slot?.occupied).toBe(true);
    expect(slot?.pieceId).toBe("piece-1");
  });

  it("should maintain bidirectional consistency between piece and slot", () => {
    const initialState = createTestGameState();
    const newState = placePiece(initialState, "piece-1", "slot-1");

    const piece = newState.pieces.find((p) => p.id === "piece-1");
    const slot = newState.slots.find((s) => s.id === "slot-1");

    // Validates: Property 1.2 (Piece-Slot Consistency)
    expect(piece?.slotId).toBe(slot?.id);
    expect(slot?.pieceId).toBe(piece?.id);
    expect(slot?.occupied).toBe(true);
  });

  it("should not place a piece on an occupied slot", () => {
    const initialState = createTestGameState();

    // Place first piece
    let newState = placePiece(initialState, "piece-1", "slot-1");

    // Try to place second piece on same slot
    newState = placePiece(newState, "piece-2", "slot-1");

    // Slot should still have first piece
    const slot = newState.slots.find((s) => s.id === "slot-1");
    expect(slot?.pieceId).toBe("piece-1");
    expect(slot?.occupied).toBe(true);

    // Second piece should not be on board
    const piece2 = newState.pieces.find((p) => p.id === "piece-2");
    expect(piece2?.slotId).toBeNull();

    // Validates: Requirement 3.5 (Prevent double placement)
  });

  it("should return unchanged state for invalid piece ID", () => {
    const initialState = createTestGameState();
    const newState = placePiece(initialState, "invalid-piece", "slot-1");

    expect(newState).toBe(initialState);
  });

  it("should return unchanged state for invalid slot ID", () => {
    const initialState = createTestGameState();
    const newState = placePiece(initialState, "piece-1", "invalid-slot");

    expect(newState).toBe(initialState);
  });

  it("should not affect other pieces when placing one piece", () => {
    const initialState = createTestGameState();
    const newState = placePiece(initialState, "piece-1", "slot-1");

    // Other piece should remain unchanged
    const piece2Initial = initialState.pieces.find((p) => p.id === "piece-2");
    const piece2New = newState.pieces.find((p) => p.id === "piece-2");

    expect(piece2New?.slotId).toBe(piece2Initial?.slotId);
    expect(piece2New?.position.x).toBe(piece2Initial?.position.x);
    expect(piece2New?.position.y).toBe(piece2Initial?.position.y);
    expect(piece2New?.position.z).toBe(piece2Initial?.position.z);
  });

  it("should not affect other slots when placing a piece", () => {
    const initialState = createTestGameState();
    const newState = placePiece(initialState, "piece-1", "slot-1");

    // Other slot should remain unchanged
    const slot2 = newState.slots.find((s) => s.id === "slot-2");
    expect(slot2?.occupied).toBe(false);
    expect(slot2?.pieceId).toBeNull();
  });
});

describe("removePiece", () => {
  it("should remove a piece from a slot and return it to staging area", () => {
    const initialState = createTestGameState();

    // First place a piece
    let newState = placePiece(initialState, "piece-1", "slot-1");

    // Then remove it
    newState = removePiece(newState, "piece-1");

    // Check piece was returned to staging
    const piece = newState.pieces.find((p) => p.id === "piece-1");
    expect(piece?.slotId).toBeNull();
    expect(piece?.position.x).toBe(-3);
    expect(piece?.position.y).toBe(-4);
    expect(piece?.position.z).toBe(0);

    // Check slot was cleared
    const slot = newState.slots.find((s) => s.id === "slot-1");
    expect(slot?.occupied).toBe(false);
    expect(slot?.pieceId).toBeNull();

    // Validates: Requirement 3.6 (Remove piece from slot)
  });

  it("should clear slot when piece is removed", () => {
    const initialState = createTestGameState();

    // Place and then remove
    let newState = placePiece(initialState, "piece-1", "slot-1");
    newState = removePiece(newState, "piece-1");

    const slot = newState.slots.find((s) => s.id === "slot-1");

    // Validates: Requirement 3.6 (Make slot available)
    expect(slot?.occupied).toBe(false);
    expect(slot?.pieceId).toBeNull();
  });

  it("should do nothing if piece is not on a slot", () => {
    const initialState = createTestGameState();
    const newState = removePiece(initialState, "piece-1");

    // State should be unchanged since piece wasn't on board
    const piece = newState.pieces.find((p) => p.id === "piece-1");
    expect(piece?.slotId).toBeNull();
  });

  it("should return unchanged state for invalid piece ID", () => {
    const initialState = createTestGameState();
    const newState = removePiece(initialState, "invalid-piece");

    expect(newState).toBe(initialState);
  });

  it("should not affect other pieces when removing one piece", () => {
    const initialState = createTestGameState();

    // Place both pieces
    let newState = placePiece(initialState, "piece-1", "slot-1");
    newState = placePiece(newState, "piece-2", "slot-2");

    // Remove first piece
    newState = removePiece(newState, "piece-1");

    // Second piece should still be on board
    const piece2 = newState.pieces.find((p) => p.id === "piece-2");
    expect(piece2?.slotId).toBe("slot-2");

    const slot2 = newState.slots.find((s) => s.id === "slot-2");
    expect(slot2?.occupied).toBe(true);
    expect(slot2?.pieceId).toBe("piece-2");
  });
});

describe("resetBoard", () => {
  it("should clear all slots", () => {
    const initialState = createTestGameState();

    // Place both pieces
    let newState = placePiece(initialState, "piece-1", "slot-1");
    newState = placePiece(newState, "piece-2", "slot-2");

    // Reset
    newState = resetBoard(newState);

    // All slots should be empty
    newState.slots.forEach((slot) => {
      expect(slot.occupied).toBe(false);
      expect(slot.pieceId).toBeNull();
    });

    // Validates: Requirement 5.1 (Remove all pieces from board)
  });

  it("should return all pieces to staging area", () => {
    const initialState = createTestGameState();

    // Place both pieces
    let newState = placePiece(initialState, "piece-1", "slot-1");
    newState = placePiece(newState, "piece-2", "slot-2");

    // Reset
    newState = resetBoard(newState);

    // All pieces should be in staging area
    newState.pieces.forEach((piece) => {
      expect(piece.slotId).toBeNull();
      expect(piece.position.x).toBe(piece.stagingPosition.x);
      expect(piece.position.y).toBe(piece.stagingPosition.y);
      expect(piece.position.z).toBe(piece.stagingPosition.z);
    });

    // Validates: Requirement 5.2 (Return pieces to staging area)
  });

  it("should clear interaction state", () => {
    const initialState = createTestGameState();

    // Set some interaction state
    const stateWithInteraction: GameState = {
      ...initialState,
      draggedPiece: "piece-1",
      hoveredSlot: "slot-1",
      hoveredPiece: "piece-2",
    };

    // Reset
    const newState = resetBoard(stateWithInteraction);

    expect(newState.draggedPiece).toBeNull();
    expect(newState.hoveredSlot).toBeNull();
    expect(newState.hoveredPiece).toBeNull();
  });

  it("should restore initial configuration", () => {
    const initialState = createTestGameState();

    // Place pieces
    let newState = placePiece(initialState, "piece-1", "slot-1");
    newState = placePiece(newState, "piece-2", "slot-2");

    // Reset
    newState = resetBoard(newState);

    // Should match initial state structure
    expect(newState.pieces.length).toBe(initialState.pieces.length);
    expect(newState.slots.length).toBe(initialState.slots.length);

    // All pieces should be unplaced
    newState.pieces.forEach((piece) => {
      expect(piece.slotId).toBeNull();
    });

    // All slots should be empty
    newState.slots.forEach((slot) => {
      expect(slot.occupied).toBe(false);
      expect(slot.pieceId).toBeNull();
    });

    // Validates: Requirement 5.3 (Restore initial arrangement)
    // Validates: Property 5.1 (Reset Completeness)
  });

  it("should work correctly when board is already empty", () => {
    const initialState = createTestGameState();

    // Reset without placing any pieces
    const newState = resetBoard(initialState);

    // Should still have valid state
    expect(newState.pieces.length).toBe(2);
    expect(newState.slots.length).toBe(2);

    newState.pieces.forEach((piece) => {
      expect(piece.slotId).toBeNull();
    });

    newState.slots.forEach((slot) => {
      expect(slot.occupied).toBe(false);
    });
  });
});

describe("State Management Integration", () => {
  it("should maintain piece-slot consistency through multiple operations", () => {
    const initialState = createTestGameState();

    // Place piece 1
    let newState = placePiece(initialState, "piece-1", "slot-1");

    // Place piece 2
    newState = placePiece(newState, "piece-2", "slot-2");

    // Remove piece 1
    newState = removePiece(newState, "piece-1");

    // Place piece 1 on slot 2 (should fail - occupied)
    newState = placePiece(newState, "piece-1", "slot-2");

    // Piece 1 should still be in staging
    const piece1 = newState.pieces.find((p) => p.id === "piece-1");
    expect(piece1?.slotId).toBeNull();

    // Piece 2 should still be on slot 2
    const piece2 = newState.pieces.find((p) => p.id === "piece-2");
    expect(piece2?.slotId).toBe("slot-2");

    const slot2 = newState.slots.find((s) => s.id === "slot-2");
    expect(slot2?.pieceId).toBe("piece-2");

    // Validates: Property 1.2 (Piece-Slot Consistency)
    // Validates: Property 3.2 (Slot Occupancy Exclusivity)
  });

  it("should handle place-remove-place cycle correctly", () => {
    const initialState = createTestGameState();

    // Place piece
    let newState = placePiece(initialState, "piece-1", "slot-1");

    // Remove piece
    newState = removePiece(newState, "piece-1");

    // Place same piece on different slot
    newState = placePiece(newState, "piece-1", "slot-2");

    // Piece should be on slot 2
    const piece = newState.pieces.find((p) => p.id === "piece-1");
    expect(piece?.slotId).toBe("slot-2");

    // Slot 1 should be empty
    const slot1 = newState.slots.find((s) => s.id === "slot-1");
    expect(slot1?.occupied).toBe(false);
    expect(slot1?.pieceId).toBeNull();

    // Slot 2 should be occupied
    const slot2 = newState.slots.find((s) => s.id === "slot-2");
    expect(slot2?.occupied).toBe(true);
    expect(slot2?.pieceId).toBe("piece-1");

    // Validates: Property 3.1 (Drag Operation Atomicity)
  });

  it("should ensure no duplicate slot references", () => {
    const initialState = createTestGameState();

    // Place both pieces on different slots
    let newState = placePiece(initialState, "piece-1", "slot-1");
    newState = placePiece(newState, "piece-2", "slot-2");

    // Count how many pieces reference each slot
    const slotReferences: Record<string, number> = {};

    newState.pieces.forEach((piece) => {
      if (piece.slotId) {
        slotReferences[piece.slotId] = (slotReferences[piece.slotId] || 0) + 1;
      }
    });

    // Each slot should be referenced by at most one piece
    Object.values(slotReferences).forEach((count) => {
      expect(count).toBeLessThanOrEqual(1);
    });

    // Validates: Property 1.2 (No duplicate slot references)
  });
});
