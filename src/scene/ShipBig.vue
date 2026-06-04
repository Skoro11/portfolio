<script setup lang="ts">
import { useGLTF } from "@tresjs/cientos";
import * as THREE from "three";

const { state } = useGLTF("/models/Ship_Large.gltf");
const deg = (d: number) => THREE.MathUtils.degToRad(d);
</script>

<template>
  <primitive
    v-if="state"
    :object="state.scene"
    :position="[250, -8, -220]"
    :scale="13"
    :rotation="[deg(0), deg(-50), deg(0)]"
  />
</template>
