<script setup lang="ts">
import { ref, computed, watch } from "vue";
import * as THREE from "three";
import Fahrwerkstraeger from "./Fahrwerkstraeger.vue";
import Laufkatze from "./Laufkatze.vue";
import Haupttraeger from "./Haupttraeger.vue";
import DirectionalPad from "@/components/shared/DirectionalPad.vue";

const rotationY = ref(0);
const rotationZ = ref(0);

const balkenLength = ref(18.5);
const balkenPosition = 0;

const blueBoxPosition = ref(0);
let moveInterval: number | null = null;

const cranePositionZ = ref(0);
let moveZInterval: number | null = null;

const ropeLength = ref(5);

const moveLeft = () => {
  const minPosition = -(balkenLength.value / 2 - 1 - 0.5);
  blueBoxPosition.value = Math.max(minPosition, blueBoxPosition.value - 0.05);
};

const moveRight = () => {
  const maxPosition = balkenLength.value / 2 - 1 - 0.5;
  blueBoxPosition.value = Math.min(maxPosition, blueBoxPosition.value + 0.05);
};

const moveForward = () => {
  const maxPositionZ = fahrwerkstraegerLength.value * 1.5;
  cranePositionZ.value = Math.min(maxPositionZ, cranePositionZ.value + 0.1);
};

const moveBackward = () => {
  const minPositionZ = -fahrwerkstraegerLength.value * 1.5;
  cranePositionZ.value = Math.max(minPositionZ, cranePositionZ.value - 0.1);
};

const startMoveLeft = () => {
  moveLeft();
  moveInterval = globalThis.setInterval(moveLeft, 50);
};

const startMoveRight = () => {
  moveRight();
  moveInterval = globalThis.setInterval(moveRight, 50);
};

const startMoveForward = () => {
  moveForward();
  moveZInterval = globalThis.setInterval(moveForward, 50);
};

const startMoveBackward = () => {
  moveBackward();
  moveZInterval = globalThis.setInterval(moveBackward, 50);
};

const stopMove = () => {
  if (moveInterval !== null) {
    clearInterval(moveInterval);
    moveInterval = null;
  }
};

const stopMoveZ = () => {
  if (moveZInterval !== null) {
    clearInterval(moveZInterval);
    moveZInterval = null;
  }
};

const fahrwerkstraegerLength = computed(() => balkenLength.value / 3);

const laufkatzeInputValue = ref("");
let isUserTyping = false;

watch(blueBoxPosition, () => {
  if (!isUserTyping) {
    const positionFromLeft = blueBoxPosition.value - -balkenLength.value / 2;
    laufkatzeInputValue.value = Math.round(positionFromLeft * 1000).toString();
  }
});

const positionFromLeft = blueBoxPosition.value - -balkenLength.value / 2;
laufkatzeInputValue.value = Math.round(positionFromLeft * 1000).toString();

const updateLaufkatzePosition = () => {
  isUserTyping = true;
  const newValueMm = Number.parseFloat(laufkatzeInputValue.value);
  if (Number.isNaN(newValueMm) || laufkatzeInputValue.value === "") {
    isUserTyping = false;
    return;
  }
  const newPositionMeters = newValueMm / 1000;
  const absolutePosition = newPositionMeters + -balkenLength.value / 2;
  const minPosition = -(balkenLength.value / 2 - 1 - 0.5);
  const maxPosition = balkenLength.value / 2 - 1 - 0.5;
  blueBoxPosition.value = Math.max(
    minPosition,
    Math.min(maxPosition, absolutePosition),
  );
  isUserTyping = false;
};

const fahrwerkstraegerRightPosition = computed(
  () => balkenPosition + balkenLength.value / 2,
);
const fahrwerkstraegerLeftPosition = computed(
  () => balkenPosition - balkenLength.value / 2,
);
</script>

<template>
  <!-- HTML controls overlay — teleported to the container div in App.vue -->
  <Teleport to="#scene-overlay">
    <div
      class="absolute top-4 left-4 z-10 flex flex-col gap-3 rounded-lg bg-white p-3 shadow-lg pointer-events-auto"
    >
      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700">
          Spannweite (m)
        </label>
        <input
          v-model.number="balkenLength"
          type="number"
          min="14.5"
          max="50"
          step="0.5"
          class="w-24 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700">
          Laufkatze Position (mm)
        </label>
        <input
          v-model="laufkatzeInputValue"
          type="number"
          step="10"
          class="w-24 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
          @input="updateLaufkatzePosition"
        />
      </div>
    </div>

    <div
      class="absolute top-4 right-4 z-10 flex gap-3 rounded-lg bg-white p-3 shadow-lg pointer-events-auto"
    >
      <div class="flex flex-col items-center gap-1">
        <span class="font-medium text-gray-500">Laufkatze</span>
        <DirectionalPad
          axes="x"
          @left-start="startMoveLeft"
          @left-stop="stopMove"
          @right-start="startMoveRight"
          @right-stop="stopMove"
        />
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="font-medium text-gray-500">Kran</span>
        <DirectionalPad
          axes="y"
          @up-start="startMoveBackward"
          @up-stop="stopMoveZ"
          @down-start="startMoveForward"
          @down-stop="stopMoveZ"
        />
      </div>
    </div>
  </Teleport>

  <!-- Crane structure (moveable along Z-axis on rails) -->
  <TresGroup :position="[0, 0, cranePositionZ]">
    <Haupttraeger
      :balken-length="balkenLength"
      :rotation-y="rotationY"
      :rotation-z="rotationZ"
    />
    <Laufkatze :position="[blueBoxPosition, -0.5, 0]" :rope-length="ropeLength" />
    <Fahrwerkstraeger
      :position="[fahrwerkstraegerRightPosition, 0, 0]"
      :length="fahrwerkstraegerLength"
    />
    <Fahrwerkstraeger
      :position="[fahrwerkstraegerLeftPosition, 0, 0]"
      :length="fahrwerkstraegerLength"
    />
  </TresGroup>

  <!-- Rails fixed to the scene (crane moves along these) -->
  <TresGroup :position="[fahrwerkstraegerRightPosition, -0.85, 0]">
    <TresMesh>
      <TresBoxGeometry :args="[0.3, 0.3, fahrwerkstraegerLength * 4]" />
      <TresMeshBasicMaterial color="silver" />
    </TresMesh>
    <TresLineSegments>
      <TresEdgesGeometry
        :args="[new THREE.BoxGeometry(0.3, 0.3, fahrwerkstraegerLength * 4)]"
      />
      <TresLineBasicMaterial color="black" />
    </TresLineSegments>
  </TresGroup>

  <TresGroup :position="[fahrwerkstraegerLeftPosition, -0.85, 0]">
    <TresMesh>
      <TresBoxGeometry :args="[0.3, 0.3, fahrwerkstraegerLength * 4]" />
      <TresMeshBasicMaterial color="silver" />
    </TresMesh>
    <TresLineSegments>
      <TresEdgesGeometry
        :args="[new THREE.BoxGeometry(0.3, 0.3, fahrwerkstraegerLength * 4)]"
      />
      <TresLineBasicMaterial color="black" />
    </TresLineSegments>
  </TresGroup>
</template>
