import { reactive } from "vue";

export const characterPositions = reactive({
  barbarossa: { x: 0, z: 0 },
  henry: { x: -210, z: 10 },
});

export const COLLISION_RADIUS = 4;

export const SHIP_SMALL_POS = { x: -240, z: 0 };
export const SHIP_SMALL_REPEL_RADIUS = 15;
