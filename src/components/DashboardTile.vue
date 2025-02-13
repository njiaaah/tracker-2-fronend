<template>
  <div v-if="!isHidden" class="">
    <div
      class="component grid h-full w-full items-start rounded-2xl px-6 py-4 text-white"
      :class="[color, { 'col-span-2': span ? span : false }]"
    >
      <slot name="header"></slot>

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
