# Diamond Quest Game - Implementation Tasks

## Phase 1: Project Setup and Foundation

### 1. Project Initialization

- [x] 1.1 Initialize React + TypeScript project with Vite
  - Create package.json with required dependencies (react, react-dom, three, @react-three/fiber, @react-three/drei, typescript)
  - Configure TypeScript with tsconfig.json
  - Set up Vite configuration for development
  - **Validates: Requirements 1-10 (Foundation for all features)**

- [x] 1.2 Create basic project structure
  - Create src/ directory with main.tsx and App.tsx
  - Create index.html entry point
  - Set up basic CSS for full viewport canvas
  - **Validates: Requirement 9 (Responsive Layout)**

- [x] 1.3 Set up Three.js scene with React Three Fiber
  - Create Canvas component with basic configuration
  - Add ambient and directional lighting
  - Verify scene renders correctly
  - **Validates: Requirement 8 (3D Scene Lighting)**

## Phase 2: Data Models and State Management

### 2. Core Data Structures

- [x] 2.1 Define TypeScript interfaces for game models
  - Create DiamondPiece interface (id, color, shape, position, slotId, stagingPosition)
  - Create BoardSlot interface (id, position, occupied, pieceId)
  - Create GameState interface (pieces, slots, draggedPiece, hoveredSlot, hoveredPiece)
  - **Validates: Requirements 2, 3 (Data foundation for pieces and interactions)**

- [x] 2.2 Implement initial game state configuration
  - Create function to generate 13 pieces with correct color/shape distribution
  - Create function to generate 13 board slots in cross pattern
  - Define staging area positions for pieces
  - **Validates: Requirements 2.2-2.6, 10.2-10.4 (Initial state setup)**

- [x] 2.3 Set up React state management
  - Create game state context or useState at App level
  - Implement state update functions (placePiece, removePiece, resetBoard)
  - **Validates: Requirements 3, 5 (State management for interactions)**

## Phase 3: Game Board Implementation

### 3. Board Rendering

- [x] 3.1 Create GameBoard component
  - Implement cross-shaped board geometry
  - Position board at scene center (0, 0, 0)
  - Apply dark gray material with metallic finish
  - **Validates: Requirements 1.1, 1.2, 1.4 (Board structure and positioning)**

- [x] 3.2 Create BoardSlot component
  - Implement circular indentation geometry (radius 0.5, depth 0.1)
  - Position 13 slots in cross pattern with 1.2 unit spacing
  - Add visual indicators for empty slots
  - **Validates: Requirements 1.3, 1.5 (Slot visualization)**

- [x] 3.3 Write unit tests for board layout
  - Test slot count equals 13
  - Test slot positions match cross pattern
  - Test slot spacing is correct
  - **Validates: Property 1.1 (Slot Uniqueness)**

## Phase 4: Diamond Piece Implementation

### 4. Piece Rendering

- [x] 4.1 Create DiamondPiece component
  - Implement octahedron base geometry
  - Create three shape variants (round, triangular, square)
  - Scale pieces to 0.4 units
  - **Validates: Requirements 2.1, 2.7 (Piece geometry and shapes)**

- [x] 4.2 Implement piece materials and colors
  - Create MeshPhysicalMaterial with transparency (0.3 opacity)
  - Set transmission (0.8), roughness (0.1), metalness (0.2)
  - Apply five color variants (orange, yellow, green, blue, red)
  - **Validates: Requirements 2.2-2.6, 2.8 (Piece colors and gem appearance)**

- [x] 4.3 Create StagingArea component
  - Position staging area at (x: -3, y: -4, z: 0)
  - Arrange 13 pieces in 5 rows grouped by color
  - Apply 1.0 unit spacing between pieces
  - **Validates: Requirements 2.9, 10.2-10.4 (Staging area layout)**

- [x] 4.4 Write unit tests for piece rendering
  - Test correct number of pieces (13 total)
  - Test color distribution (3 orange, 3 yellow, 3 green, 3 blue, 1 red)
  - Test shape distribution per color
  - **Validates: Properties 2.1, 2.2 (Color and Shape Distribution)**

## Phase 5: Camera System

### 5. Camera Controls

- [x] 5.1 Implement camera configuration
  - Set PerspectiveCamera at position (0, 8, 12)
  - Configure FOV (50 degrees), near (0.1), far (1000)
  - Point camera at board center (0, 0, 0)
  - **Validates: Requirement 4 (Camera setup)**

