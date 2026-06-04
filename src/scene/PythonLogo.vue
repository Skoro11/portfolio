<script setup lang="ts">
import { shallowRef, onMounted } from "vue";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";

defineProps<{ position?: [number, number, number]; scale?: number }>();

const meshes = shallowRef<
  { geo: THREE.ExtrudeGeometry; mat: THREE.MeshStandardMaterial }[]
>([]);

const texLoader = new THREE.TextureLoader();
const exrLoader = new EXRLoader();

const diffuse1 = texLoader.load("/textures/fine_grained_wood_col_1k.jpg");
const roughMap1 = texLoader.load("/textures/fine_grained_wood_rough_1k.jpg");
const normalMap1 = exrLoader.load("/textures/fine_grained_wood_nor_gl_1k.exr");

const diffuse2 = texLoader.load("/textures/plywood_diff_1k.jpg");
const roughMap2 = exrLoader.load("/textures/plywood_rough_1k.exr");
const normalMap2 = exrLoader.load("/textures/plywood_nor_gl_1k.exr");

const textureSets = [
  {
    map: diffuse1,
    normalMap: normalMap1,
    roughnessMap: roughMap1,
    color: "#aaaaaa",
  },
  {
    map: diffuse2,
    normalMap: normalMap2,
    roughnessMap: roughMap2,
    color: "#ffffff",
  },
];

const extrudeSettings = {
  depth: 8,
  bevelEnabled: true,
  bevelThickness: 1,
  bevelSize: 1,
  bevelSegments: 3,
};

const fixUVs = (geo: THREE.ExtrudeGeometry) => {
  geo.computeBoundingBox();
  const { min, max } = geo.boundingBox!;
  const uv = geo.attributes.uv as THREE.BufferAttribute | undefined;
  if (!uv) return;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(
      i,
      (uv.getX(i) - min.x) / (max.x - min.x),
      (uv.getY(i) - min.y) / (max.y - min.y),
    );
  }
};

onMounted(() => {
  const loader = new SVGLoader();
  loader.load("/python-5.svg", (data) => {
    const result: typeof meshes.value = [];

    data.paths.forEach((path, i) => {
      SVGLoader.createShapes(path).forEach((shape) => {
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        fixUVs(geo);
        const t = textureSets[i % textureSets.length]!;
        const mat = new THREE.MeshStandardMaterial({
          map: t.map,
          normalMap: t.normalMap,
          roughnessMap: t.roughnessMap,
          color: t.color,
          metalness: 0,
        });
        result.push({ geo, mat });
      });
    });

    meshes.value = result;
  });
});
</script>

<template>
  <TresGroup
    :position="position ?? [0, 0, 0]"
    :scale="scale ?? 1"
    :rotation-x="Math.PI / 2"
  >
    <TresMesh
      v-for="(m, i) in meshes"
      :key="i"
      :geometry="m.geo"
      :material="m.mat"
      :position="[0, 0, 0]"
    />
  </TresGroup>
</template>
