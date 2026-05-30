<script setup lang="ts">
import { TresCanvas, useTres } from "@tresjs/core";
import { ref, computed, shallowRef, watch } from "vue";
import { OrbitControls } from "@tresjs/cientos";
import * as THREE from "three";
import Fahrwerkstraeger from "./Fahrwerkstraeger.vue";
import Laufkatze from "./Laufkatze.vue";
import Haupttraeger from "./Haupttraeger.vue";
import DirectionalPad from "@/components/shared/DirectionalPad.vue";

const rotationY = ref(0);
const rotationZ = ref(0);

// Haupttraeger (main beam) length in meters
const balkenLength = ref(18.5);
const balkenPosition = 0; // Centered at origin

// Blue box position (can be moved left/right)
const blueBoxPosition = ref(0);
let moveInterval: number | null = null;

// Crane position along Z-axis (forward/backward on railways)
const cranePositionZ = ref(0);
let moveZInterval: number | null = null;

// Rope length (how far the hook hangs down)
const ropeLength = ref(5);

// Move blue box left/right (50mm per step = 0.05 units)
const moveLeft = () => {
  const minPosition = -(balkenLength.value / 2 - 1 - 0.5);
  blueBoxPosition.value = Math.max(minPosition, blueBoxPosition.value - 0.05);
};

const moveRight = () => {
  const maxPosition = balkenLength.value / 2 - 1 - 0.5;
  blueBoxPosition.value = Math.min(maxPosition, blueBoxPosition.value + 0.05);
};

// Move crane forward/backward on railways
const moveForward = () => {
  // Rails span from -fahrwerkstraegerLength*2 to +fahrwerkstraegerLength*2
  // Fahrwerkstraeger edge at cranePositionZ + fahrwerkstraegerLength/2
  // Must stay: cranePositionZ + fahrwerkstraegerLength/2 <= fahrwerkstraegerLength*2
  const maxPositionZ = fahrwerkstraegerLength.value * 1.5; // 2 - 0.5
  cranePositionZ.value = Math.min(maxPositionZ, cranePositionZ.value + 0.1);
};

const moveBackward = () => {
  // Fahrwerkstraeger edge at cranePositionZ - fahrwerkstraegerLength/2
  // Must stay: cranePositionZ - fahrwerkstraegerLength/2 >= -fahrwerkstraegerLength*2
  const minPositionZ = -fahrwerkstraegerLength.value * 1.5; // -2 + 0.5
  cranePositionZ.value = Math.max(minPositionZ, cranePositionZ.value - 0.1);
};

// Start continuous movement
const startMoveLeft = () => {
  moveLeft();
  moveInterval = window.setInterval(moveLeft, 50);
};

const startMoveRight = () => {
  moveRight();
  moveInterval = window.setInterval(moveRight, 50);
};

const startMoveForward = () => {
  moveForward();
  moveZInterval = window.setInterval(moveForward, 50);
};

const startMoveBackward = () => {
  moveBackward();
  moveZInterval = window.setInterval(moveBackward, 50);
};

// Stop continuous movement
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

// Fahrwerkstraeger is 1/3 of main beam length
const fahrwerkstraegerLength = computed(() => balkenLength.value / 3);

// Laufkatze position input value (separate from actual position)
const laufkatzeInputValue = ref("");
let isUserTyping = false;

// Update input value whenever blueBoxPosition changes (only when not typing)
watch(blueBoxPosition, () => {
  if (!isUserTyping) {
    const positionFromLeft = blueBoxPosition.value - -balkenLength.value / 2;
    laufkatzeInputValue.value = Math.round(positionFromLeft * 1000).toString();
  }
});

// Initialize input value
const positionFromLeft = blueBoxPosition.value - -balkenLength.value / 2;
laufkatzeInputValue.value = Math.round(positionFromLeft * 1000).toString();

// Handle input changes
const updateLaufkatzePosition = () => {
  isUserTyping = true;
  const newValueMm = parseFloat(laufkatzeInputValue.value);

  // Ignore invalid values
  if (isNaN(newValueMm) || laufkatzeInputValue.value === "") {
    isUserTyping = false;
    return;
  }

  // Convert mm to meters and set position relative to left Fahrwerkstraeger
  const newPositionMeters = newValueMm / 1000;
  const absolutePosition = newPositionMeters + -balkenLength.value / 2;

  // Apply boundaries
  const minPosition = -(balkenLength.value / 2 - 1 - 0.5);
  const maxPosition = balkenLength.value / 2 - 1 - 0.5;
  blueBoxPosition.value = Math.max(
    minPosition,
    Math.min(maxPosition, absolutePosition),
  );

  isUserTyping = false;
};