- [x] 5.2 Add OrbitControls from drei
  - Enable rotation with right mouse drag
  - Enable zoom with mouse wheel
  - Set distance constraints (min: 8, max: 25)
  - Set polar angle constraints (min: 15°, max: 85°)
  - Enable damping (factor: 0.05)
  - **Validates: Requirements 4.1-4.5 (Camera controls and constraints)**

- [x] 5.3 Write unit tests for camera bounds
  - Test camera distance stays within limits
  - Test polar angle constraints
  - **Validates: Property 4.1 (Camera Bounds)**

## Phase 6: Drag and Drop Interaction

### 6. Interaction System

- [x] 6.1 Implement drag initiation
  - Add click handler to DiamondPiece
  - Use raycasting to detect piece intersection
  - Set draggedPiece state on click
  - Elevate piece (y += 1.0) when dragging starts
  - Clear slot if piece was on board
  - **Validates: Requirements 3.1, 3.6 (Drag initiation)**

- [x] 6.2 Implement dragging behavior
  - Create invisible horizontal plane at board height
  - Raycast pointer position onto plane during drag
  - Update piece position to follow cursor
  - Continuously detect hovered slot
  - **Validates: Requirement 3.2 (Drag movement)**

- [ ] 6.3 Implement drop logic
  - Handle mouse release event
  - Check if hoveredSlot exists and is unoccupied
  - Snap piece to slot position if valid
  - Update piece.slotId and slot.pieceId bidirectionally
  - Return piece to original position if invalid drop
  - **Validates: Requirements 3.3, 3.4, 3.5 (Drop placement and validation)**

- [ ] 6.4 Add visual feedback for interactions
  - Implement hover highlighting for pieces (scale 1.1x, emissive 0.2)
  - Implement slot highlighting (green for valid, red for occupied)
  - Add dragged piece visual state (scale 1.15x, elevated)
  - Add placement animations (success pulse, failure shake)
  - **Validates: Requirements 7.1-7.4 (Visual feedback)**

- [ ] 6.5 Write unit tests for drag and drop
  - Test piece placement updates both piece and slot state
  - Test occupied slots prevent placement
  - Test invalid drops restore previous state
  - Test drag from board clears slot
  - **Validates: Properties 1.2, 3.1, 3.2 (Piece-Slot Consistency, Drag Atomicity, Slot Exclusivity)**

## Phase 7: Reset Functionality

### 7. Reset Implementation

- [ ] 7.1 Create reset function
  - Clear all slot occupancy (set occupied = false, pieceId = null)
  - Reset all piece positions to staging area
  - Clear all piece.slotId values
  - Add staggered animation for visual effect
  - **Validates: Requirements 5.1-5.3 (Reset functionality)**

- [ ] 7.2 Create ResetButton UI component
  - Position button at top-right of viewport
  - Style with semi-transparent overlay
  - Connect to reset function
  - **Validates: Requirement 5 (Reset UI)**

- [ ] 7.3 Write unit tests for reset
  - Test all slots become unoccupied after reset
  - Test all pieces return to staging area
  - Test state matches initial configuration
  - **Validates: Property 5.1 (Reset Completeness)**

## Phase 8: PDF Reference Integration

### 8. PDF Access

- [ ] 8.1 Create PDFReferenceButton component
  - Position button at top-left of viewport
  - Add PDF icon and label "View Puzzles & Solutions"
  - Implement window.open() to launch PDF in new tab
  - **Validates: Requirements 6.1-6.2 (PDF access)**

- [ ] 8.2 Add puzzle solutions PDF
  - Create or obtain Diamond Quest solutions PDF
  - Place PDF in public/puzzles/ directory
  - Configure PDF URL path
  - **Validates: Requirements 6.3-6.4 (PDF content)**

## Phase 9: Responsive Design and Touch Support

### 9. Responsive Implementation

- [ ] 9.1 Implement viewport responsiveness
  - Configure Canvas to fill viewport (100vw x 100vh)
  - Add window resize handler for camera aspect ratio
  - Test with various screen sizes
  - **Validates: Requirements 9.1-9.2 (Responsive viewport)**

- [ ] 9.2 Add touch support
  - Map single touch to drag operation
  - Map two-finger drag to camera rotation
  - Map pinch gesture to zoom
  - Increase hit areas for mobile (radius 0.6)
  - **Validates: Requirements 9.3-9.4 (Touch controls)**

