<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import { OrbitControls } from "@tresjs/cientos";
import KranGrafik from "./kran/KranGrafik.vue";
import Floor from "./scene/Floor.vue";
</script>

<template>
  <div class="relative h-screen w-full overflow-hidden bg-gray-100">
    <!-- Teleport target for component overlays — pointer-events-none so it doesn't block OrbitControls -->
    <div id="scene-overlay" class="absolute inset-0 z-10 pointer-events-none" />
    <TresCanvas clear-color="#e0e0e0">
      <TresPerspectiveCamera :position="[10, 10, 10]" :lookAt="[0, 0, 0]" />
      <OrbitControls />
      <Floor />
      <KranGrafik />
    </TresCanvas>
  </div>
</template>
