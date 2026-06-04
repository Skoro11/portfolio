<script setup lang="ts">
import { useGLTF } from "@tresjs/cientos";
import * as THREE from "three";

const { state } = useGLTF("/models/Ship_Small.gltf");
const deg = (d: number) => THREE.MathUtils.degToRad(d);
</script>

<template>
  <primitive
    v-if="state"
    :object="state.scene"
    :position="[-240, -18, -0]"
    :scale="5"
    :rotation="[deg(0), deg(25), deg(0)]"
  />
</template>
