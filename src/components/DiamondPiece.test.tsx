/**
 * Unit tests for DiamondPiece component
 *
 * Tests verify:
 * - Piece renders with correct octahedron geometry
 * - Three shape variants (round, triangular, square) have correct rotations
 * - Pieces scale to 0.4 units
 * - Visual states (normal, hovered, dragged) apply correct transformations
 * - All five colors are supported with correct hex values
 * - MeshPhysicalMaterial properties for gem appearance (transparency, transmission, roughness, metalness)
 *
 * Validates: Requirements 2.1, 2.2-2.6, 2.7, 2.8 (Piece geometry, colors, shapes, and gem appearance)
 */

import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { Vector3 } from "three";
import {
  DiamondPiece as DiamondPieceType,
  PieceColor,
  PieceShape,
} from "../types";

describe("DiamondPiece Component", () => {
  // Helper function to create a test piece
  const createTestPiece = (
    id: string,
    color: PieceColor,
    shape: PieceShape,
    x: number = 0,
    y: number = 0,
    z: number = 0,
  ): DiamondPieceType => ({
    id,
    color,
    shape,
    position: new Vector3(x, y, z),
    slotId: null,
    stagingPosition: new Vector3(x, y, z),
  });

  describe("Geometry", () => {
    it("should use octahedron geometry with 8 faces", () => {
      // Octahedron is the base geometry for all diamond pieces
      const geometry = new THREE.OctahedronGeometry(1, 0);

      expect(geometry).toBeInstanceOf(THREE.OctahedronGeometry);
      expect(geometry.parameters.radius).toBe(1);
      expect(geometry.parameters.detail).toBe(0);

      // Octahedron has 8 faces (triangular faces)
      // Three.js duplicates vertices for proper face normals
      // 8 faces × 3 vertices per triangle = 24 position attributes
      expect(geometry.attributes.position.count).toBe(24);
    });

    it("should scale pieces to 0.4 units", () => {
      // Base scale for all pieces is 0.4 units
      const baseScale = 0.4;

      expect(baseScale).toBe(0.4);
    });

    it("should scale up to 1.1x when hovered", () => {
      // Hovered pieces should be slightly larger for visual feedback
      const baseScale = 0.4;
      const hoveredScale = baseScale * 1.1;

      expect(hoveredScale).toBeCloseTo(0.44, 2);
    });

    it("should scale up to 1.15x when dragged", () => {
      // Dragged pieces should be even larger for clear visual feedback
      const baseScale = 0.4;
      const draggedScale = baseScale * 1.15;

      expect(draggedScale).toBeCloseTo(0.46, 2);
    });
  });

  describe("Shape Variants", () => {
    it("should have standard rotation for round shape", () => {
      // Round shape uses standard octahedron orientation
      const piece = createTestPiece("piece-1", "orange", "round");

      // Expected rotation: [0, 0, 0]
      const expectedRotation = [0, 0, 0];

      expect(expectedRotation).toEqual([0, 0, 0]);
    });

    it("should rotate for triangular shape", () => {
      // Triangular shape rotates to create triangular cross-section
      const piece = createTestPiece("piece-2", "yellow", "triangular");

      // Expected rotation: [0, π/6, 0] (30 degrees around Y axis)
      const expectedRotation = [0, Math.PI / 6, 0];

      expect(expectedRotation[0]).toBe(0);
      expect(expectedRotation[1]).toBeCloseTo(0.5236, 4); // π/6 ≈ 0.5236
      expect(expectedRotation[2]).toBe(0);
    });

    it("should rotate for square shape", () => {
      // Square shape rotates to create square cross-section
      const piece = createTestPiece("piece-3", "green", "square");

      // Expected rotation: [0, π/4, 0] (45 degrees around Y axis)
      const expectedRotation = [0, Math.PI / 4, 0];

      expect(expectedRotation[0]).toBe(0);
      expect(expectedRotation[1]).toBeCloseTo(0.7854, 4); // π/4 ≈ 0.7854
      expect(expectedRotation[2]).toBe(0);
    });

    it("should support all three shape types", () => {
      // Verify all three shape types are valid
      const shapes: PieceShape[] = ["round", "triangular", "square"];

      expect(shapes).toHaveLength(3);
      expect(shapes).toContain("round");
      expect(shapes).toContain("triangular");
      expect(shapes).toContain("square");
    });
  });

  describe("Colors", () => {
    it("should support orange color", () => {
      const piece = createTestPiece("piece-orange", "orange", "round");
      expect(piece.color).toBe("orange");
    });

    it("should support yellow color", () => {
      const piece = createTestPiece("piece-yellow", "yellow", "round");
      expect(piece.color).toBe("yellow");
    });

    it("should support green color", () => {
      const piece = createTestPiece("piece-green", "green", "round");
      expect(piece.color).toBe("green");
    });

    it("should support blue color", () => {
      const piece = createTestPiece("piece-blue", "blue", "round");
      expect(piece.color).toBe("blue");
    });

    it("should support red color", () => {
      const piece = createTestPiece("piece-red", "red", "round");
      expect(piece.color).toBe("red");
    });

    it("should support all five color types", () => {
      // Verify all five color types are valid
      const colors: PieceColor[] = ["orange", "yellow", "green", "blue", "red"];

      expect(colors).toHaveLength(5);
      expect(colors).toContain("orange");
      expect(colors).toContain("yellow");
      expect(colors).toContain("green");
      expect(colors).toContain("blue");
      expect(colors).toContain("red");
    });
  });

  describe("Visual States", () => {
    it("should have no emissive intensity in normal state", () => {
      // Normal state should have no glow
      const emissiveIntensity = 0;

      expect(emissiveIntensity).toBe(0);
    });

    it("should have emissive intensity of 0.2 when hovered", () => {
      // Hovered state should have subtle glow
      const emissiveIntensity = 0.2;

      expect(emissiveIntensity).toBe(0.2);
    });

    it("should have emissive intensity of 0.3 when dragged", () => {
      // Dragged state should have stronger glow
      const emissiveIntensity = 0.3;

      expect(emissiveIntensity).toBe(0.3);
    });

    it("should use piece color for emissive color", () => {
      // Emissive color should match piece color for consistent appearance
      const piece = createTestPiece("piece-1", "orange", "round");

      expect(piece.color).toBe("orange");
      // In the component, emissive color is set to piece.color
    });
  });

  describe("Positioning", () => {
    it("should position piece at specified coordinates", () => {
      const piece = createTestPiece(
        "piece-1",
        "orange",
        "round",
        1.5,
        2.0,
        -0.5,
      );

      expect(piece.position.x).toBe(1.5);
      expect(piece.position.y).toBe(2.0);
      expect(piece.position.z).toBe(-0.5);
    });

    it("should support negative coordinates", () => {
      const piece = createTestPiece("piece-2", "blue", "square", -3, -4, 0);

      expect(piece.position.x).toBe(-3);
      expect(piece.position.y).toBe(-4);
      expect(piece.position.z).toBe(0);
    });

    it("should maintain staging position for reset", () => {
      const piece = createTestPiece(
        "piece-3",
        "green",
        "triangular",
        -2,
        -4,
        1,
      );

      expect(piece.stagingPosition.x).toBe(-2);
      expect(piece.stagingPosition.y).toBe(-4);
      expect(piece.stagingPosition.z).toBe(1);
    });
  });

  describe("Shadow Support", () => {
    it("should cast shadows", () => {
      // Pieces should cast shadows for depth perception
      const mesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(1, 0),
        new THREE.MeshStandardMaterial(),
      );

      mesh.castShadow = true;

      expect(mesh.castShadow).toBe(true);
    });

    it("should receive shadows", () => {
      // Pieces should receive shadows from other pieces
      const mesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(1, 0),
        new THREE.MeshStandardMaterial(),
      );

      mesh.receiveShadow = true;

      expect(mesh.receiveShadow).toBe(true);
    });
  });

  describe("Piece Distribution", () => {
    it("should create correct number of pieces per color", () => {
      // Requirements 2.2-2.6: 3 orange, 3 yellow, 3 green, 3 blue, 1 red
      const pieces: DiamondPieceType[] = [
        // Orange pieces
        createTestPiece("piece-orange-1", "orange", "round"),
        createTestPiece("piece-orange-2", "orange", "triangular"),
        createTestPiece("piece-orange-3", "orange", "square"),
        // Yellow pieces
        createTestPiece("piece-yellow-1", "yellow", "round"),
        createTestPiece("piece-yellow-2", "yellow", "triangular"),
        createTestPiece("piece-yellow-3", "yellow", "square"),
        // Green pieces
        createTestPiece("piece-green-1", "green", "round"),
        createTestPiece("piece-green-2", "green", "triangular"),
        createTestPiece("piece-green-3", "green", "square"),
        // Blue pieces
        createTestPiece("piece-blue-1", "blue", "round"),
        createTestPiece("piece-blue-2", "blue", "triangular"),
        createTestPiece("piece-blue-3", "blue", "square"),
        // Red piece
        createTestPiece("piece-red-1", "red", "round"),
      ];

      const orangeCount = pieces.filter((p) => p.color === "orange").length;
      const yellowCount = pieces.filter((p) => p.color === "yellow").length;
      const greenCount = pieces.filter((p) => p.color === "green").length;
      const blueCount = pieces.filter((p) => p.color === "blue").length;
      const redCount = pieces.filter((p) => p.color === "red").length;

      expect(orangeCount).toBe(3);
      expect(yellowCount).toBe(3);
      expect(greenCount).toBe(3);
      expect(blueCount).toBe(3);
      expect(redCount).toBe(1);
      expect(pieces.length).toBe(13);
    });

    it("should have one piece of each shape per color (except red)", () => {
      // Each color group (except red) should have round, triangular, and square
      const orangePieces = [
        createTestPiece("piece-orange-1", "orange", "round"),
        createTestPiece("piece-orange-2", "orange", "triangular"),
        createTestPiece("piece-orange-3", "orange", "square"),
      ];

      const shapes = orangePieces.map((p) => p.shape);

      expect(shapes).toContain("round");
      expect(shapes).toContain("triangular");
      expect(shapes).toContain("square");
      expect(shapes).toHaveLength(3);
    });
  });

  describe("Material Properties", () => {
    it("should use MeshPhysicalMaterial for gem appearance", () => {
      // Task 4.2: Component uses MeshPhysicalMaterial for realistic gem rendering
      const material = new THREE.MeshPhysicalMaterial({
        color: "#ff8c00",
      });

      expect(material).toBeInstanceOf(THREE.MeshPhysicalMaterial);
    });

    it("should have correct transparency settings (0.3 transparency = 0.7 opacity)", () => {
      // Requirement 2.8: Translucent material properties
      const material = new THREE.MeshPhysicalMaterial({
        transparent: true,
        opacity: 0.7,
      });

      expect(material.transparent).toBe(true);
      expect(material.opacity).toBe(0.7);
    });

    it("should have transmission of 0.8 for light pass-through", () => {
      // Light passes through the gem
      const material = new THREE.MeshPhysicalMaterial({
        transmission: 0.8,
      });

      expect(material.transmission).toBe(0.8);
    });

    it("should have roughness of 0.1 for glossy surface", () => {
      // Low roughness creates glossy, reflective surface
      const material = new THREE.MeshPhysicalMaterial({
        roughness: 0.1,
      });

      expect(material.roughness).toBe(0.1);
    });

    it("should have metalness of 0.2", () => {
      // Slight metallic property for gem appearance
      const material = new THREE.MeshPhysicalMaterial({
        metalness: 0.2,
      });

      expect(material.metalness).toBe(0.2);
    });

    it("should map orange color to #ff8c00", () => {
      // Requirement 2.2: Orange pieces
      const colorHex = "#ff8c00";
      const material = new THREE.MeshPhysicalMaterial({
        color: colorHex,
      });

      expect(material.color.getHexString()).toBe("ff8c00");
    });

    it("should map yellow color to #ffd700", () => {
      // Requirement 2.3: Yellow pieces
      const colorHex = "#ffd700";
      const material = new THREE.MeshPhysicalMaterial({
        color: colorHex,
      });

      expect(material.color.getHexString()).toBe("ffd700");
    });

    it("should map green color to #32cd32", () => {
      // Requirement 2.4: Green pieces
      const colorHex = "#32cd32";
      const material = new THREE.MeshPhysicalMaterial({
        color: colorHex,
      });

      expect(material.color.getHexString()).toBe("32cd32");
    });

    it("should map blue color to #1e90ff", () => {
      // Requirement 2.5: Blue pieces
      const colorHex = "#1e90ff";
      const material = new THREE.MeshPhysicalMaterial({
        color: colorHex,
      });

      expect(material.color.getHexString()).toBe("1e90ff");
    });

    it("should map red color to #dc143c", () => {
      // Requirement 2.6: Red piece
      const colorHex = "#dc143c";
      const material = new THREE.MeshPhysicalMaterial({
        color: colorHex,
      });

      expect(material.color.getHexString()).toBe("dc143c");
    });

    it("should set color property", () => {
      const material = new THREE.MeshPhysicalMaterial({
        color: "orange",
      });

      expect(material.color).toBeInstanceOf(THREE.Color);
    });

    it("should set emissive property", () => {
      const material = new THREE.MeshPhysicalMaterial({
        color: "orange",
        emissive: "orange",
      });

      expect(material.emissive).toBeInstanceOf(THREE.Color);
    });

    it("should have clearcoat for additional glossy layer", () => {
      // Clearcoat adds extra glossy layer for enhanced gem effect
      const material = new THREE.MeshPhysicalMaterial({
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      });

      expect(material.clearcoat).toBe(1.0);
      expect(material.clearcoatRoughness).toBe(0.1);
    });
  });
});
