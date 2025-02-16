<template>
  <div
    class="align-center flex w-fit shrink grow items-center justify-between 
    gap-4 rounded-lg overflow-clip *:px-3 *:py-1.5 border-1 border-gray-400"
  >
    <div class="h-fit text-[14px] font-bold lowercase opacity-75">
      <slot name="label">
        {{ label }}
      </slot>
    </div>

    <div class="text-md font-extrabold opacity-100 bg-amber-200 text-gray-600">
      <slot name="append">
        {{ cal }}
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Badge',
  data() {
    return {};
  },
  props: {
    label: {
      type: String,
      default: 'badge',
    },
    cal: {
      type: Number,
      default: '100',
    },
  },
};
</script>

<style>

</style>