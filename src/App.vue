<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import { OrbitControls } from "@tresjs/cientos";
import Floor from "./scene/Floor.vue";
import PirateCharacter from "./scene/PirateCharacter.vue";
import HenryCharacter from "./scene/HenryCharacter.vue";
import { dialogueOpen, dialogueIndex, dialogue } from "./scene/useInteraction";
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
      <PirateCharacter />
      <HenryCharacter />
    </TresCanvas>

    <div v-if="dialogueOpen" class="fixed bottom-0 left-0 right-0 h-20 bg-white z-9999 flex items-center px-6 gap-4">
      <div class="flex flex-col gap-1 flex-1">
        <span
          class="text-xs font-semibold uppercase tracking-wider"
          :class="dialogue[dialogueIndex].speaker === 'Omar' ? 'text-blue-400' : 'text-red-400'"
        >
          {{ dialogue[dialogueIndex].speaker }}
        </span>
        <p class="text-sm text-gray-800">{{ dialogue[dialogueIndex].line }}</p>
      </div>
      <span class="text-xs text-gray-400 shrink-0">
        {{ dialogueIndex < dialogue.length - 1 ? "Press K to continue" : "Press K to close" }}
      </span>
    </div>
  </div>
</template>
