import { OrbitControls } from "@react-three/drei";

/**
 * CameraSetup component
 * Configures the camera with OrbitControls for interactive rotation and zoom
 *
 * The camera is already positioned at (0, 8, 12) with FOV 50, near 0.1, far 1000
 * via the Canvas camera prop. This component adds OrbitControls for user interaction.
 *
 * Features:
 * - Right mouse drag for rotation
 * - Mouse wheel for zoom
 * - Distance constraints: min 8, max 25 units
 * - Polar angle constraints: 15° to 85° (prevents upside-down and flat views)
 * - Damping enabled with factor 0.05 for smooth motion
 *
 * Validates: Requirements 4.1-4.5 (Camera controls and constraints)
 */
export function CameraSetup() {
  return (
    <OrbitControls
      // Use right mouse button (button 2) for rotation to leave left button for dragging
      mouseButtons={{
        LEFT: undefined, // Disable left button for orbit controls
        MIDDLE: undefined,
        RIGHT: 2, // Use right button for rotation
      }}
      // Enable rotation with right mouse drag
      enableRotate={true}
      // Enable zoom with mouse wheel (default behavior)
      enableZoom={true}
      // Disable panning to maintain board-centric view
      enablePan={false}
      // Distance constraints to prevent clipping and maintain visibility
      minDistance={8}
      maxDistance={25}
      // Polar angle constraints (in radians)
      // min: 15° = 0.2618 radians (prevents flat top-down view)
      // max: 85° = 1.4835 radians (prevents upside-down view)
      minPolarAngle={Math.PI / 12} // 15 degrees
      maxPolarAngle={(85 * Math.PI) / 180} // 85 degrees
      // Enable damping for smooth, inertial motion
      enableDamping={true}
      dampingFactor={0.05}
      // Target is board center (0, 0, 0) by default
      target={[0, 0, 0]}
    />
  );
}
