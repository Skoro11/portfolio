<script setup lang="ts">
import * as THREE from 'three'

defineProps<{
  position: [number, number, number]
  ropeLength: number
}>()
</script>

<template>
  <TresGroup :position="position">
    <TresMesh>
      <TresBoxGeometry :args="[2, 1, 2.5]" />
      <TresMeshBasicMaterial color="blue" />
    </TresMesh>
    <TresLineSegments>
      <TresEdgesGeometry :args="[new THREE.BoxGeometry(2, 1, 2.5)]" />
      <TresLineBasicMaterial color="black" />
    </TresLineSegments>

    <!-- Rope -->
    <TresMesh :position="[0, -ropeLength / 2 - 0.5, 0]">
      <TresCylinderGeometry :args="[0.05, 0.05, ropeLength, 8]" />
      <TresMeshBasicMaterial color="#333333" />
    </TresMesh>

    <!-- Hook -->
    <TresGroup :position="[0, -ropeLength - 0.5, 0]">
      <TresMesh :position="[0, -0.3, 0]">
        <TresCylinderGeometry :args="[0.1, 0.1, 0.6, 8]" />
        <TresMeshBasicMaterial color="#FFD700" />
      </TresMesh>
      <TresMesh :position="[0, -0.6, 0]" :rotation="[0, 0, Math.PI / 2]">
        <TresTorusGeometry :args="[0.3, 0.1, 8, 16, Math.PI]" />
        <TresMeshBasicMaterial color="#FFD700" />
      </TresMesh>
    </TresGroup>
  </TresGroup>
</template>
