<template>
  <div v-if="!isHidden">
    <div
      class="w-full py-4 px-6 rounded-2xl text-white"
      :class="[color, { 'col-span-2': span ? span : false }]"
    >
      <div v-if="isSelected">
        <mdicon name="close" @click="console.log('close emit');$emit('close')" />
      </div>

      <div>is selected {{isSelected}}</div>
      <div>is hidden {{isHidden}}</div>

      <div class="flex justify-between">
        <div>{{ heading }}</div>
        <mdicon :name="icon" />
      </div>

      <div>
        <!-- <component is-opened="isOpened"></component> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['icon', 'heading', 'color', 'span', 'isSelected', 'isHidden']);
const emit = defineEmits(['close']);
</script>
