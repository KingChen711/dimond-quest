# Diamond Quest Components

This directory contains the React Three Fiber components for the Diamond Quest game.

## GameBoard Component

**Status:** ✅ Complete (Task 3.1)

### Description

The GameBoard component renders the cross-shaped game board at the center of the 3D scene. It serves as the base structure for the 13 slot positions where diamond pieces can be placed.

### Features

- **Cross-shaped geometry**: Composed of three box geometries (vertical arm + two horizontal arms)
- **Centered positioning**: Located at scene origin (0, 0, 0)
- **Dark gray material**: Uses #2a2a2a color with metallic finish
- **Shadow support**: Receives and casts shadows for depth perception

### Technical Details

- **Dimensions**:
  - Vertical arm: 1.44 x 0.2 x 6.6 units
  - Horizontal arms: 5.04 x 0.2 x 1.44 units
  - Board thickness: 0.2 units
  - Slot spacing: 1.2 units

- **Material Properties**:
  - Color: #2a2a2a (dark gray)
  - Metalness: 0.3
  - Roughness: 0.7

### Validation

- ✅ Requirements 1.1: Cross-shaped structure with 13 slots
- ✅ Requirements 1.2: Positioned at scene center
- ✅ Requirements 1.4: Fixed position during gameplay
- ✅ All unit tests passing (8/8)

### Usage

```tsx
import {GameBoard} from "./components/GameBoard";

<Canvas>
  <GameBoard />
</Canvas>;
```

### Tests

See `GameBoard.test.tsx` for comprehensive unit tests covering:

- Positioning at scene center
- Material properties (color, metalness, roughness)
- Cross-shaped geometry dimensions
- Slot accommodation (13 slots with 1.2 unit spacing)
- Shadow properties
- Box geometry creation
- Horizontal arm positioning

---

## BoardSlot Component

**Status:** ✅ Complete (Task 3.2)

### Description

The BoardSlot component renders an individual slot on the game board where diamond pieces can be placed. Each slot is a circular indentation with visual indicators for empty/occupied states and hover feedback.

### Features

- **Circular indentation**: Cylinder geometry with radius 0.5 and depth 0.1 units
- **Visual indicators**: Darker color for empty slots to show availability
- **Hover feedback**: Green glow for valid drops, red glow for invalid/occupied slots
- **Shadow support**: Receives shadows for depth perception

### Technical Details

- **Geometry**:
  - Shape: Cylinder (circular)
  - Radius: 0.5 units
  - Depth: 0.1 units
  - Segments: 32 (smooth circular appearance)

- **Material Properties**:
  - Base color: #1a1a1a (darker than board)
  - Metalness: 0.2
  - Roughness: 0.8
  - Emissive (hover): #00ff00 (valid) or #ff0000 (invalid)
  - Emissive intensity: 0.5 (when hovered)

- **Positioning**:
  - Positioned at slot.position coordinates
  - Y-offset: -depth/2 (indented into board surface)

### Props

```typescript
interface BoardSlotProps {
  slot: BoardSlot; // The slot data including position and occupancy state
  isHovered?: boolean; // Whether this slot is currently being hovered during a drag operation
  isValidDrop?: boolean; // Whether the hover is valid (slot is empty) or invalid (slot is occupied)
}
```

### Validation

- ✅ Requirements 1.3: Visual indicators for each slot
- ✅ Requirements 1.5: Display empty slots as available for placement
- ✅ All unit tests passing (10/10)

### Usage

```tsx
import {BoardSlot} from "./components/BoardSlot";
import {BoardSlot as BoardSlotType} from "./types";
import {Vector3} from "three";

const slot: BoardSlotType = {
  id: "slot-1",
  position: new Vector3(0, 0, 1.2),
  occupied: false,
  pieceId: null,
};

<Canvas>
  <BoardSlot slot={slot} isHovered={false} isValidDrop={true} />
</Canvas>;
```

### Tests

See `BoardSlot.test.tsx` for comprehensive unit tests covering:

- Circular geometry dimensions (radius 0.5, depth 0.1)
- Depth offset positioning
- Color contrast with board
- Green emissive for valid drop hover
- Red emissive for invalid drop hover
- No emissive when not hovered
- Cross pattern positioning with 1.2 unit spacing
- Occupied and empty slot states
- Material properties
- Shadow receiving

---

## DiamondPiece Component

