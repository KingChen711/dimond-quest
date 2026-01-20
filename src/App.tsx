import React, { useState, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import "./App.css";
import { createInitialGameState } from "./gameStateUtils";
import { GameState } from "./types";
import { GameBoard } from "./components/GameBoard";
import { StagingArea } from "./components/StagingArea";
import { CameraSetup } from "./components/CameraSetup";
import { DiamondPiece } from "./components/DiamondPiece";
import { ResetButton } from "./components/ResetButton";
import { PDFButtons } from "./components/PDFButtons";
import { ChallengeViewer } from "./components/ChallengeViewer";
import * as THREE from "three";

/**
 * DragHandler Component
 *
 * Handles pointer move and pointer up events during drag operations.
 * Converts pointer events to raycasting for piece position updates.
 *
 * Validates: Requirement 3.2 (Drag movement), 3.3-3.5 (Drop logic)
 */
interface DragHandlerProps {
  isDragging: boolean;
  onPointerMove: (x: number, y: number, camera: THREE.Camera) => void;
  onPointerUp: () => void;
}

function DragHandler({
  isDragging,
  onPointerMove,
  onPointerUp,
}: DragHandlerProps) {
  const { camera, gl } = useThree();

  const handlePointerMove = (event: PointerEvent) => {
    if (!isDragging) return;

    // Convert pointer position to normalized device coordinates (-1 to +1)
    const rect = gl.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    onPointerMove(x, y, camera);
  };

  const handlePointerUp = () => {
    if (isDragging) {
      onPointerUp();
    }
  };

  // Attach pointer move and pointer up listeners
  React.useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, onPointerMove, onPointerUp, camera, gl]);

  return null;
}

