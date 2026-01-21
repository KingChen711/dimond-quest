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

export const DiamondPiece: React.FC<DiamondPieceProps> = ({
  piece,
  isHovered = false,
  isDragged = false,
  onClick,
}) => {
  // Piece geometry parameters
  const baseScale = 1.0;
  const scale = isDragged
    ? baseScale * 1.15
    : isHovered
      ? baseScale * 1.1
      : baseScale;

  // Color mapping
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

  const colorHex = useMemo(() => getColorHex(piece.color), [piece.color]);

  // Helper to create a "Brilliant Cut" style geometry
  // Structure: Tip (Bottom) -> Girdle (Middle Ring) -> Table (Top Ring) -> Center (Top Point)
  const createGemGeometry = (girdleVertices: { x: number; z: number }[]) => {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];

    // Vertical dimensions (Reduced total height for balance)
    const tipY = -0.6; // Bottom point (Shortened depth)
    const girdleY = 0.2; // Wide point (Lowered)
    const tableY = 0.45; // Top flat edge (Lowered)

    // Slight dome for the center? Or flat?
    // User asked "convex", so let's pop the center just slightly above the table edge
    const centerY = 0.55; // Higher peak (0.1 above table) for "convex" look

    // Scale factor for the table (top) relative to girdle (middle)
    // A value of 0.75 means the top flat face is 75% size of the widest part
    const tableScale = 0.75;

    const tip = { x: 0, y: tipY, z: 0 };
    const centerTop = { x: 0, y: centerY, z: 0 };

    // Generate Vertices Lists
    const numPoints = girdleVertices.length;

    // 1. Pavilion Faces (Tip -> Girdle -> Girdle)
    // Connects magnitude of bottom point to the outer ring
    for (let i = 0; i < numPoints; i++) {
      const d1 = girdleVertices[i];
      const d2 = girdleVertices[(i + 1) % numPoints];

      // Push Triangle: Tip -> D1 -> D2 (CCW Order for outer normal)
      positions.push(d1.x, girdleY, d1.z);
      positions.push(d2.x, girdleY, d2.z);
      positions.push(tip.x, tip.y, tip.z);
    }

    // 2. Crown Faces (Girdle -> Girdle -> Table -> Table)
    // Connects outer ring to inner top ring. Quads split into 2 triangles.
    for (let i = 0; i < numPoints; i++) {
      const g1 = girdleVertices[i];
      const g2 = girdleVertices[(i + 1) % numPoints];

      const t1 = { x: g1.x * tableScale, z: g1.z * tableScale };
      const t2 = { x: g2.x * tableScale, z: g2.z * tableScale };

      // Quad: G1-G2-T2-T1
      // Tri 1: G1 -> G2 -> T2
      positions.push(g1.x, girdleY, g1.z);
      positions.push(g2.x, girdleY, g2.z); // G2 is "Next"
      positions.push(t2.x, tableY, t2.z);

      // Tri 2: G1 -> T2 -> T1
      positions.push(g1.x, girdleY, g1.z);
      positions.push(t2.x, tableY, t2.z);
      positions.push(t1.x, tableY, t1.z);
    }

    // 3. Table Faces (Table -> Table -> Center)
    // Fills the top hole
    for (let i = 0; i < numPoints; i++) {
      const g1 = girdleVertices[i];
      const g2 = girdleVertices[(i + 1) % numPoints];

      const t1 = { x: g1.x * tableScale, z: g1.z * tableScale };
      const t2 = { x: g2.x * tableScale, z: g2.z * tableScale };

      // Tri: Center -> T1 -> T2 (CCW looking from top)
      // Actually Center -> T1 -> T2
      positions.push(centerTop.x, centerTop.y, centerTop.z);
      positions.push(t1.x, tableY, t1.z);
      positions.push(t2.x, tableY, t2.z);
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.computeVertexNormals();
    return geometry;
  };

  const currentGeometry = useMemo(() => {
    // 1. Round (12-sided)
    if (piece.shape === "round") {
      const vertices = [];
      const segments = 12;
      const radius = 0.55;
      for (let i = 0; i < segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        // Invert Sine (z = -sin) for correct CCW winding order
        vertices.push({
          x: Math.cos(theta) * radius,
          z: -Math.sin(theta) * radius,
        });
      }
      return createGemGeometry(vertices);
    }
    // 2. Square (Chamfered)
    else if (piece.shape === "square") {
      const w = 0.55; // Half width
      const c = 0.15; // Chamfer amount
      // 8 points CCW dimensions
      const vertices = [
        { x: w - c, z: -w }, // Top Right Start
        { x: -w + c, z: -w }, // Top Left End
        { x: -w, z: -w + c }, // Top Left Start
        { x: -w, z: w - c }, // Bottom Left End
        { x: -w + c, z: w }, // Bottom Left Start
        { x: w - c, z: w }, // Bottom Right End
        { x: w, z: w - c }, // Bottom Right Start
        { x: w, z: -w + c }, // Top Right End
      ];
      return createGemGeometry(vertices);
    }
    // 3. Triangle (Chamfered)
    else {
      const R = 0.6;
      const delta = 0.25; // radians spread for chamfer (increase for more visible cut)

      // 3 Corners at 90, 210, 330 degrees
      // Use +PI/2 offset to orient point "Up" if mapping 0 to Right.
      const angles = [
        Math.PI / 2, // Top
        Math.PI / 2 + (2 * Math.PI) / 3, // Left Bottom
        Math.PI / 2 + (4 * Math.PI) / 3, // Right Bottom
      ];

      const vertices: { x: number; z: number }[] = [];

      // Generate pairs around each corner
      // Invert Sine (z = -sin) for correct CCW winding order
      for (let a of angles) {
        vertices.push({
          x: R * Math.cos(a - delta),
          z: -R * Math.sin(a - delta),
        });
        vertices.push({
          x: R * Math.cos(a + delta),
          z: -R * Math.sin(a + delta),
        });
      }

      return createGemGeometry(vertices);
    }
  }, [piece.shape]);

  // Handle pointer down event to start drag
  const handlePointerDown = (event: any) => {
    // Stop propagation to prevent camera rotation/pan while dragging piece
    event.stopPropagation();
    // Prevent default browser behavior if needed
    // event.preventDefault();

    if (onClick) {
      onClick(piece.id); // Triggers startDrag in App
    }
  };

  return (
    <mesh
      position={[piece.position.x, piece.position.y, piece.position.z]}
      // Apply base rotations to align shapes nicely in slots
      // Square: 45deg to be diamond
      // Triangle: 180deg to be inverted triangle (pointing down)
      rotation={
        piece.shape === "square"
          ? [0, Math.PI / 4, 0]
          : piece.shape === "triangular"
            ? [0, Math.PI, 0]
            : [0, 0, 0]
      }
      scale={[scale, scale, scale]}
      onPointerDown={handlePointerDown}
      geometry={currentGeometry}
    >
      <meshPhysicalMaterial
        color={colorHex}
        emissive={colorHex}
        emissiveIntensity={isDragged ? 0.3 : isHovered ? 0.2 : 0}
        metalness={0.1}
        roughness={0.1}
        transmission={0.6} // Glassy look
        thickness={1.5}
        clearcoat={1.0}
        flatShading={true} // Emphasize the facets
      />
    </mesh>
  );
};
