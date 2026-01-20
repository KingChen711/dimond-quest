# Design Document: Diamond Quest Game

## 1. Overview

Diamond Quest is a 3D web-based implementation of the Smart Games packing puzzle. The application provides an interactive environment where players manipulate colored diamond-shaped pieces on a cross-shaped board with 13 slots. The design focuses on intuitive drag-and-drop mechanics, appealing 3D visuals, and seamless integration with external PDF puzzle references.

### Design Philosophy

The system prioritizes tactile interaction over automated validation, allowing players to freely experiment with piece arrangements while referencing external puzzle challenges. This approach maintains the physical puzzle's exploratory nature while leveraging 3D visualization capabilities.

## 2. Technology Stack

### Core Technologies

- **Three.js**: 3D rendering engine for scene management, geometry, materials, and lighting
- **React**: UI framework for component structure and state management
- **React Three Fiber**: React renderer for Three.js, providing declarative 3D scene composition
- **React Three Drei**: Helper library for common Three.js patterns (camera controls, HTML overlays)
- **TypeScript**: Type-safe development environment

### Rationale

Three.js provides robust 3D capabilities with excellent browser support. React Three Fiber enables component-based 3D development with React's state management, simplifying drag-and-drop logic and piece positioning. TypeScript ensures type safety for complex 3D coordinate transformations and game state management.

## 3. Architecture

### Component Hierarchy

```
App
├── Scene (Canvas)
│   ├── Lighting
│   ├── Camera
│   ├── GameBoard
│   │   └── Slot[13]
│   ├── StagingArea
│   │   └── DiamondPiece[13]
│   └── CameraControls
└── UI
    ├── ResetButton
    └── PDFReferenceButton
```

### State Management

**Global Game State** (React Context or useState at App level):

- `pieces`: Array of 13 piece objects with properties:
  - `id`: Unique identifier
  - `color`: 'orange' | 'yellow' | 'green' | 'blue' | 'red'
  - `shape`: 'round' | 'triangular' | 'square'
  - `position`: { x, y, z } coordinates
  - `slotId`: null | slot identifier (null when in staging area)
- `slots`: Array of 13 slot objects with properties:
  - `id`: Unique identifier
  - `position`: { x, y, z } coordinates
  - `occupied`: boolean
  - `pieceId`: null | piece identifier

**Interaction State**:

- `draggedPiece`: Currently dragged piece ID or null
- `hoveredSlot`: Currently hovered slot ID or null
- `hoveredPiece`: Currently hovered piece ID or null

### Design Decision: State Structure

Separating piece and slot state enables independent updates and simplifies collision detection. Tracking relationships bidirectionally (piece.slotId and slot.pieceId) ensures consistency during drag operations.

## 4. 3D Scene Design

### Coordinate System

- Origin (0, 0, 0) at Game Board center
- Y-axis: vertical (up)
- X-axis: horizontal (right)
- Z-axis: depth (toward camera)

### Game Board Layout

**Cross-shaped configuration** (13 slots):

```
    [1]
[2][3][4][5]
    [6]
[7][8][9][10]
    [11]
[12][13]
```

**Slot Positioning**:

