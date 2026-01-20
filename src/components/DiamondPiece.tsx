/**
 * DiamondPiece Component
 *
 * Renders a colored gem-shaped game piece that can be placed on the board.
 * Each piece has a distinct color and shape (round, triangular, or square).
 *
 * Validates: Requirements 2.1, 2.2-2.6, 2.7, 2.8 (Piece geometry, colors, shapes, and gem appearance)
 */

import React, { useMemo } from "react";
import { DiamondPiece as DiamondPieceType, PieceColor } from "../types";
import * as THREE from "three";

interface DiamondPieceProps {
  /** The piece data including color, shape, and position */
  piece: DiamondPieceType;
  /** Whether this piece is currently being hovered */
  isHovered?: boolean;
  /** Whether this piece is currently being dragged */
  isDragged?: boolean;
  /** Click handler for drag initiation */
  onClick?: (pieceId: string) => void;
}

/**
 * DiamondPiece component
 *
 * Creates a gem-shaped piece using octahedron base geometry with shape variants.
 *
 * Geometry:
 * - Base shape: Octahedron (8-faced diamond)
 * - Scale: 0.4 units
 * - Shape variants:
 *   - Round: Standard octahedron
 *   - Triangular: Octahedron with triangular cross-section (rotated)
 *   - Square: Octahedron with square cross-section
 *
 * Materials (MeshPhysicalMaterial):
 * - Transparency: 0.3 opacity
 * - Transmission: 0.8 (light passes through)
 * - Roughness: 0.1 (glossy surface)
 * - Metalness: 0.2
 * - Color variants: orange, yellow, green, blue, red
 *
 * Visual states:
 * - Normal: Base appearance with color
 * - Hovered: Scaled up (1.1x) with increased emissive
 * - Dragged: Elevated and scaled up (1.15x) with enhanced emissive
 *
 * Position: Determined by piece.position from game state
 */
export const DiamondPiece: React.FC<DiamondPieceProps> = ({
  piece,
  isHovered = false,
  isDragged = false,
  onClick,
}) => {
  // Piece geometry parameters
  const baseScale = 1.0; // Increased from 0.4 to make pieces nearly fill the slots

  // Calculate scale based on state
  const scale = isDragged
    ? baseScale * 1.15
    : isHovered
      ? baseScale * 1.1
      : baseScale;

  // Color mapping for pieces
  // Requirements 2.2-2.6: orange, yellow, green, blue, red
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

  // Memoize the color to avoid recalculation
  const colorHex = useMemo(() => getColorHex(piece.color), [piece.color]);

  // Create faceted square diamond geometry
  const createSquareDiamondGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const tableSize = 2.0; // Top flat surface - square shape (larger to compensate for scale)
    const girdleSize = 2.2; // Slightly wider at the girdle
    const crownHeight = 3.0; // Very tall crown to be visible after 0.4x scale
    const pavilionDepth = 0.5; // Shallow pointed bottom

    // Define vertices for a faceted square diamond
    const vertices = new Float32Array([
      // Top table (flat square top) - 4 vertices (aligned to axes for square appearance)
      -tableSize / 2,
      crownHeight,
      -tableSize / 2, // 0 - front left
      tableSize / 2,
      crownHeight,
      -tableSize / 2, // 1 - front right
      tableSize / 2,
      crownHeight,
      tableSize / 2, // 2 - back right
      -tableSize / 2,
      crownHeight,
      tableSize / 2, // 3 - back left

      // Crown girdle (wider square at middle) - 4 vertices
      -girdleSize / 2,
      0,
      -girdleSize / 2, // 4 - front left
      girdleSize / 2,
      0,
      -girdleSize / 2, // 5 - front right
      girdleSize / 2,
      0,
      girdleSize / 2, // 6 - back right
      -girdleSize / 2,
      0,
      girdleSize / 2, // 7 - back left

      // Pavilion point (bottom) - 1 vertex
      0,
      -pavilionDepth,
      0, // 8 - center bottom point
    ]);

    // Define faces (triangles)
    const indices = new Uint16Array([
      // Top table (2 triangles forming square)
      0,
      1,
      2,
      0,
      2,
      3,

      // Crown facets (connecting table to girdle) - 8 triangular facets
      0,
      4,
      5,
      0,
      5,
      1, // Front crown facets
      1,
      5,
      6,
      1,
      6,
      2, // Right crown facets
      2,
      6,
      7,
      2,
      7,
      3, // Back crown facets
      3,
      7,
      4,
      3,
      4,
      0, // Left crown facets

      // Pavilion facets (connecting girdle to point) - 4 triangular facets
      4,
      8,
      5, // Front pavilion
      5,
      8,
      6, // Right pavilion
      6,
      8,
      7, // Back pavilion
      7,
      8,
      4, // Left pavilion
    ]);

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.computeVertexNormals();

    return geometry;
  }, []);

  // Get geometry based on shape
  const getGeometry = () => {
    switch (piece.shape) {
      case "triangular":
        // Cylinder with 3 sides for triangular prism - better size match
        return <cylinderGeometry args={[0.55, 0.55, 1.2, 3]} />;
      case "square":
        // Box geometry for square diamond
        return <boxGeometry args={[0.8, 1.2, 0.8]} />;
      case "round":
      default:
        // Cylinder for round shape - looks like circle from top
        return <cylinderGeometry args={[0.55, 0.55, 1.2, 32]} />;
    }
  };

  // Get rotation based on shape
  const getRotation = (): [number, number, number] => {
    switch (piece.shape) {
      case "triangular":
        // Rotate 30 degrees (PI/6) to make one vertex point up
        return [0, Math.PI * 2, 0];
      case "square":
        // Rotate 45 degrees on Y axis to appear as diamond from top
        return [0, Math.PI / 4, 0];
      case "round":
      default:
        // No rotation needed for cylinder
        return [0, 0, 0];
    }
  };

  // Handle click event
  const handleClick = (event: any) => {
    event.stopPropagation();
    if (onClick) {
      onClick(piece.id);
    }
  };

  return (
    <mesh
      position={[piece.position.x, piece.position.y, piece.position.z]}
      rotation={getRotation()}
      scale={[scale, scale, scale]}
      onClick={handleClick}
    >
      {/* Geometry varies by shape */}
      {getGeometry()}

      {/* MeshStandardMaterial for solid gem appearance
          Validates: Requirement 2.8 (gem appearance) */}
      <meshStandardMaterial
        color={colorHex}
        emissive={colorHex}
        emissiveIntensity={isDragged ? 0.3 : isHovered ? 0.2 : 0}
        metalness={0.4}
        roughness={0.3}
      />
    </mesh>
  );
};
