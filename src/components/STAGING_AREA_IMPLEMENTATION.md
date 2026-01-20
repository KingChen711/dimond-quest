# StagingArea Component Implementation

## Overview

The StagingArea component has been successfully implemented as part of task 4.3. This component is responsible for rendering diamond pieces that are not currently placed on the game board.

## Component Location

- **File**: `src/components/StagingArea.tsx`
- **Tests**: `src/components/StagingArea.test.tsx`

## Implementation Details

### Component Structure

The StagingArea component is a React functional component that:

1. **Filters pieces** - Only displays pieces where `slotId === null` (not on the board)
2. **Renders pieces** - Uses the DiamondPiece component for each staged piece
3. **Manages visual feedback** - Passes hover and drag states to individual pieces
4. **Supports interaction** - Provides optional click handler for piece selection

### Props Interface

```typescript
interface StagingAreaProps {
  pieces: DiamondPieceType[]; // Array of all diamond pieces
  hoveredPiece: string | null; // ID of hovered piece
  draggedPiece: string | null; // ID of dragged piece
  onPieceClick?: (pieceId: string) => void; // Optional click handler
}
```

### Layout Configuration

As specified in the design document:

- **Position**: (x: -3, y: -4, z: 0) relative to board center
- **Arrangement**: 5 rows grouped by color
  - Row 0 (z=0): Orange pieces (3)
  - Row 1 (z=1): Yellow pieces (3)
  - Row 2 (z=2): Green pieces (3)
  - Row 3 (z=3): Blue pieces (3)
  - Row 4 (z=4): Red piece (1)
- **Spacing**: 1.0 units between pieces horizontally
- **Y-coordinate**: All pieces at y = -4

### Integration

The component has been integrated into `App.tsx`:

```typescript
<StagingArea
  pieces={gameState.pieces}
  hoveredPiece={gameState.hoveredPiece}
  draggedPiece={gameState.draggedPiece}
/>
```

## Testing

### Test Coverage

The test suite (`StagingArea.test.tsx`) includes 21 tests covering:

1. **Piece Filtering** (4 tests)
   - Filters pieces not on the board
   - Shows no pieces when all are on board
   - Shows all 13 pieces when none are on board
   - Handles empty pieces array

2. **Staging Area Layout** (9 tests)
   - Verifies correct position coordinates
   - Validates 1.0 unit spacing
   - Confirms 5-row color grouping
   - Tests row positioning for each color
   - Validates horizontal spacing within rows
   - Confirms y-coordinate consistency

3. **Visual Feedback** (4 tests)
   - Identifies hovered piece correctly
   - Identifies dragged piece correctly
   - Handles no hover state
   - Handles no drag state

4. **Integration with Game State** (2 tests)
   - Works with generateDiamondPieces function
   - Correctly identifies pieces after placement

### Running Tests

```bash
npm test StagingArea
```

## Requirements Validation

This implementation validates the following requirements:

- **Requirement 2.9**: Diamond pieces displayed in staging area when not on board
- **Requirement 10.2**: All 13 pieces displayed in staging area at game start
- **Requirement 10.3**: Pieces arranged in organized manner in staging area
- **Requirement 10.4**: Pieces grouped by color or shape for easy identification

## Design Decisions

### Filtering Logic

The component uses a simple filter to determine which pieces to display:

```typescript
const stagedPieces = pieces.filter((piece) => piece.slotId === null);
```

This approach:

- Is efficient (O(n) complexity)
- Is easy to understand and maintain
- Automatically updates when pieces are placed/removed from board
- Relies on the bidirectional piece-slot relationship

### Component Composition

The StagingArea uses the existing DiamondPiece component rather than reimplementing piece rendering. This:

- Promotes code reuse
- Ensures consistent piece appearance
- Simplifies maintenance
- Reduces potential for bugs

### Visual Feedback

The component passes hover and drag states to individual pieces, allowing the DiamondPiece component to handle visual feedback. This separation of concerns:

- Keeps the StagingArea component simple
- Centralizes visual feedback logic in DiamondPiece
- Makes it easier to modify feedback behavior

## Future Enhancements

Potential improvements for future iterations:

1. **Animation**: Add staggered animations when pieces return to staging area
2. **Sorting**: Allow players to reorganize pieces in staging area
3. **Highlighting**: Add visual indicators for pieces that can solve current puzzle
4. **Grouping**: Add visual separators between color groups
5. **Compact Mode**: Option to reduce spacing for smaller screens

## Notes

- The actual positioning of pieces is handled by the `generateDiamondPieces()` function in `gameStateUtils.ts`
- The component is purely presentational - it doesn't manage piece positions
- Piece positions are stored in the `stagingPosition` property of each piece
- The component automatically updates when the game state changes (React reactivity)