- [ ] 9.3 Write tests for responsive behavior
  - Test viewport adaptation to different dimensions
  - Test aspect ratio maintenance
  - **Validates: Property 9.1 (Responsive Viewport)**

## Phase 10: Performance Optimization

### 10. Optimization

- [ ] 10.1 Implement geometry and material optimization
  - Reuse base geometries for same-shape pieces
  - Share materials across same-color pieces
  - Configure shadow map size (1024x1024)
  - **Validates: Design Section 9 (Performance)**

- [ ] 10.2 Add event throttling
  - Throttle pointer move events to 60fps
  - Optimize raycast calculations
  - Use React.memo for static components
  - **Validates: Design Section 9 (Performance)**

## Phase 11: Property-Based Testing

### 11. PBT Implementation

- [ ] 11.1 Set up property-based testing framework
  - Install fast-check library
  - Configure test runner for PBT
  - Create test utilities and generators
  - **Validates: All Properties (Testing foundation)**

- [ ] 11.2 Write property test for slot uniqueness
  - Generate random slot configurations
  - Verify no position collisions
  - **Validates: Property 1.1 (Slot Uniqueness)**

- [ ] 11.3 Write property test for piece-slot consistency
  - Generate random piece placements
  - Verify bidirectional state consistency
  - Test no duplicate slot references
  - **Validates: Property 1.2 (Piece-Slot Consistency)**

- [ ] 11.4 Write property test for staging area invariant
  - Generate random game states
  - Verify unplaced pieces have valid staging positions
  - **Validates: Property 1.3 (Staging Area Invariant)**

- [ ] 11.5 Write property test for color distribution
  - Generate random game states
  - Verify color counts remain constant (3-3-3-3-1)
  - **Validates: Property 2.1 (Color Distribution)**

- [ ] 11.6 Write property test for shape distribution
  - Generate random game states
  - Verify shape distribution per color group
  - **Validates: Property 2.2 (Shape Distribution)**

- [ ] 11.7 Write property test for drag operation atomicity
  - Simulate various drag outcomes
  - Verify no intermediate states persist
  - **Validates: Property 3.1 (Drag Operation Atomicity)**

- [ ] 11.8 Write property test for slot occupancy exclusivity
  - Attempt placing pieces in occupied slots
  - Verify rejection of invalid placements
  - **Validates: Property 3.2 (Slot Occupancy Exclusivity)**

- [ ] 11.9 Write property test for visual feedback consistency
  - Simulate interaction sequences
  - Verify feedback state transitions
  - **Validates: Property 7.1 (Visual Feedback Consistency)**

## Phase 12: Integration and Polish

### 12. Final Integration

- [ ] 12.1 Integration testing
  - Test complete drag-and-drop cycles
  - Test camera controls don't interfere with interactions
  - Test reset from various game states
  - Verify all 13 pieces can be placed on board
  - **Validates: All Requirements (End-to-end validation)**

- [ ] 12.2 Visual polish and lighting refinement
  - Fine-tune lighting intensities
  - Verify all colors are distinguishable
  - Test transparency and gem effects
  - Add point light for accent lighting
  - **Validates: Requirements 8.1-8.5 (Lighting and materials)**

- [ ] 12.3 Cross-browser testing
  - Test on Chrome, Firefox, Safari, Edge
  - Verify WebGL 2.0 compatibility
  - Test touch controls on mobile devices
  - **Validates: Design Section 16 (Browser requirements)**

- [ ] 12.4 Build and deployment preparation
  - Configure production build
  - Optimize bundle size
  - Test static deployment
  - Create deployment documentation
  - **Validates: Design Section 16 (Deployment)**

## Phase 13: Documentation

### 13. Documentation

- [ ] 13.1 Create README.md
  - Add project description and features
  - Document installation and setup instructions
  - Add development and build commands
  - Include browser requirements
  - **Validates: All Requirements (Project documentation)**

- [ ] 13.2 Add code documentation
  - Document component props and interfaces
  - Add JSDoc comments for key functions
  - Document state management patterns
  - **Validates: All Requirements (Code maintainability)**

---

**Total Tasks**: 13 phases, 47 tasks
**Estimated Complexity**: High (3D graphics, complex interactions, PBT)
**Key Dependencies**: Three.js, React Three Fiber, fast-check
