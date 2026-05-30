<script setup lang="ts">
import * as THREE from "three";
</script>

<template>
  <TresGroup :position="[0, -15, 0]">
    <TresMesh>
      <TresBoxGeometry :args="[200, 0.5, 200]" />
      <TresMeshBasicMaterial color="#d0d0d0" />
    </TresMesh>
    <TresLineSegments>
      <TresEdgesGeometry :args="[new THREE.BoxGeometry(200, 0.5, 200)]" />
      <TresLineBasicMaterial color="#aaaaaa" />
    </TresLineSegments>
  </TresGroup>
</template>