- Slot spacing: 1.2 units between centers
- Board dimensions: ~4.8 x 6.0 units
- Slot geometry: Circular indentations (radius 0.5 units, depth 0.1 units)
- Material: Dark gray (#2a2a2a) with subtle metallic finish

### Design Decision: Cross Layout

The cross shape is implemented using absolute positioning for each slot rather than a grid system. This provides precise control over the distinctive diamond pattern and simplifies slot identification during raycasting.

### Diamond Piece Design

**Geometry**:

- Base shape: Octahedron (8-faced diamond) scaled and modified per shape type
  - Round: Standard octahedron (scale: 0.4 units)
  - Triangular: Octahedron with triangular cross-section (scale: 0.4 units, rotated)
  - Square: Octahedron with square cross-section (scale: 0.4 units)

**Materials** (MeshPhysicalMaterial):

- Transparency: 0.3 opacity
- Transmission: 0.8 (light passes through)
- Roughness: 0.1 (glossy surface)
- Metalness: 0.2
- Color mapping:
  - Orange: #ff8c00
  - Yellow: #ffd700
  - Green: #32cd32
  - Blue: #1e90ff
  - Red: #dc143c

### Design Decision: Physical Materials

MeshPhysicalMaterial with transmission creates authentic gem appearance. The translucency allows light to pass through pieces, creating depth and visual interest while maintaining color distinction.

### Staging Area

**Layout**:

- Position: Below and to the side of Game Board (offset: x: -3, y: -4, z: 0)
- Arrangement: 3 rows organized by color
  - Row 1: Orange pieces (3)
  - Row 2: Yellow pieces (3)
  - Row 3: Green pieces (3)
  - Row 4: Blue pieces (3)
  - Row 5: Red piece (1)
- Spacing: 1.0 units between pieces

### Lighting Configuration

**Ambient Light**:

- Intensity: 0.4
- Color: White (#ffffff)
- Purpose: Base illumination for all objects

**Directional Light** (Primary):

- Intensity: 0.8
- Position: (5, 10, 5)
- Target: Game Board center
- Cast shadows: true
- Purpose: Create depth and highlight piece translucency

**Point Light** (Accent):

- Intensity: 0.3
- Position: (-5, 5, -5)
- Purpose: Fill shadows and enhance gem sparkle

### Design Decision: Three-Point Lighting

The combination of ambient, directional, and point lights creates depth while ensuring all colors remain distinguishable. Shadow casting enhances spatial awareness during drag operations.

## 5. Interaction Design

### Drag and Drop Implementation

**Phase 1: Drag Initiation**

1. User clicks on Diamond Piece
2. Raycast detects piece intersection
3. Set `draggedPiece` state
4. If piece is on board, clear its slot (set slot.occupied = false, slot.pieceId = null)
5. Elevate piece (y += 1.0) for visual feedback
6. Attach piece to cursor position via raycasting onto invisible plane at board height

**Phase 2: Dragging**

1. On pointer move, raycast onto horizontal plane at board level
2. Update piece position to intersection point
3. Continuously raycast to detect slot hover
4. Update `hoveredSlot` state for visual feedback

**Phase 3: Drop**

1. User releases mouse button
2. If `hoveredSlot` exists and slot is unoccupied:
   - Snap piece to slot position
   - Update piece.slotId and slot.pieceId
   - Set slot.occupied = true
   - Animate piece settling (y position transition)
3. Else:
   - Return piece to original position (staging area or previous slot)
   - Animate return transition
4. Clear `draggedPiece` and `hoveredSlot` states

### Design Decision: Plane-Based Dragging

Raycasting onto a horizontal plane at board height keeps pieces at consistent elevation during drag, preventing depth ambiguity. This approach is more intuitive than 3D cursor tracking.

### Visual Feedback System

**Hover States**:

- Piece hover: Increase emissive intensity (0.2), scale up (1.1x)
- Slot hover (valid): Green outline glow (emissive green, intensity 0.5)
- Slot hover (invalid/occupied): Red outline glow (emissive red, intensity 0.5)

**Drag States**:

- Dragged piece: Elevated position, increased scale (1.15x), enhanced emissive
- Valid drop targets: Pulsing green glow animation
- Invalid drop targets: Dimmed appearance

**Placement Feedback**:

- Success: Brief scale pulse animation (1.0x → 1.2x → 1.0x over 0.3s)
- Failure: Shake animation (horizontal oscillation) + return to origin

### Design Decision: Multi-Modal Feedback

Combining position, scale, color, and animation provides clear feedback across different visual contexts. Emissive properties work well with translucent materials without obscuring piece colors.

## 6. Camera System

### Camera Configuration

**Initial Setup**:

- Type: PerspectiveCamera
- Position: (0, 8, 12)
- Look-at: (0, 0, 0) - Game Board center
- FOV: 50 degrees
- Near plane: 0.1
- Far plane: 1000

### Camera Controls

**Implementation**: OrbitControls from drei

- **Rotation**: Right mouse drag or two-finger drag (touch)
- **Zoom**: Mouse wheel or pinch gesture (touch)
- **Pan**: Disabled (maintains board-centric view)

**Constraints**:

- Min distance: 8 units (prevent clipping)
- Max distance: 25 units (maintain visibility)
- Max polar angle: 85 degrees (prevent upside-down view)
- Min polar angle: 15 degrees (prevent top-down flatness)
- Enable damping: true (smooth motion)
- Damping factor: 0.05

### Design Decision: Orbit Controls

OrbitControls provide intuitive 3D navigation familiar to users of 3D applications. Constraining polar angles ensures the board remains recognizable while allowing sufficient perspective variation for depth perception.

## 7. User Interface

### Reset Functionality

**UI Element**: Button positioned top-right of viewport

- Label: "Reset Board"
- Style: Semi-transparent overlay, solid on hover

**Behavior**:

1. Clear all slot occupancy (set all slot.occupied = false, slot.pieceId = null)
2. Reset all piece positions to staging area coordinates
3. Clear all piece.slotId values
4. Animate pieces returning to staging area (staggered timing for visual effect)

### PDF Reference Access

**UI Element**: Button positioned top-left of viewport

- Label: "View Puzzles & Solutions"
- Icon: PDF document icon

**Behavior**:

- On click: `window.open(pdfUrl, '_blank')`
- PDF URL: Configurable path to solution PDF (default: '/puzzles/diamond-quest-solutions.pdf')

### Design Decision: Minimal UI

Keeping UI elements minimal and semi-transparent maintains focus on the 3D scene. Positioning controls at screen edges prevents occlusion of the game board.

## 8. Responsive Design

### Viewport Adaptation

**Canvas Sizing**:

- Width: 100vw
- Height: 100vh
- Automatic resize handling via React Three Fiber

**Aspect Ratio Handling**:

- Camera aspect ratio updates on window resize
- Projection matrix recalculation maintains perspective

### Touch Support

**Touch Event Mapping**:

- Single touch: Equivalent to left mouse (drag pieces)
- Two-finger drag: Equivalent to right mouse (rotate camera)
- Pinch: Zoom camera

**Mobile Optimizations**:

- Larger hit areas for pieces (invisible bounding sphere, radius 0.6 units)
- Increased hover feedback duration (300ms delay before state change)
- Simplified shadows (lower resolution) for performance

### Design Decision: Progressive Enhancement

The application is designed desktop-first with touch support added progressively. Raycasting-based interaction naturally adapts to touch, requiring only event mapping adjustments.

## 9. Performance Considerations

### Optimization Strategies

**Geometry Instancing**:

- Reuse base geometries for pieces of same shape
- Three.js automatically batches identical geometries

**Material Sharing**:

- Create 5 material instances (one per color)
- Share materials across pieces of same color

**Render Optimization**:

- Static board geometry (no per-frame updates)
- Piece updates only during drag operations
- Shadow map size: 1024x1024 (balance quality/performance)

**Event Throttling**:

- Pointer move events throttled to 60fps
- Raycast calculations only when necessary (during drag or hover)

### Design Decision: Selective Updates

React Three Fiber's reconciliation ensures only changed objects re-render. Maintaining immutable state patterns and using React.memo for static components minimizes unnecessary calculations.

## 10. Data Models

### Piece Model

```typescript
interface DiamondPiece {
  id: string;
  color: "orange" | "yellow" | "green" | "blue" | "red";
  shape: "round" | "triangular" | "square";
  position: Vector3;
  slotId: string | null;
  stagingPosition: Vector3; // Original position for reset
}
```

### Slot Model

```typescript
interface BoardSlot {
  id: string;
  position: Vector3;
  occupied: boolean;
  pieceId: string | null;
}
```

### Game State Model

```typescript
interface GameState {
  pieces: DiamondPiece[];
  slots: BoardSlot[];
  draggedPiece: string | null;
  hoveredSlot: string | null;
  hoveredPiece: string | null;
}
```

## 11. Initial State Configuration

### Piece Distribution

**Color Distribution**:

- Orange: 3 pieces (shapes: round, triangular, square)
- Yellow: 3 pieces (shapes: round, triangular, square)
- Green: 3 pieces (shapes: round, triangular, square)
- Blue: 3 pieces (shapes: round, triangular, square)
- Red: 1 piece (shape: round)

**Initial Positions**:
All pieces start in staging area, arranged in color-grouped rows with consistent spacing.

### Board State

All 13 slots start empty (occupied: false, pieceId: null).

## 12. Testing Strategy

### Unit Tests

**Component Tests**:

- DiamondPiece: Rendering with correct geometry, material, and color
- BoardSlot: Position accuracy, occupancy state management
- GameBoard: Slot layout matches cross pattern
- StagingArea: Piece arrangement and spacing

**State Management Tests**:

- Piece placement updates both piece and slot state correctly
- Drag initiation clears slot when piece is removed
- Reset functionality returns all pieces to staging area
- Invalid drops restore previous state

### Integration Tests

**Interaction Tests**:

- Complete drag-and-drop cycle (pick, drag, drop)
- Slot occupancy prevents double placement
- Hover states update correctly during drag
- Camera controls don't interfere with piece interaction

**Visual Tests**:

- Lighting renders all colors distinctly
- Transparency effects display correctly
- Animations complete without visual artifacts
- Responsive layout maintains aspect ratio

### Property-Based Testing

Property-based tests will be defined to verify correctness properties across all possible game states and interactions.

## 13. Correctness Properties

### Property 1.1: Slot Uniqueness

**Validates: Requirements 1.1, 1.3**

For all game states, each slot SHALL have a unique position, and no two slots SHALL occupy the same coordinates.

**Test Strategy**: Generate random slot configurations and verify no position collisions exist.

### Property 1.2: Piece-Slot Consistency

**Validates: Requirements 3.3, 3.5, 3.6**

For all game states, if a piece occupies a slot, then:

- The slot SHALL be marked as occupied
- The slot's pieceId SHALL match the piece's id
- The piece's slotId SHALL match the slot's id
- No other piece SHALL reference that slot

**Test Strategy**: Generate random piece placements and verify bidirectional consistency.

### Property 1.3: Staging Area Invariant

**Validates: Requirements 10.2, 10.3**

For all game states, pieces not on the board SHALL be positioned in the staging area with valid coordinates.

**Test Strategy**: Generate random game states and verify all unplaced pieces have staging area positions.

### Property 2.1: Color Distribution

**Validates: Requirements 2.2, 2.3, 2.4, 2.5, 2.6**

For all game states, the system SHALL maintain exactly:

- 3 orange pieces
- 3 yellow pieces
- 3 green pieces
- 3 blue pieces
- 1 red piece

**Test Strategy**: Generate random game states and verify color counts remain constant.

### Property 2.2: Shape Distribution

**Validates: Requirement 2.7**

For all game states, the system SHALL maintain pieces with three distinct shape types, and each color group (except red) SHALL contain one piece of each shape.

**Test Strategy**: Generate random game states and verify shape distribution per color.

### Property 3.1: Drag Operation Atomicity

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.6**

For any drag operation, either:

- The piece successfully moves to a new valid location, OR
- The piece returns to its original position

No intermediate or invalid states SHALL persist after drag completion.

**Test Strategy**: Simulate drag operations with various outcomes and verify state consistency.

### Property 3.2: Slot Occupancy Exclusivity

**Validates: Requirement 3.5**

For all game states, if a slot is occupied, no drag operation SHALL place another piece in that slot.

**Test Strategy**: Attempt to place pieces in occupied slots and verify rejection.

### Property 4.1: Camera Bounds

**Validates: Requirements 4.4, 4.5**

For all camera states, the camera distance SHALL remain within [minDistance, maxDistance] and polar angle SHALL remain within [minPolarAngle, maxPolarAngle].

**Test Strategy**: Simulate camera movements and verify constraints are enforced.

### Property 5.1: Reset Completeness

**Validates: Requirements 5.1, 5.2, 5.3**

After reset operation, the game state SHALL match the initial state:

- All slots SHALL be unoccupied
- All pieces SHALL be in staging area
- Piece positions SHALL match initial staging positions

**Test Strategy**: Perform reset from various game states and verify return to initial configuration.

### Property 7.1: Visual Feedback Consistency

**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

For all interaction states:

- Hover state SHALL be set when pointer intersects object
- Drag state SHALL be set only when drag operation is active
- Feedback SHALL be cleared when interaction ends

**Test Strategy**: Simulate interaction sequences and verify feedback state transitions.

### Property 9.1: Responsive Viewport

**Validates: Requirements 9.1, 9.2**

For all viewport dimensions, the 3D scene SHALL:

- Fill the available viewport
- Maintain correct aspect ratio
- Keep the game board visible and centered

**Test Strategy**: Test with various viewport dimensions and verify scene adaptation.

## 14. Future Enhancements

Potential features outside current scope:

- Undo/redo functionality
- Save/load game state
- Puzzle validation against PDF solutions
- Hint system
- Multiple board themes
- Sound effects for interactions
- Multiplayer collaborative mode

## 15. Dependencies

### NPM Packages

```json
{
  "three": "^0.160.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.92.0",
  "typescript": "^5.3.0"
}
```

### External Resources

- Diamond Quest Solutions PDF (to be provided or created)
- Optional: Custom 3D models for enhanced piece geometry

## 16. Deployment Considerations

**Build Output**:

- Static site (HTML, JS, CSS bundles)
- Deployable to any static hosting (Vercel, Netlify, GitHub Pages)

**Browser Requirements**:

- WebGL 2.0 support
- Modern browser (Chrome 90+, Firefox 88+, Safari 15+, Edge 90+)

**Asset Loading**:

- PDF hosted in public directory
- No external API dependencies
- All 3D geometry generated programmatically (no model loading)

---

This design provides a complete blueprint for implementing the Diamond Quest game while maintaining flexibility for future enhancements and ensuring all requirements are addressed with clear technical decisions.
