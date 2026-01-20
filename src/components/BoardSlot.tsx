/**
 * BoardSlot Component
 *
 * Renders an individual slot on the game board where diamond pieces can be placed.
 * Each slot is a circular indentation with visual indicators for empty/occupied states.
 *
 * Validates: Requirements 1.3, 1.5 (Slot visualization)
 */

import React from "react";
import { BoardSlot as BoardSlotType } from "../types";

interface BoardSlotProps {
  /** The slot data including position and occupancy state */
  slot: BoardSlotType;
  /** Whether this slot is currently being hovered during a drag operation */
  isHovered?: boolean;
  /** Whether the hover is valid (slot is empty) or invalid (slot is occupied) */
  isValidDrop?: boolean;
}

/**
 * BoardSlot component
 *
 * Creates a square outline marker on the board surface to indicate where pieces can be placed.
 *
 * Geometry:
 * - Square outline (using edges geometry)
 * - Size: 0.9 units (to fit within board slot area)
 *
 * Visual indicators:
 * - Empty slots: Light gray outline
 * - Hovered (valid): Green emissive glow
 * - Hovered (invalid/occupied): Red emissive glow
 *
 * Position: Determined by slot.position from the board layout
 */
export const BoardSlot: React.FC<BoardSlotProps> = ({
  slot,
  isHovered = false,
  isValidDrop = true,
}) => {
  // Slot geometry parameters - square outline
  const size = 1.1; // Larger to nearly touch adjacent slots (spacing is 1.2)
  const lineWidth = 0.05; // Slightly thicker for better visibility

  // Material properties based on state
  const getSlotColor = () => {
    if (isHovered) {
      // Show green for valid drop, red for invalid/occupied
      return isValidDrop ? "#00ff00" : "#ff0000";
    }
    // Default empty slot appearance - subtle outline
    return "#888888";
  };

  const color = getSlotColor();
  const emissiveIntensity = isHovered ? 1.0 : 0.3;

  // Create 4 thin boxes to form a square outline, rotated 45 degrees to match board
  return (
    <group
      position={[slot.position.x, slot.position.y + 0.11, slot.position.z]}
      rotation={[0, Math.PI / 4, 0]}
    >
      {/* Top edge */}
      <mesh position={[0, 0, -size / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[size, lineWidth, lineWidth]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Bottom edge */}
      <mesh position={[0, 0, size / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[size, lineWidth, lineWidth]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Left edge */}
      <mesh
        position={[-size / 2, 0, 0]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
      >
        <boxGeometry args={[size, lineWidth, lineWidth]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Right edge */}
      <mesh
        position={[size / 2, 0, 0]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
      >
        <boxGeometry args={[size, lineWidth, lineWidth]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
};
