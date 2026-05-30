<script setup lang="ts">
import { computed, shallowRef } from "vue";
import * as THREE from "three";

const props = defineProps<{
  balkenLength: number;
  rotationY?: number;
  rotationZ?: number;
}>();

const triangleWidth = 2;
const gapBetweenBeamAndTriangle = 0.01;

const topBeamLength = computed(() => props.balkenLength - 4.7);
const topBeamEndXRight = computed(() => topBeamLength.value / 2);
const trianglePositionXRight = computed(
  () => topBeamEndXRight.value + gapBetweenBeamAndTriangle + triangleWidth / 2,
);
const topBeamEndXLeft = computed(() => -topBeamLength.value / 2);
const trianglePositionXLeft = computed(
  () => topBeamEndXLeft.value - gapBetweenBeamAndTriangle - triangleWidth / 2,
);

const schieneTopEdgeGeometry = computed(() => {
  const hw = (props.balkenLength - 1) / 2;
  return new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-hw, 0.05, -0.51),
    new THREE.Vector3(hw, 0.05, -0.51),
    new THREE.Vector3(-hw, 0.05, 0.51),
    new THREE.Vector3(hw, 0.05, 0.51),
  ]);
});

const createTrianglePrismGeometry = (
  width: number,
  height: number,
  depth: number,
) => {
  const shape = new THREE.Shape();
  const offsetX = width / 2;
  const offsetY = height / 2;
  shape.moveTo(0 - offsetX, 0 - offsetY);
  shape.lineTo(width - offsetX, 0 - offsetY);
  shape.lineTo(0 - offsetX, height - offsetY);
  shape.lineTo(0 - offsetX, 0 - offsetY);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
  });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
};

const triangleGeometry = shallowRef(createTrianglePrismGeometry(2, 1, 1));
</script>

<template>
  <TresGroup>
    <!-- Main beam -->
    <TresGroup :rotation="[0, rotationY ?? 0, rotationZ ?? 0]">
      <TresMesh>
        <TresBoxGeometry :args="[balkenLength - 1, 1, 1]" />
        <TresMeshBasicMaterial color="orange" />
      </TresMesh>
    </TresGroup>

    <!-- Lower Schiene -->
    <TresGroup :position="[0, -0.45, 0]">
      <TresMesh>
        <TresBoxGeometry :args="[balkenLength, 0.1, 1.5]" />
        <TresMeshBasicMaterial color="orange" />
      </TresMesh>
      <TresLineSegments>
        <TresEdgesGeometry
          :args="[new THREE.BoxGeometry(balkenLength - 1, 0.1, 1.5)]"
        />
        <TresLineBasicMaterial color="black" />
      </TresLineSegments>
      <TresLineSegments :geometry="schieneTopEdgeGeometry">
        <TresLineBasicMaterial color="black" />
      </TresLineSegments>
    </TresGroup>

    <!-- Upper beam -->
    <TresGroup
      :position="[0, 1, 0]"
      :rotation="[0, rotationY ?? 0, rotationZ ?? 0]"
    >
      <TresMesh>
        <TresBoxGeometry :args="[topBeamLength, 1, 1]" />
        <TresMeshBasicMaterial color="orange" />
      </TresMesh>
    </TresGroup>

    <!-- Upper Schiene -->
    <TresGroup :position="[0, 1.55, 0]">
      <TresMesh>
        <TresBoxGeometry :args="[topBeamLength, 0.1, 1.5]" />
        <TresMeshBasicMaterial color="orange" />
      </TresMesh>
      <TresLineSegments>
        <TresEdgesGeometry
          :args="[new THREE.BoxGeometry(topBeamLength, 0.1, 1.5)]"
        />
        <TresLineBasicMaterial color="black" />
      </TresLineSegments>
    </TresGroup>

    <!-- Right triangle -->
    <TresGroup :position="[trianglePositionXRight, 1, 0]">
      <TresMesh :geometry="triangleGeometry">
        <TresMeshBasicMaterial color="orange" />
      </TresMesh>
    </TresGroup>
    <!-- Triangle Schiene (right) -->
    <TresGroup
      :position="[trianglePositionXRight, 1 + (0.05 * 2) / Math.sqrt(5), 0]"
      :rotation="[0, 0, Math.atan2(-1, 2)]"
    >
      <TresMesh>
        <TresBoxGeometry :args="[Math.sqrt(5), 0.1, 1.5]" />
        <TresMeshBasicMaterial color="orange" />
      </TresMesh>
      <TresLineSegments>
        <TresEdgesGeometry
          :args="[new THREE.BoxGeometry(Math.sqrt(5), 0.1, 1.5)]"
        />
        <TresLineBasicMaterial color="black" />
      </TresLineSegments>
    </TresGroup>

    <!-- Left triangle -->
    <TresGroup
      :position="[trianglePositionXLeft, 1, 0]"
      :rotation="[0, Math.PI, 0]"
    >
      <TresMesh :geometry="triangleGeometry">
        <TresMeshBasicMaterial color="orange" />
      </TresMesh>
    </TresGroup>
    <!-- Triangle Schiene (left) -->
    <TresGroup
      :position="[trianglePositionXLeft, 1 + (0.05 * 2) / Math.sqrt(5), 0]"
      :rotation="[0, 0, Math.atan2(1, 2)]"
    >
      <TresMesh>
        <TresBoxGeometry :args="[Math.sqrt(5), 0.1, 1.5]" />
        <TresMeshBasicMaterial color="orange" />
      </TresMesh>
      <TresLineSegments>
        <TresEdgesGeometry
          :args="[new THREE.BoxGeometry(Math.sqrt(5), 0.1, 1.5)]"
        />
        <TresLineBasicMaterial color="black" />
      </TresLineSegments>
    </TresGroup>
  </TresGroup>
</template>
