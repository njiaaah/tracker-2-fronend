<template>

  <div class="w-full py-4 px-6 rounded-2xl text-white" :class="[color, { 'col-span-2': span }]" >
    <div class="flex justify-between">
      <div>{{ props.heading }}</div>
      <mdicon :name="props.icon" />
    </div>

    <div>
      <component :is="props.componentName"></component>
    </div>

    <div>
      
    </div>
  </div>
 
</template>

<script setup>

import { defineProps } from 'vue'

const props = defineProps(['icon', 'heading', 'color', 'componentName', 'span']);



</script>

