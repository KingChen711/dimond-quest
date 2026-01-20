# TypeScript Interfaces for Diamond Quest Game

## Overview

This document describes the TypeScript interfaces defined for the Diamond Quest game, implementing task 2.1 from the specification.

## Files Created

### 1. `src/types.ts`

The main types file containing all core interfaces and type definitions:

#### Type Definitions

- **`PieceColor`**: Union type for piece colors
  - Values: `"orange" | "yellow" | "green" | "blue" | "red"`
  - Validates Requirements 2.2-2.6 (color distribution)

- **`PieceShape`**: Union type for piece shapes
  - Values: `"round" | "triangular" | "square"`
  - Validates Requirement 2.7 (three distinct shapes)

#### Interfaces

- **`DiamondPiece`**: Represents a colored gem-shaped game piece
  - `id: string` - Unique identifier
  - `color: PieceColor` - Piece color
  - `shape: PieceShape` - Piece shape
  - `position: Vector3` - Current 3D position
  - `slotId: string | null` - ID of occupied slot (null if in staging area)
  - `stagingPosition: Vector3` - Original position for reset functionality
  - Validates Requirement 2 (Diamond Piece Rendering)

- **`BoardSlot`**: Represents a position on the cross-shaped game board
  - `id: string` - Unique identifier
  - `position: Vector3` - 3D position on the board
  - `occupied: boolean` - Whether slot has a piece
  - `pieceId: string | null` - ID of piece in slot (null if empty)
  - Validates Requirement 1 (Game Board Rendering)

- **`GameState`**: Complete game state including pieces, slots, and interactions
  - `pieces: DiamondPiece[]` - All 13 diamond pieces
  - `slots: BoardSlot[]` - All 13 board slots
  - `draggedPiece: string | null` - Currently dragged piece ID
  - `hoveredSlot: string | null` - Currently hovered slot ID
  - `hoveredPiece: string | null` - Currently hovered piece ID
  - Validates Requirements 2, 3 (Data foundation for pieces and interactions)

### 2. `src/gameStateUtils.ts`

Utility functions demonstrating interface usage:

- `createPiece()` - Factory function for creating DiamondPiece objects
- `createSlot()` - Factory function for creating BoardSlot objects
- `createEmptyGameState()` - Creates initial empty game state
- `isValidPieceColor()` - Type guard for PieceColor validation
- `isValidPieceShape()` - Type guard for PieceShape validation

### 3. `src/exampleGameState.ts`

Example implementations demonstrating the interfaces:

- `examplePiece` - Single piece example
- `exampleSlot` - Single slot example
- `exampleGameState` - Basic game state with multiple pieces and slots
- `exampleGameStateWithPlacement` - Game state showing piece-slot relationship
- `exampleGameStateWithDrag` - Game state during drag operation

## Design Decisions

### 1. Bidirectional Relationships

The design maintains bidirectional references between pieces and slots:

- `DiamondPiece.slotId` references the slot
- `BoardSlot.pieceId` references the piece

This ensures consistency during drag operations and simplifies state updates.

### 2. Vector3 for Positions

Using Three.js `Vector3` type for positions provides:

- Type safety for 3D coordinates
- Compatibility with Three.js rendering
- Built-in vector math operations

### 3. Nullable References

Using `string | null` for references (slotId, pieceId, draggedPiece, etc.) clearly indicates:

- When a piece is in staging area (slotId = null)
- When a slot is empty (pieceId = null)
- When no interaction is active (draggedPiece = null)

### 4. Staging Position

Including `stagingPosition` in DiamondPiece enables:

- Easy reset functionality (Requirement 5)
- Preserving original layout
- Smooth animations back to staging area

## Validation

All interfaces have been validated:

✅ TypeScript compilation successful (no errors)
✅ ESLint passes with no warnings
✅ Build completes successfully
✅ Example implementations demonstrate correct usage
✅ All required properties from design document included

## Requirements Validated

- ✅ Requirement 2: Diamond Piece Rendering (DiamondPiece interface)
- ✅ Requirement 1: Game Board Rendering (BoardSlot interface)
- ✅ Requirement 3: Drag and Drop Interaction (GameState interface)
- ✅ Requirements 2.2-2.6: Color distribution (PieceColor type)
- ✅ Requirement 2.7: Shape types (PieceShape type)

## Next Steps

These interfaces will be used in subsequent tasks:

- Task 2.2: Implement initial game state configuration
- Task 2.3: Set up React state management
- Task 4.1-4.3: Diamond piece rendering components
- Task 6.1-6.5: Drag and drop interaction system
