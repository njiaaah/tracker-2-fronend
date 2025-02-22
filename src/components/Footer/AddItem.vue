<template>
  <div>
    <div
      class="relative grid h-18 w-18 items-center justify-center rounded-2xl"
      :class="color"
    >
      <mdicon v-if="isPlus" name="plus" class="absolute top-1.5 right-1.5 text-white" />
      <mdicon :name="icon ? icon : 'plus'" class="scale-125 text-white" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'c-add-item',
  props: {
    icon: String,
    color: String,
    isPlus: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style scoped></style>
