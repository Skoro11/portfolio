<script setup lang="ts">
import { ref, computed, watch, shallowRef, onMounted, onUnmounted } from "vue";
import { useGLTF, useAnimations } from "@tresjs/cientos";
import { useLoop, useTresContext } from "@tresjs/core";
import * as THREE from "three";
import {
  characterPositions,
  COLLISION_RADIUS,
  SHIP_SMALL_POS,
  SHIP_SMALL_REPEL_RADIUS,
} from "./useCharacterPositions";
import { swordSound, speakSound, walkSound } from "./useAudio";
import { getIslandHeight } from "./useIslandHeight";
import {
  nearHenry,
  nearBookcase,
  dialogueOpen,
  openDialogue,
  advanceDialogue,
  INTERACTION_RADIUS,
  BOOKCASE_POS,
  BOOKCASE_FRONT_DIR,
  BOOKCASE_HALF_WIDTH,
  BOOKCASE_HALF_DEPTH,
  BOOKCASE_INTERACTION_RADIUS,
  bookcaseMenuOpen,
  openBookcaseMenu,
  moveBookcaseMenu,
  selectBookcaseTopic,
} from "./useInteraction";

const { state } = useGLTF("/models/Characters_Captain_Barbarossa.gltf");

const modelRef = shallowRef();
const animations = computed(() => state.value?.animations ?? []);
const sceneObj = computed(() => state.value?.scene ?? null);
const { actions } = useAnimations(animations, sceneObj);

watch(
  actions,
  (a) => {
    if (a.Idle) a.Idle.play();
  },
  { deep: true, immediate: true },
);

const posX = ref(14.0);
const posZ = ref(13.0);
const posY = ref(getIslandHeight(14.0, 13.0));
const facingAngle = ref(0);
const SPEED = 15;

const ONE_SHOT = new Set(["Sword"]);

const keys = new Set<string>();
const onKeyDown = (e: KeyboardEvent) => {
  keys.add(e.key.toLowerCase());
  if (e.key.toLowerCase() === "j" && !ONE_SHOT.has(currentAnim)) {
    playAnim("Sword");
    swordSound.currentTime = 0;
    swordSound.play();
  }
  if (e.key.toLowerCase() === "k") {
    if (bookcaseMenuOpen.value) selectBookcaseTopic();
    else if (dialogueOpen.value) advanceDialogue();
    else if (nearHenry.value) {
      speakSound.currentTime = 0;
      speakSound.play();
      openDialogue();
    } else if (nearBookcase.value) {
      openBookcaseMenu();
    }
  }

  if (bookcaseMenuOpen.value && !e.repeat) {
    if (e.key.toLowerCase() === "arrowup" || e.key.toLowerCase() === "w") {
      moveBookcaseMenu(-1);
    } else if (
      e.key.toLowerCase() === "arrowdown" ||
      e.key.toLowerCase() === "s"
    ) {
      moveBookcaseMenu(1);
    }
  }
};
const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());

const zoom = ref(1);
const onWheel = (e: WheelEvent) => {
  zoom.value = Math.max(0.4, Math.min(8, zoom.value + e.deltaY * 0.001));
};

