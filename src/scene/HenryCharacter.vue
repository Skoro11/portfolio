<script setup lang="ts">
import { ref, computed, watch, shallowRef } from "vue";
import { useGLTF, useAnimations } from "@tresjs/cientos";
import { characterPositions } from "./useCharacterPositions";

const { state } = useGLTF("/models/Characters_Henry.gltf");

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

const posX = ref(characterPositions.henry.x);
const posZ = ref(characterPositions.henry.z);
const posY = -14.75;
const facingAngle = ref(0);
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
