<template>
  <div>
    <slot name="header"> </slot>
    <slot name="default">
      <Loading v-if="!isLoaded" />
      <div v-else class="text-4xl font-bold">
        {{ caloriesToday }} / {{ goal }}
      </div>
    </slot>
    <slot name="full"></slot>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, watch } from 'vue';
import Loading from '../Icons/Loading.vue';

const props = defineProps(['goal', 'caloriesToday']);
const isLoaded = ref(true);

watch(
  () => props.caloriesToday,
  () => {
    console.log('caloriesToday changed');
    isLoaded.value = true;
  },
);
</script>
