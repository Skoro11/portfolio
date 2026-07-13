<script setup lang="ts">
import { shallowRef, onMounted } from "vue";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

defineProps<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}>();

const meshes = shallowRef<
  { geo: THREE.ExtrudeGeometry; mat: THREE.Material; outline: boolean }[]
>([]);

const texLoader = new THREE.TextureLoader();
const exrLoader = new EXRLoader();

const diffuse = texLoader.load("/textures/plywood_diff_1k.jpg");
diffuse.wrapS = diffuse.wrapT = THREE.RepeatWrapping;
diffuse.repeat.set(0.005, 0.005);

const outerDiffuse = texLoader.load("/textures/fine_grained_wood_col_1k.jpg");
const outerRough = texLoader.load("/textures/fine_grained_wood_rough_1k.jpg");
const outerNormal = exrLoader.load("/textures/fine_grained_wood_nor_gl_1k.exr");
outerDiffuse.wrapS = outerDiffuse.wrapT = THREE.RepeatWrapping;
outerRough.wrapS = outerRough.wrapT = THREE.RepeatWrapping;
outerNormal.wrapS = outerNormal.wrapT = THREE.RepeatWrapping;
outerDiffuse.repeat.set(0.005, 0.005);
outerRough.repeat.set(0.005, 0.005);
outerNormal.repeat.set(0.005, 0.005);

const mainMat = new THREE.MeshStandardMaterial({
  map: diffuse,
  color: "#ffffff",
  roughness: 0.9,
  metalness: 0,
});
const outlineMat = new THREE.MeshStandardMaterial({
  map: outerDiffuse,
  normalMap: outerNormal,
  roughnessMap: outerRough,
  color: "#aaaaaa",
  side: THREE.BackSide,
  metalness: 0,
});
const tableGeo = shallowRef<RoundedBoxGeometry | null>(null);
const tableDiffuse = texLoader.load("/textures/fine_grained_wood_col_1k.jpg");
const tableRough = texLoader.load("/textures/fine_grained_wood_rough_1k.jpg");
const tableNormal = exrLoader.load("/textures/fine_grained_wood_nor_gl_1k.exr");
[tableDiffuse, tableRough, tableNormal].forEach((t) => {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(6, 6);
});
const tableMat = new THREE.MeshStandardMaterial({
  map: tableDiffuse,
  normalMap: tableNormal,
  roughnessMap: tableRough,
  color: "#cccccc",
  metalness: 0,
});

onMounted(() => {
  const loader = new SVGLoader();
  loader.load("/tailwind-css-2.svg", (data) => {
    const geos: THREE.ExtrudeGeometry[] = [];

    data.paths.forEach((path) => {
      SVGLoader.createShapes(path).forEach((shape) => {
        geos.push(
          new THREE.ExtrudeGeometry(shape, { depth: 8, bevelEnabled: false }),
        );
      });
    });

    const box = new THREE.Box3();
    geos.forEach((g) => {
      g.computeBoundingBox();
      box.union(g.boundingBox!);
    });
    const center = new THREE.Vector3();
    box.getCenter(center);
    geos.forEach((g) => g.translate(-center.x, -center.y, -center.z));

    const size = new THREE.Vector3();
    box.getSize(size);
    const side = Math.max(size.x, size.y) * 1.4;
    const r = side * 0.15;
    tableGeo.value = new RoundedBoxGeometry(side, side, 60, 6, r);

    meshes.value = [
      ...geos.map((geo) => ({
        geo,
        mat: mainMat as THREE.Material,
        outline: false,
      })),
      ...geos.map((geo) => ({
        geo,
        mat: outlineMat as THREE.Material,
        outline: true,
      })),
    ];
  });
});
</script>

<template>
  <TresGroup
    :position="position ?? [0, 0, 0]"
    :scale="scale ?? 1"
    :rotation="rotation ?? [0, Math.PI, Math.PI]"
  >
    <TresMesh
      v-if="tableGeo"
      :geometry="tableGeo"
      :material="tableMat"
      :position="[0, 0, -34]"
    />

    <TresGroup :scale="1.2">
      <TresMesh
        v-for="(m, i) in meshes"
        :key="i"
        :geometry="m.geo"
        :material="m.mat"
        :scale="m.outline ? 1.05 : 1"
      />
    </TresGroup>
  </TresGroup>
</template>
