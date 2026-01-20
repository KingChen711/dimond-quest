/**
 * GameBoard Component
 *
 * Renders the cross-shaped game board at the center of the scene.
 * The board serves as the base structure for the 13 slot positions.
 *
 * Validates: Requirements 1.1, 1.2, 1.4 (Board structure and positioning)
 */

import React from "react";
import { BoardSlot as BoardSlotType } from "../types";
import { BoardSlot } from "./BoardSlot";

/**
 * GameBoard component
 *
 * Creates a cross-shaped board geometry positioned at scene center (0, 0, 0).
 * The board uses a dark gray material with metallic finish to contrast with
 * the translucent diamond pieces.
 *
 * Board dimensions:
 * - Cross shape accommodates 13 slots
 * - Slot spacing: 1.2 units
 * - Overall dimensions: ~4.8 x 6.0 units
 *
 * Material properties:
 * - Color: Dark gray (#2a2a2a)
 * - Metallic finish for visual appeal
 * - Receives shadows for depth
 *
 * @param slots - Array of 13 board slots to render
 * @param hoveredSlot - ID of currently hovered slot (for visual feedback)
 */
interface GameBoardProps {
  slots: BoardSlotType[];
  hoveredSlot?: string | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({ slots, hoveredSlot }) => {
  // Board dimensions based on slot layout
  // The diamond shape requires careful sizing to accommodate all slots
  const spacing = 1.2;

  // Create diamond-shaped geometry using multiple box geometries
  // Diamond pattern: 1-3-5-3-1 slots per row

  // Board thickness
  const thickness = 0.2;

  // Material properties - much lighter for better visibility
  const boardMaterial = {
    color: "#666666", // Much lighter gray
    metalness: 0.2,
    roughness: 0.6,
  };

  return (
    <>
      {/* Board geometry - rotated 45 degrees */}
      <group position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
        {/* Top single slot row */}
        <mesh position={[0, 0, spacing * 2]}>
          <boxGeometry args={[spacing * 1.1, thickness, spacing * 1.1]} />
          <meshStandardMaterial {...boardMaterial} />
        </mesh>

        {/* Second row (3 slots) */}
        <mesh position={[0, 0, spacing]}>
          <boxGeometry args={[spacing * 3.1, thickness, spacing * 1.1]} />
          <meshStandardMaterial {...boardMaterial} />
        </mesh>

        {/* Middle row (5 slots) */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[spacing * 5.1, thickness, spacing * 1.1]} />
          <meshStandardMaterial {...boardMaterial} />
        </mesh>

        {/* Fourth row (3 slots) */}
        <mesh position={[0, 0, -spacing]}>
          <boxGeometry args={[spacing * 3.1, thickness, spacing * 1.1]} />
          <meshStandardMaterial {...boardMaterial} />
        </mesh>

        {/* Bottom single slot row */}
        <mesh position={[0, 0, -spacing * 2]}>
          <boxGeometry args={[spacing * 1.1, thickness, spacing * 1.1]} />
          <meshStandardMaterial {...boardMaterial} />
        </mesh>
      </group>

      {/* Render all 13 board slots - NOT inside rotated group since positions are already rotated */}
      {slots.map((slot) => {
        const isHovered = hoveredSlot === slot.id;
        const isValidDrop = !slot.occupied; // Valid drop only if slot is empty

        return (
          <BoardSlot
            key={slot.id}
            slot={slot}
            isHovered={isHovered}
            isValidDrop={isValidDrop}
          />
        );
      })}
    </>
  );
};
