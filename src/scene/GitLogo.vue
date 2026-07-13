<script setup lang="ts">
import { shallowRef, onMounted } from "vue";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";

defineProps<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}>();

const meshes = shallowRef<
  {
    geo: THREE.ExtrudeGeometry;
    mat: THREE.Material;
    outline: boolean;
    posZ: number;
    rotZ?: number;
  }[]
>([]);

const texLoader = new THREE.TextureLoader();
const exrLoader = new EXRLoader();

const diffuse = texLoader.load("/textures/fine_grained_wood_col_1k.jpg");
const roughMap = texLoader.load("/textures/fine_grained_wood_rough_1k.jpg");
const normalMap = exrLoader.load("/textures/fine_grained_wood_nor_gl_1k.exr");
[diffuse, roughMap, normalMap].forEach((t) => {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(0.005, 0.005);
});

const outerDiffuse = texLoader.load("/textures/fine_grained_wood_col_1k.jpg");
const outerRough = texLoader.load("/textures/fine_grained_wood_rough_1k.jpg");
const outerNormal = exrLoader.load("/textures/fine_grained_wood_nor_gl_1k.exr");
[outerDiffuse, outerRough, outerNormal].forEach((t) => {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(0.005, 0.005);
});

const backDiffuse = texLoader.load("/textures/plywood_diff_1k.jpg");
backDiffuse.wrapS = backDiffuse.wrapT = THREE.RepeatWrapping;
backDiffuse.repeat.set(0.005, 0.005);

const mainMat = new THREE.MeshStandardMaterial({
  map: diffuse,
  normalMap,
  roughnessMap: roughMap,
  color: "#aaaaaa",
  metalness: 0,
});
const backMat = new THREE.MeshStandardMaterial({
  map: backDiffuse,
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

onMounted(() => {
  const loader = new SVGLoader();
  loader.load("/git-icon.svg", (data) => {
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

    const s = new THREE.Vector3();
    box.getSize(s);
    const w = ((s.x / Math.SQRT2) * 1.05) / 2;
    const h = ((s.y / Math.SQRT2) * 1.05) / 2;
    const r = Math.min(w, h) * 0.15;
    const roundedRect = new THREE.Shape();
    roundedRect.moveTo(-w + r, -h);
    roundedRect.lineTo(w - r, -h);
    roundedRect.quadraticCurveTo(w, -h, w, -h + r);
    roundedRect.lineTo(w, h - r);
    roundedRect.quadraticCurveTo(w, h, w - r, h);
    roundedRect.lineTo(-w + r, h);
    roundedRect.quadraticCurveTo(-w, h, -w, h - r);
    roundedRect.lineTo(-w, -h + r);
    roundedRect.quadraticCurveTo(-w, -h, -w + r, -h);
    const squareGeo = new THREE.ExtrudeGeometry(roundedRect, {
      depth: 8,
      bevelEnabled: false,
    });
    const backZ = s.z / 2 + 1;

    meshes.value = [
      {
        geo: squareGeo,
        mat: backMat as THREE.Material,
        outline: false,
        posZ: backZ,
        rotZ: Math.PI / 4,
      },
      ...geos.map((geo) => ({
        geo,
        mat: mainMat as THREE.Material,
        outline: false,
        posZ: 0,
      })),
      ...geos.map((geo) => ({
        geo,
        mat: outlineMat as THREE.Material,
        outline: true,
        posZ: 0,
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
      v-for="(m, i) in meshes"
      :key="i"
      :geometry="m.geo"
      :material="m.mat"
      :scale="m.outline ? 1.05 : 1"
      :position-z="m.posZ"
      :rotation-z="m.rotZ ?? 0"
    />
  </TresGroup>
</template>
