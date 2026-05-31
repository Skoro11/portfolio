<script setup lang="ts">
import { useLoop } from "@tresjs/core";

const RADIUS     = 225;
const MAX_HEIGHT = 12;

const vertexShader = /* glsl */`
  varying float vDist;
  varying float vElevation;

  void main() {
    float dist = length(position.xy) / ${RADIUS}.0;
    vDist = dist;

    // Smooth dome: peaks at center, 0 at edge
    float dome = max(0.0, 1.0 - dist * dist) * ${MAX_HEIGHT}.0;
    vElevation = dome;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, dome, 1.0);
  }
`;

const fragmentShader = /* glsl */`
  varying float vDist;
  varying float vElevation;
  uniform float uTime;

  void main() {
    if (vDist > 1.0) discard;

    vec3 sand  = vec3(0.92, 0.84, 0.60);
    vec3 grass = vec3(0.28, 0.58, 0.18);
    vec3 peak  = vec3(0.38, 0.68, 0.22);

    float t = smoothstep(0.0, 6.0, vElevation);
    vec3 color = mix(sand, grass, t);
    color = mix(color, peak, smoothstep(8.0, 12.0, vElevation));

    gl_FragColor = vec4(color, 1.0);
  }
`;

const uniforms = { uTime: { value: 0 } };
const { onBeforeRender } = useLoop();
onBeforeRender(({ elapsed }) => { uniforms.uTime.value = elapsed; });
</script>

<template>
  <TresMesh :position="[0, -15, 0]" :rotation-x="-Math.PI / 2">
    <TresPlaneGeometry :args="[500, 500, 150, 150]" />
    <TresShaderMaterial
      :vertex-shader="vertexShader"
      :fragment-shader="fragmentShader"
      :uniforms="uniforms"
      :transparent="true"
    />
  </TresMesh>
</template>
