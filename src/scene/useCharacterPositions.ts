import { reactive } from "vue";

export const characterPositions = reactive({
  barbarossa: { x: 0, z: 0 },
  henry: { x: 8, z: 0 },
});

export const COLLISION_RADIUS = 4;
