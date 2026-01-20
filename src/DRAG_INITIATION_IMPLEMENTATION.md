# Drag Initiation Implementation

## Task 6.1: Implement drag initiation

**Status**: ✅ Completed

**Validates**: Requirements 3.1, 3.6 (Drag initiation)

## Implementation Summary

### 1. Added `startDrag` Function in App.tsx

The `startDrag` function handles the initiation of drag operations when a piece is clicked:

```typescript
const startDrag = (pieceId: string) => {
  setGameState((prevState) => {
    // Find the piece
    const piece = prevState.pieces.find((p) => p.id === pieceId);

    if (!piece) {
      console.error("Invalid piece ID");
      return prevState;
    }

    // If piece is on a slot, clear the slot (Requirement 3.6)
    let updatedSlots = prevState.slots;
    if (piece.slotId) {
      updatedSlots = prevState.slots.map((s) => {
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
    const updatedPieces = prevState.pieces.map((p) => {
      if (p.id === pieceId) {
        return {
          ...p,
          position: p.position.clone().setY(p.position.y + 1.0),
          slotId: null, // Clear slot reference when dragging starts
        };
      }
      return p;
    });

    return {
      ...prevState,
      pieces: updatedPieces,
      slots: updatedSlots,
      draggedPiece: pieceId,
    };
  });
};
```

### 2. Connected Click Handler to DiamondPiece Components

**In StagingArea**: Passed `onPieceClick={startDrag}` to render pieces in staging area with click handlers.

**In App.tsx**: Added a new group to render pieces on the board with click handlers:

```typescript
<group name="board-pieces">
  {gameState.pieces
    .filter((piece) => piece.slotId !== null)
    .map((piece) => (
      <DiamondPiece
        key={piece.id}
        piece={piece}
        isHovered={gameState.hoveredPiece === piece.id}
        isDragged={gameState.draggedPiece === piece.id}
        onClick={startDrag}
      />
    ))}
</group>
```

### 3. DiamondPiece Component Already Had Click Handler

The DiamondPiece component already had the necessary click handler implementation:

```typescript
const handleClick = (event: any) => {
  event.stopPropagation();
  if (onClick) {
    onClick(piece.id);
  }
};
```

And the mesh has the onClick prop:

```typescript
<mesh
  position={[piece.position.x, piece.position.y, piece.position.z]}
  rotation={getRotation()}
  scale={[scale, scale, scale]}
  onClick={handleClick}
  castShadow
  receiveShadow
>
```

## Key Features Implemented

### ✅ Click Handler

- DiamondPiece component has click handler that calls `onClick` prop
- Click events are properly stopped from propagating
- Works for both pieces in staging area and pieces on board

### ✅ Raycasting

- React Three Fiber handles raycasting automatically for mesh onClick events
- No manual raycasting implementation needed for click detection

### ✅ Set draggedPiece State

- `startDrag` function sets `gameState.draggedPiece` to the clicked piece ID
- State is properly managed through React's useState

### ✅ Elevate Piece (y += 1.0)

- When drag starts, piece position is updated with `y += 1.0`
- Provides visual feedback that piece is being dragged
- Uses Three.js Vector3 clone and setY methods

### ✅ Clear Slot if Piece Was on Board

- Checks if piece has a `slotId` (indicating it's on the board)
- If on board, clears the slot by setting:
  - `slot.occupied = false`
  - `slot.pieceId = null`
- Clears piece's `slotId` reference
- Maintains bidirectional consistency between piece and slot state

## Test Coverage

Created comprehensive unit tests in `src/dragInteraction.test.ts`:

### Test Suites (15 tests total):

1. **Drag Initiation from Staging Area** (4 tests)
   - Sets draggedPiece state on click
   - Elevates piece by 1.0 unit
   - Doesn't affect other pieces
   - Maintains slotId as null

2. **Drag Initiation from Board** (5 tests)
   - Clears slot when piece is dragged
   - Clears piece slotId
   - Elevates piece from board
   - Makes slot available
   - Doesn't affect other slots

3. **Edge Cases** (3 tests)
   - Handles invalid piece ID gracefully
   - Handles already-dragged pieces
   - Preserves x and z coordinates

4. **State Consistency** (3 tests)
   - Maintains bidirectional consistency
   - Maintains total piece count
   - Maintains total slot count

**All 15 tests passing** ✅

## Requirements Validated

### ✅ Requirement 3.1: Drag Operation Initiation

> WHEN a player clicks on a Diamond_Piece, THE System SHALL initiate a Drag_Operation

**Implementation**: Click handler on DiamondPiece component calls `startDrag` function, which sets `draggedPiece` state and elevates the piece.

### ✅ Requirement 3.6: Remove Piece from Slot

> WHEN a player drags a Diamond_Piece from a Slot, THE System SHALL remove it from that Slot and make the Slot available

**Implementation**: `startDrag` function checks if piece has a `slotId`, and if so, clears the slot by setting `occupied = false` and `pieceId = null`.

## Visual Feedback

The implementation provides visual feedback through:

1. **Piece Elevation**: Piece moves up by 1.0 unit when dragging starts
2. **Scale Changes**: DiamondPiece component already supports `isDragged` prop which scales piece to 1.15x
3. **Emissive Intensity**: Dragged pieces have enhanced emissive intensity (0.3)

## Next Steps

The following tasks build on this implementation:

- **Task 6.2**: Implement dragging behavior (move piece with cursor)
- **Task 6.3**: Implement drop logic (place piece on slot or return to origin)
- **Task 6.4**: Add visual feedback for interactions (hover states, slot highlighting)
- **Task 6.5**: Write integration tests for complete drag-and-drop cycle

## Files Modified

1. **src/App.tsx**
   - Added `startDrag` function
   - Connected click handler to StagingArea
   - Added group to render board pieces with click handlers
   - Imported DiamondPiece component

2. **src/dragInteraction.test.ts** (new file)
   - Created comprehensive unit tests for drag initiation
   - 15 tests covering all scenarios and edge cases

## Technical Notes

- React Three Fiber's built-in raycasting handles click detection automatically
- Three.js Vector3 methods (clone, setY) used for position manipulation
- State updates use immutable patterns (map, spread operators)
- Bidirectional state consistency maintained between pieces and slots
- Event propagation stopped to prevent camera controls from interfering
