# Diamond Piece Material Implementation

## Task 4.2: Implement piece materials and colors

### Implementation Summary

The DiamondPiece component now uses **MeshPhysicalMaterial** to create realistic gem-like appearance for all game pieces.

### Material Properties

#### Physical Properties

- **Transparency**: `opacity: 0.7` (0.3 transparency as specified)
- **Transmission**: `0.8` - Allows light to pass through the gem
- **Roughness**: `0.1` - Creates a glossy, reflective surface
- **Metalness**: `0.2` - Adds subtle metallic quality
- **Clearcoat**: `1.0` - Additional glossy layer for enhanced gem effect
- **Clearcoat Roughness**: `0.1` - Smooth clearcoat finish

#### Color Mapping

All five piece colors are mapped to specific hex values as per design specification:

| Color  | Hex Value | Requirement    |
| ------ | --------- | -------------- |
| Orange | `#ff8c00` | 2.2 (3 pieces) |
| Yellow | `#ffd700` | 2.3 (3 pieces) |
| Green  | `#32cd32` | 2.4 (3 pieces) |
| Blue   | `#1e90ff` | 2.5 (3 pieces) |
| Red    | `#dc143c` | 2.6 (1 piece)  |

### Visual States

The material responds to interaction states:

- **Normal**: Base gem appearance with no emissive glow
- **Hovered**: Emissive intensity `0.2` for subtle highlight
- **Dragged**: Emissive intensity `0.3` for stronger highlight

### Requirements Validated

✅ **Requirement 2.2**: Orange pieces with correct color  
✅ **Requirement 2.3**: Yellow pieces with correct color  
✅ **Requirement 2.4**: Green pieces with correct color  
✅ **Requirement 2.5**: Blue pieces with correct color  
✅ **Requirement 2.6**: Red piece with correct color  
✅ **Requirement 2.8**: Translucent material properties to simulate gem appearance

### Testing

All material properties are tested in `DiamondPiece.test.tsx`:

- ✅ MeshPhysicalMaterial usage
- ✅ Transparency settings (0.7 opacity)
- ✅ Transmission (0.8)
- ✅ Roughness (0.1)
- ✅ Metalness (0.2)
- ✅ All five color hex mappings
- ✅ Clearcoat properties

**Test Results**: 38/38 tests passing for DiamondPiece component

### Technical Details

#### Color Function

```typescript
const getColorHex = (color: PieceColor): string => {
  switch (color) {
    case "orange":
      return "#ff8c00";
    case "yellow":
      return "#ffd700";
    case "green":
      return "#32cd32";
    case "blue":
      return "#1e90ff";
    case "red":
      return "#dc143c";
    default:
      return "#ffffff";
  }
};
```

The color is memoized using `useMemo` to avoid recalculation on every render.

#### Material Configuration

```tsx
<meshPhysicalMaterial
  color={colorHex}
  transparent={true}
  opacity={0.7}
  transmission={0.8}
  roughness={0.1}
  metalness={0.2}
  emissive={colorHex}
  emissiveIntensity={isDragged ? 0.3 : isHovered ? 0.2 : 0}
  clearcoat={1.0}
  clearcoatRoughness={0.1}
/>
```

### Next Steps

The material implementation is complete. The next task (4.3) will create the StagingArea component to display all pieces with these materials in the game scene.

### Performance Notes

- Materials are created per piece instance (not shared) to allow individual emissive intensity control
- Color calculation is memoized to prevent unnecessary recalculations
- MeshPhysicalMaterial is more computationally expensive than MeshStandardMaterial but provides superior visual quality for gem rendering
