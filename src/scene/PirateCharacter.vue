<script setup lang="ts">
import { ref, computed, watch, shallowRef, onMounted, onUnmounted } from "vue";
import { useGLTF, useAnimations } from "@tresjs/cientos";
import { useLoop, useTresContext } from "@tresjs/core";
import * as THREE from "three";
import { characterPositions, COLLISION_RADIUS } from "./useCharacterPositions";
import { nearHenry, dialogueOpen, openDialogue, advanceDialogue, INTERACTION_RADIUS } from "./useInteraction";

const { state } = useGLTF("/models/Characters_Captain_Barbarossa.gltf");

const modelRef = shallowRef();
const animations = computed(() => state.value?.animations ?? []);
const sceneObj = computed(() => state.value?.scene ?? null);
const { actions } = useAnimations(animations, sceneObj);

watch(
  actions,
  (a) => { if (a.Idle) a.Idle.play(); },
  { deep: true, immediate: true },
);

const posX = ref(0);
const posZ = ref(0);
const posY = -14.75;
const facingAngle = ref(0);
const SPEED = 15;

const ONE_SHOT = new Set(["Sword"]);

const keys = new Set<string>();
const onKeyDown = (e: KeyboardEvent) => {
  keys.add(e.key.toLowerCase());
  if (e.key.toLowerCase() === "j") playAnim("Sword");
  if (e.key.toLowerCase() === "k") {
    if (dialogueOpen.value) advanceDialogue();
    else if (nearHenry.value) openDialogue();
  }
};
const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());
onMounted(() => {
  globalThis.addEventListener("keydown", onKeyDown);
  globalThis.addEventListener("keyup", onKeyUp);
});
onUnmounted(() => {
  globalThis.removeEventListener("keydown", onKeyDown);
  globalThis.removeEventListener("keyup", onKeyUp);
});

let currentAnim = "";
const playAnim = (name: string) => {
  if (name === currentAnim || !actions[name]) return;
  actions[currentAnim]?.fadeOut(0.2);
  const action = actions[name];
  if (ONE_SHOT.has(name)) {
    action.loop = THREE.LoopOnce;
    action.clampWhenFinished = true;
    action.timeScale = 1;
  } else if (name === "Walk") {
    action.loop = THREE.LoopRepeat;
    action.timeScale = 1.5;
  } else {
    action.loop = THREE.LoopRepeat;
    action.timeScale = 1;
  }
  action.reset().fadeIn(0.2).play();
  currentAnim = name;
};

const { controls } = useTresContext();
const { onBeforeRender } = useLoop();
onBeforeRender(({ delta }) => {
  let dx = 0;
  let dz = 0;
  if (!dialogueOpen.value) {
    if (keys.has("w") || keys.has("arrowup")) dz -= 1;
    if (keys.has("s") || keys.has("arrowdown")) dz += 1;
    if (keys.has("a") || keys.has("arrowleft")) dx -= 1;
    if (keys.has("d") || keys.has("arrowright")) dx += 1;
  }

  if (dx !== 0 || dz !== 0) {
    facingAngle.value = Math.atan2(dx, dz);
    posX.value += dx * SPEED * delta;
    posZ.value += dz * SPEED * delta;
  }

  const cx = posX.value - characterPositions.henry.x;
  const cz = posZ.value - characterPositions.henry.z;
  const dist = Math.sqrt(cx * cx + cz * cz);

  if (dist < COLLISION_RADIUS && dist > 0) {
    posX.value = characterPositions.henry.x + (cx / dist) * COLLISION_RADIUS;
    posZ.value = characterPositions.henry.z + (cz / dist) * COLLISION_RADIUS;
  }

  nearHenry.value = dist < INTERACTION_RADIUS;

  characterPositions.barbarossa.x = posX.value;
  characterPositions.barbarossa.z = posZ.value;

  if (ONE_SHOT.has(currentAnim)) {
    const act = actions[currentAnim];
    const clip = act?.getClip();
    if (clip && act && act.time >= clip.duration - 0.05) {
      currentAnim = "";
    }
  }

  if (!ONE_SHOT.has(currentAnim)) {
    playAnim(dx !== 0 || dz !== 0 ? "Walk" : "Idle");
  }

  controls.value?.target.set(posX.value, posY, posZ.value);
});
</script>

<template>
  <primitive
    v-if="state"
    ref="modelRef"
    :object="state.scene"
    :position="[posX, posY, posZ]"
    :rotation-y="facingAngle"
    :scale="3"
  />
</template>
