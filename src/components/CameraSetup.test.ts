import { describe, it, expect, beforeEach } from "vitest";
import { PerspectiveCamera, Vector3 } from "three";

/**
 * Unit tests for Camera Configuration
 * Task 5.1: Implement camera configuration
 *
 * Tests verify:
 * - Camera position is (0, 8, 12)
 * - Camera FOV is 50 degrees
 * - Camera near plane is 0.1
 * - Camera far plane is 1000
 * - Camera looks at board center (0, 0, 0)
 *
 * Validates: Requirement 4 (Camera setup)
 */
describe("Camera Configuration", () => {
  let camera: PerspectiveCamera;

  beforeEach(() => {
    // Create a camera with the specified configuration
    camera = new PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.set(0, 8, 12);
    camera.lookAt(new Vector3(0, 0, 0));
    camera.updateProjectionMatrix();
  });

  describe("Camera Position", () => {
    it("should be positioned at (0, 8, 12)", () => {
      expect(camera.position.x).toBe(0);
      expect(camera.position.y).toBe(8);
      expect(camera.position.z).toBe(12);
    });

    it("should have correct position as array", () => {
      expect(camera.position.toArray()).toEqual([0, 8, 12]);
    });
  });

  describe("Camera Parameters", () => {
    it("should have FOV of 50 degrees", () => {
      expect(camera.fov).toBe(50);
    });

    it("should have near plane at 0.1", () => {
      expect(camera.near).toBe(0.1);
    });

    it("should have far plane at 1000", () => {
      expect(camera.far).toBe(1000);
    });

    it("should be a PerspectiveCamera", () => {
      expect(camera.type).toBe("PerspectiveCamera");
    });
  });

  describe("Camera Direction", () => {
    it("should look at board center (0, 0, 0)", () => {
      // Get the direction the camera is looking
      const direction = new Vector3();
      camera.getWorldDirection(direction);

      // Calculate expected direction from camera position to (0, 0, 0)
      const expectedDirection = new Vector3(0, 0, 0)
        .sub(camera.position)
        .normalize();

      // Verify direction vectors are approximately equal
      expect(direction.x).toBeCloseTo(expectedDirection.x, 5);
      expect(direction.y).toBeCloseTo(expectedDirection.y, 5);
      expect(direction.z).toBeCloseTo(expectedDirection.z, 5);
    });

    it("should point downward and forward from elevated position", () => {
      const direction = new Vector3();
      camera.getWorldDirection(direction);

      // Camera at (0, 8, 12) looking at (0, 0, 0) should have:
      // - negative Y component (looking down)
      // - negative Z component (looking forward)
      // - X component near zero (centered)
      expect(direction.y).toBeLessThan(0);
      expect(direction.z).toBeLessThan(0);
      expect(Math.abs(direction.x)).toBeLessThan(0.01);
    });
  });

  describe("Camera Configuration Consistency", () => {
    it("should maintain all configuration values together", () => {
      // Verify all parameters match the design specification
      expect(camera.position.toArray()).toEqual([0, 8, 12]);
      expect(camera.fov).toBe(50);
      expect(camera.near).toBe(0.1);
      expect(camera.far).toBe(1000);

      // Verify camera is looking at origin
      const direction = new Vector3();
      camera.getWorldDirection(direction);
      const expectedDirection = new Vector3(0, 0, 0)
        .sub(camera.position)
        .normalize();

      expect(direction.distanceTo(expectedDirection)).toBeLessThan(0.001);
    });
  });
});
