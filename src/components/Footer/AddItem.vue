<template>
  <div>
    <div
      class="relative grid h-18 w-18 items-center justify-center rounded-2xl"
      :class="color"
    >
      <mdicon name="plus" class="absolute top-1.5 right-1.5 text-white" />
      <mdicon :name="icon ? icon : 'plus'" class="scale-125 text-white" />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps(['icon', 'color']);
</script>
