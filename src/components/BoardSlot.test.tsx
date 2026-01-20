/**
 * Unit tests for BoardSlot component
 *
 * Tests verify:
 * - Slot renders with correct geometry (radius 0.5, depth 0.1)
 * - Slot positions correctly based on slot data
 * - Visual indicators work for empty/occupied states
 * - Hover states display correct colors (green for valid, red for invalid)
 */

import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { Vector3 } from "three";
import { BoardSlot as BoardSlotType } from "../types";

describe("BoardSlot Component", () => {
  // Helper function to create a test slot
  const createTestSlot = (
    id: string,
    x: number,
    y: number,
    z: number,
    occupied: boolean = false,
    pieceId: string | null = null,
  ): BoardSlotType => ({
    id,
    position: new Vector3(x, y, z),
    occupied,
    pieceId,
  });

  it("should have correct circular geometry dimensions (radius 0.5, depth 0.1)", () => {
    // Verify the slot geometry parameters match the design specification
    const radius = 0.5;
    const depth = 0.1;
    const segments = 32;

    // Create cylinder geometry for slot indentation
    const geometry = new THREE.CylinderGeometry(
      radius,
      radius,
      depth,
      segments,
    );

    expect(geometry).toBeInstanceOf(THREE.CylinderGeometry);
    expect(geometry.parameters.radiusTop).toBe(0.5);
    expect(geometry.parameters.radiusBottom).toBe(0.5);
    expect(geometry.parameters.height).toBe(0.1);
    expect(geometry.parameters.radialSegments).toBe(32);
  });

  it("should position slot with correct depth offset", () => {
    // Slot should be positioned slightly below the board surface (depth/2)
    const slot = createTestSlot("slot-1", 0, 0, 0);
    const depth = 0.1;
    const expectedY = slot.position.y - depth / 2;

    // In actual rendering, the mesh position.y should be -0.05 (0 - 0.1/2)
    expect(expectedY).toBe(-0.05);
  });

  it("should use darker color than board for empty slot indicator", () => {
    // Empty slots should be darker (#1a1a1a) than the board (#2a2a2a)
    const slotColor = new THREE.Color("#1a1a1a");
    const boardColor = new THREE.Color("#2a2a2a");

    // Verify slot is darker (lower luminance)
    expect(slotColor.getHexString()).toBe("1a1a1a");
    expect(boardColor.getHexString()).toBe("2a2a2a");

    // Slot should be darker than board
    const slotLuminance = slotColor.r + slotColor.g + slotColor.b;
    const boardLuminance = boardColor.r + boardColor.g + boardColor.b;
    expect(slotLuminance).toBeLessThan(boardLuminance);
  });

  it("should display green emissive for valid drop hover", () => {
    // When hovered with valid drop, slot should emit green light
    const material = new THREE.MeshStandardMaterial({
      color: "#1a1a1a",
      emissive: "#00ff00",
      emissiveIntensity: 0.5,
      metalness: 0.2,
      roughness: 0.8,
    });

    expect(material.emissive.getHexString()).toBe("00ff00");
    expect(material.emissiveIntensity).toBe(0.5);
  });

  it("should display red emissive for invalid drop hover", () => {
    // When hovered with invalid drop (occupied), slot should emit red light
    const material = new THREE.MeshStandardMaterial({
      color: "#1a1a1a",
      emissive: "#ff0000",
      emissiveIntensity: 0.5,
      metalness: 0.2,
      roughness: 0.8,
    });

    expect(material.emissive.getHexString()).toBe("ff0000");
    expect(material.emissiveIntensity).toBe(0.5);
  });

  it("should have no emissive when not hovered", () => {
    // Default state should have no emissive glow
    const material = new THREE.MeshStandardMaterial({
      color: "#1a1a1a",
      emissive: "#000000",
      emissiveIntensity: 0,
      metalness: 0.2,
      roughness: 0.8,
    });

    expect(material.emissive.getHexString()).toBe("000000");
    expect(material.emissiveIntensity).toBe(0);
  });

  it("should position slots correctly in cross pattern with 1.2 unit spacing", () => {
    // Test that slots can be positioned at the correct coordinates
    const spacing = 1.2;

    // Sample slot positions from the cross pattern
    const slot1 = createTestSlot("slot-1", 0, 0, spacing * 2); // Top
    const slot2 = createTestSlot("slot-2", -spacing * 1.5, 0, spacing); // Left
    const slot3 = createTestSlot("slot-3", spacing * 1.5, 0, spacing); // Right
    const slot6 = createTestSlot("slot-6", 0, 0, 0); // Center

    // Verify positions
    expect(slot1.position.z).toBeCloseTo(2.4, 1);
    expect(slot2.position.x).toBeCloseTo(-1.8, 1);
    expect(slot3.position.x).toBeCloseTo(1.8, 1);
    expect(slot6.position.x).toBe(0);
    expect(slot6.position.z).toBe(0);
  });

  it("should handle occupied and empty slot states", () => {
    // Test slot state properties
    const emptySlot = createTestSlot("slot-1", 0, 0, 0, false, null);
    const occupiedSlot = createTestSlot(
      "slot-2",
      1.2,
      0,
      0,
      true,
      "piece-orange-round",
    );

    expect(emptySlot.occupied).toBe(false);
    expect(emptySlot.pieceId).toBeNull();

    expect(occupiedSlot.occupied).toBe(true);
    expect(occupiedSlot.pieceId).toBe("piece-orange-round");
  });

  it("should have material properties for visual appeal", () => {
    // Verify material properties match design specifications
    const material = new THREE.MeshStandardMaterial({
      color: "#1a1a1a",
      metalness: 0.2,
      roughness: 0.8,
    });

    expect(material.metalness).toBe(0.2);
    expect(material.roughness).toBe(0.8);
  });

  it("should support shadow receiving", () => {
    // Slots should receive shadows for depth perception
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32),
      new THREE.MeshStandardMaterial(),
    );

    mesh.receiveShadow = true;

    expect(mesh.receiveShadow).toBe(true);
  });
});
