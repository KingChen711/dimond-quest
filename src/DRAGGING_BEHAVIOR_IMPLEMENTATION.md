# Dragging Behavior Implementation

## Task 6.2: Implement dragging behavior

**Status**: ✅ Completed

**Validates**: Requirement 3.2 (Drag movement)

## Implementation Summary

### 1. Added Drag Plane and Position Update Logic in App.tsx

The implementation uses raycasting onto an invisible horizontal plane at board height to track cursor position during drag operations.

#### Drag Plane Setup

```typescript
// Ref to track the drag plane for raycasting
const dragPlaneRef = useRef<THREE.Plane>(
  new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
);
```

The plane is defined with:

- Normal vector: (0, 1, 0) - pointing upward
- Distance from origin: 0 - at board height (y = 0)

#### Update Drag Position Function

```typescript
const updateDragPosition = (
  pointerX: number,
  pointerY: number,
  camera: THREE.Camera,
) => {
  if (!gameState.draggedPiece) return;

  // Create raycaster from pointer position
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(pointerX, pointerY), camera);

  // Raycast onto horizontal plane at board height (y = 0)
  const intersectionPoint = new THREE.Vector3();
  raycaster.ray.intersectPlane(dragPlaneRef.current, intersectionPoint);

  if (intersectionPoint) {
    // Update piece position to follow cursor
    setGameState((prevState) => {
      const updatedPieces = prevState.pieces.map((p) => {
        if (p.id === prevState.draggedPiece) {
          // Keep piece elevated (y = 1.0) during drag
          return {
            ...p,
            position: new THREE.Vector3(
              intersectionPoint.x,
              1.0,
              intersectionPoint.z,
            ),
          };
        }
        return p;
      });

      // Detect hovered slot
      const hoveredSlot = detectHoveredSlot(intersectionPoint, prevState.slots);

      return {
        ...prevState,
        pieces: updatedPieces,
        hoveredSlot: hoveredSlot ? hoveredSlot.id : null,
      };
    });
  }
};
```

**Key Features**:

- Only updates position when a piece is being dragged
- Uses Three.js Raycaster to project pointer position onto the horizontal plane
- Maintains piece elevation at y = 1.0 during drag
- Updates piece position to follow cursor in x and z coordinates
- Continuously detects hovered slot

#### Slot Hover Detection Function

```typescript
const detectHoveredSlot = (
  position: THREE.Vector3,
  slots: typeof gameState.slots,
) => {
  const hoverThreshold = 0.5; // Distance threshold for slot detection

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
```

**Key Features**:

- Uses distance-based detection with 0.5 unit threshold
- Only considers x and z coordinates (ignores y-axis difference)
- Returns first slot within threshold (closest slot)
- Returns null if no slot is within threshold

### 2. Created DragHandler Component

A specialized component that handles pointer move events within the Three.js canvas:

```typescript
interface DragHandlerProps {
  isDragging: boolean;
  onPointerMove: (x: number, y: number, camera: THREE.Camera) => void;
}

function DragHandler({isDragging, onPointerMove}: DragHandlerProps) {
  const {camera, gl} = useThree();

  const handlePointerMove = (event: PointerEvent) => {
    if (!isDragging) return;

    // Convert pointer position to normalized device coordinates (-1 to +1)
    const rect = gl.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    onPointerMove(x, y, camera);
  };

  // Attach pointer move listener
  React.useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("pointermove", handlePointerMove);

    return () => {
      canvas.removeEventListener("pointermove", handlePointerMove);
    };
  }, [isDragging, onPointerMove, camera, gl]);

  return null;
}
```

**Key Features**:

- Only processes pointer move events when dragging is active
- Converts screen coordinates to normalized device coordinates (-1 to +1)
- Uses React Three Fiber's `useThree` hook to access camera and canvas
- Properly cleans up event listeners on unmount
- Returns null (no visual rendering)

### 3. Integrated DragHandler into Canvas

```typescript
<Canvas>
  <DragHandler
    isDragging={gameState.draggedPiece !== null}
    onPointerMove={updateDragPosition}
  />
  {/* ... rest of scene ... */}
</Canvas>
```

## Key Features Implemented

### ✅ Invisible Horizontal Plane at Board Height

- Created using `THREE.Plane` with normal vector (0, 1, 0) and distance 0
- Positioned at y = 0 (board height)
- Used for raycasting to determine cursor position in 3D space

### ✅ Raycast Pointer Position onto Plane

- Uses Three.js `Raycaster` to project 2D pointer position into 3D space
- Converts screen coordinates to normalized device coordinates
- Intersects ray with horizontal plane to get 3D position
- Only updates when intersection point is valid

### ✅ Update Piece Position to Follow Cursor

- Updates dragged piece position to match cursor position on plane
- Maintains x and z coordinates from intersection point
- Keeps y coordinate fixed at 1.0 (elevated position)
- Only updates the dragged piece, other pieces remain unchanged

### ✅ Continuously Detect Hovered Slot

