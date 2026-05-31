// Mirrors Floor.vue vertex shader dome math exactly.
const RADIUS     = 225;
const MAX_HEIGHT = 12;
const FLOOR_Y    = -15;
const OCEAN_FLOOR = -25;

function smoothstep(e0: number, e1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

export function getIslandHeight(worldX: number, worldZ: number): number {
  const dist = Math.sqrt(worldX * worldX + worldZ * worldZ);
  const normalizedDist = dist / RADIUS;

  // Island dome — reaches 0 exactly at normalizedDist = 1 (edge)
  const dome = Math.max(0, 1 - normalizedDist * normalizedDist) * MAX_HEIGHT;
  const islandY = FLOOR_Y + dome;

  if (normalizedDist < 1) return islandY;

  // Gets deeper the further from shore — bottoms out at OCEAN_FLOOR
  const depth = Math.min(1, (normalizedDist - 1) / 0.6);
  const t = smoothstep(0, 0.08, normalizedDist - 1);
  return FLOOR_Y + t * depth * (OCEAN_FLOOR - FLOOR_Y);
}