onMounted(() => {
  globalThis.addEventListener("keydown", onKeyDown);
  globalThis.addEventListener("keyup", onKeyUp);
  globalThis.addEventListener("wheel", onWheel);
});
onUnmounted(() => {
  globalThis.removeEventListener("keydown", onKeyDown);
  globalThis.removeEventListener("keyup", onKeyUp);
  globalThis.removeEventListener("wheel", onWheel);
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

const { camera } = useTresContext();
const CAM_OFFSET = new THREE.Vector3(0, 15, 25);
const { onBeforeRender } = useLoop();
onBeforeRender(({ delta }) => {
  let dx = 0;
  let dz = 0;
  if (!dialogueOpen.value && !bookcaseMenuOpen.value && !ONE_SHOT.has(currentAnim)) {
    if (keys.has("w") || keys.has("arrowup")) dz -= 1;
    if (keys.has("s") || keys.has("arrowdown")) dz += 1;
    if (keys.has("a") || keys.has("arrowleft")) dx -= 1;
    if (keys.has("d") || keys.has("arrowright")) dx += 1;
  }

  if (dx !== 0 || dz !== 0) {
    facingAngle.value = Math.atan2(dx, dz);
    const speed = SPEED * (keys.has("shift") ? 2 : 1);
    posX.value += dx * speed * delta;
    posZ.value += dz * speed * delta;
  }

  const cx = posX.value - characterPositions.henry.x;
  const cz = posZ.value - characterPositions.henry.z;
  const dist = Math.sqrt(cx * cx + cz * cz);

  if (dist < COLLISION_RADIUS && dist > 0) {
    posX.value = characterPositions.henry.x + (cx / dist) * COLLISION_RADIUS;
    posZ.value = characterPositions.henry.z + (cz / dist) * COLLISION_RADIUS;
  }

  nearHenry.value = dist < INTERACTION_RADIUS;

  const bx = posX.value - BOOKCASE_POS.x;
  const bz = posZ.value - BOOKCASE_POS.z;
  const bookcaseDist = Math.sqrt(bx * bx + bz * bz);

  if (Math.abs(bx) < BOOKCASE_HALF_WIDTH && Math.abs(bz) < BOOKCASE_HALF_DEPTH) {
    const overlapX = BOOKCASE_HALF_WIDTH - Math.abs(bx);
    const overlapZ = BOOKCASE_HALF_DEPTH - Math.abs(bz);
    if (overlapX < overlapZ) {
      posX.value = BOOKCASE_POS.x + Math.sign(bx || 1) * BOOKCASE_HALF_WIDTH;
    } else {
      posZ.value = BOOKCASE_POS.z + Math.sign(bz || 1) * BOOKCASE_HALF_DEPTH;
    }
  }

  const facingDot = bx * BOOKCASE_FRONT_DIR.x + bz * BOOKCASE_FRONT_DIR.z;
  nearBookcase.value = bookcaseDist < BOOKCASE_INTERACTION_RADIUS && facingDot > 0;

  const sx = posX.value - SHIP_SMALL_POS.x;
  const sz = posZ.value - SHIP_SMALL_POS.z;
  const shipDist = Math.sqrt(sx * sx + sz * sz);
  if (shipDist < SHIP_SMALL_REPEL_RADIUS && shipDist > 0) {
    posX.value = SHIP_SMALL_POS.x + (sx / shipDist) * SHIP_SMALL_REPEL_RADIUS;
    posZ.value = SHIP_SMALL_POS.z + (sz / shipDist) * SHIP_SMALL_REPEL_RADIUS;
  }

  posY.value = getIslandHeight(posX.value, posZ.value);

  characterPositions.barbarossa.x = posX.value;
  characterPositions.barbarossa.y = posY.value;
  characterPositions.barbarossa.z = posZ.value;

  if (ONE_SHOT.has(currentAnim)) {
    const act = actions[currentAnim];
    const clip = act?.getClip();
    if (clip && act && act.time >= clip.duration - 0.05) {
      currentAnim = "";
    }
  }

  const isMoving = dx !== 0 || dz !== 0;
  const isSprinting = keys.has("shift");

  if (!ONE_SHOT.has(currentAnim)) {
    playAnim(isMoving ? "Walk" : "Idle");
  }

  if (actions["Walk"]) actions["Walk"].timeScale = isSprinting ? 3 : 1.5;

  if (isMoving && walkSound.paused) walkSound.play();
  else if (!isMoving && !walkSound.paused) walkSound.pause();
  walkSound.playbackRate = isSprinting ? 2.5 : 1.5;
  const activeCam = camera.activeCamera.value;
  if (activeCam) {
    const z = zoom.value;
    activeCam.position.set(
      posX.value + CAM_OFFSET.x * z,
      posY.value + CAM_OFFSET.y * z,
      posZ.value + CAM_OFFSET.z * z,
    );
    activeCam.lookAt(posX.value, posY.value, posZ.value);
  }
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
