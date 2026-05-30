<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useLoop, useTresContext } from "@tresjs/core";

const posX = ref(0);
const posY = ref(-14.5);
const posZ = ref(0);
const SPEED = 5;
const GRAVITY = -20;
const JUMP_FORCE = 8;
const GROUND_Y = -14.5;
let velY = 0;

const keys = new Set<string>();
const onKeyDown = (e: KeyboardEvent) => keys.add(e.key.toLowerCase());
const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());

onMounted(() => {
  globalThis.addEventListener("keydown", onKeyDown);
  globalThis.addEventListener("keyup", onKeyUp);
});
onUnmounted(() => {
  globalThis.removeEventListener("keydown", onKeyDown);
  globalThis.removeEventListener("keyup", onKeyUp);
});

const { onBeforeRender } = useLoop();
onBeforeRender(({ delta }) => {
  if (keys.has("w") || keys.has("arrowup")) posZ.value -= SPEED * delta;
  if (keys.has("s") || keys.has("arrowdown")) posZ.value += SPEED * delta;
  if (keys.has("a") || keys.has("arrowleft")) posX.value -= SPEED * delta;
  if (keys.has("d") || keys.has("arrowright")) posX.value += SPEED * delta;

  const onGround = posY.value <= GROUND_Y;
  if (keys.has(" ") && onGround) velY = JUMP_FORCE;

  velY += GRAVITY * delta;
  posY.value += velY * delta;

  if (posY.value < GROUND_Y) {
    posY.value = GROUND_Y;
    velY = 0;
  }
});
</script>

<template>
  <TresMesh :position="[posX, posY, posZ]">
    <TresBoxGeometry :args="[1, 0.5, 1]" />
    <TresMeshStandardMaterial color="red" />
  </TresMesh>
</template>
