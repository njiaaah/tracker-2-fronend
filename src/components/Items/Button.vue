<template>
  <button :type="type">
    <div
      :class="color"
      class="rounded-lg p-4 text-center w-full text-white"
    >
      {{ label ? label : 'button' }}
    </div>
  </button>
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
    },
    type: {
      type: String,
      default: 'text',
    },
    color: {
      type: String,
      default: 'bg-sky-500',
    }
  },
};
</script>
