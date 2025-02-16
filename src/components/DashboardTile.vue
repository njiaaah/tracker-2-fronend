<template>
  <div
    class="component via-slate-000 to-slate-000 grid h-full 
    w-full items-start rounded-2xl px-4 py-4 text-gray-600 ring-1 ring-gray-300"
    :class="color ? { [color]: true } : {}"
  >
    <slot name="header"></slot>

    <div class="text-gray-600 h-full">
      <slot name="default"></slot>

      <slot name="full"></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps([
  'icon',
  'heading',
  'color',
  'span',
  'isSelected',
  'isHidden',
  'weightSelected',
]);
const emit = defineEmits(['close']);
</script>

<style scoped>
.component {
  grid-template-rows: auto 1fr;
}
</style>
