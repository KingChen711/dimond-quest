/**
 * Manual verification script for initial game state
 * This file can be run to inspect the generated state
 */

import { createInitialGameState } from "./gameStateUtils";

const gameState = createInitialGameState();

console.log("=== Initial Game State ===\n");

console.log(`Total Pieces: ${gameState.pieces.length}`);
console.log(`Total Slots: ${gameState.slots.length}\n`);

console.log("=== Piece Distribution ===");
const colorCounts: Record<string, number> = {};
const shapeCounts: Record<string, number> = {};

gameState.pieces.forEach((piece) => {
  colorCounts[piece.color] = (colorCounts[piece.color] || 0) + 1;
  shapeCounts[piece.shape] = (shapeCounts[piece.shape] || 0) + 1;
});

console.log("Colors:", colorCounts);
console.log("Shapes:", shapeCounts);

console.log("\n=== Pieces by Color ===");
["orange", "yellow", "green", "blue", "red"].forEach((color) => {
  const pieces = gameState.pieces.filter((p) => p.color === color);
  console.log(
    `${color}: ${pieces.map((p) => p.shape).join(", ")} (${pieces.length})`,
  );
});

console.log("\n=== Board Slots (Cross Pattern) ===");
gameState.slots.forEach((slot) => {
  console.log(
    `${slot.id}: (${slot.position.x.toFixed(1)}, ${slot.position.y.toFixed(1)}, ${slot.position.z.toFixed(1)})`,
  );
});

console.log("\n=== Staging Area Pieces ===");
gameState.pieces.forEach((piece) => {
  console.log(
    `${piece.id}: (${piece.position.x.toFixed(1)}, ${piece.position.y.toFixed(1)}, ${piece.position.z.toFixed(1)})`,
  );
});