// Calculate exact positions for Fahrwerkstraeger at both ends of the main beam
const fahrwerkstraegerRightPosition = computed(
  () => balkenPosition + balkenLength.value / 2,
);
const fahrwerkstraegerLeftPosition = computed(
  () => balkenPosition - balkenLength.value / 2,
);
</script>

<template>
  <div>
    <div class="mx-auto max-w-[1400px] space-y-8 p-6">
      <div
        class="relative h-[800px] w-full overflow-hidden rounded-lg border border-gray-200"
      >
        <!-- Crane Width Input - Top Left -->
        <div
          class="absolute top-4 left-4 z-10 flex flex-col gap-3 rounded-lg bg-white p-3 shadow-lg"
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
              @input="updateLaufkatzePosition"
              type="number"
              step="10"
              class="w-24 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <!-- Joystick Controls - Top Right -->
        <div
          class="absolute top-4 right-4 z-10 flex gap-3 rounded-lg bg-white p-3 shadow-lg"
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

        <TresCanvas clear-color="#e0e0e0">
          <TresPerspectiveCamera :position="[10, 10, 10]" :lookAt="[0, 0, 0]" />
          <OrbitControls />

          <!-- Crane structure (moveable along Z-axis on rails) -->
          <TresGroup :position="[0, 0, cranePositionZ]">
            <!-- Haupttraeger with schienes and triangles -->
            <Haupttraeger
              :balken-length="balkenLength"
              :rotation-y="rotationY"
              :rotation-z="rotationZ"
            />

            <!-- Laufkatze (moveable trolley with rope and hook) -->
            <Laufkatze
              :position="[blueBoxPosition, -0.5, 0]"
              :rope-length="ropeLength"
            />

            <!-- Fahrwerkstraeger RIGHT -->
            <Fahrwerkstraeger
              :position="[fahrwerkstraegerRightPosition, 0, 0]"
              :length="fahrwerkstraegerLength"
            />

            <!-- Fahrwerkstraeger LEFT -->
            <Fahrwerkstraeger
              :position="[fahrwerkstraegerLeftPosition, 0, 0]"
              :length="fahrwerkstraegerLength"
            />
          </TresGroup>

          <!-- Floor underneath the crane -->
          <TresGroup :position="[0, -15, 0]">
            <TresMesh>
              <TresBoxGeometry
                :args="[balkenLength + 10, 0.5, fahrwerkstraegerLength * 5]"
              />
              <TresMeshBasicMaterial color="#d0d0d0" />
            </TresMesh>
            <TresLineSegments>
              <TresEdgesGeometry
                :args="[
                  new THREE.BoxGeometry(
                    balkenLength + 10,
                    0.5,
                    fahrwerkstraegerLength * 5,
                  ),
                ]"
              />
              <TresLineBasicMaterial color="black" />
            </TresLineSegments>
          </TresGroup>

          <!-- Rails/Tracks for crane to drive on (4x longer than Fahrwerkstraeger) -->
          <!-- Right rail (connects RIGHT Fahrwerkstraeger wheels) -->
          <TresGroup :position="[fahrwerkstraegerRightPosition, -0.85, 0]">
            <TresMesh>
              <TresBoxGeometry :args="[0.3, 0.3, fahrwerkstraegerLength * 4]" />
              <TresMeshBasicMaterial color="silver" />
            </TresMesh>
            <TresLineSegments>
              <TresEdgesGeometry
                :args="[
                  new THREE.BoxGeometry(0.3, 0.3, fahrwerkstraegerLength * 4),
                ]"
              />
              <TresLineBasicMaterial color="black" />
            </TresLineSegments>
          </TresGroup>

          <!-- Left rail (connects LEFT Fahrwerkstraeger wheels) -->
          <TresGroup :position="[fahrwerkstraegerLeftPosition, -0.85, 0]">
            <TresMesh>
              <TresBoxGeometry :args="[0.3, 0.3, fahrwerkstraegerLength * 4]" />
              <TresMeshBasicMaterial color="silver" />
            </TresMesh>
            <TresLineSegments>
              <TresEdgesGeometry
                :args="[
                  new THREE.BoxGeometry(0.3, 0.3, fahrwerkstraegerLength * 4),
                ]"
              />
              <TresLineBasicMaterial color="black" />
            </TresLineSegments>
          </TresGroup>
        </TresCanvas>
      </div>
    </div>
  </div>
</template>