- Checks distance from cursor position to each slot
- Uses 0.5 unit threshold for detection
- Only considers horizontal distance (x and z coordinates)
- Updates `hoveredSlot` state continuously during drag
- Clears `hoveredSlot` when cursor moves away from all slots

## Test Coverage

Created comprehensive unit tests in `src/draggingBehavior.test.ts`:

### Test Suites (17 tests total):

1. **Piece Position Updates** (4 tests)
   - Updates piece position to follow cursor
   - Maintains elevated position (y = 1.0) during drag
   - Doesn't update position if no piece is being dragged
   - Only updates the dragged piece position

2. **Slot Hover Detection** (6 tests)
   - Detects hovered slot when cursor is near slot position
   - Detects hovered slot when cursor is within threshold
   - Doesn't detect slot when cursor is beyond threshold
   - Clears hoveredSlot when cursor moves away from slot
   - Detects closest slot when multiple slots are nearby
   - Updates hoveredSlot continuously as cursor moves

3. **Edge Cases** (3 tests)
   - Handles empty slots array
   - Handles negative cursor coordinates
   - Handles large cursor coordinates

4. **State Consistency** (4 tests)
   - Maintains total piece count during drag
   - Maintains total slot count during drag
   - Maintains draggedPiece state during position update
   - Doesn't modify slot occupancy during drag

**All 17 tests passing** ✅

## Requirements Validated

### ✅ Requirement 3.2: Drag Movement

> WHILE a Drag_Operation is active, THE System SHALL move the Diamond_Piece to follow the cursor position

**Implementation**:

- DragHandler component listens for pointer move events
- updateDragPosition function uses raycasting to project cursor onto horizontal plane
- Piece position is updated to match cursor position in x and z coordinates
- Piece maintains elevated position (y = 1.0) during drag
- hoveredSlot is continuously updated based on cursor position

## Technical Details

### Raycasting Approach

The implementation uses Three.js raycasting to convert 2D screen coordinates into 3D world coordinates:

1. **Normalized Device Coordinates**: Screen coordinates are converted to NDC (-1 to +1 range)
2. **Ray Creation**: A ray is created from the camera through the pointer position
3. **Plane Intersection**: The ray is intersected with the horizontal plane at y = 0
4. **Position Update**: The intersection point provides the 3D position for the piece

### Why Horizontal Plane?

Using a horizontal plane at board height provides several benefits:

- **Consistent Elevation**: Pieces stay at the same height during drag
- **Intuitive Movement**: Cursor movement directly maps to piece movement
- **No Depth Ambiguity**: Eliminates confusion about piece depth in 3D space
- **Simple Calculations**: Plane intersection is computationally efficient

### Distance Calculation for Slot Detection

The slot detection uses 2D distance (x and z only) rather than 3D distance:

- **Ignores Y-Axis**: Pieces are elevated during drag, but we only care about horizontal position
- **Threshold of 0.5**: Provides good balance between precision and usability
- **First Match**: Returns first slot within threshold (typically the closest)

## Visual Feedback

The implementation provides continuous visual feedback:

1. **Piece Position**: Piece follows cursor smoothly during drag
2. **Elevated Position**: Piece stays at y = 1.0, visually indicating drag state
3. **Hovered Slot**: `hoveredSlot` state can be used for visual highlighting (implemented in task 6.4)

## Performance Considerations

- **Event Throttling**: Pointer move events are processed at browser frame rate
- **Conditional Updates**: Only processes events when dragging is active
- **Efficient Raycasting**: Single raycast per pointer move event
- **Simple Distance Calculation**: Uses basic 2D distance formula

## Integration with Existing Code

The implementation integrates seamlessly with task 6.1 (drag initiation):

1. **Task 6.1**: User clicks piece → `startDrag` sets `draggedPiece` and elevates piece
2. **Task 6.2**: User moves cursor → `updateDragPosition` moves piece to follow cursor
3. **Task 6.3** (next): User releases → drop logic places piece or returns to origin

## Next Steps

The following tasks build on this implementation:

- **Task 6.3**: Implement drop logic (place piece on slot or return to origin)
- **Task 6.4**: Add visual feedback for interactions (hover states, slot highlighting)
- **Task 6.5**: Write integration tests for complete drag-and-drop cycle

## Files Modified

1. **src/App.tsx**
   - Added `dragPlaneRef` for raycasting
   - Added `updateDragPosition` function
   - Added `detectHoveredSlot` function
   - Created `DragHandler` component
   - Integrated DragHandler into Canvas

2. **src/draggingBehavior.test.ts** (new file)
   - Created comprehensive unit tests for dragging behavior
   - 17 tests covering all scenarios and edge cases

## Technical Notes

- React Three Fiber's `useThree` hook provides access to camera and canvas
- Three.js `Raycaster` handles 3D projection calculations
- Three.js `Plane` represents the invisible horizontal surface
- Pointer events work for both mouse and touch input
- Event listeners are properly cleaned up to prevent memory leaks
- State updates use immutable patterns (map, spread operators)
- Only horizontal distance (x, z) is considered for slot detection
