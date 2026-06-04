<script setup lang="ts">
import * as THREE from "three";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";

const texLoader = new THREE.TextureLoader();
const exrLoader = new EXRLoader();

const diffuse = texLoader.load("/textures/textures/plywood_diff_1k.jpg");
const normalMap = exrLoader.load("/textures/textures/plywood_nor_gl_1k.exr");
const roughMap = exrLoader.load("/textures/textures/plywood_rough_1k.exr");

const outerDiffuse = texLoader.load("/textures/textures/fine_grained_wood_col_1k.jpg");
const outerNormalMap = exrLoader.load("/textures/textures/fine_grained_wood_nor_gl_1k.exr");
const outerRoughMap = texLoader.load("/textures/textures/fine_grained_wood_rough_1k.jpg");

const extrudeSettings = {
  depth: 0.3,
  bevelEnabled: true,
  bevelThickness: 0.08,
  bevelSize: 0.08,
  bevelSegments: 3,
};

// Outer dark V
const outerShape = new THREE.Shape();
outerShape.moveTo(-4, 2.5);
outerShape.lineTo(0, -3.88);
outerShape.lineTo(4, 2.5);
outerShape.lineTo(2.6, 2.5);
outerShape.lineTo(0, -1.8);
outerShape.lineTo(-2.6, 2.5);
outerShape.closePath();

// Inner lighter V
const innerShape = new THREE.Shape();
innerShape.moveTo(-2.6, 2.5);
innerShape.lineTo(0, -1.8);
innerShape.lineTo(2.6, 2.5);
innerShape.lineTo(1.6, 2.5);
innerShape.lineTo(0, 0);
innerShape.lineTo(-1.6, 2.5);
innerShape.closePath();

const fixUVs = (geo: THREE.ExtrudeGeometry) => {
  geo.computeBoundingBox();
  const { min, max } = geo.boundingBox!;
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i,
      (uv.getX(i) - min.x) / (max.x - min.x),
      (uv.getY(i) - min.y) / (max.y - min.y),
    );
  }
};

const outerGeo = new THREE.ExtrudeGeometry(outerShape, extrudeSettings);
const innerGeo = new THREE.ExtrudeGeometry(innerShape, extrudeSettings);
fixUVs(outerGeo);
fixUVs(innerGeo);

const darkWood = new THREE.MeshStandardMaterial({
  map: outerDiffuse,
  normalMap: outerNormalMap,
  roughnessMap: outerRoughMap,
  color: "#aaaaaa",
  metalness: 0,
});
const lightWood = new THREE.MeshStandardMaterial({
  map: diffuse,
  normalMap,
  roughnessMap: roughMap,
  color: "#ffffff",
  metalness: 0,
});

defineProps<{ position?: [number, number, number]; scale?: number }>();
</script>

<template>
  <TresGroup :position="position ?? [0, 0, 0]" :scale="scale ?? 1">
    <TresMesh :geometry="outerGeo" :material="darkWood" :position="[0, 1, 0]" />
    <TresMesh
      :geometry="innerGeo"
      :material="lightWood"
      :position="[0, 1, 0]"
    />
  </TresGroup>
</template>
