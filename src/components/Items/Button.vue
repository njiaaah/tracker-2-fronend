<template>
  <div>
    <div class="rounded-2xl border-1 border-gray-400 p-4 text-black">
      {{ label ? label : 'button' }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'c-btn',
  data() {
    return {};
  },
  props: {
    label: {
      type: String,
      default: 'button',
    }
  },
};
</script>