function App() {
  // Initialize game state with all pieces in staging area and empty board
  // Validates: Requirements 3, 5 (State management for interactions)
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);

  // Challenge/level selection state
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [showChallenges, setShowChallenges] = useState<boolean>(true);

  // Ref to track the drag plane for raycasting
  const dragPlaneRef = useRef<THREE.Plane>(
    new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
  );

  // Ref to prevent immediate re-drag after drop
  const justDroppedRef = useRef<boolean>(false);

  /**
   * Updates the position of the dragged piece during drag operation
   * Uses raycasting onto horizontal plane at board height
   *
   * @param pointerX - Normalized pointer X coordinate (-1 to 1)
   * @param pointerY - Normalized pointer Y coordinate (-1 to 1)
   * @param camera - Three.js camera for raycasting
   *
   * Validates: Requirement 3.2 (Drag movement)
   */
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
        const hoveredSlot = detectHoveredSlot(
          intersectionPoint,
          prevState.slots,
        );

        return {
          ...prevState,
          pieces: updatedPieces,
          hoveredSlot: hoveredSlot ? hoveredSlot.id : null,
        };
      });
    }
  };

  /**
   * Detects which slot (if any) is being hovered during drag
   * Uses distance-based detection with a threshold (only x and z coordinates)
   *
   * @param position - Current cursor position on the plane
   * @param slots - Array of board slots
   * @returns The hovered slot or null
   */
  const detectHoveredSlot = (
    position: THREE.Vector3,
    slots: typeof gameState.slots,
  ) => {
    const hoverThreshold = 0.8; // Increased threshold for easier dropping

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

  /**
   * Places a piece on a board slot
   * Updates both piece and slot state bidirectionally
   *
   * @param pieceId - ID of the piece to place
   * @param slotId - ID of the slot to place the piece in
   *
   * Validates: Requirement 3.3 (Piece placement)
   */
  const placePiece = (pieceId: string, slotId: string) => {
    setGameState((prevState) => {
      // Find the piece and slot
      const piece = prevState.pieces.find((p) => p.id === pieceId);
      const slot = prevState.slots.find((s) => s.id === slotId);

      // Validate piece and slot exist
      if (!piece || !slot) {
        console.error("Invalid piece or slot ID");
        return prevState;
      }

      // Validate slot is not occupied (Requirement 3.5)
      if (slot.occupied) {
        console.error("Slot is already occupied");
        return prevState;
      }

      // Update piece state
      const updatedPieces = prevState.pieces.map((p) => {
        if (p.id === pieceId) {
          return {
            ...p,
            position: slot.position.clone(),
            slotId: slotId,
          };
        }
        return p;
      });

      // Update slot state
      const updatedSlots = prevState.slots.map((s) => {
        if (s.id === slotId) {
          return {
            ...s,
            occupied: true,
            pieceId: pieceId,
          };
        }
        return s;
      });

      return {
        ...prevState,
        pieces: updatedPieces,
        slots: updatedSlots,
      };
    });
  };

  /**
   * Removes a piece from a board slot and returns it to staging area
   * Clears the slot and resets piece position
   *
   * @param pieceId - ID of the piece to remove
   *
   * Validates: Requirement 3.6 (Remove piece from slot)
   */
  const removePiece = (pieceId: string) => {
    setGameState((prevState) => {
      // Find the piece
      const piece = prevState.pieces.find((p) => p.id === pieceId);

      if (!piece) {
        console.error("Invalid piece ID");
        return prevState;
      }

      // If piece is not on a slot, nothing to do
      if (!piece.slotId) {
        return prevState;
      }

      // Update piece state - return to staging position
      const updatedPieces = prevState.pieces.map((p) => {
        if (p.id === pieceId) {
          return {
            ...p,
            position: p.stagingPosition.clone(),
            slotId: null,
          };
        }
        return p;
      });

      // Update slot state - clear the slot
      const updatedSlots = prevState.slots.map((s) => {
        if (s.pieceId === pieceId) {
          return {
            ...s,
            occupied: false,
            pieceId: null,
          };
        }
        return s;
      });

      return {
        ...prevState,
        pieces: updatedPieces,
        slots: updatedSlots,
      };
    });
  };

  /**
   * Resets the entire board to initial state
   * Removes all pieces from slots and returns them to staging area
   *
   * Validates: Requirements 5.1-5.3 (Reset functionality)
   */
  const resetBoard = () => {
    setGameState((prevState) => {
      // Reset all pieces to staging positions
      const resetPieces = prevState.pieces.map((piece) => ({
        ...piece,
        position: piece.stagingPosition.clone(),
        slotId: null,
      }));

      // Clear all slots
      const resetSlots = prevState.slots.map((slot) => ({
        ...slot,
        occupied: false,
        pieceId: null,
      }));

      return {
        ...prevState,
        pieces: resetPieces,
        slots: resetSlots,
        draggedPiece: null,
        hoveredSlot: null,
        hoveredPiece: null,
      };
    });
  };

  /**
   * Initiates a drag operation on a piece
   * Sets draggedPiece state and clears slot if piece was on board
   *
   * @param pieceId - ID of the piece to start dragging
   *
   * Validates: Requirements 3.1, 3.6 (Drag initiation)
   */
  const startDrag = (pieceId: string) => {
    // Prevent immediate re-drag after drop
    if (justDroppedRef.current) {
      justDroppedRef.current = false;
      return;
    }

    setGameState((prevState) => {
      // Find the piece
      const piece = prevState.pieces.find((p) => p.id === pieceId);

      if (!piece) {
        console.error("Invalid piece ID");
        return prevState;
      }

      // Store original position for potential return on invalid drop
      const originalPosition = piece.position.clone();

      // If piece is on a slot, clear the slot (Requirement 3.6)
      let updatedSlots = prevState.slots;
      if (piece.slotId) {
        updatedSlots = prevState.slots.map((s) => {
          if (s.id === piece.slotId) {
            return {
              ...s,
              occupied: false,
              pieceId: null,
            };
          }
          return s;
        });
      }

      // Elevate piece (y += 1.0) for visual feedback
      const updatedPieces = prevState.pieces.map((p) => {
        if (p.id === pieceId) {
          return {
            ...p,
            position: p.position.clone().setY(p.position.y + 1.0),
            slotId: null, // Clear slot reference when dragging starts
            // Store original position in a temporary property for drop validation
            originalPosition: originalPosition,
          } as any; // Type assertion needed for temporary property
        }
        return p;
      });

      return {
        ...prevState,
        pieces: updatedPieces,
        slots: updatedSlots,
        draggedPiece: pieceId,
      };
    });
  };

  /**
   * Ends a drag operation and handles drop logic
   * Snaps piece to slot if valid, otherwise returns to original position
   *
   * Validates: Requirements 3.3, 3.4, 3.5 (Drop placement and validation)
   */
  const endDrag = () => {
    setGameState((prevState) => {
      if (!prevState.draggedPiece) {
        return prevState;
      }

      const draggedPiece = prevState.pieces.find(
        (p) => p.id === prevState.draggedPiece,
      );
      const hoveredSlot = prevState.slots.find(
        (s) => s.id === prevState.hoveredSlot,
      );

      if (!draggedPiece) {
        return prevState;
      }

      // Check if drop is valid: hoveredSlot exists and is unoccupied
      const isValidDrop = hoveredSlot && !hoveredSlot.occupied;

      let updatedPieces = prevState.pieces;
      let updatedSlots = prevState.slots;

      if (isValidDrop && hoveredSlot) {
        // Valid drop: snap piece to slot position
        updatedPieces = prevState.pieces.map((p) => {
          if (p.id === prevState.draggedPiece) {
            return {
              ...p,
              position: hoveredSlot.position.clone(),
              slotId: hoveredSlot.id,
            };
          }
          return p;
        });

        // Update slot state bidirectionally
        updatedSlots = prevState.slots.map((s) => {
          if (s.id === hoveredSlot.id) {
            return {
              ...s,
              occupied: true,
              pieceId: prevState.draggedPiece,
            };
          }
          return s;
        });

        // Set flag to prevent immediate re-drag
        justDroppedRef.current = true;
        setTimeout(() => {
          justDroppedRef.current = false;
        }, 100);
      } else {
        // Invalid drop: return piece to original position (staging area)
        updatedPieces = prevState.pieces.map((p) => {
          if (p.id === prevState.draggedPiece) {
            return {
              ...p,
              position: p.stagingPosition.clone(),
              slotId: null,
            };
          }
          return p;
        });

        // Set flag to prevent immediate re-drag after returning to staging
        justDroppedRef.current = true;
        setTimeout(() => {
          justDroppedRef.current = false;
        }, 100);
      }

      // Clear drag state
      return {
        ...prevState,
        pieces: updatedPieces,
        slots: updatedSlots,
        draggedPiece: null,
        hoveredSlot: null,
      };
    });
  };

  return (
    <div className="app-container">
      {/* UI Overlays */}
      {showChallenges && (
        <ChallengeViewer
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
        />
      )}
      <PDFButtons />
      <ResetButton onReset={resetBoard} />
      <button
        onClick={() => setShowChallenges(!showChallenges)}
        style={{
          position: "fixed",
          left: "20px",
          bottom: "20px",
          padding: "10px 20px",
          background: "#4a90e2",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
          zIndex: 100,
        }}
      >
        {showChallenges ? "Hide" : "Show"} Challenges
      </button>

      <Canvas
        camera={{
          position: [0, 18, 5],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
      >
        {/* Drag handler component for pointer move and pointer up events */}
        <DragHandler
          isDragging={gameState.draggedPiece !== null}
          onPointerMove={updateDragPosition}
          onPointerUp={endDrag}
        />

        {/* Camera setup - points camera at board center (0, 0, 0) */}
        <CameraSetup />

        {/* Ambient lighting for base illumination - much brighter */}
        <ambientLight intensity={1.5} color="#ffffff" />

        {/* Directional lighting for depth - very bright, no shadows */}
        <directionalLight position={[5, 20, 5]} intensity={2.0} />

        {/* Point light for accent lighting and gem sparkle - bright */}
        <pointLight position={[-5, 10, -5]} intensity={1.0} />

        {/* Additional fill light from the front - bright */}
        <pointLight position={[0, 8, 15]} intensity={1.0} />

        {/* Top light for overall brightness */}
        <pointLight position={[0, 20, 0]} intensity={1.5} />

        {/* GameBoard component - cross-shaped board at scene center */}
        <GameBoard
          slots={gameState.slots}
          hoveredSlot={gameState.hoveredSlot}
        />

        {/* StagingArea component - displays pieces not on the board */}
        <StagingArea
          pieces={gameState.pieces}
          hoveredPiece={gameState.hoveredPiece}
          draggedPiece={gameState.draggedPiece}
          onPieceClick={startDrag}
        />

        {/* Render pieces that are on the board */}
        <group name="board-pieces">
          {gameState.pieces
            .filter((piece) => piece.slotId !== null)
            .map((piece) => (
              <DiamondPiece
                key={piece.id}
                piece={piece}
                isHovered={gameState.hoveredPiece === piece.id}
                isDragged={gameState.draggedPiece === piece.id}
                onClick={startDrag}
              />
            ))}
        </group>

        {/* Ground plane - no shadows */}
        <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#808080" />
        </mesh>
      </Canvas>
    </div>
  );
}

export default App;
