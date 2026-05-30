<script setup lang="ts">
import * as THREE from 'three'

const props = defineProps<{
  position: [number, number, number]
  length: number
}>()
</script>

<template>
  <TresGroup :position="position">
    <!-- Beam -->
    <TresGroup :rotation="[0, Math.PI / 2, 0]">
      <TresMesh>
        <TresBoxGeometry :args="[props.length, 1, 1]" />
        <TresMeshBasicMaterial color="orange" />
      </TresMesh>
      <TresLineSegments>
        <TresEdgesGeometry :args="[new THREE.BoxGeometry(props.length, 1, 1)]" />
        <TresLineBasicMaterial color="black" />
      </TresLineSegments>
    </TresGroup>

    <!-- Wheel front -->
    <TresGroup :position="[0, -0.3, props.length / 2 - 0.5]" :rotation="[0, 0, Math.PI / 2]">
      <TresMesh>
        <TresCylinderGeometry :args="[0.4, 0.4, 0.3, 16]" />
        <TresMeshBasicMaterial color="orange" />
      </TresMesh>
      <TresLineSegments>
        <TresEdgesGeometry :args="[new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16)]" />
        <TresLineBasicMaterial color="black" />
      </TresLineSegments>
    </TresGroup>

    <!-- Wheel back -->
    <TresGroup :position="[0, -0.3, -(props.length / 2 - 0.5)]" :rotation="[0, 0, Math.PI / 2]">
      <TresMesh>
        <TresCylinderGeometry :args="[0.4, 0.4, 0.3, 16]" />
        <TresMeshBasicMaterial color="orange" />
      </TresMesh>
      <TresLineSegments>
        <TresEdgesGeometry :args="[new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16)]" />
        <TresLineBasicMaterial color="black" />
      </TresLineSegments>
    </TresGroup>
  </TresGroup>
</template>