**Status:** ✅ Complete (Task 4.1)

### Description

The DiamondPiece component renders a colored gem-shaped game piece that can be placed on the board. Each piece has a distinct color and shape (round, triangular, or square) using octahedron base geometry.

### Features

- **Octahedron geometry**: 8-faced diamond shape for gem-like appearance
- **Three shape variants**: Round, triangular, and square cross-sections
- **Five color options**: Orange, yellow, green, blue, and red
- **Visual feedback states**: Normal, hovered, and dragged states with scale and emissive changes
- **Shadow support**: Casts and receives shadows for depth perception
- **Interactive**: Click handler for drag initiation

### Technical Details

- **Geometry**:
  - Base shape: Octahedron (8 triangular faces)
  - Base scale: 0.4 units
  - Detail level: 0 (simple geometry)

- **Shape Variants**:
  - Round: Standard octahedron orientation [0, 0, 0]
  - Triangular: Rotated π/6 radians (30°) around Y-axis [0, π/6, 0]
  - Square: Rotated π/4 radians (45°) around Y-axis [0, π/4, 0]

- **Visual States**:
  - Normal: Scale 0.4, emissive intensity 0
  - Hovered: Scale 0.44 (1.1x), emissive intensity 0.2
  - Dragged: Scale 0.46 (1.15x), emissive intensity 0.3

- **Material Properties** (Current - MeshStandardMaterial):
  - Color: Piece color (orange, yellow, green, blue, red)
  - Emissive: Same as piece color
  - Emissive intensity: Varies by state
  - Note: Will be upgraded to MeshPhysicalMaterial in task 4.2

### Props

```typescript
interface DiamondPieceProps {
  piece: DiamondPiece; // The piece data including color, shape, and position
  isHovered?: boolean; // Whether this piece is currently being hovered
  isDragged?: boolean; // Whether this piece is currently being dragged
  onClick?: (pieceId: string) => void; // Click handler for drag initiation
}
```

### Validation

- ✅ Requirements 2.1: Render diamond pieces with gem-like appearance
- ✅ Requirements 2.7: Support three distinct shapes (round, triangular, square)
- ✅ All unit tests passing (28/28)

### Usage

```tsx
import {DiamondPiece} from "./components/DiamondPiece";
import {DiamondPiece as DiamondPieceType} from "./types";
import {Vector3} from "three";

const piece: DiamondPieceType = {
  id: "piece-orange-1",
  color: "orange",
  shape: "round",
  position: new Vector3(-3, -4, 0),
  slotId: null,
  stagingPosition: new Vector3(-3, -4, 0),
};

<Canvas>
  <DiamondPiece
    piece={piece}
    isHovered={false}
    isDragged={false}
    onClick={(id) => console.log("Clicked:", id)}
  />
</Canvas>;
```

### Tests

See `DiamondPiece.test.tsx` for comprehensive unit tests covering:

- Octahedron geometry with 8 faces (24 position attributes)
- Base scale of 0.4 units
- Hover scale of 1.1x (0.44 units)
- Drag scale of 1.15x (0.46 units)
- Round shape rotation [0, 0, 0]
- Triangular shape rotation [0, π/6, 0]
- Square shape rotation [0, π/4, 0]
- All three shape types supported
- All five color types supported (orange, yellow, green, blue, red)
- Emissive intensity states (0, 0.2, 0.3)
- Position handling (positive and negative coordinates)
- Staging position for reset functionality
- Shadow casting and receiving
- Correct piece distribution (3-3-3-3-1 by color)
- Shape distribution per color (one of each shape per color group)
- MeshStandardMaterial usage
- Color and emissive properties

### Piece Distribution

According to Requirements 2.2-2.6, the game has 13 pieces total:

- **Orange**: 3 pieces (round, triangular, square)
- **Yellow**: 3 pieces (round, triangular, square)
- **Green**: 3 pieces (round, triangular, square)
- **Blue**: 3 pieces (round, triangular, square)
- **Red**: 1 piece (round)

### Next Steps

Task 4.2 will upgrade the material to MeshPhysicalMaterial with:

- Transparency: 0.3 opacity
- Transmission: 0.8 (light passes through)
- Roughness: 0.1 (glossy surface)
- Metalness: 0.2
- Specific color hex values (#ff8c00, #ffd700, #32cd32, #1e90ff, #dc143c)
