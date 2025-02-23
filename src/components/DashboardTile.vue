<template>
  <div
    class="component dark:bg-gray-900  grid h-full 
    w-full items-start rounded-2xl px-4 py-4 text-gray-200 ring-1"
    :class="color ? { [color]: true } : {}"
  >
    <slot name="header"></slot>

    <div class="text-gray-600 h-full">
      <slot name="default" :color="color">
  </slot>

      <slot name="full"></slot>
    </div>
  </div>
</template>

<script setup>
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
