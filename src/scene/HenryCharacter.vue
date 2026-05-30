<script setup lang="ts">
import { ref, computed, watch, shallowRef } from "vue";
import { useGLTF, useAnimations, Html } from "@tresjs/cientos";
import { characterPositions } from "./useCharacterPositions";
import { nearHenry, dialogueOpen } from "./useInteraction";

const { state } = useGLTF("/models/Characters_Henry.gltf");

const modelRef = shallowRef();
const animations = computed(() => state.value?.animations ?? []);
const sceneObj = computed(() => state.value?.scene ?? null);
const { actions } = useAnimations(animations, sceneObj);

watch(
  actions,
  (a) => { if (a.Idle) a.Idle.play(); },
  { deep: true, immediate: true },
);

const posX = ref(characterPositions.henry.x);
const posZ = ref(characterPositions.henry.z);
const posY = -14.75;
const facingAngle = ref(0);
</script>

<template>
  <TresGroup>
    <primitive
      v-if="state"
      ref="modelRef"
      :object="state.scene"
      :position="[posX, posY, posZ]"
      :rotation-y="facingAngle"
      :scale="3"
    />

    <TresMesh :position="[posX, posY + 0.01, posZ]" :rotation-x="-Math.PI / 2">
      <TresCircleGeometry :args="[6, 64]" />
      <TresMeshBasicMaterial color="#4488ff" :transparent="true" :opacity="0.25" />
    </TresMesh>

    <Html
      v-if="nearHenry && !dialogueOpen"
      :position="[posX, posY + 7, posZ]"
      center
    >
      <div class="head-prompt">Press K to talk to Omar</div>
    </Html>
  </TresGroup>

</template>

<style>
.head-prompt {
  background: rgba(10, 10, 20, 0.85);
  border: 1px solid rgba(100, 160, 255, 0.5);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  white-space: nowrap;
  pointer-events: none;
  animation: prompt-appear 0.1s 0.05s both;
}

@keyframes prompt-appear {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.hud {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 160px;
  background: white;
  z-index: 9999;
}

.dialogue {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  background: rgba(10, 10, 20, 0.92);
  border: 1px solid rgba(100, 160, 255, 0.35);
  border-radius: 12px;
  padding: 20px 24px 16px;
  color: white;
  pointer-events: none;
}

.dialogue-name {
  font-size: 12px;
  font-weight: 600;
  color: #88bbff;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.dialogue-text {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 8px;
}

.dialogue-hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}
</style>
