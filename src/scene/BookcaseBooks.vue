<script setup lang="ts">
import { shallowRef, onMounted } from "vue";
import * as THREE from "three";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { Html } from "@tresjs/cientos";
import {
  nearBookcase,
  dialogueOpen,
  bookcaseMenuOpen,
  BOOKCASE_INTERACTION_RADIUS,
} from "./useInteraction";

const props = defineProps<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}>();

const model = shallowRef<THREE.Object3D | null>(null);

onMounted(() => {
  const mtlLoader = new MTLLoader();
  mtlLoader.setPath("/models/");
  mtlLoader.load("Bookcase_Books.mtl", (materials) => {
    materials.preload();
    Object.values(materials.materials).forEach((mat) => {
      const m = mat as THREE.MeshPhongMaterial;
      m.color.convertLinearToSRGB();
    });
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath("/models/");
    objLoader.load("Bookcase_Books.obj", (obj) => {
      model.value = obj;
    });
  });
});
</script>

<template>
  <TresGroup :position="props.position ?? [0, 0, 0]">
    <primitive
      v-if="model"
      :object="model"
      :rotation="props.rotation ?? [0, 0, 0]"
      :scale="props.scale ?? 1"
    />

    <TresMesh :position="[0, 0.01, 0]" :rotation-x="-Math.PI / 2">
      <TresCircleGeometry
        :args="[BOOKCASE_INTERACTION_RADIUS, 64, Math.PI, Math.PI]"
      />
      <TresMeshBasicMaterial
        color="#4488ff"
        :transparent="true"
        :opacity="0.25"
      />
    </TresMesh>

    <Html
      v-if="nearBookcase && !dialogueOpen && !bookcaseMenuOpen"
      :position="[0, 18, 0]"
      center
    >
      <div class="head-prompt">Press K to look at the bookshelf</div>
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
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
