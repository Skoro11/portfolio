<script setup lang="ts">
const props = defineProps<{
  axes: "x" | "y";
}>();

const emit = defineEmits<{
  "left-start": [];
  "left-stop": [];
  "right-start": [];
  "right-stop": [];
  "up-start": [];
  "up-stop": [];
  "down-start": [];
  "down-stop": [];
}>();
</script>

<template>
  <div class="flex items-center gap-1">
    <template v-if="props.axes === 'x'">
      <button
        class="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 select-none"
        @mousedown="emit('left-start')"
        @mouseup="emit('left-stop')"
        @mouseleave="emit('left-stop')"
        @touchstart.prevent="emit('left-start')"
        @touchend.prevent="emit('left-stop')"
      >
        ←
      </button>
      <button
        class="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 select-none"
        @mousedown="emit('right-start')"
        @mouseup="emit('right-stop')"
        @mouseleave="emit('right-stop')"
        @touchstart.prevent="emit('right-start')"
        @touchend.prevent="emit('right-stop')"
      >
        →
      </button>
    </template>

    <template v-else-if="props.axes === 'y'">
      <div class="flex flex-col gap-1">
        <button
          class="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 select-none"
          @mousedown="emit('up-start')"
          @mouseup="emit('up-stop')"
          @mouseleave="emit('up-stop')"
          @touchstart.prevent="emit('up-start')"
          @touchend.prevent="emit('up-stop')"
        >
          ↑
        </button>
        <button
          class="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 select-none"
          @mousedown="emit('down-start')"
          @mouseup="emit('down-stop')"
          @mouseleave="emit('down-stop')"
          @touchstart.prevent="emit('down-start')"
          @touchend.prevent="emit('down-stop')"
        >
          ↓
        </button>
      </div>
    </template>
  </div>
</template>
