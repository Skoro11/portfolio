<script setup lang="ts">
import { ref, onMounted } from "vue";
import { TresCanvas } from "@tresjs/core";
import { Ocean } from "@tresjs/cientos";
import Floor from "./scene/Floor.vue";
import PirateCharacter from "./scene/PirateCharacter.vue";
import HenryCharacter from "./scene/HenryCharacter.vue";
import { dialogueOpen, dialogueIndex, dialogue } from "./scene/useInteraction";
import { swordSound } from "./scene/useAudio";
import ShipBig from "./scene/ShipBig.vue";
import ShipSmall from "./scene/ShipSmall.vue";
import VueLogo from "./scene/VueLogo.vue";
import PythonLogo from "./scene/PythonLogo.vue";
import TailwindLogo from "./scene/TailwindLogo.vue";
import GitLogo from "./scene/GitLogo.vue";
const bgMusic = new Audio("/sound/background.wav");
bgMusic.loop = true;
bgMusic.volume = 0.01;
onMounted(() => {
  bgMusic.play().catch(() => {
    const start = () => {
      bgMusic.play();
      document.removeEventListener("click", start);
    };
    document.addEventListener("click", start);
  });
});

const bgVolume = ref(1);
const swordVolume = ref(100);

const onBgVolume = (e: Event) => {
  const v = +(e.target as HTMLInputElement).value;
  bgVolume.value = v;
  bgMusic.volume = v / 100;
};
const onSwordVolume = (e: Event) => {
  const v = +(e.target as HTMLInputElement).value;
  swordVolume.value = v;
  swordSound.volume = v / 100;
};

const sidebarOpen = ref(false);
</script>

<template>
  <div class="h-screen w-full">
    <TresCanvas clear-color="#87CEEB">
      <TresPerspectiveCamera :position="[0, 5, 15]" />
      <TresAmbientLight :intensity="1" />
      <TresDirectionalLight :position="[10, 20, 10]" :intensity="2" />
      <Floor />
      <Ocean
        :position="[0, -15.2, 0]"
        :width="600"
        :height="600"
        water-color="#006994"
        :distortion-scale="3.7"
        :speed="0.4"
      />
      <ShipBig />
      <ShipSmall />
      <VueLogo :rotation="[0, 1, 0]" :position="[-10, 1, 0]" :scale="2.5" />
      <PythonLogo :position="[0, -3, 0]" :scale="0.1" />
      <TailwindLogo
        :rotation="[0, -1.1, 0]"
        :position="[35, 1.9, 2]"
        :scale="0.012"
      />
      <GitLogo
        :rotation="[0, Math.PI, Math.PI]"
        :position="[15, 4, -15]"
        :scale="0.07"
      />
      <PirateCharacter />
      <HenryCharacter />
    </TresCanvas>

    <!-- Sidebar toggle -->
    <button
      class="fixed top-4 right-4 z-9999 bg-black/70 text-white text-xs px-3 py-2 rounded hover:bg-black"
      @click="sidebarOpen = !sidebarOpen"
    >
      🔊 Audio
    </button>

    <!-- Sidebar -->
    <div
      v-if="sidebarOpen"
      class="fixed top-14 right-4 z-9999 bg-black/80 text-white rounded-xl p-5 flex flex-col gap-4 w-52"
    >
      <p class="text-xs font-bold uppercase tracking-widest text-white/60">
        Audio
      </p>

      <div class="flex flex-col gap-1">
        <label class="text-xs">Background music</label>
        <input
          type="range"
          min="0"
          max="100"
          :value="bgVolume"
          class="w-full accent-yellow-400"
          @input="onBgVolume"
        />
        <span class="text-xs text-white/50 text-right">{{ bgVolume }}%</span>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-xs">Sword attack</label>
        <input
          type="range"
          min="0"
          max="100"
          :value="swordVolume"
          class="w-full accent-yellow-400"
          @input="onSwordVolume"
        />
        <span class="text-xs text-white/50 text-right">{{ swordVolume }}%</span>
      </div>
    </div>

    <div
      v-if="dialogueOpen"
      class="fixed bottom-0 left-0 right-0 h-20 bg-white z-9999 flex items-center px-6 gap-4"
    >
      <div class="flex flex-col gap-1 flex-1">
        <span
          class="text-xs font-semibold uppercase tracking-wider"
          :class="
            dialogue[dialogueIndex]?.speaker === 'Omar'
              ? 'text-blue-400'
              : 'text-red-400'
          "
        >
          {{ dialogue[dialogueIndex]?.speaker }}
        </span>
        <p class="text-sm text-gray-800">{{ dialogue[dialogueIndex]?.line }}</p>
      </div>
      <span class="text-xs text-gray-400 shrink-0">
        {{
          dialogueIndex < dialogue.length - 1
            ? "Press K to continue"
            : "Press K to close"
        }}
      </span>
    </div>
  </div>
</template>
