<template>
  <div>
    <div class="bg-sky-500 text-white rounded-lg p-4 text-center w-full ">
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
