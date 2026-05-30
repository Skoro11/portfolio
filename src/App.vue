<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import { OrbitControls } from "@tresjs/cientos";
import Floor from "./scene/Floor.vue";
import MovableBox from "./scene/MovableBox.vue";

const MAX_POLAR = Math.PI / 2 - 0.05;
</script>

<template>
  <div class="h-screen w-full">
    <TresCanvas clear-color="#87CEEB">
      <TresPerspectiveCamera :position="[0, 5, 15]" />
      <OrbitControls :target="[0, -14.75, 0]" :max-polar-angle="MAX_POLAR" />
      <TresAmbientLight :intensity="1" />
      <TresDirectionalLight :position="[10, 20, 10]" :intensity="2" />
      <Floor />
      <MovableBox />
    </TresCanvas>
  </div>
</template>
