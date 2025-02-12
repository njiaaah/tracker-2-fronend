<template>
  <div v-if="!isHidden" class="">
    <div
      class="w-full py-4 px-6 rounded-2xl h-full text-white"
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

const props = defineProps(['icon', 'heading', 'color', 'span', 'isSelected', 'isHidden']);
const emit = defineEmits(['close']);
</script>
